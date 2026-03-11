// @ts-nocheck
/**
 * Module: civilisations
 * Généré automatiquement depuis server/db.ts
 * Sections: CIVILISATIONS, CIVILISATION DETAILS WITH RELATIONS, OLFACTIVE ARCHIVES HELPERS (+4 autres)
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
} from "../../drizzle/schema";
import { getDb } from './core';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// CIVILISATIONS
// ====================================================================
// ============================================================================
// CIVILISATIONS
// ============================================================================

export async function getAllCivilisations(): Promise<Civilisation[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(civilisations);
}

export async function getCivilisationById(id: number): Promise<Civilisation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(civilisations).where(eq(civilisations.id, id)).limit(1);
  return result[0];
}


// ====================================================================
// CIVILISATION DETAILS WITH RELATIONS
// ====================================================================
// ============================================================================
// CIVILISATION DETAILS WITH RELATIONS
// ============================================================================

export async function getCivilisationDetailsWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get civilisation
  const civilisationsList = await db.select().from(civilisations).where(eq(civilisations.id, id));
  if (civilisationsList.length === 0) return null;
  
  const civilisation = civilisationsList[0];
  
  // Get related recettes
  const relatedRecettes = await db
    .select()
    .from(recettes)
    .where(eq(recettes.civilisationId, id));
  
  return {
    civilisation,
    recettes: relatedRecettes,
  };
}



// ====================================================================
// OLFACTIVE ARCHIVES HELPERS
// ====================================================================
// ============================================================================
// OLFACTIVE ARCHIVES HELPERS
// ============================================================================

export async function listOlfactiveArchives(filters: {
  civilization?: string;
  type?: string;
  period?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const { civilization, type, q, limit = 25, offset = 0 } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(olfactiveArchives);
  
  const conditions = [];
  if (civilization) {
    conditions.push(eq(olfactiveArchives.civilization, civilization));
  }
  if (type) {
    conditions.push(eq(olfactiveArchives.type, type as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const results = await query.limit(limit).offset(offset);
  
  // Filter by search query if provided (simple text search)
  if (q) {
    const searchLower = q.toLowerCase();
    return results.filter(archive => 
      archive.title?.toLowerCase().includes(searchLower) ||
      archive.description?.toLowerCase().includes(searchLower) ||
      archive.civilization?.toLowerCase().includes(searchLower)
    );
  }
  
  return results;
}

export async function getOlfactiveArchiveById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [archive] = await db
    .select()
    .from(olfactiveArchives)
    .where(eq(olfactiveArchives.id, id));
  return archive;
}

export async function createOlfactiveArchive(data: InsertOlfactiveArchive) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(olfactiveArchives).values(data);
  return getOlfactiveArchiveById(result.insertId);
}

export async function updateOlfactiveArchive(id: number, data: Partial<InsertOlfactiveArchive>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(olfactiveArchives)
    .set(data)
    .where(eq(olfactiveArchives.id, id));
  return getOlfactiveArchiveById(id);
}

export async function deleteOlfactiveArchive(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(olfactiveArchives).where(eq(olfactiveArchives.id, id));
  return { success: true };
}

export async function searchOlfactiveArchives(searchQuery: string, limit: number = 25) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(olfactiveArchives).limit(limit);
  const searchLower = searchQuery.toLowerCase();
  return results.filter(archive => 
    archive.title?.toLowerCase().includes(searchLower) ||
    archive.description?.toLowerCase().includes(searchLower) ||
    archive.civilization?.toLowerCase().includes(searchLower) ||
    archive.provenance?.toLowerCase().includes(searchLower)
  );
}


// ====================================================================
// CIVILIZATIONAL MARKERS HELPERS
// ====================================================================
// ============================================================================
// CIVILIZATIONAL MARKERS HELPERS
// ============================================================================

export async function listCivilizationalMarkers(filters: {
  civilization?: string;
  period?: string;
  usageType?: string;
  plantId?: number;
}) {
  const { civilization, period, usageType, plantId } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(civilizationalMarkers);
  
  const conditions = [];
  if (civilization) {
    conditions.push(eq(civilizationalMarkers.civilization, civilization));
  }
  if (period) {
    conditions.push(eq(civilizationalMarkers.period, period));
  }
  if (usageType) {
    conditions.push(eq(civilizationalMarkers.usageType, usageType as any));
  }
  if (plantId) {
    conditions.push(eq(civilizationalMarkers.plantId, plantId));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query;
}

export async function getCivilizationalMarkersByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.plantId, plantId));
}

export async function getCivilizationalMarkersByCivilization(civilization: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.civilization, civilization));
}

export async function getCivilizationalMarkersByPeriod(period: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.period, period));
}

export async function createCivilizationalMarker(data: InsertCivilizationalMarker) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(civilizationalMarkers).values(data);
  const [marker] = await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.id, result.insertId));
  return marker;
}


// ====================================================================
// OLFACTORY TRADITIONS (Traditions olfactives)
// ====================================================================
// ============================================================================
// OLFACTORY TRADITIONS (Traditions olfactives)
// ============================================================================

/**
 * Create an olfactory tradition
 */
