/**
 * Script d'enrichissement PubChem en masse - Version 2
 * 
 * Améliorations:
 * - Dictionnaire de traduction français -> anglais pour les noms courants
 * - Recherche par synonymes multiples
 * - Nettoyage avancé des noms (retrait des suffixes commerciaux)
 * - Recherche par formule chimique si disponible
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import https from 'https';

// Configuration
const BATCH_SIZE = 50;
const DELAY_BETWEEN_REQUESTS = 300; // ms - un peu plus conservateur
const DELAY_BETWEEN_BATCHES = 5000; // ms
const RESULTS_FILE = './scripts/enrichment-results-v2.json';
const LOG_FILE = './scripts/enrichment-log-v2.txt';

// Dictionnaire de traduction français -> anglais pour les termes courants
const TRANSLATIONS = {
  // Acides
  'acide': 'acid',
  'acide butyrique': 'butyric acid',
  'acide décanoïque': 'decanoic acid',
  'acide isovalérique': 'isovaleric acid',
  'acide coumarique': 'coumaric acid',
  'acide férulique': 'ferulic acid',
  
  // Aldéhydes
  'aldéhyde': 'aldehyde',
  'aldéhyde c-10': 'decanal',
  'aldéhyde c-11': 'undecanal',
  'aldéhyde c-12': 'dodecanal',
  'aldéhyde c-14': 'gamma-undecalactone',
  
  // Acétates
  'acétate': 'acetate',
  'acétate de bornyle': 'bornyl acetate',
  'acétate de benzyle': 'benzyl acetate',
  'acétate de phényléthyle': 'phenylethyl acetate',
  'acétate de linalyle': 'linalyl acetate',
  'acétate de géranyle': 'geranyl acetate',
  'acétate de néryle': 'neryl acetate',
  'acétate de citronellyle': 'citronellyl acetate',
  'acétate d\'isoeugenol': 'isoeugenol acetate',
  
  // Alcools
  'alcool': 'alcohol',
  'alcool phényléthylique': 'phenylethyl alcohol',
  'alcool benzylique': 'benzyl alcohol',
  'alcool cinnamique': 'cinnamic alcohol',
  
  // Absolues et extraits
  'absolue': 'absolute',
  'absolue d\'iris': 'orris butter',
  'absolue de jasmin': 'jasmine absolute',
  'absolue de rose': 'rose absolute',
  'huile essentielle': 'essential oil',
  
  // Composés spécifiques
  'oxyde': 'oxide',
  'cinéole': 'cineole',
  '1,8-cineole': 'eucalyptol',
  'eucalyptol': 'eucalyptol',
  'menthol': 'menthol',
  'menthone': 'menthone',
  'carvone': 'carvone',
  'limonène': 'limonene',
  'pinène': 'pinene',
  'alpha-pinène': 'alpha-pinene',
  'bêta-pinène': 'beta-pinene',
  'myrcène': 'myrcene',
  'linalol': 'linalool',
  'linalool': 'linalool',
  'géraniol': 'geraniol',
  'nérol': 'nerol',
  'citronellol': 'citronellol',
  'citral': 'citral',
  'géranial': 'geranial',
  'néral': 'neral',
  'citronellal': 'citronellal',
  'eugénol': 'eugenol',
  'isoeugénol': 'isoeugenol',
  'thymol': 'thymol',
  'carvacrol': 'carvacrol',
  'camphre': 'camphor',
  'bornéol': 'borneol',
  'terpinéol': 'terpineol',
  'alpha-terpinéol': 'alpha-terpineol',
  
  // Sesquiterpènes
  'caryophyllène': 'caryophyllene',
  'bêta-caryophyllène': 'beta-caryophyllene',
  'humulène': 'humulene',
  'alpha-humulène': 'alpha-humulene',
  'farnésène': 'farnesene',
  'bisabolène': 'bisabolene',
  'cadinène': 'cadinene',
  'germacrène': 'germacrene',
  'sélinène': 'selinene',
  'élémène': 'elemene',
  'guaiène': 'guaiene',
  'patchoulol': 'patchoulol',
  'vétivérol': 'vetiverol',
  'cédrol': 'cedrol',
  'santalol': 'santalol',
  
  // Lactones
  'lactone': 'lactone',
  'coumarine': 'coumarin',
  'gamma-décalactone': 'gamma-decalactone',
  'gamma-undécalactone': 'gamma-undecalactone',
  'gamma-dodécalactone': 'gamma-dodecalactone',
  
  // Muscs
  'musc': 'musk',
  'galaxolide': 'galaxolide',
  'muscone': 'muscone',
  'civettone': 'civetone',
  
  // Autres
  'vanilline': 'vanillin',
  'héliotropine': 'heliotropin',
  'indole': 'indole',
  'skatole': 'skatole',
  'ionone': 'ionone',
  'irone': 'irone',
  'damascone': 'damascone',
  'damascénone': 'damascenone',
  
  // Termes généraux
  'brûlé': '',
  'fumé': '',
  'vert': '',
  'frais': '',
  'doux': '',
  'épicé': '',
};

// Fonction pour faire une pause
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour faire une requête HTTP avec retry
async function httpGet(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const request = https.get(url, { timeout: 15000 }, (response) => {
          let data = '';
          response.on('data', chunk => data += chunk);
          response.on('end', () => {
            if (response.statusCode === 200) {
              try {
                resolve(JSON.parse(data));
              } catch (e) {
                reject(new Error(`JSON parse error: ${e.message}`));
              }
            } else if (response.statusCode === 404) {
              resolve(null);
            } else if (response.statusCode === 503 || response.statusCode === 429) {
              reject(new Error(`Rate limit: ${response.statusCode}`));
            } else {
              reject(new Error(`HTTP ${response.statusCode}`));
            }
          });
        });
        request.on('error', reject);
        request.on('timeout', () => {
          request.destroy();
          reject(new Error('Request timeout'));
        });
      });
    } catch (error) {
      if (attempt < retries && (error.message.includes('Rate limit') || error.message.includes('timeout'))) {
        await sleep(2000 * (attempt + 1));
        continue;
      }
      throw error;
    }
  }
}

// Fonction pour générer des variantes de recherche
function generateSearchVariants(name) {
  const variants = [];
  const lowerName = name.toLowerCase().trim();
  
  // 1. Nom original nettoyé
  let cleaned = name
    .replace(/\s*\([^)]*\)\s*/g, ' ')  // Retirer les parenthèses
    .replace(/[^\w\s\-αβγδéèêëàâäùûüôöîïç]/gi, '')  // Garder les accents
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned) variants.push(cleaned);
  
  // 2. Traduction directe si disponible
  if (TRANSLATIONS[lowerName]) {
    variants.push(TRANSLATIONS[lowerName]);
  }
  
  // 3. Recherche partielle dans le dictionnaire
  for (const [fr, en] of Object.entries(TRANSLATIONS)) {
    if (lowerName.includes(fr) && en) {
      const translated = lowerName.replace(fr, en);
      if (!variants.includes(translated)) {
        variants.push(translated);
      }
    }
  }
  
  // 4. Version sans accents
  const noAccents = cleaned
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
  if (noAccents !== cleaned && !variants.includes(noAccents)) {
    variants.push(noAccents);
  }
  
  // 5. Extraire le nom chimique principal (avant les parenthèses)
  const mainName = name.split('(')[0].trim();
  if (mainName !== name && !variants.includes(mainName)) {
    variants.push(mainName);
  }
  
  // 6. Extraire le contenu des parenthèses (souvent le nom anglais)
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1]) {
    const parenContent = parenMatch[1].trim();
    if (!variants.includes(parenContent)) {
      variants.push(parenContent);
    }
  }
  
  // 7. Simplifications courantes
  const simplifications = [
    [/^alpha[- ]?/i, 'α-'],
    [/^beta[- ]?/i, 'β-'],
    [/^gamma[- ]?/i, 'γ-'],
    [/^delta[- ]?/i, 'δ-'],
    [/α-/g, 'alpha-'],
    [/β-/g, 'beta-'],
    [/γ-/g, 'gamma-'],
    [/δ-/g, 'delta-'],
  ];
  
  for (const [pattern, replacement] of simplifications) {
    const simplified = cleaned.replace(pattern, replacement);
    if (simplified !== cleaned && !variants.includes(simplified)) {
      variants.push(simplified);
    }
  }
  
  return [...new Set(variants)].filter(v => v && v.length > 2);
}

