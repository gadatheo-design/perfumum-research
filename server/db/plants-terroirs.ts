/**
 * Extracted from server/db/plants.ts
 * Module: Terroirs
 */

import { eq, and, or, isNull, isNotNull, not, desc, asc, sql, like, gte, lte, inArray, notInArray, count, type SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userFavorites,
  milestones,
  prototypes,
  families,
  tabacs,
  molecules,
  accords,
  recettes,
  civilisations,
  petrichor,
  volcanique,
  installations,
  laboratoire,
  glossary,
  absorbeProfiles,
  prototypeChemicalFamilies,
  chemicalFamilies,
  moleculeChemicalFamilies,
  accordCivilisations,
  researchTimeline,
  experimentalAccords,
  moleculesRecettes,
  recettesFormulesReference,
  Prototype,
  Family,
  Tabac,
  Molecule,
  Accord,
  Recette,
  InsertRecette,
  Civilisation,
  Petrichor,
  Volcanique,
  Installation,
  Laboratoire,
  GlossaryTerm,
  ResearchMilestone,
  ExperimentalAccord,
  synergies,
  Synergie,
  terpeneSynergies,
  userNotes,
  TerpeneSynergy,
  sharedCollections,
  moleculeNotes,
  citations,
  analyticsEvents,
  suppliers,
  supplierMaterials,
  Supplier,
  InsertSupplier,
  SupplierMaterial,
  InsertSupplierMaterial,
  rechercheRadicale,
  modificationHistory,
  moleculeSynergies,
  MoleculeSynergie,
  savedFormulas,
  SavedFormula,
  InsertSavedFormula,
  climateStudies,
  ClimateStudy,
  InsertClimateStudy,
  molecularProtocols,
  MolecularProtocol,
  InsertMolecularProtocol,
  fieldArchives,
  FieldArchive,
  InsertFieldArchive,
  extractionTests,
  ExtractionTest,
  InsertExtractionTest,
  situatedSmells,
  SituatedSmell,
  InsertSituatedSmell,
  leafEconomies,
  LeafEconomy,
  InsertLeafEconomy,
  leafEconomyMolecules,
  geographicOrigins,
  GeographicOrigin,
  InsertGeographicOrigin,
  moleculeOrigins,
  MoleculeOrigin,
  InsertMoleculeOrigin,
  ifraRestrictions,
  IfraRestriction,
  InsertIfraRestriction,
  plants,
  Plant,
  InsertPlant,
  geographicZones,
  plantGeographicZones,
  terpProfiles,
  TerpProfile,
  InsertTerpProfile,
  finalRecipes,
  FinalRecipe,
  InsertFinalRecipe,
  terpProfilePlants,
  terpProfileMolecules,
  plantMolecules,
  finalRecipeTerpProfiles,
  // Point 3 étendu
  plantVarieties,
  PlantVariety,
  InsertPlantVariety,
  terroirs,
  Terroir,
  InsertTerroir,
  extractionMethods,
  ExtractionMethod,
  InsertExtractionMethod,
  plantAnalyses,
  PlantAnalysis,
  InsertPlantAnalysis,
  plantSamples,
  PlantSample,
  InsertPlantSample,
  extendedSuppliers,
  ExtendedSupplier,
  InsertExtendedSupplier,
  plantTerroirs,
  PlantTerroir,
  InsertPlantTerroir,
  plantExtractions,
  PlantExtraction,
  InsertPlantExtraction,
  extendedSupplierMaterials,
  ExtendedSupplierMaterial,
  InsertExtendedSupplierMaterial,
  // Nouvelles tables pour les relations molécule-plante-terroir
  rawMaterials,
  RawMaterial,
  InsertRawMaterial,
  rawMaterialMolecules,
  RawMaterialMolecule,
  InsertRawMaterialMolecule,
  moleculePlantSources,
  MoleculePlantSource,
  InsertMoleculePlantSource,
  terroirSpecialties,
  TerroirSpecialty,
  InsertTerroirSpecialty,
  // Chémotypes
  chemotypes,
  Chemotype,
  // Conservation & Archives (Jour 1-2)
  olfactiveArchives,
  OlfactiveArchive,
  InsertOlfactiveArchive,
  civilizationalMarkers,
  CivilizationalMarker,
  InsertCivilizationalMarker,
  varietyGenealogy,
  VarietyGenealogy,
  InsertVarietyGenealogy,
  InsertChemotype,
  // Catégories IFRA
  ifraCategories,
  IfraCategory,
  InsertIfraCategory,
  // Sample Images (Galerie)
  sampleImages,
  SampleImage,
  InsertSampleImage,
  // Sustainable Alternatives
  sustainableAlternatives,
  SustainableAlternative,
  InsertSustainableAlternative,
  // Bibliography & Research Axes
  bibliographyEntries,
  BibliographyEntry,
  InsertBibliographyEntry,
  researchAxes,
  ResearchAxis,
  InsertResearchAxis,
  researchEntries,
  ResearchEntry,
  InsertResearchEntry,
  bibliographyAxisLinks,
  BibliographyAxisLink,
  InsertBibliographyAxisLink,
  // Reference Citations
  referenceCitations,
  ReferenceCitation,
  InsertReferenceCitation,
  // V3 References (Pack Niche Innovations)
  thematicAxes,
  ThematicAxis,
  InsertThematicAxis,
  v3References,
  V3Reference,
  InsertV3Reference,
  referenceTags,
  ReferenceTag,
  InsertReferenceTag,
  v3ReferenceTagLinks,
  V3ReferenceTagLink,
  InsertV3ReferenceTagLink,
  referenceNotes,
  ReferenceNote,
  InsertReferenceNote,
  axisConnections,
  AxisConnection,
  InsertAxisConnection,
  // Reference Entity Links & Olfactory Traditions
  referenceEntityLinks,
  ReferenceEntityLink,
  InsertReferenceEntityLink,
  olfactoryTraditions,
  OlfactoryTradition,
  InsertOlfactoryTradition,
  // Curated Journeys
  curatedJourneys,
  CuratedJourney,
  InsertCuratedJourney,
  journeyItems,
  JourneyItem,
  InsertJourneyItem,
  // Axis Reference Links
  axisReferenceLinks,
  AxisReferenceLink,
  InsertAxisReferenceLink,
  // Recette <-> Molecule (table recette_molecules)
  recetteMolecules,
  RecetteMolecule,
  InsertRecetteMolecule,
  // Recette <-> Raw Materials (liaison directe)
  recetteRawMaterials,
  RecetteRawMaterial,
  InsertRecetteRawMaterial,
  // Ghost Variety Plant Links
  ghostVarietyPlantLinks,
  GhostVarietyPlantLink,
  InsertGhostVarietyPlantLink,
  // Genomic Plant Links
  genomicPlantLinks,
  GenomicPlantLink,
  InsertGenomicPlantLink,
  // Genomic Molecule Links
  genomicMoleculeLinks,
  GenomicMoleculeLink,
  InsertGenomicMoleculeLink,
  // Ghost Varieties
  ghostVarieties,
  GhostVariety,
  InsertGhostVariety,
} from "../../drizzle/schema";
import { getDb } from './core';
import { getRawMaterialsByPlant, getRawMaterialsByTerroir } from './materials';
import { getTerroirSpecialties, getPlantTerroirSpecialties } from './terroirs';
import { getMoleculeById, getMoleculeRawMaterials, getMoleculeOrigins, getMoleculePlantSources, getPlantMoleculeSources } from './molecules';
import { getMoleculeIfraRestrictions } from './ifra';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';

