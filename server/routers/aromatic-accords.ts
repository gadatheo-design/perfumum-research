import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const aromaticAccordsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllAromaticAccords();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getAromaticAccordById(input);
    }),
  
  getByCategory: publicProcedure
    .input(z.enum(['fumoir', 'hash', 'herbal', 'hybrid']))
    .query(async ({ input }) => {
      return await db.getAromaticAccordsByCategory(input);
    }),
  
  create: protectedProcedure
    .input(z.object({
      accordId: z.string(),
      name: z.string(),
      category: z.enum(['fumoir', 'hash', 'herbal', 'hybrid']),
      topNotes: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
      })).optional(),
      heartNotes: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
      })).optional(),
      baseNotes: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
      })).optional(),
      formula: z.string().optional(),
      formulaJson: z.array(z.object({
        ingredient: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
        role: z.enum(['top', 'heart', 'base', 'modifier']),
      })).optional(),
      terpeneProfile: z.array(z.object({
        terpene: z.string(),
        percentage: z.number(),
        contribution: z.string(),
      })).optional(),
      description: z.string().optional(),
      inspiration: z.string().optional(),
      targetEffect: z.string().optional(),
      diffusion: z.enum(['faible', 'moyenne', 'forte']).optional(),
      tenacity: z.enum(['fugace', 'modérée', 'tenace']).optional(),
      sillage: z.enum(['intime', 'modéré', 'puissant']).optional(),
      usageRecommendations: z.string().optional(),
      dilutionRecommendation: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createAromaticAccord(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      accordId: z.string().optional(),
      name: z.string().optional(),
      category: z.enum(['fumoir', 'hash', 'herbal', 'hybrid']).optional(),
      topNotes: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
      })).optional(),
      heartNotes: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
      })).optional(),
      baseNotes: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
      })).optional(),
      formula: z.string().optional().nullable(),
      formulaJson: z.array(z.object({
        ingredient: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
        role: z.enum(['top', 'heart', 'base', 'modifier']),
      })).optional(),
      terpeneProfile: z.array(z.object({
        terpene: z.string(),
        percentage: z.number(),
        contribution: z.string(),
      })).optional(),
      description: z.string().optional().nullable(),
      inspiration: z.string().optional().nullable(),
      targetEffect: z.string().optional().nullable(),
      diffusion: z.enum(['faible', 'moyenne', 'forte']).optional(),
      tenacity: z.enum(['fugace', 'modérée', 'tenace']).optional(),
      sillage: z.enum(['intime', 'modéré', 'puissant']).optional(),
      usageRecommendations: z.string().optional().nullable(),
      dilutionRecommendation: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateAromaticAccord(id, data);
      return { success: true };
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteAromaticAccord(input);
      return { success: true };
    }),
})

