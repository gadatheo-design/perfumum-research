import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  index,
  uniqueIndex,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { bibliographyEntries } from "./bibliography";

// ============================================================================
// BIBLIOGRAPHY CROSS CITATIONS (Réseau de citations entre références)
// ============================================================================

/**
 * Réseau de citations entre références bibliographiques.
 * Alimenté par l'API CrossRef pour chaque DOI.
 * Axe 3.3 — Rapport 7 PERFUMUM
 *
 * Modèle :
 *   source_id → référence PERFUMUM qui cite
 *   target_doi → DOI de la référence citée (peut ne pas être dans PERFUMUM)
 *   target_id → ID dans bibliography_entries si la cible est dans PERFUMUM
 */
export const bibliographyCrossCitations = mysqlTable("bibliography_cross_citations", {
  id: int("id").autoincrement().primaryKey(),
  // Référence source (dans bibliography_entries)
  sourceId: int("source_id").notNull().references(() => bibliographyEntries.id, { onDelete: "cascade" }),
  // Référence cible — DOI (toujours présent)
  targetDoi: varchar("target_doi", { length: 255 }).notNull(),
  // Référence cible — ID dans bibliography_entries (si disponible)
  targetId: int("target_id").references(() => bibliographyEntries.id, { onDelete: "set null" }),
  // Métadonnées de la cible (depuis CrossRef)
  targetTitle: varchar("target_title", { length: 500 }),
  targetAuthors: text("target_authors"),
  targetYear: int("target_year"),
  targetJournal: varchar("target_journal", { length: 255 }),
  // Nombre de fois que cette référence est citée dans CrossRef (cited-by count)
  citedByCount: int("cited_by_count").default(0),
  // Type de relation
  relationType: mysqlEnum("relation_type", [
    "cites",          // source cite target
    "is_cited_by",    // source est citée par target
    "co_cited",       // les deux sont citées ensemble
  ]).notNull().default("cites"),
  // Source de la donnée
  dataSource: varchar("data_source", { length: 50 }).notNull().default("crossref"),
  // Métadonnées
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sourceIdx: index("bcc_source_idx").on(table.sourceId),
  targetDoiIdx: index("bcc_target_doi_idx").on(table.targetDoi),
  targetIdIdx: index("bcc_target_id_idx").on(table.targetId),
  uniqueCitation: uniqueIndex("bcc_unique_citation_idx").on(table.sourceId, table.targetDoi, table.relationType),
}));

export type BibliographyCrossCitation = typeof bibliographyCrossCitations.$inferSelect;
export type InsertBibliographyCrossCitation = typeof bibliographyCrossCitations.$inferInsert;