export async function getAllTerroirs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terroirs).orderBy(terroirs.name);
}

export async function getTerroirsByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terroirs).where(eq(terroirs.country, country));
}

export async function getTerroirById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(terroirs).where(eq(terroirs.id, id));
  return results[0] || null;
}

export async function createTerroir(data: InsertTerroir) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(terroirs).values(data);
  return result;
}

export async function updateTerroir(id: number, data: Partial<InsertTerroir>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(terroirs).set(data).where(eq(terroirs.id, id));
}

export async function deleteTerroir(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(terroirs).where(eq(terroirs.id, id));
}

// Extraction Methods helpers

export async function getPlantTerroirs(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantTerroirs).where(eq(plantTerroirs.plantId, plantId));
}

export async function getTerroirPlants(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantTerroirs).where(eq(plantTerroirs.terroirId, terroirId));
}

export async function addPlantTerroir(data: InsertPlantTerroir) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(plantTerroirs).values(data);
}

export async function removePlantTerroir(plantId: number, terroirId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantTerroirs)
    .where(and(eq(plantTerroirs.plantId, plantId), eq(plantTerroirs.terroirId, terroirId)));
}

// Plant-Extraction relations helpers

export async function searchPlantsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  const terroirPlants = await db.select().from(plantTerroirs).where(eq(plantTerroirs.terroirId, terroirId));
  if (terroirPlants.length === 0) return [];
  const plantIds = terroirPlants.map(tp => tp.plantId);
  return db.select().from(plants).where(inArray(plants.id, plantIds));
}

