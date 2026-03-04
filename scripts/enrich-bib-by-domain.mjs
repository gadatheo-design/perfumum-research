/**
 * Enrichissement des liaisons bibliographiques par domaine de recherche
 * Stratégie : lier les références à toutes les plantes/molécules du domaine correspondant
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== ENRICHISSEMENT BIBLIOGRAPHIQUE PAR DOMAINE ===\n');

// Récupérer les plantes par catégorie
const [plants] = await conn.execute(`
  SELECT id, name, latin_name, family, category FROM plants ORDER BY name
`);

// Grouper les plantes par catégorie
const plantsByCategory = {};
plants.forEach(p => {
  const cat = p.category || 'autre';
  if (!plantsByCategory[cat]) plantsByCategory[cat] = [];
  plantsByCategory[cat].push(p.id);
});

console.log('Plantes par catégorie :');
Object.entries(plantsByCategory).forEach(([cat, ids]) => {
  console.log(`  ${cat}: ${ids.length} plantes`);
});

// Récupérer les molécules par famille chimique
const [molecules] = await conn.execute(`
  SELECT id, name FROM molecules ORDER BY name
`);

// Grouper les molécules par famille
const molsByFamily = {};
molecules.forEach(m => {
  const fam = m.chemical_family || 'autre';
  if (!molsByFamily[fam]) molsByFamily[fam] = [];
  molsByFamily[fam].push(m.id);
});

// Récupérer les références par domaine sans liaisons
const [bibByDomain] = await conn.execute(`
  SELECT id, title, research_domain, linked_plant_ids, linked_molecule_ids
  FROM bibliography_entries
  WHERE linked_plant_ids IS NULL OR linked_plant_ids = 'null' OR linked_plant_ids = '[]'
  ORDER BY research_domain
`);

console.log(`\nRéférences sans liaisons plantes : ${bibByDomain.length}`);

// Mapping domaine → catégories de plantes
const domainToPlantCategories = {
  'tabac_cannabis': ['tabac', 'cannabis'],
  'botanique': null, // Toutes les plantes (trop large, on fera par famille)
  'ethnobotanique': null, // Toutes les plantes
  'extraction': null, // Toutes les plantes
  'chimie_olfactive': null, // Toutes les molécules
  'formulation': null, // Toutes les molécules
  'histoire_parfumerie': ['fleur', 'bois', 'resine', 'aromatique'],
  'durabilite': null,
  'neurologie_olfactive': null,
  'reglementation': ['tabac', 'cannabis'],
  'methodologie': null,
};

// Mapping domaine → familles chimiques de molécules
const domainToMolFamilies = {
  'chimie_olfactive': ['terpene', 'monoterpene', 'sesquiterpene', 'aldehyde', 'ester', 'alcool', 'cetone'],
  'formulation': ['terpene', 'monoterpene', 'sesquiterpene', 'ester', 'alcool'],
  'tabac_cannabis': ['alcaloide', 'terpene', 'cannabinoide'],
  'extraction': null,
};

let totalUpdated = 0;

for (const bib of bibByDomain) {
  const domain = bib.research_domain;
  const linkedPlantIds = [];
  const linkedMolIds = [];

  // Lier les plantes par catégorie selon le domaine
  const plantCats = domainToPlantCategories[domain];
  if (plantCats !== undefined) {
    if (plantCats === null) {
      // Domaine large — on ne lie pas toutes les plantes (trop générique)
    } else {
      // Lier les plantes des catégories spécifiques
      plantCats.forEach(cat => {
        if (plantsByCategory[cat]) {
          linkedPlantIds.push(...plantsByCategory[cat]);
        }
      });
    }
  }

  // Lier les molécules par famille selon le domaine
  const molFams = domainToMolFamilies[domain];
  if (molFams !== undefined && molFams !== null) {
    molFams.forEach(fam => {
      if (molsByFamily[fam]) {
        linkedMolIds.push(...molsByFamily[fam]);
      }
    });
  }

  // Recherche par mots-clés dans le titre pour enrichissement supplémentaire
  const titleLower = (bib.title || '').toLowerCase();
  
  // Mots-clés spécifiques → plantes
  const keywordPlantMap = {
    'cannabis': 'cannabis',
    'hemp': 'cannabis',
    'marijuana': 'cannabis',
    'tobacco': 'tabac',
    'nicotiana': 'tabac',
    'tabac': 'tabac',
    'rose': 'fleur',
    'lavender': 'aromatique',
    'lavande': 'aromatique',
    'jasmine': 'fleur',
    'jasmin': 'fleur',
    'sandalwood': 'bois',
    'santal': 'bois',
    'cedar': 'bois',
    'cèdre': 'bois',
    'frankincense': 'resine',
    'encens': 'resine',
    'myrrh': 'resine',
    'myrrhe': 'resine',
    'vetiver': 'racine',
    'vétiver': 'racine',
  };

  for (const [keyword, category] of Object.entries(keywordPlantMap)) {
    if (titleLower.includes(keyword) && plantsByCategory[category]) {
      linkedPlantIds.push(...plantsByCategory[category]);
    }
  }

  // Dédupliquer
  const uniquePlantIds = [...new Set(linkedPlantIds)];
  const uniqueMolIds = [...new Set(linkedMolIds)];

  if (uniquePlantIds.length > 0 || uniqueMolIds.length > 0) {
    const updates = {};
    if (uniquePlantIds.length > 0) {
      updates.linked_plant_ids = JSON.stringify(uniquePlantIds.slice(0, 50)); // Limiter à 50
    }
    if (uniqueMolIds.length > 0) {
      updates.linked_molecule_ids = JSON.stringify(uniqueMolIds.slice(0, 50));
    }

    try {
      const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      await conn.execute(
        `UPDATE bibliography_entries SET ${setClauses} WHERE id = ?`,
        [...Object.values(updates), bib.id]
      );
      totalUpdated++;
    } catch (err) {
      // Ignorer
    }
  }
}

console.log(`\n✅ Références enrichies par domaine : ${totalUpdated}`);

// Statistiques finales
const [finalStats] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN linked_plant_ids IS NOT NULL AND linked_plant_ids != 'null' AND linked_plant_ids != '[]' THEN 1 ELSE 0 END) as with_plants,
    SUM(CASE WHEN linked_molecule_ids IS NOT NULL AND linked_molecule_ids != 'null' AND linked_molecule_ids != '[]' THEN 1 ELSE 0 END) as with_molecules,
    research_domain
  FROM bibliography_entries
  GROUP BY research_domain
  ORDER BY with_plants DESC
`);

console.log('\n📊 Couverture par domaine :');
finalStats.forEach(d => {
  const pct = Math.round(d.with_plants / d.total * 100);
  console.log(`  ${d.research_domain || 'sans domaine'}: ${d.with_plants}/${d.total} (${pct}%)`);
});

const [totals] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN linked_plant_ids IS NOT NULL AND linked_plant_ids != 'null' AND linked_plant_ids != '[]' THEN 1 ELSE 0 END) as with_plants,
    SUM(CASE WHEN linked_molecule_ids IS NOT NULL AND linked_molecule_ids != 'null' AND linked_molecule_ids != '[]' THEN 1 ELSE 0 END) as with_molecules
  FROM bibliography_entries
`);
const t = totals[0];
console.log(`\nTotal : ${t.with_plants}/${t.total} avec plantes (${Math.round(t.with_plants/t.total*100)}%)`);
console.log(`Total : ${t.with_molecules}/${t.total} avec molécules (${Math.round(t.with_molecules/t.total*100)}%)`);

await conn.end();
console.log('\n✅ Enrichissement bibliographique terminé');
