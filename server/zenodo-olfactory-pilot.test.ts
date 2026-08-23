import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

const root = path.resolve(import.meta.dirname, "..");

function createContext(role: "admin" | null): TrpcContext {
  return {
    user: role ? { id: 1, openId: "zenodo-review-test", name: "Revue Zenodo", role } as TrpcContext["user"] : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {}, cookie: () => {} } as TrpcContext["res"],
  };
}

describe("pilote Zenodo de termes olfactifs", () => {
  it("conserve les propositions et les revues hors des tables scientifiques de production", () => {
    const schema = fs.readFileSync(path.join(root, "drizzle/schema-modules/olfactory-term-pilot.ts"), "utf8");
    expect(schema).toContain("olfactory_term_pilot_proposals");
    expect(schema).toContain("olfactory_term_pilot_reviews");
    expect(schema).toContain("rawSource");
    expect(schema).toContain("llmProposal");
    expect(schema).not.toContain("descriptor_plant_links");
    expect(schema).not.toContain("descriptor_molecule_links");
  });

  it("impose une simulation explicite et une double revue avant tout statut final", () => {
    const script = fs.readFileSync(path.join(root, "server/scripts/zenodo-olfactory-pilot.mjs"), "utf8");
    expect(script).toContain("--dry-run");
    expect(script).toContain("Both reviews are required");
    expect(script).toContain("No production descriptor or association was modified");
    expect(script).toContain("zenodo-cocd-50-v1");
  });

  it("réserve la revue aux administrateurs et expose les cinquante propositions de transit", async () => {
    const publicCaller = appRouter.createCaller(createContext(null));
    const adminCaller = appRouter.createCaller(createContext("admin"));

    await expect(publicCaller.zenodoOlfactoryPilot.getOverview()).rejects.toMatchObject({ code: "FORBIDDEN" });
    const [overview, proposals] = await Promise.all([
      adminCaller.zenodoOlfactoryPilot.getOverview(),
      adminCaller.zenodoOlfactoryPilot.listProposals({}),
    ]);

    expect(overview.total).toBe(50);
    expect(proposals).toHaveLength(50);
    expect(proposals[0]).toMatchObject({ sourceBatchId: "zenodo-cocd-50-v1", status: "proposed" });
  });

  it("n’autorise le transit final qu’après deux acceptations et conserve un instantané exportable", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    const caller = appRouter.createCaller(createContext("admin"));
    const externalId = `zenodo-finalization-test-${Date.now()}`;
    const batchId = "zenodo-finalization-test";
    let proposalId: number | null = null;

    try {
      const [inserted] = await db.execute(sql`
        INSERT INTO olfactory_term_pilot_proposals
          (external_term_id, source_batch_id, term_original, language_code, english_gloss_source, source_category, source_doi, source_url, license, status)
        VALUES (${externalId}, ${batchId}, '测试气味', 'zh', 'test odor', 'test', '10.5281/zenodo.test', 'https://example.test/zenodo', 'CC-BY-4.0', 'proposed')
      `) as any;
      proposalId = Number(inserted.insertId);

      await expect(caller.zenodoOlfactoryPilot.finalizeApprovedProposals({ proposalIds: [proposalId], confirmation: "METTRE EN TRANSIT", batchId })).rejects.toThrow("Only double-approved");
      await caller.zenodoOlfactoryPilot.submitReview({ proposalId, reviewerRole: "linguistic", decision: "accepted", notes: "Termes cohérents." });
      await expect(caller.zenodoOlfactoryPilot.finalizeApprovedProposals({ proposalIds: [proposalId], confirmation: "METTRE EN TRANSIT", batchId })).rejects.toThrow("Only double-approved");
      await caller.zenodoOlfactoryPilot.submitReview({ proposalId, reviewerRole: "domain", decision: "accepted_with_context", notes: "Contexte à conserver." });

      const preview = await caller.zenodoOlfactoryPilot.getFinalizationPreview({ batchId });
      expect(preview).toHaveLength(1);
      expect(preview[0]).toMatchObject({ proposalId, linguisticDecision: "accepted", domainDecision: "accepted_with_context" });
      await expect(caller.zenodoOlfactoryPilot.finalizeApprovedProposals({ proposalIds: [proposalId], confirmation: "CONFIRMER", batchId })).rejects.toMatchObject({ code: "BAD_REQUEST" });

      const finalization = await caller.zenodoOlfactoryPilot.finalizeApprovedProposals({ proposalIds: [proposalId], confirmation: "METTRE EN TRANSIT", batchId });
      expect(finalization).toMatchObject({ success: true, finalized: 1, productionWrites: 0 });
      const exported = await caller.zenodoOlfactoryPilot.exportFinalizations({ batchId });
      expect(exported).toHaveLength(1);
      expect(exported[0].snapshot).toMatchObject({ termOriginal: "测试气味", linguisticDecision: "accepted", domainDecision: "accepted_with_context" });
    } finally {
      if (proposalId) {
        await db.execute(sql`DELETE FROM olfactory_term_pilot_finalizations WHERE proposal_id = ${proposalId}`);
        await db.execute(sql`DELETE FROM olfactory_term_pilot_reviews WHERE proposal_id = ${proposalId}`);
        await db.execute(sql`DELETE FROM olfactory_term_pilot_proposals WHERE id = ${proposalId}`);
      }
    }
  });
});
