// Script pour identifier les plantes sans zones Köppen
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // Plantes sans zones Köppen
  const [plantsNoKoppen] = await connection.execute(`
    SELECT id, name, latin_name, koppen_zone, origin, habitat 
    FROM plants 
    WHERE koppen_zone IS NULL OR koppen_zone = '' 
    ORDER BY name
  `);
  
  console.log("=== PLANTES SANS ZONES KÖPPEN (27) ===");
  console.log(JSON.stringify(plantsNoKoppen, null, 2));
  
  // Plantes orphelines (sans liaisons moléculaires)
  const [orphanPlants] = await connection.execute(`
    SELECT p.id, p.name, p.latin_name
    FROM plants p
    LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
    WHERE pm.plant_id IS NULL
    ORDER BY p.name
  `);
  
  console.log("\n=== PLANTES ORPHELINES (sans liaisons moléculaires) ===");
  console.log(JSON.stringify(orphanPlants, null, 2));
  console.log(`Total: ${orphanPlants.length} plantes orphelines`);
  
  await connection.end();
}

main().catch(console.error);
