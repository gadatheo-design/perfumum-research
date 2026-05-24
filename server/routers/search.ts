import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { CACHE_KEYS, CACHE_TTL, withCache } from "../cache";

export const searchRouter = router({
  global: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      // Cache les résultats de recherche pendant 1 minute
      return await withCache(
        CACHE_KEYS.SEARCH_GLOBAL(input.query),
        () => db.globalSearch(input.query, input.limit),
        CACHE_TTL.SHORT
      );
    }),
  // Synonymes olfactifs - récupère les synonymes d'un terme
  getSynonyms: publicProcedure
    .input(z.object({ term: z.string() }))
    .query(async ({ input }) => {
      return db.getOlfactiveSynonyms(input.term);
    }),
  // Expansion de requête - étend une requête avec ses synonymes
  expandQuery: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return db.expandOlfactiveSearchQuery(input.query);
    }),
  // Catégorisation - identifie le domaine olfactif d'un terme
  categorizeTerm: publicProcedure
    .input(z.object({ term: z.string() }))
    .query(async ({ input }) => {
      return db.categorizeOlfactiveSearchTerm(input.term);
    }),
  // Statistiques du dictionnaire de synonymes
  getDictionaryStats: publicProcedure
    .query(async () => {
      return db.getOlfactiveDictionaryStats();
    }),
})