// Fonction pour rechercher une molécule sur PubChem avec plusieurs variantes
async function searchPubChem(moleculeName) {
  const variants = generateSearchVariants(moleculeName);
  
  for (const variant of variants) {
    try {
      const encodedName = encodeURIComponent(variant);
      
      // Rechercher le CID par nom
      const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedName}/cids/JSON`;
      const searchResult = await httpGet(searchUrl);
      
      if (!searchResult || !searchResult.IdentifierList || !searchResult.IdentifierList.CID) {
        await sleep(100);
        continue;
      }
      
      const cid = searchResult.IdentifierList.CID[0];
      
      // Récupérer les propriétés
      const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`;
      const propsResult = await httpGet(propsUrl);
      
      const props = propsResult?.PropertyTable?.Properties?.[0] || {};
      
      // Récupérer le CAS
      let casNumber = null;
      try {
        const synonymsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
        const synonymsResult = await httpGet(synonymsUrl);
        
        if (synonymsResult?.InformationList?.Information?.[0]?.Synonym) {
          const synonyms = synonymsResult.InformationList.Information[0].Synonym;
          const casRegex = /^\d{2,7}-\d{2}-\d$/;
          casNumber = synonyms.find(s => casRegex.test(s)) || null;
        }
      } catch (e) {
        // Ignorer
      }
      
      return {
        cid,
        searchVariant: variant,
        casNumber,
        iupacName: props.IUPACName || null,
        formula: props.MolecularFormula || null,
        molecularWeight: props.MolecularWeight || null,
        smiles: props.CanonicalSMILES || null
      };
      
    } catch (error) {
      if (!error.message.includes('404')) {
        await sleep(500);
      }
    }
  }
  
  return null;
}

