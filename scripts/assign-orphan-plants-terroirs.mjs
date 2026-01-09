/**
 * Script pour associer les 29 plantes orphelines aux terroirs appropriés
 * basé sur leur origine géographique
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

// Mapping des plantes orphelines vers les terroirs appropriés
// Basé sur l'analyse de l'origine de chaque plante
const plantTerroirMappings = [
  // Cannabis varieties - par origine géographique
  { plantId: 120009, terroirId: 210002, notes: "Acapulco Gold - Mexique, associé au Hindu Kush pour les variétés landrace" },
  { plantId: 120010, terroirId: 90001, notes: "Colombian Gold - Colombie, Amazonie" },
  { plantId: 120012, terroirId: 210002, notes: "Hindu Kush - Afghanistan/Pakistan" },
  { plantId: 120013, terroirId: 210005, notes: "Malawi Gold - Afrique de l'Est" },
  { plantId: 120022, terroirId: 210003, notes: "Maui Wowie - Hawaii" },
  { plantId: 120018, terroirId: 180001, notes: "Panama Red - Mésoamérique" },
  { plantId: 120014, terroirId: 210005, notes: "Swazi Gold - Eswatini, Afrique de l'Est" },
  
  // Tabacs orientaux et spéciaux
  { plantId: 150002, terroirId: 30009, notes: "Latakia - Syrie/Chypre, proche Turquie (Isparta)" },
  { plantId: 150004, terroirId: 30009, notes: "Oriental Katerini - Grèce, proche Turquie" },
  { plantId: 150005, terroirId: 30009, notes: "Yenidje - Grèce/Thrace, proche Turquie" },
  { plantId: 150001, terroirId: 180001, notes: "Perique - Louisiane, Mésoamérique élargie" },
  
  // Nicotiana sauvages
  { plantId: 330002, terroirId: 2, notes: "Tabac cultivé - Andes, Santander & Huila" },
  { plantId: 330003, terroirId: 210007, notes: "N. benthamiana - Australie, associé Afrique Centrale (climat similaire)" },
  { plantId: 330005, terroirId: 2, notes: "N. sylvestris - Andes argentines" },
  { plantId: 330006, terroirId: 2, notes: "N. tomentosiformis - Bolivie/Argentine, Andes" },
  
  // Plantes aromatiques africaines
  { plantId: 150016, terroirId: 210005, notes: "Kanna - Afrique du Sud" },
  { plantId: 150018, terroirId: 210005, notes: "Klip Dagga - Afrique tropicale" },
  { plantId: 150014, terroirId: 210005, notes: "Wild Dagga - Afrique du Sud" },
  { plantId: 150017, terroirId: 180001, notes: "Passiflore - Amérique centrale" },
  
  // Résines et bois
  { plantId: 270008, terroirId: 210006, notes: "Silphium (Ferula) - Cyrénaïque/Libye" },
  { plantId: 210026, terroirId: 210006, notes: "Silphium disparu - Afrique du Nord antique" },
  { plantId: 270012, terroirId: 30007, notes: "Élémi - Philippines, proche Sumatra" },
  { plantId: 210004, terroirId: 180001, notes: "Palo santo - Équateur, Mésoamérique" },
  { plantId: 390003, terroirId: 30001, notes: "Pin sylvestre - Europe du Nord, proche Bulgarie" },
  
  // Agrumes
  { plantId: 420002, terroirId: 30002, notes: "Orange amère - Méditerranée, Calabre" },
  
  // Plantes de test - à supprimer ou associer au terroir Global
  { plantId: 210031, terroirId: 60007, notes: "Test Plant 1 - Global (test)" },
  { plantId: 210032, terroirId: 60007, notes: "Test Resin Plant - Global (test)" },
  { plantId: 210033, terroirId: 60007, notes: "Test Wind Plant - Global (test)" },
  
  // Iboga - Afrique Centrale
  { plantId: 150015, terroirId: 210007, notes: "Iboga - Gabon, Afrique Centrale" },
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log('\n=== ASSOCIATION DES PLANTES ORPHELINES AUX TERROIRS ===\n');

  let successCount = 0;
  let errorCount = 0;

  for (const mapping of plantTerroirMappings) {
    try {
      // Vérifier si la liaison existe déjà
      const existing = await db.execute(sql`
        SELECT id FROM plant_terroirs 
        WHERE plant_id = ${mapping.plantId} AND terroir_id = ${mapping.terroirId}
      `);

      if (existing[0].length > 0) {
        console.log(`⏭️  Liaison déjà existante: Plant ${mapping.plantId} → Terroir ${mapping.terroirId}`);
        continue;
      }

      // Créer la liaison
      await db.execute(sql`
        INSERT INTO plant_terroirs (plant_id, terroir_id, notes, created_at)
        VALUES (${mapping.plantId}, ${mapping.terroirId}, ${mapping.notes}, NOW())
      `);

      // Récupérer les noms pour le log
      const plantInfo = await db.execute(sql`SELECT name FROM plants WHERE id = ${mapping.plantId}`);
      const terroirInfo = await db.execute(sql`SELECT name FROM terroirs WHERE id = ${mapping.terroirId}`);

      const plantName = plantInfo[0][0]?.name || `ID ${mapping.plantId}`;
      const terroirName = terroirInfo[0][0]?.name || `ID ${mapping.terroirId}`;

      console.log(`✅ ${plantName} → ${terroirName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour Plant ${mapping.plantId} → Terroir ${mapping.terroirId}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Liaisons créées: ${successCount}`);
  console.log(`Erreurs: ${errorCount}`);

  // Vérifier le nombre de plantes orphelines restantes
  const remainingOrphans = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM plants p
    LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
    WHERE pt.id IS NULL
  `);

  console.log(`Plantes orphelines restantes: ${remainingOrphans[0][0].count}`);

  await connection.end();
}

main().catch(console.error);
