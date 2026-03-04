/**
 * Analyse des compositions actuelles des plantes prioritaires
 * Focus : Tabacs, Cannabis, Roses
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ANALYSE DES PLANTES PRIORITAIRES ===\n');

// 1. TABACS
console.log('🚬 TABACS\n');
const [tabacs] = await conn.execute(`
  SELECT 
    p.id, p.name, p.latin_name, p.family,
    COUNT(DISTINCT pm.molecule_id) as mol_count,
    GROUP_CONCAT(CONCAT(m.name, ' (', pm.percentage, '%)') ORDER BY pm.percentage DESC SEPARATOR ', ') as molecules
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
  LEFT JOIN molecules m ON pm.molecule_id = m.id
  WHERE p.category = 'tabac'
  GROUP BY p.id
  ORDER BY p.name
`);

tabacs.forEach(t => {
  console.log(`ID ${t.id}: ${t.name}`);
  console.log(`  Latin: ${t.latin_name || 'N/A'}`);
  console.log(`  Molécules (${t.mol_count}): ${t.molecules || 'Aucune'}`);
  console.log();
});

// 2. CANNABIS
console.log('\n🌿 CANNABIS\n');
const [cannabis] = await conn.execute(`
  SELECT 
    p.id, p.name, p.latin_name, p.family,
    COUNT(DISTINCT pm.molecule_id) as mol_count,
    GROUP_CONCAT(CONCAT(m.name, ' (', pm.percentage, '%)') ORDER BY pm.percentage DESC SEPARATOR ', ') as molecules
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
  LEFT JOIN molecules m ON pm.molecule_id = m.id
  WHERE p.name LIKE '%Cannabis%' OR p.name LIKE '%cannabis%' OR p.latin_name LIKE '%Cannabis%'
  GROUP BY p.id
  ORDER BY p.name
`);

cannabis.forEach(c => {
  console.log(`ID ${c.id}: ${c.name}`);
  console.log(`  Latin: ${c.latin_name || 'N/A'}`);
  console.log(`  Molécules (${c.mol_count}): ${c.molecules || 'Aucune'}`);
  console.log();
});

// 3. ROSES
console.log('\n🌹 ROSES\n');
const [roses] = await conn.execute(`
  SELECT 
    p.id, p.name, p.latin_name, p.family,
    COUNT(DISTINCT pm.molecule_id) as mol_count,
    GROUP_CONCAT(CONCAT(m.name, ' (', pm.percentage, '%)') ORDER BY pm.percentage DESC SEPARATOR ', ') as molecules
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
  LEFT JOIN molecules m ON pm.molecule_id = m.id
  WHERE p.name LIKE '%Rose%' OR p.name LIKE '%rose%' OR p.latin_name LIKE '%Rosa%'
  GROUP BY p.id
  ORDER BY p.name
`);

roses.forEach(r => {
  console.log(`ID ${r.id}: ${r.name}`);
  console.log(`  Latin: ${r.latin_name || 'N/A'}`);
  console.log(`  Molécules (${r.mol_count}): ${r.molecules || 'Aucune'}`);
  console.log();
});

// 4. STATISTIQUES
console.log('\n📊 STATISTIQUES\n');
const [stats] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM plants WHERE category = 'tabac') as tabac_count,
    (SELECT COUNT(*) FROM plants WHERE name LIKE '%Cannabis%' OR latin_name LIKE '%Cannabis%') as cannabis_count,
    (SELECT COUNT(*) FROM plants WHERE name LIKE '%Rose%' OR latin_name LIKE '%Rosa%') as rose_count,
    (SELECT AVG(mol_count) FROM (
      SELECT COUNT(DISTINCT molecule_id) as mol_count FROM plant_molecules GROUP BY plant_id
    ) t) as avg_molecules_per_plant
  FROM DUAL
`);

const s = stats[0];
console.log(`  Tabacs : ${s.tabac_count}`);
console.log(`  Cannabis : ${s.cannabis_count}`);
console.log(`  Roses : ${s.rose_count}`);
console.log(`  Molécules moyennes par plante : ${Math.round(s.avg_molecules_per_plant)}`);

await conn.end();
console.log('\n✅ Analyse terminée');