// Fonction pour déterminer la classe chimique
function determineChemicalClass(iupacName, smiles, moleculeName) {
  const name = (iupacName || moleculeName || '').toLowerCase();
  const smilesStr = (smiles || '').toLowerCase();
  
  // Terpènes
  if (name.includes('pinene') || name.includes('limonene') || name.includes('myrcene') ||
      name.includes('terpinene') || name.includes('phellandrene') || name.includes('ocimene') ||
      name.includes('sabinene') || name.includes('camphene') || name.includes('carene')) {
    return 'Monoterpène';
  }
  
  if (name.includes('caryophyllene') || name.includes('humulene') || name.includes('farnesene') ||
      name.includes('bisabolene') || name.includes('cadinene') || name.includes('germacrene') ||
      name.includes('selinene') || name.includes('elemene') || name.includes('guaiene') ||
      name.includes('copaene') || name.includes('cubebene') || name.includes('muurolene')) {
    return 'Sesquiterpène';
  }
  
  // Terpénols
  if ((name.includes('ol') || name.includes('alcohol')) && 
      (name.includes('linalool') || name.includes('geraniol') || name.includes('nerol') ||
       name.includes('citronellol') || name.includes('menthol') || name.includes('borneol') ||
       name.includes('terpineol') || name.includes('fenchol') || name.includes('carveol'))) {
    return 'Terpénol';
  }
  
  // Sesquiterpénols
  if (name.includes('patchoulol') || name.includes('vetiverol') || name.includes('cedrol') ||
      name.includes('santalol') || name.includes('nerolidol') || name.includes('farnesol') ||
      name.includes('bisabolol') || name.includes('cadinol') || name.includes('eudesmol')) {
    return 'Sesquiterpénol';
  }
  
  // Aldéhydes
  if (name.includes('aldehyde') || name.includes('al') && name.match(/\bal\b/) ||
      name.includes('citral') || name.includes('geranial') || name.includes('neral') ||
      name.includes('citronellal') || name.includes('decanal') || name.includes('undecanal') ||
      name.includes('dodecanal') || name.includes('benzaldehyde') || name.includes('cinnamaldehyde')) {
    return 'Aldéhyde';
  }
  
  // Cétones
  if (name.includes('ketone') || name.includes('one') && name.match(/one\b/) ||
      name.includes('carvone') || name.includes('menthone') || name.includes('camphor') ||
      name.includes('fenchone') || name.includes('thujone') || name.includes('pulegone') ||
      name.includes('ionone') || name.includes('damascone') || name.includes('irone')) {
    return 'Cétone';
  }
  
  // Esters
  if (name.includes('acetate') || name.includes('formate') || name.includes('butyrate') ||
      name.includes('propionate') || name.includes('benzoate') || name.includes('ester') ||
      name.includes('salicylate') || name.includes('cinnamate')) {
    return 'Ester';
  }
  
  // Phénols
  if (name.includes('phenol') || name.includes('eugenol') || name.includes('thymol') ||
      name.includes('carvacrol') || name.includes('guaiacol') || name.includes('chavicol') ||
      name.includes('anethole') || name.includes('estragole')) {
    return 'Phénol';
  }
  
  // Oxydes
  if (name.includes('oxide') || name.includes('cineole') || name.includes('eucalyptol') ||
      name.includes('epoxide') || name.includes('linalool oxide')) {
    return 'Oxyde';
  }
  
  // Lactones
  if (name.includes('lactone') || name.includes('coumarin') || name.includes('lactide')) {
    return 'Lactone';
  }
  
  // Acides
  if (name.includes('acid') || name.includes('oic acid') || name.includes('carboxylic')) {
    return 'Acide carboxylique';
  }
  
  // Alcools (non terpéniques)
  if (name.includes('alcohol') || name.includes('ol') && name.match(/ol\b/)) {
    return 'Alcool';
  }
  
  // Éthers
  if (name.includes('ether') || name.includes('methoxy') || name.includes('ethoxy')) {
    return 'Éther';
  }
  
  // Composés soufrés
  if (name.includes('sulfide') || name.includes('thio') || name.includes('mercapt') ||
      smilesStr.includes('s') && !smilesStr.includes('si')) {
    return 'Composé soufré';
  }
  
  // Composés azotés
  if (name.includes('amine') || name.includes('indole') || name.includes('pyrrole') ||
      name.includes('pyridine') || name.includes('nitrile') || name.includes('skatole') ||
      name.includes('nicotine') || name.includes('anatabine')) {
    return 'Composé azoté';
  }
  
  return null;
}

