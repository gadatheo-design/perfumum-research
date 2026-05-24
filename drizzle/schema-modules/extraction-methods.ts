import { int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, varchar, year } from "drizzle-orm/mysql-core";

// ============================================================================
// EXTRACTION METHODS (Méthodes d'extraction)
// ============================================================================

export const extractionMethods = mysqlTable("extraction_methods", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  methodId: varchar("method_id", { length: 30 }).notNull().unique(), // EXT-001, EXT-002, etc.
  name: varchar("name", { length: 255 }).notNull(), // "Distillation à la vapeur"
  shortName: varchar("short_name", { length: 50 }), // "Steam distillation"
  // Type de méthode
  category: mysqlEnum("category", [
    "distillation",
    "expression",
    "extraction_solvant",
    "co2_supercritique",
    "enfleurage",
    "maceration",
    "hydrodistillation",
    "percolation",
    "other"
  ]).notNull(),
  // Description
  description: text("description"),
  principle: text("principle"), // Principe physico-chimique
  // Paramètres techniques
  parameters: json("parameters").$type<{
    temperature?: { min: number; max: number; unit: string };
    pressure?: { min: number; max: number; unit: string };
    duration?: { min: number; max: number; unit: string };
    solvent?: string;
    ratio?: string; // Ratio plante/solvant
  }>(),
  // Équipement
  equipment: json("equipment").$type<string[]>(),
  // Rendements typiques
  typicalYields: json("typical_yields").$type<{
    plant: string;
    yieldPercent: number;
    notes?: string;
  }[]>(),
  // Profil moléculaire
  molecularImpact: text("molecular_impact"), // Impact sur le profil moléculaire
  preservedMolecules: json("preserved_molecules").$type<string[]>(), // Molécules bien préservées
  degradedMolecules: json("degraded_molecules").$type<string[]>(), // Molécules dégradées
  // Avantages et inconvénients
  advantages: json("advantages").$type<string[]>(),
  disadvantages: json("disadvantages").$type<string[]>(),
  // Applications
  bestFor: json("best_for").$type<string[]>(), // Types de plantes/matières
  notRecommendedFor: json("not_recommended_for").$type<string[]>(),
  // Coût et complexité
  costLevel: mysqlEnum("cost_level", [
    "low",
    "medium",
    "high",
    "very_high"
  ]).default("medium"),
  complexityLevel: mysqlEnum("complexity_level", [
    "simple",
    "moderate",
    "complex",
    "expert"
  ]).default("moderate"),
  // Métadonnées
  notes: text("notes"),
  references: json("references").$type<{
    title: string;
    author?: string;
    year?: number;
    url?: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtractionMethod = typeof extractionMethods.$inferSelect;
export type InsertExtractionMethod = typeof extractionMethods.$inferInsert;

