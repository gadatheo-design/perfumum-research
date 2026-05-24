import { boolean, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, time, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { extractionMethods } from "./extraction-methods";
import { citations } from "./misc";
import { molecularTransformations } from "./molecular-transformations";
import { molecules } from "./molecules";

// ============================================================================
// RESEARCH PUBLICATIONS - Publications scientifiques
// ============================================================================

/**
 * Scientific publications related to aromatic transformations, pyrolysis,
 * and analytical methods for cannabis/tobacco research.
 */
export const researchPublications = mysqlTable("research_publications", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  refCode: varchar("ref_code", { length: 50 }).notNull().unique(), // Ref 1, Ref 2, etc.
  title: varchar("title", { length: 500 }).notNull(),
  // Authors
  authors: text("authors").notNull(), // Format: "Meehan-Atrash J, Strongin RM"
  leadAuthor: varchar("lead_author", { length: 255 }),
  // Publication info
  year: int("year").notNull(),
  journal: varchar("journal", { length: 255 }),
  volume: varchar("volume", { length: 50 }),
  pages: varchar("pages", { length: 50 }),
  doi: varchar("doi", { length: 255 }),
  pmcId: varchar("pmc_id", { length: 50 }), // PMC6610518, etc.
  // Citations
  citations: int("citations").default(0),
  citationsDate: timestamp("citations_date"), // Date when citations were counted
  // Research focus
  researchFocus: mysqlEnum("research_focus", [
    "pyrolysis",
    "combustion",
    "vaporization",
    "terpene_degradation",
    "cannabinoid_degradation",
    "smoke_characterization",
    "analytical_methods",
    "taxonomy",
    "other"
  ]).default("other"),
  // Subject matter
  subjectMatter: mysqlEnum("subject_matter", [
    "cannabis",
    "tobacco",
    "both",
    "terpenes",
    "general"
  ]).default("general"),
  // Temperature range studied
  temperatureMin: int("temperature_min"), // °C
  temperatureMax: int("temperature_max"), // °C
  temperatureRange: varchar("temperature_range", { length: 100 }), // "340-482°C"
  // Analytes studied
  analytes: json("analytes").$type<string[]>(), // ["Méthacroléine", "Benzène", etc.]
  // Sample types
  sampleTypes: json("sample_types").$type<string[]>(), // ["Terpènes purs", "Fumée de cannabis"]
  // Key findings
  keyFindings: text("key_findings"),
  // Advantages and limitations
  advantages: json("advantages").$type<string[]>(),
  limitations: json("limitations").$type<string[]>(),
  // Abstract
  abstract: text("abstract"),
  // URL
  url: varchar("url", { length: 500 }),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  yearIdx: index("research_pub_year_idx").on(table.year),
  focusIdx: index("research_pub_focus_idx").on(table.researchFocus),
  subjectIdx: index("research_pub_subject_idx").on(table.subjectMatter),
}));

export type ResearchPublication = typeof researchPublications.$inferSelect;
export type InsertResearchPublication = typeof researchPublications.$inferInsert;

// ============================================================================
// ANALYTICAL METHODS - Méthodes analytiques
// ============================================================================

/**
 * Analytical methods used in aromatic research (GC-MS, PTR-MS, SMPS, etc.)
 */
