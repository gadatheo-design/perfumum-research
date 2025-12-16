import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

console.log("🔄 Migration molecules_recettes : extraction proportions depuis recettes CBD...\n");

// Récupérer toutes les recettes CBD
const recettesCBD = await db
  .select()
  .from(schema.recettes)
  .where(eq(schema.recettes.category, "resine_cbd"));

console.log(`📦 ${recettesCBD.length} recettes CBD trouvées\n`);

// Mapping terpènes (nom → ID)
const terpeneMapping = {
  "Myrcène": 1,
  "Myrcene": 1,
  "Limonène": 2,
  "Limonene": 2,
  "β-Pinène": 3,
  "Beta-Pinene": 3,
  "Pinène": 3,
  "β-Caryophyllène": 4,
  "Caryophyllene": 4,
  "Caryophyllène": 4,
  "Linalool": 5,
  "α-Pinène": 6,
  "Alpha-Pinene": 6,
  "Humulène": 7,
  "Humulene": 7,
};

let insertCount = 0;
let skipCount = 0;

for (const recette of recettesCBD) {
  console.log(`\n📝 Recette: ${recette.name} (ID: ${recette.id})`);
  
  // Parser la formule pour extraire les terpènes
  const formula = recette.formula || recette.description || "";
  
  // Patterns de recherche
  const patterns = [
    /(\w+[-\w]*)\s*[:\-]\s*(\d+(?:\.\d+)?)\s*%/gi, // "Myrcène: 2.5%"
    /(\d+(?:\.\d+)?)\s*%\s+(\w+[-\w]*)/gi, // "2.5% Myrcène"
  ];
  
  const found = new Map();
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(formula)) !== null) {
      let name, proportion;
      
      if (match[1] && isNaN(match[1])) {
        // Pattern 1: nom puis proportion
        name = match[1].trim();
        proportion = parseFloat(match[2]);
      } else {
        // Pattern 2: proportion puis nom
        proportion = parseFloat(match[1]);
        name = match[2].trim();
      }
      
      // Normaliser le nom
      const moleculeId = terpeneMapping[name];
      
      if (moleculeId && proportion > 0 && proportion <= 100) {
        found.set(moleculeId, proportion);
        console.log(`  ✓ ${name} → ${proportion}% (ID: ${moleculeId})`);
      }
    }
  }
  
  // Insérer les relations trouvées
  for (const [moleculeId, proportion] of found.entries()) {
    try {
      await db.insert(schema.moleculesRecettes).values({
        moleculeId,
        recetteId: recette.id,
        proportion: proportion.toString(),
      });
      insertCount++;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ⚠️  Relation déjà existante (molecule ${moleculeId})`);
        skipCount++;
      } else {
        console.error(`  ❌ Erreur insertion:`, error.message);
      }
    }
  }
  
  if (found.size === 0) {
    console.log(`  ⚠️  Aucun terpène détecté dans la formule`);
  }
}

console.log(`\n✅ Migration terminée:`);
console.log(`   - ${insertCount} relations insérées`);
console.log(`   - ${skipCount} relations ignorées (doublons)`);

await connection.end();
