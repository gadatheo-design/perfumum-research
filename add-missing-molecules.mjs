import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const missingMolecules = [
  {
    name: 'GEOSMIN',
    category: 'Pétrichor',
    olfactiveProfile: 'Terre humide, pluie, minéral, betterave',
    formula: 'C12H22O',
    boilingPoint: 270,
    molecularWeight: 182.3,
    chemicalFamily: 'Sesquiterpène',
    radarIntensity: 85,
    radarFreshness: 45,
    radarWarmth: 30,
    radarSweetness: 20,
    radarSpiciness: 15,
    radarEarthiness: 95
  },
  {
    name: 'JASMINE ABSOLUTE',
    category: 'Civilisations',
    olfactiveProfile: 'Floral, jasmin, indole, animalique, sensuel',
    formula: 'Mélange complexe',
    boilingPoint: null,
    molecularWeight: null,
    chemicalFamily: 'Absolu floral',
    radarIntensity: 90,
    radarFreshness: 40,
    radarWarmth: 75,
    radarSweetness: 85,
    radarSpiciness: 25,
    radarEarthiness: 20
  },
  {
    name: 'VETIVEROL',
    category: 'Pétrichor',
    olfactiveProfile: 'Boisé, terreux, vétiver, racine, fumé',
    formula: 'C15H26O',
    boilingPoint: 285,
    molecularWeight: 222.4,
    chemicalFamily: 'Sesquiterpène alcool',
    radarIntensity: 80,
    radarFreshness: 35,
    radarWarmth: 70,
    radarSweetness: 40,
    radarSpiciness: 30,
    radarEarthiness: 90
  },
  {
    name: 'CEDARWOOD OIL',
    category: 'Civilisations',
    olfactiveProfile: 'Boisé, cèdre, sec, conifère, sacré',
    formula: 'Mélange de cédrol et cédrène',
    boilingPoint: 260,
    molecularWeight: 222,
    chemicalFamily: 'Sesquiterpène',
    radarIntensity: 70,
    radarFreshness: 50,
    radarWarmth: 60,
    radarSweetness: 35,
    radarSpiciness: 20,
    radarEarthiness: 75
  },
  {
    name: 'PATCHOULI ALCOHOL',
    category: 'Pétrichor',
    olfactiveProfile: 'Terreux, patchouli, humide, moisi, camphré',
    formula: 'C15H26O',
    boilingPoint: 287,
    molecularWeight: 222.4,
    chemicalFamily: 'Sesquiterpène alcool',
    radarIntensity: 85,
    radarFreshness: 25,
    radarWarmth: 65,
    radarSweetness: 45,
    radarSpiciness: 35,
    radarEarthiness: 95
  },
  {
    name: 'SANDALWOOD OIL',
    category: 'Civilisations',
    olfactiveProfile: 'Boisé, crémeux, santal, lacté, sacré',
    formula: 'Santalol (C15H24O)',
    boilingPoint: 301,
    molecularWeight: 220.4,
    chemicalFamily: 'Sesquiterpène alcool',
    radarIntensity: 75,
    radarFreshness: 30,
    radarWarmth: 80,
    radarSweetness: 70,
    radarSpiciness: 20,
    radarEarthiness: 50
  },
  {
    name: 'FRANKINCENSE OIL',
    category: 'Civilisations',
    olfactiveProfile: 'Encens, résine, citronné, spirituel, sacré',
    formula: 'Mélange de monoterpènes',
    boilingPoint: 175,
    molecularWeight: 136,
    chemicalFamily: 'Monoterpène',
    radarIntensity: 80,
    radarFreshness: 60,
    radarWarmth: 70,
    radarSweetness: 50,
    radarSpiciness: 40,
    radarEarthiness: 45
  },
  {
    name: 'MYRRH OIL',
    category: 'Civilisations',
    olfactiveProfile: 'Résine, myrrhe, balsamique, amer, médicinal',
    formula: 'Mélange de sesquiterpènes',
    boilingPoint: 280,
    molecularWeight: 218,
    chemicalFamily: 'Sesquiterpène',
    radarIntensity: 85,
    radarFreshness: 35,
    radarWarmth: 75,
    radarSweetness: 40,
    radarSpiciness: 55,
    radarEarthiness: 60
  },
  {
    name: 'BENZOIN RESIN',
    category: 'Civilisations',
    olfactiveProfile: 'Vanille, balsamique, sucré, résine, chaleureux',
    formula: 'Acide benzoïque + vanilline',
    boilingPoint: 249,
    molecularWeight: 122,
    chemicalFamily: 'Acide aromatique',
    radarIntensity: 90,
    radarFreshness: 20,
    radarWarmth: 85,
    radarSweetness: 90,
    radarSpiciness: 30,
    radarEarthiness: 35
  },
  {
    name: 'LABDANUM ABSOLUTE',
    category: 'Civilisations',
    olfactiveProfile: 'Ambré, cuir, animal, résine, chaleureux',
    formula: 'Mélange de diterpènes',
    boilingPoint: null,
    molecularWeight: null,
    chemicalFamily: 'Diterpène',
    radarIntensity: 95,
    radarFreshness: 15,
    radarWarmth: 90,
    radarSweetness: 60,
    radarSpiciness: 45,
    radarEarthiness: 70
  },
  {
    name: 'OPOPONAX RESIN',
    category: 'Civilisations',
    olfactiveProfile: 'Résine, balsamique, miel, épicé, sacré',
    formula: 'Mélange de sesquiterpènes',
    boilingPoint: 270,
    molecularWeight: 220,
    chemicalFamily: 'Sesquiterpène',
    radarIntensity: 80,
    radarFreshness: 30,
    radarWarmth: 80,
    radarSweetness: 75,
    radarSpiciness: 50,
    radarEarthiness: 55
  },
  {
    name: 'STYRAX RESIN',
    category: 'Civilisations',
    olfactiveProfile: 'Balsamique, vanille, cannelle, sucré, résine',
    formula: 'Styrène + cinnamate',
    boilingPoint: 145,
    molecularWeight: 104,
    chemicalFamily: 'Aromatique',
    radarIntensity: 85,
    radarFreshness: 25,
    radarWarmth: 85,
    radarSweetness: 85,
    radarSpiciness: 60,
    radarEarthiness: 40
  },
  {
    name: 'TONKA BEAN ABSOLUTE',
    category: 'Civilisations',
    olfactiveProfile: 'Vanille, coumarine, foin, amande, sucré',
    formula: 'Coumarine (C9H6O2)',
    boilingPoint: 291,
    molecularWeight: 146.1,
    chemicalFamily: 'Lactone aromatique',
    radarIntensity: 90,
    radarFreshness: 20,
    radarWarmth: 80,
    radarSweetness: 95,
    radarSpiciness: 35,
    radarEarthiness: 30
  }
];

console.log('🔄 Ajout des 13 molécules manquantes...\n');

for (const mol of missingMolecules) {
  try {
    const [result] = await connection.execute(
      `INSERT INTO molecules (
        name, olfactiveProfile, chemicalFormula, boilingPoint, molecularWeight, family,
        radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mol.name,
        mol.olfactiveProfile,
        mol.formula,
        mol.boilingPoint,
        mol.molecularWeight,
        mol.chemicalFamily,
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
    if (error.code === 'ER_DUP_ENTRY') {
      console.log(`⚠️  ${mol.name} existe déjà`);
    } else {
      console.error(`❌ Erreur pour ${mol.name}:`, error.message);
    }
  }
}

console.log('\n✅ Import terminé !');
await connection.end();
