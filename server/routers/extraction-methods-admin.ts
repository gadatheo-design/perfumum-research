/**
 * Router tRPC — Administration des méthodes d'extraction
 * Permet aux collaborateurs de gérer les méthodes via l'interface admin du site.
 * Source : Patel et al. (2021) — Extraction methods for natural aromatic compounds
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import { getDb } from '../db';

const ExtractionMethodInput = z.object({
  methodId: z.string().min(3).max(30),
  name: z.string().min(2).max(255),
  shortName: z.string().max(50).optional(),
  category: z.enum([
    'distillation', 'expression', 'extraction_solvant', 'co2_supercritique',
    'enfleurage', 'maceration', 'hydrodistillation', 'percolation', 'other'
  ]),
  description: z.string().optional(),
  principle: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  equipment: z.array(z.string()).optional(),
  typicalYields: z.record(z.any()).optional(),
  molecularImpact: z.string().optional(),
  preservedMolecules: z.array(z.string()).optional(),
  degradedMolecules: z.array(z.string()).optional(),
  advantages: z.array(z.string()).optional(),
  disadvantages: z.array(z.string()).optional(),
  bestFor: z.array(z.string()).optional(),
  notRecommendedFor: z.array(z.string()).optional(),
  costLevel: z.enum(['low', 'medium', 'high', 'very_high']).optional(),
  complexityLevel: z.enum(['simple', 'moderate', 'complex', 'expert']).optional(),
  notes: z.string().optional(),
  references: z.array(z.string()).optional(),
});

export const extractionMethodsAdminRouter = router({
  // ── Lecture ──────────────────────────────────────────────────────────────────
  getAll: protectedProcedure.query(async () => {
    const db = getDb();
    if (!db) throw new Error('DB unavailable');
    const [rows] = await db.execute(
      'SELECT * FROM extraction_methods ORDER BY category, name'
    ) as any;
    return rows;
  }),

  getById: protectedProcedure
    .input(z.object({ methodId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (!db) throw new Error('DB unavailable');
      const [rows] = await db.execute(
        'SELECT * FROM extraction_methods WHERE method_id = ? LIMIT 1',
        [input.methodId]
      ) as any;
      if (rows.length === 0) throw new Error('Méthode introuvable');
      return rows[0];
    }),

  // ── Création ─────────────────────────────────────────────────────────────────
  create: protectedProcedure
    .input(ExtractionMethodInput)
    .mutation(async ({ input }) => {
      const db = getDb();
      if (!db) throw new Error('DB unavailable');

      // Vérifier unicité du method_id
      const [existing] = await db.execute(
        'SELECT method_id FROM extraction_methods WHERE method_id = ? LIMIT 1',
        [input.methodId]
      ) as any;
      if (existing.length > 0) throw new Error(`L'identifiant "${input.methodId}" est déjà utilisé`);

      await db.execute(
        `INSERT INTO extraction_methods (
          method_id, name, short_name, category, description, principle,
          parameters, equipment, typical_yields, molecular_impact,
          preserved_molecules, degraded_molecules, advantages, disadvantages,
          best_for, not_recommended_for, cost_level, complexity_level,
          notes, references, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          input.methodId, input.name, input.shortName || null,
          input.category, input.description || null, input.principle || null,
          JSON.stringify(input.parameters || {}),
          JSON.stringify(input.equipment || []),
          JSON.stringify(input.typicalYields || {}),
          input.molecularImpact || null,
          JSON.stringify(input.preservedMolecules || []),
          JSON.stringify(input.degradedMolecules || []),
          JSON.stringify(input.advantages || []),
          JSON.stringify(input.disadvantages || []),
          JSON.stringify(input.bestFor || []),
          JSON.stringify(input.notRecommendedFor || []),
          input.costLevel || null, input.complexityLevel || null,
          input.notes || null,
          JSON.stringify(input.references || []),
        ]
      );
      return { success: true, methodId: input.methodId };
    }),

  // ── Mise à jour ───────────────────────────────────────────────────────────────
  update: protectedProcedure
    .input(ExtractionMethodInput.extend({ originalMethodId: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (!db) throw new Error('DB unavailable');

      await db.execute(
        `UPDATE extraction_methods SET
          method_id = ?, name = ?, short_name = ?, category = ?,
          description = ?, principle = ?, parameters = ?, equipment = ?,
          typical_yields = ?, molecular_impact = ?, preserved_molecules = ?,
          degraded_molecules = ?, advantages = ?, disadvantages = ?,
          best_for = ?, not_recommended_for = ?, cost_level = ?,
          complexity_level = ?, notes = ?, references = ?, updated_at = NOW()
        WHERE method_id = ?`,
        [
          input.methodId, input.name, input.shortName || null,
          input.category, input.description || null, input.principle || null,
          JSON.stringify(input.parameters || {}),
          JSON.stringify(input.equipment || []),
          JSON.stringify(input.typicalYields || {}),
          input.molecularImpact || null,
          JSON.stringify(input.preservedMolecules || []),
          JSON.stringify(input.degradedMolecules || []),
          JSON.stringify(input.advantages || []),
          JSON.stringify(input.disadvantages || []),
          JSON.stringify(input.bestFor || []),
          JSON.stringify(input.notRecommendedFor || []),
          input.costLevel || null, input.complexityLevel || null,
          input.notes || null,
          JSON.stringify(input.references || []),
          input.originalMethodId,
        ]
      );
      return { success: true };
    }),

  // ── Suppression ───────────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ methodId: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (!db) throw new Error('DB unavailable');

      // Vérifier s'il y a des liaisons plante-extraction
      const [links] = await db.execute(
        'SELECT COUNT(*) as n FROM plant_extractions WHERE method_id = ?',
        [input.methodId]
      ) as any;
      if (links[0].n > 0) {
        throw new Error(`Impossible de supprimer : ${links[0].n} plante(s) utilisent cette méthode`);
      }

      await db.execute('DELETE FROM extraction_methods WHERE method_id = ?', [input.methodId]);
      return { success: true };
    }),

  // ── Statistiques ─────────────────────────────────────────────────────────────
  getStats: protectedProcedure.query(async () => {
    const db = getDb();
    if (!db) throw new Error('DB unavailable');

    const [total] = await db.execute('SELECT COUNT(*) as n FROM extraction_methods') as any;
    const [byCategory] = await db.execute(
      'SELECT category, COUNT(*) as n FROM extraction_methods GROUP BY category ORDER BY n DESC'
    ) as any;
    const [withLinks] = await db.execute(
      'SELECT COUNT(DISTINCT method_id) as n FROM plant_extractions'
    ) as any;

    return {
      total: total[0].n,
      byCategory,
      withPlantLinks: withLinks[0].n,
    };
  }),
});
