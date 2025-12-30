import mysql from 'mysql2/promise';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const sql = fs.readFileSync('import_royal_mossi.sql', 'utf8');

// Remove comments first
const sqlClean = sql
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n');

// Split by semicolon
const statements = sqlClean
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`📦 ${statements.length} statements à exécuter\n`);

let success = 0;
let errors = 0;

for (const statement of statements) {
  try {
    await connection.execute(statement);
    console.log('✓ Statement exécuté');
    success++;
  } catch (err) {
    console.error('✗ Erreur:', err.message);
    errors++;
  }
}

await connection.end();

console.log(`\n✅ Import terminé: ${success} succès, ${errors} erreurs`);
