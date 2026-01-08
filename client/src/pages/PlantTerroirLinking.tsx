import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Link2, 
  Leaf,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Loader2,
  BarChart3,
  Target,
  TrendingUp,
  Globe,
  Mountain
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PlantTerroirLinking() {
  const [activeTab, setActiveTab] = useState("statistiques");
  const [recherchePlante, setRecherchePlante] = useState("");
  const [rechercheTerroir, setRechercheTerroir] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [selectedTerroir, setSelectedTerroir] = useState<any>(null);
  
  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ plantId: number; terroirId: number; plantName: string; terroirName: string } | null>(null);
  
  // Form data for new link
  const [linkFormData, setLinkFormData] = useState({
    plantId: 0,
    terroirId: 0,
    localName: "",
    cultivationStart: "",
    annualProduction: "",
    qualityNotes: "",
    notes: "",
  });

  const utils = trpc.useUtils();

  // Queries
  const { data: plants, isLoading: loadingPlants } = trpc.plants.list.useQuery();
  const { data: terroirs, isLoading: loadingTerroirs } = trpc.terroirs.getAll.useQuery();
  const { data: networkStats } = trpc.plantTerroirs.getNetworkStats.useQuery();
  const { data: allRelations } = trpc.plantTerroirs.getAll.useQuery();
  
  // Terroirs d'une plante sélectionnée
  const { data: plantTerroirs } = trpc.plantTerroirs.getByPlant.useQuery(
    selectedPlant?.id,
    { enabled: !!selectedPlant }
  );
  
  // Plantes d'un terroir sélectionné
  const { data: terroirPlants } = trpc.plantTerroirs.getByTerroir.useQuery(
    selectedTerroir?.id,
    { enabled: !!selectedTerroir }
  );

  // Mutations
  const createLinkMutation = trpc.plantTerroirs.create.useMutation({
    onSuccess: () => {
      toast.success("Liaison créée avec succès !");
      utils.plantTerroirs.getAll.invalidate();
      utils.plantTerroirs.getNetworkStats.invalidate();
      if (selectedPlant) utils.plantTerroirs.getByPlant.invalidate(selectedPlant.id);
      if (selectedTerroir) utils.plantTerroirs.getByTerroir.invalidate(selectedTerroir.id);
      setLinkDialogOpen(false);
      resetLinkForm();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteLinkMutation = trpc.plantTerroirs.delete.useMutation({
    onSuccess: () => {
      toast.success("Liaison supprimée avec succès !");
      utils.plantTerroirs.getAll.invalidate();
      utils.plantTerroirs.getNetworkStats.invalidate();
      if (selectedPlant) utils.plantTerroirs.getByPlant.invalidate(selectedPlant.id);
      if (selectedTerroir) utils.plantTerroirs.getByTerroir.invalidate(selectedTerroir.id);
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const resetLinkForm = () => {
    setLinkFormData({
      plantId: 0,
      terroirId: 0,
      localName: "",
      cultivationStart: "",
      annualProduction: "",
      qualityNotes: "",
      notes: "",
    });
  };

  // Statistiques de couverture
  const stats = useMemo(() => {
    const totalPlants = plants?.length || 0;
    const totalTerroirs = terroirs?.length || 0;
    const plantsWithTerroirs = networkStats?.plantsWithTerroirs || 0;
    const terroirsWithPlants = networkStats?.terroirsWithPlants || 0;
    const totalRelationsCount = networkStats?.totalRelations || 0;

    return {
      totalPlants,
      totalTerroirs,
      plantsWithTerroirs,
      terroirsWithPlants,
      totalRelations: totalRelationsCount,
      couverturePlantes: totalPlants > 0 ? Math.round((plantsWithTerroirs / totalPlants) * 100) : 0,
      couvertureTerroirs: totalTerroirs > 0 ? Math.round((terroirsWithPlants / totalTerroirs) * 100) : 0,
      plantsSansTerroirs: plants?.filter(p => {
        const hasTerroir = allRelations?.some(r => r.plantId === p.id);
        return !hasTerroir;
      }).slice(0, 20) || [],
      terroirsSansPlantes: terroirs?.filter(t => {
        const hasPlant = allRelations?.some(r => r.terroirId === t.id);
        return !hasPlant;
      }).slice(0, 20) || [],
    };
  }, [plants, terroirs, networkStats, allRelations]);

  // Filtrer plantes
  const plantesFiltrees = useMemo(() => {
    if (!plants) return [];
    return plants.filter((p: any) =>
      p.name?.toLowerCase().includes(recherchePlante.toLowerCase()) ||
      p.latinName?.toLowerCase().includes(recherchePlante.toLowerCase())
    );
  }, [plants, recherchePlante]);

  // Filtrer terroirs
  const terroirsFiltres = useMemo(() => {
    if (!terroirs) return [];
    return terroirs.filter((t: any) =>
      t.name?.toLowerCase().includes(rechercheTerroir.toLowerCase()) ||
      t.country?.toLowerCase().includes(rechercheTerroir.toLowerCase()) ||
      t.region?.toLowerCase().includes(rechercheTerroir.toLowerCase())
    );
  }, [terroirs, rechercheTerroir]);

  // Handlers
  const openLinkDialog = (plant?: any, terroir?: any) => {
    resetLinkForm();
    if (plant) {
      setLinkFormData(prev => ({ ...prev, plantId: plant.id }));
    }
    if (terroir) {
      setLinkFormData(prev => ({ ...prev, terroirId: terroir.id }));
    }
    setLinkDialogOpen(true);
  };

  const handleCreateLink = () => {
    if (!linkFormData.plantId || !linkFormData.terroirId) {
      toast.error("Veuillez sélectionner une plante et un terroir");
      return;
    }
    
    createLinkMutation.mutate({
      plantId: linkFormData.plantId,
      terroirId: linkFormData.terroirId,
      localName: linkFormData.localName || undefined,
      cultivationStart: linkFormData.cultivationStart ? parseInt(linkFormData.cultivationStart) : undefined,
      annualProduction: linkFormData.annualProduction || undefined,
      qualityNotes: linkFormData.qualityNotes || undefined,
      notes: linkFormData.notes || undefined,
    });
  };

  const confirmDeleteLink = (plantId: number, terroirId: number, plantName: string, terroirName: string) => {
    setLinkToDelete({ plantId, terroirId, plantName, terroirName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteLink = () => {
    if (linkToDelete) {
      deleteLinkMutation.mutate({
        plantId: linkToDelete.plantId,
        terroirId: linkToDelete.terroirId,
      });
    }
  };

  const selectPlantFromStats = (plant: any) => {
    setSelectedPlant(plant);
    setActiveTab("par-plante");
  };

  const selectTerroirFromStats = (terroir: any) => {
    setSelectedTerroir(terroir);
    setActiveTab("par-terroir");
  };

  const isLoading = loadingPlants || loadingTerroirs;

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
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Admin
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Link2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Liaison Plante ↔ Terroir</h1>
                  <p className="text-muted-foreground">
                    Associez des plantes à leurs terroirs d'origine pour enrichir la base de données
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="statistiques" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Statistiques
                  </TabsTrigger>
                  <TabsTrigger value="par-plante" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Par plante
                  </TabsTrigger>
                  <TabsTrigger value="par-terroir" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Par terroir
                  </TabsTrigger>
                  <TabsTrigger value="liaisons-rapides" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Liaisons rapides
                  </TabsTrigger>
                </TabsList>

                {/* Tab Statistiques */}
                <TabsContent value="statistiques" className="space-y-6">
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Couverture Plantes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{stats.couverturePlantes}%</span>
                          <span className="text-sm text-muted-foreground mb-1">
                            ({stats.plantsWithTerroirs}/{stats.totalPlants})
                          </span>
                        </div>
                        <Progress value={stats.couverturePlantes} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Objectif : 20%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Couverture Terroirs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{stats.couvertureTerroirs}%</span>
                          <span className="text-sm text-muted-foreground mb-1">
                            ({stats.terroirsWithPlants}/{stats.totalTerroirs})
                          </span>
                        </div>
                        <Progress value={stats.couvertureTerroirs} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Objectif : 30%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total liaisons
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{stats.totalRelations}</span>
                          <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Liaisons plante-terroir créées
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Plantes sans terroirs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-amber-500" />
                        Plantes sans terroir ({stats.totalPlants - stats.plantsWithTerroirs})
                      </CardTitle>
                      <CardDescription>
                        Ces plantes n'ont pas encore de terroir associé
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.plantsSansTerroirs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Toutes les plantes ont un terroir associé !
                        </p>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Nom latin</TableHead>
                                <TableHead>Famille</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.plantsSansTerroirs.map((p: any) => (
                                <TableRow key={p.id}>
                                  <TableCell className="font-medium">{p.name}</TableCell>
                                  <TableCell className="italic text-muted-foreground">
                                    {p.latinName || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {p.family && <Badge variant="outline">{p.family}</Badge>}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => selectPlantFromStats(p)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Ajouter
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Terroirs sans plantes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        Terroirs sans plantes ({stats.totalTerroirs - stats.terroirsWithPlants})
                      </CardTitle>
                      <CardDescription>
                        Ces terroirs n'ont pas encore de plantes associées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.terroirsSansPlantes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Tous les terroirs ont des plantes associées !
                        </p>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Pays</TableHead>
                                <TableHead>Région</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.terroirsSansPlantes.map((t: any) => (
                                <TableRow key={t.id}>
                                  <TableCell className="font-medium">{t.name}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4 text-muted-foreground" />
                                      {t.country || "-"}
                                    </div>
                                  </TableCell>
                                  <TableCell>{t.region || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => selectTerroirFromStats(t)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Ajouter
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Par plante */}
                <TabsContent value="par-plante" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sélectionner une plante</CardTitle>
                      <CardDescription>
                        Choisissez une plante pour voir et gérer ses terroirs associés
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher une plante..."
                          value={recherchePlante}
                          onChange={(e) => setRecherchePlante(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {recherchePlante && plantesFiltrees.length > 0 && (
                        <div className="border rounded-lg p-2 max-h-60 overflow-y-auto space-y-1">
                          {plantesFiltrees.slice(0, 10).map((p: any) => (
                            <div
                              key={p.id}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedPlant?.id === p.id ? "bg-primary/10" : "hover:bg-accent"
                              }`}
                              onClick={() => setSelectedPlant(p)}
                            >
                              <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground italic">{p.latinName}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedPlant && (
                        <Alert>
                          <Leaf className="h-4 w-4" />
                          <AlertDescription>
                            Plante sélectionnée : <strong>{selectedPlant.name}</strong>
                            {selectedPlant.latinName && (
                              <span className="italic ml-1">({selectedPlant.latinName})</span>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {selectedPlant && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Terroirs de {selectedPlant.name}</CardTitle>
                            <CardDescription>
                              {plantTerroirs?.length || 0} terroir(s) associé(s)
                            </CardDescription>
                          </div>
                          <Button onClick={() => openLinkDialog(selectedPlant)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un terroir
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {!plantTerroirs || plantTerroirs.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Aucun terroir associé à cette plante.
                          </p>
                        ) : (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Terroir</TableHead>
                                  <TableHead>Nom local</TableHead>
                                  <TableHead>Pays</TableHead>
                                  <TableHead>Notes</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {plantTerroirs.map((pt: any) => (
                                  <TableRow key={pt.terroirId}>
                                    <TableCell className="font-medium">
                                      {pt.terroirName || `Terroir #${pt.terroirId}`}
                                    </TableCell>
                                    <TableCell>{pt.localName || "-"}</TableCell>
                                    <TableCell>{pt.country || "-"}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                      {pt.notes || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => confirmDeleteLink(
                                          selectedPlant.id,
                                          pt.terroirId,
                                          selectedPlant.name,
                                          pt.terroirName || `Terroir #${pt.terroirId}`
                                        )}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Tab Par terroir */}
                <TabsContent value="par-terroir" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sélectionner un terroir</CardTitle>
                      <CardDescription>
                        Choisissez un terroir pour voir et gérer ses plantes associées
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher un terroir..."
                          value={rechercheTerroir}
                          onChange={(e) => setRechercheTerroir(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {rechercheTerroir && terroirsFiltres.length > 0 && (
                        <div className="border rounded-lg p-2 max-h-60 overflow-y-auto space-y-1">
                          {terroirsFiltres.slice(0, 10).map((t: any) => (
                            <div
                              key={t.id}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedTerroir?.id === t.id ? "bg-primary/10" : "hover:bg-accent"
                              }`}
                              onClick={() => setSelectedTerroir(t)}
                            >
                              <div>
                                <p className="font-medium">{t.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {t.country}{t.region && `, ${t.region}`}
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedTerroir && (
                        <Alert>
                          <MapPin className="h-4 w-4" />
                          <AlertDescription>
                            Terroir sélectionné : <strong>{selectedTerroir.name}</strong>
                            {selectedTerroir.country && (
                              <span className="ml-1">({selectedTerroir.country})</span>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {selectedTerroir && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Plantes de {selectedTerroir.name}</CardTitle>
                            <CardDescription>
                              {terroirPlants?.length || 0} plante(s) associée(s)
                            </CardDescription>
                          </div>
                          <Button onClick={() => openLinkDialog(undefined, selectedTerroir)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une plante
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {!terroirPlants || terroirPlants.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Aucune plante associée à ce terroir.
                          </p>
                        ) : (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Plante</TableHead>
                                  <TableHead>Nom local</TableHead>
                                  <TableHead>Production</TableHead>
                                  <TableHead>Notes</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {terroirPlants.map((tp: any) => (
                                  <TableRow key={tp.plantId}>
                                    <TableCell className="font-medium">
                                      {tp.plantName || `Plante #${tp.plantId}`}
                                    </TableCell>
                                    <TableCell>{tp.localName || "-"}</TableCell>
                                    <TableCell>{tp.annualProduction || "-"}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                      {tp.notes || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => confirmDeleteLink(
                                          tp.plantId,
                                          selectedTerroir.id,
                                          tp.plantName || `Plante #${tp.plantId}`,
                                          selectedTerroir.name
                                        )}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Tab Liaisons rapides */}
                <TabsContent value="liaisons-rapides" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Créer une liaison rapidement</CardTitle>
                      <CardDescription>
                        Sélectionnez une plante et un terroir pour créer une liaison
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => openLinkDialog()} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle liaison plante-terroir
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Liaisons récentes */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Liaisons existantes</CardTitle>
                      <CardDescription>
                        {allRelations?.length || 0} liaisons plante-terroir dans la base
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!allRelations || allRelations.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Aucune liaison créée pour le moment.
                        </p>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Plante</TableHead>
                                <TableHead>Terroir</TableHead>
                                <TableHead>Nom local</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allRelations.slice(0, 20).map((rel: any, index: number) => (
                                <TableRow key={`${rel.plantId}-${rel.terroirId}-${index}`}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      <Leaf className="h-4 w-4 text-green-600" />
                                      {rel.plantName}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-blue-600" />
                                      Terroir #{rel.terroirId}
                                    </div>
                                  </TableCell>
                                  <TableCell>{rel.localName || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => confirmDeleteLink(
                                        rel.plantId,
                                        rel.terroirId,
                                        rel.plantName,
                                        `Terroir #${rel.terroirId}`
                                      )}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      {/* Dialog de création de liaison */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer une liaison plante-terroir</DialogTitle>
            <DialogDescription>
              Associez une plante à un terroir d'origine
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plante *</Label>
              <Select
                value={linkFormData.plantId ? linkFormData.plantId.toString() : "none"}
                onValueChange={(v) => setLinkFormData(prev => ({ ...prev, plantId: v === "none" ? 0 : parseInt(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une plante..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sélectionner...</SelectItem>
                  {plants?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name} {p.latinName && `(${p.latinName})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Terroir *</Label>
              <Select
                value={linkFormData.terroirId ? linkFormData.terroirId.toString() : "none"}
                onValueChange={(v) => setLinkFormData(prev => ({ ...prev, terroirId: v === "none" ? 0 : parseInt(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un terroir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sélectionner...</SelectItem>
                  {terroirs?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name} ({t.country}{t.region && `, ${t.region}`})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nom local (optionnel)</Label>
              <Input
                value={linkFormData.localName}
                onChange={(e) => setLinkFormData(prev => ({ ...prev, localName: e.target.value }))}
                placeholder="Nom de la plante dans ce terroir..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Début de culture (année)</Label>
                <Input
                  type="number"
                  value={linkFormData.cultivationStart}
                  onChange={(e) => setLinkFormData(prev => ({ ...prev, cultivationStart: e.target.value }))}
                  placeholder="ex: 1850"
                />
              </div>
              <div className="space-y-2">
                <Label>Production annuelle</Label>
                <Input
                  value={linkFormData.annualProduction}
                  onChange={(e) => setLinkFormData(prev => ({ ...prev, annualProduction: e.target.value }))}
                  placeholder="ex: 500 tonnes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={linkFormData.notes}
                onChange={(e) => setLinkFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Informations complémentaires..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)} disabled={createLinkMutation.isPending}>
              Annuler
            </Button>
            <Button 
              onClick={handleCreateLink} 
              disabled={!linkFormData.plantId || !linkFormData.terroirId || createLinkMutation.isPending}
            >
              {createLinkMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer la liaison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la liaison entre "{linkToDelete?.plantName}" et "{linkToDelete?.terroirName}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLinkMutation.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLink}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteLinkMutation.isPending}
            >
              {deleteLinkMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
