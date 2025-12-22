import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || '';

// Dictionnaire de mots-clés → valeurs radar (plus granulaire)
const keywordProfiles: Record<string, Partial<{
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
}>> = {
  // Notes fraîches
  'frais': { freshness: 85, warmth: 25 },
  'fraîche': { freshness: 85, warmth: 25 },
  'fraîcheur': { freshness: 90, warmth: 20 },
  'mentholé': { freshness: 95, warmth: 15, spiciness: 30 },
  'menthe': { freshness: 90, warmth: 20 },
  'eucalyptus': { freshness: 85, warmth: 30, spiciness: 40 },
  'camphré': { freshness: 80, warmth: 35, spiciness: 45 },
  'aquatique': { freshness: 85, warmth: 20, earthiness: 30 },
  'marin': { freshness: 80, warmth: 25, earthiness: 40 },
  'ozonic': { freshness: 90, warmth: 15 },
  'citron': { freshness: 85, sweetness: 40, spiciness: 25 },
  'agrume': { freshness: 80, sweetness: 45, spiciness: 30 },
  'bergamote': { freshness: 75, sweetness: 50, spiciness: 35 },
  'pamplemousse': { freshness: 85, sweetness: 35, spiciness: 20 },
  'orange': { freshness: 70, sweetness: 60, warmth: 40 },
  'citrus': { freshness: 80, sweetness: 45 },
  
  // Notes terreuses
  'terreux': { earthiness: 90, warmth: 60, freshness: 25 },
  'terre': { earthiness: 85, warmth: 55, freshness: 30 },
  'minéral': { earthiness: 80, warmth: 40, freshness: 35 },
  'pétrichor': { earthiness: 95, freshness: 70, warmth: 35 },
  'géosmine': { earthiness: 100, freshness: 60, warmth: 30 },
  'mousse': { earthiness: 75, freshness: 50, warmth: 40 },
  'champignon': { earthiness: 85, warmth: 50, sweetness: 30 },
  'truffe': { earthiness: 90, warmth: 55, spiciness: 40 },
  'humus': { earthiness: 95, warmth: 60, freshness: 20 },
  'sous-bois': { earthiness: 80, warmth: 50, freshness: 40 },
  'racine': { earthiness: 75, warmth: 55, spiciness: 35 },
  
  // Notes chaudes
  'chaud': { warmth: 85, freshness: 25 },
  'chaleur': { warmth: 90, freshness: 20 },
  'ambré': { warmth: 85, sweetness: 60, earthiness: 50 },
  'ambre': { warmth: 80, sweetness: 55, earthiness: 45 },
  'boisé': { warmth: 75, earthiness: 60, spiciness: 40 },
  'bois': { warmth: 70, earthiness: 55, spiciness: 35 },
  'cèdre': { warmth: 75, earthiness: 50, spiciness: 30 },
  'santal': { warmth: 80, sweetness: 50, earthiness: 45 },
  'vétiver': { warmth: 70, earthiness: 85, freshness: 40 },
  'patchouli': { warmth: 75, earthiness: 80, spiciness: 45 },
  'oud': { warmth: 90, earthiness: 70, spiciness: 60 },
  'cuir': { warmth: 85, earthiness: 65, spiciness: 55 },
  'fumé': { warmth: 80, earthiness: 70, spiciness: 50 },
  'tabac': { warmth: 85, sweetness: 45, earthiness: 60 },
  'résine': { warmth: 80, sweetness: 50, earthiness: 55 },
  'encens': { warmth: 85, spiciness: 60, earthiness: 50 },
  
  // Notes douces
  'doux': { sweetness: 80, warmth: 50 },
  'sucré': { sweetness: 90, warmth: 45 },
  'miel': { sweetness: 95, warmth: 55, spiciness: 25 },
  'caramel': { sweetness: 90, warmth: 65, earthiness: 30 },
  'vanille': { sweetness: 95, warmth: 60, spiciness: 20 },
  'vanilline': { sweetness: 90, warmth: 55, spiciness: 15 },
  'chocolat': { sweetness: 75, warmth: 60, earthiness: 45 },
  'cacao': { sweetness: 70, warmth: 55, earthiness: 50 },
  'lactone': { sweetness: 85, warmth: 50, freshness: 35 },
  'lacté': { sweetness: 80, warmth: 45, freshness: 40 },
  'crémeux': { sweetness: 75, warmth: 50, freshness: 35 },
  'coco': { sweetness: 80, warmth: 55, earthiness: 40 },
  'amande': { sweetness: 70, warmth: 45, spiciness: 30 },
  'fruit': { sweetness: 75, freshness: 60 },
  'fruité': { sweetness: 80, freshness: 55 },
  'pêche': { sweetness: 85, freshness: 50, warmth: 35 },
  'abricot': { sweetness: 80, freshness: 45, warmth: 40 },
  'prune': { sweetness: 75, warmth: 50, earthiness: 35 },
  
  // Notes épicées
  'épicé': { spiciness: 85, warmth: 70 },
  'épice': { spiciness: 80, warmth: 65 },
  'poivre': { spiciness: 90, warmth: 60, freshness: 30 },
  'poivré': { spiciness: 85, warmth: 55, freshness: 35 },
  'cannelle': { spiciness: 80, warmth: 75, sweetness: 50 },
  'girofle': { spiciness: 90, warmth: 70, sweetness: 35 },
  'clou': { spiciness: 85, warmth: 65, sweetness: 30 },
  'muscade': { spiciness: 75, warmth: 60, sweetness: 40 },
  'cardamome': { spiciness: 70, warmth: 55, freshness: 45 },
  'gingembre': { spiciness: 80, warmth: 50, freshness: 55 },
  'cumin': { spiciness: 85, warmth: 65, earthiness: 50 },
  'safran': { spiciness: 70, warmth: 60, sweetness: 45 },
  'anis': { spiciness: 75, sweetness: 55, freshness: 40 },
  'réglisse': { spiciness: 70, sweetness: 65, earthiness: 40 },
  
  // Notes florales
  'floral': { sweetness: 70, freshness: 60, warmth: 40 },
  'fleur': { sweetness: 65, freshness: 55, warmth: 45 },
  'rose': { sweetness: 75, freshness: 50, spiciness: 30 },
  'jasmin': { sweetness: 80, warmth: 55, spiciness: 25 },
  'lavande': { freshness: 75, sweetness: 50, spiciness: 35 },
  'géranium': { freshness: 70, sweetness: 55, spiciness: 40 },
  'ylang': { sweetness: 85, warmth: 60, spiciness: 30 },
  'tubéreuse': { sweetness: 80, warmth: 55, spiciness: 35 },
  'iris': { earthiness: 60, sweetness: 55, freshness: 50 },
  'violette': { sweetness: 70, freshness: 55, earthiness: 45 },
  
  // Notes vertes/herbacées
  'vert': { freshness: 80, earthiness: 50, sweetness: 30 },
  'herbe': { freshness: 85, earthiness: 55, sweetness: 25 },
  'herbacé': { freshness: 80, earthiness: 60, sweetness: 30 },
  'foin': { freshness: 65, earthiness: 70, sweetness: 40 },
  'thé': { freshness: 70, earthiness: 50, sweetness: 35 },
  'basilic': { freshness: 85, spiciness: 45, sweetness: 30 },
  'romarin': { freshness: 80, spiciness: 50, earthiness: 40 },
  'thym': { freshness: 75, spiciness: 55, earthiness: 45 },
  'sauge': { freshness: 70, spiciness: 50, earthiness: 50 },
  
  // Notes animales/musquées
  'musqué': { warmth: 75, sweetness: 55, earthiness: 50 },
  'musc': { warmth: 80, sweetness: 50, earthiness: 55 },
  'animal': { warmth: 85, earthiness: 70, spiciness: 45 },
  'ambroxan': { warmth: 75, sweetness: 45, earthiness: 40 },
  'civette': { warmth: 85, earthiness: 75, spiciness: 50 },
  'castoreum': { warmth: 90, earthiness: 80, spiciness: 55 },
  
  // Intensité
  'puissant': { intensity: 95 },
  'intense': { intensity: 90 },
  'fort': { intensity: 85 },
  'léger': { intensity: 35 },
  'subtil': { intensity: 30 },
  'délicat': { intensity: 25 },
  'diffusif': { intensity: 80 },
  'tenace': { intensity: 85 },
  'volatil': { intensity: 40 },
  
  // Acides et composés chimiques
  'acide': { freshness: 60, spiciness: 45, sweetness: 35 },
  'aldéhyde': { freshness: 70, sweetness: 50, warmth: 40 },
  'ester': { sweetness: 75, freshness: 65, warmth: 35 },
  'terpène': { freshness: 70, earthiness: 55, spiciness: 40 },
  'pyrazine': { earthiness: 80, warmth: 65, spiciness: 50 },
  'furfural': { warmth: 70, sweetness: 55, earthiness: 60 },
  'indole': { sweetness: 60, warmth: 70, earthiness: 65 },
  'skatole': { earthiness: 85, warmth: 75, spiciness: 40 },
};

