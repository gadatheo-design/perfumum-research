import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, uniqueIndex } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * PERFUMUM Research Database Schema
 * 
 * This schema implements 11 interconnected tables for managing:
 * - Prototypes (C1-C4)
 * - Olfactive families (Bio-Mineralis, Pétrichor, Volcanique, etc.)
 * - Molecules, Accords, Recipes
 * - Civilizations and their olfactive cultures
 * - Installations and laboratory materials
 */

// ============================================================================
// CORE USER TABLE
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// USER FAVORITES
// ============================================================================

export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one user can favorite a molecule only once
  uniqueUserMolecule: uniqueIndex("unique_user_molecule").on(table.userId, table.moleculeId),
}));

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

// ============================================================================
// RESEARCH MILESTONES
// ============================================================================

export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["prototype", "discovery", "collaboration", "publication", "other"]).default("other").notNull(),
  moleculeId: int("molecule_id"), // Optional: link to a specific molecule
  userId: int("user_id").notNull(), // Creator of the milestone
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

// ============================================================================
// PROTOTYPES (C1-C4)
// ============================================================================

export const prototypes = mysqlTable("prototypes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(), // C1, C2, C3, C4
  name: varchar("name", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  conceptualAxis: text("conceptualAxis"),
  sensoryForm: text("sensoryForm"),
  olfactiveFamily: text("olfactiveFamily"),
  preferredSupport: varchar("preferredSupport", { length: 100 }),
  keyEmotion: text("keyEmotion"),
  overview: text("overview"),
  composition: text("composition"), // JSON or markdown
  conceptualReflection: text("conceptualReflection"),
  installation: text("installation"),
  technicalDevelopment: text("technicalDevelopment"),
  theoreticalScope: text("theoreticalScope"),
  color: varchar("color", { length: 20 }), // Hex color for UI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prototype = typeof prototypes.$inferSelect;
export type InsertPrototype = typeof prototypes.$inferInsert;

// ============================================================================
// FAMILIES (Olfactive families: Bio-Mineralis, Pétrichor, Volcanique, etc.)
// ============================================================================

export const families = mysqlTable("families", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "perfumeum12",
    "biomineralis",
    "petrichor",
    "volcanique",
    "solarmineralis",
    "necrogeo",
    "other"
  ]).notNull(),
  description: text("description"),
  variationCount: int("variationCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Family = typeof families.$inferSelect;
export type InsertFamily = typeof families.$inferInsert;

// ============================================================================
// TABACS (Tobacco varieties)
// ============================================================================

export const tabacs = mysqlTable("tabacs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["blond", "brun", "oriental", "experimental"]).notNull(),
  origin: varchar("origin", { length: 255 }),
  aromaticProfile: text("aromaticProfile"), // JSON array: terre, miel, fumée, etc.
  intensity: int("intensity"), // 1-10
  idealTemperature: int("idealTemperature"),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tabac = typeof tabacs.$inferSelect;
export type InsertTabac = typeof tabacs.$inferInsert;

// ============================================================================
// MOLECULES
// ============================================================================

export const molecules = mysqlTable("molecules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  family: text("family"), // Flexible: Terpène, Sesquiterpène, Aldéhyde, etc.
  chemicalFormula: varchar("chemicalFormula", { length: 100 }), // e.g., C10H16
  olfactiveProfile: text("olfactiveProfile"),
  emotionalResonance: text("emotionalResonance"),
  functionalEffect: text("functionalEffect"), // Flexible: cold, humidity, sun, etc.
  sourceOrigin: text("sourceOrigin"), // Where it comes from
  concentration: varchar("concentration", { length: 100 }), // e.g., "0.0001%"
  notes: text("notes"), // Internal research notes
  // Scientific properties
  molecularWeight: int("molecularWeight"), // g/mol (e.g., 154 for pinene)
  boilingPoint: int("boilingPoint"), // °C (e.g., 155 for pinene)
  logP: int("logP"), // Partition coefficient × 100 (e.g., 450 for logP 4.5)
  volatility: int("volatility"), // 0-100 scale (calculated from boiling point)
  intensity: int("intensity"), // 0-100 scale (olfactive intensity)
  complexity: int("complexity"), // 0-100 scale (molecular complexity)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Molecule = typeof molecules.$inferSelect;
export type InsertMolecule = typeof molecules.$inferInsert;

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
// TRADITIONS OLFACTIVES
// ============================================================================

export const traditionsOlfactives = mysqlTable("traditions_olfactives", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }),
  symbolicMaterials: text("symbolicMaterials"), // JSON array: argile, résine, eau, etc.
  signatureAccordId: int("signatureAccordId").references(() => accords.id),
  longDescription: text("longDescription"),
  temporality: mysqlEnum("temporality", [
    "archaic",
    "antique",
    "medieval",
    "abyssal",
    "futuristic"
  ]),
  bibliographicReferences: text("bibliographicReferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TraditionOlfactive = typeof traditionsOlfactives.$inferSelect;
export type InsertTraditionOlfactive = typeof traditionsOlfactives.$inferInsert;

// Legacy exports for backward compatibility during migration
export const civilisations = traditionsOlfactives;
export type Civilisation = TraditionOlfactive;
export type InsertCivilisation = InsertTraditionOlfactive;

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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Recette = typeof recettes.$inferSelect;
export type InsertRecette = typeof recettes.$inferInsert;

// ============================================================================
// PETRICHOR (60 variations)
// ============================================================================

export const petrichor = mysqlTable("petrichor", {
  id: int("id").autoincrement().primaryKey(),
  variation: varchar("variation", { length: 255 }).notNull(),
  subfamily: mysqlEnum("subfamily", [
    "clair",
    "noir",
    "argile",
    "bois_humide",
    "racine",
    "mousse",
    "desert",
    "marin",
    "glaciaire",
    "urbain",
    "sacre"
  ]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Petrichor = typeof petrichor.$inferSelect;
export type InsertPetrichor = typeof petrichor.$inferInsert;

// ============================================================================
// VOLCANIQUE (36 variations)
// ============================================================================

export const volcanique = mysqlTable("volcanique", {
  id: int("id").autoincrement().primaryKey(),
  variation: varchar("variation", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "basalte_chaud",
    "basalte_froid",
    "vapeur",
    "soufre",
    "poussiere_tectonique",
    "magma_blanc",
    "pierre_poreuse"
  ]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Volcanique = typeof volcanique.$inferSelect;
export type InsertVolcanique = typeof volcanique.$inferInsert;

// ============================================================================
// INSTALLATIONS (Artistic installations)
// ============================================================================

export const installations = mysqlTable("installations", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  concept: text("concept"),
  materials: text("materials"),
  diffusionMode: text("diffusionMode"), // Flexible: description du mode de diffusion
  location: varchar("location", { length: 255 }),
  date: timestamp("date"),
  documentation: text("documentation"), // JSON: photos, videos, schemas URLs
  visitorExperience: text("visitorExperience"),
  theoreticalScope: text("theoreticalScope"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Installation = typeof installations.$inferSelect;
export type InsertInstallation = typeof installations.$inferInsert;

// ============================================================================
// LABORATOIRE (Laboratory materials / raw materials)
// ============================================================================

export const laboratoire = mysqlTable("laboratoire", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  botanicalName: varchar("botanicalName", { length: 255 }),
  type: mysqlEnum("type", [
    "huile_essentielle",
    "absolu",
    "resinoid",
    "concrete",
    "co2",
    "teinture",
    "poudre",
    "alcoolat",
    "autre"
  ]).notNull(),
  olfactiveFamily: text("olfactiveFamily"), // JSON array
  note: mysqlEnum("note", ["tete", "coeur", "fond", "tete_coeur", "coeur_fond"]),
  origin: varchar("origin", { length: 255 }),
  extractionMethod: mysqlEnum("extractionMethod", [
    "distillation",
    "extraction_solvant",
    "co2_supercritique",
    "expression",
    "teinture",
    "autre"
  ]),
  olfactiveProfile: text("olfactiveProfile"),
  character: text("character"), // JSON array: frais, chaud, sec, etc.
  supplier: varchar("supplier", { length: 255 }),
  pricePerMl: int("pricePerMl"), // in cents (CHF)
  stock: int("stock"), // in ml
  purchaseDate: timestamp("purchaseDate"),
  status: mysqlEnum("status", ["en_stock", "a_commander", "epuise"]).default("en_stock"),
  technicalNotes: text("technicalNotes"),
  manipulationNotes: text("manipulationNotes"),
  maxTemperature: int("maxTemperature"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Laboratoire = typeof laboratoire.$inferSelect;
export type InsertLaboratoire = typeof laboratoire.$inferInsert;

// ============================================================================
// RELATION TABLES (Many-to-Many)
// ============================================================================

// Prototypes <-> Molecules
export const prototypeMolecules = mysqlTable("prototype_molecules", {
  prototypeId: int("prototypeId").notNull().references(() => prototypes.id),
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
});

// Prototypes <-> Laboratoire (raw materials)
export const prototypeLaboratoire = mysqlTable("prototype_laboratoire", {
  prototypeId: int("prototypeId").notNull().references(() => prototypes.id),
  laboratoireId: int("laboratoireId").notNull().references(() => laboratoire.id),
});

// Tabacs <-> Molecules
export const tabacMolecules = mysqlTable("tabac_molecules", {
  tabacId: int("tabacId").notNull().references(() => tabacs.id),
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
});

// Tabacs <-> Accords
export const tabacAccords = mysqlTable("tabac_accords", {
  tabacId: int("tabacId").notNull().references(() => tabacs.id),
  accordId: int("accordId").notNull().references(() => accords.id),
});

// Tabacs <-> Traditions Olfactives
export const tabacCivilisations = mysqlTable("tabac_civilisations", {
  tabacId: int("tabacId").notNull().references(() => tabacs.id),
  civilisationId: int("civilisationId").notNull().references(() => traditionsOlfactives.id),
});

// Molecules <-> Accords
export const moleculeAccords = mysqlTable("molecule_accords", {
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
  accordId: int("accordId").notNull().references(() => accords.id),
});

// Molecules <-> Families
export const moleculeFamilies = mysqlTable("molecule_families", {
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
  familyId: int("familyId").notNull().references(() => families.id),
});

// Molecules <-> Recettes
export const moleculeRecettes = mysqlTable("molecule_recettes", {
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
  recetteId: int("recetteId").notNull().references(() => recettes.id),
});

// Accords <-> Traditions Olfactives
export const accordCivilisations = mysqlTable("accord_civilisations", {
  accordId: int("accordId").notNull().references(() => accords.id),
  civilisationId: int("civilisationId").notNull().references(() => traditionsOlfactives.id),
});

// Petrichor <-> Molecules
export const petrichorMolecules = mysqlTable("petrichor_molecules", {
  petrichorId: int("petrichorId").notNull().references(() => petrichor.id),
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
});

// Petrichor <-> Tabacs
export const petrichorTabacs = mysqlTable("petrichor_tabacs", {
  petrichorId: int("petrichorId").notNull().references(() => petrichor.id),
  tabacId: int("tabacId").notNull().references(() => tabacs.id),
});

// Petrichor <-> Recettes
export const petrichorRecettes = mysqlTable("petrichor_recettes", {
  petrichorId: int("petrichorId").notNull().references(() => petrichor.id),
  recetteId: int("recetteId").notNull().references(() => recettes.id),
});

// Volcanique <-> Molecules
export const volcaniqueMolecules = mysqlTable("volcanique_molecules", {
  volcaniqueId: int("volcaniqueId").notNull().references(() => volcanique.id),
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
});

// Volcanique <-> Tabacs
export const volcaniqueTabacs = mysqlTable("volcanique_tabacs", {
  volcaniqueId: int("volcaniqueId").notNull().references(() => volcanique.id),
  tabacId: int("tabacId").notNull().references(() => tabacs.id),
});

// Volcanique <-> Recettes
export const volcaniqueRecettes = mysqlTable("volcanique_recettes", {
  volcaniqueId: int("volcaniqueId").notNull().references(() => volcanique.id),
  recetteId: int("recetteId").notNull().references(() => recettes.id),
});

// Installations <-> Families
export const installationFamilies = mysqlTable("installation_families", {
  installationId: int("installationId").notNull().references(() => installations.id),
  familyId: int("familyId").notNull().references(() => families.id),
});

// Installations <-> Recettes
export const installationRecettes = mysqlTable("installation_recettes", {
  installationId: int("installationId").notNull().references(() => installations.id),
  recetteId: int("recetteId").notNull().references(() => recettes.id),
});

// Laboratoire <-> Molecules
export const laboratoireMolecules = mysqlTable("laboratoire_molecules", {
  laboratoireId: int("laboratoireId").notNull().references(() => laboratoire.id),
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
});

// Laboratoire <-> Recettes
export const laboratoireRecettes = mysqlTable("laboratoire_recettes", {
  laboratoireId: int("laboratoireId").notNull().references(() => laboratoire.id),
  recetteId: int("recetteId").notNull().references(() => recettes.id),
});


// ============================================================================
// MANUEL TECHNIQUE - CHEMICAL FAMILIES
// ============================================================================

export const chemicalFamilies = mysqlTable("chemical_families", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["acides_gras", "acides_aromatiques", "esters", "indoles"]).notNull(),
  description: text("description"),
  olfactiveRole: text("olfactiveRole"), // Rôle olfactif (rondeur, balsamique, etc.)
  volatility: varchar("volatility", { length: 50 }), // Faible, Moyenne, Forte
  polarity: varchar("polarity", { length: 50 }), // Faible, Moyenne, Élevée
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChemicalFamily = typeof chemicalFamilies.$inferSelect;
export type InsertChemicalFamily = typeof chemicalFamilies.$inferInsert;

// ============================================================================
// MANUEL TECHNIQUE - TOBACCO FORMULAS (Tabacs Alchimiques)
// ============================================================================

export const tobaccoFormulas = mysqlTable("tobacco_formulas", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(), // 🜂, 🜃, 🜄, 🪻, 🜔
  name: varchar("name", { length: 255 }).notNull(),
  olfactiveFamily: varchar("olfactiveFamily", { length: 255 }),
  inspiration: text("inspiration"),
  composition: text("composition"), // JSON: {element, matiere, ratio}
  procedure: text("procedure"), // Procédé technique
  cureConditions: text("cureConditions"), // JSON: {temperature, humidity, duration}
  observations: text("observations"),
  suggestedUse: text("suggestedUse"),
  effect: text("effect"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TobaccoFormula = typeof tobaccoFormulas.$inferSelect;
export type InsertTobaccoFormula = typeof tobaccoFormulas.$inferInsert;

// ============================================================================
// MANUEL TECHNIQUE - EXPERIMENTAL ACCORDS
// ============================================================================

export const experimentalAccords = mysqlTable("experimental_accords", {
  id: int("id").autoincrement().primaryKey(),
  number: int("number").notNull(), // 1-20
  olfactiveAxis: varchar("olfactiveAxis", { length: 255 }).notNull(),
  intention: varchar("intention", { length: 255 }).notNull(), // "Cendres de mer", "Peau d'encre", etc.
  baseTabac: text("baseTabac"),
  resinExtract: text("resinExtract"),
  sensoryModifier: text("sensoryModifier"),
  conceptualNote: text("conceptualNote"),
  isExtreme: int("isExtreme").default(0).notNull(), // 0 = standard, 1 = extrême
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExperimentalAccord = typeof experimentalAccords.$inferSelect;
export type InsertExperimentalAccord = typeof experimentalAccords.$inferInsert;

// ============================================================================
// MANUEL TECHNIQUE - SENSORY SCALES (Échelle ABSORBE)
// ============================================================================

export const sensoryScales = mysqlTable("sensory_scales", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["axis", "family"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  scale: varchar("scale", { length: 50 }), // "0-10" ou "0-5"
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SensoryScale = typeof sensoryScales.$inferSelect;
export type InsertSensoryScale = typeof sensoryScales.$inferInsert;

// ============================================================================
// RELATIONS - Chemical Families
// ============================================================================

// Molecules <-> Chemical Families
export const moleculeChemicalFamilies = mysqlTable("molecule_chemical_families", {
  moleculeId: int("moleculeId").notNull().references(() => molecules.id),
  chemicalFamilyId: int("chemicalFamilyId").notNull().references(() => chemicalFamilies.id),
});

// Tobacco Formulas <-> Installations
export const tobaccoFormulaInstallations = mysqlTable("tobacco_formula_installations", {
  tobaccoFormulaId: int("tobaccoFormulaId").notNull().references(() => tobaccoFormulas.id),
  installationId: int("installationId").notNull().references(() => installations.id),
});

// Experimental Accords <-> Traditions Olfactives
export const experimentalAccordCivilisations = mysqlTable("experimental_accord_civilisations", {
  experimentalAccordId: int("experimentalAccordId").notNull().references(() => experimentalAccords.id),
  civilisationId: int("civilisationId").notNull().references(() => traditionsOlfactives.id),
});

// Prototypes <-> Chemical Families
export const prototypeChemicalFamilies = mysqlTable("prototype_chemical_families", {
  prototypeId: int("prototypeId").notNull().references(() => prototypes.id),
  chemicalFamilyId: int("chemicalFamilyId").notNull().references(() => chemicalFamilies.id),
});

// Pétrichor <-> Experimental Accords
export const petrichorExperimentalAccords = mysqlTable("petrichor_experimental_accords", {
  petrichorId: int("petrichorId").notNull().references(() => petrichor.id),
  experimentalAccordId: int("experimentalAccordId").notNull().references(() => experimentalAccords.id),
});

// Volcanique <-> Experimental Accords
export const volcaniqueExperimentalAccords = mysqlTable("volcanique_experimental_accords", {
  volcaniqueId: int("volcaniqueId").notNull().references(() => volcanique.id),
  experimentalAccordId: int("experimentalAccordId").notNull().references(() => experimentalAccords.id),
});


// ============================================================================
// GLOSSARY - Unified terminology
// ============================================================================

export const glossary = mysqlTable("glossary", {
  id: int("id").autoincrement().primaryKey(),
  term: varchar("term", { length: 255 }).notNull().unique(),
  definition: text("definition").notNull(),
  category: mysqlEnum("category", [
    "chimie",
    "interaction",
    "reaction",
    "extraction",
    "technique",
    "molecule",
    "concept",
    "propriete",
    "methodologie",
    "formulation",
    "protocole",
    "dispositif",
    "support",
    "application",
    "structure"
  ]).notNull(),
  context: text("context"), // Where this term appears in the manual
  examples: text("examples"), // Practical examples
  relatedTerms: text("relatedTerms"), // JSON array of related term IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GlossaryTerm = typeof glossary.$inferSelect;
export type InsertGlossaryTerm = typeof glossary.$inferInsert;


// ============================================================================
// RESEARCH TIMELINE - Progressive research calendar
// ============================================================================

export const researchTimeline = mysqlTable("research_timeline", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  quarter: varchar("quarter", { length: 10 }).notNull(), // Format: "2025-Q1", "2025-Q2", etc.
  year: int("year").notNull(),
  quarterNumber: int("quarterNumber").notNull(), // 1, 2, 3, 4
  phase: mysqlEnum("phase", [
    "foundation",      // Fondation (premiers 6 mois)
    "development",     // Développement (6-12 mois)
    "expansion",       // Expansion (12-18 mois)
    "consolidation",   // Consolidation (18-24 mois)
    "innovation",      // Innovation (24-36 mois)
  ]).notNull(),
  category: mysqlEnum("category", [
    "research",        // Recherche scientifique
    "formulation",     // Développement de formules
    "testing",         // Tests et validation
    "documentation",   // Documentation et publication
    "infrastructure",  // Infrastructure et outils
    "collaboration",   // Collaborations et partenariats
  ]).notNull(),
  status: mysqlEnum("status", [
    "planned",         // Planifié
    "in_progress",     // En cours
    "completed",       // Terminé
    "delayed",         // Retardé
  ]).default("planned").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  deliverables: text("deliverables"), // JSON array of expected deliverables
  dependencies: text("dependencies"), // JSON array of milestone IDs this depends on
  progress: int("progress").default(0).notNull(), // 0-100
  startDate: varchar("startDate", { length: 10 }), // Format: YYYY-MM-DD
  endDate: varchar("endDate", { length: 10 }), // Format: YYYY-MM-DD
  completedDate: varchar("completedDate", { length: 10 }), // Format: YYYY-MM-DD
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResearchMilestone = typeof researchTimeline.$inferSelect;
export type InsertResearchMilestone = typeof researchTimeline.$inferInsert;


// ABSORBE profiles for prototypes
export const absorbeProfiles = mysqlTable("absorbe_profiles", {
  id: int("id").primaryKey().autoincrement(),
  prototypeId: int("prototype_id").notNull(),
  // 8 ABSORBE axes (0-10 scale)
  animalite: int("animalite").notNull().default(0), // Animalité
  boise: int("boise").notNull().default(0), // Boisé
  soufre: int("soufre").notNull().default(0), // Soufré
  oxyde: int("oxyde").notNull().default(0), // Oxydé
  resineux: int("resineux").notNull().default(0), // Résineux
  balsamique: int("balsamique").notNull().default(0), // Balsamique
  epice: int("epice").notNull().default(0), // Épicé
  terreux: int("terreux").notNull().default(0), // Terreux
  notes: text("notes"), // Additional notes about the profile
  createdAt: varchar("created_at", { length: 255 }).notNull(),
});


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
// MOLECULAR SYNERGIES
// ============================================================================

// Molecular synergies between tobacco, molecules, and olfactive families
export const synergies = mysqlTable("synergies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Nom de la synergie
  tabacId: int("tabac_id").references(() => tabacs.id),
  moleculeId: int("molecule_id").references(() => molecules.id),
  familleId: int("famille_id").references(() => families.id),
  type: mysqlEnum("type", ["potentialisation", "stabilisation", "transformation", "masquage"]).notNull(),
  effet: text("effet"), // Description de l'effet
  notes: text("notes"), // Notes techniques
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Synergie = typeof synergies.$inferSelect;
export type InsertSynergie = typeof synergies.$inferInsert;


// ============================================================================
// PHASE 4: COLLABORATION & PARTAGE
// ============================================================================

// Shared collections for temporary molecule sharing (24h expiration)
export const sharedCollections = mysqlTable("shared_collections", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(), // UUID for sharing
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  moleculeIds: text("molecule_ids").notNull(), // JSON array of molecule IDs
  creatorId: int("creator_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(), // 24h from creation
  viewCount: int("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SharedCollection = typeof sharedCollections.$inferSelect;
export type InsertSharedCollection = typeof sharedCollections.$inferInsert;

// Private annotations on molecules
export const moleculeNotes = mysqlTable("molecule_notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  note: text("note").notNull(), // Private note content
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // One note per user per molecule
  uniqueUserMolecule: uniqueIndex("unique_user_molecule_note").on(table.userId, table.moleculeId),
}));

export type MoleculeNote = typeof moleculeNotes.$inferSelect;
export type InsertMoleculeNote = typeof moleculeNotes.$inferInsert;

// Academic citations for molecules and recipes
export const citations = mysqlTable("citations", {
  id: int("id").autoincrement().primaryKey(),
  entityType: mysqlEnum("entity_type", ["molecule", "recipe", "prototype", "accord"]).notNull(),
  entityId: int("entity_id").notNull(),
  format: mysqlEnum("format", ["apa", "mla", "chicago", "bibtex"]).default("apa").notNull(),
  citationText: text("citation_text").notNull(), // Pre-formatted citation
  doi: varchar("doi", { length: 255 }), // Optional DOI
  url: varchar("url", { length: 512 }), // Optional URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Citation = typeof citations.$inferSelect;
export type InsertCitation = typeof citations.$inferInsert;
