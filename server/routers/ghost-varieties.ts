// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const ghostVarietiesRouter = router({
  list: publicProcedure.query(async () => {
    return db.getAllGhostVarieties();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getGhostVarietyById(input);
    }),
  getByType: publicProcedure
    .input(z.enum(['rose', 'jasmine', 'tobacco', 'cannabis', 'lavender', 'citrus', 'aromatic_herb', 'resin_tree', 'other']))
    .query(async ({ input }) => {
      return db.getGhostVarietiesByType(input);
    }),
  getByStatus: publicProcedure
    .input(z.enum(['extinct', 'extinct_wild', 'critically_endangered', 'endangered', 'vulnerable', 'near_threatened', 'reconstructed', 'unknown']))
    .query(async ({ input }) => {
      return db.getGhostVarietiesByStatus(input);
    }),
  search: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchGhostVarieties(input);
    }),
  getStats: publicProcedure.query(async () => {
    return db.getGhostVarietiesStats();
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      scientificName: z.string().optional(),
      commonNames: z.array(z.string()).optional(),
      plantFamily: z.string().optional(),
      genus: z.string().optional(),
      species: z.string().optional(),
      cultivar: z.string().optional(),
      varietyType: z.enum(['rose', 'jasmine', 'tobacco', 'cannabis', 'lavender', 'citrus', 'aromatic_herb', 'resin_tree', 'other']),
      conservationStatus: z.enum(['extinct', 'extinct_wild', 'critically_endangered', 'endangered', 'vulnerable', 'near_threatened', 'reconstructed', 'unknown']),
      lastDocumentedYear: z.number().optional(),
      lastDocumentedLocation: z.string().optional(),
      peakCultivationPeriod: z.string().optional(),
      disappearanceCauses: z.array(z.string()).optional(),
      olfactiveProfile: z.string().optional(),
      molecularProfile: z.array(z.object({
        molecule: z.string(),
        percentage: z.number().optional(),
        note: z.string().optional(),
      })).optional(),
      reconstructionAttempts: z.array(z.object({
        year: z.number(),
        institution: z.string().optional(),
        method: z.string().optional(),
        success: z.boolean().optional(),
        notes: z.string().optional(),
      })).optional(),
      historicalSources: z.array(z.object({
        title: z.string(),
        author: z.string().optional(),
        year: z.number().optional(),
        type: z.string().optional(),
      })).optional(),
      description: z.string().optional(),
      historicalSignificance: z.string().optional(),
      notes: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createGhostVariety({
        ...input,
        createdBy: ctx.user?.id,
      });
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        scientificName: z.string().optional(),
        commonNames: z.array(z.string()).optional(),
        plantFamily: z.string().optional(),
        genus: z.string().optional(),
        species: z.string().optional(),
        cultivar: z.string().optional(),
        varietyType: z.enum(['rose', 'jasmine', 'tobacco', 'cannabis', 'lavender', 'citrus', 'aromatic_herb', 'resin_tree', 'other']).optional(),
        conservationStatus: z.enum(['extinct', 'extinct_wild', 'critically_endangered', 'endangered', 'vulnerable', 'near_threatened', 'reconstructed', 'unknown']).optional(),
        lastDocumentedYear: z.number().optional(),
        lastDocumentedLocation: z.string().optional(),
        peakCultivationPeriod: z.string().optional(),
        disappearanceCauses: z.array(z.string()).optional(),
        olfactiveProfile: z.string().optional(),
        description: z.string().optional(),
        historicalSignificance: z.string().optional(),
        notes: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateGhostVariety(input.id, input.data);
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteGhostVariety(input);
    }),
})

