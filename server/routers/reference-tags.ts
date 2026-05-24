import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const referenceTagsRouter = router({
  // Liste tous les tags
  list: publicProcedure.query(async () => {
    return db.getAllReferenceTags();
  }),
  
  // Obtenir les tags par catégorie
  getByCategory: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getReferenceTagsByCategory(input);
    }),
  
  // Obtenir un tag par slug
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getReferenceTagBySlug(input);
    }),
  
  // Créer un tag
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      slug: z.string(),
      category: z.enum(['theme', 'method', 'source_type', 'region', 'period', 'material', 'discipline', 'project', 'custom']).optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      parentId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createReferenceTag(input);
    }),
  
  // Mettre à jour un tag
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateReferenceTag(id, data);
    }),
  
  // Supprimer un tag
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteReferenceTag(input);
    }),
  
  // Ajouter un tag à une référence
  addToReference: protectedProcedure
    .input(z.object({
      referenceId: z.number(),
      tagId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.addTagToV3Reference(input.referenceId, input.tagId);
    }),
  
  // Retirer un tag d'une référence
  removeFromReference: protectedProcedure
    .input(z.object({
      referenceId: z.number(),
      tagId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.removeTagFromV3Reference(input.referenceId, input.tagId);
    }),
  
  // Obtenir les références par tag
  getReferences: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getV3ReferencesByTag(input);
    }),
})

