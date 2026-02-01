/**
 * Service d'analyse des liaisons entre entités
 * Analyse les connexions molécules-recettes, molécules-plantes, plantes-terroirs
 */

import { getDb } from "./db";
import { 
  molecules, 
  recettes, 
  plants, 
  terroirs,
  moleculesRecettes,
  plantMolecules
} from "../drizzle/schema";
import { sql, count, countDistinct } from "drizzle-orm";

export interface LinkAnalysisResult {
  entities: {
    molecules: number;
    recettes: number;
    plants: number;
    terroirs: number;
  };
  links: {
    moleculeRecette: number;
    plantMolecule: number;
  };
  coverage: {
    moleculesWithRecettes: number;
    moleculesWithRecettesPercent: number;
    moleculesWithPlants: number;
    moleculesWithPlantsPercent: number;
    plantsWithMolecules: number;
    plantsWithMoleculesPercent: number;
  };
  gaps: {
    moleculesWithoutRecettes: number;
    moleculesWithoutPlants: number;
    plantsWithoutMolecules: number;
  };
}

/**
 * Analyse complète des liaisons entre entités
 */
export async function analyzeLinkCoverage(): Promise<LinkAnalysisResult | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Compter les entités
  const [moleculeCount] = await db.select({ count: count() }).from(molecules);
  const [recetteCount] = await db.select({ count: count() }).from(recettes);
  const [plantCount] = await db.select({ count: count() }).from(plants);
  const [terroirCount] = await db.select({ count: count() }).from(terroirs);
  
  // Compter les liaisons
  const [moleculeRecetteCount] = await db.select({ count: count() }).from(moleculesRecettes);
  const [plantMoleculeCount] = await db.select({ count: count() }).from(plantMolecules);
  
  // Compter les molécules avec liaisons
  const [moleculesWithRecettes] = await db
    .select({ count: countDistinct(moleculesRecettes.moleculeId) })
    .from(moleculesRecettes);
  
  const [moleculesWithPlants] = await db
    .select({ count: countDistinct(plantMolecules.moleculeId) })
    .from(plantMolecules);
  
  const [plantsWithMolecules] = await db
    .select({ count: countDistinct(plantMolecules.plantId) })
    .from(plantMolecules);
  
  const totalMolecules = moleculeCount.count;
  const totalPlants = plantCount.count;
  
  return {
    entities: {
      molecules: totalMolecules,
      recettes: recetteCount.count,
      plants: totalPlants,
      terroirs: terroirCount.count
    },
    links: {
      moleculeRecette: moleculeRecetteCount.count,
      plantMolecule: plantMoleculeCount.count
    },
    coverage: {
      moleculesWithRecettes: moleculesWithRecettes.count,
      moleculesWithRecettesPercent: Math.round((moleculesWithRecettes.count / totalMolecules) * 1000) / 10,
      moleculesWithPlants: moleculesWithPlants.count,
      moleculesWithPlantsPercent: Math.round((moleculesWithPlants.count / totalMolecules) * 1000) / 10,
      plantsWithMolecules: plantsWithMolecules.count,
      plantsWithMoleculesPercent: Math.round((plantsWithMolecules.count / totalPlants) * 1000) / 10
    },
    gaps: {
      moleculesWithoutRecettes: totalMolecules - moleculesWithRecettes.count,
      moleculesWithoutPlants: totalMolecules - moleculesWithPlants.count,
      plantsWithoutMolecules: totalPlants - plantsWithMolecules.count
    }
  };
}

/**
 * Obtenir les molécules sans liaison avec des recettes
 */
export async function getMoleculesWithoutRecettes(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT m.id, m.name, m.chemical_class, m.family
    FROM molecules m
    LEFT JOIN molecules_recettes mr ON m.id = mr.molecule_id
    WHERE mr.molecule_id IS NULL
    ORDER BY m.name
    LIMIT ${limit}
  `);
  
  return result[0] as any[];
}

/**
 * Obtenir les molécules sans liaison avec des plantes
 */
export async function getMoleculesWithoutPlants(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT m.id, m.name, m.chemical_class, m.family
    FROM molecules m
    LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
    WHERE pm.molecule_id IS NULL
    ORDER BY m.name
    LIMIT ${limit}
  `);
  
  return result[0] as any[];
}

/**
 * Obtenir les plantes sans molécules associées
 */
export async function getPlantsWithoutMolecules(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT p.id, p.name, p.family
    FROM plants p
    LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
    WHERE pm.plant_id IS NULL
    ORDER BY p.name
    LIMIT ${limit}
  `);
  
  return result[0] as any[];
}
