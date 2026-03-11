/**
 * Module: genealogy
 * Généré automatiquement depuis server/db.ts
 * Sections: VARIETY GENEALOGY HELPERS, GHOST VARIETIES (Variétés fantômes - AX1), GENEALOGY GRAPH DATA FOR D3.JS VISUALIZATION
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
  // Ghost Varieties
  ghostVarieties,
  GhostVariety,
  InsertGhostVariety,
} from "../../drizzle/schema";
import { getDb } from './core';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// VARIETY GENEALOGY HELPERS
// ====================================================================
// ============================================================================
// VARIETY GENEALOGY HELPERS
// ============================================================================

export async function getVarietyGenealogyTree(varietyId: number) {
  const db = await getDb();
  if (!db) return { parents: [], children: [] };
  // Get all relationships for this variety (as child or parent)
  const asChild = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.varietyId, varietyId));
  
  const asParent = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.parentVarietyId, varietyId));
  
  return {
    parents: asChild,
    children: asParent
  };
}

export async function getVarietyAncestors(varietyId: number, depth: number = 5) {
  const db = await getDb();
  if (!db) return [];
  const ancestors = [];
  let currentIds = [varietyId];
  
  for (let i = 0; i < depth; i++) {
    if (currentIds.length === 0) break;
    
    const parents = await db
      .select()
      .from(varietyGenealogy)
      .where(inArray(varietyGenealogy.varietyId, currentIds));
    
    if (parents.length === 0) break;
    
    ancestors.push(...parents);
    currentIds = parents.map(p => p.parentVarietyId);
  }
  
  return ancestors;
}

export async function getVarietyDescendants(varietyId: number, depth: number = 5) {
  const db = await getDb();
  if (!db) return [];
  const descendants = [];
  let currentIds = [varietyId];
  
  for (let i = 0; i < depth; i++) {
    if (currentIds.length === 0) break;
    
    const children = await db
      .select()
      .from(varietyGenealogy)
      .where(inArray(varietyGenealogy.parentVarietyId, currentIds));
    
    if (children.length === 0) break;
    
    descendants.push(...children);
    currentIds = children.map(c => c.varietyId);
  }
  
  return descendants;
}

export async function addVarietyRelationship(data: InsertVarietyGenealogy) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(varietyGenealogy).values(data);
  const [relationship] = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.id, result.insertId));
  return relationship;
}

export async function updateVarietyRelationship(id: number, data: Partial<InsertVarietyGenealogy>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(varietyGenealogy)
    .set(data)
    .where(eq(varietyGenealogy.id, id));
  const [relationship] = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.id, id));
  return relationship;
}

export async function removeVarietyRelationship(id: number) {
  const db = await getDb();
  if (!db) return null;
  await db.delete(varietyGenealogy).where(eq(varietyGenealogy.id, id));
  return { success: true, id };
}


// ====================================================================
// GHOST VARIETIES (Variétés fantômes - AX1)
// ====================================================================
// ============================================================================
// GHOST VARIETIES (Variétés fantômes - AX1)
// ============================================================================


/**
 * Get all ghost varieties
 */
export async function getAllGhostVarieties(): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarieties).orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost varieties by variety type
 */
export async function getGhostVarietiesByType(varietyType: "rose" | "jasmine" | "tobacco" | "cannabis" | "lavender" | "citrus" | "aromatic_herb" | "resin_tree" | "other"): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarieties)
    .where(eq(ghostVarieties.varietyType, varietyType))
    .orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost varieties by conservation status
 */
export async function getGhostVarietiesByStatus(status: "extinct" | "extinct_wild" | "critically_endangered" | "endangered" | "vulnerable" | "near_threatened" | "reconstructed" | "unknown"): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarieties)
    .where(eq(ghostVarieties.conservationStatus, status))
    .orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost variety by ID
 */
export async function getGhostVarietyById(id: number): Promise<GhostVariety | null> {
  const db = await getDb();
  if (!db) return null;
  const [variety] = await db.select().from(ghostVarieties).where(eq(ghostVarieties.id, id));
  return variety || null;
}

/**
 * Create a new ghost variety
 */
