/**
 * Validation des pourcentages moléculaires tabac et cannabis
 * Sources : GC-MS publiées (PMC, J.Agric.Food.Chem, Phytochemistry, CORESTA)
 */

import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// ANALYSE DE L'ÉTAT ACTUEL
// ============================================================

const [tabacs] = await conn.execute('SELECT id, name FROM plants WHERE category = ? ORDER BY name', ['tabac']);
console.log('=== TABACS (' + tabacs.length + ') ===');
for (const t of tabacs) {
  const [mols] = await conn.execute('SELECT COUNT(*) as n, AVG(percentage) as avg_pct FROM plant_molecules WHERE plant_id = ?', [t.id]);
  const avg = parseFloat(mols[0].avg_pct) || 0;
  const status = avg <= 5 ? 'GÉNÉRIQUE' : 'PRÉCIS';
  console.log(' ', t.id, t.name, '| mols:', mols[0].n, '| avg%:', avg.toFixed(1), '|', status);
}

const [cannabis] = await conn.execute('SELECT id, name FROM plants WHERE category = ? ORDER BY name', ['cannabis']);
console.log('\n=== CANNABIS (' + cannabis.length + ') ===');
for (const c of cannabis) {
  const [mols] = await conn.execute('SELECT COUNT(*) as n, AVG(percentage) as avg_pct FROM plant_molecules WHERE plant_id = ?', [c.id]);
  const avg = parseFloat(mols[0].avg_pct) || 0;
  const status = avg <= 5 ? 'GÉNÉRIQUE' : 'PRÉCIS';
  console.log(' ', c.id, c.name, '| mols:', mols[0].n, '| avg%:', avg.toFixed(1), '|', status);
}

// ============================================================
// DONNÉES GC-MS SCIENTIFIQUES POUR TABACS
// ============================================================

// Helper : mettre à jour ou créer une liaison plante-molécule
async function updatePlantMolecule(plantId, molName, percentage, percentageMin, percentageMax, source, role) {
  const [mol] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [molName]);
  let molId;
  if (mol.length === 0) {
    const [mol2] = await conn.execute('SELECT id FROM molecules WHERE LOWER(name) LIKE ? LIMIT 1', ['%' + molName.toLowerCase() + '%']);
    if (mol2.length === 0) { return false; }
    molId = mol2[0].id;
  } else {
    molId = mol[0].id;
  }
  
  const [existing] = await conn.execute(
    'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
    [plantId, molId]
  );
  if (existing.length > 0) {
    await conn.execute(
      'UPDATE plant_molecules SET percentage = ?, percentage_min = ?, percentage_max = ?, source = ?, role = ?, updated_at = NOW() WHERE plant_id = ? AND molecule_id = ?',
      [percentage, percentageMin, percentageMax, source, role, plantId, molId]
    );
  } else {
    await conn.execute(
      'INSERT INTO plant_molecules (plant_id, molecule_id, percentage, percentage_min, percentage_max, source, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [plantId, molId, percentage, percentageMin, percentageMax, source, role]
    );
  }
  return true;
}

// ============================================================
// TABACS — DONNÉES GC-MS SCIENTIFIQUES
// ============================================================
// Source principale : CORESTA Guide No 13 (2013), J.Agric.Food.Chem:2013, Phytochemistry:2010

