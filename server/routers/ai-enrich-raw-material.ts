import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const aiEnrichRawMaterialRouter = router({
  enrich: protectedProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import('../_core/llm');

      const { createConnection } = await import('mysql2/promise');
      const _conn = await createConnection(process.env.DATABASE_URL!);
      const [rows] = await _conn.query(`SELECT * FROM raw_materials WHERE id = ?`, [input.rawMaterialId]);
      await _conn.end();
      const rm = (rows as Record<string, unknown>[])[0];
      if (!rm) throw new Error('Matière première non trouvée');

      const prompt = `Tu es un expert en parfumerie, chimie olfactive et matières premières naturelles. Enrichis la fiche de cette matière première.

Matière première : ${rm.name}
Catégorie : ${rm.category || 'inconnue'}
Plante source : ${rm.plant_source || 'inconnue'}
Famille olfactive : ${rm.olfactive_family || 'inconnue'}
Description actuelle : ${rm.description || 'non renseignée'}
Méthode d'extraction : ${rm.extraction_method || 'inconnue'}

Génère un objet JSON avec les champs suivants :
{
  "description": "description scientifique et sensorielle enrichie (3-4 phrases)",
  "olfactiveNotes": ["note de tête", "note de cœur", "note de fond"],
  "keyMolecules": ["molécule1", "molécule2", "molécule3"],
  "usagesInPerfumery": "description des usages en parfumerie",
  "extractionDetails": "détails sur le procédé d'extraction",
  "qualityMarkers": ["marqueur1", "marqueur2"]
}

Réponds UNIQUEMENT avec le JSON.`;
      let enriched: RawMaterialEnrichmentLLM & { olfactiveNotes?: string[] };
      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'Tu es un expert en parfumerie et chimie olfactive. Réponds uniquement en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'raw_material_enrichment',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  olfactiveNotes: { type: 'array', items: { type: 'string' } },
                  keyMolecules: { type: 'array', items: { type: 'string' } },
                  usagesInPerfumery: { type: 'string' },
                  extractionDetails: { type: 'string' },
                  qualityMarkers: { type: 'array', items: { type: 'string' } },
                },
                required: ['description', 'olfactiveNotes', 'keyMolecules', 'usagesInPerfumery', 'extractionDetails', 'qualityMarkers'],
                additionalProperties: false,
              },
            },
          },
        });
        const raw = response?.choices?.[0]?.message?.content;
        if (!raw) throw new Error('Réponse LLM vide');
        enriched = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err: unknown) {
        throw new Error(`Erreur IA enrichissement matière "${rm.name}": ${err instanceof Error ? err.message : 'Échec appel LLM'}`);
      }
      if (enriched.description) {
        const { createConnection: _cc } = await import('mysql2/promise');
        const _connUpd = await _cc(process.env.DATABASE_URL!);
        await _connUpd.query(
          `UPDATE raw_materials SET notes = ?, olfactive_profile = ?, usage_notes = ? WHERE id = ?`,
          [enriched.description, enriched.olfactiveNotes ? enriched.olfactiveNotes.join(', ') : null, enriched.usagesInPerfumery || null, input.rawMaterialId]
        );
        await _connUpd.end();
      }

      return { success: true, enriched, materialName: rm.name };
    }),

  preview: protectedProcedure
    .input(z.object({ rawMaterialId: z.number() }))
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import('../_core/llm');

      const { createConnection } = await import('mysql2/promise');
      const _conn = await createConnection(process.env.DATABASE_URL!);
      const [rows] = await _conn.query(`SELECT * FROM raw_materials WHERE id = ?`, [input.rawMaterialId]);
      await _conn.end();
      const rm = (rows as Record<string, unknown>[])[0];
      if (!rm) throw new Error('Matière première non trouvée');

      const prompt = `Tu es un expert en parfumerie et matières premières naturelles. Enrichis la fiche de cette matière première.

Matière première : ${rm.name}
Catégorie : ${rm.category || 'inconnue'}
Plante source : ${rm.plant_source || 'inconnue'}
Famille olfactive : ${rm.olfactive_family || 'inconnue'}

Génère un objet JSON :
{
  "description": "description scientifique enrichie",
  "olfactiveNotes": ["note1", "note2", "note3"],
  "keyMolecules": ["molécule1", "molécule2", "molécule3"],
  "usagesInPerfumery": "usages en parfumerie",
  "extractionDetails": "détails extraction",
  "qualityMarkers": ["marqueur1", "marqueur2"]
}"`;
      let enriched: RawMaterialEnrichmentLLM & { olfactiveNotes?: string[] };
      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'Tu es un expert en parfumerie. Réponds uniquement en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'raw_material_enrichment',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  olfactiveNotes: { type: 'array', items: { type: 'string' } },
                  keyMolecules: { type: 'array', items: { type: 'string' } },
                  usagesInPerfumery: { type: 'string' },
                  extractionDetails: { type: 'string' },
                  qualityMarkers: { type: 'array', items: { type: 'string' } },
                },
                required: ['description', 'olfactiveNotes', 'keyMolecules', 'usagesInPerfumery', 'extractionDetails', 'qualityMarkers'],
                additionalProperties: false,
              },
            },
          },
        });
        const raw = response?.choices?.[0]?.message?.content;
        if (!raw) throw new Error('Réponse LLM vide');
        enriched = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err: unknown) {
        throw new Error(`Erreur IA preview matière "${rm.name}": ${err instanceof Error ? err.message : 'Échec appel LLM'}`);
      }
      return { success: true, enriched, materialName: rm.name };
    }),
});
