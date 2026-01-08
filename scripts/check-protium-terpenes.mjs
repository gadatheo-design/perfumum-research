// Script pour vérifier les données du Protium et des terpènes dans la base
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { like, eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("=== Recherche du Protium ===");
  const [protiumRows] = await connection.execute(
    "SELECT id, name, latin_name, family, category, origin, dominant_molecules FROM plants WHERE name LIKE '%Protium%' OR latin_name LIKE '%Protium%'"
  );
  console.log("Protium trouvé:", protiumRows);

  console.log("\n=== Recherche des terpènes (α-pinène, β-pinène, limonène, β-caryophyllène) ===");
  const [terpeneRows] = await connection.execute(
    `SELECT id, name, cas_number, chemical_class, family FROM molecules 
     WHERE name LIKE '%pinène%' 
        OR name LIKE '%pinene%' 
        OR name LIKE '%limonène%' 
        OR name LIKE '%limonene%' 
        OR name LIKE '%caryophyllène%' 
        OR name LIKE '%caryophyllene%'`
  );
  console.log("Terpènes trouvés:", terpeneRows);

  console.log("\n=== Liaisons existantes molécules-plantes pour le Protium ===");
  const [linkRows] = await connection.execute(
    `SELECT mps.*, m.name as molecule_name, p.name as plant_name 
     FROM molecule_plant_sources mps
     JOIN molecules m ON mps.molecule_id = m.id
     JOIN plants p ON mps.plant_id = p.id
     WHERE p.name LIKE '%Protium%' OR p.latin_name LIKE '%Protium%'`
  );
  console.log("Liaisons existantes:", linkRows);

  console.log("\n=== Terroirs existants (Amazonie) ===");
  const [terroirRows] = await connection.execute(
    `SELECT id, terroir_id, name, country, region, climate_type FROM terroirs 
     WHERE name LIKE '%Amazo%' 
        OR region LIKE '%Amazo%' 
        OR region LIKE '%Putumayo%' 
        OR region LIKE '%Vaupés%'
        OR country = 'Colombie'
        OR country = 'Colombia'`
  );
  console.log("Terroirs Amazonie:", terroirRows);

  await connection.end();
}

main().catch(console.error);