// Fonction pour logger
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(message);
}

// Fonction principale
async function main() {
  log('=== DÉBUT DE L\'ENRICHISSEMENT PUBCHEM V2 ===');
  
  // Charger la liste des molécules sans CAS
  const moleculesSansCas = JSON.parse(fs.readFileSync('./scripts/molecules-sans-cas.json', 'utf8'));
  log(`Nombre de molécules à traiter: ${moleculesSansCas.length}`);
  
  // Charger les résultats précédents si existants
  let results = {
    enriched: [],
    notFound: [],
    errors: [],
    stats: {
      total: moleculesSansCas.length,
      processed: 0,
      enriched: 0,
      notFound: 0,
      errors: 0,
      startTime: new Date().toISOString()
    }
  };
  
  if (fs.existsSync(RESULTS_FILE)) {
    const previousResults = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
    results = previousResults;
    log(`Résultats précédents chargés: ${results.stats.processed} molécules déjà traitées`);
  }
  
  // Identifier les molécules déjà traitées
  const processedIds = new Set([
    ...results.enriched.map(m => m.id),
    ...results.notFound.map(m => m.id),
    ...results.errors.map(m => m.id)
  ]);
  
  // Filtrer les molécules à traiter
  const toProcess = moleculesSansCas.filter(m => !processedIds.has(m.id));
  log(`Molécules restantes à traiter: ${toProcess.length}`);
  
  if (toProcess.length === 0) {
    log('Toutes les molécules ont déjà été traitées.');
    printSummary(results);
    return;
  }
  
  // Traitement par lots
  const batches = [];
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    batches.push(toProcess.slice(i, i + BATCH_SIZE));
  }
  
  log(`Nombre de lots: ${batches.length}`);
  
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    log(`\n--- Traitement du lot ${batchIndex + 1}/${batches.length} (${batch.length} molécules) ---`);
    
    for (const molecule of batch) {
      try {
        log(`Recherche: ${molecule.name} (ID: ${molecule.id})`);
        
        const pubchemData = await searchPubChem(molecule.name);
        
        if (pubchemData) {
          const chemicalClass = determineChemicalClass(
            pubchemData.iupacName, 
            pubchemData.smiles, 
            molecule.name
          );
          
          results.enriched.push({
            id: molecule.id,
            name: molecule.name,
            pubchemCid: pubchemData.cid,
            searchVariant: pubchemData.searchVariant,
            casNumber: pubchemData.casNumber,
            iupacName: pubchemData.iupacName,
            formula: pubchemData.formula,
            molecularWeight: pubchemData.molecularWeight,
            chemicalClass: chemicalClass,
            smiles: pubchemData.smiles
          });
          results.stats.enriched++;
          log(`  ✓ Trouvé via "${pubchemData.searchVariant}": CAS=${pubchemData.casNumber || 'N/A'}`);
        } else {
          results.notFound.push({
            id: molecule.id,
            name: molecule.name,
            variants: generateSearchVariants(molecule.name),
            reason: 'Non trouvé sur PubChem'
          });
          results.stats.notFound++;
          log(`  ✗ Non trouvé`);
        }
        
        results.stats.processed++;
        await sleep(DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        results.errors.push({
          id: molecule.id,
          name: molecule.name,
          error: error.message
        });
        results.stats.errors++;
        log(`  ⚠ Erreur: ${error.message}`);
        await sleep(1000);
      }
    }
    
    // Sauvegarder les résultats intermédiaires
    results.stats.lastUpdate = new Date().toISOString();
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    log(`Résultats sauvegardés (${results.stats.processed}/${results.stats.total} traités)`);
    
    // Pause entre les lots
    if (batchIndex < batches.length - 1) {
      log(`Pause de ${DELAY_BETWEEN_BATCHES/1000} secondes...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }
  
  results.stats.endTime = new Date().toISOString();
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  
  printSummary(results);
}

function printSummary(results) {
  log('\n=== RÉSUMÉ DE L\'ENRICHISSEMENT ===');
  log(`Total traité: ${results.stats.processed}`);
  log(`Enrichis: ${results.stats.enriched} (${((results.stats.enriched/results.stats.processed)*100).toFixed(1)}%)`);
  log(`Non trouvés: ${results.stats.notFound} (${((results.stats.notFound/results.stats.processed)*100).toFixed(1)}%)`);
  log(`Erreurs: ${results.stats.errors} (${((results.stats.errors/results.stats.processed)*100).toFixed(1)}%)`);
  
  const withCas = results.enriched.filter(m => m.casNumber).length;
  const withIupac = results.enriched.filter(m => m.iupacName).length;
  const withClass = results.enriched.filter(m => m.chemicalClass).length;
  
  log('\n=== DONNÉES RÉCUPÉRÉES ===');
  log(`Avec numéro CAS: ${withCas}/${results.stats.enriched}`);
  log(`Avec nom IUPAC: ${withIupac}/${results.stats.enriched}`);
  log(`Avec classe chimique: ${withClass}/${results.stats.enriched}`);
  
  log('\n=== FIN ===');
}

main().catch(err => {
  log(`ERREUR FATALE: ${err.message}`);
  console.error(err);
  process.exit(1);
});
