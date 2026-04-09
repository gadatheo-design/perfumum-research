/**
 * variety-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for managing morphological images of plant varieties
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { varietyImages } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
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
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can upload images" });
      }
      const db = await requireDb();
      const fileKey = generateImageKey(input.genus, input.species, input.imageType, input.fileName);
      const fileBuffer = base64ToBuffer(input.fileData);
      const { url } = await storagePut(fileKey, fileBuffer, input.mimeType);
      const result = await db.insert(varietyImages).values({
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
      }).returning();
      return { id: result[0].id, fileUrl: url, isVerified: false };
    }),

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

  getAll: publicProcedure
    .input(z.object({
      genus: z.string().optional(),
      species: z.string().optional(),
      imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
      isVerified: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const conditions = [];
      if (input.genus) conditions.push(eq(varietyImages.genus, input.genus));
      if (input.species) conditions.push(eq(varietyImages.species, input.species));
      if (input.imageType) conditions.push(eq(varietyImages.imageType, input.imageType));
      if (input.isVerified !== undefined) {
        conditions.push(eq(varietyImages.isVerified, input.isVerified));
      } else {
        conditions.push(eq(varietyImages.isVerified, true));
      }
      return db.select().from(varietyImages)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(input.limit)
        .offset(input.offset);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const images = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      if (!images.length) throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      return images[0];
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      description: z.string().optional(),
      source: z.string().max(255).optional(),
      sourceUrl: z.string().url().optional(),
      attribution: z.string().max(255).optional(),
      quality: z.enum(["low", "medium", "high", "excellent"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const images = await db.select().from(varietyImages).where(eq(varietyImages.id, input.id));
      if (!images.length) throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
      if (images[0].uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only update your own images" });
      }
      const result = await db.update(varietyImages).set({
        description: input.description,
        source: input.source,
        sourceUrl: input.sourceUrl,
        attribution: input.attribution,
        quality: input.quality,
        updatedAt: new Date(),
      }).where(eq(varietyImages.id, input.id)).returning();
      return result[0];
    }),

  verify: protectedProcedure
    .input(z.object({ id: z.number(), isVerified: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can verify images" });
      }
      const db = await requireDb();
      const result = await db.update(varietyImages).set({
        isVerified: input.isVerified,
        verifiedBy: input.isVerified ? ctx.user.id : null,
        verifiedAt: input.isVerified ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(varietyImages.id, input.id)).returning();
      return result[0];
    }),

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

  getStats: publicProcedure.query(async () => {
    const db = await requireDb();
    const allImages = await db.select().from(varietyImages);
    const byGenus: Record<string, number> = {};
    for (const img of allImages) {
      byGenus[img.genus] = (byGenus[img.genus] || 0) + 1;
    }
    return {
      total: allImages.length,
      verified: allImages.filter((i) => i.isVerified).length,
      unverified: allImages.filter((i) => !i.isVerified).length,
      byType: {
        leaf: allImages.filter((i) => i.imageType === "leaf").length,
        flower: allImages.filter((i) => i.imageType === "flower").length,
        fruit: allImages.filter((i) => i.imageType === "fruit").length,
        whole_plant: allImages.filter((i) => i.imageType === "whole_plant").length,
        other: allImages.filter((i) => i.imageType === "other").length,
      },
      byGenus,
    };
  }),
});
