/**
 * Créer les terroirs manquants et lier les 58 plantes orphelines
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== CRÉATION DES TERROIRS MANQUANTS ===\n');

// Nouveaux terroirs à créer avec terroir_id unique
const newTerroirs = [
  { terroir_id: 'MEX_CENTRAL', name: 'Mexique — Région centrale', country: 'Mexique', region: 'Mexique central', climate_type: 'tropical', notes: 'Région centrale du Mexique, berceau de nombreuses plantes aromatiques mésoaméricaines' },
  { terroir_id: 'MESOAMERICA', name: 'Mésoamérique', country: 'Mexique/Guatemala', region: 'Mésoamérique', climate_type: 'tropical', notes: 'Zone culturelle et géographique mésoaméricaine' },
  { terroir_id: 'GUATEMALA', name: 'Guatemala', country: 'Guatemala', region: 'Guatemala', climate_type: 'tropical', notes: 'Guatemala, centre de biodiversité néotropicale' },
  { terroir_id: 'SEA_REGION', name: 'Asie du Sud-Est', country: 'Asie du Sud-Est', region: 'Asie du Sud-Est', climate_type: 'tropical', notes: 'Région d\'Asie du Sud-Est, riche en plantes aromatiques' },
  { terroir_id: 'INDIA_CENTRAL', name: 'Inde — Région centrale', country: 'Inde', region: 'Inde centrale', climate_type: 'tropical', notes: 'Région centrale de l\'Inde, berceau de nombreuses épices' },
  { terroir_id: 'CHINA_SOUTH', name: 'Chine méridionale', country: 'Chine', region: 'Chine méridionale', climate_type: 'subtropical', notes: 'Région méridionale de la Chine, riche en plantes médicinales' },
  { terroir_id: 'JAPAN_MAIN', name: 'Japon', country: 'Japon', region: 'Japon', climate_type: 'oceanic', notes: 'Archipel japonais, biodiversité unique' },
  { terroir_id: 'MED_EAST', name: 'Méditerranée orientale', country: 'Méditerranée', region: 'Méditerranée orientale', climate_type: 'mediterranean', notes: 'Bassin méditerranéen oriental, berceau de nombreuses plantes aromatiques' },
  { terroir_id: 'MED_WEST', name: 'Méditerranée occidentale', country: 'Méditerranée', region: 'Méditerranée occidentale', climate_type: 'mediterranean', notes: 'Bassin méditerranéen occidental' },
  { terroir_id: 'MIDDLE_EAST', name: 'Moyen-Orient', country: 'Moyen-Orient', region: 'Moyen-Orient', climate_type: 'arid', notes: 'Région du Moyen-Orient, berceau de nombreuses résines et épices' },
  { terroir_id: 'AFRICA_EAST', name: 'Afrique de l\'Est', country: 'Afrique de l\'Est', region: 'Afrique de l\'Est', climate_type: 'tropical', notes: 'Afrique de l\'Est, riche en plantes aromatiques et médicinales' },
  { terroir_id: 'AFRICA_CENTRAL', name: 'Afrique centrale', country: 'Afrique centrale', region: 'Afrique centrale', climate_type: 'equatorial', notes: 'Forêt équatoriale d\'Afrique centrale' },
  { terroir_id: 'MADAGASCAR', name: 'Madagascar', country: 'Madagascar', region: 'Madagascar', climate_type: 'tropical', notes: 'Île de Madagascar, biodiversité exceptionnelle' },
  { terroir_id: 'PERU_AMAZON', name: 'Pérou — Amazonie', country: 'Pérou', region: 'Amazonie péruvienne', climate_type: 'tropical', notes: 'Amazonie péruvienne, riche en plantes médicinales et rituelles' },
  { terroir_id: 'BRAZIL_AMAZON', name: 'Brésil — Amazonie', country: 'Brésil', region: 'Amazonie brésilienne', climate_type: 'equatorial', notes: 'Amazonie brésilienne, plus grande forêt tropicale du monde' },
  { terroir_id: 'BRAZIL_NORDESTE', name: 'Brésil — Nordeste (Caatinga)', country: 'Brésil', region: 'Nordeste', climate_type: 'semi_arid', notes: 'Nordeste brésilien, biome Caatinga unique' },
  { terroir_id: 'VENEZUELA', name: 'Venezuela', country: 'Venezuela', region: 'Venezuela', climate_type: 'tropical', notes: 'Venezuela, riche en biodiversité tropicale' },
  { terroir_id: 'ARGENTINA', name: 'Argentine', country: 'Argentine', region: 'Argentine', climate_type: 'continental', notes: 'Argentine, du subtropicale à la Patagonie' },
  { terroir_id: 'GRAN_CHACO', name: 'Gran Chaco', country: 'Argentine/Paraguay/Bolivie', region: 'Gran Chaco', climate_type: 'semi_arid', notes: 'Gran Chaco, forêt sèche d\'Amérique du Sud' },
  { terroir_id: 'NORTH_AMERICA', name: 'Amérique du Nord', country: 'Amérique du Nord', region: 'Amérique du Nord', climate_type: 'continental', notes: 'Amérique du Nord tempérée et boréale' },
  { terroir_id: 'CALIFORNIA', name: 'Californie', country: 'États-Unis', region: 'Californie', climate_type: 'mediterranean', notes: 'Californie, biodiversité méditerranéenne unique' },
  { terroir_id: 'EUROPE_NORTH', name: 'Europe du Nord', country: 'Europe du Nord', region: 'Europe du Nord', climate_type: 'oceanic', notes: 'Europe du Nord, plantes boréales et arctiques' },
  { terroir_id: 'EUROPE_CENTRAL', name: 'Europe centrale', country: 'Europe centrale', region: 'Europe centrale', climate_type: 'continental', notes: 'Europe centrale, plantes tempérées' },
  { terroir_id: 'AUSTRALIA', name: 'Australie', country: 'Australie', region: 'Australie', climate_type: 'other', notes: 'Australie, biodiversité unique' },
  { terroir_id: 'NEW_CALEDONIA', name: 'Nouvelle-Calédonie', country: 'Nouvelle-Calédonie', region: 'Nouvelle-Calédonie', climate_type: 'tropical', notes: 'Nouvelle-Calédonie, biodiversité endémique' },
  { terroir_id: 'OMAN', name: 'Oman', country: 'Oman', region: 'Oman', climate_type: 'arid', notes: 'Oman, berceau de l\'encens (Boswellia sacra)' },
  { terroir_id: 'IRAN', name: 'Iran', country: 'Iran', region: 'Iran', climate_type: 'semi_arid', notes: 'Iran, berceau du safran et du galbanum' },
  { terroir_id: 'GREECE_XANTHI', name: 'Grèce — Xanthi', country: 'Grèce', region: 'Xanthi', climate_type: 'mediterranean', notes: 'Région de Xanthi, production de tabac oriental' },
  { terroir_id: 'GREECE_YENIDJE', name: 'Grèce — Yenidje', country: 'Grèce', region: 'Yenidje', climate_type: 'mediterranean', notes: 'Région de Yenidje, tabac oriental de qualité exceptionnelle' },
  { terroir_id: 'CYRENAICA', name: 'Cyrénaïque (Antiquité)', country: 'Libye (Antiquité)', region: 'Cyrénaïque', climate_type: 'mediterranean', notes: 'Cyrénaïque antique, berceau du silphium disparu' },
  { terroir_id: 'TROPICAL_HUMID', name: 'Tropical humide équatorial', country: 'Monde tropical', region: 'Tropiques', climate_type: 'equatorial', notes: 'Zone tropicale humide équatoriale' },
  { terroir_id: 'COSMOPOLITE', name: 'Cosmopolite — Cultivé', country: 'Monde', region: 'Cosmopolite', climate_type: 'other', notes: 'Plante cultivée dans de nombreuses régions du monde' },
  { terroir_id: 'UNKNOWN_ORIGIN', name: 'Origine inconnue ou disparue', country: 'Inconnue', region: 'Inconnue', climate_type: 'other', notes: 'Plante dont l\'origine géographique est inconnue ou dont l\'espèce a disparu' },
];

// Insérer les nouveaux terroirs
let terrioirCreated = 0;
const terriorIdMap = {};

for (const t of newTerroirs) {
  try {
    const [result] = await conn.execute(
      `INSERT INTO terroirs (terroir_id, name, country, region, climate_type, notes)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [t.terroir_id, t.name, t.country, t.region, t.climate_type, t.notes]
    );
    const dbId = result.insertId || result.info?.match(/\d+/)?.[0];
    
    // Récupérer l'ID réel
    const [rows] = await conn.execute(
      `SELECT id FROM terroirs WHERE terroir_id = ?`,
      [t.terroir_id]
    );
    if (rows.length > 0) {
      terriorIdMap[t.terroir_id] = rows[0].id;
      terriorIdMap[t.name.toLowerCase()] = rows[0].id;
      terriorIdMap[t.country.toLowerCase()] = rows[0].id;
      terriorIdMap[(t.region || '').toLowerCase()] = rows[0].id;
    }
    terrioirCreated++;
  } catch (err) {
    console.log(`  ⚠️  Erreur pour ${t.name}: ${err.message}`);
  }
}

console.log(`✅ Terroirs créés/mis à jour : ${terrioirCreated}`);

// Récupérer les plantes orphelines
const [orphans] = await conn.execute(`
  SELECT p.id, p.name, p.origin
  FROM plants p
  LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
  WHERE pt.plant_id IS NULL
  ORDER BY p.origin, p.name
`);

console.log(`\nPlantes orphelines restantes : ${orphans.length}\n`);

// Mapping spécifique origine → terroir_id
const specificMapping = {
  'méditerranée': 'MED_EAST',
  'méditerranée orientale': 'MED_EAST',
  'méditerranée, asie': 'MED_EAST',
  'méditerranée orientale, asie de l\'ouest': 'MED_EAST',
  'réf. méditerranée': 'MED_EAST',
  'asie de l\'est': 'CHINA_SOUTH',
  'asie, méditerranée': 'MED_EAST',
  'asie (réf.)': 'SEA_REGION',
  'asie (taïga/montagnes)': 'SEA_REGION',
  'chine': 'CHINA_SOUTH',
  'japon': 'JAPAN_MAIN',
  'japon, chine': 'JAPAN_MAIN',
  'inde': 'INDIA_CENTRAL',
  'iran (réf.)': 'IRAN',
  'iran, espagne, cachemire': 'IRAN',
  'oman': 'OMAN',
  'moyen-orient': 'MIDDLE_EAST',
  'afrique de l\'ouest': 'AFRICA_EAST',
  'afrique de l\'ouest (burkina)': 'AFRICA_EAST',
  'afrique de l\'est': 'AFRICA_EAST',
  'afrique centrale': 'AFRICA_CENTRAL',
  'madagascar': 'MADAGASCAR',
  'australie': 'AUSTRALIA',
  'nouvelle-calédonie, australie': 'NEW_CALEDONIA',
  'amérique du nord': 'NORTH_AMERICA',
  'eurasie/amérique du nord': 'NORTH_AMERICA',
  'californie': 'CALIFORNIA',
  'europe': 'EUROPE_CENTRAL',
  'europe du nord': 'EUROPE_NORTH',
  'europe (réf.; herbiers)': 'EUROPE_CENTRAL',
  'brésil': 'BRAZIL_AMAZON',
  'brésil (nordeste - caatinga)': 'BRAZIL_NORDESTE',
  'brésil (réf.)': 'BRAZIL_AMAZON',
  'venezuela': 'VENEZUELA',
  'argentine': 'ARGENTINA',
  'gran chaco (arg./par./bol.; réf.)': 'GRAN_CHACO',
  'amérique tropicale': 'TROPICAL_HUMID',
  'tropical humide équatorial': 'TROPICAL_HUMID',
  'mexique': 'MEX_CENTRAL',
  'mexique, amérique centrale': 'MESOAMERICA',
  'mexique, guatemala': 'MESOAMERICA',
  'mexique, amérique du nord': 'MEX_CENTRAL',
  'mésoamérique': 'MESOAMERICA',
  'guatemala': 'GUATEMALA',
  'grèce (xanthi': 'GREECE_XANTHI',
  'grèce (région yenidje)': 'GREECE_YENIDJE',
  'cyrénaïque (antiquité)': 'CYRENAICA',
  'cyrénaïque (libye antique)': 'CYRENAICA',
  'magnoliopsida': 'COSMOPOLITE',
  'culture mondiale': 'COSMOPOLITE',
  'fleur': 'COSMOPOLITE',
  'feuille': 'COSMOPOLITE',
  'fruit': 'COSMOPOLITE',
  'résine': 'COSMOPOLITE',
  'tige': 'COSMOPOLITE',
  'écorce': 'COSMOPOLITE',
  'beurre (amande)': 'COSMOPOLITE',
  'océans (échouages rares)': 'UNKNOWN_ORIGIN',
  'océans (échouages)': 'UNKNOWN_ORIGIN',
  'inconnue': 'UNKNOWN_ORIGIN',
};

let linked = 0;
let stillOrphan = 0;

for (const plant of orphans) {
  const originLower = (plant.origin || 'inconnue').toLowerCase().trim();
  
  // Chercher dans le mapping spécifique
  let terriorKey = specificMapping[originLower];
  
  // Fallback sur correspondance partielle
  if (!terriorKey) {
    for (const [key, tKey] of Object.entries(specificMapping)) {
      if (originLower.includes(key) || key.includes(originLower)) {
        terriorKey = tKey;
        break;
      }
    }
  }
  
  // Fallback final
  if (!terriorKey) terriorKey = 'UNKNOWN_ORIGIN';
  
  const terriorDbId = terriorIdMap[terriorKey];
  
  if (terriorDbId) {
    try {
      await conn.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE terroir_id = ?`,
        [plant.id, terriorDbId, terriorDbId]
      );
      linked++;
    } catch (err) {
      console.log(`  ⚠️  ${plant.name}: ${err.message}`);
      stillOrphan++;
    }
  } else {
    console.log(`  ⚠️  ${plant.name} (${plant.origin}) — terroir ${terriorKey} non trouvé`);
    stillOrphan++;
  }
}

console.log(`\n✅ Plantes liées : ${linked}`);
console.log(`⏭️  Plantes encore orphelines : ${stillOrphan}`);

// Statistiques finales
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
console.log('\n✅ Création des terroirs terminée');
