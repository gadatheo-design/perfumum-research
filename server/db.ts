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
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { expandSearchQuery, getSynonyms, normalizeSearchTerm, categorizeOlfactiveTerm, getDictionaryStats } from '../shared/olfactiveSynonyms';
import { expandWithScientificNames, getScientificDictionaryStats } from '../shared/botanicalLatinNames';

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
    olfactiveFamily: (data as any).olfactiveFamily || (data as any).family || null,
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
// CHEMICAL FAMILIES (Enrichi avec table dédiée)
// ============================================================================

// Récupérer toutes les familles chimiques de la table dédiée
export async function getAllChemicalFamilies() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(chemicalFamilies)
    .orderBy(chemicalFamilies.name);
}

// Récupérer une famille chimique par ID
export async function getChemicalFamilyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(chemicalFamilies)
    .where(eq(chemicalFamilies.id, id));
  return results[0] || null;
}

// Récupérer une famille chimique par type
export async function getChemicalFamilyByType(type: string) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db
    .select()
    .from(chemicalFamilies)
    .where(sql`${chemicalFamilies.type} = ${type}`);
  return results[0] || null;
}

// Récupérer les familles chimiques avec le nombre de molécules liées
export async function getChemicalFamiliesWithMoleculeCount() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: chemicalFamilies.id,
      name: chemicalFamilies.name,
      type: chemicalFamilies.type,
      subcategory: chemicalFamilies.subcategory,
      description: chemicalFamilies.description,
      olfactiveRole: chemicalFamilies.olfactiveRole,
      volatility: chemicalFamilies.volatility,
      polarity: chemicalFamilies.polarity,
      molecularWeightRange: chemicalFamilies.molecularWeightRange,
      typicalNotes: chemicalFamilies.typicalNotes,
      exampleMolecules: chemicalFamilies.exampleMolecules,
      moleculeCount: sql<number>`(
        SELECT COUNT(*) FROM molecule_chemical_families mcf 
        WHERE mcf.chemicalFamilyId = ${chemicalFamilies.id}
      )`.as('moleculeCount'),
    })
    .from(chemicalFamilies)
    .orderBy(chemicalFamilies.name);
  
  return result;
}

// Ancienne fonction pour compatibilité - récupère les familles depuis le champ molecules.family
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

// Récupérer les molécules par famille chimique (via table de liaison)
export async function getMoleculesByChemicalFamilyId(familyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: molecules.id,
      name: molecules.name,
      iupacName: molecules.iupacName,
      casNumber: molecules.casNumber,
      chemicalClass: molecules.chemicalClass,
      family: molecules.family,
      chemicalFormula: molecules.chemicalFormula,
      olfactiveProfile: molecules.olfactiveProfile,
      molecularWeight: molecules.molecularWeight,
      boilingPoint: molecules.boilingPoint,
      volatility: molecules.volatility,
      intensity: molecules.intensity,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(molecules, eq(moleculeChemicalFamilies.moleculeId, molecules.id))
    .where(eq(moleculeChemicalFamilies.chemicalFamilyId, familyId))
    .orderBy(molecules.name);
}

// Ancienne fonction pour compatibilité - récupère par le champ molecules.family
export async function getMoleculesByFamily(family: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(molecules)
    .where(eq(molecules.family, family))
    .orderBy(molecules.name);
}

// Lier une molécule à une famille chimique
export async function linkMoleculeToChemicalFamily(moleculeId: number, chemicalFamilyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Vérifier si la liaison existe déjà
  const existing = await db
    .select()
    .from(moleculeChemicalFamilies)
    .where(
      and(
        eq(moleculeChemicalFamilies.moleculeId, moleculeId),
        eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilyId)
      )
    );
  
  if (existing.length > 0) {
    return { success: true, message: 'Liaison déjà existante' };
  }
  
  await db.insert(moleculeChemicalFamilies).values({
    moleculeId,
    chemicalFamilyId,
  });
  
  return { success: true, message: 'Liaison créée' };
}

// Supprimer la liaison entre une molécule et une famille chimique
export async function unlinkMoleculeFromChemicalFamily(moleculeId: number, chemicalFamilyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  await db
    .delete(moleculeChemicalFamilies)
    .where(
      and(
        eq(moleculeChemicalFamilies.moleculeId, moleculeId),
        eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilyId)
      )
    );
  
  return { success: true, message: 'Liaison supprimée' };
}

// Récupérer les familles chimiques d'une molécule
export async function getChemicalFamiliesForMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: chemicalFamilies.id,
      name: chemicalFamilies.name,
      type: chemicalFamilies.type,
      subcategory: chemicalFamilies.subcategory,
      description: chemicalFamilies.description,
      olfactiveRole: chemicalFamilies.olfactiveRole,
      volatility: chemicalFamilies.volatility,
      typicalNotes: chemicalFamilies.typicalNotes,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(chemicalFamilies, eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id))
    .where(eq(moleculeChemicalFamilies.moleculeId, moleculeId))
    .orderBy(chemicalFamilies.name);
}

// Créer une nouvelle famille chimique
export async function createChemicalFamily(data: {
  name: string;
  type: string;
  subcategory?: string;
  description?: string;
  olfactiveRole?: string;
  volatility?: string;
  polarity?: string;
  molecularWeightRange?: string;
  typicalNotes?: string;
  exampleMolecules?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(chemicalFamilies).values({
    name: data.name,
    type: data.type as any,
    subcategory: data.subcategory || null,
    description: data.description || null,
    olfactiveRole: data.olfactiveRole || null,
    volatility: data.volatility || null,
    polarity: data.polarity || null,
    molecularWeightRange: data.molecularWeightRange || null,
    typicalNotes: data.typicalNotes || null,
    exampleMolecules: data.exampleMolecules || null,
  });
  
  return { id: Number((result as any).insertId || (result as any)[0]?.insertId || 0), ...data };
}

// Mettre à jour une famille chimique
export async function updateChemicalFamily(id: number, data: {
  name?: string;
  type?: string;
  subcategory?: string;
  description?: string;
  olfactiveRole?: string;
  volatility?: string;
  polarity?: string;
  molecularWeightRange?: string;
  typicalNotes?: string;
  exampleMolecules?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.subcategory !== undefined) updateData.subcategory = data.subcategory;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.olfactiveRole !== undefined) updateData.olfactiveRole = data.olfactiveRole;
  if (data.volatility !== undefined) updateData.volatility = data.volatility;
  if (data.polarity !== undefined) updateData.polarity = data.polarity;
  if (data.molecularWeightRange !== undefined) updateData.molecularWeightRange = data.molecularWeightRange;
  if (data.typicalNotes !== undefined) updateData.typicalNotes = data.typicalNotes;
  if (data.exampleMolecules !== undefined) updateData.exampleMolecules = data.exampleMolecules;
  
  await db
    .update(chemicalFamilies)
    .set(updateData)
    .where(eq(chemicalFamilies.id, id));
  
  return await getChemicalFamilyById(id);
}

// Supprimer une famille chimique
export async function deleteChemicalFamily(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  // D'abord supprimer les liaisons
  await db
    .delete(moleculeChemicalFamilies)
    .where(eq(moleculeChemicalFamilies.chemicalFamilyId, id));
  
  // Puis supprimer la famille
  await db
    .delete(chemicalFamilies)
    .where(eq(chemicalFamilies.id, id));
  
  return { success: true, message: 'Famille chimique supprimée' };
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
  /** Score de pertinence (100 = correspondance exacte, 80 = synonyme, 60 = partiel) */
  relevanceScore?: number;
  /** Type de correspondance qui a déclenché le résultat */
  matchType?: 'exact' | 'synonym' | 'latin' | 'cas' | 'partial';
  /** Terme qui a matché (pour l'affichage) */
  matchedTerm?: string;
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
  searchEnrichment?: {
    originalQuery: string;
    expandedTerms: string[];
    synonymsUsed: number;
    queryCategory: { category: string; confidence: number };
    /** Synonymes olfactifs utilisés pour enrichir la recherche */
    olfactiveSynonyms: string[];
    /** Noms scientifiques (latins, CAS) utilisés */
    scientificNames: string[];
    /** Nombre total d'expansions de la requête */
    totalExpansions: number;
  };
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

  // Enrichissement de la requête avec synonymes olfactifs ET scientifiques (noms latins, CAS)
  const olfactiveTerms = expandSearchQuery(query);
  const scientificTerms = expandWithScientificNames(query);
  
  // Combiner tous les termes enrichis (sans doublons)
  const allExpandedTerms = new Set([...olfactiveTerms, ...scientificTerms]);
  const expandedTerms = Array.from(allExpandedTerms);
  
  // Catégoriser les termes pour la pondération
  const originalTermLower = query.toLowerCase().trim();
  const synonymTerms = olfactiveTerms.filter(t => t.toLowerCase() !== originalTermLower);
  const latinTerms = scientificTerms.filter(t => 
    t.toLowerCase() !== originalTermLower && 
    !synonymTerms.map(s => s.toLowerCase()).includes(t.toLowerCase())
  );
  
  const searchPatterns = expandedTerms.map(term => `%${term}%`);
  const primarySearchTerm = `%${query}%`;
  const perCategoryLimit = Math.ceil(limit / 9);

  // Fonction helper pour construire les conditions de recherche enrichies
  const buildEnrichedSearchCondition = (columns: any[]) => {
    const conditions: any[] = [];
    
    // Recherche principale (terme original) - priorité haute
    for (const col of columns) {
      conditions.push(sql`${col} LIKE ${primarySearchTerm}`);
    }
    
    // Recherche avec synonymes (termes enrichis) - priorité normale
    for (const pattern of searchPatterns) {
      if (pattern !== primarySearchTerm) {
        for (const col of columns) {
          conditions.push(sql`${col} LIKE ${pattern}`);
        }
      }
    }
    
    return sql.join(conditions, sql` OR `);
  };

  // Search in prototypes
  const prototypeResults = await db
    .select()
    .from(prototypes)
    .where(buildEnrichedSearchCondition([prototypes.name, prototypes.code, prototypes.conceptualAxis]))
    .limit(perCategoryLimit);

  // Search in molecules (enrichi avec famille et profil olfactif)
  const moleculeResults = await db
    .select()
    .from(molecules)
    .where(buildEnrichedSearchCondition([molecules.name, molecules.family, molecules.olfactiveProfile, molecules.casNumber]))
    .limit(perCategoryLimit);

  // Search in recipes
  const recipeResults = await db
    .select()
    .from(recettes)
    .where(buildEnrichedSearchCondition([recettes.name, recettes.category, recettes.formula]))
    .limit(perCategoryLimit);

  // Search in plants
  const plantResults = await db
    .select()
    .from(plants)
    .where(buildEnrichedSearchCondition([plants.name, plants.latinName, plants.family]))
    .limit(perCategoryLimit);

  // Search in accords (enrichi avec profil olfactif et notes)
  const accordResults = await db
    .select()
    .from(accords)
    .where(buildEnrichedSearchCondition([accords.name, accords.olfactiveProfile, accords.notes]))
    .limit(perCategoryLimit);

  // Search in terp profiles
  const terpProfileResults = await db
    .select()
    .from(terpProfiles)
    .where(buildEnrichedSearchCondition([terpProfiles.name, terpProfiles.profileId, terpProfiles.function]))
    .limit(perCategoryLimit);

  // Search in final recipes
  const finalRecipeResults = await db
    .select()
    .from(finalRecipes)
    .where(buildEnrichedSearchCondition([finalRecipes.name, finalRecipes.recipeId, finalRecipes.function]))
    .limit(perCategoryLimit);

  // Search in civilisations
  const civilisationResults = await db
    .select()
    .from(civilisations)
    .where(buildEnrichedSearchCondition([civilisations.name, civilisations.region, civilisations.longDescription]))
    .limit(perCategoryLimit);

  // Search in glossary
  const glossaryResults = await db
    .select()
    .from(glossary)
    .where(buildEnrichedSearchCondition([glossary.term, glossary.definition]))
    .limit(perCategoryLimit);

  // Fonction pour calculer le score de pertinence et le type de correspondance
  const calculateRelevance = (itemName: string, itemDescription?: string | null, additionalFields?: string[]): {
    score: number;
    matchType: 'exact' | 'synonym' | 'latin' | 'cas' | 'partial';
    matchedTerm: string;
  } => {
    const nameLower = itemName.toLowerCase();
    const descLower = (itemDescription || '').toLowerCase();
    const allFieldsLower = [nameLower, descLower, ...(additionalFields || []).map(f => (f || '').toLowerCase())];
    
    // Correspondance exacte avec le terme original (score 100)
    if (nameLower.includes(originalTermLower) || originalTermLower.includes(nameLower)) {
      return { score: 100, matchType: 'exact', matchedTerm: query };
    }
    
    // Correspondance dans la description avec terme original (score 95)
    if (descLower.includes(originalTermLower)) {
      return { score: 95, matchType: 'exact', matchedTerm: query };
    }
    
    // Correspondance avec synonyme olfactif (score 80)
    for (const syn of synonymTerms) {
      const synLower = syn.toLowerCase();
      if (allFieldsLower.some(f => f.includes(synLower))) {
        return { score: 80, matchType: 'synonym', matchedTerm: syn };
      }
    }
    
    // Correspondance avec nom latin (score 75)
    for (const latin of latinTerms) {
      const latinLower = latin.toLowerCase();
      if (allFieldsLower.some(f => f.includes(latinLower))) {
        // Vérifier si c'est un numéro CAS
        if (/^\d+-\d+-\d+$/.test(latin)) {
          return { score: 70, matchType: 'cas', matchedTerm: latin };
        }
        return { score: 75, matchType: 'latin', matchedTerm: latin };
      }
    }
    
    // Correspondance partielle (score 60)
    return { score: 60, matchType: 'partial', matchedTerm: query };
  };

  // Transform results avec scores de pertinence
  const transformedPrototypes: GlobalSearchResult[] = prototypeResults.map(p => {
    const relevance = calculateRelevance(p.name, p.conceptualAxis, [p.code || '']);
    return {
      type: 'prototype' as const,
      id: p.id,
      name: p.name,
      description: p.conceptualAxis,
      metadata: { code: p.code, emoji: p.emoji },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedMolecules: GlobalSearchResult[] = moleculeResults.map(m => {
    const relevance = calculateRelevance(m.name, m.olfactiveProfile, [m.family || '', m.casNumber || '']);
    return {
      type: 'molecule' as const,
      id: m.id,
      name: m.name,
      description: m.olfactiveProfile,
      metadata: { family: m.family, chemicalFormula: m.chemicalFormula, casNumber: m.casNumber },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedRecettes: GlobalSearchResult[] = recipeResults.map(r => {
    const relevance = calculateRelevance(r.name, r.description, [r.category || '']);
    return {
      type: 'recette' as const,
      id: r.id,
      name: r.name,
      description: r.description,
      metadata: { category: r.category, status: r.status },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedPlants: GlobalSearchResult[] = plantResults.map(p => {
    const relevance = calculateRelevance(p.name, p.olfactiveSignature, [p.latinName || '', p.family || '']);
    return {
      type: 'plant' as const,
      id: p.id,
      name: p.name,
      description: p.olfactiveSignature,
      metadata: { latinName: p.latinName, family: p.family, origin: p.origin },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedAccords: GlobalSearchResult[] = accordResults.map(a => {
    const relevance = calculateRelevance(a.name, a.olfactiveProfile, [a.texture || '']);
    return {
      type: 'accord' as const,
      id: a.id,
      name: a.name,
      description: a.olfactiveProfile,
      metadata: { texture: a.texture, emotionalResonance: a.emotionalResonance },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedTerpProfiles: GlobalSearchResult[] = terpProfileResults.map(t => {
    const relevance = calculateRelevance(t.name, t.function, [t.profileId || '']);
    return {
      type: 'terpProfile' as const,
      id: t.id,
      name: t.name,
      description: t.function,
      metadata: { profileId: t.profileId, climaticAxis: t.climaticAxis, usage: t.usage },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedFinalRecipes: GlobalSearchResult[] = finalRecipeResults.map(f => {
    const relevance = calculateRelevance(f.name, f.function, [f.recipeId || '']);
    return {
      type: 'finalRecipe' as const,
      id: f.id,
      name: f.name,
      description: f.function,
      metadata: { recipeId: f.recipeId, recipeType: f.recipeType, climaticAxis: f.climaticAxis },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedCivilisations: GlobalSearchResult[] = civilisationResults.map(c => {
    const relevance = calculateRelevance(c.name, c.longDescription, [c.region || '']);
    return {
      type: 'civilisation' as const,
      id: c.id,
      name: c.name,
      description: c.longDescription,
      metadata: { region: c.region, temporality: c.temporality },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

  const transformedGlossary: GlobalSearchResult[] = glossaryResults.map(g => {
    const relevance = calculateRelevance(g.term, g.definition);
    return {
      type: 'glossary' as const,
      id: g.id,
      name: g.term,
      description: g.definition,
      metadata: { category: g.category },
      relevanceScore: relevance.score,
      matchType: relevance.matchType,
      matchedTerm: relevance.matchedTerm,
    };
  });

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

  // Trier chaque catégorie par score de pertinence (décroissant)
  const sortByRelevance = (a: GlobalSearchResult, b: GlobalSearchResult) => 
    (b.relevanceScore || 0) - (a.relevanceScore || 0);

  return {
    prototypes: transformedPrototypes.sort(sortByRelevance),
    molecules: transformedMolecules.sort(sortByRelevance),
    recettes: transformedRecettes.sort(sortByRelevance),
    plants: transformedPlants.sort(sortByRelevance),
    accords: transformedAccords.sort(sortByRelevance),
    terpProfiles: transformedTerpProfiles.sort(sortByRelevance),
    finalRecipes: transformedFinalRecipes.sort(sortByRelevance),
    civilisations: transformedCivilisations.sort(sortByRelevance),
    glossary: transformedGlossary.sort(sortByRelevance),
    total,
    // Métadonnées d'enrichissement de la recherche
    searchEnrichment: {
      originalQuery: query,
      expandedTerms: expandedTerms,
      synonymsUsed: expandedTerms.length - 1, // -1 pour exclure le terme original
      queryCategory: categorizeOlfactiveTerm(query),
      // Nouvelles métadonnées pour l'affichage des synonymes
      olfactiveSynonyms: synonymTerms,
      scientificNames: latinTerms,
      totalExpansions: expandedTerms.length,
    }
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
  ].sort((a, b) => (b.proportion ?? 0) - (a.proportion ?? 0));
  
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
 * Récupère toutes les synergies moléculaires avec les noms et familles chimiques des molécules
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
      chemicalMechanism: moleculeSynergies.chemicalMechanism,
      applications: moleculeSynergies.applications,
      molecule1Name: molecules.name,
      molecule1Family: molecules.family,
      molecule2Name: sql<string>`m2.name`,
      molecule2Family: sql<string>`m2.family`,
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
    molecule1Family: s.molecule1Family || null,
    molecule2Family: s.molecule2Family || null,
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

export async function getPlantsWithGPS() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants)
    .where(and(
      isNotNull(plants.latitude),
      isNotNull(plants.longitude)
    ))
    .orderBy(plants.name);
}

export async function getPlantsWithGPSByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(plants)
    .where(and(
      eq(plants.category, category as any),
      isNotNull(plants.latitude),
      isNotNull(plants.longitude)
    ))
    .orderBy(plants.name);
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
      ...(data.percentageMin !== undefined && { percentageMin: data.percentageMin?.toString() ?? null }),
      ...(data.percentageMax !== undefined && { percentageMax: data.percentageMax?.toString() ?? null }),
      ...(data.percentageTypical !== undefined && { percentageTypical: data.percentageTypical?.toString() ?? null }),
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
  
  query = query.where(and(...conditions)) as any;
  
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


// ============================================================================
// BIBLIOGRAPHY ENTRIES
// ============================================================================

export async function getAllBibliographyEntries(filters?: {
  entryType?: string;
  researchDomain?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  readStatus?: string;
  search?: string;
  axisId?: number;
  entityType?: string; // 'plant' | 'molecule' | 'variety' | 'any'
  hasLinks?: boolean; // true = avec liaisons, false = sans liaisons
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { entries: [], total: 0 };
  
  const conditions: any[] = [];
  
  if (filters?.entryType) {
    conditions.push(eq(bibliographyEntries.entryType, filters.entryType as any));
  }
  if (filters?.researchDomain) {
    conditions.push(eq(bibliographyEntries.researchDomain, filters.researchDomain as any));
  }
  if (filters?.year) {
    conditions.push(eq(bibliographyEntries.year, filters.year));
  }
  if (filters?.yearMin) {
    conditions.push(gte(bibliographyEntries.year, filters.yearMin));
  }
  if (filters?.yearMax) {
    conditions.push(lte(bibliographyEntries.year, filters.yearMax));
  }
  if (filters?.readStatus) {
    conditions.push(eq(bibliographyEntries.readStatus, filters.readStatus as any));
  }
  if (filters?.search) {
    conditions.push(
      or(
        like(bibliographyEntries.title, `%${filters.search}%`),
        like(bibliographyEntries.authors, `%${filters.search}%`),
        like(bibliographyEntries.entryKey, `%${filters.search}%`)
      )
    );
  }
  
  // Filtre par type d'entité liée
  if (filters?.entityType && filters.entityType !== 'any') {
    const entityLinks = await db
      .select({ bibliographyId: sql<number>`bibliography_id` })
      .from(sql`bibliography_entity_links`)
      .where(sql`entity_type = ${filters.entityType}`);
    const bibIds = entityLinks.map((l: any) => l.bibliographyId);
    if (bibIds.length > 0) {
      conditions.push(inArray(bibliographyEntries.id, bibIds));
    } else {
      return { entries: [], total: 0 };
    }
  }

  // Filtre par présence de liaisons
  if (filters?.hasLinks === true) {
    conditions.push(
      sql`EXISTS (SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = ${bibliographyEntries.id})`
    );
  } else if (filters?.hasLinks === false) {
    conditions.push(
      sql`NOT EXISTS (SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = ${bibliographyEntries.id})`
    );
  }

  // Filtre par axe de recherche
  if (filters?.axisId) {
    const axisLinks = await db
      .select({ bibliographyId: bibliographyAxisLinks.bibliographyId })
      .from(bibliographyAxisLinks)
      .where(eq(bibliographyAxisLinks.axisId, filters.axisId));
    
    const bibIds = axisLinks.map(l => l.bibliographyId);
    if (bibIds.length > 0) {
      conditions.push(inArray(bibliographyEntries.id, bibIds));
    } else {
      // Aucune référence liée à cet axe
      return { entries: [], total: 0 };
    }
  }
  
  // Count total
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(bibliographyEntries);
  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions)) as any;
  }
  const [countResult] = await countQuery;
  const total = countResult?.count || 0;
  
  // Get entries
  let query = db.select().from(bibliographyEntries);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  query = query.orderBy(desc(bibliographyEntries.year), desc(bibliographyEntries.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as any;
  }
  
  const entries = await query;
  return { entries, total };
}

export async function getBibliographyEntryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.id, id));
  return entry || null;
}

export async function getBibliographyEntryByKey(entryKey: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.entryKey, entryKey));
  return entry || null;
}

export async function createBibliographyEntry(data: InsertBibliographyEntry) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(bibliographyEntries).values(data);
  return getBibliographyEntryById(result.insertId);
}

export async function updateBibliographyEntry(id: number, data: Partial<InsertBibliographyEntry>) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(bibliographyEntries)
    .set(data as any)
    .where(eq(bibliographyEntries.id, id));
  
  return getBibliographyEntryById(id);
}

export async function deleteBibliographyEntry(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(bibliographyEntries).where(eq(bibliographyEntries.id, id));
  return true;
}

export async function getBibliographyStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(bibliographyEntries);
  
  const byType = await db
    .select({
      type: bibliographyEntries.entryType,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.entryType);
  
  const byDomain = await db
    .select({
      domain: bibliographyEntries.researchDomain,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.researchDomain);
  
  const byReadStatus = await db
    .select({
      status: bibliographyEntries.readStatus,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.readStatus);
  
  const byYear = await db
    .select({
      year: bibliographyEntries.year,
      count: count(),
    })
    .from(bibliographyEntries)
    .groupBy(bibliographyEntries.year)
    .orderBy(desc(bibliographyEntries.year))
    .limit(20);
  
  // Get year range for timeline filter
  const [yearRange] = await db
    .select({
      minYear: sql<number>`MIN(${bibliographyEntries.year})`,
      maxYear: sql<number>`MAX(${bibliographyEntries.year})`,
    })
    .from(bibliographyEntries);
  
  return {
    total: totalCount.count,
    byType,
    byDomain,
    byReadStatus,
    byYear,
    yearRange: {
      min: yearRange?.minYear || 1900,
      max: yearRange?.maxYear || new Date().getFullYear(),
    },
  };
}

// Bulk import for bibliography entries
export async function bulkCreateBibliographyEntries(entries: InsertBibliographyEntry[]) {
  const db = await getDb();
  if (!db) return { success: 0, failed: 0, errors: [] as string[] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const entry of entries) {
    try {
      await db.insert(bibliographyEntries).values(entry);
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`${entry.entryKey}: ${error.message}`);
    }
  }
  
  return { success, failed, errors };
}

// ============================================================================
// RESEARCH AXES
// ============================================================================

export async function getAllResearchAxes(filters?: {
  status?: string;
  category?: string;
  priority?: string;
  parentAxisId?: number | null;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(researchAxes);
  
  const conditions: any[] = [];
  
  if (filters?.status) {
    conditions.push(eq(researchAxes.status, filters.status as any));
  }
  if (filters?.category) {
    conditions.push(eq(researchAxes.category, filters.category as any));
  }
  if (filters?.priority) {
    conditions.push(eq(researchAxes.priority, filters.priority as any));
  }
  if (filters?.parentAxisId !== undefined) {
    if (filters.parentAxisId === null) {
      conditions.push(isNull(researchAxes.parentAxisId));
    } else {
      conditions.push(eq(researchAxes.parentAxisId, filters.parentAxisId));
    }
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return query.orderBy(researchAxes.axisCode);
}

export async function getResearchAxisById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.id, id));
  return axis || null;
}

export async function getResearchAxisByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.axisCode, code));
  return axis || null;
}

export async function createResearchAxis(data: InsertResearchAxis) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(researchAxes).values(data);
  return getResearchAxisById(result.insertId);
}

export async function updateResearchAxis(id: number, data: Partial<InsertResearchAxis>) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(researchAxes)
    .set(data as any)
    .where(eq(researchAxes.id, id));
  
  return getResearchAxisById(id);
}

export async function deleteResearchAxis(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(researchAxes).where(eq(researchAxes.id, id));
  return true;
}

export async function getResearchAxesStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalCount] = await db.select({ count: count() }).from(researchAxes);
  
  const byStatus = await db
    .select({
      status: researchAxes.status,
      count: count(),
    })
    .from(researchAxes)
    .groupBy(researchAxes.status);
  
  const byCategory = await db
    .select({
      category: researchAxes.category,
      count: count(),
    })
    .from(researchAxes)
    .groupBy(researchAxes.category);
  
  // Calcul de la progression moyenne
  const allAxes = await db.select({ progress: researchAxes.progressPercent }).from(researchAxes);
  const avgProgress = allAxes.length > 0 
    ? Math.round(allAxes.reduce((sum, a) => sum + (a.progress || 0), 0) / allAxes.length)
    : 0;
  
  return {
    total: totalCount.count,
    byStatus,
    byCategory,
    averageProgress: avgProgress,
  };
}

// ============================================================================
// RESEARCH ENTRIES
// ============================================================================

export async function getAllResearchEntries(filters?: {
  axisId?: number;
  entryType?: string;
  status?: string;
  importance?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(researchEntries);
  
  const conditions: any[] = [];
  
  if (filters?.axisId) {
    conditions.push(eq(researchEntries.axisId, filters.axisId));
  }
  if (filters?.entryType) {
    conditions.push(eq(researchEntries.entryType, filters.entryType as any));
  }
  if (filters?.status) {
    conditions.push(eq(researchEntries.status, filters.status as any));
  }
  if (filters?.importance) {
    conditions.push(eq(researchEntries.importance, filters.importance as any));
  }
  if (filters?.search) {
    conditions.push(
      or(
        like(researchEntries.title, `%${filters.search}%`),
        like(researchEntries.content, `%${filters.search}%`),
        like(researchEntries.entryCode, `%${filters.search}%`)
      )
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(researchEntries.sortOrder, desc(researchEntries.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as any;
  }
  
  return query;
}

export async function getResearchEntryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(researchEntries).where(eq(researchEntries.id, id));
  return entry || null;
}

export async function getResearchEntryByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [entry] = await db.select().from(researchEntries).where(eq(researchEntries.entryCode, code));
  return entry || null;
}

export async function createResearchEntry(data: InsertResearchEntry) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(researchEntries).values(data);
  return getResearchEntryById(result.insertId);
}

export async function updateResearchEntry(id: number, data: Partial<InsertResearchEntry>) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(researchEntries)
    .set(data as any)
    .where(eq(researchEntries.id, id));
  
  return getResearchEntryById(id);
}

export async function deleteResearchEntry(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(researchEntries).where(eq(researchEntries.id, id));
  return true;
}

export async function getResearchEntriesByAxis(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(researchEntries)
    .where(eq(researchEntries.axisId, axisId))
    .orderBy(researchEntries.sortOrder, desc(researchEntries.createdAt));
}

export async function getNextEntryCode(axisCode: string) {
  const db = await getDb();
  if (!db) return `${axisCode}-001`;
  
  // Trouver le dernier code pour cet axe
  const entries = await db
    .select({ code: researchEntries.entryCode })
    .from(researchEntries)
    .where(like(researchEntries.entryCode, `${axisCode}-%`))
    .orderBy(desc(researchEntries.entryCode))
    .limit(1);
  
  if (entries.length === 0) {
    return `${axisCode}-001`;
  }
  
  const lastCode = entries[0].code;
  const lastNumber = parseInt(lastCode.split('-').pop() || '0', 10);
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
  
  return `${axisCode}-${nextNumber}`;
}

// ============================================================================
// BIBLIOGRAPHY-AXIS LINKS
// ============================================================================

export async function linkBibliographyToAxis(bibliographyId: number, axisId: number, relevance?: string, notes?: string) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const [result] = await db.insert(bibliographyAxisLinks).values({
      bibliographyId,
      axisId,
      relevance: relevance as any || 'secondaire',
      notes,
    });
    return { id: result.insertId, bibliographyId, axisId };
  } catch (error) {
    // Lien déjà existant
    return null;
  }
}

export async function unlinkBibliographyFromAxis(bibliographyId: number, axisId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(bibliographyAxisLinks)
    .where(
      and(
        eq(bibliographyAxisLinks.bibliographyId, bibliographyId),
        eq(bibliographyAxisLinks.axisId, axisId)
      )
    );
  return true;
}

export async function getBibliographyByAxis(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(bibliographyAxisLinks)
    .where(eq(bibliographyAxisLinks.axisId, axisId));
  
  if (links.length === 0) return [];
  
  const bibIds = links.map(l => l.bibliographyId);
  const entries = await db
    .select()
    .from(bibliographyEntries)
    .where(inArray(bibliographyEntries.id, bibIds));
  
  // Joindre les informations de relevance
  return entries.map(entry => {
    const link = links.find(l => l.bibliographyId === entry.id);
    return {
      ...entry,
      relevance: link?.relevance,
      linkNotes: link?.notes,
    };
  });
}

export async function getAxesByBibliography(bibliographyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(bibliographyAxisLinks)
    .where(eq(bibliographyAxisLinks.bibliographyId, bibliographyId));
  
  if (links.length === 0) return [];
  
  const axisIds = links.map(l => l.axisId);
  const axes = await db
    .select()
    .from(researchAxes)
    .where(inArray(researchAxes.id, axisIds));
  
  return axes.map(axis => {
    const link = links.find(l => l.axisId === axis.id);
    return {
      ...axis,
      relevance: link?.relevance,
      linkNotes: link?.notes,
    };
  });
}

// ============================================================================
// BIBTEX PARSING UTILITIES
// ============================================================================

export function parseBibTeX(bibtexString: string): Partial<InsertBibliographyEntry>[] {
  const entries: Partial<InsertBibliographyEntry>[] = [];
  
  // Regex pour extraire les entrées BibTeX
  const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,([^@]*)\}/g;
  let match;
  
  while ((match = entryRegex.exec(bibtexString)) !== null) {
    const entryType = match[1].toLowerCase();
    const entryKey = match[2].trim();
    const fieldsString = match[3];
    
    const entry: Partial<InsertBibliographyEntry> = {
      entryKey,
      entryType: mapBibTeXType(entryType),
    };
    
    // Parser les champs
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldRegex.exec(fieldsString)) !== null) {
      const fieldName = fieldMatch[1].toLowerCase();
      const fieldValue = fieldMatch[2].trim();
      
      switch (fieldName) {
        case 'title':
          entry.title = fieldValue;
          break;
        case 'author':
          entry.authors = fieldValue;
          break;
        case 'year':
          entry.year = parseInt(fieldValue, 10) || undefined;
          break;
        case 'journal':
          entry.journal = fieldValue;
          break;
        case 'booktitle':
          entry.booktitle = fieldValue;
          break;
        case 'publisher':
          entry.publisher = fieldValue;
          break;
        case 'volume':
          entry.volume = fieldValue;
          break;
        case 'number':
          entry.number = fieldValue;
          break;
        case 'pages':
          entry.pages = fieldValue;
          break;
        case 'doi':
          entry.doi = fieldValue;
          break;
        case 'isbn':
          entry.isbn = fieldValue;
          break;
        case 'issn':
          entry.issn = fieldValue;
          break;
        case 'url':
          entry.url = fieldValue;
          break;
        case 'abstract':
          entry.abstract = fieldValue;
          break;
        case 'keywords':
          entry.keywords = fieldValue.split(',').map(k => k.trim());
          break;
        case 'edition':
          entry.edition = fieldValue;
          break;
        case 'chapter':
          entry.chapter = fieldValue;
          break;
      }
    }
    
    if (entry.title) {
      entries.push(entry);
    }
  }
  
  return entries;
}

function mapBibTeXType(type: string): InsertBibliographyEntry['entryType'] {
  const typeMap: Record<string, InsertBibliographyEntry['entryType']> = {
    'article': 'article',
    'book': 'book',
    'inbook': 'inbook',
    'incollection': 'incollection',
    'inproceedings': 'inproceedings',
    'conference': 'conference',
    'phdthesis': 'phdthesis',
    'mastersthesis': 'mastersthesis',
    'thesis': 'thesis',
    'techreport': 'techreport',
    'manual': 'manual',
    'unpublished': 'unpublished',
    'misc': 'misc',
    'online': 'online',
    'patent': 'patent',
  };
  
  return typeMap[type] || 'misc';
}

// ============================================================================
// CSV PARSING UTILITIES FOR BIBLIOGRAPHY
// ============================================================================

export function parseCSVBibliography(csvString: string): Partial<InsertBibliographyEntry>[] {
  const lines = csvString.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const entries: Partial<InsertBibliographyEntry>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    
    const entry: Partial<InsertBibliographyEntry> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (!value) return;
      
      switch (header) {
        case 'key':
        case 'entry_key':
        case 'entrykey':
          entry.entryKey = value;
          break;
        case 'type':
        case 'entry_type':
        case 'entrytype':
          entry.entryType = mapBibTeXType(value.toLowerCase());
          break;
        case 'title':
          entry.title = value;
          break;
        case 'author':
        case 'authors':
          entry.authors = value;
          break;
        case 'year':
          entry.year = parseInt(value, 10) || undefined;
          break;
        case 'journal':
          entry.journal = value;
          break;
        case 'publisher':
          entry.publisher = value;
          break;
        case 'volume':
          entry.volume = value;
          break;
        case 'number':
        case 'issue':
          entry.number = value;
          break;
        case 'pages':
          entry.pages = value;
          break;
        case 'doi':
          entry.doi = value;
          break;
        case 'isbn':
          entry.isbn = value;
          break;
        case 'url':
          entry.url = value;
          break;
        case 'abstract':
          entry.abstract = value;
          break;
        case 'keywords':
        case 'tags':
          entry.keywords = value.split(';').map(k => k.trim());
          break;
        case 'domain':
        case 'research_domain':
          entry.researchDomain = value as any;
          break;
        case 'notes':
          entry.notes = value;
          break;
      }
    });
    
    // Générer une clé si manquante
    if (!entry.entryKey && entry.authors && entry.year) {
      const firstAuthor = entry.authors.split(',')[0].split(' ').pop()?.toLowerCase() || 'unknown';
      entry.entryKey = `${firstAuthor}${entry.year}${Math.random().toString(36).substr(2, 4)}`;
    }
    
    if (entry.title && entry.entryKey) {
      entries.push(entry);
    }
  }
  
  return entries;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function exportToBibTeX(entries: BibliographyEntry[]): string {
  return entries.map(entry => {
    const fields: string[] = [];
    
    if (entry.title) fields.push(`  title = {${entry.title}}`);
    if (entry.authors) fields.push(`  author = {${entry.authors}}`);
    if (entry.year) fields.push(`  year = {${entry.year}}`);
    if (entry.journal) fields.push(`  journal = {${entry.journal}}`);
    if (entry.booktitle) fields.push(`  booktitle = {${entry.booktitle}}`);
    if (entry.publisher) fields.push(`  publisher = {${entry.publisher}}`);
    if (entry.volume) fields.push(`  volume = {${entry.volume}}`);
    if (entry.number) fields.push(`  number = {${entry.number}}`);
    if (entry.pages) fields.push(`  pages = {${entry.pages}}`);
    if (entry.doi) fields.push(`  doi = {${entry.doi}}`);
    if (entry.isbn) fields.push(`  isbn = {${entry.isbn}}`);
    if (entry.url) fields.push(`  url = {${entry.url}}`);
    if (entry.abstract) fields.push(`  abstract = {${entry.abstract}}`);
    if (entry.keywords && entry.keywords.length > 0) {
      fields.push(`  keywords = {${entry.keywords.join(', ')}}`);
    }
    
    return `@${entry.entryType}{${entry.entryKey},\n${fields.join(',\n')}\n}`;
  }).join('\n\n');
}

export function exportToAPA(entry: BibliographyEntry): string {
  const authors = entry.authors || 'Unknown';
  const year = entry.year || 'n.d.';
  const title = entry.title || 'Untitled';
  
  let citation = `${authors} (${year}). ${title}`;
  
  if (entry.journal) {
    citation += `. *${entry.journal}*`;
    if (entry.volume) citation += `, ${entry.volume}`;
    if (entry.number) citation += `(${entry.number})`;
    if (entry.pages) citation += `, ${entry.pages}`;
  } else if (entry.publisher) {
    citation += `. ${entry.publisher}`;
  }
  
  citation += '.';
  
  if (entry.doi) {
    citation += ` https://doi.org/${entry.doi}`;
  } else if (entry.url) {
    citation += ` ${entry.url}`;
  }
  
  return citation;
}

export function exportToChicago(entry: BibliographyEntry): string {
  const authors = entry.authors || 'Unknown';
  const year = entry.year || 'n.d.';
  const title = entry.title || 'Untitled';
  
  let citation = `${authors}. "${title}."`;
  
  if (entry.journal) {
    citation += ` *${entry.journal}*`;
    if (entry.volume) citation += ` ${entry.volume}`;
    if (entry.number) citation += `, no. ${entry.number}`;
    citation += ` (${year})`;
    if (entry.pages) citation += `: ${entry.pages}`;
  } else {
    citation += ` ${year}`;
    if (entry.publisher) citation += `. ${entry.publisher}`;
  }
  
  citation += '.';
  
  if (entry.doi) {
    citation += ` https://doi.org/${entry.doi}`;
  }
  
  return citation;
}


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


// ============================================================================
// REFERENCE CITATIONS (Citations croisées entre références bibliographiques)
// ============================================================================

/**
 * Récupère toutes les citations avec filtres optionnels
 */
export async function getAllReferenceCitations(filters?: {
  citingId?: number;
  citedId?: number;
  citationType?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { citations: [], total: 0 };
  
  const conditions: any[] = [];
  
  if (filters?.citingId) {
    conditions.push(eq(referenceCitations.citingId, filters.citingId));
  }
  if (filters?.citedId) {
    conditions.push(eq(referenceCitations.citedId, filters.citedId));
  }
  if (filters?.citationType) {
    conditions.push(eq(referenceCitations.citationType, filters.citationType as any));
  }
  if (filters?.verified !== undefined) {
    conditions.push(eq(referenceCitations.verified, filters.verified));
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  const [totalResult] = await db
    .select({ count: count() })
    .from(referenceCitations)
    .where(whereClause);
  
  const citationsResult = await db
    .select()
    .from(referenceCitations)
    .where(whereClause)
    .orderBy(desc(referenceCitations.createdAt))
    .limit(filters?.limit || 100)
    .offset(filters?.offset || 0);
  
  return {
    citations: citationsResult,
    total: totalResult?.count || 0,
  };
}

/**
 * Récupère une citation par ID
 */
export async function getReferenceCitationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [citation] = await db
    .select()
    .from(referenceCitations)
    .where(eq(referenceCitations.id, id));
  
  return citation || null;
}

/**
 * Récupère le graphe complet des citations pour visualisation
 * Retourne les nœuds (références) et les liens (citations)
 */
export async function getCitationGraph(filters?: {
  citationType?: string;
  researchDomain?: string;
  minWeight?: number;
  verified?: boolean;
}) {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  
  // Construire les conditions pour les citations
  const citationConditions: any[] = [];
  if (filters?.citationType) {
    citationConditions.push(eq(referenceCitations.citationType, filters.citationType as any));
  }
  if (filters?.minWeight) {
    citationConditions.push(gte(referenceCitations.weight, filters.minWeight));
  }
  if (filters?.verified !== undefined) {
    citationConditions.push(eq(referenceCitations.verified, filters.verified));
  }
  
  const citationWhere = citationConditions.length > 0 ? and(...citationConditions) : undefined;
  
  // Récupérer toutes les citations
  const allCitations = await db
    .select()
    .from(referenceCitations)
    .where(citationWhere);
  
  // Collecter tous les IDs de références impliquées
  const refIds = new Set<number>();
  allCitations.forEach(c => {
    refIds.add(c.citingId);
    refIds.add(c.citedId);
  });
  
  if (refIds.size === 0) {
    return { nodes: [], links: [] };
  }
  
  // Construire les conditions pour les références
  const refConditions: any[] = [inArray(bibliographyEntries.id, Array.from(refIds))];
  if (filters?.researchDomain) {
    refConditions.push(eq(bibliographyEntries.researchDomain, filters.researchDomain as any));
  }
  
  // Récupérer les références
  const refs = await db
    .select()
    .from(bibliographyEntries)
    .where(and(...refConditions));
  
  // Créer un map des références pour accès rapide
  const refMap = new Map(refs.map(r => [r.id, r]));
  
  // Construire les nœuds
  const nodes = refs.map(ref => ({
    id: ref.id,
    entryKey: ref.entryKey,
    title: ref.title,
    authors: ref.authors,
    year: ref.year,
    entryType: ref.entryType,
    researchDomain: ref.researchDomain,
    // Calculer le nombre de citations entrantes et sortantes
    inDegree: allCitations.filter(c => c.citedId === ref.id).length,
    outDegree: allCitations.filter(c => c.citingId === ref.id).length,
  }));
  
  // Construire les liens
  const links = allCitations
    .filter(c => refMap.has(c.citingId) && refMap.has(c.citedId))
    .map(c => ({
      id: c.id,
      source: c.citingId,
      target: c.citedId,
      citationType: c.citationType,
      weight: c.weight || 1,
      verified: c.verified,
    }));
  
  return { nodes, links };
}

/**
 * Récupère les références qui citent une référence donnée
 */
export async function getCitationsOf(citedId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const citations = await db
    .select({
      citation: referenceCitations,
      citing: bibliographyEntries,
    })
    .from(referenceCitations)
    .innerJoin(bibliographyEntries, eq(referenceCitations.citingId, bibliographyEntries.id))
    .where(eq(referenceCitations.citedId, citedId))
    .orderBy(desc(bibliographyEntries.year));
  
  return citations.map(c => ({
    ...c.citation,
    citingReference: c.citing,
  }));
}

/**
 * Récupère les références citées par une référence donnée
 */
export async function getCitedBy(citingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const citations = await db
    .select({
      citation: referenceCitations,
      cited: bibliographyEntries,
    })
    .from(referenceCitations)
    .innerJoin(bibliographyEntries, eq(referenceCitations.citedId, bibliographyEntries.id))
    .where(eq(referenceCitations.citingId, citingId))
    .orderBy(desc(bibliographyEntries.year));
  
  return citations.map(c => ({
    ...c.citation,
    citedReference: c.cited,
  }));
}

/**
 * Crée une nouvelle citation entre deux références
 */
export async function createReferenceCitation(data: {
  citingId: number;
  citedId: number;
  citationType?: string;
  context?: string;
  pageNumber?: string;
  notes?: string;
  weight?: number;
  addedBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  // Vérifier que les deux références existent
  const [citing] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.id, data.citingId));
  const [cited] = await db.select().from(bibliographyEntries).where(eq(bibliographyEntries.id, data.citedId));
  
  if (!citing || !cited) {
    throw new Error("Une ou les deux références n'existent pas");
  }
  
  // Vérifier qu'on ne cite pas soi-même
  if (data.citingId === data.citedId) {
    throw new Error("Une référence ne peut pas se citer elle-même");
  }
  
  const [result] = await db.insert(referenceCitations).values({
    citingId: data.citingId,
    citedId: data.citedId,
    citationType: (data.citationType || 'direct') as any,
    context: data.context,
    pageNumber: data.pageNumber,
    notes: data.notes,
    weight: data.weight || 1,
    addedBy: data.addedBy,
  });
  
  return getReferenceCitationById(result.insertId);
}

/**
 * Met à jour une citation
 */
export async function updateReferenceCitation(id: number, data: {
  citationType?: string;
  context?: string;
  pageNumber?: string;
  notes?: string;
  weight?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(referenceCitations)
    .set(data as any)
    .where(eq(referenceCitations.id, id));
  
  return getReferenceCitationById(id);
}

/**
 * Supprime une citation
 */
export async function deleteReferenceCitation(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(referenceCitations).where(eq(referenceCitations.id, id));
  return true;
}

/**
 * Vérifie une citation
 */
export async function verifyReferenceCitation(id: number, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(referenceCitations)
    .set({
      verified: true,
      verifiedBy: userId,
      verifiedAt: new Date(),
    } as any)
    .where(eq(referenceCitations.id, id));
  
  return getReferenceCitationById(id);
}

/**
 * Statistiques du graphe de citations
 */
export async function getCitationGraphStats() {
  const db = await getDb();
  if (!db) return null;
  
  // Nombre total de citations
  const [totalCitations] = await db.select({ count: count() }).from(referenceCitations);
  
  // Citations par type
  const byType = await db
    .select({
      type: referenceCitations.citationType,
      count: count(),
    })
    .from(referenceCitations)
    .groupBy(referenceCitations.citationType);
  
  // Nombre de références avec au moins une citation
  const citingRefs = await db
    .selectDistinct({ id: referenceCitations.citingId })
    .from(referenceCitations);
  
  const citedRefs = await db
    .selectDistinct({ id: referenceCitations.citedId })
    .from(referenceCitations);
  
  // Références les plus citées (top 10)
  const mostCited = await db
    .select({
      citedId: referenceCitations.citedId,
      count: count(),
    })
    .from(referenceCitations)
    .groupBy(referenceCitations.citedId)
    .orderBy(desc(count()))
    .limit(10);
  
  // Enrichir avec les infos des références
  const mostCitedWithInfo = await Promise.all(
    mostCited.map(async (mc) => {
      const [ref] = await db
        .select()
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.id, mc.citedId));
      return {
        ...mc,
        reference: ref,
      };
    })
  );
  
  // Références qui citent le plus (top 10)
  const mostCiting = await db
    .select({
      citingId: referenceCitations.citingId,
      count: count(),
    })
    .from(referenceCitations)
    .groupBy(referenceCitations.citingId)
    .orderBy(desc(count()))
    .limit(10);
  
  const mostCitingWithInfo = await Promise.all(
    mostCiting.map(async (mc) => {
      const [ref] = await db
        .select()
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.id, mc.citingId));
      return {
        ...mc,
        reference: ref,
      };
    })
  );
  
  // Citations vérifiées vs non vérifiées
  const [verifiedCount] = await db
    .select({ count: count() })
    .from(referenceCitations)
    .where(eq(referenceCitations.verified, true));
  
  return {
    totalCitations: totalCitations?.count || 0,
    totalCitingReferences: citingRefs.length,
    totalCitedReferences: citedRefs.length,
    byType,
    mostCited: mostCitedWithInfo,
    mostCiting: mostCitingWithInfo,
    verifiedCount: verifiedCount?.count || 0,
    unverifiedCount: (totalCitations?.count || 0) - (verifiedCount?.count || 0),
  };
}


