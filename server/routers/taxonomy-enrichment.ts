/**
 * taxonomy-enrichment.ts — Rapport 16
 * Enrichissement taxonomique en masse des plantes sans family/genus
 * Stratégies : Wikidata (QID direct ou recherche par nom) + GBIF (nom latin)
 * Procédures : getPlantsWithoutFamily, enrichPlantTaxonomy, applyTaxonomyBatch, getTaxonomyCoverageStats
 */
import { z } from "zod";
import mysql from "mysql2/promise";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getMysqlConnection } from "../db/mysqlPool";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaxonomyCandidate {
  family: string;
  genus: string;
  order?: string;
  phylum?: string;
  kingdom?: string;
  source: "wikidata_qid" | "wikidata_name" | "gbif" | "manual";
  confidence: number; // 0–100
  sourceLabel?: string; // label Wikidata ou nom GBIF
  sourceUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getDbConn() {
  return getMysqlConnection();
}

/** Extraire le genre depuis un nom latin (premier mot si majuscule+lettres) */
function extractGenus(latinName: string): string {
  const first = latinName.trim().split(/\s+/)[0] || "";
  return /^[A-Z][a-z]+$/.test(first) ? first : "";
}

/** Vérifier si une chaîne ressemble à un QID Wikidata */
function isQid(s: string): boolean {
  return /^Q\d+$/.test(s.trim());
}

/** Interroger Wikidata par QID pour récupérer la taxonomie */
async function fetchTaxonomyFromWikidataQid(qid: string): Promise<TaxonomyCandidate | null> {
  try {
    // Utiliser P171+ (ancêtres directs, exclut le nœud lui-même) + SERVICE wikibase:label
    const sparql = `
SELECT DISTINCT ?ancestor ?ancestorLabel ?rankLabel WHERE {
  wd:${qid} wdt:P171+ ?ancestor .
  ?ancestor wdt:P105 ?rank .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 30`;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const resp = await fetch(url, {
      headers: { Accept: "application/sparql-results+json", "User-Agent": "PERFUMUM-Research/1.0" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) return null;

    const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
    const bindings = data.results?.bindings || [];
    if (!bindings.length) return null;

    // Mapper les rangs Wikidata vers les niveaux taxonomiques
    // Q35409 = famille, Q36602 = ordre, Q38348 = phylum/division, Q34740 = genre, Q36732 = règne
    // On utilise le label du rang pour détecter le niveau
    let family = "";
    let genus = "";
    let order = "";
    let phylum = "";
    let kingdom = "";

    for (const b of bindings) {
      const rankLabel = (b.rankLabel?.value || "").toLowerCase();
      const label = b.ancestorLabel?.value || "";
      if (!label || label.startsWith("Q")) continue; // ignorer les QIDs sans label

      if (rankLabel === "famille" || rankLabel === "family") family = label;
      else if (rankLabel === "genre" || rankLabel === "genus") genus = label;
      else if (rankLabel === "ordre" || rankLabel === "order") order = label;
      else if (rankLabel === "phylum" || rankLabel === "division" || rankLabel === "embranchement") phylum = label;
      else if (rankLabel === "règne" || rankLabel === "kingdom" || rankLabel === "règne" || rankLabel === "plant") kingdom = label;
    }

    if (!family && !genus) return null;

    return {
      family,
      genus,
      order: order || undefined,
      phylum: phylum || undefined,
      kingdom: kingdom || undefined,
      source: "wikidata_qid",
      confidence: 90,
      sourceUrl: `https://www.wikidata.org/wiki/${qid}`,
    };
  } catch {
    return null;
  }
}

/** Interroger Wikidata par recherche de nom pour récupérer la taxonomie */
async function fetchTaxonomyFromWikidataName(name: string): Promise<TaxonomyCandidate | null> {
  try {
    // Étape 1 : chercher l'entité par nom
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=fr&type=item&limit=3&format=json`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const searchResp = await fetch(searchUrl, {
      headers: { "User-Agent": "PERFUMUM-Research/1.0" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!searchResp.ok) return null;

    const searchData = await searchResp.json() as { search?: Array<{ id: string; label: string; description?: string }> };
    const hit = searchData.search?.[0];
    if (!hit) return null;

    // Étape 2 : récupérer la taxonomie depuis le QID trouvé
    const result = await fetchTaxonomyFromWikidataQid(hit.id);
    if (result) {
      result.source = "wikidata_name";
      result.confidence = 70;
      result.sourceLabel = hit.label;
      result.sourceUrl = `https://www.wikidata.org/wiki/${hit.id}`;
    }
    return result;
  } catch {
    return null;
  }
}

/** Interroger GBIF par nom latin pour récupérer la taxonomie */
async function fetchTaxonomyFromGBIF(latinName: string): Promise<TaxonomyCandidate | null> {
  try {
    const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(latinName)}&verbose=false`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const resp = await fetch(url, {
      headers: { "User-Agent": "PERFUMUM-Research/1.0" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) return null;

    const data = await resp.json() as {
      matchType?: string;
      confidence?: number;
      family?: string;
      genus?: string;
      order?: string;
      phylum?: string;
      kingdom?: string;
      usageKey?: number;
      scientificName?: string;
    };

    if (!data.family && !data.genus) return null;
    if (data.matchType === "NONE") return null;

    return {
      family: data.family || "",
      genus: data.genus || "",
      order: data.order || undefined,
      phylum: data.phylum || undefined,
      kingdom: data.kingdom || undefined,
      source: "gbif",
      confidence: Math.min(data.confidence || 50, 95),
      sourceLabel: data.scientificName || latinName,
      sourceUrl: data.usageKey ? `https://www.gbif.org/species/${data.usageKey}` : undefined,
    };
  } catch {
    return null;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const taxonomyEnrichmentRouter = router({

  /**
   * Statistiques de couverture taxonomique
   */
  getTaxonomyCoverageStats: publicProcedure
    .query(async () => {
      const conn = await getDbConn();
      try {
        const [[{ total }]] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as total FROM plants");
        const [[{ withFamily }]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as withFamily FROM plants WHERE family IS NOT NULL AND family != ''"
        );
        const [[{ withoutFamily }]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as withoutFamily FROM plants WHERE family IS NULL OR family = ''"
        );
        const [[{ withQidNoFamily }]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as withQidNoFamily FROM plants WHERE (family IS NULL OR family = '') AND wikidata_qid IS NOT NULL AND wikidata_qid != ''"
        );
        const [[{ withLatinNoFamily }]] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT COUNT(*) as withLatinNoFamily FROM plants WHERE (family IS NULL OR family = '') AND latin_name IS NOT NULL AND latin_name != ''"
        );
        return {
          total: Number(total),
          withFamily: Number(withFamily),
          withoutFamily: Number(withoutFamily),
          withQidNoFamily: Number(withQidNoFamily),
          withLatinNoFamily: Number(withLatinNoFamily),
          coveragePercent: Math.round((Number(withFamily) / Number(total)) * 100),
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Liste paginée des plantes sans family
   */
  getPlantsWithoutFamily: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(10).max(100).default(20),
      search: z.string().max(100).optional(),
    }))
    .query(async ({ input }) => {
      const conn = await getDbConn();
      try {
        const offset = (input.page - 1) * input.pageSize;
        let whereClause = "(family IS NULL OR family = '')";
        const params: (string | number)[] = [];

        if (input.search?.trim()) {
          whereClause += " AND (name LIKE ? OR latin_name LIKE ?)";
          const q = `%${input.search.trim()}%`;
          params.push(q, q);
        }

        const [countRows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM plants WHERE ${whereClause}`,
          params
        );
        const total = Number((countRows[0] as Record<string, unknown>).total);

        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT id, name, latin_name, family, wikidata_qid, gbif_id
           FROM plants
           WHERE ${whereClause}
           ORDER BY name ASC
           LIMIT ? OFFSET ?`,
          [...params, Number(input.pageSize), Number(offset)]
        );

        return {
          plants: rows.map((r) => ({
            id: r.id as number,
            name: r.name as string,
            latinName: (r.latin_name as string) || null,
            family: (r.family as string) || null,
            wikidataQid: (r.wikidata_qid as string) || null,
            gbifId: (r.gbif_id as string) || null,
          })),
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Enrichir une plante spécifique : recherche multi-source
   */
  enrichPlantTaxonomy: publicProcedure
    .input(z.object({ plantId: z.number().int() }))
    .query(async ({ input }) => {
      const conn = await getDbConn();
      try {
        const [plantRows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name, latin_name, family, wikidata_qid FROM plants WHERE id = ? LIMIT 1",
          [input.plantId]
        );
        const plant = plantRows[0];
        if (!plant) throw new Error("Plante introuvable");

        const name = plant.name as string;
        const latinName = (plant.latin_name as string) || "";
        const qid = (plant.wikidata_qid as string) || "";

        const candidates: TaxonomyCandidate[] = [];

        // Stratégie 1 : QID Wikidata direct
        if (qid && isQid(qid)) {
          const result = await fetchTaxonomyFromWikidataQid(qid);
          if (result) candidates.push(result);
        }

        // Stratégie 2 : latin_name est un QID (cas des plantes importées avec QID comme latin_name)
        if (!candidates.length && latinName && isQid(latinName)) {
          const result = await fetchTaxonomyFromWikidataQid(latinName);
          if (result) {
            result.source = "wikidata_qid";
            result.confidence = 85;
            candidates.push(result);
          }
        }

        // Stratégie 3 : GBIF avec nom latin valide (genus + species)
        const genus = extractGenus(latinName);
        if (!candidates.length && genus && latinName.includes(" ")) {
          const result = await fetchTaxonomyFromGBIF(latinName);
          if (result) candidates.push(result);
        }

        // Stratégie 4 : GBIF avec genre seul
        if (!candidates.length && genus) {
          const result = await fetchTaxonomyFromGBIF(genus);
          if (result) {
            result.confidence = Math.max(result.confidence - 20, 30);
            candidates.push(result);
          }
        }

        // Stratégie 5 : Wikidata par nom vernaculaire (fallback)
        if (!candidates.length) {
          const searchName = genus || name;
          const result = await fetchTaxonomyFromWikidataName(searchName);
          if (result) candidates.push(result);
        }

        return {
          plant: {
            id: plant.id as number,
            name,
            latinName: latinName || null,
            currentFamily: (plant.family as string) || null,
            wikidataQid: qid || null,
          },
          candidates,
          bestCandidate: candidates.length > 0 ? candidates[0] : null,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Appliquer la taxonomie à une plante
   */
  applyTaxonomy: protectedProcedure
    .input(z.object({
      plantId: z.number().int(),
      family: z.string().min(1).max(200),
      genus: z.string().max(100).optional(),
      order: z.string().max(100).optional(),
      phylum: z.string().max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDbConn();
      try {
        // Vérifier que la plante existe et n'a pas déjà une family
        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name, family FROM plants WHERE id = ? LIMIT 1",
          [input.plantId]
        );
        const plant = rows[0];
        if (!plant) throw new Error("Plante introuvable");

        await conn.query(
          "UPDATE plants SET family = ? WHERE id = ?",
          [input.family, input.plantId]
        );

        return {
          success: true,
          plantId: input.plantId,
          plantName: plant.name as string,
          family: input.family,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Batch automatique : enrichir toutes les plantes sans family (une par une)
   * Retourne les résultats pour validation avant application
   */
  runBatchEnrichment: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(50).default(10),
      offset: z.number().int().min(0).default(0),
      minConfidence: z.number().int().min(0).max(100).default(70),
    }))
    .query(async ({ input }) => {
      const conn = await getDbConn();
      try {
        const [plants] = await conn.query<mysql.RowDataPacket[]>(
          "SELECT id, name, latin_name, family, wikidata_qid FROM plants WHERE family IS NULL OR family = '' ORDER BY name ASC LIMIT ? OFFSET ?",
          [Number(input.limit), Number(input.offset)]
        );

        const results: Array<{
          plantId: number;
          plantName: string;
          latinName: string | null;
          wikidataQid: string | null;
          candidate: TaxonomyCandidate | null;
          autoApply: boolean;
        }> = [];

        for (const plant of plants) {
          const name = plant.name as string;
          const latinName = (plant.latin_name as string) || "";
          const qid = (plant.wikidata_qid as string) || "";

          let candidate: TaxonomyCandidate | null = null;

          // Stratégie 1 : QID Wikidata direct
          if (qid && isQid(qid)) {
            candidate = await fetchTaxonomyFromWikidataQid(qid);
          }

          // Stratégie 2 : latin_name est un QID
          if (!candidate && latinName && isQid(latinName)) {
            candidate = await fetchTaxonomyFromWikidataQid(latinName);
            if (candidate) { candidate.source = "wikidata_qid"; candidate.confidence = 85; }
          }

          // Stratégie 3 : GBIF avec nom latin
          const genus = extractGenus(latinName);
          if (!candidate && genus && latinName.includes(" ")) {
            candidate = await fetchTaxonomyFromGBIF(latinName);
          }

          // Stratégie 4 : GBIF genre seul
          if (!candidate && genus) {
            candidate = await fetchTaxonomyFromGBIF(genus);
            if (candidate) candidate.confidence = Math.max(candidate.confidence - 20, 30);
          }

          // Stratégie 5 : Wikidata par nom
          if (!candidate) {
            candidate = await fetchTaxonomyFromWikidataName(genus || name);
          }

          results.push({
            plantId: plant.id as number,
            plantName: name,
            latinName: latinName || null,
            wikidataQid: qid || null,
            candidate,
            autoApply: !!(candidate && candidate.confidence >= input.minConfidence && candidate.family),
          });

          // Petite pause pour éviter le rate-limiting
          await new Promise((r) => setTimeout(r, 200));
        }

        return {
          results,
          total: results.length,
          autoApplyCount: results.filter((r) => r.autoApply).length,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Appliquer en lot les résultats du batch (ceux avec autoApply = true)
   */
  applyBatchTaxonomy: protectedProcedure
    .input(z.object({
      applications: z.array(z.object({
        plantId: z.number().int(),
        family: z.string().min(1).max(200),
      })).min(1).max(100),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDbConn();
      try {
        let applied = 0;
        const errors: string[] = [];

        for (const app of input.applications) {
          try {
            await conn.query(
              "UPDATE plants SET family = ? WHERE id = ? AND (family IS NULL OR family = '')",
              [app.family, app.plantId]
            );
            applied++;
          } catch (e) {
            errors.push(`Plante ${app.plantId}: ${(e as Error).message}`);
          }
        }

        return { applied, errors, total: input.applications.length };
      } finally {
        await conn.end();
      }
    }),
});
