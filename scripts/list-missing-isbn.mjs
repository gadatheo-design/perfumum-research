// Script pour lister les références bibliographiques sans ISBN ni DOI
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { bibliographyEntries } from "../drizzle/schema.ts";
import { isNull, or, eq, sql } from "drizzle-orm";

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("\n=== Références sans ISBN ni DOI ===\n");

  const results = await db
    .select({
      id: bibliographyEntries.id,
      entryKey: bibliographyEntries.entryKey,
      title: bibliographyEntries.title,
      authors: bibliographyEntries.authors,
      year: bibliographyEntries.year,
      entryType: bibliographyEntries.entryType,
      doi: bibliographyEntries.doi,
      isbn: bibliographyEntries.isbn,
    })
    .from(bibliographyEntries)
    .where(
      sql`(${bibliographyEntries.doi} IS NULL OR ${bibliographyEntries.doi} = '') 
          AND (${bibliographyEntries.isbn} IS NULL OR ${bibliographyEntries.isbn} = '')`
    );

  console.log(`Nombre de références sans identifiant: ${results.length}\n`);

  for (const ref of results) {
    console.log(`ID: ${ref.id}`);
    console.log(`Entry Key: ${ref.entryKey}`);
    console.log(`Titre: ${ref.title}`);
    console.log(`Auteurs: ${ref.authors || 'N/A'}`);
    console.log(`Année: ${ref.year || 'N/A'}`);
    console.log(`Type: ${ref.entryType}`);
    console.log("---");
  }

  await connection.end();
}

main().catch(console.error);