// ============================================================================
// V3 REFERENCES (Pack Niche Innovations)
// ============================================================================

/**
 * Get all thematic axes
 */
export async function getAllThematicAxes() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(thematicAxes)
    .orderBy(thematicAxes.displayOrder);
}

/**
 * Get thematic axis by code
 */
export async function getThematicAxisByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const [axis] = await db
    .select()
    .from(thematicAxes)
    .where(eq(thematicAxes.axisCode, code));
  return axis;
}

/**
 * Get all v3 references
 */
export async function getAllV3References() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year), v3References.title);
}

/**
 * Get v3 reference by ID
 */
export async function getV3ReferenceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, id));
  return ref;
}

/**
 * Get v3 reference by entry key
 */
export async function getV3ReferenceByKey(entryKey: string) {
  const db = await getDb();
  if (!db) return null;
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.entryKey, entryKey));
  return ref;
}

/**
 * Get v3 references by axis code
 */
export async function getV3ReferencesByAxis(axisCode: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(v3References)
    .where(
      or(
        like(v3References.axisPrimaryCode, `${axisCode}%`),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, `%${axisCode}%`)
      )
    )
    .orderBy(desc(v3References.year));
}

/**
 * Get v3 references by meta-axis
 */
export async function getV3ReferencesByMetaAxis(metaAxis: 'meta_a' | 'meta_b' | 'meta_c' | 'other') {
  const db = await getDb();
  if (!db) return [];
  // Get all axis codes for this meta-axis
  const axes = await db
    .select({ code: thematicAxes.axisCode })
    .from(thematicAxes)
    .where(eq(thematicAxes.metaAxis, metaAxis));
  
  const axisCodes = axes.map(a => a.code);
  
  if (axisCodes.length === 0) return [];
  
  // Build OR conditions for each axis code
  const conditions = axisCodes.map(code => 
    or(
      like(v3References.axisPrimaryCode, `${code}%`),
      like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, `%${code}%`)
    )
  );
  
  return db
    .select()
    .from(v3References)
    .where(or(...conditions))
    .orderBy(desc(v3References.year));
}

/**
 * Search v3 references
 */
export async function searchV3References(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db
    .select()
    .from(v3References)
    .where(
      or(
        like(v3References.title, searchTerm),
        like(v3References.authors, searchTerm),
        like(v3References.notes, searchTerm),
        like(sql`JSON_EXTRACT(${v3References.tags}, '$')`, searchTerm)
      )
    )
    .orderBy(desc(v3References.year));
}

/**
 * Update v3 reference user notes
 */
export async function updateV3ReferenceUserNotes(id: number, userNotes: string) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(v3References)
    .set({ userNotes })
    .where(eq(v3References.id, id));
  return getV3ReferenceById(id);
}

/**
 * Update v3 reference read status
 */
export async function updateV3ReferenceReadStatus(id: number, readStatus: 'unread' | 'reading' | 'read' | 'to_review') {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(v3References)
    .set({ readStatus })
    .where(eq(v3References.id, id));
  return getV3ReferenceById(id);
}

/**
 * Update v3 reference relevance score
 */
export async function updateV3ReferenceRelevance(id: number, relevanceScore: number) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(v3References)
    .set({ relevanceScore })
    .where(eq(v3References.id, id));
  return getV3ReferenceById(id);
}

/**
 * Get v3 references statistics
 */
export async function getV3ReferencesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byType: [], byReadStatus: [], byYear: [] };
  const [totalCount] = await db
    .select({ count: count() })
    .from(v3References);
  
  const byType = await db
    .select({
      type: v3References.entryType,
      count: count(),
    })
    .from(v3References)
    .groupBy(v3References.entryType);
  
  const byReadStatus = await db
    .select({
      status: v3References.readStatus,
      count: count(),
    })
    .from(v3References)
    .groupBy(v3References.readStatus);
  
  const byYear = await db
    .select({
      year: v3References.year,
      count: count(),
    })
    .from(v3References)
    .where(isNotNull(v3References.year))
    .groupBy(v3References.year)
    .orderBy(desc(v3References.year));
  
  return {
    total: totalCount?.count || 0,
    byType,
    byReadStatus,
    byYear,
  };
}

// ============================================================================
// REFERENCE TAGS
// ============================================================================

/**
 * Get all reference tags
 */
export async function getAllReferenceTags() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(referenceTags)
    .orderBy(desc(referenceTags.usageCount), referenceTags.name);
}

/**
 * Get reference tags by category
 */
export async function getReferenceTagsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(referenceTags)
    .where(eq(referenceTags.category, category as any))
    .orderBy(referenceTags.name);
}

/**
 * Get reference tag by slug
 */
export async function getReferenceTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const [tag] = await db
    .select()
    .from(referenceTags)
    .where(eq(referenceTags.slug, slug));
  return tag;
}

/**
 * Create a new reference tag
 */
export async function createReferenceTag(data: {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  color?: string;
  parentId?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(referenceTags)
    .values(data as any);
  return getReferenceTagBySlug(data.slug);
}

/**
 * Update a reference tag
 */
export async function updateReferenceTag(id: number, data: Partial<{
  name: string;
  description: string;
  color: string;
  category: string;
}>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(referenceTags)
    .set(data as any)
    .where(eq(referenceTags.id, id));
  const [tag] = await db
    .select()
    .from(referenceTags)
    .where(eq(referenceTags.id, id));
  return tag;
}

/**
 * Delete a reference tag
 */
export async function deleteReferenceTag(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(referenceTags)
    .where(eq(referenceTags.id, id));
  return { success: true };
}

/**
 * Add tag to v3 reference
 */
export async function addTagToV3Reference(referenceId: number, tagId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .insert(v3ReferenceTagLinks)
    .values({ referenceId, tagId })
    .onDuplicateKeyUpdate({ set: { referenceId } });
  
  // Increment usage count
  await db
    .update(referenceTags)
    .set({ usageCount: sql`${referenceTags.usageCount} + 1` })
    .where(eq(referenceTags.id, tagId));
  
  return { success: true };
}

/**
 * Remove tag from v3 reference
 */
export async function removeTagFromV3Reference(referenceId: number, tagId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(v3ReferenceTagLinks)
    .where(
      and(
        eq(v3ReferenceTagLinks.referenceId, referenceId),
        eq(v3ReferenceTagLinks.tagId, tagId)
      )
    );
  
  // Decrement usage count
  await db
    .update(referenceTags)
    .set({ usageCount: sql`GREATEST(${referenceTags.usageCount} - 1, 0)` })
    .where(eq(referenceTags.id, tagId));
  
  return { success: true };
}

/**
 * Get tags for a v3 reference
 */
export async function getTagsForV3Reference(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  const links = await db
    .select({
      tag: referenceTags,
    })
    .from(v3ReferenceTagLinks)
    .innerJoin(referenceTags, eq(v3ReferenceTagLinks.tagId, referenceTags.id))
    .where(eq(v3ReferenceTagLinks.referenceId, referenceId));
  
  return links.map(l => l.tag);
}

/**
 * Get v3 references by tag
 */
export async function getV3ReferencesByTag(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  const links = await db
    .select({
      reference: v3References,
    })
    .from(v3ReferenceTagLinks)
    .innerJoin(v3References, eq(v3ReferenceTagLinks.referenceId, v3References.id))
    .where(eq(v3ReferenceTagLinks.tagId, tagId));
  
  return links.map(l => l.reference);
}

// ============================================================================
// REFERENCE NOTES
// ============================================================================

/**
 * Get all notes for a v3 reference
 */
export async function getNotesForV3Reference(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(referenceNotes)
    .where(eq(referenceNotes.referenceId, referenceId))
    .orderBy(desc(referenceNotes.createdAt));
}

/**
 * Get reference note by ID
 */
export async function getReferenceNoteById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [note] = await db
    .select()
    .from(referenceNotes)
    .where(eq(referenceNotes.id, id));
  return note;
}

/**
 * Create a reference note
 */
export async function createReferenceNote(data: {
  referenceId: number;
  noteType?: string;
  title?: string;
  content: string;
  pageNumber?: string;
  importance?: string;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(referenceNotes)
    .values(data as any);
  
  // Get the inserted note
  const [note] = await db
    .select()
    .from(referenceNotes)
    .where(eq(referenceNotes.referenceId, data.referenceId))
    .orderBy(desc(referenceNotes.createdAt))
    .limit(1);
  
  return note;
}

/**
 * Update a reference note
 */
export async function updateReferenceNote(id: number, data: Partial<{
  noteType: string;
  title: string;
  content: string;
  pageNumber: string;
  importance: string;
  isResolved: boolean;
}>) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(referenceNotes)
    .set(data as any)
    .where(eq(referenceNotes.id, id));
  return getReferenceNoteById(id);
}

/**
 * Delete a reference note
 */
export async function deleteReferenceNote(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(referenceNotes)
    .where(eq(referenceNotes.id, id));
  return { success: true };
}

/**
 * Get notes by type
 */
export async function getReferenceNotesByType(noteType: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      note: referenceNotes,
      reference: v3References,
    })
    .from(referenceNotes)
    .innerJoin(v3References, eq(referenceNotes.referenceId, v3References.id))
    .where(eq(referenceNotes.noteType, noteType as any))
    .orderBy(desc(referenceNotes.createdAt));
}

/**
 * Get unresolved notes (todos and questions)
 */
export async function getUnresolvedReferenceNotes() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      note: referenceNotes,
      reference: v3References,
    })
    .from(referenceNotes)
    .innerJoin(v3References, eq(referenceNotes.referenceId, v3References.id))
    .where(
      and(
        or(
          eq(referenceNotes.noteType, 'todo'),
          eq(referenceNotes.noteType, 'question')
        ),
        eq(referenceNotes.isResolved, false)
      )
    )
    .orderBy(desc(referenceNotes.importance), desc(referenceNotes.createdAt));
}

// ============================================================================
// AXIS CONNECTIONS (for D3.js graph)
// ============================================================================

/**
 * Get all axis connections
 */
export async function getAllAxisConnections() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(axisConnections)
    .orderBy(desc(axisConnections.strength));
}

/**
 * Get axis connections for a specific axis
 */
export async function getAxisConnectionsForAxis(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(axisConnections)
    .where(
      or(
        eq(axisConnections.sourceAxisId, axisId),
        eq(axisConnections.targetAxisId, axisId)
      )
    );
}

/**
 * Get graph data for D3.js visualization
 */
export async function getAxisGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  // Get all axes as nodes
  const axes = await getAllThematicAxes();
  
  // Get all connections as links
  const connections = await getAllAxisConnections();
  
  // Get reference counts per axis
  const refCounts = await db
    .select({
      axisCode: v3References.axisPrimaryCode,
      count: count(),
    })
    .from(v3References)
    .where(isNotNull(v3References.axisPrimaryCode))
    .groupBy(v3References.axisPrimaryCode);
  
  const countMap = new Map(refCounts.map(r => [r.axisCode?.split(' ')[0], r.count]));
  
  // Build nodes with reference counts
  const nodes = axes.map(axis => ({
    id: axis.id,
    code: axis.axisCode,
    name: axis.name,
    metaAxis: axis.metaAxis,
    color: axis.color,
    referenceCount: countMap.get(axis.axisCode) || 0,
  }));
  
  // Build links
  const links = connections.map((conn: any) => ({
    source: conn.sourceAxisId,
    target: conn.targetAxisId,
    strength: conn.strength,
    type: conn.connectionType,
  }));
  
  return { nodes, links };
}

/**
 * Create an axis connection
 */
export async function createAxisConnection(data: {
  sourceAxisId: number;
  targetAxisId: number;
  strength?: number;
  connectionType?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .insert(axisConnections)
    .values(data as any)
    .onDuplicateKeyUpdate({ set: { strength: data.strength } });
  return { success: true };
}

/**
 * Update axis connection strength
 */
export async function updateAxisConnectionStrength(sourceId: number, targetId: number, strength: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .update(axisConnections)
    .set({ strength })
    .where(
      and(
        eq(axisConnections.sourceAxisId, sourceId),
        eq(axisConnections.targetAxisId, targetId)
      )
    );
  return { success: true };
}

/**
 * Delete an axis connection
 */
export async function deleteAxisConnection(sourceId: number, targetId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(axisConnections)
    .where(
      and(
        eq(axisConnections.sourceAxisId, sourceId),
        eq(axisConnections.targetAxisId, targetId)
      )
    );
  return { success: true };
}



// ============================================================================
// REFERENCE ENTITY LINKS (Liaisons références-entités)
// ============================================================================

/**
 * Create a link between a reference and an entity
 */
export async function createReferenceEntityLink(data: {
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  context?: string;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(referenceEntityLinks)
    .values({
      referenceId: data.referenceId,
      entityType: data.entityType,
      entityId: data.entityId,
      linkType: data.linkType || 'documents',
      relevanceScore: data.relevanceScore || 50,
      notes: data.notes,
      context: data.context,
      createdBy: data.createdBy,
    })
    .$returningId();
  return result;
}

/**
 * Get all links for a reference with entity names
 */
export async function getLinksForReference(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.referenceId, referenceId))
    .orderBy(desc(referenceEntityLinks.relevanceScore));
  
  // Enrich with entity names
  const enrichedLinks = await Promise.all(
    links.map(async (link) => {
      let entityName = '';
      try {
        switch (link.entityType) {
          case 'molecule': {
            const [mol] = await db.select({ name: molecules.name }).from(molecules).where(eq(molecules.id, link.entityId));
            entityName = mol?.name || '';
            break;
          }
          case 'plant': {
            const [plant] = await db.select({ name: plants.name }).from(plants).where(eq(plants.id, link.entityId));
            entityName = plant?.name || '';
            break;
          }
          case 'recette': {
            const [rec] = await db.select({ name: recettes.name }).from(recettes).where(eq(recettes.id, link.entityId));
            entityName = rec?.name || '';
            break;
          }
          case 'terroir': {
            const [ter] = await db.select({ name: terroirs.name }).from(terroirs).where(eq(terroirs.id, link.entityId));
            entityName = ter?.name || '';
            break;
          }
          case 'prototype': {
            const [proto] = await db.select({ name: prototypes.name }).from(prototypes).where(eq(prototypes.id, link.entityId));
            entityName = proto?.name || '';
            break;
          }
          case 'tradition': {
            const [trad] = await db.select({ name: olfactoryTraditions.name }).from(olfactoryTraditions).where(eq(olfactoryTraditions.id, link.entityId));
            entityName = trad?.name || '';
            break;
          }
          case 'leaf_economy': {
            const [leaf] = await db.select({ sampleId: leafEconomies.sampleId, species: leafEconomies.species }).from(leafEconomies).where(eq(leafEconomies.id, link.entityId));
            entityName = leaf?.species || leaf?.sampleId || '';
            break;
          }
          case 'supplier': {
            const [sup] = await db.select({ name: extendedSuppliers.name }).from(extendedSuppliers).where(eq(extendedSuppliers.id, link.entityId));
            entityName = sup?.name || '';
            break;
          }
        }
      } catch (e) {
        // Entity not found
      }
      return { ...link, entityName };
    })
  );
  
  return enrichedLinks;
}

/**
 * Get all references linked to an entity
 */
export async function getReferencesForEntity(
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier',
  entityId: number
) {
  const db = await getDb();
  if (!db) return [];
  const links = await db
    .select({
      link: referenceEntityLinks,
      reference: v3References,
    })
    .from(referenceEntityLinks)
    .innerJoin(v3References, eq(referenceEntityLinks.referenceId, v3References.id))
    .where(
      and(
        eq(referenceEntityLinks.entityType, entityType),
        eq(referenceEntityLinks.entityId, entityId)
      )
    )
    .orderBy(desc(referenceEntityLinks.relevanceScore));
  return links;
}

/**
 * Get all links by entity type
 */
export async function getLinksByEntityType(
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier'
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      link: referenceEntityLinks,
      reference: v3References,
    })
    .from(referenceEntityLinks)
    .innerJoin(v3References, eq(referenceEntityLinks.referenceId, v3References.id))
    .where(eq(referenceEntityLinks.entityType, entityType))
    .orderBy(desc(referenceEntityLinks.relevanceScore));
}

/**
 * Get links for Heritage & Conservation axes (H1, H2, H3)
 */
export async function getHeritageConservationLinks() {
  const db = await getDb();
  if (!db) return [];
  // Get references with H1, H2, or H3 axes
  const refs = await db
    .select()
    .from(v3References)
    .where(
      or(
        like(v3References.axisPrimaryCode, 'H%'),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, '%H1%'),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, '%H2%'),
        like(sql`JSON_EXTRACT(${v3References.axesSecondary}, '$')`, '%H3%')
      )
    );
  
  const refIds = refs.map(r => r.id);
  if (refIds.length === 0) return [];
  
  // Get all links for these references
  const links = await db
    .select()
    .from(referenceEntityLinks)
    .where(inArray(referenceEntityLinks.referenceId, refIds));
  
  return { references: refs, links };
}

/**
 * Update a reference entity link
 */
export async function updateReferenceEntityLink(
  id: number,
  data: {
    linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
    relevanceScore?: number;
    notes?: string;
    context?: string;
  }
) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(referenceEntityLinks)
    .set(data)
    .where(eq(referenceEntityLinks.id, id));
  const [updated] = await db
    .select()
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.id, id));
  return updated;
}

/**
 * Delete a reference entity link
 */
export async function deleteReferenceEntityLink(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(referenceEntityLinks)
    .where(eq(referenceEntityLinks.id, id));
  return { success: true };
}

/**
 * Get statistics for reference entity links
 */
export async function getReferenceEntityLinkStats() {
  const db = await getDb();
  if (!db) return { total: 0, byEntityType: [], byLinkType: [] };
  
  const [totalCount] = await db
    .select({ count: count() })
    .from(referenceEntityLinks);
  
  const byEntityType = await db
    .select({
      entityType: referenceEntityLinks.entityType,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.entityType);
  
  const byLinkType = await db
    .select({
      linkType: referenceEntityLinks.linkType,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.linkType);
  
  return {
    total: totalCount?.count || 0,
    byEntityType,
    byLinkType,
  };
}


// ============================================================================
// OLFACTORY TRADITIONS (Traditions olfactives)
// ============================================================================

/**
 * Create an olfactory tradition
 */
export async function createOlfactoryTradition(data: {
  code: string;
  name: string;
  period?: string;
  startYear?: number;
  endYear?: number;
  region?: string;
  civilization?: string;
  description?: string;
  historicalContext?: string;
  knownIngredients?: string[];
  techniques?: string[];
  reconstructionStatus?: 'documented' | 'partial' | 'reconstructed' | 'speculative';
  primarySources?: string;
  modernSources?: string;
  tags?: string[];
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db
    .insert(olfactoryTraditions)
    .values({
      code: data.code,
      name: data.name,
      period: data.period,
      startYear: data.startYear,
      endYear: data.endYear,
      region: data.region,
      civilization: data.civilization,
      description: data.description,
      historicalContext: data.historicalContext,
      knownIngredients: data.knownIngredients,
      techniques: data.techniques,
      reconstructionStatus: data.reconstructionStatus || 'documented',
      primarySources: data.primarySources,
      modernSources: data.modernSources,
      tags: data.tags,
      createdBy: data.createdBy,
    })
    .$returningId();
  return result;
}

/**
 * Get all olfactory traditions
 */
export async function getAllOlfactoryTraditions() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .orderBy(olfactoryTraditions.startYear, olfactoryTraditions.name);
}

/**
 * Get olfactory tradition by ID
 */
export async function getOlfactoryTraditionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [tradition] = await db
    .select()
    .from(olfactoryTraditions)
    .where(eq(olfactoryTraditions.id, id));
  return tradition;
}

/**
 * Get olfactory tradition by code
 */
export async function getOlfactoryTraditionByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const [tradition] = await db
    .select()
    .from(olfactoryTraditions)
    .where(eq(olfactoryTraditions.code, code));
  return tradition;
}

/**
 * Get olfactory traditions by region
 */
export async function getOlfactoryTraditionsByRegion(region: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .where(like(olfactoryTraditions.region, `%${region}%`))
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Get olfactory traditions by period
 */
export async function getOlfactoryTraditionsByPeriod(period: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .where(like(olfactoryTraditions.period, `%${period}%`))
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Get olfactory traditions by reconstruction status
 */
export async function getOlfactoryTraditionsByStatus(
  status: 'documented' | 'partial' | 'reconstructed' | 'speculative'
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(olfactoryTraditions)
    .where(eq(olfactoryTraditions.reconstructionStatus, status))
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Update an olfactory tradition
 */
export async function updateOlfactoryTradition(
  id: number,
  data: Partial<{
    name: string;
    period: string;
    startYear: number;
    endYear: number;
    region: string;
    civilization: string;
    description: string;
    historicalContext: string;
    knownIngredients: string[];
    techniques: string[];
    reconstructionStatus: 'documented' | 'partial' | 'reconstructed' | 'speculative';
    primarySources: string;
    modernSources: string;
    tags: string[];
  }>
) {
  const db = await getDb();
  if (!db) return null;
  await db
    .update(olfactoryTraditions)
    .set(data)
    .where(eq(olfactoryTraditions.id, id));
  return getOlfactoryTraditionById(id);
}

/**
 * Delete an olfactory tradition
 */
export async function deleteOlfactoryTradition(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  await db
    .delete(olfactoryTraditions)
    .where(eq(olfactoryTraditions.id, id));
  return { success: true };
}

/**
 * Search olfactory traditions
 */
export async function searchOlfactoryTraditions(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db
    .select()
    .from(olfactoryTraditions)
    .where(
      or(
        like(olfactoryTraditions.name, searchTerm),
        like(olfactoryTraditions.description, searchTerm),
        like(olfactoryTraditions.region, searchTerm),
        like(olfactoryTraditions.civilization, searchTerm),
        like(olfactoryTraditions.period, searchTerm)
      )
    )
    .orderBy(olfactoryTraditions.startYear);
}

/**
 * Get olfactory traditions statistics
 */
export async function getOlfactoryTraditionsStats() {
  const db = await getDb();
  if (!db) return { total: 0, byStatus: [], byRegion: [], byPeriod: [] };
  
  const [totalCount] = await db
    .select({ count: count() })
    .from(olfactoryTraditions);
  
  const byStatus = await db
    .select({
      status: olfactoryTraditions.reconstructionStatus,
      count: count(),
    })
    .from(olfactoryTraditions)
    .groupBy(olfactoryTraditions.reconstructionStatus);
  
  const byRegion = await db
    .select({
      region: olfactoryTraditions.region,
      count: count(),
    })
    .from(olfactoryTraditions)
    .where(isNotNull(olfactoryTraditions.region))
    .groupBy(olfactoryTraditions.region);
  
  const byPeriod = await db
    .select({
      period: olfactoryTraditions.period,
      count: count(),
    })
    .from(olfactoryTraditions)
    .where(isNotNull(olfactoryTraditions.period))
    .groupBy(olfactoryTraditions.period);
  
  return {
    total: totalCount?.count || 0,
    byStatus,
    byRegion,
    byPeriod,
  };
}


// ============================================================================
// CONTRIBUTOR INTERFACE - DUPLICATE DETECTION
// ============================================================================

/**
 * Recherche de doublons potentiels pour une molécule
 * Vérifie par nom (similarité), CAS number et IUPAC name
 */
export async function findMoleculeDuplicates(data: {
  name?: string;
  casNumber?: string;
  iupacName?: string;
}) {
  const db = await getDb();
  if (!db) return { exact: [], similar: [] };
  
  const exact: Molecule[] = [];
  const similar: Molecule[] = [];
  
  // Recherche exacte par CAS number (identifiant unique)
  if (data.casNumber) {
    const casMatches = await db.select().from(molecules)
      .where(eq(molecules.casNumber, data.casNumber));
    exact.push(...casMatches);
  }
  
  // Recherche exacte par nom
  if (data.name) {
    const nameMatches = await db.select().from(molecules)
      .where(eq(molecules.name, data.name));
    // Éviter les doublons si déjà trouvé par CAS
    for (const m of nameMatches) {
      if (!exact.find(e => e.id === m.id)) {
        exact.push(m);
      }
    }
  }
  
  // Recherche similaire par nom (LIKE)
  if (data.name && data.name.length >= 3) {
    const similarMatches = await db.select().from(molecules)
      .where(like(molecules.name, `%${data.name}%`))
      .limit(10);
    for (const m of similarMatches) {
      if (!exact.find(e => e.id === m.id) && !similar.find(s => s.id === m.id)) {
        similar.push(m);
      }
    }
  }
  
  // Recherche par IUPAC name
  if (data.iupacName) {
    const iupacMatches = await db.select().from(molecules)
      .where(like(molecules.iupacName, `%${data.iupacName}%`))
      .limit(5);
    for (const m of iupacMatches) {
      if (!exact.find(e => e.id === m.id) && !similar.find(s => s.id === m.id)) {
        similar.push(m);
      }
    }
  }
  
  return { exact, similar };
}

/**
 * Recherche de doublons potentiels pour une plante
 * Vérifie par nom commun et nom latin
 */
export async function findPlantDuplicates(data: {
  name?: string;
  latinName?: string;
}) {
  const db = await getDb();
  if (!db) return { exact: [], similar: [] };
  
  const exact: Plant[] = [];
  const similar: Plant[] = [];
  
  // Recherche exacte par nom latin (identifiant unique)
  if (data.latinName) {
    const latinMatches = await db.select().from(plants)
      .where(eq(plants.latinName, data.latinName));
    exact.push(...latinMatches);
  }
  
  // Recherche exacte par nom commun
  if (data.name) {
    const nameMatches = await db.select().from(plants)
      .where(eq(plants.name, data.name));
    for (const p of nameMatches) {
      if (!exact.find(e => e.id === p.id)) {
        exact.push(p);
      }
    }
  }
  
  // Recherche similaire par nom commun
  if (data.name && data.name.length >= 3) {
    const similarMatches = await db.select().from(plants)
      .where(like(plants.name, `%${data.name}%`))
      .limit(10);
    for (const p of similarMatches) {
      if (!exact.find(e => e.id === p.id) && !similar.find(s => s.id === p.id)) {
        similar.push(p);
      }
    }
  }
  
  // Recherche similaire par nom latin
  if (data.latinName && data.latinName.length >= 3) {
    const latinSimilar = await db.select().from(plants)
      .where(like(plants.latinName, `%${data.latinName}%`))
      .limit(10);
    for (const p of latinSimilar) {
      if (!exact.find(e => e.id === p.id) && !similar.find(s => s.id === p.id)) {
        similar.push(p);
      }
    }
  }
  
  return { exact, similar };
}

/**
 * Recherche de molécules pour auto-complétion
 */
export async function searchMoleculesForAutocomplete(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  if (query.length < 2) return [];
  
  return db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    chemicalFormula: molecules.chemicalFormula,
    family: molecules.family,
  }).from(molecules)
    .where(
      or(
        like(molecules.name, `%${query}%`),
        like(molecules.casNumber, `%${query}%`),
        like(molecules.iupacName, `%${query}%`)
      )
    )
    .limit(limit);
}

/**
 * Recherche de plantes pour auto-complétion
 */
export async function searchPlantsForAutocomplete(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  if (query.length < 2) return [];
  
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    family: plants.family,
    category: plants.category,
  }).from(plants)
    .where(
      or(
        like(plants.name, `%${query}%`),
        like(plants.latinName, `%${query}%`)
      )
    )
    .limit(limit);
}

// ============================================================================
// PLANT-MOLECULE LINKS MANAGEMENT
// ============================================================================

/**
 * Récupère toutes les liaisons plante-molécule avec statistiques
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

// ============================================================================
// PUBCHEM ENRICHMENT LOGGING
// ============================================================================

/**
 * Met à jour une molécule avec les données PubChem
 */
export async function enrichMoleculeFromPubChem(
  moleculeId: number,
  pubchemData: {
    casNumber?: string;
    iupacName?: string;
    chemicalFormula?: string;
    molecularWeight?: number;
    pubchemCid?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const updateData: any = {};
  
  if (pubchemData.casNumber) updateData.casNumber = pubchemData.casNumber;
  if (pubchemData.iupacName) updateData.iupacName = pubchemData.iupacName;
  if (pubchemData.chemicalFormula) updateData.chemicalFormula = pubchemData.chemicalFormula;
  if (pubchemData.molecularWeight) updateData.molecularWeight = pubchemData.molecularWeight;
  
  // Ajouter une référence PubChem si CID fourni
  if (pubchemData.pubchemCid) {
    const molecule = await getMoleculeById(moleculeId);
    const existingRefs = molecule?.references || [];
    const pubchemRef = {
      type: 'pubchem' as const,
      title: `PubChem CID: ${pubchemData.pubchemCid}`,
      url: `https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemData.pubchemCid}`,
    };
    
    // Éviter les doublons
    if (!existingRefs.find(r => r.url === pubchemRef.url)) {
      updateData.references = [...existingRefs, pubchemRef];
    }
  }
  
  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, moleculeId));
  }
  
  return getMoleculeById(moleculeId);
}

