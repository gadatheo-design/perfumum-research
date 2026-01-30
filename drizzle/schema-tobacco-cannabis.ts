import { mysqlTable, varchar, text, int, timestamp, json, float, uniqueIndex, index, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * TOBACCO-CANNABIS TRADITIONS SCHEMA
 * 
 * Comprehensive database for tobacco, cannabis, and their combinations
 * Including: Tobacco varieties, terroirs, additives, pyrazines, molecules,
 * landraces, traditions, accords, and all related research data
 */

// ============================================================================
// 1. TOBACCO VARIETIES (Tabacothèque)
// ============================================================================

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
  aromaProfile: text("aroma_profile"), // JSON: {notes: [], intensity: 1-10, descriptors: []}
  chemicalProfile: json("chemical_profile"), // {pyrazines: {}, terpenes: {}, alkaloids: {}}
  uses: text("uses"), // JSON: [pipe, cigar, cigarette, hookah, chewing, snuff]
  flavor: varchar("flavor", { length: 100 }),
  strength: mysqlEnum("strength", ["mild", "medium", "strong", "very_strong"]),
  moistureContent: float("moisture_content"),
  fermentationTime: varchar("fermentation_time", { length: 100 }),
  cureMethod: varchar("cure_method", { length: 100 }), // air-cured, fire-cured, sun-cured, etc.
  historicalSignificance: text("historical_significance"),
  modernAvailability: varchar("modern_availability", { length: 100 }),
  substitutes: text("substitutes"), // JSON: [variety_ids]
  imageUrl: varchar("image_url", { length: 500 }),
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tobacco_varieties_name_idx").on(table.name),
  originIdx: index("tobacco_varieties_origin_idx").on(table.origin),
  categoryIdx: index("tobacco_varieties_category_idx").on(table.category),
}));

export type TobaccoVariety = typeof tobaccoVarieties.$inferSelect;
export type InsertTobaccoVariety = typeof tobaccoVarieties.$inferInsert;

// ============================================================================
// 2. TERROIRS (Pédologie & Géographie)
// ============================================================================

export const terroirs = mysqlTable("terroirs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  coordinates: json("coordinates"), // {latitude, longitude}
  soilType: varchar("soil_type", { length: 100 }),
  soilComposition: json("soil_composition"), // {clay: %, sand: %, silt: %, pH: }
  climate: varchar("climate", { length: 100 }),
  climateData: json("climate_data"), // {temperature: [], rainfall: [], humidity: []}
  elevation: int("elevation"),
  rainfall: int("rainfall"),
  sunExposure: varchar("sun_exposure", { length: 100 }),
  waterAvailability: varchar("water_availability", { length: 100 }),
  microorganisms: text("microorganisms"), // JSON: [microbe_names]
  mineralContent: json("mineral_content"), // {potassium: %, nitrogen: %, phosphorus: %}
  chemicalImpact: text("chemical_impact"), // How terroir affects tobacco chemistry
  historicalUse: text("historical_use"),
  tobaccoVarietiesGrown: text("tobacco_varieties_grown"), // JSON: [variety_ids]
  comparisons: text("comparisons"), // JSON: [comparison_ids]
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  regionIdx: index("terroirs_region_idx").on(table.region),
  countryIdx: index("terroirs_country_idx").on(table.country),
}));

export type Terroir = typeof terroirs.$inferSelect;
export type InsertTerroir = typeof terroirs.$inferInsert;

// ============================================================================
// 3. TOBACCO ADDITIVES (Alcalinisants & Composants)
// ============================================================================

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
  alkalinizingPower: float("alkalinizing_power"), // pH adjustment capability
  effectivenessData: json("effectiveness_data"), // {combustion_temp: [], flavor_impact: []}
  applicationMethods: text("application_methods"), // JSON: [method_names]
  dosage: text("dosage"), // Recommended dosage
  safetyProfile: text("safety_profile"),
  modernRegulation: varchar("modern_regulation", { length: 255 }),
  tobaccoVarietiesUsedWith: text("tobacco_varieties_used_with"), // JSON: [variety_ids]
  comparisons: text("comparisons"), // JSON: [comparison_ids]
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tobacco_additives_name_idx").on(table.name),
  typeIdx: index("tobacco_additives_type_idx").on(table.type),
}));

export type TobaccoAdditive = typeof tobaccoAdditives.$inferSelect;
export type InsertTobaccoAdditive = typeof tobaccoAdditives.$inferInsert;

// ============================================================================
// 4. PYRAZINES (Molécules Aromatiques Clés)
// ============================================================================

