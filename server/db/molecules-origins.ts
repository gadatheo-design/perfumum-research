/**
 * Extracted from server/db/molecules.ts
 * Module: Origins
 */
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

export async function getMoleculeOrigins(moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    productionVolume: moleculeOrigins.productionVolume,
    priceRange: moleculeOrigins.priceRange,
    specificCharacteristics: moleculeOrigins.specificCharacteristics,
    notes: moleculeOrigins.notes,
    origin: geographicOrigins,
  })
    .from(moleculeOrigins)
    .innerJoin(geographicOrigins, eq(moleculeOrigins.originId, geographicOrigins.id))
    .where(eq(moleculeOrigins.moleculeId, moleculeId));
}
export async function getOriginMolecules(originId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    molecule: molecules,
  })
    .from(moleculeOrigins)
    .innerJoin(molecules, eq(moleculeOrigins.moleculeId, molecules.id))
    .where(eq(moleculeOrigins.originId, originId));
}
export async function addMoleculeOrigin(data: InsertMoleculeOrigin) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(moleculeOrigins).values(data);
  return { id: Number(result[0].insertId), ...data };
}
export async function updateMoleculeOrigin(id: number, data: Partial<InsertMoleculeOrigin>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(moleculeOrigins).set(data).where(eq(moleculeOrigins.id, id));
}
export async function removeMoleculeOrigin(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(moleculeOrigins).where(eq(moleculeOrigins.id, id));
}


// ====================================================================
// MOLECULE SCIENTIFIC DATA UPDATE
// ====================================================================
// ============================================================================
// MOLECULE SCIENTIFIC DATA UPDATE
// ============================================================================
export async function getAllGeographicOriginsWithMoleculeCount() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const origins = await db.select().from(geographicOrigins).orderBy(geographicOrigins.country, geographicOrigins.name);
  
  // Récupérer le comptage des molécules pour chaque origine
  const moleculeCounts = await db.select({
    originId: moleculeOrigins.originId,
    count: sql<number>`COUNT(*)`.as('count'),
  })
    .from(moleculeOrigins)
    .groupBy(moleculeOrigins.originId);
  
  // Créer une map pour un accès rapide
  const countMap = new Map(moleculeCounts.map(mc => [mc.originId, mc.count]));
  
  // Enrichir les origines avec le comptage
  return origins.map(origin => ({
    ...origin,
    moleculeCount: countMap.get(origin.id) || 0,
  }));
}

/**
 * Récupère les molécules d'une origine avec leurs détails complets
 */
export async function getOriginMoleculesWithDetails(originId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    productionVolume: moleculeOrigins.productionVolume,
    priceRange: moleculeOrigins.priceRange,
    specificCharacteristics: moleculeOrigins.specificCharacteristics,
    notes: moleculeOrigins.notes,
    molecule: {
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalFormula: molecules.chemicalFormula,
      olfactiveProfile: molecules.olfactiveProfile,
      casNumber: molecules.casNumber,
      iupacName: molecules.iupacName,
      chemicalClass: molecules.chemicalClass,
    },
  })
    .from(moleculeOrigins)
    .innerJoin(molecules, eq(moleculeOrigins.moleculeId, molecules.id))
    .where(eq(moleculeOrigins.originId, originId))
    .orderBy(molecules.name);
}

/**
 * Recherche les origines par nom de molécule
 */
export async function searchOriginsByMoleculeName(moleculeName: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Trouver les molécules correspondantes
  const matchingMolecules = await db.select({ id: molecules.id })
    .from(molecules)
    .where(like(molecules.name, `%${moleculeName}%`));
  
  if (matchingMolecules.length === 0) return [];
  
  const moleculeIds = matchingMolecules.map(m => m.id);
  
  // Trouver les origines liées à ces molécules
  const originIds = await db.select({ originId: moleculeOrigins.originId })
    .from(moleculeOrigins)
    .where(inArray(moleculeOrigins.moleculeId, moleculeIds));
  
  if (originIds.length === 0) return [];
  
  const uniqueOriginIds = Array.from(new Set(originIds.map(o => o.originId)));
  
  // Récupérer les origines avec le comptage
  const origins = await db.select().from(geographicOrigins)
    .where(inArray(geographicOrigins.id, uniqueOriginIds))
    .orderBy(geographicOrigins.name);
  
  // Ajouter le comptage des molécules correspondantes
  return origins.map(origin => {
    const count = originIds.filter(o => o.originId === origin.id).length;
    return { ...origin, matchingMoleculeCount: count };
  });
}



// ====================================================================
// PLANT-MOLECULE LINKS - EXTENDED FUNCTIONS
// ====================================================================
// ============================================================================
// PLANT-MOLECULE LINKS - EXTENDED FUNCTIONS
// ============================================================================

/**
 * Récupère toutes les liaisons plantes-molécules avec détails
 */
