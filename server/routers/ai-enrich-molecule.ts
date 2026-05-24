import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { MoleculeEnrichmentLLM } from "../routers";

export const aiEnrichMoleculeRouter = router({
  preview: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const { invokeLLM } = await import('../_core/llm');
      const { createConnection: _ccMol } = await import('mysql2/promise');
      const _connMol = await _ccMol(process.env.DATABASE_URL!);
      const [rows] = await _connMol.query(`SELECT id, name, formula, family, iupac_name, cas_number, olfactiveProfile, therapeuticProperties, notes FROM molecules WHERE id = ?`, [input.id]);
      await _connMol.end();
      const mol = (rows as Record<string,unknown>[])[0];
      if (!mol) throw new Error('Molécule non trouvée');
      const prompt = `Tu es un expert en chimie olfactive et phytochimie. Enrichis la fiche de cette molécule avec des données scientifiques précises.
Molécule : ${mol.name}
Formule : ${mol.formula || 'inconnue'}
Famille chimique : ${mol.family || 'inconnue'}
IUPAC : ${mol.iupac_name || 'non renseigné'}
CAS : ${mol.cas_number || 'non renseigné'}
Profil olfactif actuel : ${mol.olfactiveProfile || 'non renseigné'}
Propriétés thérapeutiques actuelles : ${mol.therapeuticProperties || 'non renseigné'}
Génère un objet JSON avec les champs suivants (uniquement ceux que tu peux enrichir avec certitude scientifique) :
{
  "olfactiveProfile": ["note1", "note2", "note3"],
  "therapeuticProperties": ["propriété1", "propriété2", "propriété3"],
  "family": "famille chimique précise",
  "iupac_name": "nom IUPAC si connu",
  "notes": "description scientifique enrichie (2-3 phrases)"
}
Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.`;
      let enriched: MoleculeEnrichmentLLM;
      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'Tu es un expert en chimie olfactive. Réponds uniquement en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'molecule_enrichment',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  olfactiveProfile: { type: 'array', items: { type: 'string' } },
                  therapeuticProperties: { type: 'array', items: { type: 'string' } },
                  family: { type: 'string' },
                  iupac_name: { type: 'string' },
                  notes: { type: 'string' }
                },
                required: ['olfactiveProfile', 'therapeuticProperties', 'family', 'iupac_name', 'notes'],
                additionalProperties: false
              }
            }
          }
        });
        const raw = response.choices[0].message.content;
        enriched = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err: unknown) {
        throw new Error(`Erreur IA preview molécule "${mol.name}": ${err instanceof Error ? err.message : 'Échec appel LLM'}`);
      }
      return { molecule: mol, enriched };
    }),

  enrich: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import('../_core/llm');
      const { createConnection: _ccMol } = await import('mysql2/promise');
      const _connMol = await _ccMol(process.env.DATABASE_URL!);
      const [rows] = await _connMol.query(`SELECT id, name, formula, family, iupac_name, cas_number, olfactiveProfile, therapeuticProperties, notes FROM molecules WHERE id = ?`, [input.id]);
      await _connMol.end();
      const mol = (rows as Record<string,unknown>[])[0];
      if (!mol) throw new Error('Molécule non trouvée');
      const prompt = `Tu es un expert en chimie olfactive et phytochimie. Enrichis la fiche de cette molécule avec des données scientifiques précises.
Molécule : ${mol.name}
Formule : ${mol.formula || 'inconnue'}
Famille chimique : ${mol.family || 'inconnue'}
IUPAC : ${mol.iupac_name || 'non renseigné'}
CAS : ${mol.cas_number || 'non renseigné'}
Profil olfactif actuel : ${mol.olfactiveProfile || 'non renseigné'}
Propriétés thérapeutiques actuelles : ${mol.therapeuticProperties || 'non renseigné'}
Génère un objet JSON avec les champs suivants :
{
  "olfactiveProfile": ["note1", "note2", "note3"],
  "therapeuticProperties": ["propriété1", "propriété2", "propriété3"],
  "family": "famille chimique précise",
  "iupac_name": "nom IUPAC si connu",
  "notes": "description scientifique enrichie (2-3 phrases)"
}
Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.`;
      let enriched: MoleculeEnrichmentLLM;
      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'Tu es un expert en chimie olfactive. Réponds uniquement en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'molecule_enrichment',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  olfactiveProfile: { type: 'array', items: { type: 'string' } },
                  therapeuticProperties: { type: 'array', items: { type: 'string' } },
                  family: { type: 'string' },
                  iupac_name: { type: 'string' },
                  notes: { type: 'string' }
                },
                required: ['olfactiveProfile', 'therapeuticProperties', 'family', 'iupac_name', 'notes'],
                additionalProperties: false
              }
            }
          }
        });
        const raw = response.choices[0].message.content;
        enriched = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err: unknown) {
        throw new Error(`Erreur IA enrichissement molécule "${mol.name}": ${err instanceof Error ? err.message : 'Échec appel LLM'}`);
      }
      const updates: string[] = [];
      const params: (string | number | null)[] = [];
      // Écrire dans les colonnes JSON standardisées (priorité) ET dans les colonnes text legacy (rétrocompatibilité)
      if (enriched.olfactiveProfile?.length) {
        updates.push("olfactive_profile_json = ?");
        params.push(JSON.stringify(enriched.olfactiveProfile));
        updates.push("olfactiveProfile = ?");
        params.push(enriched.olfactiveProfile.join(', '));
      }
      if (enriched.therapeuticProperties?.length) {
        updates.push("therapeutic_properties_json = ?");
        params.push(JSON.stringify(enriched.therapeuticProperties));
        updates.push("therapeuticProperties = ?");
        params.push(enriched.therapeuticProperties.join(', '));
      }
      if (enriched.family && !mol.family) { updates.push("family = ?"); params.push(enriched.family); }
      if (enriched.iupac_name && !mol.iupac_name) { updates.push("iupac_name = ?"); params.push(enriched.iupac_name); }
      if (enriched.notes && !mol.notes) { updates.push("notes = ?"); params.push(enriched.notes); }
      if (updates.length > 0) {
        params.push(input.id);
        const { createConnection: _ccMolUpd } = await import('mysql2/promise');
        const _connMolUpd = await _ccMolUpd(process.env.DATABASE_URL!);
        await _connMolUpd.query(`UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`, params);
        await _connMolUpd.end();
      }
      return { success: true, fieldsUpdated: updates.length, enriched };
    }),
});
