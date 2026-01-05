/**
 * PERFUMUM - Import des connexions Plantes-Terroirs
 * 
 * Ce script crée les liaisons entre les plantes et leurs terroirs de production
 * basées sur les données de recherche du projet.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Données de connexions plantes-terroirs basées sur la recherche
const plantTerroirConnections = [
  // San Andrés y Providencia (TER-COL-SAN) - Plantes aromatiques tropicales
  { plantName: 'West Indian Bay / Bay rum tree', terroirId: 'TER-COL-SAN', localName: 'Bay rum', cultivationStart: 1900, qualityNotes: 'Variété caribéenne, feuilles très aromatiques' },
  { plantName: 'Lemongrass / Citronnelle', terroirId: 'TER-COL-SAN', localName: 'Limonaria', cultivationStart: 1950, qualityNotes: 'Culture traditionnelle, usage culinaire et médicinal' },
  { plantName: 'Lippia alba', terroirId: 'TER-COL-SAN', localName: 'Pronto alivio', cultivationStart: 1800, qualityNotes: 'Chémotypes variés: citral et carvone' },
  { plantName: 'Basilic', terroirId: 'TER-COL-SAN', localName: 'Albahaca', cultivationStart: 1950, qualityNotes: 'Variété tropicale, notes anisées' },
  { plantName: 'Menthe verte', terroirId: 'TER-COL-SAN', localName: 'Hierba buena', cultivationStart: 1900, qualityNotes: 'Culture domestique répandue' },
  { plantName: 'Origan', terroirId: 'TER-COL-SAN', localName: 'Orégano', cultivationStart: 1950, qualityNotes: 'Variété caribéenne, très aromatique' },

  // Santander & Huila (TER-COL-HUI) - Tabacs colombiens
  { plantName: 'Virginia (flue-cured)', terroirId: 'TER-COL-HUI', localName: 'Virginia colombiano', cultivationStart: 1960, qualityNotes: 'Tabac blond, séchage au feu, notes sucrées' },
  { plantName: 'Burley (air-cured)', terroirId: 'TER-COL-HUI', localName: 'Burley andino', cultivationStart: 1970, qualityNotes: 'Séchage à l\'air, profil chocolaté' },
  { plantName: 'Criollo (sun-cured)', terroirId: 'TER-COL-HUI', localName: 'Criollo santandereano', cultivationStart: 1850, qualityNotes: 'Variété ancestrale, séchage au soleil' },

  // Grasse (TER-FRA-GRA) - Fleurs et plantes méditerranéennes
  { plantName: 'Lavande vraie', terroirId: 'TER-FRA-GRA', localName: 'Lavande de Grasse', cultivationStart: 1600, qualityNotes: 'Qualité exceptionnelle, patrimoine UNESCO' },
  { plantName: 'Rose de Damas', terroirId: 'TER-FRA-GRA', localName: 'Rose centifolia', cultivationStart: 1880, qualityNotes: 'Rosa centifolia, extraction traditionnelle' },
  { plantName: 'Jasmin grandiflorum', terroirId: 'TER-FRA-GRA', localName: 'Jasmin de Grasse', cultivationStart: 1700, qualityNotes: 'Récolte nocturne, absolu précieux' },
  { plantName: 'Géranium rosat', terroirId: 'TER-FRA-GRA', localName: 'Géranium Bourbon', cultivationStart: 1850, qualityNotes: 'Notes rosées, usage en parfumerie fine' },
  { plantName: 'Romarin', terroirId: 'TER-FRA-GRA', localName: 'Romarin de Provence', cultivationStart: 1500, qualityNotes: 'Chémotype camphré et cinéole' },

  // Madagascar - Nossi-Bé (TER-MAD-NOS) - Plantes tropicales malgaches
  { plantName: 'Ylang-Ylang', terroirId: 'TER-MAD-NOS', localName: 'Ylang-ylang de Nosy Be', cultivationStart: 1900, qualityNotes: 'Qualité Extra Supérieure, distillation fractionnée' },

  // Karnataka, Inde (TER-IND-KAN) - Bois précieux et épices
  { plantName: 'Bois de Santal', terroirId: 'TER-IND-KAN', localName: 'Santalum album', cultivationStart: 1800, qualityNotes: 'Santal de Mysore, qualité référence mondiale' },

  // Somalie - Bosaso (TER-SOM-BOS) - Encens et résines
  { plantName: 'Encens / Oliban', terroirId: 'TER-SOM-BOS', localName: 'Frankincense', cultivationStart: -3000, qualityNotes: 'Boswellia sacra, qualité Hojari' },
  { plantName: 'Oliban (Encens)', terroirId: 'TER-SOM-BOS', localName: 'Luban', cultivationStart: -3000, qualityNotes: 'Récolte traditionnelle, grades multiples' },
  { plantName: 'Myrrhe', terroirId: 'TER-SOM-BOS', localName: 'Murr', cultivationStart: -3000, qualityNotes: 'Commiphora myrrha, usage rituel' },
];

// Ajouter des terroirs supplémentaires si nécessaire
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
    soilType: 'Argileux-calcaire',
    annualRainfall: '600-700mm',
    description: 'Terroir historique de la rose de Damas, protégé par les montagnes des Balkans',
    specialties: 'Rosa damascena, huile essentielle de rose',
    certifications: 'AOC Rosa Damascena'
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
    soilType: 'Argilo-calcaire',
    annualRainfall: '500-600mm',
    description: 'Terroir de la bergamote, climat méditerranéen idéal pour les agrumes',
    specialties: 'Bergamote, agrumes',
    certifications: 'DOP Bergamotto di Reggio Calabria'
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
    soilType: 'Alluvial',
    annualRainfall: '1200-1500mm',
    description: 'Terroir du vétiver haïtien, qualité référence mondiale',
    specialties: 'Vétiver, huile essentielle',
    certifications: 'Vétiver d\'Haïti'
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
    soilType: 'Argilo-calcaire',
    annualRainfall: '400-500mm',
    description: 'Terroir de la rose de Damas marocaine et du cèdre de l\'Atlas',
    specialties: 'Rose de Damas, Cèdre de l\'Atlas',
    certifications: 'IGP Rose du Maroc'
  },
  {
    terroirId: 'TER-BUR-OUA',
    name: 'Région de Ouagadougou',
    country: 'Burkina Faso',
    region: 'Centre',
    latitude: 12.37,
    longitude: -1.52,
    altitude: '300-400m',
    climateType: 'tropical_dry',
    soilType: 'Latéritique',
    annualRainfall: '800-900mm',
    description: 'Terroir sahélien, culture du karité et résines africaines',
    specialties: 'Karité, résines locales',
    certifications: 'Commerce équitable'
  },
  {
    terroirId: 'TER-EGY-LUX',
    name: 'Haute-Égypte',
    country: 'Égypte',
    region: 'Louxor-Assouan',
    latitude: 25.69,
    longitude: 32.64,
    altitude: '70-100m',
    climateType: 'desert',
    soilType: 'Alluvial (Nil)',
    annualRainfall: '0-5mm',
    description: 'Terroir du jasmin égyptien, irrigation par le Nil',
    specialties: 'Jasmin sambac, Jasmin grandiflorum',
    certifications: 'Jasmin d\'Égypte'
  },
  {
    terroirId: 'TER-IDN-SUM',
    name: 'Sumatra - Aceh',
    country: 'Indonésie',
    region: 'Aceh',
    latitude: 4.7,
    longitude: 96.75,
    altitude: '0-500m',
    climateType: 'tropical_humid',
    soilType: 'Volcanique',
    annualRainfall: '2500-3000mm',
    description: 'Terroir du patchouli indonésien, climat tropical humide',
    specialties: 'Patchouli',
    certifications: 'Patchouli d\'Indonésie'
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
    soilType: 'Calcaire',
    annualRainfall: '600-700mm',
    description: 'Terroir de la lavande fine de Provence, AOC',
    specialties: 'Lavande fine, Lavandin',
    certifications: 'AOC Lavande de Haute-Provence'
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
];

async function importData() {
  console.log('=== IMPORT DES CONNEXIONS PLANTES-TERROIRS ===\n');

  // 1. Insérer les nouveaux terroirs
  console.log('1. Insertion des nouveaux terroirs...');
  for (const terroir of additionalTerroirs) {
    try {
      await connection.execute(`
        INSERT INTO terroirs (terroir_id, name, country, region, latitude, longitude, altitude, climate_type, soil_type, annual_rainfall, description, specialties, certifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name)
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
        terroir.description,
        terroir.specialties,
        terroir.certifications
      ]);
      console.log(`  ✓ Terroir ajouté: ${terroir.name}`);
    } catch (err) {
      console.log(`  ⚠ Terroir existant ou erreur: ${terroir.name} - ${err.message}`);
    }
  }

  // 2. Récupérer les IDs des plantes et terroirs
  const [plants] = await connection.execute('SELECT id, name FROM plants');
  const [terroirs] = await connection.execute('SELECT id, terroir_id FROM terroirs');

  const plantMap = new Map(plants.map(p => [p.name, p.id]));
  const terroirMap = new Map(terroirs.map(t => [t.terroir_id, t.id]));

  // 3. Insérer les connexions plantes-terroirs
  console.log('\n2. Insertion des connexions plantes-terroirs...');
  
  const allConnections = [...plantTerroirConnections, ...additionalConnections];
  let inserted = 0;
  let skipped = 0;

  for (const conn of allConnections) {
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
  console.log(`Connexions insérées: ${inserted}`);
  console.log(`Connexions ignorées: ${skipped}`);

  // 4. Vérifier les données
  const [plantTerroirs] = await connection.execute(`
    SELECT pt.*, p.name as plant_name, t.name as terroir_name, t.country
    FROM plant_terroirs pt
    JOIN plants p ON pt.plant_id = p.id
    JOIN terroirs t ON pt.terroir_id = t.id
    ORDER BY t.country, t.name
  `);

  console.log(`\n=== CONNEXIONS PLANTES-TERROIRS (${plantTerroirs.length}) ===`);
  plantTerroirs.forEach(pt => {
    console.log(`  ${pt.plant_name} -> ${pt.terroir_name} (${pt.country})`);
  });

  await connection.end();
}

importData().catch(console.error);
