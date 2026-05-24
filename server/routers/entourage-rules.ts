import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const entourageRulesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllEntourageRules();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getEntourageRuleById(input);
    }),
  
  getByType: publicProcedure
    .input(z.enum(['entourage', 'potentiation', 'modulation', 'stabilization', 'enhancement', 'contrast']))
    .query(async ({ input }) => {
      return await db.getEntourageRulesByType(input);
    }),
  
  create: protectedProcedure
    .input(z.object({
      ruleId: z.string(),
      name: z.string(),
      ruleType: z.enum(['entourage', 'potentiation', 'modulation', 'stabilization', 'enhancement', 'contrast']),
      primaryMolecules: z.array(z.object({
        name: z.string(),
        role: z.string(),
      })).optional(),
      secondaryMolecules: z.array(z.object({
        name: z.string(),
        role: z.string(),
      })).optional(),
      description: z.string(),
      mechanism: z.string().optional(),
      olfactiveResult: z.string().optional(),
      applicableTo: z.array(z.string()).optional(),
      scientificBasis: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createEntourageRule(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      ruleId: z.string().optional(),
      name: z.string().optional(),
      ruleType: z.enum(['entourage', 'potentiation', 'modulation', 'stabilization', 'enhancement', 'contrast']).optional(),
      primaryMolecules: z.array(z.object({
        name: z.string(),
        role: z.string(),
      })).optional(),
      secondaryMolecules: z.array(z.object({
        name: z.string(),
        role: z.string(),
      })).optional(),
      description: z.string().optional(),
      mechanism: z.string().optional().nullable(),
      olfactiveResult: z.string().optional().nullable(),
      applicableTo: z.array(z.string()).optional(),
      scientificBasis: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateEntourageRule(id, data);
      return { success: true };
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteEntourageRule(input);
      return { success: true };
    }),
})

