import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const plantContributionsRouter = router({
  // Get contributions for a specific plant
  getByPlant: publicProcedure
    .input(z.object({
      plantId: z.number(),
      status: z.enum(['pending', 'approved', 'rejected']).optional(),
    }))
    .query(async ({ input }) => {
      return db.getPlantContributions(input.plantId, input.status);
    }),

  // Submit a new contribution (authenticated users)
  submit: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      contributionType: z.enum(['image', 'molecule', 'terroir', 'note', 'bibliography', 'gcms_analysis', 'tradition_olfactive']),
      imageUrl: z.string().optional(),
      imageCaption: z.string().optional(),
      imageSource: z.string().optional(),
      moleculeId: z.number().optional(),
      moleculeName: z.string().optional(),
      moleculeConcentration: z.string().optional(),
      moleculeSource: z.string().optional(),
      terroir: z.string().optional(),
      region: z.string().optional(),
      country: z.string().optional(),
      terroirNotes: z.string().optional(),
      noteContent: z.string().optional(),
      noteCategory: z.string().optional(),
      description: z.string().optional(),
      references: z.string().optional(),
      // Bibliographie
      bibTitle: z.string().optional(),
      bibAuthors: z.string().optional(),
      bibYear: z.number().optional(),
      bibJournal: z.string().optional(),
      bibDoi: z.string().optional(),
      bibUrl: z.string().optional(),
      bibType: z.string().optional(),
      // GC-MS
      gcmsMethod: z.string().optional(),
      gcmsMolecules: z.any().optional(),
      gcmsConditions: z.string().optional(),
      // Tradition olfactive
      traditionPeriod: z.string().optional(),
      traditionCulture: z.string().optional(),
      traditionUsage: z.string().optional(),
      traditionSources: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return db.submitPlantContribution({
        ...input,
        userId: ctx.user.openId,
        userName: ctx.user.name || undefined,
      });
    }),

  // Get all contributions for admin
  getAll: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected']).optional(),
    }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.getAllContributionsForAdmin(input?.status);
    }),

  // Get pending contributions for admin
  getPending: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.getAllPendingContributionsForAdmin();
    }),

  // Approve a contribution
  approve: protectedProcedure
    .input(z.object({
      contributionId: z.number(),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.reviewPlantContribution(
        input.contributionId,
        'approved',
        ctx.user.name || ctx.user.openId,
        input.adminNotes
      );
    }),

  // Reject a contribution
  reject: protectedProcedure
    .input(z.object({
      contributionId: z.number(),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.reviewPlantContribution(
        input.contributionId,
        'rejected',
        ctx.user.name || ctx.user.openId,
        input.adminNotes
      );
    }),

  // Get contribution statistics
  getStats: publicProcedure
    .query(async () => {
      return db.getContributionStats();
    }),
})