export async function getFullTerroirProfile(terroirId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const terroir = await getTerroirById(terroirId);
  if (!terroir) return null;
  
  const specialties = await getTerroirSpecialties(terroirId);
  const rawMaterials = await getRawMaterialsByTerroir(terroirId);
  const plants = await getTerroirPlants(terroirId);
  
  return {
    terroir,
    specialties,
    rawMaterials,
    plants,
  };
}


// ====================================================================
// GRAPHE RÉSEAU MOLÉCULE-PLANTE-TERROIR
// ====================================================================
// ============================================================================
// GRAPHE RÉSEAU MOLÉCULE-PLANTE-TERROIR
// ============================================================================

export async function getMoleculePlantTerroirNetwork() {
  const db = await getDb();
  if (!db) return { entities: { plants: [], molecules: [], terroirs: [], rawMaterials: [] }, relationships: { plantMolecules: [], terroirPlants: [] } };
  
  // Champs minimaux pour le graphe (optimisé pour éviter une payload > 500KB)
  const allPlants = await db.select({
    id: plants.id,
    name: plants.name,
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
    family: plants.family,
    category: plants.category,
    origin: plants.origin,
  }).from(plants);
  
  const allMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    chemicalClass: molecules.chemicalClass,
    casNumber: molecules.casNumber,
  }).from(molecules);
  
  const allTerroirs = await db.select({
    id: terroirs.id,
    name: terroirs.name,
    country: terroirs.country,
    region: terroirs.region,
    climateType: terroirs.climateType,
    altitude: terroirs.altitude,
  }).from(terroirs);
  
  // Relations plante-molécule — signatures et molécules majeures uniquement (limite payload)
  const plantMoleculeRelations = await db
    .select({
      plantId: plantMolecules.plantId,
      moleculeId: plantMolecules.moleculeId,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
    })
    .from(plantMolecules)
    .where(sql`${plantMolecules.isSignature} = 1 OR ${plantMolecules.role} IN ('signature', 'majeur', 'major')`)
    .limit(3000);
  
  // Relations terroir-plante
  const terroirPlantRelations = await db
    .select({
      terroirId: terroirSpecialties.terroirId,
      plantId: terroirSpecialties.plantId,
      isSignature: terroirSpecialties.isSignature,
      importance: terroirSpecialties.importance,
    })
    .from(terroirSpecialties)
    .where(sql`${terroirSpecialties.plantId} IS NOT NULL`);
  
  return {
    entities: {
      plants: allPlants,
      molecules: allMolecules,
      terroirs: allTerroirs,
      rawMaterials: [],
    },
    relationships: {
      plantMolecules: plantMoleculeRelations,
      terroirPlants: terroirPlantRelations,
    },
  };
}

