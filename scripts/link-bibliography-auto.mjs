/**
 * Liaisons bibliographiques automatiques par domaine
 * Stratégie : lier les références aux plantes et molécules par correspondance
 * de mots-clés dans le titre, les tags et le domaine de recherche
 */

import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Analyser les domaines disponibles
const [domains] = await conn.execute(
  'SELECT research_domain, COUNT(*) as n FROM bibliography_entries GROUP BY research_domain ORDER BY n DESC'
);
console.log('=== DOMAINES BIBLIOGRAPHIQUES ===');
domains.forEach(d => console.log(' ', d.research_domain || 'null', ':', d.n));

// Analyser les tags
const [withTags] = await conn.execute(
  'SELECT COUNT(*) as n FROM bibliography_entries WHERE tags IS NOT NULL AND tags != "null" AND tags != "[]"'
);
const [withLinkedPlants] = await conn.execute(
  'SELECT COUNT(*) as n FROM bibliography_entries WHERE linked_plant_ids IS NOT NULL AND linked_plant_ids != "null" AND linked_plant_ids != "[]"'
);
const [withLinkedMols] = await conn.execute(
  'SELECT COUNT(*) as n FROM bibliography_entries WHERE linked_molecule_ids IS NOT NULL AND linked_molecule_ids != "null" AND linked_molecule_ids != "[]"'
);
console.log('\nRéférences avec tags:', withTags[0].n);
console.log('Références avec linked_plant_ids:', withLinkedPlants[0].n);
console.log('Références avec linked_molecule_ids:', withLinkedMols[0].n);

// ============================================================
// STRATÉGIE 1 : Lier par domaine tabac_cannabis
// ============================================================
const [tobaccoRefs] = await conn.execute(
  'SELECT id, title, keywords, tags FROM bibliography_entries WHERE research_domain = ?',
  ['tabac_cannabis']
);
console.log('\n=== DOMAINE TABAC/CANNABIS :', tobaccoRefs.length, 'références ===');

// Récupérer les plantes tabac et cannabis
const [tobaccoPlants] = await conn.execute(
  'SELECT id, name FROM plants WHERE category IN (?, ?)',
  ['tabac', 'cannabis']
);
console.log('Plantes tabac/cannabis :', tobaccoPlants.length);

let linksCreated = 0;

// Créer les liaisons pour les références tabac/cannabis
for (const ref of tobaccoRefs) {
  for (const plant of tobaccoPlants) {
    // Vérifier si la liaison existe déjà
    const [existing] = await conn.execute(
      'SELECT id FROM bibliography_entity_links WHERE bibliography_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1',
      [ref.id, 'plant', plant.id]
    );
    if (existing.length === 0) {
      await conn.execute(
        'INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [ref.id, 'plant', plant.id, 'primary_source', 7]
      );
      linksCreated++;
    }
  }
}
console.log('Liaisons tabac/cannabis créées :', linksCreated);

// ============================================================
// STRATÉGIE 2 : Lier par domaine botanique → plantes
// ============================================================
const [botanicRefs] = await conn.execute(
  'SELECT id, title FROM bibliography_entries WHERE research_domain = ?',
  ['botanique']
);
console.log('\n=== DOMAINE BOTANIQUE :', botanicRefs.length, 'références ===');

// Lier les références botaniques aux plantes par correspondance de titre
const botanicLinks = [
  { keywords: ['rose', 'Rosa'], plantNames: ['Rose de Damas', 'Rose de Mai', 'Rosa × damascena'] },
  { keywords: ['lavande', 'lavender', 'Lavandula'], plantNames: ['Lavande vraie', 'Lavande fine', 'Lavande aspic'] },
  { keywords: ['jasmin', 'jasmine', 'Jasminum'], plantNames: ['Jasmin grandiflorum', 'Jasmin sambac'] },
  { keywords: ['cannabis', 'hemp', 'chanvre'], plantNames: ['Cannabis', 'OG Kush', 'Haze', 'Afghan Kush'] },
  { keywords: ['tobacco', 'tabac', 'Nicotiana'], plantNames: ['Virginia (flue-cured)', 'Burley', 'Latakia'] },
  { keywords: ['vetiver', 'vétiver', 'Vetiveria'], plantNames: ['Vétiver'] },
  { keywords: ['sandalwood', 'santal', 'Santalum'], plantNames: ['Santal blanc', 'Santal de Mysore'] },
  { keywords: ['frankincense', 'encens', 'Boswellia'], plantNames: ['Encens oliban', 'Boswellia sacra'] },
  { keywords: ['patchouli', 'Pogostemon'], plantNames: ['Patchouli'] },
  { keywords: ['ylang', 'Cananga'], plantNames: ['Ylang-ylang'] },
];

