import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const [rows] = await conn.execute('SELECT axis_code, name, meta_axis, color FROM thematic_axes ORDER BY axis_code');
  console.log("Axes thématiques existants:");
  rows.forEach(r => console.log(`  ${r.axis_code}: ${r.name} (${r.meta_axis}) - ${r.color}`));
  
  // Vérifier les références v3
  const [refs] = await conn.execute('SELECT COUNT(*) as count FROM v3_references');
  console.log(`\nNombre de références v3: ${refs[0].count}`);
  
  // Vérifier les références par axe
  const [byAxis] = await conn.execute(`
    SELECT axis_primary_code, COUNT(*) as count 
    FROM v3_references 
    WHERE axis_primary_code IS NOT NULL 
    GROUP BY axis_primary_code 
    ORDER BY axis_primary_code
  `);
  console.log("\nRéférences par axe:");
  byAxis.forEach(r => console.log(`  ${r.axis_primary_code}: ${r.count} références`));
  
  await conn.end();
}
main().catch(console.error);
