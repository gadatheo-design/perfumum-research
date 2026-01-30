#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🔗 Création des relations molécules ↔ familles chimiques...\n");

// Récupérer toutes les molécules avec leur famille
const [molecules] = await connection.execute(
  `SELECT id, name, family FROM molecules WHERE family IS NOT NULL`
);

// Récupérer toutes les familles chimiques
const [chemicalFamilies] = await connection.execute(
  `SELECT id, name, type FROM chemical_families`
);

// Créer un mapping type → id
const familyTypeToId = {};
chemicalFamilies.forEach(family => {
  familyTypeToId[family.type] = family.id;
});

console.log("Familles chimiques disponibles:");
chemicalFamilies.forEach(f => console.log(`  - ${f.name} (${f.type}) → ID ${f.id}`));

console.log("\nCréation des relations...");
let relationsCreated = 0;

for (const molecule of molecules) {
  const familyType = molecule.family;
  const chemicalFamilyId = familyTypeToId[familyType];
  
  if (chemicalFamilyId) {
    try {
      await connection.execute(
        `INSERT INTO molecule_chemical_families (moleculeId, chemicalFamilyId) VALUES (?, ?)`,
        [molecule.id, chemicalFamilyId]
      );
      console.log(`  ✓ ${molecule.name} → ${familyType}`);
      relationsCreated++;
    } catch (error) {
      if (error.code !== 'ER_DUP_ENTRY') {
        console.log(`  ⚠ Erreur pour ${molecule.name}: ${error.message}`);
      }
    }
  } else {
    console.log(`  ⚠ Famille non trouvée pour ${molecule.name} (${familyType})`);
  }
}

console.log(`\n✅ ${relationsCreated} relations créées avec succès !`);

await connection.end();
