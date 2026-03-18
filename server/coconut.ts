/**
 * Service LOTUS (Linked Open natUral producTS) — remplace COCONUT
 * API publique gratuite pour l'enrichissement des molécules avec données de produits naturels
 * https://lotus.naturalproducts.net/
 * 
 * LOTUS contient 750 000+ molécules naturelles avec organismes sources (Wikidata-backed)
 * 
 * v2 — Amélioration majeure de la traduction FR→EN :
 * - Suppression des accents (NFD normalization)
 * - Remplacement des lettres grecques Unicode (α, β, γ, δ) par leurs équivalents ASCII
 * - Traduction de 200+ termes chimiques français → anglais
 * - Génération de variantes de recherche (avec/sans stéréochimie, avec/sans préfixes)
 * - Fallback par numéro CAS si la recherche par nom échoue
 */

const LOTUS_API_BASE = 'https://lotus.naturalproducts.net/api';

const DELAY_MS = 400;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Normalise un nom de molécule : supprime les accents, normalise les caractères grecs,
 * nettoie les parenthèses de masse (C10, C12, etc.)
 */
function normalizeMoleculeName(name: string): string {
  let n = name.trim();
  
  // 1. Remplacer les lettres grecques Unicode par leurs équivalents ASCII
  n = n
    .replace(/\u03b1/g, 'alpha').replace(/\u03b2/g, 'beta')
    .replace(/\u03b3/g, 'gamma').replace(/\u03b4/g, 'delta')
    .replace(/\u03b5/g, 'epsilon').replace(/\u03c9/g, 'omega')
    .replace(/\u0391/g, 'alpha').replace(/\u0392/g, 'beta')
    .replace(/\u0393/g, 'gamma').replace(/\u0394/g, 'delta')
    .replace(/\u03a9/g, 'omega');

  // 2. Supprimer les accents français (décomposition Unicode)
  n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // 3. Nettoyer les parenthèses de masse (C10, C12, etc.)
  n = n.replace(/\s*\(C\d+\)/g, '');
  n = n.replace(/\s*\(\d+:\d+\)/g, '');
  
  return n.trim();
}

/**
 * Traduit un nom de molécule du français vers l'anglais
 * Stratégie : normalisation des accents + traduction terme par terme
 */
