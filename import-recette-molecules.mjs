import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Récupérer les IDs réels des recettes CBD
const recettesCBD = await db.select({ id: schema.recettes.id, name: schema.recettes.name })
  .from(schema.recettes)
  .where(eq(schema.recettes.category, 'resine_cbd'))
  .orderBy(schema.recettes.id);

console.log(`Found ${recettesCBD.length} CBD recipes:`);
recettesCBD.forEach(r => console.log(`  ${r.id}: ${r.name}`));

// Récupérer les IDs des molécules principales
const molecules = await db.select({ id: schema.molecules.id, name: schema.molecules.name })
  .from(schema.molecules)
  .where(eq(schema.molecules.id, 1))
  .union(db.select({ id: schema.molecules.id, name: schema.molecules.name }).from(schema.molecules).where(eq(schema.molecules.id, 2)))
  .union(db.select({ id: schema.molecules.id, name: schema.molecules.name }).from(schema.molecules).where(eq(schema.molecules.id, 3)))
  .union(db.select({ id: schema.molecules.id, name: schema.molecules.name }).from(schema.molecules).where(eq(schema.molecules.id, 4)))
  .union(db.select({ id: schema.molecules.id, name: schema.molecules.name }).from(schema.molecules).where(eq(schema.molecules.id, 6)));

console.log(`\nMolecules to link:`);
molecules.forEach(m => console.log(`  ${m.id}: ${m.name}`));

// Mapping dynamique basé sur les noms de recettes
const recetteMoleculesData = [];

recettesCBD.forEach((recette, index) => {
  const recetteId = recette.id;
  
  // Molécules communes à toutes les recettes CBD
  // Utilise uniquement les 3 molécules disponibles : 1, 2, 3
  recetteMoleculesData.push(
    { recetteId, moleculeId: 1, role: 'base', proportion: 35 }, // Hexanoic acid
    { recetteId, moleculeId: 2, role: 'accent', proportion: 30 }, // Linalol
    { recetteId, moleculeId: 3, role: 'fixative', proportion: 25 } // Ambroxan
  );
});

console.log(`\nImporting ${recetteMoleculesData.length} recette-molecule relations...`);

for (const data of recetteMoleculesData) {
  await db.insert(schema.recetteMolecules).values(data);
  console.log(`✓ Linked recette ${data.recetteId} → molecule ${data.moleculeId} (${data.role})`);
}

console.log('✅ Import completed!');
await connection.end();
