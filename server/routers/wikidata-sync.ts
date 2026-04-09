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
   * Get enrichment recommendations for a variety — returns structured recommendations
   * Defined as mutation so it can be called with useMutation() on the client
   */
  getEnrichmentRecommendations: publicProcedure
    .input(
      z.object({
        genus: z.string().min(1),
        species: z.string().min(1),
        cultivar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const scientificName = input.cultivar
        ? `${input.genus} ${input.species} '${input.cultivar}'`
        : `${input.genus} ${input.species}`;

      const details = await queryWikidataForTaxon(scientificName);

      if (!details) {
        // Try without cultivar if provided
        const baseScientificName = `${input.genus} ${input.species}`;
        const baseDetails = await queryWikidataForTaxon(baseScientificName);

        if (!baseDetails) {
          return {
            found: false,
            wikidataEntity: null,
            recommendations: [
              {
                type: 'synonyms',
                title: 'Taxon non trouvé sur Wikidata',
                description: `"${scientificName}" n'existe pas dans Wikidata. Vérifiez l'orthographe ou essayez le nom de base sans cultivar.`,
                priority: 'high',
                action: 'Vérifier le nom scientifique sur wikidata.org',
              },
            ],
          };
        }

        // Found at species level
        const [hybrids, distribution] = await Promise.all([
          queryWikidataForHybrids(baseScientificName),
          queryWikidataForDistribution(baseScientificName),
        ]);

        return buildRecommendations(baseDetails, hybrids, distribution, true);
      }

      const [hybrids, distribution] = await Promise.all([
        queryWikidataForHybrids(scientificName),
        queryWikidataForDistribution(scientificName),
      ]);

      return buildRecommendations(details, hybrids, distribution, false);
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Build structured recommendations
// ─────────────────────────────────────────────────────────────────────────────

function buildRecommendations(
  entity: WikidataEntity,
  hybrids: string[],
  distribution: string[],
  speciesLevelOnly: boolean
) {
  const recs: Array<{
    type: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    action?: string;
  }> = [];

  if (speciesLevelOnly) {
    recs.push({
      type: 'synonyms',
      title: 'Cultivar non trouvé — données au niveau espèce',
      description: 'Le cultivar spécifié n\'existe pas dans Wikidata. Les données affichées sont au niveau espèce.',
      priority: 'medium',
      action: 'Vérifier si le cultivar est documenté sous un autre nom',
    });
  }

  if (!entity.conservationStatus) {
    recs.push({
      type: 'conservation',
      title: 'Statut de conservation IUCN manquant',
      description: 'Aucun statut IUCN trouvé sur Wikidata pour ce taxon.',
      priority: 'medium',
      action: 'Vérifier sur iucnredlist.org et ajouter le statut manuellement',
    });
  } else {
    recs.push({
      type: 'conservation',
      title: `Statut IUCN disponible : ${entity.conservationStatus}`,
      description: 'Importez ce statut dans votre base de données.',
      priority: 'low',
      action: `Mettre à jour le statut de conservation : ${entity.conservationStatus}`,
    });
  }

  if (!entity.imageUrl) {
    recs.push({
      type: 'images',
      title: 'Aucune image disponible sur Wikidata',
      description: 'Ce taxon n\'a pas d\'image sur Wikidata. Cherchez sur Wikimedia Commons ou Tropicos.',
      priority: 'medium',
      action: 'Uploader une image via /admin/variety-images → onglet Tropicos',
    });
  } else {
    recs.push({
      type: 'images',
      title: 'Image disponible sur Wikidata',
      description: 'Une image botanique est disponible. Importez-la dans votre galerie.',
      priority: 'low',
      action: 'Importer l\'image via /admin/variety-images',
    });
  }

  if (!entity.parentTaxon) {
    recs.push({
      type: 'parents',
      title: 'Taxon parent non documenté',
      description: 'La relation parentale de ce taxon n\'est pas renseignée dans Wikidata.',
      priority: 'high',
      action: 'Utiliser l\'import CSV généalogies pour ajouter les relations parentales',
    });
  } else {
    recs.push({
      type: 'parents',
      title: `Taxon parent : ${entity.parentTaxon}`,
      description: 'Relation parentale disponible. Vérifiez qu\'elle est bien enregistrée dans votre base.',
      priority: 'low',
      action: `Vérifier la relation avec ${entity.parentTaxon}`,
    });
  }

  if (hybrids.length === 0) {
    recs.push({
      type: 'hybrids',
      title: 'Aucun hybride documenté',
      description: 'Wikidata ne référence aucun hybride pour ce taxon.',
      priority: 'low',
      action: 'Vérifier dans la littérature scientifique',
    });
  } else {
    recs.push({
      type: 'hybrids',
      title: `${hybrids.length} hybride(s) trouvé(s)`,
      description: `Hybrides : ${hybrids.slice(0, 5).join(', ')}${hybrids.length > 5 ? ` et ${hybrids.length - 5} autres` : ''}.`,
      priority: 'medium',
      action: 'Importer les hybrides via l\'import CSV généalogies',
    });
  }

  if (distribution.length === 0) {
    recs.push({
      type: 'distribution',
      title: 'Distribution géographique non documentée',
      description: 'Aucune donnée de distribution disponible sur Wikidata.',
      priority: 'medium',
      action: 'Consulter GBIF pour les données d\'occurrence géographique',
    });
  } else {
    recs.push({
      type: 'distribution',
      title: `Distribution : ${distribution.length} pays/régions`,
      description: `Zones : ${distribution.slice(0, 5).join(', ')}${distribution.length > 5 ? ` et ${distribution.length - 5} autres` : ''}.`,
      priority: 'low',
      action: 'Visualiser sur la carte GBIF',
    });
  }

  return {
    found: true,
    wikidataEntity: {
      qid: entity.id,
      label: entity.label,
      description: entity.description,
      scientificName: entity.scientificName,
      taxonRank: entity.taxonRank,
      conservationStatus: entity.conservationStatus,
      imageUrl: entity.imageUrl,
      parentTaxon: entity.parentTaxon,
      hybrids,
      distribution,
    },
    recommendations: recs,
  };
}
