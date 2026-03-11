// @ts-nocheck
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
} from "../../drizzle/schema";
import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// PLANTS (Plantes aromatiques)
// ====================================================================
// ============================================================================
// PLANTS (Plantes aromatiques)
// ============================================================================



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
  return await db.select().from(plants).where(eq(plants.category, category as any)).orderBy(plants.name);
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
      eq(plants.category, category as any),
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

export async function getTerpProfilePlants(terpProfileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      plant: plants,
      notes: terpProfilePlants.notes,
    })
    .from(terpProfilePlants)
    .innerJoin(plants, eq(terpProfilePlants.plantId, plants.id))
    .where(eq(terpProfilePlants.terpProfileId, terpProfileId));
}

export async function addPlantToTerpProfile(terpProfileId: number, plantId: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(terpProfilePlants).values({ terpProfileId, plantId, notes });
}


// ====================================================================
// POINT 3 ÉTENDU - HELPERS BOTANIQUES AVANCÉS
// ====================================================================
// ============================================================================
// POINT 3 ÉTENDU - HELPERS BOTANIQUES AVANCÉS

// ====================================================================
// Plant Varieties helpers
// ====================================================================
// ============================================================================

// Plant Varieties helpers
export async function getAllPlantVarieties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantVarieties).orderBy(plantVarieties.name);
}

export async function getPlantVarietiesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantVarieties).where(eq(plantVarieties.plantId, plantId));
}

export async function getPlantVarietyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(plantVarieties).where(eq(plantVarieties.id, id));
  return results[0] || null;
}

export async function createPlantVariety(data: InsertPlantVariety) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plantVarieties).values(data);
  return result;
}

export async function updatePlantVariety(id: number, data: Partial<InsertPlantVariety>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(plantVarieties).set(data).where(eq(plantVarieties.id, id));
}

export async function deletePlantVariety(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantVarieties).where(eq(plantVarieties.id, id));
}

export async function getPlantVarietiesCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(plantVarieties);
  return result[0]?.count || 0;
}

export async function getAllPlantsForSelect() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    category: plants.category,
  }).from(plants).orderBy(plants.name);
}

// Terroirs helpers
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
export async function getAllExtractionMethods() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(extractionMethods).orderBy(extractionMethods.name);
}

export async function getExtractionMethodById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(extractionMethods).where(eq(extractionMethods.id, id));
  return results[0] || null;
}

export async function createExtractionMethod(data: InsertExtractionMethod) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(extractionMethods).values(data);
  return result;
}

export async function updateExtractionMethod(id: number, data: Partial<InsertExtractionMethod>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(extractionMethods).set(data).where(eq(extractionMethods.id, id));
}

export async function deleteExtractionMethod(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(extractionMethods).where(eq(extractionMethods.id, id));
}

// Plant Analyses helpers
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
export async function getAllExtendedSuppliers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(extendedSuppliers).orderBy(extendedSuppliers.name);
}

export async function getExtendedSupplierById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(extendedSuppliers).where(eq(extendedSuppliers.id, id));
  return results[0] || null;
}

export async function createExtendedSupplier(data: InsertExtendedSupplier) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(extendedSuppliers).values(data);
  return result;
}

export async function updateExtendedSupplier(id: number, data: Partial<InsertExtendedSupplier>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(extendedSuppliers).set(data).where(eq(extendedSuppliers.id, id));
}

export async function deleteExtendedSupplier(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(extendedSuppliers).where(eq(extendedSuppliers.id, id));
}

// Plant-Terroir relations helpers
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
export async function getPlantExtractions(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantExtractions).where(eq(plantExtractions.plantId, plantId));
}

export async function addPlantExtraction(data: InsertPlantExtraction) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(plantExtractions).values(data);
}

export async function removePlantExtraction(plantId: number, extractionMethodId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantExtractions)
    .where(and(eq(plantExtractions.plantId, plantId), eq(plantExtractions.extractionMethodId, extractionMethodId)));
}

// Advanced search helpers
export async function searchPlantsByMolecule(moleculeName: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plants)
    .where(sql`JSON_SEARCH(${plants.dominantMolecules}, 'one', ${`%${moleculeName}%`}) IS NOT NULL`);
}

export async function searchPlantsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  const terroirPlants = await db.select().from(plantTerroirs).where(eq(plantTerroirs.terroirId, terroirId));
  if (terroirPlants.length === 0) return [];
  const plantIds = terroirPlants.map(tp => tp.plantId);
  return db.select().from(plants).where(inArray(plants.id, plantIds));
}

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

export async function searchMoleculesByPlantSource(plantName: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      molecule: molecules,
      plant: plants,
      percentageInOil: moleculePlantSources.percentageInOil,
    })
    .from(moleculePlantSources)
    .innerJoin(molecules, eq(moleculePlantSources.moleculeId, molecules.id))
    .innerJoin(plants, eq(moleculePlantSources.plantId, plants.id))
    .where(like(plants.name, `%${plantName}%`))
    .orderBy(desc(moleculePlantSources.percentageInOil));
}

export async function searchRawMaterialsByMolecule(moleculeName: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      rawMaterial: rawMaterials,
      molecule: molecules,
      percentage: rawMaterialMolecules.percentage,
    })
    .from(rawMaterialMolecules)
    .innerJoin(rawMaterials, eq(rawMaterialMolecules.rawMaterialId, rawMaterials.id))
    .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
    .where(like(molecules.name, `%${moleculeName}%`))
    .orderBy(desc(rawMaterialMolecules.percentage));
}

export async function getFullMoleculeProfile(moleculeId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const molecule = await getMoleculeById(moleculeId);
  if (!molecule) return null;
  
  const plantSources = await getMoleculePlantSources(moleculeId);
  const rawMaterialSources = await getMoleculeRawMaterials(moleculeId);
  const origins = await getMoleculeOrigins(moleculeId);
  const ifraRestrictions = await getMoleculeIfraRestrictions(moleculeId);
  
  return {
    molecule,
    plantSources,
    rawMaterialSources,
    origins,
    ifraRestrictions,
  };
}

