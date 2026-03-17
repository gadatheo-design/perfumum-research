/**
 * Service LOTUS (Linked Open natUral producTS) — remplace COCONUT
 * API publique gratuite pour l'enrichissement des molécules avec données de produits naturels
 * https://lotus.naturalproducts.net/
 * 
 * LOTUS contient 750 000+ molécules naturelles avec organismes sources (Wikidata-backed)
 * 
 * Note: COCONUT (coconut.naturalproducts.net) requiert désormais une authentification.
 * LOTUS est maintenu par la même équipe et fournit des données équivalentes via API publique.
 */

const LOTUS_API_BASE = 'https://lotus.naturalproducts.net/api';

// Délai entre les requêtes (respecter les limites de l'API)
const DELAY_MS = 400;
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
  'ocimène': 'ocimene',
  'terpinène': 'terpinene',
  'sabinène': 'sabinene',
  'phellandrène': 'phellandrene',
  'cymène': 'cymene',
  'terpinolène': 'terpinolene',
  'bergamotène': 'bergamotene',
  'zingibérène': 'zingiberene',
  'sélinène': 'selinene',
  'guaïol': 'guaiol',
  'élémol': 'elemol',
  'patchoulol': 'patchoulol',
  'vétivénol': 'vetivenol',
  'cédrol': 'cedrol',
  'santalol': 'santalol',
  
  // Aldéhydes
  'citral': 'citral',
  'citronellal': 'citronellal',
  'vanilline': 'vanillin',
  'benzaldéhyde': 'benzaldehyde',
  'cinnamaldéhyde': 'cinnamaldehyde',
  'héliotropine': 'heliotropin',
  'anisaldéhyde': 'anisaldehyde',
  
  // Cétones
  'carvone': 'carvone',
  'menthone': 'menthone',
  'ionone': 'ionone',
  'jasmone': 'jasmone',
  'damascénone': 'damascenone',
  'damascone': 'damascone',
  'acétophenone': 'acetophenone',
  
  // Phénols
  'eugénol': 'eugenol',
  'thymol': 'thymol',
  'carvacrol': 'carvacrol',
  'méthylchavicol': 'methylchavicol',
  'estragole': 'estragole',
  
  // Esters
  'acétate de linalyle': 'linalyl acetate',
  'acétate de géranyle': 'geranyl acetate',
  'acétate de benzyle': 'benzyl acetate',
  'benzoate de benzyle': 'benzyl benzoate',
  'salicylate de méthyle': 'methyl salicylate',
  
  // Lactones
  'coumarine': 'coumarin',
  'bergaptène': 'bergapten',
  
  // Alcools
  'benzylalcool': 'benzyl alcohol',
  'alcool benzylique': 'benzyl alcohol',
  'phényléthanol': 'phenylethanol',
  'alcool phényléthylique': 'phenethyl alcohol',
  
  // Préfixes grecs
  'alpha': 'alpha',
  'bêta': 'beta',
  'gamma': 'gamma',
  'delta': 'delta',
  'trans': 'trans',
  'cis': 'cis',
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
 * Mappe un résultat LOTUS vers le format COCONUTMolecule (compatibilité)
 */
