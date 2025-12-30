import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { like } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🔍 Recherche des recettes colombiennes...\n');

const colombianRecipes = await db.select()
  .from(schema.recettes)
  .where(like(schema.recettes.gamme, '%Colombie%'));

console.log(`✅ ${colombianRecipes.length} recettes colombiennes trouvées:\n`);
colombianRecipes.forEach(r => {
  console.log(`  - ID ${r.id}: ${r.name} (${r.type}) - Gamme: ${r.gamme}`);
});

await connection.end();