/**
 * Récupère les molécules candidates pour enrichissement PubChem
 * (sans CAS number ou sans IUPAC name)
 */
export async function getMoleculesForPubChemEnrichment(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(molecules)
    .where(
      or(
        isNull(molecules.casNumber),
        isNull(molecules.iupacName)
      )
    )
    .orderBy(molecules.name)
    .limit(limit);
}

/**
 * Statistiques d'enrichissement des molécules
 */
export async function getMoleculeEnrichmentStats() {
  const db = await getDb();
  if (!db) return { total: 0, withCas: 0, withIupac: 0, withBoth: 0, withNeither: 0 };
  
  const [total] = await db.select({ count: count() }).from(molecules);
  const [withCas] = await db.select({ count: count() }).from(molecules).where(isNotNull(molecules.casNumber));
  const [withIupac] = await db.select({ count: count() }).from(molecules).where(isNotNull(molecules.iupacName));
  const [withBoth] = await db.select({ count: count() }).from(molecules)
    .where(and(isNotNull(molecules.casNumber), isNotNull(molecules.iupacName)));
  const [withNeither] = await db.select({ count: count() }).from(molecules)
    .where(and(isNull(molecules.casNumber), isNull(molecules.iupacName)));
  
  return {
    total: total?.count || 0,
    withCas: withCas?.count || 0,
    withIupac: withIupac?.count || 0,
    withBoth: withBoth?.count || 0,
    withNeither: withNeither?.count || 0,
    percentageWithCas: total?.count ? Math.round((withCas?.count || 0) / total.count * 100) : 0,
    percentageWithIupac: total?.count ? Math.round((withIupac?.count || 0) / total.count * 100) : 0,
  };
}


// ============================================================================
// CRUD COMPLET POUR ACCORDS, FAMILLES, LABORATOIRE
// ============================================================================

/**
 * Mise à jour complète d'un accord
 */
export async function updateAccordFull(id: number, data: {
  name?: string;
  familyId?: number | null;
  olfactiveProfile?: string;
  emotionalResonance?: string;
  texture?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.familyId !== undefined) updateData.familyId = data.familyId;
  if (data.olfactiveProfile !== undefined) updateData.olfactiveProfile = data.olfactiveProfile;
  if (data.emotionalResonance !== undefined) updateData.emotionalResonance = data.emotionalResonance;
  if (data.texture !== undefined) updateData.texture = data.texture;
  if (data.notes !== undefined) updateData.notes = data.notes;
  
  await db.update(accords).set(updateData).where(eq(accords.id, id));
  return getAccordById(id);
}

/**
 * Suppression d'un accord
 */
export async function deleteAccord(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(accords).where(eq(accords.id, id));
  return { success: true };
}

/**
 * Mise à jour complète d'une famille
 */
export async function updateFamilyFull(id: number, data: {
  name?: string;
  description?: string;
  type?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type !== undefined) updateData.type = data.type;
  
  await db.update(families).set(updateData).where(eq(families.id, id));
  return getFamilyById(id);
}

/**
 * Suppression d'une famille
 */
export async function deleteFamily(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(families).where(eq(families.id, id));
  return { success: true };
}

/**
 * Mise à jour complète d'une matière première
 */
export async function updateMatiereFull(id: number, data: {
  name?: string;
  botanicalName?: string;
  type?: "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre";
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
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.botanicalName !== undefined) updateData.botanicalName = data.botanicalName;
  if (data.type !== undefined) updateData.type = data.type;
  if ((data as any).olfactiveFamily !== undefined) updateData.olfactiveFamily = (data as any).olfactiveFamily;
  if ((data as any).family !== undefined) updateData.family = (data as any).family;
  if (data.note !== undefined) updateData.note = data.note;
  if (data.origin !== undefined) updateData.origin = data.origin;
  if (data.extractionMethod !== undefined) updateData.extractionMethod = data.extractionMethod;
  if (data.olfactiveProfile !== undefined) updateData.olfactiveProfile = data.olfactiveProfile;
  if (data.character !== undefined) updateData.character = data.character;
  if (data.supplier !== undefined) updateData.supplier = data.supplier;
  if (data.pricePerMl !== undefined) updateData.pricePerMl = data.pricePerMl;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.technicalNotes !== undefined) updateData.technicalNotes = data.technicalNotes;
  if (data.manipulationNotes !== undefined) updateData.manipulationNotes = data.manipulationNotes;
  if (data.maxTemperature !== undefined) updateData.maxTemperature = data.maxTemperature;
  
  await db.update(laboratoire).set(updateData).where(eq(laboratoire.id, id));
  return getMatiereById(id);
}

/**
 * Suppression d'une matière première
 */
export async function deleteMatiere(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(laboratoire).where(eq(laboratoire.id, id));
  return { success: true };
}


// ============================================================================
// AUDIT ET IMPORT EN MASSE DES LIAISONS PLANTE-TERROIR
// ============================================================================

/**
 * Récupère les statistiques d'audit des liaisons plante-terroir
 */
export async function getPlantTerroirAuditStats() {
  const db = await getDb();
  if (!db) return null;

  // Compter les plantes et terroirs
  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const allRelations = await db.select().from(plantTerroirs);

  // Identifier les plantes sans terroir
  const plantIdsWithTerroir = new Set(allRelations.map(r => r.plantId));
  const plantsWithoutTerroir = allPlants.filter(p => !plantIdsWithTerroir.has(p.id));

  // Identifier les terroirs sans plante
  const terroirIdsWithPlant = new Set(allRelations.map(r => r.terroirId));
  const terroirsWithoutPlant = allTerroirs.filter(t => !terroirIdsWithPlant.has(t.id));

  // Compter les liaisons par plante
  const plantLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    plantLinkCounts[r.plantId] = (plantLinkCounts[r.plantId] || 0) + 1;
  });

  // Compter les liaisons par terroir
  const terroirLinkCounts: Record<number, number> = {};
  allRelations.forEach(r => {
    terroirLinkCounts[r.terroirId] = (terroirLinkCounts[r.terroirId] || 0) + 1;
  });

  // Plantes avec le plus de terroirs
  const topPlantsByTerroirs = allPlants
    .map(p => ({ ...p, terroirCount: plantLinkCounts[p.id] || 0 }))
    .filter(p => p.terroirCount > 0)
    .sort((a, b) => b.terroirCount - a.terroirCount)
    .slice(0, 10);

  // Terroirs avec le plus de plantes
  const topTerroirsByPlants = allTerroirs
    .map(t => ({ ...t, plantCount: terroirLinkCounts[t.id] || 0 }))
    .filter(t => t.plantCount > 0)
    .sort((a, b) => b.plantCount - a.plantCount)
    .slice(0, 10);

  // Plantes prioritaires (catégories importantes sans terroir)
  const priorityCategories = ['aromatique', 'medicinale', 'parfumerie'];
  const priorityPlantsWithoutTerroir = plantsWithoutTerroir
    .filter(p => p.category && priorityCategories.includes(p.category))
    .slice(0, 20);

  // Terroirs prioritaires (pays importants sans plantes)
  const priorityCountries = ['France', 'Italie', 'Bulgarie', 'Maroc', 'Inde', 'Madagascar', 'Égypte'];
  const priorityTerroirsWithoutPlant = terroirsWithoutPlant
    .filter(t => t.country && priorityCountries.includes(t.country))
    .slice(0, 20);

  return {
    totalPlants: allPlants.length,
    totalTerroirs: allTerroirs.length,
    totalRelations: allRelations.length,
    plantsWithTerroir: plantIdsWithTerroir.size,
    terroirsWithPlant: terroirIdsWithPlant.size,
    plantsWithoutTerroir: plantsWithoutTerroir.length,
    terroirsWithoutPlant: terroirsWithoutPlant.length,
    coveragePlants: allPlants.length > 0 ? Math.round((plantIdsWithTerroir.size / allPlants.length) * 100) : 0,
    coverageTerroirs: allTerroirs.length > 0 ? Math.round((terroirIdsWithPlant.size / allTerroirs.length) * 100) : 0,
    topPlantsByTerroirs,
    topTerroirsByPlants,
    priorityPlantsWithoutTerroir,
    priorityTerroirsWithoutPlant,
    plantsWithoutTerroirList: plantsWithoutTerroir.slice(0, 50),
    terroirsWithoutPlantList: terroirsWithoutPlant.slice(0, 50),
  };
}

/**
 * Récupère toutes les liaisons plante-terroir avec les noms
 */
export async function getAllPlantTerroirRelationsWithNames() {
  const db = await getDb();
  if (!db) return [];

  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const allRelations = await db.select().from(plantTerroirs);

  const plantMap = new Map(allPlants.map(p => [p.id, p]));
  const terroirMap = new Map(allTerroirs.map(t => [t.id, t]));

  return allRelations.map(r => ({
    ...r,
    plantName: plantMap.get(r.plantId)?.name || `Plante #${r.plantId}`,
    plantLatinName: plantMap.get(r.plantId)?.latinName,
    plantCategory: plantMap.get(r.plantId)?.category,
    terroirName: terroirMap.get(r.terroirId)?.name || `Terroir #${r.terroirId}`,
    terroirCountry: terroirMap.get(r.terroirId)?.country,
    terroirRegion: terroirMap.get(r.terroirId)?.region,
  }));
}

/**
 * Import en masse de liaisons plante-terroir
 */
export async function bulkImportPlantTerroirs(relations: Array<{
  plantId?: number;
  plantName?: string;
  terroirId?: number;
  terroirName?: string;
  localName?: string;
  cultivationStart?: number;
  annualProduction?: string;
  qualityNotes?: string;
  notes?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, imported: 0, errors: [] as string[] };

  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const existingRelations = await db.select().from(plantTerroirs);

  const plantNameMap = new Map(allPlants.map(p => [p.name.toLowerCase(), p.id]));
  const plantLatinNameMap = new Map(allPlants.filter(p => p.latinName).map(p => [p.latinName!.toLowerCase(), p.id]));
  const terroirNameMap = new Map(allTerroirs.map(t => [t.name.toLowerCase(), t.id]));

  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));

  const errors: string[] = [];
  let imported = 0;
  const toInsert: InsertPlantTerroir[] = [];

  for (let i = 0; i < relations.length; i++) {
    const rel = relations[i];
    const rowNum = i + 1;

    // Résoudre l'ID de la plante
    let plantId = rel.plantId;
    if (!plantId && rel.plantName) {
      const nameLower = rel.plantName.toLowerCase();
      plantId = plantNameMap.get(nameLower) || plantLatinNameMap.get(nameLower);
    }

    // Résoudre l'ID du terroir
    let terroirId = rel.terroirId;
    if (!terroirId && rel.terroirName) {
      terroirId = terroirNameMap.get(rel.terroirName.toLowerCase());
    }

    // Validation
    if (!plantId) {
      errors.push(`Ligne ${rowNum}: Plante non trouvée "${rel.plantName || rel.plantId}"`);
      continue;
    }
    if (!terroirId) {
      errors.push(`Ligne ${rowNum}: Terroir non trouvé "${rel.terroirName || rel.terroirId}"`);
      continue;
    }

    // Vérifier si la relation existe déjà
    const key = `${plantId}-${terroirId}`;
    if (existingSet.has(key)) {
      errors.push(`Ligne ${rowNum}: Liaison déjà existante (plante ${plantId} - terroir ${terroirId})`);
      continue;
    }

    toInsert.push({
      plantId,
      terroirId,
      localName: rel.localName || null,
      cultivationStart: rel.cultivationStart || null,
      annualProduction: rel.annualProduction || null,
      qualityNotes: rel.qualityNotes || null,
      notes: rel.notes || null,
    });
    existingSet.add(key); // Éviter les doublons dans le même import
  }

  // Insérer en masse
  if (toInsert.length > 0) {
    try {
      await db.insert(plantTerroirs).values(toInsert);
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
 * Suggestions de liaisons basées sur les origines géographiques des plantes
 */
export async function suggestPlantTerroirLinks() {
  const db = await getDb();
  if (!db) return [];

  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const existingRelations = await db.select().from(plantTerroirs);

  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));

  const suggestions: Array<{
    plantId: number;
    plantName: string;
    terroirId: number;
    terroirName: string;
    reason: string;
    confidence: 'high' | 'medium' | 'low';
  }> = [];

  for (const plant of allPlants) {
    if (!plant.origin) continue;

    const originLower = plant.origin.toLowerCase();

    for (const terroir of allTerroirs) {
      const key = `${plant.id}-${terroir.id}`;
      if (existingSet.has(key)) continue;

      const terroirNameLower = terroir.name.toLowerCase();
      const countryLower = (terroir.country || '').toLowerCase();
      const regionLower = (terroir.region || '').toLowerCase();

      // Vérifier les correspondances
      let confidence: 'high' | 'medium' | 'low' | null = null;
      let reason = '';

      if (originLower.includes(countryLower) && countryLower.length > 2) {
        confidence = 'high';
        reason = `Origine de la plante (${plant.origin}) correspond au pays du terroir (${terroir.country})`;
      } else if (originLower.includes(regionLower) && regionLower.length > 2) {
        confidence = 'high';
        reason = `Origine de la plante (${plant.origin}) correspond à la région du terroir (${terroir.region})`;
      } else if (originLower.includes(terroirNameLower.split(',')[0]) || terroirNameLower.includes(originLower.split(',')[0])) {
        confidence = 'medium';
        reason = `Correspondance partielle entre origine (${plant.origin}) et terroir (${terroir.name})`;
      }

      if (confidence) {
        suggestions.push({
          plantId: plant.id,
          plantName: plant.name,
          terroirId: terroir.id,
          terroirName: terroir.name,
          reason,
          confidence,
        });
      }
    }
  }

  // Trier par confiance puis par nom de plante
  return suggestions
    .sort((a, b) => {
      const confOrder = { high: 0, medium: 1, low: 2 };
      if (confOrder[a.confidence] !== confOrder[b.confidence]) {
        return confOrder[a.confidence] - confOrder[b.confidence];
      }
      return a.plantName.localeCompare(b.plantName);
    })
    .slice(0, 100);
}

/**
 * Créer plusieurs liaisons plante-terroir en une seule opération
 */
