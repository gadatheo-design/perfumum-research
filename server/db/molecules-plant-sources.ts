/**
 * Extracted from server/db/molecules.ts
 * Module: Plant Sources
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

export async function getPlantMolecules(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      molecule: molecules,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
      notes: plantMolecules.notes,
    })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(eq(plantMolecules.plantId, plantId));
}
export async function addMoleculeToPlant(
  plantId: number, 
  moleculeId: number, 
  options?: {
    percentageMin?: number;
    percentageMax?: number;
    percentageTypical?: number;
    isSignature?: number;
    role?: "majeur" | "secondaire" | "trace" | "variable";
    notes?: string;
    source?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(plantMolecules).values({ 
    plantId, 
    moleculeId, 
    percentageMin: options?.percentageMin,
    percentageMax: options?.percentageMax,
    percentageTypical: options?.percentageTypical,
    isSignature: options?.isSignature, 
    role: options?.role,
    notes: options?.notes,
    source: options?.source,
  });
}



// ====================================================================
// RAW MATERIAL MOLECULES (Liaison matière première <-> molécule)
// ====================================================================
// ============================================================================
// RAW MATERIAL MOLECULES (Liaison matière première <-> molécule)
// ============================================================================
export async function getMoleculePlantSources(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      plant: plants,
      plantPart: moleculePlantSources.plantPart,
      percentageInPlant: moleculePlantSources.percentageInPlant,
      percentageInOil: moleculePlantSources.percentageInOil,
      variability: moleculePlantSources.variability,
      isMainSource: moleculePlantSources.isMainSource,
      isPrimarySource: moleculePlantSources.isPrimarySource,
      bestExtractionMethod: moleculePlantSources.bestExtractionMethod,
      extractionYield: moleculePlantSources.extractionYield,
    })
    .from(moleculePlantSources)
    .innerJoin(plants, eq(moleculePlantSources.plantId, plants.id))
    .where(eq(moleculePlantSources.moleculeId, moleculeId))
    .orderBy(desc(moleculePlantSources.isMainSource), desc(moleculePlantSources.percentageInOil));
}
export async function getPlantMoleculeSources(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      molecule: molecules,
      plantPart: moleculePlantSources.plantPart,
      percentageInPlant: moleculePlantSources.percentageInPlant,
      percentageInOil: moleculePlantSources.percentageInOil,
      variability: moleculePlantSources.variability,
      isMainSource: moleculePlantSources.isMainSource,
    })
    .from(moleculePlantSources)
    .innerJoin(molecules, eq(moleculePlantSources.moleculeId, molecules.id))
    .where(eq(moleculePlantSources.plantId, plantId))
    .orderBy(desc(moleculePlantSources.percentageInOil));
}
export async function addMoleculePlantSource(data: InsertMoleculePlantSource) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return db.insert(moleculePlantSources).values(data);
}
export async function updateMoleculePlantSource(id: number, data: Partial<InsertMoleculePlantSource>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(moleculePlantSources).set(data).where(eq(moleculePlantSources.id, id));
}
export async function deleteMoleculePlantSource(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(moleculePlantSources).where(eq(moleculePlantSources.id, id));
}


// ====================================================================
// GEOGRAPHIC ORIGINS WITH MOLECULE COUNT
// ====================================================================
// ============================================================================
// GEOGRAPHIC ORIGINS WITH MOLECULE COUNT
// ============================================================================

/**
 * Récupère toutes les origines géographiques avec le nombre de molécules associées
 */
export async function getAllPlantMoleculeLinks() {
  const db = await getDb();
  if (!db) return [];
  
  // Sélection explicite des colonnes pour éviter les conflits
  // Note: la table plant_molecules n'a pas de colonne id (clé composite plant_id + molecule_id)
  return db.select({
    // Colonnes du lien
    plantId: plantMolecules.plantId,
    moleculeId: plantMolecules.moleculeId,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
    variabilityFactor: plantMolecules.variabilityFactor,
    source: plantMolecules.source,
    linkNotes: plantMolecules.notes,
    // Colonnes de la plante
    plantName: plants.name,
    plantLatinName: plants.latinName,
    plantFamily: plants.family,
    // Colonnes de la molécule
    moleculeName: molecules.name,
    moleculeFamily: molecules.family,
    moleculeCasNumber: molecules.casNumber,
    moleculeOlfactiveProfile: molecules.olfactiveProfile,
  })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .orderBy(plants.name, molecules.name);
}

