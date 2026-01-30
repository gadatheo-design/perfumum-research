import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Données climatiques pour les plantes aromatiques principales
// Basées sur les zones de distribution naturelle et les conditions de culture optimales
const climateData = {
  // Plantes aromatiques tropicales/subtropicales
  "Pimenta racemosa": {
    latitudeMin: 10, latitudeMax: 25,
    altitudeMin: 0, altitudeMax: 600,
    koppenZone: "Af", koppenDescription: "Tropical humide",
    precipitationMin: 1500, precipitationMax: 3000,
    temperatureMin: 22, temperatureMax: 30
  },
  "Cymbopogon citratus": {
    latitudeMin: -30, latitudeMax: 30,
    altitudeMin: 0, altitudeMax: 1200,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1000, precipitationMax: 2500,
    temperatureMin: 18, temperatureMax: 35
  },
  "Lippia alba": {
    latitudeMin: -30, latitudeMax: 25,
    altitudeMin: 0, altitudeMax: 1800,
    koppenZone: "Aw", koppenDescription: "Tropical savane",
    precipitationMin: 800, precipitationMax: 2000,
    temperatureMin: 15, temperatureMax: 32
  },
  // Plantes méditerranéennes
  "Lavandula angustifolia": {
    latitudeMin: 35, latitudeMax: 50,
    altitudeMin: 300, altitudeMax: 1800,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 400, precipitationMax: 800,
    temperatureMin: 8, temperatureMax: 25
  },
  "Rosmarinus officinalis": {
    latitudeMin: 30, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 300, precipitationMax: 700,
    temperatureMin: 10, temperatureMax: 28
  },
  "Thymus vulgaris": {
    latitudeMin: 35, latitudeMax: 50,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 350, precipitationMax: 700,
    temperatureMin: 8, temperatureMax: 28
  },
  "Origanum vulgare": {
    latitudeMin: 30, latitudeMax: 55,
    altitudeMin: 0, altitudeMax: 2000,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 400, precipitationMax: 900,
    temperatureMin: 5, temperatureMax: 30
  },
  "Ocimum basilicum": {
    latitudeMin: -35, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 1000,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 600, precipitationMax: 1500,
    temperatureMin: 15, temperatureMax: 32
  },
  // Agrumes
  "Citrus limon": {
    latitudeMin: 25, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 800,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 400, precipitationMax: 1000,
    temperatureMin: 10, temperatureMax: 30
  },
  "Citrus sinensis": {
    latitudeMin: -35, latitudeMax: 35,
    altitudeMin: 0, altitudeMax: 600,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 800, precipitationMax: 1500,
    temperatureMin: 12, temperatureMax: 32
  },
  "Citrus bergamia": {
    latitudeMin: 35, latitudeMax: 42,
    altitudeMin: 0, altitudeMax: 400,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 500, precipitationMax: 900,
    temperatureMin: 12, temperatureMax: 28
  },
  // Menthes
  "Mentha piperita": {
    latitudeMin: 30, latitudeMax: 60,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
    precipitationMin: 600, precipitationMax: 1200,
    temperatureMin: 5, temperatureMax: 25
  },
  "Mentha spicata": {
    latitudeMin: 30, latitudeMax: 55,
    altitudeMin: 0, altitudeMax: 1200,
    koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
    precipitationMin: 500, precipitationMax: 1000,
    temperatureMin: 5, temperatureMax: 28
  },
  // Eucalyptus
  "Eucalyptus globulus": {
    latitudeMin: -45, latitudeMax: -25,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
    precipitationMin: 600, precipitationMax: 1500,
    temperatureMin: 5, temperatureMax: 22
  },
  // Bois précieux
  "Santalum album": {
    latitudeMin: 8, latitudeMax: 25,
    altitudeMin: 300, altitudeMax: 1200,
    koppenZone: "Aw", koppenDescription: "Tropical savane",
    precipitationMin: 600, precipitationMax: 1600,
    temperatureMin: 18, temperatureMax: 35
  },
  "Cedrus atlantica": {
    latitudeMin: 30, latitudeMax: 40,
    altitudeMin: 1300, altitudeMax: 2600,
    koppenZone: "Csb", koppenDescription: "Méditerranéen été frais",
    precipitationMin: 500, precipitationMax: 1200,
    temperatureMin: 0, temperatureMax: 22
  },
  // Vétiver
  "Vetiveria zizanioides": {
    latitudeMin: -25, latitudeMax: 25,
    altitudeMin: 0, altitudeMax: 1200,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1000, precipitationMax: 2500,
    temperatureMin: 20, temperatureMax: 35
  },
  // Fleurs
  "Cananga odorata": {
    latitudeMin: -15, latitudeMax: 20,
    altitudeMin: 0, altitudeMax: 800,
    koppenZone: "Af", koppenDescription: "Tropical humide",
    precipitationMin: 1500, precipitationMax: 3000,
    temperatureMin: 22, temperatureMax: 32
  },
  "Rosa damascena": {
    latitudeMin: 35, latitudeMax: 45,
    altitudeMin: 600, altitudeMax: 1200,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 400, precipitationMax: 800,
    temperatureMin: 5, temperatureMax: 28
  },
  "Jasminum grandiflorum": {
    latitudeMin: 20, latitudeMax: 35,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 500, precipitationMax: 1200,
    temperatureMin: 12, temperatureMax: 32
  },
  "Pelargonium graveolens": {
    latitudeMin: -35, latitudeMax: 35,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csb", koppenDescription: "Méditerranéen été frais",
    precipitationMin: 400, precipitationMax: 1000,
    temperatureMin: 10, temperatureMax: 28
  },
  // Patchouli
  "Pogostemon cablin": {
    latitudeMin: -10, latitudeMax: 15,
    altitudeMin: 0, altitudeMax: 1000,
    koppenZone: "Af", koppenDescription: "Tropical humide",
    precipitationMin: 1500, precipitationMax: 3000,
    temperatureMin: 22, temperatureMax: 32
  },
  // Encens
  "Boswellia carterii": {
    latitudeMin: 5, latitudeMax: 20,
    altitudeMin: 200, altitudeMax: 1500,
    koppenZone: "BWh", koppenDescription: "Désert chaud",
    precipitationMin: 100, precipitationMax: 400,
    temperatureMin: 20, temperatureMax: 40
  },
  // Tabacs
  "Nicotiana tabacum var. Virginia": {
    latitudeMin: -35, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 1200,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 800, precipitationMax: 1500,
    temperatureMin: 15, temperatureMax: 32
  },
  "Nicotiana tabacum var. Burley": {
    latitudeMin: 30, latitudeMax: 45,
    altitudeMin: 200, altitudeMax: 1000,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 800, precipitationMax: 1400,
    temperatureMin: 12, temperatureMax: 30
  },
  "Nicotiana tabacum var. Criollo": {
    latitudeMin: 15, latitudeMax: 25,
    altitudeMin: 0, altitudeMax: 500,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1000, precipitationMax: 2000,
    temperatureMin: 20, temperatureMax: 32
  },
  // Tagetes
  "Tagetes lucida": {
    latitudeMin: 15, latitudeMax: 30,
    altitudeMin: 1000, altitudeMax: 2500,
    koppenZone: "Cwb", koppenDescription: "Subtropical altitude",
    precipitationMin: 600, precipitationMax: 1500,
    temperatureMin: 10, temperatureMax: 25
  },
  "Tagetes minuta": {
    latitudeMin: -35, latitudeMax: 15,
    altitudeMin: 0, altitudeMax: 2500,
    koppenZone: "Cwa", koppenDescription: "Subtropical mousson",
    precipitationMin: 500, precipitationMax: 1500,
    temperatureMin: 10, temperatureMax: 28
  }
};

