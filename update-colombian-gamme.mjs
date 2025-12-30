import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🔧 Mise à jour de la gamme des recettes colombiennes...\n');

const colombianRecipeNames = [
  'CAFÉ DE LOS ANDES',
  'SELVA SAGRADA',
  'FRUTAS ANDINAS',
  'CHAMÁN NOCTURNO',
  'VERDE MEDICINA',
  'BOSQUE DE CEDRO',
  'DULCE TRÓPICO',
  'OFRENDA ANCESTRAL'
];

try {
  for (const name of colombianRecipeNames) {
    const [result] = await connection.query(
      'UPDATE recettes SET gamme = ? WHERE name = ?',
      ['Colombie', name]
    );
    console.log(`✅ ${name} - gamme mise à jour`);
  }
  
  console.log(`\n✨ ${colombianRecipeNames.length} recettes mises à jour avec succès !`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}

await connection.end();
