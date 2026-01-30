// Script d'import des recettes Indole/Skatole et des esters aromatiques du tabac
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await createConnection(process.env.DATABASE_URL);

// ============================================
// PARTIE 1 : Recettes Gamme Indole/Skatole
// ============================================

const indoleSkatoleRecipes = [
  {
    name: 'Black Oud Skin',
    category: 'resine_cbd',
    description: 'Profil animal-boisé intense. Indole et skatole sur fond de ciste, castoréum et labdanum. Évoque un cuir ancien et précieux.',
    ingredients: 'Indole 0.02%, Skatole 0.01%, Ciste labdanum 3%, Castoréum synthétique 0.5%, Patchouli 2%, Vanilline 0.3%, CBD Isolate 28%',
    formula: 'Indole:Skatole ratio 2:1 + fixateurs résineux + vanilline',
    protocol: '1. Dissoudre indole et skatole dans éthanol (1:1000)\n2. Ajouter ciste labdanum comme fixateur principal\n3. Incorporer castoréum synthétique (attention: très puissant)\n4. Ajouter patchouli pour profondeur\n5. Finir avec vanilline pour adoucir\n6. Maturation 15 jours à 18-22°C',
    notes: 'Profil animal sophistiqué. Le skatole apporte une animalité contrôlée.',
    texture: 'Résine dense',
    intensity: 9,
    stability: 'high',
    status: 'validated',
    notesTete: 'Cuir, fumé, animal',
    notesCoeur: 'Oud, ciste, castoréum',
    notesFond: 'Patchouli, vanille, ambré'
  },
  {
    name: 'Noir Tabac',
    category: 'resine_cbd',
    description: 'Profil tabac cuiré avec indole dominant. Absolue tabac, foin et coumarine sur fond de styrax et isoquinoline.',
    ingredients: 'Indole 0.02%, Skatole 0.005%, Absolue tabac 2%, Foin absolu 1%, Coumarine 0.5%, Styrax 1.5%, Isoquinoline 0.1%, CBD Isolate 30%',
    formula: 'Indole dominant + absolue tabac + coumarine + styrax',
    protocol: '1. Dissoudre indole et skatole dans éthanol (1:1000)\n2. Ajouter absolue tabac comme note principale\n3. Incorporer foin absolu pour naturalité\n4. Ajouter coumarine pour douceur\n5. Finir avec styrax et isoquinoline\n6. Maturation 10 jours à 18-22°C',
    notes: 'Profil tabac authentique. L\'indole renforce le caractère naturel.',
    texture: 'Résine souple',
    intensity: 8,
    stability: 'high',
    status: 'validated',
    notesTete: 'Tabac frais, foin, herbacé',
    notesCoeur: 'Tabac blond, cuir, coumarine',
    notesFond: 'Styrax, ambré, boisé'
  },
  {
    name: 'White Jasmine Absolute',
    category: 'resine_cbd',
    description: 'Profil floral-blanc élégant. Indole sur fond de benzyl acetate, linalol et eugenol. Évoque le jasmin en pleine floraison.',
    ingredients: 'Indole 0.02%, Skatole traces, Benzyl acetate 1.5%, Linalol 0.8%, Eugenol 0.2%, Methyl anthranilate 0.3%, CBD Isolate 28%',
    formula: 'Indole + benzyl acetate dominant + linalol + eugenol',
    protocol: '1. Dissoudre indole dans éthanol (1:1000)\n2. Ajouter benzyl acetate comme note principale\n3. Incorporer linalol pour fraîcheur florale\n4. Ajouter eugenol (trace) pour épice\n5. Finir avec methyl anthranilate\n6. Maturation 7 jours à 18-22°C',
    notes: 'Jasmin réaliste et élégant. L\'indole apporte la naturalité caractéristique.',
    texture: 'Résine crémeuse',
    intensity: 7,
    stability: 'medium',
    status: 'validated',
    notesTete: 'Jasmin frais, vert, pétillant',
    notesCoeur: 'Jasmin absolu, floral blanc',
    notesFond: 'Musqué, poudré, doux'
  },
  {
    name: 'Gardenia Night',
    category: 'resine_cbd',
    description: 'Profil floral-crémeux nocturne. Indole et skatole sur fond de salicylates, vanilline et ionone. Gardénia sensuel.',
    ingredients: 'Indole 0.02%, Skatole 0.01%, Methyl salicylate 0.5%, Vanilline 0.4%, α-Ionone 0.2%, Benzyl benzoate 1%, CBD Isolate 30%',
    formula: 'Indole:Skatole ratio 2:1 + salicylates + vanilline + ionone',
    protocol: '1. Dissoudre indole et skatole dans éthanol (1:1000)\n2. Ajouter methyl salicylate pour note verte\n3. Incorporer vanilline pour douceur\n4. Ajouter α-ionone (trace - très puissant)\n5. Finir avec benzyl benzoate comme fixateur\n6. Maturation 10 jours à 18-22°C',
    notes: 'Gardénia sensuel et envoûtant. Le skatole apporte une profondeur animale.',
    texture: 'Résine veloutée',
    intensity: 8,
    stability: 'high',
    status: 'testing',
    notesTete: 'Floral blanc, vert, frais',
    notesCoeur: 'Gardénia, crémeux, vanillé',
    notesFond: 'Musqué, animal, persistant'
  },
  {
    name: 'Ash & Honey',
    category: 'resine_cbd',
    description: 'Profil animal-balsamique hybride. Indole et skatole sur fond de miel absolu, benjoin et cuir synthétique.',
    ingredients: 'Indole 0.015%, Skatole 0.01%, Miel absolu 1.5%, Benjoin 2%, Cuir synthétique 0.5%, Bois de cade 0.3%, CBD Isolate 28%',
    formula: 'Indole:Skatole équilibrés + miel + benjoin + cuir',
    protocol: '1. Dissoudre indole et skatole dans éthanol (1:1000)\n2. Ajouter miel absolu comme note principale\n3. Incorporer benjoin pour rondeur balsamique\n4. Ajouter cuir synthétique pour caractère\n5. Finir avec bois de cade pour fumé\n6. Maturation 12 jours à 18-22°C',
    notes: 'Contraste fascinant entre douceur du miel et animalité. Très original.',
    texture: 'Résine dense',
    intensity: 8,
    stability: 'high',
    status: 'validated',
    notesTete: 'Miel, cire, fumé',
    notesCoeur: 'Benjoin, cuir, animal',
    notesFond: 'Cade, ambré, persistant'
  },
  {
    name: 'Neon Flesh',
    category: 'resine_cbd',
    description: 'Profil futuriste-animal expérimental. Indole et skatole sur fond d\'aldéhyde C-12, vétiverol et muscs synthétiques.',
    ingredients: 'Indole 0.015%, Skatole 0.01%, Aldéhyde C-12 0.3%, Vétiverol 0.5%, Muscone 0.2%, Ambrettolide 0.3%, CBD Isolate 28%',
    formula: 'Indole:Skatole équilibrés + aldéhyde métallique + muscs modernes',
    protocol: '1. Dissoudre indole et skatole dans éthanol (1:1000)\n2. Ajouter aldéhyde C-12 pour ouverture métallique\n3. Incorporer vétiverol pour ancrage terreux\n4. Ajouter muscone et ambrettolide\n5. Mélanger délicatement\n6. Maturation 14 jours à 18-22°C',
    notes: 'Profil avant-gardiste. Contraste entre modernité des muscs et animalité primitive.',
    texture: 'Résine souple',
    intensity: 7,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Métallique, aldéhydé, frais',
    notesCoeur: 'Musc, vétiver, animal',
    notesFond: 'Ambré, peau, persistant'
  }
];

