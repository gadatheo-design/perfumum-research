/**
 * Script d'enrichissement botanique via GBIF API
 * Renseigne synonyms, author_citation, gbif_id, itis_id pour les plantes prioritaires
 * Usage : node scripts/enrich-plants-gbif.mjs
 */
import mysql2 from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL non défini'); process.exit(1); }

const DELAY_MS = 350;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchGBIF(latinName) {
  const cleanName = latinName
    .replace(/\s*\(.*?\)/g, '').replace(/\s+var\.\s+\w+/i, '')
    .replace(/\s+subsp\.\s+\w+/i, '').replace(/\s+L\.$/, '')
    .replace(/\s+Brenan$/, '').replace(/\s+Speg\.$/, '')
    .replace(/\s+\(Vell\.\).*$/, '').replace(/\s+\(profil.*$/, '')
    .replace(/\s+\(source.*$/, '').trim();
  const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(cleanName)}&verbose=true`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.matchType === 'NONE' || !data.usageKey) return null;
    return { gbifKey: data.usageKey, authorship: data.authorship || null, matchType: data.matchType };
  } catch { return null; }
}

async function fetchGBIFSynonyms(gbifKey) {
  const url = `https://api.gbif.org/v1/species/${gbifKey}/synonyms?limit=20`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(s => s.scientificName).filter(Boolean).slice(0, 10);
  } catch { return []; }
}

async function fetchITIS(latinName) {
  const cleanName = latinName.replace(/\s*\(.*?\)/g, '').replace(/\s+var\.\s+\w+/i, '').trim();
  const url = `https://www.itis.gov/ITISWebService/jsonservice/searchByScientificName?srchKey=${encodeURIComponent(cleanName)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.scientificNames || [];
    return results[0]?.tsn?.toString() || null;
  } catch { return null; }
}

async function main() {
  const conn = await mysql2.createConnection(DATABASE_URL);
  const [plants] = await conn.execute(`
    SELECT p.id, p.latin_name, p.family, COUNT(DISTINCT pm.molecule_id) as mol_count
    FROM plants p
    LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
    WHERE p.latin_name IS NOT NULL AND p.latin_name != '' AND p.synonyms IS NULL
    GROUP BY p.id, p.latin_name, p.family
    ORDER BY mol_count DESC
    LIMIT 30
  `);
  console.log(`\n🌿 Enrichissement botanique GBIF — ${plants.length} plantes\n`);
  let success = 0, failed = 0;
  for (let i = 0; i < plants.length; i++) {
    const plant = plants[i];
    const label = plant.latin_name.substring(0, 40).padEnd(41);
    process.stdout.write(`[${String(i + 1).padStart(2)}/${plants.length}] ${label} `);
    const gbifData = await fetchGBIF(plant.latin_name);
    if (!gbifData) { console.log('❌ Non trouvé'); failed++; await sleep(DELAY_MS); continue; }
    await sleep(200);
    const synonyms = await fetchGBIFSynonyms(gbifData.gbifKey);
    await sleep(200);
    let itisId = null;
    try { itisId = await fetchITIS(plant.latin_name); } catch {}
    const updates = [], params = [];
    if (gbifData.gbifKey) { updates.push('gbif_id = ?'); params.push(gbifData.gbifKey.toString()); }
    if (gbifData.authorship) { updates.push('author_citation = ?'); params.push(gbifData.authorship); }
    if (synonyms.length > 0) { updates.push('synonyms = ?'); params.push(JSON.stringify(synonyms)); }
    if (itisId) { updates.push('itis_id = ?'); params.push(itisId); }
    if (updates.length > 0) { params.push(plant.id); await conn.execute(`UPDATE plants SET ${updates.join(', ')} WHERE id = ?`, params); }
    console.log(`✅ GBIF:${gbifData.gbifKey} ${synonyms.length} syn.${itisId ? ` ITIS:${itisId}` : ''}`);
    success++;
    await sleep(DELAY_MS);
  }
  await conn.end();
  console.log(`\n${'='.repeat(60)}\n✅ Enrichies: ${success} | ❌ Non trouvées: ${failed}`);
  const conn2 = await mysql2.createConnection(DATABASE_URL);
  const [[{ withGbif }]] = await conn2.execute('SELECT COUNT(*) as cnt FROM plants WHERE gbif_id IS NOT NULL');
  const [[{ total }]] = await conn2.execute('SELECT COUNT(*) as total FROM plants');
  console.log(`🌿 Plantes avec GBIF ID: ${withGbif}/${total}`);
  await conn2.end();
}
main().catch(err => { console.error('Erreur:', err.message); process.exit(1); });
