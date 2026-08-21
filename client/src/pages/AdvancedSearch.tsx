import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, History, X, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

interface SearchHistory {
  query: string;
  timestamp: number;
  resultsCount: number;
}

interface RadarFilters {
  intensity: [number, number];
  freshness: [number, number];
  warmth: [number, number];
  sweetness: [number, number];
  spiciness: [number, number];
  earthiness: [number, number];
}

const RADAR_AXES = [
  { key: 'intensity', label: 'Intensité', color: 'hsl(346, 77%, 50%)' },
  { key: 'freshness', label: 'Fraîcheur', color: 'hsl(142, 76%, 36%)' },
  { key: 'warmth', label: 'Chaleur', color: 'hsl(32, 95%, 44%)' },
  { key: 'sweetness', label: 'Douceur', color: 'hsl(217, 91%, 60%)' },
  { key: 'spiciness', label: 'Épicé', color: 'hsl(262, 83%, 58%)' },
  { key: 'earthiness', label: 'Terreux', color: 'hsl(280, 100%, 70%)' },
] as const;

export default function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recettes' | 'molecules' | 'accords'>('recettes');
  const [radarFilters, setRadarFilters] = useState<RadarFilters>({
    intensity: [0, 100],
    freshness: [0, 100],
    warmth: [0, 100],
    sweetness: [0, 100],
    spiciness: [0, 100],
    earthiness: [0, 100],
  });
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('perfumum_search_history');
    if (saved) {
      setSearchHistory(safeJsonParse(saved, []));
    }
  }, []);

  // Sauvegarder l'historique
  const saveToHistory = (query: string, resultsCount: number) => {
    const newHistory = [
      { query, timestamp: Date.now(), resultsCount },
      ...searchHistory.filter(h => h.query !== query).slice(0, 9), // Garder 10 max
    ];
    setSearchHistory(newHistory);
    localStorage.setItem('perfumum_search_history', JSON.stringify(newHistory));
  };

  // Récupérer les données
  const { data: recettesWithRadar = [] } = trpc.recettes.listWithRadar.useQuery();
  const { data: molecules = [] } = trpc.molecules?.list.useQuery();
  const { data: accords = [] } = trpc.accords?.list.useQuery();

  // Fonction de recherche full-text
  const fullTextSearch = (text: string, query: string): boolean => {
    if (!query.trim()) return true;
    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalizedText.includes(normalizedQuery);
  };

  // Filtrer les recettes
  const filteredRecettes = useMemo(() => {
    return recettesWithRadar?.filter(recette => {
      // Recherche full-text
      const matchesQuery = fullTextSearch(
        `${recette.name} ${recette.description || ''} ${recette.ingredients || ''}`,
        searchQuery
      );

      // Filtres radar
      const matchesRadar = 
        recette.avgIntensity >= radarFilters.intensity[0] && recette.avgIntensity <= radarFilters.intensity[1] &&
        recette.avgFreshness >= radarFilters.freshness[0] && recette.avgFreshness <= radarFilters.freshness[1] &&
        recette.avgWarmth >= radarFilters.warmth[0] && recette.avgWarmth <= radarFilters.warmth[1] &&
        recette.avgSweetness >= radarFilters.sweetness[0] && recette.avgSweetness <= radarFilters.sweetness[1] &&
        recette.avgSpiciness >= radarFilters.spiciness[0] && recette.avgSpiciness <= radarFilters.spiciness[1] &&
        recette.avgEarthiness >= radarFilters.earthiness[0] && recette.avgEarthiness <= radarFilters.earthiness[1];

      return matchesQuery && matchesRadar;
    });
  }, [recettesWithRadar, searchQuery, radarFilters]);

  // Filtrer les molécules
  const filteredMolecules = useMemo(() => {
    return molecules?.filter(molecule => 
      fullTextSearch(
        `${molecule.name} ${molecule.olfactiveProfile || ''} ${molecule.family || ''}`,
        searchQuery
      )
    );
  }, [molecules, searchQuery]);

  // Filtrer les accords
  const filteredAccords = useMemo(() => {
    return accords?.filter(accord => 
      fullTextSearch(
        `${accord.name} ${accord.olfactiveProfile || ''}`,
        searchQuery
      )
    );
  }, [accords, searchQuery]);

  // Suggestions intelligentes basées sur l'historique
  const suggestions = useMemo(() => {
    const allTerms = [
      ...recettesWithRadar?.map(r => r.name),
      ...molecules?.map(m => m.name),
      ...accords?.map(a => a.name),
    ];
    
    if (!searchQuery.trim()) {
      // Suggestions basées sur l'historique
      return searchHistory.slice(0, 5).map(h => h.query);
    }

    // Suggestions basées sur la recherche actuelle
    return allTerms
      .filter(term => fullTextSearch(term, searchQuery))
      .slice(0, 5);
  }, [searchQuery, searchHistory, recettesWithRadar, molecules, accords]);

  // Réinitialiser les filtres radar
  const resetRadarFilters = () => {
    setRadarFilters({
      intensity: [0, 100],
      freshness: [0, 100],
      warmth: [0, 100],
      sweetness: [0, 100],
      spiciness: [0, 100],
      earthiness: [0, 100],
    });
  };

  // Effectuer la recherche
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const count = activeTab === 'recettes' ? filteredRecettes.length :
                    activeTab === 'molecules' ? filteredMolecules.length :
                    filteredAccords.length;
      saveToHistory(searchQuery, count);
    }
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Recherche Avancée</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Explorez PERFUMUM
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recherchez parmi {recettesWithRadar?.length} recettes, {molecules?.length} molécules et {accords?.length} accords avec des filtres avancés
          </p>
        </motion.div>

        {/* Barre de recherche principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowHistory(true);
                    }}
                    onFocus={() => setShowHistory(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Rechercher une recette, molécule, accord..."
                    className="pl-10 h-12 text-lg"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button onClick={handleSearch} size="lg" className="px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-5 h-5" />
                </Button>
              </div>

              {/* Suggestions */}
              {showHistory && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t space-y-2"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch();
                        }}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Historique */}
              {showHistory && searchHistory.length > 0 && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <History className="w-4 h-4" />
                      <span>Historique récent</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchHistory([]);
                        localStorage.removeItem('perfumum_search_history');
                      }}
                    >
                      Effacer
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {searchHistory.slice(0, 5).map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSearchQuery(item.query);
                          handleSearch();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      >
                        <span className="text-sm">{item.query}</span>
                        <Badge variant="outline">{item.resultsCount} résultats</Badge>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtres Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtres par Profil Radar
                  </CardTitle>
                  <CardDescription>
                    Affinez votre recherche selon les 6 axes olfactifs (échelle 0-100)
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={resetRadarFilters}>
                  Réinitialiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {RADAR_AXES.map((axis) => {
                  const key = axis.key as keyof RadarFilters;
                  const [min, max] = radarFilters[key];
                  return (
                    <div key={axis.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: axis.color }}
                          />
                          {axis.label}
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {min} - {max}
                        </span>
                      </div>
                      <Slider
                        value={[min, max]}
                        onValueChange={(value) => {
                          setRadarFilters(prev => ({
                            ...prev,
                            [key]: value as [number, number],
                          }));
                        }}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recettes">
                Recettes ({filteredRecettes.length})
              </TabsTrigger>
              <TabsTrigger value="molecules">
                Molécules ({filteredMolecules.length})
              </TabsTrigger>
              <TabsTrigger value="accords">
                Accords ({filteredAccords.length})
              </TabsTrigger>
            </TabsList>

            <TabErrorBoundary>
            <TabsContent value="recettes" className="mt-6">
              {filteredRecettes.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Aucune recette ne correspond à vos critères
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecettes.map((recette) => (
                    <Link key={recette.id} href={`/recette/${recette.id}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{recette.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {recette.description || 'Aucune description'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{recette.category}</Badge>
                            <Badge variant="secondary">{recette.moleculeCount} molécules</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            </TabErrorBoundary>

            <TabErrorBoundary>
            <TabsContent value="molecules" className="mt-6">
              {filteredMolecules.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Aucune molécule ne correspond à vos critères
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMolecules.map((molecule) => (
                    <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{molecule.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {molecule.olfactiveProfile || 'Aucun profil'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline">{molecule.family}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            </TabErrorBoundary>

            <TabErrorBoundary>
            <TabsContent value="accords" className="mt-6">
              {filteredAccords.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Aucun accord ne correspond à vos critères
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAccords.map((accord) => (
                    <Link key={accord.id} href={`/accords/${accord.id}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{accord.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {accord.olfactiveProfile || 'Aucun profil'}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            </TabErrorBoundary>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
