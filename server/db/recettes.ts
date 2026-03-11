// @ts-nocheck
/**
 * Module: recettes
 * Généré automatiquement depuis server/db.ts
 * Sections: RECETTES, RECETTE DETAILS WITH RELATIONS, RECETTES CRUD OPERATIONS (+7 autres)
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
import { ENV } from '../_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../../shared/botanicalLatinNames';


// ====================================================================
// RECETTES
// ====================================================================
// ============================================================================
// RECETTES
// ============================================================================

export async function getAllRecettes(): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recettes);
}

export async function getRecetteById(id: number): Promise<Recette | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(recettes).where(eq(recettes.id, id)).limit(1);
  return result[0];
}

export async function getRecettesByCategory(category: "tabac" | "resine" | "resine_cbd" | "cone" | "parfum" | "encens" | "extrait"): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recettes).where(eq(recettes.category, category));
}

export async function getRecetteVariations(parentId: number): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recettes).where(eq(recettes.parentRecetteId, parentId));
}

export async function getRecetteParent(recetteId: number): Promise<Recette | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const recette = await db.select().from(recettes).where(eq(recettes.id, recetteId)).limit(1);
  if (!recette[0]?.parentRecetteId) return undefined;
  const parent = await db.select().from(recettes).where(eq(recettes.id, recette[0].parentRecetteId)).limit(1);
  return parent[0];
}

export async function getRecetteFormulesReference(recetteId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recettesFormulesReference).where(eq(recettesFormulesReference.recetteId, recetteId));
}


// ====================================================================
// RECETTE DETAILS WITH RELATIONS
// ====================================================================
// ============================================================================
// RECETTE DETAILS WITH RELATIONS
// ============================================================================

export async function getRecetteWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get recette
  const recettesList = await db.select().from(recettes).where(eq(recettes.id, id));
  if (recettesList.length === 0) return null;
  
  const recette = recettesList[0];
  
  // Get related molecules via molecule_recettes with radar data and proportion/role
  const relatedMolecules = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      chemicalFormula: molecules.chemicalFormula,
      family: molecules.family,
      olfactiveProfile: molecules.olfactiveProfile,
      chemicalClass: molecules.chemicalClass,
      casNumber: molecules.casNumber,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
      // Données de liaison
      proportion: moleculesRecettes.proportion,
      role: moleculesRecettes.role,
      linkNotes: moleculesRecettes.notes,
      linkSource: sql<string>`'molecules_recettes'`,
    })
    .from(moleculesRecettes)
    .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
    .where(eq(moleculesRecettes.recetteId, id))
    .orderBy(desc(moleculesRecettes.proportion));

  // Get ALSO molecules linked via recette_molecules (from parsing)
  const linkedMolecules = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      chemicalFormula: molecules.chemicalFormula,
      family: molecules.family,
      olfactiveProfile: molecules.olfactiveProfile,
      chemicalClass: molecules.chemicalClass,
      casNumber: molecules.casNumber,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
      proportion: recetteMolecules.proportion,
      role: recetteMolecules.role,
      linkNotes: sql<string>`NULL`,
      linkSource: sql<string>`'recette_molecules'`,
    })
    .from(recetteMolecules)
    .innerJoin(molecules, eq(recetteMolecules.moleculeId, molecules.id))
    .where(eq(recetteMolecules.recetteId, id))
    .orderBy(desc(recetteMolecules.proportion));

  // Merge: avoid duplicates (prefer moleculesRecettes if same molecule appears in both)
  const existingIds = new Set(relatedMolecules.map(m => m.id));
  const mergedMolecules = [
    ...relatedMolecules,
    ...linkedMolecules.filter(m => !existingIds.has(m.id)),
  ].sort((a, b) => (Number(b.proportion) || 0) - (Number(a.proportion) || 0));
  
  // Get family if familyId exists
  let family = null;
  if (recette.familyId) {
    const familiesList = await db.select().from(families).where(eq(families.id, recette.familyId));
    if (familiesList.length > 0) {
      family = familiesList[0];
    }
  }
  
  // Get accord if accordId exists
  let accord = null;
  if (recette.accordId) {
    const accordsList = await db.select().from(accords).where(eq(accords.id, recette.accordId));
    if (accordsList.length > 0) {
      accord = accordsList[0];
    }
  }
  
  return {
    recette,
    molecules: mergedMolecules,
    family,
    accord,
  };
}



// ====================================================================
// RECETTES CRUD OPERATIONS
// ====================================================================
// ============================================================================
// RECETTES CRUD OPERATIONS
// ============================================================================

export async function createRecette(data: InsertRecette): Promise<Recette> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(recettes).values(data);
  const insertedId = Number((result as any)[0]?.insertId || 0);
  
  const created = await getRecetteById(insertedId);
  if (!created) throw new Error('Failed to retrieve created recette');
  
  return created;
}

export async function updateRecette(id: number, data: Partial<InsertRecette>): Promise<Recette> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(recettes).set(data).where(eq(recettes.id, id));
  
  const updated = await getRecetteById(id);
  if (!updated) throw new Error('Recette not found after update');
  
  return updated;
}

export async function deleteRecette(id: number): Promise<{ success: boolean }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Delete related records first (moleculesRecettes junction table)
  await db.delete(moleculesRecettes).where(eq(moleculesRecettes.recetteId, id));
  
  // Delete the recette
  await db.delete(recettes).where(eq(recettes.id, id));
  
  return { success: true };
}



// ====================================================================
// COMPARE RECETTES - TOUTES LES RECETTES AVEC MOLÉCULES
// ====================================================================
// ============================================================================
// COMPARE RECETTES - TOUTES LES RECETTES AVEC MOLÉCULES
// ============================================================================

export async function getAllRecettesWithMoleculesForCompare(recetteIds: number[]) {
  const db = await getDb();
  if (!db || recetteIds.length === 0) return [];
  
  const result = await Promise.all(
    recetteIds.map(async (recetteId) => {
      const recette = await db
        .select()
        .from(recettes)
        .where(eq(recettes.id, recetteId))
        .limit(1);
      
      if (recette.length === 0) return null;
      
      const mols = await db
        .select({
          molecule: molecules,
          proportion: moleculesRecettes.proportion,
        })
        .from(moleculesRecettes)
        .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
        .where(eq(moleculesRecettes.recetteId, recetteId));
      
      return {
        recette: recette[0],
        molecules: mols,
      };
    })
  );
  
  return result.filter(r => r !== null);
}



// ====================================================================
// IMPORT CSV - Helper functions
// ====================================================================
// ============================================================================
// IMPORT CSV - Helper functions
// ============================================================================

export async function getMoleculeByName(name: string): Promise<Molecule | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(molecules).where(eq(molecules.name, name)).limit(1);
  return result[0];
}

export async function updateMolecule(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(molecules)
    .set({
      name: data.nom || undefined,
      chemicalFormula: data.formule || undefined,
      family: data.familleChimique || undefined,
      olfactiveProfile: data.noteOlfactive || undefined,
      notes: data.description || undefined,
    })
    .where(eq(molecules.id, id));
}

export async function getRecetteByName(name: string): Promise<Recette | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(recettes).where(eq(recettes.name, name)).limit(1);
  return result[0];
}

export async function getAccordByName(name: string): Promise<Accord | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(accords).where(eq(accords.name, name)).limit(1);
  return result[0];
}

export async function updateAccord(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(accords)
    .set({
      name: data.nom || undefined,
      notes: data.description || undefined,
      familyId: data.familleId || undefined,
    })
    .where(eq(accords.id, id));
}

export async function getFamilyByName(name: string): Promise<Family | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(families).where(eq(families.name, name)).limit(1);
  return result[0];
}

export async function updateFamily(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(families)
    .set({
      name: data.nom || undefined,
      description: data.description || undefined,
    })
    .where(eq(families.id, id));
}

export async function getMatiereByName(name: string): Promise<Laboratoire | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(laboratoire).where(eq(laboratoire.name, name)).limit(1);
  return result[0];
}

export async function updateMatiere(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(laboratoire)
    .set({
      name: data.nom || undefined,
      type: data.type || undefined,
      origin: data.origine || undefined,
      supplier: data.fournisseur || undefined,
      pricePerMl: data.prixUnitaire || undefined,
      purchaseDate: data.dateAchat || undefined,
      technicalNotes: data.notes || undefined,
    })
    .where(eq(laboratoire.id, id));
}



// ====================================================================
// LIAISON MOLÉCULES-RECETTES
// ====================================================================
// ============================================================================
// LIAISON MOLÉCULES-RECETTES
// ============================================================================

/**
 * Lie des molécules à une recette avec proportions et rôles
 */
