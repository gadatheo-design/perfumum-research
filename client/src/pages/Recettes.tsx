import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, Beaker, Filter, X, GitBranch } from "lucide-react";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";
import { Progress } from "@/components/ui/progress";

export default function Recettes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedPrototype, setSelectedPrototype] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [showIngredientFilter, setShowIngredientFilter] = useState(false);

  const { data: recettes = [], isLoading } = trpc.recettes.list.useQuery();

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

  // Filter recettes
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

  const hasActiveFilters = searchTerm || selectedGamme || selectedFamily || selectedPrototype || selectedIngredient;

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
                Formules olfactives développées dans le cadre de PERFUMUM. Explorez les {recettes.length} recettes par famille, prototype ou civilisation.
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
              <p className="text-sm text-muted-foreground">
                {filteredRecettes.length} recette{filteredRecettes.length > 1 ? 's' : ''} trouvée{filteredRecettes.length > 1 ? 's' : ''}
              </p>
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
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{recette.name}</CardTitle>
                          {recette.parentRecetteId && (
                            <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              Variation
                            </Badge>
                          )}
                        </div>
                        {recette.category && getGammeFromCategory(recette.category) && (
                          <GammeBadge gamme={getGammeFromCategory(recette.category)!} size="sm" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recette.category && (
                          <Badge variant="outline">{recette.category}</Badge>
                        )}
                        
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
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
