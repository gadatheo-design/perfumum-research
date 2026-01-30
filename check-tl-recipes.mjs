import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Search for Tagetes lucida in plants
const [tlPlants] = await connection.execute(`
  SELECT * FROM plants 
  WHERE name LIKE '%Tagetes%' OR latin_name LIKE '%Tagetes%' OR name LIKE '%lucida%'
`);
console.log("=== PLANTES TAGETES LUCIDA ===");
console.log(tlPlants.length > 0 ? tlPlants : "Aucune plante Tagetes lucida trouvée");

// Search for TL in recettes
const [tlRecettes] = await connection.execute(`
  SELECT id, name, type, description FROM recettes 
  WHERE name LIKE '%TL%' OR name LIKE '%Tagetes%' OR description LIKE '%Tagetes%' OR description LIKE '%lucida%'
  LIMIT 20
`);
console.log("\n=== RECETTES TL ===");
console.log(tlRecettes.length > 0 ? tlRecettes : "Aucune recette TL trouvée");

// Search for TL in terp_profiles
const [tlProfiles] = await connection.execute(`
  SELECT id, profile_id, name, collection, climatic_axis FROM terp_profiles 
  WHERE name LIKE '%TL%' OR name LIKE '%Tagetes%' OR name LIKE '%lucida%'
`);
console.log("\n=== TERP PROFILES TL ===");
console.log(tlProfiles.length > 0 ? tlProfiles : "Aucun TerpProfile TL trouvé");

// Search for TL in final_recipes
const [tlFinal] = await connection.execute(`
  SELECT id, recipe_id, name, type, climatic_axis FROM final_recipes 
  WHERE name LIKE '%TL%' OR name LIKE '%Tagetes%' OR name LIKE '%lucida%'
`);
console.log("\n=== FINAL RECIPES TL ===");
console.log(tlFinal.length > 0 ? tlFinal : "Aucune recette finale TL trouvée");

// List all tables
const [tables] = await connection.execute(`SHOW TABLES`);
console.log("\n=== TABLES DISPONIBLES ===");
tables.forEach(t => console.log(Object.values(t)[0]));

await connection.end();
