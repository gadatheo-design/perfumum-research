import { int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// TABACS (Tobacco varieties)
// ============================================================================

export const tabacs = mysqlTable("tabacs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["blond", "brun", "oriental", "experimental"]).notNull(),
  origin: varchar("origin", { length: 255 }),
  aromaticProfile: text("aromaticProfile"), // JSON array: terre, miel, fumée, etc.
  intensity: int("intensity"), // 1-10
  idealTemperature: int("idealTemperature"),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tabac = typeof tabacs.$inferSelect;
export type InsertTabac = typeof tabacs.$inferInsert;

