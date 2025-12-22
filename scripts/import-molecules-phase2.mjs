import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// 20 molécules Phase 2 - Raretés avancées
const moleculesPhase2 = [
  // === MUSCS PRÉCIEUX ===
  {
    name: "Muscone",
    family: "Muscs macrocycliques",
    chemicalFormula: "C16H30O",
    olfactiveProfile: "Musc animal noble, poudré doux, sensuel, peau chaude",
    emotionalResonance: "Sensualité animale, intimité, luxe discret",
    functionalEffect: "Fixation exceptionnelle, effet peau, sillage",
    sourceOrigin: "Cerf porte-musc (Moschus) - Synthèse préférée",
    concentration: "0.1-2%",
    radarIntensity: 75,
    radarFreshness: 25,
    radarWarmth: 70,
    radarSweetness: 45,
    radarSpiciness: 15,
    radarEarthiness: 40,
    molecularWeight: 238,
    boilingPoint: 327,
    volatility: 15,
    intensity: 75
  },
  {
    name: "Civettone",
    family: "Muscs macrocycliques",
    chemicalFormula: "C17H30O",
    olfactiveProfile: "Musc animal intense, fécal noble, ambré, cuiré",
    emotionalResonance: "Animalité brute, passion, mystère",
    functionalEffect: "Profondeur, fixation, caractère",
    sourceOrigin: "Civette d'Afrique - Synthèse éthique disponible",
    concentration: "0.01-0.5%",
    radarIntensity: 85,
    radarFreshness: 10,
    radarWarmth: 75,
    radarSweetness: 25,
    radarSpiciness: 30,
    radarEarthiness: 65,
    molecularWeight: 250,
    boilingPoint: 340,
    volatility: 10,
    intensity: 85
  },
  {
    name: "Ethylene Brassylate",
    family: "Muscs macrocycliques",
    chemicalFormula: "C15H26O4",
    olfactiveProfile: "Musc blanc propre, floral doux, poudré léger",
    emotionalResonance: "Propreté, douceur, innocence",
    functionalEffect: "Base musquée, effet clean, fixation douce",
    sourceOrigin: "Synthèse (Firmenich)",
    concentration: "2-15%",
    radarIntensity: 40,
    radarFreshness: 55,
    radarWarmth: 35,
    radarSweetness: 60,
    radarSpiciness: 5,
    radarEarthiness: 25,
    molecularWeight: 270,
    boilingPoint: 310,
    volatility: 20,
    intensity: 40
  },
  
  // === BOIS PRÉCIEUX ===
  {
    name: "Santal Mysore (α-Santalol)",
    family: "Alcools sesquiterpéniques",
    chemicalFormula: "C15H24O",
    olfactiveProfile: "Santal crémeux, boisé lacté, doux onctueux, sacré",
    emotionalResonance: "Méditation, sérénité, spiritualité",
    functionalEffect: "Noblesse, profondeur, fixation naturelle",
    sourceOrigin: "Santalum album (Mysore, Inde) - CITES protégé",
    concentration: "1-10%",
    radarIntensity: 65,
    radarFreshness: 30,
    radarWarmth: 65,
    radarSweetness: 70,
    radarSpiciness: 15,
    radarEarthiness: 55,
    molecularWeight: 220,
    boilingPoint: 301,
    volatility: 25,
    intensity: 65
  },
  {
    name: "Cèdre Atlas (Cedrene)",
    family: "Sesquiterpènes",
    chemicalFormula: "C15H24",
    olfactiveProfile: "Boisé sec, crayeux, cèdre noble, légèrement fumé",
    emotionalResonance: "Force tranquille, ancrage, masculinité",
    functionalEffect: "Structure, sécheresse, base boisée",
    sourceOrigin: "Cedrus atlantica (Maroc, Algérie)",
    concentration: "2-15%",
    radarIntensity: 55,
    radarFreshness: 35,
    radarWarmth: 50,
    radarSweetness: 25,
    radarSpiciness: 20,
    radarEarthiness: 70,
    molecularWeight: 204,
    boilingPoint: 262,
    volatility: 35,
    intensity: 55
  },
  {
    name: "Gaïac (Guaiol)",
    family: "Alcools sesquiterpéniques",
    chemicalFormula: "C15H26O",
    olfactiveProfile: "Boisé fumé, thé vert, rose sèche, cuiré subtil",
    emotionalResonance: "Sophistication, mystère, élégance froide",
    functionalEffect: "Transition, complexité, effet thé",
    sourceOrigin: "Bulnesia sarmientoi (Argentine, Paraguay)",
    concentration: "1-8%",
    radarIntensity: 50,
    radarFreshness: 45,
    radarWarmth: 40,
    radarSweetness: 35,
    radarSpiciness: 25,
    radarEarthiness: 60,
    molecularWeight: 222,
    boilingPoint: 288,
    volatility: 30,
    intensity: 50
  },
  
  // === FLORAUX PRÉCIEUX ===
  {
    name: "Absolue de Rose (Citronellol)",
    family: "Monoterpénols",
    chemicalFormula: "C10H20O",
    olfactiveProfile: "Rose fraîche, géranium, citronné doux, pétale",
    emotionalResonance: "Romance, féminité, beauté classique",
    functionalEffect: "Cœur floral, fraîcheur, élégance",
    sourceOrigin: "Rosa damascena (Bulgarie, Turquie, Maroc)",
    concentration: "0.5-5%",
    radarIntensity: 60,
    radarFreshness: 65,
    radarWarmth: 35,
    radarSweetness: 55,
    radarSpiciness: 10,
    radarEarthiness: 20,
    molecularWeight: 156,
    boilingPoint: 225,
    volatility: 55,
    intensity: 60
  },
  {
    name: "Absolue de Jasmin (Indole)",
    family: "Indoles",
    chemicalFormula: "C8H7N",
    olfactiveProfile: "Jasmin animal, floral narcotique, fécal noble, envoûtant",
    emotionalResonance: "Séduction, nuit, passion",
    functionalEffect: "Profondeur florale, animalité, caractère",
    sourceOrigin: "Jasminum grandiflorum (Grasse, Égypte, Inde)",
    concentration: "0.01-0.5%",
    radarIntensity: 80,
    radarFreshness: 20,
    radarWarmth: 55,
    radarSweetness: 45,
    radarSpiciness: 15,
    radarEarthiness: 35,
    molecularWeight: 117,
    boilingPoint: 254,
    volatility: 45,
    intensity: 80
  },
  {
    name: "Tubéreuse Absolue (Methyl Benzoate)",
    family: "Esters aromatiques",
    chemicalFormula: "C8H8O2",
    olfactiveProfile: "Tubéreuse crémeuse, floral blanc, narcotique, beurré",
    emotionalResonance: "Opulence, sensualité, nuit blanche",
    functionalEffect: "Richesse florale, effet capiteux, sillage",
    sourceOrigin: "Polianthes tuberosa (Inde, Égypte)",
    concentration: "0.1-2%",
    radarIntensity: 75,
    radarFreshness: 25,
    radarWarmth: 50,
    radarSweetness: 65,
    radarSpiciness: 10,
    radarEarthiness: 30,
    molecularWeight: 136,
    boilingPoint: 199,
    volatility: 50,
    intensity: 75
  },
  
  // === ÉPICES & RÉSINES ===
  {
    name: "Safranal",
    family: "Aldéhydes terpéniques",
    chemicalFormula: "C10H14O",
    olfactiveProfile: "Safran épicé, cuiré doux, foin, miel ambré",
    emotionalResonance: "Luxe oriental, chaleur, préciosité",
    functionalEffect: "Accent épicé, richesse, effet doré",
    sourceOrigin: "Crocus sativus (Iran, Cachemire, Espagne)",
    concentration: "0.01-0.5%",
    radarIntensity: 85,
    radarFreshness: 20,
    radarWarmth: 80,
    radarSweetness: 40,
    radarSpiciness: 75,
    radarEarthiness: 45,
    molecularWeight: 150,
    boilingPoint: 70,
    volatility: 80,
    intensity: 85
  },
  {
    name: "Cardamome (α-Terpinyl Acetate)",
    family: "Esters terpéniques",
    chemicalFormula: "C12H20O2",
    olfactiveProfile: "Cardamome fraîche, épicé vert, eucalyptus doux, aromatique",
    emotionalResonance: "Fraîcheur épicée, éveil, sophistication",
    functionalEffect: "Ouverture, fraîcheur épicée, transition",
    sourceOrigin: "Elettaria cardamomum (Guatemala, Inde)",
    concentration: "1-5%",
    radarIntensity: 60,
    radarFreshness: 70,
    radarWarmth: 45,
    radarSweetness: 35,
    radarSpiciness: 55,
    radarEarthiness: 25,
    molecularWeight: 196,
    boilingPoint: 220,
    volatility: 55,
    intensity: 60
  },
  {
    name: "Encens Oliban (Incensole)",
    family: "Diterpènes",
    chemicalFormula: "C20H34O",
    olfactiveProfile: "Encens sacré, résineux, citronné, fumé spirituel",
    emotionalResonance: "Spiritualité, méditation, sacré",
    functionalEffect: "Élévation, profondeur, effet temple",
    sourceOrigin: "Boswellia sacra (Oman, Yémen, Somalie)",
    concentration: "1-10%",
    radarIntensity: 70,
    radarFreshness: 40,
    radarWarmth: 55,
    radarSweetness: 30,
    radarSpiciness: 35,
    radarEarthiness: 50,
    molecularWeight: 290,
    boilingPoint: 350,
    volatility: 20,
    intensity: 70
  },
  {
    name: "Myrrhe (Curzerene)",
    family: "Sesquiterpènes",
    chemicalFormula: "C15H22",
    olfactiveProfile: "Myrrhe balsamique, fumé doux, médicinal, amer noble",
    emotionalResonance: "Mystère ancien, guérison, profondeur",
    functionalEffect: "Base résineuse, amertume noble, fixation",
    sourceOrigin: "Commiphora myrrha (Somalie, Éthiopie, Yémen)",
    concentration: "1-8%",
    radarIntensity: 65,
    radarFreshness: 25,
    radarWarmth: 60,
    radarSweetness: 20,
    radarSpiciness: 40,
    radarEarthiness: 70,
    molecularWeight: 202,
    boilingPoint: 280,
    volatility: 30,
    intensity: 65
  },
  
  // === AGRUMES RARES ===
  {
    name: "Bergamote Calabre (Linalyl Acetate)",
    family: "Esters terpéniques",
    chemicalFormula: "C12H20O2",
    olfactiveProfile: "Bergamote fraîche, thé Earl Grey, citrus floral, pétillant",
    emotionalResonance: "Élégance, fraîcheur, optimisme",
    functionalEffect: "Ouverture, luminosité, effet cologne",
    sourceOrigin: "Citrus bergamia (Calabre, Italie)",
    concentration: "2-15%",
    radarIntensity: 55,
    radarFreshness: 85,
    radarWarmth: 25,
    radarSweetness: 45,
    radarSpiciness: 15,
    radarEarthiness: 15,
    molecularWeight: 196,
    boilingPoint: 220,
    volatility: 65,
    intensity: 55
  },
  {
    name: "Yuzu (Limonene + Linalool)",
    family: "Monoterpènes",
    chemicalFormula: "C10H16",
    olfactiveProfile: "Yuzu japonais, citrus vert, mandarine, floral subtil",
    emotionalResonance: "Zen, pureté, raffinement japonais",
    functionalEffect: "Fraîcheur unique, effet spa, légèreté",
    sourceOrigin: "Citrus junos (Japon, Corée)",
    concentration: "2-10%",
    radarIntensity: 50,
    radarFreshness: 90,
    radarWarmth: 20,
    radarSweetness: 40,
    radarSpiciness: 10,
    radarEarthiness: 10,
    molecularWeight: 136,
    boilingPoint: 176,
    volatility: 80,
    intensity: 50
  },
  
  // === MOLÉCULES SIGNATURE ===
  {
    name: "Hedione",
    family: "Esters jasminés",
    chemicalFormula: "C13H22O3",
    olfactiveProfile: "Jasmin transparent, floral aérien, radiant, lumineux",
    emotionalResonance: "Légèreté, joie, effet halo",
    functionalEffect: "Diffusion, radiance, effet phéromone",
    sourceOrigin: "Synthèse (Firmenich, 1962) - Révolution Eau Sauvage",
    concentration: "5-25%",
    radarIntensity: 45,
    radarFreshness: 70,
    radarWarmth: 35,
    radarSweetness: 50,
    radarSpiciness: 5,
    radarEarthiness: 15,
    molecularWeight: 226,
    boilingPoint: 280,
    volatility: 40,
    intensity: 45
  },
  {
    name: "Ambroxan (Cetalox)",
    family: "Éthers cycliques",
    chemicalFormula: "C16H28O",
    olfactiveProfile: "Ambre cristallin, boisé minéral, musc sec, sillage",
    emotionalResonance: "Modernité, puissance, addiction",
    functionalEffect: "Projection, longévité, effet signature",
    sourceOrigin: "Synthèse (Firmenich) - Version grand public Ambrox",
    concentration: "1-15%",
    radarIntensity: 85,
    radarFreshness: 35,
    radarWarmth: 70,
    radarSweetness: 30,
    radarSpiciness: 30,
    radarEarthiness: 60,
    molecularWeight: 236,
    boilingPoint: 290,
    volatility: 20,
    intensity: 85
  },
  {
    name: "Norlimbanol",
    family: "Alcools boisés",
    chemicalFormula: "C14H26O",
    olfactiveProfile: "Boisé crémeux, santal moderne, velouté, peau",
    emotionalResonance: "Douceur, confort, intimité",
    functionalEffect: "Alternative santal, onctuosité, base",
    sourceOrigin: "Synthèse (Firmenich) - Alternative durable santal",
    concentration: "2-15%",
    radarIntensity: 55,
    radarFreshness: 30,
    radarWarmth: 65,
    radarSweetness: 60,
    radarSpiciness: 15,
    radarEarthiness: 50,
    molecularWeight: 214,
    boilingPoint: 270,
    volatility: 35,
    intensity: 55
  },
  {
    name: "Clearwood (Patchouli Synthétique)",
    family: "Sesquiterpènes",
    chemicalFormula: "C15H26O",
    olfactiveProfile: "Patchouli propre, boisé transparent, moderne, sec",
    emotionalResonance: "Modernité, propreté, sophistication",
    functionalEffect: "Patchouli sans lourdeur, base moderne",
    sourceOrigin: "Synthèse (Firmenich, 2014) - Patchouli réinventé",
    concentration: "2-15%",
    radarIntensity: 60,
    radarFreshness: 50,
    radarWarmth: 45,
    radarSweetness: 35,
    radarSpiciness: 20,
    radarEarthiness: 65,
    molecularWeight: 222,
    boilingPoint: 285,
    volatility: 30,
    intensity: 60
  },
  {
    name: "Paradisone",
    family: "Lactones florales",
    chemicalFormula: "C13H22O2",
    olfactiveProfile: "Jasmin fruité, poire juteuse, floral moderne, radiant",
    emotionalResonance: "Joie, fraîcheur, féminité moderne",
    functionalEffect: "Effet fruité-floral, modernité, diffusion",
    sourceOrigin: "Synthèse (Firmenich, 2007) - Jasmin du futur",
    concentration: "1-10%",
    radarIntensity: 55,
    radarFreshness: 65,
    radarWarmth: 30,
    radarSweetness: 70,
    radarSpiciness: 5,
    radarEarthiness: 15,
    molecularWeight: 210,
    boilingPoint: 260,
    volatility: 45,
    intensity: 55
  }
];

async function importMolecules() {
  console.log("🧪 Import des 20 molécules Phase 2 - Raretés avancées...\n");
  
  let insertedCount = 0;
  let skippedCount = 0;
  
  for (const mol of moleculesPhase2) {
    try {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  ${mol.name} existe déjà (ID: ${existing[0].id})`);
        skippedCount++;
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
  
  console.log(`\n📊 Résumé: ${insertedCount} importées, ${skippedCount} existantes`);
  
  // Compter le total des molécules
  const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM molecules');
  console.log(`📈 Total molécules dans la base: ${countResult[0].total}`);
  
  await connection.end();
}

importMolecules().catch(console.error);
