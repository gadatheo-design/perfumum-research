/**
 * Extracted from server/db/misc.ts
 * Module: Cross Links
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { molecules, moleculesRecettes, plantTerroirs, plants, rawMaterials, recettes, terroirs } = schema;



// ====================================================================
// FONCTIONS DE LIENS CROISÉS (CROSS-LINKS)
// ====================================================================
// ============================================
// FONCTIONS DE LIENS CROISÉS (CROSS-LINKS)
// ============================================

/**
 * Récupère les recettes qui utilisent une molécule spécifique
 */
export async function getRecettesByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      category: recettes.category,
      description: recettes.description,
      proportion: moleculesRecettes.proportion,
      role: moleculesRecettes.role,
      notes: moleculesRecettes.notes,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, moleculeId));
  
  return result;
}

/**
 * Récupère les molécules similaires (même famille chimique ou profil olfactif proche)
 */
export async function getSimilarMoleculesByProfile(moleculeId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la molécule de référence
  const refMolecule = await db.select().from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  if (!refMolecule[0]) return [];
  
  const ref = refMolecule[0];
  
  // Récupérer toutes les autres molécules
  const allMolecules = await db.select().from(molecules).where(sql`${molecules.id} != ${moleculeId}`);
  
  // Calculer un score de similarité basé sur plusieurs critères
  const scored = allMolecules.map(m => {
    let score = 0;
    
    // Bonus si même famille olfactive
    if ((ref as Record<string, unknown>).olfactiveFamily && (m as Record<string, unknown>).olfactiveFamily === (ref as Record<string, unknown>).olfactiveFamily) {
      score += 40;
    }
    
    // Bonus si même classe chimique
    if (ref.chemicalClass && m.chemicalClass === ref.chemicalClass) {
      score += 30;
    }
    
    // Bonus si volatilité similaire
    if (ref.volatility && m.volatility === ref.volatility) {
      score += 20;
    }
    
    // Bonus si intensité similaire (±1)
    if (ref.intensity && m.intensity && Math.abs(ref.intensity - m.intensity) <= 1) {
      score += 10;
    }
    
    return { ...m, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(m => m.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les recettes similaires (même catégorie, famille, ou profil olfactif proche)
 */
export async function getSimilarRecettesByProfile(recetteId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la recette de référence
  const refRecette = await db.select().from(recettes).where(eq(recettes.id, recetteId)).limit(1);
  if (!refRecette[0]) return [];
  
  const ref = refRecette[0];
  
  // Récupérer toutes les autres recettes
  const allRecettes = await db.select().from(recettes).where(sql`${recettes.id} != ${recetteId}`);
  
  // Calculer un score de similarité
  const scored = allRecettes.map(r => {
    let score = 0;
    
    // Bonus si même catégorie
    if (ref.category && r.category === ref.category) {
      score += 40;
    }
    
    // Bonus si même famille
    if (ref.familyId && r.familyId === ref.familyId) {
      score += 30;
    }
    
    // Bonus si même statut
    if (ref.status && r.status === ref.status) {
      score += 10;
    }
    
    return { ...r, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(r => r.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les plantes similaires (même famille, catégorie ou origine)
 */
export async function getSimilarPlantsByProfile(plantId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la plante de référence
  const refPlant = await db.select().from(plants).where(eq(plants.id, plantId)).limit(1);
  if (!refPlant[0]) return [];
  
  const ref = refPlant[0];
  
  // Récupérer toutes les autres plantes
  const allPlants = await db.select().from(plants).where(sql`${plants.id} != ${plantId}`);
  
  // Calculer un score de similarité
  const scored = allPlants.map(p => {
    let score = 0;
    
    // Bonus si même famille botanique
    if (ref.family && p.family === ref.family) {
      score += 40;
    }
    
    // Bonus si même catégorie
    if (ref.category && p.category === ref.category) {
      score += 30;
    }
    
    // Bonus si même origine
    if (ref.origin && p.origin === ref.origin) {
      score += 20;
    }
    
    return { ...p, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(p => p.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les terroirs similaires (même région, climat similaire)
 */
export async function getSimilarTerroirsByProfile(terroirId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer le terroir de référence
  const refTerroir = await db.select().from(terroirs).where(eq(terroirs.id, terroirId)).limit(1);
  if (!refTerroir[0]) return [];
  
  const ref = refTerroir[0];
  
  // Récupérer tous les autres terroirs
  const allTerroirs = await db.select().from(terroirs).where(sql`${terroirs.id} != ${terroirId}`);
  
  // Calculer un score de similarité
  const scored = allTerroirs.map(t => {
    let score = 0;
    
    // Bonus si même pays
    if (ref.country && t.country === ref.country) {
      score += 30;
    }
    
    // Bonus si même type de climat
    if (ref.climateType && t.climateType === ref.climateType) {
      score += 40;
    }
    
    // Bonus si même région
    if (ref.region && t.region === ref.region) {
      score += 20;
    }
    
    return { ...t, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(t => t.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les matières premières liées à une molécule
 */
export async function getRawMaterialsByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la molécule
  const molecule = await db.select().from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  if (!molecule[0]) return [];
  
  const mol = molecule[0];
  
  // Récupérer les matières premières qui contiennent cette molécule dans leurs molécules dominantes
  const allRawMaterials = await db.select().from(rawMaterials);
  
  // Filtrer les matières premières dont le profil olfactif ou les molécules dominantes contiennent le nom de la molécule
  return allRawMaterials.filter(rm => {
    const moleculeNameLower = mol.name.toLowerCase();
    
    // Vérifier dans le profil olfactif
    if (rm.olfactiveProfile) {
      const profileLower = rm.olfactiveProfile.toLowerCase();
      if (profileLower.includes(moleculeNameLower)) return true;
    }
    
    // Vérifier dans les molécules dominantes
    if (rm.dominantMolecules && Array.isArray(rm.dominantMolecules)) {
      const hasMolecule = rm.dominantMolecules.some(
        (dm: Record<string, unknown>) => (typeof dm.name === 'string' && dm.name.toLowerCase().includes(moleculeNameLower)) || dm.moleculeId === moleculeId
      );
      if (hasMolecule) return true;
    }
    
    return false;
  });
}

/**
 * Récupère les terroirs liés à une plante
 */
export async function getTerroirsByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: terroirs.id,
      name: terroirs.name,
      country: terroirs.country,
      region: terroirs.region,
      climateType: terroirs.climateType,
      localName: plantTerroirs.localName,
      qualityNotes: plantTerroirs.qualityNotes,
    })
    .from(plantTerroirs)
    .innerJoin(terroirs, eq(plantTerroirs.terroirId, terroirs.id))
    .where(eq(plantTerroirs.plantId, plantId));
  
  return result;
}

/**
 * Récupère les plantes liées à un terroir
 */
export async function getPlantsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
      family: plants.family,
      category: plants.category,
      localName: plantTerroirs.localName,
      qualityNotes: plantTerroirs.qualityNotes,
    })
    .from(plantTerroirs)
    .innerJoin(plants, eq(plantTerroirs.plantId, plants.id))
    .where(eq(plantTerroirs.terroirId, terroirId));
  
  return result;
}

/**
 * Récupère les matières premières similaires (même famille olfactive, catégorie ou origine)
 */
export async function getSimilarRawMaterialsByProfile(rawMaterialId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la matière première de référence
  const refMaterial = await db.select().from(rawMaterials).where(eq(rawMaterials.id, rawMaterialId)).limit(1);
  if (!refMaterial[0]) return [];
  
  const ref = refMaterial[0];
  
  // Récupérer toutes les autres matières premières
  const allMaterials = await db.select().from(rawMaterials).where(sql`${rawMaterials.id} != ${rawMaterialId}`);
  
  // Calculer un score de similarité
  const scored = allMaterials.map(m => {
    let score = 0;
    
    // Bonus si même famille olfactive
    if ((ref as Record<string, unknown>).olfactiveFamily && (m as Record<string, unknown>).olfactiveFamily === (ref as Record<string, unknown>).olfactiveFamily) {
      score += 40;
    }
    
    // Bonus si même catégorie
    if (ref.category && m.category === ref.category) {
      score += 30;
    }
    
    // Bonus si même plante source
    if (ref.plantId && m.plantId === ref.plantId) {
      score += 20;
    }
    
    // Bonus si même terroir
    if (ref.terroirId && m.terroirId === ref.terroirId) {
      score += 15;
    }
    
    // Bonus si même pays d'origine
    if (ref.originCountry && m.originCountry === ref.originCountry) {
      score += 10;
    }
    
    return { ...m, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(m => m.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}



