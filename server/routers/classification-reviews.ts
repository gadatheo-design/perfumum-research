import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const classificationReviewsRouter = router({
  // Obtenir les statistiques des révisions
  getStats: publicProcedure.query(async () => {
    return db.getReviewStats();
  }),

  // Lister les révisions en attente
  getPending: publicProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      maxConfidence: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getPendingReviews(input || {});
    }),

  // Obtenir une révision par ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getReviewById(input);
    }),

  // Approuver une révision
  approve: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return db.approveReview(input, ctx.user?.id);
    }),

  // Rejeter une révision
  reject: protectedProcedure
    .input(z.object({
      reviewId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.rejectReview(input.reviewId, ctx.user?.id, input.notes);
    }),

  // Modifier et appliquer une révision
  modifyAndApply: protectedProcedure
    .input(z.object({
      reviewId: z.number(),
      chemicalClass: z.string().optional(),
      olfactiveFamily: z.string().optional(),
      olfactiveProfile: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.modifyAndApplyReview(
        input.reviewId,
        {
          chemicalClass: input.chemicalClass,
          olfactiveFamily: input.olfactiveFamily,
          olfactiveProfile: input.olfactiveProfile,
        },
        ctx.user?.id,
        input.notes
      );
    }),

  // Ignorer une révision
  skip: protectedProcedure
    .input(z.object({
      reviewId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.skipReview(input.reviewId, ctx.user?.id, input.notes);
    }),

  // Créer une révision manuellement
  create: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      aiChemicalClass: z.string().optional(),
      aiChemicalClassConfidence: z.number().optional(),
      aiChemicalClassReasoning: z.string().optional(),
      aiOlfactiveFamily: z.string().optional(),
      aiOlfactiveFamilyConfidence: z.number().optional(),
      aiOlfactiveFamilyReasoning: z.string().optional(),
      aiSuggestedOlfactiveProfile: z.string().optional(),
      aiBotanicalContextUsed: z.boolean().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createClassificationReview(input);
    }),
})

