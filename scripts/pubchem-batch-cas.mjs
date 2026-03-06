/**
 * Script de batch PubChem — enrichit 100 molécules sans CID PubChem
 * Stratégie multi-tentatives : nom nettoyé → nom anglais → IUPAC → CAS existant
 * Usage : node scripts/pubchem-batch-100.mjs
 */
import mysql2 from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL non défini');
  process.exit(1);
}

const BATCH_SIZE = 100;
const DELAY_MS = 250;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Nettoie un nom de molécule pour la recherche PubChem
 * Retire les parenthèses, tirets longs, noms de plantes, etc.
 */
function cleanName(name) {
  return name
    // Retirer tout ce qui est entre parenthèses ou après —
    .replace(/\s*—.*$/, '')
    .replace(/\s*\(.*?\)/g, '')
    // Retirer les accents pour certains termes
    .replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u')
    .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ç]/g, 'c')
    // Traductions simples FR→EN
    .replace(/^Acide\s+/i, 'acid ')
    .replace(/^Alcool\s+/i, 'alcohol ')
    .replace(/^Aldéhyde\s+/i, 'aldehyde ')
    .replace(/^Ester\s+/i, 'ester ')
    .replace(/^Bêta-/i, 'beta-')
    .replace(/^Alpha-/i, 'alpha-')
    .replace(/^Gamma-/i, 'gamma-')
    .replace(/^Beta-/i, 'beta-')
    .trim();
}

/**
 * Recherche une molécule sur PubChem par nom
 */
async function fetchPubChemByName(name) {
  const encoded = encodeURIComponent(name);
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encoded}/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) return null;
    return {
      cid: props.CID,
      iupacName: props.IUPACName || null,
      formula: props.MolecularFormula || null,
      weight: props.MolecularWeight ? parseFloat(props.MolecularWeight) : null,
      smiles: props.CanonicalSMILES || null,
    };
  } catch {
    return null;
  }
}

/**
 * Recherche par CAS number
 */
async function fetchPubChemByCAS(cas) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${cas}/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) return null;
    return {
      cid: props.CID,
      iupacName: props.IUPACName || null,
      formula: props.MolecularFormula || null,
      weight: props.MolecularWeight ? parseFloat(props.MolecularWeight) : null,
      smiles: props.CanonicalSMILES || null,
    };
  } catch {
    return null;
  }
}

/**
 * Récupère le numéro CAS depuis les synonymes PubChem
 */
async function fetchCASFromPubChem(cid) {
  try {
    const synUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
    const res = await fetch(synUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const synonyms = data?.InformationList?.Information?.[0]?.Synonym || [];
    return synonyms.find(s => /^\d{2,7}-\d{2}-\d$/.test(s)) || null;
  } catch {
    return null;
  }
}

/**
 * Stratégie multi-tentatives pour trouver une molécule sur PubChem
 */
async function enrichMolecule(mol) {
  const strategies = [];
  
  // 1. Nom original
  strategies.push(mol.name);
  
  // 2. Nom nettoyé
  const cleaned = cleanName(mol.name);
  if (cleaned !== mol.name) strategies.push(cleaned);
  
  // 3. Si le nom contient des parenthèses, essayer le contenu des parenthèses
  const parenMatch = mol.name.match(/\(([^)]+)\)/);
  if (parenMatch) strategies.push(parenMatch[1]);
  
  // 4. Si CAS disponible, essayer par CAS
  if (mol.cas_number && /^\d{2,7}-\d{2}-\d$/.test(mol.cas_number)) {
    strategies.push(`CAS:${mol.cas_number}`);
  }
  
  // 5. Si IUPAC disponible
  if (mol.iupac_name) strategies.push(mol.iupac_name);
  
  for (const strategy of strategies) {
    await sleep(150);
    let result;
    if (strategy.startsWith('CAS:')) {
      result = await fetchPubChemByCAS(strategy.replace('CAS:', ''));
    } else {
      result = await fetchPubChemByName(strategy);
    }
    if (result) return { result, strategy };
  }
  
  return null;
}

async function main() {
  const conn = await mysql2.createConnection(DATABASE_URL);
  
  // Récupérer les molécules sans CID PubChem (avec iupac_name et smiles pour les stratégies)
  const [rows] = await conn.execute(
    `SELECT id, name, cas_number, iupac_name, smiles FROM molecules WHERE pubchem_cid IS NULL AND cas_number IS NOT NULL AND cas_number != '' ORDER BY name LIMIT ${BATCH_SIZE}`
  );
  
  console.log(`\n🔬 Batch PubChem — ${rows.length} molécules à enrichir\n`);
  
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const mol = rows[i];
    const label = mol.name.length > 42 ? mol.name.substring(0, 39) + '...' : mol.name;
    process.stdout.write(`[${String(i + 1).padStart(3)}/${rows.length}] ${label.padEnd(43)} `);
    
    const found = await enrichMolecule(mol);
    
    if (!found) {
      console.log('❌');
      failed++;
      await sleep(DELAY_MS);
      continue;
    }
    
    const { result, strategy } = found;
    
    // Récupérer CAS si pas déjà en base
    let casNumber = mol.cas_number;
    if (!casNumber && result.cid) {
      await sleep(100);
      casNumber = await fetchCASFromPubChem(result.cid);
    }
    
    // Construire la mise à jour
    const updates = [];
    const params = [];
    
    if (result.cid) { updates.push('pubchem_cid = ?'); params.push(result.cid); }
    if (result.iupacName && !mol.iupac_name) { updates.push('iupac_name = ?'); params.push(result.iupacName); }
    if (result.formula) { updates.push('chemicalFormula = ?'); params.push(result.formula); }
    if (result.weight) { updates.push('molecularWeight = ?'); params.push(parseFloat(result.weight)); }
    if (result.smiles && !mol.smiles) { updates.push('smiles = ?'); params.push(result.smiles); }
    if (casNumber && !mol.cas_number) { updates.push('cas_number = ?'); params.push(casNumber); }
    
    if (updates.length > 0) {
      params.push(mol.id);
      await conn.execute(
        `UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }
    
    const strategyLabel = strategy !== mol.name ? ` [via: ${strategy.substring(0, 20)}]` : '';
    console.log(`✅ CID:${result.cid}${casNumber ? ` CAS:${casNumber}` : ''}${strategyLabel}`);
    success++;
    
    await sleep(DELAY_MS);
  }
  
  await conn.end();
  
  console.log('\n' + '='.repeat(65));
  console.log(`✅ Enrichies  : ${success}`);
  console.log(`❌ Non trouvées: ${failed}`);
  console.log(`📊 Total batch : ${rows.length}`);
  
  // Vérifier le nouveau total
  const conn2 = await mysql2.createConnection(DATABASE_URL);
  const [[{ cnt }]] = await conn2.execute('SELECT COUNT(*) as cnt FROM molecules WHERE pubchem_cid IS NOT NULL');
  const [[{ total }]] = await conn2.execute('SELECT COUNT(*) as total FROM molecules');
  console.log(`\n🎯 Total enrichies en base : ${cnt}/${total} (${Math.round(cnt/total*100)}%)`);
  await conn2.end();
}

main().catch(err => {
  console.error('Erreur fatale:', err.message);
  process.exit(1);
});
