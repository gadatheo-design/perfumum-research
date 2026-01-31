/**
 * Script d'enrichissement des données moléculaires via PubChem PUG REST API
 * Version améliorée avec traduction français→anglais
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

// Dictionnaire de traduction français→anglais pour les termes chimiques courants
const FR_TO_EN_DICTIONARY = {
  // Acides
  'acide': 'acid',
  'acétique': 'acetic',
  'benzoïque': 'benzoic',
  'citrique': 'citric',
  'formique': 'formic',
  'lactique': 'lactic',
  'oléique': 'oleic',
  'palmitique': 'palmitic',
  'stéarique': 'stearic',
  'salicylique': 'salicylic',
  'cinnamique': 'cinnamic',
  'phénylacétique': 'phenylacetic',
  'isovalérique': 'isovaleric',
  'butyrique': 'butyric',
  'propionique': 'propionic',
  'caproïque': 'caproic',
  'caprylique': 'caprylic',
  'caprique': 'capric',
  'laurique': 'lauric',
  'myristique': 'myristic',
  'linoléique': 'linoleic',
  'linolénique': 'linolenic',
  
  // Alcools
  'alcool': 'alcohol',
  'méthanol': 'methanol',
  'éthanol': 'ethanol',
  'propanol': 'propanol',
  'butanol': 'butanol',
  'pentanol': 'pentanol',
  'hexanol': 'hexanol',
  'heptanol': 'heptanol',
  'octanol': 'octanol',
  'nonanol': 'nonanol',
  'décanol': 'decanol',
  'benzylique': 'benzyl',
  'phényléthylique': 'phenylethyl',
  'cinnamylique': 'cinnamyl',
  'géraniol': 'geraniol',
  'nérol': 'nerol',
  'citronellol': 'citronellol',
  'linalol': 'linalool',
  'terpinéol': 'terpineol',
  'menthol': 'menthol',
  'bornéol': 'borneol',
  'fenchol': 'fenchol',
  'cédrol': 'cedrol',
  'vétivérol': 'vetiverol',
  'patchoulol': 'patchoulol',
  'santalol': 'santalol',
  'farnésol': 'farnesol',
  'nérolidol': 'nerolidol',
  
  // Aldéhydes
  'aldéhyde': 'aldehyde',
  'formaldéhyde': 'formaldehyde',
  'acétaldéhyde': 'acetaldehyde',
  'benzaldéhyde': 'benzaldehyde',
  'cinnamaldéhyde': 'cinnamaldehyde',
  'citral': 'citral',
  'citronellal': 'citronellal',
  'géranial': 'geranial',
  'néral': 'neral',
  'vanilline': 'vanillin',
  'héliotropine': 'heliotropin',
  'anisaldéhyde': 'anisaldehyde',
  'cuminaldéhyde': 'cuminaldehyde',
  
  // Cétones
  'cétone': 'ketone',
  'acétone': 'acetone',
  'camphre': 'camphor',
  'carvone': 'carvone',
  'menthone': 'menthone',
  'pulégone': 'pulegone',
  'fenchone': 'fenchone',
  'thuyone': 'thujone',
  'ionone': 'ionone',
  'damascone': 'damascone',
  'damascénone': 'damascenone',
  'jasmone': 'jasmone',
  'muscone': 'muscone',
  'civétone': 'civetone',
  
  // Esters
  'ester': 'ester',
  'acétate': 'acetate',
  'benzoate': 'benzoate',
  'cinnamate': 'cinnamate',
  'salicylate': 'salicylate',
  'formate': 'formate',
  'propionate': 'propionate',
  'butyrate': 'butyrate',
  'valérate': 'valerate',
  'isovalérate': 'isovalerate',
  'caproate': 'caproate',
  'caprylate': 'caprylate',
  'laurate': 'laurate',
  'myristate': 'myristate',
  'palmitate': 'palmitate',
  'stéarate': 'stearate',
  'oléate': 'oleate',
  'méthyle': 'methyl',
  'éthyle': 'ethyl',
  'propyle': 'propyl',
  'butyle': 'butyl',
  'amyle': 'amyl',
  'hexyle': 'hexyl',
  'heptyle': 'heptyl',
  'octyle': 'octyl',
  'benzyle': 'benzyl',
  'phényléthyle': 'phenethyl',
  'géranyle': 'geranyl',
  'linalyle': 'linalyl',
  'bornyle': 'bornyl',
  'terpényle': 'terpinyl',
  'citronnellyle': 'citronellyl',
  
  // Terpènes
  'terpène': 'terpene',
  'monoterpène': 'monoterpene',
  'sesquiterpène': 'sesquiterpene',
  'diterpène': 'diterpene',
  'limonène': 'limonene',
  'pinène': 'pinene',
  'myrcène': 'myrcene',
  'ocimène': 'ocimene',
  'terpinène': 'terpinene',
  'phellandrène': 'phellandrene',
  'sabinène': 'sabinene',
  'carène': 'carene',
  'camphène': 'camphene',
  'caryophyllène': 'caryophyllene',
  'humulène': 'humulene',
  'bisabolène': 'bisabolene',
  'farnésène': 'farnesene',
  'cadinène': 'cadinene',
  'copaène': 'copaene',
  'élémène': 'elemene',
  'guaiène': 'guaiene',
  'sélinène': 'selinene',
  'germacrène': 'germacrene',
  'patchoulène': 'patchoulene',
  'cédène': 'cedrene',
  'santalène': 'santalene',
  'vétivène': 'vetivenene',
  'zingibérène': 'zingiberene',
  'curcumène': 'curcumene',
  
  // Oxydes
  'oxyde': 'oxide',
  'eucalyptol': 'eucalyptol',
  'cinéole': 'cineole',
  'linalol oxyde': 'linalool oxide',
  'rose oxyde': 'rose oxide',
  'bisabolol oxyde': 'bisabolol oxide',
  'caryophyllène oxyde': 'caryophyllene oxide',
  
  // Phénols
  'phénol': 'phenol',
  'eugénol': 'eugenol',
  'isoeugénol': 'isoeugenol',
  'chavicol': 'chavicol',
  'estragole': 'estragole',
  'anéthole': 'anethole',
  'safrol': 'safrole',
  'thymol': 'thymol',
  'carvacrol': 'carvacrol',
  'guaïacol': 'guaiacol',
  'créosol': 'creosol',
  
  // Lactones
  'lactone': 'lactone',
  'coumarine': 'coumarin',
  'gamma-décalactone': 'gamma-decalactone',
  'gamma-undécalactone': 'gamma-undecalactone',
  'gamma-nonalactone': 'gamma-nonalactone',
  'gamma-octalactone': 'gamma-octalactone',
  'delta-décalactone': 'delta-decalactone',
  'massoia lactone': 'massoia lactone',
  'sclareolide': 'sclareolide',
  'ambroxide': 'ambroxide',
  
  // Muscs
  'musc': 'musk',
  'galaxolide': 'galaxolide',
  'tonalide': 'tonalide',
  'muscenone': 'muscenone',
  'ambrettolide': 'ambrettolide',
  'exaltolide': 'exaltolide',
  'habanolide': 'habanolide',
  'ethylene brassylate': 'ethylene brassylate',
  
  // Autres composés aromatiques
  'indole': 'indole',
  'skatole': 'skatole',
  'pyridine': 'pyridine',
  'pyrazine': 'pyrazine',
  'thiazole': 'thiazole',
  'furane': 'furan',
  'thiophène': 'thiophene',
  
  // Préfixes/Suffixes courants
  'alpha': 'alpha',
  'bêta': 'beta',
  'gamma': 'gamma',
  'delta': 'delta',
  'cis': 'cis',
  'trans': 'trans',
  'iso': 'iso',
  'néo': 'neo',
  'para': 'para',
  'ortho': 'ortho',
  'méta': 'meta',
  
  // Termes généraux
  'huile essentielle': 'essential oil',
  'absolu': 'absolute',
  'concrète': 'concrete',
  'résinoïde': 'resinoid',
  'oléorésine': 'oleoresin',
  'baume': 'balsam',
  'résine': 'resin',
  'gomme': 'gum',
};

// Noms de molécules spécifiques avec traduction directe
const MOLECULE_NAME_TRANSLATIONS = {
  // Terpènes courants
  'limonène': 'limonene',
  'alpha-pinène': 'alpha-pinene',
  'bêta-pinène': 'beta-pinene',
  'myrcène': 'myrcene',
  'linalol': 'linalool',
  'géraniol': 'geraniol',
  'nérol': 'nerol',
  'citronellol': 'citronellol',
  'terpinéol': 'terpineol',
  'alpha-terpinéol': 'alpha-terpineol',
  'menthol': 'menthol',
  'bornéol': 'borneol',
  'camphre': 'camphor',
  'eucalyptol': 'eucalyptol',
  '1,8-cinéole': '1,8-cineole',
  'caryophyllène': 'caryophyllene',
  'bêta-caryophyllène': 'beta-caryophyllene',
  'humulène': 'humulene',
  'alpha-humulène': 'alpha-humulene',
  'bisabolol': 'bisabolol',
  'alpha-bisabolol': 'alpha-bisabolol',
  'farnésol': 'farnesol',
  'nérolidol': 'nerolidol',
  'patchoulol': 'patchoulol',
  'cédrol': 'cedrol',
  'santalol': 'santalol',
  'vétivérol': 'vetiverol',
  
  // Aldéhydes
  'citral': 'citral',
  'citronellal': 'citronellal',
  'géranial': 'geranial',
  'néral': 'neral',
  'vanilline': 'vanillin',
  'benzaldéhyde': 'benzaldehyde',
  'cinnamaldéhyde': 'cinnamaldehyde',
  'aldéhyde cinnamique': 'cinnamaldehyde',
  'aldéhyde benzoïque': 'benzaldehyde',
  'aldéhyde anisique': 'anisaldehyde',
  'anisaldéhyde': 'anisaldehyde',
  'héliotropine': 'heliotropin',
  'pipéronal': 'piperonal',
  
  // Cétones
  'carvone': 'carvone',
  'menthone': 'menthone',
  'pulégone': 'pulegone',
  'fenchone': 'fenchone',
  'thuyone': 'thujone',
  'alpha-ionone': 'alpha-ionone',
  'bêta-ionone': 'beta-ionone',
  'damascone': 'damascone',
  'damascénone': 'damascenone',
  'jasmone': 'jasmone',
  'cis-jasmone': 'cis-jasmone',
  
  // Esters
  'acétate de linalyle': 'linalyl acetate',
  'acétate de géranyle': 'geranyl acetate',
  'acétate de bornyle': 'bornyl acetate',
  'acétate de néryle': 'neryl acetate',
  'acétate de citronellyle': 'citronellyl acetate',
  'acétate de benzyle': 'benzyl acetate',
  'acétate d\'éthyle': 'ethyl acetate',
  'acétate de méthyle': 'methyl acetate',
  'benzoate de benzyle': 'benzyl benzoate',
  'salicylate de benzyle': 'benzyl salicylate',
  'salicylate de méthyle': 'methyl salicylate',
  'cinnamate de méthyle': 'methyl cinnamate',
  'cinnamate d\'éthyle': 'ethyl cinnamate',
  'anthranilate de méthyle': 'methyl anthranilate',
  
  // Phénols
  'eugénol': 'eugenol',
  'isoeugénol': 'isoeugenol',
  'chavicol': 'chavicol',
  'méthylchavicol': 'methylchavicol',
  'estragole': 'estragole',
  'anéthole': 'anethole',
  'trans-anéthole': 'trans-anethole',
  'thymol': 'thymol',
  'carvacrol': 'carvacrol',
  'guaïacol': 'guaiacol',
  
  // Lactones et coumarines
  'coumarine': 'coumarin',
  'gamma-décalactone': 'gamma-decalactone',
  'gamma-undécalactone': 'gamma-undecalactone',
  'delta-décalactone': 'delta-decalactone',
  'ambroxide': 'ambroxide',
  'sclareolide': 'sclareolide',
  
  // Muscs
  'galaxolide': 'galaxolide',
  'muscone': 'muscone',
  'civétone': 'civetone',
  'ambrettolide': 'ambrettolide',
  'exaltolide': 'exaltolide',
  
  // Autres
  'indole': 'indole',
  'skatole': 'skatole',
  'safrol': 'safrole',
  'myristicine': 'myristicin',
  'élémicine': 'elemicin',
  'apiole': 'apiole',
};

function translateToEnglish(frenchName) {
  if (!frenchName) return null;
  
  let name = frenchName.toLowerCase().trim();
  
  // Vérifier d'abord les traductions directes de noms complets
  if (MOLECULE_NAME_TRANSLATIONS[name]) {
    return MOLECULE_NAME_TRANSLATIONS[name];
  }
  
  // Remplacer les accents
  name = name
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
  
  // Appliquer les traductions mot par mot
  for (const [fr, en] of Object.entries(FR_TO_EN_DICTIONARY)) {
    const frNormalized = fr
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[ùûü]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/ç/g, 'c');
    
    // Remplacer le mot français par l'anglais (avec limites de mots)
    const regex = new RegExp(`\\b${frNormalized}\\b`, 'gi');
    name = name.replace(regex, en);
  }
  
  // Nettoyer les espaces multiples
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
}

function extractCAS(synonyms) {
  if (!synonyms || !Array.isArray(synonyms)) return null;
  const casPattern = /^\d{2,7}-\d{2}-\d$/;
  for (const syn of synonyms) {
    if (casPattern.test(syn)) return syn;
  }
  return null;
}

async function searchPubChem(moleculeName, originalName = null) {
  try {
    // Nettoyer le nom (enlever les parenthèses et leur contenu)
    let cleanName = moleculeName
      .replace(/\s*\([^)]*\)\s*/g, '')
      .replace(/\s*\[[^\]]*\]\s*/g, '')
      .trim();
    
    if (!cleanName || cleanName.length < 3) return null;
    
    // Liste des noms à essayer
    const namesToTry = [cleanName];
    
    // Ajouter la traduction si différente
    const translated = translateToEnglish(cleanName);
    if (translated && translated !== cleanName.toLowerCase()) {
      namesToTry.push(translated);
    }
    
    // Ajouter le nom original si fourni et différent
    if (originalName && originalName !== moleculeName) {
      const translatedOriginal = translateToEnglish(originalName);
      if (translatedOriginal && !namesToTry.includes(translatedOriginal)) {
        namesToTry.push(translatedOriginal);
      }
    }
    
    // Essayer chaque nom
    for (const nameToTry of namesToTry) {
      const propsUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(nameToTry)}/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,InChI,InChIKey,XLogP,ExactMass,TPSA,Complexity,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount/JSON`;
      const propsResponse = await fetch(propsUrl);
      
      if (propsResponse.ok) {
        const propsData = await propsResponse.json();
        const props = propsData?.PropertyTable?.Properties?.[0];
        
        if (props) {
          await sleep(DELAY_MS);
          
          // Récupérer les synonymes pour le CAS
          const synsUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(nameToTry)}/synonyms/JSON`;
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
            synonyms,
            matchedName: nameToTry
          };
        }
      }
      
      await sleep(DELAY_MS / 2); // Court délai entre les tentatives
    }
    
    return null;
    
  } catch (error) {
    console.error(`Erreur pour ${moleculeName}:`, error.message);
    return null;
  }
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== ENRICHISSEMENT DES MOLÉCULES VIA PUBCHEM (v2 avec traduction FR→EN) ===\n');
  
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
  const failedMolecules = [];
  
  for (const mol of molecules) {
    const displayName = mol.name.substring(0, 35).padEnd(35);
    process.stdout.write(`${displayName} `);
    
    const data = await searchPubChem(mol.name);
    
    if (data && data.cid) {
      const matchInfo = data.matchedName !== mol.name.toLowerCase() ? ` (via: ${data.matchedName})` : '';
      console.log(`✓ CID: ${data.cid}${matchInfo}`);
      
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
      failedMolecules.push(mol.name);
      failed++;
    }
    
    await sleep(DELAY_MS);
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Molécules enrichies: ${enriched}`);
  console.log(`Non trouvées: ${failed}`);
  
  if (failedMolecules.length > 0 && failedMolecules.length <= 20) {
    console.log('\nMolécules non trouvées:');
    failedMolecules.forEach(name => console.log(`  - ${name}`));
  }
  
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
  console.log('\n=== STATISTIQUES GLOBALES ===');
  console.log(`PubChem CID: ${newStats[0].pubchem_filled}/${total} (${Math.round(Number(newStats[0].pubchem_filled)/total*100)}%)`);
  console.log(`SMILES: ${newStats[0].smiles_filled}/${total} (${Math.round(Number(newStats[0].smiles_filled)/total*100)}%)`);
  console.log(`CAS: ${newStats[0].cas_filled}/${total} (${Math.round(Number(newStats[0].cas_filled)/total*100)}%)`);
  
  await connection.end();
}

main().catch(console.error);
