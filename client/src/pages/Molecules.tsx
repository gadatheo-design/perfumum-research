import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";

export default function Molecules() {
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");

  // Extract unique families for filter
  const families = useMemo(() => {
    if (!molecules) return [];
    const uniqueFamilies = new Set(molecules.map(m => m.family).filter(Boolean));
    return Array.from(uniqueFamilies).map(f => ({ value: f!, label: f! }));
  }, [molecules]);

  // Filter molecules
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    
    return molecules.filter(molecule => {
      const matchesSearch = 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.emotionalResonance?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFamily = 
        familyFilter === "all" || molecule.family === familyFilter;
      
      return matchesSearch && matchesFamily;
    });
  }, [molecules, searchQuery, familyFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Atom className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Molécules
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Catalogue des molécules olfactives étudiées dans le cadre de la recherche PERFUMUM. Chaque molécule est documentée avec son profil olfactif, sa résonance émotionnelle et ses propriétés fonctionnelles.
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
                    placeholder="Rechercher une molécule..."
                  />
                </div>
                <FilterSelect
                  value={familyFilter}
                  onChange={setFamilyFilter}
                  options={families}
                  placeholder="Famille chimique"
                />
              </div>
              
              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredMolecules.length} molécule{filteredMolecules.length > 1 ? "s" : ""} trouvée{filteredMolecules.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </section>

        {/* Molecules List */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMolecules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune molécule trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMolecules.map((molecule) => (
                    <Card key={molecule.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-xl">{molecule.name}</CardTitle>
                          {molecule.family && (
                            <Badge variant="outline" className="shrink-0">
                              {molecule.family}
                            </Badge>
                          )}
                        </div>
                        {molecule.chemicalFormula && (
                          <p className="text-sm font-mono text-muted-foreground">
                            {molecule.chemicalFormula}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {molecule.olfactiveProfile && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Profil Olfactif</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.olfactiveProfile}
                            </p>
                          </div>
                        )}
                        
                        {molecule.emotionalResonance && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Résonance Émotionnelle</h4>
                            <p className="text-sm text-muted-foreground italic">
                              {molecule.emotionalResonance}
                            </p>
                          </div>
                        )}
                        
                        {molecule.functionalEffect && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Effet Fonctionnel</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.functionalEffect}
                            </p>
                          </div>
                        )}
                        
                        {molecule.sourceOrigin && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Origine</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.sourceOrigin}
                            </p>
                          </div>
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
    </div>
  );
}
