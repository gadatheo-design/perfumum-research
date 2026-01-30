// Script pour mettre à jour les ISBN des références bibliographiques
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { bibliographyEntries } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const isbnUpdates = [
  {
    entryKey: "perfumum_edwards2019",
    isbn: "978-0980860061",
    notes: "33rd Edition, Michael Edwards"
  },
  {
    entryKey: "perfumum_guenther1948",
    isbn: "978-0894647734",
    notes: "6 Volume Set, Krieger Publishing reprint"
  },
  {
    entryKey: "perfumum_burkill1985",
    isbn: "978-0947643010",
    notes: "Volume 1 (A-D), Royal Botanic Gardens Kew. Série complète: Vol.2: 978-0947643560, Vol.3: 978-0947643645, Vol.4: 978-1900347136, Vol.5: 978-1900347402"
  },
  {
    entryKey: "perfumum_waho2013",
    isbn: "978-9988-1-8015-7",
    notes: "WAHO/ECOWAS publication, KS Printkraft Ghana"
  },
  {
    entryKey: "perfumum_kraft2000",
    isbn: "978-1405114509",
    doi: "10.1002/9781444305517.ch7",
    notes: "Chapitre dans 'Chemistry and Technology of Flavors and Fragrances', Blackwell Publishing"
  },
  {
    entryKey: "perfumum_stashenko2019",
    isbn: "978-1-78984-641-6",
    doi: "10.5772/intechopen.87199",
    notes: "Chapitre dans 'Essential Oils - Oils of Nature', IntechOpen"
  }
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("\n=== Mise à jour des ISBN ===\n");

  for (const update of isbnUpdates) {
    try {
      const updateData = { isbn: update.isbn };
      if (update.doi) {
        updateData.doi = update.doi;
      }
      
      const result = await db
        .update(bibliographyEntries)
        .set(updateData)
        .where(eq(bibliographyEntries.entryKey, update.entryKey));
      
      console.log(`✓ ${update.entryKey}: ISBN ${update.isbn}${update.doi ? ` + DOI ${update.doi}` : ''}`);
    } catch (error) {
      console.error(`✗ Erreur pour ${update.entryKey}:`, error.message);
    }
  }

  // Vérification
  console.log("\n=== Vérification ===\n");
  
  const remaining = await db
    .select({
      entryKey: bibliographyEntries.entryKey,
      title: bibliographyEntries.title,
      doi: bibliographyEntries.doi,
      isbn: bibliographyEntries.isbn,
    })
    .from(bibliographyEntries)
    .where(eq(bibliographyEntries.isbn, ''));

  const remainingNull = await db
    .select({
      entryKey: bibliographyEntries.entryKey,
      title: bibliographyEntries.title,
      doi: bibliographyEntries.doi,
      isbn: bibliographyEntries.isbn,
    })
    .from(bibliographyEntries);

  const withoutIdentifier = remainingNull.filter(r => (!r.doi || r.doi === '') && (!r.isbn || r.isbn === ''));
  
  console.log(`Références sans identifiant restantes: ${withoutIdentifier.length}`);
  for (const ref of withoutIdentifier) {
    console.log(`  - ${ref.entryKey}: ${ref.title?.substring(0, 50)}...`);
  }

  await connection.end();
  console.log("\n=== Mise à jour terminée ===\n");
}

main().catch(console.error);
