// Script d'import complet des recettes et ingrédients
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Fonction pour générer un slug
function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Toutes les recettes avec leurs ingrédients
const allRecipes = [
  // Archives Vivantes v2.0 - Famille 1: Cherry Wine
  {
    name: 'Fleur de Cerisier',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord floral délicat et apaisant',
    aromatic_profile: 'Cerise, floral, doux, légèrement boisé',
    maturation_days: 30,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 10.0, notes: 'Profil floral et fruité, β-Caryophyllène dominant', role: 'base' },
      { name: 'Virginia Gold', type: 'tabac', percentage: 89.0, notes: 'Tabac doux et sucré', role: 'base' },
      { name: 'Accord Fleur de Cerisier', type: 'extract', percentage: 1.0, notes: 'Notes florales délicates', role: 'modificateur' }
    ]
  },
  {
    name: 'Chypré Rosé',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un chypré moderne, adouci par des notes de rose et de cerise',
    aromatic_profile: 'Rose, cerise, noisette, boisé',
    maturation_days: 45,
    difficulty: 'avancé',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 12.0, notes: 'β-Caryophyllène, Citronellol, Géraniol', role: 'base' },
      { name: 'Burley 21', type: 'tabac', percentage: 87.5, notes: 'Tabac noisette et boisé', role: 'base' },
      { name: 'Absolue de Rose de Damas', type: 'extract', percentage: 0.5, notes: 'Rose bulgare de haute qualité', role: 'modificateur' }
    ]
  },
  {
    name: 'Fougère de Verger',
    collection: 'Archives Vivantes v2.0',
    concept: 'Une fougère gourmande et fruitée',
    aromatic_profile: 'Cerise, foin, amande, herbacé',
    maturation_days: 30,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 15.0, notes: 'Linalool, Myrcène', role: 'base' },
      { name: 'Tabac de la Semois', type: 'tabac', percentage: 84.0, notes: 'Tabac belge traditionnel', role: 'base' },
      { name: 'Coumarine', type: 'molecule', percentage: 1.0, notes: 'Note foin et amande', role: 'modificateur' }
    ]
  },
  {
    name: 'Ambre Fruité',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un oriental doux et enveloppant',
    aromatic_profile: 'Cerise, ambre, boisé, légèrement fumé',
    maturation_days: 60,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 10.0, notes: 'β-Caryophyllène', role: 'base' },
      { name: 'One Sucker Tobacco', type: 'tabac', percentage: 89.5, notes: 'Tabac américain traditionnel', role: 'base' },
      { name: 'Ambroxan', type: 'molecule', percentage: 0.5, notes: 'Ambre synthétique, note marine', role: 'modificateur' }
    ]
  },
  {
    name: 'Thé à la Cerise',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord frais et végétal',
    aromatic_profile: 'Cerise, thé vert, herbacé, boisé',
    maturation_days: 21,
    difficulty: 'débutant',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 12.0, notes: 'Linalool', role: 'base' },
      { name: 'Ancient Tobacco', type: 'tabac', percentage: 87.0, notes: 'Variété ancestrale', role: 'base' },
      { name: 'Accord Thé Vert', type: 'extract', percentage: 1.0, notes: 'Hexenal, notes végétales', role: 'modificateur' }
    ]
  },
  
  // Archives Vivantes v2.0 - Famille 2: Résine Triple O
  {
    name: 'Cœur de Hasch',
    collection: 'Archives Vivantes v2.0',
    concept: "L'expression la plus pure de la résine, pour les puristes",
    aromatic_profile: 'Haschisch, résine, terreux, noisette',
    maturation_days: 60,
    difficulty: 'avancé',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 8.0, notes: 'Myrcène dominant, profil résineux', role: 'base' },
      { name: 'Burley 21', type: 'tabac', percentage: 92.0, notes: 'Tabac noisette', role: 'base' }
    ]
  },
  {
    name: 'Cuir de Fès',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un cuir oriental, inspiré des tanneries marocaines',
    aromatic_profile: 'Cuir, résine, épicé, poivré, animal',
    maturation_days: 90,
    difficulty: 'expert',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 5.0, notes: 'Myrcène, notes terreuses', role: 'base' },
      { name: 'Louisiana Perique', type: 'tabac', percentage: 94.5, notes: 'Tabac fermenté épicé', role: 'base' },
      { name: 'Accord Cuir', type: 'extract', percentage: 0.5, notes: 'Pyrazines, Castoreum synthétique', role: 'modificateur' }
    ]
  },
  {
    name: "Encens d'Afghanistan",
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord mystique et spirituel',
    aromatic_profile: 'Résine, encens, boisé, très nicotiné',
    maturation_days: 60,
    difficulty: 'avancé',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 7.0, notes: 'Myrcène, α-thuyène', role: 'base' },
      { name: 'Sacred Wyandot', type: 'tabac', percentage: 92.0, notes: 'Tabac cérémoniel très nicotiné', role: 'base' },
      { name: 'Encens Oliban', type: 'extract', percentage: 1.0, notes: "Résine d'encens", role: 'modificateur' }
    ]
  },
  {
    name: 'Chypré Sombre',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un chypré profond et intense',
    aromatic_profile: 'Résine, boisé, humide, terreux, puissant',
    maturation_days: 90,
    difficulty: 'expert',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 6.0, notes: 'β-Caryophyllène', role: 'base' },
      { name: 'One Sucker Tobacco', type: 'tabac', percentage: 93.9, notes: 'Tabac américain', role: 'base' },
      { name: 'Mousse de Chêne purifiée', type: 'extract', percentage: 0.1, notes: 'Evernyl, sans allergènes', role: 'modificateur' }
    ]
  },
  {
    name: 'Patchouli Impérial',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord terreux et boisé, très années 70',
    aromatic_profile: 'Patchouli, haschisch, terreux, cacao',
    maturation_days: 45,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 8.0, notes: 'Myrcène', role: 'base' },
      { name: 'Burley 21', type: 'tabac', percentage: 91.0, notes: 'Tabac noisette', role: 'base' },
      { name: 'Essence de Patchouli', type: 'extract', percentage: 1.0, notes: 'Patchoulol', role: 'modificateur' }
    ]
  },
  
  // Archives Vivantes v2.0 - Famille 3: Lifter US
  {
    name: 'Zeste Matinal',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord vif et énergisant pour le début de journée',
    aromatic_profile: 'Citron, pin, doux, frais',
    maturation_days: 14,
    difficulty: 'débutant',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 15.0, notes: 'α-Pinène dominant, Limonène', role: 'base' },
      { name: 'Virginia Gold', type: 'tabac', percentage: 85.0, notes: 'Tabac doux', role: 'base' }
    ]
  },
  {
    name: 'Fougère Électrique',
    collection: 'Archives Vivantes v2.0',
    concept: 'Une fougère moderne et dynamique',
    aromatic_profile: 'Citron, foin, amande, herbacé',
    maturation_days: 30,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 12.0, notes: 'α-Pinène', role: 'base' },
      { name: 'Tabac de la Semois', type: 'tabac', percentage: 87.0, notes: 'Tabac belge', role: 'base' },
      { name: 'Coumarine', type: 'molecule', percentage: 1.0, notes: 'Note foin', role: 'modificateur' }
    ]
  },
  {
    name: 'Mojito Cubain',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord frais et mentholé',
    aromatic_profile: 'Citron, menthe, doux, légèrement sucré',
    maturation_days: 21,
    difficulty: 'débutant',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 10.0, notes: 'Limonène', role: 'base' },
      { name: 'Virginia Gold', type: 'tabac', percentage: 89.0, notes: 'Tabac doux', role: 'base' },
      { name: 'Accord Menthe-Rhum', type: 'extract', percentage: 1.0, notes: 'Menthol', role: 'modificateur' }
    ]
  },
  {
    name: 'Chypré Vert Acide',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un chypré vif et piquant',
    aromatic_profile: 'Citron, pin, boisé, humide, acidulé',
    maturation_days: 60,
    difficulty: 'avancé',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 15.0, notes: 'α-Pinène', role: 'base' },
      { name: 'Ancient Tobacco', type: 'tabac', percentage: 84.9, notes: 'Variété ancestrale', role: 'base' },
      { name: 'Mousse de Chêne purifiée', type: 'extract', percentage: 0.1, notes: 'Evernyl', role: 'modificateur' }
    ]
  },
  {
    name: 'Gingembre Tonique',
    collection: 'Archives Vivantes v2.0',
    concept: 'Un accord épicé et stimulant',
    aromatic_profile: 'Citron, gingembre, épicé, noisette',
    maturation_days: 30,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 12.0, notes: 'Limonène', role: 'base' },
      { name: 'Burley 21', type: 'tabac', percentage: 87.0, notes: 'Tabac noisette', role: 'base' },
      { name: 'Extrait de Gingembre', type: 'extract', percentage: 1.0, notes: 'Zingiberène', role: 'modificateur' }
    ]
  },
  
  // Haute Parfumerie Fumée
  {
    name: 'Palo Santo Andin',
    collection: 'Haute Parfumerie Fumée',
    concept: 'Un dialogue spirituel entre le tabac oriental bulgare et le bois sacré des Andes',
    aromatic_profile: 'Bois sacré, oriental, méditatif',
    maturation_days: 30,
    difficulty: 'avancé',
    ingredients: [
      { name: 'Crude Oil CBD', type: 'cannabis', percentage: 3.0, notes: 'Huile brute CBD', role: 'base' },
      { name: 'Krumovgrad', type: 'tabac', percentage: 97.0, notes: 'Tabac oriental bulgare', role: 'base' },
      { name: 'Palo Santo', type: 'extract', percentage: 0.1, notes: 'Distillation artisanale', role: 'modificateur' }
    ]
  },
  {
    name: 'Vétiver Double Origine',
    collection: 'Haute Parfumerie Fumée',
    concept: "Un vétiver complet, de la fraîcheur hespéridée d'Haïti à la profondeur fumée de l'Assam",
    aromatic_profile: 'Vétiver, fumé, frais, enveloppant',
    maturation_days: 60,
    difficulty: 'expert',
    ingredients: [
      { name: 'Crude Oil CBD', type: 'cannabis', percentage: 2.5, notes: 'Huile brute CBD', role: 'base' },
      { name: 'Burley', type: 'tabac', percentage: 50.0, notes: 'Tabac américain', role: 'base' },
      { name: 'Virginia Orange', type: 'tabac', percentage: 47.5, notes: 'Tabac doux orangé', role: 'base' },
      { name: 'Vétiver Haïti', type: 'extract', percentage: 0.1, notes: 'Notes de tête fraîches', role: 'modificateur' },
      { name: 'Vétiver Assam', type: 'extract', percentage: 0.05, notes: 'Notes de fond fumées', role: 'modificateur' }
    ]
  },
  {
    name: 'Jardin de Plumeria',
    collection: 'Haute Parfumerie Fumée',
    concept: 'Un accord floral exotique et solaire',
    aromatic_profile: 'Frangipanier, solaire, exotique',
    maturation_days: 15,
    difficulty: 'intermédiaire',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 10.0, notes: 'Profil floral', role: 'base' },
      { name: 'Virginia Gold', type: 'tabac', percentage: 90.0, notes: 'Tabac doux', role: 'base' },
      { name: 'Plumeria Light (Frangipani)', type: 'extract', percentage: 0.2, notes: 'Fleur tropicale', role: 'modificateur' }
    ]
  },
  {
    name: 'Neroli de Krumovgrad',
    collection: 'Haute Parfumerie Fumée',
    concept: "Le mariage de la fleur d'oranger la plus pure avec un tabac oriental rare",
    aromatic_profile: "Néroli, oriental, sophistiqué",
    maturation_days: 10,
    difficulty: 'expert',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 12.0, notes: 'Profil floral', role: 'base' },
      { name: 'Krumovgrad', type: 'tabac', percentage: 88.0, notes: 'Tabac oriental bulgare', role: 'base' },
      { name: 'Neroli Bouquetier Reserve', type: 'extract', percentage: 0.1, notes: "Fleur d'oranger pure", role: 'modificateur' }
    ]
  },
  {
    name: 'Spikenard Himalayen',
    collection: 'Haute Parfumerie Fumée',
    concept: 'Un accord mystique et terreux',
    aromatic_profile: 'Spikenard, mystique, terreux, spirituel',
    maturation_days: 45,
    difficulty: 'expert',
    ingredients: [
      { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 8.0, notes: 'Profil floral', role: 'base' },
      { name: 'Samsoun', type: 'tabac', percentage: 60.0, notes: 'Tabac oriental turc', role: 'base' },
      { name: 'Burley', type: 'tabac', percentage: 32.0, notes: 'Tabac américain', role: 'base' },
      { name: 'Spikenard (Jatamansi)', type: 'extract', percentage: 0.1, notes: 'Racine himalayenne', role: 'modificateur' }
    ]
  },
  {
    name: 'Oud & Résine',
    collection: 'Haute Parfumerie Fumée',
    concept: "L'accord le plus sombre et puissant",
    aromatic_profile: 'Oud, résine, fumé, profond',
    maturation_days: 120,
    difficulty: 'expert',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 5.0, notes: 'Profil résineux', role: 'base' },
      { name: 'Burley', type: 'tabac', percentage: 95.0, notes: 'Infusé au Oud Tea', role: 'base' },
      { name: "Oud Tea (Aquilaria Malaccensis)", type: 'extract', percentage: 0.0, notes: "Infusion de feuilles d'oud", role: 'infusion' }
    ]
  },
  {
    name: "Encens Noir d'Oman",
    collection: 'Haute Parfumerie Fumée',
    concept: 'Un accord liturgique et puissant',
    aromatic_profile: 'Encens noir, liturgique, puissant',
    maturation_days: 90,
    difficulty: 'expert',
    ingredients: [
      { name: 'Résine Triple O', type: 'cannabis', percentage: 6.0, notes: 'Profil résineux', role: 'base' },
      { name: 'Samsoun', type: 'tabac', percentage: 94.0, notes: 'Tabac oriental turc', role: 'base' },
      { name: "Encens Noir d'Oman", type: 'extract', percentage: 0.0, notes: 'Sublimation pendant maturation', role: 'co-maturation' }
    ]
  },
  {
    name: 'Miyazaki Agrumes',
    collection: 'Haute Parfumerie Fumée',
    concept: "Une explosion d'agrumes rares",
    aromatic_profile: 'Agrumes japonais, vif, lumineux',
    maturation_days: 3,
    difficulty: 'avancé',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 15.0, notes: 'Profil citronné', role: 'base' },
      { name: 'Virginia Orange', type: 'tabac', percentage: 85.0, notes: 'Tabac doux orangé', role: 'base' },
      { name: 'Miyazaki Citrus', type: 'extract', percentage: 0.2, notes: 'Agrume japonais rare', role: 'modificateur' },
      { name: 'Tangerine Dream', type: 'extract', percentage: 0.1, notes: 'Petitgrain mandarine', role: 'modificateur' }
    ]
  },
  {
    name: 'Petrichor Indien',
    collection: 'Haute Parfumerie Fumée',
    concept: "L'odeur de la première pluie sur la terre sèche",
    aromatic_profile: 'Petrichor, minéral, terre humide',
    maturation_days: 30,
    difficulty: 'expert',
    ingredients: [
      { name: 'Pollen Lifter US', type: 'cannabis', percentage: 12.0, notes: 'Profil citronné', role: 'base' },
      { name: 'Krumovgrad', type: 'tabac', percentage: 88.0, notes: 'Tabac oriental bulgare', role: 'base' },
      { name: 'Mitti Attar', type: 'extract', percentage: 0.05, notes: 'Distillation de terre cuite', role: 'modificateur' }
    ]
  }
];

