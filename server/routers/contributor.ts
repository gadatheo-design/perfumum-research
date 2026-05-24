import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL, exists } from "drizzle-orm";

export const contributorRouter = router({
  findMoleculeDuplicates: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      casNumber: z.string().optional(),
      iupacName: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return db.findMoleculeDuplicates(input);
    }),
  
  // Détection de doublons pour les plantes
  findPlantDuplicates: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      latinName: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return db.findPlantDuplicates(input);
    }),
  
  // Auto-complétion molécules
  searchMolecules: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return db.searchMoleculesForAutocomplete(input.query, input.limit);
    }),
  
  // Auto-complétion plantes
  searchPlants: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return db.searchPlantsForAutocomplete(input.query, input.limit);
    }),
  
  // Statistiques des liaisons plante-molécule
  getPlantMoleculeStats: publicProcedure.query(async () => {
    return db.getPlantMoleculeLinksStats();
  }),
  
  // Vérifier si une liaison existe
  checkLinkExists: publicProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
    }))
    .query(async ({ input }) => {
      return db.checkPlantMoleculeLinkExists(input.plantId, input.moleculeId);
    }),
  
  // Créer une liaison plante-molécule
  createPlantMoleculeLink: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
      percentageMin: z.number().optional(),
      percentageMax: z.number().optional(),
      percentageTypical: z.number().optional(),
      isSignature: z.number().default(0),
      role: z.enum(['majeur', 'secondaire', 'trace', 'variable']).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Vérifier si la liaison existe déjà
      const exists = await db.checkPlantMoleculeLinkExists(input.plantId, input.moleculeId);
      if (exists) {
        throw new Error('Cette liaison existe déjà');
      }
      return db.createPlantMoleculeLink(input);
    }),
  
  // Supprimer une liaison plante-molécule
  deletePlantMoleculeLink: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.deletePlantMoleculeLink(input.plantId, input.moleculeId);
      return { success: true };
    }),
  
  // Récupérer les plantes orphelines (sans liaisons)
  getOrphanPlants: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return db.getOrphanPlants(input.limit);
    }),
  
  // Récupérer les molécules orphelines (sans liaisons)
  getOrphanMolecules: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return db.getOrphanMolecules(input.limit);
    }),
  
  // Récupérer toutes les liaisons avec détails
  getAllPlantMoleculeLinks: publicProcedure
    .input(z.object({
      limit: z.number().default(100),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      return db.getAllPlantMoleculeLinks();
    }),
  
  // Statistiques d'enrichissement PubChem
  getEnrichmentStats: publicProcedure.query(async () => {
    return db.getMoleculeEnrichmentStats();
  }),
  
  // Molécules candidates pour enrichissement
  getMoleculesForEnrichment: publicProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return db.getMoleculesForPubChemEnrichment(input.limit);
    }),
  
  // Enrichir une molécule via PubChem (utilise le service existant)
  enrichMoleculeFromPubChem: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      pubchemData: z.object({
        casNumber: z.string().optional(),
        iupacName: z.string().optional(),
        chemicalFormula: z.string().optional(),
        molecularWeight: z.number().optional(),
        pubchemCid: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.enrichMoleculeFromPubChem(input.moleculeId, input.pubchemData);
    }),
})

