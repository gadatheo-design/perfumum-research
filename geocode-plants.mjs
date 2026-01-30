import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

// Base de données de coordonnées géographiques par région/pays
const geoDatabase = {
  // Amériques
  "Colombie": { lat: 4.5709, lng: -74.2973 },
  "Colombie (Andes/Chocó)": { lat: 5.0, lng: -76.5 },
  "Colombie (Santander, Huila)": { lat: 6.5, lng: -73.0 },
  "Colombie Caraïbe": { lat: 10.4, lng: -75.5 },
  "Amazonie": { lat: -3.4653, lng: -62.2159 },
  "Colombie; Amazonie": { lat: 0.0, lng: -72.0 },
  "Pérou": { lat: -9.19, lng: -75.0152 },
  "Brésil": { lat: -14.235, lng: -51.9253 },
  "Équateur": { lat: -1.8312, lng: -78.1834 },
  "Amazonie (Pérou, Brésil, Équateur)": { lat: -4.0, lng: -70.0 },
  "Mexique": { lat: 23.6345, lng: -102.5528 },
  "Guerrero, Mexique": { lat: 17.4392, lng: -99.5451 },
  "Mexique, Amérique centrale": { lat: 17.0, lng: -92.0 },
  "Mexique, Amérique centrale, Texas": { lat: 25.0, lng: -99.0 },
  "Panama": { lat: 8.538, lng: -80.7821 },
  "Jamaïque": { lat: 18.1096, lng: -77.2975 },
  "Cuba": { lat: 21.5218, lng: -77.7812 },
  "Colombie, Cuba": { lat: 15.0, lng: -76.0 },
  "Caraïbes": { lat: 15.0, lng: -75.0 },
  "Caraïbes; Colombie": { lat: 12.0, lng: -74.0 },
  "Caraïbes, San Andrés": { lat: 12.5847, lng: -81.7006 },
  "San Andrés": { lat: 12.5847, lng: -81.7006 },
  "Haïti": { lat: 18.9712, lng: -72.2852 },
  "Hawaï": { lat: 19.8968, lng: -155.5828 },
  "Maui, Hawaï": { lat: 20.7984, lng: -156.3319 },
  "Louisiane, USA (St. James Parish)": { lat: 30.0, lng: -90.8 },
  "États-Unis (Oregon, Washington), Angleterre, France": { lat: 45.0, lng: -120.0 },
  "Sud-Est des États-Unis, Amérique centrale": { lat: 30.0, lng: -85.0 },
  "Floride (USA)": { lat: 27.6648, lng: -81.5158 },
  "Californie (USA)": { lat: 36.7783, lng: -119.4179 },
  "Argentine": { lat: -38.4161, lng: -63.6167 },
  
  // Asie
  "Inde": { lat: 20.5937, lng: 78.9629 },
  "Kerala, Inde": { lat: 10.8505, lng: 76.2711 },
  "Himachal Pradesh, Inde": { lat: 31.1048, lng: 77.1734 },
  "Inde (Rajasthan, Madhya Pradesh, Gujarat)": { lat: 24.0, lng: 76.0 },
  "Asie tropicale, Inde": { lat: 15.0, lng: 80.0 },
  "Asie tropicale": { lat: 10.0, lng: 100.0 },
  "Asie tropicale, cultivé Caraïbes": { lat: 12.0, lng: -70.0 },
  "Asie, Méditerranée": { lat: 35.0, lng: 35.0 },
  "Asie centrale, Russie, France": { lat: 45.0, lng: 60.0 },
  "Asie, Europe, Amérique du Nord": { lat: 50.0, lng: 50.0 },
  "Afghanistan": { lat: 33.9391, lng: 67.71 },
  "Hindu Kush, Afghanistan": { lat: 35.5, lng: 70.5 },
  "Nord Afghanistan": { lat: 36.5, lng: 68.0 },
  "Sud Afghanistan": { lat: 31.5, lng: 65.0 },
  "Afghanistan / Pakistan (chaîne Hindu Kush)": { lat: 35.0, lng: 71.0 },
  "Pakistan": { lat: 30.3753, lng: 69.3451 },
  "Pakistan (KPK)": { lat: 34.0, lng: 71.5 },
  "Vallée de Swat, Pakistan": { lat: 35.2, lng: 72.3 },
  "Himalaya (Inde, Pakistan, Chine)": { lat: 28.0, lng: 84.0 },
  "Iran": { lat: 32.4279, lng: 53.688 },
  "Iran, Afghanistan, Turkménistan": { lat: 35.0, lng: 60.0 },
  "Inde, Iran, Égypte": { lat: 28.0, lng: 55.0 },
  "Thaïlande": { lat: 15.87, lng: 100.9925 },
  "Cambodge": { lat: 12.5657, lng: 104.991 },
  "Chine": { lat: 35.8617, lng: 104.1954 },
  "Philippines": { lat: 12.8797, lng: 121.774 },
  "Java (Indonésie)": { lat: -7.6145, lng: 110.7122 },
  
  // Afrique
  "Afrique du Sud": { lat: -30.5595, lng: 22.9375 },
  "Afrique du Sud (Cap)": { lat: -33.9249, lng: 18.4241 },
  "Éthiopie": { lat: 9.145, lng: 40.4897 },
  "Éthiopie, Érythrée, Soudan": { lat: 12.0, lng: 38.0 },
  "Éthiopie, Kenya": { lat: 4.0, lng: 38.0 },
  "Kenya": { lat: -0.0236, lng: 37.9062 },
  "Kenya, Somalie, Éthiopie": { lat: 5.0, lng: 42.0 },
  "Somalie": { lat: 5.1521, lng: 46.1996 },
  "Somalie, Éthiopie, Kenya": { lat: 5.0, lng: 42.0 },
  "Tanzanie": { lat: -6.369, lng: 34.8888 },
  "Malawi": { lat: -13.2543, lng: 34.3015 },
  "Eswatini": { lat: -26.5225, lng: 31.4659 },
  "Burkina Faso": { lat: 12.2383, lng: -1.5616 },
  "Burkina Faso; Afrique de l'Ouest": { lat: 12.0, lng: -2.0 },
  "Burkina Faso; Sahel": { lat: 14.0, lng: -1.0 },
  "Burkina Faso; Amazonie (écotypes)": { lat: 12.0, lng: -1.5 },
  "Afrique de l'Ouest": { lat: 10.0, lng: -5.0 },
  "Afrique tropicale": { lat: 0.0, lng: 20.0 },
  "Égypte": { lat: 26.8206, lng: 30.8025 },
  "Égypte, Afrique de Est": { lat: 20.0, lng: 35.0 },
  "Maroc": { lat: 31.7917, lng: -7.0926 },
  "Maroc (Rif, région de Ketama)": { lat: 34.9, lng: -4.6 },
  "Montagnes de l'Atlas (Maroc), Algérie": { lat: 32.0, lng: -2.0 },
  "Algérie": { lat: 28.0339, lng: 1.6596 },
  "Tunisie": { lat: 33.8869, lng: 9.5375 },
  "Côte d'Ivoire": { lat: 7.54, lng: -5.5471 },
  "Oman": { lat: 21.4735, lng: 55.9754 },
  "Afrique du Nord antique (disparue)": { lat: 32.0, lng: 20.0 },
  "Cyrénaïque (Libye antique)": { lat: 32.0, lng: 21.0 },
  
  // Europe
  "France": { lat: 46.2276, lng: 2.2137 },
  "Provence (France)": { lat: 43.9352, lng: 6.0679 },
  "Provence (France), Bulgarie, Espagne, Royaume-Uni": { lat: 43.9, lng: 6.0 },
  "France (Provence)": { lat: 43.9352, lng: 6.0679 },
  "Espagne": { lat: 40.4637, lng: -3.7492 },
  "Espagne, Tunisie, Maroc, France (Provence)": { lat: 38.0, lng: 0.0 },
  "Italie": { lat: 41.8719, lng: 12.5674 },
  "Calabre (Italie)": { lat: 38.9, lng: 16.6 },
  "Calabre (Italie), Côte d'Ivoire, Argentine": { lat: 38.9, lng: 16.6 },
  "Sicile (Italie)": { lat: 37.6, lng: 14.0 },
  "Sicile (Italie), Espagne, Argentine, Californie (USA)": { lat: 37.6, lng: 14.0 },
  "Italie (Toscane), Maroc": { lat: 43.4, lng: 11.0 },
  "Italie (Sicile)": { lat: 37.6, lng: 14.0 },
  "Bulgarie": { lat: 42.7339, lng: 25.4858 },
  "Bulgarie, Turquie, Iran, Maroc": { lat: 40.0, lng: 35.0 },
  "Turquie": { lat: 38.9637, lng: 35.2433 },
  "Grèce": { lat: 39.0742, lng: 21.8243 },
  "Grèce (Macédoine, Piérie)": { lat: 40.3, lng: 22.5 },
  "Grèce (Thrace, ancienne Yenidje)": { lat: 41.0, lng: 24.5 },
  "Chypre": { lat: 35.1264, lng: 33.4299 },
  "Syrie (Lattaquié) / Chypre": { lat: 35.5, lng: 35.8 },
  "Angleterre": { lat: 52.3555, lng: -1.1743 },
  "Royaume-Uni": { lat: 55.3781, lng: -3.436 },
  "Portugal": { lat: 39.3999, lng: -8.2245 },
  "Australie, Portugal, Espagne, Chine": { lat: -25.0, lng: 135.0 },
  
  // Océanie
  "Australie": { lat: -25.2744, lng: 133.7751 },
  
  // Régions génériques
  "Méditerranée": { lat: 35.0, lng: 18.0 },
  "Méditerranée orientale, Asie occidentale": { lat: 35.0, lng: 35.0 },
  "Bassin méditerranéen": { lat: 38.0, lng: 15.0 },
  "Bassin méditerranéen (France, Espagne, Maroc)": { lat: 40.0, lng: 0.0 },
  "Bassin méditerranéen (Provence, Balkans)": { lat: 42.0, lng: 15.0 },
  "Europe": { lat: 50.0, lng: 10.0 },
  "Europe, Méditerranée": { lat: 45.0, lng: 10.0 },
  "Europe centrale et du Nord, Asie": { lat: 52.0, lng: 20.0 },
  "Hémisphère Nord (Europe, Asie, Amérique)": { lat: 50.0, lng: 0.0 },
  "Amérique tropicale": { lat: 5.0, lng: -70.0 },
  "Colombie, Amérique tropicale": { lat: 5.0, lng: -72.0 },
  "Colombie; Andes; Caraïbes (cultivé)": { lat: 6.0, lng: -75.0 },
  "Colombie; Guyanes; Amazonie": { lat: 2.0, lng: -65.0 },
  "Brésil, Floride (USA), Espagne, Italie (Sicile)": { lat: -15.0, lng: -47.0 },
  "Île de la Réunion (Bourbon), Égypte, Maroc, Chine": { lat: -21.1151, lng: 55.5364 },
  "Île de la Réunion": { lat: -21.1151, lng: 55.5364 },
  "Haïti, Java (Indonésie), Île de la Réunion, Inde": { lat: 18.9712, lng: -72.2852 },
  "Haïti, Java, Réunion": { lat: 18.9712, lng: -72.2852 },
};

