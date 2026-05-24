import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const galleryRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      leafEconomyId: z.number().optional(),
      plantId: z.number().optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      if (input?.category) {
        return db.getSampleImagesByCategory(input.category);
      }
      if (input?.leafEconomyId) {
        return db.getSampleImagesByLeafEconomy(input.leafEconomyId);
      }
      if (input?.plantId) {
        return db.getSampleImagesByPlant(input.plantId);
      }
      return db.getAllSampleImages();
    }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getSampleImageById(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre']).optional(),
        tags: z.array(z.string()).optional(),
        location: z.string().optional(),
        capturedAt: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateSampleImage(input.id, {
        ...input.data,
        capturedAt: input.data.capturedAt ? new Date(input.data.capturedAt) : undefined,
      });
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteSampleImage(input);
      return { success: true };
    }),
  
  searchByTags: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input }) => {
      return db.searchSampleImagesByTags(input);
    }),
  
  getStats: publicProcedure.query(async () => {
    return db.getSampleImagesStats();
  }),

  reorder: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        id: z.number(),
        sortOrder: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      return db.reorderSampleImages(input.items);
    }),
})

