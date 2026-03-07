/**
 * Batch PubChem #3 — Molécules sans CAS et sans CID
 * Stratégie : nom nettoyé → IUPAC name → SMILES → traduction anglaise
 * Usage : node scripts/pubchem-batch-nocas.mjs
 */
import mysql2 from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL non défini'); process.exit(1); }

const BATCH_SIZE = 100;
const DELAY_MS = 400;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Dictionnaire de traductions FR→EN pour les noms courants
const FR_TO_EN = {
  'acide': 'acid', 'acétique': 'acetic', 'benzoïque': 'benzoic', 'citrique': 'citric',
  'formique': 'formic', 'lactique': 'lactic', 'malique': 'malic', 'oxalique': 'oxalic',
  'palmitique': 'palmitic', 'stéarique': 'stearic', 'oléique': 'oleic', 'linoléique': 'linoleic',
  'alpha': 'alpha', 'bêta': 'beta', 'gamma': 'gamma', 'delta': 'delta',
  'méthyl': 'methyl', 'éthyl': 'ethyl', 'propyl': 'propyl', 'butyl': 'butyl',
  'phényl': 'phenyl', 'benzyl': 'benzyl', 'vinyl': 'vinyl', 'allyl': 'allyl',
  'hydroxyl': 'hydroxyl', 'carbonyl': 'carbonyl', 'aldéhyde': 'aldehyde',
  'cétone': 'ketone', 'ester': 'ester', 'éther': 'ether', 'alcool': 'alcohol',
  'terpène': 'terpene', 'sesquiterpène': 'sesquiterpene', 'diterpène': 'diterpene',
  'monoterpène': 'monoterpene', 'triterpène': 'triterpene', 'flavonoïde': 'flavonoid',
  'alcaloïde': 'alkaloid', 'glycoside': 'glycoside', 'phénol': 'phenol',
  'coumarine': 'coumarin', 'lactone': 'lactone', 'furane': 'furan',
  'pyrazine': 'pyrazine', 'pyridine': 'pyridine', 'indole': 'indole',
  'musque': 'musk', 'musqué': 'musk', 'ambré': 'amber', 'ambre': 'amber',
  'géraniol': 'geraniol', 'linalool': 'linalool', 'citronellol': 'citronellol',
  'nérol': 'nerol', 'terpinéol': 'terpineol', 'menthol': 'menthol',
  'camphre': 'camphor', 'bornéol': 'borneol', 'fenchol': 'fenchol',
  'carvone': 'carvone', 'pulegone': 'pulegone', 'thymol': 'thymol',
  'carvacrol': 'carvacrol', 'eugénol': 'eugenol', 'isoeugénol': 'isoeugenol',
  'safrole': 'safrole', 'myristicine': 'myristicin', 'élémine': 'elemicin',
  'cinnamaldéhyde': 'cinnamaldehyde', 'benzaldéhyde': 'benzaldehyde',
  'vanilline': 'vanillin', 'héliotropine': 'heliotropin', 'coumarine': 'coumarin',
};

function translateFrToEn(name) {
  let result = name.toLowerCase();
  for (const [fr, en] of Object.entries(FR_TO_EN)) {
    result = result.replace(new RegExp(fr, 'gi'), en);
  }
  return result.trim();
}

