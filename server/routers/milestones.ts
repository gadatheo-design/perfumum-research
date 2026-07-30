import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const milestonesRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getMilestones();
  }),

  // Jalons de recherche (researchTimeline) avec quarter, status, priority, phase, progress
  listResearch: publicProcedure.query(async () => {
    return await db.getAllMilestones();
  }),

  // Stats des jalons de recherche
  statsResearch: publicProcedure.query(async () => {
    return await db.getTimelineStats();
  }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getMilestoneById(input);
    }),
  
  create: publicProcedure
    .input(z.object({
      date: z.date(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      type: z.enum(["prototype", "discovery", "collaboration", "publication", "other"]),
      moleculeId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.createMilestone({
        ...input,
        userId: ctx.user.id,
      });
    }),
  
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      date: z.date().optional(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      type: z.enum(["prototype", "discovery", "collaboration", "publication", "other"]).optional(),
      moleculeId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { id, ...data } = input;
      return await db.updateMilestone(id, data);
    }),
  
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.deleteMilestone(input);
    }),
})

