/**
 * Script de liaison automatique des références bibliographiques
 * aux plantes et molécules de la base PERFUMUM.
 * 
 * Stratégie :
 * 1. Pour chaque référence sans liaison, extraire les mots-clés du titre + abstract + keywords
 * 2. Comparer avec les noms des plantes (name, latin_name) et molécules (name, iupac_name, synonyms)
 * 3. Créer les liaisons dans bibliography_entity_links
 * 
 * Priorité par domaine :
 * - chimie_olfactive → molécules
 * - botanique, ethnobotanique → plantes
 * - extraction, formulation → plantes + molécules
 * - tabac_cannabis → plantes (catégorie tabac/cannabis)
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('✅ Connexion DB établie');

// ─── 1. Charger les plantes et molécules ─────────────────────────────────────

const [plants] = await conn.execute(
  'SELECT id, name, latin_name, category FROM plants WHERE name IS NOT NULL'
);
const [molecules] = await conn.execute(
  'SELECT id, name, iupac_name, cas_number FROM molecules WHERE name IS NOT NULL'
);

console.log(`📚 ${plants.length} plantes, ${molecules.length} molécules chargées`);

// Index de recherche (lowercase → id)
const plantIndex = new Map();
const moleculeIndex = new Map();

for (const p of plants) {
  if (p.name) plantIndex.set(p.name.toLowerCase().trim(), p.id);
  if (p.latin_name) {
    const parts = p.latin_name.toLowerCase().trim().split(' ');
    if (parts[0]) plantIndex.set(parts[0], p.id); // genre seul
    plantIndex.set(p.latin_name.toLowerCase().trim(), p.id);
  }
}

for (const m of molecules) {
  if (m.name) moleculeIndex.set(m.name.toLowerCase().trim(), m.id);
  if (m.iupac_name) moleculeIndex.set(m.iupac_name.toLowerCase().trim(), m.id);
}

// ─── 2. Charger les références sans liaisons ─────────────────────────────────

const [refs] = await conn.execute(`
  SELECT be.id, be.title, be.abstract, be.keywords, be.research_domain
  FROM bibliography_entries be
  WHERE NOT EXISTS (
    SELECT 1 FROM bibliography_entity_links bel WHERE bel.bibliography_id = be.id
  )
  ORDER BY be.research_domain, be.id
`);

console.log(`🔍 ${refs.length} références sans liaisons à traiter`);

// ─── 3. Fonction de matching ──────────────────────────────────────────────────

function extractText(ref) {
  const parts = [];
  if (ref.title) parts.push(ref.title.toLowerCase());
  if (ref.abstract) parts.push(ref.abstract.toLowerCase());
  if (ref.keywords) {
    try {
      const kws = typeof ref.keywords === 'string' ? JSON.parse(ref.keywords) : ref.keywords;
      if (Array.isArray(kws)) parts.push(kws.join(' ').toLowerCase());
    } catch {
      parts.push(String(ref.keywords).toLowerCase());
    }
  }
  return parts.join(' ');
}

function findMatches(text, domain) {
  const matchedPlants = new Set();
  const matchedMolecules = new Set();

  // Priorité domaine
  const checkPlants = ['botanique', 'ethnobotanique', 'tabac_cannabis', 'extraction', 'formulation', 'durabilite', 'histoire_parfumerie', ''].includes(domain);
  const checkMolecules = ['chimie_olfactive', 'extraction', 'formulation', 'reglementation', 'neurologie_olfactive', ''].includes(domain);

  if (checkPlants) {
    for (const [key, id] of plantIndex) {
      if (key.length >= 5 && text.includes(key)) {
        matchedPlants.add(id);
      }
    }
  }

  if (checkMolecules) {
    for (const [key, id] of moleculeIndex) {
      if (key.length >= 5 && text.includes(key)) {
        matchedMolecules.add(id);
      }
    }
  }

  return {
    plants: [...matchedPlants].slice(0, 10), // max 10 liaisons par ref
    molecules: [...matchedMolecules].slice(0, 10),
  };
}

// ─── 4. Créer les liaisons ────────────────────────────────────────────────────

let totalLinksCreated = 0;
let refsLinked = 0;
let errors = 0;

for (const ref of refs) {
  try {
    const text = extractText(ref);
    const { plants: matchedPlants, molecules: matchedMolecules } = findMatches(text, ref.research_domain);

    if (matchedPlants.length === 0 && matchedMolecules.length === 0) continue;

    // Déterminer le link_type selon le domaine
    const getLinkType = (domain) => {
      if (['chimie_olfactive', 'formulation'].includes(domain)) return 'chemical';
      if (['botanique', 'ethnobotanique'].includes(domain)) return 'ethnobotanical';
      if (['histoire_parfumerie'].includes(domain)) return 'historical';
      if (['methodologie'].includes(domain)) return 'methodology';
      return 'supporting';
    };
    const linkType = getLinkType(ref.research_domain);

    // Insérer les liaisons plantes
    for (const plantId of matchedPlants) {
      await conn.execute(
        `INSERT IGNORE INTO bibliography_entity_links 
         (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
         VALUES (?, 'plant', ?, ?, 5, 'Auto-linked by keyword matching', NOW())`,
        [ref.id, plantId, linkType]
      );
      totalLinksCreated++;
    }

    // Insérer les liaisons molécules
    for (const molId of matchedMolecules) {
      await conn.execute(
        `INSERT IGNORE INTO bibliography_entity_links 
         (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes, created_at)
         VALUES (?, 'molecule', ?, ?, 5, 'Auto-linked by keyword matching', NOW())`,
        [ref.id, molId, linkType]
      );
      totalLinksCreated++;
    }

    if (matchedPlants.length > 0 || matchedMolecules.length > 0) {
      refsLinked++;
    }
  } catch (err) {
    errors++;
    // Ignorer les erreurs de doublons (IGNORE devrait les gérer)
  }
}

console.log(`\n✅ RÉSULTATS :`);
console.log(`   Références liées : ${refsLinked} / ${refs.length}`);
console.log(`   Liaisons créées  : ${totalLinksCreated}`);
console.log(`   Erreurs          : ${errors}`);

// ─── 5. Statistiques finales ──────────────────────────────────────────────────

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
