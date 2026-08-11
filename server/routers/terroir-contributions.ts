import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { terroirs } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { getMysqlConnection } from "../db/mysqlPool";

export const terroirContributionsRouter = router({
  submit: protectedProcedure
    .input(z.object({
      terroirId: z.number(),
      contributionType: z.enum(['image','plant_link','note','production_data','history']),
      imageUrl: z.string().optional(),
      imageCaption: z.string().optional(),
      plantName: z.string().optional(),
      plantId: z.number().optional(),
      plantNotes: z.string().optional(),
      productionYear: z.number().optional(),
      productionQuantity: z.string().optional(),
      productionQuality: z.string().optional(),
      historyPeriod: z.string().optional(),
      historyContent: z.string().optional(),
      noteContent: z.string().optional(),
      noteCategory: z.string().optional(),
      description: z.string().optional(),
      bibliographyRefs: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const conn = await getMysqlConnection();
      await conn.execute(`
        INSERT INTO terroir_contributions
          (terroir_id, user_id, user_name, contribution_type,
           image_url, image_caption, plant_name, plant_id, plant_notes,
           production_year, production_quantity, production_quality,
           history_period, history_content,
           note_content, note_category, description, bibliography_refs)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `, [
        input.terroirId, ctx.user.openId, ctx.user.name || null, input.contributionType,
        input.imageUrl || null, input.imageCaption || null,
        input.plantName || null, input.plantId || null, input.plantNotes || null,
        input.productionYear || null, input.productionQuantity || null, input.productionQuality || null,
        input.historyPeriod || null, input.historyContent || null,
        input.noteContent || null, input.noteCategory || null,
        input.description || null, input.bibliographyRefs || null,
      ]);
      await conn.end();
      return { success: true };
    }),
  getAll: protectedProcedure
    .input(z.object({ status: z.enum(['pending','approved','rejected']).optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const conn = await getMysqlConnection();
      const [rows] = await conn.execute(
        `SELECT tc.*, t.name as terroir_name FROM terroir_contributions tc
         LEFT JOIN terroirs t ON tc.terroir_id = t.id
         ${input?.status ? 'WHERE tc.status = ?' : ''}
         ORDER BY tc.created_at DESC`,
        input?.status ? [input.status] : []
      );
      await conn.end();
      return rows as Record<string, unknown>[];
    }),
  review: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(['approved','rejected']), adminNotes: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const conn = await getMysqlConnection();
      await conn.execute(
        `UPDATE terroir_contributions SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?`,
        [input.status, input.adminNotes || null, ctx.user.name || ctx.user.openId, input.id]
      );
      await conn.end();
      return { success: true };
    }),
})

