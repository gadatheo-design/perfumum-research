import { boolean, decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { users } from "./core";
import { leafEconomies } from "./leaf-economies";
import { molecules } from "./molecules";
import { rawMaterials, sustainableAlternatives } from "./raw-materials";
import { suppliers } from "./suppliers";

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
  // Données climatiques détaillées
  latitudeMin: decimal("latitude_min", { precision: 10, scale: 7 }), // Latitude minimale de distribution
  latitudeMax: decimal("latitude_max", { precision: 10, scale: 7 }), // Latitude maximale de distribution
  altitudeMin: int("altitude_min"), // Altitude minimale en mètres
  altitudeMax: int("altitude_max"), // Altitude maximale en mètres
  koppenZone: varchar("koppen_zone", { length: 50 }), // Zone climatique Köppen (ex: "Af, Cfa, Dfb")
  koppenDescription: varchar("koppen_description", { length: 100 }), // Description de la zone Köppen
  precipitationMin: int("precipitation_min"), // Précipitations annuelles minimales (mm)
  precipitationMax: int("precipitation_max"), // Précipitations annuelles maximales (mm)
  temperatureMin: int("temperature_min"), // Température moyenne minimale (°C)
  temperatureMax: int("temperature_max"), // Température moyenne maximale (°C)
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
  // Nomenclature étendue
  synonyms: json("synonyms").$type<string[]>(), // Synonymes botaniques (ex: ["Pimenta acris", "Myrcia acris"])
  authorCitation: varchar("author_citation", { length: 255 }), // Auteur de la description (ex: "(Mill.) Kosterm.")
  gbifId: varchar("gbif_id", { length: 50 }), // Identifiant GBIF pour lien direct
  itisId: varchar("itis_id", { length: 50 }), // Identifiant ITIS pour lien direct
  powId: varchar("pow_id", { length: 50 }), // Identifiant Plants of the World (POWO)
  ncbiTaxId: varchar("ncbi_tax_id", { length: 20 }), // NCBI Taxonomy ID (e.g., "3702" for Arabidopsis thaliana)
  wikidataQid: varchar("wikidata_qid", { length: 20 }), // Wikidata QID (e.g., "Q193178" for Rosa damascena)
  wikidataEnrichedAt: timestamp("wikidata_enriched_at"), // When Wikidata data was fetched
  // Linked Data ontologique
  rdfType: varchar("rdf_type", { length: 255 }), // URI classe ontologique (ex: http://purl.obolibrary.org/obo/PO_0000003)
  dwcTaxonRank: varchar("dwc_taxon_rank", { length: 50 }), // Darwin Core taxon rank (Species, Genus, Family...)
  // Métadonnées
  notes: text("notes"),
  imageUrl: varchar("image_url", { length: 500 }),
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
  // --- Architecture refonte 2026-03 : type de matière ---
  materialType: mysqlEnum("material_type", [
    "plante_vasculaire",   // Plante à fleurs, féugères, conifères
    "mousse_lichen",       // Mousses, lichens
    "algue",               // Algues marines ou d'eau douce
    "champignon",          // Champignons, levures
    "huile_essentielle",   // HE distillée
    "absolue",             // Absolue par extraction solvant
    "concrete",            // Concrète
    "resinoid",            // Résinoïde
    "co2_extract",         // Extrait CO2 supercritique
    "hydrolat",            // Eau florale / hydrolat
    "teinture",            // Teinture alcoolique
    "infusion",            // Infusion / macération
    "beurre_vegetal",      // Beurre végétal
    "cire_vegetale",       // Cire végétale
    "resine_brute",        // Résine brute (gomme, baume, oleo-résine)
    "graine_seche",        // Graine sèche
    "fruit_sec",           // Fruit sec ou zéste
    "racine_rhizome",      // Racine, rhizome, bulbe
    "ecorce",              // Écorce
    "bois_copeaux",        // Bois, copeaux, poudre
    "secretion_animale",   // Sécrétion animale (musc, ambre gris, castoreum)
    "accord_olfactif",     // Accord olfactif composé
    "synthese_chimique"    // Molécule de synthèse
  ]),
  // Organe végétal source (pour distinguer les variantes d'une même espèce)
  plantPart: mysqlEnum("plant_part", [
    "fleur",          // Fleur entière ou pétales
    "feuille",        // Feuille
    "fruit",          // Fruit entier
    "zeste",          // Zeste / écorce de fruit
    "graine",         // Graine / pépin
    "arille",         // Arille (ex: macis du muscadier)
    "ecorce",         // Écorce de tige ou de branche
    "bois",           // Bois / copeaux
    "racine",         // Racine
    "rhizome",        // Rhizome
    "bulbe",          // Bulbe
    "resine",         // Résine / exsudat
    "feuille_tige",   // Feuille + tige (parties aériennes)
    "plante_entiere", // Plante entière
    "thalle",         // Thalle (lichens, algues)
    "champignon",     // Corps fructifère (champignons)
    "autre"           // Autre organe
  ]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = typeof plants.$inferInsert;

// ============================================================================
// RELATIONS: Plants <-> Molecules (Many-to-Many)
// ============================================================================

export const plantMolecules = mysqlTable("plant_molecules", {
  plantId: int("plant_id").notNull().references(() => plants.id),
  moleculeId: int("molecule_id").notNull().references(() => molecules.id),
  // Pourcentages de composition (ex: linalol 25-45% dans la lavande)
  percentageMin: decimal("percentage_min", { precision: 5, scale: 2, mode: 'number' }), // Pourcentage minimum
  percentageMax: decimal("percentage_max", { precision: 5, scale: 2, mode: 'number' }), // Pourcentage maximum
  percentageTypical: decimal("percentage_typical", { precision: 5, scale: 2, mode: 'number' }), // Pourcentage typique/moyen
  percentage: decimal("percentage", { precision: 5, scale: 2, mode: 'number' }), // Pourcentage (legacy)
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
  pk: uniqueIndex("plant_molecules_pk").on(table.plantId, table.moleculeId),
}));

// ============================================================================
// DRIZZLE RELATIONS
// ============================================================================

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
// RELATIONS POUR POINT 3 ÉTENDU
// ============================================================================

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
  // Display order for drag-and-drop reordering
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  leafEconomyIdx: index("sample_images_leaf_economy_idx").on(table.leafEconomyId),
  plantIdx: index("sample_images_plant_idx").on(table.plantId),
  categoryIdx: index("sample_images_category_idx").on(table.category),
  sortOrderIdx: index("sample_images_sort_idx").on(table.plantId, table.sortOrder),
}));

