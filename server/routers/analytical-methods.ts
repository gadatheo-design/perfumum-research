import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const analyticalMethodsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllAnalyticalMethods();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getAnalyticalMethodById(input.id);
    }),
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return await db.getAnalyticalMethodsByCategory(input.category);
    }),
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await db.searchAnalyticalMethods(input.query);
    }),
  getByMoleculeId: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAnalyticalMethodsByMoleculeId(input.moleculeId);
    }),
})

