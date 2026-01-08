/**
 * Script d'enrichissement PubChem en masse
 * 
 * Ce script récupère les données scientifiques (CAS, IUPAC, formule, masse molaire, classe chimique)
 * depuis l'API PubChem pour les molécules sans numéro CAS.
 * 
 * Rate limits PubChem:
 * - 5 requêtes par seconde maximum
 * - Pas plus de 400 requêtes par minute
 * 
 * Stratégie:
 * - Traitement par lots de 50 molécules
 * - Délai de 250ms entre chaque requête (4 req/s pour être safe)
 * - Pause de 5 secondes entre chaque lot
 * - Sauvegarde des résultats intermédiaires
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import https from 'https';

// Configuration
const BATCH_SIZE = 50;
const DELAY_BETWEEN_REQUESTS = 250; // ms
const DELAY_BETWEEN_BATCHES = 5000; // ms
const RESULTS_FILE = './scripts/enrichment-results.json';
const LOG_FILE = './scripts/enrichment-log.txt';

// Fonction pour faire une pause
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour faire une requête HTTP
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 10000 }, (response) => {
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
          resolve(null); // Molécule non trouvée
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
}

// Fonction pour nettoyer le nom de la molécule pour la recherche
function cleanMoleculeName(name) {
  // Retirer les parenthèses avec contenu explicatif
  let cleaned = name.replace(/\s*\([^)]*\)\s*/g, ' ');
  // Retirer les caractères spéciaux sauf tirets et espaces
  cleaned = cleaned.replace(/[^\w\s\-αβγδ]/g, '');
  // Normaliser les espaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

