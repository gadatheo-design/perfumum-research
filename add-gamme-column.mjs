import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🔧 Ajout de la colonne gamme à la table recettes...\n');

try {
  await connection.query(`
    ALTER TABLE recettes 
    ADD COLUMN gamme VARCHAR(100) AFTER parent_recette_id;
  `);
  
  console.log('✅ Colonne gamme ajoutée avec succès !');
  
} catch (error) {
  if (error.code === 'ER_DUP_FIELDNAME') {
    console.log('ℹ️  La colonne gamme existe déjà');
  } else {
    console.error('❌ Erreur:', error.message);
  }
}

await connection.end();
