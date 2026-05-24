// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const formulationToolRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllFormulationSuggestions();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getFormulationSuggestionById(input);
    }),
  
  getByType: publicProcedure
    .input(z.enum(['parfum', 'encens', 'tabac_blend', 'cannabis_blend', 'hybrid']))
    .query(async ({ input }) => {
      return await db.getFormulationSuggestionsByType(input);
    }),
  
  getByBaseMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getFormulationSuggestionsByBaseMolecule(input);
    }),
  
  generateSuggestions: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.generateFormulationSuggestions(input);
    }),
  
  create: protectedProcedure
    .input(z.object({
      suggestionId: z.string(),
      name: z.string(),
      baseMoleculeId: z.number().optional(),
      baseMoleculeName: z.string().optional(),
      suggestedMolecules: z.array(z.object({
        moleculeId: z.number(),
        moleculeName: z.string(),
        reason: z.string(),
        synergyType: z.string(),
        compatibilityScore: z.number(),
        proportion: z.string(),
      })).optional(),
      synergyRules: z.array(z.object({
        rule: z.string(),
        description: z.string(),
        source: z.string(),
      })).optional(),
      expectedOlfactiveProfile: z.string().optional(),
      expectedEffects: z.array(z.object({
        effect: z.string(),
        intensity: z.number(),
      })).optional(),
      formulationType: z.enum(['parfum', 'encens', 'tabac_blend', 'cannabis_blend', 'hybrid']),
      difficulty: z.enum(['débutant', 'intermédiaire', 'avancé']).optional(),
      technicalNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createFormulationSuggestion(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      suggestionId: z.string().optional(),
      name: z.string().optional(),
      baseMoleculeId: z.number().optional().nullable(),
      baseMoleculeName: z.string().optional().nullable(),
      suggestedMolecules: z.array(z.object({
        moleculeId: z.number(),
        moleculeName: z.string(),
        reason: z.string(),
        synergyType: z.string(),
        compatibilityScore: z.number(),
        proportion: z.string(),
      })).optional(),
      synergyRules: z.array(z.object({
        rule: z.string(),
        description: z.string(),
        source: z.string(),
      })).optional(),
      expectedOlfactiveProfile: z.string().optional().nullable(),
      expectedEffects: z.array(z.object({
        effect: z.string(),
        intensity: z.number(),
      })).optional(),
      formulationType: z.enum(['parfum', 'encens', 'tabac_blend', 'cannabis_blend', 'hybrid']).optional(),
      difficulty: z.enum(['débutant', 'intermédiaire', 'avancé']).optional(),
      technicalNotes: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateFormulationSuggestion(id, data);
      return { success: true };
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteFormulationSuggestion(input);
      return { success: true };
    }),
})

