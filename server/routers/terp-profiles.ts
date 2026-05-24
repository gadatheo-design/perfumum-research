import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { recettes } from "../../drizzle/schema";

export const terpProfilesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllTerpProfiles();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getTerpProfileById(input);
    }),
  getByProfileId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getTerpProfileByProfileId(input);
    }),
  getByClimaticAxis: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getTerpProfilesByClimaticAxis(input);
    }),
  getByUsage: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getTerpProfilesByUsage(input);
    }),
  create: publicProcedure
    .input(z.object({
      profileId: z.string().min(1),
      name: z.string().min(1),
      collection: z.string().optional(),
      type: z.string().optional(),
      climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]),
      secondaryAxis: z.enum(["vent", "bois", "disparition", "none"]).optional(),
      function: z.string().optional(),
      usage: z.enum(["parfum", "encens", "espace", "parfum_encens", "parfum_espace", "encens_espace", "tous"]).optional(),
      level: z.string().optional(),
      plantSources: z.string().optional(),
      keyMolecules: z.string().optional(),
      concentrate: z.array(z.object({
        ingredient: z.string(),
        percentage: z.number(),
      })).optional(),
      olfactiveReading: z.string().optional(),
      temporality: z.enum(["rapide", "moyenne", "longue", "tres_courte", "variable"]).optional(),
      temporalityDescription: z.string().optional(),
      recommendedUsage: z.string().optional(),
      criticalNotes: z.string().optional(),
      connections: z.array(z.object({
        type: z.enum(["compare", "complete"]),
        profileId: z.string(),
        name: z.string(),
      })).optional(),
      intensity: z.enum(["faible", "moyenne", "structurelle"]).optional(),
      readability: z.enum(["abstrait", "lisible", "structure"]).optional(),
      nonIdentifiable: z.number().optional(),
      radarVent: z.number().optional(),
      radarBois: z.number().optional(),
      radarDisparition: z.number().optional(),
      radarStructure: z.number().optional(),
      radarDiffusion: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createTerpProfile(input);
    }),
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        collection: z.string().optional(),
        type: z.string().optional(),
        climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]).optional(),
        secondaryAxis: z.enum(["vent", "bois", "disparition", "none"]).optional(),
        function: z.string().optional(),
        usage: z.enum(["parfum", "encens", "espace", "parfum_encens", "parfum_espace", "encens_espace", "tous"]).optional(),
        level: z.string().optional(),
        plantSources: z.string().optional(),
        keyMolecules: z.string().optional(),
        concentrate: z.array(z.object({
          ingredient: z.string(),
          percentage: z.number(),
        })).optional(),
        olfactiveReading: z.string().optional(),
        temporality: z.enum(["rapide", "moyenne", "longue", "tres_courte", "variable"]).optional(),
        temporalityDescription: z.string().optional(),
        recommendedUsage: z.string().optional(),
        criticalNotes: z.string().optional(),
        connections: z.array(z.object({
          type: z.enum(["compare", "complete"]),
          profileId: z.string(),
          name: z.string(),
        })).optional(),
        intensity: z.enum(["faible", "moyenne", "structurelle"]).optional(),
        readability: z.enum(["abstrait", "lisible", "structure"]).optional(),
        nonIdentifiable: z.number().optional(),
        radarVent: z.number().optional(),
        radarBois: z.number().optional(),
        radarDisparition: z.number().optional(),
        radarStructure: z.number().optional(),
        radarDiffusion: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return await db.updateTerpProfile(input.id, input.data);
    }),
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteTerpProfile(input);
      return { success: true };
    }),
  getPlants: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getTerpProfilePlants(input);
    }),
  getMolecules: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getTerpProfileMolecules(input);
    }),
  // Récupérer les recettes liées à un TerpProfile
  getRecettes: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getRecettesForTerpProfile(input);
    }),
  // Récupérer les TerpProfiles liés aux molécules de Tagetes lucida
  getForTagetesLucida: publicProcedure
    .query(async () => {
      return await db.getTerpProfilesForTagetesLucida();
    }),
})

