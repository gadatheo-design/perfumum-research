/**
 * Extracted from server/db/misc.ts
 * Module: Leaf Economies Db
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { leafEconomies } = schema;



// ====================================================================
// LEAF ECONOMIES (San Andrés / Seaflower Research)
// ====================================================================
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



