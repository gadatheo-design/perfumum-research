import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les plantes sans données climatiques
const [plants] = await connection.execute(`
  SELECT id, name, latin_name, origin, latitude, longitude 
  FROM plants 
  WHERE koppen_zone IS NULL
`);

console.log(`=== ${plants.length} plantes sans données climatiques ===`);

for (const plant of plants) {
  console.log(`${plant.id}: ${plant.name} (${plant.latin_name || 'N/A'}) - Lat: ${plant.latitude || 'N/A'}`);
  
  // Données par défaut pour les plantes tropicales/subtropicales
  let climate = {
    latitudeMin: -30, latitudeMax: 30,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Aw", koppenDescription: "Tropical savane",
    precipitationMin: 800, precipitationMax: 2000,
    temperatureMin: 15, temperatureMax: 32
  };
  
  // Si latitude disponible, ajuster
  if (plant.latitude) {
    const lat = parseFloat(plant.latitude);
    climate.latitudeMin = lat - 15;
    climate.latitudeMax = lat + 15;
  }
  
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
  
  console.log(`  ✓ Enrichi avec ${climate.koppenZone}`);
}

// Vérifier le résultat final
const [stats] = await connection.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN koppen_zone IS NOT NULL THEN 1 ELSE 0 END) as with_climate
  FROM plants
`);

console.log(`\n=== RÉSULTAT FINAL ===`);
console.log(`Total: ${stats[0].total}, Avec climat: ${stats[0].with_climate}`);

await connection.end();
