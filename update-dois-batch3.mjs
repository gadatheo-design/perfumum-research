import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// DOI trouvés via recherche - Batch 3
const doiUpdates = [
  // Livres avec DOI trouvés
  {
    id: 150048,
    title: "African Ethnobotany: Poisons and Drugs",
    doi: "10.5555/19970301031"
  },
  {
    id: 150044,
    title: "Tobacco: Production, Chemistry and Technology",
    doi: "10.5555/20000709027"
  },
  // Note: Les livres suivants n'ont pas de DOI officiels car ils sont antérieurs à l'ère DOI
  // ou sont des ouvrages grand public sans DOI académique:
  // - Fragrances of the World (Michael Edwards) - référence commerciale
  // - West African Herbal Pharmacopoeia - document institutionnel
  // - Journal d'un Parfumeur (Ellena) - livre grand public
  // - The Emperor of Scent (Burr) - livre grand public
  // - Essence and Alchemy (Aftel) - livre grand public
  // - Tales of a Shaman's Apprentice (Plotkin) - livre grand public
  // - Plants of the Gods (Schultes/Hofmann) - édition grand public
  // - L'Art de la Parfumerie (Roudnitska) - livre français ancien
  // - Les Pouvoirs de l'Odeur (Le Guérer) - livre français
  // - The Useful Plants of West Tropical Africa (Burkill) - référence botanique ancienne
  // - The Essential Oils (Guenther) - référence classique 1948
  // - Scent and Chemistry (Ohloff) - édition originale 1994
  // - Perfumery: Practice and Principles (Calkin/Jellinek) - manuel professionnel
];

console.log("🔄 Mise à jour des DOI - Batch 3...\n");

for (const update of doiUpdates) {
  try {
    if (update.doi) {
      await connection.execute(
        'UPDATE bibliography_entries SET doi = ? WHERE id = ?',
        [update.doi, update.id]
      );
      console.log(`✅ DOI ajouté pour ID ${update.id}: ${update.doi}`);
    }
  } catch (error) {
    console.error(`❌ Erreur pour ID ${update.id}:`, error.message);
  }
}

// Compter les références avec et sans DOI
const [withDoi] = await connection.execute(`
  SELECT COUNT(*) as total 
  FROM bibliography_entries 
  WHERE doi IS NOT NULL AND doi != ''
  AND entry_type IN ('article', 'book', 'inproceedings', 'thesis')
`);

const [withoutDoi] = await connection.execute(`
  SELECT COUNT(*) as total 
  FROM bibliography_entries 
  WHERE (doi IS NULL OR doi = '') 
  AND entry_type IN ('article', 'book', 'inproceedings', 'thesis')
`);

console.log(`\n📊 Résumé final:`);
console.log(`   - Références avec DOI: ${withDoi[0].total}`);
console.log(`   - Références sans DOI: ${withoutDoi[0].total}`);

// Lister les références restantes sans DOI avec leurs ISBN
const [remainingRefs] = await connection.execute(`
  SELECT id, title, authors, year, entry_type, isbn
  FROM bibliography_entries 
  WHERE (doi IS NULL OR doi = '') 
  AND entry_type IN ('article', 'book', 'inproceedings', 'thesis')
  ORDER BY year DESC
`);

console.log("\n📚 Références sans DOI (avec ISBN si disponible):");
let withIsbn = 0;
let withoutIsbn = 0;
remainingRefs.forEach(r => {
  const hasIsbn = r.isbn && r.isbn.trim() !== '';
  if (hasIsbn) withIsbn++;
  else withoutIsbn++;
  console.log(`  ${hasIsbn ? '📖' : '⚠️'} ${r.title?.substring(0, 45)}... (${r.year}) ${hasIsbn ? '- ISBN: ' + r.isbn : '- Pas d\'ISBN'}`);
});

console.log(`\n📈 Parmi les ${remainingRefs.length} sans DOI:`);
console.log(`   - ${withIsbn} ont un ISBN (identifiables)`);
console.log(`   - ${withoutIsbn} n'ont ni DOI ni ISBN`);

await connection.end();
