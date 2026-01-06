import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// DOI trouvés via recherche
const doiUpdates = [
  // Articles scientifiques
  {
    id: 150053,
    title: "Anti-tubercular activity of eleven aromatic and medicinal plants occurring in Colombia",
    doi: "10.7705/biomedica.v29i1.41"
  },
  {
    id: 150064,
    title: "Plantes aromatiques et leurs huiles essentielles: état des connaissances",
    doi: "10.64707/revstsna.v44i1.1760"
  },
  // Livres avec DOI
  {
    id: 150036,
    title: "Poucher's Perfumes, Cosmetics and Soaps",
    doi: "10.1007/978-94-017-2734-1"
  },
  {
    id: 150045,
    title: "The Chemical Components of Tobacco and Tobacco Smoke",
    doi: "10.1201/b13973"
  },
  // Livres - mise à jour ISBN si manquant
  {
    id: 150011,
    title: "Scent and Chemistry: The Molecular World of Odors",
    isbn: "978-3906390666"
  },
  {
    id: 150002,
    title: "Perfume and Flavor Materials of Natural Origin",
    isbn: "978-0931710364" // ISBN connu pour ce classique
  },
];

console.log("🔄 Mise à jour des DOI et ISBN...\n");

for (const update of doiUpdates) {
  try {
    if (update.doi) {
      await connection.execute(
        'UPDATE bibliography_entries SET doi = ? WHERE id = ?',
        [update.doi, update.id]
      );
      console.log(`✅ DOI ajouté pour ID ${update.id}: ${update.doi}`);
    }
    if (update.isbn) {
      await connection.execute(
        'UPDATE bibliography_entries SET isbn = ? WHERE id = ? AND (isbn IS NULL OR isbn = "")',
        [update.isbn, update.id]
      );
      console.log(`✅ ISBN ajouté pour ID ${update.id}: ${update.isbn}`);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ID ${update.id}:`, error.message);
  }
}

// Vérifier les mises à jour
const [updated] = await connection.execute(`
  SELECT id, title, doi, isbn 
  FROM bibliography_entries 
  WHERE id IN (150053, 150064, 150036, 150045, 150011, 150002)
`);

console.log("\n📊 Références mises à jour:");
updated.forEach(r => {
  console.log(`  - ${r.title.substring(0, 50)}...`);
  console.log(`    DOI: ${r.doi || 'N/A'} | ISBN: ${r.isbn || 'N/A'}`);
});

// Compter les références restantes sans DOI
const [remaining] = await connection.execute(`
  SELECT COUNT(*) as total 
  FROM bibliography_entries 
  WHERE (doi IS NULL OR doi = '') 
  AND entry_type IN ('article', 'book', 'inproceedings', 'thesis')
`);
console.log(`\n📈 Références sans DOI restantes: ${remaining[0].total}`);

await connection.end();
