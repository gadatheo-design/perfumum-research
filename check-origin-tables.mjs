import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check table counts
const [counts] = await connection.query(`
  SELECT 'geographic_origins' as tbl, COUNT(*) as cnt FROM geographic_origins
  UNION ALL
  SELECT 'molecule_origins', COUNT(*) FROM molecule_origins
  UNION ALL
  SELECT 'terroirs', COUNT(*) FROM terroirs
  UNION ALL
  SELECT 'molecules', COUNT(*) FROM molecules
`);
console.log('Table counts:', counts);

// Check molecules with sourceOrigin
const [moleculesWithOrigin] = await connection.query(`
  SELECT id, name, sourceOrigin FROM molecules WHERE sourceOrigin IS NOT NULL AND sourceOrigin != '' LIMIT 15
`);
console.log('\nMolecules with sourceOrigin:', moleculesWithOrigin);

// Check geographic_origins
const [origins] = await connection.query(`SELECT * FROM geographic_origins LIMIT 5`);
console.log('\nGeographic origins:', origins);

// Check terroirs
const [terroirsData] = await connection.query(`SELECT id, terroir_id, name, country, region, latitude, longitude FROM terroirs LIMIT 10`);
console.log('\nTerroirs:', terroirsData);

await connection.end();
