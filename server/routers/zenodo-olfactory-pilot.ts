import { z } from "zod";
import { sql } from "drizzle-orm";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

const reviewDecision = z.enum(["accepted", "accepted_with_context", "needs_research", "rejected"]);
const reviewerRole = z.enum(["linguistic", "domain"]);

type ReviewDecision = z.infer<typeof reviewDecision>;

function deriveProposalStatus(decisions: ReviewDecision[]) {
  if (decisions.includes("rejected")) return "rejected";
  if (decisions.includes("needs_research")) return "needs_research";
  if (decisions.length < 2) return "under_review";
  if (decisions.includes("accepted_with_context")) return "accepted_with_context";
  return "accepted";
}

export const zenodoOlfactoryPilotRouter = router({
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const [rows] = await db.execute(sql`
      SELECT status, COUNT(*) AS count
      FROM olfactory_term_pilot_proposals
      GROUP BY status
    `) as any;
    const counts = Object.fromEntries((rows ?? []).map((row: any) => [row.status, Number(row.count)]));
    const [reviewRows] = await db.execute(sql`SELECT COUNT(*) AS count FROM olfactory_term_pilot_reviews`) as any;
    return {
      total: Object.values(counts).reduce((total: number, count: any) => total + Number(count), 0),
      proposed: Number(counts.proposed ?? 0),
      preannotated: Number(counts.preannotated ?? 0),
      underReview: Number(counts.under_review ?? 0),
      accepted: Number(counts.accepted ?? 0),
      acceptedWithContext: Number(counts.accepted_with_context ?? 0),
      needsResearch: Number(counts.needs_research ?? 0),
      rejected: Number(counts.rejected ?? 0),
      reviewCount: Number(reviewRows?.[0]?.count ?? 0),
    };
  }),

  listProposals: adminProcedure
    .input(z.object({ batchId: z.string().default("zenodo-cocd-50-v1"), status: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [proposalRows] = await db.execute(input.status
        ? sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId} AND status = ${input.status} ORDER BY id`
        : sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId} ORDER BY id`) as any;
      const [reviewRows] = await db.execute(sql`
        SELECT r.*
        FROM olfactory_term_pilot_reviews r
        INNER JOIN olfactory_term_pilot_proposals p ON p.id = r.proposal_id
        WHERE p.source_batch_id = ${input.batchId}
        ORDER BY r.created_at DESC, r.id DESC
      `) as any;

      const reviewsByProposal = new Map<number, any[]>();
      for (const review of reviewRows ?? []) {
        const entries = reviewsByProposal.get(review.proposal_id) ?? [];
        entries.push({
          id: review.id,
          reviewerUserId: review.reviewer_user_id,
          reviewerName: review.reviewer_name,
          reviewerRole: review.reviewer_role,
          decision: review.decision,
          notes: review.notes,
          createdAt: review.created_at,
        });
        reviewsByProposal.set(review.proposal_id, entries);
      }

      return (proposalRows ?? []).map((proposal: any) => ({
        id: proposal.id,
        externalTermId: proposal.external_term_id,
        sourceBatchId: proposal.source_batch_id,
        termOriginal: proposal.term_original,
        languageCode: proposal.language_code,
        englishGlossSource: proposal.english_gloss_source,
        pinyin: proposal.pinyin,
        frenchGlossProposed: proposal.french_gloss_proposed,
        sourceCategory: proposal.source_category,
        oai: proposal.oai,
        osi: proposal.osi,
        canonicalDescriptorCandidate: proposal.canonical_descriptor_candidate,
        candidateRelationType: proposal.candidate_relation_type,
        candidateEntityType: proposal.candidate_entity_type,
        candidateEntityId: proposal.candidate_entity_id,
        llmRationale: proposal.llm_rationale,
        confidence: proposal.confidence,
        sourceDoi: proposal.source_doi,
        sourceUrl: proposal.source_url,
        license: proposal.license,
        status: proposal.status,
        createdAt: proposal.created_at,
        updatedAt: proposal.updated_at,
        reviews: reviewsByProposal.get(proposal.id) ?? [],
      }));
    }),

  submitReview: adminProcedure
    .input(z.object({
      proposalId: z.number().int().positive(),
      reviewerRole,
      decision: reviewDecision,
      notes: z.string().trim().max(4000).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [proposalRows] = await db.execute(sql`
        SELECT id FROM olfactory_term_pilot_proposals WHERE id = ${input.proposalId} LIMIT 1
      `) as any;
      if (!proposalRows?.[0]) throw new Error("Pilot proposal not found");

      await db.execute(sql`
        INSERT INTO olfactory_term_pilot_reviews
          (proposal_id, reviewer_user_id, reviewer_name, reviewer_role, decision, notes)
        VALUES
          (${input.proposalId}, ${ctx.user.id}, ${ctx.user.name ?? null}, ${input.reviewerRole}, ${input.decision}, ${input.notes ?? null})
      `);

      const [rows] = await db.execute(sql`
        SELECT reviewer_role AS reviewerRole, decision
        FROM olfactory_term_pilot_reviews
        WHERE proposal_id = ${input.proposalId}
        ORDER BY created_at DESC, id DESC
      `) as any;
      const latestByRole = new Map<string, ReviewDecision>();
      for (const row of rows ?? []) {
        if (!latestByRole.has(row.reviewerRole)) latestByRole.set(row.reviewerRole, row.decision as ReviewDecision);
      }
      const status = deriveProposalStatus(Array.from(latestByRole.values()));
      await db.execute(sql`UPDATE olfactory_term_pilot_proposals SET status = ${status} WHERE id = ${input.proposalId}`);

      return { success: true, status, reviewedRoles: Array.from(latestByRole.keys()) };
    }),
});
