/**
 * Script d'import des relations molécule-plante - Version 2
 * Utilise les IDs de molécules existantes
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('Connexion à la base de données...');
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // D'abord, lister les molécules disponibles
  console.log('\n=== Molécules disponibles ===');
  const molecules = await db.execute(sql`
    SELECT id, name FROM molecules ORDER BY name LIMIT 100
  `);
  
  // Créer un mapping des noms de molécules vers leurs IDs
  const moleculeMap = {};
  for (const mol of molecules[0]) {
    moleculeMap[mol.name.toLowerCase()] = mol.id;
  }
  
  console.log(`${molecules[0].length} molécules trouvées`);
  
  // Données de composition à importer avec les IDs de molécules existantes
  const plantMoleculesData = [
    // BASILIC (ID: 4)
    { plantId: 4, moleculeId: 30009, percentageMin: 40, percentageMax: 60, percentageTypical: 50, role: "majeur", isSignature: 1, source: "ISO 11043:1998", notes: "Linalool - composant majeur du basilic doux" },
    
    // LIPPIA ALBA (ID: 3)
    { plantId: 3, moleculeId: 30007, percentageMin: 10, percentageMax: 30, percentageTypical: 20, role: "secondaire", isSignature: 0, source: "Phytochemistry Reviews", notes: "Limonène - présent dans les deux chémotypes" },
    
    // MENTHE VERTE (ID: 5)
    { plantId: 5, moleculeId: 30007, percentageMin: 10, percentageMax: 25, percentageTypical: 18, role: "secondaire", isSignature: 0, source: "ISO 3033:2005", notes: "Limonène - précurseur de la carvone" },
    
    // ORIGAN (ID: 6)
    { plantId: 6, moleculeId: 30007, percentageMin: 2, percentageMax: 8, percentageTypical: 5, role: "secondaire", isSignature: 0, source: "ISO 13171:2016", notes: "Limonène - composant mineur" },
    
    // WEST INDIAN BAY (ID: 1)
    { plantId: 1, moleculeId: 30006, percentageMin: 15, percentageMax: 30, percentageTypical: 22, role: "majeur", isSignature: 0, source: "ISO 3045:1990", notes: "Myrcène - note herbacée" },
    
    // CÈDRE DE L'ATLAS (ID: 30015)
    { plantId: 30015, moleculeId: 150005, percentageMin: 3, percentageMax: 8, percentageTypical: 5, role: "secondaire", isSignature: 0, source: "ISO 4731:2012", notes: "β-Caryophyllène - note boisée épicée" },
    
    // TABAC VIRGINIA (ID: 7)
    { plantId: 7, moleculeId: 30007, percentageMin: 1, percentageMax: 5, percentageTypical: 3, role: "trace", isSignature: 0, source: "Tobacco Chemistry Research", notes: "Limonène - trace aromatique" },
    
    // TABAC BURLEY (ID: 8)
    { plantId: 8, moleculeId: 30007, percentageMin: 0.5, percentageMax: 3, percentageTypical: 1.5, role: "trace", isSignature: 0, source: "Tobacco Chemistry Research", notes: "Limonène - trace aromatique" },
    
    // TABAC CRIOLLO (ID: 9)
    { plantId: 9, moleculeId: 30007, percentageMin: 1, percentageMax: 4, percentageTypical: 2.5, role: "trace", isSignature: 0, source: "Tobacco Chemistry Research", notes: "Limonène - trace aromatique" },
    
    // CANNABIS VENT/CLAIR (ID: 10)
    { plantId: 10, moleculeId: 30007, percentageMin: 20, percentageMax: 40, percentageTypical: 30, role: "majeur", isSignature: 1, source: "Cannabis Terpene Research", notes: "Limonène - profil citrus dominant" },
    { plantId: 10, moleculeId: 150003, percentageMin: 10, percentageMax: 25, percentageTypical: 17, role: "majeur", isSignature: 1, source: "Cannabis Terpene Research", notes: "α-Pinène - note fraîche résineuse" },
    
    // CANNABIS BOIS/STRUCTURE (ID: 11)
    { plantId: 11, moleculeId: 30006, percentageMin: 30, percentageMax: 50, percentageTypical: 40, role: "majeur", isSignature: 1, source: "Cannabis Terpene Research", notes: "Myrcène - note terreuse musquée" },
    { plantId: 11, moleculeId: 150005, percentageMin: 15, percentageMax: 30, percentageTypical: 22, role: "majeur", isSignature: 1, source: "Cannabis Terpene Research", notes: "β-Caryophyllène - note épicée boisée" },
    { plantId: 11, moleculeId: 90048, percentageMin: 5, percentageMax: 15, percentageTypical: 10, role: "secondaire", isSignature: 0, source: "Cannabis Terpene Research", notes: "Humulène - note houblonnée" },
    
    // CANNABIS FEUILLE/VERT (ID: 12)
    { plantId: 12, moleculeId: 150004, percentageMin: 15, percentageMax: 30, percentageTypical: 22, role: "majeur", isSignature: 1, source: "Cannabis Terpene Research", notes: "β-Pinène - note verte résineuse" },
    { plantId: 12, moleculeId: 30006, percentageMin: 10, percentageMax: 20, percentageTypical: 15, role: "secondaire", isSignature: 0, source: "Cannabis Terpene Research", notes: "Myrcène - base terreuse" },
    
    // CANNABIS DISPARITION/TRACE (ID: 13)
    { plantId: 13, moleculeId: 30009, percentageMin: 15, percentageMax: 30, percentageTypical: 22, role: "majeur", isSignature: 1, source: "Cannabis Terpene Research", notes: "Linalool - note florale évanescente" }
  ];
  
  console.log(`\nImport de ${plantMoleculesData.length} relations molécule-plante...\n`);
  
  let imported = 0;
  let errors = 0;
  let skipped = 0;
  
  for (const data of plantMoleculesData) {
    try {
      // Vérifier si la relation existe déjà
      const existingResult = await db.execute(sql`
        SELECT plant_id FROM plant_molecules 
        WHERE plant_id = ${data.plantId} AND molecule_id = ${data.moleculeId}
        LIMIT 1
      `);
      
      if (existingResult[0].length > 0) {
        console.log(`⏭ Relation existante: Plant ${data.plantId} - Molecule ${data.moleculeId}`);
        skipped++;
        continue;
      }
      
      // Insérer la relation
      await db.execute(sql`
        INSERT INTO plant_molecules (
          plant_id, molecule_id, 
          percentage_min, percentage_max, percentage_typical,
          role, is_signature, source, notes,
          created_at, updated_at
        ) VALUES (
          ${data.plantId}, ${data.moleculeId},
          ${data.percentageMin}, ${data.percentageMax}, ${data.percentageTypical},
          ${data.role}, ${data.isSignature}, ${data.source}, ${data.notes},
          NOW(), NOW()
        )
      `);
      
      console.log(`✓ Importé: Plant ${data.plantId} - Molecule ${data.moleculeId} (${data.percentageTypical}%)`);
      imported++;
      
    } catch (error) {
      console.error(`✗ Erreur pour Plant ${data.plantId} - Molecule ${data.moleculeId}: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Relations importées: ${imported}`);
  console.log(`Relations existantes (ignorées): ${skipped}`);
  console.log(`Erreurs: ${errors}`);
  
  // Vérification finale
  console.log('\n=== VÉRIFICATION ===');
  const finalCount = await db.execute(sql`SELECT COUNT(*) as total FROM plant_molecules`);
  console.log(`Total relations dans la base: ${finalCount[0][0].total}`);
  
  // Lister les plantes encore sans relations
  const remainingPlants = await db.execute(sql`
    SELECT p.id, p.name 
    FROM plants p 
    WHERE p.id NOT IN (SELECT DISTINCT plant_id FROM plant_molecules) 
    ORDER BY p.name
  `);
  
  if (remainingPlants[0].length > 0) {
    console.log('\nPlantes encore sans relations:');
    console.table(remainingPlants[0]);
  } else {
    console.log('\n✓ Toutes les plantes ont maintenant des relations molécule-plante!');
  }
  
  await connection.end();
}

main().catch(console.error);
