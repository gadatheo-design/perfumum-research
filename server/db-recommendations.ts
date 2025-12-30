import { getDb } from './db';
import { recettes, molecules, moleculesRecettes } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

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
  profile1: {
    intensity: number;
    freshness: number;
    warmth: number;
    sweetness: number;
    spiciness: number;
    earthiness: number;
  },
  profile2: {
    intensity: number;
    freshness: number;
    warmth: number;
    sweetness: number;
    spiciness: number;
    earthiness: number;
  }
): number {
  const diff = {
    intensity: profile1.intensity - profile2.intensity,
    freshness: profile1.freshness - profile2.freshness,
    warmth: profile1.warmth - profile2.warmth,
    sweetness: profile1.sweetness - profile2.sweetness,
    spiciness: profile1.spiciness - profile2.spiciness,
    earthiness: profile1.earthiness - profile2.earthiness,
  };

  const sumOfSquares =
    diff.intensity ** 2 +
    diff.freshness ** 2 +
    diff.warmth ** 2 +
    diff.sweetness ** 2 +
    diff.spiciness ** 2 +
    diff.earthiness ** 2;

  return Math.sqrt(sumOfSquares);
}

// Calculer le score de similarité (0-100%)
function calculateSimilarityScore(distance: number): number {
  // Distance maximale possible = sqrt(6 * 100^2) = ~244.95
  const maxDistance = Math.sqrt(6 * 100 ** 2);
  const similarity = 100 - (distance / maxDistance) * 100;
  return Math.round(Math.max(0, Math.min(100, similarity)));
}

// Récupérer le profil radar d'une recette
async function getRecetteRadarProfile(recetteId: number): Promise<{
  intensity: number;
  freshness: number;
  warmth: number;
  sweetness: number;
  spiciness: number;
  earthiness: number;
} | null> {
  const db = await getDb();
  if (!db) return null;

  const mols = await db
    .select({
      proportion: moleculesRecettes.proportion,
      radarIntensity: molecules.radarIntensity,
      radarFreshness: molecules.radarFreshness,
      radarWarmth: molecules.radarWarmth,
      radarSweetness: molecules.radarSweetness,
      radarSpiciness: molecules.radarSpiciness,
      radarEarthiness: molecules.radarEarthiness,
    })
    .from(moleculesRecettes)
    .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
    .where(eq(moleculesRecettes.recetteId, recetteId));

  if (mols.length === 0) return null;

  let totalWeight = 0;
  let sumIntensity = 0;
  let sumFreshness = 0;
  let sumWarmth = 0;
  let sumSweetness = 0;
  let sumSpiciness = 0;
  let sumEarthiness = 0;

  for (const mol of mols) {
    const weight = parseFloat(mol.proportion || '1');
    totalWeight += weight;
    sumIntensity += (mol.radarIntensity || 50) * weight;
    sumFreshness += (mol.radarFreshness || 50) * weight;
    sumWarmth += (mol.radarWarmth || 50) * weight;
    sumSweetness += (mol.radarSweetness || 50) * weight;
    sumSpiciness += (mol.radarSpiciness || 50) * weight;
    sumEarthiness += (mol.radarEarthiness || 50) * weight;
  }

  return {
    intensity: totalWeight > 0 ? Math.round(sumIntensity / totalWeight) : 50,
    freshness: totalWeight > 0 ? Math.round(sumFreshness / totalWeight) : 50,
    warmth: totalWeight > 0 ? Math.round(sumWarmth / totalWeight) : 50,
    sweetness: totalWeight > 0 ? Math.round(sumSweetness / totalWeight) : 50,
    spiciness: totalWeight > 0 ? Math.round(sumSpiciness / totalWeight) : 50,
    earthiness: totalWeight > 0 ? Math.round(sumEarthiness / totalWeight) : 50,
  };
}

// Recommander des recettes similaires
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

  // Récupérer le profil radar de la recette cible
  const targetProfile = await getRecetteRadarProfile(recetteId);
  if (!targetProfile) return [];

  // Récupérer toutes les autres recettes
  const allRecettes = await db.select().from(recettes).where(eq(recettes.id, recetteId));
  if (allRecettes.length === 0) return [];

  const otherRecettes = await db.select().from(recettes);

  // Calculer la similarité pour chaque recette
  const similarities = await Promise.all(
    otherRecettes
      .filter(r => r.id !== recetteId)
      .map(async (recette) => {
        const profile = await getRecetteRadarProfile(recette.id);
        if (!profile) return null;

        const distance = calculateRadarDistance(targetProfile, profile);
        const similarityScore = calculateSimilarityScore(distance);

        // Compter les molécules
        const mols = await db
          .select()
          .from(moleculesRecettes)
          .where(eq(moleculesRecettes.recetteId, recette.id));

        return {
          recette: {
            id: recette.id,
            name: recette.name,
            category: recette.category,
            description: recette.description,
            avgIntensity: profile.intensity,
            avgFreshness: profile.freshness,
            avgWarmth: profile.warmth,
            avgSweetness: profile.sweetness,
            avgSpiciness: profile.spiciness,
            avgEarthiness: profile.earthiness,
            moleculeCount: mols.length,
          },
          similarityScore,
          distance,
        };
      })
  );

  // Filtrer les nulls et trier par score de similarité
  const validSimilarities = similarities.filter((s): s is NonNullable<typeof s> => s !== null);
  validSimilarities.sort((a, b) => b.similarityScore - a.similarityScore);

  return validSimilarities.slice(0, limit);
}