export async function createGhostVariety(data: Omit<InsertGhostVariety, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVariety> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(ghostVarieties).values(data);
  const [created] = await db.select().from(ghostVarieties).where(eq(ghostVarieties.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety
 */
export async function updateGhostVariety(id: number, data: Partial<InsertGhostVariety>): Promise<GhostVariety | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(ghostVarieties).set(data).where(eq(ghostVarieties.id, id));
  return getGhostVarietyById(id);
}

/**
 * Delete a ghost variety
 */
export async function deleteGhostVariety(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(ghostVarieties).where(eq(ghostVarieties.id, id));
  return true;
}

/**
 * Search ghost varieties
 */
export async function searchGhostVarieties(query: string): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db.select().from(ghostVarieties)
    .where(or(
      like(ghostVarieties.name, searchTerm),
      like(ghostVarieties.scientificName, searchTerm),
      like(ghostVarieties.description, searchTerm),
      like(ghostVarieties.lastDocumentedLocation, searchTerm)
    ))
    .orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost varieties statistics
 */
export async function getGhostVarietiesStats(): Promise<{
  total: number;
  byVarietyType: { type: string; count: number }[];
  byConservationStatus: { status: string; count: number }[];
}> {
  const db = await getDb();
  if (!db) return { total: 0, byVarietyType: [], byConservationStatus: [] };
  
  const [totalCount] = await db.select({ count: count() }).from(ghostVarieties);
  
  const byVarietyType = await db.select({
    type: ghostVarieties.varietyType,
    count: count(),
  }).from(ghostVarieties).groupBy(ghostVarieties.varietyType);
  
  const byConservationStatus = await db.select({
    status: ghostVarieties.conservationStatus,
    count: count(),
  }).from(ghostVarieties).groupBy(ghostVarieties.conservationStatus);
  
  return {
    total: totalCount.count,
    byVarietyType: byVarietyType.map(b => ({ type: b.type || 'other', count: b.count })),
    byConservationStatus: byConservationStatus.map(b => ({ status: b.status || 'unknown', count: b.count })),
  };
}


// ====================================================================
// GENEALOGY GRAPH DATA FOR D3.JS VISUALIZATION
// ====================================================================
// ============================================================================
// GENEALOGY GRAPH DATA FOR D3.JS VISUALIZATION
// ============================================================================

/**
 * Get all genealogy data for D3.js force-directed graph visualization
 * Returns nodes (varieties) and links (parent-child relationships)
 */
export async function getGenealogyGraphData(filters?: {
  plantType?: 'cannabis' | 'tobacco' | 'aromatic' | 'flower' | 'other' | 'all';
  includeModern?: boolean;
  includeLandraces?: boolean;
  relationshipTypes?: ('parent' | 'hybrid' | 'clone' | 'mutation')[];
  region?: string;
}) {
  const db = await getDb();
  if (!db) return { nodes: [], links: [], stats: null };
  
  try {
    // Build the base query with join to get plant info
    const baseQuery = db.select({
      id: plantVarieties.id,
      name: plantVarieties.name,
      plantId: plantVarieties.plantId,
      varietyType: plantVarieties.varietyType,
      countryOfOrigin: plantVarieties.countryOfOrigin,
      dominantMolecules: plantVarieties.dominantMolecules,
      molecularProfile: plantVarieties.molecularProfile,
      olfactiveNotes: plantVarieties.olfactiveNotes,
      plantName: plants.name,
      plantCategory: plants.category,
    })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id));

    let allVarietiesRaw = await baseQuery;
    
    // Get all genealogy relationships
    const allRelationships = await db.select().from(varietyGenealogy);
    
    // Filter varieties based on plant type / category
    let filteredVarieties = allVarietiesRaw;
    if (filters?.plantType && filters.plantType !== 'all') {
      filteredVarieties = allVarietiesRaw.filter(v => {
        const pName = (v.plantName || '').toLowerCase();
        const pCat = (v.plantCategory || '').toLowerCase();
        if (filters.plantType === 'cannabis') {
          return pName.includes('cannabis') || pCat === 'cannabis';
        }
        if (filters.plantType === 'tobacco') {
          return pName.includes('tabac') || pName.includes('tobacco') || pCat === 'tabac';
        }
        if (filters.plantType === 'aromatic') {
          return pCat === 'aromatic' || pCat === 'aromatique' || pCat === 'aromatic_plant';
        }
        if (filters.plantType === 'flower') {
          return pCat === 'flower' || pCat === 'fleur' || pCat === 'floral';
        }
        if (filters.plantType === 'other') {
          return !pName.includes('cannabis') && 
                 !pName.includes('tabac') && 
                 !pName.includes('tobacco') &&
                 pCat !== 'cannabis' && pCat !== 'tabac' &&
                 pCat !== 'aromatic' && pCat !== 'aromatique' &&
                 pCat !== 'flower' && pCat !== 'fleur';
        }
        return true;
      });
    }
    
    // Apply landrace/modern filters
    if (filters?.includeLandraces === false) {
      filteredVarieties = filteredVarieties.filter(v => v.varietyType !== 'landrace');
    }
    if (filters?.includeModern === false) {
      filteredVarieties = filteredVarieties.filter(v => v.varietyType === 'landrace');
    }
    
    // Apply region filter
    if (filters?.region) {
      const regionLower = filters.region.toLowerCase();
      filteredVarieties = filteredVarieties.filter(v => 
        (v.countryOfOrigin || '').toLowerCase().includes(regionLower)
      );
    }
    
    const varietyIds = new Set(filteredVarieties.map(v => v.id));
    
    // Build nodes
    const nodes = filteredVarieties.map(v => ({
      id: v.id,
      name: v.name,
      type: v.varietyType === 'landrace' ? 'landrace' : 'modern',
      varietyType: v.varietyType,
      plantName: v.plantName || 'Unknown',
      plantCategory: v.plantCategory || 'unknown',
      country: v.countryOfOrigin,
      dominantMolecules: v.dominantMolecules,
      molecularProfile: v.molecularProfile,
      olfactiveNotes: v.olfactiveNotes,
    }));
    
    // Build links (only include links where both nodes exist in filtered set)
    let filteredRelationships = allRelationships
      .filter(r => varietyIds.has(r.varietyId) && varietyIds.has(r.parentVarietyId));
    
    // Apply relationship type filter
    if (filters?.relationshipTypes && filters.relationshipTypes.length > 0) {
      filteredRelationships = filteredRelationships.filter(r =>
        (filters.relationshipTypes as string[]).includes(r.relationshipType || '')
      );
    }
    
    const links = filteredRelationships.map(r => ({
      id: r.id,
      source: r.parentVarietyId,
      target: r.varietyId,
      type: r.relationshipType,
      crossDate: r.crossDate,
      breeder: r.breeder,
      notes: r.notes,
    }));
    
    // Calculate stats
    const landraceCount = nodes.filter(n => n.type === 'landrace').length;
    const modernCount = nodes.filter(n => n.type === 'modern').length;
    const countriesSet = new Set(nodes.map(n => n.country).filter(Boolean));
    
    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    for (const node of nodes) {
      const cat = node.plantCategory || 'unknown';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    }
    
    return {
      nodes,
      links,
      stats: {
        totalVarieties: nodes.length,
        landraces: landraceCount,
        modern: modernCount,
        relationships: links.length,
        countries: countriesSet.size,
        countriesList: Array.from(countriesSet),
        categoryBreakdown,
      },
    };
  } catch (error) {
    console.error("Error getting genealogy graph data:", error);
    return { nodes: [], links: [], stats: null };
  }
}