// ============================================
// PARTIE 2 : Esters aromatiques du tabac
// ============================================

const estersTabac = [
  {
    name: 'Éthyl butyrate',
    iupacName: 'Ethyl butanoate',
    formula: 'C6H12O2',
    family: 'Esters fruités',
    olfactiveProfile: 'Ananas, pomme, cassis. Note fruitée vive et sucrée caractéristique des fruits tropicaux.',
    emotionalResonance: 'Fraîcheur et vitalité. Évoque les fruits mûrs et l\'été.',
    functionalEffect: 'Ouverture fruitée dans les compositions tabac. Résiste bien à la chaleur de combustion.',
    origin: 'Synthétique ou naturel (ananas, pomme)',
    concentration: '0.1-0.6%',
    radarIntensity: 70,
    radarFreshness: 75,
    radarWarmth: 30,
    radarSweetness: 80,
    radarSpiciness: 10,
    radarEarthiness: 15,
    molecularWeight: 116.16,
    boilingPoint: 121,
    volatility: 8,
    intensity: 7
  },
  {
    name: 'Isoamyl acetate',
    iupacName: '3-methylbutyl acetate',
    formula: 'C7H14O2',
    family: 'Esters fruités',
    olfactiveProfile: 'Banane, poire, fruité mûr. Note caractéristique de la banane mûre.',
    emotionalResonance: 'Gourmandise et nostalgie. Évoque les bonbons et les fruits confits.',
    functionalEffect: 'Note fruit mûr stable à la chaleur. Excellent dans les mélanges tabac fruités.',
    origin: 'Synthétique ou naturel (banane)',
    concentration: '0.1-0.5%',
    radarIntensity: 75,
    radarFreshness: 65,
    radarWarmth: 35,
    radarSweetness: 85,
    radarSpiciness: 5,
    radarEarthiness: 10,
    molecularWeight: 130.18,
    boilingPoint: 142,
    volatility: 7,
    intensity: 7
  },
  {
    name: 'Benzyl acetate',
    iupacName: 'Benzyl ethanoate',
    formula: 'C9H10O2',
    family: 'Esters aromatiques',
    olfactiveProfile: 'Jasmin, ylang-ylang, miel. Note florale luxueuse et sucrée.',
    emotionalResonance: 'Élégance et sensualité. Évoque les fleurs blanches nocturnes.',
    functionalEffect: 'Floral luxueux stable à la combustion. Apporte sophistication aux mélanges tabac.',
    origin: 'Synthétique ou naturel (jasmin)',
    concentration: '0.2-1%',
    radarIntensity: 65,
    radarFreshness: 50,
    radarWarmth: 45,
    radarSweetness: 70,
    radarSpiciness: 15,
    radarEarthiness: 20,
    molecularWeight: 150.17,
    boilingPoint: 213,
    volatility: 5,
    intensity: 6
  },
  {
    name: 'Ethyl lactate',
    iupacName: 'Ethyl 2-hydroxypropanoate',
    formula: 'C5H10O3',
    family: 'Esters lactiques',
    olfactiveProfile: 'Lait, crème, yaourt. Note lactée douce et réconfortante.',
    emotionalResonance: 'Confort et douceur. Évoque les produits laitiers frais.',
    functionalEffect: 'Rondeur lactée stable. Adoucit les compositions tabac.',
    origin: 'Synthétique ou naturel (fermentation)',
    concentration: '0.2-0.8%',
    radarIntensity: 50,
    radarFreshness: 55,
    radarWarmth: 40,
    radarSweetness: 65,
    radarSpiciness: 5,
    radarEarthiness: 25,
    molecularWeight: 118.13,
    boilingPoint: 154,
    volatility: 6,
    intensity: 5
  },
  {
    name: 'Methyl anthranilate',
    iupacName: 'Methyl 2-aminobenzoate',
    formula: 'C8H9NO2',
    family: 'Esters aromatiques',
    olfactiveProfile: 'Raisin, fleur d\'oranger, fruité-floral. Note caractéristique du raisin Concord.',
    emotionalResonance: 'Nostalgie et douceur. Évoque les bonbons au raisin et les fleurs.',
    functionalEffect: 'Complexité florale-fruitée. Effet modéré à la combustion.',
    origin: 'Synthétique ou naturel (néroli)',
    concentration: '0.1-0.5%',
    radarIntensity: 70,
    radarFreshness: 60,
    radarWarmth: 35,
    radarSweetness: 75,
    radarSpiciness: 10,
    radarEarthiness: 15,
    molecularWeight: 151.16,
    boilingPoint: 256,
    volatility: 4,
    intensity: 7
  },
  {
    name: 'Ethyl cinnamate',
    iupacName: 'Ethyl 3-phenylprop-2-enoate',
    formula: 'C11H12O2',
    family: 'Esters balsamiques',
    olfactiveProfile: 'Cannelle, baume, épicé-sucré. Note chaude et balsamique.',
    emotionalResonance: 'Chaleur et réconfort. Évoque les épices orientales.',
    functionalEffect: 'Base chaude stable. Excellent fixateur dans les mélanges tabac épicés.',
    origin: 'Synthétique ou naturel (cannelle)',
    concentration: '0.2-0.8%',
    radarIntensity: 65,
    radarFreshness: 25,
    radarWarmth: 80,
    radarSweetness: 55,
    radarSpiciness: 75,
    radarEarthiness: 30,
    molecularWeight: 176.21,
    boilingPoint: 271,
    volatility: 4,
    intensity: 6
  },
  {
    name: 'Ethyl decanoate',
    iupacName: 'Ethyl caprate',
    formula: 'C12H24O2',
    family: 'Esters gras',
    olfactiveProfile: 'Rhum, fruité-gras, noix de coco. Note alcoolique et tropicale.',
    emotionalResonance: 'Exotisme et chaleur. Évoque les cocktails tropicaux.',
    functionalEffect: 'Note rhum/fruité. Apporte richesse aux compositions tabac.',
    origin: 'Synthétique ou naturel (noix de coco)',
    concentration: '0.1-0.5%',
    radarIntensity: 55,
    radarFreshness: 40,
    radarWarmth: 50,
    radarSweetness: 60,
    radarSpiciness: 15,
    radarEarthiness: 35,
    molecularWeight: 200.32,
    boilingPoint: 243,
    volatility: 4,
    intensity: 5
  },
  {
    name: 'Ethyl phenylacetate',
    iupacName: 'Ethyl 2-phenylacetate',
    formula: 'C10H12O2',
    family: 'Esters aromatiques',
    olfactiveProfile: 'Miel, floral, rose. Note miellée et florale douce.',
    emotionalResonance: 'Douceur et romantisme. Évoque le miel et les fleurs.',
    functionalEffect: 'Note miel-floral. Adoucit les compositions tabac.',
    origin: 'Synthétique ou naturel (miel)',
    concentration: '0.1-0.4%',
    radarIntensity: 60,
    radarFreshness: 45,
    radarWarmth: 50,
    radarSweetness: 75,
    radarSpiciness: 10,
    radarEarthiness: 20,
    molecularWeight: 164.20,
    boilingPoint: 227,
    volatility: 5,
    intensity: 6
  },
  {
    name: 'Methyl salicylate',
    iupacName: 'Methyl 2-hydroxybenzoate',
    formula: 'C8H8O3',
    family: 'Esters aromatiques',
    olfactiveProfile: 'Wintergreen, balsamique, menthol. Note fraîche et médicinale.',
    emotionalResonance: 'Fraîcheur et propreté. Évoque les bonbons à la menthe.',
    functionalEffect: 'Note fraîche-balsamique. Apporte fraîcheur aux mélanges tabac.',
    origin: 'Synthétique ou naturel (gaulthérie)',
    concentration: '0.1-0.3%',
    radarIntensity: 75,
    radarFreshness: 85,
    radarWarmth: 20,
    radarSweetness: 45,
    radarSpiciness: 25,
    radarEarthiness: 15,
    molecularWeight: 152.15,
    boilingPoint: 222,
    volatility: 5,
    intensity: 7
  },
  {
    name: 'Butyl butyrate',
    iupacName: 'Butyl butanoate',
    formula: 'C8H16O2',
    family: 'Esters fruités',
    olfactiveProfile: 'Beurré, fruité, ananas. Note beurrée et fruitée.',
    emotionalResonance: 'Gourmandise et confort. Évoque les pâtisseries.',
    functionalEffect: 'Note beurrée-fruitée. Apporte rondeur aux compositions.',
    origin: 'Synthétique',
    concentration: '0.1-0.5%',
    radarIntensity: 55,
    radarFreshness: 50,
    radarWarmth: 45,
    radarSweetness: 70,
    radarSpiciness: 5,
    radarEarthiness: 20,
    molecularWeight: 144.21,
    boilingPoint: 166,
    volatility: 6,
    intensity: 5
  },
  {
    name: 'Ethyl 3-methylthiopropionate',
    iupacName: 'Ethyl 3-(methylthio)propanoate',
    formula: 'C6H12O2S',
    family: 'Esters soufrés',
    olfactiveProfile: 'Cassis, soufré, fruité-fauve. Note caractéristique du bourgeon de cassis.',
    emotionalResonance: 'Mystère et intensité. Évoque les fruits noirs sauvages.',
    functionalEffect: 'Note cassis très réaliste. Attention: très puissant, doser avec précision.',
    origin: 'Synthétique',
    concentration: '0.01-0.1%',
    radarIntensity: 85,
    radarFreshness: 55,
    radarWarmth: 40,
    radarSweetness: 50,
    radarSpiciness: 30,
    radarEarthiness: 45,
    molecularWeight: 148.22,
    boilingPoint: 185,
    volatility: 6,
    intensity: 9
  },
  {
    name: 'Ethyl furan-2-carboxylate',
    iupacName: 'Ethyl 2-furoate',
    formula: 'C7H8O3',
    family: 'Esters furaniques',
    olfactiveProfile: 'Cuir, caramel, fumé. Note cuirée et caramélisée.',
    emotionalResonance: 'Sophistication et profondeur. Évoque le cuir et le tabac.',
    functionalEffect: 'Note cuir-caramel. Excellent dans les mélanges tabac cuirés.',
    origin: 'Synthétique',
    concentration: '0.1-0.5%',
    radarIntensity: 65,
    radarFreshness: 25,
    radarWarmth: 65,
    radarSweetness: 55,
    radarSpiciness: 35,
    radarEarthiness: 50,
    molecularWeight: 140.14,
    boilingPoint: 196,
    volatility: 5,
    intensity: 6
  },
  {
    name: 'Gamma-decalactone',
    iupacName: '5-hexyldihydrofuran-2(3H)-one',
    formula: 'C10H18O2',
    family: 'Lactones',
    olfactiveProfile: 'Pêche, abricot, crémeux. Note fruitée crémeuse caractéristique.',
    emotionalResonance: 'Douceur et sensualité. Évoque les fruits à noyau mûrs.',
    functionalEffect: 'Note pêche très réaliste. Adoucit les compositions tabac.',
    origin: 'Synthétique ou naturel (pêche)',
    concentration: '0.1-0.5%',
    radarIntensity: 65,
    radarFreshness: 55,
    radarWarmth: 45,
    radarSweetness: 80,
    radarSpiciness: 5,
    radarEarthiness: 20,
    molecularWeight: 170.25,
    boilingPoint: 281,
    volatility: 3,
    intensity: 6
  }
];

