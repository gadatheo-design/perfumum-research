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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
    
  } catch (error: unknown) {
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


// === TRADUCTION FRANÇAIS → ANGLAIS POUR L'ENRICHISSEMENT ===

const FR_TO_EN_MOLECULES: Record<string, string> = {
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
  "acétate d'éthyle": 'ethyl acetate',
  'acétate de méthyle': 'methyl acetate',
  'benzoate de benzyle': 'benzyl benzoate',
  'salicylate de benzyle': 'benzyl salicylate',
  'salicylate de méthyle': 'methyl salicylate',
  'cinnamate de méthyle': 'methyl cinnamate',
  "cinnamate d'éthyle": 'ethyl cinnamate',
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
  
  // Acides
  'acide benzoïque': 'benzoic acid',
  'acide cinnamique': 'cinnamic acid',
  'acide salicylique': 'salicylic acid',
  'acide phénylacétique': 'phenylacetic acid',
  'acide caféique': 'caffeic acid',
  'acide coumarique': 'coumaric acid',
  'acide p-coumarique': 'p-coumaric acid',
  'acide décanoïque (c10)': 'decanoic acid',
  'acide décanoïque': 'decanoic acid',
  'acide 2-méthylbutyrique': '2-methylbutyric acid',
  'acide 11-céto-β-boswellique (kba)': '11-keto-beta-boswellic acid',
  'acide 11-céto-bêta-boswellique': '11-keto-beta-boswellic acid',
  'acide 11-céto-boswellique': '11-keto-boswellic acid',
  '2-acétyl-5-méthylfurane': '2-acetyl-5-methylfuran',
  '2-mib (2-methylisoborneol)': '2-methylisoborneol',
  '4-methyl-guaiacol': '4-methylguaiacol',
  'acaciine': 'acaciin',
  // Absolues et mélanges complexes (noms descriptifs — pas de CID unique)
  "absolue d'iris (orris butter)": 'orris butter',
  'absolue de jasmin (indole)': 'jasmine absolute',
  'absolue de rose (citronellol)': 'rose absolute',
  'acacia brülé': 'acacia',
};

const FR_TO_EN_TERMS: Record<string, string> = {
  'acide': 'acid',
  'acétate': 'acetate',
  'aldéhyde': 'aldehyde',
  'alcool': 'alcohol',
  'cétone': 'ketone',
  'ester': 'ester',
  'oxyde': 'oxide',
  'éther': 'ether',
  'phénol': 'phenol',
  'lactone': 'lactone',
  'alpha': 'alpha',
  'bêta': 'beta',
  'gamma': 'gamma',
  'delta': 'delta',
  'cis': 'cis',
  'trans': 'trans',
  'méthyle': 'methyl',
  'éthyle': 'ethyl',
  'propyle': 'propyl',
  'butyle': 'butyl',
  'benzyle': 'benzyl',
};

/**
 * Traduit un nom de molécule du français vers l'anglais
 */
export function translateMoleculeName(frenchName: string): string {
  if (!frenchName) return frenchName;
  
  let name = frenchName.toLowerCase().trim();
  
  // Vérifier d'abord les traductions directes
  if (FR_TO_EN_MOLECULES[name]) {
    return FR_TO_EN_MOLECULES[name];
  }
  
  // Normaliser les accents
  name = name
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
  
  // Appliquer les traductions terme par terme
  for (const [fr, en] of Object.entries(FR_TO_EN_TERMS)) {
    const frNormalized = fr
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[ùûü]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/ç/g, 'c');
    
    const regex = new RegExp(`\\b${frNormalized}\\b`, 'gi');
    name = name.replace(regex, en);
  }
  
  return name.trim();
}

/**
 * Enrichit une molécule avec traduction automatique FR→EN
 */
export async function enrichMoleculeWithTranslation(moleculeName: string): Promise<EnrichmentResult> {
  // Essayer d'abord avec le nom original
  let result = await enrichMolecule(moleculeName);
  
  if (result.success) {
    return result;
  }
  
  // Essayer avec la traduction
  const translatedName = translateMoleculeName(moleculeName);
  
  if (translatedName !== moleculeName.toLowerCase()) {
    result = await enrichMolecule(translatedName);
    
    if (result.success) {
      // Garder le nom original dans le résultat
      result.moleculeName = moleculeName;
      return result;
    }
  }
  
  // Essayer avec le nom nettoyé (sans parenthèses, etc.)
  const cleanedName = moleculeName
    .replace(/\s*\([^)]*\)\s*/g, '')
    .replace(/\s*\[[^\]]*\]\s*/g, '')
    .trim();
  
  if (cleanedName !== moleculeName) {
    result = await enrichMolecule(cleanedName);
    
    if (result.success) {
      result.moleculeName = moleculeName;
      return result;
    }
    
    // Essayer la traduction du nom nettoyé
    const translatedClean = translateMoleculeName(cleanedName);
    if (translatedClean !== cleanedName.toLowerCase()) {
      result = await enrichMolecule(translatedClean);
      
      if (result.success) {
        result.moleculeName = moleculeName;
        return result;
      }
    }
  }
  
  // Retourner le résultat d'échec
  result.moleculeName = moleculeName;
  return result;
}
