import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const favoritesRouter = router({
  add: protectedProcedure
    .input(z.object({ moleculeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.addFavorite(ctx.user.id, input.moleculeId);
    }),
  
  remove: protectedProcedure
    .input(z.object({ moleculeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.removeFavorite(ctx.user.id, input.moleculeId);
    }),
  
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return await db.getUserFavorites(ctx.user.id);
  }),
  
  isFavorite: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) return false;
      return await db.isFavorite(ctx.user.id, input.moleculeId);
    }),
})

