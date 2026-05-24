import { z } from "zod";
import { sql } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

export const landracesRouter = router({
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
      const conditions: ReturnType<typeof sql>[] = [sql`1=1`];
      if (type) conditions.push(sql`type = ${type}`);
      if (conservationStatus) conditions.push(sql`conservation_status = ${conservationStatus}`);
      if (effectType) conditions.push(sql`effect_type = ${effectType}`);
      if (search) {
        const p = `%${search}%`;
        conditions.push(sql`(name LIKE ${p} OR alternate_names LIKE ${p} OR origin LIKE ${p} OR aromatic_profile LIKE ${p})`);
      }
      const whereClause = sql.join(conditions, sql` AND `);
      const [result] = await db.execute(sql`
        SELECT id, name, slug, alternate_names, type, origin, region, country,
          aromatic_profile, head_notes, heart_notes, base_notes,
          effect_type, thc_range, cbd_range, total_terpene_content,
          dominant_terpenes, conservation_status, cigarillo_potential, created_at
        FROM cannabis_landraces WHERE ${whereClause}
        ORDER BY name ASC LIMIT ${limit} OFFSET ${offset}
      `) as unknown as [any[]];
      const rows = result as any[];
      const [countResult] = await db.execute(sql`SELECT COUNT(*) as total FROM cannabis_landraces WHERE ${whereClause}`) as unknown as [any[]];
      const countRows = countResult as any[];
      const total = countRows[0]?.total || 0;
      return { landraces: rows, total, limit, offset };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().optional(), slug: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const { id, slug } = input;
      if (id) {
        const [result] = await db.execute(sql`SELECT * FROM cannabis_landraces WHERE id = ${id}`) as unknown as [any[]];
        const rows = result as any[];
        return rows[0] || null;
      } else if (slug) {
        const [result] = await db.execute(sql`SELECT * FROM cannabis_landraces WHERE slug = ${slug}`) as unknown as [any[]];
        const rows = result as any[];
        return rows[0] || null;
      }
      return null;
    }),

  getTerpenes: publicProcedure
    .input(z.object({ landraceId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const [result] = await db.execute(sql`
        SELECT id, landrace_id, terpene_name, percentage, notes
        FROM landrace_terpenes WHERE landrace_id = ${input.landraceId}
        ORDER BY percentage DESC
      `) as unknown as [any[]];
      const rows = result as any[];
      return rows;
    }),

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byType: [], byConservation: [], byEffect: [], byCountry: [] };
    const [totalResult] = await db.execute(sql`SELECT COUNT(*) as total FROM cannabis_landraces`) as unknown as [any[]];
    const total = totalResult[0]?.total || 0;
    const [typeResult] = await db.execute(sql`SELECT type, COUNT(*) as count FROM cannabis_landraces GROUP BY type ORDER BY count DESC`) as unknown as [any[]];
    const byType = typeResult as { type: string; count: number }[];
    const [conservationResult] = await db.execute(sql`
      SELECT conservation_status, COUNT(*) as count FROM cannabis_landraces
      GROUP BY conservation_status ORDER BY count DESC
    `) as unknown as [any[]];
    const byConservation = conservationResult as { conservation_status: string; count: number }[];
    const [effectResult] = await db.execute(sql`
      SELECT effect_type, COUNT(*) as count FROM cannabis_landraces
      WHERE effect_type IS NOT NULL GROUP BY effect_type ORDER BY count DESC
    `) as unknown as [any[]];
    const byEffect = effectResult as { effect_type: string; count: number }[];
    const [countryResult] = await db.execute(sql`
      SELECT country, COUNT(*) as count FROM cannabis_landraces
      WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC
    `) as unknown as [any[]];
    const byCountry = countryResult as { country: string; count: number }[];
    return {
      total,
      byType,
      byConservation,
      byEffect,
      byCountry
    };
  }),

  enrichTerpenes: protectedProcedure.mutation(async () => {
    const { enrichLandraceTerpenes } = await import('../terpene-enrichment');
    return await enrichLandraceTerpenes();
  }),

  getTerpeneStats: publicProcedure.query(async () => {
    const { getLandraceTerpeneStats } = await import('../terpene-enrichment');
    return await getLandraceTerpeneStats();
  }),
});
