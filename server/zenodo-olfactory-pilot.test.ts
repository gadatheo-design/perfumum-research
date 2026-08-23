import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");

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
});
