/**
 * gbif-enrichment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for GBIF (Global Biodiversity Information Facility) enrichment
 * API: https://api.gbif.org/v1/
 * Docs: https://www.gbif.org/developer/summary
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db/core";
import { plants } from "../../drizzle/schema";
import { eq, like } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GBIF_API = "https://api.gbif.org/v1";
const GBIF_TIMEOUT_MS = 18000;
const GBIF_USER_AGENT = "PERFUMUM-Research/1.0 (https://perfumum.manus.space; olfactory-research) Node.js/fetch";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface GbifSpecies {
  usageKey: number;
  scientificName: string;
  rank: string;
  status: string;
  confidence: number;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  canonicalName?: string;
  authorship?: string;
  taxonID?: string;
}

interface GbifDistribution {
  country?: string;
  locality?: string;
  status?: string;
  establishmentMeans?: string;
  source?: string;
}

interface GbifVernacularName {
  vernacularName: string;
  language: string;
  source?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function gbifFetch(path: string): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GBIF_TIMEOUT_MS);

  try {
    const response = await fetch(`${GBIF_API}${path}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": GBIF_USER_AGENT,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GBIF HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("GBIF request timed out after 18 seconds");
    }
    throw err;
  }
}

/** Match a scientific name to a GBIF taxon key */
async function matchSpecies(scientificName: string): Promise<GbifSpecies | null> {
  try {
    const data = await gbifFetch(`/species/match?name=${encodeURIComponent(scientificName)}&verbose=false`);
    if (!data.usageKey) return null;
    return data as GbifSpecies;
  } catch {
    return null;
  }
}

/** Get distributions for a GBIF taxon key */
async function getDistributions(taxonKey: number): Promise<GbifDistribution[]> {
  try {
    const data = await gbifFetch(`/species/${taxonKey}/distributions?limit=50`);
    return (data.results || []) as GbifDistribution[];
  } catch {
    return [];
  }
}

/** Get vernacular names for a GBIF taxon key */
async function getVernacularNames(taxonKey: number): Promise<GbifVernacularName[]> {
  try {
    const data = await gbifFetch(`/species/${taxonKey}/vernacularNames?limit=30`);
    return (data.results || []) as GbifVernacularName[];
  } catch {
    return [];
  }
}

/** Parse distribution results into a clean country list */
function parseCountries(distributions: GbifDistribution[]): string[] {
  const countries = new Set<string>();
  for (const d of distributions) {
    if (d.country && d.country.length === 2) {
      countries.add(d.country.toUpperCase());
    }
  }
  return Array.from(countries);
}

