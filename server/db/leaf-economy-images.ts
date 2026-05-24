/**
 * Extracted from server/db/misc.ts
 * Module: Leaf Economy Images
 */
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";
import { getLeafEconomyById } from "./leaf-economies-db";

const { leafEconomies } = schema;



// ====================================================================
// LEAF ECONOMY IMAGE MANAGEMENT
// ====================================================================
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



