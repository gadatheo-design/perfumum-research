import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = createPool(process.env.DATABASE_URL);

async function checkData() {
  const conn = await pool.getConnection();
  try {
    // Vérifier les plantes
    const [plants] = await conn.query('SELECT id, name FROM plants WHERE name IN ("Rose de Damas", "Jasmin grandiflorum", "Vétiver")');
    console.log('Plantes trouvées:', plants);
    
    // Vérifier les associations molécules-plantes
    const [associations] = await conn.query(`
      SELECT mps.*, p.name as plant_name, m.name as molecule_name 
      FROM molecule_plant_sources mps 
      LEFT JOIN plants p ON mps.plant_id = p.id 
      LEFT JOIN molecules m ON mps.molecule_id = m.id
      LIMIT 20
    `);
    console.log('Associations molécules-plantes:', associations.length);
    console.log(associations.slice(0, 5));
    
    // Vérifier les restrictions IFRA
    const [restrictions] = await conn.query('SELECT COUNT(*) as count FROM ifra_restrictions');
    console.log('Nombre de restrictions IFRA:', restrictions[0].count);
    
    // Vérifier les molécules avec restrictions
    const [restrictedMols] = await conn.query(`
      SELECT DISTINCT m.id, m.name, ir.restriction_type 
      FROM molecules m 
      JOIN ifra_restrictions ir ON m.id = ir.molecule_id 
      LIMIT 10
    `);
    console.log('Molécules avec restrictions:', restrictedMols);
    
  } finally {
    conn.release();
    await pool.end();
  }
}

checkData().catch(console.error);