export async function createMultiplePlantTerroirs(relations: Array<{
  plantId: number;
  terroirId: number;
  localName?: string;
  notes?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] as string[] };

  const existingRelations = await db.select().from(plantTerroirs);
  const existingSet = new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));

  const errors: string[] = [];
  const toInsert: InsertPlantTerroir[] = [];

  for (const rel of relations) {
    const key = `${rel.plantId}-${rel.terroirId}`;
    if (existingSet.has(key)) {
      errors.push(`Liaison déjà existante: plante ${rel.plantId} - terroir ${rel.terroirId}`);
      continue;
    }

    toInsert.push({
      plantId: rel.plantId,
      terroirId: rel.terroirId,
      localName: rel.localName || null,
      notes: rel.notes || null,
    });
    existingSet.add(key);
  }

  if (toInsert.length > 0) {
    try {
      await db.insert(plantTerroirs).values(toInsert);
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


// ============================================================================
// VALIDATION & DRAFT SYSTEM
// ============================================================================

/**
 * Récupérer les molécules en attente de validation
 */
export async function getPendingMolecules() {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(molecules)
    .where(
      or(
        eq(molecules.validationStatus, 'brouillon'),
        eq(molecules.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(molecules.updatedAt));
}

/**
 * Récupérer les plantes en attente de validation
 */
export async function getPendingPlants() {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(plants)
    .where(
      or(
        eq(plants.validationStatus, 'brouillon'),
        eq(plants.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(plants.updatedAt));
}

/**
 * Valider une molécule
 */
export async function validateMolecule(moleculeId: number, adminId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(molecules)
      .set({
        validationStatus: 'valide',
        validatedBy: adminId,
        validatedAt: new Date(),
      })
      .where(eq(molecules.id, moleculeId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Rejeter une molécule
 */
export async function rejectMolecule(moleculeId: number, adminId: number, reason?: string) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    const currentNotes = await db.select({ notes: molecules.notes })
      .from(molecules)
      .where(eq(molecules.id, moleculeId));

    const existingNotes = currentNotes[0]?.notes || '';
    const rejectionNote = reason ? `[REJET ${new Date().toISOString()}]: ${reason}\n${existingNotes}` : existingNotes;

    await db.update(molecules)
      .set({
        validationStatus: 'rejete',
        validatedBy: adminId,
        validatedAt: new Date(),
        notes: rejectionNote,
      })
      .where(eq(molecules.id, moleculeId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Valider une plante
 */
export async function validatePlant(plantId: number, adminId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(plants)
      .set({
        validationStatus: 'valide',
        validatedBy: adminId,
        validatedAt: new Date(),
      })
      .where(eq(plants.id, plantId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Rejeter une plante
 */
export async function rejectPlant(plantId: number, adminId: number, reason?: string) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    const currentNotes = await db.select({ notes: plants.notes })
      .from(plants)
      .where(eq(plants.id, plantId));

    const existingNotes = currentNotes[0]?.notes || '';
    const rejectionNote = reason ? `[REJET ${new Date().toISOString()}]: ${reason}\n${existingNotes}` : existingNotes;

    await db.update(plants)
      .set({
        validationStatus: 'rejete',
        validatedBy: adminId,
        validatedAt: new Date(),
        notes: rejectionNote,
      })
      .where(eq(plants.id, plantId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Soumettre une molécule pour révision
 */
export async function submitMoleculeForReview(moleculeId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(molecules)
      .set({
        validationStatus: 'en_revision',
      })
      .where(eq(molecules.id, moleculeId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Soumettre une plante pour révision
 */
export async function submitPlantForReview(plantId: number) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    await db.update(plants)
      .set({
        validationStatus: 'en_revision',
      })
      .where(eq(plants.id, plantId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les statistiques de validation
 */
export async function getValidationStats() {
  const db = await getDb();
  if (!db) return null;

  const allMolecules = await db.select({
    validationStatus: molecules.validationStatus,
  }).from(molecules);

  const allPlants = await db.select({
    validationStatus: plants.validationStatus,
  }).from(plants);

  const moleculeStats = {
    total: allMolecules.length,
    brouillon: allMolecules.filter(m => m.validationStatus === 'brouillon').length,
    en_revision: allMolecules.filter(m => m.validationStatus === 'en_revision').length,
    valide: allMolecules.filter(m => m.validationStatus === 'valide' || !m.validationStatus).length,
    rejete: allMolecules.filter(m => m.validationStatus === 'rejete').length,
  };

  const plantStats = {
    total: allPlants.length,
    brouillon: allPlants.filter(p => p.validationStatus === 'brouillon').length,
    en_revision: allPlants.filter(p => p.validationStatus === 'en_revision').length,
    valide: allPlants.filter(p => p.validationStatus === 'valide' || !p.validationStatus).length,
    rejete: allPlants.filter(p => p.validationStatus === 'rejete').length,
  };

  return {
    molecules: moleculeStats,
    plants: plantStats,
    pendingTotal: moleculeStats.brouillon + moleculeStats.en_revision + plantStats.brouillon + plantStats.en_revision,
  };
}


// ============================================================================
// IMPORT BIBLIOGRAPHY FROM JSON
// ============================================================================

interface BibliographyImportEntry {
  id: string;
  type: string;
  author?: string;
  year?: number;
  title: string;
  publication?: string;
  publisher?: string;
  url?: string;
  content?: string;
  quote?: string;
  source?: string;
  source_id?: string;
  era?: string;
  region?: string;
  location?: string;
}

/**
 * Import bibliography entries from JSON format (like the Pasted_content_36.txt structure)
 */
export async function importBibliographyFromJson(
  entries: BibliographyImportEntry[],
  category: string = 'autre'
) {
  const db = await getDb();
  if (!db) return { success: 0, failed: 0, errors: [] as string[] };

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  // Map entry types
  const typeMap: Record<string, string> = {
    'Publication Académique': 'article',
    'Article Scientifique': 'article',
    'Livre': 'book',
    'Rapport': 'techreport',
    'Site Web / Article': 'online',
    'Site Web / Projet': 'online',
    'Peinture': 'misc',
    'Musée': 'misc',
    'Génétique': 'misc',
    'Chimie': 'article',
    'Cultivars': 'misc',
  };

  // Map research domains
  const domainMap: Record<string, string> = {
    'olfactory_heritage_and_ritual_plants': 'patrimoine_olfactif',
    'tobacco_and_cannabis': 'tabac_cannabis',
    'cannabis': 'tabac_cannabis',
    'tobacco': 'tabac_cannabis',
  };

  for (const entry of entries) {
    try {
      // Generate a unique entry key
      const authorPart = entry.author?.split(',')[0]?.split(' ').pop()?.toLowerCase() || 'unknown';
      const yearPart = entry.year || 'nd';
      const titlePart = entry.title.split(' ').slice(0, 2).join('').toLowerCase().replace(/[^a-z]/g, '');
      const entryKey = `${authorPart}${yearPart}${titlePart}`;

      // Check if entry already exists
      const existing = await getBibliographyEntryByKey(entryKey);
      if (existing) {
        errors.push(`${entry.id}: Entrée déjà existante (${entryKey})`);
        failed++;
        continue;
      }

      const entryType = typeMap[entry.type] || 'misc';
      const researchDomain = domainMap[category] || 'autre';

      await db.insert(bibliographyEntries).values({
        entryKey,
        entryType: entryType as any,
        title: entry.title,
        authors: entry.author || null,
        year: entry.year || null,
        journal: entry.publication || null,
        publisher: entry.publisher || null,
        url: entry.url || null,
        abstract: entry.content || entry.quote || null,
        researchDomain: researchDomain as any,
        readStatus: 'unread',
        notes: entry.source ? `Source: ${entry.source}` : null,
      });

      success++;
    } catch (error: any) {
      failed++;
      errors.push(`${entry.id}: ${error.message}`);
    }
  }

  return { success, failed, errors };
}


// ============================================================================
// ADMIN NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Récupérer les contributions en attente de validation avec détails
 */
export async function getPendingContributions() {
  const db = await getDb();
  if (!db) return { molecules: [], plants: [], total: 0 };

  // Molécules en brouillon ou en révision
  const pendingMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    validationStatus: molecules.validationStatus,
    createdAt: molecules.createdAt,
    chemicalFormula: molecules.chemicalFormula,
    family: molecules.family,
  })
    .from(molecules)
    .where(
      or(
        eq(molecules.validationStatus, 'brouillon'),
        eq(molecules.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(molecules.createdAt))
    .limit(50);

  // Plantes en brouillon ou en révision
  const pendingPlants = await db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    validationStatus: plants.validationStatus,
    createdAt: plants.createdAt,
    family: plants.family,
  })
    .from(plants)
    .where(
      or(
        eq(plants.validationStatus, 'brouillon'),
        eq(plants.validationStatus, 'en_revision')
      )
    )
    .orderBy(desc(plants.createdAt))
    .limit(50);

  return {
    molecules: pendingMolecules,
    plants: pendingPlants,
    total: pendingMolecules.length + pendingPlants.length,
  };
}

/**
 * Récupérer les nouvelles contributions depuis une date donnée
 */
export async function getNewContributionsSince(since: Date) {
  const db = await getDb();
  if (!db) return { molecules: [], plants: [], total: 0 };

  const newMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    validationStatus: molecules.validationStatus,
    createdAt: molecules.createdAt,
  })
    .from(molecules)
    .where(
      and(
        gte(molecules.createdAt, since),
        or(
          eq(molecules.validationStatus, 'brouillon'),
          eq(molecules.validationStatus, 'en_revision')
        )
      )
    )
    .orderBy(desc(molecules.createdAt));

  const newPlants = await db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    validationStatus: plants.validationStatus,
    createdAt: plants.createdAt,
  })
    .from(plants)
    .where(
      and(
        gte(plants.createdAt, since),
        or(
          eq(plants.validationStatus, 'brouillon'),
          eq(plants.validationStatus, 'en_revision')
        )
      )
    )
    .orderBy(desc(plants.createdAt));

  return {
    molecules: newMolecules,
    plants: newPlants,
    total: newMolecules.length + newPlants.length,
  };
}

/**
 * Générer un résumé des contributions en attente pour notification
 */
export async function generatePendingContributionsSummary() {
  const pending = await getPendingContributions();
  
  if (pending.total === 0) {
    return null;
  }

  const moleculesList = pending.molecules.slice(0, 5).map(m => 
    `• ${m.name} (${m.validationStatus === 'brouillon' ? 'Brouillon' : 'En révision'})`
  ).join('\n');

  const plantsList = pending.plants.slice(0, 5).map((p: any) => 
    `• ${p.name || p.latinName} (${p.validationStatus === 'brouillon' ? 'Brouillon' : 'En révision'})`
  ).join('\n');

  let content = `**Résumé des contributions en attente**\n\n`;
  content += `📊 **Total:** ${pending.total} contribution(s) en attente\n\n`;

  if (pending.molecules.length > 0) {
    content += `🧪 **Molécules (${pending.molecules.length}):**\n${moleculesList}\n`;
    if (pending.molecules.length > 5) {
      content += `... et ${pending.molecules.length - 5} autres\n`;
    }
    content += '\n';
  }

  if (pending.plants.length > 0) {
    content += `🌿 **Plantes (${pending.plants.length}):**\n${plantsList}\n`;
    if (pending.plants.length > 5) {
      content += `... et ${pending.plants.length - 5} autres\n`;
    }
  }

  content += `\n🔗 Accédez à la page de validation: /admin/validation`;

  return {
    title: `PERFUMUM: ${pending.total} contribution(s) en attente de validation`,
    content,
    stats: {
      molecules: pending.molecules.length,
      plants: pending.plants.length,
      total: pending.total,
    },
  };
}


// ============================================================================
// LEAF ECONOMY IMAGE MANAGEMENT
// ============================================================================

/**
 * Met à jour l'URL de l'image principale d'un échantillon LeafEconomy
 */
export async function updateLeafEconomyImage(leafEconomyId: number, imageUrl: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(leafEconomies)
    .set({ imageUrl })
    .where(eq(leafEconomies.id, leafEconomyId));
  
  return await getLeafEconomyById(leafEconomyId);
}

/**
 * Supprime l'image principale d'un échantillon LeafEconomy
 */
export async function deleteLeafEconomyImage(leafEconomyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(leafEconomies)
    .set({ imageUrl: null })
    .where(eq(leafEconomies.id, leafEconomyId));
  
  return await getLeafEconomyById(leafEconomyId);
}

/**
 * Récupère les échantillons LeafEconomy avec images
 */
export async function getLeafEconomiesWithImages() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select()
    .from(leafEconomies)
    .where(sql`${leafEconomies.imageUrl} IS NOT NULL AND ${leafEconomies.imageUrl} != ''`)
    .orderBy(desc(leafEconomies.updatedAt));
}

/**
 * Récupère les échantillons LeafEconomy sans images
 */
export async function getLeafEconomiesWithoutImages() {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  return await db.select()
    .from(leafEconomies)
    .where(sql`${leafEconomies.imageUrl} IS NULL OR ${leafEconomies.imageUrl} = ''`)
    .orderBy(desc(leafEconomies.updatedAt));
}


// ============================================================================
// CURATED JOURNEYS (Parcours olfactifs prédéfinis)
// ============================================================================

/**
 * Récupère tous les parcours publiés
 */
export async function getAllPublishedJourneys() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .where(eq(curatedJourneys.isPublished, true))
    .orderBy(curatedJourneys.sortOrder, curatedJourneys.name);
}

/**
 * Récupère tous les parcours (admin)
 */
export async function getAllJourneys() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .orderBy(curatedJourneys.sortOrder, curatedJourneys.name);
}

/**
 * Récupère les parcours mis en avant
 */
export async function getFeaturedJourneys() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .where(and(
      eq(curatedJourneys.isPublished, true),
      eq(curatedJourneys.isFeatured, true)
    ))
    .orderBy(curatedJourneys.sortOrder);
}

/**
 * Récupère un parcours par ID
 */
export async function getJourneyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [journey] = await db.select()
    .from(curatedJourneys)
    .where(eq(curatedJourneys.id, id));
  
  return journey || null;
}

/**
 * Récupère un parcours par code
 */
export async function getJourneyByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [journey] = await db.select()
    .from(curatedJourneys)
    .where(eq(curatedJourneys.code, code));
  
  return journey || null;
}

/**
 * Récupère les parcours par thème
 */
export async function getJourneysByTheme(theme: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(curatedJourneys)
    .where(and(
      eq(curatedJourneys.theme, theme as any),
      eq(curatedJourneys.isPublished, true)
    ))
    .orderBy(curatedJourneys.sortOrder);
}

/**
 * Crée un nouveau parcours
 */
export async function createJourney(data: InsertCuratedJourney) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const [result] = await db.insert(curatedJourneys).values(data);
  return getJourneyById(result.insertId);
}

/**
 * Met à jour un parcours
 */
export async function updateJourney(id: number, data: Partial<InsertCuratedJourney>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(curatedJourneys)
    .set(data)
    .where(eq(curatedJourneys.id, id));
  
  return getJourneyById(id);
}

/**
 * Supprime un parcours
 */
export async function deleteJourney(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Supprimer d'abord les items liés
  await db.delete(journeyItems).where(eq(journeyItems.journeyId, id));
  // Puis le parcours
  await db.delete(curatedJourneys).where(eq(curatedJourneys.id, id));
  
  return true;
}

// ============================================================================
// JOURNEY ITEMS (Éléments des parcours)
// ============================================================================

/**
 * Récupère les éléments d'un parcours avec les détails des entités
 */
export async function getJourneyItems(journeyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const items = await db.select()
    .from(journeyItems)
    .where(eq(journeyItems.journeyId, journeyId))
    .orderBy(journeyItems.sortOrder);
  
  // Enrichir avec les détails des entités
  const enrichedItems = await Promise.all(items.map(async (item) => {
    let entity = null;
    
    if (item.itemType === 'terroir' && item.terroirId) {
      const [t] = await db.select().from(terroirs).where(eq(terroirs.id, item.terroirId));
      entity = t;
    } else if (item.itemType === 'plant' && item.plantId) {
      const [p] = await db.select().from(plants).where(eq(plants.id, item.plantId));
      entity = p;
    } else if (item.itemType === 'molecule' && item.moleculeId) {
      const [m] = await db.select().from(molecules).where(eq(molecules.id, item.moleculeId));
      entity = m;
    }
    
    return { ...item, entity };
  }));
  
  return enrichedItems;
}

/**
 * Ajoute un élément à un parcours
 */
export async function addJourneyItem(data: InsertJourneyItem) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const [result] = await db.insert(journeyItems).values(data);
  
  // Mettre à jour les compteurs du parcours
  await updateJourneyCounts(data.journeyId);
  
  return result.insertId;
}

/**
 * Supprime un élément d'un parcours
 */
export async function removeJourneyItem(itemId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  // Récupérer le journeyId avant suppression
  const [item] = await db.select().from(journeyItems).where(eq(journeyItems.id, itemId));
  if (!item) return false;
  
  await db.delete(journeyItems).where(eq(journeyItems.id, itemId));
  
  // Mettre à jour les compteurs
  await updateJourneyCounts(item.journeyId);
  
  return true;
}

/**
 * Met à jour l'ordre d'un élément
 */
export async function updateJourneyItemOrder(itemId: number, sortOrder: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(journeyItems)
    .set({ sortOrder })
    .where(eq(journeyItems.id, itemId));
  
  return true;
}

/**
 * Met à jour les compteurs d'un parcours
 */
async function updateJourneyCounts(journeyId: number) {
  const db = await getDb();
  if (!db) return;
  
  const items = await db.select().from(journeyItems).where(eq(journeyItems.journeyId, journeyId));
  
  const terroirCount = items.filter(i => i.itemType === 'terroir').length;
  const plantCount = items.filter(i => i.itemType === 'plant').length;
  const moleculeCount = items.filter(i => i.itemType === 'molecule').length;
  
  await db.update(curatedJourneys)
    .set({ terroirCount, plantCount, moleculeCount })
    .where(eq(curatedJourneys.id, journeyId));
}

/**
 * Récupère un parcours complet avec tous ses éléments
 */
export async function getFullJourney(journeyId: number) {
  const journey = await getJourneyById(journeyId);
  if (!journey) return null;
  
  const items = await getJourneyItems(journeyId);
  
  return { ...journey, items };
}

/**
 * Récupère les statistiques des parcours
 */
export async function getJourneysStats() {
  const db = await getDb();
  if (!db) return null;
  
  const allJourneys = await db.select().from(curatedJourneys);
  
  const published = allJourneys.filter(j => j.isPublished);
  const featured = allJourneys.filter(j => j.isFeatured);
  
  // Grouper par thème
  const byTheme: Record<string, number> = {};
  allJourneys.forEach(j => {
    byTheme[j.theme] = (byTheme[j.theme] || 0) + 1;
  });
  
  return {
    total: allJourneys.length,
    published: published.length,
    featured: featured.length,
    byTheme,
  };
}


// ============================================================================
// RECHERCHE AVANCÉE CROISÉE (Terroirs ↔ Plantes ↔ Molécules)
// ============================================================================

export interface CrossSearchFilters {
  // Filtres terroirs
  terroirIds?: number[];
  terroirCountries?: string[];
  terroirClimates?: string[];
  
  // Filtres plantes
  plantIds?: number[];
  plantCategories?: string[];
  plantFamilies?: string[];
  
  // Filtres molécules
  moleculeIds?: number[];
  moleculeFamilies?: string[];
  chemicalClasses?: string[];
  
  // Recherche textuelle
  searchQuery?: string;
  
  // Options
  includeRelations?: boolean;
}

export interface CrossSearchResult {
  terroirs: Array<{
    id: number;
    name: string;
    country: string | null;
    region: string | null;
    climateType: string | null;
    plantCount: number;
    moleculeCount: number;
  }>;
  plants: Array<{
    id: number;
    name: string;
    latinName: string | null;
    category: string | null;
    family: string | null;
    terroirCount: number;
    moleculeCount: number;
  }>;
  molecules: Array<{
    id: number;
    name: string;
    family: string | null;
    chemicalClass: string | null;
    olfactiveProfile: string | null;
    plantCount: number;
  }>;
  relations: {
    plantTerroirs: Array<{ plantId: number; terroirId: number; plantName: string; terroirName: string }>;
    plantMolecules: Array<{ plantId: number; moleculeId: number; plantName: string; moleculeName: string; percentage?: number }>;
  };
  stats: {
    totalTerroirs: number;
    totalPlants: number;
    totalMolecules: number;
    totalPlantTerroirLinks: number;
    totalPlantMoleculeLinks: number;
  };
}

/**
 * Recherche avancée croisée entre terroirs, plantes et molécules
 */
export async function crossSearch(filters: CrossSearchFilters): Promise<CrossSearchResult> {
  const db = await getDb();
  if (!db) {
    return {
      terroirs: [],
      plants: [],
      molecules: [],
      relations: { plantTerroirs: [], plantMolecules: [] },
      stats: { totalTerroirs: 0, totalPlants: 0, totalMolecules: 0, totalPlantTerroirLinks: 0, totalPlantMoleculeLinks: 0 }
    };
  }

  // Récupérer toutes les données de base
  const allTerroirs = await db.select().from(terroirs);
  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);
  const allPlantTerroirs = await db.select().from(plantTerroirs);
  const allPlantMolecules = await db.select().from(plantMolecules);

  // Créer des maps pour les lookups rapides
  const terroirMap = new Map(allTerroirs.map(t => [t.id, t]));
  const plantMap = new Map(allPlants.map(p => [p.id, p]));
  const moleculeMap = new Map(allMolecules.map(m => [m.id, m]));

  // Filtrer les terroirs
  let filteredTerroirs = allTerroirs;
  if (filters.terroirIds?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => filters.terroirIds!.includes(t.id));
  }
  if (filters.terroirCountries?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => t.country && filters.terroirCountries!.includes(t.country));
  }
  if (filters.terroirClimates?.length) {
    filteredTerroirs = filteredTerroirs.filter(t => t.climateType && filters.terroirClimates!.includes(t.climateType));
  }

  // Filtrer les plantes
  let filteredPlants = allPlants;
  if (filters.plantIds?.length) {
    filteredPlants = filteredPlants.filter(p => filters.plantIds!.includes(p.id));
  }
  if (filters.plantCategories?.length) {
    filteredPlants = filteredPlants.filter(p => p.category && filters.plantCategories!.includes(p.category));
  }
  if (filters.plantFamilies?.length) {
    filteredPlants = filteredPlants.filter(p => p.family && filters.plantFamilies!.includes(p.family));
  }

  // Filtrer les molécules
  let filteredMolecules = allMolecules;
  if (filters.moleculeIds?.length) {
    filteredMolecules = filteredMolecules.filter(m => filters.moleculeIds!.includes(m.id));
  }
  if (filters.moleculeFamilies?.length) {
    filteredMolecules = filteredMolecules.filter(m => m.family && filters.moleculeFamilies!.includes(m.family));
  }
  if (filters.chemicalClasses?.length) {
    filteredMolecules = filteredMolecules.filter(m => m.chemicalClass && filters.chemicalClasses!.includes(m.chemicalClass));
  }

  // Recherche textuelle enrichie avec synonymes olfactifs
  if (filters.searchQuery) {
    const originalQuery = filters.searchQuery.toLowerCase();
    // Expansion de la requête avec synonymes olfactifs
    const expandedTerms = expandSearchQuery(filters.searchQuery).map(t => t.toLowerCase());
    
    // Fonction helper pour vérifier si un texte contient l'un des termes enrichis
    const matchesEnrichedQuery = (text: string | null | undefined): boolean => {
      if (!text) return false;
      const lowerText = text.toLowerCase();
      return expandedTerms.some(term => lowerText.includes(term));
    };
    
    filteredTerroirs = filteredTerroirs.filter(t => 
      matchesEnrichedQuery(t.name) ||
      matchesEnrichedQuery(t.country) ||
      matchesEnrichedQuery(t.region) ||
      matchesEnrichedQuery(t.subRegion) ||
      matchesEnrichedQuery(t.climateType)
    );
    filteredPlants = filteredPlants.filter(p => 
      matchesEnrichedQuery(p.name) ||
      matchesEnrichedQuery(p.latinName) ||
      matchesEnrichedQuery(p.olfactiveSignature) ||
      matchesEnrichedQuery(p.family) ||
      matchesEnrichedQuery(p.category)
    );
    filteredMolecules = filteredMolecules.filter(m => 
      matchesEnrichedQuery(m.name) ||
      matchesEnrichedQuery(m.olfactiveProfile) ||
      matchesEnrichedQuery(m.casNumber) ||
      matchesEnrichedQuery(m.family) ||
      matchesEnrichedQuery(m.chemicalClass)
    );
  }

  // Appliquer les filtres croisés si des filtres sont actifs
  const terroirIdsSet = new Set(filteredTerroirs.map(t => t.id));
  const plantIdsSet = new Set(filteredPlants.map(p => p.id));
  const moleculeIdsSet = new Set(filteredMolecules.map(m => m.id));

  // Si des filtres terroirs sont actifs, filtrer les plantes liées
  if (filters.terroirIds?.length || filters.terroirCountries?.length || filters.terroirClimates?.length) {
    const linkedPlantIds = new Set(
      allPlantTerroirs
        .filter(pt => terroirIdsSet.has(pt.terroirId))
        .map(pt => pt.plantId)
    );
    filteredPlants = filteredPlants.filter(p => linkedPlantIds.has(p.id));
    plantIdsSet.clear();
    filteredPlants.forEach(p => plantIdsSet.add(p.id));
  }

  // Si des filtres plantes sont actifs, filtrer les terroirs et molécules liés
  if (filters.plantIds?.length || filters.plantCategories?.length || filters.plantFamilies?.length) {
    const linkedTerroirIds = new Set(
      allPlantTerroirs
        .filter(pt => plantIdsSet.has(pt.plantId))
        .map(pt => pt.terroirId)
    );
    const linkedMoleculeIds = new Set(
      allPlantMolecules
        .filter(pm => plantIdsSet.has(pm.plantId))
        .map(pm => pm.moleculeId)
    );
    filteredTerroirs = filteredTerroirs.filter(t => linkedTerroirIds.has(t.id));
    filteredMolecules = filteredMolecules.filter(m => linkedMoleculeIds.has(m.id));
    terroirIdsSet.clear();
    moleculeIdsSet.clear();
    filteredTerroirs.forEach(t => terroirIdsSet.add(t.id));
    filteredMolecules.forEach(m => moleculeIdsSet.add(m.id));
  }

  // Si des filtres molécules sont actifs, filtrer les plantes liées
  if (filters.moleculeIds?.length || filters.moleculeFamilies?.length || filters.chemicalClasses?.length) {
    const linkedPlantIds = new Set(
      allPlantMolecules
        .filter(pm => moleculeIdsSet.has(pm.moleculeId))
        .map(pm => pm.plantId)
    );
    filteredPlants = filteredPlants.filter(p => linkedPlantIds.has(p.id));
    plantIdsSet.clear();
    filteredPlants.forEach(p => plantIdsSet.add(p.id));
  }

  // Calculer les compteurs pour chaque entité
  const terroirPlantCounts = new Map<number, number>();
  const terroirMoleculeCounts = new Map<number, Set<number>>();
  const plantTerroirCounts = new Map<number, number>();
  const plantMoleculeCounts = new Map<number, number>();
  const moleculePlantCounts = new Map<number, number>();

  // Compter les relations plante-terroir
  allPlantTerroirs.forEach(pt => {
    if (terroirIdsSet.has(pt.terroirId) && plantIdsSet.has(pt.plantId)) {
      terroirPlantCounts.set(pt.terroirId, (terroirPlantCounts.get(pt.terroirId) || 0) + 1);
      plantTerroirCounts.set(pt.plantId, (plantTerroirCounts.get(pt.plantId) || 0) + 1);
    }
  });

  // Compter les relations plante-molécule
  allPlantMolecules.forEach(pm => {
    if (plantIdsSet.has(pm.plantId) && moleculeIdsSet.has(pm.moleculeId)) {
      plantMoleculeCounts.set(pm.plantId, (plantMoleculeCounts.get(pm.plantId) || 0) + 1);
      moleculePlantCounts.set(pm.moleculeId, (moleculePlantCounts.get(pm.moleculeId) || 0) + 1);
      
      // Compter les molécules par terroir (via les plantes)
      allPlantTerroirs.filter(pt => pt.plantId === pm.plantId).forEach(pt => {
        if (terroirIdsSet.has(pt.terroirId)) {
          if (!terroirMoleculeCounts.has(pt.terroirId)) {
            terroirMoleculeCounts.set(pt.terroirId, new Set());
          }
          terroirMoleculeCounts.get(pt.terroirId)!.add(pm.moleculeId);
        }
      });
    }
  });

  // Construire les résultats
  const resultTerroirs = filteredTerroirs.map(t => ({
    id: t.id,
    name: t.name,
    country: t.country,
    region: t.region,
    climateType: t.climateType,
    plantCount: terroirPlantCounts.get(t.id) || 0,
    moleculeCount: terroirMoleculeCounts.get(t.id)?.size || 0,
  }));

  const resultPlants = filteredPlants.map(p => ({
    id: p.id,
    name: p.name,
    latinName: p.latinName,
    category: p.category,
    family: p.family,
    terroirCount: plantTerroirCounts.get(p.id) || 0,
    moleculeCount: plantMoleculeCounts.get(p.id) || 0,
  }));

  const resultMolecules = filteredMolecules.map(m => ({
    id: m.id,
    name: m.name,
    family: m.family,
    chemicalClass: m.chemicalClass,
    olfactiveProfile: m.olfactiveProfile,
    plantCount: moleculePlantCounts.get(m.id) || 0,
  }));

  // Construire les relations si demandé
  const relations = {
    plantTerroirs: filters.includeRelations 
      ? allPlantTerroirs
          .filter(pt => plantIdsSet.has(pt.plantId) && terroirIdsSet.has(pt.terroirId))
          .map(pt => ({
            plantId: pt.plantId,
            terroirId: pt.terroirId,
            plantName: plantMap.get(pt.plantId)?.name || '',
            terroirName: terroirMap.get(pt.terroirId)?.name || '',
          }))
      : [],
    plantMolecules: filters.includeRelations
      ? allPlantMolecules
          .filter(pm => plantIdsSet.has(pm.plantId) && moleculeIdsSet.has(pm.moleculeId))
          .map(pm => ({
            plantId: pm.plantId,
            moleculeId: pm.moleculeId,
            plantName: plantMap.get(pm.plantId)?.name || '',
            moleculeName: moleculeMap.get(pm.moleculeId)?.name || '',
            percentage: pm.percentage ? Number(pm.percentage) : undefined,
          }))
      : [],
  };

  return {
    terroirs: resultTerroirs,
    plants: resultPlants,
    molecules: resultMolecules,
    relations,
    stats: {
      totalTerroirs: resultTerroirs.length,
      totalPlants: resultPlants.length,
      totalMolecules: resultMolecules.length,
      totalPlantTerroirLinks: relations.plantTerroirs.length,
      totalPlantMoleculeLinks: relations.plantMolecules.length,
    },
  };
}

/**
 * Récupère les options de filtres disponibles pour la recherche croisée
 */
export async function getCrossSearchFilterOptions() {
  const db = await getDb();
  if (!db) {
    return {
      terroirCountries: [],
      terroirClimates: [],
      plantCategories: [],
      plantFamilies: [],
      moleculeFamilies: [],
      chemicalClasses: [],
    };
  }

  const allTerroirs = await db.select().from(terroirs);
  const allPlants = await db.select().from(plants);
  const allMolecules = await db.select().from(molecules);

  return {
    terroirCountries: Array.from(new Set(allTerroirs.map(t => t.country).filter(Boolean))).sort() as string[],
    terroirClimates: Array.from(new Set(allTerroirs.map(t => t.climateType).filter(Boolean))).sort() as string[],
    plantCategories: Array.from(new Set(allPlants.map(p => p.category).filter(Boolean))).sort() as string[],
    plantFamilies: Array.from(new Set(allPlants.map(p => p.family).filter(Boolean))).sort() as string[],
    moleculeFamilies: Array.from(new Set(allMolecules.map(m => m.family).filter(Boolean))).sort() as string[],
    chemicalClasses: Array.from(new Set(allMolecules.map(m => m.chemicalClass).filter(Boolean))).sort() as string[],
  };
}


// ============================================
// FONCTIONS DE LIENS CROISÉS (CROSS-LINKS)
// ============================================

/**
 * Récupère les recettes qui utilisent une molécule spécifique
 */
export async function getRecettesByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: recettes.id,
      name: recettes.name,
      category: recettes.category,
      description: recettes.description,
      proportion: moleculesRecettes.proportion,
      role: moleculesRecettes.role,
      notes: moleculesRecettes.notes,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, moleculeId));
  
  return result;
}

/**
 * Récupère les molécules similaires (même famille chimique ou profil olfactif proche)
 */
export async function getSimilarMoleculesByProfile(moleculeId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la molécule de référence
  const refMolecule = await db.select().from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  if (!refMolecule[0]) return [];
  
  const ref = refMolecule[0];
  
  // Récupérer toutes les autres molécules
  const allMolecules = await db.select().from(molecules).where(sql`${molecules.id} != ${moleculeId}`);
  
  // Calculer un score de similarité basé sur plusieurs critères
  const scored = allMolecules.map(m => {
    let score = 0;
    
    // Bonus si même famille olfactive
    if ((ref as any).olfactiveFamily && (m as any).olfactiveFamily === (ref as any).olfactiveFamily) {
      score += 40;
    }
    
    // Bonus si même classe chimique
    if (ref.chemicalClass && m.chemicalClass === ref.chemicalClass) {
      score += 30;
    }
    
    // Bonus si volatilité similaire
    if (ref.volatility && m.volatility === ref.volatility) {
      score += 20;
    }
    
    // Bonus si intensité similaire (±1)
    if (ref.intensity && m.intensity && Math.abs(ref.intensity - m.intensity) <= 1) {
      score += 10;
    }
    
    return { ...m, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(m => m.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les recettes similaires (même catégorie, famille, ou profil olfactif proche)
 */
export async function getSimilarRecettesByProfile(recetteId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la recette de référence
  const refRecette = await db.select().from(recettes).where(eq(recettes.id, recetteId)).limit(1);
  if (!refRecette[0]) return [];
  
  const ref = refRecette[0];
  
  // Récupérer toutes les autres recettes
  const allRecettes = await db.select().from(recettes).where(sql`${recettes.id} != ${recetteId}`);
  
  // Calculer un score de similarité
  const scored = allRecettes.map(r => {
    let score = 0;
    
    // Bonus si même catégorie
    if (ref.category && r.category === ref.category) {
      score += 40;
    }
    
    // Bonus si même famille
    if (ref.familyId && r.familyId === ref.familyId) {
      score += 30;
    }
    
    // Bonus si même statut
    if (ref.status && r.status === ref.status) {
      score += 10;
    }
    
    return { ...r, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(r => r.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les plantes similaires (même famille, catégorie ou origine)
 */
export async function getSimilarPlantsByProfile(plantId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la plante de référence
  const refPlant = await db.select().from(plants).where(eq(plants.id, plantId)).limit(1);
  if (!refPlant[0]) return [];
  
  const ref = refPlant[0];
  
  // Récupérer toutes les autres plantes
  const allPlants = await db.select().from(plants).where(sql`${plants.id} != ${plantId}`);
  
  // Calculer un score de similarité
  const scored = allPlants.map(p => {
    let score = 0;
    
    // Bonus si même famille botanique
    if (ref.family && p.family === ref.family) {
      score += 40;
    }
    
    // Bonus si même catégorie
    if (ref.category && p.category === ref.category) {
      score += 30;
    }
    
    // Bonus si même origine
    if (ref.origin && p.origin === ref.origin) {
      score += 20;
    }
    
    return { ...p, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(p => p.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les terroirs similaires (même région, climat similaire)
 */
export async function getSimilarTerroirsByProfile(terroirId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer le terroir de référence
  const refTerroir = await db.select().from(terroirs).where(eq(terroirs.id, terroirId)).limit(1);
  if (!refTerroir[0]) return [];
  
  const ref = refTerroir[0];
  
  // Récupérer tous les autres terroirs
  const allTerroirs = await db.select().from(terroirs).where(sql`${terroirs.id} != ${terroirId}`);
  
  // Calculer un score de similarité
  const scored = allTerroirs.map(t => {
    let score = 0;
    
    // Bonus si même pays
    if (ref.country && t.country === ref.country) {
      score += 30;
    }
    
    // Bonus si même type de climat
    if (ref.climateType && t.climateType === ref.climateType) {
      score += 40;
    }
    
    // Bonus si même région
    if (ref.region && t.region === ref.region) {
      score += 20;
    }
    
    return { ...t, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(t => t.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Récupère les matières premières liées à une molécule
 */
export async function getRawMaterialsByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la molécule
  const molecule = await db.select().from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
  if (!molecule[0]) return [];
  
  const mol = molecule[0];
  
  // Récupérer les matières premières qui contiennent cette molécule dans leurs molécules dominantes
  const allRawMaterials = await db.select().from(rawMaterials);
  
  // Filtrer les matières premières dont le profil olfactif ou les molécules dominantes contiennent le nom de la molécule
  return allRawMaterials.filter(rm => {
    const moleculeNameLower = mol.name.toLowerCase();
    
    // Vérifier dans le profil olfactif
    if (rm.olfactiveProfile) {
      const profileLower = rm.olfactiveProfile.toLowerCase();
      if (profileLower.includes(moleculeNameLower)) return true;
    }
    
    // Vérifier dans les molécules dominantes
    if (rm.dominantMolecules && Array.isArray(rm.dominantMolecules)) {
      const hasMolecule = rm.dominantMolecules.some(
        (dm: any) => dm.name?.toLowerCase().includes(moleculeNameLower) || dm.moleculeId === moleculeId
      );
      if (hasMolecule) return true;
    }
    
    return false;
  });
}

/**
 * Récupère les terroirs liés à une plante
 */
export async function getTerroirsByPlant(plantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: terroirs.id,
      name: terroirs.name,
      country: terroirs.country,
      region: terroirs.region,
      climateType: terroirs.climateType,
      localName: plantTerroirs.localName,
      qualityNotes: plantTerroirs.qualityNotes,
    })
    .from(plantTerroirs)
    .innerJoin(terroirs, eq(plantTerroirs.terroirId, terroirs.id))
    .where(eq(plantTerroirs.plantId, plantId));
  
  return result;
}

/**
 * Récupère les plantes liées à un terroir
 */
export async function getPlantsByTerroir(terroirId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      family: plants.family,
      category: plants.category,
      localName: plantTerroirs.localName,
      qualityNotes: plantTerroirs.qualityNotes,
    })
    .from(plantTerroirs)
    .innerJoin(plants, eq(plantTerroirs.plantId, plants.id))
    .where(eq(plantTerroirs.terroirId, terroirId));
  
  return result;
}

/**
 * Récupère les matières premières similaires (même famille olfactive, catégorie ou origine)
 */
export async function getSimilarRawMaterialsByProfile(rawMaterialId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer la matière première de référence
  const refMaterial = await db.select().from(rawMaterials).where(eq(rawMaterials.id, rawMaterialId)).limit(1);
  if (!refMaterial[0]) return [];
  
  const ref = refMaterial[0];
  
  // Récupérer toutes les autres matières premières
  const allMaterials = await db.select().from(rawMaterials).where(sql`${rawMaterials.id} != ${rawMaterialId}`);
  
  // Calculer un score de similarité
  const scored = allMaterials.map(m => {
    let score = 0;
    
    // Bonus si même famille olfactive
    if ((ref as any).olfactiveFamily && (m as any).olfactiveFamily === (ref as any).olfactiveFamily) {
      score += 40;
    }
    
    // Bonus si même catégorie
    if (ref.category && m.category === ref.category) {
      score += 30;
    }
    
    // Bonus si même plante source
    if (ref.plantId && m.plantId === ref.plantId) {
      score += 20;
    }
    
    // Bonus si même terroir
    if (ref.terroirId && m.terroirId === ref.terroirId) {
      score += 15;
    }
    
    // Bonus si même pays d'origine
    if (ref.originCountry && m.originCountry === ref.originCountry) {
      score += 10;
    }
    
    return { ...m, similarityScore: score };
  });
  
  // Trier par score décroissant et limiter
  return scored
    .filter(m => m.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}


// ============================================================================
// AUTOMATIC ENTITY LINKING (Liaisons automatiques par mots-clés)
// ============================================================================

/**
 * Keywords database for automatic linking
 * Maps common terms to entity types and specific entities
 */
const ENTITY_KEYWORDS: Record<string, { entityType: string; keywords: string[] }[]> = {
  // Molécules communes
  'linalool': [{ entityType: 'molecule', keywords: ['linalool', 'linalol', 'linalyl'] }],
  'limonene': [{ entityType: 'molecule', keywords: ['limonene', 'limonène', 'd-limonene'] }],
  'pinene': [{ entityType: 'molecule', keywords: ['pinene', 'pinène', 'alpha-pinene', 'beta-pinene'] }],
  'geraniol': [{ entityType: 'molecule', keywords: ['geraniol', 'géraniol'] }],
  'citronellol': [{ entityType: 'molecule', keywords: ['citronellol', 'citronellal'] }],
  'eugenol': [{ entityType: 'molecule', keywords: ['eugenol', 'eugénol', 'methyl eugenol'] }],
  'carvone': [{ entityType: 'molecule', keywords: ['carvone', 'carvon'] }],
  'menthol': [{ entityType: 'molecule', keywords: ['menthol', 'menthone'] }],
  'camphor': [{ entityType: 'molecule', keywords: ['camphor', 'camphre', 'camphène'] }],
  'thymol': [{ entityType: 'molecule', keywords: ['thymol', 'thym'] }],
  'caryophyllene': [{ entityType: 'molecule', keywords: ['caryophyllene', 'caryophyllène', 'beta-caryophyllene'] }],
  'myrcene': [{ entityType: 'molecule', keywords: ['myrcene', 'myrcène'] }],
  'terpinene': [{ entityType: 'molecule', keywords: ['terpinene', 'terpinène', 'gamma-terpinene'] }],
  'ocimene': [{ entityType: 'molecule', keywords: ['ocimene', 'ocimène'] }],
  'farnesene': [{ entityType: 'molecule', keywords: ['farnesene', 'farnésène'] }],
  'humulene': [{ entityType: 'molecule', keywords: ['humulene', 'humulène', 'alpha-humulene'] }],
  'bisabolol': [{ entityType: 'molecule', keywords: ['bisabolol', 'bisabolène'] }],
  'nerolidol': [{ entityType: 'molecule', keywords: ['nerolidol', 'nérolidol'] }],
  'valencene': [{ entityType: 'molecule', keywords: ['valencene', 'valencène'] }],
  'guaiol': [{ entityType: 'molecule', keywords: ['guaiol', 'guaïol'] }],
  // Plantes communes
  'lavande': [{ entityType: 'plant', keywords: ['lavande', 'lavender', 'lavandula'] }],
  'rose': [{ entityType: 'plant', keywords: ['rose', 'rosa', 'rosier'] }],
  'jasmin': [{ entityType: 'plant', keywords: ['jasmin', 'jasmine', 'jasminum'] }],
  'menthe': [{ entityType: 'plant', keywords: ['menthe', 'mint', 'mentha'] }],
  'eucalyptus': [{ entityType: 'plant', keywords: ['eucalyptus'] }],
  'citron': [{ entityType: 'plant', keywords: ['citron', 'lemon', 'citrus limon'] }],
  'orange': [{ entityType: 'plant', keywords: ['orange', 'citrus sinensis', 'oranger'] }],
  'bergamote': [{ entityType: 'plant', keywords: ['bergamote', 'bergamot', 'citrus bergamia'] }],
  'patchouli': [{ entityType: 'plant', keywords: ['patchouli', 'pogostemon'] }],
  'vetiver': [{ entityType: 'plant', keywords: ['vetiver', 'vétiver', 'chrysopogon'] }],
  'santal': [{ entityType: 'plant', keywords: ['santal', 'sandalwood', 'santalum'] }],
  'cedre': [{ entityType: 'plant', keywords: ['cèdre', 'cedar', 'cedrus'] }],
  'ylang': [{ entityType: 'plant', keywords: ['ylang', 'cananga'] }],
  'geranium': [{ entityType: 'plant', keywords: ['géranium', 'geranium', 'pelargonium'] }],
  'romarin': [{ entityType: 'plant', keywords: ['romarin', 'rosemary', 'rosmarinus'] }],
  'thym': [{ entityType: 'plant', keywords: ['thym', 'thyme', 'thymus'] }],
  'sauge': [{ entityType: 'plant', keywords: ['sauge', 'sage', 'salvia'] }],
  'basilic': [{ entityType: 'plant', keywords: ['basilic', 'basil', 'ocimum'] }],
  'cannabis': [{ entityType: 'plant', keywords: ['cannabis', 'hemp', 'chanvre', 'marijuana'] }],
  'tabac': [{ entityType: 'plant', keywords: ['tabac', 'tobacco', 'nicotiana'] }],
  // Terroirs
  'grasse': [{ entityType: 'terroir', keywords: ['grasse', 'provence'] }],
  'madagascar': [{ entityType: 'terroir', keywords: ['madagascar'] }],
  'egypte': [{ entityType: 'terroir', keywords: ['egypte', 'egypt', 'égypte'] }],
  'inde': [{ entityType: 'terroir', keywords: ['inde', 'india', 'indien'] }],
  'maroc': [{ entityType: 'terroir', keywords: ['maroc', 'morocco', 'marocain'] }],
  'bulgarie': [{ entityType: 'terroir', keywords: ['bulgarie', 'bulgaria', 'bulgare'] }],
  'turquie': [{ entityType: 'terroir', keywords: ['turquie', 'turkey', 'turc'] }],
  'iran': [{ entityType: 'terroir', keywords: ['iran', 'perse', 'persia'] }],
};

/**
 * Extract keywords from text for matching
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Normalize text: lowercase, remove accents, split on non-alphanumeric
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  return Array.from(new Set(normalized));
}

/**
 * Find common keywords between two sets
 */
function findCommonKeywords(keywords1: string[], keywords2: string[]): string[] {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  return Array.from(set1).filter(k => set2.has(k));
}

/**
 * Calculate similarity score between two sets of keywords
 */
function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  
  let matches = 0;
  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  for (const word of arr1) {
    if (set2.has(word)) {
      matches++;
    } else {
      // Check for partial matches (substring)
      for (const word2 of arr2) {
        if (word.includes(word2) || word2.includes(word)) {
          matches += 0.5;
          break;
        }
      }
    }
  }
  
  // Jaccard-like similarity
  const union = new Set(Array.from(set1).concat(Array.from(set2))).size;
  return Math.round((matches / union) * 100);
}

/**
 * Suggest entity links for a reference based on keywords
 */
export async function suggestEntityLinksForReference(referenceId: number): Promise<{
  referenceId: number;
  referenceTitle: string;
  suggestions: {
    entityType: 'molecule' | 'plant' | 'terroir' | 'recette' | 'tradition';
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
    reason: string;
  }[];
}> {
  const db = await getDb();
  if (!db) return { referenceId, referenceTitle: '', suggestions: [] };
  
  // Get the reference
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, referenceId));
  
  if (!ref) return { referenceId, referenceTitle: '', suggestions: [] };
  
  // Extract keywords from reference
  const refText = [
    ref.title || '',
    ref.notes || '',
    ref.userNotes || '',
    ...(ref.tags || []),
  ].join(' ');
  
  const refKeywords = extractKeywords(refText);
  const suggestions: {
    entityType: 'molecule' | 'plant' | 'terroir' | 'recette' | 'tradition';
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
    reason: string;
  }[] = [];
  
  // Get existing links to exclude
  const existingLinks = await db
    .select({ entityType: referenceEntityLinks.entityType, entityId: referenceEntityLinks.entityId })
    .from(referenceEntityLinks)
    .where(eq(referenceEntityLinks.referenceId, referenceId));
  
  const existingSet = new Set(existingLinks.map(l => `${l.entityType}:${l.entityId}`));
  
  // Search molecules
  const allMolecules = await db
    .select({ id: molecules.id, name: molecules.name, olfactiveProfile: molecules.olfactiveProfile })
    .from(molecules)
    .limit(1000);
  
  for (const mol of allMolecules) {
    if (existingSet.has(`molecule:${mol.id}`)) continue;
    
    const molKeywords = extractKeywords([mol.name, mol.olfactiveProfile || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, molKeywords);
    
    if (score >= 20) {
      const matchedKeywords = refKeywords.filter(k => 
        molKeywords.some(mk => mk.includes(k) || k.includes(mk))
      );
      suggestions.push({
        entityType: 'molecule',
        entityId: mol.id,
        entityName: mol.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Search plants
  const allPlants = await db
    .select({ id: plants.id, name: plants.name, latinName: plants.latinName, olfactiveSignature: plants.olfactiveSignature })
    .from(plants)
    .limit(500);
  
  for (const plant of allPlants) {
    if (existingSet.has(`plant:${plant.id}`)) continue;
    
    const plantKeywords = extractKeywords([plant.name, plant.latinName || '', plant.olfactiveSignature || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
    
    if (score >= 20) {
      const matchedKeywords = refKeywords.filter(k => 
        plantKeywords.some(pk => pk.includes(k) || k.includes(pk))
      );
      suggestions.push({
        entityType: 'plant',
        entityId: plant.id,
        entityName: plant.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Search terroirs
  const allTerroirs = await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, region: terroirs.region })
    .from(terroirs)
    .limit(100);
  
  for (const terroir of allTerroirs) {
    if (existingSet.has(`terroir:${terroir.id}`)) continue;
    
    const terroirKeywords = extractKeywords([terroir.name, terroir.country || '', terroir.region || ''].join(' '));
    const score = calculateKeywordSimilarity(refKeywords, terroirKeywords);
    
    if (score >= 15) {
      const matchedKeywords = refKeywords.filter(k => 
        terroirKeywords.some(tk => tk.includes(k) || k.includes(tk))
      );
      suggestions.push({
        entityType: 'terroir',
        entityId: terroir.id,
        entityName: terroir.name,
        score,
        matchedKeywords,
        reason: `Mots-clés communs: ${matchedKeywords.slice(0, 3).join(', ')}`,
      });
    }
  }
  
  // Sort by score and limit
  suggestions.sort((a, b) => b.score - a.score);
  
  return {
    referenceId,
    referenceTitle: ref.title || '',
    suggestions: suggestions.slice(0, 20),
  };
}

/**
 * Bulk suggest entity links for all references
 */
export async function bulkSuggestEntityLinks(options?: {
  minScore?: number;
  limit?: number;
  entityTypes?: ('molecule' | 'plant' | 'terroir')[];
}): Promise<{
  totalReferences: number;
  referencesWithSuggestions: number;
  totalSuggestions: number;
  suggestions: {
    referenceId: number;
    referenceTitle: string;
    axisPrimaryCode: string | null;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }[];
}> {
  const db = await getDb();
  if (!db) return { totalReferences: 0, referencesWithSuggestions: 0, totalSuggestions: 0, suggestions: [] };
  
  const minScore = options?.minScore || 25;
  const limit = options?.limit || 100;
  const entityTypes = options?.entityTypes || ['molecule', 'plant', 'terroir'];
  
  // Get all references
  const allRefs = await db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year));
  
  // Get all existing links
  const existingLinks = await db
    .select({ referenceId: referenceEntityLinks.referenceId, entityType: referenceEntityLinks.entityType, entityId: referenceEntityLinks.entityId })
    .from(referenceEntityLinks);
  
  const existingSet = new Set(existingLinks.map(l => `${l.referenceId}:${l.entityType}:${l.entityId}`));
  
  // Get all entities
  const allMolecules = entityTypes.includes('molecule') ? await db
    .select({ id: molecules.id, name: molecules.name, olfactiveProfile: molecules.olfactiveProfile })
    .from(molecules)
    .limit(1000) : [];
  
  const allPlants = entityTypes.includes('plant') ? await db
    .select({ id: plants.id, name: plants.name, latinName: plants.latinName, olfactiveSignature: plants.olfactiveSignature })
    .from(plants)
    .limit(500) : [];
  
  const allTerroirs = entityTypes.includes('terroir') ? await db
    .select({ id: terroirs.id, name: terroirs.name, country: terroirs.country, region: terroirs.region })
    .from(terroirs)
    .limit(100) : [];
  
  const allSuggestions: {
    referenceId: number;
    referenceTitle: string;
    axisPrimaryCode: string | null;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }[] = [];
  
  let referencesWithSuggestions = 0;
  
  for (const ref of allRefs) {
    const refText = [
      ref.title || '',
      ref.notes || '',
      ref.userNotes || '',
      ...(ref.tags || []),
    ].join(' ');
    
    const refKeywords = extractKeywords(refText);
    let hasSuggestions = false;
    
    // Check molecules
    for (const mol of allMolecules) {
      if (existingSet.has(`${ref.id}:molecule:${mol.id}`)) continue;
      
      const molKeywords = extractKeywords([mol.name, mol.olfactiveProfile || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, molKeywords);
      
      if (score >= minScore) {
        const matchedKeywords = refKeywords.filter(k => 
          molKeywords.some(mk => mk.includes(k) || k.includes(mk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'molecule',
          entityId: mol.id,
          entityName: mol.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    // Check plants
    for (const plant of allPlants) {
      if (existingSet.has(`${ref.id}:plant:${plant.id}`)) continue;
      
      const plantKeywords = extractKeywords([plant.name, plant.latinName || '', plant.olfactiveSignature || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
      
      if (score >= minScore) {
        const matchedKeywords = refKeywords.filter(k => 
          plantKeywords.some(pk => pk.includes(k) || k.includes(pk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'plant',
          entityId: plant.id,
          entityName: plant.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    // Check terroirs
    for (const terroir of allTerroirs) {
      if (existingSet.has(`${ref.id}:terroir:${terroir.id}`)) continue;
      
      const terroirKeywords = extractKeywords([terroir.name, terroir.country || '', terroir.region || ''].join(' '));
      const score = calculateKeywordSimilarity(refKeywords, terroirKeywords);
      
      if (score >= minScore - 10) {
        const matchedKeywords = refKeywords.filter(k => 
          terroirKeywords.some(tk => tk.includes(k) || k.includes(tk))
        );
        allSuggestions.push({
          referenceId: ref.id,
          referenceTitle: ref.title || '',
          axisPrimaryCode: ref.axisPrimaryCode,
          entityType: 'terroir',
          entityId: terroir.id,
          entityName: terroir.name,
          score,
          matchedKeywords,
        });
        hasSuggestions = true;
      }
    }
    
    if (hasSuggestions) referencesWithSuggestions++;
  }
  
  // Sort by score and limit
  allSuggestions.sort((a, b) => b.score - a.score);
  
  return {
    totalReferences: allRefs.length,
    referencesWithSuggestions,
    totalSuggestions: allSuggestions.length,
    suggestions: allSuggestions.slice(0, limit),
  };
}

/**
 * Create multiple entity links at once (batch)
 */
export async function batchCreateEntityLinks(links: {
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  createdBy?: number;
}[]): Promise<{ created: number; skipped: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { created: 0, skipped: 0, errors: ['Database not available'] };
  
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      // Check if link already exists
      const [existing] = await db
        .select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(
          and(
            eq(referenceEntityLinks.referenceId, link.referenceId),
            eq(referenceEntityLinks.entityType, link.entityType),
            eq(referenceEntityLinks.entityId, link.entityId)
          )
        );
      
      if (existing) {
        skipped++;
        continue;
      }
      
      await db.insert(referenceEntityLinks).values({
        referenceId: link.referenceId,
        entityType: link.entityType,
        entityId: link.entityId,
        linkType: link.linkType || 'documents',
        relevanceScore: link.relevanceScore || 50,
        notes: link.notes,
        createdBy: link.createdBy,
      });
      
      created++;
    } catch (error) {
      errors.push(`Failed to create link ${link.referenceId}->${link.entityType}:${link.entityId}: ${error}`);
    }
  }
  
  return { created, skipped, errors };
}

/**
 * Get references grouped by thematic axis for graph visualization
 */
export async function getReferencesGroupedByAxis(): Promise<{
  axes: {
    id: number;
    code: string;
    name: string;
    metaAxis: string;
    color: string;
    referenceCount: number;
  }[];
  references: {
    id: number;
    title: string;
    year: number | null;
    entryType: string;
    axisPrimaryCode: string | null;
    axesSecondary: string[] | null;
    entityLinkCount: number;
  }[];
  links: {
    source: string; // axis code or reference id
    target: string;
    type: 'primary' | 'secondary';
  }[];
}> {
  const db = await getDb();
  if (!db) return { axes: [], references: [], links: [] };
  
  // Get all axes
  const axes = await db
    .select()
    .from(thematicAxes)
    .orderBy(thematicAxes.displayOrder, thematicAxes.axisCode);
  
  // Get all references
  const refs = await db
    .select()
    .from(v3References)
    .orderBy(desc(v3References.year));
  
  // Get entity link counts per reference
  const linkCounts = await db
    .select({
      referenceId: referenceEntityLinks.referenceId,
      count: count(),
    })
    .from(referenceEntityLinks)
    .groupBy(referenceEntityLinks.referenceId);
  
  const linkCountMap = new Map(linkCounts.map(l => [l.referenceId, l.count]));
  
  // Count references per axis
  const axisRefCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      axisRefCounts.set(ref.axisPrimaryCode, (axisRefCounts.get(ref.axisPrimaryCode) || 0) + 1);
    }
    for (const code of (ref.axesSecondary || [])) {
      axisRefCounts.set(code, (axisRefCounts.get(code) || 0) + 1);
    }
  }
  
  // Build links
  const links: { source: string; target: string; type: 'primary' | 'secondary' }[] = [];
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      links.push({
        source: ref.axisPrimaryCode,
        target: `ref-${ref.id}`,
        type: 'primary',
      });
    }
    for (const code of (ref.axesSecondary || [])) {
      links.push({
        source: code,
        target: `ref-${ref.id}`,
        type: 'secondary',
      });
    }
  }
  
  return {
    axes: axes.map(a => ({
      id: a.id,
      code: a.axisCode,
      name: a.name,
      metaAxis: a.metaAxis,
      color: a.color || '#6366f1',
      referenceCount: axisRefCounts.get(a.axisCode) || 0,
    })),
    references: refs.map(r => ({
      id: r.id,
      title: r.title || '',
      year: r.year,
      entryType: r.entryType,
      axisPrimaryCode: r.axisPrimaryCode,
      axesSecondary: r.axesSecondary,
      entityLinkCount: linkCountMap.get(r.id) || 0,
    })),
    links,
  };
}

/**
 * Get reference details with all linked entities
 */
export async function getReferenceWithLinkedEntities(referenceId: number): Promise<{
  reference: typeof v3References.$inferSelect | null;
  axis: typeof thematicAxes.$inferSelect | null;
  linkedEntities: {
    entityType: string;
    entityId: number;
    entityName: string;
    linkType: string;
    relevanceScore: number;
    notes: string | null;
  }[];
}> {
  const db = await getDb();
  if (!db) return { reference: null, axis: null, linkedEntities: [] };
  
  // Get reference
  const [ref] = await db
    .select()
    .from(v3References)
    .where(eq(v3References.id, referenceId));
  
  if (!ref) return { reference: null, axis: null, linkedEntities: [] };
  
  // Get primary axis
  let axis = null;
  if (ref.axisPrimaryId) {
    const [a] = await db
      .select()
      .from(thematicAxes)
      .where(eq(thematicAxes.id, ref.axisPrimaryId));
    axis = a;
  }
  
  // Get linked entities
  const links = await getLinksForReference(referenceId);
  
  return {
    reference: ref,
    axis,
    linkedEntities: links.map(l => ({
      entityType: l.entityType,
      entityId: l.entityId,
      entityName: l.entityName || '',
      linkType: l.linkType || 'documents',
      relevanceScore: l.relevanceScore || 50,
      notes: l.notes,
    })),
  };
}

/**
 * Get statistics for graph visualization
 */
export async function getGraphVisualizationStats(): Promise<{
  totalAxes: number;
  totalReferences: number;
  totalLinks: number;
  referencesByMetaAxis: { metaAxis: string; count: number }[];
  topAxesByReferences: { code: string; name: string; count: number }[];
  referencesWithLinks: number;
  referencesWithoutLinks: number;
}> {
  const db = await getDb();
  if (!db) return {
    totalAxes: 0,
    totalReferences: 0,
    totalLinks: 0,
    referencesByMetaAxis: [],
    topAxesByReferences: [],
    referencesWithLinks: 0,
    referencesWithoutLinks: 0,
  };
  
  // Count axes
  const [axesCount] = await db.select({ count: count() }).from(thematicAxes);
  
  // Count references
  const [refsCount] = await db.select({ count: count() }).from(v3References);
  
  // Count entity links
  const [linksCount] = await db.select({ count: count() }).from(referenceEntityLinks);
  
  // Get all axes
  const axes = await db.select().from(thematicAxes);
  
  // Get all references
  const refs = await db.select().from(v3References);
  
  // Count by meta-axis
  const metaAxisCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      const axis = axes.find(a => a.axisCode === ref.axisPrimaryCode);
      if (axis) {
        metaAxisCounts.set(axis.metaAxis, (metaAxisCounts.get(axis.metaAxis) || 0) + 1);
      }
    }
  }
  
  // Count references per axis
  const axisRefCounts = new Map<string, number>();
  for (const ref of refs) {
    if (ref.axisPrimaryCode) {
      axisRefCounts.set(ref.axisPrimaryCode, (axisRefCounts.get(ref.axisPrimaryCode) || 0) + 1);
    }
  }
  
  // Get references with entity links
  const refsWithLinks = await db
    .selectDistinct({ referenceId: referenceEntityLinks.referenceId })
    .from(referenceEntityLinks);
  
  return {
    totalAxes: axesCount.count,
    totalReferences: refsCount.count,
    totalLinks: linksCount.count,
    referencesByMetaAxis: Array.from(metaAxisCounts.entries()).map(([metaAxis, count]) => ({
      metaAxis,
      count,
    })),
    topAxesByReferences: Array.from(axisRefCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([code, count]) => {
        const axis = axes.find(a => a.axisCode === code);
        return {
          code,
          name: axis?.name || code,
          count,
        };
      }),
    referencesWithLinks: refsWithLinks.length,
    referencesWithoutLinks: refsCount.count - refsWithLinks.length,
  };
}


// ============================================
// FONCTIONS UTILITAIRES SYNONYMES OLFACTIFS
// ============================================

/**
 * Récupère les synonymes d'un terme olfactif
 */
export function getOlfactiveSynonyms(term: string): string[] {
  return getSynonyms(term);
}

/**
 * Étend une requête de recherche avec ses synonymes olfactifs
 */
export function expandOlfactiveSearchQuery(query: string): string[] {
  return expandSearchQuery(query);
}

/**
 * Catégorise un terme selon son domaine olfactif
 */
export function categorizeOlfactiveSearchTerm(term: string): {
  category: 'family' | 'note' | 'technical' | 'sensory' | 'emotional' | 'unknown';
  confidence: number;
} {
  return categorizeOlfactiveTerm(term);
}

/**
 * Récupère les statistiques du dictionnaire de synonymes olfactifs
 */
export function getOlfactiveDictionaryStats(): {
  totalTerms: number;
  byCategory: Record<string, number>;
  totalSynonyms: number;
} {
  return getDictionaryStats();
}


// ============================================================================
// LIAISONS MOLÉCULE-FAMILLE CHIMIQUE (pour graphe et export)
// ============================================================================

/**
 * Récupère toutes les liaisons molécule-famille chimique avec détails complets
 */
export async function getAllMoleculeChemicalFamilyLinks() {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select({
      moleculeId: molecules.id,
      moleculeName: molecules.name,
      moleculeFamily: molecules.family,
      chemicalFamilyId: chemicalFamilies.id,
      chemicalFamilyName: chemicalFamilies.name,
      chemicalFamilyType: chemicalFamilies.type,
      chemicalFamilyDescription: chemicalFamilies.description,
      chemicalFamilyOlfactiveRole: chemicalFamilies.olfactiveRole,
    })
    .from(moleculeChemicalFamilies)
    .innerJoin(molecules, eq(moleculeChemicalFamilies.moleculeId, molecules.id))
    .innerJoin(chemicalFamilies, eq(moleculeChemicalFamilies.chemicalFamilyId, chemicalFamilies.id))
    .orderBy(chemicalFamilies.name, molecules.name);
  
  return links;
}

/**
 * Exporte les liaisons molécule-famille chimique au format CSV
 */
export async function exportMoleculeChemicalFamilyLinksCSV() {
  const links = await getAllMoleculeChemicalFamilyLinks();
  
  // En-têtes CSV
  const headers = [
    'molecule_id',
    'molecule_name',
    'molecule_family',
    'chemical_family_id',
    'chemical_family_name',
    'chemical_family_type',
    'chemical_family_description',
    'chemical_family_olfactive_role',
  ];
  
  // Lignes CSV
  const rows = links.map((link: {
    moleculeId: number;
    moleculeName: string;
    moleculeFamily: string | null;
    chemicalFamilyId: number;
    chemicalFamilyName: string;
    chemicalFamilyType: string;
    chemicalFamilyDescription: string | null;
    chemicalFamilyOlfactiveRole: string | null;
  }) => [
    link.moleculeId,
    `"${(link.moleculeName || '').replace(/"/g, '""')}"`,
    `"${(link.moleculeFamily || '').replace(/"/g, '""')}"`,
    link.chemicalFamilyId,
    `"${(link.chemicalFamilyName || '').replace(/"/g, '""')}"`,
    `"${(link.chemicalFamilyType || '').replace(/"/g, '""')}"`,
    `"${(link.chemicalFamilyDescription || '').replace(/"/g, '""')}"`,
    `"${(link.chemicalFamilyOlfactiveRole || '').replace(/"/g, '""')}"`,
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Exporte les liaisons molécule-famille chimique au format JSON
 */
export async function exportMoleculeChemicalFamilyLinksJSON() {
  const links = await getAllMoleculeChemicalFamilyLinks();
  
  return {
    exportDate: new Date().toISOString(),
    totalLinks: links.length,
    uniqueMolecules: new Set(links.map((l: { moleculeId: number }) => l.moleculeId)).size,
    uniqueFamilies: new Set(links.map((l: { chemicalFamilyId: number }) => l.chemicalFamilyId)).size,
    links: links.map((link: {
      moleculeId: number;
      moleculeName: string;
      moleculeFamily: string | null;
      chemicalFamilyId: number;
      chemicalFamilyName: string;
      chemicalFamilyType: string;
      chemicalFamilyDescription: string | null;
      chemicalFamilyOlfactiveRole: string | null;
    }) => ({
      molecule: {
        id: link.moleculeId,
        name: link.moleculeName,
        family: link.moleculeFamily,
      },
      chemicalFamily: {
        id: link.chemicalFamilyId,
        name: link.chemicalFamilyName,
        type: link.chemicalFamilyType,
        description: link.chemicalFamilyDescription,
        olfactiveRole: link.chemicalFamilyOlfactiveRole,
      },
    })),
  };
}


// ============================================================================
// ORPHAN MOLECULES CLASSIFICATION
// ============================================================================

export interface OrphanMoleculeStats {
  totalMolecules: number;
  withFamily: number;
  withChemicalClass: number;
  withCasNumber: number;
  withIupacName: number;
  withFormula: number;
  withOlfactiveProfile: number;
  withRadarComplete: number;
  orphanCount: number;
  classificationRate: number;
}

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

export async function getOrphanMoleculesList(filter: OrphanFilter = 'all', limit: number = 100, offset: number = 0) {
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

export async function batchClassifyMolecules(updates: Array<{
  moleculeId: number;
  family?: string;
  chemicalClass?: string;
  olfactiveProfile?: string;
}>) {
  const db = await getDb();
  if (!db) return { success: false, updated: 0 };

  let updated = 0;
  for (const update of updates) {
    const updateData: Record<string, unknown> = {};
    if (update.family !== undefined) updateData.family = update.family;
    if (update.chemicalClass !== undefined) updateData.chemicalClass = update.chemicalClass;
    if (update.olfactiveProfile !== undefined) updateData.olfactiveProfile = update.olfactiveProfile;

    if (Object.keys(updateData).length > 0) {
      await db.update(molecules).set(updateData).where(eq(molecules.id, update.moleculeId));
      updated++;
    }
  }

  return { success: true, updated };
}

// ============================================================================
// NOTIFICATIONS SYSTEM
// ============================================================================

import { notifications, classificationSnapshots, type Notification, type InsertNotification, type ClassificationSnapshot, type InsertClassificationSnapshot } from "../drizzle/schema";

export async function createNotification(data: InsertNotification): Promise<Notification | null> {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db.insert(notifications).values(data);
  const [notification] = await db.select().from(notifications).where(eq(notifications.id, result.insertId));
  return notification || null;
}

export async function getNotifications(options: {
  unreadOnly?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const db = await getDb();
  if (!db) return { notifications: [], total: 0, unreadCount: 0 };

  const { unreadOnly = false, type, limit = 50, offset = 0 } = options;

  let query = db.select().from(notifications);
  
  // Récupérer toutes les notifications pour les comptes
  const allNotifications = await query.orderBy(desc(notifications.createdAt));
  
  // Filtrer
  let filtered = allNotifications;
  if (unreadOnly) {
    filtered = filtered.filter(n => !n.isRead);
  }
  if (type) {
    filtered = filtered.filter(n => n.type === type);
  }

  const total = filtered.length;
  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  const paginatedNotifications = filtered.slice(offset, offset + limit);

  return {
    notifications: paginatedNotifications,
    total,
    unreadCount,
  };
}

export async function markNotificationAsRead(notificationId: number, userId?: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(notifications)
    .set({ 
      isRead: true, 
      readAt: new Date(),
      readBy: userId || null,
    })
    .where(eq(notifications.id, notificationId));

  return true;
}

export async function markAllNotificationsAsRead(userId?: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(notifications)
    .set({ 
      isRead: true, 
      readAt: new Date(),
      readBy: userId || null,
    })
    .where(eq(notifications.isRead, false));

  return true;
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(notifications).where(eq(notifications.id, notificationId));
  return true;
}

export async function createOrphanMoleculeNotification(moleculeIds: number[], importSource?: string) {
  const db = await getDb();
  if (!db) return null;

  const count = moleculeIds.length;
  if (count === 0) return null;

  return await createNotification({
    type: 'import_orphan_molecules',
    title: `${count} molécule${count > 1 ? 's' : ''} sans classification importée${count > 1 ? 's' : ''}`,
    message: `${count} nouvelle${count > 1 ? 's' : ''} molécule${count > 1 ? 's' : ''} ${count > 1 ? 'ont été importées' : 'a été importée'} sans classification complète. ${importSource ? `Source: ${importSource}` : ''}`,
    severity: 'warning',
    entityType: 'molecule',
    metadata: {
      count,
      moleculeIds,
      importId: importSource,
    },
  });
}

// ============================================================================
// CLASSIFICATION SNAPSHOTS (Progress Tracking)
// ============================================================================

export async function createClassificationSnapshot(notes?: string, createdBy?: number): Promise<ClassificationSnapshot | null> {
  const db = await getDb();
  if (!db) return null;

  // Récupérer les statistiques actuelles
  const stats = await getOrphanMoleculeStats();
  if (!stats) return null;

  // Récupérer les statistiques de liaison
  const linkingStats = await getLinkingCoverageStats();
  
  // Compter les entités
  const allRecettes = await db.select().from(recettes);
  const allPlants = await db.select().from(plants);
  const allTerroirs = await db.select().from(terroirs);
  const allAccords = await db.select().from(accords);

  // Calculer les taux
  const classificationFields = [
    stats.withFamily / stats.totalMolecules,
    stats.withChemicalClass / stats.totalMolecules,
    stats.withCasNumber / stats.totalMolecules,
    stats.withIupacName / stats.totalMolecules,
    stats.withFormula / stats.totalMolecules,
    stats.withOlfactiveProfile / stats.totalMolecules,
  ];
  const overallClassificationRate = Math.round(
    (classificationFields.reduce((a, b) => a + b, 0) / classificationFields.length) * 10000
  );

  const linkingFields = linkingStats ? [
    linkingStats.moleculeRecette.coverageMolecules / 100,
    linkingStats.plantMolecule.coverageMolecules / 100,
    linkingStats.plantTerroir.coveragePlants / 100,
  ] : [0, 0, 0];
  const overallLinkingRate = Math.round(
    (linkingFields.reduce((a, b) => a + b, 0) / linkingFields.length) * 10000
  );

  const snapshotData: InsertClassificationSnapshot = {
    snapshotDate: new Date(),
    totalMolecules: stats.totalMolecules,
    moleculesWithFamily: stats.withFamily,
    moleculesWithChemicalClass: stats.withChemicalClass,
    moleculesWithCasNumber: stats.withCasNumber,
    moleculesWithIupacName: stats.withIupacName,
    moleculesWithFormula: stats.withFormula,
    moleculesWithOlfactiveProfile: stats.withOlfactiveProfile,
    moleculesWithRadar: stats.withRadarComplete,
    moleculesLinkedToRecettes: linkingStats?.moleculeRecette.moleculesWithRecette || 0,
    moleculesLinkedToPlants: linkingStats?.plantMolecule.moleculesWithPlant || 0,
    plantsLinkedToTerroirs: linkingStats?.plantTerroir.plantsWithTerroir || 0,
    overallClassificationRate,
    overallLinkingRate,
    totalRecettes: allRecettes.length,
    totalPlants: allPlants.length,
    totalTerroirs: allTerroirs.length,
    totalAccords: allAccords.length,
    notes,
    createdBy,
  };

  const [result] = await db.insert(classificationSnapshots).values(snapshotData);
  const [snapshot] = await db.select().from(classificationSnapshots).where(eq(classificationSnapshots.id, result.insertId));
  
  // Créer une notification si un jalon est atteint
  const milestones = [25, 50, 75, 90, 95, 100];
  const currentRate = overallClassificationRate / 100;
  for (const milestone of milestones) {
    if (currentRate >= milestone) {
      // Vérifier si ce jalon a déjà été notifié
      const existingNotification = await db.select().from(notifications)
        .where(and(
          eq(notifications.type, 'classification_milestone'),
          sql`JSON_EXTRACT(metadata, '$.milestone') = ${milestone}`
        ))
        .limit(1);
      
      if (existingNotification.length === 0) {
        await createNotification({
          type: 'classification_milestone',
          title: `Jalon de classification atteint: ${milestone}%`,
          message: `Le taux de classification global a atteint ${milestone}%. Félicitations pour cette progression!`,
          severity: 'success',
          metadata: { milestone, rate: currentRate },
        });
      }
    }
  }

  return snapshot || null;
}

export async function getClassificationSnapshots(options: {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const db = await getDb();
  if (!db) return { snapshots: [], total: 0 };

  const { limit = 100, offset = 0, startDate, endDate } = options;

  let allSnapshots = await db.select().from(classificationSnapshots)
    .orderBy(desc(classificationSnapshots.snapshotDate));

  // Filtrer par date si spécifié
  if (startDate) {
    allSnapshots = allSnapshots.filter(s => new Date(s.snapshotDate) >= startDate);
  }
  if (endDate) {
    allSnapshots = allSnapshots.filter(s => new Date(s.snapshotDate) <= endDate);
  }

  const total = allSnapshots.length;
  const paginatedSnapshots = allSnapshots.slice(offset, offset + limit);

  return {
    snapshots: paginatedSnapshots,
    total,
  };
}

export async function getLatestSnapshot(): Promise<ClassificationSnapshot | null> {
  const db = await getDb();
  if (!db) return null;

  const [snapshot] = await db.select().from(classificationSnapshots)
    .orderBy(desc(classificationSnapshots.snapshotDate))
    .limit(1);

  return snapshot || null;
}

export async function getProgressReport(startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return null;

  const { snapshots } = await getClassificationSnapshots({ 
    startDate, 
    endDate,
    limit: 1000,
  });

  if (snapshots.length === 0) return null;

  const firstSnapshot = snapshots[snapshots.length - 1];
  const lastSnapshot = snapshots[0];

  // Calculer les progressions
  const calculateProgress = (first: number, last: number) => ({
    start: first,
    end: last,
    change: last - first,
    changePercent: first > 0 ? Math.round(((last - first) / first) * 100) : 0,
  });

  // Projection sur 10 ans basée sur la tendance actuelle
  const daysBetween = snapshots.length > 1 
    ? (new Date(lastSnapshot.snapshotDate).getTime() - new Date(firstSnapshot.snapshotDate).getTime()) / (1000 * 60 * 60 * 24)
    : 1;
  
  const dailyClassificationProgress = daysBetween > 0 
    ? (lastSnapshot.overallClassificationRate - firstSnapshot.overallClassificationRate) / daysBetween
    : 0;
  
  const daysToComplete = dailyClassificationProgress > 0 
    ? Math.ceil((10000 - lastSnapshot.overallClassificationRate) / dailyClassificationProgress)
    : Infinity;

  const projectedCompletionDate = daysToComplete !== Infinity && daysToComplete > 0
    ? new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000)
    : null;

  return {
    period: {
      start: firstSnapshot.snapshotDate,
      end: lastSnapshot.snapshotDate,
      snapshotCount: snapshots.length,
    },
    classification: {
      overall: calculateProgress(firstSnapshot.overallClassificationRate / 100, lastSnapshot.overallClassificationRate / 100),
      family: calculateProgress(
        (firstSnapshot.moleculesWithFamily / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithFamily / lastSnapshot.totalMolecules) * 100
      ),
      chemicalClass: calculateProgress(
        (firstSnapshot.moleculesWithChemicalClass / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithChemicalClass / lastSnapshot.totalMolecules) * 100
      ),
      casNumber: calculateProgress(
        (firstSnapshot.moleculesWithCasNumber / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithCasNumber / lastSnapshot.totalMolecules) * 100
      ),
      iupacName: calculateProgress(
        (firstSnapshot.moleculesWithIupacName / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithIupacName / lastSnapshot.totalMolecules) * 100
      ),
      formula: calculateProgress(
        (firstSnapshot.moleculesWithFormula / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithFormula / lastSnapshot.totalMolecules) * 100
      ),
      olfactiveProfile: calculateProgress(
        (firstSnapshot.moleculesWithOlfactiveProfile / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesWithOlfactiveProfile / lastSnapshot.totalMolecules) * 100
      ),
    },
    linking: {
      overall: calculateProgress(firstSnapshot.overallLinkingRate / 100, lastSnapshot.overallLinkingRate / 100),
      moleculeRecette: calculateProgress(
        (firstSnapshot.moleculesLinkedToRecettes / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesLinkedToRecettes / lastSnapshot.totalMolecules) * 100
      ),
      moleculePlant: calculateProgress(
        (firstSnapshot.moleculesLinkedToPlants / firstSnapshot.totalMolecules) * 100,
        (lastSnapshot.moleculesLinkedToPlants / lastSnapshot.totalMolecules) * 100
      ),
      plantTerroir: calculateProgress(
        (firstSnapshot.plantsLinkedToTerroirs / firstSnapshot.totalPlants) * 100,
        (lastSnapshot.plantsLinkedToTerroirs / lastSnapshot.totalPlants) * 100
      ),
    },
    entities: {
      molecules: calculateProgress(firstSnapshot.totalMolecules, lastSnapshot.totalMolecules),
      recettes: calculateProgress(firstSnapshot.totalRecettes, lastSnapshot.totalRecettes),
      plants: calculateProgress(firstSnapshot.totalPlants, lastSnapshot.totalPlants),
      terroirs: calculateProgress(firstSnapshot.totalTerroirs, lastSnapshot.totalTerroirs),
      accords: calculateProgress(firstSnapshot.totalAccords, lastSnapshot.totalAccords),
    },
    projection: {
      dailyProgress: dailyClassificationProgress / 100, // En pourcentage
      daysToComplete,
      projectedCompletionDate,
      tenYearProjection: {
        date: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
        estimatedClassificationRate: Math.min(100, (lastSnapshot.overallClassificationRate / 100) + (dailyClassificationProgress * 10 * 365 / 100)),
      },
    },
    snapshots: snapshots.map(s => ({
      date: s.snapshotDate,
      classificationRate: s.overallClassificationRate / 100,
      linkingRate: s.overallLinkingRate / 100,
      totalMolecules: s.totalMolecules,
    })),
  };
}


// ============================================================================
// CLASSIFICATION REVIEWS (Low Confidence Review Queue)
// ============================================================================

import { classificationReviews, type ClassificationReview, type InsertClassificationReview } from "../drizzle/schema";

/**
 * Créer une nouvelle révision de classification
 */
export async function createClassificationReview(data: InsertClassificationReview): Promise<ClassificationReview | null> {
  const db = await getDb();
  if (!db) return null;

  // Vérifier si une révision existe déjà pour cette molécule en attente
  const existing = await db.select().from(classificationReviews)
    .where(and(
      eq(classificationReviews.moleculeId, data.moleculeId),
      eq(classificationReviews.status, 'pending')
    ))
    .limit(1);

  if (existing.length > 0) {
    // Mettre à jour la révision existante
    await db.update(classificationReviews)
      .set({
        aiChemicalClass: data.aiChemicalClass,
        aiChemicalClassConfidence: data.aiChemicalClassConfidence,
        aiChemicalClassReasoning: data.aiChemicalClassReasoning,
        aiOlfactiveFamily: data.aiOlfactiveFamily,
        aiOlfactiveFamilyConfidence: data.aiOlfactiveFamilyConfidence,
        aiOlfactiveFamilyReasoning: data.aiOlfactiveFamilyReasoning,
        aiSuggestedOlfactiveProfile: data.aiSuggestedOlfactiveProfile,
        aiBotanicalContextUsed: data.aiBotanicalContextUsed,
        priority: data.priority,
      })
      .where(eq(classificationReviews.id, existing[0].id));
    
    const [updated] = await db.select().from(classificationReviews)
      .where(eq(classificationReviews.id, existing[0].id));
    return updated || null;
  }

  const [result] = await db.insert(classificationReviews).values(data);
  const [review] = await db.select().from(classificationReviews)
    .where(eq(classificationReviews.id, result.insertId));
  return review || null;
}

/**
 * Récupérer les révisions en attente
 */
export async function getPendingReviews(options: {
  limit?: number;
  offset?: number;
  priority?: 'low' | 'medium' | 'high';
  maxConfidence?: number;
} = {}) {
  const db = await getDb();
  if (!db) return { reviews: [], total: 0 };

  const { limit = 50, offset = 0, priority, maxConfidence } = options;

  let allReviews = await db.select({
    review: classificationReviews,
    molecule: molecules,
  })
    .from(classificationReviews)
    .leftJoin(molecules, eq(classificationReviews.moleculeId, molecules.id))
    .where(eq(classificationReviews.status, 'pending'))
    .orderBy(
      desc(sql`CASE WHEN ${classificationReviews.priority} = 'high' THEN 3 WHEN ${classificationReviews.priority} = 'medium' THEN 2 ELSE 1 END`),
      classificationReviews.aiChemicalClassConfidence
    );

  // Filtrer par priorité
  if (priority) {
    allReviews = allReviews.filter(r => r.review.priority === priority);
  }

  // Filtrer par confiance max
  if (maxConfidence !== undefined) {
    allReviews = allReviews.filter(r => (r.review.aiChemicalClassConfidence || 0) <= maxConfidence);
  }

  const total = allReviews.length;
  const paginatedReviews = allReviews.slice(offset, offset + limit);

  return {
    reviews: paginatedReviews,
    total,
  };
}

/**
 * Récupérer les statistiques des révisions
 */
export async function getReviewStats() {
  const db = await getDb();
  if (!db) return {
    pending: 0,
    approved: 0,
    rejected: 0,
    modified: 0,
    skipped: 0,
    total: 0,
    byPriority: { low: 0, medium: 0, high: 0 },
    avgConfidence: 0,
    lowConfidenceCount: 0,
  };

  const allReviews = await db.select().from(classificationReviews);

  const pending = allReviews.filter(r => r.status === 'pending').length;
  const approved = allReviews.filter(r => r.status === 'approved').length;
  const rejected = allReviews.filter(r => r.status === 'rejected').length;
  const modified = allReviews.filter(r => r.status === 'modified').length;
  const skipped = allReviews.filter(r => r.status === 'skipped').length;

  const pendingReviews = allReviews.filter(r => r.status === 'pending');
  const byPriority = {
    low: pendingReviews.filter(r => r.priority === 'low').length,
    medium: pendingReviews.filter(r => r.priority === 'medium').length,
    high: pendingReviews.filter(r => r.priority === 'high').length,
  };

  const confidences = pendingReviews
    .map(r => r.aiChemicalClassConfidence)
    .filter((c): c is number => c !== null);
  const avgConfidence = confidences.length > 0 
    ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
    : 0;

  const lowConfidenceCount = pendingReviews.filter(r => (r.aiChemicalClassConfidence || 0) < 50).length;

  return {
    pending,
    approved,
    rejected,
    modified,
    skipped,
    total: allReviews.length,
    byPriority,
    avgConfidence,
    lowConfidenceCount,
  };
}

/**
 * Approuver une révision et appliquer la classification
 */
export async function approveReview(reviewId: number, userId?: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [review] = await db.select().from(classificationReviews)
    .where(eq(classificationReviews.id, reviewId));

  if (!review || review.status !== 'pending') return false;

  // Appliquer la classification à la molécule
  const updateData: Record<string, unknown> = {};
  if (review.aiChemicalClass) updateData.chemicalClass = review.aiChemicalClass;
  if (review.aiOlfactiveFamily) updateData.family = review.aiOlfactiveFamily;
  if (review.aiSuggestedOlfactiveProfile) updateData.olfactiveProfile = review.aiSuggestedOlfactiveProfile;

  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, review.moleculeId));
  }

  // Marquer la révision comme approuvée
  await db.update(classificationReviews)
    .set({
      status: 'approved',
      reviewedAt: new Date(),
      reviewedBy: userId,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Rejeter une révision
 */
export async function rejectReview(reviewId: number, userId?: number, notes?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.update(classificationReviews)
    .set({
      status: 'rejected',
      reviewedAt: new Date(),
      reviewedBy: userId,
      reviewNotes: notes,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Modifier et appliquer une révision avec des valeurs manuelles
 */
export async function modifyAndApplyReview(
  reviewId: number, 
  modifications: {
    chemicalClass?: string;
    olfactiveFamily?: string;
    olfactiveProfile?: string;
  },
  userId?: number,
  notes?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [review] = await db.select().from(classificationReviews)
    .where(eq(classificationReviews.id, reviewId));

  if (!review || review.status !== 'pending') return false;

  // Appliquer les modifications à la molécule
  const updateData: Record<string, unknown> = {};
  if (modifications.chemicalClass) updateData.chemicalClass = modifications.chemicalClass;
  if ((modifications as any).olfactiveFamily) updateData.family = (modifications as any).olfactiveFamily;
  if (modifications.olfactiveProfile) updateData.olfactiveProfile = modifications.olfactiveProfile;

  if (Object.keys(updateData).length > 0) {
    await db.update(molecules).set(updateData).where(eq(molecules.id, review.moleculeId));
  }

  // Marquer la révision comme modifiée
  await db.update(classificationReviews)
    .set({
      status: 'modified',
      manualChemicalClass: modifications.chemicalClass,
      manualOlfactiveFamily: (modifications as any).olfactiveFamily ?? (modifications as any).family,
      manualOlfactiveProfile: modifications.olfactiveProfile,
      reviewedAt: new Date(),
      reviewedBy: userId,
      reviewNotes: notes,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Ignorer une révision temporairement
 */
export async function skipReview(reviewId: number, userId?: number, notes?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.update(classificationReviews)
    .set({
      status: 'skipped',
      reviewedAt: new Date(),
      reviewedBy: userId,
      reviewNotes: notes,
    })
    .where(eq(classificationReviews.id, reviewId));

  return true;
}

/**
 * Créer des révisions pour toutes les classifications à faible confiance
 */
export async function createReviewsForLowConfidenceClassifications(
  results: Array<{
    moleculeId: number;
    classification: {
      chemicalClass: string;
      chemicalClassConfidence: number;
      chemicalClassReasoning: string;
      olfactiveFamily?: string;
      olfactiveFamilyConfidence?: number;
      olfactiveFamilyReasoning?: string;
      suggestedOlfactiveProfile?: string;
      botanicalContextUsed?: boolean;
    };
  }>,
  confidenceThreshold: number = 70
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  let created = 0;

  for (const result of results) {
    if (result.classification.chemicalClassConfidence < confidenceThreshold) {
      // Déterminer la priorité basée sur la confiance
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (result.classification.chemicalClassConfidence < 30) {
        priority = 'high';
      } else if (result.classification.chemicalClassConfidence >= 50) {
        priority = 'low';
      }

      await createClassificationReview({
        moleculeId: result.moleculeId,
        aiChemicalClass: result.classification.chemicalClass,
        aiChemicalClassConfidence: result.classification.chemicalClassConfidence,
        aiChemicalClassReasoning: result.classification.chemicalClassReasoning,
        aiOlfactiveFamily: (result.classification as any).olfactiveFamily ?? (result.classification as any).family,
        aiOlfactiveFamilyConfidence: result.classification.olfactiveFamilyConfidence,
        aiOlfactiveFamilyReasoning: result.classification.olfactiveFamilyReasoning,
        aiSuggestedOlfactiveProfile: result.classification.suggestedOlfactiveProfile,
        aiBotanicalContextUsed: result.classification.botanicalContextUsed,
        priority,
      });
      created++;
    }
  }

  return created;
}

/**
 * Récupérer une révision par ID avec les données de la molécule
 */
export async function getReviewById(reviewId: number) {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db.select({
    review: classificationReviews,
    molecule: molecules,
  })
    .from(classificationReviews)
    .leftJoin(molecules, eq(classificationReviews.moleculeId, molecules.id))
    .where(eq(classificationReviews.id, reviewId));

  return result || null;
}


// ============================================================================
// GHOST VARIETIES (Variétés fantômes - AX1)
// ============================================================================

import { ghostVarieties, GhostVariety, InsertGhostVariety, genomicMoleculeLinks, GenomicMoleculeLink, InsertGenomicMoleculeLink, genomicPlantLinks, GenomicPlantLink, InsertGenomicPlantLink } from "../drizzle/schema";

/**
 * Get all ghost varieties
 */
export async function getAllGhostVarieties(): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarieties).orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost varieties by variety type
 */
export async function getGhostVarietiesByType(varietyType: string): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarieties)
    .where(eq(ghostVarieties.varietyType, varietyType as any))
    .orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost varieties by conservation status
 */
export async function getGhostVarietiesByStatus(status: string): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarieties)
    .where(eq(ghostVarieties.conservationStatus, status as any))
    .orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost variety by ID
 */
export async function getGhostVarietyById(id: number): Promise<GhostVariety | null> {
  const db = await getDb();
  if (!db) return null;
  const [variety] = await db.select().from(ghostVarieties).where(eq(ghostVarieties.id, id));
  return variety || null;
}

/**
 * Create a new ghost variety
 */
export async function createGhostVariety(data: Omit<InsertGhostVariety, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVariety> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(ghostVarieties).values(data);
  const [created] = await db.select().from(ghostVarieties).where(eq(ghostVarieties.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety
 */
export async function updateGhostVariety(id: number, data: Partial<InsertGhostVariety>): Promise<GhostVariety | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(ghostVarieties).set(data).where(eq(ghostVarieties.id, id));
  return getGhostVarietyById(id);
}

/**
 * Delete a ghost variety
 */
export async function deleteGhostVariety(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(ghostVarieties).where(eq(ghostVarieties.id, id));
  return true;
}

/**
 * Search ghost varieties
 */
export async function searchGhostVarieties(query: string): Promise<GhostVariety[]> {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return db.select().from(ghostVarieties)
    .where(or(
      like(ghostVarieties.name, searchTerm),
      like(ghostVarieties.scientificName, searchTerm),
      like(ghostVarieties.description, searchTerm),
      like(ghostVarieties.lastDocumentedLocation, searchTerm)
    ))
    .orderBy(desc(ghostVarieties.createdAt));
}

/**
 * Get ghost varieties statistics
 */
export async function getGhostVarietiesStats(): Promise<{
  total: number;
  byVarietyType: { type: string; count: number }[];
  byConservationStatus: { status: string; count: number }[];
}> {
  const db = await getDb();
  if (!db) return { total: 0, byVarietyType: [], byConservationStatus: [] };
  
  const [totalCount] = await db.select({ count: count() }).from(ghostVarieties);
  
  const byVarietyType = await db.select({
    type: ghostVarieties.varietyType,
    count: count(),
  }).from(ghostVarieties).groupBy(ghostVarieties.varietyType);
  
  const byConservationStatus = await db.select({
    status: ghostVarieties.conservationStatus,
    count: count(),
  }).from(ghostVarieties).groupBy(ghostVarieties.conservationStatus);
  
  return {
    total: totalCount.count,
    byVarietyType: byVarietyType.map(b => ({ type: b.type || 'other', count: b.count })),
    byConservationStatus: byConservationStatus.map(b => ({ status: b.status || 'unknown', count: b.count })),
  };
}

// ============================================================================
// GENOMIC MOLECULE LINKS (Liaisons génomiques molécules - G1-G3)
// ============================================================================

/**
 * Get all genomic molecule links
 */
export async function getAllGenomicMoleculeLinks(): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks).orderBy(desc(genomicMoleculeLinks.createdAt));
}

/**
 * Get genomic links for a molecule
 */
export async function getGenomicLinksForMolecule(moleculeId: number): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.moleculeId, moleculeId));
}

/**
 * Get genomic links by axis
 */
export async function getGenomicMoleculeLinksByAxis(axis: 'G1' | 'G2' | 'G3'): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.genomicAxis, axis))
    .orderBy(desc(genomicMoleculeLinks.relevanceScore));
}

/**
 * Get genomic links for a reference
 */
export async function getGenomicMoleculeLinksForReference(referenceId: number): Promise<GenomicMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicMoleculeLinks)
    .where(eq(genomicMoleculeLinks.referenceId, referenceId));
}

/**
 * Create a genomic molecule link
 */
export async function createGenomicMoleculeLink(data: Omit<InsertGenomicMoleculeLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GenomicMoleculeLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(genomicMoleculeLinks).values(data);
  const [created] = await db.select().from(genomicMoleculeLinks).where(eq(genomicMoleculeLinks.id, result.insertId));
  return created;
}

/**
 * Delete a genomic molecule link
 */
export async function deleteGenomicMoleculeLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(genomicMoleculeLinks).where(eq(genomicMoleculeLinks.id, id));
  return true;
}

// ============================================================================
// GENOMIC PLANT LINKS (Liaisons génomiques plantes - G1-G3)
// ============================================================================

/**
 * Get all genomic plant links
 */
export async function getAllGenomicPlantLinks(): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks).orderBy(desc(genomicPlantLinks.createdAt));
}

/**
 * Get genomic links for a plant
 */
export async function getGenomicLinksForPlant(plantId: number): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.plantId, plantId));
}

/**
 * Get genomic plant links by axis
 */
export async function getGenomicPlantLinksByAxis(axis: 'G1' | 'G2' | 'G3'): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.genomicAxis, axis))
    .orderBy(desc(genomicPlantLinks.relevanceScore));
}

/**
 * Get genomic links for a reference
 */
export async function getGenomicPlantLinksForReference(referenceId: number): Promise<GenomicPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(genomicPlantLinks)
    .where(eq(genomicPlantLinks.referenceId, referenceId));
}

/**
 * Create a genomic plant link
 */
export async function createGenomicPlantLink(data: Omit<InsertGenomicPlantLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GenomicPlantLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [result] = await db.insert(genomicPlantLinks).values(data);
  const [created] = await db.select().from(genomicPlantLinks).where(eq(genomicPlantLinks.id, result.insertId));
  return created;
}

/**
 * Delete a genomic plant link
 */
export async function deleteGenomicPlantLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(genomicPlantLinks).where(eq(genomicPlantLinks.id, id));
  return true;
}

/**
 * Get genomic links statistics
 */
export async function getGenomicLinksStats(): Promise<{
  totalMoleculeLinks: number;
  totalPlantLinks: number;
  byAxis: { axis: string; moleculeCount: number; plantCount: number }[];
  byLinkType: { type: string; moleculeCount: number; plantCount: number }[];
  byConfidence: { confidence: string; moleculeCount: number; plantCount: number }[];
}> {
  const db = await getDb();
  if (!db) return { totalMoleculeLinks: 0, totalPlantLinks: 0, byAxis: [], byLinkType: [], byConfidence: [] };
  
  const [molCount] = await db.select({ count: count() }).from(genomicMoleculeLinks);
  const [plantCount] = await db.select({ count: count() }).from(genomicPlantLinks);
  
  // By axis
  const molByAxis = await db.select({
    axis: genomicMoleculeLinks.genomicAxis,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.genomicAxis);
  
  const plantByAxis = await db.select({
    axis: genomicPlantLinks.genomicAxis,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.genomicAxis);
  
  const axisMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByAxis) {
    axisMap.set(m.axis, { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByAxis) {
    const existing = axisMap.get(p.axis) || { moleculeCount: 0, plantCount: 0 };
    axisMap.set(p.axis, { ...existing, plantCount: p.count });
  }
  
  // By type
  const molByType = await db.select({
    type: genomicMoleculeLinks.linkType,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.linkType);
  
  const plantByType = await db.select({
    type: genomicPlantLinks.linkType,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.linkType);
  
  const typeMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByType) {
    typeMap.set(m.type || 'other', { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByType) {
    const existing = typeMap.get(p.type || 'other') || { moleculeCount: 0, plantCount: 0 };
    typeMap.set(p.type || 'other', { ...existing, plantCount: p.count });
  }
  
  // By confidence
  const molByConf = await db.select({
    confidence: genomicMoleculeLinks.confidence,
    count: count(),
  }).from(genomicMoleculeLinks).groupBy(genomicMoleculeLinks.confidence);
  
  const plantByConf = await db.select({
    confidence: genomicPlantLinks.confidence,
    count: count(),
  }).from(genomicPlantLinks).groupBy(genomicPlantLinks.confidence);
  
  const confMap = new Map<string, { moleculeCount: number; plantCount: number }>();
  for (const m of molByConf) {
    confMap.set(m.confidence || 'medium', { moleculeCount: m.count, plantCount: 0 });
  }
  for (const p of plantByConf) {
    const existing = confMap.get(p.confidence || 'medium') || { moleculeCount: 0, plantCount: 0 };
    confMap.set(p.confidence || 'medium', { ...existing, plantCount: p.count });
  }
  
  return {
    totalMoleculeLinks: molCount.count,
    totalPlantLinks: plantCount.count,
    byAxis: Array.from(axisMap.entries()).map(([axis, counts]) => ({ axis, ...counts })),
    byLinkType: Array.from(typeMap.entries()).map(([type, counts]) => ({ type, ...counts })),
    byConfidence: Array.from(confMap.entries()).map(([confidence, counts]) => ({ confidence, ...counts })),
  };
}


// ============================================================================
// GHOST VARIETY GENOMIC LINKS (Liaisons variétés fantômes ↔ molécules/plantes)
// ============================================================================

/**
 * Get genomic molecule links for a ghost variety (via reference)
 */
export async function getGenomicLinksForGhostVariety(varietyId: number): Promise<{
  moleculeLinks: GenomicMoleculeLink[];
  plantLinks: GenomicPlantLink[];
}> {
  const db = await getDb();
  if (!db) return { moleculeLinks: [], plantLinks: [] };
  
  // Get all genomic links - we'll filter by variety context
  const moleculeLinks = await db.select().from(genomicMoleculeLinks)
    .orderBy(desc(genomicMoleculeLinks.relevanceScore));
  const plantLinks = await db.select().from(genomicPlantLinks)
    .orderBy(desc(genomicPlantLinks.relevanceScore));
  
  return { moleculeLinks, plantLinks };
}

/**
 * Get molecules available for linking to ghost varieties
 */
export async function getMoleculesForGhostVarietyLinking(): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
  chemicalClass: string | null;
  family: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    chemicalClass: molecules.chemicalClass,
    family: molecules.family,
  }).from(molecules).orderBy(molecules.name);
}

/**
 * Get plants available for linking to ghost varieties
 */
export async function getPlantsForGhostVarietyLinking(): Promise<{
  id: number;
  name: string;
  latinName: string | null;
  category: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    category: plants.category,
  }).from(plants).orderBy(plants.name);
}

/**
 * Get ghost variety with all related data (molecules, plants, sources)
 */
export async function getGhostVarietyWithRelations(id: number): Promise<{
  variety: GhostVariety | null;
  linkedMolecules: { id: number; name: string; linkType: string; confidence: string }[];
  linkedPlants: { id: number; name: string; linkType: string; confidence: string }[];
}> {
  const db = await getDb();
  if (!db) return { variety: null, linkedMolecules: [], linkedPlants: [] };
  
  const [variety] = await db.select().from(ghostVarieties).where(eq(ghostVarieties.id, id));
  if (!variety) return { variety: null, linkedMolecules: [], linkedPlants: [] };
  
  // Get linked molecules via genomic links
  const moleculeLinks = await db.select({
    moleculeId: genomicMoleculeLinks.moleculeId,
    linkType: genomicMoleculeLinks.linkType,
    confidence: genomicMoleculeLinks.confidence,
  }).from(genomicMoleculeLinks);
  
  const linkedMoleculeIds = moleculeLinks.map(l => l.moleculeId);
  let linkedMolecules: { id: number; name: string; linkType: string; confidence: string }[] = [];
  
  if (linkedMoleculeIds.length > 0) {
    const mols = await db.select({
      id: molecules.id,
      name: molecules.name,
    }).from(molecules).where(inArray(molecules.id, linkedMoleculeIds));
    
    linkedMolecules = mols.map(m => {
      const link = moleculeLinks.find(l => l.moleculeId === m.id);
      return {
        id: m.id,
        name: m.name,
        linkType: link?.linkType || 'other',
        confidence: link?.confidence || 'medium',
      };
    });
  }
  
  // Get linked plants via genomic links
  const plantLinks = await db.select({
    plantId: genomicPlantLinks.plantId,
    linkType: genomicPlantLinks.linkType,
    confidence: genomicPlantLinks.confidence,
  }).from(genomicPlantLinks);
  
  const linkedPlantIds = plantLinks.map(l => l.plantId);
  let linkedPlants: { id: number; name: string; linkType: string; confidence: string }[] = [];
  
  if (linkedPlantIds.length > 0) {
    const pls = await db.select({
      id: plants.id,
      name: plants.name,
    }).from(plants).where(inArray(plants.id, linkedPlantIds));
    
    linkedPlants = pls.map(p => {
      const link = plantLinks.find(l => l.plantId === p.id);
      return {
        id: p.id,
        name: p.name,
        linkType: link?.linkType || 'other',
        confidence: link?.confidence || 'medium',
      };
    });
  }
  
  return { variety, linkedMolecules, linkedPlants };
}

/**
 * Bulk create genomic molecule links for a ghost variety
 */
export async function bulkCreateGenomicMoleculeLinks(
  links: Array<{
    referenceId: number;
    moleculeId: number;
    genomicAxis: 'G1' | 'G2' | 'G3';
    linkType?: string;
    relevanceScore?: number;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
  }>,
  createdBy?: number
): Promise<{ success: number; failed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: links.length, errors: ['Database not available'] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(genomicMoleculeLinks).values({
        referenceId: link.referenceId,
        moleculeId: link.moleculeId,
        genomicAxis: link.genomicAxis,
        linkType: (link.linkType as any) || 'characterization',
        relevanceScore: link.relevanceScore || 50,
        confidence: link.confidence || 'medium',
        notes: link.notes,
        createdBy,
      });
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`Failed to link molecule ${link.moleculeId}: ${error.message}`);
    }
  }
  
  return { success, failed, errors };
}

/**
 * Bulk create genomic plant links for a ghost variety
 */
export async function bulkCreateGenomicPlantLinks(
  links: Array<{
    referenceId: number;
    plantId: number;
    genomicAxis: 'G1' | 'G2' | 'G3';
    linkType?: string;
    relevanceScore?: number;
    confidence?: 'high' | 'medium' | 'low';
    notes?: string;
  }>,
  createdBy?: number
): Promise<{ success: number; failed: number; errors: string[] }> {
  const db = await getDb();
  if (!db) return { success: 0, failed: links.length, errors: ['Database not available'] };
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(genomicPlantLinks).values({
        referenceId: link.referenceId,
        plantId: link.plantId,
        genomicAxis: link.genomicAxis,
        linkType: (link.linkType as any) || 'genome_sequencing',
        relevanceScore: link.relevanceScore || 50,
        confidence: link.confidence || 'medium',
        notes: link.notes,
        createdBy,
      });
      success++;
    } catch (error: any) {
      failed++;
      errors.push(`Failed to link plant ${link.plantId}: ${error.message}`);
    }
  }
  
  return { success, failed, errors };
}

/**
 * Search molecules by name for autocomplete in ghost variety form
 */
export async function searchMoleculesForGhostVariety(query: string, limit: number = 20): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
  family: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${query}%`;
  return db.select({
    id: molecules.id,
    name: molecules.name,
    casNumber: molecules.casNumber,
    family: molecules.family,
  }).from(molecules)
    .where(or(
      like(molecules.name, searchTerm),
      like(molecules.casNumber, searchTerm),
      like(molecules.iupacName, searchTerm)
    ))
    .orderBy(molecules.name)
    .limit(limit);
}

/**
 * Search plants by name for autocomplete in ghost variety form
 */
export async function searchPlantsForGhostVariety(query: string, limit: number = 20): Promise<{
  id: number;
  name: string;
  latinName: string | null;
  category: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${query}%`;
  return db.select({
    id: plants.id,
    name: plants.name,
    latinName: plants.latinName,
    category: plants.category,
  }).from(plants)
    .where(or(
      like(plants.name, searchTerm),
      like(plants.latinName, searchTerm)
    ))
    .orderBy(plants.name)
    .limit(limit);
}


// ============================================================================
// GHOST VARIETY MOLECULE LINKS (Liaisons variétés fantômes ↔ molécules)
// ============================================================================

import { ghostVarietyMoleculeLinks, GhostVarietyMoleculeLink, InsertGhostVarietyMoleculeLink, ghostVarietyPlantLinks, GhostVarietyPlantLink, InsertGhostVarietyPlantLink, ghostVarietyImages, GhostVarietyImage, InsertGhostVarietyImage } from "../drizzle/schema";

/**
 * Get all molecule links for a ghost variety
 */
export async function getGhostVarietyMoleculeLinks(ghostVarietyId: number): Promise<(GhostVarietyMoleculeLink & { molecule: { id: number; name: string; casNumber: string | null; family: string | null } | null })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(ghostVarietyMoleculeLinks)
    .where(eq(ghostVarietyMoleculeLinks.ghostVarietyId, ghostVarietyId))
    .orderBy(desc(ghostVarietyMoleculeLinks.percentage));
  
  // Get molecule details for each link
  const result = await Promise.all(links.map(async (link) => {
    const [molecule] = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
      family: molecules.family,
    }).from(molecules).where(eq(molecules.id, link.moleculeId));
    return { ...link, molecule: molecule || null };
  }));
  
  return result;
}

/**
 * Create a ghost variety molecule link
 */
export async function createGhostVarietyMoleculeLink(data: Omit<InsertGhostVarietyMoleculeLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyMoleculeLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyMoleculeLinks).values(data);
  const [created] = await db.select().from(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety molecule link
 */
export async function updateGhostVarietyMoleculeLink(id: number, data: Partial<InsertGhostVarietyMoleculeLink>): Promise<GhostVarietyMoleculeLink | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyMoleculeLinks).set(data).where(eq(ghostVarietyMoleculeLinks.id, id));
  const [updated] = await db.select().from(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety molecule link
 */
export async function deleteGhostVarietyMoleculeLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyMoleculeLinks).where(eq(ghostVarietyMoleculeLinks.id, id));
  return true;
}

/**
 * Get all molecule links (for stats)
 */
export async function getAllGhostVarietyMoleculeLinks(): Promise<GhostVarietyMoleculeLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarietyMoleculeLinks).orderBy(desc(ghostVarietyMoleculeLinks.createdAt));
}

// ============================================================================
// GHOST VARIETY PLANT LINKS (Liaisons variétés fantômes ↔ plantes)
// ============================================================================

/**
 * Get all plant links for a ghost variety
 */
export async function getGhostVarietyPlantLinks(ghostVarietyId: number): Promise<(GhostVarietyPlantLink & { plant: { id: number; name: string; latinName: string | null; category: string | null } | null })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db.select().from(ghostVarietyPlantLinks)
    .where(eq(ghostVarietyPlantLinks.ghostVarietyId, ghostVarietyId))
    .orderBy(ghostVarietyPlantLinks.relationshipType);
  
  // Get plant details for each link
  const result = await Promise.all(links.map(async (link) => {
    const [plant] = await db.select({
      id: plants.id,
      name: plants.name,
      latinName: plants.latinName,
      category: plants.category,
    }).from(plants).where(eq(plants.id, link.plantId));
    return { ...link, plant: plant || null };
  }));
  
  return result;
}

/**
 * Create a ghost variety plant link
 */
export async function createGhostVarietyPlantLink(data: Omit<InsertGhostVarietyPlantLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyPlantLink> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyPlantLinks).values(data);
  const [created] = await db.select().from(ghostVarietyPlantLinks).where(eq(ghostVarietyPlantLinks.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety plant link
 */
export async function updateGhostVarietyPlantLink(id: number, data: Partial<InsertGhostVarietyPlantLink>): Promise<GhostVarietyPlantLink | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyPlantLinks).set(data).where(eq(ghostVarietyPlantLinks.id, id));
  const [updated] = await db.select().from(ghostVarietyPlantLinks).where(eq(ghostVarietyPlantLinks.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety plant link
 */
export async function deleteGhostVarietyPlantLink(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyPlantLinks).where(eq(ghostVarietyPlantLinks.id, id));
  return true;
}

/**
 * Get all plant links (for stats)
 */
export async function getAllGhostVarietyPlantLinks(): Promise<GhostVarietyPlantLink[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ghostVarietyPlantLinks).orderBy(desc(ghostVarietyPlantLinks.createdAt));
}

// ============================================================================
// GHOST VARIETY IMAGES (Images des variétés fantômes)
// ============================================================================

/**
 * Get all images for a ghost variety
 */
export async function getGhostVarietyImages(ghostVarietyId: number): Promise<GhostVarietyImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(ghostVarietyImages)
    .where(eq(ghostVarietyImages.ghostVarietyId, ghostVarietyId))
    .orderBy(ghostVarietyImages.sortOrder);
}

/**
 * Create a ghost variety image
 */
export async function createGhostVarietyImage(data: Omit<InsertGhostVarietyImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<GhostVarietyImage> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(ghostVarietyImages).values(data);
  const [created] = await db.select().from(ghostVarietyImages).where(eq(ghostVarietyImages.id, result.insertId));
  return created;
}

/**
 * Update a ghost variety image
 */
export async function updateGhostVarietyImage(id: number, data: Partial<InsertGhostVarietyImage>): Promise<GhostVarietyImage | null> {
  const db = await getDb();
  if (!db) return null;
  
  await db.update(ghostVarietyImages).set(data).where(eq(ghostVarietyImages.id, id));
  const [updated] = await db.select().from(ghostVarietyImages).where(eq(ghostVarietyImages.id, id));
  return updated || null;
}

/**
 * Delete a ghost variety image
 */
export async function deleteGhostVarietyImage(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(ghostVarietyImages).where(eq(ghostVarietyImages.id, id));
  return true;
}

/**
 * Set primary image for a ghost variety
 */
export async function setGhostVarietyPrimaryImage(ghostVarietyId: number, imageId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  // Reset all images for this variety
  await db.update(ghostVarietyImages)
    .set({ isPrimary: false })
    .where(eq(ghostVarietyImages.ghostVarietyId, ghostVarietyId));
  
  // Set the new primary
  await db.update(ghostVarietyImages)
    .set({ isPrimary: true })
    .where(eq(ghostVarietyImages.id, imageId));
  
  return true;
}

/**
 * Get ghost variety with all relations (molecules, plants, images)
 */
export async function getGhostVarietyComplete(id: number): Promise<{
  variety: GhostVariety | null;
  moleculeLinks: (GhostVarietyMoleculeLink & { molecule: { id: number; name: string; casNumber: string | null; family: string | null } | null })[];
  plantLinks: (GhostVarietyPlantLink & { plant: { id: number; name: string; latinName: string | null; category: string | null } | null })[];
  images: GhostVarietyImage[];
}> {
  const variety = await getGhostVarietyById(id);
  if (!variety) {
    return { variety: null, moleculeLinks: [], plantLinks: [], images: [] };
  }
  
  const [moleculeLinks, plantLinks, images] = await Promise.all([
    getGhostVarietyMoleculeLinks(id),
    getGhostVarietyPlantLinks(id),
    getGhostVarietyImages(id),
  ]);
  
  return { variety, moleculeLinks, plantLinks, images };
}

/**
 * Get linking statistics for ghost varieties
 */
export async function getGhostVarietyLinkingStats(): Promise<{
  totalVarieties: number;
  varietiesWithMolecules: number;
  varietiesWithPlants: number;
  varietiesWithImages: number;
  totalMoleculeLinks: number;
  totalPlantLinks: number;
  totalImages: number;
}> {
  const db = await getDb();
  if (!db) return {
    totalVarieties: 0,
    varietiesWithMolecules: 0,
    varietiesWithPlants: 0,
    varietiesWithImages: 0,
    totalMoleculeLinks: 0,
    totalPlantLinks: 0,
    totalImages: 0,
  };
  
  const [totalVarietiesResult] = await db.select({ count: count() }).from(ghostVarieties);
  const [totalMolLinksResult] = await db.select({ count: count() }).from(ghostVarietyMoleculeLinks);
  const [totalPlantLinksResult] = await db.select({ count: count() }).from(ghostVarietyPlantLinks);
  const [totalImagesResult] = await db.select({ count: count() }).from(ghostVarietyImages);
  
  // Count distinct varieties with links
  const varietiesWithMolsResult = await db.selectDistinct({ ghostVarietyId: ghostVarietyMoleculeLinks.ghostVarietyId }).from(ghostVarietyMoleculeLinks);
  const varietiesWithPlantsResult = await db.selectDistinct({ ghostVarietyId: ghostVarietyPlantLinks.ghostVarietyId }).from(ghostVarietyPlantLinks);
  const varietiesWithImagesResult = await db.selectDistinct({ ghostVarietyId: ghostVarietyImages.ghostVarietyId }).from(ghostVarietyImages);
  
  return {
    totalVarieties: totalVarietiesResult.count,
    varietiesWithMolecules: varietiesWithMolsResult.length,
    varietiesWithPlants: varietiesWithPlantsResult.length,
    varietiesWithImages: varietiesWithImagesResult.length,
    totalMoleculeLinks: totalMolLinksResult.count,
    totalPlantLinks: totalPlantLinksResult.count,
    totalImages: totalImagesResult.count,
  };
}


// ============================================================================
// SUB-AXES (Sous-axes de recherche)
// ============================================================================

export async function getSubAxes(parentAxisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(researchAxes)
    .where(eq(researchAxes.parentAxisId, parentAxisId))
    .orderBy(researchAxes.axisCode);
}

export async function getAxisWithSubAxes(axisId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.id, axisId));
  if (!axis) return null;
  
  const subAxes = await getSubAxes(axisId);
  
  return {
    ...axis,
    subAxes,
  };
}

export async function getAxisHierarchy() {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer tous les axes principaux (sans parent)
  const mainAxes = await db
    .select()
    .from(researchAxes)
    .where(isNull(researchAxes.parentAxisId))
    .orderBy(researchAxes.axisCode);
  
  // Pour chaque axe principal, récupérer ses sous-axes
  const hierarchy = await Promise.all(
    mainAxes.map(async (axis) => {
      const subAxes = await getSubAxes(axis.id);
      return {
        ...axis,
        subAxes,
      };
    })
  );
  
  return hierarchy;
}


// ============================================================================
// AXIS REFERENCE LINKS (Liaisons axes-références pour le graphe)
// ============================================================================

/**
 * Récupère toutes les liaisons axes-références
 */
export async function getAllAxisReferenceLinks(filters?: {
  axisId?: number;
  referenceId?: number;
  linkType?: string;
  confidence?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions: any[] = [];
  
  if (filters?.axisId) {
    conditions.push(eq(axisReferenceLinks.axisId, filters.axisId));
  }
  if (filters?.referenceId) {
    conditions.push(eq(axisReferenceLinks.referenceId, filters.referenceId));
  }
  if (filters?.linkType) {
    conditions.push(eq(axisReferenceLinks.linkType, filters.linkType as any));
  }
  if (filters?.confidence) {
    conditions.push(eq(axisReferenceLinks.confidence, filters.confidence as any));
  }
  
  let query = db.select().from(axisReferenceLinks);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return query.orderBy(desc(axisReferenceLinks.relevanceScore));
}

/**
 * Récupère une liaison par ID
 */
export async function getAxisReferenceLinkById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [link] = await db.select().from(axisReferenceLinks).where(eq(axisReferenceLinks.id, id));
  return link || null;
}

/**
 * Récupère les liaisons pour un axe avec les détails des références
 */
export async function getAxisReferenceLinksWithDetails(axisId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(axisReferenceLinks)
    .where(eq(axisReferenceLinks.axisId, axisId))
    .orderBy(desc(axisReferenceLinks.relevanceScore));
  
  // Enrichir avec les détails des références
  const enrichedLinks = await Promise.all(
    links.map(async (link) => {
      const [reference] = await db
        .select()
        .from(v3References)
        .where(eq(v3References.id, link.referenceId));
      return { ...link, reference };
    })
  );
  
  return enrichedLinks;
}

/**
 * Récupère les liaisons pour une référence avec les détails des axes
 */
export async function getReferenceAxisLinksWithDetails(referenceId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const links = await db
    .select()
    .from(axisReferenceLinks)
    .where(eq(axisReferenceLinks.referenceId, referenceId))
    .orderBy(desc(axisReferenceLinks.relevanceScore));
  
  // Enrichir avec les détails des axes
  const enrichedLinks = await Promise.all(
    links.map(async (link) => {
      const [axis] = await db
        .select()
        .from(researchAxes)
        .where(eq(researchAxes.id, link.axisId));
      return { ...link, axis };
    })
  );
  
  return enrichedLinks;
}

/**
 * Crée une nouvelle liaison axe-référence
 */
export async function createAxisReferenceLink(data: {
  axisId: number;
  referenceId: number;
  linkType?: string;
  relevanceScore?: number;
  confidence?: string;
  notes?: string;
  excerpt?: string;
  pageNumbers?: string;
  displayWeight?: number;
  isHighlighted?: boolean;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  const [result] = await db.insert(axisReferenceLinks).values(data as any);
  return { id: result.insertId, ...data };
}

/**
 * Met à jour une liaison axe-référence
 */
export async function updateAxisReferenceLink(id: number, data: {
  linkType?: string;
  relevanceScore?: number;
  confidence?: string;
  notes?: string;
  excerpt?: string;
  pageNumbers?: string;
  displayWeight?: number;
  isHighlighted?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.update(axisReferenceLinks).set(data as any).where(eq(axisReferenceLinks.id, id));
  return getAxisReferenceLinkById(id);
}

/**
 * Supprime une liaison axe-référence
 */
export async function deleteAxisReferenceLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  await db.delete(axisReferenceLinks).where(eq(axisReferenceLinks.id, id));
  return { success: true };
}

/**
 * Récupère les données du graphe axes-références pour D3.js
 */
export async function getAxisReferenceGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  
  // Récupérer tous les axes
  const axes = await db.select().from(researchAxes);
  
  // Récupérer toutes les références liées
  const allLinks = await db.select().from(axisReferenceLinks);
  const linkedRefIds = Array.from(new Set(allLinks.map(l => l.referenceId)));
  
  // Récupérer les références liées
  let references: any[] = [];
  if (linkedRefIds.length > 0) {
    references = await db
      .select()
      .from(v3References)
      .where(inArray(v3References.id, linkedRefIds));
  }
  
  // Construire les nœuds
  const nodes: Array<{
    id: string;
    type: 'axis' | 'reference';
    label: string;
    code?: string;
    year?: number;
    color?: string;
    size?: number;
  }> = [];
  
  // Ajouter les axes comme nœuds
  axes.forEach(axis => {
    nodes.push({
      id: `axis-${axis.id}`,
      type: 'axis',
      label: axis.name,
      code: axis.axisCode,
      color: '#8b5cf6', // Violet pour les axes
      size: 30,
    });
  });
  
  // Ajouter les références comme nœuds
  references.forEach(ref => {
    nodes.push({
      id: `ref-${ref.id}`,
      type: 'reference',
      label: ref.title.substring(0, 50) + (ref.title.length > 50 ? '...' : ''),
      year: ref.year,
      color: '#3b82f6', // Bleu pour les références
      size: 15,
    });
  });
  
  // Construire les liens
  const links = allLinks.map(link => ({
    source: `axis-${link.axisId}`,
    target: `ref-${link.referenceId}`,
    type: link.linkType,
    weight: link.displayWeight || 1,
    highlighted: link.isHighlighted,
    relevance: link.relevanceScore,
  }));
  
  return { nodes, links };
}

/**
 * Statistiques des liaisons axes-références
 */
export async function getAxisReferenceLinkStats() {
  const db = await getDb();
  if (!db) return null;
  
  // Total des liaisons
  const [totalResult] = await db.select({ count: count() }).from(axisReferenceLinks);
  const total = totalResult?.count || 0;
  
  // Par type de liaison
  const byType = await db
    .select({
      linkType: axisReferenceLinks.linkType,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.linkType);
  
  // Par niveau de confiance
  const byConfidence = await db
    .select({
      confidence: axisReferenceLinks.confidence,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.confidence);
  
  // Axes avec le plus de références
  const topAxes = await db
    .select({
      axisId: axisReferenceLinks.axisId,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.axisId)
    .orderBy(desc(count()))
    .limit(10);
  
  // Enrichir avec les noms des axes
  const topAxesWithNames = await Promise.all(
    topAxes.map(async (item) => {
      const [axis] = await db.select().from(researchAxes).where(eq(researchAxes.id, item.axisId));
      return {
        axisId: item.axisId,
        axisCode: axis?.axisCode,
        axisName: axis?.name,
        count: item.count,
      };
    })
  );
  
  // Références les plus liées
  const topReferences = await db
    .select({
      referenceId: axisReferenceLinks.referenceId,
      count: count(),
    })
    .from(axisReferenceLinks)
    .groupBy(axisReferenceLinks.referenceId)
    .orderBy(desc(count()))
    .limit(10);
  
  return {
    total,
    byType,
    byConfidence,
    topAxes: topAxesWithNames,
    topReferences,
  };
}

/**
 * Créer plusieurs liaisons en masse
 */
export async function bulkCreateAxisReferenceLinks(links: Array<{
  axisId: number;
  referenceId: number;
  linkType?: string;
  relevanceScore?: number;
  confidence?: string;
  notes?: string;
  createdBy?: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  
  let created = 0;
  const errors: string[] = [];
  
  for (const link of links) {
    try {
      await db.insert(axisReferenceLinks).values(link as any);
      created++;
    } catch (error: any) {
      if (!error.message.includes('Duplicate')) {
        errors.push(`Erreur pour axe ${link.axisId} - ref ${link.referenceId}: ${error.message}`);
      }
    }
  }
  
  return { created, errors, total: links.length };
}


// ============================================================================
// FORCE GRAPH DATA FOR REFERENCES-AXES VISUALIZATION
// ============================================================================

/**
 * Get comprehensive force graph data for D3.js visualization
 * Includes both axes and references as nodes with their connections
 */
export async function getForceGraphDataReferencesAxes(options?: {
  includeReferences?: boolean;
  metaAxisFilter?: string;
  minRelevanceScore?: number;
}) {
  const db = await getDb();
  if (!db) return { nodes: [], links: [], stats: {} };
  
  const includeReferences = options?.includeReferences ?? true;
  const metaAxisFilter = options?.metaAxisFilter;
  const minRelevanceScore = options?.minRelevanceScore ?? 0;
  
  // Get all thematic axes
  const axes = metaAxisFilter && metaAxisFilter !== 'all'
    ? await db.select().from(thematicAxes).where(eq(thematicAxes.metaAxis, metaAxisFilter as any)).orderBy(thematicAxes.displayOrder)
    : await db.select().from(thematicAxes).orderBy(thematicAxes.displayOrder);
  
  // Get all v3 references with their primary axis
  let references: typeof v3References.$inferSelect[] = [];
  if (metaAxisFilter && metaAxisFilter !== 'all') {
    // Filter references by meta-axis through their primary axis
    const axisIds = axes.map(a => a.id);
    if (axisIds.length > 0) {
      references = await db.select().from(v3References).where(inArray(v3References.axisPrimaryId, axisIds)).orderBy(desc(v3References.year));
    }
  } else {
    references = await db.select().from(v3References).orderBy(desc(v3References.year));
  }
  
  // Build axis nodes
  const axisNodes = axes.map(axis => ({
    id: `axis-${axis.id}`,
    numericId: axis.id,
    type: 'axis' as const,
    code: axis.axisCode,
    name: axis.name,
    metaAxis: axis.metaAxis,
    color: axis.color || getMetaAxisColor(axis.metaAxis),
    description: axis.description,
    outputTypes: axis.outputTypes,
    size: 30, // Base size for axes
  }));
  
  // Build reference nodes (if enabled)
  const referenceNodes = includeReferences ? references.map(ref => ({
    id: `ref-${ref.id}`,
    numericId: ref.id,
    type: 'reference' as const,
    code: ref.entryKey,
    name: ref.title || ref.entryKey,
    author: ref.authors,
    year: ref.year,
    axisPrimaryCode: ref.axisPrimaryCode,
    axisPrimaryId: ref.axisPrimaryId,
    axesSecondary: ref.axesSecondary,
    relevanceScore: ref.relevanceScore || 50,
    readStatus: ref.readStatus,
    color: getReadStatusColor(ref.readStatus),
    size: Math.max(8, Math.min(20, (ref.relevanceScore || 50) / 5)), // Size based on relevance
  })) : [];
  
  // Build links between references and axes
  const links: Array<{
    source: string;
    target: string;
    strength: number;
    type: 'primary' | 'secondary';
  }> = [];
  
  if (includeReferences) {
    for (const ref of references) {
      // Primary axis link
      if (ref.axisPrimaryId) {
        const axisNode = axisNodes.find(a => a.numericId === ref.axisPrimaryId);
        if (axisNode) {
          links.push({
            source: `ref-${ref.id}`,
            target: axisNode.id,
            strength: 1,
            type: 'primary',
          });
        }
      }
      
      // Secondary axes links
      if (ref.axesSecondary && Array.isArray(ref.axesSecondary)) {
        for (const secondaryCode of ref.axesSecondary) {
          const axisNode = axisNodes.find(a => a.code === secondaryCode);
          if (axisNode) {
            links.push({
              source: `ref-${ref.id}`,
              target: axisNode.id,
              strength: 0.5,
              type: 'secondary',
            });
          }
        }
      }
    }
  }
  
  // Get axis connections for inter-axis links
  const axisConnections_ = await db.select().from(axisConnections);
  for (const conn of axisConnections_) {
    const sourceNode = axisNodes.find(a => a.numericId === conn.sourceAxisId);
    const targetNode = axisNodes.find(a => a.numericId === conn.targetAxisId);
    if (sourceNode && targetNode) {
      links.push({
        source: sourceNode.id,
        target: targetNode.id,
        strength: (conn.strength || 5) / 10,
        type: 'primary',
      });
    }
  }
  
  // Calculate statistics
  const stats = {
    totalAxes: axisNodes.length,
    totalReferences: referenceNodes.length,
    totalLinks: links.length,
    referencesByMetaAxis: {
      meta_a: references.filter(r => {
        const axis = axes.find(a => a.id === r.axisPrimaryId);
        return axis?.metaAxis === 'meta_a';
      }).length,
      meta_b: references.filter(r => {
        const axis = axes.find(a => a.id === r.axisPrimaryId);
        return axis?.metaAxis === 'meta_b';
      }).length,
      meta_c: references.filter(r => {
        const axis = axes.find(a => a.id === r.axisPrimaryId);
        return axis?.metaAxis === 'meta_c';
      }).length,
    },
    axesByMetaAxis: {
      meta_a: axes.filter(a => a.metaAxis === 'meta_a').length,
      meta_b: axes.filter(a => a.metaAxis === 'meta_b').length,
      meta_c: axes.filter(a => a.metaAxis === 'meta_c').length,
    },
  };
  
  return {
    nodes: [...axisNodes, ...referenceNodes],
    links,
    stats,
  };
}

// Helper function to get color based on meta-axis
function getMetaAxisColor(metaAxis: string | null): string {
  switch (metaAxis) {
    case 'meta_a': return '#f59e0b'; // Amber - Heritage & Archives
    case 'meta_b': return '#8b5cf6'; // Purple - Arts & Chemistry
    case 'meta_c': return '#06b6d4'; // Cyan - Digital & Datasets
    default: return '#6b7280'; // Gray
  }
}

// Helper function to get color based on read status
function getReadStatusColor(status: string | null): string {
  switch (status) {
    case 'read': return '#22c55e'; // Green
    case 'reading': return '#f59e0b'; // Amber
    case 'to_review': return '#ef4444'; // Red
    default: return '#94a3b8'; // Slate
  }
}

/**
 * Get synergies data for the AI formula generator
 * Returns all documented molecular synergies with their details
 */
export async function getMolecularSynergiesForGenerator() {
  const db = await getDb();
  if (!db) return { synergies: [], rules: [], interactions: [] };
  
  // Get terpene synergies
  const terpeneSynergiesData = await db
    .select({
      id: terpeneSynergies.id,
      terpene1Id: terpeneSynergies.terpene1Id,
      terpene2Id: terpeneSynergies.terpene2Id,
      compatibilityScore: terpeneSynergies.compatibilityScore,
      synergyNotes: terpeneSynergies.synergyNotes,
    })
    .from(terpeneSynergies);
  
  // Get molecule synergies
  const moleculeSynergiesData = await db
    .select({
      id: moleculeSynergies.id,
      molecule1Id: moleculeSynergies.molecule1Id,
      molecule2Id: moleculeSynergies.molecule2Id,
      type: moleculeSynergies.type,
      description: moleculeSynergies.description,
      applications: moleculeSynergies.applications,
    })
    .from(moleculeSynergies);
  
  // Get entourage rules
  const entourageRulesData = await db
    .select()
    .from(entourageRules);
  
  // Get molecular interactions
  const molecularInteractionsData = await db
    .select()
    .from(molecularInteractions);
  
  // Get formulation suggestions
  const formulationSuggestionsData = await db
    .select()
    .from(formulationSuggestions);
  
  // Enrich synergies with molecule names
  const moleculeIds = new Set<number>();
  terpeneSynergiesData.forEach(s => {
    moleculeIds.add(s.terpene1Id);
    moleculeIds.add(s.terpene2Id);
  });
  moleculeSynergiesData.forEach(s => {
    moleculeIds.add(s.molecule1Id);
    moleculeIds.add(s.molecule2Id);
  });
  
  const moleculeNames = new Map<number, string>();
  if (moleculeIds.size > 0) {
    const mols = await db
      .select({ id: molecules.id, name: molecules.name })
      .from(molecules)
      .where(inArray(molecules.id, Array.from(moleculeIds)));
    mols.forEach(m => moleculeNames.set(m.id, m.name));
  }
  
  // Build enriched synergies
  const enrichedTerpeneSynergies = terpeneSynergiesData.map(s => ({
    ...s,
    terpene1Name: moleculeNames.get(s.terpene1Id) || `Molecule #${s.terpene1Id}`,
    terpene2Name: moleculeNames.get(s.terpene2Id) || `Molecule #${s.terpene2Id}`,
  }));
  
  const enrichedMoleculeSynergies = moleculeSynergiesData.map(s => ({
    ...s,
    molecule1Name: moleculeNames.get(s.molecule1Id) || `Molecule #${s.molecule1Id}`,
    molecule2Name: moleculeNames.get(s.molecule2Id) || `Molecule #${s.molecule2Id}`,
  }));
  
  return {
    terpeneSynergies: enrichedTerpeneSynergies,
    moleculeSynergies: enrichedMoleculeSynergies,
    entourageRules: entourageRulesData,
    molecularInteractions: molecularInteractionsData,
    formulationSuggestions: formulationSuggestionsData,
  };
}

/**
 * Get synergy suggestions for a specific molecule
 * Returns molecules that have documented synergies with the given molecule
 */
export async function getSynergySuggestionsForMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return { moleculeId, suggestions: [] };
  
  // Get terpene synergies where this molecule is involved
  const terpeneSyns = await db
    .select()
    .from(terpeneSynergies)
    .where(
      or(
        eq(terpeneSynergies.terpene1Id, moleculeId),
        eq(terpeneSynergies.terpene2Id, moleculeId)
      )
    );
  
  // Get molecule synergies where this molecule is involved
  const molSyns = await db
    .select()
    .from(moleculeSynergies)
    .where(
      or(
        eq(moleculeSynergies.molecule1Id, moleculeId),
        eq(moleculeSynergies.molecule2Id, moleculeId)
      )
    );
  
  // Collect partner molecule IDs
  const partnerIds = new Set<number>();
  terpeneSyns.forEach(s => {
    if (s.terpene1Id === moleculeId) partnerIds.add(s.terpene2Id);
    else partnerIds.add(s.terpene1Id);
  });
  molSyns.forEach(s => {
    if (s.molecule1Id === moleculeId) partnerIds.add(s.molecule2Id);
    else partnerIds.add(s.molecule1Id);
  });
  
  if (partnerIds.size === 0) return { moleculeId, suggestions: [] };
  
  // Get partner molecule details
  const partners = await db
    .select()
    .from(molecules)
    .where(inArray(molecules.id, Array.from(partnerIds)));
  
  // Build suggestions with synergy details
  const suggestions = partners.map(partner => {
    const terpeneSyn = terpeneSyns.find(
      s => (s.terpene1Id === moleculeId && s.terpene2Id === partner.id) ||
           (s.terpene2Id === moleculeId && s.terpene1Id === partner.id)
    );
    const molSyn = molSyns.find(
      s => (s.molecule1Id === moleculeId && s.molecule2Id === partner.id) ||
           (s.molecule2Id === moleculeId && s.molecule1Id === partner.id)
    );
    
    return {
      molecule: partner,
      synergyType: molSyn?.type || 'potentialisation',
      compatibilityScore: terpeneSyn?.compatibilityScore || 70,
      description: molSyn?.description || terpeneSyn?.synergyNotes || 'Synergie documentée',
      applications: molSyn?.applications,
    };
  });
  
  // Sort by compatibility score
  const sortedSuggestions = suggestions.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
  
  return { moleculeId, suggestions: sortedSuggestions };
}


// ============================================================================
// SYNERGIES GRAPH VISUALIZATION
// ============================================================================

/**
 * Get default chemical mechanism explanation based on synergy type
 */
function getDefaultChemicalMechanism(type: string): string {
  const mechanisms: Record<string, string> = {
    potentialisation: "Synergie de potentialisation : les molécules interagissent via des liaisons hydrogène et des forces de van der Waals pour amplifier mutuellement leur perception olfactive. L'une des molécules peut agir comme modulateur allostérique des récepteurs olfactifs, augmentant l'affinité de liaison de l'autre.",
    stabilisation: "Synergie de stabilisation : formation de complexes moléculaires stables par interactions π-π (empilement aromatique) et liaisons hydrogène. Ces interactions réduisent la volatilité et prolongent la tenue du parfum en créant des associations supramoléculaires.",
    transformation: "Synergie de transformation : réactions chimiques lentes (condensation, oxydation ménagée) entre les groupes fonctionnels des deux molécules, générant de nouveaux composés aux propriétés olfactives distinctes. Les doubles liaisons et groupes carbonyle sont les sites réactifs principaux.",
    masquage: "Synergie de masquage : compétition au niveau des récepteurs olfactifs. La molécule dominante sature les récepteurs spécifiques, réduisant la perception de l'autre composé. Ce phénomène est lié aux différences de seuil de détection et d'affinité réceptorielle.",
  };
  return mechanisms[type] || "Interaction moléculaire documentée impliquant des forces intermoléculaires (van der Waals, liaisons hydrogène, interactions π-π) qui modulent la volatilité et la perception olfactive des composés.";
}

/**
 * Get comprehensive synergy graph data for D3.js visualization
 * Returns nodes (molecules) and links (synergies) with enriched metadata
 * Enhanced version with molecule details and statistics
 */
export async function getMolecularSynergiesGraphVisualization() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [], stats: { totalNodes: 0, totalLinks: 0, byType: {} } };
  
  // Get all terpene synergies
  const terpeneSyns = await db
    .select({
      id: terpeneSynergies.id,
      terpene1Id: terpeneSynergies.terpene1Id,
      terpene2Id: terpeneSynergies.terpene2Id,
      compatibilityScore: terpeneSynergies.compatibilityScore,
      synergyNotes: terpeneSynergies.synergyNotes,
    })
    .from(terpeneSynergies);
  
  // Get all molecule synergies
  const molSyns = await db
    .select({
      id: moleculeSynergies.id,
      molecule1Id: moleculeSynergies.molecule1Id,
      molecule2Id: moleculeSynergies.molecule2Id,
      type: moleculeSynergies.type,
      description: moleculeSynergies.description,
      chemicalMechanism: moleculeSynergies.chemicalMechanism,
      applications: moleculeSynergies.applications,
    })
    .from(moleculeSynergies);
  
  // Collect all molecule IDs
  const moleculeIds = new Set<number>();
  terpeneSyns.forEach(s => {
    moleculeIds.add(s.terpene1Id);
    moleculeIds.add(s.terpene2Id);
  });
  molSyns.forEach(s => {
    moleculeIds.add(s.molecule1Id);
    moleculeIds.add(s.molecule2Id);
  });
  
  if (moleculeIds.size === 0) {
    return { nodes: [], links: [], stats: { totalNodes: 0, totalLinks: 0, byType: {} } };
  }
  
  // Get molecule details
  const mols = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalClass: molecules.chemicalClass,
      olfactiveProfile: molecules.olfactiveProfile,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(molecules)
    .where(inArray(molecules.id, Array.from(moleculeIds)));
  
  // Build nodes
  const nodes = mols.map(m => ({
    id: m.id,
    name: m.name,
    family: m.family,
    chemicalClass: m.chemicalClass,
    olfactiveProfile: m.olfactiveProfile,
    radar: {
      intensity: m.radarIntensity || 50,
      freshness: m.radarFreshness || 50,
      warmth: m.radarWarmth || 50,
      sweetness: m.radarSweetness || 50,
      spiciness: m.radarSpiciness || 50,
      earthiness: m.radarEarthiness || 50,
    },
    // Count connections
    connectionCount: 0,
  }));
  
  // Create node map for quick lookup
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  // Build links from terpene synergies
  const links: Array<{
    id: string;
    source: number;
    target: number;
    type: string;
    compatibilityScore: number;
    description: string | null;
    chemicalMechanism: string | null;
    applications: string | null;
  }> = [];
  
  terpeneSyns.forEach(s => {
    const sourceNode = nodeMap.get(s.terpene1Id);
    const targetNode = nodeMap.get(s.terpene2Id);
    if (sourceNode && targetNode) {
      sourceNode.connectionCount++;
      targetNode.connectionCount++;
      const synergyType = s.compatibilityScore >= 70 ? 'potentialisation' : s.compatibilityScore >= 40 ? 'stabilisation' : 'masquage';
      links.push({
        id: `terpene-${s.id}`,
        source: s.terpene1Id,
        target: s.terpene2Id,
        type: synergyType,
        compatibilityScore: s.compatibilityScore,
        description: s.synergyNotes,
        chemicalMechanism: getDefaultChemicalMechanism(synergyType),
        applications: null,
      });
    }
  });
  
  // Build links from molecule synergies
  molSyns.forEach(s => {
    const sourceNode = nodeMap.get(s.molecule1Id);
    const targetNode = nodeMap.get(s.molecule2Id);
    if (sourceNode && targetNode) {
      sourceNode.connectionCount++;
      targetNode.connectionCount++;
      links.push({
        id: `molecule-${s.id}`,
        source: s.molecule1Id,
        target: s.molecule2Id,
        type: s.type,
        compatibilityScore: 80, // Default for molecule synergies
        description: s.description,
        chemicalMechanism: s.chemicalMechanism || getDefaultChemicalMechanism(s.type),
        applications: s.applications,
      });
    }
  });
  
  // Calculate stats
  const byType: Record<string, number> = {};
  links.forEach(l => {
    byType[l.type] = (byType[l.type] || 0) + 1;
  });
  
  return {
    nodes,
    links,
    stats: {
      totalNodes: nodes.length,
      totalLinks: links.length,
      byType,
    },
  };
}

/**
 * Get synergy suggestions for multiple molecules at once
 * Used by the formulation tool to show relevant synergies
 */
export async function getSynergySuggestionsForMolecules(moleculeIds: number[]) {
  const db = await getDb();
  if (!db || moleculeIds.length === 0) return { selectedIds: moleculeIds, suggestions: [] };
  
  // Get terpene synergies involving any of the selected molecules
  const terpeneSyns = await db
    .select()
    .from(terpeneSynergies)
    .where(
      or(
        inArray(terpeneSynergies.terpene1Id, moleculeIds),
        inArray(terpeneSynergies.terpene2Id, moleculeIds)
      )
    );
  
  // Get molecule synergies involving any of the selected molecules
  const molSyns = await db
    .select()
    .from(moleculeSynergies)
    .where(
      or(
        inArray(moleculeSynergies.molecule1Id, moleculeIds),
        inArray(moleculeSynergies.molecule2Id, moleculeIds)
      )
    );
  
  // Collect partner molecule IDs (not in selected list)
  const selectedSet = new Set(moleculeIds);
  const partnerIds = new Set<number>();
  
  terpeneSyns.forEach(s => {
    if (selectedSet.has(s.terpene1Id) && !selectedSet.has(s.terpene2Id)) {
      partnerIds.add(s.terpene2Id);
    }
    if (selectedSet.has(s.terpene2Id) && !selectedSet.has(s.terpene1Id)) {
      partnerIds.add(s.terpene1Id);
    }
  });
  
  molSyns.forEach(s => {
    if (selectedSet.has(s.molecule1Id) && !selectedSet.has(s.molecule2Id)) {
      partnerIds.add(s.molecule2Id);
    }
    if (selectedSet.has(s.molecule2Id) && !selectedSet.has(s.molecule1Id)) {
      partnerIds.add(s.molecule1Id);
    }
  });
  
  if (partnerIds.size === 0) return { selectedIds: moleculeIds, suggestions: [] };
  
  // Get partner molecule details
  const partners = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      family: molecules.family,
      chemicalClass: molecules.chemicalClass,
      olfactiveProfile: molecules.olfactiveProfile,
    })
    .from(molecules)
    .where(inArray(molecules.id, Array.from(partnerIds)));
  
  // Get selected molecule names for context
  const selectedMols = await db
    .select({ id: molecules.id, name: molecules.name })
    .from(molecules)
    .where(inArray(molecules.id, moleculeIds));
  const selectedNameMap = new Map(selectedMols.map(m => [m.id, m.name]));
  
  // Build suggestions with synergy details
  const suggestions = partners.map(partner => {
    // Find all synergies with this partner
    const relevantTerpeneSyns = terpeneSyns.filter(
      s => (s.terpene1Id === partner.id || s.terpene2Id === partner.id)
    );
    const relevantMolSyns = molSyns.filter(
      s => (s.molecule1Id === partner.id || s.molecule2Id === partner.id)
    );
    
    // Get the best synergy info
    const bestTerpeneSyn = relevantTerpeneSyns.reduce((best, curr) => 
      !best || (curr.compatibilityScore > best.compatibilityScore) ? curr : best, 
      null as typeof relevantTerpeneSyns[0] | null
    );
    const bestMolSyn = relevantMolSyns[0];
    
    // Find which selected molecules this partner synergizes with
    const synergyPartners: string[] = [];
    relevantTerpeneSyns.forEach(s => {
      const partnerId = s.terpene1Id === partner.id ? s.terpene2Id : s.terpene1Id;
      const partnerName = selectedNameMap.get(partnerId);
      if (partnerName && !synergyPartners.includes(partnerName)) {
        synergyPartners.push(partnerName);
      }
    });
    relevantMolSyns.forEach(s => {
      const partnerId = s.molecule1Id === partner.id ? s.molecule2Id : s.molecule1Id;
      const partnerName = selectedNameMap.get(partnerId);
      if (partnerName && !synergyPartners.includes(partnerName)) {
        synergyPartners.push(partnerName);
      }
    });
    
    return {
      molecule: {
        id: partner.id,
        name: partner.name,
        family: partner.family,
        chemicalClass: partner.chemicalClass,
        olfactiveProfile: partner.olfactiveProfile,
      },
      synergyType: bestMolSyn?.type || (bestTerpeneSyn?.compatibilityScore && bestTerpeneSyn.compatibilityScore >= 70 ? 'potentialisation' : 'stabilisation'),
      compatibilityScore: bestTerpeneSyn?.compatibilityScore || 75,
      description: bestMolSyn?.description || bestTerpeneSyn?.synergyNotes || 'Synergie documentée',
      applications: bestMolSyn?.applications,
      synergyPartners,
      synergyCount: relevantTerpeneSyns.length + relevantMolSyns.length,
    };
  });
  
  // Sort by synergy count and compatibility score
  const sortedSuggestions = suggestions.sort((a, b) => {
    if (b.synergyCount !== a.synergyCount) return b.synergyCount - a.synergyCount;
    return b.compatibilityScore - a.compatibilityScore;
  });
  
  return { selectedIds: moleculeIds, suggestions: sortedSuggestions };
}

