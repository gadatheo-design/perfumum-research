/**
 * Script pour créer les liens croisés entre les ingrédients des recettes
 * et les molécules/plantes correspondantes dans la base de données
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function createIngredientLinks() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🔗 Création des liens croisés ingrédients ↔ molécules/plantes...\n');
    
    // 1. Récupérer tous les ingrédients
    const [ingredients] = await connection.execute(`
      SELECT id, ingredient_name, ingredient_type, molecule_id, plant_id 
      FROM cigarillo_recipe_ingredients
    `);
    
    console.log(`📦 ${ingredients.length} ingrédients à traiter\n`);
    
    // 2. Récupérer toutes les molécules pour le matching
    const [molecules] = await connection.execute(`
      SELECT id, name, LOWER(name) as name_lower 
      FROM molecules
    `);
    
    // 3. Récupérer toutes les plantes pour le matching
    const [plants] = await connection.execute(`
      SELECT id, name, latin_name, LOWER(name) as name_lower, LOWER(latin_name) as latin_lower
      FROM plants
    `);
    
    // 4. Créer les mappings de noms pour faciliter le matching
    const moleculeMap = new Map();
    molecules.forEach(m => {
      moleculeMap.set(m.name_lower, m.id);
      // Ajouter des variantes communes
      const simplified = m.name_lower.replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a');
      moleculeMap.set(simplified, m.id);
    });
    
    const plantMap = new Map();
    plants.forEach(p => {
      plantMap.set(p.name_lower, p.id);
      if (p.latin_lower) plantMap.set(p.latin_lower, p.id);
    });
    
    // 5. Mappings manuels pour les ingrédients courants
    const ingredientToMolecules = {
      // Cannabis et terpènes
      'hindu kush': ['Myrcene', 'Limonene', 'Caryophyllene', 'Pinene'],
      'ketama': ['Myrcene', 'Limonene', 'Linalool', 'Caryophyllene'],
      'durban poison': ['Terpinolene', 'Myrcene', 'Limonene'],
      'malawi gold': ['Limonene', 'Myrcene', 'Pinene'],
      'thai stick': ['Limonene', 'Terpinolene', 'Myrcene'],
      'acapulco gold': ['Myrcene', 'Limonene', 'Caryophyllene'],
      'colombian gold': ['Limonene', 'Myrcene', 'Pinene'],
      'panama red': ['Myrcene', 'Limonene', 'Caryophyllene'],
      'lebanese red': ['Myrcene', 'Caryophyllene', 'Humulene'],
      'nepalese temple ball': ['Myrcene', 'Pinene', 'Caryophyllene'],
      
      // Tabacs
      'perique': ['Nicotine', 'Solanesol', 'Neophytadiene'],
      'latakia': ['Guaiacol', 'Syringol', 'Eugenol'],
      'mapacho': ['Nicotine', 'Nornicotine', 'Anabasine'],
      'oriental': ['Linalool', 'Geraniol', 'Nerol'],
      'virginia': ['Glucose', 'Fructose', 'Sucrose'],
      'burley': ['Nicotine', 'Nornicotine'],
      
      // Extraits et huiles essentielles
      'encens': ['Incensole', 'Boswellic acid', 'Alpha-pinene'],
      'myrrhe': ['Furanoeudesma-1,3-diene', 'Curzerene'],
      'oud': ['Agarospirol', 'Jinkohol', 'Guaiol'],
      'santal': ['Santalol', 'Santalene'],
      'vetiver': ['Vetiverol', 'Khusimol', 'Vetivone'],
      'patchouli': ['Patchoulol', 'Norpatchoulenol'],
      'cèdre': ['Cedrol', 'Cedrene'],
      'benjoin': ['Benzoic acid', 'Cinnamic acid', 'Vanillin'],
      'labdanum': ['Labdanolic acid', 'Sclareol'],
      'ambre gris': ['Ambrein', 'Ambroxide'],
      'civette': ['Civetone', 'Skatole'],
      'castoreum': ['Castoramine', 'Salicin'],
      'musc': ['Muscone', 'Musk ketone'],
    };
    
    const ingredientToPlants = {
      // Cannabis
      'hindu kush': 'Cannabis indica',
      'ketama': 'Cannabis indica',
      'durban poison': 'Cannabis sativa',
      'malawi gold': 'Cannabis sativa',
      'thai stick': 'Cannabis sativa',
      'acapulco gold': 'Cannabis sativa',
      'colombian gold': 'Cannabis sativa',
      'panama red': 'Cannabis sativa',
      'lebanese red': 'Cannabis indica',
      'nepalese temple ball': 'Cannabis indica',
      
      // Tabacs
      'perique': 'Nicotiana tabacum',
      'latakia': 'Nicotiana tabacum',
      'mapacho': 'Nicotiana rustica',
      'oriental': 'Nicotiana tabacum',
      'virginia': 'Nicotiana tabacum',
      'burley': 'Nicotiana tabacum',
      
      // Plantes aromatiques
      'encens': 'Boswellia sacra',
      'myrrhe': 'Commiphora myrrha',
      'oud': 'Aquilaria malaccensis',
      'santal': 'Santalum album',
      'vetiver': 'Chrysopogon zizanioides',
      'patchouli': 'Pogostemon cablin',
      'cèdre': 'Cedrus atlantica',
      'benjoin': 'Styrax benzoin',
      'labdanum': 'Cistus ladanifer',
      'lavande': 'Lavandula angustifolia',
      'rose': 'Rosa damascena',
      'jasmin': 'Jasminum grandiflorum',
      'ylang-ylang': 'Cananga odorata',
      'bergamote': 'Citrus bergamia',
      'néroli': 'Citrus aurantium',
    };
    
    let moleculeLinksCreated = 0;
    let plantLinksCreated = 0;
    
    // 6. Traiter chaque ingrédient
    for (const ingredient of ingredients) {
      const nameLower = ingredient.ingredient_name.toLowerCase();
      
      // Chercher les molécules associées
      const moleculeNames = ingredientToMolecules[nameLower] || [];
      if (moleculeNames.length > 0 && !ingredient.molecule_id) {
        // Prendre la première molécule comme lien principal
        const firstMolName = moleculeNames[0];
        const molId = moleculeMap.get(firstMolName.toLowerCase());
        if (molId) {
          await connection.execute(
            `UPDATE cigarillo_recipe_ingredients SET molecule_id = ? WHERE id = ?`,
            [molId, ingredient.id]
          );
          moleculeLinksCreated++;
        }
      }
      
      // Chercher la plante associée
      const plantName = ingredientToPlants[nameLower];
      if (plantName && !ingredient.plant_id) {
        const plantId = plantMap.get(plantName.toLowerCase());
        if (plantId) {
          await connection.execute(
            `UPDATE cigarillo_recipe_ingredients SET plant_id = ? WHERE id = ?`,
            [plantId, ingredient.id]
          );
          plantLinksCreated++;
        }
      }
    }
    
    console.log(`✅ ${moleculeLinksCreated} liens molécules créés`);
    console.log(`✅ ${plantLinksCreated} liens plantes créés`);
    
    // 7. Afficher un résumé
    const [moleculeLinks] = await connection.execute(`
      SELECT COUNT(*) as count FROM cigarillo_recipe_ingredients WHERE molecule_id IS NOT NULL
    `);
    const [plantLinks] = await connection.execute(`
      SELECT COUNT(*) as count FROM cigarillo_recipe_ingredients WHERE plant_id IS NOT NULL
    `);
    
    console.log(`\n📊 ${moleculeLinks[0].count} ingrédients liés à des molécules`);
    console.log(`📊 ${plantLinks[0].count} ingrédients liés à des plantes`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createIngredientLinks().catch(console.error);
