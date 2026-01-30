/**
 * Script d'enrichissement des données moléculaires via PubChem - Version 2
 * 
 * Améliorations:
 * - Dictionnaire de traduction français → anglais
 * - Recherche par formule chimique si le nom échoue
 * - Meilleure extraction des noms de molécules pures
 */

import mysql from 'mysql2/promise';

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 250;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dictionnaire de traduction français → anglais pour les molécules courantes
const TRANSLATIONS = {
  'acide acétique': 'acetic acid',
  'acide benzoïque': 'benzoic acid',
  'acide cinnamique': 'cinnamic acid',
  'acide décanoïque': 'decanoic acid',
  'acide laurique': 'lauric acid',
  'acide myristique': 'myristic acid',
  'acide palmitique': 'palmitic acid',
  'acide stéarique': 'stearic acid',
  'alcool benzylique': 'benzyl alcohol',
  'aldéhyde cinnamique': 'cinnamaldehyde',
  'aldéhyde anisique': 'anisaldehyde',
  'baume de tolu': 'tolu balsam',
  'baume du pérou': 'peru balsam',
  'benzyl alcool': 'benzyl alcohol',
  'carvone l': 'l-carvone',
  'carvone d': 'd-carvone',
  'citral': 'citral',
  'citronellal': 'citronellal',
  'citronellol': 'citronellol',
  'eugénol': 'eugenol',
  'farnésène': 'farnesene',
  'géraniol': 'geraniol',
  'géranyl acétate': 'geranyl acetate',
  'héliotropine': 'heliotropin',
  'ionone alpha': 'alpha-ionone',
  'ionone beta': 'beta-ionone',
  'isoamyl acétate': 'isoamyl acetate',
  'isoeugénol': 'isoeugenol',
  'limonène': 'limonene',
  'linalol': 'linalool',
  'linalool': 'linalool',
  'menthol': 'menthol',
  'menthone': 'menthone',
  'méthyl salicylate': 'methyl salicylate',
  'myrcène': 'myrcene',
  'néroli': 'neroli',
  'nérol': 'nerol',
  'ocimène': 'ocimene',
  'patchoulol': 'patchoulol',
  'phényléthanol': 'phenylethanol',
  'pinène alpha': 'alpha-pinene',
  'pinène beta': 'beta-pinene',
  'sabinène': 'sabinene',
  'santalol': 'santalol',
  'terpinéol': 'terpineol',
  'terpinène': 'terpinene',
  'thymol': 'thymol',
  'vanilline': 'vanillin',
  'vétiver': 'vetiver',
  'ylang': 'ylang',
  'acétate de linalyle': 'linalyl acetate',
  'acétate de géranyle': 'geranyl acetate',
  'acétate de benzyle': 'benzyl acetate',
  'acétate de bornyle': 'bornyl acetate',
  'acétate de citronnellyle': 'citronellyl acetate',
  'oxide de caryophyllène': 'caryophyllene oxide',
  'caryophyllène oxide': 'caryophyllene oxide',
  'oxyde de linalol': 'linalool oxide',
  'alpha-pinène': 'alpha-pinene',
  'beta-pinène': 'beta-pinene',
  'alpha-terpinéol': 'alpha-terpineol',
  'gamma-terpinène': 'gamma-terpinene',
  'para-cymène': 'p-cymene',
  'p-cymène': 'p-cymene',
  '1,8-cinéole': '1,8-cineole',
  'eucalyptol': 'eucalyptol',
  'camphre': 'camphor',
  'bornéol': 'borneol',
  'cèdre': 'cedar',
  'cédrol': 'cedrol',
  'cédrène': 'cedrene',
  'santal': 'sandalwood',
  'vétivone': 'vetivone',
  'nootkatone': 'nootkatone',
  'muscone': 'muscone',
  'civettone': 'civetone',
  'ambrettolide': 'ambrettolide',
  'galaxolide': 'galaxolide',
  'iso e super': 'iso e super',
  'ambroxan': 'ambroxan',
  'cashmeran': 'cashmeran',
  'hedione': 'hedione',
  'javanol': 'javanol',
  'paradisone': 'paradisone',
};

// Fonction pour extraire le numéro CAS des synonymes
function extractCAS(synonyms) {
  if (!synonyms || !Array.isArray(synonyms)) return null;
  const casPattern = /^\d{2,7}-\d{2}-\d$/;
  for (const syn of synonyms) {
    if (casPattern.test(syn)) {
      return syn;
    }
  }
  return null;
}

