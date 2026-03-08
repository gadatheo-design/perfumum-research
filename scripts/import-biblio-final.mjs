import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { randomBytes } from 'crypto';

const db = await createConnection(process.env.DATABASE_URL);
const refs = JSON.parse(readFileSync('/tmp/biblio_resources_parsed.json', 'utf-8'));

// Mapper les types Notion vers les valeurs ENUM entry_type
function mapEntryType(notionType) {
  if (!notionType) return 'misc';
  const t = notionType.toLowerCase();
  if (t.includes('académique') || t.includes('article') || t.includes('publication')) return 'article';
  if (t.includes('livre') || t.includes('book') || t.includes('ouvrage')) return 'book';
  if (t.includes('thèse') || t.includes('these') || t.includes('thesis')) return 'thesis';
  if (t.includes('rapport') || t.includes('report')) return 'techreport';
  if (t.includes('conférence') || t.includes('conference')) return 'conference';
  if (t.includes('manuel') || t.includes('manual')) return 'manual';
  if (t.includes('en ligne') || t.includes('online') || t.includes('web') || t.includes('site')) return 'online';
  if (t.includes('dataset') || t.includes('données')) return 'dataset';
  return 'misc';
}

// Mapper les catégories Notion vers les valeurs ENUM research_domain
function mapResearchDomain(category) {
  if (!category) return null;
  const c = category.toLowerCase();
  if (c.includes('olfactory_heritage') || c.includes('heritage') || c.includes('patrimoine')) return 'histoire_parfumerie';
  if (c.includes('tobacco') || c.includes('cannabis') || c.includes('tabac')) return 'tabac_cannabis';
  if (c.includes('botani') || c.includes('plant') || c.includes('ritual')) return 'ethnobotanique';
  if (c.includes('chemi') || c.includes('chimie') || c.includes('molecule')) return 'chimie_olfactive';
  if (c.includes('neuro') || c.includes('perception')) return 'neurologie_olfactive';
  if (c.includes('extract') || c.includes('distill')) return 'extraction';
  if (c.includes('formul')) return 'formulation';
  if (c.includes('regle') || c.includes('legal') || c.includes('law')) return 'reglementation';
  if (c.includes('durab') || c.includes('sustain')) return 'durabilite';
  if (c.includes('method')) return 'methodologie';
  return 'autre';
}

const [existing] = await db.execute('SELECT title FROM bibliography_entries');
const existingTitles = new Set(existing.map(e => e.title?.toLowerCase().trim()));

let imported = 0, skipped = 0;

for (const ref of refs) {
  if (!ref.title) { skipped++; continue; }
  const titleNorm = ref.title.toLowerCase().trim();
  if (existingTitles.has(titleNorm)) { skipped++; continue; }

  const entryKey = ref.id || `B-${randomBytes(4).toString('hex')}`;
  const urlClean = ref.url ? ref.url.replace(/\[([^\]]+)\]\(([^)]+)\)/, '$2').trim() : null;
  const entryType = mapEntryType(ref.type);
  const researchDomain = mapResearchDomain(ref.category);

  try {
    await db.execute(
      `INSERT INTO bibliography_entries 
       (entry_key, entry_type, title, authors, year, journal, publisher, url, research_domain, tags, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entryKey,
        entryType,
        ref.title.substring(0, 500),
        ref.author?.substring(0, 300) || 'Inconnu',
        ref.year ? parseInt(ref.year) || null : null,
        ref.publication?.substring(0, 300) || null,
        ref.publisher?.substring(0, 300) || null,
        urlClean?.substring(0, 1000) || null,
        researchDomain,
        JSON.stringify([ref.category || 'bibliographie']),
        'Source: Notion PERFUMUM — Resources & Archive'
      ]
    );
    imported++;
    existingTitles.add(titleNorm);
    console.log(`  ✓ [${entryKey}] ${ref.title.substring(0, 55)}`);
  } catch (err) {
    console.error(`  ✗ ${ref.title?.substring(0, 40)} — ${err.message}`);
  }
}

const [total] = await db.execute('SELECT COUNT(*) as count FROM bibliography_entries');
console.log(`\nImportées: ${imported}, Ignorées: ${skipped}`);
console.log(`Total bibliographie: ${total[0].count}`);
await db.end();
