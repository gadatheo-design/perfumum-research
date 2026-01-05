/**
 * PERFUMUM - Import des terroirs supplémentaires
 * Version corrigée avec les bonnes colonnes
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Terroirs supplémentaires avec les bonnes colonnes
const additionalTerroirs = [
  {
    terroirId: 'TER-BUL-KAZ',
    name: 'Vallée des Roses de Kazanlak',
    country: 'Bulgarie',
    region: 'Vallée des Roses',
    latitude: 42.6194,
    longitude: 25.3930,
    altitude: '400-600m',
    climateType: 'continental',
    soilType: 'clay',
    annualRainfall: '600-700mm',
    reputation: 'Terroir historique de la rose de Damas, protégé par les montagnes des Balkans. 70% de la production mondiale de rose.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['AOC Rosa Damascena']),
    mainCrops: JSON.stringify(['Rosa damascena', 'Lavande'])
  },
  {
    terroirId: 'TER-ITA-CAL',
    name: 'Calabre',
    country: 'Italie',
    region: 'Calabre',
    latitude: 38.9,
    longitude: 16.6,
    altitude: '0-200m',
    climateType: 'mediterranean',
    soilType: 'clay',
    annualRainfall: '500-600mm',
    reputation: 'Terroir de la bergamote, 95% de la production mondiale. Climat méditerranéen idéal pour les agrumes.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['DOP Bergamotto di Reggio Calabria']),
    mainCrops: JSON.stringify(['Bergamote', 'Citron', 'Orange'])
  },
  {
    terroirId: 'TER-HAI-VET',
    name: 'Plaine des Cayes',
    country: 'Haïti',
    region: 'Sud',
    latitude: 18.2,
    longitude: -73.75,
    altitude: '0-100m',
    climateType: 'tropical',
    soilType: 'alluvial',
    annualRainfall: '1200-1500mm',
    reputation: 'Terroir du vétiver haïtien, qualité référence mondiale avec notes fumées caractéristiques.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['Vétiver d\'Haïti']),
    mainCrops: JSON.stringify(['Vétiver'])
  },
  {
    terroirId: 'TER-MAR-FES',
    name: 'Région de Fès-Meknès',
    country: 'Maroc',
    region: 'Fès-Meknès',
    latitude: 34.0,
    longitude: -5.0,
    altitude: '400-600m',
    climateType: 'mediterranean',
    soilType: 'clay',
    annualRainfall: '400-500mm',
    reputation: 'Terroir de la rose de Damas marocaine (Kelaat M\'Gouna) et du cèdre de l\'Atlas.',
    qualityRating: 'excellent',
    certifications: JSON.stringify(['IGP Rose du Maroc']),
    mainCrops: JSON.stringify(['Rose de Damas', 'Cèdre de l\'Atlas'])
  },
  {
    terroirId: 'TER-BUR-OUA',
    name: 'Région de Ouagadougou',
    country: 'Burkina Faso',
    region: 'Centre',
    latitude: 12.37,
    longitude: -1.52,
    altitude: '300-400m',
    climateType: 'arid',
    soilType: 'sandy',
    annualRainfall: '800-900mm',
    reputation: 'Terroir sahélien, culture du karité et résines africaines. Axe de recherche PERFUMUM.',
    qualityRating: 'good',
    certifications: JSON.stringify(['Commerce équitable']),
    mainCrops: JSON.stringify(['Karité', 'Résines locales'])
  },
  {
    terroirId: 'TER-EGY-LUX',
    name: 'Haute-Égypte',
    country: 'Égypte',
    region: 'Louxor-Assouan',
    latitude: 25.69,
    longitude: 32.64,
    altitude: '70-100m',
    climateType: 'arid',
    soilType: 'alluvial',
    annualRainfall: '0-5mm',
    reputation: 'Terroir du jasmin égyptien, irrigation par le Nil. Récolte à l\'aube.',
    qualityRating: 'excellent',
    certifications: JSON.stringify(['Jasmin d\'Égypte']),
    mainCrops: JSON.stringify(['Jasmin sambac', 'Jasmin grandiflorum'])
  },
  {
    terroirId: 'TER-IDN-SUM',
    name: 'Sumatra - Aceh',
    country: 'Indonésie',
    region: 'Aceh',
    latitude: 4.7,
    longitude: 96.75,
    altitude: '0-500m',
    climateType: 'tropical',
    soilType: 'volcanic',
    annualRainfall: '2500-3000mm',
    reputation: 'Terroir du patchouli indonésien, 80% de la production mondiale. Séchage traditionnel.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['Patchouli d\'Indonésie']),
    mainCrops: JSON.stringify(['Patchouli'])
  },
  {
    terroirId: 'TER-PRO-VAL',
    name: 'Plateau de Valensole',
    country: 'France',
    region: 'Provence-Alpes-Côte d\'Azur',
    latitude: 43.83,
    longitude: 6.0,
    altitude: '500-700m',
    climateType: 'mediterranean',
    soilType: 'chalky',
    annualRainfall: '600-700mm',
    reputation: 'Terroir de la lavande fine de Provence, AOC. Altitude 600-1400m pour la meilleure qualité.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['AOC Lavande de Haute-Provence']),
    mainCrops: JSON.stringify(['Lavande fine', 'Lavandin', 'Thym', 'Romarin'])
  },
  {
    terroirId: 'TER-TUR-ISP',
    name: 'Isparta',
    country: 'Turquie',
    region: 'Isparta',
    latitude: 37.76,
    longitude: 30.55,
    altitude: '1000-1200m',
    climateType: 'continental',
    soilType: 'clay',
    annualRainfall: '500-600mm',
    reputation: 'Deuxième producteur mondial de rose de Damas. Culture depuis le 19ème siècle.',
    qualityRating: 'excellent',
    certifications: JSON.stringify(['Rose d\'Isparta']),
    mainCrops: JSON.stringify(['Rosa damascena', 'Lavande'])
  },
  {
    terroirId: 'TER-SRI-KAN',
    name: 'Kandy',
    country: 'Sri Lanka',
    region: 'Province Centrale',
    latitude: 7.29,
    longitude: 80.63,
    altitude: '500-1500m',
    climateType: 'tropical',
    soilType: 'volcanic',
    annualRainfall: '2000-2500mm',
    reputation: 'Terroir de la cannelle de Ceylan, qualité référence mondiale. Culture traditionnelle.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['Cannelle de Ceylan']),
    mainCrops: JSON.stringify(['Cannelle', 'Cardamome', 'Poivre'])
  },
  {
    terroirId: 'TER-COM-ANJ',
    name: 'Anjouan',
    country: 'Comores',
    region: 'Anjouan',
    latitude: -12.22,
    longitude: 44.43,
    altitude: '0-1500m',
    climateType: 'tropical',
    soilType: 'volcanic',
    annualRainfall: '2000-3000mm',
    reputation: 'Terroir de l\'ylang-ylang des Comores, qualité exceptionnelle. Distillation fractionnée.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['Ylang-ylang des Comores']),
    mainCrops: JSON.stringify(['Ylang-ylang', 'Vanille', 'Girofle'])
  },
  {
    terroirId: 'TER-REU-CIL',
    name: 'Cilaos',
    country: 'France (Réunion)',
    region: 'Cilaos',
    latitude: -21.13,
    longitude: 55.47,
    altitude: '1000-1200m',
    climateType: 'tropical',
    soilType: 'volcanic',
    annualRainfall: '1500-2000mm',
    reputation: 'Terroir du géranium bourbon, qualité exceptionnelle. Notes rosées caractéristiques.',
    qualityRating: 'exceptional',
    certifications: JSON.stringify(['Géranium Bourbon']),
    mainCrops: JSON.stringify(['Géranium rosat', 'Vétiver'])
  }
];

// Connexions plantes-terroirs pour les nouveaux terroirs
const additionalConnections = [
  // Bulgarie - Rose
  { plantName: 'Rose de Damas', terroirId: 'TER-BUL-KAZ', localName: 'Rosa damascena', cultivationStart: 1600, qualityNotes: 'Qualité référence mondiale, 70% production mondiale' },

  // Italie - Bergamote
  { plantName: 'Bergamote', terroirId: 'TER-ITA-CAL', localName: 'Bergamotto', cultivationStart: 1750, qualityNotes: 'DOP, 95% production mondiale' },
  { plantName: 'Citron', terroirId: 'TER-ITA-CAL', localName: 'Limone di Calabria', cultivationStart: 1500, qualityNotes: 'Variété locale, très aromatique' },
  { plantName: 'Orange douce', terroirId: 'TER-ITA-CAL', localName: 'Arancia di Calabria', cultivationStart: 1500, qualityNotes: 'Variété méditerranéenne' },

  // Haïti - Vétiver
  { plantName: 'Vétiver', terroirId: 'TER-HAI-VET', localName: 'Vetiver d\'Haïti', cultivationStart: 1940, qualityNotes: 'Qualité référence mondiale, notes fumées' },

  // Maroc - Rose et Cèdre
  { plantName: 'Rose de Damas', terroirId: 'TER-MAR-FES', localName: 'Rose de Kelaat M\'Gouna', cultivationStart: 1930, qualityNotes: 'Vallée des Roses, festival annuel' },
  { plantName: 'Cèdre de l\'Atlas', terroirId: 'TER-MAR-FES', localName: 'Cèdre du Moyen Atlas', cultivationStart: 1800, qualityNotes: 'Bois précieux, huile essentielle' },

  // Égypte - Jasmin
  { plantName: 'Jasmin grandiflorum', terroirId: 'TER-EGY-LUX', localName: 'Yasmin', cultivationStart: 1900, qualityNotes: 'Récolte à l\'aube, absolu précieux' },

  // Indonésie - Patchouli
  { plantName: 'Patchouli', terroirId: 'TER-IDN-SUM', localName: 'Nilam', cultivationStart: 1850, qualityNotes: '80% production mondiale, séchage traditionnel' },

  // Provence - Lavande
  { plantName: 'Lavande vraie', terroirId: 'TER-PRO-VAL', localName: 'Lavande fine AOC', cultivationStart: 1920, qualityNotes: 'AOC Lavande de Haute-Provence, altitude 600-1400m' },
  { plantName: 'Romarin', terroirId: 'TER-PRO-VAL', localName: 'Romarin de Provence', cultivationStart: 1500, qualityNotes: 'Chémotype verbénone' },
  { plantName: 'Thym', terroirId: 'TER-PRO-VAL', localName: 'Thym de Provence', cultivationStart: 1500, qualityNotes: 'Chémotype thymol et linalol' },

  // Turquie - Rose
  { plantName: 'Rose de Damas', terroirId: 'TER-TUR-ISP', localName: 'Isparta Gülü', cultivationStart: 1888, qualityNotes: 'Deuxième producteur mondial' },

  // Comores - Ylang
  { plantName: 'Ylang-Ylang', terroirId: 'TER-COM-ANJ', localName: 'Ylang-ylang des Comores', cultivationStart: 1900, qualityNotes: 'Qualité Extra Supérieure' },

  // Réunion - Géranium
  { plantName: 'Géranium rosat', terroirId: 'TER-REU-CIL', localName: 'Géranium Bourbon', cultivationStart: 1870, qualityNotes: 'Notes rosées exceptionnelles' },
  { plantName: 'Vétiver', terroirId: 'TER-REU-CIL', localName: 'Vétiver Bourbon', cultivationStart: 1900, qualityNotes: 'Qualité Bourbon' },
];

async function importData() {
  console.log('=== IMPORT DES TERROIRS ET CONNEXIONS ===\n');

  // 1. Insérer les nouveaux terroirs
  console.log('1. Insertion des nouveaux terroirs...');
  for (const terroir of additionalTerroirs) {
    try {
      await connection.execute(`
        INSERT INTO terroirs (terroir_id, name, country, region, latitude, longitude, altitude, climate_type, soil_type, annual_rainfall, reputation, quality_rating, certifications, main_crops)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), reputation = VALUES(reputation)
      `, [
        terroir.terroirId,
        terroir.name,
        terroir.country,
        terroir.region,
        terroir.latitude,
        terroir.longitude,
        terroir.altitude,
        terroir.climateType,
        terroir.soilType,
        terroir.annualRainfall,
        terroir.reputation,
        terroir.qualityRating,
        terroir.certifications,
        terroir.mainCrops
      ]);
      console.log(`  ✓ Terroir ajouté: ${terroir.name} (${terroir.country})`);
    } catch (err) {
      console.log(`  ✗ Erreur terroir ${terroir.name}: ${err.message}`);
    }
  }

  // 2. Récupérer les IDs des plantes et terroirs
  const [plants] = await connection.execute('SELECT id, name FROM plants');
  const [terroirs] = await connection.execute('SELECT id, terroir_id FROM terroirs');

  const plantMap = new Map(plants.map(p => [p.name, p.id]));
  const terroirMap = new Map(terroirs.map(t => [t.terroir_id, t.id]));

  // 3. Insérer les connexions plantes-terroirs
  console.log('\n2. Insertion des connexions plantes-terroirs...');
  
  let inserted = 0;
  let skipped = 0;

  for (const conn of additionalConnections) {
    const plantId = plantMap.get(conn.plantName);
    const terroirId = terroirMap.get(conn.terroirId);

    if (!plantId) {
      console.log(`  ⚠ Plante non trouvée: ${conn.plantName}`);
      skipped++;
      continue;
    }
    if (!terroirId) {
      console.log(`  ⚠ Terroir non trouvé: ${conn.terroirId}`);
      skipped++;
      continue;
    }

    try {
      await connection.execute(`
        INSERT INTO plant_terroirs (plant_id, terroir_id, local_name, cultivation_start, quality_notes)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE local_name = VALUES(local_name), quality_notes = VALUES(quality_notes)
      `, [plantId, terroirId, conn.localName, conn.cultivationStart, conn.qualityNotes]);
      console.log(`  ✓ ${conn.plantName} -> ${conn.terroirId}`);
      inserted++;
    } catch (err) {
      console.log(`  ✗ Erreur: ${conn.plantName} -> ${conn.terroirId}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Terroirs ajoutés: ${additionalTerroirs.length}`);
  console.log(`Connexions insérées: ${inserted}`);
  console.log(`Connexions ignorées: ${skipped}`);

  // 4. Afficher tous les terroirs
  const [allTerroirs] = await connection.execute('SELECT terroir_id, name, country, latitude, longitude FROM terroirs ORDER BY country');
  console.log(`\n=== TOUS LES TERROIRS (${allTerroirs.length}) ===`);
  allTerroirs.forEach(t => console.log(`  ${t.terroir_id}: ${t.name} (${t.country}) - [${t.latitude}, ${t.longitude}]`));

  // 5. Afficher toutes les connexions
  const [allConnections] = await connection.execute(`
    SELECT pt.*, p.name as plant_name, t.name as terroir_name, t.country
    FROM plant_terroirs pt
    JOIN plants p ON pt.plant_id = p.id
    JOIN terroirs t ON pt.terroir_id = t.id
    ORDER BY t.country, t.name
  `);
  console.log(`\n=== TOUTES LES CONNEXIONS (${allConnections.length}) ===`);
  allConnections.forEach(c => console.log(`  ${c.plant_name} -> ${c.terroir_name} (${c.country})`));

  await connection.end();
}

importData().catch(console.error);
