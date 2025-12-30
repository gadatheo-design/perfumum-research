import mysql from 'mysql2/promise';

async function checkRadarColumns() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL!);
  const [cols] = await conn.execute('DESCRIBE molecules');
  console.log('\n📋 Colonnes radar dans la table molecules:');
  (cols as any[]).filter(c => c.Field.toLowerCase().includes('radar')).forEach(c => {
    console.log(`  • ${c.Field} (${c.Type})`);
  });
  await conn.end();
}

checkRadarColumns().catch(console.error);