// ============================================================================
// BULK IMPORT & SUGGESTIONS FOR REFERENCE ENTITY LINKS
// ============================================================================

/**
 * Bulk import reference entity links from CSV data
 * Expected CSV columns: referenceId, entityType, entityId, linkType, relevanceScore, notes, context
 */
export async function bulkImportReferenceEntityLinks(data: Array<{
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  linkType?: 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';
  relevanceScore?: number;
  notes?: string;
  context?: string;
}>, createdBy?: number) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] };
  
  const errors: Array<{ row: number; error: string }> = [];
  let createdCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    try {
      const item = data[i];
      
      // Validate required fields
      if (!item.referenceId || !item.entityType || !item.entityId) {
        errors.push({ row: i + 1, error: 'Missing required fields: referenceId, entityType, entityId' });
        continue;
      }
      
      // Check if reference exists
      const refExists = await db.select({ id: v3References.id })
        .from(v3References)
        .where(eq(v3References.id, item.referenceId))
        .limit(1);
      
      if (!refExists.length) {
        errors.push({ row: i + 1, error: `Reference ID ${item.referenceId} not found` });
        continue;
      }
      
      // Check for duplicate link
      const existingLink = await db.select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(and(
          eq(referenceEntityLinks.referenceId, item.referenceId),
          eq(referenceEntityLinks.entityType, item.entityType),
          eq(referenceEntityLinks.entityId, item.entityId)
        ))
        .limit(1);
      
      if (existingLink.length) {
        errors.push({ row: i + 1, error: 'Link already exists' });
        continue;
      }
      
      // Create the link
      await db.insert(referenceEntityLinks).values({
        referenceId: item.referenceId,
        entityType: item.entityType,
        entityId: item.entityId,
        linkType: item.linkType || 'documents',
        relevanceScore: item.relevanceScore || 50,
        notes: item.notes,
        context: item.context,
        createdBy: createdBy,
      });
      
      createdCount++;
    } catch (error: any) {
      errors.push({ row: i + 1, error: error.message || 'Unknown error' });
    }
  }
  
  return { success: errors.length === 0, created: createdCount, errors };
}

