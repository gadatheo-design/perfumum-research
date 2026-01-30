import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { sql } from "drizzle-orm";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("\n=== Complétion des liaisons Tagetes lucida - Molécules ===\n");

  // Tagetes lucida (Pericón) ID
  const tagetesId = 300001;

  // Molécules à lier (basé sur dominant_molecules de Tagetes lucida)
  // ["Estragole","Anéthole","Méthyleugénol","β-Ocimène","(Z)-Tagétone"]
  const moleculesToLink = [
    { name: "Estragole", id: 630002 },
    { name: "Anéthole", id: 870001 },
  ];

  // 1. Vérifier les liaisons existantes
  console.log("=== Liaisons existantes ===");
  const existingLinks = await db.execute(sql`
    SELECT pm.plant_id, pm.molecule_id, m.name as molecule_name
    FROM plant_molecules pm
    JOIN molecules m ON pm.molecule_id = m.id
    WHERE pm.plant_id = ${tagetesId}
  `);
  
  console.log(`Liaisons actuelles pour Tagetes lucida (ID ${tagetesId}):`);
  const existingMoleculeIds = new Set();
  for (const link of existingLinks[0]) {
    console.log(`  -> ${link.molecule_name} (ID: ${link.molecule_id})`);
    existingMoleculeIds.add(link.molecule_id);
  }

  // 2. Rechercher Méthyleugénol dans la base
  console.log("\n=== Recherche de Méthyleugénol ===");
  const methyleugenolSearch = await db.execute(sql`
    SELECT id, name, cas_number FROM molecules 
    WHERE name LIKE '%Méthyleugénol%' 
       OR name LIKE '%Methyleugenol%'
       OR name LIKE '%methyl eugenol%'
       OR cas_number = '93-15-2'
  `);
  
  if (methyleugenolSearch[0].length > 0) {
    console.log("Méthyleugénol trouvé:");
    for (const mol of methyleugenolSearch[0]) {
      console.log(`  ID: ${mol.id}, Nom: ${mol.name}, CAS: ${mol.cas_number}`);
      moleculesToLink.push({ name: mol.name, id: mol.id });
    }
  } else {
    console.log("Méthyleugénol non trouvé dans la base - création nécessaire");
    // Créer la molécule Méthyleugénol
    const insertResult = await db.execute(sql`
      INSERT INTO molecules (name, cas_number, molecular_formula, molecular_weight, description, olfactive_family)
      VALUES ('Méthyleugénol', '93-15-2', 'C11H14O2', 178.23, 
        'Composé aromatique présent dans Tagetes lucida (Pericón). Odeur épicée, clou de girofle, anisée.',
        'Phénylpropanoïdes')
    `);
    const newId = insertResult[0].insertId;
    console.log(`Méthyleugénol créé avec ID: ${newId}`);
    moleculesToLink.push({ name: "Méthyleugénol", id: newId });
  }

  // 3. Ajouter les liaisons manquantes
  console.log("\n=== Ajout des liaisons manquantes ===");
  for (const mol of moleculesToLink) {
    if (!existingMoleculeIds.has(mol.id)) {
      try {
        await db.execute(sql`
          INSERT INTO plant_molecules (plant_id, molecule_id, percentage, is_dominant, notes)
          VALUES (${tagetesId}, ${mol.id}, NULL, true, 'Molécule dominante de Tagetes lucida (Pericón)')
        `);
        console.log(`✓ Liaison créée: Tagetes lucida -> ${mol.name} (ID: ${mol.id})`);
      } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
          console.log(`  Liaison déjà existante: Tagetes lucida -> ${mol.name}`);
        } else {
          console.error(`✗ Erreur pour ${mol.name}:`, e.message);
        }
      }
    } else {
      console.log(`  Liaison déjà existante: Tagetes lucida -> ${mol.name}`);
    }
  }

  // 4. Vérifier les liaisons finales
  console.log("\n=== Liaisons finales ===");
  const finalLinks = await db.execute(sql`
    SELECT pm.plant_id, pm.molecule_id, pm.is_dominant, m.name as molecule_name
    FROM plant_molecules pm
    JOIN molecules m ON pm.molecule_id = m.id
    WHERE pm.plant_id = ${tagetesId}
  `);
  
  console.log(`Total des liaisons pour Tagetes lucida:`);
  for (const link of finalLinks[0]) {
    console.log(`  -> ${link.molecule_name} (ID: ${link.molecule_id}, dominant: ${link.is_dominant})`);
  }

  // 5. Vérifier les recettes qui utilisent ces molécules
  console.log("\n=== Recettes utilisant ces molécules ===");
  const moleculeIds = moleculesToLink.map(m => m.id);
  const recettesWithMolecules = await db.execute(sql`
    SELECT DISTINCT r.id, r.name, m.name as molecule_name
    FROM recettes r
    JOIN molecules_recettes mr ON r.id = mr.recette_id
    JOIN molecules m ON mr.molecule_id = m.id
    WHERE mr.molecule_id IN (${sql.join(moleculeIds.map(id => sql`${id}`), sql`, `)})
    LIMIT 20
  `);
  
  if (recettesWithMolecules[0].length > 0) {
    console.log("Recettes trouvées:");
    for (const rec of recettesWithMolecules[0]) {
      console.log(`  ${rec.name} (ID: ${rec.id}) - via ${rec.molecule_name}`);
    }
  } else {
    console.log("Aucune recette n'utilise encore ces molécules directement.");
    console.log("Les liaisons plant_molecules permettent de tracer la provenance botanique.");
  }

  await connection.end();
  console.log("\n=== Opération terminée ===\n");
}

main().catch(console.error);
