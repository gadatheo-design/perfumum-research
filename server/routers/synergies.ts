import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const synergiesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllSynergies();
  }),
  
  getAllMoleculeSynergies: publicProcedure.query(async () => {
    return await db.getAllMoleculeSynergies();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getSynergyById(input);
    }),
  
  getByType: publicProcedure
    .input(z.enum(["potentialisation", "stabilisation", "transformation", "masquage"]))
    .query(async ({ input }) => {
      return await db.getSynergiesByType(input);
    }),
  
  getGraphData: publicProcedure.query(async () => {
    return await db.getMoleculeSynergiesGraphData();
  }),
  
  getStats: publicProcedure.query(async () => {
    return await db.getSynergiesStats();
  }),
  
  getSuggestions: publicProcedure
    .input(z.object({
      minSimilarity: z.number().min(0).max(100).optional(),
      limit: z.number().min(1).max(50).optional()
    }).optional())
    .query(async ({ input }) => {
      return await db.getSynergySuggestions(input?.minSimilarity, input?.limit);
    }),
  
  // Nouvelles procédures pour le générateur IA
  getAllForGenerator: publicProcedure.query(async () => {
    return db.getMolecularSynergiesForGenerator();
  }),
  
  getSuggestionsForMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getSynergySuggestionsForMolecule(input);
    }),
  
  getBetweenMolecules: publicProcedure
    .input(z.object({
      molecule1Id: z.number(),
      molecule2Id: z.number(),
    }))
    .query(async ({ input }) => {
      const allSynergies = await db.getMolecularSynergiesForGenerator();
      
      const terpeneSyn = allSynergies.terpeneSynergies?.find(
        (s: Record<string, unknown>) => (s.terpene1Id === input.molecule1Id && s.terpene2Id === input.molecule2Id) ||
             (s.terpene2Id === input.molecule1Id && s.terpene1Id === input.molecule2Id)
      );
      
      const molSyn = allSynergies.moleculeSynergies?.find(
        (s: Record<string, unknown>) => (s.molecule1Id === input.molecule1Id && s.molecule2Id === input.molecule2Id) ||
             (s.molecule2Id === input.molecule1Id && s.molecule1Id === input.molecule2Id)
      );
      
      return {
        terpeneSynergy: terpeneSyn || null,
        moleculeSynergy: molSyn || null,
        hasDocumentedSynergy: !!(terpeneSyn || molSyn),
      };
    }),
  
  // Nouvelles procédures pour la visualisation graphique
  getGraphVisualizationData: publicProcedure.query(async () => {
    return db.getMolecularSynergiesGraphVisualization();
  }),
  
  getSuggestionsForMolecules: publicProcedure
    .input(z.array(z.number()))
    .query(async ({ input }) => {
      return db.getSynergySuggestionsForMolecules(input);
    }),
})

