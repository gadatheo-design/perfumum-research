/**
 * Trefle.io API Integration
 * 
 * Service pour enrichir les plantes avec des données taxonomiques
 * depuis la base de données Trefle.io (1 million de plantes).
 * 
 * Documentation: https://docs.trefle.io/reference/
 * 
 * Limitations:
 * - 120 requêtes par minute (2 req/s)
 * - Clé API requise (gratuite)
 */

// Note: L'API Trefle.io nécessite une clé API
// Pour l'instant, on utilise une approche hybride avec des données locales
// et des appels API quand la clé est disponible

const TREFLE_BASE_URL = 'https://trefle.io/api/v1';
const REQUEST_DELAY_MS = 600; // 100 req/min = ~1.6 req/s

export interface TreflePlant {
  id: number;
  common_name: string | null;
  scientific_name: string;
  slug: string;
  family: string | null;
  family_common_name: string | null;
  genus: string | null;
  genus_id: number | null;
  image_url: string | null;
  synonyms: string[];
  year: number | null;
  bibliography: string | null;
  author: string | null;
  status: string | null;
  rank: string | null;
  observations: string | null;
}

export interface TreflePlantDetails extends TreflePlant {
  main_species_id: number | null;
  vegetable: boolean;
  edible: boolean;
  edible_part: string | null;
  duration: string[] | null;
  growth_months: string[] | null;
  bloom_months: string[] | null;
  fruit_months: string[] | null;
  ground_humidity: number | null;
  growth_form: string | null;
  growth_habit: string | null;
  growth_rate: string | null;
  average_height_cm: number | null;
  maximum_height_cm: number | null;
  native_distribution: string[] | null;
  introduced_distribution: string[] | null;
  toxicity: string | null;
  light: number | null;
  atmospheric_humidity: number | null;
  minimum_precipitation_mm: number | null;
  maximum_precipitation_mm: number | null;
  minimum_temperature_deg_c: number | null;
  maximum_temperature_deg_c: number | null;
  soil_nutriments: number | null;
  soil_salinity: number | null;
  soil_texture: number | null;
  soil_humidity: number | null;
  ph_minimum: number | null;
  ph_maximum: number | null;
}

export interface TrefleSearchResult {
  data: TreflePlant[];
  links: {
    self: string;
    first: string;
    next: string | null;
    last: string;
  };
  meta: {
    total: number;
  };
}

export interface TrefleEnrichmentResult {
  success: boolean;
  plantName: string;
  trefleId?: number;
  scientificName?: string;
  family?: string;
  familyCommonName?: string;
  genus?: string;
  synonyms?: string[];
  author?: string;
  year?: number;
  bibliography?: string;
  nativeDistribution?: string[];
  introducedDistribution?: string[];
  edible?: boolean;
  toxicity?: string;
  growthHabit?: string;
  averageHeightCm?: number;
  maximumHeightCm?: number;
  bloomMonths?: string[];
  lightRequirement?: number;
  minTemperature?: number;
  maxTemperature?: number;
  phMin?: number;
  phMax?: number;
  imageUrl?: string;
  error?: string;
  source: 'trefle';
  retrievedAt: Date;
}

/**
 * Attend un délai pour respecter les limites de l'API
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Récupère la clé API Trefle depuis les variables d'environnement
 */
function getTrefleApiKey(): string | null {
  return process.env.TREFLE_API_KEY || null;
}

/**
 * Recherche des plantes par nom dans Trefle.io
 */
export async function searchPlants(query: string, page: number = 1): Promise<TrefleSearchResult | null> {
  const apiKey = getTrefleApiKey();
  
  if (!apiKey) {
    console.warn('Trefle API key not configured. Using local fallback data.');
    return searchPlantsLocal(query);
  }
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${TREFLE_BASE_URL}/plants/search?token=${apiKey}&q=${encodedQuery}&page=${page}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { data: [], links: { self: '', first: '', next: null, last: '' }, meta: { total: 0 } };
      }
      throw new Error(`Trefle API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as TrefleSearchResult;
  } catch (error: unknown) {
    console.error(`Error searching Trefle for "${query}":`, error);
    return searchPlantsLocal(query);
  }
}

/**
 * Récupère les détails d'une plante par ID
 */
export async function getPlantDetails(trefleId: number): Promise<TreflePlantDetails | null> {
  const apiKey = getTrefleApiKey();
  
  if (!apiKey) {
    console.warn('Trefle API key not configured.');
    return null;
  }
  
  try {
    const url = `${TREFLE_BASE_URL}/plants/${trefleId}?token=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Trefle API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data as TreflePlantDetails;
  } catch (error: unknown) {
    console.error(`Error fetching Trefle plant ${trefleId}:`, error);
    return null;
  }
}

