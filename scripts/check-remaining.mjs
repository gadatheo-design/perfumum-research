import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

const [rows] = await conn.execute(`
  SELECT id, name, latin_name, family
  FROM plants 
  WHERE name LIKE '%;%'
  ORDER BY id
  LIMIT 30
`);

console.log('=== Plantes encore mal formatées ===');
rows.forEach(r => {
  console.log(`ID ${r.id}: name="${r.name.substring(0, 100)}" | family="${r.family}"`);
});

await conn.end();
