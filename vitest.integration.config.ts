import { defineConfig } from "vitest/config";
import path from "path";
import { DB_DEPENDENT_TESTS } from "./vitest.config";

const templateRoot = path.resolve(import.meta.dirname);

/**
 * Suite d'intégration : exécute uniquement les tests qui exigent une vraie
 * base MySQL/TiDB peuplée (liste partagée avec `vitest.config.ts`).
 *
 * Usage : DATABASE_URL=mysql://... pnpm test:integration
 *
 * Sans `DATABASE_URL`, ces tests échouent par construction — voir le
 * commentaire de `DB_DEPENDENT_TESTS` dans vitest.config.ts.
 */
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
    include: DB_DEPENDENT_TESTS,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
