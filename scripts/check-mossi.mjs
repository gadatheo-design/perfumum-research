import { getDb } from '../server/db.ts';
import { traditionsOlfactives } from '../drizzle/schema.ts';

async function checkMossi() {
  const db = await getDb();
  const all = await db.select().from(traditionsOlfactives);

  console.log('🔍 Recherche de traditions avec "Mossi" ou "Civilisation":\n');
  
  const filtered = all.filter(t => 
    t.name.toLowerCase().includes('mossi') || 
    t.name.toLowerCase().includes('civilisation')
  );

  if (filtered.length > 0) {
    filtered.forEach(t => console.log(`  - ID ${t.id}: ${t.name}`));
  } else {
    console.log('  ✅ Aucune tradition avec "Mossi" ou "Civilisation" trouvée');
  }

  console.log(`\n📊 Total traditions: ${all.length}`);
  
  // Afficher toutes les traditions
  console.log('\n📋 Liste complète des traditions:');
  all.forEach(t => console.log(`  - ${t.name}`));
  
  process.exit(0);
}

checkMossi();
