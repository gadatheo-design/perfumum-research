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
      // Cannabis et terpènes - Landraces classiques
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
      
      // Cannabis - Variétés CBD et produits
      'crude oil cbd': ['Cannabidiol', 'Myrcene', 'Limonene', 'Caryophyllene'],
      'pollen cherry wine': ['Cannabidiol', 'Myrcene', 'Pinene', 'Caryophyllene'],
      'pollen lifter us': ['Cannabidiol', 'Myrcene', 'Limonene', 'Linalool'],
      'résine triple o': ['Cannabidiol', 'Myrcene', 'Caryophyllene', 'Humulene'],
      
      // Tabacs - Variétés spécifiques
      'perique': ['Nicotine', 'Solanesol', 'Neophytadiene'],
      'louisiana perique': ['Nicotine', 'Solanesol', 'Neophytadiene', 'Acetic acid'],
      'latakia': ['Guaiacol', 'Syringol', 'Eugenol'],
      'mapacho': ['Nicotine', 'Nornicotine', 'Anabasine'],
      'oriental': ['Linalool', 'Geraniol', 'Nerol'],
      'samsoun': ['Linalool', 'Geraniol', 'Nerol', 'Eugenol'],
      'krumovgrad': ['Linalool', 'Geraniol', 'Caryophyllene'],
      'virginia': ['Glucose', 'Fructose', 'Sucrose'],
      'virginia gold': ['Glucose', 'Fructose', 'Sucrose', 'Nicotine'],
      'virginia orange': ['Glucose', 'Fructose', 'Carotenoids'],
      'burley': ['Nicotine', 'Nornicotine'],
      'burley 21': ['Nicotine', 'Nornicotine', 'Anabasine'],
      'tabac de la semois': ['Nicotine', 'Solanesol', 'Linalool'],
      'ancient tobacco': ['Nicotine', 'Nornicotine', 'Solanesol'],
      'one sucker tobacco': ['Nicotine', 'Solanesol'],
      'sacred wyandot': ['Nicotine', 'Nornicotine', 'Harman'],
      
      // Extraits et huiles essentielles
      'encens': ['Incensole', 'Boswellic acid', 'Alpha-pinene'],
      'encens noir d\'oman': ['Incensole', 'Boswellic acid', 'Alpha-pinene', 'Limonene'],
      'encens oliban': ['Incensole', 'Boswellic acid', 'Alpha-pinene'],
      'myrrhe': ['Furanoeudesma-1,3-diene', 'Curzerene'],
      'oud': ['Agarospirol', 'Jinkohol', 'Guaiol'],
      'oud tea (aquilaria malaccensis)': ['Agarospirol', 'Jinkohol', 'Guaiol', 'Vetispirane'],
      'santal': ['Santalol', 'Santalene'],
      'vetiver': ['Vetiverol', 'Khusimol', 'Vetivone'],
      'vétiver assam': ['Vetiverol', 'Khusimol', 'Vetivone', 'Zizanal'],
      'vétiver haïti': ['Vetiverol', 'Khusimol', 'Isovalencenol'],
      'patchouli': ['Patchoulol', 'Norpatchoulenol'],
      'essence de patchouli': ['Patchoulol', 'Norpatchoulenol', 'Pogostol'],
      'cèdre': ['Cedrol', 'Cedrene'],
      'benjoin': ['Benzoic acid', 'Cinnamic acid', 'Vanillin'],
      'labdanum': ['Labdanolic acid', 'Sclareol'],
      'ambre gris': ['Ambrein', 'Ambroxide'],
      'civette': ['Civetone', 'Skatole'],
      'castoreum': ['Castoramine', 'Salicin'],
      'musc': ['Muscone', 'Musk ketone'],
      'palo santo': ['Limonene', 'Alpha-terpineol', 'Menthofuran'],
      'mousse de chêne purifiée': ['Evernic acid', 'Atranorin', 'Orcinol'],
      'mitti attar': ['Geosmin', 'Petrichor compounds'],
      'spikenard (jatamansi)': ['Jatamansone', 'Nardostachone', 'Valeranone'],
      'plumeria light (frangipani)': ['Benzyl benzoate', 'Linalool', 'Geraniol'],
      'neroli bouquetier reserve': ['Linalool', 'Linalyl acetate', 'Nerolidol', 'Farnesol'],
      'tangerine dream': ['Limonene', 'Gamma-terpinene', 'Myrcene'],
      'miyazaki citrus': ['Limonene', 'Citral', 'Linalool'],
      'absolue de rose de damas': ['Citronellol', 'Geraniol', 'Nerol', 'Phenylethyl alcohol'],
      'extrait de gingembre': ['Zingiberene', 'Gingerol', 'Shogaol'],
      
      // Molécules pures
      'ambroxan': ['Ambroxide'],
      'coumarine': ['Coumarin'],
    };
    
    const ingredientToPlants = {
      // Cannabis - Landraces classiques
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
      
      // Cannabis - Variétés CBD et produits
      'crude oil cbd': 'Cannabis sativa',
      'pollen cherry wine': 'Cannabis sativa',
      'pollen lifter us': 'Cannabis sativa',
      'résine triple o': 'Cannabis indica',
      
      // Tabacs - Variétés spécifiques
      'perique': 'Nicotiana tabacum',
      'louisiana perique': 'Nicotiana tabacum',
      'latakia': 'Nicotiana tabacum',
      'mapacho': 'Nicotiana rustica',
      'oriental': 'Nicotiana tabacum',
      'samsoun': 'Nicotiana tabacum',
      'krumovgrad': 'Nicotiana tabacum',
      'virginia': 'Nicotiana tabacum',
      'virginia gold': 'Nicotiana tabacum',
      'virginia orange': 'Nicotiana tabacum',
      'burley': 'Nicotiana tabacum',
      'burley 21': 'Nicotiana tabacum',
      'tabac de la semois': 'Nicotiana tabacum',
      'ancient tobacco': 'Nicotiana rustica',
      'one sucker tobacco': 'Nicotiana tabacum',
      'sacred wyandot': 'Nicotiana rustica',
      
      // Plantes aromatiques - Encens et résines
      'encens': 'Boswellia sacra',
      'encens noir d\'oman': 'Boswellia sacra',
      'encens oliban': 'Boswellia sacra',
      'myrrhe': 'Commiphora myrrha',
      'oud': 'Aquilaria malaccensis',
      'oud tea (aquilaria malaccensis)': 'Aquilaria malaccensis',
      'palo santo': 'Bursera graveolens',
      
      // Plantes aromatiques - Bois et racines
      'santal': 'Santalum album',
      'vetiver': 'Chrysopogon zizanioides',
      'vétiver assam': 'Chrysopogon zizanioides',
      'vétiver haïti': 'Chrysopogon zizanioides',
      'patchouli': 'Pogostemon cablin',
      'essence de patchouli': 'Pogostemon cablin',
      'cèdre': 'Cedrus atlantica',
      'spikenard (jatamansi)': 'Nardostachys jatamansi',
      
      // Plantes aromatiques - Résines et baumes
      'benjoin': 'Styrax benzoin',
      'labdanum': 'Cistus ladanifer',
      'mousse de chêne purifiée': 'Evernia prunastri',
      
      // Plantes aromatiques - Fleurs
      'lavande': 'Lavandula angustifolia',
      'rose': 'Rosa damascena',
      'absolue de rose de damas': 'Rosa damascena',
      'jasmin': 'Jasminum grandiflorum',
      'ylang-ylang': 'Cananga odorata',
      'plumeria light (frangipani)': 'Plumeria rubra',
      'neroli bouquetier reserve': 'Citrus aurantium',
      
      // Plantes aromatiques - Agrumes
      'bergamote': 'Citrus bergamia',
      'néroli': 'Citrus aurantium',
      'tangerine dream': 'Citrus reticulata',
      'miyazaki citrus': 'Citrus junos',
      
      // Plantes aromatiques - Épices et racines
      'extrait de gingembre': 'Zingiber officinale',
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
