import { decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { molecules, synergies } from "./molecules";

// ============================================================================
// TOBACCO-CANNABIS-PERFUME INTERACTIONS
// ============================================================================

/**
 * Molecular interactions between tobacco, cannabis, and perfumery molecules
 * Tracks synergies, entourage effects, and aromatic bridges
 */
export const molecularInteractions = mysqlTable("molecular_interactions", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  interactionId: varchar("interaction_id", { length: 50 }).notNull().unique(), // INT-001, INT-002, etc.
  name: varchar("name", { length: 255 }).notNull(), // Nom de l'interaction
  // Source categories
  sourceCategory: mysqlEnum("source_category", [
    "tabac_cannabis",
    "tabac_parfum",
    "cannabis_parfum",
    "tabac_cannabis_parfum"
  ]).notNull(),
  // Molecules involved
  molecule1Id: int("molecule1_id").references(() => molecules.id),
  molecule2Id: int("molecule2_id").references(() => molecules.id),
  molecule3Id: int("molecule3_id").references(() => molecules.id), // Optional third molecule
  // Terpene profile (JSON array of terpene names and percentages)
  terpeneProfile: json("terpene_profile").$type<{
    name: string;
    percentage: number;
    source: "tabac" | "cannabis" | "parfum";
    function?: string;
  }[]>(),
  // Synergy type
  synergyType: mysqlEnum("synergy_type", [
    "entourage", // Effet entourage (cannabis)
    "potentiation", // Potentialisation mutuelle
    "bridge", // Pont aromatique
    "stabilization", // Stabilisation
    "transformation", // Transformation olfactive
    "masking" // Masquage
  ]).notNull(),
  // Compatibility score (0-100)
  compatibilityScore: int("compatibility_score").notNull().default(50),
  // Description
  description: text("description"), // Description détaillée de l'interaction
  olfactiveResult: text("olfactive_result"), // Résultat olfactif
  applications: text("applications"), // Applications pratiques
  // Scientific notes
  scientificBasis: text("scientific_basis"), // Base scientifique
  references: json("references").$type<{
    author?: string;
    year?: number;
    title: string;
    journal?: string;
    doi?: string;
    url?: string;
    type: 'academic' | 'book' | 'database' | 'experimental' | 'other';
  }[]>(),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sourceCategoryIdx: index("molecular_interactions_source_idx").on(table.sourceCategory),
  synergyTypeIdx: index("molecular_interactions_synergy_idx").on(table.synergyType),
}));

export type MolecularInteraction = typeof molecularInteractions.$inferSelect;
export type InsertMolecularInteraction = typeof molecularInteractions.$inferInsert;

// Relations for molecular_interactions
// ============================================================================
// TOBACCO-CANNABIS TRADITIONS SCHEMA (NEW)
// ============================================================================
// Comprehensive database for tobacco, cannabis, and their combinations

// 1. TOBACCO VARIETIES (Tabacothèque)
export const tobaccoVarieties = mysqlTable("tobacco_varieties", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latinName: varchar("latin_name", { length: 255 }),
  category: mysqlEnum("category", [
    "landrace",
    "cultivar",
    "hybrid",
    "wild",
    "historical",
    "extinct"
  ]).default("cultivar").notNull(),
  origin: varchar("origin", { length: 255 }),
  region: varchar("region", { length: 255 }),
  olfactiveFamily: varchar("olfactive_family", { length: 100 }),
  aromaProfile: text("aroma_profile"),
  chemicalProfile: json("chemical_profile"),
  uses: text("uses"),
  flavor: varchar("flavor", { length: 100 }),
  strength: mysqlEnum("strength", ["mild", "medium", "strong", "very_strong"]),
  moistureContent: decimal("moisture_content"),
  fermentationTime: varchar("fermentation_time", { length: 100 }),
  cureMethod: varchar("cure_method", { length: 100 }),
  historicalSignificance: text("historical_significance"),
  modernAvailability: varchar("modern_availability", { length: 100 }),
  substitutes: text("substitutes"),
  imageUrl: varchar("image_url", { length: 500 }),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tobacco_varieties_name_idx").on(table.name),
  originIdx: index("tobacco_varieties_origin_idx").on(table.origin),
  categoryIdx: index("tobacco_varieties_category_idx").on(table.category),
}));

export type TobaccoVariety = typeof tobaccoVarieties.$inferSelect;
export type InsertTobaccoVariety = typeof tobaccoVarieties.$inferInsert;

