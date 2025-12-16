#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🔗 Création des relations prototypes ↔ familles chimiques...\n");

// Créer la table de relation si elle n'existe pas
await connection.execute(`
  CREATE TABLE IF NOT EXISTS prototype_chemical_families (
    prototypeId INT NOT NULL,
    chemicalFamilyId INT NOT NULL,
    dominance ENUM('primary', 'secondary', 'tertiary') DEFAULT 'secondary',
    PRIMARY KEY (prototypeId, chemicalFamilyId),
    FOREIGN KEY (prototypeId) REFERENCES prototypes(id) ON DELETE CASCADE,
    FOREIGN KEY (chemicalFamilyId) REFERENCES chemical_families(id) ON DELETE CASCADE
  )
`);

// Récupérer les prototypes et familles chimiques
const [prototypes] = await connection.execute(
  "SELECT id, code, name FROM prototypes ORDER BY id"
);

const [families] = await connection.execute(
  "SELECT id, name, type FROM chemical_families"
);

console.log("Prototypes:");
prototypes.forEach(p => console.log(`  - ${p.code} ${p.name} (ID ${p.id})`));

console.log("\nFamilles chimiques:");
families.forEach(f => console.log(`  - ${f.name} (${f.type}) → ID ${f.id}`));

// Définir les relations basées sur l'analyse des compositions
const relations = [
  // C1 FERMENTUM - Organique, fermenté, animal
  { prototype: "C1", families: [
    { type: "acides_gras", dominance: "primary" },      // Fromage, cuir, crème
    { type: "indoles", dominance: "primary" },          // Animal, fécal
    { type: "esters", dominance: "secondary" }          // Fermentation
  ]},
  
  // C2 CLARUS VERDE - Vert, frais, aromatique
  { prototype: "C2", families: [
    { type: "esters", dominance: "primary" },           // Vert, frais, fruité
    { type: "acides_aromatiques", dominance: "secondary" } // Résine verte
  ]},
  
  // C3 LACTA SOLIS - Lacté, solaire, miel
  { prototype: "C3", families: [
    { type: "esters", dominance: "primary" },           // Lacté, crémeux
    { type: "acides_aromatiques", dominance: "secondary" }, // Miel, cire
    { type: "acides_gras", dominance: "tertiary" }      // Beurre
  ]},
  
  // C4 TERRA AMBRA - Minéral, résineux, terre
  { prototype: "C4", families: [
    { type: "acides_aromatiques", dominance: "primary" }, // Résine, encens
    { type: "indoles", dominance: "secondary" },        // Terre, humus
    { type: "acides_gras", dominance: "tertiary" }      // Cuir sec
  ]}
];

console.log("\nCréation des relations...");
let relationsCreated = 0;

for (const rel of relations) {
  const prototype = prototypes.find(p => p.code === rel.prototype);
  
  if (!prototype) {
    console.log(`  ⚠ Prototype ${rel.prototype} non trouvé`);
    continue;
  }
  
  for (const famData of rel.families) {
    const family = families.find(f => f.type === famData.type);
    
    if (family) {
      try {
        await connection.execute(
          `INSERT INTO prototype_chemical_families (prototypeId, chemicalFamilyId, dominance) VALUES (?, ?, ?)`,
          [prototype.id, family.id, famData.dominance]
        );
        console.log(`  ✓ ${rel.prototype} → ${family.name} (${famData.dominance})`);
        relationsCreated++;
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.log(`  ⚠ Erreur: ${error.message}`);
        }
      }
    } else {
      console.log(`  ⚠ Famille non trouvée: ${famData.type}`);
    }
  }
}

console.log(`\n✅ ${relationsCreated} relations créées avec succès !`);

await connection.end();
