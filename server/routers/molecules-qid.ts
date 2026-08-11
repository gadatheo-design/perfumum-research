/**
 * molecules-qid.ts — Rapport 15
 * Enrichissement QID Wikidata pour les molécules sans identifiant
 * Procédures : getMoleculesWithoutQid, searchMoleculeQidWikidata, applyMoleculeQid
 */
import { z } from "zod";
import mysql from "mysql2/promise";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getMysqlConnection } from "../db/mysqlPool";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WikidataSearchHit {
  qid: string;
  label: string;
  description: string;
  aliases: string[];
  score: number; // 0–100, heuristique de confiance
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Interroge l'API wbsearchentities de Wikidata pour trouver des candidats QID.
 * Retourne les 5 premiers résultats avec un score de confiance heuristique.
 */
async function searchWikidataForMolecule(
  query: string,
  casNumber: string | null,
  iupacName: string | null,
): Promise<WikidataSearchHit[]> {
  const results: WikidataSearchHit[] = [];
  const seen = new Set<string>();

  // Termes de recherche à essayer dans l'ordre de priorité
  const searchTerms: string[] = [];
  if (query) searchTerms.push(query);
  if (iupacName && iupacName !== query) searchTerms.push(iupacName);
  if (casNumber) searchTerms.push(casNumber);

  for (const term of searchTerms.slice(0, 2)) {
    try {
      const url = new URL("https://www.wikidata.org/w/api.php");
      url.searchParams.set("action", "wbsearchentities");
      url.searchParams.set("search", term);
      url.searchParams.set("language", "fr");
      url.searchParams.set("uselang", "fr");
      url.searchParams.set("type", "item");
      url.searchParams.set("limit", "5");
      url.searchParams.set("format", "json");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "PERFUMUM-Research/1.0 (https://perfumum.manus.space)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!resp.ok) continue;
      const data = await resp.json() as {
        search?: Array<{
          id: string;
          label?: string;
          description?: string;
          aliases?: Array<{ value: string }>;
          match?: { type: string; text: string };
        }>;
      };

      for (const hit of data.search ?? []) {
        if (seen.has(hit.id)) continue;
        seen.add(hit.id);

        const label = hit.label ?? "";
        const description = hit.description ?? "";
        const aliases = (hit.aliases ?? []).map((a) => a.value);

        // Heuristique de confiance : correspondance exacte > partielle
        let score = 30;
        const labelLower = label.toLowerCase();
        const queryLower = query.toLowerCase();

        if (labelLower === queryLower) score = 95;
        else if (labelLower.includes(queryLower) || queryLower.includes(labelLower)) score = 70;
        else if (aliases.some((a) => a.toLowerCase() === queryLower)) score = 85;
        else if (aliases.some((a) => a.toLowerCase().includes(queryLower))) score = 55;

        // Bonus si la description mentionne "chemical compound" ou "molécule"
        if (description.toLowerCase().includes("chemical compound") ||
            description.toLowerCase().includes("molécule") ||
            description.toLowerCase().includes("composé chimique")) {
          score = Math.min(100, score + 10);
        }

        // Bonus si le CAS correspond dans les aliases
        if (casNumber && aliases.some((a) => a.includes(casNumber))) {
          score = Math.min(100, score + 20);
        }

        results.push({ qid: hit.id, label, description, aliases, score });
      }
    } catch {
      // Timeout ou erreur réseau — on continue avec les autres termes
    }
  }

  // Dédupliquer et trier par score décroissant
  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

// ─── Routeur ──────────────────────────────────────────────────────────────────

export const moleculesQidRouter = router({
  /**
   * Liste paginée des molécules sans wikidata_qid
   */
  getMoleculesWithoutQid: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(10).max(200).default(50),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const conn = await getMysqlConnection();
      try {
        const offset = (input.page - 1) * input.pageSize;
        let whereClause = "wikidata_qid IS NULL OR wikidata_qid = ''";
        const params: (string | number)[] = [];

        if (input.search && input.search.trim()) {
          whereClause += " AND (name LIKE ? OR cas_number LIKE ? OR iupac_name LIKE ?)";
          const q = `%${input.search.trim()}%`;
          params.push(q, q, q);
        }

        const [countRows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM molecules WHERE ${whereClause}`,
          params
        );
        const total = Number((countRows[0] as Record<string, unknown>).total);

        const [rows] = await conn.query<mysql.RowDataPacket[]>(
          `SELECT id, name, cas_number, iupac_name, family, smiles
           FROM molecules
           WHERE ${whereClause}
           ORDER BY name ASC
           LIMIT ? OFFSET ?`,
          [...params, Number(input.pageSize), Number(offset)]
        );

        return {
          molecules: rows.map((r) => ({
            id: r.id as number,
            name: r.name as string,
            casNumber: (r.cas_number as string) || null,
            iupacName: (r.iupac_name as string) || null,
            family: (r.family as string) || null,
            smiles: (r.smiles as string) || null,
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
   * Recherche de candidats QID Wikidata pour une molécule donnée
   */
  searchMoleculeQidWikidata: publicProcedure
    .input(z.object({
      moleculeId: z.number().int().positive(),
      overrideName: z.string().optional(), // Permet de tester un nom alternatif
    }))
    .query(async ({ input }) => {
      const conn = await getMysqlConnection();
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, cas_number, iupac_name, wikidata_qid FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows[0]) throw new Error("Molécule introuvable");

        const mol = rows[0] as Record<string, unknown>;
        const searchName = input.overrideName || (mol.name as string);
        const casNumber = (mol.cas_number as string) || null;
        const iupacName = (mol.iupac_name as string) || null;

        const candidates = await searchWikidataForMolecule(searchName, casNumber, iupacName);

        return {
          molecule: {
            id: mol.id as number,
            name: mol.name as string,
            casNumber,
            iupacName,
            currentQid: (mol.wikidata_qid as string) || null,
          },
          candidates,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Applique un QID Wikidata à une molécule
   */
  applyMoleculeQid: protectedProcedure
    .input(z.object({
      moleculeId: z.number().int().positive(),
      qid: z.string().regex(/^Q\d+$/, "Format QID invalide (ex: Q12345)"),
    }))
    .mutation(async ({ input }) => {
      const conn = await getMysqlConnection();
      try {
        // Vérifier que la molécule existe
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, wikidata_qid FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows[0]) throw new Error("Molécule introuvable");

        const prev = (rows[0] as Record<string, unknown>).wikidata_qid as string | null;

        await conn.execute(
          "UPDATE molecules SET wikidata_qid = ? WHERE id = ?",
          [input.qid, input.moleculeId]
        );

        return {
          success: true,
          moleculeId: input.moleculeId,
          previousQid: prev || null,
          newQid: input.qid,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Applique un lot de QIDs en une seule requête (batch)
   */
  applyBatchQid: protectedProcedure
    .input(z.object({
      assignments: z.array(z.object({
        moleculeId: z.number().int().positive(),
        qid: z.string().regex(/^Q\d+$/),
      })).min(1).max(500),
    }))
    .mutation(async ({ input }) => {
      const conn = await getMysqlConnection();
      try {
        let applied = 0;
        const errors: Array<{ moleculeId: number; error: string }> = [];

        for (const { moleculeId, qid } of input.assignments) {
          try {
            await conn.execute(
              "UPDATE molecules SET wikidata_qid = ? WHERE id = ?",
              [qid, moleculeId]
            );
            applied++;
          } catch (err) {
            errors.push({ moleculeId, error: String(err) });
          }
        }

        return { applied, errors, total: input.assignments.length };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Valide un QID existant via le numéro CAS (propriété P231 Wikidata).
   * Retourne le statut et propose un QID corrigé si le QID actuel est incorrect.
   */
  validateQidViaCas: publicProcedure
    .input(z.object({ moleculeId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const conn = await getMysqlConnection();
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, name, cas_number, iupac_name, wikidata_qid FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows[0]) throw new Error("Molécule introuvable");
        const mol = rows[0] as Record<string, unknown>;
        const currentQid = (mol.wikidata_qid as string) || null;
        const casNumber = (mol.cas_number as string) || null;
        const name = mol.name as string;
        const iupacName = (mol.iupac_name as string) || null;

        if (!casNumber) {
          return { moleculeId: input.moleculeId, name, currentQid, casNumber: null, status: "no_cas" as const, suggestedQid: null, suggestedLabel: null, casMatch: false };
        }

        let casMatch = false;
        let qidLabel: string | null = null;
        if (currentQid) {
          try {
            const sparql = `SELECT ?cas ?label WHERE { wd:${currentQid} wdt:P231 ?cas . OPTIONAL { wd:${currentQid} rdfs:label ?label FILTER(LANG(?label)="fr" || LANG(?label)="en") } } LIMIT 3`;
            const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
            const resp = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-Research/1.0" }, signal: AbortSignal.timeout(8000) });
            if (resp.ok) {
              const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
              const bindings = data.results?.bindings ?? [];
              casMatch = bindings.map(b => b.cas?.value ?? "").some(c => c.toLowerCase() === casNumber.toLowerCase());
              const lb = bindings.find(b => b.label);
              if (lb) qidLabel = lb.label?.value ?? null;
            }
          } catch { /* timeout */ }
        }

        if (currentQid && casMatch) {
          return { moleculeId: input.moleculeId, name, currentQid, casNumber, status: "valid" as const, suggestedQid: null, suggestedLabel: qidLabel, casMatch: true };
        }

        let suggestedQid: string | null = null;
        let suggestedLabel: string | null = null;
        let suggestedScore = 0;
        try {
          const sparql = `SELECT ?item ?label WHERE { ?item wdt:P231 "${casNumber}" . OPTIONAL { ?item rdfs:label ?label FILTER(LANG(?label)="fr" || LANG(?label)="en") } } LIMIT 3`;
          const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
          const resp = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-Research/1.0" }, signal: AbortSignal.timeout(8000) });
          if (resp.ok) {
            const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
            const bindings = data.results?.bindings ?? [];
            if (bindings[0]) {
              suggestedQid = (bindings[0].item?.value ?? "").split("/").pop() ?? null;
              suggestedLabel = bindings[0].label?.value ?? null;
              suggestedScore = 98;
            }
          }
        } catch { /* timeout */ }

        if (!suggestedQid) {
          const candidates = await searchWikidataForMolecule(name, casNumber, iupacName);
          if (candidates[0] && candidates[0].score >= 70) {
            suggestedQid = candidates[0].qid;
            suggestedLabel = candidates[0].label;
            suggestedScore = candidates[0].score;
          }
        }

        const status = currentQid
          ? (suggestedQid ? "wrong_qid" as const : "unverifiable" as const)
          : (suggestedQid ? "missing_qid" as const : "not_found" as const);

        return { moleculeId: input.moleculeId, name, currentQid, casNumber, status, suggestedQid, suggestedLabel, suggestedScore, casMatch: false };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Validation en batch : vérifie les QIDs de N molécules avec CAS via SPARQL Wikidata.
   * Séquentiel avec délai 350ms pour respecter les rate limits.
   */
  batchValidateQids: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(200).default(50),
      onlyWithQid: z.boolean().default(true),
      familyFilter: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const conn = await getMysqlConnection();
      let molecules: Array<{ id: number; name: string; cas_number: string | null; iupac_name: string | null; wikidata_qid: string | null; family: string | null }> = [];
      try {
        let sql = "SELECT id, name, cas_number, iupac_name, wikidata_qid, family FROM molecules WHERE cas_number IS NOT NULL AND cas_number != ''";
        const params: (string | number)[] = [];
        if (input.onlyWithQid) {
          sql += " AND wikidata_qid IS NOT NULL AND wikidata_qid != ''";
        } else {
          sql += " AND (wikidata_qid IS NULL OR wikidata_qid = '')";
        }
        if (input.familyFilter) { sql += " AND family = ?"; params.push(input.familyFilter); }
        sql += ` ORDER BY RAND() LIMIT ${Math.floor(input.limit)}`;
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(sql, params);
        molecules = rows as typeof molecules;
      } finally {
        await conn.end();
      }

      const results: Array<{
        moleculeId: number; name: string; casNumber: string; currentQid: string | null;
        status: "valid" | "wrong_qid" | "missing_qid" | "not_found" | "unverifiable" | "error";
        suggestedQid: string | null; suggestedLabel: string | null; suggestedScore?: number;
      }> = [];

      for (const mol of molecules) {
        try {
          const casNumber = mol.cas_number!;
          const currentQid = mol.wikidata_qid || null;
          let casMatch = false;
          let suggestedQid: string | null = null;
          let suggestedLabel: string | null = null;
          let suggestedScore = 0;

          if (currentQid) {
            try {
              const sparql = `SELECT ?cas WHERE { wd:${currentQid} wdt:P231 ?cas } LIMIT 5`;
              const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
              const resp = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-Research/1.0" }, signal: AbortSignal.timeout(6000) });
              if (resp.ok) {
                const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
                casMatch = (data.results?.bindings ?? []).map(b => b.cas?.value ?? "").some(c => c.toLowerCase() === casNumber.toLowerCase());
              }
            } catch { /* timeout */ }
          }

          if (currentQid && casMatch) {
            results.push({ moleculeId: mol.id, name: mol.name, casNumber, currentQid, status: "valid", suggestedQid: null, suggestedLabel: null });
          } else {
            try {
              const sparql = `SELECT ?item ?label WHERE { ?item wdt:P231 "${casNumber}" . OPTIONAL { ?item rdfs:label ?label FILTER(LANG(?label)="fr" || LANG(?label)="en") } } LIMIT 3`;
              const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
              const resp = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "PERFUMUM-Research/1.0" }, signal: AbortSignal.timeout(6000) });
              if (resp.ok) {
                const data = await resp.json() as { results?: { bindings?: Array<Record<string, { value: string }>> } };
                const bindings = data.results?.bindings ?? [];
                if (bindings[0]) {
                  suggestedQid = (bindings[0].item?.value ?? "").split("/").pop() ?? null;
                  suggestedLabel = bindings[0].label?.value ?? null;
                  suggestedScore = 98;
                }
              }
            } catch { /* timeout */ }
            const status = currentQid ? (suggestedQid ? "wrong_qid" : "unverifiable") : (suggestedQid ? "missing_qid" : "not_found");
            results.push({ moleculeId: mol.id, name: mol.name, casNumber, currentQid, status, suggestedQid, suggestedLabel, suggestedScore });
          }
          await new Promise(r => setTimeout(r, 350));
        } catch {
          results.push({ moleculeId: mol.id, name: mol.name, casNumber: mol.cas_number!, currentQid: mol.wikidata_qid || null, status: "error", suggestedQid: null, suggestedLabel: null });
        }
      }

      const summary = {
        total: results.length,
        valid: results.filter(r => r.status === "valid").length,
        wrongQid: results.filter(r => r.status === "wrong_qid").length,
        missingQid: results.filter(r => r.status === "missing_qid").length,
        notFound: results.filter(r => r.status === "not_found").length,
        unverifiable: results.filter(r => r.status === "unverifiable").length,
        errors: results.filter(r => r.status === "error").length,
      };
      return { results, summary };
    }),

  /**
   * Statistiques globales sur la couverture QID des molécules
   */
  getQidCoverageStats: publicProcedure.query(async () => {
    const conn = await getMysqlConnection();
    try {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN wikidata_qid IS NOT NULL AND wikidata_qid != '' THEN 1 ELSE 0 END) AS with_qid,
          SUM(CASE WHEN wikidata_qid IS NULL OR wikidata_qid = '' THEN 1 ELSE 0 END) AS without_qid
        FROM molecules
      `);
      const r = rows[0] as Record<string, unknown>;
      return {
        total: Number(r.total),
        withQid: Number(r.with_qid),
        withoutQid: Number(r.without_qid),
        coveragePercent: r.total ? Math.round((Number(r.with_qid) / Number(r.total)) * 100) : 0,
      };
    } finally {
      await conn.end();
    }
  }),
});
