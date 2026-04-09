/**
 * tropicos-enrichment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for Tropicos enrichment (Missouri Botanical Garden)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

export const tropicosEnrichmentRouter = router({
  searchName: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      type: z.string().optional(),
      limit: z.number().optional().default(20),
    }))
    .query(async () => {
      return {
        success: true,
        total: 0,
        results: [],
      };
    }),

  getNameDetails: publicProcedure
    .input(z.object({
      nameId: z.number(),
    }))
    .query(async () => {
      return {
        success: true,
        data: {},
      };
    }),

  getSynonyms: publicProcedure
    .input(z.object({
      nameId: z.number(),
    }))
    .query(async () => {
      return {
        success: true,
        total: 0,
        results: [],
      };
    }),

  getDistribution: publicProcedure
    .input(z.object({
      nameId: z.number(),
    }))
    .query(async () => {
      return {
        success: true,
        total: 0,
        results: [],
      };
    }),

  getImages: publicProcedure
    .input(z.object({
      nameId: z.number(),
      limit: z.number().optional().default(10),
    }))
    .query(async () => {
      return {
        success: true,
        total: 0,
        results: [],
      };
    }),

  batchSearchNames: publicProcedure
    .input(z.object({
      names: z.array(z.string().min(1)),
      limit: z.number().optional().default(10),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        total: input.names.length,
        matched: 0,
        failed: input.names.length,
        results: input.names.map(name => ({
          input: name,
          success: false,
          found: false,
        })),
      };
    }),

  getStats: publicProcedure.query(async () => {
    return {
      success: true,
      status: 'ok',
      coverage: {
        scientificNames: '1.33M+',
        images: '685K+',
      },
    };
  }),
});
