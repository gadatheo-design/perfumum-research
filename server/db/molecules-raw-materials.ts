/**
 * Extracted from server/db/molecules.ts
 * Module: Raw Materials
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

export async function getRawMaterialMolecules(rawMaterialId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      molecule: molecules,
      percentage: rawMaterialMolecules.percentage,
      isSignature: rawMaterialMolecules.isSignature,
      variability: rawMaterialMolecules.variability,
      notes: rawMaterialMolecules.notes,
    })
    .from(rawMaterialMolecules)
    .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
    .where(eq(rawMaterialMolecules.rawMaterialId, rawMaterialId))
    .orderBy(desc(rawMaterialMolecules.percentage));
}
export async function getMoleculeRawMaterials(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      rawMaterial: rawMaterials,
      percentage: rawMaterialMolecules.percentage,
      isSignature: rawMaterialMolecules.isSignature,
      variability: rawMaterialMolecules.variability,
    })
    .from(rawMaterialMolecules)
    .innerJoin(rawMaterials, eq(rawMaterialMolecules.rawMaterialId, rawMaterials.id))
    .where(eq(rawMaterialMolecules.moleculeId, moleculeId))
    .orderBy(desc(rawMaterialMolecules.percentage));
}
export async function addMoleculeToRawMaterial(data: InsertRawMaterialMolecule) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(rawMaterialMolecules).values(data);
}
export async function removeMoleculeFromRawMaterial(rawMaterialId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(rawMaterialMolecules)
    .where(and(
      eq(rawMaterialMolecules.rawMaterialId, rawMaterialId),
      eq(rawMaterialMolecules.moleculeId, moleculeId)
    ));
}


// ====================================================================
// MOLECULE PLANT SOURCES (Sources botaniques des molécules)
// ====================================================================
// ============================================================================
// MOLECULE PLANT SOURCES (Sources botaniques des molécules)
// ============================================================================
