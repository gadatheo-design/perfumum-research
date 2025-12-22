#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🔗 Création des relations accords expérimentaux ↔ civilisations...\n");

// Créer la table de relation si elle n'existe pas
await connection.execute(`
  CREATE TABLE IF NOT EXISTS experimental_accord_civilisations (
    experimentalAccordId INT NOT NULL,
    civilisationId INT NOT NULL,
    PRIMARY KEY (experimentalAccordId, civilisationId),
    FOREIGN KEY (experimentalAccordId) REFERENCES experimental_accords(id) ON DELETE CASCADE,
    FOREIGN KEY (civilisationId) REFERENCES civilisations(id) ON DELETE CASCADE
  )
`);

// Récupérer les accords et civilisations
const [accords] = await connection.execute(
  "SELECT id, `number`, olfactiveAxis, intention FROM experimental_accords"
);

const [civilisations] = await connection.execute(
  "SELECT id, name, temporality FROM civilisations"
);

console.log(`${accords.length} accords expérimentaux`);
console.log(`${civilisations.length} civilisations\n`);

// Définir les correspondances logiques basées sur les profils olfactifs
const relations = [
  // Terre & Minéral → Civilisations antiques (pierre, terre)
  { accord: 1, civs: ["Shuruppak", "Tell Halaf", "Akhet", "Mycène"] },
  
  // Végétal & Résine → Civilisations méditerranéennes
  { accord: 2, civs: ["Mycène", "Malabar", "Sogdiane"] },
  
  // Lactonique & Floral → Civilisations raffinées
  { accord: 3, civs: ["Akhet", "Malabar", "Himalaya Rituel"] },
  
  // Fumé & Balsamique → Civilisations rituelles
  { accord: 4, civs: ["Shuruppak", "Nag Hammadi", "Himalaya Rituel", "Thulé"] },
  
  // Cuir & Animal → Civilisations nomades/pastorales
  { accord: 5, civs: ["Sahara Antique", "Thulé", "Sogdiane"] },
  
  // Marin & Iodé → Civilisations maritimes
  { accord: 6, civs: ["Akrotiri", "Ophir", "Dilmun", "Lyonesse"] },
  
  // Épicé & Chaud → Civilisations des routes commerciales
  { accord: 7, civs: ["Sogdiane", "Malabar", "Ophir"] },
  
  // Vert & Aromatique → Civilisations agricoles
  { accord: 8, civs: ["Akhet", "Malabar", "Sahara Antique"] },
  
  // Boisé & Sec → Civilisations forestières
  { accord: 9, civs: ["Thulé", "Himalaya Rituel"] },
  
  // Gourmand & Vanillé → Civilisations agricoles avancées
  { accord: 10, civs: ["Akhet", "Malabar"] },
  
  // Fécal & Animal (extrême) → Civilisations pastorales anciennes
  { accord: 11, civs: ["Sahara Antique", "Tell Halaf"] },
  
  // Soufré & Volcanique (extrême) → Civilisations volcaniques
  { accord: 12, civs: ["Akrotiri", "Atlantide (Soufre Marin)"] },
  
  // Putride & Fermenté (extrême) → Civilisations de fermentation
  { accord: 13, civs: ["Shuruppak", "Meroe"] },
  
  // Métallique & Minéral (extrême) → Civilisations métallurgiques
  { accord: 14, civs: ["Meroe", "Akkad", "Nubie"] },
  
  // Bitume & Goudron (extrême) → Civilisations du pétrole/bitume
  { accord: 15, civs: ["Shuruppak", "Akkad"] },
  
  // Ammoniacal & Urineux (extrême) → Civilisations tannerie
  { accord: 16, civs: ["Meroe", "Nubie"] },
  
  // Iodé & Marin Extrême → Civilisations abyssales
  { accord: 17, civs: ["Lyonesse", "Atlantide (Soufre Marin)", "Mu", "Lemuria"] },
  
  // Acide & Vinaigré (extrême) → Civilisations de conservation
  { accord: 18, civs: ["Akhet", "Dilmun"] },
  
  // Brûlé & Carbonisé (extrême) → Civilisations du feu rituel
  { accord: 19, civs: ["Nag Hammadi", "Himalaya Rituel"] },
  
  // Chimique & Pharmaceutique (extrême) → Civilisations futuristes
  { accord: 20, civs: ["Cryo-Atlas", "November Humid", "Anthropocène"] },
];

console.log("Création des relations...");
let relationsCreated = 0;

for (const rel of relations) {
  const accord = accords.find(a => a.number === rel.accord);
  
  if (!accord) {
    console.log(`  ⚠ Accord ${rel.accord} non trouvé`);
    continue;
  }
  
  for (const civName of rel.civs) {
    const civ = civilisations.find(c => c.name === civName);
    
    if (civ) {
      try {
        await connection.execute(
          `INSERT INTO experimental_accord_civilisations (experimentalAccordId, civilisationId) VALUES (?, ?)`,
          [accord.id, civ.id]
        );
        console.log(`  ✓ Accord ${rel.accord} (${accord.olfactiveAxis}) → ${civName}`);
        relationsCreated++;
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.log(`  ⚠ Erreur: ${error.message}`);
        }
      }
    } else {
      console.log(`  ⚠ Civilisation non trouvée: ${civName}`);
    }
  }
}

console.log(`\n✅ ${relationsCreated} relations créées avec succès !`);

await connection.end();
