/**
 * Module: molecules
 * Généré automatiquement depuis server/db.ts
 * Sections: MOLECULES, MOLECULE DETAILS WITH RELATIONS, GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS (+25 autres)
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
  ghostVarietyMoleculeLinks,
  GhostVarietyMoleculeLink,
  InsertGhostVarietyMoleculeLink,
  genomicMoleculeLinks,
  GenomicMoleculeLink,
  InsertGenomicMoleculeLink,
} from "../../drizzle/schema";
import { getDb } from './core';
import type { FlavornetData } from '../flavornet';
import { enrichMoleculeWithTranslationCOCONUT } from '../coconut';
import { getPlantVarietyById } from './plants';

import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// MOLECULES
// ====================================================================
// ============================================================================
// MOLECULES
// ============================================================================

/**
 * Parse tous les champs JSON d'une molécule qui peuvent être stockés comme strings
 * par MySQL/TiDB (comportement natif : les colonnes json() reviennent parfois en string).
 *
 * SOURCE UNIQUE DE VÉRITÉ pour le parsing JSON des molécules.
 * AJOUTER ICI tout nouveau champ JSON ajouté au schema molecules.
 *
 * Champs couverts :
 *   - json() dans Drizzle : references, pubchemSynonyms, coconutOrganisms, coconutCitations, ifraData
 *   - text() contenant parfois du JSON : therapeuticProperties, olfactiveProfile
 */

export { getAllMoleculeRecetteRelationships, insertMoleculeRecetteAssociation, batchInsertMoleculeRecetteAssociations, getRecettesWithoutMoleculesByGamme, getMoleculesForGamme, enrichGammeAssociations } from './molecules-recipes';
export { getAllMoleculeSynergies, getMoleculeSynergiesGraphData } from './molecules-synergies';
export { getMoleculeOrigins, getOriginMolecules, addMoleculeOrigin, updateMoleculeOrigin, removeMoleculeOrigin, getAllGeographicOriginsWithMoleculeCount, getOriginMoleculesWithDetails, searchOriginsByMoleculeName } from './molecules-origins';
export { getTerpProfileMolecules, addMoleculeToTerpProfile } from './molecules-terpene-profiles';
export { getPlantMolecules, addMoleculeToPlant, getMoleculePlantSources, getPlantMoleculeSources, addMoleculePlantSource, updateMoleculePlantSource, deleteMoleculePlantSource, getAllPlantMoleculeLinks, createPlantMoleculeLink, deletePlantMoleculeLink, updatePlantMoleculeLink, getPlantMoleculeLinksStats, checkPlantMoleculeLinkExists } from './molecules-plant-sources';
export { getRawMaterialMolecules, getMoleculeRawMaterials, addMoleculeToRawMaterial, removeMoleculeFromRawMaterial } from './molecules-raw-materials';
export { getSignatureMolecules } from './molecules-signatures';
export { updateVarietyConservationStatus } from './molecules-conservation';
export { getUniqueVarietyCountries, getMoleculeEnrichmentStats } from './molecules-stats';
export { getOrphanPlants, getOrphanMolecules, getOrphanMoleculeStats, getOrphanMoleculesList } from './molecules-orphans';
export { enrichMoleculeFromPubChem, getMoleculesForPubChemEnrichment, enrichMoleculeFromCOCONUTWithTranslation } from './molecules-pubchem';
export { getTpsGeneMoleculeLinks, createTpsGeneMoleculeLink, updateTpsGeneMoleculeLink, deleteTpsGeneMoleculeLink, getTpsGeneMoleculeLinkStats, autoLinkTpsGenesToMolecules, searchMoleculeMatchesForTpsGene, getTpsGenesByMolecule, getAllTpsGenes, getTpsGeneStats } from './molecules-tps-genes';
export { getUnenrichedMoleculesForCOCONUT, getCOCONUTEnrichmentStats, updateMoleculeCOCONUTData, getMoleculesWithCOCONUTOrganisms } from './molecules-coconut';
export { updateMoleculeFlavornetData, getUnenrichedMoleculesForFlavornet, getMoleculesWithFlavornetPercepts, getFlavornetEnrichmentStats } from './molecules-flavornet';

