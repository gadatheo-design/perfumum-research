/**
 * Script de migration : standardise olfactiveProfile et therapeuticProperties
 * 
 * Règles :
 * - Si déjà un tableau JSON → laisser tel quel
 * - Si string simple avec virgules (longueur < 200 chars) → split sur ", " → tableau de tags
 * - Si string longue (description scientifique) → tableau à 1 élément
 * - Si null/vide → laisser null
 * 
 * Usage : node scripts/standardize-json-fields.mjs [--dry-run]
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Détermine si une string est une liste de tags séparés par des virgules
 * ou une description en prose.
 *
 * Critères pour considérer comme "liste de tags" :
 * - Longueur totale < 200 chars
 * - Chaque segment (après split sur ',') fait < 60 chars
 * - Pas de point '.' dans les segments (signe de phrase rédigée)
 * - Au moins 2 segments
 */
function isTagList(str) {
  if (!str.includes(',')) return false;
  if (str.length >= 200) return false;
  const segments = str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  if (segments.length < 2) return false;
  // Si un segment contient un point ou est trop long, c'est de la prose
  const allTagLike = segments.every(s => s.length < 60 && !s.includes('. '));
  return allTagLike;
}

function parseField(value) {
  if (value === null || value === undefined) return null;
  
  // Déjà un tableau → OK
  if (Array.isArray(value)) return value;
  
  // String JSON → parser
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    
    // Déjà du JSON tableau
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    
    // Liste de tags séparés par des virgules → split
    if (isTagList(trimmed)) {
      return trimmed
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    }
    
    // Description longue ou prose → tableau à 1 élément (préserve le texte)
    return [trimmed];
  }
  
  return null;
}

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (aucune modification)' : 'LIVE (modifications en base)'}`);
  console.log();
  
  // Récupérer toutes les molécules avec ces champs
  const [rows] = await db.execute(
    'SELECT id, name, olfactiveProfile, therapeuticProperties FROM molecules'
  );
  
  console.log(`Total molécules: ${rows.length}`);
  
  let opUpdated = 0, opSkipped = 0, opNull = 0;
  let tpUpdated = 0, tpSkipped = 0, tpNull = 0;
  
  const updates = [];
  
  for (const row of rows) {
    const { id, name, olfactiveProfile, therapeuticProperties } = row;
    
    let newOp = null;
    let newTp = null;
    let needsUpdate = false;
    
    // olfactiveProfile
    if (olfactiveProfile === null || olfactiveProfile === undefined) {
      opNull++;
      newOp = null;
    } else if (Array.isArray(olfactiveProfile)) {
      opSkipped++;
      newOp = olfactiveProfile; // déjà bon format
    } else {
      const parsed = parseField(olfactiveProfile);
      if (parsed !== null) {
        opUpdated++;
        newOp = parsed;
        needsUpdate = true;
      } else {
        opNull++;
        newOp = null;
      }
    }
    
    // therapeuticProperties
    if (therapeuticProperties === null || therapeuticProperties === undefined) {
      tpNull++;
      newTp = null;
    } else if (Array.isArray(therapeuticProperties)) {
      tpSkipped++;
      newTp = therapeuticProperties; // déjà bon format
    } else {
      const parsed = parseField(therapeuticProperties);
      if (parsed !== null) {
        tpUpdated++;
        newTp = parsed;
        needsUpdate = true;
      } else {
        tpNull++;
        newTp = null;
      }
    }
    
    if (needsUpdate) {
      updates.push({ id, name, newOp, newTp });
    }
  }
  
  console.log();
  console.log('=== olfactiveProfile ===');
  console.log(`  Déjà tableau (skipped): ${opSkipped}`);
  console.log(`  À convertir:            ${opUpdated}`);
  console.log(`  Null/vide:              ${opNull}`);
  
  console.log();
  console.log('=== therapeuticProperties ===');
  console.log(`  Déjà tableau (skipped): ${tpSkipped}`);
  console.log(`  À convertir:            ${tpUpdated}`);
  console.log(`  Null/vide:              ${tpNull}`);
  
  console.log();
  console.log(`Total mises à jour nécessaires: ${updates.length}`);
  
  // Afficher quelques exemples
  console.log('\nExemples de conversions:');
  for (const u of updates.slice(0, 5)) {
    if (u.newOp && !Array.isArray(rows.find(r => r.id === u.id)?.olfactiveProfile)) {
      const orig = rows.find(r => r.id === u.id)?.olfactiveProfile;
      console.log(`  [${u.name}] olfactiveProfile: "${String(orig).slice(0, 60)}" → ${JSON.stringify(u.newOp).slice(0, 80)}`);
    }
  }
  
  if (!DRY_RUN && updates.length > 0) {
    console.log('\nApplication des mises à jour...');
    let done = 0;
    
    for (const u of updates) {
      const opJson = u.newOp !== null ? JSON.stringify(u.newOp) : null;
      const tpJson = u.newTp !== null ? JSON.stringify(u.newTp) : null;
      
      await db.execute(
        'UPDATE molecules SET olfactiveProfile = ?, therapeuticProperties = ? WHERE id = ?',
        [opJson, tpJson, u.id]
      );
      
      done++;
      if (done % 100 === 0) {
        console.log(`  ${done}/${updates.length} mises à jour...`);
      }
    }
    
    console.log(`\n✅ ${done} molécules mises à jour avec succès.`);
  } else if (DRY_RUN) {
    console.log('\n[DRY RUN] Aucune modification appliquée. Relancer sans --dry-run pour appliquer.');
  }
  
  await db.end();
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
