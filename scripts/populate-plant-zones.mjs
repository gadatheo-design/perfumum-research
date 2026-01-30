import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createConnection } from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration MySQL depuis les variables d'environnement
const connection = await createConnection(process.env.DATABASE_URL);

console.log('🌍 Population des liaisons plantes-zones géographiques...\n');

// Récupérer toutes les zones géographiques
const [zones] = await connection.execute('SELECT id, name, region FROM geographic_zones');
console.log(`📍 ${zones.length} zones géographiques trouvées\n`);

// Récupérer toutes les plantes avec coordonnées GPS
const [plants] = await connection.execute(`
  SELECT id, name, latin_name, latitude, longitude, habitat 
  FROM plants 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL
`);
console.log(`🌿 ${plants.length} plantes avec coordonnées GPS trouvées\n`);

// Mapping des espèces aux zones géographiques
const plantZoneMappings = [
  // Boswellia (Somalie, Éthiopie, Yémen) -> Corne de l'Afrique
  { plantName: 'Boswellia', zoneRegion: 'Afrique', isPrimary: true, status: 'rare' },
  
  // Santalum spicatum (Australie occidentale) -> Australie
  { plantName: 'Santalum spicatum', zoneRegion: 'Australie', isPrimary: true, status: 'rare' },
  
  // Aquilaria crassna (Cambodge, Laos, Vietnam) -> Asie du Sud-Est
  { plantName: 'Aquilaria crassna', zoneRegion: 'Asie', isPrimary: true, status: 'critically_rare' },
  
  // Commiphora myrrha (Somalie, Éthiopie, Yémen) -> Corne de l'Afrique
  { plantName: 'Commiphora myrrha', zoneRegion: 'Afrique', isPrimary: true, status: 'rare' },
  
  // Pogostemon cablin (Indonésie, Philippines) -> Asie du Sud-Est
  { plantName: 'Pogostemon cablin', zoneRegion: 'Asie', isPrimary: true, status: 'common' },
  
  // Cinnamomum verum (Sri Lanka) -> Asie du Sud
  { plantName: 'Cinnamomum verum', zoneRegion: 'Asie', isPrimary: true, status: 'common' },
  
  // Syzygium aromaticum (Zanzibar, Madagascar) -> Afrique de l'Est
  { plantName: 'Syzygium aromaticum', zoneRegion: 'Afrique', isPrimary: true, status: 'common' },
  
  // Myroxylon balsamum (Amérique centrale) -> Amérique centrale
  { plantName: 'Myroxylon balsamum', zoneRegion: 'Amérique', isPrimary: true, status: 'rare' },
  
  // Liquidambar orientalis (Turquie) -> Méditerranée orientale
  { plantName: 'Liquidambar orientalis', zoneRegion: 'Méditerranée', isPrimary: true, status: 'rare' },
  
  // Styrax benzoin (Sumatra, Java) -> Asie du Sud-Est
  { plantName: 'Styrax benzoin', zoneRegion: 'Asie', isPrimary: true, status: 'rare' },
  
  // Cistus ladanifer (Méditerranée occidentale) -> Méditerranée
  { plantName: 'Cistus ladanifer', zoneRegion: 'Méditerranée', isPrimary: true, status: 'common' },
  
  // Nardostachys jatamansi (Himalaya) -> Himalaya
  { plantName: 'Nardostachys jatamansi', zoneRegion: 'Asie', isPrimary: true, status: 'critically_rare' },
];

let insertedCount = 0;
let skippedCount = 0;

for (const mapping of plantZoneMappings) {
  try {
    // Trouver la plante
    const plant = plants.find(p => 
      p.name?.includes(mapping.plantName) || 
      p.latin_name?.includes(mapping.plantName)
    );
    
    if (!plant) {
      console.log(`⚠️  Plante non trouvée: ${mapping.plantName}`);
      skippedCount++;
      continue;
    }
    
    // Trouver la zone
    const zone = zones.find(z => 
      z.region?.includes(mapping.zoneRegion) || 
      z.name?.includes(mapping.zoneRegion)
    );
    
    if (!zone) {
      console.log(`⚠️  Zone non trouvée: ${mapping.zoneRegion}`);
      skippedCount++;
      continue;
    }
    
    // Vérifier si la liaison existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM plant_geographic_zones WHERE plant_id = ? AND zone_id = ?',
      [plant.id, zone.id]
    );
    
    if (existing.length > 0) {
      console.log(`⏭️  Liaison déjà existante: ${plant.name} -> ${zone.name}`);
      skippedCount++;
      continue;
    }
    
    // Insérer la liaison
    await connection.execute(
      `INSERT INTO plant_geographic_zones (plant_id, zone_id, is_primary_zone, population_status) 
       VALUES (?, ?, ?, ?)`,
      [plant.id, zone.id, mapping.isPrimary ? 1 : 0, mapping.status]
    );
    
    console.log(`✅ ${plant.name} (${plant.latin_name}) -> ${zone.name}`);
    console.log(`   📍 Zone: ${zone.region} | Statut: ${mapping.status} | Primaire: ${mapping.isPrimary ? 'Oui' : 'Non'}\n`);
    insertedCount++;
    
  } catch (error) {
    console.error(`❌ Erreur lors de la liaison ${mapping.plantName}:`, error.message);
    skippedCount++;
  }
}

console.log('\n📊 Résumé de la population:');
console.log(`   ✅ ${insertedCount} liaisons créées avec succès`);
console.log(`   ⏭️  ${skippedCount} liaisons ignorées (déjà existantes ou données manquantes)`);

await connection.end();
console.log('\n✨ Population des liaisons terminée!');
