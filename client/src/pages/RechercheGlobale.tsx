import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Search, 
  FlaskConical, 
  Beaker, 
  Leaf, 
  Music, 
  FileText, 
  Globe, 
  BookOpen,
  Sparkles,
  Wind,
  TreeDeciduous,
  Droplets,
  Flame,
  ArrowRight,
  Loader2
} from "lucide-react";

// Type icons mapping
const typeIcons: Record<string, React.ReactNode> = {
  molecule: <FlaskConical className="w-4 h-4" />,
  recette: <Beaker className="w-4 h-4" />,
  plant: <Leaf className="w-4 h-4" />,
  accord: <Music className="w-4 h-4" />,
  terpProfile: <FileText className="w-4 h-4" />,
  finalRecipe: <Droplets className="w-4 h-4" />,
  civilisation: <Globe className="w-4 h-4" />,
  prototype: <Sparkles className="w-4 h-4" />,
  glossary: <BookOpen className="w-4 h-4" />,
};

// Type labels mapping
const typeLabels: Record<string, string> = {
  molecule: "Molécule",
  recette: "Recette",
  plant: "Plante",
  accord: "Accord",
  terpProfile: "TerpProfile",
  finalRecipe: "Recette Finale",
  civilisation: "Civilisation",
  prototype: "Prototype",
  glossary: "Glossaire",
};

