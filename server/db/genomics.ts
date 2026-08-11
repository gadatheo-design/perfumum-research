/**
 * Module: genomics
 * Généré automatiquement depuis server/db.ts
 * Sections: MOLECULAR TRANSFORMATIONS (Pyrolysis) Functions
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
// MOLECULAR TRANSFORMATIONS (Pyrolysis) Functions
// ====================================================================
// ============================================================================
// MOLECULAR TRANSFORMATIONS (Pyrolysis) Functions
// ============================================================================

/**
 * Get all molecular transformations with optional filtering
 */
export async function getMolecularTransformations(options?: {
  transformationType?: string;
  relevanceContext?: string;
  sourceMoleculeName?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    let query = `
      SELECT 
        mt.*,
        sm.name as source_molecule_db_name,
        pm.name as product_molecule_db_name
      FROM molecular_transformations mt
      LEFT JOIN molecules sm ON mt.source_molecule_id = sm.id
      LEFT JOIN molecules pm ON mt.product_molecule_id = pm.id
      WHERE 1=1
    `;
    
    if (options?.transformationType) {
      query += ` AND mt.transformation_type = '${options.transformationType}'`;
    }
    if (options?.relevanceContext) {
      query += ` AND mt.relevance_context = '${options.relevanceContext}'`;
    }
    if (options?.sourceMoleculeName) {
      query += ` AND mt.source_molecule_name LIKE '%${options.sourceMoleculeName}%'`;
    }
    
    query += ` ORDER BY mt.source_molecule_name`;
    
    if (options?.limit) {
      query += ` LIMIT ${options.limit}`;
    }
    if (options?.offset) {
      query += ` OFFSET ${options.offset}`;
    }
    
    const result = await (db as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(query));
    return (result[0] as unknown[]) ?? [];
  } catch (error) {
    console.error("Error getting molecular transformations:", error);
    return [];
  }
}

/**
 * Create a new molecular transformation
 */
export async function createMolecularTransformation(data: {
  sourceMoleculeName: string;
  productMoleculeName: string;
  transformationType: string;
  sourceMoleculeId?: number;
  productMoleculeId?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  temperatureOptimal?: number;
  yieldPercent?: number;
  olfactoryChangeDescription?: string;
  sourceOlfactoryNotes?: string;
  productOlfactoryNotes?: string;
  relevanceContext?: string;
  sourceReference?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    // Requête paramétrée (template `sql` = placeholders liés, pas `sql.raw`).
    // Avant : sourceMoleculeName / productMoleculeName / transformationType /
    // relevanceContext étaient interpolés sans aucun échappement.
    const result = await db.execute(sql`
      INSERT INTO molecular_transformations (
        source_molecule_name, product_molecule_name, transformation_type,
        source_molecule_id, product_molecule_id,
        temperature_min, temperature_max, temperature_optimal,
        yield_percent, olfactory_change_description,
        source_olfactory_notes, product_olfactory_notes,
        relevance_context, source_reference, notes
      ) VALUES (
        ${data.sourceMoleculeName}, ${data.productMoleculeName}, ${data.transformationType},
        ${data.sourceMoleculeId ?? null}, ${data.productMoleculeId ?? null},
        ${data.temperatureMin ?? null}, ${data.temperatureMax ?? null}, ${data.temperatureOptimal ?? null},
        ${data.yieldPercent ?? null}, ${data.olfactoryChangeDescription ?? null},
        ${data.sourceOlfactoryNotes ?? null},
        ${data.productOlfactoryNotes ?? null},
        ${data.relevanceContext || 'tobacco_combustion'},
        ${data.sourceReference ?? null},
        ${data.notes ?? null}
      )
    `);
    return result;
  } catch (error) {
    console.error("Error creating molecular transformation:", error);
    return null;
  }
}

/**
 * Get transformation statistics
 */
export async function getMolecularTransformationStats() {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await (db as { execute: (q: unknown) => Promise<unknown[]> }).execute(sql.raw(`
      SELECT 
        COUNT(*) as total_transformations,
        COUNT(DISTINCT source_molecule_name) as unique_sources,
        COUNT(DISTINCT product_molecule_name) as unique_products,
        COUNT(DISTINCT transformation_type) as transformation_types,
        COUNT(DISTINCT relevance_context) as relevance_contexts
      FROM molecular_transformations
    `));
    return ((result[0] as unknown[]) ?? [])[0] ?? null;
  } catch (error) {
    console.error("Error getting transformation stats:", error);
    return null;
  }
}


