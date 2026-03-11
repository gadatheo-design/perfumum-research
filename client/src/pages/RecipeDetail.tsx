import { safeJsonParse } from "@/lib/utils";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cigarette, Clock, Leaf, FlaskConical, Sparkles, PlusCircle } from "lucide-react";
import { RecipeIngredients } from "@/components/RecipeIngredients";
import { RecipeContributionModal } from "@/components/RecipeContributionModal";
import { useState } from "react";

export default function RecipeDetail() {
  const [contributionOpen, setContributionOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const { data: recipe, isLoading } = trpc.recipes.getById.useQuery({ slug });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "débutant": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermédiaire": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "avancé": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "expert": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Recette non trouvée</p>
        <Link href="/recettes">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux recettes
          </Button>
        </Link>
      </div>
    );
  }

  const terpeneProfile = safeJsonParse(recipe.terpene_profile, null);

  return (
    <div className="container py-8">
      <Link href="/recettes">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux recettes
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Cigarette className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold text-foreground">{recipe.name}</h1>
          {recipe.difficulty_level && (
            <Badge variant="outline" className={getDifficultyColor(recipe.difficulty_level)}>
              {recipe.difficulty_level}
            </Badge>
          )}
        </div>
        
        {recipe.collection && (
          <Badge variant="secondary" className="mb-4">
            {recipe.collection}
          </Badge>
        )}
        
        {recipe.concept && (
          <p className="text-lg text-muted-foreground">{recipe.concept}</p>
        )}
        <div className="mt-4">
          <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" onClick={() => setContributionOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Contribuer à cette recette
          </Button>
          <RecipeContributionModal
            open={contributionOpen}
            onClose={() => setContributionOpen(false)}
            recipeId={recipe.id}
            recipeName={recipe.name}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {recipe.cannabis_component && (
          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                <CardTitle className="text-green-400">Cannabis ({recipe.cannabis_percentage}%)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recipe.cannabis_component}</p>
            </CardContent>
          </Card>
        )}
        
        {recipe.tobacco_component && (
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cigarette className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-amber-400">Tabac ({recipe.tobacco_percentage}%)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recipe.tobacco_component}</p>
            </CardContent>
          </Card>
        )}
        
        {recipe.perfume_component && (
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-purple-400">Parfum ({recipe.perfume_percentage}%)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recipe.perfume_component}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipe.maturation_days && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Maturation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{recipe.maturation_days} jours</p>
            </CardContent>
          </Card>
        )}
        
        {recipe.wrapper_leaf && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Feuille d'Enveloppe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recipe.wrapper_leaf}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {terpeneProfile && (
        <Card className="bg-card/50 border-border/50 mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle>Profil Terpénique</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(terpeneProfile).map(([terpene, value]: [string, any]) => (
                <Badge key={terpene} variant="secondary">
                  {terpene}: {typeof value === 'number' ? `${value}%` : value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Composition détaillée des ingrédients */}
      <div className="mt-6">
        <RecipeIngredients recipeId={recipe.id} />
      </div>
    </div>
  );
}
