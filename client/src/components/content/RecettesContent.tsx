import { useState, useMemo } from "react";
import { ViewToggle, useViewMode } from "@/components/ViewToggle";
import { RecetteListItem } from "@/components/RecetteListItem";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Beaker, Filter, X, ArrowUpDown, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { RecetteCard } from "@/components/RecetteCard";
import { RecetteCardSkeletonGrid } from "@/components/RecetteCardSkeleton";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { GridSkeleton, FilterBarSkeleton } from "@/components/skeletons";

/**
 * RecettesContent - The core content of the recettes list page
 * 
 * This component contains all the functionality of the Recettes page
 * but without the Header/Footer wrapper, making it embeddable in
 * the consolidated RecettesHub page.
 */
export function RecettesContent() {
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const utils = trpc.useUtils();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedPrototype, setSelectedPrototype] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [, setLocation] = useLocation();
  
  // View mode (grid/list)
  const [viewMode, setViewMode] = useViewMode("recettes-view-mode", "grid");
  
  // Filtres radar (plages min-max)
  const [radarFilters, setRadarFilters] = useState({
    intensity: [0, 100] as [number, number],
    freshness: [0, 100] as [number, number],
    warmth: [0, 100] as [number, number],
    sweetness: [0, 100] as [number, number],
    spiciness: [0, 100] as [number, number],
    earthiness: [0, 100] as [number, number],
  });

  // Utiliser la nouvelle procédure avec radar
  const { data: recettes = [], isLoading } = trpc.recettes.listWithRadar.useQuery({
    intensityMin: radarFilters.intensity[0] > 0 ? radarFilters.intensity[0] : undefined,
    intensityMax: radarFilters.intensity[1] < 100 ? radarFilters.intensity[1] : undefined,
    freshnessMin: radarFilters.freshness[0] > 0 ? radarFilters.freshness[0] : undefined,
    freshnessMax: radarFilters.freshness[1] < 100 ? radarFilters.freshness[1] : undefined,
    warmthMin: radarFilters.warmth[0] > 0 ? radarFilters.warmth[0] : undefined,
    warmthMax: radarFilters.warmth[1] < 100 ? radarFilters.warmth[1] : undefined,
    sweetnessMin: radarFilters.sweetness[0] > 0 ? radarFilters.sweetness[0] : undefined,
    sweetnessMax: radarFilters.sweetness[1] < 100 ? radarFilters.sweetness[1] : undefined,
    spicinessMin: radarFilters.spiciness[0] > 0 ? radarFilters.spiciness[0] : undefined,
    spicinessMax: radarFilters.spiciness[1] < 100 ? radarFilters.spiciness[1] : undefined,
    earthinessMin: radarFilters.earthiness[0] > 0 ? radarFilters.earthiness[0] : undefined,
    earthinessMax: radarFilters.earthiness[1] < 100 ? radarFilters.earthiness[1] : undefined,
  });

  // Extract unique families from recettes
  const families = useMemo(() => {
    const uniqueFamilies = Array.from(new Set(recettes.map(r => r.category).filter(Boolean)));
    return uniqueFamilies.map(f => ({ value: f!, label: f! }));
  }, [recettes]);

  // Prototypes
  const prototypes = [
    { value: "C1", label: "C1 — Fermentum" },
    { value: "C2", label: "C2 — Clarus Verde" },
    { value: "C3", label: "C3 — Lacta Solis" },
    { value: "C4", label: "C4 — Terra Ambra" },
  ];

  // Filter and sort recettes
  const filteredRecettes = useMemo(() => {
    let filtered = recettes.filter((recette) => {
      const matchesSearch = recette.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGamme = !selectedGamme || getGammeFromCategory(recette.category) === selectedGamme;
      const matchesFamily = !selectedFamily || recette.category === selectedFamily;
      const matchesPrototype = !selectedPrototype || recette.formula?.includes(selectedPrototype);
      return matchesSearch && matchesGamme && matchesFamily && matchesPrototype;
    });

    // Trier ensuite
    switch (sortBy) {
      case "name-asc":
        return filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":
        return filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case "intensity-asc":
        return filtered.sort((a, b) => (a.intensity || 0) - (b.intensity || 0));
      case "intensity-desc":
        return filtered.sort((a, b) => (b.intensity || 0) - (a.intensity || 0));
      case "recent":
      default:
        return filtered.sort((a, b) => b.id - a.id);
    }
  }, [recettes, searchTerm, selectedGamme, selectedFamily, selectedPrototype, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGamme(null);
    setSelectedFamily(null);
    setSelectedPrototype(null);
  };

  const clearRadarFilters = () => {
    setRadarFilters({
      intensity: [0, 100],
      freshness: [0, 100],
      warmth: [0, 100],
      sweetness: [0, 100],
      spiciness: [0, 100],
      earthiness: [0, 100],
    });
  };

  const clearAllFilters = () => {
    clearFilters();
    clearRadarFilters();
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
  };

  const hasActiveFilters = searchTerm || selectedGamme || selectedFamily || selectedPrototype;
  
  const hasActiveRadarFilters = Object.values(radarFilters).some(
    ([min, max]) => min > 0 || max < 100
  );
  
  const hasAnyActiveFilters = hasActiveFilters || hasActiveRadarFilters;

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedGamme) count++;
    if (selectedFamily) count++;
    if (selectedPrototype) count++;
    if (hasActiveRadarFilters) count++;
    return count;
  }, [searchTerm, selectedGamme, selectedFamily, selectedPrototype, hasActiveRadarFilters]);

  // Comparison handlers
  const toggleComparison = (id: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 4) {
        toast({
          title: "Maximum atteint",
          description: "Vous pouvez comparer jusqu'à 4 recettes.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearComparison = () => setSelectedForComparison([]);

  const goToComparison = () => {
    if (selectedForComparison.length >= 2) {
      setLocation(`/compare-recettes?ids=${selectedForComparison.join(",")}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FilterBarSkeleton />
        <RecetteCardSkeletonGrid count={9} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        {/* Search and Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher une recette..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FilterSelect
                  value={selectedFamily || "all"}
                  onChange={(v) => setSelectedFamily(v === "all" ? null : v)}
                  options={[{ value: "all", label: "Toutes" }, ...families]}
                  placeholder="Catégorie"
                />
                <FilterSelect
                  value={selectedPrototype || "all"}
                  onChange={(v) => setSelectedPrototype(v === "all" ? null : v)}
                  options={[{ value: "all", label: "Tous" }, ...prototypes]}
                  placeholder="Prototype"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intensité</label>
                  <Slider
                    value={radarFilters.intensity}
                    onValueChange={(v) => setRadarFilters(prev => ({ ...prev, intensity: v as [number, number] }))}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{radarFilters.intensity[0]}</span>
                    <span>{radarFilters.intensity[1]}</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récentes</SelectItem>
                      <SelectItem value="name-asc">Nom A-Z</SelectItem>
                      <SelectItem value="name-desc">Nom Z-A</SelectItem>
                      <SelectItem value="intensity-desc">Intensité ↓</SelectItem>
                      <SelectItem value="intensity-asc">Intensité ↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {hasAnyActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredRecettes.length} recette{filteredRecettes.length > 1 ? "s" : ""} trouvée{filteredRecettes.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Results Grid */}
      {filteredRecettes.length === 0 ? (
        <div className="text-center py-12">
          <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune recette trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button variant="outline" onClick={clearAllFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-3">
          {filteredRecettes.map((recette) => (
            <RecetteListItem
              key={recette.id}
              recette={recette}
              isSelected={selectedForComparison.includes(recette.id)}
              onToggleSelection={() => toggleComparison(recette.id)}
              isFavorite={isFavorite(String(recette.id))}
              onFavorite={(id) => toggleFavorite({ href: `/recettes/${id}`, title: recette.name || 'Recette', id: String(id) })}
            />
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === "compact" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {filteredRecettes.map((recette) => (
            <RecetteCard
              key={recette.id}
              recette={recette}
              isSelected={selectedForComparison.includes(recette.id)}
              onSelect={() => toggleComparison(recette.id)}
              variant={viewMode === "compact" ? "compact" : "default"}
            />
          ))}
        </div>
      )}

      {/* Floating Compare Bar */}
      {selectedForComparison.length > 0 && (
        <FloatingCompareBar
          selectedCount={selectedForComparison.length}
          maxCount={4}
          onClear={clearComparison}
          onCompare={goToComparison}
        />
      )}
    </div>
  );
}

export default RecettesContent;
