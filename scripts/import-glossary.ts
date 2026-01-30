import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { readFileSync } from "fs";
import { join } from "path";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

console.log("=== Import des termes du glossaire ===\n");

// Lire le fichier JSON des termes
const termsPath = join(process.cwd(), "data", "glossary-terms.json");
const termsData = JSON.parse(readFileSync(termsPath, "utf-8"));

console.log(`📚 ${termsData.length} termes à importer\n`);

let successCount = 0;
let errorCount = 0;

for (const term of termsData) {
  try {
    await db.insert(schema.glossary).values({
      term: term.term,
      definition: term.definition,
      category: term.category,
      context: term.context,
      examples: term.examples,
      relatedTerms: null, // Will be populated later with term IDs
    });

    console.log(`✅ ${term.term} (${term.category})`);
    successCount++;
  } catch (error: any) {
    console.error(`❌ Erreur pour "${term.term}": ${error.message}`);
    errorCount++;
  }
}

console.log(`\n=== Résumé ===`);
console.log(`✅ ${successCount} termes importés avec succès`);
console.log(`❌ ${errorCount} erreurs`);

// Afficher les catégories
const categories = await db
  .select({ category: schema.glossary.category })
  .from(schema.glossary)
  .groupBy(schema.glossary.category);

console.log(`\n📊 Catégories disponibles:`);
categories.forEach((cat) => {
  console.log(`  - ${cat.category}`);
});

await connection.end();
