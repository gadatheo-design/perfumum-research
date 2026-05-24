import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { molecules } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const moleculeContributionsRouter = router({
  submit: protectedProcedure
    .input(z.object({
      moleculeId: z.number(),
      contributionType: z.enum(['source','therapeutic','usage','synonym','image','note']),
      sourceTitle: z.string().optional(),
      sourceAuthors: z.string().optional(),
      sourceYear: z.number().optional(),
      sourceDoi: z.string().optional(),
      sourceUrl: z.string().optional(),
      therapeuticProperty: z.string().optional(),
      therapeuticEvidence: z.string().optional(),
      therapeuticNotes: z.string().optional(),
      usageContext: z.string().optional(),
      usageDescription: z.string().optional(),
      synonymName: z.string().optional(),
      synonymLanguage: z.string().optional(),
      imageUrl: z.string().optional(),
      imageCaption: z.string().optional(),
      noteContent: z.string().optional(),
      noteCategory: z.string().optional(),
      description: z.string().optional(),
      bibliographyRefs: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      await conn.execute(`
        INSERT INTO molecule_contributions
          (molecule_id, user_id, user_name, contribution_type,
           source_title, source_authors, source_year, source_doi, source_url,
           therapeutic_property, therapeutic_evidence, therapeutic_notes,
           usage_context, usage_description,
           synonym_name, synonym_language,
           image_url, image_caption,
           note_content, note_category,
           description, bibliography_refs)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `, [
        input.moleculeId, ctx.user.openId, ctx.user.name || null, input.contributionType,
        input.sourceTitle || null, input.sourceAuthors || null, input.sourceYear || null,
        input.sourceDoi || null, input.sourceUrl || null,
        input.therapeuticProperty || null, input.therapeuticEvidence || null, input.therapeuticNotes || null,
        input.usageContext || null, input.usageDescription || null,
        input.synonymName || null, input.synonymLanguage || null,
        input.imageUrl || null, input.imageCaption || null,
        input.noteContent || null, input.noteCategory || null,
        input.description || null, input.bibliographyRefs || null,
      ]);
      await conn.end();
      return { success: true };
    }),
  getByMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number(), status: z.enum(['pending','approved','rejected']).optional() }))
    .query(async ({ input }) => {
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const [rows] = await conn.execute(
        `SELECT * FROM molecule_contributions WHERE molecule_id = ?${input.status ? ' AND status = ?' : ''} ORDER BY created_at DESC`,
        input.status ? [input.moleculeId, input.status] : [input.moleculeId]
      );
      await conn.end();
      return rows as Record<string, unknown>[];
    }),
  getAll: protectedProcedure
    .input(z.object({ status: z.enum(['pending','approved','rejected']).optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const [rows] = await conn.execute(
        `SELECT mc.*, m.name as molecule_name FROM molecule_contributions mc
         LEFT JOIN molecules m ON mc.molecule_id = m.id
         ${input?.status ? 'WHERE mc.status = ?' : ''}
         ORDER BY mc.created_at DESC`,
        input?.status ? [input.status] : []
      );
      await conn.end();
      return rows as Record<string, unknown>[];
    }),
  review: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(['approved','rejected']), adminNotes: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      await conn.execute(
        `UPDATE molecule_contributions SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?`,
        [input.status, input.adminNotes || null, ctx.user.name || ctx.user.openId, input.id]
      );
      await conn.end();
      return { success: true };
    }),
})

