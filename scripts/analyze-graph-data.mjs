import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Statistiques
const [stats] = await connection.execute(`
  SELECT 
    (SELECT COUNT(*) FROM terroirs) as terroirs,
    (SELECT COUNT(*) FROM plants) as plants,
    (SELECT COUNT(*) FROM molecules) as molecules,
    (SELECT COUNT(*) FROM plant_molecules) as plant_molecule_links,
    (SELECT COUNT(*) FROM plant_terroirs) as plant_terroir_links,
    (SELECT COUNT(*) FROM terroir_specialties) as terroir_specialties
`);

console.log('=== STATISTIQUES ===');
console.log(JSON.stringify(stats[0], null, 2));

// Terroirs avec leurs plantes via plant_terroirs
const [terroirs] = await connection.execute(`
  SELECT t.id, t.name, t.country, COUNT(pt.plant_id) as plant_count
  FROM terroirs t
  LEFT JOIN plant_terroirs pt ON pt.terroir_id = t.id
  GROUP BY t.id
  ORDER BY plant_count DESC
  LIMIT 20
`);

console.log('\\n=== TERROIRS (top 20) ===');
terroirs.forEach(t => console.log(`${t.id}|${t.name}|${t.country}|${t.plant_count} plantes`));

// Plantes avec leurs molécules
const [plants] = await connection.execute(`
  SELECT p.id, p.name, COUNT(pm.molecule_id) as molecule_count
  FROM plants p
  LEFT JOIN plant_molecules pm ON pm.plant_id = p.id
  GROUP BY p.id
  ORDER BY molecule_count DESC
  LIMIT 20
`);

console.log('\\n=== PLANTES (top 20) ===');
plants.forEach(p => console.log(`${p.id}|${p.name}|${p.molecule_count} molécules`));

// Liens plante-molécule
const [links] = await connection.execute(`
  SELECT pm.plant_id, p.name as plant_name, pm.molecule_id, m.name as molecule_name
  FROM plant_molecules pm
  JOIN plants p ON p.id = pm.plant_id
  JOIN molecules m ON m.id = pm.molecule_id
  LIMIT 30
`);

console.log('\\n=== LIENS PLANTE-MOLECULE (30 premiers) ===');
links.forEach(l => console.log(`${l.plant_name} -> ${l.molecule_name}`));

// Liens terroir-plante
const [terroirPlants] = await connection.execute(`
  SELECT pt.terroir_id, t.name as terroir_name, pt.plant_id, p.name as plant_name
  FROM plant_terroirs pt
  JOIN terroirs t ON t.id = pt.terroir_id
  JOIN plants p ON p.id = pt.plant_id
  LIMIT 30
`);

console.log('\\n=== LIENS TERROIR-PLANTE (30 premiers) ===');
terroirPlants.forEach(l => console.log(`${l.terroir_name} -> ${l.plant_name}`));

await connection.end();
