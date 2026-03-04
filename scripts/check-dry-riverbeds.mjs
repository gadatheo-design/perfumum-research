import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

// Voir le nom complet de ces plantes
const [rows] = await conn.execute(`
  SELECT id, name, latin_name, family, category, habitat, notes
  FROM plants 
  WHERE name LIKE 'EN: Dry riverbeds%'
  ORDER BY id
  LIMIT 5
`);

console.log('=== Plantes "EN: Dry riverbeds" ===');
for (const r of rows) {
  console.log(`\nID ${r.id}:`);
  console.log(`  name: "${r.name}"`);
  console.log(`  latin_name: "${r.latin_name}"`);
  console.log(`  family: "${r.family}"`);
  console.log(`  category: "${r.category}"`);
  console.log(`  habitat: "${r.habitat}"`);
  console.log(`  notes: "${r.notes}"`);
  
  const [rels] = await conn.execute(`SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = ?`, [r.id]);
  console.log(`  relations: ${rels[0].cnt}`);
}

// Voir les plantes autour de ID 660222 pour comprendre le contexte
const [context] = await conn.execute(`
  SELECT id, name, latin_name FROM plants 
  WHERE id BETWEEN 660218 AND 660230
  ORDER BY id
`);

console.log('\n=== Contexte autour de ID 660222 ===');
context.forEach(r => {
  console.log(`ID ${r.id}: "${r.name.substring(0, 80)}" (${r.latin_name})`);
});

await conn.end();
