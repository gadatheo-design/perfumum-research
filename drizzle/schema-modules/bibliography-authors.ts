import { index, int, json, mysqlTable, text, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

import { bibliographyEntries, v3References } from "./bibliography";

// ============================================================================
// BIBLIOGRAPHY AUTHORS (Auteurs normalisés — Axe 1.3 Rapport 6)
// ============================================================================
// Objectif : normaliser les chaînes d'auteurs actuellement stockées en texte libre
// dans bibliographyEntries.authors et v3References.authors.
// Chaque auteur devient une entité avec identifiants stables (ORCID, Wikidata).
// ============================================================================

export const bibliographyAuthors = mysqlTable("bibliography_authors", {
  id: int("id").autoincrement().primaryKey(),
  // Identité
  fullName: varchar("full_name", { length: 255 }).notNull(), // Nom canonique (ex: "Aftel, Mandy")
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  // Identifiants externes
  orcid: varchar("orcid", { length: 20 }), // ORCID iD (ex: "0000-0002-1825-0097")
  wikidataQid: varchar("wikidata_qid", { length: 20 }), // Wikidata QID (ex: "Q12345")
  openalexId: varchar("openalex_id", { length: 50 }), // OpenAlex author ID (ex: "A2208157607")
  // Affiliations (JSON array pour flexibilité)
  affiliations: json("affiliations").$type<{
    institution: string;
    country?: string;
    rorId?: string; // Research Organization Registry ID
    years?: string; // ex: "2010-2020"
  }[]>(),
  // Domaines de recherche
  researchDomains: json("research_domains").$type<string[]>(), // ex: ["parfumerie", "chimie des arômes"]
  // Variantes de nom connues (pour la déduplication)
  nameVariants: json("name_variants").$type<string[]>(), // ex: ["M. Aftel", "Mandy Aftel"]
  // Notes
  notes: text("notes"),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  lastNameIdx: index("bib_author_last_name_idx").on(table.lastName),
  orcidIdx: uniqueIndex("bib_author_orcid_idx").on(table.orcid),
  wikidataIdx: index("bib_author_wikidata_idx").on(table.wikidataQid),
}));

export type BibliographyAuthor = typeof bibliographyAuthors.$inferSelect;
export type InsertBibliographyAuthor = typeof bibliographyAuthors.$inferInsert;

// ============================================================================
// BIBLIOGRAPHY AUTHOR LINKS (Junction table: auteurs <-> entrées bibliographiques)
// ============================================================================
// Supporte à la fois bibliographyEntries (v2) et v3References.
// Un auteur peut être lié à plusieurs entrées, une entrée peut avoir plusieurs auteurs.
// ============================================================================

export const bibliographyAuthorLinks = mysqlTable("bibliography_author_links", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("author_id").notNull().references(() => bibliographyAuthors.id, { onDelete: "cascade" }),
  // Référence à l'une ou l'autre des tables bibliographiques (nullable pour l'autre)
  bibliographyEntryId: int("bibliography_entry_id").references(() => bibliographyEntries.id, { onDelete: "cascade" }),
  v3ReferenceId: int("v3_reference_id").references(() => v3References.id, { onDelete: "cascade" }),
  // Ordre de l'auteur dans la liste (1 = premier auteur)
  authorOrder: int("author_order").default(1).notNull(),
  // Rôle (auteur principal, co-auteur, éditeur, traducteur, etc.)
  role: varchar("role", { length: 50 }).default("author"), // author | editor | translator | contributor
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  authorIdx: index("bib_author_link_author_idx").on(table.authorId),
  entryIdx: index("bib_author_link_entry_idx").on(table.bibliographyEntryId),
  v3RefIdx: index("bib_author_link_v3ref_idx").on(table.v3ReferenceId),
  uniqueAuthorEntry: unique("bib_author_link_unique_entry").on(table.authorId, table.bibliographyEntryId),
  uniqueAuthorV3Ref: unique("bib_author_link_unique_v3ref").on(table.authorId, table.v3ReferenceId),
}));

export type BibliographyAuthorLink = typeof bibliographyAuthorLinks.$inferSelect;
export type InsertBibliographyAuthorLink = typeof bibliographyAuthorLinks.$inferInsert;
