import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const recipesRouter = router({
  // Get all recipes with optional filtering
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
      
      let sql = `
        SELECT 
          id, name, slug, collection, concept,
          cannabis_component, tobacco_component, perfume_component,
          cannabis_percentage, tobacco_percentage, perfume_percentage,
          difficulty_level, maturation_days, wrapper_leaf,
          terpene_profile, created_at
        FROM cigarillo_recipes
        WHERE 1=1
      `;
      const params: any[] = [];
      
      if (collection) {
        sql += ` AND collection = ?`;
        params.push(collection);
      }
      
      if (difficultyLevel) {
        sql += ` AND difficulty_level = ?`;
        params.push(difficultyLevel);
      }
      
      if (search) {
        sql += ` AND (name LIKE ? OR concept LIKE ? OR cannabis_component LIKE ? OR tobacco_component LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
      
      sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      
      const result = await db.execute(sql, params);
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
      
      // Get total count
      let countSql = `SELECT COUNT(*) as total FROM cigarillo_recipes WHERE 1=1`;
      const countParams: any[] = [];
      
      if (collection) {
        countSql += ` AND collection = ?`;
        countParams.push(collection);
      }
      if (difficultyLevel) {
        countSql += ` AND difficulty_level = ?`;
        countParams.push(difficultyLevel);
      }
      if (search) {
        countSql += ` AND (name LIKE ? OR concept LIKE ? OR cannabis_component LIKE ? OR tobacco_component LIKE ?)`;
        const searchPattern = `%${search}%`;
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
      
      const countResult = await db.execute(countSql, countParams);
      const countRows = Array.isArray(countResult) && Array.isArray(countResult[0]) ? countResult[0] : [];
      const total = (countRows as any[])[0]?.total || 0;
      
      return {
        recipes: rows as any[],
        total,
        limit,
        offset
      };
    }),

  // Get recipe by ID or slug
  getById: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      slug: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { id, slug } = input;
      
      let sql = `SELECT * FROM cigarillo_recipes WHERE `;
      
      if (id) {
        sql += `id = ?`;
        // @ts-ignore
        const result = await db.execute(sql, [id]);
        const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
        return (rows as any[])[0] || null;
      } else if (slug) {
        sql += `slug = ?`;
        // @ts-ignore
        const result = await db.execute(sql, [slug]);
        const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
        return (rows as any[])[0] || null;
      }
      
      return null;
    }),

  // Get collections list
  getCollections: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db.execute(`
      SELECT collection, COUNT(*) as count
      FROM cigarillo_recipes
      WHERE collection IS NOT NULL
      GROUP BY collection
      ORDER BY count DESC
    `);
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
    return rows as { collection: string; count: number }[];
  }),

  // Get recipe ingredients
  getIngredients: publicProcedure
    .input(z.object({
      recipeId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db.execute(`
        SELECT 
          id, recipe_id, ingredient_name, ingredient_type, percentage,
          aromatic_profile as role, justification as notes, molecule_id, plant_id
        FROM cigarillo_recipe_ingredients
        WHERE recipe_id = ?
        ORDER BY percentage DESC
      `, [input.recipeId]);
      
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
      return rows as any[];
    }),

  // Get recipe statistics
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byDifficulty: [], byCollection: [], avgMaturationDays: 0 };
    
    const totalResult = await db.execute(`SELECT COUNT(*) as total FROM cigarillo_recipes`);
    const totalRows = Array.isArray(totalResult) && Array.isArray(totalResult[0]) ? totalResult[0] : [];
    const total = (totalRows as any[])[0]?.total || 0;
    
    const diffResult = await db.execute(`
      SELECT difficulty_level, COUNT(*) as count
      FROM cigarillo_recipes
      GROUP BY difficulty_level
      ORDER BY FIELD(difficulty_level, 'débutant', 'intermédiaire', 'avancé', 'expert')
    `);
    const byDifficulty = Array.isArray(diffResult) && Array.isArray(diffResult[0]) ? diffResult[0] : [];
    
    const collResult = await db.execute(`
      SELECT collection, COUNT(*) as count
      FROM cigarillo_recipes
      WHERE collection IS NOT NULL
      GROUP BY collection
      ORDER BY count DESC
    `);
    const byCollection = Array.isArray(collResult) && Array.isArray(collResult[0]) ? collResult[0] : [];
    
    const avgResult = await db.execute(`
      SELECT AVG(maturation_days) as avg_days
      FROM cigarillo_recipes
      WHERE maturation_days IS NOT NULL
    `);
    const avgRows = Array.isArray(avgResult) && Array.isArray(avgResult[0]) ? avgResult[0] : [];
    
    return {
      total,
      byDifficulty: byDifficulty as { difficulty_level: string; count: number }[],
      byCollection: byCollection as { collection: string; count: number }[],
      avgMaturationDays: Math.round((avgRows as any[])[0]?.avg_days || 0)
    };
  }),
});
