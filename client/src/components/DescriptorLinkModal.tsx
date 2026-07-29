import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DescriptorLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  descriptorId: string;
  descriptorName: string;
  onSuccess?: () => void;
}

export function DescriptorLinkModal({
  isOpen,
  onClose,
  descriptorId,
  descriptorName,
  onSuccess,
}: DescriptorLinkModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"plant" | "molecule">("plant");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [strength, setStrength] = useState(3);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer les plantes pour la recherche
  const { data: plantsData } = trpc.plants.searchPlants.useQuery(
    { query: searchTerm, limit: 20 },
    { enabled: activeTab === "plant" && searchTerm.length > 0 }
  );

  // Récupérer les molécules pour la recherche
  const { data: moleculesData } = trpc.molecules.searchMolecules.useQuery(
    { query: searchTerm, limit: 20 },
    { enabled: activeTab === "molecule" && searchTerm.length > 0 }
  );

  // Mutations
  const linkPlantMutation = trpc.descriptorLinks.linkPlantToDescriptor.useMutation();
  const linkMoleculeMutation = trpc.descriptorLinks.linkMoleculeToDescriptor.useMutation();

  const plants = useMemo(() => plantsData || [], [plantsData]);
  const molecules = useMemo(() => moleculesData || [], [moleculesData]);

  const handleLinkPlant = async () => {
    if (!selectedId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une plante", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await linkPlantMutation.mutateAsync({
        descriptorId,
        plantId: selectedId,
        strength,
        notes: notes || undefined,
        source: "manual",
      });

      toast({
        title: "Succès",
        description: `Plante associée au descripteur "${descriptorName}"`,
      });

      // Réinitialiser le formulaire
      setSearchTerm("");
      setSelectedId(null);
      setStrength(3);
      setNotes("");

      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de l'association",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkMolecule = async () => {
    if (!selectedId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une molécule", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await linkMoleculeMutation.mutateAsync({
        descriptorId,
        moleculeId: selectedId,
        strength,
        notes: notes || undefined,
        source: "manual",
      });

      toast({
        title: "Succès",
        description: `Molécule associée au descripteur "${descriptorName}"`,
      });

      // Réinitialiser le formulaire
      setSearchTerm("");
      setSelectedId(null);
      setStrength(3);
      setNotes("");

      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de l'association",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Associer "{descriptorName}" à une plante ou molécule</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez une plante ou molécule, puis définissez la force de l'association
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "plant" | "molecule")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plant">Plante</TabsTrigger>
            <TabsTrigger value="molecule">Molécule</TabsTrigger>
          </TabsList>

          {/* Onglet Plante */}
          <TabsContent value="plant" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant-search">Rechercher une plante</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="plant-search"
                  placeholder="Nom latin, nom commun..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedId(null);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Résultats de recherche */}
            {searchTerm && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {plants.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">Aucune plante trouvée</div>
                ) : (
                  <div className="divide-y">
                    {plants.map((plant: any) => (
                      <button
                        key={plant.id}
                        onClick={() => setSelectedId(plant.id)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition ${
                          selectedId === plant.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <div className="font-medium">{plant.name}</div>
                        {plant.latinName && <div className="text-sm text-gray-600 italic">{plant.latinName}</div>}
                        {plant.family && <div className="text-xs text-gray-500">Famille: {plant.family}</div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sélection affichée */}
            {selectedId && activeTab === "plant" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  {plants.find((p: any) => p.id === selectedId)?.name} sélectionnée
                </span>
              </div>
            )}
          </TabsContent>

          {/* Onglet Molécule */}
          <TabsContent value="molecule" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="molecule-search">Rechercher une molécule</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="molecule-search"
                  placeholder="Nom, formule chimique, CAS..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedId(null);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Résultats de recherche */}
            {searchTerm && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {molecules.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">Aucune molécule trouvée</div>
                ) : (
                  <div className="divide-y">
                    {molecules.map((molecule: any) => (
                      <button
                        key={molecule.id}
                        onClick={() => setSelectedId(molecule.id)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition ${
                          selectedId === molecule.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <div className="font-medium">{molecule.name}</div>
                        {molecule.iupacName && (
                          <div className="text-sm text-gray-600 italic">{molecule.iupacName}</div>
                        )}
                        {molecule.casNumber && (
                          <div className="text-xs text-gray-500">CAS: {molecule.casNumber}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sélection affichée */}
            {selectedId && activeTab === "molecule" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  {molecules.find((m: any) => m.id === selectedId)?.name} sélectionnée
                </span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Force d'association */}
        <div className="space-y-2">
          <Label>Force de l'association</Label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={strength}
              onChange={(e) => setStrength(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setStrength(level)}
                  className={`w-8 h-8 rounded text-sm font-medium transition ${
                    strength === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            1 = Très faible | 5 = Très forte
          </p>
        </div>

        {/* Notes optionnelles */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            placeholder="Ajoutez des notes sur cette association..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-20"
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={activeTab === "plant" ? handleLinkPlant : handleLinkMolecule}
            disabled={!selectedId || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Associer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
