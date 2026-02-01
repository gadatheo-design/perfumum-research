/**
 * Router tRPC pour l'enrichissement des compositions chimiques des plantes
 */

import { router, publicProcedure } from "../_core/trpc";
import {
  previewEnrichment,
  executeEnrichment,
  getCompositionStats,
  getPlantsWithoutMolecules,
  PLANT_COMPOSITIONS,
} from "../plant-composition-enrichment";

export const plantCompositionRouter = router({
  // Prévisualiser l'enrichissement
  preview: publicProcedure.query(async () => {
    return await previewEnrichment();
  }),

  // Exécuter l'enrichissement
  execute: publicProcedure.mutation(async () => {
    return await executeEnrichment();
  }),

  // Statistiques de couverture
  stats: publicProcedure.query(async () => {
    return await getCompositionStats();
  }),

  // Liste des plantes sans molécules
  plantsWithoutMolecules: publicProcedure.query(async () => {
    return await getPlantsWithoutMolecules();
  }),

  // Liste des compositions documentées
  documentedCompositions: publicProcedure.query(async () => {
    return Object.entries(PLANT_COMPOSITIONS).map(([plant, molecules]) => ({
      plant,
      moleculesCount: molecules.length,
      molecules: molecules.map(m => m.molecule),
    }));
  }),
});
