import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Beaker, Atom, BookOpen, Calendar, Sparkles, Book } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Recherche() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  const handleSearch = (value: string) => {
    setQuery(value);
    setTimeout(() => setDebouncedQuery(value), 300);
  };

  const { data: results, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

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
      molecule: `/molecules/${id}`,
      recipe: `/recettes/${id}`,
      glossary: `/glossaire#${id}`,
      timeline: `/timeline#${id}`,
      accord: `/experimental-accords#${id}`,
    };
    return links[type] || "#";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Recherche Globale</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez l'ensemble de la base de données PERFUMUM : prototypes, molécules, recettes, glossaire, timeline et accords expérimentaux
            </p>
          </div>

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
          </div>

          {/* Results */}
          {query.length < 2 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Entrez au moins 2 caractères pour lancer la recherche
              </p>
            </div>
          )}

          {isLoading && query.length >= 2 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Recherche en cours...</p>
            </div>
          )}

          {results && query.length >= 2 && !isLoading && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="flex items-center justify-between pb-4 border-b">
                <p className="text-sm text-muted-foreground">
                  {results.total} résultat{results.total > 1 ? "s" : ""} trouvé{results.total > 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  {results.prototypes.length > 0 && (
                    <Badge variant="secondary">{results.prototypes.length} Prototypes</Badge>
                  )}
                  {results.molecules.length > 0 && (
                    <Badge variant="secondary">{results.molecules.length} Molécules</Badge>
                  )}
                  {results.recipes.length > 0 && (
                    <Badge variant="secondary">{results.recipes.length} Recettes</Badge>
                  )}
                  {results.glossary.length > 0 && (
                    <Badge variant="secondary">{results.glossary.length} Termes</Badge>
                  )}
                  {results.timeline.length > 0 && (
                    <Badge variant="secondary">{results.timeline.length} Jalons</Badge>
                  )}
                  {results.accords.length > 0 && (
                    <Badge variant="secondary">{results.accords.length} Accords</Badge>
                  )}
                </div>
              </div>

              {/* Results by type */}
              {[
                { key: "prototypes", label: "Prototypes", data: results.prototypes },
                { key: "molecules", label: "Molécules", data: results.molecules },
                { key: "recipes", label: "Recettes", data: results.recipes },
                { key: "glossary", label: "Glossaire", data: results.glossary },
                { key: "timeline", label: "Timeline", data: results.timeline },
                { key: "accords", label: "Accords Expérimentaux", data: results.accords },
              ].map(
                (section) =>
                  section.data.length > 0 && (
                    <div key={section.key}>
                      <h2 className="text-2xl font-bold mb-4">{section.label}</h2>
                      <div className="grid gap-4">
                        {section.data.map((result: any) => (
                          <Link key={result.id} href={getResultLink(result.type, result.id)}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
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

              {results.total === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Aucun résultat trouvé pour "{query}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
