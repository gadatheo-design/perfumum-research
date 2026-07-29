import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Star } from "lucide-react";
import { DescriptorLinkModal } from "./DescriptorLinkModal";
import { useToast } from "@/hooks/use-toast";

interface DescriptorOccurrencesProps {
  descriptorId: string;
  descriptorName: string;
}

export function DescriptorOccurrences({ descriptorId, descriptorName }: DescriptorOccurrencesProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"plants" | "molecules">("plants");

  // Récupérer les plantes associées
  const { data: plants, isLoading: plantsLoading, refetch: refetchPlants } =
    trpc.descriptorLinks.getPlantsByDescriptor.useQuery({ descriptorId });

  // Récupérer les molécules associées
  const { data: molecules, isLoading: moleculesLoading, refetch: refetchMolecules } =
    trpc.descriptorLinks.getMoleculesByDescriptor.useQuery({ descriptorId });

  // Mutations
  const unlinkPlantMutation = trpc.descriptorLinks.unlinkPlantFromDescriptor.useMutation();
  const unlinkMoleculeMutation = trpc.descriptorLinks.unlinkMoleculeFromDescriptor.useMutation();

  const handleUnlinkPlant = async (linkId: number) => {
    try {
      await unlinkPlantMutation.mutateAsync({ linkId });
      toast({ title: "Succès", description: "Plante dissociée" });
      refetchPlants();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la dissociation",
        variant: "destructive",
      });
    }
  };

  const handleUnlinkMolecule = async (linkId: number) => {
    try {
      await unlinkMoleculeMutation.mutateAsync({ linkId });
      toast({ title: "Succès", description: "Molécule dissociée" });
      refetchMolecules();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la dissociation",
        variant: "destructive",
      });
    }
  };

  const handleModalSuccess = () => {
    if (activeTab === "plants") {
      refetchPlants();
    } else {
      refetchMolecules();
    }
  };

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-yellow-100 text-yellow-800";
      case 4:
        return "bg-lime-100 text-lime-800";
      case 5:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStrengthLabel = (strength: number) => {
    const labels = {
      1: "Très faible",
      2: "Faible",
      3: "Moyen",
      4: "Fort",
      5: "Très fort",
    };
    return labels[strength as keyof typeof labels] || "Inconnu";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Occurrences liées</CardTitle>
              <CardDescription>Plantes et molécules associées à "{descriptorName}"</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une association
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "plants" | "molecules")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plants">
                Plantes ({plants?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="molecules">
                Molécules ({molecules?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Onglet Plantes */}
            <TabsContent value="plants" className="space-y-3">
              {plantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : plants && plants.length > 0 ? (
                <div className="space-y-2">
                  {plants.map((link: any) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{link.plantName}</div>
                        {link.latinName && (
                          <div className="text-sm text-gray-600 italic">{link.latinName}</div>
                        )}
                        {link.notes && (
                          <div className="text-xs text-gray-500 mt-1">{link.notes}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge className={getStrengthColor(link.strength)}>
                          <Star className="h-3 w-3 mr-1" />
                          {getStrengthLabel(link.strength)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlinkPlant(link.id)}
                          disabled={unlinkPlantMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune plante associée</p>
                  <p className="text-sm">Cliquez sur "Ajouter une association" pour en ajouter une</p>
                </div>
              )}
            </TabsContent>

            {/* Onglet Molécules */}
            <TabsContent value="molecules" className="space-y-3">
              {moleculesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : molecules && molecules.length > 0 ? (
                <div className="space-y-2">
                  {molecules.map((link: any) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{link.moleculeName}</div>
                        {link.iupacName && (
                          <div className="text-sm text-gray-600 italic">{link.iupacName}</div>
                        )}
                        {link.casNumber && (
                          <div className="text-xs text-gray-500">CAS: {link.casNumber}</div>
                        )}
                        {link.notes && (
                          <div className="text-xs text-gray-500 mt-1">{link.notes}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge className={getStrengthColor(link.strength)}>
                          <Star className="h-3 w-3 mr-1" />
                          {getStrengthLabel(link.strength)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlinkMolecule(link.id)}
                          disabled={unlinkMoleculeMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune molécule associée</p>
                  <p className="text-sm">Cliquez sur "Ajouter une association" pour en ajouter une</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modale d'association */}
      <DescriptorLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        descriptorId={descriptorId}
        descriptorName={descriptorName}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
