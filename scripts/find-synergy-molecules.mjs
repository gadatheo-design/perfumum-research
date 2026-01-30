import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { molecules } from "../drizzle/schema.ts";
import { like } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Molécules clés de Tagetes lucida et leurs synergies potentielles
const targetMolecules = [
  'estragole', 'anéthole', 'méthyl-eugénol', 'ocimène', 'myrcène', 'tagetone',
  'linalol', 'limonène', 'eugénol', 'géraniol', 'citral', 'carvone'
];

console.log("=== Molécules pour synergies avec Tagetes lucida ===\n");

for (const target of targetMolecules) {
  const found = await db.select({
    id: molecules.id,
    name: molecules.name,
    family: molecules.family,
    olfactiveProfile: molecules.olfactiveProfile
  }).from(molecules).where(like(molecules.name, `%${target}%`));
  
  if (found.length > 0) {
    console.log(`✓ ${target}:`);
    for (const mol of found) {
      console.log(`  - ID ${mol.id}: ${mol.name} (${mol.family || 'N/A'})`);
    }
  } else {
    console.log(`✗ ${target}: non trouvé`);
  }
}

await connection.end();
