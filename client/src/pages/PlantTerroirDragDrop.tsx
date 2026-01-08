import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
  Link2, 
  Leaf,
  MapPin,
  ArrowLeft,
  Loader2,
  GripVertical,
  X,
  Plus,
  Check,
  Trash2,
  ArrowRight,
  Save
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PendingLink {
  plantId: number;
  plantName: string;
  terroirId: number;
  terroirName: string;
}

export default function PlantTerroirDragDrop() {
  const [searchPlant, setSearchPlant] = useState("");
  const [searchTerroir, setSearchTerroir] = useState("");
  const [selectedPlants, setSelectedPlants] = useState<Set<number>>(new Set());
  const [selectedTerroirs, setSelectedTerroirs] = useState<Set<number>>(new Set());
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
  const [draggedPlant, setDraggedPlant] = useState<any>(null);
  const [dragOverTerroir, setDragOverTerroir] = useState<number | null>(null);

  const utils = trpc.useUtils();

  // Queries
  const { data: plants, isLoading: loadingPlants } = trpc.plants.list.useQuery();
  const { data: terroirs, isLoading: loadingTerroirs } = trpc.terroirs.getAll.useQuery();
  const { data: existingRelations } = trpc.plantTerroirs.getAllWithNames.useQuery();

  // Mutation pour créer plusieurs liaisons
  const createMultipleMutation = trpc.plantTerroirs.createMultiple.useMutation({
    onSuccess: (result) => {
      toast.success(`${result.created} liaison(s) créée(s) avec succès !`);
      if (result.skipped && result.skipped > 0) {
        toast.info(`${result.skipped} liaison(s) ignorée(s) (déjà existantes)`);
      }
      setPendingLinks([]);
      setSelectedPlants(new Set());
      setSelectedTerroirs(new Set());
      utils.plantTerroirs.getAllWithNames.invalidate();
      utils.plantTerroirs.getAuditStats.invalidate();
      utils.plantTerroirs.getNetworkStats.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Set des relations existantes pour vérification rapide
  const existingSet = useMemo(() => {
    if (!existingRelations) return new Set<string>();
    return new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));
  }, [existingRelations]);

  // Filtrer les plantes
  const filteredPlants = useMemo(() => {
    if (!plants) return [];
    if (!searchPlant) return plants;
    return plants.filter((p: any) =>
      p.name?.toLowerCase().includes(searchPlant.toLowerCase()) ||
      p.latinName?.toLowerCase().includes(searchPlant.toLowerCase())
    );
  }, [plants, searchPlant]);

  // Filtrer les terroirs
  const filteredTerroirs = useMemo(() => {
    if (!terroirs) return [];
    if (!searchTerroir) return terroirs;
    return terroirs.filter((t: any) =>
      t.name?.toLowerCase().includes(searchTerroir.toLowerCase()) ||
      t.country?.toLowerCase().includes(searchTerroir.toLowerCase())
    );
  }, [terroirs, searchTerroir]);

  // Vérifier si une liaison existe déjà ou est en attente
  const isLinkExisting = useCallback((plantId: number, terroirId: number) => {
    return existingSet.has(`${plantId}-${terroirId}`);
  }, [existingSet]);

  const isLinkPending = useCallback((plantId: number, terroirId: number) => {
    return pendingLinks.some(l => l.plantId === plantId && l.terroirId === terroirId);
  }, [pendingLinks]);

  // Handlers de sélection
  const togglePlantSelection = (plantId: number) => {
    const newSet = new Set(selectedPlants);
    if (newSet.has(plantId)) {
      newSet.delete(plantId);
    } else {
      newSet.add(plantId);
    }
    setSelectedPlants(newSet);
  };

  const toggleTerroirSelection = (terroirId: number) => {
    const newSet = new Set(selectedTerroirs);
    if (newSet.has(terroirId)) {
      newSet.delete(terroirId);
    } else {
      newSet.add(terroirId);
    }
    setSelectedTerroirs(newSet);
  };

  // Créer des liaisons entre les éléments sélectionnés
  const createLinksFromSelection = () => {
    if (selectedPlants.size === 0 || selectedTerroirs.size === 0) {
      toast.error("Sélectionnez au moins une plante et un terroir");
      return;
    }

    const newLinks: PendingLink[] = [];
    const plantsArray = Array.from(selectedPlants);
    const terroirsArray = Array.from(selectedTerroirs);

    for (const plantId of plantsArray) {
      const plant = plants?.find((p: any) => p.id === plantId);
      if (!plant) continue;

      for (const terroirId of terroirsArray) {
        const terroir = terroirs?.find((t: any) => t.id === terroirId);
        if (!terroir) continue;

        // Vérifier si la liaison existe déjà ou est en attente
        if (!isLinkExisting(plantId, terroirId) && !isLinkPending(plantId, terroirId)) {
          newLinks.push({
            plantId,
            plantName: plant.name,
            terroirId,
            terroirName: terroir.name,
          });
        }
      }
    }

    if (newLinks.length === 0) {
      toast.info("Toutes les liaisons sélectionnées existent déjà");
      return;
    }

    setPendingLinks(prev => [...prev, ...newLinks]);
    toast.success(`${newLinks.length} liaison(s) ajoutée(s) à la file d'attente`);
  };

  // Handlers de drag & drop
  const handleDragStart = (e: React.DragEvent, plant: any) => {
    setDraggedPlant(plant);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent, terroirId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverTerroir(terroirId);
  };

  const handleDragLeave = () => {
    setDragOverTerroir(null);
  };

  const handleDrop = (e: React.DragEvent, terroir: any) => {
    e.preventDefault();
    setDragOverTerroir(null);

    if (!draggedPlant) return;

    // Vérifier si la liaison existe déjà
    if (isLinkExisting(draggedPlant.id, terroir.id)) {
      toast.error("Cette liaison existe déjà");
      return;
    }

    if (isLinkPending(draggedPlant.id, terroir.id)) {
      toast.info("Cette liaison est déjà en attente");
      return;
    }

    setPendingLinks(prev => [...prev, {
      plantId: draggedPlant.id,
      plantName: draggedPlant.name,
      terroirId: terroir.id,
      terroirName: terroir.name,
    }]);

    toast.success(`Liaison ajoutée: ${draggedPlant.name} → ${terroir.name}`);
    setDraggedPlant(null);
  };

  const handleDragEnd = () => {
    setDraggedPlant(null);
    setDragOverTerroir(null);
  };

  // Supprimer une liaison en attente
  const removePendingLink = (index: number) => {
    setPendingLinks(prev => prev.filter((_, i) => i !== index));
  };

  // Vider toutes les liaisons en attente
  const clearPendingLinks = () => {
    setPendingLinks([]);
    toast.info("File d'attente vidée");
  };

  // Sauvegarder toutes les liaisons en attente
  const savePendingLinks = () => {
    if (pendingLinks.length === 0) {
      toast.error("Aucune liaison en attente");
      return;
    }

    createMultipleMutation.mutate(
      pendingLinks.map(l => ({
        plantId: l.plantId,
        terroirId: l.terroirId,
      }))
    );
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
                <Link href="/plant-terroir-linking">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Liaisons
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <GripVertical className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Création en Masse (Drag & Drop)</h1>
                  <p className="text-muted-foreground">
                    Glissez-déposez des plantes sur des terroirs ou sélectionnez plusieurs éléments pour créer des liaisons en masse
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
                  <span className="ml-3 text-muted-foreground">Chargement des données...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Instructions */}
                  <Alert>
                    <GripVertical className="h-4 w-4" />
                    <AlertTitle>Mode Drag & Drop</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Drag & Drop :</strong> Glissez une plante et déposez-la sur un terroir</li>
                        <li><strong>Sélection multiple :</strong> Cochez plusieurs plantes et terroirs, puis cliquez sur "Créer les liaisons"</li>
                        <li>Les liaisons sont ajoutées à une file d'attente avant d'être sauvegardées</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  {/* Grille principale */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne Plantes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-600" />
                          Plantes
                          {selectedPlants.size > 0 && (
                            <Badge variant="secondary">{selectedPlants.size} sélectionnée(s)</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Glissez ou sélectionnez des plantes
                        </CardDescription>
                        <div className="relative mt-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Rechercher..."
                            value={searchPlant}
                            onChange={(e) => setSearchPlant(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-1">
                            {filteredPlants.slice(0, 100).map((plant: any) => (
                              <div
                                key={plant.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, plant)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                                  selectedPlants.has(plant.id) ? "bg-green-500/10 border border-green-500/30" : "hover:bg-accent"
                                } ${draggedPlant?.id === plant.id ? "opacity-50" : ""}`}
                              >
                                <Checkbox
                                  checked={selectedPlants.has(plant.id)}
                                  onCheckedChange={() => togglePlantSelection(plant.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{plant.name}</p>
                                  <p className="text-xs text-muted-foreground italic truncate">{plant.latinName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Colonne Terroirs */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Terroirs
                          {selectedTerroirs.size > 0 && (
                            <Badge variant="secondary">{selectedTerroirs.size} sélectionné(s)</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Déposez des plantes ou sélectionnez des terroirs
                        </CardDescription>
                        <div className="relative mt-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Rechercher..."
                            value={searchTerroir}
                            onChange={(e) => setSearchTerroir(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-1">
                            {filteredTerroirs.slice(0, 100).map((terroir: any) => (
                              <div
                                key={terroir.id}
                                onDragOver={(e) => handleDragOver(e, terroir.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, terroir)}
                                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                  selectedTerroirs.has(terroir.id) ? "bg-blue-500/10 border border-blue-500/30" : "hover:bg-accent"
                                } ${dragOverTerroir === terroir.id ? "bg-blue-500/20 border-2 border-dashed border-blue-500" : ""}`}
                              >
                                <Checkbox
                                  checked={selectedTerroirs.has(terroir.id)}
                                  onCheckedChange={() => toggleTerroirSelection(terroir.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{terroir.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {terroir.country}{terroir.region && `, ${terroir.region}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Colonne File d'attente */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Link2 className="h-5 w-5 text-purple-600" />
                          File d'attente
                          {pendingLinks.length > 0 && (
                            <Badge>{pendingLinks.length}</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Liaisons en attente de sauvegarde
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Boutons d'action pour la sélection */}
                          <div className="flex gap-2">
                            <Button
                              onClick={createLinksFromSelection}
                              disabled={selectedPlants.size === 0 || selectedTerroirs.size === 0}
                              className="flex-1"
                              variant="outline"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Créer les liaisons
                            </Button>
                          </div>

                          {selectedPlants.size > 0 && selectedTerroirs.size > 0 && (
                            <p className="text-xs text-muted-foreground text-center">
                              {selectedPlants.size} plante(s) × {selectedTerroirs.size} terroir(s) = {selectedPlants.size * selectedTerroirs.size} liaison(s) potentielle(s)
                            </p>
                          )}

                          <ScrollArea className="h-[280px]">
                            <div className="space-y-2">
                              {pendingLinks.map((link, index) => (
                                <div
                                  key={`${link.plantId}-${link.terroirId}`}
                                  className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Leaf className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="truncate font-medium">{link.plantName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                      <MapPin className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                      <span className="truncate">{link.terroirName}</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removePendingLink(index)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              {pendingLinks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                  <Link2 className="h-8 w-8 mb-2 opacity-50" />
                                  <p className="text-sm">Aucune liaison en attente</p>
                                  <p className="text-xs">Glissez des plantes ou utilisez la sélection</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>

                          {/* Boutons de sauvegarde */}
                          {pendingLinks.length > 0 && (
                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                onClick={clearPendingLinks}
                                className="flex-1"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Vider
                              </Button>
                              <Button
                                onClick={savePendingLinks}
                                disabled={createMultipleMutation.isPending}
                                className="flex-1"
                              >
                                {createMultipleMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4 mr-2" />
                                )}
                                Sauvegarder ({pendingLinks.length})
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Résumé des statistiques */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-6 justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{plants?.length || 0}</p>
                          <p className="text-sm text-muted-foreground">Plantes disponibles</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{terroirs?.length || 0}</p>
                          <p className="text-sm text-muted-foreground">Terroirs disponibles</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{existingRelations?.length || 0}</p>
                          <p className="text-sm text-muted-foreground">Liaisons existantes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{pendingLinks.length}</p>
                          <p className="text-sm text-muted-foreground">En attente</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