/**
 * Suggest links based on keyword matching between references and entities
 */
export async function suggestReferenceEntityLinks(options: {
  referenceId?: number;
  entityType?: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  minScore?: number;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const minScore = options.minScore || 60;
  const limit = options.limit || 50;
  
  const suggestions: Array<{
    referenceId: number;
    entityType: string;
    entityId: number;
    entityName: string;
    score: number;
    matchedKeywords: string[];
  }> = [];
  
  try {
    // Get references to analyze
    let references;
    if (options.referenceId) {
      references = await db.select()
        .from(v3References)
        .where(eq(v3References.id, options.referenceId))
        .limit(1);
    } else {
      references = await db.select()
        .from(v3References)
        .limit(100);
    }
    
    for (const ref of references) {
      // Extract keywords from reference (title, tags, notes)
      const tagsStr = Array.isArray(ref.tags) ? ref.tags.join(' ') : '';
      const refKeywords = extractKeywords(
        [ref.title, tagsStr, ref.notes].filter(Boolean).join(' ')
      );
      
      if (refKeywords.length === 0) continue;
      
      // Check molecules
      if (!options.entityType || options.entityType === 'molecule') {
        const moleculesList = await db.select()
          .from(molecules)
          .limit(500);
        
        for (const mol of moleculesList) {
          // Check if link already exists
          const existingLink = await db.select({ id: referenceEntityLinks.id })
            .from(referenceEntityLinks)
            .where(and(
              eq(referenceEntityLinks.referenceId, ref.id),
              eq(referenceEntityLinks.entityType, 'molecule'),
              eq(referenceEntityLinks.entityId, mol.id)
            ))
            .limit(1);
          
          if (existingLink.length) continue;
          
          const molKeywords = extractKeywords(
            [mol.name, mol.iupacName, mol.olfactiveProfile, mol.chemicalClass].filter(Boolean).join(' ')
          );
          
          const score = calculateKeywordSimilarity(refKeywords, molKeywords);
          if (score >= minScore) {
            suggestions.push({
              referenceId: ref.id,
              entityType: 'molecule',
              entityId: mol.id,
              entityName: mol.name,
              score,
              matchedKeywords: findCommonKeywords(refKeywords, molKeywords),
            });
          }
        }
      }
      
      // Check plants
      if (!options.entityType || options.entityType === 'plant') {
        const plantsList = await db.select()
          .from(plants)
          .limit(500);
        
        for (const plant of plantsList) {
          // Check if link already exists
          const existingLink = await db.select({ id: referenceEntityLinks.id })
            .from(referenceEntityLinks)
            .where(and(
              eq(referenceEntityLinks.referenceId, ref.id),
              eq(referenceEntityLinks.entityType, 'plant'),
              eq(referenceEntityLinks.entityId, plant.id)
            ))
            .limit(1);
          
          if (existingLink.length) continue;
          
          const plantKeywords = extractKeywords(
            [plant.name, plant.latinName, plant.family, (plant as any).description].filter(Boolean).join(' ')
          );
          
          const score = calculateKeywordSimilarity(refKeywords, plantKeywords);
          if (score >= minScore) {
            suggestions.push({
              referenceId: ref.id,
              entityType: 'plant',
              entityId: plant.id,
              entityName: plant.name,
              score,
              matchedKeywords: findCommonKeywords(refKeywords, plantKeywords),
            });
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Error suggesting links:', error);
  }
  
  // Sort by score and return top results
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Apply suggested links in bulk
 */
export async function applySuggestedLinks(suggestions: Array<{
  referenceId: number;
  entityType: 'leaf_economy' | 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  score: number;
}>, createdBy?: number) {
  const db = await getDb();
  if (!db) return { success: false, created: 0, errors: [] };
  
  let createdCount = 0;
  const errors: Array<{ suggestion: number; error: string }> = [];
  
  for (let i = 0; i < suggestions.length; i++) {
    try {
      const suggestion = suggestions[i];
      
      // Check if link already exists
      const existingLink = await db.select({ id: referenceEntityLinks.id })
        .from(referenceEntityLinks)
        .where(and(
          eq(referenceEntityLinks.referenceId, suggestion.referenceId),
          eq(referenceEntityLinks.entityType, suggestion.entityType),
          eq(referenceEntityLinks.entityId, suggestion.entityId)
        ))
        .limit(1);
      
      if (existingLink.length) {
        errors.push({ suggestion: i, error: 'Link already exists' });
        continue;
      }
      
      // Create the link with relevance score from suggestion
      await db.insert(referenceEntityLinks).values({
        referenceId: suggestion.referenceId,
        entityType: suggestion.entityType,
        entityId: suggestion.entityId,
        linkType: 'documents',
        relevanceScore: Math.min(suggestion.score, 100),
        notes: 'Auto-suggested link based on keyword matching',
        createdBy: createdBy,
      });
      
      createdCount++;
    } catch (error: any) {
      errors.push({ suggestion: i, error: error.message || 'Unknown error' });
    }
  }
  
  return { success: errors.length === 0, created: createdCount, errors };
}

/**
 * Get graph data for D3.js visualization of reference entity links
 */
export async function getReferenceEntityLinkGraphData() {
  const db = await getDb();
  if (!db) return { nodes: [], links: [] };
  
  try {
    const links = await db.select().from(referenceEntityLinks).limit(1000);
    
    const nodeMap = new Map<string, { id: string; label: string; type: string; group: string }>();
    const edgeList: Array<{
      source: string;
      target: string;
      linkType: string;
      relevanceScore: number;
    }> = [];
    
    for (const link of links) {
      // Add reference node
      const refNodeId = `ref_${link.referenceId}`;
      if (!nodeMap.has(refNodeId)) {
        nodeMap.set(refNodeId, {
          id: refNodeId,
          label: `Ref ${link.referenceId}`,
          type: 'reference',
          group: 'references',
        });
      }
      
      // Add entity node
      const entityNodeId = `${link.entityType}_${link.entityId}`;
      if (!nodeMap.has(entityNodeId)) {
        nodeMap.set(entityNodeId, {
          id: entityNodeId,
          label: `${link.entityType} ${link.entityId}`,
          type: link.entityType,
          group: link.entityType,
        });
      }
      
      // Add edge
      edgeList.push({
        source: refNodeId,
        target: entityNodeId,
        linkType: link.linkType || 'documents',
        relevanceScore: link.relevanceScore || 50,
      });
    }
    
    return {
      nodes: Array.from(nodeMap.values()),
      links: edgeList,
    };
  } catch (error: any) {
    console.error('Error getting graph data:', error);
    return { nodes: [], links: [] };
  }
}


// ============================================================================
// TPS GENE - MOLECULE LINKS FUNCTIONS
// ============================================================================

// Get all TPS gene-molecule links with gene and molecule details
export async function getTpsGeneMoleculeLinks(filters?: {
  tpsGeneId?: number;
  moleculeId?: number;
  relationshipType?: string;
  confidenceLevel?: string;
}) {
  try {
    let query = `
      SELECT 
        tgm.id,
        tgm.tps_gene_id as tpsGeneId,
        tgm.molecule_id as moleculeId,
        tgm.relationship_type as relationshipType,
        tgm.confidence_level as confidenceLevel,
        tgm.evidence_source as evidenceSource,
        tgm.notes,
        tgm.created_at as createdAt,
        tg.name as geneName,
        tg.subfamily as geneSubfamily,
        tg.product_class as geneProductClass,
        tg.main_product as geneMainProduct,
        tg.olfactory_notes as geneOlfactoryNotes,
        m.name as moleculeName,
        m.formula as moleculeFormula,
        m.olfactiveProfile as moleculeOlfactiveProfile
      FROM tps_gene_molecules tgm
      JOIN tps_genes tg ON tgm.tps_gene_id = tg.id
      JOIN molecules m ON tgm.molecule_id = m.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (filters?.tpsGeneId) {
      query += ` AND tgm.tps_gene_id = ?`;
      params.push(filters.tpsGeneId);
    }
    
    if (filters?.moleculeId) {
      query += ` AND tgm.molecule_id = ?`;
      params.push(filters.moleculeId);
    }
    
    if (filters?.relationshipType) {
      query += ` AND tgm.relationship_type = ?`;
      params.push(filters.relationshipType);
    }
    
    if (filters?.confidenceLevel) {
      query += ` AND tgm.confidence_level = ?`;
      params.push(filters.confidenceLevel);
    }
    
    query += ` ORDER BY tg.name, m.name`;
    
    const db = await getDb();
    if (!db) return [];
    const result = await (db as any).execute(sql.raw(query.replace(/\?/g, (_, i) => `'${String(params[i] || '').replace(/'/g, "''")}'`)));
    return (result[0] as unknown) as any[];
  } catch (error: any) {
    console.error('Error getting TPS gene-molecule links:', error);
    return [];
  }
}

// Create a TPS gene-molecule link
export async function createTpsGeneMoleculeLink(data: {
  tpsGeneId: number;
  moleculeId: number;
  relationshipType?: string;
  confidenceLevel?: string;
  evidenceSource?: string;
  notes?: string;
}) {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    const evidenceSource = data.evidenceSource ? `'${data.evidenceSource.replace(/'/g, "''")}'` : 'NULL';
    const notes = data.notes ? `'${data.notes.replace(/'/g, "''")}'` : 'NULL';
    await (db as any).execute(sql.raw(`
      INSERT INTO tps_gene_molecules 
        (tps_gene_id, molecule_id, relationship_type, confidence_level, evidence_source, notes)
       VALUES (${data.tpsGeneId}, ${data.moleculeId}, '${data.relationshipType || 'produces'}', '${data.confidenceLevel || 'inferred'}', ${evidenceSource}, ${notes})
    `));
    return { success: true, id: 0 };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Cette liaison existe déjà' };
    }
    console.error('Error creating TPS gene-molecule link:', error);
    return { success: false, error: error.message };
  }
}

// Update a TPS gene-molecule link
export async function updateTpsGeneMoleculeLink(
  id: number,
  data: {
    relationshipType?: string;
    confidenceLevel?: string;
    evidenceSource?: string;
    notes?: string;
  }
) {
  try {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (data.relationshipType) {
      updates.push('relationship_type = ?');
      params.push(data.relationshipType);
    }
    if (data.confidenceLevel) {
      updates.push('confidence_level = ?');
      params.push(data.confidenceLevel);
    }
    if (data.evidenceSource !== undefined) {
      updates.push('evidence_source = ?');
      params.push(data.evidenceSource);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      params.push(data.notes);
    }
    
    if (updates.length === 0) {
      return { success: false, error: 'Aucune mise à jour fournie' };
    }
    
    params.push(id);
    
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    const setClause = updates.map((u, i) => u.replace('?', `'${String(params[i]).replace(/'/g, "''")}'`)).join(', ');
    await (db as any).execute(sql.raw(`UPDATE tps_gene_molecules SET ${setClause} WHERE id = ${id}`));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating TPS gene-molecule link:', error);
    return { success: false, error: error.message };
  }
}

// Delete a TPS gene-molecule link
export async function deleteTpsGeneMoleculeLink(id: number) {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database connection failed' };
    await (db as any).execute(sql.raw(`DELETE FROM tps_gene_molecules WHERE id = ${id}`));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting TPS gene-molecule link:', error);
    return { success: false, error: error.message };
  }
}

// Get TPS gene-molecule link statistics
export async function getTpsGeneMoleculeLinkStats() {
  try {
    const db = await getDb();
    if (!db) {
      return {
        totalLinks: 0,
        byRelationship: [],
        byConfidence: [],
        linkedGenes: 0,
        linkedMolecules: 0,
        totalGenes: 0,
        totalMolecules: 0,
        geneCoverage: 0,
        moleculeCoverage: 0,
      };
    }
    
    const totalLinksResult = await (db as any).execute(sql.raw(
      'SELECT COUNT(*) as count FROM tps_gene_molecules'
    ));
    const totalLinks = ((totalLinksResult[0] as unknown) as any[])[0]?.count || 0;
    
    const byRelationshipResult = await (db as any).execute(sql.raw(`
      SELECT relationship_type as type, COUNT(*) as count 
      FROM tps_gene_molecules 
      GROUP BY relationship_type
    `));
    const byRelationship = (byRelationshipResult[0] as unknown) as any[];
    
    const byConfidenceResult = await (db as any).execute(sql.raw(`
      SELECT confidence_level as level, COUNT(*) as count 
      FROM tps_gene_molecules 
      GROUP BY confidence_level
    `));
    const byConfidence = (byConfidenceResult[0] as unknown) as any[];
    
    const linkedGenesResult = await (db as any).execute(sql.raw(`
      SELECT COUNT(DISTINCT tps_gene_id) as count FROM tps_gene_molecules
    `));
    const linkedGenes = ((linkedGenesResult[0] as unknown) as any[])[0]?.count || 0;
    
    const linkedMoleculesResult = await (db as any).execute(sql.raw(`
      SELECT COUNT(DISTINCT molecule_id) as count FROM tps_gene_molecules
    `));
    const linkedMolecules = ((linkedMoleculesResult[0] as unknown) as any[])[0]?.count || 0;
    
    const totalGenesResult = await (db as any).execute(sql.raw(
      'SELECT COUNT(*) as count FROM tps_genes'
    ));
    const totalGenesCount = ((totalGenesResult[0] as unknown) as any[])[0]?.count || 0;
    
    const totalMoleculesResult = await (db as any).execute(sql.raw(
      'SELECT COUNT(*) as count FROM molecules'
    ));
    const totalMoleculesCount = ((totalMoleculesResult[0] as unknown) as any[])[0]?.count || 0;
    
    return {
      totalLinks,
      byRelationship,
      byConfidence,
      linkedGenes,
      linkedMolecules,
      totalGenes: totalGenesCount,
      totalMolecules: totalMoleculesCount,
      geneCoverage: linkedGenes / (totalGenesCount || 1) * 100,
      moleculeCoverage: linkedMolecules / (totalMoleculesCount || 1) * 100,
    };
  } catch (error: any) {
    console.error('Error getting TPS gene-molecule link stats:', error);
    return {
      totalLinks: 0,
      byRelationship: [],
      byConfidence: [],
      linkedGenes: 0,
      linkedMolecules: 0,
      totalGenes: 0,
      totalMolecules: 0,
      geneCoverage: 0,
      moleculeCoverage: 0,
    };
  }
}

// Auto-link TPS genes to molecules based on product name matching
export async function autoLinkTpsGenesToMolecules() {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database connection failed', linksCreated: 0 };
    }
    
    // Get all TPS genes with their main products
    const genesResult = await (db as any).execute(sql.raw(`
      SELECT id, name, main_product FROM tps_genes
    `));
    const genes = (genesResult[0] as unknown) as any[];
    
    // Get all molecules
    const moleculesResult = await (db as any).execute(sql.raw(`
      SELECT id, name FROM molecules
    `));
    const moleculesList = (moleculesResult[0] as unknown) as any[];
    
    let linksCreated = 0;
    
    for (const gene of genes) {
      if (!gene.main_product) continue;
      const mainProduct = gene.main_product.toLowerCase();
      
      // Find matching molecules
      for (const mol of moleculesList) {
        const molName = mol.name.toLowerCase();
        
        // Check for exact or partial match
        if (molName.includes(mainProduct) || mainProduct.includes(molName)) {
          // Try to create link (will fail silently if already exists)
          const result = await createTpsGeneMoleculeLink({
            tpsGeneId: gene.id,
            moleculeId: mol.id,
            relationshipType: 'produces',
            confidenceLevel: 'inferred',
            evidenceSource: 'Auto-link based on product name matching',
          });
          
          if (result.success) {
            linksCreated++;
          }
        }
      }
    }
    
    return { success: true, linksCreated };
  } catch (error: any) {
    console.error('Error auto-linking TPS genes to molecules:', error);
    return { success: false, error: error.message, linksCreated: 0 };
  }
}