function translateToEnglish(frenchName: string): string {
  // D'abord normaliser (supprimer accents, remplacer grecs)
  let name = normalizeMoleculeName(frenchName).toLowerCase().trim();
  
  // Traductions multi-mots (en premier pour éviter les conflits)
  const multiWord: [RegExp, string][] = [
    [/acide decanoique/gi, 'decanoic acid'],
    [/acide hexanoique/gi, 'hexanoic acid'],
    [/acide octanoique/gi, 'octanoic acid'],
    [/acide linoleique/gi, 'linoleic acid'],
    [/acide linolenique/gi, 'linolenic acid'],
    [/acide oleique/gi, 'oleic acid'],
    [/acide palmitique/gi, 'palmitic acid'],
    [/acide stearique/gi, 'stearic acid'],
    [/acide benzoique/gi, 'benzoic acid'],
    [/acide caffeique/gi, 'caffeic acid'],
    [/acide coumarique/gi, 'coumaric acid'],
    [/acide ferulique/gi, 'ferulic acid'],
    [/acide gallique/gi, 'gallic acid'],
    [/acide rosmarinique/gi, 'rosmarinic acid'],
    [/acide salicylique/gi, 'salicylic acid'],
    [/acide succinique/gi, 'succinic acid'],
    [/acide fumarique/gi, 'fumaric acid'],
    [/acide malique/gi, 'malic acid'],
    [/acide citrique/gi, 'citric acid'],
    [/acide tartrique/gi, 'tartaric acid'],
    [/acide oxalique/gi, 'oxalic acid'],
    [/acide pyruvique/gi, 'pyruvic acid'],
    [/acide lactique/gi, 'lactic acid'],
    [/acide ascorbique/gi, 'ascorbic acid'],
    [/acide formique/gi, 'formic acid'],
    [/acide acetique/gi, 'acetic acid'],
    [/acide propionique/gi, 'propionic acid'],
    [/acide butyrique/gi, 'butyric acid'],
    [/acide valerique/gi, 'valeric acid'],
    [/acide hexadecanoique/gi, 'hexadecanoic acid'],
    [/acide dodecanoique/gi, 'dodecanoic acid'],
    [/acide tetradecanoique/gi, 'tetradecanoic acid'],
    [/acide octadecanoique/gi, 'octadecanoic acid'],
    [/acide undecanoique/gi, 'undecanoic acid'],
    [/acide nonanoique/gi, 'nonanoic acid'],
    [/acide heptanoique/gi, 'heptanoic acid'],
    [/acide glutamique/gi, 'glutamic acid'],
    [/acide aspartique/gi, 'aspartic acid'],
    [/acide aminee?/gi, 'amino acid'],
    [/acide boswellique/gi, 'boswellic acid'],
    [/acide ursolique/gi, 'ursolic acid'],
    [/acide oleanolique/gi, 'oleanolic acid'],
    [/acide betulinique/gi, 'betulinic acid'],
    [/acide chlorogenique/gi, 'chlorogenic acid'],
    [/acide hyaluronique/gi, 'hyaluronic acid'],
    [/acide abscissique/gi, 'abscisic acid'],
    [/acide abietique/gi, 'abietic acid'],
    [/acide dehydroabietique/gi, 'dehydroabietic acid'],
    [/acide pimarique/gi, 'pimaric acid'],
    [/acide jasmonique/gi, 'jasmonic acid'],
    [/acetate de linalyle/gi, 'linalyl acetate'],
    [/acetate de geranyle/gi, 'geranyl acetate'],
    [/acetate de benzyle/gi, 'benzyl acetate'],
    [/acetate de neryle/gi, 'neryl acetate'],
    [/acetate de citronellyle/gi, 'citronellyl acetate'],
    [/acetate de bornyle/gi, 'bornyl acetate'],
    [/acetate de terpinyle/gi, 'terpinyl acetate'],
    [/acetate de lavandulyle/gi, 'lavandulyl acetate'],
    [/benzoate de benzyle/gi, 'benzyl benzoate'],
    [/salicylate de methyle/gi, 'methyl salicylate'],
    [/cinnamate de methyle/gi, 'methyl cinnamate'],
    [/alcool benzylique/gi, 'benzyl alcohol'],
    [/alcool phenylethylique/gi, 'phenethyl alcohol'],
    [/alcool cinnamique/gi, 'cinnamyl alcohol'],
    [/alcool anisique/gi, 'anisyl alcohol'],
    [/alcool perillique/gi, 'perillyl alcohol'],
    [/alcool furfurylique/gi, 'furfuryl alcohol'],
    [/sulfure de dimethyle/gi, 'dimethyl sulfide'],
    [/disulfure de dimethyle/gi, 'dimethyl disulfide'],
    [/trisulfure de dimethyle/gi, 'dimethyl trisulfide'],
    [/isothiocyanate de benzyle/gi, 'benzyl isothiocyanate'],
    [/phenols oxydes/gi, 'oxidized phenols'],
    [/glycine pyrolysee/gi, 'pyrolyzed glycine'],
    [/pyrolyse de/gi, 'pyrolysis of'],
  ];
  
  for (const [pattern, replacement] of multiWord) {
    name = name.replace(pattern, replacement);
  }
  
  // Traductions simples (termes individuels)
  const simple: [RegExp, string][] = [
    [/\bacide\b/gi, 'acid'],
    [/\balcool\b/gi, 'alcohol'],
    [/\bgeosmine\b/gi, 'geosmin'],
    [/\bvanilline\b/gi, 'vanillin'],
    [/\bcoumarine\b/gi, 'coumarin'],
    [/\bbergaptene\b/gi, 'bergapten'],
    [/\bphenylethanol\b/gi, 'phenylethanol'],
    [/\bphenylalanine\b/gi, 'phenylalanine'],
    [/\btryptophane\b/gi, 'tryptophan'],
    [/\btyrosine\b/gi, 'tyrosine'],
    [/\bserine\b/gi, 'serine'],
    [/\bthreonine\b/gi, 'threonine'],
    [/\bcysteine\b/gi, 'cysteine'],
    [/\bmethionine\b/gi, 'methionine'],
    [/\blysine\b/gi, 'lysine'],
    [/\barginine\b/gi, 'arginine'],
    [/\bhistidine\b/gi, 'histidine'],
    [/\bleucine\b/gi, 'leucine'],
    [/\bisoleucine\b/gi, 'isoleucine'],
    [/\bvaline\b/gi, 'valine'],
    [/\balanine\b/gi, 'alanine'],
    [/\bproline\b/gi, 'proline'],
    [/\bglycine\b/gi, 'glycine'],
    [/\bcapsaicine\b/gi, 'capsaicin'],
    [/\bpiperine\b/gi, 'piperine'],
    [/\bcurcumine\b/gi, 'curcumin'],
    [/\bgingerol\b/gi, 'gingerol'],
    [/\bquercetine\b/gi, 'quercetin'],
    [/\bkaempferol\b/gi, 'kaempferol'],
    [/\bapigenine\b/gi, 'apigenin'],
    [/\bnaringenine\b/gi, 'naringenin'],
    [/\bhesperidine\b/gi, 'hesperidin'],
    [/\bresveratrol\b/gi, 'resveratrol'],
    [/\blycopene\b/gi, 'lycopene'],
    [/\bluteine\b/gi, 'lutein'],
    [/\bzeaxanthine\b/gi, 'zeaxanthin'],
    [/\banthocyanine\b/gi, 'anthocyanin'],
    [/\bchlorophylle\b/gi, 'chlorophyll'],
    [/\bcarotene\b/gi, 'carotene'],
    [/\bxanthophylle\b/gi, 'xanthophyll'],
    [/\bsqualene\b/gi, 'squalene'],
    [/\bcholesterol\b/gi, 'cholesterol'],
    [/\bergosterol\b/gi, 'ergosterol'],
    [/\bstigmasterol\b/gi, 'stigmasterol'],
    [/\bsitosterol\b/gi, 'sitosterol'],
    [/\bcampesterol\b/gi, 'campesterol'],
    [/\bbetuline\b/gi, 'betulin'],
    [/\blupeol\b/gi, 'lupeol'],
    [/\bursol\b/gi, 'ursol'],
    [/\bcarnosol\b/gi, 'carnosol'],
    [/\bthymoquinone\b/gi, 'thymoquinone'],
    [/\bnicotine\b/gi, 'nicotine'],
    [/\bcotinine\b/gi, 'cotinine'],
    [/\bcaffeine\b/gi, 'caffeine'],
    [/\btheobromine\b/gi, 'theobromine'],
    [/\btheophylline\b/gi, 'theophylline'],
    [/\bmelatonine\b/gi, 'melatonin'],
    [/\bserotonine\b/gi, 'serotonin'],
    [/\bdopamine\b/gi, 'dopamine'],
    [/\bhistamine\b/gi, 'histamine'],
    [/\badrenaline\b/gi, 'adrenaline'],
    [/\bnoradrenaline\b/gi, 'noradrenaline'],
    [/\bquinine\b/gi, 'quinine'],
    [/\bstrychnine\b/gi, 'strychnine'],
    [/\bcolchicine\b/gi, 'colchicine'],
    [/\bvincristine\b/gi, 'vincristine'],
    [/\bvinblastine\b/gi, 'vinblastine'],
    [/\bpaclitaxel\b/gi, 'paclitaxel'],
    [/\bdocetaxel\b/gi, 'docetaxel'],
    [/\bartemisinine\b/gi, 'artemisinin'],
    [/\bberberine\b/gi, 'berberine'],
    [/\bpalmatine\b/gi, 'palmatine'],
    [/\bephedrine\b/gi, 'ephedrine'],
    [/\bpseudoephedrine\b/gi, 'pseudoephedrine'],
    [/\byohimbine\b/gi, 'yohimbine'],
    [/\bpyrolyse\b/gi, 'pyrolysis'],
    [/\boxyde\b/gi, 'oxide'],
    [/\boxydee?\b/gi, 'oxidized'],
    [/\bperoxyde\b/gi, 'peroxide'],
    [/\bhydroxy\b/gi, 'hydroxy'],
    [/\bcarbonyle\b/gi, 'carbonyl'],
    [/\bnitro\b/gi, 'nitro'],
    [/\bamino\b/gi, 'amino'],
    [/\bcyano\b/gi, 'cyano'],
    [/\bisothiocyanate\b/gi, 'isothiocyanate'],
    [/\bthiocyanate\b/gi, 'thiocyanate'],
    [/\bmercapto\b/gi, 'mercapto'],
    [/\bdisulfure\b/gi, 'disulfide'],
    [/\btrisulfure\b/gi, 'trisulfide'],
    [/\bsulfure\b/gi, 'sulfide'],
    [/\bsulfoxide\b/gi, 'sulfoxide'],
    [/\bsulfone\b/gi, 'sulfone'],
    [/\bchlorure\b/gi, 'chloride'],
    [/\bbromure\b/gi, 'bromide'],
    [/\biodure\b/gi, 'iodide'],
    [/\bfluorure\b/gi, 'fluoride'],
    [/\bglycol\b/gi, 'glycol'],
    [/\bglycerol\b/gi, 'glycerol'],
    [/\bglucose\b/gi, 'glucose'],
    [/\bfructose\b/gi, 'fructose'],
    [/\bsaccharose\b/gi, 'sucrose'],
    [/\blactose\b/gi, 'lactose'],
    [/\bmaltose\b/gi, 'maltose'],
    [/\bcellulose\b/gi, 'cellulose'],
    [/\bamidon\b/gi, 'starch'],
    [/\bpectine\b/gi, 'pectin'],
    [/\bchitine\b/gi, 'chitin'],
    [/\bchitosane\b/gi, 'chitosan'],
    [/\bcollagene\b/gi, 'collagen'],
    [/\bgelatine\b/gi, 'gelatin'],
    [/\bkeratine\b/gi, 'keratin'],
    [/\bmelanine\b/gi, 'melanin'],
    [/\bsel\b/gi, 'salt'],
    [/\bneutre\b/gi, 'neutral'],
    [/\bcation\b/gi, 'cation'],
    [/\banion\b/gi, 'anion'],
    [/\bradical\b/gi, 'radical'],
    [/\bhuile\b/gi, 'oil'],
    [/\bgraisse\b/gi, 'fat'],
    [/\btriglyceride\b/gi, 'triglyceride'],
    [/\blecithine\b/gi, 'lecithin'],
    [/\bphospholipide\b/gi, 'phospholipid'],
    [/\bcire\b/gi, 'wax'],
    [/\bparaffine\b/gi, 'paraffin'],
    [/\bsaturee?\b/gi, 'saturated'],
    [/\binsaturee?\b/gi, 'unsaturated'],
    [/\bconjuguee?\b/gi, 'conjugated'],
    [/\baromatique\b/gi, 'aromatic'],
    [/\bcyclique\b/gi, 'cyclic'],
    [/\bacyclique\b/gi, 'acyclic'],
    [/\bbicyclique\b/gi, 'bicyclic'],
    [/\btricyclique\b/gi, 'tricyclic'],
    [/\bpolycyclique\b/gi, 'polycyclic'],
    [/\blineaire\b/gi, 'linear'],
    [/\bbranchu\b/gi, 'branched'],
    [/\bchaine\b/gi, 'chain'],
    [/\banneau\b/gi, 'ring'],
    [/\bcycle\b/gi, 'cycle'],
    [/\bnoyau\b/gi, 'nucleus'],
    [/\bsubstituee?\b/gi, 'substituted'],
    [/\bderivee?\b/gi, 'derivative'],
    [/\banalogue\b/gi, 'analog'],
    [/\bhomologue\b/gi, 'homolog'],
    [/\bisomere\b/gi, 'isomer'],
    [/\benantiomere\b/gi, 'enantiomer'],
    [/\bdiastereomere\b/gi, 'diastereomer'],
    [/\btautomere\b/gi, 'tautomer'],
    [/\bhydrate\b/gi, 'hydrate'],
    [/\bsolvate\b/gi, 'solvate'],
    [/\bfurane\b/gi, 'furan'],
    [/\bfuranne\b/gi, 'furan'],
    [/\bpyrazine\b/gi, 'pyrazine'],
    [/\bpyridine\b/gi, 'pyridine'],
    [/\bindole\b/gi, 'indole'],
    [/\bthiazole\b/gi, 'thiazole'],
    [/\boxazole\b/gi, 'oxazole'],
    [/\bimidazole\b/gi, 'imidazole'],
    [/\bpurine\b/gi, 'purine'],
    [/\bpyrimidine\b/gi, 'pyrimidine'],
    [/\bpyrrole\b/gi, 'pyrrole'],
    [/\bpyrrolidine\b/gi, 'pyrrolidine'],
    [/\bpiperidine\b/gi, 'piperidine'],
    [/\bpiperazine\b/gi, 'piperazine'],
    [/\bmorpholine\b/gi, 'morpholine'],
    [/\bthiophene\b/gi, 'thiophene'],
    [/\bsysteme\b/gi, 'system'],
    [/\bsystemes\b/gi, 'systems'],
  ];
  
  for (const [pattern, replacement] of simple) {
    name = name.replace(pattern, replacement);
  }
  
  // Nettoyer les espaces multiples
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
}