/**
 * Recherche locale de plantes (fallback sans API)
 * Utilise une base de données locale de familles et genres botaniques
 */
function searchPlantsLocal(query: string): TrefleSearchResult {
  const lowerQuery = query.toLowerCase();
  
  // Base de données locale des familles botaniques importantes pour la parfumerie
  const localPlantData: Record<string, Partial<TreflePlant>> = {
    // Solanaceae (Tabac)
    'nicotiana tabacum': { id: 1, scientific_name: 'Nicotiana tabacum', common_name: 'Tobacco', family: 'Solanaceae', genus: 'Nicotiana' },
    'nicotiana rustica': { id: 2, scientific_name: 'Nicotiana rustica', common_name: 'Aztec Tobacco', family: 'Solanaceae', genus: 'Nicotiana' },
    
    // Cannabaceae (Cannabis)
    'cannabis sativa': { id: 3, scientific_name: 'Cannabis sativa', common_name: 'Hemp', family: 'Cannabaceae', genus: 'Cannabis' },
    'cannabis indica': { id: 4, scientific_name: 'Cannabis indica', common_name: 'Indian Hemp', family: 'Cannabaceae', genus: 'Cannabis' },
    
    // Lamiaceae (Lavande, Menthe, Romarin)
    'lavandula angustifolia': { id: 5, scientific_name: 'Lavandula angustifolia', common_name: 'Lavender', family: 'Lamiaceae', genus: 'Lavandula' },
    'mentha piperita': { id: 6, scientific_name: 'Mentha piperita', common_name: 'Peppermint', family: 'Lamiaceae', genus: 'Mentha' },
    'rosmarinus officinalis': { id: 7, scientific_name: 'Rosmarinus officinalis', common_name: 'Rosemary', family: 'Lamiaceae', genus: 'Rosmarinus' },
    'salvia officinalis': { id: 8, scientific_name: 'Salvia officinalis', common_name: 'Sage', family: 'Lamiaceae', genus: 'Salvia' },
    
    // Rutaceae (Agrumes)
    'citrus bergamia': { id: 9, scientific_name: 'Citrus bergamia', common_name: 'Bergamot', family: 'Rutaceae', genus: 'Citrus' },
    'citrus sinensis': { id: 10, scientific_name: 'Citrus sinensis', common_name: 'Sweet Orange', family: 'Rutaceae', genus: 'Citrus' },
    'citrus limon': { id: 11, scientific_name: 'Citrus limon', common_name: 'Lemon', family: 'Rutaceae', genus: 'Citrus' },
    
    // Santalaceae (Santal)
    'santalum album': { id: 12, scientific_name: 'Santalum album', common_name: 'Sandalwood', family: 'Santalaceae', genus: 'Santalum' },
    
    // Burseraceae (Encens)
    'boswellia sacra': { id: 13, scientific_name: 'Boswellia sacra', common_name: 'Frankincense', family: 'Burseraceae', genus: 'Boswellia' },
    'commiphora myrrha': { id: 14, scientific_name: 'Commiphora myrrha', common_name: 'Myrrh', family: 'Burseraceae', genus: 'Commiphora' },
    
    // Poaceae (Vétiver)
    'chrysopogon zizanioides': { id: 15, scientific_name: 'Chrysopogon zizanioides', common_name: 'Vetiver', family: 'Poaceae', genus: 'Chrysopogon' },
    
    // Geraniaceae (Géranium)
    'pelargonium graveolens': { id: 16, scientific_name: 'Pelargonium graveolens', common_name: 'Rose Geranium', family: 'Geraniaceae', genus: 'Pelargonium' },
    
    // Rosaceae (Rose)
    'rosa damascena': { id: 17, scientific_name: 'Rosa damascena', common_name: 'Damask Rose', family: 'Rosaceae', genus: 'Rosa' },
    'rosa centifolia': { id: 18, scientific_name: 'Rosa centifolia', common_name: 'Cabbage Rose', family: 'Rosaceae', genus: 'Rosa' },
    
    // Oleaceae (Jasmin)
    'jasminum grandiflorum': { id: 19, scientific_name: 'Jasminum grandiflorum', common_name: 'Jasmine', family: 'Oleaceae', genus: 'Jasminum' },
    
    // Lauraceae (Cannelle, Laurier)
    'cinnamomum verum': { id: 20, scientific_name: 'Cinnamomum verum', common_name: 'Cinnamon', family: 'Lauraceae', genus: 'Cinnamomum' },
    
    // Myrtaceae (Eucalyptus)
    'eucalyptus globulus': { id: 21, scientific_name: 'Eucalyptus globulus', common_name: 'Blue Gum', family: 'Myrtaceae', genus: 'Eucalyptus' },
    
    // Pinaceae (Pin, Cèdre)
    'cedrus atlantica': { id: 22, scientific_name: 'Cedrus atlantica', common_name: 'Atlas Cedar', family: 'Pinaceae', genus: 'Cedrus' },
    'pinus sylvestris': { id: 23, scientific_name: 'Pinus sylvestris', common_name: 'Scots Pine', family: 'Pinaceae', genus: 'Pinus' },
    
    // Cupressaceae (Cyprès)
    'cupressus sempervirens': { id: 24, scientific_name: 'Cupressus sempervirens', common_name: 'Mediterranean Cypress', family: 'Cupressaceae', genus: 'Cupressus' },
    
    // Apiaceae (Angélique, Coriandre)
    'angelica archangelica': { id: 25, scientific_name: 'Angelica archangelica', common_name: 'Angelica', family: 'Apiaceae', genus: 'Angelica' },
    'coriandrum sativum': { id: 26, scientific_name: 'Coriandrum sativum', common_name: 'Coriander', family: 'Apiaceae', genus: 'Coriandrum' },
    
    // Zingiberaceae (Gingembre)
    'zingiber officinale': { id: 27, scientific_name: 'Zingiber officinale', common_name: 'Ginger', family: 'Zingiberaceae', genus: 'Zingiber' },
    
    // Iridaceae (Iris)
    'iris pallida': { id: 28, scientific_name: 'Iris pallida', common_name: 'Orris', family: 'Iridaceae', genus: 'Iris' },
    
    // Fabaceae (Tonka)
    'dipteryx odorata': { id: 29, scientific_name: 'Dipteryx odorata', common_name: 'Tonka Bean', family: 'Fabaceae', genus: 'Dipteryx' },
    
    // Styracaceae (Benjoin)
    'styrax benzoin': { id: 30, scientific_name: 'Styrax benzoin', common_name: 'Benzoin', family: 'Styracaceae', genus: 'Styrax' },
  };
  
  // Recherche par correspondance partielle
  const matches = Object.entries(localPlantData)
    .filter(([key]) => key.includes(lowerQuery) || localPlantData[key].common_name?.toLowerCase().includes(lowerQuery))
    .map(([_, plant]) => ({
      ...plant,
      slug: plant.scientific_name?.toLowerCase().replace(/\s+/g, '-') || '',
      synonyms: [],
      year: null,
      bibliography: null,
      author: null,
      status: 'accepted',
      rank: 'species',
      observations: null,
      image_url: null,
      family_common_name: null,
      genus_id: null,
    } as TreflePlant));
  
  return {
    data: matches,
    links: { self: '', first: '', next: null, last: '' },
    meta: { total: matches.length }
  };
}

