import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Vérifier la structure de plant_molecules
const [columns] = await connection.execute('DESCRIBE plant_molecules');
console.log('=== STRUCTURE plant_molecules ===');
columns.forEach(c => console.log(`${c.Field}: ${c.Type}`));

// Récupérer les associations plant_molecules existantes
const [associations] = await connection.execute(`
  SELECT p.name as plant_name, m.name as molecule_name, pm.percentage_typical, pm.role
  FROM plant_molecules pm
  JOIN plants p ON pm.plant_id = p.id
  JOIN molecules m ON pm.molecule_id = m.id
  ORDER BY p.name, m.name
`);
console.log('\n=== ASSOCIATIONS PLANTES-MOLÉCULES EXISTANTES ===');
associations.forEach(a => console.log(`${a.plant_name} -> ${a.molecule_name} (${a.percentage_typical || 'N/A'}%, ${a.role || 'N/A'})`));

// Récupérer les restrictions IFRA existantes
const [ifra] = await connection.execute(`
  SELECT m.name as molecule_name, ir.ifra_amendment, ir.restriction_type
  FROM ifra_restrictions ir
  JOIN molecules m ON ir.molecule_id = m.id
  ORDER BY m.name
`);
console.log('\n=== RESTRICTIONS IFRA EXISTANTES ===');
ifra.forEach(i => console.log(`${i.molecule_name}: ${i.ifra_amendment} - ${i.restriction_type}`));

await connection.end();
