import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { FlaskConical, FileDown, GitCompare, Star, GitBranch, Heart, Sparkles } from "lucide-react";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

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
  };
  onCompare?: (id: number) => void;
  onExport?: (id: number) => void;
  onFavorite?: (id: number) => void;
  isSelected?: boolean;
  onSelect?: (id: number, checked: boolean) => void;
  showCheckbox?: boolean;
  isSelectedForComparison?: boolean;
  isFavorite?: boolean;
}

// Mini radar hexagonal (compact, 40px)
function MiniRadar({ values }: { values: { i: number; f: number; w: number; s: number; sp: number; e: number } }) {
  const size = 40;
  const center = size / 2;
  const radius = size * 0.35;
  
  const angles = [0, 60, 120, 180, 240, 300].map(a => (a - 90) * Math.PI / 180);
  const vals = [values.i, values.f, values.w, values.s, values.sp, values.e];
  
  const points = angles.map((angle, i) => {
    const r = (vals[i] / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');
  
  const framePoints = angles.map((angle) => {
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');
  
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <polygon points={framePoints} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30" />
      <polygon points={points} fill="oklch(0.7 0.15 200 / 0.3)" stroke="oklch(0.7 0.15 200)" strokeWidth="1" />
    </svg>
  );
}

/**
 * Carte recette compacte et optimisée
 * 
 * Affichage : 4-5 infos max, hiérarchie claire, actions visibles
 * - Titre (bold, 16px)
 * - Catégorie + gamme (badges)
 * - Intensité (barre de progression)
 * - Nombre de molécules
 * - Actions : Comparer, Export, Favoris
 */
export function RecetteCard({ recette, onCompare, onExport, onFavorite, isSelected, onSelect, showCheckbox, isSelectedForComparison, isFavorite }: RecetteCardProps) {
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

  return (
    <div ref={swipeRef} className="relative">
      {/* Swipe indicators (visible during swipe) */}
      {swipeState.isSwiping && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-4">
          {swipeState.direction === 'right' && (
            <div className="bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg">
              <GitCompare className="h-6 w-6" />
            </div>
          )}
          {swipeState.direction === 'left' && (
            <div className="ml-auto bg-red-500/90 text-white rounded-full p-3 shadow-lg">
              <Heart className="h-6 w-6" />
            </div>
          )}
        </div>
      )}
      
      <Card className={`h-full transition-all hover:shadow-md hover:scale-[1.01] relative ${isSelected ? 'ring-2 ring-primary' : ''} ${isSelectedForComparison ? 'ring-2 ring-primary shadow-lg' : ''} ${swipeState.isSwiping ? 'shadow-xl' : ''}`}>
      {/* Checkbox de sélection (top-right) */}
      {showCheckbox && onSelect && (
        <div className="absolute top-3 right-3 z-10">
          <Checkbox
            checked={isSelectedForComparison}
            onCheckedChange={(checked) => onSelect(recette.id, checked as boolean)}
            className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/recette/${recette.id}`}>
              <CardTitle className="text-base font-bold hover:text-primary transition-colors cursor-pointer line-clamp-2">
                {recette.name}
              </CardTitle>
            </Link>
          </div>
          {hasRadar && (
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

      <CardContent className="space-y-3">
        {/* Badges : Gamme + Catégorie + Variation + Nouveau */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {gamme && <GammeBadge gamme={gamme} size="sm" />}
          <Badge variant="outline" className="text-xs uppercase tracking-wide">{recette.category}</Badge>
          {recette.parentRecetteId && (
            <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs">
              <GitBranch className="h-3 w-3 mr-1" />
              Variation
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs border-0 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Nouveau
            </Badge>
          )}
        </div>

        {/* Intensité (barre de progression) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Intensité</span>
            <span className="font-bold">{recette.intensity || 5}/10</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${(recette.intensity || 5) * 10}%` }}
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

        {/* Actions (boutons compacts) */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-border">
          {onCompare && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 flex-1"
              onClick={(e) => {
                e.preventDefault();
                onCompare(recette.id);
              }}
            >
              <GitCompare className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Comparer</span>
            </Button>
          )}
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
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
              className={`h-8 px-2 transition-colors ${
                isFavorite ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
              }`}
              onClick={(e) => {
                e.preventDefault();
                onFavorite(recette.id);
              }}
            >
              <Heart className={`h-3.5 w-3.5 transition-all ${
                isFavorite ? 'fill-current scale-110' : ''
              }`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
