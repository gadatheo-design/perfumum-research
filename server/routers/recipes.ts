import { z } from "zod";
import { sql } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const recipesRouter = router({
  getAll: publicProcedure
    .input(z.object({
      collection: z.string().optional(),
      difficultyLevel: z.enum(["débutant", "intermédiaire", "avancé", "expert"]).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { recipes: [], total: 0, limit: 50, offset: 0 };
      const { collection, difficultyLevel, search, limit = 50, offset = 0 } = input || {};
      const conditions: ReturnType<typeof sql>[] = [sql`1=1`];
      if (collection) conditions.push(sql`collection = ${collection}`);
      if (difficultyLevel) conditions.push(sql`difficulty_level = ${difficultyLevel}`);
      if (search) {
        const p = `%${search}%`;
        conditions.push(sql`(name LIKE ${p} OR concept LIKE ${p} OR cannabis_component LIKE ${p} OR tobacco_component LIKE ${p})`);
      }
      const whereClause = sql.join(conditions, sql` AND `);
      const [result] = await db.execute(sql`
        SELECT id, name, slug, collection, concept,
          cannabis_component, tobacco_component, perfume_component,
          cannabis_percentage, tobacco_percentage, perfume_percentage,
          difficulty_level, maturation_days, wrapper_leaf,
          terpene_profile, created_at
        FROM cigarillo_recipes WHERE ${whereClause}
        ORDER BY name ASC LIMIT ${limit} OFFSET ${offset}
      `) as unknown as [any[]];
      const rows = result as any[];
      const [countResult] = await db.execute(sql`SELECT COUNT(*) as total FROM cigarillo_recipes WHERE ${whereClause}`) as unknown as [any[]];
      const countRows = countResult as any[];
      const total = countRows[0]?.total || 0;
      return { recipes: rows, total, limit, offset };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().optional(), slug: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const { id, slug } = input;
      if (id) {
        const [result] = await db.execute(sql`SELECT * FROM cigarillo_recipes WHERE id = ${id}`) as unknown as [any[]];
        const rows = result as any[];
        return rows[0] || null;
      } else if (slug) {
        const [result] = await db.execute(sql`SELECT * FROM cigarillo_recipes WHERE slug = ${slug}`) as unknown as [any[]];
        const rows = result as any[];
        return rows[0] || null;
      }
      return null;
    }),

  getCollections: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const [result] = await db.execute(sql`
      SELECT collection, COUNT(*) as count FROM cigarillo_recipes
      WHERE collection IS NOT NULL GROUP BY collection ORDER BY count DESC
    `) as unknown as [any[]];
    const rows = result as { collection: string; count: number }[];
    return rows;
  }),

  getIngredients: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [result] = await db.execute(sql`
        SELECT id, recipe_id, ingredient_name, ingredient_type, percentage,
          aromatic_profile as role, justification as notes, molecule_id, plant_id
        FROM cigarillo_recipe_ingredients WHERE recipe_id = ${input.recipeId}
        ORDER BY percentage DESC
      `) as unknown as [any[]];
      const rows = result as { id: number; recipe_id: number; ingredient_name: string; ingredient_type: string; percentage: number; role: string | null; notes: string | null; molecule_id: number | null; plant_id: number | null }[];
      return rows;
    }),

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byDifficulty: [], byCollection: [], avgMaturationDays: 0 };
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM cigarillo_recipes`) as unknown as [any[]];
    const totalRows = totalResult as any[];
    const total = totalRows[0]?.total || 0;
    const [diffResult] = await db.execute(sql`
      SELECT difficulty_level, COUNT(*) as count FROM cigarillo_recipes
      GROUP BY difficulty_level ORDER BY FIELD(difficulty_level, 'débutant', 'intermédiaire', 'avancé', 'expert')
    `) as unknown as [any[]];
    const byDifficulty = (diffResult[0] as unknown) as { difficulty_level: string; count: number }[];
    const [collResult] = await db.execute(sql`
      SELECT collection, COUNT(*) as count FROM cigarillo_recipes
      WHERE collection IS NOT NULL GROUP BY collection ORDER BY count DESC
    `) as unknown as [any[]];
    const byCollection = (collResult[0] as unknown) as { collection: string; count: number }[];
    const [avgResult] = await db.execute(sql`
      SELECT AVG(maturation_days) as avg_days FROM cigarillo_recipes WHERE maturation_days IS NOT NULL
    `) as unknown as [any[]];
    const avgRows = avgResult as any[];
    return {
      total,
      byDifficulty,
      byCollection,
      avgMaturationDays: Math.round(Number(avgRows[0]?.avg_days) || 0)
    };
  }),
});
