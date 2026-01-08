import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  const [rows] = await connection.execute(`
    SELECT 
      COUNT(*) as total_molecules,
      SUM(CASE WHEN cas_number IS NULL OR cas_number = '' THEN 1 ELSE 0 END) as sans_cas,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as avec_cas,
      SUM(CASE WHEN iupac_name IS NULL OR iupac_name = '' THEN 1 ELSE 0 END) as sans_iupac,
      SUM(CASE WHEN chemical_class IS NULL OR chemical_class = '' THEN 1 ELSE 0 END) as sans_classe
    FROM molecules
  `);
  
  console.log('=== STATISTIQUES DES MOLÉCULES ===');
  console.log(JSON.stringify(rows[0], null, 2));
  
  // Récupérer quelques exemples de molécules sans CAS
  const [samples] = await connection.execute(`
    SELECT id, name, iupac_name, cas_number, chemical_class
    FROM molecules 
    WHERE cas_number IS NULL OR cas_number = ''
    LIMIT 10
  `);
  
  console.log('\n=== EXEMPLES DE MOLÉCULES SANS CAS ===');
  samples.forEach(m => {
    console.log(`- ${m.name} (ID: ${m.id})`);
  });
  
  await connection.end();
}

main().catch(console.error);
