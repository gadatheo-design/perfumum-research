import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../perfumum.db');

const db = new Database(dbPath);

// Données GPS précises pour les 12 espèces restantes
const speciesGPSData = [
  {
    scientificName: 'Boswellia frereana',
    commonName: 'Encens de Somalie',
    latitude: 10.4479,
    longitude: 47.2891,
    locationDescription: 'Région de Bari, Somalie - zone endémique principale'
  },
  {
    scientificName: 'Santalum spicatum',
    commonName: 'Santal australien',
    latitude: -30.7489,
    longitude: 121.4689,
    locationDescription: 'Région de Goldfields-Esperance, Australie occidentale'
  },
  {
    scientificName: 'Aquilaria crassna',
    commonName: 'Bois d\'agar cambodgien',
    latitude: 13.4125,
    longitude: 103.8667,
    locationDescription: 'Province de Mondulkiri, Cambodge - forêts tropicales'
  },
  {
    scientificName: 'Commiphora myrrha',
    commonName: 'Myrrhe',
    latitude: 9.1450,
    longitude: 40.4897,
    locationDescription: 'Région Somali, Éthiopie - zone aride'
  },
  {
    scientificName: 'Pogostemon cablin',
    commonName: 'Patchouli',
    latitude: -0.7893,
    longitude: 113.9213,
    locationDescription: 'Kalimantan occidental, Indonésie'
  },
  {
    scientificName: 'Cinnamomum verum',
    commonName: 'Cannelle de Ceylan',
    latitude: 6.9271,
    longitude: 79.8612,
    locationDescription: 'Région de Colombo, Sri Lanka - zone côtière'
  },
  {
    scientificName: 'Syzygium aromaticum',
    commonName: 'Giroflier',
    latitude: -6.1659,
    longitude: 39.2026,
    locationDescription: 'Zanzibar, Tanzanie - île aux épices'
  },
  {
    scientificName: 'Myroxylon balsamum',
    commonName: 'Baume du Pérou',
    latitude: 13.7942,
    longitude: -88.8965,
    locationDescription: 'Département de Sonsonate, El Salvador'
  },
  {
    scientificName: 'Liquidambar orientalis',
    commonName: 'Styrax de Turquie',
    latitude: 37.0662,
    longitude: 27.4289,
    locationDescription: 'Région de Muğla, sud-ouest de la Turquie'
  },
  {
    scientificName: 'Styrax benzoin',
    commonName: 'Benjoin de Sumatra',
    latitude: 2.1154,
    longitude: 99.5451,
    locationDescription: 'Sumatra du Nord, Indonésie - hautes terres'
  },
  {
    scientificName: 'Cistus ladanifer',
    commonName: 'Ciste ladanifère',
    latitude: 37.3891,
    longitude: -5.9845,
    locationDescription: 'Andalousie, Espagne - maquis méditerranéen'
  },
  {
    scientificName: 'Nardostachys jatamansi',
    commonName: 'Nard de l\'Himalaya',
    latitude: 28.3949,
    longitude: 84.1240,
    locationDescription: 'Région de Gandaki, Népal - haute altitude (3000-5000m)'
  }
];

console.log('🗺️  Enrichissement des coordonnées GPS pour 12 espèces...\n');

let updatedCount = 0;
let notFoundCount = 0;

for (const species of speciesGPSData) {
  try {
    // Rechercher la plante par nom scientifique
    const plant = db.prepare(`
      SELECT id, scientific_name, common_name 
      FROM plants 
      WHERE scientific_name = ? OR common_name = ?
    `).get(species.scientificName, species.commonName);

    if (plant) {
      // Mettre à jour les coordonnées GPS
      db.prepare(`
        UPDATE plants 
        SET 
          latitude = ?,
          longitude = ?,
          location_description = ?
        WHERE id = ?
      `).run(
        species.latitude,
        species.longitude,
        species.locationDescription,
        plant.id
      );

      console.log(`✅ ${species.scientificName} (${species.commonName})`);
      console.log(`   📍 Coordonnées: ${species.latitude}, ${species.longitude}`);
      console.log(`   📝 Localisation: ${species.locationDescription}\n`);
      updatedCount++;
    } else {
      console.log(`⚠️  Plante non trouvée: ${species.scientificName} (${species.commonName})\n`);
      notFoundCount++;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de ${species.scientificName}:`, error.message);
  }
}

console.log('\n📊 Résumé de l\'enrichissement:');
console.log(`   ✅ ${updatedCount} espèces enrichies avec succès`);
console.log(`   ⚠️  ${notFoundCount} espèces non trouvées dans la base`);

db.close();
console.log('\n✨ Enrichissement GPS terminé!');
