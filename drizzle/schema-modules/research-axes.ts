import { boolean, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { and, or} from "drizzle-orm";

import { thematicAxes, v3References } from "./bibliography";
import { users } from "./core";
import { molecules } from "./molecules";
import { plants, terroirs } from "./plants";

// ============================================================================
// RESEARCH AXES (Axes de recherche)
// ============================================================================

/**
 * Research axes for organizing research themes and directions.
 * Each axis represents a major research direction (AX1, AX2, etc.)
 */
export const researchAxes = mysqlTable("research_axes", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  axisCode: varchar("axis_code", { length: 20 }).notNull().unique(), // AX1, AX2, AX3, etc.
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }), // Sous-titre descriptif
  // Description
  description: text("description"),
  objectives: text("objectives"), // Objectifs de l'axe
  methodology: text("methodology"), // Méthodologie associée
  // Classification
  category: mysqlEnum("category", [
    "fondamental",     // Recherche fondamentale
    "applique",        // Recherche appliquée
    "experimental",    // Recherche expérimentale
    "theorique",       // Recherche théorique
    "historique",      // Recherche historique
    "ethnographique",  // Recherche ethnographique
    "technique"        // Recherche technique
  ]).default("fondamental"),
  // Statut
  status: mysqlEnum("status", [
    "planifie",        // Planifié
    "en_cours",        // En cours
    "pause",           // En pause
    "termine",         // Terminé
    "archive"          // Archivé
  ]).default("planifie"),
  priority: mysqlEnum("priority", [
    "haute",
    "moyenne",
    "basse"
  ]).default("moyenne"),
  // Dates
  startDate: timestamp("start_date"),
  targetEndDate: timestamp("target_end_date"),
  actualEndDate: timestamp("actual_end_date"),
  // Progression
  progressPercent: int("progress_percent").default(0), // 0-100
  // Couleur et icône pour l'UI
  color: varchar("color", { length: 20 }).default("#6366f1"), // Couleur hex
  icon: varchar("icon", { length: 50 }), // Nom de l'icône (Lucide)
  // Relations
  parentAxisId: int("parent_axis_id"), // Pour les sous-axes
  // Tags
  tags: json("tags").$type<string[]>(),
  // Linked Data
  wikidataQid: varchar("wikidata_qid", { length: 20 }), // Wikidata QID (ex: Q1234)
  rdfType: varchar("rdf_type", { length: 255 }), // URI ontologie (ex: http://www.w3.org/2004/02/skos/core#Concept)
  meshId: varchar("mesh_id", { length: 20 }), // MeSH ID (ex: D000001)
  unescoCode: varchar("unesco_code", { length: 20 }), // Code UNESCO SKOS
  // Métadonnées
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  axisCodeIdx: uniqueIndex("research_axis_code_idx").on(table.axisCode),
  statusIdx: index("research_axis_status_idx").on(table.status),
  categoryIdx: index("research_axis_category_idx").on(table.category),
}));

export type ResearchAxis = typeof researchAxes.$inferSelect;
export type InsertResearchAxis = typeof researchAxes.$inferInsert;

// ============================================================================
// RESEARCH ENTRIES (Entrées de recherche)
// ============================================================================

/**
 * Individual research entries within an axis.
 * Each entry represents a note, finding, or piece of research data.
 */
