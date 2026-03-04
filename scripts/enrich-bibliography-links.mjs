/**
 * Analyse et enrichissement des liaisons bibliographiques JSON
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ANALYSE ET ENRICHISSEMENT DES LIAISONS BIBLIOGRAPHIQUES ===\n');

// 1. Analyser les références avec liaisons existantes
console.log('📚 Références avec liaisons existantes :\n');
const [bibWithLinks] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN linked_plant_ids IS NOT NULL AND linked_plant_ids != 'null' THEN 1 ELSE 0 END) as with_plants,
    SUM(CASE WHEN linked_molecule_ids IS NOT NULL AND linked_molecule_ids != 'null' THEN 1 ELSE 0 END) as with_molecules,
    SUM(CASE WHEN linked_recette_ids IS NOT NULL AND linked_recette_ids != 'null' THEN 1 ELSE 0 END) as with_recettes
  FROM bibliography_entries
`);

const b = bibWithLinks[0];
console.log(`  Total références : ${b.total}`);
console.log(`  Avec liaisons plantes : ${b.with_plants} (${Math.round(b.with_plants/b.total*100)}%)`);
console.log(`  Avec liaisons molécules : ${b.with_molecules} (${Math.round(b.with_molecules/b.total*100)}%)`);
console.log(`  Avec liaisons recettes : ${b.with_recettes} (${Math.round(b.with_recettes/b.total*100)}%)`);

// 2. Analyser les références par domaine de recherche
console.log('\n\n🔬 Références par domaine de recherche :\n');
const [byDomain] = await conn.execute(`
  SELECT 
    research_domain,
    COUNT(*) as count
  FROM bibliography_entries
  WHERE research_domain IS NOT NULL
  GROUP BY research_domain
  ORDER BY count DESC
`);

console.log('Distribution par domaine :');
byDomain.forEach(d => {
  console.log(`  ${d.research_domain} : ${d.count}`);
});

// 3. Analyser les références prioritaires (tabac, cannabis, parfumerie)
console.log('\n\n🎯 Références prioritaires :\n');
const [priorityBib] = await conn.execute(`
  SELECT 
    id, title, authors, research_domain,
    linked_plant_ids, linked_molecule_ids
  FROM bibliography_entries
  WHERE research_domain IN ('tabac_cannabis', 'chimie_olfactive', 'botanique')
  ORDER BY research_domain, id
  LIMIT 20
`);

console.log(`Références prioritaires (${priorityBib.length}) :`);
priorityBib.forEach(b => {
  const plants = b.linked_plant_ids ? JSON.parse(b.linked_plant_ids || '[]').length : 0;
  const mols = b.linked_molecule_ids ? JSON.parse(b.linked_molecule_ids || '[]').length : 0;
  console.log(`  [${b.id}] ${b.title} (${b.research_domain})`);
  console.log(`       Plantes: ${plants}, Molécules: ${mols}`);
});

// 4. Statistiques de couverture
console.log('\n\n📊 Statistiques de couverture :\n');
const [coverage] = await conn.execute(`
  SELECT 
    (SELECT COUNT(DISTINCT p.id) FROM plants p) as total_plants,
    (SELECT COUNT(DISTINCT JSON_EXTRACT(be.linked_plant_ids, '$[*]')) 
     FROM bibliography_entries be 
     WHERE linked_plant_ids IS NOT NULL AND linked_plant_ids != 'null') as plants_in_bib,
    (SELECT COUNT(DISTINCT m.id) FROM molecules m) as total_molecules,
    (SELECT COUNT(DISTINCT JSON_EXTRACT(be.linked_molecule_ids, '$[*]')) 
     FROM bibliography_entries be 
     WHERE linked_molecule_ids IS NOT NULL AND linked_molecule_ids != 'null') as molecules_in_bib
  FROM DUAL
`);

const c = coverage[0];
console.log(`  Plantes couvertes par bibliographie : ${c.plants_in_bib}/${c.total_plants} (${Math.round(c.plants_in_bib/c.total_plants*100)}%)`);
console.log(`  Molécules couvertes par bibliographie : ${c.molecules_in_bib}/${c.total_molecules} (${Math.round(c.molecules_in_bib/c.total_molecules*100)}%)`);

// 5. Identifier les références sans liaisons
console.log('\n\n🔍 Références sans liaisons :\n');
const [noBib] = await conn.execute(`
  SELECT COUNT(*) as count
  FROM bibliography_entries
  WHERE (linked_plant_ids IS NULL OR linked_plant_ids = 'null')
    AND (linked_molecule_ids IS NULL OR linked_molecule_ids = 'null')
    AND (linked_recette_ids IS NULL OR linked_recette_ids = 'null')
`);

console.log(`  Références sans liaisons : ${noBib[0].count}`);

// 6. Analyser les tags et keywords
console.log('\n\n🏷️  Tags et keywords :\n');
const [withTags] = await conn.execute(`
  SELECT 
    COUNT(*) as with_tags,
    (SELECT COUNT(*) FROM bibliography_entries) as total
  FROM bibliography_entries
  WHERE tags IS NOT NULL AND tags != 'null' AND tags != '[]'
`);

console.log(`  Références avec tags : ${withTags[0].with_tags}/${withTags[0].total}`);

await conn.end();
console.log('\n✅ Analyse terminée');