let botanicLinksCreated = 0;
for (const ref of botanicRefs) {
  const titleLower = (ref.title || '').toLowerCase();
  for (const rule of botanicLinks) {
    const matches = rule.keywords.some(kw => titleLower.includes(kw.toLowerCase()));
    if (matches) {
      for (const plantName of rule.plantNames) {
        const [plant] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', ['%' + plantName + '%']);
        if (plant.length > 0) {
          const [existing] = await conn.execute(
            'SELECT id FROM bibliography_entity_links WHERE bibliography_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1',
            [ref.id, 'plant', plant[0].id]
          );
          if (existing.length === 0) {
            await conn.execute(
              'INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
              [ref.id, 'plant', plant[0].id, 'primary_source', 8]
            );
            botanicLinksCreated++;
          }
        }
      }
    }
  }
}
console.log('Liaisons botaniques créées :', botanicLinksCreated);

// ============================================================
// STRATÉGIE 3 : Lier par domaine chimie_olfactive → molécules
// ============================================================
const [chemRefs] = await conn.execute(
  'SELECT id, title FROM bibliography_entries WHERE research_domain = ?',
  ['chimie_olfactive']
);
console.log('\n=== DOMAINE CHIMIE OLFACTIVE :', chemRefs.length, 'références ===');

// Correspondances molécules par titre
const chemLinks = [
  { keywords: ['linalool', 'linalol'], molNames: ['Linalol', 'Linalool'] },
  { keywords: ['limonene', 'limonène'], molNames: ['Limonène', 'Limonene'] },
  { keywords: ['myrcene', 'myrcène'], molNames: ['Myrcène', 'Myrcene'] },
  { keywords: ['caryophyllene', 'caryophyllène'], molNames: ['β-Caryophyllène', 'Caryophyllene'] },
  { keywords: ['geraniol', 'géraniol'], molNames: ['Géraniol', 'Geraniol'] },
  { keywords: ['citronellol'], molNames: ['Citronellol'] },
  { keywords: ['eugenol', 'eugénol'], molNames: ['Eugenol', 'Eugénol'] },
  { keywords: ['vanillin', 'vanilline'], molNames: ['Vanillin', 'Vanilline'] },
  { keywords: ['menthol'], molNames: ['Menthol'] },
  { keywords: ['camphor', 'camphre'], molNames: ['Camphre', 'Camphor'] },
  { keywords: ['thymol'], molNames: ['Thymol'] },
  { keywords: ['carvacrol'], molNames: ['Carvacrol'] },
  { keywords: ['ionone', 'ionone'], molNames: ['α-Ionone', 'β-Ionone', 'Ionone blanche'] },
  { keywords: ['damascenone', 'damascénone'], molNames: ['β-Damascenone', 'β-Damascénone'] },
  { keywords: ['santalol'], molNames: ['Santalol (α+β)', 'α-Santalol'] },
  { keywords: ['patchoulol'], molNames: ['Patchoulol'] },
];

