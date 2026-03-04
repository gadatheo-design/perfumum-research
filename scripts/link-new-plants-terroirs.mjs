/**
 * Lier OG Kush, Haze et Rose de Mai à leurs terroirs d'origine
 * Sources : PMC:10808149, PMC:12073320, Grasse heritage data
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

async function getOrCreateTerroir(terroirId, name, country, region, climateType, description, lat, lon) {
  const [existing] = await conn.execute('SELECT id FROM terroirs WHERE name = ? LIMIT 1', [name]);
  if (existing.length > 0) {
    console.log('  → Terroir existant:', name, '(id:', existing[0].id + ')');
    return existing[0].id;
  }
  const [result] = await conn.execute(
    'INSERT INTO terroirs (terroir_id, name, country, region, climate_type, notes, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [terroirId, name, country, region, climateType, description, lat, lon]
  );
  console.log('✅ Terroir créé:', name, '(id:', result.insertId + ')');
  return result.insertId;
}

async function linkPlantTerroir(plantId, terroirId, notes) {
  const [existing] = await conn.execute(
    'SELECT id FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ? LIMIT 1',
    [plantId, terroirId]
  );
  if (existing.length > 0) {
    console.log('  → Liaison déjà existante');
    return false;
  }
  // Vérifier les colonnes de plant_terroirs
  const [cols] = await conn.execute('DESCRIBE plant_terroirs');
  const colNames = cols.map(c => c.Field);
  
  await conn.execute(
    'INSERT INTO plant_terroirs (plant_id, terroir_id, notes, created_at) VALUES (?, ?, ?, NOW())',
    [plantId, terroirId, notes]
  );
  return true;
}

// Grasse existe déjà (id:5) — utiliser directement
// OG Kush (id:720004) — Origine : San Fernando Valley, Californie
const sfvId = await getOrCreateTerroir(
  'SFV-CA-USA',
  'San Fernando Valley',
  'USA',
  'California',
  'mediterranean',
  'Berceau de OG Kush. Climat chaud et sec, altitude 300-600m. Origine de nombreuses variétés hybrides emblématiques.',
  34.2805, -118.4695
);
const ok1 = await linkPlantTerroir(720004, sfvId, 'Terroir d\'origine de OG Kush — San Fernando Valley, CA. Profil terpénique dominé par Myrcène et Limonène. Source : PMC:10808149');
console.log('OG Kush → San Fernando Valley:', ok1 ? '✅ créé' : '→ existant');

// Haze (id:720005) — Origine : Santa Cruz, Californie
const santaCruzId = await getOrCreateTerroir(
  'SANTACRUZ-CA-USA',
  'Santa Cruz Mountains',
  'USA',
  'California',
  'oceanic',
  'Région d\'origine de la Haze originale. Climat côtier tempéré avec brouillards matinaux. Altitude 200-900m.',
  37.0454, -122.0308
);
const ok2 = await linkPlantTerroir(720005, santaCruzId, 'Terroir d\'origine de la Haze — Santa Cruz, CA. Sativa pure à longue floraison. Source : PMC:12073320');
console.log('Haze → Santa Cruz:', ok2 ? '✅ créé' : '→ existant');

// Amsterdam (Pays-Bas) pour Haze
const amsterdamId = await getOrCreateTerroir(
  'AMS-NL',
  'Amsterdam Cannabis District',
  'Pays-Bas',
  'Noord-Holland',
  'oceanic',
  'Centre mondial de sélection cannabis depuis les années 1980. Haze stabilisée et commercialisée par Sensi Seeds.',
  52.3676, 4.9041
);
const ok3 = await linkPlantTerroir(720005, amsterdamId, 'Terroir de sélection et stabilisation — Amsterdam. Haze commercialisée par Sensi Seeds dès 1984.');
console.log('Haze → Amsterdam:', ok3 ? '✅ créé' : '→ existant');

// Rose de Mai (id:720006) — Grasse existe déjà (id:5)
const ok4 = await linkPlantTerroir(720006, 5, 'Terroir historique de la Rose de Mai — Grasse, Alpes-Maritimes. AOC Fleur de Grasse (2020). Récolte manuelle mai-juin.');
console.log('Rose de Mai → Grasse (id:5):', ok4 ? '✅ créé' : '→ existant');

// Vérification finale
const [noTerroir] = await conn.execute('SELECT p.id, p.name FROM plants p LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id WHERE pt.plant_id IS NULL');
console.log('\nPlantes encore sans terroir:', noTerroir.length);
noTerroir.forEach(r => console.log(' ', r.id, r.name));

const [withTerroir] = await conn.execute('SELECT COUNT(DISTINCT plant_id) as n FROM plant_terroirs');
const [total] = await conn.execute('SELECT COUNT(*) as n FROM plants');
console.log('Couverture terroir:', withTerroir[0].n + '/' + total[0].n, '(' + (withTerroir[0].n / total[0].n * 100).toFixed(1) + '%)');

await conn.end();