/**
 * Génère plusieurs variantes de recherche pour une molécule
 */
function generateSearchVariants(moleculeName: string): string[] {
  const variants: string[] = [];
  
  // 1. Nom original
  variants.push(moleculeName);
  
  // 2. Nom normalisé (sans accents, grecs remplacés)
  const normalized = normalizeMoleculeName(moleculeName);
  if (normalized !== moleculeName) variants.push(normalized);
  
  // 3. Traduction complète FR→EN
  const translated = translateToEnglish(moleculeName);
  if (translated !== normalized && translated !== moleculeName) variants.push(translated);
  
  // 4. Variante sans préfixes stéréochimiques
  const withoutStereo = translated
    .replace(/^(alpha-|beta-|gamma-|delta-|trans-|cis-|\(e\)-|\(z\)-|\(\+\)-|\(-\)-|\(r\)-|\(s\)-|dl-|d-|l-|rac-)/i, '')
    .trim();
  if (withoutStereo !== translated && withoutStereo.length > 2) variants.push(withoutStereo);
  
  // 5. Variante avec lettres grecques Unicode (LOTUS accepte les deux)
  const withGreek = translated
    .replace(/\balpha-/gi, '\u03b1-')
    .replace(/\bbeta-/gi, '\u03b2-')
    .replace(/\bgamma-/gi, '\u03b3-')
    .replace(/\bdelta-/gi, '\u03b4-');
  if (withGreek !== translated) variants.push(withGreek);
  
  // 6. Variante sans préfixe numérique de position (1-, 2-, 3-)
  // LOTUS n'accepte souvent pas les préfixes numériques de position
  const withoutNumPrefix = translated.replace(/^\d+-/, '').trim();
  if (withoutNumPrefix !== translated && withoutNumPrefix.length > 2) variants.push(withoutNumPrefix);
  
  // 7. Variante avec parenthèses extraites (ex: "2-MIB (2-Methylisoborneol)" → "2-Methylisoborneol")
  const parenMatch = moleculeName.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1] && parenMatch[1].length > 3 && !/^C\d+$/.test(parenMatch[1])) {
    const innerName = normalizeMoleculeName(parenMatch[1]);
    if (innerName.length > 2) variants.push(innerName);
  }
  
  // Dédupliquer et filtrer
  return [...new Set(variants)].filter(v => v.length > 2);
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
  const allTaxa = (lotusResult.allTaxa as string[]) || [];
  const organisms: COCONUTOrganism[] = allTaxa
    .filter((t: string) => t && t.includes(' '))
    .slice(0, 20)
    .map((name: string, i: number) => ({ id: i, name, rank: 'species' }));
  
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
 * Essaie plusieurs variantes de recherche pour maximiser les chances de succès
 */
