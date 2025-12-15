// Script d'import des molécules niches (Indole, Skatole, acides gras)
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await createConnection(process.env.DATABASE_URL);

// Molécules niches à importer
const nicheMolecules = [
  {
    name: 'Indole',
    iupacName: '1H-indole',
    formula: 'C8H7N',
    family: 'Indoles',
    olfactiveProfile: 'Floral intense, jasmin, naphtaline, animal à forte dose. Note florale blanche caractéristique à faible concentration.',
    emotionalResonance: 'Dualité entre pureté florale et animalité. Évoque la sensualité et la complexité de la nature.',
    functionalEffect: 'Fixateur puissant. Renforce les notes florales blanches. Apporte profondeur et naturalité.',
    origin: 'Synthétique (dérivé du charbon) ou naturel (jasmin, fleur d\'oranger)',
    concentration: '0.01-0.05%',
    radarIntensity: 85,
    radarFreshness: 30,
    radarWarmth: 60,
    radarSweetness: 40,
    radarSpiciness: 25,
    radarEarthiness: 55,
    molecularWeight: 117.15,
    boilingPoint: 254,
    volatility: 3,
    intensity: 9
  },
  {
    name: 'Skatole',
    iupacName: '3-methylindole',
    formula: 'C9H9N',
    family: 'Indoles',
    olfactiveProfile: 'Fécal, animal, naphtaline à forte dose. Floral, jasmin, orange blossom à très faible dose.',
    emotionalResonance: 'Provocation et transgression. Évoque la matière organique et les tabous olfactifs.',
    functionalEffect: 'Fixateur extrême. Apporte animalité et naturalité aux compositions florales. Usage à dose infinitésimale.',
    origin: 'Synthétique ou naturel (matières fécales, fleurs de jasmin)',
    concentration: '0.001-0.01%',
    radarIntensity: 95,
    radarFreshness: 15,
    radarWarmth: 70,
    radarSweetness: 20,
    radarSpiciness: 30,
    radarEarthiness: 80,
    molecularWeight: 131.17,
    boilingPoint: 265,
    volatility: 3,
    intensity: 10
  },
  {
    name: 'Acide butyrique',
    iupacName: 'Butanoic acid',
    formula: 'C4H8O2',
    family: 'Acides gras volatils',
    olfactiveProfile: 'Rance, beurre rance, vomi, fromage fort. Note caractéristique des fromages affinés.',
    emotionalResonance: 'Dégoût ou fascination selon le contexte. Évoque la fermentation et la transformation.',
    functionalEffect: 'Apporte caractère fromager authentique. Utilisé à dose infinitésimale pour naturalité.',
    origin: 'Synthétique ou naturel (beurre rance, fromages)',
    concentration: '0.01-0.1%',
    radarIntensity: 90,
    radarFreshness: 10,
    radarWarmth: 50,
    radarSweetness: 15,
    radarSpiciness: 40,
    radarEarthiness: 75,
    molecularWeight: 88.11,
    boilingPoint: 164,
    volatility: 8,
    intensity: 9
  },
  {
    name: 'Acide isovalérique',
    iupacName: '3-methylbutanoic acid',
    formula: 'C5H10O2',
    family: 'Acides gras volatils',
    olfactiveProfile: 'Transpiration, fromage, pieds. Note caractéristique du fromage de chèvre et de la sueur.',
    emotionalResonance: 'Animalité et humanité. Évoque le corps et la présence physique.',
    functionalEffect: 'Signature "cheese" authentique. Apporte caractère animal aux compositions.',
    origin: 'Synthétique ou naturel (valériane, fromages)',
    concentration: '0.01-0.1%',
    radarIntensity: 88,
    radarFreshness: 12,
    radarWarmth: 55,
    radarSweetness: 10,
    radarSpiciness: 45,
    radarEarthiness: 70,
    molecularWeight: 102.13,
    boilingPoint: 176,
    volatility: 8,
    intensity: 9
  },
  {
    name: 'Acide hexanoïque',
    iupacName: 'Hexanoic acid',
    formula: 'C6H12O2',
    family: 'Acides gras volatils',
    olfactiveProfile: 'Fromage, gras, rance, lacté. Note fromagère typique, moins agressive que C4.',
    emotionalResonance: 'Confort et familiarité. Évoque les produits laitiers et la cuisine.',
    functionalEffect: 'Base du profil "cheese" cannabis. Apporte caractère lacté et fermenté.',
    origin: 'Synthétique ou naturel (huile de coco, beurre)',
    concentration: '0.1-0.5%',
    radarIntensity: 75,
    radarFreshness: 20,
    radarWarmth: 45,
    radarSweetness: 25,
    radarSpiciness: 30,
    radarEarthiness: 65,
    molecularWeight: 116.16,
    boilingPoint: 205,
    volatility: 5,
    intensity: 7
  },
  {
    name: 'Acide octanoïque',
    iupacName: 'Octanoic acid',
    formula: 'C8H16O2',
    family: 'Acides gras volatils',
    olfactiveProfile: 'Gras, cireux, légèrement fruité, noix de coco. Moins piquant que C6.',
    emotionalResonance: 'Douceur et rondeur. Évoque les huiles végétales et la cuisine asiatique.',
    functionalEffect: 'Caractère fermenté dans profil cheese. Apporte corps et persistance.',
    origin: 'Synthétique ou naturel (huile de coco, huile de palme)',
    concentration: '0.1-0.3%',
    radarIntensity: 65,
    radarFreshness: 25,
    radarWarmth: 40,
    radarSweetness: 35,
    radarSpiciness: 20,
    radarEarthiness: 55,
    molecularWeight: 144.21,
    boilingPoint: 239,
    volatility: 5,
    intensity: 6
  },
  {
    name: 'Acide décanoïque',
    iupacName: 'Decanoic acid',
    formula: 'C10H20O2',
    family: 'Acides gras volatils',
    olfactiveProfile: 'Cireux, gras, savonneux, légèrement rance. Note de fond persistante.',
    emotionalResonance: 'Stabilité et ancrage. Évoque la cire et les matières nobles.',
    functionalEffect: 'Corps et persistance dans profil cheese. Fixateur naturel.',
    origin: 'Synthétique ou naturel (huile de coco, beurre)',
    concentration: '0.05-0.2%',
    radarIntensity: 55,
    radarFreshness: 20,
    radarWarmth: 35,
    radarSweetness: 30,
    radarSpiciness: 15,
    radarEarthiness: 50,
    molecularWeight: 172.26,
    boilingPoint: 270,
    volatility: 3,
    intensity: 5
  },
  {
    name: 'δ-Décalactone',
    iupacName: '5-hexyloxolan-2-one',
    formula: 'C10H18O2',
    family: 'Lactones',
    olfactiveProfile: 'Pêche, abricot, crème, noix de coco. Note fruitée crémeuse caractéristique.',
    emotionalResonance: 'Douceur et gourmandise. Évoque les fruits mûrs et les desserts.',
    functionalEffect: 'Note pêche/abricot. Adoucit les compositions et apporte rondeur fruitée.',
    origin: 'Synthétique ou naturel (pêche, abricot)',
    concentration: '0.1-0.5%',
    radarIntensity: 60,
    radarFreshness: 50,
    radarWarmth: 45,
    radarSweetness: 80,
    radarSpiciness: 10,
    radarEarthiness: 25,
    molecularWeight: 170.25,
    boilingPoint: 281,
    volatility: 3,
    intensity: 6
  }
];

