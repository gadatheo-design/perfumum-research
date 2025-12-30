import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { count } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

console.log("=== Analyse Recettes ↔ Molécules ===\n");

// Compter les recettes
const recettesCount = await db.select({ count: count() }).from(schema.recettes);
console.log(`📊 Recettes: ${recettesCount[0].count}`);

// Compter les molécules
const moleculesCount = await db.select({ count: count() }).from(schema.molecules);
console.log(`📊 Molécules: ${moleculesCount[0].count}\n`);

// Échantillon de recettes avec leurs catégories
const recettesSample = await db
  .select({
    id: schema.recettes.id,
    name: schema.recettes.name,
    category: schema.recettes.category,
    formula: schema.recettes.formula,
  })
  .from(schema.recettes)
  .limit(10);

console.log("=== Échantillon de recettes (10 premiers) ===");
recettesSample.forEach((r) => {
  console.log(`- ${r.name} (${r.category})`);
  if (r.formula) {
    console.log(`  Formule: ${r.formula.substring(0, 80)}...`);
  }
  console.log();
});

// Lister toutes les molécules disponibles
const molecules = await db
  .select({
    id: schema.molecules.id,
    name: schema.molecules.name,
    family: schema.molecules.family,
  })
  .from(schema.molecules);

console.log("\n=== Molécules disponibles ===");
molecules.forEach((m) => {
  console.log(`- ${m.name} (${m.family || "sans famille"})`);
});

console.log("\n=== Stratégie de connexion ===");
console.log("Les recettes de type 'tabac', 'resine', 'encens' contiennent généralement:");
console.log("- Molécules aromatiques (Eugénol, Cinnamaldéhyde, Vanilline)");
console.log("- Molécules lactées (δ-Décalactone, γ-Nonalactone)");
console.log("- Molécules fumées/résineuses (Guaiacol, Furfural)");
console.log("\nNous allons créer des relations basées sur les catégories de recettes.");

await connection.end();
