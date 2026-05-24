import { boolean, date, decimal, float, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar, year } from "drizzle-orm/mysql-core";
import { and, not, or} from "drizzle-orm";

import { accords } from "./accords";
import { users } from "./core";
import { molecules } from "./molecules";
import { plants } from "./plants";

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
// NOTIFICATIONS SYSTEM
// ============================================================================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", [
    "import_orphan_molecules",    // Molécules importées sans classification
    "new_contribution",           // Nouvelle contribution d'un utilisateur
    "validation_required",        // Validation requise
    "classification_milestone",   // Jalon de classification atteint
    "system_alert",               // Alerte système
    "data_quality",               // Problème de qualité des données
    "other"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "error", "success"]).default("info").notNull(),
  // Related entity (optional)
  entityType: varchar("entity_type", { length: 50 }), // 'molecule', 'plant', 'recette', etc.
  entityId: int("entity_id"),
  // Metadata
  metadata: json("metadata").$type<{
    count?: number;
    moleculeIds?: number[];
    importId?: string;
    [key: string]: unknown;
  }>(),
  // Read status
  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at"),
  readBy: int("read_by"),
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // Optional expiration
}, (table) => ({
  typeIdx: index("notification_type_idx").on(table.type),
  readIdx: index("notification_read_idx").on(table.isRead),
  createdIdx: index("notification_created_idx").on(table.createdAt),
}));

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================================================
// CLASSIFICATION SNAPSHOTS (Progress Tracking)
// ============================================================================

export const classificationSnapshots = mysqlTable("classification_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  // Snapshot date
  snapshotDate: timestamp("snapshot_date").notNull(),
  // Molecule classification stats
  totalMolecules: int("total_molecules").notNull(),
  moleculesWithFamily: int("molecules_with_family").notNull(),
  moleculesWithChemicalClass: int("molecules_with_chemical_class").notNull(),
  moleculesWithCasNumber: int("molecules_with_cas_number").notNull(),
  moleculesWithIupacName: int("molecules_with_iupac_name").notNull(),
  moleculesWithFormula: int("molecules_with_formula").notNull(),
  moleculesWithOlfactiveProfile: int("molecules_with_olfactive_profile").notNull(),
  moleculesWithRadar: int("molecules_with_radar").notNull(),
  // Linking stats
  moleculesLinkedToRecettes: int("molecules_linked_to_recettes").notNull(),
  moleculesLinkedToPlants: int("molecules_linked_to_plants").notNull(),
  plantsLinkedToTerroirs: int("plants_linked_to_terroirs").notNull(),
  // Overall coverage percentages (stored as integers 0-10000 for 0.00%-100.00%)
  overallClassificationRate: int("overall_classification_rate").notNull(), // Average of all classification fields
  overallLinkingRate: int("overall_linking_rate").notNull(), // Average of all linking fields
  // Additional entity counts for context
  totalRecettes: int("total_recettes").notNull(),
  totalPlants: int("total_plants").notNull(),
  totalTerroirs: int("total_terroirs").notNull(),
  totalAccords: int("total_accords").notNull(),
  // Notes
  notes: text("notes"),
  // Who created this snapshot
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  dateIdx: index("snapshot_date_idx").on(table.snapshotDate),
}));

export type ClassificationSnapshot = typeof classificationSnapshots.$inferSelect;
export type InsertClassificationSnapshot = typeof classificationSnapshots.$inferInsert;

// Relations
// ============================================================================
// CLASSIFICATION REVIEWS (Low Confidence Review Queue)
// ============================================================================

