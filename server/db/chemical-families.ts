/**
 * Extracted from server/db/misc.ts
 * Module: Chemical Families
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { chemicalFamilies, moleculeChemicalFamilies, molecules } = schema;


// Récupérer toutes les familles chimiques de la table dédiée
// ====================================================================
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
    type: data.type as ChemicalFamily['type'],
    subcategory: data.subcategory || null,
    description: data.description || null,
    olfactiveRole: data.olfactiveRole || null,
    volatility: data.volatility || null,
    polarity: data.polarity || null,
    molecularWeightRange: data.molecularWeightRange || null,
    typicalNotes: data.typicalNotes || null,
    exampleMolecules: data.exampleMolecules || null,
  });
  
  return { id: Number(result[0].insertId), ...data };
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
  
  const updateData: Partial<InsertChemicalFamily> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type as ChemicalFamily['type'];
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