// Mise à jour des plantes avec les données climatiques
let updated = 0;
let notFound = 0;

for (const [latinName, climate] of Object.entries(climateData)) {
  const [result] = await connection.execute(
    `UPDATE plants SET 
      latitude_min = ?, latitude_max = ?,
      altitude_min = ?, altitude_max = ?,
      koppen_zone = ?, koppen_description = ?,
      precipitation_min = ?, precipitation_max = ?,
      temperature_min = ?, temperature_max = ?
    WHERE latin_name = ?`,
    [
      climate.latitudeMin, climate.latitudeMax,
      climate.altitudeMin, climate.altitudeMax,
      climate.koppenZone, climate.koppenDescription,
      climate.precipitationMin, climate.precipitationMax,
      climate.temperatureMin, climate.temperatureMax,
      latinName
    ]
  );
  
  if (result.affectedRows > 0) {
    console.log(`✓ ${latinName}: données climatiques ajoutées`);
    updated++;
  } else {
    console.log(`- ${latinName}: non trouvé dans la base`);
    notFound++;
  }
}

// Enrichir les plantes restantes avec des données génériques basées sur leur origine
const [plantsWithoutClimate] = await connection.execute(`
  SELECT id, name, latin_name, origin, latitude, longitude 
  FROM plants 
  WHERE koppen_zone IS NULL AND latitude IS NOT NULL
  LIMIT 100
`);

