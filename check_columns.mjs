import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  const [rows] = await conn.execute(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'v3_references' 
    ORDER BY ORDINAL_POSITION
  `);
  
  console.log('Colonnes de v3_references:');
  rows.forEach(r => console.log(`  - ${r.COLUMN_NAME}`));
  
  await conn.end();
}

main().catch(console.error);
