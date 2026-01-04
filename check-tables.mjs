import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [tables] = await connection.query(`
  SELECT TABLE_NAME 
  FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME IN ('raw_materials', 'raw_material_molecules', 'molecule_plant_sources', 'terroir_specialties')
`);

console.log('Tables trouvées:', tables.map(t => t.TABLE_NAME));

await connection.end();
