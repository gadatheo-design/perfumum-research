/**
 * Extracted from server/db/misc.ts
 * Module: Modification History
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { modificationHistory } = schema;



// ====================================================================
// HISTORIQUE DES MODIFICATIONS
// ====================================================================
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
  stateBefore: unknown,
  stateAfter: unknown,
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



// ====================================================================
// FONCTIONS CREATE MANQUANTES (pour undo history)
// ====================================================================
// ============================================================================
// FONCTIONS CREATE MANQUANTES (pour undo history)
// ============================================================================

export async function createAccord(data: Record<string, unknown>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(accords).values({
    name: String(data.nom ?? data.name ?? ''),
    familyId: (data.familleId ?? data.familyId ?? null) as number | null,
    olfactiveProfile: (data.olfactiveProfile ?? data.description ?? null) as string | null,
    notes: (data.notes ?? null) as string | null,
  });
  
  return result;
}

export async function createFamily(data: Record<string, unknown>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const validTypes = ['perfumeum12', 'biomineralis', 'petrichor', 'volcanique', 'solarmineralis', 'necrogeo', 'other'] as const;
  const rawType = String(data.type ?? 'other');
  const familyType = (validTypes.includes(rawType as typeof validTypes[number]) ? rawType : 'other') as typeof validTypes[number];
  const result = await db.insert(families).values({
    name: String(data.nom ?? data.name ?? ''),
    type: familyType,
    description: (data.description ?? null) as string | null,
  });
  
  return result;
}



