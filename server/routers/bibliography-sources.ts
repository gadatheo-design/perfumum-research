import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const bibliographySourcesRouter = router({
  // Publications liées à une molécule (toutes sources : OpenAlex, NEZ, etc.)
  getByMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];
      const { sql } = await import('drizzle-orm');
      const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
        `SELECT bs.id, bs.title, bs.authors, bs.publication_year as year, bs.journal,
                bs.doi, bs.url, bs.notes, bs.source_type
         FROM bibliography_sources bs
         INNER JOIN bibliography_entity_links bel ON bel.bibliography_id = bs.id
         WHERE bel.entity_type = 'molecule' AND bel.entity_id = ${input.moleculeId}
         ORDER BY bs.publication_year DESC, bs.id DESC
         LIMIT 30`
      ));
      return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
    }),

  // Publications liées à une plante (toutes sources : OpenAlex, NEZ, etc.)
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];
      const { sql } = await import('drizzle-orm');
      const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
        `SELECT bs.id, bs.title, bs.authors, bs.publication_year as year, bs.journal,
                bs.doi, bs.url, bs.notes, bs.source_type
         FROM bibliography_sources bs
         INNER JOIN bibliography_entity_links bel ON bel.bibliography_id = bs.id
         WHERE bel.entity_type IN ('plant', 'civilization') AND bel.entity_id = ${input.plantId}
         ORDER BY bs.publication_year DESC, bs.id DESC
         LIMIT 30`
      ));
      return Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
    }),

  // Publications PubChem pour une molécule (via API PubChem en temps réel)
  getPubChemLiterature: publicProcedure
    .input(z.object({ pubchemCid: z.number() }))
    .query(async ({ input }) => {
      const cid = input.pubchemCid;
      // PubChem PUG REST : récupérer les références bibliographiques
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/xrefs/PubMedID/JSON`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return { pmids: [], articles: [] };
      const json = await res.json() as { InformationList?: { Information?: Array<{ PubMedID?: number[] }> } };
      const pmids = json.InformationList?.Information?.[0]?.PubMedID?.slice(0, 20) || [];
      if (pmids.length === 0) return { pmids: [], articles: [] };
      // Récupérer les métadonnées PubMed via E-utilities
      const idsStr = pmids.join(',');
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idsStr}&retmode=json`;
      const summaryRes = await fetch(summaryUrl, { signal: AbortSignal.timeout(10000) });
      if (!summaryRes.ok) return { pmids, articles: [] };
      const summaryJson = await summaryRes.json() as { result?: Record<string, { title?: string; sortfirstauthor?: string; pubdate?: string; fulljournalname?: string; elocationid?: string; articleids?: Array<{ idtype: string; value: string }> }> };
      const result = summaryJson.result || {};
      const articles = pmids.map(pmid => {
        const r = result[String(pmid)];
        if (!r) return null;
        const doi = r.articleids?.find(a => a.idtype === 'doi')?.value || null;
        return {
          pmid,
          title: r.title || '',
          firstAuthor: r.sortfirstauthor || '',
          year: r.pubdate ? parseInt(r.pubdate) : null,
          journal: r.fulljournalname || '',
          doi,
          url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        };
      }).filter(Boolean);
      return { pmids, articles };
    }),

  // Liaison publication ↔ procédé d'extraction
  linkToExtractionMethod: protectedProcedure
    .input(z.object({
      publicationId: z.number(),
      extractionMethodId: z.number(),
      isKeyFinding: z.boolean().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('DB not available');
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        await conn.execute(
          `INSERT INTO publication_extraction_methods (publication_id, extraction_method_id, is_key_finding, notes)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE is_key_finding = VALUES(is_key_finding), notes = VALUES(notes)`,
          [input.publicationId, input.extractionMethodId, input.isKeyFinding ?? false, input.notes ?? null]
        );
        return { success: true };
      } finally { await conn.end(); }
    }),

  // Récupérer les publications liées à un procédé d'extraction
  getByExtractionMethod: publicProcedure
    .input(z.object({ extractionMethodId: z.number() }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const [rows] = await conn.execute(
          `SELECT rp.id, rp.title, rp.authors, rp.year, rp.doi, rp.url, rp.journal,
                  pem.is_key_finding, pem.notes as link_notes
           FROM research_publications rp
           JOIN publication_extraction_methods pem ON pem.publication_id = rp.id
           WHERE pem.extraction_method_id = ?
           ORDER BY rp.year DESC`,
          [input.extractionMethodId]
        ) as unknown as Record<string,unknown>[][];
        return rows as Record<string,unknown>[];
      } finally { await conn.end(); }
    }),

  // Récupérer les procédés d'extraction liés à une publication
  getExtractionMethodsByPublication: publicProcedure
    .input(z.object({ publicationId: z.number() }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const [rows] = await conn.execute(
          `SELECT em.id, em.name, em.type, em.description, em.temperature, em.pressure, em.solvent,
                  pem.is_key_finding, pem.notes as link_notes
           FROM extraction_methods em
           JOIN publication_extraction_methods pem ON pem.extraction_method_id = em.id
           WHERE pem.publication_id = ?
           ORDER BY em.name`,
          [input.publicationId]
        ) as unknown as Record<string,unknown>[][];
        return rows as Record<string,unknown>[];
      } finally { await conn.end(); }
    }),

  // Données GBIF d'une plante (occurrences + pays)
  getGbifData: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return null;
      const { sql } = await import('drizzle-orm');
      const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
        `SELECT gbif_id, gbif_occurrence_count, gbif_countries, gbif_enriched_at,
                iucn_id, conservation_status
         FROM plants WHERE id = ${input.plantId}`
      ));
      const rows = Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      return rows[0] || null;
    }),
});
