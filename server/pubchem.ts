/**
 * PubChem PUG REST API Integration
 * 
 * Service pour enrichir les molécules avec des données scientifiques
 * depuis la base de données PubChem (NIH).
 * 
 * Documentation: https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
 * 
 * Limitations:
 * - Max 5 requêtes par seconde
 * - Timeout de 30 secondes par requête
 */

const PUBCHEM_BASE_URL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// Délai entre les requêtes pour respecter la politique d'utilisation (200ms = 5 req/s)
const REQUEST_DELAY_MS = 250;

export interface PubChemCompound {
  CID: number;
  MolecularFormula?: string;
  MolecularWeight?: number;
  IUPACName?: string;
  CanonicalSMILES?: string;
  InChI?: string;
  InChIKey?: string;
  XLogP?: number;
  ExactMass?: number;
  MonoisotopicMass?: number;
  TPSA?: number;
  Complexity?: number;
  Charge?: number;
  HBondDonorCount?: number;
  HBondAcceptorCount?: number;
  RotatableBondCount?: number;
  HeavyAtomCount?: number;
  IsomericSMILES?: string;
}

export interface PubChemSynonym {
  CID: number;
  Synonym: string[];
}

export interface EnrichmentResult {
  success: boolean;
  moleculeName: string;
  pubchemCID?: number;
  casNumber?: string;
  iupacName?: string;
  molecularWeight?: number;
  molecularFormula?: string;
  boilingPoint?: number;
  logP?: number;
  smiles?: string;
  inchi?: string;
  inchiKey?: string;
  complexity?: number;
  error?: string;
  source: 'pubchem';
  retrievedAt: Date;
}

/**
 * Attend un délai pour respecter les limites de l'API
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Recherche un composé par nom dans PubChem
 */