export function parseMoleculeJsonFields(mol: Record<string, unknown>): Record<string, unknown> {
  const jsonArrayFields = ['references', 'pubchemSynonyms', 'coconutOrganisms', 'coconutCitations'];
  const jsonObjectFields = ['ifraData'];
  const textJsonArrayFields = ['therapeuticProperties', 'olfactiveProfile'];

  for (const field of jsonArrayFields) {
    const val = mol[field];
    if (val !== null && val !== undefined && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try { mol[field] = JSON.parse(trimmed); } catch { mol[field] = []; }
      }
    }
  }

  for (const field of jsonObjectFields) {
    const val = mol[field];
    if (val !== null && val !== undefined && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try { mol[field] = JSON.parse(trimmed); } catch { mol[field] = null; }
      }
    }
  }

  for (const field of textJsonArrayFields) {
    const val = mol[field];
    if (val !== null && val !== undefined && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) mol[field] = parsed;
        } catch { /* garder la string originale */ }
      }
    }
  }

  return mol;
}

export async function getAllMolecules(): Promise<Molecule[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(molecules);
  return rows.map(r => parseMoleculeJsonFields(r as Record<string, unknown>)) as Molecule[];
}

export async function getMoleculeById(id: number): Promise<Molecule | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(molecules).where(eq(molecules.id, id)).limit(1);
  const mol = result[0];
  if (!mol) return undefined;
  return parseMoleculeJsonFields(mol as Record<string, unknown>) as Molecule;
}


// ====================================================================
// MOLECULE DETAILS WITH RELATIONS
// ====================================================================
// ============================================================================
// MOLECULE DETAILS WITH RELATIONS
// ============================================================================

export async function getMoleculeWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get molecule
  const moleculesList = await db.select().from(molecules).where(eq(molecules.id, id));
  if (moleculesList.length === 0) return null;
  const mol = parseMoleculeJsonFields(moleculesList[0] as Record<string, unknown>);
  
  // Get related recettes via molecule_recettes
  const relatedRecettes = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      formula: recettes.formula,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, id));
  
  return {
    molecule: mol,
    recettes: relatedRecettes,
  };
}



// ====================================================================
// GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS
// ====================================================================
// ============================================================================
// GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS
// ============================================================================

export async function updateMoleculeRadar(data: {
  id: number;
  radarIntensity: number;
  radarFreshness: number;
  radarWarmth: number;
  radarSweetness: number;
  radarSpiciness: number;
  radarEarthiness: number;
}): Promise<Molecule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(molecules).set({
    radarIntensity: data.radarIntensity,
    radarFreshness: data.radarFreshness,
    radarWarmth: data.radarWarmth,
    radarSweetness: data.radarSweetness,
    radarSpiciness: data.radarSpiciness,
    radarEarthiness: data.radarEarthiness,
  }).where(eq(molecules.id, data.id));
  
  const updated = await getMoleculeById(data.id);
  if (!updated) throw new Error('Molecule not found after update');
  
  return updated;
}


// ====================================================================
// MOLECULES REFERENCES UPDATE
// ====================================================================
// ============================================================================
// MOLECULES REFERENCES UPDATE
// ============================================================================

export async function updateMoleculeReferences(id: number, referencesJson: string): Promise<Molecule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Parse JSON string to array
  const referencesArray = JSON.parse(referencesJson);
  
  await db.update(molecules).set({
    references: referencesArray,
  }).where(eq(molecules.id, id));
  
  const updated = await getMoleculeById(id);
  if (!updated) throw new Error('Molecule not found after update');
  
  return updated;
}



