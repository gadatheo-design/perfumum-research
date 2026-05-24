import { boolean, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { users } from "./core";
import { userNotes } from "./molecules";
import { researchAxes } from "./research-axes";

// ============================================================================
// BIBLIOGRAPHY ENTRIES (Références bibliographiques)
// ============================================================================

/**
 * Comprehensive bibliography management for research references.
 * Supports BibTeX, APA, MLA, Chicago formats and various source types.
 */
export const bibliographyEntries = mysqlTable("bibliography_entries", {
  id: int("id").autoincrement().primaryKey(),
  // Identification unique
  entryKey: varchar("entry_key", { length: 100 }).notNull().unique(), // Clé BibTeX unique (ex: "smith2024perfumery")
  // Type de source
  entryType: mysqlEnum("entry_type", [
    "article",        // Article de journal scientifique
    "book",           // Livre
    "inbook",         // Chapitre de livre
    "incollection",   // Article dans une collection
    "inproceedings",  // Article de conférence
    "conference",     // Conférence
    "thesis",         // Thèse (PhD, Master)
    "mastersthesis",  // Thèse de master
    "phdthesis",      // Thèse de doctorat
    "techreport",     // Rapport technique
    "manual",         // Manuel technique
    "unpublished",    // Non publié
    "misc",           // Divers
    "online",         // Source en ligne
    "patent",         // Brevet
    "standard",       // Norme/Standard
    "dataset",        // Jeu de données
    "software"        // Logiciel
  ]).notNull().default("article"),
  // Informations principales
  title: varchar("title", { length: 500 }).notNull(),
  authors: text("authors"), // Format: "Nom1, Prénom1 and Nom2, Prénom2"
  year: int("year"),
  // Informations de publication
  journal: varchar("journal", { length: 255 }), // Nom du journal
  booktitle: varchar("booktitle", { length: 255 }), // Titre du livre (pour chapitres)
  publisher: varchar("publisher", { length: 255 }),
  volume: varchar("volume", { length: 50 }),
  number: varchar("number", { length: 50 }), // Numéro du journal
  pages: varchar("pages", { length: 50 }), // Ex: "123-145"
  edition: varchar("edition", { length: 50 }),
  chapter: varchar("chapter", { length: 100 }),
  // Identifiants
  doi: varchar("doi", { length: 100 }), // Digital Object Identifier
  isbn: varchar("isbn", { length: 20 }),
  issn: varchar("issn", { length: 20 }),
  pmid: varchar("pmid", { length: 20 }), // PubMed ID
  arxivId: varchar("arxiv_id", { length: 50 }), // arXiv ID
  url: varchar("url", { length: 500 }),
  // Informations supplémentaires
  abstract: text("abstract"),
  keywords: json("keywords").$type<string[]>(), // Mots-clés
  language: varchar("language", { length: 50 }).default("en"),
  // Classification PERFUMUM
  researchDomain: mysqlEnum("research_domain", [
    "chimie_olfactive",      // Chimie des molécules odorantes
    "botanique",             // Botanique et plantes aromatiques
    "ethnobotanique",        // Ethnobotanique et usages traditionnels
    "histoire_parfumerie",   // Histoire de la parfumerie
    "neurologie_olfactive",  // Neurosciences olfactives
    "extraction",            // Méthodes d'extraction
    "formulation",           // Formulation et création
    "reglementation",        // Réglementation (IFRA, REACH)
    "durabilite",            // Durabilité et conservation
    "tabac_cannabis",        // Recherche tabac/cannabis
    "methodologie",          // Méthodologie de recherche
    "autre"
  ]),
  relevanceScore: int("relevance_score").default(50), // Score de pertinence 0-100
  // Tags personnalisés
  tags: json("tags").$type<string[]>(),
  // Notes et annotations
  notes: text("notes"), // Notes personnelles sur la référence
  annotation: text("annotation"), // Annotation/résumé personnel
  // Fichier attaché
  pdfUrl: varchar("pdf_url", { length: 500 }), // URL vers le PDF (S3)
  // Statut de lecture
  readStatus: mysqlEnum("read_status", [
    "unread",       // Non lu
    "reading",      // En cours de lecture
    "read",         // Lu
    "to_review"     // À relire
  ]).default("unread"),
  // Relations avec d'autres entités PERFUMUM
  linkedMoleculeIds: json("linked_molecule_ids").$type<number[]>(), // IDs des molécules liées
  linkedPlantIds: json("linked_plant_ids").$type<number[]>(), // IDs des plantes liées
  linkedRecetteIds: json("linked_recette_ids").$type<number[]>(), // IDs des recettes liées
  // Métadonnées
  addedBy: int("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  entryKeyIdx: uniqueIndex("bibliography_entry_key_idx").on(table.entryKey),
  yearIdx: index("bibliography_year_idx").on(table.year),
  entryTypeIdx: index("bibliography_type_idx").on(table.entryType),
  domainIdx: index("bibliography_domain_idx").on(table.researchDomain),
}));

export type BibliographyEntry = typeof bibliographyEntries.$inferSelect;
export type InsertBibliographyEntry = typeof bibliographyEntries.$inferInsert;

// Relations pour bibliographyEntries
// ============================================================================
// BIBLIOGRAPHY-AXIS LINKS (Liens entre bibliographie et axes)
// ============================================================================

/**
 * Many-to-many relationship between bibliography entries and research axes.
 */
export const bibliographyAxisLinks = mysqlTable("bibliography_axis_links", {
  id: int("id").autoincrement().primaryKey(),
  bibliographyId: int("bibliography_id").notNull().references(() => bibliographyEntries.id, { onDelete: "cascade" }),
  axisId: int("axis_id").notNull().references(() => researchAxes.id, { onDelete: "cascade" }),
  relevance: mysqlEnum("relevance", [
    "primaire",        // Source primaire pour l'axe
    "secondaire",      // Source secondaire
    "contextuelle"     // Contexte/background
  ]).default("secondaire"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_bibliography_axis").on(table.bibliographyId, table.axisId),
}));

export type BibliographyAxisLink = typeof bibliographyAxisLinks.$inferSelect;
export type InsertBibliographyAxisLink = typeof bibliographyAxisLinks.$inferInsert;

// Relations pour bibliographyAxisLinks
// ============================================================================
// REFERENCE CITATIONS (Citations croisées entre références bibliographiques)
// ============================================================================

/**
 * Tracks citation relationships between bibliography entries.
 * Enables visualization of citation networks and influence graphs.
 * A "citing" reference cites a "cited" reference.
 */
export const referenceCitations = mysqlTable("reference_citations", {
  id: int("id").autoincrement().primaryKey(),
  // Source reference (the one that cites)
  citingId: int("citing_id").notNull().references(() => bibliographyEntries.id, { onDelete: "cascade" }),
  // Target reference (the one being cited)
  citedId: int("cited_id").notNull().references(() => bibliographyEntries.id, { onDelete: "cascade" }),
  // Citation context
  citationType: mysqlEnum("citation_type", [
    "direct",          // Citation directe dans le texte
    "indirect",        // Référence indirecte/paraphrase
    "methodological",  // Citation méthodologique
    "theoretical",     // Citation théorique/conceptuelle
    "data",            // Citation de données
    "critique",        // Citation critique
    "support",         // Citation de soutien
    "comparison"       // Citation comparative
  ]).default("direct"),
  // Context and notes
  context: text("context"), // Contexte de la citation (extrait ou description)
  pageNumber: varchar("page_number", { length: 50 }), // Page(s) où la citation apparaît
  notes: text("notes"), // Notes additionnelles
  // Importance/weight for graph visualization
  weight: int("weight").default(1), // Poids de la citation (1-5)
  // Verification status
  verified: boolean("verified").default(false),
  verifiedBy: int("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  // Metadata
  addedBy: int("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Unique constraint: one citation relationship per pair
  uniqueCitation: uniqueIndex("unique_reference_citation").on(table.citingId, table.citedId),
  // Indexes for efficient querying
  citingIdx: index("reference_citations_citing_idx").on(table.citingId),
  citedIdx: index("reference_citations_cited_idx").on(table.citedId),
  typeIdx: index("reference_citations_type_idx").on(table.citationType),
}));

export type ReferenceCitation = typeof referenceCitations.$inferSelect;
export type InsertReferenceCitation = typeof referenceCitations.$inferInsert;

// Relations for referenceCitations
// ============================================================================
// THEMATIC AXES (Axes thématiques v3 - Pack Niche Innovations)
// ============================================================================

/**
 * Thematic axes for organizing bibliography references.
 * Based on the PERFUMUM v3 pack structure:
 * - Meta-A: Olfactory Heritage & Archives
 * - Meta-B: Olfactory Arts & Chimie de l'espace
 * - Meta-C: Digital Olfaction (IA/VR/Capteurs) & Datasets
 */
export const thematicAxes = mysqlTable("thematic_axes", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  axisCode: varchar("axis_code", { length: 20 }).notNull().unique(), // A1, B1, B2, C1, etc.
  name: varchar("name", { length: 255 }).notNull(),
  // Meta-axis (parent category)
  metaAxis: mysqlEnum("meta_axis", [
    "meta_a",  // Olfactory Heritage & Archives
    "meta_b",  // Olfactory Arts & Chimie de l'espace
    "meta_c",  // Digital Olfaction (IA/VR/Capteurs) & Datasets
    "other"
  ]).notNull(),
  // Description
  description: text("description"),
  outputTypes: text("output_types"), // Types de sorties attendues (encyclopédie, datasets, etc.)
  // UI properties
  color: varchar("color", { length: 20 }).default("#6366f1"),
  icon: varchar("icon", { length: 50 }),
  // Order for display
  displayOrder: int("display_order").default(0),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  axisCodeIdx: uniqueIndex("thematic_axis_code_idx").on(table.axisCode),
  metaAxisIdx: index("thematic_axis_meta_idx").on(table.metaAxis),
}));

