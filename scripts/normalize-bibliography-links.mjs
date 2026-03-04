/**
 * Normalisation et enrichissement des liaisons bibliographiques
 * Corrige le format JSON non standard et enrichit les liaisons plantes/molécules
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== NORMALISATION DES LIAISONS BIBLIOGRAPHIQUES ===\n');

// 1. Analyser le format actuel des liaisons
const [sample] = await conn.execute(`
  SELECT id, title, linked_plant_ids, linked_molecule_ids
  FROM bibliography_entries
  WHERE linked_plant_ids IS NOT NULL AND linked_plant_ids != 'null'
  LIMIT 5
`);

console.log('Exemples de liaisons existantes :');
sample.forEach(b => {
  console.log(`  [${b.id}] ${b.title?.slice(0, 50)}`);
  console.log(`    linked_plant_ids: ${b.linked_plant_ids}`);
  console.log(`    linked_molecule_ids: ${b.linked_molecule_ids}`);
});

// 2. Normaliser les liaisons existantes (format CSV → JSON)
console.log('\n\n🔧 Normalisation du format JSON...\n');

const [allBib] = await conn.execute(`
  SELECT id, title, authors, keywords, tags, linked_plant_ids, linked_molecule_ids, research_domain
  FROM bibliography_entries
`);

let normalized = 0;
let errors = 0;

for (const bib of allBib) {
  const updates = {};
  
  // Normaliser linked_plant_ids
  const rawPlantIds = bib.linked_plant_ids;
  if (rawPlantIds && rawPlantIds !== 'null') {
    if (typeof rawPlantIds === 'number') {
      // Valeur scalaire — convertir en tableau
      updates.linked_plant_ids = JSON.stringify([rawPlantIds]);
    } else if (typeof rawPlantIds === 'string') {
      try {
        JSON.parse(rawPlantIds); // Déjà valide JSON
      } catch {
        // Convertir format CSV en JSON
        const ids = rawPlantIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        updates.linked_plant_ids = JSON.stringify(ids);
      }
    }
  }
  
  // Normaliser linked_molecule_ids
  const rawMolIds = bib.linked_molecule_ids;
  if (rawMolIds && rawMolIds !== 'null') {
    if (typeof rawMolIds === 'number') {
      updates.linked_molecule_ids = JSON.stringify([rawMolIds]);
    } else if (typeof rawMolIds === 'string') {
      try {
        JSON.parse(rawMolIds); // Déjà valide JSON
      } catch {
        const ids = rawMolIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        updates.linked_molecule_ids = JSON.stringify(ids);
      }
    }
  }
  
  if (Object.keys(updates).length > 0) {
    try {
      const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      await conn.execute(
        `UPDATE bibliography_entries SET ${setClauses} WHERE id = ?`,
        [...Object.values(updates), bib.id]
      );
      normalized++;
    } catch (err) {
      errors++;
    }
  }
}

console.log(`✅ Liaisons normalisées : ${normalized}`);
console.log(`❌ Erreurs : ${errors}`);

// 3. Enrichir les références sans liaisons par correspondance de mots-clés
console.log('\n\n🔗 Enrichissement des liaisons par correspondance...\n');

// Récupérer toutes les plantes
const [plants] = await conn.execute(`
  SELECT id, name, latin_name, family FROM plants ORDER BY name
`);

// Récupérer toutes les molécules
const [molecules] = await conn.execute(`
  SELECT id, name FROM molecules ORDER BY name
`);

// Récupérer les références sans liaisons plantes
const [bibToEnrich] = await conn.execute(`
  SELECT id, title, authors, keywords, tags, abstract, research_domain
  FROM bibliography_entries
  WHERE linked_plant_ids IS NULL OR linked_plant_ids = 'null' OR linked_plant_ids = '[]'
`);

console.log(`Références à enrichir : ${bibToEnrich.length}`);

let enriched = 0;
let plantLinksCreated = 0;
let molLinksCreated = 0;

for (const bib of bibToEnrich) {
  // Construire le texte de recherche
  const searchText = [
    bib.title || '',
    bib.authors || '',
    bib.abstract || '',
    bib.keywords ? (typeof bib.keywords === 'string' ? bib.keywords : JSON.stringify(bib.keywords)) : '',
    bib.tags ? (typeof bib.tags === 'string' ? bib.tags : JSON.stringify(bib.tags)) : '',
  ].join(' ').toLowerCase();
  
  const linkedPlantIds = [];
  const linkedMolIds = [];
  
  // Chercher les plantes mentionnées
  for (const plant of plants) {
    const plantName = plant.name.toLowerCase();
    const latinName = (plant.latin_name || '').toLowerCase();
    
    if (plantName.length > 3 && searchText.includes(plantName)) {
      linkedPlantIds.push(plant.id);
    } else if (latinName.length > 5 && searchText.includes(latinName)) {
      linkedPlantIds.push(plant.id);
    }
  }
  
  // Chercher les molécules mentionnées
  for (const mol of molecules) {
    const molName = mol.name.toLowerCase();
    if (molName.length > 4 && searchText.includes(molName)) {
      linkedMolIds.push(mol.id);
    }
  }
  
  // Mettre à jour si des liaisons trouvées
  if (linkedPlantIds.length > 0 || linkedMolIds.length > 0) {
    try {
      const updates = {};
      if (linkedPlantIds.length > 0) {
        updates.linked_plant_ids = JSON.stringify([...new Set(linkedPlantIds)]);
        plantLinksCreated += linkedPlantIds.length;
      }
      if (linkedMolIds.length > 0) {
        updates.linked_molecule_ids = JSON.stringify([...new Set(linkedMolIds)]);
        molLinksCreated += linkedMolIds.length;
      }
      
      const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      await conn.execute(
        `UPDATE bibliography_entries SET ${setClauses} WHERE id = ?`,
        [...Object.values(updates), bib.id]
      );
      enriched++;
    } catch (err) {
      // Ignorer
    }
  }
}

console.log(`✅ Références enrichies : ${enriched}`);
console.log(`  Liaisons plantes créées : ${plantLinksCreated}`);
console.log(`  Liaisons molécules créées : ${molLinksCreated}`);

// 4. Statistiques finales
const [finalStats] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN linked_plant_ids IS NOT NULL AND linked_plant_ids != 'null' AND linked_plant_ids != '[]' THEN 1 ELSE 0 END) as with_plants,
    SUM(CASE WHEN linked_molecule_ids IS NOT NULL AND linked_molecule_ids != 'null' AND linked_molecule_ids != '[]' THEN 1 ELSE 0 END) as with_molecules
  FROM bibliography_entries
`);

const f = finalStats[0];
console.log(`\n📊 État final :`);
console.log(`  Total références : ${f.total}`);
console.log(`  Avec liaisons plantes : ${f.with_plants} (${Math.round(f.with_plants/f.total*100)}%)`);
console.log(`  Avec liaisons molécules : ${f.with_molecules} (${Math.round(f.with_molecules/f.total*100)}%)`);

await conn.end();
console.log('\n✅ Normalisation et enrichissement terminés');
