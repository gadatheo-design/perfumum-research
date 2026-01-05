import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Voir tous les statuts de conservation distincts
const [statuses] = await conn.query(`SELECT DISTINCT conservation_status, COUNT(*) as count FROM plants GROUP BY conservation_status`);
console.log('Statuts de conservation:', statuses);

// Chercher les plantes menacées
const [threatened] = await conn.query(`SELECT id, name, conservation_status FROM plants WHERE conservation_status IN ('CR', 'EN', 'VU', 'NT')`);
console.log('\nPlantes menacées:', threatened);

// Vérifier la table sustainable_alternatives
const [altTable] = await conn.query(`SHOW TABLES LIKE 'sustainable_alternatives'`);
console.log('\nTable sustainable_alternatives existe:', altTable.length > 0);

if (altTable.length > 0) {
  const [alts] = await conn.query(`SELECT * FROM sustainable_alternatives`);
  console.log('Alternatives existantes:', alts);
}

await conn.end();
