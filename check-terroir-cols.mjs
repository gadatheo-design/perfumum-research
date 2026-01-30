import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [cols] = await connection.execute('DESCRIBE terroirs');
console.log('=== COLONNES DE LA TABLE TERROIRS ===');
cols.forEach(c => console.log(`  ${c.Field} (${c.Type})`));
await connection.end();
