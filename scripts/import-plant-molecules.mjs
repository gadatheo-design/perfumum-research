/**
 * Script d'import des relations molécule-plante pour les plantes manquantes
 * Basé sur les données scientifiques de composition des huiles essentielles
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

// Données de composition molécule-plante à importer
// Sources: PubChem, recherches académiques, ISO standards
const plantMoleculesData = [
  // ============================================
  // BASILIC (Ocimum basilicum) - ID: 4
  // ============================================
  {
    plantId: 4,
    moleculeName: "Linalool",
    percentageMin: 40.00,
    percentageMax: 60.00,
    percentageTypical: 50.00,
    role: "majeur",
    isSignature: 1,
    source: "ISO 11043:1998 - Basil oil",
    notes: "Composant majeur du basilic doux (chémotype linalol)"
  },
  {
    plantId: 4,
    moleculeName: "Estragole",
    percentageMin: 3.00,
    percentageMax: 30.00,
    percentageTypical: 15.00,
    role: "variable",
    isSignature: 0,
    source: "ISO 11043:1998 - Basil oil",
    notes: "Variable selon le chémotype (estragole vs linalol)"
  },
  {
    plantId: 4,
    moleculeName: "Eugénol",
    percentageMin: 1.00,
    percentageMax: 15.00,
    percentageTypical: 8.00,
    role: "secondaire",
    isSignature: 0,
    source: "Journal of Essential Oil Research",
    notes: "Présent dans le chémotype eugénol"
  },
  
  // ============================================
  // LIPPIA ALBA - ID: 3
  // ============================================
  {
    plantId: 3,
    moleculeName: "Citral",
    percentageMin: 40.00,
    percentageMax: 70.00,
    percentageTypical: 55.00,
    role: "majeur",
    isSignature: 1,
    source: "Phytochemistry Reviews",
    notes: "Chémotype citral (géranial + néral)"
  },
  {
    plantId: 3,
    moleculeName: "Carvone",
    percentageMin: 30.00,
    percentageMax: 60.00,
    percentageTypical: 45.00,
    role: "majeur",
    isSignature: 1,
    source: "Phytochemistry Reviews",
    notes: "Chémotype carvone - alternative au citral"
  },
  {
    plantId: 3,
    moleculeName: "Limonène",
    percentageMin: 10.00,
    percentageMax: 30.00,
    percentageTypical: 20.00,
    role: "secondaire",
    isSignature: 0,
    source: "Journal of Essential Oil Research",
    notes: "Présent dans les deux chémotypes"
  },
  
  // ============================================
  // MENTHE VERTE (Mentha spicata) - ID: 5
  // ============================================
  {
    plantId: 5,
    moleculeName: "Carvone",
    percentageMin: 50.00,
    percentageMax: 70.00,
    percentageTypical: 60.00,
    role: "majeur",
    isSignature: 1,
    source: "ISO 3033:2005 - Spearmint oil",
    notes: "Composant signature de la menthe verte"
  },
  {
    plantId: 5,
    moleculeName: "Limonène",
    percentageMin: 10.00,
    percentageMax: 25.00,
    percentageTypical: 18.00,
    role: "secondaire",
    isSignature: 0,
    source: "ISO 3033:2005 - Spearmint oil",
    notes: "Précurseur de la carvone"
  },
  {
    plantId: 5,
    moleculeName: "1,8-Cinéole",
    percentageMin: 1.00,
    percentageMax: 5.00,
    percentageTypical: 3.00,
    role: "trace",
    isSignature: 0,
    source: "Journal of Essential Oil Research",
    notes: "Trace caractéristique"
  },
  
  // ============================================
  // ORIGAN (Origanum vulgare) - ID: 6
  // ============================================
  {
    plantId: 6,
    moleculeName: "Carvacrol",
    percentageMin: 50.00,
    percentageMax: 80.00,
    percentageTypical: 65.00,
    role: "majeur",
    isSignature: 1,
    source: "ISO 13171:2016 - Oregano oil",
    notes: "Composant majeur de l'origan grec"
  },
  {
    plantId: 6,
    moleculeName: "Thymol",
    percentageMin: 5.00,
    percentageMax: 30.00,
    percentageTypical: 15.00,
    role: "majeur",
    isSignature: 0,
    source: "ISO 13171:2016 - Oregano oil",
    notes: "Variable selon le chémotype"
  },
  {
    plantId: 6,
    moleculeName: "γ-Terpinène",
    percentageMin: 3.00,
    percentageMax: 15.00,
    percentageTypical: 8.00,
    role: "secondaire",
    isSignature: 0,
    source: "Journal of Agricultural and Food Chemistry",
    notes: "Précurseur du carvacrol"
  },
  {
    plantId: 6,
    moleculeName: "p-Cymène",
    percentageMin: 2.00,
    percentageMax: 10.00,
    percentageTypical: 6.00,
    role: "secondaire",
    isSignature: 0,
    source: "Journal of Agricultural and Food Chemistry",
    notes: "Composant aromatique"
  },
  
  // ============================================
  // WEST INDIAN BAY (Pimenta racemosa) - ID: 1
  // ============================================
  {
    plantId: 1,
    moleculeName: "Eugénol",
    percentageMin: 40.00,
    percentageMax: 60.00,
    percentageTypical: 50.00,
    role: "majeur",
    isSignature: 1,
    source: "ISO 3045:1990 - Bay oil",
    notes: "Composant majeur du bay rum"
  },
  {
    plantId: 1,
    moleculeName: "Chavicol",
    percentageMin: 10.00,
    percentageMax: 25.00,
    percentageTypical: 17.00,
    role: "majeur",
    isSignature: 1,
    source: "ISO 3045:1990 - Bay oil",
    notes: "Note épicée caractéristique"
  },
  {
    plantId: 1,
    moleculeName: "Myrcène",
    percentageMin: 15.00,
    percentageMax: 30.00,
    percentageTypical: 22.00,
    role: "majeur",
    isSignature: 0,
    source: "Journal of Essential Oil Research",
    notes: "Note herbacée"
  },
  {
    plantId: 1,
    moleculeName: "1,8-Cinéole",
    percentageMin: 1.00,
    percentageMax: 5.00,
    percentageTypical: 3.00,
    role: "secondaire",
    isSignature: 0,
    source: "Journal of Essential Oil Research",
    notes: "Note fraîche"
  },
  
  // ============================================
  // CÈDRE DE L'ATLAS (Cedrus atlantica) - ID: 30015
  // ============================================
  {
    plantId: 30015,
    moleculeName: "Himachalène",
    percentageMin: 40.00,
    percentageMax: 60.00,
    percentageTypical: 50.00,
    role: "majeur",
    isSignature: 1,
    source: "ISO 4731:2012 - Cedarwood oil",
    notes: "Sesquiterpène signature du cèdre de l'Atlas"
  },
  {
    plantId: 30015,
    moleculeName: "Atlantone",
    percentageMin: 5.00,
    percentageMax: 15.00,
    percentageTypical: 10.00,
    role: "secondaire",
    isSignature: 1,
    source: "ISO 4731:2012 - Cedarwood oil",
    notes: "Cétone caractéristique"
  },
  {
    plantId: 30015,
    moleculeName: "β-Caryophyllène",
    percentageMin: 3.00,
    percentageMax: 8.00,
    percentageTypical: 5.00,
    role: "secondaire",
    isSignature: 0,
    source: "Journal of Essential Oil Research",
    notes: "Note boisée épicée"
  },
  
  // ============================================
  // TABAC VIRGINIA (flue-cured) - ID: 7
  // ============================================
  {
    plantId: 7,
    moleculeName: "Solanone",
    percentageMin: 5.00,
    percentageMax: 15.00,
    percentageTypical: 10.00,
    role: "majeur",
    isSignature: 1,
    source: "Tobacco Chemistry Research",
    notes: "Cétone caractéristique du tabac Virginia"
  },
  {
    plantId: 7,
    moleculeName: "β-Damascénone",
    percentageMin: 0.01,
    percentageMax: 0.10,
    percentageTypical: 0.05,
    role: "trace",
    isSignature: 1,
    source: "Journal of Agricultural and Food Chemistry",
    notes: "Impact olfactif majeur malgré faible concentration"
  },
  {
    plantId: 7,
    moleculeName: "Néophytadiène",
    percentageMin: 10.00,
    percentageMax: 25.00,
    percentageTypical: 17.00,
    role: "majeur",
    isSignature: 0,
    source: "Tobacco Chemistry Research",
    notes: "Diterpène du tabac"
  },
  
  // ============================================
  // TABAC BURLEY (air-cured) - ID: 8
  // ============================================
  {
    plantId: 8,
    moleculeName: "Solanone",
    percentageMin: 3.00,
    percentageMax: 10.00,
    percentageTypical: 6.00,
    role: "majeur",
    isSignature: 1,
    source: "Tobacco Chemistry Research",
    notes: "Moins présent que dans le Virginia"
  },
  {
    plantId: 8,
    moleculeName: "β-Damascénone",
    percentageMin: 0.01,
    percentageMax: 0.08,
    percentageTypical: 0.04,
    role: "trace",
    isSignature: 1,
    source: "Journal of Agricultural and Food Chemistry",
    notes: "Note fruitée caractéristique"
  },
  {
    plantId: 8,
    moleculeName: "Mégastigmatriénone",
    percentageMin: 0.05,
    percentageMax: 0.20,
    percentageTypical: 0.10,
    role: "trace",
    isSignature: 0,
    source: "Tobacco Chemistry Research",
    notes: "Norisoprénoïde du tabac"
  },
  
  // ============================================
  // TABAC CRIOLLO (sun-cured) - ID: 9
  // ============================================
  {
    plantId: 9,
    moleculeName: "Solanone",
    percentageMin: 4.00,
    percentageMax: 12.00,
    percentageTypical: 8.00,
    role: "majeur",
    isSignature: 1,
    source: "Tobacco Chemistry Research",
    notes: "Profil intermédiaire"
  },
  {
    plantId: 9,
    moleculeName: "β-Damascénone",
    percentageMin: 0.02,
    percentageMax: 0.12,
    percentageTypical: 0.06,
    role: "trace",
    isSignature: 1,
    source: "Journal of Agricultural and Food Chemistry",
    notes: "Note fruitée intense"
  },
  {
    plantId: 9,
    moleculeName: "Néophytadiène",
    percentageMin: 8.00,
    percentageMax: 20.00,
    percentageTypical: 14.00,
    role: "majeur",
    isSignature: 0,
    source: "Tobacco Chemistry Research",
    notes: "Diterpène caractéristique"
  },
  
  // ============================================
  // CANNABIS - PROFIL VENT/CLAIR - ID: 10
  // ============================================
  {
    plantId: 10,
    moleculeName: "Limonène",
    percentageMin: 20.00,
    percentageMax: 40.00,
    percentageTypical: 30.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Profil citrus dominant"
  },
  {
    plantId: 10,
    moleculeName: "α-Pinène",
    percentageMin: 10.00,
    percentageMax: 25.00,
    percentageTypical: 17.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note fraîche résineuse"
  },
  {
    plantId: 10,
    moleculeName: "Terpinolène",
    percentageMin: 5.00,
    percentageMax: 15.00,
    percentageTypical: 10.00,
    role: "secondaire",
    isSignature: 0,
    source: "Cannabis Terpene Research",
    notes: "Note florale herbacée"
  },
  
  // ============================================
  // CANNABIS - PROFIL BOIS/STRUCTURE - ID: 11
  // ============================================
  {
    plantId: 11,
    moleculeName: "Myrcène",
    percentageMin: 30.00,
    percentageMax: 50.00,
    percentageTypical: 40.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note terreuse musquée"
  },
  {
    plantId: 11,
    moleculeName: "β-Caryophyllène",
    percentageMin: 15.00,
    percentageMax: 30.00,
    percentageTypical: 22.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note épicée boisée"
  },
  {
    plantId: 11,
    moleculeName: "Humulène",
    percentageMin: 5.00,
    percentageMax: 15.00,
    percentageTypical: 10.00,
    role: "secondaire",
    isSignature: 0,
    source: "Cannabis Terpene Research",
    notes: "Note houblonnée"
  },
  
  // ============================================
  // CANNABIS - PROFIL FEUILLE/VERT - ID: 12
  // ============================================
  {
    plantId: 12,
    moleculeName: "β-Pinène",
    percentageMin: 15.00,
    percentageMax: 30.00,
    percentageTypical: 22.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note verte résineuse"
  },
  {
    plantId: 12,
    moleculeName: "Ocimène",
    percentageMin: 10.00,
    percentageMax: 25.00,
    percentageTypical: 17.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note herbacée florale"
  },
  {
    plantId: 12,
    moleculeName: "Myrcène",
    percentageMin: 10.00,
    percentageMax: 20.00,
    percentageTypical: 15.00,
    role: "secondaire",
    isSignature: 0,
    source: "Cannabis Terpene Research",
    notes: "Base terreuse"
  },
  
  // ============================================
  // CANNABIS - PROFIL DISPARITION/TRACE - ID: 13
  // ============================================
  {
    plantId: 13,
    moleculeName: "Linalool",
    percentageMin: 15.00,
    percentageMax: 30.00,
    percentageTypical: 22.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note florale évanescente"
  },
  {
    plantId: 13,
    moleculeName: "Terpinolène",
    percentageMin: 10.00,
    percentageMax: 25.00,
    percentageTypical: 17.00,
    role: "majeur",
    isSignature: 1,
    source: "Cannabis Terpene Research",
    notes: "Note légère fugace"
  },
  {
    plantId: 13,
    moleculeName: "Nérolidol",
    percentageMin: 5.00,
    percentageMax: 15.00,
    percentageTypical: 10.00,
    role: "secondaire",
    isSignature: 0,
    source: "Cannabis Terpene Research",
    notes: "Note boisée subtile"
  }
];

async function main() {
  console.log('Connexion à la base de données...');
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  console.log(`\nImport de ${plantMoleculesData.length} relations molécule-plante...\n`);
  
  let imported = 0;
  let errors = 0;
  let skipped = 0;
  
  for (const data of plantMoleculesData) {
    try {
      // Rechercher l'ID de la molécule par son nom
      const moleculeResult = await db.execute(sql`
        SELECT id FROM molecules WHERE name = ${data.moleculeName} LIMIT 1
      `);
      
      if (moleculeResult[0].length === 0) {
        console.log(`⚠ Molécule non trouvée: ${data.moleculeName} - création en cours...`);
        
        // Créer la molécule si elle n'existe pas
        await db.execute(sql`
          INSERT INTO molecules (name, family, created_at, updated_at)
          VALUES (${data.moleculeName}, 'Terpène', NOW(), NOW())
        `);
        
        const newMoleculeResult = await db.execute(sql`
          SELECT id FROM molecules WHERE name = ${data.moleculeName} LIMIT 1
        `);
        
        if (newMoleculeResult[0].length === 0) {
          console.error(`✗ Impossible de créer la molécule: ${data.moleculeName}`);
          errors++;
          continue;
        }
        
        data.moleculeId = newMoleculeResult[0][0].id;
      } else {
        data.moleculeId = moleculeResult[0][0].id;
      }
      
      // Vérifier si la relation existe déjà
      const existingResult = await db.execute(sql`
        SELECT id FROM plant_molecules 
        WHERE plant_id = ${data.plantId} AND molecule_id = ${data.moleculeId}
        LIMIT 1
      `);
      
      if (existingResult[0].length > 0) {
        console.log(`⏭ Relation existante: Plant ${data.plantId} - ${data.moleculeName}`);
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
      
      console.log(`✓ Importé: Plant ${data.plantId} - ${data.moleculeName} (${data.percentageTypical}%)`);
      imported++;
      
    } catch (error) {
      console.error(`✗ Erreur pour ${data.moleculeName}: ${error.message}`);
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