/**
 * Récupère les plantes associées à une molécule
 */
export async function createPlantMoleculeLink(data: {
  plantId: number;
  moleculeId: number;
  percentageMin?: number;
  percentageMax?: number;
  percentageTypical?: number;
  isSignature?: number;
  role?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(plantMolecules).values({
    plantId: data.plantId,
    moleculeId: data.moleculeId,
    percentageMin: data.percentageMin,
    percentageMax: data.percentageMax,
    percentageTypical: data.percentageTypical,
    isSignature: data.isSignature || 0,
    role: data.role as any,
  });
  
  return { id: Number(result[0].insertId), ...data };
}

/**
 * Supprime une liaison plante-molécule
 */
export async function deletePlantMoleculeLink(plantId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(plantMolecules).where(
    and(
      eq(plantMolecules.plantId, plantId),
      eq(plantMolecules.moleculeId, moleculeId)
    )
  );
}

/**
 * Met à jour une liaison plante-molécule (pourcentages, rôle, signature)
 */
export async function updatePlantMoleculeLink(
  plantId: number,
  moleculeId: number,
  data: {
    percentageMin?: number | null;
    percentageMax?: number | null;
    percentageTypical?: number | null;
    isSignature?: number;
    role?: string;
    source?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(plantMolecules)
    .set({
      ...(data.percentageMin !== undefined && { percentageMin: data.percentageMin ?? null }),
      ...(data.percentageMax !== undefined && { percentageMax: data.percentageMax ?? null }),
      ...(data.percentageTypical !== undefined && { percentageTypical: data.percentageTypical ?? null }),
      ...(data.isSignature !== undefined && { isSignature: data.isSignature }),
      ...(data.role !== undefined && { role: data.role as any }),
      ...(data.source !== undefined && { source: data.source }),
    })
    .where(
      and(
        eq(plantMolecules.plantId, plantId),
        eq(plantMolecules.moleculeId, moleculeId)
      )
    );

  return { plantId, moleculeId, ...data };
}

/**
 * Met à jour le statut de conservation d'une variété
 */
export async function getPlantMoleculeLinksStats() {
  const db = await getDb();
  if (!db) return { total: 0, plantsWithLinks: 0, moleculesWithLinks: 0, orphanPlants: 0, orphanMolecules: 0 };
  
  const [totalLinks] = await db.select({ count: count() }).from(plantMolecules);
  
  // Plantes avec au moins une liaison
  const plantsWithLinksResult = await db
    .selectDistinct({ plantId: plantMolecules.plantId })
    .from(plantMolecules);
  
  // Molécules avec au moins une liaison
  const moleculesWithLinksResult = await db
    .selectDistinct({ moleculeId: plantMolecules.moleculeId })
    .from(plantMolecules);
  
  // Total plantes et molécules
  const [totalPlants] = await db.select({ count: count() }).from(plants);
  const [totalMolecules] = await db.select({ count: count() }).from(molecules);
  
  return {
    total: totalLinks?.count || 0,
    plantsWithLinks: plantsWithLinksResult.length,
    moleculesWithLinks: moleculesWithLinksResult.length,
    orphanPlants: (totalPlants?.count || 0) - plantsWithLinksResult.length,
    orphanMolecules: (totalMolecules?.count || 0) - moleculesWithLinksResult.length,
    totalPlants: totalPlants?.count || 0,
    totalMolecules: totalMolecules?.count || 0,
  };
}

/**
 * Vérifie si une liaison plante-molécule existe déjà
 */
export async function checkPlantMoleculeLinkExists(plantId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const [existing] = await db.select({ id: plantMolecules.plantId })
    .from(plantMolecules)
    .where(
      and(
        eq(plantMolecules.plantId, plantId),
        eq(plantMolecules.moleculeId, moleculeId)
      )
    )
    .limit(1);
  
  return !!existing;
}

/**
 * Récupère les plantes sans liaisons (orphelines)
 */
