/**
 * llm-link-bibliography.mjs
 * Enrichissement LLM automatique des références bibliographiques non liées.
 * Traite les références par batches de 10, en utilisant l'API LLM pour
 * extraire les entités nommées (plantes, molécules) et créer les liaisons.
 */

import mysql from 'mysql2/promise';

const API_URL = process.env.BUILT_IN_FORGE_API_URL + '/v1/chat/completions';
const API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const BATCH_SIZE = 10;
const MAX_BATCHES = 8; // Traiter 80 références max par exécution (prudent)
const SLEEP_MS = 2000; // Pause entre batches

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callLLM(messages, responseFormat) {
  const payload = {
    model: 'claude-sonnet-4-5',
    messages,
    max_tokens: 1024,
    response_format: responseFormat,
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM API error ${res.status}: ${err.substring(0, 200)}`);
  }
  return res.json();
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✅ Connexion DB établie');

  // Charger les noms de plantes et molécules pour le matching
  const [plants] = await conn.execute(
    'SELECT id, name, latin_name FROM plants ORDER BY name LIMIT 450'
  );
  const [molecules] = await conn.execute(
    'SELECT id, name FROM molecules ORDER BY name LIMIT 500'
  );

  // Construire des maps pour le matching rapide
  const plantMap = new Map();
  for (const p of plants) {
    plantMap.set(p.name.toLowerCase(), p.id);
    if (p.latin_name) plantMap.set(p.latin_name.toLowerCase(), p.id);
    // Ajouter le premier mot du nom latin (genre)
    if (p.latin_name) {
      const genus = p.latin_name.split(' ')[0].toLowerCase();
      if (!plantMap.has(genus)) plantMap.set(genus, p.id);
    }
  }
  const molMap = new Map();
  for (const m of molecules) {
    molMap.set(m.name.toLowerCase(), m.id);
  }

  // Construire les listes pour le prompt LLM (noms uniquement)
  const plantNames = plants.slice(0, 200).map(p => p.name).join(', ');
  const molNames = molecules.slice(0, 200).map(m => m.name).join(', ');

  let totalProcessed = 0;
  let totalLinked = 0;
  let totalErrors = 0;
  let offset = 0;

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    // Récupérer les références sans liaisons
    const [unlinked] = await conn.execute(
      `SELECT id, title, abstract, research_domain, keywords
       FROM bibliography_entries
       WHERE NOT EXISTS (
         SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = bibliography_entries.id
       )
       ORDER BY id
       LIMIT ${BATCH_SIZE} OFFSET ${offset}`
    );

    if (unlinked.length === 0) {
      console.log('✅ Toutes les références ont été traitées !');
      break;
    }

    console.log(`\n📦 Batch ${batch + 1}/${MAX_BATCHES} — ${unlinked.length} références (offset: ${offset})`);

    for (const ref of unlinked) {
      try {
        const prompt = `Titre: "${ref.title}"
Abstract: "${(ref.abstract || '').substring(0, 500)}"
Domaine: ${ref.research_domain || 'inconnu'}
Mots-clés: ${ref.keywords || ''}

Plantes disponibles (extrait): ${plantNames.substring(0, 800)}
Molécules disponibles (extrait): ${molNames.substring(0, 800)}

Identifie UNIQUEMENT les entités explicitement mentionnées dans le titre ou l'abstract.
Retourne {"plants": ["nom exact de la liste"], "molecules": ["nom exact de la liste"]}
Si aucune entité n'est trouvée, retourne {"plants": [], "molecules": []}`;

        const response = await callLLM(
          [
            {
              role: 'system',
              content: 'Tu es un expert en botanique et chimie olfactive. Analyse les références bibliographiques et identifie les entités nommées. Sois conservateur : ne retourne que les entités clairement mentionnées.',
            },
            { role: 'user', content: prompt },
          ],
          {
            type: 'json_schema',
            json_schema: {
              name: 'entity_extraction',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  plants: { type: 'array', items: { type: 'string' } },
                  molecules: { type: 'array', items: { type: 'string' } },
                },
                required: ['plants', 'molecules'],
                additionalProperties: false,
              },
            },
          }
        );

        const content = response.choices?.[0]?.message?.content;
        if (!content) {
          console.log(`  ⚠️  [${ref.id}] Pas de réponse LLM`);
          totalErrors++;
          continue;
        }

        let extracted;
        try {
          extracted = JSON.parse(content);
        } catch {
          console.log(`  ⚠️  [${ref.id}] JSON invalide: ${content.substring(0, 100)}`);
          totalErrors++;
          continue;
        }

        let refLinked = 0;

        // Lier les plantes trouvées
        for (const plantName of (extracted.plants || [])) {
          const plantId = plantMap.get(plantName.toLowerCase());
          if (plantId) {
            try {
              await conn.execute(
                `INSERT IGNORE INTO bibliography_entity_links 
                 (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
                 VALUES (?, 'plant', ?, 'primary_source', 75, 'Lié automatiquement par LLM', NOW())`,
                [ref.id, plantId]
              );
              refLinked++;
            } catch (e) {
              // Doublon ignoré
            }
          }
        }

        // Lier les molécules trouvées
        for (const molName of (extracted.molecules || [])) {
          const molId = molMap.get(molName.toLowerCase());
          if (molId) {
            try {
              await conn.execute(
                `INSERT IGNORE INTO bibliography_entity_links 
                 (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
                 VALUES (?, 'molecule', ?, 'chemical', 75, 'Lié automatiquement par LLM', NOW())`,
                [ref.id, molId]
              );
              refLinked++;
            } catch (e) {
              // Doublon ignoré
            }
          }
        }

        if (refLinked > 0) {
          console.log(`  ✅ [${ref.id}] "${ref.title.substring(0, 50)}..." → ${refLinked} liaison(s) | plantes: [${extracted.plants.join(', ')}] | molécules: [${extracted.molecules.join(', ')}]`);
          totalLinked += refLinked;
        } else {
          console.log(`  ○  [${ref.id}] "${ref.title.substring(0, 50)}..." → aucune entité trouvée`);
        }

        totalProcessed++;

      } catch (err) {
        console.log(`  ❌ [${ref.id}] Erreur: ${err.message.substring(0, 100)}`);
        totalErrors++;
      }

      // Petite pause entre chaque appel LLM
      await sleep(500);
    }

    offset += BATCH_SIZE;
    console.log(`\n📊 Progression : ${totalProcessed} traitées, ${totalLinked} liaisons créées, ${totalErrors} erreurs`);

    if (batch < MAX_BATCHES - 1) {
      console.log(`⏳ Pause ${SLEEP_MS}ms avant le prochain batch...`);
      await sleep(SLEEP_MS);
    }
  }

  // Statistiques finales
  const [stats] = await conn.execute(`
    SELECT 
      (SELECT COUNT(*) FROM bibliography_entries) as total,
      (SELECT COUNT(DISTINCT bibliography_id) FROM bibliography_entity_links) as linked,
      (SELECT COUNT(*) FROM bibliography_entity_links) as total_links
  `);

  console.log('\n═══════════════════════════════════════');
  console.log('📊 RÉSULTATS FINAUX');
  console.log('═══════════════════════════════════════');
  console.log(`Références traitées ce run : ${totalProcessed}`);
  console.log(`Liaisons créées ce run     : ${totalLinked}`);
  console.log(`Erreurs ce run             : ${totalErrors}`);
  console.log(`─────────────────────────────────────`);
  console.log(`Total références en base   : ${stats[0].total}`);
  console.log(`Références liées           : ${stats[0].linked} (${Math.round(stats[0].linked / stats[0].total * 100)}%)`);
  console.log(`Total liaisons             : ${stats[0].total_links}`);

  await conn.end();
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
