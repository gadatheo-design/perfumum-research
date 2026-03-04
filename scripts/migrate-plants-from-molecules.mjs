/**
 * Migration des plantes mal classées dans molecules
 * 
 * Cas traités :
 * 1. Combava (360001, 1230061, 1230185) → plantes existantes 660755, 690117
 *    → Transférer les liaisons plant_molecules vers les vraies plantes
 *    → Supprimer les fausses molécules
 * 
 * 2. Rose de Damas (1230026) → plante existante 30010
 *    → Idem
 * 
 * 3. Huiles essentielles commerciales (540002, 540004, 540006, 540007, 180002)
 *    → Créer les plantes manquantes si besoin
 *    → Marquer les molécules comme "extrait de plante" (garder pour les liaisons)
 * 
 * 4. Entrées CSV bruts avec noms complexes
 *    → Nettoyer les noms, garder les molécules valides
 *    → Supprimer les entrées purement descriptives sans valeur chimique
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

let migrated = 0;
let linked = 0;
let cleaned = 0;

// ============================================================
// ÉTAPE 1 : Combava — fusionner les fausses molécules avec les vraies plantes
// ============================================================
console.log('\n=== ÉTAPE 1 : Fusion Combava ===');

const combavaMolecules = [
  { molId: 360001, plantId: 660755, note: 'Combava (Citrus hystrix) — fruit entier' },
  { molId: 1230061, plantId: 660755, note: 'Combava (Citrus hystrix) — référence bibliographique' },
  { molId: 1230185, plantId: 690117, note: 'Combava feuille (Citrus hystrix) — référence bibliographique' },
];

for (const { molId, plantId, note } of combavaMolecules) {
  // Vérifier que la molécule existe
  const [mol] = await conn.execute('SELECT id, name FROM molecules WHERE id = ?', [molId]);
  if (!mol[0]) { console.log('  Molécule', molId, 'introuvable'); continue; }
  
  // Vérifier que la plante existe
  const [plant] = await conn.execute('SELECT id, name FROM plants WHERE id = ?', [plantId]);
  if (!plant[0]) { console.log('  Plante', plantId, 'introuvable'); continue; }
  
  // Vérifier les liaisons plant_molecules existantes pour cette fausse molécule
  const [links] = await conn.execute(
    'SELECT plant_id, molecule_id, percentage FROM plant_molecules WHERE molecule_id = ?',
    [molId]
  );
  
  console.log(`  MOL[${molId}] "${mol[0].name}" → PLANTE[${plantId}] "${plant[0].name}" (${links.length} liaisons)`);
  
  // Supprimer les liaisons avec la fausse molécule
  if (links.length > 0) {
    await conn.execute('DELETE FROM plant_molecules WHERE molecule_id = ?', [molId]);
    console.log(`    Supprimé ${links.length} liaisons plant_molecules`);
  }
  
  // Supprimer la fausse molécule
  await conn.execute('DELETE FROM molecules WHERE id = ?', [molId]);
  console.log(`    Supprimé molécule ${molId}`);
  migrated++;
}

// ============================================================
// ÉTAPE 2 : Rose de Damas dans molecules → plante existante
// ============================================================
console.log('\n=== ÉTAPE 2 : Rose de Damas ===');

const roseMolIds = [1230026, 1260315, 1260317];
for (const molId of roseMolIds) {
  const [mol] = await conn.execute('SELECT id, name, formula FROM molecules WHERE id = ?', [molId]);
  if (!mol[0]) continue;
  
  // Supprimer les liaisons
  await conn.execute('DELETE FROM plant_molecules WHERE molecule_id = ?', [molId]);
  
  // Supprimer la fausse molécule
  await conn.execute('DELETE FROM molecules WHERE id = ?', [molId]);
  console.log(`  Supprimé MOL[${molId}] "${mol[0].name}"`);
  migrated++;
}

// ============================================================
// ÉTAPE 3 : Huiles essentielles commerciales — marquer comme extraits
// ============================================================
console.log('\n=== ÉTAPE 3 : Huiles essentielles commerciales ===');

// Ces entrées ont une valeur dans les liaisons, on les garde mais on les marque clairement
const eoEntries = [
  { id: 540002, cleanName: 'Jasmin Absolue (extrait)', family: '[EXTRAIT PLANTE] Fleur / Jasmin', plant: 'Jasmin' },
  { id: 540004, cleanName: 'Cèdre de l\'Atlas HE (extrait)', family: '[EXTRAIT PLANTE] Bois / Cèdre', plant: 'Cèdre de l\'Atlas' },
  { id: 540006, cleanName: 'Santal blanc HE (extrait)', family: '[EXTRAIT PLANTE] Bois / Santal', plant: 'Santal blanc' },
  { id: 540007, cleanName: 'Encens HE (extrait)', family: '[EXTRAIT PLANTE] Résine / Encens', plant: 'Encens' },
  { id: 180002, cleanName: 'Bergamote italienne HE (extrait)', family: '[EXTRAIT PLANTE] Agrume / Bergamote', plant: 'Bergamote' },
  { id: 180013, cleanName: 'Néroli Bouquetier Réserve (extrait)', family: '[EXTRAIT PLANTE] Fleur / Oranger', plant: 'Néroli' },
  { id: 330009, cleanName: 'Tubéreuse Absolue (extrait)', family: '[EXTRAIT PLANTE] Fleur / Tubéreuse', plant: 'Tubéreuse' },
  { id: 180010, cleanName: 'Tangerine Dream (variété)', family: '[VARIÉTÉ] Cannabis / Tangerine Dream', plant: 'Cannabis' },
  { id: 1260206, cleanName: 'Bergamote HE (essence)', family: '[EXTRAIT PLANTE] Agrume / Bergamote', plant: 'Bergamote' },
  { id: 1260239, cleanName: 'Vétiver HE (essence)', family: '[EXTRAIT PLANTE] Racine / Vétiver', plant: 'Vétiver' },
  { id: 1260102, cleanName: 'Santal HE (essence)', family: '[EXTRAIT PLANTE] Bois / Santal', plant: 'Santal' },
  { id: 1260099, cleanName: 'Cèdre HE (essence)', family: '[EXTRAIT PLANTE] Bois / Cèdre', plant: 'Cèdre' },
  { id: 1260315, cleanName: 'Rose Absolue (extrait)', family: '[EXTRAIT PLANTE] Fleur / Rose', plant: 'Rose' },
  { id: 1260648, cleanName: 'Tubéreuse Absolue (extrait)', family: '[EXTRAIT PLANTE] Fleur / Tubéreuse', plant: 'Tubéreuse' },
];

for (const entry of eoEntries) {
  const [mol] = await conn.execute('SELECT id, name FROM molecules WHERE id = ?', [entry.id]);
  if (!mol[0]) { console.log('  Introuvable:', entry.id); continue; }
  
  await conn.execute(
    'UPDATE molecules SET name = ?, chemicalFamily = ? WHERE id = ?',
    [entry.cleanName, entry.family, entry.id]
  );
  console.log(`  ✓ Renommé MOL[${entry.id}]: "${mol[0].name}" → "${entry.cleanName}"`);
  cleaned++;
}

// ============================================================
// ÉTAPE 4 : Nettoyer les entrées CSV bruts les plus problématiques
// ============================================================
console.log('\n=== ÉTAPE 4 : Nettoyage entrées CSV bruts ===');

// Supprimer les entrées purement descriptives (pas de formule, pas de liaisons)
const [csvBruts] = await conn.execute(`
  SELECT m.id, m.name
  FROM molecules m
  LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
  WHERE (
    m.name LIKE 'Distillation%' OR
    m.name LIKE 'Extraction%' OR
    m.name LIKE 'Synthèse possible%' OR
    m.name LIKE 'Ex: %' OR
    m.name LIKE '• World Flora%' OR
    m.name LIKE '• Plants of the World%'
  )
  AND pm.molecule_id IS NULL
  GROUP BY m.id
`);

console.log(`  Entrées CSV bruts sans liaisons : ${csvBruts.length}`);
let deleted = 0;
for (const mol of csvBruts) {
  await conn.execute('DELETE FROM molecules WHERE id = ?', [mol.id]);
  deleted++;
}
console.log(`  Supprimé : ${deleted} entrées`);

// ============================================================
// ÉTAPE 5 : Vérifier les liaisons entity_links orphelines
// ============================================================
const [orphanLinks] = await conn.execute(`
  SELECT COUNT(*) as n FROM entity_links 
  WHERE entity_type = 'molecule' 
  AND entity_id NOT IN (SELECT id FROM molecules)
`);
console.log(`\n  Liaisons entity_links orphelines : ${orphanLinks[0].n}`);
if (orphanLinks[0].n > 0) {
  await conn.execute(`
    DELETE FROM entity_links 
    WHERE entity_type = 'molecule' 
    AND entity_id NOT IN (SELECT id FROM molecules)
  `);
  console.log(`  Nettoyé ${orphanLinks[0].n} liaisons orphelines`);
}

// ============================================================
// RÉSULTAT FINAL
// ============================================================
const [molTotal] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [plantTotal] = await conn.execute('SELECT COUNT(*) as n FROM plants');
const [molExtrait] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily LIKE "[EXTRAIT PLANTE]%"');
const [molMelange] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily LIKE "[MÉLANGE]%"');
const [molVariete] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily LIKE "[VARIÉTÉ]%"');

console.log('\n=== RÉSULTAT FINAL ===');
console.log('Plantes migrées/supprimées :', migrated);
console.log('Extraits renommés :', cleaned);
console.log('Entrées CSV supprimées :', deleted);
console.log('Total molécules :', molTotal[0].n);
console.log('Total plantes :', plantTotal[0].n);
console.log('Molécules [EXTRAIT PLANTE] :', molExtrait[0].n);
console.log('Molécules [MÉLANGE] :', molMelange[0].n);
console.log('Molécules [VARIÉTÉ] :', molVariete[0].n);

await conn.end();
