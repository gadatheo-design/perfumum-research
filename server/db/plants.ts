/**
 * Module: plants
 * Généré automatiquement depuis server/db.ts
 * Sections: PLANTS (Plantes aromatiques), RELATIONS: TerpProfiles <-> Plants, POINT 3 ÉTENDU - HELPERS BOTANIQUES AVANCÉS (+13 autres)
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
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';
import { getPlantVarietiesByPlant } from "./plants-varieties";
import { getPlantTerroirs } from "./plants-terroirs";
import { getPlantExtractions } from "./plants-extraction-methods";


// ====================================================================
// PLANTS (Plantes aromatiques)
// ====================================================================
// ============================================================================
// PLANTS (Plantes aromatiques)
// ============================================================================




// ============================================================================
// FONCTIONS PURES TESTABLES (sans connexion DB)
// ============================================================================

/** Groupe un tableau d'items par leur statut de conservation */

export { groupVarietiesByStatus, groupVarietiesByCategory, buildVarietyFilterConditions, getAllPlantVarieties, getPlantVarietiesByPlant, getPlantVarietyById, createPlantVariety, updatePlantVariety, deletePlantVariety, getPlantVarietiesCount, getPlantVarietiesWithFilters, getCriticalVarieties, getVarietyWithMolecules, getVarietiesByType, getTobaccoVarieties, getGenomicLinksForGhostVariety, getMoleculesForGhostVarietyLinking, getPlantsForGhostVarietyLinking, getGhostVarietyWithRelations, searchMoleculesForGhostVariety, searchPlantsForGhostVariety, getGhostVarietyPlantLinks, createGhostVarietyPlantLink, updateGhostVarietyPlantLink, deleteGhostVarietyPlantLink, getAllGhostVarietyPlantLinks } from './plants-varieties';
export { getTerpProfilePlants, addPlantToTerpProfile } from './plants-terpene-profiles';
export { getAllTerroirs, getTerroirsByCountry, getTerroirById, createTerroir, updateTerroir, deleteTerroir, getPlantTerroirs, getTerroirPlants, addPlantTerroir, removePlantTerroir, searchPlantsByTerroir, getFullTerroirProfile, getMoleculePlantTerroirNetwork, getPlantTerroirAuditStats, getAllPlantTerroirRelationsWithNames, bulkImportPlantTerroirs, suggestPlantTerroirLinks, createMultiplePlantTerroirs } from './plants-terroirs';
export { getAllExtractionMethods, getExtractionMethodById, createExtractionMethod, updateExtractionMethod, deleteExtractionMethod, getPlantExtractions, addPlantExtraction, removePlantExtraction } from './plants-extraction-methods';
export { getAllExtendedSuppliers, getExtendedSupplierById, createExtendedSupplier, updateExtendedSupplier, deleteExtendedSupplier } from './plants-suppliers';
export { searchPlantsByMolecule, searchMoleculesByPlantSource, searchRawMaterialsByMolecule, getFullMoleculeProfile, getFullPlantProfile, getMoleculePlantsWithPercentages } from './plants-profiles-search';
export { getAllChemotypes, getChemotypeById, getChemotypesByPlantId, getChemotypesByPlantName, searchChemotypes, createChemotype, updateChemotype, deleteChemotype, getChemotypesStats } from './plants-chemotypes';
export { getConservationStats, listThreatenedPlants, getPlantConservationStatus, updatePlantConservationStatus } from './plants-conservation';
export { getCannabisLandraces } from './plants-cannabis';
export { crossSearch, getCrossSearchFilterOptions } from './plants-cross-search';
export { getAllGenomicPlantLinks, getGenomicLinksForPlant, getGenomicPlantLinksByAxis, getGenomicPlantLinksForReference, createGenomicPlantLink, deleteGenomicPlantLink, getGenomicLinksStats, bulkCreateGenomicMoleculeLinks, bulkCreateGenomicPlantLinks } from './plants-genomics';
export { getPlantContributions, getAllPendingContributionsForAdmin, getAllContributionsForAdmin, submitPlantContribution, reviewPlantContribution, getContributionStats } from './plants-contributions';

export async function getAllPlants() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants).orderBy(plants.name);
}

export async function getPlantById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(plants).where(eq(plants.id, id));
  return result[0] || null;
}

