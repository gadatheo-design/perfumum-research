import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const markersRouter = router({
  list: publicProcedure
    .input(z.object({
      civilization: z.string().optional(),
      period: z.string().optional(),
      usageType: z.enum(["ritual","medical","commercial","funerary","cosmetic"]).optional(),
      plantId: z.number().int().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await db.listCivilizationalMarkers(input ?? {});
    }),
  
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number().int().min(1) }))
    .query(async ({ input }) => {
      return await db.getCivilizationalMarkersByPlant(input.plantId);
    }),
  
  getByCivilization: publicProcedure
    .input(z.object({ civilization: z.string().min(1) }))
    .query(async ({ input }) => {
      return await db.getCivilizationalMarkersByCivilization(input.civilization);
    }),
  
  getByPeriod: publicProcedure
    .input(z.object({ period: z.string().min(1) }))
    .query(async ({ input }) => {
      return await db.getCivilizationalMarkersByPeriod(input.period);
    }),
  
  create: protectedProcedure
    .input(z.object({
      plantId: z.number().int().min(1),
      civilization: z.string().min(1),
      period: z.string().optional(),
      startYear: z.number().int().optional(),
      endYear: z.number().int().optional(),
      usageType: z.enum(["ritual","medical","commercial","funerary","cosmetic"]),
      historicalSignificance: z.string().optional(),
      tradeRoutes: z.array(z.any()).default([]),
      archaeologicalEvidence: z.string().optional(),
      primarySources: z.array(z.any()).default([]),
    }))
    .mutation(async ({ input }) => {
      return await db.createCivilizationalMarker(input);
    }),
})

