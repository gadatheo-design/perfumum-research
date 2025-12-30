// Script d'import des recettes Cheese Terpenic Line et Ester Lab
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await createConnection(process.env.DATABASE_URL);

// Recettes Cheese Terpenic Line (5 recettes)
const cheeseRecipes = [
  {
    name: 'Classic Cheese',
    category: 'resine_cbd',
    description: 'Profil cheese authentique inspiré de la Big Buddha Cheese. Notes lactées, piquantes et fermentées avec une base terpénique équilibrée.',
    ingredients: 'Hexanoic acid (C6) 0.5%, Octanoic acid (C8) 0.3%, Decanoic acid (C10) 0.1%, 2-Heptanone 0.2%, Myrcène 0.3%, β-Caryophyllène 0.2%, CBD Isolate 30%',
    formula: 'C6:C8:C10 ratio 5:3:1 + terpènes support',
    protocol: '1. Dissoudre C6/C8/C10 dans huile MCT (ratio 1:100)\n2. Ajouter 2-heptanone pour équilibre fruité\n3. Incorporer terpènes (myrcène + caryophyllène)\n4. Chauffer 40-45°C, agitation douce 15min\n5. Maturer 48-72h sous vide léger\n6. Cure 7 jours à 16-18°C',
    notes: 'Fidèle au profil Big Buddha Cheese. Caractère fermenté prononcé.',
    texture: 'Résine souple',
    intensity: 7,
    stability: 'high',
    status: 'validated',
    notesTete: 'Piquant, lacté, fermenté',
    notesCoeur: 'Fromage affiné, terreux',
    notesFond: 'Boisé, musqué, persistant'
  },
  {
    name: 'Tropical Cheese',
    category: 'resine_cbd',
    description: 'Fusion exotique entre profil cheese et notes tropicales. Mangue, ananas et passion sur fond lacté fermenté.',
    ingredients: 'Hexanoic acid (C6) 0.3%, Octanoic acid (C8) 0.2%, Limonène 0.8%, 2-Heptanone 0.4%, Myrcène 0.5%, Linalol 0.2%, CBD Isolate 28%',
    formula: 'C6:C8 ratio 3:2 + limonène dominant + 2-heptanone renforcé',
    protocol: '1. Préparer base cheese allégée (C6+C8)\n2. Ajouter limonène pour ouverture fruitée\n3. Renforcer 2-heptanone (note bleu/fruité)\n4. Incorporer myrcène + linalol\n5. Chauffer 38-42°C, agitation douce\n6. Maturer 48h, cure 5 jours',
    notes: 'Équilibre parfait entre exotique et fromager. Notes mangue/ananas en tête.',
    texture: 'Résine crémeuse',
    intensity: 6,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Mangue, ananas, citrus',
    notesCoeur: 'Fromage doux, passion',
    notesFond: 'Lacté, boisé léger'
  },
  {
    name: 'Blue Cheese',
    category: 'resine_cbd',
    description: 'Profil cheese élégant et floral. Notes crémeuses et douces avec une touche de rose et damascone.',
    ingredients: 'Hexanoic acid (C6) 0.4%, 3-Methylbutanoic acid 0.1%, Linalol 0.6%, β-Damascone 0.05%, Myrcène 0.3%, Géraniol 0.1%, CBD Isolate 32%',
    formula: 'C6 + isovalérique + linalol dominant + damascone trace',
    protocol: '1. Préparer base cheese (C6 + isovalérique)\n2. Ajouter linalol pour rondeur florale\n3. Trace de damascone (attention: très puissant)\n4. Équilibrer avec myrcène + géraniol\n5. Chauffer 35-40°C, agitation délicate\n6. Maturer 72h, cure 10 jours',
    notes: 'Élégance inattendue. Le linalol adoucit le caractère cheese.',
    texture: 'Résine veloutée',
    intensity: 5,
    stability: 'high',
    status: 'validated',
    notesTete: 'Floral, rose, crémeux',
    notesCoeur: 'Fromage doux, miel',
    notesFond: 'Musqué, poudré'
  },
  {
    name: 'Smoky Cheese',
    category: 'resine_cbd',
    description: 'Profil cheese boisé et cuiré. Notes fumées, tabac et cuir sur fond fromager profond.',
    ingredients: 'Hexanoic acid (C6) 0.5%, Octanoic acid (C8) 0.3%, Guaiacol 0.1%, Humulène 0.4%, β-Caryophyllène 0.3%, Cèdre Atlas 0.2%, CBD Isolate 30%',
    formula: 'C6:C8 ratio 5:3 + guaiacol fumé + humulène boisé',
    protocol: '1. Préparer base cheese complète (C6+C8)\n2. Ajouter guaiacol pour note fumée (attention: très puissant)\n3. Incorporer humulène + caryophyllène\n4. Finir avec cèdre atlas\n5. Chauffer 42-48°C, agitation modérée\n6. Maturer 72h, cure 14 jours',
    notes: 'Profondeur terreuse remarquable. Rappelle un fromage affiné en cave.',
    texture: 'Résine dense',
    intensity: 8,
    stability: 'high',
    status: 'validated',
    notesTete: 'Fumé, boisé, piquant',
    notesCoeur: 'Cuir, tabac, fromage',
    notesFond: 'Cèdre, terre, persistant'
  },
  {
    name: 'Sweet Cheese',
    category: 'resine_cbd',
    description: 'Profil cheese gourmand et sucré. Vanille, caramel et miel sur fond lacté doux.',
    ingredients: 'Hexanoic acid (C6) 0.3%, Decanoic acid (C10) 0.2%, Vanilline 0.3%, Ethyl octanoate 0.2%, Myrcène 0.3%, Linalol 0.2%, CBD Isolate 28%',
    formula: 'C6:C10 ratio 3:2 + vanilline + ester fruité',
    protocol: '1. Préparer base cheese légère (C6+C10)\n2. Ajouter vanilline pour douceur\n3. Incorporer ethyl octanoate (fruité-crémeux)\n4. Équilibrer avec myrcène + linalol\n5. Chauffer 38-42°C, agitation douce\n6. Maturer 48h, cure 7 jours',
    notes: 'Accessible et gourmand. Idéal pour initiation au profil cheese.',
    texture: 'Résine souple',
    intensity: 5,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Vanille, caramel, fruité',
    notesCoeur: 'Fromage doux, miel',
    notesFond: 'Lacté, beurré, persistant'
  }
];

