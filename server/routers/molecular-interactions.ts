// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const molecularInteractionsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllMolecularInteractions();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getMolecularInteractionById(input);
    }),
  
  getByCategory: publicProcedure
    .input(z.enum(['tabac_cannabis', 'tabac_parfum', 'cannabis_parfum', 'tabac_cannabis_parfum']))
    .query(async ({ input }) => {
      return await db.getMolecularInteractionsByCategory(input);
    }),
  
  getBySynergyType: publicProcedure
    .input(z.enum(['entourage', 'potentiation', 'bridge', 'stabilization', 'transformation', 'masking']))
    .query(async ({ input }) => {
      return await db.getMolecularInteractionsBySynergyType(input);
    }),
  
  create: protectedProcedure
    .input(z.object({
      interactionId: z.string(),
      name: z.string(),
      sourceCategory: z.enum(['tabac_cannabis', 'tabac_parfum', 'cannabis_parfum', 'tabac_cannabis_parfum']),
      molecule1Id: z.number().optional(),
      molecule2Id: z.number().optional(),
      molecule3Id: z.number().optional(),
      terpeneProfile: z.array(z.object({
        name: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
        function: z.string().optional(),
      })).optional(),
      synergyType: z.enum(['entourage', 'potentiation', 'bridge', 'stabilization', 'transformation', 'masking']),
      compatibilityScore: z.number().min(0).max(100).default(50),
      description: z.string().optional(),
      olfactiveResult: z.string().optional(),
      applications: z.string().optional(),
      scientificBasis: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createMolecularInteraction(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      interactionId: z.string().optional(),
      name: z.string().optional(),
      sourceCategory: z.enum(['tabac_cannabis', 'tabac_parfum', 'cannabis_parfum', 'tabac_cannabis_parfum']).optional(),
      molecule1Id: z.number().optional().nullable(),
      molecule2Id: z.number().optional().nullable(),
      molecule3Id: z.number().optional().nullable(),
      terpeneProfile: z.array(z.object({
        name: z.string(),
        percentage: z.number(),
        source: z.enum(['tabac', 'cannabis', 'parfum']),
        function: z.string().optional(),
      })).optional(),
      synergyType: z.enum(['entourage', 'potentiation', 'bridge', 'stabilization', 'transformation', 'masking']).optional(),
      compatibilityScore: z.number().min(0).max(100).optional(),
      description: z.string().optional().nullable(),
      olfactiveResult: z.string().optional().nullable(),
      applications: z.string().optional().nullable(),
      scientificBasis: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateMolecularInteraction(id, data);
      return { success: true };
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteMolecularInteraction(input);
      return { success: true };
    }),
  
  getGraphData: publicProcedure.query(async () => {
    return await db.getInteractionsGraphData();
  }),
})

