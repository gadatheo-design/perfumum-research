import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const autoLinkingRouter = router({
  // Suggérer des liaisons pour une référence
  suggestForReference: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.suggestEntityLinksForReference(input);
    }),
  
  // Suggérer des liaisons en masse
  bulkSuggest: publicProcedure
    .input(z.object({
      minScore: z.number().min(0).max(100).optional(),
      limit: z.number().min(1).max(500).optional(),
      entityTypes: z.array(z.enum(['molecule', 'plant', 'terroir'])).optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.bulkSuggestEntityLinks(input || {});
    }),
  
  // Créer des liaisons en masse
  batchCreate: protectedProcedure
    .input(z.array(z.object({
      referenceId: z.number(),
      entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
      entityId: z.number(),
      linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
      relevanceScore: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
    })))
    .mutation(async ({ input, ctx }) => {
      return db.batchCreateEntityLinks(
        input.map((link) => ({ ...link, createdBy: ctx.user?.id }))
      );
    }),
})

