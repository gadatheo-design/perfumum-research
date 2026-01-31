import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const protocolsRouter = router({
  // Get all protocols with optional filtering
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
      
      let sql = `
        SELECT 
          id, name, slug, category, objective, summary,
          estimated_cost, duration, difficulty_level,
          equipment_required, created_at
        FROM technical_protocols
        WHERE 1=1
      `;
      const params: any[] = [];
      
      if (category) {
        sql += ` AND category = ?`;
        params.push(category);
      }
      
      if (difficultyLevel) {
        sql += ` AND difficulty_level = ?`;
        params.push(difficultyLevel);
      }
      
      if (search) {
        sql += ` AND (name LIKE ? OR objective LIKE ? OR summary LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }
      
      sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      
      const result = await db.execute(sql, params);
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
      
      // Get total count
      let countSql = `SELECT COUNT(*) as total FROM technical_protocols WHERE 1=1`;
      const countParams: any[] = [];
      
      if (category) {
        countSql += ` AND category = ?`;
        countParams.push(category);
      }
      if (difficultyLevel) {
        countSql += ` AND difficulty_level = ?`;
        countParams.push(difficultyLevel);
      }
      if (search) {
        countSql += ` AND (name LIKE ? OR objective LIKE ? OR summary LIKE ?)`;
        const searchPattern = `%${search}%`;
        countParams.push(searchPattern, searchPattern, searchPattern);
      }
      
      const countResult = await db.execute(countSql, countParams);
      const countRows = Array.isArray(countResult) && Array.isArray(countResult[0]) ? countResult[0] : [];
      const total = (countRows as any[])[0]?.total || 0;
      
      return {
        protocols: rows as any[],
        total,
        limit,
        offset
      };
    }),

  // Get protocol by ID or slug
  getById: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      slug: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { id, slug } = input;
      
      let sql = `SELECT * FROM technical_protocols WHERE `;
      
      if (id) {
        sql += `id = ?`;
        const result = await db.execute(sql, [id]);
        const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
        return (rows as any[])[0] || null;
      } else if (slug) {
        sql += `slug = ?`;
        const result = await db.execute(sql, [slug]);
        const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
        return (rows as any[])[0] || null;
      }
      
      return null;
    }),

  // Get categories list
  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db.execute(`
      SELECT category, COUNT(*) as count
      FROM technical_protocols
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
    return rows as { category: string; count: number }[];
  }),

  // Get protocol statistics
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byDifficulty: [], byCategory: [] };
    
    const totalResult = await db.execute(`SELECT COUNT(*) as total FROM technical_protocols`);
    const totalRows = Array.isArray(totalResult) && Array.isArray(totalResult[0]) ? totalResult[0] : [];
    const total = (totalRows as any[])[0]?.total || 0;
    
    const diffResult = await db.execute(`
      SELECT difficulty_level, COUNT(*) as count
      FROM technical_protocols
      GROUP BY difficulty_level
      ORDER BY FIELD(difficulty_level, 'débutant', 'intermédiaire', 'avancé', 'expert')
    `);
    const byDifficulty = Array.isArray(diffResult) && Array.isArray(diffResult[0]) ? diffResult[0] : [];
    
    const catResult = await db.execute(`
      SELECT category, COUNT(*) as count
      FROM technical_protocols
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);
    const byCategory = Array.isArray(catResult) && Array.isArray(catResult[0]) ? catResult[0] : [];
    
    return {
      total,
      byDifficulty: byDifficulty as { difficulty_level: string; count: number }[],
      byCategory: byCategory as { category: string; count: number }[]
    };
  }),
});