console.log(`📋 Import de ${allRecipes.length} recettes avec ingrédients...`);

let totalRecipes = 0;
let totalIngredients = 0;

for (const recipe of allRecipes) {
  const slug = slugify(recipe.name);
  
  try {
    // Insérer ou mettre à jour la recette
    await connection.execute(`
      INSERT INTO cigarillo_recipes 
      (name, slug, collection, concept, expected_experience, maturation_days, difficulty_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      collection = VALUES(collection),
      concept = VALUES(concept),
      expected_experience = VALUES(expected_experience),
      maturation_days = VALUES(maturation_days),
      difficulty_level = VALUES(difficulty_level)
    `, [
      recipe.name,
      slug,
      recipe.collection,
      recipe.concept,
      recipe.aromatic_profile,
      recipe.maturation_days,
      recipe.difficulty
    ]);
    
    // Récupérer l'ID de la recette
    const [rows] = await connection.execute('SELECT id FROM cigarillo_recipes WHERE slug = ?', [slug]);
    const recipeId = rows[0].id;
    
    // Insérer les ingrédients
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ing = recipe.ingredients[i];
      
      await connection.execute(`
        INSERT INTO cigarillo_recipe_ingredients 
        (recipe_id, ingredient_name, ingredient_type, percentage, quantity_per_kg, aromatic_profile, justification, \`order\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        percentage = VALUES(percentage),
        quantity_per_kg = VALUES(quantity_per_kg),
        aromatic_profile = VALUES(aromatic_profile)
      `, [
        recipeId,
        ing.name,
        ing.type,
        ing.percentage,
        ing.percentage * 10,
        ing.notes,
        ing.role,
        i + 1
      ]);
      
      totalIngredients++;
    }
    
    totalRecipes++;
    console.log(`✅ ${recipe.name}: ${recipe.ingredients.length} ingrédients`);
    
  } catch (error) {
    console.error(`❌ Erreur pour ${recipe.name}:`, error.message);
  }
}

console.log(`\n📊 Résumé:`);
console.log(`   - ${totalRecipes} recettes importées`);
console.log(`   - ${totalIngredients} ingrédients ajoutés`);

await connection.end();
