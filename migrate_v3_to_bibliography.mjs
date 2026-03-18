/**
 * Migration des nouvelles références v3_references (batch1/batch2/batch3) vers bibliography_entries
 * Seules les références avec pack_version batch1/batch2/batch3 qui ne sont pas encore dans bibliography_entries
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les nouvelles références des 3 batches
const [v3refs] = await conn.execute(
  `SELECT * FROM v3_references WHERE pack_version IN ('batch1', 'batch2', 'batch3') ORDER BY id`
);

console.log(`Références à migrer : ${v3refs.length}`);

// Mapping axis_primary_code → research_domain
const axisToDomain = {
  'A1 Smell studies & critical theory': 'histoire_parfumerie',
  'B1 Olfactory art & aesthetics': 'histoire_parfumerie',
  'C3 Global scent histories beyond Eurocentrism': 'histoire_parfumerie',
  'N1 Tabac: ethnobotanique & rituels': 'tabac_cannabis',
  'M1 Cannabis: diversité colombienne (chimio/terpènes)': 'tabac_cannabis',
  'N3 Psychoactive ethnobotany (context only)': 'ethnobotanique',
  'Biotech / Conservation substitutes': 'botanique',
  'Heritage science / Lost perfumes': 'histoire_parfumerie',
  'Digital smell / Applied': 'formulation',
  'Digital smell / Hardware': 'methodologie',
  'Taxonomy & distribution': 'botanique',
  'Data infra / Repositories': 'methodologie',
};

let inserted = 0;
let skipped = 0;

for (const ref of v3refs) {
  // Vérifier si déjà dans bibliography_entries
  const [existing] = await conn.execute(
    'SELECT id FROM bibliography_entries WHERE entry_key = ?',
    [ref.entry_key]
  );
  
  if (existing.length > 0) {
    console.log(`SKIP (déjà présent): ${ref.entry_key}`);
    skipped++;
    continue;
  }
  
  // Mapper le domaine de recherche
  const researchDomain = axisToDomain[ref.axis_primary_code] || 'autre';
  
  // Parser les tags JSON
  let tagsJson = null;
  try {
    const tags = typeof ref.tags === 'string' ? JSON.parse(ref.tags) : ref.tags;
    tagsJson = JSON.stringify(tags);
  } catch (e) {
    tagsJson = '[]';
  }
  
  // Insérer dans bibliography_entries
  await conn.execute(
    `INSERT INTO bibliography_entries 
     (entry_key, entry_type, title, authors, year, journal, doi, url, abstract, tags, notes, 
      research_domain, relevance_score, read_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      ref.entry_key,
      // Mapper les types non valides dans bibliography_entries
      (['article','book','inbook','incollection','inproceedings','conference','thesis','mastersthesis','phdthesis','techreport','manual','unpublished','misc','online','patent','standard','dataset','software'].includes(ref.entry_type) ? ref.entry_type : 'misc'),
      ref.title,
      ref.authors || null,
      ref.year || null,
      ref.container_title || null,
      ref.doi || null,
      ref.url || null,
      ref.notes || null,  // notes → abstract
      tagsJson,
      ref.notes || null,
      researchDomain,
      ref.relevance_score || 3,
      ref.read_status === 'read' ? 'read' : 'unread',
    ]
  );
  
  console.log(`OK: ${ref.entry_key} → ${researchDomain}`);
  inserted++;
}

console.log(`\n=== RÉSULTAT ===`);
console.log(`Migrées : ${inserted}`);
console.log(`Ignorées (doublons) : ${skipped}`);

const [total] = await conn.execute('SELECT COUNT(*) as cnt FROM bibliography_entries');
console.log(`Total bibliography_entries : ${total[0].cnt}`);

// Vérifier la distribution par domaine des nouvelles entrées
const [domains] = await conn.execute(
  `SELECT research_domain, COUNT(*) as cnt FROM bibliography_entries 
   WHERE entry_key IN (SELECT entry_key FROM v3_references WHERE pack_version IN ('batch1','batch2','batch3'))
   GROUP BY research_domain ORDER BY cnt DESC`
);
console.log('\nDistribution par domaine des nouvelles entrées:');
domains.forEach(d => console.log(` - ${d.research_domain}: ${d.cnt}`));

await conn.end();
