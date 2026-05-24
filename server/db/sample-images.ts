/**
 * Extracted from server/db/misc.ts
 * Module: Sample Images
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { sampleImages } = schema;



// ====================================================================
// SAMPLE IMAGES FUNCTIONS (Galerie d'images)
// ====================================================================
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
    .where(sql`${sampleImages.category} = ${category}`)
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
 * Réordonne les images (drag-and-drop)
 */
export async function reorderSampleImages(items: Array<{ id: number; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error('Database not initialized');
  for (const item of items) {
    await db.update(sampleImages).set({ sortOrder: item.sortOrder }).where(eq(sampleImages.id, item.id));
  }
  return { success: true, updated: items.length };
}

/**
 * Recherche des images par tags

export async function reorderSampleImages(items: Array<{ id: number; sortOrder: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  for (const item of items) {
    await db.update(sampleImages).set({ sortOrder: item.sortOrder }).where(eq(sampleImages.id, item.id));
  }
  return { success: true, updated: items.length };
}
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



