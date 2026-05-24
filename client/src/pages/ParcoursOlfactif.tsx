// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Leaf, 
  FlaskConical, 
  ChevronRight,
  ChevronLeft,
  Home,
  Route,
  Sparkles,
  ArrowRight,
  Globe,
  Compass,
  Network,
  Info,
  X,
  Search,
  Filter,
  BookOpen,
  Star,
  Clock,
  Users,
  Mountain,
  Sun,
  Thermometer,
  TreePine
} from "lucide-react";

// Types pour le parcours
interface Terroir {
  id: number;
  name: string;
  country: string;
  region?: string;
  climate?: string;
  latitude?: number;
  longitude?: number;
}

interface Plant {
  id: number;
  name: string;
  latinName?: string;
  family?: string;
  origin?: string;
  category?: string;
  olfactiveFamily?: string;
}

interface Molecule {
  id: number;
  name: string;
  family?: string;
  gamme?: string;
  olfactiveProfile?: string;
  casNumber?: string;
}

interface CuratedJourney {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
  shortDescription?: string;
  theme: string;
  emoji?: string;
  color?: string;
  difficulty?: string;
  estimatedDuration?: number;
  terroirCount: number;
  plantCount: number;
  moleculeCount: number;
  isPublished: boolean;
  isFeatured: boolean;
}

type ViewLevel = 'terroirs' | 'plants' | 'molecules';
type MainTab = 'explore' | 'journeys';

// Mapping des thèmes vers des labels français
const themeLabels: Record<string, string> = {
  geographic: "Géographique",
  olfactive: "Olfactif",
  botanical: "Botanique",
  historical: "Historique",
  seasonal: "Saisonnier",
  therapeutic: "Thérapeutique",
  culinary: "Culinaire",
  sacred: "Sacré",
  luxury: "Luxe",
  sustainable: "Durable",
  custom: "Personnalisé",
};

// Mapping des difficultés
const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: "Débutant", color: "bg-green-500/20 text-green-700" },
  intermediate: { label: "Intermédiaire", color: "bg-yellow-500/20 text-yellow-700" },
  advanced: { label: "Avancé", color: "bg-orange-500/20 text-orange-700" },
  expert: { label: "Expert", color: "bg-red-500/20 text-red-700" },
};

// Mapping des climats
const climateLabels: Record<string, { label: string; icon: typeof Sun }> = {
  tropical: { label: "Tropical", icon: Sun },
  mediterranean: { label: "Méditerranéen", icon: Sun },
  temperate: { label: "Tempéré", icon: TreePine },
  arid: { label: "Aride", icon: Thermometer },
  continental: { label: "Continental", icon: Mountain },
  oceanic: { label: "Océanique", icon: Globe },
  subtropical: { label: "Subtropical", icon: Sun },
  montane: { label: "Montagnard", icon: Mountain },
};

