import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
  SELECT 
    COUNT(*) as total_molecules,
    SUM(CASE WHEN cas_number IS NULL OR cas_number = '' THEN 1 ELSE 0 END) as missing_cas,
    SUM(CASE WHEN iupac_name IS NULL OR iupac_name = '' THEN 1 ELSE 0 END) as missing_iupac,
    SUM(CASE WHEN chemical_class IS NULL THEN 1 ELSE 0 END) as missing_class,
    SUM(CASE WHEN molecularWeight IS NULL THEN 1 ELSE 0 END) as missing_weight,
    SUM(CASE WHEN boilingPoint IS NULL THEN 1 ELSE 0 END) as missing_boiling
  FROM molecules
`);

console.log('=== STATISTIQUES DES MOLÉCULES ===');
console.log(JSON.stringify(rows[0], null, 2));

// Récupérer quelques exemples de molécules sans CAS
const [examples] = await connection.execute(`
  SELECT id, name, cas_number, iupac_name, chemical_class, chemicalFormula
  FROM molecules 
  WHERE cas_number IS NULL OR cas_number = ''
  LIMIT 15
`);

console.log('\n=== EXEMPLES DE MOLÉCULES SANS CAS ===');
examples.forEach(m => console.log(`- ${m.name} (id: ${m.id}, formula: ${m.chemicalFormula || 'N/A'})`));

// Récupérer les molécules avec CAS pour voir le format
const [withCas] = await connection.execute(`
  SELECT id, name, cas_number, iupac_name, chemical_class
  FROM molecules 
  WHERE cas_number IS NOT NULL AND cas_number != ''
  LIMIT 10
`);

console.log('\n=== EXEMPLES DE MOLÉCULES AVEC CAS ===');
withCas.forEach(m => console.log(`- ${m.name} (CAS: ${m.cas_number}, IUPAC: ${m.iupac_name || 'N/A'})`));

await connection.end();
