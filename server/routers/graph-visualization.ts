import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const graphVisualizationRouter = router({
  // Obtenir les données pour le graphe
  getGraphData: publicProcedure.query(async () => {
    return db.getReferencesGroupedByAxis();
  }),
  
  // Obtenir les statistiques du graphe
  getStats: publicProcedure.query(async () => {
    return db.getGraphVisualizationStats();
  }),
  
  // Obtenir les détails d'une référence avec ses entités liées
  getReferenceDetails: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getReferenceWithLinkedEntities(input);
    }),
})