export type ThematicAxis = typeof thematicAxes.$inferSelect;
export type InsertThematicAxis = typeof thematicAxes.$inferInsert;

// ============================================================================
// V3 REFERENCES (Références bibliographiques pack v3)
// ============================================================================

/**
 * Bibliography references from the v3 pack (Niche Innovations).
 * 69 references with thematic axes (A1, B1, C1, etc.)
 */
export const v3References = mysqlTable("v3_references", {
  id: int("id").autoincrement().primaryKey(),
  // Identification unique (BibTeX key)
  entryKey: varchar("entry_key", { length: 100 }).notNull().unique(),
  // Type de source
  entryType: mysqlEnum("entry_type", [
    "article",
    "book",
    "chapter",
    "thesis",
    "conference_paper",
    "report",
    "website",
    "web_entry",
    "news",
    "preprint",
    "dataset",
    "software",
    "misc"
  ]).notNull().default("article"),
  // Informations principales
  title: varchar("title", { length: 500 }).notNull(),
  authors: text("authors"),
  year: int("year"),
  // Publication info
  containerTitle: varchar("container_title", { length: 255 }), // Journal, book title, etc.
  publisher: varchar("publisher", { length: 255 }),
  // Identifiants
  doi: varchar("doi", { length: 100 }),
  isbn: varchar("isbn", { length: 20 }),
  url: varchar("url", { length: 500 }),
  // Axes thématiques
  axisPrimaryId: int("axis_primary_id").references(() => thematicAxes.id),
  axisPrimaryCode: varchar("axis_primary_code", { length: 50 }), // Stockage direct du code (A1, B1, etc.)
  axesSecondary: json("axes_secondary").$type<string[]>(), // Codes des axes secondaires
  // Annotations
  notes: text("notes"), // Notes de l'auteur original
  userNotes: text("user_notes"), // Notes personnelles de l'utilisateur
  // Tags
  tags: json("tags").$type<string[]>(),
  // Statut
  readStatus: mysqlEnum("read_status", [
    "unread",
    "reading",
    "read",
    "to_review"
  ]).default("unread"),
  relevanceScore: int("relevance_score").default(50), // 0-100
  // Metadata
  importedAt: timestamp("imported_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  entryKeyIdx: uniqueIndex("v3_ref_entry_key_idx").on(table.entryKey),
  yearIdx: index("v3_ref_year_idx").on(table.year),
  typeIdx: index("v3_ref_type_idx").on(table.entryType),
  axisPrimaryIdx: index("v3_ref_axis_primary_idx").on(table.axisPrimaryId),
}));

