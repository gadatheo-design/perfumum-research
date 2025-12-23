import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // 1. Récupérer les molécules avec leurs noms et IDs
  const [molecules] = await connection.execute(`
    SELECT id, name FROM molecules
  `);
  
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
  
  // 3. Définir les molécules par gamme
  const gammesMolecules = {
    'volcanique': ['soufre', 'cendre', 'lave', 'basalte', 'obsidienne', 'magma', 'fumée', 'pyroclaste'],
    'glaciaire': ['menthol', 'eucalyptol', 'camphre', 'glace', 'neige', 'givre', 'cristal', 'aldéhyde'],
    'bio-lab': ['myrcène', 'limonène', 'pinène', 'linalol', 'caryophyllène', 'terpinolène', 'humulène'],
    'cbd': ['myrcène', 'limonène', 'pinène', 'linalol', 'caryophyllène', 'terpinolène', 'humulène'],
    'pétrichor': ['géosmine', 'argile', 'terre', 'ozone', 'minéral', 'humus', 'mousse']
  };
  
  let associationsCreated = 0;
  
  for (const recette of recettes) {
    const category = (recette.category || '').toLowerCase();
    const ingredients = (recette.ingredients || '').toLowerCase();
    const name = (recette.name || '').toLowerCase();
    
    // Déterminer la gamme
    let gamme = null;
    if (category.includes('volcanique') || name.includes('volcanique') || name.includes('lave') || name.includes('magma')) {
      gamme = 'volcanique';
    } else if (category.includes('glaciaire') || name.includes('glaciaire') || name.includes('glace') || name.includes('givre')) {
      gamme = 'glaciaire';
    } else if (category.includes('bio-lab') || category.includes('cbd') || name.includes('cbd') || name.includes('terpène')) {
      gamme = 'bio-lab';
    } else if (category.includes('pétrichor') || name.includes('pétrichor') || name.includes('terre') || name.includes('argile')) {
      gamme = 'pétrichor';
    }
    
    if (!gamme) continue;
    
    // Chercher les molécules correspondantes dans les ingrédients
    const moleculesToAdd = [];
    
    // Parcourir toutes les molécules et chercher des correspondances
    for (const [molName, molId] of Object.entries(moleculeMap)) {
      if (ingredients.includes(molName) || name.includes(molName)) {
        moleculesToAdd.push(molId);
      }
    }
    
    // Si pas de correspondance directe, ajouter des molécules par défaut de la gamme
    if (moleculesToAdd.length === 0) {
      const defaultMols = gammesMolecules[gamme] || [];
      for (const molKeyword of defaultMols) {
        for (const [molName, molId] of Object.entries(moleculeMap)) {
          if (molName.includes(molKeyword)) {
            moleculesToAdd.push(molId);
            break;
          }
        }
      }
    }
    
    // Limiter à 5 molécules max par recette
    const uniqueMols = [...new Set(moleculesToAdd)].slice(0, 5);
    
    // Insérer les associations
    for (const molId of uniqueMols) {
      try {
        await connection.execute(
          `INSERT INTO molecules_recettes (recette_id, molecule_id, proportion, role) VALUES (?, ?, '1.0', 'principal')`,
          [recette.id, molId]
        );
        associationsCreated++;
      } catch (e) {
        // Ignorer les doublons
      }
    }
    
    if (uniqueMols.length > 0) {
      console.log(`Recette "${recette.name}" (${gamme}): ${uniqueMols.length} molécules ajoutées`);
    }
  }
  
  console.log(`\nTotal: ${associationsCreated} associations créées`);
  
  await connection.end();
}

main().catch(console.error);
