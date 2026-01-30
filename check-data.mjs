import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check terroirs
const [terroirs] = await connection.execute('SELECT * FROM terroirs');
console.log('=== TERROIRS (' + terroirs.length + ') ===');
console.log(JSON.stringify(terroirs.slice(0, 3), null, 2));

// Check plants columns
const [plantCols] = await connection.execute('DESCRIBE plants');
console.log('\n=== PLANTS COLUMNS ===');
console.log(plantCols.map(c => c.Field).join(', '));

// Check plants
const [plants] = await connection.execute('SELECT id, name, family, genus, species FROM plants LIMIT 10');
console.log('\n=== PLANTS (' + plants.length + ') ===');
console.log(JSON.stringify(plants, null, 2));

// Check plant_terroirs
const [plantTerroirs] = await connection.execute('SELECT * FROM plant_terroirs LIMIT 10');
console.log('\n=== PLANT_TERROIRS (' + plantTerroirs.length + ') ===');
console.log(JSON.stringify(plantTerroirs, null, 2));

// Check geographic_origins
const [origins] = await connection.execute('SELECT * FROM geographic_origins LIMIT 10');
console.log('\n=== GEOGRAPHIC_ORIGINS (' + origins.length + ') ===');
console.log(JSON.stringify(origins.slice(0, 3), null, 2));

await connection.end();