export async function createOlfactoryTradition(data: {
  code: string;
  name: string;
  period?: string;
  startYear?: number;
  endYear?: number;
  region?: string;
  civilization?: string;
  description?: string;
  historicalContext?: string;
  knownIngredients?: string[];
  techniques?: string[];
  reconstructionStatus?: 'documented' | 'partial' | 'reconstructed' | 'speculative';
  primarySources?: string;
  modernSources?: string;
  tags?: string[];
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(olfactoryTraditions)
    .values({
      code: data.code,
      name: data.name,
      period: data.period,
      startYear: data.startYear,
      endYear: data.endYear,
      region: data.region,
      civilization: data.civilization,
      description: data.description,
      historicalContext: data.historicalContext,
      knownIngredients: data.knownIngredients,
      techniques: data.techniques,
      reconstructionStatus: data.reconstructionStatus || 'documented',
      primarySources: data.primarySources,
      modernSources: data.modernSources,
      tags: data.tags,
      createdBy: data.createdBy,
    })
    .$returningId();
  return result;
}

/**
 * Get all olfactory traditions
 */
export async function getAllOlfactoryTraditions() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .orderBy(olfactoryTraditions.startYear, olfactoryTraditions.name);
}

/**
 * Get olfactory tradition by ID
 */
export async function getOlfactoryTraditionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [tradition] = await db
    .select()
    .from(olfactoryTraditions)
    .where(eq(olfactoryTraditions.id, id));
  return tradition;
}

/**
 * Get olfactory tradition by code
 */
export async function getOlfactoryTraditionByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const [tradition] = await db
    .select()
    .from(olfactoryTraditions)
    .where(eq(olfactoryTraditions.code, code));
  return tradition;
}

/**
 * Get olfactory traditions by region
 */
