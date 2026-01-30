import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check plants with climate data
const [plants] = await connection.execute(`
  SELECT id, name, latin_name, origin, latitude, longitude, climatic_axis, category 
  FROM plants 
  ORDER BY id 
  LIMIT 30
`);

console.log("=== PLANTES EXISTANTES ===");
plants.forEach(p => {
  console.log(`${p.id}. ${p.name} (${p.latin_name || 'N/A'}) - Lat: ${p.latitude || 'N/A'}, Lng: ${p.longitude || 'N/A'}, Axe: ${p.climatic_axis || 'N/A'}`);
});

// Count plants with/without GPS data
const [stats] = await connection.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN latitude IS NOT NULL THEN 1 ELSE 0 END) as with_gps,
    SUM(CASE WHEN latitude IS NULL THEN 1 ELSE 0 END) as without_gps
  FROM plants
`);

console.log("\n=== STATISTIQUES GPS ===");
console.log(`Total: ${stats[0].total}, Avec GPS: ${stats[0].with_gps}, Sans GPS: ${stats[0].without_gps}`);

// Check TerpProfiles
const [terpProfiles] = await connection.execute(`
  SELECT id, profile_id, name, collection, type, climatic_axis
  FROM terp_profiles
  ORDER BY id
  LIMIT 20
`);

console.log("\n=== TERP PROFILES ===");
terpProfiles.forEach(tp => {
  console.log(`${tp.profile_id}: ${tp.name} - Axe: ${tp.climatic_axis || 'N/A'}`);
});

await connection.end();
