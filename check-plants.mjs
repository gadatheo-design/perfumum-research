import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [cols] = await conn.query('SHOW COLUMNS FROM plants');
console.log('Colonnes de plants:', cols.map(c => c.Field).join(', '));

const [plants] = await conn.query(`SELECT id, name, conservation_status, sustainable_alternatives FROM plants WHERE conservation_status IS NOT NULL LIMIT 10`);
console.log('\nPlantes avec statut de conservation:', plants);

await conn.end();
