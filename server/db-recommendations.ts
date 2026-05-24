import { getDb } from './db';
import { withCache, CACHE_TTL } from './cache';

// Clés de cache
const RADAR_PROFILES_CACHE_KEY = 'recommendations:radar:all';
const MOLECULES_RADAR_CACHE_KEY = 'recommendations:molecules:radar:all';
const RECETTE_MOLECULE_LINKS_CACHE_KEY = 'recommendations:recette-molecule-links';

// Interface pour une recette avec son profil radar
export interface RecetteWithRadar {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  avgIntensity: number;
  avgFreshness: number;
  avgWarmth: number;
  avgSweetness: number;
  avgSpiciness: number;
  avgEarthiness: number;
  moleculeCount: number;
}

// Interface pour une molécule avec son profil radar
export interface MoleculeWithRadar {
  id: number;
  name: string;
  family: string | null;
  olfactiveProfile: string | null;
  radarIntensity: number;
  radarFreshness: number;
  radarWarmth: number;
  radarSweetness: number;
  radarSpiciness: number;
  radarEarthiness: number;
}

// Calculer la distance euclidienne entre deux profils radar
function calculateRadarDistance(
  profile1: { intensity: number; freshness: number; warmth: number; sweetness: number; spiciness: number; earthiness: number },
  profile2: { intensity: number; freshness: number; warmth: number; sweetness: number; spiciness: number; earthiness: number }
): number {
  const sumOfSquares =
    (profile1.intensity - profile2.intensity) ** 2 +
    (profile1.freshness - profile2.freshness) ** 2 +
    (profile1.warmth - profile2.warmth) ** 2 +
    (profile1.sweetness - profile2.sweetness) ** 2 +
    (profile1.spiciness - profile2.spiciness) ** 2 +
    (profile1.earthiness - profile2.earthiness) ** 2;
  return Math.sqrt(sumOfSquares);
}

// Calculer le score de similarité (0-100%)
function calculateSimilarityScore(distance: number): number {
  const maxDistance = Math.sqrt(6 * 100 ** 2);
  const similarity = 100 - (distance / maxDistance) * 100;
  return Math.round(Math.max(0, Math.min(100, similarity)));
}

// SQL agrégé : récupérer le profil radar moyen de toutes les recettes en 1 requête
const ALL_RECETTES_RADAR_SQL = `
  SELECT
    r.id,
    r.name,
    r.category,
    r.description,
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
  GROUP BY r.id, r.name, r.category, r.description
  ORDER BY r.id
`;

type DbWithClient = { $client: { promise: () => { query: (q: string) => Promise<[Record<string, unknown>[], unknown]> } } };

