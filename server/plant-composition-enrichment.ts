/**
 * Service d'enrichissement des compositions chimiques des plantes
 * Ajoute les liaisons plante-molécule pour les plantes orphelines
 */

import { getDb } from "./db";
import { plantMolecules, molecules, plants } from "../drizzle/schema";
import { sql, notInArray } from "drizzle-orm";

// Base de données des compositions chimiques connues par plante
export const PLANT_COMPOSITIONS: Record<string, Array<{ molecule: string; percentage?: number }>> = {
  "Citron": [
    { molecule: "limonène", percentage: 70 },
    { molecule: "γ-terpinène", percentage: 10 },
    { molecule: "β-pinène", percentage: 8 },
    { molecule: "citral", percentage: 3 },
  ],
  "Orange": [
    { molecule: "limonène", percentage: 95 },
    { molecule: "myrcène", percentage: 2 },
    { molecule: "linalol", percentage: 1 },
  ],
  "Bergamote": [
    { molecule: "limonène", percentage: 40 },
    { molecule: "acétate de linalyle", percentage: 30 },
    { molecule: "linalol", percentage: 10 },
  ],
  "Lavande vraie": [
    { molecule: "linalol", percentage: 35 },
    { molecule: "acétate de linalyle", percentage: 40 },
    { molecule: "lavandulol", percentage: 3 },
  ],
  "Menthe poivrée": [
    { molecule: "menthol", percentage: 40 },
    { molecule: "menthone", percentage: 25 },
    { molecule: "1,8-cinéole", percentage: 5 },
  ],
  "Eucalyptus globulus": [
    { molecule: "1,8-cinéole", percentage: 70 },
    { molecule: "α-pinène", percentage: 10 },
    { molecule: "limonène", percentage: 5 },
  ],
  "Pin sylvestre": [
    { molecule: "α-pinène", percentage: 40 },
    { molecule: "β-pinène", percentage: 25 },
    { molecule: "limonène", percentage: 10 },
  ],
  "Cannelle de Ceylan": [
    { molecule: "cinnamaldéhyde", percentage: 75 },
    { molecule: "eugénol", percentage: 8 },
    { molecule: "linalol", percentage: 3 },
  ],
  "Clou de girofle": [
    { molecule: "eugénol", percentage: 85 },
    { molecule: "β-caryophyllène", percentage: 8 },
  ],
  "Gingembre": [
    { molecule: "zingibérène", percentage: 30 },
    { molecule: "β-sesquiphellandrène", percentage: 15 },
    { molecule: "ar-curcumène", percentage: 10 },
  ],
  "Rose de Damas": [
    { molecule: "citronellol", percentage: 35 },
    { molecule: "géraniol", percentage: 20 },
    { molecule: "nérol", percentage: 10 },
  ],
  "Jasmin": [
    { molecule: "acétate de benzyle", percentage: 25 },
    { molecule: "linalol", percentage: 8 },
    { molecule: "jasmone", percentage: 3 },
    { molecule: "indole", percentage: 2 },
  ],
  "Ylang-ylang": [
    { molecule: "linalol", percentage: 15 },
    { molecule: "acétate de géranyle", percentage: 12 },
    { molecule: "β-caryophyllène", percentage: 10 },
  ],
  "Romarin": [
    { molecule: "1,8-cinéole", percentage: 45 },
    { molecule: "camphre", percentage: 15 },
    { molecule: "α-pinène", percentage: 12 },
  ],
  "Thym": [
    { molecule: "thymol", percentage: 45 },
    { molecule: "p-cymène", percentage: 20 },
    { molecule: "γ-terpinène", percentage: 10 },
  ],
  "Basilic": [
    { molecule: "linalol", percentage: 50 },
    { molecule: "estragole", percentage: 25 },
    { molecule: "eugénol", percentage: 10 },
  ],
  "Santal": [
    { molecule: "α-santalol", percentage: 45 },
    { molecule: "β-santalol", percentage: 20 },
  ],
  "Vétiver": [
    { molecule: "vétivérol", percentage: 10 },
    { molecule: "khusimol", percentage: 15 },
  ],
  "Patchouli": [
    { molecule: "patchoulol", percentage: 35 },
    { molecule: "α-bulnésène", percentage: 15 },
  ],
  "Encens": [
    { molecule: "α-pinène", percentage: 30 },
    { molecule: "limonène", percentage: 15 },
  ],
  "Cannabis": [
    { molecule: "myrcène", percentage: 25 },
    { molecule: "β-caryophyllène", percentage: 15 },
    { molecule: "limonène", percentage: 10 },
    { molecule: "α-pinène", percentage: 8 },
    { molecule: "linalol", percentage: 5 },
  ],
  "Tabac": [
    { molecule: "nicotine", percentage: 3 },
    { molecule: "solanone", percentage: 0.5 },
  ],
};

const PLANT_ALIASES: Record<string, string> = {
  "lavande": "Lavande vraie",
  "menthe": "Menthe poivrée",
  "eucalyptus": "Eucalyptus globulus",
  "pin": "Pin sylvestre",
  "rose": "Rose de Damas",
  "cannelle": "Cannelle de Ceylan",
  "girofle": "Clou de girofle",
  "vetiver": "Vétiver",
  "frankincense": "Encens",
};

