/**
 * Script pour ajouter les coordonnées GPS manquantes aux terroirs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Coordonnées GPS pour les terroirs manquants
const gpsData = {
  // Burkina Faso (général) - Centre du pays
  'Burkina Faso': {
    latitude: 12.2383,
    longitude: -1.5616
  },
  // Caribbean (macro) - Centre des Caraïbes
  'Caribbean (macro)': {
    latitude: 15.5000,
    longitude: -75.0000
  },
  // Colombia (général) - Centre du pays
  'Colombia': {
    latitude: 4.5709,
    longitude: -74.2973
  },
  // Colombia — Andes - Cordillère des Andes colombiennes
  'Colombia — Andes': {
    latitude: 5.0000,
    longitude: -75.5000
  },
  // Colombia — Caribbean - Côte caribéenne colombienne
  'Colombia — Caribbean': {
    latitude: 10.9639,
    longitude: -74.7964
  },
  // San Andrés (archipel) - Île de San Andrés
  'San Andrés (archipel)': {
    latitude: 12.5847,
    longitude: -81.7006
  },
  // Global - Point central (0,0 ou autre convention)
  'Global': {
    latitude: 0.0000,
    longitude: 0.0000
  }
};

// Récupérer les terroirs sans GPS
const [terroirsWithoutGPS] = await connection.execute(`
  SELECT id, name, country
  FROM terroirs
  WHERE latitude IS NULL OR longitude IS NULL
`);

console.log(`=== Terroirs sans GPS (${terroirsWithoutGPS.length}) ===`);

let updated = 0;
let notFound = [];

for (const terroir of terroirsWithoutGPS) {
  const coords = gpsData[terroir.name];
  
  if (coords) {
    await connection.execute(`
      UPDATE terroirs 
      SET latitude = ?, longitude = ?
      WHERE id = ?
    `, [coords.latitude, coords.longitude, terroir.id]);
    
    console.log(`✓ ${terroir.name}: ${coords.latitude}, ${coords.longitude}`);
    updated++;
  } else {
    console.log(`✗ ${terroir.name}: Coordonnées non trouvées`);
    notFound.push(terroir);
  }
}

console.log(`\n=== Résumé ===`);
console.log(`Terroirs mis à jour: ${updated}`);
console.log(`Terroirs non trouvés: ${notFound.length}`);

// Vérifier le résultat
const [remainingWithoutGPS] = await connection.execute(`
  SELECT id, name
  FROM terroirs
  WHERE latitude IS NULL OR longitude IS NULL
`);

console.log(`\nTerroirs restants sans GPS: ${remainingWithoutGPS.length}`);
if (remainingWithoutGPS.length > 0) {
  remainingWithoutGPS.forEach(t => console.log(`  - ${t.name}`));
}

await connection.end();
