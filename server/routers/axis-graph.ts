import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const axisGraphRouter = router({
  // Obtenir les données du graphe
  getData: publicProcedure.query(async () => {
    return db.getAxisGraphData();
  }),
  
  // Obtenir toutes les connexions
  getConnections: publicProcedure.query(async () => {
    return db.getAllAxisConnections();
  }),
  
  // Obtenir les connexions pour un axe
  getConnectionsForAxis: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getAxisConnectionsForAxis(input);
    }),
  
  // Créer une connexion
  createConnection: protectedProcedure
    .input(z.object({
      sourceAxisId: z.number(),
      targetAxisId: z.number(),
      strength: z.number().min(1).max(10).optional(),
      connectionType: z.enum(['related', 'complementary', 'dependent', 'overlap']).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createAxisConnection(input);
    }),
  
  // Mettre à jour la force d'une connexion
  updateStrength: protectedProcedure
    .input(z.object({
      sourceId: z.number(),
      targetId: z.number(),
      strength: z.number().min(1).max(10),
    }))
    .mutation(async ({ input }) => {
      return db.updateAxisConnectionStrength(input.sourceId, input.targetId, input.strength);
    }),
  
  // Supprimer une connexion
  deleteConnection: protectedProcedure
    .input(z.object({
      sourceId: z.number(),
      targetId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.deleteAxisConnection(input.sourceId, input.targetId);
    }),
})

