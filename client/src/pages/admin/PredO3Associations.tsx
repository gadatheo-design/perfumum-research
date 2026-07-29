import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PredO3Associations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "plants" | "molecules">("overview");
  const [selectedDescriptor, setSelectedDescriptor] = useState<string | null>(null);

  // Récupérer toutes les associations
  const { data: associations, isLoading } = trpc.predO3Associations.getAllAssociations.useQuery();

  // Récupérer les statistiques
  const { data: stats } = trpc.predO3Associations.getAssociationStats.useQuery();

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

  const handleImportAssociation = async (descriptorId: string, item: any, type: "plant" | "molecule") => {
    try {
      if (type === "plant") {
        // Implémenter l'import de plante
        toast({
          title: "Import",
          description: `Plante "${item.commonName}" associée au descripteur "${descriptorId}"`,
        });
      } else {
        // Implémenter l'import de molécule
        toast({
          title: "Import",
          description: `Molécule "${item.name}" associée au descripteur "${descriptorId}"`,
        });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de l'import",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Associations Pred-O3</h1>
        <p className="text-gray-600 mt-2">
          Visualisez les associations Pred-O3 entre descripteurs olfactifs, plantes et molécules
        </p>
      </div>

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
                  {descriptorAssociation.associations.map((assoc: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
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
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {assoc.type === "plant" ? "🌿 Plante" : "⚗️ Molécule"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImportAssociation(descriptorAssociation.descriptorId, assoc, assoc.type)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  {plantResults && plantResults.length > 0 ? (
                    plantResults.map((result: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{result.plant.commonName}</div>
                          <div className="text-sm text-gray-600 italic">{result.plant.latinName}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Descripteur: {result.descriptorName}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImportAssociation(result.descriptorId, result.plant, "plant")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
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
                  {moleculeResults && moleculeResults.length > 0 ? (
                    moleculeResults.map((result: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                      >
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImportAssociation(result.descriptorId, result.molecule, "molecule")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
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
