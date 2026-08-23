import { sql } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";

type DescriptorRecord = {
  descriptorId: string;
  name: string;
  description: string | null;
  category: string | null;
  frequency: number | null;
};

type ProposalRecord = {
  id: number;
  termOriginal: string;
  languageCode: string;
  englishGlossSource: string | null;
  pinyin: string | null;
  frenchGlossProposed: string | null;
  canonicalDescriptorCandidate: string | null;
  sourceCategory: string;
  status: string;
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function tokens(value: string | null | undefined) {
  return new Set(normalize(value).split(" ").filter((token) => token.length >= 3));
}

export function rankZenodoDescriptorSuggestions(proposal: ProposalRecord, descriptors: DescriptorRecord[]) {
  const candidateTerms = [proposal.frenchGlossProposed, proposal.canonicalDescriptorCandidate, proposal.englishGlossSource].filter(Boolean) as string[];
  const candidateTokens = new Set(candidateTerms.flatMap((term) => [...tokens(term)]));
  const normalizedCandidates = candidateTerms.map(normalize).filter(Boolean);

  return descriptors.map((descriptor) => {
    const normalizedName = normalize(descriptor.name);
    const nameTokens = tokens(descriptor.name);
    const descriptionTokens = tokens(descriptor.description);
    const reasons: string[] = [];
    let score = 0;

    if (normalizedCandidates.includes(normalizedName)) {
      score += 100;
      reasons.push("correspondance exacte avec un gloss ou candidat proposé");
    }
    if (normalizedCandidates.some((candidate) => candidate.length >= 4 && (candidate.includes(normalizedName) || normalizedName.includes(candidate)))) {
      score += 45;
      reasons.push("proximité lexicale avec le nom du descripteur");
    }
    const sharedNameTokens = [...candidateTokens].filter((token) => nameTokens.has(token));
    if (sharedNameTokens.length) {
      score += Math.min(36, sharedNameTokens.length * 18);
      reasons.push(`terme(s) partagé(s) : ${sharedNameTokens.join(", ")}`);
    }
    const sharedDescriptionTokens = [...candidateTokens].filter((token) => descriptionTokens.has(token));
    if (sharedDescriptionTokens.length) {
      score += Math.min(18, sharedDescriptionTokens.length * 6);
      reasons.push(`proximité avec la description : ${sharedDescriptionTokens.slice(0, 3).join(", ")}`);
    }
    if (!reasons.length) reasons.push("aucune correspondance textuelle forte ; proposition à examiner manuellement");
    return {
      descriptorId: descriptor.descriptorId,
      name: descriptor.name,
      description: descriptor.description,
      category: descriptor.category,
      frequency: descriptor.frequency,
      score,
      confidence: score >= 90 ? "élevée" : score >= 45 ? "moyenne" : "exploratoire",
      reasons,
    };
  }).sort((a, b) => b.score - a.score || (b.frequency ?? 0) - (a.frequency ?? 0) || a.name.localeCompare(b.name, "fr"));
}

export const zenodoTermComparatorRouter = router({
  getOverview: adminProcedure.input(z.object({ batchId: z.string().default("zenodo-cocd-50-v1") })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [proposalRows] = await db.execute(sql`SELECT COUNT(*) AS count FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId}`) as any;
    const [descriptorRows] = await db.execute(sql`SELECT COUNT(*) AS count FROM odor_descriptors`) as any;
    return { proposalCount: Number(proposalRows?.[0]?.count ?? 0), descriptorCount: Number(descriptorRows?.[0]?.count ?? 0) };
  }),

  listComparisons: adminProcedure.input(z.object({
    batchId: z.string().default("zenodo-cocd-50-v1"),
    search: z.string().trim().max(120).optional(),
    status: z.string().optional(),
  })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const [proposalRows] = await db.execute(input.status
      ? sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId} AND status = ${input.status} ORDER BY id`
      : sql`SELECT * FROM olfactory_term_pilot_proposals WHERE source_batch_id = ${input.batchId} ORDER BY id`) as any;
    const [descriptorRows] = await db.execute(sql`
      SELECT descriptor_id, name, description, category, frequency
      FROM odor_descriptors
      ORDER BY frequency DESC, name
    `) as any;
    const [reviewRows] = await db.execute(sql`
      SELECT r.* FROM olfactory_term_pilot_reviews r
      INNER JOIN olfactory_term_pilot_proposals p ON p.id = r.proposal_id
      WHERE p.source_batch_id = ${input.batchId}
      ORDER BY r.created_at DESC, r.id DESC
    `) as any;
    const reviewsByProposal = new Map<number, any[]>();
    for (const review of reviewRows ?? []) {
      const entries = reviewsByProposal.get(review.proposal_id) ?? [];
      entries.push({ id: review.id, reviewerRole: review.reviewer_role, reviewerName: review.reviewer_name, decision: review.decision, notes: review.notes, createdAt: review.created_at });
      reviewsByProposal.set(review.proposal_id, entries);
    }
    const descriptors: DescriptorRecord[] = (descriptorRows ?? []).map((row: any) => ({ descriptorId: row.descriptor_id, name: row.name, description: row.description, category: row.category, frequency: row.frequency == null ? null : Number(row.frequency) }));
    const needle = normalize(input.search);
    return (proposalRows ?? []).map((row: any) => {
      const proposal: ProposalRecord = {
        id: row.id, termOriginal: row.term_original, languageCode: row.language_code, englishGlossSource: row.english_gloss_source,
        pinyin: row.pinyin, frenchGlossProposed: row.french_gloss_proposed, canonicalDescriptorCandidate: row.canonical_descriptor_candidate,
        sourceCategory: row.source_category, status: row.status,
      };
      return { ...proposal, reviews: reviewsByProposal.get(row.id) ?? [], suggestions: rankZenodoDescriptorSuggestions(proposal, descriptors).slice(0, 5) };
    }).filter((comparison: any) => !needle || [comparison.termOriginal, comparison.pinyin, comparison.englishGlossSource, comparison.frenchGlossProposed, comparison.canonicalDescriptorCandidate, comparison.status].some((value) => normalize(value).includes(needle)));
  }),
});
