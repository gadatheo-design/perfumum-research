import { type OrphanMoleculeStats } from "./molecules-stats";
/**
 * Extracted from server/db/molecules.ts
 * Module: Orphans
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

export async function getOrphanPlants(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const plantsWithLinks = await db
    .selectDistinct({ plantId: plantMolecules.plantId })
    .from(plantMolecules);
  
  const linkedPlantIds = plantsWithLinks.map(p => p.plantId);
  
  if (linkedPlantIds.length === 0) {
    return db.select().from(plants).limit(limit);
  }
  
  return db.select().from(plants)
    .where(notInArray(plants.id, linkedPlantIds))
    .orderBy(plants.name)
    .limit(limit);
}

/**
 * Récupère les molécules sans liaisons (orphelines)
 */
export async function getOrphanMolecules(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const moleculesWithLinks = await db
    .selectDistinct({ moleculeId: plantMolecules.moleculeId })
    .from(plantMolecules);
  
  const linkedMoleculeIds = moleculesWithLinks.map(m => m.moleculeId);
  
  if (linkedMoleculeIds.length === 0) {
    return db.select().from(molecules).limit(limit);
  }
  
  return db.select().from(molecules)
    .where(notInArray(molecules.id, linkedMoleculeIds))
    .orderBy(molecules.name)
    .limit(limit);
}


// ====================================================================
// PUBCHEM ENRICHMENT LOGGING
// ====================================================================
// ============================================================================
// PUBCHEM ENRICHMENT LOGGING
// ============================================================================

/**
 * Met à jour une molécule avec les données PubChem
 */
export async function getOrphanMoleculeStats(): Promise<OrphanMoleculeStats | null> {
  const db = await getDb();
  if (!db) return null;

  const allMolecules = await db.select().from(molecules);
  const total = allMolecules.length;

  const withFamily = allMolecules.filter(m => m.family && m.family.trim() !== '').length;
  const withChemicalClass = allMolecules.filter(m => m.chemicalClass).length;
  const withCasNumber = allMolecules.filter(m => m.casNumber && m.casNumber.trim() !== '').length;
  const withIupacName = allMolecules.filter(m => m.iupacName && m.iupacName.trim() !== '').length;
  const withFormula = allMolecules.filter(m => m.chemicalFormula && m.chemicalFormula.trim() !== '').length;
  const withOlfactiveProfile = allMolecules.filter(m => m.olfactiveProfile && m.olfactiveProfile.trim() !== '').length;
  const withRadarComplete = allMolecules.filter(m => 
    m.radarIntensity !== null && m.radarIntensity !== 50 &&
    m.radarFreshness !== null && m.radarFreshness !== 50 &&
    m.radarWarmth !== null && m.radarWarmth !== 50 &&
    m.radarSweetness !== null && m.radarSweetness !== 50 &&
    m.radarSpiciness !== null && m.radarSpiciness !== 50 &&
    m.radarEarthiness !== null && m.radarEarthiness !== 50
  ).length;

  // Une molécule est "orpheline" si elle n'a ni famille, ni classe chimique, ni profil olfactif
  const orphanCount = allMolecules.filter(m => 
    (!m.family || m.family.trim() === '') &&
    !m.chemicalClass &&
    (!m.olfactiveProfile || m.olfactiveProfile.trim() === '')
  ).length;

  // Taux de classification = moyenne des champs remplis
  const classificationRate = Math.round(
    ((withFamily + withChemicalClass + withCasNumber + withIupacName + withFormula + withOlfactiveProfile) / (total * 6)) * 100
  );

  return {
    totalMolecules: total,
    withFamily,
    withChemicalClass,
    withCasNumber,
    withIupacName,
    withFormula,
    withOlfactiveProfile,
    withRadarComplete,
    orphanCount,
    classificationRate,
  };
}

export type OrphanFilter = 'all' | 'no_family' | 'no_chemical_class' | 'no_cas' | 'no_iupac' | 'no_formula' | 'no_olfactive_profile' | 'no_radar';
export async function getOrphanMoleculesList(filter: OrphanFilter = 'all', limit: number = 100, offset: number = 0): Promise<{ molecules: Molecule[]; total: number }> {
  const db = await getDb();
  if (!db) return { molecules: [], total: 0 };

  let allMolecules = await db.select().from(molecules);

  // Filtrer selon le critère
  switch (filter) {
    case 'no_family':
      allMolecules = allMolecules.filter(m => !m.family || m.family.trim() === '');
      break;
    case 'no_chemical_class':
      allMolecules = allMolecules.filter(m => !m.chemicalClass);
      break;
    case 'no_cas':
      allMolecules = allMolecules.filter(m => !m.casNumber || m.casNumber.trim() === '');
      break;
    case 'no_iupac':
      allMolecules = allMolecules.filter(m => !m.iupacName || m.iupacName.trim() === '');
      break;
    case 'no_formula':
      allMolecules = allMolecules.filter(m => !m.chemicalFormula || m.chemicalFormula.trim() === '');
      break;
    case 'no_olfactive_profile':
      allMolecules = allMolecules.filter(m => !m.olfactiveProfile || m.olfactiveProfile.trim() === '');
      break;
    case 'no_radar':
      allMolecules = allMolecules.filter(m => 
        m.radarIntensity === 50 && m.radarFreshness === 50 && m.radarWarmth === 50 &&
        m.radarSweetness === 50 && m.radarSpiciness === 50 && m.radarEarthiness === 50
      );
      break;
    case 'all':
    default:
      // Molécules orphelines = sans famille ET sans classe chimique ET sans profil olfactif
      allMolecules = allMolecules.filter(m => 
        (!m.family || m.family.trim() === '') &&
        !m.chemicalClass &&
        (!m.olfactiveProfile || m.olfactiveProfile.trim() === '')
      );
      break;
  }

  const total = allMolecules.length;
  const paginatedMolecules = allMolecules.slice(offset, offset + limit);

  return {
    molecules: paginatedMolecules,
    total,
  };
}
