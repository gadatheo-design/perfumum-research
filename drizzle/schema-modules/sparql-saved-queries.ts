import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";

// ============================================================================
// SPARQL SAVED QUERIES (Bibliothèque de requêtes SPARQL personnelles)
// ============================================================================
/**
 * Bibliothèque personnelle de requêtes SPARQL sauvegardées.
 * Permet de conserver, annoter et réutiliser des requêtes Wikidata/Europeana.
 * Rapport 21 PERFUMUM — Amélioration Explorateur SPARQL
 */
export const sparqlSavedQueries = mysqlTable("sparql_saved_queries", {
  id: int("id").autoincrement().primaryKey(),

  // Titre de la requête (obligatoire)
  title: varchar("title", { length: 255 }).notNull(),

  // Requête SPARQL complète
  sparqlQuery: text("sparql_query").notNull(),

  // Description / notes de recherche
  notes: text("notes"),

  // Tags séparés par virgule (ex: "molécule,wikidata,rose")
  tags: varchar("tags", { length: 500 }),

  // Catégorie (molecule, plant, artwork, temporal, genealogy, free)
  category: varchar("category", { length: 50 }).notNull().default("free"),

  // Endpoint utilisé (wikidata, europeana-edm, internal)
  endpoint: varchar("endpoint", { length: 50 }).notNull().default("wikidata"),

  // Entité PERFUMUM liée (optionnel)
  linkedEntityType: varchar("linked_entity_type", { length: 20 }), // molecule | plant | recette
  linkedEntityId: int("linked_entity_id"),
  linkedEntityName: varchar("linked_entity_name", { length: 255 }),

  // QID Wikidata injecté dans la requête (si applicable)
  injectedQid: varchar("injected_qid", { length: 20 }),

  // Nombre de résultats lors de la dernière exécution
  lastResultCount: int("last_result_count"),

  // Durée d'exécution lors de la dernière exécution (ms)
  lastExecutionMs: int("last_execution_ms"),

  // Nombre de fois exécutée
  executionCount: int("execution_count").notNull().default(0),

  // Favori (épinglé en haut de la bibliothèque)
  isFavorite: int("is_favorite").notNull().default(0),

  // Métadonnées temporelles
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastExecutedAt: timestamp("last_executed_at"),
}, (table) => ({
  categoryIdx: index("idx_sparql_saved_category").on(table.category),
  endpointIdx: index("idx_sparql_saved_endpoint").on(table.endpoint),
  favoriteIdx: index("idx_sparql_saved_favorite").on(table.isFavorite),
  entityIdx: index("idx_sparql_saved_entity").on(table.linkedEntityType, table.linkedEntityId),
}));
