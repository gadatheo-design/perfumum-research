import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const moleculePlantSourcesRouter = router({
  getByMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getMoleculePlantSources(input);
    }),
  getByPlant: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getPlantMoleculeSources(input);
    }),
  add: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      plantId: z.number(),
      plantPart: z.string().optional(),
      percentageInPlant: z.string().optional(),
      percentageInOil: z.string().optional(),
      variability: z.enum(['stable', 'variable', 'tres_variable', 'chemotype_dependant']).optional(),
      isMainSource: z.number().optional(),
      isPrimarySource: z.number().optional(),
      bestExtractionMethod: z.string().optional(),
      extractionYield: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addMoleculePlantSource(input);
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        plantPart: z.string().optional(),
        percentageInPlant: z.string().optional(),
        percentageInOil: z.string().optional(),
        variability: z.enum(['stable', 'variable', 'tres_variable', 'chemotype_dependant']).optional(),
        isMainSource: z.number().optional(),
        isPrimarySource: z.number().optional(),
        bestExtractionMethod: z.string().optional(),
        notes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateMoleculePlantSource(input.id, input.data);
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.deleteMoleculePlantSource(input);
      return { success: true };
    }),
})

