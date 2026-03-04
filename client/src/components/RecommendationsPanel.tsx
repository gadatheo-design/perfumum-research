// @ts-nocheck
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  FlaskConical, 
  Beaker, 
  ArrowRight, 
  TrendingUp,
  Lightbulb,
  Zap,
  Heart,
  Star,
  ChevronRight,
  RefreshCw,
  Info,
  Radar
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface RecommendedItem {
  id: number;
  name: string;
  score: number;
  type: "molecule" | "recette";
  reason?: string;
  family?: string;
  category?: string;
  radarProfile?: {
    intensity: number;
    freshness: number;
    warmth: number;
    sweetness: number;
    spiciness: number;
    earthiness: number;
  };
}

interface RecommendationsPanelProps {
  currentItemId?: number;
  currentItemType?: "molecule" | "recette";
  favoriteMoleculeIds?: number[];
  className?: string;
  variant?: "full" | "compact" | "sidebar";
}

// Composant de carte de recommandation
function RecommendationCard({ 
  item, 
  index,
  variant = "full"
}: { 
  item: RecommendedItem; 
  index: number;
  variant?: "full" | "compact" | "sidebar";
}) {
  const href = item.type === "molecule" 
    ? `/molecules/${item.id}` 
    : `/recettes/${item.id}`;

  const scoreColor = item.score >= 80 
    ? "text-green-600 bg-green-100 dark:bg-green-900/30" 
    : item.score >= 60 
      ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
      : "text-amber-600 bg-amber-100 dark:bg-amber-900/30";

  if (variant === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={href}>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", scoreColor)}>
              {item.score}%
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.family || item.category || item.reason}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={href}>
          <Card className="card-interactive hover:border-primary/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold", scoreColor)}>
                  {item.score}%
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.reason || item.family || item.category}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {item.type === "molecule" ? <FlaskConical className="h-3 w-3" /> : <Beaker className="h-3 w-3" />}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={href}>
        <Card className="card-interactive hover:border-primary/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              {/* Score indicator */}
              <div className={cn("w-20 flex flex-col items-center justify-center p-4", scoreColor)}>
                <span className="text-2xl font-bold">{item.score}%</span>
                <span className="text-xs">Match</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.reason || `Profil similaire détecté`}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {item.type === "molecule" ? (
                      <>
                        <FlaskConical className="h-3 w-3 mr-1" />
                        Molécule
                      </>
                    ) : (
                      <>
                        <Beaker className="h-3 w-3 mr-1" />
                        Recette
                      </>
                    )}
                  </Badge>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.family && (
                    <Badge variant="secondary" className="text-xs">
                      {item.family}
                    </Badge>
                  )}
                  {item.category && (
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                </div>

                {/* Mini radar preview */}
                {item.radarProfile && (
                  <div className="flex gap-1 mt-3">
                    {Object.entries(item.radarProfile).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex-1">
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary/60 rounded-full"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Skeleton pour le chargement
function RecommendationSkeleton({ variant = "full" }: { variant?: "full" | "compact" | "sidebar" }) {
  if (variant === "sidebar") {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex">
          <Skeleton className="w-20 h-24" />
          <div className="flex-1 p-4 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Panneau de recommandations principal
export function RecommendationsPanel({
  currentItemId,
  currentItemType,
  favoriteMoleculeIds = [],
  className,
  variant = "full"
}: RecommendationsPanelProps) {
  const [activeTab, setActiveTab] = useState<"similar" | "synergies" | "favorites">("similar");

  // Requêtes de recommandations
  const { data: similarMolecules, isLoading: loadingSimilarMol } = trpc.recommendations.similarMolecules.useQuery(
    { moleculeId: currentItemId!, limit: 5 },
    { enabled: currentItemType === "molecule" && !!currentItemId }
  );

  const { data: similarRecettes, isLoading: loadingSimilarRec } = trpc.recommendations.similarRecettes.useQuery(
    { recetteId: currentItemId!, limit: 5 },
    { enabled: currentItemType === "recette" && !!currentItemId }
  );

  const { data: fromFavorites, isLoading: loadingFavorites } = trpc.recommendations.fromFavorites.useQuery(
    { favoriteMoleculeIds: favoriteMoleculeIds, limit: 5 },
    { enabled: favoriteMoleculeIds.length > 0 }
  );

  // Transformer les données en format unifié
  const similarItems: RecommendedItem[] = useMemo(() => {
    if (currentItemType === "molecule" && similarMolecules) {
      return similarMolecules.map(item => ({
        id: item.molecule.id,
        name: item.molecule.name,
        score: item.similarityScore,
        type: "molecule" as const,
        family: item.molecule.family || undefined,
        radarProfile: {
          intensity: item.molecule.radarIntensity || 50,
          freshness: item.molecule.radarFreshness || 50,
          warmth: item.molecule.radarWarmth || 50,
          sweetness: item.molecule.radarSweetness || 50,
          spiciness: item.molecule.radarSpiciness || 50,
          earthiness: item.molecule.radarEarthiness || 50,
        },
      }));
    }
    if (currentItemType === "recette" && similarRecettes) {
      return similarRecettes.map(item => ({
        id: item.recette.id,
        name: item.recette.name,
        score: item.similarityScore,
        type: "recette" as const,
        category: item.recette.category || undefined,
        radarProfile: {
          intensity: item.recette.avgIntensity || 50,
          freshness: item.recette.avgFreshness || 50,
          warmth: item.recette.avgWarmth || 50,
          sweetness: item.recette.avgSweetness || 50,
          spiciness: item.recette.avgSpiciness || 50,
          earthiness: item.recette.avgEarthiness || 50,
        },
      }));
    }
    return [];
  }, [currentItemType, similarMolecules, similarRecettes]);

  const favoriteItems: RecommendedItem[] = useMemo(() => {
    if (!fromFavorites) return [];
    return fromFavorites.map(item => ({
      id: item.recette.id,
      name: item.recette.name,
      score: item.matchScore,
      type: "recette" as const,
      reason: `${item.matchingMolecules} molécule(s) favorite(s)`,
      category: item.recette.category || undefined,
    }));
  }, [fromFavorites]);

  const isLoading = loadingSimilarMol || loadingSimilarRec || loadingFavorites;

  // Variant sidebar (compact pour les sidebars)
  if (variant === "sidebar") {
    const items = activeTab === "favorites" ? favoriteItems : similarItems;
    
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Recommandations
          </h3>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <RecommendationSkeleton key={i} variant="sidebar" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-1">
            {items.slice(0, 5).map((item, index) => (
              <RecommendationCard key={item.id} item={item} index={index} variant="sidebar" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune recommandation disponible
          </p>
        )}
      </div>
    );
  }

  // Variant compact (pour les grilles)
  if (variant === "compact") {
    const items = activeTab === "favorites" ? favoriteItems : similarItems;
    
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <RecommendationSkeleton key={i} variant="compact" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-3">
              {items.slice(0, 3).map((item, index) => (
                <RecommendationCard key={item.id} item={item} index={index} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune recommandation disponible</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Variant full (panneau complet avec onglets)
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommandations Intelligentes
            </CardTitle>
            <CardDescription>
              Suggestions basées sur les profils radar et vos préférences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="similar" className="flex items-center gap-2">
              <Radar className="h-4 w-4" />
              <span className="hidden sm:inline">Similaires</span>
            </TabsTrigger>
            <TabsTrigger value="synergies" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Synergies</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favoris</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="similar">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <RecommendationSkeleton key={i} />
                  ))}
                </div>
              ) : similarItems.length > 0 ? (
                <div className="space-y-4">
                  {similarItems.map((item, index) => (
                    <RecommendationCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Radar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Sélectionnez un élément pour voir les recommandations similaires</p>
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="synergies">
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="mb-2">Synergies moléculaires</p>
              <p className="text-sm">Découvrez les combinaisons optimales basées sur les profils olfactifs</p>
              <Link href="/suggestions-synergies">
                <Button variant="outline" className="mt-4">
                  Explorer les synergies
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <AnimatePresence mode="wait">
              {loadingFavorites ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <RecommendationSkeleton key={i} />
                  ))}
                </div>
              ) : favoriteItems.length > 0 ? (
                <div className="space-y-4">
                  {favoriteItems.map((item, index) => (
                    <RecommendationCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="mb-2">Aucun favori enregistré</p>
                  <p className="text-sm">Ajoutez des molécules à vos favoris pour recevoir des recommandations personnalisées</p>
                  <Link href="/molecules">
                    <Button variant="outline" className="mt-4">
                      Explorer les molécules
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Export du composant de carte individuelle pour utilisation externe
export { RecommendationCard };
