import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

const [rows] = await conn.execute(
  `SELECT id, name FROM plants WHERE name LIKE '%;%' AND id != 600001 ORDER BY id LIMIT 15`
);

rows.forEach(r => {
  const parts = r.name.split(';');
  console.log(`ID ${r.id}: name="${parts[0]}" | latin="${parts[1]}" | family="${parts[2]}" | category="${parts[3]}"`);
});

await conn.end();