export type V3Reference = typeof v3References.$inferSelect;
export type InsertV3Reference = typeof v3References.$inferInsert;

// Relations pour v3References
// ============================================================================
// REFERENCE TAGS (Tags pour les références)
// ============================================================================

/**
 * Tags system for organizing and filtering references.
 * Supports hierarchical tags and tag categories.
 */
export const referenceTags = mysqlTable("reference_tags", {
  id: int("id").autoincrement().primaryKey(),
  // Tag info
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // URL-friendly version
  // Category
  category: mysqlEnum("category", [
    "theme",        // Thème de recherche
    "method",       // Méthode
    "source_type",  // Type de source
    "region",       // Région géographique
    "period",       // Période historique
    "material",     // Matériau/ingrédient
    "discipline",   // Discipline académique
    "project",      // Projet de recherche
    "custom"        // Tag personnalisé
  ]).default("custom"),
  // Description
  description: text("description"),
  // UI
  color: varchar("color", { length: 20 }).default("#6b7280"),
  // Hierarchy (optional parent tag)
  parentId: int("parent_id"),
  // Usage count (for popularity sorting)
  usageCount: int("usage_count").default(0),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("ref_tag_slug_idx").on(table.slug),
  categoryIdx: index("ref_tag_category_idx").on(table.category),
  parentIdx: index("ref_tag_parent_idx").on(table.parentId),
}));

