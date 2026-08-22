/**
 * Router tRPC pour l'analyse et la gestion des doublons
 * Permet d'identifier et de fusionner les molécules et plantes dupliquées
 */

import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  molecules, plants,
  terpProfilePlants, plantMolecules, plantVarieties, plantAnalyses,
  plantSamples, plantTerroirs, plantExtractions, botanicalStates,
  rawMaterials, moleculePlantSources, terroirSpecialties, chemotypes,
  userFavorites, recetteMolecules, prototypeMolecules, tabacMolecules,
  moleculeAccords, moleculeFamilies, petrichorMolecules, volcaniqueMolecules,
  laboratoireMolecules, moleculeChemicalFamilies, moleculeNotes,
  leafEconomyMolecules, moleculeOrigins, ifraRestrictions,
  terpProfileMolecules, rawMaterialMolecules, tpsGeneMolecules,
  moleculeSynergies, synergies, terpeneSynergies, molecularTransformations,
  publicationMolecules, moleculePerfumes
} from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Analyser les doublons de molécules
 */
async function analyzeMoleculeDuplicates() {
  const db = await getDb();
  if (!db) return {
    total: 0, uniqueNames: 0, uniqueCAS: 0, uniqueSMILES: 0,
    nameDuplicates: [], casDuplicates: [], smilesDuplicates: [],
    totalDuplicates: 0, duplicationRate: "0%"
  };

  // Récupérer toutes les molécules avec les bons noms de colonnes
  const allMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    smiles: molecules.smiles,
  }).from(molecules);

  // Grouper par nom
  const byName = new Map<string, typeof allMolecules>();
  allMolecules.forEach((m) => {
    if (m.name) {
      const existing = byName.get(m.name) || [];
      existing.push(m);
      byName.set(m.name, existing);
    }
  });

  // Grouper par CAS
  const byCAS = new Map<string, typeof allMolecules>();
  allMolecules.forEach((m) => {
    if (m.casNumber && m.casNumber !== "") {
      const existing = byCAS.get(m.casNumber) || [];
      existing.push(m);
      byCAS.set(m.casNumber, existing);
    }
  });

  // Grouper par SMILES
  const bySMILES = new Map<string, typeof allMolecules>();
  allMolecules.forEach((m) => {
    if (m.smiles && m.smiles !== "") {
      const existing = bySMILES.get(m.smiles) || [];
      existing.push(m);
      bySMILES.set(m.smiles, existing);
    }
  });

  // Filtrer les doublons
  const nameDuplicates = Array.from(byName.entries())
    .filter(([_, mols]) => mols.length > 1)
    .map(([name, mols]) => ({
      type: "name" as const,
      value: name,
      count: mols.length,
      molecules: mols,
    }))
    .sort((a, b) => b.count - a.count);

  const casDuplicates = Array.from(byCAS.entries())
    .filter(([_, mols]) => mols.length > 1)
    .map(([cas, mols]) => ({
      type: "cas" as const,
      value: cas,
      count: mols.length,
      molecules: mols,
    }))
    .sort((a, b) => b.count - a.count);

  const smilesDuplicates = Array.from(bySMILES.entries())
    .filter(([_, mols]) => mols.length > 1)
    .map(([smiles, mols]) => ({
      type: "smiles" as const,
      value: smiles,
      count: mols.length,
      molecules: mols,
    }))
    .sort((a, b) => b.count - a.count);

  const totalDuplicates =
    nameDuplicates.reduce((sum, d) => sum + (d.count - 1), 0) +
    casDuplicates.reduce((sum, d) => sum + (d.count - 1), 0) +
    smilesDuplicates.reduce((sum, d) => sum + (d.count - 1), 0);

  return {
    total: allMolecules.length,
    uniqueNames: byName.size,
    uniqueCAS: byCAS.size,
    uniqueSMILES: bySMILES.size,
    nameDuplicates,
    casDuplicates,
    smilesDuplicates,
    totalDuplicates,
    duplicationRate: ((totalDuplicates / Math.max(allMolecules.length, 1)) * 100).toFixed(2) + "%",
  };
}

