import { boolean, decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, varchar, year } from "drizzle-orm/mysql-core";

import { extractionMethods } from "./extraction-methods";
import { molecules, synergies } from "./molecules";
import { plants, terroirs } from "./plants";
import { suppliers } from "./suppliers";

// ============================================================================
// RAW MATERIALS (Matières premières - lien entre plantes et molécules)
// ============================================================================

export const rawMaterials = mysqlTable("raw_materials", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  materialId: varchar("material_id", { length: 30 }).notNull().unique(), // RM-001, RM-002, etc.
  name: varchar("name", { length: 255 }).notNull(), // "Huile essentielle de lavande", "Absolue de rose"
  latinName: varchar("latin_name", { length: 255 }), // Nom latin de la plante source
  // Classification
  category: mysqlEnum("category", [
    "huile_essentielle",
    "absolue",
    "concrete",
    "resinoid",
    "teinture",
    "co2_extract",
    "hydrolat",
    "beurre",
    "cire",
    "oleoresine",
    "infusion",
    "maceration",
    "distillat",
    "accord_olfactif",
    "molecule_isolee",
    "matiere_animale",
    "autre"
  ]).notNull(),
  // Source botanique
  plantId: int("plant_id").references(() => plants.id), // Lien vers la plante source
  plantPart: mysqlEnum("plant_part", [
    "fleur",
    "feuille",
    "tige",
    "racine",
    "ecorce",
    "bois",
    "resine",
    "graine",
    "fruit",
    "zeste",
    "plante_entiere",
    "bourgeon",
    "autre"
  ]),
  // Origine géographique
  terroirId: int("terroir_id").references(() => terroirs.id), // Lien vers le terroir
  originCountry: varchar("origin_country", { length: 100 }),
  originRegion: varchar("origin_region", { length: 255 }),
  // Extraction
  extractionMethodId: int("extraction_method_id").references(() => extractionMethods.id),
  extractionYield: decimal("extraction_yield", { precision: 5, scale: 3 }), // Rendement en % (ex: 0.5%)
  extractionNotes: text("extraction_notes"),
  // Profil olfactif
  olfactiveFamily: mysqlEnum("olfactive_family", [
    "floral",
    "boise",
    "agrume",
    "epice",
    "herbace",
    "balsamique",
    "musque",
    "animal",
    "vert",
    "fruité",
    "marin",
    "terreux",
    "fumé",
    "gourmand",
    "aromatique",
    "autre"
  ]),
  olfactiveProfile: text("olfactive_profile"), // Description olfactive détaillée
  topNotes: text("top_notes"), // Notes de tête
  heartNotes: text("heart_notes"), // Notes de cœur
  baseNotes: text("base_notes"), // Notes de fond
  intensity: int("intensity"), // 1-10
  tenacity: int("tenacity"), // Tenue en heures
  // Propriétés chimiques
  dominantMolecules: json("dominant_molecules").$type<{
    moleculeId?: number;
    name: string;
    percentage: number;
    casNumber?: string;
  }[]>(),
  // Qualité et certification
  quality: mysqlEnum("quality", [
    "conventionnel",
    "bio",
    "sauvage",
    "biodynamique",
    "aop",
    "igp",
    "fair_trade"
  ]),
  certifications: json("certifications").$type<string[]>(),
  // Réglementation
  ifraCategory: varchar("ifra_category", { length: 50 }),
  maxUsageLevel: decimal("max_usage_level", { precision: 5, scale: 2 }), // % max autorisé
  restrictions: text("restrictions"),
  allergens: json("allergens").$type<string[]>(),
  // Commercial
  priceRange: mysqlEnum("price_range", [
    "economique",
    "standard",
    "premium",
    "luxe",
    "rare"
  ]),
  availability: mysqlEnum("availability", [
    "disponible",
    "saisonnier",
    "rare",
    "en_rupture",
    "discontinue"
  ]),
  // Fournisseurs
  suppliers: json("suppliers").$type<{
    name: string;
    country?: string;
    quality?: string;
    notes?: string;
  }[]>(),
  // Utilisation
  usageNotes: text("usage_notes"), // Notes d'utilisation en parfumerie
  blendingTips: text("blending_tips"), // Conseils d'assemblage
  synergies: json("synergies").$type<string[]>(), // Matières qui se marient bien
  // Métadonnées
  imageUrl: varchar("image_url", { length: 500 }),
  references: json("references").$type<{
    title: string;
    author?: string;
    year?: number;
    url?: string;
    type: string;
  }[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RawMaterial = typeof rawMaterials.$inferSelect;
export type InsertRawMaterial = typeof rawMaterials.$inferInsert;

// ============================================================================
// RAW MATERIAL MOLECULES (Many-to-Many: Matières premières <-> Molécules)
// ============================================================================

export const rawMaterialMolecules = mysqlTable("raw_material_molecules", {
  id: int("id").autoincrement().primaryKey(),
  rawMaterialId: int("raw_material_id").notNull().references(() => rawMaterials.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }), // % dans la matière première
  isSignature: int("is_signature").default(0), // 1 = molécule signature
  variability: varchar("variability", { length: 50 }), // "stable", "variable", "très variable"
  notes: text("notes"),
});

export type RawMaterialMolecule = typeof rawMaterialMolecules.$inferSelect;
export type InsertRawMaterialMolecule = typeof rawMaterialMolecules.$inferInsert;

// ============================================================================
// MOLECULE PLANT SOURCES (Many-to-Many enrichi: Molécules <-> Plantes avec détails)
// ============================================================================

export const moleculePlantSources = mysqlTable("molecule_plant_sources", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  plantId: int("plant_id").notNull().references(() => plants.id),
  // Détails de la source
  plantPart: varchar("plant_part", { length: 100 }), // Partie de la plante
  percentageInPlant: decimal("percentage_in_plant", { precision: 5, scale: 3 }), // % dans la plante
  percentageInOil: decimal("percentage_in_oil", { precision: 5, scale: 2 }), // % dans l'huile essentielle
  // Variabilité
  variability: mysqlEnum("variability", [
    "stable",
    "variable",
    "tres_variable",
    "chemotype_dependant"
  ]),
  // Qualité de la source
  isMainSource: int("is_main_source").default(0), // 1 = source principale
  isPrimarySource: int("is_primary_source").default(0), // 1 = source primaire (vs secondaire)
  // Extraction
  bestExtractionMethod: varchar("best_extraction_method", { length: 100 }),
  extractionYield: decimal("extraction_yield", { precision: 5, scale: 3 }),
  // Références
  references: json("references").$type<{
    title: string;
    author?: string;
    year?: number;
    doi?: string;
  }[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MoleculePlantSource = typeof moleculePlantSources.$inferSelect;
export type InsertMoleculePlantSource = typeof moleculePlantSources.$inferInsert;

// ============================================================================
// RELATIONS pour les nouvelles tables
// ============================================================================

// ============================================================================
// SUSTAINABLE ALTERNATIVES (Alternatives durables pour espèces menacées)
// ============================================================================

/**
 * Table dédiée aux alternatives durables pour les espèces menacées.
 * Permet de lier une espèce menacée à ses alternatives avec des informations
 * structurées sur la similarité olfactive, la disponibilité et les notes.
 */
export const sustainableAlternatives = mysqlTable("sustainable_alternatives", {
  id: int("id").autoincrement().primaryKey(),
  // Espèce menacée (source)
  threatenedPlantId: int("threatened_plant_id").notNull(), // Référence à plants.id
  threatenedPlantName: varchar("threatened_plant_name", { length: 255 }).notNull(), // Nom pour affichage rapide
  // Alternative durable
  alternativePlantId: int("alternative_plant_id"), // Référence à plants.id (optionnel si alternative synthétique)
  alternativeName: varchar("alternative_name", { length: 255 }).notNull(), // Nom de l'alternative
  alternativeType: mysqlEnum("alternative_type", [
    "natural_plant",      // Plante naturelle de substitution
    "cultivated",         // Variété cultivée durablement
    "synthetic",          // Molécule de synthèse
    "biotechnology",      // Produit de biotechnologie (fermentation, etc.)
    "blend",              // Mélange reconstituant le profil olfactif
    "other"
  ]).notNull(),
  // Profil olfactif comparé
  olfactiveSimilarity: mysqlEnum("olfactive_similarity", [
    "identical",          // Profil identique
    "very_similar",       // Très similaire (>90%)
    "similar",            // Similaire (70-90%)
    "partial",            // Partiel (50-70%)
    "inspired",           // Inspiré (<50%)
    "different"           // Différent mais utilisable
  ]).default("similar"),
  olfactiveNotes: text("olfactive_notes"), // Description des différences olfactives
  // Disponibilité et durabilité
  availability: mysqlEnum("availability", [
    "widely_available",   // Largement disponible
    "available",          // Disponible
    "limited",            // Disponibilité limitée
    "rare",               // Rare
    "research_only"       // Recherche uniquement
  ]).default("available"),
  sustainabilityScore: int("sustainability_score"), // Score 1-10 de durabilité
  certifications: json("certifications").$type<string[]>(), // Certifications (Fair Trade, Bio, etc.)
  // Informations complémentaires
  priceComparison: mysqlEnum("price_comparison", [
    "much_cheaper",       // Beaucoup moins cher
    "cheaper",            // Moins cher
    "similar",            // Prix similaire
    "more_expensive",     // Plus cher
    "much_more_expensive" // Beaucoup plus cher
  ]).default("similar"),
  suppliers: json("suppliers").$type<string[]>(), // Liste des fournisseurs
  usageRecommendations: text("usage_recommendations"), // Recommandations d'utilisation
  // Molécules clés
  keyMolecules: json("key_molecules").$type<{
    name: string;
    percentage?: number;
    note?: string;
  }[]>(), // Molécules clés présentes dans l'alternative
  // Références et sources
  references: json("references").$type<{
    title: string;
    author?: string;
    year?: number;
    url?: string;
    type: 'academic' | 'industry' | 'supplier' | 'other';
  }[]>(),
  // Métadonnées
  notes: text("notes"),
  verified: boolean("verified").default(false), // Vérifié par un expert
  verifiedBy: varchar("verified_by", { length: 255 }),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  threatenedPlantIdx: index("sustainable_alt_threatened_idx").on(table.threatenedPlantId),
  alternativeTypeIdx: index("sustainable_alt_type_idx").on(table.alternativeType),
  availabilityIdx: index("sustainable_alt_availability_idx").on(table.availability),
}));

export type SustainableAlternative = typeof sustainableAlternatives.$inferSelect;
export type InsertSustainableAlternative = typeof sustainableAlternatives.$inferInsert;

// Relations pour sustainable_alternatives