export const pyrazines = mysqlTable("pyrazines", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  chemicalFormula: varchar("chemical_formula", { length: 50 }).notNull(),
  molecularWeight: float("molecular_weight"),
  structure: text("structure"), // SMILES or molecular structure
  odorProfile: text("odor_profile"), // Descriptors: earthy, nutty, roasted, etc.
  odorThreshold: float("odor_threshold"), // Concentration threshold for perception
  volatility: varchar("volatility", { length: 100 }),
  boilingPoint: float("boiling_point"),
  meltingPoint: float("melting_point"),
  stability: text("stability"), // Heat stability, light stability
  tobaccoContribution: text("tobacco_contribution"), // How it contributes to tobacco aroma
  volcanicProfile: text("volcanic_profile"), // Specific to volcanic terroirs
  tobaccoVarietiesContaining: text("tobacco_varieties_containing"), // JSON: [variety_ids]
  perfumeryPotential: text("perfumery_potential"),
  pyrolysisTransformations: text("pyrolysis_transformations"), // JSON: [transformation_data]
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("pyrazines_name_idx").on(table.name),
  formulaIdx: index("pyrazines_formula_idx").on(table.chemicalFormula),
}));

export type Pyrazine = typeof pyrazines.$inferSelect;
export type InsertPyrazine = typeof pyrazines.$inferInsert;

// ============================================================================
// 5. AROMATIC MOLECULES (Comprehensive Chemical Data)
// ============================================================================

export const aromaticMolecules = mysqlTable("aromatic_molecules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  commonNames: text("common_names"), // JSON: [name1, name2]
  chemicalFormula: varchar("chemical_formula", { length: 50 }).notNull(),
  molecularWeight: float("molecular_weight"),
  structure: text("structure"), // SMILES notation
  iupacName: varchar("iupac_name", { length: 255 }),
  odorDescriptors: text("odor_descriptors"), // JSON: [descriptor1, descriptor2]
  odorThreshold: float("odor_threshold"),
  volatility: varchar("volatility", { length: 100 }),
  boilingPoint: float("boiling_point"),
  meltingPoint: float("melting_point"),
  logP: float("log_p"), // Lipophilicity
  stability: json("stability"), // {heat: %, light: %, oxidation: %}
  therapeuticProperties: text("therapeutic_properties"), // JSON: [property1, property2]
  tobaccoContribution: text("tobacco_contribution"),
  cannabisContribution: text("cannabis_contribution"),
  perfumeryUse: text("perfumery_use"),
  pyrolysisProducts: text("pyrolysis_products"), // JSON: [product_ids]
  tobaccoVarietiesContaining: text("tobacco_varieties_containing"), // JSON: [variety_ids]
  cannabisStrainsSources: text("cannabis_strains_sources"), // JSON: [strain_ids]
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("aromatic_molecules_name_idx").on(table.name),
  formulaIdx: index("aromatic_molecules_formula_idx").on(table.chemicalFormula),
}));

export type AromaticMolecule = typeof aromaticMolecules.$inferSelect;
export type InsertAromaticMolecule = typeof aromaticMolecules.$inferInsert;

// ============================================================================
// 6. LANDRACES (Variétés Patrimoniales)
// ============================================================================

export const landraces = mysqlTable("landraces", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  originCountry: varchar("origin_country", { length: 100 }).notNull(),
  originRegion: varchar("origin_region", { length: 255 }),
  nativeTerroir: int("native_terroir"), // Foreign key to terroirs
  historicalPeriod: varchar("historical_period", { length: 100 }),
  culturalSignificance: text("cultural_significance"),
  geneticDiversity: text("genetic_diversity"),
  molecularProfile: json("molecular_profile"), // Complete chemical analysis
  aromaCharacteristics: text("aroma_characteristics"),
  flavorProfile: text("flavor_profile"),
  growthCharacteristics: text("growth_characteristics"),
  yieldData: json("yield_data"), // {per_plant: kg, per_hectare: kg}
  diseaseResistance: text("disease_resistance"), // JSON: [disease_names]
  climateAdaptation: text("climate_adaptation"),
  modernAvailability: varchar("modern_availability", { length: 100 }),
  seedBanks: text("seed_banks"), // JSON: [bank_names]
  modernSubstitutes: text("modern_substitutes"), // JSON: [variety_ids]
  conservationStatus: varchar("conservation_status", { length: 100 }),
  studiesAndResearch: text("studies_and_research"), // JSON: [study_ids]
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("landraces_name_idx").on(table.name),
  countryIdx: index("landraces_country_idx").on(table.originCountry),
}));

export type Landrace = typeof landraces.$inferSelect;
export type InsertLandrace = typeof landraces.$inferInsert;

