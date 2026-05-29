/**
 * Procédures SPARQL QID — Rapport 12
 * Recherche d'entités avec QID, catalogue, injection dans templates
 */
import { z } from "zod";
import mysql from "mysql2/promise";
import { publicProcedure, router } from "../_core/trpc";

export const sparqlQidRouter = router({
  /**
   * Recherche d'entités PERFUMUM avec QID (autocomplete)
   */
  searchEntitiesWithQid: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(100),
      entityType: z.enum(["all", "molecule", "plant", "family"]).default("all"),
      onlyWithQid: z.boolean().default(false),
      limit: z.number().int().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const q = `%${input.query}%`;
        const results: Array<{ id: number; name: string; qid: string | null; type: string; extra: string | null }> = [];
        // limitVal est un entier validé par Zod (min:1, max:50) — interpolation directe sûre
        const limitVal = Math.floor(input.limit / (input.entityType === "all" ? 3 : 1));

        if (input.entityType === "all" || input.entityType === "molecule") {
          const qidFilter = input.onlyWithQid ? " AND wikidata_qid IS NOT NULL" : "";
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, wikidata_qid, cas_number FROM molecules WHERE (name LIKE ? OR cas_number LIKE ? OR iupac_name LIKE ?)${qidFilter} ORDER BY wikidata_qid IS NULL ASC, name ASC LIMIT ${limitVal}`,
            [q, q, q]
          );
          for (const r of rows) results.push({ id: r.id, name: r.name, qid: r.wikidata_qid ?? null, type: "molecule", extra: r.cas_number ?? null });
        }

        if (input.entityType === "all" || input.entityType === "plant") {
          const qidFilter = input.onlyWithQid ? " AND wikidata_qid IS NOT NULL" : "";
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, wikidata_qid, latin_name FROM plants WHERE (name LIKE ? OR latin_name LIKE ?)${qidFilter} ORDER BY wikidata_qid IS NULL ASC, name ASC LIMIT ${limitVal}`,
            [q, q]
          );
          for (const r of rows) results.push({ id: r.id, name: r.name, qid: r.wikidata_qid ?? null, type: "plant", extra: r.latin_name ?? null });
        }

        if (input.entityType === "all" || input.entityType === "family") {
          const qidFilter = input.onlyWithQid ? " AND wikidata_qid IS NOT NULL" : "";
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, wikidata_qid, description FROM chemical_families WHERE name LIKE ?${qidFilter} ORDER BY wikidata_qid IS NULL ASC, name ASC LIMIT ${limitVal}`,
            [q]
          );
          for (const r of rows) results.push({ id: r.id, name: r.name, qid: r.wikidata_qid ?? null, type: "family", extra: r.description ?? null });
        }

        return { results, total: results.length };
      } finally { await conn.end(); }
    }),

  /**
   * Catalogue complet des QIDs disponibles dans PERFUMUM
   */
  getQidCatalog: publicProcedure
    .input(z.object({
      entityType: z.enum(["all", "molecule", "plant", "family"]).default("all"),
      limit: z.number().int().min(1).max(200).default(50),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const catalog: Array<{ id: number; name: string; qid: string; type: string; extra: string | null }> = [];
        // perType est un entier validé par Zod (min:1, max:200) — interpolation directe sûre
        const perType = input.entityType === "all" ? Math.floor(input.limit / 3) : input.limit;

        if (input.entityType === "all" || input.entityType === "molecule") {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, wikidata_qid, cas_number FROM molecules WHERE wikidata_qid IS NOT NULL ORDER BY name ASC LIMIT ${perType}`,
            []
          );
          for (const r of rows) catalog.push({ id: r.id, name: r.name, qid: r.wikidata_qid, type: "molecule", extra: r.cas_number ?? null });
        }

        if (input.entityType === "all" || input.entityType === "plant") {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, wikidata_qid, latin_name FROM plants WHERE wikidata_qid IS NOT NULL ORDER BY name ASC LIMIT ${perType}`,
            []
          );
          for (const r of rows) catalog.push({ id: r.id, name: r.name, qid: r.wikidata_qid, type: "plant", extra: r.latin_name ?? null });
        }

        if (input.entityType === "all" || input.entityType === "family") {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, wikidata_qid, description FROM chemical_families WHERE wikidata_qid IS NOT NULL ORDER BY name ASC LIMIT ${perType}`,
            []
          );
          for (const r of rows) catalog.push({ id: r.id, name: r.name, qid: r.wikidata_qid, type: "family", extra: r.description ?? null });
        }

        const [statsRows] = await conn.execute<mysql.RowDataPacket[]>(`
          SELECT
            (SELECT COUNT(*) FROM molecules WHERE wikidata_qid IS NOT NULL) AS molecules_with_qid,
            (SELECT COUNT(*) FROM molecules) AS molecules_total,
            (SELECT COUNT(*) FROM plants WHERE wikidata_qid IS NOT NULL) AS plants_with_qid,
            (SELECT COUNT(*) FROM plants) AS plants_total,
            (SELECT COUNT(*) FROM chemical_families WHERE wikidata_qid IS NOT NULL) AS families_with_qid,
            (SELECT COUNT(*) FROM chemical_families) AS families_total
        `);
        const stats = statsRows[0] as Record<string, number>;

        return { catalog, stats };
      } finally { await conn.end(); }
    }),

  /**
   * Résout un QID : retourne l'entité PERFUMUM correspondante
   */
  resolveQid: publicProcedure
    .input(z.object({
      qid: z.string().regex(/^Q\d+$/),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const [molRows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, cas_number FROM molecules WHERE wikidata_qid = ? LIMIT 1", [input.qid]
        );
        const [plantRows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, latin_name FROM plants WHERE wikidata_qid = ? LIMIT 1", [input.qid]
        );
        const [famRows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name FROM chemical_families WHERE wikidata_qid = ? LIMIT 1", [input.qid]
        );

        if (molRows[0]) return { found: true, type: "molecule" as const, id: molRows[0].id, name: molRows[0].name, extra: molRows[0].cas_number ?? null };
        if (plantRows[0]) return { found: true, type: "plant" as const, id: plantRows[0].id, name: plantRows[0].name, extra: plantRows[0].latin_name ?? null };
        if (famRows[0]) return { found: true, type: "family" as const, id: famRows[0].id, name: famRows[0].name, extra: null };
        return { found: false, type: null, id: null, name: null, extra: null };
      } finally { await conn.end(); }
    }),
});
