import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const dashboardRouter = router({
  getStats: publicProcedure.query(async () => {
    return await db.getDashboardStats();
  }),
  
  getRecipesByStatus: publicProcedure.query(async () => {
    return await db.getRecipesByStatus();
  }),
  
  getRecipesByCategory: publicProcedure.query(async () => {
    return await db.getRecipesByCategory();
  }),
  
  getMoleculesByFamily: publicProcedure.query(async () => {
    return await db.getMoleculesFamilyStats();
  }),
  
  getRecentActivity: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return await db.getRecentActivity(input?.limit);
    }),

  getKoppenStats: publicProcedure.query(async () => {
    return await db.getKoppenZoneStats();
  }),
})