// 2. TERROIRS (Pédologie & Géographie)
export const tobaccoTerroirs = mysqlTable("tobacco_terroirs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  coordinates: json("coordinates"),
  soilType: varchar("soil_type", { length: 100 }),
  soilComposition: json("soil_composition"),
  climate: varchar("climate", { length: 100 }),
  climateData: json("climate_data"),
  elevation: int("elevation"),
  rainfall: int("rainfall"),
  sunExposure: varchar("sun_exposure", { length: 100 }),
  waterAvailability: varchar("water_availability", { length: 100 }),
  microorganisms: text("microorganisms"),
  mineralContent: json("mineral_content"),
  chemicalImpact: text("chemical_impact"),
  historicalUse: text("historical_use"),
  tobaccoVarietiesGrown: text("tobacco_varieties_grown"),
  comparisons: text("comparisons"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  regionIdx: index("tobacco_terroirs_region_idx").on(table.region),
  countryIdx: index("tobacco_terroirs_country_idx").on(table.country),
}));

export type TobaccoTerroir = typeof tobaccoTerroirs.$inferSelect;
export type InsertTobaccoTerroir = typeof tobaccoTerroirs.$inferInsert;

// 3. TOBACCO ADDITIVES
export const tobaccoAdditives = mysqlTable("tobacco_additives", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "alkalinizing",
    "flavoring",
    "humectant",
    "preservative",
    "coloring",
    "other"
  ]).notNull(),
  chemicalFormula: varchar("chemical_formula", { length: 50 }),
  source: varchar("source", { length: 100 }),
  historicalUse: text("historical_use"),
  alkalinizingPower: decimal("alkalinizing_power"),
  effectivenessData: json("effectiveness_data"),
  applicationMethods: text("application_methods"),
  dosage: text("dosage"),
  safetyProfile: text("safety_profile"),
  modernRegulation: varchar("modern_regulation", { length: 255 }),
  tobaccoVarietiesUsedWith: text("tobacco_varieties_used_with"),
  comparisons: text("comparisons"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tobacco_additives_name_idx").on(table.name),
  typeIdx: index("tobacco_additives_type_idx").on(table.type),
}));

export type TobaccoAdditive = typeof tobaccoAdditives.$inferSelect;
export type InsertTobaccoAdditive = typeof tobaccoAdditives.$inferInsert;

// 4. PYRAZINES
export const pyrazines = mysqlTable("pyrazines", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  chemicalFormula: varchar("chemical_formula", { length: 50 }).notNull(),
  molecularWeight: decimal("molecular_weight"),
  structure: text("structure"),
  odorProfile: text("odor_profile"),
  odorThreshold: decimal("odor_threshold"),
  volatility: varchar("volatility", { length: 100 }),
  boilingPoint: decimal("boiling_point"),
  meltingPoint: decimal("melting_point"),
  stability: text("stability"),
  tobaccoContribution: text("tobacco_contribution"),
  volcanicProfile: text("volcanic_profile"),
  tobaccoVarietiesContaining: text("tobacco_varieties_containing"),
  perfumeryPotential: text("perfumery_potential"),
  pyrolysisTransformations: text("pyrolysis_transformations"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("pyrazines_name_idx").on(table.name),
  formulaIdx: index("pyrazines_formula_idx").on(table.chemicalFormula),
}));

export type Pyrazine = typeof pyrazines.$inferSelect;
export type InsertPyrazine = typeof pyrazines.$inferInsert;

// 5. AROMATIC MOLECULES
export const aromaticMoleculesTabac = mysqlTable("aromatic_molecules_tabac", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  commonNames: text("common_names"),
  chemicalFormula: varchar("chemical_formula", { length: 50 }).notNull(),
  molecularWeight: decimal("molecular_weight"),
  structure: text("structure"),
  iupacName: varchar("iupac_name", { length: 255 }),
  odorDescriptors: text("odor_descriptors"),
  odorThreshold: decimal("odor_threshold"),
  volatility: varchar("volatility", { length: 100 }),
  boilingPoint: decimal("boiling_point"),
  meltingPoint: decimal("melting_point"),
  logP: decimal("log_p"),
  stability: json("stability"),
  therapeuticProperties: text("therapeutic_properties"),
  tobaccoContribution: text("tobacco_contribution"),
  cannabisContribution: text("cannabis_contribution"),
  perfumeryUse: text("perfumery_use"),
  pyrolysisProducts: text("pyrolysis_products"),
  tobaccoVarietiesContaining: text("tobacco_varieties_containing"),
  cannabisStrainsSources: text("cannabis_strains_sources"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("aromatic_molecules_tabac_name_idx").on(table.name),
  formulaIdx: index("aromatic_molecules_tabac_formula_idx").on(table.chemicalFormula),
}));