export const classificationReviews = mysqlTable("classification_reviews", {
  id: int("id").autoincrement().primaryKey(),
  // Molecule being reviewed
  moleculeId: int("molecule_id").notNull(),
  // AI Classification data
  aiChemicalClass: varchar("ai_chemical_class", { length: 100 }),
  aiChemicalClassConfidence: int("ai_chemical_class_confidence"), // 0-100
  aiChemicalClassReasoning: text("ai_chemical_class_reasoning"),
  aiOlfactiveFamily: varchar("ai_olfactive_family", { length: 100 }),
  aiOlfactiveFamilyConfidence: int("ai_olfactive_family_confidence"), // 0-100
  aiOlfactiveFamilyReasoning: text("ai_olfactive_family_reasoning"),
  aiSuggestedOlfactiveProfile: text("ai_suggested_olfactive_profile"),
  aiBotanicalContextUsed: boolean("ai_botanical_context_used").default(false),
  // Review status
  status: mysqlEnum("status", [
    "pending",      // En attente de révision
    "approved",     // Approuvé et appliqué
    "rejected",     // Rejeté
    "modified",     // Modifié manuellement
    "skipped"       // Ignoré pour l'instant
  ]).default("pending").notNull(),
  // Manual corrections (if modified)
  manualChemicalClass: varchar("manual_chemical_class", { length: 100 }),
  manualOlfactiveFamily: varchar("manual_olfactive_family", { length: 100 }),
  manualOlfactiveProfile: text("manual_olfactive_profile"),
  // Review metadata
  reviewNotes: text("review_notes"),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
  // Timestamps and user tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: int("reviewed_by"),
}, (table) => ({
  moleculeIdx: index("review_molecule_idx").on(table.moleculeId),
  statusIdx: index("review_status_idx").on(table.status),
  priorityIdx: index("review_priority_idx").on(table.priority),
  confidenceIdx: index("review_confidence_idx").on(table.aiChemicalClassConfidence),
}));

export type ClassificationReview = typeof classificationReviews.$inferSelect;
export type InsertClassificationReview = typeof classificationReviews.$inferInsert;

// Relations
// ============================================================================
// GHOST VARIETIES (Variétés fantômes - AX1)
// Variétés botaniques disparues ou menacées, historiquement significatives
// ============================================================================

export const ghostVarieties = mysqlTable("ghost_varieties", {
  id: int("id").autoincrement().primaryKey(),
  // Identité de la variété
  name: varchar("name", { length: 255 }).notNull(),
  scientificName: varchar("scientific_name", { length: 255 }),
  commonNames: json("common_names").$type<string[]>(),
  // Classification botanique
  plantFamily: varchar("plant_family", { length: 255 }),
  genus: varchar("genus", { length: 255 }),
  species: varchar("species", { length: 255 }),
  cultivar: varchar("cultivar", { length: 255 }),
  // Type de variété
  varietyType: mysqlEnum("variety_type", [
    "rose",
    "jasmine",
    "tobacco",
    "cannabis",
    "lavender",
    "citrus",
    "aromatic_herb",
    "resin_tree",
    "other"
  ]).notNull(),
  // Statut de conservation
  conservationStatus: mysqlEnum("conservation_status", [
    "extinct",
    "extinct_wild",
    "critically_endangered",
    "endangered",
    "vulnerable",
    "near_threatened",
    "reconstructed",
    "unknown"
  ]).notNull(),
  // Documentation historique
  lastDocumentedYear: int("last_documented_year"),
  lastDocumentedLocation: varchar("last_documented_location", { length: 255 }),
  peakCultivationPeriod: varchar("peak_cultivation_period", { length: 255 }),
  disappearanceCauses: json("disappearance_causes").$type<string[]>(),
  // Profil olfactif
  olfactiveProfile: text("olfactive_profile"),
  molecularProfile: json("molecular_profile").$type<{
    molecule: string;
    percentage?: number;
    note?: string;
  }[]>(),
  // Tentatives de reconstruction
  reconstructionAttempts: json("reconstruction_attempts").$type<{
    year: number;
    institution?: string;
    method?: string;
    success?: boolean;
    notes?: string;
  }[]>(),
  // Sources historiques
  historicalSources: json("historical_sources").$type<{
    title: string;
    author?: string;
    year?: number;
    type?: string;
  }[]>(),
  // Description et notes
  description: text("description"),
  historicalSignificance: text("historical_significance"),
  notes: text("notes"),
  imageUrl: varchar("image_url", { length: 500 }),
  // Métadonnées
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("ghost_variety_name_idx").on(table.name),
  typeIdx: index("ghost_varieties_type_idx").on(table.varietyType),
  statusIdx: index("ghost_varieties_status_idx").on(table.conservationStatus),
}));

export type GhostVariety = typeof ghostVarieties.$inferSelect;
export type InsertGhostVariety = typeof ghostVarieties.$inferInsert;

// Relations
// ============================================================================
// GENOMIC MOLECULE LINKS (Liaisons génomiques molécules - G1-G3)
// ============================================================================