console.log(`\n=== Enrichissement des ${plantsWithoutClimate.length} plantes restantes ===`);

for (const plant of plantsWithoutClimate) {
  const lat = parseFloat(plant.latitude);
  const origin = (plant.origin || '').toLowerCase();
  
  let climate = {};
  
  // Déterminer la zone climatique basée sur la latitude et l'origine
  if (Math.abs(lat) < 10) {
    // Équatorial
    climate = {
      koppenZone: "Af", koppenDescription: "Tropical humide",
      precipitationMin: 1500, precipitationMax: 3000,
      temperatureMin: 22, temperatureMax: 30,
      altitudeMin: 0, altitudeMax: 1000
    };
  } else if (Math.abs(lat) < 25) {
    // Tropical
    if (origin.includes('carib') || origin.includes('island') || origin.includes('san andrés')) {
      climate = {
        koppenZone: "Am", koppenDescription: "Tropical mousson",
        precipitationMin: 1200, precipitationMax: 2500,
        temperatureMin: 20, temperatureMax: 32,
        altitudeMin: 0, altitudeMax: 800
      };
    } else {
      climate = {
        koppenZone: "Aw", koppenDescription: "Tropical savane",
        precipitationMin: 800, precipitationMax: 1800,
        temperatureMin: 18, temperatureMax: 32,
        altitudeMin: 0, altitudeMax: 1500
      };
    }
  } else if (Math.abs(lat) < 40) {
    // Subtropical
    if (origin.includes('méditerran') || origin.includes('mediterran') || origin.includes('provence') || origin.includes('itali')) {
      climate = {
        koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
        precipitationMin: 400, precipitationMax: 800,
        temperatureMin: 8, temperatureMax: 28,
        altitudeMin: 0, altitudeMax: 1200
      };
    } else {
      climate = {
        koppenZone: "Cfa", koppenDescription: "Subtropical humide",
        precipitationMin: 800, precipitationMax: 1500,
        temperatureMin: 10, temperatureMax: 30,
        altitudeMin: 0, altitudeMax: 1000
      };
    }
  } else {
    // Tempéré
    climate = {
      koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
      precipitationMin: 600, precipitationMax: 1200,
      temperatureMin: 5, temperatureMax: 22,
      altitudeMin: 0, altitudeMax: 1000
    };
  }
  
  // Calculer les plages de latitude basées sur la position actuelle
  climate.latitudeMin = lat - 15;
  climate.latitudeMax = lat + 15;
  
  await connection.execute(
    `UPDATE plants SET 
      latitude_min = ?, latitude_max = ?,
      altitude_min = ?, altitude_max = ?,
      koppen_zone = ?, koppen_description = ?,
      precipitation_min = ?, precipitation_max = ?,
      temperature_min = ?, temperature_max = ?
    WHERE id = ?`,
    [
      climate.latitudeMin, climate.latitudeMax,
      climate.altitudeMin, climate.altitudeMax,
      climate.koppenZone, climate.koppenDescription,
      climate.precipitationMin, climate.precipitationMax,
      climate.temperatureMin, climate.temperatureMax,
      plant.id
    ]
  );
  
  console.log(`✓ ${plant.name}: ${climate.koppenZone} (${climate.koppenDescription})`);
  updated++;
}

console.log(`\n=== RÉSUMÉ ===`);
console.log(`Plantes mises à jour: ${updated}`);
console.log(`Plantes non trouvées: ${notFound}`);

// Vérifier le résultat
const [stats] = await connection.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN koppen_zone IS NOT NULL THEN 1 ELSE 0 END) as with_climate,
    SUM(CASE WHEN koppen_zone IS NULL THEN 1 ELSE 0 END) as without_climate
  FROM plants
`);

console.log(`\nStatistiques finales:`);
console.log(`Total plantes: ${stats[0].total}`);
console.log(`Avec données climatiques: ${stats[0].with_climate}`);
console.log(`Sans données climatiques: ${stats[0].without_climate}`);

await connection.end();