// ====================================================================
// ENRICHISSEMENT DES DONNÉES MOLÉCULES
// ====================================================================
// ============================================================================
// ENRICHISSEMENT DES DONNÉES MOLÉCULES

// ====================================================================
// BATCH INSERT MOLECULES-RECETTES ASSOCIATIONS
// ====================================================================
// ============================================================================
// BATCH INSERT MOLECULES-RECETTES ASSOCIATIONS
// ============================================================================

export async function updateMoleculeScientificData(id: number, data: {
  iupacName?: string;
  casNumber?: string;
  chemicalClass?: "terpene" | "sesquiterpene" | "diterpene" | "monoterpene" | "aldehyde" | "ketone" | "alcohol" | "ester" | "ether" | "phenol" | "lactone" | "coumarin" | "musk" | "nitrile" | "sulfur_compound" | "heterocyclic" | "aromatic" | "aliphatic" | "other";
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(molecules).set(data).where(eq(molecules.id, id));
  return await getMoleculeById(id);
}

export async function getMoleculesWithoutCas() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecules).where(isNull(molecules.casNumber)).orderBy(molecules.name);
}

export async function getMoleculesWithCas() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecules).where(isNotNull(molecules.casNumber)).orderBy(molecules.name);
}



// ====================================================================
// RELATIONS: TerpProfiles <-> Molecules
// ====================================================================
// ============================================================================
// RELATIONS: TerpProfiles <-> Molecules
// ============================================================================

export async function getPlantsByMolecule(moleculeId: number): Promise<Array<{ plant: Plant; percentageMin: number | null; percentageMax: number | null; percentageTypical: number | null; isSignature: number | null; role: string | null }>> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    plant: plants,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .where(eq(plantMolecules.moleculeId, moleculeId))
    .orderBy(desc(plantMolecules.percentageTypical));
}

/**
 * Récupère les molécules signatures d'une plante
 */

export async function batchClassifyMolecules(updates: Array<{
  moleculeId: number;
  family?: string;
  chemicalClass?: string;
  olfactiveProfile?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, updated: 0 };

  let updated = 0;
  for (const update of updates) {
    const updateData: Record<string, unknown> = {};
    if (update.family !== undefined) updateData.family = update.family;
    if (update.chemicalClass !== undefined) updateData.chemicalClass = update.chemicalClass;
    if (update.olfactiveProfile !== undefined) {
      // Écrire dans la colonne text legacy (rétrocompatibilité)
      updateData.olfactiveProfile = update.olfactiveProfile;
      // Écrire aussi dans la colonne JSON standardisée
      // Si la valeur est déjà un tableau JSON, on la parse ; sinon on la convertit en tableau
      try {
        const parsed = JSON.parse(update.olfactiveProfile);
        if (Array.isArray(parsed)) {
          updateData.olfactiveProfileJson = JSON.stringify(parsed);
        } else {
          // Valeur scalaire JSON : la mettre dans un tableau
          updateData.olfactiveProfileJson = JSON.stringify([String(parsed)]);
        }
      } catch {
        // Valeur texte brute (ex: "floral, boisé") : découper par virgule
        const arr = update.olfactiveProfile.split(',').map(s => s.trim()).filter(Boolean);
        updateData.olfactiveProfileJson = JSON.stringify(arr);
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db.update(molecules).set(updateData).where(eq(molecules.id, update.moleculeId));
      updated++;
    }
  }

  return { success: true, updated };
}


// ====================================================================
// GENOMIC MOLECULE LINKS (Liaisons génomiques molécules - G1-G3)
// ====================================================================
// ============================================================================
// GENOMIC MOLECULE LINKS (Liaisons génomiques molécules - G1-G3)
// ============================================================================

/**
 * Get all genomic molecule links
 */

export async function getAllGenomicMoleculeLinks(): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks).orderBy(desc(genomicMoleculeLinks.createdAt));
}

/**
 * Get genomic links for a molecule
 */

