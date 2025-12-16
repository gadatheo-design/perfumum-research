import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const moleculesManquantes = [
  {
    name: "Makrut (Combava)",
    chemicalFormula: "C10H14O (citronellal)",
    family: "Agrumes",
    olfactiveProfile: "Agrume vert intense, zeste de citron vert kaffir, notes herbacées et légèrement épicées. Fraîcheur citronnée distinctive avec une facette feuille verte.",
    volatility: 85,
    intensity: 7,
    naturalOrigin: "Feuilles et zeste de Citrus hystrix",
    extractionMethod: "Distillation à la vapeur / Expression à froid",
    radarIntensity: 70,
    radarFreshness: 95,
    radarWarmth: 15,
    radarSweetness: 20,
    radarSpiciness: 25,
    radarEarthiness: 10
  },
  {
    name: "Mitti Attar",
    chemicalFormula: "Mélange complexe (géosmine)",
    family: "Terreux",
    olfactiveProfile: "Terre mouillée après la pluie, argile cuite, pétrichor authentique. Notes minérales profondes évoquant la mousson indienne et les sols argileux humides.",
    volatility: 25,
    intensity: 6,
    naturalOrigin: "Distillation d'argile cuite avec huile de santal",
    extractionMethod: "Distillation traditionnelle indienne (deg bhapka)",
    radarIntensity: 60,
    radarFreshness: 40,
    radarWarmth: 45,
    radarSweetness: 15,
    radarSpiciness: 10,
    radarEarthiness: 100
  },
  {
    name: "Palo Santo",
    chemicalFormula: "C15H24O (α-terpinéol, limonène)",
    family: "Boisé",
    olfactiveProfile: "Bois sacré sud-américain, notes résineuses douces, encens léger avec des facettes citronnées et mentholées. Caractère spirituel et méditatif.",
    volatility: 50,
    intensity: 7,
    naturalOrigin: "Bursera graveolens (bois mort naturellement)",
    extractionMethod: "Distillation à la vapeur",
    radarIntensity: 70,
    radarFreshness: 50,
    radarWarmth: 65,
    radarSweetness: 40,
    radarSpiciness: 30,
    radarEarthiness: 55
  },
  {
    name: "Frangipani (Plumeria)",
    chemicalFormula: "C10H18O (géraniol, linalol)",
    family: "Floral",
    olfactiveProfile: "Fleur tropicale exotique, notes crémeuses et lactées, jasmin doux avec des facettes fruitées (pêche, abricot). Caractère solaire et enveloppant.",
    volatility: 55,
    intensity: 8,
    naturalOrigin: "Fleurs de Plumeria (diverses espèces)",
    extractionMethod: "Enfleurage / Extraction CO2",
    radarIntensity: 80,
    radarFreshness: 45,
    radarWarmth: 60,
    radarSweetness: 85,
    radarSpiciness: 10,
    radarEarthiness: 15
  },
{
    name: "Juniper (Genièvre)",
    chemicalFormula: "C10H16 (α-pinène, sabinène)",
    family: "Aromatique",
    olfactiveProfile: "Baies de genièvre fraîches, notes résineuses et boisées, gin botanique. Facettes vertes, légèrement épicées et camphrées.",
    volatility: 80,
    intensity: 6,
    naturalOrigin: "Baies et rameaux de Juniperus communis",
    extractionMethod: "Distillation à la vapeur",
    radarIntensity: 60,
    radarFreshness: 85,
    radarWarmth: 25,
    radarSweetness: 20,
    radarSpiciness: 45,
    radarEarthiness: 35
  }
];

async function insertMolecules() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Connexion à la base de données...');
  
  for (const mol of moleculesManquantes) {
    try {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  ${mol.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      // Insérer la nouvelle molécule
      const [result] = await connection.execute(
        `INSERT INTO molecules (
          name, chemicalFormula, family, olfactiveProfile, volatility, intensity,
          sourceOrigin, extractionMethod,
          radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          mol.name,
          mol.chemicalFormula,
          mol.family,
          mol.olfactiveProfile,
          mol.volatility,
          mol.intensity,
          mol.naturalOrigin,
          mol.extractionMethod,
          mol.radarIntensity,
          mol.radarFreshness,
          mol.radarWarmth,
          mol.radarSweetness,
          mol.radarSpiciness,
          mol.radarEarthiness
        ]
      );
      
      console.log(`✅ ${mol.name} ajoutée (ID: ${result.insertId})`);
    } catch (error) {
      console.error(`❌ Erreur pour ${mol.name}:`, error.message);
    }
  }
  
  // Compter le total
  const [count] = await connection.execute('SELECT COUNT(*) as total FROM molecules');
  console.log(`\n📊 Total molécules dans la base: ${count[0].total}`);
  
  await connection.end();
  console.log('Terminé!');
}

insertMolecules().catch(console.error);
