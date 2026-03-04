/**
 * Analyse des plantes orphelines et sans nom latin
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ANALYSE DES PLANTES ORPHELINES ===\n');

// 1. Plantes sans nom latin
const [noLatin] = await conn.execute(`
  SELECT id, name, category, family, origin
  FROM plants 
  WHERE latin_name IS NULL OR latin_name = '' OR latin_name = 'null'
  ORDER BY category, name
`);

console.log(`📋 PLANTES SANS NOM LATIN (${noLatin.length})\n`);
const byCategory = {};
noLatin.forEach(p => {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
});

Object.entries(byCategory).forEach(([cat, plants]) => {
  console.log(`\n${cat.toUpperCase()} (${plants.length}):`);
  plants.slice(0, 5).forEach(p => {
    console.log(`  ID ${p.id}: ${p.name} | Famille: ${p.family || 'N/A'} | Origine: ${p.origin || 'N/A'}`);
  });
  if (plants.length > 5) console.log(`  ... et ${plants.length - 5} autres`);
});

// 2. Plantes orphelines (sans liaisons moléculaires)
const [orphans] = await conn.execute(`
  SELECT p.id, p.name, p.latin_name, p.category, p.family, COUNT(pm.molecule_id) as mol_count
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
  GROUP BY p.id
  HAVING mol_count = 0
  ORDER BY p.category, p.name
`);

console.log(`\n\n🌿 PLANTES ORPHELINES - SANS LIAISONS MOLÉCULAIRES (${orphans.length})\n`);
const orphansByCategory = {};
orphans.forEach(p => {
  if (!orphansByCategory[p.category]) orphansByCategory[p.category] = [];
  orphansByCategory[p.category].push(p);
});

Object.entries(orphansByCategory).forEach(([cat, plants]) => {
  console.log(`\n${cat.toUpperCase()} (${plants.length}):`);
  plants.slice(0, 5).forEach(p => {
    console.log(`  ID ${p.id}: ${p.name} (${p.latin_name || 'N/A'}) | Famille: ${p.family || 'N/A'}`);
  });
  if (plants.length > 5) console.log(`  ... et ${plants.length - 5} autres`);
});

// 3. Statistiques
const [stats] = await conn.execute(`
  SELECT 
    COUNT(*) as total_plants,
    SUM(CASE WHEN latin_name IS NULL OR latin_name = '' OR latin_name = 'null' THEN 1 ELSE 0 END) as no_latin,
    COUNT(DISTINCT CASE WHEN pm.molecule_id IS NOT NULL THEN p.id END) as with_molecules,
    COUNT(DISTINCT CASE WHEN pm.molecule_id IS NULL THEN p.id END) as orphans
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
`);

const s = stats[0];
console.log(`\n\n📊 STATISTIQUES GLOBALES`);
console.log(`  Total plantes : ${s.total_plants}`);
console.log(`  Sans nom latin : ${s.no_latin} (${Math.round(s.no_latin/s.total_plants*100)}%)`);
console.log(`  Avec liaisons moléculaires : ${s.with_molecules} (${Math.round(s.with_molecules/s.total_plants*100)}%)`);
console.log(`  Orphelines (sans liaisons) : ${s.orphans} (${Math.round(s.orphans/s.total_plants*100)}%)`);

// 4. Molécules disponibles pour enrichissement
const [topMols] = await conn.execute(`
  SELECT m.id, m.name, COUNT(DISTINCT pm.plant_id) as plant_count
  FROM molecules m
  LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
  GROUP BY m.id
  ORDER BY plant_count DESC
  LIMIT 20
`);

console.log(`\n\n🧪 TOP 20 MOLÉCULES LES PLUS LIÉES`);
topMols.forEach((m, i) => {
  console.log(`  ${i+1}. ${m.name} (${m.plant_count} plantes)`);
});

await conn.end();
console.log('\n✅ Analyse terminée');
