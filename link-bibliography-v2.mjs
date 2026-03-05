/**
 * Script de liaison bibliographique v2 — matching amélioré
 * Stratégie par domaine :
 * - chimie_olfactive : cherche les noms de molécules (y compris anglais/IUPAC)
 * - botanique/ethnobotanique : cherche les noms latins (genre + espèce)
 * - extraction/formulation : cherche plantes ET molécules
 * - tabac_cannabis : cherche les variétés de cannabis/tabac
 * - histoire_parfumerie : cherche les parfums et plantes emblématiques
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('✅ Connexion DB établie');

// ─── 1. Charger les données de référence ──────────────────────────────────────

const [plants] = await conn.execute(
  'SELECT id, name, latin_name, category FROM plants WHERE name IS NOT NULL'
);
const [molecules] = await conn.execute(
  'SELECT id, name, iupac_name, cas_number, family FROM molecules WHERE name IS NOT NULL'
);

console.log(`📚 ${plants.length} plantes, ${molecules.length} molécules`);

// ─── 2. Construire les index de recherche ─────────────────────────────────────

// Index plantes : terme → id (avec poids)
const plantTerms = []; // [{term, id, weight}]

for (const p of plants) {
  if (p.name && p.name.length >= 5) {
    plantTerms.push({ term: p.name.toLowerCase(), id: p.id, weight: 3 });
  }
  if (p.latin_name) {
    const ln = p.latin_name.toLowerCase().trim();
    if (ln.length >= 5) {
      plantTerms.push({ term: ln, id: p.id, weight: 5 }); // nom complet = haute confiance
    }
    // Genre seul (premier mot)
    const genus = ln.split(' ')[0];
    if (genus && genus.length >= 5) {
      plantTerms.push({ term: genus, id: p.id, weight: 2 }); // genre seul = faible confiance
    }
  }
}

// Index molécules : terme → id
const moleculeTerms = [];

// Noms communs français et anglais courants
const MOLECULE_ALIASES = {
  'linalool': 'Linalol',
  'limonene': 'Limonène',
  'pinene': 'α-Pinène',
  'caryophyllene': 'β-Caryophyllène',
  'myrcene': 'Myrcène',
  'geraniol': 'Géraniol',
  'citronellol': 'Citronellol',
  'eugenol': 'Eugénol',
  'vanillin': 'Vanilline',
  'coumarin': 'Coumarine',
  'indole': 'Indole',
  'ambroxan': 'Ambroxan',
  'iso e super': 'Iso E Super',
  'habanolide': 'Habanolide',
  'galaxolide': 'Galaxolide',
  'musks': null, // trop générique
  'terpene': null,
  'terpenes': null,
};

for (const m of molecules) {
  if (m.name && m.name.length >= 5) {
    moleculeTerms.push({ term: m.name.toLowerCase(), id: m.id, weight: 3 });
  }
  if (m.iupac_name && m.iupac_name.length >= 6) {
    moleculeTerms.push({ term: m.iupac_name.toLowerCase(), id: m.id, weight: 4 });
  }
  // Ajouter les alias anglais
  for (const [alias, frName] of Object.entries(MOLECULE_ALIASES)) {
    if (frName && m.name === frName) {
      moleculeTerms.push({ term: alias, id: m.id, weight: 3 });
    }
  }
}

// ─── 3. Charger les références sans liaisons ─────────────────────────────────

const [refs] = await conn.execute(`
  SELECT be.id, be.title, be.abstract, be.keywords, be.research_domain, be.journal
  FROM bibliography_entries be
  WHERE NOT EXISTS (
    SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = be.id
  )
`);

console.log(`🔍 ${refs.length} références à traiter`);

// ─── 4. Fonction de matching ──────────────────────────────────────────────────

function buildSearchText(ref) {
  const parts = [];
  if (ref.title) parts.push(ref.title.toLowerCase());
  if (ref.abstract) parts.push(ref.abstract.toLowerCase().substring(0, 1000));
  if (ref.keywords) {
    try {
      const kws = typeof ref.keywords === 'string' ? JSON.parse(ref.keywords) : ref.keywords;
      if (Array.isArray(kws)) parts.push(kws.join(' ').toLowerCase());
      else parts.push(String(kws).toLowerCase());
    } catch {
      parts.push(String(ref.keywords).toLowerCase());
    }
  }
  return parts.join(' ');
}

function findMatches(text, domain) {
  const plantScores = new Map(); // id → score
  const moleculeScores = new Map();

  // Définir quoi chercher selon le domaine
  const searchPlants = ['botanique', 'ethnobotanique', 'extraction', 'formulation', 
                         'durabilite', 'histoire_parfumerie', 'tabac_cannabis', '', 'autre'].includes(domain);
  const searchMolecules = ['chimie_olfactive', 'extraction', 'formulation', 
                            'reglementation', 'neurologie_olfactive', '', 'autre'].includes(domain);

  if (searchPlants) {
    for (const { term, id, weight } of plantTerms) {
      if (text.includes(term)) {
        plantScores.set(id, (plantScores.get(id) ?? 0) + weight);
      }
    }
  }

  if (searchMolecules) {
    for (const { term, id, weight } of moleculeTerms) {
      if (text.includes(term)) {
        moleculeScores.set(id, (moleculeScores.get(id) ?? 0) + weight);
      }
    }
  }

  // Filtrer par score minimum et trier par score décroissant
  const minScore = 3;
  const topPlants = [...plantScores.entries()]
    .filter(([, s]) => s >= minScore)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id]) => id);

  const topMolecules = [...moleculeScores.entries()]
    .filter(([, s]) => s >= minScore)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id]) => id);

  return { plants: topPlants, molecules: topMolecules };
}

// ─── 5. Créer les liaisons ────────────────────────────────────────────────────

const getLinkType = (domain) => {
  if (['chimie_olfactive', 'formulation'].includes(domain)) return 'chemical';
  if (['botanique', 'ethnobotanique'].includes(domain)) return 'ethnobotanical';
  if (['histoire_parfumerie'].includes(domain)) return 'historical';
  if (['methodologie'].includes(domain)) return 'methodology';
  return 'supporting';
};

let totalLinksCreated = 0;
let refsLinked = 0;

for (const ref of refs) {
  const text = buildSearchText(ref);
  const { plants: matchedPlants, molecules: matchedMolecules } = findMatches(text, ref.research_domain ?? '');

  if (matchedPlants.length === 0 && matchedMolecules.length === 0) continue;

  const linkType = getLinkType(ref.research_domain ?? '');

  for (const plantId of matchedPlants) {
    await conn.execute(
      `INSERT IGNORE INTO bibliography_entity_links 
       (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
       VALUES (?, 'plant', ?, ?, 5, 'Auto-linked v2 (keyword matching)', NOW())`,
      [ref.id, plantId, linkType]
    );
    totalLinksCreated++;
  }

  for (const molId of matchedMolecules) {
    await conn.execute(
      `INSERT IGNORE INTO bibliography_entity_links 
       (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
       VALUES (?, 'molecule', ?, ?, 5, 'Auto-linked v2 (keyword matching)', NOW())`,
      [ref.id, molId, linkType]
    );
    totalLinksCreated++;
  }

  refsLinked++;
}

console.log(`\n✅ RÉSULTATS :`);
console.log(`   Références liées : ${refsLinked} / ${refs.length}`);
console.log(`   Liaisons créées  : ${totalLinksCreated}`);

// ─── 6. Statistiques finales ──────────────────────────────────────────────────

const [finalStats] = await conn.execute(`
  SELECT 
    COUNT(DISTINCT bibliography_id) as refs_with_links,
    COUNT(*) as total_links,
    SUM(CASE WHEN entity_type = 'plant' THEN 1 ELSE 0 END) as plant_links,
    SUM(CASE WHEN entity_type = 'molecule' THEN 1 ELSE 0 END) as molecule_links
  FROM bibliography_entity_links
`);

const [totalRefs] = await conn.execute('SELECT COUNT(*) as n FROM bibliography_entries');
const coverage = ((finalStats[0].refs_with_links / totalRefs[0].n) * 100).toFixed(1);

console.log(`\n📊 COUVERTURE FINALE :`);
console.log(`   Références avec liaisons : ${finalStats[0].refs_with_links} / ${totalRefs[0].n} (${coverage}%)`);
console.log(`   Total liaisons           : ${finalStats[0].total_links}`);
console.log(`   Liaisons plantes         : ${finalStats[0].plant_links}`);
console.log(`   Liaisons molécules       : ${finalStats[0].molecule_links}`);

await conn.end();
