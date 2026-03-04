import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [[stats]] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM plants) as total_plants,
    (SELECT COUNT(*) FROM molecules) as total_molecules,
    (SELECT COUNT(*) FROM plant_molecules) as total_links,
    (SELECT COUNT(*) FROM plants WHERE latin_name IS NULL OR latin_name = '') as plants_no_latin,
    (SELECT COUNT(*) FROM plants p WHERE NOT EXISTS (SELECT 1 FROM plant_molecules pm WHERE pm.plant_id = p.id)) as orphan_plants,
    (SELECT COUNT(*) FROM plant_molecules WHERE source IS NULL OR source = '') as links_no_source,
    (SELECT COUNT(*) FROM plant_molecules WHERE percentage IS NULL OR percentage = 0) as links_no_pct,
    (SELECT COUNT(*) FROM terroirs) as total_terroirs,
    (SELECT COUNT(*) FROM variety_genealogy) as total_genealogy,
    (SELECT COUNT(*) FROM bibliography_entries) as total_biblio,
    (SELECT COUNT(*) FROM pyrolysis_transformations) as total_pyrolysis
`);

console.log('=== DIAGNOSTIC PERFUMUM ===');
console.log('Plantes totales          :', stats.total_plants);
console.log('Molécules totales        :', stats.total_molecules);
console.log('Liaisons plant↔mol       :', stats.total_links);
console.log('Plantes sans nom latin   :', stats.plants_no_latin, `(${Math.round(stats.plants_no_latin/stats.total_plants*100)}%)`);
console.log('Plantes orphelines       :', stats.orphan_plants, `(${Math.round(stats.orphan_plants/stats.total_plants*100)}%)`);
console.log('Liaisons sans source     :', stats.links_no_source, `(${Math.round(stats.links_no_source/stats.total_links*100)}%)`);
console.log('Liaisons sans %          :', stats.links_no_pct, `(${Math.round(stats.links_no_pct/stats.total_links*100)}%)`);
console.log('Terroirs                 :', stats.total_terroirs);
console.log('Liaisons généalogiques   :', stats.total_genealogy);
console.log('Références bibliographiques:', stats.total_biblio);
console.log('Transformations pyrolyse :', stats.total_pyrolysis);

// Familles sous-représentées
const [families] = await conn.execute(`
  SELECT chemicalFamily as chemical_family, COUNT(*) as cnt
  FROM molecules
  WHERE chemicalFamily IS NOT NULL AND chemicalFamily != ''
  GROUP BY chemicalFamily
  HAVING cnt < 3
  ORDER BY cnt ASC
  LIMIT 50
`);
console.log('\n=== FAMILLES < 3 MOLÉCULES (' + families.length + ' familles) ===');
const fam1 = families.filter(f => f.cnt === 1);
const fam2 = families.filter(f => f.cnt === 2);
console.log(`  Familles avec 1 molécule : ${fam1.length}`);
fam1.forEach(f => console.log(`    1x  ${f.chemical_family}`));
console.log(`  Familles avec 2 molécules : ${fam2.length}`);
fam2.forEach(f => console.log(`    2x  ${f.chemical_family}`));

// Top familles bien représentées
const [topFamilies] = await conn.execute(`
  SELECT chemicalFamily as chemical_family, COUNT(*) as cnt
  FROM molecules
  WHERE chemicalFamily IS NOT NULL AND chemicalFamily != ''
  GROUP BY chemicalFamily
  ORDER BY cnt DESC
  LIMIT 10
`);
console.log('\n=== TOP 10 FAMILLES BIEN REPRÉSENTÉES ===');
topFamilies.forEach(f => console.log(`  ${f.cnt}x  ${f.chemical_family}`));

// Doublons molécules
const [dupes] = await conn.execute(`
  SELECT LOWER(name) as norm_name, COUNT(*) as cnt
  FROM molecules
  GROUP BY LOWER(name)
  HAVING cnt > 1
  ORDER BY cnt DESC LIMIT 10
`);
if (dupes.length > 0) {
  console.log('\n=== DOUBLONS MOLÉCULES ===');
  dupes.forEach(d => console.log(`  "${d.norm_name}" — ${d.cnt}x`));
} else {
  console.log('\n✅ Aucun doublon de molécule');
}

// Plantes sans nom latin
const [noLatin] = await conn.execute(`
  SELECT id, name, category FROM plants
  WHERE latin_name IS NULL OR latin_name = ''
  ORDER BY name LIMIT 20
`);
if (noLatin.length > 0) {
  console.log('\n=== PLANTES SANS NOM LATIN ===');
  noLatin.forEach(p => console.log(`  [${p.id}] ${p.name} (${p.category || '?'})`));
}

await conn.end();
console.log('\n✅ Diagnostic terminé');