/**
 * Base de données locale des familles botaniques avec leurs caractéristiques
 */
const BOTANICAL_FAMILIES: Record<string, { commonName: string; description: string; typicalGenera: string[] }> = {
  'Solanaceae': { commonName: 'Nightshade family', description: 'Includes tobacco, tomato, potato', typicalGenera: ['Nicotiana', 'Solanum', 'Capsicum'] },
  'Cannabaceae': { commonName: 'Hemp family', description: 'Includes cannabis and hops', typicalGenera: ['Cannabis', 'Humulus'] },
  'Lamiaceae': { commonName: 'Mint family', description: 'Aromatic herbs with square stems', typicalGenera: ['Lavandula', 'Mentha', 'Rosmarinus', 'Salvia', 'Thymus', 'Ocimum'] },
  'Rutaceae': { commonName: 'Citrus family', description: 'Citrus fruits and aromatic plants', typicalGenera: ['Citrus', 'Ruta', 'Zanthoxylum'] },
  'Santalaceae': { commonName: 'Sandalwood family', description: 'Parasitic woody plants', typicalGenera: ['Santalum'] },
  'Burseraceae': { commonName: 'Incense tree family', description: 'Resinous tropical trees', typicalGenera: ['Boswellia', 'Commiphora', 'Canarium'] },
  'Poaceae': { commonName: 'Grass family', description: 'Grasses including vetiver', typicalGenera: ['Chrysopogon', 'Cymbopogon'] },
  'Geraniaceae': { commonName: 'Geranium family', description: 'Aromatic flowering plants', typicalGenera: ['Pelargonium', 'Geranium'] },
  'Rosaceae': { commonName: 'Rose family', description: 'Roses and stone fruits', typicalGenera: ['Rosa', 'Prunus'] },
  'Oleaceae': { commonName: 'Olive family', description: 'Includes jasmine and olive', typicalGenera: ['Jasminum', 'Olea'] },
  'Lauraceae': { commonName: 'Laurel family', description: 'Aromatic trees and shrubs', typicalGenera: ['Cinnamomum', 'Laurus', 'Persea'] },
  'Myrtaceae': { commonName: 'Myrtle family', description: 'Aromatic trees with essential oils', typicalGenera: ['Eucalyptus', 'Melaleuca', 'Syzygium'] },
  'Pinaceae': { commonName: 'Pine family', description: 'Coniferous trees', typicalGenera: ['Pinus', 'Cedrus', 'Abies', 'Picea'] },
  'Cupressaceae': { commonName: 'Cypress family', description: 'Coniferous trees and shrubs', typicalGenera: ['Cupressus', 'Juniperus', 'Thuja'] },
  'Apiaceae': { commonName: 'Carrot family', description: 'Aromatic herbs with umbel flowers', typicalGenera: ['Angelica', 'Coriandrum', 'Foeniculum', 'Anethum'] },
  'Zingiberaceae': { commonName: 'Ginger family', description: 'Tropical aromatic rhizomes', typicalGenera: ['Zingiber', 'Curcuma', 'Elettaria'] },
  'Iridaceae': { commonName: 'Iris family', description: 'Bulbous flowering plants', typicalGenera: ['Iris', 'Crocus'] },
  'Fabaceae': { commonName: 'Legume family', description: 'Includes tonka bean', typicalGenera: ['Dipteryx', 'Acacia'] },
  'Styracaceae': { commonName: 'Storax family', description: 'Resinous trees', typicalGenera: ['Styrax'] },
  'Asteraceae': { commonName: 'Daisy family', description: 'Composite flowers', typicalGenera: ['Artemisia', 'Tagetes', 'Chamaemelum'] },
  'Orchidaceae': { commonName: 'Orchid family', description: 'Includes vanilla', typicalGenera: ['Vanilla'] },
};

