import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Définition des 9 molécules colombiennes manquantes
const molecules = [
  {
    name: 'Café Geisha',
    iupacName: 'Coffea arabica var. Geisha extract',
    formula: 'C8H10N4O2 (Caféine)',
    family: 'Café',
    chemicalFamily: 'Alcaloïdes',
    olfactiveProfile: 'Floral jasmin bergamote, notes de fleur blanche, agrume, thé vert, miel',
    origin: 'Colombie, Panama, Éthiopie',
    boilingPoint: 178,
    molarMass: 194.19,
    intensity: 80,
    freshness: 75,
    warmth: 50,
    sweetness: 70,
    spiciness: 30,
    earthiness: 40,
    gamme: 'Colombie'
  },
  {
    name: 'Fleur de Café',
    iupacName: 'Coffea arabica flower extract',
    formula: 'C16H18O9 (Chlorogenic acid)',
    family: 'Fleurs blanches',
    chemicalFamily: 'Esters',
    olfactiveProfile: 'Jasmin blanc délicat, notes de fleur d\'oranger, néroli, miel, légèrement vert',
    origin: 'Colombie, Brésil, Éthiopie',
    boilingPoint: 208,
    molarMass: 354.31,
    intensity: 75,
    freshness: 80,
    warmth: 45,
    sweetness: 75,
    spiciness: 20,
    earthiness: 25,
    gamme: 'Colombie'
  },
  {
    name: 'Cacao Colombien',
    iupacName: 'Theobroma cacao extract',
    formula: 'C7H8N4O2 (Théobromine)',
    family: 'Cacao',
    chemicalFamily: 'Alcaloïdes',
    olfactiveProfile: 'Chocolat amer terreux, notes de cacao torréfié, noix, tabac, cuir',
    origin: 'Colombie, Équateur, Venezuela',
    boilingPoint: 290,
    molarMass: 180.16,
    intensity: 85,
    freshness: 20,
    warmth: 80,
    sweetness: 60,
    spiciness: 40,
    earthiness: 85,
    gamme: 'Colombie'
  },
  {
    name: 'Vanilla Pompona',
    iupacName: 'Vanilla pompona extract',
    formula: 'C8H8O3 (Vanilline)',
    family: 'Vanille',
    chemicalFamily: 'Aldéhydes',
    olfactiveProfile: 'Vanille tropicale intense, notes de caramel, pruneaux, tabac blond, miel',
    origin: 'Colombie, Guyane, Antilles',
    boilingPoint: 285,
    molarMass: 152.15,
    intensity: 90,
    freshness: 25,
    warmth: 85,
    sweetness: 95,
    spiciness: 45,
    earthiness: 40,
    gamme: 'Colombie'
  },
  {
    name: 'Copaiba',
    iupacName: 'Copaifera officinalis resin',
    formula: 'C15H24 (β-Caryophyllene)',
    family: 'Baumes',
    chemicalFamily: 'Sesquiterpènes',
    olfactiveProfile: 'Baumier résineux doux, notes de bois, miel, légèrement épicé, balsamique',
    origin: 'Colombie, Brésil, Amazonie',
    boilingPoint: 256,
    molarMass: 204.35,
    intensity: 75,
    freshness: 35,
    warmth: 75,
    sweetness: 60,
    spiciness: 50,
    earthiness: 65,
    gamme: 'Colombie'
  },
  {
    name: 'Lippia Origanoides',
    iupacName: 'Lippia origanoides extract',
    formula: 'C10H14O (Thymol)',
    family: 'Herbes aromatiques',
    chemicalFamily: 'Phénols',
    olfactiveProfile: 'Phénols aromatiques herbacé médicinal, notes d\'origan, thym, camphre',
    origin: 'Colombie, Venezuela, Andes',
    boilingPoint: 233,
    molarMass: 150.22,
    intensity: 90,
    freshness: 60,
    warmth: 70,
    sweetness: 20,
    spiciness: 85,
    earthiness: 55,
    gamme: 'Colombie'
  },
  {
    name: 'Piper Aduncum',
    iupacName: 'Piper aduncum extract',
    formula: 'C10H12O3 (Dillapiole)',
    family: 'Poivres',
    chemicalFamily: 'Phénylpropanoïdes',
    olfactiveProfile: 'Poivre vert piquant, notes de feuille, herbe, légèrement anisé, médicinal',
    origin: 'Colombie, Amazonie, Amérique centrale',
    boilingPoint: 285,
    molarMass: 180.20,
    intensity: 85,
    freshness: 65,
    warmth: 75,
    sweetness: 25,
    spiciness: 90,
    earthiness: 60,
    gamme: 'Colombie'
  },
  {
    name: 'Calycolpus Moritzianus',
    iupacName: 'Calycolpus moritzianus extract',
    formula: 'C10H18O (Eucalyptol)',
    family: 'Herbes aromatiques',
    chemicalFamily: 'Monoterpènes',
    olfactiveProfile: 'Eucalyptol frais menthe andine, notes de camphre, romarin, pin',
    origin: 'Colombie, Venezuela, Andes',
    boilingPoint: 176,
    molarMass: 154.25,
    intensity: 85,
    freshness: 95,
    warmth: 40,
    sweetness: 30,
    spiciness: 55,
    earthiness: 45,
    gamme: 'Colombie'
  },
  {
    name: 'Turnera Diffusa',
    iupacName: 'Turnera diffusa extract (Damiana)',
    formula: 'C10H14O (Arbutin)',
    family: 'Herbes aromatiques',
    chemicalFamily: 'Glycosides',
    olfactiveProfile: 'Aphrodisiaque floral herbacé, notes de camomille, figue, miel, légèrement amer',
    origin: 'Colombie, Mexique, Amérique centrale',
    boilingPoint: 220,
    molarMass: 166.17,
    intensity: 70,
    freshness: 60,
    warmth: 65,
    sweetness: 55,
    spiciness: 40,
    earthiness: 50,
    gamme: 'Colombie'
  }
];

console.log('\n🚀 Début de l\'import des molécules manquantes...\n');

let successCount = 0;
let errorCount = 0;

for (const mol of molecules) {
  try {
    console.log(`📝 Insertion: ${mol.name}`);
    
    await db.insert(schema.molecules).values({
      name: mol.name,
      iupacName: mol.iupacName,
      formula: mol.formula,
      family: mol.family,
      chemicalFamily: mol.chemicalFamily,
      olfactiveProfile: mol.olfactiveProfile,
      origin: mol.origin,
      boilingPoint: mol.boilingPoint,
      molarMass: mol.molarMass,
      intensity: mol.intensity,
      freshness: mol.freshness,
      warmth: mol.warmth,
      sweetness: mol.sweetness,
      spiciness: mol.spiciness,
      earthiness: mol.earthiness,
      gamme: mol.gamme,
      createdAt: new Date()
    });
    
    console.log(`   ✅ ${mol.name} ajoutée avec succès\n`);
    successCount++;
    
  } catch (error) {
    console.error(`   ❌ Erreur pour ${mol.name}:`, error.message);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE L\'IMPORT');
console.log('='.repeat(60));
console.log(`✅ Molécules importées avec succès: ${successCount}`);
console.log(`❌ Erreurs: ${errorCount}`);
console.log(`📦 Total: ${molecules.length} molécules`);
console.log('='.repeat(60) + '\n');

await connection.end();
