import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Trash2, Save, Download, AlertCircle, CheckCircle2, GripVertical, Beaker, FlaskConical, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { motion } from "framer-motion";

interface MoleculeFormule {
  moleculeId: number;
  moleculeNom: string;
  famille: string;
  proportion: number;
  role: "tête" | "cœur" | "fond";
}

const ROLE_COLORS = {
  "tête": { bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-400", border: "border-sky-500/30" },
  "cœur": { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", border: "border-rose-500/30" },
  "fond": { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/30" }
};

export default function EditeurFormulation() {
  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState<string>("tous");
  const [formule, setFormule] = useState<MoleculeFormule[]>([]);
  const [nomFormule, setNomFormule] = useState("");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();

  const totalProportions = useMemo(() => {
    return formule.reduce((sum, m) => sum + m.proportion, 0);
  }, [formule]);

  const isValid = totalProportions === 100;

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

  const moleculesFiltrees = useMemo(() => {
    if (!molecules) return [];
    return molecules.filter((m: any) => {
      const matchRecherche = m.name.toLowerCase().includes(recherche.toLowerCase());
      return matchRecherche;
    });
  }, [molecules, recherche]);

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
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <FlaskConical className="w-4 h-4 mr-2" />
                Outil de Création
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Éditeur de Formulation
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Composez vos formules olfactives par glisser-déposer avec calcul en temps réel du profil radar
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bibliothèque de molécules */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="lg:col-span-1 border-border/50 h-full">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Bibliothèque</CardTitle>
                      <CardDescription className="text-xs">Glissez les molécules</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>

                  <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
                      </div>
                    ) : moleculesFiltrees.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Aucune molécule trouvée</p>
                    ) : (
                      moleculesFiltrees.slice(0, 50).map((m: any) => (
                        <div
                          key={m.id}
                          draggable
                          onDragStart={() => handleDragStart(m.id)}
                          className="flex items-center gap-2 p-3 border border-border/50 rounded-lg cursor-move hover:bg-muted/50 hover:border-primary/30 transition-all group"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{m.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{m.family || "Non définie"}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {moleculesFiltrees.length > 50 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{moleculesFiltrees.length - 50} autres molécules
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Zone de formulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/50 h-full">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Zone de Formulation</CardTitle>
                        <CardDescription className="text-xs">Déposez et ajustez les proportions</CardDescription>
                      </div>
                    </div>
                    {formule.length > 0 && (
                      <Badge 
                        variant={isValid ? "default" : "destructive"}
                        className="font-mono"
                      >
                        {totalProportions.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nom de la formule</Label>
                    <Input
                      placeholder="Ex: Accord Pétrichor Frais"
                      value={nomFormule}
                      onChange={(e) => setNomFormule(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`min-h-[280px] border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                      formule.length === 0 
                        ? "border-border bg-muted/20" 
                        : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    {formule.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center py-12">
                        <div>
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground font-medium mb-1">
                            Glissez-déposez des molécules ici
                          </p>
                          <p className="text-sm text-muted-foreground/70">
                            pour commencer votre formulation
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formule.map((m) => {
                          const roleColors = ROLE_COLORS[m.role];
                          return (
                            <div 
                              key={m.moleculeId} 
                              className={`border rounded-lg p-4 bg-card ${roleColors.border} transition-all hover:shadow-sm`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Badge className={`${roleColors.bg} ${roleColors.text} border-0 capitalize text-xs`}>
                                    {m.role}
                                  </Badge>
                                  <div>
                                    <p className="font-medium text-sm">{m.moleculeNom}</p>
                                    <p className="text-xs text-muted-foreground">{m.famille}</p>
                                  </div>
                                </div>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => retirerMolecule(m.moleculeId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Proportion (%)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={m.proportion}
                                    onChange={(e) =>
                                      modifierProportion(m.moleculeId, parseFloat(e.target.value) || 0)
                                    }
                                    className="h-9 bg-background"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Rôle olfactif</Label>
                                  <Select
                                    value={m.role}
                                    onValueChange={(value) =>
                                      modifierRole(m.moleculeId, value as "tête" | "cœur" | "fond")
                                    }
                                  >
                                    <SelectTrigger className="h-9 bg-background">
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
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Validation */}
                  {formule.length > 0 && (
                    <Alert variant={isValid ? "default" : "destructive"} className="border-border/50">
                      {isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <AlertDescription>
                        Total des proportions : <strong>{totalProportions.toFixed(1)}%</strong>
                        {isValid ? " — Formule valide" : " — Doit être exactement 100%"}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  {formule.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button onClick={exporterCSV} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button onClick={exporterJSON} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        JSON
                      </Button>
                      <Button onClick={sauvegarderRecette} disabled={!isValid} size="sm" className="ml-auto">
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Profil radar */}
          {profilRadar && formule.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card className="border-border/50">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <CardTitle className="text-lg">Profil Radar Calculé</CardTitle>
                  <CardDescription>Visualisation en temps réel du profil olfactif</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={profilRadar}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="axis" 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Radar
                        name="Profil calculé"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.4}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
