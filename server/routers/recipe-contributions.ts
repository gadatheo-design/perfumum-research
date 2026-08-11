import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getMysqlConnection } from "../db/mysqlPool";

export const recipeContributionsRouter = router({
  submit: protectedProcedure
    .input(z.object({
      recipeId: z.number(),
      contributionType: z.enum(['ingredient','variant','note','image','correction']),
      ingredientName: z.string().optional(),
      ingredientQuantity: z.string().optional(),
      ingredientUnit: z.string().optional(),
      ingredientNotes: z.string().optional(),
      variantName: z.string().optional(),
      variantDescription: z.string().optional(),
      imageUrl: z.string().optional(),
      imageCaption: z.string().optional(),
      noteContent: z.string().optional(),
      noteCategory: z.string().optional(),
      description: z.string().optional(),
      bibliographyRefs: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const conn = await getMysqlConnection();
      await conn.execute(`
        INSERT INTO recipe_contributions
          (recipe_id, user_id, user_name, contribution_type,
           ingredient_name, ingredient_quantity, ingredient_unit, ingredient_notes,
           variant_name, variant_description,
           image_url, image_caption,
           note_content, note_category, description, bibliography_refs)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `, [
        input.recipeId, ctx.user.openId, ctx.user.name || null, input.contributionType,
        input.ingredientName || null, input.ingredientQuantity || null,
        input.ingredientUnit || null, input.ingredientNotes || null,
        input.variantName || null, input.variantDescription || null,
        input.imageUrl || null, input.imageCaption || null,
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
        `SELECT rc.* FROM recipe_contributions rc
         ${input?.status ? 'WHERE rc.status = ?' : ''}
         ORDER BY rc.created_at DESC`,
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
        `UPDATE recipe_contributions SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?`,
        [input.status, input.adminNotes || null, ctx.user.name || ctx.user.openId, input.id]
      );
      await conn.end();
      return { success: true };
    }),
})

