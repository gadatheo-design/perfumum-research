import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const forceGraphRouter = router({
  // Obtenir les données du graphe de force pour références-axes
  getReferencesAxesData: publicProcedure
    .input(z.object({
      includeReferences: z.boolean().default(true),
      metaAxisFilter: z.string().optional(),
      minRelevanceScore: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      return db.getForceGraphDataReferencesAxes(input || {});
    }),
  
   // Obtenir les données du graphe d'axes uniquement
  getAxisGraphData: publicProcedure.query(async () => {
    return db.getAxisGraphData();
  }),
})