// Recommander des molécules similaires
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

  // Récupérer la molécule cible
  const targetMolecule = await db
    .select()
    .from(molecules)
    .where(eq(molecules.id, moleculeId))
    .limit(1);

  if (targetMolecule.length === 0) return [];

  const target = targetMolecule[0];
  const targetProfile = {
    intensity: target.radarIntensity || 50,
    freshness: target.radarFreshness || 50,
    warmth: target.radarWarmth || 50,
    sweetness: target.radarSweetness || 50,
    spiciness: target.radarSpiciness || 50,
    earthiness: target.radarEarthiness || 50,
  };

  // Récupérer toutes les autres molécules
  const allMolecules = await db.select().from(molecules);

  // Calculer la similarité pour chaque molécule
  const similarities = allMolecules
    .filter(m => m.id !== moleculeId)
    .map((molecule) => {
      const profile = {
        intensity: molecule.radarIntensity || 50,
        freshness: molecule.radarFreshness || 50,
        warmth: molecule.radarWarmth || 50,
        sweetness: molecule.radarSweetness || 50,
        spiciness: molecule.radarSpiciness || 50,
        earthiness: molecule.radarEarthiness || 50,
      };

      const distance = calculateRadarDistance(targetProfile, profile);
      const similarityScore = calculateSimilarityScore(distance);

      return {
        molecule: {
          id: molecule.id,
          name: molecule.name,
          family: molecule.family,
          olfactiveProfile: molecule.olfactiveProfile,
          radarIntensity: profile.intensity,
          radarFreshness: profile.freshness,
          radarWarmth: profile.warmth,
          radarSweetness: profile.sweetness,
          radarSpiciness: profile.spiciness,
          radarEarthiness: profile.earthiness,
        },
        similarityScore,
        distance,
      };
    });

  // Trier par score de similarité
  similarities.sort((a, b) => b.similarityScore - a.similarityScore);

  return similarities.slice(0, limit);
}

// Recommander des recettes basées sur les favoris de l'utilisateur
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

  // Récupérer toutes les recettes
  const allRecettes = await db.select().from(recettes);

  // Pour chaque recette, calculer le score de correspondance
  const recommendations = await Promise.all(
    allRecettes.map(async (recette) => {
      const mols = await db
        .select({
          moleculeId: moleculesRecettes.moleculeId,
          proportion: moleculesRecettes.proportion,
          radarIntensity: molecules.radarIntensity,
          radarFreshness: molecules.radarFreshness,
          radarWarmth: molecules.radarWarmth,
          radarSweetness: molecules.radarSweetness,
          radarSpiciness: molecules.radarSpiciness,
          radarEarthiness: molecules.radarEarthiness,
        })
        .from(moleculesRecettes)
        .innerJoin(molecules, eq(moleculesRecettes.moleculeId, molecules.id))
        .where(eq(moleculesRecettes.recetteId, recette.id));

      // Compter les molécules favorites présentes
      const matchingMolecules = mols.filter(m => favoriteMoleculeIds.includes(m.moleculeId)).length;

      // Calculer le score de correspondance (0-100)
      const matchScore = mols.length > 0 ? Math.round((matchingMolecules / mols.length) * 100) : 0;

      // Calculer le profil radar moyen
      let totalWeight = 0;
      let sumIntensity = 0;
      let sumFreshness = 0;
      let sumWarmth = 0;
      let sumSweetness = 0;
      let sumSpiciness = 0;
      let sumEarthiness = 0;

      for (const mol of mols) {
        const weight = parseFloat(mol.proportion || '1');
        totalWeight += weight;
        sumIntensity += (mol.radarIntensity || 50) * weight;
        sumFreshness += (mol.radarFreshness || 50) * weight;
        sumWarmth += (mol.radarWarmth || 50) * weight;
        sumSweetness += (mol.radarSweetness || 50) * weight;
        sumSpiciness += (mol.radarSpiciness || 50) * weight;
        sumEarthiness += (mol.radarEarthiness || 50) * weight;
      }

      return {
        recette: {
          id: recette.id,
          name: recette.name,
          category: recette.category,
          description: recette.description,
          avgIntensity: totalWeight > 0 ? Math.round(sumIntensity / totalWeight) : 50,
          avgFreshness: totalWeight > 0 ? Math.round(sumFreshness / totalWeight) : 50,
          avgWarmth: totalWeight > 0 ? Math.round(sumWarmth / totalWeight) : 50,
          avgSweetness: totalWeight > 0 ? Math.round(sumSweetness / totalWeight) : 50,
          avgSpiciness: totalWeight > 0 ? Math.round(sumSpiciness / totalWeight) : 50,
          avgEarthiness: totalWeight > 0 ? Math.round(sumEarthiness / totalWeight) : 50,
          moleculeCount: mols.length,
        },
        matchScore,
        matchingMolecules,
      };
    })
  );

  // Filtrer les recettes avec au moins une molécule favorite
  const validRecommendations = recommendations.filter(r => r.matchingMolecules > 0);

  // Trier par score de correspondance
  validRecommendations.sort((a, b) => b.matchScore - a.matchScore);

  return validRecommendations.slice(0, limit);
}
