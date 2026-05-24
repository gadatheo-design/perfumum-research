import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const progressReportsRouter = router({
  // Créer un snapshot de l'état actuel
  createSnapshot: protectedProcedure
    .input(z.object({
      notes: z.string().optional(),
    }).optional())
    .mutation(async ({ input, ctx }) => {
      return db.createClassificationSnapshot(input?.notes, ctx.user?.id);
    }),

  // Obtenir le dernier snapshot
  getLatest: publicProcedure.query(async () => {
    return db.getLatestSnapshot();
  }),

  // Lister les snapshots
  listSnapshots: publicProcedure
    .input(z.object({
      limit: z.number().default(100),
      offset: z.number().default(0),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getClassificationSnapshots(input || {});
    }),

  // Obtenir le rapport de progression complet
  getReport: publicProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getProgressReport(input?.startDate, input?.endDate);
    }),
})