export const analyticalMethods = mysqlTable("analytical_methods", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  code: varchar("code", { length: 50 }).notNull().unique(), // GC-MS, PTR-MS, etc.
  name: varchar("name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 500 }), // Gas Chromatography-Mass Spectrometry
  // Category
  category: mysqlEnum("category", [
    "chromatography",
    "spectrometry",
    "thermal_analysis",
    "particle_analysis",
    "spectroscopy",
    "other"
  ]).default("other"),
  // Performance metrics
  performanceScore: int("performance_score"), // 1-10
  resolutionScore: int("resolution_score"), // 1-10
  sensitivityScore: int("sensitivity_score"), // 1-10
  // Detection capabilities
  detectionLimit: varchar("detection_limit", { length: 100 }), // "ppb level", "ppm level"
  detectionLimitUnit: varchar("detection_limit_unit", { length: 50 }),
  // Capabilities
  capabilities: json("capabilities").$type<string[]>(), // ["Real-time analysis", "High resolution"]
  // Limitations
  limitations: json("limitations").$type<string[]>(),
  // Best suited for
  bestSuitedFor: json("best_suited_for").$type<string[]>(), // ["Terpene profiling", "VOC detection"]
  // Description
  description: text("description"),
  // Technical details
  technicalDetails: text("technical_details"),
  // Publications using this method
  publicationCount: int("publication_count").default(0),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("analytical_method_category_idx").on(table.category),
  performanceIdx: index("analytical_method_performance_idx").on(table.performanceScore),
}));

export type AnalyticalMethod = typeof analyticalMethods.$inferSelect;
export type InsertAnalyticalMethod = typeof analyticalMethods.$inferInsert;

// ============================================================================
// RESEARCHERS - Chercheurs clés
// ============================================================================

/**
 * Key researchers in aromatic transformation and analytical chemistry.
 */
export const researchers = mysqlTable("researchers", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  name: varchar("name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  // Current status
  status: mysqlEnum("status", [
    "active",
    "inactive",
    "retired",
    "industry",
    "unknown"
  ]).default("unknown"),
  statusDetails: varchar("status_details", { length: 255 }), // "Actif (vapotage)", "Inactif (nano)"
  // Research focus
  researchFocus: json("research_focus").$type<string[]>(), // ["Pyrolyse des terpènes", "Chimie du vapotage"]
  // Expertise domains
  expertiseDomains: json("expertise_domains").$type<string[]>(), // ["Cannabis", "Tabac", "Terpènes"]
  // Academic metrics
  totalCitations: int("total_citations").default(0),
  publicationCount: int("publication_count").default(0),
  hIndex: int("h_index"),
  // Awards
  awards: json("awards").$type<{
    name: string;
    year: number;
    organization?: string;
  }[]>(),
  // Contact info
  email: varchar("email", { length: 255 }),
  orcid: varchar("orcid", { length: 50 }), // ORCID ID
  googleScholar: varchar("google_scholar", { length: 255 }),
  researchGate: varchar("research_gate", { length: 255 }),
  // Bio
  bio: text("bio"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("researcher_name_idx").on(table.name),
  statusIdx: index("researcher_status_idx").on(table.status),
}));

export type Researcher = typeof researchers.$inferSelect;
export type InsertResearcher = typeof researchers.$inferInsert;

// ============================================================================
// RESEARCH INSTITUTIONS - Institutions de recherche
// ============================================================================

/**
 * Research institutions active in aromatic transformation research.
 */
export const researchInstitutions = mysqlTable("research_institutions", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 100 }), // PSU, UBC, etc.
  // Location
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).notNull(),
  // Type
  institutionType: mysqlEnum("institution_type", [
    "university",
    "national_lab",
    "research_institute",
    "government",
    "industry",
    "independent",
    "other"
  ]).default("other"),
  // Department/Group
  department: varchar("department", { length: 255 }),
  researchGroup: varchar("research_group", { length: 255 }),
  // Research focus
  researchFocus: json("research_focus").$type<string[]>(), // ["Pyrolyse des terpènes", "Caractérisation de la fumée"]
  // Metrics
  totalCitations: int("total_citations").default(0),
  publicationCount: int("publication_count").default(0),
  // Website
  website: varchar("website", { length: 500 }),
  // Description
  description: text("description"),
  // Key contributions
  keyContributions: text("key_contributions"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("institution_name_idx").on(table.name),
  countryIdx: index("institution_country_idx").on(table.country),
  typeIdx: index("institution_type_idx").on(table.institutionType),
}));

export type ResearchInstitution = typeof researchInstitutions.$inferSelect;
export type InsertResearchInstitution = typeof researchInstitutions.$inferInsert;

