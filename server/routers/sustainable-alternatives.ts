import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { references, suppliers } from "../../drizzle/schema";

export const sustainableAlternativesRouter = router({
  // Liste toutes les alternatives
  list: publicProcedure
    .query(async () => {
      return await db.getAllSustainableAlternatives();
    }),
  
  // Récupère une alternative par ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getSustainableAlternativeById(input.id);
    }),
  
  // Récupère les alternatives pour une espèce menacée
  getByThreatenedPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAlternativesByThreatenedPlant(input.plantId);
    }),
  
  // Récupère les alternatives par type
  getByType: publicProcedure
    .input(z.object({ 
      type: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']) 
    }))
    .query(async ({ input }) => {
      return await db.getAlternativesByType(input.type);
    }),
  
  // Recherche avec filtres
  search: publicProcedure
    .input(z.object({
      threatenedPlantId: z.number().optional(),
      alternativeType: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']).optional(),
      availability: z.enum(['widely_available', 'available', 'limited', 'rare', 'research_only']).optional(),
      olfactiveSimilarity: z.enum(['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different']).optional(),
      searchQuery: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await db.searchSustainableAlternatives(input ?? {});
    }),
  
  // Liste les espèces menacées avec leurs alternatives
  listThreatenedWithAlternatives: publicProcedure
    .query(async () => {
      return await db.getThreatenedPlantsWithAlternatives();
    }),
  
  // Liste les alternatives groupées par espèce
  listGroupedBySpecies: publicProcedure
    .query(async () => {
      return await db.getAlternativesGroupedBySpecies();
    }),
  
  // Statistiques
  getStats: publicProcedure
    .query(async () => {
      return await db.getAlternativesStats();
    }),
  
  // Créer une alternative (protégé)
  create: protectedProcedure
    .input(z.object({
      threatenedPlantId: z.number(),
      threatenedPlantName: z.string(),
      alternativePlantId: z.number().optional(),
      alternativeName: z.string(),
      alternativeType: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']),
      olfactiveSimilarity: z.enum(['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different']).optional(),
      olfactiveNotes: z.string().optional(),
      availability: z.enum(['widely_available', 'available', 'limited', 'rare', 'research_only']).optional(),
      sustainabilityScore: z.number().min(1).max(10).optional(),
      certifications: z.array(z.string()).optional(),
      priceComparison: z.enum(['much_cheaper', 'cheaper', 'similar', 'more_expensive', 'much_more_expensive']).optional(),
      suppliers: z.array(z.string()).optional(),
      usageRecommendations: z.string().optional(),
      keyMolecules: z.array(z.object({
        name: z.string(),
        percentage: z.number().optional(),
        note: z.string().optional(),
      })).optional(),
      references: z.array(z.object({
        title: z.string(),
        author: z.string().optional(),
        year: z.number().optional(),
        url: z.string().optional(),
        type: z.enum(['academic', 'industry', 'supplier', 'other']),
      })).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createSustainableAlternative(input);
    }),
  
  // Mettre à jour une alternative (protégé)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      threatenedPlantId: z.number().optional(),
      threatenedPlantName: z.string().optional(),
      alternativePlantId: z.number().optional(),
      alternativeName: z.string().optional(),
      alternativeType: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']).optional(),
      olfactiveSimilarity: z.enum(['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different']).optional(),
      olfactiveNotes: z.string().optional(),
      availability: z.enum(['widely_available', 'available', 'limited', 'rare', 'research_only']).optional(),
      sustainabilityScore: z.number().min(1).max(10).optional(),
      certifications: z.array(z.string()).optional(),
      priceComparison: z.enum(['much_cheaper', 'cheaper', 'similar', 'more_expensive', 'much_more_expensive']).optional(),
      suppliers: z.array(z.string()).optional(),
      usageRecommendations: z.string().optional(),
      keyMolecules: z.array(z.object({
        name: z.string(),
        percentage: z.number().optional(),
        note: z.string().optional(),
      })).optional(),
      references: z.array(z.object({
        title: z.string(),
        author: z.string().optional(),
        year: z.number().optional(),
        url: z.string().optional(),
        type: z.enum(['academic', 'industry', 'supplier', 'other']),
      })).optional(),
      notes: z.string().optional(),
      verified: z.boolean().optional(),
      verifiedBy: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateSustainableAlternative(id, data);
    }),
  
  // Supprimer une alternative (protégé)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deleteSustainableAlternative(input.id);
    }),
})

