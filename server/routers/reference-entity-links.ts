// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const referenceEntityLinksRouter = router({
  // Créer une liaison
  create: protectedProcedure
    .input(z.object({
      referenceId: z.number(),
      entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
      entityId: z.number(),
      linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
      relevanceScore: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
      context: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createReferenceEntityLink({
        ...input,
        createdBy: ctx.user?.id,
      });
    }),
  
  // Obtenir les liaisons pour une référence
  getForReference: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getLinksForReference(input);
    }),
  
  // Obtenir les références liées à une entité
  getForEntity: publicProcedure
    .input(z.object({
      entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
      entityId: z.number(),
    }))
    .query(async ({ input }) => {
      return db.getReferencesForEntity(input.entityType, input.entityId);
    }),
  
  // Mettre à jour une liaison
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
      relevanceScore: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
      context: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateReferenceEntityLink(id, data);
    }),
  
  // Supprimer une liaison
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteReferenceEntityLink(input);
    }),
  
  // Obtenir les statistiques
  getStats: publicProcedure.query(async () => {
    return db.getReferenceEntityLinkStats();
  }),
  
  // Bulk import from CSV
  bulkImportFromCSV: protectedProcedure
    .input(z.array(z.object({
      referenceId: z.number(),
      entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
      entityId: z.number(),
      linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
      relevanceScore: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
      context: z.string().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      return db.bulkImportReferenceEntityLinks(input, ctx.user?.id);
    }),
  
  // Suggest links based on keywords
  suggestLinks: publicProcedure
    .input(z.object({
      referenceId: z.number().optional(),
      entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']).optional(),
      minScore: z.number().min(0).max(100).optional(),
      limit: z.number().min(1).max(500).optional(),
    }))
    .query(async ({ input }) => {
      return db.suggestReferenceEntityLinks(input);
    }),
  
  // Apply suggested links in bulk
  applySuggestions: protectedProcedure
    .input(z.array(z.object({
      referenceId: z.number(),
      entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
      entityId: z.number(),
      score: z.number().min(0).max(100),
    })))
    .mutation(async ({ input, ctx }) => {
      return db.applySuggestedLinks(input, ctx.user?.id);
    }),
  
  // Get graph data for D3.js visualization
  getGraphData: publicProcedure.query(async () => {
    return db.getReferenceEntityLinkGraphData();
  }),
})

