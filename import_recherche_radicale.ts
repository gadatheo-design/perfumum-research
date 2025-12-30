import { getDb } from './server/db';
import { rechercheRadicale } from './drizzle/schema';
import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('./notion_recettes_radicales.json', 'utf-8'));

async function importRechercheRadicale() {
  console.log('🧪 Import des accords radicaux PERFUMUM...\n');

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const serie = data.serie;
  const avertissement = data.avertissement;
  const themesConceptuels = JSON.stringify(data.themes_conceptuels);

  let imported = 0;

  for (const accord of data.accords) {
    try {
      await db.insert(rechercheRadicale).values({
        nom: accord.nom,
        symbole: accord.symbole,
        serie: serie,
        concept: accord.concept,
        noteSpeciale: accord.note_speciale || null,
        architecture: JSON.stringify(accord.architecture),
        effet: accord.effet,
        usageArtistique: accord.usage_artistique,
        themesConceptuels: themesConceptuels,
        avertissement: avertissement,
      });

      console.log(`✅ ${accord.symbole} ${accord.nom}`);
      console.log(`   Concept: ${accord.concept}`);
      console.log(`   Ingrédients: ${accord.architecture.length}`);
      console.log('');
      imported++;
    } catch (error) {
      console.error(`❌ Erreur lors de l'import de ${accord.nom}:`, error);
    }
  }

  console.log(`\n🎉 Import terminé : ${imported}/${data.accords.length} accords importés`);
  console.log(`\n📊 Série : ${serie}`);
  console.log(`⚠️  Avertissement : ${avertissement}\n`);
}

importRechercheRadicale()
  .then(() => {
    console.log('✅ Import réussi');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