export const genomicMoleculeLinks = mysqlTable("genomic_molecule_links", {
  id: int("id").autoincrement().primaryKey(),
  // Entités liées
  referenceId: int("reference_id").notNull(),
  moleculeId: int("molecule_id").notNull(),
  // Métadonnées de la liaison
  linkType: mysqlEnum("link_type", [
    "biosynthesis",
    "characterization",
    "quantification",
    "pathway",
    "gene_association",
    "regulation",
    "evolution",
    "application",
    "other"
  ]).default("characterization"),
  genomicAxis: mysqlEnum("genomic_axis", ["G1", "G2", "G3"]).notNull(),
  relevanceScore: int("relevance_score").default(50),
  confidence: mysqlEnum("confidence", ["high", "medium", "low"]).default("medium"),
  // Données scientifiques
  geneNames: json("gene_names").$type<string[]>(),
  pathwayName: varchar("pathway_name", { length: 255 }),
  enzymeNames: json("enzyme_names").$type<string[]>(),
  notes: text("notes"),
  excerpt: text("excerpt"),
  pageNumbers: varchar("page_numbers", { length: 50 }),
  // Métadonnées
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  referenceIdx: index("genomic_mol_link_ref_idx").on(table.referenceId),
  moleculeIdx: index("genomic_mol_link_mol_idx").on(table.moleculeId),
  axisIdx: index("genomic_mol_link_axis_idx").on(table.genomicAxis),
  uniqueLink: uniqueIndex("unique_genomic_ref_mol").on(table.referenceId, table.moleculeId),
}));

export type GenomicMoleculeLink = typeof genomicMoleculeLinks.$inferSelect;
export type InsertGenomicMoleculeLink = typeof genomicMoleculeLinks.$inferInsert;

// Relations
// ============================================================================
// GENOMIC PLANT LINKS (Liaisons génomiques plantes - G1-G3)
// ============================================================================

export const genomicPlantLinks = mysqlTable("genomic_plant_links", {
  id: int("id").autoincrement().primaryKey(),
  // Entités liées
  referenceId: int("reference_id").notNull(),
  plantId: int("plant_id").notNull(),
  // Métadonnées de la liaison
  linkType: mysqlEnum("link_type", [
    "genome_sequencing",
    "transcriptomics",
    "metabolomics",
    "phylogenetics",
    "breeding",
    "gene_editing",
    "marker_development",
    "comparative",
    "other"
  ]).default("genome_sequencing"),
  genomicAxis: mysqlEnum("genomic_axis", ["G1", "G2", "G3"]).notNull(),
  relevanceScore: int("relevance_score").default(50),
  confidence: mysqlEnum("confidence", ["high", "medium", "low"]).default("medium"),
  // Données scientifiques
  genomeVersion: varchar("genome_version", { length: 100 }),
  assemblyAccession: varchar("assembly_accession", { length: 100 }),
  sequencingMethod: varchar("sequencing_method", { length: 255 }),
  notes: text("notes"),
  excerpt: text("excerpt"),
  // Métadonnées
  createdBy: int("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  referenceIdx: index("genomic_plant_link_ref_idx").on(table.referenceId),
  plantIdx: index("genomic_plant_link_plant_idx").on(table.plantId),
  axisIdx: index("genomic_plant_link_axis_idx").on(table.genomicAxis),
  uniqueLink: uniqueIndex("unique_genomic_ref_plant").on(table.referenceId, table.plantId),
}));

export type GenomicPlantLink = typeof genomicPlantLinks.$inferSelect;
export type InsertGenomicPlantLink = typeof genomicPlantLinks.$inferInsert;