export async function getPlantTerroirAuditStats() {
  const db = await getDb();
  if (!db) return null;

  // Compter les plantes et terroirs
  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const allRelations = await db.select().from(plantTerroirs);

  // Identifier les plantes sans terroir
  const plantIdsWithTerroir = new Set(allRelations.map(r => r.plantId));
  const plantsWithoutTerroir = allPlants.filter(p => !plantIdsWithTerroir.has(p.id));

  // Identifier les terroirs sans plante
  const terroirIdsWithPlant = new Set(allRelations.map(r => r.terroirId));
  const terroirsWithoutPlant = allTerroirs.filter(t => !terroirIdsWithPlant.has(t.id));

  // Compter les liaisons par plante
  const plantLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    plantLinkCounts[r.plantId] = (plantLinkCounts[r.plantId] || 0) + 1;
  });

  // Compter les liaisons par terroir
  const terroirLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    terroirLinkCounts[r.terroirId] = (terroirLinkCounts[r.terroirId] || 0) + 1;
  });

  // Plantes avec le plus de terroirs
  const topPlantsByTerroirs = allPlants
    .map(p => ({ ...p, terroirCount: plantLinkCounts[p.id] || 0 }))
    .filter(p => p.terroirCount > 0)
    .sort((a, b) => b.terroirCount - a.terroirCount)
    .slice(0, 10);

  // Terroirs avec le plus de plantes
  const topTerroirsByPlants = allTerroirs
    .map(t => ({ ...t, plantCount: terroirLinkCounts[t.id] || 0 }))
    .filter(t => t.plantCount > 0)
    .sort((a, b) => b.plantCount - a.plantCount)
    .slice(0, 10);

  // Plantes prioritaires (catégories importantes sans terroir)
  const priorityCategories = ['aromatique', 'medicinale', 'parfumerie'];
  const priorityPlantsWithoutTerroir = plantsWithoutTerroir
    .filter(p => p.category && priorityCategories.includes(p.category))
    .slice(0, 20);

  // Terroirs prioritaires (pays importants sans plantes)
  const priorityCountries = ['France', 'Italie', 'Bulgarie', 'Maroc', 'Inde', 'Madagascar', 'Égypte'];
  const priorityTerroirsWithoutPlant = terroirsWithoutPlant
    .filter(t => t.country && priorityCountries.includes(t.country))
    .slice(0, 20);

  return {
    totalPlants: allPlants.length,
    totalTerroirs: allTerroirs.length,
    totalRelations: allRelations.length,
    plantsWithTerroir: plantIdsWithTerroir.size,
    terroirsWithPlant: terroirIdsWithPlant.size,
    plantsWithoutTerroir: plantsWithoutTerroir.length,
    terroirsWithoutPlant: terroirsWithoutPlant.length,
    coveragePlants: allPlants.length > 0 ? Math.round((plantIdsWithTerroir.size / allPlants.length) * 100) : 0,
    coverageTerroirs: allTerroirs.length > 0 ? Math.round((terroirIdsWithPlant.size / allTerroirs.length) * 100) : 0,
    topPlantsByTerroirs,
    topTerroirsByPlants,
    priorityPlantsWithoutTerroir,
    priorityTerroirsWithoutPlant,
    plantsWithoutTerroirList: plantsWithoutTerroir.slice(0, 50),
    terroirsWithoutPlantList: terroirsWithoutPlant.slice(0, 50),
  };
}

/**
 * Récupère toutes les liaisons plante-terroir avec les noms
 */

export async function getAllPlantTerroirRelationsWithNames() {
  const db = await getDb();
  if (!db) return [];

  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const allRelations = await db.select().from(plantTerroirs);

  const plantMap = new Map(allPlants.map(p => [p.id, p]));
  const terroirMap = new Map(allTerroirs.map(t => [t.id, t]));

  return allRelations.map(r => ({
    ...r,
    plantName: plantMap.get(r.plantId)?.name || `Plante #${r.plantId}`,
    plantLatinName: plantMap.get(r.plantId)?.latinName,
    plantCategory: plantMap.get(r.plantId)?.category,
    terroirName: terroirMap.get(r.terroirId)?.name || `Terroir #${r.terroirId}`,
    terroirCountry: terroirMap.get(r.terroirId)?.country,
    terroirRegion: terroirMap.get(r.terroirId)?.region,
  }));
}

/**
 * Import en masse de liaisons plante-terroir
 */

