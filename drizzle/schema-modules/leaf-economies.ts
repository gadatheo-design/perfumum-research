import { date, decimal, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

import { molecules } from "./molecules";

// ============================================================================
// LEAF ECONOMIES (San Andrés / Seaflower Research)
// ============================================================================

export const leafEconomies = mysqlTable("leaf_economies", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  sampleId: varchar("sample_id", { length: 50 }).notNull().unique(), // SA-LE-001, SA-LE-002, etc.
  date: timestamp("date"),
  // Localisation
  island: mysqlEnum("island", ["san_andres", "providencia", "autre"]),
  preciseLocation: varchar("precise_location", { length: 255 }),
  sourceContact: text("source_contact"),
  // Classification botanique
  category: mysqlEnum("category", ["aromatique", "tabac", "cannabis"]).notNull(),
  species: varchar("species", { length: 255 }), // Nom scientifique
  claimedVariety: varchar("claimed_variety", { length: 255 }), // Variété revendiquée
  // Partie et état
  usedPart: mysqlEnum("used_part", ["feuille", "fleur", "resine", "tige", "autre"]),
  state: mysqlEnum("state", ["frais", "sec", "rehydrate"]),
  // Traitement
  curingTreatment: mysqlEnum("curing_treatment", ["aucun", "air_cured", "flue_cured", "sun_cured", "autre"]),
  // Extraction
  extraction: mysqlEnum("extraction", ["aucune", "maceration_alcool", "maceration_mct", "distillation", "headspace"]),
  ratioParameters: varchar("ratio_parameters", { length: 255 }), // e.g., "1:5 (m/v)"
  duration: varchar("duration", { length: 100 }), // e.g., "24h", "30m"
  // Profil olfactif
  odorNotes: text("odor_notes"),
  climaticAxis: text("climatic_axis"), // JSON array: ["vent", "sel", "bois", "disparition"]
  usage: text("usage"), // JSON array: ["parfum", "encens", "espace"]
  // Analyse chimique
  analysisAvailable: int("analysis_available").default(0), // 0 = false, 1 = true
  analysisMethod: mysqlEnum("analysis_method", ["gc_ms", "hplc", "autre"]),
  topMoleculesList: text("top_molecules_list"), // Liste complète des molécules
  topMolecule1: varchar("top_molecule_1", { length: 255 }),
  topMolecule2: varchar("top_molecule_2", { length: 255 }),
  topMolecule3: varchar("top_molecule_3", { length: 255 }),
  relativePercentages: text("relative_percentages"), // Pourcentages relatifs
  // Interprétation
  absorbeInterpretation: text("absorbe_interpretation"),
  // Statut et métadonnées
  status: mysqlEnum("status", ["brut", "a_analyser", "analyse", "traduction", "archive"]).default("brut"),
  mediaLinks: text("media_links"), // URLs séparées par des virgules ou JSON
  imageUrl: varchar("image_url", { length: 500 }), // URL de l'image principale de l'échantillon
  ethicalNotes: text("ethical_notes"), // Notes éthiques / consentement
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LeafEconomy = typeof leafEconomies.$inferSelect;
export type InsertLeafEconomy = typeof leafEconomies.$inferInsert;

// ============================================================================
// LEAF ECONOMIES RELATIONS
// ============================================================================

// Relation: Leaf Economies <-> Molecules (Many-to-Many)
export const leafEconomyMolecules = mysqlTable("leaf_economy_molecules", {
  leafEconomyId: int("leaf_economy_id").notNull().references(() => leafEconomies.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }), // Pourcentage relatif
  notes: text("notes"),
});
