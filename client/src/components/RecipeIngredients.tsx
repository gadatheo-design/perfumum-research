// @ts-nocheck
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Leaf, Cigarette, FlaskConical, Sparkles, Beaker, ExternalLink } from "lucide-react";

interface RecipeIngredientsProps {
  recipeId: number;
}

export function RecipeIngredients({ recipeId }: RecipeIngredientsProps) {
  const { data: ingredients, isLoading } = trpc.recipes.getIngredients.useQuery({ recipeId });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cannabis": return <Leaf className="h-4 w-4 text-green-500" />;
      case "tabac": return <Cigarette className="h-4 w-4 text-amber-500" />;
      case "molecule": return <Beaker className="h-4 w-4 text-purple-500" />;
      case "extract": return <FlaskConical className="h-4 w-4 text-pink-500" />;
      default: return <Sparkles className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cannabis": return "bg-green-500/10 border-green-500/30 text-green-400";
      case "tabac": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "molecule": return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      case "extract": return "bg-pink-500/10 border-pink-500/30 text-pink-400";
      default: return "bg-muted border-border text-muted-foreground";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "base": return "Base";
      case "modificateur": return "Modificateur";
      case "infusion": return "Infusion";
      case "co-maturation": return "Co-maturation";
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "base": return "bg-blue-500/20 text-blue-400";
      case "modificateur": return "bg-violet-500/20 text-violet-400";
      case "infusion": return "bg-cyan-500/20 text-cyan-400";
      case "co-maturation": return "bg-orange-500/20 text-orange-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ingredients || ingredients.length === 0) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Composition Détaillée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Aucun ingrédient détaillé disponible pour cette recette.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculer le total des pourcentages
  const totalPercentage = ingredients.reduce((sum, ing) => sum + (ing.percentage || 0), 0);

  // Grouper par type
  const groupedByType = ingredients.reduce((acc, ing) => {
    const type = ing.ingredient_type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(ing);
    return acc;
  }, {} as Record<string, typeof ingredients>);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Composition Détaillée
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {ingredients.length} ingrédients • {totalPercentage.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de visualisation des proportions */}
        <div className="space-y-2">
          <div className="h-4 rounded-full overflow-hidden flex bg-muted/50">
            {ingredients.map((ing, idx) => {
              const width = (ing.percentage / totalPercentage) * 100;
              const colors: Record<string, string> = {
                cannabis: "bg-green-500",
                tabac: "bg-amber-500",
                molecule: "bg-purple-500",
                extract: "bg-pink-500",
                other: "bg-gray-500"
              };
              return (
                <div
                  key={idx}
                  className={`${colors[ing.ingredient_type] || colors.other} transition-all duration-300`}
                  style={{ width: `${width}%` }}
                  title={`${ing.ingredient_name}: ${ing.percentage}%`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(groupedByType).map(([type, items]) => {
              const typeTotal = items.reduce((sum, i) => sum + (i.percentage || 0), 0);
              const colors: Record<string, string> = {
                cannabis: "text-green-400",
                tabac: "text-amber-400",
                molecule: "text-purple-400",
                extract: "text-pink-400",
                other: "text-gray-400"
              };
              return (
                <span key={type} className={`flex items-center gap-1 ${colors[type] || colors.other}`}>
                  {getTypeIcon(type)}
                  <span className="capitalize">{type}</span>: {typeTotal.toFixed(1)}%
                </span>
              );
            })}
          </div>
        </div>

        {/* Liste détaillée des ingrédients */}
        <div className="space-y-3">
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className={`p-4 rounded-lg border ${getTypeColor(ing.ingredient_type)} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getTypeIcon(ing.ingredient_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">
                        {ing.ingredient_name}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getRoleColor(ing.role)}`}>
                        {getRoleLabel(ing.role)}
                      </Badge>
                    </div>
                    {ing.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {ing.notes}
                      </p>
                    )}
                    {/* Liens croisés */}
                    <div className="flex gap-2 mt-2">
                      {ing.molecule_id && (
                        <Link href={`/molecules/${ing.molecule_id}`}>
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                            <Beaker className="h-3 w-3 mr-1" />
                            Voir molécule
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Badge>
                        </Link>
                      )}
                      {ing.plant_id && (
                        <Link href={`/plantes/${ing.plant_id}`}>
                          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                            <Leaf className="h-3 w-3 mr-1" />
                            Voir plante
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Badge>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-bold text-foreground">
                    {ing.percentage?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
