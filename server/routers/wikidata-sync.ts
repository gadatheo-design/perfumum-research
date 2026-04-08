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
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Query Wikidata SPARQL endpoint for a taxon
 */
async function queryWikidataForTaxon(
  scientificName: string
): Promise<WikidataEntity | null> {
  try {
    // SPARQL query to find taxon by scientific name
    const sparqlQuery = `
      SELECT ?item ?itemLabel ?itemDescription ?scientificName ?taxonRank ?taxonRankLabel
             ?parentTaxon ?parentTaxonLabel ?image ?conservationStatus ?conservationStatusLabel
      WHERE {
        ?item wdt:P225 "${scientificName}" .
        ?item rdfs:label ?itemLabel .
        FILTER(LANG(?itemLabel) = "en")
        
        OPTIONAL { ?item schema:description ?itemDescription . FILTER(LANG(?itemDescription) = "en") }
        OPTIONAL { ?item wdt:P225 ?scientificName . }
        OPTIONAL { ?item wdt:P105 ?taxonRank . }
        OPTIONAL { ?item wdt:P171 ?parentTaxon . }
        OPTIONAL { ?item wdt:P18 ?image . }
        OPTIONAL { ?item wdt:P141 ?conservationStatus . }
        
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
      }
      LIMIT 1
    `;

    const url = new URL("https://query.wikidata.org/sparql");
    url.searchParams.append("query", sparqlQuery);
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/sparql-results+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Wikidata query failed: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const results = data.results?.bindings || [];

    if (results.length === 0) {
      return null;
    }

    const result = results[0];
    const wikidataId = result.item?.value?.split("/").pop() || "";

    return {
      id: wikidataId,
      label: result.itemLabel?.value || scientificName,
      description: result.itemDescription?.value || "",
      aliases: [],
      scientificName: result.scientificName?.value || scientificName,
      taxonRank: result.taxonRankLabel?.value,
      parentTaxon: result.parentTaxonLabel?.value,
      conservationStatus: result.conservationStatusLabel?.value,
      imageUrl: result.image?.value,
    };
  } catch (error) {
    console.error("Error querying Wikidata:", error);
    return null;
  }
}

/**
 * Query Wikidata for hybrids of a taxon
 */
async function queryWikidataForHybrids(
  scientificName: string
): Promise<string[]> {
  try {
    const sparqlQuery = `
      SELECT ?hybridLabel
      WHERE {
        ?parent wdt:P225 "${scientificName}" .
        ?hybrid wdt:P7209 ?parent .
        ?hybrid rdfs:label ?hybridLabel .
        FILTER(LANG(?hybridLabel) = "en")
      }
      LIMIT 20
    `;

    const url = new URL("https://query.wikidata.org/sparql");
    url.searchParams.append("query", sparqlQuery);
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/sparql-results+json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as any;
    const results = data.results?.bindings || [];

    return results.map((r: any) => r.hybridLabel?.value || "").filter((v: string) => v);
  } catch (error) {
    console.error("Error querying Wikidata hybrids:", error);
    return [];
  }
}

/**
 * Query Wikidata for distribution of a taxon
 */
