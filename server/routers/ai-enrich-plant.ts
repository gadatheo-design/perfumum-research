import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const aiEnrichPlantRouter = router({
  enrich: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import('../_core/llm');
      const plant = await db.getPlantById(input.plantId);
      if (!plant) throw new Error('Plante non trouvée');

      const prompt = `Tu es un expert en botanique, chimie olfactive et phytothérapie. Enrichis la fiche de cette plante avec des données scientifiques précises.

Plante : ${plant.name}
Nom latin : ${plant.latinName || 'inconnu'}
Famille : ${plant.family || 'inconnue'}
Catégorie : ${plant.category || 'inconnue'}
Origine : ${plant.origin || 'inconnue'}
Profil olfactif actuel : ${plant.olfactiveSignature || 'non renseigné'}

Génère un objet JSON avec les champs suivants (uniquement les champs que tu peux enrichir avec certitude scientifique) :
{
  "olfactiveProfile": ["note1", "note2", "note3"],
  "therapeuticProperties": ["propriété1", "propriété2", "propriété3"],
  "dominantMolecules": ["molécule1", "molécule2", "molécule3"],
  "traditionalUse": "description de l'usage traditionnel",
  "habitat": "description de l'habitat naturel",
  "description": "description scientifique enrichie (2-3 phrases)"
}

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.`;

      let enriched: PlantEnrichmentLLM;
      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'Tu es un expert en botanique et chimie olfactive. Réponds uniquement en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'plant_enrichment',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  olfactiveProfile: { type: 'array', items: { type: 'string' }, description: 'Notes olfactives principales' },
                  therapeuticProperties: { type: 'array', items: { type: 'string' }, description: 'Propriétés thérapeutiques documentées' },
                  dominantMolecules: { type: 'array', items: { type: 'string' }, description: 'Molécules dominantes' },
                  traditionalUse: { type: 'string', description: 'Usage traditionnel' },
                  habitat: { type: 'string', description: 'Habitat naturel' },
                  description: { type: 'string', description: 'Description scientifique' },
                },
                required: ['olfactiveProfile', 'therapeuticProperties', 'dominantMolecules', 'traditionalUse', 'habitat', 'description'],
                additionalProperties: false,
              },
            },
          },
        });
        const raw = response?.choices?.[0]?.message?.content;
        if (!raw) throw new Error('Réponse LLM vide');
        enriched = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err: unknown) {
        throw new Error(`Erreur IA enrichissement plante "${plant.name}": ${err instanceof Error ? err.message : 'Échec appel LLM'}`);
      }

      const { createConnection: _ccPlantUpd } = await import('mysql2/promise');
      const _connPlant = await _ccPlantUpd(process.env.DATABASE_URL!);

      const updates: string[] = [];
      const params: (string | number | null)[] = [];

      if (enriched.olfactiveProfile?.length) {
        updates.push('olfactive_signature = ?');
        params.push(JSON.stringify(enriched.olfactiveProfile));
      }
      if (enriched.therapeuticProperties?.length) {
        updates.push('therapeutic_properties = ?');
        params.push(JSON.stringify(enriched.therapeuticProperties));
      }
      if (enriched.dominantMolecules?.length) {
        updates.push('dominant_molecules = ?');
        params.push(JSON.stringify(enriched.dominantMolecules));
      }
      if (enriched.traditionalUse) {
        updates.push('traditional_use = ?');
        params.push(enriched.traditionalUse);
      }
      if (enriched.habitat) {
        updates.push('habitat = ?');
        params.push(enriched.habitat);
      }
      if (enriched.description) {
        updates.push('notes = ?');
        params.push(enriched.description);
      }

      if (updates.length > 0) {
        params.push(input.plantId);
        await _connPlant.query(`UPDATE plants SET ${updates.join(', ')} WHERE id = ?`, params);
        await _connPlant.end();
      }

      return { success: true, enriched, updatedFields: updates.map(u => u.split(' = ')[0]) };
    }),

  preview: protectedProcedure
    .input(z.object({ plantId: z.number() }))
    .mutation(async ({ input }) => {
      const { invokeLLM } = await import('../_core/llm');
      const plant = await db.getPlantById(input.plantId);
      if (!plant) throw new Error('Plante non trouvée');

      const prompt = `Tu es un expert en botanique, chimie olfactive et phytothérapie. Enrichis la fiche de cette plante avec des données scientifiques précises.

Plante : ${plant.name}
Nom latin : ${plant.latinName || 'inconnu'}
Famille : ${plant.family || 'inconnue'}
Catégorie : ${plant.category || 'inconnue'}
Origine : ${plant.origin || 'inconnue'}
Profil olfactif actuel : ${plant.olfactiveSignature || 'non renseigné'}

Génère un objet JSON avec les champs suivants :
{
  "olfactiveProfile": ["note1", "note2", "note3"],
  "therapeuticProperties": ["propriété1", "propriété2", "propriété3"],
  "dominantMolecules": ["molécule1", "molécule2", "molécule3"],
  "traditionalUse": "description de l'usage traditionnel",
  "habitat": "description de l'habitat naturel",
  "description": "description scientifique enrichie (2-3 phrases)"
}

Réponds UNIQUEMENT avec le JSON.`;
      let enriched: PlantEnrichmentLLM;
      try {
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: 'Tu es un expert en botanique et chimie olfactive. Réponds uniquement en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'plant_enrichment',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  olfactiveProfile: { type: 'array', items: { type: 'string' } },
                  therapeuticProperties: { type: 'array', items: { type: 'string' } },
                  dominantMolecules: { type: 'array', items: { type: 'string' } },
                  traditionalUse: { type: 'string' },
                  habitat: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['olfactiveProfile', 'therapeuticProperties', 'dominantMolecules', 'traditionalUse', 'habitat', 'description'],
                additionalProperties: false,
              },
            },
          },
        });
        const raw = response?.choices?.[0]?.message?.content;
        if (!raw) throw new Error('Réponse LLM vide');
        enriched = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } catch (err: unknown) {
        throw new Error(`Erreur IA preview plante "${plant.name}": ${err instanceof Error ? err.message : 'Échec appel LLM'}`);
      }
      return { success: true, enriched, plantName: plant.name };
    }),
});
