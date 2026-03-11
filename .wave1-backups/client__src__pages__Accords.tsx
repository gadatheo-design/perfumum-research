// @ts-nocheck
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, ChevronRight, Search, ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";

const TEXTURE_LABELS: Record<string, string> = {
  sec: "Sec",
  humide: "Humide",
  lactone: "Lactone",
  resine: "Résine",
  pierre: "Pierre",
  air: "Air",
};

export default function Accords() {
  const { data: accords, isLoading } = trpc.accords.list.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [textureFilter, setTextureFilter] = useState("all");

  // Extract unique textures for filter
  const textures = useMemo(() => {
    if (!accords) return [];
    const uniqueTextures = new Set(accords.map(a => a.texture).filter(Boolean));
    return Array.from(uniqueTextures).map(t => ({ 
      value: t!, 
      label: TEXTURE_LABELS[t!] || t! 
    }));
  }, [accords]);

  // Filter accords
  const filteredAccords = useMemo(() => {
    if (!accords) return [];
    
    return accords.filter(accord => {
      const matchesSearch = 
        accord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.emotionalResonance?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTexture = 
        textureFilter === "all" || accord.texture === textureFilter;
      
      return matchesSearch && matchesTexture;
    });
  }, [accords, searchQuery, textureFilter]);

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
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Accords Olfactifs
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Les accords constituent les unités compositionnelles du projet PERFUMUM. Chaque accord articule plusieurs molécules pour créer une atmosphère olfactive cohérente et évocatrice.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/recettes">
                  <Button size="lg">
                    Voir les recettes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/molecules">
                  <Button size="lg" variant="outline">
                    Explorer les molécules
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
                    placeholder="Rechercher un accord..."
                  />
                </div>
                <FilterSelect
                  value={textureFilter}
                  onChange={setTextureFilter}
                  options={textures}
                  placeholder="Texture"
                />
              </div>
              
              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredAccords.length} accord{filteredAccords.length > 1 ? "s" : ""} trouvé{filteredAccords.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </section>

        {/* Accords List */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAccords.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun accord trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAccords.map((accord) => (
                    <Link key={accord.id} href={`/recettes?search=${encodeURIComponent(accord.name)}`}>
                      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                              {accord.name}
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                            {accord.texture && (
                              <Badge variant="outline" className="shrink-0">
                                {TEXTURE_LABELS[accord.texture] || accord.texture}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {accord.olfactiveProfile && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Profil Olfactif</h4>
                              <p className="text-sm text-muted-foreground">
                                {accord.olfactiveProfile}
                              </p>
                            </div>
                          )}
                          
                          {accord.emotionalResonance && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Résonance Émotionnelle</h4>
                              <p className="text-sm text-muted-foreground italic">
                                {accord.emotionalResonance}
                              </p>
                            </div>
                          )}
                          
                          {accord.notes && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Notes</h4>
                              <p className="text-sm text-muted-foreground">
                                {accord.notes}
                              </p>
                            </div>
                          )}
                          
                          <div className="pt-2 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <Search className="h-3 w-3 mr-1" />
                            Voir les recettes avec cet accord
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