// Récupérer tous les profils radar en 1 requête + cache TTL 5 min
async function getAllRecettesRadarProfiles(db: DbWithClient): Promise<RecetteWithRadar[]> {
  return withCache<RecetteWithRadar[]>(
    RADAR_PROFILES_CACHE_KEY,
    async () => {
      const [rows] = await db.$client.promise().query(ALL_RECETTES_RADAR_SQL);
      return rows.map((r: Record<string, unknown>) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
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

// Recommander des recettes similaires — optimisé : 1 requête SQL au lieu de N+1
export async function getSimilarRecettes(
  recetteId: number,
  limit: number = 5
): Promise<Array<{
  recette: RecetteWithRadar;
  similarityScore: number;
  distance: number;
}>> {
  const db = await getDb();
  if (!db) return [];

  // 1 seule requête pour tous les profils radar
  const allProfiles = await getAllRecettesRadarProfiles(db);

  // Trouver le profil cible
  const targetProfile = allProfiles.find(r => r.id === recetteId);
  if (!targetProfile) return [];

  const targetVec = {
    intensity: targetProfile.avgIntensity,
    freshness: targetProfile.avgFreshness,
    warmth: targetProfile.avgWarmth,
    sweetness: targetProfile.avgSweetness,
    spiciness: targetProfile.avgSpiciness,
    earthiness: targetProfile.avgEarthiness,
  };

  // Calculer la similarité pour chaque autre recette (en mémoire, pas de requête SQL)
  const similarities = allProfiles
    .filter(r => r.id !== recetteId)
    .map((recette) => {
      const profile = {
        intensity: recette.avgIntensity,
        freshness: recette.avgFreshness,
        warmth: recette.avgWarmth,
        sweetness: recette.avgSweetness,
        spiciness: recette.avgSpiciness,
        earthiness: recette.avgEarthiness,
      };
      const distance = calculateRadarDistance(targetVec, profile);
      const similarityScore = calculateSimilarityScore(distance);
      return { recette, similarityScore, distance };
    });

  similarities.sort((a, b) => b.similarityScore - a.similarityScore);
  return similarities.slice(0, limit);
}

// Recommander des molécules similaires — déjà efficace (pas de N+1, calcul en mémoire)
export async function getSimilarMolecules(
  moleculeId: number,
  limit: number = 5
): Promise<Array<{
  molecule: MoleculeWithRadar;
  similarityScore: number;
  distance: number;
}>> {
  const db = await getDb();
  if (!db) return [];

  // 1 seule requête pour toutes les molécules + cache TTL 5 min
  const allMolecules = await withCache<MoleculeWithRadar[]>(
    MOLECULES_RADAR_CACHE_KEY,
    async () => {
      const [rows] = await db.$client.promise().query(`
        SELECT id, name, family, olfactiveProfile,
          COALESCE(radar_intensity, 50) AS radarIntensity,
          COALESCE(radar_freshness, 50) AS radarFreshness,
          COALESCE(radar_warmth, 50) AS radarWarmth,
          COALESCE(radar_sweetness, 50) AS radarSweetness,
          COALESCE(radar_spiciness, 50) AS radarSpiciness,
          COALESCE(radar_earthiness, 50) AS radarEarthiness
        FROM molecules
        ORDER BY id
      `);
      return rows.map((m: Record<string, unknown>) => ({
    id: m.id,
    name: m.name,
    family: m.family,
    olfactiveProfile: m.olfactiveProfile,
    radarIntensity: Number(m.radarIntensity) || 50,
    radarFreshness: Number(m.radarFreshness) || 50,
    radarWarmth: Number(m.radarWarmth) || 50,
    radarSweetness: Number(m.radarSweetness) || 50,
    radarSpiciness: Number(m.radarSpiciness) || 50,
      radarEarthiness: Number(m.radarEarthiness) || 50,
      }));
    },
    CACHE_TTL.MEDIUM
  );

  const target = allMolecules.find(m => m.id === moleculeId);
  if (!target) return [];

  const targetProfile = {
    intensity: target.radarIntensity,
    freshness: target.radarFreshness,
    warmth: target.radarWarmth,
    sweetness: target.radarSweetness,
    spiciness: target.radarSpiciness,
    earthiness: target.radarEarthiness,
  };

  const similarities = allMolecules
    .filter(m => m.id !== moleculeId)
    .map((molecule) => {
      const profile = {
        intensity: molecule.radarIntensity,
        freshness: molecule.radarFreshness,
        warmth: molecule.radarWarmth,
        sweetness: molecule.radarSweetness,
        spiciness: molecule.radarSpiciness,
        earthiness: molecule.radarEarthiness,
      };
      const distance = calculateRadarDistance(targetProfile, profile);
      const similarityScore = calculateSimilarityScore(distance);
      return { molecule, similarityScore, distance };
    });

  similarities.sort((a, b) => b.similarityScore - a.similarityScore);
  return similarities.slice(0, limit);
}

// Recommander des recettes basées sur les favoris — optimisé : 2 requêtes SQL au lieu de N+1
export async function getRecommendedRecettesFromFavorites(
  favoriteMoleculeIds: number[],
  limit: number = 10
): Promise<Array<{
  recette: RecetteWithRadar;
  matchScore: number;
  matchingMolecules: number;
}>> {
  const db = await getDb();
  if (!db || favoriteMoleculeIds.length === 0) return [];

  // Requête 1 : tous les profils radar en 1 requête
  const allProfiles = await getAllRecettesRadarProfiles(db);

  // Requête 2 : toutes les liaisons recette-molécule en 1 requête + cache TTL 5 min
  const linkRows = await withCache<Array<{recetteId: number; moleculeId: number}>>(
    RECETTE_MOLECULE_LINKS_CACHE_KEY,
    async () => {
      const [rows] = await db.$client.promise().query(`
        SELECT recette_id AS recetteId, molecule_id AS moleculeId
        FROM molecules_recettes
        ORDER BY recette_id
      `);
      return rows as Array<{recetteId: number; moleculeId: number}>;
    },
    CACHE_TTL.MEDIUM
  );

  // Construire un index recetteId → Set<moleculeId>
  const recetteMoleculeIndex = new Map<number, Set<number>>();
  for (const row of linkRows) {
    const rid = row.recetteId;
    if (!recetteMoleculeIndex.has(rid)) recetteMoleculeIndex.set(rid, new Set());
    recetteMoleculeIndex.get(rid)!.add(row.moleculeId);
  }

  const favoriteSet = new Set(favoriteMoleculeIds);

  // Calculer le score de correspondance en mémoire
  const recommendations = allProfiles
    .map((recette) => {
      const molSet = recetteMoleculeIndex.get(recette.id) || new Set();
      const totalMols = molSet.size;
      let matchingMolecules = 0;
      for (const mid of favoriteSet) {
        if (molSet.has(mid)) matchingMolecules++;
      }
      const matchScore = totalMols > 0 ? Math.round((matchingMolecules / totalMols) * 100) : 0;
      return { recette, matchScore, matchingMolecules };
    })
    .filter(r => r.matchingMolecules > 0);

  recommendations.sort((a, b) => b.matchScore - a.matchScore);
  return recommendations.slice(0, limit);
}