export async function getGenomicLinksForMolecule(moleculeId: number): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.moleculeId, moleculeId));
}

/**
 * Get genomic links by axis
 */

export async function getGenomicMoleculeLinksByAxis(axis: 'G1' | 'G2' | 'G3'): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.genomicAxis, axis))
    .orderBy(desc(genomicMoleculeLinks.relevanceScore));
}

/**
 * Get genomic links for a reference
 */

export async function getGenomicMoleculeLinksForReference(referenceId: number): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.referenceId, referenceId));
}

/**
 * Create a genomic molecule link
 */

export async function createGenomicMoleculeLink(data: Omit<InsertGenomicMoleculeLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GenomicMoleculeLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(genomicMoleculeLinks).values(data);
  const [created] = await db.select().from(genomicMoleculeLinks).where(eq(genomicMoleculeLinks.id, result.insertId));
  return created;
}

/**
 * Delete a genomic molecule link
 */

export async function deleteGenomicMoleculeLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(genomicMoleculeLinks).where(eq(genomicMoleculeLinks.id, id));
  return true;
}


// ====================================================================
// GHOST VARIETY MOLECULE LINKS (Liaisons variétés fantômes ↔ molécules)
// ====================================================================
// ============================================================================
// GHOST VARIETY MOLECULE LINKS (Liaisons variétés fantômes ↔ molécules)
// ============================================================================


/**
 * Get all molecule links for a ghost variety
 */

export async function getGhostVarietyMoleculeLinks(ghostVarietyId: number): Promise<(GhostVarietyMoleculeLink & { molecule: { id: number; name: string; casNumber: string | null; family: string | null } | null })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(ghostVarietyMoleculeLinks)
    .where(eq(ghostVarietyMoleculeLinks.ghostVarietyId, ghostVarietyId))
    .orderBy(desc(ghostVarietyMoleculeLinks.percentage));
  
  // Get molecule details for each link
  const result = await Promise.all(links.map(async (link) => {
    const [molecule] = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
      family: molecules.family,
    }).from(molecules).where(eq(molecules.id, link.moleculeId));
    return { ...link, molecule: molecule || null };
  }));
  
  return result;
}

/**
 * Create a ghost variety molecule link
 */

export async function createGhostVarietyMoleculeLink(data: Omit<InsertGhostVarietyMoleculeLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyMoleculeLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyMoleculeLinks).values(data);
  const [created] = await db.select().from(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety molecule link
 */

export async function updateGhostVarietyMoleculeLink(id: number, data: Partial<InsertGhostVarietyMoleculeLink>): Promise<GhostVarietyMoleculeLink | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyMoleculeLinks).set(data).where(eq(ghostVarietyMoleculeLinks.id, id));
  const [updated] = await db.select().from(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety molecule link
 */

export async function deleteGhostVarietyMoleculeLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, id));
  return true;
}

/**
 * Get all molecule links (for stats)
 */

export async function getAllGhostVarietyMoleculeLinks(): Promise<GhostVarietyMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarietyMoleculeLinks).orderBy(desc(ghostVarietyMoleculeLinks.createdAt));
}


// ====================================================================
// TPS GENE - MOLECULE LINKS FUNCTIONS
// ====================================================================
// ============================================================================
// TPS GENE - MOLECULE LINKS FUNCTIONS

// ====================================================================
// Get all TPS gene-molecule links with gene and molecule details
// ====================================================================
// ============================================================================

// Get all TPS gene-molecule links with gene and molecule details

export async function searchMoleculesByName(name: string): Promise<{
  id: number;
  name: string;
  chemicalFormula: string | null;
  olfactiveFamily: string | null;
  chemicalClass: string | null;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${name.toLowerCase()}%`;
  
  const results = await db.select()
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) LIKE ${searchTerm}`)
    .orderBy(molecules.name)
    .limit(50);
  
  return results.map(m => ({
    id: m.id,
    name: m.name,
    chemicalFormula: m.chemicalFormula,
    olfactiveFamily: m.family,
    chemicalClass: m.chemicalClass,
    casNumber: m.casNumber,
  }));
}


