import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

export const predO3Router = router({
  getDescriptors: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        let result: unknown;
        if (input.category) {
          result = await db.execute(sql`
            SELECT id, descriptor_id, name, description, category, frequency, source
            FROM odor_descriptors
            WHERE category = ${input.category}
            ORDER BY frequency DESC
            LIMIT ${input.limit} OFFSET ${input.offset}
          `);
        } else {
          result = await db.execute(sql`
            SELECT id, descriptor_id, name, description, category, frequency, source
            FROM odor_descriptors
            ORDER BY frequency DESC
            LIMIT ${input.limit} OFFSET ${input.offset}
          `);
        }

        const [rows] = result as any;
        return rows ?? [];
      } catch (err) {
        console.error("Error in getDescriptors:", err);
        return [];
      }
    }),

  getStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return { total: 0, categories: 0, totalFrequency: 0, maxFrequency: 0, minFrequency: 0 };

      const result = await db.execute(sql`
        SELECT
          COUNT(*) as total,
          COUNT(DISTINCT category) as categories,
          SUM(frequency) as totalFrequency,
          MAX(frequency) as maxFrequency,
          MIN(frequency) as minFrequency
        FROM odor_descriptors
      `);

      const [rows] = result as any;
      const row = (rows ?? [])[0] ?? {};
      return {
        total: Number(row.total ?? 0),
        categories: Number(row.categories ?? 0),
        totalFrequency: Number(row.totalFrequency ?? 0),
        maxFrequency: Number(row.maxFrequency ?? 0),
        minFrequency: Number(row.minFrequency ?? 0),
      };
    } catch (err) {
      console.error("Error in getStats:", err);
      return { total: 0, categories: 0, totalFrequency: 0, maxFrequency: 0, minFrequency: 0 };
    }
  }),

  searchDescriptors: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const term = "%" + input.query + "%";
        const result = await db.execute(sql`
          SELECT id, descriptor_id, name, description, category, frequency, source
          FROM odor_descriptors
          WHERE name LIKE ${term} OR description LIKE ${term} OR descriptor_id LIKE ${term}
          ORDER BY frequency DESC
          LIMIT 50
        `);
        const [rows] = result as any;
        return rows ?? [];
      } catch (err) {
        console.error("Error in searchDescriptors:", err);
        return [];
      }
    }),

  getCategories: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];

      const result = await db.execute(sql`
        SELECT DISTINCT category FROM odor_descriptors WHERE category IS NOT NULL ORDER BY category
      `);
      const [rows] = result as any;
      return (rows ?? []).map(r => String(r.category));
    } catch (err) {
      console.error("Error in getCategories:", err);
      return [];
    }
  }),

  importDescriptors: protectedProcedure
    .input(z.object({
      descriptors: z.array(z.object({
        descriptor_id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        frequency: z.number().optional(),
        source: z.string().optional(),
      }))
    }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("DB non disponible");

        let imported = 0;
        let skipped = 0;

        for (const d of input.descriptors) {
          try {
            await db.execute(sql`
              INSERT IGNORE INTO odor_descriptors (descriptor_id, name, description, category, frequency, source)
              VALUES (${d.descriptor_id}, ${d.name}, ${d.description ?? null}, ${d.category ?? null}, ${d.frequency ?? 0}, ${d.source ?? 'pred-o3'})
            `);
            imported++;
          } catch {
            skipped++;
          }
        }

        return { imported, skipped, total: input.descriptors.length };
      } catch (err) {
        console.error("Error in importDescriptors:", err);
        throw new Error("Erreur lors de l'import des descripteurs");
      }
    }),
});
