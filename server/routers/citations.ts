import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const citationsRouter = router({
  generate: publicProcedure
    .input(z.object({
      entityType: z.enum(["molecule", "recipe", "prototype", "accord"]),
      entityId: z.number(),
      format: z.enum(["apa", "mla", "chicago", "bibtex"]).default("apa"),
    }))
    .mutation(async ({ input }) => {
      return await db.generateCitation(
        input.entityType,
        input.entityId,
        input.format
      );
    }),
  
  get: publicProcedure
    .input(z.object({
      entityType: z.string(),
      entityId: z.number(),
      format: z.string().default("apa"),
    }))
    .query(async ({ input }) => {
      return await db.getCitation(
        input.entityType,
        input.entityId,
        input.format
      );
    }),
})

