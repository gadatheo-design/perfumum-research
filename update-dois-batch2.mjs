import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// DOI trouvés via recherche - Batch 2
const doiUpdates = [
  // Livres avec DOI trouvés
  {
    id: 150006,
    title: "Aroma: The Cultural History of Smell",
    doi: "10.4324/9780203428887"
  },
  {
    id: 150030,
    title: "Plants, People, and Culture: The Science of Ethnobotany",
    doi: "10.1201/9781003049074"
  },
  {
    id: 150031,
    title: "Applied Ethnobotany: People, Wild Plant Use and Conservation",
    doi: "10.4324/9781849776073"
  },
  {
    id: 150029,
    title: "Le Miasme et la Jonquille",
    doi: "10.14375/NP.9782081212978"
  },
  // ISBN pour les livres sans DOI
  {
    id: 150033,
    title: "Perfumery: Practice and Principles",
    isbn: "978-0471589341"
  },
  {
    id: 150032,
    title: "The Scented Ape: The Biology and Culture of Human Odour",
    isbn: "978-0521395618"
  },
];

console.log("🔄 Mise à jour des DOI et ISBN - Batch 2...\n");

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

// Compter les références restantes sans DOI
const [remaining] = await connection.execute(`
  SELECT COUNT(*) as total 
  FROM bibliography_entries 
  WHERE (doi IS NULL OR doi = '') 
  AND entry_type IN ('article', 'book', 'inproceedings', 'thesis')
`);
console.log(`\n📈 Références sans DOI restantes: ${remaining[0].total}`);

// Lister les références restantes
const [remainingRefs] = await connection.execute(`
  SELECT id, title, authors, year, entry_type, isbn
  FROM bibliography_entries 
  WHERE (doi IS NULL OR doi = '') 
  AND entry_type IN ('article', 'book', 'inproceedings', 'thesis')
  ORDER BY year DESC
`);
console.log("\n📚 Références sans DOI:");
remainingRefs.forEach(r => {
  console.log(`  ${r.id}: ${r.title?.substring(0, 50)}... (${r.year}) - ISBN: ${r.isbn || 'N/A'}`);
});

await connection.end();
