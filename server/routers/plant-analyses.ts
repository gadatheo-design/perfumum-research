import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { getAllPlantAnalyses, getPlantAnalysesByPlant, getPlantAnalysisById } from "../db/plants";

export const plantAnalysesRouter = router({
  getAll: publicProcedure.query(async () => {
    return getAllPlantAnalyses();
  }),
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return getPlantAnalysesByPlant(input.plantId);
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getPlantAnalysisById(input.id);
    }),
})

