import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log('=== STATISTIQUES DES MOLÉCULES ===\n');
  
  // Compter toutes les molécules et leurs statuts
  const [stats] = await connection.execute(`
    SELECT 
      COUNT(*) as total_molecules,
      SUM(CASE WHEN cas_number IS NULL OR cas_number = '' THEN 1 ELSE 0 END) as sans_cas,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as avec_cas,
      SUM(CASE WHEN iupac_name IS NULL OR iupac_name = '' THEN 1 ELSE 0 END) as sans_iupac,
      SUM(CASE WHEN chemical_class IS NULL OR chemical_class = '' THEN 1 ELSE 0 END) as sans_classe
    FROM molecules
  `);
  
  const s = stats[0];
  console.log(`Total molécules: ${s.total_molecules}`);
  console.log(`Sans numéro CAS: ${s.sans_cas} (${((Number(s.sans_cas)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  console.log(`Avec numéro CAS: ${s.avec_cas} (${((Number(s.avec_cas)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  console.log(`Sans nom IUPAC: ${s.sans_iupac} (${((Number(s.sans_iupac)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  console.log(`Sans classe chimique: ${s.sans_classe} (${((Number(s.sans_classe)/Number(s.total_molecules))*100).toFixed(1)}%)`);
  
  // Récupérer toutes les molécules sans CAS
  const [moleculesSansCas] = await connection.execute(`
    SELECT id, name, iupac_name, cas_number, chemical_class, formula
    FROM molecules 
    WHERE cas_number IS NULL OR cas_number = ''
    ORDER BY name
  `);
  
  console.log(`\n=== EXEMPLES DE MOLÉCULES SANS CAS (15 premières) ===\n`);
  moleculesSansCas.slice(0, 15).forEach(m => {
    console.log(`- ${m.name} (ID: ${m.id})`);
  });
  
  // Exporter la liste complète pour le script d'enrichissement
  const listeSansCas = moleculesSansCas.map(m => ({
    id: m.id,
    name: m.name,
    iupacName: m.iupac_name || null,
    casNumber: m.cas_number || null,
    chemicalClass: m.chemical_class || null,
    formula: m.formula || null
  }));
  
  fs.writeFileSync('./scripts/molecules-sans-cas.json', JSON.stringify(listeSansCas, null, 2));
  console.log(`\nListe exportée vers scripts/molecules-sans-cas.json (${listeSansCas.length} molécules)`);
  
  await connection.end();
  process.exit(0);
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
