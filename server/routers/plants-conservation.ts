import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const plantsConservationRouter = router({
  listThreatened: publicProcedure
    .input(z.object({
      iucn: z.enum(["EX","EW","CR","EN","VU","NT","LC","DD","NE"]).optional(),
      cites: z.enum(["I","II","III","NONE","UNKNOWN"]).optional(),
      region: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await db.listThreatenedPlants(input ?? {});
    }),
  
  getConservationStatus: publicProcedure
    .input(z.object({ plantId: z.number().int().min(1) }))
    .query(async ({ input }) => {
      return await db.getPlantConservationStatus(input.plantId);
    }),
  
  updateConservationStatus: protectedProcedure
    .input(z.object({
      plantId: z.number().int().min(1),
      conservationStatus: z.enum(["EX","EW","CR","EN","VU","NT","LC","DD","NE"]).optional(),
      citesAppendix: z.enum(["I","II","III","NONE","UNKNOWN"]).optional(),
      conservationNotes: z.string().optional(),
      threatFactors: z.record(z.string(), z.any()).optional(),
      sustainableAlternatives: z.string().optional(),
      lastAssessmentYear: z.number().int().optional(),
      historicalStatus: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { plantId, ...data } = input;
      return await db.updatePlantConservationStatus(plantId, data);
    }),
  
  listGeographicZones: publicProcedure
    .input(z.object({
      zoneType: z.enum(["threatened_concentration", "sustainable_alternatives", "biodiversity_hotspot", "conservation_area"]).optional(),
      threatLevel: z.enum(["critical", "high", "medium", "low", "stable"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      return await db.listGeographicZones(input ?? {});
    }),
  
  getPlantsByZone: publicProcedure
    .input(z.object({
      zoneId: z.number(),
    }))
    .query(async ({ input }) => {
      return await db.getPlantsByGeographicZone(input.zoneId);
    }),
})

