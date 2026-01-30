/**
 * Script pour lister les plantes sans relations molécule-plante
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('Connexion à la base de données...');
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // Identifier les plantes sans relations
  const plantsWithoutMolecules = await db.execute(sql`
    SELECT p.id, p.name, p.latin_name, p.category, p.family
    FROM plants p 
    WHERE p.id NOT IN (SELECT DISTINCT plant_id FROM plant_molecules) 
    ORDER BY p.name
  `);
  
  console.log('\n=== Plantes sans relations molécule-plante ===');
  console.table(plantsWithoutMolecules[0]);
  console.log(`\nTotal: ${plantsWithoutMolecules[0].length} plantes`);
  
  await connection.end();
}

main().catch(console.error);
