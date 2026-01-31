// Script d'import des ingrédients des recettes de cigarillos
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les recettes existantes
const [recipes] = await connection.execute('SELECT id, name, slug FROM cigarillo_recipes');
const recipeMap = new Map(recipes.map(r => [r.slug, r.id]));

console.log(`📋 ${recipes.length} recettes trouvées`);

// Définir les ingrédients pour chaque recette
const recipeIngredients = {
  // Archives Vivantes v2.0 - Famille 1: Cherry Wine
  'fleur-de-cerisier': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 10.0, role: 'base', notes: 'Profil floral et fruité, β-Caryophyllène dominant' },
    { name: 'Virginia Gold', type: 'tabac', percentage: 89.0, role: 'base', notes: 'Tabac doux et sucré' },
    { name: 'Accord Fleur de Cerisier', type: 'essence', percentage: 1.0, role: 'modificateur', notes: 'Notes florales délicates' }
  ],
  'chypre-rose': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 12.0, role: 'base', notes: 'β-Caryophyllène, Citronellol, Géraniol' },
    { name: 'Burley 21', type: 'tabac', percentage: 87.5, role: 'base', notes: 'Tabac noisette et boisé' },
    { name: 'Absolue de Rose de Damas', type: 'essence', percentage: 0.5, role: 'modificateur', notes: 'Rose bulgare de haute qualité' }
  ],
  'fougere-de-verger': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 15.0, role: 'base', notes: 'Linalool, Myrcène' },
    { name: 'Tabac de la Semois', type: 'tabac', percentage: 84.0, role: 'base', notes: 'Tabac belge traditionnel' },
    { name: 'Coumarine', type: 'molecule', percentage: 1.0, role: 'modificateur', notes: 'Note foin et amande' }
  ],
  'ambre-fruite': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 10.0, role: 'base', notes: 'β-Caryophyllène' },
    { name: 'One Sucker Tobacco', type: 'tabac', percentage: 89.5, role: 'base', notes: 'Tabac américain traditionnel' },
    { name: 'Ambroxan', type: 'molecule', percentage: 0.5, role: 'modificateur', notes: 'Ambre synthétique, note marine' }
  ],
  'the-a-la-cerise': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 12.0, role: 'base', notes: 'Linalool' },
    { name: 'Ancient Tobacco', type: 'tabac', percentage: 87.0, role: 'base', notes: 'Variété ancestrale' },
    { name: 'Accord Thé Vert', type: 'essence', percentage: 1.0, role: 'modificateur', notes: 'Hexenal, notes végétales' }
  ],
  
  // Archives Vivantes v2.0 - Famille 2: Résine Triple O
  'coeur-de-hasch': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 8.0, role: 'base', notes: 'Myrcène dominant, profil résineux' },
    { name: 'Burley 21', type: 'tabac', percentage: 92.0, role: 'base', notes: 'Tabac noisette' }
  ],
  'cuir-de-fes': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 5.0, role: 'base', notes: 'Myrcène, notes terreuses' },
    { name: 'Louisiana Perique', type: 'tabac', percentage: 94.5, role: 'base', notes: 'Tabac fermenté épicé' },
    { name: 'Accord Cuir', type: 'essence', percentage: 0.5, role: 'modificateur', notes: 'Pyrazines, Castoreum synthétique' }
  ],
  'encens-dafghanistan': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 7.0, role: 'base', notes: 'Myrcène, α-thuyène' },
    { name: 'Sacred Wyandot', type: 'tabac', percentage: 92.0, role: 'base', notes: 'Tabac cérémoniel très nicotiné' },
    { name: 'Encens Oliban', type: 'essence', percentage: 1.0, role: 'modificateur', notes: 'Résine d\'encens' }
  ],
  'chypre-sombre': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 6.0, role: 'base', notes: 'β-Caryophyllène' },
    { name: 'One Sucker Tobacco', type: 'tabac', percentage: 93.9, role: 'base', notes: 'Tabac américain' },
    { name: 'Mousse de Chêne purifiée', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Evernyl, sans allergènes' }
  ],
  'patchouli-imperial': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 8.0, role: 'base', notes: 'Myrcène' },
    { name: 'Burley 21', type: 'tabac', percentage: 91.0, role: 'base', notes: 'Tabac noisette' },
    { name: 'Essence de Patchouli', type: 'essence', percentage: 1.0, role: 'modificateur', notes: 'Patchoulol' }
  ],
  
  // Archives Vivantes v2.0 - Famille 3: Lifter US
  'zeste-matinal': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 15.0, role: 'base', notes: 'α-Pinène dominant, Limonène' },
    { name: 'Virginia Gold', type: 'tabac', percentage: 85.0, role: 'base', notes: 'Tabac doux' }
  ],
  'fougere-electrique': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 12.0, role: 'base', notes: 'α-Pinène' },
    { name: 'Tabac de la Semois', type: 'tabac', percentage: 87.0, role: 'base', notes: 'Tabac belge' },
    { name: 'Coumarine', type: 'molecule', percentage: 1.0, role: 'modificateur', notes: 'Note foin' }
  ],
  'mojito-cubain': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 10.0, role: 'base', notes: 'Limonène' },
    { name: 'Virginia Gold', type: 'tabac', percentage: 89.0, role: 'base', notes: 'Tabac doux' },
    { name: 'Accord Menthe-Rhum', type: 'essence', percentage: 1.0, role: 'modificateur', notes: 'Menthol' }
  ],
  'chypre-vert-acide': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 15.0, role: 'base', notes: 'α-Pinène' },
    { name: 'Ancient Tobacco', type: 'tabac', percentage: 84.9, role: 'base', notes: 'Variété ancestrale' },
    { name: 'Mousse de Chêne purifiée', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Evernyl' }
  ],
  'gingembre-tonique': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 12.0, role: 'base', notes: 'Limonène' },
    { name: 'Burley 21', type: 'tabac', percentage: 87.0, role: 'base', notes: 'Tabac noisette' },
    { name: 'Extrait de Gingembre', type: 'essence', percentage: 1.0, role: 'modificateur', notes: 'Zingiberène' }
  ],
  
  // Haute Parfumerie Fumée
  'ambre-gris-oceanique': [
    { name: 'Crude Oil CBD', type: 'cannabis', percentage: 2.0, role: 'base', notes: 'Huile brute CBD, nébulisation à froid' },
    { name: 'Virginia Gold', type: 'tabac', percentage: 70.0, role: 'base', notes: 'Tabac doux' },
    { name: 'Samsoun', type: 'tabac', percentage: 28.0, role: 'base', notes: 'Tabac oriental turc' },
    { name: 'Ambre Gris Cured in Vintage Sandalwood', type: 'essence', percentage: 0.05, role: 'modificateur', notes: 'Matière première exceptionnelle' }
  ],
  'palo-santo-andin': [
    { name: 'Crude Oil CBD', type: 'cannabis', percentage: 3.0, role: 'base', notes: 'Huile brute CBD' },
    { name: 'Krumovgrad', type: 'tabac', percentage: 97.0, role: 'base', notes: 'Tabac oriental bulgare' },
    { name: 'Palo Santo', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Distillation artisanale' }
  ],
  'vetiver-double-origine': [
    { name: 'Crude Oil CBD', type: 'cannabis', percentage: 2.5, role: 'base', notes: 'Huile brute CBD' },
    { name: 'Burley', type: 'tabac', percentage: 50.0, role: 'base', notes: 'Tabac américain' },
    { name: 'Virginia Orange', type: 'tabac', percentage: 47.5, role: 'base', notes: 'Tabac doux orangé' },
    { name: 'Vétiver Haïti', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Notes de tête fraîches' },
    { name: 'Vétiver Assam', type: 'essence', percentage: 0.05, role: 'modificateur', notes: 'Notes de fond fumées' }
  ],
  'jardin-de-plumeria': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 10.0, role: 'base', notes: 'Profil floral' },
    { name: 'Virginia Gold', type: 'tabac', percentage: 90.0, role: 'base', notes: 'Tabac doux' },
    { name: 'Plumeria Light (Frangipani)', type: 'essence', percentage: 0.2, role: 'modificateur', notes: 'Fleur tropicale' }
  ],
  'neroli-de-krumovgrad': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 12.0, role: 'base', notes: 'Profil floral' },
    { name: 'Krumovgrad', type: 'tabac', percentage: 88.0, role: 'base', notes: 'Tabac oriental bulgare' },
    { name: 'Neroli Bouquetier Reserve', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Fleur d\'oranger pure' }
  ],
  'spikenard-himalayen': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 8.0, role: 'base', notes: 'Profil floral' },
    { name: 'Samsoun', type: 'tabac', percentage: 60.0, role: 'base', notes: 'Tabac oriental turc' },
    { name: 'Burley', type: 'tabac', percentage: 32.0, role: 'base', notes: 'Tabac américain' },
    { name: 'Spikenard (Jatamansi)', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Racine himalayenne' }
  ],
  'oud-resine': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 5.0, role: 'base', notes: 'Profil résineux' },
    { name: 'Burley', type: 'tabac', percentage: 95.0, role: 'base', notes: 'Infusé au Oud Tea' },
    { name: 'Oud Tea (Aquilaria Malaccensis)', type: 'essence', percentage: 0.0, role: 'infusion', notes: 'Infusion de feuilles d\'oud' }
  ],
  'encens-noir-doman': [
    { name: 'Résine Triple O', type: 'cannabis', percentage: 6.0, role: 'base', notes: 'Profil résineux' },
    { name: 'Samsoun', type: 'tabac', percentage: 94.0, role: 'base', notes: 'Tabac oriental turc' },
    { name: 'Encens Noir d\'Oman', type: 'essence', percentage: 0.0, role: 'co-maturation', notes: 'Sublimation pendant maturation' }
  ],
  'miyazaki-agrumes': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 15.0, role: 'base', notes: 'Profil citronné' },
    { name: 'Virginia Orange', type: 'tabac', percentage: 85.0, role: 'base', notes: 'Tabac doux orangé' },
    { name: 'Miyazaki Citrus', type: 'essence', percentage: 0.2, role: 'modificateur', notes: 'Agrume japonais rare' },
    { name: 'Tangerine Dream', type: 'essence', percentage: 0.1, role: 'modificateur', notes: 'Petitgrain mandarine' }
  ],
  'petrichor-indien': [
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 12.0, role: 'base', notes: 'Profil citronné' },
    { name: 'Krumovgrad', type: 'tabac', percentage: 88.0, role: 'base', notes: 'Tabac oriental bulgare' },
    { name: 'Mitti Attar', type: 'essence', percentage: 0.05, role: 'modificateur', notes: 'Distillation de terre cuite' }
  ],
  
  // Triptyques
  'triptyque-de-cannabis': [
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 15.0, role: 'base', notes: 'Voix florale et apaisante' },
    { name: 'Résine Triple O', type: 'cannabis', percentage: 5.0, role: 'base', notes: 'Voix résineuse et terreuse' },
    { name: 'Pollen Lifter US', type: 'cannabis', percentage: 10.0, role: 'base', notes: 'Voix citronnée et énergisante' },
    { name: 'Krumovgrad', type: 'tabac', percentage: 70.0, role: 'base', notes: 'Chef d\'orchestre discret' }
  ],
  'eloge-du-tabac': [
    { name: 'Louisiana Perique', type: 'tabac', percentage: 40.0, role: 'base', notes: 'Tabac fermenté épicé' },
    { name: 'Krumovgrad', type: 'tabac', percentage: 30.0, role: 'base', notes: 'Tabac oriental bulgare' },
    { name: 'Virginia Gold', type: 'tabac', percentage: 20.0, role: 'base', notes: 'Tabac doux' },
    { name: 'Latakia', type: 'tabac', percentage: 5.0, role: 'modificateur', notes: 'Tabac fumé syrien' },
    { name: 'Pollen Cherry Wine', type: 'cannabis', percentage: 5.0, role: 'modificateur', notes: 'Accent floral subtil' }
  ]
};

let totalIngredients = 0;
let linkedRecipes = 0;

for (const [slug, ingredients] of Object.entries(recipeIngredients)) {
  const recipeId = recipeMap.get(slug);
  
  if (!recipeId) {
    console.log(`⚠️ Recette non trouvée: ${slug}`);
    continue;
  }
  
  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];
    
    try {
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
        ing.percentage * 10, // quantity per kg
        ing.notes,
        ing.role,
        i + 1
      ]);
      
      totalIngredients++;
    } catch (error) {
      console.error(`❌ Erreur pour ${slug} - ${ing.name}:`, error.message);
    }
  }
  
  linkedRecipes++;
  console.log(`✅ ${slug}: ${ingredients.length} ingrédients`);
}

console.log(`\n📊 Résumé:`);
console.log(`   - ${linkedRecipes} recettes enrichies`);
console.log(`   - ${totalIngredients} ingrédients ajoutés`);

await connection.end();
