import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const DATABASE_URL = process.env.DATABASE_URL!;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "planetscale" });

  // Load additional terms
  const dataPath = path.join(__dirname, "../data/glossary-terms-additional.json");
  const termsData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log(`Loading ${termsData.length} additional glossary terms...`);

  let imported = 0;
  let skipped = 0;
  
  for (const item of termsData) {
    // Check if term already exists
    const existing = await db.select().from(schema.glossary).where(eq(schema.glossary.term, item.term));
    
    if (existing.length > 0) {
      console.log(`⚠️  Skipped (already exists): ${item.term}`);
      skipped++;
      continue;
    }
    
    await db.insert(schema.glossary).values({
      term: item.term,
      category: item.category,
      definition: item.definition,
      examples: item.examples || null,
      context: item.context || null,
      relatedTerms: null,
      createdAt: new Date(),
    });

    console.log(`✅ Imported: ${item.term} (${item.category})`);
    imported++;
  }
  
  console.log(`\n✅ Successfully imported ${imported} new terms`);
  console.log(`⚠️  Skipped ${skipped} existing terms`);

  console.log(`\n✅ Successfully imported ${termsData.length} additional terms`);
  
  // Count total terms
  const allTerms = await db.select().from(schema.glossary);
  console.log(`📊 Total glossary terms: ${allTerms.length}`);

  await connection.end();
}

main().catch((err) => {
  console.error("Error importing additional glossary terms:", err);
  process.exit(1);
});