export async function getPlantsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants).where(eq(plants.category, category as Plant['category'])).orderBy(plants.name);
}

export async function getPlantsWithGPS() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants)
    .where(and(
      isNotNull(plants.latitude),
      isNotNull(plants.longitude)
    ))
    .orderBy(plants.name);
}

export async function getPlantsWithGPSByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants)
    .where(and(
      eq(plants.category, category as Plant['category']),
      isNotNull(plants.latitude),
      isNotNull(plants.longitude)
    ))
    .orderBy(plants.name);
}

export async function getPlantByLatinName(latinName: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(plants).where(eq(plants.latinName, latinName));
  return result[0] || null;
}

export async function createPlant(data: InsertPlant) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(plants).values(data);
  const insertId = Number(result[0].insertId);
  return { id: insertId };
}

export async function updatePlant(id: number, data: Partial<InsertPlant>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(plants).set(data).where(eq(plants.id, id));
  return await getPlantById(id);
}

export async function deletePlant(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(plants).where(eq(plants.id, id));
}


// ====================================================================
// RELATIONS: TerpProfiles <-> Plants
// ====================================================================
// ============================================================================
// RELATIONS: TerpProfiles <-> Plants
// ============================================================================

export async function getAllPlantsForSelect() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
    category: plants.category,
  }).from(plants).orderBy(plants.name);
}

// Terroirs helpers

export async function getAllPlantAnalyses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantAnalyses).orderBy(desc(plantAnalyses.analysisDate));
}

export async function getPlantAnalysesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantAnalyses).where(eq(plantAnalyses.plantId, plantId));
}

export async function getPlantAnalysisById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(plantAnalyses).where(eq(plantAnalyses.id, id));
  return results[0] || null;
}

export async function createPlantAnalysis(data: InsertPlantAnalysis) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plantAnalyses).values(data);
  return result;
}

export async function updatePlantAnalysis(id: number, data: Partial<InsertPlantAnalysis>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(plantAnalyses).set(data).where(eq(plantAnalyses.id, id));
}

export async function deletePlantAnalysis(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantAnalyses).where(eq(plantAnalyses.id, id));
}

// Plant Samples helpers

export async function getAllPlantSamples() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantSamples).orderBy(desc(plantSamples.createdAt));
}

export async function getPlantSamplesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantSamples).where(eq(plantSamples.plantId, plantId));
}

export async function getPlantSampleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(plantSamples).where(eq(plantSamples.id, id));
  return results[0] || null;
}

export async function createPlantSample(data: InsertPlantSample) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plantSamples).values(data);
  return result;
}

export async function updatePlantSample(id: number, data: Partial<InsertPlantSample>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(plantSamples).set(data).where(eq(plantSamples.id, id));
}

export async function deletePlantSample(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantSamples).where(eq(plantSamples.id, id));
}

// Extended Suppliers helpers

export async function getPlantWithFullDetails(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const plant = await getPlantById(plantId);
  if (!plant) return null;
  
  const varieties = await getPlantVarietiesByPlant(plantId);
  const samples = await getPlantSamplesByPlant(plantId);
  const analyses = await getPlantAnalysesByPlant(plantId);
  const terroirRelations = await getPlantTerroirs(plantId);
  const extractionRelations = await getPlantExtractions(plantId);
  
  return {
    ...plant,
    varieties,
    samples,
    analyses,
    terroirs: terroirRelations,
    extractions: extractionRelations,
  };
}

// Statistics helpers

export async function getPlantStatistics() {
  const db = await getDb();
  if (!db) return null;
  
  const totalPlants = await db.select({ count: count() }).from(plants);
  const totalVarieties = await db.select({ count: count() }).from(plantVarieties);
  const totalTerroirs = await db.select({ count: count() }).from(terroirs);
  const totalSamples = await db.select({ count: count() }).from(plantSamples);
  const totalAnalyses = await db.select({ count: count() }).from(plantAnalyses);
  const totalSuppliers = await db.select({ count: count() }).from(extendedSuppliers);
  
  return {
    plants: totalPlants[0]?.count || 0,
    varieties: totalVarieties[0]?.count || 0,
    terroirs: totalTerroirs[0]?.count || 0,
    samples: totalSamples[0]?.count || 0,
    analyses: totalAnalyses[0]?.count || 0,
    suppliers: totalSuppliers[0]?.count || 0,
  };
}



