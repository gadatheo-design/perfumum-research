/**
 * PerceptSearch - Page de recherche par percept olfactif
 * 
 * Permet de rechercher des molécules par descripteur olfactif (citrus, floral, woody, etc.)
 * Utilise les données Flavornet enrichies dans la base de données
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Flower2, 
  TreePine, 
  Citrus, 
  Leaf, 
  Sparkles,
  Flame,
  Wind,
  Droplets,
  Cherry,
  Cookie,
  Loader2,
  ArrowRight,
  X
} from "lucide-react";

// Catégories de percepts avec icônes
const PERCEPT_CATEGORIES = {
  floral: { label: 'Floral', icon: Flower2, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  woody: { label: 'Boisé', icon: TreePine, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  citrus: { label: 'Agrumes', icon: Citrus, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  green: { label: 'Vert', icon: Leaf, color: 'bg-green-100 text-green-700 border-green-200' },
  spicy: { label: 'Épicé', icon: Flame, color: 'bg-red-100 text-red-700 border-red-200' },
  fresh: { label: 'Frais', icon: Wind, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  sweet: { label: 'Sucré', icon: Cookie, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  fruity: { label: 'Fruité', icon: Cherry, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  aquatic: { label: 'Aquatique', icon: Droplets, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  musk: { label: 'Musqué', icon: Sparkles, color: 'bg-purple-100 text-purple-700 border-purple-200' },
};

// Mapping des percepts anglais vers catégories
const PERCEPT_TO_CATEGORY: Record<string, keyof typeof PERCEPT_CATEGORIES> = {
  'floral': 'floral', 'rose': 'floral', 'jasmine': 'floral', 'lily': 'floral', 'violet': 'floral', 'flower': 'floral', 'lilac': 'floral',
  'woody': 'woody', 'cedar': 'woody', 'pine': 'woody', 'sandalwood': 'woody', 'wood': 'woody', 'balsamic': 'woody', 'resinous': 'woody',
  'citrus': 'citrus', 'lemon': 'citrus', 'orange': 'citrus', 'bergamot': 'citrus', 'grapefruit': 'citrus', 'lime': 'citrus',
  'green': 'green', 'grass': 'green', 'leafy': 'green', 'herbal': 'green', 'tea': 'green',
  'spicy': 'spicy', 'clove': 'spicy', 'cinnamon': 'spicy', 'pepper': 'spicy', 'ginger': 'spicy', 'nutmeg': 'spicy',
  'fresh': 'fresh', 'cool': 'fresh', 'mint': 'fresh', 'eucalyptus': 'fresh', 'camphor': 'fresh', 'menthol': 'fresh',
  'sweet': 'sweet', 'vanilla': 'sweet', 'caramel': 'sweet', 'honey': 'sweet', 'sugar': 'sweet', 'creamy': 'sweet',
  'fruity': 'fruity', 'apple': 'fruity', 'peach': 'fruity', 'banana': 'fruity', 'pear': 'fruity', 'berry': 'fruity', 'strawberry': 'fruity', 'raspberry': 'fruity', 'coconut': 'fruity',
  'aquatic': 'aquatic', 'marine': 'aquatic', 'oceanic': 'aquatic', 'watery': 'aquatic', 'ozone': 'aquatic',
  'musk': 'musk', 'musky': 'musk', 'animal': 'musk', 'powdery': 'musk', 'amber': 'musk',
};

function getPerceptCategory(percept: string): keyof typeof PERCEPT_CATEGORIES | null {
  const lower = percept.toLowerCase();
  return PERCEPT_TO_CATEGORY[lower] || null;
}

export default function PerceptSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPercept, setSelectedPercept] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Récupérer tous les percepts disponibles
  const { data: allPercepts, isLoading: loadingPercepts } = trpc.flavornet.getAllPercepts.useQuery();
  
  // Récupérer les statistiques Flavornet
  const { data: stats } = trpc.flavornet.getStats.useQuery();
  
  // Récupérer les statistiques d'enrichissement
  const { data: enrichmentStats } = trpc.flavornet.getEnrichmentStats.useQuery();

  // Rechercher les molécules par percept
  const { data: searchResults, isLoading: loadingSearch } = trpc.flavornet.searchByPercept.useQuery(
    { percept: selectedPercept || "" },
    { enabled: !!selectedPercept }
  );

  // Récupérer les molécules enrichies avec percepts
  const { data: moleculesWithPercepts } = trpc.flavornet.getMoleculesWithPercepts.useQuery(
    { limit: 100, offset: 0 }
  );

  // Filtrer les percepts par recherche et catégorie
  const filteredPercepts = useMemo(() => {
    if (!allPercepts) return [];
    let filtered = allPercepts;
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => {
        const cat = getPerceptCategory(p);
        return cat === selectedCategory;
      });
    }
    
    return filtered;
  }, [allPercepts, searchQuery, selectedCategory]);

  // Grouper les percepts par catégorie
  const perceptsByCategory = useMemo(() => {
    if (!allPercepts) return {};
    const grouped: Record<string, string[]> = {};
    
    for (const percept of allPercepts) {
      const category = getPerceptCategory(percept) || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(percept);
    }
    
    return grouped;
  }, [allPercepts]);

  return (
    <div className="container py-8">
      <Breadcrumbs
        customItems={[
          { label: "Accueil", path: "/" },
          { label: "Analyse", path: "/analysis-hub" },
          { label: "Recherche par Percept" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recherche par Percept Olfactif</h1>
        <p className="text-muted-foreground">
          Explorez les molécules par leurs descripteurs olfactifs (citrus, floral, woody, etc.)
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Base Flavornet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCompounds || 0}</div>
            <p className="text-xs text-muted-foreground">composés référencés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Molécules enrichies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrichmentStats?.enriched || 0}</div>
            <p className="text-xs text-muted-foreground">sur {enrichmentStats?.total || 0} ({enrichmentStats?.percentage || 0}%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Percepts uniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPercepts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">descripteurs olfactifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avec indices Kovats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrichmentStats?.withKovatsRI || 0}</div>
            <p className="text-xs text-muted-foreground">pour la chromatographie</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Parcourir par catégorie</TabsTrigger>
          <TabsTrigger value="search">Recherche libre</TabsTrigger>
          <TabsTrigger value="molecules">Molécules enrichies</TabsTrigger>
        </TabsList>

        {/* Onglet Parcourir */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Tous
            </Button>
            {Object.entries(PERCEPT_CATEGORIES).map(([key, { label, icon: Icon, color }]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                className={selectedCategory === key ? "" : color}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Grille de percepts par catégorie */}
          {loadingPercepts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(PERCEPT_CATEGORIES)
                .filter(([key]) => !selectedCategory || selectedCategory === key)
                .map(([key, { label, icon: Icon, color }]) => {
                  const percepts = perceptsByCategory[key] || [];
                  if (percepts.length === 0) return null;
                  
                  return (
                    <Card key={key} className="overflow-hidden">
                      <CardHeader className={`${color} border-b`}>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          {label}
                        </CardTitle>
                        <CardDescription className="text-current/70">
                          {percepts.length} descripteurs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-2">
                          {percepts.slice(0, 12).map(percept => (
                            <Badge
                              key={percept}
                              variant="outline"
                              className={`cursor-pointer hover:bg-accent ${selectedPercept === percept ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => setSelectedPercept(selectedPercept === percept ? null : percept)}
                            >
                              {percept}
                            </Badge>
                          ))}
                          {percepts.length > 12 && (
                            <Badge variant="secondary">+{percepts.length - 12}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </TabsContent>

        {/* Onglet Recherche */}
        <TabsContent value="search" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un percept (ex: citrus, floral, woody...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Liste des percepts filtrés */}
          <div className="flex flex-wrap gap-2">
            {filteredPercepts.map(percept => {
              const category = getPerceptCategory(percept);
              const categoryConfig = category ? PERCEPT_CATEGORIES[category] : null;
              
              return (
                <Badge
                  key={percept}
                  variant="outline"
                  className={`cursor-pointer hover:bg-accent ${categoryConfig?.color || ''} ${selectedPercept === percept ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPercept(selectedPercept === percept ? null : percept)}
                >
                  {percept}
                </Badge>
              );
            })}
          </div>
        </TabsContent>

        {/* Onglet Molécules enrichies */}
        <TabsContent value="molecules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Molécules avec données Flavornet</CardTitle>
              <CardDescription>
                Molécules enrichies avec des descripteurs olfactifs et indices de rétention Kovats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moleculesWithPercepts?.map(mol => (
                  <div key={mol.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                    <div>
                      <Link href={`/molecule/${mol.id}`}>
                        <span className="font-medium hover:underline cursor-pointer">{mol.name}</span>
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mol.percepts?.slice(0, 5).map((p: string) => (
                          <Badge key={p} variant="secondary" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                        {mol.percepts && mol.percepts.length > 5 && (
                          <Badge variant="outline" className="text-xs">+{mol.percepts.length - 5}</Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/molecule/${mol.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Résultats de recherche par percept */}
      {selectedPercept && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Molécules avec le percept "{selectedPercept}"</CardTitle>
                <CardDescription>
                  {loadingSearch ? "Recherche en cours..." : `${searchResults?.length || 0} résultats trouvés`}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPercept(null)}>
                <X className="w-4 h-4 mr-1" />
                Fermer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSearch ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchResults && searchResults?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults?.map((result: any) => (
                  <Link key={result.casNumber} href={`/molecules?search=${encodeURIComponent(result.name)}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{result.name}</CardTitle>
                        <CardDescription className="text-xs">CAS: {result.casNumber}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {result.percepts?.map((p: string) => (
                            <Badge 
                              key={p} 
                              variant={p === selectedPercept ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                        {result.kovatsRI && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Kovats RI: {Object.entries(result.kovatsRI).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucune molécule trouvée avec ce percept dans la base Flavornet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
