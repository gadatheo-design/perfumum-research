/**
 * Extracted from server/db/molecules.ts
 * Module: Flavornet
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

export async function updateMoleculeFlavornetData(moleculeId: number, data: FlavornetData): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const perceptsJson = JSON.stringify(data.percepts).replace(/'/g, "''");
  const kovatsJson = data.kovatsRI ? JSON.stringify(data.kovatsRI).replace(/'/g, "''") : null;
  
  const query = "UPDATE molecules SET flavornet_percepts = '" + perceptsJson + "'" +
    (kovatsJson ? ", flavornet_kovats_ri = '" + kovatsJson + "'" : "") +
    ", flavornet_enriched_at = NOW() WHERE id = " + moleculeId;
  await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(query);
}

/**
 * Get molecules that need Flavornet enrichment
 */
export async function getUnenrichedMoleculesForFlavornet(limit: number = 100): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  const [rows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    'SELECT id, name, cas_number as casNumber FROM molecules WHERE flavornet_percepts IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  return (rows as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
    id: r.id as number,
    name: r.name as string,
    casNumber: (r.casNumber as string | null) ?? null,
  }));
}

/**
 * Get molecules with Flavornet percepts
 */
export async function getMoleculesWithFlavornetPercepts(
  limit: number = 50,
  offset: number = 0
): Promise<{
  id: number;
  name: string;
  percepts: string[];
  kovatsRI: Record<string, number> | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  const [rows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    "SELECT id, name, flavornet_percepts as percepts, flavornet_kovats_ri as kovatsRI FROM molecules WHERE flavornet_percepts IS NOT NULL AND flavornet_percepts != '[]' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  return (rows as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
    id: r.id as number,
    name: r.name as string,
    percepts: r.percepts ? (typeof r.percepts === 'string' ? JSON.parse(r.percepts) : r.percepts as string[]) : [],
    kovatsRI: r.kovatsRI ? (typeof r.kovatsRI === 'string' ? JSON.parse(r.kovatsRI) : r.kovatsRI as Record<string, number>) : null,
  }));
}

/**
 * Flavornet enrichment statistics
 */
export async function getFlavornetEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  percentage: number;
  withPercepts: number;
  withKovatsRI: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, percentage: 0, withPercepts: 0, withKovatsRI: 0 };
  const [totalRows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute('SELECT COUNT(*) as count FROM molecules');
  const total = Number((totalRows as Record<string,unknown>[])[0]?.count) || 0;
  const [enrichedRows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute('SELECT COUNT(*) as count FROM molecules WHERE flavornet_percepts IS NOT NULL');
  const enriched = Number((enrichedRows as Record<string,unknown>[])[0]?.count) || 0;
  const [perceptsRows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute("SELECT COUNT(*) as count FROM molecules WHERE flavornet_percepts IS NOT NULL AND flavornet_percepts != '[]'");
  const withPercepts = Number((perceptsRows as Record<string,unknown>[])[0]?.count) || 0;
  const [kovatsRows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute('SELECT COUNT(*) as count FROM molecules WHERE flavornet_kovats_ri IS NOT NULL');
  const withKovatsRI = Number((kovatsRows as Record<string,unknown>[])[0]?.count) || 0;
  
  return {
    total,
    enriched,
    percentage: total > 0 ? Math.round((enriched / total) * 100) : 0,
    withPercepts,
    withKovatsRI,
  };
}


/**
 * Recherche de molécules par nom (pour la page /recherche-molecule)
 */
