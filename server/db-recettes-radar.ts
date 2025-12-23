import { getDb } from './db';
import { recettes, molecules, moleculesRecettes } from '../drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

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
  // Profil radar moyen calculé
  avgIntensity: number;
  avgFreshness: number;
  avgWarmth: number;
  avgSweetness: number;
  avgSpiciness: number;
  avgEarthiness: number;
  moleculeCount: number;
}

// Récupérer toutes les recettes avec leur profil radar moyen
export async function getAllRecettesWithRadar(): Promise<RecetteWithRadar[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Récupérer toutes les recettes
  const allRecettes = await db.select().from(recettes);
  
  // Pour chaque recette, calculer le profil radar moyen
  const result = await Promise.all(
    allRecettes.map(async (recette) => {
      // Récupérer les molécules associées avec leurs proportions
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
        .where(eq(moleculesRecettes.recetteId, recette.id));
      
      // Calculer les moyennes pondérées par proportion
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
      
      // Si pas de molécules, utiliser des valeurs par défaut
      const avgIntensity = totalWeight > 0 ? Math.round(sumIntensity / totalWeight) : 50;
      const avgFreshness = totalWeight > 0 ? Math.round(sumFreshness / totalWeight) : 50;
      const avgWarmth = totalWeight > 0 ? Math.round(sumWarmth / totalWeight) : 50;
      const avgSweetness = totalWeight > 0 ? Math.round(sumSweetness / totalWeight) : 50;
      const avgSpiciness = totalWeight > 0 ? Math.round(sumSpiciness / totalWeight) : 50;
      const avgEarthiness = totalWeight > 0 ? Math.round(sumEarthiness / totalWeight) : 50;
      
      return {
        id: recette.id,
        name: recette.name,
        category: recette.category,
        description: recette.description,
        ingredients: recette.ingredients,
        formula: recette.formula,
        intensity: recette.intensity,
        stability: recette.stability,
        parentRecetteId: recette.parentRecetteId,
        avgIntensity,
        avgFreshness,
        avgWarmth,
        avgSweetness,
        avgSpiciness,
        avgEarthiness,
        moleculeCount: mols.length,
      };
    })
  );
  
  return result;
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
