import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
  SELECT id, name, iupac_name, cas_number, chemicalFormula, family, olfactiveProfile 
  FROM molecules 
  WHERE name LIKE '%anethole%' OR name LIKE '%anéthole%' 
     OR name LIKE '%methyleugenol%' OR name LIKE '%méthyleugénol%' 
     OR name LIKE '%eugenol%'
`);

console.log('Molécules trouvées:', JSON.stringify(rows, null, 2));

await connection.end();
