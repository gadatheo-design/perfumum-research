import { date, decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, time, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and, or} from "drizzle-orm";

import { accords } from "./accords";
import { users } from "./core";
import { families } from "./families";
import { molecules, synergies } from "./molecules";
import { tabacs } from "./tabacs";
import { traditionsOlfactives } from "./traditions";

// ============================================================================
// RECETTES (Recipes: 160+)
// ============================================================================

export const recettes = mysqlTable("recettes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", [
    "tabac",
    "resine",
    "resine_cbd",
    "cone",
    "parfum",
    "encens",
    "extrait"
  ]).notNull(),
  familyId: int("familyId").references(() => families.id),
  accordId: int("accordId").references(() => accords.id),
  tabacId: int("tabacId").references(() => tabacs.id),
  civilisationId: int("civilisationId").references(() => traditionsOlfactives.id),
  description: text("description"), // Short description
  ingredients: text("ingredients"), // Key ingredients list
  formula: text("formula"), // Detailed proportions
  protocol: text("protocol"), // Fabrication instructions
  notes: text("notes"), // Additional notes (profile, rarity, cost)
  texture: varchar("texture", { length: 100 }), // sec, humide, résine, etc.
  intensity: int("intensity"), // 1-10
  stability: mysqlEnum("stability", ["low", "medium", "high"]),
  combustionTemperature: int("combustionTemperature"),
  maturationTime: int("maturationTime"), // in days
  costEstimate: int("costEstimate"), // Estimated cost in cents (CHF)
  productionTime: int("productionTime"), // Production time in minutes
  status: mysqlEnum("status", ["experimental", "testing", "validated", "production"]).default("experimental"),
  // Évolution aromatique
  notesTete: text("notes_tete"), // Notes de tête (description)
  notesCoeur: text("notes_coeur"), // Notes de cœur (description)
  notesFond: text("notes_fond"), // Notes de fond (description)
  dureeTeteMin: int("duree_tete_min").default(15), // Durée notes de tête en minutes
  dureeCoeurMin: int("duree_coeur_min").default(45), // Durée notes de cœur en minutes
  dureeFondMin: int("duree_fond_min").default(120), // Durée notes de fond en minutes
  parentRecetteId: int("parent_recette_id"), // ID de la recette parente (pour les variations)
  gamme: varchar("gamme", { length: 100 }), // Gamme olfactive (Pétrichor, Volcanique, Colombie, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Recette = typeof recettes.$inferSelect;
export type InsertRecette = typeof recettes.$inferInsert;

// ============================================================================
// RECETTE_MOLECULES (Many-to-Many Junction Table)
// ============================================================================

export const recetteMolecules = mysqlTable("recette_molecules", {
  id: int("id").autoincrement().primaryKey(),
  recetteId: int("recette_id").notNull().references(() => recettes.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  proportion: int("proportion"), // Optional: percentage or concentration
  role: varchar("role", { length: 100 }), // Optional: "base", "accent", "fixative", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one molecule can appear only once per recipe
  uniqueRecetteMolecule: uniqueIndex("unique_recette_molecule").on(table.recetteId, table.moleculeId),
}));

export type RecetteMolecule = typeof recetteMolecules.$inferSelect;
export type InsertRecetteMolecule = typeof recetteMolecules.$inferInsert;

// ============================================================================
// RECETTES_FORMULES_REFERENCE (Liaison recettes vers formules de référence)
// ============================================================================

export const recettesFormulesReference = mysqlTable("recettes_formules_reference", {
  id: int("id").autoincrement().primaryKey(),
  recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" }),
  formuleReferenceName: varchar("formule_reference_name", { length: 255 }).notNull(),
  formuleReferenceFamily: varchar("formule_reference_family", { length: 100 }).notNull(),
  similarityScore: int("similarity_score").notNull(), // Score de similarité (0-100)
  notes: text("notes"), // Notes optionnelles sur la correspondance
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueRecetteFormule: uniqueIndex("unique_recette_formule").on(table.recetteId, table.formuleReferenceName),
  recetteIdx: index("idx_recette_formule").on(table.recetteId),
}));