// Search for potential molecule matches for a TPS gene
export async function searchMoleculeMatchesForTpsGene(tpsGeneId: number) {
  try {
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database connection failed', matches: [] };
    }
    
    // Get the TPS gene details
    const geneResult = await (db as any).execute(sql.raw(
      `SELECT * FROM tps_genes WHERE id = ${tpsGeneId}`
    ));
    const geneRows = (geneResult[0] as unknown) as any[];
    
    const gene = geneRows[0];
    if (!gene) {
      return { success: false, error: 'Gène TPS non trouvé', matches: [] };
    }
    
    // Search for molecules that might match
    const mainProduct = gene.main_product || '';
    const olfactoryNotes = gene.olfactory_notes || '';
    const searchTerm = mainProduct.toLowerCase().replace(/'/g, "''");
    const olfactoryTerm = (olfactoryNotes.split(',')[0] || '').replace(/'/g, "''");
    
    const matchesResult = await (db as any).execute(sql.raw(`
      SELECT 
        m.id,
        m.name,
        m.formula,
        m.olfactiveProfile,
        m.chemicalClass
      FROM molecules m
      WHERE 
        LOWER(m.name) LIKE '%${searchTerm}%'
        OR '${searchTerm}' LIKE CONCAT('%', LOWER(m.name), '%')
        OR (m.olfactiveProfile IS NOT NULL AND m.olfactiveProfile LIKE '%${olfactoryTerm}%')
      LIMIT 20
    `));
    const matches = (matchesResult[0] as unknown) as any[];
    
    return {
      success: true,
      gene: {
        id: gene.id,
        name: gene.name,
        mainProduct: gene.main_product,
        olfactoryNotes: gene.olfactory_notes,
      },
      matches,
    };
  } catch (error: any) {
    console.error('Error searching molecule matches:', error);
    return { success: false, error: error.message, matches: [] };
  }
}


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
    
    const result = await (db as any).execute(sql.raw(query));
    return (result[0] as unknown) as any[];
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
    const result = await (db as any).execute(sql.raw(`
      INSERT INTO molecular_transformations (
        source_molecule_name, product_molecule_name, transformation_type,
        source_molecule_id, product_molecule_id,
        temperature_min, temperature_max, temperature_optimal,
        yield_percent, olfactory_change_description,
        source_olfactory_notes, product_olfactory_notes,
        relevance_context, source_reference, notes
      ) VALUES (
        '${data.sourceMoleculeName}', '${data.productMoleculeName}', '${data.transformationType}',
        ${data.sourceMoleculeId || 'NULL'}, ${data.productMoleculeId || 'NULL'},
        ${data.temperatureMin || 'NULL'}, ${data.temperatureMax || 'NULL'}, ${data.temperatureOptimal || 'NULL'},
        ${data.yieldPercent || 'NULL'}, ${data.olfactoryChangeDescription ? `'${data.olfactoryChangeDescription.replace(/'/g, "''")}'` : 'NULL'},
        ${data.sourceOlfactoryNotes ? `'${data.sourceOlfactoryNotes.replace(/'/g, "''")}'` : 'NULL'},
        ${data.productOlfactoryNotes ? `'${data.productOlfactoryNotes.replace(/'/g, "''")}'` : 'NULL'},
        '${data.relevanceContext || 'tobacco_combustion'}',
        ${data.sourceReference ? `'${data.sourceReference.replace(/'/g, "''")}'` : 'NULL'},
        ${data.notes ? `'${data.notes.replace(/'/g, "''")}'` : 'NULL'}
      )
    `));
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
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        COUNT(*) as total_transformations,
        COUNT(DISTINCT source_molecule_name) as unique_sources,
        COUNT(DISTINCT product_molecule_name) as unique_products,
        COUNT(DISTINCT transformation_type) as transformation_types,
        COUNT(DISTINCT relevance_context) as relevance_contexts
      FROM molecular_transformations
    `));
    return ((result[0] as unknown) as any[])[0] || null;
  } catch (error) {
    console.error("Error getting transformation stats:", error);
    return null;
  }
}


// ============================================================================
// TPS GENES BY MOLECULE (Biosynthesis pathway information)
// ============================================================================

/**
 * Get TPS genes that produce a specific molecule (terpene)
 * Returns gene information with biosynthesis pathway details
 */
export async function getTpsGenesByMolecule(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    // First get the molecule name to match with gene products
    const moleculeResult = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
    }).from(molecules).where(eq(molecules.id, moleculeId)).limit(1);
    
    if (!moleculeResult[0]) return [];
    
    const moleculeName = moleculeResult[0].name.toLowerCase();
    
    // Search for TPS genes that produce this molecule
    // Using gene_terpene_links table and matching by terpene_product field
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        gtl.id,
        gtl.gene_name,
        gtl.gene_id,
        gtl.terpene_product,
        gtl.product_type,
        gtl.enzyme_class,
        gtl.species,
        gtl.chromosome,
        gtl.pathway,
        gtl.expression_tissue,
        gtl.regulation_notes,
        gtl.reference_source,
        gtl.ncbi_gene_id,
        gtl.uniprot_id,
        gtl.created_at
      FROM gene_terpene_links gtl
      WHERE LOWER(gtl.terpene_product) LIKE '%${moleculeName.replace(/'/g, "''")}%'
         OR LOWER(gtl.terpene_product) LIKE '%${moleculeName.replace(/'/g, "''").replace(/[αβγδ-]/g, '%')}%'
      ORDER BY gtl.gene_name
    `));
    
    const rows = (result[0] as unknown) as any[];
    
    return rows.map((row: any) => ({
      id: row.id,
      geneName: row.gene_name,
      geneId: row.gene_id,
      terpeneProduct: row.terpene_product,
      productType: row.product_type,
      enzymeClass: row.enzyme_class,
      species: row.species,
      chromosome: row.chromosome,
      pathway: row.pathway,
      expressionTissue: row.expression_tissue,
      regulationNotes: row.regulation_notes,
      referenceSource: row.reference_source,
      ncbiGeneId: row.ncbi_gene_id,
      uniprotId: row.uniprot_id,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting TPS genes for molecule:", error);
    return [];
  }
}

/**
 * Get all TPS genes with their terpene products
 */
export async function getAllTpsGenes() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        gtl.*,
        m.id as molecule_id,
        m.name as molecule_name
      FROM gene_terpene_links gtl
      LEFT JOIN molecules m ON LOWER(m.name) LIKE CONCAT('%', LOWER(gtl.terpene_product), '%')
      ORDER BY gtl.gene_name
    `));
    
    const rows = (result[0] as unknown) as any[];
    
    return rows.map((row: any) => ({
      id: row.id,
      geneName: row.gene_name,
      geneId: row.gene_id,
      terpeneProduct: row.terpene_product,
      productType: row.product_type,
      enzymeClass: row.enzyme_class,
      species: row.species,
      chromosome: row.chromosome,
      pathway: row.pathway,
      expressionTissue: row.expression_tissue,
      regulationNotes: row.regulation_notes,
      referenceSource: row.reference_source,
      ncbiGeneId: row.ncbi_gene_id,
      uniprotId: row.uniprot_id,
      linkedMoleculeId: row.molecule_id,
      linkedMoleculeName: row.molecule_name,
    }));
  } catch (error) {
    console.error("Error getting all TPS genes:", error);
    return [];
  }
}

/**
 * Get TPS gene statistics
 */
export async function getTpsGeneStats() {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await (db as any).execute(sql.raw(`
      SELECT 
        COUNT(*) as total_genes,
        COUNT(DISTINCT species) as unique_species,
        COUNT(DISTINCT enzyme_class) as enzyme_classes,
        COUNT(DISTINCT product_type) as product_types,
        COUNT(DISTINCT pathway) as pathways
      FROM gene_terpene_links
    `));
    
    const stats = ((result[0] as unknown) as any[])[0];
    
    // Get genes by species
    const speciesResult = await (db as any).execute(sql.raw(`
      SELECT species, COUNT(*) as count
      FROM gene_terpene_links
      WHERE species IS NOT NULL
      GROUP BY species
      ORDER BY count DESC
    `));
    
    // Get genes by product type
    const productTypeResult = await (db as any).execute(sql.raw(`
      SELECT product_type, COUNT(*) as count
      FROM gene_terpene_links
      WHERE product_type IS NOT NULL
      GROUP BY product_type
      ORDER BY count DESC
    `));
    
    return {
      totalGenes: stats?.total_genes || 0,
      uniqueSpecies: stats?.unique_species || 0,
      enzymeClasses: stats?.enzyme_classes || 0,
      productTypes: stats?.product_types || 0,
      pathways: stats?.pathways || 0,
      bySpecies: (speciesResult[0] as unknown as any[]).map((r: any) => ({
        species: r.species,
        count: r.count,
      })),
      byProductType: (productTypeResult[0] as unknown as any[]).map((r: any) => ({
        productType: r.product_type,
        count: r.count,
      })),
    };
  } catch (error) {
    console.error("Error getting TPS gene stats:", error);
    return null;
  }
}


// ============================================================================
// GENEALOGY GRAPH DATA FOR D3.JS VISUALIZATION
// ============================================================================

/**
 * Get all genealogy data for D3.js force-directed graph visualization
 * Returns nodes (varieties) and links (parent-child relationships)
 */
export async function getGenealogyGraphData(filters?: {
  plantType?: 'cannabis' | 'tobacco' | 'all';
  includeModern?: boolean;
  includeLandraces?: boolean;
}) {
  const db = await getDb();
  if (!db) return { nodes: [], links: [], stats: null };
  
  try {
    // Get all varieties
    let varietiesQuery = db.select({
      id: plantVarieties.id,
      name: plantVarieties.name,
      plantId: plantVarieties.plantId,
      varietyType: plantVarieties.varietyType,
      isLandrace: sql<boolean>`(${plantVarieties.varietyType} = 'landrace')`,
      countryOfOrigin: plantVarieties.countryOfOrigin,
      dominantMolecules: plantVarieties.dominantMolecules,
      molecularProfile: plantVarieties.molecularProfile,
      olfactiveNotes: plantVarieties.olfactiveNotes,
      thcContent: (plantVarieties as any).thcContent,
      cbdContent: (plantVarieties as any).cbdContent,
    }).from(plantVarieties);
    
    const allVarieties = await varietiesQuery;
    
    // Get all genealogy relationships
    const allRelationships = await db.select().from(varietyGenealogy);
    
    // Get plant info for categorization
    const allPlants = await db.select({
      id: plants.id,
      name: plants.name,
      category: plants.category,
    }).from(plants);
    
    const plantMap = new Map(allPlants.map(p => [p.id, p]));
    
    // Filter varieties based on plant type
    let filteredVarieties = allVarieties;
    if (filters?.plantType && filters.plantType !== 'all') {
      filteredVarieties = allVarieties.filter(v => {
        const plant = plantMap.get(v.plantId);
        if (!plant) return false;
        if (filters.plantType === 'cannabis') {
          return plant.name.toLowerCase().includes('cannabis') || 
                 plant.category === 'cannabis';
        }
        if (filters.plantType === 'tobacco') {
          return plant.name.toLowerCase().includes('tabac') || 
                 plant.name.toLowerCase().includes('tobacco') ||
                 plant.category === 'tabac';
        }
        return true;
      });
    }
    
    // Apply landrace/modern filters
    if (filters?.includeLandraces === false) {
      filteredVarieties = filteredVarieties.filter(v => v.varietyType !== 'landrace');
    }
    if (filters?.includeModern === false) {
      filteredVarieties = filteredVarieties.filter(v => v.varietyType === 'landrace');
    }
    
    const varietyIds = new Set(filteredVarieties.map(v => v.id));
    
    // Build nodes
    const nodes = filteredVarieties.map(v => {
      const plant = plantMap.get(v.plantId);
      return {
        id: v.id,
        name: v.name,
        type: v.varietyType === 'landrace' ? 'landrace' : 'modern',
        varietyType: v.varietyType,
        plantName: plant?.name || 'Unknown',
        plantCategory: plant?.category || 'unknown',
        country: v.countryOfOrigin,
        dominantMolecules: v.dominantMolecules,
        molecularProfile: v.molecularProfile,
        olfactiveNotes: v.olfactiveNotes,
        thcContent: v.thcContent,
        cbdContent: v.cbdContent,
      };
    });
    
    // Build links (only include links where both nodes exist in filtered set)
    const links = allRelationships
      .filter(r => varietyIds.has(r.varietyId) && varietyIds.has(r.parentVarietyId))
      .map(r => ({
        id: r.id,
        source: r.parentVarietyId,
        target: r.varietyId,
        type: r.relationshipType,
        crossDate: r.crossDate,
        breeder: r.breeder,
        notes: r.notes,
      }));
    
    // Calculate stats
    const landraceCount = nodes.filter(n => n.type === 'landrace').length;
    const modernCount = nodes.filter(n => n.type === 'modern').length;
    const countriesSet = new Set(nodes.map(n => n.country).filter(Boolean));
    
    return {
      nodes,
      links,
      stats: {
        totalVarieties: nodes.length,
        landraces: landraceCount,
        modern: modernCount,
        relationships: links.length,
        countries: countriesSet.size,
        countriesList: Array.from(countriesSet),
      },
    };
  } catch (error) {
    console.error("Error getting genealogy graph data:", error);
    return { nodes: [], links: [], stats: null };
  }
}

/**
 * Get genealogy data for a specific variety with full ancestor/descendant tree
 */
export async function getVarietyFullGenealogy(varietyId: number, depth: number = 5) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    // Get the variety
    const [variety] = await db.select().from(plantVarieties).where(eq(plantVarieties.id, varietyId));
    if (!variety) return null;
    
    // Get ancestors
    const ancestors = await getVarietyAncestors(varietyId, depth);
    
    // Get descendants
    const descendants = await getVarietyDescendants(varietyId, depth);
    
    // Get all variety IDs involved
    const allIds = new Set([
      varietyId,
      ...ancestors.map(a => a.parentVarietyId),
      ...descendants.map(d => d.varietyId),
    ]);
    
    // Get full variety details for all involved
    const allVarieties = await db
      .select()
      .from(plantVarieties)
      .where(inArray(plantVarieties.id, Array.from(allIds)));
    
    // Get all relationships between these varieties
    const allRelationships = await db
      .select()
      .from(varietyGenealogy)
      .where(
        or(
          inArray(varietyGenealogy.varietyId, Array.from(allIds)),
          inArray(varietyGenealogy.parentVarietyId, Array.from(allIds))
        )
      );
    
    return {
      centralVariety: variety,
      nodes: allVarieties.map(v => ({
        id: v.id,
        name: v.name,
        type: v.varietyType === 'landrace' ? 'landrace' : 'modern',
        varietyType: v.varietyType,
        country: v.countryOfOrigin,
        isCentral: v.id === varietyId,
      })),
      links: allRelationships.map(r => ({
        source: r.parentVarietyId,
        target: r.varietyId,
        type: r.relationshipType,
      })),
      ancestorCount: ancestors.length,
      descendantCount: descendants.length,
    };
  } catch (error) {
    console.error("Error getting variety full genealogy:", error);
    return null;
  }
}


// ============================================================================
// RESEARCH DATA (Publications, Méthodes analytiques, Chercheurs, Institutions)
// ============================================================================

import { 
  researchPublications,
  analyticalMethods,
  moleculeAnalyticalMethods,
  researchers,
  researchInstitutions,
  publicationMethods,
  publicationResearchers,
  researcherInstitutions,
  publicationMolecules,
  publicationTransformations,
  ResearchPublication,
  AnalyticalMethod,
  MoleculeAnalyticalMethod,
  Researcher,
  ResearchInstitution
} from '../drizzle/schema';

// --- Research Publications ---

export async function getAllResearchPublications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications).orderBy(desc(researchPublications.year));
}

export async function getResearchPublicationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchPublications).where(eq(researchPublications.id, id));
  return result[0] || null;
}

export async function getResearchPublicationByRefCode(refCode: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchPublications).where(eq(researchPublications.refCode, refCode));
  return result[0] || null;
}

