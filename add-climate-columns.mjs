import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Add climate columns to plants table
const columns = [
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS latitude_min DECIMAL(10,7)",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS latitude_max DECIMAL(10,7)",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS altitude_min INT",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS altitude_max INT",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS koppen_zone VARCHAR(10)",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS koppen_description VARCHAR(100)",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS precipitation_min INT",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS precipitation_max INT",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS temperature_min INT",
  "ALTER TABLE plants ADD COLUMN IF NOT EXISTS temperature_max INT"
];

for (const sql of columns) {
  try {
    await connection.execute(sql);
    console.log(`✓ ${sql.split('ADD COLUMN')[1].trim().split(' ')[2]}`);
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log(`- ${sql.split('ADD COLUMN')[1].trim().split(' ')[2]} (already exists)`);
    } else {
      console.error(`✗ Error: ${err.message}`);
    }
  }
}

console.log("\nColonnes climatiques ajoutées avec succès!");
await connection.end();
