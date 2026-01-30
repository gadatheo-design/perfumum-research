import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { sql } from "drizzle-orm";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("\n=== Liaison Tagetes lucida - Molécules - Recettes ===\n");

  // 1. Trouver Tagetes lucida (ID 300001)
  const tagetesId = 300001;
  console.log("Plante cible: Tagetes lucida (Pericón) - ID:", tagetesId);

  // 2. Rechercher les molécules
  console.log("\n=== Recherche des molécules ===");
  const moleculesResult = await db.execute(sql`
    SELECT id, name, cas_number FROM molecules 
    WHERE name LIKE '%Anéthole%' 
       OR name LIKE '%Anethole%' 
       OR name LIKE '%Méthyleugénol%' 
       OR name LIKE '%Methyleugenol%' 
       OR name LIKE '%Estragole%'
       OR name LIKE '%estragol%'
  `);
  
  console.log("Molécules trouvées:");
  for (const mol of moleculesResult[0]) {
    console.log(`  ID: ${mol.id}, Nom: ${mol.name}, CAS: ${mol.cas_number}`);
  }

  // 3. Rechercher les recettes contenant Tagetes/Pericón
  console.log("\n=== Recherche des recettes ===");
  const recettesResult = await db.execute(sql`
    SELECT id, name, code, ingredients
    FROM recettes
    WHERE name LIKE '%Tagetes%'
       OR name LIKE '%Pericón%'
       OR name LIKE '%Pericon%'
       OR name LIKE '%pericón%'
       OR ingredients LIKE '%Tagetes%'
       OR ingredients LIKE '%Pericón%'
       OR ingredients LIKE '%pericon%'
  `);
  
  console.log(`Recettes trouvées: ${recettesResult[0].length}`);
  for (const rec of recettesResult[0]) {
    console.log(`  ID: ${rec.id}, Code: ${rec.code}, Nom: ${rec.name}`);
  }

  // 4. Vérifier la structure de la table molecules_recettes
  console.log("\n=== Structure molecules_recettes ===");
  const structResult = await db.execute(sql`DESCRIBE molecules_recettes`);
  console.log("Colonnes:");
  for (const col of structResult[0]) {
    console.log(`  ${col.Field}: ${col.Type}`);
  }

  // 5. Vérifier la table plant_molecules
  console.log("\n=== Vérification plant_molecules ===");
  try {
    const pmStructResult = await db.execute(sql`DESCRIBE plant_molecules`);
    console.log("Table plant_molecules existe:");
    for (const col of pmStructResult[0]) {
      console.log(`  ${col.Field}: ${col.Type}`);
    }
    
    // Vérifier les liaisons existantes pour Tagetes
    const existingLinks = await db.execute(sql`
      SELECT pm.*, m.name as molecule_name
      FROM plant_molecules pm
      JOIN molecules m ON pm.molecule_id = m.id
      WHERE pm.plant_id = ${tagetesId}
    `);
    console.log(`\nLiaisons existantes pour Tagetes lucida: ${existingLinks[0].length}`);
    for (const link of existingLinks[0]) {
      console.log(`  -> ${link.molecule_name} (ID: ${link.molecule_id})`);
    }
  } catch (e) {
    console.log("Table plant_molecules non trouvée");
  }

  // 6. Rechercher toutes les molécules qui pourraient correspondre
  console.log("\n=== Recherche élargie de molécules ===");
  const allMolecules = await db.execute(sql`
    SELECT id, name, cas_number FROM molecules 
    WHERE name LIKE '%anethole%' 
       OR name LIKE '%anéthole%'
       OR name LIKE '%methyleugenol%'
       OR name LIKE '%méthyleugénol%'
       OR name LIKE '%estragole%'
       OR name LIKE '%tagetone%'
       OR name LIKE '%ocimene%'
       OR name LIKE '%ocimène%'
    ORDER BY name
  `);
  
  console.log(`Molécules potentielles: ${allMolecules[0].length}`);
  for (const mol of allMolecules[0]) {
    console.log(`  ID: ${mol.id}, Nom: ${mol.name}, CAS: ${mol.cas_number || 'N/A'}`);
  }

  await connection.end();
  console.log("\n=== Analyse terminée ===\n");
}

main().catch(console.error);
