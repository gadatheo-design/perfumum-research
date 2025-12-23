import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// 10 molécules essentielles Phase 1 - Raretés
const moleculesRaretes = [
  {
    name: "Oud (Agarwood)",
    family: "Sesquiterpènes",
    chemicalFormula: "C15H24O",
    olfactiveProfile: "Boisé profond, animal, fumé, balsamique, cuiré, complexe",
    emotionalResonance: "Mystique, sacré, opulent, méditatif",
    functionalEffect: "Ancrage, spiritualité, luxe absolu",
    sourceOrigin: "Aquilaria (Asie du Sud-Est, Cambodge, Vietnam, Inde)",
    concentration: "0.01-0.5%",
    radarIntensity: 95,
    radarFreshness: 15,
    radarWarmth: 85,
    radarSweetness: 25,
    radarSpiciness: 40,
    radarEarthiness: 90,
    molecularWeight: 220,
    boilingPoint: 280,
    volatility: 15,
    intensity: 95
  },
  {
    name: "Absolue d'Iris (Orris Butter)",
    family: "Cétones (Irones)",
    chemicalFormula: "C14H22O",
    olfactiveProfile: "Poudré délicat, floral violette, terreux racine, beurré, carotte",
    emotionalResonance: "Élégance raffinée, nostalgie, sophistication",
    functionalEffect: "Noblesse, féminité classique, profondeur",
    sourceOrigin: "Iris pallida (Italie, Maroc) - 3-6 ans de séchage",
    concentration: "0.001-0.1%",
    radarIntensity: 70,
    radarFreshness: 35,
    radarWarmth: 45,
    radarSweetness: 55,
    radarSpiciness: 15,
    radarEarthiness: 75,
    molecularWeight: 206,
    boilingPoint: 145,
    volatility: 45,
    intensity: 70
  },
  {
    name: "Ambre Gris (Ambergris)",
    family: "Triterpènes",
    chemicalFormula: "C30H52O",
    olfactiveProfile: "Marin doux, animal noble, musqué, boisé sec, tabac",
    emotionalResonance: "Mystère océanique, sensualité, rareté absolue",
    functionalEffect: "Fixation exceptionnelle, sillage, chaleur",
    sourceOrigin: "Cachalot (Physeter macrocephalus) - trouvé en mer",
    concentration: "0.01-0.5%",
    radarIntensity: 80,
    radarFreshness: 45,
    radarWarmth: 70,
    radarSweetness: 35,
    radarSpiciness: 20,
    radarEarthiness: 55,
    molecularWeight: 428,
    boilingPoint: 350,
    volatility: 10,
    intensity: 80
  },
  {
    name: "Iso E Super",
    family: "Cétones cycliques",
    chemicalFormula: "C16H26O",
    olfactiveProfile: "Boisé velouté, ambré doux, cèdre soyeux, peau chaude",
    emotionalResonance: "Confort, intimité, effet seconde peau",
    functionalEffect: "Diffusion, effet phéromone, modernité",
    sourceOrigin: "Synthèse (IFF, 1973)",
    concentration: "1-30%",
    radarIntensity: 55,
    radarFreshness: 40,
    radarWarmth: 65,
    radarSweetness: 45,
    radarSpiciness: 25,
    radarEarthiness: 60,
    molecularWeight: 234,
    boilingPoint: 285,
    volatility: 35,
    intensity: 55
  },
  {
    name: "Ambrox Super",
    family: "Éthers cycliques",
    chemicalFormula: "C16H28O",
    olfactiveProfile: "Ambre-boisé puissant, musqué minéral, cristallin, sillage",
    emotionalResonance: "Puissance maîtrisée, modernité, addiction",
    functionalEffect: "Projection maximale, effet signature, longévité",
    sourceOrigin: "Synthèse (DSM-Firmenich) - Alternative ambre gris",
    concentration: "0.5-10%",
    radarIntensity: 90,
    radarFreshness: 30,
    radarWarmth: 75,
    radarSweetness: 30,
    radarSpiciness: 35,
    radarEarthiness: 65,
    molecularWeight: 236,
    boilingPoint: 290,
    volatility: 20,
    intensity: 90
  },
  {
    name: "Coumarine",
    family: "Lactones",
    chemicalFormula: "C9H6O2",
    olfactiveProfile: "Foin coupé, tabac blond, amande douce, vanillé subtil",
    emotionalResonance: "Nostalgie champêtre, douceur, réconfort",
    functionalEffect: "Rondeur, transition, classicisme",
    sourceOrigin: "Synthèse (William Perkin, 1868) - Première molécule synthétique",
    concentration: "0.5-5%",
    radarIntensity: 60,
    radarFreshness: 45,
    radarWarmth: 55,
    radarSweetness: 70,
    radarSpiciness: 20,
    radarEarthiness: 50,
    molecularWeight: 146,
    boilingPoint: 301,
    volatility: 40,
    intensity: 60
  },
  {
    name: "Calone 1951",
    family: "Lactones marines",
    chemicalFormula: "C10H10O3",
    olfactiveProfile: "Marin iodé, pastèque fraîche, ozonic, algues, brise océanique",
    emotionalResonance: "Liberté, fraîcheur absolue, évasion marine",
    functionalEffect: "Ouverture, modernité aquatique, transparence",
    sourceOrigin: "Synthèse (Pfizer, 1951) - Révolution parfums aquatiques",
    concentration: "0.01-0.5%",
    radarIntensity: 75,
    radarFreshness: 95,
    radarWarmth: 15,
    radarSweetness: 40,
    radarSpiciness: 10,
    radarEarthiness: 25,
    molecularWeight: 178,
    boilingPoint: 156,
    volatility: 75,
    intensity: 75
  },
  {
    name: "Galaxolide",
    family: "Muscs polycycliques",
    chemicalFormula: "C18H26O",
    olfactiveProfile: "Musc propre, poudré doux, floral blanc, linge frais",
    emotionalResonance: "Propreté, douceur, intimité quotidienne",
    functionalEffect: "Fixation, rondeur, effet clean",
    sourceOrigin: "Synthèse (IFF, 1965) - Musc le plus utilisé",
    concentration: "1-15%",
    radarIntensity: 50,
    radarFreshness: 60,
    radarWarmth: 40,
    radarSweetness: 55,
    radarSpiciness: 10,
    radarEarthiness: 30,
    molecularWeight: 258,
    boilingPoint: 325,
    volatility: 10,
    intensity: 50
  },
  {
    name: "Cashmeran",
    family: "Cétones musquées",
    chemicalFormula: "C14H22O",
    olfactiveProfile: "Musqué chaleureux, boisé épicé, ambré doux, cachemire",
    emotionalResonance: "Chaleur enveloppante, confort luxueux, sensualité",
    functionalEffect: "Diffusion, chaleur, effet cocooning",
    sourceOrigin: "Synthèse (IFF, 1970s)",
    concentration: "1-10%",
    radarIntensity: 65,
    radarFreshness: 25,
    radarWarmth: 80,
    radarSweetness: 50,
    radarSpiciness: 45,
    radarEarthiness: 55,
    molecularWeight: 206,
    boilingPoint: 275,
    volatility: 30,
    intensity: 65
  },
  {
    name: "Javanol",
    family: "Acétals santalés",
    chemicalFormula: "C14H22O2",
    olfactiveProfile: "Santal crémeux, boisé lacté, doux velouté, peau",
    emotionalResonance: "Sérénité, méditation, luxe discret",
    functionalEffect: "Reconstitution santal Mysore, onctuosité",
    sourceOrigin: "Synthèse (Givaudan, 1990s) - Meilleure reconstitution santal",
    concentration: "1-15%",
    radarIntensity: 60,
    radarFreshness: 35,
    radarWarmth: 70,
    radarSweetness: 65,
    radarSpiciness: 20,
    radarEarthiness: 50,
    molecularWeight: 238,
    boilingPoint: 265,
    volatility: 40,
    intensity: 60
  }
];

