import { getDb } from '../server/db.ts';
import { molecules } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function completeRadars() {
  const db = await getDb();
  
  // Profils radar personnalisés basés sur les caractéristiques olfactives
  const radarProfiles = {
    // Sesquiterpènes - Vétiver
    450001: { // Vétivénol
      radarIntensity: 85,
      radarFreshness: 30,
      radarWarmth: 70,
      radarSweetness: 35,
      radarSpiciness: 40,
      radarEarthiness: 95
    },
    450002: { // Vétivone
      radarIntensity: 90,
      radarFreshness: 25,
      radarWarmth: 75,
      radarSweetness: 30,
      radarSpiciness: 45,
      radarEarthiness: 95
    },
    450003: { // Khusimol
      radarIntensity: 80,
      radarFreshness: 35,
      radarWarmth: 65,
      radarSweetness: 45,
      radarSpiciness: 35,
      radarEarthiness: 90
    },
    450004: { // β-guaïène
      radarIntensity: 75,
      radarFreshness: 40,
      radarWarmth: 70,
      radarSweetness: 30,
      radarSpiciness: 65,
      radarEarthiness: 85
    },
    450005: { // α-humulène
      radarIntensity: 70,
      radarFreshness: 45,
      radarWarmth: 60,
      radarSweetness: 25,
      radarSpiciness: 70,
      radarEarthiness: 80
    },
    
    // Phénols - Fumés
    450006: { // 4-methyl-guaiacol
      radarIntensity: 85,
      radarFreshness: 20,
      radarWarmth: 90,
      radarSweetness: 65,
      radarSpiciness: 55,
      radarEarthiness: 70
    },
    450007: { // Phénol boisé
      radarIntensity: 90,
      radarFreshness: 15,
      radarWarmth: 95,
      radarSweetness: 20,
      radarSpiciness: 75,
      radarEarthiness: 85
    },
    
    // Aldéhydes - Métalliques
    450008: { // Aldéhyde C-10
      radarIntensity: 75,
      radarFreshness: 50,
      radarWarmth: 60,
      radarSweetness: 30,
      radarSpiciness: 40,
      radarEarthiness: 70
    },
    450009: { // Aldéhyde C-11
      radarIntensity: 70,
      radarFreshness: 45,
      radarWarmth: 65,
      radarSweetness: 40,
      radarSpiciness: 35,
      radarEarthiness: 65
    },
    450010: { // Aldéhyde C-12
      radarIntensity: 80,
      radarFreshness: 40,
      radarWarmth: 70,
      radarSweetness: 35,
      radarSpiciness: 45,
      radarEarthiness: 75
    },
    450011: { // Aldéhyde métallique
      radarIntensity: 85,
      radarFreshness: 60,
      radarWarmth: 40,
      radarSweetness: 20,
      radarSpiciness: 30,
      radarEarthiness: 80
    },
    
    // Résinoïdes - Encens
    450012: { // Furanosesquiterpenes
      radarIntensity: 80,
      radarFreshness: 35,
      radarWarmth: 85,
      radarSweetness: 55,
      radarSpiciness: 70,
      radarEarthiness: 65
    },
    450013: { // Furanoeudesmanes
      radarIntensity: 85,
      radarFreshness: 30,
      radarWarmth: 90,
      radarSweetness: 50,
      radarSpiciness: 75,
      radarEarthiness: 70
    },
    450014: { // Incensol
      radarIntensity: 90,
      radarFreshness: 40,
      radarWarmth: 85,
      radarSweetness: 60,
      radarSpiciness: 65,
      radarEarthiness: 60
    },
    450015: { // Incensol acetate
      radarIntensity: 85,
      radarFreshness: 45,
      radarWarmth: 80,
      radarSweetness: 70,
      radarSpiciness: 55,
      radarEarthiness: 55
    },
    450016: { // Mechoulim
      radarIntensity: 95,
      radarFreshness: 35,
      radarWarmth: 90,
      radarSweetness: 65,
      radarSpiciness: 70,
      radarEarthiness: 65
    },
    
    // Minéraux
    450017: { // Oxydes de fer volatils
      radarIntensity: 80,
      radarFreshness: 30,
      radarWarmth: 85,
      radarSweetness: 15,
      radarSpiciness: 50,
      radarEarthiness: 95
    },
    450018: { // Complexes terre minérale
      radarIntensity: 75,
      radarFreshness: 25,
      radarWarmth: 80,
      radarSweetness: 20,
      radarSpiciness: 40,
      radarEarthiness: 95
    },
    
    // Quinoléine - Cuir
    450019: { // Quinoléine
      radarIntensity: 95,
      radarFreshness: 20,
      radarWarmth: 85,
      radarSweetness: 25,
      radarSpiciness: 60,
      radarEarthiness: 80
    },
    
    // Labdanum
    450020: { // Labdanum diterpenes
      radarIntensity: 90,
      radarFreshness: 25,
      radarWarmth: 95,
      radarSweetness: 70,
      radarSpiciness: 65,
      radarEarthiness: 75
    }
  };

  console.log('🎨 Complétion des profils radar...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [id, radar] of Object.entries(radarProfiles)) {
    try {
      await db.update(molecules)
        .set(radar)
        .where(eq(molecules.id, parseInt(id)));
      
      const mol = await db.select().from(molecules).where(eq(molecules.id, parseInt(id)));
      console.log(`✅ ${mol[0]?.name || `ID ${id}`} - Radar: I${radar.radarIntensity} F${radar.radarFreshness} W${radar.radarWarmth} S${radar.radarSweetness} Sp${radar.radarSpiciness} E${radar.radarEarthiness}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ID ${id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Résultat :`);
  console.log(`   Profils complétés : ${successCount}`);
  console.log(`   Erreurs : ${errorCount}`);
  console.log(`   Total molécules avec radar personnalisé : ${279 + successCount}`);

  process.exit(0);
}

completeRadars();
