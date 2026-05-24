import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules, plants, terroirs } from "../../drizzle/schema";

export const parcoursOlfactifRouter = router({
  // Récupérer les terroirs avec filtres
  getTerroirsWithFilters: publicProcedure
    .input(z.object({
      climate: z.string().optional(),
      country: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const allTerroirs = await db.getAllTerroirs();
      let filtered = allTerroirs;
      
      if (input.climate) {
        filtered = filtered.filter((t) => t.climateType === input.climate);
      }
      if (input.country) {
        filtered = filtered.filter((t) => t.country === input.country);
      }
      if (input.search) {
        const search = input.search.toLowerCase();
        filtered = filtered.filter((t) => 
          t.name.toLowerCase().includes(search) ||
          (t.productionHistory && t.productionHistory.toLowerCase().includes(search)) ||
          (t.region && t.region.toLowerCase().includes(search))
        );
      }
      return filtered;
    }),

  // Récupérer les plantes avec filtres
  getPlantsWithFilters: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      family: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const allPlants = await db.getAllPlants();
      let filtered = allPlants;
      
      if (input.category) {
        filtered = filtered.filter((p) => p.category === input.category);
      }
      if (input.family) {
        filtered = filtered.filter((p) => p.family === input.family);
      }
      if (input.search) {
        const search = input.search.toLowerCase();
        filtered = filtered.filter((p) => 
          p.name.toLowerCase().includes(search) ||
          (p.latinName && p.latinName.toLowerCase().includes(search)) ||
          (p.olfactiveSignature && p.olfactiveSignature.toLowerCase().includes(search))
        );
      }
      return filtered;
    }),

  // Récupérer les molécules avec filtres
  getMoleculesWithFilters: publicProcedure
    .input(z.object({
      family: z.string().optional(),
      gamme: z.string().optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const allMolecules = await db.getAllMolecules();
      let filtered = allMolecules;
      
      if (input.family) {
        filtered = filtered.filter(m => m.family === input.family);
      }
      if (input.gamme) {
        filtered = filtered.filter(m => m.chemicalClass === input.gamme);
      }
      if (input.search) {
        const search = input.search.toLowerCase();
        filtered = filtered.filter(m => 
          m.name.toLowerCase().includes(search) ||
          (m.olfactiveProfile && m.olfactiveProfile.toLowerCase().includes(search)) ||
          (m.olfactiveProfile && m.olfactiveProfile.toLowerCase().includes(search))
        );
      }
      return filtered;
    }),

  // Récupérer les options de filtres disponibles
  getFilterOptions: publicProcedure.query(async () => {
    const terroirs = await db.getAllTerroirs();
    const plants = await db.getAllPlants();
    const molecules = await db.getAllMolecules();

    // Extraire les valeurs uniques pour les filtres
    const climates = Array.from(new Set(terroirs.map((t) => t.climateType).filter(Boolean))) as string[];
    const countries = Array.from(new Set(terroirs.map((t) => t.country).filter(Boolean))) as string[];
    const plantCategories = Array.from(new Set(plants.map((p) => p.category).filter(Boolean))) as string[];
    const olfactiveFamilies = Array.from(new Set(plants.map((p) => p.family).filter(Boolean))) as string[];
    const moleculeFamilies = Array.from(new Set(molecules.map(m => m.family).filter(Boolean))) as string[];
    const gammes = Array.from(new Set(molecules.map(m => m.chemicalClass).filter(Boolean))) as string[];

    return {
      climates: climates.sort(),
      countries: countries.sort(),
      plantCategories: plantCategories.sort(),
      olfactiveFamilies: olfactiveFamilies.sort(),
      moleculeFamilies: moleculeFamilies.sort(),
      gammes: gammes.sort(),
    };
  }),

  // Récupérer les liaisons plante-molécule enrichies
  getEnrichedPlantMoleculeLinks: publicProcedure
    .input(z.object({
      plantId: z.number().optional(),
      moleculeId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      if (input.plantId) {
        return db.getPlantMoleculesWithPercentages(input.plantId);
      }
      if (input.moleculeId) {
        return db.getMoleculePlantsWithPercentages(input.moleculeId);
      }
      return db.getAllPlantMoleculeLinks();
    }),

  // Statistiques du parcours
  getStats: publicProcedure.query(async () => {
    const terroirs = await db.getAllTerroirs();
    const plants = await db.getAllPlants();
    const molecules = await db.getAllMolecules();
    const plantMoleculeLinks = await db.getAllPlantMoleculeLinks();
    const plantTerroirLinks = await db.getAllPlantTerroirRelationsWithNames();

    return {
      terroirCount: terroirs.length,
      plantCount: plants.length,
      moleculeCount: molecules.length,
      plantMoleculeLinkCount: plantMoleculeLinks.length,
      plantTerroirLinkCount: plantTerroirLinks.length,
    };
  }),
})

