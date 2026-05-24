import { index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar, year } from "drizzle-orm/mysql-core";

// ============================================================================
// OLFACTIVE ARCHIVES (Archives historiques et documents)
// ============================================================================

export const olfactiveArchives = mysqlTable("olfactive_archives", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  title: varchar("title", { length: 500 }).notNull(),
  type: mysqlEnum("type", [
    "manuscript",              // Manuscrit ancien
    "formula",                 // Formule historique
    "archaeological",          // Découverte archéologique
    "botanical_illustration"   // Illustration botanique
  ]).notNull(),
  // Datation
  dateCreated: varchar("date_created", { length: 100 }), // Date historique (format flexible)
  civilization: varchar("civilization", { length: 255 }), // Égypte, Rome, Grèce, etc.
  // Contenu
  plantIds: json("plant_ids").$type<number[]>().default([]), // Plantes mentionnées
  moleculeIds: json("molecule_ids").$type<number[]>().default([]), // Molécules si connues
  description: text("description"), // Description du contenu
  provenance: text("provenance"), // Source du document
  // Authenticité
  authenticityLevel: mysqlEnum("authenticity_level", [
    "confirmed",     // Confirmé par sources multiples
    "probable",      // Probable mais non confirmé
    "hypothetical"   // Hypothétique/reconstruction
  ]).notNull().default("probable"),
  // Références
  references: json("references").$type<{
    author?: string;
    year?: number;
    title: string;
    type: string;
    url?: string;
  }[]>().default([]),
  imageUrl: varchar("image_url", { length: 500 }),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("olfactive_archives_type_idx").on(table.type),
  civilizationIdx: index("olfactive_archives_civilization_idx").on(table.civilization),
}));

export type OlfactiveArchive = typeof olfactiveArchives.$inferSelect;
export type InsertOlfactiveArchive = typeof olfactiveArchives.$inferInsert;