export type AromaticMoleculeTabac = typeof aromaticMoleculesTabac.$inferSelect;
export type InsertAromaticMoleculeTabac = typeof aromaticMoleculesTabac.$inferInsert;

// 6. LANDRACES
export const landraces = mysqlTable("landraces", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  originCountry: varchar("origin_country", { length: 100 }).notNull(),
  originRegion: varchar("origin_region", { length: 255 }),
  nativeTerroir: int("native_terroir"),
  historicalPeriod: varchar("historical_period", { length: 100 }),
  culturalSignificance: text("cultural_significance"),
  geneticDiversity: text("genetic_diversity"),
  molecularProfile: json("molecular_profile"),
  aromaCharacteristics: text("aroma_characteristics"),
  flavorProfile: text("flavor_profile"),
  growthCharacteristics: text("growth_characteristics"),
  yieldData: json("yield_data"),
  diseaseResistance: text("disease_resistance"),
  climateAdaptation: text("climate_adaptation"),
  modernAvailability: varchar("modern_availability", { length: 100 }),
  seedBanks: text("seed_banks"),
  modernSubstitutes: text("modern_substitutes"),
  conservationStatus: varchar("conservation_status", { length: 100 }),
  studiesAndResearch: text("studies_and_research"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("landraces_name_idx").on(table.name),
  countryIdx: index("landraces_country_idx").on(table.originCountry),
}));

export type Landrace = typeof landraces.$inferSelect;
export type InsertLandrace = typeof landraces.$inferInsert;

// 7. TOBACCO-CANNABIS TRADITIONS & ACCORDS
export const tobaccoCannabisAccords = mysqlTable("tobacco_cannabis_accords", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "tobacco_only",
    "cannabis_only",
    "tobacco_cannabis_blend",
    "tobacco_cannabis_layered",
    "tobacco_cannabis_sequential"
  ]).notNull(),
  region: varchar("region", { length: 255 }),
  culturalContext: varchar("cultural_context", { length: 100 }),
  description: text("description"),
  components: json("components"),
  preparationProtocol: text("preparation_protocol"),
  consumptionMethod: varchar("consumption_method", { length: 100 }),
  aromaProfile: text("aroma_profile"),
  effectProfile: text("effect_profile"),
  historicalDocumentation: text("historical_documentation"),
  modernPractices: text("modern_practices"),
  chemicalInteractions: text("chemical_interactions"),
  therapeuticClaims: text("therapeutic_claims"),
  legalStatus: varchar("legal_status", { length: 100 }),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tobacco_cannabis_accords_name_idx").on(table.name),
  regionIdx: index("tobacco_cannabis_accords_region_idx").on(table.region),
  typeIdx: index("tobacco_cannabis_accords_type_idx").on(table.type),
}));

export type TobaccoCannabisAccord = typeof tobaccoCannabisAccords.$inferSelect;
export type InsertTobaccoCannabisAccord = typeof tobaccoCannabisAccords.$inferInsert;

// 8. CANNABIS STRAINS
export const cannabisStrains = mysqlTable("cannabis_strains", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  geneticLineage: text("genetic_lineage"),
  cannabinoidProfile: json("cannabinoid_profile"),
  terpenProfile: json("terpene_profile"),
  odorProfile: text("odor_profile"),
  effectProfile: text("effect_profile"),
  growthCharacteristics: text("growth_characteristics"),
  harvestTime: varchar("harvest_time", { length: 100 }),
  yieldData: json("yield_data"),
  medicinalPotential: text("medicinal_potential"),
  culturalSignificance: text("cultural_significance"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("cannabis_strains_name_idx").on(table.name),
}));

export type CannabiStrain = typeof cannabisStrains.$inferSelect;
export type InsertCannabiStrain = typeof cannabisStrains.$inferInsert;

