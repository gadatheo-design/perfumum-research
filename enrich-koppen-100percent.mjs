import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Données climatiques complètes pour les 27 plantes manquantes
const climateDataMissing = {
  "Nicotiana tabacum (préparation)": {
    latitudeMin: -5, latitudeMax: 15,
    altitudeMin: 500, altitudeMax: 2000,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1200, precipitationMax: 2500,
    temperatureMin: 18, temperatureMax: 28
  },
  "Illicium verum": {
    latitudeMin: 20, latitudeMax: 30,
    altitudeMin: 0, altitudeMax: 800,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 1000, precipitationMax: 1800,
    temperatureMin: 15, temperatureMax: 28
  },
  "Citrus aurantium": {
    latitudeMin: 25, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 600,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 500, precipitationMax: 1000,
    temperatureMin: 12, temperatureMax: 30
  },
  "Matricaria chamomilla": {
    latitudeMin: 35, latitudeMax: 60,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
    precipitationMin: 500, precipitationMax: 1000,
    temperatureMin: 5, temperatureMax: 20
  },
  "Chamaemelum nobile": {
    latitudeMin: 40, latitudeMax: 55,
    altitudeMin: 0, altitudeMax: 800,
    koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
    precipitationMin: 600, precipitationMax: 1100,
    temperatureMin: 8, temperatureMax: 22
  },
  "Cannabis sativa L.": {
    latitudeMin: -30, latitudeMax: 50,
    altitudeMin: 0, altitudeMax: 2000,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 400, precipitationMax: 1500,
    temperatureMin: 10, temperatureMax: 28
  },
  "Elettaria cardamomum": {
    latitudeMin: 8, latitudeMax: 12,
    altitudeMin: 600, altitudeMax: 1500,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1500, precipitationMax: 2500,
    temperatureMin: 15, temperatureMax: 28
  },
  "Erythroxylum coca var. ipadu": {
    latitudeMin: -5, latitudeMax: 5,
    altitudeMin: 100, altitudeMax: 1000,
    koppenZone: "Af", koppenDescription: "Tropical humide",
    precipitationMin: 2000, precipitationMax: 3500,
    temperatureMin: 20, temperatureMax: 28
  },
  "Coriandrum sativum": {
    latitudeMin: 20, latitudeMax: 50,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 300, precipitationMax: 800,
    temperatureMin: 8, temperatureMax: 25
  },
  "Cuminum cyminum": {
    latitudeMin: 15, latitudeMax: 35,
    altitudeMin: 0, altitudeMax: 1000,
    koppenZone: "BWh", koppenDescription: "Désertique chaud",
    precipitationMin: 100, precipitationMax: 400,
    temperatureMin: 15, temperatureMax: 32
  },
  "Cupressus sempervirens": {
    latitudeMin: 30, latitudeMax: 50,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 400, precipitationMax: 800,
    temperatureMin: 10, temperatureMax: 28
  },
  "Juniperus communis": {
    latitudeMin: 35, latitudeMax: 70,
    altitudeMin: 0, altitudeMax: 2000,
    koppenZone: "Cfb", koppenDescription: "Océanique tempéré",
    precipitationMin: 400, precipitationMax: 900,
    temperatureMin: 2, temperatureMax: 20
  },
  "Zingiber officinale": {
    latitudeMin: 10, latitudeMax: 30,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1200, precipitationMax: 2500,
    temperatureMin: 18, temperatureMax: 30
  },
  "Helichrysum italicum": {
    latitudeMin: 35, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 1200,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 400, precipitationMax: 700,
    temperatureMin: 12, temperatureMax: 28
  },
  "Myristica fragrans": {
    latitudeMin: -10, latitudeMax: 10,
    altitudeMin: 0, altitudeMax: 800,
    koppenZone: "Af", koppenDescription: "Tropical humide",
    precipitationMin: 2000, precipitationMax: 3000,
    temperatureMin: 22, temperatureMax: 28
  },
  "Nicotiana benthamiana": {
    latitudeMin: -35, latitudeMax: -15,
    altitudeMin: 100, altitudeMax: 1500,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 600, precipitationMax: 1200,
    temperatureMin: 12, temperatureMax: 28
  },
  "Nicotiana sylvestris": {
    latitudeMin: -25, latitudeMax: -10,
    altitudeMin: 500, altitudeMax: 2000,
    koppenZone: "Cwb", koppenDescription: "Subtropical sec hiver",
    precipitationMin: 400, precipitationMax: 1000,
    temperatureMin: 8, temperatureMax: 25
  },
  "Nicotiana tomentosiformis": {
    latitudeMin: -30, latitudeMax: -20,
    altitudeMin: 100, altitudeMax: 1200,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 700, precipitationMax: 1400,
    temperatureMin: 12, temperatureMax: 28
  },
  "Citrus aurantium var. amara": {
    latitudeMin: 25, latitudeMax: 45,
    altitudeMin: 0, altitudeMax: 600,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 500, precipitationMax: 1000,
    temperatureMin: 12, temperatureMax: 30
  },
  "Cymbopogon martinii": {
    latitudeMin: 10, latitudeMax: 30,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Aw", koppenDescription: "Tropical savane",
    precipitationMin: 800, precipitationMax: 1500,
    temperatureMin: 18, temperatureMax: 32
  },
  "Pinus sylvestris": {
    latitudeMin: 35, latitudeMax: 70,
    altitudeMin: 0, altitudeMax: 2500,
    koppenZone: "Dfb", koppenDescription: "Continental humide",
    precipitationMin: 400, precipitationMax: 1000,
    temperatureMin: -10, temperatureMax: 20
  },
  "Piper nigrum": {
    latitudeMin: -10, latitudeMax: 10,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Am", koppenDescription: "Tropical mousson",
    precipitationMin: 1500, precipitationMax: 2500,
    temperatureMin: 20, temperatureMax: 30
  },
  "Salvia sclarea": {
    latitudeMin: 35, latitudeMax: 50,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 400, precipitationMax: 800,
    temperatureMin: 8, temperatureMax: 28
  },
  "Nicotiana tabacum L.": {
    latitudeMin: -30, latitudeMax: 40,
    altitudeMin: 0, altitudeMax: 2000,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 600, precipitationMax: 1500,
    temperatureMin: 12, temperatureMax: 28
  },
  "Melaleuca alternifolia": {
    latitudeMin: -33, latitudeMax: -28,
    altitudeMin: 0, altitudeMax: 600,
    koppenZone: "Cfa", koppenDescription: "Subtropical humide",
    precipitationMin: 800, precipitationMax: 1200,
    temperatureMin: 12, temperatureMax: 28
  },
  "Thymus vulgaris": {
    latitudeMin: 35, latitudeMax: 50,
    altitudeMin: 0, altitudeMax: 1500,
    koppenZone: "Csa", koppenDescription: "Méditerranéen été chaud",
    precipitationMin: 350, precipitationMax: 700,
    temperatureMin: 8, temperatureMax: 28
  },
  "Nicotiana attenuata": {
    latitudeMin: 30, latitudeMax: 42,
    altitudeMin: 500, altitudeMax: 1500,
    koppenZone: "BWk", koppenDescription: "Désertique froid",
    precipitationMin: 200, precipitationMax: 400,
    temperatureMin: 5, temperatureMax: 25
  }
};

