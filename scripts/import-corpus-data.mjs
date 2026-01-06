/**
 * Script d'import des données du corpus PERFUMUM
 * - Manuscrits (perfumum_manuscripts)
 * - Fragments textuels (text_fragments)
 * - Routes commerciales (trade_routes)
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Chemins des fichiers source
const DATA_DIR = '/home/ubuntu/upload';
const FILES = {
  manuscripts: path.join(DATA_DIR, 'manuscripts_seed.csv'),
  textFragments: path.join(DATA_DIR, 'text_fragments_seed.csv'),
  tradeRoutes: path.join(DATA_DIR, 'trade_routes_seed.csv'),
};

// Fonction pour parser un fichier CSV
function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Fichier non trouvé: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });
}

// Fonction pour générer les instructions SQL d'insertion
function generateManuscriptsSQL(records) {
  const values = records.map(r => {
    const tags = r.tags ? JSON.stringify(r.tags.split(';').filter(Boolean)) : '[]';
    return `(
      '${r.manuscript_id}',
      '${(r.title || '').replace(/'/g, "''")}',
      '${r.language || 'unknown'}',
      '${r.date_range || ''}',
      '${(r.repository || '').replace(/'/g, "''")}',
      '${r.region || ''}',
      '${r.license || 'Unknown'}',
      ${r.scan_url ? `'${r.scan_url}'` : 'NULL'},
      '${r.ocr_status || 'queued'}',
      '${tags}',
      'AX2_ETHNOBOTANY_COMP'
    )`;
  });

  return `INSERT INTO perfumum_manuscripts 
    (manuscript_id, title, language, date_range, repository, region, license, scan_url, ocr_status, tags, axis_id)
  VALUES
    ${values.join(',\n    ')}
  ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    language = VALUES(language),
    date_range = VALUES(date_range),
    repository = VALUES(repository),
    region = VALUES(region),
    license = VALUES(license),
    scan_url = VALUES(scan_url),
    ocr_status = VALUES(ocr_status),
    tags = VALUES(tags);`;
}

function generateTextFragmentsSQL(records) {
  const values = records.map(r => {
    const entities = r.entities || '[]';
    return `(
      '${r.fragment_id}',
      '${r.manuscript_id}',
      '${r.language || 'unknown'}',
      ${r.original_text ? `'${(r.original_text || '').replace(/'/g, "''")}'` : 'NULL'},
      ${r.translation_fr ? `'${(r.translation_fr || '').replace(/'/g, "''")}'` : 'NULL'},
      NULL,
      '${entities.replace(/'/g, "''")}',
      '${r.evidence_level || 'hypothetical'}',
      ${r.notes ? `'${(r.notes || '').replace(/'/g, "''")}'` : 'NULL'},
      'AX2_ETHNOBOTANY_COMP'
    )`;
  });

  return `INSERT INTO text_fragments 
    (fragment_id, manuscript_id, language, original_text, translation_fr, translation_en, entities, evidence_level, notes, axis_id)
  VALUES
    ${values.join(',\n    ')}
  ON DUPLICATE KEY UPDATE
    manuscript_id = VALUES(manuscript_id),
    language = VALUES(language),
    original_text = VALUES(original_text),
    translation_fr = VALUES(translation_fr),
    entities = VALUES(entities),
    evidence_level = VALUES(evidence_level),
    notes = VALUES(notes);`;
}

function generateTradeRoutesSQL(records) {
  const values = records.map(r => {
    const nodes = r.nodes || '[]';
    const materials = r.materials ? JSON.stringify(r.materials.split(';').filter(Boolean)) : '[]';
    const sources = r.sources ? JSON.stringify(r.sources.split(';').filter(Boolean)) : '[]';
    
    return `(
      '${r.route_id}',
      '${(r.name || '').replace(/'/g, "''")}',
      ${r.time_start || 'NULL'},
      ${r.time_end || 'NULL'},
      '${nodes.replace(/'/g, "''")}',
      '${materials}',
      ${r.notes ? `'${(r.notes || '').replace(/'/g, "''")}'` : 'NULL'},
      '${sources}',
      'AX2_ETHNOBOTANY_COMP'
    )`;
  });

  return `INSERT INTO trade_routes 
    (route_id, name, time_start, time_end, nodes, materials, notes, sources, axis_id)
  VALUES
    ${values.join(',\n    ')}
  ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    time_start = VALUES(time_start),
    time_end = VALUES(time_end),
    nodes = VALUES(nodes),
    materials = VALUES(materials),
    notes = VALUES(notes),
    sources = VALUES(sources);`;
}

// Exécution principale
console.log('📚 Import des données du corpus PERFUMUM\n');

// Lire les fichiers
const manuscripts = parseCSV(FILES.manuscripts);
const textFragments = parseCSV(FILES.textFragments);
const tradeRoutes = parseCSV(FILES.tradeRoutes);

console.log(`📜 Manuscrits: ${manuscripts.length} entrées`);
console.log(`📝 Fragments textuels: ${textFragments.length} entrées`);
console.log(`🛤️ Routes commerciales: ${tradeRoutes.length} entrées\n`);

// Générer les fichiers SQL
const outputDir = '/home/ubuntu/perfumum-research/scripts/sql';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (manuscripts.length > 0) {
  const sql = generateManuscriptsSQL(manuscripts);
  fs.writeFileSync(path.join(outputDir, 'import_manuscripts.sql'), sql);
  console.log('✅ Fichier SQL généré: import_manuscripts.sql');
}

if (textFragments.length > 0) {
  const sql = generateTextFragmentsSQL(textFragments);
  fs.writeFileSync(path.join(outputDir, 'import_text_fragments.sql'), sql);
  console.log('✅ Fichier SQL généré: import_text_fragments.sql');
}

if (tradeRoutes.length > 0) {
  const sql = generateTradeRoutesSQL(tradeRoutes);
  fs.writeFileSync(path.join(outputDir, 'import_trade_routes.sql'), sql);
  console.log('✅ Fichier SQL généré: import_trade_routes.sql');
}

console.log('\n📁 Fichiers SQL générés dans:', outputDir);
console.log('Pour importer, exécutez les fichiers SQL via la console de base de données.');
