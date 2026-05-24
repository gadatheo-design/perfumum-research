// @ts-nocheck
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const validationRouter = router({
  // Get validation statistics
  getStats: publicProcedure.query(async () => {
    return db.getValidationStats();
  }),

  // Get pending molecules
  getPendingMolecules: protectedProcedure.query(async () => {
    return db.getPendingMolecules();
  }),

  // Get pending plants
  getPendingPlants: protectedProcedure.query(async () => {
    return db.getPendingPlants();
  }),

  // Validate a molecule (admin only)
  validateMolecule: protectedProcedure
    .input(z.object({ moleculeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.validateMolecule(input.moleculeId, ctx.user.id);
    }),

  // Reject a molecule (admin only)
  rejectMolecule: protectedProcedure
    .input(z.object({ moleculeId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.rejectMolecule(input.moleculeId, ctx.user.id, input.reason);
    }),

  // Validate a plant (admin only)
  validatePlant: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.validatePlant(input.plantId, ctx.user.id);
    }),

  // Reject a plant (admin only)
  rejectPlant: protectedProcedure
    .input(z.object({ plantId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.rejectPlant(input.plantId, ctx.user.id, input.reason);
    }),

  // Submit molecule for review
  submitMoleculeForReview: protectedProcedure
    .input(z.object({ moleculeId: z.number() }))
    .mutation(async ({ input }) => {
      return db.submitMoleculeForReview(input.moleculeId);
    }),

  // Submit plant for review
  submitPlantForReview: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .mutation(async ({ input }) => {
      return db.submitPlantForReview(input.plantId);
    }),

  // Get pending contributions with details
  getPendingContributions: protectedProcedure.query(async () => {
    return db.getPendingContributions();
  }),

  // Get new contributions since a date
  getNewContributionsSince: protectedProcedure
    .input(z.object({ since: z.date() }))
    .query(async ({ input }) => {
      return db.getNewContributionsSince(input.since);
    }),

  // Send notification to admin about pending contributions
  notifyAdminPendingContributions: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      
      const summary = await db.generatePendingContributionsSummary();
      if (!summary) {
        return { success: true, message: 'Aucune contribution en attente' };
      }

      const { notifyOwner } = await import('../_core/notification');
      const sent = await notifyOwner({
        title: summary.title,
        content: summary.content,
      });

      return {
        success: sent,
        message: sent ? 'Notification envoyée' : 'Échec de l\'envoi de la notification',
        stats: summary.stats,
      };
    }),
})