// ====================================================================
// RECHERCHE AVANCÉE - Relations molécule-plante-terroir
// ====================================================================
// ============================================================================
// RECHERCHE AVANCÉE - Relations molécule-plante-terroir
// ============================================================================

export async function getPlantMoleculesWithPercentages(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      molecule: molecules,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
      variabilityFactor: plantMolecules.variabilityFactor,
      source: plantMolecules.source,
    })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(eq(plantMolecules.plantId, plantId))
    .orderBy(desc(plantMolecules.isSignature), desc(plantMolecules.percentageTypical));
}

export async function updatePlantImage(plantId: number, imageUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(plants)
    .set({ imageUrl })
    .where(eq(plants.id, plantId));
  
  return getPlantById(plantId);
}

/**
 * Supprime l'image d'une plante
 */

export async function deletePlantImage(plantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(plants)
    .set({ imageUrl: null })
    .where(eq(plants.id, plantId));
  
  return getPlantById(plantId);
}

/**
 * Récupère toutes les plantes avec leurs images
 */

export async function getPlantsWithImages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(plants)
    .where(sql`${plants.imageUrl} IS NOT NULL AND ${plants.imageUrl} != ''`)
    .orderBy(plants.name);
}

/**
 * Récupère les plantes sans images (pour suggérer l'ajout)
 */

export async function getPlantsWithoutImages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(plants)
    .where(sql`${plants.imageUrl} IS NULL OR ${plants.imageUrl} = ''`)
    .orderBy(plants.name);
}



// ====================================================================
// PLANT VARIETIES - EXTENDED FUNCTIONS (Conservation Status, Filtering)
// ====================================================================
// ============================================================================
// PLANT VARIETIES - EXTENDED FUNCTIONS (Conservation Status, Filtering)
// ============================================================================

/**
 * Récupère toutes les variétés avec filtres avancés
 */

export async function getExclusiveMolecules(statuses: string[] = ['EX', 'EW', 'CR', 'EN']) {
  const db = await getDb();
  if (!db) return [];

  const placeholders = statuses.map(() => '?').join(', ');
  const [rows] = await (db as any).execute(
    `SELECT
      m.id,
      m.name,
      m.family,
      m.chemical_class,
      m.cas_number,
      COUNT(DISTINCT pm.plant_id) AS total_plant_count,
      GROUP_CONCAT(DISTINCT p.conservation_status ORDER BY p.conservation_status SEPARATOR ',') AS statuses,
      GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ' | ') AS plant_names,
      GROUP_CONCAT(DISTINCT p.latin_name ORDER BY p.latin_name SEPARATOR ' | ') AS latin_names,
      GROUP_CONCAT(DISTINCT p.id ORDER BY p.id SEPARATOR ',') AS plant_ids
    FROM molecules m
    JOIN plant_molecules pm ON pm.molecule_id = m.id
    JOIN plants p ON p.id = pm.plant_id
    WHERE p.conservation_status IN (${placeholders})
    GROUP BY m.id, m.name, m.family, m.chemical_class, m.cas_number
    HAVING COUNT(DISTINCT pm.plant_id) = COUNT(DISTINCT CASE WHEN p.conservation_status IN (${placeholders}) THEN pm.plant_id END)
    ORDER BY
      CASE MAX(p.conservation_status)
        WHEN 'EX' THEN 1 WHEN 'EW' THEN 2 WHEN 'CR' THEN 3 WHEN 'EN' THEN 4 ELSE 5
      END,
      m.name
    LIMIT 200`,
    [...statuses, ...statuses]
  );
  return (rows as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
    id: Number(r.id),
    name: r.name as string,
    family: r.family as string | null,
    chemicalClass: r.chemical_class as string | null,
    casNumber: r.cas_number as string | null,
    totalPlantCount: Number(r.total_plant_count),
    statuses: (r.statuses as string || '').split(',').filter(Boolean),
    plantNames: (r.plant_names as string || '').split(' | ').filter(Boolean),
    latinNames: (r.latin_names as string || '').split(' | ').filter(Boolean),
    plantIds: (r.plant_ids as string || '').split(',').filter(Boolean).map(Number),
  }));
}