export const researchEntries = mysqlTable("research_entries", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  entryCode: varchar("entry_code", { length: 50 }).notNull().unique(), // AX1-001, AX1-002, etc.
  axisId: int("axis_id").notNull().references(() => researchAxes.id, { onDelete: "cascade" }),
  // Contenu principal
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // Contenu principal (Markdown supporté)
  summary: text("summary"), // Résumé court
  // Type d'entrée
  entryType: mysqlEnum("entry_type", [
    "note",            // Note de recherche
    "observation",     // Observation
    "hypothese",       // Hypothèse
    "resultat",        // Résultat
    "conclusion",      // Conclusion
    "question",        // Question de recherche
    "idee",            // Idée
    "protocole",       // Protocole expérimental
    "donnees",         // Données brutes
    "analyse",         // Analyse
    "reference",       // Référence bibliographique
    "citation",        // Citation
    "media",           // Média (image, vidéo)
    "lien",            // Lien externe
    "autre"
  ]).default("note"),
  // Statut
  status: mysqlEnum("status", [
    "brouillon",       // Brouillon
    "en_revision",     // En révision
    "valide",          // Validé
    "archive"          // Archivé
  ]).default("brouillon"),
  // Importance
  importance: mysqlEnum("importance", [
    "critique",        // Critique
    "haute",           // Haute
    "moyenne",         // Moyenne
    "basse",           // Basse
    "reference"        // Pour référence
  ]).default("moyenne"),
  // Date de l'entrée (peut être différente de createdAt)
  entryDate: timestamp("entry_date"),
  // Fichiers attachés
  attachments: json("attachments").$type<{
    name: string;
    url: string;
    type: string; // mime type
    size?: number;
  }[]>(),
  // Relations avec la bibliographie
  bibliographyIds: json("bibliography_ids").$type<number[]>(), // IDs des références liées
  // Relations avec d'autres entités PERFUMUM
  linkedMoleculeIds: json("linked_molecule_ids").$type<number[]>(),
  linkedPlantIds: json("linked_plant_ids").$type<number[]>(),
  linkedRecetteIds: json("linked_recette_ids").$type<number[]>(),
  linkedPrototypeIds: json("linked_prototype_ids").$type<number[]>(),
  // Tags
  tags: json("tags").$type<string[]>(),
  // Position dans l'axe (pour l'ordre d'affichage)
  sortOrder: int("sort_order").default(0),
  // Métadonnées
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  entryCodeIdx: uniqueIndex("research_entry_code_idx").on(table.entryCode),
  axisIdx: index("research_entry_axis_idx").on(table.axisId),
  typeIdx: index("research_entry_type_idx").on(table.entryType),
  statusIdx: index("research_entry_status_idx").on(table.status),
}));

export type ResearchEntry = typeof researchEntries.$inferSelect;
export type InsertResearchEntry = typeof researchEntries.$inferInsert;

// Relations pour researchAxes
// Relations pour researchEntries
// ============================================================================
// AXIS CONNECTIONS (Connexions entre axes pour le graphe)
// ============================================================================

/**
 * Connections between thematic axes for visualization.
 * Used for the D3.js force graph.
 */
export const axisConnections = mysqlTable("axis_connections", {
  id: int("id").autoincrement().primaryKey(),
  // Source and target axes
  sourceAxisId: int("source_axis_id").notNull().references(() => thematicAxes.id, { onDelete: "cascade" }),
  targetAxisId: int("target_axis_id").notNull().references(() => thematicAxes.id, { onDelete: "cascade" }),
  // Connection strength (for graph visualization)
  strength: int("strength").default(1), // 1-10
  // Connection type
  connectionType: mysqlEnum("connection_type", [
    "related",      // Axes liés thématiquement
    "complementary", // Axes complémentaires
    "dependent",    // Axe dépendant d'un autre
    "overlap"       // Axes qui se chevauchent
  ]).default("related"),
  // Notes
  notes: text("notes"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueConnection: uniqueIndex("unique_axis_connection").on(table.sourceAxisId, table.targetAxisId),
  sourceIdx: index("axis_conn_source_idx").on(table.sourceAxisId),
  targetIdx: index("axis_conn_target_idx").on(table.targetAxisId),
}));

export type AxisConnection = typeof axisConnections.$inferSelect;
export type InsertAxisConnection = typeof axisConnections.$inferInsert;

// Relations pour axisConnections
// ============================================================================
// CURATED OLFACTORY JOURNEYS (Parcours olfactifs prédéfinis)
// ============================================================================

/**
 * Curated olfactory journeys for guided exploration.
 * Each journey is a themed collection of terroirs, plants, and molecules
 * that users can follow for a structured olfactory experience.
 */
export const curatedJourneys = mysqlTable("curated_journeys", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  code: varchar("code", { length: 50 }).notNull().unique(), // e.g., "ENCENS-MONDE", "MEDITERR-PLANTES"
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }), // English name
  // Description
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  // Theme and category
  theme: mysqlEnum("theme", [
    "geographic",      // Par région géographique
    "olfactive",       // Par famille olfactive
    "botanical",       // Par famille botanique
    "historical",      // Par période historique
    "seasonal",        // Par saison
    "therapeutic",     // Par usage thérapeutique
    "culinary",        // Aromates culinaires
    "sacred",          // Encens et rituels
    "luxury",          // Matières précieuses
    "sustainable",     // Durabilité et conservation
    "custom"           // Personnalisé
  ]).notNull(),
  // Visual
  emoji: varchar("emoji", { length: 10 }),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  color: varchar("color", { length: 20 }), // Hex color for UI
  // Difficulty and duration
  difficulty: mysqlEnum("difficulty", [
    "beginner",        // Débutant
    "intermediate",    // Intermédiaire
    "advanced",        // Avancé
    "expert"           // Expert
  ]).default("beginner"),
  estimatedDuration: int("estimated_duration"), // Minutes
  // Content counts (cached for performance)
  terroirCount: int("terroir_count").default(0),
  plantCount: int("plant_count").default(0),
  moleculeCount: int("molecule_count").default(0),
  // Status
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: int("sort_order").default(0),
  // Metadata
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  codeIdx: uniqueIndex("journey_code_idx").on(table.code),
  themeIdx: index("journey_theme_idx").on(table.theme),
  publishedIdx: index("journey_published_idx").on(table.isPublished),
  featuredIdx: index("journey_featured_idx").on(table.isFeatured),
}));

