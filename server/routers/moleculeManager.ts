/**
 * Router tRPC — Molecule Manager
 * Gestion des doublons de molécules et des relations plantes-molécules
 * Outil d'administration dédié
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

// Router
export const moleculeManagerRouter = router({

  // Statistiques globales
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [totalMolecules] = await db.execute(sql`SELECT COUNT(*) as count FROM molecules`);
    const [totalPlants] = await db.execute(sql`SELECT COUNT(*) as count FROM plants`);
    const [totalLinks] = await db.execute(sql`SELECT COUNT(*) as count FROM plant_molecules`);
    const [plantsWithLinks] = await db.execute(sql`SELECT COUNT(DISTINCT plant_id) as count FROM plant_molecules`);
    const [moleculesWithLinks] = await db.execute(sql`SELECT COUNT(DISTINCT molecule_id) as count FROM plant_molecules`);
    const [duplicateGroups] = await db.execute(sql`
      SELECT COUNT(*) as count FROM (
        SELECT LOWER(TRIM(name)) FROM molecules GROUP BY LOWER(TRIM(name)) HAVING COUNT(*) > 1
      ) t
    `);
    const [duplicateMolecules] = await db.execute(sql`
      SELECT COUNT(*) as count FROM molecules 
      WHERE LOWER(TRIM(name)) IN (
        SELECT LOWER(TRIM(name)) FROM molecules GROUP BY LOWER(TRIM(name)) HAVING COUNT(*) > 1
      )
    `);
    const [orphanMolecules] = await db.execute(sql`
      SELECT COUNT(*) as count FROM molecules m
      WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.molecule_id = m.id)
      AND NOT EXISTS (SELECT 1 FROM molecules_recettes mr WHERE mr.molecule_id = m.id)
    `);
    const [orphanPlants] = await db.execute(sql`
      SELECT COUNT(*) as count FROM plants p
      WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id = p.id)
    `);

    const tm = (totalMolecules as any[])[0];
    const tp = (totalPlants as any[])[0];
    const tl = (totalLinks as any[])[0];
    const pwl = (plantsWithLinks as any[])[0];
    const mwl = (moleculesWithLinks as any[])[0];
    const dg = (duplicateGroups as any[])[0];
    const dm = (duplicateMolecules as any[])[0];
    const om = (orphanMolecules as any[])[0];
    const op = (orphanPlants as any[])[0];

    return {
      totalMolecules: tm.count,
      totalPlants: tp.count,
      totalLinks: tl.count,
      plantsWithLinks: pwl.count,
      moleculesWithLinks: mwl.count,
      plantCoverage: Math.round((pwl.count / tp.count) * 100),
      moleculeCoverage: Math.round((mwl.count / tm.count) * 100),
      duplicateGroups: dg.count,
      duplicateMolecules: dm.count,
      orphanMolecules: om.count,
      orphanPlants: op.count,
    };
  }),

  // Analyse des doublons
  getDuplicateGroups: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Trouver les groupes de doublons par nom normalisé
    const groupsResult = await db.execute(sql`
      SELECT 
        LOWER(TRIM(name)) as name_normalized,
        COUNT(*) as count,
        GROUP_CONCAT(id ORDER BY id SEPARATOR ',') as ids
      FROM molecules
      GROUP BY LOWER(TRIM(name))
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC, LOWER(TRIM(name))
    `);

    const groups = (groupsResult[0] as any[]) || [];
    const result = [];

    for (const group of groups) {
      const rawIds = group.ids || '';
      const ids = rawIds.split(',').map(Number).filter((id: number) => !isNaN(id) && id > 0);
      if (ids.length === 0) continue;

      // Récupérer les détails de chaque molécule individuellement
      const molecules = [];
      for (const id of ids) {
        // Infos de base
        const molResult = await db.execute(sql`
          SELECT id, name, cas_number, chemical_class, family, chemicalFormula, olfactiveProfile, smiles, iupac_name, status
          FROM molecules
          WHERE id = ${id}
        `);
        const mol = (molResult[0] as any[])[0];
        if (!mol) continue;

        // Compter les relations séparément
        const [plResult] = await db.execute(sql`SELECT COUNT(*) as c FROM plant_molecules WHERE molecule_id = ${id}`);
        const [rlResult] = await db.execute(sql`SELECT COUNT(*) as c FROM molecules_recettes WHERE molecule_id = ${id}`);
        const [flResult] = await db.execute(sql`SELECT COUNT(*) as c FROM molecule_chemical_families WHERE moleculeId = ${id}`);
        const [ilResult] = await db.execute(sql`SELECT COUNT(*) as c FROM ifra_restrictions WHERE molecule_id = ${id}`);

        molecules.push({
          ...mol,
          plant_links: (plResult as any[])[0]?.c ?? 0,
          recipe_links: (rlResult as any[])[0]?.c ?? 0,
          family_links: (flResult as any[])[0]?.c ?? 0,
          ifra_links: (ilResult as any[])[0]?.c ?? 0,
        });
      }

      result.push({
        nameNormalized: group.name_normalized,
        count: group.count,
        molecules,
      });
    }

    return result;
  }),

  // Fusion des doublons
  mergeDuplicates: publicProcedure
    .input(z.object({
      keepId: z.number(),
      removeIds: z.array(z.number()),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const { keepId, removeIds, dryRun } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let totalMigrated = 0;

      for (const removeId of removeIds) {
        const [plantLinksResult] = await db.execute(sql`SELECT COUNT(*) as c FROM plant_molecules WHERE molecule_id = ${removeId}`);
        const [recipeLinksResult] = await db.execute(sql`SELECT COUNT(*) as c FROM molecules_recettes WHERE molecule_id = ${removeId}`);
        const plantLinks = (plantLinksResult as any[])[0]?.c ?? 0;
        const recipeLinks = (recipeLinksResult as any[])[0]?.c ?? 0;
        totalMigrated += plantLinks + recipeLinks;

        if (!dryRun) {
          // Migrer plant_molecules (éviter les doublons)
          await db.execute(sql`
            UPDATE plant_molecules SET molecule_id = ${keepId}
            WHERE molecule_id = ${removeId}
            AND NOT EXISTS (
              SELECT 1 FROM (SELECT plant_id FROM plant_molecules WHERE molecule_id = ${keepId}) tmp
              WHERE tmp.plant_id = plant_molecules.plant_id
            )
          `);
          await db.execute(sql`DELETE FROM plant_molecules WHERE molecule_id = ${removeId}`);

          // Migrer molecules_recettes
          await db.execute(sql`
            UPDATE molecules_recettes SET molecule_id = ${keepId}
            WHERE molecule_id = ${removeId}
            AND NOT EXISTS (
              SELECT 1 FROM (SELECT recette_id FROM molecules_recettes WHERE molecule_id = ${keepId}) tmp
              WHERE tmp.recette_id = molecules_recettes.recette_id
            )
          `);
          await db.execute(sql`DELETE FROM molecules_recettes WHERE molecule_id = ${removeId}`);

          // Migrer molecule_chemical_families
          await db.execute(sql`
            UPDATE molecule_chemical_families SET moleculeId = ${keepId}
            WHERE moleculeId = ${removeId}
            AND NOT EXISTS (
              SELECT 1 FROM (SELECT chemicalFamilyId FROM molecule_chemical_families WHERE moleculeId = ${keepId}) tmp
              WHERE tmp.chemicalFamilyId = molecule_chemical_families.chemicalFamilyId
            )
          `);
          await db.execute(sql`DELETE FROM molecule_chemical_families WHERE moleculeId = ${removeId}`);

          // Migrer ifra_restrictions
          await db.execute(sql`
            UPDATE ifra_restrictions SET molecule_id = ${keepId}
            WHERE molecule_id = ${removeId}
            AND NOT EXISTS (
              SELECT 1 FROM (SELECT category_id FROM ifra_restrictions WHERE molecule_id = ${keepId}) tmp
              WHERE tmp.category_id = ifra_restrictions.category_id
            )
          `);
          await db.execute(sql`DELETE FROM ifra_restrictions WHERE molecule_id = ${removeId}`);

          // Autres tables
          await db.execute(sql`UPDATE terpene_synergies SET terpene1_id = ${keepId} WHERE terpene1_id = ${removeId}`);
          await db.execute(sql`UPDATE terpene_synergies SET terpene2_id = ${keepId} WHERE terpene2_id = ${removeId}`);
          await db.execute(sql`UPDATE molecule_notes SET molecule_id = ${keepId} WHERE molecule_id = ${removeId}`);

          // Supprimer le doublon
          await db.execute(sql`DELETE FROM molecules WHERE id = ${removeId}`);
        }
      }

      return {
        success: true,
        dryRun,
        keepId,
        removeIds,
        totalMigrated,
        message: dryRun
          ? `Simulation : ${removeIds.length} doublon(s) seraient fusionnés, ${totalMigrated} relations migrées`
          : `Fusion : ${removeIds.length} doublon(s) supprimés, ${totalMigrated} relations migrées`,
      };
    }),

  mergeAllDuplicates: publicProcedure
    .input(z.object({ dryRun: z.boolean().default(true) }))
    .mutation(async ({ input }) => {
      const { dryRun } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const groupsResult = await db.execute(sql`
        SELECT 
          LOWER(TRIM(name)) as name_normalized,
          COUNT(*) as count,
          MIN(id) as keep_id,
          GROUP_CONCAT(id ORDER BY id SEPARATOR ',') as all_ids
        FROM molecules
        GROUP BY LOWER(TRIM(name))
        HAVING COUNT(*) > 1
        ORDER BY LOWER(TRIM(name))
      `);

      const groups = (groupsResult[0] as any[]) || [];
      let totalMerged = 0;
      let totalMigrated = 0;
      const results = [];

      for (const group of groups) {
        const allIds = (group.all_ids || '').split(',').map(Number).filter((id: number) => !isNaN(id) && id > 0);
        const keepId = group.keep_id;
        const removeIds = allIds.filter((id: number) => id !== keepId);

        for (const removeId of removeIds) {
          const [plantLinksResult] = await db.execute(sql`SELECT COUNT(*) as c FROM plant_molecules WHERE molecule_id = ${removeId}`);
          const [recipeLinksResult] = await db.execute(sql`SELECT COUNT(*) as c FROM molecules_recettes WHERE molecule_id = ${removeId}`);
          const migrated = ((plantLinksResult as any[])[0]?.c ?? 0) + ((recipeLinksResult as any[])[0]?.c ?? 0);

          if (!dryRun) {
            await db.execute(sql`
              UPDATE plant_molecules SET molecule_id = ${keepId}
              WHERE molecule_id = ${removeId}
              AND NOT EXISTS (
                SELECT 1 FROM (SELECT plant_id FROM plant_molecules WHERE molecule_id = ${keepId}) tmp
                WHERE tmp.plant_id = plant_molecules.plant_id
              )
            `);
            await db.execute(sql`DELETE FROM plant_molecules WHERE molecule_id = ${removeId}`);

            await db.execute(sql`
              UPDATE molecules_recettes SET molecule_id = ${keepId}
              WHERE molecule_id = ${removeId}
              AND NOT EXISTS (
                SELECT 1 FROM (SELECT recette_id FROM molecules_recettes WHERE molecule_id = ${keepId}) tmp
                WHERE tmp.recette_id = molecules_recettes.recette_id
              )
            `);
            await db.execute(sql`DELETE FROM molecules_recettes WHERE molecule_id = ${removeId}`);

            await db.execute(sql`DELETE FROM molecule_chemical_families WHERE moleculeId = ${removeId}`);
            await db.execute(sql`DELETE FROM ifra_restrictions WHERE molecule_id = ${removeId}`);
            await db.execute(sql`UPDATE terpene_synergies SET terpene1_id = ${keepId} WHERE terpene1_id = ${removeId}`);
            await db.execute(sql`UPDATE terpene_synergies SET terpene2_id = ${keepId} WHERE terpene2_id = ${removeId}`);
            await db.execute(sql`UPDATE molecule_notes SET molecule_id = ${keepId} WHERE molecule_id = ${removeId}`);
            await db.execute(sql`DELETE FROM molecules WHERE id = ${removeId}`);
          }

          totalMigrated += migrated;
          totalMerged++;
        }

        results.push({
          name: group.name_normalized,
          keepId,
          removeIds,
          count: group.count,
        });
      }

      return {
        success: true,
        dryRun,
        totalGroups: groups.length,
        totalMerged,
        totalMigrated,
        results,
        message: dryRun
          ? `Simulation : ${totalMerged} doublons seraient fusionnés, ${totalMigrated} relations migrées`
          : `Fusion complète : ${totalMerged} doublons supprimés, ${totalMigrated} relations migrées`,
      };
    }),

  // Relations plantes-molécules
  getPlantMoleculeRelations: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const { page, pageSize } = input;
      const offset = (page - 1) * pageSize;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [totalResult] = await db.execute(sql`SELECT COUNT(*) as count FROM plant_molecules`);
      const total = ((totalResult as any[])[0]?.count) ?? 0;

      const relationsResult = await db.execute(sql`
        SELECT 
          pm.plant_id,
          pm.molecule_id,
          pm.percentage,
          pm.percentage_typical,
          pm.percentage_min,
          pm.percentage_max,
          pm.source,
          pm.role,
          pm.is_signature,
          p.name as plant_name,
          p.latin_name as plant_scientific_name,
          m.name as molecule_name,
          m.cas_number as molecule_cas
        FROM plant_molecules pm
        LEFT JOIN plants p ON pm.plant_id = p.id
        LEFT JOIN molecules m ON pm.molecule_id = m.id
        ORDER BY pm.plant_id DESC
        LIMIT ${sql.raw(String(pageSize))} OFFSET ${sql.raw(String(offset))}
      `);

      return {
        total,
        page,
        pageSize,
        relations: (relationsResult[0] as any[]) || [],
      };
    }),

  addPlantMoleculeRelation: publicProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
      percentage: z.number().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { plantId, moleculeId, percentage, source } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Vérifier si la relation existe déjà
      const [existingResult] = await db.execute(sql`
        SELECT id FROM plant_molecules WHERE plant_id = ${plantId} AND molecule_id = ${moleculeId}
      `);
      if ((existingResult as any[]).length > 0) {
        throw new Error("Cette relation plante-molécule existe déjà");
      }

      await db.execute(sql`
        INSERT INTO plant_molecules (plant_id, molecule_id, percentage, source)
        VALUES (${plantId}, ${moleculeId}, ${percentage ?? null}, ${source ?? null})
      `);

      return { success: true, message: "Relation créée avec succès" };
    }),

  removePlantMoleculeRelation: publicProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { plantId, moleculeId } = input;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.execute(sql`DELETE FROM plant_molecules WHERE plant_id = ${plantId} AND molecule_id = ${moleculeId}`);
      return { success: true, message: "Relation supprimée" };
    }),

  // Qualité des données
  getDataQualityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [totalPlants] = await db.execute(sql`SELECT COUNT(*) as count FROM plants`);
    const [totalMols] = await db.execute(sql`SELECT COUNT(*) as count FROM molecules`);
    const [totalLinks] = await db.execute(sql`SELECT COUNT(*) as count FROM plant_molecules`);
    const [withLinks] = await db.execute(sql`SELECT COUNT(DISTINCT plant_id) as count FROM plant_molecules`);
    const [noLatin] = await db.execute(sql`SELECT COUNT(*) as count FROM plants WHERE latin_name IS NULL OR latin_name = '' OR latin_name = 'null'`);
    const [dupPlants] = await db.execute(sql`
      SELECT COUNT(*) as count FROM (
        SELECT LOWER(TRIM(name)) FROM plants GROUP BY LOWER(TRIM(name)) HAVING COUNT(*) > 1
      ) t
    `);
    const [badNames] = await db.execute(sql`SELECT COUNT(*) as count FROM plants WHERE name LIKE '%;%'`);
    const [badLatins] = await db.execute(sql`SELECT COUNT(*) as count FROM plants WHERE latin_name LIKE '%;%'`);

    const tp = (totalPlants as any[])[0];
    const tm = (totalMols as any[])[0];
    const tl = (totalLinks as any[])[0];
    const wl = (withLinks as any[])[0];
    const nl = (noLatin as any[])[0];
    const dp = (dupPlants as any[])[0];
    const bn = (badNames as any[])[0];
    const bl = (badLatins as any[])[0];

    return {
      totalPlants: Number(tp.count),
      totalMolecules: Number(tm.count),
      totalLinks: Number(tl.count),
      plantsWithCompositions: Number(wl.count),
      coveragePercent: Math.round(Number(wl.count) / Number(tp.count) * 100),
      plantsWithoutLatinName: Number(nl.count),
      duplicatePlantGroups: Number(dp.count),
      malformedNames: Number(bn.count),
      malformedLatinNames: Number(bl.count),
    };
  }),

  getPlantDuplicates: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const groups = await db.execute(sql`
      SELECT LOWER(TRIM(name)) as name_lower, COUNT(*) as cnt
      FROM plants 
      GROUP BY LOWER(TRIM(name)) 
      HAVING cnt > 1 
      ORDER BY cnt DESC
      LIMIT 50
    `);

    const result = [];
    for (const group of (groups as any[])) {
      const plants = await db.execute(sql`
        SELECT id, name, latin_name, family, category
        FROM plants 
        WHERE LOWER(TRIM(name)) = ${group.name_lower}
        ORDER BY id ASC
      `);
      result.push({
        nameLower: group.name_lower,
        count: Number(group.cnt),
        plants: (plants as any[]).map(p => ({
          id: Number(p.id),
          name: p.name,
          latinName: p.latin_name,
          family: p.family,
          category: p.category,
        })),
      });
    }
    return result;
  }),

  getMalformedPlants: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const rows = await db.execute(sql`
      SELECT id, name, latin_name, family, category
      FROM plants 
      WHERE name LIKE '%;%'
         OR latin_name LIKE '%;%'
         OR name LIKE '%References%'
         OR name LIKE '%World Flora%'
         OR name LIKE 'EN: %'
         OR name LIKE 'FR: %'
         OR name LIKE '• %'
      ORDER BY id
      LIMIT 100
    `);

    return (rows as any[]).map(r => ({
      id: Number(r.id),
      name: r.name,
      latinName: r.latin_name,
      family: r.family,
      category: r.category,
    }));
  }),

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

  getVarietyGenealogy: publicProcedure
    .input(z.object({ varietyId: z.number() }))
    .query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Récupérer la variété
    const [variety] = await db.execute(sql`
      SELECT id, name, category FROM plants WHERE id = ${input.varietyId}
    `);
    if ((variety as any[]).length === 0) {
      throw new Error(`Variété non trouvée : ${input.varietyId}`);
    }
    const v = (variety as any[])[0];

    // Récupérer les ancêtres (parents, grands-parents, etc.)
    const [ancestors] = await db.execute(sql`
      WITH RECURSIVE ancestor_tree AS (
        SELECT vg.variety_id, vg.parent_variety_id, p1.name as variety_name, p2.name as parent_name,
               vg.relationship_type, vg.breeder, vg.notes, 1 as depth
        FROM variety_genealogy vg
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE p1.id = ${input.varietyId}
        
        UNION ALL
        
        SELECT vg.variety_id, vg.parent_variety_id, p1.name, p2.name,
               vg.relationship_type, vg.breeder, vg.notes, at.depth + 1
        FROM variety_genealogy vg
        JOIN ancestor_tree at ON vg.variety_id = at.parent_variety_id
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE at.depth < 5
      )
      SELECT variety_id, parent_variety_id, variety_name, parent_name, relationship_type, breeder, notes, depth
      FROM ancestor_tree
      ORDER BY depth, variety_name
    `);

    // Récupérer les descendants (enfants, petits-enfants, etc.)
    const [descendants] = await db.execute(sql`
      WITH RECURSIVE descendant_tree AS (
        SELECT vg.variety_id, vg.parent_variety_id, p1.name as variety_name, p2.name as parent_name,
               vg.relationship_type, vg.breeder, vg.notes, 1 as depth
        FROM variety_genealogy vg
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE p2.id = ${input.varietyId}
        
        UNION ALL
        
        SELECT vg.variety_id, vg.parent_variety_id, p1.name, p2.name,
               vg.relationship_type, vg.breeder, vg.notes, dt.depth + 1
        FROM variety_genealogy vg
        JOIN descendant_tree dt ON vg.parent_variety_id = dt.variety_id
        JOIN plants p1 ON vg.variety_id = p1.id
        JOIN plants p2 ON vg.parent_variety_id = p2.id
        WHERE dt.depth < 5
      )
      SELECT variety_id, parent_variety_id, variety_name, parent_name, relationship_type, breeder, notes, depth
      FROM descendant_tree
      ORDER BY depth, variety_name
    `);

    // Formater les résultats pour D3.js/React Flow
    const nodes: any[] = [
      {
        id: String(input.varietyId),
        label: v.name,
        type: 'root',
        category: v.category,
      },
    ];
    const links: any[] = [];

    // Ajouter les ancêtres
    (ancestors as any[]).forEach(a => {
      if (!nodes.find(n => n.id === String(a.parent_variety_id))) {
        nodes.push({
          id: String(a.parent_variety_id),
          label: a.parent_name,
          type: 'ancestor',
          depth: a.depth,
        });
      }
      links.push({
        source: String(a.parent_variety_id),
        target: String(a.variety_id),
        type: a.relationship_type,
        breeder: a.breeder,
        notes: a.notes,
      });
    });

    // Ajouter les descendants
    (descendants as any[]).forEach(d => {
      if (!nodes.find(n => n.id === String(d.variety_id))) {
        nodes.push({
          id: String(d.variety_id),
          label: d.variety_name,
          type: 'descendant',
          depth: d.depth,
        });
      }
      links.push({
        source: String(d.parent_variety_id),
        target: String(d.variety_id),
        type: d.relationship_type,
        breeder: d.breeder,
        notes: d.notes,
      });
    });

    return {
      variety: {
        id: v.id,
        name: v.name,
        category: v.category,
      },
      nodes,
      links,
      ancestorCount: (ancestors as any[]).length,
      descendantCount: (descendants as any[]).length,
    };
      }),


});
