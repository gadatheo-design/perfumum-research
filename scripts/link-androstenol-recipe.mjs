import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function linkAndrostenolToRecipe() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Récupérer l'ID de l'Androsténol
    const [molecules] = await connection.execute(
      "SELECT id, name FROM molecules WHERE name LIKE '%Androst%nol%' OR name LIKE '%androst%nol%'"
    );
    console.log('Molécules trouvées:', molecules);
    
    // Récupérer l'ID de la recette Pheromona Truffle
    const [recettes] = await connection.execute(
      "SELECT id, name FROM recettes WHERE name LIKE '%Pheromona%' OR name LIKE '%Truffle%'"
    );
    console.log('Recettes trouvées:', recettes);
    
    if (molecules.length === 0) {
      console.log('Androsténol non trouvé, recherche par ID...');
      const [molById] = await connection.execute(
        "SELECT id, name FROM molecules WHERE id = 240001"
      );
      console.log('Molécule ID 240001:', molById);
      if (molById.length > 0) {
        molecules.push(molById[0]);
      }
    }
    
    if (recettes.length === 0) {
      console.log('Recette non trouvée, recherche par ID...');
      const [recById] = await connection.execute(
        "SELECT id, name FROM recettes WHERE id = 180001"
      );
      console.log('Recette ID 180001:', recById);
      if (recById.length > 0) {
        recettes.push(recById[0]);
      }
    }
    
    if (molecules.length > 0 && recettes.length > 0) {
      const moleculeId = molecules[0].id;
      const recetteId = recettes[0].id;
      
      // Vérifier si la liaison existe déjà
      const [existing] = await connection.execute(
        "SELECT * FROM molecules_recettes WHERE molecule_id = ? AND recette_id = ?",
        [moleculeId, recetteId]
      );
      
      if (existing.length > 0) {
        console.log('Liaison déjà existante');
      } else {
        // Créer la liaison
        await connection.execute(
          "INSERT INTO molecules_recettes (molecule_id, recette_id, proportion, notes) VALUES (?, ?, ?, ?)",
          [moleculeId, recetteId, '0.0005%', 'Phéromone stéroïdienne - dose infinitésimale pour effet subliminal']
        );
        console.log(`✅ Liaison créée: Androsténol (${moleculeId}) -> Pheromona Truffle (${recetteId})`);
      }
    } else {
      console.log('Impossible de créer la liaison - molécule ou recette non trouvée');
    }
    
  } finally {
    await connection.end();
  }
}

linkAndrostenolToRecipe().catch(console.error);
