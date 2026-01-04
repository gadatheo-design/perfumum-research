import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
  SELECT id, name, cas_number 
  FROM molecules 
  WHERE chemicalFormula IS NULL OR chemicalFormula = '' 
  ORDER BY name
`);

console.log(`Found ${rows.length} molecules without chemical formulas:\n`);
rows.forEach(row => {
  console.log(`ID: ${row.id}, Name: ${row.name}, CAS: ${row.cas_number || 'N/A'}`);
});

await connection.end();