function cleanMoleculeName(name) {
  return name
    .replace(/\s*\(.*?\)/g, '')
    .replace(/\s*—.*$/, '')
    .replace(/^\d+[,\-]\d+[,\-]?/, '')
    .replace(/^[αβγδ]-/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function searchPubChemByName(name) {
  const variants = [
    name,
    cleanMoleculeName(name),
    translateFrToEn(name),
    translateFrToEn(cleanMoleculeName(name)),
  ];
  const seen = new Set();
  for (const variant of variants) {
    if (!variant || variant.length < 3 || seen.has(variant.toLowerCase())) continue;
    seen.add(variant.toLowerCase());
    try {
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(variant)}/property/IUPACName,MolecularFormula,MolecularWeight,InChIKey/JSON`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        const prop = data?.PropertyTable?.Properties?.[0];
        if (prop?.CID) return { cid: prop.CID.toString(), source: `name:${variant}`, formula: prop.MolecularFormula, weight: prop.MolecularWeight, inchikey: prop.InChIKey, iupac: prop.IUPACName };
      }
    } catch {}
    await sleep(200);
  }
  return null;
}

async function searchPubChemByIUPAC(iupacName) {
  if (!iupacName || iupacName.length < 3) return null;
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(iupacName)}/property/IUPACName,MolecularFormula,MolecularWeight,InChIKey/JSON`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const prop = data?.PropertyTable?.Properties?.[0];
      if (prop?.CID) return { cid: prop.CID.toString(), source: `iupac:${iupacName.substring(0, 30)}`, formula: prop.MolecularFormula, weight: prop.MolecularWeight, inchikey: prop.InChIKey, iupac: prop.IUPACName };
    }
  } catch {}
  return null;
}

async function searchPubChemBySMILES(smiles) {
  if (!smiles || smiles.length < 3) return null;
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/IUPACName,MolecularFormula,MolecularWeight,InChIKey/JSON`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const prop = data?.PropertyTable?.Properties?.[0];
      if (prop?.CID) return { cid: prop.CID.toString(), source: 'smiles', formula: prop.MolecularFormula, weight: prop.MolecularWeight, inchikey: prop.InChIKey, iupac: prop.IUPACName };
    }
  } catch {}
  return null;
}

async function main() {
  const conn = await mysql2.createConnection(DATABASE_URL);
  const [molecules] = await conn.execute(
    `SELECT id, name, iupac_name, smiles FROM molecules
     WHERE pubchem_cid IS NULL AND (cas_number IS NULL OR cas_number = '')
     ORDER BY name LIMIT ${BATCH_SIZE}`
  );
  console.log(`\n🔬 Batch PubChem #3 — ${molecules.length} molécules sans CAS\n`);
  let success = 0, failed = 0;
  for (let i = 0; i < molecules.length; i++) {
    const mol = molecules[i];
    const label = mol.name.substring(0, 40).padEnd(41);
    process.stdout.write(`[${String(i + 1).padStart(3)}/${molecules.length}] ${label} `);
    // Stratégie 1 : nom
    let result = await searchPubChemByName(mol.name);
    await sleep(DELAY_MS);
    // Stratégie 2 : IUPAC name
    if (!result && mol.iupac_name) {
      result = await searchPubChemByIUPAC(mol.iupac_name);
      await sleep(DELAY_MS);
    }
    // Stratégie 3 : SMILES
    if (!result && mol.smiles) {
      result = await searchPubChemBySMILES(mol.smiles);
      await sleep(DELAY_MS);
    }
    if (!result) { console.log('❌ Non trouvé'); failed++; continue; }
    // Sauvegarder en base
    const updates = ['pubchem_cid = ?'];
    const params = [result.cid];
    if (result.formula) { updates.push('chemicalFormula = ?'); params.push(result.formula); }
    if (result.weight) { updates.push('molecularWeight = ?'); params.push(Math.round(parseFloat(result.weight))); }
    if (result.inchikey) { updates.push('inchi_key = ?'); params.push(result.inchikey); }
    if (result.iupac && !mol.iupac_name) { updates.push('iupac_name = ?'); params.push(result.iupac.substring(0, 499)); }
    params.push(mol.id);
    await conn.execute(`UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`, params);
    console.log(`✅ CID:${result.cid} [${result.source}]`);
    success++;
    await sleep(DELAY_MS);
  }
  await conn.end();
  console.log(`\n${'='.repeat(65)}`);
  console.log(`✅ Enrichies  : ${success}`);
  console.log(`❌ Non trouvées: ${failed}`);
  console.log(`📊 Total batch : ${molecules.length}`);
  const conn2 = await mysql2.createConnection(DATABASE_URL);
  const [[{ cnt }]] = await conn2.execute('SELECT COUNT(*) as cnt FROM molecules WHERE pubchem_cid IS NOT NULL');
  const [[{ total }]] = await conn2.execute('SELECT COUNT(*) as total FROM molecules');
  console.log(`🎯 Total enrichies en base : ${cnt}/${total} (${Math.round(cnt/total*100)}%)`);
  await conn2.end();
}
main().catch(err => { console.error('Erreur:', err.message); process.exit(1); });
