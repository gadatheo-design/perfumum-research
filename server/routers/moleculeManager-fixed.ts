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
    if (!db) return { totalMolecules: 0, totalPlants: 0, totalLinks: 0, orphanMolecules: 0, orphanPlants: 0, plantCoverage: 0, moleculeCoverage: 0, duplicateGroups: 0, duplicateMolecules: 0 };

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
    const [dupGroupRows] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM (
        SELECT LOWER(TRIM(name)) as normalized_name
        FROM molecules
        GROUP BY normalized_name
        HAVING COUNT(*) > 1
      ) as dup_groups
    `) as unknown as [any[]];
    const [dupMolRows] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM molecules m
      WHERE EXISTS (
        SELECT 1 FROM molecules m2
        WHERE LOWER(TRIM(m2.name)) = LOWER(TRIM(m.name))
        AND m2.id != m.id
      )
    `) as unknown as [any[]];

    const totalMol = Number((molRows as any[])[0]?.cnt || 0);
    const totalPlants = Number((plantRows as any[])[0]?.cnt || 0);
    const plantsWithLinks = totalPlants > 0 ? Math.round((totalPlants - Number((orphanPlantRows as any[])[0]?.cnt || 0)) / totalPlants * 100) : 0;
    const molsWithLinks = totalMol > 0 ? Math.round((totalMol - Number((orphanMolRows as any[])[0]?.cnt || 0)) / totalMol * 100) : 0;

    return {
      totalMolecules: totalMol,
      totalPlants: totalPlants,
      totalLinks: Number((linkRows as any[])[0]?.cnt || 0),
      orphanMolecules: Number((orphanMolRows as any[])[0]?.cnt || 0),
      orphanPlants: Number((orphanPlantRows as any[])[0]?.cnt || 0),
      plantCoverage: plantsWithLinks,
      moleculeCoverage: molsWithLinks,
      duplicateGroups: Number((dupGroupRows as any[])[0]?.cnt || 0),
      duplicateMolecules: Number((dupMolRows as any[])[0]?.cnt || 0),
    };
  }),

  // Get duplicate molecule groups (same name, different IDs)
  getDuplicateGroups: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const [rows] = await db.execute(sql`
      SELECT 
        LOWER(TRIM(name)) as nameNormalized,
        COUNT(*) as count,
        GROUP_CONCAT(id ORDER BY id) as ids,
        GROUP_CONCAT(name ORDER BY id) as names
      FROM molecules
      GROUP BY LOWER(TRIM(name))
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `) as unknown as [any[]];

    if (!Array.isArray(rows)) return [];

    return rows.map((r: any) => {
      const ids = String(r.ids).split(',').map(Number);
      const names = String(r.names).split(',');
      
      return {
        nameNormalized: r.nameNormalized,
        count: Number(r.count),
        ids,
        molecules: ids.map((id, idx) => ({ id, name: names[idx] || '' })),
      };
    });
  }),

  // Merge duplicate molecules
  mergeDuplicates: protectedProcedure
    .input(z.object({
      keepId: z.number(),
      removeIds: z.array(z.number()),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (input.dryRun) {
        return { success: true, message: `[DRY RUN] Fusionnerait ${input.removeIds.length} molécules en ID ${input.keepId}` };
      }

      // Merge plant_molecules links
      await db.execute(sql`
        UPDATE plant_molecules
        SET molecule_id = ${input.keepId}
        WHERE molecule_id IN (${sql.raw(input.removeIds.join(','))})
      `);

      // Delete duplicates
      await db.execute(sql`
        DELETE FROM molecules
        WHERE id IN (${sql.raw(input.removeIds.join(','))})
      `);

      return { success: true, message: `Fusion effectuée: ${input.removeIds.length} molécules supprimées` };
    }),

  // Merge all duplicates at once
  mergeAllDuplicates: protectedProcedure
    .input(z.object({ dryRun: z.boolean().default(true) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [dupGroups] = await db.execute(sql`
        SELECT 
          LOWER(TRIM(name)) as nameNormalized,
          GROUP_CONCAT(id ORDER BY id) as ids
        FROM molecules
        GROUP BY LOWER(TRIM(name))
        HAVING COUNT(*) > 1
      `) as unknown as [any[]];

      if (!Array.isArray(dupGroups) || dupGroups.length === 0) {
        return { success: true, message: "Aucun doublon détecté", results: [] };
      }

      const results: any[] = [];

      for (const group of dupGroups) {
        const ids = String(group.ids).split(',').map(Number);
        const keepId = Math.min(...ids);
        const removeIds = ids.filter(id => id !== keepId);

        if (input.dryRun) {
          const [nameRow] = await db.execute(sql`SELECT name FROM molecules WHERE id = ${keepId}`) as unknown as [any[]];
          results.push({
            name: (nameRow as any[])[0]?.name || 'Unknown',
            keepId,
            removeIds,
          });
        } else {
          await db.execute(sql`
            UPDATE plant_molecules
            SET molecule_id = ${keepId}
            WHERE molecule_id IN (${sql.raw(removeIds.join(','))})
          `);

          await db.execute(sql`
            DELETE FROM molecules
            WHERE id IN (${sql.raw(removeIds.join(','))})
          `);

          const [nameRow] = await db.execute(sql`SELECT name FROM molecules WHERE id = ${keepId}`) as unknown as [any[]];
          results.push({
            name: (nameRow as any[])[0]?.name || 'Unknown',
            keepId,
            removeIds,
          });
        }
      }

      const message = input.dryRun
        ? `[DRY RUN] ${dupGroups.length} groupes de doublons détectés`
        : `${dupGroups.length} groupes de doublons fusionnés`;

      return { success: true, message, results };
    }),

  // Get plant-molecule relations with pagination
  getPlantMoleculeRelations: publicProcedure
    .input(z.object({ page: z.number().default(1), pageSize: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { relations: [], total: 0 };

      const offset = (input.page - 1) * input.pageSize;

      // Get total count
      const [countRows] = await db.execute(sql`
        SELECT COUNT(*) as cnt FROM plant_molecules
      `) as unknown as [any[]];
      const total = Number((countRows as any[])[0]?.cnt || 0);

      // Get paginated results
      const [rows] = await db.execute(sql`
        SELECT pm.id, pm.plant_id, pm.molecule_id, pm.percentage, pm.percentage_min, pm.percentage_max, pm.percentage_typical, pm.source,
               m.name as molecule_name, m.cas_number as molecule_cas, m.chemical_family,
               p.name as plant_name, p.latin_name as plant_scientific_name
        FROM plant_molecules pm
        JOIN molecules m ON pm.molecule_id = m.id
        JOIN plants p ON pm.plant_id = p.id
        ORDER BY p.name, m.name
        LIMIT ${input.pageSize} OFFSET ${offset}
      `) as unknown as [any[]];

      const relations = (rows as any[]).map(r => ({
        plant_id: Number(r.plant_id),
        molecule_id: Number(r.molecule_id),
        plant_name: r.plant_name || '',
        plant_scientific_name: r.plant_scientific_name || null,
        molecule_name: r.molecule_name || '',
        molecule_cas: r.molecule_cas || null,
        percentage: r.percentage ? Number(r.percentage) : null,
        percentage_min: r.percentage_min ? Number(r.percentage_min) : null,
        percentage_max: r.percentage_max ? Number(r.percentage_max) : null,
        percentage_typical: r.percentage_typical ? Number(r.percentage_typical) : null,
        source: r.source || null,
      }));

      return { relations, total };
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

      return { success: true, message: "Relation ajoutée avec succès" };
    }),

  // Remove a plant-molecule relation
  removePlantMoleculeRelation: protectedProcedure
    .input(z.object({ plantId: z.number(), moleculeId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.execute(sql`
        DELETE FROM plant_molecules 
        WHERE plant_id = ${input.plantId} AND molecule_id = ${input.moleculeId}
      `);
      
      return { success: true, message: "Relation supprimée" };
    }),

  // Get data quality stats
  getDataQualityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalPlants: 0, coveragePercent: 0, plantsWithCompositions: 0, plantsWithoutLatinName: 0, duplicatePlantGroups: 0, malformedNames: 0, malformedLatinNames: 0, totalMolecules: 0, totalLinks: 0 };

    const [r1] = await db.execute(sql`SELECT COUNT(*) as cnt FROM plants`) as unknown as [any[]];
    const [r2] = await db.execute(sql`
      SELECT COUNT(DISTINCT plant_id) as cnt FROM plant_molecules
    `) as unknown as [any[]];
    const [r3] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM plants WHERE latin_name IS NULL OR latin_name = ''
    `) as unknown as [any[]];
    const [r4] = await db.execute(sql`
      SELECT COUNT(DISTINCT LOWER(TRIM(name))) as cnt FROM plants
      GROUP BY LOWER(TRIM(name))
      HAVING COUNT(*) > 1
    `) as unknown as [any[]];
    const [r5] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM plants WHERE name LIKE '%,%' OR name LIKE '%;%'
    `) as unknown as [any[]];
    const [r6] = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM plants WHERE latin_name LIKE '%,%' OR latin_name LIKE '%;%'
    `) as unknown as [any[]];
    const [r7] = await db.execute(sql`SELECT COUNT(*) as cnt FROM molecules`) as unknown as [any[]];
    const [r8] = await db.execute(sql`SELECT COUNT(*) as cnt FROM plant_molecules`) as unknown as [any[]];

    const totalPlants = Number((r1 as any[])[0]?.cnt || 0);
    const plantsWithCompositions = Number((r2 as any[])[0]?.cnt || 0);
    const coveragePercent = totalPlants > 0 ? Math.round((plantsWithCompositions / totalPlants) * 100) : 0;

    return {
      totalPlants,
      coveragePercent,
      plantsWithCompositions,
      plantsWithoutLatinName: Number((r3 as any[])[0]?.cnt || 0),
      duplicatePlantGroups: Number((r4 as any[])[0]?.cnt || 0),
      malformedNames: Number((r5 as any[])[0]?.cnt || 0),
      malformedLatinNames: Number((r6 as any[])[0]?.cnt || 0),
      totalMolecules: Number((r7 as any[])[0]?.cnt || 0),
      totalLinks: Number((r8 as any[])[0]?.cnt || 0),
    };
  }),

  // Get malformed plants (missing critical fields)
  getMalformedPlants: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const [rows] = await db.execute(sql`
      SELECT id, name, latin_name, category, wikidata_qid
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
    }));
  }),

  // Get variety genealogy
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
