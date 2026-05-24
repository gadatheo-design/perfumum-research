// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const chemotypesRouter = router({
  getAll: publicProcedure.query(async () => {
    return db.getAllChemotypes();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getChemotypeById(input);
    }),
  getByPlantId: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getChemotypesByPlantId(input);
    }),
  getByPlantName: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getChemotypesByPlantName(input);
    }),
  search: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchChemotypes(input);
    }),
  getStats: publicProcedure.query(async () => {
    return db.getChemotypesStats();
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      code: z.string().optional(),
      plantId: z.number().optional(),
      plantName: z.string(),
      latinName: z.string().optional(),
      dominantMoleculeId: z.number().optional(),
      dominantMoleculeName: z.string(),
      dominantPercentage: z.string().optional(),
      dominantPercentageMin: z.number().optional(),
      dominantPercentageMax: z.number().optional(),
      secondaryMolecules: z.array(z.object({
        name: z.string(),
        percentage: z.string().optional(),
        percentageMin: z.number().optional(),
        percentageMax: z.number().optional(),
      })).optional(),
      origin: z.string().optional(),
      terroir: z.string().optional(),
      altitude: z.string().optional(),
      climate: z.string().optional(),
      olfactiveProfile: z.string().optional(),
      olfactiveNotes: z.object({
        top: z.array(z.string()),
        heart: z.array(z.string()),
        base: z.array(z.string()),
      }).optional(),
      intensity: z.number().optional(),
      therapeuticProperties: z.string().optional(),
      contraindications: z.string().optional(),
      toxicity: z.enum(['faible', 'modérée', 'élevée']).optional(),
      perfumeryUse: z.string().optional(),
      blendingNotes: z.string().optional(),
      recommendedDilution: z.string().optional(),
      climaticAxis: z.enum(['vent', 'bois', 'disparition', 'vent_bois', 'bois_disparition', 'vent_disparition']).optional(),
      imageUrl: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createChemotype(input);
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().optional(),
        code: z.string().optional(),
        plantId: z.number().optional(),
        plantName: z.string().optional(),
        latinName: z.string().optional(),
        dominantMoleculeId: z.number().optional(),
        dominantMoleculeName: z.string().optional(),
        dominantPercentage: z.string().optional(),
        dominantPercentageMin: z.number().optional(),
        dominantPercentageMax: z.number().optional(),
        origin: z.string().optional(),
        terroir: z.string().optional(),
        altitude: z.string().optional(),
        climate: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        intensity: z.number().optional(),
        therapeuticProperties: z.string().optional(),
        contraindications: z.string().optional(),
        toxicity: z.enum(['faible', 'modérée', 'élevée']).optional(),
        perfumeryUse: z.string().optional(),
        blendingNotes: z.string().optional(),
        recommendedDilution: z.string().optional(),
        climaticAxis: z.enum(['vent', 'bois', 'disparition', 'vent_bois', 'bois_disparition', 'vent_disparition']).optional(),
        imageUrl: z.string().optional(),
        notes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateChemotype(input.id, input.data);
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteChemotype(input);
    }),
})

