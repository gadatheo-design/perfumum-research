import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Link2, 
  Beaker,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Loader2,
  BarChart3,
  Target,
  TrendingUp
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface MoleculeFormule {
  moleculeId: number;
  moleculeNom: string;
  proportion: number;
  role: "tête" | "cœur" | "fond";
}

export default function MoleculeRecetteLinking() {
  const [activeTab, setActiveTab] = useState("statistiques");
  const [recetteSelectionnee, setRecetteSelectionnee] = useState<number | null>(null);
  const [rechercheMolecule, setRechercheMolecule] = useState("");
  const [rechercheRecette, setRechercheRecette] = useState("");
  const [formule, setFormule] = useState<MoleculeFormule[]>([]);
  const [quickLinkDialogOpen, setQuickLinkDialogOpen] = useState(false);
  const [selectedMoleculeForQuickLink, setSelectedMoleculeForQuickLink] = useState<any>(null);
  const [quickLinkRecetteId, setQuickLinkRecetteId] = useState<string>("");
  const [quickLinkProportion, setQuickLinkProportion] = useState("10");
  const [quickLinkRole, setQuickLinkRole] = useState<"tête" | "cœur" | "fond">("cœur");

  const utils = trpc.useUtils();

  // Queries
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: recettesWithMolecules } = trpc.recettes.getAllWithMolecules.useQuery();
  const { data: liaisonsExistantes } = trpc.molecules.getByRecette.useQuery(
    { recetteId: recetteSelectionnee! },
    { enabled: !!recetteSelectionnee }
  );

  // Mutations
  const saveLiaisons = trpc.molecules.linkToRecette.useMutation({
    onSuccess: () => {
      toast.success("Liaisons sauvegardées avec succès !");
      setFormule([]);
      utils.recettes.getAllWithMolecules.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  // Statistiques de couverture
  const stats = useMemo(() => {
    if (!recettesWithMolecules || !molecules) {
      return {
        totalRecettes: 0,
        recettesAvecMolecules: 0,
        couvertureRecettes: 0,
        totalMolecules: 0,
        moleculesUtilisees: 0,
        couvertureMolecules: 0,
        totalLiaisons: 0,
        recettesSansMolecules: [],
        moleculesNonUtilisees: [],
      };
    }

    const recettesAvecMolecules = recettesWithMolecules.filter(
      (r: any) => r.molecules && r.molecules.length > 0
    );
    
    const moleculesUtiliseesSet = new Set<number>();
    recettesWithMolecules.forEach((r: any) => {
      r.molecules?.forEach((m: any) => {
        moleculesUtiliseesSet.add(m.id);
      });
    });

    const totalLiaisons = recettesWithMolecules.reduce(
      (sum: number, r: any) => sum + (r.molecules?.length || 0),
      0
    );

    const recettesSansMolecules = recettesWithMolecules
      .filter((r: any) => !r.molecules || r.molecules.length === 0)
      .slice(0, 20);

    const moleculesNonUtilisees = molecules
      .filter((m: any) => !moleculesUtiliseesSet.has(m.id))
      .slice(0, 20);

    return {
      totalRecettes: recettesWithMolecules.length,
      recettesAvecMolecules: recettesAvecMolecules.length,
      couvertureRecettes: recettesWithMolecules.length > 0 
        ? Math.round((recettesAvecMolecules.length / recettesWithMolecules.length) * 100) 
        : 0,
      totalMolecules: molecules.length,
      moleculesUtilisees: moleculesUtiliseesSet.size,
      couvertureMolecules: molecules.length > 0 
        ? Math.round((moleculesUtiliseesSet.size / molecules.length) * 100) 
        : 0,
      totalLiaisons,
      recettesSansMolecules,
      moleculesNonUtilisees,
    };
  }, [recettesWithMolecules, molecules]);

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
        
        return sum + (axeValue * mf.proportion / 100);
      }, 0);

      return { axis: axe, value: Math.round(valeur * 10) / 10 };
    });

    return profil;
  }, [formule, molecules]);

  // Filtrer molécules
  const moleculesFiltrees = useMemo(() => {
    if (!molecules) return [];
    return molecules.filter((m: any) =>
      m.name.toLowerCase().includes(rechercheMolecule.toLowerCase())
    );
  }, [molecules, rechercheMolecule]);

  // Filtrer recettes
  const recettesFiltrees = useMemo(() => {
    if (!recettes) return [];
    return recettes.filter((r: any) =>
      r.nom?.toLowerCase().includes(rechercheRecette.toLowerCase()) ||
      r.gamme?.toLowerCase().includes(rechercheRecette.toLowerCase())
    );
  }, [recettes, rechercheRecette]);

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

  const openQuickLinkDialog = (molecule: any) => {
    setSelectedMoleculeForQuickLink(molecule);
    setQuickLinkRecetteId("");
    setQuickLinkProportion("10");
    setQuickLinkRole("cœur");
    setQuickLinkDialogOpen(true);
  };

  const handleQuickLink = () => {
    if (!quickLinkRecetteId || !selectedMoleculeForQuickLink) {
      toast.error("Veuillez sélectionner une recette");
      return;
    }

    saveLiaisons.mutate({
      recetteId: parseInt(quickLinkRecetteId),
      molecules: [{
        moleculeId: selectedMoleculeForQuickLink.id,
        proportion: parseFloat(quickLinkProportion) || 10,
        role: quickLinkRole,
      }],
    }, {
      onSuccess: () => {
        setQuickLinkDialogOpen(false);
        toast.success(`${selectedMoleculeForQuickLink.name} liée à la recette !`);
      }
    });
  };

  const selectRecetteFromStats = (recetteId: number) => {
    setRecetteSelectionnee(recetteId);
    setActiveTab("editeur");
    setFormule([]);
  };

  const isLoading = loadingRecettes || loadingMolecules;

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
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Admin
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Link2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Liaison Molécule ↔ Recette</h1>
                  <p className="text-muted-foreground">
                    Associez des molécules aux recettes pour enrichir la base de données
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="statistiques" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Statistiques
                  </TabsTrigger>
                  <TabsTrigger value="editeur" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Éditeur de formule
                  </TabsTrigger>
                  <TabsTrigger value="liaisons-rapides" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Liaisons rapides
                  </TabsTrigger>
                </TabsList>

                {/* Tab Statistiques */}
                <TabsContent value="statistiques" className="space-y-6">
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Couverture Recettes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{stats.couvertureRecettes}%</span>
                          <span className="text-sm text-muted-foreground mb-1">
                            ({stats.recettesAvecMolecules}/{stats.totalRecettes})
                          </span>
                        </div>
                        <Progress value={stats.couvertureRecettes} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Objectif : 50%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Molécules utilisées
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{stats.couvertureMolecules}%</span>
                          <span className="text-sm text-muted-foreground mb-1">
                            ({stats.moleculesUtilisees}/{stats.totalMolecules})
                          </span>
                        </div>
                        <Progress value={stats.couvertureMolecules} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Objectif : 30%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total liaisons
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{stats.totalLiaisons}</span>
                          <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Liaisons molécule-recette créées
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recettes sans molécules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Recettes sans molécules ({stats.totalRecettes - stats.recettesAvecMolecules})
                      </CardTitle>
                      <CardDescription>
                        Ces recettes n'ont pas encore de molécules associées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.recettesSansMolecules.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Toutes les recettes ont des molécules associées !
                        </p>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Gamme</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.recettesSansMolecules.map((r: any) => (
                                <TableRow key={r.id}>
                                  <TableCell className="font-medium">{r.nom}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{r.gamme}</Badge>
                                  </TableCell>
                                  <TableCell>{r.category || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => selectRecetteFromStats(r.id)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Ajouter
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Molécules non utilisées */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-purple-500" />
                        Molécules non utilisées ({stats.totalMolecules - stats.moleculesUtilisees})
                      </CardTitle>
                      <CardDescription>
                        Ces molécules ne sont liées à aucune recette
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.moleculesNonUtilisees.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Toutes les molécules sont utilisées !
                        </p>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Famille</TableHead>
                                <TableHead>Formule</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.moleculesNonUtilisees.map((m: any) => (
                                <TableRow key={m.id}>
                                  <TableCell className="font-medium">{m.name}</TableCell>
                                  <TableCell>
                                    {m.family && <Badge variant="secondary">{m.family}</Badge>}
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {m.chemicalFormula || "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openQuickLinkDialog(m)}
                                    >
                                      <Link2 className="h-4 w-4 mr-1" />
                                      Lier
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Éditeur de formule */}
                <TabsContent value="editeur" className="space-y-6">
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
                          value={recetteSelectionnee?.toString() || "none"}
                          onValueChange={(value) => {
                            setRecetteSelectionnee(value === "none" ? null : parseInt(value));
                            setFormule([]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une recette..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sélectionner...</SelectItem>
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
                                {saveLiaisons.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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
                </TabsContent>

                {/* Tab Liaisons rapides */}
                <TabsContent value="liaisons-rapides" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Liaisons rapides par molécule</CardTitle>
                      <CardDescription>
                        Recherchez une molécule et liez-la rapidement à une recette
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher une molécule..."
                          value={rechercheMolecule}
                          onChange={(e) => setRechercheMolecule(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {rechercheMolecule && moleculesFiltrees.length > 0 && (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Molécule</TableHead>
                                <TableHead>Famille</TableHead>
                                <TableHead>Formule</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {moleculesFiltrees.slice(0, 15).map((m: any) => (
                                <TableRow key={m.id}>
                                  <TableCell className="font-medium">{m.name}</TableCell>
                                  <TableCell>
                                    {m.family && <Badge variant="secondary">{m.family}</Badge>}
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {m.chemicalFormula || "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      onClick={() => openQuickLinkDialog(m)}
                                    >
                                      <Link2 className="h-4 w-4 mr-1" />
                                      Lier à une recette
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Liaisons rapides par recette</CardTitle>
                      <CardDescription>
                        Recherchez une recette et ajoutez-y des molécules
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher une recette..."
                          value={rechercheRecette}
                          onChange={(e) => setRechercheRecette(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {rechercheRecette && recettesFiltrees.length > 0 && (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Recette</TableHead>
                                <TableHead>Gamme</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recettesFiltrees.slice(0, 15).map((r: any) => (
                                <TableRow key={r.id}>
                                  <TableCell className="font-medium">{r.nom}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{r.gamme}</Badge>
                                  </TableCell>
                                  <TableCell>{r.category || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      onClick={() => selectRecetteFromStats(r.id)}
                                    >
                                      <ChevronRight className="h-4 w-4 mr-1" />
                                      Éditer formule
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      {/* Dialog de liaison rapide */}
      <Dialog open={quickLinkDialogOpen} onOpenChange={setQuickLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lier rapidement une molécule</DialogTitle>
            <DialogDescription>
              {selectedMoleculeForQuickLink?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recette cible</Label>
              <Select
                value={quickLinkRecetteId}
                onValueChange={setQuickLinkRecetteId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une recette..." />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Proportion (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={quickLinkProportion}
                  onChange={(e) => setQuickLinkProportion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rôle olfactif</Label>
                <Select
                  value={quickLinkRole}
                  onValueChange={(v) => setQuickLinkRole(v as "tête" | "cœur" | "fond")}
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickLinkDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleQuickLink} disabled={!quickLinkRecetteId || saveLiaisons.isPending}>
              {saveLiaisons.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer la liaison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
