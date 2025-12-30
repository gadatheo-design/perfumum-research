import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { like, or } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const searchTerms = ['café', 'cacao', 'vanilla', 'copaiba', 'lippia', 'piper', 'calycolpus', 'turnera', 'damiana', 'matico'];

console.log('🔍 Recherche des molécules colombiennes...\n');

for (const term of searchTerms) {
  const results = await db.select({ id: schema.molecules.id, name: schema.molecules.name })
    .from(schema.molecules)
    .where(like(schema.molecules.name, `%${term}%`));
  
  if (results.length > 0) {
    console.log(`✅ '${term}' trouvé:`);
    results.forEach(r => console.log(`   - ID ${r.id}: ${r.name}`));
  } else {
    console.log(`❌ '${term}' non trouvé`);
  }
}

await connection.end();
