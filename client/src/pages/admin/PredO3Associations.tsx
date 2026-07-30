import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search, AlertCircle, Plus, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PredO3Associations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "plants" | "molecules">("overview");
  const [selectedDescriptor, setSelectedDescriptor] = useState<string | null>(null);
  const [selectedAssociations, setSelectedAssociations] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);

  // Récupérer toutes les associations
  const { data: associations, isLoading } = trpc.predO3Associations.getAllAssociations.useQuery();

  // Récupérer les statistiques
  const { data: stats } = trpc.predO3Associations.getAssociationStats.useQuery();

  // Procédures d'import
  const importMixedMutation = trpc.predO3BulkImport.importMixedAssociations.useMutation();
  const validateMutation = trpc.predO3BulkImport.validateAssociations.useMutation();

  // Rechercher une plante
  const { data: plantResults } = trpc.predO3Associations.searchPlantInAssociations.useQuery(
    { query: searchTerm },
    { enabled: activeTab === "plants" && searchTerm.length > 0 }
  );

  // Rechercher une molécule
  const { data: moleculeResults } = trpc.predO3Associations.searchMoleculeInAssociations.useQuery(
    { query: searchTerm },
    { enabled: activeTab === "molecules" && searchTerm.length > 0 }
  );

  // Récupérer les associations pour un descripteur spécifique
  const { data: descriptorAssociation } = trpc.predO3Associations.getAssociationsByDescriptor.useQuery(
    { descriptorId: selectedDescriptor || "" },
    { enabled: selectedDescriptor !== null }
  );

  // Générer une clé unique pour chaque association
  const getAssociationKey = (descriptorId: string, item: any, type: "plant" | "molecule") => {
    if (type === "plant") {
      return `plant-${descriptorId}-${item.latinName}`;
    } else {
      return `molecule-${descriptorId}-${item.casNumber || item.name}`;
    }
  };

  // Gérer la sélection d'une association
  const toggleAssociation = (key: string) => {
    const newSelected = new Set(selectedAssociations);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedAssociations(newSelected);
  };

  // Sélectionner/désélectionner tous les résultats de recherche
  const toggleAllResults = () => {
    const newSelected = new Set(selectedAssociations);
    const results = activeTab === "plants" ? plantResults : moleculeResults;

    if (!results) return;

    const allKeysInResults = results.map((result: any) => {
      const type = activeTab === "plants" ? "plant" : "molecule";
      const item = type === "plant" ? result.plant : result.molecule;
      return getAssociationKey(result.descriptorId, item, type);
    });

    const allSelected = allKeysInResults.every((key) => newSelected.has(key));

    if (allSelected) {
      allKeysInResults.forEach((key) => newSelected.delete(key));
    } else {
      allKeysInResults.forEach((key) => newSelected.add(key));
    }

    setSelectedAssociations(newSelected);
  };

  // Préparer les données pour l'import — résolution depuis associations (source de vérité)
  const prepareImportData = () => {
    const importData: any[] = [];
    if (!associations) return importData;

    selectedAssociations.forEach((key) => {
      const [type, descriptorId, ...rest] = key.split("-");
      // Trouver le groupe de descripteur correspondant dans la liste complète
      const group = (associations as any[]).find((g: any) => g.descriptorId === descriptorId);
      if (!group) return;

      if (type === "plant") {
        const latinName = rest.join("-");
        const plant = group.associations?.find(
          (a: any) => a.type === "plant" && a.latinName === latinName
        );
        if (plant) {
          importData.push({
            type: "plant",
            descriptorId: group.descriptorId,
            descriptorName: group.descriptorName,
            latinName: plant.latinName,
            commonName: plant.commonName || "",
            force: 3,
            notes: "Importé depuis Pred-O3",
          });
        }
      } else {
        // type === "molecule" — la clé utilise casNumber ou name
        const keyPart = rest.join("-");
        const molecule = group.associations?.find(
          (a: any) => a.type === "molecule" && (a.casNumber === keyPart || a.name === keyPart)
        );
        if (molecule) {
          importData.push({
            type: "molecule",
            descriptorId: group.descriptorId,
            descriptorName: group.descriptorName,
            name: molecule.name,
            iupacName: molecule.iupacName || "",
            casNumber: molecule.casNumber || "",
            force: 3,
            notes: "Importé depuis Pred-O3",
          });
        }
      }
    });

    return importData;
  };

  // Valider avant import
  const handleValidateBeforeImport = async () => {
    const importData = prepareImportData();

    if (importData.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une association",
        variant: "destructive",
      });
      return;
    }

    try {
      const validation = await validateMutation.mutateAsync({ associations: importData });

      if (validation.invalid > 0) {
        toast({
          title: "Validation échouée",
          description: `${validation.invalid} association(s) invalide(s)`,
          variant: "destructive",
        });
        console.log("Issues:", validation.issues);
      } else {
        toast({
          title: "Validation réussie",
          description: `${validation.valid} association(s) prête(s) pour l'import`,
        });
      }
    } catch (err) {
      toast({
        title: "Erreur de validation",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    }
  };

  // Importer les associations sélectionnées
  const handleImport = async () => {
    const importData = prepareImportData();

    if (importData.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une association",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const result = await importMixedMutation.mutateAsync({ associations: importData });

      toast({
        title: "Import terminé",
        description: result.message,
        variant: result.failed > 0 ? "default" : "default",
      });

      // Réinitialiser la sélection
      setSelectedAssociations(new Set());
    } catch (err) {
      toast({
        title: "Erreur lors de l'import",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Effacer la sélection
  const handleClearSelection = () => {
    setSelectedAssociations(new Set());
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Associations Pred-O3</h1>
        <p className="text-gray-600 mt-2">
          Visualisez et importez les associations Pred-O3 entre descripteurs olfactifs, plantes et molécules
        </p>
      </div>

      {/* Barre d'import */}
      {selectedAssociations.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold">{selectedAssociations.size} association(s) sélectionnée(s)</p>
                  <p className="text-sm text-gray-600">Prêtes pour l'import</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleValidateBeforeImport}
                  disabled={isImporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Valider
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="gap-2"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Importer
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClearSelection}
                  disabled={isImporting}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Effacer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Descripteurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDescriptors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Associations Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssociations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Plantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Molécules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMolecules}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="plants">Plantes</TabsTrigger>
          <TabsTrigger value="molecules">Molécules</TabsTrigger>
        </TabsList>

        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descripteurs Olfactifs</CardTitle>
              <CardDescription>Sélectionnez un descripteur pour voir ses associations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : associations && associations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {associations.map((descriptor: any) => (
                    <button
                      key={descriptor.descriptorId}
                      onClick={() => setSelectedDescriptor(descriptor.descriptorId)}
                      className={`text-left p-4 border rounded-lg transition ${
                        selectedDescriptor === descriptor.descriptorId
                          ? "bg-blue-50 border-blue-500"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <div className="font-semibold">{descriptor.descriptorName}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {descriptor.associations.length} associations
                      </div>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {descriptor.category}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Aucun descripteur trouvé</div>
              )}
            </CardContent>
          </Card>

          {/* Associations du descripteur sélectionné */}
          {selectedDescriptor && descriptorAssociation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{descriptorAssociation.descriptorName}</CardTitle>
                <CardDescription>
                  {descriptorAssociation.associations.length} associations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {descriptorAssociation.associations.map((assoc: any, idx: number) => {
                    const key = getAssociationKey(descriptorAssociation.descriptorId, assoc, assoc.type);
                    const isSelected = selectedAssociations.has(key);

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition ${
                          isSelected ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAssociation(key)}
                        />
                        <div className="flex-1">
                          {assoc.type === "plant" ? (
                            <>
                              <div className="font-medium">{assoc.commonName}</div>
                              <div className="text-sm text-gray-600 italic">{assoc.latinName}</div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium">{assoc.name}</div>
                              <div className="text-sm text-gray-600 italic">{assoc.iupacName}</div>
                              {assoc.casNumber && (
                                <div className="text-xs text-gray-500">CAS: {assoc.casNumber}</div>
                              )}
                            </>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {assoc.type === "plant" ? "🌿 Plante" : "⚗️ Molécule"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Plantes */}
        <TabsContent value="plants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rechercher une Plante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom latin ou commun..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchTerm && (
                <div className="space-y-2">
                  {plantResults && plantResults.length > 0 && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">{plantResults.length} résultat(s)</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={toggleAllResults}
                        className="text-xs"
                      >
                        {plantResults.every((r: any) =>
                          selectedAssociations.has(
                            getAssociationKey(r.descriptorId, r.plant, "plant")
                          )
                        )
                          ? "Désélectionner tout"
                          : "Sélectionner tout"}
                      </Button>
                    </div>
                  )}

                  {plantResults && plantResults.length > 0 ? (
                    plantResults.map((result: any, idx: number) => {
                      const key = getAssociationKey(result.descriptorId, result.plant, "plant");
                      const isSelected = selectedAssociations.has(key);

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 border rounded-lg transition ${
                            isSelected ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAssociation(key)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{result.plant.commonName}</div>
                            <div className="text-sm text-gray-600 italic">{result.plant.latinName}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Descripteur: {result.descriptorName}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">Aucune plante trouvée</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Molécules */}
        <TabsContent value="molecules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rechercher une Molécule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, IUPAC ou CAS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchTerm && (
                <div className="space-y-2">
                  {moleculeResults && moleculeResults.length > 0 && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">{moleculeResults.length} résultat(s)</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={toggleAllResults}
                        className="text-xs"
                      >
                        {moleculeResults.every((r: any) =>
                          selectedAssociations.has(
                            getAssociationKey(r.descriptorId, r.molecule, "molecule")
                          )
                        )
                          ? "Désélectionner tout"
                          : "Sélectionner tout"}
                      </Button>
                    </div>
                  )}

                  {moleculeResults && moleculeResults.length > 0 ? (
                    moleculeResults.map((result: any, idx: number) => {
                      const key = getAssociationKey(result.descriptorId, result.molecule, "molecule");
                      const isSelected = selectedAssociations.has(key);

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 border rounded-lg transition ${
                            isSelected ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleAssociation(key)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{result.molecule.name}</div>
                            <div className="text-sm text-gray-600 italic">{result.molecule.iupacName}</div>
                            {result.molecule.casNumber && (
                              <div className="text-xs text-gray-500">CAS: {result.molecule.casNumber}</div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Descripteur: {result.descriptorName}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">Aucune molécule trouvée</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
