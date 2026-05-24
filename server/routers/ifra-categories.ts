import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const ifraCategoriesRouter = router({
  list: publicProcedure.query(async () => {
    return db.getAllIfraCategories();
  }),
  getByCode: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getIfraCategoryByCode(input);
    }),
  calculateLimit: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      categoryCode: z.string(),
    }))
    .query(async ({ input }) => {
      return db.calculateIfraLimit(input.moleculeId, input.categoryCode);
    }),
  checkCompliance: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      categoryCode: z.string(),
      concentration: z.number(),
    }))
    .query(async ({ input }) => {
      return db.checkIfraCompliance(input.moleculeId, input.categoryCode, input.concentration);
    }),
  searchByName: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchIfraRestrictionsByName(input);
    }),
  getStats: publicProcedure.query(async () => {
    return db.getIfraStats();
  }),
})

