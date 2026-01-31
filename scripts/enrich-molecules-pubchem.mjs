/**
 * Script d'enrichissement des données moléculaires via PubChem PUG REST API
 * 
 * Ce script récupère les molécules et les enrichit avec les données PubChem:
 * - CID, SMILES, InChI, InChIKey
 * - Propriétés physico-chimiques (MW, XLogP, TPSA, etc.)
 * - Numéro CAS et synonymes
 */

import mysql from 'mysql2/promise';

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 500; // 2 requêtes/seconde pour être safe

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function extractCAS(synonyms) {
  if (!synonyms || !Array.isArray(synonyms)) return null;
  const casPattern = /^\d{2,7}-\d{2}-\d$/;
  for (const syn of synonyms) {
    if (casPattern.test(syn)) return syn;
  }
  return null;
}

async function searchPubChem(moleculeName) {
  try {
    const cleanName = moleculeName
      .replace(/\s*\([^)]*\)\s*/g, '')
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/ç/g, 'c')
      .trim();
    
    if (!cleanName || cleanName.length < 3) return null;
    
    // Récupérer le CID et les propriétés
    const propsUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(cleanName)}/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,InChI,InChIKey,XLogP,ExactMass,TPSA,Complexity,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount/JSON`;
    const propsResponse = await fetch(propsUrl);
    
    if (!propsResponse.ok) return null;
    
    const propsData = await propsResponse.json();
    const props = propsData?.PropertyTable?.Properties?.[0];
    
    if (!props) return null;
    
    await sleep(DELAY_MS);
    
    // Récupérer les synonymes pour le CAS
    const synsUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(cleanName)}/synonyms/JSON`;
    const synsResponse = await fetch(synsUrl);
    
    let synonyms = [];
    let casNumber = null;
    if (synsResponse.ok) {
      const synsData = await synsResponse.json();
      synonyms = (synsData?.InformationList?.Information?.[0]?.Synonym || []).slice(0, 10);
      casNumber = extractCAS(synonyms);
    }
    
    return {
      cid: props.CID,
      iupacName: props.IUPACName || null,
      formula: props.MolecularFormula || null,
      molecularWeight: props.MolecularWeight ? Math.round(props.MolecularWeight) : null,
      smiles: props.CanonicalSMILES || null,
      inchi: props.InChI || null,
      inchiKey: props.InChIKey || null,
      xlogp: props.XLogP || null,
      exactMass: props.ExactMass || null,
      tpsa: props.TPSA || null,
      complexity: props.Complexity || null,
      hBondDonorCount: props.HBondDonorCount || null,
      hBondAcceptorCount: props.HBondAcceptorCount || null,
      rotatableBondCount: props.RotatableBondCount || null,
      heavyAtomCount: props.HeavyAtomCount || null,
      casNumber,
      synonyms
    };
    
  } catch (error) {
    console.error(`Erreur pour ${moleculeName}:`, error.message);
    return null;
  }
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== ENRICHISSEMENT DES MOLÉCULES VIA PUBCHEM ===\n');
  
  // Récupérer les molécules à enrichir (sans pubchem_cid)
  const [molecules] = await connection.execute(`
    SELECT id, name, cas_number, iupac_name, chemicalFormula
    FROM molecules 
    WHERE pubchem_cid IS NULL
    AND name NOT LIKE '%accord%'
    AND name NOT LIKE '%blend%'
    AND name NOT LIKE '%complex%'
    AND name NOT LIKE '%mélange%'
    AND name NOT LIKE '%huile%'
    AND name NOT LIKE '%absolue%'
    AND name NOT LIKE '%essential oil%'
    ORDER BY name
    LIMIT 100
  `);
  
  console.log(`Molécules à enrichir: ${molecules.length}\n`);
  
  let enriched = 0;
  let failed = 0;
  
  for (const mol of molecules) {
    process.stdout.write(`Recherche: ${mol.name.substring(0, 40).padEnd(40)} `);
    
    const data = await searchPubChem(mol.name);
    
    if (data && data.cid) {
      console.log(`✓ CID: ${data.cid} | SMILES: ${(data.smiles || '-').substring(0, 20)}...`);
      
      await connection.execute(`
        UPDATE molecules SET
          pubchem_cid = ?,
          smiles = ?,
          inchi = ?,
          inchi_key = ?,
          exact_mass = ?,
          xlogp = ?,
          tpsa = ?,
          h_bond_donor_count = ?,
          h_bond_acceptor_count = ?,
          rotatable_bond_count = ?,
          heavy_atom_count = ?,
          pubchem_synonyms = ?,
          pubchem_enriched_at = NOW(),
          cas_number = COALESCE(cas_number, ?),
          iupac_name = COALESCE(iupac_name, ?),
          chemicalFormula = COALESCE(chemicalFormula, ?),
          molecularWeight = COALESCE(molecularWeight, ?)
        WHERE id = ?
      `, [
        data.cid,
        data.smiles,
        data.inchi,
        data.inchiKey,
        data.exactMass,
        data.xlogp,
        data.tpsa,
        data.hBondDonorCount,
        data.hBondAcceptorCount,
        data.rotatableBondCount,
        data.heavyAtomCount,
        data.synonyms.length > 0 ? JSON.stringify(data.synonyms) : null,
        data.casNumber,
        data.iupacName,
        data.formula,
        data.molecularWeight,
        mol.id
      ]);
      enriched++;
    } else {
      console.log('✗ Non trouvé');
      failed++;
    }
    
    await sleep(DELAY_MS);
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Molécules enrichies: ${enriched}`);
  console.log(`Non trouvées: ${failed}`);
  
  // Afficher les nouvelles statistiques
  const [newStats] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as pubchem_filled,
      SUM(CASE WHEN smiles IS NOT NULL THEN 1 ELSE 0 END) as smiles_filled,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as cas_filled
    FROM molecules
  `);
  
  const total = Number(newStats[0].total);
  console.log('\n=== STATISTIQUES ===');
  console.log(`PubChem CID: ${newStats[0].pubchem_filled}/${total} (${Math.round(Number(newStats[0].pubchem_filled)/total*100)}%)`);
  console.log(`SMILES: ${newStats[0].smiles_filled}/${total} (${Math.round(Number(newStats[0].smiles_filled)/total*100)}%)`);
  console.log(`CAS: ${newStats[0].cas_filled}/${total} (${Math.round(Number(newStats[0].cas_filled)/total*100)}%)`);
  
  await connection.end();
}

main().catch(console.error);
