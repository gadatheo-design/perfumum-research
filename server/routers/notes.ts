import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const notesRouter = router({
  create: adminProcedure
    .input(z.object({
      entityType: z.string(),
      entityId: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db.createUserNote(input.entityType, input.entityId, input.content);
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db.updateUserNote(input.id, input.content);
    }),
  
  delete: adminProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db.deleteUserNote(input);
    }),
  
  getByEntity: publicProcedure
    .input(z.object({
      entityType: z.string(),
      entityId: z.number(),
    }))
    .query(async ({ input }) => {
      return await db.getUserNoteByEntity(input.entityType, input.entityId);
    }),
  
  search: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.searchUserNotes(input);
    }),
})

