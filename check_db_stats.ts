import { db } from './server/db';
import { molecules, recettes, accords, prototypes, civilisations, installations } from './drizzle/schema';
import { sql } from 'drizzle-orm';

async function checkStats() {
  const moleculesCount = await db.select({ count: sql<number>`count(*)` }).from(molecules);
  const recettesCount = await db.select({ count: sql<number>`count(*)` }).from(recettes);
  const accordsCount = await db.select({ count: sql<number>`count(*)` }).from(accords);
  const prototypesCount = await db.select({ count: sql<number>`count(*)` }).from(prototypes);
  const civilisationsCount = await db.select({ count: sql<number>`count(*)` }).from(civilisations);
  const installationsCount = await db.select({ count: sql<number>`count(*)` }).from(installations);

  console.log('📊 Statistiques de la base de données:');
  console.log(`- Molécules: ${moleculesCount[0].count}`);
  console.log(`- Recettes: ${recettesCount[0].count}`);
  console.log(`- Accords: ${accordsCount[0].count}`);
  console.log(`- Prototypes: ${prototypesCount[0].count}`);
  console.log(`- Civilisations: ${civilisationsCount[0].count}`);
  console.log(`- Installations: ${installationsCount[0].count}`);
}

checkStats().then(() => process.exit(0)).catch(console.error);
