import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const researchAxesRouter = router({
  // Lister tous les axes
  list: publicProcedure
    .input(z.object({
      status: z.string().optional(),
      category: z.string().optional(),
      priority: z.string().optional(),
      parentAxisId: z.number().nullable().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllResearchAxes(input || {});
    }),
  
  // Obtenir un axe par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getResearchAxisById(input);
    }),
  
  // Obtenir un axe par code
  getByCode: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getResearchAxisByCode(input);
    }),
  
  // Créer un nouvel axe
  create: protectedProcedure
    .input(z.object({
      axisCode: z.string(),
      name: z.string(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      objectives: z.string().optional(),
      methodology: z.string().optional(),
      category: z.enum(['fondamental', 'applique', 'experimental', 'theorique', 'historique', 'ethnographique', 'technique']).optional(),
      status: z.enum(['planifie', 'en_cours', 'pause', 'termine', 'archive']).optional(),
      priority: z.enum(['haute', 'moyenne', 'basse']).optional(),
      startDate: z.date().optional(),
      targetEndDate: z.date().optional(),
      progressPercent: z.number().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      parentAxisId: z.number().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createResearchAxis({
        ...input,
        createdBy: ctx.user?.id,
      });
    }),
  
  // Mettre à jour un axe
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      axisCode: z.string().optional(),
      name: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      objectives: z.string().optional(),
      methodology: z.string().optional(),
      category: z.enum(['fondamental', 'applique', 'experimental', 'theorique', 'historique', 'ethnographique', 'technique']).optional(),
      status: z.enum(['planifie', 'en_cours', 'pause', 'termine', 'archive']).optional(),
      priority: z.enum(['haute', 'moyenne', 'basse']).optional(),
      startDate: z.date().optional(),
      targetEndDate: z.date().optional(),
      actualEndDate: z.date().optional(),
      progressPercent: z.number().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      parentAxisId: z.number().nullable().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.updateResearchAxis(id, data);
    }),
  
  // Supprimer un axe
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteResearchAxis(input);
    }),
  
  // Statistiques
  getStats: publicProcedure.query(async () => {
    return db.getResearchAxesStats();
  }),
  
  // Obtenir les références bibliographiques liées
  getBibliography: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getBibliographyByAxis(input);
    }),
  
  // Obtenir les sous-axes d'un axe parent
  getSubAxes: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getSubAxes(input);
    }),
  
  // Obtenir un axe avec ses sous-axes
  getWithSubAxes: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getAxisWithSubAxes(input);
    }),
  
  // Obtenir la hiérarchie complète des axes
  getHierarchy: publicProcedure.query(async () => {
    return db.getAxisHierarchy();
  }),
})

