import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const referenceCitationsRouter = router({
  // Lister toutes les citations avec filtres
  list: publicProcedure
    .input(z.object({
      citingId: z.number().optional(),
      citedId: z.number().optional(),
      citationType: z.string().optional(),
      verified: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllReferenceCitations(input || {});
    }),
  
  // Obtenir une citation par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getReferenceCitationById(input);
    }),
  
  // Obtenir le graphe complet des citations pour visualisation
  getGraph: publicProcedure
    .input(z.object({
      citationType: z.string().optional(),
      researchDomain: z.string().optional(),
      minWeight: z.number().optional(),
      verified: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getCitationGraph(input || {});
    }),
  
  // Obtenir les citations d'une référence (qui cite cette référence)
  getCitationsOf: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getCitationsOf(input);
    }),
  
  // Obtenir les références citées par une référence
  getCitedBy: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getCitedBy(input);
    }),
  
  // Créer une nouvelle citation
  create: protectedProcedure
    .input(z.object({
      citingId: z.number(),
      citedId: z.number(),
      citationType: z.enum(['direct', 'indirect', 'methodological', 'theoretical', 'data', 'critique', 'support', 'comparison']).optional(),
      context: z.string().optional(),
      pageNumber: z.string().optional(),
      notes: z.string().optional(),
      weight: z.number().min(1).max(5).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createReferenceCitation({
        ...input,
        addedBy: ctx.user?.id,
      });
    }),
  
  // Mettre à jour une citation
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      citationType: z.enum(['direct', 'indirect', 'methodological', 'theoretical', 'data', 'critique', 'support', 'comparison']).optional(),
      context: z.string().optional(),
      pageNumber: z.string().optional(),
      notes: z.string().optional(),
      weight: z.number().min(1).max(5).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateReferenceCitation(id, data);
    }),
  
  // Supprimer une citation
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteReferenceCitation(input);
    }),
  
  // Vérifier une citation
  verify: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return db.verifyReferenceCitation(input, ctx.user?.id);
    }),
  
  // Statistiques du graphe de citations
  getStats: publicProcedure.query(async () => {
    return db.getCitationGraphStats();
  }),
})