async function enrichKoppenData() {
  try {
    console.log("🌍 Enrichissement des données climatiques Köppen...");
    
    let updated = 0;
    let failed = 0;
    
    for (const [latinName, data] of Object.entries(climateDataMissing)) {
      try {
        const query = `
          UPDATE plants 
          SET 
            latitude_min = ?,
            latitude_max = ?,
            altitude_min = ?,
            altitude_max = ?,
            koppen_zone = ?,
            koppen_description = ?,
            precipitation_min = ?,
            precipitation_max = ?,
            temperature_min = ?,
            temperature_max = ?
          WHERE latin_name = ?
        `;
        
        const result = await connection.execute(query, [
          data.latitudeMin,
          data.latitudeMax,
          data.altitudeMin,
          data.altitudeMax,
          data.koppenZone,
          data.koppenDescription,
          data.precipitationMin,
          data.precipitationMax,
          data.temperatureMin,
          data.temperatureMax,
          latinName
        ]);
        
        if (result[0].affectedRows > 0) {
          console.log(`✅ ${latinName}: ${data.koppenZone}`);
          updated++;
        } else {
          console.log(`⚠️  ${latinName}: Pas trouvée dans la base`);
          failed++;
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${latinName}:`, error.message);
        failed++;
      }
    }
    
    console.log(`\n📊 Résumé: ${updated} plantes mises à jour, ${failed} erreurs`);
    
    // Vérifier la couverture finale
    const [plants] = await connection.execute("SELECT COUNT(*) as total, SUM(CASE WHEN koppen_zone IS NOT NULL THEN 1 ELSE 0 END) as withKoppen FROM plants");
    const coverage = (plants[0].withKoppen / plants[0].total * 100).toFixed(1);
    console.log(`\n🎯 Couverture Köppen: ${plants[0].withKoppen}/${plants[0].total} (${coverage}%)`);
    
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await connection.end();
  }
}

enrichKoppenData();
