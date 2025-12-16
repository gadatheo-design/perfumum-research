/**
 * Script d'insertion des 17 nouvelles matières premières
 * Commande de Hermitage Oils
 */

import mysql from 'mysql2/promise';

const newIngredients = [
  {
    name: "Palo Santo",
    formula: "C15H24O",
    family: "Bois / Résine",
    olfactiveProfile: "boisé, résineux, sacré, fumé, légèrement sucré, balsamique",
    emotionalResonance: "spiritualité, purification, méditation, ancrage",
    molecularWeight: 220,
    boilingPoint: 280,
    volatility: 35,
    intensity: 72,
    radarIntensity: 72,
    radarFreshness: 35,
    radarWarmth: 78,
    radarSweetness: 55,
    radarSpiciness: 45,
    radarEarthiness: 82,
    notes: "Distillation artisanale de bois de cœur naturellement tombé. 1.5ml sample. CHF 16.00. Hermitage Oils.",
    keyMolecules: "α-Bulnesene, Guaiol, Viridiflorol, Limonene"
  },
  {
    name: "Italian Bergamot Oil",
    formula: "C10H14O",
    family: "Agrumes / Hespéridé",
    olfactiveProfile: "frais, pétillant, floral, légèrement amer, zesté, lumineux",
    emotionalResonance: "joie, légèreté, élégance, fraîcheur méditerranéenne",
    molecularWeight: 150,
    boilingPoint: 176,
    volatility: 85,
    intensity: 68,
    radarIntensity: 68,
    radarFreshness: 92,
    radarWarmth: 25,
    radarSweetness: 45,
    radarSpiciness: 20,
    radarEarthiness: 15,
    notes: "Le classique intemporel. 1.3ml sample. CHF 6.00. Hermitage Oils.",
    keyMolecules: "Linalyl acetate, Linalool, Limonene, Bergaptene"
  },
  {
    name: "Artisan Peppermint Oil",
    formula: "C10H20O",
    family: "Aromatique / Menthé",
    olfactiveProfile: "mentholé, frais, floral, rond, équilibré, herbacé",
    emotionalResonance: "clarté mentale, vivacité, respiration profonde",
    molecularWeight: 156,
    boilingPoint: 212,
    volatility: 78,
    intensity: 82,
    radarIntensity: 82,
    radarFreshness: 95,
    radarWarmth: 15,
    radarSweetness: 30,
    radarSpiciness: 55,
    radarEarthiness: 25,
    notes: "Notes florales, France, Bio. 3ml glass attar bottle. CHF 8.00. Hermitage Oils.",
    keyMolecules: "Menthol, Menthone, Menthyl acetate, Isomenthone"
  },
  {
    name: "Wild Juniper",
    formula: "C15H24",
    family: "Conifère / Aromatique",
    olfactiveProfile: "résineux, frais, boisé, épicé, balsamique, sauvage",
    emotionalResonance: "nature sauvage, liberté, purification, force",
    molecularWeight: 204,
    boilingPoint: 256,
    volatility: 55,
    intensity: 65,
    radarIntensity: 65,
    radarFreshness: 70,
    radarWarmth: 45,
    radarSweetness: 25,
    radarSpiciness: 60,
    radarEarthiness: 72,
    notes: "Huile essentielle artisanale du Sud de la France. 1.5ml. CHF 10.00. Hermitage Oils.",
    keyMolecules: "α-Pinene, Sabinene, Myrcene, β-Pinene"
  },
  {
    name: "Mitti Attar",
    formula: "Complexe",
    family: "Terreux / Pétrichor",
    olfactiveProfile: "terreux, minéral, pluie, argile, humide, nostalgique",
    emotionalResonance: "première pluie, mémoire ancestrale, connexion à la terre",
    molecularWeight: 180,
    boilingPoint: 250,
    volatility: 40,
    intensity: 78,
    radarIntensity: 78,
    radarFreshness: 55,
    radarWarmth: 45,
    radarSweetness: 20,
    radarSpiciness: 30,
    radarEarthiness: 98,
    notes: "L'odeur de la première pluie : l'origine du Pétrichor. Attar indien traditionnel haute qualité. 0.25ml. CHF 12.00. Hermitage Oils.",
    keyMolecules: "Geosmin, 2-Methylisoborneol, Arginine pyrolysée"
  },
  {
    name: "Gris d'Ambre",
    formula: "C30H52O",
    family: "Ambre / Animalique",
    olfactiveProfile: "ambré, marin, boisé, sensuel, profond, mystérieux",
    emotionalResonance: "luxe, sensualité, profondeur océanique, intemporalité",
    molecularWeight: 432,
    boilingPoint: 350,
    volatility: 15,
    intensity: 92,
    radarIntensity: 92,
    radarFreshness: 25,
    radarWarmth: 85,
    radarSweetness: 55,
    radarSpiciness: 35,
    radarEarthiness: 65,
    notes: "Ambre gris vieilli en huile de santal vintage. 0.25ml. CHF 25.00. Hermitage Oils.",
    keyMolecules: "Ambrein, Ambrox, α-Santalol, β-Santalol"
  },
  {
    name: "Crème de Citronnelle",
    formula: "C10H18O",
    family: "Agrumes / Herbacé",
    olfactiveProfile: "citronné, crémeux, profond, rhum vieilli, herbacé, complexe",
    emotionalResonance: "chaleur tropicale, sophistication, voyage",
    molecularWeight: 154,
    boilingPoint: 224,
    volatility: 65,
    intensity: 70,
    radarIntensity: 70,
    radarFreshness: 75,
    radarWarmth: 55,
    radarSweetness: 60,
    radarSpiciness: 35,
    radarEarthiness: 40,
    notes: "Profond et complexe comme un rhum vieilli. 1.3ml. CHF 8.00. Hermitage Oils.",
    keyMolecules: "Citral, Geraniol, Citronellal, Limonene"
  },
  {
    name: "Oud Tea",
    formula: "Complexe",
    family: "Bois / Thé",
    olfactiveProfile: "boisé, fumé, thé, cuir, médicinal, profond",
    emotionalResonance: "méditation, rituel, Asie, sophistication",
    molecularWeight: 250,
    boilingPoint: 300,
    volatility: 25,
    intensity: 75,
    radarIntensity: 75,
    radarFreshness: 40,
    radarWarmth: 70,
    radarSweetness: 35,
    radarSpiciness: 55,
    radarEarthiness: 80,
    notes: "Feuilles d'Aquilaria Malaccensis d'Assam, préparées comme un thé délicieux. 20gr. CHF 7.00. Hermitage Oils.",
    keyMolecules: "Agarospirol, Jinkoh-eremol, Kusunol, Selina-3,11-dien-9-ol"
  },
  {
    name: "Miyazaki Citrus",
    formula: "C10H16",
    family: "Agrumes / Hespéridé",
    olfactiveProfile: "agrume doux, délicat, japonais, floral, rare, subtil",
    emotionalResonance: "délicatesse, Japon, raffinement, sérénité",
    molecularWeight: 136,
    boilingPoint: 176,
    volatility: 88,
    intensity: 55,
    radarIntensity: 55,
    radarFreshness: 88,
    radarWarmth: 20,
    radarSweetness: 65,
    radarSpiciness: 15,
    radarEarthiness: 10,
    notes: "Citrus tamurana - Agrume japonais rare, doux et délicat. Distillation artisanale. 1.5ml. CHF 19.00. Hermitage Oils.",
    keyMolecules: "Limonene, γ-Terpinene, Linalool, Myrcene"
  },
  {
    name: "Tangerine Dream",
    formula: "C10H16",
    family: "Agrumes / Petit-grain",
    olfactiveProfile: "mandarine, vert, floral, fruité, méditerranéen, lumineux",
    emotionalResonance: "joie enfantine, soleil, Méditerranée, douceur",
    molecularWeight: 136,
    boilingPoint: 176,
    volatility: 82,
    intensity: 62,
    radarIntensity: 62,
    radarFreshness: 85,
    radarWarmth: 30,
    radarSweetness: 70,
    radarSpiciness: 15,
    radarEarthiness: 20,
    notes: "Petit-grain de mandarine méditerranéen luxuriant. 1.5ml. CHF 9.00. Hermitage Oils.",
    keyMolecules: "Limonene, γ-Terpinene, Linalyl acetate, Methyl N-methylanthranilate"
  },
  {
    name: "Plumeria Light",
    formula: "C10H18O",
    family: "Floral / Tropical",
    olfactiveProfile: "floral, tropical, crémeux, jasminé, exotique, enveloppant",
    emotionalResonance: "paradis tropical, sensualité douce, évasion",
    molecularWeight: 154,
    boilingPoint: 230,
    volatility: 45,
    intensity: 68,
    radarIntensity: 68,
    radarFreshness: 50,
    radarWarmth: 55,
    radarSweetness: 85,
    radarSpiciness: 20,
    radarEarthiness: 25,
    notes: "Frangipanier dilué en huile de jojoba. 1.5ml. CHF 15.00. Hermitage Oils.",
    keyMolecules: "Benzyl salicylate, Linalool, Geraniol, Benzyl benzoate"
  },
  {
    name: "Omani Black Frankincense",
    formula: "C20H32O2",
    family: "Résine / Encens",
    olfactiveProfile: "résineux, fumé, sacré, citronné, balsamique, mystique",
    emotionalResonance: "spiritualité, sacré, méditation, Oman, mystère",
    molecularWeight: 304,
    boilingPoint: 290,
    volatility: 30,
    intensity: 80,
    radarIntensity: 80,
    radarFreshness: 45,
    radarWarmth: 70,
    radarSweetness: 40,
    radarSpiciness: 50,
    radarEarthiness: 75,
    notes: "Résine noire surprenante de Boswellia Sacra de Dhofar (Oman). 10gr. CHF 6.00. Hermitage Oils.",
    keyMolecules: "α-Pinene, Incensole, Boswellic acids, Limonene"
  },
  {
    name: "Neroli Bouquetier Reserve",
    formula: "C10H18O",
    family: "Floral / Agrumes",
    olfactiveProfile: "fleur d'oranger, miel, vert, lumineux, précieux, enivrant",
    emotionalResonance: "mariage, pureté, luxe, Méditerranée, bonheur",
    molecularWeight: 154,
    boilingPoint: 198,
    volatility: 70,
    intensity: 85,
    radarIntensity: 85,
    radarFreshness: 75,
    radarWarmth: 40,
    radarSweetness: 78,
    radarSpiciness: 15,
    radarEarthiness: 20,
    notes: "Quintessence de fleur d'oranger, 100% pure, naturelle et bio. 0.25ml. CHF 14.00. Hermitage Oils.",
    keyMolecules: "Linalool, Linalyl acetate, Nerolidol, Geraniol"
  },
  {
    name: "Makrut Lime",
    formula: "C10H16",
    family: "Agrumes / Asiatique",
    olfactiveProfile: "lime, feuille, vert, épicé, asiatique, vibrant",
    emotionalResonance: "Asie du Sud-Est, cuisine, fraîcheur exotique, vitalité",
    molecularWeight: 136,
    boilingPoint: 176,
    volatility: 80,
    intensity: 75,
    radarIntensity: 75,
    radarFreshness: 90,
    radarWarmth: 25,
    radarSweetness: 30,
    radarSpiciness: 45,
    radarEarthiness: 35,
    notes: "L'agrume star d'Asie du Sud. Distillation artisanale haute qualité. 5ml. CHF 25.00. Hermitage Oils.",
    keyMolecules: "Citronellal, β-Pinene, Limonene, Sabinene"
  },
  {
    name: "Spikenard",
    formula: "C15H24O",
    family: "Racine / Terreux",
    olfactiveProfile: "terreux, racine, animal, musqué, médicinal, sacré",
    emotionalResonance: "spiritualité ancienne, onction, Himalaya, profondeur",
    molecularWeight: 220,
    boilingPoint: 270,
    volatility: 25,
    intensity: 78,
    radarIntensity: 78,
    radarFreshness: 20,
    radarWarmth: 65,
    radarSweetness: 30,
    radarSpiciness: 55,
    radarEarthiness: 95,
    notes: "Nard divin / Jatamansi pur de l'Himalaya. 1.3ml. CHF 15.00. Hermitage Oils.",
    keyMolecules: "Jatamansone, Nardol, Patchouli alcohol, Calarene"
  },
  {
    name: "Haitian Vetiver",
    formula: "C15H24O",
    family: "Racine / Vétiver",
    olfactiveProfile: "terreux, fumé, notes de tête, vert, boisé, complexe",
    emotionalResonance: "terre, racines, Haïti, force tranquille",
    molecularWeight: 220,
    boilingPoint: 290,
    volatility: 35,
    intensity: 75,
    radarIntensity: 75,
    radarFreshness: 55,
    radarWarmth: 50,
    radarSweetness: 25,
    radarSpiciness: 40,
    radarEarthiness: 90,
    notes: "Vétiver bio délicieux, riche en notes de tête. 1.5ml. CHF 13.00. Hermitage Oils.",
    keyMolecules: "Khusimol, Vetiverol, Vetivone, Isovalencenol"
  },
  {
    name: "Black Emerald",
    formula: "C15H24O",
    family: "Racine / Vétiver",
    olfactiveProfile: "vétiver sauvage, fumé, vintage, profond, terreux, précieux",
    emotionalResonance: "Assam, nature sauvage, profondeur, mystère",
    molecularWeight: 220,
    boilingPoint: 295,
    volatility: 30,
    intensity: 82,
    radarIntensity: 82,
    radarFreshness: 40,
    radarWarmth: 55,
    radarSweetness: 20,
    radarSpiciness: 45,
    radarEarthiness: 95,
    notes: "Vétiver sauvage d'Assam vintage artisanal, 100% pur naturel. 1.5ml. CHF 15.00. Hermitage Oils.",
    keyMolecules: "Khusimol, Vetiverol, β-Vetivone, Zizanal"
  }
];

