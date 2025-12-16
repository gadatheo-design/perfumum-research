import { useState } from "react";
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
import { Beaker, Edit, Search } from "lucide-react";


export default function AdminMolecules() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMolecule, setSelectedMolecule] = useState<any>(null);
  const [radarValues, setRadarValues] = useState({
    radarIntensity: 50,
    radarFreshness: 50,
    radarWarmth: 50,
    radarSweetness: 50,
    radarSpiciness: 50,
    radarEarthiness: 50,
  });

  const { data: molecules, isLoading, refetch } = trpc.molecules.list.useQuery();
  const updateRadarMutation = trpc.molecules.updateRadar.useMutation({
    onSuccess: () => {
      setToastMessage("Radar mis à jour avec succès");
      setTimeout(() => setToastMessage(null), 3000);
      refetch();
      setSelectedMolecule(null);
    },
    onError: (error) => {
      setToastMessage(`Erreur: ${error.message}`);
      setTimeout(() => setToastMessage(null), 3000);
    },
  });

  const filteredMolecules = molecules?.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRadar = (molecule: any) => {
    setSelectedMolecule(molecule);
    setRadarValues({
      radarIntensity: molecule.radarIntensity || 50,
      radarFreshness: molecule.radarFreshness || 50,
      radarWarmth: molecule.radarWarmth || 50,
      radarSweetness: molecule.radarSweetness || 50,
      radarSpiciness: molecule.radarSpiciness || 50,
      radarEarthiness: molecule.radarEarthiness || 50,
    });
  };

  const handleSaveRadar = () => {
    if (!selectedMolecule) return;

    updateRadarMutation.mutate({
      id: selectedMolecule.id,
      ...radarValues,
    });
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
          Gérer les profils radar olfactifs des {molecules?.length || 0} molécules
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-enhanced"
                          onClick={() => handleEditRadar(molecule)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Éditer radar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Profil radar olfactif</DialogTitle>
                          <DialogDescription>
                            {selectedMolecule?.name} - Ajustez les 6 valeurs radar (0-100)
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
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

                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedMolecule(null)}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={handleSaveRadar}
                              disabled={updateRadarMutation.isPending}
                              className="btn-enhanced"
                            >
                              {updateRadarMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