export async function getFullPlantProfile(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const plant = await getPlantById(plantId);
  if (!plant) return null;
  
  const molecules = await getPlantMoleculeSources(plantId);
  const rawMaterials = await getRawMaterialsByPlant(plantId);
  const terroirs = await getPlantTerroirSpecialties(plantId);
  const varieties = await getPlantVarietiesByPlant(plantId);
  
  return {
    plant,
    molecules,
    rawMaterials,
    terroirs,
    varieties,
  };
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
  if (!db) return { nodes: [], edges: [] };
  
  // Récupérer toutes les plantes avec leurs molécules
  const allPlants = await db.select().from(plants);
  
  // Récupérer toutes les molécules
  const allMolecules = await db.select().from(molecules);
  
  // Récupérer tous les terroirs
  const allTerroirs = await db.select().from(terroirs);
  
  // Récupérer les relations plante-molécule avec pourcentages
  const plantMoleculeRelations = await db
    .select({
      plantId: plantMolecules.plantId,
      moleculeId: plantMolecules.moleculeId,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
    })
    .from(plantMolecules);
  
  // Récupérer les relations terroir-plante via terroirSpecialties
  const terroirPlantRelations = await db
    .select({
      terroirId: terroirSpecialties.terroirId,
      plantId: terroirSpecialties.plantId,
      isSignature: terroirSpecialties.isSignature,
      importance: terroirSpecialties.importance,
    })
    .from(terroirSpecialties)
    .where(sql`${terroirSpecialties.plantId} IS NOT NULL`);
  
  // Récupérer les matières premières
  const allRawMaterials = await db.select().from(rawMaterials);
  
  return {
    entities: {
      plants: allPlants,
      molecules: allMolecules,
      terroirs: allTerroirs,
      rawMaterials: allRawMaterials,
    },
    relationships: {
      plantMolecules: plantMoleculeRelations,
      terroirPlants: terroirPlantRelations,
    },
  };
}

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

export async function getMoleculePlantsWithPercentages(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      plant: plants,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
      variabilityFactor: plantMolecules.variabilityFactor,
      source: plantMolecules.source,
    })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .where(eq(plantMolecules.moleculeId, moleculeId))
    .orderBy(desc(plantMolecules.percentageTypical));
}



// ====================================================================
// CHEMOTYPES CRUD
// ====================================================================
// ============================================================================
// CHEMOTYPES CRUD
// ============================================================================

export async function getAllChemotypes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).orderBy(chemotypes.plantName, chemotypes.name);
}

export async function getChemotypeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(chemotypes).where(eq(chemotypes.id, id));
  return result[0] || null;
}

export async function getChemotypesByPlantId(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).where(eq(chemotypes.plantId, plantId));
}

export async function getChemotypesByPlantName(plantName: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).where(like(chemotypes.plantName, `%${plantName}%`));
}

export async function searchChemotypes(query: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).where(
    or(
      like(chemotypes.name, `%${query}%`),
      like(chemotypes.plantName, `%${query}%`),
      like(chemotypes.dominantMoleculeName, `%${query}%`),
      like(chemotypes.origin, `%${query}%`)
    )
  );
}

export async function createChemotype(data: InsertChemotype) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chemotypes).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateChemotype(id: number, data: Partial<InsertChemotype>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(chemotypes).set(data).where(eq(chemotypes.id, id));
  return getChemotypeById(id);
}

export async function deleteChemotype(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(chemotypes).where(eq(chemotypes.id, id));
}

export async function getChemotypesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byPlant: [], byAxis: [] };
  
  const all = await db.select().from(chemotypes);
  
  // Grouper par plante
  const byPlant = all.reduce((acc, ct) => {
    const existing = acc.find(p => p.plantName === ct.plantName);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ plantName: ct.plantName, count: 1 });
    }
    return acc;
  }, [] as { plantName: string; count: number }[]);
  
  // Grouper par axe climatique
  const byAxis = all.reduce((acc, ct) => {
    if (ct.climaticAxis) {
      const existing = acc.find(a => a.axis === ct.climaticAxis);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ axis: ct.climaticAxis, count: 1 });
      }
    }
    return acc;
  }, [] as { axis: string; count: number }[]);
  
  return {
    total: all.length,
    byPlant: byPlant.sort((a, b) => b.count - a.count),
    byAxis: byAxis.sort((a, b) => b.count - a.count),
  };
}



// ====================================================================
// PLANT IMAGES FUNCTIONS
// ====================================================================
// ============================================================================
// PLANT IMAGES FUNCTIONS
// ============================================================================

