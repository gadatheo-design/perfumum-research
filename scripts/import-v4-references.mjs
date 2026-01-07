/**
 * PERFUMUM — Import Pack v4: Cannabis/Tabac Genomics References
 * 
 * Ce script importe les 30 références scientifiques du pack v4 dans la table v3_references
 * avec les axes thématiques génomiques appropriés.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lire le fichier CSV
const csvPath = path.join(__dirname, '../data/PERFUMUM_References_CannabisTabac_Genomics_v4.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parser le CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }
  
  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Mapper les types de références
const typeMapping = {
  'journal-article': 'article',
  'preprint': 'article',
  'database': 'website',
};

// Mapper les tags vers les axes thématiques v3
function determineAxis(tags, id) {
  const tagList = tags.toLowerCase();
  
  // Axe génomique principal basé sur le contenu
  if (tagList.includes('pangenome') || tagList.includes('structural-variation') || tagList.includes('haplotype')) {
    return { primary: 'N1', secondary: ['M1', 'J1'] }; // Génomique & Diversité
  }
  if (tagList.includes('terpene-synthase') || tagList.includes('tps') || tagList.includes('aroma') || tagList.includes('scent')) {
    return { primary: 'M1', secondary: ['B1', 'C1'] }; // Biochimie & Olfaction
  }
  if (tagList.includes('biosynthesis') || tagList.includes('pathway') || tagList.includes('nicotine')) {
    return { primary: 'M2', secondary: ['M1', 'N1'] }; // Voies métaboliques
  }
  if (tagList.includes('domestication') || tagList.includes('provenance') || tagList.includes('forensic')) {
    return { primary: 'N2', secondary: ['J2', 'N1'] }; // Provenance & Conservation
  }
  if (tagList.includes('taxonomy') || tagList.includes('classification')) {
    return { primary: 'N3', secondary: ['N1', 'N2'] }; // Taxonomie
  }
  if (tagList.includes('epigenomics') || tagList.includes('transcriptome') || tagList.includes('expression')) {
    return { primary: 'M3', secondary: ['M1', 'M2'] }; // Omics & Expression
  }
  if (tagList.includes('trichome') || tagList.includes('cell-biology')) {
    return { primary: 'M1', secondary: ['M2', 'B1'] }; // Biologie cellulaire
  }
  if (tagList.includes('database') || tagList.includes('portal')) {
    return { primary: 'J3', secondary: ['N1', 'M1'] }; // Ressources & Données
  }
  
  // Défaut basé sur l'ID
  if (id.startsWith('CAN-')) {
    return { primary: 'N1', secondary: ['M1'] }; // Cannabis → Génomique
  }
  if (id.startsWith('TOB-')) {
    return { primary: 'N1', secondary: ['M2'] }; // Tabac → Génomique
  }
  if (id.startsWith('DB-')) {
    return { primary: 'J3', secondary: ['N1'] }; // Database → Ressources
  }
  
  return { primary: 'N1', secondary: [] };
}

// Générer le SQL d'insertion
const references = parseCSV(csvContent);

console.log(`\n📚 PERFUMUM — Import Pack v4: Cannabis/Tabac Genomics`);
console.log(`   ${references.length} références à importer\n`);

const sqlStatements = [];

references.forEach((ref, index) => {
  const axis = determineAxis(ref.tags, ref.id);
  const tags = ref.tags.split(';').map(t => t.trim()).filter(t => t);
  
  // Échapper les apostrophes pour SQL
  const escapeSQL = (str) => str.replace(/'/g, "''");
  
  const sql = `INSERT INTO v3_references (
    entry_key, entry_type, title, authors, year, 
    container_title, doi, url, notes, tags,
    axis_primary_code, axes_secondary, read_status, relevance_score, pack_version
  ) VALUES (
    '${escapeSQL(ref.id)}',
    '${typeMapping[ref.type] || ref.type}',
    '${escapeSQL(ref.title)}',
    '${escapeSQL(ref.authors)}',
    ${ref.year ? ref.year : 'NULL'},
    '${escapeSQL(ref.venue)}',
    ${ref.doi ? `'${escapeSQL(ref.doi)}'` : 'NULL'},
    ${ref.url ? `'${escapeSQL(ref.url)}'` : 'NULL'},
    '${escapeSQL(ref.notes)}',
    '${JSON.stringify(tags)}',
    '${axis.primary}',
    '${JSON.stringify(axis.secondary)}',
    'unread',
    70,
    'v4'
  ) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    notes = VALUES(notes),
    tags = VALUES(tags);`;
  
  sqlStatements.push(sql);
  
  console.log(`${index + 1}. ${ref.id}`);
  console.log(`   📖 ${ref.title.substring(0, 60)}...`);
  console.log(`   🏷️  Axe: ${axis.primary} | Tags: ${tags.slice(0, 3).join(', ')}`);
  console.log('');
});

// Écrire le fichier SQL
const sqlPath = path.join(__dirname, '../data/import_v4_references.sql');
fs.writeFileSync(sqlPath, sqlStatements.join('\n\n'));

console.log(`\n✅ Fichier SQL généré: ${sqlPath}`);
console.log(`   ${sqlStatements.length} requêtes INSERT prêtes`);

// Générer aussi un JSON pour import via API
const jsonData = references.map(ref => {
  const axis = determineAxis(ref.tags, ref.id);
  const tags = ref.tags.split(';').map(t => t.trim()).filter(t => t);
  
  return {
    entryKey: ref.id,
    entryType: typeMapping[ref.type] || ref.type,
    title: ref.title,
    authors: ref.authors,
    year: ref.year ? parseInt(ref.year) : null,
    containerTitle: ref.venue,
    doi: ref.doi || null,
    url: ref.url || null,
    notes: ref.notes,
    tags: tags,
    axisPrimaryCode: axis.primary,
    axesSecondary: axis.secondary,
    readStatus: 'unread',
    relevanceScore: 70,
    packVersion: 'v4'
  };
});

const jsonPath = path.join(__dirname, '../data/v4_references_to_import.json');
fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

console.log(`✅ Fichier JSON généré: ${jsonPath}`);
console.log(`\n🎯 Pour importer, exécutez les requêtes SQL via webdev_execute_sql`);
