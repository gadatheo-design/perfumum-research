import { int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// LABORATOIRE (Laboratory materials / raw materials)
// ============================================================================

export const laboratoire = mysqlTable("laboratoire", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  botanicalName: varchar("botanicalName", { length: 255 }),
  type: mysqlEnum("type", [
    "huile_essentielle",
    "absolu",
    "resinoid",
    "concrete",
    "co2",
    "teinture",
    "poudre",
    "alcoolat",
    "autre"
  ]).notNull(),
  olfactiveFamily: text("olfactiveFamily"), // JSON array
  note: mysqlEnum("note", ["tete", "coeur", "fond", "tete_coeur", "coeur_fond"]),
  origin: varchar("origin", { length: 255 }),
  extractionMethod: mysqlEnum("extractionMethod", [
    "distillation",
    "extraction_solvant",
    "co2_supercritique",
    "co2_sous_critique",
    "percolation_froide",
    "expression",
    "teinture",
    "autre"
  ]),
  olfactiveProfile: text("olfactiveProfile"),
  character: text("character"), // JSON array: frais, chaud, sec, etc.
  supplier: varchar("supplier", { length: 255 }),
  pricePerMl: int("pricePerMl"), // in cents (CHF)
  stock: int("stock"), // in ml
  purchaseDate: timestamp("purchaseDate"),
  status: mysqlEnum("status", ["en_stock", "a_commander", "epuise"]).default("en_stock"),
  technicalNotes: text("technicalNotes"),
  manipulationNotes: text("manipulationNotes"),
  maxTemperature: int("maxTemperature"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Laboratoire = typeof laboratoire.$inferSelect;
export type InsertLaboratoire = typeof laboratoire.$inferInsert;

