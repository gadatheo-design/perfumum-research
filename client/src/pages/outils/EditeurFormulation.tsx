import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Trash2, Save, Download, AlertCircle, CheckCircle2, GripVertical } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MoleculeFormule {
  moleculeId: number;
  moleculeNom: string;
  famille: string;
  proportion: number;
  role: "tête" | "cœur" | "fond";
}

export default function EditeurFormulation() {
  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState<string>("tous");
  const [formule, setFormule] = useState<MoleculeFormule[]>([]);
  const [nomFormule, setNomFormule] = useState("");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Queries
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();

  // Calculs
  const totalProportions = useMemo(() => {
    return formule.reduce((sum, m) => sum + m.proportion, 0);
  }, [formule]);

  const isValid = totalProportions === 100;

  // Profil radar calculé
  const profilRadar = useMemo(() => {
    if (formule.length === 0 || !molecules) return null;

    const axes = ["Frais", "Floral", "Fruité", "Épicé", "Boisé", "Terreux"];
    const profil = axes.map((axe) => {
      const valeur = formule.reduce((sum, mf) => {
        const molecule = molecules.find((m: any) => m.id === mf.moleculeId);
        if (!molecule) return sum;

        let axeValue = 50;
        if (axe === "Frais") axeValue = molecule.radarFreshness || 50;
        else if (axe === "Floral") axeValue = molecule.radarSweetness || 50;
        else if (axe === "Fruité") axeValue = molecule.radarSweetness || 50;
        else if (axe === "Épicé") axeValue = molecule.radarSpiciness || 50;
        else if (axe === "Boisé") axeValue = molecule.radarWarmth || 50;
        else if (axe === "Terreux") axeValue = molecule.radarEarthiness || 50;

        return sum + (axeValue * mf.proportion) / 100;
      }, 0);

      return { axis: axe, value: Math.round(valeur * 10) / 10 };
    });

    return profil;
  }, [formule, molecules]);

  // Filtrer molécules
  const moleculesFiltrees = useMemo(() => {
    if (!molecules) return [];
    return molecules.filter((m: any) => {
      const matchRecherche = m.name.toLowerCase().includes(recherche.toLowerCase());
      const matchRole = filtreRole === "tous" || true; // Pas de filtre par rôle pour les molécules
      return matchRecherche && matchRole;
    });
  }, [molecules, recherche, filtreRole]);

  // Handlers Drag & Drop
  const handleDragStart = (moleculeId: number) => {
    setDraggedItem(moleculeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const molecule = molecules?.find((m: any) => m.id === draggedItem);
    if (!molecule) return;

    if (formule.some((m) => m.moleculeId === draggedItem)) {
      toast.error("Cette molécule est déjà dans la formule");
      return;
    }

    setFormule([
      ...formule,
      {
        moleculeId: molecule.id,
        moleculeNom: molecule.name,
        famille: molecule.family || "Non définie",
        proportion: 0,
        role: "cœur",
      },
    ]);
    setDraggedItem(null);
  };

  const retirerMolecule = (moleculeId: number) => {
    setFormule(formule.filter((m) => m.moleculeId !== moleculeId));
  };

  const modifierProportion = (moleculeId: number, proportion: number) => {
    setFormule(
      formule.map((m) =>
        m.moleculeId === moleculeId ? { ...m, proportion: Math.max(0, Math.min(100, proportion)) } : m
      )
    );
  };

  const modifierRole = (moleculeId: number, role: "tête" | "cœur" | "fond") => {
    setFormule(formule.map((m) => (m.moleculeId === moleculeId ? { ...m, role } : m)));
  };

  // Export fonctions
  const exporterCSV = () => {
    if (formule.length === 0) {
      toast.error("Aucune molécule dans la formule");
      return;
    }

    const headers = ["Molécule", "Famille", "Proportion (%)", "Rôle"];
    const rows = formule.map((m) => [m.moleculeNom, m.famille, m.proportion.toString(), m.role]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formule_${nomFormule || "sans_nom"}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Formule exportée en CSV");
  };

  const exporterJSON = () => {
    if (formule.length === 0) {
      toast.error("Aucune molécule dans la formule");
      return;
    }

    const data = {
      nom: nomFormule || "Formule sans nom",
      date: new Date().toISOString(),
      molecules: formule,
      profilRadar,
      totalProportions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formule_${nomFormule || "sans_nom"}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Formule exportée en JSON");
  };

  const sauvegarderRecette = () => {
    if (!nomFormule) {
      toast.error("Veuillez donner un nom à la formule");
      return;
    }

    if (!isValid) {
      toast.error("Le total des proportions doit être exactement 100%");
      return;
    }

    toast.success("Fonctionnalité de sauvegarde en cours de développement");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Éditeur Visuel de Formulation</h1>
        <p className="text-muted-foreground">
          Composez vos formules olfactives par glisser-déposer avec calcul en temps réel du profil radar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bibliothèque de molécules */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Bibliothèque de Molécules</CardTitle>
            <CardDescription>Glissez les molécules dans la zone de formulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom de la molécule..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement...</p>
              ) : moleculesFiltrees.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune molécule trouvée</p>
              ) : (
                moleculesFiltrees.map((m: any) => (
                  <div
                    key={m.id}
                    draggable
                    onDragStart={() => handleDragStart(m.id)}
                    className="flex items-center gap-2 p-3 border rounded-lg cursor-move hover:bg-accent transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.family || "Non définie"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zone de formulation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Zone de Formulation</CardTitle>
            <CardDescription>Déposez les molécules ici et ajustez les proportions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la formule</Label>
              <Input
                placeholder="Ex: Accord Pétrichor Frais"
                value={nomFormule}
                onChange={(e) => setNomFormule(e.target.value)}
              />
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`min-h-[300px] border-2 border-dashed rounded-lg p-4 transition-colors ${
                formule.length === 0 ? "border-muted-foreground/30 bg-muted/10" : "border-primary/30 bg-primary/5"
              }`}
            >
              {formule.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Glissez-déposez des molécules ici pour commencer votre formulation
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {formule.map((m) => (
                    <div key={m.moleculeId} className="border rounded-lg p-4 bg-background space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{m.moleculeNom}</p>
                          <p className="text-xs text-muted-foreground">{m.famille}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => retirerMolecule(m.moleculeId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Proportion (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={m.proportion}
                            onChange={(e) =>
                              modifierProportion(m.moleculeId, parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Rôle olfactif</Label>
                          <Select
                            value={m.role}
                            onValueChange={(value) =>
                              modifierRole(m.moleculeId, value as "tête" | "cœur" | "fond")
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tête">Note de tête</SelectItem>
                              <SelectItem value="cœur">Note de cœur</SelectItem>
                              <SelectItem value="fond">Note de fond</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Validation */}
            {formule.length > 0 && (
              <Alert variant={isValid ? "default" : "destructive"}>
                {isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>
                  Total des proportions : <strong>{totalProportions.toFixed(1)}%</strong>
                  {isValid ? " ✓ Formule valide" : " ✗ Doit être exactement 100%"}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            {formule.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={exporterCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={exporterJSON} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button onClick={sauvegarderRecette} disabled={!isValid} className="ml-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder comme recette
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profil radar */}
      {profilRadar && formule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Profil Radar Calculé</CardTitle>
            <CardDescription>Visualisation en temps réel du profil olfactif de votre formule</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={profilRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Profil calculé"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
