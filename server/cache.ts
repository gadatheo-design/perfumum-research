/**
 * PERFUMUM In-Memory Cache System
 * 
 * Système de cache léger pour optimiser les requêtes fréquentes.
 * Utilise un cache en mémoire avec TTL (Time To Live) configurable.
 * 
 * Caractéristiques:
 * - Cache LRU (Least Recently Used) avec limite de taille
 * - TTL configurable par entrée
 * - Invalidation automatique et manuelle
 * - Statistiques de hit/miss pour monitoring
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize: number;
  private defaultTTL: number;
  private stats: CacheStats;

  constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) { // 5 minutes par défaut
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      maxSize: maxSize
    };
  }

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Vérifier si l'entrée a expiré
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      this.stats.misses++;
      return null;
    }

    entry.hits++;
    this.stats.hits++;
    return entry.data;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Éviction LRU si le cache est plein
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
      hits: 0
    });
    this.stats.size = this.cache.size;
  }

  /**
   * Invalide une entrée spécifique
   */
  invalidate(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.stats.size = this.cache.size;
    return deleted;
  }

  /**
   * Invalide toutes les entrées correspondant à un pattern
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of Array.from(this.cache.keys())) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    this.stats.size = this.cache.size;
    return count;
  }

  /**
   * Vide entièrement le cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats(): CacheStats & { hitRate: string } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%';
    
    return {
      ...this.stats,
      hitRate
    };
  }

  /**
   * Éviction LRU - supprime l'entrée la moins récemment utilisée
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}

// Instance singleton du cache
export const cache = new MemoryCache(1000, 5 * 60 * 1000); // 1000 entrées, 5 min TTL

// Clés de cache prédéfinies pour les requêtes fréquentes
export const CACHE_KEYS = {
  MOLECULES_LIST: 'molecules:list',
  MOLECULES_COUNT: 'molecules:count',
  PLANTS_LIST: 'plants:list',
  PLANTS_COUNT: 'plants:count',
  RECETTES_LIST: 'recettes:list',
  RECETTES_COUNT: 'recettes:count',
  FAMILIES_LIST: 'families:list',
  TERROIRS_LIST: 'terroirs:list',
  SEARCH_GLOBAL: (query: string) => `search:global:${query}`,
  MOLECULE_DETAIL: (id: number) => `molecule:${id}`,
  PLANT_DETAIL: (id: number) => `plant:${id}`,
  RECETTE_DETAIL: (id: number) => `recette:${id}`,
  STATS_GLOBAL: 'stats:global',
  STATS_COVERAGE: 'stats:coverage',
};

// TTL personnalisés (en millisecondes)
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute - données très dynamiques
  MEDIUM: 5 * 60 * 1000,     // 5 minutes - données modérément dynamiques
  LONG: 15 * 60 * 1000,      // 15 minutes - données relativement stables
  VERY_LONG: 60 * 60 * 1000, // 1 heure - données très stables
};

/**
 * Helper pour wrapper une fonction avec cache
 */
export function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  return fn().then((result) => {
    cache.set(key, result, ttl);
    return result;
  });
}

/**
 * Invalidation du cache lors des mutations
 */
export function invalidateMoleculeCache(moleculeId?: number): void {
  if (moleculeId) {
    cache.invalidate(CACHE_KEYS.MOLECULE_DETAIL(moleculeId));
  }
  cache.invalidate(CACHE_KEYS.MOLECULES_LIST);
  cache.invalidate(CACHE_KEYS.MOLECULES_COUNT);
  cache.invalidatePattern('^search:');
  cache.invalidate(CACHE_KEYS.STATS_GLOBAL);
}

export function invalidatePlantCache(plantId?: number): void {
  if (plantId) {
    cache.invalidate(CACHE_KEYS.PLANT_DETAIL(plantId));
  }
  cache.invalidate(CACHE_KEYS.PLANTS_LIST);
  cache.invalidate(CACHE_KEYS.PLANTS_COUNT);
  cache.invalidatePattern('^search:');
  cache.invalidate(CACHE_KEYS.STATS_GLOBAL);
}

export function invalidateRecetteCache(recetteId?: number): void {
  if (recetteId) {
    cache.invalidate(CACHE_KEYS.RECETTE_DETAIL(recetteId));
  }
  cache.invalidate(CACHE_KEYS.RECETTES_LIST);
  cache.invalidate(CACHE_KEYS.RECETTES_COUNT);
  cache.invalidatePattern('^search:');
  cache.invalidate(CACHE_KEYS.STATS_GLOBAL);
}

export function invalidateAllCache(): void {
  cache.clear();
}
