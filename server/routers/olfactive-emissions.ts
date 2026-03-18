/**
 * Router tRPC — Olfactive Emissions (NOSE Phase 1)
 * od:L12 Smell Emission — Conditions d'émission d'une odeur
 * Ontologie NOSE / Odeuropa — https://odeuropa.eu
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import mysql from "mysql2/promise";

async function getDb() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const olfactiveEmissionsRouter = router({

  /**
   * Récupérer les émissions d'une plante (onglet GC-MS dans la fiche plante)
   */
  getByPlant: publicProcedure
    .input(z.object({
      plantId: z.number(),
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
      role: z.enum(["majeur", "secondaire", "trace", "variable", "signature"]).optional(),
      analysisMethod: z.enum(["gc_ms", "gc_fid", "hplc", "rnm", "headspace_gcms", "spme_gcms", "autre"]).optional(),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        let where = "oe.plant_id = ?";
        const params: unknown[] = [input.plantId];

        if (input.role) {
          where += " AND oe.role = ?";
          params.push(input.role);
        }
        if (input.analysisMethod) {
          where += " AND oe.analysis_method = ?";
          params.push(input.analysisMethod);
        }

        const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
          SELECT 
            oe.id,
            oe.plant_id,
            oe.molecule_id,
            oe.plant_part,
            oe.extraction_method,
            oe.percentage,
            oe.percentage_min,
            oe.percentage_max,
            oe.concentration_ppm,
            oe.concentration_unit,
            oe.analysis_method,
            oe.analysis_source,
            oe.geographic_origin,
            oe.role,
            oe.is_signature,
            oe.notes,
            oe.source_table,
            m.name as molecule_name,
            m.cas_number,
            m.formula,
            m.chemicalFamily as chemical_family
          FROM olfactive_emissions oe
          LEFT JOIN molecules m ON oe.molecule_id = m.id
          WHERE ${where}
          ORDER BY 
            CASE oe.role 
              WHEN 'signature' THEN 1 
              WHEN 'majeur' THEN 2 
              WHEN 'secondaire' THEN 3 
              WHEN 'variable' THEN 4 
              WHEN 'trace' THEN 5 
              ELSE 6 
            END,
            oe.percentage DESC
          LIMIT ${Number(input.limit)} OFFSET ${Number(input.offset)}
        `, params);

        const [countRow] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM olfactive_emissions oe WHERE ${where}`,
          params
        );

        return {
          emissions: rows,
          total: (countRow[0] as { total: number }).total,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Récupérer les émissions d'une molécule (onglet GC-MS dans la fiche molécule)
   */
  getByMolecule: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
          SELECT 
            oe.id,
            oe.plant_id,
            oe.molecule_id,
            oe.tabac_id,
            oe.plant_part,
            oe.extraction_method,
            oe.percentage,
            oe.percentage_min,
            oe.percentage_max,
            oe.concentration_ppm,
            oe.concentration_unit,
            oe.analysis_method,
            oe.analysis_source,
            oe.geographic_origin,
            oe.role,
            oe.is_signature,
            oe.notes,
            oe.source_table,
            p.name as plant_name,
            p.latin_name,
            p.family as plant_family,
            t.name as tabac_name
          FROM olfactive_emissions oe
          LEFT JOIN plants p ON oe.plant_id = p.id
          LEFT JOIN tabacs t ON oe.tabac_id = t.id
          WHERE oe.molecule_id = ?
          ORDER BY oe.percentage DESC, oe.is_signature DESC
          LIMIT ${Number(input.limit)} OFFSET ${Number(input.offset)}
        `, [input.moleculeId]);

        const [countRow] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT COUNT(*) as total FROM olfactive_emissions WHERE molecule_id = ?`,
          [input.moleculeId]
        );

        return {
          emissions: rows,
          total: (countRow[0] as { total: number }).total,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Statistiques globales des émissions (pour la page NOSE/admin)
   */
  getStats: publicProcedure.query(async () => {
    const conn = await getDb();
    try {
      const [total] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) as n FROM olfactive_emissions"
      );
      const [withPercentage] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) as n FROM olfactive_emissions WHERE percentage IS NOT NULL"
      );
      const [withMolecule] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) as n FROM olfactive_emissions WHERE molecule_id IS NOT NULL"
      );
      const [byMethod] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT analysis_method, COUNT(*) as n 
        FROM olfactive_emissions 
        GROUP BY analysis_method 
        ORDER BY n DESC
      `);
      const [byRole] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT role, COUNT(*) as n 
        FROM olfactive_emissions 
        GROUP BY role 
        ORDER BY n DESC
      `);
      const [bySource] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT source_table, COUNT(*) as n 
        FROM olfactive_emissions 
        GROUP BY source_table 
        ORDER BY n DESC
      `);
      const [topMolecules] = await conn.execute<mysql.RowDataPacket[]>(`
        SELECT m.name, m.id, COUNT(oe.id) as occurrences, AVG(oe.percentage) as avg_pct
        FROM olfactive_emissions oe
        JOIN molecules m ON oe.molecule_id = m.id
        GROUP BY m.id, m.name
        ORDER BY occurrences DESC
        LIMIT 10
      `);

      return {
        total: (total[0] as { n: number }).n,
        withPercentage: (withPercentage[0] as { n: number }).n,
        withMolecule: (withMolecule[0] as { n: number }).n,
        byMethod,
        byRole,
        bySource,
        topMolecules,
      };
    } finally {
      await conn.end();
    }
  }),

  /**
   * Créer une émission manuellement (admin)
   */
  create: protectedProcedure
    .input(z.object({
      plantId: z.number().optional(),
      moleculeId: z.number().optional(),
      tabacId: z.number().optional(),
      plantPart: z.enum(["fleur","feuille","fruit","zeste","graine","ecorce","bois","racine","rhizome","resine","plante_entiere","autre"]).optional(),
      extractionMethod: z.enum(["hydrodistillation","entrainement_vapeur","expression_a_froid","extraction_co2","enfleurage","maceration","teinture","solvant_organique","pyrolyse","headspace","spme","autre"]).optional(),
      percentage: z.number().min(0).max(100).optional(),
      percentageMin: z.number().min(0).max(100).optional(),
      percentageMax: z.number().min(0).max(100).optional(),
      concentrationPpm: z.number().min(0).optional(),
      analysisMethod: z.enum(["gc_ms","gc_fid","hplc","rnm","headspace_gcms","spme_gcms","autre"]).optional(),
      analysisSource: z.string().max(500).optional(),
      geographicOrigin: z.string().max(255).optional(),
      role: z.enum(["majeur","secondaire","trace","variable","signature"]).optional(),
      isSignature: z.boolean().default(false),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const conn = await getDb();
      try {
        const [result] = await conn.execute<mysql.ResultSetHeader>(`
          INSERT INTO olfactive_emissions 
            (plant_id, molecule_id, tabac_id, plant_part, extraction_method,
             percentage, percentage_min, percentage_max, concentration_ppm,
             analysis_method, analysis_source, geographic_origin,
             role, is_signature, notes, source_table)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
        `, [
          input.plantId ?? null,
          input.moleculeId ?? null,
          input.tabacId ?? null,
          input.plantPart ?? null,
          input.extractionMethod ?? null,
          input.percentage ?? null,
          input.percentageMin ?? null,
          input.percentageMax ?? null,
          input.concentrationPpm ?? null,
          input.analysisMethod ?? null,
          input.analysisSource ?? null,
          input.geographicOrigin ?? null,
          input.role ?? null,
          input.isSignature ? 1 : 0,
          input.notes ?? null,
        ]);
        return { id: result.insertId };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Supprimer une émission (admin)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const conn = await getDb();
      try {
        await conn.execute("DELETE FROM olfactive_emissions WHERE id = ?", [input.id]);
        return { success: true };
      } finally {
        await conn.end();
      }
    }),
});
