/**
 * Script de fusion des doublons de molécules dans PERFUMUM
 * Stratégie : garder l'entrée la plus enrichie, fusionner les liens, supprimer les doublons
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Trouver tous les doublons par CAS
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

console.log(`Found ${duplicates.length} duplicate groups`);

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
  
  // Tables de liaison à mettre à jour
  const linkTables = [
    { table: 'molecule_recettes', column: 'molecule_id' },
    { table: 'molecule_plants', column: 'molecule_id' },
    { table: 'molecule_chemical_families', column: 'molecule_id' },
    { table: 'molecule_accords', column: 'molecule_id' },
    { table: 'molecule_terroirs', column: 'molecule_id' },
    { table: 'molecule_civilisations', column: 'molecule_id' },
    { table: 'molecule_research_axes', column: 'molecule_id' },
    { table: 'molecule_extraction_methods', column: 'molecule_id' },
    { table: 'molecule_installations', column: 'molecule_id' },
    { table: 'molecule_bibliography', column: 'molecule_id' },
    { table: 'molecule_materials', column: 'molecule_id' },
    { table: 'ghost_variety_molecules', column: 'molecule_id' },
    { table: 'prototype_molecules', column: 'molecule_id' },
  ];
  
  for (const dupId of duplicateIds) {
    // Fusionner les liens de chaque table
    for (const { table, column } of linkTables) {
      try {
        // Vérifier si la table existe
        const [tableCheck] = await conn.execute(
          `SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`,
          [table]
        );
        if (tableCheck[0].cnt === 0) continue;
        
        // Récupérer les liens du doublon
        const [links] = await conn.execute(
          `SELECT * FROM \`${table}\` WHERE \`${column}\` = ?`,
          [dupId]
        );
        
        for (const link of links) {
          // Vérifier si ce lien existe déjà pour l'entrée principale
          const otherColumns = Object.keys(link).filter(k => k !== column && k !== 'id');
          
          if (otherColumns.length === 0) continue;
          
          // Construire la condition WHERE pour vérifier les doublons
          const whereClause = otherColumns.map(c => `\`${c}\` = ?`).join(' AND ');
          const whereValues = otherColumns.map(c => link[c]);
          
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
        }
      } catch (e) {
        // Ignorer les erreurs de table inexistante
        if (!e.message.includes("doesn't exist") && !e.message.includes("Table")) {
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
        // Mettre à jour l'objet best pour les prochaines itérations
        Object.assign(best, updates);
      }
    }
    
    // Supprimer le doublon
    try {
      await conn.execute('DELETE FROM molecules WHERE id = ?', [dupId]);
      deletedCount++;
      console.log(`  Deleted molecule ${dupId}`);
    } catch (e) {
      console.error(`  Error deleting ${dupId}:`, e.message);
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

await conn.end();
