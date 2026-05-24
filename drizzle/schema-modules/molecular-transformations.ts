import { decimal, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { and, or} from "drizzle-orm";

import { molecules } from "./molecules";

// ============================================================================
// MOLECULAR TRANSFORMATIONS (Pyrolysis, Oxidation, etc.)
// ============================================================================

/**
 * Table for documenting molecular transformations by heat (pyrolysis),
 * oxidation, or other chemical processes. Essential for understanding
 * how terpenes and other molecules change during combustion or heating.
 */
export const molecularTransformations = mysqlTable("molecular_transformations", {
  id: int("id").autoincrement().primaryKey(),
  
  // Source molecule (before transformation)
  sourceMoleculeId: int("source_molecule_id").references(() => molecules.id),
  sourceMoleculeName: varchar("source_molecule_name", { length: 255 }).notNull(),
  
  // Product molecule (after transformation)
  productMoleculeId: int("product_molecule_id").references(() => molecules.id),
  productMoleculeName: varchar("product_molecule_name", { length: 255 }).notNull(),
  
  // Transformation details
  transformationType: mysqlEnum("transformation_type", [
    "pyrolysis",      // Heat-induced decomposition
    "oxidation",      // Oxidation reaction
    "isomerization",  // Structural rearrangement
    "dehydration",    // Loss of water
    "cyclization",    // Ring formation
    "ring_opening",   // Ring breaking
    "polymerization", // Chain formation
    "degradation",    // General breakdown
    "maillard",       // Maillard reaction
    "caramelization", // Sugar heating
    "other"
  ]).default("pyrolysis").notNull(),
  
  // Conditions
  temperatureMin: int("temperature_min"), // °C
  temperatureMax: int("temperature_max"), // °C
  temperatureOptimal: int("temperature_optimal"), // °C
  timeSeconds: int("time_seconds"), // Duration in seconds
  atmosphere: mysqlEnum("atmosphere", ["air", "nitrogen", "vacuum", "oxygen", "mixed"]).default("air"),
  
  // Yield and kinetics
  yieldPercent: decimal("yield_percent", { precision: 5, scale: 2 }), // 0-100%
  reactionOrder: varchar("reaction_order", { length: 50 }), // "first", "second", etc.
  activationEnergy: decimal("activation_energy", { precision: 10, scale: 2 }), // kJ/mol
  
  // Olfactory impact
  olfactoryChangeDescription: text("olfactory_change_description"),
  sourceOlfactoryNotes: varchar("source_olfactory_notes", { length: 500 }),
  productOlfactoryNotes: varchar("product_olfactory_notes", { length: 500 }),
  
  // Relevance to tobacco/perfumery
  relevanceContext: mysqlEnum("relevance_context", [
    "tobacco_combustion",
    "tobacco_heating",
    "incense_burning",
    "essential_oil_distillation",
    "perfume_aging",
    "food_cooking",
    "industrial_process",
    "natural_degradation",
    "other"
  ]).default("tobacco_combustion"),
  
  // Scientific reference
  sourceReference: text("source_reference"),
  doi: varchar("doi", { length: 255 }),
  
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MolecularTransformation = typeof molecularTransformations.$inferSelect;
export type InsertMolecularTransformation = typeof molecularTransformations.$inferInsert;

// Relations for molecular transformations