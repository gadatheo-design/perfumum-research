import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const names = ['Linalyl','Benzyl Acetate','Phenylethyl','Geranyl Acetate','Citronellyl','Terpineol','Ambrettolide'];
for (const n of names) {
  const [r] = await conn.execute('SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 3', [`%${n}%`]);
  console.log(`${n} → ${r.map(x=>x.name+' ('+x.id+')').join(', ') || 'NON TROUVÉ'}`);
}
await conn.end();
