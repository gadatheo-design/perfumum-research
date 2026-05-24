/**
 * Extracted from server/db/plants.ts
 * Module: Chemotypes
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

export async function getAllChemotypes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).orderBy(chemotypes.plantName, chemotypes.name);
}

export async function getChemotypeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(chemotypes).where(eq(chemotypes.id, id));
  return result[0] || null;
}

export async function getChemotypesByPlantId(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).where(eq(chemotypes.plantId, plantId));
}

export async function getChemotypesByPlantName(plantName: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).where(like(chemotypes.plantName, `%${plantName}%`));
}

export async function searchChemotypes(query: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chemotypes).where(
    or(
      like(chemotypes.name, `%${query}%`),
      like(chemotypes.plantName, `%${query}%`),
      like(chemotypes.dominantMoleculeName, `%${query}%`),
      like(chemotypes.origin, `%${query}%`)
    )
  );
}

export async function createChemotype(data: InsertChemotype) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chemotypes).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateChemotype(id: number, data: Partial<InsertChemotype>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(chemotypes).set(data).where(eq(chemotypes.id, id));
  return getChemotypeById(id);
}

export async function deleteChemotype(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(chemotypes).where(eq(chemotypes.id, id));
}

export async function getChemotypesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byPlant: [], byAxis: [] };
  
  const all = await db.select().from(chemotypes);
  
  // Grouper par plante
  const byPlant = all.reduce((acc, ct) => {
    const existing = acc.find(p => p.plantName === ct.plantName);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ plantName: ct.plantName, count: 1 });
    }
    return acc;
  }, [] as { plantName: string; count: number }[]);
  
  // Grouper par axe climatique
  const byAxis = all.reduce((acc, ct) => {
    if (ct.climaticAxis) {
      const existing = acc.find(a => a.axis === ct.climaticAxis);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ axis: ct.climaticAxis, count: 1 });
      }
    }
    return acc;
  }, [] as { axis: string; count: number }[]);
  
  return {
    total: all.length,
    byPlant: byPlant.sort((a, b) => b.count - a.count),
    byAxis: byAxis.sort((a, b) => b.count - a.count),
  };
}



// ====================================================================
// PLANT IMAGES FUNCTIONS
// ====================================================================
// ============================================================================
// PLANT IMAGES FUNCTIONS
// ============================================================================

/**
 * Met à jour l'URL de l'image d'une plante
 */
