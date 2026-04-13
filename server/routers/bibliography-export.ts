import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";

export const bibliographyExportRouter = router({
  // ─── Export CSV des liaisons bibliographiques ───────────────────────────────
  exportLinksAsCSV: publicProcedure
    .input(z.object({ entityType: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return "";
      const { sql } = await import('drizzle-orm');
      const whereClause = input?.entityType ? `WHERE entity_type = '${input.entityType}'` : '';
      const result = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
        `SELECT bel.id, bel.bibliography_id, bel.entity_type, bel.entity_id, bel.relevance_score, bel.notes,
                bs.title, bs.authors, bs.publication_year, bs.journal, bs.doi
         FROM bibliography_entity_links bel
         LEFT JOIN bibliography_sources bs ON bel.bibliography_id = bs.id
         ${whereClause}
         ORDER BY bel.entity_type, bel.entity_id, bs.publication_year DESC`
      ));
      const rows = Array.isArray(result) ? result[0] as Record<string, unknown>[] : [];
      if (rows.length === 0) return "";
      
      // Générer CSV
      const headers = ["ID Liaison", "ID Bibliographie", "Type Entité", "ID Entité", "Score Pertinence", "Notes", "Titre", "Auteurs", "Année", "Journal", "DOI"];
      const csvRows = rows.map(row => [
        String(row.id ?? ""),
        String(row.bibliography_id ?? ""),
        String(row.entity_type ?? ""),
        String(row.entity_id ?? ""),
        String(row.relevance_score ?? ""),
        String(row.notes ?? "").replace(/"/g, '\\"'),
        String(row.title ?? "").replace(/"/g, '\\"'),
        String(row.authors ?? "").replace(/"/g, '\\"'),
        String(row.publication_year ?? ""),
        String(row.journal ?? "").replace(/"/g, '\\"'),
        String(row.doi ?? "")
      ].map(v => `"${v}"`).join(","));
      return [headers.join(","), ...csvRows].join("\n");
    }),

  // ─── Statistiques d'enrichissement par type ───────────────────────────────
  getEnrichmentStats: publicProcedure.query(async () => {
    const dbConn = await db.getDb();
    if (!dbConn) return { total: 0, byType: {}, coverage: {} };
    const { sql } = await import('drizzle-orm');
    
    // Compter les liaisons par type
    const linksResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
      `SELECT entity_type, COUNT(*) as count FROM bibliography_entity_links GROUP BY entity_type`
    ));
    const linkRows = Array.isArray(linksResult) ? linksResult[0] as Record<string, unknown>[] : [];
    const byType: Record<string, number> = {};
    let total = 0;
    for (const row of linkRows) {
      byType[String(row.entity_type)] = Number(row.count);
      total += Number(row.count);
    }
    
    // Calculer la couverture (liaisons / total entités)
    const coverageResult = await (dbConn as unknown as { execute: (q: unknown) => Promise<unknown> }).execute(sql.raw(
      `SELECT 'molecule' as type, COUNT(*) as total FROM molecules
       UNION ALL
       SELECT 'plant', COUNT(*) FROM plants
       UNION ALL
       SELECT 'recette', COUNT(*) FROM recettes
       UNION ALL
       SELECT 'terroir', COUNT(*) FROM terroirs
       UNION ALL
       SELECT 'axis', COUNT(*) FROM research_axes`
    ));
    const coverageRows = Array.isArray(coverageResult) ? coverageResult[0] as Record<string, unknown>[] : [];
    const coverage: Record<string, number> = {};
    for (const row of coverageRows) {
      const type = String(row.type);
      const total = Number(row.total);
      const linked = byType[type] || 0;
      coverage[type] = total > 0 ? Math.round((linked / total) * 100) : 0;
    }
    
    return { total, byType, coverage };
  }),
});
