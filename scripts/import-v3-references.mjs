#!/usr/bin/env node
/**
 * PERFUMUM - Import Pack v3 References
 * 
 * This script imports:
 * 1. Thematic axes (A1, B1, B2, C1, C2, C3, D1, D2, E1, E2, F1, F2, J1, J2, J3, M1, M2, M3, N1, N2, N3)
 * 2. 69 bibliography references with their axes
 * 3. Tags extracted from references
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🚀 Starting PERFUMUM Pack v3 Import...\n');

// ============================================================================
// STEP 1: Import Thematic Axes
// ============================================================================

const thematicAxes = [
  // Meta-A: Olfactory Heritage & Archives
  { code: 'A1', name: 'Smell studies & critical theory', metaAxis: 'meta_a', color: '#8B5CF6', order: 1 },
  
  // Meta-B: Olfactory Arts & Chimie de l'espace
  { code: 'B1', name: 'Olfactory art & aesthetics', metaAxis: 'meta_b', color: '#EC4899', order: 2 },
  { code: 'B2', name: 'Smell in space, design & urban smellscapes', metaAxis: 'meta_b', color: '#F43F5E', order: 3 },
  
  // Meta-C: Digital Olfaction (IA/VR/Capteurs) & Datasets
  { code: 'C1', name: 'Olfactory heritage & computational humanities', metaAxis: 'meta_c', color: '#06B6D4', order: 4 },
  { code: 'C2', name: 'Material culture & perfumery archives', metaAxis: 'meta_c', color: '#0EA5E9', order: 5 },
  { code: 'C3', name: 'Global scent histories beyond Eurocentrism', metaAxis: 'meta_c', color: '#3B82F6', order: 6 },
  
  // Knowledge & Methods
  { code: 'D1', name: 'Knowledge graph & datasets', metaAxis: 'meta_c', color: '#10B981', order: 7 },
  { code: 'D2', name: 'Methods (field, mapping, participatory)', metaAxis: 'meta_c', color: '#14B8A6', order: 8 },
  
  // Museum & Heritage
  { code: 'E1', name: 'Museum protocols & olfactory museology', metaAxis: 'meta_a', color: '#F59E0B', order: 9 },
  { code: 'E2', name: 'Heritage science: documentation & analysis', metaAxis: 'meta_a', color: '#EAB308', order: 10 },
  
  // Ethics & Community
  { code: 'F1', name: 'Ethics, politics & decolonial smell', metaAxis: 'meta_a', color: '#EF4444', order: 11 },
  { code: 'F2', name: 'Community, education & practice networks', metaAxis: 'meta_a', color: '#F97316', order: 12 },
  
  // Technology & Devices
  { code: 'J1', name: 'Performative smell systems / devices', metaAxis: 'meta_b', color: '#A855F7', order: 13 },
  { code: 'J2', name: 'VR olfactive & multisensory interfaces', metaAxis: 'meta_c', color: '#6366F1', order: 14 },
  { code: 'J3', name: 'AI for olfaction / digital smell', metaAxis: 'meta_c', color: '#4F46E5', order: 15 },
  
  // Cannabis
  { code: 'M1', name: 'Cannabis: diversité colombienne (chimio/terpènes)', metaAxis: 'other', color: '#22C55E', order: 16 },
  { code: 'M2', name: 'Cannabis: standardisation & nomenclature', metaAxis: 'other', color: '#16A34A', order: 17 },
  { code: 'M3', name: 'Cannabis: phytochemistry & biosynthesis', metaAxis: 'other', color: '#15803D', order: 18 },
  
  // Tobacco
  { code: 'N1', name: 'Tabac: ethnobotanique & rituels', metaAxis: 'other', color: '#92400E', order: 19 },
  { code: 'N2', name: 'Tabac: industrie, histoire, pouvoir', metaAxis: 'other', color: '#78350F', order: 20 },
  { code: 'N3', name: 'Psychoactive ethnobotany (context only)', metaAxis: 'other', color: '#713F12', order: 21 },
];

console.log('📚 Importing thematic axes...');

for (const axis of thematicAxes) {
  try {
    await connection.execute(
      `INSERT INTO thematic_axes (axis_code, name, meta_axis, color, display_order)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), meta_axis = VALUES(meta_axis), color = VALUES(color), display_order = VALUES(display_order)`,
      [axis.code, axis.name, axis.metaAxis, axis.color, axis.order]
    );
    console.log(`  ✓ ${axis.code}: ${axis.name}`);
  } catch (error) {
    console.error(`  ✗ Error importing ${axis.code}:`, error.message);
  }
}

console.log(`\n✅ Imported ${thematicAxes.length} thematic axes\n`);

// ============================================================================
// STEP 2: Parse and Import References from CSV
// ============================================================================

const csvPath = path.join(__dirname, '../data/pack_v3_references.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (handle quoted fields with commas)
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

const lines = csvContent.split('\n').filter(line => line.trim());
const headers = parseCSVLine(lines[0]);
console.log('📄 CSV Headers:', headers.join(', '));

const references = [];
const allTags = new Set();

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  if (values.length < headers.length) continue;
  
  const ref = {};
  headers.forEach((header, idx) => {
    ref[header] = values[idx] || '';
  });
  
  // Extract tags
  if (ref.tags) {
    ref.tags.split(';').forEach(tag => {
      const trimmed = tag.trim();
      if (trimmed) allTags.add(trimmed);
    });
  }
  
  references.push(ref);
}

console.log(`\n📖 Found ${references.length} references to import`);
console.log(`🏷️  Found ${allTags.size} unique tags\n`);

// ============================================================================
// STEP 3: Import Tags
// ============================================================================

console.log('🏷️  Importing tags...');

const tagIdMap = new Map();

for (const tagName of allTags) {
  const slug = tagName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  try {
    const [result] = await connection.execute(
      `INSERT INTO reference_tags (name, slug, category)
       VALUES (?, ?, 'theme')
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [tagName, slug]
    );
    
    // Get the tag ID
    const [rows] = await connection.execute(
      'SELECT id FROM reference_tags WHERE slug = ?',
      [slug]
    );
    if (rows.length > 0) {
      tagIdMap.set(tagName, rows[0].id);
    }
  } catch (error) {
    console.error(`  ✗ Error importing tag "${tagName}":`, error.message);
  }
}

console.log(`✅ Imported ${tagIdMap.size} tags\n`);

// ============================================================================
// STEP 4: Import References
// ============================================================================

console.log('📚 Importing references...');

// Map entry types from CSV to database enum
const typeMapping = {
  'article': 'article',
  'book': 'book',
  'chapter': 'chapter',
  'thesis': 'thesis',
  'conference_paper': 'conference_paper',
  'report': 'report',
  'website': 'website',
  'web_entry': 'web_entry',
  'news': 'news',
  'preprint': 'preprint',
  'dataset': 'dataset',
  'software': 'software',
  'misc': 'misc'
};

let importedCount = 0;
let errorCount = 0;

for (const ref of references) {
  try {
    const entryType = typeMapping[ref.type] || 'misc';
    const year = ref.year ? parseInt(ref.year) : null;
    
    // Parse axes_secondary
    let axesSecondary = null;
    if (ref.axes_secondary) {
      const axes = ref.axes_secondary.split(';').map(a => a.trim()).filter(a => a);
      if (axes.length > 0) {
        axesSecondary = JSON.stringify(axes);
      }
    }
    
    // Parse tags
    let tags = null;
    if (ref.tags) {
      const tagList = ref.tags.split(';').map(t => t.trim()).filter(t => t);
      if (tagList.length > 0) {
        tags = JSON.stringify(tagList);
      }
    }
    
    await connection.execute(
      `INSERT INTO v3_references 
       (entry_key, entry_type, title, authors, year, container_title, publisher, doi, isbn, url, axis_primary_code, axes_secondary, notes, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         title = VALUES(title),
         authors = VALUES(authors),
         year = VALUES(year),
         container_title = VALUES(container_title),
         publisher = VALUES(publisher),
         doi = VALUES(doi),
         isbn = VALUES(isbn),
         url = VALUES(url),
         axis_primary_code = VALUES(axis_primary_code),
         axes_secondary = VALUES(axes_secondary),
         notes = VALUES(notes),
         tags = VALUES(tags)`,
      [
        ref.key,
        entryType,
        ref.title,
        ref.authors || null,
        year,
        ref.container_title || null,
        ref.publisher || null,
        ref.doi || null,
        ref.isbn || null,
        ref.url || null,
        ref.axis_primary || null,
        axesSecondary,
        ref.notes || null,
        tags
      ]
    );
    
    importedCount++;
    console.log(`  ✓ [${ref.key}] ${ref.title.substring(0, 60)}...`);
    
  } catch (error) {
    errorCount++;
    console.error(`  ✗ Error importing "${ref.key}":`, error.message);
  }
}

console.log(`\n✅ Imported ${importedCount} references (${errorCount} errors)\n`);

// ============================================================================
// STEP 5: Create Axis Connections based on secondary axes
// ============================================================================

console.log('🔗 Creating axis connections...');

// Get all axes with their IDs
const [axisRows] = await connection.execute('SELECT id, axis_code FROM thematic_axes');
const axisIdMap = new Map();
axisRows.forEach(row => axisIdMap.set(row.axis_code, row.id));

// Create connections based on references that link axes
const connectionCounts = new Map();

for (const ref of references) {
  if (!ref.axis_primary || !ref.axes_secondary) continue;
  
  const primaryCode = ref.axis_primary.split(' ')[0]; // Get just the code part
  const secondaryAxes = ref.axes_secondary.split(';').map(a => a.trim().split(' ')[0]).filter(a => a);
  
  for (const secondaryCode of secondaryAxes) {
    const key = `${primaryCode}-${secondaryCode}`;
    connectionCounts.set(key, (connectionCounts.get(key) || 0) + 1);
  }
}

let connectionCount = 0;
for (const [key, count] of connectionCounts) {
  const [sourceCode, targetCode] = key.split('-');
  const sourceId = axisIdMap.get(sourceCode);
  const targetId = axisIdMap.get(targetCode);
  
  if (sourceId && targetId && sourceId !== targetId) {
    try {
      await connection.execute(
        `INSERT INTO axis_connections (source_axis_id, target_axis_id, strength, connection_type)
         VALUES (?, ?, ?, 'related')
         ON DUPLICATE KEY UPDATE strength = VALUES(strength)`,
        [sourceId, targetId, Math.min(count, 10)]
      );
      connectionCount++;
    } catch (error) {
      // Ignore duplicate errors
    }
  }
}

console.log(`✅ Created ${connectionCount} axis connections\n`);

// ============================================================================
// Summary
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('                    IMPORT SUMMARY');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  📚 Thematic Axes:     ${thematicAxes.length}`);
console.log(`  📖 References:        ${importedCount}`);
console.log(`  🏷️  Tags:              ${tagIdMap.size}`);
console.log(`  🔗 Axis Connections:  ${connectionCount}`);
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n✨ Pack v3 import completed successfully!\n');

await connection.end();
