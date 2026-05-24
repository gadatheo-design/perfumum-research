import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Layers, ChevronRight, ArrowRight, Search } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";

const TYPE_LABELS: Record<string, string> = {
  perfumeum12: "Perfumeum 12",
  biomineralis: "Bio-Mineralis",
  petrichor: "Pétrichor",
  volcanique: "Volcanique",
  solarmineralis: "Solar-Mineralis",
  necrogeo: "Nécro-Géo",
  other: "Autre",
};

// Mapping des types vers les pages de gammes
const TYPE_TO_GAMME_PATH: Record<string, string> = {
  perfumeum12: "/recettes?category=Perfumeum",
  biomineralis: "/gammes/biolab",
  petrichor: "/gammes/petrichor",
  volcanique: "/gammes/volcanique",
  solarmineralis: "/recettes?category=Solar-Mineralis",
  necrogeo: "/recettes?category=Nécro-Géo",
  other: "/recettes",
};

export default function FamillesList() {
  const { data: families, isLoading } = trpc.families?.list.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Extract unique types for filter
  const types = useMemo(() => {
    if (!families) return [];
    const uniqueTypes = new Set(families?.map(f => f.type));
    return Array.from(uniqueTypes).map(t => ({ 
      value: t, 
      label: TYPE_LABELS[t] || t 
    }));
  }, [families]);

  // Filter families
  const filteredFamilies = useMemo(() => {
    if (!families) return [];
    
    return families?.filter(family => {
      const matchesSearch = 
        family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        typeFilter === "all" || family.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [families, searchQuery, typeFilter]);

  // Get link path for a family
  const getFamilyPath = (family: { name: string; type: string }) => {
    // First try to match by type
    if (TYPE_TO_GAMME_PATH[family.type]) {
      return TYPE_TO_GAMME_PATH[family.type];
    }
    // Fallback to search by name
    return `/recettes?search=${encodeURIComponent(family.name)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Familles Olfactives
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Les familles olfactives constituent les grandes catégories conceptuelles du projet PERFUMUM. Chaque famille regroupe des accords et variations explorant une dimension sensible spécifique.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/recettes">
                  <Button size="lg">
                    Explorer les recettes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/gammes">
                  <Button size="lg" variant="outline">
                    Voir les gammes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher une famille..."
                  />
                </div>
                <FilterSelect
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={types}
                  placeholder="Type de famille"
                />
              </div>
              
              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredFamilies.length} famille{filteredFamilies.length > 1 ? "s" : ""} trouvée{filteredFamilies.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </section>

        {/* Families List */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFamilies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune famille trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredFamilies.map((family) => (
                    <Link key={family.id} href={getFamilyPath(family)}>
                      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-2xl group-hover:text-primary transition-colors flex items-center gap-2">
                              {family.name}
                              <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                            <div className="flex gap-2 shrink-0">
                              <Badge variant="outline">
                                {TYPE_LABELS[family.type] || family.type}
                              </Badge>
                              {family.variationCount && family.variationCount > 0 && (
                                <Badge variant="secondary">
                                  {family.variationCount} variation{family.variationCount > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {family.description && (
                            <p className="text-muted-foreground leading-relaxed">
                              {family.description}
                            </p>
                          )}
                          <div className="pt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <Search className="h-4 w-4 mr-2" />
                            Voir les recettes de cette famille
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
