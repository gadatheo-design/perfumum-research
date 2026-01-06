import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get TL recipes details
const [tlRecettes] = await connection.execute(`
  SELECT * FROM recettes 
  WHERE id >= 450001 AND id <= 450005
`);
console.log("=== RECETTES TL DÉTAILLÉES ===");
tlRecettes.forEach(r => {
  console.log(`\n${r.id}: ${r.name}`);
  console.log(`  Description: ${r.description?.substring(0, 200) || 'N/A'}...`);
  console.log(`  Formula: ${r.formula?.substring(0, 200) || 'N/A'}...`);
  console.log(`  Catégorie: ${r.category}`);
  console.log(`  Notes tête: ${r.notes_tete?.substring(0, 100) || 'N/A'}`);
  console.log(`  Notes coeur: ${r.notes_coeur?.substring(0, 100) || 'N/A'}`);
  console.log(`  Notes fond: ${r.notes_fond?.substring(0, 100) || 'N/A'}`);
});

// Describe final_recipes table
const [finalDesc] = await connection.execute(`DESCRIBE final_recipes`);
console.log("\n=== STRUCTURE TABLE FINAL_RECIPES ===");
finalDesc.forEach(c => console.log(`${c.Field}: ${c.Type}`));

// Get all terp_profiles
const [allProfiles] = await connection.execute(`
  SELECT profile_id, name, climatic_axis, formula, interpretation FROM terp_profiles ORDER BY id
`);
console.log("\n=== TOUS LES TERP PROFILES ===");
allProfiles.forEach(tp => {
  console.log(`${tp.profile_id}: ${tp.name} (${tp.climatic_axis})`);
});

// Check plants with missing climate data
const [plantsNoClimate] = await connection.execute(`
  SELECT id, name, latin_name, origin, latitude, longitude 
  FROM plants 
  WHERE latitude IS NULL OR longitude IS NULL
  LIMIT 20
`);
console.log("\n=== PLANTES SANS DONNÉES GPS ===");
plantsNoClimate.forEach(p => console.log(`${p.id}: ${p.name} (${p.latin_name}) - Origin: ${p.origin || 'N/A'}`));

await connection.end();