// Recettes Ester Lab (6 recettes)
const esterRecipes = [
  {
    name: 'Velvet Fruit',
    category: 'resine_cbd',
    description: 'Profil fruité velouté. Fruits mûrs, banane et poire avec une texture crémeuse.',
    ingredients: 'Ethyl butyrate 0.6%, Isoamyl acetate 0.3%, Myrcène 0.4%, Limonène 0.3%, Linalol 0.2%, CBD Isolate 30%',
    formula: 'Ethyl butyrate dominant + isoamyl acetate support',
    protocol: '1. Dissoudre esters dans éthanol (1:50)\n2. Ajouter terpènes (myrcène + limonène)\n3. Incorporer linalol pour rondeur\n4. Mélanger à la base CBD\n5. Chauffer 35-40°C, agitation douce\n6. Maturer 24h, cure 5 jours',
    notes: 'Profil fruité accessible et consensuel. Notes banane/poire dominantes.',
    texture: 'Résine veloutée',
    intensity: 6,
    stability: 'medium',
    status: 'validated',
    notesTete: 'Banane, poire, ananas',
    notesCoeur: 'Fruits mûrs, crémeux',
    notesFond: 'Lacté, doux'
  },
  {
    name: 'Cassis Blanc',
    category: 'resine_cbd',
    description: 'Profil fruité-soufré unique. Bourgeon de cassis avec une touche fauve et animale.',
    ingredients: 'Ethyl 3-methylthiopropionate 0.5%, Myrcène 0.3%, β-Caryophyllène 0.2%, Linalol 0.3%, Géraniol 0.1%, CBD Isolate 28%',
    formula: 'Ethyl 3-MTP dominant (note cassis) + terpènes floraux',
    protocol: '1. Dissoudre ester soufré dans éthanol (1:100)\n2. Ajouter terpènes progressivement\n3. Équilibrer avec linalol + géraniol\n4. Mélanger à la base CBD\n5. Chauffer 35-38°C, agitation délicate\n6. Maturer 48h, cure 7 jours',
    notes: 'Note cassis très réaliste. Attention: ester soufré puissant, doser avec précision.',
    texture: 'Résine souple',
    intensity: 7,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Cassis, bourgeon, vert',
    notesCoeur: 'Fauve, fruité, floral',
    notesFond: 'Musqué, animal léger'
  },
  {
    name: 'Butter Flower',
    category: 'resine_cbd',
    description: 'Profil lacté-floral. Beurré, orchidée et lait chaud avec une douceur enveloppante.',
    ingredients: 'Ethyl lactate 0.5%, Butyl butyrate 0.3%, Linalol 0.4%, α-Ionone 0.1%, Myrcène 0.2%, CBD Isolate 30%',
    formula: 'Ethyl lactate (lacté) + butyl butyrate (beurré) + ionone (floral)',
    protocol: '1. Dissoudre esters lactiques dans éthanol\n2. Ajouter ionone (trace - très puissant)\n3. Incorporer linalol + myrcène\n4. Mélanger à la base CBD\n5. Chauffer 38-42°C, agitation douce\n6. Maturer 36h, cure 7 jours',
    notes: 'Profil réconfortant et doux. Rappelle un lait chaud à la fleur d\'oranger.',
    texture: 'Résine crémeuse',
    intensity: 5,
    stability: 'high',
    status: 'validated',
    notesTete: 'Lait, beurre, floral',
    notesCoeur: 'Orchidée, crème',
    notesFond: 'Vanillé, poudré'
  },
  {
    name: 'Rhum & Pêche',
    category: 'resine_cbd',
    description: 'Profil fruité-alcoolique. Rhum vieilli et pêche confite avec une richesse gourmande.',
    ingredients: 'Ethyl decanoate 0.5%, γ-Decalactone 0.4%, Myrcène 0.3%, Limonène 0.2%, Linalol 0.2%, CBD Isolate 28%',
    formula: 'Ethyl decanoate (rhum) + γ-decalactone (pêche) équilibrés',
    protocol: '1. Dissoudre esters dans éthanol\n2. Ajouter γ-decalactone (note pêche)\n3. Incorporer terpènes (myrcène + limonène)\n4. Finir avec linalol\n5. Chauffer 40-45°C, agitation modérée\n6. Maturer 48h, cure 10 jours',
    notes: 'Profil gourmand et sophistiqué. Rappelle un cocktail tropical.',
    texture: 'Résine souple',
    intensity: 6,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Pêche, abricot, fruité',
    notesCoeur: 'Rhum, caramel, tropical',
    notesFond: 'Boisé, vanillé, persistant'
  },
  {
    name: 'Nectar Noir',
    category: 'resine_cbd',
    description: 'Profil floral-balsamique. Benjoin, miel et tabac noir avec une profondeur mystérieuse.',
    ingredients: 'Ethyl phenylacetate 0.3%, Methyl salicylate 0.2%, β-Caryophyllène 0.4%, Humulène 0.2%, Vanilline 0.2%, CBD Isolate 30%',
    formula: 'Esters aromatiques + terpènes boisés + vanilline',
    protocol: '1. Dissoudre esters aromatiques dans éthanol\n2. Ajouter terpènes boisés (caryophyllène + humulène)\n3. Incorporer vanilline pour douceur\n4. Mélanger à la base CBD\n5. Chauffer 42-48°C, agitation modérée\n6. Maturer 72h, cure 14 jours',
    notes: 'Profil complexe et envoûtant. Rappelle un tabac miellé.',
    texture: 'Résine dense',
    intensity: 8,
    stability: 'high',
    status: 'validated',
    notesTete: 'Miel, floral, épicé',
    notesCoeur: 'Benjoin, tabac, balsamique',
    notesFond: 'Vanille, boisé, persistant'
  },
  {
    name: 'Cuir Poire',
    category: 'resine_cbd',
    description: 'Profil fruité-cuiré. Poire confite et cuir chaud avec une élégance inattendue.',
    ingredients: 'Ethyl furan-2-carboxylate 0.4%, Isoamyl acetate 0.2%, β-Caryophyllène 0.3%, Humulène 0.2%, Linalol 0.2%, CBD Isolate 28%',
    formula: 'Ester furanique (cuir) + isoamyl acetate (poire) + terpènes boisés',
    protocol: '1. Dissoudre esters dans éthanol\n2. Ajouter terpènes boisés progressivement\n3. Incorporer linalol pour transition\n4. Mélanger à la base CBD\n5. Chauffer 40-45°C, agitation douce\n6. Maturer 48h, cure 10 jours',
    notes: 'Association surprenante et réussie. Le cuir adoucit la poire.',
    texture: 'Résine souple',
    intensity: 7,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Poire, fruité, vert',
    notesCoeur: 'Cuir souple, boisé',
    notesFond: 'Ambré, musqué, persistant'
  }
];

// Fonction d'insertion
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

// Exécution
console.log('🧪 Import des recettes Cheese Terpenic Line et Ester Lab');
console.log('=========================================================');

await insertRecipes(cheeseRecipes, 'Cheese Terpenic Line');
await insertRecipes(esterRecipes, 'Ester Lab');

// Vérification
const [count] = await connection.execute('SELECT COUNT(*) as total FROM recettes WHERE category = ?', ['resine_cbd']);
console.log(`\n📊 Total recettes résine_cbd: ${count[0].total}`);

await connection.end();
console.log('\n✅ Import terminé');
