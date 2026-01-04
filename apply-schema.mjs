import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Modification de la table plant_molecules...');

// Vérifier si la table existe et a des données
const [rows] = await connection.execute('SELECT COUNT(*) as count FROM plant_molecules');
console.log(`Entrées existantes: ${rows[0].count}`);

// Ajouter les nouvelles colonnes si elles n'existent pas
const alterStatements = [
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS id INT AUTO_INCREMENT PRIMARY KEY FIRST`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS percentage_min DECIMAL(5,2) AFTER molecule_id`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS percentage_max DECIMAL(5,2) AFTER percentage_min`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS percentage_typical DECIMAL(5,2) AFTER percentage_max`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS role ENUM('majeur','secondaire','trace','variable') AFTER is_signature`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS variability_factor ENUM('stable','saisonnier','geographique','chemotype','extraction') AFTER role`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS source VARCHAR(255) AFTER variability_factor`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER notes`,
  `ALTER TABLE plant_molecules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at`
];

for (const sql of alterStatements) {
  try {
    await connection.execute(sql);
    console.log('✓ ' + sql.substring(0, 60) + '...');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column')) {
      console.log('⊘ Colonne existe déjà: ' + sql.substring(40, 80));
    } else {
      console.log('✗ Erreur: ' + err.message);
    }
  }
}

// Créer l'index unique si nécessaire
try {
  await connection.execute(`
    CREATE UNIQUE INDEX unique_plant_molecule 
    ON plant_molecules (plant_id, molecule_id)
  `);
  console.log('✓ Index unique créé');
} catch (err) {
  if (err.code === 'ER_DUP_KEYNAME') {
    console.log('⊘ Index existe déjà');
  } else {
    console.log('✗ Erreur index: ' + err.message);
  }
}

console.log('\nSchéma mis à jour avec succès!');
await connection.end();
