import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // Query plants without family
  const results = await db.execute(sql`
    SELECT id, name, latin_name, family, climatic_axis, category 
    FROM plants 
    WHERE family IS NULL OR family = '' 
    ORDER BY name
  `);
  
  console.log('=== Plants without family ===');
  console.log(JSON.stringify(results[0], null, 2));
  
  // Query plants without climatic_axis
  const results2 = await db.execute(sql`
    SELECT id, name, latin_name, family, climatic_axis, category 
    FROM plants 
    WHERE climatic_axis IS NULL 
    ORDER BY name
  `);
  
  console.log('\n=== Plants without climatic_axis ===');
  console.log(JSON.stringify(results2[0], null, 2));
  
  // Query all plants for overview
  const results3 = await db.execute(sql`
    SELECT id, name, latin_name, family, climatic_axis, category 
    FROM plants 
    ORDER BY name
  `);
  
  console.log('\n=== All plants ===');
  console.log(JSON.stringify(results3[0], null, 2));
  
  await connection.end();
}

main().catch(console.error);
