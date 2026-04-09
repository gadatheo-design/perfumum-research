/**
 * wikidata-sync.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for synchronizing plant variety genealogies with Wikidata
 * Fetches taxonomic data, synonyms, hybrids, and distribution information
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Wikidata requires a descriptive User-Agent for all SPARQL requests
const WIKIDATA_USER_AGENT =
  "PERFUMUM-Research/1.0 (https://perfumum.manus.space; olfactory-research-project) Node.js/fetch";

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const SPARQL_TIMEOUT_MS = 20000; // 20 seconds

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface WikidataEntity {
  id: string;
  label: string;
  description: string;
  aliases: string[];
  scientificName?: string;
  taxonRank?: string;
  parentTaxon?: string;
  hybrids?: string[];
  distribution?: string[];
  conservationStatus?: string;
  imageUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: SPARQL fetch with proper headers and timeout
// ─────────────────────────────────────────────────────────────────────────────

async function sparqlQuery(query: string): Promise<any> {
  const url = new URL(SPARQL_ENDPOINT);
  url.searchParams.set("query", query.trim());
  url.searchParams.set("format", "json");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SPARQL_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": WIKIDATA_USER_AGENT,
        "Accept-Language": "en",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`SPARQL HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.results?.bindings ?? [];
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Wikidata SPARQL request timed out after 20 seconds");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

async function queryWikidataForTaxon(
  scientificName: string
): Promise<WikidataEntity | null> {
  try {
    // Escape quotes in scientific name for SPARQL safety
    const safeName = scientificName.replace(/"/g, '\\"');

    const query = `
      SELECT ?item ?itemLabel ?itemDescription ?scientificName
             ?taxonRankLabel ?parentTaxonLabel ?image ?conservationStatusLabel
      WHERE {
        ?item wdt:P225 "${safeName}" .
        OPTIONAL { ?item wdt:P105 ?taxonRank . }
        OPTIONAL { ?item wdt:P171 ?parentTaxon . }
        OPTIONAL { ?item wdt:P18 ?image . }
        OPTIONAL { ?item wdt:P141 ?conservationStatus . }
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en,fr" .
        }
      }
      LIMIT 1
    `;

    const bindings = await sparqlQuery(query);

    if (bindings.length === 0) return null;

    const r = bindings[0];
    const wikidataId = r.item?.value?.split("/").pop() ?? "";

    return {
      id: wikidataId,
      label: r.itemLabel?.value ?? scientificName,
      description: r.itemDescription?.value ?? "",
      aliases: [],
      scientificName: r.scientificName?.value ?? scientificName,
      taxonRank: r.taxonRankLabel?.value,
      parentTaxon: r.parentTaxonLabel?.value,
      conservationStatus: r.conservationStatusLabel?.value,
      imageUrl: r.image?.value,
    };
  } catch (error) {
    console.error("queryWikidataForTaxon error:", error);
    return null;
  }
}

async function queryWikidataForHybrids(scientificName: string): Promise<string[]> {
  try {
    const safeName = scientificName.replace(/"/g, '\\"');
    const query = `
      SELECT ?hybridLabel
      WHERE {
        ?parent wdt:P225 "${safeName}" .
        ?hybrid wdt:P7209 ?parent .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr" . }
      }
      LIMIT 20
    `;
    const bindings = await sparqlQuery(query);
    return bindings
      .map((r: any) => r.hybridLabel?.value ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function queryWikidataForDistribution(scientificName: string): Promise<string[]> {
  try {
    const safeName = scientificName.replace(/"/g, '\\"');
    const query = `
      SELECT ?countryLabel
      WHERE {
        ?taxon wdt:P225 "${safeName}" .
        ?taxon wdt:P183 ?country .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr" . }
      }
      LIMIT 30
    `;
    const bindings = await sparqlQuery(query);
    return bindings
      .map((r: any) => r.countryLabel?.value ?? "")
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const wikidataSyncRouter = router({
  /**
   * Health check — lightweight query to verify SPARQL endpoint availability
   */
  getStats: publicProcedure.query(async () => {
    try {
      // Minimal query: just ask for 1 species-rank taxon
      const query = `SELECT ?item WHERE { ?item wdt:P31 wd:Q16521 . } LIMIT 1`;
      const bindings = await sparqlQuery(query);

      return {
        status: "ok",
        message: "Wikidata SPARQL endpoint is accessible",
        taxaFound: bindings.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Wikidata health check failed:", error);
      return {
        status: "error",
        message: `Wikidata SPARQL endpoint is not responding: ${error?.message ?? "unknown error"}`,
        timestamp: new Date().toISOString(),
      };
    }
  }),

  /**
   * Search for a taxon on Wikidata by scientific name
   */
  searchTaxon: publicProcedure
    .input(z.object({ scientificName: z.string().min(1) }))
    .query(async ({ input }) => {
      const entity = await queryWikidataForTaxon(input.scientificName);
      if (!entity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Taxon "${input.scientificName}" not found on Wikidata`,
        });
      }
      return entity;
    }),

  /**
   * Get detailed information about a taxon including hybrids and distribution
   */
  getTaxonDetails: publicProcedure
    .input(z.object({ scientificName: z.string().min(1) }))
    .query(async ({ input }) => {
      const entity = await queryWikidataForTaxon(input.scientificName);
      if (!entity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Taxon "${input.scientificName}" not found on Wikidata`,
        });
      }

      const [hybrids, distribution] = await Promise.all([
        queryWikidataForHybrids(input.scientificName),
        queryWikidataForDistribution(input.scientificName),
      ]);

      return { ...entity, hybrids, distribution };
    }),

  /**
   * Batch search for multiple taxa (max 20 per request to avoid rate limiting)
   */
  batchSearchTaxa: publicProcedure
    .input(
      z.object({
        scientificNames: z.array(z.string().min(1)).min(1).max(20),
      })
    )
    .query(async ({ input }) => {
      // Sequential to avoid hammering Wikidata
      const results: Array<{
        scientificName: string;
        found: boolean;
        entity: WikidataEntity | null;
      }> = [];

      for (const name of input.scientificNames) {
        const entity = await queryWikidataForTaxon(name);
        results.push({ scientificName: name, found: entity !== null, entity });
        // Small delay between requests to be polite to Wikidata
        await new Promise((r) => setTimeout(r, 300));
      }

      return {
        total: results.length,
        found: results.filter((r) => r.found).length,
        notFound: results.filter((r) => !r.found).length,
        results,
      };
    }),

  /**
   * Get enrichment recommendations for a variety
   */
  getEnrichmentRecommendations: protectedProcedure
    .input(
      z.object({
        genus: z.string(),
        species: z.string(),
        cultivar: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const scientificName = input.cultivar
        ? `${input.genus} ${input.species} ${input.cultivar}`
        : `${input.genus} ${input.species}`;

      const details = await queryWikidataForTaxon(scientificName);

      if (!details) {
        return {
          found: false,
          recommendations: [],
          message: `No Wikidata entry found for "${scientificName}"`,
        };
      }

      const recommendations: string[] = [];
      if (details.conservationStatus)
        recommendations.push(`Update conservation status: ${details.conservationStatus}`);
      if (details.imageUrl)
        recommendations.push(`Add image from Wikidata: ${details.imageUrl}`);
      if (details.parentTaxon)
        recommendations.push(`Add parent taxon: ${details.parentTaxon}`);

      const [hybrids, distribution] = await Promise.all([
        queryWikidataForHybrids(scientificName),
        queryWikidataForDistribution(scientificName),
      ]);

      if (hybrids.length > 0)
        recommendations.push(`Found ${hybrids.length} hybrid(s): ${hybrids.join(", ")}`);
      if (distribution.length > 0)
        recommendations.push(`Distribution: ${distribution.join(", ")}`);

      return {
        found: true,
        wikidataId: details.id,
        scientificName: details.scientificName,
        recommendations,
        details,
      };
    }),
});
