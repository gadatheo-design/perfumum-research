import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  Search, 
  FlaskConical, 
  Beaker, 
  Microscope,
  BookOpen,
  FileText,
  Database,
  ArrowRight,
  Sparkles,
  Loader2,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

type FilterType = "all" | "molecules" | "recettes" | "accords" | "prototypes" | "glossary" | "civilisations";

// Type pour les résultats de recherche globale
interface GlobalSearchResult {
  type: string;
  id: number;
  name: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
}

export default function Recherche() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Recherche globale avec debounce
  const { data: searchResults, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Gérer la recherche
  const handleSearch = () => {
    setDebouncedQuery(searchQuery);
  };

  // Gérer la touche Entrée
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filtrer les résultats par type
  const filteredResults = useMemo(() => {
    if (!searchResults) return null;
    
    if (activeFilter === "all") {
      return searchResults;
    }
    
    return {
      molecules: activeFilter === "molecules" ? searchResults?.molecules : [],
      recettes: activeFilter === "recettes" ? searchResults?.recettes : [],
      accords: activeFilter === "accords" ? searchResults?.accords : [],
      prototypes: activeFilter === "prototypes" ? searchResults?.prototypes : [],
      glossary: activeFilter === "glossary" ? searchResults?.glossary : [],
      civilisations: activeFilter === "civilisations" ? searchResults?.civilisations : [],
      plants: [],
      terpProfiles: [],
      finalRecipes: [],
      total: 0,
    };
  }, [searchResults, activeFilter]);

  // Compter les résultats par type
  const counts = useMemo(() => {
    if (!searchResults) return { all: 0, molecules: 0, recettes: 0, accords: 0, prototypes: 0, glossary: 0, civilisations: 0 };
    
    const molecules = searchResults?.molecules?.length || 0;
    const recettes = searchResults?.recettes?.length || 0;
    const accords = searchResults?.accords?.length || 0;
    const prototypes = searchResults?.prototypes?.length || 0;
    const glossary = searchResults?.glossary?.length || 0;
    const civilisations = searchResults?.civilisations?.length || 0;
    
    return {
      all: molecules + recettes + accords + prototypes + glossary + civilisations,
      molecules,
      recettes,
      accords,
      prototypes,
      glossary,
      civilisations,
    };
  }, [searchResults]);

  const hasResults = debouncedQuery.length >= 2 && searchResults;

  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4" variant="secondary">
          <Search className="h-3 w-3 mr-1" />
          Recherche
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Recherche Globale PERFUMUM
        </h1>
        <p className="text-muted-foreground">
          Recherchez dans toutes les données du projet : molécules, recettes, accords, prototypes, glossaire et civilisations.
        </p>
      </div>

      {/* Barre de recherche */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une molécule, recette, tradition..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSearch} disabled={searchQuery.length < 2}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Rechercher
            </Button>
          </div>
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-sm text-muted-foreground mt-2">
              Entrez au moins 2 caractères pour lancer la recherche.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {hasResults && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Résultats pour "{debouncedQuery}"
            </h2>
            <Badge variant="outline">
              {counts.all} résultat{counts.all > 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Filtres par type */}
          <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterType)} className="mb-6">
            <TabsList className="flex-wrap h-auto gap-2">
              <TabsTrigger value="all" className="gap-2">
                <Filter className="h-3 w-3" />
                Tous ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="molecules" className="gap-2" disabled={counts.molecules === 0}>
                <Beaker className="h-3 w-3" />
                Molécules ({counts.molecules})
              </TabsTrigger>
              <TabsTrigger value="recettes" className="gap-2" disabled={counts.recettes === 0}>
                <FlaskConical className="h-3 w-3" />
                Recettes ({counts.recettes})
              </TabsTrigger>
              <TabsTrigger value="accords" className="gap-2" disabled={counts.accords === 0}>
                <Sparkles className="h-3 w-3" />
                Accords ({counts.accords})
              </TabsTrigger>
              <TabsTrigger value="prototypes" className="gap-2" disabled={counts.prototypes === 0}>
                <FlaskConical className="h-3 w-3" />
                Prototypes ({counts.prototypes})
              </TabsTrigger>
              <TabsTrigger value="glossary" className="gap-2" disabled={counts.glossary === 0}>
                <FileText className="h-3 w-3" />
                Glossaire ({counts.glossary})
              </TabsTrigger>
              <TabsTrigger value="civilisations" className="gap-2" disabled={counts.civilisations === 0}>
                <Database className="h-3 w-3" />
                Civilisations ({counts.civilisations})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Liste des résultats */}
          <div className="space-y-6">
            {/* Molécules */}
            {filteredResults?.molecules && filteredResults.molecules.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-green-600" />
                  Molécules
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.molecules.map((mol: GlobalSearchResult) => (
                    <Link key={mol.id} href={`/molecule/${mol.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{mol.name}</CardTitle>
                          {typeof mol.metadata?.family === 'string' && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              {mol.metadata.family}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {mol.description || "Molécule aromatique"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recettes */}
            {filteredResults?.recettes && filteredResults.recettes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-purple-600" />
                  Recettes
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.recettes.map((rec: GlobalSearchResult) => (
                    <Link key={rec.id} href={`/recette/${rec.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{rec.name}</CardTitle>
                          {typeof rec.metadata?.category === 'string' && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              {rec.metadata.category}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {rec.description || "Formulation olfactive"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Accords */}
            {filteredResults?.accords && filteredResults.accords.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Accords
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.accords.map((acc: GlobalSearchResult) => (
                    <Link key={acc.id} href={`/accord/${acc.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{acc.name}</CardTitle>
                          {typeof acc.metadata?.texture === 'string' && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              {acc.metadata.texture}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {acc.description || "Accord olfactif"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Prototypes */}
            {filteredResults?.prototypes && filteredResults.prototypes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-indigo-600" />
                  Prototypes
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.prototypes.map((proto: GlobalSearchResult) => (
                    <Link key={proto.id} href={`/prototype/${proto.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{proto.name}</CardTitle>
                          {typeof proto.metadata?.code === 'string' && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              {proto.metadata.code}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {proto.description || "Prototype expérimental"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Glossaire */}
            {filteredResults?.glossary && filteredResults.glossary.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Glossaire
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.glossary.map((term: GlobalSearchResult) => (
                    <Card key={term.id} className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{term.name}</CardTitle>
                        {typeof term.metadata?.category === 'string' && (
                          <Badge variant="secondary" className="w-fit text-xs">
                            {term.metadata.category}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {term.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Civilisations */}
            {filteredResults?.civilisations && filteredResults.civilisations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  Civilisations
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.civilisations.map((civ: GlobalSearchResult) => (
                    <Link key={civ.id} href={`/civilisation/${civ.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{civ.name}</CardTitle>
                          {typeof civ.metadata?.region === 'string' && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              {civ.metadata.region}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {civ.description || "Civilisation olfactive"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Aucun résultat */}
            {counts.all === 0 && (
              <Card className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez avec d'autres termes de recherche ou vérifiez l'orthographe.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Axes de recherche (affiché quand pas de recherche active) */}
      {!hasResults && (
        <>
          <h2 className="text-2xl font-bold mb-6">Axes de Recherche</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <FlaskConical className="h-6 w-6 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <CardTitle>Design Terpénique</CardTitle>
                    <CardDescription>176 molécules documentées</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Exploration des profils terpéniques et de leurs interactions synergiques dans le contexte de la formulation olfactive.
                </p>
                <Link href="/molecules">
                  <Button variant="outline" size="sm" className="gap-2">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Beaker className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <CardTitle>Formulation Expérimentale</CardTitle>
                    <CardDescription>213 recettes documentées</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Développement de formulations innovantes basées sur les synergies moléculaires et les traditions olfactives.
                </p>
                <Link href="/recettes">
                  <Button variant="outline" size="sm" className="gap-2">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                    <Microscope className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                  </div>
                  <div>
                    <CardTitle>Recherche Scientifique</CardTitle>
                    <CardDescription>Méthodologies GC-MS & analyses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Protocoles analytiques, modèles de pyrolyse et études de dégradation thermique des composés aromatiques.
                </p>
                <Link href="/recherche-scientifique">
                  <Button variant="outline" size="sm" className="gap-2">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <BookOpen className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <CardTitle>Traditions Olfactives</CardTitle>
                    <CardDescription>Civilisations & patrimoine</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Étude des traditions olfactives à travers les civilisations et leur influence sur la parfumerie contemporaine.
                </p>
                <Link href="/civilisations">
                  <Button variant="outline" size="sm" className="gap-2">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Voir aussi */}
          <VoirAussi
            items={[
              { href: "/recherche-avancee", title: "Recherche Avancée", description: "Filtres multicritères" },
              { href: "/glossaire", title: "Glossaire", description: "Terminologie olfactive" },
              { href: "/statistiques", title: "Statistiques", description: "Données du projet" },
            ]}
          />
        </>
      )}
    </div>
  );
}
