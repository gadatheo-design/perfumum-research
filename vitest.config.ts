import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

/**
 * Tests d'intégration : ils interrogent une vraie base MySQL/TiDB peuplée.
 *
 * `getDb()` (server/db/core.ts) renvoie `null` quand `DATABASE_URL` est
 * absent, et ces suites échouent alors avec « Database not initialized » ou
 * sur des assertions portant sur des données réelles. Ce ne sont pas des
 * tests unitaires mockés : sans base, ils ne peuvent pas passer.
 *
 * Ils sont donc exclus de `pnpm test` (utilisé par le CI) et regroupés sous
 * `pnpm test:integration`, à lancer avec un `DATABASE_URL` pointant sur une
 * base de test peuplée.
 *
 * Pour régénérer cette liste après avoir ajouté/corrigé des tests : lancer
 * `pnpm test:all` sans DATABASE_URL, puis relever les fichiers marqués FAIL
 * dans la sortie (une entrée par fichier, chemin relatif à la racine).
 */
export const DB_DEPENDENT_TESTS = [
  "server/analytical-methods-molecule.test.ts",
  "server/auto-linking.test.ts",
  "server/bibliography-axis.test.ts",
  "server/bibliography-citations.test.ts",
  "server/bibliography-import.test.ts",
  "server/bibliography.test.ts",
  "server/chemotypes.test.ts",
  "server/citations.test.ts",
  "server/climate-tl.test.ts",
  "server/conservation.test.ts",
  "server/contributor.test.ts",
  "server/coverage-goal.test.ts",
  "server/crossSearch.test.ts",
  "server/csv-import.test.ts",
  "server/curatedJourneys.test.ts",
  "server/enrich-koppen.test.ts",
  "server/europeana.sprint1.test.ts",
  "server/europeana.sprint2.test.ts",
  "server/europeana.test.ts",
  "server/favorites.test.ts",
  "server/feature-batch-march6.test.ts",
  "server/forceGraph.test.ts",
  "server/geographic-origins.test.ts",
  "server/geographic-zones.test.ts",
  "server/ghost-variety-links.test.ts",
  "server/google-analytics.test.ts",
  "server/heritage-conservation.test.ts",
  "server/ifra-molecules.test.ts",
  "server/ifra.test.ts",
  "server/link-analysis.test.ts",
  "server/molecule-origins.test.ts",
  "server/network.test.ts",
  "server/new-features.test.ts",
  "server/plants-molecules.test.ts",
  "server/point3-extended.test.ts",
  "server/points123.test.ts",
  "server/rawMaterialDetail.test.ts",
  "server/recette.test.ts",
  "server/regulatory-profile.test.ts",
  "server/research.genomics.test.ts",
  "server/research.historicCigarettes.test.ts",
  "server/routers/api-enrichments.test.ts",
  "server/session-06jan.test.ts",
  "server/situatedSmells.test.ts",
  "server/synergies.test.ts",
  "server/tagetes-recipes.test.ts",
  "server/terroir-graph.test.ts"
];

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "server/**/*.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", ...DB_DEPENDENT_TESTS],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
