import { boolean, decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { families } from "./families";
import { analyticalMethods } from "./research-publications";
import { tabacs } from "./tabacs";

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
  olfactiveProfileJson: json("olfactive_profile_json").$type<string[]>(), // Standardized JSON array (preferred over text)
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
  therapeuticPropertiesJson: json("therapeutic_properties_json").$type<string[]>(), // Standardized JSON array (preferred over text)
  // Radar olfactive profile (0-100 scale)
  radarIntensity: int("radar_intensity").default(50), // Olfactive intensity
  radarFreshness: int("radar_freshness").default(50), // Freshness (citrus, mint)
  radarWarmth: int("radar_warmth").default(50), // Warmth (spicy, woody)
  radarSweetness: int("radar_sweetness").default(50), // Sweetness (floral, fruity)
  radarSpiciness: int("radar_spiciness").default(50), // Spiciness (pepper, ginger)
  radarEarthiness: int("radar_earthiness").default(50), // Earthiness (moss, soil, wood)
  // PubChem enrichment data
  pubchemCid: int("pubchem_cid"), // PubChem Compound ID
  smiles: text("smiles"), // Canonical SMILES structure
  inchi: text("inchi"), // InChI identifier
  inchiKey: varchar("inchi_key", { length: 27 }), // InChIKey (fixed 27 chars)
  exactMass: decimal("exact_mass", { precision: 12, scale: 6 }), // Exact mass in Da
  xlogP: decimal("xlogp", { precision: 6, scale: 2 }), // Partition coefficient
  tpsa: decimal("tpsa", { precision: 8, scale: 2 }), // Topological polar surface area
  hBondDonorCount: int("h_bond_donor_count"), // Hydrogen bond donors
  hBondAcceptorCount: int("h_bond_acceptor_count"), // Hydrogen bond acceptors
  rotatableBondCount: int("rotatable_bond_count"), // Rotatable bonds
  heavyAtomCount: int("heavy_atom_count"), // Heavy atoms (non-hydrogen)
  pubchemSynonyms: json("pubchem_synonyms").$type<string[]>(), // Synonyms from PubChem
  pubchemEnrichedAt: timestamp("pubchem_enriched_at"), // When PubChem data was fetched
  // ChEBI enrichment data (alternative to PubChem)
  chebiId: varchar("chebi_id", { length: 50 }), // ChEBI Compound ID (e.g., "CHEBI:28358")
  chebiEnrichedAt: timestamp("chebi_enriched_at"), // When ChEBI data was fetched
  // COCONUT enrichment data (natural products database)
  coconutId: varchar("coconut_id", { length: 100 }), // COCONUT Compound ID
  npLikenessScore: decimal("np_likeness_score", { precision: 10, scale: 4 }), // Natural Product Likeness Score
  coconutOrganisms: json("coconut_organisms").$type<{ name: string; rank?: string }[]>(), // Source organisms
  coconutCitations: json("coconut_citations").$type<{ doi?: string; title?: string }[]>(), // Citations from COCONUT
  coconutEnrichedAt: timestamp("coconut_enriched_at"), // When COCONUT data was fetched
  // Wikidata integration (NOSE Phase 4 / Odeuropa interoperability)
  wikidataQid: varchar("wikidata_qid", { length: 20 }), // Wikidata QID (e.g., "Q193178" for linalool)
  wikidataEnrichedAt: timestamp("wikidata_enriched_at"), // When Wikidata data was fetched
  // IFRA regulatory data
  ifraStatus: mysqlEnum("ifra_status", ['not_regulated', 'banned', 'restricted', 'specification_required']).default('not_regulated'),
  ifraData: json("ifra_data").$type<{
    status: string;
    reason?: string;
    maxPercent?: number;
    category?: string;
    specification?: string;
    name?: string;
    casNumber?: string;
  }>(),
  ifraEnrichedAt: timestamp("ifra_enriched_at"),
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
  // Statut de validation (brouillon/validé)
  validationStatus: mysqlEnum("validation_status", [
    "brouillon",       // Brouillon - en attente de validation
    "en_revision",     // En révision - soumis pour validation
    "valide",          // Validé - approuvé par un admin
    "rejete"           // Rejeté - nécessite des corrections
  ]).default("valide"),
  validatedBy: int("validated_by"),      // ID de l'admin qui a validé
  validatedAt: timestamp("validated_at"), // Date de validation
  contributorId: int("contributor_id"),   // ID du contributeur original
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
// MOLECULAR SYNERGIES
// ============================================================================

// Molecular synergies between tobacco, molecules, and olfactive families
export const synergies = mysqlTable("synergies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Nom de la synergie
  tabacId: int("tabac_id").references(() => tabacs.id),
  moleculeId: int("molecule_id").references(() => molecules.id),
  familleId: int("famille_id").references(() => families.id),
  type: mysqlEnum("type", ["potentialisation", "stabilisation", "transformation", "masquage", "neutralisation"]).notNull(),
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
  type: mysqlEnum("type", ["potentialisation", "stabilisation", "transformation", "masquage", "neutralisation"]).notNull(),
  description: text("description").notNull(), // Description détaillée de la synergie
  chemicalMechanism: text("chemical_mechanism"), // Explication du mécanisme chimique (liaisons, interactions, etc.)
  applications: text("applications"), // Applications pratiques
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one synergy per molecule pair (bidirectional)
  uniqueMoleculePair: uniqueIndex("unique_molecule_pair").on(table.molecule1Id, table.molecule2Id),
}));