export async function searchCOCONUT(name: string, limit: number = 5): Promise<COCONUTMolecule[]> {
  const variants = generateSearchVariants(name);
  
  for (const variant of variants) {
    try {
      const url = `${LOTUS_API_BASE}/search/simple?query=${encodeURIComponent(variant)}&limit=${limit}`;
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) {
        console.error(`LOTUS search failed: ${response.status} for "${variant}"`);
        continue;
      }
      
      const data = await response.json() as { naturalProducts?: Record<string, unknown>[] };
      
      if (!data.naturalProducts || !Array.isArray(data.naturalProducts) || data.naturalProducts.length === 0) {
        continue;
      }
      
      return data.naturalProducts.map(mapLotusToCoconut);
    } catch (error: unknown) {
      console.error(`LOTUS search error for "${variant}":`, error);
      continue;
    }
    
    await sleep(200);
  }
  
  return [];
}

/**
 * Récupère les détails complets d'une molécule LOTUS par son ID
 */
export async function getCOCONUTMolecule(lotusId: string): Promise<COCONUTMolecule | null> {
  try {
    const url = `${LOTUS_API_BASE}/search/simple?query=${encodeURIComponent(lotusId)}&limit=1`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.error(`LOTUS getMolecule failed: ${response.status}`);
      return null;
    }
    
    const data = await response.json() as { naturalProducts?: Record<string, unknown>[] };
    if (!data.naturalProducts || data.naturalProducts.length === 0) return null;
    return mapLotusToCoconut(data.naturalProducts[0]);
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
    const url = `${LOTUS_API_BASE}/search/simple?query=${encodeURIComponent(smiles)}&limit=5`;
    
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
 * Utilise plusieurs stratégies de recherche avec fallback par CAS
 */
export async function enrichMoleculeFromCOCONUT(moleculeName: string, casNumber?: string): Promise<{
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
    // Stratégie 1 : Recherche par nom avec variantes
    let searchResults = await searchCOCONUT(moleculeName, 3);
    
    // Stratégie 2 : Si pas de résultats et CAS disponible, essayer par CAS
    if (searchResults.length === 0 && casNumber && casNumber.trim()) {
      await sleep(DELAY_MS);
      try {
        const casUrl = `${LOTUS_API_BASE}/search/simple?query=${encodeURIComponent(casNumber.trim())}&limit=3`;
        const casResponse = await fetch(casUrl, { headers: { 'Accept': 'application/json' } });
        if (casResponse.ok) {
          const casData = await casResponse.json() as { naturalProducts?: Record<string, unknown>[] };
          if (casData.naturalProducts && casData.naturalProducts.length > 0) {
            searchResults = casData.naturalProducts.map(mapLotusToCoconut);
          }
        }
      } catch (e) {
        // Ignorer l'erreur CAS
      }
    }
    
    if (searchResults.length === 0) {
      return {
        success: false,
        error: 'Molécule non trouvée dans LOTUS',
      };
    }
    
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
export async function enrichMoleculeWithTranslationCOCONUT(moleculeName: string, casNumber?: string): Promise<{
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
  const result = await enrichMoleculeFromCOCONUT(moleculeName, casNumber);
  
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
