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
  X
} from "lucide-react";

// Types pour le parcours
interface Terroir {
  id: number;
  name: string;
  country: string;
  region?: string;
  climateType?: string;
  latitude?: number;
  longitude?: number;
}

interface Plant {
  id: number;
  name: string;
  latinName?: string;
  family?: string;
  origin?: string;
}

interface Molecule {
  id: number;
  name: string;
  chemicalClass?: string;
  olfactiveProfile?: string;
  casNumber?: string;
}

type ViewLevel = 'terroirs' | 'plants' | 'molecules';

export default function ParcoursOlfactif() {
  // États de navigation
  const [viewLevel, setViewLevel] = useState<ViewLevel>('terroirs');
  const [selectedTerroir, setSelectedTerroir] = useState<Terroir | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  
  // Historique de navigation
  const [navigationHistory, setNavigationHistory] = useState<Array<{
    level: ViewLevel;
    terroir?: Terroir;
    plant?: Plant;
  }>>([{ level: 'terroirs' }]);

  // Queries
  const { data: terroirs, isLoading: loadingTerroirs } = trpc.terroirs.getAll.useQuery();
  const { data: allPlants, isLoading: loadingPlants } = trpc.plants.list.useQuery();
  const { data: allMolecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: plantTerroirs } = trpc.plantTerroirs.getAll.useQuery();
  const { data: plantMolecules } = trpc.plantMoleculeLinks.getAll.useQuery();

  // Plantes d'un terroir sélectionné
  const plantsForTerroir = useMemo(() => {
    if (!selectedTerroir || !plantTerroirs || !allPlants) return [];
    
    const plantIds = plantTerroirs
      .filter(pt => pt.terroirId === selectedTerroir.id)
      .map(pt => pt.plantId);
    
    return allPlants.filter(p => plantIds.includes(p.id));
  }, [selectedTerroir, plantTerroirs, allPlants]);

  // Molécules d'une plante sélectionnée
  const moleculesForPlant = useMemo(() => {
    if (!selectedPlant || !plantMolecules || !allMolecules) return [];
    
    const moleculeIds = plantMolecules
      .filter((pm: any) => pm.plantId === selectedPlant.id)
      .map((pm: any) => pm.moleculeId);
    
    return allMolecules.filter(m => moleculeIds.includes(m.id));
  }, [selectedPlant, plantMolecules, allMolecules]);

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

  // Statistiques
  const stats = useMemo(() => {
    return {
      totalTerroirs: terroirs?.length || 0,
      totalPlants: allPlants?.length || 0,
      totalMolecules: allMolecules?.length || 0,
      totalLinks: (plantTerroirs?.length || 0) + (plantMolecules?.length || 0),
    };
  }, [terroirs, allPlants, allMolecules, plantTerroirs, plantMolecules]);

  const isLoading = loadingTerroirs || loadingPlants || loadingMolecules;

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
                  <p className="text-2xl font-bold">{stats.totalTerroirs}</p>
                  <p className="text-xs text-muted-foreground">Terroirs</p>
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
                  {viewLevel === 'terroirs' && terroirs && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {terroirs.map((terroir: any) => {
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
                                    {terroir.climateType && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {terroir.climateType}
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
                      })}
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
                            Ce terroir n'a pas encore de plantes associées. 
                            <Link href="/plant-terroir-linking" className="underline ml-1">
                              Ajouter des liaisons
                            </Link>
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
                                      {plant.family && (
                                        <Badge variant="outline" className="mt-1 text-xs">
                                          {plant.family}
                                        </Badge>
                                      )}
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
                            Cette plante n'a pas encore de molécules associées.
                            <Link href="/plant-molecule-linking" className="underline ml-1">
                              Ajouter des liaisons
                            </Link>
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
                                    {molecule.chemicalClass && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {molecule.chemicalClass}
                                      </Badge>
                                    )}
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
                          {selectedTerroir.climateType && (
                            <p><span className="text-muted-foreground">Climat:</span> {selectedTerroir.climateType}</p>
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
                          {selectedMolecule.chemicalClass && (
                            <p>
                              <span className="text-muted-foreground">Classe:</span>{' '}
                              <Badge variant="outline">{selectedMolecule.chemicalClass}</Badge>
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
