/**
 * Routeur tRPC — Migration v3_references → bibliography_entries
 * Axe 1.4 — Rapport 7 PERFUMUM
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

// Mapping des types v3 → bibliography_entries
const TYPE_MAP: Record<string, string> = {
  article: "article",
  book: "book",
  chapter: "inbook",
  thesis: "thesis",
  conference_paper: "inproceedings",
  report: "techreport",
  website: "online",
  web_entry: "online",
  news: "misc",
  preprint: "misc",
  dataset: "dataset",
  software: "software",
  misc: "misc",
};

export const v3MigrationRouter = router({
  /**
   * Statistiques de migration : combien de v3_references sont déjà migrées,
   * combien restent à migrer, combien sont des doublons.
   */
  getMigrationStats: publicProcedure.query(async () => {
    const dbConn = await db.getDb();
    if (!dbConn) return { total: 0, migrated: 0, toMigrate: 0, duplicates: 0, deprecated: 0 };
    const { sql } = await import("drizzle-orm");

    const totalResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
      sql.raw("SELECT COUNT(*) as cnt FROM v3_references")
    );
    const total = Number((Array.isArray(totalResult) ? (totalResult[0] as Record<string, unknown>[])[0] : {}).cnt ?? 0);

    const deprecatedResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
      sql.raw("SELECT COUNT(*) as cnt FROM v3_references WHERE deprecated_at IS NOT NULL")
    );
    const deprecated = Number((Array.isArray(deprecatedResult) ? (deprecatedResult[0] as Record<string, unknown>[])[0] : {}).cnt ?? 0);

    const dupResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
      sql.raw(`
        SELECT COUNT(DISTINCT v3.id) as cnt
        FROM v3_references v3
        WHERE EXISTS (
          SELECT 1 FROM bibliography_entries be
          WHERE (be.doi = v3.doi AND v3.doi IS NOT NULL)
             OR be.entry_key = v3.entry_key
        )
      `)
    );
    const duplicates = Number((Array.isArray(dupResult) ? (dupResult[0] as Record<string, unknown>[])[0] : {}).cnt ?? 0);

    const toMigrateResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
      sql.raw(`
        SELECT COUNT(*) as cnt
        FROM v3_references v3
        WHERE NOT EXISTS (
          SELECT 1 FROM bibliography_entries be
          WHERE (be.doi = v3.doi AND v3.doi IS NOT NULL)
             OR be.entry_key = v3.entry_key
        )
      `)
    );
    const toMigrate = Number((Array.isArray(toMigrateResult) ? (toMigrateResult[0] as Record<string, unknown>[])[0] : {}).cnt ?? 0);

    // Compter les entrées migrées (présentes dans bibliography_entries avec entry_key correspondant)
    const migratedResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
      sql.raw(`
        SELECT COUNT(DISTINCT v3.id) as cnt
        FROM v3_references v3
        WHERE EXISTS (
          SELECT 1 FROM bibliography_entries be
          WHERE be.entry_key = v3.entry_key
             OR (be.doi = v3.doi AND v3.doi IS NOT NULL)
        )
      `)
    );
    const migrated = Number((Array.isArray(migratedResult) ? (migratedResult[0] as Record<string, unknown>[])[0] : {}).cnt ?? 0);

    return { total, migrated, toMigrate, duplicates, deprecated };
  }),

  /**
   * Prévisualiser les entrées qui seraient migrées (sans les insérer).
   */
  previewMigration: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];
      const { sql } = await import("drizzle-orm");
      const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
        sql.raw(`
          SELECT v3.id, v3.entry_key, v3.entry_type, v3.title, v3.authors, v3.year, v3.doi, v3.url
          FROM v3_references v3
          WHERE NOT EXISTS (
            SELECT 1 FROM bibliography_entries be
            WHERE (be.doi = v3.doi AND v3.doi IS NOT NULL)
               OR be.entry_key = v3.entry_key
          )
          ORDER BY v3.id
          LIMIT ${input.limit}
        `)
      );
      return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
    }),

  /**
   * Exécuter la migration : copier les entrées uniques de v3_references
   * vers bibliography_entries, puis marquer v3_references comme dépréciée.
   */
  runMigration: protectedProcedure
    .input(z.object({
      dryRun: z.boolean().default(false),
      batchSize: z.number().min(1).max(500).default(100),
    }))
    .mutation(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("DB non disponible");
      const { sql } = await import("drizzle-orm");

      // Récupérer les entrées uniques
      const toMigrateResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
        sql.raw(`
          SELECT v3.*
          FROM v3_references v3
          WHERE NOT EXISTS (
            SELECT 1 FROM bibliography_entries be
            WHERE (be.doi = v3.doi AND v3.doi IS NOT NULL)
               OR be.entry_key = v3.entry_key
          )
          ORDER BY v3.id
          LIMIT ${input.batchSize}
        `)
      );
      const toMigrate = Array.isArray(toMigrateResult) ? toMigrateResult[0] as Record<string, unknown>[] : [];

      if (input.dryRun) {
        return {
          dryRun: true,
          wouldMigrate: toMigrate.length,
          preview: toMigrate.slice(0, 5).map(v3 => ({
            entryKey: v3.entry_key,
            title: v3.title,
            year: v3.year,
            type: TYPE_MAP[String(v3.entry_type)] || "misc",
          })),
        };
      }

      let migrated = 0;
      const errors: string[] = [];

      for (const v3 of toMigrate) {
        try {
          const entryType = TYPE_MAP[String(v3.entry_type)] || "misc";

          // Construire les notes enrichies
          const notesExtra: string[] = [];
          if (v3.notes) notesExtra.push(String(v3.notes));
          if (v3.user_notes) notesExtra.push(`[Notes utilisateur] ${v3.user_notes}`);
          if (v3.axis_primary_code) notesExtra.push(`[Axe principal v3] ${v3.axis_primary_code}`);
          if (v3.pack_version) notesExtra.push(`[Pack v3] ${v3.pack_version}`);
          const combinedNotes = notesExtra.join("\n\n") || null;

          // Tags
          let tags: string[] = [];
          if (v3.tags) { try { tags = JSON.parse(String(v3.tags)); } catch {} }
          if (v3.axes_secondary) {
            try {
              const axes = JSON.parse(String(v3.axes_secondary));
              if (Array.isArray(axes)) tags.push(...axes.map((a: string) => `axe:${a}`));
            } catch {}
          }

          // Vérifier collision entry_key
          let entryKey = String(v3.entry_key);
          const keyCheckResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
            sql`SELECT id FROM bibliography_entries WHERE entry_key = ${entryKey} LIMIT 1`
          );
          const keyCheck = Array.isArray(keyCheckResult) ? keyCheckResult[0] as Record<string, unknown>[] : [];
          if (keyCheck.length > 0) {
            entryKey = `v3_migrated_${v3.id}_${Date.now()}`;
          }

          // Requête paramétrée : toutes les valeurs partent en placeholders
          // liés (entryType et read_status n'étaient d'ailleurs pas échappés).
          const tagsJson = tags.length > 0 ? JSON.stringify(tags) : null;

          await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
            sql`
              INSERT INTO bibliography_entries (
                entry_key, entry_type, title, authors, year,
                journal, publisher, doi, isbn, url,
                notes, tags, read_status, relevance_score,
                wikidata_qid, rdf_type, created_at, updated_at
              ) VALUES (
                ${entryKey}, ${entryType},
                ${String(v3.title)}, ${v3.authors ? String(v3.authors) : null}, ${v3.year ?? null},
                ${v3.container_title ? String(v3.container_title) : null}, ${v3.publisher ? String(v3.publisher) : null}, ${v3.doi ? String(v3.doi) : null}, ${v3.isbn ? String(v3.isbn) : null}, ${v3.url ? String(v3.url) : null},
                ${combinedNotes ? combinedNotes.substring(0, 5000) : null}, ${tagsJson}, ${v3.read_status || "unread"}, ${v3.relevance_score ?? 50},
                ${v3.wikidata_qid ? String(v3.wikidata_qid) : null}, ${v3.rdf_type ? String(v3.rdf_type) : null}, NOW(), NOW()
              )
            `
          );
          migrated++;
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          errors.push(`[${v3.entry_key}] ${errMsg}`);
        }
      }

      // Marquer les nouvelles entrées comme dépréciées
      if (migrated > 0) {
        await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
          sql.raw(`UPDATE v3_references SET deprecated_at = NOW() WHERE deprecated_at IS NULL`)
        );
      }

      return {
        dryRun: false,
        migrated,
        errors,
        message: `${migrated} entrées migrées vers bibliography_entries${errors.length > 0 ? `, ${errors.length} erreurs` : ""}`,
      };
    }),

  /**
   * Lister les entrées v3_references avec leur statut de migration.
   */
  listV3References: publicProcedure
    .input(z.object({
      status: z.enum(["all", "migrated", "pending", "deprecated"]).default("all"),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return { entries: [], total: 0 };
      const { sql } = await import("drizzle-orm");

      let whereClause = "";
      if (input.status === "deprecated") whereClause = "WHERE v3.deprecated_at IS NOT NULL";
      else if (input.status === "pending") whereClause = `
        WHERE v3.deprecated_at IS NULL
        AND NOT EXISTS (SELECT 1 FROM bibliography_entries be WHERE be.entry_key = v3.entry_key OR (be.doi = v3.doi AND v3.doi IS NOT NULL))
      `;
      else if (input.status === "migrated") whereClause = `
        WHERE EXISTS (SELECT 1 FROM bibliography_entries be WHERE be.entry_key = v3.entry_key OR (be.doi = v3.doi AND v3.doi IS NOT NULL))
      `;

      const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
        sql.raw(`
          SELECT v3.id, v3.entry_key, v3.entry_type, v3.title, v3.authors, v3.year, v3.doi,
                 v3.deprecated_at,
                 (SELECT be.id FROM bibliography_entries be WHERE be.entry_key = v3.entry_key OR (be.doi = v3.doi AND v3.doi IS NOT NULL) LIMIT 1) as migrated_to_id
          FROM v3_references v3
          ${whereClause}
          ORDER BY v3.id DESC
          LIMIT ${input.limit} OFFSET ${input.offset}
        `)
      );
      const countResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(
        sql.raw(`SELECT COUNT(*) as cnt FROM v3_references v3 ${whereClause}`)
      );
      const entries = Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      const total = Number((Array.isArray(countResult) ? (countResult[0] as Record<string, unknown>[])[0] : {}).cnt ?? 0);
      return { entries, total };
    }),
});
