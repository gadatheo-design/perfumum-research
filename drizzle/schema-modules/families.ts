import { int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// FAMILIES (Olfactive families: Bio-Mineralis, Pétrichor, Volcanique, etc.)
// ============================================================================

export const families = mysqlTable("families", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "perfumeum12",
    "biomineralis",
    "petrichor",
    "volcanique",
    "solarmineralis",
    "necrogeo",
    "other"
  ]).notNull(),
  description: text("description"),
  variationCount: int("variationCount").default(0),
  // Linked Data ontologique
  wikidataQid: varchar("wikidata_qid", { length: 20 }), // Wikidata QID (ex: Q1234567)
  rdfType: varchar("rdf_type", { length: 255 }), // URI classe ontologique (ex: http://www.w3.org/2004/02/skos/core#Concept)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Family = typeof families.$inferSelect;
export type InsertFamily = typeof families.$inferInsert;

