/**
 * Service COCONUT (COlleCtion of Open NatUral producTs)
 * API gratuite pour l'enrichissement des molécules avec données de produits naturels
 * https://coconut.naturalproducts.net/
 * 
 * COCONUT contient 716,697 molécules et 70,896 organismes sources
 */

const COCONUT_API_BASE = 'https://coconut.naturalproducts.net/api';

// Délai entre les requêtes (respecter les limites de l'API)
const DELAY_MS = 300;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dictionnaire de traduction français→anglais pour les molécules
const FR_TO_EN_DICTIONARY: Record<string, string> = {
  // Terpènes
  'limonène': 'limonene',
  'pinène': 'pinene',
  'myrcène': 'myrcene',
  'linalol': 'linalool',
  'géraniol': 'geraniol',
  'nérol': 'nerol',
  'citronellol': 'citronellol',
  'terpinéol': 'terpineol',
  'menthol': 'menthol',
  'bornéol': 'borneol',
  'camphre': 'camphor',
  'eucalyptol': 'eucalyptol',
  'caryophyllène': 'caryophyllene',
  'humulène': 'humulene',
  'bisabolol': 'bisabolol',
  'farnésol': 'farnesol',
  'nérolidol': 'nerolidol',
  
  // Aldéhydes
  'citral': 'citral',
  'citronellal': 'citronellal',
  'vanilline': 'vanillin',
  'benzaldéhyde': 'benzaldehyde',
  'cinnamaldéhyde': 'cinnamaldehyde',
  
  // Cétones
  'carvone': 'carvone',
  'menthone': 'menthone',
  'ionone': 'ionone',
  'jasmone': 'jasmone',
  
  // Phénols
  'eugénol': 'eugenol',
  'thymol': 'thymol',
  'carvacrol': 'carvacrol',
  
  // Lactones
  'coumarine': 'coumarin',
  
  // Préfixes grecs
  'alpha': 'alpha',
  'bêta': 'beta',
  'gamma': 'gamma',
  'delta': 'delta',
};

/**
 * Traduit un nom de molécule du français vers l'anglais
 */
function translateToEnglish(frenchName: string): string {
  let name = frenchName.toLowerCase().trim();
  
  for (const [fr, en] of Object.entries(FR_TO_EN_DICTIONARY)) {
    name = name.replace(new RegExp(fr, 'gi'), en);
  }
  
  return name;
}

export interface COCONUTMolecule {
  coconut_id: string;
  name: string;
  smiles?: string;
  inchi?: string;
  inchikey?: string;
  molecular_formula?: string;
  molecular_weight?: number;
  exact_mass?: number;
  alogp?: number;
  topological_polar_surface_area?: number;
  np_likeness_score?: number;
  organisms?: COCONUTOrganism[];
  citations?: COCONUTCitation[];
  collection?: string;
  annotation_level?: number;
}

export interface COCONUTOrganism {
  id: number;
  name: string;
  iri?: string;
  rank?: string;
}

export interface COCONUTCitation {
  doi?: string;
  title?: string;
  authors?: string;
  citation_text?: string;
}

export interface COCONUTSearchResult {
  data: COCONUTMolecule[];
  total: number;
  page: number;
  per_page: number;
}

/**
 * Recherche une molécule par nom dans COCONUT
 */
export async function searchCOCONUT(name: string, limit: number = 5): Promise<COCONUTMolecule[]> {
  try {
    const englishName = translateToEnglish(name);
    
    const url = `${COCONUT_API_BASE}/search/simple?query=${encodeURIComponent(englishName)}&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`COCONUT search failed: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }
    
    return data.data;
  } catch (error: unknown) {
    console.error('COCONUT search error:', error);
    return [];
  }
}

/**
 * Récupère les détails complets d'une molécule COCONUT par son ID
 */
export async function getCOCONUTMolecule(coconutId: string): Promise<COCONUTMolecule | null> {
  try {
    const url = `${COCONUT_API_BASE}/molecules/${encodeURIComponent(coconutId)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`COCONUT getMolecule failed: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    console.error('COCONUT getMolecule error:', error);
    return null;
  }
}

/**
 * Recherche une molécule par SMILES dans COCONUT
 */
export async function searchCOCONUTBySMILES(smiles: string): Promise<COCONUTMolecule[]> {
  try {
    const url = `${COCONUT_API_BASE}/search/structure?smiles=${encodeURIComponent(smiles)}&type=exact`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`COCONUT SMILES search failed: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error: unknown) {
    console.error('COCONUT SMILES search error:', error);
    return [];
  }
}

/**
 * Enrichit une molécule via COCONUT (recherche + récupération des détails)
 */
export async function enrichMoleculeFromCOCONUT(moleculeName: string): Promise<{
  success: boolean;
  data?: {
    coconut_id: string;
    name: string;
    smiles?: string;
    inchi?: string;
    inchikey?: string;
    molecular_formula?: string;
    molecular_weight?: number;
    np_likeness_score?: number;
    organisms?: { name: string; rank?: string }[];
    citations?: { doi?: string; title?: string }[];
  };
  error?: string;
}> {
  try {
    // Rechercher la molécule
    const searchResults = await searchCOCONUT(moleculeName, 3);
    
    if (searchResults.length === 0) {
      return {
        success: false,
        error: 'Molécule non trouvée dans COCONUT',
      };
    }
    
    // Prendre le meilleur résultat
    const bestMatch = searchResults[0];
    
    await sleep(DELAY_MS);
    
    // Récupérer les détails complets si nécessaire
    let molecule = bestMatch;
    if (bestMatch.coconut_id && (!bestMatch.organisms || bestMatch.organisms.length === 0)) {
      const detailed = await getCOCONUTMolecule(bestMatch.coconut_id);
      if (detailed) {
        molecule = detailed;
      }
    }
    
    return {
      success: true,
      data: {
        coconut_id: molecule.coconut_id,
        name: molecule.name,
        smiles: molecule.smiles,
        inchi: molecule.inchi,
        inchikey: molecule.inchikey,
        molecular_formula: molecule.molecular_formula,
        molecular_weight: molecule.molecular_weight,
        np_likeness_score: molecule.np_likeness_score,
        organisms: molecule.organisms?.map(o => ({ name: o.name, rank: o.rank })),
        citations: molecule.citations?.map(c => ({ doi: c.doi, title: c.title })),
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Enrichit une molécule avec traduction FR→EN via COCONUT
 */
export async function enrichMoleculeWithTranslationCOCONUT(moleculeName: string): Promise<{
  success: boolean;
  coconut_id?: string;
  name?: string;
  smiles?: string;
  inchi?: string;
  inchikey?: string;
  molecular_formula?: string;
  molecular_weight?: number;
  np_likeness_score?: number;
  organisms?: { name: string; rank?: string }[];
  citations?: { doi?: string; title?: string }[];
  error?: string;
}> {
  const result = await enrichMoleculeFromCOCONUT(moleculeName);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error,
    };
  }
  
  return {
    success: true,
    ...result.data,
  };
}
