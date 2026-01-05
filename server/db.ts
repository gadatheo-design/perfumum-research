import { eq, and, or, isNull, isNotNull, not, desc, asc, sql, like, gte, inArray, count, type SQL } from "drizzle-orm";
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
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, {
        mode: "default",
        schema: {
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
          synergies,
          terpeneSynergies,
          userNotes,
          sharedCollections,
          savedFormulas,
          moleculeNotes,
          citations,
          analyticsEvents,
          suppliers,
          supplierMaterials,
          rechercheRadicale,
          modificationHistory,
          plantTerroirs,
          plantMolecules,
        },
      });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// PROTOTYPES
// ============================================================================

export async function getAllPrototypes(): Promise<Prototype[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(prototypes);
}

export async function getPrototypeByCode(code: string): Promise<Prototype | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prototypes).where(eq(prototypes.code, code)).limit(1);
  return result[0];
}

// ============================================================================
// FAMILIES
// ============================================================================

export async function getAllFamilies(): Promise<Family[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(families);
}

export async function getFamilyById(id: number): Promise<Family | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(families).where(eq(families.id, id)).limit(1);
  return result[0];
}

// ============================================================================
// LABORATOIRE (Matières Premières)
// ============================================================================

export async function getAllMatieres(): Promise<Laboratoire[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(laboratoire);
}

export async function getMatiereById(id: number): Promise<Laboratoire | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(laboratoire).where(eq(laboratoire.id, id)).limit(1);
  return result[0];
}

export async function createMatiere(data: {
  name: string;
  botanicalName?: string;
  type: "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre";
  olfactiveFamily?: string;
  note?: "tete" | "coeur" | "fond" | "tete_coeur" | "coeur_fond";
  origin?: string;
  extractionMethod?: "distillation" | "extraction_solvant" | "co2_supercritique" | "expression" | "teinture" | "autre";
  olfactiveProfile?: string;
  character?: string;
  supplier?: string;
  pricePerMl?: number;
  stock?: number;
  status?: "en_stock" | "a_commander" | "epuise";
  technicalNotes?: string;
  manipulationNotes?: string;
  maxTemperature?: number;
}): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(laboratoire).values({
    name: data.name,
    botanicalName: data.botanicalName || null,
    type: data.type,
    olfactiveFamily: data.olfactiveFamily || null,
    note: data.note || null,
    origin: data.origin || null,
    extractionMethod: data.extractionMethod || null,
    olfactiveProfile: data.olfactiveProfile || null,
    character: data.character || null,
    supplier: data.supplier || null,
    pricePerMl: data.pricePerMl || null,
    stock: data.stock || null,
    status: data.status || "a_commander",
    technicalNotes: data.technicalNotes || null,
    manipulationNotes: data.manipulationNotes || null,
    maxTemperature: data.maxTemperature || null,
  });
  
  return { id: Number(result[0].insertId) };
}

export async function updateMatiereStock(id: number, stock: number, status?: "en_stock" | "a_commander" | "epuise"): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const updateData: any = { stock };
  if (status) updateData.status = status;
  
  await db.update(laboratoire).set(updateData).where(eq(laboratoire.id, id));
}

// ============================================================================
// MOLECULES
// ============================================================================

export async function getAllMolecules(): Promise<Molecule[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(molecules);
}

export async function getMoleculeById(id: number): Promise<Molecule | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(molecules).where(eq(molecules.id, id)).limit(1);
  return result[0];
}

// ============================================================================
// ACCORDS
// ============================================================================

export async function getAllAccords(): Promise<Accord[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(accords);
}

export async function getAccordById(id: number): Promise<Accord | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accords).where(eq(accords.id, id)).limit(1);
  return result[0];
}

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

// ============================================================================
// CIVILISATIONS
// ============================================================================

export async function getAllCivilisations(): Promise<Civilisation[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(civilisations);
}

export async function getCivilisationById(id: number): Promise<Civilisation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(civilisations).where(eq(civilisations.id, id)).limit(1);
  return result[0];
}

// ============================================================================
// INSTALLATIONS
// ============================================================================

export async function getAllInstallations(): Promise<Installation[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(installations);
}

export async function getInstallationById(id: number): Promise<Installation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(installations).where(eq(installations.id, id)).limit(1);
  return result[0];
}

// ============================================================================
// PETRICHOR
// ============================================================================

export async function getAllPetrichor(): Promise<Petrichor[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(petrichor);
}

// ============================================================================
// VOLCANIQUE
// ============================================================================

export async function getAllVolcanique(): Promise<Volcanique[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(volcanique);
}

// ============================================================================
// TABACS
// ============================================================================

export async function getAllTabacs(): Promise<Tabac[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tabacs);
}

export async function getTabacById(id: number): Promise<Tabac | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tabacs).where(eq(tabacs.id, id)).limit(1);
  return result[0];
}

export async function getTabacsByProfile(olfactiveProfile: string): Promise<Tabac[]> {
  const db = await getDb();
  if (!db) return [];
  const allTabacs = await db.select().from(tabacs);
  
  // Filter tabacs that match the olfactive profile in their internalNotes
  return allTabacs.filter(tabac => 
    tabac.internalNotes?.toLowerCase().includes(olfactiveProfile.toLowerCase())
  );
}


// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  
  const { sql } = await import("drizzle-orm");
  
  const [prototypesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(prototypes);
  const [moleculesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(molecules);
  const [accordsCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(accords);
  const [familiesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(families);
  const [recettesCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(recettes);
  const [matieresCount] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(laboratoire);
  
  return {
    prototypes: Number(prototypesCount?.count || 0),
    molecules: Number(moleculesCount?.count || 0),
    accords: Number(accordsCount?.count || 0),
    families: Number(familiesCount?.count || 0),
    recettes: Number(recettesCount?.count || 0),
    matieres: Number(matieresCount?.count || 0),
  };
}


export async function createMolecule(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(molecules).values({
    name: data.name,
    chemicalFormula: data.chemicalFormula || null,
    family: data.chemicalFamily || null,
    functionalEffect: data.functionalEffect || null,
    olfactiveProfile: data.olfactiveProfile || null,
    emotionalResonance: data.emotionalResonance || null,
    sourceOrigin: data.source || null,
    concentration: data.concentration || null,
    notes: data.notes || null,
  });
  
  return result;
}


// ============================================================================
// GLOSSARY
// ============================================================================

export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(glossary).orderBy(glossary.term);
}

export async function searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Search in term, definition, and examples
  const searchPattern = `%${query}%`;
  return await db
    .select()
    .from(glossary)
    .where(
      eq(glossary.term, query) // Exact match first
    )
    .orderBy(glossary.term);
}

export async function getGlossaryTermsByCategory(category: string): Promise<GlossaryTerm[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(glossary)
    .where(eq(glossary.category, category as any))
    .orderBy(glossary.term);
}


// ============================================================================
// RESEARCH TIMELINE
// ============================================================================

export async function getAllMilestones(): Promise<ResearchMilestone[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(researchTimeline)
    .orderBy(researchTimeline.year, researchTimeline.quarterNumber);
}

export async function getMilestonesByPhase(phase: string): Promise<ResearchMilestone[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(researchTimeline)
    .where(eq(researchTimeline.phase, phase as any))
    .orderBy(researchTimeline.year, researchTimeline.quarterNumber);
}

export async function getMilestonesByYear(year: number): Promise<ResearchMilestone[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(researchTimeline)
    .where(eq(researchTimeline.year, year))
    .orderBy(researchTimeline.quarterNumber);
}

export async function getTimelineStats() {
  const db = await getDb();
  if (!db) return { total: 0, byPhase: {}, byCategory: {}, byStatus: {} };
  
  const milestones = await db.select().from(researchTimeline);
  
  const byPhase = milestones.reduce((acc, m) => {
    acc[m.phase] = (acc[m.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byCategory = milestones.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byStatus = milestones.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: milestones.length,
    byPhase,
    byCategory,
    byStatus,
  };
}


// ============================================================================
// CHEMICAL FAMILIES
// ============================================================================

export async function getChemicalFamilies() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      family: molecules.family,
      count: sql<number>`count(*)`.as('count'),
    })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family)
    .orderBy(molecules.family);
  
  return result;
}

export async function getMoleculesByFamily(family: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(molecules)
    .where(eq(molecules.family, family))
    .orderBy(molecules.name);
}


// ============================================================================
// EXPERIMENTAL ACCORDS
// ============================================================================

export async function getExperimentalAccordsByType(isExtreme: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(experimentalAccords)
    .where(eq(experimentalAccords.isExtreme, isExtreme))
    .orderBy(experimentalAccords.number);
}

export async function getAllExperimentalAccords() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(experimentalAccords)
    .orderBy(experimentalAccords.isExtreme, experimentalAccords.number);
}


// ABSORBE profiles
export async function getAbsorbeProfiles() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(absorbeProfiles);
}

export async function getAbsorbeProfileByPrototypeId(prototypeId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(absorbeProfiles)
    .where(eq(absorbeProfiles.prototypeId, prototypeId));
  return results[0] || null;
}


// ============================================================================
// GLOBAL SEARCH
// ============================================================================

export interface GlobalSearchResult {
  type: 'molecule' | 'recette' | 'plant' | 'accord' | 'terpProfile' | 'finalRecipe' | 'civilisation' | 'prototype' | 'glossary' | 'timeline';
  id: number;
  name: string;
  description?: string | null;
  metadata?: Record<string, any>;
}

export async function globalSearch(query: string, limit: number = 50): Promise<{
  molecules: GlobalSearchResult[];
  recettes: GlobalSearchResult[];
  plants: GlobalSearchResult[];
  accords: GlobalSearchResult[];
  terpProfiles: GlobalSearchResult[];
  finalRecipes: GlobalSearchResult[];
  civilisations: GlobalSearchResult[];
  prototypes: GlobalSearchResult[];
  glossary: GlobalSearchResult[];
  total: number;
}> {
  const db = await getDb();
  if (!db || !query.trim()) {
    return {
      molecules: [],
      recettes: [],
      plants: [],
      accords: [],
      terpProfiles: [],
      finalRecipes: [],
      civilisations: [],
      prototypes: [],
      glossary: [],
      total: 0
    };
  }

  const searchTerm = `%${query}%`;
  const perCategoryLimit = Math.ceil(limit / 9);

  // Search in prototypes
  const prototypeResults = await db
    .select()
    .from(prototypes)
    .where(
      sql`${prototypes.name} LIKE ${searchTerm} OR ${prototypes.code} LIKE ${searchTerm} OR ${prototypes.conceptualAxis} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in molecules
  const moleculeResults = await db
    .select()
    .from(molecules)
    .where(
      sql`${molecules.name} LIKE ${searchTerm} OR ${molecules.family} LIKE ${searchTerm} OR ${molecules.olfactiveProfile} LIKE ${searchTerm} OR ${molecules.casNumber} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in recipes
  const recipeResults = await db
    .select()
    .from(recettes)
    .where(
      sql`${recettes.name} LIKE ${searchTerm} OR ${recettes.category} LIKE ${searchTerm} OR ${recettes.formula} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in plants
  const plantResults = await db
    .select()
    .from(plants)
    .where(
      sql`${plants.name} LIKE ${searchTerm} OR ${plants.latinName} LIKE ${searchTerm} OR ${plants.family} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in accords
  const accordResults = await db
    .select()
    .from(accords)
    .where(
      sql`${accords.name} LIKE ${searchTerm} OR ${accords.olfactiveProfile} LIKE ${searchTerm} OR ${accords.notes} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in terp profiles
  const terpProfileResults = await db
    .select()
    .from(terpProfiles)
    .where(
      sql`${terpProfiles.name} LIKE ${searchTerm} OR ${terpProfiles.profileId} LIKE ${searchTerm} OR ${terpProfiles.function} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in final recipes
  const finalRecipeResults = await db
    .select()
    .from(finalRecipes)
    .where(
      sql`${finalRecipes.name} LIKE ${searchTerm} OR ${finalRecipes.recipeId} LIKE ${searchTerm} OR ${finalRecipes.function} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in civilisations
  const civilisationResults = await db
    .select()
    .from(civilisations)
    .where(
      sql`${civilisations.name} LIKE ${searchTerm} OR ${civilisations.region} LIKE ${searchTerm} OR ${civilisations.longDescription} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Search in glossary
  const glossaryResults = await db
    .select()
    .from(glossary)
    .where(
      sql`${glossary.term} LIKE ${searchTerm} OR ${glossary.definition} LIKE ${searchTerm}`
    )
    .limit(perCategoryLimit);

  // Transform results
  const transformedPrototypes: GlobalSearchResult[] = prototypeResults.map(p => ({
    type: 'prototype' as const,
    id: p.id,
    name: p.name,
    description: p.conceptualAxis,
    metadata: { code: p.code, emoji: p.emoji }
  }));

  const transformedMolecules: GlobalSearchResult[] = moleculeResults.map(m => ({
    type: 'molecule' as const,
    id: m.id,
    name: m.name,
    description: m.olfactiveProfile,
    metadata: { family: m.family, chemicalFormula: m.chemicalFormula, casNumber: m.casNumber }
  }));

  const transformedRecettes: GlobalSearchResult[] = recipeResults.map(r => ({
    type: 'recette' as const,
    id: r.id,
    name: r.name,
    description: r.description,
    metadata: { category: r.category, status: r.status }
  }));

  const transformedPlants: GlobalSearchResult[] = plantResults.map(p => ({
    type: 'plant' as const,
    id: p.id,
    name: p.name,
    description: p.olfactiveSignature,
    metadata: { latinName: p.latinName, family: p.family, origin: p.origin }
  }));

  const transformedAccords: GlobalSearchResult[] = accordResults.map(a => ({
    type: 'accord' as const,
    id: a.id,
    name: a.name,
    description: a.olfactiveProfile,
    metadata: { texture: a.texture, emotionalResonance: a.emotionalResonance }
  }));

  const transformedTerpProfiles: GlobalSearchResult[] = terpProfileResults.map(t => ({
    type: 'terpProfile' as const,
    id: t.id,
    name: t.name,
    description: t.function,
    metadata: { profileId: t.profileId, climaticAxis: t.climaticAxis, usage: t.usage }
  }));

  const transformedFinalRecipes: GlobalSearchResult[] = finalRecipeResults.map(f => ({
    type: 'finalRecipe' as const,
    id: f.id,
    name: f.name,
    description: f.function,
    metadata: { recipeId: f.recipeId, recipeType: f.recipeType, climaticAxis: f.climaticAxis }
  }));

  const transformedCivilisations: GlobalSearchResult[] = civilisationResults.map(c => ({
    type: 'civilisation' as const,
    id: c.id,
    name: c.name,
    description: c.longDescription,
    metadata: { region: c.region, temporality: c.temporality }
  }));

  const transformedGlossary: GlobalSearchResult[] = glossaryResults.map(g => ({
    type: 'glossary' as const,
    id: g.id,
    name: g.term,
    description: g.definition,
    metadata: { category: g.category }
  }));

  const total = 
    transformedPrototypes.length +
    transformedMolecules.length +
    transformedRecettes.length +
    transformedPlants.length +
    transformedAccords.length +
    transformedTerpProfiles.length +
    transformedFinalRecipes.length +
    transformedCivilisations.length +
    transformedGlossary.length;

  return {
    prototypes: transformedPrototypes,
    molecules: transformedMolecules,
    recettes: transformedRecettes,
    plants: transformedPlants,
    accords: transformedAccords,
    terpProfiles: transformedTerpProfiles,
    finalRecipes: transformedFinalRecipes,
    civilisations: transformedCivilisations,
    glossary: transformedGlossary,
    total
  };
}




// ============================================================================
// MOLECULE DETAILS WITH RELATIONS
// ============================================================================

export async function getMoleculeWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get molecule
  const moleculesList = await db.select().from(molecules).where(eq(molecules.id, id));
  if (moleculesList.length === 0) return null;
  
  const mol = moleculesList[0];
  
  // Get related recettes via molecule_recettes
  const relatedRecettes = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      formula: recettes.formula,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, id));
  
  return {
    molecule: mol,
    recettes: relatedRecettes,
  };
}


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
  
  // Get related molecules via molecule_recettes with radar data
  const relatedMolecules = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      chemicalFormula: molecules.chemicalFormula,
      family: molecules.family,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(moleculesRecettes)
    .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
    .where(eq(moleculesRecettes.recetteId, id));
  
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
    molecules: relatedMolecules,
    family,
    accord,
  };
}


// ============================================================================
// CIVILISATION DETAILS WITH RELATIONS
// ============================================================================

export async function getCivilisationDetailsWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get civilisation
  const civilisationsList = await db.select().from(civilisations).where(eq(civilisations.id, id));
  if (civilisationsList.length === 0) return null;
  
  const civilisation = civilisationsList[0];
  
  // Get related recettes
  const relatedRecettes = await db
    .select()
    .from(recettes)
    .where(eq(recettes.civilisationId, id));
  
  return {
    civilisation,
    recettes: relatedRecettes,
  };
}


// ============================================================================
// PROTOTYPE DETAILS WITH RELATIONS
// ============================================================================

export async function getPrototypeWithRelations(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get prototype
  const prototypesList = await db.select().from(prototypes).where(eq(prototypes.id, id));
  if (prototypesList.length === 0) return null;
  
  const prototype = prototypesList[0];
  
  // Get ABSORBE profile
  const absorbeProfilesList = await db
    .select()
    .from(absorbeProfiles)
    .where(eq(absorbeProfiles.prototypeId, id));
  
  const absorbeProfile = absorbeProfilesList.length > 0 ? absorbeProfilesList[0] : null;
  
  // Get related chemical families via prototype_chemical_families
  const relatedFamilies = await db
    .select({
      id: chemicalFamilies.id,
      name: chemicalFamilies.name,
      description: chemicalFamilies.description,
    })
    .from(prototypeChemicalFamilies)
    .innerJoin(chemicalFamilies, eq(prototypeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id))
    .where(eq(prototypeChemicalFamilies.prototypeId, id));
  
  return {
    prototype,
    absorbeProfile,
    chemicalFamilies: relatedFamilies,
  };
}


// ============================================================================
// NETWORK VISUALIZATION - ALL RELATIONSHIPS
// ============================================================================