function mapLotusToCoconut(lotusResult: Record<string, unknown>): COCONUTMolecule {
  // Extraire les organismes depuis allTaxa (noms d'espèces uniquement, pas les taxons supérieurs)
  const allTaxa = (lotusResult.allTaxa as string[]) || [];
  const organisms: COCONUTOrganism[] = allTaxa
    .filter((t: string) => t && t.includes(' ')) // garder seulement les noms binomiaux (espèces)
    .slice(0, 20)
    .map((name: string, i: number) => ({ id: i, name, rank: 'species' }));
  
  // Ajouter aussi les taxons supérieurs (genres, familles)
  const higherTaxa = allTaxa
    .filter((t: string) => t && !t.includes(' '))
    .slice(0, 5)
    .map((name: string, i: number) => ({ id: 100 + i, name, rank: 'higher' }));

  return {
    coconut_id: (lotusResult.lotus_id as string) || (lotusResult.id as string) || '',
    name: (lotusResult.traditional_name as string) || (lotusResult.iupac_name as string) || '',
    smiles: (lotusResult.smiles2D as string) || (lotusResult.smiles as string) || '',
    inchi: (lotusResult.inchi2D as string) || (lotusResult.inchi as string) || '',
    inchikey: (lotusResult.inchikey2D as string) || (lotusResult.inchikey as string) || '',
    molecular_formula: (lotusResult.molecular_formula as string) || '',
    molecular_weight: (lotusResult.molecular_weight as number) || undefined,
    alogp: (lotusResult.alogp as number) || (lotusResult.xlogp as number) || undefined,
    np_likeness_score: (lotusResult.npl_score as number) || undefined,
    organisms: [...organisms, ...higherTaxa],
    citations: [],
  };
}

/**
 * Recherche une molécule par nom dans LOTUS
 */
export async function searchCOCONUT(name: string, limit: number = 5): Promise<COCONUTMolecule[]> {
  try {
    const englishName = translateToEnglish(name);
    
    const url = `${LOTUS_API_BASE}/search/simple?query=${encodeURIComponent(englishName)}&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.error(`LOTUS search failed: ${response.status} for "${englishName}"`);
      return [];
    }
    
    const data = await response.json() as { naturalProducts?: Record<string, unknown>[] };
    
    if (!data.naturalProducts || !Array.isArray(data.naturalProducts)) {
      return [];
    }
    
    return data.naturalProducts.map(mapLotusToCoconut);
  } catch (error: unknown) {
    console.error('LOTUS search error:', error);
    return [];
  }
}

/**
 * Récupère les détails complets d'une molécule LOTUS par son ID
 */
export async function getCOCONUTMolecule(lotusId: string): Promise<COCONUTMolecule | null> {
  try {
    const url = `${LOTUS_API_BASE}/naturalProducts/${encodeURIComponent(lotusId)}`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.error(`LOTUS getMolecule failed: ${response.status}`);
      return null;
    }
    
    const data = await response.json() as Record<string, unknown>;
    return mapLotusToCoconut(data);
  } catch (error: unknown) {
    console.error('LOTUS getMolecule error:', error);
    return null;
  }
}

/**
 * Recherche une molécule par SMILES dans LOTUS
 */
export async function searchCOCONUTBySMILES(smiles: string): Promise<COCONUTMolecule[]> {
  try {
    const url = `${LOTUS_API_BASE}/search/structure?smiles=${encodeURIComponent(smiles)}&type=exact`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.error(`LOTUS SMILES search failed: ${response.status}`);
      return [];
    }
    
    const data = await response.json() as { naturalProducts?: Record<string, unknown>[] };
    return (data.naturalProducts || []).map(mapLotusToCoconut);
  } catch (error: unknown) {
    console.error('LOTUS SMILES search error:', error);
    return [];
  }
}

/**
 * Enrichit une molécule via LOTUS (recherche + récupération des détails)
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
        error: 'Molécule non trouvée dans LOTUS',
      };
    }
    
    // Prendre le meilleur résultat (premier = meilleur score tanimoto)
    const bestMatch = searchResults[0];
    
    await sleep(DELAY_MS);
    
    return {
      success: true,
      data: {
        coconut_id: bestMatch.coconut_id,
        name: bestMatch.name,
        smiles: bestMatch.smiles,
        inchi: bestMatch.inchi,
        inchikey: bestMatch.inchikey,
        molecular_formula: bestMatch.molecular_formula,
        molecular_weight: bestMatch.molecular_weight,
        np_likeness_score: bestMatch.np_likeness_score,
        organisms: bestMatch.organisms?.map(o => ({ name: o.name, rank: o.rank })),
        citations: bestMatch.citations?.map(c => ({ doi: c.doi, title: c.title })),
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
 * Enrichit une molécule avec traduction FR→EN via LOTUS
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
