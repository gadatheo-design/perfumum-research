// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const v3ReferencesRouter = router({
  // Liste toutes les références v3
  list: publicProcedure.query(async () => {
    return db.getAllV3References();
  }),
  
  // Alias getAll pour compatibilité
  getAll: publicProcedure.query(async () => {
    return db.getAllV3References();
  }),
  
  // Obtenir une référence par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getV3ReferenceById(input);
    }),
  
  // Obtenir une référence par clé
  getByKey: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getV3ReferenceByKey(input);
    }),
  
  // Obtenir les références par axe
  getByAxis: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getV3ReferencesByAxis(input);
    }),
  
  // Obtenir les références par méta-axe
  getByMetaAxis: publicProcedure
    .input(z.enum(['meta_a', 'meta_b', 'meta_c', 'other']))
    .query(async ({ input }) => {
      return db.getV3ReferencesByMetaAxis(input);
    }),
  
  // Rechercher des références
  search: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchV3References(input);
    }),
  
  // Mettre à jour les notes utilisateur
  updateUserNotes: protectedProcedure
    .input(z.object({
      id: z.number(),
      userNotes: z.string(),
    }))
    .mutation(async ({ input }) => {
      return db.updateV3ReferenceUserNotes(input.id, input.userNotes);
    }),
  
  // Mettre à jour le statut de lecture
  updateReadStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      readStatus: z.enum(['unread', 'reading', 'read', 'to_review']),
    }))
    .mutation(async ({ input }) => {
      return db.updateV3ReferenceReadStatus(input.id, input.readStatus);
    }),
  
  // Mettre à jour le score de pertinence
  updateRelevance: protectedProcedure
    .input(z.object({
      id: z.number(),
      relevanceScore: z.number().min(0).max(100),
    }))
    .mutation(async ({ input }) => {
      return db.updateV3ReferenceRelevance(input.id, input.relevanceScore);
    }),
  
  // Statistiques
  getStats: publicProcedure.query(async () => {
    return db.getV3ReferencesStats();
  }),
  
  // Obtenir les tags d'une référence
  getTags: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getTagsForV3Reference(input);
    }),
  
  // Obtenir les notes d'une référence
  getNotes: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getNotesForV3Reference(input);
    }),
})

