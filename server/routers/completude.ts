import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { plants, rawMaterials, terroirs } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const completudeRouter = router({
  globalStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getCompletudeGlobalStats();
    }),
  rawMaterials: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
      sortBy: z.enum(['score_asc', 'score_desc', 'name']).default('score_asc'),
      minScore: z.number().min(0).max(100).optional(),
      maxScore: z.number().min(0).max(100).optional(),
      category: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getCompletudeRawMaterials(input);
    }),
  plants: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(500).default(50),
      offset: z.number().min(0).default(0),
      sortBy: z.enum(['score_asc', 'score_desc', 'name']).default('score_asc'),
      minScore: z.number().min(0).max(100).optional(),
      maxScore: z.number().min(0).max(100).optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getCompletudePlants(input);
    }),
  terroirs: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
      sortBy: z.enum(['score_asc', 'score_desc', 'name']).default('score_asc'),
      minScore: z.number().min(0).max(100).optional(),
      maxScore: z.number().min(0).max(100).optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return db.getCompletudeTerroirs(input);
    }),
  getNetworkData: publicProcedure
    .input(z.object({
      limit: z.number().min(10).max(200).default(50),
      includeRecettes: z.boolean().default(true),
      includeRawMaterials: z.boolean().default(true),
      includeMolecules: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      return db.getNetworkData(input);
    }),
})

