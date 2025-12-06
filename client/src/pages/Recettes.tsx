import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, Beaker, Filter, X } from "lucide-react";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromCategory } from "@/lib/gammeMapping";

export default function Recettes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedPrototype, setSelectedPrototype] = useState<string | null>(null);
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);

  const { data: recettes = [], isLoading } = trpc.recettes.list.useQuery();

  // Filter recettes
  const filteredRecettes = recettes.filter((recette) => {
    const matchesSearch = recette.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = !selectedFamily || recette.category === selectedFamily;
    const matchesPrototype = !selectedPrototype || recette.formula?.includes(selectedPrototype);
    const matchesGamme = !selectedGamme || getGammeFromCategory(recette.category) === selectedGamme;
    return matchesSearch && matchesFamily && matchesPrototype && matchesGamme;
  });

  // Extract unique families and prototypes for filters
  const families = Array.from(new Set(recettes.map(r => r.category).filter(Boolean)));
  const prototypes = ["C1", "C2", "C3", "C4"];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFamily(null);
    setSelectedPrototype(null);
    setSelectedGamme(null);
  };

  const hasActiveFilters = searchTerm || selectedFamily || selectedPrototype || selectedGamme;

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
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
                <GammeBadge 
                  gamme="petrichor" 
                  size="sm" 
                  className={`cursor-pointer ${selectedGamme === 'petrichor' ? 'ring-2 ring-offset-2 ring-gamme-petrichor' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setSelectedGamme(selectedGamme === 'petrichor' ? null : 'petrichor')}
                />
                <GammeBadge 
                  gamme="volcanique" 
                  size="sm" 
                  className={`cursor-pointer ${selectedGamme === 'volcanique' ? 'ring-2 ring-offset-2 ring-gamme-volcanique' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setSelectedGamme(selectedGamme === 'volcanique' ? null : 'volcanique')}
                />
                <GammeBadge 
                  gamme="civilisations" 
                  size="sm" 
                  className={`cursor-pointer ${selectedGamme === 'civilisations' ? 'ring-2 ring-offset-2 ring-gamme-civilisations' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setSelectedGamme(selectedGamme === 'civilisations' ? null : 'civilisations')}
                />
                <GammeBadge 
                  gamme="glaciaire" 
                  size="sm" 
                  className={`cursor-pointer ${selectedGamme === 'glaciaire' ? 'ring-2 ring-offset-2 ring-gamme-glaciaire' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setSelectedGamme(selectedGamme === 'glaciaire' ? null : 'glaciaire')}
                />
                <GammeBadge 
                  gamme="biolab" 
                  size="sm" 
                  className={`cursor-pointer ${selectedGamme === 'biolab' ? 'ring-2 ring-offset-2 ring-gamme-biolab' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setSelectedGamme(selectedGamme === 'biolab' ? null : 'biolab')}
                />
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

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {filteredRecettes.length} recette{filteredRecettes.length !== 1 ? 's' : ''} trouvée{filteredRecettes.length !== 1 ? 's' : ''}
                {hasActiveFilters && ` sur ${recettes.length} au total`}
              </div>
            </div>
          </div>
        </section>

        {/* Recettes Grid */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredRecettes.length === 0 ? (
                <div className="text-center py-12">
                  <Beaker className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune recette trouvée</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredRecettes.map((recette) => (
                    <Link key={recette.id} href={`/recette/${recette.id}`}>
                      <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg line-clamp-2 flex-1">{recette.name}</CardTitle>
                            {getGammeFromCategory(recette.category) && (
                              <GammeBadge 
                                gamme={getGammeFromCategory(recette.category)!} 
                                size="sm" 
                                showIcon={false}
                              />
                            )}
                          </div>
                          {recette.category && (
                            <CardDescription className="flex items-center gap-2">
                              <Badge variant="outline">{recette.category}</Badge>
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {recette.formula && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {recette.formula}
                            </p>
                          )}
                          {recette.protocol && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Protocole</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{recette.protocol}</p>
                            </div>
                          )}
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {recette.intensity && (
                              <span>Intensité: {recette.intensity}</span>
                            )}
                            {recette.stability && (
                              <span>• Stabilité: {recette.stability}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