function normalizePlantName(name: string): string {
  const normalized = name.toLowerCase().trim();
  return PLANT_ALIASES[normalized] || name;
}

export function findPlantComposition(plantName: string): Array<{ molecule: string; percentage?: number }> | null {
  if (PLANT_COMPOSITIONS[plantName]) return PLANT_COMPOSITIONS[plantName];
  const normalized = normalizePlantName(plantName);
  if (PLANT_COMPOSITIONS[normalized]) return PLANT_COMPOSITIONS[normalized];
  const lowerName = plantName.toLowerCase();
  for (const [key, composition] of Object.entries(PLANT_COMPOSITIONS)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return composition;
    }
  }
  return null;
}

export async function getPlantsWithoutMolecules(): Promise<Array<{ id: number; name: string; latinName: string | null }>> {
  const db = await getDb();
  const plantsWithMolecules = await db
    .select({ plantId: plantMolecules.plantId })
    .from(plantMolecules)
    .groupBy(plantMolecules.plantId);
  const plantIdsWithMolecules = plantsWithMolecules.map(p => p.plantId);
  if (plantIdsWithMolecules.length === 0) {
    return await db.select({ id: plants.id, name: plants.name, latinName: plants.latinName }).from(plants);
  }
  return await db
    .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
    .from(plants)
    .where(notInArray(plants.id, plantIdsWithMolecules));
}

export async function previewEnrichment(): Promise<{
  plantsWithoutMolecules: number;
  plantsCanBeEnriched: Array<{ id: number; name: string; moleculesCount: number }>;
  totalLinksToCreate: number;
}> {
  const plantsWithout = await getPlantsWithoutMolecules();
  const db = await getDb();
  const allMolecules = await db.select({ id: molecules.id, name: molecules.name }).from(molecules);
  const moleculeMap = new Map(allMolecules.map(m => [m.name.toLowerCase(), m.id]));
  const plantsCanBeEnriched: Array<{ id: number; name: string; moleculesCount: number }> = [];
  let totalLinksToCreate = 0;
  for (const plant of plantsWithout) {
    const composition = findPlantComposition(plant.name);
    if (composition) {
      let matchedMolecules = 0;
      for (const comp of composition) {
        if (moleculeMap.has(comp.molecule.toLowerCase())) matchedMolecules++;
      }
      if (matchedMolecules > 0) {
        plantsCanBeEnriched.push({ id: plant.id, name: plant.name, moleculesCount: matchedMolecules });
        totalLinksToCreate += matchedMolecules;
      }
    }
  }
  return { plantsWithoutMolecules: plantsWithout.length, plantsCanBeEnriched, totalLinksToCreate };
}

export async function executeEnrichment(): Promise<{
  plantsEnriched: number;
  linksCreated: number;
  errors: string[];
}> {
  const db = await getDb();
  const errors: string[] = [];
  let plantsEnriched = 0;
  let linksCreated = 0;
  const allMolecules = await db.select({ id: molecules.id, name: molecules.name }).from(molecules);
  const moleculeMap = new Map(allMolecules.map(m => [m.name.toLowerCase(), m.id]));
  const plantsWithout = await getPlantsWithoutMolecules();
  for (const plant of plantsWithout) {
    const composition = findPlantComposition(plant.name);
    if (!composition) continue;
    let plantLinksCreated = 0;
    for (const comp of composition) {
      const moleculeId = moleculeMap.get(comp.molecule.toLowerCase());
      if (!moleculeId) continue;
      try {
        const existing = await db
          .select()
          .from(plantMolecules)
          .where(sql`${plantMolecules.plantId} = ${plant.id} AND ${plantMolecules.moleculeId} = ${moleculeId}`)
          .limit(1);
        if (existing.length === 0) {
          await db.insert(plantMolecules).values({
            plantId: plant.id,
            moleculeId: moleculeId,
            percentage: comp.percentage?.toString() || null,
          });
          plantLinksCreated++;
          linksCreated++;
        }
      } catch (error: any) {
        errors.push(`Erreur pour ${plant.name} - ${comp.molecule}: ${error.message}`);
      }
    }
    if (plantLinksCreated > 0) plantsEnriched++;
  }
  return { plantsEnriched, linksCreated, errors };
}

export async function getCompositionStats(): Promise<{
  totalPlants: number;
  plantsWithMolecules: number;
  plantsWithoutMolecules: number;
  coveragePercentage: number;
  documentedPlants: number;
}> {
  const db = await getDb();
  const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(plants);
  const totalPlants = totalResult.count;
  const plantsWithout = await getPlantsWithoutMolecules();
  const plantsWithoutMolecules = plantsWithout.length;
  const plantsWithMolecules = totalPlants - plantsWithoutMolecules;
  return {
    totalPlants,
    plantsWithMolecules,
    plantsWithoutMolecules,
    coveragePercentage: totalPlants > 0 ? Math.round((plantsWithMolecules / totalPlants) * 1000) / 10 : 0,
    documentedPlants: Object.keys(PLANT_COMPOSITIONS).length,
  };
}
