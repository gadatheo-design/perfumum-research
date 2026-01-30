import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
  SELECT 
    (SELECT COUNT(*) FROM plants) as plants_count,
    (SELECT COUNT(*) FROM plant_molecules) as plant_molecules_count,
    (SELECT COUNT(*) FROM raw_materials) as raw_materials_count,
    (SELECT COUNT(*) FROM molecules) as molecules_count,
    (SELECT COUNT(*) FROM terroirs) as terroirs_count
`);

console.log('Données existantes:');
console.log(JSON.stringify(rows[0], null, 2));

// Voir quelques plantes existantes
const [plants] = await connection.execute('SELECT id, name, latin_name, category FROM plants LIMIT 10');
console.log('\nPlantes existantes:');
plants.forEach(p => console.log(`  - ${p.id}: ${p.name} (${p.latin_name || 'N/A'}) [${p.category}]`));

// Voir quelques molécules avec sources botaniques
const [mols] = await connection.execute('SELECT id, name, botanicalSources FROM molecules WHERE botanicalSources IS NOT NULL AND botanicalSources != "" LIMIT 15');
console.log('\nMolécules avec sources botaniques:');
mols.forEach(m => console.log(`  - ${m.id}: ${m.name} -> ${m.botanicalSources}`));

// Voir les matières premières existantes
const [rms] = await connection.execute('SELECT id, material_id, name, category FROM raw_materials LIMIT 10');
console.log('\nMatières premières existantes:');
rms.forEach(r => console.log(`  - ${r.material_id}: ${r.name} [${r.category}]`));

await connection.end();