let chemLinksCreated = 0;
for (const ref of chemRefs) {
  const titleLower = (ref.title || '').toLowerCase();
  for (const rule of chemLinks) {
    const matches = rule.keywords.some(kw => titleLower.includes(kw.toLowerCase()));
    if (matches) {
      for (const molName of rule.molNames) {
        const [mol] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [molName]);
        if (mol.length > 0) {
          const [existing] = await conn.execute(
            'SELECT id FROM bibliography_entity_links WHERE bibliography_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1',
            [ref.id, 'molecule', mol[0].id]
          );
          if (existing.length === 0) {
            await conn.execute(
              'INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
              [ref.id, 'molecule', mol[0].id, 'chemical', 8]
            );
            chemLinksCreated++;
          }
        }
      }
    }
  }
}
console.log('Liaisons chimie olfactive créées :', chemLinksCreated);

// ============================================================
// STRATÉGIE 4 : Lier par linked_plant_ids et linked_molecule_ids existants
// ============================================================
console.log('\n=== NORMALISATION DES LIAISONS EXISTANTES ===');

const [refsWithLinks] = await conn.execute(
  'SELECT id, linked_plant_ids, linked_molecule_ids FROM bibliography_entries WHERE (linked_plant_ids IS NOT NULL AND linked_plant_ids != "null" AND linked_plant_ids != "[]") OR (linked_molecule_ids IS NOT NULL AND linked_molecule_ids != "null" AND linked_molecule_ids != "[]")'
);

let normalizedLinks = 0;
for (const ref of refsWithLinks) {
  // Traiter linked_plant_ids
  if (ref.linked_plant_ids) {
    let plantIds;
    try {
      plantIds = typeof ref.linked_plant_ids === 'string' ? JSON.parse(ref.linked_plant_ids) : ref.linked_plant_ids;
    } catch { continue; }
    
    if (Array.isArray(plantIds)) {
      for (const plantId of plantIds) {
        if (typeof plantId === 'number' || (typeof plantId === 'string' && !isNaN(parseInt(plantId)))) {
          const id = parseInt(plantId);
          const [existing] = await conn.execute(
            'SELECT id FROM bibliography_entity_links WHERE bibliography_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1',
            [ref.id, 'plant', id]
          );
          if (existing.length === 0) {
            await conn.execute(
              'INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
              [ref.id, 'plant', id, 'primary_source', 9]
            );
            normalizedLinks++;
          }
        }
      }
    }
  }
  
  // Traiter linked_molecule_ids
  if (ref.linked_molecule_ids) {
    let molIds;
    try {
      molIds = typeof ref.linked_molecule_ids === 'string' ? JSON.parse(ref.linked_molecule_ids) : ref.linked_molecule_ids;
    } catch { continue; }
    
    if (Array.isArray(molIds)) {
      for (const molId of molIds) {
        if (typeof molId === 'number' || (typeof molId === 'string' && !isNaN(parseInt(molId)))) {
          const id = parseInt(molId);
          const [existing] = await conn.execute(
            'SELECT id FROM bibliography_entity_links WHERE bibliography_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1',
            [ref.id, 'molecule', id]
          );
          if (existing.length === 0) {
            await conn.execute(
              'INSERT INTO bibliography_entity_links (bibliography_id, entity_type, entity_id, link_type, relevance_score, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
              [ref.id, 'molecule', id, 'chemical', 9]
            );
            normalizedLinks++;
          }
        }
      }
    }
  }
}
console.log('Liaisons normalisées depuis JSON :', normalizedLinks);

// ============================================================
// RÉSULTATS FINAUX
// ============================================================
const [totalLinks] = await conn.execute('SELECT COUNT(*) as n FROM bibliography_entity_links');
const [linkedRefs] = await conn.execute('SELECT COUNT(DISTINCT bibliography_id) as n FROM bibliography_entity_links');
const [totalRefs] = await conn.execute('SELECT COUNT(*) as n FROM bibliography_entries');

console.log('\n=== RÉSULTATS FINAUX ===');
console.log('Total liaisons bibliographiques :', totalLinks[0].n);
console.log('Références liées :', linkedRefs[0].n, '/', totalRefs[0].n, '(' + (linkedRefs[0].n / totalRefs[0].n * 100).toFixed(1) + '%)');
console.log('Liaisons créées cette session :', linksCreated + botanicLinksCreated + chemLinksCreated + normalizedLinks);

await conn.end();
