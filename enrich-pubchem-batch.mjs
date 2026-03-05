/**
 * Enrichissement PubChem des molécules brouillon
 * Stratégie : recherche par nom → récupération CAS, SMILES, InChI, masse exacte, IUPAC
 * Rate limit : 5 req/s max (PubChem recommande ≤ 5/s)
 */
import mysql from 'mysql2/promise';

const DELAY_MS = 250; // 4 req/s pour rester sous la limite
const BATCH_SIZE = 50; // Traiter par lots de 50 pour les logs

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPubChemByName(name) {
  try {
    // Nettoyer le nom pour la recherche
    const cleanName = name
      .replace(/[()]/g, '') // Enlever parenthèses
      .replace(/\s+/g, '%20')
      .trim();
    
    // 1. Chercher le CID par nom
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(8000) });
    
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    
    if (!searchData?.IdentifierList?.CID?.length) return null;
    const cid = searchData.IdentifierList.CID[0];
    
    // 2. Récupérer les propriétés du composé
    const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName,MolecularFormula,IsomericSMILES,InChI,InChIKey,ExactMass,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount/JSON`;
    const propsRes = await fetch(propsUrl, { signal: AbortSignal.timeout(8000) });
    
    if (!propsRes.ok) return null;
    const propsData = await propsRes.json();
    const props = propsData?.PropertyTable?.Properties?.[0];
    if (!props) return null;
    
    // 3. Récupérer le numéro CAS via synonymes
    let casNumber = null;
    try {
      const synUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
      const synRes = await fetch(synUrl, { signal: AbortSignal.timeout(5000) });
      if (synRes.ok) {
        const synData = await synRes.json();
        const synonyms = synData?.InformationList?.Information?.[0]?.Synonym || [];
        // Le CAS est généralement au format XXX-XX-X
        casNumber = synonyms.find(s => /^\d{1,7}-\d{2}-\d$/.test(s)) || null;
      }
    } catch {}
    
    return {
      cid,
      cas: casNumber,
      smiles: props.IsomericSMILES || null,
      inchi: props.InChI || null,
      inchiKey: props.InChIKey || null,
      iupac: props.IUPACName || null,
      formula: props.MolecularFormula || null,
      exactMass: props.ExactMass || null,
      xlogp: props.XLogP || null,
      tpsa: props.TPSA || null,
      hDonor: props.HBondDonorCount || null,
      hAcceptor: props.HBondAcceptorCount || null,
      rotatable: props.RotatableBondCount || null,
      heavyAtoms: props.HeavyAtomCount || null,
    };
  } catch (err) {
    return null;
  }
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Récupérer toutes les molécules brouillon sans CAS
  const [molecules] = await conn.execute(`
    SELECT id, name FROM molecules
    WHERE validation_status = 'brouillon'
    AND (cas_number IS NULL OR cas_number = '')
    ORDER BY name
  `);
  
  console.log(`\n🔬 Enrichissement PubChem — ${molecules.length} molécules à traiter\n`);
  
  let enriched = 0;
  let notFound = 0;
  let errors = 0;
  const notFoundList = [];
  
  for (let i = 0; i < molecules.length; i++) {
    const mol = molecules[i];
    const progress = `[${i + 1}/${molecules.length}]`;
    
    try {
      const data = await fetchPubChemByName(mol.name);
      
      if (!data) {
        notFound++;
        notFoundList.push(mol.name);
        if (i % 20 === 0) process.stdout.write(`${progress} ✗ ${mol.name}\n`);
      } else {
        // Mettre à jour la molécule avec les données PubChem
        await conn.execute(`
          UPDATE molecules SET
            pubchem_cid = ?,
            cas_number = COALESCE(cas_number, ?),
            smiles = COALESCE(smiles, ?),
            inchi = COALESCE(inchi, ?),
            inchi_key = COALESCE(inchi_key, ?),
            iupac_name = COALESCE(iupac_name, ?),
            exact_mass = COALESCE(exact_mass, ?),
            xlogp = COALESCE(xlogp, ?),
            tpsa = COALESCE(tpsa, ?),
            h_bond_donor_count = COALESCE(h_bond_donor_count, ?),
            h_bond_acceptor_count = COALESCE(h_bond_acceptor_count, ?),
            rotatable_bond_count = COALESCE(rotatable_bond_count, ?),
            heavy_atom_count = COALESCE(heavy_atom_count, ?),
            pubchem_enriched_at = NOW()
          WHERE id = ?
        `, [
          data.cid,
          data.cas,
          data.smiles,
          data.inchi,
          data.inchiKey,
          data.iupac,
          data.exactMass,
          data.xlogp,
          data.tpsa,
          data.hDonor,
          data.hAcceptor,
          data.rotatable,
          data.heavyAtoms,
          mol.id
        ]);
        
        enriched++;
        if (i % 10 === 0) {
          process.stdout.write(`${progress} ✓ ${mol.name} (CID: ${data.cid}, CAS: ${data.cas || 'N/A'})\n`);
        }
      }
    } catch (err) {
      errors++;
      if (i % 20 === 0) process.stdout.write(`${progress} ⚠ ${mol.name}: ${err.message}\n`);
    }
    
    // Rate limiting
    await sleep(DELAY_MS);
    
    // Log de progression tous les 50
    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`\n📊 Progression: ${i + 1}/${molecules.length} | ✓ ${enriched} enrichies | ✗ ${notFound} non trouvées | ⚠ ${errors} erreurs\n`);
    }
  }
  
  // Mise à jour du statut de validation pour les molécules enrichies
  const [updateResult] = await conn.execute(`
    UPDATE molecules SET
      validation_status = 'en_revision'
    WHERE validation_status = 'brouillon'
    AND pubchem_cid IS NOT NULL
    AND (cas_number IS NOT NULL AND cas_number != '')
  `);
  
  console.log(`\n✅ Enrichissement terminé !`);
  console.log(`   ✓ ${enriched} molécules enrichies`);
  console.log(`   ✗ ${notFound} non trouvées sur PubChem`);
  console.log(`   ⚠ ${errors} erreurs`);
  console.log(`   📈 ${updateResult.affectedRows} molécules passées en "en_revision"`);
  
  if (notFoundList.length > 0) {
    console.log(`\n📋 Molécules non trouvées (${notFoundList.length}):`);
    notFoundList.slice(0, 20).forEach(n => console.log(`   - ${n}`));
    if (notFoundList.length > 20) console.log(`   ... et ${notFoundList.length - 20} autres`);
  }
  
  await conn.end();
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
