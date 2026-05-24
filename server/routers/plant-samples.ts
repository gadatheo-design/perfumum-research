import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { getAllPlantSamples, getPlantSampleById, getPlantSamplesByPlant } from "../db/plants";

export const plantSamplesRouter = router({
  getAll: publicProcedure.query(async () => {
    return getAllPlantSamples();
  }),
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return getPlantSamplesByPlant(input.plantId);
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getPlantSampleById(input.id);
    }),
})

