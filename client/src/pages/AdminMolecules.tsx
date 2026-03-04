// @ts-nocheck
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Beaker, Edit, Search, FlaskConical, X, Check, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";

// Labels pour les types de familles chimiques
const chemicalFamilyTypeLabels: Record<string, string> = {
  monoterpene: "Monoterpène",
  sesquiterpene: "Sesquiterpène",
  diterpene: "Diterpène",
  triterpene: "Triterpène",
  monoterpenoid: "Monoterpénoïde",
  sesquiterpenoid: "Sesquiterpénoïde",
  alcohol_aliphatic: "Alcool aliphatique",
  alcohol_aromatic: "Alcool aromatique",
  alcohol_terpenic: "Alcool terpénique",
  aldehyde_aliphatic: "Aldéhyde aliphatique",
  aldehyde_aromatic: "Aldéhyde aromatique",
  aldehyde_terpenic: "Aldéhyde terpénique",
  ketone_aliphatic: "Cétone aliphatique",
  ketone_aromatic: "Cétone aromatique",
  ketone_terpenic: "Cétone terpénique",
  ketone_macrocyclic: "Cétone macrocyclique",
  ester_aliphatic: "Ester aliphatique",
  ester_aromatic: "Ester aromatique",
  ester_terpenic: "Ester terpénique",
  ether_aliphatic: "Éther aliphatique",
  ether_aromatic: "Éther aromatique",
  phenol: "Phénol",
  phenol_ether: "Éther de phénol",
  lactone: "Lactone",
  lactone_macrocyclic: "Lactone macrocyclique",
  coumarin: "Coumarine",
  musk_nitro: "Musc nitré",
  musk_polycyclic: "Musc polycyclique",
  musk_macrocyclic: "Musc macrocyclique",
  musk_linear: "Musc linéaire",
  nitrile: "Nitrile",
  indole: "Indole",
  pyrazine: "Pyrazine",
  pyridine: "Pyridine",
  amine: "Amine",
  sulfur_compound: "Composé soufré",
  thiophene: "Thiophène",
  acid_carboxylic: "Acide carboxylique",
  acid_fatty: "Acide gras",
  furan: "Furane",
  heterocyclic_oxygen: "Hétérocycle oxygéné",
  heterocyclic_nitrogen: "Hétérocycle azoté",
  hydrocarbon_aromatic: "Hydrocarbure aromatique",
  hydrocarbon_aliphatic: "Hydrocarbure aliphatique",
  oxide: "Oxyde",
  acetals: "Acétal",
  anhydride: "Anhydride",
  other: "Autre",
};