// Relations
// ============================================================================
// AROMATIC RARITIES — Raretés olfactives (ex JSON statique)
// ============================================================================
export const aromaticRarities = mysqlTable("aromatic_rarities", {
  id: int("id").autoincrement().primaryKey(),
  rarityId: varchar("rarity_id", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  geography: text("geography"),
  rarityRegime: varchar("rarity_regime", { length: 100 }),
  culturalStatus: varchar("cultural_status", { length: 100 }),
  sourceType: varchar("source_type", { length: 100 }),
  extractability: varchar("extractability", { length: 50 }),
  keyMolecules: text("key_molecules"),
  absorbePotential: text("absorbe_potential"),
  notes: text("notes"),
  references: text("references"),
  temporalBehavior: varchar("temporal_behavior", { length: 50 }),
  industrialProducts: text("industrial_products"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  rarityIdIdx: index("aromatic_rarities_rarity_id_idx").on(table.rarityId),
  categoryIdx: index("aromatic_rarities_category_idx").on(table.category),
}));

export type AromaticRarity = typeof aromaticRarities.$inferSelect;
export type InsertAromaticRarity = typeof aromaticRarities.$inferInsert;

// ============================================================================
// NOSE PHASE 1 — OLFACTIVE EMISSIONS (od:L12 Smell Emission)
// Formalise les conditions d'émission d'une odeur (données GC-MS structurées)
// Ontologie NOSE / Odeuropa — https://odeuropa.eu
// ============================================================================

export const olfactiveEmissions = mysqlTable("olfactive_emissions", {
  id: int("id").autoincrement().primaryKey(),

  // Source de l'émission (od:L12 Smell Emission)
  plantId: int("plant_id"),          // Plante source (FK → plants.id)
  moleculeId: int("molecule_id"),    // Molécule émise (FK → molecules.id)
  tabacId: int("tabac_id"),          // Tabac source si applicable (FK → tabacs.id)

  // Conditions d'émission
  plantPart: mysqlEnum("plant_part", [
    "fleur", "feuille", "fruit", "zeste", "graine", "ecorce",
    "bois", "racine", "rhizome", "resine", "plante_entiere", "autre"
  ]),
  extractionMethod: mysqlEnum("extraction_method", [
    "hydrodistillation", "entrainement_vapeur", "expression_a_froid",
    "extraction_co2", "enfleurage", "maceration", "teinture",
    "solvant_organique", "pyrolyse", "headspace", "spme", "autre"
  ]),

  // Quantification
  percentage: decimal("percentage", { precision: 8, scale: 4 }),
  percentageMin: decimal("percentage_min", { precision: 8, scale: 4 }),
  percentageMax: decimal("percentage_max", { precision: 8, scale: 4 }),
  concentrationPpm: decimal("concentration_ppm", { precision: 12, scale: 4 }),
  concentrationUnit: varchar("concentration_unit", { length: 20 }).default("%"),

  // Contexte analytique (od:L2 Stimulus Generation)
  analysisMethod: mysqlEnum("analysis_method", [
    "gc_ms", "gc_fid", "hplc", "rnm", "headspace_gcms", "spme_gcms", "autre"
  ]),
  analysisSource: varchar("analysis_source", { length: 500 }),  // DOI ou référence
  geographicOrigin: varchar("geographic_origin", { length: 255 }),
  retentionTime: decimal("retention_time", { precision: 8, scale: 4 }),
  matchQuality: int("match_quality"),  // % de correspondance spectrale (0-100)

  // Contexte temporel (sources historiques)
  periodStart: int("period_start"),   // Peut être négatif (Antiquité)
  periodEnd: int("period_end"),

  // Rôle dans le profil olfactif
  role: mysqlEnum("role", ["majeur", "secondaire", "trace", "variable", "signature"]),
  isSignature: boolean("is_signature").default(false),

  // Source de données (traçabilité)
  sourceTable: varchar("source_table", { length: 100 }),  // table d'origine pour migration
  sourceId: int("source_id"),                              // id dans la table d'origine

  // Métadonnées
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  plantIdx: index("oe_plant_idx").on(table.plantId),
  moleculeIdx: index("oe_molecule_idx").on(table.moleculeId),
  tabacIdx: index("oe_tabac_idx").on(table.tabacId),
  methodIdx: index("oe_method_idx").on(table.analysisMethod),
  roleIdx: index("oe_role_idx").on(table.role),
}));

export type OlfactiveEmission = typeof olfactiveEmissions.$inferSelect;
export type InsertOlfactiveEmission = typeof olfactiveEmissions.$inferInsert;

// ============================================================================
// VARIETY IMAGES (Morphological images for plant varieties)
// ============================================================================