export type ReferenceTag = typeof referenceTags.$inferSelect;
export type InsertReferenceTag = typeof referenceTags.$inferInsert;

// ============================================================================
// V3 REFERENCE TAG LINKS (Liaison références-tags)
// ============================================================================

/**
 * Many-to-many relationship between v3 references and tags.
 */
export const v3ReferenceTagLinks = mysqlTable("v3_reference_tag_links", {
  id: int("id").autoincrement().primaryKey(),
  referenceId: int("reference_id").notNull().references(() => v3References.id, { onDelete: "cascade" }),
  tagId: int("tag_id").notNull().references(() => referenceTags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_v3_ref_tag").on(table.referenceId, table.tagId),
  refIdx: index("v3_ref_tag_ref_idx").on(table.referenceId),
  tagIdx: index("v3_ref_tag_tag_idx").on(table.tagId),
}));

export type V3ReferenceTagLink = typeof v3ReferenceTagLinks.$inferSelect;
export type InsertV3ReferenceTagLink = typeof v3ReferenceTagLinks.$inferInsert;

// Relations pour v3ReferenceTagLinks
// ============================================================================
// REFERENCE NOTES (Notes enrichies pour les références)
// ============================================================================

/**
 * Rich notes system for references.
 * Supports multiple notes per reference with different types.
 */