async function queryWikidataForDistribution(
  scientificName: string
): Promise<string[]> {
  try {
    const sparqlQuery = `
      SELECT ?countryLabel
      WHERE {
        ?taxon wdt:P225 "${scientificName}" .
        ?taxon wdt:P183 ?country .
        ?country rdfs:label ?countryLabel .
        FILTER(LANG(?countryLabel) = "en")
      }
    `;

    const url = new URL("https://query.wikidata.org/sparql");
    url.searchParams.append("query", sparqlQuery);
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/sparql-results+json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as any;
    const results = data.results?.bindings || [];

    return results.map((r: any) => r.countryLabel?.value || "").filter((v: string) => v);
  } catch (error) {
    console.error("Error querying Wikidata distribution:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const wikidataSyncRouter = router({
  /**
   * Search for a taxon on Wikidata by scientific name
   */
  searchTaxon: publicProcedure
    .input(
      z.object({
        scientificName: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const entity = await queryWikidataForTaxon(input.scientificName);

        if (!entity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Taxon "${input.scientificName}" not found on Wikidata`,
          });
        }

        return entity;
      } catch (error) {
        console.error("Error searching Wikidata:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search Wikidata",
        });
      }
    }),

  /**
   * Get detailed information about a taxon including hybrids and distribution
   */
  getTaxonDetails: publicProcedure
    .input(
      z.object({
        scientificName: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        // Get base entity
        const entity = await queryWikidataForTaxon(input.scientificName);

        if (!entity) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Taxon "${input.scientificName}" not found on Wikidata`,
          });
        }

        // Get hybrids and distribution in parallel
        const [hybrids, distribution] = await Promise.all([
          queryWikidataForHybrids(input.scientificName),
          queryWikidataForDistribution(input.scientificName),
        ]);

        return {
          ...entity,
          hybrids,
          distribution,
        };
      } catch (error) {
        console.error("Error fetching taxon details:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch taxon details",
        });
      }
    }),

  /**
   * Batch search for multiple taxa
   */
  batchSearchTaxa: publicProcedure
    .input(
      z.object({
        scientificNames: z.array(z.string().min(1)).min(1).max(50),
      })
    )
    .query(async ({ input }) => {
      try {
        const results = await Promise.all(
          input.scientificNames.map(async (name) => {
            const entity = await queryWikidataForTaxon(name);
            return {
              scientificName: name,
              found: entity !== null,
              entity: entity || null,
            };
          })
        );

        return {
          total: results.length,
          found: results.filter((r) => r.found).length,
          notFound: results.filter((r) => !r.found).length,
          results,
        };
      } catch (error) {
        console.error("Error batch searching Wikidata:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to batch search Wikidata",
        });
      }
    }),

  /**
   * Get Wikidata statistics and health check
   */
  getStats: publicProcedure.query(async () => {
    try {
      // Simple query to check if Wikidata is accessible
      const sparqlQuery = `
        SELECT (COUNT(?item) as ?count)
        WHERE {
          ?item wdt:P105 wd:Q7432 .
        }
      `;

      const url = new URL("https://query.wikidata.org/sparql");
      url.searchParams.append("query", sparqlQuery);
      url.searchParams.append("format", "json");

      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/sparql-results+json",
        },
      });

      if (!response.ok) {
        return {
          status: "error",
          message: "Wikidata SPARQL endpoint is not responding",
        };
      }

      return {
        status: "ok",
        message: "Wikidata SPARQL endpoint is accessible",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error checking Wikidata stats:", error);
      return {
        status: "error",
        message: "Failed to check Wikidata status",
      };
    }
  }),

  /**
   * Get recommendations for enriching a variety with Wikidata data
   */
  getEnrichmentRecommendations: protectedProcedure
    .input(
      z.object({
        genus: z.string(),
        species: z.string(),
        cultivar: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
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

        if (details.conservationStatus) {
          recommendations.push(`Update conservation status to: ${details.conservationStatus}`);
        }

        if (details.imageUrl) {
          recommendations.push(`Add image from Wikidata: ${details.imageUrl}`);
        }

        if (details.parentTaxon) {
          recommendations.push(`Add parent taxon: ${details.parentTaxon}`);
        }

        const hybrids = await queryWikidataForHybrids(scientificName);
        if (hybrids.length > 0) {
          recommendations.push(`Found ${hybrids.length} hybrid(s): ${hybrids.join(", ")}`);
        }

        const distribution = await queryWikidataForDistribution(scientificName);
        if (distribution.length > 0) {
          recommendations.push(`Update distribution: ${distribution.join(", ")}`);
        }

        return {
          found: true,
          wikidataId: details.id,
          scientificName: details.scientificName,
          recommendations,
          details,
        };
      } catch (error) {
        console.error("Error getting enrichment recommendations:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get enrichment recommendations",
        });
      }
    }),
});
