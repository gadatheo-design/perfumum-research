/**
 * standardize-references.mjs
 * Convertit le champ `references` de la table molecules :
 * - String JSON "[{...}]" → tableau JSON natif (UPDATE avec JSON_ARRAY valide)
 * - Tableau JSON natif déjà correct → ignoré
 * - NULL → ignoré
 *
 * Usage:
 *   node scripts/standardize-references.mjs --dry-run   (prévisualisation)
 *   node scripts/standardize-references.mjs              (migration réelle)
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const DRY_RUN = process.argv.includes('--dry-run');

async function run() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);

  // Récupérer toutes les molécules avec references non-null
  const [rows] = await db.execute(
    'SELECT id, name, `references` FROM molecules WHERE `references` IS NOT NULL'
  );

  let alreadyArray = 0;
  let converted = 0;
  let invalid = 0;
  let errors = [];

  for (const row of rows) {
    const raw = row.references;
    if (!raw) continue;

    // Cas 1 : déjà un tableau JSON natif (MySQL retourne parfois comme objet)
    if (Array.isArray(raw)) {
      alreadyArray++;
      continue;
    }

    // Cas 2 : string JSON à parser
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      
      // Vérifier si c'est un tableau JSON valide
      if (!trimmed.startsWith('[')) {
        // String simple non-JSON → envelopper dans un tableau
        const asArray = [{ title: trimmed, type: 'note' }];
        if (!DRY_RUN) {
          await db.execute(
            'UPDATE molecules SET `references` = ? WHERE id = ?',
            [JSON.stringify(asArray), row.id]
          );
        }
        converted++;
        continue;
      }

      try {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed)) {
          // Objet JSON → envelopper dans un tableau
          const asArray = [parsed];
          if (!DRY_RUN) {
            await db.execute(
              'UPDATE molecules SET `references` = ? WHERE id = ?',
              [JSON.stringify(asArray), row.id]
            );
          }
          converted++;
        } else {
          // Tableau JSON valide → re-sérialiser proprement
          if (!DRY_RUN) {
            await db.execute(
              'UPDATE molecules SET `references` = ? WHERE id = ?',
              [JSON.stringify(parsed), row.id]
            );
          }
          converted++;
        }
      } catch (e) {
        invalid++;
        errors.push({ id: row.id, name: row.name, raw: trimmed.slice(0, 80), error: e.message });
      }
    }
  }

  console.log(`\n=== ${DRY_RUN ? 'DRY-RUN' : 'MIGRATION'} references ===`);
  console.log(`Total avec references : ${rows.length}`);
  console.log(`Déjà tableaux natifs  : ${alreadyArray}`);
  console.log(`Convertis             : ${converted}`);
  console.log(`Invalides (erreurs)   : ${invalid}`);
  
  if (errors.length > 0) {
    console.log('\nErreurs :');
    for (const e of errors) {
      console.log(`  [${e.id}] ${e.name}: ${e.error} — "${e.raw}"`);
    }
  }

  if (DRY_RUN) {
    console.log('\n→ Relancer sans --dry-run pour appliquer la migration.');
  } else {
    console.log('\n✅ Migration terminée.');
  }

  await db.end();
}

run().catch(console.error);
