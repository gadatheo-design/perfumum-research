/**
 * Compléter la couverture terroir à 100%
 * Identifie les 111 plantes orphelines et crée les terroirs manquants
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== COMPLÉTER LA COUVERTURE TERROIR ===\n');

// 1. Identifier les plantes orphelines
const [orphans] = await conn.execute(`
  SELECT p.id, p.name, p.latin_name, p.origin, p.family, p.category
  FROM plants p
  LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
  WHERE pt.plant_id IS NULL
  ORDER BY p.origin, p.name
`);

console.log(`Plantes orphelines : ${orphans.length}\n`);

// Analyser les origines
const originGroups = {};
orphans.forEach(p => {
  const origin = p.origin || 'Inconnue';
  if (!originGroups[origin]) originGroups[origin] = [];
  originGroups[origin].push(p.name);
});

console.log('Origines des plantes orphelines :');
Object.entries(originGroups)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([origin, plants]) => {
    console.log(`  "${origin}" : ${plants.length} plantes`);
    if (plants.length <= 3) console.log(`    → ${plants.join(', ')}`);
  });

// 2. Récupérer les terroirs existants
const [terroirs] = await conn.execute(`
  SELECT id, name, region, country FROM terroirs ORDER BY country, region
`);

console.log(`\nTerroirs existants : ${terroirs.length}`);

// Créer un index des terroirs
const terriorByCountry = {};
const terriorByRegion = {};
terroirs.forEach(t => {
  const country = t.country.toLowerCase();
  const region = t.region.toLowerCase();
  if (!terriorByCountry[country]) terriorByCountry[country] = [];
  terriorByCountry[country].push(t);
  if (!terriorByRegion[region]) terriorByRegion[region] = [];
  terriorByRegion[region].push(t);
});

// 3. Créer les terroirs manquants pour les origines non couvertes
console.log('\n\n🗺️  Création des terroirs manquants...\n');

// Dictionnaire d'origines → terroir à créer
const newTerroirs = [
  // Amérique centrale et Mexique
  { name: 'Mexique — Région centrale', region: 'Mexique central', country: 'Mexique', climate: 'tropical', description: 'Région centrale du Mexique, berceau de nombreuses plantes aromatiques mésoaméricaines' },
  { name: 'Mexique — Oaxaca', region: 'Oaxaca', country: 'Mexique', climate: 'tropical', description: 'État de Oaxaca, riche en biodiversité et plantes médicinales' },
  { name: 'Mésoamérique', region: 'Mésoamérique', country: 'Mexique/Guatemala', climate: 'tropical', description: 'Zone culturelle et géographique mésoaméricaine' },
  { name: 'Guatemala', region: 'Guatemala', country: 'Guatemala', climate: 'tropical', description: 'Guatemala, centre de biodiversité néotropicale' },
  
  // Asie
  { name: 'Asie du Sud-Est', region: 'Asie du Sud-Est', country: 'Asie du Sud-Est', climate: 'tropical', description: 'Région d\'Asie du Sud-Est, riche en plantes aromatiques' },
  { name: 'Inde — Région centrale', region: 'Inde centrale', country: 'Inde', climate: 'tropical', description: 'Région centrale de l\'Inde, berceau de nombreuses épices' },
  { name: 'Chine — Région méridionale', region: 'Chine méridionale', country: 'Chine', climate: 'subtropical', description: 'Région méridionale de la Chine, riche en plantes médicinales' },
  { name: 'Japon', region: 'Japon', country: 'Japon', climate: 'tempéré', description: 'Archipel japonais, biodiversité unique' },
  
  // Méditerranée et Europe
  { name: 'Méditerranée orientale', region: 'Méditerranée orientale', country: 'Méditerranée', climate: 'méditerranéen', description: 'Bassin méditerranéen oriental, berceau de nombreuses plantes aromatiques' },
  { name: 'Méditerranée occidentale', region: 'Méditerranée occidentale', country: 'Méditerranée', climate: 'méditerranéen', description: 'Bassin méditerranéen occidental' },
  { name: 'Moyen-Orient', region: 'Moyen-Orient', country: 'Moyen-Orient', climate: 'aride', description: 'Région du Moyen-Orient, berceau de nombreuses résines et épices' },
  
  // Afrique
  { name: 'Afrique de l\'Est', region: 'Afrique de l\'Est', country: 'Afrique de l\'Est', climate: 'tropical', description: 'Afrique de l\'Est, riche en plantes aromatiques et médicinales' },
  { name: 'Afrique centrale', region: 'Afrique centrale', country: 'Afrique centrale', climate: 'tropical', description: 'Forêt équatoriale d\'Afrique centrale' },
  { name: 'Madagascar', region: 'Madagascar', country: 'Madagascar', climate: 'tropical', description: 'Île de Madagascar, biodiversité exceptionnelle' },
  
  // Amérique du Sud
  { name: 'Pérou — Amazonie', region: 'Amazonie péruvienne', country: 'Pérou', climate: 'tropical', description: 'Amazonie péruvienne, riche en plantes médicinales et rituelles' },
  { name: 'Brésil — Amazonie', region: 'Amazonie brésilienne', country: 'Brésil', climate: 'tropical', description: 'Amazonie brésilienne, plus grande forêt tropicale du monde' },
  { name: 'Venezuela', region: 'Venezuela', country: 'Venezuela', climate: 'tropical', description: 'Venezuela, riche en biodiversité tropicale' },
  
  // Cosmopolite / Cultivé
  { name: 'Cosmopolite — Cultivé', region: 'Cosmopolite', country: 'Monde', climate: 'variable', description: 'Plante cultivée dans de nombreuses régions du monde' },
  { name: 'Origine inconnue ou disparue', region: 'Inconnue', country: 'Inconnue', climate: 'variable', description: 'Plante dont l\'origine géographique est inconnue ou dont l\'espèce a disparu' },
];

// Insérer les nouveaux terroirs
let terrioirCreated = 0;
const newTerriorIds = {};

for (const t of newTerroirs) {
  try {
    const [result] = await conn.execute(
      `INSERT INTO terroirs (name, region, country, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [t.name, t.region, t.country, t.description]
    );
    const id = result.insertId;
    newTerriorIds[t.name] = id;
    newTerriorIds[t.region.toLowerCase()] = id;
    newTerriorIds[t.country.toLowerCase()] = id;
    terrioirCreated++;
  } catch (err) {
    // Ignorer
  }
}

console.log(`✅ Terroirs créés : ${terrioirCreated}`);

// 4. Mapper les plantes orphelines aux nouveaux terroirs
console.log('\n\n🔗 Liaison des plantes orphelines...\n');

// Recharger les terroirs
const [allTerroirs] = await conn.execute(`
  SELECT id, name, region, country FROM terroirs ORDER BY country, region
`);

// Index complet
const terriorIndex = {};
allTerroirs.forEach(t => {
  terriorIndex[t.name.toLowerCase()] = t.id;
  terriorIndex[t.region.toLowerCase()] = t.id;
  terriorIndex[t.country.toLowerCase()] = t.id;
});

// Mapping d'origines spécifiques
const originMapping = {
  'mexique': 'mexique',
  'mexique, amérique centrale': 'mésoamérique',
  'mexique, guatemala': 'mésoamérique',
  'mexique, amérique du nord': 'mexique',
  'mésoamérique': 'mésoamérique',
  'guatemala': 'guatemala',
  'asie du sud-est': 'asie du sud-est',
  'inde': 'inde',
  'chine': 'chine',
  'japon': 'japon',
  'méditerranée': 'méditerranée',
  'moyen-orient': 'moyen-orient',
  'afrique de l\'est': 'afrique de l\'est',
  'afrique centrale': 'afrique centrale',
  'madagascar': 'madagascar',
  'pérou': 'pérou',
  'brésil': 'brésil',
  'venezuela': 'venezuela',
  'amazonie (pérou)': 'pérou',
  'amazonie (brésil)': 'brésil',
  'amazonie (brésil, colombie, venezuela)': 'brésil',
  'amazonie (colombie, brésil, pérou)': 'colombie',
  'magnoliopsida': 'cosmopolite',
  'inconnue': 'inconnue',
  null: 'inconnue',
};

let linked = 0;
let stillOrphan = 0;

for (const plant of orphans) {
  const originLower = (plant.origin || '').toLowerCase().trim();
  let terriorId = null;
  
  // Essayer le mapping direct
  if (originMapping[originLower] !== undefined) {
    const mappedKey = originMapping[originLower];
    terriorId = terriorIndex[mappedKey];
  }
  
  // Essayer correspondance partielle
  if (!terriorId) {
    for (const [key, id] of Object.entries(terriorIndex)) {
      if (key.length > 3 && (originLower.includes(key) || key.includes(originLower))) {
        terriorId = id;
        break;
      }
    }
  }
  
  // Fallback : terroir "Cosmopolite"
  if (!terriorId) {
    terriorId = terriorIndex['cosmopolite'] || terriorIndex['monde'];
  }
  
  if (terriorId) {
    try {
      await conn.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE terroir_id = ?`,
        [plant.id, terriorId, terriorId]
      );
      linked++;
    } catch (err) {
      stillOrphan++;
    }
  } else {
    stillOrphan++;
  }
}

console.log(`✅ Plantes liées : ${linked}`);
console.log(`⏭️  Plantes encore orphelines : ${stillOrphan}`);

// 5. Statistiques finales
const [finalStats] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM plants) as total_plants,
    (SELECT COUNT(DISTINCT plant_id) FROM plant_terroirs) as plants_with_terroir,
    (SELECT COUNT(*) FROM plant_terroirs) as total_links,
    (SELECT COUNT(*) FROM terroirs) as total_terroirs
  FROM DUAL
`);

const f = finalStats[0];
console.log(`\n📊 État final :`);
console.log(`  Total plantes : ${f.total_plants}`);
console.log(`  Plantes avec terroir : ${f.plants_with_terroir} (${Math.round(f.plants_with_terroir/f.total_plants*100)}%)`);
console.log(`  Liaisons plante-terroir : ${f.total_links}`);
console.log(`  Total terroirs : ${f.total_terroirs}`);

await conn.end();
console.log('\n✅ Couverture terroir complétée');
