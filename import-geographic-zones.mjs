import mysql from 'mysql2/promise';

// Connexion à la base de données
const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== IMPORT DES ZONES GÉOGRAPHIQUES ===\n');

/**
 * Zones géographiques pour les overlays sur la carte
 * Chaque zone définit un polygone avec des coordonnées GPS
 */
const zones = [
  {
    name: 'Somalie - Zone critique Boswellia',
    region: 'Afrique de l\'Est',
    zoneType: 'threatened_concentration',
    coordinates: [
      { lat: 12.0, lng: 49.0 },
      { lat: 12.0, lng: 51.5 },
      { lat: 10.0, lng: 51.5 },
      { lat: 10.0, lng: 49.0 },
    ],
    description: 'Zone à forte concentration d\'espèces Boswellia menacées (B. carterii, B. frereana)',
    threatLevel: 'critical',
    speciesCount: 2,
    conservationPriority: 'urgent',
    overlayColor: '#DC2626', // Rouge foncé
    overlayOpacity: 0.40,
    sustainableAlternatives: 'Boswellia serrata (Inde), Boswellia papyrifera (Éthiopie)',
    conservationEfforts: 'Programmes de reforestation en cours, certification CITES',
  },
  {
    name: 'Oman - Dhofar (Boswellia sacra)',
    region: 'Péninsule arabique',
    zoneType: 'conservation_area',
    coordinates: [
      { lat: 18.0, lng: 53.5 },
      { lat: 18.0, lng: 55.0 },
      { lat: 16.5, lng: 55.0 },
      { lat: 16.5, lng: 53.5 },
    ],
    description: 'Zone de conservation du Boswellia sacra (encens royal)',
    threatLevel: 'high',
    speciesCount: 1,
    conservationPriority: 'high',
    overlayColor: '#F59E0B', // Orange
    overlayOpacity: 0.35,
    sustainableAlternatives: 'Récolte contrôlée, certification bio',
    conservationEfforts: 'Réserves naturelles, quotas de récolte',
  },
  {
    name: 'Asie du Sud-Est - Triangle Aquilaria',
    region: 'Asie du Sud-Est',
    zoneType: 'threatened_concentration',
    coordinates: [
      { lat: 15.0, lng: 100.0 },
      { lat: 15.0, lng: 115.0 },
      { lat: 2.0, lng: 115.0 },
      { lat: 2.0, lng: 100.0 },
    ],
    description: 'Zone critique pour Aquilaria (oud/agarwood) - Thaïlande, Malaisie, Indonésie',
    threatLevel: 'critical',
    speciesCount: 3,
    conservationPriority: 'urgent',
    overlayColor: '#DC2626', // Rouge foncé
    overlayOpacity: 0.40,
    sustainableAlternatives: 'Plantations certifiées, oud synthétique',
    conservationEfforts: 'CITES Appendix II, programmes de plantation',
  },
  {
    name: 'Inde du Sud - Karnataka (Santalum album)',
    region: 'Inde',
    zoneType: 'conservation_area',
    coordinates: [
      { lat: 14.0, lng: 76.0 },
      { lat: 14.0, lng: 79.0 },
      { lat: 11.5, lng: 79.0 },
      { lat: 11.5, lng: 76.0 },
    ],
    description: 'Zone de conservation du bois de santal indien (Santalum album)',
    threatLevel: 'high',
    speciesCount: 1,
    conservationPriority: 'high',
    overlayColor: '#F59E0B', // Orange
    overlayOpacity: 0.35,
    sustainableAlternatives: 'Santalum spicatum (Australie), plantations contrôlées',
    conservationEfforts: 'Protection gouvernementale, plantations certifiées',
  },
  {
    name: 'Madagascar - Forêts de Dalbergia',
    region: 'Madagascar',
    zoneType: 'threatened_concentration',
    coordinates: [
      { lat: -12.0, lng: 43.0 },
      { lat: -12.0, lng: 50.5 },
      { lat: -25.5, lng: 50.5 },
      { lat: -25.5, lng: 43.0 },
    ],
    description: 'Zone critique pour les bois de rose (Dalbergia spp.)',
    threatLevel: 'critical',
    speciesCount: 2,
    conservationPriority: 'urgent',
    overlayColor: '#DC2626', // Rouge foncé
    overlayOpacity: 0.40,
    sustainableAlternatives: 'Bois certifiés FSC, alternatives synthétiques',
    conservationEfforts: 'CITES Appendix II, lutte contre le trafic',
  },
  {
    name: 'Bulgarie - Vallée des Roses',
    region: 'Europe de l\'Est',
    zoneType: 'sustainable_alternatives',
    coordinates: [
      { lat: 42.8, lng: 23.0 },
      { lat: 42.8, lng: 25.5 },
      { lat: 42.4, lng: 25.5 },
      { lat: 42.4, lng: 23.0 },
    ],
    description: 'Zone de production durable de rose de Damas (Rosa damascena)',
    threatLevel: 'stable',
    speciesCount: 1,
    conservationPriority: 'low',
    overlayColor: '#10B981', // Vert
    overlayOpacity: 0.30,
    sustainableAlternatives: 'Production locale certifiée bio',
    conservationEfforts: 'Appellation d\'origine protégée, agriculture durable',
  },
  {
    name: 'Comores - Archipel Ylang-Ylang',
    region: 'Océan Indien',
    zoneType: 'biodiversity_hotspot',
    coordinates: [
      { lat: -11.5, lng: 43.0 },
      { lat: -11.5, lng: 44.5 },
      { lat: -12.5, lng: 44.5 },
      { lat: -12.5, lng: 43.0 },
    ],
    description: 'Point chaud de biodiversité - Production d\'ylang-ylang (Cananga odorata)',
    threatLevel: 'medium',
    speciesCount: 1,
    conservationPriority: 'medium',
    overlayColor: '#3B82F6', // Bleu
    overlayOpacity: 0.30,
    sustainableAlternatives: 'Production certifiée bio, commerce équitable',
    conservationEfforts: 'Coopératives locales, certification bio',
  },
  {
    name: 'Indonésie - Kalimantan (Patchouli)',
    region: 'Asie du Sud-Est',
    zoneType: 'sustainable_alternatives',
    coordinates: [
      { lat: 2.0, lng: 109.0 },
      { lat: 2.0, lng: 119.0 },
      { lat: -4.0, lng: 119.0 },
      { lat: -4.0, lng: 109.0 },
    ],
    description: 'Zone de production durable de patchouli (Pogostemon cablin)',
    threatLevel: 'stable',
    speciesCount: 1,
    conservationPriority: 'low',
    overlayColor: '#10B981', // Vert
    overlayOpacity: 0.30,
    sustainableAlternatives: 'Production locale certifiée',
    conservationEfforts: 'Agriculture durable, certification bio',
  },
];

console.log(`Import de ${zones.length} zones géographiques...\n`);

let imported = 0;

for (const zone of zones) {
  try {
    const [result] = await connection.execute(
      `INSERT INTO geographic_zones (
        name, region, zone_type, coordinates, description, 
        threat_level, species_count, conservation_priority,
        overlay_color, overlay_opacity,
        sustainable_alternatives, conservation_efforts
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        zone.name,
        zone.region,
        zone.zoneType,
        JSON.stringify(zone.coordinates),
        zone.description,
        zone.threatLevel,
        zone.speciesCount,
        zone.conservationPriority,
        zone.overlayColor,
        zone.overlayOpacity,
        zone.sustainableAlternatives,
        zone.conservationEfforts,
      ]
    );
    
    console.log(`✅ ${zone.name} (${zone.zoneType}) - ${zone.coordinates.length} points`);
    imported++;
  } catch (error) {
    console.error(`❌ Erreur pour ${zone.name}:`, error.message);
  }
}

console.log(`\n=== RÉSUMÉ ===`);
console.log(`✅ Zones importées: ${imported}`);

await connection.end();
console.log('\n✨ Import des zones géographiques terminé !');
