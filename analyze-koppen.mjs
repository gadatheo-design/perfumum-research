import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Extraire les plantes sans Köppen
const [rows] = await conn.execute(`
  SELECT id, name, latin_name, family, category, origin, climatic_axis
  FROM plants 
  WHERE (koppen_zone IS NULL OR koppen_zone = '')
  ORDER BY family, latin_name
`);

console.log('Total sans Köppen:', rows.length);

// Grouper par famille
const byFamily = {};
for (const r of rows) {
  const fam = r.family || 'Inconnue';
  if (!byFamily[fam]) byFamily[fam] = [];
  byFamily[fam].push(r);
}

const families = Object.entries(byFamily).sort((a,b) => b[1].length - a[1].length);
console.log('\nFamilles représentées:');
for (const [fam, plants] of families.slice(0, 25)) {
  const sample = plants.slice(0, 2).map(p => p.latin_name || p.name).join(', ');
  console.log(`  ${fam}: ${plants.length} plantes (ex: ${sample})`);
}

// Grouper par origine
const byOrigin = {};
for (const r of rows) {
  const orig = r.origin || 'Inconnue';
  if (!byOrigin[orig]) byOrigin[orig] = 0;
  byOrigin[orig]++;
}
const origins = Object.entries(byOrigin).sort((a,b) => b[1] - a[1]);
console.log('\nOrigines représentées:');
for (const [orig, count] of origins.slice(0, 15)) {
  console.log(`  ${orig}: ${count}`);
}

// Grouper par axe climatique
const byAxis = {};
for (const r of rows) {
  const axis = r.climatic_axis || 'Inconnu';
  if (!byAxis[axis]) byAxis[axis] = 0;
  byAxis[axis]++;
}
console.log('\nAxes climatiques:');
for (const [axis, count] of Object.entries(byAxis).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${axis}: ${count}`);
}

await conn.end();
