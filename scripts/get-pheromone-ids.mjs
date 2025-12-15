import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les recettes Pheromona
const [recettes] = await connection.execute(
  "SELECT id, name FROM recettes WHERE name LIKE 'Pheromona%'"
);
console.log('=== RECETTES ===');
recettes.forEach(r => console.log(`${r.id}: ${r.name}`));

// Récupérer les molécules phéromones
const [molecules] = await connection.execute(
  "SELECT id, name FROM molecules WHERE name IN ('Androsténol', 'Androsténone', 'Androstadienone') OR name LIKE '%5α-Androst%'"
);
console.log('\n=== MOLECULES ===');
molecules.forEach(m => console.log(`${m.id}: ${m.name}`));

await connection.end();
