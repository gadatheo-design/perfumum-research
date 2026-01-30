import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT id, name, latin_name, category, image_url, climatic_axis FROM plants WHERE latin_name LIKE '%Tagetes%'"
);

console.log(JSON.stringify(rows, null, 2));

await connection.end();
