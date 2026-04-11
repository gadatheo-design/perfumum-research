// @ts-nocheck
/**
 * NCBI Taxonomy Router
 * ─────────────────────────────────────────────────────────────────────────────
 * Accès à la base taxonomique NCBI (National Center for Biotechnology Information)
 * via les E-utilities (Entrez API). Gratuit, sans authentification.
 *
 * Données accessibles :
 *  - Taxonomie NCBI (taxon ID, rang, lignée complète)
 *  - Liens vers séquences GenBank
 *  - Phylogénie moléculaire
 *  - Noms scientifiques standardisés
 *
 * Référence : https://www.ncbi.nlm.nih.gov/taxonomy
 * E-utilities : https://www.ncbi.nlm.nih.gov/books/NBK25499/
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { eq, isNull, or, sql } from "drizzle-orm";

const NCBI_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const NCBI_TOOL = "PERFUMUM-Research";
const NCBI_EMAIL = "research@perfumum.org";
const DELAY_MS = 400; // NCBI recommande max 3 req/s sans clé API

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Helpers NCBI E-utilities ─────────────────────────────────────────────────

async function ncbiEsearch(term: string, db = "taxonomy"): Promise<number[]> {
  const url = `${NCBI_BASE}/esearch.fcgi?db=${db}&term=${encodeURIComponent(term)}&retmode=json&tool=${NCBI_TOOL}&email=${NCBI_EMAIL}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.esearchresult?.idlist ?? []).map(Number);
  } catch {
    return [];
  }
}

async function ncbiEfetch(id: number | string, db = "taxonomy"): Promise<string | null> {
  const url = `${NCBI_BASE}/efetch.fcgi?db=${db}&id=${id}&rettype=xml&retmode=xml&tool=${NCBI_TOOL}&email=${NCBI_EMAIL}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

async function ncbiEsummary(id: number | string, db = "taxonomy"): Promise<Record<string, any> | null> {
  const url = `${NCBI_BASE}/esummary.fcgi?db=${db}&id=${id}&retmode=json&tool=${NCBI_TOOL}&email=${NCBI_EMAIL}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.result?.[String(id)];
    return result ?? null;
  } catch {
    return null;
  }
}

// Parse XML taxonomy record
function parseTaxXml(xml: string): Record<string, any> {
  const extract = (tag: string): string => {
    const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`));
    return m?.[1]?.trim() ?? "";
  };
  const extractAll = (tag: string): string[] => {
    const matches = [...xml.matchAll(new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "g"))];
    return matches.map((m) => m[1].trim()).filter(Boolean);
  };

  const taxId = extract("TaxId");
  const scientificName = extract("ScientificName");
  const rank = extract("Rank");
  const division = extract("Division");
  const geneticCode = extract("GCId");
  const lineage = extract("Lineage");
  const lineageEx = extractAll("ScientificName").slice(1); // Skip first (self)

  // Extract parent
  const parentMatch = xml.match(/<ParentTaxId>(\d+)<\/ParentTaxId>/);
  const parentTaxId = parentMatch?.[1] ?? "";

  // Synonyms / other names
  const otherNames: string[] = [];
  const nameMatches = [...xml.matchAll(/<Name><ClassCDE>([^<]+)<\/ClassCDE><DispName>([^<]+)<\/DispName><\/Name>/g)];
  for (const m of nameMatches) {
    otherNames.push(`${m[1]}: ${m[2]}`);
  }

  return {
    taxId,
    scientificName,
    rank,
    division,
    geneticCode,
    lineage,
    lineageEx: lineageEx.slice(0, 10),
    parentTaxId,
    otherNames,
    ncbiUrl: taxId ? `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${taxId}` : null,
    genbankUrl: taxId ? `https://www.ncbi.nlm.nih.gov/nuccore/?term=txid${taxId}[Organism]` : null,
  };
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const ncbiTaxonomyRouter = router({
  /**
   * Recherche taxonomique NCBI par nom scientifique
   */
  searchByName: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      limit: z.number().default(5),
    }))
    .query(async ({ input }) => {
      const ids = await ncbiEsearch(`${input.name}[Scientific Name]`);
      if (!ids.length) {
        // Fallback: recherche plus large
        const ids2 = await ncbiEsearch(input.name);
        if (!ids2.length) return { found: false, results: [] };
        ids.push(...ids2.slice(0, input.limit));
      }

      const results = [];
      for (const id of ids.slice(0, input.limit)) {
        await sleep(DELAY_MS);
        const xml = await ncbiEfetch(id);
        if (!xml) continue;
        results.push(parseTaxXml(xml));
      }

      return { found: results.length > 0, results };
    }),

  /**
   * Détails complets d'un taxon NCBI par ID
   */
  getByTaxId: publicProcedure
    .input(z.object({ taxId: z.number() }))
    .query(async ({ input }) => {
      const xml = await ncbiEfetch(input.taxId);
      if (!xml) return { found: false, data: null };
      return { found: true, data: parseTaxXml(xml) };
    }),

  /**
   * Lignée phylogénétique complète (de la racine jusqu'à l'espèce)
   */
  getLineage: publicProcedure
    .input(z.object({ scientificName: z.string().min(2) }))
    .query(async ({ input }) => {
      const ids = await ncbiEsearch(`${input.scientificName}[Scientific Name]`);
      if (!ids.length) return { found: false, lineage: [], taxId: null };

      const xml = await ncbiEfetch(ids[0]);
      if (!xml) return { found: false, lineage: [], taxId: null };

      const parsed = parseTaxXml(xml);
      const lineageItems = parsed.lineage
        ? parsed.lineage.split("; ").map((name: string, i: number) => ({
            rank: i === 0 ? "root" : "ancestor",
            name: name.trim(),
          }))
        : [];

      return {
        found: true,
        taxId: parsed.taxId,
        scientificName: parsed.scientificName,
        rank: parsed.rank,
        lineage: lineageItems,
        ncbiUrl: parsed.ncbiUrl,
        genbankUrl: parsed.genbankUrl,
      };
    }),

  /**
   * Recherche de séquences GenBank pour une espèce
   */
  getGenbankSequences: publicProcedure
    .input(z.object({
      scientificName: z.string().min(2),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      // D'abord trouver le taxon ID
      const taxIds = await ncbiEsearch(`${input.scientificName}[Scientific Name]`);
      if (!taxIds.length) return { found: false, sequences: [], total: 0 };

      await sleep(DELAY_MS);

      // Chercher les séquences nucléotidiques
      const seqIds = await ncbiEsearch(`txid${taxIds[0]}[Organism:exp]`, "nuccore");
      const total = seqIds.length;

      if (!seqIds.length) return { found: true, taxId: taxIds[0], sequences: [], total: 0 };

      // Résumés des premières séquences
      const sequences = [];
      for (const seqId of seqIds.slice(0, input.limit)) {
        await sleep(DELAY_MS);
        const summary = await ncbiEsummary(seqId, "nuccore");
        if (summary) {
          sequences.push({
            id: seqId,
            accession: summary.accessionversion ?? summary.caption ?? String(seqId),
            title: summary.title ?? "",
            length: summary.slen ?? 0,
            organism: summary.organism ?? input.scientificName,
            createDate: summary.createdate ?? "",
            genbankUrl: `https://www.ncbi.nlm.nih.gov/nuccore/${seqId}`,
          });
        }
      }

      return {
        found: true,
        taxId: taxIds[0],
        total,
        sequences,
        allSequencesUrl: `https://www.ncbi.nlm.nih.gov/nuccore/?term=txid${taxIds[0]}[Organism]`,
      };
    }),

  /**
   * Enrichissement batch : récupère le taxon ID NCBI pour les plantes sans données
   */
  batchEnrichPlants: publicProcedure
    .input(z.object({
      limit: z.number().default(20),
      dryRun: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      // Plantes avec nom latin mais sans notes NCBI
      const plantsToEnrich = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        notes: plants.notes,
      }).from(plants)
        .where(sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != ''`)
        .limit(input.limit);

      const results = [];
      let enriched = 0;

      for (const plant of plantsToEnrich) {
        await sleep(DELAY_MS);
        const ids = await ncbiEsearch(`${plant.latinName ?? ""}[Scientific Name]`);
        if (!ids.length) {
          results.push({ id: plant.id, name: plant.name, latinName: plant.latinName, found: false });
          continue;
        }

        const xml = await ncbiEfetch(ids[0]);
        if (!xml) {
          results.push({ id: plant.id, name: plant.name, latinName: plant.latinName, found: false });
          continue;
        }

        const parsed = parseTaxXml(xml);
        results.push({
          id: plant.id,
          name: plant.name,
          latinName: plant.latinName,
          found: true,
          taxId: parsed.taxId,
          rank: parsed.rank,
          lineage: parsed.lineage?.split("; ").slice(-5).join(" > ") ?? "",
          ncbiUrl: parsed.ncbiUrl,
        });

        if (!input.dryRun && parsed.taxId) {
          // Stocker le taxId dans les notes (champ existant)
          const existingNotes = plant.notes ?? "";
          const ncbiNote = `[NCBI:${parsed.taxId}]`;
          if (!existingNotes.includes("[NCBI:")) {
            await db.update(plants)
              .set({ notes: existingNotes ? `${existingNotes}\n${ncbiNote}` : ncbiNote })
              .where(eq(plants.id, plant.id));
            enriched++;
          }
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
   * Statut de l'API NCBI
   */
  getStatus: publicProcedure.query(async () => {
    const ids = await ncbiEsearch("Nicotiana tabacum[Scientific Name]");
    return {
      status: ids.length > 0 ? "online" : "offline",
      apiUrl: NCBI_BASE,
      rateLimit: "3 req/s (sans clé API)",
      coverage: {
        organisms: "2M+ espèces séquencées",
        sequences: "250M+ séquences GenBank",
        taxonomy: "Taxonomie NCBI complète",
      },
      testTaxId: ids[0] ?? null,
    };
  }),
});
