/**
 * variety-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for managing morphological images of plant varieties
 * Handles upload, retrieval, verification, and deletion of variety images
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
// SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const UploadVarietyImageSchema = z.object({
  genus: z.string().min(1).max(100),
  species: z.string().min(1).max(100),
  cultivar: z.string().max(255).optional(),
  imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]),
  fileData: z.string(), // base64 encoded
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(50),
  description: z.string().optional(),
  source: z.string().max(255).optional(),
  sourceUrl: z.string().url().optional(),
  attribution: z.string().max(255).optional(),
});

const UpdateVarietyImageSchema = z.object({
  id: z.number(),
  description: z.string().optional(),
  source: z.string().max(255).optional(),
  sourceUrl: z.string().url().optional(),
  attribution: z.string().max(255).optional(),
  quality: z.enum(["low", "medium", "high", "excellent"]).optional(),
});

const VerifyVarietyImageSchema = z.object({
  id: z.number(),
  isVerified: z.boolean(),
});

const QueryVarietyImagesSchema = z.object({
  genus: z.string().optional(),
  species: z.string().optional(),
  imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
  isVerified: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a unique S3 key for the image
 */
function generateImageKey(
  genus: string,
  species: string,
  imageType: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split(".").pop() || "jpg";
  const sanitized = `${genus.toLowerCase()}-${species.toLowerCase()}-${imageType}`;
  return `variety-images/${sanitized}-${timestamp}-${random}.${extension}`;
}

/**
 * Convert base64 to Buffer
 */
function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const varietyImagesRouter = router({
  /**
   * Upload a new variety image
   * Authenticated users can upload, but images need admin verification
   */
  upload: protectedProcedure
    .input(UploadVarietyImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check admin role
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can upload images",
          });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Generate S3 key
        const fileKey = generateImageKey(
          input.genus,
          input.species,
          input.imageType,
          input.fileName
        );

        // Convert base64 to buffer
        const fileBuffer = base64ToBuffer(input.fileData);

        // Upload to S3
        const { url } = await storagePut(fileKey, fileBuffer, input.mimeType);

        // Save metadata to database
        const result = await db
          .insert(varietyImages)
          .values({
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
            isVerified: false, // Require admin verification
          })
          .returning();

        return {
          id: result[0].id,
          fileUrl: url,
          isVerified: false,
          message: "Image uploaded successfully. Awaiting admin verification.",
        };
      } catch (error) {
        console.error("Error uploading variety image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }
    }),

  /**
   * Get images for a specific variety
   */
  getByVariety: publicProcedure
    .input(
      z.object({
        genus: z.string(),
        species: z.string(),
        cultivar: z.string().optional(),
        imageType: z.enum(["leaf", "flower", "fruit", "whole_plant", "other"]).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const conditions = [
          eq(varietyImages.genus, input.genus),
          eq(varietyImages.species, input.species),
          eq(varietyImages.isVerified, true), // Only show verified images
        ];

        if (input.cultivar) {
          conditions.push(eq(varietyImages.cultivar, input.cultivar));
        }

        if (input.imageType) {
          conditions.push(eq(varietyImages.imageType, input.imageType));
        }

        const images = await db
          .select()
          .from(varietyImages)
          .where(and(...conditions));

        return images;
      } catch (error) {
        console.error("Error fetching variety images:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch images",
        });
      }
    }),

  /**
   * Get all images with optional filtering
   */
  getAll: publicProcedure
    .input(QueryVarietyImagesSchema)
    .query(async ({ input }) => {
      try {
        const conditions = [];

        if (input.genus) {
          conditions.push(eq(varietyImages.genus, input.genus));
        }
        if (input.species) {
          conditions.push(eq(varietyImages.species, input.species));
        }
        if (input.imageType) {
          conditions.push(eq(varietyImages.imageType, input.imageType));
        }
        if (input.isVerified !== undefined) {
          conditions.push(eq(varietyImages.isVerified, input.isVerified));
        } else {
          // Default: only show verified images for public
          conditions.push(eq(varietyImages.isVerified, true));
        }

        const images = await db
          .select()
          .from(varietyImages)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .limit(input.limit)
          .offset(input.offset);

        return images;
      } catch (error) {
        console.error("Error fetching variety images:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch images",
        });
      }
    }),

  /**
   * Get a single image by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const image = await db
          .select()
          .from(varietyImages)
          .where(eq(varietyImages.id, input.id));

        if (!image.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Image not found",
          });
        }

        return image[0];
      } catch (error) {
        console.error("Error fetching variety image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch image",
        });
      }
    }),

  /**
   * Update image metadata (by uploader or admin)
   */
  update: protectedProcedure
    .input(UpdateVarietyImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user is owner or admin
        const image = await db
          .select()
          .from(varietyImages)
          .where(eq(varietyImages.id, input.id));

        if (!image.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Image not found",
          });
        }

        if (
          image[0].uploadedBy !== ctx.user.id &&
          ctx.user.role !== "admin"
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only update your own images",
          });
        }

        // Update image
        const result = await db
          .update(varietyImages)
          .set({
            description: input.description,
            source: input.source,
            sourceUrl: input.sourceUrl,
            attribution: input.attribution,
            quality: input.quality,
            updatedAt: new Date(),
          })
          .where(eq(varietyImages.id, input.id))
          .returning();

        return result[0];
      } catch (error) {
        console.error("Error updating variety image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update image",
        });
      }
    }),

  /**
   * Verify/unverify image (admin only)
   */
  verify: protectedProcedure
    .input(VerifyVarietyImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check admin role
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can verify images",
          });
        }

        const result = await db
          .update(varietyImages)
          .set({
            isVerified: input.isVerified,
            verifiedBy: input.isVerified ? ctx.user.id : null,
            verifiedAt: input.isVerified ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(varietyImages.id, input.id))
          .returning();

        return result[0];
      } catch (error) {
        console.error("Error verifying variety image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify image",
        });
      }
    }),

  /**
   * Delete image (uploader or admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user is owner or admin
        const image = await db
          .select()
          .from(varietyImages)
          .where(eq(varietyImages.id, input.id));

        if (!image.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Image not found",
          });
        }

        if (
          image[0].uploadedBy !== ctx.user.id &&
          ctx.user.role !== "admin"
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own images",
          });
        }

        // Delete from database (S3 cleanup could be added later)
        await db
          .delete(varietyImages)
          .where(eq(varietyImages.id, input.id));

        return { success: true };
      } catch (error) {
        console.error("Error deleting variety image:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
    }),

  /**
   * Get statistics about variety images
   */
  getStats: publicProcedure.query(async () => {
    try {
      const allImages = await db.select().from(varietyImages);

      const stats = {
        total: allImages.length,
        verified: allImages.filter((img) => img.isVerified).length,
        unverified: allImages.filter((img) => !img.isVerified).length,
        byType: {
          leaf: allImages.filter((img) => img.imageType === "leaf").length,
          flower: allImages.filter((img) => img.imageType === "flower").length,
          fruit: allImages.filter((img) => img.imageType === "fruit").length,
          whole_plant: allImages.filter((img) => img.imageType === "whole_plant")
            .length,
          other: allImages.filter((img) => img.imageType === "other").length,
        },
        byGenus: {} as Record<string, number>,
      };

      // Count by genus
      for (const image of allImages) {
        stats.byGenus[image.genus] = (stats.byGenus[image.genus] || 0) + 1;
      }

      return stats;
    } catch (error) {
      console.error("Error fetching variety image stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch statistics",
      });
    }
  }),
});