export type MoleculeSynergie = typeof moleculeSynergies.$inferSelect;
export type InsertMoleculeSynergie = typeof moleculeSynergies.$inferInsert;

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

// ============================================================================
// MOLECULE ANALYTICAL METHODS - Liaison molécules <-> méthodes analytiques
// ============================================================================

/**
 * Links molecules to the analytical methods used to identify/quantify them.
 * Tracks which techniques were used for each molecule analysis.
 */
export const moleculeAnalyticalMethods = mysqlTable("molecule_analytical_methods", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id, { onDelete: "cascade" }),
  methodId: int("method_id").notNull().references(() => analyticalMethods.id, { onDelete: "cascade" }),
  // Analysis details
  isPrimary: boolean("is_primary").default(false), // Primary method used for identification
  detectionLimit: decimal("detection_limit", { precision: 10, scale: 6 }), // Detection limit achieved
  detectionUnit: varchar("detection_unit", { length: 20 }), // ppm, ppb, ng/L, etc.
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // Accuracy percentage
  // Context
  analysisDate: timestamp("analysis_date"), // When the analysis was performed
  laboratoryName: varchar("laboratory_name", { length: 255 }), // Lab that performed the analysis
  notes: text("notes"), // Additional notes
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueMoleculeMethod: uniqueIndex("unique_molecule_method").on(table.moleculeId, table.methodId),
  moleculeIdx: index("mol_method_molecule_idx").on(table.moleculeId),
  methodIdx: index("mol_method_method_idx").on(table.methodId),
}));

export type MoleculeAnalyticalMethod = typeof moleculeAnalyticalMethods.$inferSelect;
export type InsertMoleculeAnalyticalMethod = typeof moleculeAnalyticalMethods.$inferInsert;

// Relations for molecule_analytical_methods
// ============================================================================
// MOLECULE PERFUMES — Parfums emblématiques contenant une molécule
// ============================================================================

export const moleculePerfumes = mysqlTable("molecule_perfumes", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull(),
  perfumeName: varchar("perfume_name", { length: 255 }).notNull(),
  perfumeHouse: varchar("perfume_house", { length: 255 }).notNull(),
  perfumer: varchar("perfumer", { length: 255 }),
  year: int("year"),
  role: mysqlEnum("role_in_perfume", ["accord_principal", "note_coeur", "note_tete", "note_fond", "signature", "ingredient_cle"]).default("ingredient_cle").notNull(),
  concentration: varchar("concentration", { length: 100 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  moleculeIdx: index("mp_molecule_idx").on(table.moleculeId),
  uniqueMoleculePerfume: uniqueIndex("unique_molecule_perfume").on(table.moleculeId, table.perfumeName),
}));

export type MoleculePerfume = typeof moleculePerfumes.$inferSelect;
export type InsertMoleculePerfume = typeof moleculePerfumes.$inferInsert;
