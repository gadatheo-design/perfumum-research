import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const axisReferenceLinksRouter = router({
  // Liste toutes les liaisons
  list: publicProcedure
    .input(z.object({
      axisId: z.number().optional(),
      referenceId: z.number().optional(),
      linkType: z.string().optional(),
      confidence: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllAxisReferenceLinks(input || {});
    }),
  
  // Obtenir une liaison par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getAxisReferenceLinkById(input);
    }),
  
  // Obtenir les liaisons pour un axe avec détails
  getByAxis: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getAxisReferenceLinksWithDetails(input);
    }),
  
  // Obtenir les liaisons pour une référence avec détails
  getByReference: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getReferenceAxisLinksWithDetails(input);
    }),
  
  // Données du graphe pour D3.js
  getGraphData: publicProcedure.query(async () => {
    return db.getAxisReferenceGraphData();
  }),
  
  // Statistiques
  getStats: publicProcedure.query(async () => {
    return db.getAxisReferenceLinkStats();
  }),
  
  // Créer une liaison
  create: protectedProcedure
    .input(z.object({
      axisId: z.number(),
      referenceId: z.number(),
      linkType: z.string().optional(),
      relevanceScore: z.number().min(0).max(100).optional(),
      confidence: z.enum(['high', 'medium', 'low']).optional(),
      notes: z.string().optional(),
      excerpt: z.string().optional(),
      pageNumbers: z.string().optional(),
      displayWeight: z.number().min(1).max(10).optional(),
      isHighlighted: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createAxisReferenceLink({
        ...input,
        createdBy: ctx.user?.id,
      });
    }),
  
  // Mettre à jour une liaison
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      linkType: z.string().optional(),
      relevanceScore: z.number().min(0).max(100).optional(),
      confidence: z.enum(['high', 'medium', 'low']).optional(),
      notes: z.string().optional(),
      excerpt: z.string().optional(),
      pageNumbers: z.string().optional(),
      displayWeight: z.number().min(1).max(10).optional(),
      isHighlighted: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateAxisReferenceLink(id, data);
    }),
  
  // Supprimer une liaison
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteAxisReferenceLink(input);
    }),
  
  // Créer plusieurs liaisons en masse
  bulkCreate: protectedProcedure
    .input(z.array(z.object({
      axisId: z.number(),
      referenceId: z.number(),
      linkType: z.string().optional(),
      relevanceScore: z.number().optional(),
      confidence: z.enum(['high', 'medium', 'low']).optional(),
      notes: z.string().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      const links = input.map((link) => ({
        ...link,
        createdBy: ctx.user?.id,
      }));
      return db.bulkCreateAxisReferenceLinks(links);
    }),
})

