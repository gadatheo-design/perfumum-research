import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🧹 Nettoyage des recettes colombiennes vides...\n');

// Supprimer les associations d'abord
await db.delete(schema.recetteMolecules).where(sql`recette_id >= 330009 AND recette_id <= 330016`);
console.log('✅ Associations supprimées');

// Supprimer les recettes
await db.delete(schema.recettes).where(sql`id >= 330009 AND id <= 330016`);
console.log('✅ Recettes colombiennes supprimées (IDs 330009-330016)');

await connection.end();
console.log('\n✨ Nettoyage terminé !');