// Fonction pour extraire les mots-clés d'un profil olfactif
function extractKeywords(text: string | null): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Enlever les accents pour la recherche
  
  const keywords: string[] = [];
  for (const keyword of Object.keys(keywordProfiles)) {
    const normalizedKeyword = keyword.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normalizedKeyword)) {
      keywords.push(keyword);
    }
  }
  return keywords;
}

// Fonction pour générer un profil radar basé sur les mots-clés
function generateRadarProfile(
  olfactiveProfile: string | null,
  moleculeName: string,
  moleculeId: number
): {
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
} {
  // Valeurs de base avec légère variation basée sur l'ID
  const baseVariation = (moleculeId % 20) - 10; // -10 à +10
  
  let profile = {
    intensity: 50 + baseVariation,
    freshness: 50 + (baseVariation * 0.8),
    warmth: 50 - (baseVariation * 0.5),
    sweetness: 50 + (baseVariation * 0.3),
    spiciness: 50 - (baseVariation * 0.7),
    earthiness: 50 + (baseVariation * 0.6),
  };
  
  // Extraire les mots-clés du profil olfactif et du nom
  const keywords = [
    ...extractKeywords(olfactiveProfile),
    ...extractKeywords(moleculeName)
  ];
  
  // Appliquer les profils des mots-clés trouvés
  for (const keyword of keywords) {
    const keywordProfile = keywordProfiles[keyword];
    if (keywordProfile) {
      if (keywordProfile.intensity !== undefined) {
        profile.intensity = Math.round((profile.intensity + keywordProfile.intensity) / 2);
      }
      if (keywordProfile.freshness !== undefined) {
        profile.freshness = Math.round((profile.freshness + keywordProfile.freshness) / 2);
      }
      if (keywordProfile.warmth !== undefined) {
        profile.warmth = Math.round((profile.warmth + keywordProfile.warmth) / 2);
      }
      if (keywordProfile.sweetness !== undefined) {
        profile.sweetness = Math.round((profile.sweetness + keywordProfile.sweetness) / 2);
      }
      if (keywordProfile.spiciness !== undefined) {
        profile.spiciness = Math.round((profile.spiciness + keywordProfile.spiciness) / 2);
      }
      if (keywordProfile.earthiness !== undefined) {
        profile.earthiness = Math.round((profile.earthiness + keywordProfile.earthiness) / 2);
      }
    }
  }
  
  // Ajouter une variation aléatoire unique basée sur le nom de la molécule
  const nameHash = moleculeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = (nameHash % 15) - 7; // -7 à +7
  
  profile.intensity = Math.max(10, Math.min(100, profile.intensity + variation));
  profile.freshness = Math.max(10, Math.min(100, profile.freshness + (variation * 0.8)));
  profile.warmth = Math.max(10, Math.min(100, profile.warmth - (variation * 0.5)));
  profile.sweetness = Math.max(10, Math.min(100, profile.sweetness + (variation * 0.3)));
  profile.spiciness = Math.max(10, Math.min(100, profile.spiciness - (variation * 0.7)));
  profile.earthiness = Math.max(10, Math.min(100, profile.earthiness + (variation * 0.6)));
  
  return {
    intensity: Math.round(profile.intensity),
    freshness: Math.round(profile.freshness),
    warmth: Math.round(profile.warmth),
    sweetness: Math.round(profile.sweetness),
    spiciness: Math.round(profile.spiciness),
    earthiness: Math.round(profile.earthiness),
  };
}

