import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Layers } from "lucide-react";
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

export default function FamillesList() {
  const { data: families, isLoading } = trpc.families.list.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Extract unique types for filter
  const types = useMemo(() => {
    if (!families) return [];
    const uniqueTypes = new Set(families.map(f => f.type));
    return Array.from(uniqueTypes).map(t => ({ 
      value: t, 
      label: TYPE_LABELS[t] || t 
    }));
  }, [families]);

  // Filter families
  const filteredFamilies = useMemo(() => {
    if (!families) return [];
    
    return families.filter(family => {
      const matchesSearch = 
        family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        typeFilter === "all" || family.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [families, searchQuery, typeFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Les familles olfactives constituent les grandes catégories conceptuelles du projet PERFUMUM. Chaque famille regroupe des accords et variations explorant une dimension sensible spécifique.
              </p>
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
                    <Card key={family.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-2xl">{family.name}</CardTitle>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>
    <Footer />

    </div>
  );
}
