/**
 * gbif-enrichment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for GBIF (Global Biodiversity Information Facility) enrichment
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

export const gbifEnrichmentRouter = router({
  searchSpecies: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        const url = new URL('https://api.gbif.org/v1/species/search');
        url.searchParams.append('q', input.query);
        url.searchParams.append('limit', String(input.limit));

        const response = await fetch(url.toString());
        const data = await response.json() as any;

        return {
          total: data.count || 0,
          results: (data.results || []).map((r: any) => ({
            key: r.key,
            scientificName: r.scientificName,
            rank: r.rank,
            family: r.family,
            confidence: r.confidence || 0,
          })),
        };
      } catch (error) {
        return { total: 0, results: [] };
      }
    }),

  matchSpecies: publicProcedure
    .input(z.object({
      scientificName: z.string().min(1),
    }))
    .query(async ({ input }) => {
      try {
        const url = new URL('https://api.gbif.org/v1/species/match');
        url.searchParams.append('name', input.scientificName);

        const response = await fetch(url.toString());
        const data = await response.json() as any;

        return {
          data: {
            scientificName: data.scientificName || '',
            rank: data.rank || '',
            family: data.family || '',
            confidence: data.confidence || 0,
          },
        };
      } catch (error) {
        return { data: { scientificName: '', rank: '', family: '', confidence: 0 } };
      }
    }),

  getOccurrences: publicProcedure
    .input(z.object({
      scientificName: z.string().min(1),
      limit: z.number().optional().default(100),
    }))
    .query(async ({ input }) => {
      try {
        const url = new URL('https://api.gbif.org/v1/occurrence/search');
        url.searchParams.append('scientificName', input.scientificName);
        url.searchParams.append('limit', String(input.limit));

        const response = await fetch(url.toString());
        const data = await response.json() as any;

        return {
          total: data.count || 0,
          results: (data.results || []).map((r: any) => ({
            key: r.key,
            country: r.country || 'Unknown',
            decimalLatitude: r.decimalLatitude || 0,
            decimalLongitude: r.decimalLongitude || 0,
            basisOfRecord: r.basisOfRecord || 'Unknown',
          })),
        };
      } catch (error) {
        return { total: 0, results: [] };
      }
    }),

  batchSearchSpecies: publicProcedure
    .input(z.object({
      scientificNames: z.array(z.string().min(1)),
    }))
    .query(async ({ input }) => {
      const results = await Promise.all(
        input.scientificNames.map(async (name) => {
          try {
            const url = new URL('https://api.gbif.org/v1/species/match');
            url.searchParams.append('name', name);
            const response = await fetch(url.toString());
            const data = await response.json() as any;
            return {
              input: name,
              found: !!data.scientificName,
              scientificName: data.scientificName || '',
            };
          } catch {
            return { input: name, found: false, scientificName: '' };
          }
        })
      );

      return {
        total: input.scientificNames.length,
        matched: results.filter(r => r.found).length,
        results,
      };
    }),

  getStats: publicProcedure.query(async () => {
    return {
      notes: {
        coverage: '2M+ species',
        occurrences: '1B+ records',
      },
    };
  }),
});
