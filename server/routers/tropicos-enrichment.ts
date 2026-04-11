/**
 * tropicos-enrichment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for Tropicos API (Missouri Botanical Garden)
 * Provides plant nomenclature, synonyms, distribution, images, and references
 * API: https://services.tropicos.org/
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const TROPICOS_BASE = "https://services.tropicos.org/Name";

async function tropicosGet<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    const url = new URL(`${TROPICOS_BASE}${path}`);
    url.searchParams.set("format", "json");
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "PERFUMUM-Research/1.0 (contact@absorbe.ch)" },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    // Tropicos returns { Error: "..." } when nothing found
    if (data && typeof data === "object" && !Array.isArray(data) && "Error" in data) return null;
    return data as T;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const tropicosEnrichmentRouter = router({

  /** Search names in Tropicos */
  searchName: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      type: z.string().optional(),
      limit: z.number().optional().default(20),
    }))
    .query(async ({ input }) => {
      const results = await tropicosGet<Record<string, unknown>[]>("/Search", {
        name: input.name,
        pagesize: String(input.limit),
        ...(input.type ? { type: input.type } : {}),
      });

      if (!results) return { success: true, total: 0, results: [] };

      return {
        success: true,
        total: results.length,
        results: results.map((r) => ({
          nameId: r["NameId"],
          scientificName: r["ScientificName"],
          scientificNameWithAuthors: r["ScientificNameWithAuthors"],
          author: r["Author"],
          family: r["Family"],
          rank: r["Rank"],
          nomenclatureStatus: r["NomenclatureStatusName"],
          year: r["DisplayDate"],
          symbol: r["Symbol"],
          url: r["Url"],
        })),
      };
    }),

  /** Get full details for a NameId */
  getNameDetails: publicProcedure
    .input(z.object({ nameId: z.number() }))
    .query(async ({ input }) => {
      const data = await tropicosGet<Record<string, unknown>>(`/${input.nameId}`);
      if (!data) throw new TRPCError({ code: "NOT_FOUND", message: `NameId ${input.nameId} introuvable` });
      return { success: true, data };
    }),

  /** Get synonyms for a NameId */
  getSynonyms: publicProcedure
    .input(z.object({ nameId: z.number() }))
    .query(async ({ input }) => {
      const results = await tropicosGet<Record<string, unknown>[]>(`/${input.nameId}/Synonyms`);
      if (!results) return { success: true, total: 0, results: [] };
      return {
        success: true,
        total: results.length,
        results: results.map((s) => ({
          synonymNameId: s["SynonymNameId"],
          scientificName: s["ScientificName"],
          scientificNameWithAuthors: s["ScientificNameWithAuthors"],
          author: s["Author"],
          nomenclatureStatus: s["NomenclatureStatusName"],
        })),
      };
    }),

  /** Get distribution for a NameId */
  getDistribution: publicProcedure
    .input(z.object({ nameId: z.number() }))
    .query(async ({ input }) => {
      const results = await tropicosGet<Record<string, unknown>[]>(`/${input.nameId}/DistributionMap`);
      if (!results) return { success: true, total: 0, results: [] };
      return {
        success: true,
        total: results.length,
        results: results.map((d) => ({
          region: d["Region"],
          nativeStatus: d["NativeStatus"],
          country: d["CountryName"],
        })),
      };
    }),

  /** Get images for a NameId */
  getImages: publicProcedure
    .input(z.object({ nameId: z.number(), limit: z.number().optional().default(10) }))
    .query(async ({ input }) => {
      const results = await tropicosGet<Record<string, unknown>[]>(`/${input.nameId}/Images`, {
        pagesize: String(input.limit),
      });
      if (!results) return { success: true, total: 0, results: [] };
      return {
        success: true,
        total: results.length,
        results: results.map((img) => ({
          imageId: img["ImageId"],
          thumbnailUrl: img["ThumbnailUrl"],
          largeUrl: img["LargeUrl"],
          copyright: img["CopyrightText"],
          caption: img["Caption"],
        })),
      };
    }),

  /** Batch search multiple plant names */
  batchSearchNames: publicProcedure
    .input(z.object({
      names: z.array(z.string().min(1)).min(1).max(20),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      const results = [];
      let matched = 0;

      for (const name of input.names) {
        const found = await tropicosGet<Record<string, unknown>[]>("/Search", {
          name,
          pagesize: String(input.limit),
        });

        if (found && found.length > 0) {
          const best = found[0];
          results.push({
            input: name,
            success: true,
            found: true,
            nameId: best["NameId"] as number | null,
            scientificName: best["ScientificName"] as string | null,
            author: best["Author"] as string | null,
            family: best["Family"] as string | null,
            rank: best["Rank"] as string | null,
            nomenclatureStatus: best["NomenclatureStatusName"] as string | null,
            year: best["DisplayDate"] as string | null,
            url: best["Url"] as string | null,
          });
          matched++;
        } else {
          results.push({ input: name, success: false, found: false });
        }

        // Rate limiting: 300ms entre requêtes
        await new Promise((r) => setTimeout(r, 300));
      }

      return {
        success: true,
        total: input.names.length,
        matched,
        failed: input.names.length - matched,
        results,
      };
    }),

  /** Full enrichment: search + synonyms + distribution + images */
  enrichPlant: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .mutation(async ({ input }) => {
      const searchResults = await tropicosGet<Record<string, unknown>[]>("/Search", {
        name: input.scientificName,
        pagesize: "5",
      });

      if (!searchResults || searchResults.length === 0) {
        return { found: false, message: `Aucun résultat Tropicos pour "${input.scientificName}"`, data: null };
      }

      const best = searchResults.find(
        (r) => r["NomenclatureStatusName"] === "Legitimate"
      ) ?? searchResults[0];

      const nameId = best["NameId"] as number;

      const [synonymsData, distributionData, imagesData] = await Promise.allSettled([
        tropicosGet<Record<string, unknown>[]>(`/${nameId}/Synonyms`),
        tropicosGet<Record<string, unknown>[]>(`/${nameId}/DistributionMap`),
        tropicosGet<Record<string, unknown>[]>(`/${nameId}/Images`, { pagesize: "4" }),
      ]);

      const synonyms = synonymsData.status === "fulfilled" && Array.isArray(synonymsData.value)
        ? synonymsData.value.map((s) => s["ScientificNameWithAuthors"] as string)
        : [];

      const distribution = distributionData.status === "fulfilled" && Array.isArray(distributionData.value)
        ? distributionData.value.map((d) => `${d["CountryName"]} (${d["NativeStatus"]})`)
        : [];

      const images = imagesData.status === "fulfilled" && Array.isArray(imagesData.value)
        ? imagesData.value.map((img) => ({
            thumbnailUrl: img["ThumbnailUrl"] as string,
            largeUrl: img["LargeUrl"] as string,
            copyright: img["CopyrightText"] as string,
          }))
        : [];

      return {
        found: true,
        message: `Données Tropicos récupérées pour "${best["ScientificName"]}"`,
        data: {
          nameId,
          scientificName: best["ScientificName"] as string,
          scientificNameWithAuthors: best["ScientificNameWithAuthors"] as string,
          author: best["Author"] as string,
          family: best["Family"] as string,
          rank: best["Rank"] as string,
          nomenclatureStatus: best["NomenclatureStatusName"] as string,
          year: best["DisplayDate"] as string,
          tropicosUrl: best["Url"] as string,
          synonyms,
          distribution,
          images,
        },
      };
    }),

  /** API status & coverage info */
  getStats: publicProcedure.query(async () => {
    // Quick ping to check if Tropicos API is responding
    const ping = await tropicosGet<Record<string, unknown>[]>("/Search", { name: "Rosa", pagesize: "1" });
    return {
      success: true,
      status: ping ? "online" : "offline",
      coverage: {
        scientificNames: "1.33M+",
        images: "685K+",
        specimens: "4.9M+",
        references: "500K+",
      },
      apiUrl: "https://services.tropicos.org/",
    };
  }),
});
