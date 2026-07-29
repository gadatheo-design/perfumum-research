import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Merge, AlertCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GBIFPreviewModal } from "@/components/GBIFPreviewModal";

export function TerritoriesManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"list" | "duplicates" | "gbif-suggestions">("list");
  const [newTerritory, setNewTerritory] = useState({
    name: "",
    country: "",
    region: "",
    description: "",
  });
  const [selectedTerritories, setSelectedTerritories] = useState<Set<string>>(new Set());
  const [gbifPreviewOpen, setGbifPreviewOpen] = useState(false);
  const [selectedGBIFSuggestion, setSelectedGBIFSuggestion] = useState<any>(null);

  // Récupérer tous les terroirs
  const { data: territories, isLoading, refetch } = trpc.territoriesAdmin.getAllTerritories.useQuery();

  // Détecter les doublons
  const { data: duplicates } = trpc.territoriesAdmin.detectDuplicates.useQuery();

  // Suggestions GBIF
  const { data: gbifSuggestions } = trpc.territoriesAdmin.getGBIFTerritorySuggestions.useQuery();

  // Mutations
  const createMutation = trpc.territoriesAdmin.createTerritory.useMutation();
  const deleteMutation = trpc.territoriesAdmin.deleteTerritory.useMutation();
  const mergeMutation = trpc.territoriesAdmin.mergeTerritories.useMutation();
  const createFromGBIFMutation = trpc.territoriesAdmin.createFromGBIFSuggestion.useMutation();

  // Créer un nouveau terroir
  const handleCreateTerritory = async () => {
    if (!newTerritory.name || !newTerritory.country) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom et le pays",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: newTerritory.name,
        country: newTerritory.country,
        region: newTerritory.region || undefined,
        description: newTerritory.description || undefined,
      });

      toast({
        title: "Succès",
        description: "Terroir créé avec succès",
      });

      setNewTerritory({ name: "", country: "", region: "", description: "" });
      refetch();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la création",
        variant: "destructive",
      });
    }
  };

  // Supprimer un terroir
  const handleDeleteTerritory = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce terroir?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast({ title: "Succès", description: "Terroir supprimé" });
      refetch();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  // Fusionner deux terroirs
  const handleMergeTerritories = async (keepId: string, mergeId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir fusionner ces terroirs?")) return;

    try {
      await mergeMutation.mutateAsync({ keepId, mergeId });
      toast({ title: "Succès", description: "Terroirs fusionnés" });
      refetch();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la fusion",
        variant: "destructive",
      });
    }
  };

  // Ouvrir la modale de prévisualisation GBIF
  const handlePreviewGBIF = (suggestion: any) => {
    setSelectedGBIFSuggestion(suggestion);
    setGbifPreviewOpen(true);
  };

  // Créer à partir d'une suggestion GBIF (après prévisualisation)
  const handleCreateFromGBIF = async () => {
    if (!selectedGBIFSuggestion) return;

    try {
      await createFromGBIFMutation.mutateAsync({
        suggestionId: selectedGBIFSuggestion.id,
        name: selectedGBIFSuggestion.name,
        country: selectedGBIFSuggestion.country,
        region: selectedGBIFSuggestion.region,
        coordinates: selectedGBIFSuggestion.coordinates,
        description: selectedGBIFSuggestion.description,
        autoAssociatePlants: true,
      });

      toast({
        title: "Succès",
        description: `Terroir créé et ${selectedGBIFSuggestion.uniquePlants} plante(s) associée(s)`,
      });

      setGbifPreviewOpen(false);
      setSelectedGBIFSuggestion(null);
      refetch();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la création",
        variant: "destructive",
      });
    }
  };

  // Basculer la sélection d'un terroir
  const toggleTerritorySelection = (id: string) => {
    const newSelected = new Set(selectedTerritories);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTerritories(newSelected);
  };

  // Fusionner les terroirs sélectionnés
  const handleMergeSelected = async () => {
    if (selectedTerritories.size < 2) {
      toast({
        title: "Sélection insuffisante",
        description: "Sélectionnez au moins 2 terroirs pour fusionner",
        variant: "destructive",
      });
      return;
    }

    const terroriesToMerge = Array.from(selectedTerritories);
    const keepId = terroriesToMerge[0];

    try {
      for (let i = 1; i < terroriesToMerge.length; i++) {
        await mergeMutation.mutateAsync({
          keepId,
          mergeId: terroriesToMerge[i],
        });
      }

      toast({
        title: "Succès",
        description: `${terroriesToMerge.length} terroir(s) fusionné(s) avec succès`,
      });

      setSelectedTerritories(new Set());
      refetch();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la fusion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Gestion des Terroirs</h1>
        <p className="text-gray-600 mt-2">
          Gérez les terroirs, détectez les doublons, et explorez les suggestions basées sur GBIF
        </p>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Terroirs ({territories?.length || 0})</TabsTrigger>
          <TabsTrigger value="duplicates">
            Doublons ({duplicates?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="gbif-suggestions">
            Suggestions GBIF ({gbifSuggestions?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Onglet Liste des terroirs */}
        <TabsContent value="list" className="space-y-4">
          {/* Formulaire de création */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Créer un nouveau terroir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nom du terroir"
                  value={newTerritory.name}
                  onChange={(e) => setNewTerritory({ ...newTerritory, name: e.target.value })}
                />
                <Input
                  placeholder="Pays"
                  value={newTerritory.country}
                  onChange={(e) => setNewTerritory({ ...newTerritory, country: e.target.value })}
                />
                <Input
                  placeholder="Région (optionnel)"
                  value={newTerritory.region}
                  onChange={(e) => setNewTerritory({ ...newTerritory, region: e.target.value })}
                />
                <Input
                  placeholder="Description (optionnel)"
                  value={newTerritory.description}
                  onChange={(e) => setNewTerritory({ ...newTerritory, description: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateTerritory} disabled={createMutation.isPending} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer le terroir
              </Button>
            </CardContent>
          </Card>

          {/* Liste des terroirs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terroirs existants</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : territories && territories.length > 0 ? (
                <div className="space-y-3">
                  {territories.map((territory: any) => (
                    <div
                      key={territory.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex-1">
                        <div className="font-semibold">{territory.name}</div>
                        <div className="text-sm text-gray-600">
                          {territory.country}
                          {territory.region && ` • ${territory.region}`}
                        </div>
                        {territory.description && (
                          <div className="text-sm text-gray-500 mt-1">{territory.description}</div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {territory.plantCount} plante(s)
                          </Badge>
                          {territory.coordinates && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <MapPin className="h-3 w-3" />
                              {territory.coordinates.lat.toFixed(2)}, {territory.coordinates.lon.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTerritories.has(territory.id)}
                          onChange={() => toggleTerritorySelection(territory.id)}
                          className="rounded border-gray-300"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTerritory(territory.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Aucun terroir trouvé</div>
              )}
            </CardContent>
          </Card>

          {/* Barre de fusion multiple */}
          {selectedTerritories.size > 0 && (
            <div className="fixed bottom-6 left-6 right-6 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg flex items-center justify-between z-50">
              <div className="text-sm font-semibold text-gray-900">
                {selectedTerritories.size} terroir(s) sélectionné(s)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTerritories(new Set())}
                >
                  Effacer
                </Button>
                <Button
                  size="sm"
                  onClick={handleMergeSelected}
                  disabled={selectedTerritories.size < 2 || mergeMutation.isPending}
                >
                  Fusionner ({selectedTerritories.size})
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Onglet Doublons */}
        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doublons détectés</CardTitle>
              <CardDescription>
                Fusionnez les terroirs en double pour maintenir la qualité des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              {duplicates && duplicates.length > 0 ? (
                <div className="space-y-4">
                  {duplicates.map((group: any) => (
                    <div key={group.group} className="border rounded-lg p-4 bg-amber-50">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-semibold text-amber-900">{group.reason}</div>
                          <div className="text-sm text-amber-700 mt-1">
                            {group.items.length} terroir(s) potentiellement en doublon
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {group.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-600">{item.country}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {(item.similarity * 100).toFixed(0)}% similaire
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {group.items.length === 2 && (
                        <Button
                          size="sm"
                          onClick={() => handleMergeTerritories(group.items[0].id, group.items[1].id)}
                          className="gap-2"
                        >
                          <Merge className="h-4 w-4" />
                          Fusionner
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Aucun doublon détecté</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Suggestions GBIF */}
        <TabsContent value="gbif-suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggestions de terroirs GBIF</CardTitle>
              <CardDescription>
                Terroirs suggérés basés sur les données GBIF et la biodiversité locale
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gbifSuggestions && gbifSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {gbifSuggestions.map((suggestion: any) => (
                    <div
                      key={suggestion.id}
                      className="border rounded-lg p-4 hover:bg-blue-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">{suggestion.name}</div>
                          <div className="text-sm text-gray-600">
                            {suggestion.country}
                            {suggestion.region && ` • ${suggestion.region}`}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {(suggestion.confidence * 100).toFixed(0)}% confiance
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                        <div className="bg-gray-100 rounded p-2">
                          <div className="text-xs text-gray-600">Occurrences GBIF</div>
                          <div className="font-semibold">{suggestion.gbifOccurrences}</div>
                        </div>
                        <div className="bg-gray-100 rounded p-2">
                          <div className="text-xs text-gray-600">Plantes uniques</div>
                          <div className="font-semibold">{suggestion.uniquePlants}</div>
                        </div>
                        <div className="bg-gray-100 rounded p-2">
                          <div className="text-xs text-gray-600">Raison</div>
                          <div className="font-semibold text-xs">{suggestion.reason.split(" ")[0]}</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">{suggestion.reason}</div>

                      <Button
                        size="sm"
                        onClick={() => handlePreviewGBIF(suggestion)}
                        disabled={createFromGBIFMutation.isPending}
                        className="gap-2 w-full"
                      >
                        <Plus className="h-4 w-4" />
                        Prévisualiser et créer
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Aucune suggestion disponible</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modale de prévisualisation GBIF */}
      <GBIFPreviewModal
        open={gbifPreviewOpen}
        onOpenChange={setGbifPreviewOpen}
        suggestion={selectedGBIFSuggestion}
        plants={
          selectedGBIFSuggestion
            ? [
                {
                  id: "p1",
                  latinName: "Vanilla planifolia",
                  commonName: "Vanille",
                  occurrences: 245,
                },
                {
                  id: "p2",
                  latinName: "Cinnamomum verum",
                  commonName: "Cannelle",
                  occurrences: 189,
                },
              ]
            : []
        }
        onConfirm={handleCreateFromGBIF}
        isLoading={createFromGBIFMutation.isPending}
      />
    </div>
  );
}