export default function ParcoursOlfactif() {
  // Tab principal
  const [mainTab, setMainTab] = useState<MainTab>('explore');
  
  // États de navigation
  const [viewLevel, setViewLevel] = useState<ViewLevel>('terroirs');
  const [selectedTerroir, setSelectedTerroir] = useState<Terroir | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  
  // États des filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClimate, setSelectedClimate] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedPlantCategory, setSelectedPlantCategory] = useState<string>('');
  const [selectedOlfactiveFamily, setSelectedOlfactiveFamily] = useState<string>('');
  const [selectedMoleculeFamily, setSelectedMoleculeFamily] = useState<string>('');
  const [selectedGamme, setSelectedGamme] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Historique de navigation
  const [navigationHistory, setNavigationHistory] = useState<Array<{
    level: ViewLevel;
    terroir?: Terroir;
    plant?: Plant;
  }>>([{ level: 'terroirs' }]);

  // Queries
  const { data: terroirs, isLoading: loadingTerroirs } = trpc.terroirs?.getAll.useQuery();
  const { data: allPlants, isLoading: loadingPlants } = trpc.plants.list.useQuery();
  const { data: allMolecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: plantTerroirs } = trpc.plantTerroirs?.getAll.useQuery();
  const { data: plantMolecules } = trpc.plantMoleculeLinks.getAll.useQuery();
  const { data: filterOptions } = trpc.parcoursOlfactif.getFilterOptions.useQuery();
  const { data: curatedJourneys, isLoading: loadingJourneys } = trpc.curatedJourneys?.listPublished.useQuery();
  const { data: featuredJourneys } = trpc.curatedJourneys?.getFeatured.useQuery();

  // Filtrer les terroirs
  const filteredTerroirs = useMemo(() => {
    if (!terroirs) return [];
    let filtered = [...terroirs];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.country?.toLowerCase().includes(query) ||
        t.region?.toLowerCase().includes(query)
      );
    }
    if (selectedClimate) {
      filtered = filtered.filter(t => t.climateType === selectedClimate);
    }
    if (selectedCountry) {
      filtered = filtered.filter(t => t.country === selectedCountry);
    }
    
    return filtered;
  }, [terroirs, searchQuery, selectedClimate, selectedCountry]);

  // Filtrer les plantes
  const filteredPlants = useMemo(() => {
    if (!allPlants) return [];
    let filtered = [...allPlants];
    
    if (searchQuery && viewLevel === 'terroirs') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.latinName?.toLowerCase().includes(query)
      );
    }
    if (selectedPlantCategory) {
      filtered = filtered.filter(p => p.category === selectedPlantCategory);
    }
    if (selectedOlfactiveFamily) {
      filtered = filtered.filter(p => p.family === selectedOlfactiveFamily);
    }
    
    return filtered;
  }, [allPlants, searchQuery, viewLevel, selectedPlantCategory, selectedOlfactiveFamily]);

  // Plantes d'un terroir sélectionné (avec filtres)
  const plantsForTerroir = useMemo(() => {
    if (!selectedTerroir || !plantTerroirs || !allPlants) return [];
    
    const plantIds = plantTerroirs
      .filter(pt => pt.terroirId === selectedTerroir.id)
      .map(pt => pt.plantId);
    
    let plants = allPlants?.filter(p => plantIds.includes(p.id));
    
    // Appliquer les filtres
    if (selectedPlantCategory) {
      plants = plants.filter(p => p.category === selectedPlantCategory);
    }
    if (selectedOlfactiveFamily) {
      plants = plants.filter(p => p.family === selectedOlfactiveFamily);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      plants = plants.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.latinName?.toLowerCase().includes(query)
      );
    }
    
    return plants;
  }, [selectedTerroir, plantTerroirs, allPlants, selectedPlantCategory, selectedOlfactiveFamily, searchQuery]);

  // Molécules d'une plante sélectionnée (avec filtres)
  const moleculesForPlant = useMemo(() => {
    if (!selectedPlant || !plantMolecules || !allMolecules) return [];
    
    const moleculeIds = plantMolecules
      .filter((pm: any) => pm.plantId === selectedPlant.id)
      .map((pm: any) => pm.moleculeId);
    
    let molecules = allMolecules?.filter(m => moleculeIds.includes(m.id));
    
    // Appliquer les filtres
    if (selectedMoleculeFamily) {
      molecules = molecules.filter(m => m.family === selectedMoleculeFamily);
    }
    if (selectedGamme) {
      molecules = molecules.filter(m => m.chemicalClass === selectedGamme);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      molecules = molecules.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.olfactiveProfile?.toLowerCase().includes(query)
      );
    }
    
    return molecules;
  }, [selectedPlant, plantMolecules, allMolecules, selectedMoleculeFamily, selectedGamme, searchQuery]);

  // Navigation
  const navigateToTerroir = useCallback((terroir: Terroir) => {
    setSelectedTerroir(terroir);
    setSelectedPlant(null);
    setSelectedMolecule(null);
    setViewLevel('plants');
    setNavigationHistory(prev => [...prev, { level: 'plants', terroir }]);
  }, []);

  const navigateToPlant = useCallback((plant: Plant) => {
    setSelectedPlant(plant);
    setSelectedMolecule(null);
    setViewLevel('molecules');
    setNavigationHistory(prev => [...prev, { level: 'molecules', terroir: selectedTerroir!, plant }]);
  }, [selectedTerroir]);

  const navigateToMolecule = useCallback((molecule: Molecule) => {
    setSelectedMolecule(molecule);
  }, []);

  const navigateBack = useCallback(() => {
    if (navigationHistory.length <= 1) return;
    
    const newHistory = [...navigationHistory];
    newHistory.pop();
    const lastState = newHistory[newHistory.length - 1];
    
    setNavigationHistory(newHistory);
    setViewLevel(lastState.level);
    setSelectedTerroir(lastState.terroir || null);
    setSelectedPlant(lastState.plant || null);
    setSelectedMolecule(null);
  }, [navigationHistory]);

  const navigateHome = useCallback(() => {
    setViewLevel('terroirs');
    setSelectedTerroir(null);
    setSelectedPlant(null);
    setSelectedMolecule(null);
    setNavigationHistory([{ level: 'terroirs' }]);
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedClimate('');
    setSelectedCountry('');
    setSelectedPlantCategory('');
    setSelectedOlfactiveFamily('');
    setSelectedMoleculeFamily('');
    setSelectedGamme('');
  }, []);

  // Statistiques
  const stats = useMemo(() => {
    return {
      totalTerroirs: terroirs?.length || 0,
      totalPlants: allPlants?.length || 0,
      totalMolecules: allMolecules?.length || 0,
      totalLinks: (plantTerroirs?.length || 0) + (plantMolecules?.length || 0),
      filteredTerroirs: filteredTerroirs.length,
    };
  }, [terroirs, allPlants, allMolecules, plantTerroirs, plantMolecules, filteredTerroirs]);

  const isLoading = loadingTerroirs || loadingPlants || loadingMolecules;

  // Compter les filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedClimate) count++;
    if (selectedCountry) count++;
    if (selectedPlantCategory) count++;
    if (selectedOlfactiveFamily) count++;
    if (selectedMoleculeFamily) count++;
    if (selectedGamme) count++;
    return count;
  }, [selectedClimate, selectedCountry, selectedPlantCategory, selectedOlfactiveFamily, selectedMoleculeFamily, selectedGamme]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-96" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-[600px]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 via-green-500/20 to-blue-500/20">
              <Route className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
                Parcours Olfactif
              </h1>
              <p className="text-muted-foreground">
                Explorez les connexions entre terroirs, plantes et molécules
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/graphe-terroir-plante-molecule">
              <Button variant="outline" size="sm">
                <Network className="h-4 w-4 mr-2" />
                Vue graphe
              </Button>
            </Link>
            <Link href="/carte-interactive-terroirs">
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Carte
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs principaux */}
        <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="explore" className="gap-2">
              <Compass className="h-4 w-4" />
              Explorer
            </TabsTrigger>
            <TabsTrigger value="journeys" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Parcours guidés
              {featuredJourneys && featuredJourneys?.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {featuredJourneys?.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab Explorer */}
          <TabsContent value="explore" className="space-y-6 mt-6">
            {/* Barre de recherche et filtres */}
            <Card className="bg-muted/30">
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Recherche */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un terroir, une plante ou une molécule..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Bouton filtres */}
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Panneau de filtres */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">Filtres avancés</h3>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                          Réinitialiser
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* Filtres Terroirs */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          Climat
                        </label>
                        <Select value={selectedClimate} onValueChange={setSelectedClimate}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Tous les climats</SelectItem>
                            {filterOptions?.climates?.map((climate: string) => (
                              <SelectItem key={climate} value={climate}>
                                {climateLabels[climate]?.label || climate}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Pays
                        </label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Tous les pays</SelectItem>
                            {filterOptions?.countries?.map((country: string) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filtres Plantes */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          Catégorie plante
                        </label>
                        <Select value={selectedPlantCategory} onValueChange={setSelectedPlantCategory}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Toutes les catégories</SelectItem>
                            {filterOptions?.plantCategories?.map((cat: string) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Famille olfactive
                        </label>
                        <Select value={selectedOlfactiveFamily} onValueChange={setSelectedOlfactiveFamily}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Toutes les familles</SelectItem>
                            {filterOptions?.olfactiveFamilies?.map((fam: string) => (
                              <SelectItem key={fam} value={fam}>
                                {fam}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Filtres Molécules */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <FlaskConical className="h-3 w-3" />
                          Famille chimique
                        </label>
                        <Select value={selectedMoleculeFamily} onValueChange={setSelectedMoleculeFamily}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Toutes les familles</SelectItem>
                            {filterOptions?.moleculeFamilies?.map((fam: string) => (
                              <SelectItem key={fam} value={fam}>
                                {fam}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Gamme
                        </label>
                        <Select value={selectedGamme} onValueChange={setSelectedGamme}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Toutes les gammes</SelectItem>
                            {filterOptions?.gammes?.map((gamme: string) => (
                              <SelectItem key={gamme} value={gamme}>
                                {gamme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fil d'Ariane / Breadcrumb */}
            <Card className="bg-muted/30">
              <CardContent className="py-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant={viewLevel === 'terroirs' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={navigateHome}
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Terroirs
                    {viewLevel === 'terroirs' && filteredTerroirs.length !== stats.totalTerroirs && (
                      <Badge variant="secondary" className="ml-1">
                        {filteredTerroirs.length}/{stats.totalTerroirs}
                      </Badge>
                    )}
                  </Button>
                  
                  {selectedTerroir && (
                    <>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Button
                        variant={viewLevel === 'plants' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => {
                          setViewLevel('plants');
                          setSelectedPlant(null);
                          setSelectedMolecule(null);
                        }}
                        className="gap-2"
                      >
                        <MapPin className="h-4 w-4 text-orange-500" />
                        {selectedTerroir.name}
                      </Button>
                    </>
                  )}
                  
                  {selectedPlant && (
                    <>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Button
                        variant={viewLevel === 'molecules' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => {
                          setViewLevel('molecules');
                          setSelectedMolecule(null);
                        }}
                        className="gap-2"
                      >
                        <Leaf className="h-4 w-4 text-green-500" />
                        {selectedPlant.name}
                      </Button>
                    </>
                  )}
                  
                  {selectedMolecule && (
                    <>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary" className="gap-1">
                        <FlaskConical className="h-3 w-3 text-blue-500" />
                        {selectedMolecule.name}
                      </Badge>
                    </>
                  )}
                  
                  {navigationHistory.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={navigateBack}
                      className="ml-auto gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Retour
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={viewLevel === 'terroirs' ? 'ring-2 ring-orange-500/50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <MapPin className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {viewLevel === 'terroirs' ? filteredTerroirs.length : stats.totalTerroirs}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {viewLevel === 'terroirs' && activeFiltersCount > 0 ? 'Terroirs filtrés' : 'Terroirs'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={viewLevel === 'plants' ? 'ring-2 ring-green-500/50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Leaf className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {viewLevel === 'plants' ? plantsForTerroir.length : stats.totalPlants}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {viewLevel === 'plants' ? 'Plantes du terroir' : 'Plantes'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={viewLevel === 'molecules' ? 'ring-2 ring-blue-500/50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <FlaskConical className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {viewLevel === 'molecules' ? moleculesForPlant.length : stats.totalMolecules}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {viewLevel === 'molecules' ? 'Molécules de la plante' : 'Molécules'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalLinks}</p>
                      <p className="text-xs text-muted-foreground">Connexions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste principale */}
              <div className="lg:col-span-2">
                <Card className="h-[600px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      {viewLevel === 'terroirs' && (
                        <>
                          <MapPin className="h-5 w-5 text-orange-500" />
                          Sélectionnez un terroir
                        </>
                      )}
                      {viewLevel === 'plants' && (
                        <>
                          <Leaf className="h-5 w-5 text-green-500" />
                          Plantes de {selectedTerroir?.name}
                        </>
                      )}
                      {viewLevel === 'molecules' && (
                        <>
                          <FlaskConical className="h-5 w-5 text-blue-500" />
                          Molécules de {selectedPlant?.name}
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {viewLevel === 'terroirs' && 'Cliquez sur un terroir pour voir ses plantes associées'}
                      {viewLevel === 'plants' && 'Cliquez sur une plante pour voir ses molécules'}
                      {viewLevel === 'molecules' && 'Cliquez sur une molécule pour voir ses détails'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[480px] pr-4">
                      {/* Vue Terroirs */}
                      {viewLevel === 'terroirs' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredTerroirs.length === 0 ? (
                            <div className="col-span-2">
                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Aucun résultat</AlertTitle>
                                <AlertDescription>
                                  Aucun terroir ne correspond à vos critères de recherche.
                                  <Button variant="link" className="p-0 h-auto ml-1" onClick={resetFilters}>
                                    Réinitialiser les filtres
                                  </Button>
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : (
                            filteredTerroirs.map((terroir: any) => {
                              const plantCount = plantTerroirs?.filter(pt => pt.terroirId === terroir.id).length || 0;
                              return (
                                <Card
                                  key={terroir.id}
                                  className="cursor-pointer hover:ring-2 hover:ring-orange-500/50 transition-all group"
                                  onClick={() => navigateToTerroir(terroir)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                                          <MapPin className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold">{terroir.name}</h3>
                                          <p className="text-sm text-muted-foreground">{terroir.country}</p>
                                          {terroir.climate && (
                                            <Badge variant="outline" className="mt-1 text-xs">
                                              {climateLabels[terroir.climate]?.label || terroir.climate}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="gap-1">
                                          <Leaf className="h-3 w-3" />
                                          {plantCount}
                                        </Badge>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* Vue Plantes */}
                      {viewLevel === 'plants' && (
                        <div className="space-y-3">
                          {plantsForTerroir.length === 0 ? (
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertTitle>Aucune plante liée</AlertTitle>
                              <AlertDescription>
                                {activeFiltersCount > 0 ? (
                                  <>
                                    Aucune plante ne correspond à vos filtres.
                                    <Button variant="link" className="p-0 h-auto ml-1" onClick={resetFilters}>
                                      Réinitialiser les filtres
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    Ce terroir n'a pas encore de plantes associées.
                                    <Link href="/plant-terroir-linking" className="underline ml-1">
                                      Ajouter des liaisons
                                    </Link>
                                  </>
                                )}
                              </AlertDescription>
                            </Alert>
                          ) : (
                            plantsForTerroir.map((plant: any) => {
                              const moleculeCount = plantMolecules?.filter((pm: any) => pm.plantId === plant.id).length || 0;
                              return (
                                <Card
                                  key={plant.id}
                                  className="cursor-pointer hover:ring-2 hover:ring-green-500/50 transition-all group"
                                  onClick={() => navigateToPlant(plant)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                          <Leaf className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold">{plant.name}</h3>
                                          {plant.latinName && (
                                            <p className="text-sm text-muted-foreground italic">{plant.latinName}</p>
                                          )}
                                          <div className="flex gap-1 mt-1 flex-wrap">
                                            {plant.category && (
                                              <Badge variant="outline" className="text-xs">
                                                {plant.category}
                                              </Badge>
                                            )}
                                            {plant.olfactiveFamily && (
                                              <Badge variant="secondary" className="text-xs">
                                                {plant.olfactiveFamily}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="gap-1">
                                          <FlaskConical className="h-3 w-3" />
                                          {moleculeCount}
                                        </Badge>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* Vue Molécules */}
                      {viewLevel === 'molecules' && (
                        <div className="space-y-3">
                          {moleculesForPlant.length === 0 ? (
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertTitle>Aucune molécule liée</AlertTitle>
                              <AlertDescription>
                                {activeFiltersCount > 0 ? (
                                  <>
                                    Aucune molécule ne correspond à vos filtres.
                                    <Button variant="link" className="p-0 h-auto ml-1" onClick={resetFilters}>
                                      Réinitialiser les filtres
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    Cette plante n'a pas encore de molécules associées.
                                    <Link href="/plant-molecule-linking" className="underline ml-1">
                                      Ajouter des liaisons
                                    </Link>
                                  </>
                                )}
                              </AlertDescription>
                            </Alert>
                          ) : (
                            moleculesForPlant.map((molecule: any) => (
                              <Card
                                key={molecule.id}
                                className={`cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all group ${
                                  selectedMolecule?.id === molecule.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                                onClick={() => navigateToMolecule(molecule)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                        <FlaskConical className="h-5 w-5 text-blue-500" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold">{molecule.name}</h3>
                                        {molecule.casNumber && (
                                          <p className="text-sm text-muted-foreground font-mono">CAS: {molecule.casNumber}</p>
                                        )}
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                          {molecule.family && (
                                            <Badge variant="outline" className="text-xs">
                                              {molecule.family}
                                            </Badge>
                                          )}
                                          {molecule.gamme && (
                                            <Badge variant="secondary" className="text-xs">
                                              {molecule.gamme}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Panneau de détails */}
              <div className="lg:col-span-1">
                <Card className="h-[600px] sticky top-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5" />
                      Détails
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      {/* Détails du terroir sélectionné */}
                      {selectedTerroir && viewLevel !== 'terroirs' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-5 w-5 text-orange-500" />
                              <h3 className="font-semibold">{selectedTerroir.name}</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p><span className="text-muted-foreground">Pays:</span> {selectedTerroir.country}</p>
                              {selectedTerroir.region && (
                                <p><span className="text-muted-foreground">Région:</span> {selectedTerroir.region}</p>
                              )}
                              {selectedTerroir.climate && (
                                <p><span className="text-muted-foreground">Climat:</span> {climateLabels[selectedTerroir.climate]?.label || selectedTerroir.climate}</p>
                              )}
                            </div>
                            <Link href={`/terroirs/${selectedTerroir.id}`}>
                              <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                                Voir la fiche complète →
                              </Button>
                            </Link>
                          </div>
                          <Separator />
                        </div>
                      )}

                      {/* Détails de la plante sélectionnée */}
                      {selectedPlant && viewLevel === 'molecules' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Leaf className="h-5 w-5 text-green-500" />
                              <h3 className="font-semibold">{selectedPlant.name}</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                              {selectedPlant.latinName && (
                                <p className="italic text-muted-foreground">{selectedPlant.latinName}</p>
                              )}
                              {selectedPlant.family && (
                                <p><span className="text-muted-foreground">Famille:</span> {selectedPlant.family}</p>
                              )}
                              {selectedPlant.olfactiveFamily && (
                                <p><span className="text-muted-foreground">Famille olfactive:</span> {selectedPlant.olfactiveFamily}</p>
                              )}
                              {selectedPlant.origin && (
                                <p><span className="text-muted-foreground">Origine:</span> {selectedPlant.origin}</p>
                              )}
                            </div>
                            <Link href={`/plants/${selectedPlant.id}`}>
                              <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                                Voir la fiche complète →
                              </Button>
                            </Link>
                          </div>
                          <Separator />
                        </div>
                      )}

                      {/* Détails de la molécule sélectionnée */}
                      {selectedMolecule && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <FlaskConical className="h-5 w-5 text-blue-500" />
                              <h3 className="font-semibold">{selectedMolecule.name}</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              {selectedMolecule.casNumber && (
                                <p>
                                  <span className="text-muted-foreground">CAS:</span>{' '}
                                  <span className="font-mono">{selectedMolecule.casNumber}</span>
                                </p>
                              )}
                              {selectedMolecule.family && (
                                <p>
                                  <span className="text-muted-foreground">Famille:</span>{' '}
                                  <Badge variant="outline">{selectedMolecule.family}</Badge>
                                </p>
                              )}
                              {selectedMolecule.gamme && (
                                <p>
                                  <span className="text-muted-foreground">Gamme:</span>{' '}
                                  <Badge variant="secondary">{selectedMolecule.gamme}</Badge>
                                </p>
                              )}
                              {selectedMolecule.olfactiveProfile && (
                                <div>
                                  <p className="text-muted-foreground mb-1">Profil olfactif:</p>
                                  <p className="text-sm">{selectedMolecule.olfactiveProfile}</p>
                                </div>
                              )}
                            </div>
                            <Link href={`/molecules/${selectedMolecule.id}`}>
                              <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                                Voir la fiche complète →
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Message par défaut */}
                      {!selectedTerroir && viewLevel === 'terroirs' && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                          <Compass className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium">Commencez votre exploration</p>
                          <p className="text-sm mt-2">
                            Sélectionnez un terroir pour découvrir ses plantes et molécules associées
                          </p>
                        </div>
                      )}

                      {/* Chemin complet */}
                      {selectedTerroir && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Chemin actuel</h4>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 p-2 rounded bg-orange-500/5">
                              <MapPin className="h-4 w-4 text-orange-500" />
                              <span className="text-sm">{selectedTerroir.name}</span>
                            </div>
                            {selectedPlant && (
                              <>
                                <div className="ml-4 border-l-2 border-dashed border-muted h-4" />
                                <div className="flex items-center gap-2 p-2 rounded bg-green-500/5">
                                  <Leaf className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{selectedPlant.name}</span>
                                </div>
                              </>
                            )}
                            {selectedMolecule && (
                              <>
                                <div className="ml-4 border-l-2 border-dashed border-muted h-4" />
                                <div className="flex items-center gap-2 p-2 rounded bg-blue-500/5">
                                  <FlaskConical className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{selectedMolecule.name}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab Parcours guidés */}
          <TabsContent value="journeys" className="space-y-6 mt-6">
            {/* Parcours mis en avant */}
            {featuredJourneys && featuredJourneys?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Parcours recommandés</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredJourneys?.map((journey: any) => (
                    <JourneyCard key={journey.id} journey={journey} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Tous les parcours */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Tous les parcours</h2>
              </div>
              
              {loadingJourneys ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : curatedJourneys && curatedJourneys?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {curatedJourneys?.map((journey: any) => (
                    <JourneyCard key={journey.id} journey={journey} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Aucun parcours disponible</h3>
                  <p className="text-muted-foreground">
                    Les parcours curatés seront bientôt disponibles. En attendant, explorez librement les terroirs, plantes et molécules.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Légende */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-orange-500/10">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <span>Terroir (zone de production)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-green-500/10">
                  <Leaf className="h-4 w-4 text-green-500" />
                </div>
                <span>Plante aromatique</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-blue-500/10">
                  <FlaskConical className="h-4 w-4 text-blue-500" />
                </div>
                <span>Molécule odorante</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                <span>Cliquez pour naviguer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Composant carte de parcours
function JourneyCard({ journey, featured = false }: { journey: CuratedJourney; featured?: boolean }) {
  return (
    <Link href={`/parcours/${journey.code}`}>
      <Card className={`h-full cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group ${featured ? 'ring-1 ring-yellow-500/30' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {journey.emoji && <span className="text-2xl">{journey.emoji}</span>}
              <div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {journey.name}
                </CardTitle>
                {journey.nameEn && (
                  <p className="text-xs text-muted-foreground italic">{journey.nameEn}</p>
                )}
              </div>
            </div>
            {featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {journey.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {journey.shortDescription}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {themeLabels[journey.theme] || journey.theme}
            </Badge>
            {journey.difficulty && (
              <Badge className={`text-xs ${difficultyLabels[journey.difficulty]?.color || ''}`}>
                {difficultyLabels[journey.difficulty]?.label || journey.difficulty}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-orange-500" />
              <span>{journey.terroirCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="h-3 w-3 text-green-500" />
              <span>{journey.plantCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <FlaskConical className="h-3 w-3 text-blue-500" />
              <span>{journey.moleculeCount}</span>
            </div>
            {journey.estimatedDuration && (
              <div className="flex items-center gap-1 ml-auto">
                <Clock className="h-3 w-3" />
                <span>{journey.estimatedDuration} min</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
