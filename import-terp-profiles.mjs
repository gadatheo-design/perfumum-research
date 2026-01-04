/**
 * Script d'import des profils terpéniques de référence
 * PERFUMUM Research - Session 04 Jan 2026
 * 
 * Profils: Tabac (Virginia, Latakia), Cannabis (OG Kush, Haze), Parfumerie (Lavande, Vétiver)
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Parse DATABASE_URL
function parseDbUrl(url) {
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5]
  };
}

// ============================================================================
// PROFILS TERPÉNIQUES DE RÉFÉRENCE
// Structure: profile_id, name, collection, type, climatic_axis, secondary_axis, function, usage, level,
//            plant_sources, key_molecules, concentrate, olfactive_reading, temporality, temporality_description,
//            recommended_usage, critical_notes, connections, intensity, readability, non_identifiable,
//            radar_vent, radar_bois, radar_disparition, radar_structure, radar_diffusion
// ============================================================================

const terpProfilesData = [
  // ===== PROFILS TABAC =====
  {
    profileId: 'REF-TAB-01',
    name: 'Virginia Flue-Cured',
    collection: 'Profils de Référence — Tabac',
    type: 'Profil terpénique de référence',
    climaticAxis: 'bois',
    secondaryAxis: 'none',
    function: 'Référence tabac doux',
    usage: 'parfum',
    level: 'Référence',
    plantSources: JSON.stringify(['Nicotiana tabacum var. Virginia']),
    keyMolecules: JSON.stringify(['Solanone', 'β-Damascenone', 'Megastigmatrienone', 'Linalol', 'Géraniol']),
    concentrate: JSON.stringify([
      { ingredient: 'Solanone', percentage: 15 },
      { ingredient: 'β-Damascenone', percentage: 12 },
      { ingredient: 'Megastigmatrienone', percentage: 10 },
      { ingredient: 'Linalol', percentage: 8 },
      { ingredient: 'Géraniol', percentage: 6 },
      { ingredient: 'Nérol', percentage: 5 },
      { ingredient: 'Eugénol', percentage: 4 }
    ]),
    olfactiveReading: 'Profil doux et sucré caractéristique du tabac Virginia séché au feu. Notes de miel, de foin séché et de caramel léger. La solanone apporte une signature tabac authentique, tandis que la damascenone ajoute des facettes fruitées-florales.',
    temporality: 'moyenne',
    temporalityDescription: 'Entrée douce. Plateau miellé. Sortie chaude.',
    recommendedUsage: 'Parfum ≤ 10%, Encens ≤ 5%',
    criticalNotes: 'Profil de référence pour le tabac Virginia flue-cured. Base pour les formulations tabac doux et les accords miellés.',
    connections: JSON.stringify([]),
    intensity: 'moyenne',
    readability: 'lisible',
    nonIdentifiable: 0,
    radarVent: 20,
    radarBois: 70,
    radarDisparition: 30,
    radarStructure: 60,
    radarDiffusion: 50
  },
  {
    profileId: 'REF-TAB-02',
    name: 'Latakia Fumé',
    collection: 'Profils de Référence — Tabac',
    type: 'Profil terpénique de référence',
    climaticAxis: 'bois_disparition',
    secondaryAxis: 'disparition',
    function: 'Référence tabac fumé intense',
    usage: 'parfum',
    level: 'Référence',
    plantSources: JSON.stringify(['Nicotiana tabacum var. Latakia']),
    keyMolecules: JSON.stringify(['Guaiacol', 'Syringol', '4-Vinylguaiacol', 'Créosol', 'Eugénol']),
    concentrate: JSON.stringify([
      { ingredient: 'Guaiacol', percentage: 20 },
      { ingredient: 'Syringol', percentage: 15 },
      { ingredient: '4-Vinylguaiacol', percentage: 12 },
      { ingredient: 'Créosol', percentage: 10 },
      { ingredient: 'Eugénol', percentage: 8 },
      { ingredient: 'Isoeugénol', percentage: 5 },
      { ingredient: 'p-Crésol', percentage: 3 }
    ]),
    olfactiveReading: 'Profil intensément fumé et cuiré du tabac Latakia syrien. Notes de feu de bois, de cuir tanné et d\'encens. Le guaiacol et le syringol dominent, créant une signature fumée distinctive. Profil complexe et enveloppant.',
    temporality: 'longue',
    temporalityDescription: 'Entrée fumée. Plateau cuiré. Sortie longue et enveloppante.',
    recommendedUsage: 'Parfum ≤ 5%, Encens ≤ 8%',
    criticalNotes: 'Profil de référence pour le tabac Latakia. Base pour les formulations fumées intenses et les accords orientaux.',
    connections: JSON.stringify([]),
    intensity: 'structurelle',
    readability: 'structure',
    nonIdentifiable: 0,
    radarVent: 10,
    radarBois: 85,
    radarDisparition: 70,
    radarStructure: 80,
    radarDiffusion: 60
  },

  // ===== PROFILS CANNABIS =====
  {
    profileId: 'REF-CAN-01',
    name: 'OG Kush',
    collection: 'Profils de Référence — Cannabis',
    type: 'Profil terpénique de référence',
    climaticAxis: 'bois',
    secondaryAxis: 'vent',
    function: 'Référence cannabis terreux-citrus',
    usage: 'parfum',
    level: 'Référence',
    plantSources: JSON.stringify(['Cannabis sativa L. — OG Kush']),
    keyMolecules: JSON.stringify(['Myrcène', 'Limonène', 'β-Caryophyllène', 'Linalol', 'Humulène']),
    concentrate: JSON.stringify([
      { ingredient: 'Myrcène', percentage: 35 },
      { ingredient: 'Limonène', percentage: 25 },
      { ingredient: 'β-Caryophyllène', percentage: 18 },
      { ingredient: 'Linalol', percentage: 8 },
      { ingredient: 'Humulène', percentage: 6 },
      { ingredient: 'β-Pinène', percentage: 4 },
      { ingredient: 'Terpinolène', percentage: 2 }
    ]),
    olfactiveReading: 'Profil emblématique de l\'OG Kush : terreux, citronné et épicé. Le myrcène dominant apporte une base herbacée-terreuse, le limonène des notes citrus vives, et le caryophyllène une touche épicée-poivrée. Signature reconnaissable et complexe.',
    temporality: 'moyenne',
    temporalityDescription: 'Entrée citrus vive. Plateau terreux. Sortie épicée.',
    recommendedUsage: 'Parfum ≤ 8%, Espace ≤ 3%',
    criticalNotes: 'Profil de référence pour la variété OG Kush. Base pour les formulations cannabis-inspirées et les accords terreux-citrus.',
    connections: JSON.stringify([]),
    intensity: 'structurelle',
    readability: 'lisible',
    nonIdentifiable: 0,
    radarVent: 40,
    radarBois: 75,
    radarDisparition: 25,
    radarStructure: 70,
    radarDiffusion: 65
  },
  {
    profileId: 'REF-CAN-02',
    name: 'Haze',
    collection: 'Profils de Référence — Cannabis',
    type: 'Profil terpénique de référence',
    climaticAxis: 'vent',
    secondaryAxis: 'bois',
    function: 'Référence cannabis floral-énergisant',
    usage: 'parfum',
    level: 'Référence',
    plantSources: JSON.stringify(['Cannabis sativa L. — Haze']),
    keyMolecules: JSON.stringify(['Terpinolène', 'Myrcène', 'Ocimène', 'Limonène', 'α-Pinène']),
    concentrate: JSON.stringify([
      { ingredient: 'Terpinolène', percentage: 30 },
      { ingredient: 'Myrcène', percentage: 20 },
      { ingredient: 'Ocimène', percentage: 15 },
      { ingredient: 'Limonène', percentage: 12 },
      { ingredient: 'α-Pinène', percentage: 10 },
      { ingredient: 'β-Caryophyllène', percentage: 8 },
      { ingredient: 'Linalol', percentage: 3 }
    ]),
    olfactiveReading: 'Profil énergisant et floral des variétés Haze. Le terpinolène dominant crée des notes florales-herbacées uniques, l\'ocimène apporte des facettes douces et sucrées, le pinène une fraîcheur résineuse. Profil aérien et stimulant.',
    temporality: 'rapide',
    temporalityDescription: 'Entrée vive et florale. Plateau court. Sortie fraîche.',
    recommendedUsage: 'Parfum ≤ 10%, Espace ≤ 5%',
    criticalNotes: 'Profil de référence pour les variétés Haze. Base pour les formulations énergisantes et les accords floraux-herbacés.',
    connections: JSON.stringify([]),
    intensity: 'moyenne',
    readability: 'lisible',
    nonIdentifiable: 0,
    radarVent: 80,
    radarBois: 35,
    radarDisparition: 20,
    radarStructure: 45,
    radarDiffusion: 75
  },

  // ===== PROFILS PARFUMERIE =====
  {
    profileId: 'REF-PAR-01',
    name: 'Lavande Fine de Provence',
    collection: 'Profils de Référence — Parfumerie',
    type: 'Profil terpénique de référence',
    climaticAxis: 'vent',
    secondaryAxis: 'bois',
    function: 'Référence lavande classique',
    usage: 'parfum',
    level: 'Référence',
    plantSources: JSON.stringify(['Lavandula angustifolia — Provence']),
    keyMolecules: JSON.stringify(['Linalol', 'Acétate de linalyle', 'Lavandulol', 'Terpinène-4-ol', '1,8-Cinéole']),
    concentrate: JSON.stringify([
      { ingredient: 'Linalol', percentage: 35 },
      { ingredient: 'Acétate de linalyle', percentage: 30 },
      { ingredient: 'Lavandulol', percentage: 8 },
      { ingredient: 'Terpinène-4-ol', percentage: 6 },
      { ingredient: '1,8-Cinéole', percentage: 5 },
      { ingredient: 'β-Caryophyllène', percentage: 4 },
      { ingredient: 'Camphre', percentage: 3 }
    ]),
    olfactiveReading: 'Profil classique de la lavande fine de Provence : floral, herbacé et légèrement camphré. Le linalol et l\'acétate de linalyle créent la signature lavande authentique. Notes apaisantes et aromatiques, équilibre parfait entre fraîcheur et douceur.',
    temporality: 'moyenne',
    temporalityDescription: 'Entrée fraîche et herbacée. Plateau floral. Sortie douce.',
    recommendedUsage: 'Parfum ≤ 15%, Espace ≤ 8%',
    criticalNotes: 'Profil de référence pour la lavande fine. Base pour les formulations aromatiques et les accords fougères.',
    connections: JSON.stringify([]),
    intensity: 'moyenne',
    readability: 'lisible',
    nonIdentifiable: 0,
    radarVent: 70,
    radarBois: 40,
    radarDisparition: 15,
    radarStructure: 55,
    radarDiffusion: 65
  },
  {
    profileId: 'REF-PAR-02',
    name: 'Vétiver de Haïti',
    collection: 'Profils de Référence — Parfumerie',
    type: 'Profil terpénique de référence',
    climaticAxis: 'bois',
    secondaryAxis: 'disparition',
    function: 'Référence vétiver terreux',
    usage: 'parfum',
    level: 'Référence',
    plantSources: JSON.stringify(['Vetiveria zizanioides — Haïti']),
    keyMolecules: JSON.stringify(['Vétivénol', 'Khusimol', 'Isovalencénol', 'β-Vétivène', 'Zizanoïque (acide)']),
    concentrate: JSON.stringify([
      { ingredient: 'Vétivénol', percentage: 25 },
      { ingredient: 'Khusimol', percentage: 20 },
      { ingredient: 'Isovalencénol', percentage: 15 },
      { ingredient: 'β-Vétivène', percentage: 12 },
      { ingredient: 'Acide zizanoïque', percentage: 8 },
      { ingredient: 'α-Vétivène', percentage: 6 },
      { ingredient: 'Vétivazulène', percentage: 4 }
    ]),
    olfactiveReading: 'Profil terreux et boisé du vétiver haïtien : notes de racine, de terre humide et de bois précieux. Le vétivénol apporte la signature terreuse caractéristique, le khusimol des facettes fumées-boisées. Profil ancrant et sophistiqué.',
    temporality: 'longue',
    temporalityDescription: 'Entrée terreuse. Plateau boisé profond. Sortie très longue.',
    recommendedUsage: 'Parfum ≤ 12%, Encens ≤ 6%',
    criticalNotes: 'Profil de référence pour le vétiver. Base pour les formulations boisées et les accords chyprés.',
    connections: JSON.stringify([]),
    intensity: 'structurelle',
    readability: 'structure',
    nonIdentifiable: 0,
    radarVent: 15,
    radarBois: 90,
    radarDisparition: 50,
    radarStructure: 85,
    radarDiffusion: 40
  }
];

// ============================================================================
// FONCTION PRINCIPALE D'IMPORT
// ============================================================================

async function importTerpProfiles() {
  console.log('🌿 Import des profils terpéniques de référence...\n');
  
  const dbConfig = parseDbUrl(DATABASE_URL);
  const connection = await mysql.createConnection({
    ...dbConfig,
    ssl: { rejectUnauthorized: true }
  });
  
  try {
    console.log('📊 Import des profils terpéniques...');
    
    for (const profile of terpProfilesData) {
      await connection.execute(
        `INSERT INTO terp_profiles 
         (profile_id, name, collection, type, climatic_axis, secondary_axis, \`function\`, \`usage\`, level,
          plant_sources, key_molecules, concentrate, olfactive_reading, temporality, temporality_description,
          recommended_usage, critical_notes, connections, intensity, readability, non_identifiable,
          radar_vent, radar_bois, radar_disparition, radar_structure, radar_diffusion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name), olfactive_reading = VALUES(olfactive_reading), concentrate = VALUES(concentrate)`,
        [
          profile.profileId,
          profile.name,
          profile.collection,
          profile.type,
          profile.climaticAxis,
          profile.secondaryAxis,
          profile.function,
          profile.usage,
          profile.level,
          profile.plantSources,
          profile.keyMolecules,
          profile.concentrate,
          profile.olfactiveReading,
          profile.temporality,
          profile.temporalityDescription,
          profile.recommendedUsage,
          profile.criticalNotes,
          profile.connections,
          profile.intensity,
          profile.readability,
          profile.nonIdentifiable,
          profile.radarVent,
          profile.radarBois,
          profile.radarDisparition,
          profile.radarStructure,
          profile.radarDiffusion
        ]
      );
      console.log(`  ✓ ${profile.name} (${profile.collection})`);
    }
    
    console.log(`\n✅ Import terminé avec succès!`);
    console.log(`   - ${terpProfilesData.filter(p => p.collection.includes('Tabac')).length} profils tabac`);
    console.log(`   - ${terpProfilesData.filter(p => p.collection.includes('Cannabis')).length} profils cannabis`);
    console.log(`   - ${terpProfilesData.filter(p => p.collection.includes('Parfumerie')).length} profils parfumerie`);
    console.log(`   - Total: ${terpProfilesData.length} profils de référence`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Exécution
importTerpProfiles().catch(console.error);