export const varietyImages = mysqlTable("variety_images", {
  id: int("id").autoincrement().primaryKey(),
  
  // Reference to the variety (genus + species + cultivar)
  genus: varchar("genus", { length: 100 }).notNull(),        // e.g., "Nicotiana", "Cannabis", "Citrus"
  species: varchar("species", { length: 100 }).notNull(),    // e.g., "tabacum", "sativa", "sinensis"
  cultivar: varchar("cultivar", { length: 255 }),            // e.g., "Basma", "Samsun", optional
  
  // Image type and metadata
  imageType: mysqlEnum("imageType", ["leaf", "flower", "fruit", "bark", "whole_plant", "other"]).notNull(),
  
  // S3 storage reference
  fileKey: varchar("file_key", { length: 500 }).notNull(),   // S3 object key (e.g., "variety-images/nicotiana-tabacum-leaf-abc123.jpg")
  fileUrl: text("file_url").notNull(),                        // Public S3 URL or CDN URL
  fileName: varchar("file_name", { length: 255 }).notNull(), // Original file name
  mimeType: varchar("mime_type", { length: 50 }).notNull(),  // e.g., "image/jpeg", "image/png"
  fileSize: int("file_size").notNull(),                       // File size in bytes
  
  // Image metadata
  description: text("description"),                           // User-provided description
  source: varchar("source", { length: 255 }),                // Source of the image (e.g., "Wikimedia Commons", "user_upload")
  sourceUrl: text("source_url"),                              // URL to original source if applicable
  attribution: varchar("attribution", { length: 255 }),      // Attribution/credit information
  
  // Quality and status
  quality: mysqlEnum("quality", ["low", "medium", "high", "excellent"]).default("medium"),
  isVerified: boolean("is_verified").default(false),          // Admin verification status
  
  // Audit
  uploadedBy: int("uploaded_by"),                             // User ID who uploaded
  verifiedBy: int("verified_by"),                             // Admin ID who verified
  verifiedAt: timestamp("verified_at"),
  
  // Link to plant entity (optional — enables "Voir la fiche plante" in lightbox)
  plantId: int("plant_id"),                                    // FK → plants.id (nullable)

  // Link to terroir/region (optional — enables geographic filtering)
  terroirId: int("terroir_id"),                                // FK → terroirs.id (nullable)
  terroirName: varchar("terroir_name", { length: 255 }),       // Denormalized name for fast filtering

  // Display order for drag-and-drop reordering
  sortOrder: int("sort_order").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  genusSpeciesIdx: index("variety_images_genus_species_idx").on(table.genus, table.species),
  imageTypeIdx: index("variety_images_type_idx").on(table.imageType),
  verifiedIdx: index("variety_images_verified_idx").on(table.isVerified),
  sortOrderIdx: index("variety_images_sort_idx").on(table.genus, table.species, table.sortOrder),
}));

export type VarietyImage = typeof varietyImages.$inferSelect;
export type InsertVarietyImage = typeof varietyImages.$inferInsert;

// ============================================================================
// PYRFUME INTEGRATION TABLES
// Source: https://github.com/pyrfume/pyrfume-data (MIT License)
// 10 300+ molécules, 60+ datasets de perception olfactive
// ============================================================================

// Table de mapping entre molécules PERFUMUM et Pyrfume (via CID PubChem)
export const pyrfumeMoleculeMapping = mysqlTable("pyrfume_molecule_mapping", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull(), // FK → molecules.id
  pyrfumeCid: int("pyrfume_cid").notNull(), // CID PubChem dans Pyrfume
  matchMethod: mysqlEnum("match_method", ["cid", "cas", "smiles", "name"]).notNull(),
  confidence: float("confidence").default(1.0),
  pyrfumeName: varchar("pyrfume_name", { length: 500 }),
  pyrfumeSmiles: text("pyrfume_smiles"),
  pyrfumeIupac: text("pyrfume_iupac"),
  pyrfumeMw: float("pyrfume_mw"), // Molecular weight from Pyrfume
  matchedAt: timestamp("matched_at").defaultNow().notNull(),
}, (table) => ({
  moleculeIdx: index("pyrfume_mapping_molecule_idx").on(table.moleculeId),
  cidIdx: index("pyrfume_mapping_cid_idx").on(table.pyrfumeCid),
  uniqueMapping: index("pyrfume_mapping_unique_idx").on(table.moleculeId, table.pyrfumeCid),
}));
export type PyrfumeMoleculeMapping = typeof pyrfumeMoleculeMapping.$inferSelect;
export type InsertPyrfumeMoleculeMapping = typeof pyrfumeMoleculeMapping.$inferInsert;

// Table des descripteurs olfactifs Pyrfume (Dravnieks, Leffingwell, Good Scents, etc.)
export const pyrfumeOlfactoryDescriptors = mysqlTable("pyrfume_olfactory_descriptors", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull(), // FK → molecules.id
  dataset: varchar("dataset", { length: 50 }).notNull(), // 'dravnieks_1985', 'leffingwell', 'goodscents', 'keller_2016', etc.
  descriptor: varchar("descriptor", { length: 200 }).notNull(), // Nom du descripteur olfactif
  value: float("value"), // Valeur numérique normalisée (0-5 pour Dravnieks, etc.)
  rawValue: text("raw_value"), // Valeur brute originale
  sourceUrl: varchar("source_url", { length: 500 }), // URL vers le dataset source
  importedAt: timestamp("imported_at").defaultNow().notNull(),
}, (table) => ({
  moleculeIdx: index("pyrfume_descriptors_molecule_idx").on(table.moleculeId),
  datasetIdx: index("pyrfume_descriptors_dataset_idx").on(table.dataset),
  descriptorIdx: index("pyrfume_descriptors_descriptor_idx").on(table.descriptor),
  moleculeDatasetIdx: index("pyrfume_descriptors_mol_dataset_idx").on(table.moleculeId, table.dataset),
}));
export type PyrfumeOlfactoryDescriptor = typeof pyrfumeOlfactoryDescriptors.$inferSelect;
export type InsertPyrfumeOlfactoryDescriptor = typeof pyrfumeOlfactoryDescriptors.$inferInsert;

