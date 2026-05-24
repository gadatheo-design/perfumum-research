import { int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

// ============================================================================
// MANUEL TECHNIQUE - CHEMICAL FAMILIES
// ============================================================================

export const chemicalFamilies = mysqlTable("chemical_families", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  // Familles chimiques complètes pour la parfumerie
  type: mysqlEnum("type", [
    // Terpènes et dérivés
    "monoterpene",           // C10 - ex: limonène, pinène, myrcène
    "sesquiterpene",         // C15 - ex: caryophyllène, humulène
    "diterpene",             // C20 - ex: sclareol
    "triterpene",            // C30 - ex: squalène
    "monoterpenoid",         // Terpènes oxygénés C10 - ex: linalol, géraniol
    "sesquiterpenoid",       // Terpènes oxygénés C15 - ex: patchoulol, nootkatone
    // Alcools
    "alcohol_aliphatic",     // Alcools aliphatiques - ex: hexanol, octanol
    "alcohol_aromatic",      // Alcools aromatiques - ex: alcool benzylique, phényléthanol
    "alcohol_terpenic",      // Alcools terpéniques - ex: linalol, géraniol, menthol
    // Aldéhydes
    "aldehyde_aliphatic",    // Aldéhydes aliphatiques - ex: aldéhyde C-10, C-11, C-12
    "aldehyde_aromatic",     // Aldéhydes aromatiques - ex: benzaldéhyde, anisaldéhyde
    "aldehyde_terpenic",     // Aldéhydes terpéniques - ex: citral, citronellal
    // Cétones
    "ketone_aliphatic",      // Cétones aliphatiques - ex: méthyl hepténone
    "ketone_aromatic",       // Cétones aromatiques - ex: acétophénone
    "ketone_terpenic",       // Cétones terpéniques - ex: carvone, menthone, ionones
    "ketone_macrocyclic",    // Cétones macrocycliques - ex: muscone, civetone
    // Esters
    "ester_aliphatic",       // Esters aliphatiques - ex: acétate d'éthyle
    "ester_aromatic",        // Esters aromatiques - ex: benzoate de benzyle
    "ester_terpenic",        // Esters terpéniques - ex: acétate de linalyle
    // Éthers
    "ether_aliphatic",       // Éthers aliphatiques
    "ether_aromatic",        // Éthers aromatiques - ex: anéthole, estragole
    // Phénols et dérivés
    "phenol",                // Phénols - ex: eugénol, thymol, carvacrol
    "phenol_ether",          // Éthers de phénol - ex: anéthole, estragole, safrole
    // Lactones
    "lactone",               // Lactones - ex: coumarine, gamma-décalactone
    "lactone_macrocyclic",   // Lactones macrocycliques - ex: ambrettolide
    // Coumarines
    "coumarin",              // Coumarines - ex: coumarine, dihydrocoumarine
    // Muscs
    "musk_nitro",            // Muscs nitrés - ex: musk ketone, musk xylene
    "musk_polycyclic",       // Muscs polycycliques - ex: galaxolide, tonalide
    "musk_macrocyclic",      // Muscs macrocycliques - ex: muscone, ambrettolide
    "musk_linear",           // Muscs linéaires - ex: helvetolide
    // Composés azotés
    "nitrile",               // Nitriles - ex: géranyl nitrile
    "indole",                // Indoles - ex: indole, skatole
    "pyrazine",              // Pyrazines - ex: méthoxypyrazines
    "pyridine",              // Pyridines
    "amine",                 // Amines
    // Composés soufrés
    "sulfur_compound",       // Composés soufrés - ex: thiols, sulfures
    "thiophene",             // Thiophènes
    // Acides
    "acid_carboxylic",       // Acides carboxyliques - ex: acide benzoïque
    "acid_fatty",            // Acides gras - ex: acide laurique
    // Hétérocycles
    "furan",                 // Furanes - ex: furfural
    "heterocyclic_oxygen",   // Hétérocycles oxygénés
    "heterocyclic_nitrogen", // Hétérocycles azotés
    // Autres
    "hydrocarbon_aromatic",  // Hydrocarbures aromatiques
    "hydrocarbon_aliphatic", // Hydrocarbures aliphatiques
    "oxide",                 // Oxydes - ex: oxyde de rose, oxyde de linalol
    "acetals",               // Acétals - ex: acétal phényléthylique
    "anhydride",             // Anhydrides
    "other"                  // Autres
  ]).notNull(),
  // Sous-catégorie pour plus de précision
  subcategory: varchar("subcategory", { length: 100 }), // ex: "saturé", "insaturé", "cyclique"
  description: text("description"),
  olfactiveRole: text("olfactiveRole"), // Rôle olfactif (rondeur, balsamique, etc.)
  // Caractéristiques physico-chimiques
  volatility: varchar("volatility", { length: 50 }), // Faible, Moyenne, Forte
  polarity: varchar("polarity", { length: 50 }), // Faible, Moyenne, Élevée
  molecularWeightRange: varchar("molecular_weight_range", { length: 50 }), // ex: "100-200 g/mol"
  // Caractéristiques olfactives générales
  typicalNotes: text("typical_notes"), // Notes olfactives typiques de cette famille
  // Exemples de molécules représentatives
  exampleMolecules: text("example_molecules"), // ex: "linalol, géraniol, nérol"
  // Métadonnées
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

