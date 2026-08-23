import { index, int, json, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Zone de transit du pilote Zenodo : les propositions restent séparées des
 * descripteurs et associations scientifiques de production jusqu’à validation.
 */
export const olfactoryTermPilotProposals = mysqlTable(
  "olfactory_term_pilot_proposals",
  {
    id: int().primaryKey().autoincrement(),
    externalTermId: varchar("external_term_id", { length: 80 }).notNull(),
    sourceBatchId: varchar("source_batch_id", { length: 80 }).notNull(),
    termOriginal: varchar("term_original", { length: 500 }).notNull(),
    languageCode: varchar("language_code", { length: 32 }).notNull(),
    englishGlossSource: varchar("english_gloss_source", { length: 500 }),
    pinyin: varchar("pinyin", { length: 500 }),
    frenchGlossProposed: varchar("french_gloss_proposed", { length: 500 }),
    sourceCategory: varchar("source_category", { length: 80 }).notNull(),
    oai: varchar("oai", { length: 40 }),
    osi: varchar("osi", { length: 40 }),
    canonicalDescriptorCandidate: varchar("canonical_descriptor_candidate", { length: 100 }),
    candidateRelationType: varchar("candidate_relation_type", { length: 40 }),
    candidateEntityType: varchar("candidate_entity_type", { length: 40 }),
    candidateEntityId: int("candidate_entity_id"),
    llmRationale: text("llm_rationale"),
    confidence: varchar("confidence", { length: 20 }),
    sourceDoi: varchar("source_doi", { length: 255 }).notNull(),
    sourceUrl: varchar("source_url", { length: 1000 }).notNull(),
    license: varchar("license", { length: 80 }).notNull(),
    rawSource: json("raw_source"),
    llmProposal: json("llm_proposal"),
    status: varchar("status", { length: 40 }).default("proposed").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    externalTermUnique: uniqueIndex("uq_olfactory_term_pilot_external").on(table.externalTermId),
    batchIdx: index("idx_olfactory_term_pilot_batch").on(table.sourceBatchId),
    statusIdx: index("idx_olfactory_term_pilot_status").on(table.status),
    categoryIdx: index("idx_olfactory_term_pilot_category").on(table.sourceCategory),
  })
);

/** Revue humaine append-only des propositions issues du pilote. */
export const olfactoryTermPilotReviews = mysqlTable(
  "olfactory_term_pilot_reviews",
  {
    id: int().primaryKey().autoincrement(),
    proposalId: int("proposal_id").notNull(),
    reviewerUserId: int("reviewer_user_id"),
    reviewerName: varchar("reviewer_name", { length: 255 }),
    reviewerRole: varchar("reviewer_role", { length: 40 }).notNull(),
    decision: varchar("decision", { length: 40 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    proposalIdx: index("idx_olfactory_term_review_proposal").on(table.proposalId),
    reviewerIdx: index("idx_olfactory_term_review_reviewer").on(table.reviewerUserId),
    decisionIdx: index("idx_olfactory_term_review_decision").on(table.decision),
  })
);

/**
 * Registre immuable de transit final : une ligne confirme seulement que deux
 * acceptations humaines ont été réunies. Aucun descripteur de production n’est
 * créé ni modifié à ce stade.
 */
export const olfactoryTermPilotFinalizations = mysqlTable(
  "olfactory_term_pilot_finalizations",
  {
    id: int().primaryKey().autoincrement(),
    proposalId: int("proposal_id").notNull(),
    sourceBatchId: varchar("source_batch_id", { length: 80 }).notNull(),
    linguisticReviewId: int("linguistic_review_id").notNull(),
    domainReviewId: int("domain_review_id").notNull(),
    finalizedByUserId: int("finalized_by_user_id"),
    finalizedByName: varchar("finalized_by_name", { length: 255 }),
    snapshot: json("snapshot").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    proposalUnique: uniqueIndex("uq_olfactory_term_finalization_proposal").on(table.proposalId),
    batchIdx: index("idx_olfactory_term_finalization_batch").on(table.sourceBatchId),
    finalizedByIdx: index("idx_olfactory_term_finalization_user").on(table.finalizedByUserId),
  })
);
