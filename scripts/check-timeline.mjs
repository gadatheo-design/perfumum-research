import { db } from '../server/db.js';
import { researchTimeline } from '../drizzle/schema.js';

async function checkTimeline() {
  try {
    const result = await db.select().from(researchTimeline);
    console.log('Nombre d\'entrées dans researchTimeline:', result.length);
    console.log('\nPremières entrées:');
    result.slice(0, 5).forEach((entry, i) => {
      console.log(`\n${i + 1}. ${entry.title}`);
      console.log(`   Phase: ${entry.phase}, Catégorie: ${entry.category}, Statut: ${entry.status}`);
      console.log(`   Période: ${entry.quarter} (${entry.year})`);
    });
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    process.exit(0);
  }
}

checkTimeline();
