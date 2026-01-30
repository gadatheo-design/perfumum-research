import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface MoleculeFormule {
  moleculeId: number;
  moleculeNom: string;
  proportion: number;
  role: "tête" | "cœur" | "fond";
}

export default function LiaisonRecettesMolecules() {
  const [recetteSelectionnee, setRecetteSelectionnee] = useState<number | null>(null);
  const [rechercheMolecule, setRechercheMolecule] = useState("");
  const [formule, setFormule] = useState<MoleculeFormule[]>([]);

  // Queries
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: liaisonsExistantes } = trpc.molecules.getByRecette.useQuery(
    { recetteId: recetteSelectionnee! },
    { enabled: !!recetteSelectionnee }
  );

  // Mutations
  const saveLiaisons = trpc.molecules.linkToRecette.useMutation({
    onSuccess: () => {
      toast.success("Liaisons sauvegardées avec succès !");
      setFormule([]);
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

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
        
        // Utiliser les valeurs radar directement depuis la molécule
        let axeValue = 50; // Valeur par défaut
        if (axe === "Frais") axeValue = molecule.radarFreshness || 50;
        else if (axe === "Floral") axeValue = molecule.radarSweetness || 50;
        else if (axe === "Fruité") axeValue = molecule.radarSweetness || 50;
        else if (axe === "Épicé") axeValue = molecule.radarSpiciness || 50;
        else if (axe === "Boisé") axeValue = molecule.radarWarmth || 50;
        else if (axe === "Terreux") axeValue = molecule.radarEarthiness || 50;
        
        return sum + (axeValue * mf.proportion / 100);
      }, 0);

      return { axis: axe, value: Math.round(valeur * 10) / 10 };
    });

    return profil;
  }, [formule, molecules]);

  // Filtrer molécules
  const moleculesFiltrees = useMemo(() => {
    if (!molecules) return [];
    return molecules.filter((m) =>
      m.name.toLowerCase().includes(rechercheMolecule.toLowerCase())
    );
  }, [molecules, rechercheMolecule]);

  // Handlers
  const ajouterMolecule = (moleculeId: number) => {
    const molecule = molecules?.find((m: any) => m.id === moleculeId);
    if (!molecule) return;

    if (formule.some((m) => m.moleculeId === moleculeId)) {
      toast.error("Cette molécule est déjà dans la formule");
      return;
    }

    setFormule([
      ...formule,
      {
        moleculeId: molecule.id,
        moleculeNom: molecule.name,
        proportion: 0,
        role: "cœur",
      },
    ]);
    setRechercheMolecule("");
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

  const sauvegarder = () => {
    if (!recetteSelectionnee) {
      toast.error("Veuillez sélectionner une recette");
      return;
    }

    if (!isValid) {
      toast.error("Le total des proportions doit être exactement 100%");
      return;
    }

    saveLiaisons.mutate({
      recetteId: recetteSelectionnee,
      molecules: formule.map((m) => ({
        moleculeId: m.moleculeId,
        proportion: m.proportion,
        role: m.role,
      })),
    });
  };

  const chargerLiaisons = () => {
    if (!liaisonsExistantes || liaisonsExistantes.length === 0) {
      setFormule([]);
      return;
    }

    setFormule(
      liaisonsExistantes.map((l: any) => ({
        moleculeId: l.id,
        moleculeNom: l.name,
        proportion: parseFloat(l.proportion || "0"),
        role: (l.role as "tête" | "cœur" | "fond") || "cœur",
      }))
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Liaison Recettes-Molécules</h1>
        <p className="text-muted-foreground">
          Associez des molécules à une recette avec proportions et rôles olfactifs
        </p>
      </div>

      {/* Sélection recette */}
      <Card>
        <CardHeader>
          <CardTitle>1. Sélectionner une recette</CardTitle>
          <CardDescription>Choisissez la recette à enrichir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recette</Label>
            <Select
              value={recetteSelectionnee?.toString() || ""}
              onValueChange={(value) => {
                setRecetteSelectionnee(parseInt(value));
                setFormule([]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une recette..." />
              </SelectTrigger>
              <SelectContent>
                {recettes?.map((r: any) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.nom} ({r.gamme})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {recetteSelectionnee && liaisonsExistantes && liaisonsExistantes.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Cette recette a déjà {liaisonsExistantes.length} molécule(s) liée(s).{" "}
                <Button variant="link" className="p-0 h-auto" onClick={chargerLiaisons}>
                  Charger les liaisons existantes
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Ajout molécules */}
      {recetteSelectionnee && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>2. Ajouter des molécules</CardTitle>
              <CardDescription>Recherchez et ajoutez des molécules à la formule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rechercher une molécule</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom de la molécule..."
                    value={rechercheMolecule}
                    onChange={(e) => setRechercheMolecule(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {rechercheMolecule && (
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {moleculesFiltrees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune molécule trouvée</p>
                  ) : (
                    moleculesFiltrees.slice(0, 10).map((m: any) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                        onClick={() => ajouterMolecule(m.id)}
                      >
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.family}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste formule */}
          <Card>
            <CardHeader>
              <CardTitle>3. Composer la formule</CardTitle>
              <CardDescription>
                Ajustez les proportions et rôles olfactifs (total doit être 100%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formule.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune molécule ajoutée. Recherchez et ajoutez des molécules ci-dessus.
                </p>
              ) : (
                <>
                  <div className="space-y-3">
                    {formule.map((m) => (
                      <div key={m.moleculeId} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{m.moleculeNom}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => retirerMolecule(m.moleculeId)}
                          >
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

                  {/* Validation */}
                  <Alert variant={isValid ? "default" : "destructive"}>
                    {isValid ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      Total des proportions : <strong>{totalProportions.toFixed(1)}%</strong>
                      {isValid ? " ✓ Formule valide" : " ✗ Doit être exactement 100%"}
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={sauvegarder}
                    disabled={!isValid || saveLiaisons.isPending}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder la formule
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Profil radar */}
          {profilRadar && formule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>4. Profil radar calculé</CardTitle>
                <CardDescription>Visualisation du profil olfactif résultant</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={profilRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="axis" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
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
        </>
      )}
    </div>
  );
}
