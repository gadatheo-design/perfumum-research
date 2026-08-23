import { z } from "zod";
import { sql } from "drizzle-orm";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

const reviewDecision = z.enum(["accepted", "accepted_with_context", "needs_research", "rejected"]);
const reviewerRole = z.enum(["linguistic", "domain"]);
const finalizationConfirmation = "METTRE EN TRANSIT";
type ReviewDecision = z.infer<typeof reviewDecision>;

function deriveProposalStatus(decisions: ReviewDecision[]) {
  if (decisions.includes("rejected")) return "rejected";
  if (decisions.includes("needs_research")) return "needs_research";
  if (decisions.length < 2) return "under_review";
  if (decisions.includes("accepted_with_context")) return "accepted_with_context";
  return "accepted";
}

function isAccepted(decision: string | undefined) {
  return decision === "accepted" || decision === "accepted_with_context";
}

function latestReviewsByRole(reviews: any[]) {
  const latest = new Map<string, any>();
  for (const review of reviews) {
    if (!latest.has(review.reviewer_role)) latest.set(review.reviewer_role, review);
  }
  return latest;
}

async function getEligibleFinalizations(db: any, batchId: string, requestedIds?: number[]) {
  const [proposalRows] = await db.execute(requestedIds?.length
    ? sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${batchId} AND id IN (${sql.join(requestedIds.map((id) => sql`${id}`), sql`, `)}) ORDER BY id`
    : sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${batchId} ORDER BY id`) as any;
  const ids = (proposalRows ?? []).map((proposal: any) => proposal.id);
  if (!ids.length) return [];
  const [reviewRows] = await db.execute(sql`
    SELECT * FROM olfactory_term_pilot_reviews
    WHERE proposal_id IN (${sql.join(ids.map((id: number) => sql`${id}`), sql`, `)})
    ORDER BY created_at DESC, id DESC
  `) as any;
  const [finalizedRows] = await db.execute(sql`
    SELECT proposal_id FROM olfactory_term_pilot_finalizations
    WHERE proposal_id IN (${sql.join(ids.map((id: number) => sql`${id}`), sql`, `)})
  `) as any;
  const finalized = new Set((finalizedRows ?? []).map((row: any) => row.proposal_id));
  const grouped = new Map<number, any[]>();
  for (const review of reviewRows ?? []) {
    const entries = grouped.get(review.proposal_id) ?? [];
    entries.push(review);
    grouped.set(review.proposal_id, entries);
  }

  return (proposalRows ?? []).flatMap((proposal: any) => {
    const latest = latestReviewsByRole(grouped.get(proposal.id) ?? []);
    const linguistic = latest.get("linguistic");
    const domain = latest.get("domain");
    if (!linguistic || !domain || !isAccepted(linguistic.decision) || !isAccepted(domain.decision) || finalized.has(proposal.id)) return [];
    return [{ proposal, linguistic, domain }];
  });
}