/**
 * Get genealogy data for a specific variety with full ancestor/descendant tree
 */
export async function getVarietyFullGenealogy(varietyId: number, depth: number = 5) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    // Get the variety
    const [variety] = await db.select().from(plantVarieties).where(eq(plantVarieties.id, varietyId));
    if (!variety) return null;
    
    // Get ancestors
    const ancestors = await getVarietyAncestors(varietyId, depth);
    
    // Get descendants
    const descendants = await getVarietyDescendants(varietyId, depth);
    
    // Get all variety IDs involved
    const allIds = new Set([
      varietyId,
      ...ancestors.map(a => a.parentVarietyId),
      ...descendants.map(d => d.varietyId),
    ]);
    
    // Get full variety details for all involved
    const allVarieties = await db
      .select()
      .from(plantVarieties)
      .where(inArray(plantVarieties.id, Array.from(allIds)));
    
    // Get all relationships between these varieties
    const allRelationships = await db
      .select()
      .from(varietyGenealogy)
      .where(
        or(
          inArray(varietyGenealogy.varietyId, Array.from(allIds)),
          inArray(varietyGenealogy.parentVarietyId, Array.from(allIds))
        )
      );
    
    return {
      centralVariety: variety,
      nodes: allVarieties.map(v => ({
        id: v.id,
        name: v.name,
        type: v.varietyType === 'landrace' ? 'landrace' : 'modern',
        varietyType: v.varietyType,
        country: v.countryOfOrigin,
        isCentral: v.id === varietyId,
      })),
      links: allRelationships.map(r => ({
        source: r.parentVarietyId,
        target: r.varietyId,
        type: r.relationshipType,
      })),
      ancestorCount: ancestors.length,
      descendantCount: descendants.length,
    };
  } catch (error) {
    console.error("Error getting variety full genealogy:", error);
    return null;
  }
}