// Fonction pour déterminer la classe chimique
function determineChemicalClass(iupacName, formula) {
  if (!iupacName) return null;
  const name = iupacName.toLowerCase();
  
  if (name.includes('pinene') || name.includes('limonene') || name.includes('myrcene') || 
      name.includes('terpine') || name.includes('camphene') || name.includes('carene') ||
      name.includes('ocimene') || name.includes('phellandrene') || name.includes('sabinene')) {
    return 'monoterpene';
  }
  if (name.includes('caryophyllene') || name.includes('humulene') || name.includes('farnesene') ||
      name.includes('bisabolene') || name.includes('cadinene') || name.includes('selinene') ||
      name.includes('cedren') || name.includes('santalene') || name.includes('vetiven')) {
    return 'sesquiterpene';
  }
  if (name.includes('aldehyde') || name.endsWith('al') || name.includes('citral') || 
      name.includes('citronellal') || name.includes('benzaldehyde')) {
    return 'aldehyde';
  }
  if (name.includes('ketone') || name.endsWith('one') || name.includes('carvone') || 
      name.includes('camphor') || name.includes('ionone') || name.includes('vetivone')) {
    return 'ketone';
  }
  if (name.endsWith('ol') || name.includes('alcohol') || name.includes('linalool') || 
      name.includes('geraniol') || name.includes('menthol') || name.includes('terpineol') ||
      name.includes('borneol') || name.includes('cedrol')) {
    return 'alcohol';
  }
  if (name.includes('acetate') || name.includes('ester') || name.endsWith('ate') ||
      name.includes('benzoate') || name.includes('salicylate')) {
    return 'ester';
  }
  if (name.includes('ether') || name.includes('oxide') || name.includes('cineole')) {
    return 'ether';
  }
  if (name.includes('phenol') || name.includes('eugenol') || name.includes('thymol') ||
      name.includes('carvacrol') || name.includes('guaiacol')) {
    return 'phenol';
  }
  if (name.includes('lactone') || name.includes('coumarin')) {
    return 'lactone';
  }
  if (name.includes('musk') || name.includes('muscone') || name.includes('galaxolide') ||
      name.includes('ambrettolide')) {
    return 'musk';
  }
  return null;
}

// Fonction pour nettoyer et préparer le nom de recherche
function prepareSearchNames(moleculeName) {
  const names = [];
  
  // Nom original nettoyé
  let cleanName = moleculeName
    .replace(/\s*\([^)]*\)\s*/g, ' ') // Enlever les parenthèses
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanName.length >= 3) {
    names.push(cleanName);
  }
  
  // Version lowercase pour la traduction
  const lowerName = cleanName.toLowerCase();
  
  // Chercher dans le dictionnaire de traduction
  for (const [fr, en] of Object.entries(TRANSLATIONS)) {
    if (lowerName.includes(fr)) {
      names.push(en);
    }
  }
  
  // Essayer de convertir les accents
  const noAccents = cleanName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  
  if (noAccents !== lowerName && noAccents.length >= 3) {
    names.push(noAccents);
  }
  
  // Si le nom contient des tirets, essayer les parties
  if (cleanName.includes('-')) {
    const parts = cleanName.split('-');
    for (const part of parts) {
      if (part.length >= 4 && !part.match(/^\d+$/)) {
        names.push(part.trim());
      }
    }
  }
  
  return [...new Set(names)]; // Retirer les doublons
}

