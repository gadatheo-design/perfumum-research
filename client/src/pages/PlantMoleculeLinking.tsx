// @ts-nocheck
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Link2, 
  Beaker, 
  Leaf, 
  Search, 
  Plus, 
  Trash2,
  Loader2,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Unlink
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";

export default function PlantMoleculeLinking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  
  // États pour la création de liaison
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<any>(null);
  const [plantSearch, setPlantSearch] = useState("");
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [linkRole, setLinkRole] = useState<string>("");
  const [linkPercentage, setLinkPercentage] = useState("");
  const [isSignature, setIsSignature] = useState(false);
  
  // Debounced search
  const debouncedPlantSearch = useDebounce(plantSearch, 300);
  const debouncedMoleculeSearch = useDebounce(moleculeSearch, 300);
  
  // Queries
  const stats = trpc.contributor.getPlantMoleculeStats.useQuery();
  const enrichmentStats = trpc.contributor.getEnrichmentStats.useQuery();
  
  const plantSearchResults = trpc.contributor.searchPlants.useQuery(
    { query: debouncedPlantSearch, limit: 10 },
    { enabled: debouncedPlantSearch.length >= 2 }
  );
  
  const moleculeSearchResults = trpc.contributor.searchMolecules.useQuery(
    { query: debouncedMoleculeSearch, limit: 10 },
    { enabled: debouncedMoleculeSearch.length >= 2 }
  );
  
  const orphanPlants = trpc.contributor.getOrphanPlants.useQuery({ limit: 20 });
  const orphanMolecules = trpc.contributor.getOrphanMolecules.useQuery({ limit: 20 });
  const allLinks = trpc.contributor.getAllPlantMoleculeLinks.useQuery({ limit: 100, offset: 0 });
  
  const linkExists = trpc.contributor.checkLinkExists.useQuery(
    { plantId: selectedPlant?.id || 0, moleculeId: selectedMolecule?.id || 0 },
    { enabled: !!(selectedPlant?.id && selectedMolecule?.id) }
  );
  
  // Mutations
  const createLink = trpc.contributor.createPlantMoleculeLink.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison créée",
        description: `${selectedPlant?.name} ↔ ${selectedMolecule?.name}`,
      });
      setSelectedPlant(null);
      setSelectedMolecule(null);
      setPlantSearch("");
      setMoleculeSearch("");
      setLinkRole("");
      setLinkPercentage("");
      setIsSignature(false);
      stats.refetch();
      allLinks.refetch();
      orphanPlants.refetch();
      orphanMolecules.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteLink = trpc.contributor.deletePlantMoleculeLink.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison supprimée",
        description: "La liaison a été supprimée avec succès.",
      });
      stats.refetch();
      allLinks.refetch();
      orphanPlants.refetch();
      orphanMolecules.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handlers
  const handleCreateLink = () => {
    if (!selectedPlant || !selectedMolecule) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une plante et une molécule.",
        variant: "destructive",
      });
      return;
    }
    
    createLink.mutate({
      plantId: selectedPlant.id,
      moleculeId: selectedMolecule.id,
      role: linkRole as any || undefined,
      percentageTypical: linkPercentage ? parseFloat(linkPercentage) : undefined,
      isSignature: isSignature ? 1 : 0,
    });
  };
  
  // Calcul du pourcentage de couverture
  const coveragePercentage = useMemo(() => {
    if (!stats.data) return 0;
    const { totalPlants = 0, totalMolecules = 0, plantsWithLinks = 0, moleculesWithLinks = 0 } = stats.data;
    if (totalPlants === 0 || totalMolecules === 0) return 0;
    return Math.round(((plantsWithLinks + moleculesWithLinks) / (totalPlants + totalMolecules)) * 100);
  }, [stats.data]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full mb-6 border border-primary/20">
                <Link2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Liaisons Molécules ↔ Plantes</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Créer des Liaisons
              </h1>
              
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connectez les molécules à leurs sources botaniques pour enrichir la base de données.
                Chaque liaison améliore la traçabilité et la compréhension des compositions olfactives.
              </p>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-8 border-b border-border/50 bg-muted/20">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Liaisons totales</p>
                      <p className="text-2xl font-bold">{stats.data?.total || 0}</p>
                    </div>
                    <Link2 className="h-8 w-8 text-primary/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Plantes liées</p>
                      <p className="text-2xl font-bold">
                        {stats.data?.plantsWithLinks || 0}
                        <span className="text-sm text-muted-foreground font-normal">
                          /{stats.data?.totalPlants || 0}
                        </span>
                      </p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Molécules liées</p>
                      <p className="text-2xl font-bold">
                        {stats.data?.moleculesWithLinks || 0}
                        <span className="text-sm text-muted-foreground font-normal">
                          /{stats.data?.totalMolecules || 0}
                        </span>
                      </p>
                    </div>
                    <Beaker className="h-8 w-8 text-purple-500/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Couverture</p>
                      <p className="text-2xl font-bold">{coveragePercentage}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-amber-500/50" />
                  </div>
                  <Progress value={coveragePercentage} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Interface principale */}
        <section className="py-12">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="create">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </TabsTrigger>
                <TabsTrigger value="orphans">
                  <Unlink className="h-4 w-4 mr-2" />
                  Orphelins
                </TabsTrigger>
                <TabsTrigger value="existing">
                  <Link2 className="h-4 w-4 mr-2" />
                  Existantes
                </TabsTrigger>
              </TabsList>
              
              {/* Créer une liaison */}
              <TabsContent value="create">
                <div className="max-w-4xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Créer une nouvelle liaison</CardTitle>
                      <CardDescription>
                        Sélectionnez une plante et une molécule pour créer une liaison entre elles.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-8 md:grid-cols-2">
                        {/* Sélection de la plante */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Leaf className="h-5 w-5 text-green-500" />
                            <h3 className="font-semibold">Plante</h3>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Rechercher une plante</Label>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Nom ou nom latin..."
                                value={plantSearch}
                                onChange={(e) => setPlantSearch(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          {plantSearchResults.data && plantSearchResults.data.length > 0 && !selectedPlant && (
                            <ScrollArea className="h-48 border rounded-md">
                              <div className="p-2 space-y-1">
                                {plantSearchResults.data.map((plant) => (
                                  <button
                                    key={plant.id}
                                    onClick={() => {
                                      setSelectedPlant(plant);
                                      setPlantSearch("");
                                    }}
                                    className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                                  >
                                    <div className="font-medium">{plant.name}</div>
                                    {plant.latinName && (
                                      <div className="text-sm text-muted-foreground italic">
                                        {plant.latinName}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          )}
                          
                          {selectedPlant && (
                            <div className="p-4 border rounded-lg bg-green-500/5 border-green-500/20">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold text-green-700 dark:text-green-400">
                                    {selectedPlant.name}
                                  </div>
                                  {selectedPlant.latinName && (
                                    <div className="text-sm text-muted-foreground italic">
                                      {selectedPlant.latinName}
                                    </div>
                                  )}
                                  {selectedPlant.family && (
                                    <Badge variant="outline" className="mt-2">
                                      {selectedPlant.family}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedPlant(null)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Sélection de la molécule */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Beaker className="h-5 w-5 text-purple-500" />
                            <h3 className="font-semibold">Molécule</h3>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Rechercher une molécule</Label>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Nom ou CAS..."
                                value={moleculeSearch}
                                onChange={(e) => setMoleculeSearch(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          {moleculeSearchResults.data && moleculeSearchResults.data.length > 0 && !selectedMolecule && (
                            <ScrollArea className="h-48 border rounded-md">
                              <div className="p-2 space-y-1">
                                {moleculeSearchResults.data.map((molecule) => (
                                  <button
                                    key={molecule.id}
                                    onClick={() => {
                                      setSelectedMolecule(molecule);
                                      setMoleculeSearch("");
                                    }}
                                    className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                                  >
                                    <div className="font-medium">{molecule.name}</div>
                                    {molecule.casNumber && (
                                      <div className="text-sm text-muted-foreground">
                                        CAS: {molecule.casNumber}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          )}
                          
                          {selectedMolecule && (
                            <div className="p-4 border rounded-lg bg-purple-500/5 border-purple-500/20">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold text-purple-700 dark:text-purple-400">
                                    {selectedMolecule.name}
                                  </div>
                                  {selectedMolecule.casNumber && (
                                    <div className="text-sm text-muted-foreground">
                                      CAS: {selectedMolecule.casNumber}
                                    </div>
                                  )}
                                  {selectedMolecule.family && (
                                    <Badge variant="outline" className="mt-2">
                                      {selectedMolecule.family}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedMolecule(null)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Options de liaison */}
                      {selectedPlant && selectedMolecule && (
                        <>
                          <Separator className="my-6" />
                          
                          {linkExists.data && (
                            <Alert variant="destructive" className="mb-6">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Liaison existante</AlertTitle>
                              <AlertDescription>
                                Cette liaison existe déjà dans la base de données.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label>Rôle de la molécule</Label>
                              <Select value={linkRole} onValueChange={setLinkRole}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="majeur">Majeur (&gt;10%)</SelectItem>
                                  <SelectItem value="secondaire">Secondaire (1-10%)</SelectItem>
                                  <SelectItem value="trace">Trace (&lt;1%)</SelectItem>
                                  <SelectItem value="variable">Variable</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Pourcentage typique</Label>
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                placeholder="ex: 25.5"
                                value={linkPercentage}
                                onChange={(e) => setLinkPercentage(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Molécule signature</Label>
                              <Select 
                                value={isSignature ? "yes" : "no"} 
                                onValueChange={(v) => setIsSignature(v === "yes")}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no">Non</SelectItem>
                                  <SelectItem value="yes">Oui (caractéristique)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex justify-center mt-8">
                            <Button
                              size="lg"
                              onClick={handleCreateLink}
                              disabled={createLink.isPending || linkExists.data}
                            >
                              {createLink.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              <Link2 className="mr-2 h-4 w-4" />
                              Créer la liaison
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Orphelins */}
              <TabsContent value="orphans">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Plantes orphelines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-500" />
                        Plantes sans liaisons
                        <Badge variant="secondary">{stats.data?.orphanPlants || 0}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Ces plantes n'ont aucune molécule associée.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          {orphanPlants.data?.map((plant) => (
                            <div
                              key={plant.id}
                              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedPlant(plant);
                                setActiveTab("create");
                              }}
                            >
                              <div className="font-medium">{plant.name}</div>
                              {plant.latinName && (
                                <div className="text-sm text-muted-foreground italic">
                                  {plant.latinName}
                                </div>
                              )}
                            </div>
                          ))}
                          {orphanPlants.data?.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                              Toutes les plantes sont liées !
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  {/* Molécules orphelines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-purple-500" />
                        Molécules sans liaisons
                        <Badge variant="secondary">{stats.data?.orphanMolecules || 0}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Ces molécules n'ont aucune plante source associée.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          {orphanMolecules.data?.map((molecule) => (
                            <div
                              key={molecule.id}
                              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedMolecule(molecule);
                                setActiveTab("create");
                              }}
                            >
                              <div className="font-medium">{molecule.name}</div>
                              {molecule.casNumber && (
                                <div className="text-sm text-muted-foreground">
                                  CAS: {molecule.casNumber}
                                </div>
                              )}
                            </div>
                          ))}
                          {orphanMolecules.data?.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                              Toutes les molécules sont liées !
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Liaisons existantes */}
              <TabsContent value="existing">
                <Card>
                  <CardHeader>
                    <CardTitle>Liaisons existantes</CardTitle>
                    <CardDescription>
                      Liste des liaisons plante-molécule dans la base de données.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {allLinks.data?.map((link: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-green-500" />
                                <span className="font-medium">{link.plantName}</span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <div className="flex items-center gap-2">
                                <Beaker className="h-4 w-4 text-purple-500" />
                                <span className="font-medium">{link.moleculeName}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {link.role && (
                                <Badge variant="outline">{link.role}</Badge>
                              )}
                              {link.percentageTypical && (
                                <Badge variant="secondary">{link.percentageTypical}%</Badge>
                              )}
                              {link.isSignature === 1 && (
                                <Badge className="bg-amber-500">Signature</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLink.mutate({
                                  plantId: link.plantId,
                                  moleculeId: link.moleculeId,
                                })}
                                disabled={deleteLink.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {allLinks.data?.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Info className="h-8 w-8 mx-auto mb-2" />
                            Aucune liaison trouvée.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