async function importMolecules() {
  console.log("🧪 Import des 10 molécules essentielles - Gamme Raretés...\n");
  
  let insertedCount = 0;
  
  for (const mol of moleculesRaretes) {
    try {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  ${mol.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      // Insérer la nouvelle molécule
      const [result] = await connection.execute(
        `INSERT INTO molecules (
          name, family, chemicalFormula, olfactiveProfile,
          emotionalResonance, functionalEffect, sourceOrigin, concentration,
          radar_intensity, radar_freshness, radar_warmth,
          radar_sweetness, radar_spiciness, radar_earthiness,
          molecularWeight, boilingPoint, volatility, intensity,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          mol.name, mol.family, mol.chemicalFormula, mol.olfactiveProfile,
          mol.emotionalResonance, mol.functionalEffect, mol.sourceOrigin, mol.concentration,
          mol.radarIntensity, mol.radarFreshness, mol.radarWarmth,
          mol.radarSweetness, mol.radarSpiciness, mol.radarEarthiness,
          mol.molecularWeight, mol.boilingPoint, mol.volatility, mol.intensity
        ]
      );
      
      console.log(`✅ ${mol.name} importé (ID: ${result.insertId})`);
      insertedCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ${mol.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 Résumé: ${insertedCount}/${moleculesRaretes.length} molécules importées`);
  
  // Compter le total des molécules
  const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM molecules');
  console.log(`📈 Total molécules dans la base: ${countResult[0].total}`);
  
  await connection.end();
}

importMolecules().catch(console.error);
