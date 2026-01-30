import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Describe recettes table
const [recettesDesc] = await connection.execute(`DESCRIBE recettes`);
console.log("=== STRUCTURE TABLE RECETTES ===");
recettesDesc.forEach(c => console.log(`${c.Field}: ${c.Type}`));

// Search for TL in recettes
const [tlRecettes] = await connection.execute(`
  SELECT id, name, description FROM recettes 
  WHERE name LIKE '%TL%' OR name LIKE '%Tagetes%' OR description LIKE '%Tagetes%' OR description LIKE '%lucida%'
  LIMIT 20
`);
console.log("\n=== RECETTES TL ===");
tlRecettes.forEach(r => console.log(`${r.id}: ${r.name}`));

// Search for TL in terp_profiles
const [tlProfiles] = await connection.execute(`
  SELECT id, profile_id, name, collection, climatic_axis FROM terp_profiles 
  WHERE name LIKE '%TL%' OR name LIKE '%Tagetes%' OR name LIKE '%lucida%'
`);
console.log("\n=== TERP PROFILES TL ===");
tlProfiles.forEach(tp => console.log(`${tp.profile_id}: ${tp.name}`));

// Search for TL in final_recipes
const [tlFinal] = await connection.execute(`
  SELECT id, recipe_id, name, type, climatic_axis FROM final_recipes 
  WHERE name LIKE '%TL%' OR name LIKE '%Tagetes%' OR name LIKE '%lucida%'
`);
console.log("\n=== FINAL RECIPES TL ===");
tlFinal.forEach(fr => console.log(`${fr.recipe_id}: ${fr.name}`));

// Check all terp_profiles
const [allProfiles] = await connection.execute(`
  SELECT profile_id, name, climatic_axis FROM terp_profiles ORDER BY id
`);
console.log("\n=== TOUS LES TERP PROFILES ===");
allProfiles.forEach(tp => console.log(`${tp.profile_id}: ${tp.name} (${tp.climatic_axis})`));

await connection.end();