export async function linkMoleculesToRecette(
  recetteId: number,
  moleculesData: Array<{ moleculeId: number; proportion: number; role: "tête" | "cœur" | "fond" }>
): Promise<{ success: boolean }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Supprimer les liaisons existantes
  await db.delete(moleculesRecettes).where(eq(moleculesRecettes.recetteId, recetteId));
  
  // Insérer les nouvelles liaisons
  if (moleculesData.length > 0) {
    await db.insert(moleculesRecettes).values(
      moleculesData.map((m) => ({
        recetteId,
        moleculeId: m.moleculeId,
        proportion: m.proportion.toString(),
        role: m.role,
      }))
    );
  }
  
  return { success: true };
}

/**
 * Récupère toutes les molécules liées à une recette
 */
export async function getMoleculesByRecette(recetteId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      proportion: moleculesRecettes.proportion,
      role: moleculesRecettes.role,
      notes: moleculesRecettes.notes,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(moleculesRecettes)
    .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
    .where(eq(moleculesRecettes.recetteId, recetteId));
  
  return result;
}



// ====================================================================
// FINAL RECIPES (Recettes finales: Parfum, Encens, Espace)
// ====================================================================
// ============================================================================
// FINAL RECIPES (Recettes finales: Parfum, Encens, Espace)
// ============================================================================

export async function getAllFinalRecipes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(finalRecipes).orderBy(finalRecipes.recipeId);
}

export async function getFinalRecipeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(finalRecipes).where(eq(finalRecipes.id, id));
  return result[0] || null;
}

export async function getFinalRecipeByRecipeId(recipeId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(finalRecipes).where(eq(finalRecipes.recipeId, recipeId));
  return result[0] || null;
}

export async function getFinalRecipesByType(recipeType: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(finalRecipes).where(eq(finalRecipes.recipeType, recipeType as any)).orderBy(finalRecipes.recipeId);
}

export async function getFinalRecipesByClimaticAxis(axis: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(finalRecipes).where(eq(finalRecipes.climaticAxis, axis as any)).orderBy(finalRecipes.recipeId);
}

export async function getRadicalRecipes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(finalRecipes).where(eq(finalRecipes.isRadical, 1)).orderBy(finalRecipes.recipeId);
}

export async function createFinalRecipe(data: InsertFinalRecipe) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(finalRecipes).values(data);
  return result;
}

export async function updateFinalRecipe(id: number, data: Partial<InsertFinalRecipe>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(finalRecipes).set(data).where(eq(finalRecipes.id, id));
  return await getFinalRecipeById(id);
}

export async function deleteFinalRecipe(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(finalRecipes).where(eq(finalRecipes.id, id));
}


// ====================================================================
// LIAISONS RECETTES TL <-> TERP PROFILES
// ====================================================================
// ============================================================================
// LIAISONS RECETTES TL <-> TERP PROFILES
// ============================================================================

/**
 * Récupère les TerpProfiles liés à une recette via les molécules partagées
 * Les recettes TL utilisent les mêmes molécules que certains TerpProfiles
 */
