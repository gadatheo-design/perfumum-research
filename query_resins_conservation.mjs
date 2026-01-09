import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log("=== RÉSINES - DONNÉES DE CONSERVATION ===\n");
  
  const [rows] = await connection.execute(`
    SELECT id, name, latin_name, conservation_status, cites_appendix, 
           conservation_notes, last_assessment_year, sustainable_alternatives, threat_factors
    FROM plants 
    WHERE category = 'resine' 
    ORDER BY name
  `);
  
  for (const row of rows) {
    console.log(`\n--- ${row.name} (${row.latin_name || 'N/A'}) ---`);
    console.log(`  ID: ${row.id}`);
    console.log(`  Statut IUCN: ${row.conservation_status || 'NON RENSEIGNÉ'}`);
    console.log(`  CITES: ${row.cites_appendix || 'NON RENSEIGNÉ'}`);
    console.log(`  Dernière évaluation: ${row.last_assessment_year || 'NON RENSEIGNÉ'}`);
    console.log(`  Notes conservation: ${row.conservation_notes ? row.conservation_notes.substring(0, 100) + '...' : 'NON RENSEIGNÉ'}`);
    console.log(`  Alternatives: ${row.sustainable_alternatives ? row.sustainable_alternatives.substring(0, 80) + '...' : 'NON RENSEIGNÉ'}`);
  }
  
  console.log("\n\n=== RÉSUMÉ ===");
  const [stats] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN conservation_status IS NOT NULL THEN 1 ELSE 0 END) as with_iucn,
      SUM(CASE WHEN cites_appendix IS NOT NULL THEN 1 ELSE 0 END) as with_cites,
      SUM(CASE WHEN conservation_status IN ('CR', 'EN', 'VU') THEN 1 ELSE 0 END) as threatened
    FROM plants 
    WHERE category = 'resine'
  `);
  
  console.log(`Total résines: ${stats[0].total}`);
  console.log(`Avec statut IUCN: ${stats[0].with_iucn}`);
  console.log(`Avec info CITES: ${stats[0].with_cites}`);
  console.log(`Menacées (CR/EN/VU): ${stats[0].threatened}`);
  
  await connection.end();
}

main().catch(console.error);
