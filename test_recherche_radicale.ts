import { getDb } from './server/db';
import { rechercheRadicale } from './drizzle/schema';

async function testRechercheRadicale() {
  console.log('🧪 Test de la table recherche_radicale\n');

  const db = await getDb();
  if (!db) {
    console.error('❌ Base de données non disponible');
    process.exit(1);
  }

  try {
    const accords = await db.select().from(rechercheRadicale);
    
    console.log(`✅ ${accords.length} accords trouvés dans la base\n`);
    
    accords.forEach((accord) => {
      console.log(`${accord.symbole} ${accord.nom}`);
      console.log(`   ID: ${accord.id}`);
      console.log(`   Concept: ${accord.concept}`);
      console.log('');
    });

    console.log('✅ Test réussi - Les données sont bien présentes');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testRechercheRadicale();