async function main() {
  console.log('🎨 Diversification des profils radar...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // Récupérer toutes les molécules
  const [molecules] = await connection.execute(
    'SELECT id, name, olfactiveProfile FROM molecules ORDER BY id'
  ) as any[];
  
  console.log(`📊 ${molecules.length} molécules à traiter\n`);
  
  let updated = 0;
  const profiles: Map<string, number> = new Map(); // Pour détecter les doublons
  
  for (const mol of molecules) {
    const profile = generateRadarProfile(mol.olfactiveProfile, mol.name, mol.id);
    const profileKey = `${profile.intensity}-${profile.freshness}-${profile.warmth}-${profile.sweetness}-${profile.spiciness}-${profile.earthiness}`;
    
    // Si le profil existe déjà, ajouter une variation supplémentaire
    if (profiles.has(profileKey)) {
      const existingCount = profiles.get(profileKey) || 0;
      profile.intensity = Math.max(10, Math.min(100, profile.intensity + (existingCount * 3)));
      profile.freshness = Math.max(10, Math.min(100, profile.freshness - (existingCount * 2)));
      profiles.set(profileKey, existingCount + 1);
    } else {
      profiles.set(profileKey, 1);
    }
    
    // Mettre à jour la molécule
    await connection.execute(
      `UPDATE molecules SET 
        radar_intensity = ?,
        radar_freshness = ?,
        radar_warmth = ?,
        radar_sweetness = ?,
        radar_spiciness = ?,
        radar_earthiness = ?
      WHERE id = ?`,
      [
        profile.intensity,
        profile.freshness,
        profile.warmth,
        profile.sweetness,
        profile.spiciness,
        profile.earthiness,
        mol.id
      ]
    );
    
    updated++;
    
    // Afficher quelques exemples
    if (updated <= 10 || updated % 20 === 0) {
      const keywords = extractKeywords(mol.olfactiveProfile);
      console.log(`✅ ${mol.name}`);
      console.log(`   Mots-clés: ${keywords.length > 0 ? keywords.join(', ') : '(aucun)'}`);
      console.log(`   Radar: I=${profile.intensity} F=${profile.freshness} W=${profile.warmth} S=${profile.sweetness} Sp=${profile.spiciness} E=${profile.earthiness}`);
      console.log('');
    }
  }
  
  await connection.end();
  
  // Compter les profils uniques
  const uniqueProfiles = profiles.size;
  console.log(`\n📈 Résultats:`);
  console.log(`   - ${updated} molécules mises à jour`);
  console.log(`   - ${uniqueProfiles} profils uniques générés`);
  console.log(`   - ${((uniqueProfiles / updated) * 100).toFixed(1)}% de diversité`);
}

main().catch(console.error);
