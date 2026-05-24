import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { ifraRestrictions, molecules } from "../../drizzle/schema";
import { getPlantStatistics, getPlantWithFullDetails, searchPlantsByMolecule, searchPlantsByTerroir } from "../db/plants";

export const plantStatisticsRouter = router({
  getOverview: publicProcedure.query(async () => {
    return getPlantStatistics();
  }),
  getPlantWithDetails: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return getPlantWithFullDetails(input.plantId);
    }),
  searchByMolecule: publicProcedure
    .input(z.object({ moleculeName: z.string() }))
    .query(async ({ input }) => {
      return searchPlantsByMolecule(input.moleculeName);
    }),
  searchByTerroir: publicProcedure
    .input(z.object({ terroirId: z.number() }))
    .query(async ({ input }) => {
      return searchPlantsByTerroir(input.terroirId);
    }),
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const allPlants = await db.getAllPlants();
      const q = input.query.toLowerCase();
      return allPlants
        .filter((p: Record<string,unknown>) =>
          String(p.name ?? '').toLowerCase().includes(q) ||
          String(p.latinName ?? '').toLowerCase().includes(q) ||
          String(p.latin_name ?? '').toLowerCase().includes(q)
        )
        .slice(0, 20);
    }),
  getPlantMoleculesWithIfra: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      // Récupérer les molécules de la plante avec leurs restrictions IFRA
      const molecules = await db.getPlantMoleculesWithPercentages(input.plantId);
      
      // Pour chaque molécule, récupérer ses restrictions IFRA
      const moleculesWithIfra = await Promise.all(
        molecules.map(async (mol) => {
          const ifraRestrictions = await db.getMoleculeIfraRestrictions(mol.molecule.id);
          return {
            moleculeId: mol.molecule.id,
            molecule: mol.molecule,
            percentageTypical: mol.percentageTypical,
            percentageMin: mol.percentageMin,
            percentageMax: mol.percentageMax,
            role: mol.role,
            isSignature: mol.isSignature,
            ifraRestrictions,
          };
        })
      );
      
      return moleculesWithIfra;
    }),

})

