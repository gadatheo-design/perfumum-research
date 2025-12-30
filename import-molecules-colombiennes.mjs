import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Définition des 10 nouvelles molécules colombiennes
const molecules = [
  {
    name: 'Borrachero',
    iupacName: 'Brugmansia spp. extract',
    formula: 'C17H21NO4 (Scopolamine)',
    family: 'Alcaloïdes tropaniques',
    chemicalFamily: 'Alcaloïdes',
    olfactiveProfile: 'Floral narcotique puissant, notes de jasmin, tubéreuse, datura',
    origin: 'Colombie, Andes',
    boilingPoint: 255,
    molarMass: 303.35,
    intensity: 95,
    freshness: 35,
    warmth: 60,
    sweetness: 70,
    spiciness: 25,
    earthiness: 40,
    gamme: 'Colombie'
  },
  {
    name: 'Yagé',
    iupacName: 'Banisteriopsis caapi extract',
    formula: 'C13H12N2O (Harmine)',
    family: 'β-Carbolines',
    chemicalFamily: 'Alcaloïdes',
    olfactiveProfile: 'Boisé amer sacré, notes de liane, écorce, terre humide, chamanique',
    origin: 'Colombie, Amazonie',
    boilingPoint: 320,
    molarMass: 212.25,
    intensity: 80,
    freshness: 20,
    warmth: 70,
    sweetness: 15,
    spiciness: 40,
    earthiness: 90,
    gamme: 'Colombie'
  },
  {
    name: 'Coca Décocaïnisée',
    iupacName: 'Erythroxylum coca extract (decocainized)',
    formula: 'C10H15NO (Ecgonine)',
    family: 'Alcaloïdes tropaniques',
    chemicalFamily: 'Alcaloïdes',
    olfactiveProfile: 'Vert herbacé mentholé, notes de feuille fraîche, thé vert, légèrement anisé',
    origin: 'Colombie, Andes',
    boilingPoint: 245,
    molarMass: 165.23,
    intensity: 70,
    freshness: 85,
    warmth: 30,
    sweetness: 40,
    spiciness: 35,
    earthiness: 50,
    gamme: 'Colombie'
  },
  {
    name: 'Lulo',
    iupacName: 'Solanum quitoense extract',
    formula: 'C6H8O6 (Acide ascorbique)',
    family: 'Agrumes tropicaux',
    chemicalFamily: 'Esters',
    olfactiveProfile: 'Agrume tropical acidulé, notes de citron vert, ananas, passion, rhubarbe',
    origin: 'Colombie, Andes',
    boilingPoint: 192,
    molarMass: 176.12,
    intensity: 85,
    freshness: 95,
    warmth: 20,
    sweetness: 60,
    spiciness: 10,
    earthiness: 15,
    gamme: 'Colombie'
  },
  {
    name: 'Guanábana',
    iupacName: 'Annona muricata extract',
    formula: 'C12H22O11 (Fructose)',
    family: 'Fruits tropicaux',
    chemicalFamily: 'Esters',
    olfactiveProfile: 'Crémeux tropical fraise-ananas, notes lactées, coco, litchi, doux',
    origin: 'Colombie, Caraïbes',
    boilingPoint: 186,
    molarMass: 342.30,
    intensity: 75,
    freshness: 70,
    warmth: 40,
    sweetness: 90,
    spiciness: 5,
    earthiness: 10,
    gamme: 'Colombie'
  },
  {
    name: 'Uchuva',
    iupacName: 'Physalis peruviana extract',
    formula: 'C6H8O7 (Acide citrique)',
    family: 'Fruits tropicaux',
    chemicalFamily: 'Esters',
    olfactiveProfile: 'Acidulé complexe mangue-groseille, notes de caramel, miel, agrume',
    origin: 'Colombie, Pérou, Andes',
    boilingPoint: 175,
    molarMass: 192.12,
    intensity: 80,
    freshness: 85,
    warmth: 35,
    sweetness: 75,
    spiciness: 15,
    earthiness: 20,
    gamme: 'Colombie'
  },
  {
    name: 'Cedro Rosado',
    iupacName: 'Cedrela odorata extract',
    formula: 'C15H24 (α-Cedrene)',
    family: 'Bois nobles',
    chemicalFamily: 'Sesquiterpènes',
    olfactiveProfile: 'Boisé noble rosé résineux, notes de cèdre, santal, légèrement épicé',
    origin: 'Colombie, Amérique centrale',
    boilingPoint: 262,
    molarMass: 204.35,
    intensity: 75,
    freshness: 40,
    warmth: 80,
    sweetness: 50,
    spiciness: 55,
    earthiness: 70,
    gamme: 'Colombie'
  },
  {
    name: 'Nogal Colombien',
    iupacName: 'Juglans neotropica extract',
    formula: 'C15H22O (Juglone)',
    family: 'Bois nobles',
    chemicalFamily: 'Quinones',
    olfactiveProfile: 'Boisé profond tannique, notes de noix, cuir, tabac, terre humide',
    origin: 'Colombie, Andes',
    boilingPoint: 280,
    molarMass: 218.33,
    intensity: 85,
    freshness: 25,
    warmth: 85,
    sweetness: 30,
    spiciness: 45,
    earthiness: 90,
    gamme: 'Colombie'
  },
  {
    name: 'Copal Colombien',
    iupacName: 'Protium copal resin',
    formula: 'C20H32O2 (Acide copalique)',
    family: 'Résines sacrées',
    chemicalFamily: 'Diterpènes',
    olfactiveProfile: 'Résine sacrée fumée, notes d\'encens, pin, citron, balsamique',
    origin: 'Colombie, Amazonie',
    boilingPoint: 310,
    molarMass: 304.47,
    intensity: 90,
    freshness: 45,
    warmth: 75,
    sweetness: 40,
    spiciness: 50,
    earthiness: 80,
    gamme: 'Colombie'
  },
  {
    name: 'Baume de Tolú',
    iupacName: 'Myroxylon balsamum extract',
    formula: 'C16H14O4 (Acide cinnamique)',
    family: 'Baumes',
    chemicalFamily: 'Esters',
    olfactiveProfile: 'Balsamique vanillé caramel, notes de vanille, benjoin, cannelle, miel',
    origin: 'Colombie, Tolú',
    boilingPoint: 300,
    molarMass: 270.28,
    intensity: 85,
    freshness: 30,
    warmth: 90,
    sweetness: 95,
    spiciness: 60,
    earthiness: 50,
    gamme: 'Colombie'
  }
];

console.log('\n🚀 Début de l\'import des molécules colombiennes...\n');

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