/**
 * Met à jour l'URL de l'image d'une plante
 */
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
export async function getPlantVarietiesWithFilters(filters: {
  plantCategory?: string;
  varietyType?: string;
  conservationStatus?: string;
  countryOfOrigin?: string;
  searchQuery?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .$dynamic();
  
  const conditions: any[] = [];
  
  if (filters.plantCategory) {
    conditions.push(eq(plants.category, filters.plantCategory as any));
  }
  
  if (filters.varietyType) {
    conditions.push(eq(plantVarieties.varietyType, filters.varietyType as any));
  }
  
  if (filters.conservationStatus) {
    conditions.push(eq(plantVarieties.conservationStatus, filters.conservationStatus as any));
  }
  
  if (filters.countryOfOrigin) {
    conditions.push(eq(plantVarieties.countryOfOrigin, filters.countryOfOrigin));
  }
  
  if (filters.searchQuery) {
    conditions.push(
      or(
        like(plantVarieties.name, `%${filters.searchQuery}%`),
        like(plantVarieties.latinName, `%${filters.searchQuery}%`),
        like(plants.name, `%${filters.searchQuery}%`)
      )!
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  return query.orderBy(plantVarieties.name);
}

/**
 * Récupère les variétés en danger critique
 */
export async function getCriticalVarieties() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(
      or(
        eq(plantVarieties.conservationStatus, 'critical'),
        eq(plantVarieties.conservationStatus, 'endangered')
      )
    )
    .orderBy(plantVarieties.conservationStatus, plantVarieties.name);
}

/**
 * Récupère les statistiques de conservation
 */
export async function getConservationStats() {
  const db = await getDb();
  if (!db) return { total: 0, byStatus: [], byCategory: [] };
  
  const all = await db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id));
  
  // Grouper par statut de conservation
  const byStatus = all.reduce((acc, item) => {
    const status = item.variety.conservationStatus || 'unknown';
    const existing = acc.find(s => s.status === status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, [] as { status: string; count: number }[]);
  
  // Grouper par catégorie de plante
  const byCategory = all.reduce((acc, item) => {
    const category = item.plant?.category || 'unknown';
    const existing = acc.find(c => c.category === category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);
  
  return {
    total: all.length,
    byStatus: byStatus.sort((a, b) => b.count - a.count),
    byCategory: byCategory.sort((a, b) => b.count - a.count),
  };
}

/**
 * Récupère une variété avec toutes ses molécules liées
 */
export async function getVarietyWithMolecules(varietyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Récupérer la variété
  const varietyResult = await db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(eq(plantVarieties.id, varietyId));
  
  if (varietyResult.length === 0) return null;
  
  const variety = varietyResult[0];
  
  // Récupérer les molécules liées à la plante parente
  const moleculesResult = await db.select({
    molecule: molecules,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(eq(plantMolecules.plantId, variety.variety.plantId));
  
  return {
    ...variety,
    molecules: moleculesResult,
  };
}

/**
 * Récupère les variétés par type (landrace, cultivar, etc.)
 */
export async function getVarietiesByType(varietyType: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(eq(plantVarieties.varietyType, varietyType as any))
    .orderBy(plantVarieties.name);
}

/**
 * Récupère les landraces de cannabis
 */
export async function getCannabisLandraces() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .innerJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(
      and(
        eq(plants.category, 'cannabis'),
        eq(plantVarieties.varietyType, 'landrace')
      )
    )
    .orderBy(plantVarieties.name);
}

/**
 * Récupère les variétés de tabac
 */
export async function getTobaccoVarieties() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .innerJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(eq(plants.category, 'tabac'))
    .orderBy(plantVarieties.name);
}


// ====================================================================
// PLANTS CONSERVATION HELPERS
// ====================================================================
// ============================================================================
// PLANTS CONSERVATION HELPERS
// ============================================================================

export async function listThreatenedPlants(filters: {
  iucn?: string;
  cites?: string;
  region?: string;
}) {
  const { iucn, cites, region } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(plants);
  
  const conditions = [];
  // Par défaut : filtrer sur les statuts menacés (EX, EW, CR, EN, VU, NT, DD)
  if (iucn) {
    conditions.push(eq(plants.conservationStatus, iucn as any));
  } else {
    conditions.push(inArray(plants.conservationStatus, ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'DD'] as any[]));
  }
  if (cites) {
    conditions.push(eq(plants.citesAppendix, cites as any));
  }
  if (region) {
    conditions.push(like(plants.origin, `%${region}%`));
  }
  
  query = query.where(and(...conditions)) as any;
  
  return await query;
}

export async function getPlantConservationStatus(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  const [plant] = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      conservationStatus: plants.conservationStatus,
      citesAppendix: plants.citesAppendix,
      conservationNotes: plants.conservationNotes,
      threatFactors: plants.threatFactors,
      sustainableAlternatives: plants.sustainableAlternatives,
      lastAssessmentYear: plants.lastAssessmentYear,
      historicalStatus: plants.historicalStatus,
    })
    .from(plants)
    .where(eq(plants.id, plantId));
  return plant;
}

export async function updatePlantConservationStatus(plantId: number, data: {
  conservationStatus?: string;
  citesAppendix?: string;
  conservationNotes?: string;
  threatFactors?: any;
  sustainableAlternatives?: string;
  lastAssessmentYear?: number;
  historicalStatus?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(plants)
    .set(data as any)
    .where(eq(plants.id, plantId));
  return getPlantConservationStatus(plantId);
}


// ====================================================================
// AUDIT ET IMPORT EN MASSE DES LIAISONS PLANTE-TERROIR
// ====================================================================
// ============================================================================
// AUDIT ET IMPORT EN MASSE DES LIAISONS PLANTE-TERROIR
// ============================================================================

/**
 * Récupère les statistiques d'audit des liaisons plante-terroir
 */
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
    } catch (error: any) {
      errors.push(`Erreur d'insertion: ${error.message}`);
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
    } catch (error: any) {
      errors.push(`Erreur d'insertion: ${error.message}`);
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
export async function crossSearch(filters: CrossSearchFilters): Promise<CrossSearchResult> {
  const db = await getDb();
  if (!db) {
    return {
      terroirs: [],
      plants: [],
      molecules: [],
      relations: { plantTerroirs: [], plantMolecules: [] },
      stats: { totalTerroirs: 0, totalPlants: 0, totalMolecules: 0, totalPlantTerroirLinks: 0, totalPlantMoleculeLinks: 0 }
    };
  }

  // Récupérer toutes les données de base
  const allTerroirs = await db.select().from(terroirs);
  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);
  const allPlantTerroirs = await db.select().from(plantTerroirs);
  const allPlantMolecules = await db.select().from(plantMolecules);

  // Créer des maps pour les lookups rapides
  const terroirMap = new Map(allTerroirs.map(t => [t.id, t]));
  const plantMap = new Map(allPlants.map(p => [p.id, p]));
  const moleculeMap = new Map(allMolecules.map(m => [m.id, m]));

  // Filtrer les terroirs
  let filteredTerroirs = allTerroirs;
  if (filters.terroirIds?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => filters.terroirIds!.includes(t.id));
  }
  if (filters.terroirCountries?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => t.country && filters.terroirCountries!.includes(t.country));
  }
  if (filters.terroirClimates?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => t.climateType && filters.terroirClimates!.includes(t.climateType));
  }

  // Filtrer les plantes
  let filteredPlants = allPlants;
  if (filters.plantIds?.length) {
    filteredPlants = filteredPlants.filter(p => filters.plantIds!.includes(p.id));
  }
  if (filters.plantCategories?.length) {
    filteredPlants = filteredPlants.filter(p => p.category && filters.plantCategories!.includes(p.category));
  }
  if (filters.plantFamilies?.length) {
    filteredPlants = filteredPlants.filter(p => p.family && filters.plantFamilies!.includes(p.family));
  }

  // Filtrer les molécules
  let filteredMolecules = allMolecules;
  if (filters.moleculeIds?.length) {
    filteredMolecules = filteredMolecules.filter(m => filters.moleculeIds!.includes(m.id));
  }
  if (filters.moleculeFamilies?.length) {
    filteredMolecules = filteredMolecules.filter(m => m.family && filters.moleculeFamilies!.includes(m.family));
  }
  if (filters.chemicalClasses?.length) {
    filteredMolecules = filteredMolecules.filter(m => m.chemicalClass && filters.chemicalClasses!.includes(m.chemicalClass));
  }

  // Recherche textuelle enrichie avec synonymes olfactifs
  if (filters.searchQuery) {
    const originalQuery = filters.searchQuery.toLowerCase();
    // Expansion de la requête avec synonymes olfactifs
    const expandedTerms = expandSearchQuery(filters.searchQuery).map(t => t.toLowerCase());
    
    // Fonction helper pour vérifier si un texte contient l'un des termes enrichis
    const matchesEnrichedQuery = (text: string | null | undefined): boolean => {
      if (!text) return false;
      const lowerText = text.toLowerCase();
      return expandedTerms.some(term => lowerText.includes(term));
    };
    
    filteredTerroirs = filteredTerroirs.filter(t => 
      matchesEnrichedQuery(t.name) ||
      matchesEnrichedQuery(t.country) ||
      matchesEnrichedQuery(t.region) ||
      matchesEnrichedQuery(t.subRegion) ||
      matchesEnrichedQuery(t.climateType)
    );
    filteredPlants = filteredPlants.filter(p => 
      matchesEnrichedQuery(p.name) ||
      matchesEnrichedQuery(p.latinName) ||
      matchesEnrichedQuery(p.olfactiveSignature) ||
      matchesEnrichedQuery(p.family) ||
      matchesEnrichedQuery(p.category)
    );
    filteredMolecules = filteredMolecules.filter(m => 
      matchesEnrichedQuery(m.name) ||
      matchesEnrichedQuery(m.olfactiveProfile) ||
      matchesEnrichedQuery(m.casNumber) ||
      matchesEnrichedQuery(m.family) ||
      matchesEnrichedQuery(m.chemicalClass)
    );
  }

  // Appliquer les filtres croisés si des filtres sont actifs
  const terroirIdsSet = new Set(filteredTerroirs.map(t => t.id));
  const plantIdsSet = new Set(filteredPlants.map(p => p.id));
  const moleculeIdsSet = new Set(filteredMolecules.map(m => m.id));

  // Si des filtres terroirs sont actifs, filtrer les plantes liées
  if (filters.terroirIds?.length || filters.terroirCountries?.length || filters.terroirClimates?.length) {
    const linkedPlantIds = new Set(
      allPlantTerroirs
        .filter(pt => terroirIdsSet.has(pt.terroirId))
        .map(pt => pt.plantId)
    );
    filteredPlants = filteredPlants.filter(p => linkedPlantIds.has(p.id));
    plantIdsSet.clear();
    filteredPlants.forEach(p => plantIdsSet.add(p.id));
  }

  // Si des filtres plantes sont actifs, filtrer les terroirs et molécules liés
  if (filters.plantIds?.length || filters.plantCategories?.length || filters.plantFamilies?.length) {
    const linkedTerroirIds = new Set(
      allPlantTerroirs
        .filter(pt => plantIdsSet.has(pt.plantId))
        .map(pt => pt.terroirId)
    );
    const linkedMoleculeIds = new Set(
      allPlantMolecules
        .filter(pm => plantIdsSet.has(pm.plantId))
        .map(pm => pm.moleculeId)
    );
    filteredTerroirs = filteredTerroirs.filter(t => linkedTerroirIds.has(t.id));
    filteredMolecules = filteredMolecules.filter(m => linkedMoleculeIds.has(m.id));
    terroirIdsSet.clear();
    moleculeIdsSet.clear();
    filteredTerroirs.forEach(t => terroirIdsSet.add(t.id));
    filteredMolecules.forEach(m => moleculeIdsSet.add(m.id));
  }

  // Si des filtres molécules sont actifs, filtrer les plantes liées
  if (filters.moleculeIds?.length || filters.moleculeFamilies?.length || filters.chemicalClasses?.length) {
    const linkedPlantIds = new Set(
      allPlantMolecules
        .filter(pm => moleculeIdsSet.has(pm.moleculeId))
        .map(pm => pm.plantId)
    );
    filteredPlants = filteredPlants.filter(p => linkedPlantIds.has(p.id));
    plantIdsSet.clear();
    filteredPlants.forEach(p => plantIdsSet.add(p.id));
  }

  // Calculer les compteurs pour chaque entité
  const terroirPlantCounts = new Map<number, number>();
  const terroirMoleculeCounts = new Map<number, Set<number>>();
  const plantTerroirCounts = new Map<number, number>();
  const plantMoleculeCounts = new Map<number, number>();
  const moleculePlantCounts = new Map<number, number>();

  // Compter les relations plante-terroir
  allPlantTerroirs.forEach(pt => {
    if (terroirIdsSet.has(pt.terroirId) && plantIdsSet.has(pt.plantId)) {
      terroirPlantCounts.set(pt.terroirId, (terroirPlantCounts.get(pt.terroirId) || 0) + 1);
      plantTerroirCounts.set(pt.plantId, (plantTerroirCounts.get(pt.plantId) || 0) + 1);
    }
  });

  // Compter les relations plante-molécule
  allPlantMolecules.forEach(pm => {
    if (plantIdsSet.has(pm.plantId) && moleculeIdsSet.has(pm.moleculeId)) {
      plantMoleculeCounts.set(pm.plantId, (plantMoleculeCounts.get(pm.plantId) || 0) + 1);
      moleculePlantCounts.set(pm.moleculeId, (moleculePlantCounts.get(pm.moleculeId) || 0) + 1);
      
      // Compter les molécules par terroir (via les plantes)
      allPlantTerroirs.filter(pt => pt.plantId === pm.plantId).forEach(pt => {
        if (terroirIdsSet.has(pt.terroirId)) {
          if (!terroirMoleculeCounts.has(pt.terroirId)) {
            terroirMoleculeCounts.set(pt.terroirId, new Set());
          }
          terroirMoleculeCounts.get(pt.terroirId)!.add(pm.moleculeId);
        }
      });
    }
  });

  // Construire les résultats
  const resultTerroirs = filteredTerroirs.map(t => ({
    id: t.id,
    name: t.name,
    country: t.country,
    region: t.region,
    climateType: t.climateType,
    plantCount: terroirPlantCounts.get(t.id) || 0,
    moleculeCount: terroirMoleculeCounts.get(t.id)?.size || 0,
  }));

  const resultPlants = filteredPlants.map(p => ({
    id: p.id,
    name: p.name,
    latinName: p.latinName,
    category: p.category,
    family: p.family,
    terroirCount: plantTerroirCounts.get(p.id) || 0,
    moleculeCount: plantMoleculeCounts.get(p.id) || 0,
  }));

  const resultMolecules = filteredMolecules.map(m => ({
    id: m.id,
    name: m.name,
    family: m.family,
    chemicalClass: m.chemicalClass,
    olfactiveProfile: m.olfactiveProfile,
    plantCount: moleculePlantCounts.get(m.id) || 0,
  }));

  // Construire les relations si demandé
  const relations = {
    plantTerroirs: filters.includeRelations 
      ? allPlantTerroirs
          .filter(pt => plantIdsSet.has(pt.plantId) && terroirIdsSet.has(pt.terroirId))
          .map(pt => ({
            plantId: pt.plantId,
            terroirId: pt.terroirId,
            plantName: plantMap.get(pt.plantId)?.name || '',
            terroirName: terroirMap.get(pt.terroirId)?.name || '',
          }))
      : [],
    plantMolecules: filters.includeRelations
      ? allPlantMolecules
          .filter(pm => plantIdsSet.has(pm.plantId) && moleculeIdsSet.has(pm.moleculeId))
          .map(pm => ({
            plantId: pm.plantId,
            moleculeId: pm.moleculeId,
            plantName: plantMap.get(pm.plantId)?.name || '',
            moleculeName: moleculeMap.get(pm.moleculeId)?.name || '',
            percentage: pm.percentage ? Number(pm.percentage) : undefined,
          }))
      : [],
  };

  return {
    terroirs: resultTerroirs,
    plants: resultPlants,
    molecules: resultMolecules,
    relations,
    stats: {
      totalTerroirs: resultTerroirs.length,
      totalPlants: resultPlants.length,
      totalMolecules: resultMolecules.length,
      totalPlantTerroirLinks: relations.plantTerroirs.length,
      totalPlantMoleculeLinks: relations.plantMolecules.length,
    },
  };
}

