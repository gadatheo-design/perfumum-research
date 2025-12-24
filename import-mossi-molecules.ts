import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Lire les données des molécules Mossi
const mossiMoleculesData = JSON.parse(
  fs.readFileSync('/home/ubuntu/mossi-molecules-data.json', 'utf-8')
);

console.log(`\n🔬 Import de ${mossiMoleculesData.length} molécules Mossi...\n`);

let successCount = 0;
let errorCount = 0;

for (const mol of mossiMoleculesData) {
  try {
    // Vérifier si la molécule existe déjà
    const existing = await db.query.molecules.findFirst({
      where: (molecules, { eq }) => eq(molecules.name, mol.name)
    });

    if (existing) {
      console.log(`⚠️  "${mol.name}" existe déjà (ID: ${existing.id}) - Ignoré`);
      continue;
    }

    // Insérer la nouvelle molécule
    await db.insert(schema.molecules).values({
      name: mol.name,
      iupacName: mol.iupacName,
      family: mol.family,
      olfactiveProfile: mol.olfactiveProfile,
      emotionalResonance: mol.emotionalResonance,
      functionalEffect: mol.functionalEffect,
      origin: mol.origin,
      concentration: mol.concentration,
      radarIntensity: mol.radarIntensity,
      radarFreshness: mol.radarFreshness,
      radarWarmth: mol.radarWarmth,
      radarSweetness: mol.radarSweetness,
      radarSpiciness: mol.radarSpiciness,
      radarEarthiness: mol.radarEarthiness
    });

    console.log(`✅ "${mol.name}" importé avec succès`);
    successCount++;
  } catch (error: any) {
    console.error(`❌ Erreur lors de l'import de "${mol.name}":`, error.message);
    errorCount++;
  }
}

console.log(`\n📊 RÉSUMÉ DE L'IMPORT :`);
console.log(`   ✅ Succès : ${successCount}`);
console.log(`   ❌ Erreurs : ${errorCount}`);
console.log(`   ⚠️  Déjà existants : ${mossiMoleculesData.length - successCount - errorCount}\n`);

await connection.end();
process.exit(0);
