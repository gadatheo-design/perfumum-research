import { eq, and, or, like, isNull, sql, desc, asc } from "drizzle-orm";
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
  // moleculeRecettes supprimé (doublon, voir moleculesRecettes ligne 45),
  Prototype,
  Family,
  Tabac,
  Molecule,
  Accord,
  Recette,
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
  moleculesRecettes,
  userNotes,
  TerpeneSynergy,
  sharedCollections,
  moleculeNotes,
  citations,
  recetteMolecules,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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

export async function getRecettesByCategory(category: "tabac" | "resine" | "cone" | "parfum" | "encens" | "extrait"): Promise<Recette[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recettes).where(eq(recettes.category, category));
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

export async function globalSearch(query: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const searchTerm = `%${query}%`;
  
  // Search in prototypes
  const prototypeResults = await db
    .select({
      id: prototypes.id,
      type: sql<string>`'prototype'`,
      title: prototypes.name,
      subtitle: prototypes.code,
      description: prototypes.conceptualAxis,
    })
    .from(prototypes)
    .where(
      sql`${prototypes.name} LIKE ${searchTerm} OR ${prototypes.code} LIKE ${searchTerm} OR ${prototypes.conceptualAxis} LIKE ${searchTerm}`
    )
    .limit(10);

  // Search in molecules
  const moleculeResults = await db
    .select({
      id: molecules.id,
      type: sql<string>`'molecule'`,
      title: molecules.name,
      subtitle: molecules.family,
      description: molecules.olfactiveProfile,
    })
    .from(molecules)
    .where(
      sql`${molecules.name} LIKE ${searchTerm} OR ${molecules.family} LIKE ${searchTerm} OR ${molecules.olfactiveProfile} LIKE ${searchTerm}`
    )
    .limit(10);

  // Search in recipes
  const recipeResults = await db
    .select({
      id: recettes.id,
      type: sql<string>`'recipe'`,
      title: recettes.name,
      subtitle: recettes.category,
      description: sql<string | null>`${recettes.formula}`,
    })
    .from(recettes)
    .where(
      sql`${recettes.name} LIKE ${searchTerm} OR ${recettes.category} LIKE ${searchTerm} OR ${recettes.formula} LIKE ${searchTerm}`
    )
    .limit(10);

  // Search in glossary
  const glossaryResults = await db
    .select({
      id: glossary.id,
      type: sql<string>`'glossary'`,
      title: glossary.term,
      subtitle: glossary.category,
      description: glossary.definition,
    })
    .from(glossary)
    .where(
      sql`${glossary.term} LIKE ${searchTerm} OR ${glossary.definition} LIKE ${searchTerm}`
    )
    .limit(10);

  // Search in timeline
  const timelineResults = await db
    .select({
      id: researchTimeline.id,
      type: sql<string>`'timeline'`,
      title: researchTimeline.title,
      subtitle: researchTimeline.category,
      description: researchTimeline.description,
    })
    .from(researchTimeline)
    .where(
      sql`${researchTimeline.title} LIKE ${searchTerm} OR ${researchTimeline.description} LIKE ${searchTerm}`
    )
    .limit(10);

  // Search in experimental accords
  const accordResults = await db
    .select({
      id: experimentalAccords.id,
      type: sql<string>`'accord'`,
      title: experimentalAccords.intention,
      subtitle: sql<string>`CASE WHEN ${experimentalAccords.isExtreme} = 1 THEN 'Extrême' ELSE 'Standard' END`,
      description: experimentalAccords.baseTabac,
    })
    .from(experimentalAccords)
    .where(
      sql`${experimentalAccords.intention} LIKE ${searchTerm} OR ${experimentalAccords.baseTabac} LIKE ${searchTerm}`
    )
    .limit(10);

  return {
    prototypes: prototypeResults,
    molecules: moleculeResults,
    recipes: recipeResults,
    glossary: glossaryResults,
    timeline: timelineResults,
    accords: accordResults,
    total: prototypeResults.length + moleculeResults.length + recipeResults.length + 
           glossaryResults.length + timelineResults.length + accordResults.length,
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
  
  // Get related recettes via molecule_recettes avec proportions
  const relatedRecettes = await db
    .select({
      recetteId: recettes.id,
      recetteName: recettes.name,
      formula: recettes.formula,
      proportion: moleculesRecettes.proportion,
      notes: moleculesRecettes.notes,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, id))
    .orderBy(desc(moleculesRecettes.proportion));
  
  return {
    ...mol,
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
  
  // Get related molecules via molecule_recettes
  const relatedMolecules = await db
    .select({
      id: molecules.id,
      name: molecules.name,
      chemicalFormula: molecules.chemicalFormula,
      family: molecules.family,
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
      proportion: recetteMolecules.proportion,
      role: recetteMolecules.role,
    })
    .from(recetteMolecules)
    .innerJoin(molecules, eq(recetteMolecules.moleculeId, molecules.id))
    .where(eq(recetteMolecules.recetteId, recetteId));
  
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
          proportion: recetteMolecules.proportion,
          role: recetteMolecules.role,
        })
        .from(recetteMolecules)
        .innerJoin(molecules, eq(recetteMolecules.moleculeId, molecules.id))
        .where(eq(recetteMolecules.recetteId, recette.id));
      
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
  if (!db) return { recettesCount: 0, accordsCount: 0, recettes: [] };

  // Compter recettes utilisant cette molécule
  const recettesCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(moleculesRecettes)
    .where(eq(moleculesRecettes.moleculeId, moleculeId));

  // Récupérer détails recettes avec proportions
  const recettesDetails = await db
    .select({
      recetteId: moleculesRecettes.recetteId,
      recetteName: recettes.name,
      proportion: moleculesRecettes.proportion,
      notes: moleculesRecettes.notes,
    })
    .from(moleculesRecettes)
    .innerJoin(recettes, eq(moleculesRecettes.recetteId, recettes.id))
    .where(eq(moleculesRecettes.moleculeId, moleculeId))
    .orderBy(desc(moleculesRecettes.proportion));

  return {
    recettesCount: Number(recettesCount[0]?.count || 0),
    accordsCount: 0, // TODO: implémenter quand table accords sera disponible
    recettes: recettesDetails,
  };
}