// ============================================================================
// 7. TOBACCO-CANNABIS TRADITIONS & ACCORDS
// ============================================================================

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
  components: json("components"), // {tobacco: {variety_id, amount}, cannabis: {strain_id, amount}, additives: []}
  preparationProtocol: text("preparation_protocol"), // Step-by-step instructions
  consumptionMethod: varchar("consumption_method", { length: 100 }), // pipe, joint, hookah, etc.
  aromaProfil: text("aroma_profile"),
  effectProfile: text("effect_profile"),
  historicalDocumentation: text("historical_documentation"),
  modernPractices: text("modern_practices"),
  chemicalInteractions: text("chemical_interactions"), // JSON: [interaction_data]
  therapeuticClaims: text("therapeutic_claims"),
  legalStatus: varchar("legal_status", { length: 100 }),
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("tobacco_cannabis_accords_name_idx").on(table.name),
  regionIdx: index("tobacco_cannabis_accords_region_idx").on(table.region),
  typeIdx: index("tobacco_cannabis_accords_type_idx").on(table.type),
}));

export type TobaccoCannabisAccord = typeof tobaccoCannabisAccords.$inferSelect;
export type InsertTobaccoCannabisAccord = typeof tobaccoCannabisAccords.$inferInsert;

// ============================================================================
// 8. CANNABIS STRAINS (for Traditions)
// ============================================================================

export const cannabisStrains = mysqlTable("cannabis_strains", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  geneticLineage: text("genetic_lineage"), // Parent strains
  cannabinoidProfile: json("cannabinoid_profile"), // {THC: %, CBD: %, CBN: %}
  terpenProfile: json("terpene_profile"), // {myrcene: %, limonene: %, etc}
  odorProfile: text("odor_profile"),
  effectProfile: text("effect_profile"),
  growthCharacteristics: text("growth_characteristics"),
  harvestTime: varchar("harvest_time", { length: 100 }),
  yieldData: json("yield_data"),
  medicinalpotential: text("medicinal_potential"),
  culturalSignificance: text("cultural_significance"),
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("cannabis_strains_name_idx").on(table.name),
}));

export type CannabiStrain = typeof cannabisStrains.$inferSelect;
export type InsertCannabiStrain = typeof cannabisStrains.$inferInsert;

// ============================================================================
// 9. RESEARCH CLAIMS & SOURCES
// ============================================================================

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
  relatedEntities: text("related_entities"), // JSON: {varieties: [], molecules: [], traditions: []}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  claimIdIdx: index("research_claims_claim_id_idx").on(table.claimId),
  statusIdx: index("research_claims_status_idx").on(table.status),
}));

export type ResearchClaim = typeof researchClaims.$inferSelect;
export type InsertResearchClaim = typeof researchClaims.$inferInsert;

// ============================================================================
// 10. RESEARCH SOURCES
// ============================================================================

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

// ============================================================================
// 11. PYROLYSIS TRANSFORMATIONS
// ============================================================================

export const pyrolysisTransformations = mysqlTable("pyrolysis_transformations", {
  id: int("id").autoincrement().primaryKey(),
  originalMoleculeId: int("original_molecule_id").notNull(),
  productMoleculeId: int("product_molecule_id").notNull(),
  temperature: int("temperature"), // Celsius
  duration: int("duration"), // Seconds
  oxygen: varchar("oxygen", { length: 50 }), // Aerobic, anaerobic, etc.
  yieldPercentage: float("yield_percentage"),
  conditions: text("conditions"), // Additional conditions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  moleculeIdx: index("pyrolysis_transformations_molecule_idx").on(table.originalMoleculeId),
}));

export type PyrolysisTransformation = typeof pyrolysisTransformations.$inferSelect;
export type InsertPyrolysisTransformation = typeof pyrolysisTransformations.$inferInsert;

// ============================================================================
// 12. COMPARATIVE ANALYSES
// ============================================================================

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
  entities: text("entities"), // JSON: [entity_ids]
  analysisData: json("analysis_data"), // Structured comparison data
  visualizationUrl: varchar("visualization_url", { length: 500 }),
  conclusions: text("conclusions"),
  sourceReferences: text("source_references"), // JSON: [reference_ids]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("comparative_analyses_type_idx").on(table.type),
}));

export type ComparativeAnalysis = typeof comparativeAnalyses.$inferSelect;
export type InsertComparativeAnalysis = typeof comparativeAnalyses.$inferInsert;

// ============================================================================
// RELATIONS
// ============================================================================

export const tobaccoVarietiesRelations = relations(tobaccoVarieties, ({ many }) => ({
  terroirs: many(terroirs),
  accords: many(tobaccoCannabisAccords),
  molecules: many(aromaticMolecules),
}));

export const terroirsRelations = relations(terroirs, ({ many, one }) => ({
  varieties: many(tobaccoVarieties),
  landraces: many(landraces),
}));

export const landraceRelations = relations(landraces, ({ one }) => ({
  terroir: one(terroirs, {
    fields: [landraces.nativeTerroir],
    references: [terroirs.id],
  }),
}));

export const tobaccoCannabisAccordsRelations = relations(tobaccoCannabisAccords, ({ many }) => ({
  varieties: many(tobaccoVarieties),
  strains: many(cannabisStrains),
}));
