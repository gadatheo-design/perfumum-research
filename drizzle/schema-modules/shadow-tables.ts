import {
  mysqlTable,
  int,
  bigint,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  mysqlEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { molecules } from "./molecules";
import { plants, terroirs } from "./plants";
import { tabacs } from "./tabacs";
import { rawMaterials } from "./raw-materials";
import { recettes } from "./recettes";
import { molecularTransformations } from "./molecular-transformations";
import { researchPublications } from "./research-publications";

/**
 * ============================================================================
 * TABLES FANTÔMES ("shadow tables") — Lot 5
 * ============================================================================
 *
 * Ces 11 tables existent en production (créées à la main sur la base de dev,
 * hors système de migration Drizzle) et sont activement utilisées par du code
 * serveur (server/routers/research.ts, server/routers/storylines.ts) via SQL
 * brut (mysql.createConnection / db.execute(sql.raw(...))), mais n'avaient
 * jamais été déclarées comme modules Drizzle. Voir DATA-INVENTORY-manus-db.md
 * §3 pour le détail de la découverte.
 *
 * Reconstruites à partir des logs `.manus/db/*.json` (CREATE TABLE + ALTER
 * TABLE exécutés avec succès, dans l'ordre chronologique des timestamps de
 * fichiers). Deux tables additionnelles identifiées par le même audit
 * (`bibliography_entity_links`, `bibliography_sources`) ne sont PAS incluses
 * ici : aucun `CREATE TABLE` n'a pu être récupéré pour elles dans les logs
 * (seules des requêtes `SHOW CREATE TABLE`/`SELECT COUNT(*)` ont été loguées).
 *
 * `storylines` et `story_elements` sont un cas particulier : leur premier
 * `CREATE TABLE` loggé a échoué (`DEFAULT (UNIX_TIMESTAMP() * 1000)` rejeté
 * par TiDB — erreur 1064), mais les deux tables existent bel et bien en
 * production (confirmé par un `SHOW TABLES` loggé ~40 min plus tard) et ont
 * ensuite reçu plusieurs `ALTER TABLE` réussis (colonnes Odeuropa, lat/lng).
 * La correction exacte qui a fait passer le CREATE original n'est pas dans
 * les logs (probablement appliquée manuellement hors de l'outil loggé) ; on
 * reconstruit ici la même définition sans la clause DEFAULT invalide — les
 * colonnes created_at/updated_at restent BIGINT (epoch ms) NOT NULL sans
 * défaut, cohérent avec le code applicatif qui fournit toujours `Date.now()`
 * explicitement à l'INSERT (server/routers/storylines.ts).
 */

// ----------------------------------------------------------------------------
// Perique (tabac fermenté) — composés et liaisons moléculaires
// ----------------------------------------------------------------------------

export const periqueCompounds = mysqlTable("perique_compounds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  formula: varchar("formula", { length: 100 }),
  concentrationPct: decimal("concentration_pct", { precision: 10, scale: 4 }),
  category: varchar("category", { length: 100 }),
  subcategory: varchar("subcategory", { length: 100 }),
  olfactoryNotes: text("olfactory_notes"),
  perfumeryPotential: varchar("perfumery_potential", { length: 50 }),
  dosagePerfumery: varchar("dosage_perfumery", { length: 50 }),
  origin: varchar("origin", { length: 255 }),
  isNewTobaccoIsolate: boolean("is_new_tobacco_isolate").default(false),
  sourceReference: varchar("source_reference", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const periqueMoleculeLinks = mysqlTable("perique_molecule_links", {
  id: int("id").autoincrement().primaryKey(),
  periqueCompoundId: int("perique_compound_id").notNull().references(() => periqueCompounds.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  matchType: varchar("match_type", { length: 50 }).default("exact_name"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("1.00"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  // Colonnes de validation déjà présentes dans la base historique. Aucune
  // contrainte FK n’existe sur verified_by : le schéma reflète donc le DDL réel.
  matchScore: decimal("match_score", { precision: 5, scale: 4 }),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: int("verified_by"),
  verifiedAt: timestamp("verified_at"),
}, (table) => ({
  uniqueLink: uniqueIndex("perique_molecule_links_unique_link").on(table.periqueCompoundId, table.moleculeId),
}));

// ----------------------------------------------------------------------------
// Tabac — liaisons molécules / terroirs
// ----------------------------------------------------------------------------

export const tabacMoleculeLinks = mysqlTable("tabac_molecule_links", {
  id: int("id").autoincrement().primaryKey(),
  tabacId: int("tabac_id").notNull().references(() => tabacs.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  concentration: decimal("concentration", { precision: 10, scale: 4 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueTabacMolecule: uniqueIndex("tabac_molecule_links_unique").on(table.tabacId, table.moleculeId),
}));

export const tabacTerroirLinks = mysqlTable("tabac_terroir_links", {
  id: int("id").autoincrement().primaryKey(),
  tabacId: int("tabac_id").notNull().references(() => tabacs.id),
  terroirId: int("terroir_id").notNull().references(() => terroirs.id),
  soilPh: decimal("soil_ph", { precision: 3, scale: 1 }),
  soilType: varchar("soil_type", { length: 100 }),
  nitrogenLevel: varchar("nitrogen_level", { length: 50 }),
  potassiumLevel: varchar("potassium_level", { length: 50 }),
  climateNotes: text("climate_notes"),
  cultivationNotes: text("cultivation_notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueTabacTerroir: uniqueIndex("tabac_terroir_links_unique").on(table.tabacId, table.terroirId),
}));

// ----------------------------------------------------------------------------
// Matières premières — liaison plantes
// ----------------------------------------------------------------------------

export const rawMaterialPlants = mysqlTable("raw_material_plants", {
  id: int("id").autoincrement().primaryKey(),
  rawMaterialId: int("raw_material_id").notNull().references(() => rawMaterials.id),
  plantId: int("plant_id").notNull().references(() => plants.id),
  partUsed: varchar("part_used", { length: 100 }),
  extractionYield: decimal("extraction_yield", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueRmPlant: uniqueIndex("raw_material_plants_unique").on(table.rawMaterialId, table.plantId),
}));

// ----------------------------------------------------------------------------
// Voies biosynthétiques
// ----------------------------------------------------------------------------

export const biosyntheticPathways = mysqlTable("biosynthetic_pathways", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  abbreviation: varchar("abbreviation", { length: 50 }),
  location: mysqlEnum("location", ["plastid", "cytosol", "mitochondria", "both"]).notNull(),
  mainProducts: text("main_products"),
  keyEnzymes: text("key_enzymes"),
  precursors: text("precursors"),
  description: text("description"),
  sourceReference: varchar("source_reference", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------------
// Cigarettes historiques
// ----------------------------------------------------------------------------

export const historicCigarettes = mysqlTable("historic_cigarettes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameOriginal: varchar("name_original", { length: 255 }),
  region: varchar("region", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  creationYear: int("creation_year"),
  status: varchar("status", { length: 50 }),
  format: varchar("format", { length: 100 }),
  hasFilter: boolean("has_filter").default(true),
  priceHistorical: varchar("price_historical", { length: 100 }),
  tobaccoComposition: text("tobacco_composition"),
  intensity: int("intensity"),
  characterDescription: varchar("character_description", { length: 255 }),
  dominantNotes: text("dominant_notes"),
  perfumeryScore: decimal("perfumery_score", { precision: 3, scale: 1 }),
  perfumeryApplications: text("perfumery_applications"),
  perfumeryApproach: text("perfumery_approach"),
  tier: int("tier"),
  // Colonnes en camelCase telles qu'exécutées en production (pas de
  // conversion snake_case pour ces deux-là — reflète le DDL réel).
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// ----------------------------------------------------------------------------
// Publications — liaisons molécules
// ----------------------------------------------------------------------------

export const publicationMoleculeLinks = mysqlTable("publication_molecule_links", {
  id: int("id").autoincrement().primaryKey(),
  publicationId: int("publication_id").notNull().references(() => researchPublications.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  relationshipType: mysqlEnum("relationship_type", ["studies", "mentions", "analyzes", "synthesizes"]).default("mentions"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueLink: uniqueIndex("publication_molecule_links_unique").on(table.publicationId, table.moleculeId),
}));

// ----------------------------------------------------------------------------
// Transformations moléculaires — impacts sur les recettes
// ----------------------------------------------------------------------------

export const transformationRecipeImpacts = mysqlTable("transformation_recipe_impacts", {
  id: int("id").autoincrement().primaryKey(),
  transformationId: int("transformation_id").notNull().references(() => molecularTransformations.id, { onDelete: "cascade" }),
  recetteId: int("recette_id").notNull().references(() => recettes.id, { onDelete: "cascade" }),
  impactType: mysqlEnum("impact_type", ["major", "moderate", "minor", "trace"]).notNull().default("moderate"),
  impactDescription: text("impact_description"),
  olfactoryContribution: text("olfactory_contribution"),
  percentageContribution: decimal("percentage_contribution", { precision: 5, scale: 2 }),
  temperatureRange: varchar("temperature_range", { length: 100 }),
  notes: text("notes"),
  sourceReference: text("source_reference"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  uniqueTransformationRecipe: uniqueIndex("transformation_recipe_impacts_unique").on(table.transformationId, table.recetteId),
}));

// ----------------------------------------------------------------------------
// Storylines & story elements (module narratif / Odeuropa)
// Voir le commentaire de tête de fichier pour la reconstruction created_at/
// updated_at (BIGINT epoch ms, sans DEFAULT — fourni par l'application).
// ----------------------------------------------------------------------------

export const storylines = mysqlTable("storylines", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  narrativeAxis: mysqlEnum("narrative_axis", [
    "tabac_rituel",
    "route_encens",
    "parfumerie_historique",
    "plantes_menacees",
    "terroir_olfactif",
    "chimie_transformation",
    "corpus_regional",
    "atlas_mnemosyne",
    "autre",
  ]).default("autre"),
  periodLabel: varchar("period_label", { length: 100 }),
  periodStartYear: int("period_start_year"),
  periodEndYear: int("period_end_year"),
  geographicScope: varchar("geographic_scope", { length: 255 }),
  status: mysqlEnum("status", ["draft", "active", "archived"]).default("draft"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  wikidataId: varchar("wikidata_id", { length: 50 }),
  // Colonnes Odeuropa ajoutées par ALTER TABLE (voir commentaire de tête).
  odeuropaStoryType: varchar("odeuropa_story_type", { length: 50 }),
  smellscapeDescription: text("smellscape_description"),
  sensoryExperience: text("sensory_experience"),
  crossStorylineIds: text("cross_storyline_ids"),
  // Coordonnées géographiques ajoutées par ALTER TABLE.
  lat: decimal("lat", { precision: 10, scale: 6 }),
  lng: decimal("lng", { precision: 10, scale: 6 }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("storylines_slug_idx").on(table.slug),
  axisIdx: index("idx_storylines_axis").on(table.narrativeAxis),
  statusIdx: index("idx_storylines_status").on(table.status),
}));

export const storyElements = mysqlTable("story_elements", {
  id: int("id").autoincrement().primaryKey(),
  storylineId: int("storyline_id").notNull().references(() => storylines.id, { onDelete: "cascade" }),
  entityType: mysqlEnum("entity_type", [
    "plant",
    "molecule",
    "recipe",
    "raw_material",
    "terroir",
    "reference",
    "experience",
  ]).notNull(),
  entityId: int("entity_id").notNull(),
  roleInStory: mysqlEnum("role_in_story", [
    "protagonist",
    "context",
    "transformation",
    "symbol",
    "source",
    "destination",
    "contrast",
  ]).default("context"),
  narrativeNote: text("narrative_note"),
  sequenceOrder: int("sequence_order").default(0),
  // Colonnes Odeuropa ajoutées par ALTER TABLE (voir commentaire de tête).
  odeuropaLevel: varchar("odeuropa_level", { length: 20 }).default("olfactory"),
  narrativeAxis: varchar("narrative_axis", { length: 50 }),
  skosConcept: varchar("skos_concept", { length: 100 }),
  connectsToElementId: int("connects_to_element_id"),
  connectionType: varchar("connection_type", { length: 50 }),
  odeuropaNote: text("odeuropa_note"),
  // Colonnes image/sensorielles ajoutées par ALTER TABLE.
  imageUrl: varchar("image_url", { length: 500 }),
  europeanaId: varchar("europeana_id", { length: 200 }),
  imageCaption: text("image_caption"),
  imageSource: varchar("image_source", { length: 200 }),
  smellscapeDescription: text("smellscape_description"),
  sensoryExperience: text("sensory_experience"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
}, (table) => ({
  storylineIdx: index("idx_story_elements_storyline").on(table.storylineId),
  entityIdx: index("idx_story_elements_entity").on(table.entityType, table.entityId),
}));

export type PeriqueCompound = typeof periqueCompounds.$inferSelect;
export type InsertPeriqueCompound = typeof periqueCompounds.$inferInsert;
export type PeriqueMoleculeLink = typeof periqueMoleculeLinks.$inferSelect;
export type InsertPeriqueMoleculeLink = typeof periqueMoleculeLinks.$inferInsert;
export type TabacMoleculeLink = typeof tabacMoleculeLinks.$inferSelect;
export type InsertTabacMoleculeLink = typeof tabacMoleculeLinks.$inferInsert;
export type TabacTerroirLink = typeof tabacTerroirLinks.$inferSelect;
export type InsertTabacTerroirLink = typeof tabacTerroirLinks.$inferInsert;
export type RawMaterialPlant = typeof rawMaterialPlants.$inferSelect;
export type InsertRawMaterialPlant = typeof rawMaterialPlants.$inferInsert;
export type BiosyntheticPathway = typeof biosyntheticPathways.$inferSelect;
export type InsertBiosyntheticPathway = typeof biosyntheticPathways.$inferInsert;
export type HistoricCigarette = typeof historicCigarettes.$inferSelect;
export type InsertHistoricCigarette = typeof historicCigarettes.$inferInsert;
export type PublicationMoleculeLink = typeof publicationMoleculeLinks.$inferSelect;
export type InsertPublicationMoleculeLink = typeof publicationMoleculeLinks.$inferInsert;
export type TransformationRecipeImpact = typeof transformationRecipeImpacts.$inferSelect;
export type InsertTransformationRecipeImpact = typeof transformationRecipeImpacts.$inferInsert;
export type Storyline = typeof storylines.$inferSelect;
export type InsertStoryline = typeof storylines.$inferInsert;
export type StoryElement = typeof storyElements.$inferSelect;
export type InsertStoryElement = typeof storyElements.$inferInsert;
