import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { count } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

console.log("=== Analyse des variations Pétrichor et Volcanique ===\n");

// Compter les variations Pétrichor
const petrichorCount = await db
  .select({ count: count() })
  .from(schema.petrichor);

console.log(`📊 Variations Pétrichor: ${petrichorCount[0].count}`);

// Compter les variations Volcanique
const volcanicCount = await db
  .select({ count: count() })
  .from(schema.volcanique);

console.log(`📊 Variations Volcanique: ${volcanicCount[0].count}\n`);

// Échantillon Pétrichor
const petrichorSample = await db
  .select()
  .from(schema.petrichor)
  .limit(5);

console.log("=== Échantillon Pétrichor (5 premiers) ===");
petrichorSample.forEach((r) => {
  console.log(`- ${r.variation}`);
  console.log(`  Sous-famille: ${r.subfamily}`);
  console.log(`  Description: ${r.description?.substring(0, 80)}...`);
  console.log();
});

// Échantillon Volcanique
const volcanicSample = await db
  .select()
  .from(schema.volcanique)
  .limit(5);

console.log("\n=== Échantillon Volcanique (5 premiers) ===");
volcanicSample.forEach((r) => {
  console.log(`- ${r.variation}`);
  console.log(`  Type: ${r.type}`);
  console.log(`  Description: ${r.description?.substring(0, 80)}...`);
  console.log();
});

// Lister les accords expérimentaux
const accords = await db.select().from(schema.experimentalAccords);

console.log("\n=== Accords expérimentaux disponibles ===");
console.log(`📊 Total: ${accords.length} accords\n`);

const standardAccords = accords.filter(a => a.isExtreme === 0);
const extremeAccords = accords.filter(a => a.isExtreme === 1);

console.log(`🔹 Accords standards (${standardAccords.length}):`);
standardAccords.forEach((a) => {
  console.log(`  - Accord ${a.number}: ${a.intention} (${a.olfactiveAxis})`);
});

console.log(`\n🔸 Accords extrêmes (${extremeAccords.length}):`);
extremeAccords.forEach((a) => {
  console.log(`  - Accord ${a.number}: ${a.intention} (${a.olfactiveAxis})`);
});

console.log("\n=== Stratégie de connexion ===");
console.log("✓ Pétrichor (60 variations) → Accords standards (10)");
console.log("✓ Volcanique (36 variations) → Accords extrêmes (10)");
console.log("\nChaque variation sera connectée à 1-2 accords selon son profil olfactif.");

await connection.end();
