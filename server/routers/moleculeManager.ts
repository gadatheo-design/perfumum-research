import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { getDb } from "../db";

export const moleculeManagerRouter = router({
  // Get all molecules with their plant links
  getMolecules: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const [rows] = await db.execute(sql`
      SELECT m.id, m.name, COUNT(pm.id) as plant_links
      FROM molecules m
      LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
      GROUP BY m.id
      ORDER BY plant_links DESC
    `) as unknown as [any[]];
    
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
    
    const [rows] = await db.execute(sql`
      SELECT p.id, p.name, p.category, COUNT(pm.id) as molecule_links
      FROM plants p
      LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
      GROUP BY p.id
      ORDER BY p.name
    `) as unknown as [any[]];
    
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
    
    const [rows] = await db.execute(sql`
      SELECT category, COUNT(*) as cnt 
      FROM plants 
      GROUP BY category 
      ORDER BY cnt DESC
    `) as unknown as [any[]];
    
    return (rows as any[]).map(r => ({
      category: r.category || 'null',
      count: Number(r.cnt),
    }));
  }),

  // Get global stats for the manager dashboard
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalMolecules: 0, totalPlants: 0, totalLinks: 0, orphanMolecules: 0, orphanPlants: 0 };

    const [molRows] = await db.execute(sql`SELECT COUNT(*) as cnt FROM molecules`) as unknown as [any[]];
    const [plantRows] = await db.execute(sql`SELECT COUNT(*) as cnt FROM plants`) as unknown as [any[]];
    const [linkRows] = await db.execute(sql`SELECT COUNT(*) as cnt FROM plant_molecules`) as unknown as [any[]];
    const [orphanMolRows] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM molecules m
      WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.molecule_id = m.id)
    `) as unknown as [any[]];
    const [orphanPlantRows] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM plants p
      WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id = p.id)
    `) as unknown as [any[]];

    return {
      totalMolecules: Number((molRows as any[])[0]?.cnt || 0),
      totalPlants: Number((plantRows as any[])[0]?.cnt || 0),
      totalLinks: Number((linkRows as any[])[0]?.cnt || 0),
      orphanMolecules: Number((orphanMolRows as any[])[0]?.cnt || 0),
      orphanPlants: Number((orphanPlantRows as any[])[0]?.cnt || 0),
    };
  }),

  // Get duplicate molecule groups (same name, different IDs)
  getDuplicateGroups: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const [rows] = await db.execute(sql`
      SELECT 
        LOWER(TRIM(name)) as normalized_name,
        GROUP_CONCAT(id ORDER BY id) as ids,
        GROUP_CONCAT(name ORDER BY id SEPARATOR '|||') as names,
        COUNT(*) as cnt
      FROM molecules
      GROUP BY LOWER(TRIM(name))
      HAVING cnt > 1
      ORDER BY cnt DESC
      LIMIT 100
    `) as unknown as [any[]];

    return (rows as any[]).map(r => ({
      normalizedName: r.normalized_name,
      ids: String(r.ids).split(',').map(Number),
      names: String(r.names).split('|||'),
      count: Number(r.cnt),
    }));
  }),

  // Merge all duplicate molecules (keep lowest ID, reassign links)
  mergeAllDuplicates: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [dupRows] = await db.execute(sql`
      SELECT 
        MIN(id) as keep_id,
        GROUP_CONCAT(id ORDER BY id) as all_ids
      FROM molecules
      GROUP BY LOWER(TRIM(name))
      HAVING COUNT(*) > 1
    `) as unknown as [any[]];

    let mergedCount = 0;
    for (const row of (dupRows as any[])) {
      const keepId = Number(row.keep_id);
      const allIds: number[] = String(row.all_ids).split(',').map(Number);
      const toDelete = allIds.filter(id => id !== keepId);

      for (const deleteId of toDelete) {
        // Reassign plant_molecules links
        await db.execute(sql`
          UPDATE plant_molecules SET molecule_id = ${keepId}
          WHERE molecule_id = ${deleteId}
          AND NOT EXISTS (
            SELECT 1 FROM plant_molecules pm2
            WHERE pm2.molecule_id = ${keepId} AND pm2.plant_id = plant_molecules.plant_id
          )
        `);
        // Delete orphaned links
        await db.execute(sql`DELETE FROM plant_molecules WHERE molecule_id = ${deleteId}`);
        // Delete duplicate molecule
        await db.execute(sql`DELETE FROM molecules WHERE id = ${deleteId}`);
        mergedCount++;
      }
    }

    return { mergedCount };
  }),

  // Merge specific duplicate molecules
  mergeDuplicates: protectedProcedure
    .input(z.object({ keepId: z.number(), deleteIds: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { keepId, deleteIds } = input;

      for (const deleteId of deleteIds) {
        await db.execute(sql`
          UPDATE plant_molecules SET molecule_id = ${keepId}
          WHERE molecule_id = ${deleteId}
          AND NOT EXISTS (
            SELECT 1 FROM plant_molecules pm2
            WHERE pm2.molecule_id = ${keepId} AND pm2.plant_id = plant_molecules.plant_id
          )
        `);
        await db.execute(sql`DELETE FROM plant_molecules WHERE molecule_id = ${deleteId}`);
        await db.execute(sql`DELETE FROM molecules WHERE id = ${deleteId}`);
      }

      return { success: true, mergedCount: deleteIds.length };
    }),

  // Get plant-molecule relations for a specific plant
  getPlantMoleculeRelations: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const [rows] = await db.execute(sql`
        SELECT pm.id, pm.plant_id, pm.molecule_id, pm.percentage, pm.source,
               m.name as molecule_name, m.cas_number, m.chemical_family
        FROM plant_molecules pm
        JOIN molecules m ON pm.molecule_id = m.id
        WHERE pm.plant_id = ${input.plantId}
        ORDER BY pm.percentage DESC, m.name
      `) as unknown as [any[]];

      return (rows as any[]).map(r => ({
        id: Number(r.id),
        plantId: Number(r.plant_id),
        moleculeId: Number(r.molecule_id),
        moleculeName: r.molecule_name,
        casNumber: r.cas_number || null,
        chemicalFamily: r.chemical_family || null,
        percentage: r.percentage ? Number(r.percentage) : null,
        source: r.source || null,
      }));
    }),

  // Add a plant-molecule relation
  addPlantMoleculeRelation: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
      percentage: z.number().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.execute(sql`
        INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, percentage, source)
        VALUES (${input.plantId}, ${input.moleculeId}, ${input.percentage ?? null}, ${input.source ?? null})
      `);

      return { success: true };
    }),

  // Remove a plant-molecule relation
  removePlantMoleculeRelation: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.execute(sql`DELETE FROM plant_molecules WHERE id = ${input.id}`);
      return { success: true };
    }),

  // Get data quality stats
  getDataQualityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { plantsWithoutLatinName: 0, plantsWithoutCategory: 0, moleculesWithoutCas: 0, moleculesWithoutFamily: 0 };

    const [r1] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM plants WHERE latin_name IS NULL OR latin_name = ''
    `) as unknown as [any[]];
    const [r2] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM plants WHERE category IS NULL OR category = ''
    `) as unknown as [any[]];
    const [r3] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM molecules WHERE cas_number IS NULL OR cas_number = ''
    `) as unknown as [any[]];
    const [r4] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM molecules WHERE chemical_family IS NULL OR chemical_family = ''
    `) as unknown as [any[]];

    return {
      plantsWithoutLatinName: Number((r1 as any[])[0]?.cnt || 0),
      plantsWithoutCategory: Number((r2 as any[])[0]?.cnt || 0),
      moleculesWithoutCas: Number((r3 as any[])[0]?.cnt || 0),
      moleculesWithoutFamily: Number((r4 as any[])[0]?.cnt || 0),
    };
  }),

  // Get malformed plants (missing critical fields)
  getMalformedPlants: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const [rows] = await db.execute(sql`
      SELECT id, name, latin_name, category, wikidata_qid,
        CASE
          WHEN latin_name IS NULL OR latin_name = '' THEN 'Nom latin manquant'
          WHEN category IS NULL OR category = '' THEN 'Catégorie manquante'
          WHEN wikidata_qid IS NULL THEN 'QID Wikidata manquant'
          ELSE 'Autre'
        END as issue
      FROM plants
      WHERE latin_name IS NULL OR latin_name = ''
         OR category IS NULL OR category = ''
         OR wikidata_qid IS NULL
      ORDER BY name
      LIMIT 100
    `) as unknown as [any[]];

    return (rows as any[]).map(r => ({
      id: Number(r.id),
      name: r.name,
      latinName: r.latin_name || null,
      category: r.category || null,
      wikidataQid: r.wikidata_qid || null,
      issue: r.issue,
    }));
  }),

  // Get variety genealogy — connecté aux données réelles
  getVarietyGenealogy: publicProcedure
    .input(z.object({ varietyId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { varietyId: input.varietyId, nodes: [], links: [], ancestorCount: 0, descendantCount: 0 };

      const { varietyId } = input;

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

      const allIds = new Set<number>([varietyId]);
      ancestors.forEach((r: any) => { allIds.add(Number(r.parent_variety_id)); allIds.add(Number(r.variety_id)); });
      descendants.forEach((r: any) => { allIds.add(Number(r.variety_id)); allIds.add(Number(r.parent_variety_id)); });

      const idList = Array.from(allIds).join(',');
      const [plantRows] = await db.execute(sql`
        SELECT id, name, category FROM plants WHERE id IN (${sql.raw(idList)})
      `) as any;
      const plantMap = new Map<number, { name: string; category: string }>();
      (Array.isArray(plantRows) ? plantRows : []).forEach((p: any) => {
        plantMap.set(Number(p.id), { name: p.name, category: p.category });
      });

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