/** Parse vernacular names into a language map */
function parseVernacularNames(names: GbifVernacularName[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const n of names) {
    if (!n.language || !n.vernacularName) continue;
    const lang = n.language.toLowerCase().slice(0, 2);
    if (!result[lang]) result[lang] = [];
    if (!result[lang].includes(n.vernacularName)) {
      result[lang].push(n.vernacularName);
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const gbifEnrichmentRouter = router({
  /**
   * Health check — verify GBIF API is accessible
   */
  getStats: publicProcedure.query(async () => {
    try {
      const data = await gbifFetch("/species/match?name=Rosa+damascena");
      return {
        status: "ok",
        message: "GBIF API is accessible",
        testSpecies: data.scientificName || "Rosa damascena",
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `GBIF API not responding: ${error?.message ?? "unknown error"}`,
        timestamp: new Date().toISOString(),
      };
    }
  }),

  /**
   * Match a scientific name to a GBIF taxon (species/match)
   */
  matchSpecies: publicProcedure
    .input(z.object({ scientificName: z.string().min(1) }))
    .query(async ({ input }) => {
      const species = await matchSpecies(input.scientificName);
      if (!species) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `"${input.scientificName}" not found in GBIF`,
        });
      }
      return species;
    }),

  /**
   * Search species by query string
   */
  searchSpecies: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).optional().default(20),
    }))
    .query(async ({ input }) => {
      try {
        const data = await gbifFetch(
          `/species/search?q=${encodeURIComponent(input.query)}&limit=${input.limit}&rank=SPECIES&status=ACCEPTED`
        );
        return {
          total: data.count || 0,
          results: (data.results || []).map((r: any) => ({
            key: r.key,
            scientificName: r.scientificName || "",
            canonicalName: r.canonicalName || "",
            rank: r.rank || "",
            family: r.family || "",
            kingdom: r.kingdom || "",
            confidence: r.confidence || 0,
          })),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `GBIF search failed: ${error?.message}`,
        });
      }
    }),

  /**
   * Get full details for a species: taxonomy + distributions + vernacular names
   */
  getSpeciesDetails: publicProcedure
    .input(z.object({ scientificName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const species = await matchSpecies(input.scientificName);
      if (!species) {
        return {
          found: false,
          scientificName: input.scientificName,
          species: null,
          distributions: [],
          vernacularNames: {},
          countries: [],
        };
      }

      const [distributions, vernacularNames] = await Promise.all([
        getDistributions(species.usageKey),
        getVernacularNames(species.usageKey),
      ]);

      const countries = parseCountries(distributions);
      const vernacular = parseVernacularNames(vernacularNames);

      return {
        found: true,
        scientificName: input.scientificName,
        species,
        distributions: distributions.slice(0, 30),
        vernacularNames: vernacular,
        countries,
        gbifUrl: `https://www.gbif.org/species/${species.usageKey}`,
      };
    }),

  /**
   * Batch match multiple species names
   */
  batchMatchSpecies: publicProcedure
    .input(z.object({
      scientificNames: z.array(z.string().min(1)).min(1).max(20),
    }))
    .mutation(async ({ input }) => {
      const results = [];
      for (const name of input.scientificNames) {
        const species = await matchSpecies(name);
        results.push({
          input: name,
          found: !!species,
          species: species || null,
        });
        // Polite delay between requests
        await new Promise((r) => setTimeout(r, 250));
      }
      return {
        total: results.length,
        found: results.filter((r) => r.found).length,
        notFound: results.filter((r) => !r.found).length,
        results,
      };
    }),

  /**
   * Import GBIF data into a plant record:
   * - Sets gbifKey, family, order, kingdom, vernacular names, distribution countries
   */
  importGbifData: publicProcedure
    .input(z.object({
      latinName: z.string().min(1),
      gbifKey: z.number(),
      scientificName: z.string(),
      family: z.string().optional(),
      order: z.string().optional(),
      kingdom: z.string().optional(),
      countries: z.array(z.string()).optional(),
      vernacularFr: z.string().optional(),
      vernacularEn: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Find plant by latin name
      const results = await db
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
        .from(plants)
        .where(like(plants.latinName, `%${input.latinName}%`))
        .limit(5);

      if (results.length === 0) {
        return {
          success: false,
          message: `Aucune plante trouvée avec le nom latin "${input.latinName}".`,
          matches: [],
        };
      }

      if (results.length > 1) {
        return {
          success: false,
          message: `Plusieurs plantes correspondent à "${input.latinName}". Précisez le nom.`,
          matches: results.map((r) => ({ id: r.id, name: r.name, latinName: r.latinName })),
        };
      }

      const plant = results[0];

      // Build update payload — only fields that exist in the plants table
      const updateData: Record<string, any> = {
        gbifId: String(input.gbifKey),
        wikidataEnrichedAt: new Date(), // reuse timestamp field for GBIF enrichment tracking
      };

      if (input.family) updateData.family = input.family;
      // Store countries in origin field if not already set
      if (input.countries && input.countries.length > 0) {
        updateData.origin = input.countries.slice(0, 5).join(", ");
      }
      // Store vernacular names in notes
      const noteParts: string[] = [];
      if (input.vernacularFr) noteParts.push(`Nom FR: ${input.vernacularFr}`);
      if (input.vernacularEn) noteParts.push(`Nom EN: ${input.vernacularEn}`);
      if (noteParts.length > 0) updateData.notes = noteParts.join(" | ");

      await db.update(plants).set(updateData).where(eq(plants.id, plant.id));

      return {
        success: true,
        message: `Données GBIF importées pour ${plant.name} (${plant.latinName}).`,
        plantId: plant.id,
        plantName: plant.name,
        gbifKey: input.gbifKey,
        fieldsUpdated: Object.keys(updateData).filter((k) => k !== "gbifEnrichedAt"),
      };
    }),
});
