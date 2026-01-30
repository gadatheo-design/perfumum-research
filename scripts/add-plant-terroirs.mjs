/**
 * Script pour implémenter les connexions plantes-terroirs manquantes
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Associations plantes-terroirs basées sur les origines connues
const PLANT_TERROIR_ASSOCIATIONS = [
  // Afghanistan / Pakistan - Hindu Kush
  { plantPattern: "Afghan Kush", terroirPattern: "Hindu Kush", notes: "Variété native de la région Hindu Kush" },
  { plantPattern: "Hindu Kush", terroirPattern: "Hindu Kush", notes: "Variété emblématique de la chaîne Hindu Kush" },
  { plantPattern: "Mazar-i-Sharif", terroirPattern: "Hindu Kush", notes: "Variété du nord de l'Afghanistan" },
  { plantPattern: "Kandahar", terroirPattern: "Hindu Kush", notes: "Variété du sud de l'Afghanistan" },
  { plantPattern: "Chitral", terroirPattern: "Hindu Kush", notes: "Variété du Pakistan (KPK)" },
  
  // Asie du Sud-Est
  { plantPattern: "Anis étoilé", terroirPattern: "Vietnam", notes: "Originaire du sud de la Chine et nord du Vietnam" },
  { plantPattern: "Aquilaria", terroirPattern: "Sumatra", notes: "Bois d'agar de Malaisie/Indonésie" },
  { plantPattern: "Gingembre", terroirPattern: "Karnataka", notes: "Cultivé en Asie du Sud-Est" },
  
  // Méditerranée
  { plantPattern: "Bigaradier", terroirPattern: "Grasse", notes: "Naturalisé en Méditerranée" },
  { plantPattern: "Camomille romaine", terroirPattern: "Grasse", notes: "Europe occidentale" },
  { plantPattern: "Coriandre", terroirPattern: "Fès-Meknès", notes: "Méditerranée orientale" },
  { plantPattern: "Cumin", terroirPattern: "Fès-Meknès", notes: "Moyen-Orient" },
  
  // Europe centrale
  { plantPattern: "Camomille allemande", terroirPattern: "Bulgarie", notes: "Europe, Asie occidentale" },
  { plantPattern: "Carvi", terroirPattern: "Valensole", notes: "Europe centrale et du Nord" },
  
  // Afrique
  { plantPattern: "Durban Poison", terroirPattern: "Afrique", notes: "Variété sud-africaine" },
  { plantPattern: "Kilimanjaro", terroirPattern: "Afrique", notes: "Variété tanzanienne" },
  { plantPattern: "Malawi Gold", terroirPattern: "Afrique", notes: "Variété du Malawi" },
  { plantPattern: "Kanna", terroirPattern: "Afrique", notes: "Afrique du Sud (Cap)" },
  { plantPattern: "Klip Dagga", terroirPattern: "Afrique", notes: "Afrique tropicale" },
  
  // Moyen-Orient
  { plantPattern: "Encens d'Oman", terroirPattern: "Bosaso", notes: "Oman - Dhofar" },
  { plantPattern: "Galbanum", terroirPattern: "Iran", notes: "Iran, Afghanistan, Turkménistan" },
  { plantPattern: "Latakia", terroirPattern: "Syrie", notes: "Syrie (Lattaquié) / Chypre" },
  
  // Amériques
  { plantPattern: "Hawaiian", terroirPattern: "Hawaii", notes: "Variété hawaïenne" },
  { plantPattern: "Maui Wowie", terroirPattern: "Hawaii", notes: "Variété de Maui, Hawaï" },
  { plantPattern: "Lamb's Bread", terroirPattern: "Caribbean", notes: "Variété jamaïcaine" },
  
  // Cannabis - Asie centrale
  { plantPattern: "Cannabis", terroirPattern: "Hindu Kush", notes: "Origine: Asie centrale (Hindu Kush, Himalaya)" },
  
  // Armoise
  { plantPattern: "Armoise", terroirPattern: "Valensole", notes: "Hémisphère Nord (Europe, Asie, Amérique)" },
  
  // Calamus
  { plantPattern: "Calamus", terroirPattern: "Karnataka", notes: "Asie, Europe, Amérique du Nord" }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== ASSOCIATION DES PLANTES AUX TERROIRS ===\n');
  
  // D'abord, récupérer tous les terroirs disponibles
  const [terroirs] = await connection.query(`SELECT id, terroir_id, name, country FROM terroirs`);
  console.log(`Terroirs disponibles: ${terroirs.length}`);
  
  let created = 0;
  let skipped = 0;
  let notFound = 0;
  
  for (const assoc of PLANT_TERROIR_ASSOCIATIONS) {
    // Chercher la plante
    const [plants] = await connection.query(
      `SELECT id, name, origin FROM plants WHERE name LIKE ?`,
      [`%${assoc.plantPattern}%`]
    );
    
    if (plants.length === 0) {
      console.log(`  ⚠️ Plante non trouvée: ${assoc.plantPattern}`);
      notFound++;
      continue;
    }
    
    // Chercher le terroir
    const [matchingTerroirs] = await connection.query(
      `SELECT id, name FROM terroirs WHERE name LIKE ? OR country LIKE ? OR terroir_id LIKE ?`,
      [`%${assoc.terroirPattern}%`, `%${assoc.terroirPattern}%`, `%${assoc.terroirPattern}%`]
    );
    
    if (matchingTerroirs.length === 0) {
      console.log(`  ⚠️ Terroir non trouvé: ${assoc.terroirPattern}`);
      notFound++;
      continue;
    }
    
    const plant = plants[0];
    const terroir = matchingTerroirs[0];
    
    // Vérifier si l'association existe déjà
    const [existing] = await connection.query(
      `SELECT * FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?`,
      [plant.id, terroir.id]
    );
    
    if (existing.length > 0) {
      console.log(`  - Existant: ${plant.name} → ${terroir.name}`);
      skipped++;
      continue;
    }
    
    // Créer l'association
    await connection.query(
      `INSERT INTO plant_terroirs (plant_id, terroir_id, quality_notes, notes, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [plant.id, terroir.id, 'Qualité typique de la région', assoc.notes]
    );
    console.log(`  + Créé: ${plant.name} → ${terroir.name}`);
    created++;
  }
  
  // Maintenant, essayer d'associer automatiquement les plantes orphelines basé sur leur origine
  console.log('\n=== ASSOCIATION AUTOMATIQUE BASÉE SUR L\'ORIGINE ===\n');
  
  const [orphanPlants] = await connection.query(`
    SELECT p.id, p.name, p.origin
    FROM plants p
    LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
    WHERE pt.plant_id IS NULL AND p.origin IS NOT NULL AND p.origin != ''
  `);
  
  console.log(`Plantes orphelines avec origine: ${orphanPlants.length}`);
  
  for (const plant of orphanPlants) {
    if (!plant.origin) continue;
    
    // Chercher un terroir correspondant à l'origine
    const originLower = plant.origin.toLowerCase();
    
    let matchedTerroir = null;
    
    // Mappings d'origine vers terroir
    const originMappings = [
      { pattern: /france|provence|grasse/i, terroirPattern: 'Grasse' },
      { pattern: /italie|calabre|sicile/i, terroirPattern: 'Calabre' },
      { pattern: /maroc|fès|meknès/i, terroirPattern: 'Fès-Meknès' },
      { pattern: /inde|karnataka|tamil/i, terroirPattern: 'Karnataka' },
      { pattern: /indonésie|sumatra|java/i, terroirPattern: 'Sumatra' },
      { pattern: /madagascar|nossi/i, terroirPattern: 'Nossi-Bé' },
      { pattern: /bulgarie|kazanlak/i, terroirPattern: 'Kazanlak' },
      { pattern: /turquie|isparta/i, terroirPattern: 'Isparta' },
      { pattern: /égypte|louxor/i, terroirPattern: 'Haute-Égypte' },
      { pattern: /somalie|bosaso/i, terroirPattern: 'Bosaso' },
      { pattern: /colombie/i, terroirPattern: 'Colombia' },
      { pattern: /mexique|oaxaca/i, terroirPattern: 'Mésoamérique' },
      { pattern: /haïti/i, terroirPattern: 'Plaine des Cayes' },
      { pattern: /réunion|cilaos/i, terroirPattern: 'Cilaos' },
      { pattern: /comores|anjouan/i, terroirPattern: 'Anjouan' },
      { pattern: /sri lanka|ceylan|kandy/i, terroirPattern: 'Kandy' },
      { pattern: /croatie|dalmatie/i, terroirPattern: 'Dalmate' },
      { pattern: /albanie/i, terroirPattern: 'Albanaise' },
      { pattern: /monténégro/i, terroirPattern: 'Monténégrin' },
      { pattern: /corse/i, terroirPattern: 'Corse' },
      { pattern: /sardaigne/i, terroirPattern: 'Sarda' }
    ];
    
    for (const mapping of originMappings) {
      if (mapping.pattern.test(plant.origin)) {
        const [terroirs] = await connection.query(
          `SELECT id, name FROM terroirs WHERE name LIKE ?`,
          [`%${mapping.terroirPattern}%`]
        );
        if (terroirs.length > 0) {
          matchedTerroir = terroirs[0];
          break;
        }
      }
    }
    
    if (matchedTerroir) {
      // Vérifier si l'association existe déjà
      const [existing] = await connection.query(
        `SELECT * FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?`,
        [plant.id, matchedTerroir.id]
      );
      
      if (existing.length === 0) {
        await connection.query(
          `INSERT INTO plant_terroirs (plant_id, terroir_id, quality_notes, notes, created_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [plant.id, matchedTerroir.id, 'Association automatique basée sur l\'origine', `Origine: ${plant.origin}`]
        );
        console.log(`  + Auto: ${plant.name} → ${matchedTerroir.name} (origine: ${plant.origin})`);
        created++;
      }
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Associations créées: ${created}`);
  console.log(`Associations existantes: ${skipped}`);
  console.log(`Non trouvées: ${notFound}`);
  
  await connection.end();
}

main().catch(console.error);
