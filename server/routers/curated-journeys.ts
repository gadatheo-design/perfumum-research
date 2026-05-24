// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const curatedJourneysRouter = router({
  // Liste des parcours publiés
  listPublished: publicProcedure.query(async () => {
    return db.getAllPublishedJourneys();
  }),

  // Liste de tous les parcours (admin)
  listAll: protectedProcedure.query(async () => {
    return db.getAllJourneys();
  }),

  // Parcours mis en avant
  getFeatured: publicProcedure.query(async () => {
    return db.getFeaturedJourneys();
  }),

  // Récupérer un parcours par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getJourneyById(input);
    }),

  // Récupérer un parcours par code
  getByCode: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getJourneyByCode(input);
    }),

  // Récupérer un parcours complet avec ses éléments
  getFull: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getFullJourney(input);
    }),

  // Parcours par thème
  getByTheme: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.getJourneysByTheme(input);
    }),

  // Statistiques des parcours
  getStats: publicProcedure.query(async () => {
    return db.getJourneysStats();
  }),

  // Créer un parcours
  create: protectedProcedure
    .input(z.object({
      code: z.string().min(1).max(50),
      name: z.string().min(1).max(255),
      nameEn: z.string().max(255).optional(),
      description: z.string().optional(),
      shortDescription: z.string().max(500).optional(),
      theme: z.enum(["geographic", "olfactive", "botanical", "historical", "seasonal", "therapeutic", "culinary", "sacred", "luxury", "sustainable", "custom"]),
      emoji: z.string().max(10).optional(),
      coverImageUrl: z.string().max(500).optional(),
      color: z.string().max(20).optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
      estimatedDuration: z.number().optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.createJourney({ ...input, createdBy: ctx.user.id });
    }),

  // Mettre à jour un parcours
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        code: z.string().min(1).max(50).optional(),
        name: z.string().min(1).max(255).optional(),
        nameEn: z.string().max(255).optional(),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        theme: z.enum(["geographic", "olfactive", "botanical", "historical", "seasonal", "therapeutic", "culinary", "sacred", "luxury", "sustainable", "custom"]).optional(),
        emoji: z.string().max(10).optional(),
        coverImageUrl: z.string().max(500).optional(),
        color: z.string().max(20).optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
        estimatedDuration: z.number().optional(),
        isPublished: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      return db.updateJourney(input.id, input.data);
    }),

  // Supprimer un parcours
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteJourney(input);
    }),

  // Récupérer les éléments d'un parcours
  getItems: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getJourneyItems(input);
    }),

  // Ajouter un élément à un parcours
  addItem: protectedProcedure
    .input(z.object({
      journeyId: z.number(),
      itemType: z.enum(["terroir", "plant", "molecule"]),
      terroirId: z.number().optional(),
      plantId: z.number().optional(),
      moleculeId: z.number().optional(),
      sortOrder: z.number().optional(),
      stepNumber: z.number().optional(),
      groupName: z.string().max(100).optional(),
      contextDescription: z.string().optional(),
      isHighlight: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addJourneyItem(input);
    }),

  // Supprimer un élément d'un parcours
  removeItem: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.removeJourneyItem(input);
    }),

  // Mettre à jour l'ordre d'un élément
  updateItemOrder: protectedProcedure
    .input(z.object({
      itemId: z.number(),
      sortOrder: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.updateJourneyItemOrder(input.itemId, input.sortOrder);
    }),
})

