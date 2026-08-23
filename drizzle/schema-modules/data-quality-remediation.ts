import { index, int, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * File de revue non destructive : chaque anomalie ou proposition d’enrichissement
 * reste séparée de l’entité scientifique jusqu’à une décision humaine explicite.
 */
export const dataQualityRemediationCases = mysqlTable(
  "data_quality_remediation_cases",
  {
    id: int().primaryKey().autoincrement(),
    caseType: varchar("case_type", { length: 48 }).notNull(),
    entityType: varchar("entity_type", { length: 48 }).notNull(),
    entityId: int("entity_id"),
    groupKey: varchar("group_key", { length: 512 }).notNull(),
    severity: varchar("severity", { length: 20 }).notNull().default("medium"),
    status: varchar("status", { length: 24 }).notNull().default("open"),
    title: varchar("title", { length: 500 }).notNull(),
    currentValue: text("current_value"),
    proposedValue: text("proposed_value"),
    evidence: text("evidence"),
    sourceUrl: varchar("source_url", { length: 1000 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    uniqueCase: uniqueIndex("uq_quality_case_type_group").on(table.caseType, table.groupKey),
    typeStatusIdx: index("idx_quality_case_type_status").on(table.caseType, table.status),
    entityIdx: index("idx_quality_case_entity").on(table.entityType, table.entityId),
    groupIdx: index("idx_quality_case_group").on(table.groupKey),
  })
);

/** Journal append-only des décisions de revue ; aucune action n’écrit dans les tables scientifiques. */
export const dataQualityRemediationActions = mysqlTable(
  "data_quality_remediation_actions",
  {
    id: int().primaryKey().autoincrement(),
    caseId: int("case_id").notNull(),
    actionType: varchar("action_type", { length: 48 }).notNull(),
    decision: varchar("decision", { length: 24 }).notNull(),
    rationale: text("rationale"),
    snapshot: text("snapshot"),
    actorUserId: int("actor_user_id").notNull(),
    actorName: varchar("actor_name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    caseIdx: index("idx_quality_action_case").on(table.caseId),
    actorIdx: index("idx_quality_action_actor").on(table.actorUserId),
  })
);
