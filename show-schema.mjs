import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
  
  const [rows] = await connection.execute('DESCRIBE molecules');
  console.log('=== STRUCTURE DE LA TABLE MOLECULES ===');
  rows.forEach(r => {
    console.log(`${r.Field}: ${r.Type} ${r.Null === 'YES' ? '(nullable)' : '(required)'}`);
  });
  
  await connection.end();
}

main().catch(console.error);
