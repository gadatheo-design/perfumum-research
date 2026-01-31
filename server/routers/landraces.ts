import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const landracesRouter = router({
  // Get all landraces with optional filtering
  getAll: publicProcedure
    .input(z.object({
      type: z.enum(["indica", "sativa", "hybrid"]).optional(),
      conservationStatus: z.string().optional(),
      effectType: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { landraces: [], total: 0, limit: 50, offset: 0 };
      
      const { type, conservationStatus, effectType, search, limit = 50, offset = 0 } = input || {};
      
      let sql = `
        SELECT 
          id, name, slug, alternate_names, type, origin, region, country,
          aromatic_profile, head_notes, heart_notes, base_notes,
          effect_type, thc_range, cbd_range, total_terpene_content,
          dominant_terpenes, conservation_status, cigarillo_potential,
          created_at
        FROM cannabis_landraces
        WHERE 1=1
      `;
      const params: any[] = [];
      
      if (type) {
        sql += ` AND type = ?`;
        params.push(type);
      }
      
      if (conservationStatus) {
        sql += ` AND conservation_status = ?`;
        params.push(conservationStatus);
      }
      
      if (effectType) {
        sql += ` AND effect_type = ?`;
        params.push(effectType);
      }
      
      if (search) {
        sql += ` AND (name LIKE ? OR alternate_names LIKE ? OR origin LIKE ? OR aromatic_profile LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
      
      sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      
      const result = await db.execute(sql, params);
      const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
      
      // Get total count
      let countSql = `SELECT COUNT(*) as total FROM cannabis_landraces WHERE 1=1`;
      const countParams: any[] = [];
      
      if (type) {
        countSql += ` AND type = ?`;
        countParams.push(type);
      }
      if (conservationStatus) {
        countSql += ` AND conservation_status = ?`;
        countParams.push(conservationStatus);
      }
      if (effectType) {
        countSql += ` AND effect_type = ?`;
        countParams.push(effectType);
      }
      if (search) {
        countSql += ` AND (name LIKE ? OR alternate_names LIKE ? OR origin LIKE ? OR aromatic_profile LIKE ?)`;
        const searchPattern = `%${search}%`;
        countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
      
      const countResult = await db.execute(countSql, countParams);
      const countRows = Array.isArray(countResult) && Array.isArray(countResult[0]) ? countResult[0] : [];
      const total = (countRows as any[])[0]?.total || 0;
      
      return {
        landraces: rows as any[],
        total,
        limit,
        offset
      };
    }),

  // Get landrace by ID or slug
  getById: publicProcedure
    .input(z.object({
      id: z.number().optional(),
      slug: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { id, slug } = input;
      
      let sql = `SELECT * FROM cannabis_landraces WHERE `;
      
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

  // Get landrace statistics
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byType: [], byConservation: [], byEffect: [], byCountry: [] };
    
    const totalResult = await db.execute(`SELECT COUNT(*) as total FROM cannabis_landraces`);
    const totalRows = Array.isArray(totalResult) && Array.isArray(totalResult[0]) ? totalResult[0] : [];
    const total = (totalRows as any[])[0]?.total || 0;
    
    const typeResult = await db.execute(`
      SELECT type, COUNT(*) as count
      FROM cannabis_landraces
      GROUP BY type
      ORDER BY count DESC
    `);
    const byType = Array.isArray(typeResult) && Array.isArray(typeResult[0]) ? typeResult[0] : [];
    
    const conservationResult = await db.execute(`
      SELECT conservation_status, COUNT(*) as count
      FROM cannabis_landraces
      GROUP BY conservation_status
      ORDER BY FIELD(conservation_status, 'commun', 'rare', 'menacé', 'en danger', 'disparu')
    `);
    const byConservation = Array.isArray(conservationResult) && Array.isArray(conservationResult[0]) ? conservationResult[0] : [];
    
    const effectResult = await db.execute(`
      SELECT effect_type, COUNT(*) as count
      FROM cannabis_landraces
      WHERE effect_type IS NOT NULL
      GROUP BY effect_type
      ORDER BY count DESC
    `);
    const byEffect = Array.isArray(effectResult) && Array.isArray(effectResult[0]) ? effectResult[0] : [];
    
    const countryResult = await db.execute(`
      SELECT country, COUNT(*) as count
      FROM cannabis_landraces
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
    `);
    const byCountry = Array.isArray(countryResult) && Array.isArray(countryResult[0]) ? countryResult[0] : [];
    
    return {
      total,
      byType: byType as { type: string; count: number }[],
      byConservation: byConservation as { conservation_status: string; count: number }[],
      byEffect: byEffect as { effect_type: string; count: number }[],
      byCountry: byCountry as { country: string; count: number }[]
    };
  }),
});