/**
 * Récupère les options de filtres disponibles pour la recherche croisée
 */
export async function getCrossSearchFilterOptions() {
  const db = await getDb();
  if (!db) {
    return {
      terroirCountries: [],
      terroirClimates: [],
      plantCategories: [],
      plantFamilies: [],
      moleculeFamilies: [],
      chemicalClasses: [],
    };
  }

  const allTerroirs = await db.select().from(terroirs);
  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);

  return {
    terroirCountries: Array.from(new Set(allTerroirs.map(t => t.country).filter(Boolean))).sort() as string[],
    terroirClimates: Array.from(new Set(allTerroirs.map(t => t.climateType).filter(Boolean))).sort() as string[],
    plantCategories: Array.from(new Set(allPlants.map(p => p.category).filter(Boolean))).sort() as string[],
    plantFamilies: Array.from(new Set(allPlants.map(p => p.family).filter(Boolean))).sort() as string[],
    moleculeFamilies: Array.from(new Set(allMolecules.map(m => m.family).filter(Boolean))).sort() as string[],
    chemicalClasses: Array.from(new Set(allMolecules.map(m => m.chemicalClass).filter(Boolean))).sort() as string[],
  };
}



// ====================================================================
// GENOMIC PLANT LINKS (Liaisons génomiques plantes - G1-G3)
// ====================================================================
// ============================================================================
// GENOMIC PLANT LINKS (Liaisons génomiques plantes - G1-G3)
// ============================================================================