/**
 * Infère la famille botanique à partir du nom scientifique
 */
export function inferBotanicalFamily(scientificName: string): { family: string; familyCommonName: string } | null {
  const lowerName = scientificName.toLowerCase();
  
  // Extraction du genre (premier mot du nom scientifique)
  const genus = scientificName.split(' ')[0];
  
  // Recherche dans les familles connues
  for (const [family, info] of Object.entries(BOTANICAL_FAMILIES)) {
    if (info.typicalGenera.some(g => g.toLowerCase() === genus.toLowerCase())) {
      return { family, familyCommonName: info.commonName };
    }
  }
  
  return null;
}

/**
 * Enrichit une plante avec les données Trefle.io
 */
export async function enrichPlant(plantName: string, scientificName?: string): Promise<TrefleEnrichmentResult> {
  const result: TrefleEnrichmentResult = {
    success: false,
    plantName,
    source: 'trefle',
    retrievedAt: new Date()
  };
  
  try {
    // Utiliser le nom scientifique si disponible, sinon le nom commun
    const searchQuery = scientificName || plantName;
    
    // 1. Rechercher la plante
    const searchResult = await searchPlants(searchQuery);
    
    if (!searchResult || searchResult.data.length === 0) {
      // Essayer d'inférer la famille à partir du nom scientifique
      if (scientificName) {
        const inferred = inferBotanicalFamily(scientificName);
        if (inferred) {
          result.family = inferred.family;
          result.familyCommonName = inferred.familyCommonName;
          result.scientificName = scientificName;
          result.genus = scientificName.split(' ')[0];
          result.success = true;
          return result;
        }
      }
      
      result.error = 'Plante non trouvée dans Trefle.io';
      return result;
    }
    
    // Utiliser le premier résultat (meilleure correspondance)
    const plant = searchResult.data[0];
    result.trefleId = plant.id;
    result.scientificName = plant.scientific_name;
    result.family = plant.family || undefined;
    result.familyCommonName = plant.family_common_name || undefined;
    result.genus = plant.genus || undefined;
    result.synonyms = plant.synonyms || [];
    result.author = plant.author || undefined;
    result.year = plant.year || undefined;
    result.bibliography = plant.bibliography || undefined;
    result.imageUrl = plant.image_url || undefined;
    
    // Si on a une clé API, récupérer les détails complets
    const apiKey = getTrefleApiKey();
    if (apiKey && plant.id) {
      await delay(REQUEST_DELAY_MS);
      
      const details = await getPlantDetails(plant.id);
      if (details) {
        result.nativeDistribution = details.native_distribution || undefined;
        result.introducedDistribution = details.introduced_distribution || undefined;
        result.edible = details.edible;
        result.toxicity = details.toxicity || undefined;
        result.growthHabit = details.growth_habit || undefined;
        result.averageHeightCm = details.average_height_cm || undefined;
        result.maximumHeightCm = details.maximum_height_cm || undefined;
        result.bloomMonths = details.bloom_months || undefined;
        result.lightRequirement = details.light || undefined;
        result.minTemperature = details.minimum_temperature_deg_c || undefined;
        result.maxTemperature = details.maximum_temperature_deg_c || undefined;
        result.phMin = details.ph_minimum || undefined;
        result.phMax = details.ph_maximum || undefined;
      }
    }
    
    result.success = true;
    return result;
    
  } catch (error: unknown) {
    result.error = error instanceof Error ? error.message : 'Erreur inconnue';
    return result;
  }
}

