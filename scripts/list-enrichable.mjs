import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Molécules sans CAS qui ont une formule (plus faciles à enrichir)
const [withFormula] = await connection.execute(`
  SELECT id, name, chemicalFormula, iupac_name
  FROM molecules 
  WHERE (cas_number IS NULL OR cas_number = '')
    AND chemicalFormula IS NOT NULL AND chemicalFormula != ''
    AND chemicalFormula NOT LIKE '%Complex%'
    AND chemicalFormula NOT LIKE '%Mélange%'
  ORDER BY name
  LIMIT 100
`);

console.log('=== MOLÉCULES AVEC FORMULE MAIS SANS CAS (enrichissables) ===');
console.log('Nombre: ' + withFormula.length);
withFormula.forEach(m => console.log(m.id + '|' + m.name + '|' + m.chemicalFormula + '|' + (m.iupac_name || '')));

await connection.end();
