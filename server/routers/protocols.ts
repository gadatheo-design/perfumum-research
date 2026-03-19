import { z } from "zod";
import { sql } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const protocolsRouter = router({
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      difficultyLevel: z.enum(["débutant", "intermédiaire", "avancé", "expert"]).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { protocols: [], total: 0, limit: 50, offset: 0 };
      const { category, difficultyLevel, search, limit = 50, offset = 0 } = input || {};
      const conditions: ReturnType<typeof sql>[] = [sql`1=1`];
      if (category) conditions.push(sql`category = ${category}`);
      if (difficultyLevel) conditions.push(sql`difficulty_level = ${difficultyLevel}`);
      if (search) {
        const p = `%${search}%`;
        conditions.push(sql`(name LIKE ${p} OR objective LIKE ${p} OR summary LIKE ${p})`);
      }
      const whereClause = sql.join(conditions, sql` AND `);
      const [result] = await db.execute(sql`
        SELECT id, name, slug, category, objective, summary,
          estimated_cost, duration, difficulty_level, equipment_required, created_at
        FROM technical_protocols WHERE ${whereClause}
        ORDER BY name ASC LIMIT ${limit} OFFSET ${offset}
      `) as unknown as [any[]];
      const rows = result as any[];
      const [countResult] = await db.execute(sql`SELECT COUNT(*) as total FROM technical_protocols WHERE ${whereClause}`) as unknown as [any[]];
      const countRows = countResult as any[];
      const total = countRows[0]?.total || 0;
      return { protocols: rows, total, limit, offset };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().optional(), slug: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const { id, slug } = input;
      if (id) {
        const [result] = await db.execute(sql`SELECT * FROM technical_protocols WHERE id = ${id}`) as unknown as [any[]];
        const rows = result as any[];
        return rows[0] || null;
      } else if (slug) {
        const [result] = await db.execute(sql`SELECT * FROM technical_protocols WHERE slug = ${slug}`) as unknown as [any[]];
        const rows = result as any[];
        return rows[0] || null;
      }
      return null;
    }),

  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [result] = await db.execute(sql`
      SELECT category, COUNT(*) as count FROM technical_protocols
      WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC
    `) as unknown as [any[]];
    const rows = result as { category: string; count: number }[];
    return rows;
  }),

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byDifficulty: [], byCategory: [] };
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM technical_protocols`) as unknown as [any[]];
    const totalRows = (totalResult[0] as unknown) as any[];
    const total = totalRows[0]?.total || 0;
    const [diffResult] = await db.execute(sql`
      SELECT difficulty_level, COUNT(*) as count FROM technical_protocols
      GROUP BY difficulty_level ORDER BY count DESC
    `) as unknown as [any[]];
    const byDifficulty = (diffResult[0] as unknown) as { difficulty_level: string; count: number }[];
    const [catResult] = await db.execute(sql`
      SELECT category, COUNT(*) as count FROM technical_protocols
      WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC
    `) as unknown as [any[]];
    const byCategory = (catResult[0] as unknown) as { category: string; count: number }[];
    return {
      total,
      byDifficulty,
      byCategory
    };
  }),
});
