/**
 * Extracted from server/db/molecules.ts
 * Module: Coconut
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

export async function getUnenrichedMoleculesForCOCONUT(limit: number = 50): Promise<{
  id: number;
  name: string;
  casNumber?: string;
  hasPubChem: boolean;
  hasChEBI: boolean;
}[]> {
  const db = await getDb();
  if (!db) return [];
  const [rows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    'SELECT id, name, cas_number as casNumber, pubchem_cid IS NOT NULL as hasPubChem, chebi_id IS NOT NULL as hasChEBI FROM molecules WHERE coconut_id IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  return (rows as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
    id: r.id as number,
    name: r.name as string,
    casNumber: (r.casNumber as string | undefined) || undefined,
    hasPubChem: Boolean(r.hasPubChem),
    hasChEBI: Boolean(r.hasChEBI),
  }));
}

/**
 * Statistiques d'enrichissement COCONUT
 */
export async function getCOCONUTEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  percentage: number;
  withOrganisms: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, percentage: 0, withOrganisms: 0 };
  const [rows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN coconut_id IS NOT NULL THEN 1 ELSE 0 END) as enriched,
      SUM(CASE WHEN coconut_organisms IS NOT NULL AND coconut_organisms != '[]' THEN 1 ELSE 0 END) as withOrganisms
    FROM molecules`
  );
  const stats = (rows as Record<string,unknown>[])[0];
  return {
    total: Number(stats.total) || 0,
    enriched: Number(stats.enriched) || 0,
    percentage: Number(stats.total) > 0 ? Math.round((Number(stats.enriched) / Number(stats.total)) * 100) : 0,
    withOrganisms: Number(stats.withOrganisms) || 0,
  };
}



// ====================================================================
// COCONUT ENRICHMENT FUNCTIONS
// ====================================================================
// ============================================================================
// COCONUT ENRICHMENT FUNCTIONS
// ============================================================================

/**
 * Update molecule with COCONUT natural product data
 */
export async function updateMoleculeCOCONUTData(moleculeId: number, data: {
  coconutId: string;
  npLikenessScore?: number;
  organisms?: { name: string; rank?: string }[];
  citations?: { doi?: string; title?: string }[];
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  // Requête paramétrée : `coconutId` venait d'une API externe (COCONUT) et
  // était interpolé sans aucun échappement.
  const organismsJson = data.organisms ? JSON.stringify(data.organisms) : null;
  const citationsJson = data.citations ? JSON.stringify(data.citations) : null;

  await db.execute(
    sql`UPDATE molecules
        SET coconut_id = ${data.coconutId}${
          data.npLikenessScore !== undefined
            ? sql`, np_likeness_score = ${data.npLikenessScore}`
            : sql``
        }${
          organismsJson ? sql`, coconut_organisms = ${organismsJson}` : sql``
        }${
          citationsJson ? sql`, coconut_citations = ${citationsJson}` : sql``
        }, coconut_enriched_at = NOW()
        WHERE id = ${moleculeId}`
  );
}

/**
 * Get molecules with COCONUT organism data
 */
export async function getMoleculesWithCOCONUTOrganisms(
  limit: number = 50,
  offset: number = 0
): Promise<{
  id: number;
  name: string;
  coconutId: string;
  npLikenessScore: number | null;
  organisms: { name: string; rank?: string }[];
}[]> {
  const db = await getDb();
  if (!db) return [];
  const [rows] = await (db as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(
    "SELECT id, name, coconut_id as coconutId, np_likeness_score as npLikenessScore, coconut_organisms as organisms FROM molecules WHERE coconut_organisms IS NOT NULL AND coconut_organisms != '[]' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  return (rows as Record<string,unknown>[]).map((r: Record<string,unknown>) => ({
    id: r.id as number,
    name: r.name as string,
    coconutId: r.coconutId as string,
    npLikenessScore: r.npLikenessScore != null ? Number(r.npLikenessScore) : null,
    organisms: r.organisms ? (typeof r.organisms === 'string' ? JSON.parse(r.organisms) : r.organisms) : [],
  }));
}



// ====================================================================
// FLAVORNET ENRICHMENT FUNCTIONS
// ====================================================================
// ============================================================================
// FLAVORNET ENRICHMENT FUNCTIONS
// ============================================================================


/**
 * Update molecule with Flavornet olfactory data
 */
