import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Compter toutes les recettes
const result = await db.execute('SELECT COUNT(*) as total FROM recettes');
const total = result[0][0].total;

console.log(`📊 Total recettes dans la base : ${total}`);

// Compter les recettes déjà liées
const linkedResult = await db.execute('SELECT COUNT(DISTINCT recette_id) as linked FROM recettes_formules_reference');
const linked = linkedResult[0][0].linked;

console.log(`✅ Recettes déjà liées : ${linked}`);
console.log(`⏳ Recettes à enrichir : ${total - linked}`);
console.log(`📈 Taux de couverture actuel : ${((linked / total) * 100).toFixed(1)}%`);

await connection.end();
