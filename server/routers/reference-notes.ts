import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const referenceNotesRouter = router({
  // Obtenir une note par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getReferenceNoteById(input);
    }),
  
  // Créer une note
  create: protectedProcedure
    .input(z.object({
      referenceId: z.number(),
      noteType: z.enum(['summary', 'critique', 'quote', 'methodology', 'connection', 'idea', 'question', 'todo', 'general']).optional(),
      title: z.string().optional(),
      content: z.string(),
      pageNumber: z.string().optional(),
      importance: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createReferenceNote({
        ...input,
        createdBy: ctx.user?.id,
      });
    }),
  
  // Mettre à jour une note
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      noteType: z.enum(['summary', 'critique', 'quote', 'methodology', 'connection', 'idea', 'question', 'todo', 'general']).optional(),
      title: z.string().optional(),
      content: z.string().optional(),
      pageNumber: z.string().optional(),
      importance: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      isResolved: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateReferenceNote(id, data);
    }),
  
  // Supprimer une note
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteReferenceNote(input);
    }),
  
  // Obtenir les notes par type
  getByType: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getReferenceNotesByType(input);
    }),
  
  // Obtenir les notes non résolues
  getUnresolved: publicProcedure.query(async () => {
    return db.getUnresolvedReferenceNotes();
  }),
})

