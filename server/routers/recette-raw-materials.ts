import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const recetteRawMaterialsRouter = router({
  getByRecette: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRecetteRawMaterials(input);
    }),
  getByRawMaterial: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRecettesForRawMaterial(input);
    }),
  add: protectedProcedure
    .input(z.object({
      recetteId: z.number(),
      rawMaterialId: z.number(),
      role: z.enum(['base', 'coeur', 'tete', 'fixateur', 'modificateur', 'autre']).optional(),
      dosage: z.string().optional(),
      dosageUnit: z.string().optional(),
      percentage: z.string().optional(),
      notes: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addRecetteRawMaterial(input);
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        role: z.enum(['base', 'coeur', 'tete', 'fixateur', 'modificateur', 'autre']).optional(),
        dosage: z.string().optional(),
        dosageUnit: z.string().optional(),
        percentage: z.string().optional(),
        notes: z.string().optional(),
        sortOrder: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateRecetteRawMaterial(input.id, input.data);
    }),
  remove: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.removeRecetteRawMaterial(input);
    }),
})

