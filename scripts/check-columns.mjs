import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function checkColumns() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    const [rows] = await connection.execute('SHOW COLUMNS FROM molecules');
    console.log('Colonnes de la table molecules:');
    rows.forEach(row => {
      console.log(`  - ${row.Field} (${row.Type})`);
    });
  } finally {
    await connection.end();
  }
}

checkColumns().catch(console.error);
