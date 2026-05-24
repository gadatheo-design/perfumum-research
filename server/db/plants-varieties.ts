/**
 * Extracted from server/db/plants.ts
 * Module: Varieties
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

export function groupVarietiesByStatus(
  items: Array<{ variety: { conservationStatus?: string | null }; plant: { category?: string | null } | null }>
): { status: string; count: number }[] {
  const result = items.reduce((acc, item) => {
    const status = item.variety.conservationStatus || 'unknown';
    const existing = acc.find(s => s.status === status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, [] as { status: string; count: number }[]);
  return result.sort((a, b) => b.count - a.count);
}

/** Groupe un tableau d'items par la catégorie de leur plante */

export function groupVarietiesByCategory(
  items: Array<{ variety: { conservationStatus?: string | null }; plant: { category?: string | null } | null }>
): { category: string; count: number }[] {
  const result = items.reduce((acc, item) => {
    const category = item.plant?.category || 'unknown';
    const existing = acc.find(c => c.category === category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);
  return result.sort((a, b) => b.count - a.count);
}

/** Construit les conditions de filtrage pour getPlantVarietiesWithFilters */

export function buildVarietyFilterConditions(filters: {
  plantCategory?: string;
  varietyType?: string;
  conservationStatus?: string;
  countryOfOrigin?: string;
  searchQuery?: string;
}): string[] {
  const conditions: string[] = [];
  if (filters.plantCategory) conditions.push(`category=${filters.plantCategory}`);
  if (filters.varietyType) conditions.push(`varietyType=${filters.varietyType}`);
  if (filters.conservationStatus) conditions.push(`conservationStatus=${filters.conservationStatus}`);
  if (filters.countryOfOrigin) conditions.push(`countryOfOrigin=${filters.countryOfOrigin}`);
  if (filters.searchQuery) conditions.push(`search=${filters.searchQuery}`);
  return conditions;
}

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
  
  const conditions: SQL[] = [];
  
  if (filters.plantCategory) {
    conditions.push(eq(plants.category, filters.plantCategory as Plant['category']));
  }
  
  if (filters.varietyType) {
    conditions.push(eq(plantVarieties.varietyType, filters.varietyType as PlantVariety['varietyType']));
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
    source: plantMolecules.source,
    notes: plantMolecules.notes,
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
    .where(eq(plantVarieties.varietyType, varietyType as PlantVariety['varietyType']))
    .orderBy(plantVarieties.name);
}

/**
 * Récupère les landraces de cannabis
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
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
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
    latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
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
      latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
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