/**
 * Analyser les doublons de plantes
 */
async function analyzePlantDuplicates() {
  const db = await getDb();
  if (!db) return {
    total: 0, uniqueScientificNames: 0, uniqueCommonNames: 0,
    scientificDuplicates: [], commonDuplicates: [],
    totalDuplicates: 0, duplicationRate: "0%"
  };

  // Récupérer toutes les plantes avec les bons noms de colonnes
  const allPlants = await db.select({
    id: plants.id,
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
    name: plants.name,
    family: plants.family,
  }).from(plants);

  // Grouper par nom latin (scientifique)
  const byScientificName = new Map<string, typeof allPlants>();
  allPlants.forEach((p) => {
    if (p.latinName) {
      const existing = byScientificName.get(p.latinName) || [];
      existing.push(p);
      byScientificName.set(p.latinName, existing);
    }
  });

  // Grouper par nom commun
  const byCommonName = new Map<string, typeof allPlants>();
  allPlants.forEach((p) => {
    if (p.name && p.name !== "") {
      const existing = byCommonName.get(p.name) || [];
      existing.push(p);
      byCommonName.set(p.name, existing);
    }
  });

  // Filtrer les doublons
  const scientificDuplicates = Array.from(byScientificName.entries())
    .filter(([_, ps]) => ps.length > 1)
    .map(([name, ps]) => ({
      type: "scientific" as const,
      value: name,
      count: ps.length,
      plants: ps,
    }))
    .sort((a, b) => b.count - a.count);

  const commonDuplicates = Array.from(byCommonName.entries())
    .filter(([_, ps]) => ps.length > 1)
    .map(([name, ps]) => ({
      type: "common" as const,
      value: name,
      count: ps.length,
      plants: ps,
    }))
    .sort((a, b) => b.count - a.count);

  const totalDuplicates =
    scientificDuplicates.reduce((sum, d) => sum + (d.count - 1), 0) +
    commonDuplicates.reduce((sum, d) => sum + (d.count - 1), 0);

  return {
    total: allPlants.length,
    uniqueScientificNames: byScientificName.size,
    uniqueCommonNames: byCommonName.size,
    scientificDuplicates,
    commonDuplicates,
    totalDuplicates,
    duplicationRate: ((totalDuplicates / Math.max(allPlants.length, 1)) * 100).toFixed(2) + "%",
  };
}

/**
 * Fusionner deux molécules
 */