export type CuratedJourney = typeof curatedJourneys.$inferSelect;
export type InsertCuratedJourney = typeof curatedJourneys.$inferInsert;

// ============================================================================
// JOURNEY ITEMS (Éléments des parcours)
// ============================================================================

/**
 * Items within a curated journey.
 * Links terroirs, plants, and molecules to journeys with ordering.
 */
export const journeyItems = mysqlTable("journey_items", {
  id: int("id").autoincrement().primaryKey(),
  journeyId: int("journey_id").notNull().references(() => curatedJourneys.id, { onDelete: "cascade" }),
  // Item type and reference
  itemType: mysqlEnum("item_type", [
    "terroir",
    "plant",
    "molecule"
  ]).notNull(),
  terroirId: int("terroir_id").references(() => terroirs.id, { onDelete: "cascade" }),
  plantId: int("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  moleculeId: int("molecule_id").references(() => molecules.id, { onDelete: "cascade" }),
  // Ordering and grouping
  sortOrder: int("sort_order").default(0),
  stepNumber: int("step_number"), // For sequential journeys
  groupName: varchar("group_name", { length: 100 }), // For grouped items
  // Description for this item in context
  contextDescription: text("context_description"),
  // Highlight flag
  isHighlight: boolean("is_highlight").default(false),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  journeyIdx: index("journey_item_journey_idx").on(table.journeyId),
  typeIdx: index("journey_item_type_idx").on(table.itemType),
  orderIdx: index("journey_item_order_idx").on(table.journeyId, table.sortOrder),
}));

export type JourneyItem = typeof journeyItems.$inferSelect;
export type InsertJourneyItem = typeof journeyItems.$inferInsert;

// Relations pour curatedJourneys
// Relations pour journeyItems
// ============================================================================
// AXIS REFERENCE LINKS (Liaisons axes-références pour le graphe)
// ============================================================================

/**
 * Many-to-many relationship between research axes and v3 references.
 * Enables visualization of connections between axes and their supporting references
 * in the force-directed graph.
 */
export const axisReferenceLinks = mysqlTable("axis_reference_links", {
  id: int("id").autoincrement().primaryKey(),
  // Entités liées
  axisId: int("axis_id").notNull().references(() => researchAxes.id, { onDelete: "cascade" }),
  referenceId: int("reference_id").notNull().references(() => v3References.id, { onDelete: "cascade" }),
  // Type de liaison
  linkType: mysqlEnum("link_type", [
    "primary_source",      // Source primaire de l'axe
    "secondary_source",    // Source secondaire
    "methodology",         // Référence méthodologique
    "theoretical_basis",   // Base théorique
    "case_study",          // Étude de cas
    "data_source",         // Source de données
    "comparative",         // Référence comparative
    "historical",          // Contexte historique
    "review",              // Revue de littérature
    "other"
  ]).default("secondary_source"),
  // Pertinence et qualité
  relevanceScore: int("relevance_score").default(50), // 0-100
  confidence: mysqlEnum("confidence", ["high", "medium", "low"]).default("medium"),
  // Annotations
  notes: text("notes"),
  excerpt: text("excerpt"), // Extrait pertinent de la référence
  pageNumbers: varchar("page_numbers", { length: 100 }), // Pages spécifiques
  // Visualisation dans le graphe
  displayWeight: int("display_weight").default(1), // Épaisseur du lien dans le graphe (1-10)
  isHighlighted: boolean("is_highlighted").default(false), // Mettre en évidence dans le graphe
  // Métadonnées
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  axisIdx: index("axis_ref_link_axis_idx").on(table.axisId),
  referenceIdx: index("axis_ref_link_ref_idx").on(table.referenceId),
  uniqueLink: uniqueIndex("unique_axis_reference").on(table.axisId, table.referenceId),
  linkTypeIdx: index("axis_ref_link_type_idx").on(table.linkType),
}));

export type AxisReferenceLink = typeof axisReferenceLinks.$inferSelect;
export type InsertAxisReferenceLink = typeof axisReferenceLinks.$inferInsert;

// Relations pour axisReferenceLinks