// ============================================================================
// JUNCTION TABLES - Tables de liaison
// ============================================================================

// Publications <-> Analytical Methods
export const publicationMethods = mysqlTable("publication_methods", {
  id: int("id").autoincrement().primaryKey(),
  publicationId: int("publication_id").notNull().references(() => researchPublications.id, { onDelete: "cascade" }),
  methodId: int("method_id").notNull().references(() => analyticalMethods.id, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").default(false), // Primary method used
  notes: text("notes"),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_pub_method").on(table.publicationId, table.methodId),
}));

// Publications <-> Researchers
export const publicationResearchers = mysqlTable("publication_researchers", {
  id: int("id").autoincrement().primaryKey(),
  publicationId: int("publication_id").notNull().references(() => researchPublications.id, { onDelete: "cascade" }),
  researcherId: int("researcher_id").notNull().references(() => researchers.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["lead", "corresponding", "co-author"]).default("co-author"),
  authorOrder: int("author_order"), // Position in author list
}, (table) => ({
  uniqueLink: uniqueIndex("unique_pub_researcher").on(table.publicationId, table.researcherId),
}));

// Researchers <-> Institutions
export const researcherInstitutions = mysqlTable("researcher_institutions", {
  id: int("id").autoincrement().primaryKey(),
  researcherId: int("researcher_id").notNull().references(() => researchers.id, { onDelete: "cascade" }),
  institutionId: int("institution_id").notNull().references(() => researchInstitutions.id, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").default(true), // Primary affiliation
  startYear: int("start_year"),
  endYear: int("end_year"), // NULL if current
  position: varchar("position", { length: 255 }), // "Professor", "PhD Student", etc.
}, (table) => ({
  uniqueLink: uniqueIndex("unique_researcher_institution").on(table.researcherId, table.institutionId),
}));

// Publications <-> Molecules (molecules studied)
export const publicationMolecules = mysqlTable("publication_molecules", {
  id: int("id").autoincrement().primaryKey(),
  publicationId: int("publication_id").notNull().references(() => researchPublications.id, { onDelete: "cascade" }),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" }),
  studyType: mysqlEnum("study_type", [
    "source",      // Molecule as starting material
    "product",     // Molecule as degradation product
    "analyte",     // Molecule being analyzed
    "reference"    // Molecule mentioned as reference
  ]).default("analyte"),
  notes: text("notes"),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_pub_molecule").on(table.publicationId, table.moleculeId),
}));

// Publications <-> Transformations (transformations studied)
export const publicationTransformations = mysqlTable("publication_transformations", {
  id: int("id").autoincrement().primaryKey(),
  publicationId: int("publication_id").notNull().references(() => researchPublications.id, { onDelete: "cascade" }),
  transformationId: int("transformation_id").notNull().references(() => molecularTransformations.id, { onDelete: "cascade" }),
  isKeyFinding: boolean("is_key_finding").default(false),
  notes: text("notes"),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_pub_transformation").on(table.publicationId, table.transformationId),
}));

// ============================================================================
// RELATIONS
// ============================================================================

// ============================================================================
// PUBLICATION EXTRACTION METHODS (Liaisons publication ↔ procédés d'extraction)
// ============================================================================

export const publicationExtractionMethods = mysqlTable("publication_extraction_methods", {
  id: int("id").autoincrement().primaryKey(),
  publicationId: int("publication_id").notNull().references(() => researchPublications.id, { onDelete: "cascade" }),
  extractionMethodId: int("extraction_method_id").notNull().references(() => extractionMethods.id, { onDelete: "cascade" }),
  isKeyFinding: boolean("is_key_finding").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueLink: uniqueIndex("unique_pub_extraction").on(table.publicationId, table.extractionMethodId),
}));

export type PublicationExtractionMethod = typeof publicationExtractionMethods.$inferSelect;
export type InsertPublicationExtractionMethod = typeof publicationExtractionMethods.$inferInsert;
