import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

export const moleculeManagerRouter = router({
  // Get all molecules with their plant links
  getMolecules: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const rows = await db.execute(sql`
      SELECT m.id, m.name, COUNT(pm.id) as plant_links
      FROM molecules m
      LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
      GROUP BY m.id
      ORDER BY plant_links DESC
    `);
    
    return (rows as any[]).map(r => ({
      id: Number(r.id),
      name: r.name,
      plantLinks: Number(r.plant_links),
    }));
  }),

  // Get all plants with their molecule links
  getPlants: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const rows = await db.execute(sql`
      SELECT p.id, p.name, p.category, COUNT(pm.id) as molecule_links
      FROM plants p
      LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
      GROUP BY p.id
      ORDER BY p.name
    `);
    
    return (rows as any[]).map(r => ({
      id: Number(r.id),
      name: r.name,
      category: r.category,
      moleculeLinks: Number(r.molecule_links),
    }));
  }),

  // Get category distribution
  getCategoryDistribution: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const rows = await db.execute(sql`
      SELECT category, COUNT(*) as cnt 
      FROM plants 
      GROUP BY category 
      ORDER BY cnt DESC
    `);
    
    return (rows as any[]).map(r => ({
      category: r.category || 'null',
      count: Number(r.cnt),
    }));
  }),

  // Get variety genealogy
  getVarietyGenealogy: publicProcedure
    .input(z.object({ varietyId: z.number() }))
    .query(async ({ input }) => {
      return {
        varietyId: input.varietyId,
        nodes: [],
        links: [],
        ancestorCount: 0,
        descendantCount: 0
      };
    })
});
