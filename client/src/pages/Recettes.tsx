import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, Beaker, Filter, X, GitBranch, Radar, ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { Progress } from "@/components/ui/progress";

// Composant mini radar hexagonal
function MiniRadar({ values }: { values: { i: number; f: number; w: number; s: number; sp: number; e: number } }) {
  const size = 50;
  const center = size / 2;
  const radius = size * 0.4;
  
  // 6 axes à 60° d'intervalle
  const angles = [0, 60, 120, 180, 240, 300].map(a => (a - 90) * Math.PI / 180);
  const vals = [values.i, values.f, values.w, values.s, values.sp, values.e];
  
  // Points du polygone
  const points = angles.map((angle, i) => {
    const r = (vals[i] / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');
  
  // Points du cadre hexagonal
  const framePoints = angles.map((angle) => {
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');
  
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      {/* Cadre hexagonal */}
      <polygon
        points={framePoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-muted-foreground/30"
      />
      {/* Valeurs */}
      <polygon
        points={points}
        fill="oklch(0.7 0.15 200 / 0.3)"
        stroke="oklch(0.7 0.15 200)"
        strokeWidth="1"
      />
    </svg>
  );
}

// Labels des axes radar
const RADAR_LABELS = {
  intensity: { label: "Intensité", short: "I", color: "oklch(0.7 0.2 30)" },
  freshness: { label: "Fraîcheur", short: "F", color: "oklch(0.7 0.2 180)" },
  warmth: { label: "Chaleur", short: "W", color: "oklch(0.7 0.2 60)" },
  sweetness: { label: "Douceur", short: "S", color: "oklch(0.7 0.2 330)" },
  spiciness: { label: "Épicé", short: "Sp", color: "oklch(0.7 0.2 90)" },
  earthiness: { label: "Terreux", short: "E", color: "oklch(0.7 0.2 120)" },
};

export default function Recettes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedPrototype, setSelectedPrototype] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [showIngredientFilter, setShowIngredientFilter] = useState(false);
  const [showRadarFilter, setShowRadarFilter] = useState(false);
  
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
    return Array.from(new Set(recettes.map(r => r.category).filter(Boolean)));
  }, [recettes]);

  // Prototypes
  const prototypes = ["C1", "C2", "C3", "C4"];

  // Popular ingredients for quick filter
  const popularIngredients = [
    "Limonène", "Myrcène", "Linalol", "Caryophyllène", "Pinène",
    "Géosmine", "Ambrox", "Vétiver", "Ozone", "Terre"
  ];

  // Filter recettes (filtres locaux en plus des filtres radar côté serveur)
  const filteredRecettes = useMemo(() => {
    return recettes.filter((recette) => {
      const matchesSearch = recette.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGamme = !selectedGamme || getGammeFromCategory(recette.category) === selectedGamme;
      const matchesFamily = !selectedFamily || recette.category === selectedFamily;
      const matchesPrototype = !selectedPrototype || recette.formula?.includes(selectedPrototype);
      const matchesIngredient = !selectedIngredient || recette.ingredients?.toLowerCase().includes(selectedIngredient.toLowerCase());
      return matchesSearch && matchesGamme && matchesFamily && matchesPrototype && matchesIngredient;
    });
  }, [recettes, searchTerm, selectedGamme, selectedFamily, selectedPrototype, selectedIngredient]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGamme(null);
    setSelectedFamily(null);
    setSelectedPrototype(null);
    setSelectedIngredient(null);
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

  const hasActiveFilters = searchTerm || selectedGamme || selectedFamily || selectedPrototype || selectedIngredient;
  
  const hasActiveRadarFilters = Object.values(radarFilters).some(
    ([min, max]) => min > 0 || max < 100
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-8">Recettes</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Beaker className="h-10 w-10 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">Recettes</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Formules olfactives développées dans le cadre de PERFUMUM. Explorez les {recettes.length} recettes par famille, prototype ou profil radar.
              </p>
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

              {/* Gamme Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">Gammes :</span>
                {(['petrichor', 'volcanique', 'civilisations', 'glaciaire', 'biolab'] as GammeType[]).map((gamme) => (
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

                {/* Prototype Filters */}
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

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="h-3 w-3" />
                    Effacer
                  </Button>
                )}
              </div>

              {/* Radar Filter Panel */}
              {showRadarFilter && (
                <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
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
                        Réinitialiser
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Ajustez les plages de valeurs pour filtrer les recettes selon leur profil olfactif moyen (calculé à partir des molécules associées).
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Object.entries(RADAR_LABELS) as [keyof typeof radarFilters, typeof RADAR_LABELS.intensity][]).map(([key, { label, color }]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color }}>{label}</span>
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

              {/* Results count */}
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {filteredRecettes.length} recette{filteredRecettes.length > 1 ? 's' : ''} trouvée{filteredRecettes.length > 1 ? 's' : ''}
                </p>
                {hasActiveRadarFilters && (
                  <Badge variant="outline" className="text-xs">
                    <FlaskConical className="h-3 w-3 mr-1" />
                    {filteredRecettes.filter(r => r.moleculeCount > 0).length} avec molécules
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecettes.map((recette) => (
                <Link key={recette.id} href={`/recette/${recette.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <CardTitle className="text-lg">{recette.name}</CardTitle>
                          {recette.parentRecetteId && (
                            <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              Variation
                            </Badge>
                          )}
                        </div>
                        {/* Mini radar si molécules associées */}
                        {recette.moleculeCount > 0 && (
                          <MiniRadar values={{
                            i: recette.avgIntensity,
                            f: recette.avgFreshness,
                            w: recette.avgWarmth,
                            s: recette.avgSweetness,
                            sp: recette.avgSpiciness,
                            e: recette.avgEarthiness,
                          }} />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {recette.category && getGammeFromCategory(recette.category) && (
                            <GammeBadge gamme={getGammeFromCategory(recette.category)!} size="sm" />
                          )}
                          {recette.category && (
                            <Badge variant="outline">{recette.category}</Badge>
                          )}
                          {recette.moleculeCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <FlaskConical className="h-3 w-3 mr-1" />
                              {recette.moleculeCount} mol.
                            </Badge>
                          )}
                        </div>
                        
                        {/* Intensity & Stability */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Intensité</span>
                            <span>{recette.intensity || 5}/10</span>
                          </div>
                          <Progress value={(recette.intensity || 5) * 10} className="h-1.5" />
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Stabilité</span>
                            <span>{recette.stability || 'medium'}</span>
                          </div>
                        </div>

                        {/* Radar values preview (si molécules) */}
                        {recette.moleculeCount > 0 && (
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="text-center p-1 rounded bg-muted/50">
                              <div className="font-medium">{recette.avgIntensity}</div>
                              <div className="text-muted-foreground text-[10px]">Intens.</div>
                            </div>
                            <div className="text-center p-1 rounded bg-muted/50">
                              <div className="font-medium">{recette.avgFreshness}</div>
                              <div className="text-muted-foreground text-[10px]">Fraîch.</div>
                            </div>
                            <div className="text-center p-1 rounded bg-muted/50">
                              <div className="font-medium">{recette.avgEarthiness}</div>
                              <div className="text-muted-foreground text-[10px]">Terreux</div>
                            </div>
                          </div>
                        )}

                        {/* Ingredients preview */}
                        {recette.ingredients && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {recette.ingredients}
                          </p>
                        )}

                        {recette.formula && (
                          <p className="text-xs text-muted-foreground">
                            Prototype: {recette.formula}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredRecettes.length === 0 && (
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
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
