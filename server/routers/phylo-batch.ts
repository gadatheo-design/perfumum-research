// @ts-nocheck
/**
 * Phylo Batch Router
 * ─────────────────────────────────────────────────────────────────────────────
 * Procédures de traitement en lot par genre botanique.
 *
 * Fonctionnalités :
 *  - batchByGenus : lance les 5 APIs (GBIF, POWO, NCBI, Tropicos, Wikidata)
 *    en parallèle pour toutes les plantes d'un genre donné
 *  - syncCrossIds : écrit les identifiants trouvés (ncbiTaxId, powId,
 *    wikidataQid, gbifId) directement dans la table plants
 *  - getGenera : liste les genres distincts présents en base
 *  - getCoverageReport : rapport de couverture avant/après enrichissement
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { eq, sql, like } from "drizzle-orm";

const DELAY_MS = 600;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Helpers externes ─────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, opts: RequestInit = {}, timeoutMs = 8000): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// POWO search
async function powoSearch(latinName: string): Promise<{ fqId: string | null; author: string | null; status: string | null }> {
  const url = `https://powo.science.kew.org/api/2/search?q=${encodeURIComponent(latinName)}&size=3&fields=accepted,author,synonymOf,taxonomicStatus`;
  try {
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/json", "User-Agent": "PERFUMUM-Research/1.0" } });
    if (!res?.ok) return { fqId: null, author: null, status: null };
    const data = await res.json();
    const best = data?.results?.find((r: any) => r.taxonomicStatus === "Accepted") ?? data?.results?.[0];
    if (!best) return { fqId: null, author: null, status: null };
    return { fqId: best.fqId ?? null, author: best.author ?? null, status: best.taxonomicStatus ?? null };
  } catch {
    return { fqId: null, author: null, status: null };
  }
}

// NCBI search
async function ncbiSearch(latinName: string): Promise<{ taxId: string | null; rank: string | null }> {
  const base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  const tool = "PERFUMUM-Research";
  const email = "research@perfumum.org";
  try {
    const searchUrl = `${base}/esearch.fcgi?db=taxonomy&term=${encodeURIComponent(latinName + "[Scientific Name]")}&retmode=json&tool=${tool}&email=${email}`;
    const searchRes = await fetchWithTimeout(searchUrl);
    if (!searchRes?.ok) return { taxId: null, rank: null };
    const searchData = await searchRes.json();
    const ids: number[] = (searchData?.esearchresult?.idlist ?? []).map(Number);
    if (!ids.length) return { taxId: null, rank: null };
    await sleep(400);
    const summaryUrl = `${base}/esummary.fcgi?db=taxonomy&id=${ids[0]}&retmode=json&tool=${tool}&email=${email}`;
    const summaryRes = await fetchWithTimeout(summaryUrl);
    if (!summaryRes?.ok) return { taxId: String(ids[0]), rank: null };
    const summaryData = await summaryRes.json();
    const record = summaryData?.result?.[String(ids[0])];
    return { taxId: String(ids[0]), rank: record?.rank ?? null };
  } catch {
    return { taxId: null, rank: null };
  }
}

// GBIF search
async function gbifSearch(latinName: string): Promise<{ gbifId: string | null; confidence: number | null }> {
  try {
    const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(latinName)}&strict=false`;
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
    if (!res?.ok) return { gbifId: null, confidence: null };
    const data = await res.json();
    if (!data?.usageKey) return { gbifId: null, confidence: null };
    return { gbifId: String(data.usageKey), confidence: data.confidence ?? null };
  } catch {
    return { gbifId: null, confidence: null };
  }
}

// Wikidata SPARQL search for cross-IDs
async function wikidataCrossIds(latinName: string): Promise<{ qid: string | null; ncbiId: string | null; gbifId: string | null; powId: string | null }> {
  const sparql = `
    SELECT ?taxon ?ncbiId ?gbifId ?powId WHERE {
      ?taxon wdt:P225 "${latinName.replace(/"/g, '\\"')}" .
      OPTIONAL { ?taxon wdt:P685 ?ncbiId . }
      OPTIONAL { ?taxon wdt:P846 ?gbifId . }
      OPTIONAL { ?taxon wdt:P5037 ?powId . }
    } LIMIT 1
  `;
  try {
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/sparql-results+json", "User-Agent": "PERFUMUM-Research/1.0 (research@perfumum.org)" } }, 12000);
    if (!res?.ok) return { qid: null, ncbiId: null, gbifId: null, powId: null };
    const data = await res.json();
    const b = data?.results?.bindings?.[0];
    if (!b) return { qid: null, ncbiId: null, gbifId: null, powId: null };
    const qid = b.taxon?.value ? b.taxon.value.replace("http://www.wikidata.org/entity/", "") : null;
    return {
      qid,
      ncbiId: b.ncbiId?.value ?? null,
      gbifId: b.gbifId?.value ?? null,
      powId: b.powId?.value ?? null,
    };
  } catch {
    return { qid: null, ncbiId: null, gbifId: null, powId: null };
  }
}

// Tropicos search
async function tropicosSearch(latinName: string): Promise<{ nameId: string | null; author: string | null }> {
  try {
    const url = `https://services.tropicos.org/Name/Search?name=${encodeURIComponent(latinName)}&type=wildcard&apikey=&format=json`;
    const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
    if (!res?.ok) return { nameId: null, author: null };
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : null;
    if (!first?.NameId) return { nameId: null, author: null };
    return { nameId: String(first.NameId), author: first.Author ?? null };
  } catch {
    return { nameId: null, author: null };
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const phyloBatchRouter = router({
  /**
   * Liste les genres botaniques distincts présents en base
   */
  getGenera: publicProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { genera: [] };
      const rows = await db.select({
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
      }).from(plants)
        .where(sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != ''`)
        .limit(2000);
      // Extract genus (first word of latinName)
      const genusMap = new Map<string, number>();
      for (const row of rows) {
        if (!row.latinName) continue;
        const genus = row.latinName.trim().split(/\s+/)[0];
        if (!genus || genus.length < 2) continue;
        genusMap.set(genus, (genusMap.get(genus) ?? 0) + 1);
      }
      let genera = Array.from(genusMap.entries())
        .map(([genus, count]) => ({ genus, count }))
        .sort((a, b) => b.count - a.count);
      if (input.search) {
        const s = input.search.toLowerCase();
        genera = genera.filter((g) => g.genus.toLowerCase().startsWith(s));
      }
      return { genera: genera.slice(0, 100) };
    }),

  /**
   * Rapport de couverture des cross-IDs pour un genre donné
   */
  getCoverageReport: publicProcedure
    .input(z.object({ genus: z.string().min(2) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { plants: [], summary: { total: 0, withGbif: 0, withPowo: 0, withNcbi: 0, withWikidata: 0, fullyEnriched: 0 } };
      const plantsInGenus = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        gbifId: plants.gbifId,
        powId: plants.powId,
        ncbiTaxId: plants.ncbiTaxId,
        wikidataQid: plants.wikidataQid,
        itisId: plants.itisId,
      }).from(plants)
        .where(sql`${plants.latinName} LIKE ${input.genus + " %"} OR ${plants.latinName} = ${input.genus}`)
        .limit(200);
      const summary = {
        total: plantsInGenus.length,
        withGbif: plantsInGenus.filter((p) => p.gbifId).length,
        withPowo: plantsInGenus.filter((p) => p.powId).length,
        withNcbi: plantsInGenus.filter((p) => p.ncbiTaxId).length,
        withWikidata: plantsInGenus.filter((p) => p.wikidataQid).length,
        fullyEnriched: plantsInGenus.filter((p) => p.gbifId && p.powId && p.ncbiTaxId && p.wikidataQid).length,
      };
      return { plants: plantsInGenus, summary };
    }),

  /**
   * Batch par genre : lance les 5 APIs en parallèle pour toutes les plantes
   * du genre donné et retourne un rapport de couverture avant/après.
   */
  batchByGenus: publicProcedure
    .input(z.object({
      genus: z.string().min(2),
      dryRun: z.boolean().default(true),
      apis: z.array(z.enum(["gbif", "powo", "ncbi", "wikidata", "tropicos"])).default(["gbif", "powo", "ncbi", "wikidata"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      // Récupérer toutes les plantes du genre
      const plantsInGenus = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        gbifId: plants.gbifId,
        powId: plants.powId,
        ncbiTaxId: plants.ncbiTaxId,
        wikidataQid: plants.wikidataQid,
        authorCitation: plants.authorCitation,
        synonyms: plants.synonyms,
        notes: plants.notes,
      }).from(plants)
        .where(sql`${plants.latinName} LIKE ${input.genus + " %"} OR ${plants.latinName} = ${input.genus}`)
        .limit(100);

      if (!plantsInGenus.length) {
        return {
          success: false,
          message: `Aucune plante trouvée pour le genre "${input.genus}"`,
          genus: input.genus,
          total: 0,
          results: [],
          summary: { before: { withGbif: 0, withPowo: 0, withNcbi: 0, withWikidata: 0 }, after: { withGbif: 0, withPowo: 0, withNcbi: 0, withWikidata: 0 } },
        };
      }

      // Snapshot avant
      const before = {
        withGbif: plantsInGenus.filter((p) => p.gbifId).length,
        withPowo: plantsInGenus.filter((p) => p.powId).length,
        withNcbi: plantsInGenus.filter((p) => p.ncbiTaxId).length,
        withWikidata: plantsInGenus.filter((p) => p.wikidataQid).length,
      };

      const results: any[] = [];

      for (const plant of plantsInGenus) {
        if (!plant.latinName) continue;
        await sleep(DELAY_MS);

        // Lancer les APIs sélectionnées en parallèle
        const [gbifResult, powoResult, ncbiResult, wikidataResult, tropicosResult] = await Promise.allSettled([
          input.apis.includes("gbif") ? gbifSearch(plant.latinName ?? "") : Promise.resolve(null),
          input.apis.includes("powo") ? powoSearch(plant.latinName ?? "") : Promise.resolve(null),
          input.apis.includes("ncbi") ? ncbiSearch(plant.latinName ?? "") : Promise.resolve(null),
          input.apis.includes("wikidata") ? wikidataCrossIds(plant.latinName ?? "") : Promise.resolve(null),
          input.apis.includes("tropicos") ? tropicosSearch(plant.latinName ?? "") : Promise.resolve(null),
        ]);

        const gbif = gbifResult.status === "fulfilled" ? gbifResult.value : null;
        const powo = powoResult.status === "fulfilled" ? powoResult.value : null;
        const ncbi = ncbiResult.status === "fulfilled" ? ncbiResult.value : null;
        const wikidata = wikidataResult.status === "fulfilled" ? wikidataResult.value : null;
        const tropicos = tropicosResult.status === "fulfilled" ? tropicosResult.value : null;

        // Construire les champs à mettre à jour
        const updateData: Record<string, any> = {};
        const newIds: Record<string, string | null> = {};

        if (gbif?.gbifId && !plant.gbifId) {
          updateData.gbifId = gbif.gbifId;
          newIds.gbif = gbif.gbifId;
        }
        if (powo?.fqId && !plant.powId) {
          updateData.powId = powo.fqId;
          newIds.powo = powo.fqId;
          if (powo.author && !plant.authorCitation) updateData.authorCitation = powo.author;
        }
        if (ncbi?.taxId && !plant.ncbiTaxId) {
          updateData.ncbiTaxId = ncbi.taxId;
          newIds.ncbi = ncbi.taxId;
        }
        if (wikidata?.qid && !plant.wikidataQid) {
          updateData.wikidataQid = wikidata.qid;
          newIds.wikidata = wikidata.qid;
          // Compléter avec les cross-IDs Wikidata si manquants
          if (wikidata.gbifId && !plant.gbifId && !updateData.gbifId) {
            updateData.gbifId = wikidata.gbifId;
            newIds.gbif = wikidata.gbifId;
          }
          if (wikidata.ncbiId && !plant.ncbiTaxId && !updateData.ncbiTaxId) {
            updateData.ncbiTaxId = wikidata.ncbiId;
            newIds.ncbi = wikidata.ncbiId;
          }
          if (wikidata.powId && !plant.powId && !updateData.powId) {
            updateData.powId = wikidata.powId;
            newIds.powo = wikidata.powId;
          }
        }

        const found = Object.keys(newIds).length > 0 || !!(gbif?.gbifId || powo?.fqId || ncbi?.taxId || wikidata?.qid);

        results.push({
          id: plant.id,
          name: plant.name,
          latinName: plant.latinName,
          found,
          fieldsToUpdate: Object.keys(updateData).length,
          newIds,
          existing: {
            gbif: plant.gbifId,
            powo: plant.powId,
            ncbi: plant.ncbiTaxId,
            wikidata: plant.wikidataQid,
          },
          apis: {
            gbif: gbif ? { id: gbif.gbifId, confidence: gbif.confidence } : null,
            powo: powo ? { fqId: powo.fqId, status: powo.status } : null,
            ncbi: ncbi ? { taxId: ncbi.taxId, rank: ncbi.rank } : null,
            wikidata: wikidata ? { qid: wikidata.qid } : null,
            tropicos: tropicos ? { nameId: tropicos.nameId } : null,
          },
        });

        // Appliquer si pas dry run
        if (!input.dryRun && Object.keys(updateData).length > 0) {
          await db.update(plants).set(updateData).where(eq(plants.id, plant.id));
        }
      }

      // Snapshot après (recalculé depuis les résultats)
      const after = {
        withGbif: before.withGbif + results.filter((r) => r.newIds?.gbif && !r.existing?.gbif).length,
        withPowo: before.withPowo + results.filter((r) => r.newIds?.powo && !r.existing?.powo).length,
        withNcbi: before.withNcbi + results.filter((r) => r.newIds?.ncbi && !r.existing?.ncbi).length,
        withWikidata: before.withWikidata + results.filter((r) => r.newIds?.wikidata && !r.existing?.wikidata).length,
      };

      return {
        success: true,
        genus: input.genus,
        total: plantsInGenus.length,
        enriched: input.dryRun ? 0 : results.filter((r) => r.fieldsToUpdate > 0).length,
        dryRun: input.dryRun,
        results,
        summary: {
          before,
          after: input.dryRun ? { ...before, note: "Dry run — valeurs projetées" } : after,
          gain: {
            gbif: after.withGbif - before.withGbif,
            powo: after.withPowo - before.withPowo,
            ncbi: after.withNcbi - before.withNcbi,
            wikidata: after.withWikidata - before.withWikidata,
          },
        },
      };
    }),

  /**
   * Synchronise les cross-IDs d'une plante individuelle depuis les données
   * retournées par les APIs (bouton "Appliquer" dans la fiche)
   */
  syncCrossIds: publicProcedure
    .input(z.object({
      plantId: z.number(),
      gbifId: z.string().optional().nullable(),
      powId: z.string().optional().nullable(),
      ncbiTaxId: z.string().optional().nullable(),
      wikidataQid: z.string().optional().nullable(),
      authorCitation: z.string().optional().nullable(),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const [plant] = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        gbifId: plants.gbifId,
        powId: plants.powId,
        ncbiTaxId: plants.ncbiTaxId,
        wikidataQid: plants.wikidataQid,
        authorCitation: plants.authorCitation,
      }).from(plants).where(eq(plants.id, input.plantId)).limit(1);

      if (!plant) return { success: false, message: "Plante non trouvée" };

      const updateData: Record<string, any> = {};
      const steps: string[] = [];

      if (input.gbifId && input.gbifId !== plant.gbifId) {
        updateData.gbifId = input.gbifId;
        steps.push(`GBIF ID: ${input.gbifId}`);
      }
      if (input.powId && input.powId !== plant.powId) {
        updateData.powId = input.powId;
        steps.push(`POWO ID: ${input.powId}`);
      }
      if (input.ncbiTaxId && input.ncbiTaxId !== plant.ncbiTaxId) {
        updateData.ncbiTaxId = input.ncbiTaxId;
        steps.push(`NCBI Tax ID: ${input.ncbiTaxId}`);
      }
      if (input.wikidataQid && input.wikidataQid !== plant.wikidataQid) {
        updateData.wikidataQid = input.wikidataQid;
        steps.push(`Wikidata QID: ${input.wikidataQid}`);
      }
      if (input.authorCitation && !plant.authorCitation) {
        updateData.authorCitation = input.authorCitation;
        steps.push(`Auteur: ${input.authorCitation}`);
      }

      if (Object.keys(updateData).length === 0) {
        return {
          success: true,
          message: "Aucun changement nécessaire — tous les identifiants sont déjà à jour",
          plant: plant.name,
          steps: [],
          fieldsUpdated: 0,
        };
      }

      if (!input.dryRun) {
        await db.update(plants).set(updateData).where(eq(plants.id, input.plantId));
      }

      return {
        success: true,
        dryRun: input.dryRun,
        plant: plant.name,
        latinName: plant.latinName,
        message: input.dryRun
          ? `[DRY RUN] ${steps.length} identifiant(s) à synchroniser pour "${plant.name}"`
          : `${steps.length} identifiant(s) synchronisé(s) pour "${plant.name}"`,
        steps,
        fieldsUpdated: input.dryRun ? 0 : Object.keys(updateData).length,
        before: {
          gbifId: plant.gbifId,
          powId: plant.powId,
          ncbiTaxId: plant.ncbiTaxId,
          wikidataQid: plant.wikidataQid,
        },
        after: {
          gbifId: input.gbifId ?? plant.gbifId,
          powId: input.powId ?? plant.powId,
          ncbiTaxId: input.ncbiTaxId ?? plant.ncbiTaxId,
          wikidataQid: input.wikidataQid ?? plant.wikidataQid,
        },
      };
    }),

  /**
   * Synchronisation en lot : applique les cross-IDs pour plusieurs plantes
   * (résultats d'un batchByGenus)
   */
  syncBatchResults: publicProcedure
    .input(z.object({
      updates: z.array(z.object({
        plantId: z.number(),
        gbifId: z.string().optional().nullable(),
        powId: z.string().optional().nullable(),
        ncbiTaxId: z.string().optional().nullable(),
        wikidataQid: z.string().optional().nullable(),
        authorCitation: z.string().optional().nullable(),
      })),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      let applied = 0;
      const errors: string[] = [];

      for (const update of input.updates) {
        const updateData: Record<string, any> = {};
        if (update.gbifId) updateData.gbifId = update.gbifId;
        if (update.powId) updateData.powId = update.powId;
        if (update.ncbiTaxId) updateData.ncbiTaxId = update.ncbiTaxId;
        if (update.wikidataQid) updateData.wikidataQid = update.wikidataQid;
        if (update.authorCitation) updateData.authorCitation = update.authorCitation;

        if (Object.keys(updateData).length === 0) continue;

        try {
          if (!input.dryRun) {
            await db.update(plants).set(updateData).where(eq(plants.id, update.plantId));
          }
          applied++;
        } catch (e: any) {
          errors.push(`Plant ${update.plantId}: ${e.message}`);
        }
      }

      return {
        success: true,
        dryRun: input.dryRun,
        total: input.updates.length,
        applied: input.dryRun ? 0 : applied,
        errors,
        message: input.dryRun
          ? `[DRY RUN] ${applied} plante(s) seraient mises à jour`
          : `${applied} plante(s) mises à jour avec succès`,
      };
    }),
});
