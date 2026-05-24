import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const moleculeScientificDataRouter = router({
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      iupacName: z.string().optional(),
      casNumber: z.string().optional(),
      chemicalClass: z.enum(['terpene', 'sesquiterpene', 'diterpene', 'monoterpene', 'aldehyde', 'ketone', 'alcohol', 'ester', 'ether', 'phenol', 'lactone', 'coumarin', 'musk', 'nitrile', 'sulfur_compound', 'heterocyclic', 'aromatic', 'aliphatic', 'other']).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateMoleculeScientificData(id, data);
    }),
  getWithoutCas: publicProcedure.query(async () => {
    return await db.getMoleculesWithoutCas();
  }),
  getWithCas: publicProcedure.query(async () => {
    return await db.getMoleculesWithCas();
  }),
})

