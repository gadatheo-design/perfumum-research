import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Terroirs
const [totalPlants] = await conn.execute('SELECT COUNT(*) as n FROM plants');
const [withTerroir] = await conn.execute('SELECT COUNT(DISTINCT plant_id) as n FROM plant_terroirs');
const [terroirs] = await conn.execute('SELECT COUNT(*) as n FROM terroirs');
console.log('=== TERROIRS ===');
console.log('Total plantes:', totalPlants[0].n);
console.log('Plantes avec terroir:', withTerroir[0].n, '(' + (withTerroir[0].n / totalPlants[0].n * 100).toFixed(1) + '%)');
console.log('Total terroirs:', terroirs[0].n);

const [noTerroir] = await conn.execute('SELECT p.id, p.name, p.category FROM plants p LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id WHERE pt.plant_id IS NULL LIMIT 15');
console.log('Plantes sans terroir (15 premières):');
noTerroir.forEach(r => console.log(' ', r.id, r.name, '|', r.category));

// Compositions moléculaires
const [genericLinks] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules WHERE percentage <= 5 AND percentage > 0');
const [totalLinks] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules');
const [preciseLinks] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules WHERE percentage > 5');
const [zeroLinks] = await conn.execute('SELECT COUNT(*) as n FROM plant_molecules WHERE percentage = 0 OR percentage IS NULL');
console.log('\n=== COMPOSITIONS MOLÉCULAIRES ===');
console.log('Total liaisons:', totalLinks[0].n);
console.log('Pourcentages précis (>5%):', preciseLinks[0].n, '(' + (preciseLinks[0].n / totalLinks[0].n * 100).toFixed(1) + '%)');
console.log('Pourcentages génériques (1-5%):', genericLinks[0].n, '(' + (genericLinks[0].n / totalLinks[0].n * 100).toFixed(1) + '%)');
console.log('Pourcentages nuls/null:', zeroLinks[0].n);

// Pyrolyse
const [pyro] = await conn.execute('SELECT COUNT(*) as n FROM pyrolysis_transformations');
const [pyroCols] = await conn.execute('DESCRIBE pyrolysis_transformations');
console.log('=== PYROLYSE ===');
console.log('Transformations pyrolyse:', pyro[0].n);
console.log('Colonnes:', pyroCols.map(c => c.Field).join(', '));

// Généalogies
const [genealogy] = await conn.execute('SELECT COUNT(*) as n FROM variety_genealogy');
const [genealogyCols] = await conn.execute('DESCRIBE variety_genealogy');
console.log('\n=== GÉNÉALOGIES ===');
console.log('Entrées généalogiques:', genealogy[0].n);
console.log('Colonnes:', genealogyCols.map(c => c.Field).join(', '));

// Propriétés thérapeutiques
const [withTherapeutic] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != "" AND therapeuticProperties != "null"');
const [totalMols] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
console.log('\n=== THÉRAPEUTIQUE ===');
console.log('Molécules avec propriétés thérapeutiques:', withTherapeutic[0].n, '/' + totalMols[0].n, '(' + (withTherapeutic[0].n / totalMols[0].n * 100).toFixed(1) + '%)');

// Bibliographie
const [bibLinks] = await conn.execute('SELECT COUNT(*) as n FROM bibliography_entity_links');
const [bibRefs] = await conn.execute('SELECT COUNT(*) as n FROM bibliography_entries');
const [linkedBib] = await conn.execute('SELECT COUNT(DISTINCT bibliography_id) as n FROM bibliography_entity_links');
console.log('\n=== BIBLIOGRAPHIE ===');
console.log('Total références:', bibRefs[0].n);
console.log('Références liées:', linkedBib[0].n, '(' + (linkedBib[0].n / bibRefs[0].n * 100).toFixed(1) + '%)');
console.log('Total liaisons entity_links:', bibLinks[0].n);

await conn.end();
