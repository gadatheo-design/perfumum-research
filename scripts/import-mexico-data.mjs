/**
 * Script d'import des données de culture olfactive du Mexique
 * Source: notes_culture_olfactive_mexico.pdf
 */

import mysql from 'mysql2/promise';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

// Données des plantes mésoaméricaines
const MEXICAN_PLANTS = [
  {
    name: "Yauhtli",
    scientific_name: "Tagetes lucida",
    family: "Asteraceae",
    common_names: "Pericón, Mexican Tarragon, Sweet Marigold",
    description: "Plante sacrée mésoaméricaine utilisée pour les encens et les rituels. Connue comme la 'plante des nuages' pour ses propriétés visionnaires. Arôme anisé et onirique.",
    origin_region: "Mexique central",
    traditional_use: "Encens rituel, vision, inspiration créative",
    olfactory_profile: "Anisé, herbacé, légèrement sucré avec des notes de réglisse"
  },
  {
    name: "Hoja Santa",
    scientific_name: "Piper auritum",
    family: "Piperaceae",
    common_names: "Hierba Santa, Root Beer Plant, Sacred Pepper",
    description: "Grande feuille aromatique utilisée en cuisine et en médecine traditionnelle mésoaméricaine. Arôme unique combinant sassafras, anis et poivre noir.",
    origin_region: "Mésoamérique",
    traditional_use: "Aromate culinaire, encens, médecine traditionnelle",
    olfactory_profile: "Sassafras, anis, poivre noir, notes de root beer"
  },
  {
    name: "Copal",
    scientific_name: "Bursera microphylla",
    family: "Burseraceae",
    common_names: "Copal Oro, Copal Blanco, Copal Negro",
    description: "Résine sacrée par excellence des civilisations mésoaméricaines. Utilisée depuis plus de 3000 ans dans les rituels aztèques et mayas. Note résineuse dorée qui 'illumine le chemin dans l'obscurité'.",
    origin_region: "Mexique",
    traditional_use: "Encens sacré, purification, offrandes aux dieux",
    olfactory_profile: "Résineux, citronné, légèrement balsamique, propre et lumineux"
  },
  {
    name: "Cacaloxochitl",
    scientific_name: "Plumeria rubra",
    family: "Apocynaceae",
    common_names: "Flor de Mayo, Frangipani, Plumeria",
    description: "Fleur précieuse des jardins aztèques, associée à la noblesse et au soulagement de la fatigue. Parfum subtil, doux et exotique.",
    origin_region: "Mésoamérique",
    traditional_use: "Parfum, ornement, médecine traditionnelle",
    olfactory_profile: "Floral doux, exotique, crémeux avec des notes de jasmin et de gardénia"
  },
  {
    name: "Tabac sacré",
    scientific_name: "Nicotiana rustica",
    family: "Solanaceae",
    common_names: "Picietl, Mapacho, Aztec Tobacco",
    description: "Tabac originel des Amériques, beaucoup plus puissant que le tabac moderne. Base du piciete traditionnel, utilisé pour la contemplation et les rituels.",
    origin_region: "Mésoamérique",
    traditional_use: "Rituel, méditation, piciete (tabac à mâcher)",
    olfactory_profile: "Terreux, puissant, notes de terre humide et de feuilles séchées"
  },
  {
    name: "Tepezcohuite",
    scientific_name: "Mimosa tenuiflora",
    family: "Fabaceae",
    common_names: "Árbol de la Piel, Jurema, Tepescohuite",
    description: "L'arbre à peau, célèbre pour ses propriétés cicatrisantes. Écorce à l'arôme amer et astringent évoquant la terre humide et le bois ancien.",
    origin_region: "Mexique",
    traditional_use: "Médecine traditionnelle, encens, soins de la peau",
    olfactory_profile: "Amer, astringent, terre humide, bois ancien, notes médicinales"
  },
  {
    name: "Valériane mexicaine",
    scientific_name: "Valeriana edulis",
    family: "Caprifoliaceae",
    common_names: "Valeriana mexicana, Hierba del Gato",
    description: "Racine aux propriétés calmantes avec une note musquée et animale caractéristique. Évoque le sous-bois et les racines profondes.",
    origin_region: "Mexique",
    traditional_use: "Sédatif, calmant, médecine traditionnelle",
    olfactory_profile: "Musqué, animal, sous-bois, terreux avec des notes de cuir"
  },
  {
    name: "Gobernadora",
    scientific_name: "Larrea tridentata",
    family: "Zygophyllaceae",
    common_names: "Creosote Bush, Chaparral, Hediondilla",
    description: "Plante emblématique du désert de Sonora. Son parfum unique est libéré par la pluie, créant l'odeur caractéristique du désert après l'orage.",
    origin_region: "Désert de Sonora",
    traditional_use: "Médecine traditionnelle, purification",
    olfactory_profile: "Pluie sur le désert, résineux, goudronneux, médicinal, unique"
  },
  {
    name: "Pin Pinyon",
    scientific_name: "Pinus edulis",
    family: "Pinaceae",
    common_names: "Piñón, Colorado Pinyon, Two-needle Pinyon",
    description: "Pin du nord du Mexique produisant des pignons comestibles. Résine balsamique au profil sec et résineux.",
    origin_region: "Nord du Mexique",
    traditional_use: "Alimentation (pignons), résine pour encens",
    olfactory_profile: "Balsamique, conifère, sec, résineux, notes de térébenthine"
  },
  {
    name: "Sauge Blanche",
    scientific_name: "Salvia apiana",
    family: "Lamiaceae",
    common_names: "White Sage, Sacred Sage, Bee Sage",
    description: "Sauge iconique des rituels de purification du nord du Mexique et du sud-ouest américain. Note camphrée et purificatrice.",
    origin_region: "Nord du Mexique, Sud-Ouest USA",
    traditional_use: "Purification, rituels, smudging",
    olfactory_profile: "Camphré, herbacé, purificateur, légèrement mentholé"
  },
  {
    name: "Origan Mexicain",
    scientific_name: "Lippia graveolens",
    family: "Verbenaceae",
    common_names: "Mexican Oregano, Hierba Dulce",
    description: "Distinct de l'origan méditerranéen, avec un arôme plus puissant et poivré. Touche sauvage et piquante caractéristique.",
    origin_region: "Mexique",
    traditional_use: "Aromate culinaire, médecine traditionnelle",
    olfactory_profile: "Puissant, poivré, herbacé, sauvage, piquant"
  },
  {
    name: "Jasmin nocturne",
    scientific_name: "Cestrum nocturnum",
    family: "Solanaceae",
    common_names: "Night-blooming Jasmine, Dama de Noche, Queen of the Night",
    description: "Fleur qui libère son parfum enivrant uniquement la nuit. Note narcotique et enivrante associée aux mystères nocturnes.",
    origin_region: "Mésoamérique",
    traditional_use: "Parfum, ornement, médecine traditionnelle",
    olfactory_profile: "Floral narcotique, enivrant, nocturne, intense, légèrement toxique"
  },
  {
    name: "Cempasúchil",
    scientific_name: "Tagetes erecta",
    family: "Asteraceae",
    common_names: "Mexican Marigold, Flor de Muerto, Aztec Marigold",
    description: "La fleur des morts, emblème du Día de los Muertos. Son odeur piquante et amère est considérée comme guidant les âmes des défunts.",
    origin_region: "Mexique",
    traditional_use: "Día de los Muertos, offrandes, teinture",
    olfactory_profile: "Vert, floral piquant, presque amer, herbacé, l'odeur de la mémoire"
  },
  {
    name: "Ahuehuete",
    scientific_name: "Taxodium mucronatum",
    family: "Cupressaceae",
    common_names: "Montezuma Cypress, Sabino, Mexican Bald Cypress",
    description: "Le cyprès de Moctezuma, arbre sacré des Aztèques. Certains spécimens ont plus de 2000 ans. Évoque les canaux de Xochimilco après la pluie.",
    origin_region: "Vallée de Mexico",
    traditional_use: "Arbre sacré, bois, médecine traditionnelle",
    olfactory_profile: "Vert frais, boisé, aquatique, feuillage, notes de cyprès"
  },
  {
    name: "Nardo mexicain",
    scientific_name: "Polianthes tuberosa",
    family: "Asparagaceae",
    common_names: "Tuberose, Nardo, Omixochitl",
    description: "Originaire du Mexique, la tubéreuse était cultivée par les Aztèques. Parfum charnel et narcotique, presque animal à forte concentration.",
    origin_region: "Mexique",
    traditional_use: "Parfum, ornement, rituels",
    olfactory_profile: "Floral blanc, narcotique, charnel, crémeux, presque animal"
  },
  {
    name: "Cacao",
    scientific_name: "Theobroma cacao",
    family: "Malvaceae",
    common_names: "Cocoa, Chocolate Tree, Kakaw",
    description: "L'arbre des dieux (Theobroma). Le xocolatl aztèque était une boisson amère et épicée, bien différente du chocolat moderne.",
    origin_region: "Mésoamérique",
    traditional_use: "Boisson sacrée (xocolatl), monnaie, rituels",
    olfactory_profile: "Riche, amer, poudré, notes de fève torréfiée, profond"
  },
  {
    name: "Hule",
    scientific_name: "Castilla elastica",
    family: "Moraceae",
    common_names: "Panama Rubber Tree, Castilla Rubber, Ule",
    description: "Source du caoutchouc mésoaméricain utilisé pour les balles du jeu de pelote. Le latex séché produit une fumée archaïque et non-florale.",
    origin_region: "Mésoamérique",
    traditional_use: "Caoutchouc, balles de jeu, encens",
    olfactory_profile: "Fumé, archaïque, non-floral, latex, notes de caoutchouc brûlé"
  }
];

