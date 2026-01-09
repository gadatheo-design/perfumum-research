import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Statistiques globales
const [stats] = await connection.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as cas_filled,
    SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as iupac_filled,
    SUM(CASE WHEN chemical_class IS NOT NULL THEN 1 ELSE 0 END) as class_filled,
    SUM(CASE WHEN chemicalFormula IS NOT NULL AND chemicalFormula != '' THEN 1 ELSE 0 END) as formula_filled
  FROM molecules
`);

console.log('=== STATISTIQUES DES MOLECULES ===');
console.log(JSON.stringify(stats[0], null, 2));

const total = Number(stats[0].total);
console.log('\nTotal molecules: ' + total);
console.log('CAS rempli: ' + stats[0].cas_filled + ' (' + Math.round(Number(stats[0].cas_filled)/total*100) + '%)');
console.log('IUPAC rempli: ' + stats[0].iupac_filled + ' (' + Math.round(Number(stats[0].iupac_filled)/total*100) + '%)');
console.log('Classe chimique: ' + stats[0].class_filled + ' (' + Math.round(Number(stats[0].class_filled)/total*100) + '%)');
console.log('Formule: ' + stats[0].formula_filled + ' (' + Math.round(Number(stats[0].formula_filled)/total*100) + '%)');

// Molecules sans CAS
const [noCas] = await connection.execute(`
  SELECT name, chemicalFormula, family
  FROM molecules 
  WHERE cas_number IS NULL OR cas_number = ''
  ORDER BY name
  LIMIT 50
`);

console.log('\n=== 50 PREMIERES MOLECULES SANS CAS ===');
noCas.forEach(m => console.log('- ' + m.name + ' (' + (m.chemicalFormula || 'pas de formule') + ')'));

await connection.end();
