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

  // Get variety genealogy — connecté aux données réelles
  getVarietyGenealogy: publicProcedure
    .input(z.object({ varietyId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { varietyId: input.varietyId, nodes: [], links: [], ancestorCount: 0, descendantCount: 0 };

      const { varietyId } = input;

      // Récupérer toutes les relations impliquant cette plante (ancêtres et descendants)
      const [asChild] = await db.execute(sql`
        SELECT vg.variety_id, vg.parent_variety_id, vg.relationship_type, vg.breeder, vg.notes,
          p1.name as variety_name, p2.name as parent_name
        FROM variety_genealogy vg
        LEFT JOIN plants p1 ON vg.variety_id = p1.id
        LEFT JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE vg.variety_id = ${varietyId}
      `) as any;

      const [asParent] = await db.execute(sql`
        SELECT vg.variety_id, vg.parent_variety_id, vg.relationship_type, vg.breeder, vg.notes,
          p1.name as variety_name, p2.name as parent_name
        FROM variety_genealogy vg
        LEFT JOIN plants p1 ON vg.variety_id = p1.id
        LEFT JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE vg.parent_variety_id = ${varietyId}
      `) as any;

      const ancestors = Array.isArray(asChild) ? asChild : [];
      const descendants = Array.isArray(asParent) ? asParent : [];

      // Construire l'ensemble des IDs uniques impliqués
      const allIds = new Set<number>([varietyId]);
      ancestors.forEach((r: any) => { allIds.add(Number(r.parent_variety_id)); allIds.add(Number(r.variety_id)); });
      descendants.forEach((r: any) => { allIds.add(Number(r.variety_id)); allIds.add(Number(r.parent_variety_id)); });

      // Récupérer les noms de toutes les plantes impliquées
      const idList = Array.from(allIds).join(',');
      const [plantRows] = await db.execute(sql`
        SELECT id, name, category FROM plants WHERE id IN (${sql.raw(idList)})
      `) as any;
      const plantMap = new Map<number, { name: string; category: string }>();
      (Array.isArray(plantRows) ? plantRows : []).forEach((p: any) => {
        plantMap.set(Number(p.id), { name: p.name, category: p.category });
      });

      // Construire les nœuds pour React Flow
      const nodes = Array.from(allIds).map(id => {
        const plant = plantMap.get(id);
        let type: 'root' | 'ancestor' | 'descendant' = 'ancestor';
        if (id === varietyId) type = 'root';
        else if (descendants.some((r: any) => Number(r.variety_id) === id)) type = 'descendant';
        return {
          id: String(id),
          label: plant?.name || `Plante #${id}`,
          type,
          category: plant?.category || '',
        };
      });

      // Construire les liens
      const allRelations = [...ancestors, ...descendants];
      const seen = new Set<string>();
      const links = allRelations
        .filter((r: any) => {
          const key = `${r.parent_variety_id}-${r.variety_id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((r: any) => ({
          source: String(r.parent_variety_id),
          target: String(r.variety_id),
          type: r.relationship_type || 'parent',
          breeder: r.breeder || '',
          notes: r.notes || '',
        }));

      return {
        varietyId,
        nodes,
        links,
        ancestorCount: ancestors.length,
        descendantCount: descendants.length,
      };
    })
});
