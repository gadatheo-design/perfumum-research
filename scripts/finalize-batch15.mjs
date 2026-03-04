/**
 * Finalisation Batch 15 :
 * 1. Créer les liaisons plantes manquantes (Benzyl Acetate, Geranyl Acetate)
 * 2. Fusionner les doublons Linalyl Acetate (3 entrées → 1)
 * 3. Résumé final
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── 1. Liaisons plantes pour Benzyl Acetate (id:210011) ─────────────────────
const benzylLinks = [
  { plantLike: '%Jasmin%', role: 'majeur', pct: 20 },
  { plantLike: '%Ylang%', role: 'majeur', pct: 10 },
];
for (const lnk of benzylLinks) {
  const [plants] = await conn.execute('SELECT id, name FROM plants WHERE name LIKE ? LIMIT 1', [lnk.plantLike]);
  if (plants.length > 0) {
    await conn.execute(
      'INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage) VALUES (?,?,?,?)',
      [plants[0].id, 210011, lnk.role, lnk.pct]
    );
    console.log(`✓ Benzyl Acetate → ${plants[0].name}`);
  }
}

// ─── 2. Liaisons plantes pour Geranyl Acetate (id:570019) ────────────────────
const geranylLinks = [
  { plantLike: '%Géranium%', role: 'secondaire', pct: 7 },
  { plantLike: '%Palmarosa%', role: 'secondaire', pct: 5 },
];
for (const lnk of geranylLinks) {
  const [plants] = await conn.execute('SELECT id, name FROM plants WHERE name LIKE ? LIMIT 1', [lnk.plantLike]);
  if (plants.length > 0) {
    await conn.execute(
      'INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage) VALUES (?,?,?,?)',
      [plants[0].id, 570019, lnk.role, lnk.pct]
    );
    console.log(`✓ Geranyl Acetate → ${plants[0].name}`);
  }
}

// ─── 3. Liaison plantes pour Phenylethyl alcohol (id:990016) ─────────────────
const phLinks = [
  { plantLike: '%Rosa%', role: 'majeur', pct: 65 },
  { plantLike: '%Géranium%', role: 'secondaire', pct: 5 },
];
for (const lnk of phLinks) {
  const [plants] = await conn.execute('SELECT id, name FROM plants WHERE name LIKE ? LIMIT 1', [lnk.plantLike]);
  if (plants.length > 0) {
    await conn.execute(
      'INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage) VALUES (?,?,?,?)',
      [plants[0].id, 990016, lnk.role, lnk.pct]
    );
    console.log(`✓ Phenylethyl Alcohol → ${plants[0].name}`);
  }
}

// ─── 4. Fusion doublons Linalyl Acetate ──────────────────────────────────────
// Garder id:330014 (Bergamote Calabre), fusionner 570018 et 990001
const toMerge = [570018, 990001]; // → 330014
for (const fromId of toMerge) {
  // Transférer liaisons plant_molecules
  await conn.execute(
    `UPDATE IGNORE plant_molecules SET molecule_id = 330014 WHERE molecule_id = ?`,
    [fromId]
  );
  // Transférer liaisons recette_molecules
  await conn.execute(
    `UPDATE IGNORE recette_molecules SET molecule_id = 330014 WHERE molecule_id = ?`,
    [fromId]
  );
  // Transférer liaisons molecules_recettes
  await conn.execute(
    `UPDATE IGNORE molecules_recettes SET molecule_id = 330014 WHERE molecule_id = ?`,
    [fromId]
  );
  // Transférer liaisons molecule_synergies (vérifier colonnes)
  try {
    const [cols] = await conn.execute('DESCRIBE molecule_synergies');
    const colNames = cols.map(c => c.Field);
    const col1 = colNames.find(c => c.includes('molecule') && (c.includes('1') || c.includes('a'))) || 'molecule_id_1';
    const col2 = colNames.find(c => c.includes('molecule') && (c.includes('2') || c.includes('b'))) || 'molecule_id_2';
    await conn.execute(`UPDATE IGNORE molecule_synergies SET ${col1} = 330014 WHERE ${col1} = ?`, [fromId]);
    await conn.execute(`UPDATE IGNORE molecule_synergies SET ${col2} = 330014 WHERE ${col2} = ?`, [fromId]);
  } catch(e) {
    console.log(`  (synergies skip: ${e.message})`);
  }
  // Supprimer les liaisons résiduelles avant DELETE
  await conn.execute('DELETE FROM plant_molecules WHERE molecule_id = ?', [fromId]);
  await conn.execute('DELETE FROM recette_molecules WHERE molecule_id = ?', [fromId]);
  await conn.execute('DELETE FROM molecules_recettes WHERE molecule_id = ?', [fromId]);
  try { await conn.execute('DELETE FROM molecule_plant_sources WHERE molecule_id = ?', [fromId]); } catch(e) {}
  try { await conn.execute('DELETE FROM molecule_synergies WHERE molecule_a_id = ? OR molecule_b_id = ?', [fromId, fromId]); } catch(e) {}
  try { await conn.execute('DELETE FROM bibliography_molecule_links WHERE molecule_id = ?', [fromId]); } catch(e) {}
  try { await conn.execute('DELETE FROM pyrolysis_transformations WHERE source_molecule_id = ? OR product_molecule_id = ?', [fromId, fromId]); } catch(e) {}
  // Supprimer le doublon
  await conn.execute('DELETE FROM molecules WHERE id = ?', [fromId]);
  console.log(`✓ Fusionné id:${fromId} → id:330014 (Linalyl Acetate)`);
}

// ─── 5. Résumé final ─────────────────────────────────────────────────────────
const [totalMols] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [totalLinks] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules');
const [totalRecLinks] = await conn.execute('SELECT COUNT(*) as n FROM recette_molecules');
const [linkedRec] = await conn.execute('SELECT COUNT(DISTINCT recette_id) as n FROM recette_molecules');
const [totalRec] = await conn.execute('SELECT COUNT(*) as n FROM recettes');

console.log('\n=== ÉTAT FINAL BATCH 15 ===');
console.log(`Total molécules : ${totalMols[0].n}`);
console.log(`Liaisons plant_molecules : ${totalLinks[0].n}`);
console.log(`Liaisons recette_molecules : ${totalRecLinks[0].n}`);
console.log(`Couverture recettes : ${linkedRec[0].n}/${totalRec[0].n} (${Math.round(linkedRec[0].n/totalRec[0].n*100)}%)`);

await conn.end();