// Type colors mapping
const typeColors: Record<string, string> = {
  molecule: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  recette: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  plant: "bg-green-500/20 text-green-400 border-green-500/30",
  accord: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  terpProfile: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  finalRecipe: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  civilisation: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  prototype: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  glossary: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

// Link paths mapping
const typePaths: Record<string, (id: number) => string> = {
  molecule: (id) => `/molecules/${id}`,
  recette: (id) => `/recettes/${id}`,
  plant: (id) => `/plants/${id}`,
  accord: (id) => `/accords`,
  terpProfile: (id) => `/terp-profiles/${id}`,
  finalRecipe: (id) => `/final-recipes/${id}`,
  civilisation: (id) => `/civilisations/${id}`,
  prototype: (id) => `/prototypes`,
  glossary: (id) => `/glossaire`,
};

interface SearchResult {
  type: string;
  id: number;
  name: string;
  description?: string | null;
  metadata?: Record<string, any>;
}

function ResultCard({ result }: { result: SearchResult }) {
  const icon = typeIcons[result.type] || <FileText className="w-4 h-4" />;
  const label = typeLabels[result.type] || result.type;
  const color = typeColors[result.type] || "bg-gray-500/20 text-gray-400";
  const path = typePaths[result.type]?.(result.id) || "#";

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30 bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`${color} flex items-center gap-1 text-xs`}>
                {icon}
                {label}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {result.name}
            </h3>
            {result.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {result.description}
              </p>
            )}
            {result.metadata && Object.keys(result.metadata).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(result.metadata)
                  .filter(([_, v]) => v)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <span key={key} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                      {String(value)}
                    </span>
                  ))}
              </div>
            )}
          </div>
          <Link href={path}>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultSection({ 
  title, 
  results, 
  icon,
  emptyMessage = "Aucun résultat"
}: { 
  title: string; 
  results: SearchResult[];
  icon: React.ReactNode;
  emptyMessage?: string;
}) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{title}</span>
        <Badge variant="secondary" className="text-xs">{results.length}</Badge>
      </div>
      <div className="grid gap-3">
        {results.map((result) => (
          <ResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  );
}

export default function RechercheGlobale() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Debounce search query
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery, limit: 100 },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Combine all results for "all" tab
  const allResults = useMemo(() => {
    if (!searchResults) return [];
    return [
      ...searchResults?.molecules,
      ...searchResults?.recettes,
      ...searchResults?.plants,
      ...searchResults?.accords,
      ...searchResults?.terpProfiles,
      ...searchResults?.finalRecipes,
      ...searchResults?.civilisations,
      ...searchResults?.prototypes,
      ...searchResults?.glossary,
    ];
  }, [searchResults]);

  // Count by category
  const counts = useMemo(() => {
    if (!searchResults) return {};
    return {
      all: searchResults?.total,
      molecules: searchResults?.molecules.length,
      recettes: searchResults?.recettes.length,
      plants: searchResults?.plants.length,
      accords: searchResults?.accords.length,
      terpProfiles: searchResults?.terpProfiles.length,
      finalRecipes: searchResults?.finalRecipes.length,
      civilisations: searchResults?.civilisations.length,
      prototypes: searchResults?.prototypes.length,
      glossary: searchResults?.glossary.length,
    };
  }, [searchResults]);

  return (
    <>
      <Header />
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Recherche Globale
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recherchez dans l'ensemble de la base de données PERFUMUM : molécules, recettes, plantes, accords, civilisations et plus encore.
          </p>
        </div>

        {/* Search Input */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, formule, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
                autoFocus
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
              )}
            </div>
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Entrez au moins 2 caractères pour lancer la recherche
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {debouncedQuery.length >= 2 && (
          <div className="space-y-6">
            {/* Results summary */}
            {searchResults && (
              <div className="text-center">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{searchResults?.total}</span> résultat{searchResults?.total !== 1 ? 's' : ''} pour "{debouncedQuery}"
                </p>
              </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
                <TabsTrigger value="all" className="flex items-center gap-1">
                  Tous
                  {counts.all !== undefined && <Badge variant="secondary" className="text-xs ml-1">{counts.all}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="molecules" className="flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" />
                  Molécules
                  {counts.molecules !== undefined && counts.molecules > 0 && <Badge variant="secondary" className="text-xs ml-1">{counts.molecules}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="recettes" className="flex items-center gap-1">
                  <Beaker className="w-3 h-3" />
                  Recettes
                  {counts.recettes !== undefined && counts.recettes > 0 && <Badge variant="secondary" className="text-xs ml-1">{counts.recettes}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="plants" className="flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  Plantes
                  {counts.plants !== undefined && counts.plants > 0 && <Badge variant="secondary" className="text-xs ml-1">{counts.plants}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="accords" className="flex items-center gap-1">
                  <Music className="w-3 h-3" />
                  Accords
                  {counts.accords !== undefined && counts.accords > 0 && <Badge variant="secondary" className="text-xs ml-1">{counts.accords}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="terpProfiles" className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  TerpProfiles
                  {counts.terpProfiles !== undefined && counts.terpProfiles > 0 && <Badge variant="secondary" className="text-xs ml-1">{counts.terpProfiles}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="finalRecipes" className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  Recettes Finales
                  {counts.finalRecipes !== undefined && counts.finalRecipes > 0 && <Badge variant="secondary" className="text-xs ml-1">{counts.finalRecipes}</Badge>}
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="all" className="mt-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : allResults.length === 0 ? (
                    <Card className="bg-card/50">
                      <CardContent className="py-12 text-center">
                        <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">Aucun résultat trouvé pour "{debouncedQuery}"</p>
                        <p className="text-sm text-muted-foreground mt-2">Essayez avec d'autres termes de recherche</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-8 pr-4">
                        {searchResults?.molecules && searchResults?.molecules.length > 0 && (
                          <ResultSection 
                            title="Molécules" 
                            results={searchResults?.molecules}
                            icon={<FlaskConical className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.recettes && searchResults?.recettes.length > 0 && (
                          <ResultSection 
                            title="Recettes" 
                            results={searchResults?.recettes}
                            icon={<Beaker className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.plants && searchResults?.plants.length > 0 && (
                          <ResultSection 
                            title="Plantes" 
                            results={searchResults?.plants}
                            icon={<Leaf className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.accords && searchResults?.accords.length > 0 && (
                          <ResultSection 
                            title="Accords" 
                            results={searchResults?.accords}
                            icon={<Music className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.terpProfiles && searchResults?.terpProfiles.length > 0 && (
                          <ResultSection 
                            title="TerpProfiles" 
                            results={searchResults?.terpProfiles}
                            icon={<FileText className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.finalRecipes && searchResults?.finalRecipes.length > 0 && (
                          <ResultSection 
                            title="Recettes Finales" 
                            results={searchResults?.finalRecipes}
                            icon={<Droplets className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.civilisations && searchResults?.civilisations.length > 0 && (
                          <ResultSection 
                            title="Civilisations" 
                            results={searchResults?.civilisations}
                            icon={<Globe className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.prototypes && searchResults?.prototypes.length > 0 && (
                          <ResultSection 
                            title="Prototypes" 
                            results={searchResults?.prototypes}
                            icon={<Sparkles className="w-4 h-4" />}
                          />
                        )}
                        {searchResults?.glossary && searchResults?.glossary.length > 0 && (
                          <ResultSection 
                            title="Glossaire" 
                            results={searchResults?.glossary}
                            icon={<BookOpen className="w-4 h-4" />}
                          />
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="molecules" className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <ResultSection 
                      title="Molécules" 
                      results={searchResults?.molecules || []}
                      icon={<FlaskConical className="w-4 h-4" />}
                      emptyMessage="Aucune molécule trouvée"
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="recettes" className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <ResultSection 
                      title="Recettes" 
                      results={searchResults?.recettes || []}
                      icon={<Beaker className="w-4 h-4" />}
                      emptyMessage="Aucune recette trouvée"
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="plants" className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <ResultSection 
                      title="Plantes" 
                      results={searchResults?.plants || []}
                      icon={<Leaf className="w-4 h-4" />}
                      emptyMessage="Aucune plante trouvée"
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="accords" className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <ResultSection 
                      title="Accords" 
                      results={searchResults?.accords || []}
                      icon={<Music className="w-4 h-4" />}
                      emptyMessage="Aucun accord trouvé"
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="terpProfiles" className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <ResultSection 
                      title="TerpProfiles" 
                      results={searchResults?.terpProfiles || []}
                      icon={<FileText className="w-4 h-4" />}
                      emptyMessage="Aucun TerpProfile trouvé"
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="finalRecipes" className="mt-0">
                  <ScrollArea className="h-[60vh]">
                    <ResultSection 
                      title="Recettes Finales" 
                      results={searchResults?.finalRecipes || []}
                      icon={<Droplets className="w-4 h-4" />}
                      emptyMessage="Aucune recette finale trouvée"
                    />
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        {/* Empty state when no search */}
        {debouncedQuery.length < 2 && (
          <Card className="bg-card/50">
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-xl font-semibold mb-2">Commencez votre recherche</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Entrez un terme de recherche pour explorer les molécules, recettes, plantes, accords et autres entités de la base de données PERFUMUM.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery("limonène")}>
                  limonène
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery("lavande")}>
                  lavande
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery("bois")}>
                  bois
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery("vent")}>
                  vent
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery("colombie")}>
                  colombie
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
}
