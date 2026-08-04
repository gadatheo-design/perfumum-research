import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules, recettes } from "../../drizzle/schema";

export const analyticsRouter = router({
  getStatistics: publicProcedure.query(async () => {
    const molecules = await db.getAllMolecules();
    const recettes = await db.getAllRecettes();
    
    // Distribution familles chimiques
    const familyDistribution: Record<string, number> = {};
    molecules.forEach(m => {
      if (m.family) {
        familyDistribution[m.family] = (familyDistribution[m.family] || 0) + 1;
      }
    });
    
    // Top 10 molécules (par ordre alphabétique pour l'instant)
    const topMolecules = molecules
      .slice(0, 10)
      .map(molecule => ({
        molecule,
        views: Math.floor(Math.random() * 100) + 1 // Simulé pour l'instant
      }));
    
    // Évolution mensuelle (simulée pour l'instant)
    const monthlyData = [
      { month: 'Jan', molecules: 15, recettes: 18 },
      { month: 'Fév', molecules: 22, recettes: 25 },
      { month: 'Mar', molecules: 31, recettes: 34 },
      { month: 'Avr', molecules: 45, recettes: 48 },
      { month: 'Mai', molecules: 67, recettes: 72 },
      { month: 'Juin', molecules: 89, recettes: 95 },
      { month: 'Juil', molecules: 105, recettes: 112 },
      { month: 'Août', molecules: 118, recettes: 128 },
      { month: 'Sep', molecules: 125, recettes: 136 },
      { month: 'Oct', molecules: 129, recettes: 140 },
      { month: 'Nov', molecules: 131, recettes: 142 },
      { month: 'Déc', molecules: 131, recettes: 142 },
    ];
    
    return {
      familyDistribution,
      topMolecules,
      monthlyData,
      totalMolecules: molecules.length,
      totalRecettes: recettes.length,
    };
  }),
  
  // public-write: justifié — beacon analytics anonyme, fonctionne avec ou sans utilisateur connecté, écrit uniquement dans analytics_events
  trackEvent: publicProcedure
    .input(z.object({
      eventType: z.enum(['molecule_view', 'recipe_view', 'terpene_view', 'pdf_export', 'favorite_add', 'favorite_remove', 'search_query']),
      entityType: z.string().optional(),
      entityId: z.number().optional(),
      metadata: z.unknown().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.trackEvent(
        input.eventType,
        input.entityType,
        input.entityId,
        ctx.user?.id,
        input.metadata as Record<string, any> | undefined
      );
      return { success: true };
    }),

  getMostViewedMolecules: publicProcedure
    .input(z.object({
      days: z.number().default(30),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return await db.getMostViewedMolecules(input.days, input.limit);
    }),

  getMostViewedRecipes: publicProcedure
    .input(z.object({
      days: z.number().default(30),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return await db.getMostViewedRecipes(input.days, input.limit);
    }),

  getActivityTimeline: publicProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ input }) => {
      return await db.getActivityTimeline(input.days);
    }),

  getPopularSearches: publicProcedure
    .input(z.object({
      days: z.number().default(30),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return await db.getPopularSearches(input.days, input.limit);
    }),

  getDashboardStats: publicProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ input }) => {
      return await db.getAnalyticsDashboardStats(input.days);
    }),
})

