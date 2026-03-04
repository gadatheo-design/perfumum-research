/**
 * Analyse des terroirs et création des liaisons plante-terroir
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ANALYSE ET CRÉATION DES LIAISONS PLANTE-TERROIR ===\n');

// 1. Analyser les terroirs existants
console.log('📍 Terroirs disponibles :\n');
const [terroirs] = await conn.execute(`
  SELECT id, name, region, country FROM terroirs ORDER BY country, region
`);

console.log(`Total terroirs : ${terroirs.length}\n`);
terroirs.slice(0, 10).forEach(t => {
  console.log(`  ID ${t.id}: ${t.name} (${t.region}, ${t.country})`);
});
if (terroirs.length > 10) {
  console.log(`  ... et ${terroirs.length - 10} autres`);
}

// 2. Analyser les plantes avec origine
console.log('\n\n🌿 Plantes avec origine :\n');
const [plantsWithOrigin] = await conn.execute(`
  SELECT id, name, origin, family FROM plants 
  WHERE origin IS NOT NULL AND origin != '' AND origin != 'N/A'
  ORDER BY origin
  LIMIT 20
`);

console.log(`Plantes avec origine documentée : ${plantsWithOrigin.length}\n`);
plantsWithOrigin.forEach(p => {
  console.log(`  ${p.name} → ${p.origin}`);
});

// 3. Analyser les liaisons existantes
console.log('\n\n🔗 Liaisons plante-terroir existantes :\n');
const [existingLinks] = await conn.execute(`
  SELECT 
    COUNT(*) as total_links,
    COUNT(DISTINCT plant_id) as plants_with_terroir,
    COUNT(DISTINCT terroir_id) as terroirs_used
  FROM plant_terroirs
`);

const e = existingLinks[0];
console.log(`  Total liaisons : ${e.total_links}`);
console.log(`  Plantes liées : ${e.plants_with_terroir}`);
console.log(`  Terroirs utilisés : ${e.terroirs_used}`);

// 4. Identifier les plantes sans terroir
console.log('\n\n📊 Plantes sans terroir :\n');
const [plantsNoTerroir] = await conn.execute(`
  SELECT COUNT(DISTINCT p.id) as orphan_count
  FROM plants p
  LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
  WHERE pt.plant_id IS NULL
`);

const orphanCount = plantsNoTerroir[0].orphan_count;
console.log(`  Plantes orphelines (sans terroir) : ${orphanCount}`);

// 5. Analyser les origines pour créer des mappings
console.log('\n\n🗺️  Analyse des origines :\n');
const [originAnalysis] = await conn.execute(`
  SELECT 
    origin,
    COUNT(*) as plant_count,
    GROUP_CONCAT(DISTINCT name SEPARATOR ', ') as plants
  FROM plants
  WHERE origin IS NOT NULL AND origin != '' AND origin != 'N/A'
  GROUP BY origin
  ORDER BY plant_count DESC
  LIMIT 15
`);

console.log('Origines les plus fréquentes :');
originAnalysis.forEach(o => {
  console.log(`  ${o.origin} (${o.plant_count} plantes)`);
});

// 6. Créer un dictionnaire de mapping origine → terroir
console.log('\n\n🔄 Création des liaisons plante-terroir...\n');

// Récupérer toutes les plantes
const [allPlants] = await conn.execute(`
  SELECT id, name, origin FROM plants 
  WHERE origin IS NOT NULL AND origin != '' AND origin != 'N/A'
`);

// Récupérer tous les terroirs
const terriorMap = {};
terroirs.forEach(t => {
  terriorMap[`${t.country}:${t.region}`.toLowerCase()] = t.id;
  terriorMap[t.country.toLowerCase()] = t.id;
  terriorMap[t.region.toLowerCase()] = t.id;
  terriorMap[t.name.toLowerCase()] = t.id;
});

let created = 0;
let skipped = 0;

for (const plant of allPlants) {
  // Chercher un terroir correspondant
  const originLower = plant.origin.toLowerCase();
  let terriorId = null;
  
  // Essayer des correspondances
  if (terriorMap[originLower]) {
    terriorId = terriorMap[originLower];
  } else {
    // Chercher une correspondance partielle
    for (const [key, id] of Object.entries(terriorMap)) {
      if (originLower.includes(key) || key.includes(originLower)) {
        terriorId = id;
        break;
      }
    }
  }
  
  if (terriorId) {
    try {
      await conn.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE terroir_id = ?`,
        [plant.id, terriorId, terriorId]
      );
      created++;
    } catch (err) {
      // Ignorer les doublons
    }
  } else {
    skipped++;
  }
}

console.log(`✅ Liaisons créées : ${created}`);
console.log(`⏭️  Plantes sans correspondance terroir : ${skipped}`);

// 7. Statistiques finales
const [finalStats] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM plants) as total_plants,
    (SELECT COUNT(DISTINCT plant_id) FROM plant_terroirs) as plants_with_terroir,
    (SELECT COUNT(*) FROM plant_terroirs) as total_terroir_links
  FROM DUAL
`);

const f = finalStats[0];
console.log(`\n📊 État final :`);
console.log(`  Total plantes : ${f.total_plants}`);
console.log(`  Plantes avec terroir : ${f.plants_with_terroir} (${Math.round(f.plants_with_terroir/f.total_plants*100)}%)`);
console.log(`  Liaisons plante-terroir : ${f.total_terroir_links}`);

await conn.end();
console.log('\n✅ Analyse et création terminées');