export const referenceNotes = mysqlTable("reference_notes", {
  id: int("id").autoincrement().primaryKey(),
  // Reference link
  referenceId: int("reference_id").notNull().references(() => v3References.id, { onDelete: "cascade" }),
  // Note type
  noteType: mysqlEnum("note_type", [
    "summary",      // Résumé
    "critique",     // Critique
    "quote",        // Citation
    "methodology",  // Note méthodologique
    "connection",   // Connexion avec d'autres travaux
    "idea",         // Idée inspirée
    "question",     // Question soulevée
    "todo",         // À faire
    "general"       // Note générale
  ]).default("general"),
  // Content
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  // Quote specific (if noteType is 'quote')
  pageNumber: varchar("page_number", { length: 50 }),
  // Priority/importance
  importance: mysqlEnum("importance", [
    "low",
    "medium",
    "high",
    "critical"
  ]).default("medium"),
  // Status
  isResolved: boolean("is_resolved").default(false), // For todo/question types
  // Metadata
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  refIdx: index("ref_notes_ref_idx").on(table.referenceId),
  typeIdx: index("ref_notes_type_idx").on(table.noteType),
  importanceIdx: index("ref_notes_importance_idx").on(table.importance),
}));

export type ReferenceNote = typeof referenceNotes.$inferSelect;
export type InsertReferenceNote = typeof referenceNotes.$inferInsert;

// Relations pour referenceNotes
// ============================================================================
// REFERENCE ENTITY LINKS (Liaisons entre références et entités PERFUMUM)
// ============================================================================

/**
 * Links between v3 references and various PERFUMUM entities.
 * Enables connecting bibliography references to:
 * - Leaf Economies (plantes menacées, échantillons botaniques)
 * - Molecules (molécules olfactives)
 * - Recettes (formulations)
 * - Plants (plantes)
 * - Prototypes (C1-C4)
 * 
 * Particularly useful for:
 * - H2 (Durabilité) → plantes menacées (leaf_economies)
 * - H3 (Traditions antiques) → traditions olfactives documentées
 */
export const referenceEntityLinks = mysqlTable("reference_entity_links", {
  id: int("id").autoincrement().primaryKey(),
  // Reference source
  referenceId: int("reference_id").notNull().references(() => v3References.id, { onDelete: "cascade" }),
  // Entity type and ID
  entityType: mysqlEnum("entity_type", [
    "leaf_economy",    // Échantillon botanique (San Andrés, etc.)
    "molecule",        // Molécule olfactive
    "recette",         // Recette/formulation
    "plant",           // Plante
    "prototype",       // Prototype C1-C4
    "tradition",       // Tradition olfactive (pour H3)
    "terroir",         // Terroir/région
    "supplier"         // Fournisseur
  ]).notNull(),
  entityId: int("entity_id").notNull(), // ID de l'entité liée
  // Link metadata
  linkType: mysqlEnum("link_type", [
    "documents",       // La référence documente l'entité
    "mentions",        // La référence mentionne l'entité
    "analyzes",        // La référence analyse l'entité
    "conserves",       // La référence traite de la conservation
    "reconstructs",    // La référence traite de la reconstruction
    "sources",         // La référence est une source pour l'entité
    "validates",       // La référence valide l'entité
    "contextualizes"   // La référence contextualise l'entité
  ]).default("documents"),
  // Relevance score (0-100)
  relevanceScore: int("relevance_score").default(50),
  // Notes
  notes: text("notes"),
  // Context (extrait pertinent de la référence)
  context: text("context"),
  // Metadata
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_ref_entity_link").on(table.referenceId, table.entityType, table.entityId),
  refIdx: index("ref_entity_ref_idx").on(table.referenceId),
  entityIdx: index("ref_entity_entity_idx").on(table.entityType, table.entityId),
  linkTypeIdx: index("ref_entity_link_type_idx").on(table.linkType),
}));

export type ReferenceEntityLink = typeof referenceEntityLinks.$inferSelect;
export type InsertReferenceEntityLink = typeof referenceEntityLinks.$inferInsert;

// Relations pour referenceEntityLinks