import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const formulasRouter = router({
  save: protectedProcedure
    .input(z.object({
      radarProfile: z.object({
        intensity: z.number().min(0).max(100),
        freshness: z.number().min(0).max(100),
        warmth: z.number().min(0).max(100),
        sweetness: z.number().min(0).max(100),
        spiciness: z.number().min(0).max(100),
        earthiness: z.number().min(0).max(100),
      }),
      suggestions: z.array(z.object({
        id: z.number(),
        name: z.string(),
        compatibilityScore: z.number(),
        radarIntensity: z.number().optional(),
        radarFreshness: z.number().optional(),
        radarWarmth: z.number().optional(),
        radarSweetness: z.number().optional(),
        radarSpiciness: z.number().optional(),
        radarEarthiness: z.number().optional(),
      })),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.saveFormula({
        userId: ctx.user.id,
        radarProfile: input.radarProfile,
        suggestions: input.suggestions,
        notes: input.notes,
      });
    }),
  
  getHistory: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Not authenticated");
    return await db.getFormulaHistory(ctx.user.id);
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getFormulaById(input);
    }),
  
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      await db.deleteFormula(input);
      return { success: true };
    }),
  
  updateNotes: protectedProcedure
    .input(z.object({
      id: z.number(),
      notes: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.updateFormulaNotes(input.id, input.notes);
    }),
})

