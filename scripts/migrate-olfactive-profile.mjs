/**
 * Migration : standardiser olfactiveProfile en JSON array dans la table molecules
 * 
 * Règles de conversion :
 * - NULL → reste NULL (pas de modification)
 * - "[]" ou "[ ]" → NULL (tableau vide → NULL)
 * - "[\"val1\",\"val2\"]" → inchangé (déjà JSON array)
 * - "val1, val2, val3" → ["val1", "val2", "val3"]
 * - "val1. val2. val3" → ["val1", "val2", "val3"]
 * - "val1" → ["val1"]
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

function normalizeOlfactiveProfile(value) {
  if (value === null || value === undefined) return null;
  
  const str = String(value).trim();
  
  // Déjà un JSON array valide
  if (str.startsWith('[')) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        // Filtrer les valeurs vides
        const filtered = parsed.filter(v => v && String(v).trim() !== '');
        if (filtered.length === 0) return null;
        return JSON.stringify(filtered);
      }
    } catch {
      // Pas un JSON valide, traiter comme string
    }
  }
  
  // String vide
  if (str === '' || str === '{}' || str === 'null' || str === 'undefined') return null;
  
  // Séparer par virgule, point-virgule, ou point
  let parts = [];
  if (str.includes(',')) {
    parts = str.split(',').map(s => s.trim()).filter(s => s !== '');
  } else if (str.includes(';')) {
    parts = str.split(';').map(s => s.trim()).filter(s => s !== '');
  } else if (str.includes('. ')) {
    parts = str.split('. ').map(s => s.trim()).filter(s => s !== '');
  } else {
    parts = [str];
  }
  
  if (parts.length === 0) return null;
  return JSON.stringify(parts);
}

async function main() {
  console.log('🔄 Migration olfactiveProfile — démarrage...\n');
  
  const conn = await mysql.createConnection(DATABASE_URL);
  
  try {
    // 1. Analyser l'état actuel
    const [stats] = await conn.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN olfactiveProfile IS NULL THEN 1 ELSE 0 END) as null_count,
        SUM(CASE WHEN olfactiveProfile LIKE '[%' THEN 1 ELSE 0 END) as json_array_count,
        SUM(CASE WHEN olfactiveProfile IS NOT NULL AND olfactiveProfile NOT LIKE '[%' THEN 1 ELSE 0 END) as plain_string_count
      FROM molecules
    `);
    
    const s = stats[0];
    console.log('📊 État actuel :');
    console.log(`   Total molécules : ${s.total}`);
    console.log(`   NULL : ${s.null_count}`);
    console.log(`   JSON array : ${s.json_array_count}`);
    console.log(`   Plain string : ${s.plain_string_count}`);
    console.log('');
    
    // 2. Charger les molécules avec olfactiveProfile non-null
    const [rows] = await conn.execute(`
      SELECT id, name, olfactiveProfile 
      FROM molecules 
      WHERE olfactiveProfile IS NOT NULL
      ORDER BY id
    `);
    
    console.log(`📝 ${rows.length} molécules à traiter...\n`);
    
    let updated = 0;
    let unchanged = 0;
    let nullified = 0;
    const errors = [];
    
    for (const row of rows) {
      const original = row.olfactiveProfile;
      const normalized = normalizeOlfactiveProfile(original);
      
      if (normalized === original) {
        unchanged++;
        continue;
      }
      
      try {
        if (normalized === null) {
          await conn.execute('UPDATE molecules SET olfactiveProfile = NULL WHERE id = ?', [row.id]);
          nullified++;
          console.log(`  🗑  [${row.id}] ${row.name} : "${original}" → NULL`);
        } else {
          await conn.execute('UPDATE molecules SET olfactiveProfile = ? WHERE id = ?', [normalized, row.id]);
          updated++;
          if (updated <= 20) {
            console.log(`  ✅ [${row.id}] ${row.name} : "${original}" → ${normalized}`);
          }
        }
      } catch (err) {
        errors.push({ id: row.id, name: row.name, error: err.message });
        console.error(`  ❌ [${row.id}] ${row.name} : ${err.message}`);
      }
    }
    
    if (updated > 20) {
      console.log(`  ... et ${updated - 20} autres mises à jour`);
    }
    
    console.log('\n✅ Migration terminée :');
    console.log(`   Mis à jour : ${updated}`);
    console.log(`   Nullifiés : ${nullified}`);
    console.log(`   Inchangés : ${unchanged}`);
    if (errors.length > 0) {
      console.log(`   Erreurs : ${errors.length}`);
    }
    
    // 3. Vérifier l'état final
    const [finalStats] = await conn.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN olfactiveProfile IS NULL THEN 1 ELSE 0 END) as null_count,
        SUM(CASE WHEN olfactiveProfile LIKE '[%' THEN 1 ELSE 0 END) as json_array_count,
        SUM(CASE WHEN olfactiveProfile IS NOT NULL AND olfactiveProfile NOT LIKE '[%' THEN 1 ELSE 0 END) as plain_string_count
      FROM molecules
    `);
    
    const fs = finalStats[0];
    console.log('\n📊 État final :');
    console.log(`   Total molécules : ${fs.total}`);
    console.log(`   NULL : ${fs.null_count}`);
    console.log(`   JSON array : ${fs.json_array_count}`);
    console.log(`   Plain string restantes : ${fs.plain_string_count}`);
    
    if (fs.plain_string_count > 0) {
      const [remaining] = await conn.execute(`
        SELECT id, name, olfactiveProfile 
        FROM molecules 
        WHERE olfactiveProfile IS NOT NULL AND olfactiveProfile NOT LIKE '[%'
        LIMIT 10
      `);
      console.log('\n⚠️  Valeurs non converties :');
      remaining.forEach(r => console.log(`   [${r.id}] ${r.name} : "${r.olfactiveProfile}"`));
    }
    
  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err);
  process.exit(1);
});
