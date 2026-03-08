/**
 * Import des bibliographies depuis Notion vers la base PERFUMUM
 * Sources :
 * - /tmp/biblio_resources.txt : Bibliographie Resources & Archive (tableau structuré)
 * - /tmp/biblio_tabac_refs.json : Références Tabac Ancien (5 entrées)
 */
import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { randomBytes } from 'crypto';

const db = await createConnection(process.env.DATABASE_URL);

function randomSuffix() {
  return randomBytes(4).toString('hex');
}

function extractTableRows(text) {
  const rows = [];
  const lines = text.split('\n');
  let inTable = false;
  let headers = [];
  let currentRow = {};
  let currentKey = null;

  for (const line of lines) {
    if (line.trim() === '<table>') {
      inTable = true;
      headers = [];
      currentRow = {};
      continue;
    }
    if (line.trim() === '</table>') {
      inTable = false;
      if (Object.keys(currentRow).length > 0) rows.push({ ...currentRow });
      currentRow = {};
      continue;
    }
    if (!inTable) continue;

    if (line.trim() === '<tr>') {
      if (Object.keys(currentRow).length > 0 && headers.length > 0) {
        rows.push({ ...currentRow });
      }
      currentRow = {};
      currentKey = null;
      continue;
    }
    if (line.trim() === '</tr>') continue;

    const tdMatch = line.match(/^<td>(.*)<\/td>$/);
    if (tdMatch) {
      const val = tdMatch[1].trim();
      if (headers.length === 0) {
        // Première ligne = headers
        headers.push(val);
        currentKey = val;
      } else {
        const headerIdx = Object.keys(currentRow).length;
        if (headerIdx < headers.length) {
          currentRow[headers[headerIdx]] = val;
        }
      }
    }
  }
  // Ajouter la dernière ligne si nécessaire
  if (Object.keys(currentRow).length > 0) rows.push({ ...currentRow });
  
  // Filtrer la ligne d'en-tête
  return rows.filter(r => r.author !== 'author' && r.title !== 'title');
}

// ============================================================
// 1. Extraire les références de la page Bibliographie Resources
// ============================================================
console.log('=== IMPORT BIBLIOGRAPHIE RESOURCES & ARCHIVE ===');
const biblioText = readFileSync('/tmp/biblio_resources.txt', 'utf-8');
const rows = extractTableRows(biblioText);
console.log(`Références extraites: ${rows.length}`);

// Vérifier les colonnes disponibles
const [cols] = await db.execute('DESCRIBE bibliography_entries');
const colNames = cols.map(c => c.Field);
console.log('Colonnes disponibles:', colNames.join(', '));

// Vérifier les entrées existantes
const [existing] = await db.execute('SELECT entry_key, title FROM bibliography_entries');
const existingKeys = new Set(existing.map(e => e.entry_key));
const existingTitles = new Set(existing.map(e => e.title?.toLowerCase().trim()));

let imported = 0;
let skipped = 0;
let errors = 0;

for (const row of rows) {
  if (!row.title || !row.author) {
    skipped++;
    continue;
  }
  
  const titleNorm = row.title.toLowerCase().trim();
  if (existingTitles.has(titleNorm)) {
    skipped++;
    continue;
  }

  // Nettoyer l'URL (enlever les crochets markdown)
  const urlClean = row.url ? row.url.replace(/\[([^\]]+)\]\(([^)]+)\)/, '$2').trim() : null;
  
  // Générer entry_key
  const entryKey = row.id || `B-${randomSuffix()}`;
  
  try {
    // Construire l'insert selon les colonnes disponibles
    const insertData = {};
    if (colNames.includes('entry_key')) insertData.entry_key = entryKey;
    if (colNames.includes('title')) insertData.title = row.title.substring(0, 500);
    if (colNames.includes('authors')) insertData.authors = row.author.substring(0, 300);
    if (colNames.includes('year')) insertData.year = row.year ? parseInt(row.year) || null : null;
    if (colNames.includes('publication')) insertData.publication = row.publication?.substring(0, 300) || null;
    if (colNames.includes('publisher')) insertData.publisher = row.publisher?.substring(0, 300) || null;
    if (colNames.includes('url')) insertData.url = urlClean?.substring(0, 1000) || null;
    if (colNames.includes('type')) insertData.type = row.type?.substring(0, 100) || 'Publication Académique';
    if (colNames.includes('category')) insertData.category = row.category?.substring(0, 200) || null;
    if (colNames.includes('source')) insertData.source = 'Notion PERFUMUM';
    if (colNames.includes('notion_id')) insertData.notion_id = row.id?.substring(0, 50) || null;

    const keys = Object.keys(insertData);
    const vals = Object.values(insertData);
    const placeholders = keys.map(() => '?').join(', ');
    
    await db.execute(
      `INSERT INTO bibliography_entries (${keys.join(', ')}) VALUES (${placeholders})`,
      vals
    );
    imported++;
    existingTitles.add(titleNorm);
  } catch (err) {
    console.error(`  Erreur: ${row.title?.substring(0, 40)} — ${err.message}`);
    errors++;
  }
}

console.log(`\nBibliographie Resources: ${imported} importées, ${skipped} ignorées, ${errors} erreurs`);

// ============================================================
// 2. Importer les références Tabac Ancien
// ============================================================
console.log('\n=== IMPORT BIBLIOGRAPHIE TABAC ANCIEN ===');
const tabacRefs = JSON.parse(readFileSync('/tmp/biblio_tabac_refs.json', 'utf-8'));
let importedTabac = 0;

for (const ref of tabacRefs) {
  const titleNorm = ref.titre?.toLowerCase().trim();
  if (!titleNorm || existingTitles.has(titleNorm)) continue;
  
  const entryKey = `B-TAB-${randomSuffix()}`;
  try {
    const insertData = {};
    if (colNames.includes('entry_key')) insertData.entry_key = entryKey;
    if (colNames.includes('title')) insertData.title = ref.titre.substring(0, 500);
    if (colNames.includes('authors')) insertData.authors = ref.auteur?.substring(0, 300) || 'Inconnu';
    if (colNames.includes('year')) insertData.year = ref.annee || null;
    if (colNames.includes('type')) insertData.type = 'Bibliographie Tabac Historique';
    if (colNames.includes('category')) insertData.category = 'tobacco_historical';
    if (colNames.includes('source')) insertData.source = 'Notion PERFUMUM';

    const keys = Object.keys(insertData);
    const vals = Object.values(insertData);
    const placeholders = keys.map(() => '?').join(', ');
    
    await db.execute(
      `INSERT INTO bibliography_entries (${keys.join(', ')}) VALUES (${placeholders})`,
      vals
    );
    importedTabac++;
    existingTitles.add(titleNorm);
  } catch (err) {
    console.error(`  Erreur: ${ref.titre?.substring(0, 40)} — ${err.message}`);
  }
}

console.log(`Bibliographie Tabac: ${importedTabac} importées`);

// ============================================================
// 3. Vérification finale
// ============================================================
const [total] = await db.execute('SELECT COUNT(*) as count FROM bibliography_entries');
console.log(`\n✅ Total bibliographie en base: ${total[0].count}`);

await db.end();