/**
 * Get all genomic plant links
 */
export async function getAllGenomicPlantLinks(): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks).orderBy(desc(genomicPlantLinks.createdAt));
}

/**
 * Get genomic links for a plant
 */
export async function getGenomicLinksForPlant(plantId: number): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.plantId, plantId));
}

/**
 * Get genomic plant links by axis
 */
export async function getGenomicPlantLinksByAxis(axis: 'G1' | 'G2' | 'G3'): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.genomicAxis, axis))
    .orderBy(desc(genomicPlantLinks.relevanceScore));
}

/**
 * Get genomic links for a reference
 */
export async function getGenomicPlantLinksForReference(referenceId: number): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.referenceId, referenceId));
}

/**
 * Create a genomic plant link
 */
export async function createGenomicPlantLink(data: Omit<InsertGenomicPlantLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GenomicPlantLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(genomicPlantLinks).values(data);
  const [created] = await db.select().from(genomicPlantLinks).where(eq(genomicPlantLinks.id, result.insertId));
  return created;
}

/**
 * Delete a genomic plant link
 */
export async function deleteGenomicPlantLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(genomicPlantLinks).where(eq(genomicPlantLinks.id, id));
  return true;
}

/**
 * Get genomic links statistics
 */
export async function getGenomicLinksStats(): Promise<{
  totalMoleculeLinks: number;
  totalPlantLinks: number;
  byAxis: { axis: string; moleculeCount: number; plantCount: number }[];
  byLinkType: { type: string; moleculeCount: number; plantCount: number }[];
  byConfidence: { confidence: string; moleculeCount: number; plantCount: number }[];
}> {
  const db = await getDb();
  if (!db) return { totalMoleculeLinks: 0, totalPlantLinks: 0, byAxis: [], byLinkType: [], byConfidence: [] };
  
  const [molCount] = await db.select({ count: count() }).from(genomicMoleculeLinks);
  const [plantCount] = await db.select({ count: count() }).from(genomicPlantLinks);
  
  // By axis
  const molByAxis = await db.select({
    axis: genomicMoleculeLinks.genomicAxis,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.genomicAxis);
  
  const plantByAxis = await db.select({
    axis: genomicPlantLinks.genomicAxis,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.genomicAxis);
  
  const axisMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByAxis) {
    axisMap.set(m.axis, { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByAxis) {
    const existing = axisMap.get(p.axis) || { moleculeCount: 0, plantCount: 0 };
    axisMap.set(p.axis, { ...existing, plantCount: p.count });
  }
  
  // By type
  const molByType = await db.select({
    type: genomicMoleculeLinks.linkType,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.linkType);
  
  const plantByType = await db.select({
    type: genomicPlantLinks.linkType,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.linkType);
  
  const typeMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByType) {
    typeMap.set(m.type || 'other', { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByType) {
    const existing = typeMap.get(p.type || 'other') || { moleculeCount: 0, plantCount: 0 };
    typeMap.set(p.type || 'other', { ...existing, plantCount: p.count });
  }
  
  // By confidence
  const molByConf = await db.select({
    confidence: genomicMoleculeLinks.confidence,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.confidence);
  
  const plantByConf = await db.select({
    confidence: genomicPlantLinks.confidence,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.confidence);
  
  const confMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByConf) {
    confMap.set(m.confidence || 'medium', { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByConf) {
    const existing = confMap.get(p.confidence || 'medium') || { moleculeCount: 0, plantCount: 0 };
    confMap.set(p.confidence || 'medium', { ...existing, plantCount: p.count });
  }
  
  return {
    totalMoleculeLinks: molCount.count,
    totalPlantLinks: plantCount.count,
    byAxis: Array.from(axisMap.entries()).map(([axis, counts]) => ({ axis, ...counts })),
    byLinkType: Array.from(typeMap.entries()).map(([type, counts]) => ({ type, ...counts })),
    byConfidence: Array.from(confMap.entries()).map(([confidence, counts]) => ({ confidence, ...counts })),
  };
}



// ====================================================================
// GHOST VARIETY GENOMIC LINKS (Liaisons variétés fantômes ↔ molécules/plantes)
// ====================================================================
// ============================================================================
// GHOST VARIETY GENOMIC LINKS (Liaisons variétés fantômes ↔ molécules/plantes)
// ============================================================================

/**
 * Get genomic molecule links for a ghost variety (via reference)
 */
export async function getGenomicLinksForGhostVariety(varietyId: number): Promise<{
  moleculeLinks: GenomicMoleculeLink[];
  plantLinks: GenomicPlantLink[];
}> {
  const db = await getDb();
  if (!db) return { moleculeLinks: [], plantLinks: [] };
  
  // Get all genomic links - we'll filter by variety context
  const moleculeLinks = await db.select().from(genomicMoleculeLinks)
    .orderBy(desc(genomicMoleculeLinks.relevanceScore));
  const plantLinks = await db.select().from(genomicPlantLinks)
    .orderBy(desc(genomicPlantLinks.relevanceScore));
  
  return { moleculeLinks, plantLinks };
}

/**
 * Get molecules available for linking to ghost varieties
 */
export async function getMoleculesForGhostVarietyLinking(): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
  chemicalClass: string | null;
  family: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    chemicalClass: molecules.chemicalClass,
    family: molecules.family,
  }).from(molecules).orderBy(molecules.name);
}

/**
 * Get plants available for linking to ghost varieties
 */
export async function getPlantsForGhostVarietyLinking(): Promise<{
  id: number;
  name: string;
  latinName: string | null;
  category: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    category: plants.category,
  }).from(plants).orderBy(plants.name);
}

/**
 * Get ghost variety with all related data (molecules, plants, sources)
 */
export async function getGhostVarietyWithRelations(id: number): Promise<{
  variety: GhostVariety | null;
  linkedMolecules: { id: number; name: string; linkType: string; confidence: string }[];
  linkedPlants: { id: number; name: string; linkType: string; confidence: string }[];
}> {
  const db = await getDb();
  if (!db) return { variety: null, linkedMolecules: [], linkedPlants: [] };
  
  const [variety] = await db.select().from(ghostVarieties).where(eq(ghostVarieties.id, id));
  if (!variety) return { variety: null, linkedMolecules: [], linkedPlants: [] };
  
  // Get linked molecules via genomic links
  const moleculeLinks = await db.select({
    moleculeId: genomicMoleculeLinks.moleculeId,
    linkType: genomicMoleculeLinks.linkType,
    confidence: genomicMoleculeLinks.confidence,
  }).from(genomicMoleculeLinks);
  
  const linkedMoleculeIds = moleculeLinks.map(l => l.moleculeId);
  let linkedMolecules: { id: number; name: string; linkType: string; confidence: string }[] = [];
  
  if (linkedMoleculeIds.length > 0) {
    const mols = await db.select({
      id: molecules.id,
      name: molecules.name,
    }).from(molecules).where(inArray(molecules.id, linkedMoleculeIds));
    
    linkedMolecules = mols.map(m => {
      const link = moleculeLinks.find(l => l.moleculeId === m.id);
      return {
        id: m.id,
        name: m.name,
        linkType: link?.linkType || 'other',
        confidence: link?.confidence || 'medium',
      };
    });
  }
  
  // Get linked plants via genomic links
  const plantLinks = await db.select({
    plantId: genomicPlantLinks.plantId,
    linkType: genomicPlantLinks.linkType,
    confidence: genomicPlantLinks.confidence,
  }).from(genomicPlantLinks);
  
  const linkedPlantIds = plantLinks.map(l => l.plantId);
  let linkedPlants: { id: number; name: string; linkType: string; confidence: string }[] = [];
  
  if (linkedPlantIds.length > 0) {
    const pls = await db.select({
      id: plants.id,
      name: plants.name,
    }).from(plants).where(inArray(plants.id, linkedPlantIds));
    
    linkedPlants = pls.map(p => {
      const link = plantLinks.find(l => l.plantId === p.id);
      return {
        id: p.id,
        name: p.name,
        linkType: link?.linkType || 'other',
        confidence: link?.confidence || 'medium',
      };
    });
  }
  
  return { variety, linkedMolecules, linkedPlants };
}

/**
 * Bulk create genomic molecule links for a ghost variety
 */
export async function bulkCreateGenomicMoleculeLinks(
  links: Array<{
    referenceId: number;
    moleculeId: number;
    genomicAxis: 'G1' | 'G2' | 'G3';
    linkType?: string;
    relevanceScore?: number;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
  }>,
  createdBy?: number
): Promise<{ success: number; failed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: links.length, errors: ['Database not available'] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(genomicMoleculeLinks).values({
        referenceId: link.referenceId,
        moleculeId: link.moleculeId,
        genomicAxis: link.genomicAxis,
        linkType: (link.linkType as any) || 'characterization',
        relevanceScore: link.relevanceScore || 50,
        confidence: link.confidence || 'medium',
        notes: link.notes,
        createdBy,
      });
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`Failed to link molecule ${link.moleculeId}: ${error.message}`);
    }
  }
  
  return { success, failed, errors };
}

/**
 * Bulk create genomic plant links for a ghost variety
 */
export async function bulkCreateGenomicPlantLinks(
  links: Array<{
    referenceId: number;
    plantId: number;
    genomicAxis: 'G1' | 'G2' | 'G3';
    linkType?: string;
    relevanceScore?: number;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
  }>,
  createdBy?: number
): Promise<{ success: number; failed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: links.length, errors: ['Database not available'] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(genomicPlantLinks).values({
        referenceId: link.referenceId,
        plantId: link.plantId,
        genomicAxis: link.genomicAxis,
        linkType: (link.linkType as any) || 'genome_sequencing',
        relevanceScore: link.relevanceScore || 50,
        confidence: link.confidence || 'medium',
        notes: link.notes,
        createdBy,
      });
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`Failed to link plant ${link.plantId}: ${error.message}`);
    }
  }
  
  return { success, failed, errors };
}

