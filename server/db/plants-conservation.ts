/**
 * Extracted from server/db/plants.ts
 * Module: Conservation
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

export async function listThreatenedPlants(filters: {
  iucn?: string;
  cites?: string;
  region?: string;
}): Promise<Plant[]> {
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
  // Le `as any` reste nécessaire pour composer les conditions, mais le type
  // de retour est déclaré : sans lui, la page Patrimoine menacé recevait `any`
  // et tous ses callbacks perdaient leur type.
  return await (query as any).where(and(...conditions)) as Plant[];
}

export async function getPlantConservationStatus(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  const [plant] = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
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
  threatFactors?: Record<string,unknown>;
  sustainableAlternatives?: string;
  lastAssessmentYear?: number;
  historicalStatus?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  await db.update(plants).set(data as any).where(eq(plants.id, plantId));
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
