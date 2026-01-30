import mysql from 'mysql2/promise';

// Connexion à la base de données
const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== ENRICHISSEMENT DES COORDONNÉES GPS ===\n');

/**
 * Coordonnées GPS précises pour les espèces menacées
 * Basées sur les régions natives et les zones de répartition connues
 */
const gpsData = [
  // Boswellia (encens) - Afrique de l'Est et Péninsule arabique
  { name: 'Boswellia sacra', lat: 17.0742, lng: 54.0951, region: 'Oman (Dhofar)' },
  { name: 'Boswellia carterii', lat: 10.4478, lng: 51.0889, region: 'Somalie' },
  { name: 'Boswellia frereana', lat: 11.2867, lng: 49.0833, region: 'Somalie (Puntland)' },
  { name: 'Boswellia papyrifera', lat: 15.3333, lng: 38.9333, region: 'Éthiopie (Tigray)' },
  { name: 'Boswellia serrata', lat: 23.0225, lng: 72.5714, region: 'Inde (Gujarat)' },
  
  // Santalum (bois de santal) - Inde et Pacifique
  { name: 'Santalum album', lat: 12.9716, lng: 77.5946, region: 'Inde (Karnataka)' },
  { name: 'Santalum spicatum', lat: -31.9505, lng: 115.8605, region: 'Australie (Western Australia)' },
  
  // Aquilaria (oud/agarwood) - Asie du Sud-Est
  { name: 'Aquilaria malaccensis', lat: 3.1390, lng: 101.6869, region: 'Malaisie' },
  { name: 'Aquilaria crassna', lat: 13.7563, lng: 100.5018, region: 'Thaïlande' },
  { name: 'Aquilaria sinensis', lat: 23.1291, lng: 113.2644, region: 'Chine (Guangdong)' },
  
  // Dalbergia (bois de rose) - Madagascar et Amérique du Sud
  { name: 'Dalbergia maritima', lat: -18.8792, lng: 47.5079, region: 'Madagascar' },
  { name: 'Dalbergia nigra', lat: -22.9068, lng: -43.1729, region: 'Brésil (Rio de Janeiro)' },
  
  // Palo Santo - Amérique du Sud
  { name: 'Bursera graveolens', lat: -2.1894, lng: -79.8866, region: 'Équateur (Guayaquil)' },
  
  // Vétiver - Haïti et Inde
  { name: 'Chrysopogon zizanioides', lat: 18.5944, lng: -72.3074, region: 'Haïti' },
  
  // Ylang-ylang - Comores et Madagascar
  { name: 'Cananga odorata', lat: -12.1696, lng: 44.2530, region: 'Comores (Anjouan)' },
  
  // Rose - Bulgarie et Turquie
  { name: 'Rosa damascena', lat: 42.6977, lng: 23.3219, region: 'Bulgarie (Vallée des Roses)' },
  
  // Jasmin - Inde et Égypte
  { name: 'Jasminum sambac', lat: 28.7041, lng: 77.1025, region: 'Inde (Delhi)' },
  { name: 'Jasminum grandiflorum', lat: 30.0444, lng: 31.2357, region: 'Égypte (Le Caire)' },
  
  // Néroli - Tunisie et Maroc
  { name: 'Citrus aurantium', lat: 36.8065, lng: 10.1815, region: 'Tunisie (Nabeul)' },
  
  // Patchouli - Indonésie
  { name: 'Pogostemon cablin', lat: -0.7893, lng: 113.9213, region: 'Indonésie (Kalimantan)' },
  
  // Autres espèces menacées
  { name: 'Commiphora myrrha', lat: 15.5527, lng: 48.5164, region: 'Yémen' },
  { name: 'Styrax benzoin', lat: 3.5952, lng: 98.6722, region: 'Indonésie (Sumatra)' },
];

console.log(`Mise à jour de ${gpsData.length} espèces avec coordonnées GPS précises...\n`);

let updated = 0;
let notFound = 0;

for (const data of gpsData) {
  try {
    // Chercher la plante par nom (name ou latin_name)
    const [rows] = await connection.execute(
      'SELECT id FROM plants WHERE name = ? OR latin_name = ? LIMIT 1',
      [data.name, data.name]
    );
    
    if (rows.length === 0) {
      console.log(`❌ Plante non trouvée: ${data.name}`);
      notFound++;
      continue;
    }
    
    const plantId = rows[0].id;
    
    // Mettre à jour avec coordonnées GPS
    await connection.execute(
      'UPDATE plants SET latitude = ?, longitude = ?, origin = ? WHERE id = ?',
      [data.lat, data.lng, data.region, plantId]
    );
    
    console.log(`✅ ${data.name} → ${data.lat}, ${data.lng} (${data.region})`);
    updated++;
  } catch (error) {
    console.error(`❌ Erreur pour ${data.name}:`, error.message);
  }
}

console.log(`\n=== RÉSUMÉ ===`);
console.log(`✅ Mises à jour réussies: ${updated}`);
console.log(`❌ Plantes non trouvées: ${notFound}`);

await connection.end();
console.log('\n✨ Enrichissement GPS terminé !');