/**
 * Search molecules by name for autocomplete in ghost variety form
 */
export async function searchMoleculesForGhostVariety(query: string, limit: number = 20): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
  family: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${query}%`;
  return db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    family: molecules.family,
  }).from(molecules)
    .where(or(
      like(molecules.name, searchTerm),
      like(molecules.casNumber, searchTerm),
      like(molecules.iupacName, searchTerm)
    ))
    .orderBy(molecules.name)
    .limit(limit);
}

/**
 * Search plants by name for autocomplete in ghost variety form
 */
export async function searchPlantsForGhostVariety(query: string, limit: number = 20): Promise<{
  id: number;
  name: string;
  latinName: string | null;
  category: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${query}%`;
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    category: plants.category,
  }).from(plants)
    .where(or(
      like(plants.name, searchTerm),
      like(plants.latinName, searchTerm)
    ))
    .orderBy(plants.name)
    .limit(limit);
}



// ====================================================================
// GHOST VARIETY PLANT LINKS (Liaisons variétés fantômes ↔ plantes)
// ====================================================================
// ============================================================================
// GHOST VARIETY PLANT LINKS (Liaisons variétés fantômes ↔ plantes)
// ============================================================================

/**
 * Get all plant links for a ghost variety
 */
export async function getGhostVarietyPlantLinks(ghostVarietyId: number): Promise<(GhostVarietyPlantLink & { plant: { id: number; name: string; latinName: string | null; category: string | null } | null })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(ghostVarietyPlantLinks)
    .where(eq(ghostVarietyPlantLinks.ghostVarietyId, ghostVarietyId))
    .orderBy(ghostVarietyPlantLinks.relationshipType);
  
  // Get plant details for each link
  const result = await Promise.all(links.map(async (link) => {
    const [plant] = await db.select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      category: plants.category,
    }).from(plants).where(eq(plants.id, link.plantId));
    return { ...link, plant: plant || null };
  }));
  
  return result;
}

/**
 * Create a ghost variety plant link
 */
export async function createGhostVarietyPlantLink(data: Omit<InsertGhostVarietyPlantLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyPlantLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyPlantLinks).values(data);
  const [created] = await db.select().from(ghostVarietyPlantLinks).where(eq(ghostVarietyPlantLinks.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety plant link
 */
export async function updateGhostVarietyPlantLink(id: number, data: Partial<InsertGhostVarietyPlantLink>): Promise<GhostVarietyPlantLink | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyPlantLinks).set(data).where(eq(ghostVarietyPlantLinks.id, id));
  const [updated] = await db.select().from(ghostVarietyPlantLinks).where(eq(ghostVarietyPlantLinks.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety plant link
 */
export async function deleteGhostVarietyPlantLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyPlantLinks).where(eq(ghostVarietyPlantLinks.id, id));
  return true;
}

/**
 * Get all plant links (for stats)
 */
export async function getAllGhostVarietyPlantLinks(): Promise<GhostVarietyPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarietyPlantLinks).orderBy(desc(ghostVarietyPlantLinks.createdAt));
}


