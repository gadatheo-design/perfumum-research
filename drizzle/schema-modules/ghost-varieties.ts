import { boolean, decimal, index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";


// ============================================================================
// GHOST VARIETY MOLECULE LINKS (Liaisons variétés fantômes ↔ molécules)
// ============================================================================

export const ghostVarietyMoleculeLinks = mysqlTable("ghost_variety_molecule_links", {
  id: int("id").autoincrement().primaryKey(),
  // Entités liées
  ghostVarietyId: int("ghost_variety_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  // Métadonnées de la liaison
  linkType: mysqlEnum("link_type", [
    "dominant",           // Molécule dominante dans le profil
    "characteristic",     // Molécule caractéristique de la variété
    "trace",             // Présente en traces
    "reconstructed",     // Identifiée lors de tentatives de reconstruction
    "historical",        // Mentionnée dans sources historiques
    "hypothetical",      // Supposée basée sur analyse comparative
    "other"
  ]).default("characteristic"),
  // Données quantitatives
  percentage: decimal("percentage", { precision: 5, scale: 2 }), // Pourcentage si connu
  minPercentage: decimal("min_percentage", { precision: 5, scale: 2 }),
  maxPercentage: decimal("max_percentage", { precision: 5, scale: 2 }),
  // Qualité de l'information
  confidence: mysqlEnum("confidence", ["high", "medium", "low"]).default("medium"),
  sourceType: mysqlEnum("source_type", [
    "gc_ms_analysis",     // Analyse GC-MS
    "historical_text",    // Texte historique
    "reconstruction",     // Tentative de reconstruction
    "comparative",        // Analyse comparative avec variétés proches
    "expert_opinion",     // Opinion d'expert
    "other"
  ]).default("other"),
  // Informations complémentaires
  notes: text("notes"),
  sourceReference: text("source_reference"), // Référence bibliographique
  analysisYear: int("analysis_year"), // Année de l'analyse si applicable
  // Métadonnées
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ghostVarietyIdx: index("gv_mol_link_variety_idx").on(table.ghostVarietyId),
  moleculeIdx: index("gv_mol_link_molecule_idx").on(table.moleculeId),
  uniqueLink: uniqueIndex("unique_gv_molecule").on(table.ghostVarietyId, table.moleculeId),
}));

export type GhostVarietyMoleculeLink = typeof ghostVarietyMoleculeLinks.$inferSelect;
export type InsertGhostVarietyMoleculeLink = typeof ghostVarietyMoleculeLinks.$inferInsert;

// Relations
// ============================================================================
// GHOST VARIETY PLANT LINKS (Liaisons variétés fantômes ↔ plantes parentes)
// ============================================================================

export const ghostVarietyPlantLinks = mysqlTable("ghost_variety_plant_links", {
  id: int("id").autoincrement().primaryKey(),
  // Entités liées
  ghostVarietyId: int("ghost_variety_id").notNull(),
  plantId: int("plant_id").notNull(),
  // Type de relation
  relationshipType: mysqlEnum("relationship_type", [
    "parent_species",     // Espèce parente
    "related_variety",    // Variété apparentée
    "hybrid_parent",      // Parent d'hybride
    "descendant",         // Descendant moderne
    "comparison",         // Utilisée pour comparaison
    "reconstruction_base", // Base pour reconstruction
    "other"
  ]).default("parent_species"),
  // Qualité de l'information
  confidence: mysqlEnum("confidence", ["high", "medium", "low"]).default("medium"),
  // Informations complémentaires
  geneticSimilarity: int("genetic_similarity"), // Pourcentage de similarité génétique si connu (0-100)
  notes: text("notes"),
  sourceReference: text("source_reference"),
  // Métadonnées
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ghostVarietyIdx: index("gv_plant_link_variety_idx").on(table.ghostVarietyId),
  plantIdx: index("gv_plant_link_plant_idx").on(table.plantId),
  uniqueLink: uniqueIndex("unique_gv_plant").on(table.ghostVarietyId, table.plantId),
}));

export type GhostVarietyPlantLink = typeof ghostVarietyPlantLinks.$inferSelect;
export type InsertGhostVarietyPlantLink = typeof ghostVarietyPlantLinks.$inferInsert;

// Relations
// ============================================================================
// GHOST VARIETY IMAGES (Images des variétés fantômes)
// ============================================================================

export const ghostVarietyImages = mysqlTable("ghost_variety_images", {
  id: int("id").autoincrement().primaryKey(),
  // Référence à la variété
  ghostVarietyId: int("ghost_variety_id").notNull(),
  // Informations sur l'image
  url: text("url").notNull(),
  fileKey: varchar("file_key", { length: 500 }).notNull(),
  filename: varchar("filename", { length: 255 }),
  mimeType: varchar("mime_type", { length: 50 }),
  fileSize: int("file_size"), // en bytes
  // Métadonnées de l'image
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageType: mysqlEnum("image_type", [
    "botanical_illustration",  // Illustration botanique historique
    "photograph",             // Photographie (si existante)
    "herbarium",              // Spécimen d'herbier
    "reconstruction",         // Image de reconstruction
    "artistic",               // Représentation artistique
    "microscopy",             // Image microscopique
    "other"
  ]).default("botanical_illustration"),
  // Source et attribution
  source: varchar("source", { length: 500 }), // Source de l'image
  attribution: text("attribution"), // Attribution/crédit
  year: int("year"), // Année de création de l'image
  license: varchar("license", { length: 100 }), // Type de licence
  // Ordre d'affichage
  sortOrder: int("sort_order").default(0),
  isPrimary: boolean("is_primary").default(false), // Image principale
  // Métadonnées
  uploadedBy: int("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ghostVarietyIdx: index("gv_image_variety_idx").on(table.ghostVarietyId),
  sortOrderIdx: index("gv_image_sort_idx").on(table.ghostVarietyId, table.sortOrder),
}));

export type GhostVarietyImage = typeof ghostVarietyImages.$inferSelect;
export type InsertGhostVarietyImage = typeof ghostVarietyImages.$inferInsert;

// Relations