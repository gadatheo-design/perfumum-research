import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const notificationsRouter = router({
  // Lister les notifications
  list: publicProcedure
    .input(z.object({
      unreadOnly: z.boolean().default(false),
      type: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      return db.getNotifications(input || {});
    }),

  // Marquer une notification comme lue
  markAsRead: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return db.markNotificationAsRead(input, ctx.user?.id);
    }),

  // Marquer toutes les notifications comme lues
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      return db.markAllNotificationsAsRead(ctx.user?.id);
    }),

  // Supprimer une notification
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.deleteNotification(input);
    }),

  // Créer une notification (admin)
  create: protectedProcedure
    .input(z.object({
      type: z.enum(['import_orphan_molecules', 'new_contribution', 'validation_required', 'classification_milestone', 'system_alert', 'data_quality', 'other']),
      title: z.string(),
      message: z.string(),
      severity: z.enum(['info', 'warning', 'error', 'success']).default('info'),
      entityType: z.string().optional(),
      entityId: z.number().optional(),
      metadata: z.object({}).passthrough().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createNotification(input);
    }),
})

