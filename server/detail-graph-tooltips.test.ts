import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const moleculeOverview = readFileSync(
  resolve(projectRoot, "client/src/components/molecule/MoleculeOverviewTab.tsx"),
  "utf8"
);
const taxonomyTree = readFileSync(
  resolve(projectRoot, "client/src/components/TaxonomyTree.tsx"),
  "utf8"
);

describe("Infobulles des graphes de fiches entités", () => {
  it("préserve une infobulle détaillée et des valeurs clavier pour le radar moléculaire", () => {
    expect(moleculeOverview).toContain("RechartsTooltip");
    expect(moleculeOverview).toContain("aria-label={`Profil radar olfactif");
    expect(moleculeOverview).toContain("tabIndex={0}");
    expect(moleculeOverview).toContain("intensité relative");
  });

  it("préserve les interactions survol, focus, clavier et tactile de l’arbre taxonomique", () => {
    expect(taxonomyTree).toContain('.attr("tabindex", 0)');
    expect(taxonomyTree).toContain('.on("mouseover"');
    expect(taxonomyTree).toContain('.on("focus"');
    expect(taxonomyTree).toContain('.on("keydown"');
    expect(taxonomyTree).toContain('.on("touchstart"');
    expect(taxonomyTree).toContain('aria-live="polite"');
  });
});