export async function bulkImportPlantTerroirs(relations: Array<{
  plantId?: number;
  plantName?: string;
  terroirId?: number;
  terroirName?: string;
  localName?: string;
  cultivationStart?: number;
  annualProduction?: string;
  qualityNotes?: string;
  notes?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, imported: 0, errors: [] as string[] };

  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const existingRelations = await db.select().from(plantTerroirs);

  const plantNameMap = new Map(allPlants.map(p => [p.name.toLowerCase(), p.id]));
  const plantLatinNameMap = new Map(allPlants.filter(p => p.latinName).map(p => [p.latinName!.toLowerCase(), p.id]));
  const terroirNameMap = new Map(allTerroirs.map(t => [t.name.toLowerCase(), t.id]));

  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));

  const errors: string[] = [];
  let imported = 0;
  const toInsert: InsertPlantTerroir[] = [];

  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i];
    const rowNum = i + 1;

    // Résoudre l'ID de la plante
    let plantId = rel.plantId;
    if (!plantId && rel.plantName) {
      const nameLower = rel.plantName.toLowerCase();
      plantId = plantNameMap.get(nameLower) || plantLatinNameMap.get(nameLower);
    }

    // Résoudre l'ID du terroir
    let terroirId = rel.terroirId;
    if (!terroirId && rel.terroirName) {
      terroirId = terroirNameMap.get(rel.terroirName.toLowerCase());
    }

    // Validation
    if (!plantId) {
      errors.push(`Ligne ${rowNum}: Plante non trouvée "${rel.plantName || rel.plantId}"`);
      continue;
    }
    if (!terroirId) {
      errors.push(`Ligne ${rowNum}: Terroir non trouvé "${rel.terroirName || rel.terroirId}"`);
      continue;
    }

    // Vérifier si la relation existe déjà
    const key = `${plantId}-${terroirId}`;
    if (existingSet.has(key)) {
      errors.push(`Ligne ${rowNum}: Liaison déjà existante (plante ${plantId} - terroir ${terroirId})`);
      continue;
    }

    toInsert.push({
      plantId,
      terroirId,
      localName: rel.localName || null,
      cultivationStart: rel.cultivationStart || null,
      annualProduction: rel.annualProduction || null,
      qualityNotes: rel.qualityNotes || null,
      notes: rel.notes || null,
    });
    existingSet.add(key); // Éviter les doublons dans le même import
  }

  // Insérer en masse
  if (toInsert.length > 0) {
    try {
      await db.insert(plantTerroirs).values(toInsert);
      imported = toInsert.length;
    } catch (error: unknown) {
      errors.push(`Erreur d'insertion: ${(error as Error).message}`);
    }
  }

  return {
    success: errors.length === 0 || imported > 0,
    imported,
    skipped: relations.length - imported - errors.filter(e => e.includes('déjà existante')).length,
    duplicates: errors.filter(e => e.includes('déjà existante')).length,
    errors: errors.filter(e => !e.includes('déjà existante')),
  };
}

/**
 * Suggestions de liaisons basées sur les origines géographiques des plantes
 */

export async function suggestPlantTerroirLinks() {
  const db = await getDb();
  if (!db) return [];

  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const existingRelations = await db.select().from(plantTerroirs);

  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));

  const suggestions: Array<{
    plantId: number;
    plantName: string;
    terroirId: number;
    terroirName: string;
    reason: string;
    confidence: 'high' | 'medium' | 'low';
  }> = [];

  for (const plant of allPlants) {
    if (!plant.origin) continue;

    const originLower = plant.origin.toLowerCase();

    for (const terroir of allTerroirs) {
      const key = `${plant.id}-${terroir.id}`;
      if (existingSet.has(key)) continue;

      const terroirNameLower = terroir.name.toLowerCase();
      const countryLower = (terroir.country || '').toLowerCase();
      const regionLower = (terroir.region || '').toLowerCase();

      // Vérifier les correspondances
      let confidence: 'high' | 'medium' | 'low' | null = null;
      let reason = '';

      if (originLower.includes(countryLower) && countryLower.length > 2) {
        confidence = 'high';
        reason = `Origine de la plante (${plant.origin}) correspond au pays du terroir (${terroir.country})`;
      } else if (originLower.includes(regionLower) && regionLower.length > 2) {
        confidence = 'high';
        reason = `Origine de la plante (${plant.origin}) correspond à la région du terroir (${terroir.region})`;
      } else if (originLower.includes(terroirNameLower.split(',')[0]) || terroirNameLower.includes(originLower.split(',')[0])) {
        confidence = 'medium';
        reason = `Correspondance partielle entre origine (${plant.origin}) et terroir (${terroir.name})`;
      }

      if (confidence) {
        suggestions.push({
          plantId: plant.id,
          plantName: plant.name,
          terroirId: terroir.id,
          terroirName: terroir.name,
          reason,
          confidence,
        });
      }
    }
  }

  // Trier par confiance puis par nom de plante
  return suggestions
    .sort((a, b) => {
      const confOrder = { high: 0, medium: 1, low: 2 };
      if (confOrder[a.confidence] !== confOrder[b.confidence]) {
        return confOrder[a.confidence] - confOrder[b.confidence];
      }
      return a.plantName.localeCompare(b.plantName);
    })
    .slice(0, 100);
}

