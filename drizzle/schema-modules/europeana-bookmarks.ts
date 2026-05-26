import { mysqlTable, int, varchar, text, timestamp, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/**
 * Table europeana_bookmarks
 * Sauvegarde des ressources Europeana liées à des plantes/molécules PERFUMUM.
 * Sert de bibliothèque iconographique personnelle pour le projet de recherche.
 */
export const europeanaBookmarks = mysqlTable(
  "europeana_bookmarks",
  {
    id: int("id").autoincrement().primaryKey(),
    // Identifiant Europeana (ex: /9200365/BibliographicResource_3000126284840)
    europeanaId: varchar("europeana_id", { length: 500 }).notNull(),
    // Thème PERFUMUM d'origine (ex: rose_damas, encens, tabac_ottoman)
    theme: varchar("theme", { length: 100 }),
    // Métadonnées de la ressource
    title: varchar("title", { length: 500 }).notNull(),
    creator: varchar("creator", { length: 500 }),
    date: varchar("date", { length: 100 }),
    institution: varchar("institution", { length: 500 }),
    country: varchar("country", { length: 100 }),
    // URLs
    europeanaUrl: varchar("europeana_url", { length: 1000 }),
    thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
    thumbnailUrlLarge: varchar("thumbnail_url_large", { length: 1000 }),
    iiifManifestUrl: varchar("iiif_manifest_url", { length: 1000 }),
    // Droits
    rights: varchar("rights", { length: 500 }),
    rightsLabel: varchar("rights_label", { length: 200 }),
    // Type de média
    mediaType: varchar("media_type", { length: 50 }),
    // Liens PERFUMUM (optionnels — une ressource peut être liée à plusieurs entités)
    linkedPlantId: int("linked_plant_id"),
    linkedMoleculeId: int("linked_molecule_id"),
    // Notes personnelles du chercheur
    researchNotes: text("research_notes"),
    // Tags personnalisés (JSON array de strings)
    tags: text("tags"),
    // Timestamps
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    europeanaIdIdx: index("idx_europeana_id").on(table.europeanaId),
    themeIdx: index("idx_theme").on(table.theme),
    plantIdx: index("idx_linked_plant").on(table.linkedPlantId),
    moleculeIdx: index("idx_linked_molecule").on(table.linkedMoleculeId),
  })
);

export type EuropeanaBookmark = typeof europeanaBookmarks.$inferSelect;
export type InsertEuropeanaBookmark = typeof europeanaBookmarks.$inferInsert;
