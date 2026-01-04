import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Check, Beaker, Flame, FlaskConical, Star, StarOff } from "lucide-react";
import { GammeBadge } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RecetteListItemProps {
  recette: {
    id: number;
    name: string | null;
    category: string | null;
    formula: string | null;
    ingredients: string | null;
    intensity: number | null;
    moleculeCount: number;
    avgIntensity: number | null;
    avgFreshness: number | null;
    avgWarmth: number | null;
    avgSweetness: number | null;
    avgSpiciness: number | null;
    avgEarthiness: number | null;
  };
  isSelected: boolean;
  onToggleSelection: (id: number, checked: boolean) => void;
  isFavorite: boolean;
  onFavorite: (id: number) => void;
}

export function RecetteListItem({ 
  recette, 
  isSelected, 
  onToggleSelection,
  isFavorite,
  onFavorite
}: RecetteListItemProps) {
  const gamme = getGammeFromCategory(recette.category);
  
  // Calculer le score radar moyen
  const radarValues = [
    recette.avgIntensity,
    recette.avgFreshness,
    recette.avgWarmth,
    recette.avgSweetness,
    recette.avgSpiciness,
    recette.avgEarthiness,
  ].filter((v): v is number => v !== null);
  
  const avgRadar = radarValues.length > 0 
    ? Math.round(radarValues.reduce((a, b) => a + b, 0) / radarValues.length)
    : null;
  
  return (
    <Link 
      href={`/recette/${recette.id}`}
      className="block"
    >
      <div className={cn(
        "flex items-center gap-4 p-4 bg-card border rounded-lg hover:bg-muted/50 transition-colors",
        isSelected && "ring-2 ring-primary"
      )}>
        {/* Selection checkbox */}
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection(recette.id, !isSelected);
          }}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0",
            isSelected
              ? "bg-primary border-primary"
              : "border-muted-foreground/40 hover:border-primary"
          )}
        >
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
        
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
              {recette.name || "Sans nom"}
            </h3>
            {gamme && <GammeBadge gamme={gamme} size="sm" showIcon={false} />}
            {recette.category && (
              <Badge variant="outline" className="shrink-0 text-xs">
                {recette.category}
              </Badge>
            )}
          </div>
          {recette.formula && (
            <p className="text-sm font-mono text-muted-foreground truncate">
              {recette.formula}
            </p>
          )}
        </div>
        
        {/* Properties - hidden on mobile, visible on larger screens */}
        <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
          {recette.moleculeCount > 0 && (
            <div className="flex items-center gap-1.5 w-24">
              <Beaker className="h-3.5 w-3.5" />
              <span>{recette.moleculeCount} molécule{recette.moleculeCount > 1 ? "s" : ""}</span>
            </div>
          )}
          {recette.intensity !== null && (
            <div className="flex items-center gap-1.5 w-20">
              <Flame className="h-3.5 w-3.5" />
              <span>Int. {recette.intensity}/10</span>
            </div>
          )}
          {avgRadar !== null && (
            <div className="flex items-center gap-1.5 w-20">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Radar {avgRadar}</span>
            </div>
          )}
        </div>
        
        {/* Ingredients - truncated */}
        <div className="hidden lg:block w-48 shrink-0">
          {recette.ingredients && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {recette.ingredients}
            </p>
          )}
        </div>
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 shrink-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite(recette.id);
          }}
        >
          {isFavorite ? (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </Link>
  );
}
