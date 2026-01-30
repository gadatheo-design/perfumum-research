import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check terroirs
const [terroirs] = await connection.execute('SELECT id, terroir_id, name, country, region, latitude, longitude FROM terroirs');
console.log('=== TERROIRS ===');
console.log(JSON.stringify(terroirs, null, 2));

// Check plants
const [plants] = await connection.execute('SELECT id, name, scientific_name, family FROM plants LIMIT 20');
console.log('\n=== PLANTS ===');
console.log(JSON.stringify(plants, null, 2));

// Check plant_terroirs
const [plantTerroirs] = await connection.execute('SELECT * FROM plant_terroirs LIMIT 20');
console.log('\n=== PLANT_TERROIRS ===');
console.log(JSON.stringify(plantTerroirs, null, 2));

// Check geographic_origins
const [origins] = await connection.execute('SELECT id, name, country, region, latitude, longitude FROM geographic_origins LIMIT 20');
console.log('\n=== GEOGRAPHIC_ORIGINS ===');
console.log(JSON.stringify(origins, null, 2));

await connection.end();