// ====================================================================
// PLANT CONTRIBUTIONS — Helpers pour le système de contributions utilisateur
// ====================================================================
// ============================================================================
// PLANT CONTRIBUTIONS — Helpers pour le système de contributions utilisateur
// ============================================================================

export async function getPlantContributions(plantId: number, status?: string) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    let query = `SELECT * FROM plant_contributions WHERE plant_id = ?`;
    const params: any[] = [plantId];
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    query += ` ORDER BY created_at DESC`;
    const [rows] = await conn.execute(query, params);
    await conn.end();
    return rows as any[];
  } catch (error: any) {
    console.error('Error getting plant contributions:', error);
    return [];
  }
}

export async function getAllPendingContributionsForAdmin() {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(`
      SELECT pc.*, p.name as plant_name, p.latin_name as plant_latin_name,
             p.family as plant_family
      FROM plant_contributions pc
      LEFT JOIN plants p ON pc.plant_id = p.id
      WHERE pc.status = 'pending'
      ORDER BY pc.created_at DESC
    `);
    await conn.end();
    return rows as any[];
  } catch (error: any) {
    console.error('Error getting pending contributions:', error);
    return [];
  }
}

export async function getAllContributionsForAdmin(status?: string) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    let query = `
      SELECT pc.*, p.name as plant_name, p.latin_name as plant_latin_name
      FROM plant_contributions pc
      LEFT JOIN plants p ON pc.plant_id = p.id
    `;
    const params: any[] = [];
    if (status) {
      query += ` WHERE pc.status = ?`;
      params.push(status);
    }
    query += ` ORDER BY pc.created_at DESC LIMIT 200`;
    const [rows] = await conn.execute(query, params);
    await conn.end();
    return rows as any[];
  } catch (error: any) {
    console.error('Error getting contributions:', error);
    return [];
  }
}

