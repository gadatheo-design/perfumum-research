import { index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// VARIETY GENEALOGY (Généalogie des variétés botaniques)
// ============================================================================

export const varietyGenealogy = mysqlTable("variety_genealogy", {
  id: int("id").autoincrement().primaryKey(),
  // Relations
  varietyId: int("variety_id").notNull(), // Référence à plant_varieties
  parentVarietyId: int("parent_variety_id").notNull(), // Auto-référence
  // Type de relation
  relationshipType: mysqlEnum("relationship_type", [
    "parent",    // Parent direct
    "hybrid",    // Hybride (croisement)
    "clone",     // Clone
    "mutation"   // Mutation naturelle ou induite
  ]).notNull().default("parent"),
  // Informations sur le croisement
  crossDate: int("cross_date"), // Année du croisement
  breeder: varchar("breeder", { length: 255 }), // Obtenteur/sélectionneur
  notes: text("notes"),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  varietyIdx: index("variety_genealogy_variety_idx").on(table.varietyId),
  parentIdx: index("variety_genealogy_parent_idx").on(table.parentVarietyId),
}));

export type VarietyGenealogy = typeof varietyGenealogy.$inferSelect;
export type InsertVarietyGenealogy = typeof varietyGenealogy.$inferInsert;

