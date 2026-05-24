import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules, plants, recettes } from "../../drizzle/schema";

export const linkingCoverageRouter = router({
  // Get overall coverage statistics
  getStats: publicProcedure.query(async () => {
    return db.getLinkingCoverageStats();
  }),

  // Auto-link molecules to recettes (dry run)
  previewAutoLink: protectedProcedure
    .input(z.object({
      maxLinks: z.number().default(50),
    }))
    .query(async ({ input }) => {
      return db.autoLinkMoleculeRecettes({ maxLinks: input.maxLinks, dryRun: true });
    }),

  // Execute auto-link molecule-recette
  executeAutoLink: protectedProcedure
    .input(z.object({
      maxLinks: z.number().default(50),
    }))
    .mutation(async ({ input }) => {
      return db.autoLinkMoleculeRecettes({ maxLinks: input.maxLinks, dryRun: false });
    }),

  // Auto-link plants to molecules (dry run)
  previewPlantMoleculeAutoLink: protectedProcedure
    .input(z.object({
      maxLinks: z.number().default(50),
    }))
    .query(async ({ input }) => {
      return db.autoLinkPlantMolecules({ maxLinks: input.maxLinks, dryRun: true });
    }),

  // Execute plant-molecule auto-link
  executePlantMoleculeAutoLink: protectedProcedure
    .input(z.object({
      maxLinks: z.number().default(50),
    }))
    .mutation(async ({ input }) => {
      return db.autoLinkPlantMolecules({ maxLinks: input.maxLinks, dryRun: false });
    }),

  // Get plant-molecule audit stats
  getPlantMoleculeAuditStats: publicProcedure.query(async () => {
    return db.getPlantMoleculeAuditStats();
  }),
})

