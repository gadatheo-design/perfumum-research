import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [columns] = await connection.execute('DESCRIBE plant_molecules');
console.log('Structure de plant_molecules:');
columns.forEach(c => console.log(`  ${c.Field}: ${c.Type} ${c.Null === 'NO' ? 'NOT NULL' : ''} ${c.Key}`));
await connection.end();
