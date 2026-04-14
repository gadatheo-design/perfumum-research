/**
 * variety-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for managing morphological images of plant varieties
 * v2: + plantId linking, terroirId linking, geographic filtering
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { varietyImages, plants, terroirs } from "../../drizzle/schema";
import { eq, and, like, or, isNotNull } from "drizzle-orm";
import { storagePut } from "../storage";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function generateImageKey(genus: string, species: string, imageType: string, fileName: string): string {
  const ts = Date.now();
  const rnd = Math.random().toString(36).substring(2, 8);
  const ext = fileName.split(".").pop() || "jpg";
  return `variety-images/${genus.toLowerCase()}-${species.toLowerCase()}-${imageType}-${ts}-${rnd}.${ext}`;
}

function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
  return db;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const varietyImagesRouter = router({

  // ── Search plants for autocomplete (used in upload form) ──────────────────
  searchPlants: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(100),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const q = `%${input.query}%`;
      const results = await db
        .select({
          id: plants.id,
          name: plants.name,
          latinName: plants.latinName,
          family: plants.family,
        })
        .from(plants)
        .where(
          or(
            like(plants.name, q),
            like(plants.latinName, q),
          )
        )
        .limit(input.limit);
      return results;
    }),

  // ── Search terroirs for autocomplete (used in upload form & filter) ────────
  searchTerroirs: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      if (input.query && input.query.length > 0) {
        const q = `%${input.query}%`;
        return db
          .select({
            id: terroirs.id,
            name: terroirs.name,
            country: terroirs.country,
            region: terroirs.region,
          })
          .from(terroirs)
          .where(
            or(
              like(terroirs.name, q),
              like(terroirs.country, q),
              like(terroirs.region, q),
            )
          )
          .limit(input.limit);
      }
      return db
        .select({
          id: terroirs.id,
          name: terroirs.name,
          country: terroirs.country,
          region: terroirs.region,
        })
        .from(terroirs)
        .limit(input.limit);
    }),

  // ── Get all terroirs that have at least one image ─────────────────────────
  getTerroirsWithImages: publicProcedure.query(async () => {
    const db = await requireDb();
    const imgs = await db
      .select({ terroirId: varietyImages.terroirId, terroirName: varietyImages.terroirName })
      .from(varietyImages)
      .where(isNotNull(varietyImages.terroirId));

    // Deduplicate
    const seen = new Map<number, string>();
    for (const img of imgs) {
      if (img.terroirId !== null && img.terroirId !== undefined && !seen.has(img.terroirId)) {
        seen.set(img.terroirId, img.terroirName || `Terroir #${img.terroirId}`);
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }),

  // ── Upload single image ───────────────────────────────────────────────────
  upload: protectedProcedure
    .input(z.object({
      genus: z.string().min(1).max(100),
      species: z.string().min(1).max(100),
      cultivar: z.string().max(255).optional(),
      imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]),
      fileData: z.string(),
      fileName: z.string().min(1).max(255),
      mimeType: z.string().min(1).max(50),
      description: z.string().optional(),
      source: z.string().max(255).optional(),
      sourceUrl: z.string().url().optional(),
      attribution: z.string().max(255).optional(),
      plantId: z.number().optional(),
      terroirId: z.number().optional(),
      terroirName: z.string().max(255).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can upload images" });
      }
      const db = await requireDb();
      const fileKey = generateImageKey(input.genus, input.species, input.imageType, input.fileName);
      const fileBuffer = base64ToBuffer(input.fileData);
      const { url } = await storagePut(fileKey, fileBuffer, input.mimeType);
      const insertResult = await db.insert(varietyImages).values({
        genus: input.genus,
        species: input.species,
        cultivar: input.cultivar,
        imageType: input.imageType,
        fileKey,
        fileUrl: url,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: fileBuffer.length,
        description: input.description,
        source: input.source,
        sourceUrl: input.sourceUrl,
        attribution: input.attribution,
        uploadedBy: ctx.user.id,
        isVerified: false,
        plantId: input.plantId ?? null,
        terroirId: input.terroirId ?? null,
        terroirName: input.terroirName ?? null,
      } as any).$returningId();
      return { id: insertResult[0].id, fileUrl: url, isVerified: false };
    }),

  // ── Get by variety ────────────────────────────────────────────────────────
  getByVariety: publicProcedure
    .input(z.object({
      genus: z.string(),
      species: z.string(),
      cultivar: z.string().optional(),
      imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const conditions = [
        eq(varietyImages.genus, input.genus),
        eq(varietyImages.species, input.species),
        eq(varietyImages.isVerified, true),
      ];
      if (input.cultivar) conditions.push(eq(varietyImages.cultivar, input.cultivar));
      if (input.imageType) conditions.push(eq(varietyImages.imageType, input.imageType));
      return db.select().from(varietyImages).where(and(...conditions));
    }),

  // ── Get by plantId ────────────────────────────────────────────────────────
  getByPlantId: publicProcedure
    .input(z.object({
      plantId: z.number(),
      imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const conditions: any[] = [eq(varietyImages.plantId as any, input.plantId)];
      if (input.imageType) conditions.push(eq(varietyImages.imageType, input.imageType));
      return db.select().from(varietyImages).where(and(...conditions));
    }),

  // ── Get all (admin gallery) ───────────────────────────────────────────────
  getAll: publicProcedure
    .input(z.object({
      genus: z.string().optional(),
      species: z.string().optional(),
      imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
      isVerified: z.boolean().optional(),
      plantId: z.number().optional(),
      terroirId: z.number().optional(),
      limit: z.number().min(1).max(1000).default(500),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const conditions: any[] = [];
      if (input.genus) conditions.push(eq(varietyImages.genus, input.genus));
      if (input.species) conditions.push(eq(varietyImages.species, input.species));
      if (input.imageType) conditions.push(eq(varietyImages.imageType, input.imageType));
      if (input.isVerified !== undefined) conditions.push(eq(varietyImages.isVerified, input.isVerified));
      if (input.plantId !== undefined) conditions.push(eq(varietyImages.plantId as any, input.plantId));
      if (input.terroirId !== undefined) conditions.push(eq(varietyImages.terroirId as any, input.terroirId));
      return db.select().from(varietyImages)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(input.limit)
        .offset(input.offset);
    }),

  // ── Get by ID ─────────────────────────────────────────────────────────────
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const images = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      if (!images.length) throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      return images[0];
    }),

  // ── Update metadata ───────────────────────────────────────────────────────
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      description: z.string().optional(),
      source: z.string().max(255).optional(),
      sourceUrl: z.string().url().optional(),
      attribution: z.string().max(255).optional(),
      quality: z.enum(["low", "medium", "high", "excellent"]).optional(),
      plantId: z.number().nullable().optional(),
      terroirId: z.number().nullable().optional(),
      terroirName: z.string().max(255).nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const images = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      if (!images.length) throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      if (images[0].uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only update your own images" });
      }
      const updateData: any = { updatedAt: new Date() };
      if (input.description !== undefined) updateData.description = input.description;
      if (input.source !== undefined) updateData.source = input.source;
      if (input.sourceUrl !== undefined) updateData.sourceUrl = input.sourceUrl;
      if (input.attribution !== undefined) updateData.attribution = input.attribution;
      if (input.quality !== undefined) updateData.quality = input.quality;
      if (input.plantId !== undefined) updateData.plantId = input.plantId;
      if (input.terroirId !== undefined) updateData.terroirId = input.terroirId;
      if (input.terroirName !== undefined) updateData.terroirName = input.terroirName;
      await db.update(varietyImages).set(updateData).where(eq(varietyImages.id, input.id));
      const updated = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      return updated[0];
    }),

  // ── Verify ────────────────────────────────────────────────────────────────
  verify: protectedProcedure
    .input(z.object({ id: z.number(), isVerified: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can verify images" });
      }
      const db = await requireDb();
      await db.update(varietyImages).set({
        isVerified: input.isVerified,
        verifiedBy: input.isVerified ? ctx.user.id : null,
        verifiedAt: input.isVerified ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(varietyImages.id, input.id));
      const verified = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      return verified[0];
    }),

  // ── Delete ────────────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const images = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      if (!images.length) throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      if (images[0].uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only delete your own images" });
      }
      await db.delete(varietyImages).where(eq(varietyImages.id, input.id));
      return { success: true };
    }),

  // ── Batch upload ──────────────────────────────────────────────────────────
  batchUpload: protectedProcedure
    .input(z.object({
      genus: z.string().min(1).max(100),
      species: z.string().min(1).max(100),
      cultivar: z.string().max(255).optional(),
      imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
      source: z.string().max(255).optional(),
      attribution: z.string().max(255).optional(),
      autoVerify: z.boolean().optional().default(false),
      plantId: z.number().optional(),
      terroirId: z.number().optional(),
      terroirName: z.string().max(255).optional(),
      files: z.array(z.object({
        fileData: z.string(),
        fileName: z.string().min(1).max(255),
        mimeType: z.string().min(1).max(50),
        description: z.string().optional(),
        imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
      })).min(1).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can upload images" });
      }
      const db = await requireDb();
      const results: { index: number; id: number; fileUrl: string; fileName: string; success: boolean; error?: string }[] = [];
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const effectiveType = file.imageType || input.imageType || "other";
        try {
          const fileKey = generateImageKey(input.genus, input.species, effectiveType, file.fileName);
          const fileBuffer = base64ToBuffer(file.fileData);
          const { url } = await storagePut(fileKey, fileBuffer, file.mimeType);
          const insertResult = await db.insert(varietyImages).values({
            genus: input.genus,
            species: input.species,
            cultivar: input.cultivar,
            imageType: effectiveType as "leaf" | "flower" | "fruit" | "whole_plant" | "other",
            fileKey,
            fileUrl: url,
            fileName: file.fileName,
            mimeType: file.mimeType,
            fileSize: fileBuffer.length,
            description: file.description,
            source: input.source,
            attribution: input.attribution,
            uploadedBy: ctx.user.id,
            isVerified: input.autoVerify === true,
            verifiedBy: input.autoVerify ? ctx.user.id : null,
            verifiedAt: input.autoVerify ? new Date() : null,
            plantId: input.plantId ?? null,
            terroirId: input.terroirId ?? null,
            terroirName: input.terroirName ?? null,
          } as any).$returningId();
          results.push({ index: i, id: insertResult[0].id, fileUrl: url, fileName: file.fileName, success: true });
        } catch (err) {
          results.push({ index: i, id: -1, fileUrl: "", fileName: file.fileName, success: false, error: err instanceof Error ? err.message : "Unknown error" });
        }
      }
      return {
        results,
        total: input.files.length,
        succeeded: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      };
    }),

  // ── Reorder ───────────────────────────────────────────────────────────────
  reorderImages: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        id: z.number(),
        sortOrder: z.number(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can reorder images" });
      }
      const db = await requireDb();
      for (const item of input.items) {
        await db
          .update(varietyImages)
          .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
          .where(eq(varietyImages.id, item.id));
      }
      return { success: true, updated: input.items.length };
    }),

  // ── Update plant link ────────────────────────────────────────────────────────
  updateImagePlant: protectedProcedure
    .input(z.object({
      imageId: z.number(),
      plantId: z.number().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can link images to plants" });
      }
      const db = await requireDb();
      const image = await db.select().from(varietyImages).where(eq(varietyImages.id, input.imageId));
      if (!image.length) throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      await db
        .update(varietyImages)
        .set({ plantId: input.plantId, updatedAt: new Date() })
        .where(eq(varietyImages.id, input.imageId));
      return { success: true, imageId: input.imageId, plantId: input.plantId };
    }),

  // ── Bulk link images to plant ────────────────────────────────────────────────
  bulkLinkPlants: protectedProcedure
    .input(z.object({
      imageIds: z.array(z.number()).min(1),
      plantId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can link images to plants" });
      }
      const db = await requireDb();
      const results = { succeeded: 0, failed: 0, errors: [] as string[] };
      for (const imageId of input.imageIds) {
        try {
          const image = await db.select().from(varietyImages).where(eq(varietyImages.id, imageId));
          if (!image.length) {
            results.failed++;
            results.errors.push(`Image ${imageId} not found`);
            continue;
          }
          await db
            .update(varietyImages)
            .set({ plantId: input.plantId, updatedAt: new Date() })
            .where(eq(varietyImages.id, imageId));
          results.succeeded++;
        } catch (err) {
          results.failed++;
          results.errors.push(err instanceof Error ? err.message : `Error linking image ${imageId}`);
        }
      }
      return { success: results.failed === 0, ...results, total: input.imageIds.length };
    }),

  // ── Find terroir by coordinates (for iNaturalist import) ─────────────────
  findTerroirByCoordinates: publicProcedure
    .input(z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      maxDistanceKm: z.number().min(1).max(500).default(100),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const allTerroirs = await db.select().from(terroirs);
      
      // Haversine distance calculation
      function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      }
      
      const results = allTerroirs
        .map(t => ({
          ...t,
          distanceKm: distance(input.latitude, input.longitude, 
                              t.latitude || 0, t.longitude || 0)
        }))
        .filter(t => t.distanceKm <= input.maxDistanceKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5);
      
      return results;
    }),

  // ── Import image from iNaturalist ────────────────────────────────────────
  importInatImage: protectedProcedure
    .input(z.object({
      inatPhotoUrl: z.string().url(),
      inatObservationId: z.number(),
      inatObserverName: z.string(),
      inatLicense: z.string().default('CC-BY-NC'),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      plantId: z.number(),
      terroirId: z.number().nullable(),
      imageType: z.enum(['leaf', 'flower', 'fruit', 'bark', 'whole_plant', 'other']),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can import iNaturalist images' });
      }
      
      const db = await requireDb();
      
      // Verify plant exists
      const plant = await db.select().from(plants).where(eq(plants.id, input.plantId));
      if (!plant.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Plant not found' });
      }
      
      try {
        // Download image from iNaturalist
        const response = await fetch(input.inatPhotoUrl);
        if (!response.ok) throw new Error('Failed to download image from iNaturalist');
        const buffer = await response.arrayBuffer();
        
        // Upload to S3
        const imageKey = `variety-images/inat-${input.inatObservationId}-${Date.now()}.jpg`;
        const { url } = await storagePut(
          imageKey,
          Buffer.from(buffer),
          'image/jpeg'
        );
        
        // Get terroir name if provided
        let terroirName: string | null = null;
        if (input.terroirId) {
          const terroirRecord = await db.select().from(terroirs).where(eq(terroirs.id, input.terroirId));
          terroirName = terroirRecord[0]?.name || null;
        }
        
        // Create variety image record
        const result = await db.insert(varietyImages).values({
          genus: plant[0].name?.split(' ')[0] || 'Unknown',
          species: plant[0].latinName || 'sp.',
          imageType: input.imageType,
          fileKey: imageKey,
          fileUrl: url,
          fileName: `inat-${input.inatObservationId}.jpg`,
          mimeType: 'image/jpeg',
          fileSize: buffer.byteLength,
          source: 'iNaturalist',
          sourceUrl: `https://www.inaturalist.org/observations/${input.inatObservationId}`,
          attribution: input.inatObserverName,
          isVerified: false,
          plantId: input.plantId,
          terroirId: input.terroirId,
          terroirName,
        });
        
        return {
          success: true,
          imageId: result[0].insertId,
          url,
          message: `Image imported from iNaturalist observation #${input.inatObservationId}`,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err instanceof Error ? err.message : 'Failed to import iNaturalist image',
        });
      }
    }),

  // ── Stats ─────────────────────────────────────────────────────────────────
  getStats: publicProcedure.query(async () => {
    const db = await requireDb();
    const allImages = await db.select().from(varietyImages);
    const byGenus: Record<string, number> = {};
    const byTerroir: Record<string, number> = {};
    for (const img of allImages) {
      byGenus[img.genus] = (byGenus[img.genus] || 0) + 1;
      if ((img as any).terroirName) {
        const tn = (img as any).terroirName as string;
        byTerroir[tn] = (byTerroir[tn] || 0) + 1;
      }
    }
    return {
      total: allImages.length,
      verified: allImages.filter((i) => i.isVerified).length,
      unverified: allImages.filter((i) => !i.isVerified).length,
      withPlant: allImages.filter((i) => (i as any).plantId !== null && (i as any).plantId !== undefined).length,
      withTerroir: allImages.filter((i) => (i as any).terroirId !== null && (i as any).terroirId !== undefined).length,
      byType: {
        leaf: allImages.filter((i) => i.imageType === "leaf").length,
        flower: allImages.filter((i) => i.imageType === "flower").length,
        fruit: allImages.filter((i) => i.imageType === "fruit").length,
        whole_plant: allImages.filter((i) => i.imageType === "whole_plant").length,
        other: allImages.filter((i) => i.imageType === "other").length,
      },
      byGenus,
      byTerroir,
    };
  }),

});
