// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const finalRecipesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllFinalRecipes();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getFinalRecipeById(input);
    }),
  getByRecipeId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getFinalRecipeByRecipeId(input);
    }),
  getByType: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getFinalRecipesByType(input);
    }),
  getByClimaticAxis: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getFinalRecipesByClimaticAxis(input);
    }),
  getRadical: publicProcedure.query(async () => {
    return await db.getRadicalRecipes();
  }),
  create: publicProcedure
    .input(z.object({
      recipeId: z.string().min(1),
      name: z.string().min(1),
      recipeType: z.enum(["parfum", "encens", "espace"]),
      function: z.string().optional(),
      climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]),
      base: z.string().optional(),
      concentrate: z.array(z.object({
        ingredient: z.string(),
        percentage: z.number(),
      })).optional(),
      dilution: z.string().optional(),
      restPeriod: z.string().optional(),
      form: z.string().optional(),
      combustionTime: z.string().optional(),
      protocol: z.string().optional(),
      supports: z.string().optional(),
      expectedResult: z.string().optional(),
      successCriteria: z.string().optional(),
      risks: z.string().optional(),
      notes: z.string().optional(),
      usage: z.string().optional(),
      terpProfileIds: z.array(z.string()).optional(),
      isRadical: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createFinalRecipe(input);
    }),
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        recipeType: z.enum(["parfum", "encens", "espace"]).optional(),
        function: z.string().optional(),
        climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]).optional(),
        base: z.string().optional(),
        concentrate: z.array(z.object({
          ingredient: z.string(),
          percentage: z.number(),
        })).optional(),
        dilution: z.string().optional(),
        restPeriod: z.string().optional(),
        form: z.string().optional(),
        combustionTime: z.string().optional(),
        protocol: z.string().optional(),
        supports: z.string().optional(),
        expectedResult: z.string().optional(),
        successCriteria: z.string().optional(),
        risks: z.string().optional(),
        notes: z.string().optional(),
        usage: z.string().optional(),
        terpProfileIds: z.array(z.string()).optional(),
        isRadical: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return await db.updateFinalRecipe(input.id, input.data);
    }),
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteFinalRecipe(input);
      return { success: true };
    }),
  // Parfums emblématiques d'une plante
  getPlantPerfumes: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getPlantPerfumes(input);
    }),
})

