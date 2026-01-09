/**
 * Script pour ajouter les terroirs manquants et associer les plantes orphelines
 * Terroirs à créer: Hindu Kush, Hawaii, Afrique (plusieurs régions)
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL non définie');
  process.exit(1);
}

// Parser DATABASE_URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: {
    rejectUnauthorized: true
  }
};

async function main() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('Connexion à la base de données...');
    
    // 1. Récupérer le prochain terroir_id disponible
    const [maxIdResult] = await connection.query(`
      SELECT MAX(CAST(SUBSTRING(terroir_id, 5) AS UNSIGNED)) as max_num 
      FROM terroirs 
      WHERE terroir_id LIKE 'TER-%'
    `);
    let nextNum = (maxIdResult[0]?.max_num || 0) + 1;
    
    // 2. Définir les nouveaux terroirs
    const newTerroirs = [
      {
        terroir_id: `TER-${String(nextNum++).padStart(3, '0')}`,
        name: 'Hindu Kush, Afghanistan/Pakistan',
        country: 'Afghanistan',
        region: 'Hindu Kush',
        sub_region: 'Montagnes Hindu Kush',
        latitude: 35.0,
        longitude: 71.0,
        altitude: '2000-5000m',
        climate_type: 'alpine',
        avg_temperature: '-5 à 20°C',
        annual_rainfall: '300-600mm',
        humidity: '30-50%',
        soil_type: 'rocky',
        soil_ph: '6.5-7.5',
        soil_characteristics: 'Sol montagneux, rocheux, bien drainé. Conditions extrêmes favorisant des plantes résistantes aux variations de température.',
        main_crops: JSON.stringify(['Cannabis indica', 'Safran', 'Noyer']),
        production_history: 'Région historique de production de cannabis indica et de safran. Les conditions climatiques extrêmes ont sélectionné des variétés particulièrement aromatiques.'
      },
      {
        terroir_id: `TER-${String(nextNum++).padStart(3, '0')}`,
        name: 'Hawaii, États-Unis',
        country: 'États-Unis',
        region: 'Hawaii',
        sub_region: 'Îles hawaiiennes',
        latitude: 19.8968,
        longitude: -155.5828,
        altitude: '0-4200m',
        climate_type: 'tropical',
        avg_temperature: '20-30°C',
        annual_rainfall: '500-10000mm',
        humidity: '60-90%',
        soil_type: 'volcanic',
        soil_ph: '5.5-7.0',
        soil_characteristics: 'Sol volcanique riche en minéraux, très fertile. Grande variabilité microclimatique selon l\'altitude et l\'exposition.',
        main_crops: JSON.stringify(['Santal hawaiien', 'Gingembre', 'Ylang-ylang', 'Plumeria']),
        production_history: 'Îles volcaniques avec une biodiversité unique. Le santal hawaiien (Santalum paniculatum) est endémique et menacé.'
      },
      {
        terroir_id: `TER-${String(nextNum++).padStart(3, '0')}`,
        name: 'Afrique de l\'Ouest, Sahel',
        country: 'Multi-pays',
        region: 'Sahel',
        sub_region: 'Burkina Faso, Mali, Niger, Sénégal',
        latitude: 14.0,
        longitude: 0.0,
        altitude: '200-500m',
        climate_type: 'semi_arid',
        avg_temperature: '25-40°C',
        annual_rainfall: '200-600mm',
        humidity: '20-50%',
        soil_type: 'sandy',
        soil_ph: '6.0-7.5',
        soil_characteristics: 'Sol sablonneux à sablo-argileux. Saison sèche prolongée, plantes adaptées à la sécheresse.',
        main_crops: JSON.stringify(['Karité', 'Baobab', 'Néré', 'Gomme arabique']),
        production_history: 'Zone de transition entre le Sahara et les forêts tropicales. Production traditionnelle de beurre de karité et de gomme arabique.'
      },
      {
        terroir_id: `TER-${String(nextNum++).padStart(3, '0')}`,
        name: 'Afrique de l\'Est, Hauts Plateaux',
        country: 'Multi-pays',
        region: 'Hauts Plateaux Est-Africains',
        sub_region: 'Éthiopie, Kenya, Tanzanie',
        latitude: -3.0,
        longitude: 37.0,
        altitude: '1500-3000m',
        climate_type: 'tropical',
        avg_temperature: '15-25°C',
        annual_rainfall: '800-2000mm',
        humidity: '50-80%',
        soil_type: 'volcanic',
        soil_ph: '5.5-7.0',
        soil_characteristics: 'Sol volcanique fertile, riche en nutriments. Climat tempéré d\'altitude idéal pour les plantes aromatiques.',
        main_crops: JSON.stringify(['Café', 'Géranium rosat', 'Pyrèthre', 'Encens']),
        production_history: 'Berceau du café arabica. Production importante de géranium rosat et de pyrèthre pour l\'industrie des parfums et des insecticides naturels.'
      },
      {
        terroir_id: `TER-${String(nextNum++).padStart(3, '0')}`,
        name: 'Corne de l\'Afrique, Somalie/Yémen',
        country: 'Multi-pays',
        region: 'Corne de l\'Afrique',
        sub_region: 'Somalie, Djibouti, Yémen',
        latitude: 11.0,
        longitude: 49.0,
        altitude: '0-2000m',
        climate_type: 'arid',
        avg_temperature: '25-35°C',
        annual_rainfall: '50-500mm',
        humidity: '30-60%',
        soil_type: 'rocky',
        soil_ph: '7.0-8.5',
        soil_characteristics: 'Sol calcaire et rocheux, très aride. Conditions extrêmes favorisant la production de résines aromatiques.',
        main_crops: JSON.stringify(['Encens (Boswellia)', 'Myrrhe (Commiphora)', 'Opoponax']),
        production_history: 'Région historique de production d\'encens et de myrrhe depuis l\'Antiquité. Les Boswellia sacra et Commiphora myrrha y sont endémiques.'
      },
      {
        terroir_id: `TER-${String(nextNum++).padStart(3, '0')}`,
        name: 'Afrique Centrale, Forêt Équatoriale',
        country: 'Multi-pays',
        region: 'Bassin du Congo',
        sub_region: 'RDC, Cameroun, Gabon, Congo',
        latitude: 0.0,
        longitude: 18.0,
        altitude: '300-1500m',
        climate_type: 'equatorial',
        avg_temperature: '24-28°C',
        annual_rainfall: '1500-3000mm',
        humidity: '80-95%',
        soil_type: 'alluvial',
        soil_ph: '4.5-6.0',
        soil_characteristics: 'Sol forestier acide, riche en matière organique. Biodiversité exceptionnelle.',
        main_crops: JSON.stringify(['Poivre de Penja', 'Cacao', 'Café robusta', 'Bois précieux']),
        production_history: 'Deuxième plus grande forêt tropicale du monde. Production de poivre de Penja (IGP), cacao et nombreuses espèces aromatiques endémiques.'
      }
    ];
    
    // 3. Insérer les nouveaux terroirs
    console.log('\\nInsertion des nouveaux terroirs...');
    const insertedTerroirs = [];
    
    for (const terroir of newTerroirs) {
      try {
        const [result] = await connection.query(`
          INSERT INTO terroirs (
            terroir_id, name, country, region, sub_region,
            latitude, longitude, altitude, climate_type,
            avg_temperature, annual_rainfall, humidity,
            soil_type, soil_ph, soil_characteristics,
            main_crops, production_history
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          terroir.terroir_id, terroir.name, terroir.country, terroir.region, terroir.sub_region,
          terroir.latitude, terroir.longitude, terroir.altitude, terroir.climate_type,
          terroir.avg_temperature, terroir.annual_rainfall, terroir.humidity,
          terroir.soil_type, terroir.soil_ph, terroir.soil_characteristics,
          terroir.main_crops, terroir.production_history
        ]);
        
        insertedTerroirs.push({ ...terroir, id: result.insertId });
        console.log(`✓ Terroir créé: ${terroir.name} (ID: ${result.insertId})`);
      } catch (err) {
        console.error(`✗ Erreur pour ${terroir.name}:`, err.message);
      }
    }
    
    // 4. Récupérer les plantes orphelines
    console.log('\\nRécupération des plantes orphelines...');
    const [orphanPlants] = await connection.query(`
      SELECT p.id, p.name, p.latin_name, p.origin, p.category
      FROM plants p 
      LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id 
      WHERE pt.id IS NULL 
      ORDER BY p.name
    `);
    
    console.log(`Trouvé ${orphanPlants.length} plantes orphelines`);
    
    // 5. Récupérer tous les terroirs (anciens + nouveaux)
    const [allTerroirs] = await connection.query(`SELECT id, name, country, region FROM terroirs`);
    
    // 6. Créer un mapping pour associer les plantes aux terroirs
    const plantTerroirMappings = [];
    
    // Mapping basé sur l'origine des plantes
    const terroirKeywords = {
      'Hindu Kush': ['afghanistan', 'pakistan', 'hindu kush', 'himalaya', 'asie centrale'],
      'Hawaii': ['hawaii', 'hawaien', 'pacifique', 'polynésie'],
      'Sahel': ['sahel', 'burkina', 'mali', 'niger', 'sénégal', 'afrique ouest'],
      'Hauts Plateaux': ['éthiopie', 'kenya', 'tanzanie', 'afrique est', 'ouganda', 'rwanda'],
      'Corne de l\'Afrique': ['somalie', 'yémen', 'djibouti', 'arabie', 'oman', 'encens', 'myrrhe'],
      'Bassin du Congo': ['congo', 'cameroun', 'gabon', 'afrique centrale', 'équatorial']
    };
    
    for (const plant of orphanPlants) {
      const origin = (plant.origin || '').toLowerCase();
      const name = (plant.name || '').toLowerCase();
      const latinName = (plant.latin_name || '').toLowerCase();
      
      for (const [terroirRegion, keywords] of Object.entries(terroirKeywords)) {
        const matchingTerroir = allTerroirs.find(t => 
          t.region && t.region.toLowerCase().includes(terroirRegion.toLowerCase())
        );
        
        if (matchingTerroir) {
          const hasMatch = keywords.some(kw => 
            origin.includes(kw) || name.includes(kw) || latinName.includes(kw)
          );
          
          if (hasMatch) {
            plantTerroirMappings.push({
              plantId: plant.id,
              plantName: plant.name,
              terroirId: matchingTerroir.id,
              terroirName: matchingTerroir.name
            });
            break; // Une seule association par plante pour l'instant
          }
        }
      }
    }
    
    // 7. Insérer les liaisons plante-terroir
    console.log(`\\nCréation de ${plantTerroirMappings.length} liaisons plante-terroir...`);
    
    for (const mapping of plantTerroirMappings) {
      try {
        await connection.query(`
          INSERT INTO plant_terroirs (plant_id, terroir_id, notes)
          VALUES (?, ?, ?)
        `, [mapping.plantId, mapping.terroirId, `Association automatique basée sur l'origine géographique`]);
        
        console.log(`✓ Liaison: ${mapping.plantName} → ${mapping.terroirName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`○ Liaison existante: ${mapping.plantName} → ${mapping.terroirName}`);
        } else {
          console.error(`✗ Erreur: ${mapping.plantName}:`, err.message);
        }
      }
    }
    
    // 8. Afficher les statistiques finales
    const [finalStats] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM plants) as total_plants,
        (SELECT COUNT(DISTINCT plant_id) FROM plant_terroirs) as linked_plants,
        (SELECT COUNT(*) FROM terroirs) as total_terroirs
    `);
    
    console.log('\\n=== STATISTIQUES FINALES ===');
    console.log(`Terroirs créés: ${insertedTerroirs.length}`);
    console.log(`Liaisons créées: ${plantTerroirMappings.length}`);
    console.log(`Total plantes: ${finalStats[0].total_plants}`);
    console.log(`Plantes liées: ${finalStats[0].linked_plants}`);
    console.log(`Total terroirs: ${finalStats[0].total_terroirs}`);
    console.log(`Couverture: ${Math.round((finalStats[0].linked_plants / finalStats[0].total_plants) * 100)}%`);
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await connection.end();
  }
}

main();
