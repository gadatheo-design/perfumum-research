import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  console.log("=== RECETTES TL ===");
  const [recettes] = await connection.execute(
    "SELECT * FROM recettes WHERE name LIKE '%TL-%' OR name LIKE '%Tagetes%' ORDER BY name"
  );
  console.log(JSON.stringify(recettes, null, 2));

  console.log("\n=== TERP PROFILES ===");
  const [profiles] = await connection.execute(
    "SELECT id, profile_id, name, climatic_axis, plant_sources, key_molecules FROM terp_profiles ORDER BY profile_id LIMIT 15"
  );
  console.log(JSON.stringify(profiles, null, 2));

  console.log("\n=== MOLECULES TAGETES ===");
  const [molecules] = await connection.execute(
    "SELECT m.id, m.name FROM molecules m INNER JOIN plant_molecules pm ON m.id = pm.molecule_id WHERE pm.plant_id = 300001"
  );
  console.log(JSON.stringify(molecules, null, 2));

  await connection.end();
}

main().catch(console.error);
