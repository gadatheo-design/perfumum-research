import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
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
  researchTimeline,
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
