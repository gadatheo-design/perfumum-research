/**
 * Script pour ajouter 25 nouvelles molécules dans les familles sous-représentées
 * Utilise l'API tRPC pour insérer les données
 */

const API_BASE = 'http://localhost:3000/api/trpc';

const newMolecules = [
  // Aldéhydes Marins (1 → 4)
  {
    name: "Calone 1951",
    family: "Aldéhydes Marins",
    chemicalFormula: "C11H16O2",
    olfactiveProfile: "marine, aquatique, ozone, melon d'eau",
    emotionalResonance: "fraîcheur océanique, brise marine, évocation de l'eau",
    functionalEffect: "note marine, fraîcheur aqueuse",
    sourceOrigin: "Synthétique (Pfizer, 1966)",
    radarIntensity: 75,
    radarFreshness: 90,
    radarWarmth: 10,
    radarSweetness: 30,
    radarSpiciness: 5,
    radarEarthiness: 5,
    molecularWeight: 180,
    boilingPoint: 285,
    volatility: 45,
    intensity: 75,
    complexity: 65,
    references: [
      {
        type: "pubchem",
        title: "Calone (7-Methyl-2H-1,5-benzodioxepin-3(4H)-one)",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/Calone"
      }
    ]
  },
  {
    name: "Maritima",
    family: "Aldéhydes Marins",
    chemicalFormula: "C12H18O2",
    olfactiveProfile: "marine, algue, iodé, salin",
    emotionalResonance: "profondeur océanique, marée basse, air salin",
    functionalEffect: "note marine authentique, salinité",
    sourceOrigin: "Synthétique",
    radarIntensity: 70,
    radarFreshness: 85,
    radarWarmth: 15,
    radarSweetness: 20,
    radarSpiciness: 10,
    radarEarthiness: 25,
    molecularWeight: 194,
    boilingPoint: 295,
    volatility: 40,
    intensity: 70,
    complexity: 60
  },
  {
    name: "Triplal",
    family: "Aldéhydes Marins",
    chemicalFormula: "C14H20O",
    olfactiveProfile: "marine, métallique, vert aquatique",
    emotionalResonance: "fraîcheur métallique, eau de pluie sur métal",
    functionalEffect: "note marine verte, fraîcheur métallique",
    sourceOrigin: "Synthétique (IFF)",
    radarIntensity: 80,
    radarFreshness: 88,
    radarWarmth: 12,
    radarSweetness: 25,
    radarSpiciness: 8,
    radarEarthiness: 15,
    molecularWeight: 204,
    boilingPoint: 290,
    volatility: 42,
    intensity: 80,
    complexity: 70
  },

  // Minéraux (1 → 4)
  {
    name: "Silicate Note",
    family: "Minéraux",
    olfactiveProfile: "minéral pur, pierre froide, silice",
    emotionalResonance: "pureté minérale, froideur cristalline",
    functionalEffect: "note minérale pure, fraîcheur pierreuse",
    sourceOrigin: "Accord synthétique",
    radarIntensity: 60,
    radarFreshness: 75,
    radarWarmth: 20,
    radarSweetness: 10,
    radarSpiciness: 5,
    radarEarthiness: 85,
    volatility: 50,
    intensity: 60,
    complexity: 55
  },
  {
    name: "Calcaire Olfactif",
    family: "Minéraux",
    olfactiveProfile: "craie, pierre calcaire, sec, poudreux",
    emotionalResonance: "sécheresse minérale, murs anciens, carrière",
    functionalEffect: "note calcaire, sécheresse poudreuse",
    sourceOrigin: "Accord synthétique",
    radarIntensity: 55,
    radarFreshness: 60,
    radarWarmth: 30,
    radarSweetness: 15,
    radarSpiciness: 5,
    radarEarthiness: 90,
    volatility: 45,
    intensity: 55,
    complexity: 50
  },
  {
    name: "Schiste Olfactif",
    family: "Minéraux",
    olfactiveProfile: "pierre noire, ardoise, fumé minéral",
    emotionalResonance: "profondeur tellurique, roche stratifiée",
    functionalEffect: "note de schiste, fumée minérale",
    sourceOrigin: "Accord synthétique",
    radarIntensity: 65,
    radarFreshness: 50,
    radarWarmth: 40,
    radarSweetness: 10,
    radarSpiciness: 15,
    radarEarthiness: 95,
    volatility: 40,
    intensity: 65,
    complexity: 60
  },

  // Accords métalliques (1 → 4)
  {
    name: "Fer Olfactif",
    family: "Accords métalliques",
    olfactiveProfile: "métallique, sang, fer rouillé, minéral",
    emotionalResonance: "métal oxydé, sang séché, terre ferrugineuse",
    functionalEffect: "note métallique authentique, ferrique",
    sourceOrigin: "Accord synthétique (1-octen-3-one + géosmine)",
    radarIntensity: 85,
    radarFreshness: 40,
    radarWarmth: 35,
    radarSweetness: 5,
    radarSpiciness: 20,
    radarEarthiness: 90,
    volatility: 55,
    intensity: 85,
    complexity: 70
  },
  {
    name: "Cuivre Olfactif",
    family: "Accords métalliques",
    olfactiveProfile: "cuivre, métallique doux, légèrement sucré",
    emotionalResonance: "métal chaud, pièces de monnaie, ustensiles anciens",
    functionalEffect: "note cuivrée, métallique douce",
    sourceOrigin: "Accord synthétique",
    radarIntensity: 70,
    radarFreshness: 45,
    radarWarmth: 50,
    radarSweetness: 20,
    radarSpiciness: 15,
    radarEarthiness: 75,
    volatility: 50,
    intensity: 70,
    complexity: 65
  },
  {
    name: "Bronze Note",
    family: "Accords métalliques",
    chemicalFormula: null,
    olfactiveProfile: "métallique noble, légèrement résineux, patiné",
    emotionalResonance: "métal ancien, cloches, statues patinées",
    functionalEffect: "note de bronze, métallique noble",
    sourceOrigin: "Accord synthétique",
    radarIntensity: 65,
    radarFreshness: 50,
    radarWarmth: 55,
    radarSweetness: 25,
    radarSpiciness: 10,
    radarEarthiness: 80,
    volatility: 45,
    intensity: 65,
    complexity: 68
  },

  // Phénols fumés (1 → 4)
  {
    name: "Guaiacol Fumé",
    family: "Phénols fumés",
    chemicalFormula: "C7H8O2",
    olfactiveProfile: "fumé intense, bacon, bois brûlé, phénolique",
    emotionalResonance: "fumée de bois, bacon grillé, feu de camp",
    functionalEffect: "note fumée authentique, phénolique",
    sourceOrigin: "Distillation de bois (hêtre, chêne)",
    radarIntensity: 90,
    radarFreshness: 10,
    radarWarmth: 85,
    radarSweetness: 15,
    radarSpiciness: 60,
    radarEarthiness: 70,
    molecularWeight: 124,
    boilingPoint: 205,
    volatility: 65,
    intensity: 90,
    complexity: 75,
    references: [
      {
        type: "pubchem",
        title: "Guaiacol",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/Guaiacol"
      }
    ]
  },
  {
    name: "Crésol Fumé",
    family: "Phénols fumés",
    chemicalFormula: "C7H8O",
    olfactiveProfile: "phénolique, goudron, fumée médicinale",
    emotionalResonance: "désinfectant ancien, fumée médicinale, goudron",
    functionalEffect: "note phénolique forte, fumée médicinale",
    sourceOrigin: "Distillation de goudron de houille",
    radarIntensity: 95,
    radarFreshness: 5,
    radarWarmth: 80,
    radarSweetness: 10,
    radarSpiciness: 70,
    radarEarthiness: 75,
    molecularWeight: 108,
    boilingPoint: 202,
    volatility: 68,
    intensity: 95,
    complexity: 70
  },
  {
    name: "Phénol Pyrogéné Doux",
    family: "Phénols fumés",
    chemicalFormula: "C8H10O2",
    olfactiveProfile: "fumé doux, vanillé, bois brûlé sucré",
    emotionalResonance: "fumée douce, vanille fumée, bois caramélisé",
    functionalEffect: "note fumée douce, vanillée",
    sourceOrigin: "Pyrolyse contrôlée de bois",
    radarIntensity: 75,
    radarFreshness: 15,
    radarWarmth: 80,
    radarSweetness: 50,
    radarSpiciness: 40,
    radarEarthiness: 60,
    molecularWeight: 138,
    boilingPoint: 210,
    volatility: 62,
    intensity: 75,
    complexity: 72
  },

  // Terpènes floraux (1 → 4)
  {
    name: "Linalol Synthétique",
    family: "Terpènes floraux",
    chemicalFormula: "C10H18O",
    olfactiveProfile: "floral doux, lavande, coriandre, légèrement citronné",
    emotionalResonance: "douceur florale, relaxation, fraîcheur délicate",
    functionalEffect: "note florale douce, relaxante",
    sourceOrigin: "Synthétique (ou lavande, bois de rose)",
    radarIntensity: 70,
    radarFreshness: 75,
    radarWarmth: 40,
    radarSweetness: 65,
    radarSpiciness: 20,
    radarEarthiness: 15,
    molecularWeight: 154,
    boilingPoint: 198,
    volatility: 70,
    intensity: 70,
    complexity: 60,
    references: [
      {
        type: "pubchem",
        title: "Linalool",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/Linalool"
      }
    ]
  },
  {
    name: "Géraniol Pur",
    family: "Terpènes floraux",
    chemicalFormula: "C10H18O",
    olfactiveProfile: "rose, géranium, floral puissant, légèrement citronné",
    emotionalResonance: "rose fraîche, jardin fleuri, douceur florale",
    functionalEffect: "note de rose, florale puissante",
    sourceOrigin: "Géranium, palmarosa, citronnelle",
    radarIntensity: 85,
    radarFreshness: 70,
    radarWarmth: 45,
    radarSweetness: 75,
    radarSpiciness: 15,
    radarEarthiness: 10,
    molecularWeight: 154,
    boilingPoint: 230,
    volatility: 60,
    intensity: 85,
    complexity: 65,
    references: [
      {
        type: "pubchem",
        title: "Geraniol",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/Geraniol"
      }
    ]
  },
  {
    name: "Nérol",
    family: "Terpènes floraux",
    chemicalFormula: "C10H18O",
    olfactiveProfile: "rose douce, floral délicat, légèrement vert",
    emotionalResonance: "rose tendre, pétales frais, douceur verte",
    functionalEffect: "note de rose douce, florale délicate",
    sourceOrigin: "Néroli, rose, citronnelle",
    radarIntensity: 75,
    radarFreshness: 75,
    radarWarmth: 40,
    radarSweetness: 70,
    radarSpiciness: 10,
    radarEarthiness: 12,
    molecularWeight: 154,
    boilingPoint: 225,
    volatility: 62,
    intensity: 75,
    complexity: 63
  },

  // Cétones terpéniques (1 → 4)
  {
    name: "Carvone L",
    family: "Cétones terpéniques",
    chemicalFormula: "C10H14O",
    olfactiveProfile: "menthe verte, carvi, herbacé frais",
    emotionalResonance: "fraîcheur mentholée douce, herbes aromatiques",
    functionalEffect: "note mentholée douce, herbacée",
    sourceOrigin: "Menthe verte, carvi",
    radarIntensity: 80,
    radarFreshness: 85,
    radarWarmth: 25,
    radarSweetness: 40,
    radarSpiciness: 35,
    radarEarthiness: 20,
    molecularWeight: 150,
    boilingPoint: 231,
    volatility: 60,
    intensity: 80,
    complexity: 68,
    references: [
      {
        type: "pubchem",
        title: "L-Carvone",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/L-Carvone"
      }
    ]
  },
  {
    name: "Menthone",
    family: "Cétones terpéniques",
    chemicalFormula: "C10H18O",
    olfactiveProfile: "menthe, frais, légèrement camphré",
    emotionalResonance: "fraîcheur mentholée, clarté, vivacité",
    functionalEffect: "note mentholée, rafraîchissante",
    sourceOrigin: "Menthe poivrée, menthe des champs",
    radarIntensity: 85,
    radarFreshness: 90,
    radarWarmth: 20,
    radarSweetness: 30,
    radarSpiciness: 40,
    radarEarthiness: 15,
    molecularWeight: 154,
    boilingPoint: 209,
    volatility: 65,
    intensity: 85,
    complexity: 65
  },
  {
    name: "Pinocamphone",
    family: "Cétones terpéniques",
    chemicalFormula: "C10H16O",
    olfactiveProfile: "camphré, herbacé, légèrement amer",
    emotionalResonance: "fraîcheur camphrée, herbes sauvages",
    functionalEffect: "note camphrée, herbacée amère",
    sourceOrigin: "Hysope, sauge",
    radarIntensity: 75,
    radarFreshness: 80,
    radarWarmth: 30,
    radarSweetness: 20,
    radarSpiciness: 45,
    radarEarthiness: 35,
    molecularWeight: 152,
    boilingPoint: 215,
    volatility: 63,
    intensity: 75,
    complexity: 70
  },

  // Esters terpéniques (2 → 5)
  {
    name: "Acétate de Linalyle",
    family: "Esters terpéniques",
    chemicalFormula: "C12H20O2",
    olfactiveProfile: "floral fruité, bergamote, lavande douce",
    emotionalResonance: "douceur fruitée florale, relaxation, élégance",
    functionalEffect: "note florale fruitée, apaisante",
    sourceOrigin: "Lavande, bergamote, sauge sclarée",
    radarIntensity: 70,
    radarFreshness: 80,
    radarWarmth: 35,
    radarSweetness: 70,
    radarSpiciness: 15,
    radarEarthiness: 10,
    molecularWeight: 196,
    boilingPoint: 220,
    volatility: 65,
    intensity: 70,
    complexity: 62,
    references: [
      {
        type: "pubchem",
        title: "Linalyl acetate",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/Linalyl-acetate"
      }
    ]
  },
  {
    name: "Acétate de Géranyle",
    family: "Esters terpéniques",
    chemicalFormula: "C12H20O2",
    olfactiveProfile: "floral fruité, rose verte, pomme",
    emotionalResonance: "fraîcheur florale fruitée, jardin après la pluie",
    functionalEffect: "note de rose fruitée, fraîche",
    sourceOrigin: "Géranium, palmarosa, citronnelle",
    radarIntensity: 75,
    radarFreshness: 85,
    radarWarmth: 30,
    radarSweetness: 75,
    radarSpiciness: 10,
    radarEarthiness: 8,
    molecularWeight: 196,
    boilingPoint: 242,
    volatility: 58,
    intensity: 75,
    complexity: 65
  },
  {
    name: "Acétate de Bornyle",
    family: "Esters terpéniques",
    chemicalFormula: "C12H20O2",
    olfactiveProfile: "conifère, pin, balsamique frais",
    emotionalResonance: "forêt de pins, air pur, fraîcheur résineuse",
    functionalEffect: "note de conifère, balsamique fraîche",
    sourceOrigin: "Pin, sapin, épicéa",
    radarIntensity: 70,
    radarFreshness: 75,
    radarWarmth: 45,
    radarSweetness: 50,
    radarSpiciness: 20,
    radarEarthiness: 40,
    molecularWeight: 196,
    boilingPoint: 227,
    volatility: 60,
    intensity: 70,
    complexity: 68
  },

  // Ionones (2 → 4)
  {
    name: "Alpha-Ionone",
    family: "Ionone",
    chemicalFormula: "C13H20O",
    olfactiveProfile: "violette, floral boisé, légèrement fruité",
    emotionalResonance: "douceur florale poudrée, nostalgie, élégance",
    functionalEffect: "note de violette, florale poudrée",
    sourceOrigin: "Synthétique (dégradation de caroténoïdes)",
    radarIntensity: 75,
    radarFreshness: 60,
    radarWarmth: 50,
    radarSweetness: 70,
    radarSpiciness: 10,
    radarEarthiness: 25,
    molecularWeight: 192,
    boilingPoint: 243,
    volatility: 55,
    intensity: 75,
    complexity: 72,
    references: [
      {
        type: "pubchem",
        title: "alpha-Ionone",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/alpha-Ionone"
      }
    ]
  },
  {
    name: "Méthyl Ionone Gamma",
    family: "Ionone",
    chemicalFormula: "C14H22O",
    olfactiveProfile: "iris, violette poudrée, boisé doux",
    emotionalResonance: "poudre d'iris, élégance raffinée, douceur talquée",
    functionalEffect: "note d'iris, poudrée élégante",
    sourceOrigin: "Synthétique",
    radarIntensity: 80,
    radarFreshness: 55,
    radarWarmth: 55,
    radarSweetness: 75,
    radarSpiciness: 8,
    radarEarthiness: 30,
    molecularWeight: 206,
    boilingPoint: 258,
    volatility: 50,
    intensity: 80,
    complexity: 75
  }
];

async function insertMolecule(molecule) {
  try {
    const response = await fetch(`${API_BASE}/molecules.create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(molecule),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de l'insertion de ${molecule.name}:`, error.message);
    return null;
  }
}

async function seedMolecules() {
  console.log('='.repeat(80));
  console.log('INSERTION DE 25 NOUVELLES MOLÉCULES');
  console.log('='.repeat(80));
  console.log(`\nTotal à insérer: ${newMolecules.length} molécules\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < newMolecules.length; i++) {
    const molecule = newMolecules[i];
    console.log(`[${i + 1}/${newMolecules.length}] Insertion: ${molecule.name} [${molecule.family}]...`);
    
    const result = await insertMolecule(molecule);
    
    if (result) {
      successCount++;
      console.log(`  ✅ Succès`);
    } else {
      errorCount++;
      console.log(`  ❌ Échec`);
    }
    
    // Petit délai pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(80));
  console.log('RÉSUMÉ');
  console.log('='.repeat(80));
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Échecs: ${errorCount}`);
  console.log(`📊 Total: ${newMolecules.length}`);
  console.log('='.repeat(80));
}

// Execute
seedMolecules();