/**
 * Enrichit plusieurs plantes en lot avec gestion du rate limiting
 */
export async function enrichPlantsBatch(
  plants: Array<{ name: string; scientificName?: string }>,
  onProgress?: (current: number, total: number, result: TrefleEnrichmentResult) => void
): Promise<TrefleEnrichmentResult[]> {
  const results: TrefleEnrichmentResult[] = [];
  
  for (let i = 0; i < plants.length; i++) {
    const plant = plants[i];
    const result = await enrichPlant(plant.name, plant.scientificName);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, plants.length, result);
    }
    
    // Délai entre chaque plante pour éviter le rate limiting
    if (i < plants.length - 1) {
      await delay(REQUEST_DELAY_MS);
    }
  }
  
  return results;
}

/**
 * Récupère les informations sur une famille botanique
 */
export function getBotanicalFamilyInfo(family: string): { commonName: string; description: string; typicalGenera: string[] } | null {
  return BOTANICAL_FAMILIES[family] || null;
}

/**
 * Liste toutes les familles botaniques connues
 */
export function getAllBotanicalFamilies(): Array<{ family: string; commonName: string; description: string }> {
  return Object.entries(BOTANICAL_FAMILIES).map(([family, info]) => ({
    family,
    commonName: info.commonName,
    description: info.description
  }));
}
