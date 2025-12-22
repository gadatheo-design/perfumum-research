import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);

  const { data: recettes = [], isLoading } = trpc.recettes.list.useQuery();

  // Filter recettes
  const filteredRecettes = recettes.filter((recette) => {
    const matchesSearch = recette.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGamme = !selectedGamme || getGammeFromCategory(recette.category) === selectedGamme;
    return matchesSearch && matchesGamme;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGamme(null);
  };

  const hasActiveFilters = searchTerm || selectedGamme;

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
                Formules olfactives développées dans le cadre de PERFUMUM. Explorez les {recettes.length} recettes.
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

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-3 w-3" />
                  Effacer les filtres
                </Button>
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
                        <CardTitle className="text-lg">{recette.name}</CardTitle>
                        {recette.category && getGammeFromCategory(recette.category) && (
                          <GammeBadge gamme={getGammeFromCategory(recette.category)!} size="sm" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {recette.category && (
                          <Badge variant="outline">{recette.category}</Badge>
                        )}
                        {recette.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {recette.description}
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
