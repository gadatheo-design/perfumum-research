import { db } from '../server/db';

async function main() {
  // Récupérer toutes les synergies
  const synergies = await db.execute('SELECT * FROM synergies LIMIT 10');
  console.log('=== SYNERGIES (10 premières) ===');
  console.log(JSON.stringify(synergies.rows, null, 2));

  // Compter le total
  const count = await db.execute('SELECT COUNT(*) as total FROM synergies');
  console.log('\n=== TOTAL SYNERGIES ===');
  console.log(count.rows[0]);

  // Vérifier les colonnes
  const columns = await db.execute('DESCRIBE synergies');
  console.log('\n=== COLONNES TABLE SYNERGIES ===');
  console.log(JSON.stringify(columns.rows, null, 2));

  process.exit(0);
}

main().catch(console.error);
