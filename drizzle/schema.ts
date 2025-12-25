import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, uniqueIndex, index, json, decimal, unique, foreignKey } from "drizzle-orm/mysql-core";
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
  // Botanical and extraction properties
  botanicalSources: text("botanicalSources"), // Plant sources (e.g., "Lavande, Menthe, Eucalyptus")
  extractionMethod: text("extractionMethod"), // Extraction method (e.g., "Hydrodistillation, CO₂ supercritique")
  therapeuticProperties: text("therapeuticProperties"), // Therapeutic properties (e.g., "Calmant, Anti-inflammatoire")
  // Radar olfactive profile (0-100 scale)
  radarIntensity: int("radar_intensity").default(50), // Olfactive intensity
  radarFreshness: int("radar_freshness").default(50), // Freshness (citrus, mint)
  radarWarmth: int("radar_warmth").default(50), // Warmth (spicy, woody)
  radarSweetness: int("radar_sweetness").default(50), // Sweetness (floral, fruity)
  radarSpiciness: int("radar_spiciness").default(50), // Spiciness (pepper, ginger)
  radarEarthiness: int("radar_earthiness").default(50), // Earthiness (moss, soil, wood)
  // Bibliographic references (JSON array)
  references: json("references").$type<{
    author?: string;
    year?: number;
    title: string;
    journal?: string;
    doi?: string;
    url?: string;
    type: 'pubchem' | 'academic' | 'book' | 'database' | 'other';
  }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Molecule = typeof molecules.$inferSelect;
export type InsertMolecule = typeof molecules.$inferInsert;

// ============================================================================
// TERPENE SYNERGIES
// ============================================================================

