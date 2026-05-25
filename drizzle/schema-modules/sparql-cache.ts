import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ============================================================================
// SPARQL CACHE (Cache des requêtes SPARQL internes)
// ============================================================================

/**
 * Cache des requêtes SPARQL avec TTL 24h.
 * Évite les requêtes répétées sur les graphes de connaissances.
 * Axe 2.5 — Rapport 7 PERFUMUM
 */
export const sparqlCache = mysqlTable("sparql_cache", {
  id: int("id").autoincrement().primaryKey(),
  // Hash SHA-256 de la requête normalisée (clé de cache)
  queryHash: varchar("query_hash", { length: 64 }).notNull().unique(),
  // Requête SPARQL originale (pour debug/audit)
  queryText: text("query_text").notNull(),
  // Type de requête
  queryType: varchar("query_type", { length: 20 }).notNull().default("SELECT"),
  // Résultats sérialisés en JSON
  resultsJson: text("results_json").notNull(),
  // Nombre de résultats retournés
  resultCount: int("result_count").notNull().default(0),
  // Durée d'exécution de la requête originale (ms)
  executionTimeMs: int("execution_time_ms"),
  // Nombre de fois que ce cache a été utilisé (hit count)
  hitCount: int("hit_count").notNull().default(0),
  // Expiration du cache (TTL 24h par défaut)
  expiresAt: timestamp("expires_at").notNull(),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
}, (table) => ({
  queryHashIdx: uniqueIndex("sparql_cache_hash_idx").on(table.queryHash),
  expiresIdx: index("sparql_cache_expires_idx").on(table.expiresAt),
  createdIdx: index("sparql_cache_created_idx").on(table.createdAt),
}));

export type SparqlCache = typeof sparqlCache.$inferSelect;
export type InsertSparqlCache = typeof sparqlCache.$inferInsert;
