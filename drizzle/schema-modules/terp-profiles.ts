import { decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";
import { and, or } from "drizzle-orm";

import { molecules } from "./molecules";
import { plants } from "./plants";
import { finalRecipes } from "./recettes";

// ============================================================================
// TERP PROFILES (Fiches interactives San Andrés)
// ============================================================================

export const terpProfiles = mysqlTable("terp_profiles", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  profileId: varchar("profile_id", { length: 20 }).notNull().unique(), // SA-TP-01, SA-TP-02, etc.
  name: varchar("name", { length: 255 }).notNull(), // "Wind Cut / Citral Structure"
  collection: varchar("collection", { length: 100 }).default("San Andrés · Leaf Economies"),
  type: varchar("type", { length: 100 }).default("Formule analytique"),
  // Axe climatique
  climaticAxis: mysqlEnum("climatic_axis", [
    "vent",
    "bois",
    "disparition",
    "vent_bois",
    "bois_disparition",
    "vent_disparition",
    "vent_bois_disparition"
  ]).notNull(),
  secondaryAxis: mysqlEnum("secondary_axis", [
    "vent",
    "bois",
    "disparition",
    "none"
  ]).default("none"),
  // Fonction et usage
  function: text("function"), // "Coupe aérienne", "Structure sèche", etc.
  usage: mysqlEnum("usage", [
    "parfum",
    "encens",
    "espace",
    "parfum_encens",
    "parfum_espace",
    "encens_espace",
    "tous"
  ]).default("parfum"),
  level: varchar("level", { length: 50 }).default("Recherche"),
  // Plantes sources (relation many-to-many via terpProfilePlants)
  plantSources: text("plant_sources"), // JSON array pour affichage rapide
  // Molécules clés (relation many-to-many via terpProfileMolecules)
  keyMolecules: text("key_molecules"), // JSON array pour affichage rapide
  // Concentré (formule)
  concentrate: json("concentrate").$type<{
    ingredient: string;
    percentage: number;
  }[]>(),
  // Lecture olfactive
  olfactiveReading: text("olfactive_reading"),
  // Temporalité
  temporality: mysqlEnum("temporality", [
    "rapide",
    "moyenne",
    "longue",
    "tres_courte",
    "variable"
  ]).default("moyenne"),
  temporalityDescription: text("temporality_description"), // "Entrée rapide. Plateau court. Sortie nette."
  // Usages recommandés
  recommendedUsage: text("recommended_usage"), // "Parfum ≤ 8 %, Espace ≤ 2 %"
  // Notes critiques
  criticalNotes: text("critical_notes"),
  // Connexions
  connections: json("connections").$type<{
    type: "compare" | "complete";
    profileId: string;
    name: string;
  }[]>(),
  // Propriétés comparatives (Point 2)
  intensity: mysqlEnum("intensity", ["faible", "moyenne", "structurelle"]).default("moyenne"),
  readability: mysqlEnum("readability", ["abstrait", "lisible", "structure"]).default("lisible"),
  nonIdentifiable: int("non_identifiable").default(0), // 0 = false, 1 = true
  // Radar climatique (0-100)
  radarVent: int("radar_vent").default(50),
  radarBois: int("radar_bois").default(50),
  radarDisparition: int("radar_disparition").default(50),
  radarStructure: int("radar_structure").default(50),
  radarDiffusion: int("radar_diffusion").default(50),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TerpProfile = typeof terpProfiles.$inferSelect;
export type InsertTerpProfile = typeof terpProfiles.$inferInsert;

// ============================================================================
// RELATIONS: TerpProfiles <-> Plants (Many-to-Many)
// ============================================================================

export const terpProfilePlants = mysqlTable("terp_profile_plants", {
  terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id),
  plantId: int("plant_id").notNull().references(() => plants.id),
  notes: text("notes"),
});

// ============================================================================
// RELATIONS: TerpProfiles <-> Molecules (Many-to-Many)
// ============================================================================

export const terpProfileMolecules = mysqlTable("terp_profile_molecules", {
  terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
});

// ============================================================================
// RELATIONS: FinalRecipes <-> TerpProfiles (Many-to-Many)
// ============================================================================

export const finalRecipeTerpProfiles = mysqlTable("final_recipe_terp_profiles", {
  finalRecipeId: int("final_recipe_id").notNull().references(() => finalRecipes.id),
  terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
});

// ============================================================================
// TERPENE COMPARISON PROFILES
// ============================================================================

/**
 * Comparative terpene profiles for tobacco, cannabis, and perfumery
 * Used for radar charts and visual comparison
 */
export const terpeneComparisonProfiles = mysqlTable("terpene_comparison_profiles", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  profileId: varchar("profile_id", { length: 50 }).notNull().unique(), // TCP-001, TCP-002, etc.
  name: varchar("name", { length: 255 }).notNull(),
  // Source
  sourceType: mysqlEnum("source_type", ["tabac", "cannabis", "parfum"]).notNull(),
  sourceId: int("source_id"), // Reference to tabac, leafEconomy, or molecule
  sourceName: varchar("source_name", { length: 255 }), // Name of the source
  // Terpene percentages (0-100 scale for radar chart)
  myrcene: int("myrcene").default(0),
  limonene: int("limonene").default(0),
  pinene: int("pinene").default(0),
  linalool: int("linalool").default(0),
  caryophyllene: int("caryophyllene").default(0),
  humulene: int("humulene").default(0),
  terpinolene: int("terpinolene").default(0),
  ocimene: int("ocimene").default(0),
  bisabolol: int("bisabolol").default(0),
  geraniol: int("geraniol").default(0),
  // Additional terpenes (JSON for flexibility)
  additionalTerpenes: json("additional_terpenes").$type<{
    name: string;
    value: number;
  }[]>(),
  // Olfactive characteristics
  dominantNote: varchar("dominant_note", { length: 100 }),
  olfactiveDescription: text("olfactive_description"),
  // Aromatic bridges (common terpenes with other sources)
  aromaticBridges: json("aromatic_bridges").$type<{
    terpene: string;
    bridgesWith: string; // "tabac", "cannabis", or "parfum"
    commonality: number; // 0-100
  }[]>(),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sourceTypeIdx: index("terpene_comparison_source_idx").on(table.sourceType),
}));

export type TerpeneComparisonProfile = typeof terpeneComparisonProfiles.$inferSelect;
export type InsertTerpeneComparisonProfile = typeof terpeneComparisonProfiles.$inferInsert;
