import { useState, useMemo } from "react";
import { ViewToggle, useViewMode } from "@/components/ViewToggle";
import { RecetteListItem } from "@/components/RecetteListItem";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Search, Beaker, Filter, X, Radar, ChevronDown, ChevronUp, FlaskConical, ArrowUpDown, Info, Atom, Cigarette, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { PageHeaderSkeleton, FilterBarSkeleton } from "@/components/skeletons";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { RecetteCard } from "@/components/RecetteCard";
import { RecetteCardSkeletonGrid } from "@/components/RecetteCardSkeleton";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { RefreshCw } from "lucide-react";

// Mini radar supprimé - désormais dans RecetteCard

// Labels des axes radar avec descriptions
const RADAR_LABELS = {
  intensity: { 
    label: "Intensité", 
    short: "I", 
    color: "oklch(0.7 0.2 30)",
    tooltip: "Force olfactive globale : de subtile (0) à puissante (100). Mesure la présence et la persistance du parfum."
  },
  freshness: { 
    label: "Fraîcheur", 
    short: "F", 
    color: "oklch(0.7 0.2 180)",
    tooltip: "Caractère vivifiant et aérien : notes d'agrumes, mentholées, aqueuses ou ozonées."
  },
  warmth: { 
    label: "Chaleur", 
    short: "W", 
    color: "oklch(0.7 0.2 60)",
    tooltip: "Sensation de chaleur : notes boisées, ambreées, résineuses ou balsamées."
  },
  sweetness: { 
    label: "Douceur", 
    short: "S", 
    color: "oklch(0.7 0.2 330)",
    tooltip: "Caractère sucré ou gourmand : notes vanillées, mielées, lactonées ou florales douces."
  },
  spiciness: { 
    label: "Épicé", 
    short: "Sp", 
    color: "oklch(0.7 0.2 90)",
    tooltip: "Caractère épicé et stimulant : notes de poivre, gingembre, clou de girofle ou cannelle."
  },
  earthiness: { 
    label: "Terreux", 
    short: "E", 
    color: "oklch(0.7 0.2 120)",
    tooltip: "Caractère minéral et tellurique : notes de terre, mousse, pierre mouillée, géosmine ou vétiver."
  },
};

