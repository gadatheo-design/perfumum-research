#!/usr/bin/env node
/**
 * PERFUMUM - Import Bibliography via SQL Batch
 * 
 * Generates individual SQL statements to be executed via webdev_execute_sql
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load parsed references
const jsonPath = path.join(__dirname, 'bibliography-v2-parsed.json');
const references = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function escapeSQL(value) {
  if (value === null || value === undefined || value === '') {
    return 'NULL';
  }
  // Escape single quotes and wrap in quotes
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Generate batch SQL
const statements = references.map(ref => {
  const tagsJson = ref.tags.length > 0 ? `'${JSON.stringify(ref.tags).replace(/'/g, "''")}'` : 'NULL';
  
  return `INSERT INTO v3_references (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
VALUES (${escapeSQL(ref.entryKey)}, ${escapeSQL(ref.entryType)}, ${escapeSQL(ref.title)}, ${escapeSQL(ref.authors)}, ${ref.year || 'NULL'}, ${escapeSQL(ref.containerTitle)}, ${escapeSQL(ref.doi)}, ${escapeSQL(ref.url)}, ${escapeSQL(ref.axisPrimaryCode)}, ${tagsJson}, ${escapeSQL(ref.notes)}, 'unread', 50)
ON DUPLICATE KEY UPDATE title = VALUES(title), authors = VALUES(authors), year = VALUES(year), container_title = VALUES(container_title), doi = VALUES(doi), url = VALUES(url), axis_primary_code = VALUES(axis_primary_code), tags = VALUES(tags), notes = VALUES(notes)`;
});

// Output all statements
console.log('-- PERFUMUM Bibliography Import v2');
console.log('-- ' + references.length + ' references');
console.log('');
statements.forEach((sql, i) => {
  console.log(`-- Reference ${i + 1}: ${references[i].entryKey}`);
  console.log(sql + ';');
  console.log('');
});
