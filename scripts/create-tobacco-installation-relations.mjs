#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🔗 Création des relations tabacs ↔ installations...\n");

// Créer la table de relation si elle n'existe pas
await connection.execute(`
  CREATE TABLE IF NOT EXISTS tobacco_formula_installations (
    tobaccoFormulaId INT NOT NULL,
    installationId INT NOT NULL,
    PRIMARY KEY (tobaccoFormulaId, installationId),
    FOREIGN KEY (tobaccoFormulaId) REFERENCES tobacco_formulas(id) ON DELETE CASCADE,
    FOREIGN KEY (installationId) REFERENCES installations(id) ON DELETE CASCADE
  )
`);

// Récupérer les tabacs et installations
const [tabacs] = await connection.execute(
  "SELECT id, name as formula_name FROM tobacco_formulas"
);

const [installations] = await connection.execute(
  `SELECT id, title FROM installations`
);

console.log("Tabacs alchimiques:");
tabacs.forEach(t => console.log(`  - ${t.formula_name} (ID ${t.id})`));

console.log("\nInstallations:");
installations.forEach(i => console.log(`  - ${i.title} (ID ${i.id})`));

// Définir les correspondances logiques basées sur les profils olfactifs
const relations = [
  // Philosophale (Pierre philosophale, alchimie) → Sanctum (Terra Ambra, minéral)
  { tobacco: "Philosophale", installation: "Sanctum — Installation C4 Terra Ambra" },
  
  // Mastiha Verde (Résine verte méditerranéenne) → Tour Verte (Clarus Verde)
  { tobacco: "Mastiha Verde", installation: "Tour Verte — Installation C2 Clarus Verde" },
  { tobacco: "Mastiha Verde", installation: "Chambre de lumière verte — Dispositif C2" },
  
  // Liquide Noir (Fumée, encens sombre) → Zone Organique (Fermentum, organique)
  { tobacco: "Liquide Noir", installation: "Zone Organique — Installation C1 Fermentum" },
  
  // Floréal (Floral, lumineux) → Chambre Solaire (Lacta Solis)
  { tobacco: "Floréal", installation: "Chambre Solaire — Installation C3 Lacta Solis" },
  
  // Tabernacle (Sacré, rituel) → Sanctum + Archive Atmosphérique
  { tobacco: "Tabernacle", installation: "Sanctum — Installation C4 Terra Ambra" },
  { tobacco: "Tabernacle", installation: "Archive Atmosphérique — Bibliothèque d'odeurs" },
  
  // Série Petrichor utilise plusieurs tabacs
  { tobacco: "Philosophale", installation: "Série Petrichor — Installation multi-espaces" },
  { tobacco: "Liquide Noir", installation: "Série Petrichor — Installation multi-espaces" },
];

console.log("\nCréation des relations...");
let relationsCreated = 0;

for (const rel of relations) {
  const tobacco = tabacs.find(t => t.formula_name === rel.tobacco);
  const installation = installations.find(i => i.title === rel.installation);
  
  if (tobacco && installation) {
    try {
      await connection.execute(
        `INSERT INTO tobacco_formula_installations (tobaccoFormulaId, installationId) VALUES (?, ?)`,
        [tobacco.id, installation.id]
      );
      console.log(`  ✓ ${rel.tobacco} → ${rel.installation}`);
      relationsCreated++;
    } catch (error) {
      if (error.code !== 'ER_DUP_ENTRY') {
        console.log(`  ⚠ Erreur: ${error.message}`);
      }
    }
  } else {
    console.log(`  ⚠ Non trouvé: ${rel.tobacco} → ${rel.installation}`);
  }
}

console.log(`\n✅ ${relationsCreated} relations créées avec succès !`);

await connection.end();
