import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import { getDb } from '../db';
import { sql } from 'drizzle-orm';

// ── Schéma de validation ────────────────────────────────────────────────────
const ExtractionMethodInput = z.object({
  methodId: z.string().min(3).max(20),
  name: z.string().min(2).max(100),
  category: z.enum([
    'distillation', 'expression', 'extraction_solvant', 'co2_supercritique',
    'enfleurage', 'maceration', 'hydrodistillation', 'fermentation', 'pyrolyse',
    'percolation', 'other'
  ]),
  description: z.string().optional(),
  costLevel: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  complexityLevel: z.enum(['simple', 'moderate', 'complex', 'expert']).optional(),
  yieldQuality: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  bestFor: z.array(z.string()).optional(),
  notRecommendedFor: z.array(z.string()).optional(),
  parameters: z.record(z.string(), z.any()).optional(),
  equipment: z.array(z.string()).optional(),
  typicalYields: z.record(z.string(), z.any()).optional(),
  preservedMolecules: z.array(z.string()).optional(),
  degradedMolecules: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const extractionMethodsAdminRouter = router({
  // ── Lecture ──────────────────────────────────────────────────────────────────
  getAll: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error('DB unavailable');
    const [rows] = await db.execute(sql`
      SELECT * FROM extraction_methods ORDER BY category, name
    `) as unknown as [any[]];
    return rows;
  }),

  getById: protectedProcedure
    .input(z.object({ methodId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');
      const [rows] = await db.execute(sql`
        SELECT * FROM extraction_methods WHERE method_id = ${input.methodId} LIMIT 1
      `) as unknown as [any[]];
      if (rows.length === 0) throw new Error('Méthode introuvable');
      return rows[0];
    }),

  // ── Création ─────────────────────────────────────────────────────────────────
  create: protectedProcedure
    .input(ExtractionMethodInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');

      // Vérifier unicité du method_id
      const [existing] = await db.execute(sql`
        SELECT method_id FROM extraction_methods WHERE method_id = ${input.methodId} LIMIT 1
      `) as unknown as [any[]];
      if (existing.length > 0) throw new Error(`L'identifiant "${input.methodId}" est déjà utilisé`);

      const params = JSON.stringify(input.parameters || {});
      const equipment = JSON.stringify(input.equipment || []);
      const yields = JSON.stringify(input.typicalYields || {});
      const preserved = JSON.stringify(input.preservedMolecules || []);
      const degraded = JSON.stringify(input.degradedMolecules || []);
      const bestFor = JSON.stringify(input.bestFor || []);
      const notRecommended = JSON.stringify(input.notRecommendedFor || []);

      await db.execute(sql`
        INSERT INTO extraction_methods (
          method_id, name, category, description,
          cost_level, complexity_level, yield_quality,
          best_for, not_recommended_for,
          parameters, equipment, typical_yields,
          preserved_molecules, degraded_molecules, notes
        ) VALUES (
          ${input.methodId}, ${input.name}, ${input.category}, ${input.description ?? null},
          ${input.costLevel ?? null}, ${input.complexityLevel ?? null}, ${input.yieldQuality ?? null},
          ${bestFor}, ${notRecommended},
          ${params}, ${equipment}, ${yields},
          ${preserved}, ${degraded}, ${input.notes ?? null}
        )
      `);

      return { success: true, methodId: input.methodId };
    }),

  // ── Mise à jour ───────────────────────────────────────────────────────────────
  update: protectedProcedure
    .input(ExtractionMethodInput.extend({ methodId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');

      const params = JSON.stringify(input.parameters || {});
      const equipment = JSON.stringify(input.equipment || []);
      const yields = JSON.stringify(input.typicalYields || {});
      const preserved = JSON.stringify(input.preservedMolecules || []);
      const degraded = JSON.stringify(input.degradedMolecules || []);
      const bestFor = JSON.stringify(input.bestFor || []);
      const notRecommended = JSON.stringify(input.notRecommendedFor || []);

      await db.execute(sql`
        UPDATE extraction_methods SET
          name = ${input.name},
          category = ${input.category},
          description = ${input.description ?? null},
          cost_level = ${input.costLevel ?? null},
          complexity_level = ${input.complexityLevel ?? null},
          yield_quality = ${input.yieldQuality ?? null},
          best_for = ${bestFor},
          not_recommended_for = ${notRecommended},
          parameters = ${params},
          equipment = ${equipment},
          typical_yields = ${yields},
          preserved_molecules = ${preserved},
          degraded_molecules = ${degraded},
          notes = ${input.notes ?? null}
        WHERE method_id = ${input.methodId}
      `);

      return { success: true };
    }),

  // ── Suppression ───────────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ methodId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');

      // Vérifier s'il y a des liaisons plante-extraction
      const [linkRows] = await db.execute(sql`
        SELECT COUNT(*) as n FROM plant_extractions WHERE method_id = ${input.methodId}
      `) as unknown as [any[]];
      if (linkRows[0]?.n > 0) {
        throw new Error(`Impossible de supprimer : ${linkRows[0].n} plante(s) utilisent cette méthode`);
      }

      await db.execute(sql`
        DELETE FROM extraction_methods WHERE method_id = ${input.methodId}
      `);
      return { success: true };
    }),

  // ── Statistiques ──────────────────────────────────────────────────────────────
  getStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error('DB unavailable');

    const [totalRows] = await db.execute(sql`SELECT COUNT(*) as n FROM extraction_methods`) as unknown as [any[]];
    const [byCategoryRows] = await db.execute(sql`
      SELECT category, COUNT(*) as n FROM extraction_methods GROUP BY category ORDER BY n DESC
    `) as unknown as [any[]];
    const [withLinksRows] = await db.execute(sql`
      SELECT COUNT(DISTINCT method_id) as n FROM plant_extractions
    `) as unknown as [any[]];

    return {
      total: totalRows[0]?.n ?? 0,
      byCategory: byCategoryRows,
      withPlantLinks: withLinksRows[0]?.n ?? 0,
    };
  }),
});
