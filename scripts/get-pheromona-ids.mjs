import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await connection.execute(
  "SELECT id, name FROM recettes WHERE name LIKE 'Pheromona%' ORDER BY name"
);
rows.forEach(r => console.log(`${r.id}: ${r.name}`));
await connection.end();