export type SampleImage = typeof sampleImages.$inferSelect;
export type InsertSampleImage = typeof sampleImages.$inferInsert;

// Relations pour sample_images
// ============================================================================
// PLANT CONTRIBUTIONS — Système de contributions utilisateur pour les plantes
// ============================================================================
export const plantContributions = mysqlTable("plant_contributions", {
  id: int("id").autoincrement().primaryKey(),
  plantId: int("plant_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }),
  contributionType: mysqlEnum("contribution_type", ["image", "molecule", "terroir", "note"]).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  imageUrl: text("image_url"),
  imageCaption: varchar("image_caption", { length: 500 }),
  imageSource: varchar("image_source", { length: 500 }),
  moleculeId: int("molecule_id"),
  moleculeName: varchar("molecule_name", { length: 255 }),
  moleculeConcentration: varchar("molecule_concentration", { length: 100 }),
  moleculeSource: varchar("molecule_source", { length: 500 }),
  terroir: varchar("terroir", { length: 255 }),
  region: varchar("region", { length: 255 }),
  country: varchar("country", { length: 255 }),
  terroirNotes: text("terroir_notes"),
  noteContent: text("note_content"),
  noteCategory: varchar("note_category", { length: 100 }),
  description: text("description"),
  references: text("references"),
  adminNotes: text("admin_notes"),
  reviewedBy: varchar("reviewed_by", { length: 255 }),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  plantIdx: index("pc_plant_idx").on(table.plantId),
  userIdx: index("pc_user_idx").on(table.userId),
  statusIdx: index("pc_status_idx").on(table.status),
  typeIdx: index("pc_type_idx").on(table.contributionType),
}));

export type PlantContribution = typeof plantContributions.$inferSelect;
export type InsertPlantContribution = typeof plantContributions.$inferInsert;