export async function getNetworkRelationships() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Get all entities
  const allPrototypes = await db.select().from(prototypes);
  const allMolecules = await db.select().from(molecules);
  const allRecettes = await db.select().from(recettes);
  const allCivilisations = await db.select().from(civilisations);
  const allAccords = await db.select().from(accords);
  
  // Get all relationships
  // 1. Molecules → Chemical Families (via molecule_chemical_families junction table)
  const moleculeFamilyRelations = await db
    .select({
      moleculeId: molecules.id,
      moleculeName: molecules.name,
      familyId: chemicalFamilies.id,
      familyName: chemicalFamilies.name,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(molecules, eq(moleculeChemicalFamilies.moleculeId, molecules.id))
    .innerJoin(chemicalFamilies, eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id));
  
  // 2. Prototypes → Chemical Families
  const prototypeChemicalFamilyRelations = await db
    .select({
      prototypeId: prototypes.id,
      prototypeName: prototypes.name,
      prototypeCode: prototypes.code,
      familyId: chemicalFamilies.id,
      familyName: chemicalFamilies.name,
    })
    .from(prototypeChemicalFamilies)
    .innerJoin(prototypes, eq(prototypeChemicalFamilies.prototypeId, prototypes.id))
    .innerJoin(chemicalFamilies, eq(prototypeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id));
  
  // 3. Recettes → Families (via familyId)
  const recetteFamilyRelations = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      familyId: families.id,
      familyName: families.name,
    })
    .from(recettes)
    .innerJoin(families, eq(recettes.familyId, families.id))
    .where(sql`${recettes.familyId} IS NOT NULL`);
  
  // 4. Recettes → Accords (via accordId)
  const recetteAccordRelations = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      accordId: accords.id,
      accordName: accords.name,
    })
    .from(recettes)
    .innerJoin(accords, eq(recettes.accordId, accords.id))
    .where(sql`${recettes.accordId} IS NOT NULL`);
  
  // 5. Civilisations → Accords (via accord_civilisations)
  const civilisationAccordRelations = await db
    .select({
      civilisationId: civilisations.id,
      civilisationName: civilisations.name,
      accordId: accords.id,
      accordName: accords.name,
    })
    .from(accordCivilisations)
    .innerJoin(civilisations, eq(accordCivilisations.civilisationId, civilisations.id))
    .innerJoin(accords, eq(accordCivilisations.accordId, accords.id));
  
  // 6. Recettes → Civilisations (via civilisationId)
  const recetteCivilisationRelations = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      civilisationId: civilisations.id,
      civilisationName: civilisations.name,
    })
    .from(recettes)
    .innerJoin(civilisations, eq(recettes.civilisationId, civilisations.id))
    .where(sql`${recettes.civilisationId} IS NOT NULL`);
  
  return {
    entities: {
      prototypes: allPrototypes,
      molecules: allMolecules,
      recettes: allRecettes,
      civilisations: allCivilisations,
      accords: allAccords,
    },
    relationships: {
      moleculeFamilies: moleculeFamilyRelations,
      prototypeChemicalFamilies: prototypeChemicalFamilyRelations,
      recetteFamilies: recetteFamilyRelations,
      recetteAccords: recetteAccordRelations,
      civilisationAccords: civilisationAccordRelations,
      recetteCivilisations: recetteCivilisationRelations,
    },
  };
}


// ============================================================
// TABACS & SYNERGIES
// ============================================================



// ============================================
// DASHBOARD STATISTICS
// ============================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { molecules: 0, recettes: 0, accords: 0, prototypes: 0, civilisations: 0 };
  
  const [moleculesCount] = await db.select({ count: sql<number>`count(*)` }).from(molecules);
  const [recettesCount] = await db.select({ count: sql<number>`count(*)` }).from(recettes);
  const [accordsCount] = await db.select({ count: sql<number>`count(*)` }).from(accords);
  const [prototypesCount] = await db.select({ count: sql<number>`count(*)` }).from(prototypes);
  const [civilisationsCount] = await db.select({ count: sql<number>`count(*)` }).from(civilisations);
  
  return {
    molecules: moleculesCount?.count || 0,
    recettes: recettesCount?.count || 0,
    accords: accordsCount?.count || 0,
    prototypes: prototypesCount?.count || 0,
    civilisations: civilisationsCount?.count || 0,
  };
}

export async function getRecipesByStatus() {
  const db = await getDb();
  if (!db) return [];
  
  const statusCounts = await db
    .select({
      status: recettes.status,
      count: sql<number>`count(*)`,
    })
    .from(recettes)
    .groupBy(recettes.status);
  
  return statusCounts;
}

export async function getRecipesByCategory() {
  const db = await getDb();
  if (!db) return [];
  
  const categoryCounts = await db
    .select({
      category: recettes.category,
      count: sql<number>`count(*)`,
    })
    .from(recettes)
    .where(sql`${recettes.category} IS NOT NULL`)
    .groupBy(recettes.category);
  
  return categoryCounts;
}

export async function getMoleculesFamilyStats() {
  const db = await getDb();
  if (!db) return [];
  
  const familyCounts = await db
    .select({
      family: molecules.family,
      count: sql<number>`count(*)`,
    })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family);
  
  return familyCounts;
}

export async function getGlobalMoleculeStats() {
  const db = await getDb();
  if (!db) return {
    totalMolecules: 0,
    totalRecettes: 0,
    totalFamilies: 0,
    totalPrototypes: 0,
    familyDistribution: [],
    gammeDistribution: [],
  };
  
  // Get total counts
  const [moleculesCount] = await db.select({ count: sql<number>`count(*)` }).from(molecules);
  const [recettesCount] = await db.select({ count: sql<number>`count(*)` }).from(recettes);
  const [prototypesCount] = await db.select({ count: sql<number>`count(*)` }).from(prototypes);
  
  // Get unique families count
  const uniqueFamilies = await db
    .select({ family: molecules.family })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family);
  
  // Get family distribution
  const familyDistribution = await db
    .select({
      family: molecules.family,
      count: sql<number>`count(*)`,
    })
    .from(molecules)
    .where(sql`${molecules.family} IS NOT NULL`)
    .groupBy(molecules.family);
  
  // Get gamme distribution (based on olfactive profile keywords)
  const allMolecules = await db.select().from(molecules);
  const gammeDistribution: { gamme: string; count: number }[] = [];
  const gammeCounts: Record<string, number> = {};
  
  allMolecules.forEach(m => {
    if (m.olfactiveProfile) {
      const profile = m.olfactiveProfile.toLowerCase();
      if (profile.includes('pétrichor') || profile.includes('terreux') || profile.includes('géosmine')) {
        gammeCounts['pétrichor'] = (gammeCounts['pétrichor'] || 0) + 1;
      } else if (profile.includes('volcanique') || profile.includes('soufré') || profile.includes('fumé')) {
        gammeCounts['volcanique'] = (gammeCounts['volcanique'] || 0) + 1;
      } else if (profile.includes('glaciaire') || profile.includes('glacé') || profile.includes('frais')) {
        gammeCounts['glaciaire'] = (gammeCounts['glaciaire'] || 0) + 1;
      } else if (profile.includes('bio') || profile.includes('laboratoire')) {
        gammeCounts['bio-lab'] = (gammeCounts['bio-lab'] || 0) + 1;
      } else if (profile.includes('mossi')) {
        gammeCounts['mossi'] = (gammeCounts['mossi'] || 0) + 1;
      }
    }
  });
  
  Object.entries(gammeCounts).forEach(([gamme, count]) => {
    gammeDistribution.push({ gamme, count });
  });
  
  return {
    totalMolecules: moleculesCount.count,
    totalRecettes: recettesCount.count,
    totalFamilies: uniqueFamilies.length,
    totalPrototypes: prototypesCount.count,
    familyDistribution,
    gammeDistribution,
  };
}

export async function getMoleculeTimelineData() {
  const db = await getDb();
  if (!db) return [];
  
  // Get all molecules with creation dates
  const allMolecules = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      createdAt: molecules.createdAt,
      olfactiveProfile: molecules.olfactiveProfile,
      family: molecules.family,
    })
    .from(molecules)
    .orderBy(molecules.createdAt);
  
  // Group by month
  const monthlyData: Record<string, { count: number; cumulative: number; molecules: any[] }> = {};
  let cumulative = 0;
  
  allMolecules.forEach(molecule => {
    if (!molecule.createdAt) return;
    
    const date = new Date(molecule.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { count: 0, cumulative: 0, molecules: [] };
    }
    
    monthlyData[monthKey].count++;
    cumulative++;
    monthlyData[monthKey].cumulative = cumulative;
    monthlyData[monthKey].molecules.push({
      id: molecule.id,
      name: molecule.name,
      family: molecule.family,
    });
  });
  
  // Convert to array and sort by date
  const timelineData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      count: data.count,
      cumulative: data.cumulative,
      molecules: data.molecules,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  return timelineData;
}

export async function getRecentActivity(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const recentRecettes = await db
    .select()
    .from(recettes)
    .orderBy(sql`${recettes.createdAt} DESC`)
    .limit(limit);
  
  return recentRecettes;
}

// ============================================================================
// SYNERGIES QUERIES
// ============================================================================

export async function getAllSynergies() {
  const db = await getDb();
  if (!db) return [];
  
  const allSynergies = await db
    .select({
      id: synergies.id,
      name: synergies.name,
      type: synergies.type,
      effet: synergies.effet,
      notes: synergies.notes,
      tabacId: synergies.tabacId,
      tabacName: tabacs.name,
      moleculeId: synergies.moleculeId,
      moleculeName: molecules.name,
      familleId: synergies.familleId,
      familleName: families.name,
      createdAt: synergies.createdAt,
    })
    .from(synergies)
    .leftJoin(tabacs, eq(synergies.tabacId, tabacs.id))
    .leftJoin(molecules, eq(synergies.moleculeId, molecules.id))
    .leftJoin(families, eq(synergies.familleId, families.id))
    .orderBy(sql`${synergies.createdAt} DESC`);
  
  return allSynergies;
}

export async function getSynergiesByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  
  const synergiesByType = await db
    .select({
      id: synergies.id,
      name: synergies.name,
      type: synergies.type,
      effet: synergies.effet,
      notes: synergies.notes,
      tabacId: synergies.tabacId,
      tabacName: tabacs.name,
      moleculeId: synergies.moleculeId,
      moleculeName: molecules.name,
      familleId: synergies.familleId,
      familleName: families.name,
    })
    .from(synergies)
    .leftJoin(tabacs, eq(synergies.tabacId, tabacs.id))
    .leftJoin(molecules, eq(synergies.moleculeId, molecules.id))
    .leftJoin(families, eq(synergies.familleId, families.id))
    .where(eq(synergies.type, type as any));
  
  return synergiesByType;
}

export async function getSynergiesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byType: [] };
  
  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(synergies);
  
  const byType = await db
    .select({
      type: synergies.type,
      count: sql<number>`count(*)`,
    })
    .from(synergies)
    .groupBy(synergies.type);
  
  return {
    total: total[0]?.count || 0,
    byType,
  };
}


// ============================================================================
// USER FAVORITES
// ============================================================================

export async function addFavorite(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userFavorites).values({
    userId,
    moleculeId,
  }).onDuplicateKeyUpdate({ set: { userId } }); // Ignore if already exists (unique constraint)
  
  return { success: true, favoriteId: result[0].insertId };
}

export async function removeFavorite(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(userFavorites)
    .where(and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.moleculeId, moleculeId)
    ));
  
  return { success: true };
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const favorites = await db
    .select({
      id: userFavorites.id,
      moleculeId: userFavorites.moleculeId,
      createdAt: userFavorites.createdAt,
      molecule: molecules,
    })
    .from(userFavorites)
    .leftJoin(molecules, eq(userFavorites.moleculeId, molecules.id))
    .where(eq(userFavorites.userId, userId))
    .orderBy(desc(userFavorites.createdAt));
  
  return favorites;
}

export async function isFavorite(userId: number, moleculeId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(and(
      eq(userFavorites.userId, userId),
      eq(userFavorites.moleculeId, moleculeId)
    ))
    .limit(1);
  
  return result.length > 0;
}

// ============================================================================
// MILESTONES
// ============================================================================

export async function getMilestones() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(milestones).orderBy(desc(milestones.date));
}

export async function getMilestoneById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [milestone] = await db.select().from(milestones).where(eq(milestones.id, id));
  return milestone || null;
}

export async function createMilestone(data: typeof milestones.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(milestones).values(data).$returningId();
  return result;
}

export async function updateMilestone(id: number, data: Partial<typeof milestones.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(milestones).set(data).where(eq(milestones.id, id));
  return getMilestoneById(id);
}

export async function deleteMilestone(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(milestones).where(eq(milestones.id, id));
  return { success: true };
}


// ============================================================================
// PHASE 4: COLLABORATION & PARTAGE - Database Functions
// ============================================================================

// Shared Collections
export async function createSharedCollection(data: {
  token: string;
  title: string;
  description?: string;
  moleculeIds: number[];
  creatorId: number;
  expiresAt: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(sharedCollections).values({
    token: data.token,
    title: data.title,
    description: data.description,
    moleculeIds: JSON.stringify(data.moleculeIds),
    creatorId: data.creatorId,
    expiresAt: data.expiresAt,
    viewCount: 0,
  }).$returningId();
  
  return result;
}

export async function getSharedCollectionByToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [collection] = await db
    .select()
    .from(sharedCollections)
    .where(eq(sharedCollections.token, token));
  
  if (!collection) return null;
  
  // Check if expired
  if (new Date() > new Date(collection.expiresAt)) {
    return null;
  }
  
  // Increment view count
  await db
    .update(sharedCollections)
    .set({ viewCount: collection.viewCount + 1 })
    .where(eq(sharedCollections.id, collection.id));
  
  return {
    ...collection,
    viewCount: collection.viewCount + 1, // Return incremented value
    moleculeIds: JSON.parse(collection.moleculeIds) as number[],
  };
}

export async function getUserSharedCollections(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const collections = await db
    .select()
    .from(sharedCollections)
    .where(eq(sharedCollections.creatorId, userId))
    .orderBy(desc(sharedCollections.createdAt));
  
  return collections.map(c => ({
    ...c,
    moleculeIds: JSON.parse(c.moleculeIds) as number[],
  }));
}

// Molecule Notes
export async function getMoleculeNote(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [note] = await db
    .select()
    .from(moleculeNotes)
    .where(
      and(
        eq(moleculeNotes.userId, userId),
        eq(moleculeNotes.moleculeId, moleculeId)
      )
    );
  
  if (!note) return null;
  
  return {
    ...note,
    tags: note.tags ? JSON.parse(note.tags) as string[] : [],
  };
}

export async function upsertMoleculeNote(data: {
  userId: number;
  moleculeId: number;
  note: string;
  tags?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getMoleculeNote(data.userId, data.moleculeId);
  
  if (existing) {
    // Update
    await db
      .update(moleculeNotes)
      .set({
        note: data.note,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      })
      .where(eq(moleculeNotes.id, existing.id));
    
    return getMoleculeNote(data.userId, data.moleculeId);
  } else {
    // Insert
    const [result] = await db.insert(moleculeNotes).values({
      userId: data.userId,
      moleculeId: data.moleculeId,
      note: data.note,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    }).$returningId();
    
    return getMoleculeNote(data.userId, data.moleculeId);
  }
}

export async function getUserMoleculeNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const notes = await db
    .select()
    .from(moleculeNotes)
    .where(eq(moleculeNotes.userId, userId))
    .orderBy(desc(moleculeNotes.updatedAt));
  
  return notes.map(n => ({
    ...n,
    tags: n.tags ? JSON.parse(n.tags) as string[] : [],
  }));
}

export async function deleteMoleculeNote(userId: number, moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(moleculeNotes)
    .where(
      and(
        eq(moleculeNotes.userId, userId),
        eq(moleculeNotes.moleculeId, moleculeId)
      )
    );
  
  return { success: true };
}

// Citations
export async function generateCitation(
  entityType: 'molecule' | 'recipe' | 'prototype' | 'accord',
  entityId: number,
  format: 'apa' | 'mla' | 'chicago' | 'bibtex' = 'apa'
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get entity data
  let entityData: any = null;
  let citationText = '';
  
  if (entityType === 'molecule') {
    const [molecule] = await db.select().from(molecules).where(eq(molecules.id, entityId));
    if (!molecule) throw new Error("Molecule not found");
    entityData = molecule;
    
    // Generate citation based on format
    const year = new Date(molecule.createdAt).getFullYear();
    
    if (format === 'apa') {
      citationText = `PERFUMUM Research. (${year}). ${molecule.name}${molecule.chemicalFormula ? ` [${molecule.chemicalFormula}]` : ''}. PERFUMUM Molecular Database. https://perfumum.manus.space/molecule/${entityId}`;
    } else if (format === 'mla') {
      citationText = `"${molecule.name}." PERFUMUM Molecular Database, PERFUMUM Research, ${year}, perfumum.manus.space/molecule/${entityId}.`;
    } else if (format === 'chicago') {
      citationText = `PERFUMUM Research. "${molecule.name}." PERFUMUM Molecular Database. Accessed ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. https://perfumum.manus.space/molecule/${entityId}.`;
    } else if (format === 'bibtex') {
      citationText = `@misc{perfumum_molecule_${entityId},
  title={${molecule.name}${molecule.chemicalFormula ? ` [${molecule.chemicalFormula}]` : ''}},
  author={PERFUMUM Research},
  year={${year}},
  howpublished={\\url{https://perfumum.manus.space/molecule/${entityId}}},
  note={PERFUMUM Molecular Database}
}`;
    }
  } else if (entityType === 'recipe') {
    const [recipe] = await db.select().from(recettes).where(eq(recettes.id, entityId));
    if (!recipe) throw new Error("Recipe not found");
    entityData = recipe;
    
    const year = new Date(recipe.createdAt).getFullYear();
    
    if (format === 'apa') {
      citationText = `PERFUMUM Research. (${year}). ${recipe.name}. PERFUMUM Recipe Database. https://perfumum.manus.space/recette/${entityId}`;
    } else if (format === 'mla') {
      citationText = `"${recipe.name}." PERFUMUM Recipe Database, PERFUMUM Research, ${year}, perfumum.manus.space/recette/${entityId}.`;
    } else if (format === 'chicago') {
      citationText = `PERFUMUM Research. "${recipe.name}." PERFUMUM Recipe Database. Accessed ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. https://perfumum.manus.space/recette/${entityId}.`;
    } else if (format === 'bibtex') {
      citationText = `@misc{perfumum_recipe_${entityId},
  title={${recipe.name}},
  author={PERFUMUM Research},
  year={${year}},
  howpublished={\\url{https://perfumum.manus.space/recette/${entityId}}},
  note={PERFUMUM Recipe Database}
}`;
    }
  }
  
  // Save citation
  const [result] = await db.insert(citations).values({
    entityType,
    entityId,
    format,
    citationText,
    url: `https://perfumum.manus.space/${entityType}/${entityId}`,
  }).$returningId();
  
  return {
    id: result.id,
    citationText,
    format,
  };
}

