import { getDb } from '../server/db.ts';
import { molecules } from '../drizzle/schema.ts';
import { like, or } from 'drizzle-orm';

async function checkColombianMolecules() {
  const db = await getDb();
  
  const colombianMolecules = await db.select().from(molecules).where(
    or(
      like(molecules.sourceOrigin, '%Colombie%'),
      like(molecules.sourceOrigin, '%Colombia%'),
      like(molecules.name, '%Lippia%'),
      like(molecules.name, '%Turnera%'),
      like(molecules.name, '%Calycolpus%'),
      like(molecules.name, '%Piper%'),
      like(molecules.name, '%Steiractinia%'),
      like(molecules.name, '%Café%'),
      like(molecules.name, '%Cacao%')
    )
  );

  console.log('=== MOLÉCULES COLOMBIENNES EXISTANTES ===');
  console.log('Total:', colombianMolecules.length);
  console.log('');
  
  let withRadar = 0;
  let withoutRadar = 0;
  
  colombianMolecules.forEach(m => {
    const hasRadar = m.radarIntensity !== 50 || m.radarFreshness !== 50 || 
                     m.radarWarmth !== 50 || m.radarSweetness !== 50 || 
                     m.radarSpiciness !== 50 || m.radarEarthiness !== 50;
    
    if (hasRadar) {
      withRadar++;
      console.log(`✅ ${m.name} (ID: ${m.id})`);
      console.log(`   Radar: I${m.radarIntensity} F${m.radarFreshness} W${m.radarWarmth} S${m.radarSweetness} Sp${m.radarSpiciness} E${m.radarEarthiness}`);
    } else {
      withoutRadar++;
      console.log(`❌ ${m.name} (ID: ${m.id}) - Profil radar par défaut`);
    }
  });
  
  console.log('');
  console.log(`Avec radar personnalisé: ${withRadar}`);
  console.log(`Sans radar personnalisé: ${withoutRadar}`);
  
  process.exit(0);
}

checkColombianMolecules();