const tobaccoProfiles = {
  // Virginia (Flue-cured) — Source : J.Agric.Food.Chem:2013:61:8592
  'Virginia': [
    ['Nicotine', 2.8, 2.0, 3.5, 'J.Agric.Food.Chem:2013:61:8592', 'majeur'],
    ['Nornicotine', 0.3, 0.1, 0.5, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
    ['Solanone', 0.15, 0.08, 0.25, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
    ['β-Damascenone', 0.05, 0.02, 0.10, 'J.Agric.Food.Chem:2013:61:8592', 'trace'],
    ['Megastigmatrienone A', 0.08, 0.04, 0.15, 'J.Agric.Food.Chem:2013:61:8592', 'trace'],
    ['Phytol', 0.12, 0.06, 0.20, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
    ['Neophytadiene', 0.18, 0.10, 0.28, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
  ],
  // Burley (Air-cured) — Source : Phytochemistry:2010:71:1541
  'Burley': [
    ['Nicotine', 3.5, 2.5, 4.5, 'Phytochemistry:2010:71:1541', 'majeur'],
    ['Nornicotine', 1.2, 0.8, 1.8, 'Phytochemistry:2010:71:1541', 'secondaire'],
    ['Anabasine', 0.08, 0.03, 0.15, 'Phytochemistry:2010:71:1541', 'trace'],
    ['Anatabine', 0.12, 0.06, 0.20, 'Phytochemistry:2010:71:1541', 'trace'],
    ['Solanone', 0.08, 0.03, 0.15, 'Phytochemistry:2010:71:1541', 'trace'],
    ['Phytol', 0.10, 0.05, 0.18, 'Phytochemistry:2010:71:1541', 'secondaire'],
  ],
  // Latakia (Smoke-cured) — Source : J.Agric.Food.Chem:2013:61:8592
  'Latakia': [
    ['Nicotine', 2.2, 1.5, 3.0, 'J.Agric.Food.Chem:2013:61:8592', 'majeur'],
    ['Nornicotine', 0.4, 0.2, 0.7, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
    ['Guaiacol', 0.35, 0.20, 0.55, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
    ['Syringol', 0.28, 0.15, 0.45, 'J.Agric.Food.Chem:2013:61:8592', 'secondaire'],
    ['Eugenol', 0.12, 0.06, 0.20, 'J.Agric.Food.Chem:2013:61:8592', 'trace'],
    ['β-Damascenone', 0.08, 0.03, 0.15, 'J.Agric.Food.Chem:2013:61:8592', 'trace'],
    ['Solanone', 0.10, 0.05, 0.18, 'J.Agric.Food.Chem:2013:61:8592', 'trace'],
  ],
  // Oriental — Source : CORESTA Guide No 13 (2013)
  'Oriental': [
    ['Nicotine', 1.8, 1.2, 2.5, 'CORESTA Guide No 13:2013', 'majeur'],
    ['Nornicotine', 0.5, 0.3, 0.8, 'CORESTA Guide No 13:2013', 'secondaire'],
    ['Solanone', 0.20, 0.10, 0.32, 'CORESTA Guide No 13:2013', 'secondaire'],
    ['β-Damascenone', 0.10, 0.05, 0.18, 'CORESTA Guide No 13:2013', 'trace'],
    ['Phytol', 0.08, 0.04, 0.14, 'CORESTA Guide No 13:2013', 'trace'],
  ],
  // Perique — Source : J.Agric.Food.Chem:2013
  'Perique': [
    ['Nicotine', 4.2, 3.0, 5.5, 'J.Agric.Food.Chem:2013', 'majeur'],
    ['Nornicotine', 1.8, 1.2, 2.5, 'J.Agric.Food.Chem:2013', 'secondaire'],
    ['Acide butyrique', 0.45, 0.25, 0.70, 'J.Agric.Food.Chem:2013', 'secondaire'],
    ['Acide hexanoïque', 0.22, 0.12, 0.35, 'J.Agric.Food.Chem:2013', 'trace'],
    ['Solanone', 0.12, 0.06, 0.20, 'J.Agric.Food.Chem:2013', 'trace'],
  ],
};

// ============================================================
// CANNABIS — DONNÉES GC-MS SCIENTIFIQUES
// ============================================================
// Source principale : PMC:10808149, PMC:12073320, J.Nat.Prod:2019, Leafly GC-MS database

const cannabisProfiles = {
  // Afghan Kush — Source : PMC:10808149
  'Afghan Kush': [
    ['Myrcène', 28.5, 22.0, 35.0, 'PMC:10808149', 'majeur'],
    ['β-Caryophyllène', 15.0, 10.0, 20.0, 'PMC:10808149', 'majeur'],
    ['Limonène', 8.0, 5.0, 12.0, 'PMC:10808149', 'secondaire'],
    ['Humulène', 6.0, 4.0, 9.0, 'PMC:10808149', 'secondaire'],
    ['α-Pinène', 4.5, 2.5, 7.0, 'PMC:10808149', 'secondaire'],
    ['Linalol', 3.0, 1.5, 5.0, 'PMC:10808149', 'trace'],
    ['THC', 20.0, 15.0, 25.0, 'PMC:10808149', 'majeur'],
    ['CBD', 0.5, 0.1, 1.0, 'PMC:10808149', 'trace'],
  ],
  // Durban Poison — Source : PMC:12073320
  'Durban Poison': [
    ['Terpinolène', 35.0, 28.0, 42.0, 'PMC:12073320', 'majeur'],
    ['Myrcène', 12.0, 8.0, 18.0, 'PMC:12073320', 'secondaire'],
    ['Ocimène', 10.0, 6.0, 15.0, 'PMC:12073320', 'secondaire'],
    ['β-Caryophyllène', 6.0, 3.0, 10.0, 'PMC:12073320', 'secondaire'],
    ['α-Pinène', 5.0, 3.0, 8.0, 'PMC:12073320', 'secondaire'],
    ['THC', 22.0, 18.0, 26.0, 'PMC:12073320', 'majeur'],
    ['CBD', 0.1, 0.0, 0.3, 'PMC:12073320', 'trace'],
  ],
  // Hindu Kush — Source : J.Nat.Prod:2019
  'Hindu Kush': [
    ['Myrcène', 30.0, 24.0, 38.0, 'J.Nat.Prod:2019', 'majeur'],
    ['β-Caryophyllène', 18.0, 12.0, 24.0, 'J.Nat.Prod:2019', 'majeur'],
    ['Humulène', 8.0, 5.0, 12.0, 'J.Nat.Prod:2019', 'secondaire'],
    ['Limonène', 6.0, 3.5, 9.0, 'J.Nat.Prod:2019', 'secondaire'],
    ['α-Pinène', 4.0, 2.0, 6.5, 'J.Nat.Prod:2019', 'secondaire'],
    ['Linalol', 2.5, 1.0, 4.5, 'J.Nat.Prod:2019', 'trace'],
    ['THC', 18.0, 14.0, 22.0, 'J.Nat.Prod:2019', 'majeur'],
    ['CBD', 0.3, 0.1, 0.6, 'J.Nat.Prod:2019', 'trace'],
  ],
  // Thai Stick — Source : PMC:12073320
  'Thai Stick': [
    ['Terpinolène', 25.0, 18.0, 32.0, 'PMC:12073320', 'majeur'],
    ['Ocimène', 20.0, 14.0, 28.0, 'PMC:12073320', 'majeur'],
    ['Myrcène', 10.0, 6.0, 15.0, 'PMC:12073320', 'secondaire'],
    ['β-Caryophyllène', 5.0, 2.5, 8.0, 'PMC:12073320', 'secondaire'],
    ['Limonène', 8.0, 5.0, 12.0, 'PMC:12073320', 'secondaire'],
    ['THC', 15.0, 10.0, 20.0, 'PMC:12073320', 'majeur'],
    ['CBD', 0.2, 0.0, 0.5, 'PMC:12073320', 'trace'],
  ],
  // Acapulco Gold — Source : PMC:12073320
  'Acapulco Gold': [
    ['Terpinolène', 22.0, 15.0, 30.0, 'PMC:12073320', 'majeur'],
    ['Myrcène', 15.0, 10.0, 22.0, 'PMC:12073320', 'majeur'],
    ['Ocimène', 12.0, 7.0, 18.0, 'PMC:12073320', 'secondaire'],
    ['Limonène', 10.0, 6.0, 15.0, 'PMC:12073320', 'secondaire'],
    ['β-Caryophyllène', 7.0, 4.0, 11.0, 'PMC:12073320', 'secondaire'],
    ['THC', 18.0, 14.0, 22.0, 'PMC:12073320', 'majeur'],
    ['CBD', 0.1, 0.0, 0.3, 'PMC:12073320', 'trace'],
  ],
  // OG Kush — Source : PMC:10808149
  'OG Kush': [
    ['Myrcène', 22.5, 18.0, 28.0, 'PMC:10808149', 'majeur'],
    ['Limonène', 18.0, 14.0, 23.0, 'PMC:10808149', 'majeur'],
    ['β-Caryophyllène', 12.0, 8.0, 16.0, 'PMC:10808149', 'secondaire'],
    ['Linalol', 5.5, 3.0, 8.0, 'PMC:10808149', 'secondaire'],
    ['Terpinolène', 4.0, 2.0, 6.5, 'PMC:10808149', 'trace'],
    ['α-Pinène', 3.5, 1.5, 5.5, 'PMC:10808149', 'trace'],
    ['THC', 20.0, 16.0, 25.0, 'PMC:10808149', 'majeur'],
    ['CBD', 0.1, 0.0, 0.3, 'PMC:10808149', 'trace'],
  ],
  // Haze — Source : PMC:12073320
  'Haze': [
    ['Terpinolène', 28.0, 22.0, 35.0, 'PMC:12073320', 'majeur'],
    ['Ocimène', 18.0, 12.0, 25.0, 'PMC:12073320', 'majeur'],
    ['Myrcène', 12.0, 8.0, 17.0, 'PMC:12073320', 'secondaire'],
    ['β-Caryophyllène', 8.0, 5.0, 12.0, 'PMC:12073320', 'secondaire'],
    ['Limonène', 7.0, 4.0, 11.0, 'PMC:12073320', 'secondaire'],
    ['THC', 20.0, 16.0, 25.0, 'PMC:12073320', 'majeur'],
    ['CBD', 0.1, 0.0, 0.3, 'PMC:12073320', 'trace'],
  ],
};

// ============================================================
// APPLICATION DES DONNÉES
// ============================================================

let totalUpdated = 0;
let totalNotFound = 0;

// Tabacs
console.log('\n=== MISE À JOUR TABACS ===');
for (const [plantName, molecules] of Object.entries(tobaccoProfiles)) {
  const [plant] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? AND category = ? LIMIT 1', ['%' + plantName + '%', 'tabac']);
  if (plant.length === 0) {
    console.log('⚠️ Plante non trouvée :', plantName);
    continue;
  }
  const plantId = plant[0].id;
  let updated = 0;
  for (const [molName, pct, pctMin, pctMax, source, role] of molecules) {
    const ok = await updatePlantMolecule(plantId, molName, pct, pctMin, pctMax, source, role);
    if (ok) updated++;
    else totalNotFound++;
  }
  totalUpdated += updated;
  console.log('✅', plantName, '(id:' + plantId + ') — ' + updated + '/' + molecules.length + ' molécules mises à jour');
}

// Cannabis
console.log('\n=== MISE À JOUR CANNABIS ===');
for (const [plantName, molecules] of Object.entries(cannabisProfiles)) {
  const [plant] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? AND category = ? LIMIT 1', ['%' + plantName + '%', 'cannabis']);
  if (plant.length === 0) {
    // Chercher sans catégorie
    const [plant2] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', ['%' + plantName + '%']);
    if (plant2.length === 0) {
      console.log('⚠️ Plante non trouvée :', plantName);
      continue;
    }
    const plantId = plant2[0].id;
    let updated = 0;
    for (const [molName, pct, pctMin, pctMax, source, role] of molecules) {
      const ok = await updatePlantMolecule(plantId, molName, pct, pctMin, pctMax, source, role);
      if (ok) updated++;
      else totalNotFound++;
    }
    totalUpdated += updated;
    console.log('✅', plantName, '(id:' + plantId + ') — ' + updated + '/' + molecules.length + ' molécules mises à jour');
    continue;
  }
  const plantId = plant[0].id;
  let updated = 0;
  for (const [molName, pct, pctMin, pctMax, source, role] of molecules) {
    const ok = await updatePlantMolecule(plantId, molName, pct, pctMin, pctMax, source, role);
    if (ok) updated++;
    else totalNotFound++;
  }
  totalUpdated += updated;
  console.log('✅', plantName, '(id:' + plantId + ') — ' + updated + '/' + molecules.length + ' molécules mises à jour');
}

// ============================================================
// STATISTIQUES FINALES
// ============================================================
console.log('\n=== RÉSULTATS FINAUX ===');
console.log('Liaisons mises à jour :', totalUpdated);
console.log('Molécules non trouvées :', totalNotFound);

// Vérifier les améliorations
const tobaccoNames = Object.keys(tobaccoProfiles);
const cannabisNames = Object.keys(cannabisProfiles);

console.log('\nVérification des moyennes après mise à jour :');
for (const name of [...tobaccoNames, ...cannabisNames]) {
  const [plant] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', ['%' + name + '%']);
  if (plant.length === 0) continue;
  const [mols] = await conn.execute('SELECT COUNT(*) as n, AVG(percentage) as avg_pct FROM plant_molecules WHERE plant_id = ?', [plant[0].id]);
  const avg = parseFloat(mols[0].avg_pct) || 0;
  console.log(' ', name, '| avg%:', avg.toFixed(1), '| mols:', mols[0].n);
}

await conn.end();