export async function submitPlantContribution(data: {
  plantId: number;
  userId: string;
  userName?: string;
  contributionType: 'image' | 'molecule' | 'terroir' | 'note' | 'bibliography' | 'gcms_analysis' | 'tradition_olfactive';
  imageUrl?: string;
  imageCaption?: string;
  imageSource?: string;
  moleculeId?: number;
  moleculeName?: string;
  moleculeConcentration?: string;
  moleculeSource?: string;
  terroir?: string;
  region?: string;
  country?: string;
  terroirNotes?: string;
  noteContent?: string;
  noteCategory?: string;
  description?: string;
  references?: string;
  // Bibliographie
  bibTitle?: string;
  bibAuthors?: string;
  bibYear?: number;
  bibJournal?: string;
  bibDoi?: string;
  bibUrl?: string;
  bibType?: string;
  // GC-MS
  gcmsMethod?: string;
  gcmsMolecules?: any;
  gcmsConditions?: string;
  // Tradition olfactive
  traditionPeriod?: string;
  traditionCulture?: string;
  traditionUsage?: string;
  traditionSources?: string;
}) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [result] = await conn.execute(`
      INSERT INTO plant_contributions
        (plant_id, user_id, user_name, contribution_type,
         image_url, image_caption, image_source,
         molecule_id, molecule_name, molecule_concentration, molecule_source,
         terroir, region, country, terroir_notes,
         note_content, note_category,
         description, \`references\`,
         bib_title, bib_authors, bib_year, bib_journal, bib_doi, bib_url, bib_type,
         gcms_method, gcms_molecules, gcms_conditions,
         tradition_period, tradition_culture, tradition_usage, tradition_sources,
         status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      data.plantId, data.userId, data.userName || null, data.contributionType,
      data.imageUrl || null, data.imageCaption || null, data.imageSource || null,
      data.moleculeId || null, data.moleculeName || null, data.moleculeConcentration || null, data.moleculeSource || null,
      data.terroir || null, data.region || null, data.country || null, data.terroirNotes || null,
      data.noteContent || null, data.noteCategory || null,
      data.description || null, data.references || null,
      data.bibTitle || null, data.bibAuthors || null, data.bibYear || null, data.bibJournal || null,
      data.bibDoi || null, data.bibUrl || null, data.bibType || null,
      data.gcmsMethod || null, data.gcmsMolecules ? JSON.stringify(data.gcmsMolecules) : null, data.gcmsConditions || null,
      data.traditionPeriod || null, data.traditionCulture || null, data.traditionUsage || null, data.traditionSources || null,
    ]);
    await conn.end();
    return { success: true, id: (result as any).insertId };
  } catch (error: any) {
    console.error('Error submitting plant contribution:', error);
    throw error;
  }
}

export async function reviewPlantContribution(
  contributionId: number,
  action: 'approved' | 'rejected',
  reviewedBy: string,
  adminNotes?: string
) {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);

    // Récupérer la contribution AVANT de la mettre à jour
    const [rows] = await conn.execute(
      `SELECT * FROM plant_contributions WHERE id = ?`,
      [contributionId]
    ) as any[];
    const contribution = (rows as any[])[0];
    if (!contribution) {
      await conn.end();
      throw new Error(`Contribution #${contributionId} not found`);
    }

    // Mettre à jour le statut
    await conn.execute(`
      UPDATE plant_contributions
      SET status = ?, reviewed_by = ?, reviewed_at = NOW(), admin_notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [action, reviewedBy, adminNotes || null, contributionId]);

    const integrationResults: string[] = [];

    // ====================================================
    // INTÉGRATION AUTOMATIQUE LORS DE L'APPROBATION
    // ====================================================
    if (action === 'approved') {

      // --- TYPE IMAGE : mettre à jour image_url de la plante ou créer une entrée galerie ---
      if (contribution.contribution_type === 'image' && contribution.image_url) {
        // Vérifier si la plante a déjà une image principale
        const [plantRows] = await conn.execute(
          `SELECT id, image_url FROM plants WHERE id = ?`,
          [contribution.plant_id]
        ) as any[];
        const plant = (plantRows as any[])[0];
        if (plant && !plant.image_url) {
          // Pas d'image principale : définir cette image comme image principale
          await conn.execute(
            `UPDATE plants SET image_url = ?, updated_at = NOW() WHERE id = ?`,
            [contribution.image_url, contribution.plant_id]
          );
          integrationResults.push(`Image définie comme image principale de la plante #${contribution.plant_id}`);
        } else {
          // La plante a déjà une image : enregistrer dans les notes botaniques
          const caption = contribution.image_caption ? ` — ${contribution.image_caption}` : '';
          const source = contribution.image_source ? ` (Source: ${contribution.image_source})` : '';
          await conn.execute(
            `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?`,
            [`\n[Image contributée] ${contribution.image_url}${caption}${source}`, contribution.plant_id]
          );
          integrationResults.push(`Image ajoutée aux notes de la plante #${contribution.plant_id}`);
        }
      }

      // --- TYPE MOLECULE : créer le lien plant_molecules ---
      if (contribution.contribution_type === 'molecule') {
        if (contribution.molecule_id) {
          // Molécule existante en base : créer le lien plant_molecules
          const [existing] = await conn.execute(
            `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
            [contribution.plant_id, contribution.molecule_id]
          ) as any[];
          if ((existing as any[]).length === 0) {
            await conn.execute(`
              INSERT INTO plant_molecules
                (plant_id, molecule_id, source, notes, role, created_at, updated_at)
              VALUES (?, ?, 'contribution_utilisateur', ?, 'secondaire', NOW(), NOW())
            `, [
              contribution.plant_id,
              contribution.molecule_id,
              [contribution.molecule_source, contribution.description].filter(Boolean).join(' — ') || null
            ]);
            integrationResults.push(`Lien plant_molecules créé : plante #${contribution.plant_id} ↔ molécule #${contribution.molecule_id}`);
          } else {
            integrationResults.push(`Lien plant_molecules déjà existant pour molécule #${contribution.molecule_id}`);
          }
        } else if (contribution.molecule_name) {
          // Molécule non trouvée en base : chercher par nom exact
          const [molRows] = await conn.execute(
            `SELECT id FROM molecules WHERE LOWER(name) = LOWER(?) LIMIT 1`,
            [contribution.molecule_name]
          ) as any[];
          const mol = (molRows as any[])[0];
          if (mol) {
            const [existing] = await conn.execute(
              `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
              [contribution.plant_id, mol.id]
            ) as any[];
            if ((existing as any[]).length === 0) {
              await conn.execute(`
                INSERT INTO plant_molecules
                  (plant_id, molecule_id, source, notes, role, created_at, updated_at)
                VALUES (?, ?, 'contribution_utilisateur', ?, 'secondaire', NOW(), NOW())
              `, [
                contribution.plant_id,
                mol.id,
                [contribution.molecule_source, contribution.description].filter(Boolean).join(' — ') || null
              ]);
              integrationResults.push(`Lien plant_molecules créé via nom : plante #${contribution.plant_id} ↔ molécule #${mol.id} (${contribution.molecule_name})`);
            }
          } else {
            // Molécule inconnue : enregistrer dans les notes de la plante
            await conn.execute(
              `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?`,
              [`\n[Molécule contributée, non trouvée en base] ${contribution.molecule_name}${contribution.molecule_concentration ? ' (' + contribution.molecule_concentration + ')' : ''}${contribution.molecule_source ? ' — Source: ' + contribution.molecule_source : ''}`, contribution.plant_id]
            );
            integrationResults.push(`Molécule "${contribution.molecule_name}" non trouvée en base — enregistrée dans les notes`);
          }
        }
      }

      // --- TYPE TERROIR : créer le lien plant_terroirs ---
      if (contribution.contribution_type === 'terroir') {
        const terroirName = [contribution.terroir, contribution.region, contribution.country].filter(Boolean).join(', ');
        if (terroirName) {
          // Chercher un terroir correspondant par nom ou région
          const [terroirRows] = await conn.execute(
            `SELECT id FROM terroirs WHERE LOWER(name) LIKE LOWER(?) OR LOWER(region) LIKE LOWER(?) LIMIT 1`,
            [`%${contribution.terroir || contribution.region}%`, `%${contribution.region || contribution.terroir}%`]
          ) as any[];
          const terroir = (terroirRows as any[])[0];
          if (terroir) {
            // Vérifier si le lien n'existe pas déjà
            const [existingLink] = await conn.execute(
              `SELECT id FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?`,
              [contribution.plant_id, terroir.id]
            ) as any[];
            if ((existingLink as any[]).length === 0) {
              await conn.execute(`
                INSERT INTO plant_terroirs (plant_id, terroir_id, quality_notes, notes, created_at)
                VALUES (?, ?, ?, 'Lien créé via contribution utilisateur', NOW())
              `, [contribution.plant_id, terroir.id, contribution.terroir_notes || null]);
              integrationResults.push(`Lien plant_terroirs créé : plante #${contribution.plant_id} ↔ terroir #${terroir.id} (${terroirName})`);
            } else {
              integrationResults.push(`Lien plant_terroirs déjà existant pour terroir #${terroir.id}`);
            }
          } else {
            // Terroir non trouvé : enregistrer dans les notes de la plante
            await conn.execute(
              `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?`,
              [`\n[Terroir contribué, non trouvé en base] ${terroirName}${contribution.terroir_notes ? ' — ' + contribution.terroir_notes : ''}`, contribution.plant_id]
            );
            integrationResults.push(`Terroir "${terroirName}" non trouvé en base — enregistré dans les notes`);
          }
        }
      }

      // --- TYPE NOTE : ajouter dans les notes ou propriétés ethnobotaniques de la plante ---
      if (contribution.contribution_type === 'note' && contribution.note_content) {
        const category = contribution.note_category || 'observation';
        const noteText = `\n[Note ${category} — ${new Date().toISOString().split('T')[0]}] ${contribution.note_content}${contribution.references ? ' (Réf: ' + contribution.references + ')' : ''}`;
        if (category === 'ethnobotanique') {
          // Ajouter aux usages ethnobotaniques (champ JSON)
          const [plantRows] = await conn.execute(
            `SELECT ethnobotanical_uses FROM plants WHERE id = ?`,
            [contribution.plant_id]
          ) as any[];
          const plant = (plantRows as any[])[0];
          let uses: any[] = [];
          try { uses = JSON.parse(plant?.ethnobotanical_uses || '[]'); } catch { uses = []; }
          uses.push({ source: 'contribution', date: new Date().toISOString().split('T')[0], content: contribution.note_content, references: contribution.references || null });
          await conn.execute(
            `UPDATE plants SET ethnobotanical_uses = ?, updated_at = NOW() WHERE id = ?`,
            [JSON.stringify(uses), contribution.plant_id]
          );
          integrationResults.push(`Note ethnobotanique intégrée dans ethnobotanical_uses de la plante #${contribution.plant_id}`);
        } else {
          // Ajouter dans les notes textuelles
          await conn.execute(
            `UPDATE plants SET notes = CONCAT(COALESCE(notes, ''), ?), updated_at = NOW() WHERE id = ?`,
            [noteText, contribution.plant_id]
          );
          integrationResults.push(`Note (${category}) intégrée dans les notes de la plante #${contribution.plant_id}`);
        }
      }
    }

    await conn.end();
    return { success: true, integrationResults };
  } catch (error: any) {
    console.error('Error reviewing plant contribution:', error);
    throw error;
  }
}

export async function getContributionStats() {
  try {
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN contribution_type = 'image' THEN 1 ELSE 0 END) as images,
        SUM(CASE WHEN contribution_type = 'molecule' THEN 1 ELSE 0 END) as molecules,
        SUM(CASE WHEN contribution_type = 'terroir' THEN 1 ELSE 0 END) as terroirs,
        SUM(CASE WHEN contribution_type = 'note' THEN 1 ELSE 0 END) as notes
      FROM plant_contributions
    `);
    await conn.end();
    return (rows as any[])[0] || { total: 0, pending: 0, approved: 0, rejected: 0 };
  } catch (error: any) {
    console.error('Error getting contribution stats:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0 };
  }
}

