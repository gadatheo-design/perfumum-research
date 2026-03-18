/**
 * Batch d'enrichissement LOTUS direct — sans timeout HTTP
 * Enrichit les molécules non enrichies via l'API LOTUS
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les molécules non enrichies
const [rows] = await conn.execute(
  'SELECT id, name, cas_number as casNumber FROM molecules WHERE coconut_id IS NULL ORDER BY name ASC LIMIT 300'
);

console.log('Molecules to enrich:', rows.length);

let enriched = 0;
let notFound = 0;
const notFoundList = [];

/**
 * Normalise un nom de molécule (supprime accents, remplace grecs)
 */
function normalize(name) {
  return name
    .replace(/\u03b1/g, 'alpha').replace(/\u03b2/g, 'beta')
    .replace(/\u03b3/g, 'gamma').replace(/\u03b4/g, 'delta')
    .replace(/\u03b5/g, 'epsilon').replace(/\u03c9/g, 'omega')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*\(C\d+\)/g, '')
    .trim();
}

/**
 * Génère les variantes de recherche
 */
function getVariants(name) {
  const variants = [name];
  
  const norm = normalize(name);
  if (norm !== name) variants.push(norm);
  
  // Sans préfixe numérique (1-, 2-, 3-)
  const noNum = norm.replace(/^\d+-/, '').trim();
  if (noNum !== norm && noNum.length > 2) variants.push(noNum);
  
  // Sans préfixe stéréochimique
  const noStereo = norm.replace(/^(alpha-|beta-|gamma-|delta-|trans-|cis-|\(e\)-|\(z\)-|\(\+\)-|\(-\)-|\(r\)-|\(s\)-|dl-|d-|l-|rac-)/i, '').trim();
  if (noStereo !== norm && noStereo.length > 2) variants.push(noStereo);
  
  // Avec lettres grecques Unicode
  const withGreek = norm
    .replace(/\balpha-/gi, '\u03b1-')
    .replace(/\bbeta-/gi, '\u03b2-')
    .replace(/\bgamma-/gi, '\u03b3-')
    .replace(/\bdelta-/gi, '\u03b4-');
  if (withGreek !== norm) variants.push(withGreek);
  
  // Contenu entre parenthèses (ex: "2-MIB (2-Methylisoborneol)" → "2-Methylisoborneol")
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1] && parenMatch[1].length > 3 && !/^C\d+$/.test(parenMatch[1])) {
    variants.push(normalize(parenMatch[1]));
  }
  
  return [...new Set(variants)].filter(v => v.length > 2);
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

for (const mol of rows) {
  try {
    const variants = getVariants(mol.name);
    let found = false;
    
    for (const variant of variants) {
      const url = `https://lotus.naturalproducts.net/api/search/simple?query=${encodeURIComponent(variant)}&limit=1`;
      
      try {
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) { await sleep(500); continue; }
        
        const data = await resp.json();
        const nps = data.naturalProducts || [];
        
        if (nps.length > 0) {
          const np = nps[0];
          const lotusId = np.lotus_id || np.id || '';
          const allTaxa = np.allTaxa || [];
          const organisms = allTaxa.slice(0, 20).map((name, i) => ({
            id: i,
            name,
            rank: name.includes(' ') ? 'species' : 'higher'
          }));
          
          await conn.execute(
            'UPDATE molecules SET coconut_id = ?, np_likeness_score = ?, coconut_organisms = ?, coconut_enriched_at = NOW() WHERE id = ?',
            [lotusId, np.npl_score || null, JSON.stringify(organisms), mol.id]
          );
          
          enriched++;
          found = true;
          if (enriched % 20 === 0) {
            console.log(`[${enriched}] Enriched: ${mol.name} → ${lotusId} (variant: "${variant}")`);
          }
          break;
        }
      } catch (e) {
        // Ignorer les erreurs réseau
      }
      
      await sleep(200);
    }
    
    // Fallback par CAS si disponible
    if (!found && mol.casNumber) {
      try {
        const casUrl = `https://lotus.naturalproducts.net/api/search/simple?query=${encodeURIComponent(mol.casNumber.trim())}&limit=1`;
        const resp = await fetch(casUrl, { headers: { 'Accept': 'application/json' } });
        if (resp.ok) {
          const data = await resp.json();
          const nps = data.naturalProducts || [];
          if (nps.length > 0) {
            const np = nps[0];
            const lotusId = np.lotus_id || np.id || '';
            const allTaxa = np.allTaxa || [];
            const organisms = allTaxa.slice(0, 20).map((name, i) => ({
              id: i, name, rank: name.includes(' ') ? 'species' : 'higher'
            }));
            
            await conn.execute(
              'UPDATE molecules SET coconut_id = ?, np_likeness_score = ?, coconut_organisms = ?, coconut_enriched_at = NOW() WHERE id = ?',
              [lotusId, np.npl_score || null, JSON.stringify(organisms), mol.id]
            );
            
            enriched++;
            found = true;
            if (enriched % 20 === 0) {
              console.log(`[${enriched}] Enriched via CAS: ${mol.name} (${mol.casNumber}) → ${lotusId}`);
            }
          }
        }
        await sleep(300);
      } catch (e) {
        // Ignorer
      }
    }
    
    if (!found) {
      notFound++;
      notFoundList.push(mol.name);
    }
    
    await sleep(300);
  } catch(e) {
    console.error('Error for', mol.name, ':', e.message);
  }
}

console.log(`\n=== Résultats ===`);
console.log(`Enrichis: ${enriched}`);
console.log(`Non trouvés: ${notFound}`);
if (notFoundList.length > 0) {
  console.log(`\nMolécules non trouvées (${notFoundList.length}):`);
  notFoundList.forEach(n => console.log(' -', n));
}

// Stats finales
const [stats] = await conn.execute(
  'SELECT COUNT(*) as total, SUM(CASE WHEN coconut_id IS NOT NULL THEN 1 ELSE 0 END) as enriched FROM molecules'
);
console.log(`\nTotal: ${stats[0].total} | Enrichies: ${stats[0].enriched} (${Math.round(stats[0].enriched/stats[0].total*100)}%)`);

await conn.end();
