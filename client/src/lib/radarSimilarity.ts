/**
 * PERFUMUM — Radar Similarity Utilities
 * 
 * Calcule la similarité entre profils radar pour suggérer des recettes similaires
 */

export interface RadarProfile {
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
}

/**
 * Calcule la distance euclidienne entre deux profils radar
 * Distance normalisée entre 0 (identique) et 100 (opposé)
 */
export function calculateRadarDistance(
  profile1: RadarProfile,
  profile2: RadarProfile
): number {
  const dimensions = [
    'intensity',
    'freshness',
    'warmth',
    'sweetness',
    'spiciness',
    'earthiness',
  ] as const;

  let sumSquares = 0;
  for (const dim of dimensions) {
    const diff = profile1[dim] - profile2[dim];
    sumSquares += diff * diff;
  }

  // Distance euclidienne normalisée (0-100)
  // Max distance possible = sqrt(6 * 100^2) = ~244.95
  const distance = Math.sqrt(sumSquares);
  const maxDistance = Math.sqrt(6 * 100 * 100);
  
  return (distance / maxDistance) * 100;
}

/**
 * Calcule le score de similarité (inverse de la distance)
 * Score entre 0 (opposé) et 100 (identique)
 */
export function calculateSimilarityScore(
  profile1: RadarProfile,
  profile2: RadarProfile
): number {
  const distance = calculateRadarDistance(profile1, profile2);
  return 100 - distance;
}

/**
 * Trouve les N recettes les plus similaires à un profil donné
 */
export function findSimilarRecipes<T extends { id: number }>(
  targetProfile: RadarProfile,
  recipes: (T & { radar: RadarProfile })[],
  limit: number = 5,
  excludeIds: number[] = []
): Array<T & { similarityScore: number }> {
  return recipes
    .filter((recipe) => !excludeIds.includes(recipe.id))
    .map((recipe) => ({
      ...recipe,
      similarityScore: calculateSimilarityScore(targetProfile, recipe.radar),
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

/**
 * Calcule le profil radar moyen d'un ensemble de recettes
 */
export function calculateAverageProfile(
  profiles: RadarProfile[]
): RadarProfile {
  if (profiles.length === 0) {
    return {
      intensity: 50,
      freshness: 50,
      warmth: 50,
      sweetness: 50,
      spiciness: 50,
      earthiness: 50,
    };
  }

  const sum = profiles.reduce(
    (acc, profile) => ({
      intensity: acc.intensity + profile.intensity,
      freshness: acc.freshness + profile.freshness,
      warmth: acc.warmth + profile.warmth,
      sweetness: acc.sweetness + profile.sweetness,
      spiciness: acc.spiciness + profile.spiciness,
      earthiness: acc.earthiness + profile.earthiness,
    }),
    {
      intensity: 0,
      freshness: 0,
      warmth: 0,
      sweetness: 0,
      spiciness: 0,
      earthiness: 0,
    }
  );

  const count = profiles.length;
  return {
    intensity: Math.round(sum.intensity / count),
    freshness: Math.round(sum.freshness / count),
    warmth: Math.round(sum.warmth / count),
    sweetness: Math.round(sum.sweetness / count),
    spiciness: Math.round(sum.spiciness / count),
    earthiness: Math.round(sum.earthiness / count),
  };
}

/**
 * Détermine si deux profils sont "très similaires" (score > 85)
 */
export function areProfilesSimilar(
  profile1: RadarProfile,
  profile2: RadarProfile,
  threshold: number = 85
): boolean {
  const score = calculateSimilarityScore(profile1, profile2);
  return score >= threshold;
}

/**
 * Catégorise le niveau de similarité
 */
export function getSimilarityLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { label: 'Très similaire', color: 'text-green-600' };
  } else if (score >= 75) {
    return { label: 'Similaire', color: 'text-blue-600' };
  } else if (score >= 60) {
    return { label: 'Moyennement similaire', color: 'text-yellow-600' };
  } else if (score >= 40) {
    return { label: 'Peu similaire', color: 'text-orange-600' };
  } else {
    return { label: 'Très différent', color: 'text-red-600' };
  }
}
