import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const tabacsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllTabacs();
  }),
  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getTabacById(input);
    }),
  getSuggestions: publicProcedure
    .input(z.object({
      olfactiveProfile: z.string(),
    }))
    .query(async ({ input }) => {
      return await db.getTabacsByProfile(input.olfactiveProfile);
    }),
  listWithTerroir: publicProcedure.query(async () => {
    return await db.getTabacsWithTerroir();
  }),
  listByType: publicProcedure
    .input(z.object({ type: z.enum(['blond', 'brun', 'oriental', 'experimental']) }))
    .query(async ({ input }) => {
      return await db.getTabacsByType(input.type);
    }),
  getWithMolecules: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getTabacWithMolecules(input);
    }),
})