// Note: utiliser getDb() pour obtenir l'instance drizzle


// ====================================================================
// MOLECULE PERFUMES — Parfums emblématiques
// ====================================================================
// ============================================================================
// MOLECULE PERFUMES — Parfums emblématiques
// ============================================================================

export async function getMoleculePerfumes(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await (db as unknown as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(
    `SELECT
       mp.id,
       mp.perfume_name AS perfumeName,
       mp.perfume_house AS perfumeHouse,
       mp.perfumer,
       mp.year,
       mp.role_in_perfume AS roleInPerfume,
       mp.concentration,
       mp.description
     FROM molecule_perfumes mp
     WHERE mp.molecule_id = ${moleculeId}
     ORDER BY mp.year ASC`
  ));
  const rows: Record<string,unknown>[] = (result[0] as unknown) as Record<string,unknown>[];
  return rows.map((r: Record<string,unknown>) => ({
    id: r.id as number,
    perfumeName: r.perfumeName as string,
    perfumeHouse: r.perfumeHouse as string,
    perfumer: r.perfumer as string | null,
    year: r.year as number | null,
    roleInPerfume: r.roleInPerfume as string,
    concentration: r.concentration as string | null,
    description: r.description as string | null,
  }));
}

// Get all molecule-perfume links for the /parfums page (navigation inverse)

export async function getAllMoleculePerfumeLinks(): Promise<Array<{
  moleculeId: number;
  moleculeName: string;
  perfumeName: string;
  perfumeHouse: string;
  perfumer: string | null;
  year: number | null;
  roleInPerfume: string;
  concentration: string | null;
  description: string | null;
}>> {
  try {
    const db = await getDb();
    if (!db) return [];
    const result = await (db as unknown as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(
      `SELECT
         mp.molecule_id       AS moleculeId,
         m.name               AS moleculeName,
         mp.perfume_name      AS perfumeName,
         mp.perfume_house     AS perfumeHouse,
         mp.perfumer          AS perfumer,
         mp.year              AS year,
         mp.role_in_perfume   AS roleInPerfume,
         mp.concentration     AS concentration,
         mp.description       AS description
       FROM molecule_perfumes mp
       JOIN molecules m ON m.id = mp.molecule_id
       ORDER BY mp.perfume_house, mp.perfume_name, mp.role_in_perfume`
    ));
    const rows: Record<string,unknown>[] = (result[0] as unknown) as Record<string,unknown>[];
    return rows.map((r: Record<string,unknown>) => ({
      moleculeId: Number(r.moleculeId),
      moleculeName: r.moleculeName as string,
      perfumeName: r.perfumeName as string,
      perfumeHouse: r.perfumeHouse as string,
      perfumer: r.perfumer as string | null,
      year: r.year ? Number(r.year) : null,
      roleInPerfume: r.roleInPerfume as string,
      concentration: r.concentration as string | null,
      description: r.description as string | null,
    }));
  } catch (error: unknown) {
    console.error('Error getting all molecule-perfume links:', error);
    return [];
  }
}

// ─── Parfums emblématiques d'une plante ──────────────────────────────────────

export async function getPlantPerfumes(plantId: number) {
  try {
    const dbConn = await getDb();
    if (!dbConn) return [];
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(
      `SELECT id, plant_id, perfume_name, perfume_house, perfumer, year,
              role_in_perfume, ingredient_type, description, created_at
       FROM plant_perfumes
       WHERE plant_id = ?
       ORDER BY year ASC, perfume_name ASC`,
      [plantId]
    );
    await conn.end();
    return rows as unknown[];
  } catch (error: unknown) {
    console.error('Error getting plant perfumes:', error);
    return [];
  }
}


