import { date, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