export type RecetteFormuleReference = typeof recettesFormulesReference.$inferSelect;
export type InsertRecetteFormuleReference = typeof recettesFormulesReference.$inferInsert;

// ============================================================================
// RECIPE VERSIONING & R&D LABORATORY
// ============================================================================

// Recipe versions for R&D tracking
export const recipeVersions = mysqlTable("recipe_versions", {
  id: int("id").autoincrement().primaryKey(),
  recetteId: int("recette_id").notNull().references(() => recettes.id),
  version: varchar("version", { length: 50 }).notNull(), // v1.0, v1.1, v2.0, etc.
  changes: text("changes"), // Description of changes from previous version
  formula: text("formula"), // Snapshot of formula at this version
  protocol: text("protocol"), // Snapshot of protocol at this version
  author: varchar("author", { length: 255 }), // Who made this version
  status: mysqlEnum("status", ["draft", "testing", "validated", "production", "archived"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecipeVersion = typeof recipeVersions.$inferSelect;
export type InsertRecipeVersion = typeof recipeVersions.$inferInsert;

// Tasting notes for sensory evaluation
export const tastingNotes = mysqlTable("tasting_notes", {
  id: int("id").autoincrement().primaryKey(),
  recetteId: int("recette_id").notNull().references(() => recettes.id),
  versionId: int("version_id").references(() => recipeVersions.id),
  taster: varchar("taster", { length: 255 }), // Who tasted
  date: timestamp("date").defaultNow().notNull(),
  
  // Sensory evaluation scales (1-10)
  freshness: int("freshness"), // Fraîcheur
  depth: int("depth"), // Profondeur
  complexity: int("complexity"), // Complexité
  balance: int("balance"), // Équilibre
  persistence: int("persistence"), // Persistance
  originality: int("originality"), // Originalité
  
  // Olfactive profile notes
  topNotes: text("top_notes"), // Notes de tête
  heartNotes: text("heart_notes"), // Notes de cœur
  baseNotes: text("base_notes"), // Notes de fond
  
  // Texture and combustion (for tabacs/encens)
  texture: varchar("texture", { length: 100 }), // sec, humide, résine, etc.
  combustionQuality: int("combustion_quality"), // 1-10
  
  // General notes
  impressions: text("impressions"), // Impressions générales
  improvements: text("improvements"), // Suggestions d'amélioration
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TastingNote = typeof tastingNotes.$inferSelect;
export type InsertTastingNote = typeof tastingNotes.$inferInsert;

// ============================================================================
// RECETTES <-> TABACS ASSOCIATIONS
// ============================================================================

// Many-to-many relationship between recipes (hash/resine) and tobacco varieties
export const recetteTabacAssociations = mysqlTable("recette_tabac_associations", {
  id: int("id").autoincrement().primaryKey(),
  recetteId: int("recette_id").notNull().references(() => recettes.id),
  tabacId: int("tabac_id").notNull().references(() => tabacs.id),
  compatibility: int("compatibility").notNull(), // 1-5 stars
  proportion: varchar("proportion", { length: 50 }), // e.g., "60/40", "70/30"
  synergies: text("synergies"), // JSON: notes amplifiées, effets
  notes: text("notes"), // Observations et recommandations
  recommended: int("recommended").default(0).notNull(), // 0 = optional, 1 = recommended
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Unique constraint: one association per recette-tabac pair
  uniqueRecetteTabac: uniqueIndex("unique_recette_tabac").on(table.recetteId, table.tabacId),
}));

export type RecetteTabacAssociation = typeof recetteTabacAssociations.$inferSelect;
export type InsertRecetteTabacAssociation = typeof recetteTabacAssociations.$inferInsert;

// ============================================================================
// SAVED FORMULAS (Historique des formules générées par l'IA)
// ============================================================================

/**
 * Saved formulas generated by the AI formula generator.
 * Allows users to track their formula generation history and compare different versions.
 */
export const savedFormulas = mysqlTable("saved_formulas", {
  id: int("id").autoincrement().primaryKey(),
  
  // User who created this formula
  userId: int("user_id").notNull(),
  
  // Radar profile used to generate this formula (JSON)
  radarProfile: json("radar_profile").$type<{
    intensity: number;
    freshness: number;
    warmth: number;
    sweetness: number;
    spiciness: number;
    earthiness: number;
  }>().notNull(),
  
  // Suggested molecules (JSON array)
  suggestions: json("suggestions").$type<Array<{
    id: number;
    name: string;
    compatibilityScore: number;
    radarIntensity?: number;
    radarFreshness?: number;
    radarWarmth?: number;
    radarSweetness?: number;
    radarSpiciness?: number;
    radarEarthiness?: number;
  }>>().notNull(),
  
  // Optional user notes
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Index for fast user queries
  userIdIdx: index("saved_formulas_user_idx").on(table.userId),
}));

export type SavedFormula = typeof savedFormulas.$inferSelect;
export type InsertSavedFormula = typeof savedFormulas.$inferInsert;

// ============================================================================
// FINAL RECIPES (Recettes finales: Parfum, Encens, Espace)
// ============================================================================

export const finalRecipes = mysqlTable("final_recipes", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  recipeId: varchar("recipe_id", { length: 20 }).notNull().unique(), // PF-01, EN-01, ES-01
  name: varchar("name", { length: 255 }).notNull(), // "Salted Exposure / Leaf Edition"
  // Type de recette
  recipeType: mysqlEnum("recipe_type", [
    "parfum",
    "encens",
    "espace"
  ]).notNull(),
  // Fonction et axe
  function: text("function"), // "climat portable", "désaturation", etc.
  climaticAxis: mysqlEnum("climatic_axis", [
    "vent",
    "bois",
    "disparition",
    "vent_bois",
    "bois_disparition",
    "vent_disparition",
    "vent_bois_disparition"
  ]).notNull(),
  // Base/Support
  base: varchar("base", { length: 255 }), // "alcool neutre", "bois sec + fibres", etc.
  // Concentré (formule)
  concentrate: json("concentrate").$type<{
    ingredient: string;
    percentage: number;
  }[]>(),
  // Dilution (pour parfums)
  dilution: varchar("dilution", { length: 100 }), // "8 % dans alcool"
  restPeriod: varchar("rest_period", { length: 100 }), // "repos 7 jours max"
  // Forme (pour encens)
  form: text("form"), // "pastilles plates fines"
  combustionTime: varchar("combustion_time", { length: 100 }), // "≤ 5 min"
  // Protocole (pour espace)
  protocol: text("protocol"),
  supports: text("supports"), // "bois clair exposé, pierre / béton, textile sec"
  // Résultat attendu
  expectedResult: text("expected_result"),
  // Critère de réussite
  successCriteria: text("success_criteria"),
  // Risques
  risks: text("risks"),
  // Notes
  notes: text("notes"),
  // Usage
  usage: text("usage"), // "moments collectifs, ateliers, médiation"
  // Lien vers TerpProfiles utilisés
  terpProfileIds: json("terp_profile_ids").$type<string[]>(),
  // Métadonnées
  isRadical: int("is_radical").default(0), // 0 = standard, 1 = recette radicale (R-11 à R-18)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FinalRecipe = typeof finalRecipes.$inferSelect;
export type InsertFinalRecipe = typeof finalRecipes.$inferInsert;

// ============================================================================
// FORMULATION SUGGESTIONS
// ============================================================================

/**
 * Formulation suggestions based on documented synergies
 * Used by the formulation tool
 */
export const formulationSuggestions = mysqlTable("formulation_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  suggestionId: varchar("suggestion_id", { length: 50 }).notNull().unique(), // FS-001, FS-002, etc.
  name: varchar("name", { length: 255 }).notNull(),
  // Base molecule (starting point)
  baseMoleculeId: int("base_molecule_id").references(() => molecules.id),
  baseMoleculeName: varchar("base_molecule_name", { length: 255 }),
  // Suggested combinations
  suggestedMolecules: json("suggested_molecules").$type<{
    moleculeId: number;
    moleculeName: string;
    reason: string; // Why this combination works
    synergyType: string;
    compatibilityScore: number;
    proportion: string; // Suggested proportion
  }[]>(),
  // Synergy rules applied
  synergyRules: json("synergy_rules").$type<{
    rule: string;
    description: string;
    source: string; // Where this rule comes from
  }[]>(),
  // Expected result
  expectedOlfactiveProfile: text("expected_olfactive_profile"),
  expectedEffects: json("expected_effects").$type<{
    effect: string;
    intensity: number; // 0-100
  }[]>(),
  // Category
  formulationType: mysqlEnum("formulation_type", [
    "parfum",
    "encens",
    "tabac_blend",
    "cannabis_blend",
    "hybrid"
  ]).notNull(),
  // Difficulty and notes
  difficulty: mysqlEnum("difficulty", ["débutant", "intermédiaire", "avancé"]).default("intermédiaire"),
  technicalNotes: text("technical_notes"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  formulationTypeIdx: index("formulation_suggestions_type_idx").on(table.formulationType),
  baseMoleculeIdx: index("formulation_suggestions_base_idx").on(table.baseMoleculeId),
}));

export type FormulationSuggestion = typeof formulationSuggestions.$inferSelect;
export type InsertFormulationSuggestion = typeof formulationSuggestions.$inferInsert;

// Relations for formulation_suggestions
// ============================================================================
// ENTOURAGE EFFECT RULES
// ============================================================================

/**
 * Rules for entourage effect and molecular synergies
 * Used to generate formulation suggestions
 */
export const entourageRules = mysqlTable("entourage_rules", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  ruleId: varchar("rule_id", { length: 50 }).notNull().unique(), // ER-001, ER-002, etc.
  name: varchar("name", { length: 255 }).notNull(),
  // Rule type
  ruleType: mysqlEnum("rule_type", [
    "entourage", // Cannabis entourage effect
    "potentiation", // Mutual potentiation
    "modulation", // Olfactive modulation
    "stabilization", // Stabilization
    "enhancement", // Enhancement
    "contrast" // Contrast/opposition
  ]).notNull(),
  // Molecules involved
  primaryMolecules: json("primary_molecules").$type<{
    name: string;
    role: string;
  }[]>(),
  secondaryMolecules: json("secondary_molecules").$type<{
    name: string;
    role: string;
  }[]>(),
  // Rule description
  description: text("description").notNull(),
  mechanism: text("mechanism"), // How it works
  olfactiveResult: text("olfactive_result"), // What you get
  // Applicability
  applicableTo: json("applicable_to").$type<string[]>(), // ["tabac", "cannabis", "parfum"]
  // Scientific basis
  scientificBasis: text("scientific_basis"),
  references: json("references").$type<{
    author?: string;
    year?: number;
    title: string;
    journal?: string;
    doi?: string;
    url?: string;
  }[]>(),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ruleTypeIdx: index("entourage_rules_type_idx").on(table.ruleType),
}));

export type EntourageRule = typeof entourageRules.$inferSelect;
export type InsertEntourageRule = typeof entourageRules.$inferInsert;

// ============================================================================
// RECETTE RAW MATERIALS — Liaison directe entre recettes et matières premières
// ============================================================================
export const recetteRawMaterials = mysqlTable("recette_raw_materials", {
  id: int("id").autoincrement().primaryKey(),
  recetteId: int("recette_id").notNull(),
  rawMaterialId: int("raw_material_id").notNull(),
  // Rôle de la matière dans la recette
  role: mysqlEnum("role", ["base", "coeur", "tete", "fixateur", "modificateur", "autre"]).default("autre"),
  // Quantité / dosage
  dosage: decimal("dosage", { precision: 8, scale: 3 }),
  dosageUnit: varchar("dosage_unit", { length: 20 }).default("g"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  // Notes spécifiques à cette utilisation
  notes: text("notes"),
  // Ordre d'ajout dans la recette
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  recetteIdx: index("rrm_recette_idx").on(table.recetteId),
  rawMaterialIdx: index("rrm_raw_material_idx").on(table.rawMaterialId),
  uniqueLink: uniqueIndex("rrm_unique_link").on(table.recetteId, table.rawMaterialId),
}));
export type RecetteRawMaterial = typeof recetteRawMaterials.$inferSelect;
export type InsertRecetteRawMaterial = typeof recetteRawMaterials.$inferInsert;
