import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log("=== PLANTES AVEC DONNÉES DE CONSERVATION INCOMPLÈTES ===\n");
  
  // Résines avec données manquantes
  const [resins] = await connection.execute(`
    SELECT id, name, latin_name, category, conservation_status, cites_appendix, 
           conservation_notes, last_assessment_year
    FROM plants 
    WHERE category = 'resine' 
      AND (conservation_status IS NULL 
           OR cites_appendix IS NULL 
           OR conservation_notes IS NULL 
           OR last_assessment_year IS NULL
           OR conservation_status IN ('NE', 'DD'))
    ORDER BY name
  `);
  
  console.log(`\n=== RÉSINES À COMPLÉTER (${resins.length}) ===`);
  for (const row of resins) {
    console.log(`\n${row.name} (${row.latin_name || 'N/A'})`);
    console.log(`  IUCN: ${row.conservation_status || 'MANQUANT'} | CITES: ${row.cites_appendix || 'MANQUANT'} | Année: ${row.last_assessment_year || 'MANQUANT'}`);
    if (!row.conservation_notes) console.log(`  ⚠️ Notes de conservation manquantes`);
  }
  
  // Bois précieux avec données manquantes
  const [woods] = await connection.execute(`
    SELECT id, name, latin_name, category, conservation_status, cites_appendix, 
           conservation_notes, last_assessment_year
    FROM plants 
    WHERE category = 'bois' 
      AND (conservation_status IS NULL 
           OR cites_appendix IS NULL 
           OR conservation_notes IS NULL 
           OR last_assessment_year IS NULL
           OR conservation_status IN ('NE', 'DD'))
    ORDER BY name
  `);
  
  console.log(`\n\n=== BOIS À COMPLÉTER (${woods.length}) ===`);
  for (const row of woods) {
    console.log(`\n${row.name} (${row.latin_name || 'N/A'})`);
    console.log(`  IUCN: ${row.conservation_status || 'MANQUANT'} | CITES: ${row.cites_appendix || 'MANQUANT'} | Année: ${row.last_assessment_year || 'MANQUANT'}`);
  }
  
  // Espèces menacées (CR, EN, VU) toutes catégories
  const [threatened] = await connection.execute(`
    SELECT id, name, latin_name, category, conservation_status, cites_appendix, 
           conservation_notes, last_assessment_year
    FROM plants 
    WHERE conservation_status IN ('CR', 'EN', 'VU')
    ORDER BY 
      CASE conservation_status 
        WHEN 'CR' THEN 1 
        WHEN 'EN' THEN 2 
        WHEN 'VU' THEN 3 
      END,
      name
  `);
  
  console.log(`\n\n=== ESPÈCES MENACÉES (${threatened.length}) ===`);
  for (const row of threatened) {
    console.log(`[${row.conservation_status}] ${row.name} (${row.latin_name || 'N/A'}) - ${row.category}`);
  }
  
  await connection.end();
}

main().catch(console.error);
