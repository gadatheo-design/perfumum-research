import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 1. Propriétés thérapeutiques
const [sample] = await conn.execute('SELECT id, name, therapeuticProperties, olfactiveProfile FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != "null" LIMIT 5');
console.log('=== DONNÉES THÉRAPEUTIQUES ===');
sample.forEach(m => {
  console.log('  ', m.name, ':');
  console.log('    therapeutic:', String(m.therapeuticProperties).substring(0, 200));
});
const [countThera] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != "null" AND therapeuticProperties != ""');
console.log('  Total avec therapeuticProperties:', countThera[0].n);

// 2. Généalogie
const [genData] = await conn.execute('SELECT vg.*, p1.name as variety_name, p2.name as parent_name FROM variety_genealogy vg JOIN plants p1 ON vg.variety_id = p1.id JOIN plants p2 ON vg.parent_variety_id = p2.id LIMIT 5');
console.log('\n=== GÉNÉALOGIE EXEMPLES ===');
genData.forEach(g => console.log('  ', g.variety_name, '->', g.parent_name, '(', g.relationship_type, ')'));

const [genVarieties] = await conn.execute('SELECT DISTINCT p.name, p.category, COUNT(vg.id) as parents FROM variety_genealogy vg JOIN plants p ON vg.variety_id = p.id GROUP BY p.id ORDER BY parents DESC LIMIT 10');
console.log('\n=== VARIÉTÉS AVEC GÉNÉALOGIE ===');
genVarieties.forEach(v => console.log('  ', v.name, '(', v.category, ') -', v.parents, 'parents'));

// 3. Bibliographie - domaines
const [domains] = await conn.execute('SELECT research_domain, COUNT(*) as n FROM bibliography_entries GROUP BY research_domain ORDER BY n DESC LIMIT 15');
console.log('\n=== DOMAINES BIBLIOGRAPHIE ===');
domains.forEach(d => console.log('  ', JSON.stringify(d.research_domain), ':', d.n));

// Liaisons existantes
const [lnkCnt] = await conn.execute('SELECT entity_type, COUNT(*) as n FROM bibliography_entity_links GROUP BY entity_type');
console.log('\n=== LIAISONS EXISTANTES ===');
lnkCnt.forEach(l => console.log('  ', l.entity_type, ':', l.n));

// Couverture linked_plant_ids / linked_molecule_ids
const [linked] = await conn.execute('SELECT COUNT(*) as total, SUM(CASE WHEN linked_plant_ids IS NOT NULL THEN 1 ELSE 0 END) as with_plants, SUM(CASE WHEN linked_molecule_ids IS NOT NULL THEN 1 ELSE 0 END) as with_molecules FROM bibliography_entries');
console.log('\n=== COUVERTURE ===');
console.log('  Total:', linked[0].total, '| Avec plantes:', linked[0].with_plants, '| Avec molécules:', linked[0].with_molecules);

// Exemple de référence tabac
const [tabacEx] = await conn.execute('SELECT id, title, keywords, abstract FROM bibliography_entries WHERE research_domain = "tabac_cannabis" LIMIT 2');
console.log('\n=== EXEMPLES TABAC/CANNABIS ===');
tabacEx.forEach(t => {
  console.log('  title:', t.title.substring(0, 80));
  console.log('  keywords:', String(t.keywords).substring(0, 100));
  console.log('  abstract:', String(t.abstract).substring(0, 150));
});

await conn.end();