// Recettes mexicaines
const MEXICAN_RECIPES = {
  encens: [
    {
      name: "Aliento de Quetzalcóatl",
      name_fr: "Souffle de Quetzalcóatl",
      type: "encens",
      category: "rituel",
      description: "Un encens vibrant, créatif et inspirant, dédié au serpent à plumes, mêlant les arômes des nuages et de la terre fertile.",
      civilization: "Aztèque",
      ingredients: [
        { name: "Yauhtli (Tagetes lucida)", proportion: 50, role: "Base principale, plante des nuages, inspiration et clarté visionnaire" },
        { name: "Hoja Santa (Piper auritum)", proportion: 30, role: "Arôme unique de sassafras, anis et poivre noir" },
        { name: "Ambre fossile", proportion: 10, role: "Note chaude, minérale, résineuse, profondeur temporelle" },
        { name: "Gomme de Tragacanthe", proportion: 10, role: "Liant puissant et neutre pour les mélanges complexes" }
      ],
      preparation: "L'ambre doit être pulvérisé très finement. Ce mélange est conçu pour élever l'esprit et stimuler la créativité.",
      notes_olfactives: { tete: "Anisé, herbacé", coeur: "Résineux, épicé", fond: "Ambré, minéral" }
    }
  ],
  tabacs: [
    {
      name: "Piciete de Poeta",
      name_fr: "Le Piciete du Poète",
      type: "tabac",
      category: "à mâcher",
      description: "Une réinterprétation du piciete traditionnel pour la contemplation et l'inspiration créative.",
      civilization: "Aztèque",
      ingredients: [
        { name: "Nicotiana rustica", proportion: 85, role: "Base puissante, terreuse, riche en nicotine" },
        { name: "Chaux (Cal)", proportion: 5, role: "Agent alcalin pour libérer les alcaloïdes" },
        { name: "Yauhtli (Tagetes lucida)", proportion: 8, role: "Note anisée et onirique" },
        { name: "Cacaloxochitl (Plumeria rubra)", proportion: 2, role: "Touche florale subtile" }
      ],
      preparation: "Mélanger intimement les poudres. Humidifier avec eau de source ou miel d'agave. Utiliser en très petite quantité contre la gencive."
    },
    {
      name: "Fuego y Noche",
      name_fr: "Feu et Nuit",
      type: "tabac",
      category: "à fumer",
      description: "Un tabac méditatif pour le soir, mêlant chaleur des épices et ivresse des fleurs nocturnes.",
      civilization: "Mexicain contemporain",
      ingredients: [
        { name: "Tabac San Andrés Negro", proportion: 70, role: "Base riche, sombre, notes de chocolat et terre" },
        { name: "Vanille Noire", proportion: 15, role: "Arôme profond et balsamique" },
        { name: "Piment de la Jamaïque", proportion: 10, role: "Chaleur épicée" },
        { name: "Jasmin nocturne (Cestrum nocturnum)", proportion: 5, role: "Touche florale narcotique" }
      ],
      preparation: "Infuser vanille et piment dans du rhum ambré, vaporiser sur le tabac, sécher, mélanger avec les pétales."
    },
    {
      name: "Sol de Mediodía",
      name_fr: "Soleil de Midi",
      type: "tabac",
      category: "à rouler",
      description: "Un tabac vif et énergisant inspiré par la lumière crue et les herbes du midi.",
      civilization: "Mexicain contemporain",
      ingredients: [
        { name: "Tabac Virginia clair", proportion: 80, role: "Base légère et sucrée" },
        { name: "Zeste de Citron Vert", proportion: 10, role: "Note hespéridée et vive" },
        { name: "Origan Mexicain (Lippia graveolens)", proportion: 8, role: "Arôme puissant et poivré" },
        { name: "Copal Blanco", proportion: 2, role: "Touche résineuse et sacrée" }
      ],
      preparation: "Hacher finement le tabac, mélanger les poudres uniformément. Idéal pour cigarettes roulées fines."
    },
    {
      name: "Corazón de la Tierra",
      name_fr: "Cœur de la Terre",
      type: "tabac",
      category: "à pipe",
      description: "Un tabac terreux et minéral pour l'ancrage et la connexion aux forces chtoniennes.",
      civilization: "Mexicain contemporain",
      ingredients: [
        { name: "Tabac Burley", proportion: 60, role: "Base robuste et sèche" },
        { name: "Tepezcohuite (Mimosa tenuiflora)", proportion: 30, role: "Arôme amer et terreux" },
        { name: "Valériane mexicaine", proportion: 8, role: "Note musquée et animale" },
        { name: "Sel de Gusano", proportion: 2, role: "Touche umami et minérale" }
      ],
      preparation: "Couper le tabac pour pipe, mélanger les poudres et le sel, laisser reposer plusieurs semaines en cave."
    },
    {
      name: "Viento del Desierto",
      name_fr: "Vent du Désert",
      type: "tabac",
      category: "à pipe",
      description: "Un mélange sec et aromatique inspiré par les plantes du désert de Sonora.",
      civilization: "Nord du Mexique",
      ingredients: [
        { name: "Tabac Turc", proportion: 70, role: "Base aromatique et épicée" },
        { name: "Sauge Blanche (Salvia apiana)", proportion: 15, role: "Note camphrée et purificatrice" },
        { name: "Gobernadora (Larrea tridentata)", proportion: 10, role: "Arôme de pluie sur le désert" },
        { name: "Pin Pinyon", proportion: 5, role: "Note balsamique de conifère" }
      ],
      preparation: "Mélanger feuilles de tabac avec les poudres. Fumer dans des pipes en terre cuite ou pierre."
    }
  ],
  parfums: [
    {
      name: "Lágrimas de Ahuehuete",
      name_fr: "Larmes d'Ahuehuete",
      type: "parfum huile",
      category: "boisé aquatique",
      description: "Un parfum capturant l'odeur d'un cyprès de Moctezuma après la pluie, au bord des canaux de Xochimilco.",
      civilization: "Aztèque",
      base: "Huile de Jojoba (90%)",
      ingredients: [
        { name: "Absolue de Cyprès", proportion: 5, role: "Note de tête verte et boisée" },
        { name: "Copal Blanco", proportion: 3, role: "Note de cœur résineuse" },
        { name: "Vétiver", proportion: 1, role: "Note de fond terreuse" },
        { name: "Geosmin (molécule)", proportion: 1, role: "Odeur de terre après la pluie (petrichor)" }
      ],
      preparation: "Dissoudre absolues et teintures dans l'huile de Jojoba. Ajouter le Geosmin à la fin. Macérer un mois."
    },
    {
      name: "Piel de Jaguar",
      name_fr: "Peau de Jaguar",
      type: "parfum huile",
      category: "animal floral",
      description: "Un parfum animal et cuiré inspiré par le jaguar, créature de la nuit et symbole de pouvoir mésoaméricain.",
      civilization: "Maya",
      base: "Huile de Jojoba (85%)",
      ingredients: [
        { name: "Absolue de Tubéreuse (Nardo)", proportion: 8, role: "Note de cœur florale et narcotique" },
        { name: "Vanille Noire", proportion: 4, role: "Note de fond douce et cuirée" },
        { name: "Ciste Labdanum", proportion: 2, role: "Note ambrée et animale" },
        { name: "Indole (molécule)", proportion: 1, role: "Caractère charnel des fleurs blanches" }
      ],
      preparation: "Parfum audacieux et nocturne. L'indole doit être dosé avec une extrême précision."
    },
    {
      name: "Biblioteca de Palenque",
      name_fr: "Bibliothèque de Palenque",
      type: "parfum huile",
      category: "poudré papyracé",
      description: "Un parfum sec évoquant l'odeur des codex mayas en papier d'amate dans une chambre de pierre calcaire.",
      civilization: "Maya",
      base: "Huile de Jojoba (90%)",
      ingredients: [
        { name: "Absolue de foin coupé", proportion: 5, role: "Note de cœur sèche et herbacée" },
        { name: "Myrrhe", proportion: 3, role: "Note de fond résineuse et amère" },
        { name: "Racine d'Iris", proportion: 1, role: "Note poudrée et noble" },
        { name: "Vanilline (molécule)", proportion: 1, role: "Odeur des vieux livres" }
      ],
      preparation: "Parfum intellectuel et minimaliste. Laisser vieillir au moins trois mois."
    },
    {
      name: "Ofrenda de Cempasúchil",
      name_fr: "Offrande de Cempasúchil",
      type: "parfum huile",
      category: "floral vert",
      description: "L'odeur intense des autels du Jour des Morts, dominée par la fleur de cempasúchil.",
      civilization: "Aztèque",
      base: "Huile de Jojoba (88%)",
      ingredients: [
        { name: "Absolue de Cempasúchil (Tagetes erecta)", proportion: 10, role: "Note de cœur verte et piquante" },
        { name: "Cire d'abeille absolue", proportion: 1, role: "Note de fond miellée (bougies de l'autel)" },
        { name: "Copal Oro", proportion: 1, role: "Fumée qui guide les âmes" }
      ],
      preparation: "Soliflore centré sur le cempasúchil. L'absolue doit être de la plus haute qualité."
    },
    {
      name: "Xocolatl Negro",
      name_fr: "Chocolat Noir",
      type: "parfum huile",
      category: "gourmand amer",
      description: "Un parfum inspiré par le xocolatl aztèque, boisson amère et épicée des dieux.",
      civilization: "Aztèque",
      base: "Huile de Jojoba (85%)",
      ingredients: [
        { name: "Absolue de Cacao", proportion: 10, role: "Note de cœur riche et amère" },
        { name: "Piment Ancho", proportion: 3, role: "Note de tête fumée et fruitée" },
        { name: "Maïs grillé", proportion: 1, role: "Note de fond grillée" },
        { name: "Pyrazine (molécule)", proportion: 1, role: "Arômes de torréfaction" }
      ],
      preparation: "Parfum unisexe, complexe et addictif. La teinture de maïs grillé se fait par macération dans l'alcool."
    }
  ]
};

