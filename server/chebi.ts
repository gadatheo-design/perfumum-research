/**
 * Service ChEBI (Chemical Entities of Biological Interest)
 * API gratuite de l'EBI pour l'enrichissement des données moléculaires
 * https://www.ebi.ac.uk/chebi/
 * 
 * Utilisé comme alternative à PubChem pour les molécules non trouvées
 */

const CHEBI_BASE = 'https://www.ebi.ac.uk/webservices/chebi/2.0';

// Délai entre les requêtes (respecter les limites de l'API)
const DELAY_MS = 500;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dictionnaire de traduction français→anglais (même que PubChem)
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
  'aldéhyde': 'aldehyde',
  
  // Cétones
  'carvone': 'carvone',
  'menthone': 'menthone',
  'ionone': 'ionone',
  'jasmone': 'jasmone',
  'cétone': 'ketone',
  
  // Phénols
  'eugénol': 'eugenol',
  'thymol': 'thymol',
  'carvacrol': 'carvacrol',
  'phénol': 'phenol',
  
  // Acides
  'acide': 'acid',
  'acétique': 'acetic',
  'benzoïque': 'benzoic',
  'cinnamique': 'cinnamic',
  
  // Esters
  'acétate': 'acetate',
  'benzoate': 'benzoate',
  'ester': 'ester',
  
  // Lactones
  'coumarine': 'coumarin',
  'lactone': 'lactone',
  
  // Préfixes
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
  
  // Remplacer les termes français par leurs équivalents anglais
  for (const [fr, en] of Object.entries(FR_TO_EN_DICTIONARY)) {
    name = name.replace(new RegExp(fr, 'gi'), en);
  }
  
  return name;
}

export interface ChEBISearchResult {
  chebiId: string;
  chebiAsciiName: string;
  searchScore: number;
}

export interface ChEBIEntity {
  chebiId: string;
  chebiAsciiName: string;
  definition?: string;
  smiles?: string;
  inchi?: string;
  inchiKey?: string;
  formula?: string;
  mass?: number;
  charge?: number;
  synonyms?: string[];
}

/**
 * Recherche une molécule par nom dans ChEBI
 */
export async function searchChEBI(name: string): Promise<ChEBISearchResult[]> {
  try {
    // Traduire le nom en anglais
    const englishName = translateToEnglish(name);
    
    const url = `${CHEBI_BASE}/test/getLiteEntity?search=${encodeURIComponent(englishName)}&searchCategory=ALL&maximumResults=5&starsCategory=ALL`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`ChEBI search failed: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.return || !Array.isArray(data.return)) {
      return [];
    }
    
    return data.return.map((item: any) => ({
      chebiId: item.chebiId,
      chebiAsciiName: item.chebiAsciiName,
      searchScore: item.searchScore || 0,
    }));
  } catch (error: unknown) {
    console.error('ChEBI search error:', error);
    return [];
  }
}

/**
 * Récupère les détails complets d'une entité ChEBI par son ID
 */
export async function getChEBIEntity(chebiId: string): Promise<ChEBIEntity | null> {
  try {
    const url = `${CHEBI_BASE}/test/getCompleteEntity?chebiId=${encodeURIComponent(chebiId)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`ChEBI getEntity failed: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.return) {
      return null;
    }
    
    const entity = data.return;
    
    // Extraire les données structurelles
    let smiles: string | undefined;
    let inchi: string | undefined;
    let inchiKey: string | undefined;
    
    if (entity.ChemicalStructures) {
      for (const struct of entity.ChemicalStructures) {
        if (struct.type === 'SMILES') {
          smiles = struct.structure;
        } else if (struct.type === 'InChI') {
          inchi = struct.structure;
        } else if (struct.type === 'InChIKey') {
          inchiKey = struct.structure;
        }
      }
    }
    
    // Extraire les synonymes
    const synonyms: string[] = [];
    if (entity.Synonyms) {
      for (const syn of entity.Synonyms) {
        if (syn.data) {
          synonyms.push(syn.data);
        }
      }
    }
    
    return {
      chebiId: entity.chebiId,
      chebiAsciiName: entity.chebiAsciiName,
      definition: entity.definition,
      smiles,
      inchi,
      inchiKey,
      formula: entity.Formulae?.[0]?.data,
      mass: entity.mass ? parseFloat(entity.mass) : undefined,
      charge: entity.charge ? parseInt(entity.charge) : undefined,
      synonyms,
    };
  } catch (error: unknown) {
    console.error('ChEBI getEntity error:', error);
    return null;
  }
}

/**
 * Enrichit une molécule via ChEBI (recherche + récupération des détails)
 */
export async function enrichMoleculeFromChEBI(moleculeName: string): Promise<{
  success: boolean;
  data?: ChEBIEntity;
  error?: string;
}> {
  try {
    // Rechercher la molécule
    const searchResults = await searchChEBI(moleculeName);
    
    if (searchResults.length === 0) {
      return {
        success: false,
        error: 'Molécule non trouvée dans ChEBI',
      };
    }
    
    // Prendre le meilleur résultat
    const bestMatch = searchResults[0];
    
    await sleep(DELAY_MS);
    
    // Récupérer les détails complets
    const entity = await getChEBIEntity(bestMatch.chebiId);
    
    if (!entity) {
      return {
        success: false,
        error: 'Impossible de récupérer les détails ChEBI',
      };
    }
    
    return {
      success: true,
      data: entity,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Enrichit une molécule avec traduction FR→EN et fallback ChEBI
 */
export async function enrichMoleculeWithTranslationChEBI(moleculeName: string): Promise<{
  success: boolean;
  chebiId?: string;
  smiles?: string;
  inchi?: string;
  inchiKey?: string;
  formula?: string;
  mass?: number;
  definition?: string;
  synonyms?: string[];
  error?: string;
}> {
  const result = await enrichMoleculeFromChEBI(moleculeName);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error,
    };
  }
  
  return {
    success: true,
    chebiId: result.data.chebiId,
    smiles: result.data.smiles,
    inchi: result.data.inchi,
    inchiKey: result.data.inchiKey,
    formula: result.data.formula,
    mass: result.data.mass,
    definition: result.data.definition,
    synonyms: result.data.synonyms,
  };
}
