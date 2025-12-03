import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Beaker, Atom, BookOpen, Calendar, Sparkles, Book, X, History, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Recherche() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Multi-criteria filters
  const [filters, setFilters] = useState({
    prototypes: true,
    molecules: true,
    recipes: true,
    glossary: true,
    timeline: true,
    accords: true,
    civilisations: true,
  });

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("perfumum_search_history");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Save search to history
  const saveToHistory = (searchQuery: string) => {
    if (searchQuery.length < 2) return;
    
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem("perfumum_search_history", JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("perfumum_search_history");
  };

  // Debounce search
  const handleSearch = (value: string) => {
    setQuery(value);
    setTimeout(() => {
      setDebouncedQuery(value);
      if (value.length >= 2) {
        saveToHistory(value);
      }
    }, 300);
  };

  const { data: results, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Filter results based on selected filters
  const filteredResults = results ? {
    prototypes: filters.prototypes ? results.prototypes : [],
    molecules: filters.molecules ? results.molecules : [],
    recipes: filters.recipes ? results.recipes : [],
    glossary: filters.glossary ? results.glossary : [],
    timeline: filters.timeline ? results.timeline : [],
    accords: filters.accords ? results.accords : [],
    total: 
      (filters.prototypes ? results.prototypes.length : 0) +
      (filters.molecules ? results.molecules.length : 0) +
      (filters.recipes ? results.recipes.length : 0) +
      (filters.glossary ? results.glossary.length : 0) +
      (filters.timeline ? results.timeline.length : 0) +
      (filters.accords ? results.accords.length : 0),
  } : null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prototype":
        return <Beaker className="h-4 w-4" />;
      case "molecule":
        return <Atom className="h-4 w-4" />;
      case "recipe":
        return <Book className="h-4 w-4" />;
      case "glossary":
        return <BookOpen className="h-4 w-4" />;
      case "timeline":
        return <Calendar className="h-4 w-4" />;
      case "accord":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      prototype: "Prototype",
      molecule: "Molécule",
      recipe: "Recette",
      glossary: "Glossaire",
      timeline: "Timeline",
      accord: "Accord",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      prototype: "bg-purple-100 text-purple-700",
      molecule: "bg-blue-100 text-blue-700",
      recipe: "bg-green-100 text-green-700",
      glossary: "bg-yellow-100 text-yellow-700",
      timeline: "bg-orange-100 text-orange-700",
      accord: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getResultLink = (type: string, id: number) => {
    const links: Record<string, string> = {
      prototype: `/prototypes/${id}`,
      molecule: `/molecule/${id}`,
      recipe: `/recette/${id}`,
      glossary: `/glossaire#${id}`,
      timeline: `/timeline#${id}`,
      accord: `/experimental-accords#${id}`,
    };
    return links[type] || "#";
  };

  const toggleAllFilters = (value: boolean) => {
    setFilters({
      prototypes: value,
      molecules: value,
      recipes: value,
      glossary: value,
      timeline: value,
      accords: value,
      civilisations: value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Recherche Avancée</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez l'ensemble de la base de données PERFUMUM avec filtres multi-critères, auto-complétion et historique de recherche
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtres
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all"
                        checked={Object.values(filters).every(v => v)}
                        onCheckedChange={(checked) => toggleAllFilters(checked as boolean)}
                      />
                      <label htmlFor="all" className="text-sm font-semibold cursor-pointer">
                        Tout sélectionner
                      </label>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      {Object.entries(filters).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) => setFilters({ ...filters, [key]: checked as boolean })}
                          />
                          <label htmlFor={key} className="text-sm cursor-pointer capitalize">
                            {key === "prototypes" && "Prototypes"}
                            {key === "molecules" && "Molécules"}
                            {key === "recipes" && "Recettes"}
                            {key === "glossary" && "Glossaire"}
                            {key === "timeline" && "Timeline"}
                            {key === "accords" && "Accords"}
                            {key === "civilisations" && "Civilisations"}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Historique
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearHistory}
                          className="h-6 text-xs"
                        >
                          Effacer
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.slice(0, 5).map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(item)}
                            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-1 rounded transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {/* Search Input */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher dans toute la base de données..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-14 text-lg"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      setQuery("");
                      setDebouncedQuery("");
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Results */}
              {query.length < 2 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Entrez au moins 2 caractères pour lancer la recherche
                  </p>
                  {searchHistory.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-3">Recherches récentes :</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {searchHistory.slice(0, 5).map((item, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                            onClick={() => handleSearch(item)}
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isLoading && query.length >= 2 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Recherche en cours...</p>
                </div>
              )}

              {filteredResults && query.length >= 2 && !isLoading && (
                <div className="space-y-8">
                  {/* Stats */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <p className="text-sm text-muted-foreground">
                      {filteredResults.total} résultat{filteredResults.total > 1 ? "s" : ""} trouvé{filteredResults.total > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filteredResults.prototypes.length > 0 && (
                        <Badge variant="secondary">{filteredResults.prototypes.length} Prototypes</Badge>
                      )}
                      {filteredResults.molecules.length > 0 && (
                        <Badge variant="secondary">{filteredResults.molecules.length} Molécules</Badge>
                      )}
                      {filteredResults.recipes.length > 0 && (
                        <Badge variant="secondary">{filteredResults.recipes.length} Recettes</Badge>
                      )}
                      {filteredResults.glossary.length > 0 && (
                        <Badge variant="secondary">{filteredResults.glossary.length} Termes</Badge>
                      )}
                      {filteredResults.timeline.length > 0 && (
                        <Badge variant="secondary">{filteredResults.timeline.length} Jalons</Badge>
                      )}
                      {filteredResults.accords.length > 0 && (
                        <Badge variant="secondary">{filteredResults.accords.length} Accords</Badge>
                      )}
                    </div>
                  </div>

                  {/* No results */}
                  {filteredResults.total === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Aucun résultat trouvé pour "{query}"
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Essayez de modifier vos filtres ou votre recherche
                      </p>
                    </div>
                  )}

                  {/* Results by type */}
                  {[
                    { key: "prototypes", label: "Prototypes", data: filteredResults.prototypes },
                    { key: "molecules", label: "Molécules", data: filteredResults.molecules },
                    { key: "recipes", label: "Recettes", data: filteredResults.recipes },
                    { key: "glossary", label: "Glossaire", data: filteredResults.glossary },
                    { key: "timeline", label: "Timeline", data: filteredResults.timeline },
                    { key: "accords", label: "Accords Expérimentaux", data: filteredResults.accords },
                  ].map(
                    (section) =>
                      section.data.length > 0 && (
                        <div key={section.key}>
                          <h2 className="text-2xl font-bold mb-4">{section.label}</h2>
                          <div className="grid gap-4">
                            {section.data.map((result: any) => (
                              <Link key={result.id} href={getResultLink(result.type, result.id)}>
                                <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer">
                                  <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          {getTypeIcon(result.type)}
                                          <CardTitle className="text-lg">{result.title}</CardTitle>
                                        </div>
                                        {result.subtitle && (
                                          <CardDescription className="text-sm">
                                            {result.subtitle}
                                          </CardDescription>
                                        )}
                                      </div>
                                      <Badge className={getTypeColor(result.type)}>
                                        {getTypeLabel(result.type)}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  {result.description && (
                                    <CardContent>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {result.description}
                                      </p>
                                    </CardContent>
                                  )}
                                </Card>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
