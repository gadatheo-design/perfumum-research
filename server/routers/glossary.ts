import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const glossaryRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllGlossaryTerms();
  }),
  search: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "string") throw new Error("Expected string");
      return val;
    })
    .query(async ({ input }) => {
      return await db.searchGlossaryTerms(input);
    }),
  getByCategory: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "string") throw new Error("Expected string");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getGlossaryTermsByCategory(input);
    }),
})

