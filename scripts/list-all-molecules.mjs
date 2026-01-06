import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { molecules } from "../drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const allMols = await db.select({
  id: molecules.id,
  name: molecules.name,
  family: molecules.family
}).from(molecules).orderBy(molecules.name);

console.log(`Total: ${allMols.length} molécules\n`);

// Grouper par famille
const byFamily = {};
for (const mol of allMols) {
  const fam = mol.family || 'Non classé';
  if (!byFamily[fam]) byFamily[fam] = [];
  byFamily[fam].push(mol);
}

for (const [family, mols] of Object.entries(byFamily)) {
  console.log(`\n=== ${family} (${mols.length}) ===`);
  for (const mol of mols.slice(0, 10)) {
    console.log(`  ${mol.id}: ${mol.name}`);
  }
  if (mols.length > 10) console.log(`  ... et ${mols.length - 10} autres`);
}

await connection.end();
