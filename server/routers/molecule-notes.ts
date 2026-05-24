import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const moleculeNotesRouter = router({
  get: publicProcedure
    .input(z.number()) // moleculeId
    .query(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.getMoleculeNote(ctx.user.id, input);
    }),
  
  upsert: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      note: z.string(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.upsertMoleculeNote({
        userId: ctx.user.id,
        moleculeId: input.moleculeId,
        note: input.note,
        tags: input.tags,
      });
    }),
  
  listMine: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.getUserMoleculeNotes(ctx.user.id);
    }),
  
  delete: publicProcedure
    .input(z.number()) // moleculeId
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.deleteMoleculeNote(ctx.user.id, input);
    }),
})

