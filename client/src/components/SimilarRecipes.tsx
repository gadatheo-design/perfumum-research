import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, TrendingUp } from "lucide-react";
import { calculateSimilarityScore, getSimilarityLabel, type RadarProfile } from "@/lib/radarSimilarity";
import { useMemo } from "react";

interface Recipe {
  id: number;
  name: string;
  category: string | null;
  avgIntensity?: number;
  avgFreshness?: number;
  avgWarmth?: number;
  avgSweetness?: number;
  avgSpiciness?: number;
  avgEarthiness?: number;
}

interface SimilarRecipesProps {
  targetRecipe: Recipe;
  allRecipes: Recipe[];
  limit?: number;
}

export function SimilarRecipes({ targetRecipe, allRecipes, limit = 5 }: SimilarRecipesProps) {
  const similarRecipes = useMemo(() => {
    // Build target radar profile
    const targetProfile: RadarProfile = {
      intensity: targetRecipe.avgIntensity || 50,
      freshness: targetRecipe.avgFreshness || 50,
      warmth: targetRecipe.avgWarmth || 50,
      sweetness: targetRecipe.avgSweetness || 50,
      spiciness: targetRecipe.avgSpiciness || 50,
      earthiness: targetRecipe.avgEarthiness || 50,
    };

    // Calculate similarity scores for all recipes
    const withScores = allRecipes
      .filter((recipe) => recipe.id !== targetRecipe.id)
      .map((recipe) => {
        const recipeProfile: RadarProfile = {
          intensity: recipe.avgIntensity || 50,
          freshness: recipe.avgFreshness || 50,
          warmth: recipe.avgWarmth || 50,
          sweetness: recipe.avgSweetness || 50,
          spiciness: recipe.avgSpiciness || 50,
          earthiness: recipe.avgEarthiness || 50,
        };

        const score = calculateSimilarityScore(targetProfile, recipeProfile);
        const { label, color } = getSimilarityLabel(score);

        return {
          ...recipe,
          similarityScore: score,
          similarityLabel: label,
          similarityColor: color,
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return withScores;
  }, [targetRecipe, allRecipes, limit]);

  if (similarRecipes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Recettes similaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {similarRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/recette/${recipe.id}`}>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm hover:text-primary transition-colors truncate">
                    {recipe.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {recipe.category && (
                      <Badge variant="outline" className="text-xs">
                        {recipe.category}
                      </Badge>
                    )}
                    <span className={`text-xs font-medium ${recipe.similarityColor}`}>
                      {Math.round(recipe.similarityScore)}% similaire
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