/**
 * Créer plusieurs liaisons plante-terroir en une seule opération
 */

export async function createMultiplePlantTerroirs(relations: Array<{
  plantId: number;
  terroirId: number;
  localName?: string;
  notes?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] as string[] };

  const existingRelations = await db.select().from(plantTerroirs);
  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));

  const errors: string[] = [];
  const toInsert: InsertPlantTerroir[] = [];

  for (const rel of relations) {
    const key = `${rel.plantId}-${rel.terroirId}`;
    if (existingSet.has(key)) {
      errors.push(`Liaison déjà existante: plante ${rel.plantId} - terroir ${rel.terroirId}`);
      continue;
    }

    toInsert.push({
      plantId: rel.plantId,
      terroirId: rel.terroirId,
      localName: rel.localName || null,
      notes: rel.notes || null,
    });
    existingSet.add(key);
  }

  if (toInsert.length > 0) {
    try {
      await db.insert(plantTerroirs).values(toInsert);
    } catch (error: unknown) {
      errors.push(`Erreur d'insertion: ${(error as Error).message}`);
      return { success: false, created: 0, errors };
    }
  }

  return {
    success: true,
    created: toInsert.length,
    skipped: relations.length - toInsert.length,
    errors,
  };
}



// ====================================================================
// RECHERCHE AVANCÉE CROISÉE (Terroirs ↔ Plantes ↔ Molécules)
// ====================================================================
// ============================================================================
// RECHERCHE AVANCÉE CROISÉE (Terroirs ↔ Plantes ↔ Molécules)
// ============================================================================

export interface CrossSearchFilters {
  // Filtres terroirs
  terroirIds?: number[];
  terroirCountries?: string[];
  terroirClimates?: string[];
  
  // Filtres plantes
  plantIds?: number[];
  plantCategories?: string[];
  plantFamilies?: string[];
  
  // Filtres molécules
  moleculeIds?: number[];
  moleculeFamilies?: string[];
  chemicalClasses?: string[];
  
  // Recherche textuelle
  searchQuery?: string;
  
  // Options
  includeRelations?: boolean;
}

export interface CrossSearchResult {
  terroirs: Array<{
    id: number;
    name: string;
    country: string | null;
    region: string | null;
    climateType: string | null;
    plantCount: number;
    moleculeCount: number;
  }>;
  plants: Array<{
    id: number;
    name: string;
    latinName: string | null;
    category: string | null;
    family: string | null;
    terroirCount: number;
    moleculeCount: number;
  }>;
  molecules: Array<{
    id: number;
    name: string;
    family: string | null;
    chemicalClass: string | null;
    olfactiveProfile: string | null;
    plantCount: number;
  }>;
  relations: {
    plantTerroirs: Array<{ plantId: number; terroirId: number; plantName: string; terroirName: string }>;
    plantMolecules: Array<{ plantId: number; moleculeId: number; plantName: string; moleculeName: string; percentage?: number }>;
  };
  stats: {
    totalTerroirs: number;
    totalPlants: number;
    totalMolecules: number;
    totalPlantTerroirLinks: number;
    totalPlantMoleculeLinks: number;
  };
}

/**
 * Recherche avancée croisée entre terroirs, plantes et molécules
 */
