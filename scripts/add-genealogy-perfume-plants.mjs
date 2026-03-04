/**
 * Généalogies des plantes à parfum : roses, lavandes, jasmin
 * Sources : GRIN, Plants of the World Online (Kew), RHS, USDA
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// ÉTAPE 1 : Identifier les plantes existantes dans la base
// ============================================================
async function findPlant(terms) {
  for (const term of terms) {
    const [rows] = await conn.execute(
      'SELECT id, name, latinName FROM plants WHERE LOWER(name) LIKE ? OR LOWER(latinName) LIKE ? LIMIT 1',
      ['%' + term.toLowerCase() + '%', '%' + term.toLowerCase() + '%']
    );
    if (rows[0]) return rows[0];
  }
  return null;
}

async function getOrCreate(name, latinName, family, origin, notes) {
  // Chercher d'abord
  const [rows] = await conn.execute(
    'SELECT id FROM plants WHERE latinName = ? OR name = ? LIMIT 1',
    [latinName, name]
  );
  if (rows[0]) return rows[0].id;
  
  // Créer si absent
  const [maxRow] = await conn.execute('SELECT MAX(id) as m FROM plants');
  const newId = Number(maxRow[0].m) + 1;
  await conn.execute(
    `INSERT INTO plants (id, name, latinName, family, origin, notes, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [newId, name, latinName, family, origin, notes]
  );
  console.log('  Créé:', name, '(id:', newId + ')');
  return newId;
}

// Vérifier les colonnes de variety_genealogy
const [cols] = await conn.execute('SHOW COLUMNS FROM variety_genealogy');
console.log('Colonnes variety_genealogy:', cols.map(c => c.Field).join(', '));

// Vérifier les colonnes de plants
const [plantCols] = await conn.execute('SHOW COLUMNS FROM plants');
console.log('Colonnes plants:', plantCols.map(c => c.Field).join(', '));

await conn.end();
