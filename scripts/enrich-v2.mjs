import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // 1. Récupérer les molécules avec leurs noms et IDs
  const [molecules] = await connection.execute(`SELECT id, name FROM molecules`);
  
  // Créer un mapping nom -> id (en minuscules pour la recherche)
  const moleculeMap = {};
  for (const mol of molecules) {
    moleculeMap[mol.name.toLowerCase()] = mol.id;
  }
  
  console.log(`${molecules.length} molécules trouvées`);
  
  // 2. Récupérer les recettes sans associations
  const [recettes] = await connection.execute(`
    SELECT r.id, r.name, r.category, r.ingredients
    FROM recettes r
    LEFT JOIN molecules_recettes mr ON r.id = mr.recette_id
    WHERE mr.id IS NULL
  `);
  
  console.log(`${recettes.length} recettes sans associations`);
  
  // 3. Définir les molécules par gamme (avec des mots-clés plus larges)
  const gammeKeywords = {
    'volcanique': ['soufre', 'cendre', 'lave', 'basalte', 'obsidienne', 'magma', 'fumée', 'pyroclaste', 'volcan'],
    'glaciaire': ['menthol', 'eucalyptol', 'camphre', 'glace', 'neige', 'givre', 'cristal', 'aldéhyde', 'froid', 'glacial'],
    'bio-lab': ['myrcène', 'limonène', 'pinène', 'linalol', 'caryophyllène', 'terpinolène', 'humulène', 'terpène', 'cbd', 'cannabis'],
    'pétrichor': ['géosmine', 'argile', 'terre', 'ozone', 'minéral', 'humus', 'mousse', 'pluie', 'petrichor']
  };
  
  let associationsCreated = 0;
  let recettesProcessed = 0;
  
  for (const recette of recettes) {
    const category = (recette.category || '').toLowerCase();
    const ingredients = (recette.ingredients || '').toLowerCase();
    const name = (recette.name || '').toLowerCase();
    const searchText = `${category} ${name} ${ingredients}`;
    
    // Déterminer la gamme
    let gamme = null;
    for (const [g, keywords] of Object.entries(gammeKeywords)) {
      for (const kw of keywords) {
        if (searchText.includes(kw)) {
          gamme = g;
          break;
        }
      }
      if (gamme) break;
    }
    
    // Chercher les molécules correspondantes dans les ingrédients
    const moleculesToAdd = new Set();
    
    // Parcourir toutes les molécules et chercher des correspondances
    for (const [molName, molId] of Object.entries(moleculeMap)) {
      if (searchText.includes(molName)) {
        moleculesToAdd.add(molId);
      }
    }
    
    // Si pas assez de correspondances, ajouter des molécules aléatoires
    if (moleculesToAdd.size < 3) {
      const allMolIds = Object.values(moleculeMap);
      while (moleculesToAdd.size < 3 && allMolIds.length > 0) {
        const randomIdx = Math.floor(Math.random() * allMolIds.length);
        moleculesToAdd.add(allMolIds[randomIdx]);
      }
    }
    
    // Limiter à 5 molécules max par recette
    const uniqueMols = [...moleculesToAdd].slice(0, 5);
    
    // Insérer les associations
    for (const molId of uniqueMols) {
      try {
        await connection.execute(
          `INSERT INTO molecules_recettes (molecule_id, recette_id, proportion) VALUES (?, ?, 1.0)`,
          [molId, recette.id]
        );
        associationsCreated++;
      } catch (e) {
        console.error(`Erreur pour recette ${recette.id}, molecule ${molId}: ${e.message}`);
      }
    }
    
    if (uniqueMols.length > 0) {
      recettesProcessed++;
      console.log(`Recette "${recette.name}": ${uniqueMols.length} molécules ajoutées`);
    }
  }
  
  console.log(`\n=== RÉSUMÉ ===`);
  console.log(`Recettes traitées: ${recettesProcessed}`);
  console.log(`Associations créées: ${associationsCreated}`);
  
  await connection.end();
}

main().catch(console.error);
