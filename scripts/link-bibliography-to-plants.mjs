/**
 * Analyse et liaison des références bibliographiques aux plantes
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== LIAISON DES RÉFÉRENCES BIBLIOGRAPHIQUES ===\n');

// 1. Analyser les références
console.log('📚 Références bibliographiques :\n');
const [bibEntries] = await conn.execute(`
  SELECT id, author, title, type, description FROM bibliography_entries
  ORDER BY author
  LIMIT 20
`);

console.log(`Total références : ${bibEntries.length}\n`);
console.log('Premiers 20 :');
bibEntries.forEach(b => {
  console.log(`  [${b.id}] ${b.author} - ${b.title}`);
});

// 2. Analyser les liaisons existantes
console.log('\n\n🔗 Liaisons existantes :\n');
const [existingLinks] = await conn.execute(`
  SELECT 
    entity_type,
    COUNT(*) as count
  FROM bibliography_entity_links
  GROUP BY entity_type
`);

console.log('Liaisons par type d\'entité :');
existingLinks.forEach(l => {
  console.log(`  ${l.entity_type} : ${l.count}`);
});

// 3. Créer des liaisons intelligentes
console.log('\n\n🔄 Création des liaisons...\n');

// Dictionnaire de mots-clés pour correspondance
const keywordMap = {
  'plant': ['plante', 'plant', 'botanical', 'botany', 'flora', 'species'],
  'molecule': ['molécule', 'molecule', 'terpene', 'compound', 'chemical', 'volatile'],
  'perfume': ['parfum', 'perfume', 'fragrance', 'olfactory', 'odor', 'aroma'],
  'tobacco': ['tabac', 'tobacco', 'nicotiana'],
  'cannabis': ['cannabis', 'hemp', 'marijuana', 'terpene profile'],
  'rose': ['rose', 'rosa', 'damascena'],
  'terroir': ['terroir', 'origin', 'region', 'geography', 'climat', 'soil'],
};

// Récupérer les plantes
const [plants] = await conn.execute(`
  SELECT id, name, latin_name FROM plants ORDER BY name
`);

let linksCreated = 0;

// Pour chaque référence, chercher les plantes pertinentes
for (const bib of bibEntries) {
  const bibText = `${bib.author} ${bib.title} ${bib.description || ''}`.toLowerCase();
  
  // Chercher les plantes mentionnées
  for (const plant of plants) {
    const plantName = plant.name.toLowerCase();
    const latinName = (plant.latin_name || '').toLowerCase();
    
    // Vérifier si la plante est mentionnée dans la référence
    if (bibText.includes(plantName) || bibText.includes(latinName)) {
      try {
        await conn.execute(
          `INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE entity_id = ?`,
          [bib.id, 'plant', plant.id, plant.id]
        );
        linksCreated++;
      } catch (err) {
        // Ignorer les doublons
      }
    }
  }
}

console.log(`✅ Liaisons plante créées : ${linksCreated}`);

// 4. Créer des liaisons pour les molécules
console.log('\n🔄 Création des liaisons molécules...\n');

const [molecules] = await conn.execute(`
  SELECT id, name FROM molecules ORDER BY name
`);

let molLinksCreated = 0;

for (const bib of bibEntries) {
  const bibText = `${bib.author} ${bib.title} ${bib.description || ''}`.toLowerCase();
  
  for (const mol of molecules) {
    const molName = mol.name.toLowerCase();
    
    if (bibText.includes(molName)) {
      try {
        await conn.execute(
          `INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE entity_id = ?`,
          [bib.id, 'molecule', mol.id, mol.id]
        );
        molLinksCreated++;
      } catch (err) {
        // Ignorer
      }
    }
  }
}

console.log(`✅ Liaisons molécule créées : ${molLinksCreated}`);

// 5. Statistiques finales
console.log('\n\n📊 État final :\n');
const [finalStats] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM bibliography_entries) as total_bib,
    (SELECT COUNT(DISTINCT bibliography_id) FROM bibliography_entity_links) as bib_with_links,
    (SELECT COUNT(*) FROM bibliography_entity_links WHERE entity_type = 'plant') as plant_links,
    (SELECT COUNT(*) FROM bibliography_entity_links WHERE entity_type = 'molecule') as mol_links,
    (SELECT COUNT(DISTINCT entity_id) FROM bibliography_entity_links WHERE entity_type = 'plant') as plants_linked,
    (SELECT COUNT(DISTINCT entity_id) FROM bibliography_entity_links WHERE entity_type = 'molecule') as mols_linked
  FROM DUAL
`);

const f = finalStats[0];
console.log(`  Total références : ${f.total_bib}`);
console.log(`  Références avec liaisons : ${f.bib_with_links} (${Math.round(f.bib_with_links/f.total_bib*100)}%)`);
console.log(`  Liaisons plante : ${f.plant_links} (${f.plants_linked} plantes liées)`);
console.log(`  Liaisons molécule : ${f.mol_links} (${f.mols_linked} molécules liées)`);

await conn.end();
console.log('\n✅ Liaison des références terminée');