export default function Recettes() {
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const utils = trpc.useUtils();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedPrototype, setSelectedPrototype] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [showIngredientFilter, setShowIngredientFilter] = useState(false);
  const [showRadarFilter, setShowRadarFilter] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [linkedFilter, setLinkedFilter] = useState<'all' | 'linked' | 'unlinked'>('all');
  const [location, setLocation] = useLocation();
  
  // Filtre molécule depuis ?molecule= dans l'URL
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('molecule') || null;
    }
    return null;
  });

  // Recettes liées à la molécule sélectionnée (IDs)
  const { data: moleculeRecetteIds } = trpc.recettes?.getByMoleculeName.useQuery(
    { moleculeName: selectedMolecule ?? '' },
    { enabled: !!selectedMolecule }
  );
  const moleculeRecetteIdSet = useMemo(
    () => new Set((moleculeRecetteIds ?? []).map((r: { id: number }) => r.id)),
    [moleculeRecetteIds]
  );

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

  // Pull-to-refresh
  const [pullRef, pullState] = usePullToRefresh<HTMLDivElement>({
    onRefresh: async () => {
      await utils.recettes?.listWithRadar.invalidate();
      toast({
        title: "Recettes actualisées",
        description: "La liste des recettes a été mise à jour.",
      });
    },
  });

  // Utiliser la nouvelle procédure avec radar
  const { data: recettes = [], isLoading } = trpc.recettes?.listWithRadar.useQuery({
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
    return Array.from(new Set(recettes?.map(r => r.category).filter(Boolean)));
  }, [recettes]);

  // Prototypes
  const prototypes = ["C1", "C2", "C3", "C4"];

  // Popular ingredients for quick filter
  const popularIngredients = [
    "Limonène", "Myrcène", "Linalol", "Caryophyllène", "Pinène",
    "Géosmine", "Ambrox", "Vétiver", "Ozone", "Terre"
  ];

  // Filter and sort recettes
  const filteredRecettes = useMemo(() => {
    // Filtrer d'abord
    let filtered = recettes?.filter((recette) => {
      const matchesSearch = recette.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGamme = !selectedGamme || getGammeFromCategory(recette.category) === selectedGamme;
      const matchesFamily = !selectedFamily || recette.category === selectedFamily;
      const matchesPrototype = !selectedPrototype || recette.formula?.includes(selectedPrototype);
      const matchesIngredient = !selectedIngredient || recette.ingredients?.toLowerCase().includes(selectedIngredient.toLowerCase());
      const matchesLinked = linkedFilter === 'all' || (linkedFilter === 'linked' && recette.moleculeCount > 0) || (linkedFilter === 'unlinked' && recette.moleculeCount === 0);
      const matchesMolecule = !selectedMolecule || moleculeRecetteIdSet.has(recette.id);
      return matchesSearch && matchesGamme && matchesFamily && matchesPrototype && matchesIngredient && matchesLinked && matchesMolecule;
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
        // Tri par ID décroissant (les plus récentes en premier)
        return filtered.sort((a, b) => b.id - a.id);
    }
  }, [recettes, searchTerm, selectedGamme, selectedFamily, selectedPrototype, selectedIngredient, sortBy, linkedFilter, selectedMolecule, moleculeRecetteIdSet]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGamme(null);
    setSelectedFamily(null);
    setSelectedPrototype(null);
    setSelectedIngredient(null);
    setLinkedFilter('all');
    setSelectedMolecule(null);
  };

  const clearAllFilters = () => {
    clearFilters();
    clearRadarFilters();
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés.",
    });
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

  const hasActiveFilters = searchTerm || selectedGamme || selectedFamily || selectedPrototype || selectedIngredient || linkedFilter !== 'all' || selectedMolecule;
  
  // Statistiques de couverture
  const linkedCount = recettes?.filter(r => r.moleculeCount > 0).length;
  const unlinkedCount = recettes?.filter(r => r.moleculeCount === 0).length;
  const coveragePercent = recettes?.length > 0 ? Math.round(linkedCount / recettes?.length * 100) : 0;
  
  const hasActiveRadarFilters = Object.values(radarFilters).some(
    ([min, max]) => min > 0 || max < 100
  );
  
  const hasAnyActiveFilters = hasActiveFilters || hasActiveRadarFilters;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 container py-8">
          <PageHeaderSkeleton />
          <FilterBarSkeleton />
          <RecetteCardSkeletonGrid count={9} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      {/* Pull-to-refresh indicator */}
      <div 
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
        style={{
          opacity: pullState.isPulling || pullState.isRefreshing ? 1 : 0,
          transform: `translateX(-50%) translateY(${pullState.isPulling || pullState.isRefreshing ? '0' : '-100%'})`,
        }}
      >
        <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
          <RefreshCw className={`h-5 w-5 ${pullState.isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>
      
      <main ref={pullRef} className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Beaker className="h-10 w-10 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">Recettes</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Formules olfactives développées dans le cadre de PERFUMUM. Explorez les {recettes?.length} recettes par famille, prototype ou profil radar.
              </p>
            </div>
          </div>
        </section>

        {/* Bandeau Cigarillos */}
        <section className="py-4 border-b bg-amber-950/20 border-amber-800/30">
          <div className="container">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Cigarette className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <span className="font-semibold text-amber-400">Recettes Cigarillos</span>
                  <span className="text-muted-foreground text-sm ml-2">— 32 formulations (Archives Vivantes, Haute Parfumerie Fumée, Recettes Signature)</span>
                </div>
              </div>
              <Link href="/recettes-cigarillos">
                <Button variant="outline" size="sm" className="border-amber-700 text-amber-400 hover:bg-amber-900/30 shrink-0">
                  Explorer les cigarillos <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une recette par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtre molécule actif (depuis ?molecule= ou popover) */}
              {selectedMolecule && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 border border-primary/30 animate-in slide-in-from-top-2 duration-200">
                  <Atom className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-primary">
                    Recettes contenant <strong>{selectedMolecule}</strong>
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {filteredRecettes.length} résultat{filteredRecettes.length !== 1 ? 's' : ''}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-auto text-primary hover:text-primary hover:bg-primary/20"
                    onClick={() => setSelectedMolecule(null)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Gamme Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-muted-foreground">Gammes :</span>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs font-semibold mb-1">Les 5 gammes olfactives de PERFUMUM :</p>
                        <ul className="text-xs space-y-0.5">
                          <li>• <strong>Pétrichor</strong> : Terre mouillée, minéral, géosmine</li>
                          <li>• <strong>Volcanique</strong> : Soufre, pierre chaude, fumée</li>
                          <li>• <strong>Civilisations</strong> : Résines sacrées, traditions</li>
                          <li>• <strong>Glaciaire</strong> : Fraîcheur polaire, ozone, glace</li>
                          <li>• <strong>Biolab</strong> : Synthèse moléculaire, expérimental</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {(['petrichor', 'volcanique', 'civilisations', 'glaciaire', 'biolab', 'colombie'] as GammeType[]).map((gamme) => (
                  <GammeBadge 
                    key={gamme}
                    gamme={gamme} 
                    size="sm" 
                    className={`cursor-pointer ${selectedGamme === gamme ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                    onClick={() => setSelectedGamme(selectedGamme === gamme ? null : gamme)}
                  />
                ))}
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filtres :</span>
                </div>

                {/* Family Filters */}
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs font-semibold mb-1">Familles de recettes :</p>
                        <ul className="text-xs space-y-0.5">
                          <li>• <strong>Parfum</strong> : Compositions pour diffusion atmosphérique</li>
                          <li>• <strong>Résine</strong> : Encens traditionnels à base de résines</li>
                          <li>• <strong>Résine CBD</strong> : Formules enrichies au cannabidiol</li>
                          <li>• <strong>Tabac</strong> : Mélanges pour fumigation</li>
                          <li>• <strong>Cône</strong> : Encens en forme de cône</li>
                          <li>• <strong>Extrait</strong> : Concentrés olfactifs</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                  {families.slice(0, 6).map((family) => (
                    <Button
                      key={family}
                      variant={selectedFamily === family ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFamily(selectedFamily === family ? null : family)}
                    >
                      {family}
                    </Button>
                  ))}
                  </div>
                </div>

                {/* Prototype Filters */}
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs font-semibold mb-1">Les 4 prototypes fondamentaux :</p>
                        <ul className="text-xs space-y-0.5">
                          <li>• <strong>C1 — Clarus Albus</strong> : Pureté, lactone, blanc</li>
                          <li>• <strong>C2 — Clarus Verde</strong> : Végétal, chlorophylle, vert</li>
                          <li>• <strong>C3 — Lacta Solis</strong> : Chaleur, miel, doré</li>
                          <li>• <strong>C4 — Terra Ambra</strong> : Terre, ambre, brun</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                  {prototypes.map((proto) => (
                    <Button
                      key={proto}
                      variant={selectedPrototype === proto ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPrototype(selectedPrototype === proto ? null : proto)}
                    >
                      {proto}
                    </Button>
                  ))}
                  </div>
                </div>

                {/* Linked Filter */}
                <div className="flex items-center gap-1 rounded-md border p-1">
                  <Button
                    variant={linkedFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setLinkedFilter('all')}
                  >
                    Toutes ({recettes?.length})
                  </Button>
                  <Button
                    variant={linkedFilter === 'linked' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setLinkedFilter('linked')}
                  >
                    ✓ Liées ({linkedCount})
                  </Button>
                  <Button
                    variant={linkedFilter === 'unlinked' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setLinkedFilter('unlinked')}
                  >
                    ○ À compléter ({unlinkedCount})
                  </Button>
                </div>

                {/* Ingredient Filter Toggle */}
                <Button
                  variant={showIngredientFilter ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowIngredientFilter(!showIngredientFilter)}
                >
                  <Beaker className="h-3 w-3" />
                  Ingrédients
                </Button>

                {/* Radar Filter Toggle */}
                <Button
                  variant={showRadarFilter ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowRadarFilter(!showRadarFilter)}
                >
                  <Radar className="h-3 w-3" />
                  Profil Radar
                  {hasActiveRadarFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      Actif
                    </Badge>
                  )}
                  {showRadarFilter ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>

                {/* View Toggle + Sort Dropdown */}
                <div className="flex items-center gap-4 ml-auto">
                  <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récentes</SelectItem>
                      <SelectItem value="name-asc">Nom A-Z</SelectItem>
                      <SelectItem value="name-desc">Nom Z-A</SelectItem>
                      <SelectItem value="intensity-asc">Intensité ↑</SelectItem>
                      <SelectItem value="intensity-desc">Intensité ↓</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear All Filters */}
                {hasAnyActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                    Réinitialiser tous les filtres
                  </Button>
                )}
              </div>

              {/* Radar Filter Panel */}
              {showRadarFilter && (
                <div className="p-4 bg-muted/50 rounded-lg border space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Radar className="h-4 w-4" />
                      Filtrer par profil radar
                    </h4>
                    {hasActiveRadarFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRadarFilters}
                        className="h-7 px-2"
                      >
                        <X className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Réinitialiser</span>
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground hidden md:block">
                    Ajustez les plages de valeurs pour filtrer les recettes selon leur profil olfactif moyen (calculé à partir des molécules associées).
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(Object.entries(RADAR_LABELS) as [keyof typeof radarFilters, typeof RADAR_LABELS.intensity][]).map(([key, { label, color, tooltip }]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium" style={{ color }}>{label}</span>
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-xs">{tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {radarFilters[key][0]} - {radarFilters[key][1]}
                          </span>
                        </div>
                        <Slider
                          value={radarFilters[key]}
                          onValueChange={(value) => setRadarFilters(prev => ({
                            ...prev,
                            [key]: value as [number, number]
                          }))}
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredient Filter Panel */}
              {showIngredientFilter && (
                <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Beaker className="h-4 w-4" />
                      Filtrer par ingrédient
                    </h4>
                    {selectedIngredient && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedIngredient(null)}
                        className="h-7 px-2"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {selectedIngredient}
                      </Button>
                    )}
                  </div>
                  
                  {/* Popular ingredients */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Ingrédients populaires :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {popularIngredients.map((ing) => (
                        <Badge
                          key={ing}
                          variant={selectedIngredient === ing ? "default" : "secondary"}
                          className="cursor-pointer hover:bg-primary/80"
                          onClick={() => setSelectedIngredient(selectedIngredient === ing ? null : ing)}
                        >
                          {ing}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Results count + Coverage stats */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {filteredRecettes.length} recette{filteredRecettes.length > 1 ? 's' : ''} trouvée{filteredRecettes.length > 1 ? 's' : ''}
                </p>
                <Badge variant="outline" className="text-xs">
                  <FlaskConical className="h-3 w-3 mr-1" />
                  Couverture : {coveragePercent}% ({linkedCount}/{recettes?.length})
                </Badge>
                {linkedFilter === 'unlinked' && (
                  <Badge variant="secondary" className="text-xs">
                    {filteredRecettes.length} recette{filteredRecettes.length > 1 ? 's' : ''} à compléter
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="py-8">
          <div className="container">
            {isLoading ? (
              <RecetteCardSkeletonGrid count={9} />
            ) : filteredRecettes.length === 0 ? (
              <div className="text-center py-12">
                <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucune recette trouvée</h3>
                <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>
                {hasActiveRadarFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearRadarFilters}
                    className="mt-4"
                  >
                    Réinitialiser les filtres radar
                  </Button>
                )}
              </div>
            ) : viewMode === "list" ? (
              /* Vue Liste */
              <div className="space-y-2">
                {filteredRecettes.map((recette) => (
                  <RecetteListItem
                    key={recette.id}
                    recette={recette}
                    isSelected={selectedForComparison.includes(recette.id)}
                    onToggleSelection={() => {
                      if (selectedForComparison.includes(recette.id)) {
                        setSelectedForComparison(prev => prev.filter(i => i !== recette.id));
                      } else {
                        if (selectedForComparison.length >= 4) {
                          toast({ title: "Maximum 4 recettes", description: "Vous pouvez comparer jusqu'à 4 recettes à la fois.", variant: "destructive" });
                        } else {
                          setSelectedForComparison(prev => [...prev, recette.id]);
                        }
                      }
                    }}
                    isFavorite={isFavorite(`/recettes/${recette.id}`)}
                    onFavorite={(id) => {
                      const href = `/recettes/${id}`;
                      toggleFavorite({ id: String(id), title: recette.name, href });
                      toast({ 
                        title: isFavorite(href) ? "Retiré des favoris" : "Ajouté aux favoris",
                        description: isFavorite(href) 
                          ? "La recette a été retirée de vos favoris" 
                          : "La recette a été ajoutée à vos favoris"
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Vue Grille */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecettes.map((recette) => (
                <RecetteCard
                  key={recette.id}
                  recette={recette}
                  showCheckbox={true}
                  isSelectedForComparison={selectedForComparison.includes(recette.id)}
                  onSelect={(id, checked) => {
                    if (checked) {
                      if (selectedForComparison.length >= 4) {
                        toast({ title: "Maximum 4 recettes", description: "Vous pouvez comparer jusqu'à 4 recettes à la fois.", variant: "destructive" });
                      } else {
                        setSelectedForComparison(prev => [...prev, id]);
                      }
                    } else {
                      setSelectedForComparison(prev => prev.filter(i => i !== id));
                    }
                  }}
                  onCompare={(id) => {
                    if (selectedForComparison.includes(id)) {
                      setSelectedForComparison(prev => prev.filter(i => i !== id));
                      toast({ title: "Recette retirée de la comparaison" });
                    } else if (selectedForComparison.length >= 4) {
                      toast({ title: "Maximum 4 recettes", description: "Vous pouvez comparer jusqu'à 4 recettes à la fois.", variant: "destructive" });
                    } else {
                      setSelectedForComparison(prev => [...prev, id]);
                      toast({ title: "Recette ajoutée à la comparaison" });
                    }
                  }}
                  onExport={(id) => {
                    toast({ title: "Export PDF", description: "Fonctionnalité à venir" });
                  }}
                  isFavorite={isFavorite(`/recettes/${recette.id}`)}
                  onFavorite={(id) => {
                    const href = `/recettes/${id}`;
                    toggleFavorite({ id: String(id), title: recette.name, href });
                    toast({ 
                      title: isFavorite(href) ? "Retiré des favoris" : "Ajouté aux favoris",
                      description: isFavorite(href) 
                        ? "La recette a été retirée de vos favoris" 
                        : "La recette a été ajoutée à vos favoris"
                    });
                  }}
                />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Barre flottante de comparaison */}
      <FloatingCompareBar
        selectedCount={selectedForComparison.length}
        maxCount={4}
        onClear={() => {
          setSelectedForComparison([]);
          toast({ title: "Sélection effacée" });
        }}
        onCompare={() => {
          const ids = selectedForComparison.join(',');
          setLocation(`/compare-recettes?ids=${ids}`);
        }}
      />
    </div>
  );
}