export async function searchCompoundByName(name: string): Promise<number[]> {
  try {
    const encodedName = encodeURIComponent(name);
    const url = `${PUBCHEM_BASE_URL}/compound/name/${encodedName}/cids/JSON`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return []; // Composé non trouvé
      }
      throw new Error(`PubChem API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.IdentifierList?.CID || [];
  } catch (error) {
    console.error(`Error searching PubChem for "${name}":`, error);
    return [];
  }
}

/**
 * Récupère les propriétés d'un composé par CID
 */
export async function getCompoundProperties(cid: number): Promise<PubChemCompound | null> {
  try {
    const properties = [
      'MolecularFormula',
      'MolecularWeight',
      'IUPACName',
      'CanonicalSMILES',
      'IsomericSMILES',
      'InChI',
      'InChIKey',
      'XLogP',
      'ExactMass',
      'MonoisotopicMass',
      'TPSA',
      'Complexity',
      'Charge',
      'HBondDonorCount',
      'HBondAcceptorCount',
      'RotatableBondCount',
      'HeavyAtomCount'
    ].join(',');
    
    const url = `${PUBCHEM_BASE_URL}/compound/cid/${cid}/property/${properties}/JSON`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`PubChem API error: ${response.status}`);
    }
    
    const data = await response.json();
    const props = data.PropertyTable?.Properties?.[0];
    
    if (!props) {
      return null;
    }
    
    return props as PubChemCompound;
  } catch (error) {
    console.error(`Error fetching properties for CID ${cid}:`, error);
    return null;
  }
}

/**
 * Récupère les synonymes d'un composé (incluant souvent le numéro CAS)
 */
export async function getCompoundSynonyms(cid: number): Promise<string[]> {
  try {
    const url = `${PUBCHEM_BASE_URL}/compound/cid/${cid}/synonyms/JSON`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.InformationList?.Information?.[0]?.Synonym || [];
  } catch (error) {
    console.error(`Error fetching synonyms for CID ${cid}:`, error);
    return [];
  }
}

/**
 * Extrait le numéro CAS des synonymes
 * Format CAS: XXXXX-XX-X (5-7 chiffres, 2 chiffres, 1 chiffre)
 */
export function extractCASNumber(synonyms: string[]): string | undefined {
  const casRegex = /^\d{2,7}-\d{2}-\d$/;
  
  for (const synonym of synonyms) {
    if (casRegex.test(synonym)) {
      return synonym;
    }
  }
  
  return undefined;
}

/**
 * Enrichit une molécule avec les données PubChem
 */
export async function enrichMolecule(moleculeName: string): Promise<EnrichmentResult> {
  const result: EnrichmentResult = {
    success: false,
    moleculeName,
    source: 'pubchem',
    retrievedAt: new Date()
  };
  
  try {
    // 1. Rechercher le composé par nom
    const cids = await searchCompoundByName(moleculeName);
    
    if (cids.length === 0) {
      result.error = 'Composé non trouvé dans PubChem';
      return result;
    }
    
    // Utiliser le premier CID (meilleure correspondance)
    const cid = cids[0];
    result.pubchemCID = cid;
    
    await delay(REQUEST_DELAY_MS);
    
    // 2. Récupérer les propriétés
    const properties = await getCompoundProperties(cid);
    
    if (properties) {
      result.iupacName = properties.IUPACName;
      result.molecularWeight = properties.MolecularWeight;
      result.molecularFormula = properties.MolecularFormula;
      result.smiles = properties.CanonicalSMILES;
      result.inchi = properties.InChI;
      result.inchiKey = properties.InChIKey;
      result.logP = properties.XLogP ? Math.round(properties.XLogP * 100) : undefined;
      result.complexity = properties.Complexity ? Math.round(properties.Complexity) : undefined;
    }
    
    await delay(REQUEST_DELAY_MS);
    
    // 3. Récupérer les synonymes pour trouver le CAS
    const synonyms = await getCompoundSynonyms(cid);
    result.casNumber = extractCASNumber(synonyms);
    
    result.success = true;
    return result;
    
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Erreur inconnue';
    return result;
  }
}

/**
 * Enrichit plusieurs molécules en lot avec gestion du rate limiting
 */
export async function enrichMoleculesBatch(
  moleculeNames: string[],
  onProgress?: (current: number, total: number, result: EnrichmentResult) => void
): Promise<EnrichmentResult[]> {
  const results: EnrichmentResult[] = [];
  
  for (let i = 0; i < moleculeNames.length; i++) {
    const name = moleculeNames[i];
    const result = await enrichMolecule(name);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, moleculeNames.length, result);
    }
    
    // Délai entre chaque molécule pour éviter le rate limiting
    if (i < moleculeNames.length - 1) {
      await delay(REQUEST_DELAY_MS * 2);
    }
  }
  
  return results;
}

/**
 * Détermine la classe chimique à partir du nom IUPAC ou de la formule
 */
export function inferChemicalClass(iupacName?: string, formula?: string): string | undefined {
  if (!iupacName) return undefined;
  
  const lowerName = iupacName.toLowerCase();
  
  // Détection basée sur les suffixes et patterns IUPAC
  if (lowerName.includes('terpene') || lowerName.match(/pinene|limonene|myrcene|camphene/)) {
    return 'terpene';
  }
  if (lowerName.includes('sesquiterp')) {
    return 'sesquiterpene';
  }
  if (lowerName.includes('diterp')) {
    return 'diterpene';
  }
  if (lowerName.includes('monoterp')) {
    return 'monoterpene';
  }
  if (lowerName.endsWith('al') || lowerName.includes('aldehyde')) {
    return 'aldehyde';
  }
  if (lowerName.endsWith('one') || lowerName.includes('ketone')) {
    return 'ketone';
  }
  if (lowerName.endsWith('ol') && !lowerName.endsWith('phenol')) {
    return 'alcohol';
  }
  if (lowerName.includes('ester') || lowerName.endsWith('ate')) {
    return 'ester';
  }
  if (lowerName.includes('ether')) {
    return 'ether';
  }
  if (lowerName.includes('phenol')) {
    return 'phenol';
  }
  if (lowerName.includes('lactone')) {
    return 'lactone';
  }
  if (lowerName.includes('coumarin')) {
    return 'coumarin';
  }
  if (lowerName.includes('musk') || lowerName.includes('muscone')) {
    return 'musk';
  }
  if (lowerName.includes('nitrile') || lowerName.includes('cyano')) {
    return 'nitrile';
  }
  if (lowerName.includes('thio') || lowerName.includes('sulfur') || lowerName.includes('mercapt')) {
    return 'sulfur_compound';
  }
  if (lowerName.includes('furan') || lowerName.includes('pyran') || lowerName.includes('pyrrole') || lowerName.includes('indole')) {
    return 'heterocyclic';
  }
  if (lowerName.includes('benzene') || lowerName.includes('phenyl') || lowerName.includes('toluene')) {
    return 'aromatic';
  }
  
  return undefined;
}
