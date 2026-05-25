/**
 * Routeur tRPC — Réseau de citations CrossRef
 * Axe 3.3 — Rapport 7 PERFUMUM
 *
 * Utilise l'API CrossRef (https://api.crossref.org) pour :
 * - Récupérer les références citées par un DOI
 * - Construire le graphe de citations d'une référence
 * - Alimenter la table bibliography_cross_citations
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import mysql from "mysql2/promise";

const CROSSREF_BASE = "https://api.crossref.org/works";
const CROSSREF_EMAIL = "perfumum-research@contact.fr"; // Polite pool CrossRef

/** Appel CrossRef avec gestion d'erreur */
async function crossrefFetch(doi: string): Promise<Record<string, unknown> | null> {
  try {
    const url = `${CROSSREF_BASE}/${encodeURIComponent(doi)}?mailto=${CROSSREF_EMAIL}`;
    const res = await fetch(url, {
      headers: { "User-Agent": `PERFUMUM-Research/1.0 (mailto:${CROSSREF_EMAIL})` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    return (data.message as Record<string, unknown>) ?? null;
  } catch { return null; }
}

/** Normalise les auteurs CrossRef en string */
function normalizeAuthors(authors: unknown[]): string {
  if (!Array.isArray(authors)) return "";
  return (authors as unknown[]).map((a) => {
      const author = a as Record<string, unknown>;
      const given = author.given ? String(author.given) : "";
      const family = author.family ? String(author.family) : "";
      return [family, given].filter(Boolean).join(", ");
    }).join("; ");
}

/** Extrait l'année depuis les champs CrossRef */
function extractYear(work: Record<string, unknown>): number | null {
  const published = (work["published-print"] ?? work["published-online"] ?? work["created"]) as Record<string, unknown> | undefined;
  if (published?.["date-parts"]) {
    const parts = (published["date-parts"] as number[][])[0];
    if (parts?.[0]) return parts[0];
  }
  return null;
}

async function getDb() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const crossrefRouter = router({
  /**
   * Récupérer les métadonnées CrossRef d'un DOI
   */
  getWorkByDoi: publicProcedure
    .input(z.object({ doi: z.string().min(3) }))
    .query(async ({ input }) => {
      const work = await crossrefFetch(input.doi);
      if (!work) return { found: false, doi: input.doi };
      return {
        found: true,
        doi: input.doi,
        title: Array.isArray(work.title) ? (work.title as string[])[0] : String(work.title ?? ""),
        authors: normalizeAuthors(work.author as unknown[] ?? []),
        year: extractYear(work),
        journal: Array.isArray(work["container-title"])
          ? (work["container-title"] as string[])[0]
          : String(work["container-title"] ?? ""),
        citedByCount: Number(work["is-referenced-by-count"] ?? 0),
        referenceCount: Number(work["references-count"] ?? 0),
        type: String(work.type ?? ""),
        url: String(work.URL ?? ""),
      };
    }),

  /**
   * Récupérer les citations d'une référence PERFUMUM via CrossRef
   * et les stocker dans bibliography_cross_citations
   */
  fetchCitations: protectedProcedure
    .input(z.object({
      bibliographyEntryId: z.number().int().positive(),
      maxCitations: z.number().min(1).max(200).default(50),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        // 1. Récupérer le DOI de la référence source
        const [sourceRows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, doi, title FROM bibliography_entries WHERE id = ? AND doi IS NOT NULL LIMIT 1",
          [input.bibliographyEntryId]
        );
        if (!sourceRows.length || !sourceRows[0].doi) {
          return { success: false, message: "Référence sans DOI — impossible de récupérer les citations CrossRef" };
        }
        const source = sourceRows[0];

        // 2. Appel CrossRef
        const work = await crossrefFetch(source.doi as string);
        if (!work) return { success: false, message: `CrossRef ne répond pas pour DOI: ${source.doi}` };

        // 3. Extraire les références citées
        const references = (work.reference as Record<string, unknown>[] ?? []).slice(0, input.maxCitations);
        let inserted = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const ref of references) {
          const targetDoi = String(ref.DOI ?? ref.doi ?? "").trim();
          if (!targetDoi) { skipped++; continue; }

          try {
            // Chercher si la cible est dans bibliography_entries
            const [targetRows] = await conn.execute<mysql.RowDataPacket[]>(
              "SELECT id FROM bibliography_entries WHERE doi = ? LIMIT 1",
              [targetDoi]
            );
            const targetId = targetRows.length > 0 ? targetRows[0].id : null;

            // Insérer ou mettre à jour la citation
            await conn.execute(
              `INSERT INTO bibliography_cross_citations
                (source_id, target_doi, target_id, target_title, target_authors, target_year, target_journal, cited_by_count, relation_type, data_source)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cites', 'crossref')
               ON DUPLICATE KEY UPDATE
                 target_id = VALUES(target_id),
                 target_title = VALUES(target_title),
                 cited_by_count = VALUES(cited_by_count),
                 updated_at = NOW()`,
              [
                input.bibliographyEntryId,
                targetDoi.substring(0, 255),
                targetId,
                String(ref["article-title"] ?? ref.title ?? "").substring(0, 500) || null,
                String(ref.author ?? "").substring(0, 1000) || null,
                ref.year ? parseInt(String(ref.year)) : null,
                String(ref["journal-title"] ?? "").substring(0, 255) || null,
                0,
              ]
            );
            inserted++;
          } catch (err) {
            errors.push(String(err instanceof Error ? err.message : err).substring(0, 100));
          }
        }

        // 4. Mettre à jour le cited_by_count de la source
        const citedByCount = Number(work["is-referenced-by-count"] ?? 0);
        await conn.execute(
          "UPDATE bibliography_entries SET notes = CONCAT(IFNULL(notes, ''), ?) WHERE id = ?",
          [`\n[CrossRef] Cité ${citedByCount} fois.`, input.bibliographyEntryId]
        );

        return {
          success: true,
          sourceId: input.bibliographyEntryId,
          sourceDoi: source.doi,
          totalReferences: references.length,
          inserted,
          skipped,
          errors: errors.slice(0, 5),
          citedByCount,
          message: `${inserted} citations insérées pour "${source.title}"`,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Construire le graphe de citations pour une référence
   * (pour visualisation D3.js dans KnowledgeGraph)
   */
  getCitationNetwork: publicProcedure
    .input(z.object({
      bibliographyEntryId: z.number().int().positive(),
      depth: z.number().min(1).max(2).default(1),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        // Nœud source
        const [sourceRows] = await conn.execute<mysql.RowDataPacket[]>(
          "SELECT id, entry_key, title, authors, year, doi FROM bibliography_entries WHERE id = ? LIMIT 1",
          [input.bibliographyEntryId]
        );
        if (!sourceRows.length) return { nodes: [], links: [], stats: { totalNodes: 0, totalLinks: 0 } };
        const source = sourceRows[0];

        // Citations directes (depth 1)
        const [citations] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT bcc.*, be.title as be_title, be.authors as be_authors, be.year as be_year
           FROM bibliography_cross_citations bcc
           LEFT JOIN bibliography_entries be ON be.id = bcc.target_id
           WHERE bcc.source_id = ?
           ORDER BY bcc.cited_by_count DESC
           LIMIT ?`,
          [input.bibliographyEntryId, input.limit]
        );

        // Construire les nœuds et liens
        const nodes: Record<string, unknown>[] = [
          {
            id: `be_${source.id}`,
            type: "bibliography",
            label: String(source.title ?? "").substring(0, 60),
            title: source.title,
            authors: source.authors,
            year: source.year,
            doi: source.doi,
            isSource: true,
          }
        ];
        const links: Record<string, unknown>[] = [];
        const nodeIds = new Set<string>([`be_${source.id}`]);

        for (const cit of citations) {
          const targetNodeId = cit.target_id ? `be_${cit.target_id}` : `doi_${cit.target_doi}`;
          if (!nodeIds.has(targetNodeId)) {
            nodes.push({
              id: targetNodeId,
              type: "bibliography",
              label: String(cit.be_title ?? cit.target_title ?? cit.target_doi ?? "").substring(0, 60),
              title: cit.be_title ?? cit.target_title,
              authors: cit.be_authors ?? cit.target_authors,
              year: cit.be_year ?? cit.target_year,
              doi: cit.target_doi,
              isSource: false,
              citedByCount: cit.cited_by_count,
            });
            nodeIds.add(targetNodeId);
          }
          links.push({
            source: `be_${source.id}`,
            target: targetNodeId,
            type: "cites",
            weight: 1,
          });
        }

        // Depth 2 : citations des citations (si demandé)
        if (input.depth >= 2 && citations.length > 0) {
          const targetIds = citations
            .filter(c => c.target_id)
            .map(c => c.target_id as number)
            .slice(0, 10); // Limiter à 10 pour depth 2

          if (targetIds.length > 0) {
            const placeholders = targetIds.map(() => "?").join(",");
            const [depth2Citations] = await conn.execute<mysql.RowDataPacket[]>(
              `SELECT bcc.*, be.title as be_title, be.year as be_year
               FROM bibliography_cross_citations bcc
               LEFT JOIN bibliography_entries be ON be.id = bcc.target_id
               WHERE bcc.source_id IN (${placeholders})
               LIMIT 30`,
              targetIds
            );
            for (const cit of depth2Citations) {
              const sourceNodeId = `be_${cit.source_id}`;
              const targetNodeId = cit.target_id ? `be_${cit.target_id}` : `doi_${cit.target_doi}`;
              if (!nodeIds.has(targetNodeId)) {
                nodes.push({
                  id: targetNodeId,
                  type: "bibliography",
                  label: String(cit.be_title ?? cit.target_title ?? cit.target_doi ?? "").substring(0, 60),
                  year: cit.be_year ?? cit.target_year,
                  doi: cit.target_doi,
                  isSource: false,
                  depth: 2,
                });
                nodeIds.add(targetNodeId);
              }
              if (nodeIds.has(sourceNodeId)) {
                links.push({ source: sourceNodeId, target: targetNodeId, type: "cites", weight: 0.5 });
              }
            }
          }
        }

        return {
          nodes,
          links,
          stats: { totalNodes: nodes.length, totalLinks: links.length, sourceTitle: source.title },
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Statistiques globales du réseau de citations
   */
  getCitationStats: publicProcedure.query(async () => {
    const conn = await getDb();
    try {
      const [total] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) as cnt FROM bibliography_cross_citations"
      );
      const [withTarget] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) as cnt FROM bibliography_cross_citations WHERE target_id IS NOT NULL"
      );
      const [topCited] = await conn.execute<mysql.RowDataPacket[]>(
        `SELECT be.id, be.title, be.year, COUNT(bcc.id) as citation_count
         FROM bibliography_entries be
         INNER JOIN bibliography_cross_citations bcc ON bcc.source_id = be.id
         GROUP BY be.id, be.title, be.year
         ORDER BY citation_count DESC
         LIMIT 10`
      );
      const [coveredEntries] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(DISTINCT source_id) as cnt FROM bibliography_cross_citations"
      );
      return {
        totalCitations: Number(total[0].cnt),
        internalLinks: Number(withTarget[0].cnt),
        coveredEntries: Number(coveredEntries[0].cnt),
        topCited: topCited as Record<string, unknown>[],
      };
    } finally {
      await conn.end();
    }
  }),

  /**
   * Enrichissement en lot : récupérer les citations pour toutes les références avec DOI
   */
  batchFetchCitations: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      skipAlreadyFetched: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const conn = await getDb();
      try {
        // Sélectionner les références avec DOI non encore enrichies
        let query = `
          SELECT id, doi, title FROM bibliography_entries
          WHERE doi IS NOT NULL AND doi != ''
        `;
        if (input.skipAlreadyFetched) {
          query += ` AND id NOT IN (SELECT DISTINCT source_id FROM bibliography_cross_citations)`;
        }
        query += ` ORDER BY id LIMIT ${input.limit}`;

        const [entries] = await conn.execute<mysql.RowDataPacket[]>(query);
        await conn.end();

        let processed = 0;
        let totalInserted = 0;
        const results: Array<{ id: number; title: string; inserted: number; error?: string }> = [];

        for (const entry of entries) {
          try {
            const work = await crossrefFetch(entry.doi as string);
            if (!work) {
              results.push({ id: entry.id as number, title: String(entry.title ?? "").substring(0, 50), inserted: 0, error: "CrossRef timeout" });
              continue;
            }
            const references = (work.reference as Record<string, unknown>[] ?? []).slice(0, 100);
            let inserted = 0;
            const conn2 = await getDb();
            for (const ref of references) {
              const targetDoi = String(ref.DOI ?? ref.doi ?? "").trim();
              if (!targetDoi) continue;
              try {
                const [targetRows] = await conn2.execute<mysql.RowDataPacket[]>(
                  "SELECT id FROM bibliography_entries WHERE doi = ? LIMIT 1", [targetDoi]
                );
                const targetId = targetRows.length > 0 ? targetRows[0].id : null;
                await conn2.execute(
                  `INSERT INTO bibliography_cross_citations
                    (source_id, target_doi, target_id, target_title, target_year, relation_type, data_source)
                   VALUES (?, ?, ?, ?, ?, 'cites', 'crossref')
                   ON DUPLICATE KEY UPDATE target_id = VALUES(target_id), updated_at = NOW()`,
                  [
                    entry.id,
                    targetDoi.substring(0, 255),
                    targetId,
                    String(ref["article-title"] ?? ref.title ?? "").substring(0, 500) || null,
                    ref.year ? parseInt(String(ref.year)) : null,
                  ]
                );
                inserted++;
              } catch { /* skip */ }
            }
            await conn2.end();
            results.push({ id: entry.id as number, title: String(entry.title ?? "").substring(0, 50), inserted });
            totalInserted += inserted;
            processed++;
            // Délai poli CrossRef (1 req/s)
            await new Promise(r => setTimeout(r, 1000));
          } catch (err) {
            results.push({ id: entry.id as number, title: String(entry.title ?? "").substring(0, 50), inserted: 0, error: String(err).substring(0, 100) });
          }
        }

        return {
          processed,
          totalInserted,
          results,
          message: `${processed} références enrichies, ${totalInserted} citations insérées`,
        };
      } finally {
        try { await conn.end(); } catch { /* already closed */ }
      }
    }),
});
