import { boolean, date, decimal, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { and} from "drizzle-orm";

import { accords } from "./accords";
import { users } from "./core";
import { plants } from "./plants";
import { sustainableAlternatives } from "./raw-materials";

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
  wikidataQid: varchar("wikidata_qid", { length: 20 }), // Wikidata QID (e.g., "Q79" for Égypte)
  wikidataEnrichedAt: timestamp("wikidata_enriched_at"), // When Wikidata data was last fetched
  europeanaEntityId: varchar("europeana_entity_id", { length: 100 }), // Europeana entity URI
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
// OLFACTORY TRADITIONS (Traditions olfactives pour H3)
// ============================================================================

/**
 * Documented olfactory traditions for Heritage & Conservation (H3).
 * Stores information about historical perfume traditions, ancient recipes,
 * and cultural olfactory practices.
 */
export const olfactoryTraditions = mysqlTable("olfactory_traditions", {
  id: int("id").autoincrement().primaryKey(),
  // Identification
  code: varchar("code", { length: 50 }).notNull().unique(), // e.g., "TRAD-EGY-001"
  name: varchar("name", { length: 255 }).notNull(),
  // Historical context
  period: varchar("period", { length: 100 }), // e.g., "Antiquité égyptienne", "Moyen Âge"
  startYear: int("start_year"), // Année de début (peut être négative pour avant J.-C.)
  endYear: int("end_year"),     // Année de fin
  // Geographic context
  region: varchar("region", { length: 255 }), // e.g., "Égypte", "Mésopotamie"
  civilization: varchar("civilization", { length: 255 }), // e.g., "Égyptienne", "Romaine"
  // Description
  description: text("description"),
  historicalContext: text("historical_context"),
  // Ingredients and techniques
  knownIngredients: json("known_ingredients").$type<string[]>(),
  techniques: json("techniques").$type<string[]>(),
  // Reconstruction status
  reconstructionStatus: mysqlEnum("reconstruction_status", [
    "documented",      // Documenté mais non reconstruit
    "partial",         // Partiellement reconstruit
    "reconstructed",   // Entièrement reconstruit
    "speculative"      // Reconstruction spéculative
  ]).default("documented"),
  // Sources
  primarySources: text("primary_sources"), // Sources primaires (textes anciens)
  modernSources: text("modern_sources"),   // Sources modernes (études)
  // Tags
  tags: json("tags").$type<string[]>(),
  // Metadata
  createdBy: int("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  codeIdx: uniqueIndex("tradition_code_idx").on(table.code),
  periodIdx: index("tradition_period_idx").on(table.period),
  regionIdx: index("tradition_region_idx").on(table.region),
  statusIdx: index("tradition_status_idx").on(table.reconstructionStatus),
}));

export type OlfactoryTradition = typeof olfactoryTraditions.$inferSelect;
export type InsertOlfactoryTradition = typeof olfactoryTraditions.$inferInsert;

// Relations pour olfactoryTraditions