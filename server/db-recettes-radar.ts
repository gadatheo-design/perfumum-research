import { getDb } from './db';
import { withCache, invalidateRecetteCache, CACHE_TTL, cache } from './cache';

// Clés de cache pour les profils radar
const RADAR_CACHE_KEY = 'recettes:radar:all';
const RADAR_RECETTE_KEY = (id: number) => `recettes:radar:${id}`;

// Interface pour une recette avec son profil radar moyen
export interface RecetteWithRadar {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  ingredients: string | null;
  formula: string | null;
  intensity: number | null;
  stability: string | null;
  parentRecetteId: number | null;
  createdAt: Date | null;
  // Profil radar moyen calculé
  avgIntensity: number;
  avgFreshness: number;
  avgWarmth: number;
  avgSweetness: number;
  avgSpiciness: number;
  avgEarthiness: number;
  moleculeCount: number;
}

const RADAR_QUERY = `
  SELECT
    r.id,
    r.name,
    r.category,
    r.description,
    r.ingredients,
    r.formula,
    r.intensity,
    r.stability,
    r.parent_recette_id AS parentRecetteId,
    r.createdAt,
    COALESCE(
      SUM(m.radar_intensity * COALESCE(mr.proportion, 1)) / NULLIF(SUM(COALESCE(mr.proportion, 1)), 0),
      50
    ) AS avgIntensity,
    COALESCE(
      SUM(m.radar_freshness * COALESCE(mr.proportion, 1)) / NULLIF(SUM(COALESCE(mr.proportion, 1)), 0),
      50
    ) AS avgFreshness,
    COALESCE(
      SUM(m.radar_warmth * COALESCE(mr.proportion, 1)) / NULLIF(SUM(COALESCE(mr.proportion, 1)), 0),
      50
    ) AS avgWarmth,
    COALESCE(
      SUM(m.radar_sweetness * COALESCE(mr.proportion, 1)) / NULLIF(SUM(COALESCE(mr.proportion, 1)), 0),
      50
    ) AS avgSweetness,
    COALESCE(
      SUM(m.radar_spiciness * COALESCE(mr.proportion, 1)) / NULLIF(SUM(COALESCE(mr.proportion, 1)), 0),
      50
    ) AS avgSpiciness,
    COALESCE(
      SUM(m.radar_earthiness * COALESCE(mr.proportion, 1)) / NULLIF(SUM(COALESCE(mr.proportion, 1)), 0),
      50
    ) AS avgEarthiness,
    COUNT(DISTINCT mr.molecule_id) AS moleculeCount
  FROM recettes r
  LEFT JOIN molecules_recettes mr ON mr.recette_id = r.id
  LEFT JOIN molecules m ON m.id = mr.molecule_id
  GROUP BY r.id, r.name, r.category, r.description, r.ingredients, r.formula,
           r.intensity, r.stability, r.parent_recette_id, r.createdAt
  ORDER BY r.id
`;

// Récupérer toutes les recettes avec leur profil radar moyen
// Optimisé : 1 seule requête SQL agrégée + cache TTL 5 min
export async function getAllRecettesWithRadar(): Promise<RecetteWithRadar[]> {
  return withCache<RecetteWithRadar[]>(
    RADAR_CACHE_KEY,
    async () => {
      const db = await getDb();
      if (!db) return [];
      type RadarRow = Record<string, unknown>;
      const [rows] = await (db as unknown as { $client: { promise: () => { query: (q: string) => Promise<[RadarRow[], unknown]> } } }).$client.promise().query(RADAR_QUERY);
      return rows.map((r: RadarRow): RecetteWithRadar => ({
        id: Number(r.id),
        name: String(r.name || ''),
        category: r.category ? String(r.category) : null,
        description: r.description ? String(r.description) : null,
        ingredients: r.ingredients ? String(r.ingredients) : null,
        formula: r.formula ? String(r.formula) : null,
        intensity: r.intensity ? Number(r.intensity) : null,
        stability: r.stability ? String(r.stability) : null,
        parentRecetteId: r.parentRecetteId ? Number(r.parentRecetteId) : null,
        createdAt: r.createdAt ? new Date(String(r.createdAt)) : null,
        avgIntensity: Math.round(Number(r.avgIntensity) || 50),
        avgFreshness: Math.round(Number(r.avgFreshness) || 50),
        avgWarmth: Math.round(Number(r.avgWarmth) || 50),
        avgSweetness: Math.round(Number(r.avgSweetness) || 50),
        avgSpiciness: Math.round(Number(r.avgSpiciness) || 50),
        avgEarthiness: Math.round(Number(r.avgEarthiness) || 50),
        moleculeCount: Number(r.moleculeCount) || 0,
      }));
    },
    CACHE_TTL.MEDIUM
  );
}

// Invalider tout le cache radar (ex: ajout/suppression de recette)
export function invalidateRadarCache(): void {
  cache.invalidate(RADAR_CACHE_KEY);
  cache.invalidatePattern('^recettes:radar:');
  invalidateRecetteCache();
}

// Invalider le cache radar d'une seule recette (ex: ajout d'une molécule à une recette existante)
export function invalidateRadarCacheForRecette(recetteId: number): void {
  cache.invalidate(RADAR_RECETTE_KEY(recetteId));
  // Invalider aussi le cache global car la liste agrégée contient cette recette
  cache.invalidate(RADAR_CACHE_KEY);
  invalidateRecetteCache(recetteId);
}

// Interface pour les filtres radar
export interface RadarFilters {
  intensityMin?: number;
  intensityMax?: number;
  freshnessMin?: number;
  freshnessMax?: number;
  warmthMin?: number;
  warmthMax?: number;
  sweetnessMin?: number;
  sweetnessMax?: number;
  spicinessMin?: number;
  spicinessMax?: number;
  earthinessMin?: number;
  earthinessMax?: number;
}

// Filtrer les recettes par profil radar
export function filterRecettesByRadar(
  recettes: RecetteWithRadar[],
  filters: RadarFilters
): RecetteWithRadar[] {
  return recettes.filter((r) => {
    if (filters.intensityMin !== undefined && r.avgIntensity < filters.intensityMin) return false;
    if (filters.intensityMax !== undefined && r.avgIntensity > filters.intensityMax) return false;
    if (filters.freshnessMin !== undefined && r.avgFreshness < filters.freshnessMin) return false;
    if (filters.freshnessMax !== undefined && r.avgFreshness > filters.freshnessMax) return false;
    if (filters.warmthMin !== undefined && r.avgWarmth < filters.warmthMin) return false;
    if (filters.warmthMax !== undefined && r.avgWarmth > filters.warmthMax) return false;
    if (filters.sweetnessMin !== undefined && r.avgSweetness < filters.sweetnessMin) return false;
    if (filters.sweetnessMax !== undefined && r.avgSweetness > filters.sweetnessMax) return false;
    if (filters.spicinessMin !== undefined && r.avgSpiciness < filters.spicinessMin) return false;
    if (filters.spicinessMax !== undefined && r.avgSpiciness > filters.spicinessMax) return false;
    if (filters.earthinessMin !== undefined && r.avgEarthiness < filters.earthinessMin) return false;
    if (filters.earthinessMax !== undefined && r.avgEarthiness > filters.earthinessMax) return false;
    return true;
  });
}
