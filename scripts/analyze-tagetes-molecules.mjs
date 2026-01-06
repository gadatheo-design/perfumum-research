import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { sql } from "drizzle-orm";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("\n=== Analyse Tagetes lucida - Molécules - Recettes ===\n");

  // 1. Trouver Tagetes lucida
  const tagetesResult = await db.execute(sql`
    SELECT id, name, latin_name, dominant_molecules 
    FROM plants 
    WHERE latin_name LIKE '%Tagetes%' 
       OR name LIKE '%Tagetes%' 
       OR name LIKE '%Pericón%' 
       OR name LIKE '%Estragon%'
  `);
  
  console.log("=== Plantes Tagetes trouvées ===");
  for (const plant of tagetesResult[0]) {
    console.log(`ID: ${plant.id}, Nom: ${plant.name}, Latin: ${plant.latin_name}`);
    console.log(`  Molécules dominantes: ${plant.dominant_molecules || 'Non spécifié'}`);
  }

  // 2. Rechercher les molécules Anéthole et Méthyleugénol
  console.log("\n=== Molécules Anéthole et Méthyleugénol ===");
  const moleculesResult = await db.execute(sql`
    SELECT id, name, cas_number, odor_profile 
    FROM molecules 
    WHERE name LIKE '%Anéthole%' 
       OR name LIKE '%Anethole%' 
       OR name LIKE '%Méthyleugénol%' 
       OR name LIKE '%Methyleugénol%'
       OR name LIKE '%Methyleugenol%'
       OR name LIKE '%Estragole%'
  `);
  
  for (const mol of moleculesResult[0]) {
    console.log(`ID: ${mol.id}, Nom: ${mol.name}, CAS: ${mol.cas_number}`);
    console.log(`  Profil olfactif: ${mol.odor_profile || 'Non spécifié'}`);
  }

  // 3. Rechercher les recettes contenant Tagetes ou les molécules
  console.log("\n=== Recettes avec Tagetes ou molécules associées ===");
  const recettesResult = await db.execute(sql`
    SELECT r.id, r.name, r.code, r.description, r.ingredients
    FROM recettes r
    WHERE r.name LIKE '%Tagetes%'
       OR r.name LIKE '%Pericón%'
       OR r.name LIKE '%Estragon%'
       OR r.ingredients LIKE '%Tagetes%'
       OR r.ingredients LIKE '%Pericón%'
       OR r.ingredients LIKE '%Anéthole%'
       OR r.ingredients LIKE '%Méthyleugénol%'
    LIMIT 20
  `);
  
  for (const rec of recettesResult[0]) {
    console.log(`ID: ${rec.id}, Code: ${rec.code}, Nom: ${rec.name}`);
    console.log(`  Description: ${rec.description?.substring(0, 100) || 'Non spécifié'}...`);
  }

  // 4. Vérifier la table de liaison molecules_recettes
  console.log("\n=== Table molecules_recettes existante ===");
  const liaisonsResult = await db.execute(sql`
    SELECT mr.molecule_id, mr.recette_id, m.name as molecule_name, r.name as recette_name
    FROM molecules_recettes mr
    JOIN molecules m ON mr.molecule_id = m.id
    JOIN recettes r ON mr.recette_id = r.id
    LIMIT 10
  `);
  
  console.log(`Nombre de liaisons existantes: ${liaisonsResult[0].length}`);
  for (const liaison of liaisonsResult[0]) {
    console.log(`  Molécule ${liaison.molecule_name} (${liaison.molecule_id}) -> Recette ${liaison.recette_name} (${liaison.recette_id})`);
  }

  // 5. Vérifier s'il existe une table plant_molecules
  console.log("\n=== Vérification table plant_molecules ===");
  try {
    const plantMolResult = await db.execute(sql`
      SELECT pm.*, p.name as plant_name, m.name as molecule_name
      FROM plant_molecules pm
      JOIN plants p ON pm.plant_id = p.id
      JOIN molecules m ON pm.molecule_id = m.id
      WHERE p.latin_name LIKE '%Tagetes%'
      LIMIT 10
    `);
    console.log(`Liaisons plant_molecules pour Tagetes: ${plantMolResult[0].length}`);
    for (const pm of plantMolResult[0]) {
      console.log(`  ${pm.plant_name} -> ${pm.molecule_name}`);
    }
  } catch (e) {
    console.log("Table plant_molecules non trouvée ou erreur:", e.message);
  }

  await connection.end();
  console.log("\n=== Analyse terminée ===\n");
}

main().catch(console.error);
