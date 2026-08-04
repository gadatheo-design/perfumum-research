import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const ifraRestrictionsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllIfraRestrictions();
  }),
  getByMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getMoleculeIfraRestrictions(input);
    }),
  getRestricted: publicProcedure.query(async () => {
    return await db.getRestrictedMolecules();
  }),
  create: adminProcedure
    .input(z.object({
      moleculeId: z.number(),
      ifraAmendment: z.string().optional(),
      effectiveDate: z.date().optional(),
      category1: z.string().optional(),
      category2: z.string().optional(),
      category3: z.string().optional(),
      category4: z.string().optional(),
      category5a: z.string().optional(),
      category5b: z.string().optional(),
      category5c: z.string().optional(),
      category5d: z.string().optional(),
      category6: z.string().optional(),
      category7a: z.string().optional(),
      category7b: z.string().optional(),
      category8: z.string().optional(),
      category9: z.string().optional(),
      category10a: z.string().optional(),
      category10b: z.string().optional(),
      category11a: z.string().optional(),
      category11b: z.string().optional(),
      restrictionType: z.enum(['prohibited', 'restricted', 'specification', 'no_restriction']).optional(),
      reasonForRestriction: z.string().optional(),
      alternativeSuggestions: z.string().optional(),
      notes: z.string().optional(),
      sourceUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createIfraRestriction(input);
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        ifraAmendment: z.string().optional(),
        effectiveDate: z.date().optional(),
        category1: z.string().optional(),
        category2: z.string().optional(),
        category3: z.string().optional(),
        category4: z.string().optional(),
        category5a: z.string().optional(),
        category5b: z.string().optional(),
        category5c: z.string().optional(),
        category5d: z.string().optional(),
        category6: z.string().optional(),
        category7a: z.string().optional(),
        category7b: z.string().optional(),
        category8: z.string().optional(),
        category9: z.string().optional(),
        category10a: z.string().optional(),
        category10b: z.string().optional(),
        category11a: z.string().optional(),
        category11b: z.string().optional(),
        restrictionType: z.enum(['prohibited', 'restricted', 'specification', 'no_restriction']).optional(),
        reasonForRestriction: z.string().optional(),
        alternativeSuggestions: z.string().optional(),
        notes: z.string().optional(),
        sourceUrl: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      await db.updateIfraRestriction(input.id, input.data);
      return { success: true };
    }),
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteIfraRestriction(input);
      return { success: true };
    }),
})

