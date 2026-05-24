import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as dbHelpers from "../db";
import { laboratoire, plants, molecules, laboratoireMolecules, laboratoireRecettes, recettes } from "../../drizzle/schema";
import { eq, like, desc, asc, sql, and, or, isNotNull, SQL } from "drizzle-orm";

/**
 * Routeur Laboratoire unifié — gestion des matières premières du laboratoire olfactif.
 * Fusionne les procédures CRUD (list, create, update, delete, updateStock)
 * avec les requêtes relationnelles (getMolecules, getRecettes, getRelatedPlant).
 */
export const laboratoireRouter = router({
  // === CRUD via db helpers ===
  list: publicProcedure.query(async () => {
    return await dbHelpers.getAllMatieres();
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
      return await dbHelpers.createMatiere(input);
    }),

  updateStock: publicProcedure
    .input(z.object({
      id: z.number(),
      stock: z.number(),
      status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
    }))
    .mutation(async ({ input }) => {
      await dbHelpers.updateMatiereStock(input.id, input.stock, input.status);
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
      return await dbHelpers.updateMatiereFull(id, data);
    }),

  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await dbHelpers.deleteMatiere(input);
    }),

  // === Requêtes directes ===
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [result] = await db.select().from(laboratoire)
        .where(eq(laboratoire.id, input.id))
        .limit(1);
      return result || null;
    }),

  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, byType: [], byStatus: [], byNote: [], byOrigin: [] };

    const [totalRow] = await db.select({ count: sql<number>`COUNT(*)` }).from(laboratoire);
    const byType = await db.select({ type: laboratoire.type, count: sql<number>`COUNT(*)` }).from(laboratoire).groupBy(laboratoire.type).orderBy(desc(sql`COUNT(*)`));
    const byStatus = await db.select({ status: laboratoire.status, count: sql<number>`COUNT(*)` }).from(laboratoire).groupBy(laboratoire.status);
    const byNote = await db.select({ note: laboratoire.note, count: sql<number>`COUNT(*)` }).from(laboratoire).groupBy(laboratoire.note).orderBy(asc(laboratoire.note));
    const byOrigin = await db.select({ origin: laboratoire.origin, count: sql<number>`COUNT(*)` }).from(laboratoire).where(isNotNull(laboratoire.origin)).groupBy(laboratoire.origin).orderBy(desc(sql`COUNT(*)`)).limit(10);

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
      const db = await getDb();
      if (!db) return [];
      const conditions: SQL[] = [];
      if (input?.type) conditions.push(eq(laboratoire.type, input.type as typeof laboratoire.type.enumValues[number]));
      if (input?.status) conditions.push(eq(laboratoire.status, input.status as typeof laboratoire.status.enumValues[number]));
      if (input?.note) conditions.push(eq(laboratoire.note, input.note as typeof laboratoire.note.enumValues[number]));
      if (input?.search) {
        conditions.push(or(
          like(laboratoire.name, `%${input.search}%`),
          like(laboratoire.botanicalName, `%${input.search}%`),
          like(laboratoire.origin, `%${input.search}%`)
        )!);
      }
      return db.select().from(laboratoire)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(laboratoire.type), asc(laboratoire.name))
        .limit(input?.limit || 100)
        .offset(input?.offset || 0);
    }),

  // === Relations ===
  getMolecules: publicProcedure
    .input(z.object({ laboratoireId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select({
        id: molecules.id,
        name: molecules.name,
        casNumber: molecules.casNumber,
        chemicalFormula: molecules.chemicalFormula,
        family: molecules.family,
        wikidataQid: molecules.wikidataQid,
      })
        .from(laboratoireMolecules)
        .innerJoin(molecules, eq(laboratoireMolecules.moleculeId, molecules.id))
        .where(eq(laboratoireMolecules.laboratoireId, input.laboratoireId));
    }),

  getRecettes: publicProcedure
    .input(z.object({ laboratoireId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select({
        id: recettes.id,
        name: recettes.name,
        category: recettes.category,
      })
        .from(laboratoireRecettes)
        .innerJoin(recettes, eq(laboratoireRecettes.recetteId, recettes.id))
        .where(eq(laboratoireRecettes.laboratoireId, input.laboratoireId));
    }),

  getRelatedPlant: publicProcedure
    .input(z.object({ botanicalName: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [plant] = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
        category: plants.category,
      }).from(plants)
        .where(like(plants.latinName, `%${input.botanicalName.split(' ').slice(0, 2).join(' ')}%`))
        .limit(1);
      return plant || null;
    }),
});
