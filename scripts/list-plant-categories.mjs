import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { plants } from "../drizzle/schema.ts";
import { sql } from "drizzle-orm";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("\n=== Catégories de plantes ===\n");

  const categories = await db.execute(sql`
    SELECT category, COUNT(*) as count 
    FROM plants 
    GROUP BY category 
    ORDER BY count DESC
  `);

  console.log("Catégories existantes:");
  for (const row of categories[0]) {
    console.log(`  ${row.category || 'NULL'}: ${row.count} plantes`);
  }

  // Voir quelques exemples par catégorie
  console.log("\n=== Exemples par catégorie ===\n");
  
  const examples = await db.execute(sql`
    SELECT category, scientific_name, common_name, latitude, longitude
    FROM plants 
    WHERE latitude IS NOT NULL
    ORDER BY category, scientific_name
    LIMIT 30
  `);

  for (const row of examples[0]) {
    console.log(`[${row.category}] ${row.scientific_name} (${row.common_name}) - lat: ${row.latitude}, lng: ${row.longitude}`);
  }

  await connection.end();
}

main().catch(console.error);
