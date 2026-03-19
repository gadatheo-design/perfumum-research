/**
 * Router tRPC — Administration des méthodes d'extraction
 * Permet aux collaborateurs de gérer les méthodes via l'interface admin du site.
 * Source : Patel et al. (2021) — Extraction methods for natural aromatic compounds
 */

import { z } from 'zod';
import { sql } from 'drizzle-orm';
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
  parameters: z.record(z.string(), z.any()).optional(),
  equipment: z.array(z.string()).optional(),
  typicalYields: z.record(z.string(), z.any()).optional(),
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
    const db = await getDb();
    if (!db) throw new Error('DB unavailable');
    const rows = await db.execute(sql`
      SELECT * FROM extraction_methods ORDER BY category, name
    `);
    return rows as unknown as any[];
  }),

  getById: protectedProcedure
    .input(z.object({ methodId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');
      const rows = await db.execute(sql`
        SELECT * FROM extraction_methods WHERE method_id = ${input.methodId} LIMIT 1
      `);
      const list = rows as unknown as any[];
      if (list.length === 0) throw new Error('Méthode introuvable');
      return list[0];
    }),

  // ── Création ─────────────────────────────────────────────────────────────────
  create: protectedProcedure
    .input(ExtractionMethodInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');

      // Vérifier unicité du method_id
      const existing = await db.execute(sql`
        SELECT method_id FROM extraction_methods WHERE method_id = ${input.methodId} LIMIT 1
      `);
      const existingList = existing as unknown as any[];
      if (existingList.length > 0) throw new Error(`L'identifiant "${input.methodId}" est déjà utilisé`);

      const params = JSON.stringify(input.parameters || {});
      const equipment = JSON.stringify(input.equipment || []);
      const yields = JSON.stringify(input.typicalYields || {});
      const preserved = JSON.stringify(input.preservedMolecules || []);
      const degraded = JSON.stringify(input.degradedMolecules || []);
      const advantages = JSON.stringify(input.advantages || []);
      const disadvantages = JSON.stringify(input.disadvantages || []);
      const bestFor = JSON.stringify(input.bestFor || []);
      const notFor = JSON.stringify(input.notRecommendedFor || []);
      const refs = JSON.stringify(input.references || []);

      await db.execute(sql`
        INSERT INTO extraction_methods (
          method_id, name, short_name, category, description, principle,
          parameters, equipment, typical_yields, molecular_impact,
          preserved_molecules, degraded_molecules, advantages, disadvantages,
          best_for, not_recommended_for, cost_level, complexity_level,
          notes, references, created_at, updated_at
        ) VALUES (
          ${input.methodId}, ${input.name}, ${input.shortName || null},
          ${input.category}, ${input.description || null}, ${input.principle || null},
          ${params}, ${equipment}, ${yields}, ${input.molecularImpact || null},
          ${preserved}, ${degraded}, ${advantages}, ${disadvantages},
          ${bestFor}, ${notFor}, ${input.costLevel || null}, ${input.complexityLevel || null},
          ${input.notes || null}, ${refs}, NOW(), NOW()
        )
      `);
      return { success: true, methodId: input.methodId };
    }),

  // ── Mise à jour ───────────────────────────────────────────────────────────────
  update: protectedProcedure
    .input(ExtractionMethodInput.extend({ originalMethodId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('DB unavailable');

      const params = JSON.stringify(input.parameters || {});
      const equipment = JSON.stringify(input.equipment || []);
      const yields = JSON.stringify(input.typicalYields || {});
      const preserved = JSON.stringify(input.preservedMolecules || []);
      const degraded = JSON.stringify(input.degradedMolecules || []);
      const advantages = JSON.stringify(input.advantages || []);
      const disadvantages = JSON.stringify(input.disadvantages || []);
      const bestFor = JSON.stringify(input.bestFor || []);
      const notFor = JSON.stringify(input.notRecommendedFor || []);
      const refs = JSON.stringify(input.references || []);

      await db.execute(sql`
        UPDATE extraction_methods SET
          method_id = ${input.methodId}, name = ${input.name},
          short_name = ${input.shortName || null}, category = ${input.category},
          description = ${input.description || null}, principle = ${input.principle || null},
          parameters = ${params}, equipment = ${equipment},
          typical_yields = ${yields}, molecular_impact = ${input.molecularImpact || null},
          preserved_molecules = ${preserved}, degraded_molecules = ${degraded},
          advantages = ${advantages}, disadvantages = ${disadvantages},
          best_for = ${bestFor}, not_recommended_for = ${notFor},
          cost_level = ${input.costLevel || null}, complexity_level = ${input.complexityLevel || null},
          notes = ${input.notes || null}, references = ${refs}, updated_at = NOW()
        WHERE method_id = ${input.originalMethodId}
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
      const links = await db.execute(sql`
        SELECT COUNT(*) as n FROM plant_extractions WHERE method_id = ${input.methodId}
      `);
      const linkList = links as unknown as any[];
      if (linkList[0]?.n > 0) {
        throw new Error(`Impossible de supprimer : ${linkList[0].n} plante(s) utilisent cette méthode`);
      }

      await db.execute(sql`
        DELETE FROM extraction_methods WHERE method_id = ${input.methodId}
      `);
      return { success: true };
    }),

  // ── Statistiques ─────────────────────────────────────────────────────────────
  getStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error('DB unavailable');

    const total = await db.execute(sql`SELECT COUNT(*) as n FROM extraction_methods`);
    const byCategory = await db.execute(sql`
      SELECT category, COUNT(*) as n FROM extraction_methods GROUP BY category ORDER BY n DESC
    `);
    const withLinks = await db.execute(sql`
      SELECT COUNT(DISTINCT method_id) as n FROM plant_extractions
    `);

    const totalList = total as unknown as any[];
    const byCategoryList = byCategory as unknown as any[];
    const withLinksList = withLinks as unknown as any[];

    return {
      total: totalList[0]?.n ?? 0,
      byCategory: byCategoryList,
      withPlantLinks: withLinksList[0]?.n ?? 0,
    };
  }),
});
