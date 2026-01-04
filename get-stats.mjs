import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
SELECT 
  (SELECT COUNT(*) FROM molecules) as molecules_count,
  (SELECT COUNT(*) FROM recettes) as recettes_count,
  (SELECT COUNT(*) FROM plants) as plants_count,
  (SELECT COUNT(*) FROM synergies) as synergies_count,
  (SELECT COUNT(*) FROM accords) as accords_count,
  (SELECT COUNT(*) FROM glossary) as glossary_count,
  (SELECT COUNT(*) FROM terp_profiles) as terp_profiles_count,
  (SELECT COUNT(*) FROM final_recipes) as final_recipes_count,
  (SELECT COUNT(*) FROM botanical_states) as botanical_states_count,
  (SELECT COUNT(*) FROM terroirs) as terroirs_count,
  (SELECT COUNT(*) FROM leaf_economies) as leaf_economies_count
`);

console.log(JSON.stringify(rows[0], null, 2));
await connection.end();
