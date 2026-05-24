import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { terroirs } from "../../drizzle/schema";

export const advancedSearchRouter = router({
  moleculesByPlant: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchMoleculesByPlantSource(input);
    }),
  rawMaterialsByMolecule: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchRawMaterialsByMolecule(input);
    }),
  // Recherche croisée terroirs ↔ plantes ↔ molécules
  crossSearch: publicProcedure
    .input(z.object({
      terroirIds: z.array(z.number()).optional(),
      terroirCountries: z.array(z.string()).optional(),
      terroirClimates: z.array(z.string()).optional(),
      plantIds: z.array(z.number()).optional(),
      plantCategories: z.array(z.string()).optional(),
      plantFamilies: z.array(z.string()).optional(),
      moleculeIds: z.array(z.number()).optional(),
      moleculeFamilies: z.array(z.string()).optional(),
      chemicalClasses: z.array(z.string()).optional(),
      searchQuery: z.string().optional(),
      includeRelations: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.crossSearch(input || {});
    }),
  // Options de filtres pour la recherche croisée
  getCrossSearchFilterOptions: publicProcedure.query(async () => {
    return db.getCrossSearchFilterOptions();
  }),
})

