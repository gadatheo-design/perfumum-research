import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const sharedCollectionsRouter = router({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      moleculeIds: z.array(z.number()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      
      // Generate unique token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Expires in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      return await db.createSharedCollection({
        token,
        title: input.title,
        description: input.description,
        moleculeIds: input.moleculeIds,
        creatorId: ctx.user.id,
        expiresAt,
      });
    }),
  
  getByToken: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.getSharedCollectionByToken(input);
    }),
  
  listMine: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.getUserSharedCollections(ctx.user.id);
    }),
})

