import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check all geographic_origins
const [origins] = await connection.execute('SELECT id, name, country, region, latitude, longitude FROM geographic_origins');
console.log('=== GEOGRAPHIC_ORIGINS (' + origins.length + ') ===');
origins.forEach(o => console.log(`  ${o.id}. ${o.name} (${o.country}, ${o.region}) - lat: ${o.latitude}, lng: ${o.longitude}`));

// Check all plants
const [plants] = await connection.execute('SELECT id, name, family FROM plants');
console.log('\n=== PLANTS (' + plants.length + ') ===');
plants.forEach(p => console.log(`  ${p.id}. ${p.name} (${p.family})`));

// Check all terroirs
const [terroirs] = await connection.execute('SELECT id, terroir_id, name, country, region, latitude, longitude FROM terroirs');
console.log('\n=== TERROIRS (' + terroirs.length + ') ===');
terroirs.forEach(t => console.log(`  ${t.id}. ${t.terroir_id}: ${t.name} (${t.country}) - lat: ${t.latitude}, lng: ${t.longitude}`));

// Check molecule_origins
const [molOrigins] = await connection.execute('SELECT mo.*, m.name as molecule_name, go.name as origin_name FROM molecule_origins mo JOIN molecules m ON mo.molecule_id = m.id JOIN geographic_origins go ON mo.origin_id = go.id LIMIT 20');
console.log('\n=== MOLECULE_ORIGINS (' + molOrigins.length + ') ===');
molOrigins.forEach(mo => console.log(`  ${mo.molecule_name} -> ${mo.origin_name}`));

await connection.end();