// Fonction d'insertion des recettes
async function insertRecipes(recipes, gamme) {
  console.log(`\n📦 Insertion des recettes ${gamme}...`);
  
  for (const recipe of recipes) {
    try {
      const [result] = await connection.execute(
        `INSERT INTO recettes (name, category, description, ingredients, formula, protocol, notes, texture, intensity, stability, status, notes_tete, notes_coeur, notes_fond)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recipe.name,
          recipe.category,
          recipe.description,
          recipe.ingredients,
          recipe.formula,
          recipe.protocol,
          recipe.notes,
          recipe.texture,
          recipe.intensity,
          recipe.stability,
          recipe.status,
          recipe.notesTete,
          recipe.notesCoeur,
          recipe.notesFond
        ]
      );
      console.log(`✅ ${recipe.name} (ID: ${result.insertId})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ ${recipe.name} existe déjà`);
      } else {
        console.error(`❌ Erreur ${recipe.name}:`, error.message);
      }
    }
  }
}

// Fonction d'insertion des molécules
async function insertMolecules(molecules) {
  console.log('\n🧬 Insertion des esters aromatiques du tabac...\n');
  
  for (const mol of molecules) {
    try {
      const [result] = await connection.execute(
        `INSERT INTO molecules (name, chemicalFormula, formula, family, olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, concentration, radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness, molecularWeight, boilingPoint, volatility, intensity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mol.name,
          mol.iupacName,
          mol.formula,
          mol.family,
          mol.olfactiveProfile,
          mol.emotionalResonance,
          mol.functionalEffect,
          mol.origin,
          mol.concentration,
          mol.radarIntensity,
          mol.radarFreshness,
          mol.radarWarmth,
          mol.radarSweetness,
          mol.radarSpiciness,
          mol.radarEarthiness,
          mol.molecularWeight,
          mol.boilingPoint,
          mol.volatility,
          mol.intensity
        ]
      );
      console.log(`✅ ${mol.name} (ID: ${result.insertId}) - ${mol.family}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ ${mol.name} existe déjà`);
      } else {
        console.error(`❌ Erreur ${mol.name}:`, error.message);
      }
    }
  }
}

// Exécution
console.log('🧪 Import Gamme Indole/Skatole + Esters Aromatiques du Tabac');
console.log('=============================================================');

await insertRecipes(indoleSkatoleRecipes, 'Indole/Skatole');
await insertMolecules(estersTabac);

// Vérification
const [recetteCount] = await connection.execute('SELECT COUNT(*) as total FROM recettes');
console.log(`\n📊 Total recettes: ${recetteCount[0].total}`);

const [moleculeCount] = await connection.execute('SELECT COUNT(*) as total FROM molecules');
console.log(`📊 Total molécules: ${moleculeCount[0].total}`);

const [families] = await connection.execute('SELECT family, COUNT(*) as count FROM molecules GROUP BY family ORDER BY count DESC LIMIT 10');
console.log('\n📋 Top 10 familles de molécules:');
families.forEach(f => console.log(`   ${f.family}: ${f.count}`));

await connection.end();
console.log('\n✅ Import terminé');
