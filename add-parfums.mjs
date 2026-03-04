import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Récupérer les IDs des molécules clés ──────────────────────────────────────
const getMoleculeId = async (name) => {
  const [rows] = await conn.execute('SELECT id FROM molecules WHERE LOWER(name) LIKE ? LIMIT 1', [`%${name.toLowerCase()}%`]);
  return rows[0]?.id || null;
};

const getPlantId = async (latinName) => {
  const [rows] = await conn.execute('SELECT id FROM plants WHERE LOWER(latin_name) LIKE ? LIMIT 1', [`%${latinName.toLowerCase()}%`]);
  return rows[0]?.id || null;
};

// Vérifier les parfums déjà présents
const [existing] = await conn.execute('SELECT DISTINCT perfume_name FROM molecule_perfumes');
const existingNames = new Set(existing.map(r => r.perfume_name));
console.log('Parfums existants:', existingNames.size);

// ─── Définition des 20 nouveaux parfums ────────────────────────────────────────
// Chaque parfum : { name, house, perfumer, year, molecules: [{search, role, concentration, description}], plants: [{latin, role, ingredient, description}] }
const newPerfumes = [
  {
    name: "Vent Vert",
    house: "Pierre Balmain",
    perfumer: "Germaine Cellier",
    year: 1947,
    molecules: [
      { search: "linalool", role: "note_tete", concentration: "élevée", description: "Accord vert-herbacé révolutionnaire, premier parfum vert de l'histoire moderne." },
      { search: "benzyl acetate", role: "note_coeur", concentration: "présent", description: "Facette florale blanche sous-jacente." },
      { search: "Coumarin", role: "note_fond", concentration: "présent", description: "Base boisée-poudreuse." }
    ],
    plants: [
      { latin: "Viola odorata", role: "note_coeur", ingredient: "absolue", description: "Accord vert-violet caractéristique." },
      { latin: "Artemisia", role: "note_tete", ingredient: "huile essentielle", description: "Facette herbacée verte dominante." }
    ]
  },
  {
    name: "Femme",
    house: "Rochas",
    perfumer: "Edmond Roudnitska",
    year: 1944,
    molecules: [
      { search: "Coumarin", role: "signature", concentration: "élevée", description: "Accord prune-cuir caractéristique de Roudnitska, pionnier de la parfumerie moderne." },
      { search: "eugenol", role: "note_coeur", concentration: "présent", description: "Facette épicée-carnation." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée chaude." }
    ],
    plants: [
      { latin: "Prunus domestica", role: "accord_principal", ingredient: "absolu", description: "Accord prune-cuir signature." },
      { latin: "Pelargonium graveolens", role: "note_coeur", ingredient: "huile essentielle", description: "Facette rose-géranium." }
    ]
  },
  {
    name: "Bandit",
    house: "Robert Piguet",
    perfumer: "Germaine Cellier",
    year: 1944,
    molecules: [
      { search: "isoeugenol", role: "signature", concentration: "élevée", description: "Accord cuir-vert radical, premier parfum cuir féminin de l'histoire." },
      { search: "Vetiverol", role: "note_fond", concentration: "présent", description: "Base vétiver-tabac." },
      { search: "eugenol", role: "note_coeur", concentration: "présent", description: "Facette épicée-carnation." }
    ],
    plants: [
      { latin: "Vetiveria zizanioides", role: "note_fond", ingredient: "huile essentielle", description: "Base vétiver fumée." },
      { latin: "Dianthus caryophyllus", role: "note_coeur", ingredient: "absolu", description: "Accord œillet-épicé." }
    ]
  },
  {
    name: "Diorissimo",
    house: "Dior",
    perfumer: "Edmond Roudnitska",
    year: 1956,
    molecules: [
      { search: "Hedione", role: "signature", concentration: "~15%", description: "Première utilisation majeure de l'Hedione, créant un accord muguet d'une pureté inégalée." },
      { search: "Hydroxycitronellal", role: "accord_principal", concentration: "élevée", description: "Accord muguet-floral principal." },
      { search: "linalool", role: "note_coeur", concentration: "présent", description: "Facette florale légère." }
    ],
    plants: [
      { latin: "Convallaria majalis", role: "signature", ingredient: "absolu", description: "Muguet — fleur emblématique impossible à distiller, recréée synthétiquement." },
      { latin: "Jasminum grandiflorum", role: "note_coeur", ingredient: "absolue", description: "Soutien floral blanc." }
    ]
  },
  {
    name: "Chamade",
    house: "Guerlain",
    perfumer: "Jean-Paul Guerlain",
    year: 1969,
    molecules: [
      { search: "Ionone β", role: "signature", concentration: "élevée", description: "Accord iris-violet caractéristique, cœur de la Chamade." },
      { search: "Hedione", role: "note_coeur", concentration: "présent", description: "Légèreté florale-jasmineuse." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée Guerlain." }
    ],
    plants: [
      { latin: "Iris pallida", role: "signature", ingredient: "beurre d'iris", description: "Accord iris-violet central." },
      { latin: "Hyacinthus orientalis", role: "note_tete", ingredient: "absolue", description: "Ouverture florale verte-jacinthe." }
    ]
  },
  {
    name: "Habit Rouge",
    house: "Guerlain",
    perfumer: "Jean-Paul Guerlain",
    year: 1965,
    molecules: [
      { search: "Coumarin", role: "signature", concentration: "élevée", description: "Premier parfum oriental masculin moderne, révolutionnaire pour son époque." },
      { search: "eugenol", role: "note_coeur", concentration: "présent", description: "Accord épicé-carnation." },
      { search: "Santalol", role: "note_fond", concentration: "présent", description: "Base santal-boisée." }
    ],
    plants: [
      { latin: "Citrus bergamia", role: "note_tete", ingredient: "huile essentielle", description: "Ouverture bergamote-agrume." },
      { latin: "Santalum album", role: "note_fond", ingredient: "huile essentielle", description: "Base santal Mysore." }
    ]
  },
  {
    name: "Knowing",
    house: "Estée Lauder",
    perfumer: "Firmenich",
    year: 1988,
    molecules: [
      { search: "Ionone β", role: "signature", concentration: "élevée", description: "Accord rose-iris puissant, chypré floral caractéristique des années 80." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." },
      { search: "Coumarin", role: "note_fond", concentration: "présent", description: "Base boisée-poudreuse." }
    ],
    plants: [
      { latin: "Rosa damascena", role: "accord_principal", ingredient: "absolue", description: "Cœur rose damas intense." },
      { latin: "Iris pallida", role: "note_coeur", ingredient: "beurre d'iris", description: "Facette iris-poudreuse." }
    ]
  },
  {
    name: "Trésor",
    house: "Lancôme",
    perfumer: "Sophia Grojsman",
    year: 1990,
    molecules: [
      { search: "Hedione", role: "accord_principal", concentration: "élevée", description: "Accord rose-jasmin lumineux caractéristique de Grojsman." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée-ambrée." },
      { search: "Ambroxan", role: "note_fond", concentration: "présent", description: "Fond ambré-musqué." }
    ],
    plants: [
      { latin: "Rosa damascena", role: "signature", ingredient: "absolue", description: "Rose damas — cœur floral principal." },
      { latin: "Iris pallida", role: "note_coeur", ingredient: "beurre d'iris", description: "Facette iris-poudreuse." }
    ]
  },
  {
    name: "Dune",
    house: "Dior",
    perfumer: "Jean-Louis Sieuzac",
    year: 1991,
    molecules: [
      { search: "Ambroxan", role: "signature", concentration: "élevée", description: "Accord ambre-bois sec évoquant les dunes de sable, pionnier des ambrés secs." },
      { search: "Santalol", role: "note_fond", concentration: "présent", description: "Base santal-boisée." },
      { search: "Hedione", role: "note_coeur", concentration: "présent", description: "Légèreté florale." }
    ],
    plants: [
      { latin: "Helichrysum italicum", role: "note_coeur", ingredient: "huile essentielle", description: "Accord immortelle-miel caractéristique." },
      { latin: "Santalum album", role: "note_fond", ingredient: "huile essentielle", description: "Base santal Mysore." }
    ]
  },
  {
    name: "Lolita Lempicka",
    house: "Lolita Lempicka",
    perfumer: "Annick Ménardo",
    year: 1997,
    molecules: [
      { search: "Coumarin", role: "signature", concentration: "élevée", description: "Accord gourmand-réglisse révolutionnaire, pionnier de la parfumerie gourmande féminine." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée-gourmande." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." }
    ],
    plants: [
      { latin: "Iris pallida", role: "note_coeur", ingredient: "beurre d'iris", description: "Facette iris-violette." },
      { latin: "Helianthus annuus", role: "note_tete", ingredient: "absolue", description: "Accord tournesol-vert." }
    ]
  },
  {
    name: "Flower by Kenzo",
    house: "Kenzo",
    perfumer: "Alberto Morillas",
    year: 2000,
    molecules: [
      { search: "Vanilline", role: "signature", concentration: "élevée", description: "Accord coquelicot-vanille innovant, premier parfum à utiliser le coquelicot comme note centrale." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." },
      { search: "Hedione", role: "note_coeur", concentration: "présent", description: "Légèreté florale." }
    ],
    plants: [
      { latin: "Papaver rhoeas", role: "signature", ingredient: "absolue", description: "Coquelicot — note florale centrale innovante." },
      { latin: "Rosa damascena", role: "note_coeur", ingredient: "absolue", description: "Soutien floral rose." }
    ]
  },
  {
    name: "Black Orchid",
    house: "Tom Ford",
    perfumer: "David Apel",
    year: 2006,
    molecules: [
      { search: "Santalol", role: "signature", concentration: "élevée", description: "Accord orchidée noire-santal luxueux, pionnier de la parfumerie de niche luxe." },
      { search: "Patchouli alcohol", role: "note_fond", concentration: "élevée", description: "Base patchouli-boisée intense." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée-gourmande." }
    ],
    plants: [
      { latin: "Vanilla planifolia", role: "note_fond", ingredient: "absolu", description: "Base vanille-gourmande." },
      { latin: "Pogostemon cablin", role: "note_fond", ingredient: "huile essentielle", description: "Base patchouli intense." }
    ]
  },
  {
    name: "Oud Wood",
    house: "Tom Ford",
    perfumer: "Richard Herpin",
    year: 2007,
    molecules: [
      { search: "Santalol", role: "accord_principal", concentration: "élevée", description: "Accord oud-santal luxueux, popularise l'oud en Occident." },
      { search: "Iso E Super", role: "signature", concentration: "présent", description: "Facette boisée-cèdre caractéristique." },
      { search: "Ambroxan", role: "note_fond", concentration: "présent", description: "Fond ambré-musqué." }
    ],
    plants: [
      { latin: "Aquilaria malaccensis", role: "signature", ingredient: "huile essentielle", description: "Oud — bois précieux central." },
      { latin: "Santalum album", role: "accord_principal", ingredient: "huile essentielle", description: "Santal Mysore en accord avec l'oud." }
    ]
  },
  {
    name: "Flowerbomb",
    house: "Viktor & Rolf",
    perfumer: "Olivier Polge / Carlos Benaim / Domitille Berthier",
    year: 2005,
    molecules: [
      { search: "Hedione", role: "accord_principal", concentration: "élevée", description: "Accord floral explosif — jasmin, rose, freesia en superposition." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée-gourmande." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." }
    ],
    plants: [
      { latin: "Jasminum grandiflorum", role: "signature", ingredient: "absolue", description: "Jasmin — fleur centrale de l'accord floral." },
      { latin: "Rosa damascena", role: "accord_principal", ingredient: "absolue", description: "Rose damas en accord avec le jasmin." }
    ]
  },
  {
    name: "La Vie est Belle",
    house: "Lancôme",
    perfumer: "Olivier Polge / Dominique Ropion / Anne Flipo",
    year: 2012,
    molecules: [
      { search: "Ethyl vanilline", role: "signature", concentration: "élevée", description: "Accord iris-pralinol gourmand, parfum le plus vendu au monde en 2013." },
      { search: "Vanilline", role: "note_fond", concentration: "élevée", description: "Base vanillée-gourmande intense." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." }
    ],
    plants: [
      { latin: "Iris pallida", role: "signature", ingredient: "beurre d'iris", description: "Iris — cœur floral-poudré central." },
      { latin: "Jasminum grandiflorum", role: "note_coeur", ingredient: "absolue", description: "Jasmin en accord floral." }
    ]
  },
  {
    name: "Oud Ispahan",
    house: "Dior",
    perfumer: "François Demachy",
    year: 2012,
    molecules: [
      { search: "Santalol", role: "accord_principal", concentration: "élevée", description: "Accord oud-rose de Damas luxueux, collection La Collection Privée." },
      { search: "Rose oxide", role: "note_coeur", concentration: "présent", description: "Facette rose-géranium caractéristique." },
      { search: "Ambroxan", role: "note_fond", concentration: "présent", description: "Fond ambré-musqué." }
    ],
    plants: [
      { latin: "Rosa damascena", role: "signature", ingredient: "absolue", description: "Rose de Damas — accord central avec l'oud." },
      { latin: "Aquilaria malaccensis", role: "accord_principal", ingredient: "huile essentielle", description: "Oud — bois précieux luxueux." }
    ]
  },
  {
    name: "Baccarat Rouge 540",
    house: "Maison Francis Kurkdjian",
    perfumer: "Francis Kurkdjian",
    year: 2015,
    molecules: [
      { search: "Ambroxan", role: "signature", concentration: "élevée", description: "Accord ambré-boisé-floral révolutionnaire, parfum le plus influent des années 2010-2020." },
      { search: "Ethyl vanilline", role: "accord_principal", concentration: "présent", description: "Facette vanillée-gourmande." },
      { search: "Iso E Super", role: "note_fond", concentration: "présent", description: "Boisé-cèdre de fond." }
    ],
    plants: [
      { latin: "Jasminum grandiflorum", role: "note_coeur", ingredient: "absolue", description: "Jasmin — facette florale centrale." },
      { latin: "Cedrus atlantica", role: "note_fond", ingredient: "huile essentielle", description: "Cèdre de l'Atlas en fond boisé." }
    ]
  },
  {
    name: "Aventus",
    house: "Creed",
    perfumer: "Olivier Creed / Erwin Creed",
    year: 2010,
    molecules: [
      { search: "Ambroxan", role: "note_fond", concentration: "présent", description: "Fond ambré-musqué caractéristique des Creed." },
      { search: "Iso E Super", role: "accord_principal", concentration: "présent", description: "Accord boisé-fumé caractéristique." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." }
    ],
    plants: [
      { latin: "Ananas comosus", role: "note_tete", ingredient: "absolue", description: "Ananas — ouverture fruitée caractéristique." },
      { latin: "Betula pendula", role: "accord_principal", ingredient: "huile essentielle", description: "Bouleau fumé — accord central." }
    ]
  },
  {
    name: "Chanel N°19",
    house: "Chanel",
    perfumer: "Henri Robert",
    year: 1970,
    molecules: [
      { search: "Ionone β", role: "signature", concentration: "élevée", description: "Accord iris-vert radical, créé pour l'anniversaire de Coco Chanel." },
      { search: "Galaxolide", role: "note_fond", concentration: "présent", description: "Musc blanc de fond." },
      { search: "Vetiverol", role: "note_fond", concentration: "présent", description: "Base vétiver-boisée." }
    ],
    plants: [
      { latin: "Iris pallida", role: "signature", ingredient: "beurre d'iris", description: "Iris — accord central vert-poudré." },
      { latin: "Galbanum officinale", role: "note_tete", ingredient: "résine", description: "Ouverture verte-résineuse caractéristique." }
    ]
  },
  {
    name: "Poison",
    house: "Dior",
    perfumer: "Edouard Fléchier",
    year: 1985,
    molecules: [
      { search: "Coumarin", role: "signature", concentration: "élevée", description: "Accord floral-oriental envoûtant, parfum le plus controversé des années 80." },
      { search: "Vanilline", role: "note_fond", concentration: "présent", description: "Base vanillée-orientale." },
      { search: "eugenol", role: "note_coeur", concentration: "présent", description: "Facette épicée-carnation." }
    ],
    plants: [
      { latin: "Prunus armeniaca", role: "note_tete", ingredient: "absolue", description: "Accord abricot-fruité caractéristique." },
      { latin: "Coriandrum sativum", role: "note_tete", ingredient: "huile essentielle", description: "Facette épicée-verte." }
    ]
  }
];

// ─── Insérer les parfums ──────────────────────────────────────────────────────
let addedMoleculeLinks = 0;
let addedPlantLinks = 0;
let skipped = 0;

for (const parfum of newPerfumes) {
  // Vérifier si déjà présent
  if (existingNames.has(parfum.name)) {
    console.log(`⏭  Déjà présent: ${parfum.name}`);
    skipped++;
    continue;
  }

  console.log(`\n➕ Ajout: ${parfum.name} (${parfum.house}, ${parfum.year})`);

  // Ajouter les liaisons molécules
  for (const mol of parfum.molecules) {
    const molId = await getMoleculeId(mol.search);
    if (molId) {
      await conn.execute(
        `INSERT IGNORE INTO molecule_perfumes (molecule_id, perfume_name, perfume_house, perfumer, year, role_in_perfume, concentration, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [molId, parfum.name, parfum.house, parfum.perfumer, parfum.year, mol.role, mol.concentration, mol.description]
      );
      addedMoleculeLinks++;
      console.log(`  ✓ Molécule: ${mol.search} (id=${molId})`);
    } else {
      console.log(`  ✗ Molécule non trouvée: ${mol.search}`);
    }
  }

  // Ajouter les liaisons plantes
  for (const plant of parfum.plants) {
    const plantId = await getPlantId(plant.latin);
    if (plantId) {
      await conn.execute(
        `INSERT IGNORE INTO plant_perfumes (plant_id, perfume_name, perfume_house, perfumer, year, role_in_perfume, ingredient_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [plantId, parfum.name, parfum.house, parfum.perfumer, parfum.year, plant.role, plant.ingredient, plant.description]
      );
      addedPlantLinks++;
      console.log(`  ✓ Plante: ${plant.latin} (id=${plantId})`);
    } else {
      console.log(`  ✗ Plante non trouvée: ${plant.latin}`);
    }
  }
}

console.log(`\n─── Résumé ───`);
console.log(`Parfums ajoutés: ${newPerfumes.length - skipped}`);
console.log(`Parfums ignorés (déjà présents): ${skipped}`);
console.log(`Liaisons molécules ajoutées: ${addedMoleculeLinks}`);
console.log(`Liaisons plantes ajoutées: ${addedPlantLinks}`);

// Vérification finale
const [totalMp] = await conn.execute('SELECT COUNT(DISTINCT perfume_name) as n FROM molecule_perfumes');
const [totalPp] = await conn.execute('SELECT COUNT(DISTINCT perfume_name) as n FROM plant_perfumes');
console.log(`\nTotal parfums dans molecule_perfumes: ${totalMp[0].n}`);
console.log(`Total parfums dans plant_perfumes: ${totalPp[0].n}`);

await conn.end();
