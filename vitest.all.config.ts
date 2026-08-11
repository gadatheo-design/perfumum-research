import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

/**
 * Suite complète : tests unitaires + tests d'intégration, sans exclusion.
 *
 * Correspond au comportement historique de `pnpm test` avant la séparation.
 * Sert notamment à régénérer la liste `DB_DEPENDENT_TESTS` de
 * `vitest.config.ts` (voir le commentaire de cette constante).
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
    include: ["server/**/*.test.ts", "server/**/*.spec.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
