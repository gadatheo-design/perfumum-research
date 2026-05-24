import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const laboratoireInlineRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getAllMatieres();
  }),
  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getMatiereById(input);
    }),
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      botanicalName: z.string().optional(),
      type: z.enum(["huile_essentielle", "absolu", "resinoid", "concrete", "co2", "teinture", "poudre", "alcoolat", "autre"]),
      olfactiveFamily: z.string().optional(),
      note: z.enum(["tete", "coeur", "fond", "tete_coeur", "coeur_fond"]).optional(),
      origin: z.string().optional(),
      extractionMethod: z.enum(["distillation", "extraction_solvant", "co2_supercritique", "expression", "teinture", "autre"]).optional(),
      olfactiveProfile: z.string().optional(),
      character: z.string().optional(),
      supplier: z.string().optional(),
      pricePerMl: z.number().optional(),
      stock: z.number().optional(),
      status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
      technicalNotes: z.string().optional(),
      manipulationNotes: z.string().optional(),
      maxTemperature: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.createMatiere(input);
    }),
  updateStock: publicProcedure
    .input(z.object({
      id: z.number(),
      stock: z.number(),
      status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
    }))
    .mutation(async ({ input }) => {
      await db.updateMatiereStock(input.id, input.stock, input.status);
      return { success: true };
    }),
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      botanicalName: z.string().optional(),
      type: z.enum(["huile_essentielle", "absolu", "resinoid", "concrete", "co2", "teinture", "poudre", "alcoolat", "autre"]).optional(),
      olfactiveFamily: z.string().optional(),
      note: z.enum(["tete", "coeur", "fond", "tete_coeur", "coeur_fond"]).optional(),
      origin: z.string().optional(),
      extractionMethod: z.enum(["distillation", "extraction_solvant", "co2_supercritique", "expression", "teinture", "autre"]).optional(),
      olfactiveProfile: z.string().optional(),
      character: z.string().optional(),
      supplier: z.string().optional(),
      pricePerMl: z.number().optional(),
      stock: z.number().optional(),
      status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
      technicalNotes: z.string().optional(),
      manipulationNotes: z.string().optional(),
      maxTemperature: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateMatiereFull(id, data);
    }),
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db.deleteMatiere(input);
    }),

  getStats: publicProcedure.query(async () => {
    const dbConn = await (await import('./db')).getDb();
    if (!dbConn) return { total: 0, byType: [], byStatus: [], byNote: [], byOrigin: [] };
    const { laboratoire: labTable } = await import('../drizzle/schema');
    const { sql: sqlFn, desc: descFn, asc: ascFn, isNotNull: isNotNullFn } = await import('drizzle-orm');
    const [totalRow] = await dbConn.select({ count: sqlFn<number>`COUNT(*)` }).from(labTable);
    const byType = await dbConn.select({ type: labTable.type, count: sqlFn<number>`COUNT(*)` }).from(labTable).groupBy(labTable.type).orderBy(descFn(sqlFn`COUNT(*)`));
    const byStatus = await dbConn.select({ status: labTable.status, count: sqlFn<number>`COUNT(*)` }).from(labTable).groupBy(labTable.status);
    const byNote = await dbConn.select({ note: labTable.note, count: sqlFn<number>`COUNT(*)` }).from(labTable).groupBy(labTable.note).orderBy(ascFn(labTable.note));
    const byOrigin = await dbConn.select({ origin: labTable.origin, count: sqlFn<number>`COUNT(*)` }).from(labTable).where(isNotNullFn(labTable.origin)).groupBy(labTable.origin).orderBy(descFn(sqlFn`COUNT(*)`)).limit(10);
    return {
      total: Number(totalRow.count),
      byType: byType.map(r => ({ type: r.type, count: Number(r.count) })),
      byStatus: byStatus.map(r => ({ status: r.status, count: Number(r.count) })),
      byNote: byNote.map(r => ({ note: r.note, count: Number(r.count) })),
      byOrigin: byOrigin.map(r => ({ origin: r.origin, count: Number(r.count) })),
    };
  }),

  getFiltered: publicProcedure
    .input(z.object({
      type: z.string().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      note: z.string().optional(),
      limit: z.number().optional().default(100),
      offset: z.number().optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const dbConn = await (await import('./db')).getDb();
      if (!dbConn) return [];
      const { laboratoire: labTable } = await import('../drizzle/schema');
      const { eq, like, and, or, asc } = await import('drizzle-orm');
      const conditions: SQL[] = [];
      if (input?.type) conditions.push(eq(labTable.type, input.type!));
      if (input?.status) conditions.push(eq(labTable.status, input.status!));
      if (input?.note) conditions.push(eq(labTable.note, input.note!));
      if (input?.search) {
        conditions.push(or(
          like(labTable.name, `%${input.search}%`),
          like(labTable.botanicalName, `%${input.search}%`),
          like(labTable.origin, `%${input.search}%`)
        ));
      }
      return dbConn.select().from(labTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(labTable.type), asc(labTable.name))
        .limit(input?.limit || 100)
        .offset(input?.offset || 0);
    }),
});