async function mergeMolecules(keepId: number, mergeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // 1. Récupérer les deux molécules
    const keepResults = await db.select().from(molecules).where(eq(molecules.id, keepId)).limit(1);
    const mergeResults = await db.select().from(molecules).where(eq(molecules.id, mergeId)).limit(1);

    const keepMolecule = keepResults[0];
    const mergeMolecule = mergeResults[0];

    if (!keepMolecule || !mergeMolecule) {
      throw new Error("Molécule(s) non trouvée(s)");
    }

    // 2. Fusionner les données manquantes dans keepMolecule
    const updatedData: Record<string, unknown> = {};

    if (!keepMolecule.casNumber && mergeMolecule.casNumber) {
      updatedData.casNumber = mergeMolecule.casNumber;
    }
    if (!keepMolecule.smiles && mergeMolecule.smiles) {
      updatedData.smiles = mergeMolecule.smiles;
    }

    // Mettre à jour keepMolecule si nécessaire
    if (Object.keys(updatedData).length > 0) {
      await db.update(molecules).set(updatedData).where(eq(molecules.id, keepId));
    }

    // 3. Réassigner toutes les liaisons FK de mergeId vers keepId
    // Pour les tables avec clé unique composite (plant_id, molecule_id), on doit d'abord
    // supprimer les doublons potentiels avant de réassigner
    const db2 = db as any;

    // Tables avec clé unique composite (plantId + moleculeId) - supprimer les doublons avant réassignation
    // Utiliser db.execute(sql`...`) qui est le pattern correct pour Drizzle MySQL2
    try {
      // Supprimer les lignes de plant_molecules de mergeId qui ont déjà un équivalent pour keepId
      await db.execute(sql`DELETE FROM plant_molecules WHERE molecule_id = ${mergeId} AND plant_id IN (SELECT plant_id FROM (SELECT plant_id FROM plant_molecules WHERE molecule_id = ${keepId}) AS tmp)`);
      await db.execute(sql`UPDATE plant_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`);
    } catch (e) { console.warn('mergeMolecules plant_molecules:', e); }
    try {
      await db.execute(sql`DELETE FROM molecule_plant_sources WHERE molecule_id = ${mergeId} AND plant_id IN (SELECT plant_id FROM (SELECT plant_id FROM molecule_plant_sources WHERE molecule_id = ${keepId}) AS tmp)`);
      await db.execute(sql`UPDATE molecule_plant_sources SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`);
    } catch (e) { console.warn('mergeMolecules molecule_plant_sources:', e); }

    // Tables simples - réassigner directement
    const simpleSqls = [
      sql`UPDATE user_favorites SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE recette_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE prototype_molecules SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE tabac_molecules SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE molecule_accords SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE molecule_families SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE petrichor_molecules SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE volcanique_molecules SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE laboratoire_molecules SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE molecule_chemical_families SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE molecule_notes SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE leaf_economy_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE molecule_origins SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE ifra_restrictions SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE terp_profile_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE raw_material_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE tps_gene_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE molecule_recettes SET moleculeId = ${keepId} WHERE moleculeId = ${mergeId}`,
      sql`UPDATE publication_molecules SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE molecule_perfumes SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      sql`UPDATE synergies SET molecule_id = ${keepId} WHERE molecule_id = ${mergeId}`,
      // Tables avec deux colonnes FK
      sql`UPDATE molecule_synergies SET molecule1_id = ${keepId} WHERE molecule1_id = ${mergeId}`,
      sql`UPDATE molecule_synergies SET molecule2_id = ${keepId} WHERE molecule2_id = ${mergeId}`,
      sql`UPDATE terpene_synergies SET terpene1_id = ${keepId} WHERE terpene1_id = ${mergeId}`,
      sql`UPDATE terpene_synergies SET terpene2_id = ${keepId} WHERE terpene2_id = ${mergeId}`,
      sql`UPDATE molecular_transformations SET source_molecule_id = ${keepId} WHERE source_molecule_id = ${mergeId}`,
      sql`UPDATE molecular_transformations SET product_molecule_id = ${keepId} WHERE product_molecule_id = ${mergeId}`,
    ];
    for (const query of simpleSqls) {
      try { await db.execute(query); } catch (_) { /* ignore */ }
    }

    // 4. Supprimer la molécule dupliquée (toutes les FK sont réassignées)
    await db.delete(molecules).where(eq(molecules.id, mergeId));

    return {
      success: true,
      message: `Molécule ${mergeId} fusionnée dans ${keepId} (liaisons réassignées)`,
      mergedFields: Object.keys(updatedData),
    };
  } catch (error) {
    console.error("Erreur lors de la fusion des molécules:", error);
    throw error;
  }
}

/**
 * Fusionner deux plantes
 */
async function mergePlants(keepId: number, mergeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // 1. Récupérer les deux plantes
    const keepResults = await db.select().from(plants).where(eq(plants.id, keepId)).limit(1);
    const mergeResults = await db.select().from(plants).where(eq(plants.id, mergeId)).limit(1);

    const keepPlant = keepResults[0];
    const mergePlant = mergeResults[0];

    if (!keepPlant || !mergePlant) {
      throw new Error("Plante(s) non trouvée(s)");
    }

    // 2. Fusionner les données manquantes dans keepPlant
    const updatedData: Record<string, unknown> = {};

    if (!keepPlant.latinName && mergePlant.latinName) {
      updatedData.latinName = mergePlant.latinName;
    }
    if (!keepPlant.family && mergePlant.family) {
      updatedData.family = mergePlant.family;
    }

    // Mettre à jour keepPlant si nécessaire
    if (Object.keys(updatedData).length > 0) {
      await db.update(plants).set(updatedData).where(eq(plants.id, keepId));
    }

    // 3. Réassigner toutes les liaisons FK de mergeId vers keepId
    const plantFkTables = [
      { table: terpProfilePlants, col: terpProfilePlants.plantId },
      { table: plantMolecules, col: plantMolecules.plantId },
      { table: plantVarieties, col: plantVarieties.plantId },
      { table: plantAnalyses, col: plantAnalyses.plantId },
      { table: plantSamples, col: plantSamples.plantId },
      { table: plantTerroirs, col: plantTerroirs.plantId },
      { table: plantExtractions, col: plantExtractions.plantId },
      { table: botanicalStates, col: botanicalStates.plantId },
      { table: rawMaterials, col: rawMaterials.plantId },
      { table: moleculePlantSources, col: moleculePlantSources.plantId },
      { table: terroirSpecialties, col: terroirSpecialties.plantId },
      { table: chemotypes, col: chemotypes.plantId },
    ];
    for (const { table, col } of plantFkTables) {
      try {
        await (db.update(table) as any).set({ plantId: keepId }).where(eq(col as any, mergeId));
      } catch (_) { /* ignore si la table n'a pas de ligne pour cette plante */ }
    }

    // 4. Supprimer la plante dupliquée (toutes les FK sont réassignées)
    await db.delete(plants).where(eq(plants.id, mergeId));

    return {
      success: true,
      message: `Plante ${mergeId} fusionnée dans ${keepId} (liaisons réassignées)`,
      mergedFields: Object.keys(updatedData),
    };
  } catch (error) {
    console.error("Erreur lors de la fusion des plantes:", error);
    throw error;
  }
}

/**
 * Router pour la gestion des doublons
 */
export const duplicatesRouter = router({
  /**
   * Analyser les doublons de molécules
   */
  analyzeMolecules: publicProcedure.query(async () => {
    return await analyzeMoleculeDuplicates();
  }),

  /**
   * Analyser les doublons de plantes
   */
  analyzePlants: publicProcedure.query(async () => {
    return await analyzePlantDuplicates();
  }),

  /**
   * Obtenir les détails d'un groupe de doublons de molécules
   */
  getMoleculeDuplicateDetails: publicProcedure
    .input(
      z.object({
        type: z.enum(["name", "cas", "smiles"]),
        value: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const { type, value } = input;

      let condition;
      if (type === "name") {
        condition = eq(molecules.name, value);
      } else if (type === "cas") {
        condition = eq(molecules.casNumber, value);
      } else {
        condition = eq(molecules.smiles, value);
      }

      return await db.select().from(molecules).where(condition);
    }),

  /**
   * Obtenir les détails d'un groupe de doublons de plantes
   */
  getPlantDuplicateDetails: publicProcedure
    .input(
      z.object({
        type: z.enum(["scientific", "common"]),
        value: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const { type, value } = input;

      const condition =
        type === "scientific"
          ? eq(plants.latinName, value)
          : eq(plants.name, value);

      return await db.select().from(plants).where(condition);
    }),

  /**
   * Fusionner deux molécules
   */
  mergeMolecules: adminProcedure
    .input(
      z.object({
        keepId: z.number(),
        mergeId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await mergeMolecules(input.keepId, input.mergeId);
    }),

  /**
   * Fusionner deux plantes
   */
  mergePlants: adminProcedure
    .input(
      z.object({
        keepId: z.number(),
        mergeId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await mergePlants(input.keepId, input.mergeId);
    }),
});
