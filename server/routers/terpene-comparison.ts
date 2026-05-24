import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const terpeneComparisonRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllTerpeneComparisonProfiles();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getTerpeneComparisonProfileById(input);
    }),
  
  getBySource: publicProcedure
    .input(z.enum(['tabac', 'cannabis', 'parfum']))
    .query(async ({ input }) => {
      return await db.getTerpeneComparisonProfilesBySource(input);
    }),
  
  getComparisonData: publicProcedure
    .input(z.array(z.number()))
    .query(async ({ input }) => {
      return await db.getTerpeneComparisonData(input);
    }),
  
  create: protectedProcedure
    .input(z.object({
      profileId: z.string(),
      name: z.string(),
      sourceType: z.enum(['tabac', 'cannabis', 'parfum']),
      sourceId: z.number().optional(),
      sourceName: z.string().optional(),
      myrcene: z.number().min(0).max(100).default(0),
      limonene: z.number().min(0).max(100).default(0),
      pinene: z.number().min(0).max(100).default(0),
      linalool: z.number().min(0).max(100).default(0),
      caryophyllene: z.number().min(0).max(100).default(0),
      humulene: z.number().min(0).max(100).default(0),
      terpinolene: z.number().min(0).max(100).default(0),
      ocimene: z.number().min(0).max(100).default(0),
      bisabolol: z.number().min(0).max(100).default(0),
      geraniol: z.number().min(0).max(100).default(0),
      additionalTerpenes: z.array(z.object({
        name: z.string(),
        value: z.number(),
      })).optional(),
      dominantNote: z.string().optional(),
      olfactiveDescription: z.string().optional(),
      aromaticBridges: z.array(z.object({
        terpene: z.string(),
        bridgesWith: z.string(),
        commonality: z.number(),
      })).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createTerpeneComparisonProfile(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      profileId: z.string().optional(),
      name: z.string().optional(),
      sourceType: z.enum(['tabac', 'cannabis', 'parfum']).optional(),
      sourceId: z.number().optional().nullable(),
      sourceName: z.string().optional().nullable(),
      myrcene: z.number().min(0).max(100).optional(),
      limonene: z.number().min(0).max(100).optional(),
      pinene: z.number().min(0).max(100).optional(),
      linalool: z.number().min(0).max(100).optional(),
      caryophyllene: z.number().min(0).max(100).optional(),
      humulene: z.number().min(0).max(100).optional(),
      terpinolene: z.number().min(0).max(100).optional(),
      ocimene: z.number().min(0).max(100).optional(),
      bisabolol: z.number().min(0).max(100).optional(),
      geraniol: z.number().min(0).max(100).optional(),
      additionalTerpenes: z.array(z.object({
        name: z.string(),
        value: z.number(),
      })).optional(),
      dominantNote: z.string().optional().nullable(),
      olfactiveDescription: z.string().optional().nullable(),
      aromaticBridges: z.array(z.object({
        terpene: z.string(),
        bridgesWith: z.string(),
        commonality: z.number(),
      })).optional(),
      notes: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateTerpeneComparisonProfile(id, data);
      return { success: true };
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteTerpeneComparisonProfile(input);
      return { success: true };
    }),
})