// Fonction pour rechercher une molécule dans PubChem
async function searchPubChem(searchNames) {
  for (const name of searchNames) {
    try {
      const encodedName = encodeURIComponent(name);
      
      // Récupérer les propriétés
      const propsUrl = `${PUBCHEM_BASE}/compound/name/${encodedName}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`;
      const propsResponse = await fetch(propsUrl);
      
      if (!propsResponse.ok) {
        await sleep(DELAY_MS);
        continue;
      }
      
      const propsData = await propsResponse.json();
      const props = propsData?.PropertyTable?.Properties?.[0];
      
      if (!props) {
        await sleep(DELAY_MS);
        continue;
      }
      
      await sleep(DELAY_MS);
      
      // Récupérer les synonymes pour le CAS
      const synsUrl = `${PUBCHEM_BASE}/compound/name/${encodedName}/synonyms/JSON`;
      const synsResponse = await fetch(synsUrl);
      
      let casNumber = null;
      if (synsResponse.ok) {
        const synsData = await synsResponse.json();
        const synonyms = synsData?.InformationList?.Information?.[0]?.Synonym;
        casNumber = extractCAS(synonyms);
      }
      
      return {
        iupacName: props.IUPACName || null,
        formula: props.MolecularFormula || null,
        molecularWeight: props.MolecularWeight ? Math.round(props.MolecularWeight) : null,
        casNumber: casNumber,
        chemicalClass: determineChemicalClass(props.IUPACName, props.MolecularFormula),
        searchedName: name
      };
      
    } catch (error) {
      await sleep(DELAY_MS);
      continue;
    }
  }
  
  return null;
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== ENRICHISSEMENT DES MOLÉCULES VIA PUBCHEM (V2) ===\n');
  
  // Récupérer les molécules à enrichir
  const [molecules] = await connection.execute(`
    SELECT id, name, cas_number, iupac_name, chemical_class, chemicalFormula
    FROM molecules 
    WHERE (cas_number IS NULL OR cas_number = '' OR iupac_name IS NULL OR iupac_name = '')
    AND name NOT LIKE '%accord%'
    AND name NOT LIKE '%blend%'
    AND name NOT LIKE '%complex%'
    AND name NOT LIKE '%mélange%'
    AND name NOT LIKE '%essential oil%'
    AND name NOT LIKE '% oil%'
    AND name NOT LIKE '%resin%'
    AND name NOT LIKE '%balsam%'
    AND name NOT LIKE '%tar%'
    AND name NOT LIKE '%smoke%'
    AND name NOT LIKE '%note%'
    AND name NOT LIKE '%olfactif%'
    AND chemicalFormula IS NOT NULL
    AND chemicalFormula != ''
    AND chemicalFormula NOT LIKE '%Complex%'
    AND chemicalFormula NOT LIKE '%Mélange%'
    ORDER BY name
    LIMIT 150
  `);
  
  console.log(`Molécules à enrichir: ${molecules.length}\n`);
  
  let enriched = 0;
  let failed = 0;
  
  for (const mol of molecules) {
    const searchNames = prepareSearchNames(mol.name);
    process.stdout.write(`${mol.name.substring(0, 35).padEnd(35)} `);
    
    const data = await searchPubChem(searchNames);
    
    if (data && (data.casNumber || data.iupacName)) {
      console.log(`✓ [${data.searchedName}] CAS: ${data.casNumber || '-'}`);
      
      const updates = [];
      const values = [];
      
      if (data.casNumber && (!mol.cas_number || mol.cas_number === '')) {
        updates.push('cas_number = ?');
        values.push(data.casNumber);
      }
      
      if (data.iupacName && (!mol.iupac_name || mol.iupac_name === '')) {
        updates.push('iupac_name = ?');
        values.push(data.iupacName);
      }
      
      if (data.chemicalClass && !mol.chemical_class) {
        updates.push('chemical_class = ?');
        values.push(data.chemicalClass);
      }
      
      if (data.formula && (!mol.chemicalFormula || mol.chemicalFormula === '')) {
        updates.push('chemicalFormula = ?');
        values.push(data.formula);
      }
      
      if (data.molecularWeight) {
        updates.push('molecularWeight = ?');
        values.push(data.molecularWeight);
      }
      
      if (updates.length > 0) {
        values.push(mol.id);
        await connection.execute(
          `UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
        enriched++;
      }
    } else {
      console.log('✗');
      failed++;
    }
    
    await sleep(DELAY_MS);
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Molécules enrichies: ${enriched}`);
  console.log(`Non trouvées: ${failed}`);
  
  // Nouvelles statistiques
  const [newStats] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as cas_filled,
      SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as iupac_filled,
      SUM(CASE WHEN chemical_class IS NOT NULL THEN 1 ELSE 0 END) as class_filled
    FROM molecules
  `);
  
  const total = Number(newStats[0].total);
  console.log('\n=== NOUVELLES STATISTIQUES ===');
  console.log(`CAS: ${newStats[0].cas_filled}/${total} (${Math.round(Number(newStats[0].cas_filled)/total*100)}%)`);
  console.log(`IUPAC: ${newStats[0].iupac_filled}/${total} (${Math.round(Number(newStats[0].iupac_filled)/total*100)}%)`);
  console.log(`Classe: ${newStats[0].class_filled}/${total} (${Math.round(Number(newStats[0].class_filled)/total*100)}%)`);
  
  await connection.end();
}

main().catch(console.error);
