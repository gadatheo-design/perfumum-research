// @ts-nocheck
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Link2, 
  Leaf,
  MapPin,
  ArrowLeft,
  Loader2,
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Filter
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PlantTerroirAudit() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchPlant, setSearchPlant] = useState("");
  const [searchTerroir, setSearchTerroir] = useState("");
  const [filterConfidence, setFilterConfidence] = useState<string>("all");

  const utils = trpc.useUtils();

  // Queries
  const { data: auditStats, isLoading: loadingAudit } = trpc.plantTerroirs.getAuditStats.useQuery();
  const { data: suggestions, isLoading: loadingSuggestions } = trpc.plantTerroirs.getSuggestions.useQuery();
  const { data: allRelations, isLoading: loadingRelations } = trpc.plantTerroirs.getAllWithNames.useQuery();

  // Mutation pour créer une liaison depuis une suggestion
  const createLinkMutation = trpc.plantTerroirs.create.useMutation({
    onSuccess: () => {
      toast.success("Liaison créée avec succès !");
      utils.plantTerroirs.getAuditStats.invalidate();
      utils.plantTerroirs.getSuggestions.invalidate();
      utils.plantTerroirs.getAllWithNames.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filtrer les suggestions
  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    let filtered = suggestions;
    
    if (filterConfidence !== "all") {
      filtered = filtered.filter(s => s.confidence === filterConfidence);
    }
    
    if (searchPlant) {
      filtered = filtered.filter(s => 
        s.plantName.toLowerCase().includes(searchPlant.toLowerCase())
      );
    }
    
    if (searchTerroir) {
      filtered = filtered.filter(s => 
        s.terroirName.toLowerCase().includes(searchTerroir.toLowerCase())
      );
    }
    
    return filtered;
  }, [suggestions, filterConfidence, searchPlant, searchTerroir]);

  // Filtrer les plantes sans terroir
  const filteredPlantsWithoutTerroir = useMemo(() => {
    if (!auditStats?.plantsWithoutTerroirList) return [];
    if (!searchPlant) return auditStats?.plantsWithoutTerroirList;
    return auditStats?.plantsWithoutTerroirList.filter((p: any) =>
      p.name?.toLowerCase().includes(searchPlant.toLowerCase()) ||
      p.latinName?.toLowerCase().includes(searchPlant.toLowerCase())
    );
  }, [auditStats?.plantsWithoutTerroirList, searchPlant]);

  // Filtrer les terroirs sans plante
  const filteredTerroirsWithoutPlant = useMemo(() => {
    if (!auditStats?.terroirsWithoutPlantList) return [];
    if (!searchTerroir) return auditStats?.terroirsWithoutPlantList;
    return auditStats?.terroirsWithoutPlantList.filter((t: any) =>
      t.name?.toLowerCase().includes(searchTerroir.toLowerCase()) ||
      t.country?.toLowerCase().includes(searchTerroir.toLowerCase())
    );
  }, [auditStats?.terroirsWithoutPlantList, searchTerroir]);

  const isLoading = loadingAudit || loadingSuggestions || loadingRelations;

  const handleApplySuggestion = (suggestion: any) => {
    createLinkMutation.mutate({
      plantId: suggestion.plantId,
      terroirId: suggestion.terroirId,
      notes: `Suggestion automatique: ${suggestion.reason}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/plant-terroir-linking">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Liaisons
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <BarChart3 className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Audit des Liaisons Plante ↔ Terroir</h1>
                  <p className="text-muted-foreground">
                    Identifiez les priorités et les lacunes dans les liaisons existantes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Chargement des statistiques...</span>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Vue d'ensemble
                    </TabsTrigger>
                    <TabsTrigger value="priorities" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Priorités
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Suggestions
                    </TabsTrigger>
                    <TabsTrigger value="gaps" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Lacunes
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Vue d'ensemble */}
                  <TabsContent value="overview" className="space-y-6">
                    {/* Statistiques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Plantes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{auditStats?.totalPlants || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {auditStats?.plantsWithTerroir || 0} avec terroir ({auditStats?.coveragePlants || 0}%)
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Terroirs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{auditStats?.totalTerroirs || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {auditStats?.terroirsWithPlant || 0} avec plantes ({auditStats?.coverageTerroirs || 0}%)
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Liaisons
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-600">{auditStats?.totalRelations || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Relations plante-terroir
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-amber-600">{suggestions?.length || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Liaisons suggérées
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Barres de progression */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-600" />
                            Couverture des Plantes
                          </CardTitle>
                          <CardDescription>
                            Pourcentage de plantes liées à au moins un terroir
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{auditStats?.plantsWithTerroir || 0} plantes liées</span>
                              <span className="font-medium">{auditStats?.coveragePlants || 0}%</span>
                            </div>
                            <Progress value={auditStats?.coveragePlants || 0} className="h-3" />
                            <p className="text-xs text-muted-foreground">
                              Objectif : 20% de couverture
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Couverture des Terroirs
                          </CardTitle>
                          <CardDescription>
                            Pourcentage de terroirs liés à au moins une plante
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{auditStats?.terroirsWithPlant || 0} terroirs liés</span>
                              <span className="font-medium">{auditStats?.coverageTerroirs || 0}%</span>
                            </div>
                            <Progress value={auditStats?.coverageTerroirs || 0} className="h-3" />
                            <p className="text-xs text-muted-foreground">
                              Objectif : 50% de couverture
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Top plantes et terroirs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Top Plantes (par nombre de terroirs)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                              {auditStats?.topPlantsByTerroirs?.map((plant: any, index: number) => (
                                <div key={plant.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-muted-foreground w-6">
                                      #{index + 1}
                                    </span>
                                    <div>
                                      <p className="font-medium">{plant.name}</p>
                                      <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">{plant.terroirCount} terroirs</Badge>
                                </div>
                              ))}
                              {(!auditStats?.topPlantsByTerroirs || auditStats?.topPlantsByTerroirs.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  Aucune plante avec terroir
                                </p>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Top Terroirs (par nombre de plantes)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                              {auditStats?.topTerroirsByPlants?.map((terroir: any, index: number) => (
                                <div key={terroir.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-muted-foreground w-6">
                                      #{index + 1}
                                    </span>
                                    <div>
                                      <p className="font-medium">{terroir.name}</p>
                                      <p className="text-xs text-muted-foreground">{terroir.country}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary">{terroir.plantCount} plantes</Badge>
                                </div>
                              ))}
                              {(!auditStats?.topTerroirsByPlants || auditStats?.topTerroirsByPlants.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  Aucun terroir avec plantes
                                </p>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Tab Priorités */}
                  <TabsContent value="priorities" className="space-y-6">
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertTitle>Priorités identifiées</AlertTitle>
                      <AlertDescription>
                        Plantes et terroirs prioritaires basés sur leur catégorie et importance dans la base de données.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-amber-600" />
                            Plantes Prioritaires sans Terroir
                          </CardTitle>
                          <CardDescription>
                            Plantes aromatiques, médicinales ou de parfumerie sans liaison
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px]">
                            <div className="space-y-2">
                              {auditStats?.priorityPlantsWithoutTerroir?.map((plant: any) => (
                                <div key={plant.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                                  <div>
                                    <p className="font-medium">{plant.name}</p>
                                    <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                                    <Badge variant="outline" className="mt-1 text-xs">
                                      {plant.category}
                                    </Badge>
                                  </div>
                                  <Link href={`/plant-terroir-linking?plantId=${plant.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Link2 className="h-4 w-4 mr-1" />
                                      Lier
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                              {(!auditStats?.priorityPlantsWithoutTerroir || auditStats?.priorityPlantsWithoutTerroir.length === 0) && (
                                <div className="flex items-center justify-center py-8 text-muted-foreground">
                                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                                  Toutes les plantes prioritaires sont liées !
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-amber-600" />
                            Terroirs Prioritaires sans Plante
                          </CardTitle>
                          <CardDescription>
                            Terroirs de pays importants (France, Italie, Bulgarie...) sans liaison
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px]">
                            <div className="space-y-2">
                              {auditStats?.priorityTerroirsWithoutPlant?.map((terroir: any) => (
                                <div key={terroir.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                                  <div>
                                    <p className="font-medium">{terroir.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {terroir.country}{terroir.region && `, ${terroir.region}`}
                                    </p>
                                    {terroir.climateType && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {terroir.climateType}
                                      </Badge>
                                    )}
                                  </div>
                                  <Link href={`/plant-terroir-linking?terroirId=${terroir.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Link2 className="h-4 w-4 mr-1" />
                                      Lier
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                              {(!auditStats?.priorityTerroirsWithoutPlant || auditStats?.priorityTerroirsWithoutPlant.length === 0) && (
                                <div className="flex items-center justify-center py-8 text-muted-foreground">
                                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                                  Tous les terroirs prioritaires sont liés !
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Tab Suggestions */}
                  <TabsContent value="suggestions" className="space-y-6">
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertTitle>Suggestions automatiques</AlertTitle>
                      <AlertDescription>
                        Liaisons suggérées basées sur l'analyse des origines géographiques des plantes et des terroirs.
                      </AlertDescription>
                    </Alert>

                    {/* Filtres */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Filtrer par plante..."
                                value={searchPlant}
                                onChange={(e) => setSearchPlant(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Filtrer par terroir..."
                                value={searchTerroir}
                                onChange={(e) => setSearchTerroir(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={filterConfidence === "all" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFilterConfidence("all")}
                            >
                              Tous
                            </Button>
                            <Button
                              variant={filterConfidence === "high" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFilterConfidence("high")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                              Haute
                            </Button>
                            <Button
                              variant={filterConfidence === "medium" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFilterConfidence("medium")}
                            >
                              <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
                              Moyenne
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Liste des suggestions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {filteredSuggestions.length} suggestion(s) trouvée(s)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-3">
                            {filteredSuggestions.map((suggestion, index) => (
                              <div 
                                key={`${suggestion.plantId}-${suggestion.terroirId}`}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-600" />
                                    <div>
                                      <p className="font-medium">{suggestion.plantName}</p>
                                    </div>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <div>
                                      <p className="font-medium">{suggestion.terroirName}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    variant={suggestion.confidence === 'high' ? 'default' : 'secondary'}
                                    className={suggestion.confidence === 'high' ? 'bg-green-600' : ''}
                                  >
                                    {suggestion.confidence === 'high' ? 'Haute confiance' : 'Confiance moyenne'}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplySuggestion(suggestion)}
                                    disabled={createLinkMutation.isPending}
                                  >
                                    {createLinkMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Link2 className="h-4 w-4 mr-1" />
                                        Appliquer
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {filteredSuggestions.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Lightbulb className="h-12 w-12 mb-4 opacity-50" />
                                <p>Aucune suggestion trouvée</p>
                                <p className="text-sm">Essayez de modifier les filtres</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Lacunes */}
                  <TabsContent value="gaps" className="space-y-6">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Lacunes identifiées</AlertTitle>
                      <AlertDescription>
                        Liste complète des plantes et terroirs sans aucune liaison.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-red-600" />
                                Plantes sans Terroir
                              </CardTitle>
                              <CardDescription>
                                {auditStats?.plantsWithoutTerroir || 0} plantes non liées
                              </CardDescription>
                            </div>
                          </div>
                          <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Rechercher une plante..."
                              value={searchPlant}
                              onChange={(e) => setSearchPlant(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px]">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nom</TableHead>
                                  <TableHead>Catégorie</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredPlantsWithoutTerroir.map((plant: any) => (
                                  <TableRow key={plant.id}>
                                    <TableCell>
                                      <div>
                                        <p className="font-medium">{plant.name}</p>
                                        <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{plant.category || '-'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Link href={`/plant-terroir-linking?plantId=${plant.id}`}>
                                        <Button size="sm" variant="ghost">
                                          <ExternalLink className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-red-600" />
                                Terroirs sans Plante
                              </CardTitle>
                              <CardDescription>
                                {auditStats?.terroirsWithoutPlant || 0} terroirs non liés
                              </CardDescription>
                            </div>
                          </div>
                          <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Rechercher un terroir..."
                              value={searchTerroir}
                              onChange={(e) => setSearchTerroir(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px]">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nom</TableHead>
                                  <TableHead>Pays</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredTerroirsWithoutPlant.map((terroir: any) => (
                                  <TableRow key={terroir.id}>
                                    <TableCell>
                                      <p className="font-medium">{terroir.name}</p>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{terroir.country || '-'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Link href={`/plant-terroir-linking?terroirId=${terroir.id}`}>
                                        <Button size="sm" variant="ghost">
                                          <ExternalLink className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