export async function getCitation(entityType: string, entityId: number, format: string = 'apa') {
  const db = await getDb();
  if (!db) return null;
  
  const [citation] = await db
    .select()
    .from(citations)
    .where(
      and(
        eq(citations.entityType, entityType as any),
        eq(citations.entityId, entityId),
        eq(citations.format, format as any)
      )
    );
  
  return citation;
}

export async function getRecetteMolecules(recetteId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      molecule: molecules,
      proportion: moleculesRecettes.proportion,
    })
    .from(moleculesRecettes)
    .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
    .where(eq(moleculesRecettes.recetteId, recetteId));
  
  return results;
}


export async function getAllRecettesWithMolecules() {
  const db = await getDb();
  if (!db) return [];
  
  const recettesCBD = await db
    .select()
    .from(recettes)
    .where(eq(recettes.category, "resine_cbd" as any));
  
  const result = await Promise.all(
    recettesCBD.map(async (recette: any) => {
      const mols = await db
        .select({
          molecule: molecules,
          proportion: moleculesRecettes.proportion,
        })
        .from(moleculesRecettes)
        .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
        .where(eq(moleculesRecettes.recetteId, recette.id));
      
      return {
        recette,
        molecules: mols,
      };
    })
  );
  
  return result;
}


// ============================================================================
// TERPENE SYNERGIES
// ============================================================================

export async function getAllTerpeneSynergies(): Promise<TerpeneSynergy[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(terpeneSynergies)
    .orderBy(terpeneSynergies.terpene1Id, terpeneSynergies.terpene2Id);
}

export async function getTerpeneSynergyByPair(terpene1Id: number, terpene2Id: number): Promise<TerpeneSynergy | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Essayer dans les deux sens (t1-t2 ou t2-t1)
  const result = await db
    .select()
    .from(terpeneSynergies)
    .where(
      or(
        and(
          eq(terpeneSynergies.terpene1Id, terpene1Id),
          eq(terpeneSynergies.terpene2Id, terpene2Id)
        ),
        and(
          eq(terpeneSynergies.terpene1Id, terpene2Id),
          eq(terpeneSynergies.terpene2Id, terpene1Id)
        )
      )
    )
    .limit(1);
  
  return result[0] || null;
}


// ============================================================================
// USER NOTES
// ============================================================================

export async function createUserNote(entityType: string, entityId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userNotes).values({
    entityType,
    entityId,
    content,
  });
  
  return { id: Number((result as any).insertId) };
}

export async function updateUserNote(id: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(userNotes)
    .set({ content, updatedAt: new Date() })
    .where(eq(userNotes.id, id));
  
  return { success: true };
}

export async function deleteUserNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(userNotes).where(eq(userNotes.id, id));
  
  return { success: true };
}

export async function getUserNoteByEntity(entityType: string, entityId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(userNotes)
    .where(
      and(
        eq(userNotes.entityType, entityType),
        eq(userNotes.entityId, entityId)
      )
    )
    .limit(1);
  
  return result[0] || null;
}

export async function searchUserNotes(query: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(userNotes)
    .where(like(userNotes.content, `%${query}%`))
    .orderBy(desc(userNotes.updatedAt))
    .limit(20);
  
  return result;
}


// ============================================================================
// SIMILARITY & RECOMMENDATIONS
// ============================================================================

/**
 * Calcule la distance euclidienne entre deux profils radar
 * Plus la distance est petite, plus les profils sont similaires
 */
function calculateRadarSimilarity(mol1: Molecule, mol2: Molecule): number {
  const axes = [
    'radarIntensity',
    'radarFreshness',
    'radarWarmth',
    'radarSweetness',
    'radarSpiciness',
    'radarEarthiness',
  ] as const;

  let sumSquares = 0;
  for (const axis of axes) {
    const val1 = (mol1[axis] as number) || 50;
    const val2 = (mol2[axis] as number) || 50;
    sumSquares += Math.pow(val1 - val2, 2);
  }

  const distance = Math.sqrt(sumSquares);
  // Normaliser sur 100 (distance max = sqrt(6 * 100^2) ≈ 245)
  // Score de similarité : 100 = identique, 0 = très différent
  return Math.max(0, 100 - (distance / 245) * 100);
}

export async function getSimilarMolecules(moleculeId: number, limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  // Récupérer la molécule de référence
  const reference = await db
    .select()
    .from(molecules)
    .where(eq(molecules.id, moleculeId))
    .limit(1);

  if (!reference[0]) return [];

  // Récupérer toutes les autres molécules avec profils radar
  const allMolecules = await db
    .select()
    .from(molecules)
    .where(sql`${molecules.radarIntensity} IS NOT NULL`);

  // Calculer similarité pour chaque molécule
  const withSimilarity = allMolecules
    .filter((mol) => mol.id !== moleculeId)
    .map((mol) => ({
      ...mol,
      similarityScore: calculateRadarSimilarity(reference[0], mol),
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return withSimilarity;
}

export async function getMoleculeUsageStats(moleculeId: number) {
  const db = await getDb();
  if (!db) return { recettesCount: 0, accordsCount: 0 };

  // TODO: implémenter quand table de liaison molecules_recettes sera créée
  // Pour l'instant retourner 0
  return {
    recettesCount: 0,
    accordsCount: 0,
  };
}


// ============================================================================
// GET ALL MOLECULE-RECETTE RELATIONSHIPS FOR CORRELATION ANALYSIS
// ============================================================================

export async function getAllMoleculeRecetteRelationships() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const relationships = await db
    .select({
      moleculeId: moleculesRecettes.moleculeId,
      recetteId: moleculesRecettes.recetteId,
      proportion: moleculesRecettes.proportion,
    })
    .from(moleculesRecettes);
  
  return relationships;
}



// ============================================================================
// ANALYTICS & STATISTICS
// ============================================================================

/**
 * Track an analytics event
 */
export async function trackEvent(
  eventType: 'molecule_view' | 'recipe_view' | 'terpene_view' | 'pdf_export' | 'favorite_add' | 'favorite_remove' | 'search_query',
  entityType?: string,
  entityId?: number,
  userId?: number,
  metadata?: Record<string, any>
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(analyticsEvents).values({
    eventType,
    entityType: entityType || null,
    entityId: entityId || null,
    userId: userId || null,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });
}

/**
 * Get most viewed molecules in the last N days
 */
export async function getMostViewedMolecules(days: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const views = await db
    .select({
      entityId: analyticsEvents.entityId,
      viewCount: sql<number>`COUNT(*)`.as('view_count'),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'molecule_view'),
        gte(analyticsEvents.createdAt, cutoffDate)
      )
    )
    .groupBy(analyticsEvents.entityId)
    .orderBy(desc(sql`view_count`))
    .limit(limit);

  // Fetch molecule details
  const moleculeIds = views.map(v => v.entityId).filter((id): id is number => id !== null);
  if (moleculeIds.length === 0) return [];

  const moleculeDetails = await db
    .select()
    .from(molecules)
    .where(inArray(molecules.id, moleculeIds));

  return views.map(v => ({
    ...moleculeDetails.find(m => m.id === v.entityId),
    viewCount: v.viewCount,
  })).filter(m => m.id !== undefined);
}

/**
 * Get most viewed recipes in the last N days
 */
export async function getMostViewedRecipes(days: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const views = await db
    .select({
      entityId: analyticsEvents.entityId,
      viewCount: sql<number>`COUNT(*)`.as('view_count'),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'recipe_view'),
        gte(analyticsEvents.createdAt, cutoffDate)
      )
    )
    .groupBy(analyticsEvents.entityId)
    .orderBy(desc(sql`view_count`))
    .limit(limit);

  const recipeIds = views.map(v => v.entityId).filter((id): id is number => id !== null);
  if (recipeIds.length === 0) return [];

  const recipeDetails = await db
    .select()
    .from(recettes)
    .where(inArray(recettes.id, recipeIds));

  return views.map(v => ({
    ...recipeDetails.find(r => r.id === v.entityId),
    viewCount: v.viewCount,
  })).filter(r => r.id !== undefined);
}

/**
 * Get activity timeline (events per day for the last N days)
 */