export async function getOlfactoryTraditionsByRegion(region: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .where(like(olfactoryTraditions.region, `%${region}%`))
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Get olfactory traditions by period
 */
export async function getOlfactoryTraditionsByPeriod(period: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .where(like(olfactoryTraditions.period, `%${period}%`))
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Get olfactory traditions by reconstruction status
 */
export async function getOlfactoryTraditionsByStatus(
  status: 'documented' | 'partial' | 'reconstructed' | 'speculative'
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .where(eq(olfactoryTraditions.reconstructionStatus, status))
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Update an olfactory tradition
 */
export async function updateOlfactoryTradition(
  id: number,
  data: Partial<{
    name: string;
    period: string;
    startYear: number;
    endYear: number;
    region: string;
    civilization: string;
    description: string;
    historicalContext: string;
    knownIngredients: string[];
    techniques: string[];
    reconstructionStatus: 'documented' | 'partial' | 'reconstructed' | 'speculative';
    primarySources: string;
    modernSources: string;
    tags: string[];
  }>
) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(olfactoryTraditions)
    .set(data)
    .where(eq(olfactoryTraditions.id, id));
  return getOlfactoryTraditionById(id);
}

/**
 * Delete an olfactory tradition
 */
export async function deleteOlfactoryTradition(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(olfactoryTraditions)
    .where(eq(olfactoryTraditions.id, id));
  return { success: true };
}

/**
 * Search olfactory traditions
 */
export async function searchOlfactoryTraditions(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db
    .select()
    .from(olfactoryTraditions)
    .where(
      or(
        like(olfactoryTraditions.name, searchTerm),
        like(olfactoryTraditions.description, searchTerm),
        like(olfactoryTraditions.region, searchTerm),
        like(olfactoryTraditions.civilization, searchTerm),
        like(olfactoryTraditions.period, searchTerm)
      )
    )
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Get olfactory traditions statistics
 */
export async function getOlfactoryTraditionsStats() {
  const db = await getDb();
  if (!db) return { total: 0, byStatus: [], byRegion: [], byPeriod: [] };
  
  const [totalCount] = await db
    .select({ count: count() })
    .from(olfactoryTraditions);
  
  const byStatus = await db
    .select({
      status: olfactoryTraditions.reconstructionStatus,
      count: count(),
    })
    .from(olfactoryTraditions)
    .groupBy(olfactoryTraditions.reconstructionStatus);
  
  const byRegion = await db
    .select({
      region: olfactoryTraditions.region,
      count: count(),
    })
    .from(olfactoryTraditions)
    .where(isNotNull(olfactoryTraditions.region))
    .groupBy(olfactoryTraditions.region);
  
  const byPeriod = await db
    .select({
      period: olfactoryTraditions.period,
      count: count(),
    })
    .from(olfactoryTraditions)
    .where(isNotNull(olfactoryTraditions.period))
    .groupBy(olfactoryTraditions.period);
  
  return {
    total: totalCount?.count || 0,
    byStatus,
    byRegion,
    byPeriod,
  };
}



// ====================================================================
// CURATED JOURNEYS (Parcours olfactifs prédéfinis)
// ====================================================================
// ============================================================================
// CURATED JOURNEYS (Parcours olfactifs prédéfinis)
// ============================================================================

/**
 * Récupère tous les parcours publiés
 */
export async function getAllPublishedJourneys() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .where(eq(curatedJourneys.isPublished, true))
    .orderBy(curatedJourneys.sortOrder, curatedJourneys.name);
}

/**
 * Récupère tous les parcours (admin)
 */
export async function getAllJourneys() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .orderBy(curatedJourneys.sortOrder, curatedJourneys.name);
}

/**
 * Récupère les parcours mis en avant
 */
export async function getFeaturedJourneys() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .where(and(
      eq(curatedJourneys.isPublished, true),
      eq(curatedJourneys.isFeatured, true)
    ))
    .orderBy(curatedJourneys.sortOrder);
}

/**
 * Récupère un parcours par ID
 */
export async function getJourneyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [journey] = await db.select()
    .from(curatedJourneys)
    .where(eq(curatedJourneys.id, id));
  
  return journey || null;
}

/**
 * Récupère un parcours par code
 */
export async function getJourneyByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [journey] = await db.select()
    .from(curatedJourneys)
    .where(eq(curatedJourneys.code, code));
  
  return journey || null;
}

/**
 * Récupère les parcours par thème
 */
export async function getJourneysByTheme(theme: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .where(and(
      eq(curatedJourneys.theme, theme as any),
      eq(curatedJourneys.isPublished, true)
    ))
    .orderBy(curatedJourneys.sortOrder);
}

/**
 * Crée un nouveau parcours
 */
export async function createJourney(data: InsertCuratedJourney) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const [result] = await db.insert(curatedJourneys).values(data);
  return getJourneyById(result.insertId);
}

/**
 * Met à jour un parcours
 */
export async function updateJourney(id: number, data: Partial<InsertCuratedJourney>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(curatedJourneys)
    .set(data)
    .where(eq(curatedJourneys.id, id));
  
  return getJourneyById(id);
}

/**
 * Supprime un parcours
 */
