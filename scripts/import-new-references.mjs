#!/usr/bin/env node
/**
 * Import des nouvelles références bibliographiques PERFUMUM
 * - PerfumeryMaterials_NicheOmics_v2 (34 références)
 * - LostMolecules_AncientVarieties_v1 (25 références)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les fichiers CSV
const perfumeryCsvPath = path.join(__dirname, '../data/references_perfumery_csv.txt');
const lostMoleculesCsvPath = path.join(__dirname, '../data/references_lost_molecules_csv.txt');

function parseCSV(content, hasNotes = false) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV avec gestion des guillemets
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || '';
    });
    results.push(obj);
  }
  
  return results;
}

// Parser le fichier de références parfumerie
const perfumeryContent = fs.readFileSync(perfumeryCsvPath, 'utf-8');
const perfumeryRefs = parseCSV(perfumeryContent);

// Parser le fichier de références molécules disparues
const lostMoleculesContent = fs.readFileSync(lostMoleculesCsvPath, 'utf-8');
const lostMoleculesRefs = parseCSV(lostMoleculesContent);

// Mapper les références vers le format de la base de données
function mapPerfumeryRef(ref) {
  const tags = ref.tags ? ref.tags.split(';').map(t => t.trim()) : [];
  
  // Déterminer le domaine de recherche
  let researchDomain = 'perfumery';
  if (tags.some(t => t.includes('genome') || t.includes('genomics'))) {
    researchDomain = 'genomics';
  } else if (tags.some(t => t.includes('transcriptom') || t.includes('metabolom'))) {
    researchDomain = 'metabolomics';
  } else if (tags.some(t => t.includes('biosynthesis') || t.includes('enzyme'))) {
    researchDomain = 'biochemistry';
  }
  
  return {
    entryKey: ref.reference_id || `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entryType: ref.type === 'journal-article' ? 'article' : 'misc',
    title: ref.title,
    authors: ref.authors || null,
    year: parseInt(ref.year) || null,
    journal: ref.venue || null,
    doi: ref.doi || null,
    url: ref.url || null,
    tags: tags.length > 0 ? JSON.stringify(tags) : null,
    notes: ref.notes || null,
    researchDomain: researchDomain,
    readStatus: 'unread',
    relevanceScore: 70,
  };
}

function mapLostMoleculesRef(ref) {
  const axis = ref.axis || '';
  let tags = [];
  let researchDomain = 'other';
  
  // Extraire les tags depuis l'axe
  if (axis.includes('Cannabis')) {
    tags.push('cannabis', 'genomics');
    researchDomain = 'genomics';
    if (axis.includes('Pangenome')) tags.push('pangenome', 'domestication');
    if (axis.includes('TPS')) tags.push('terpene-synthase', 'terpenes');
    if (axis.includes('chemotypes')) tags.push('chemotypes');
    if (axis.includes('ancient')) tags.push('archaeochemistry', 'ancient-samples');
    if (axis.includes('metabolite')) tags.push('metabolomics');
  } else if (axis.includes('Tobacco')) {
    tags.push('tobacco', 'nicotiana');
    researchDomain = 'genomics';
    if (axis.includes('metabolomics')) tags.push('metabolomics', 'herbarium');
    if (axis.includes('nicotine')) tags.push('alkaloids', 'nicotine');
    if (axis.includes('genomics') || axis.includes('genome')) tags.push('genomics');
    if (axis.includes('alkaloids')) tags.push('alkaloids', 'GC-MS');
  } else if (axis.includes('Herbarium')) {
    tags.push('herbarium', 'historical-samples');
    researchDomain = 'metabolomics';
    if (axis.includes('volatilomics')) tags.push('volatilomics', 'terpenes');
    if (axis.includes('DNA')) tags.push('ancient-DNA');
  } else if (axis.includes('Archaeochemistry') || axis.includes('Archaeology')) {
    tags.push('archaeochemistry', 'ancient-perfumes');
    researchDomain = 'archaeochemistry';
  } else if (axis.includes('Aroma')) {
    tags.push('aroma-chemistry', 'terpenes');
    researchDomain = 'chemistry';
    if (axis.includes('cultivar')) tags.push('cultivar-diversity');
    if (axis.includes('aging')) tags.push('aging', 'transformation');
  }
  
  return {
    entryKey: ref.id ? ref.id.toLowerCase().replace(/_/g, '-') : `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entryType: 'article',
    title: ref.title,
    authors: null,
    year: parseInt(ref.year) || null,
    journal: ref.venue || null,
    doi: ref.doi || null,
    url: ref.url || null,
    tags: tags.length > 0 ? JSON.stringify(tags) : null,
    notes: ref.note || null,
    researchDomain: researchDomain,
    readStatus: 'unread',
    relevanceScore: 75,
  };
}

// Préparer les données pour l'import
const allReferences = [
  ...perfumeryRefs.map(mapPerfumeryRef),
  ...lostMoleculesRefs.map(mapLostMoleculesRef),
];

// Générer le SQL d'import
function generateSQL(refs) {
  const values = refs.map(ref => {
    const escapeSql = (str) => str ? str.replace(/'/g, "''") : null;
    
    return `(
      '${escapeSql(ref.entryKey)}',
      '${ref.entryType}',
      '${escapeSql(ref.title)}',
      ${ref.authors ? `'${escapeSql(ref.authors)}'` : 'NULL'},
      ${ref.year || 'NULL'},
      ${ref.journal ? `'${escapeSql(ref.journal)}'` : 'NULL'},
      ${ref.doi ? `'${escapeSql(ref.doi)}'` : 'NULL'},
      ${ref.url ? `'${escapeSql(ref.url)}'` : 'NULL'},
      ${ref.tags ? `'${escapeSql(ref.tags)}'` : 'NULL'},
      ${ref.notes ? `'${escapeSql(ref.notes)}'` : 'NULL'},
      '${ref.researchDomain}',
      '${ref.readStatus}',
      ${ref.relevanceScore}
    )`;
  });
  
  return `-- Import des nouvelles références bibliographiques PERFUMUM
-- Généré le ${new Date().toISOString()}
-- Total: ${refs.length} références

INSERT INTO bibliography_entries (
  entry_key,
  entry_type,
  title,
  authors,
  year,
  journal,
  doi,
  url,
  tags,
  notes,
  research_domain,
  read_status,
  relevance_score
) VALUES
${values.join(',\n')}
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  journal = VALUES(journal),
  doi = VALUES(doi),
  url = VALUES(url),
  tags = VALUES(tags),
  notes = VALUES(notes),
  research_domain = VALUES(research_domain),
  updated_at = NOW();
`;
}

// Générer le fichier JSON pour import via tRPC
const jsonOutput = {
  generatedAt: new Date().toISOString(),
  totalCount: allReferences.length,
  sources: [
    { name: 'PerfumeryMaterials_NicheOmics_v2', count: perfumeryRefs.length },
    { name: 'LostMolecules_AncientVarieties_v1', count: lostMoleculesRefs.length },
  ],
  references: allReferences,
};

// Écrire les fichiers de sortie
const sqlOutput = generateSQL(allReferences);
fs.writeFileSync(path.join(__dirname, '../data/import_new_references.sql'), sqlOutput);
fs.writeFileSync(path.join(__dirname, '../data/new_references_to_import.json'), JSON.stringify(jsonOutput, null, 2));

console.log(`✅ Import préparé avec succès!`);
console.log(`   - ${perfumeryRefs.length} références PerfumeryMaterials`);
console.log(`   - ${lostMoleculesRefs.length} références LostMolecules`);
console.log(`   - Total: ${allReferences.length} références`);
console.log(`\nFichiers générés:`);
console.log(`   - data/import_new_references.sql`);
console.log(`   - data/new_references_to_import.json`);