async function insertIngredients() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected to database');
  
  let inserted = 0;
  let skipped = 0;

  for (const ingredient of newIngredients) {
    try {
      // Vérifier si l'ingrédient existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [ingredient.name]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Skipped (already exists): ${ingredient.name}`);
        skipped++;
        continue;
      }

      // Insérer le nouvel ingrédient
      await connection.execute(
        `INSERT INTO molecules (
          name, formula, family, olfactiveProfile, emotionalResonance,
          molecularWeight, boilingPoint, volatility, intensity,
          radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ingredient.name,
          ingredient.formula,
          ingredient.family,
          ingredient.olfactiveProfile,
          ingredient.emotionalResonance,
          ingredient.molecularWeight,
          ingredient.boilingPoint,
          ingredient.volatility,
          ingredient.intensity,
          ingredient.radarIntensity,
          ingredient.radarFreshness,
          ingredient.radarWarmth,
          ingredient.radarSweetness,
          ingredient.radarSpiciness,
          ingredient.radarEarthiness,
          ingredient.notes
        ]
      );

      console.log(`✅ Inserted: ${ingredient.name}`);
      inserted++;
    } catch (error) {
      console.error(`❌ Error inserting ${ingredient.name}:`, error.message);
    }
  }

  console.log(`\n📊 Summary: ${inserted} inserted, ${skipped} skipped`);
  
  await connection.end();
}

insertIngredients().catch(console.error);