export const zenodoOlfactoryPilotRouter = router({
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [rows] = await db.execute(sql`SELECT status, COUNT(*) AS count FROM olfactory_term_pilot_proposals GROUP BY status`) as any;
    const counts = Object.fromEntries((rows ?? []).map((row: any) => [row.status, Number(row.count)]));
    const [reviewRows] = await db.execute(sql`SELECT COUNT(*) AS count FROM olfactory_term_pilot_reviews`) as any;
    const [finalizationRows] = await db.execute(sql`SELECT COUNT(*) AS count FROM olfactory_term_pilot_finalizations`) as any;
    return {
      total: Object.values(counts).reduce((total: number, count: any) => total + Number(count), 0),
      proposed: Number(counts.proposed ?? 0), preannotated: Number(counts.preannotated ?? 0), underReview: Number(counts.under_review ?? 0),
      accepted: Number(counts.accepted ?? 0), acceptedWithContext: Number(counts.accepted_with_context ?? 0),
      needsResearch: Number(counts.needs_research ?? 0), rejected: Number(counts.rejected ?? 0),
      finalizedTransit: Number(counts.finalized_transit ?? 0),
      reviewCount: Number(reviewRows?.[0]?.count ?? 0), finalizationCount: Number(finalizationRows?.[0]?.count ?? 0),
    };
  }),

  listProposals: adminProcedure.input(z.object({ batchId: z.string().default("zenodo-cocd-50-v1"), status: z.string().optional() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [proposalRows] = await db.execute(input.status
      ? sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId} AND status = ${input.status} ORDER BY id`
      : sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId} ORDER BY id`) as any;
    const [reviewRows] = await db.execute(sql`SELECT r.* FROM olfactory_term_pilot_reviews r INNER JOIN olfactory_term_pilot_proposals p ON p.id = r.proposal_id WHERE p.source_batch_id = ${input.batchId} ORDER BY r.created_at DESC, r.id DESC`) as any;
    const [finalizationRows] = await db.execute(sql`SELECT proposal_id, created_at FROM olfactory_term_pilot_finalizations WHERE source_batch_id = ${input.batchId}`) as any;
    const reviewsByProposal = new Map<number, any[]>();
    for (const review of reviewRows ?? []) {
      const entries = reviewsByProposal.get(review.proposal_id) ?? [];
      entries.push({ id: review.id, reviewerUserId: review.reviewer_user_id, reviewerName: review.reviewer_name, reviewerRole: review.reviewer_role, decision: review.decision, notes: review.notes, createdAt: review.created_at });
      reviewsByProposal.set(review.proposal_id, entries);
    }
    const finalizedAt = new Map((finalizationRows ?? []).map((row: any) => [row.proposal_id, row.created_at]));
    return (proposalRows ?? []).map((proposal: any) => ({
      id: proposal.id, externalTermId: proposal.external_term_id, sourceBatchId: proposal.source_batch_id, termOriginal: proposal.term_original,
      languageCode: proposal.language_code, englishGlossSource: proposal.english_gloss_source, pinyin: proposal.pinyin, frenchGlossProposed: proposal.french_gloss_proposed,
      sourceCategory: proposal.source_category, oai: proposal.oai, osi: proposal.osi, canonicalDescriptorCandidate: proposal.canonical_descriptor_candidate,
      candidateRelationType: proposal.candidate_relation_type, candidateEntityType: proposal.candidate_entity_type, candidateEntityId: proposal.candidate_entity_id,
      llmRationale: proposal.llm_rationale, confidence: proposal.confidence, sourceDoi: proposal.source_doi, sourceUrl: proposal.source_url,
      license: proposal.license, status: proposal.status, createdAt: proposal.created_at, updatedAt: proposal.updated_at,
      finalizedAt: finalizedAt.get(proposal.id) ?? null, reviews: reviewsByProposal.get(proposal.id) ?? [],
    }));
  }),

  submitReview: adminProcedure.input(z.object({ proposalId: z.number().int().positive(), reviewerRole, decision: reviewDecision, notes: z.string().trim().max(4000).optional() })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [proposalRows] = await db.execute(sql`SELECT id FROM olfactory_term_pilot_proposals WHERE id = ${input.proposalId} LIMIT 1`) as any;
    if (!proposalRows?.[0]) throw new Error("Pilot proposal not found");
    const [finalizationRows] = await db.execute(sql`SELECT id FROM olfactory_term_pilot_finalizations WHERE proposal_id = ${input.proposalId} LIMIT 1`) as any;
    if (finalizationRows?.[0]) throw new Error("Finalized proposal cannot be reviewed again");
    await db.execute(sql`INSERT INTO olfactory_term_pilot_reviews (proposal_id, reviewer_user_id, reviewer_name, reviewer_role, decision, notes) VALUES (${input.proposalId}, ${ctx.user.id}, ${ctx.user.name ?? null}, ${input.reviewerRole}, ${input.decision}, ${input.notes ?? null})`);
    const [rows] = await db.execute(sql`SELECT reviewer_role, decision FROM olfactory_term_pilot_reviews WHERE proposal_id = ${input.proposalId} ORDER BY created_at DESC, id DESC`) as any;
    const latestByRole = latestReviewsByRole(rows ?? []);
    const status = deriveProposalStatus(Array.from(latestByRole.values()).map((review: any) => review.decision as ReviewDecision));
    await db.execute(sql`UPDATE olfactory_term_pilot_proposals SET status = ${status} WHERE id = ${input.proposalId}`);
    return { success: true, status, reviewedRoles: Array.from(latestByRole.keys()) };
  }),

  getFinalizationPreview: adminProcedure.input(z.object({ batchId: z.string().default("zenodo-cocd-50-v1") })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const eligible = await getEligibleFinalizations(db, input.batchId);
    return eligible.map(({ proposal, linguistic, domain }: { proposal: any; linguistic: any; domain: any }) => ({
      proposalId: proposal.id, termOriginal: proposal.term_original, pinyin: proposal.pinyin, englishGlossSource: proposal.english_gloss_source,
      frenchGlossProposed: proposal.french_gloss_proposed, sourceCategory: proposal.source_category, canonicalDescriptorCandidate: proposal.canonical_descriptor_candidate,
      linguisticDecision: linguistic.decision, domainDecision: domain.decision, linguisticReviewId: linguistic.id, domainReviewId: domain.id,
    }));
  }),

  finalizeApprovedProposals: adminProcedure.input(z.object({
    batchId: z.string().default("zenodo-cocd-50-v1"),
    proposalIds: z.array(z.number().int().positive()).min(1).max(50),
    confirmation: z.literal(finalizationConfirmation),
  })).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const uniqueIds = [...new Set(input.proposalIds)];
    const eligible = await getEligibleFinalizations(db, input.batchId, uniqueIds);
    if (eligible.length !== uniqueIds.length) throw new Error("Only double-approved and non-finalized proposals can enter final transit");
    await db.transaction(async (tx: any) => {
      for (const { proposal, linguistic, domain } of eligible) {
        const snapshot = JSON.stringify({
          termOriginal: proposal.term_original, languageCode: proposal.language_code, englishGlossSource: proposal.english_gloss_source,
          pinyin: proposal.pinyin, frenchGlossProposed: proposal.french_gloss_proposed, sourceCategory: proposal.source_category,
          sourceDoi: proposal.source_doi, sourceUrl: proposal.source_url, license: proposal.license,
          linguisticDecision: linguistic.decision, domainDecision: domain.decision,
        });
        await tx.execute(sql`INSERT INTO olfactory_term_pilot_finalizations (proposal_id, source_batch_id, linguistic_review_id, domain_review_id, finalized_by_user_id, finalized_by_name, snapshot) VALUES (${proposal.id}, ${input.batchId}, ${linguistic.id}, ${domain.id}, ${ctx.user.id}, ${ctx.user.name ?? null}, ${snapshot})`);
        await tx.execute(sql`UPDATE olfactory_term_pilot_proposals SET status = 'finalized_transit' WHERE id = ${proposal.id}`);
      }
    });
    return { success: true, finalized: uniqueIds.length, productionWrites: 0 };
  }),

  exportFinalizations: adminProcedure.input(z.object({ batchId: z.string().default("zenodo-cocd-50-v1") })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [rows] = await db.execute(sql`
      SELECT f.id, f.proposal_id, f.snapshot, f.created_at, f.finalized_by_name
      FROM olfactory_term_pilot_finalizations f
      WHERE f.source_batch_id = ${input.batchId}
      ORDER BY f.created_at, f.id
    `) as any;
    return (rows ?? []).map((row: any) => ({ id: row.id, proposalId: row.proposal_id, snapshot: typeof row.snapshot === "string" ? JSON.parse(row.snapshot) : row.snapshot, createdAt: row.created_at, finalizedByName: row.finalized_by_name }));
  }),
});
