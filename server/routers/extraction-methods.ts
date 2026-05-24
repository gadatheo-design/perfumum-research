import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { getAllExtractionMethods, getExtractionMethodById } from "../db/plants";

export const extractionMethodsRouter = router({
  getAll: publicProcedure.query(async () => {
    return getAllExtractionMethods();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getExtractionMethodById(input.id);
    }),
})

