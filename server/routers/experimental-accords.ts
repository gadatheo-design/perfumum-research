import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const experimentalAccordsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllExperimentalAccords();
  }),
  getByType: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getExperimentalAccordsByType(input);
    }),
})

