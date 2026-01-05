import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [cols] = await conn.query('SHOW COLUMNS FROM sustainable_alternatives');
console.log('Colonnes de sustainable_alternatives:');
cols.forEach(c => console.log(`  - ${c.Field} (${c.Type})`));
await conn.end();
