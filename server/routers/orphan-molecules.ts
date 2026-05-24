import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const orphanMoleculesRouter = router({
  // Obtenir les statistiques des molécules orphelines
  getStats: publicProcedure.query(async () => {
    return db.getOrphanMoleculeStats();
  }),

  // Lister les molécules orphelines avec filtres
  list: publicProcedure
    .input(z.object({
      filter: z.enum(['all', 'no_family', 'no_chemical_class', 'no_cas', 'no_iupac', 'no_formula', 'no_olfactive_profile', 'no_radar']).default('all'),
      limit: z.number().default(100),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      return db.getOrphanMoleculesList(input.filter, input.limit, input.offset);
    }),

  // Classifier des molécules en masse
  batchClassify: protectedProcedure
    .input(z.array(z.object({
      moleculeId: z.number(),
      family: z.string().optional(),
      chemicalClass: z.string().optional(),
      olfactiveProfile: z.string().optional(),
    })))
    .mutation(async ({ input }) => {
      return db.batchClassifyMolecules(input);
    }),
})

