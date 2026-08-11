/**
 * Router tRPC — Olfactive Experiences (NOSE Phase 2)
 * od:L13 Smell Experience — Expériences subjectives et témoignages olfactifs
 * Ontologie NOSE / Odeuropa — https://odeuropa.eu
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import mysql from "mysql2/promise";
import { getMysqlConnection } from "../db/mysqlPool";

async function getDb() {
  return getMysqlConnection();
}

const ExperienceInput = z.object({
  plantId: z.number().optional(),
  moleculeId: z.number().optional(),
  emissionId: z.number().optional(),
  experiencerType: z.enum(["individual", "collective", "historical", "fictional", "scientific"]).default("individual"),
  experiencerName: z.string().max(255).optional(),
  periodLabel: z.string().max(255).optional(),
  yearApprox: z.number().int().min(-3000).max(2100).optional(),
  dateExact: z.string().optional(),
  placeName: z.string().max(255).optional(),
  placeCountry: z.string().max(100).optional(),
  geographicContext: z.string().optional(),
  perceptionLabel: z.string().max(255).optional(),
  perceptionValence: z.enum(["positive", "negative", "neutral", "ambivalent"]).optional(),
  perceptionIntensity: z.enum(["faible", "modéré", "fort", "très_fort"]).optional(),
  contextType: z.enum(["rituel", "médical", "culinaire", "cosmétique", "industriel", "artistique", "quotidien", "funéraire", "autre"]).optional(),
  contextDescription: z.string().optional(),
  sourceText: z.string().optional(),
  sourceReference: z.string().max(500).optional(),
  sourceLanguage: z.string().max(50).optional(),
  sourceType: z.enum(["litteraire", "scientifique", "ethnographique", "oral", "iconographique", "archéologique", "personnel"]).optional(),
  notes: z.string().optional(),
  confidenceLevel: z.enum(["haute", "moyenne", "basse", "hypothétique"]).default("moyenne"),
});

export const olfactiveExperiencesRouter = router({

  /**
   * Lister les expériences avec filtres
   */
  list: publicProcedure
    .input(z.object({
      plantId: z.number().optional(),
      moleculeId: z.number().optional(),
      contextType: z.string().optional(),
      perceptionValence: z.string().optional(),
      sourceType: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const conditions: string[] = [];
        const params: unknown[] = [];

        if (input.plantId) { conditions.push("oe.plant_id = ?"); params.push(input.plantId); }
        if (input.moleculeId) { conditions.push("oe.molecule_id = ?"); params.push(input.moleculeId); }
        if (input.contextType) { conditions.push("oe.context_type = ?"); params.push(input.contextType); }
        if (input.perceptionValence) { conditions.push("oe.perception_valence = ?"); params.push(input.perceptionValence); }
        if (input.sourceType) { conditions.push("oe.source_type = ?"); params.push(input.sourceType); }
        if (input.search) {
          conditions.push("(oe.perception_label LIKE ? OR oe.source_text LIKE ? OR oe.experiencer_name LIKE ? OR oe.place_name LIKE ?)");
          const q = `%${input.search}%`;
          params.push(q, q, q, q);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
          SELECT 
            oe.*,
            p.name as plant_name,
            p.latin_name,
            m.name as molecule_name
          FROM olfactive_experiences oe
          LEFT JOIN plants p ON oe.plant_id = p.id
          LEFT JOIN molecules m ON oe.molecule_id = m.id
          ${where}
          ORDER BY oe.year_approx DESC, oe.created_at DESC
          LIMIT ${Number(input.limit)} OFFSET ${Number(input.offset)}
        `, params);

        const [countRow] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM olfactive_experiences oe ${where}`,
          params
        );

        return {
          experiences: rows,
          total: (countRow[0] as { total: number }).total,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Récupérer les expériences d'une plante
   */
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
          SELECT oe.*, m.name as molecule_name
          FROM olfactive_experiences oe
          LEFT JOIN molecules m ON oe.molecule_id = m.id
          WHERE oe.plant_id = ?
          ORDER BY oe.year_approx DESC, oe.created_at DESC
          LIMIT ${Number(input.limit)}
        `, [input.plantId]);
        return rows;
      } finally {
        await conn.end();
      }
    }),

  /**
   * Récupérer les expériences d'une molécule
   */
  getByMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
          SELECT oe.*, p.name as plant_name, p.latin_name
          FROM olfactive_experiences oe
          LEFT JOIN plants p ON oe.plant_id = p.id
          WHERE oe.molecule_id = ?
          ORDER BY oe.year_approx DESC, oe.created_at DESC
          LIMIT ${Number(input.limit)}
        `, [input.moleculeId]);
        return rows;
      } finally {
        await conn.end();
      }
    }),

  /**
   * Statistiques globales
   */
  getStats: publicProcedure.query(async () => {
    const conn = await getDb();
    try {
      const [total] = await conn.execute<mysql.RowDataPacket[]>("SELECT COUNT(*) as n FROM olfactive_experiences");
      const [byContext] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT context_type, COUNT(*) as n FROM olfactive_experiences GROUP BY context_type ORDER BY n DESC"
      );
      const [byValence] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT perception_valence, COUNT(*) as n FROM olfactive_experiences GROUP BY perception_valence ORDER BY n DESC"
      );
      const [bySourceType] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT source_type, COUNT(*) as n FROM olfactive_experiences GROUP BY source_type ORDER BY n DESC"
      );
      const [byPeriod] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT period_label, COUNT(*) as n 
        FROM olfactive_experiences 
        WHERE period_label IS NOT NULL 
        GROUP BY period_label 
        ORDER BY n DESC 
        LIMIT 10
      `);
      return {
        total: (total[0] as { n: number }).n,
        byContext,
        byValence,
        bySourceType,
        byPeriod,
      };
    } finally {
      await conn.end();
    }
  }),

  /**
   * Créer une expérience
   */
  create: protectedProcedure
    .input(ExperienceInput)
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const conn = await getDb();
      try {
        const [result] = await conn.execute<mysql.ResultSetHeader>(`
          INSERT INTO olfactive_experiences 
            (plant_id, molecule_id, emission_id, experiencer_type, experiencer_name,
             period_label, year_approx, date_exact, place_name, place_country, geographic_context,
             perception_label, perception_valence, perception_intensity,
             context_type, context_description,
             source_text, source_reference, source_language, source_type,
             notes, confidence_level)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          input.plantId ?? null, input.moleculeId ?? null, input.emissionId ?? null,
          input.experiencerType, input.experiencerName ?? null,
          input.periodLabel ?? null, input.yearApprox ?? null, input.dateExact ?? null,
          input.placeName ?? null, input.placeCountry ?? null, input.geographicContext ?? null,
          input.perceptionLabel ?? null, input.perceptionValence ?? null, input.perceptionIntensity ?? null,
          input.contextType ?? null, input.contextDescription ?? null,
          input.sourceText ?? null, input.sourceReference ?? null, input.sourceLanguage ?? null, input.sourceType ?? null,
          input.notes ?? null, input.confidenceLevel,
        ]);
        return { id: result.insertId };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Mettre à jour une expérience
   */
  update: protectedProcedure
    .input(ExperienceInput.extend({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const conn = await getDb();
      try {
        await conn.execute(`
          UPDATE olfactive_experiences SET
            plant_id = ?, molecule_id = ?, emission_id = ?,
            experiencer_type = ?, experiencer_name = ?,
            period_label = ?, year_approx = ?, date_exact = ?,
            place_name = ?, place_country = ?, geographic_context = ?,
            perception_label = ?, perception_valence = ?, perception_intensity = ?,
            context_type = ?, context_description = ?,
            source_text = ?, source_reference = ?, source_language = ?, source_type = ?,
            notes = ?, confidence_level = ?
          WHERE id = ?
        `, [
          input.plantId ?? null, input.moleculeId ?? null, input.emissionId ?? null,
          input.experiencerType, input.experiencerName ?? null,
          input.periodLabel ?? null, input.yearApprox ?? null, input.dateExact ?? null,
          input.placeName ?? null, input.placeCountry ?? null, input.geographicContext ?? null,
          input.perceptionLabel ?? null, input.perceptionValence ?? null, input.perceptionIntensity ?? null,
          input.contextType ?? null, input.contextDescription ?? null,
          input.sourceText ?? null, input.sourceReference ?? null, input.sourceLanguage ?? null, input.sourceType ?? null,
          input.notes ?? null, input.confidenceLevel,
          input.id,
        ]);
        return { success: true };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Supprimer une expérience
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const conn = await getDb();
      try {
        await conn.execute("DELETE FROM olfactive_experiences WHERE id = ?", [input.id]);
        return { success: true };
      } finally {
        await conn.end();
      }
    }),
});
