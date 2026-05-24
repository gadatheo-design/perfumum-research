import { date, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// PETRICHOR (60 variations)
// ============================================================================

export const petrichor = mysqlTable("petrichor", {
  id: int("id").autoincrement().primaryKey(),
  variation: varchar("variation", { length: 255 }).notNull(),
  subfamily: mysqlEnum("subfamily", [
    "clair",
    "noir",
    "argile",
    "bois_humide",
    "racine",
    "mousse",
    "desert",
    "marin",
    "glaciaire",
    "urbain",
    "sacre"
  ]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Petrichor = typeof petrichor.$inferSelect;
export type InsertPetrichor = typeof petrichor.$inferInsert;


// ============================================================================
// VOLCANIQUE (36 variations)
// ============================================================================

export const volcanique = mysqlTable("volcanique", {
  id: int("id").autoincrement().primaryKey(),
  variation: varchar("variation", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "basalte_chaud",
    "basalte_froid",
    "vapeur",
    "soufre",
    "poussiere_tectonique",
    "magma_blanc",
    "pierre_poreuse"
  ]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Volcanique = typeof volcanique.$inferSelect;
export type InsertVolcanique = typeof volcanique.$inferInsert;


// ============================================================================
// INSTALLATIONS (Artistic installations)
// ============================================================================

export const installations = mysqlTable("installations", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  concept: text("concept"),
  materials: text("materials"),
  diffusionMode: text("diffusionMode"), // Flexible: description du mode de diffusion
  location: varchar("location", { length: 255 }),
  date: timestamp("date"),
  documentation: text("documentation"), // JSON: photos, videos, schemas URLs
  visitorExperience: text("visitorExperience"),
  theoreticalScope: text("theoreticalScope"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Installation = typeof installations.$inferSelect;
export type InsertInstallation = typeof installations.$inferInsert;