export const userNotes = mysqlTable("user_notes", {
  id: int("id").primaryKey().autoincrement(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'molecule', 'recette', 'accord', 'civilisation'
  entityId: int("entity_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ============================================================================
// MOLECULES_RECETTES (Many-to-Many Relationship)
// ============================================================================

export const moleculesRecettes = mysqlTable("molecules_recettes", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull(),
  recetteId: int("recette_id").notNull(),
  proportion: decimal("proportion", { precision: 5, scale: 2 }), // 0-100%
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  uniqueMoleculeRecette: unique("unique_molecule_recette").on(table.moleculeId, table.recetteId),
  moleculeIdx: index("idx_molecule").on(table.moleculeId),
  recetteIdx: index("idx_recette").on(table.recetteId),
}));

export type MoleculeRecette = typeof moleculesRecettes.$inferSelect;
export type NewMoleculeRecette = typeof moleculesRecettes.$inferInsert;

// ============================================================================
// TERPENE SYNERGIES
// ============================================================================

export const terpeneSynergies = mysqlTable("terpene_synergies", {
  id: int("id").autoincrement().primaryKey(),
  terpene1Id: int("terpene1_id").notNull().references(() => molecules.id, { onDelete: "cascade" }),
  terpene2Id: int("terpene2_id").notNull().references(() => molecules.id, { onDelete: "cascade" }),
  compatibilityScore: int("compatibility_score").notNull().default(50), // 0-30=rouge, 31-70=jaune, 71-100=vert
  synergyNotes: text("synergy_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniquePair: uniqueIndex("unique_pair").on(table.terpene1Id, table.terpene2Id),
}));

export type TerpeneSynergy = typeof terpeneSynergies.$inferSelect;
export type InsertTerpeneSynergy = typeof terpeneSynergies.$inferInsert;

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

/// Molecule <-> Recettes (voir moleculesRecettes ligne 200)

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

// Molecular synergies between two molecules
export const moleculeSynergies = mysqlTable("molecule_synergies", {
  id: int("id").autoincrement().primaryKey(),
  molecule1Id: int("molecule1_id").notNull().references(() => molecules.id),
  molecule2Id: int("molecule2_id").notNull().references(() => molecules.id),
  type: mysqlEnum("type", ["potentialisation", "stabilisation", "transformation", "masquage"]).notNull(),
  description: text("description").notNull(), // Description détaillée de la synergie
  applications: text("applications"), // Applications pratiques
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one synergy per molecule pair (bidirectional)
  uniqueMoleculePair: uniqueIndex("unique_molecule_pair").on(table.molecule1Id, table.molecule2Id),
}));

export type MoleculeSynergie = typeof moleculeSynergies.$inferSelect;
export type InsertMoleculeSynergie = typeof moleculeSynergies.$inferInsert;


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

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

// Analytics events for tracking page views and user interactions
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"), // Nullable: can track anonymous users
  eventType: mysqlEnum("event_type", [
    "molecule_view",
    "recipe_view", 
    "terpene_view",
    "pdf_export",
    "favorite_add",
    "favorite_remove",
    "search_query"
  ]).notNull(),
  entityType: varchar("entity_type", { length: 50 }), // molecule, recipe, terpene, etc.
  entityId: int("entity_id"), // ID of the viewed entity
  metadata: text("metadata"), // JSON: additional data (search query, export format, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Index for fast queries by event type and date
  eventTypeIdx: index("event_type_idx").on(table.eventType),
  entityTypeIdx: index("entity_type_idx").on(table.entityType),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;


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
// MODIFICATION HISTORY
// ============================================================================

/**
 * Tracks all modifications made to entities in the system for audit and undo functionality.
 * Stores the complete state before and after each modification.
 */
export const modificationHistory = mysqlTable("modification_history", {
  id: int("id").autoincrement().primaryKey(),
  
  // User who made the modification
  userId: int("user_id").notNull(),
  
  // Type of entity modified
  entityType: mysqlEnum("entity_type", [
    "molecule",
    "recette",
    "accord",
    "famille",
    "matiere",
    "prototype",
    "synergie",
    "tradition"
  ]).notNull(),
  
  // ID of the entity that was modified
  entityId: int("entity_id").notNull(),
  
  // Type of operation
  operation: mysqlEnum("operation", ["create", "update", "delete"]).notNull(),
  
  // State before modification (JSON) - null for create operations
  stateBefore: json("state_before"),
  
  // State after modification (JSON) - null for delete operations
  stateAfter: json("state_after"),
  
  // Optional description of the change
  description: text("description"),
  
  // Whether this modification has been undone
  isUndone: int("is_undone").default(0).notNull(), // 0 = not undone, 1 = undone
  
  // Timestamp when the modification was made
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Timestamp when the modification was undone (if applicable)
  undoneAt: timestamp("undone_at"),
}, (table) => ({
  // Indexes for fast queries
  userIdIdx: index("user_id_idx").on(table.userId),
  entityTypeIdx: index("entity_type_idx").on(table.entityType),
  entityIdIdx: index("entity_id_idx").on(table.entityId),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

export type ModificationHistory = typeof modificationHistory.$inferSelect;
export type InsertModificationHistory = typeof modificationHistory.$inferInsert;


// ============================================================================
// SUPPLIERS (Fournisseurs de matières premières)
// ============================================================================

/**
 * Manages suppliers of raw materials (essential oils, absolutes, extracts, etc.)
 * Tracks supplier information, location, specialties, and contact details.
 */
export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  
  // Supplier name
  name: varchar("name", { length: 255 }).notNull(),
  
  // Company name (if different from supplier name)
  companyName: varchar("company_name", { length: 255 }),
  
  // Country and region
  country: varchar("country", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }),
  
  // Contact information
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  
  // Supplier specialties (JSON array of material types)
  specialties: json("specialties"), // e.g., ["essential_oils", "absolutes", "extracts"]
  
  // Description of the supplier
  description: text("description"),
  
  // Supplier rating (1-5 stars)
  rating: int("rating"), // 1-5
  
  // Quality certification (ISO, organic, etc.)
  certifications: json("certifications"), // e.g., ["ISO9001", "ORGANIC", "FAIR_TRADE"]
  
  // Whether this is a preferred supplier
  isPreferred: int("is_preferred").default(0).notNull(),
  
  // Notes about the supplier
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Indexes for fast queries
  nameIdx: index("supplier_name_idx").on(table.name),
  countryIdx: index("supplier_country_idx").on(table.country),
  regionIdx: index("supplier_region_idx").on(table.region),
}));

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