// 9. RESEARCH CLAIMS
export const researchClaims = mysqlTable("research_claims", {
  id: int("id").autoincrement().primaryKey(),
  claimId: varchar("claim_id", { length: 50 }).notNull().unique(),
  claim: text("claim").notNull(),
  region: varchar("region", { length: 255 }),
  claimType: mysqlEnum("claim_type", [
    "ethnobotanical",
    "scientific",
    "historical",
    "traditional",
    "chemical",
    "therapeutic"
  ]).notNull(),
  sourceId: int("source_id"),
  status: mysqlEnum("status", [
    "validated",
    "pending",
    "in_progress",
    "to_source",
    "disputed"
  ]).default("pending").notNull(),
  evidence: text("evidence"),
  citation: text("citation"),
  notes: text("notes"),
  relatedEntities: text("related_entities"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  claimIdIdx: index("research_claims_claim_id_idx").on(table.claimId),
  statusIdx: index("research_claims_status_idx").on(table.status),
}));

export type ResearchClaim = typeof researchClaims.$inferSelect;
export type InsertResearchClaim = typeof researchClaims.$inferInsert;

// 10. RESEARCH SOURCES
export const researchSources = mysqlTable("research_sources", {
  id: int("id").autoincrement().primaryKey(),
  sourceId: varchar("source_id", { length: 50 }).notNull().unique(),
  reference: text("reference").notNull(),
  url: varchar("url", { length: 500 }),
  quality: mysqlEnum("quality", [
    "high",
    "medium",
    "low"
  ]).default("medium").notNull(),
  scope: mysqlEnum("scope", [
    "international",
    "scientific",
    "professional",
    "academic",
    "traditional",
    "other"
  ]).default("other").notNull(),
  status: mysqlEnum("status", [
    "validated",
    "pending",
    "disputed"
  ]).default("pending").notNull(),
  keyExcerpts: text("key_excerpts"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sourceIdIdx: index("research_sources_source_id_idx").on(table.sourceId),
}));

export type ResearchSource = typeof researchSources.$inferSelect;
export type InsertResearchSource = typeof researchSources.$inferInsert;

// 11. PYROLYSIS TRANSFORMATIONS
export const pyrolysisTransformations = mysqlTable("pyrolysis_transformations", {
  id: int("id").autoincrement().primaryKey(),
  originalMoleculeId: int("original_molecule_id").notNull(),
  productMoleculeId: int("product_molecule_id").notNull(),
  temperature: int("temperature"),
  duration: int("duration"),
  oxygen: varchar("oxygen", { length: 50 }),
  yieldPercentage: decimal("yield_percentage"),
  conditions: text("conditions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  moleculeIdx: index("pyrolysis_transformations_molecule_idx").on(table.originalMoleculeId),
}));

export type PyrolysisTransformation = typeof pyrolysisTransformations.$inferSelect;
export type InsertPyrolysisTransformation = typeof pyrolysisTransformations.$inferInsert;

// 12. COMPARATIVE ANALYSES
export const comparativeAnalyses = mysqlTable("comparative_analyses", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "terroir_comparison",
    "variety_comparison",
    "molecular_comparison",
    "tradition_comparison",
    "other"
  ]).notNull(),
  entities: text("entities"),
  analysisData: json("analysis_data"),
  visualizationUrl: varchar("visualization_url", { length: 500 }),
  conclusions: text("conclusions"),
  sourceReferences: text("source_references"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("comparative_analyses_type_idx").on(table.type),
}));

export type ComparativeAnalysis = typeof comparativeAnalyses.$inferSelect;
export type InsertComparativeAnalysis = typeof comparativeAnalyses.$inferInsert;

// ============================================================================
// CIGARILLO MOLECULE LINKS — Liaisons entre recettes cigarillos et molécules
// ============================================================================
export const cigarilloMoleculeLinks = mysqlTable("cigarillo_molecule_links", {
  id: int("id").autoincrement().primaryKey(),
  cigarilloRecipeId: int("cigarillo_recipe_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  role: varchar("role", { length: 100 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  cigarilloIdx: index("cml_cigarillo_idx").on(table.cigarilloRecipeId),
  moleculeIdx: index("cml_molecule_idx").on(table.moleculeId),
  uniqueLink: uniqueIndex("cml_unique_link").on(table.cigarilloRecipeId, table.moleculeId),
}));
export type CigarilloMoleculeLink = typeof cigarilloMoleculeLinks.$inferSelect;
export type InsertCigarilloMoleculeLink = typeof cigarilloMoleculeLinks.$inferInsert;
