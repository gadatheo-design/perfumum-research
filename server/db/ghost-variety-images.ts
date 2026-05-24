/**
 * Extracted from server/db/misc.ts
 * Module: Ghost Variety Images
 */
import { db } from "../_core/db";
import { getDb } from "./core";
import { eq, and, or, desc, asc, sql, like, inArray, isNull, isNotNull, count, SQL, between, ne, gt, lt, gte, lte, notInArray, exists } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

const { GhostVarietyImage, InsertGhostVarietyImage, ghostVarieties, ghostVarietyImages, ghostVarietyMoleculeLinks, ghostVarietyPlantLinks, molecules, plants } = schema;



// ====================================================================
// GHOST VARIETY IMAGES (Images des variétés fantômes)
// ====================================================================
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