export async function getTerpProfilesForRecette(recetteId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer les molécules de la recette
  const recetteMols = await db
    .select({ moleculeId: moleculesRecettes.moleculeId })
    .from(moleculesRecettes)
    .where(eq(moleculesRecettes.recetteId, recetteId));
  
  if (recetteMols.length === 0) return [];
  
  const moleculeIds = recetteMols.map(m => m.moleculeId);
  
  // Trouver les TerpProfiles qui contiennent ces molécules
  const profiles = await db
    .select({
      profile: terpProfiles,
      moleculeId: terpProfileMolecules.moleculeId,
      percentage: terpProfileMolecules.percentage,
    })
    .from(terpProfiles)
    .innerJoin(terpProfileMolecules, eq(terpProfiles.id, terpProfileMolecules.terpProfileId))
    .where(inArray(terpProfileMolecules.moleculeId, moleculeIds));
  
  // Grouper par profile et calculer le score de correspondance
  const profileMap = new Map<number, { profile: TerpProfile; matchedMolecules: number; totalMolecules: number }>();
  
  for (const row of profiles) {
    if (!profileMap.has(row.profile.id)) {
      profileMap.set(row.profile.id, {
        profile: row.profile,
        matchedMolecules: 0,
        totalMolecules: moleculeIds.length,
      });
    }
    profileMap.get(row.profile.id)!.matchedMolecules++;
  }
  
  // Retourner les profiles triés par score de correspondance
  return Array.from(profileMap.values())
    .map(p => ({
      ...p.profile,
      matchScore: Math.round((p.matchedMolecules / p.totalMolecules) * 100),
      matchedMolecules: p.matchedMolecules,
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Récupère les recettes liées à un TerpProfile via les molécules partagées
 */
export async function getRecettesForTerpProfile(terpProfileId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer les molécules du TerpProfile
  const profileMols = await db
    .select({ moleculeId: terpProfileMolecules.moleculeId })
    .from(terpProfileMolecules)
    .where(eq(terpProfileMolecules.terpProfileId, terpProfileId));
  
  if (profileMols.length === 0) return [];
  
  const moleculeIds = profileMols.map(m => m.moleculeId);
  
  // Trouver les recettes qui utilisent ces molécules
  const recettesWithMols = await db
    .select({
      recette: recettes,
      moleculeId: moleculesRecettes.moleculeId,
    })
    .from(recettes)
    .innerJoin(moleculesRecettes, eq(recettes.id, moleculesRecettes.recetteId))
    .where(inArray(moleculesRecettes.moleculeId, moleculeIds));
  
  // Grouper par recette et calculer le score
  const recetteMap = new Map<number, { recette: Recette; matchedMolecules: number; totalMolecules: number }>();
  
  for (const row of recettesWithMols) {
    if (!recetteMap.has(row.recette.id)) {
      recetteMap.set(row.recette.id, {
        recette: row.recette,
        matchedMolecules: 0,
        totalMolecules: moleculeIds.length,
      });
    }
    recetteMap.get(row.recette.id)!.matchedMolecules++;
  }
  
  return Array.from(recetteMap.values())
    .map(r => ({
      ...r.recette,
      matchScore: Math.round((r.matchedMolecules / r.totalMolecules) * 100),
      matchedMolecules: r.matchedMolecules,
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Récupère les TerpProfiles liés aux molécules de Tagetes lucida
 */
export async function getTerpProfilesForTagetesLucida() {
  const db = await getDb();
  if (!db) return [];
  
  // Molécules de Tagetes lucida: Estragole, Anéthole, Méthyl-eugénol, β-Ocimène
  const tagetesPlantId = 300001;
  
  // Récupérer les molécules liées à Tagetes lucida
  const plantMols = await db
    .select({ moleculeId: plantMolecules.moleculeId })
    .from(plantMolecules)
    .where(eq(plantMolecules.plantId, tagetesPlantId));
  
  if (plantMols.length === 0) return [];
  
  const moleculeIds = plantMols.map(m => m.moleculeId);
  
  // Trouver les TerpProfiles qui contiennent ces molécules
  const profiles = await db
    .select({
      profile: terpProfiles,
      moleculeId: terpProfileMolecules.moleculeId,
    })
    .from(terpProfiles)
    .innerJoin(terpProfileMolecules, eq(terpProfiles.id, terpProfileMolecules.terpProfileId))
    .where(inArray(terpProfileMolecules.moleculeId, moleculeIds));
  
  // Grouper par profile
  const profileMap = new Map<number, TerpProfile>();
  for (const row of profiles) {
    if (!profileMap.has(row.profile.id)) {
      profileMap.set(row.profile.id, row.profile);
    }
  }
  
  return Array.from(profileMap.values()).sort((a, b) => a.profileId.localeCompare(b.profileId));
}

/**
 * Récupère les recettes TL (Tagetes lucida) avec leurs TerpProfiles associés
 */
export async function getRecettesTLWithTerpProfiles() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer les recettes TL
  const tlRecettes = await db
    .select()
    .from(recettes)
    .where(like(recettes.name, '%TL-%'))
    .orderBy(recettes.name);
  
  // Pour chaque recette, récupérer les TerpProfiles associés
  const results = await Promise.all(
    tlRecettes.map(async (recette) => {
      const profiles = await getTerpProfilesForRecette(recette.id);
      return {
        ...recette,
        terpProfiles: profiles,
      };
    })
  );
  
  return results;
}



// ====================================================================
// AUDIT ET IMPORT EN MASSE DES LIAISONS MOLÉCULE-RECETTE
// ====================================================================
// ============================================================================
// AUDIT ET IMPORT EN MASSE DES LIAISONS MOLÉCULE-RECETTE
// ============================================================================

/**
 * Récupère les statistiques d'audit des liaisons molécule-recette
 */
export async function getMoleculeRecetteAuditStats() {
  const db = await getDb();
  if (!db) return null;

  // Compter les molécules et recettes
  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const allRelations = await db.select().from(moleculesRecettes);

  // Identifier les molécules sans recette
  const moleculeIdsWithRecette = new Set(allRelations.map(r => r.moleculeId));
  const moleculesWithoutRecette = allMolecules.filter(m => !moleculeIdsWithRecette.has(m.id));

  // Identifier les recettes sans molécule
  const recetteIdsWithMolecule = new Set(allRelations.map(r => r.recetteId));
  const recettesWithoutMolecule = allRecettes.filter(r => !recetteIdsWithMolecule.has(r.id));

  // Compter les liaisons par molécule
  const moleculeLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    moleculeLinkCounts[r.moleculeId] = (moleculeLinkCounts[r.moleculeId] || 0) + 1;
  });

  // Compter les liaisons par recette
  const recetteLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    recetteLinkCounts[r.recetteId] = (recetteLinkCounts[r.recetteId] || 0) + 1;
  });

  // Molécules avec le plus de recettes
  const topMoleculesByRecettes = allMolecules
    .map(m => ({ ...m, recetteCount: moleculeLinkCounts[m.id] || 0 }))
    .filter(m => m.recetteCount > 0)
    .sort((a, b) => b.recetteCount - a.recetteCount)
    .slice(0, 10);

  // Recettes avec le plus de molécules
  const topRecettesByMolecules = allRecettes
    .map(r => ({ ...r, moleculeCount: recetteLinkCounts[r.id] || 0 }))
    .filter(r => r.moleculeCount > 0)
    .sort((a, b) => b.moleculeCount - a.moleculeCount)
    .slice(0, 10);

  // Molécules prioritaires (terpènes et composés aromatiques sans recette)
  const priorityFamilies = ['terpène', 'alcool', 'aldéhyde', 'ester', 'cétone'];
  const priorityMoleculesWithoutRecette = moleculesWithoutRecette
    .filter(m => m.family && priorityFamilies.some(f => m.family?.toLowerCase().includes(f)))
    .slice(0, 20);

  // Recettes prioritaires (résines et parfums sans molécules)
  const priorityRecettesWithoutMolecule = recettesWithoutMolecule
    .filter(r => r.category === 'resine' || r.category === 'parfum')
    .slice(0, 20);

  return {
    totalMolecules: allMolecules.length,
    totalRecettes: allRecettes.length,
    totalRelations: allRelations.length,
    moleculesWithRecette: moleculeIdsWithRecette.size,
    recettesWithMolecule: recetteIdsWithMolecule.size,
    moleculesWithoutRecette: moleculesWithoutRecette.length,
    recettesWithoutMolecule: recettesWithoutMolecule.length,
    coverageMolecules: allMolecules.length > 0 ? Math.round((moleculeIdsWithRecette.size / allMolecules.length) * 100) : 0,
    coverageRecettes: allRecettes.length > 0 ? Math.round((recetteIdsWithMolecule.size / allRecettes.length) * 100) : 0,
    topMoleculesByRecettes,
    topRecettesByMolecules,
    priorityMoleculesWithoutRecette,
    priorityRecettesWithoutMolecule,
    moleculesWithoutRecetteList: moleculesWithoutRecette.slice(0, 50),
    recettesWithoutMoleculeList: recettesWithoutMolecule.slice(0, 50),
  };
}

/**
 * Récupère toutes les liaisons molécule-recette avec les noms
 */
export async function getAllMoleculeRecetteRelationsWithNames() {
  const db = await getDb();
  if (!db) return [];

  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const allRelations = await db.select().from(moleculesRecettes);

  const moleculeMap = new Map(allMolecules.map(m => [m.id, m]));
  const recetteMap = new Map(allRecettes.map(r => [r.id, r]));

  return allRelations.map(r => ({
    ...r,
    moleculeName: moleculeMap.get(r.moleculeId)?.name || `Molécule #${r.moleculeId}`,
    moleculeFamily: moleculeMap.get(r.moleculeId)?.family,
    recetteName: recetteMap.get(r.recetteId)?.name || `Recette #${r.recetteId}`,
    recetteCategory: recetteMap.get(r.recetteId)?.category,
  }));
}

/**
 * Import en masse de liaisons molécule-recette
 */
export async function bulkImportMoleculeRecettes(relations: Array<{
  moleculeId?: number;
  moleculeName?: string;
  recetteId?: number;
  recetteName?: string;
  proportion?: number;
  role?: string;
  notes?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, imported: 0, errors: [] as string[] };

  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const existingRelations = await db.select().from(moleculesRecettes);

  const moleculeNameMap = new Map(allMolecules.map(m => [m.name.toLowerCase(), m.id]));
  const recetteNameMap = new Map(allRecettes.map(r => [r.name.toLowerCase(), r.id]));

  const existingSet = new Set(existingRelations.map(r => `${r.moleculeId}-${r.recetteId}`));

  const errors: string[] = [];
  let imported = 0;
  const toInsert: Array<{
    moleculeId: number;
    recetteId: number;
    proportion: string;
    role?: "tête" | "cœur" | "fond" | null;
    notes?: string | null;
  }> = [];

  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i];
    const rowNum = i + 1;

    // Résoudre l'ID de la molécule
    let moleculeId = rel.moleculeId;
    if (!moleculeId && rel.moleculeName) {
      moleculeId = moleculeNameMap.get(rel.moleculeName.toLowerCase());
    }

    // Résoudre l'ID de la recette
    let recetteId = rel.recetteId;
    if (!recetteId && rel.recetteName) {
      recetteId = recetteNameMap.get(rel.recetteName.toLowerCase());
    }

    // Validation
    if (!moleculeId) {
      errors.push(`Ligne ${rowNum}: Molécule non trouvée "${rel.moleculeName || rel.moleculeId}"`);
      continue;
    }
    if (!recetteId) {
      errors.push(`Ligne ${rowNum}: Recette non trouvée "${rel.recetteName || rel.recetteId}"`);
      continue;
    }

    // Vérifier si la relation existe déjà
    const key = `${moleculeId}-${recetteId}`;
    if (existingSet.has(key)) {
      errors.push(`Ligne ${rowNum}: Liaison déjà existante (molécule ${moleculeId} - recette ${recetteId})`);
      continue;
    }

    toInsert.push({
      moleculeId,
      recetteId,
      proportion: (rel.proportion || 10).toString(),
      role: (rel.role as "tête" | "cœur" | "fond") || 'cœur',
      notes: rel.notes || undefined,
    });
    existingSet.add(key);
  }

  // Insérer en masse
  if (toInsert.length > 0) {
    try {
      await db.insert(moleculesRecettes).values(toInsert);
      imported = toInsert.length;
    } catch (error: any) {
      errors.push(`Erreur d'insertion: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0 || imported > 0,
    imported,
    skipped: relations.length - imported - errors.filter(e => e.includes('déjà existante')).length,
    duplicates: errors.filter(e => e.includes('déjà existante')).length,
    errors: errors.filter(e => !e.includes('déjà existante')),
  };
}

/**
 * Créer plusieurs liaisons molécule-recette en une seule opération
 */
export async function createMultipleMoleculeRecettes(relations: Array<{
  moleculeId: number;
  recetteId: number;
  proportion?: number;
  role?: string;
  notes?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] as string[] };

  const existingRelations = await db.select().from(moleculesRecettes);
  const existingSet = new Set(existingRelations.map(r => `${r.moleculeId}-${r.recetteId}`));

  const errors: string[] = [];
  const toInsert: Array<{
    moleculeId: number;
    recetteId: number;
    proportion: string;
    role?: "tête" | "cœur" | "fond" | null;
    notes?: string | null;
  }> = [];

  for (const rel of relations) {
    const key = `${rel.moleculeId}-${rel.recetteId}`;
    if (existingSet.has(key)) {
      errors.push(`Liaison déjà existante: molécule ${rel.moleculeId} - recette ${rel.recetteId}`);
      continue;
    }

    toInsert.push({
      moleculeId: rel.moleculeId,
      recetteId: rel.recetteId,
      proportion: (rel.proportion || 10).toString(),
      role: (rel.role as "tête" | "cœur" | "fond") || 'cœur',
      notes: rel.notes || undefined,
    });
    existingSet.add(key);
  }

  if (toInsert.length > 0) {
    try {
      await db.insert(moleculesRecettes).values(toInsert);
    } catch (error: any) {
      errors.push(`Erreur d'insertion: ${error.message}`);
      return { success: false, created: 0, errors };
    }
  }

  return {
    success: true,
    created: toInsert.length,
    skipped: relations.length - toInsert.length,
    errors,
  };
}

/**
 * Suggestions de liaisons basées sur les familles olfactives
 */
export async function suggestMoleculeRecetteLinks() {
  const db = await getDb();
  if (!db) return [];

  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const existingRelations = await db.select().from(moleculesRecettes);

  const existingSet = new Set(existingRelations.map(r => `${r.moleculeId}-${r.recetteId}`));

  // Mapping des familles de molécules vers les catégories de recettes
  const familyToCategoryMap: Record<string, string[]> = {
    'terpène': ['resine_cbd', 'huile_essentielle'],
    'alcool terpénique': ['resine_cbd', 'huile_essentielle', 'parfum'],
    'aldéhyde': ['parfum', 'formule_reference'],
    'ester': ['parfum', 'formule_reference'],
    'cétone': ['parfum', 'formule_reference'],
    'phénol': ['huile_essentielle', 'resine_cbd'],
  };

  const suggestions: Array<{
    moleculeId: number;
    moleculeName: string;
    recetteId: number;
    recetteName: string;
    reason: string;
    confidence: 'high' | 'medium' | 'low';
  }> = [];

  for (const molecule of allMolecules) {
    if (!molecule.family) continue;

    const familyLower = molecule.family.toLowerCase();
    const matchingCategories = Object.entries(familyToCategoryMap)
      .filter(([family]) => familyLower.includes(family))
      .flatMap(([, categories]) => categories);

    if (matchingCategories.length === 0) continue;

    for (const recette of allRecettes) {
      const key = `${molecule.id}-${recette.id}`;
      if (existingSet.has(key)) continue;

      if (recette.category && matchingCategories.includes(recette.category)) {
        suggestions.push({
          moleculeId: molecule.id,
          moleculeName: molecule.name,
          recetteId: recette.id,
          recetteName: recette.name,
          reason: `Famille ${molecule.family} compatible avec catégorie ${recette.category}`,
          confidence: 'medium',
        });
      }
    }
  }

  return suggestions.slice(0, 100);
}


/**
 * Auto-liaison intelligente molécule-recette basée sur plusieurs critères
 * Cette fonction analyse les molécules et recettes pour créer des liaisons pertinentes
 */
export async function autoLinkMoleculeRecettes(options: {
  maxLinks?: number;
  dryRun?: boolean;
} = {}) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, suggestions: [], errors: [] as string[] };

  const { maxLinks = 100, dryRun = false } = options;

  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const existingRelations = await db.select().from(moleculesRecettes);

  const existingSet = new Set(existingRelations.map(r => `${r.moleculeId}-${r.recetteId}`));

  // Mapping étendu des familles chimiques vers les catégories de recettes
  const familyToCategoryMap: Record<string, { categories: string[]; role: "tête" | "cœur" | "fond"; confidence: number }> = {
    'terpène': { categories: ['resine_cbd', 'huile_essentielle', 'accord'], role: 'tête', confidence: 0.8 },
    'monoterpène': { categories: ['resine_cbd', 'huile_essentielle', 'accord'], role: 'tête', confidence: 0.85 },
    'sesquiterpène': { categories: ['resine_cbd', 'huile_essentielle', 'accord'], role: 'cœur', confidence: 0.85 },
    'diterpène': { categories: ['resine_cbd', 'huile_essentielle'], role: 'fond', confidence: 0.8 },
    'alcool terpénique': { categories: ['resine_cbd', 'huile_essentielle', 'parfum', 'accord'], role: 'cœur', confidence: 0.75 },
    'aldéhyde': { categories: ['parfum', 'formule_reference', 'accord'], role: 'tête', confidence: 0.7 },
    'ester': { categories: ['parfum', 'formule_reference', 'accord'], role: 'cœur', confidence: 0.75 },
    'cétone': { categories: ['parfum', 'formule_reference', 'accord'], role: 'cœur', confidence: 0.7 },
    'phénol': { categories: ['huile_essentielle', 'resine_cbd', 'accord'], role: 'fond', confidence: 0.7 },
    'lactone': { categories: ['parfum', 'formule_reference'], role: 'fond', confidence: 0.65 },
    'coumarine': { categories: ['parfum', 'formule_reference'], role: 'fond', confidence: 0.65 },
    'musc': { categories: ['parfum', 'formule_reference'], role: 'fond', confidence: 0.7 },
    'cannabinoïde': { categories: ['resine_cbd'], role: 'fond', confidence: 0.9 },
  };

  // Mapping des mots-clés olfactifs vers les gammes de recettes
  const olfactiveKeywords: Record<string, { gammes: string[]; confidence: number }> = {
    'boisé': { gammes: ['volcanique', 'terroir', 'signature'], confidence: 0.7 },
    'floral': { gammes: ['petrichor', 'signature', 'classique'], confidence: 0.7 },
    'agrume': { gammes: ['colombie', 'signature', 'classique'], confidence: 0.7 },
    'citrus': { gammes: ['colombie', 'signature', 'classique'], confidence: 0.7 },
    'épicé': { gammes: ['volcanique', 'mossi', 'signature'], confidence: 0.7 },
    'herbacé': { gammes: ['petrichor', 'colombie', 'terroir'], confidence: 0.7 },
    'terreux': { gammes: ['volcanique', 'petrichor', 'terroir'], confidence: 0.75 },
    'fumé': { gammes: ['volcanique', 'tabac', 'signature'], confidence: 0.75 },
    'résineux': { gammes: ['volcanique', 'resine_cbd', 'signature'], confidence: 0.8 },
    'balsamique': { gammes: ['volcanique', 'signature'], confidence: 0.7 },
    'fruité': { gammes: ['colombie', 'signature', 'classique'], confidence: 0.65 },
    'vert': { gammes: ['petrichor', 'colombie', 'terroir'], confidence: 0.7 },
    'minéral': { gammes: ['petrichor', 'volcanique'], confidence: 0.75 },
    'animal': { gammes: ['signature', 'pheromone'], confidence: 0.7 },
    'musqué': { gammes: ['signature', 'pheromone'], confidence: 0.7 },
  };

  const suggestions: Array<{
    moleculeId: number;
    moleculeName: string;
    recetteId: number;
    recetteName: string;
    role: "tête" | "cœur" | "fond";
    proportion: number;
    reason: string;
    confidence: number;
  }> = [];

  for (const molecule of allMolecules) {
    const moleculeNameLower = molecule.name.toLowerCase();
    const moleculeFamilyLower = (molecule.family || '').toLowerCase();
    const moleculeProfileLower = (molecule.olfactiveProfile || '').toLowerCase();

    for (const recette of allRecettes) {
      const key = `${molecule.id}-${recette.id}`;
      if (existingSet.has(key)) continue;

      const recetteNameLower = recette.name.toLowerCase();
      const recetteDescLower = (recette.description || '').toLowerCase();
      const recetteGammeLower = (recette.gamme || '').toLowerCase();
      const recetteCategoryLower = (recette.category || '').toLowerCase();

      let matchScore = 0;
      let matchReason = '';
      let suggestedRole: "tête" | "cœur" | "fond" = 'cœur';

      // 1. Correspondance par nom (molécule mentionnée dans la recette)
      if (recetteNameLower.includes(moleculeNameLower) || recetteDescLower.includes(moleculeNameLower)) {
        matchScore += 0.9;
        matchReason = `Molécule "${molecule.name}" mentionnée dans la recette`;
      }

      // 2. Correspondance par famille chimique et catégorie
      for (const [family, config] of Object.entries(familyToCategoryMap)) {
        if (moleculeFamilyLower.includes(family)) {
          if (config.categories.includes(recetteCategoryLower)) {
            matchScore += config.confidence * 0.5;
            suggestedRole = config.role;
            if (!matchReason) {
              matchReason = `Famille ${family} compatible avec catégorie ${recette.category}`;
            }
          }
        }
      }

      // 3. Correspondance par profil olfactif et gamme
      for (const [keyword, config] of Object.entries(olfactiveKeywords)) {
        if (moleculeProfileLower.includes(keyword)) {
          if (config.gammes.some(g => recetteGammeLower.includes(g))) {
            matchScore += config.confidence * 0.4;
            if (!matchReason) {
              matchReason = `Profil olfactif "${keyword}" compatible avec gamme ${recette.gamme}`;
            }
          }
        }
      }

      // 4. Correspondance par mots-clés communs
      const moleculeKeywords = moleculeProfileLower.split(/[\s,;]+/).filter(w => w.length > 3);
      const recetteKeywords = `${recetteNameLower} ${recetteDescLower}`.split(/[\s,;]+/).filter(w => w.length > 3);
      const commonKeywords = moleculeKeywords.filter(k => recetteKeywords.some(rk => rk.includes(k) || k.includes(rk)));
      if (commonKeywords.length > 0) {
        matchScore += Math.min(commonKeywords.length * 0.15, 0.45);
        if (!matchReason) {
          matchReason = `Mots-clés communs: ${commonKeywords.slice(0, 3).join(', ')}`;
        }
      }

      // Seuil de confiance minimum
      if (matchScore >= 0.5) {
        suggestions.push({
          moleculeId: molecule.id,
          moleculeName: molecule.name,
          recetteId: recette.id,
          recetteName: recette.name,
          role: suggestedRole,
          proportion: suggestedRole === 'tête' ? 15 : suggestedRole === 'cœur' ? 30 : 20,
          reason: matchReason,
          confidence: Math.min(matchScore, 1),
        });
      }
    }
  }

  // Trier par confiance décroissante et limiter
  const sortedSuggestions = suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxLinks);

  if (dryRun) {
    return {
      success: true,
      created: 0,
      wouldCreate: sortedSuggestions.length,
      suggestions: sortedSuggestions,
      errors: [],
    };
  }

  // Créer les liaisons
  const toInsert = sortedSuggestions.map(s => ({
    moleculeId: s.moleculeId,
    recetteId: s.recetteId,
    proportion: s.proportion.toString(),
    role: s.role,
    notes: `Auto-liaison: ${s.reason} (confiance: ${Math.round(s.confidence * 100)}%)`,
  }));

  if (toInsert.length > 0) {
    try {
      await db.insert(moleculesRecettes).values(toInsert);
    } catch (error: any) {
      return {
        success: false,
        created: 0,
        suggestions: sortedSuggestions,
        errors: [`Erreur d'insertion: ${error.message}`],
      };
    }
  }

  return {
    success: true,
    created: toInsert.length,
    suggestions: sortedSuggestions,
    errors: [],
  };
}

