import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  // Statistiques générales
  const [stats] = await connection.query(`
    SELECT 
      (SELECT COUNT(*) FROM molecules) as total_molecules,
      (SELECT COUNT(*) FROM plants) as total_plants,
      (SELECT COUNT(*) FROM plant_molecules) as total_liaisons,
      (SELECT COUNT(DISTINCT plant_id) FROM plant_molecules) as plants_with_molecules,
      (SELECT COUNT(DISTINCT molecule_id) FROM plant_molecules) as molecules_with_plants,
      (SELECT COUNT(*) FROM raw_materials) as total_raw_materials,
      (SELECT COUNT(*) FROM terroirs) as total_terroirs,
      (SELECT COUNT(*) FROM plant_terroirs) as total_plant_terroirs,
      (SELECT COUNT(*) FROM recettes) as total_recettes
  `);
  
  console.log('\n=== STATISTIQUES BASE DE DONNÉES PERFUMUM ===\n');
  console.log(JSON.stringify(stats[0], null, 2));

  // Plantes orphelines (sans liaisons moléculaires)
  const [orphanPlants] = await connection.query(`
    SELECT p.id, p.name, p.latin_name, p.category
    FROM plants p
    LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
    WHERE pm.plant_id IS NULL
    ORDER BY p.name
  `);
  
  console.log('\n=== PLANTES ORPHELINES (sans liaisons moléculaires) ===');
  console.log('Total:', orphanPlants.length, 'plantes');
  orphanPlants.slice(0, 30).forEach(p => console.log('  -', p.id, p.name, '(' + (p.latin_name || 'N/A') + ') [' + p.category + ']'));
  if (orphanPlants.length > 30) console.log('  ... et', orphanPlants.length - 30, 'autres');

  // Molécules orphelines (sans liaisons végétales)
  const [orphanMolecules] = await connection.query(`
    SELECT m.id, m.name, m.chemical_class, m.family
    FROM molecules m
    LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
    WHERE pm.molecule_id IS NULL
    ORDER BY m.name
  `);
  
  console.log('\n=== MOLÉCULES ORPHELINES (sans liaisons végétales) ===');
  console.log('Total:', orphanMolecules.length, 'molécules');
  orphanMolecules.slice(0, 30).forEach(m => console.log('  -', m.id, m.name, '[' + (m.chemical_class || m.family || 'N/A') + ']'));
  if (orphanMolecules.length > 30) console.log('  ... et', orphanMolecules.length - 30, 'autres');

  // Plantes sans terroir
  const [plantsWithoutTerroir] = await connection.query(`
    SELECT p.id, p.name, p.latin_name, p.origin
    FROM plants p
    LEFT JOIN plant_terroirs pt ON p.id = pt.plant_id
    WHERE pt.plant_id IS NULL
    ORDER BY p.name
  `);
  
  console.log('\n=== PLANTES SANS TERROIR ===');
  console.log('Total:', plantsWithoutTerroir.length, 'plantes');
  plantsWithoutTerroir.slice(0, 30).forEach(p => console.log('  -', p.id, p.name, '(origine:', (p.origin || 'N/A') + ')'));
  if (plantsWithoutTerroir.length > 30) console.log('  ... et', plantsWithoutTerroir.length - 30, 'autres');

  // Terroirs existants
  const [terroirs] = await connection.query(`
    SELECT t.id, t.terroir_id, t.name, t.country, t.region,
           (SELECT COUNT(*) FROM plant_terroirs WHERE terroir_id = t.id) as plant_count
    FROM terroirs t
    ORDER BY plant_count DESC
  `);
  
  console.log('\n=== TERROIRS EXISTANTS ===');
  terroirs.forEach(t => console.log('  -', t.terroir_id, t.name, '(' + t.country + '):', t.plant_count, 'plantes'));

  await connection.end();
}

main().catch(console.error);
