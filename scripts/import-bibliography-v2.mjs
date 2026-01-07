#!/usr/bin/env node
/**
 * PERFUMUM - Import Bibliography v2 (Niche Innovations)
 * 
 * Imports 50 references from the PERFUMUM_Bibliography_NicheInnovations_AllSources_v2.csv
 * into the v3_references table.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV file path
const CSV_PATH = '/home/ubuntu/perfumum-bibliography-pack/PERFUMUM_Bibliography_NicheInnovations_AllSources_v2.csv';

// Map CSV types to database enum values
const TYPE_MAP = {
  'journal-article': 'article',
  'book': 'book',
  'preprint': 'preprint',
  'website': 'website',
  'dataset': 'dataset',
  'software': 'software',
  'report': 'report',
  'news-article': 'news',
  'misc': 'misc'
};

// Parse CSV line handling quoted fields
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

// Parse tags string to array
function parseTags(tagsStr) {
  if (!tagsStr || tagsStr === '') return [];
  return tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);
}

// Read and parse CSV
function readCSV() {
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  
  // Skip header
  const dataLines = lines.slice(1);
  
  const references = [];
  
  for (const line of dataLines) {
    const fields = parseCSVLine(line);
    
    if (fields.length < 11) {
      console.warn(`Skipping line with insufficient fields: ${fields[0]}`);
      continue;
    }
    
    const [referenceId, type, year, title, authors, venue, doi, url, axis, tags, note] = fields;
    
    // Skip if no reference_id
    if (!referenceId || referenceId === '') continue;
    
    const ref = {
      entryKey: referenceId,
      entryType: TYPE_MAP[type] || 'misc',
      title: title || '',
      authors: authors || null,
      year: year ? parseInt(year, 10) : null,
      containerTitle: venue || null,
      doi: doi || null,
      url: url || null,
      axisPrimaryCode: axis || null,
      tags: parseTags(tags),
      notes: note || null
    };
    
    references.push(ref);
  }
  
  return references;
}

// Generate SQL INSERT statements
function generateSQL(references) {
  const statements = [];
  
  for (const ref of references) {
    const tagsJson = ref.tags.length > 0 ? JSON.stringify(ref.tags) : 'NULL';
    
    const sql = `INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (
  ${escapeSQL(ref.entryKey)},
  ${escapeSQL(ref.entryType)},
  ${escapeSQL(ref.title)},
  ${escapeSQL(ref.authors)},
  ${ref.year || 'NULL'},
  ${escapeSQL(ref.containerTitle)},
  ${escapeSQL(ref.doi)},
  ${escapeSQL(ref.url)},
  ${escapeSQL(ref.axisPrimaryCode)},
  ${ref.tags.length > 0 ? `'${JSON.stringify(ref.tags).replace(/'/g, "''")}'` : 'NULL'},
  ${escapeSQL(ref.notes)},
  'unread',
  50
) ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  authors = VALUES(authors),
  year = VALUES(year),
  container_title = VALUES(container_title),
  doi = VALUES(doi),
  url = VALUES(url),
  axis_primary_code = VALUES(axis_primary_code),
  tags = VALUES(tags),
  notes = VALUES(notes);`;
    
    statements.push(sql);
  }
  
  return statements;
}

function escapeSQL(value) {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  // Escape single quotes and wrap in quotes
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Main execution
async function main() {
  console.log('📚 PERFUMUM Bibliography Import v2');
  console.log('===================================\n');
  
  // Read CSV
  console.log(`Reading CSV from: ${CSV_PATH}`);
  const references = readCSV();
  console.log(`Found ${references.length} references to import\n`);
  
  // Display summary by axis
  const axisCount = {};
  for (const ref of references) {
    const axis = ref.axisPrimaryCode || 'No axis';
    axisCount[axis] = (axisCount[axis] || 0) + 1;
  }
  
  console.log('References by axis:');
  for (const [axis, count] of Object.entries(axisCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  - ${axis}: ${count}`);
  }
  console.log('');
  
  // Display summary by type
  const typeCount = {};
  for (const ref of references) {
    typeCount[ref.entryType] = (typeCount[ref.entryType] || 0) + 1;
  }
  
  console.log('References by type:');
  for (const [type, count] of Object.entries(typeCount).sort((a, b) => b[1] - a[1])) {
    console.log(`  - ${type}: ${count}`);
  }
  console.log('');
  
  // Generate SQL
  const sqlStatements = generateSQL(references);
  
  // Write SQL file
  const sqlPath = path.join(__dirname, 'import-bibliography-v2.sql');
  fs.writeFileSync(sqlPath, sqlStatements.join('\n\n'));
  console.log(`SQL file written to: ${sqlPath}`);
  
  // Output JSON for verification
  const jsonPath = path.join(__dirname, 'bibliography-v2-parsed.json');
  fs.writeFileSync(jsonPath, JSON.stringify(references, null, 2));
  console.log(`JSON file written to: ${jsonPath}`);
  
  console.log('\n✅ Import preparation complete!');
  console.log('To import, run the SQL file against your database.');
}

main().catch(console.error);
