/**
 * NOSE Phase 4 — Router tRPC Wikidata
 * Gestion des QIDs Wikidata pour molécules et plantes
 * Interopérabilité avec Odeuropa / Europeana
 */

import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import mysql from 'mysql2/promise';
import { searchMoleculeQid, searchPlantQid, getWikidataProperties, generateJsonLd } from '../wikidata';

async function getDb() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const wikidataRouter = router({
  /**
   * Statistiques d'enrichissement Wikidata
   */
  getStats: publicProcedure.query(async () => {
    const conn = await getDb();
    try {
      const [molStats] = await conn.execute<import('mysql2').RowDataPacket[]>(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN wikidata_qid IS NOT NULL THEN 1 ELSE 0 END) as enriched,
          SUM(CASE WHEN wikidata_qid IS NULL THEN 1 ELSE 0 END) as pending
        FROM molecules
      `);

      const [plantStats] = await conn.execute<import('mysql2').RowDataPacket[]>(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN wikidata_qid IS NOT NULL THEN 1 ELSE 0 END) as enriched,
          SUM(CASE WHEN wikidata_qid IS NULL THEN 1 ELSE 0 END) as pending
        FROM plants
      `);

      return {
        molecules: molStats[0] as { total: string; enriched: string; pending: string },
        plants: plantStats[0] as { total: string; enriched: string; pending: string },
      };
    } finally {
      conn.end();
    }
  }),

  /**
   * Rechercher un QID Wikidata pour une molécule (dry-run)
   */
  searchMolecule: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ input }) => {
      const result = await searchMoleculeQid(input.name);
      if (!result) return null;

      // Récupérer les propriétés supplémentaires
      const props = await getWikidataProperties(result.qid);
      return { ...result, ...props };
    }),

  /**
   * Rechercher un QID Wikidata pour une plante (dry-run)
   */
  searchPlant: publicProcedure
    .input(z.object({ latinName: z.string().min(1) }))
    .query(async ({ input }) => {
      const result = await searchPlantQid(input.latinName);
      if (!result) return null;

      const props = await getWikidataProperties(result.qid);
      return { ...result, ...props };
    }),

  /**
   * Assigner manuellement un QID à une molécule
   */
  setMoleculeQid: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      qid: z.string().regex(/^Q\d+$/, 'Format QID invalide (ex: Q193178)'),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        await conn.execute(
          'UPDATE molecules SET wikidata_qid = ?, wikidata_enriched_at = NOW() WHERE id = ?',
          [input.qid, input.moleculeId]
        );
        return { success: true };
      } finally {
        conn.end();
      }
    }),

  /**
   * Assigner manuellement un QID à une plante
   */
  setPlantQid: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      qid: z.string().regex(/^Q\d+$/, 'Format QID invalide (ex: Q193178)'),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        await conn.execute(
          'UPDATE plants SET wikidata_qid = ?, wikidata_enriched_at = NOW() WHERE id = ?',
          [input.qid, input.plantId]
        );
        return { success: true };
      } finally {
        conn.end();
      }
    }),

  /**
   * Batch enrichissement automatique des molécules
   */
  batchEnrichMolecules: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(50),
      delayMs: z.number().min(200).max(2000).default(500),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        // Récupérer les molécules à enrichir
        const [rows] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT id, name FROM molecules 
           WHERE wikidata_qid IS NULL 
           AND name IS NOT NULL
           AND name NOT REGEXP '^(Test|Terre|Fumée|Résine|traces|profil|aldéhyde)'
           ORDER BY id
           LIMIT ?`,
          [input.limit]
        );

        if (input.dryRun) {
          return {
            dryRun: true,
            count: rows.length,
            preview: rows.slice(0, 10).map(r => ({ id: r.id, name: r.name })),
          };
        }

        let enriched = 0, failed = 0, skipped = 0;
        const results: Array<{ id: number; name: string; qid: string | null; status: string }> = [];

        for (const row of rows) {
          await new Promise(r => setTimeout(r, input.delayMs));

          const result = await searchMoleculeQid(row.name as string);
          if (!result) {
            failed++;
            results.push({ id: row.id as number, name: row.name as string, qid: null, status: 'not_found' });
            continue;
          }

          // Vérifier doublon
          const [existing] = await conn.execute<import('mysql2').RowDataPacket[]>(
            'SELECT id FROM molecules WHERE wikidata_qid = ? AND id != ?',
            [result.qid, row.id]
          );

          if ((existing as unknown[]).length > 0) {
            skipped++;
            results.push({ id: row.id as number, name: row.name as string, qid: result.qid, status: 'duplicate' });
            continue;
          }

          await conn.execute(
            'UPDATE molecules SET wikidata_qid = ?, wikidata_enriched_at = NOW() WHERE id = ?',
            [result.qid, row.id]
          );
          enriched++;
          results.push({ id: row.id as number, name: row.name as string, qid: result.qid, status: 'enriched' });
        }

        return { enriched, failed, skipped, results };
      } finally {
        conn.end();
      }
    }),

  /**
   * Batch enrichissement automatique des plantes
   */
  batchEnrichPlants: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(50),
      delayMs: z.number().min(200).max(2000).default(500),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT id, latin_name FROM plants 
           WHERE wikidata_qid IS NULL 
           AND latin_name IS NOT NULL
           ORDER BY id
           LIMIT ?`,
          [input.limit]
        );

        if (input.dryRun) {
          return {
            dryRun: true,
            count: rows.length,
            preview: rows.slice(0, 10).map(r => ({ id: r.id, name: r.latin_name })),
          };
        }

        let enriched = 0, failed = 0, skipped = 0;
        const results: Array<{ id: number; name: string; qid: string | null; status: string }> = [];

        for (const row of rows) {
          await new Promise(r => setTimeout(r, input.delayMs));

          const result = await searchPlantQid(row.latin_name as string);
          if (!result) {
            failed++;
            results.push({ id: row.id as number, name: row.latin_name as string, qid: null, status: 'not_found' });
            continue;
          }

          const [existing] = await conn.execute<import('mysql2').RowDataPacket[]>(
            'SELECT id FROM plants WHERE wikidata_qid = ? AND id != ?',
            [result.qid, row.id]
          );

          if ((existing as unknown[]).length > 0) {
            skipped++;
            results.push({ id: row.id as number, name: row.latin_name as string, qid: result.qid, status: 'duplicate' });
            continue;
          }

          await conn.execute(
            'UPDATE plants SET wikidata_qid = ?, wikidata_enriched_at = NOW() WHERE id = ?',
            [result.qid, row.id]
          );
          enriched++;
          results.push({ id: row.id as number, name: row.latin_name as string, qid: result.qid, status: 'enriched' });
        }

        return { enriched, failed, skipped, results };
      } finally {
        conn.end();
      }
    }),

  /**
   * Lister les molécules enrichies avec leur QID
   */
  listEnrichedMolecules: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      filter: z.enum(['all', 'enriched', 'pending']).default('all'),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const offset = (input.page - 1) * input.limit;
        let whereClause = '';
        if (input.filter === 'enriched') whereClause = 'WHERE wikidata_qid IS NOT NULL';
        if (input.filter === 'pending') whereClause = 'WHERE wikidata_qid IS NULL';

        const [rows] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT id, name, wikidata_qid, wikidata_enriched_at, chemical_class, coconut_id
           FROM molecules ${whereClause}
           ORDER BY name
           LIMIT ? OFFSET ?`,
          [input.limit, offset]
        );

        const [countResult] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM molecules ${whereClause}`
        );

        return {
          items: rows as Array<{
            id: number;
            name: string;
            wikidata_qid: string | null;
            wikidata_enriched_at: Date | null;
            chemical_class: string | null;
            coconut_id: string | null;
          }>,
          total: (countResult[0] as { total: number }).total,
          page: input.page,
          limit: input.limit,
        };
      } finally {
        conn.end();
      }
    }),

  /**
   * Lister les plantes enrichies avec leur QID
   */
  listEnrichedPlants: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      filter: z.enum(['all', 'enriched', 'pending']).default('all'),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const offset = (input.page - 1) * input.limit;
        let whereClause = '';
        if (input.filter === 'enriched') whereClause = 'WHERE wikidata_qid IS NOT NULL';
        if (input.filter === 'pending') whereClause = 'WHERE wikidata_qid IS NULL';

        const [rows] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT id, latin_name, common_name, wikidata_qid, wikidata_enriched_at, gbif_id
           FROM plants ${whereClause}
           ORDER BY latin_name
           LIMIT ? OFFSET ?`,
          [input.limit, offset]
        );

        const [countResult] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM plants ${whereClause}`
        );

        return {
          items: rows as Array<{
            id: number;
            latin_name: string;
            common_name: string | null;
            wikidata_qid: string | null;
            wikidata_enriched_at: Date | null;
            gbif_id: string | null;
          }>,
          total: (countResult[0] as { total: number }).total,
          page: input.page,
          limit: input.limit,
        };
      } finally {
        conn.end();
      }
    }),

  /**
   * Export JSON-LD d'une molécule (compatible NOSE/Europeana)
   */
  exportMoleculeJsonLd: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT id, name, wikidata_qid, cas_number, smiles, inchi_key, olfactive_profile
           FROM molecules WHERE id = ?`,
          [input.moleculeId]
        );

        if (!rows[0]) return null;
        const mol = rows[0] as {
          id: number;
          name: string;
          wikidata_qid: string | null;
          cas_number: string | null;
          smiles: string | null;
          inchi_key: string | null;
          olfactive_profile: string | null;
        };

        return generateJsonLd({
          id: mol.id,
          name: mol.name,
          wikidataQid: mol.wikidata_qid,
          casNumber: mol.cas_number,
          smiles: mol.smiles,
          inchiKey: mol.inchi_key,
          olfactiveProfile: mol.olfactive_profile,
          type: 'molecule',
        });
      } finally {
        conn.end();
      }
    }),

  /**
   * Export JSON-LD d'une plante (compatible NOSE/Europeana)
   */
  exportPlantJsonLd: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<import('mysql2').RowDataPacket[]>(
          `SELECT id, latin_name, wikidata_qid FROM plants WHERE id = ?`,
          [input.plantId]
        );

        if (!rows[0]) return null;
        const plant = rows[0] as { id: number; latin_name: string; wikidata_qid: string | null };

        return generateJsonLd({
          id: plant.id,
          name: plant.latin_name,
          wikidataQid: plant.wikidata_qid,
          type: 'plant',
        });
      } finally {
        conn.end();
      }
    }),

  /**
   * Supprimer le QID d'une molécule (correction manuelle)
   */
  clearMoleculeQid: protectedProcedure
    .input(z.object({ moleculeId: z.number() }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        await conn.execute(
          'UPDATE molecules SET wikidata_qid = NULL, wikidata_enriched_at = NULL WHERE id = ?',
          [input.moleculeId]
        );
        return { success: true };
      } finally {
        conn.end();
      }
    }),

  /**
   * Supprimer le QID d'une plante (correction manuelle)
   */
  clearPlantQid: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        await conn.execute(
          'UPDATE plants SET wikidata_qid = NULL, wikidata_enriched_at = NULL WHERE id = ?',
          [input.plantId]
        );
        return { success: true };
      } finally {
        conn.end();
      }
    }),
});
