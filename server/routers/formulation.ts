import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const formulationRouter = router({
  calculateDilution: publicProcedure
    .input(z.object({
      moleculeName: z.string(),
      targetConcentration: z.number(), // %
      finalVolume: z.number(), // mL
      stockConcentration: z.number().optional(), // % (default 100%)
    }))
    .mutation(async ({ input }) => {
      const stockConc = input.stockConcentration || 100;
      const volumeStock = (input.targetConcentration / stockConc) * input.finalVolume;
      const volumeSolvent = input.finalVolume - volumeStock;
      
      return {
        moleculeName: input.moleculeName,
        targetConcentration: input.targetConcentration,
        finalVolume: input.finalVolume,
        stockConcentration: stockConc,
        volumeStock: Math.round(volumeStock * 100) / 100,
        volumeSolvent: Math.round(volumeSolvent * 100) / 100,
        formula: `${Math.round(volumeStock * 100) / 100} mL stock + ${Math.round(volumeSolvent * 100) / 100} mL solvant = ${input.finalVolume} mL à ${input.targetConcentration}%`,
      };
    }),
})