export default function AdminMolecules() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMolecule, setSelectedMolecule] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [radarValues, setRadarValues] = useState({
    radarIntensity: 50,
    radarFreshness: 50,
    radarWarmth: 50,
    radarSweetness: 50,
    radarSpiciness: 50,
    radarEarthiness: 50,
  });
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<number[]>([]);
  const [familyPopoverOpen, setFamilyPopoverOpen] = useState(false);

  const { data: molecules, isLoading, refetch } = trpc.molecules.list.useQuery();
  const { data: chemicalFamilies } = trpc.chemicalFamilies.listAll.useQuery();
  
  const updateRadarMutation = trpc.molecules.updateRadar.useMutation({
    onSuccess: () => {
      setToastMessage("Radar mis à jour avec succès");
      setTimeout(() => setToastMessage(null), 3000);
      refetch();
    },
    onError: (error) => {
      setToastMessage(`Erreur: ${error.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    },
  });

  const linkMoleculeMutation = trpc.chemicalFamilies.linkMolecule.useMutation({
    onError: (error) => {
      setToastMessage(`Erreur liaison: ${error.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    },
  });

  const unlinkMoleculeMutation = trpc.chemicalFamilies.unlinkMolecule.useMutation({
    onError: (error) => {
      setToastMessage(`Erreur suppression liaison: ${error.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    },
  });

  // Récupérer les familles chimiques de la molécule sélectionnée
  const { data: moleculeFamilies, refetch: refetchMoleculeFamilies } = trpc.chemicalFamilies.getForMolecule.useQuery(
    { moleculeId: selectedMolecule?.id || 0 },
    { enabled: !!selectedMolecule?.id }
  );

  // Mettre à jour les familles sélectionnées quand on charge les données
  useEffect(() => {
    if (moleculeFamilies) {
      setSelectedFamilyIds(moleculeFamilies.map((f: any) => f.id));
    }
  }, [moleculeFamilies]);

  const filteredMolecules = molecules?.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMolecule = (molecule: any) => {
    setSelectedMolecule(molecule);
    setRadarValues({
      radarIntensity: molecule.radarIntensity || 50,
      radarFreshness: molecule.radarFreshness || 50,
      radarWarmth: molecule.radarWarmth || 50,
      radarSweetness: molecule.radarSweetness || 50,
      radarSpiciness: molecule.radarSpiciness || 50,
      radarEarthiness: molecule.radarEarthiness || 50,
    });
    setSelectedFamilyIds([]);
    setDialogOpen(true);
  };

  const handleSaveAll = async () => {
    if (!selectedMolecule) return;

    try {
      // 1. Sauvegarder le radar
      await updateRadarMutation.mutateAsync({
        id: selectedMolecule.id,
        ...radarValues,
      });

      // 2. Mettre à jour les liaisons de familles chimiques
      const currentFamilyIds = moleculeFamilies?.map((f: any) => f.id) || [];
      
      // Familles à ajouter
      const toAdd = selectedFamilyIds.filter(id => !currentFamilyIds.includes(id));
      // Familles à supprimer
      const toRemove = currentFamilyIds.filter((id: number) => !selectedFamilyIds.includes(id));

      // Ajouter les nouvelles liaisons
      for (const familyId of toAdd) {
        await linkMoleculeMutation.mutateAsync({
          moleculeId: selectedMolecule.id,
          chemicalFamilyId: familyId,
        });
      }

      // Supprimer les anciennes liaisons
      for (const familyId of toRemove) {
        await unlinkMoleculeMutation.mutateAsync({
          moleculeId: selectedMolecule.id,
          chemicalFamilyId: familyId,
        });
      }

      setToastMessage("Molécule mise à jour avec succès");
      setTimeout(() => setToastMessage(null), 3000);
      setDialogOpen(false);
      setSelectedMolecule(null);
      refetchMoleculeFamilies();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const toggleFamily = (familyId: number) => {
    setSelectedFamilyIds(prev => 
      prev.includes(familyId)
        ? prev.filter(id => id !== familyId)
        : [...prev, familyId]
    );
  };

  const removeFamily = (familyId: number) => {
    setSelectedFamilyIds(prev => prev.filter(id => id !== familyId));
  };

  const radarFields = [
    { key: "radarIntensity", label: "Intensité", color: "oklch(0.60 0.28 330)" },
    { key: "radarFreshness", label: "Fraîcheur", color: "oklch(0.65 0.25 140)" },
    { key: "radarWarmth", label: "Chaleur", color: "oklch(0.60 0.24 20)" },
    { key: "radarSweetness", label: "Douceur", color: "oklch(0.70 0.22 60)" },
    { key: "radarSpiciness", label: "Épices", color: "oklch(0.55 0.26 220)" },
    { key: "radarEarthiness", label: "Terreux", color: "oklch(0.55 0.12 160)" },
  ];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumbs />
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 animate-fadeInUp">
          <p className="text-sm">{toastMessage}</p>
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Molécules</h1>
        <p className="text-muted-foreground">
          Gérer les profils radar olfactifs et les familles chimiques des {molecules?.length || 0} molécules
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rechercher une molécule</CardTitle>
          <CardDescription>
            Trouvez une molécule par son nom ou nom IUPAC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Molecules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des molécules</CardTitle>
          <CardDescription>
            {filteredMolecules?.length || 0} molécules trouvées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredMolecules?.map((molecule) => {
              const hasRadar = molecule.radarIntensity !== null && molecule.radarIntensity !== 50;
              
              return (
                <div
                  key={molecule.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Beaker className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{molecule.name}</p>
                      {molecule.family && (
                        <p className="text-xs text-muted-foreground">{molecule.family}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasRadar ? (
                      <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        Radar configuré
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                        Radar par défaut
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-enhanced"
                      onClick={() => handleEditMolecule(molecule)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Éditer {selectedMolecule?.name}
            </DialogTitle>
            <DialogDescription>
              Modifiez le profil radar olfactif et les familles chimiques
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="families" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="families" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Familles chimiques
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Profil radar
              </TabsTrigger>
            </TabsList>

            {/* Onglet Familles Chimiques */}
            <TabsContent value="families" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Familles chimiques associées</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sélectionnez les familles chimiques auxquelles appartient cette molécule
                  </p>
                </div>

                {/* Familles sélectionnées */}
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-muted/30">
                  {selectedFamilyIds.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Aucune famille sélectionnée</span>
                  ) : (
                    selectedFamilyIds.map(familyId => {
                      const family = chemicalFamilies?.find((f: any) => f.id === familyId);
                      if (!family) return null;
                      return (
                        <Badge
                          key={familyId}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          {family.name}
                          <button
                            onClick={() => removeFamily(familyId)}
                            className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })
                  )}
                </div>

                {/* Sélecteur de familles */}
                <Popover open={familyPopoverOpen} onOpenChange={setFamilyPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={familyPopoverOpen}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4" />
                        Ajouter une famille chimique...
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher une famille..." />
                      <CommandList className="max-h-[300px]">
                        <CommandEmpty>Aucune famille trouvée.</CommandEmpty>
                        <CommandGroup>
                          {chemicalFamilies?.map((family: any) => {
                            const isSelected = selectedFamilyIds.includes(family.id);
                            return (
                              <CommandItem
                                key={family.id}
                                value={family.name}
                                onSelect={() => toggleFamily(family.id)}
                                className="flex items-center justify-between"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{family.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {chemicalFamilyTypeLabels[family.type] || family.type}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Statistiques */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">{selectedFamilyIds.length}</span> famille(s) sélectionnée(s)
                    {chemicalFamilies && (
                      <span className="text-muted-foreground"> sur {chemicalFamilies.length} disponibles</span>
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Radar */}
            <TabsContent value="radar" className="space-y-6 mt-4">
              {radarFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {radarValues[field.key as keyof typeof radarValues]}
                    </span>
                  </div>
                  <Slider
                    id={field.key}
                    min={0}
                    max={100}
                    step={1}
                    value={[radarValues[field.key as keyof typeof radarValues]]}
                    onValueChange={(value) =>
                      setRadarValues((prev) => ({
                        ...prev,
                        [field.key]: value[0],
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Faible</span>
                    <span>Moyen</span>
                    <span>Fort</span>
                  </div>
                </div>
              ))}

              {/* Radar Preview */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">Aperçu radar</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {radarFields.map((field) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: field.color }}
                      />
                      <span className="text-muted-foreground">
                        {field.label}: {radarValues[field.key as keyof typeof radarValues]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedMolecule(null);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={updateRadarMutation.isPending || linkMoleculeMutation.isPending || unlinkMoleculeMutation.isPending}
              className="btn-enhanced"
            >
              {(updateRadarMutation.isPending || linkMoleculeMutation.isPending || unlinkMoleculeMutation.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer tout"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