async function geocodePlants() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Lire les plantes sans coordonnées
  const [plants] = await connection.execute(
    'SELECT id, name, origin FROM plants WHERE latitude IS NULL OR longitude IS NULL'
  );
  
  console.log(`\n📍 Géocodage de ${plants.length} plantes...\n`);
  
  let updated = 0;
  let notFound = [];
  
  for (const plant of plants) {
    // Ignorer les entrées de test
    if (plant.name && plant.name.toLowerCase().includes('test')) {
      continue;
    }
    
    let coords = null;
    const origin = plant.origin;
    
    if (origin) {
      // Chercher une correspondance exacte
      if (geoDatabase[origin]) {
        coords = geoDatabase[origin];
      } else {
        // Chercher une correspondance partielle
        for (const [key, value] of Object.entries(geoDatabase)) {
          if (origin.includes(key) || key.includes(origin)) {
            coords = value;
            break;
          }
        }
        
        // Si toujours pas trouvé, chercher le premier pays/région mentionné
        if (!coords) {
          const parts = origin.split(/[,;]/);
          for (const part of parts) {
            const trimmed = part.trim();
            if (geoDatabase[trimmed]) {
              coords = geoDatabase[trimmed];
              break;
            }
            // Chercher dans les clés
            for (const [key, value] of Object.entries(geoDatabase)) {
              if (key.toLowerCase().includes(trimmed.toLowerCase()) || 
                  trimmed.toLowerCase().includes(key.toLowerCase())) {
                coords = value;
                break;
              }
            }
            if (coords) break;
          }
        }
      }
    }
    
    if (coords) {
      await connection.execute(
        'UPDATE plants SET latitude = ?, longitude = ? WHERE id = ?',
        [coords.lat, coords.lng, plant.id]
      );
      console.log(`✅ ${plant.name}: ${coords.lat}, ${coords.lng}`);
      updated++;
    } else {
      notFound.push({ id: plant.id, name: plant.name, origin: origin });
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`   - ${updated} plantes géocodées`);
  console.log(`   - ${notFound.length} plantes sans correspondance`);
  
  if (notFound.length > 0) {
    console.log(`\n⚠️ Plantes non géocodées:`);
    notFound.forEach(p => console.log(`   - ${p.name}: "${p.origin || 'origine inconnue'}"`));
    
    // Sauvegarder la liste des non-trouvés
    fs.writeFileSync('plants-not-geocoded.json', JSON.stringify(notFound, null, 2));
  }
  
  await connection.end();
}

geocodePlants().catch(console.error);
