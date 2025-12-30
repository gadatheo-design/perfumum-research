import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Profils radar pour les 7 terpènes (échelle 0-100)
// Axes: intensité, fraîcheur, chaleur, douceur, piquant, terreux
const radarProfiles = [
  {
    id: 1, // Myrcène
    name: "Myrcène",
    radar_intensity: 65,    // Intensité modérée-forte
    radar_freshness: 40,    // Peu frais
    radar_warmth: 70,       // Chaud, herbacé
    radar_sweetness: 55,    // Légèrement sucré
    radar_spiciness: 30,    // Peu piquant
    radar_earthiness: 75    // Très terreux, musqué
  },
  {
    id: 2, // Limonène
    radar_intensity: 85,    // Très intense
    radar_freshness: 95,    // Extrêmement frais
    radar_warmth: 20,       // Froid, vif
    radar_sweetness: 60,    // Sucré agrume
    radar_spiciness: 15,    // Très peu piquant
    radar_earthiness: 10    // Pas terreux
  },
  {
    id: 3, // α-Pinène
    radar_intensity: 75,    // Intense
    radar_freshness: 90,    // Très frais
    radar_warmth: 25,       // Frais, résineux
    radar_sweetness: 30,    // Peu sucré
    radar_spiciness: 40,    // Légèrement piquant
    radar_earthiness: 50    // Moyennement terreux (forêt)
  },
  {
    id: 4, // β-Pinène
    radar_intensity: 70,    // Modérément intense
    radar_freshness: 85,    // Très frais
    radar_warmth: 30,       // Frais, herbacé
    radar_sweetness: 35,    // Peu sucré
    radar_spiciness: 35,    // Légèrement piquant
    radar_earthiness: 45    // Moyennement terreux
  },
  {
    id: 5, // β-Caryophyllène
    radar_intensity: 80,    // Très intense
    radar_freshness: 20,    // Peu frais
    radar_warmth: 85,       // Très chaud
    radar_sweetness: 25,    // Peu sucré
    radar_spiciness: 95,    // Extrêmement piquant
    radar_earthiness: 70    // Terreux, boisé
  },
  {
    id: 6, // Linalool
    radar_intensity: 60,    // Modéré
    radar_freshness: 75,    // Frais floral
    radar_warmth: 45,       // Neutre-chaud
    radar_sweetness: 80,    // Très sucré floral
    radar_spiciness: 10,    // Très peu piquant
    radar_earthiness: 20    // Peu terreux
  },
  {
    id: 7, // Humulène
    radar_intensity: 70,    // Modérément intense
    radar_freshness: 35,    // Peu frais
    radar_warmth: 75,       // Chaud, épicé
    radar_sweetness: 40,    // Légèrement sucré
    radar_spiciness: 80,    // Très piquant
    radar_earthiness: 85    // Très terreux, boisé
  }
];

console.log('🎯 Mise à jour des profils radar pour 7 terpènes...\n');

for (const profile of radarProfiles) {
  const { id, name, ...radarData } = profile;
  
  await db.update(schema.molecules)
    .set({
      radarIntensity: radarData.radar_intensity,
      radarFreshness: radarData.radar_freshness,
      radarWarmth: radarData.radar_warmth,
      radarSweetness: radarData.radar_sweetness,
      radarSpiciness: radarData.radar_spiciness,
      radarEarthiness: radarData.radar_earthiness
    })
    .where(eq(schema.molecules.id, id));
  
  console.log(`✅ ${name}: Intensité=${radarData.radar_intensity}, Fraîcheur=${radarData.radar_freshness}, Chaleur=${radarData.radar_warmth}, Douceur=${radarData.radar_sweetness}, Piquant=${radarData.radar_spiciness}, Terreux=${radarData.radar_earthiness}`);
}

console.log('\n✨ Profils radar mis à jour avec succès!');

await connection.end();
