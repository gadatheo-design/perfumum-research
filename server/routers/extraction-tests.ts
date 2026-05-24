import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const extractionTestsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllExtractionTests();
  }),
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getExtractionTestById(input);
    }),
  getByArchiveId: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getExtractionTestsByArchiveId(input);
    }),
})