export async function getActivityTimeline(days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const timeline = await db
    .select({
      date: sql<string>`DATE(created_at)`.as('date'),
      eventCount: sql<number>`COUNT(*)`.as('event_count'),
    })
    .from(analyticsEvents)
    .where(gte(analyticsEvents.createdAt, cutoffDate))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`);

  return timeline;
}

/**
 * Get popular search queries
 */
export async function getPopularSearches(days: number = 30, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const searches = await db
    .select({
      query: analyticsEvents.metadata,
      searchCount: sql<number>`COUNT(*)`.as('search_count'),
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.eventType, 'search_query'),
        gte(analyticsEvents.createdAt, cutoffDate)
      )
    )
    .groupBy(analyticsEvents.metadata)
    .orderBy(desc(sql`search_count`))
    .limit(limit);

  return searches.map(s => ({
    query: s.query ? JSON.parse(s.query).query : 'Unknown',
    count: s.searchCount,
  }));
}

/**
 * Get analytics dashboard statistics
 */
export async function getAnalyticsDashboardStats(days: number = 30) {
  const db = await getDb();
  if (!db) return {
    totalViews: 0,
    totalExports: 0,
    totalSearches: 0,
    totalFavorites: 0,
  };

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const [views, exports, searches, favorites] = await Promise.all([
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          inArray(analyticsEvents.eventType, ['molecule_view', 'recipe_view', 'terpene_view']),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'pdf_export'),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'search_query'),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'favorite_add'),
          gte(analyticsEvents.createdAt, cutoffDate)
        )
      ),
  ]);

  return {
    totalViews: views[0]?.count || 0,
    totalExports: exports[0]?.count || 0,
    totalSearches: searches[0]?.count || 0,
    totalFavorites: favorites[0]?.count || 0,
  };
}

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


// ============================================================================
// MOLECULES RADAR UPDATE
// ============================================================================

export async function updateMoleculeRadar(data: {
  id: number;
  radarIntensity: number;
  radarFreshness: number;
  radarWarmth: number;
  radarSweetness: number;
  radarSpiciness: number;
  radarEarthiness: number;
}): Promise<Molecule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(molecules).set({
    radarIntensity: data.radarIntensity,
    radarFreshness: data.radarFreshness,
    radarWarmth: data.radarWarmth,
    radarSweetness: data.radarSweetness,
    radarSpiciness: data.radarSpiciness,
    radarEarthiness: data.radarEarthiness,
  }).where(eq(molecules.id, data.id));
  
  const updated = await getMoleculeById(data.id);
  if (!updated) throw new Error('Molecule not found after update');
  
  return updated;
}

// ============================================================================
// MOLECULES REFERENCES UPDATE
// ============================================================================

export async function updateMoleculeReferences(id: number, referencesJson: string): Promise<Molecule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Parse JSON string to array
  const referencesArray = JSON.parse(referencesJson);
  
  await db.update(molecules).set({
    references: referencesArray,
  }).where(eq(molecules.id, id));
  
  const updated = await getMoleculeById(id);
  if (!updated) throw new Error('Molecule not found after update');
  
  return updated;
}


// ============================================================================
// SYNERGIES GRAPH DATA
// ============================================================================

export async function getSynergyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select({
      id: synergies.id,
      name: synergies.name,
      type: synergies.type,
      effet: synergies.effet,
      notes: synergies.notes,
      tabacId: synergies.tabacId,
      tabacName: tabacs.name,
      moleculeId: synergies.moleculeId,
      moleculeName: molecules.name,
      familleId: synergies.familleId,
      familleName: families.name,
      createdAt: synergies.createdAt,
    })
    .from(synergies)
    .leftJoin(tabacs, eq(synergies.tabacId, tabacs.id))
    .leftJoin(molecules, eq(synergies.moleculeId, molecules.id))
    .leftJoin(families, eq(synergies.familleId, families.id))
    .where(eq(synergies.id, id))
    .limit(1);
  
  return result[0];
}

export async function getSynergiesGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], edges: [] };
  
  // Récupérer toutes les synergies avec leurs relations
  const allSynergies = await getAllSynergies();
  
  // Créer les nœuds et arêtes pour le graphe
  const nodesMap = new Map<string, { id: string; name: string; type: 'molecule' | 'tabac' | 'famille' }>();
  const edges: Array<{ source: string; target: string; synergyType: string; synergyName: string; effet: string | null }> = [];
  
  for (const synergy of allSynergies) {
    // Ajouter les nœuds (molécule, tabac, famille)
    if (synergy.moleculeId && synergy.moleculeName) {
      nodesMap.set(`mol-${synergy.moleculeId}`, { 
        id: `mol-${synergy.moleculeId}`, 
        name: synergy.moleculeName, 
        type: 'molecule' 
      });
    }
    
    if (synergy.tabacId && synergy.tabacName) {
      nodesMap.set(`tab-${synergy.tabacId}`, { 
        id: `tab-${synergy.tabacId}`, 
        name: synergy.tabacName, 
        type: 'tabac' 
      });
    }
    
    if (synergy.familleId && synergy.familleName) {
      nodesMap.set(`fam-${synergy.familleId}`, { 
        id: `fam-${synergy.familleId}`, 
        name: synergy.familleName, 
        type: 'famille' 
      });
    }
    
    // Créer les arêtes entre les nœuds
    if (synergy.moleculeId && synergy.tabacId) {
      edges.push({
        source: `mol-${synergy.moleculeId}`,
        target: `tab-${synergy.tabacId}`,
        synergyType: synergy.type,
        synergyName: synergy.name,
        effet: synergy.effet
      });
    }
    
    if (synergy.moleculeId && synergy.familleId) {
      edges.push({
        source: `mol-${synergy.moleculeId}`,
        target: `fam-${synergy.familleId}`,
        synergyType: synergy.type,
        synergyName: synergy.name,
        effet: synergy.effet
      });
    }
    
    if (synergy.tabacId && synergy.familleId) {
      edges.push({
        source: `tab-${synergy.tabacId}`,
        target: `fam-${synergy.familleId}`,
        synergyType: synergy.type,
        synergyName: synergy.name,
        effet: synergy.effet
      });
    }
  }
  
  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
}


// ============================================================================
// SUGGESTIONS AUTOMATIQUES DE SYNERGIES
// ============================================================================

/**
 * Calcule la distance euclidienne entre deux profils radar (6 dimensions)
 * Retourne une valeur entre 0 (identiques) et ~245 (opposés complets)
 */
function calculateRadarDistance(mol1: Record<string, any>, mol2: Record<string, any>): number {
  const sumSquares = 
    Math.pow((mol1.radarIntensity || 0) - (mol2.radarIntensity || 0), 2) +
    Math.pow((mol1.radarFreshness || 0) - (mol2.radarFreshness || 0), 2) +
    Math.pow((mol1.radarWarmth || 0) - (mol2.radarWarmth || 0), 2) +
    Math.pow((mol1.radarSweetness || 0) - (mol2.radarSweetness || 0), 2) +
    Math.pow((mol1.radarSpiciness || 0) - (mol2.radarSpiciness || 0), 2) +
    Math.pow((mol1.radarEarthiness || 0) - (mol2.radarEarthiness || 0), 2);
  
  return Math.sqrt(sumSquares);
}

/**
 * Convertit la distance euclidienne en score de similarité (0-100%)
 * Distance 0 = 100% similaire
 * Distance 245 (max théorique) = 0% similaire
 */
function distanceToSimilarity(distance: number): number {
  const maxDistance = Math.sqrt(6 * Math.pow(100, 2)); // ~245
  return Math.max(0, Math.min(100, 100 * (1 - distance / maxDistance)));
}

/**
 * Génère des suggestions de synergies potentielles basées sur la similarité des profils radar
 * @param minSimilarity Seuil minimum de similarité (0-100), défaut 70%
 * @param limit Nombre maximum de suggestions, défaut 10
 */
export async function getSynergySuggestions(minSimilarity: number = 70, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les molécules avec profils radar complets
  const allMolecules = await db
    .select()
    .from(molecules)
    .where(
      and(
        not(isNull(molecules.radarIntensity)),
        not(isNull(molecules.radarFreshness)),
        not(isNull(molecules.radarWarmth)),
        not(isNull(molecules.radarSweetness)),
        not(isNull(molecules.radarSpiciness)),
        not(isNull(molecules.radarEarthiness))
      )
    );
  
  if (allMolecules.length < 2) return [];
  
  // Calculer toutes les paires possibles avec leur similarité
  const suggestions: Array<{
    molecule1Id: number;
    molecule1Name: string;
    molecule2Id: number;
    molecule2Name: string;
    similarity: number;
    distance: number;
    radarProfile1: any;
    radarProfile2: any;
    explanation: string;
  }> = [];
  
  for (let i = 0; i < allMolecules.length; i++) {
    for (let j = i + 1; j < allMolecules.length; j++) {
      const mol1 = allMolecules[i];
      const mol2 = allMolecules[j];
      
      const distance = calculateRadarDistance(mol1, mol2);
      const similarity = distanceToSimilarity(distance);
      
      if (similarity >= minSimilarity) {
        // Identifier les axes similaires (différence < 20)
        const similarAxes: string[] = [];
        // Vérifier chaque axe individuellement
        if (Math.abs((mol1.radarIntensity || 0) - (mol2.radarIntensity || 0)) < 20) similarAxes.push('Intensité');
        if (Math.abs((mol1.radarFreshness || 0) - (mol2.radarFreshness || 0)) < 20) similarAxes.push('Fraîcheur');
        if (Math.abs((mol1.radarWarmth || 0) - (mol2.radarWarmth || 0)) < 20) similarAxes.push('Chaleur');
        if (Math.abs((mol1.radarSweetness || 0) - (mol2.radarSweetness || 0)) < 20) similarAxes.push('Douceur');
        if (Math.abs((mol1.radarSpiciness || 0) - (mol2.radarSpiciness || 0)) < 20) similarAxes.push('Épices');
        if (Math.abs((mol1.radarEarthiness || 0) - (mol2.radarEarthiness || 0)) < 20) similarAxes.push('Terreux');
        
        const explanation = similarAxes.length > 0
          ? `Profils similaires sur ${similarAxes.join(', ')}`
          : 'Profils complémentaires';
        
        suggestions.push({
          molecule1Id: mol1.id,
          molecule1Name: mol1.name,
          molecule2Id: mol2.id,
          molecule2Name: mol2.name,
          similarity: Math.round(similarity * 10) / 10,
          distance: Math.round(distance * 10) / 10,
          radarProfile1: {
            intensity: mol1.radarIntensity,
            freshness: mol1.radarFreshness,
            warmth: mol1.radarWarmth,
            sweetness: mol1.radarSweetness,
            spiciness: mol1.radarSpiciness,
            earthiness: mol1.radarEarthiness
          },
          radarProfile2: {
            intensity: mol2.radarIntensity,
            freshness: mol2.radarFreshness,
            warmth: mol2.radarWarmth,
            sweetness: mol2.radarSweetness,
            spiciness: mol2.radarSpiciness,
            earthiness: mol2.radarEarthiness
          },
          explanation
        });
      }
    }
  }
  
  // Trier par similarité décroissante et limiter
  return suggestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}


// ============================================================================
// ENRICHISSEMENT DES DONNÉES MOLÉCULES
// ============================================================================

// Dictionnaire de données scientifiques connues
const knownMoleculeData: Record<string, { molecularWeight?: number; boilingPoint?: number; family?: string }> = {
  'limonène': { molecularWeight: 136, boilingPoint: 176, family: 'Monoterpène' },
  'limonene': { molecularWeight: 136, boilingPoint: 176, family: 'Monoterpène' },
  'α-pinène': { molecularWeight: 136, boilingPoint: 155, family: 'Monoterpène' },
  'pinène': { molecularWeight: 136, boilingPoint: 155, family: 'Monoterpène' },
  'β-pinène': { molecularWeight: 136, boilingPoint: 166, family: 'Monoterpène' },
  'myrcène': { molecularWeight: 136, boilingPoint: 167, family: 'Monoterpène' },
  'linalol': { molecularWeight: 154, boilingPoint: 198, family: 'Monoterpénol' },
  'linalool': { molecularWeight: 154, boilingPoint: 198, family: 'Monoterpénol' },
  'géraniol': { molecularWeight: 154, boilingPoint: 230, family: 'Monoterpénol' },
  'terpinéol': { molecularWeight: 154, boilingPoint: 219, family: 'Monoterpénol' },
  'menthol': { molecularWeight: 156, boilingPoint: 212, family: 'Monoterpénol' },
  'eucalyptol': { molecularWeight: 154, boilingPoint: 176, family: 'Oxyde terpénique' },
  'camphre': { molecularWeight: 152, boilingPoint: 204, family: 'Cétone terpénique' },
  'caryophyllène': { molecularWeight: 204, boilingPoint: 262, family: 'Sesquiterpène' },
  'β-caryophyllène': { molecularWeight: 204, boilingPoint: 262, family: 'Sesquiterpène' },
  'humulène': { molecularWeight: 204, boilingPoint: 166, family: 'Sesquiterpène' },
  'bisabolol': { molecularWeight: 222, boilingPoint: 153, family: 'Sesquiterpénol' },
  'farnesol': { molecularWeight: 222, boilingPoint: 283, family: 'Sesquiterpénol' },
  'vétiver': { molecularWeight: 218, boilingPoint: 290, family: 'Sesquiterpène' },
  'patchouli': { molecularWeight: 222, boilingPoint: 287, family: 'Sesquiterpénol' },
  'citral': { molecularWeight: 152, boilingPoint: 229, family: 'Aldéhyde terpénique' },
  'vanilline': { molecularWeight: 152, boilingPoint: 285, family: 'Aldéhyde aromatique' },
  'cinnamaldéhyde': { molecularWeight: 132, boilingPoint: 248, family: 'Aldéhyde aromatique' },
  'eugénol': { molecularWeight: 164, boilingPoint: 254, family: 'Phénol' },
  'thymol': { molecularWeight: 150, boilingPoint: 232, family: 'Phénol' },
  'coumarine': { molecularWeight: 146, boilingPoint: 301, family: 'Lactone' },
  'géosmine': { molecularWeight: 182, boilingPoint: 270, family: 'Alcool bicyclique' },
  'ambroxan': { molecularWeight: 236, boilingPoint: 320, family: 'Ambre synthétique' },
  'indole': { molecularWeight: 117, boilingPoint: 254, family: 'Hétérocycle azoté' },
  'skatole': { molecularWeight: 131, boilingPoint: 265, family: 'Hétérocycle azoté' },
  'acide hexanoïque': { molecularWeight: 116, boilingPoint: 205, family: 'Acide gras' },
  'acide butyrique': { molecularWeight: 88, boilingPoint: 164, family: 'Acide gras' },
  'pyrazine': { molecularWeight: 80, boilingPoint: 115, family: 'Pyrazine' },
  'furfural': { molecularWeight: 96, boilingPoint: 162, family: 'Furane' },
};

function estimatePropertiesFromProfile(name: string, profile: string | null): { molecularWeight: number; boilingPoint: number; family: string } {
  const nameLower = name.toLowerCase();
  const profileLower = (profile || '').toLowerCase();
  
  // Chercher dans le dictionnaire
  for (const [key, data] of Object.entries(knownMoleculeData)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return {
        molecularWeight: data.molecularWeight || 150,
        boilingPoint: data.boilingPoint || 200,
        family: data.family || 'Non classé',
      };
    }
  }
  
  // Estimation basée sur les mots-clés
  let molecularWeight = 150;
  let boilingPoint = 200;
  let family = 'Non classé';
  
  if (profileLower.includes('citron') || profileLower.includes('agrume')) {
    molecularWeight = 136; boilingPoint = 176; family = 'Monoterpène';
  } else if (profileLower.includes('bois') || profileLower.includes('cèdre')) {
    molecularWeight = 204; boilingPoint = 260; family = 'Sesquiterpène';
  } else if (profileLower.includes('floral') || profileLower.includes('rose')) {
    molecularWeight = 154; boilingPoint = 220; family = 'Monoterpénol';
  } else if (profileLower.includes('vanille') || profileLower.includes('sucré')) {
    molecularWeight = 152; boilingPoint = 250; family = 'Aldéhyde';
  } else if (profileLower.includes('épic') || profileLower.includes('clou')) {
    molecularWeight = 164; boilingPoint = 245; family = 'Phénol';
  } else if (profileLower.includes('terre') || profileLower.includes('mousse')) {
    molecularWeight = 182; boilingPoint = 270; family = 'Alcool bicyclique';
  } else if (profileLower.includes('musc') || profileLower.includes('ambre')) {
    molecularWeight = 250; boilingPoint = 310; family = 'Musc synthétique';
  } else if (profileLower.includes('menthe') || profileLower.includes('frais')) {
    molecularWeight = 156; boilingPoint = 212; family = 'Monoterpénol';
  }
  
  // Variation basée sur le nom
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  molecularWeight += (hash % 30) - 15;
  boilingPoint += (hash % 40) - 20;
  
  return { molecularWeight, boilingPoint, family };
}

export async function enrichMoleculeData() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Récupérer les molécules avec données manquantes
  const moleculesWithMissingData = await db.select().from(molecules).where(
    or(
      eq(molecules.molecularWeight, 0),
      isNull(molecules.molecularWeight),
      eq(molecules.boilingPoint, 0),
      isNull(molecules.boilingPoint),
      eq(molecules.family, ''),
      isNull(molecules.family)
    )
  );
  
  let updated = 0;
  const results: { name: string; molecularWeight: number; boilingPoint: number; family: string }[] = [];
  
  for (const mol of moleculesWithMissingData) {
    const estimated = estimatePropertiesFromProfile(mol.name, mol.olfactiveProfile);
    
    const updateData: Partial<typeof molecules.$inferInsert> = {};
    
    if (!mol.molecularWeight || mol.molecularWeight === 0) {
      updateData.molecularWeight = estimated.molecularWeight;
    }
    
    if (!mol.boilingPoint || mol.boilingPoint === 0) {
      updateData.boilingPoint = estimated.boilingPoint;
    }
    
    if (!mol.family || mol.family === '') {
      updateData.family = estimated.family;
    }
    
    // Calculer volatilité
    if (!mol.volatility || mol.volatility === 0) {
      const bp = mol.boilingPoint || estimated.boilingPoint;
      updateData.volatility = Math.round(Math.max(20, Math.min(95, 100 - (bp - 100) * 0.35)));
    }
    
    // Calculer intensité
    if (!mol.intensity || mol.intensity === 0) {
      let intensity = 50;
      const family = (mol.family || estimated.family).toLowerCase();
      if (family.includes('aldéhyde') || family.includes('phénol')) intensity = 75;
      else if (family.includes('musc') || family.includes('ambre')) intensity = 85;
      else if (family.includes('monoterpène')) intensity = 55;
      else if (family.includes('sesquiterpène')) intensity = 65;
      
      const hash = mol.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      intensity += (hash % 20) - 10;
      updateData.intensity = Math.round(Math.max(30, Math.min(95, intensity)));
    }
    
    if (Object.keys(updateData).length > 0) {
      await db.update(molecules).set(updateData).where(eq(molecules.id, mol.id));
      updated++;
      results.push({
        name: mol.name,
        molecularWeight: updateData.molecularWeight || mol.molecularWeight || 0,
        boilingPoint: updateData.boilingPoint || mol.boilingPoint || 0,
        family: updateData.family || mol.family || 'Non classé',
      });
    }
  }
  
  return { updated, results };
}


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


// ============================================================================
// BATCH INSERT MOLECULES-RECETTES ASSOCIATIONS
// ============================================================================

export async function insertMoleculeRecetteAssociation(
  recetteId: number,
  moleculeId: number,
  proportion: number,
  notes?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.insert(moleculesRecettes).values({
      recetteId,
      moleculeId,
      proportion: proportion.toString(),
      notes: notes || 'Auto-généré',
    }).onDuplicateKeyUpdate({
      set: {
        proportion: proportion.toString(),
        notes: notes || 'Auto-généré',
      }
    });
    return true;
  } catch (error) {
    console.error(`Error inserting association ${recetteId}-${moleculeId}:`, error);
    return false;
  }
}

export async function batchInsertMoleculeRecetteAssociations(
  associations: Array<{ recetteId: number; moleculeId: number; proportion: number; notes?: string }>
): Promise<{ success: number; failed: number }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: associations.length };
  
  let success = 0;
  let failed = 0;
  
  for (const assoc of associations) {
    const result = await insertMoleculeRecetteAssociation(
      assoc.recetteId,
      assoc.moleculeId,
      assoc.proportion,
      assoc.notes
    );
    if (result) success++;
    else failed++;
  }
  
  return { success, failed };
}

// Récupérer les recettes sans associations pour une gamme
export async function getRecettesWithoutMoleculesByGamme(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Conditions par gamme
  const conditions: Record<string, ReturnType<typeof or>> = {
    volcanique: or(
      like(recettes.name, '%Volcanique%'),
      like(recettes.name, '%Fumé%'),
      like(recettes.name, '%Pyrolyse%'),
      eq(recettes.category, 'tabac')
    ),
    glaciaire: or(
      like(recettes.name, '%Glaciaire%'),
      like(recettes.name, '%Frais%'),
      like(recettes.name, '%Ozone%'),
      like(recettes.name, '%Menthe%')
    ),
    biolab: or(
      like(recettes.name, '%Bio%'),
      like(recettes.name, '%CBD%'),
      like(recettes.name, '%Résine%'),
      eq(recettes.category, 'resine_cbd')
    ),
    petrichor: or(
      like(recettes.name, '%Pétrichor%'),
      like(recettes.name, '%Terre%'),
      like(recettes.name, '%Minéral%')
    ),
  };
  
  const condition = conditions[gamme];
  if (!condition) return [];
  
  // Récupérer les recettes qui n'ont pas d'associations
  const allRecettes = await db.select().from(recettes).where(condition);
  
  const recettesWithoutMolecules: Recette[] = [];
  
  for (const recette of allRecettes) {
    const associations = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(moleculesRecettes)
      .where(eq(moleculesRecettes.recetteId, recette.id));
    
    if (associations[0]?.count === 0) {
      recettesWithoutMolecules.push(recette);
    }
  }
  
  return recettesWithoutMolecules;
}

// Récupérer les molécules par profil olfactif pour une gamme
export async function getMoleculesForGamme(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<Molecule[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Mots-clés par gamme
  const keywords: Record<string, string[]> = {
    volcanique: ['fumé', 'boisé', 'torréfié', 'grillé', 'cuir', 'goudron', 'brûlé', 'caramel'],
    glaciaire: ['frais', 'marin', 'ozone', 'menthe', 'agrume', 'citron', 'pin', 'conifère'],
    biolab: ['herbacé', 'terreux', 'houblon', 'épicé', 'poivre', 'boisé', 'lavande', 'floral'],
    petrichor: ['terre', 'pluie', 'minéral', 'racine', 'ambre', 'cèdre', 'mousse', 'humide'],
  };
  
  const gammeKeywords = keywords[gamme] || [];
  if (gammeKeywords.length === 0) return [];
  
  // Construire les conditions LIKE pour chaque mot-clé
  const allMolecules = await db.select().from(molecules);
  
  return allMolecules.filter(mol => {
    const profile = (mol.olfactiveProfile || '').toLowerCase();
    const name = mol.name.toLowerCase();
    return gammeKeywords.some(kw => profile.includes(kw) || name.includes(kw));
  });
}

// Enrichir automatiquement les associations pour une gamme
export async function enrichGammeAssociations(gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor'): Promise<{
  recettesProcessed: number;
  associationsCreated: number;
  moleculesUsed: string[];
}> {
  const db = await getDb();
  if (!db) return { recettesProcessed: 0, associationsCreated: 0, moleculesUsed: [] };
  
  // Récupérer les recettes sans associations
  const recettesToEnrich = await getRecettesWithoutMoleculesByGamme(gamme);
  
  // Récupérer les molécules appropriées pour cette gamme
  const gammeMolecules = await getMoleculesForGamme(gamme);
  
  if (gammeMolecules.length === 0) {
    console.log(`Aucune molécule trouvée pour la gamme ${gamme}`);
    return { recettesProcessed: 0, associationsCreated: 0, moleculesUsed: [] };
  }
  
  let associationsCreated = 0;
  const moleculesUsed = new Set<string>();
  
  for (const recette of recettesToEnrich) {
    // Sélectionner 3-5 molécules aléatoires pour cette recette
    const shuffled = [...gammeMolecules].sort(() => Math.random() - 0.5);
    const numMolecules = Math.min(shuffled.length, 3 + Math.floor(Math.random() * 3));
    
    for (let i = 0; i < numMolecules; i++) {
      const mol = shuffled[i];
      const proportion = 15 + Math.floor(Math.random() * 30); // 15-45%
      
      const success = await insertMoleculeRecetteAssociation(
        recette.id,
        mol.id,
        proportion,
        `Association ${gamme} auto-générée`
      );
      
      if (success) {
        associationsCreated++;
        moleculesUsed.add(mol.name);
      }
    }
  }
  
  return {
    recettesProcessed: recettesToEnrich.length,
    associationsCreated,
    moleculesUsed: Array.from(moleculesUsed),
  };
}


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


// ============================================================================
// HISTORIQUE DES MODIFICATIONS
// ============================================================================

export async function getModificationHistory(
  entityType: "prototype" | "molecule" | "accord" | "recette" | "famille" | "matiere" | "synergie" | "tradition",
  entityId: number,
  limit: number = 50
) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(modificationHistory)
    .where(and(
      eq(modificationHistory.entityType, entityType),
      eq(modificationHistory.entityId, entityId)
    ))
    .orderBy(desc(modificationHistory.createdAt))
    .limit(limit);
}

export async function getRecentModifications(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(modificationHistory)
    .orderBy(desc(modificationHistory.createdAt))
    .limit(limit);
}

export async function getModificationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select()
    .from(modificationHistory)
    .where(eq(modificationHistory.id, id))
    .limit(1);
  return results[0] || null;
}

export async function markModificationAsUndone(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(modificationHistory)
    .set({ 
      undoneAt: new Date(),
    })
    .where(eq(modificationHistory.id, id));
}

export async function recordModification(
  entityType: "prototype" | "molecule" | "accord" | "recette" | "famille" | "matiere" | "synergie" | "tradition",
  entityId: number,
  operation: "create" | "update" | "delete",
  stateBefore: any,
  stateAfter: any,
  userId: number = 1
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(modificationHistory).values({
    userId,
    entityType,
    entityId,
    operation,
    stateBefore: stateBefore ? JSON.stringify(stateBefore) : null,
    stateAfter: stateAfter ? JSON.stringify(stateAfter) : null,
    createdAt: new Date(),
  });
}


// ============================================================================
// SUPPLIERS (Fournisseurs)
// ============================================================================

/**
 * Get all suppliers
 */
export async function getAllSuppliers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(suppliers);
}

/**
 * Get supplier by ID
 */
export async function getSupplierById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select()
    .from(suppliers)
    .where(eq(suppliers.id, id))
    .limit(1);
  return results[0] || null;
}

/**
 * Get suppliers by country
 */
export async function getSuppliersByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(suppliers)
    .where(eq(suppliers.country, country));
}

/**
 * Get suppliers by region
 */
export async function getSuppliersByRegion(region: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(suppliers)
    .where(eq(suppliers.region, region));
}

/**
 * Create a new supplier
 */
export async function createSupplier(data: {
  name: string;
  companyName?: string;
  country: string;
  region?: string;
  email?: string;
  phone?: string;
  website?: string;
  specialties?: string[];
  description?: string;
  rating?: number;
  certifications?: string[];
  isPreferred?: boolean;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(suppliers).values({
    name: data.name,
    companyName: data.companyName,
    country: data.country,
    region: data.region,
    email: data.email,
    phone: data.phone,
    website: data.website,
    specialties: data.specialties ? JSON.stringify(data.specialties) : null,
    description: data.description,
    rating: data.rating,
    certifications: data.certifications ? JSON.stringify(data.certifications) : null,
    isPreferred: data.isPreferred ? 1 : 0,
    notes: data.notes,
  });
  return result;
}

/**
 * Update a supplier
 */
export async function updateSupplier(id: number, data: Partial<{
  name: string;
  companyName: string;
  country: string;
  region: string;
  email: string;
  phone: string;
  website: string;
  specialties: string[];
  description: string;
  rating: number;
  certifications: string[];
  isPreferred: boolean;
  notes: string;
}>) {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.specialties !== undefined) updateData.specialties = JSON.stringify(data.specialties);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.certifications !== undefined) updateData.certifications = JSON.stringify(data.certifications);
  if (data.isPreferred !== undefined) updateData.isPreferred = data.isPreferred ? 1 : 0;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(suppliers)
    .set(updateData)
    .where(eq(suppliers.id, id));
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .delete(suppliers)
    .where(eq(suppliers.id, id));
}

/**
 * Get supplier materials (link between supplier and molecules)
 */
export async function getSupplierMaterials(supplierId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select()
    .from(supplierMaterials)
    .where(eq(supplierMaterials.supplierId, supplierId));
}

/**
 * Add a material to a supplier
 */
export async function addSupplierMaterial(data: {
  supplierId: number;
  moleculeId: number;
  pricePerUnit?: number;
  currency?: string;
  minimumOrderQuantity?: number;
  unit?: string;
  leadTimeDays?: number;
  qualityGrade?: "standard" | "premium" | "extra_premium";
  isAvailable?: boolean;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(supplierMaterials).values({
    supplierId: data.supplierId,
    moleculeId: data.moleculeId,
    pricePerUnit: data.pricePerUnit ? String(data.pricePerUnit) : null,
    currency: data.currency || "USD",
    minimumOrderQuantity: data.minimumOrderQuantity,
    unit: data.unit,
    leadTimeDays: data.leadTimeDays,
    qualityGrade: data.qualityGrade || "standard",
    isAvailable: data.isAvailable !== false ? 1 : 0,
    notes: data.notes,
  });
  return result;
}


// ============================================================================
// FONCTIONS CREATE MANQUANTES (pour undo history)
// ============================================================================

export async function createAccord(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(accords).values({
    name: data.nom || data.name,
    familyId: data.familleId || data.familyId || null,
    olfactiveProfile: data.olfactiveProfile || data.description || null,
    notes: data.notes || null,
  });
  
  return result;
}

export async function createFamily(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(families).values({
    name: data.nom || data.name,
    type: data.type || "other",
    description: data.description || null,
  });
  
  return result;
}


// ============================================================================
// RECHERCHE RADICALE
// ============================================================================

export async function getAllRechercheRadicale() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rechercheRadicale);
}

export async function getRechercheRadicaleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(rechercheRadicale).where(eq(rechercheRadicale.id, id)).limit(1);
  return result[0] || null;
}

export async function getRechercheRadicaleBySerie(serie: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rechercheRadicale).where(eq(rechercheRadicale.serie, serie));
}


// ============================================================================
// SYNERGIES MOLÉCULAIRES (molecule_synergies)
// ============================================================================

/**
 * Récupère toutes les synergies moléculaires avec les noms des molécules
 */
export async function getAllMoleculeSynergies() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: moleculeSynergies.id,
      molecule1Id: moleculeSynergies.molecule1Id,
      molecule2Id: moleculeSynergies.molecule2Id,
      type: moleculeSynergies.type,
      description: moleculeSynergies.description,
      applications: moleculeSynergies.applications,
      molecule1Name: molecules.name,
      molecule2Name: sql<string>`m2.name`,
    })
    .from(moleculeSynergies)
    .leftJoin(molecules, eq(moleculeSynergies.molecule1Id, molecules.id))
    .leftJoin(sql`molecules m2`, sql`${moleculeSynergies.molecule2Id} = m2.id`)
    .orderBy(desc(moleculeSynergies.id));
  
  return result;
}

/**
 * Récupère les données pour le graphe D3.js des synergies moléculaires
 */
export async function getMoleculeSynergiesGraphData() {
  const db = await getDb();
  if (!db) return [];
  
  const synergies = await getAllMoleculeSynergies();
  
  return synergies.map((s) => ({
    id: s.id,
    molecule1Name: s.molecule1Name || `Molécule ${s.molecule1Id}`,
    molecule2Name: s.molecule2Name || `Molécule ${s.molecule2Id}`,
    effectType: s.type,
    description: s.description,
    applications: s.applications,
    intensity: 70, // Valeur par défaut pour l'épaisseur des liens
  }));
}


// ============================================================================
// SAVED FORMULAS (Historique des formules générées)
// ============================================================================

export async function saveFormula(data: InsertSavedFormula): Promise<SavedFormula> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(savedFormulas).values(data);
  const insertedId = Number(result[0].insertId);
  
  const saved = await getFormulaById(insertedId);
  
  if (!saved) throw new Error('Failed to retrieve saved formula');
  return saved;
}

export async function getFormulaHistory(userId: number): Promise<SavedFormula[]> {
  const db = await getDb();
  if (!db) return [];
  
  const formulas = await db.select().from(savedFormulas)
    .where(eq(savedFormulas.userId, userId))
    .orderBy(desc(savedFormulas.createdAt));
  
  return formulas;
}

export async function getFormulaById(id: number): Promise<SavedFormula | null> {
  const db = await getDb();
  if (!db) return null;
  
  const formulas = await db.select().from(savedFormulas)
    .where(eq(savedFormulas.id, id))
    .limit(1);
  
  return formulas[0] || null;
}

export async function deleteFormula(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(savedFormulas).where(eq(savedFormulas.id, id));
}

export async function updateFormulaNotes(id: number, notes: string): Promise<SavedFormula> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(savedFormulas).set({ notes }).where(eq(savedFormulas.id, id));
  
  const updated = await getFormulaById(id);
  if (!updated) throw new Error('Formula not found after update');
  
  return updated;
}

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


// ============================================================================
// CLIMATE STUDIES (Études climatiques)
// ============================================================================

export async function getAllClimateStudies() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(climateStudies);
}

export async function getClimateStudyById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(climateStudies).where(eq(climateStudies.id, id));
  return results[0] || null;
}

// ============================================================================
// MOLECULAR PROTOCOLS (Protocoles moléculaires)
// ============================================================================

export async function getAllMolecularProtocols() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecularProtocols);
}

export async function getMolecularProtocolById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(molecularProtocols).where(eq(molecularProtocols.id, id));
  return results[0] || null;
}

export async function getMolecularProtocolsByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecularProtocols).where(eq(molecularProtocols.linkedStudyId, studyId));
}

// ============================================================================
// FIELD ARCHIVES (Archives terrain)
// ============================================================================

export async function getAllFieldArchives() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(fieldArchives);
}

export async function getFieldArchiveById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(fieldArchives).where(eq(fieldArchives.id, id));
  return results[0] || null;
}

// ============================================================================
// EXTRACTION TESTS (Tests d'extraction)
// ============================================================================

export async function getAllExtractionTests() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(extractionTests);
}

export async function getExtractionTestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(extractionTests).where(eq(extractionTests.id, id));
  return results[0] || null;
}

export async function getExtractionTestsByArchiveId(archiveId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(extractionTests).where(eq(extractionTests.fieldArchiveId, archiveId));
}

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


// ============================================================================
// LEAF ECONOMIES (San Andrés / Seaflower Research)
// ============================================================================

export async function getAllLeafEconomies() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).orderBy(desc(leafEconomies.createdAt));
}

export async function getLeafEconomyById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(leafEconomies).where(eq(leafEconomies.id, id));
  return results[0] || null;
}

export async function getLeafEconomyBySampleId(sampleId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(leafEconomies).where(eq(leafEconomies.sampleId, sampleId));
  return results[0] || null;
}

export async function getLeafEconomiesByCategory(category: 'aromatique' | 'tabac' | 'cannabis') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.category, category)).orderBy(desc(leafEconomies.createdAt));
}

export async function getLeafEconomiesByIsland(island: 'san_andres' | 'providencia' | 'autre') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.island, island)).orderBy(desc(leafEconomies.createdAt));
}

export async function getLeafEconomiesByStatus(status: 'brut' | 'a_analyser' | 'analyse' | 'traduction' | 'archive') {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.status, status)).orderBy(desc(leafEconomies.createdAt));
}

export async function createLeafEconomy(data: InsertLeafEconomy) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(leafEconomies).values(data);
  const insertId = Number(result[0].insertId);
  return await getLeafEconomyById(insertId);
}

export async function updateLeafEconomy(id: number, data: Partial<InsertLeafEconomy>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(leafEconomies).set(data).where(eq(leafEconomies.id, id));
  return await getLeafEconomyById(id);
}

export async function deleteLeafEconomy(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(leafEconomies).where(eq(leafEconomies.id, id));
}

// Search leaf economies by species or variety
export async function searchLeafEconomies(searchTerm: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies)
    .where(
      or(
        like(leafEconomies.species, `%${searchTerm}%`),
        like(leafEconomies.claimedVariety, `%${searchTerm}%`),
        like(leafEconomies.sampleId, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(leafEconomies.createdAt));
}

// Get leaf economies with analysis available
export async function getLeafEconomiesWithAnalysis() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.analysisAvailable, 1)).orderBy(desc(leafEconomies.createdAt));
}

// Get leaf economies without analysis
export async function getLeafEconomiesWithoutAnalysis() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(leafEconomies).where(eq(leafEconomies.analysisAvailable, 0)).orderBy(desc(leafEconomies.createdAt));
}


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

// ============================================================================
// MOLECULE ORIGINS FUNCTIONS
// ============================================================================

export async function getMoleculeOrigins(moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    productionVolume: moleculeOrigins.productionVolume,
    priceRange: moleculeOrigins.priceRange,
    specificCharacteristics: moleculeOrigins.specificCharacteristics,
    notes: moleculeOrigins.notes,
    origin: geographicOrigins,
  })
    .from(moleculeOrigins)
    .innerJoin(geographicOrigins, eq(moleculeOrigins.originId, geographicOrigins.id))
    .where(eq(moleculeOrigins.moleculeId, moleculeId));
}

export async function getOriginMolecules(originId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    molecule: molecules,
  })
    .from(moleculeOrigins)
    .innerJoin(molecules, eq(moleculeOrigins.moleculeId, molecules.id))
    .where(eq(moleculeOrigins.originId, originId));
}

export async function addMoleculeOrigin(data: InsertMoleculeOrigin) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(moleculeOrigins).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateMoleculeOrigin(id: number, data: Partial<InsertMoleculeOrigin>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(moleculeOrigins).set(data).where(eq(moleculeOrigins.id, id));
}

export async function removeMoleculeOrigin(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(moleculeOrigins).where(eq(moleculeOrigins.id, id));
}

// ============================================================================
// IFRA RESTRICTIONS FUNCTIONS
// ============================================================================

export async function getMoleculeIfraRestrictions(moleculeId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const results = await db.select().from(ifraRestrictions).where(eq(ifraRestrictions.moleculeId, moleculeId));
  return results;
}

export async function getAllIfraRestrictions() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    restriction: ifraRestrictions,
    molecule: molecules,
  })
    .from(ifraRestrictions)
    .innerJoin(molecules, eq(ifraRestrictions.moleculeId, molecules.id))
    .orderBy(molecules.name);
}

export async function getRestrictedMolecules() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select({
    restriction: ifraRestrictions,
    molecule: molecules,
  })
    .from(ifraRestrictions)
    .innerJoin(molecules, eq(ifraRestrictions.moleculeId, molecules.id))
    .where(
      or(
        eq(ifraRestrictions.restrictionType, 'prohibited'),
        eq(ifraRestrictions.restrictionType, 'restricted')
      )
    )
    .orderBy(molecules.name);
}

export async function createIfraRestriction(data: InsertIfraRestriction) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(ifraRestrictions).values(data);
  return { id: Number(result[0].insertId), ...data };
}

export async function updateIfraRestriction(id: number, data: Partial<InsertIfraRestriction>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(ifraRestrictions).set(data).where(eq(ifraRestrictions.id, id));
}

export async function deleteIfraRestriction(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(ifraRestrictions).where(eq(ifraRestrictions.id, id));
}

// ============================================================================
// MOLECULE SCIENTIFIC DATA UPDATE
// ============================================================================

export async function updateMoleculeScientificData(id: number, data: {
  iupacName?: string;
  casNumber?: string;
  chemicalClass?: "terpene" | "sesquiterpene" | "diterpene" | "monoterpene" | "aldehyde" | "ketone" | "alcohol" | "ester" | "ether" | "phenol" | "lactone" | "coumarin" | "musk" | "nitrile" | "sulfur_compound" | "heterocyclic" | "aromatic" | "aliphatic" | "other";
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(molecules).set(data).where(eq(molecules.id, id));
  return await getMoleculeById(id);
}

export async function getMoleculesWithoutCas() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecules).where(isNull(molecules.casNumber)).orderBy(molecules.name);
}

export async function getMoleculesWithCas() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  return await db.select().from(molecules).where(isNotNull(molecules.casNumber)).orderBy(molecules.name);
}


// ============================================================================
// PLANTS (Plantes aromatiques)
// ============================================================================



export async function getAllPlants() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants).orderBy(plants.name);
}

export async function getPlantById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(plants).where(eq(plants.id, id));
  return result[0] || null;
}

export async function getPlantsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants).where(eq(plants.category, category as any)).orderBy(plants.name);
}

export async function getPlantByLatinName(latinName: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(plants).where(eq(plants.latinName, latinName));
  return result[0] || null;
}

export async function createPlant(data: InsertPlant) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(plants).values(data);
  const insertId = Number(result[0].insertId);
  return { id: insertId };
}

export async function updatePlant(id: number, data: Partial<InsertPlant>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(plants).set(data).where(eq(plants.id, id));
  return await getPlantById(id);
}

export async function deletePlant(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(plants).where(eq(plants.id, id));
}

// ============================================================================
// TERP PROFILES (Fiches interactives San Andrés)
// ============================================================================

export async function getAllTerpProfiles() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(terpProfiles).orderBy(terpProfiles.profileId);
}

export async function getTerpProfileById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(terpProfiles).where(eq(terpProfiles.id, id));
  return result[0] || null;
}

export async function getTerpProfileByProfileId(profileId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(terpProfiles).where(eq(terpProfiles.profileId, profileId));
  return result[0] || null;
}

export async function getTerpProfilesByClimaticAxis(axis: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(terpProfiles).where(eq(terpProfiles.climaticAxis, axis as any)).orderBy(terpProfiles.profileId);
}

export async function getTerpProfilesByUsage(usage: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(terpProfiles).where(eq(terpProfiles.usage, usage as any)).orderBy(terpProfiles.profileId);
}

export async function createTerpProfile(data: InsertTerpProfile) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(terpProfiles).values(data);
  return result;
}

export async function updateTerpProfile(id: number, data: Partial<InsertTerpProfile>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(terpProfiles).set(data).where(eq(terpProfiles.id, id));
  return await getTerpProfileById(id);
}

export async function deleteTerpProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(terpProfiles).where(eq(terpProfiles.id, id));
}

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

// ============================================================================
// RELATIONS: TerpProfiles <-> Plants
// ============================================================================

export async function getTerpProfilePlants(terpProfileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      plant: plants,
      notes: terpProfilePlants.notes,
    })
    .from(terpProfilePlants)
    .innerJoin(plants, eq(terpProfilePlants.plantId, plants.id))
    .where(eq(terpProfilePlants.terpProfileId, terpProfileId));
}

export async function addPlantToTerpProfile(terpProfileId: number, plantId: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(terpProfilePlants).values({ terpProfileId, plantId, notes });
}

// ============================================================================
// RELATIONS: TerpProfiles <-> Molecules
// ============================================================================

export async function getTerpProfileMolecules(terpProfileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      molecule: molecules,
      percentage: terpProfileMolecules.percentage,
      notes: terpProfileMolecules.notes,
    })
    .from(terpProfileMolecules)
    .innerJoin(molecules, eq(terpProfileMolecules.moleculeId, molecules.id))
    .where(eq(terpProfileMolecules.terpProfileId, terpProfileId));
}

export async function addMoleculeToTerpProfile(terpProfileId: number, moleculeId: number, percentage?: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.insert(terpProfileMolecules).values({ terpProfileId, moleculeId, percentage, notes });
}

// ============================================================================
// RELATIONS: Plants <-> Molecules
// ============================================================================

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
    percentageMin?: string;
    percentageMax?: string;
    percentageTypical?: string;
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


// ============================================================================
// POINT 3 ÉTENDU - HELPERS BOTANIQUES AVANCÉS
// ============================================================================

// Plant Varieties helpers
export async function getAllPlantVarieties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantVarieties).orderBy(plantVarieties.name);
}

export async function getPlantVarietiesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantVarieties).where(eq(plantVarieties.plantId, plantId));
}

export async function getPlantVarietyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(plantVarieties).where(eq(plantVarieties.id, id));
  return results[0] || null;
}

export async function createPlantVariety(data: InsertPlantVariety) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plantVarieties).values(data);
  return result;
}

export async function updatePlantVariety(id: number, data: Partial<InsertPlantVariety>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(plantVarieties).set(data).where(eq(plantVarieties.id, id));
}

export async function deletePlantVariety(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantVarieties).where(eq(plantVarieties.id, id));
}

export async function getPlantVarietiesCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(plantVarieties);
  return result[0]?.count || 0;
}

export async function getAllPlantsForSelect() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    category: plants.category,
  }).from(plants).orderBy(plants.name);
}

// Terroirs helpers
export async function getAllTerroirs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terroirs).orderBy(terroirs.name);
}

export async function getTerroirsByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terroirs).where(eq(terroirs.country, country));
}

export async function getTerroirById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(terroirs).where(eq(terroirs.id, id));
  return results[0] || null;
}

export async function createTerroir(data: InsertTerroir) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(terroirs).values(data);
  return result;
}

export async function updateTerroir(id: number, data: Partial<InsertTerroir>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(terroirs).set(data).where(eq(terroirs.id, id));
}

export async function deleteTerroir(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(terroirs).where(eq(terroirs.id, id));
}

// Extraction Methods helpers
export async function getAllExtractionMethods() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(extractionMethods).orderBy(extractionMethods.name);
}

export async function getExtractionMethodById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(extractionMethods).where(eq(extractionMethods.id, id));
  return results[0] || null;
}

export async function createExtractionMethod(data: InsertExtractionMethod) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(extractionMethods).values(data);
  return result;
}

export async function updateExtractionMethod(id: number, data: Partial<InsertExtractionMethod>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(extractionMethods).set(data).where(eq(extractionMethods.id, id));
}

export async function deleteExtractionMethod(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(extractionMethods).where(eq(extractionMethods.id, id));
}

// Plant Analyses helpers
export async function getAllPlantAnalyses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantAnalyses).orderBy(desc(plantAnalyses.analysisDate));
}

export async function getPlantAnalysesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantAnalyses).where(eq(plantAnalyses.plantId, plantId));
}

export async function getPlantAnalysisById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(plantAnalyses).where(eq(plantAnalyses.id, id));
  return results[0] || null;
}

export async function createPlantAnalysis(data: InsertPlantAnalysis) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plantAnalyses).values(data);
  return result;
}

export async function updatePlantAnalysis(id: number, data: Partial<InsertPlantAnalysis>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(plantAnalyses).set(data).where(eq(plantAnalyses.id, id));
}

export async function deletePlantAnalysis(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantAnalyses).where(eq(plantAnalyses.id, id));
}

// Plant Samples helpers
export async function getAllPlantSamples() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantSamples).orderBy(desc(plantSamples.createdAt));
}

export async function getPlantSamplesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantSamples).where(eq(plantSamples.plantId, plantId));
}

export async function getPlantSampleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(plantSamples).where(eq(plantSamples.id, id));
  return results[0] || null;
}

export async function createPlantSample(data: InsertPlantSample) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(plantSamples).values(data);
  return result;
}

export async function updatePlantSample(id: number, data: Partial<InsertPlantSample>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(plantSamples).set(data).where(eq(plantSamples.id, id));
}

export async function deletePlantSample(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantSamples).where(eq(plantSamples.id, id));
}

// Extended Suppliers helpers
export async function getAllExtendedSuppliers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(extendedSuppliers).orderBy(extendedSuppliers.name);
}

export async function getExtendedSupplierById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(extendedSuppliers).where(eq(extendedSuppliers.id, id));
  return results[0] || null;
}

export async function createExtendedSupplier(data: InsertExtendedSupplier) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(extendedSuppliers).values(data);
  return result;
}

export async function updateExtendedSupplier(id: number, data: Partial<InsertExtendedSupplier>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(extendedSuppliers).set(data).where(eq(extendedSuppliers.id, id));
}

export async function deleteExtendedSupplier(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(extendedSuppliers).where(eq(extendedSuppliers.id, id));
}

// Plant-Terroir relations helpers
export async function getPlantTerroirs(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantTerroirs).where(eq(plantTerroirs.plantId, plantId));
}

export async function getTerroirPlants(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantTerroirs).where(eq(plantTerroirs.terroirId, terroirId));
}

export async function addPlantTerroir(data: InsertPlantTerroir) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(plantTerroirs).values(data);
}

export async function removePlantTerroir(plantId: number, terroirId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantTerroirs)
    .where(and(eq(plantTerroirs.plantId, plantId), eq(plantTerroirs.terroirId, terroirId)));
}

// Plant-Extraction relations helpers
export async function getPlantExtractions(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plantExtractions).where(eq(plantExtractions.plantId, plantId));
}

export async function addPlantExtraction(data: InsertPlantExtraction) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(plantExtractions).values(data);
}

export async function removePlantExtraction(plantId: number, extractionMethodId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(plantExtractions)
    .where(and(eq(plantExtractions.plantId, plantId), eq(plantExtractions.extractionMethodId, extractionMethodId)));
}

// Advanced search helpers
export async function searchPlantsByMolecule(moleculeName: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plants)
    .where(sql`JSON_SEARCH(${plants.dominantMolecules}, 'one', ${`%${moleculeName}%`}) IS NOT NULL`);
}

export async function searchPlantsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  const terroirPlants = await db.select().from(plantTerroirs).where(eq(plantTerroirs.terroirId, terroirId));
  if (terroirPlants.length === 0) return [];
  const plantIds = terroirPlants.map(tp => tp.plantId);
  return db.select().from(plants).where(inArray(plants.id, plantIds));
}

export async function getPlantWithFullDetails(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const plant = await getPlantById(plantId);
  if (!plant) return null;
  
  const varieties = await getPlantVarietiesByPlant(plantId);
  const samples = await getPlantSamplesByPlant(plantId);
  const analyses = await getPlantAnalysesByPlant(plantId);
  const terroirRelations = await getPlantTerroirs(plantId);
  const extractionRelations = await getPlantExtractions(plantId);
  
  return {
    ...plant,
    varieties,
    samples,
    analyses,
    terroirs: terroirRelations,
    extractions: extractionRelations,
  };
}

// Statistics helpers
export async function getPlantStatistics() {
  const db = await getDb();
  if (!db) return null;
  
  const totalPlants = await db.select({ count: count() }).from(plants);
  const totalVarieties = await db.select({ count: count() }).from(plantVarieties);
  const totalTerroirs = await db.select({ count: count() }).from(terroirs);
  const totalSamples = await db.select({ count: count() }).from(plantSamples);
  const totalAnalyses = await db.select({ count: count() }).from(plantAnalyses);
  const totalSuppliers = await db.select({ count: count() }).from(extendedSuppliers);
  
  return {
    plants: totalPlants[0]?.count || 0,
    varieties: totalVarieties[0]?.count || 0,
    terroirs: totalTerroirs[0]?.count || 0,
    samples: totalSamples[0]?.count || 0,
    analyses: totalAnalyses[0]?.count || 0,
    suppliers: totalSuppliers[0]?.count || 0,
  };
}


// ============================================================================
// RAW MATERIALS (Matières premières)
// ============================================================================

export async function getAllRawMaterials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).orderBy(rawMaterials.name);
}

export async function getRawMaterialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(rawMaterials).where(eq(rawMaterials.id, id));
  return results[0] || null;
}

export async function getRawMaterialByMaterialId(materialId: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(rawMaterials).where(eq(rawMaterials.materialId, materialId));
  return results[0] || null;
}

export async function getRawMaterialsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).where(eq(rawMaterials.category, category as any)).orderBy(rawMaterials.name);
}

export async function getRawMaterialsByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).where(eq(rawMaterials.plantId, plantId)).orderBy(rawMaterials.name);
}

export async function getRawMaterialsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rawMaterials).where(eq(rawMaterials.terroirId, terroirId)).orderBy(rawMaterials.name);
}

export async function createRawMaterial(data: InsertRawMaterial) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  const result = await db.insert(rawMaterials).values(data);
  const insertId = Number(result[0].insertId);
  return { id: insertId };
}

export async function updateRawMaterial(id: number, data: Partial<InsertRawMaterial>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.update(rawMaterials).set(data).where(eq(rawMaterials.id, id));
  return await getRawMaterialById(id);
}

export async function deleteRawMaterial(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  await db.delete(rawMaterials).where(eq(rawMaterials.id, id));
}

// ============================================================================
// RAW MATERIAL MOLECULES (Liaison matière première <-> molécule)
// ============================================================================

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

// ============================================================================
// MOLECULE PLANT SOURCES (Sources botaniques des molécules)
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

// ============================================================================
// RECHERCHE AVANCÉE - Relations molécule-plante-terroir
// ============================================================================

export async function searchMoleculesByPlantSource(plantName: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      molecule: molecules,
      plant: plants,
      percentageInOil: moleculePlantSources.percentageInOil,
    })
    .from(moleculePlantSources)
    .innerJoin(molecules, eq(moleculePlantSources.moleculeId, molecules.id))
    .innerJoin(plants, eq(moleculePlantSources.plantId, plants.id))
    .where(like(plants.name, `%${plantName}%`))
    .orderBy(desc(moleculePlantSources.percentageInOil));
}

export async function searchRawMaterialsByMolecule(moleculeName: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      rawMaterial: rawMaterials,
      molecule: molecules,
      percentage: rawMaterialMolecules.percentage,
    })
    .from(rawMaterialMolecules)
    .innerJoin(rawMaterials, eq(rawMaterialMolecules.rawMaterialId, rawMaterials.id))
    .innerJoin(molecules, eq(rawMaterialMolecules.moleculeId, molecules.id))
    .where(like(molecules.name, `%${moleculeName}%`))
    .orderBy(desc(rawMaterialMolecules.percentage));
}

export async function getFullMoleculeProfile(moleculeId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const molecule = await getMoleculeById(moleculeId);
  if (!molecule) return null;
  
  const plantSources = await getMoleculePlantSources(moleculeId);
  const rawMaterialSources = await getMoleculeRawMaterials(moleculeId);
  const origins = await getMoleculeOrigins(moleculeId);
  const ifraRestrictions = await getMoleculeIfraRestrictions(moleculeId);
  
  return {
    molecule,
    plantSources,
    rawMaterialSources,
    origins,
    ifraRestrictions,
  };
}

export async function getFullPlantProfile(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const plant = await getPlantById(plantId);
  if (!plant) return null;
  
  const molecules = await getPlantMoleculeSources(plantId);
  const rawMaterials = await getRawMaterialsByPlant(plantId);
  const terroirs = await getPlantTerroirSpecialties(plantId);
  const varieties = await getPlantVarietiesByPlant(plantId);
  
  return {
    plant,
    molecules,
    rawMaterials,
    terroirs,
    varieties,
  };
}

export async function getFullTerroirProfile(terroirId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const terroir = await getTerroirById(terroirId);
  if (!terroir) return null;
  
  const specialties = await getTerroirSpecialties(terroirId);
  const rawMaterials = await getRawMaterialsByTerroir(terroirId);
  const plants = await getTerroirPlants(terroirId);
  
  return {
    terroir,
    specialties,
    rawMaterials,
    plants,
  };
}

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


// ============================================================================
// GRAPHE RÉSEAU MOLÉCULE-PLANTE-TERROIR
// ============================================================================

export async function getMoleculePlantTerroirNetwork() {
  const db = await getDb();
  if (!db) return { nodes: [], edges: [] };
  
  // Récupérer toutes les plantes avec leurs molécules
  const allPlants = await db.select().from(plants);
  
  // Récupérer toutes les molécules
  const allMolecules = await db.select().from(molecules);
  
  // Récupérer tous les terroirs
  const allTerroirs = await db.select().from(terroirs);
  
  // Récupérer les relations plante-molécule avec pourcentages
  const plantMoleculeRelations = await db
    .select({
      plantId: plantMolecules.plantId,
      moleculeId: plantMolecules.moleculeId,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
    })
    .from(plantMolecules);
  
  // Récupérer les relations terroir-plante via terroirSpecialties
  const terroirPlantRelations = await db
    .select({
      terroirId: terroirSpecialties.terroirId,
      plantId: terroirSpecialties.plantId,
      isSignature: terroirSpecialties.isSignature,
      importance: terroirSpecialties.importance,
    })
    .from(terroirSpecialties)
    .where(sql`${terroirSpecialties.plantId} IS NOT NULL`);
  
  // Récupérer les matières premières
  const allRawMaterials = await db.select().from(rawMaterials);
  
  return {
    entities: {
      plants: allPlants,
      molecules: allMolecules,
      terroirs: allTerroirs,
      rawMaterials: allRawMaterials,
    },
    relationships: {
      plantMolecules: plantMoleculeRelations,
      terroirPlants: terroirPlantRelations,
    },
  };
}

export async function getPlantMoleculesWithPercentages(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      molecule: molecules,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
      variabilityFactor: plantMolecules.variabilityFactor,
      source: plantMolecules.source,
    })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(eq(plantMolecules.plantId, plantId))
    .orderBy(desc(plantMolecules.isSignature), desc(plantMolecules.percentageTypical));
}

export async function getMoleculePlantsWithPercentages(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select({
      plant: plants,
      percentageMin: plantMolecules.percentageMin,
      percentageMax: plantMolecules.percentageMax,
      percentageTypical: plantMolecules.percentageTypical,
      isSignature: plantMolecules.isSignature,
      role: plantMolecules.role,
      variabilityFactor: plantMolecules.variabilityFactor,
      source: plantMolecules.source,
    })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .where(eq(plantMolecules.moleculeId, moleculeId))
    .orderBy(desc(plantMolecules.percentageTypical));
}


// ============================================================================
// CHEMOTYPES CRUD
// ============================================================================

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


// ============================================================================
// IFRA CATEGORIES FUNCTIONS
// ============================================================================

export async function getAllIfraCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ifraCategories).orderBy(ifraCategories.code);
}

export async function getIfraCategoryByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(ifraCategories).where(eq(ifraCategories.code, code));
  return result[0] || null;
}

/**
 * Calcule la limite IFRA pour une molécule dans un type de produit donné
 * @param moleculeId - ID de la molécule
 * @param categoryCode - Code de la catégorie IFRA (ex: "4" pour parfum fin)
 * @returns La limite en pourcentage ou null si pas de restriction
 */
export async function calculateIfraLimit(moleculeId: number, categoryCode: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [restriction] = await db.select()
    .from(ifraRestrictions)
    .where(eq(ifraRestrictions.moleculeId, moleculeId));
  
  if (!restriction) return { limit: null, type: 'no_restriction' as const };
  
  // Mapper le code de catégorie vers la colonne correspondante
  const categoryMap: Record<string, keyof typeof restriction> = {
    '1': 'category1',
    '2': 'category2',
    '3': 'category3',
    '4': 'category4',
    '5A': 'category5a',
    '5B': 'category5b',
    '5C': 'category5c',
    '5D': 'category5d',
    '6': 'category6',
    '7A': 'category7a',
    '7B': 'category7b',
    '8': 'category8',
    '9': 'category9',
    '10A': 'category10a',
    '10B': 'category10b',
    '11A': 'category11a',
    '11B': 'category11b',
  };
  
  const column = categoryMap[categoryCode.toUpperCase()];
  if (!column) return { limit: null, type: 'unknown_category' as const };
  
  const limit = restriction[column];
  
  return {
    limit: limit ? parseFloat(String(limit)) : null,
    type: restriction.restrictionType || 'no_restriction',
    reason: restriction.reasonForRestriction,
    alternatives: restriction.alternativeSuggestions,
    amendment: restriction.ifraAmendment,
  };
}

/**
 * Vérifie si une concentration donnée respecte les limites IFRA
 * @param moleculeId - ID de la molécule
 * @param categoryCode - Code de la catégorie IFRA
 * @param concentration - Concentration en pourcentage
 * @returns Objet avec le statut de conformité et les détails
 */
export async function checkIfraCompliance(
  moleculeId: number,
  categoryCode: string,
  concentration: number
) {
  const limitInfo = await calculateIfraLimit(moleculeId, categoryCode);
  
  if (!limitInfo || limitInfo.type === 'no_restriction') {
    return {
      compliant: true,
      message: 'Pas de restriction IFRA pour cette molécule',
      limit: null,
      concentration,
    };
  }
  
  if (limitInfo.type === 'prohibited') {
    return {
      compliant: false,
      message: 'Cette molécule est INTERDITE par l\'IFRA',
      limit: 0,
      concentration,
      reason: limitInfo.reason,
      alternatives: limitInfo.alternatives,
    };
  }
  
  if (limitInfo.limit === null) {
    return {
      compliant: true,
      message: 'Pas de limite spécifique pour cette catégorie',
      limit: null,
      concentration,
    };
  }
  
  const compliant = concentration <= limitInfo.limit;
  
  return {
    compliant,
    message: compliant
      ? `Concentration conforme (${concentration}% ≤ ${limitInfo.limit}%)`
      : `DÉPASSEMENT de la limite IFRA (${concentration}% > ${limitInfo.limit}%)`,
    limit: limitInfo.limit,
    concentration,
    margin: limitInfo.limit - concentration,
    marginPercent: ((limitInfo.limit - concentration) / limitInfo.limit) * 100,
    reason: limitInfo.reason,
    alternatives: limitInfo.alternatives,
    amendment: limitInfo.amendment,
  };
}

/**
 * Recherche les restrictions IFRA par nom de molécule
 */
export async function searchIfraRestrictionsByName(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    restriction: ifraRestrictions,
    molecule: molecules,
  })
    .from(ifraRestrictions)
    .innerJoin(molecules, eq(ifraRestrictions.moleculeId, molecules.id))
    .where(like(molecules.name, `%${searchTerm}%`))
    .orderBy(molecules.name);
}

/**
 * Obtient les statistiques IFRA
 */
export async function getIfraStats() {
  const db = await getDb();
  if (!db) return null;
  
  const all = await db.select().from(ifraRestrictions);
  
  const prohibited = all.filter(r => r.restrictionType === 'prohibited').length;
  const restricted = all.filter(r => r.restrictionType === 'restricted').length;
  const specification = all.filter(r => r.restrictionType === 'specification').length;
  const noRestriction = all.filter(r => r.restrictionType === 'no_restriction').length;
  
  return {
    total: all.length,
    prohibited,
    restricted,
    specification,
    noRestriction,
  };
}


// ============================================================================
// PLANT IMAGES FUNCTIONS
// ============================================================================

/**
 * Met à jour l'URL de l'image d'une plante
 */
export async function updatePlantImage(plantId: number, imageUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(plants)
    .set({ imageUrl })
    .where(eq(plants.id, plantId));
  
  return getPlantById(plantId);
}

/**
 * Supprime l'image d'une plante
 */
export async function deletePlantImage(plantId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(plants)
    .set({ imageUrl: null })
    .where(eq(plants.id, plantId));
  
  return getPlantById(plantId);
}

/**
 * Récupère toutes les plantes avec leurs images
 */
export async function getPlantsWithImages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(plants)
    .where(sql`${plants.imageUrl} IS NOT NULL AND ${plants.imageUrl} != ''`)
    .orderBy(plants.name);
}

/**
 * Récupère les plantes sans images (pour suggérer l'ajout)
 */
export async function getPlantsWithoutImages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(plants)
    .where(sql`${plants.imageUrl} IS NULL OR ${plants.imageUrl} = ''`)
    .orderBy(plants.name);
}


// ============================================================================
// SAMPLE IMAGES FUNCTIONS (Galerie d'images)
// ============================================================================

/**
 * Récupère toutes les images de la galerie
 */
export async function getAllSampleImages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère les images par catégorie
 */
export async function getSampleImagesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .where(eq(sampleImages.category, category as any))
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère les images d'un échantillon leaf_economy
 */
export async function getSampleImagesByLeafEconomy(leafEconomyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .where(eq(sampleImages.leafEconomyId, leafEconomyId))
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère les images d'une plante
 */
export async function getSampleImagesByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sampleImages)
    .where(eq(sampleImages.plantId, plantId))
    .orderBy(desc(sampleImages.createdAt));
}

/**
 * Récupère une image par son ID
 */
export async function getSampleImageById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select()
    .from(sampleImages)
    .where(eq(sampleImages.id, id))
    .limit(1);
  
  return results[0] || null;
}

/**
 * Crée une nouvelle image dans la galerie
 */
export async function createSampleImage(data: InsertSampleImage) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const result = await db.insert(sampleImages).values(data);
  const insertId = Number(result[0].insertId);
  return await getSampleImageById(insertId);
}

/**
 * Met à jour une image
 */
export async function updateSampleImage(id: number, data: Partial<InsertSampleImage>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(sampleImages).set(data).where(eq(sampleImages.id, id));
  return await getSampleImageById(id);
}

/**
 * Supprime une image
 */
export async function deleteSampleImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.delete(sampleImages).where(eq(sampleImages.id, id));
}

/**
 * Recherche des images par tags
 */
export async function searchSampleImagesByTags(tags: string[]) {
  const db = await getDb();
  if (!db) return [];
  
  // Recherche les images qui contiennent au moins un des tags
  const results = await db.select()
    .from(sampleImages)
    .orderBy(desc(sampleImages.createdAt));
  
  // Filtrage côté application car JSON search est complexe en MySQL
  return results.filter(img => {
    if (!img.tags) return false;
    const imgTags = img.tags as string[];
    return tags.some(tag => imgTags.includes(tag));
  });
}

/**
 * Récupère les statistiques de la galerie
 */
export async function getSampleImagesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: {} };
  
  const allImages = await db.select().from(sampleImages);
  
  const byCategory: Record<string, number> = {};
  allImages.forEach(img => {
    const cat = img.category || 'autre';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });
  
  return {
    total: allImages.length,
    byCategory,
  };
}


// ============================================================================
// GEOGRAPHIC ORIGINS WITH MOLECULE COUNT
// ============================================================================

/**
 * Récupère toutes les origines géographiques avec le nombre de molécules associées
 */
export async function getAllGeographicOriginsWithMoleculeCount() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const origins = await db.select().from(geographicOrigins).orderBy(geographicOrigins.country, geographicOrigins.name);
  
  // Récupérer le comptage des molécules pour chaque origine
  const moleculeCounts = await db.select({
    originId: moleculeOrigins.originId,
    count: sql<number>`COUNT(*)`.as('count'),
  })
    .from(moleculeOrigins)
    .groupBy(moleculeOrigins.originId);
  
  // Créer une map pour un accès rapide
  const countMap = new Map(moleculeCounts.map(mc => [mc.originId, mc.count]));
  
  // Enrichir les origines avec le comptage
  return origins.map(origin => ({
    ...origin,
    moleculeCount: countMap.get(origin.id) || 0,
  }));
}

/**
 * Récupère les molécules d'une origine avec leurs détails complets
 */
export async function getOriginMoleculesWithDetails(originId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select({
    id: moleculeOrigins.id,
    moleculeId: moleculeOrigins.moleculeId,
    originId: moleculeOrigins.originId,
    isPrimaryOrigin: moleculeOrigins.isPrimaryOrigin,
    qualityRating: moleculeOrigins.qualityRating,
    productionVolume: moleculeOrigins.productionVolume,
    priceRange: moleculeOrigins.priceRange,
    specificCharacteristics: moleculeOrigins.specificCharacteristics,
    notes: moleculeOrigins.notes,
    molecule: {
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalFormula: molecules.chemicalFormula,
      olfactiveProfile: molecules.olfactiveProfile,
      casNumber: molecules.casNumber,
      iupacName: molecules.iupacName,
      chemicalClass: molecules.chemicalClass,
    },
  })
    .from(moleculeOrigins)
    .innerJoin(molecules, eq(moleculeOrigins.moleculeId, molecules.id))
    .where(eq(moleculeOrigins.originId, originId))
    .orderBy(molecules.name);
}

/**
 * Recherche les origines par nom de molécule
 */
export async function searchOriginsByMoleculeName(moleculeName: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Trouver les molécules correspondantes
  const matchingMolecules = await db.select({ id: molecules.id })
    .from(molecules)
    .where(like(molecules.name, `%${moleculeName}%`));
  
  if (matchingMolecules.length === 0) return [];
  
  const moleculeIds = matchingMolecules.map(m => m.id);
  
  // Trouver les origines liées à ces molécules
  const originIds = await db.select({ originId: moleculeOrigins.originId })
    .from(moleculeOrigins)
    .where(inArray(moleculeOrigins.moleculeId, moleculeIds));
  
  if (originIds.length === 0) return [];
  
  const uniqueOriginIds = Array.from(new Set(originIds.map(o => o.originId)));
  
  // Récupérer les origines avec le comptage
  const origins = await db.select().from(geographicOrigins)
    .where(inArray(geographicOrigins.id, uniqueOriginIds))
    .orderBy(geographicOrigins.name);
  
  // Ajouter le comptage des molécules correspondantes
  return origins.map(origin => {
    const count = originIds.filter(o => o.originId === origin.id).length;
    return { ...origin, matchingMoleculeCount: count };
  });
}


// ============================================================================
// PLANT VARIETIES - EXTENDED FUNCTIONS (Conservation Status, Filtering)
// ============================================================================

/**
 * Récupère toutes les variétés avec filtres avancés
 */
export async function getPlantVarietiesWithFilters(filters: {
  plantCategory?: string;
  varietyType?: string;
  conservationStatus?: string;
  countryOfOrigin?: string;
  searchQuery?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .$dynamic();
  
  const conditions: any[] = [];
  
  if (filters.plantCategory) {
    conditions.push(eq(plants.category, filters.plantCategory as any));
  }
  
  if (filters.varietyType) {
    conditions.push(eq(plantVarieties.varietyType, filters.varietyType as any));
  }
  
  if (filters.conservationStatus) {
    conditions.push(eq(plantVarieties.conservationStatus, filters.conservationStatus as any));
  }
  
  if (filters.countryOfOrigin) {
    conditions.push(eq(plantVarieties.countryOfOrigin, filters.countryOfOrigin));
  }
  
  if (filters.searchQuery) {
    conditions.push(
      or(
        like(plantVarieties.name, `%${filters.searchQuery}%`),
        like(plantVarieties.latinName, `%${filters.searchQuery}%`),
        like(plants.name, `%${filters.searchQuery}%`)
      )!
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  return query.orderBy(plantVarieties.name);
}

/**
 * Récupère les variétés en danger critique
 */
export async function getCriticalVarieties() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(
      or(
        eq(plantVarieties.conservationStatus, 'critical'),
        eq(plantVarieties.conservationStatus, 'endangered')
      )
    )
    .orderBy(plantVarieties.conservationStatus, plantVarieties.name);
}

/**
 * Récupère les statistiques de conservation
 */
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
export async function getVarietyWithMolecules(varietyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Récupérer la variété
  const varietyResult = await db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(eq(plantVarieties.id, varietyId));
  
  if (varietyResult.length === 0) return null;
  
  const variety = varietyResult[0];
  
  // Récupérer les molécules liées à la plante parente
  const moleculesResult = await db.select({
    molecule: molecules,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(eq(plantMolecules.plantId, variety.variety.plantId));
  
  return {
    ...variety,
    molecules: moleculesResult,
  };
}

/**
 * Récupère les variétés par type (landrace, cultivar, etc.)
 */
export async function getVarietiesByType(varietyType: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .leftJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(eq(plantVarieties.varietyType, varietyType as any))
    .orderBy(plantVarieties.name);
}

/**
 * Récupère les landraces de cannabis
 */
export async function getCannabisLandraces() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .innerJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(
      and(
        eq(plants.category, 'cannabis'),
        eq(plantVarieties.varietyType, 'landrace')
      )
    )
    .orderBy(plantVarieties.name);
}

/**
 * Récupère les variétés de tabac
 */
export async function getTobaccoVarieties() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    variety: plantVarieties,
    plant: plants,
  })
    .from(plantVarieties)
    .innerJoin(plants, eq(plantVarieties.plantId, plants.id))
    .where(eq(plants.category, 'tabac'))
    .orderBy(plantVarieties.name);
}

// ============================================================================
// PLANT-MOLECULE LINKS - EXTENDED FUNCTIONS
// ============================================================================

/**
 * Récupère toutes les liaisons plantes-molécules avec détails
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
export async function getPlantsByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    plant: plants,
    percentageMin: plantMolecules.percentageMin,
    percentageMax: plantMolecules.percentageMax,
    percentageTypical: plantMolecules.percentageTypical,
    isSignature: plantMolecules.isSignature,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(plants, eq(plantMolecules.plantId, plants.id))
    .where(eq(plantMolecules.moleculeId, moleculeId))
    .orderBy(desc(plantMolecules.percentageTypical));
}

/**
 * Récupère les molécules signatures d'une plante
 */
export async function getSignatureMolecules(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    molecule: molecules,
    percentageTypical: plantMolecules.percentageTypical,
    role: plantMolecules.role,
  })
    .from(plantMolecules)
    .innerJoin(molecules, eq(plantMolecules.moleculeId, molecules.id))
    .where(
      and(
        eq(plantMolecules.plantId, plantId),
        eq(plantMolecules.isSignature, 1)
      )
    )
    .orderBy(desc(plantMolecules.percentageTypical));
}

/**
 * Crée une liaison plante-molécule
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
    percentageMin: data.percentageMin?.toString(),
    percentageMax: data.percentageMax?.toString(),
    percentageTypical: data.percentageTypical?.toString(),
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
 * Met à jour le statut de conservation d'une variété
 */
export async function updateVarietyConservationStatus(
  varietyId: number,
  data: {
    conservationStatus?: string;
    conservationNotes?: string;
    threatFactors?: string[];
    conservationEfforts?: string;
  }
) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(plantVarieties)
    .set({
      conservationStatus: data.conservationStatus as any,
      conservationNotes: data.conservationNotes,
      threatFactors: data.threatFactors,
      conservationEfforts: data.conservationEfforts,
      lastAssessmentDate: new Date(),
    })
    .where(eq(plantVarieties.id, varietyId));
  
  return getPlantVarietyById(varietyId);
}

/**
 * Récupère les pays d'origine uniques des variétés
 */
export async function getUniqueVarietyCountries() {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db.selectDistinct({ country: plantVarieties.countryOfOrigin })
    .from(plantVarieties)
    .where(sql`${plantVarieties.countryOfOrigin} IS NOT NULL AND ${plantVarieties.countryOfOrigin} != ''`)
    .orderBy(plantVarieties.countryOfOrigin);
  
  return results.map(r => r.country).filter(Boolean) as string[];
}


// ============================================================================
// TOBACCO-CANNABIS-PERFUME INTERACTIONS
// ============================================================================

import { 
  molecularInteractions, 
  MolecularInteraction, 
  InsertMolecularInteraction,
  aromaticAccords,
  AromaticAccord,
  InsertAromaticAccord,
  terpeneComparisonProfiles,
  TerpeneComparisonProfile,
  InsertTerpeneComparisonProfile,
  formulationSuggestions,
  FormulationSuggestion,
  InsertFormulationSuggestion,
  entourageRules,
  EntourageRule,
  InsertEntourageRule
} from "../drizzle/schema";

// Molecular Interactions
export async function getAllMolecularInteractions(): Promise<MolecularInteraction[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(molecularInteractions).orderBy(molecularInteractions.name);
}

export async function getMolecularInteractionById(id: number): Promise<MolecularInteraction | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(molecularInteractions).where(eq(molecularInteractions.id, id));
  return results[0] || null;
}

export async function getMolecularInteractionsByCategory(category: string): Promise<MolecularInteraction[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(molecularInteractions)
    .where(eq(molecularInteractions.sourceCategory, category as any))
    .orderBy(molecularInteractions.name);
}

export async function getMolecularInteractionsBySynergyType(synergyType: string): Promise<MolecularInteraction[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(molecularInteractions)
    .where(eq(molecularInteractions.synergyType, synergyType as any))
    .orderBy(molecularInteractions.name);
}

export async function createMolecularInteraction(data: InsertMolecularInteraction): Promise<MolecularInteraction | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(molecularInteractions).values(data);
  const inserted = await db.select().from(molecularInteractions).where(eq(molecularInteractions.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateMolecularInteraction(id: number, data: Partial<InsertMolecularInteraction>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(molecularInteractions).set(data).where(eq(molecularInteractions.id, id));
}

export async function deleteMolecularInteraction(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(molecularInteractions).where(eq(molecularInteractions.id, id));
}

// Aromatic Accords
export async function getAllAromaticAccords(): Promise<AromaticAccord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aromaticAccords).orderBy(aromaticAccords.name);
}

export async function getAromaticAccordById(id: number): Promise<AromaticAccord | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(aromaticAccords).where(eq(aromaticAccords.id, id));
  return results[0] || null;
}

export async function getAromaticAccordsByCategory(category: string): Promise<AromaticAccord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aromaticAccords)
    .where(eq(aromaticAccords.category, category as any))
    .orderBy(aromaticAccords.name);
}

export async function createAromaticAccord(data: InsertAromaticAccord): Promise<AromaticAccord | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(aromaticAccords).values(data);
  const inserted = await db.select().from(aromaticAccords).where(eq(aromaticAccords.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateAromaticAccord(id: number, data: Partial<InsertAromaticAccord>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(aromaticAccords).set(data).where(eq(aromaticAccords.id, id));
}

export async function deleteAromaticAccord(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(aromaticAccords).where(eq(aromaticAccords.id, id));
}

// Terpene Comparison Profiles
export async function getAllTerpeneComparisonProfiles(): Promise<TerpeneComparisonProfile[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terpeneComparisonProfiles).orderBy(terpeneComparisonProfiles.name);
}

export async function getTerpeneComparisonProfileById(id: number): Promise<TerpeneComparisonProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(terpeneComparisonProfiles).where(eq(terpeneComparisonProfiles.id, id));
  return results[0] || null;
}

export async function getTerpeneComparisonProfilesBySource(sourceType: string): Promise<TerpeneComparisonProfile[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(terpeneComparisonProfiles)
    .where(eq(terpeneComparisonProfiles.sourceType, sourceType as any))
    .orderBy(terpeneComparisonProfiles.name);
}

export async function createTerpeneComparisonProfile(data: InsertTerpeneComparisonProfile): Promise<TerpeneComparisonProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(terpeneComparisonProfiles).values(data);
  const inserted = await db.select().from(terpeneComparisonProfiles).where(eq(terpeneComparisonProfiles.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateTerpeneComparisonProfile(id: number, data: Partial<InsertTerpeneComparisonProfile>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(terpeneComparisonProfiles).set(data).where(eq(terpeneComparisonProfiles.id, id));
}

export async function deleteTerpeneComparisonProfile(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(terpeneComparisonProfiles).where(eq(terpeneComparisonProfiles.id, id));
}

// Formulation Suggestions
export async function getAllFormulationSuggestions(): Promise<FormulationSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(formulationSuggestions).orderBy(formulationSuggestions.name);
}

export async function getFormulationSuggestionById(id: number): Promise<FormulationSuggestion | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(formulationSuggestions).where(eq(formulationSuggestions.id, id));
  return results[0] || null;
}

export async function getFormulationSuggestionsByType(formulationType: string): Promise<FormulationSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(formulationSuggestions)
    .where(eq(formulationSuggestions.formulationType, formulationType as any))
    .orderBy(formulationSuggestions.name);
}

export async function getFormulationSuggestionsByBaseMolecule(moleculeId: number): Promise<FormulationSuggestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(formulationSuggestions)
    .where(eq(formulationSuggestions.baseMoleculeId, moleculeId))
    .orderBy(formulationSuggestions.name);
}

export async function createFormulationSuggestion(data: InsertFormulationSuggestion): Promise<FormulationSuggestion | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(formulationSuggestions).values(data);
  const inserted = await db.select().from(formulationSuggestions).where(eq(formulationSuggestions.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateFormulationSuggestion(id: number, data: Partial<InsertFormulationSuggestion>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(formulationSuggestions).set(data).where(eq(formulationSuggestions.id, id));
}

export async function deleteFormulationSuggestion(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(formulationSuggestions).where(eq(formulationSuggestions.id, id));
}

// Entourage Rules
export async function getAllEntourageRules(): Promise<EntourageRule[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(entourageRules).orderBy(entourageRules.name);
}

export async function getEntourageRuleById(id: number): Promise<EntourageRule | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(entourageRules).where(eq(entourageRules.id, id));
  return results[0] || null;
}

export async function getEntourageRulesByType(ruleType: string): Promise<EntourageRule[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(entourageRules)
    .where(eq(entourageRules.ruleType, ruleType as any))
    .orderBy(entourageRules.name);
}

export async function createEntourageRule(data: InsertEntourageRule): Promise<EntourageRule | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(entourageRules).values(data);
  const inserted = await db.select().from(entourageRules).where(eq(entourageRules.id, Number(result[0].insertId)));
  return inserted[0] || null;
}

export async function updateEntourageRule(id: number, data: Partial<InsertEntourageRule>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(entourageRules).set(data).where(eq(entourageRules.id, id));
}

export async function deleteEntourageRule(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(entourageRules).where(eq(entourageRules.id, id));
}

// Generate formulation suggestions based on synergies
export async function generateFormulationSuggestions(baseMoleculeId: number): Promise<{
  baseMolecule: Molecule | null;
  suggestions: Array<{
    molecule: Molecule;
    synergyType: string;
    compatibilityScore: number;
    reason: string;
  }>;
}> {
  const db = await getDb();
  if (!db) return { baseMolecule: null, suggestions: [] };
  
  // Get base molecule
  const baseMolecule = await getMoleculeById(baseMoleculeId);
  if (!baseMolecule) return { baseMolecule: null, suggestions: [] };
  
  // Get all terpene synergies involving this molecule
  const synergies1 = await db.select().from(terpeneSynergies)
    .where(eq(terpeneSynergies.terpene1Id, baseMoleculeId));
  const synergies2 = await db.select().from(terpeneSynergies)
    .where(eq(terpeneSynergies.terpene2Id, baseMoleculeId));
  
  // Get all molecule synergies involving this molecule
  const molSynergies1 = await db.select().from(moleculeSynergies)
    .where(eq(moleculeSynergies.molecule1Id, baseMoleculeId));
  const molSynergies2 = await db.select().from(moleculeSynergies)
    .where(eq(moleculeSynergies.molecule2Id, baseMoleculeId));
  
  const suggestions: Array<{
    molecule: Molecule;
    synergyType: string;
    compatibilityScore: number;
    reason: string;
  }> = [];
  
  // Process terpene synergies
  for (const syn of synergies1) {
    const mol = await getMoleculeById(syn.terpene2Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: 'terpene',
        compatibilityScore: syn.compatibilityScore,
        reason: syn.synergyNotes || 'Synergie terpénique documentée'
      });
    }
  }
  for (const syn of synergies2) {
    const mol = await getMoleculeById(syn.terpene1Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: 'terpene',
        compatibilityScore: syn.compatibilityScore,
        reason: syn.synergyNotes || 'Synergie terpénique documentée'
      });
    }
  }
  
  // Process molecule synergies
  for (const syn of molSynergies1) {
    const mol = await getMoleculeById(syn.molecule2Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: syn.type,
        compatibilityScore: 75, // Default score for molecule synergies
        reason: syn.description
      });
    }
  }
  for (const syn of molSynergies2) {
    const mol = await getMoleculeById(syn.molecule1Id);
    if (mol) {
      suggestions.push({
        molecule: mol,
        synergyType: syn.type,
        compatibilityScore: 75,
        reason: syn.description
      });
    }
  }
  
  // Sort by compatibility score
  suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  return { baseMolecule, suggestions };
}

// Get terpene comparison data for radar chart
export async function getTerpeneComparisonData(profileIds: number[]): Promise<{
  profiles: TerpeneComparisonProfile[];
  terpenes: string[];
  data: Array<{
    profileId: number;
    profileName: string;
    sourceType: string;
    values: Record<string, number>;
  }>;
}> {
  const db = await getDb();
  if (!db) return { profiles: [], terpenes: [], data: [] };
  
  const profiles: TerpeneComparisonProfile[] = [];
  for (const id of profileIds) {
    const profile = await getTerpeneComparisonProfileById(id);
    if (profile) profiles.push(profile);
  }
  
  const terpenes = ['myrcene', 'limonene', 'pinene', 'linalool', 'caryophyllene', 'humulene', 'terpinolene', 'ocimene', 'bisabolol', 'geraniol'];
  
  const data = profiles.map(p => ({
    profileId: p.id,
    profileName: p.name,
    sourceType: p.sourceType,
    values: {
      myrcene: p.myrcene || 0,
      limonene: p.limonene || 0,
      pinene: p.pinene || 0,
      linalool: p.linalool || 0,
      caryophyllene: p.caryophyllene || 0,
      humulene: p.humulene || 0,
      terpinolene: p.terpinolene || 0,
      ocimene: p.ocimene || 0,
      bisabolol: p.bisabolol || 0,
      geraniol: p.geraniol || 0,
    }
  }));
  
  return { profiles, terpenes, data };
}

// Get interactions graph data for visualization
export async function getInteractionsGraphData(): Promise<{
  nodes: Array<{ id: string; name: string; type: 'tabac' | 'cannabis' | 'parfum' | 'interaction' }>;
  edges: Array<{ source: string; target: string; synergyType: string; score: number }>;
}> {
  const db = await getDb();
  if (!db) return { nodes: [], edges: [] };
  
  const interactions = await getAllMolecularInteractions();
  const nodesMap = new Map<string, { id: string; name: string; type: 'tabac' | 'cannabis' | 'parfum' | 'interaction' }>();
  const edges: Array<{ source: string; target: string; synergyType: string; score: number }> = [];
  
  for (const interaction of interactions) {
    // Add interaction as a node
    const interactionNodeId = `int-${interaction.id}`;
    nodesMap.set(interactionNodeId, {
      id: interactionNodeId,
      name: interaction.name,
      type: 'interaction'
    });
    
    // Add molecule nodes and edges
    if (interaction.molecule1Id) {
      const mol = await getMoleculeById(interaction.molecule1Id);
      if (mol) {
        const molNodeId = `mol-${mol.id}`;
        nodesMap.set(molNodeId, {
          id: molNodeId,
          name: mol.name,
          type: 'parfum'
        });
        edges.push({
          source: molNodeId,
          target: interactionNodeId,
          synergyType: interaction.synergyType,
          score: interaction.compatibilityScore
        });
      }
    }
    
    if (interaction.molecule2Id) {
      const mol = await getMoleculeById(interaction.molecule2Id);
      if (mol) {
        const molNodeId = `mol-${mol.id}`;
        nodesMap.set(molNodeId, {
          id: molNodeId,
          name: mol.name,
          type: 'parfum'
        });
        edges.push({
          source: molNodeId,
          target: interactionNodeId,
          synergyType: interaction.synergyType,
          score: interaction.compatibilityScore
        });
      }
    }
    
    if (interaction.molecule3Id) {
      const mol = await getMoleculeById(interaction.molecule3Id);
      if (mol) {
        const molNodeId = `mol-${mol.id}`;
        nodesMap.set(molNodeId, {
          id: molNodeId,
          name: mol.name,
          type: 'parfum'
        });
        edges.push({
          source: molNodeId,
          target: interactionNodeId,
          synergyType: interaction.synergyType,
          score: interaction.compatibilityScore
        });
      }
    }
  }
  
  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
}

// ============================================================================
// OLFACTIVE ARCHIVES HELPERS
// ============================================================================

export async function listOlfactiveArchives(filters: {
  civilization?: string;
  type?: string;
  period?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const { civilization, type, q, limit = 25, offset = 0 } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(olfactiveArchives);
  
  const conditions = [];
  if (civilization) {
    conditions.push(eq(olfactiveArchives.civilization, civilization));
  }
  if (type) {
    conditions.push(eq(olfactiveArchives.type, type as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const results = await query.limit(limit).offset(offset);
  
  // Filter by search query if provided (simple text search)
  if (q) {
    const searchLower = q.toLowerCase();
    return results.filter(archive => 
      archive.title?.toLowerCase().includes(searchLower) ||
      archive.description?.toLowerCase().includes(searchLower) ||
      archive.civilization?.toLowerCase().includes(searchLower)
    );
  }
  
  return results;
}

export async function getOlfactiveArchiveById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [archive] = await db
    .select()
    .from(olfactiveArchives)
    .where(eq(olfactiveArchives.id, id));
  return archive;
}

export async function createOlfactiveArchive(data: InsertOlfactiveArchive) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(olfactiveArchives).values(data);
  return getOlfactiveArchiveById(result.insertId);
}

export async function updateOlfactiveArchive(id: number, data: Partial<InsertOlfactiveArchive>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(olfactiveArchives)
    .set(data)
    .where(eq(olfactiveArchives.id, id));
  return getOlfactiveArchiveById(id);
}

export async function deleteOlfactiveArchive(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(olfactiveArchives).where(eq(olfactiveArchives.id, id));
  return { success: true };
}

export async function searchOlfactiveArchives(searchQuery: string, limit: number = 25) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(olfactiveArchives).limit(limit);
  const searchLower = searchQuery.toLowerCase();
  return results.filter(archive => 
    archive.title?.toLowerCase().includes(searchLower) ||
    archive.description?.toLowerCase().includes(searchLower) ||
    archive.civilization?.toLowerCase().includes(searchLower) ||
    archive.provenance?.toLowerCase().includes(searchLower)
  );
}

// ============================================================================
// CIVILIZATIONAL MARKERS HELPERS
// ============================================================================

export async function listCivilizationalMarkers(filters: {
  civilization?: string;
  period?: string;
  usageType?: string;
  plantId?: number;
}) {
  const { civilization, period, usageType, plantId } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(civilizationalMarkers);
  
  const conditions = [];
  if (civilization) {
    conditions.push(eq(civilizationalMarkers.civilization, civilization));
  }
  if (period) {
    conditions.push(eq(civilizationalMarkers.period, period));
  }
  if (usageType) {
    conditions.push(eq(civilizationalMarkers.usageType, usageType as any));
  }
  if (plantId) {
    conditions.push(eq(civilizationalMarkers.plantId, plantId));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query;
}

export async function getCivilizationalMarkersByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.plantId, plantId));
}

export async function getCivilizationalMarkersByCivilization(civilization: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.civilization, civilization));
}

export async function getCivilizationalMarkersByPeriod(period: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.period, period));
}

export async function createCivilizationalMarker(data: InsertCivilizationalMarker) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(civilizationalMarkers).values(data);
  const [marker] = await db
    .select()
    .from(civilizationalMarkers)
    .where(eq(civilizationalMarkers.id, result.insertId));
  return marker;
}

// ============================================================================
// VARIETY GENEALOGY HELPERS
// ============================================================================

export async function getVarietyGenealogyTree(varietyId: number) {
  const db = await getDb();
  if (!db) return { parents: [], children: [] };
  // Get all relationships for this variety (as child or parent)
  const asChild = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.varietyId, varietyId));
  
  const asParent = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.parentVarietyId, varietyId));
  
  return {
    parents: asChild,
    children: asParent
  };
}

export async function getVarietyAncestors(varietyId: number, depth: number = 5) {
  const db = await getDb();
  if (!db) return [];
  const ancestors = [];
  let currentIds = [varietyId];
  
  for (let i = 0; i < depth; i++) {
    if (currentIds.length === 0) break;
    
    const parents = await db
      .select()
      .from(varietyGenealogy)
      .where(inArray(varietyGenealogy.varietyId, currentIds));
    
    if (parents.length === 0) break;
    
    ancestors.push(...parents);
    currentIds = parents.map(p => p.parentVarietyId);
  }
  
  return ancestors;
}

export async function getVarietyDescendants(varietyId: number, depth: number = 5) {
  const db = await getDb();
  if (!db) return [];
  const descendants = [];
  let currentIds = [varietyId];
  
  for (let i = 0; i < depth; i++) {
    if (currentIds.length === 0) break;
    
    const children = await db
      .select()
      .from(varietyGenealogy)
      .where(inArray(varietyGenealogy.parentVarietyId, currentIds));
    
    if (children.length === 0) break;
    
    descendants.push(...children);
    currentIds = children.map(c => c.varietyId);
  }
  
  return descendants;
}

export async function addVarietyRelationship(data: InsertVarietyGenealogy) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(varietyGenealogy).values(data);
  const [relationship] = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.id, result.insertId));
  return relationship;
}

export async function updateVarietyRelationship(id: number, data: Partial<InsertVarietyGenealogy>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(varietyGenealogy)
    .set(data)
    .where(eq(varietyGenealogy.id, id));
  const [relationship] = await db
    .select()
    .from(varietyGenealogy)
    .where(eq(varietyGenealogy.id, id));
  return relationship;
}

// ============================================================================
// PLANTS CONSERVATION HELPERS
// ============================================================================

export async function listThreatenedPlants(filters: {
  iucn?: string;
  cites?: string;
  region?: string;
}) {
  const { iucn, cites, region } = filters;
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(plants);
  
  const conditions = [];
  if (iucn) {
    conditions.push(eq(plants.conservationStatus, iucn as any));
  }
  if (cites) {
    conditions.push(eq(plants.citesAppendix, cites as any));
  }
  if (region) {
    conditions.push(like(plants.origin, `%${region}%`));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query;
}

export async function getPlantConservationStatus(plantId: number) {
  const db = await getDb();
  if (!db) return null;
  const [plant] = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
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
  threatFactors?: any;
  sustainableAlternatives?: string;
  lastAssessmentYear?: number;
  historicalStatus?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(plants)
    .set(data as any)
    .where(eq(plants.id, plantId));
  return getPlantConservationStatus(plantId);
}

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


// ============================================================================
// SUSTAINABLE ALTERNATIVES HELPERS
// ============================================================================

export async function getAllSustainableAlternatives() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sustainableAlternatives).orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function getSustainableAlternativeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select().from(sustainableAlternatives).where(eq(sustainableAlternatives.id, id));
  return result || null;
}

export async function getAlternativesByThreatenedPlant(threatenedPlantId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sustainableAlternatives)
    .where(eq(sustainableAlternatives.threatenedPlantId, threatenedPlantId))
    .orderBy(sustainableAlternatives.olfactiveSimilarity);
}

export async function getAlternativesByType(alternativeType: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sustainableAlternatives)
    .where(eq(sustainableAlternatives.alternativeType, alternativeType as any))
    .orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function searchSustainableAlternatives(filters: {
  threatenedPlantId?: number;
  alternativeType?: string;
  availability?: string;
  olfactiveSimilarity?: string;
  searchQuery?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  
  if (filters.threatenedPlantId) {
    conditions.push(eq(sustainableAlternatives.threatenedPlantId, filters.threatenedPlantId));
  }
  if (filters.alternativeType) {
    conditions.push(eq(sustainableAlternatives.alternativeType, filters.alternativeType as any));
  }
  if (filters.availability) {
    conditions.push(eq(sustainableAlternatives.availability, filters.availability as any));
  }
  if (filters.olfactiveSimilarity) {
    conditions.push(eq(sustainableAlternatives.olfactiveSimilarity, filters.olfactiveSimilarity as any));
  }
  if (filters.searchQuery) {
    conditions.push(
      or(
        like(sustainableAlternatives.threatenedPlantName, `%${filters.searchQuery}%`),
        like(sustainableAlternatives.alternativeName, `%${filters.searchQuery}%`),
        like(sustainableAlternatives.notes, `%${filters.searchQuery}%`)
      )
    );
  }
  
  let query = db.select().from(sustainableAlternatives);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query.orderBy(sustainableAlternatives.threatenedPlantName);
}

export async function getThreatenedPlantsWithAlternatives() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les plantes menacées (CR, EN, VU, NT)
  const threatenedPlants = await db
    .select()
    .from(plants)
    .where(
      or(
        eq(plants.conservationStatus, 'CR'),
        eq(plants.conservationStatus, 'EN'),
        eq(plants.conservationStatus, 'VU'),
        eq(plants.conservationStatus, 'NT'),
        eq(plants.citesAppendix, 'I'),
        eq(plants.citesAppendix, 'II')
      )
    )
    .orderBy(plants.name);
  
  // Pour chaque plante menacée, récupérer ses alternatives
  const result = await Promise.all(
    threatenedPlants.map(async (plant) => {
      const alternatives = await db
        .select()
        .from(sustainableAlternatives)
        .where(eq(sustainableAlternatives.threatenedPlantId, plant.id));
      
      return {
        ...plant,
        alternatives,
        alternativeCount: alternatives.length,
      };
    })
  );
  
  return result;
}

export async function getAlternativesGroupedBySpecies() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les alternatives
  const allAlternatives = await db
    .select()
    .from(sustainableAlternatives)
    .orderBy(sustainableAlternatives.threatenedPlantName);
  
  // Grouper par espèce menacée
  const grouped: Record<string, {
    threatenedPlantId: number;
    threatenedPlantName: string;
    alternatives: typeof allAlternatives;
  }> = {};
  
  for (const alt of allAlternatives) {
    const key = `${alt.threatenedPlantId}`;
    if (!grouped[key]) {
      grouped[key] = {
        threatenedPlantId: alt.threatenedPlantId,
        threatenedPlantName: alt.threatenedPlantName,
        alternatives: [],
      };
    }
    grouped[key].alternatives.push(alt);
  }
  
  return Object.values(grouped);
}

export async function createSustainableAlternative(data: {
  threatenedPlantId: number;
  threatenedPlantName: string;
  alternativePlantId?: number;
  alternativeName: string;
  alternativeType: string;
  olfactiveSimilarity?: string;
  olfactiveNotes?: string;
  availability?: string;
  sustainabilityScore?: number;
  certifications?: string[];
  priceComparison?: string;
  suppliers?: string[];
  usageRecommendations?: string;
  keyMolecules?: { name: string; percentage?: number; note?: string }[];
  references?: { title: string; author?: string; year?: number; url?: string; type: string }[];
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(sustainableAlternatives).values(data as any);
  return getSustainableAlternativeById(result.insertId);
}

export async function updateSustainableAlternative(id: number, data: {
  threatenedPlantId?: number;
  threatenedPlantName?: string;
  alternativePlantId?: number;
  alternativeName?: string;
  alternativeType?: string;
  olfactiveSimilarity?: string;
  olfactiveNotes?: string;
  availability?: string;
  sustainabilityScore?: number;
  certifications?: string[];
  priceComparison?: string;
  suppliers?: string[];
  usageRecommendations?: string;
  keyMolecules?: { name: string; percentage?: number; note?: string }[];
  references?: { title: string; author?: string; year?: number; url?: string; type: string }[];
  notes?: string;
  verified?: boolean;
  verifiedBy?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .update(sustainableAlternatives)
    .set(data as any)
    .where(eq(sustainableAlternatives.id, id));
  
  return getSustainableAlternativeById(id);
}

export async function deleteSustainableAlternative(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(sustainableAlternatives).where(eq(sustainableAlternatives.id, id));
  return true;
}

export async function getAlternativesStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(sustainableAlternatives);
  
  // Compter par type
  const byType = await db
    .select({
      type: sustainableAlternatives.alternativeType,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.alternativeType);
  
  // Compter par disponibilité
  const byAvailability = await db
    .select({
      availability: sustainableAlternatives.availability,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.availability);
  
  // Compter par similarité olfactive
  const bySimilarity = await db
    .select({
      similarity: sustainableAlternatives.olfactiveSimilarity,
      count: count(),
    })
    .from(sustainableAlternatives)
    .groupBy(sustainableAlternatives.olfactiveSimilarity);
  
  // Nombre d'espèces menacées avec alternatives
  const speciesWithAlternatives = await db
    .selectDistinct({ id: sustainableAlternatives.threatenedPlantId })
    .from(sustainableAlternatives);
  
  return {
    totalAlternatives: totalCount.count,
    speciesWithAlternatives: speciesWithAlternatives.length,
    byType,
    byAvailability,
    bySimilarity,
  };
}