// ============================================================================
// SUPPLIER MATERIALS (Liaison entre fournisseurs et matières premières)
// ============================================================================

/**
 * Junction table linking suppliers to the materials they provide.
 * Tracks pricing, availability, and lead times.
 */
export const supplierMaterials = mysqlTable("supplier_materials", {
  id: int("id").autoincrement().primaryKey(),
  
  // Foreign keys
  supplierId: int("supplier_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  
  // Pricing information
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(), // USD, EUR, etc.
  
  // Availability
  minimumOrderQuantity: int("minimum_order_quantity"),
  unit: varchar("unit", { length: 50 }), // kg, L, ml, g, etc.
  
  // Lead time in days
  leadTimeDays: int("lead_time_days"),
  
  // Quality grade
  qualityGrade: mysqlEnum("quality_grade", ["standard", "premium", "extra_premium"]).default("standard").notNull(),
  
  // Whether this material is currently available
  isAvailable: int("is_available").default(1).notNull(),
  
  // Last order date
  lastOrderDate: timestamp("last_order_date"),
  
  // Notes specific to this supplier-material relationship
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // Foreign key constraints
  supplierIdFk: foreignKey({
    columns: [table.supplierId],
    foreignColumns: [suppliers.id],
  }),
  moleculeIdFk: foreignKey({
    columns: [table.moleculeId],
    foreignColumns: [molecules.id],
  }),
  // Unique constraint: one supplier can supply a material only once
  uniqueSupplierMaterial: uniqueIndex("unique_supplier_material").on(table.supplierId, table.moleculeId),
  // Indexes
  supplierIdIdx: index("supplier_material_supplier_idx").on(table.supplierId),
  moleculeIdIdx: index("supplier_material_molecule_idx").on(table.moleculeId),
}));

export type SupplierMaterial = typeof supplierMaterials.$inferSelect;
export type InsertSupplierMaterial = typeof supplierMaterials.$inferInsert;

// ============================================================================
// RECHERCHE RADICALE (Experimental radical accords - Art pieces)
// ============================================================================

/**
 * Radical experimental accords from the PERFUMUM research.
 * These are conceptual art pieces, not commercial perfumes.
 * Each accord explores extreme olfactive territories.
 */
export const rechercheRadicale = mysqlTable("recherche_radicale", {
  id: int("id").autoincrement().primaryKey(),
  
  // Core identification
  nom: varchar("nom", { length: 255 }).notNull(),
  symbole: varchar("symbole", { length: 10 }), // 🜁, 🜄, 🜃, etc.
  serie: varchar("serie", { length: 255 }).notNull(), // "SÉRIE PETRICHOR — RADICALIS EXTREMIS"
  
  // Conceptual framework
  concept: text("concept").notNull(), // Main concept description
  noteSpeciale: text("note_speciale"), // Special notes about the accord
  
  // Composition (stored as JSON)
  architecture: text("architecture").notNull(), // JSON: [{ingredient, note, concentration}]
  
  // Sensory and artistic aspects
  effet: text("effet").notNull(), // Sensory effect description
  usageArtistique: text("usage_artistique").notNull(), // Artistic usage and context
  
  // Metadata
  themesConceptuels: text("themes_conceptuels"), // JSON array of conceptual themes
  avertissement: text("avertissement"), // Warning about non-commercial nature
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type RechercheRadicale = typeof rechercheRadicale.$inferSelect;
export type InsertRechercheRadicale = typeof rechercheRadicale.$inferInsert;

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
// RELATIONS FOR SUPPLIERS
// ============================================================================

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  materials: many(supplierMaterials),
}));

export const supplierMaterialsRelations = relations(supplierMaterials, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierMaterials.supplierId],
    references: [suppliers.id],
  }),
  molecule: one(molecules, {
    fields: [supplierMaterials.moleculeId],
    references: [molecules.id],
  }),
}));
