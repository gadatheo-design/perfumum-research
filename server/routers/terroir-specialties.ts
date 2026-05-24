import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const terroirSpecialtiesRouter = router({
  getByTerroir: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getTerroirSpecialties(input);
    }),
  getByPlant: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getPlantTerroirSpecialties(input);
    }),
  add: protectedProcedure
    .input(z.object({
      terroirId: z.number(),
      plantId: z.number().optional(),
      rawMaterialId: z.number().optional(),
      isSignature: z.number().optional(),
      importance: z.enum(['majeure', 'significative', 'mineure', 'emergente']).optional(),
      annualProduction: z.string().optional(),
      productionTrend: z.enum(['croissante', 'stable', 'decroissante', 'variable']).optional(),
      qualityReputation: z.enum(['exceptionnelle', 'excellente', 'bonne', 'standard']).optional(),
      uniqueCharacteristics: z.string().optional(),
      historicalContext: z.string().optional(),
      traditionSince: z.string().optional(),
      economicImportance: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addTerroirSpecialty(input);
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        isSignature: z.number().optional(),
        importance: z.enum(['majeure', 'significative', 'mineure', 'emergente']).optional(),
        annualProduction: z.string().optional(),
        productionTrend: z.enum(['croissante', 'stable', 'decroissante', 'variable']).optional(),
        qualityReputation: z.enum(['exceptionnelle', 'excellente', 'bonne', 'standard']).optional(),
        uniqueCharacteristics: z.string().optional(),
        notes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateTerroirSpecialty(input.id, input.data);
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteTerroirSpecialty(input);
      return { success: true };
    }),
})

