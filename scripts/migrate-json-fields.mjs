/**
 * Script de migration : convertit les champs text olfactiveProfile et therapeuticProperties
 * vers les colonnes JSON standardisées olfactive_profile_json et therapeutic_properties_json
 * 
 * Stratégie de parsing :
 * 1. Si la valeur est déjà un JSON array → utiliser directement
 * 2. Si la valeur est une string JSON → parser et utiliser
 * 3. Si la valeur est une string simple avec virgules → splitter par ", " ou ","
 * 4. Si la valeur est une string simple → mettre dans un tableau à un élément
 * 5. Si null/vide → laisser null
 * 
 * Usage : node scripts/migrate-json-fields.mjs [--dry-run]
 */

import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) {
  console.log('🔍 MODE DRY-RUN — aucune modification ne sera effectuée\n');
}

/**
 * Convertit une valeur texte en tableau de strings normalisé
 */
function textToArray(value) {
  if (value === null || value === undefined || value === '') return null;
  
  // Déjà un tableau (ne devrait pas arriver depuis MySQL text, mais par sécurité)
  if (Array.isArray(value)) {
    const arr = value.map(s => String(s).trim()).filter(Boolean);
    return arr.length > 0 ? arr : null;
  }
  
  const str = String(value).trim();
  if (!str) return null;
  
  // Tenter de parser comme JSON
  if (str.startsWith('[')) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        const arr = parsed.map(s => String(s).trim()).filter(Boolean);
        return arr.length > 0 ? arr : null;
      }
    } catch {
      // Pas du JSON valide, continuer
    }
  }
  
  // String avec séparateurs courants : " / ", " ; ", ", ", ","
  // Détecter le séparateur dominant
  let parts;
  if (str.includes(' / ')) {
    parts = str.split(' / ');
  } else if (str.includes(' ; ') || str.includes('; ')) {
    parts = str.split(/\s*;\s*/);
  } else if (str.includes(', ') || str.includes(',')) {
    parts = str.split(/,\s*/);
  } else {
    // String simple → tableau à un élément
    parts = [str];
  }
  
  const arr = parts.map(s => s.trim()).filter(Boolean);
  return arr.length > 0 ? arr : null;
}

async function main() {
  const connection = await mysql2.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('📊 Récupération des molécules...');
    
    // Récupérer toutes les molécules avec leurs champs text et JSON
    const [rows] = await connection.execute(
      `SELECT id, name, 
              olfactiveProfile, olfactive_profile_json,
              therapeuticProperties, therapeutic_properties_json
       FROM molecules
       ORDER BY id`
    );
    
    console.log(`📋 ${rows.length} molécules trouvées\n`);
    
    let migratedOlfactive = 0;
    let migratedTherapeutic = 0;
    let skippedOlfactive = 0;
    let skippedTherapeutic = 0;
    let errorCount = 0;
    
    for (const row of rows) {
      const updates = {};
      const logParts = [];
      
      // --- olfactiveProfile ---
      if (row.olfactive_profile_json !== null && row.olfactive_profile_json !== undefined) {
        // Déjà migré
        skippedOlfactive++;
      } else if (row.olfactiveProfile) {
        const arr = textToArray(row.olfactiveProfile);
        if (arr) {
          updates.olfactive_profile_json = JSON.stringify(arr);
          logParts.push(`olfactive: "${row.olfactiveProfile.substring(0, 40)}..." → [${arr.length} items]`);
          migratedOlfactive++;
        }
      }
      
      // --- therapeuticProperties ---
      if (row.therapeutic_properties_json !== null && row.therapeutic_properties_json !== undefined) {
        // Déjà migré
        skippedTherapeutic++;
      } else if (row.therapeuticProperties) {
        const arr = textToArray(row.therapeuticProperties);
        if (arr) {
          updates.therapeutic_properties_json = JSON.stringify(arr);
          logParts.push(`therapeutic: "${row.therapeuticProperties.substring(0, 40)}..." → [${arr.length} items]`);
          migratedTherapeutic++;
        }
      }
      
      // Appliquer les mises à jour
      if (Object.keys(updates).length > 0) {
        if (logParts.length > 0) {
          console.log(`  [${row.id}] ${row.name}: ${logParts.join(' | ')}`);
        }
        
        if (!DRY_RUN) {
          try {
            const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
            const values = [...Object.values(updates), row.id];
            await connection.execute(
              `UPDATE molecules SET ${setClauses} WHERE id = ?`,
              values
            );
          } catch (err) {
            console.error(`  ❌ Erreur pour molécule ${row.id} (${row.name}): ${err.message}`);
            errorCount++;
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`olfactiveProfile  → migré: ${migratedOlfactive} | déjà migré: ${skippedOlfactive}`);
    console.log(`therapeuticProps  → migré: ${migratedTherapeutic} | déjà migré: ${skippedTherapeutic}`);
    if (errorCount > 0) console.log(`❌ Erreurs: ${errorCount}`);
    if (DRY_RUN) console.log('\n⚠️  DRY-RUN : aucune modification effectuée. Relancer sans --dry-run pour appliquer.');
    else console.log('\n✅ Migration terminée avec succès.');
    
  } finally {
    await connection.end();
  }
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});