// Fonction pour rechercher une molécule sur PubChem
async function searchPubChem(moleculeName) {
  const cleanedName = cleanMoleculeName(moleculeName);
  const encodedName = encodeURIComponent(cleanedName);
  
  try {
    // Étape 1: Rechercher le CID par nom
    const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodedName}/cids/JSON`;
    const searchResult = await httpGet(searchUrl);
    
    if (!searchResult || !searchResult.IdentifierList || !searchResult.IdentifierList.CID) {
      return null;
    }
    
    const cid = searchResult.IdentifierList.CID[0];
    
    // Étape 2: Récupérer les propriétés détaillées
    const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`;
    const propsResult = await httpGet(propsUrl);
    
    if (!propsResult || !propsResult.PropertyTable || !propsResult.PropertyTable.Properties) {
      return { cid, casNumber: null, iupacName: null, formula: null, molecularWeight: null };
    }
    
    const props = propsResult.PropertyTable.Properties[0];
    
    // Étape 3: Récupérer le numéro CAS (synonymes)
    let casNumber = null;
    try {
      const synonymsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
      const synonymsResult = await httpGet(synonymsUrl);
      
      if (synonymsResult && synonymsResult.InformationList && synonymsResult.InformationList.Information) {
        const synonyms = synonymsResult.InformationList.Information[0].Synonym || [];
        // Le numéro CAS a le format XXX-XX-X ou XXXXX-XX-X
        const casRegex = /^\d{2,7}-\d{2}-\d$/;
        casNumber = synonyms.find(s => casRegex.test(s)) || null;
      }
    } catch (e) {
      // Ignorer les erreurs de synonymes
    }
    
    return {
      cid,
      casNumber,
      iupacName: props.IUPACName || null,
      formula: props.MolecularFormula || null,
      molecularWeight: props.MolecularWeight || null,
      smiles: props.CanonicalSMILES || null
    };
  } catch (error) {
    if (error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

// Fonction pour déterminer la classe chimique à partir du nom IUPAC ou de la structure
function determineChemicalClass(iupacName, smiles, moleculeName) {
  const name = (iupacName || moleculeName || '').toLowerCase();
  const smilesLower = (smiles || '').toLowerCase();
  
  // Terpènes et dérivés
  if (name.includes('terpene') || name.includes('pinene') || name.includes('limonene') || 
      name.includes('myrcene') || name.includes('caryophyllene') || name.includes('humulene') ||
      name.includes('farnesene') || name.includes('bisabolene') || name.includes('cadinene') ||
      name.includes('germacrene') || name.includes('elemene') || name.includes('selinene')) {
    if (name.includes('sesqui')) return 'Sesquiterpène';
    if (name.includes('di') || name.includes('diterpene')) return 'Diterpène';
    return 'Monoterpène';
  }
  
  // Terpénols
  if (name.includes('ol') && (name.includes('linalool') || name.includes('geraniol') || 
      name.includes('nerol') || name.includes('citronellol') || name.includes('menthol') ||
      name.includes('borneol') || name.includes('terpineol'))) {
    return 'Terpénol';
  }
  
  // Aldéhydes
  if (name.includes('aldehyde') || name.includes('al') && !name.includes('alcohol') ||
      name.includes('citral') || name.includes('geranial') || name.includes('neral') ||
      name.includes('citronellal') || name.includes('benzaldehyde')) {
    return 'Aldéhyde';
  }
  
  // Cétones
  if (name.includes('ketone') || name.includes('one') && !name.includes('bone') ||
      name.includes('carvone') || name.includes('menthone') || name.includes('camphor') ||
      name.includes('fenchone') || name.includes('thujone')) {
    return 'Cétone';
  }
  
  // Esters
  if (name.includes('ester') || name.includes('acetate') || name.includes('formate') ||
      name.includes('butyrate') || name.includes('propionate') || name.includes('benzoate')) {
    return 'Ester';
  }
  
  // Phénols
  if (name.includes('phenol') || name.includes('eugenol') || name.includes('thymol') ||
      name.includes('carvacrol') || name.includes('guaiacol') || name.includes('chavicol')) {
    return 'Phénol';
  }
  
  // Oxydes
  if (name.includes('oxide') || name.includes('cineole') || name.includes('eucalyptol') ||
      name.includes('epoxide') || name.includes('oxid')) {
    return 'Oxyde';
  }
  
  // Lactones
  if (name.includes('lactone') || name.includes('coumarin') || name.includes('lactide')) {
    return 'Lactone';
  }
  
  // Acides
  if (name.includes('acid') || name.includes('acide') || name.includes('oic acid') ||
      name.includes('carboxylic')) {
    return 'Acide carboxylique';
  }
  
  // Alcools
  if (name.includes('alcohol') || name.includes('ol') && !name.includes('phenol')) {
    return 'Alcool';
  }
  
  // Éthers
  if (name.includes('ether') || name.includes('methoxy') || name.includes('ethoxy')) {
    return 'Éther';
  }
  
  // Composés soufrés
  if (name.includes('sulfide') || name.includes('thio') || name.includes('mercapt') ||
      smilesLower.includes('s')) {
    return 'Composé soufré';
  }
  
  // Composés azotés
  if (name.includes('amine') || name.includes('indole') || name.includes('pyrrole') ||
      name.includes('pyridine') || name.includes('nitrile') || smilesLower.includes('n')) {
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
  log('=== DÉBUT DE L\'ENRICHISSEMENT PUBCHEM ===');
  
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
            casNumber: pubchemData.casNumber,
            iupacName: pubchemData.iupacName,
            formula: pubchemData.formula,
            molecularWeight: pubchemData.molecularWeight,
            chemicalClass: chemicalClass,
            smiles: pubchemData.smiles
          });
          results.stats.enriched++;
          log(`  ✓ Trouvé: CAS=${pubchemData.casNumber || 'N/A'}, IUPAC=${pubchemData.iupacName ? 'Oui' : 'Non'}`);
        } else {
          results.notFound.push({
            id: molecule.id,
            name: molecule.name,
            reason: 'Non trouvé sur PubChem'
          });
          results.stats.notFound++;
          log(`  ✗ Non trouvé sur PubChem`);
        }
        
        results.stats.processed++;
        
        // Délai entre les requêtes
        await sleep(DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        results.errors.push({
          id: molecule.id,
          name: molecule.name,
          error: error.message
        });
        results.stats.errors++;
        log(`  ⚠ Erreur: ${error.message}`);
        
        // Délai plus long en cas d'erreur
        await sleep(1000);
      }
    }
    
    // Sauvegarder les résultats intermédiaires
    results.stats.lastUpdate = new Date().toISOString();
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    log(`Résultats sauvegardés (${results.stats.processed}/${results.stats.total} traités)`);
    
    // Pause entre les lots
    if (batchIndex < batches.length - 1) {
      log(`Pause de ${DELAY_BETWEEN_BATCHES/1000} secondes avant le prochain lot...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }
  
  // Résumé final
  results.stats.endTime = new Date().toISOString();
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  
  log('\n=== RÉSUMÉ DE L\'ENRICHISSEMENT ===');
  log(`Total traité: ${results.stats.processed}`);
  log(`Enrichis avec succès: ${results.stats.enriched} (${((results.stats.enriched/results.stats.processed)*100).toFixed(1)}%)`);
  log(`Non trouvés: ${results.stats.notFound} (${((results.stats.notFound/results.stats.processed)*100).toFixed(1)}%)`);
  log(`Erreurs: ${results.stats.errors} (${((results.stats.errors/results.stats.processed)*100).toFixed(1)}%)`);
  
  // Statistiques détaillées sur les données récupérées
  const withCas = results.enriched.filter(m => m.casNumber).length;
  const withIupac = results.enriched.filter(m => m.iupacName).length;
  const withClass = results.enriched.filter(m => m.chemicalClass).length;
  
  log('\n=== DONNÉES RÉCUPÉRÉES ===');
  log(`Avec numéro CAS: ${withCas}/${results.stats.enriched}`);
  log(`Avec nom IUPAC: ${withIupac}/${results.stats.enriched}`);
  log(`Avec classe chimique: ${withClass}/${results.stats.enriched}`);
  
  log('\n=== FIN DE L\'ENRICHISSEMENT ===');
}

main().catch(err => {
  log(`ERREUR FATALE: ${err.message}`);
  console.error(err);
  process.exit(1);
});
