/**
 * Script v2 de fusion des doublons de molécules dans PERFUMUM
 * Gère toutes les tables avec FK vers molecules
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer toutes les tables avec FK vers molecules
const [fkTables] = await conn.execute(
  `SELECT TABLE_NAME, COLUMN_NAME 
   FROM information_schema.KEY_COLUMN_USAGE 
   WHERE REFERENCED_TABLE_NAME = 'molecules' 
   AND TABLE_SCHEMA = DATABASE()
   ORDER BY TABLE_NAME, COLUMN_NAME`
);

console.log('Tables with FK to molecules:', fkTables.map(t => `${t.TABLE_NAME}.${t.COLUMN_NAME}`).join(', '));

// Trouver tous les doublons par CAS (re-chercher après les suppressions précédentes)
const [duplicates] = await conn.execute(
  `SELECT cas_number, COUNT(*) as cnt, 
   GROUP_CONCAT(id ORDER BY id SEPARATOR ',') as ids, 
   GROUP_CONCAT(name ORDER BY id SEPARATOR '|||') as names
   FROM molecules 
   WHERE cas_number IS NOT NULL AND cas_number != '' 
   GROUP BY cas_number 
   HAVING cnt > 1 
   ORDER BY cnt DESC`
);

console.log(`\nFound ${duplicates.length} duplicate groups remaining`);

let mergedCount = 0;
let deletedCount = 0;

for (const dup of duplicates) {
  const ids = dup.ids.split(',').map(Number);
  const names = dup.names.split('|||');
  
  console.log(`\n--- CAS ${dup.cas_number} (${dup.cnt} entries) ---`);
  ids.forEach((id, i) => console.log(`  ${id}: ${names[i]}`));
  
  // Récupérer les données complètes de chaque entrée
  const [rows] = await conn.execute(
    `SELECT id, name, cas_number, coconut_id, pubchem_cid, chebi_id, iupac_name, 
     smiles, inchi, inchi_key, chemicalFormula, molecularWeight, 
     np_likeness_score, family, notes
     FROM molecules WHERE id IN (${ids.join(',')}) ORDER BY id`
  );
  
  // Choisir la "meilleure" entrée : celle avec le plus de données
  let best = rows[0];
  let bestScore = 0;
  
  for (const row of rows) {
    let score = 0;
    if (row.coconut_id) score += 10;
    if (row.pubchem_cid) score += 5;
    if (row.chebi_id) score += 3;
    if (row.iupac_name) score += 2;
    if (row.smiles) score += 2;
    if (row.inchi) score += 2;
    if (row.chemicalFormula) score += 1;
    if (row.notes) score += 1;
    
    if (score > bestScore) {
      bestScore = score;
      best = row;
    }
  }
  
  const duplicateIds = ids.filter(id => id !== best.id);
  console.log(`  → Keeping: ${best.id} (${best.name}) [score: ${bestScore}]`);
  console.log(`  → Removing: ${duplicateIds.join(', ')}`);
  
  for (const dupId of duplicateIds) {
    // Fusionner les liens de chaque table FK
    for (const { TABLE_NAME: table, COLUMN_NAME: column } of fkTables) {
      try {
        // Récupérer les liens du doublon
        const [links] = await conn.execute(
          `SELECT * FROM \`${table}\` WHERE \`${column}\` = ?`,
          [dupId]
        );
        
        if (links.length === 0) continue;
        
        // Pour les tables avec des colonnes supplémentaires, vérifier les doublons
        for (const link of links) {
          const otherColumns = Object.keys(link).filter(k => k !== column && k !== 'id');
          
          if (otherColumns.length === 0) {
            // Pas d'autres colonnes, juste mettre à jour
            await conn.execute(
              `UPDATE \`${table}\` SET \`${column}\` = ? WHERE \`${column}\` = ? AND id = ?`,
              [best.id, dupId, link.id]
            );
            continue;
          }
          
          // Construire la condition WHERE pour vérifier les doublons
          const whereClause = otherColumns.map(c => `\`${c}\` = ?`).join(' AND ');
          const whereValues = otherColumns.map(c => link[c]);
          
          try {
            const [existing] = await conn.execute(
              `SELECT id FROM \`${table}\` WHERE \`${column}\` = ? AND ${whereClause}`,
              [best.id, ...whereValues]
            );
            
            if (existing.length === 0) {
              // Mettre à jour le lien pour pointer vers l'entrée principale
              await conn.execute(
                `UPDATE \`${table}\` SET \`${column}\` = ? WHERE \`${column}\` = ? AND id = ?`,
                [best.id, dupId, link.id]
              );
            } else {
              // Supprimer le lien doublon
              await conn.execute(
                `DELETE FROM \`${table}\` WHERE id = ?`,
                [link.id]
              );
            }
          } catch (e) {
            // En cas d'erreur de contrainte unique, supprimer le doublon
            if (e.code === 'ER_DUP_ENTRY') {
              await conn.execute(
                `DELETE FROM \`${table}\` WHERE id = ?`,
                [link.id]
              );
            } else {
              console.error(`  Error in ${table}.${column}:`, e.message);
            }
          }
        }
      } catch (e) {
        if (!e.message.includes("doesn't exist")) {
          console.error(`  Error in ${table}:`, e.message);
        }
      }
    }
    
    // Fusionner les données manquantes dans l'entrée principale
    const dupRow = rows.find(r => r.id === dupId);
    if (dupRow) {
      const updates = {};
      if (!best.coconut_id && dupRow.coconut_id) updates.coconut_id = dupRow.coconut_id;
      if (!best.pubchem_cid && dupRow.pubchem_cid) updates.pubchem_cid = dupRow.pubchem_cid;
      if (!best.chebi_id && dupRow.chebi_id) updates.chebi_id = dupRow.chebi_id;
      if (!best.iupac_name && dupRow.iupac_name) updates.iupac_name = dupRow.iupac_name;
      if (!best.smiles && dupRow.smiles) updates.smiles = dupRow.smiles;
      if (!best.inchi && dupRow.inchi) updates.inchi = dupRow.inchi;
      if (!best.inchi_key && dupRow.inchi_key) updates.inchi_key = dupRow.inchi_key;
      if (!best.chemicalFormula && dupRow.chemicalFormula) updates.chemicalFormula = dupRow.chemicalFormula;
      if (!best.molecularWeight && dupRow.molecularWeight) updates.molecularWeight = dupRow.molecularWeight;
      if (!best.notes && dupRow.notes) updates.notes = dupRow.notes;
      
      if (Object.keys(updates).length > 0) {
        const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
        const values = Object.values(updates);
        await conn.execute(
          `UPDATE molecules SET ${setClauses} WHERE id = ?`,
          [...values, best.id]
        );
        console.log(`  Updated best entry with: ${Object.keys(updates).join(', ')}`);
        Object.assign(best, updates);
      }
    }
    
    // Supprimer le doublon
    try {
      await conn.execute('DELETE FROM molecules WHERE id = ?', [dupId]);
      deletedCount++;
      console.log(`  ✓ Deleted molecule ${dupId}`);
    } catch (e) {
      console.error(`  ✗ Error deleting ${dupId}:`, e.message);
    }
  }
  
  mergedCount++;
}

console.log(`\n=== Summary ===`);
console.log(`Merged groups: ${mergedCount}`);
console.log(`Deleted molecules: ${deletedCount}`);

// Vérification finale
const [finalCount] = await conn.execute('SELECT COUNT(*) as cnt FROM molecules');
console.log(`Total molecules remaining: ${finalCount[0].cnt}`);

// Vérifier s'il reste des doublons
const [remainingDups] = await conn.execute(
  `SELECT cas_number, COUNT(*) as cnt FROM molecules 
   WHERE cas_number IS NOT NULL AND cas_number != '' 
   GROUP BY cas_number HAVING cnt > 1`
);
console.log(`Remaining duplicate groups: ${remainingDups.length}`);

await conn.end();
