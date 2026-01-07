import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
SELECT 
  (SELECT COUNT(*) FROM heritage_chemotypes_timeline) as timeline_count,
  (SELECT COUNT(*) FROM molecule_evidence) as evidence_count,
  (SELECT COUNT(*) FROM bibliography_entries) as bibliography_count,
  (SELECT COUNT(*) FROM evidence_bibliography_links) as links_count,
  (SELECT COUNT(*) FROM lost_molecules) as lost_molecules_count
`);

console.log('=== Database Counts ===');
console.log('Timeline entries:', rows[0].timeline_count);
console.log('Evidence entries:', rows[0].evidence_count);
console.log('Bibliography entries:', rows[0].bibliography_count);
console.log('Evidence-Bibliography links:', rows[0].links_count);
console.log('Lost molecules:', rows[0].lost_molecules_count);

// Get sample evidence data
const [evidence] = await connection.execute(`
SELECT id, evidence_id, molecule_name, time_context, region_context, reference_id 
FROM molecule_evidence 
LIMIT 10
`);
console.log('\n=== Sample Evidence (10 first) ===');
evidence.forEach(e => {
  console.log(`- ${e.evidence_id}: ${e.molecule_name} | Time: ${e.time_context} | Region: ${e.region_context} | Ref: ${e.reference_id || 'N/A'}`);
});

// Get sample bibliography data
const [bib] = await connection.execute(`
SELECT id, entry_key, title, year, entry_type 
FROM bibliography_entries 
LIMIT 10
`);
console.log('\n=== Sample Bibliography (10 first) ===');
bib.forEach(b => {
  console.log(`- [${b.id}] ${b.entry_key}: ${b.title?.substring(0, 60)}... (${b.year})`);
});

// Get distinct time contexts
const [timeContexts] = await connection.execute(`
SELECT DISTINCT time_context FROM molecule_evidence WHERE time_context IS NOT NULL ORDER BY time_context
`);
console.log('\n=== Distinct Time Contexts ===');
timeContexts.forEach(t => console.log(`- ${t.time_context}`));

// Get distinct region contexts
const [regionContexts] = await connection.execute(`
SELECT DISTINCT region_context FROM molecule_evidence WHERE region_context IS NOT NULL ORDER BY region_context
`);
console.log('\n=== Distinct Region Contexts ===');
regionContexts.forEach(r => console.log(`- ${r.region_context}`));

await connection.end();
