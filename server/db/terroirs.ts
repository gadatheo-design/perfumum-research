// @ts-nocheck
/**
 * Module: terroirs
 * Généré automatiquement depuis server/db.ts
 * Sections: SITUATED SMELLS (Odeurs situées), GEOGRAPHIC ORIGINS FUNCTIONS, TERROIR SPECIALTIES (Spécialités par terroir) (+2 autres)
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
// SITUATED SMELLS (Odeurs situées)
// ====================================================================
// ============================================================================
// SITUATED SMELLS (Odeurs situées)
// ============================================================================

export async function getAllSituatedSmells() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(situatedSmells);
}

export async function getSituatedSmellById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(situatedSmells).where(eq(situatedSmells.id, id));
  return results[0] || null;
}



// ====================================================================
// GEOGRAPHIC ORIGINS FUNCTIONS
// ====================================================================
// ============================================================================
// GEOGRAPHIC ORIGINS FUNCTIONS
// ============================================================================

export async function getAllGeographicOrigins() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(geographicOrigins).orderBy(geographicOrigins.country, geographicOrigins.name);
}

export async function getGeographicOriginById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(geographicOrigins).where(eq(geographicOrigins.id, id));
  return results[0] || null;
}

export async function getGeographicOriginsByCountry(country: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(geographicOrigins).where(eq(geographicOrigins.country, country)).orderBy(geographicOrigins.name);
}

export async function createGeographicOrigin(data: InsertGeographicOrigin) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(geographicOrigins).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateGeographicOrigin(id: number, data: Partial<InsertGeographicOrigin>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(geographicOrigins).set(data).where(eq(geographicOrigins.id, id));
  return await getGeographicOriginById(id);
}

export async function deleteGeographicOrigin(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(geographicOrigins).where(eq(geographicOrigins.id, id));
}


// ====================================================================
// TERROIR SPECIALTIES (Spécialités par terroir)
// ====================================================================
// ============================================================================
// TERROIR SPECIALTIES (Spécialités par terroir)
// ============================================================================

export async function getTerroirSpecialties(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      specialty: terroirSpecialties,
      plant: plants,
      rawMaterial: rawMaterials,
    })
    .from(terroirSpecialties)
    .leftJoin(plants, eq(terroirSpecialties.plantId, plants.id))
    .leftJoin(rawMaterials, eq(terroirSpecialties.rawMaterialId, rawMaterials.id))
    .where(eq(terroirSpecialties.terroirId, terroirId))
    .orderBy(desc(terroirSpecialties.isSignature), terroirSpecialties.importance);
}

export async function getPlantTerroirSpecialties(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      specialty: terroirSpecialties,
      terroir: terroirs,
    })
    .from(terroirSpecialties)
    .innerJoin(terroirs, eq(terroirSpecialties.terroirId, terroirs.id))
    .where(eq(terroirSpecialties.plantId, plantId))
    .orderBy(desc(terroirSpecialties.isSignature));
}

export async function addTerroirSpecialty(data: InsertTerroirSpecialty) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(terroirSpecialties).values(data);
}

export async function updateTerroirSpecialty(id: number, data: Partial<InsertTerroirSpecialty>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(terroirSpecialties).set(data).where(eq(terroirSpecialties.id, id));
}

export async function deleteTerroirSpecialty(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(terroirSpecialties).where(eq(terroirSpecialties.id, id));
}


// ====================================================================
// STATISTIQUES GLOBALES
// ====================================================================
// ============================================================================
// STATISTIQUES GLOBALES
// ============================================================================

export async function getContentStatistics() {
  const db = await getDb();
  if (!db) return null;
  
  const totalMolecules = await db.select({ count: count() }).from(molecules);
  const totalPlants = await db.select({ count: count() }).from(plants);
  const totalRawMaterials = await db.select({ count: count() }).from(rawMaterials);
  const totalTerroirs = await db.select({ count: count() }).from(terroirs);
  const totalRecettes = await db.select({ count: count() }).from(recettes);
  const totalMoleculePlantLinks = await db.select({ count: count() }).from(moleculePlantSources);
  const totalRawMaterialMoleculeLinks = await db.select({ count: count() }).from(rawMaterialMolecules);
  
  return {
    molecules: totalMolecules[0]?.count || 0,
    plants: totalPlants[0]?.count || 0,
    rawMaterials: totalRawMaterials[0]?.count || 0,
    terroirs: totalTerroirs[0]?.count || 0,
    recettes: totalRecettes[0]?.count || 0,
    moleculePlantLinks: totalMoleculePlantLinks[0]?.count || 0,
    rawMaterialMoleculeLinks: totalRawMaterialMoleculeLinks[0]?.count || 0,
  };
}



// ====================================================================
// GEOGRAPHIC ZONES (Zones géographiques)
// ====================================================================
// ============================================================================
// GEOGRAPHIC ZONES (Zones géographiques)
// ============================================================================

export async function listGeographicZones(filters: {
  zoneType?: string;
  threatLevel?: string;
}) {
  const { zoneType, threatLevel } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(geographicZones);
  
  const conditions = [];
  if (zoneType) {
    conditions.push(eq(geographicZones.zoneType, zoneType as any));
  }
  if (threatLevel) {
    conditions.push(eq(geographicZones.threatLevel, threatLevel as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query;
}

export async function getGeographicZone(zoneId: number) {
  const db = await getDb();
  if (!db) return null;
  const [zone] = await db
    .select()
    .from(geographicZones)
    .where(eq(geographicZones.id, zoneId));
  return zone;
}

export async function getPlantsByGeographicZone(zoneId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const plantsInZone = await db
    .select({
      plantId: plantGeographicZones.plantId,
      zoneId: plantGeographicZones.zoneId,
      isPrimaryZone: plantGeographicZones.isPrimaryZone,
      populationStatus: plantGeographicZones.populationStatus,
      notes: plantGeographicZones.notes,
      // Informations de la plante
      plantName: plants.name,
      plantLatinName: plants.latinName,
      plantFamily: plants.family,
      plantCategory: plants.category,
      plantConservationStatus: plants.conservationStatus,
      plantLatitude: plants.latitude,
      plantLongitude: plants.longitude,
    })
    .from(plantGeographicZones)
    .innerJoin(plants, eq(plantGeographicZones.plantId, plants.id))
    .where(eq(plantGeographicZones.zoneId, zoneId));
  
  return plantsInZone;
}

export async function createGeographicZone(data: {
  name: string;
  region: string;
  zoneType: string;
  coordinates: any;
  description?: string;
  threatLevel?: string;
  speciesCount?: number;
  conservationPriority?: string;
  overlayColor?: string;
  overlayOpacity?: string;
  sustainableAlternatives?: string;
  conservationEfforts?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(geographicZones)
    .values(data as any);
  return getGeographicZone(result.insertId);
}

export async function updateGeographicZone(zoneId: number, data: {
  name?: string;
  region?: string;
  zoneType?: string;
  coordinates?: any;
  description?: string;
  threatLevel?: string;
  speciesCount?: number;
  conservationPriority?: string;
  overlayColor?: string;
  overlayOpacity?: string;
  sustainableAlternatives?: string;
  conservationEfforts?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(geographicZones)
    .set(data as any)
    .where(eq(geographicZones.id, zoneId));
  return getGeographicZone(zoneId);
}

export async function deleteGeographicZone(zoneId: number) {
  const db = await getDb();
  if (!db) return false;
  await db
    .delete(geographicZones)
    .where(eq(geographicZones.id, zoneId));
  return true;
}