// Fonction d'insertion
async function insertMolecules() {
  console.log('\n🧪 Insertion des molécules niches...\n');
  
  for (const mol of nicheMolecules) {
    try {
      const [result] = await connection.execute(
        `INSERT INTO molecules (name, chemicalFormula, formula, family, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, concentration, radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness, molecularWeight, boilingPoint, volatility, intensity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mol.name,
          mol.iupacName, // chemicalFormula
          mol.formula,
          mol.family,
          mol.olfactiveProfile,
          mol.emotionalResonance,
          mol.functionalEffect,
          mol.origin,
          mol.concentration,
          mol.radarIntensity,
          mol.radarFreshness,
          mol.radarWarmth,
          mol.radarSweetness,
          mol.radarSpiciness,
          mol.radarEarthiness,
          mol.molecularWeight,
          mol.boilingPoint,
          mol.volatility,
          mol.intensity
        ]
      );
      console.log(`✅ ${mol.name} (ID: ${result.insertId}) - ${mol.family}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ ${mol.name} existe déjà`);
      } else {
        console.error(`❌ Erreur ${mol.name}:`, error.message);
      }
    }
  }
}

// Exécution
console.log('🧬 Import des molécules niches (Indole, Skatole, Acides gras)');
console.log('==============================================================');

await insertMolecules();

// Vérification
const [count] = await connection.execute('SELECT COUNT(*) as total FROM molecules');
console.log(`\n📊 Total molécules: ${count[0].total}`);

const [families] = await connection.execute('SELECT family, COUNT(*) as count FROM molecules GROUP BY family ORDER BY count DESC LIMIT 10');
console.log('\n📋 Top 10 familles:');
families.forEach(f => console.log(`   ${f.family}: ${f.count}`));

await connection.end();
console.log('\n✅ Import terminé');
