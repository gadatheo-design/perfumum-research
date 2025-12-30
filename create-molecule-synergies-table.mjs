import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🔧 Création de la table molecule_synergies...\n');

try {
  // Créer la table molecule_synergies
  await connection.query(`
    CREATE TABLE IF NOT EXISTS molecule_synergies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      molecule1_id INT NOT NULL,
      molecule2_id INT NOT NULL,
      type ENUM('potentialisation', 'stabilisation', 'transformation', 'masquage') NOT NULL,
      description TEXT NOT NULL,
      applications TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (molecule1_id) REFERENCES molecules(id),
      FOREIGN KEY (molecule2_id) REFERENCES molecules(id),
      UNIQUE INDEX unique_molecule_pair (molecule1_id, molecule2_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  
  console.log('✅ Table molecule_synergies créée avec succès !');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}

await connection.end();