async function main() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL non défini');
    process.exit(1);
  }

  const url = new URL(DATABASE_URL);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  console.log('=== IMPORT DES DONNÉES MEXICAINES ===\n');

  // 1. Créer ou récupérer le terroir "Mésoamérique"
  console.log('📍 Création du terroir Mésoamérique...');
  const terroirId = 'MESO-001';
  
  const [existingTerroir] = await connection.execute(
    'SELECT id FROM terroirs WHERE terroir_id = ?',
    [terroirId]
  );

  if (existingTerroir.length === 0) {
    await connection.execute(
      `INSERT INTO terroirs (terroir_id, name, country, region, climate_type, soil_type, production_history)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        terroirId,
        'Mésoamérique',
        'Mexique',
        'Amérique Centrale',
        'tropical',
        'volcanic',
        'Région culturelle englobant le centre et le sud du Mexique ainsi que l\'Amérique centrale. Berceau des civilisations aztèque, maya et olmèque. Riche tradition olfactive avec le copal, le cacao et de nombreuses plantes aromatiques endémiques.'
      ]
    );
    console.log('  ✅ Terroir Mésoamérique créé');
  } else {
    console.log('  ⏭️ Terroir Mésoamérique existe déjà');
  }

  // Récupérer l'ID du terroir
  const [terroirRows] = await connection.execute(
    'SELECT id FROM terroirs WHERE terroir_id = ?',
    [terroirId]
  );
  const terroirDbId = terroirRows[0].id;

  // 2. Importer les plantes
  console.log('\n🌿 Import des plantes mésoaméricaines...');
  let plantsCreated = 0;
  let plantsSkipped = 0;
  const plantIds = {};

  for (const plant of MEXICAN_PLANTS) {
    // Vérifier si la plante existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM plants WHERE latin_name = ? OR name = ?',
      [plant.scientific_name, plant.name]
    );

    if (existing.length > 0) {
      plantIds[plant.name] = existing[0].id;
      console.log(`  ⏭️ ${plant.name} existe déjà (ID: ${existing[0].id})`);
      plantsSkipped++;
      continue;
    }

    // Créer la plante
    const [result] = await connection.execute(
      `INSERT INTO plants (name, latin_name, family, category, origin, traditional_use, olfactive_signature)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        plant.name,
        plant.scientific_name,
        plant.family,
        'aromatique',
        plant.origin_region,
        plant.traditional_use + ' | ' + plant.common_names,
        plant.olfactory_profile + ' | ' + plant.description
      ]
    );

    plantIds[plant.name] = result.insertId;
    console.log(`  ✅ ${plant.name} (${plant.scientific_name}) - ID: ${result.insertId}`);
    plantsCreated++;

    // Lier la plante au terroir Mésoamérique
    try {
      await connection.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id) VALUES (?, ?)`,
        [result.insertId, terroirDbId]
      );
    } catch (e) {
      // Ignorer si la liaison existe déjà
    }
  }

  console.log(`\n📊 Plantes: ${plantsCreated} créées, ${plantsSkipped} existantes`);

  // 3. Importer les recettes
  console.log('\n📜 Import des recettes mexicaines...');
  let recipesCreated = 0;

  // Créer une catégorie pour les recettes mexicaines si elle n'existe pas
  const allRecipes = [
    ...MEXICAN_RECIPES.encens,
    ...MEXICAN_RECIPES.tabacs,
    ...MEXICAN_RECIPES.parfums
  ];

  for (const recipe of allRecipes) {
    // Vérifier si la recette existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM recettes WHERE name = ?',
      [recipe.name]
    );

    if (existing.length > 0) {
      console.log(`  ⏭️ ${recipe.name} existe déjà`);
      continue;
    }

    // Déterminer la catégorie
    let category = 'encens';
    if (recipe.type === 'tabac') category = 'tabac';
    else if (recipe.type === 'parfum huile') category = 'parfum';
    else if (recipe.type === 'encens') category = 'encens';

    // Préparer les notes olfactives
    const notesOlf = recipe.notes_olfactives || {};

    // Créer la recette
    const [result] = await connection.execute(
      `INSERT INTO recettes (name, category, description, formula, protocol, notes, notes_tete, notes_coeur, notes_fond, gamme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.name,
        category,
        recipe.description + ' | ' + recipe.name_fr,
        JSON.stringify(recipe.ingredients),
        recipe.preparation || null,
        recipe.base ? `Base: ${recipe.base} | Civilisation: ${recipe.civilization}` : `Civilisation: ${recipe.civilization}`,
        notesOlf.tete || null,
        notesOlf.coeur || null,
        notesOlf.fond || null,
        'Mésoamérique'
      ]
    );

    console.log(`  ✅ ${recipe.name} (${category}) - ID: ${result.insertId}`);
    recipesCreated++;
  }

  console.log(`\n📊 Recettes: ${recipesCreated} créées`);

  // 4. Créer un parcours curaté "Culture Olfactive Mésoaméricaine"
  console.log('\n🗺️ Création du parcours curaté...');
  
  const [existingJourney] = await connection.execute(
    'SELECT id FROM curated_journeys WHERE code = ?',
    ['mesoamerica']
  );

  if (existingJourney.length === 0) {
    const [journeyResult] = await connection.execute(
      `INSERT INTO curated_journeys (code, name, name_en, description, short_description, theme, emoji, color, difficulty, estimated_duration, is_published, plant_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'mesoamerica',
        'Culture Olfactive Mésoaméricaine',
        'Mesoamerican Olfactory Culture',
        'Un voyage olfactif à travers les civilisations mésoaméricaines : le copal sacré des temples aztèques, le cacao des dieux, les fleurs du Jour des Morts et les plantes du désert de Sonora. Découvrez comment les Aztèques et les Mayas utilisaient les parfums dans leurs rituels, leur médecine et leur vie quotidienne.',
        'Aztèques, Mayas et traditions du Mexique',
        'sacred',
        '🇲🇽',
        '#8B4513',
        'intermediate',
        45,
        true,
        7
      ]
    );

    const journeyId = journeyResult.insertId;
    console.log(`  ✅ Parcours créé (ID: ${journeyId})`);

    // Ajouter les items du parcours
    const journeyItemsData = [
      { type: 'plant', name: 'Copal', order: 1, description: 'La résine sacrée par excellence' },
      { type: 'plant', name: 'Cempasúchil', order: 2, description: 'La fleur des morts' },
      { type: 'plant', name: 'Cacao', order: 3, description: 'L\'arbre des dieux' },
      { type: 'plant', name: 'Yauhtli', order: 4, description: 'La plante des nuages' },
      { type: 'plant', name: 'Nardo mexicain', order: 5, description: 'La tubéreuse aztèque' },
      { type: 'plant', name: 'Gobernadora', order: 6, description: 'L\'odeur du désert après la pluie' },
      { type: 'plant', name: 'Ahuehuete', order: 7, description: 'Le cyprès de Moctezuma' }
    ];

    for (const item of journeyItemsData) {
      const plantId = plantIds[item.name];
      if (plantId) {
        await connection.execute(
          `INSERT INTO journey_items (journey_id, item_type, plant_id, sort_order, step_number, context_description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [journeyId, item.type, plantId, item.order, item.order, item.description]
        );
        console.log(`    📌 ${item.name} ajouté au parcours`);
      }
    }
  } else {
    console.log('  ⏭️ Parcours Mésoamérique existe déjà');
  }

  // Résumé final
  console.log('\n=== RÉSUMÉ ===');
  console.log(`🌿 Plantes importées: ${plantsCreated}`);
  console.log(`📜 Recettes importées: ${recipesCreated}`);
  console.log(`🗺️ Parcours curaté: Culture Olfactive Mésoaméricaine`);

  await connection.end();
  console.log('\n✅ Import terminé');
}

main().catch(console.error);
