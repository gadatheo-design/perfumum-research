import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const archivesRouter = router({
  list: publicProcedure
    .input(z.object({
      civilization: z.string().optional(),
      type: z.enum(["manuscript","formula","archaeological","botanical_illustration"]).optional(),
      period: z.string().optional(),
      q: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(25),
      offset: z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      return await db.listOlfactiveArchives(input ?? {});
    }),
  
  getById: publicProcedure
    .input(z.object({ id: z.number().int().min(1) }))
    .query(async ({ input }) => {
      return await db.getOlfactiveArchiveById(input.id);
    }),
  
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      type: z.enum(["manuscript","formula","archaeological","botanical_illustration"]),
      dateCreated: z.string().optional(),
      civilization: z.string().optional(),
      plantIds: z.array(z.number()).default([]),
      moleculeIds: z.array(z.number()).default([]),
      description: z.string().optional(),
      provenance: z.string().optional(),
      authenticityLevel: z.enum(["confirmed","probable","hypothetical"]).default("probable"),
      references: z.array(z.any()).default([]),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createOlfactiveArchive(input);
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number().int().min(1),
      title: z.string().min(1).optional(),
      type: z.enum(["manuscript","formula","archaeological","botanical_illustration"]).optional(),
      dateCreated: z.string().optional(),
      civilization: z.string().optional(),
      plantIds: z.array(z.number()).optional(),
      moleculeIds: z.array(z.number()).optional(),
      description: z.string().optional(),
      provenance: z.string().optional(),
      authenticityLevel: z.enum(["confirmed","probable","hypothetical"]).optional(),
      references: z.array(z.any()).optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateOlfactiveArchive(id, data);
    }),
  
  delete: protectedProcedure
    .input(z.object({ id: z.number().int().min(1) }))
    .mutation(async ({ input }) => {
      return await db.deleteOlfactiveArchive(input.id);
    }),
  
  search: publicProcedure
    .input(z.object({ 
      q: z.string().min(1), 
      limit: z.number().int().min(1).max(50).default(25) 
    }))
    .query(async ({ input }) => {
      return await db.searchOlfactiveArchives(input.q, input.limit);
    }),
})

