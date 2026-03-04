// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PrefetchLink } from "@/components/PrefetchLink";
import { FlaskConical, FileDown, GitCompare, GitBranch, Heart, Sparkles, ChevronRight, Droplets } from "lucide-react";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { cn } from "@/lib/utils";

// Types
interface RecetteCardProps {
  recette: {
    id: number;
    name: string;
    category: string | null;
    intensity?: number | null;
    stability?: string | null;
    moleculeCount?: number;
    parentRecetteId?: number | null;
    ingredients?: string | null;
    createdAt?: string | Date | null;
    avgIntensity?: number;
    avgFreshness?: number;
    avgWarmth?: number;
    avgSweetness?: number;
    avgSpiciness?: number;
    avgEarthiness?: number;
    description?: string | null;
  };
  onCompare?: (id: number) => void;
  onExport?: (id: number) => void;
  onFavorite?: (id: number) => void;
  isSelected?: boolean;
  onSelect?: (id: number, checked: boolean) => void;
  showCheckbox?: boolean;
  isSelectedForComparison?: boolean;
  isFavorite?: boolean;
  variant?: "default" | "compact" | "detailed";
}

// Mini radar hexagonal amélioré avec couleurs par axe
function MiniRadar({ values }: { values: { i: number; f: number; w: number; s: number; sp: number; e: number } }) {
  const size = 48;
  const center = size / 2;
  const radius = size * 0.38;
  
  const axes = [
    { key: 'i', label: 'Intensité', color: 'oklch(0.65 0.20 25)' },
    { key: 'f', label: 'Fraîcheur', color: 'oklch(0.70 0.15 200)' },
    { key: 'w', label: 'Chaleur', color: 'oklch(0.65 0.18 40)' },
    { key: 's', label: 'Douceur', color: 'oklch(0.75 0.15 330)' },
    { key: 'sp', label: 'Épicé', color: 'oklch(0.60 0.20 30)' },
    { key: 'e', label: 'Terreux', color: 'oklch(0.55 0.12 80)' },
  ];
  
  const angles = [0, 60, 120, 180, 240, 300].map(a => (a - 90) * Math.PI / 180);
  const vals = [values.i, values.f, values.w, values.s, values.sp, values.e];
  
  const points = angles.map((angle, i) => {
    const r = (vals[i] / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');
  
  const framePoints = angles.map((angle) => {
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');
  
  // Calculer le score global
  const avgScore = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  
  return (
    <div className="relative group/radar">
      <svg width={size} height={size} className="flex-shrink-0 transition-transform duration-300 group-hover/radar:scale-110">
        {/* Grille de fond */}
        <polygon 
          points={framePoints} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          className="text-muted-foreground/20" 
        />
        {/* Lignes de la grille intérieure */}
        {[0.33, 0.66].map((scale, i) => {
          const innerPoints = angles.map((angle) => {
            return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon 
              key={i}
              points={innerPoints} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.3" 
              className="text-muted-foreground/10" 
            />
          );
        })}
        {/* Zone de données avec gradient */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.20 280)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.70 0.15 200)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polygon 
          points={points} 
          fill="url(#radarGradient)" 
          stroke="oklch(0.65 0.20 280)" 
          strokeWidth="1.5" 
          className="transition-all duration-300"
        />
        {/* Points sur les axes */}
        {angles.map((angle, i) => {
          const r = (vals[i] / 100) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle 
              key={i}
              cx={x} 
              cy={y} 
              r="2" 
              fill="oklch(0.65 0.20 280)"
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      {/* Score au centre */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-foreground/70">{avgScore}</span>
      </div>
    </div>
  );
}

/**
 * Carte recette améliorée avec micro-interactions
 * 
 * Variantes :
 * - default : Affichage standard avec radar et actions
 * - compact : Version réduite pour les listes
 * - detailed : Version étendue avec description
 */
export function RecetteCard({ 
  recette, 
  onCompare, 
  onExport, 
  onFavorite, 
  isSelected, 
  onSelect, 
  showCheckbox, 
  isSelectedForComparison, 
  isFavorite,
  variant = "default"
}: RecetteCardProps) {
  const gamme = getGammeFromCategory(recette.category);
  const hasRadar = recette.moleculeCount && recette.moleculeCount > 0;
  
  // Vérifier si la recette est récente (créée dans les 30 derniers jours)
  const isNew = recette.createdAt ? (() => {
    const createdDate = new Date(recette.createdAt);
    const now = new Date();
    const diffInDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30;
  })() : false;

  // Swipe gestures for mobile
  const [swipeRef, swipeState] = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft: () => {
      if (onFavorite) {
        onFavorite(recette.id);
      }
    },
    onSwipeRight: () => {
      if (onCompare) {
        onCompare(recette.id);
      }
    },
    threshold: 60,
  });

  // Extraire une courte description des ingrédients si pas de description
  const shortDescription = recette.description || (recette.ingredients 
    ? recette.ingredients.split(',').slice(0, 3).join(', ') + '...'
    : null
  );

  return (
    <div ref={swipeRef} className="relative group">
      {/* Swipe indicators (visible during swipe) */}
      {swipeState.isSwiping && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-4">
          {swipeState.direction === 'right' && (
            <div className="bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg animate-scaleIn">
              <GitCompare className="h-6 w-6" />
            </div>
          )}
          {swipeState.direction === 'left' && (
            <div className="ml-auto bg-rose-500/90 text-white rounded-full p-3 shadow-lg animate-scaleIn">
              <Heart className="h-6 w-6" />
            </div>
          )}
        </div>
      )}
      
      <Card className={cn(
        "h-full transition-all duration-300 relative overflow-hidden",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        "border-border/50 hover:border-primary/30",
        isSelected && "ring-2 ring-primary",
        isSelectedForComparison && "ring-2 ring-primary shadow-lg shadow-primary/10",
        swipeState.isSwiping && "shadow-2xl scale-[1.02]",
        variant === "compact" && "p-0"
      )}>
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Top accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        {/* Checkbox de sélection (top-right) */}
        {showCheckbox && onSelect && (
          <div className="absolute top-3 right-3 z-10">
            <Checkbox
              checked={isSelectedForComparison}
              onCheckedChange={(checked) => onSelect(recette.id, checked as boolean)}
              className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
            />
          </div>
        )}
        
        <CardHeader className={cn("pb-3", variant === "compact" && "p-3 pb-2")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <PrefetchLink to={`/recette/${recette.id}`} prefetchType="recette" prefetchId={recette.id}>
                <CardTitle className={cn(
                  "font-bold hover:text-primary transition-colors cursor-pointer line-clamp-2 group-hover:text-primary/90",
                  variant === "compact" ? "text-sm" : "text-base"
                )}>
                  {recette.name}
                </CardTitle>
              </PrefetchLink>
            </div>
            {hasRadar && variant !== "compact" && (
              <MiniRadar values={{
                i: recette.avgIntensity || 50,
                f: recette.avgFreshness || 50,
                w: recette.avgWarmth || 50,
                s: recette.avgSweetness || 50,
                sp: recette.avgSpiciness || 50,
                e: recette.avgEarthiness || 50,
              }} />
            )}
          </div>
        </CardHeader>

        <CardContent className={cn("space-y-3", variant === "compact" && "p-3 pt-0 space-y-2")}>
          {/* Badges : Gamme + Catégorie + Variation + Nouveau */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {gamme && <GammeBadge gamme={gamme} size="sm" />}
            <Badge variant="outline" className="text-xs uppercase tracking-wide font-medium">
              {recette.category}
            </Badge>
            {recette.parentRecetteId && (
              <Badge variant="outline" className="border-amber-400/50 text-amber-600 dark:text-amber-400 text-xs bg-amber-50/50 dark:bg-amber-950/30">
                <GitBranch className="h-3 w-3 mr-1" />
                Variation
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Nouveau
              </Badge>
            )}
          </div>

          {/* Description courte (si variant detailed ou si disponible) */}
          {variant === "detailed" && shortDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>
          )}

          {/* Intensité (barre de progression améliorée) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Droplets className="h-3 w-3" />
                Intensité
              </span>
              <span className="font-bold text-foreground">
                {(() => {
                  const intensity = recette.intensity || 5;
                  const normalizedIntensity = intensity > 10 ? Math.round(intensity / 10) : intensity;
                  return `${normalizedIntensity}/10`;
                })()}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500 ease-out rounded-full" 
                style={{ 
                  width: `${(() => {
                    const intensity = recette.intensity || 5;
                    return intensity > 10 ? intensity : intensity * 10;
                  })()}%` 
                }}
              />
            </div>
          </div>

          {/* Nombre de molécules */}
          {hasRadar && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FlaskConical className="h-3.5 w-3.5" />
              <span className="font-medium">{recette.moleculeCount} molécules</span>
            </div>
          )}

          {/* Actions (boutons avec micro-interactions) */}
          <div className="flex items-center gap-1 pt-2 border-t border-border/50">
            {onCompare && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 flex-1 text-xs hover:bg-primary/10 hover:text-primary transition-all duration-200 group/btn"
                onClick={(e) => {
                  e.preventDefault();
                  onCompare(recette.id);
                }}
              >
                <GitCompare className="h-3.5 w-3.5 mr-1.5 group-hover/btn:rotate-12 transition-transform duration-200" />
                Comparer
              </Button>
            )}
            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 hover:bg-muted transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  onExport(recette.id);
                }}
              >
                <FileDown className="h-3.5 w-3.5" />
              </Button>
            )}
            {onFavorite && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 transition-all duration-200",
                  isFavorite 
                    ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30" 
                    : "hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  onFavorite(recette.id);
                }}
              >
                <Heart className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  isFavorite && "fill-current scale-110"
                )} />
              </Button>
            )}
            <PrefetchLink to={`/recette/${recette.id}`} prefetchType="recette" prefetchId={recette.id} className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-primary group/link"
              >
                <span className="hidden sm:inline mr-1">Voir</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform duration-200" />
              </Button>
            </PrefetchLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
