import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { molecules } from "../drizzle/schema.ts";
import { like, or } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Rechercher molécules avec profil anisé, herbacé, vert
const aniseMols = await db.select({
  id: molecules.id,
  name: molecules.name,
  family: molecules.family,
  olfactiveProfile: molecules.olfactiveProfile
}).from(molecules).where(
  or(
    like(molecules.olfactiveProfile, '%anis%'),
    like(molecules.olfactiveProfile, '%herbac%'),
    like(molecules.name, '%anethole%'),
    like(molecules.name, '%Anéthole%')
  )
);

console.log("=== Molécules anisées/herbacées ===");
for (const mol of aniseMols) {
  console.log(`${mol.id}: ${mol.name} (${mol.family || 'N/A'})`);
  console.log(`   Profil: ${(mol.olfactiveProfile || 'N/A').substring(0, 100)}...`);
}

// Rechercher aussi les phénylpropanoïdes
console.log("\n=== Phénylpropanoïdes ===");
const phenylMols = await db.select({
  id: molecules.id,
  name: molecules.name,
  family: molecules.family,
  olfactiveProfile: molecules.olfactiveProfile
}).from(molecules).where(like(molecules.family, '%Phénylpropan%'));

for (const mol of phenylMols) {
  console.log(`${mol.id}: ${mol.name}`);
  console.log(`   Profil: ${(mol.olfactiveProfile || 'N/A').substring(0, 100)}...`);
}

await connection.end();
