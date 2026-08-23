import { index, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Journal immuable des réassociations administratives de liens de descripteurs.
 * Il conserve le contexte archivé et la cible retenue afin de rendre toute
 * décision éditoriale réversible et traçable dans le temps.
 */
export const descriptorLinkAuditLog = mysqlTable(
  "descriptor_link_audit_log",
  {
    id: int().primaryKey().autoincrement(),
    linkType: varchar("link_type", { length: 20 }).notNull(),
    linkId: int("link_id").notNull(),
    descriptorId: varchar("descriptor_id", { length: 100 }).notNull(),
    archivedTargetId: int("archived_target_id"),
    archivedTargetName: varchar("archived_target_name", { length: 500 }),
    targetEntityId: int("target_entity_id").notNull(),
    targetEntityName: varchar("target_entity_name", { length: 500 }).notNull(),
    suggestionReason: varchar("suggestion_reason", { length: 255 }),
    confidence: varchar("confidence", { length: 20 }),
    actorUserId: int("actor_user_id").notNull(),
    actorName: varchar("actor_name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    linkIdx: index("idx_descriptor_link_audit_link").on(table.linkType, table.linkId),
    descriptorIdx: index("idx_descriptor_link_audit_descriptor").on(table.descriptorId),
    actorIdx: index("idx_descriptor_link_audit_actor").on(table.actorUserId),
  })
);
