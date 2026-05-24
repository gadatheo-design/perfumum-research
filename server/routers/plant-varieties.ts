import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const plantVarietiesRouter = router({
  getAll: publicProcedure.query(async () => {
    return getAllPlantVarieties();
  }),
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return getPlantVarietiesByPlant(input.plantId);
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getPlantVarietyById(input.id);
    }),
  // Nouvelles procédures pour filtres avancés
  getWithFilters: publicProcedure
    .input(z.object({
      plantCategory: z.string().optional(),
      varietyType: z.string().optional(),
      conservationStatus: z.string().optional(),
      countryOfOrigin: z.string().optional(),
      searchQuery: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return db.getPlantVarietiesWithFilters(input);
    }),
  getCritical: publicProcedure.query(async () => {
    return db.getCriticalVarieties();
  }),
  getConservationStats: publicProcedure.query(async () => {
    return db.getConservationStats();
  }),
  getExclusiveMolecules: publicProcedure
    .input(z.object({
      statuses: z.array(z.string()).default(['EX', 'EW', 'CR', 'EN']),
    }))
    .query(async ({ input }) => {
      return db.getExclusiveMolecules(input.statuses);
    }),
  getWithMolecules: publicProcedure
    .input(z.object({ varietyId: z.number() }))
    .query(async ({ input }) => {
      return db.getVarietyWithMolecules(input.varietyId);
    }),
  getByType: publicProcedure
    .input(z.object({ varietyType: z.string() }))
    .query(async ({ input }) => {
      return db.getVarietiesByType(input.varietyType);
    }),
  getCannabisLandraces: publicProcedure.query(async () => {
    return db.getCannabisLandraces();
  }),
  getTobaccoVarieties: publicProcedure.query(async () => {
    return db.getTobaccoVarieties();
  }),
  getUniqueCountries: publicProcedure.query(async () => {
    return db.getUniqueVarietyCountries();
  }),
  updateConservationStatus: publicProcedure
    .input(z.object({
      varietyId: z.number(),
      conservationStatus: z.string().optional(),
      conservationNotes: z.string().optional(),
      threatFactors: z.array(z.string()).optional(),
      conservationEfforts: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.updateVarietyConservationStatus(input.varietyId, input);
    }),
  // CRUD complet pour les variétés
  create: publicProcedure
    .input(z.object({
      plantId: z.number(),
      name: z.string().min(1),
      latinName: z.string().optional(),
      varietyType: z.enum(['cultivar', 'chemotype', 'landrace', 'hybrid', 'clone', 'wild', 'other']),
      breeder: z.string().optional(),
      yearRegistered: z.number().optional(),
      countryOfOrigin: z.string().optional(),
      parentVarieties: z.array(z.string()).optional(),
      distinctiveFeatures: z.string().optional(),
      morphology: z.object({
        height: z.string().optional(),
        leafShape: z.string().optional(),
        flowerColor: z.string().optional(),
        growthHabit: z.string().optional(),
      }).optional(),
      dominantMolecules: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        role: z.string(),
      })).optional(),
      molecularProfile: z.array(z.object({
        molecule: z.string(),
        minPercent: z.number(),
        maxPercent: z.number(),
        typical: z.number(),
      })).optional(),
      olfactiveDescription: z.string().optional(),
      olfactiveNotes: z.object({
        top: z.array(z.string()),
        heart: z.array(z.string()),
        base: z.array(z.string()),
      }).optional(),
      yieldPerHectare: z.string().optional(),
      essentialOilYield: z.string().optional(),
      harvestPeriod: z.string().optional(),
      optimalHarvestStage: z.string().optional(),
      commercialAvailability: z.enum(['widely_available', 'limited', 'rare', 'research_only', 'extinct', 'unknown']).optional(),
      suppliers: z.array(z.string()).optional(),
      conservationStatus: z.enum(['critical', 'endangered', 'vulnerable', 'near_threatened', 'stable', 'data_deficient', 'unknown']).optional(),
      conservationNotes: z.string().optional(),
      threatFactors: z.array(z.string()).optional(),
      conservationEfforts: z.string().optional(),
      notes: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Générer un varietyId unique
      const prefix = input.varietyType === 'landrace' ? 'PV-LAN' : 'PV-VAR';
      const count = await db.getPlantVarietiesCount();
      const varietyId = `${prefix}-${String(count + 1).padStart(3, '0')}`;
      return createPlantVariety({ ...input, varietyId });
    }),
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      latinName: z.string().optional(),
      varietyType: z.enum(['cultivar', 'chemotype', 'landrace', 'hybrid', 'clone', 'wild', 'other']).optional(),
      breeder: z.string().optional(),
      yearRegistered: z.number().optional(),
      countryOfOrigin: z.string().optional(),
      parentVarieties: z.array(z.string()).optional(),
      distinctiveFeatures: z.string().optional(),
      morphology: z.object({
        height: z.string().optional(),
        leafShape: z.string().optional(),
        flowerColor: z.string().optional(),
        growthHabit: z.string().optional(),
      }).optional(),
      dominantMolecules: z.array(z.object({
        molecule: z.string(),
        percentage: z.number(),
        role: z.string(),
      })).optional(),
      molecularProfile: z.array(z.object({
        molecule: z.string(),
        minPercent: z.number(),
        maxPercent: z.number(),
        typical: z.number(),
      })).optional(),
      olfactiveDescription: z.string().optional(),
      olfactiveNotes: z.object({
        top: z.array(z.string()),
        heart: z.array(z.string()),
        base: z.array(z.string()),
      }).optional(),
      yieldPerHectare: z.string().optional(),
      essentialOilYield: z.string().optional(),
      harvestPeriod: z.string().optional(),
      optimalHarvestStage: z.string().optional(),
      commercialAvailability: z.enum(['widely_available', 'limited', 'rare', 'research_only', 'extinct', 'unknown']).optional(),
      suppliers: z.array(z.string()).optional(),
      conservationStatus: z.enum(['critical', 'endangered', 'vulnerable', 'near_threatened', 'stable', 'data_deficient', 'unknown']).optional(),
      conservationNotes: z.string().optional(),
      threatFactors: z.array(z.string()).optional(),
      conservationEfforts: z.string().optional(),
      notes: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updatePlantVariety(id, data);
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deletePlantVariety(input.id);
    }),
  // Récupérer toutes les plantes pour le sélecteur
  getPlants: publicProcedure.query(async () => {
    return db.getAllPlantsForSelect();
  }),
});
