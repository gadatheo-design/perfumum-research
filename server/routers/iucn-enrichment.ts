/**
 * iucn-enrichment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for IUCN Red List enrichment
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

export const iucnEnrichmentRouter = router({
  searchSpecies: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().optional().default(20),
    }))
    .query(async () => {
      return {
        success: true,
        total: 0,
        results: [],
      };
    }),

  getAssessment: publicProcedure
    .input(z.object({
      assessmentId: z.number(),
    }))
    .query(async () => {
      return {
        success: true,
        data: {},
      };
    }),

  getSpeciesByStatus: publicProcedure
    .input(z.object({
      status: z.string(),
      taxonomy: z.string().optional(),
      limit: z.number().optional().default(50),
    }))
    .query(async () => {
      return {
        success: true,
        total: 0,
        results: [],
      };
    }),

  batchSearchSpecies: publicProcedure
    .input(z.object({
      scientificNames: z.array(z.string().min(1)),
      limit: z.number().optional().default(10),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        total: input.scientificNames.length,
        matched: 0,
        results: input.scientificNames.map(name => ({
          input: name,
          success: false,
          found: false,
          status: 'DD',
        })),
      };
    }),

  getStats: publicProcedure.query(async () => {
    return {
      success: true,
      status: 'ok',
      coverage: {
        species: '150K+',
        assessments: '200K+',
      },
    };
  }),
});
