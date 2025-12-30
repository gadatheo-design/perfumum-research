import { getDb } from '../server/db.ts';
import { molecules } from '../drizzle/schema.ts';

async function checkMissingRadars() {
  const db = await getDb();
  
  const allMolecules = await db.select().from(molecules);

  console.log('=== ANALYSE DES PROFILS RADAR ===\n');
  console.log(`Total molécules : ${allMolecules.length}\n`);
  
  const withDefaultRadar = allMolecules.filter(m => 
    m.radarIntensity === 50 && 
    m.radarFreshness === 50 && 
    m.radarWarmth === 50 && 
    m.radarSweetness === 50 && 
    m.radarSpiciness === 50 && 
    m.radarEarthiness === 50
  );
  
  const withCustomRadar = allMolecules.filter(m => 
    m.radarIntensity !== 50 || 
    m.radarFreshness !== 50 || 
    m.radarWarmth !== 50 || 
    m.radarSweetness !== 50 || 
    m.radarSpiciness !== 50 || 
    m.radarEarthiness !== 50
  );

  console.log(`✅ Avec profil radar personnalisé : ${withCustomRadar.length}`);
  console.log(`❌ Avec profil radar par défaut : ${withDefaultRadar.length}\n`);

  if (withDefaultRadar.length > 0) {
    console.log('=== MOLÉCULES À COMPLÉTER ===\n');
    withDefaultRadar.forEach((m, index) => {
      console.log(`${index + 1}. ${m.name} (ID: ${m.id})`);
      console.log(`   Famille: ${m.family || 'Non spécifiée'}`);
      console.log(`   Profil: ${m.olfactiveProfile?.substring(0, 80) || 'Non spécifié'}...`);
      console.log('');
    });
  }

  // Grouper par famille
  const byFamily = {};
  withDefaultRadar.forEach(m => {
    const family = m.family || 'Non classé';
    if (!byFamily[family]) byFamily[family] = [];
    byFamily[family].push(m.name);
  });

  console.log('=== RÉPARTITION PAR FAMILLE ===\n');
  Object.entries(byFamily).sort((a, b) => b[1].length - a[1].length).forEach(([family, mols]) => {
    console.log(`${family} : ${mols.length} molécules`);
  });

  process.exit(0);
}

checkMissingRadars();
