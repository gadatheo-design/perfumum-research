import { index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";
import { and } from "drizzle-orm";

import { families } from "./families";

// ============================================================================
// ACCORDS (Olfactive accords: 120+)
// ============================================================================

export const accords = mysqlTable("accords", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  familyId: int("familyId").references(() => families.id),
  olfactiveProfile: text("olfactiveProfile"),
  emotionalResonance: text("emotionalResonance"),
  texture: mysqlEnum("texture", ["sec", "humide", "lactone", "resine", "pierre", "air"]),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Accord = typeof accords.$inferSelect;
export type InsertAccord = typeof accords.$inferInsert;

// ============================================================================
// AROMATIC ACCORDS (Fumoir Oriental, Hash Marocain, Cannabis Vert)
// ============================================================================

/**
 * Proposed aromatic accords combining tobacco, cannabis, and perfumery notes
 */
export const aromaticAccords = mysqlTable("aromatic_accords", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  accordId: varchar("accord_id", { length: 50 }).notNull().unique(), // ACC-001, ACC-002, etc.
  name: varchar("name", { length: 255 }).notNull(), // Ex: "Fumoir Oriental"
  // Classification
  category: mysqlEnum("category", [
    "fumoir", // Accords fumés/tabac
    "hash", // Accords résine/hash
    "herbal", // Accords herbacés/cannabis vert
    "hybrid" // Accords hybrides
  ]).notNull(),
  // Olfactive pyramid
  topNotes: json("top_notes").$type<{
    molecule: string;
    percentage: number;
    source: "tabac" | "cannabis" | "parfum";
  }[]>(),
  heartNotes: json("heart_notes").$type<{
    molecule: string;
    percentage: number;
    source: "tabac" | "cannabis" | "parfum";
  }[]>(),
  baseNotes: json("base_notes").$type<{
    molecule: string;
    percentage: number;
    source: "tabac" | "cannabis" | "parfum";
  }[]>(),
  // Full formula
  formula: text("formula"), // Formule complète en texte
  formulaJson: json("formula_json").$type<{
    ingredient: string;
    percentage: number;
    source: "tabac" | "cannabis" | "parfum";
    role: "top" | "heart" | "base" | "modifier";
  }[]>(),
  // Terpene profile for comparison
  terpeneProfile: json("terpene_profile").$type<{
    terpene: string;
    percentage: number;
    contribution: string; // What it brings to the accord
  }[]>(),
  // Description
  description: text("description"), // Description olfactive
  inspiration: text("inspiration"), // Source d'inspiration
  targetEffect: text("target_effect"), // Effet recherché
  // Technical notes
  diffusion: mysqlEnum("diffusion", ["faible", "moyenne", "forte"]).default("moyenne"),
  tenacity: mysqlEnum("tenacity", ["fugace", "modérée", "tenace"]).default("modérée"),
  sillage: mysqlEnum("sillage", ["intime", "modéré", "puissant"]).default("modéré"),
  // Synergies
  keyInteractions: json("key_interactions").$type<{
    interaction: string;
    type: string;
    effect: string;
  }[]>(),
  // Usage recommendations
  usageRecommendations: text("usage_recommendations"),
  dilutionRecommendation: varchar("dilution_recommendation", { length: 100 }),
  // Metadata
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("aromatic_accords_category_idx").on(table.category),
}));

export type AromaticAccord = typeof aromaticAccords.$inferSelect;
export type InsertAromaticAccord = typeof aromaticAccords.$inferInsert;
