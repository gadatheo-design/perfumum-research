import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // Vérifier les plantes
  const plants = await db.execute(sql`SELECT id, name FROM plants WHERE name LIKE '%Rose%' OR name LIKE '%Damas%'`);
  console.log('Plantes Rose/Damas:', plants[0]);
  
  // Compter les associations
  const count = await db.execute(sql`SELECT COUNT(*) as total FROM plant_molecules`);
  console.log('Total associations plant_molecules:', count[0]);
  
  // Vérifier les associations pour Rose de Damas
  const roseAssoc = await db.execute(sql`
    SELECT pm.*, p.name as plant_name, m.name as molecule_name 
    FROM plant_molecules pm 
    JOIN plants p ON pm.plant_id = p.id 
    JOIN molecules m ON pm.molecule_id = m.id 
    WHERE p.name = 'Rose de Damas'
  `);
  console.log('Associations Rose de Damas:', roseAssoc[0]);
  
  await connection.end();
}

main().catch(console.error);
