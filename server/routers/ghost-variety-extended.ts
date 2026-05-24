import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules, plants } from "../../drizzle/schema";

export const ghostVarietyExtendedRouter = router({
  // Get variety with all relations
  getWithRelations: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getGhostVarietyWithRelations(input);
    }),
  // Get molecules for linking
  getMoleculesForLinking: publicProcedure.query(async () => {
    return db.getMoleculesForGhostVarietyLinking();
  }),
  // Get plants for linking
  getPlantsForLinking: publicProcedure.query(async () => {
    return db.getPlantsForGhostVarietyLinking();
  }),
  // Search molecules for autocomplete
  searchMolecules: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().optional(),
    }))
    .query(async ({ input }) => {
      return db.searchMoleculesForGhostVariety(input.query, input.limit);
    }),
  // Search plants for autocomplete
  searchPlants: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().optional(),
    }))
    .query(async ({ input }) => {
      return db.searchPlantsForGhostVariety(input.query, input.limit);
    }),
})