// Table des embeddings moléculaires (Morgan fingerprints, Mordred descriptors)
export const pyrfumeEmbeddings = mysqlTable("pyrfume_embeddings", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull(), // FK → molecules.id
  embeddingType: mysqlEnum("embedding_type", ["morgan", "mordred"]).notNull(),
  embeddingVector: json("embedding_vector").notNull(), // JSON array of numbers
  dimensions: int("dimensions"), // 2048 for Morgan, 1826 for Mordred
  importedAt: timestamp("imported_at").defaultNow().notNull(),
}, (table) => ({
  moleculeIdx: index("pyrfume_embeddings_molecule_idx").on(table.moleculeId),
  typeIdx: index("pyrfume_embeddings_type_idx").on(table.embeddingType),
  moleculeTypeIdx: index("pyrfume_embeddings_mol_type_idx").on(table.moleculeId, table.embeddingType),
}));
export type PyrfumeEmbedding = typeof pyrfumeEmbeddings.$inferSelect;
export type InsertPyrfumeEmbedding = typeof pyrfumeEmbeddings.$inferInsert;

// Table des restrictions IFRA (International Fragrance Association)
export const pyrfumeIfraRestrictions = mysqlTable("pyrfume_ifra_restrictions", {
  id: int("id").autoincrement().primaryKey(),
  moleculeId: int("molecule_id").notNull(), // FK → molecules.id
  restrictionType: varchar("restriction_type", { length: 50 }), // 'prohibition', 'restriction', 'specification'
  maxConcentration: float("max_concentration"), // Concentration max autorisée (%)
  applicationCategory: varchar("application_category", { length: 100 }), // Catégorie d'application IFRA
  ifraAmendment: varchar("ifra_amendment", { length: 20 }), // Ex: '49th', '50th'
  notes: text("notes"),
  sourceUrl: varchar("source_url", { length: 500 }),
  importedAt: timestamp("imported_at").defaultNow().notNull(),
}, (table) => ({
  moleculeIdx: index("pyrfume_ifra_molecule_idx").on(table.moleculeId),
  restrictionIdx: index("pyrfume_ifra_restriction_idx").on(table.restrictionType),
  categoryIdx: index("pyrfume_ifra_category_idx").on(table.applicationCategory),
}));
export type PyrfumeIfraRestriction = typeof pyrfumeIfraRestrictions.$inferSelect;
export type InsertPyrfumeIfraRestriction = typeof pyrfumeIfraRestrictions.$inferInsert;

// Table de métadonnées des datasets Pyrfume importés
export const pyrfumeDatasets = mysqlTable("pyrfume_datasets", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // 'dravnieks_1985', 'leffingwell', etc.
  displayName: varchar("display_name", { length: 200 }).notNull(),
  author: varchar("author", { length: 200 }),
  year: int("year"),
  description: text("description"),
  moleculeCount: int("molecule_count").default(0), // Nombre de molécules dans ce dataset
  matchedCount: int("matched_count").default(0), // Nombre matchées avec PERFUMUM
  sourceUrl: varchar("source_url", { length: 500 }),
  citation: text("citation"), // Citation académique complète
  license: varchar("license", { length: 50 }).default("MIT"),
  importStatus: mysqlEnum("import_status", ["pending", "importing", "completed", "error"]).default("pending"),
  lastImportedAt: timestamp("last_imported_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  nameIdx: index("pyrfume_datasets_name_idx").on(table.name),
  statusIdx: index("pyrfume_datasets_status_idx").on(table.importStatus),
}));
export type PyrfumeDataset = typeof pyrfumeDatasets.$inferSelect;
export type InsertPyrfumeDataset = typeof pyrfumeDatasets.$inferInsert;
