import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT id, name, latin_name FROM plants WHERE family IS NULL OR family = '' ORDER BY name");
console.log('Plantes sans famille:');
rows.forEach(r => console.log(`  ${r.id}: ${r.name} (${r.latin_name || 'pas de nom latin'})`));
await conn.end();
