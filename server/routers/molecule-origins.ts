import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const moleculeOriginsRouter = router({
  getByMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getMoleculeOrigins(input);
    }),
  add: adminProcedure
    .input(z.object({
      moleculeId: z.number(),
      originId: z.number(),
      isPrimaryOrigin: z.number().optional(),
      qualityRating: z.number().optional(),
      productionVolume: z.string().optional(),
      priceRange: z.string().optional(),
      specificCharacteristics: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.addMoleculeOrigin(input);
    }),
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        isPrimaryOrigin: z.number().optional(),
        qualityRating: z.number().optional(),
        productionVolume: z.string().optional(),
        priceRange: z.string().optional(),
        specificCharacteristics: z.string().optional(),
        notes: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      await db.updateMoleculeOrigin(input.id, input.data);
      return { success: true };
    }),
  remove: adminProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.removeMoleculeOrigin(input);
      return { success: true };
    }),
})

