import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const moleculeRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getMoleculeWithRelations(input.id);
    }),
  getAllRelationships: publicProcedure
    .query(async () => {
      return await db.getAllMoleculeRecetteRelationships();
    }),
})

