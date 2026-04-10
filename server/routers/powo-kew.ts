// @ts-nocheck
/**
 * POWO / Kew Gardens Router
 * ─────────────────────────────────────────────────────────────────────────────
 * Plants of the World Online (POWO) — Kew Royal Botanic Gardens
 * API REST publique, gratuite, sans authentification.
 *
 * Données accessibles :
 *  - Taxonomie acceptée (1,445,000 noms)
 *  - Descriptions morphologiques (530,400)
 *  - Images botaniques (509,900)
 *  - Distribution géographique (WGSRPD Level 3)
 *  - Synonymes et noms acceptés
 *  - Liens vers IPNI, Tropicos, Wikidata
 *
 * Référence : https://powo.science.kew.org/
 * API : https://powo.science.kew.org/api/2/
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

const POWO_BASE = "https://powo.science.kew.org/api/2";
const DELAY_MS = 500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Helpers POWO ─────────────────────────────────────────────────────────────

async function powoGet<T = any>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const qs = new URLSearchParams({ ...params, fields: params.fields ?? "all" }).toString();
  const url = `${POWO_BASE}${path}?${qs}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "PERFUMUM-Research/1.0 (research@perfumum.org)",
      },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const powoKewRouter = router({
  /**
   * Recherche par nom scientifique
   */
  searchByName: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      limit: z.number().default(10),
      cursor: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const data = await powoGet("/search", {
        q: input.name,
        size: String(input.limit),
        cursor: String(input.cursor),
        fields: "accepted,author,description,distribution,images,synonymOf,taxonomicStatus",
      });

      if (!data?.results) return { found: false, total: 0, results: [] };

      return {
        found: true,
        total: data.totalResults ?? 0,
        cursor: data.cursor ?? null,
        results: data.results.map((r: any) => ({
          fqId: r.fqId,
          name: r.name,
          author: r.author,
          rank: r.rank,
          family: r.family,
          taxonomicStatus: r.taxonomicStatus,
          accepted: r.accepted,
          synonymOf: r.synonymOf?.name ?? null,
          hasImages: (r.images?.length ?? 0) > 0,
          hasDescription: !!r.description,
          powoUrl: `https://powo.science.kew.org/taxon/${r.fqId}`,
        })),
      };
    }),

  /**
   * Détails complets d'un taxon par FQID (ex: "urn:lsid:ipni.org:names:30001404-2")
   */
  getTaxonDetails: publicProcedure
    .input(z.object({ fqId: z.string().min(5) }))
    .query(async ({ input }) => {
      // Encoder le fqId pour l'URL
      const encodedId = encodeURIComponent(input.fqId);
      const data = await powoGet(`/taxon/${encodedId}`, {
        fields: "accepted,author,description,distribution,images,synonymOf,taxonomicStatus,nomenclature",
      });

      if (!data) return { found: false, data: null };

      return {
        found: true,
        data: {
          fqId: data.fqId,
          name: data.name,
          author: data.author,
          rank: data.rank,
          family: data.family,
          taxonomicStatus: data.taxonomicStatus,
          accepted: data.accepted,
          synonymOf: data.synonymOf?.name ?? null,
          description: data.description ?? null,
          // Distribution WGSRPD Level 3
          nativeDistribution: (data.distribution?.natives ?? []).map((d: any) => ({
            tdwgCode: d.tdwgCode,
            name: d.name,
            establishment: d.establishment,
          })),
          introducedDistribution: (data.distribution?.introduced ?? []).map((d: any) => ({
            tdwgCode: d.tdwgCode,
            name: d.name,
          })),
          // Images
          images: (data.images ?? []).slice(0, 6).map((img: any) => ({
            url: img.fullsize ?? img.thumbnail,
            thumbnail: img.thumbnail,
            caption: img.caption ?? "",
            credit: img.credit ?? "",
          })),
          // Nomenclature
          nomenclature: data.nomenclature ?? null,
          powoUrl: `https://powo.science.kew.org/taxon/${data.fqId}`,
          ipniUrl: data.fqId ? `https://www.ipni.org/n/${data.fqId.replace("urn:lsid:ipni.org:names:", "")}` : null,
        },
      };
    }),

  /**
   * Synonymes d'un taxon
   */
  getSynonyms: publicProcedure
    .input(z.object({ fqId: z.string().min(5) }))
    .query(async ({ input }) => {
      const encodedId = encodeURIComponent(input.fqId);
      const data = await powoGet(`/taxon/${encodedId}/synonyms`);

      if (!data?.synonyms) return { found: false, synonyms: [] };

      return {
        found: true,
        synonyms: data.synonyms.map((s: any) => ({
          fqId: s.fqId,
          name: s.name,
          author: s.author,
          rank: s.rank,
        })),
      };
    }),

  /**
   * Distribution géographique détaillée
   */
  getDistribution: publicProcedure
    .input(z.object({ fqId: z.string().min(5) }))
    .query(async ({ input }) => {
      const encodedId = encodeURIComponent(input.fqId);
      const data = await powoGet(`/taxon/${encodedId}`, {
        fields: "distribution",
      });

      if (!data?.distribution) return { found: false, distribution: null };

      const natives = data.distribution.natives ?? [];
      const introduced = data.distribution.introduced ?? [];

      // Regrouper par région TDWG Level 1
      const regionMap: Record<string, string[]> = {};
      for (const area of natives) {
        const region = area.tdwgCode?.charAt(0) ?? "?";
        if (!regionMap[region]) regionMap[region] = [];
        regionMap[region].push(area.name);
      }

      return {
        found: true,
        distribution: {
          nativeCount: natives.length,
          introducedCount: introduced.length,
          nativeAreas: natives.map((d: any) => d.name),
          introducedAreas: introduced.map((d: any) => d.name),
          byRegion: regionMap,
        },
      };
    }),

  /**
   * Enrichissement d'une plante PERFUMUM via POWO
   * Met à jour powId, synonymes, authorCitation
   */
  enrichPlant: publicProcedure
    .input(z.object({
      plantId: z.number(),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const [plant] = await db.select().from(plants).where(eq(plants.id, input.plantId)).limit(1);
      if (!plant?.latinName) return { success: false, message: "Plante non trouvée ou sans nom latin" };

      // Recherche POWO
      const searchData = await powoGet("/search", {
        q: plant.latinName,
        size: "5",
        fields: "accepted,author,synonymOf,taxonomicStatus",
      });

      if (!searchData?.results?.length) {
        return { success: false, message: `"${plant.latinName}" non trouvée dans POWO` };
      }

      // Prendre le premier résultat accepté
      const best = searchData.results.find((r: any) => r.taxonomicStatus === "Accepted") ?? searchData.results[0];

      const updateData: Record<string, any> = {};
      const steps: string[] = [];

      if (best.fqId && !plant.powId) {
        updateData.powId = best.fqId;
        steps.push(`POWO ID: ${best.fqId}`);
      }

      if (best.author && !plant.authorCitation) {
        updateData.authorCitation = best.author;
        steps.push(`Auteur: ${best.author}`);
      }

      // Récupérer les synonymes si pas encore présents
      if (!plant.synonyms || (Array.isArray(plant.synonyms) && plant.synonyms.length === 0)) {
        await sleep(DELAY_MS);
        const encodedId = encodeURIComponent(best.fqId);
        const synData = await powoGet(`/taxon/${encodedId}/synonyms`);
        if (synData?.synonyms?.length) {
          const synonymList = synData.synonyms.map((s: any) => s.name).filter(Boolean);
          if (synonymList.length > 0) {
            updateData.synonyms = synonymList;
            steps.push(`${synonymList.length} synonymes POWO`);
          }
        }
      }

      if (!input.dryRun && Object.keys(updateData).length > 0) {
        await db.update(plants).set(updateData).where(eq(plants.id, input.plantId));
      }

      return {
        success: true,
        dryRun: input.dryRun,
        message: input.dryRun
          ? `[DRY RUN] ${steps.length} champs à mettre à jour pour "${plant.name}"`
          : `${plant.name} enrichie avec ${steps.length} champs POWO`,
        steps,
        fieldsUpdated: input.dryRun ? 0 : Object.keys(updateData).length,
        powoUrl: `https://powo.science.kew.org/taxon/${best.fqId}`,
        data: {
          fqId: best.fqId,
          name: best.name,
          author: best.author,
          taxonomicStatus: best.taxonomicStatus,
          family: best.family,
        },
      };
    }),

  /**
   * Batch enrichissement POWO pour toutes les plantes sans powId
   */
  batchEnrichPlants: publicProcedure
    .input(z.object({
      limit: z.number().default(20),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const plantsToEnrich = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: plants.latinName,
        powId: plants.powId,
        authorCitation: plants.authorCitation,
        synonyms: plants.synonyms,
      }).from(plants)
        .where(sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != '' AND (${plants.powId} IS NULL OR ${plants.powId} = '')`)
        .limit(input.limit);

      const results = [];
      let enriched = 0;

      for (const plant of plantsToEnrich) {
        await sleep(DELAY_MS);

        const searchData = await powoGet("/search", {
          q: plant.latinName!,
          size: "3",
          fields: "accepted,author,synonymOf,taxonomicStatus",
        });

        if (!searchData?.results?.length) {
          results.push({ id: plant.id, name: plant.name, latinName: plant.latinName, found: false });
          continue;
        }

        const best = searchData.results.find((r: any) => r.taxonomicStatus === "Accepted") ?? searchData.results[0];
        const updateData: Record<string, any> = {};

        if (best.fqId) updateData.powId = best.fqId;
        if (best.author && !plant.authorCitation) updateData.authorCitation = best.author;

        results.push({
          id: plant.id,
          name: plant.name,
          latinName: plant.latinName,
          found: true,
          fqId: best.fqId,
          taxonomicStatus: best.taxonomicStatus,
          author: best.author,
          powoUrl: `https://powo.science.kew.org/taxon/${best.fqId}`,
        });

        if (!input.dryRun && Object.keys(updateData).length > 0) {
          await db.update(plants).set(updateData).where(eq(plants.id, plant.id));
          enriched++;
        }
      }

      return {
        success: true,
        total: plantsToEnrich.length,
        found: results.filter((r) => r.found).length,
        enriched: input.dryRun ? 0 : enriched,
        dryRun: input.dryRun,
        results,
      };
    }),

  /**
   * Statut de l'API POWO
   */
  getStatus: publicProcedure.query(async () => {
    const data = await powoGet("/search", { q: "Nicotiana tabacum", size: "1" });
    return {
      status: data?.results?.length ? "online" : "offline",
      apiUrl: POWO_BASE,
      coverage: {
        names: "1,445,000+",
        descriptions: "530,400+",
        images: "509,900+",
        source: "Kew Royal Botanic Gardens",
      },
    };
  }),
});
