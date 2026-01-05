import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, uniqueIndex, index, json, decimal, unique, foreignKey, boolean } from "drizzle-orm/mysql-core";
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
  // Nomenclature scientifique
  iupacName: varchar("iupac_name", { length: 500 }), // Nom IUPAC systématique (ex: "(1R,5R)-4,6,6-trimethylbicyclo[3.1.1]hept-3-en-2-one")
  casNumber: varchar("cas_number", { length: 20 }), // Numéro CAS (ex: "80-56-8")
  chemicalClass: mysqlEnum("chemical_class", [
    "terpene",
    "sesquiterpene",
    "diterpene",
    "monoterpene",
    "aldehyde",
    "ketone",
    "alcohol",
    "ester",
    "ether",
    "phenol",
    "lactone",
    "coumarin",
    "musk",
    "nitrile",
    "sulfur_compound",
    "heterocyclic",
    "aromatic",
    "aliphatic",
    "other"
  ]), // Classe chimique principale
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
  role: mysqlEnum("role", ["tête", "cœur", "fond"]), // Rôle olfactif
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


// ============================================================================
// FIELD ARCHIVES (Archives terrain - ABSORBE·COLOMBIA)
// ============================================================================

export const fieldArchives = mysqlTable("field_archives", {
  id: int("id").autoincrement().primaryKey(),
  provisionalName: varchar("provisional_name", { length: 255 }).notNull(),
  zone: varchar("zone", { length: 255 }), // e.g., "Andes / Altiplano"
  preciseLocation: varchar("precise_location", { length: 255 }),
  altitude: int("altitude"), // in meters
  date: timestamp("date"),
  climate: text("climate"), // Description du climat
  material: text("material"), // Matière rencontrée
  dominantSmell: text("dominant_smell"), // Odeur dominante
  localUsage: text("local_usage"), // Usage local observé
  personalFeeling: text("personal_feeling"), // Ressenti personnel
  olfactiveHypothesis: text("olfactive_hypothesis"), // Hypothèse olfactive
  testPerformed: mysqlEnum("test_performed", ["yes", "no", "planned"]).default("no"),
  testType: varchar("test_type", { length: 100 }), // Type de test (MCT, Alcool, etc.)
  status: mysqlEnum("status", ["draft", "in_progress", "completed", "archived"]).default("draft"),
  linkedCollectionId: int("linked_collection_id"), // Lien vers une collection/étude
  // Contexte détaillé
  encounterContext: text("encounter_context"), // Situation / Rencontre
  firstImpression: text("first_impression"), // Première impression sensorielle
  evolution: text("evolution"), // Évolution de l'odeur
  persistence: text("persistence"), // Persistances
  materialOrigin: text("material_origin"), // Origine de la matière
  materialState: varchar("material_state", { length: 100 }), // frais / sec / brûlé
  symbolicQuantity: text("symbolic_quantity"), // Quantité symbolique
  translationHypothesis: text("translation_hypothesis"), // Vers parfum / encens / archive
  whatToKeep: text("what_to_keep"), // Ce que je garde
  whatToLeave: text("what_to_leave"), // Ce que je laisse
  personalNote: text("personal_note"), // Archive subjective assumée
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FieldArchive = typeof fieldArchives.$inferSelect;
export type InsertFieldArchive = typeof fieldArchives.$inferInsert;

// ============================================================================
// CLIMATE STUDIES (Études climatiques)
// ============================================================================

export const climateStudies = mysqlTable("climate_studies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Petrichor Andin"
  collection: varchar("collection", { length: 255 }), // e.g., "COLOMBIA · Humidity Studies"
  axis: varchar("axis", { length: 255 }), // e.g., "Petrichor", "Feuilles après pluie"
  concept: text("concept"), // Concept général
  zone: varchar("zone", { length: 255 }), // Zone géographique
  altitude: varchar("altitude", { length: 100 }), // Plage d'altitude
  climate: text("climate"), // Description climatique
  keyMoment: text("key_moment"), // Moment clé d'observation
  // Description sensorielle (pyramide olfactive)
  attackDescription: text("attack_description"), // Attaque
  heartDescription: text("heart_description"), // Cœur
  baseDescription: text("base_description"), // Fond
  observedSupports: text("observed_supports"), // Supports observés (JSON array)
  // Lecture ABSORBE
  absorbeReading: text("absorbe_reading"), // Lecture conceptuelle
  thresholdOdor: mysqlEnum("threshold_odor", ["yes", "no"]).default("no"), // Odeur de seuil ?
  // Tests terrain recommandés
  recommendedTests: text("recommended_tests"), // JSON array de tests
  // Hypothèse de traduction labo
  headTranslation: text("head_translation"), // Tête
  heartTranslation: text("heart_translation"), // Cœur
  baseTranslation: text("base_translation"), // Fond
  ethicalPosition: text("ethical_position"), // Position éthique
  status: mysqlEnum("status", ["field_observation", "lab_translation", "completed"]).default("field_observation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ClimateStudy = typeof climateStudies.$inferSelect;
export type InsertClimateStudy = typeof climateStudies.$inferInsert;

// ============================================================================
// MOLECULAR PROTOCOLS (Protocoles moléculaires)
// ============================================================================

export const molecularProtocols = mysqlTable("molecular_protocols", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Petrichor Andin — Reconstruction olfactive"
  linkedStudyId: int("linked_study_id").references(() => climateStudies.id), // Lien vers étude climatique
  objective: text("objective"), // Objectif du protocole
  olfactiveArchitecture: text("olfactive_architecture"), // Axe principal
  function: text("function"), // Fonction olfactive
  // Palette moléculaire (JSON)
  headPalette: json("head_palette").$type<{
    molecule: string;
    percentage: number;
    function: string;
    warning?: string;
  }[]>(),
  heartPalette: json("heart_palette").$type<{
    molecule: string;
    percentage: number;
    function: string;
    warning?: string;
  }[]>(),
  basePalette: json("base_palette").$type<{
    molecule: string;
    percentage: number;
    function: string;
    warning?: string;
  }[]>(),
  // Ratios
  headRatio: int("head_ratio").default(25), // %
  heartRatio: int("heart_ratio").default(45), // %
  baseRatio: int("base_ratio").default(30), // %
  // Protocole de formulation
  formulationProtocol: text("formulation_protocol"), // Étapes de formulation (JSON array)
  sensoryTests: text("sensory_tests"), // Tests sensoriels à effectuer (JSON array)
  typicalFailures: text("typical_failures"), // Échecs typiques à éviter
  status: mysqlEnum("status", ["conceptual", "testing", "validated"]).default("conceptual"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MolecularProtocol = typeof molecularProtocols.$inferSelect;
export type InsertMolecularProtocol = typeof molecularProtocols.$inferInsert;

// ============================================================================
// EXTRACTION TESTS (Tests d'extraction)
// ============================================================================

export const extractionTests = mysqlTable("extraction_tests", {
  id: int("id").autoincrement().primaryKey(),
  testName: varchar("test_name", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  fieldArchiveId: int("field_archive_id").references(() => fieldArchives.id), // Lien vers archive terrain
  material: text("material"), // Matière testée
  solvent: mysqlEnum("solvent", ["mct", "alcohol_95", "alcohol_70", "water", "other"]).notNull(),
  ratio: varchar("ratio", { length: 100 }), // e.g., "1:10"
  duration: int("duration"), // Durée en heures
  resultSmell: text("result_smell"), // Odeur résultat
  viable: mysqlEnum("viable", ["yes", "no", "maybe"]).default("maybe"),
  notes: text("notes"),
  // Observations temporelles
  observationDay1: text("observation_day_1"),
  observationDay7: text("observation_day_7"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtractionTest = typeof extractionTests.$inferSelect;
export type InsertExtractionTest = typeof extractionTests.$inferInsert;

// ============================================================================
// SITUATED SMELLS (Odeurs situées)
// ============================================================================

export const situatedSmells = mysqlTable("situated_smells", {
  id: int("id").autoincrement().primaryKey(),
  poeticName: varchar("poetic_name", { length: 255 }).notNull(), // Nom poétique
  location: varchar("location", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  weather: varchar("weather", { length: 255 }), // Météo
  support: text("support"), // Support de l'odeur
  immediateImpression: text("immediate_impression"), // Impression immédiate
  triggeredMemory: text("triggered_memory"), // Souvenir déclenché
  recreatable: mysqlEnum("recreatable", ["yes", "no", "maybe"]).default("maybe"),
  linkedFieldArchiveId: int("linked_field_archive_id").references(() => fieldArchives.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SituatedSmell = typeof situatedSmells.$inferSelect;
export type InsertSituatedSmell = typeof situatedSmells.$inferInsert;

// ============================================================================
// RELATIONS FOR FIELD ARCHIVES
// ============================================================================

export const fieldArchivesRelations = relations(fieldArchives, ({ many }) => ({
  extractionTests: many(extractionTests),
  situatedSmells: many(situatedSmells),
}));

export const extractionTestsRelations = relations(extractionTests, ({ one }) => ({
  fieldArchive: one(fieldArchives, {
    fields: [extractionTests.fieldArchiveId],
    references: [fieldArchives.id],
  }),
}));

export const situatedSmellsRelations = relations(situatedSmells, ({ one }) => ({
  fieldArchive: one(fieldArchives, {
    fields: [situatedSmells.linkedFieldArchiveId],
    references: [fieldArchives.id],
  }),
}));

export const climateStudiesRelations = relations(climateStudies, ({ many }) => ({
  molecularProtocols: many(molecularProtocols),
}));

export const molecularProtocolsRelations = relations(molecularProtocols, ({ one }) => ({
  climateStudy: one(climateStudies, {
    fields: [molecularProtocols.linkedStudyId],
    references: [climateStudies.id],
  }),
}));

// ============================================================================
// LEAF ECONOMIES (San Andrés / Seaflower Research)
// ============================================================================

export const leafEconomies = mysqlTable("leaf_economies", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  sampleId: varchar("sample_id", { length: 50 }).notNull().unique(), // SA-LE-001, SA-LE-002, etc.
  date: timestamp("date"),
  // Localisation
  island: mysqlEnum("island", ["san_andres", "providencia", "autre"]),
  preciseLocation: varchar("precise_location", { length: 255 }),
  sourceContact: text("source_contact"),
  // Classification botanique
  category: mysqlEnum("category", ["aromatique", "tabac", "cannabis"]).notNull(),
  species: varchar("species", { length: 255 }), // Nom scientifique
  claimedVariety: varchar("claimed_variety", { length: 255 }), // Variété revendiquée
  // Partie et état
  usedPart: mysqlEnum("used_part", ["feuille", "fleur", "resine", "tige", "autre"]),
  state: mysqlEnum("state", ["frais", "sec", "rehydrate"]),
  // Traitement
  curingTreatment: mysqlEnum("curing_treatment", ["aucun", "air_cured", "flue_cured", "sun_cured", "autre"]),
  // Extraction
  extraction: mysqlEnum("extraction", ["aucune", "maceration_alcool", "maceration_mct", "distillation", "headspace"]),
  ratioParameters: varchar("ratio_parameters", { length: 255 }), // e.g., "1:5 (m/v)"
  duration: varchar("duration", { length: 100 }), // e.g., "24h", "30m"
  // Profil olfactif
  odorNotes: text("odor_notes"),
  climaticAxis: text("climatic_axis"), // JSON array: ["vent", "sel", "bois", "disparition"]
  usage: text("usage"), // JSON array: ["parfum", "encens", "espace"]
  // Analyse chimique
  analysisAvailable: int("analysis_available").default(0), // 0 = false, 1 = true
  analysisMethod: mysqlEnum("analysis_method", ["gc_ms", "hplc", "autre"]),
  topMoleculesList: text("top_molecules_list"), // Liste complète des molécules
  topMolecule1: varchar("top_molecule_1", { length: 255 }),
  topMolecule2: varchar("top_molecule_2", { length: 255 }),
  topMolecule3: varchar("top_molecule_3", { length: 255 }),
  relativePercentages: text("relative_percentages"), // Pourcentages relatifs
  // Interprétation
  absorbeInterpretation: text("absorbe_interpretation"),
  // Statut et métadonnées
  status: mysqlEnum("status", ["brut", "a_analyser", "analyse", "traduction", "archive"]).default("brut"),
  mediaLinks: text("media_links"), // URLs séparées par des virgules ou JSON
  imageUrl: varchar("image_url", { length: 500 }), // URL de l'image principale de l'échantillon
  ethicalNotes: text("ethical_notes"), // Notes éthiques / consentement
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LeafEconomy = typeof leafEconomies.$inferSelect;
export type InsertLeafEconomy = typeof leafEconomies.$inferInsert;

// ============================================================================
// LEAF ECONOMIES RELATIONS
// ============================================================================

// Relation: Leaf Economies <-> Molecules (Many-to-Many)
export const leafEconomyMolecules = mysqlTable("leaf_economy_molecules", {
  leafEconomyId: int("leaf_economy_id").notNull().references(() => leafEconomies.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }), // Pourcentage relatif
  notes: text("notes"),
});

export const leafEconomiesRelations = relations(leafEconomies, ({ many }) => ({
  molecules: many(leafEconomyMolecules),
}));

export const leafEconomyMoleculesRelations = relations(leafEconomyMolecules, ({ one }) => ({
  leafEconomy: one(leafEconomies, {
    fields: [leafEconomyMolecules.leafEconomyId],
    references: [leafEconomies.id],
  }),
  molecule: one(molecules, {
    fields: [leafEconomyMolecules.moleculeId],
    references: [molecules.id],
  }),
}));


// ============================================================================
// GEOGRAPHIC ORIGINS (Terroirs de production)
// ============================================================================

export const geographicOrigins = mysqlTable("geographic_origins", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Ex: "Rose de Bulgarie", "Bergamote de Calabre"
  country: varchar("country", { length: 100 }).notNull(), // Ex: "Bulgarie", "Italie"
  region: varchar("region", { length: 255 }), // Ex: "Vallée des Roses", "Calabre"
  terroir: text("terroir"), // Description du terroir (climat, sol, altitude)
  latitude: decimal("latitude", { precision: 10, scale: 7 }), // Coordonnées GPS
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  altitude: int("altitude"), // Altitude en mètres
  climate: varchar("climate", { length: 100 }), // Ex: "Méditerranéen", "Continental", "Tropical"
  soilType: varchar("soil_type", { length: 255 }), // Ex: "Calcaire", "Volcanique", "Argileux"
  harvestPeriod: varchar("harvest_period", { length: 255 }), // Ex: "Mai-Juin", "Octobre-Novembre"
  productionMethod: text("production_method"), // Méthodes de culture/récolte traditionnelles
  qualityIndicators: text("quality_indicators"), // AOC, IGP, certifications
  historicalContext: text("historical_context"), // Histoire du terroir
  economicImportance: text("economic_importance"), // Importance économique
  sustainabilityNotes: text("sustainability_notes"), // Notes sur durabilité/éthique
  imageUrl: varchar("image_url", { length: 500 }), // Image du terroir
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type GeographicOrigin = typeof geographicOrigins.$inferSelect;
export type InsertGeographicOrigin = typeof geographicOrigins.$inferInsert;

// ============================================================================
// MOLECULE ORIGINS (Many-to-Many: Molecules <-> Geographic Origins)
// ============================================================================

export const moleculeOrigins = mysqlTable("molecule_origins", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  originId: int("origin_id").notNull().references(() => geographicOrigins.id),
  isPrimaryOrigin: int("is_primary_origin").default(0), // 1 = origine principale, 0 = secondaire
  qualityRating: int("quality_rating"), // Note de qualité 1-5
  productionVolume: varchar("production_volume", { length: 100 }), // Ex: "500 tonnes/an"
  priceRange: varchar("price_range", { length: 100 }), // Ex: "€€€", "Premium"
  specificCharacteristics: text("specific_characteristics"), // Caractéristiques spécifiques à cette origine
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueMoleculeOrigin: unique("unique_molecule_origin").on(table.moleculeId, table.originId),
}));

export type MoleculeOrigin = typeof moleculeOrigins.$inferSelect;
export type InsertMoleculeOrigin = typeof moleculeOrigins.$inferInsert;

// ============================================================================
// IFRA RESTRICTIONS (Restrictions réglementaires IFRA)
// ============================================================================

export const ifraRestrictions = mysqlTable("ifra_restrictions", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  ifraAmendment: varchar("ifra_amendment", { length: 20 }), // Ex: "49th", "50th"
  effectiveDate: timestamp("effective_date"), // Date d'entrée en vigueur
  // Catégories IFRA (11 catégories principales)
  category1: decimal("category_1", { precision: 6, scale: 4 }), // Produits appliqués sur les lèvres
  category2: decimal("category_2", { precision: 6, scale: 4 }), // Déodorants/antiperspirants
  category3: decimal("category_3", { precision: 6, scale: 4 }), // Produits pour les yeux
  category4: decimal("category_4", { precision: 6, scale: 4 }), // Parfums fins
  category5a: decimal("category_5a", { precision: 6, scale: 4 }), // Produits corporels (application large)
  category5b: decimal("category_5b", { precision: 6, scale: 4 }), // Produits corporels (application localisée)
  category5c: decimal("category_5c", { precision: 6, scale: 4 }), // Produits pour les pieds
  category5d: decimal("category_5d", { precision: 6, scale: 4 }), // Produits intimes
  category6: decimal("category_6", { precision: 6, scale: 4 }), // Produits buccaux
  category7a: decimal("category_7a", { precision: 6, scale: 4 }), // Produits capillaires (rinçage)
  category7b: decimal("category_7b", { precision: 6, scale: 4 }), // Produits capillaires (sans rinçage)
  category8: decimal("category_8", { precision: 6, scale: 4 }), // Produits pour bébés
  category9: decimal("category_9", { precision: 6, scale: 4 }), // Produits ménagers
  category10a: decimal("category_10a", { precision: 6, scale: 4 }), // Détergents (contact direct)
  category10b: decimal("category_10b", { precision: 6, scale: 4 }), // Détergents (contact indirect)
  category11a: decimal("category_11a", { precision: 6, scale: 4 }), // Bougies/diffuseurs (intérieur)
  category11b: decimal("category_11b", { precision: 6, scale: 4 }), // Bougies/diffuseurs (extérieur)
  // Informations complémentaires
  restrictionType: mysqlEnum("restriction_type", [
    "prohibited", // Interdit
    "restricted", // Limité avec concentration max
    "specification", // Spécification requise
    "no_restriction" // Pas de restriction
  ]).default("no_restriction"),
  reasonForRestriction: text("reason_for_restriction"), // Raison de la restriction (allergie, phototoxicité, etc.)
  alternativeSuggestions: text("alternative_suggestions"), // Alternatives suggérées
  notes: text("notes"),
  sourceUrl: varchar("source_url", { length: 500 }), // Lien vers documentation IFRA
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type IfraRestriction = typeof ifraRestrictions.$inferSelect;
export type InsertIfraRestriction = typeof ifraRestrictions.$inferInsert;

// ============================================================================
// RELATIONS FOR GEOGRAPHIC ORIGINS AND IFRA
// ============================================================================

export const geographicOriginsRelations = relations(geographicOrigins, ({ many }) => ({
  moleculeOrigins: many(moleculeOrigins),
}));

export const moleculeOriginsRelations = relations(moleculeOrigins, ({ one }) => ({
  molecule: one(molecules, {
    fields: [moleculeOrigins.moleculeId],
    references: [molecules.id],
  }),
  origin: one(geographicOrigins, {
    fields: [moleculeOrigins.originId],
    references: [geographicOrigins.id],
  }),
}));

export const ifraRestrictionsRelations = relations(ifraRestrictions, ({ one }) => ({
  molecule: one(molecules, {
    fields: [ifraRestrictions.moleculeId],
    references: [molecules.id],
  }),
}));


// ============================================================================
// PLANTS (Plantes aromatiques avec variétés et états botaniques)
// ============================================================================

export const plants = mysqlTable("plants", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  name: varchar("name", { length: 255 }).notNull(), // Nom commun (ex: "Lemongrass")
  latinName: varchar("latin_name", { length: 255 }), // Nom latin (ex: "Cymbopogon citratus")
  family: varchar("family", { length: 100 }), // Famille botanique (ex: "Poaceae")
  // Classification
  category: mysqlEnum("category", [
    "aromatique",
    "tabac",
    "cannabis",
    "resine",
    "bois",
    "fleur",
    "racine",
    "autre"
  ]).notNull(),
  // Origine et localisation
  origin: varchar("origin", { length: 255 }), // Origine géographique
  habitat: text("habitat"), // Habitat naturel
  latitude: decimal("latitude", { precision: 10, scale: 7 }), // Latitude GPS (ex: 45.5016889)
  longitude: decimal("longitude", { precision: 10, scale: 7 }), // Longitude GPS (ex: -73.5672560)
  // Profil olfactif
  olfactiveSignature: text("olfactive_signature"), // Description olfactive
  dominantMolecules: text("dominant_molecules"), // Molécules dominantes (JSON array)
  chemotypes: text("chemotypes"), // Chémotypes disponibles (ex: Lippia alba citral vs carvone)
  // Axe climatique Absorbe
  climaticAxis: mysqlEnum("climatic_axis", [
    "vent",
    "bois",
    "disparition",
    "vent_bois",
    "bois_disparition",
    "vent_disparition"
  ]),
  // Usage
  traditionalUse: text("traditional_use"), // Usage traditionnel
  absorbeUse: text("absorbe_use"), // Usage dans le système Absorbe
  // États botaniques
  botanicalStates: json("botanical_states").$type<{
    state: string; // A, B, C, D
    name: string; // "Feuille verte vivante", "Feuille jaune", etc.
    odor: string; // Description olfactive
    molecules: string[]; // Molécules dominantes
    usage: string; // Usage recommandé
  }[]>(),
  // Conservation (IUCN, CITES, menaces)
  conservationStatus: mysqlEnum("conservation_status", [
    "EX",  // Extinct
    "EW",  // Extinct in the Wild
    "CR",  // Critically Endangered
    "EN",  // Endangered
    "VU",  // Vulnerable
    "NT",  // Near Threatened
    "LC",  // Least Concern
    "DD",  // Data Deficient
    "NE"   // Not Evaluated
  ]),
  citesAppendix: mysqlEnum("cites_appendix", [
    "I",       // Commerce international généralement interdit
    "II",      // Commerce strictement régulé
    "III",     // Commerce régulé à la demande d'un pays
    "NONE",    // Non listé
    "UNKNOWN"  // Information manquante
  ]),
  conservationNotes: text("conservation_notes"), // Notes sur le statut de conservation
  threatFactors: json("threat_factors").$type<{
    overharvesting?: boolean;
    habitat_loss?: boolean;
    climate_change?: boolean;
    illegal_trade?: boolean;
  }>(), // Facteurs de menace
  sustainableAlternatives: text("sustainable_alternatives"), // Alternatives durables
  lastAssessmentYear: int("last_assessment_year"), // Année de la dernière évaluation IUCN
  historicalStatus: varchar("historical_status", { length: 32 }), // Statut historique si changé
  // Métadonnées
  notes: text("notes"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = typeof plants.$inferInsert;

// ============================================================================
// TERP PROFILES (Fiches interactives San Andrés)
// ============================================================================

export const terpProfiles = mysqlTable("terp_profiles", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  profileId: varchar("profile_id", { length: 20 }).notNull().unique(), // SA-TP-01, SA-TP-02, etc.
  name: varchar("name", { length: 255 }).notNull(), // "Wind Cut / Citral Structure"
  collection: varchar("collection", { length: 100 }).default("San Andrés · Leaf Economies"),
  type: varchar("type", { length: 100 }).default("Formule analytique"),
  // Axe climatique
  climaticAxis: mysqlEnum("climatic_axis", [
    "vent",
    "bois",
    "disparition",
    "vent_bois",
    "bois_disparition",
    "vent_disparition",
    "vent_bois_disparition"
  ]).notNull(),
  secondaryAxis: mysqlEnum("secondary_axis", [
    "vent",
    "bois",
    "disparition",
    "none"
  ]).default("none"),
  // Fonction et usage
  function: text("function"), // "Coupe aérienne", "Structure sèche", etc.
  usage: mysqlEnum("usage", [
    "parfum",
    "encens",
    "espace",
    "parfum_encens",
    "parfum_espace",
    "encens_espace",
    "tous"
  ]).default("parfum"),
  level: varchar("level", { length: 50 }).default("Recherche"),
  // Plantes sources (relation many-to-many via terpProfilePlants)
  plantSources: text("plant_sources"), // JSON array pour affichage rapide
  // Molécules clés (relation many-to-many via terpProfileMolecules)
  keyMolecules: text("key_molecules"), // JSON array pour affichage rapide
  // Concentré (formule)
  concentrate: json("concentrate").$type<{
    ingredient: string;
    percentage: number;
  }[]>(),
  // Lecture olfactive
  olfactiveReading: text("olfactive_reading"),
  // Temporalité
  temporality: mysqlEnum("temporality", [
    "rapide",
    "moyenne",
    "longue",
    "tres_courte",
    "variable"
  ]).default("moyenne"),
  temporalityDescription: text("temporality_description"), // "Entrée rapide. Plateau court. Sortie nette."
  // Usages recommandés
  recommendedUsage: text("recommended_usage"), // "Parfum ≤ 8 %, Espace ≤ 2 %"
  // Notes critiques
  criticalNotes: text("critical_notes"),
  // Connexions
  connections: json("connections").$type<{
    type: "compare" | "complete";
    profileId: string;
    name: string;
  }[]>(),
  // Propriétés comparatives (Point 2)
  intensity: mysqlEnum("intensity", ["faible", "moyenne", "structurelle"]).default("moyenne"),
  readability: mysqlEnum("readability", ["abstrait", "lisible", "structure"]).default("lisible"),
  nonIdentifiable: int("non_identifiable").default(0), // 0 = false, 1 = true
  // Radar climatique (0-100)
  radarVent: int("radar_vent").default(50),
  radarBois: int("radar_bois").default(50),
  radarDisparition: int("radar_disparition").default(50),
  radarStructure: int("radar_structure").default(50),
  radarDiffusion: int("radar_diffusion").default(50),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TerpProfile = typeof terpProfiles.$inferSelect;
export type InsertTerpProfile = typeof terpProfiles.$inferInsert;

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
// RELATIONS: TerpProfiles <-> Plants (Many-to-Many)
// ============================================================================

export const terpProfilePlants = mysqlTable("terp_profile_plants", {
  terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id),
  plantId: int("plant_id").notNull().references(() => plants.id),
  notes: text("notes"),
});

// ============================================================================
// RELATIONS: TerpProfiles <-> Molecules (Many-to-Many)
// ============================================================================

export const terpProfileMolecules = mysqlTable("terp_profile_molecules", {
  terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
});

// ============================================================================
// RELATIONS: Plants <-> Molecules (Many-to-Many)
// ============================================================================

export const plantMolecules = mysqlTable("plant_molecules", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plant_id").notNull().references(() => plants.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  // Pourcentages de composition (ex: linalol 25-45% dans la lavande)
  percentageMin: decimal("percentage_min", { precision: 5, scale: 2 }), // Pourcentage minimum
  percentageMax: decimal("percentage_max", { precision: 5, scale: 2 }), // Pourcentage maximum
  percentageTypical: decimal("percentage_typical", { precision: 5, scale: 2 }), // Pourcentage typique/moyen
  // Classification
  isSignature: int("is_signature").default(0), // 1 = molécule signature de la plante
  role: mysqlEnum("role", [
    "majeur",      // Composant principal (>10%)
    "secondaire",  // Composant secondaire (1-10%)
    "trace",       // Trace (<1%)
    "variable"     // Variable selon chémotype/conditions
  ]),
  // Variabilité
  variabilityFactor: mysqlEnum("variability_factor", [
    "stable",      // Peu de variation
    "saisonnier",  // Varie selon la saison
    "geographique", // Varie selon l'origine
    "chemotype",   // Varie selon le chémotype
    "extraction"   // Varie selon la méthode d'extraction
  ]),
  // Source de l'information
  source: varchar("source", { length: 255 }), // Référence bibliographique
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniquePlantMolecule: uniqueIndex("unique_plant_molecule").on(table.plantId, table.moleculeId),
}));

// ============================================================================
// RELATIONS: FinalRecipes <-> TerpProfiles (Many-to-Many)
// ============================================================================

export const finalRecipeTerpProfiles = mysqlTable("final_recipe_terp_profiles", {
  finalRecipeId: int("final_recipe_id").notNull().references(() => finalRecipes.id),
  terpProfileId: int("terp_profile_id").notNull().references(() => terpProfiles.id),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
});

// ============================================================================
// DRIZZLE RELATIONS
// ============================================================================

export const plantsRelations = relations(plants, ({ many }) => ({
  terpProfiles: many(terpProfilePlants),
  molecules: many(plantMolecules),
}));

export const terpProfilesRelations = relations(terpProfiles, ({ many }) => ({
  plants: many(terpProfilePlants),
  molecules: many(terpProfileMolecules),
  finalRecipes: many(finalRecipeTerpProfiles),
}));

export const finalRecipesRelations = relations(finalRecipes, ({ many }) => ({
  terpProfiles: many(finalRecipeTerpProfiles),
}));

export const terpProfilePlantsRelations = relations(terpProfilePlants, ({ one }) => ({
  terpProfile: one(terpProfiles, {
    fields: [terpProfilePlants.terpProfileId],
    references: [terpProfiles.id],
  }),
  plant: one(plants, {
    fields: [terpProfilePlants.plantId],
    references: [plants.id],
  }),
}));

export const terpProfileMoleculesRelations = relations(terpProfileMolecules, ({ one }) => ({
  terpProfile: one(terpProfiles, {
    fields: [terpProfileMolecules.terpProfileId],
    references: [terpProfiles.id],
  }),
  molecule: one(molecules, {
    fields: [terpProfileMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const plantMoleculesRelations = relations(plantMolecules, ({ one }) => ({
  plant: one(plants, {
    fields: [plantMolecules.plantId],
    references: [plants.id],
  }),
  molecule: one(molecules, {
    fields: [plantMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const finalRecipeTerpProfilesRelations = relations(finalRecipeTerpProfiles, ({ one }) => ({
  finalRecipe: one(finalRecipes, {
    fields: [finalRecipeTerpProfiles.finalRecipeId],
    references: [finalRecipes.id],
  }),
  terpProfile: one(terpProfiles, {
    fields: [finalRecipeTerpProfiles.terpProfileId],
    references: [terpProfiles.id],
  }),
}));


// ============================================================================
// POINT 3 ÉTENDU - ARCHITECTURE BOTANIQUE AVANCÉE
// ============================================================================

// ============================================================================
// PLANT VARIETIES (Variétés, cultivars, chémotypes, clones)
// ============================================================================

export const plantVarieties = mysqlTable("plant_varieties", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  varietyId: varchar("variety_id", { length: 30 }).notNull().unique(), // PV-001, PV-002, etc.
  plantId: int("plant_id").notNull(), // Référence à la plante parente
  name: varchar("name", { length: 255 }).notNull(), // Nom de la variété
  latinName: varchar("latin_name", { length: 255 }), // Nom latin complet avec var./cv.
  // Type de variété
  varietyType: mysqlEnum("variety_type", [
    "cultivar",      // Variété cultivée sélectionnée
    "chemotype",     // Chémotype (profil moléculaire distinct)
    "landrace",      // Variété locale traditionnelle
    "hybrid",        // Hybride
    "clone",         // Clone végétatif
    "wild",          // Forme sauvage
    "other"
  ]).notNull(),
  // Sélection et origine
  breeder: varchar("breeder", { length: 255 }), // Obtenteur/sélectionneur
  yearRegistered: int("year_registered"), // Année d'enregistrement
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),
  parentVarieties: json("parent_varieties").$type<string[]>(), // Variétés parentes (pour hybrides)
  // Caractéristiques distinctives
  distinctiveFeatures: text("distinctive_features"), // Ce qui distingue cette variété
  morphology: json("morphology").$type<{
    height?: string;
    leafShape?: string;
    flowerColor?: string;
    growthHabit?: string;
  }>(),
  // Profil moléculaire
  dominantMolecules: json("dominant_molecules").$type<{
    molecule: string;
    percentage: number;
    role: string;
  }[]>(),
  molecularProfile: json("molecular_profile").$type<{
    molecule: string;
    minPercent: number;
    maxPercent: number;
    typical: number;
  }[]>(),
  // Olfactif
  olfactiveDescription: text("olfactive_description"),
  olfactiveNotes: json("olfactive_notes").$type<{
    top: string[];
    heart: string[];
    base: string[];
  }>(),
  // Agronomie
  yieldPerHectare: varchar("yield_per_hectare", { length: 50 }), // kg/ha
  essentialOilYield: varchar("essential_oil_yield", { length: 50 }), // % rendement HE
  harvestPeriod: varchar("harvest_period", { length: 100 }), // Période de récolte
  optimalHarvestStage: varchar("optimal_harvest_stage", { length: 100 }),
  // Disponibilité
  commercialAvailability: mysqlEnum("commercial_availability", [
    "widely_available",
    "limited",
    "rare",
    "research_only",
    "extinct",
    "unknown"
  ]).default("unknown"),
  suppliers: json("suppliers").$type<string[]>(), // Liste des fournisseurs connus
  // Statut de conservation (UICN-like)
  conservationStatus: mysqlEnum("conservation_status", [
    "critical",       // En danger critique d'extinction
    "endangered",     // En danger
    "vulnerable",     // Vulnérable
    "near_threatened", // Quasi menacé
    "stable",         // Préoccupation mineure / Stable
    "data_deficient", // Données insuffisantes
    "unknown"         // Statut inconnu
  ]).default("unknown"),
  conservationNotes: text("conservation_notes"), // Notes sur la conservation
  threatFactors: json("threat_factors").$type<string[]>(), // Facteurs de menace
  conservationEfforts: text("conservation_efforts"), // Efforts de conservation en cours
  lastAssessmentDate: timestamp("last_assessment_date"), // Date de la dernière évaluation
  // Métadonnées
  notes: text("notes"),
  references: json("references").$type<{
    title: string;
    author?: string;
    year?: number;
    url?: string;
  }[]>(),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PlantVariety = typeof plantVarieties.$inferSelect;
export type InsertPlantVariety = typeof plantVarieties.$inferInsert;

// ============================================================================
// TERROIRS (Zones de production et terroirs)
// ============================================================================

export const terroirs = mysqlTable("terroirs", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  terroirId: varchar("terroir_id", { length: 30 }).notNull().unique(), // TER-001, TER-002, etc.
  name: varchar("name", { length: 255 }).notNull(), // "Grasse, France", "Calabre, Italie"
  // Localisation
  country: varchar("country", { length: 100 }).notNull(),
  region: varchar("region", { length: 255 }),
  subRegion: varchar("sub_region", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  altitude: varchar("altitude", { length: 50 }), // "200-800m"
  // Climat
  climateType: mysqlEnum("climate_type", [
    "tropical",
    "subtropical",
    "mediterranean",
    "oceanic",
    "continental",
    "arid",
    "semi_arid",
    "alpine",
    "equatorial",
    "other"
  ]),
  avgTemperature: varchar("avg_temperature", { length: 50 }), // "15-25°C"
  annualRainfall: varchar("annual_rainfall", { length: 50 }), // "600-800mm"
  humidity: varchar("humidity", { length: 50 }), // "60-80%"
  // Sol
  soilType: mysqlEnum("soil_type", [
    "clay",
    "sandy",
    "loamy",
    "chalky",
    "volcanic",
    "alluvial",
    "peaty",
    "rocky",
    "mixed",
    "other"
  ]),
  soilPh: varchar("soil_ph", { length: 20 }), // "6.5-7.5"
  soilCharacteristics: text("soil_characteristics"),
  // Production
  mainCrops: json("main_crops").$type<string[]>(), // Plantes principales cultivées
  productionHistory: text("production_history"), // Histoire de la production
  annualProduction: varchar("annual_production", { length: 100 }), // Volume estimé
  // Certifications et labels
  certifications: json("certifications").$type<{
    name: string;
    type: "AOP" | "IGP" | "Bio" | "Demeter" | "Other";
    year?: number;
  }[]>(),
  // Qualité et réputation
  qualityRating: mysqlEnum("quality_rating", [
    "exceptional",
    "excellent",
    "good",
    "standard",
    "variable",
    "unknown"
  ]).default("unknown"),
  reputation: text("reputation"), // Réputation du terroir
  // Métadonnées
  notes: text("notes"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Terroir = typeof terroirs.$inferSelect;
export type InsertTerroir = typeof terroirs.$inferInsert;

// ============================================================================
// EXTRACTION METHODS (Méthodes d'extraction)
// ============================================================================

export const extractionMethods = mysqlTable("extraction_methods", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  methodId: varchar("method_id", { length: 30 }).notNull().unique(), // EXT-001, EXT-002, etc.
  name: varchar("name", { length: 255 }).notNull(), // "Distillation à la vapeur"
  shortName: varchar("short_name", { length: 50 }), // "Steam distillation"
  // Type de méthode
  category: mysqlEnum("category", [
    "distillation",
    "expression",
    "extraction_solvant",
    "co2_supercritique",
    "enfleurage",
    "maceration",
    "hydrodistillation",
    "percolation",
    "other"
  ]).notNull(),
  // Description
  description: text("description"),
  principle: text("principle"), // Principe physico-chimique
  // Paramètres techniques
  parameters: json("parameters").$type<{
    temperature?: { min: number; max: number; unit: string };
    pressure?: { min: number; max: number; unit: string };
    duration?: { min: number; max: number; unit: string };
    solvent?: string;
    ratio?: string; // Ratio plante/solvant
  }>(),
  // Équipement
  equipment: json("equipment").$type<string[]>(),
  // Rendements typiques
  typicalYields: json("typical_yields").$type<{
    plant: string;
    yieldPercent: number;
    notes?: string;
  }[]>(),
  // Profil moléculaire
  molecularImpact: text("molecular_impact"), // Impact sur le profil moléculaire
  preservedMolecules: json("preserved_molecules").$type<string[]>(), // Molécules bien préservées
  degradedMolecules: json("degraded_molecules").$type<string[]>(), // Molécules dégradées
  // Avantages et inconvénients
  advantages: json("advantages").$type<string[]>(),
  disadvantages: json("disadvantages").$type<string[]>(),
  // Applications
  bestFor: json("best_for").$type<string[]>(), // Types de plantes/matières
  notRecommendedFor: json("not_recommended_for").$type<string[]>(),
  // Coût et complexité
  costLevel: mysqlEnum("cost_level", [
    "low",
    "medium",
    "high",
    "very_high"
  ]).default("medium"),
  complexityLevel: mysqlEnum("complexity_level", [
    "simple",
    "moderate",
    "complex",
    "expert"
  ]).default("moderate"),
  // Métadonnées
  notes: text("notes"),
  references: json("references").$type<{
    title: string;
    author?: string;
    year?: number;
    url?: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtractionMethod = typeof extractionMethods.$inferSelect;
export type InsertExtractionMethod = typeof extractionMethods.$inferInsert;

// ============================================================================
// PLANT ANALYSES (Analyses GC-MS et profils moléculaires)
// ============================================================================

export const plantAnalyses = mysqlTable("plant_analyses", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  analysisId: varchar("analysis_id", { length: 30 }).notNull().unique(), // ANA-001, ANA-002, etc.
  // Références
  plantId: int("plant_id"), // Plante analysée
  varietyId: int("variety_id"), // Variété spécifique (optionnel)
  sampleId: int("sample_id"), // Échantillon (optionnel)
  // Informations sur l'analyse
  analysisDate: timestamp("analysis_date"),
  laboratory: varchar("laboratory", { length: 255 }),
  analyst: varchar("analyst", { length: 255 }),
  method: mysqlEnum("method", [
    "gc_ms",
    "gc_fid",
    "hplc",
    "nmr",
    "ir",
    "other"
  ]).default("gc_ms"),
  // Conditions d'analyse
  conditions: json("conditions").$type<{
    column?: string;
    temperature?: string;
    carrier_gas?: string;
    injection_volume?: string;
    split_ratio?: string;
  }>(),
  // Résultats - Profil moléculaire complet
  molecularProfile: json("molecular_profile").$type<{
    molecule: string;
    casNumber?: string;
    percentage: number;
    retentionTime?: number;
    identificationMethod?: string;
    confidence?: "high" | "medium" | "low";
  }[]>(),
  // Résumé
  totalCompoundsIdentified: int("total_compounds_identified"),
  majorCompounds: json("major_compounds").$type<{
    molecule: string;
    percentage: number;
  }[]>(), // Composés > 5%
  // Classification olfactive
  olfactiveClassification: json("olfactive_classification").$type<{
    family: string;
    percentage: number;
  }[]>(), // Ex: "terpènes": 45%, "alcools": 30%
  // Qualité de l'analyse
  qualityScore: mysqlEnum("quality_score", [
    "excellent",
    "good",
    "acceptable",
    "poor",
    "invalid"
  ]).default("good"),
  qualityNotes: text("quality_notes"),
  // Fichiers
  rawDataUrl: varchar("raw_data_url", { length: 500 }), // Fichier brut GC-MS
  reportUrl: varchar("report_url", { length: 500 }), // Rapport PDF
  chromatogramUrl: varchar("chromatogram_url", { length: 500 }), // Image chromatogramme
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PlantAnalysis = typeof plantAnalyses.$inferSelect;
export type InsertPlantAnalysis = typeof plantAnalyses.$inferInsert;

// ============================================================================
// PLANT SAMPLES (Échantillons et lots)
// ============================================================================

export const plantSamples = mysqlTable("plant_samples", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  sampleId: varchar("sample_id", { length: 30 }).notNull().unique(), // SAM-001, SAM-002, etc.
  batchNumber: varchar("batch_number", { length: 50 }), // Numéro de lot
  // Références
  plantId: int("plant_id").notNull(),
  varietyId: int("variety_id"),
  terroirId: int("terroir_id"),
  supplierId: int("supplier_id"),
  // Traçabilité
  harvestDate: timestamp("harvest_date"),
  harvestYear: int("harvest_year"),
  harvestLocation: varchar("harvest_location", { length: 255 }),
  harvestMethod: varchar("harvest_method", { length: 100 }),
  plantPart: mysqlEnum("plant_part", [
    "feuille",
    "fleur",
    "fruit",
    "graine",
    "racine",
    "ecorce",
    "bois",
    "resine",
    "plante_entiere",
    "autre"
  ]).default("feuille"),
  botanicalState: varchar("botanical_state", { length: 50 }), // A, B, C, D
  // Traitement
  processingMethod: varchar("processing_method", { length: 255 }), // Séchage, fermentation, etc.
  processingDate: timestamp("processing_date"),
  extractionMethodId: int("extraction_method_id"),
  // Quantité et stockage
  initialQuantity: varchar("initial_quantity", { length: 50 }), // "500g", "2L"
  currentQuantity: varchar("current_quantity", { length: 50 }),
  unit: varchar("unit", { length: 20 }), // g, kg, mL, L
  storageLocation: varchar("storage_location", { length: 255 }),
  storageConditions: json("storage_conditions").$type<{
    temperature?: string;
    humidity?: string;
    light?: string;
    container?: string;
  }>(),
  expirationDate: timestamp("expiration_date"),
  // Qualité
  qualityGrade: mysqlEnum("quality_grade", [
    "premium",
    "standard",
    "economy",
    "research",
    "expired",
    "unknown"
  ]).default("unknown"),
  qualityNotes: text("quality_notes"),
  // Certifications
  certifications: json("certifications").$type<{
    name: string;
    number?: string;
    validUntil?: string;
  }[]>(),
  // Coût
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  // Statut
  status: mysqlEnum("status", [
    "available",
    "reserved",
    "in_use",
    "depleted",
    "expired",
    "disposed"
  ]).default("available"),
  // Métadonnées
  notes: text("notes"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PlantSample = typeof plantSamples.$inferSelect;
export type InsertPlantSample = typeof plantSamples.$inferInsert;

// ============================================================================
// EXTENDED SUPPLIERS (Fournisseurs détaillés)
// ============================================================================

export const extendedSuppliers = mysqlTable("extended_suppliers", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  supplierId: varchar("supplier_id", { length: 30 }).notNull().unique(), // SUP-001, SUP-002, etc.
  name: varchar("name", { length: 255 }).notNull(),
  legalName: varchar("legal_name", { length: 255 }),
  // Type
  supplierType: mysqlEnum("supplier_type", [
    "producer",       // Producteur direct
    "distiller",      // Distillateur
    "trader",         // Négociant
    "cooperative",    // Coopérative
    "laboratory",     // Laboratoire
    "broker",         // Courtier
    "other"
  ]).notNull(),
  // Contact
  country: varchar("country", { length: 100 }),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  // Spécialités
  specialties: json("specialties").$type<string[]>(), // Types de plantes/produits
  mainProducts: json("main_products").$type<{
    product: string;
    quality?: string;
    availability?: string;
  }[]>(),
  // Certifications
  certifications: json("certifications").$type<{
    name: string;
    number?: string;
    validUntil?: string;
    scope?: string;
  }[]>(),
  // Conditions commerciales
  minimumOrder: varchar("minimum_order", { length: 100 }),
  leadTime: varchar("lead_time", { length: 100 }), // Délai de livraison
  paymentTerms: varchar("payment_terms", { length: 255 }),
  shippingMethods: json("shipping_methods").$type<string[]>(),
  // Évaluation
  qualityRating: mysqlEnum("quality_rating", [
    "excellent",
    "good",
    "acceptable",
    "poor",
    "not_rated"
  ]).default("not_rated"),
  reliabilityRating: mysqlEnum("reliability_rating", [
    "excellent",
    "good",
    "acceptable",
    "poor",
    "not_rated"
  ]).default("not_rated"),
  priceRating: mysqlEnum("price_rating", [
    "premium",
    "competitive",
    "standard",
    "budget",
    "not_rated"
  ]).default("not_rated"),
  // Historique
  firstOrderDate: timestamp("first_order_date"),
  lastOrderDate: timestamp("last_order_date"),
  totalOrders: int("total_orders").default(0),
  // Statut
  status: mysqlEnum("status", [
    "active",
    "inactive",
    "blacklisted",
    "prospect"
  ]).default("active"),
  // Métadonnées
  notes: text("notes"),
  internalNotes: text("internal_notes"), // Notes internes confidentielles
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtendedSupplier = typeof extendedSuppliers.$inferSelect;
export type InsertExtendedSupplier = typeof extendedSuppliers.$inferInsert;

// ============================================================================
// PLANT-TERROIR RELATIONS (Plantes par terroir)
// ============================================================================

export const plantTerroirs = mysqlTable("plant_terroirs", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plant_id").notNull(),
  terroirId: int("terroir_id").notNull(),
  // Spécificités
  localName: varchar("local_name", { length: 255 }), // Nom local
  cultivationStart: int("cultivation_start"), // Année de début de culture
  annualProduction: varchar("annual_production", { length: 100 }),
  qualityNotes: text("quality_notes"), // Particularités qualitatives
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniquePlantTerroir: uniqueIndex("unique_plant_terroir").on(table.plantId, table.terroirId),
}));

export type PlantTerroir = typeof plantTerroirs.$inferSelect;
export type InsertPlantTerroir = typeof plantTerroirs.$inferInsert;

// ============================================================================
// PLANT-EXTRACTION RELATIONS (Méthodes d'extraction par plante)
// ============================================================================

export const plantExtractions = mysqlTable("plant_extractions", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plant_id").notNull(),
  extractionMethodId: int("extraction_method_id").notNull(),
  // Spécificités
  plantPart: varchar("plant_part", { length: 100 }), // Partie de la plante
  yieldPercent: decimal("yield_percent", { precision: 5, scale: 3 }), // Rendement %
  yieldNotes: text("yield_notes"),
  // Qualité du produit
  productType: varchar("product_type", { length: 100 }), // HE, absolue, concrète, etc.
  productQuality: text("product_quality"),
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniquePlantExtraction: uniqueIndex("unique_plant_extraction").on(table.plantId, table.extractionMethodId),
}));

export type PlantExtraction = typeof plantExtractions.$inferSelect;
export type InsertPlantExtraction = typeof plantExtractions.$inferInsert;

// ============================================================================
// EXTENDED SUPPLIER MATERIALS (Matières par fournisseur - Point 3 étendu)
// ============================================================================

export const extendedSupplierMaterials = mysqlTable("extended_supplier_materials", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplier_id").notNull(),
  plantId: int("plant_id"),
  varietyId: int("variety_id"),
  terroirId: int("terroir_id"),
  // Produit
  productName: varchar("product_name", { length: 255 }).notNull(),
  productType: varchar("product_type", { length: 100 }), // HE, absolue, concrète, etc.
  // Prix
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  priceDate: timestamp("price_date"),
  // Disponibilité
  availability: mysqlEnum("availability", [
    "in_stock",
    "on_order",
    "seasonal",
    "limited",
    "discontinued",
    "unknown"
  ]).default("unknown"),
  minimumQuantity: varchar("minimum_quantity", { length: 50 }),
  // Qualité
  qualityGrade: varchar("quality_grade", { length: 50 }),
  certifications: json("certifications").$type<string[]>(),
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ExtendedSupplierMaterial = typeof extendedSupplierMaterials.$inferSelect;
export type InsertExtendedSupplierMaterial = typeof extendedSupplierMaterials.$inferInsert;

// ============================================================================
// RELATIONS POUR POINT 3 ÉTENDU
// ============================================================================

export const plantVarietiesRelations = relations(plantVarieties, ({ one, many }) => ({
  plant: one(plants, {
    fields: [plantVarieties.plantId],
    references: [plants.id],
  }),
  samples: many(plantSamples),
  analyses: many(plantAnalyses),
}));

export const terroirsRelations = relations(terroirs, ({ many }) => ({
  plantTerroirs: many(plantTerroirs),
  samples: many(plantSamples),
}));

export const extractionMethodsRelations = relations(extractionMethods, ({ many }) => ({
  plantExtractions: many(plantExtractions),
  samples: many(plantSamples),
}));

export const plantAnalysesRelations = relations(plantAnalyses, ({ one }) => ({
  plant: one(plants, {
    fields: [plantAnalyses.plantId],
    references: [plants.id],
  }),
  variety: one(plantVarieties, {
    fields: [plantAnalyses.varietyId],
    references: [plantVarieties.id],
  }),
  sample: one(plantSamples, {
    fields: [plantAnalyses.sampleId],
    references: [plantSamples.id],
  }),
}));

export const plantSamplesRelations = relations(plantSamples, ({ one, many }) => ({
  plant: one(plants, {
    fields: [plantSamples.plantId],
    references: [plants.id],
  }),
  variety: one(plantVarieties, {
    fields: [plantSamples.varietyId],
    references: [plantVarieties.id],
  }),
  terroir: one(terroirs, {
    fields: [plantSamples.terroirId],
    references: [terroirs.id],
  }),
  supplier: one(extendedSuppliers, {
    fields: [plantSamples.supplierId],
    references: [extendedSuppliers.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [plantSamples.extractionMethodId],
    references: [extractionMethods.id],
  }),
  analyses: many(plantAnalyses),
}));

export const extendedSuppliersRelations = relations(extendedSuppliers, ({ many }) => ({
  samples: many(plantSamples),
  materials: many(extendedSupplierMaterials),
}));

export const plantTerroirsRelations = relations(plantTerroirs, ({ one }) => ({
  plant: one(plants, {
    fields: [plantTerroirs.plantId],
    references: [plants.id],
  }),
  terroir: one(terroirs, {
    fields: [plantTerroirs.terroirId],
    references: [terroirs.id],
  }),
}));

export const plantExtractionsRelations = relations(plantExtractions, ({ one }) => ({
  plant: one(plants, {
    fields: [plantExtractions.plantId],
    references: [plants.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [plantExtractions.extractionMethodId],
    references: [extractionMethods.id],
  }),
}));

export const extendedSupplierMaterialsRelations = relations(extendedSupplierMaterials, ({ one }) => ({
  supplier: one(extendedSuppliers, {
    fields: [extendedSupplierMaterials.supplierId],
    references: [extendedSuppliers.id],
  }),
  plant: one(plants, {
    fields: [extendedSupplierMaterials.plantId],
    references: [plants.id],
  }),
  variety: one(plantVarieties, {
    fields: [extendedSupplierMaterials.varietyId],
    references: [plantVarieties.id],
  }),
  terroir: one(terroirs, {
    fields: [extendedSupplierMaterials.terroirId],
    references: [terroirs.id],
  }),
}));


// ============================================================================
// BOTANICAL STATES (États botaniques / Stades de développement)
// ============================================================================

export const botanicalStates = mysqlTable("botanical_states", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  stateId: varchar("state_id", { length: 30 }).notNull().unique(), // BS-001, BS-002, etc.
  plantId: int("plant_id").notNull().references(() => plants.id),
  // Stade de développement
  stageName: varchar("stage_name", { length: 100 }).notNull(), // "Germination", "Végétatif", "Floraison", etc.
  stageCode: varchar("stage_code", { length: 10 }), // "A", "B", "C", "D" ou "G", "V", "F", "FR", "S"
  stageOrder: int("stage_order").notNull(), // Ordre dans le cycle de vie (1, 2, 3...)
  stageType: mysqlEnum("stage_type", [
    "germination",
    "vegetatif",
    "floraison",
    "fructification",
    "senescence",
    "dormance",
    "autre"
  ]).notNull(),
  // Description
  description: text("description"), // Description détaillée du stade
  visualCharacteristics: text("visual_characteristics"), // Caractéristiques visuelles
  duration: varchar("duration", { length: 100 }), // Durée typique (ex: "2-4 semaines", "30-45 jours")
  // Conditions de transition
  transitionConditions: json("transition_conditions").$type<{
    temperature?: string;
    humidity?: string;
    photoperiod?: string;
    triggers?: string[];
    notes?: string;
  }>(),
  // Profil olfactif
  olfactiveProfile: text("olfactive_profile"), // Description olfactive à ce stade
  dominantNotes: json("dominant_notes").$type<string[]>(), // Notes olfactives dominantes
  // Profil moléculaire
  molecularProfile: json("molecular_profile").$type<{
    molecule: string;
    percentage: number;
    notes?: string;
  }[]>(),
  // Usage recommandé
  recommendedUse: json("recommended_use").$type<{
    parfum?: boolean;
    encens?: boolean;
    espace?: boolean;
    notes?: string;
  }>(),
  harvestRecommendation: text("harvest_recommendation"), // Recommandations de récolte à ce stade
  // Métadonnées
  imageUrl: varchar("image_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BotanicalState = typeof botanicalStates.$inferSelect;
export type InsertBotanicalState = typeof botanicalStates.$inferInsert;

// Relations pour botanical_states
export const botanicalStatesRelations = relations(botanicalStates, ({ one }) => ({
  plant: one(plants, {
    fields: [botanicalStates.plantId],
    references: [plants.id],
  }),
}));


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
// TERROIR SPECIALTIES (Spécialités par terroir - quelles plantes/matières)
// ============================================================================

export const terroirSpecialties = mysqlTable("terroir_specialties", {
  id: int("id").autoincrement().primaryKey(),
  terroirId: int("terroir_id").notNull().references(() => terroirs.id),
  plantId: int("plant_id").references(() => plants.id),
  rawMaterialId: int("raw_material_id").references(() => rawMaterials.id),
  // Importance
  isSignature: int("is_signature").default(0), // 1 = spécialité signature du terroir
  importance: mysqlEnum("importance", [
    "majeure",
    "significative",
    "mineure",
    "emergente"
  ]),
  // Production
  annualProduction: varchar("annual_production", { length: 100 }), // "50-100 tonnes"
  productionTrend: mysqlEnum("production_trend", [
    "croissante",
    "stable",
    "decroissante",
    "variable"
  ]),
  // Qualité
  qualityReputation: mysqlEnum("quality_reputation", [
    "exceptionnelle",
    "excellente",
    "bonne",
    "standard"
  ]),
  uniqueCharacteristics: text("unique_characteristics"), // Ce qui rend cette production unique
  // Histoire
  historicalContext: text("historical_context"),
  traditionSince: varchar("tradition_since", { length: 50 }), // "XVIIe siècle", "1920"
  // Économie
  economicImportance: text("economic_importance"),
  mainBuyers: json("main_buyers").$type<string[]>(),
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TerroirSpecialty = typeof terroirSpecialties.$inferSelect;
export type InsertTerroirSpecialty = typeof terroirSpecialties.$inferInsert;

// ============================================================================
// RELATIONS pour les nouvelles tables
// ============================================================================

export const rawMaterialsRelations = relations(rawMaterials, ({ one, many }) => ({
  plant: one(plants, {
    fields: [rawMaterials.plantId],
    references: [plants.id],
  }),
  terroir: one(terroirs, {
    fields: [rawMaterials.terroirId],
    references: [terroirs.id],
  }),
  extractionMethod: one(extractionMethods, {
    fields: [rawMaterials.extractionMethodId],
    references: [extractionMethods.id],
  }),
  molecules: many(rawMaterialMolecules),
}));

export const rawMaterialMoleculesRelations = relations(rawMaterialMolecules, ({ one }) => ({
  rawMaterial: one(rawMaterials, {
    fields: [rawMaterialMolecules.rawMaterialId],
    references: [rawMaterials.id],
  }),
  molecule: one(molecules, {
    fields: [rawMaterialMolecules.moleculeId],
    references: [molecules.id],
  }),
}));

export const moleculePlantSourcesRelations = relations(moleculePlantSources, ({ one }) => ({
  molecule: one(molecules, {
    fields: [moleculePlantSources.moleculeId],
    references: [molecules.id],
  }),
  plant: one(plants, {
    fields: [moleculePlantSources.plantId],
    references: [plants.id],
  }),
}));

export const terroirSpecialtiesRelations = relations(terroirSpecialties, ({ one }) => ({
  terroir: one(terroirs, {
    fields: [terroirSpecialties.terroirId],
    references: [terroirs.id],
  }),
  plant: one(plants, {
    fields: [terroirSpecialties.plantId],
    references: [plants.id],
  }),
  rawMaterial: one(rawMaterials, {
    fields: [terroirSpecialties.rawMaterialId],
    references: [rawMaterials.id],
  }),
}));


// ============================================================================
// CHEMOTYPES (Variations chimiques au sein d'une même espèce)
// ============================================================================

export const chemotypes = mysqlTable("chemotypes", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  name: varchar("name", { length: 255 }).notNull(), // Ex: "Thym à thymol", "Thym à linalol"
  code: varchar("code", { length: 50 }), // Ex: "CT-THYM-THYMOL", "CT-ROS-CAMPH"
  // Plante parente
  plantId: int("plant_id"), // Référence à la plante parente
  plantName: varchar("plant_name", { length: 255 }).notNull(), // Nom de la plante (ex: "Thym")
  latinName: varchar("latin_name", { length: 255 }), // Nom latin complet (ex: "Thymus vulgaris ct. thymol")
  // Molécule dominante
  dominantMoleculeId: int("dominant_molecule_id"), // Référence à la molécule dominante
  dominantMoleculeName: varchar("dominant_molecule_name", { length: 255 }).notNull(), // Ex: "Thymol", "Linalol"
  dominantPercentage: decimal("dominant_percentage", { precision: 5, scale: 2 }), // Ex: 30-50%
  dominantPercentageMin: int("dominant_percentage_min"), // Pourcentage minimum
  dominantPercentageMax: int("dominant_percentage_max"), // Pourcentage maximum
  // Molécules secondaires
  secondaryMolecules: json("secondary_molecules").$type<{
    name: string;
    percentage?: string;
    percentageMin?: number;
    percentageMax?: number;
  }[]>(),
  // Origine géographique
  origin: varchar("origin", { length: 255 }), // Ex: "Provence, France"
  terroir: text("terroir"), // Description du terroir favorable
  altitude: varchar("altitude", { length: 100 }), // Ex: "300-1200m"
  climate: varchar("climate", { length: 255 }), // Ex: "Méditerranéen sec"
  // Profil olfactif
  olfactiveProfile: text("olfactive_profile"), // Description olfactive détaillée
  olfactiveNotes: json("olfactive_notes").$type<{
    top: string[];
    heart: string[];
    base: string[];
  }>(),
  intensity: int("intensity"), // 1-10
  // Propriétés
  therapeuticProperties: text("therapeutic_properties"), // Propriétés thérapeutiques
  contraindications: text("contraindications"), // Contre-indications
  toxicity: mysqlEnum("toxicity", ["faible", "modérée", "élevée"]),
  // Usage en parfumerie
  perfumeryUse: text("perfumery_use"), // Utilisation en parfumerie
  blendingNotes: text("blending_notes"), // Notes d'accord
  recommendedDilution: varchar("recommended_dilution", { length: 100 }), // Ex: "1-3%"
  // Axe climatique Absorbe
  climaticAxis: mysqlEnum("climatic_axis", [
    "vent",
    "bois",
    "disparition",
    "vent_bois",
    "bois_disparition",
    "vent_disparition"
  ]),
  // Image
  imageUrl: varchar("image_url", { length: 500 }),
  // Métadonnées
  notes: text("notes"),
  references: json("references").$type<{
    author?: string;
    year?: number;
    title: string;
    journal?: string;
    doi?: string;
    url?: string;
    type: 'academic' | 'book' | 'database' | 'other';
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Chemotype = typeof chemotypes.$inferSelect;
export type InsertChemotype = typeof chemotypes.$inferInsert;

// Relations pour chemotypes
export const chemotypesRelations = relations(chemotypes, ({ one }) => ({
  plant: one(plants, {
    fields: [chemotypes.plantId],
    references: [plants.id],
  }),
  dominantMolecule: one(molecules, {
    fields: [chemotypes.dominantMoleculeId],
    references: [molecules.id],
  }),
}));


// ============================================================================
// IFRA PRODUCT CATEGORIES (Descriptions des catégories IFRA)
// ============================================================================

export const ifraCategories = mysqlTable("ifra_categories", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(), // Ex: "1", "5A", "10B"
  name: varchar("name", { length: 255 }).notNull(), // Nom de la catégorie
  nameFr: varchar("name_fr", { length: 255 }), // Nom en français
  description: text("description"), // Description détaillée
  descriptionFr: text("description_fr"), // Description en français
  examples: text("examples"), // Exemples de produits
  examplesFr: text("examples_fr"), // Exemples en français
  exposureLevel: mysqlEnum("exposure_level", [
    "very_high", // Très élevé (lèvres, aisselles)
    "high", // Élevé (parfum, corps)
    "medium", // Moyen (rinçable)
    "low", // Faible (ménager)
    "very_low" // Très faible (industriel)
  ]),
  skinContact: mysqlEnum("skin_contact", [
    "direct_prolonged", // Contact direct prolongé
    "direct_brief", // Contact direct bref
    "indirect", // Contact indirect
    "none" // Pas de contact
  ]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type IfraCategory = typeof ifraCategories.$inferSelect;
export type InsertIfraCategory = typeof ifraCategories.$inferInsert;


// ============================================================================
// SAMPLE IMAGES (Galerie d'images des échantillons)
// ============================================================================

export const sampleImages = mysqlTable("sample_images", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  title: varchar("title", { length: 255 }),
  description: text("description"),
  // Fichier
  url: varchar("url", { length: 500 }).notNull(), // URL S3
  fileKey: varchar("file_key", { length: 255 }).notNull(), // Clé S3
  fileName: varchar("file_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: int("file_size"), // Taille en bytes
  // Dimensions
  width: int("width"),
  height: int("height"),
  // Associations
  leafEconomyId: int("leaf_economy_id").references(() => leafEconomies.id),
  plantId: int("plant_id").references(() => plants.id),
  // Catégorisation
  category: mysqlEnum("category", [
    "echantillon", // Photo d'échantillon
    "extraction", // Photo du processus d'extraction
    "analyse", // Photo d'analyse (GC-MS, etc.)
    "terrain", // Photo de terrain
    "equipement", // Photo d'équipement
    "autre"
  ]).default("echantillon"),
  // Tags pour recherche
  tags: json("tags").$type<string[]>(),
  // Métadonnées
  capturedAt: timestamp("captured_at"), // Date de prise de vue
  location: varchar("location", { length: 255 }), // Lieu de prise de vue
  photographer: varchar("photographer", { length: 255 }),
  // Utilisateur
  uploadedBy: int("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  leafEconomyIdx: index("sample_images_leaf_economy_idx").on(table.leafEconomyId),
  plantIdx: index("sample_images_plant_idx").on(table.plantId),
  categoryIdx: index("sample_images_category_idx").on(table.category),
}));

export type SampleImage = typeof sampleImages.$inferSelect;
export type InsertSampleImage = typeof sampleImages.$inferInsert;

// Relations pour sample_images
export const sampleImagesRelations = relations(sampleImages, ({ one }) => ({
  leafEconomy: one(leafEconomies, {
    fields: [sampleImages.leafEconomyId],
    references: [leafEconomies.id],
  }),
  plant: one(plants, {
    fields: [sampleImages.plantId],
    references: [plants.id],
  }),
  uploadedByUser: one(users, {
    fields: [sampleImages.uploadedBy],
    references: [users.id],
  }),
}));


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
export const molecularInteractionsRelations = relations(molecularInteractions, ({ one }) => ({
  molecule1: one(molecules, {
    fields: [molecularInteractions.molecule1Id],
    references: [molecules.id],
  }),
  molecule2: one(molecules, {
    fields: [molecularInteractions.molecule2Id],
    references: [molecules.id],
  }),
  molecule3: one(molecules, {
    fields: [molecularInteractions.molecule3Id],
    references: [molecules.id],
  }),
}));

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

// ============================================================================
// TERPENE COMPARISON PROFILES
// ============================================================================

/**
 * Comparative terpene profiles for tobacco, cannabis, and perfumery
 * Used for radar charts and visual comparison
 */
export const terpeneComparisonProfiles = mysqlTable("terpene_comparison_profiles", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  profileId: varchar("profile_id", { length: 50 }).notNull().unique(), // TCP-001, TCP-002, etc.
  name: varchar("name", { length: 255 }).notNull(),
  // Source
  sourceType: mysqlEnum("source_type", ["tabac", "cannabis", "parfum"]).notNull(),
  sourceId: int("source_id"), // Reference to tabac, leafEconomy, or molecule
  sourceName: varchar("source_name", { length: 255 }), // Name of the source
  // Terpene percentages (0-100 scale for radar chart)
  myrcene: int("myrcene").default(0),
  limonene: int("limonene").default(0),
  pinene: int("pinene").default(0),
  linalool: int("linalool").default(0),
  caryophyllene: int("caryophyllene").default(0),
  humulene: int("humulene").default(0),
  terpinolene: int("terpinolene").default(0),
  ocimene: int("ocimene").default(0),
  bisabolol: int("bisabolol").default(0),
  geraniol: int("geraniol").default(0),
  // Additional terpenes (JSON for flexibility)
  additionalTerpenes: json("additional_terpenes").$type<{
    name: string;
    value: number;
  }[]>(),
  // Olfactive characteristics
  dominantNote: varchar("dominant_note", { length: 100 }),
  olfactiveDescription: text("olfactive_description"),
  // Aromatic bridges (common terpenes with other sources)
  aromaticBridges: json("aromatic_bridges").$type<{
    terpene: string;
    bridgesWith: string; // "tabac", "cannabis", or "parfum"
    commonality: number; // 0-100
  }[]>(),
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sourceTypeIdx: index("terpene_comparison_source_idx").on(table.sourceType),
}));

export type TerpeneComparisonProfile = typeof terpeneComparisonProfiles.$inferSelect;
export type InsertTerpeneComparisonProfile = typeof terpeneComparisonProfiles.$inferInsert;

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
export const formulationSuggestionsRelations = relations(formulationSuggestions, ({ one }) => ({
  baseMolecule: one(molecules, {
    fields: [formulationSuggestions.baseMoleculeId],
    references: [molecules.id],
  }),
}));

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
// VARIETY GENEALOGY (Généalogie des variétés botaniques)
// ============================================================================

export const varietyGenealogy = mysqlTable("variety_genealogy", {
  id: int("id").autoincrement().primaryKey(),
  // Relations
  varietyId: int("variety_id").notNull(), // Référence à plant_varieties
  parentVarietyId: int("parent_variety_id").notNull(), // Auto-référence
  // Type de relation
  relationshipType: mysqlEnum("relationship_type", [
    "parent",    // Parent direct
    "hybrid",    // Hybride (croisement)
    "clone",     // Clone
    "mutation"   // Mutation naturelle ou induite
  ]).notNull().default("parent"),
  // Informations sur le croisement
  crossDate: int("cross_date"), // Année du croisement
  breeder: varchar("breeder", { length: 255 }), // Obtenteur/sélectionneur
  notes: text("notes"),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  varietyIdx: index("variety_genealogy_variety_idx").on(table.varietyId),
  parentIdx: index("variety_genealogy_parent_idx").on(table.parentVarietyId),
}));

export type VarietyGenealogy = typeof varietyGenealogy.$inferSelect;
export type InsertVarietyGenealogy = typeof varietyGenealogy.$inferInsert;

// ============================================================================
// OLFACTIVE ARCHIVES (Archives historiques et documents)
// ============================================================================

export const olfactiveArchives = mysqlTable("olfactive_archives", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  title: varchar("title", { length: 500 }).notNull(),
  type: mysqlEnum("type", [
    "manuscript",              // Manuscrit ancien
    "formula",                 // Formule historique
    "archaeological",          // Découverte archéologique
    "botanical_illustration"   // Illustration botanique
  ]).notNull(),
  // Datation
  dateCreated: varchar("date_created", { length: 100 }), // Date historique (format flexible)
  civilization: varchar("civilization", { length: 255 }), // Égypte, Rome, Grèce, etc.
  // Contenu
  plantIds: json("plant_ids").$type<number[]>().default([]), // Plantes mentionnées
  moleculeIds: json("molecule_ids").$type<number[]>().default([]), // Molécules si connues
  description: text("description"), // Description du contenu
  provenance: text("provenance"), // Source du document
  // Authenticité
  authenticityLevel: mysqlEnum("authenticity_level", [
    "confirmed",     // Confirmé par sources multiples
    "probable",      // Probable mais non confirmé
    "hypothetical"   // Hypothétique/reconstruction
  ]).notNull().default("probable"),
  // Références
  references: json("references").$type<{
    author?: string;
    year?: number;
    title: string;
    type: string;
    url?: string;
  }[]>().default([]),
  imageUrl: varchar("image_url", { length: 500 }),
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("olfactive_archives_type_idx").on(table.type),
  civilizationIdx: index("olfactive_archives_civilization_idx").on(table.civilization),
}));

export type OlfactiveArchive = typeof olfactiveArchives.$inferSelect;
export type InsertOlfactiveArchive = typeof olfactiveArchives.$inferInsert;

// ============================================================================
// CIVILIZATIONAL MARKERS (Marqueurs historiques et culturels)
// ============================================================================

export const civilizationalMarkers = mysqlTable("civilizational_markers", {
  id: int("id").autoincrement().primaryKey(),
  // Référence à la plante
  plantId: int("plant_id").notNull(),
  // Civilisation et période
  civilization: varchar("civilization", { length: 255 }).notNull(), // Égypte, Rome, Grèce, Inde, Chine, etc.
  period: varchar("period", { length: 255 }), // Antiquité, Moyen Âge, Renaissance, etc.
  startYear: int("start_year"), // Année de début (peut être négatif pour av. J.-C.)
  endYear: int("end_year"), // Année de fin
  // Type d'usage
  usageType: mysqlEnum("usage_type", [
    "ritual",      // Rituel religieux
    "medical",     // Médecine traditionnelle
    "commercial",  // Commerce
    "funerary",    // Funéraire
    "cosmetic"     // Cosmétique
  ]).notNull(),
  // Contexte historique
  historicalSignificance: text("historical_significance"), // Importance historique
  tradeRoutes: json("trade_routes").$type<{
    route: string;
    description?: string;
  }[]>().default([]), // Routes commerciales
  archaeologicalEvidence: text("archaeological_evidence"), // Preuves archéologiques
  primarySources: json("primary_sources").$type<{
    title: string;
    author?: string;
    date?: string;
    type?: string;
  }[]>().default([]), // Sources primaires (textes anciens, etc.)
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  plantIdx: index("civilizational_markers_plant_idx").on(table.plantId),
  civilizationIdx: index("civilizational_markers_civilization_idx").on(table.civilization),
  periodIdx: index("civilizational_markers_period_idx").on(table.period),
  usageIdx: index("civilizational_markers_usage_idx").on(table.usageType),
}));

export type CivilizationalMarker = typeof civilizationalMarkers.$inferSelect;
export type InsertCivilizationalMarker = typeof civilizationalMarkers.$inferInsert;

// ============================================================================
// ZONES GÉOGRAPHIQUES (Overlays pour la carte interactive)
// ============================================================================

/**
 * Zones géographiques pour visualiser les régions à forte concentration
 * d'espèces menacées et les alternatives durables disponibles
 */
export const geographicZones = mysqlTable("geographic_zones", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  name: varchar("name", { length: 255 }).notNull(), // Nom de la zone
  region: varchar("region", { length: 255 }).notNull(), // Région
  zoneType: mysqlEnum("zone_type", [
    "threatened_concentration",  // Zone à forte concentration d'espèces menacées
    "sustainable_alternatives",  // Zone avec alternatives durables disponibles
    "biodiversity_hotspot",      // Point chaud de biodiversité
    "conservation_area"          // Zone de conservation active
  ]).notNull(),
  // Géométrie de la zone (polygone)
  coordinates: json("coordinates").$type<{
    lat: number;
    lng: number;
  }[]>().notNull(), // Array de {lat, lng} définissant le polygone
  // Informations sur la zone
  description: text("description"),
  threatLevel: mysqlEnum("threat_level", [
    "critical",
    "high",
    "medium",
    "low",
    "stable"
  ]).default("medium"),
  speciesCount: int("species_count").default(0), // Nombre d'espèces dans cette zone
  conservationPriority: mysqlEnum("conservation_priority", [
    "urgent",
    "high",
    "medium",
    "low"
  ]).default("medium"),
  // Couleur de l'overlay sur la carte
  overlayColor: varchar("overlay_color", { length: 7 }).default("#FF0000"), // Couleur hex
  overlayOpacity: decimal("overlay_opacity", { precision: 3, scale: 2 }).default("0.35"), // Opacité (0.00 à 1.00)
  // Alternatives durables dans cette zone
  sustainableAlternatives: text("sustainable_alternatives"),
  conservationEfforts: text("conservation_efforts"),
  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  zoneTypeIdx: index("geographic_zones_zone_type_idx").on(table.zoneType),
  threatLevelIdx: index("geographic_zones_threat_level_idx").on(table.threatLevel),
}));

export type GeographicZone = typeof geographicZones.$inferSelect;
export type InsertGeographicZone = typeof geographicZones.$inferInsert;

// ============================================================================
// LIAISON: Plantes <-> Zones géographiques (Many-to-Many)
// ============================================================================

export const plantGeographicZones = mysqlTable("plant_geographic_zones", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  zoneId: int("zone_id").notNull().references(() => geographicZones.id, { onDelete: "cascade" }),
  isPrimaryZone: boolean("is_primary_zone").default(false), // Zone principale pour cette plante
  populationStatus: mysqlEnum("population_status", [
    "abundant",
    "common",
    "rare",
    "critically_rare",
    "extinct"
  ]).default("common"),
  notes: text("notes"),
}, (table) => ({
  plantZoneIdx: index("plant_geographic_zones_plant_zone_idx").on(table.plantId, table.zoneId),
  uniquePlantZone: unique("unique_plant_zone").on(table.plantId, table.zoneId),
}));

export type PlantGeographicZone = typeof plantGeographicZones.$inferSelect;
export type InsertPlantGeographicZone = typeof plantGeographicZones.$inferInsert;


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
export const sustainableAlternativesRelations = relations(sustainableAlternatives, ({ one }) => ({
  threatenedPlant: one(plants, {
    fields: [sustainableAlternatives.threatenedPlantId],
    references: [plants.id],
  }),
  alternativePlant: one(plants, {
    fields: [sustainableAlternatives.alternativePlantId],
    references: [plants.id],
  }),
}));