export async function getResearchPublicationsByFocus(focus: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .where(eq(researchPublications.researchFocus, focus as any))
    .orderBy(desc(researchPublications.citations));
}

export async function getResearchPublicationsBySubject(subject: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .where(eq(researchPublications.subjectMatter, subject as any))
    .orderBy(desc(researchPublications.citations));
}

export async function searchResearchPublications(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(researchPublications)
    .where(or(
      like(researchPublications.title, searchTerm),
      like(researchPublications.authors, searchTerm),
      like(researchPublications.keyFindings, searchTerm)
    ))
    .orderBy(desc(researchPublications.citations));
}

// --- Analytical Methods ---

export async function getAllAnalyticalMethods() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(analyticalMethods).orderBy(desc(analyticalMethods.performanceScore));
}

export async function getAnalyticalMethodById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(analyticalMethods).where(eq(analyticalMethods.id, id));
  return result[0] || null;
}

export async function getAnalyticalMethodByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(analyticalMethods).where(eq(analyticalMethods.id, Number(code)));
  return result[0] || null;
}

export async function getAnalyticalMethodsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(analyticalMethods)
    .where(eq(analyticalMethods.category, category as any))
    .orderBy(desc(analyticalMethods.performanceScore));
}

export async function searchAnalyticalMethods(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(analyticalMethods)
    .where(
      or(
        like(analyticalMethods.name, searchTerm),
        like(analyticalMethods.code, searchTerm),
        like(analyticalMethods.fullName, searchTerm),
        like(analyticalMethods.description, searchTerm)
      )
    )
    .orderBy(desc(analyticalMethods.performanceScore));
}

// Get analytical methods used for a specific molecule
export async function getAnalyticalMethodsByMoleculeId(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select({
    id: analyticalMethods.id,
    code: analyticalMethods.code,
    name: analyticalMethods.name,
    fullName: analyticalMethods.fullName,
    category: analyticalMethods.category,
    description: analyticalMethods.description,
    performanceScore: analyticalMethods.performanceScore,
    resolutionScore: analyticalMethods.resolutionScore,
    sensitivityScore: analyticalMethods.sensitivityScore,
    detectionLimit: analyticalMethods.detectionLimit,
    // Liaison details
    isPrimary: moleculeAnalyticalMethods.isPrimary,
    analysisDetectionLimit: moleculeAnalyticalMethods.detectionLimit,
    detectionUnit: moleculeAnalyticalMethods.detectionUnit,
    accuracy: moleculeAnalyticalMethods.accuracy,
    analysisDate: moleculeAnalyticalMethods.analysisDate,
    laboratoryName: moleculeAnalyticalMethods.laboratoryName,
    liaisonNotes: moleculeAnalyticalMethods.notes,
  })
  .from(moleculeAnalyticalMethods)
  .innerJoin(analyticalMethods, eq(moleculeAnalyticalMethods.methodId, analyticalMethods.id))
  .where(eq(moleculeAnalyticalMethods.moleculeId, moleculeId))
  .orderBy(desc(moleculeAnalyticalMethods.isPrimary), desc(analyticalMethods.performanceScore));
}

// --- Researchers ---

export async function getAllResearchers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchers).orderBy(desc(researchers.totalCitations));
}

export async function getResearcherById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchers).where(eq(researchers.id, id));
  return result[0] || null;
}

export async function getResearchersByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchers)
    .where(eq(researchers.status, status as any))
    .orderBy(desc(researchers.totalCitations));
}

export async function searchResearchers(query: string) {
  const db = await getDb();
  if (!db) return [];
  const searchTerm = `%${query}%`;
  return await db.select().from(researchers)
    .where(or(
      like(researchers.name, searchTerm),
      like(researchers.bio, searchTerm)
    ))
    .orderBy(desc(researchers.totalCitations));
}

// --- Research Institutions ---

export async function getAllResearchInstitutions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchInstitutions).orderBy(desc(researchInstitutions.totalCitations));
}

export async function getResearchInstitutionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchInstitutions).where(eq(researchInstitutions.id, id));
  return result[0] || null;
}

export async function getResearchInstitutionsByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchInstitutions)
    .where(eq(researchInstitutions.country, country))
    .orderBy(desc(researchInstitutions.totalCitations));
}

export async function getResearchInstitutionsByType(type: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchInstitutions)
    .where(eq(researchInstitutions.institutionType, type as any))
    .orderBy(desc(researchInstitutions.totalCitations));
}

// --- Research Statistics ---

export async function getResearchStatistics() {
  const db = await getDb();
  if (!db) return null;
  
  const publications = await db.select({ count: sql<number>`COUNT(*)` }).from(researchPublications);
  const methods = await db.select({ count: sql<number>`COUNT(*)` }).from(analyticalMethods);
  const researcherCount = await db.select({ count: sql<number>`COUNT(*)` }).from(researchers);
  const institutions = await db.select({ count: sql<number>`COUNT(*)` }).from(researchInstitutions);
  
  const totalCitations = await db.select({ 
    total: sql<number>`COALESCE(SUM(citations), 0)` 
  }).from(researchPublications);
  
  const cannabisPublications = await db.select({ count: sql<number>`COUNT(*)` })
    .from(researchPublications)
    .where(or(
      eq(researchPublications.subjectMatter, 'cannabis'),
      eq(researchPublications.subjectMatter, 'both')
    ));
  
  const tobaccoPublications = await db.select({ count: sql<number>`COUNT(*)` })
    .from(researchPublications)
    .where(or(
      eq(researchPublications.subjectMatter, 'tobacco'),
      eq(researchPublications.subjectMatter, 'both')
    ));
  
  return {
    publicationCount: publications[0]?.count || 0,
    methodCount: methods[0]?.count || 0,
    researcherCount: researcherCount[0]?.count || 0,
    institutionCount: institutions[0]?.count || 0,
    totalCitations: totalCitations[0]?.total || 0,
    cannabisPublications: cannabisPublications[0]?.count || 0,
    tobaccoPublications: tobaccoPublications[0]?.count || 0
  };
}

// --- Publications by Year ---

export async function getPublicationsByYear() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    year: researchPublications.year,
    count: sql<number>`COUNT(*)`,
    totalCitations: sql<number>`COALESCE(SUM(citations), 0)`
  })
  .from(researchPublications)
  .groupBy(researchPublications.year)
  .orderBy(researchPublications.year);
  
  return result;
}

// --- Top Cited Publications ---

export async function getTopCitedPublications(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchPublications)
    .orderBy(desc(researchPublications.citations))
    .limit(limit);
}

// --- Methods Performance Comparison ---

export async function getMethodsPerformanceComparison() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select({
    id: analyticalMethods.id,
    code: analyticalMethods.id,
    name: analyticalMethods.name,
    category: analyticalMethods.category,
    performanceScore: analyticalMethods.performanceScore,
    resolutionScore: analyticalMethods.resolutionScore,
    sensitivityScore: analyticalMethods.sensitivityScore,
    detectionLimit: analyticalMethods.detectionLimit,
    publicationCount: analyticalMethods.publicationCount
  })
  .from(analyticalMethods)
  .orderBy(desc(analyticalMethods.performanceScore));
}


// ============================================================================
// TOBACCO DATA - LANDRACES, CIGARETTES, COMPOUNDS, SOIL ANALYSES
// ============================================================================

// --- Tobacco Landraces ---

export async function getAllTobaccoLandraces() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_landraces ORDER BY perfumery_potential_score DESC
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoLandracesByRegion(region: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_landraces 
    WHERE country LIKE ${`%${region}%`} OR region LIKE ${`%${region}%`}
    ORDER BY perfumery_potential_score DESC
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoLandracesByMolecularProfile(profileType: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_landraces 
    WHERE molecular_profile_type = ${profileType}
    ORDER BY perfumery_potential_score DESC
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoLandraceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_landraces WHERE id = ${id}
  `);
  const rows = (result[0] as unknown) as any[];
  return rows[0] || null;
}

export async function getTobaccoLandracesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCountry: [], byProfile: [], byStatus: [] };
  
  const _total = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_landraces`);
  const [total] = (_total[0] as unknown) as any[];
  const _byCountry = await db.execute(sql`
    SELECT country, COUNT(*) as count FROM tobacco_landraces GROUP BY country ORDER BY count DESC
  `);
  const [byCountry] = (_byCountry[0] as unknown) as any[];
  const _byProfile = await db.execute(sql`
    SELECT molecular_profile_type as profile, COUNT(*) as count FROM tobacco_landraces GROUP BY molecular_profile_type
  `);
  const [byProfile] = (_byProfile[0] as unknown) as any[];
  const _byStatus = await db.execute(sql`
    SELECT status, COUNT(*) as count FROM tobacco_landraces GROUP BY status
  `);
  const [byStatus] = (_byStatus[0] as unknown) as any[];
  
  return {
    total: (total as any[])[0]?.count || 0,
    byCountry: byCountry as any[],
    byProfile: byProfile as any[],
    byStatus: byStatus as any[]
  };
}

// --- Tobacco Cigarettes ---

export async function getAllTobaccoCigarettes() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_cigarettes ORDER BY perfumery_potential_score DESC
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoCigarettesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_cigarettes 
    WHERE region_category = ${category}
    ORDER BY perfumery_potential_score DESC
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoCigaretteById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_cigarettes WHERE id = ${id}
  `);
  const rows = (result[0] as unknown) as any[];
  return rows[0] || null;
}

export async function getTobaccoCigarettesStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: [], byStatus: [] };
  
  const _total = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_cigarettes`);
  const [total] = (_total[0] as unknown) as any[];
  const _byCategory = await db.execute(sql`
    SELECT region_category as category, COUNT(*) as count FROM tobacco_cigarettes GROUP BY region_category
  `);
  const [byCategory] = (_byCategory[0] as unknown) as any[];
  const _byStatus = await db.execute(sql`
    SELECT status, COUNT(*) as count FROM tobacco_cigarettes GROUP BY status
  `);
  const [byStatus] = (_byStatus[0] as unknown) as any[];
  
  return {
    total: (total as any[])[0]?.count || 0,
    byCategory: byCategory as any[],
    byStatus: byStatus as any[]
  };
}

// --- Tobacco Compounds ---

export async function getAllTobaccoCompounds() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_compounds ORDER BY chemical_class, compound_name
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoCompoundsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_compounds 
    WHERE category = ${category}
    ORDER BY compound_name
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoCompoundsByLandrace(landrace: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_compounds 
    WHERE landrace_source = ${landrace}
    ORDER BY compound_name
  `);
  return (result[0] as unknown) as any[];
}

export async function getNewTobaccoIsolates() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM tobacco_compounds 
    WHERE is_new_tobacco_isolate = TRUE
    ORDER BY compound_name
  `);
  return (result[0] as unknown) as any[];
}

export async function getTobaccoCompoundsStats() {
  const db = await getDb();
  if (!db) return { total: 0, byCategory: [], byClass: [], newIsolates: 0 };
  
  const _total = await db.execute(sql`SELECT COUNT(*) as count FROM tobacco_compounds`);
  const [total] = (_total[0] as unknown) as any[];
  const _byCategory = await db.execute(sql`
    SELECT category, COUNT(*) as count FROM tobacco_compounds GROUP BY category ORDER BY count DESC
  `);
  const [byCategory] = (_byCategory[0] as unknown) as any[];
  const _byClass = await db.execute(sql`
    SELECT chemical_class as class, COUNT(*) as count FROM tobacco_compounds GROUP BY chemical_class ORDER BY count DESC
  `);
  const [byClass] = (_byClass[0] as unknown) as any[];
  const _newIsolates = await db.execute(sql`
    SELECT COUNT(*) as count FROM tobacco_compounds WHERE is_new_tobacco_isolate = TRUE
  `);
  const [newIsolates] = (_newIsolates[0] as unknown) as any[];
  
  return {
    total: (total as any[])[0]?.count || 0,
    byCategory: byCategory as any[],
    byClass: byClass as any[],
    newIsolates: (newIsolates as any[])[0]?.count || 0
  };
}

// --- Soil Analyses ---

export async function getAllSoilAnalyses() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM soil_analyses ORDER BY terroir_name
  `);
  return (result[0] as unknown) as any[];
}

export async function getSoilAnalysisByTerroir(terroir: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.execute(sql`
    SELECT * FROM soil_analyses WHERE terroir_name = ${terroir}
  `);
  const rows = (result[0] as unknown) as any[];
  return rows[0] || null;
}

export async function compareSoilAnalyses(terroir1: string, terroir2: string) {
  const db = await getDb();
  if (!db) return { terroir1: null, terroir2: null };
  
  const _result1 = await db.execute(sql`SELECT * FROM soil_analyses WHERE terroir_name = ${terroir1}`);
  const [result1] = (_result1[0] as unknown) as any[];
  const _result2 = await db.execute(sql`SELECT * FROM soil_analyses WHERE terroir_name = ${terroir2}`);
  const [result2] = (_result2[0] as unknown) as any[];
  
  return {
    terroir1: (result1 as any[])[0] || null,
    terroir2: (result2 as any[])[0] || null
  };
}


// --- Pyrolysis Transformations ---

export async function getPyrolysisTransformationsByMolecule(moleculeName: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM pyrolysis_transformations 
    WHERE source_molecule = ${moleculeName}
    ORDER BY temperature_range ASC
  `);
  return (result[0] as unknown) as any[];
}

export async function getPyrolysisTransformationsByProduct(productName: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM pyrolysis_transformations 
    WHERE product_molecule = ${productName}
    ORDER BY temperature_range ASC
  `);
  return (result[0] as unknown) as any[];
}

export async function getAllPyrolysisTransformations() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM pyrolysis_transformations ORDER BY source_molecule, temperature_range
  `);
  // mysql2 retourne [rows, fields] — on prend result[0] pour les lignes
  const rows = Array.isArray(result) && Array.isArray((result as any)[0])
    ? (result as any)[0]
    : (result[0] as unknown) as any[];
  return rows as any[];
}

export async function getTemperatureZones() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM temperature_zones ORDER BY temp_min ASC
  `);
  return (result[0] as unknown) as any[];
}

export async function getLandracePyrolysisProfiles() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT * FROM landrace_pyrolysis_profiles ORDER BY landrace_name
  `);
  return (result[0] as unknown) as any[];
}

export async function getLandracePyrolysisProfile(landraceName: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.execute(sql`
    SELECT * FROM landrace_pyrolysis_profiles WHERE landrace_name = ${landraceName}
  `);
  const rows = (result[0] as unknown) as any[];
  return rows[0] || null;
}


export async function getPlantFamiliesWithCategories(): Promise<{family: string; count: number; categories: { category: string; count: number }[]}[]> {
  const db = await getDb();
  if (!db) return [];
  const familyResult = await db.execute(sql`SELECT family, COUNT(*) as count FROM plants WHERE family IS NOT NULL AND family != '' GROUP BY family ORDER BY count DESC`);
  const families = (familyResult[0] as unknown as any[]).map((r: any) => ({family: r.family as string, count: Number(r.count)}));
  const results: {family: string; count: number; categories: { category: string; count: number }[]}[] = [];
  for (const { family, count } of families) {
    const familyVal = family;
    const catResult = await db.execute(sql`SELECT category, COUNT(*) as count FROM plants WHERE family = ${familyVal} GROUP BY category ORDER BY count DESC`);
    const categories = (catResult[0] as unknown as any[]).map((r: any) => ({category: r.category as string, count: Number(r.count)}));
    results.push({ family, count, categories });
  }
  return results;
}


// === SMILES et PubChem ===

export async function getMoleculesWithSmiles(params: {
  search?: string;
  chemicalClass?: string;
  limit?: number;
  offset?: number;
}): Promise<{ molecules: any[]; total: number }> {
  const db = await getDb();
  if (!db) return { molecules: [], total: 0 };
  
  const { search, chemicalClass, limit = 20, offset = 0 } = params;
  
  let whereClause = "WHERE (smiles IS NOT NULL AND smiles != '') OR pubchem_cid IS NOT NULL";
  const queryParams: any[] = [];
  
  if (search) {
    whereClause += " AND (name LIKE ? OR cas_number LIKE ? OR chemicalFormula LIKE ?)";
    const searchPattern = `%${search}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern);
  }
  
  if (chemicalClass) {
    whereClause += " AND chemical_class = ?";
    queryParams.push(chemicalClass);
  }
  
  // Count total
  const countQuery = `SELECT COUNT(*) as total FROM molecules ${whereClause}`;
  const _countResult = await (db as any).query(countQuery, queryParams);
  const countResult = _countResult[0];
  const total = Number((countResult as any[])[0]?.total || 0);
  
  // Get molecules
  const selectQuery = `
    SELECT id, name, smiles, pubchem_cid, chemicalFormula, molecularWeight, 
           cas_number, chemical_class, iupac_name, inchi, inchi_key
    FROM molecules 
    ${whereClause}
    ORDER BY name ASC
    LIMIT ? OFFSET ?
  `;
  const [molecules] = await (db as any).execute(selectQuery, [...queryParams, limit, offset]);
  
  return { molecules: molecules as any[], total };
}

export async function getChemicalClasses(): Promise<{ name: string; count: number }[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.execute(sql`
    SELECT chemical_class as name, COUNT(*) as count 
    FROM molecules 
    WHERE chemical_class IS NOT NULL AND chemical_class != ''
    GROUP BY chemical_class 
    ORDER BY count DESC
  `);
  
  return ((result[0] as unknown) as any[]).map(r => ({
    name: r.name as string,
    count: Number(r.count)
  }));
}

export async function getSmilesStats(): Promise<{
  total: number;
  withSmiles: number;
  withPubChem: number;
  withCas: number;
  withInchi: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, withSmiles: 0, withPubChem: 0, withCas: 0, withInchi: 0 };
  
  const result = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN smiles IS NOT NULL AND smiles != '' THEN 1 ELSE 0 END) as withSmiles,
      SUM(CASE WHEN pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as withPubChem,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as withCas,
      SUM(CASE WHEN inchi IS NOT NULL AND inchi != '' THEN 1 ELSE 0 END) as withInchi
    FROM molecules
  `);
  
  const row = (result[0] as unknown) as any[][0];
  return {
    total: Number(row?.total || 0),
    withSmiles: Number(row?.withSmiles || 0),
    withPubChem: Number(row?.withPubChem || 0),
    withCas: Number(row?.withCas || 0),
    withInchi: Number(row?.withInchi || 0)
  };
}


// === ENRICHISSEMENT PUBCHEM INDIVIDUEL (avec traduction FR→EN) ===

import { enrichMoleculeWithTranslation } from './pubchem';
import { enrichMoleculeWithTranslationChEBI } from './chebi';

export async function enrichMoleculeFromPubChemWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  data?: {
    pubchemCid: number;
    smiles?: string;
    casNumber?: string;
    iupacName?: string;
    molecularWeight?: number;
    molecularFormula?: string;
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule
  const [rows] = await (db as any).execute(
    'SELECT id, name, pubchem_cid FROM molecules WHERE id = ?',
    [moleculeId]
  );
  
  const molecules = rows as any[];
  if (molecules.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  
  const molecule = molecules[0];
  
  if (molecule.pubchem_cid) {
    return { success: false, message: 'Cette molécule est déjà enrichie via PubChem' };
  }
  
  // Enrichir via PubChem avec traduction
  const result = await enrichMoleculeWithTranslation(molecule.name);
  
  if (!result.success || !result.pubchemCID) {
    // Fallback vers ChEBI si PubChem échoue
    console.log(`[PubChem] Échec pour "${molecule.name}", tentative via ChEBI...`);
    const chebiResult = await enrichMoleculeWithTranslationChEBI(molecule.name);
    
    if (chebiResult.success && chebiResult.chebiId) {
      // Mettre à jour avec les données ChEBI
      await (db as any).execute(`
        UPDATE molecules SET
          chebi_id = ?,
          smiles = COALESCE(smiles, ?),
          inchi = COALESCE(inchi, ?),
          inchi_key = COALESCE(inchi_key, ?),
          chemicalFormula = COALESCE(chemicalFormula, ?),
          molecularWeight = COALESCE(molecularWeight, ?),
          chebi_enriched_at = NOW()
        WHERE id = ?
      `, [
        chebiResult.chebiId,
        chebiResult.smiles || null,
        chebiResult.inchi || null,
        chebiResult.inchiKey || null,
        chebiResult.formula || null,
        chebiResult.mass || null,
        moleculeId
      ]);
      
      return {
        success: true,
        message: `Molécule enrichie via ChEBI (fallback) - ID: ${chebiResult.chebiId}`,
        data: {
          pubchemCid: 0, // Pas de PubChem CID
          smiles: chebiResult.smiles,
          casNumber: undefined,
          iupacName: undefined,
          molecularWeight: chebiResult.mass,
          molecularFormula: chebiResult.formula
        }
      };
    }
    
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans PubChem ni ChEBI'
    };
  }
  
  // Mettre à jour la base de données
  await (db as any).execute(`
    UPDATE molecules SET
      pubchem_cid = ?,
      smiles = COALESCE(smiles, ?),
      inchi = COALESCE(inchi, ?),
      inchi_key = COALESCE(inchi_key, ?),
      cas_number = COALESCE(cas_number, ?),
      iupac_name = COALESCE(iupac_name, ?),
      chemicalFormula = COALESCE(chemicalFormula, ?),
      molecularWeight = COALESCE(molecularWeight, ?),
      pubchem_enriched_at = NOW()
    WHERE id = ?
  `, [
    result.pubchemCID,
    result.smiles || null,
    result.inchi || null,
    result.inchiKey || null,
    result.casNumber || null,
    result.iupacName || null,
    result.molecularFormula || null,
    result.molecularWeight || null,
    moleculeId
  ]);
  
  return {
    success: true,
    message: `Molécule enrichie avec succès (CID: ${result.pubchemCID})`,
    data: {
      pubchemCid: result.pubchemCID,
      smiles: result.smiles,
      casNumber: result.casNumber,
      iupacName: result.iupacName,
      molecularWeight: result.molecularWeight,
      molecularFormula: result.molecularFormula
    }
  };
}


// === STATISTIQUES ET LISTE DES MOLÉCULES POUR ENRICHISSEMENT ===

export async function getPubChemEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  unenriched: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, unenriched: 0 };
  
  const [totalResult] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules');
  const [enrichedResult] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules WHERE pubchem_cid IS NOT NULL');
  
  const total = (totalResult as any)[0]?.count || 0;
  const enriched = (enrichedResult as any)[0]?.count || 0;
  
  return {
    total,
    enriched,
    unenriched: total - enriched
  };
}

export async function getUnenrichedMolecules(limit: number = 50): Promise<Array<{ id: number; name: string }>> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    'SELECT id, name FROM molecules WHERE pubchem_cid IS NULL ORDER BY name LIMIT ?',
    [limit]
  );
  
  return rows as Array<{ id: number; name: string }>;
}


// === ENRICHISSEMENT ChEBI (Alternative à PubChem) ===

export async function enrichMoleculeFromChEBIWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  data?: {
    chebiId: string;
    smiles?: string;
    inchi?: string;
    formula?: string;
    mass?: number;
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule
  const [rows] = await (db as any).execute(
    'SELECT id, name, pubchem_cid, chebi_id FROM molecules WHERE id = ?',
    [moleculeId]
  );
  
  const molecules = rows as any[];
  if (molecules.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  
  const molecule = molecules[0];
  
  // Vérifier si déjà enrichie via PubChem ou ChEBI
  if (molecule.pubchem_cid) {
    return { success: false, message: 'Cette molécule est déjà enrichie via PubChem' };
  }
  
  if (molecule.chebi_id) {
    return { success: false, message: 'Cette molécule est déjà enrichie via ChEBI' };
  }
  
  // Enrichir via ChEBI
  const result = await enrichMoleculeWithTranslationChEBI(molecule.name);
  
  if (!result.success || !result.chebiId) {
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans ChEBI'
    };
  }
  
  // Mettre à jour la base de données
  await (db as any).execute(`
    UPDATE molecules SET
      chebi_id = ?,
      smiles = COALESCE(smiles, ?),
      inchi = COALESCE(inchi, ?),
      inchi_key = COALESCE(inchi_key, ?),
      chemicalFormula = COALESCE(chemicalFormula, ?),
      molecularWeight = COALESCE(molecularWeight, ?),
      updated_at = NOW()
    WHERE id = ?
  `, [
    result.chebiId,
    result.smiles || null,
    result.inchi || null,
    result.inchiKey || null,
    result.formula || null,
    result.mass || null,
    moleculeId
  ]);
  
  return {
    success: true,
    message: `Molécule enrichie via ChEBI (ID: ${result.chebiId})`,
    data: {
      chebiId: result.chebiId,
      smiles: result.smiles,
      inchi: result.inchi,
      formula: result.formula,
      mass: result.mass,
    }
  };
}

export async function getUnenrichedMoleculesForChEBI(limit: number = 50): Promise<Array<{ id: number; name: string }>> {
  const db = await getDb();
  if (!db) return [];
  
  // Molécules sans PubChem ET sans ChEBI
  const [rows] = await (db as any).execute(
    'SELECT id, name FROM molecules WHERE pubchem_cid IS NULL AND (chebi_id IS NULL OR chebi_id = "") ORDER BY name LIMIT ?',
    [limit]
  );
  
  return rows as Array<{ id: number; name: string }>;
}


// ============================================
// COCONUT Enrichment Functions
// ============================================

import { enrichMoleculeWithTranslationCOCONUT } from './coconut';

/**
 * Enrichit une molécule via COCONUT avec traduction FR→EN
 */
export async function enrichMoleculeFromCOCONUTWithTranslation(moleculeId: number): Promise<{
  success: boolean;
  message: string;
  data?: {
    coconutId: string;
    npLikenessScore?: number;
    organisms?: { name: string; rank?: string }[];
  };
}> {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database connection failed' };
  
  // Récupérer la molécule
  const [rows] = await (db as any).execute(
    'SELECT id, name, coconut_id FROM molecules WHERE id = ?',
    [moleculeId]
  );
  
  const molecules = rows as any[];
  if (molecules.length === 0) {
    return { success: false, message: 'Molécule non trouvée' };
  }
  
  const molecule = molecules[0];
  
  // Vérifier si déjà enrichie via COCONUT
  if (molecule.coconut_id) {
    return { success: false, message: 'Cette molécule est déjà enrichie via COCONUT' };
  }
  
  // Enrichir via COCONUT
  const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name);
  
  if (!result.success || !result.coconut_id) {
    return { 
      success: false, 
      message: result.error || 'Molécule non trouvée dans COCONUT'
    };
  }
  
  // Mettre à jour la base de données
  await (db as any).execute(
    `UPDATE molecules SET 
      coconut_id = ?,
      np_likeness_score = ?,
      coconut_organisms = ?,
      coconut_citations = ?,
      coconut_enriched_at = NOW()
    WHERE id = ?`,
    [
      result.coconut_id,
      result.np_likeness_score || null,
      result.organisms ? JSON.stringify(result.organisms) : null,
      result.citations ? JSON.stringify(result.citations) : null,
      moleculeId
    ]
  );
  
  return {
    success: true,
    message: 'Molécule enrichie via COCONUT: ' + result.name,
    data: {
      coconutId: result.coconut_id,
      npLikenessScore: result.np_likeness_score,
      organisms: result.organisms,
    }
  };
}

/**
 * Récupère les molécules non enrichies pour COCONUT
 */
export async function getUnenrichedMoleculesForCOCONUT(limit: number = 50): Promise<{
  id: number;
  name: string;
  hasPubChem: boolean;
  hasChEBI: boolean;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    'SELECT id, name, pubchem_cid IS NOT NULL as hasPubChem, chebi_id IS NOT NULL as hasChEBI FROM molecules WHERE coconut_id IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
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
  
  const [rows] = await (db as any).execute(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN coconut_id IS NOT NULL THEN 1 ELSE 0 END) as enriched,
      SUM(CASE WHEN coconut_organisms IS NOT NULL AND coconut_organisms != '[]' THEN 1 ELSE 0 END) as withOrganisms
    FROM molecules`
  );
  
  const stats = (rows as any[])[0];
  return {
    total: stats.total || 0,
    enriched: stats.enriched || 0,
    percentage: stats.total > 0 ? Math.round((stats.enriched / stats.total) * 100) : 0,
    withOrganisms: stats.withOrganisms || 0,
  };
}


// ============================================================================
// IFRA ENRICHMENT FUNCTIONS
// ============================================================================

import type { IFRAData } from './ifra';

/**
 * Update molecule with IFRA regulatory data
 */
export async function updateMoleculeIFRAData(moleculeId: number, ifraData: IFRAData): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const query = "UPDATE molecules SET ifra_status = '" + ifraData.status + "', ifra_data = '" + JSON.stringify(ifraData).replace(/'/g, "''") + "', ifra_enriched_at = NOW() WHERE id = " + moleculeId;
  await (db as any).execute(query);
}

/**
 * Get molecules by IFRA status
 */
export async function getMoleculesByIFRAStatus(
  status: 'not_regulated' | 'banned' | 'restricted' | 'specification_required',
  limit: number = 50,
  offset: number = 0
): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
  ifraStatus: string;
  ifraData: any;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    "SELECT id, name, cas_number as casNumber, ifra_status as ifraStatus, ifra_data as ifraData FROM molecules WHERE ifra_status = '" + status + "' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    casNumber: r.casNumber,
    ifraStatus: r.ifraStatus,
    ifraData: r.ifraData ? (typeof r.ifraData === 'string' ? JSON.parse(r.ifraData) : r.ifraData) : null,
  }));
}

/**
 * Get molecules that need IFRA enrichment
 */
export async function getUnenrichedMoleculesForIFRA(limit: number = 50): Promise<{
  id: number;
  name: string;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const [rows] = await (db as any).execute(
    'SELECT id, name, cas_number as casNumber FROM molecules WHERE ifra_enriched_at IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    casNumber: r.casNumber,
  }));
}

/**
 * Get IFRA enrichment statistics
 */
export async function getIFRAEnrichmentStats(): Promise<{
  total: number;
  enriched: number;
  percentage: number;
  banned: number;
  restricted: number;
  specRequired: number;
  notRegulated: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, enriched: 0, percentage: 0, banned: 0, restricted: 0, specRequired: 0, notRegulated: 0 };
  
  const [rows] = await (db as any).execute(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN ifra_enriched_at IS NOT NULL THEN 1 ELSE 0 END) as enriched,
      SUM(CASE WHEN ifra_status = 'banned' THEN 1 ELSE 0 END) as banned,
      SUM(CASE WHEN ifra_status = 'restricted' THEN 1 ELSE 0 END) as restricted,
      SUM(CASE WHEN ifra_status = 'specification_required' THEN 1 ELSE 0 END) as specRequired,
      SUM(CASE WHEN ifra_status = 'not_regulated' AND ifra_enriched_at IS NOT NULL THEN 1 ELSE 0 END) as notRegulated
    FROM molecules`
  );
  
  const stats = (rows as any[])[0];
  return {
    total: stats.total || 0,
    enriched: stats.enriched || 0,
    percentage: stats.total > 0 ? Math.round((stats.enriched / stats.total) * 100) : 0,
    banned: stats.banned || 0,
    restricted: stats.restricted || 0,
    specRequired: stats.specRequired || 0,
    notRegulated: stats.notRegulated || 0,
  };
}


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
  
  const organismsJson = data.organisms ? JSON.stringify(data.organisms).replace(/'/g, "''") : null;
  const citationsJson = data.citations ? JSON.stringify(data.citations).replace(/'/g, "''") : null;
  
  const query = "UPDATE molecules SET coconut_id = '" + data.coconutId + "'" +
    (data.npLikenessScore !== undefined ? ", np_likeness_score = " + data.npLikenessScore : "") +
    (organismsJson ? ", coconut_organisms = '" + organismsJson + "'" : "") +
    (citationsJson ? ", coconut_citations = '" + citationsJson + "'" : "") +
    ", coconut_enriched_at = NOW() WHERE id = " + moleculeId;
  
  await (db as any).execute(query);
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
  
  const [rows] = await (db as any).execute(
    "SELECT id, name, coconut_id as coconutId, np_likeness_score as npLikenessScore, coconut_organisms as organisms FROM molecules WHERE coconut_organisms IS NOT NULL AND coconut_organisms != '[]' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    coconutId: r.coconutId,
    npLikenessScore: r.npLikenessScore,
    organisms: r.organisms ? (typeof r.organisms === 'string' ? JSON.parse(r.organisms) : r.organisms) : [],
  }));
}


// ============================================================================
// FLAVORNET ENRICHMENT FUNCTIONS
// ============================================================================

import type { FlavornetData } from './flavornet';

/**
 * Update molecule with Flavornet olfactory data
 */
export async function updateMoleculeFlavornetData(moleculeId: number, data: FlavornetData): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const perceptsJson = JSON.stringify(data.percepts).replace(/'/g, "''");
  const kovatsJson = data.kovatsRI ? JSON.stringify(data.kovatsRI).replace(/'/g, "''") : null;
  
  const query = "UPDATE molecules SET flavornet_percepts = '" + perceptsJson + "'" +
    (kovatsJson ? ", flavornet_kovats_ri = '" + kovatsJson + "'" : "") +
    ", flavornet_enriched_at = NOW() WHERE id = " + moleculeId;
  
  await (db as any).execute(query);
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
  
  const [rows] = await (db as any).execute(
    'SELECT id, name, cas_number as casNumber FROM molecules WHERE flavornet_percepts IS NULL ORDER BY name ASC LIMIT ' + limit
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    casNumber: r.casNumber,
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
  
  const [rows] = await (db as any).execute(
    "SELECT id, name, flavornet_percepts as percepts, flavornet_kovats_ri as kovatsRI FROM molecules WHERE flavornet_percepts IS NOT NULL AND flavornet_percepts != '[]' ORDER BY name ASC LIMIT " + limit + " OFFSET " + offset
  );
  
  return (rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    percepts: r.percepts ? (typeof r.percepts === 'string' ? JSON.parse(r.percepts) : r.percepts) : [],
    kovatsRI: r.kovatsRI ? (typeof r.kovatsRI === 'string' ? JSON.parse(r.kovatsRI) : r.kovatsRI) : null,
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
  
  const [totalRows] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules');
  const total = (totalRows as any[])[0]?.count || 0;
  
  const [enrichedRows] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules WHERE flavornet_percepts IS NOT NULL');
  const enriched = (enrichedRows as any[])[0]?.count || 0;
  
  const [perceptsRows] = await (db as any).execute("SELECT COUNT(*) as count FROM molecules WHERE flavornet_percepts IS NOT NULL AND flavornet_percepts != '[]'");
  const withPercepts = (perceptsRows as any[])[0]?.count || 0;
  
  const [kovatsRows] = await (db as any).execute('SELECT COUNT(*) as count FROM molecules WHERE flavornet_kovats_ri IS NOT NULL');
  const withKovatsRI = (kovatsRows as any[])[0]?.count || 0;
  
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
export async function searchMoleculesByName(name: string): Promise<{
  id: number;
  name: string;
  chemicalFormula: string | null;
  olfactiveFamily: string | null;
  chemicalClass: string | null;
  casNumber: string | null;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchTerm = `%${name.toLowerCase()}%`;
  
  const results = await db.select()
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) LIKE ${searchTerm}`)
    .orderBy(molecules.name)
    .limit(50);
  
  return results.map(m => ({
    id: m.id,
    name: m.name,
    chemicalFormula: m.chemicalFormula,
    olfactiveFamily: m.family,
    chemicalClass: m.chemicalClass,
    casNumber: m.casNumber,
  }));
}


// Note: utiliser getDb() pour obtenir l'instance drizzle

// ============================================================================
// MOLECULE PERFUMES — Parfums emblématiques
// ============================================================================

export async function getMoleculePerfumes(moleculeId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await (db as any).execute(sql.raw(
    `SELECT
       mp.id,
       mp.perfume_name AS perfumeName,
       mp.perfume_house AS perfumeHouse,
       mp.perfumer,
       mp.year,
       mp.role_in_perfume AS roleInPerfume,
       mp.concentration,
       mp.description
     FROM molecule_perfumes mp
     WHERE mp.molecule_id = ${moleculeId}
     ORDER BY mp.year ASC`
  ));
  const rows: any[] = (result[0] as unknown) as any[];
  return rows.map((r: any) => ({
    id: r.id as number,
    perfumeName: r.perfumeName as string,
    perfumeHouse: r.perfumeHouse as string,
    perfumer: r.perfumer as string | null,
    year: r.year as number | null,
    roleInPerfume: r.roleInPerfume as string,
    concentration: r.concentration as string | null,
    description: r.description as string | null,
  }));
}

// Get all molecule-perfume links for the /parfums page (navigation inverse)
export async function getAllMoleculePerfumeLinks(): Promise<Array<{
  moleculeId: number;
  moleculeName: string;
  perfumeName: string;
  perfumeHouse: string;
  perfumer: string | null;
  year: number | null;
  roleInPerfume: string;
  concentration: string | null;
  description: string | null;
}>> {
  try {
    const db = await getDb();
    if (!db) return [];
    const result = await (db as any).execute(sql.raw(
      `SELECT
         mp.molecule_id       AS moleculeId,
         m.name               AS moleculeName,
         mp.perfume_name      AS perfumeName,
         mp.perfume_house     AS perfumeHouse,
         mp.perfumer          AS perfumer,
         mp.year              AS year,
         mp.role_in_perfume   AS roleInPerfume,
         mp.concentration     AS concentration,
         mp.description       AS description
       FROM molecule_perfumes mp
       JOIN molecules m ON m.id = mp.molecule_id
       ORDER BY mp.perfume_house, mp.perfume_name, mp.role_in_perfume`
    ));
    const rows: any[] = (result[0] as unknown) as any[];
    return rows.map((r: any) => ({
      moleculeId: Number(r.moleculeId),
      moleculeName: r.moleculeName as string,
      perfumeName: r.perfumeName as string,
      perfumeHouse: r.perfumeHouse as string,
      perfumer: r.perfumer as string | null,
      year: r.year ? Number(r.year) : null,
      roleInPerfume: r.roleInPerfume as string,
      concentration: r.concentration as string | null,
      description: r.description as string | null,
    }));
  } catch (error: any) {
    console.error('Error getting all molecule-perfume links:', error);
    return [];
  }
}

// ─── Parfums emblématiques d'une plante ──────────────────────────────────────
export async function getPlantPerfumes(plantId: number) {
  try {
    const dbConn = await getDb();
    if (!dbConn) return [];
    const mysql = await import('mysql2/promise');
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute(
      `SELECT id, plant_id, perfume_name, perfume_house, perfumer, year,
              role_in_perfume, ingredient_type, description, created_at
       FROM plant_perfumes
       WHERE plant_id = ?
       ORDER BY year ASC, perfume_name ASC`,
      [plantId]
    );
    await conn.end();
    return rows as any[];
  } catch (error: any) {
    console.error('Error getting plant perfumes:', error);
    return [];
  }
}