/**
 * Auto-liaison intelligente plante-molécule basée sur plusieurs critères
 */
export async function autoLinkPlantMolecules(options: {
  maxLinks?: number;
  dryRun?: boolean;
} = {}) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, suggestions: [], errors: [] as string[] };

  const { maxLinks = 100, dryRun = false } = options;

  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);
  const existingRelations = await db.select().from(plantMolecules);

  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.moleculeId}`));

  // Mapping des familles botaniques vers les types de molécules
  const botanicalFamilyToMolecules: Record<string, { keywords: string[]; role: "majeur" | "secondaire" | "trace"; confidence: number }> = {
    'lamiaceae': { keywords: ['linalol', 'thymol', 'carvacrol', 'menthol', 'eucalyptol'], role: 'majeur', confidence: 0.8 },
    'rutaceae': { keywords: ['limonène', 'citral', 'linalol', 'bergaptène'], role: 'majeur', confidence: 0.8 },
    'asteraceae': { keywords: ['chamazulène', 'bisabolol', 'artemisinine'], role: 'secondaire', confidence: 0.7 },
    'lauraceae': { keywords: ['cinnamaldéhyde', 'eugénol', 'safrol'], role: 'majeur', confidence: 0.75 },
    'myrtaceae': { keywords: ['eucalyptol', 'terpinéol', 'pinène'], role: 'majeur', confidence: 0.8 },
    'zingiberaceae': { keywords: ['zingibérène', 'curcumine', 'gingérol'], role: 'majeur', confidence: 0.75 },
    'apiaceae': { keywords: ['anéthol', 'fenchone', 'carvone'], role: 'majeur', confidence: 0.7 },
    'pinaceae': { keywords: ['pinène', 'limonène', 'bornéol'], role: 'majeur', confidence: 0.8 },
    'cannabaceae': { keywords: ['myrcène', 'limonène', 'caryophyllène', 'humulène', 'linalol', 'pinène', 'terpinolène'], role: 'majeur', confidence: 0.85 },
    'burseraceae': { keywords: ['limonène', 'phellandrène', 'sabinène'], role: 'majeur', confidence: 0.75 },
  };

  const suggestions: Array<{
    plantId: number;
    plantName: string;
    moleculeId: number;
    moleculeName: string;
    role: "majeur" | "secondaire" | "trace";
    percentageTypical: number;
    reason: string;
    confidence: number;
  }> = [];

  for (const plant of allPlants) {
    const plantNameLower = plant.name.toLowerCase();
    const plantFamilyLower = (plant.family || '').toLowerCase();
    const plantDescLower = (plant.olfactiveSignature || '').toLowerCase();

    for (const molecule of allMolecules) {
      const key = `${plant.id}-${molecule.id}`;
      if (existingSet.has(key)) continue;

      const moleculeNameLower = molecule.name.toLowerCase();
      const moleculeSourcesLower = (molecule.botanicalSources || '').toLowerCase();

      let matchScore = 0;
      let matchReason = '';
      let suggestedRole: "majeur" | "secondaire" | "trace" = 'secondaire';

      // 1. Correspondance directe par sources botaniques
      if (moleculeSourcesLower.includes(plantNameLower) || 
          moleculeSourcesLower.includes(plant.latinName?.toLowerCase() || '')) {
        matchScore += 0.95;
        matchReason = `Plante "${plant.name}" listée comme source de la molécule`;
        suggestedRole = 'majeur';
      }

      // 2. Correspondance par famille botanique
      for (const [family, config] of Object.entries(botanicalFamilyToMolecules)) {
        if (plantFamilyLower.includes(family)) {
          if (config.keywords.some(kw => moleculeNameLower.includes(kw.toLowerCase()))) {
            matchScore += config.confidence * 0.6;
            suggestedRole = config.role;
            if (!matchReason) {
              matchReason = `Famille botanique ${family} associée à ${molecule.name}`;
            }
          }
        }
      }

      // 3. Correspondance par mots-clés dans la description
      const plantKeywords = `${plantNameLower} ${plantDescLower}`.split(/[\s,;]+/).filter(w => w.length > 3);
      const moleculeKeywords = `${moleculeNameLower} ${moleculeSourcesLower}`.split(/[\s,;]+/).filter(w => w.length > 3);
      const commonKeywords = plantKeywords.filter(k => moleculeKeywords.some(mk => mk.includes(k) || k.includes(mk)));
      if (commonKeywords.length > 0) {
        matchScore += Math.min(commonKeywords.length * 0.1, 0.3);
        if (!matchReason) {
          matchReason = `Mots-clés communs: ${commonKeywords.slice(0, 3).join(', ')}`;
        }
      }

      // Seuil de confiance minimum
      if (matchScore >= 0.5) {
        suggestions.push({
          plantId: plant.id,
          plantName: plant.name,
          moleculeId: molecule.id,
          moleculeName: molecule.name,
          role: suggestedRole,
          percentageTypical: suggestedRole === 'majeur' ? 15 : suggestedRole === 'secondaire' ? 5 : 1,
          reason: matchReason,
          confidence: Math.min(matchScore, 1),
        });
      }
    }
  }

  // Trier par confiance décroissante et limiter
  const sortedSuggestions = suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxLinks);

  if (dryRun) {
    return {
      success: true,
      created: 0,
      wouldCreate: sortedSuggestions.length,
      suggestions: sortedSuggestions,
      errors: [],
    };
  }

  // Créer les liaisons
  const errors: string[] = [];
  let created = 0;

  for (const s of sortedSuggestions) {
    try {
      await db.insert(plantMolecules).values({
        plantId: s.plantId,
        moleculeId: s.moleculeId,
        percentageTypical: s.percentageTypical.toString(),
        role: s.role,
        notes: `Auto-liaison: ${s.reason} (confiance: ${Math.round(s.confidence * 100)}%)`,
      });
      created++;
    } catch (error: any) {
      if (!error.message.includes('Duplicate')) {
        errors.push(`Erreur pour ${s.plantName} - ${s.moleculeName}: ${error.message}`);
      }
    }
  }

  return {
    success: true,
    created,
    suggestions: sortedSuggestions,
    errors,
  };
}

/**
 * Récupérer les statistiques de couverture pour le dashboard
 */
export async function getLinkingCoverageStats() {
  const db = await getDb();
  if (!db) return null;

  // Molécules-Recettes
  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const moleculeRecetteLinks = await db.select().from(moleculesRecettes);
  
  const moleculesWithRecette = new Set(moleculeRecetteLinks.map(r => r.moleculeId));
  const recettesWithMolecule = new Set(moleculeRecetteLinks.map(r => r.recetteId));

  // Plantes-Molécules
  const allPlants = await db.select().from(plants);
  const plantMoleculeLinks = await db.select().from(plantMolecules);
  
  const plantsWithMolecule = new Set(plantMoleculeLinks.map(r => r.plantId));
  const moleculesWithPlant = new Set(plantMoleculeLinks.map(r => r.moleculeId));

  // Plantes-Terroirs
  const allTerroirs = await db.select().from(terroirs);
  const plantTerroirLinks = await db.select().from(plantTerroirs);
  
  const plantsWithTerroir = new Set(plantTerroirLinks.map(r => r.plantId));

  return {
    moleculeRecette: {
      totalMolecules: allMolecules.length,
      moleculesWithRecette: moleculesWithRecette.size,
      coverageMolecules: Math.round((moleculesWithRecette.size / allMolecules.length) * 100),
      totalRecettes: allRecettes.length,
      recettesWithMolecule: recettesWithMolecule.size,
      coverageRecettes: Math.round((recettesWithMolecule.size / allRecettes.length) * 100),
      totalLinks: moleculeRecetteLinks.length,
      targetCoverage: 50,
      gap: Math.max(0, 50 - Math.round((moleculesWithRecette.size / allMolecules.length) * 100)),
    },
    plantMolecule: {
      totalPlants: allPlants.length,
      plantsWithMolecule: plantsWithMolecule.size,
      coveragePlants: Math.round((plantsWithMolecule.size / allPlants.length) * 100),
      totalMolecules: allMolecules.length,
      moleculesWithPlant: moleculesWithPlant.size,
      coverageMolecules: Math.round((moleculesWithPlant.size / allMolecules.length) * 100),
      totalLinks: plantMoleculeLinks.length,
      targetCoverage: 10,
      gap: Math.max(0, 10 - Math.round((moleculesWithPlant.size / allMolecules.length) * 100)),
    },
    plantTerroir: {
      totalPlants: allPlants.length,
      plantsWithTerroir: plantsWithTerroir.size,
      coveragePlants: Math.round((plantsWithTerroir.size / allPlants.length) * 100),
      totalTerroirs: allTerroirs.length,
      totalLinks: plantTerroirLinks.length,
      targetCoverage: 20,
      gap: Math.max(0, 20 - Math.round((plantsWithTerroir.size / allPlants.length) * 100)),
    },
  };
}

/**
 * Récupérer les statistiques d'audit des liaisons plante-molécule
 */
export async function getPlantMoleculeAuditStats() {
  const db = await getDb();
  if (!db) return null;

  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);
  const allRelations = await db.select().from(plantMolecules);

  // Identifier les plantes sans molécule
  const plantIdsWithMolecule = new Set(allRelations.map(r => r.plantId));
  const plantsWithoutMolecule = allPlants.filter(p => !plantIdsWithMolecule.has(p.id));

  // Identifier les molécules sans plante
  const moleculeIdsWithPlant = new Set(allRelations.map(r => r.moleculeId));
  const moleculesWithoutPlant = allMolecules.filter(m => !moleculeIdsWithPlant.has(m.id));

  // Compter les liaisons par plante
  const plantLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    plantLinkCounts[r.plantId] = (plantLinkCounts[r.plantId] || 0) + 1;
  });

  // Plantes avec le plus de molécules
  const topPlantsByMolecules = allPlants
    .filter(p => plantLinkCounts[p.id])
    .map(p => ({ ...p, moleculeCount: plantLinkCounts[p.id] }))
    .sort((a, b) => b.moleculeCount - a.moleculeCount)
    .slice(0, 10);

  return {
    totalPlants: allPlants.length,
    totalMolecules: allMolecules.length,
    totalRelations: allRelations.length,
    plantsWithMolecule: plantIdsWithMolecule.size,
    plantsWithoutMolecule: plantsWithoutMolecule.length,
    moleculesWithPlant: moleculeIdsWithPlant.size,
    moleculesWithoutPlant: moleculesWithoutPlant.length,
    coveragePlants: Math.round((plantIdsWithMolecule.size / allPlants.length) * 100),
    coverageMolecules: Math.round((moleculeIdsWithPlant.size / allMolecules.length) * 100),
    plantsWithoutMoleculeList: plantsWithoutMolecule.slice(0, 50),
    moleculesWithoutPlantList: moleculesWithoutPlant.slice(0, 50),
    topPlantsByMolecules,
  };
}



// ====================================================================
// RECETTE RAW MATERIALS — Fonctions CRUD
// ====================================================================
// ============================================================================
// RECETTE RAW MATERIALS — Fonctions CRUD
// ============================================================================

/** Récupère toutes les liaisons matières premières pour une recette */
export async function getRecetteRawMaterials(recetteId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: recetteRawMaterials.id,
      recetteId: recetteRawMaterials.recetteId,
      rawMaterialId: recetteRawMaterials.rawMaterialId,
      role: recetteRawMaterials.role,
      dosage: recetteRawMaterials.dosage,
      dosageUnit: recetteRawMaterials.dosageUnit,
      percentage: recetteRawMaterials.percentage,
      notes: recetteRawMaterials.notes,
      sortOrder: recetteRawMaterials.sortOrder,
      // Infos de la matière première
      materialName: rawMaterials.name,
      materialLatinName: rawMaterials.latinName,
      materialCategory: rawMaterials.category,
      materialOlfactiveFamily: rawMaterials.olfactiveFamily,
      materialOlfactiveProfile: rawMaterials.olfactiveProfile,
    })
    .from(recetteRawMaterials)
    .innerJoin(rawMaterials, eq(recetteRawMaterials.rawMaterialId, rawMaterials.id))
    .where(eq(recetteRawMaterials.recetteId, recetteId))
    .orderBy(asc(recetteRawMaterials.sortOrder), asc(rawMaterials.name));
}

/** Récupère toutes les recettes qui utilisent une matière première */
export async function getRecettesForRawMaterial(rawMaterialId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: recetteRawMaterials.id,
      rawMaterialId: recetteRawMaterials.rawMaterialId,
      recetteId: recetteRawMaterials.recetteId,
      role: recetteRawMaterials.role,
      dosage: recetteRawMaterials.dosage,
      dosageUnit: recetteRawMaterials.dosageUnit,
      percentage: recetteRawMaterials.percentage,
      notes: recetteRawMaterials.notes,
      // Infos de la recette
      recetteName: recettes.name,
      recetteCategory: recettes.category,
      recetteDescription: recettes.description,
    })
    .from(recetteRawMaterials)
    .innerJoin(recettes, eq(recetteRawMaterials.recetteId, recettes.id))
    .where(eq(recetteRawMaterials.rawMaterialId, rawMaterialId))
    .orderBy(asc(recettes.name));
}

/** Ajoute une liaison recette <-> matière première */
export async function addRecetteRawMaterial(data: InsertRecetteRawMaterial) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(recetteRawMaterials).values(data);
  return result;
}

/** Met à jour une liaison recette <-> matière première */
export async function updateRecetteRawMaterial(id: number, data: Partial<InsertRecetteRawMaterial>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(recetteRawMaterials).set(data).where(eq(recetteRawMaterials.id, id));
  return { success: true };
}

/** Supprime une liaison recette <-> matière première */
export async function removeRecetteRawMaterial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(recetteRawMaterials).where(eq(recetteRawMaterials.id, id));
  return { success: true };
}

// ── Tableau de bord de complétude ─────────────────────────────────────────────

export async function getCompletudeRawMaterials(params: {
  limit?: number;
  offset?: number;
  sortBy?: 'score_asc' | 'score_desc' | 'name';
  minScore?: number;
  maxScore?: number;
  category?: string;
}) {
  const { limit = 50, offset = 0, sortBy = 'score_asc', minScore, maxScore, category } = params;
  const dbRaw = await getDb();
  if (!dbRaw) return { items: [], total: 0, avgScore: 0, distribution: {} };
  const db = dbRaw;

  const allMaterials = await db
    .select({
      id: rawMaterials.id,
      name: rawMaterials.name,
      category: rawMaterials.category,
      latinName: rawMaterials.latinName,
      olfactiveFamily: rawMaterials.olfactiveFamily,
      olfactiveProfile: rawMaterials.olfactiveProfile,
      quality: rawMaterials.quality,
      availability: rawMaterials.availability,
      priceRange: rawMaterials.priceRange,
      originCountry: rawMaterials.originCountry,
      originRegion: rawMaterials.originRegion,
      plantId: rawMaterials.plantId,
      terroirId: rawMaterials.terroirId,
      notes: rawMaterials.notes,
      topNotes: rawMaterials.topNotes,
      heartNotes: rawMaterials.heartNotes,
      baseNotes: rawMaterials.baseNotes,
      plantPart: rawMaterials.plantPart,
      extractionYield: rawMaterials.extractionYield,
    })
    .from(rawMaterials)
    .where(category ? eq(rawMaterials.category, category as any) : undefined);

  // Calculer le score de complétude pour chaque matière première
  const scored = allMaterials.map((m) => {
    const fields = [
      { key: 'latinName', weight: 1, value: m.latinName },
      { key: 'olfactiveFamily', weight: 2, value: m.olfactiveFamily },
      { key: 'olfactiveProfile', weight: 2, value: m.olfactiveProfile },
      { key: 'quality', weight: 1, value: m.quality },
      { key: 'availability', weight: 1, value: m.availability },
      { key: 'priceRange', weight: 1, value: m.priceRange },
      { key: 'originCountry', weight: 2, value: m.originCountry },
      { key: 'plantId', weight: 3, value: m.plantId },
      { key: 'terroirId', weight: 3, value: m.terroirId },
      { key: 'notes', weight: 1, value: m.notes },
      { key: 'topNotes', weight: 1, value: m.topNotes },
      { key: 'heartNotes', weight: 1, value: m.heartNotes },
      { key: 'baseNotes', weight: 1, value: m.baseNotes },
      { key: 'plantPart', weight: 1, value: m.plantPart },
    ];
    const totalWeight = fields.reduce((s, f) => s + f.weight, 0);
    const filledWeight = fields.reduce((s, f) => s + (f.value !== null && f.value !== undefined && f.value !== '' ? f.weight : 0), 0);
    const score = Math.round((filledWeight / totalWeight) * 100);

    const missing = fields
      .filter(f => f.value === null || f.value === undefined || f.value === '')
      .map(f => f.key);

    return { ...m, score, missing };
  });

  // Filtrer par score
  const filtered = scored.filter(m => {
    if (minScore !== undefined && m.score < minScore) return false;
    if (maxScore !== undefined && m.score > maxScore) return false;
    return true;
  });

  // Trier
  if (sortBy === 'score_asc') filtered.sort((a, b) => a.score - b.score);
  else if (sortBy === 'score_desc') filtered.sort((a, b) => b.score - a.score);
  else filtered.sort((a, b) => a.name.localeCompare(b.name));

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  // Stats globales
  const avgScore = Math.round(scored.reduce((s, m) => s + m.score, 0) / scored.length);
  const distribution = {
    rouge: scored.filter(m => m.score < 33).length,
    orange: scored.filter(m => m.score >= 33 && m.score < 66).length,
    vert: scored.filter(m => m.score >= 66).length,
  };

  return { items: paginated, total, avgScore, distribution };
}

export async function getCompletudePlants(params: {
  limit?: number;
  offset?: number;
  sortBy?: 'score_asc' | 'score_desc' | 'name';
  minScore?: number;
  maxScore?: number;
}) {
  const { limit = 50, offset = 0, sortBy = 'score_asc', minScore, maxScore } = params;
  const dbRaw = await getDb();
  if (!dbRaw) return { items: [], total: 0, avgScore: 0, distribution: {} };
  const db = dbRaw;
  const allPlants = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      family: plants.family,
      habitat: plants.habitat,
      conservationStatus: plants.conservationStatus,
      olfactiveSignature: plants.olfactiveSignature,
      origin: plants.origin,
      notes: plants.notes,
      imageUrl: plants.imageUrl,
    })
    .from(plants);

  const scored = allPlants.map((p) => {
    const fields = [
      { key: 'latinName', weight: 3, value: p.latinName },
      { key: 'family', weight: 2, value: p.family },
      { key: 'habitat', weight: 2, value: p.habitat },
      { key: 'conservationStatus', weight: 1, value: p.conservationStatus },
      { key: 'olfactiveSignature', weight: 2, value: p.olfactiveSignature },
      { key: 'origin', weight: 2, value: p.origin },
      { key: 'notes', weight: 1, value: p.notes },
      { key: 'imageUrl', weight: 2, value: p.imageUrl },
    ];
    const totalWeight = fields.reduce((s, f) => s + f.weight, 0);
    const filledWeight = fields.reduce((s, f) => s + (f.value !== null && f.value !== undefined && f.value !== '' ? f.weight : 0), 0);
    const score = Math.round((filledWeight / totalWeight) * 100);
    const missing = fields.filter(f => f.value === null || f.value === undefined || f.value === '').map(f => f.key);
    return { ...p, score, missing };
  });

  const filtered = scored.filter(m => {
    if (minScore !== undefined && m.score < minScore) return false;
    if (maxScore !== undefined && m.score > maxScore) return false;
    return true;
  });

  if (sortBy === 'score_asc') filtered.sort((a, b) => a.score - b.score);
  else if (sortBy === 'score_desc') filtered.sort((a, b) => b.score - a.score);
  else filtered.sort((a, b) => a.name.localeCompare(b.name));

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);
  const avgScore = Math.round(scored.reduce((s, m) => s + m.score, 0) / scored.length);
  const distribution = {
    rouge: scored.filter(m => m.score < 33).length,
    orange: scored.filter(m => m.score >= 33 && m.score < 66).length,
    vert: scored.filter(m => m.score >= 66).length,
  };

  return { items: paginated, total, avgScore, distribution };
}

export async function getCompletudeTerroirs(params: {
  limit?: number;
  offset?: number;
  sortBy?: 'score_asc' | 'score_desc' | 'name';
  minScore?: number;
  maxScore?: number;
}) {
  const { limit = 50, offset = 0, sortBy = 'score_asc', minScore, maxScore } = params;
  const dbRaw = await getDb();
  if (!dbRaw) return { items: [], total: 0, avgScore: 0, distribution: {} };
  const db = dbRaw;
  const allTerroirs = await db
    .select({
      id: terroirs.id,
      name: terroirs.name,
      country: terroirs.country,
      region: terroirs.region,
      climateType: terroirs.climateType,
      altitude: terroirs.altitude,
      soilType: terroirs.soilType,
      reputation: terroirs.reputation,
      notes: terroirs.notes,
      imageUrl: terroirs.imageUrl,
      latitude: terroirs.latitude,
      longitude: terroirs.longitude,
    })
    .from(terroirs);

  const scored = allTerroirs.map((t) => {
    const fields = [
      { key: 'country', weight: 2, value: t.country },
      { key: 'region', weight: 2, value: t.region },
      { key: 'climateType', weight: 2, value: t.climateType },
      { key: 'altitude', weight: 1, value: t.altitude },
      { key: 'soilType', weight: 2, value: t.soilType },
      { key: 'reputation', weight: 2, value: t.reputation },
      { key: 'notes', weight: 1, value: t.notes },
      { key: 'imageUrl', weight: 1, value: t.imageUrl },
      { key: 'latitude', weight: 2, value: t.latitude },
    ];
    const totalWeight = fields.reduce((s, f) => s + f.weight, 0);
    const filledWeight = fields.reduce((s, f) => s + (f.value !== null && f.value !== undefined && f.value !== '' ? f.weight : 0), 0);
    const score = Math.round((filledWeight / totalWeight) * 100);
    const missing = fields.filter(f => f.value === null || f.value === undefined || f.value === '').map(f => f.key);
    return { ...t, score, missing };
  });

  const filtered = scored.filter(m => {
    if (minScore !== undefined && m.score < minScore) return false;
    if (maxScore !== undefined && m.score > maxScore) return false;
    return true;
  });

  if (sortBy === 'score_asc') filtered.sort((a, b) => a.score - b.score);
  else if (sortBy === 'score_desc') filtered.sort((a, b) => b.score - a.score);
  else filtered.sort((a, b) => a.name.localeCompare(b.name));

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);
  const avgScore = Math.round(scored.reduce((s, m) => s + m.score, 0) / scored.length);
  const distribution = {
    rouge: scored.filter(m => m.score < 33).length,
    orange: scored.filter(m => m.score >= 33 && m.score < 66).length,
    vert: scored.filter(m => m.score >= 66).length,
  };

  return { items: paginated, total, avgScore, distribution };
}

export async function getCompletudeGlobalStats() {
  const dbRaw = await getDb();
  if (!dbRaw) return { rawMaterials: { total: 0, withPlant: 0, withTerroir: 0, withBoth: 0, withOlfFamily: 0, withOrigin: 0 }, plants: { total: 0, withLatin: 0, withDescription: 0, withImage: 0 }, terroirs: { total: 0, withDescription: 0, withCoords: 0 } };
  const db = dbRaw;

  const [totalRawMaterials] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials);
  const [totalPlants] = await db.select({ count: sql<number>`COUNT(*)` }).from(plants);
  const [totalTerroirs] = await db.select({ count: sql<number>`COUNT(*)` }).from(terroirs);

  // Matières premières avec plantId renseigné
  const [rmWithPlant] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials).where(sql`plant_id IS NOT NULL`);
  const [rmWithTerroir] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials).where(sql`terroir_id IS NOT NULL`);
  const [rmWithBoth] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials).where(sql`plant_id IS NOT NULL AND terroir_id IS NOT NULL`);
  const [rmWithOlfFamily] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials).where(sql`olfactive_family IS NOT NULL AND olfactive_family != ''`);
  const [rmWithOrigin] = await db.select({ count: sql<number>`COUNT(*)` }).from(rawMaterials).where(sql`origin_country IS NOT NULL AND origin_country != ''`);

  // Plantes avec latinName
  const [plantsWithLatin] = await db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`latin_name IS NOT NULL AND latin_name != ''`);
  const [plantsWithHabitat] = await db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`habitat IS NOT NULL AND habitat != ''`);
  const [plantsWithImage] = await db.select({ count: sql<number>`COUNT(*)` }).from(plants).where(sql`image_url IS NOT NULL AND image_url != ''`);

  // Terroirs avec reputation
  const [terroirsWithReputation] = await db.select({ count: sql<number>`COUNT(*)` }).from(terroirs).where(sql`reputation IS NOT NULL AND reputation != ''`);
  const [terroirsWithCoords] = await db.select({ count: sql<number>`COUNT(*)` }).from(terroirs).where(sql`latitude IS NOT NULL`);

  return {
    rawMaterials: {
      total: Number(totalRawMaterials.count),
      withPlant: Number(rmWithPlant.count),
      withTerroir: Number(rmWithTerroir.count),
      withBoth: Number(rmWithBoth.count),
      withOlfFamily: Number(rmWithOlfFamily.count),
      withOrigin: Number(rmWithOrigin.count),
    },
    plants: {
      total: Number(totalPlants.count),
      withLatin: Number(plantsWithLatin.count),
      withDescription: Number(plantsWithHabitat.count),
      withImage: Number(plantsWithImage.count),
    },
    terroirs: {
      total: Number(totalTerroirs.count),
      withDescription: Number(terroirsWithReputation.count),
      withCoords: Number(terroirsWithCoords.count),
    },
  };
}

