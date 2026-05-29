/**
 * PERFUMUM — Rapport 21
 * Routeur tRPC : Bibliothèque de requêtes SPARQL sauvegardées
 * ============================================================
 * Procédures :
 *   save          — Sauvegarder une requête SPARQL avec titre/notes/tags
 *   remove        — Supprimer une requête sauvegardée
 *   list          — Liste paginée avec filtres (catégorie, endpoint, tags, recherche)
 *   getById       — Récupérer une requête par son ID
 *   updateNotes   — Mettre à jour notes, tags, titre
 *   toggleFavorite — Épingler/désépingler une requête
 *   recordExecution — Enregistrer une exécution (résultats, durée)
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import mysql from "mysql2/promise";

// ─── Helpers DB ──────────────────────────────────────────────────────────────

async function getConn() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

// ─── Routeur ─────────────────────────────────────────────────────────────────

export const sparqlSavedQueriesRouter = router({

  // ── Sauvegarder une requête ──────────────────────────────────────────────
  save: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      sparqlQuery: z.string().min(1),
      notes: z.string().optional(),
      tags: z.string().optional(),
      category: z.enum(["molecule", "plant", "artwork", "temporal", "genealogy", "free", "europeana", "internal"]).default("free"),
      endpoint: z.enum(["wikidata", "europeana-edm", "internal"]).default("wikidata"),
      linkedEntityType: z.enum(["molecule", "plant", "recette"]).optional(),
      linkedEntityId: z.number().optional(),
      linkedEntityName: z.string().optional(),
      injectedQid: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const [result] = await conn.query<mysql.ResultSetHeader>(
          `INSERT INTO sparql_saved_queries
            (title, sparql_query, notes, tags, category, endpoint,
             linked_entity_type, linked_entity_id, linked_entity_name, injected_qid)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            input.title,
            input.sparqlQuery,
            input.notes ?? null,
            input.tags ?? null,
            input.category,
            input.endpoint,
            input.linkedEntityType ?? null,
            input.linkedEntityId ?? null,
            input.linkedEntityName ?? null,
            input.injectedQid ?? null,
          ]
        );
        return { id: result.insertId, success: true };
      } finally {
        await conn.end();
      }
    }),

  // ── Supprimer une requête ────────────────────────────────────────────────
  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        await conn.query("DELETE FROM sparql_saved_queries WHERE id = ?", [input.id]);
        return { success: true };
      } finally {
        await conn.end();
      }
    }),

  // ── Liste paginée avec filtres ───────────────────────────────────────────
  list: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(50).default(20),
      category: z.string().optional(),
      endpoint: z.string().optional(),
      search: z.string().optional(),
      favoritesOnly: z.boolean().optional(),
      linkedEntityType: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const conditions: string[] = [];
        const params: unknown[] = [];

        if (input.category && input.category !== "all") {
          conditions.push("category = ?");
          params.push(input.category);
        }
        if (input.endpoint && input.endpoint !== "all") {
          conditions.push("endpoint = ?");
          params.push(input.endpoint);
        }
        if (input.favoritesOnly) {
          conditions.push("is_favorite = 1");
        }
        if (input.linkedEntityType) {
          conditions.push("linked_entity_type = ?");
          params.push(input.linkedEntityType);
        }
        if (input.search) {
          conditions.push("(title LIKE ? OR notes LIKE ? OR tags LIKE ?)");
          const like = `%${input.search}%`;
          params.push(like, like, like);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const offset = (input.page - 1) * input.pageSize;

        const [countRows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM sparql_saved_queries ${where}`,
          params
        );
        const total = (countRows[0] as any).total as number;

        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT id, title, notes, tags, category, endpoint,
                  linked_entity_type, linked_entity_id, linked_entity_name,
                  injected_qid, last_result_count, last_execution_ms,
                  execution_count, is_favorite, created_at, updated_at, last_executed_at
           FROM sparql_saved_queries
           ${where}
           ORDER BY is_favorite DESC, updated_at DESC
           LIMIT ? OFFSET ?`,
          [...params, input.pageSize, offset]
        );

        return {
          items: rows,
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
        };
      } finally {
        await conn.end();
      }
    }),

  // ── Récupérer une requête complète par ID ────────────────────────────────
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT * FROM sparql_saved_queries WHERE id = ? LIMIT 1",
          [input.id]
        );
        return rows[0] ?? null;
      } finally {
        await conn.end();
      }
    }),

  // ── Mettre à jour titre, notes, tags ────────────────────────────────────
  updateNotes: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      notes: z.string().optional(),
      tags: z.string().optional(),
      linkedEntityType: z.enum(["molecule", "plant", "recette"]).nullable().optional(),
      linkedEntityId: z.number().nullable().optional(),
      linkedEntityName: z.string().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        const sets: string[] = ["updated_at = NOW()"];
        const params: unknown[] = [];

        if (input.title !== undefined) { sets.push("title = ?"); params.push(input.title); }
        if (input.notes !== undefined) { sets.push("notes = ?"); params.push(input.notes); }
        if (input.tags !== undefined) { sets.push("tags = ?"); params.push(input.tags); }
        if (input.linkedEntityType !== undefined) { sets.push("linked_entity_type = ?"); params.push(input.linkedEntityType); }
        if (input.linkedEntityId !== undefined) { sets.push("linked_entity_id = ?"); params.push(input.linkedEntityId); }
        if (input.linkedEntityName !== undefined) { sets.push("linked_entity_name = ?"); params.push(input.linkedEntityName); }

        params.push(input.id);
        await conn.query(
          `UPDATE sparql_saved_queries SET ${sets.join(", ")} WHERE id = ?`,
          params
        );
        return { success: true };
      } finally {
        await conn.end();
      }
    }),

  // ── Épingler / désépingler ───────────────────────────────────────────────
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        await conn.query(
          "UPDATE sparql_saved_queries SET is_favorite = IF(is_favorite = 1, 0, 1), updated_at = NOW() WHERE id = ?",
          [input.id]
        );
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT is_favorite FROM sparql_saved_queries WHERE id = ?",
          [input.id]
        );
        return { isFavorite: (rows[0] as any)?.is_favorite === 1 };
      } finally {
        await conn.end();
      }
    }),

  // ── Enregistrer une exécution (résultats, durée) ─────────────────────────
  recordExecution: protectedProcedure
    .input(z.object({
      id: z.number(),
      resultCount: z.number(),
      executionMs: z.number(),
    }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
        await conn.query(
          `UPDATE sparql_saved_queries
           SET execution_count = execution_count + 1,
               last_result_count = ?,
               last_execution_ms = ?,
               last_executed_at = NOW(),
               updated_at = NOW()
           WHERE id = ?`,
          [input.resultCount, input.executionMs, input.id]
        );
        return { success: true };
      } finally {
        await conn.end();
      }
    }),

  // ── Statistiques de la bibliothèque ─────────────────────────────────────
  stats: publicProcedure.query(async () => {
    const conn = await getConn();
    try {
      const [totalRows] = await conn.query<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) as total, SUM(is_favorite) as favorites, SUM(execution_count) as totalExecutions FROM sparql_saved_queries"
      );
      const [byCategory] = await conn.query<mysql.RowDataPacket[]>(
        "SELECT category, COUNT(*) as count FROM sparql_saved_queries GROUP BY category ORDER BY count DESC"
      );
      const [byEndpoint] = await conn.query<mysql.RowDataPacket[]>(
        "SELECT endpoint, COUNT(*) as count FROM sparql_saved_queries GROUP BY endpoint ORDER BY count DESC"
      );
      const stats = totalRows[0] as any;
      return {
        total: stats.total as number,
        favorites: (stats.favorites ?? 0) as number,
        totalExecutions: (stats.totalExecutions ?? 0) as number,
        byCategory: byCategory as Array<{ category: string; count: number }>,
        byEndpoint: byEndpoint as Array<{ endpoint: string; count: number }>,
      };
    } finally {
      await conn.end();
    }
  }),
});