export async function deleteJourney(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Supprimer d'abord les items liés
  await db.delete(journeyItems).where(eq(journeyItems.journeyId, id));
  // Puis le parcours
  await db.delete(curatedJourneys).where(eq(curatedJourneys.id, id));
  
  return true;
}


// ====================================================================
// JOURNEY ITEMS (Éléments des parcours)
// ====================================================================
// ============================================================================
// JOURNEY ITEMS (Éléments des parcours)
// ============================================================================

/**
 * Récupère les éléments d'un parcours avec les détails des entités
 */
export async function getJourneyItems(journeyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select()
    .from(journeyItems)
    .where(eq(journeyItems.journeyId, journeyId))
    .orderBy(journeyItems.sortOrder);
  
  // Enrichir avec les détails des entités
  const enrichedItems = await Promise.all(items.map(async (item) => {
    let entity = null;
    
    if (item.itemType === 'terroir' && item.terroirId) {
      const [t] = await db.select().from(terroirs).where(eq(terroirs.id, item.terroirId));
      entity = t;
    } else if (item.itemType === 'plant' && item.plantId) {
      const [p] = await db.select().from(plants).where(eq(plants.id, item.plantId));
      entity = p;
    } else if (item.itemType === 'molecule' && item.moleculeId) {
      const [m] = await db.select().from(molecules).where(eq(molecules.id, item.moleculeId));
      entity = m;
    }
    
    return { ...item, entity };
  }));
  
  return enrichedItems;
}

/**
 * Ajoute un élément à un parcours
 */
export async function addJourneyItem(data: InsertJourneyItem) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const [result] = await db.insert(journeyItems).values(data);
  
  // Mettre à jour les compteurs du parcours
  await updateJourneyCounts(data.journeyId);
  
  return result.insertId;
}

/**
 * Supprime un élément d'un parcours
 */
export async function removeJourneyItem(itemId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Récupérer le journeyId avant suppression
  const [item] = await db.select().from(journeyItems).where(eq(journeyItems.id, itemId));
  if (!item) return false;
  
  await db.delete(journeyItems).where(eq(journeyItems.id, itemId));
  
  // Mettre à jour les compteurs
  await updateJourneyCounts(item.journeyId);
  
  return true;
}

/**
 * Met à jour l'ordre d'un élément
 */
export async function updateJourneyItemOrder(itemId: number, sortOrder: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(journeyItems)
    .set({ sortOrder })
    .where(eq(journeyItems.id, itemId));
  
  return true;
}

/**
 * Met à jour les compteurs d'un parcours
 */
async function updateJourneyCounts(journeyId: number) {
  const db = await getDb();
  if (!db) return;
  
  const items = await db.select().from(journeyItems).where(eq(journeyItems.journeyId, journeyId));
  
  const terroirCount = items.filter(i => i.itemType === 'terroir').length;
  const plantCount = items.filter(i => i.itemType === 'plant').length;
  const moleculeCount = items.filter(i => i.itemType === 'molecule').length;
  
  await db.update(curatedJourneys)
    .set({ terroirCount, plantCount, moleculeCount })
    .where(eq(curatedJourneys.id, journeyId));
}

/**
 * Récupère un parcours complet avec tous ses éléments
 */
export async function getFullJourney(journeyId: number) {
  const journey = await getJourneyById(journeyId);
  if (!journey) return null;
  
  const items = await getJourneyItems(journeyId);
  
  return { ...journey, items };
}

/**
 * Récupère les statistiques des parcours
 */
export async function getJourneysStats() {
  const db = await getDb();
  if (!db) return null;
  
  const allJourneys = await db.select().from(curatedJourneys);
  
  const published = allJourneys.filter(j => j.isPublished);
  const featured = allJourneys.filter(j => j.isFeatured);
  
  // Grouper par thème
  const byTheme: Record<string, number> = {};
  allJourneys.forEach(j => {
    byTheme[j.theme] = (byTheme[j.theme] || 0) + 1;
  });
  
  return {
    total: allJourneys.length,
    published: published.length,
    featured: featured.length,
    byTheme,
  };
}


