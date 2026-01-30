/**
 * Script d'import des variétés de cannabis et tabac
 * Données extraites de cannabis-varieties-terpenes.md et tobacco-molecules.md
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

// Parse DATABASE_URL
function parseDbUrl(url) {
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid DATABASE_URL');
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5].split('?')[0],
  };
}

// Cannabis Landraces Data
const cannabisVarieties = [
  // Asie du Sud - Inde
  { name: "Kerala Gold", region: "Kerala, Inde", status: "endangered", terpenes: ["Limonène", "Myrcène", "Pinène"], notes: "Sativa pure, effets énergisants", category: "india" },
  { name: "Malana Cream", region: "Himachal Pradesh, Inde", status: "endangered", terpenes: ["Myrcène", "Caryophyllène", "Pinène"], notes: "Célèbre pour le charas", category: "india" },
  { name: "Idukki Gold", region: "Kerala, Inde", status: "critical", terpenes: ["Limonène", "Terpinolène"], notes: "Landrace légendaire", category: "india" },
  { name: "Manipuri", region: "Manipur, Inde", status: "vulnerable", terpenes: ["Pinène", "Myrcène"], notes: "Sativa tropicale", category: "india" },
  { name: "Naga Sativa", region: "Nagaland, Inde", status: "critical", terpenes: ["Terpinolène", "Ocimène"], notes: "Isolée génétiquement", category: "india" },
  { name: "Shillong", region: "Meghalaya, Inde", status: "endangered", terpenes: ["Myrcène", "Limonène"], notes: "Haute altitude", category: "india" },
  
  // Asie du Sud-Est
  { name: "Thai (Thai Stick)", region: "Thaïlande", status: "endangered", terpenes: ["Terpinolène", "Limonène", "Pinène"], notes: "Sativa pure, floraison longue", category: "southeast_asia" },
  { name: "Chocolate Thai", region: "Thaïlande", status: "critical", terpenes: ["Caryophyllène", "Myrcène"], notes: "Notes chocolatées", category: "southeast_asia" },
  { name: "Highland Thai", region: "Nord Thaïlande", status: "vulnerable", terpenes: ["Pinène", "Limonène"], notes: "Haute altitude", category: "southeast_asia" },
  { name: "Cambodian", region: "Cambodge", status: "vulnerable", terpenes: ["Myrcène", "Terpinolène"], notes: "Sativa équatoriale", category: "southeast_asia" },
  { name: "Laotian", region: "Laos", status: "critical", terpenes: ["Limonène", "Pinène"], notes: "Peu documentée", category: "southeast_asia" },
  { name: "Vietnamese Black", region: "Vietnam", status: "critical", terpenes: ["Myrcène", "Caryophyllène"], notes: "Feuilles sombres", category: "southeast_asia" },
  
  // Afghanistan et Pakistan
  { name: "Afghan Kush", region: "Hindu Kush, Afghanistan", status: "endangered", terpenes: ["Myrcène", "Caryophyllène", "Limonène"], notes: "Indica pure, résine abondante", category: "central_asia" },
  { name: "Mazar-i-Sharif", region: "Nord Afghanistan", status: "critical", terpenes: ["Myrcène", "Pinène", "Humulène"], notes: "Région de haschich traditionnel", category: "central_asia" },
  { name: "Kandahar", region: "Sud Afghanistan", status: "endangered", terpenes: ["Caryophyllène", "Myrcène"], notes: "Climat aride", category: "central_asia" },
  { name: "Chitral", region: "Pakistan (KPK)", status: "vulnerable", terpenes: ["Myrcène", "Pinène"], notes: "Couleurs pourpres", category: "central_asia" },
  { name: "Pakistani Kush", region: "Vallée de Swat, Pakistan", status: "endangered", terpenes: ["Myrcène", "Limonène"], notes: "Résistante au froid", category: "central_asia" },
  { name: "Balkh", region: "Nord Afghanistan", status: "critical", terpenes: ["Caryophyllène", "Humulène"], notes: "Ancienne route de la soie", category: "central_asia" },
  { name: "Uzbeki", region: "Ouzbékistan", status: "critical", terpenes: ["Myrcène", "Pinène"], notes: "Peu documentée", category: "central_asia" },
  { name: "Tajik", region: "Tadjikistan", status: "critical", terpenes: ["Caryophyllène", "Myrcène"], notes: "Montagnes du Pamir", category: "central_asia" },
  { name: "Turkmen", region: "Turkménistan", status: "critical", terpenes: ["Pinène", "Myrcène"], notes: "Désertique", category: "central_asia" },
  
  // Afrique
  { name: "Durban Poison", region: "Afrique du Sud", status: "stable", terpenes: ["Terpinolène", "Myrcène", "Ocimène"], notes: "Sativa pure, très aromatique", category: "africa" },
  { name: "Swazi Gold", region: "Eswatini", status: "vulnerable", terpenes: ["Limonène", "Pinène"], notes: "Montagnes du Swaziland", category: "africa" },
  { name: "Malawi Gold", region: "Malawi", status: "endangered", terpenes: ["Limonène", "Terpinolène"], notes: "Floraison très longue", category: "africa" },
  { name: "Kilimanjaro", region: "Tanzanie", status: "critical", terpenes: ["Pinène", "Limonène"], notes: "Haute altitude", category: "africa" },
  { name: "Ethiopian Highland", region: "Éthiopie", status: "critical", terpenes: ["Terpinolène", "Myrcène"], notes: "Génétique ancienne", category: "africa" },
  { name: "Congo", region: "RD Congo", status: "vulnerable", terpenes: ["Myrcène", "Limonène"], notes: "Forêt équatoriale", category: "africa" },
  { name: "Nigerian", region: "Nigeria", status: "vulnerable", terpenes: ["Limonène", "Caryophyllène"], notes: "Afrique de l'Ouest", category: "africa" },
  { name: "Senegalese", region: "Sénégal", status: "vulnerable", terpenes: ["Pinène", "Myrcène"], notes: "Sahel", category: "africa" },
  
  // Amérique Centrale et Mexique
  { name: "Acapulco Gold", region: "Guerrero, Mexique", status: "critical", terpenes: ["Limonène", "Myrcène", "Caryophyllène"], notes: "Légendaire, dorée", category: "central_america" },
  { name: "Oaxacan", region: "Oaxaca, Mexique", status: "endangered", terpenes: ["Limonène", "Pinène"], notes: "Montagnes du sud", category: "central_america" },
  { name: "Michoacán", region: "Michoacán, Mexique", status: "vulnerable", terpenes: ["Myrcène", "Limonène"], notes: "Sativa mexicaine", category: "central_america" },
  { name: "Punto Rojo", region: "Colombie", status: "critical", terpenes: ["Limonène", "Terpinolène"], notes: "Point rouge", category: "central_america" },
  { name: "Santa Marta Gold", region: "Colombie", status: "endangered", terpenes: ["Limonène", "Myrcène"], notes: "Sierra Nevada", category: "central_america" },
  { name: "Panama Red", region: "Panama", status: "critical", terpenes: ["Terpinolène", "Limonène", "Pinène"], notes: "Couleur rougeâtre", category: "central_america" },
  
  // Amérique du Sud
  { name: "Colombian Gold", region: "Colombie", status: "endangered", terpenes: ["Limonène", "Caryophyllène"], notes: "Années 70", category: "south_america" },
  { name: "Lamb's Bread", region: "Jamaïque", status: "vulnerable", terpenes: ["Limonène", "Myrcène"], notes: "Associée à Bob Marley", category: "caribbean" },
  { name: "Brazilian", region: "Brésil", status: "vulnerable", terpenes: ["Myrcène", "Pinène"], notes: "Amazonie", category: "south_america" },
  { name: "Peruvian", region: "Pérou", status: "critical", terpenes: ["Limonène", "Terpinolène"], notes: "Andes", category: "south_america" },
  
  // Amérique du Nord (Hawaï)
  { name: "Hawaiian", region: "Hawaï, USA", status: "vulnerable", terpenes: ["Limonène", "Myrcène", "Terpinolène"], notes: "Climat tropical", category: "north_america" },
  { name: "Maui Wowie", region: "Maui, Hawaï, USA", status: "vulnerable", terpenes: ["Limonène", "Pinène"], notes: "Volcanique", category: "north_america" },
  { name: "Kona Gold", region: "Big Island, Hawaï, USA", status: "critical", terpenes: ["Myrcène", "Limonène"], notes: "Café et cannabis", category: "north_america" },
];

// Tobacco Varieties Data
const tobaccoVarieties = [
  // Tabacs principaux
  { name: "Virginia (Flue-Cured)", region: "Virginie, USA", status: "stable", profile: "Sucré, foin, miel, notes fruitées légères", compounds: ["β-damascenone", "α-ionone", "dihydro-β-ionone"], category: "main" },
  { name: "Burley (Air-Cured)", region: "Kentucky, USA", status: "stable", profile: "Noisette, chocolat, terreux, léger fumé", compounds: ["Solanone", "Neophytadiene", "β-damascenone"], category: "main" },
  { name: "Latakia (Fire-Cured)", region: "Syrie/Chypre", status: "endangered", profile: "Très fumé, cuir, camphré, épicé", compounds: ["Guaiacol", "4-vinylguaiacol", "Créosol"], category: "main" },
  { name: "Perique (Fermenté)", region: "Louisiane, USA", status: "vulnerable", profile: "Fruité fermenté, prune, figue, épicé, poivré", compounds: ["Esters fruités", "Acides organiques"], category: "main" },
  
  // Tabacs Orientaux
  { name: "Yenidje", region: "Grèce/Turquie", status: "vulnerable", profile: "Arôme complexe, floral-épicé", compounds: ["Norisoprénoïdes"], category: "oriental" },
  { name: "Samsun", region: "Turquie", status: "vulnerable", profile: "Doux, aromatique, légèrement sucré", compounds: ["Norisoprénoïdes"], category: "oriental" },
  { name: "Basma", region: "Grèce", status: "vulnerable", profile: "Fin, délicat, floral", compounds: ["Norisoprénoïdes"], category: "oriental" },
  { name: "Katerini", region: "Grèce", status: "vulnerable", profile: "Épicé, terreux, riche", compounds: ["Norisoprénoïdes"], category: "oriental" },
  { name: "Drama", region: "Grèce", status: "vulnerable", profile: "Herbacé, légèrement fumé", compounds: ["Norisoprénoïdes"], category: "oriental" },
  { name: "Izmir/Smyrna", region: "Turquie", status: "vulnerable", profile: "Aromatique, doux, fruité", compounds: ["Norisoprénoïdes"], category: "oriental" },
  
  // Tabacs Orientaux Rares
  { name: "Xanthi", region: "Grèce (Thrace)", status: "vulnerable", profile: "Floral, miel, épicé", compounds: ["Norisoprénoïdes"], category: "oriental_rare" },
  { name: "Bashi Bagli", region: "Turquie", status: "vulnerable", profile: "Herbacé, doux", compounds: ["Norisoprénoïdes"], category: "oriental_rare" },
  { name: "Dubek", region: "Macédoine", status: "critical", profile: "Aromatique, complexe", compounds: ["Norisoprénoïdes"], category: "oriental_rare" },
  { name: "Djebel", region: "Syrie", status: "endangered", profile: "Épicé, résineux", compounds: ["Norisoprénoïdes"], category: "oriental_rare" },
  
  // Tabacs Américains Patrimoniaux
  { name: "Orinoco", region: "Venezuela/Virginie", status: "critical", profile: "Doux, aromatique", compounds: ["Norisoprénoïdes"], category: "american_heritage" },
  { name: "Havana Seed", region: "Cuba/Connecticut", status: "vulnerable", profile: "Riche, terreux", compounds: ["Norisoprénoïdes"], category: "american_heritage" },
  { name: "Maryland 609", region: "Maryland, USA", status: "vulnerable", profile: "Neutre, léger", compounds: ["Norisoprénoïdes"], category: "american_heritage" },
  { name: "Dark Fired Kentucky", region: "Kentucky, USA", status: "stable", profile: "Fumé intense, bacon", compounds: ["Guaiacol", "Phénols"], category: "american_heritage" },
];

// Map conservation status
function mapStatus(status) {
  const statusMap = {
    'critical': 'critical',
    'endangered': 'endangered',
    'vulnerable': 'vulnerable',
    'stable': 'stable',
    'rare': 'vulnerable',
    'very_rare': 'critical',
  };
  return statusMap[status] || 'unknown';
}

// Get country from region
function getCountry(region) {
  if (region.includes('Inde')) return 'Inde';
  if (region.includes('Thaïlande')) return 'Thaïlande';
  if (region.includes('Cambodge')) return 'Cambodge';
  if (region.includes('Laos')) return 'Laos';
  if (region.includes('Vietnam')) return 'Vietnam';
  if (region.includes('Afghanistan')) return 'Afghanistan';
  if (region.includes('Pakistan')) return 'Pakistan';
  if (region.includes('Ouzbékistan')) return 'Ouzbékistan';
  if (region.includes('Tadjikistan')) return 'Tadjikistan';
  if (region.includes('Turkménistan')) return 'Turkménistan';
  if (region.includes('Afrique du Sud')) return 'Afrique du Sud';
  if (region.includes('Eswatini')) return 'Eswatini';
  if (region.includes('Malawi')) return 'Malawi';
  if (region.includes('Tanzanie')) return 'Tanzanie';
  if (region.includes('Éthiopie')) return 'Éthiopie';
  if (region.includes('Congo')) return 'RD Congo';
  if (region.includes('Nigeria')) return 'Nigeria';
  if (region.includes('Sénégal')) return 'Sénégal';
  if (region.includes('Mexique')) return 'Mexique';
  if (region.includes('Colombie')) return 'Colombie';
  if (region.includes('Panama')) return 'Panama';
  if (region.includes('Jamaïque')) return 'Jamaïque';
  if (region.includes('Brésil')) return 'Brésil';
  if (region.includes('Pérou')) return 'Pérou';
  if (region.includes('Hawaï') || region.includes('USA')) return 'États-Unis';
  if (region.includes('Virginie') || region.includes('Kentucky') || region.includes('Maryland') || region.includes('Louisiane')) return 'États-Unis';
  if (region.includes('Syrie')) return 'Syrie';
  if (region.includes('Chypre')) return 'Chypre';
  if (region.includes('Grèce')) return 'Grèce';
  if (region.includes('Turquie')) return 'Turquie';
  if (region.includes('Macédoine')) return 'Macédoine du Nord';
  if (region.includes('Venezuela')) return 'Venezuela';
  if (region.includes('Cuba')) return 'Cuba';
  return region.split(',')[0].trim();
}

// Get coordinates for regions (approximate)
const regionCoordinates = {
  // Inde
  'Kerala, Inde': { lat: 10.8505, lng: 76.2711 },
  'Himachal Pradesh, Inde': { lat: 31.1048, lng: 77.1734 },
  'Manipur, Inde': { lat: 24.6637, lng: 93.9063 },
  'Nagaland, Inde': { lat: 26.1584, lng: 94.5624 },
  'Meghalaya, Inde': { lat: 25.4670, lng: 91.3662 },
  // Asie du Sud-Est
  'Thaïlande': { lat: 15.8700, lng: 100.9925 },
  'Nord Thaïlande': { lat: 18.7883, lng: 98.9853 },
  'Cambodge': { lat: 12.5657, lng: 104.9910 },
  'Laos': { lat: 19.8563, lng: 102.4955 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  // Asie Centrale
  'Hindu Kush, Afghanistan': { lat: 35.8333, lng: 70.5000 },
  'Nord Afghanistan': { lat: 36.7000, lng: 67.1000 },
  'Sud Afghanistan': { lat: 31.6289, lng: 65.7372 },
  'Pakistan (KPK)': { lat: 35.2227, lng: 71.9496 },
  'Vallée de Swat, Pakistan': { lat: 35.2227, lng: 72.3560 },
  'Ouzbékistan': { lat: 41.3775, lng: 64.5853 },
  'Tadjikistan': { lat: 38.8610, lng: 71.2761 },
  'Turkménistan': { lat: 38.9697, lng: 59.5563 },
  // Afrique
  'Afrique du Sud': { lat: -30.5595, lng: 22.9375 },
  'Eswatini': { lat: -26.5225, lng: 31.4659 },
  'Malawi': { lat: -13.2543, lng: 34.3015 },
  'Tanzanie': { lat: -6.3690, lng: 34.8888 },
  'Éthiopie': { lat: 9.1450, lng: 40.4897 },
  'RD Congo': { lat: -4.0383, lng: 21.7587 },
  'Nigeria': { lat: 9.0820, lng: 8.6753 },
  'Sénégal': { lat: 14.4974, lng: -14.4524 },
  // Amériques
  'Guerrero, Mexique': { lat: 17.4392, lng: -99.5451 },
  'Oaxaca, Mexique': { lat: 17.0732, lng: -96.7266 },
  'Michoacán, Mexique': { lat: 19.5665, lng: -101.7068 },
  'Colombie': { lat: 4.5709, lng: -74.2973 },
  'Panama': { lat: 8.5380, lng: -80.7821 },
  'Jamaïque': { lat: 18.1096, lng: -77.2975 },
  'Brésil': { lat: -14.2350, lng: -51.9253 },
  'Pérou': { lat: -9.1900, lng: -75.0152 },
  'Hawaï, USA': { lat: 19.8968, lng: -155.5828 },
  'Maui, Hawaï, USA': { lat: 20.7984, lng: -156.3319 },
  'Big Island, Hawaï, USA': { lat: 19.5429, lng: -155.6659 },
  // Tabac
  'Virginie, USA': { lat: 37.4316, lng: -78.6569 },
  'Kentucky, USA': { lat: 37.8393, lng: -84.2700 },
  'Louisiane, USA': { lat: 30.9843, lng: -91.9623 },
  'Maryland, USA': { lat: 39.0458, lng: -76.6413 },
  'Syrie/Chypre': { lat: 35.1264, lng: 33.4299 },
  'Grèce/Turquie': { lat: 39.0742, lng: 21.8243 },
  'Turquie': { lat: 38.9637, lng: 35.2433 },
  'Grèce': { lat: 39.0742, lng: 21.8243 },
  'Grèce (Thrace)': { lat: 41.1172, lng: 25.4082 },
  'Macédoine': { lat: 41.5124, lng: 21.7465 },
  'Venezuela/Virginie': { lat: 6.4238, lng: -66.5897 },
  'Cuba/Connecticut': { lat: 22.0000, lng: -79.5000 },
};

async function main() {
  console.log('🌿 Import des variétés de cannabis et tabac...\n');
  
  const dbConfig = parseDbUrl(DATABASE_URL);
  const connection = await mysql.createConnection({
    ...dbConfig,
    ssl: { rejectUnauthorized: true }
  });
  
  try {
    // First, get or create plant IDs for Cannabis and Tobacco
    let [cannabisPlants] = await connection.execute(
      "SELECT id FROM plants WHERE name LIKE '%Cannabis%' OR latin_name LIKE '%Cannabis%' OR category = 'cannabis' LIMIT 1"
    );
    let [tobaccoPlants] = await connection.execute(
      "SELECT id FROM plants WHERE name LIKE '%Tabac%' OR latin_name LIKE '%Nicotiana%' OR category = 'tabac' LIMIT 1"
    );
    
    let cannabisPlantId = cannabisPlants[0]?.id;
    let tobaccoPlantId = tobaccoPlants[0]?.id;
    
    // Create Cannabis plant if not exists
    if (!cannabisPlantId) {
      const [result] = await connection.execute(
        `INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, notes, created_at, updated_at) 
         VALUES ('Cannabis', 'Cannabis sativa L.', 'Cannabaceae', 'cannabis', 'Asie Centrale', 'Herbacé, terreux, résineux avec notes florales et épicées selon les variétés', 'Plante annuelle cultivée pour ses propriétés aromatiques et médicinales.', NOW(), NOW())`
      );
      cannabisPlantId = result.insertId;
      console.log(`✅ Plante Cannabis créée (ID: ${cannabisPlantId})`);
    }
    
    // Create Tobacco plant if not exists
    if (!tobaccoPlantId) {
      const [result] = await connection.execute(
        `INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, notes, created_at, updated_at) 
         VALUES ('Tabac', 'Nicotiana tabacum L.', 'Solanaceae', 'tabac', 'Amérique du Sud', 'Foin, miel, fumé, terreux avec notes de fruits secs selon les variétés', 'Plante annuelle cultivée pour ses feuilles aromatiques.', NOW(), NOW())`
      );
      tobaccoPlantId = result.insertId;
      console.log(`✅ Plante Tabac créée (ID: ${tobaccoPlantId})`);
    }
    
    console.log(`\n📊 Cannabis Plant ID: ${cannabisPlantId}, Tobacco Plant ID: ${tobaccoPlantId}\n`);
    
    // Import Cannabis varieties
    console.log('🌿 Import des variétés de cannabis...');
    let cannabisCount = 0;
    
    for (const variety of cannabisVarieties) {
      const varietyId = `PV-CAN-${String(cannabisCount + 1).padStart(3, '0')}`;
      const coords = regionCoordinates[variety.region] || { lat: null, lng: null };
      const country = getCountry(variety.region);
      
      // Check if variety already exists
      const [existing] = await connection.execute(
        "SELECT id FROM plant_varieties WHERE name = ? AND plant_id = ?",
        [variety.name, cannabisPlantId]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${variety.name} existe déjà, ignoré`);
        continue;
      }
      
      const dominantMolecules = variety.terpenes.map((t, i) => ({
        molecule: t,
        percentage: 30 - (i * 10),
        role: i === 0 ? 'dominant' : 'secondary'
      }));
      
      const olfactiveNotes = {
        top: variety.terpenes.slice(0, 2),
        heart: variety.terpenes.slice(1, 3),
        base: ['Terreux', 'Herbacé']
      };
      
      await connection.execute(
        `INSERT INTO plant_varieties 
         (variety_id, plant_id, name, variety_type, country_of_origin, distinctive_features, 
          dominant_molecules, olfactive_description, olfactive_notes, conservation_status, 
          conservation_notes, notes, created_at, updated_at)
         VALUES (?, ?, ?, 'landrace', ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          varietyId,
          cannabisPlantId,
          variety.name,
          country,
          `Région: ${variety.region}. ${variety.notes}`,
          JSON.stringify(dominantMolecules),
          `Profil terpénique dominé par ${variety.terpenes.join(', ')}. ${variety.notes}`,
          JSON.stringify(olfactiveNotes),
          mapStatus(variety.status),
          `Statut: ${variety.status}. Catégorie géographique: ${variety.category}`,
          `Landrace cannabis - ${variety.region}`
        ]
      );
      
      cannabisCount++;
      console.log(`  ✅ ${variety.name} (${variety.region})`);
    }
    
    console.log(`\n📊 ${cannabisCount} variétés de cannabis importées\n`);
    
    // Import Tobacco varieties
    console.log('🚬 Import des variétés de tabac...');
    let tobaccoCount = 0;
    
    for (const variety of tobaccoVarieties) {
      const varietyId = `PV-TAB-${String(tobaccoCount + 1).padStart(3, '0')}`;
      const country = getCountry(variety.region);
      
      // Check if variety already exists
      const [existing] = await connection.execute(
        "SELECT id FROM plant_varieties WHERE name = ? AND plant_id = ?",
        [variety.name, tobaccoPlantId]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${variety.name} existe déjà, ignoré`);
        continue;
      }
      
      const dominantMolecules = variety.compounds.map((c, i) => ({
        molecule: c,
        percentage: 25 - (i * 8),
        role: i === 0 ? 'dominant' : 'secondary'
      }));
      
      const varietyType = variety.category === 'oriental' || variety.category === 'oriental_rare' 
        ? 'cultivar' 
        : variety.category === 'main' ? 'cultivar' : 'landrace';
      
      await connection.execute(
        `INSERT INTO plant_varieties 
         (variety_id, plant_id, name, variety_type, country_of_origin, distinctive_features, 
          dominant_molecules, olfactive_description, conservation_status, 
          conservation_notes, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          varietyId,
          tobaccoPlantId,
          variety.name,
          varietyType,
          country,
          `Région: ${variety.region}. Catégorie: ${variety.category}`,
          JSON.stringify(dominantMolecules),
          variety.profile,
          mapStatus(variety.status),
          `Statut: ${variety.status}. Composés caractéristiques: ${variety.compounds.join(', ')}`,
          `Variété de tabac - ${variety.region}`
        ]
      );
      
      tobaccoCount++;
      console.log(`  ✅ ${variety.name} (${variety.region})`);
    }
    
    console.log(`\n📊 ${tobaccoCount} variétés de tabac importées`);
    console.log(`\n✅ Import terminé: ${cannabisCount + tobaccoCount} variétés au total`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
