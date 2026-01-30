/**
 * Script pour analyser les relations molécule-plante existantes
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('Connexion à la base de données...');
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // Compter les relations existantes
  const countResult = await db.execute(sql`SELECT COUNT(*) as total FROM plant_molecules`);
  console.log(`\n=== Relations molécule-plante existantes: ${countResult[0][0].total} ===\n`);
  
  // Voir les relations existantes avec les noms
  const relations = await db.execute(sql`
    SELECT 
      pm.plant_id,
      p.name as plant_name,
      pm.molecule_id,
      m.name as molecule_name,
      pm.percentage_min,
      pm.percentage_max,
      pm.percentage_typical,
      pm.role,
      pm.is_signature
    FROM plant_molecules pm
    JOIN plants p ON pm.plant_id = p.id
    JOIN molecules m ON pm.molecule_id = m.id
    ORDER BY p.name, pm.role
  `);
  
  console.log('Relations existantes:');
  console.table(relations[0]);
  
  // Identifier les plantes sans relations
  const plantsWithoutMolecules = await db.execute(sql`
    SELECT p.id, p.name, p.latin_name
    FROM plants p
    LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
    WHERE pm.id IS NULL
    ORDER BY p.name
  `);
  
  console.log('\n=== Plantes sans relations molécule-plante ===');
  console.table(plantsWithoutMolecules[0]);
  
  // Lister les molécules disponibles pour les associations
  const molecules = await db.execute(sql`
    SELECT id, name, family, chemical_class
    FROM molecules
    WHERE name IN (
      'Linalol', 'Linalool', 'Acétate de linalyle', 'Linalyl acetate',
      'Limonène', 'Limonene', 'Citral', 'Géraniol', 'Geraniol',
      'Citronellol', 'Menthol', '1,8-Cinéole', 'Eucalyptol',
      'α-Pinène', 'Alpha-pinene', 'β-Pinène', 'Beta-pinene',
      'Patchoulol', 'α-Santalol', 'β-Santalol', 'Khusimol',
      'Acétate de benzyle', 'Benzyl acetate', 'Indole',
      'Germacrène D', 'Germacrene D', 'Caryophyllène', 'Caryophyllene',
      'Himachalène', 'Atlantone', 'Camphre', 'Camphor'
    )
    ORDER BY name
  `);
  
  console.log('\n=== Molécules disponibles pour les associations ===');
  console.table(molecules[0]);
  
  await connection.end();
}

main().catch(console.error);
