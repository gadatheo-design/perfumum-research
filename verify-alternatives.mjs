import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Compter les alternatives
const [count] = await conn.query(`SELECT COUNT(*) as total FROM sustainable_alternatives`);
console.log(`Total alternatives durables: ${count[0].total}`);

// Lister par espèce menacée
const [bySpecies] = await conn.query(`
  SELECT threatened_plant_name, COUNT(*) as alternatives_count 
  FROM sustainable_alternatives 
  GROUP BY threatened_plant_name 
  ORDER BY alternatives_count DESC
`);
console.log('\nAlternatives par espèce menacée:');
bySpecies.forEach(s => console.log(`  - ${s.threatened_plant_name}: ${s.alternatives_count} alternatives`));

// Lister par type d'alternative
const [byType] = await conn.query(`
  SELECT alternative_type, COUNT(*) as count 
  FROM sustainable_alternatives 
  GROUP BY alternative_type 
  ORDER BY count DESC
`);
console.log('\nPar type d\'alternative:');
byType.forEach(t => console.log(`  - ${t.alternative_type}: ${t.count}`));

// Lister par similarité olfactive
const [bySimilarity] = await conn.query(`
  SELECT olfactive_similarity, COUNT(*) as count 
  FROM sustainable_alternatives 
  GROUP BY olfactive_similarity 
  ORDER BY count DESC
`);
console.log('\nPar similarité olfactive:');
bySimilarity.forEach(s => console.log(`  - ${s.olfactive_similarity}: ${s.count}`));

await conn.end();
console.log('\n✅ Vérification terminée!');
