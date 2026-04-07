import { safeJsonParse } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, Save, Download, Trash2, AlertCircle, CheckCircle2, Beaker, Scale } from "lucide-react";
import { RadarChart } from "@/components/RadarChart";

interface TerpeneFormula {
  myrcene: number;
  limonene: number;
  alphaPinene: number;
  betaPinene: number;
  betaCaryophyllene: number;
  linalool: number;
  humulene: number;
}

interface SavedFormula {
  id: string;
  name: string;
  formula: TerpeneFormula;
  batchSize: number;
  createdAt: string;
}

const TERPENE_PROFILES = {
  myrcene: { intensity: 65, freshness: 40, warmth: 55, sweetness: 50, spiciness: 30, earthiness: 75 },
  limonene: { intensity: 85, freshness: 95, warmth: 30, sweetness: 60, spiciness: 20, earthiness: 15 },
  alphaPinene: { intensity: 80, freshness: 90, warmth: 40, sweetness: 30, spiciness: 35, earthiness: 50 },
  betaPinene: { intensity: 75, freshness: 85, warmth: 45, sweetness: 35, spiciness: 40, earthiness: 55 },
  betaCaryophyllene: { intensity: 90, freshness: 30, warmth: 85, sweetness: 40, spiciness: 95, earthiness: 70 },
  linalool: { intensity: 70, freshness: 60, warmth: 65, sweetness: 80, spiciness: 25, earthiness: 40 },
  humulene: { intensity: 75, freshness: 50, warmth: 75, sweetness: 45, spiciness: 60, earthiness: 85 },
};

const TERPENE_NAMES = {
  myrcene: "Myrcène",
  limonene: "Limonène",
  alphaPinene: "α-Pinène",
  betaPinene: "β-Pinène",
  betaCaryophyllene: "β-Caryophyllène",
  linalool: "Linalool",
  humulene: "Humulène",
};

export default function ProportionsCalculator() {
  const [formula, setFormula] = useState<TerpeneFormula>({
    myrcene: 0,
    limonene: 0,
    alphaPinene: 0,
    betaPinene: 0,
    betaCaryophyllene: 0,
    linalool: 0,
    humulene: 0,
  });
  const [batchSize, setBatchSize] = useState<number>(100);
  const [savedFormulas, setSavedFormulas] = useState<SavedFormula[]>([]);
  const [formulaName, setFormulaName] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("perfumum-saved-formulas");
    if (saved) {
      setSavedFormulas(safeJsonParse(saved, []));
    }
  }, []);

  const totalPercentage = Object.values(formula).reduce((sum, val) => sum + val, 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  const calculateRadarProfile = () => {
    const profile = {
      intensity: 0,
      freshness: 0,
      warmth: 0,
      sweetness: 0,
      spiciness: 0,
      earthiness: 0,
    };

    Object.entries(formula).forEach(([terpene, percentage]) => {
      const terpeneProfile = TERPENE_PROFILES[terpene as keyof typeof TERPENE_PROFILES];
      Object.keys(profile).forEach((axis) => {
        profile[axis as keyof typeof profile] +=
          (terpeneProfile[axis as keyof typeof terpeneProfile] * percentage) / 100;
      });
    });

    return profile;
  };

  const calculateGrams = (percentage: number) => {
    return ((percentage / 100) * batchSize).toFixed(2);
  };

  const updateTerpene = (terpene: keyof TerpeneFormula, value: number) => {
    setFormula((prev) => ({ ...prev, [terpene]: value }));
  };

  const normalizeFormula = () => {
    if (totalPercentage === 0) {
      alert("Veuillez définir au moins un terpène avant de normaliser");
      return;
    }

    const normalized: TerpeneFormula = {} as TerpeneFormula;
    Object.entries(formula).forEach(([terpene, value]) => {
      normalized[terpene as keyof TerpeneFormula] = (value / totalPercentage) * 100;
    });
    setFormula(normalized);
  };

  const saveFormula = () => {
    if (!formulaName.trim()) {
      alert("Veuillez donner un nom à votre formule");
      return;
    }

    if (!isValid) {
      alert("Le total doit être égal à 100%");
      return;
    }

    const newFormula: SavedFormula = {
      id: Date.now().toString(),
      name: formulaName,
      formula: { ...formula },
      batchSize,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedFormulas, newFormula];
    setSavedFormulas(updated);
    localStorage.setItem("perfumum-saved-formulas", JSON.stringify(updated));
    setFormulaName("");
  };

  const loadFormula = (saved: SavedFormula) => {
    setFormula(saved.formula);
    setBatchSize(saved.batchSize);
  };

  const deleteFormula = (id: string) => {
    const updated = savedFormulas.filter((f) => f.id !== id);
    setSavedFormulas(updated);
    localStorage.setItem("perfumum-saved-formulas", JSON.stringify(updated));
  };

  const exportToCSV = () => {
    if (!isValid) {
      alert("Le total doit être égal à 100% pour exporter");
      return;
    }

    const headers = ["Terpène", "Pourcentage (%)", `Grammes (pour ${batchSize}g)`];
    const rows = Object.entries(formula)
      .filter(([, value]) => value > 0)
      .map(([terpene, percentage]) => [
        TERPENE_NAMES[terpene as keyof typeof TERPENE_NAMES],
        percentage.toFixed(2),
        calculateGrams(percentage),
      ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `formule-perfumum-${Date.now()}.csv`;
    link.click();
  };

  const radarProfile = calculateRadarProfile();

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
                <Calculator className="w-4 h-4 mr-2" />
                Outil de Calcul
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Calculateur de Proportions
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Créez et optimisez vos formules terpéniques avec prévisualisation du profil olfactif
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container py-8 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Formula Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Batch Size */}
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Taille du Batch</CardTitle>
                      <CardDescription className="text-xs">Quantité totale à produire</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="batchSize" className="min-w-[100px] text-sm">
                      Quantité
                    </Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      min={1}
                      className="max-w-[150px] bg-background"
                    />
                    <span className="text-sm text-muted-foreground">grammes</span>
                  </div>
                </CardContent>
              </Card>

              {/* Terpenes Sliders */}
              <Card className="border-border/50">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Beaker className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Composition Terpénique</CardTitle>
                        <CardDescription className="text-xs">Ajustez les proportions</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={isValid ? "default" : totalPercentage > 100 ? "destructive" : "secondary"}
                      className="font-mono"
                    >
                      {isValid ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <AlertCircle className="w-3.5 h-3.5 mr-1.5" />}
                      {totalPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    {Object.entries(TERPENE_NAMES).map(([key, name]) => {
                      const value = formula[key as keyof TerpeneFormula];
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={key} className="font-medium text-sm">
                              {name}
                            </Label>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {value.toFixed(1)}%
                              </Badge>
                              <span className="text-xs text-muted-foreground w-16 text-right">
                                {calculateGrams(value)}g
                              </span>
                            </div>
                          </div>
                          <Slider
                            id={key}
                            value={[value]}
                            onValueChange={(vals) => updateTerpene(key as keyof TerpeneFormula, vals[0])}
                            max={100}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 flex gap-3">
                    <Button onClick={normalizeFormula} variant="outline" size="sm" className="flex-1">
                      Normaliser à 100%
                    </Button>
                    <Button onClick={exportToCSV} variant="outline" size="sm" disabled={!isValid}>
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Formula */}
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Sauvegarder la Formule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Nom de la formule..."
                      value={formulaName}
                      onChange={(e) => setFormulaName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveFormula()}
                      className="bg-background"
                    />
                    <Button onClick={saveFormula} disabled={!isValid} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Radar Preview & Saved Formulas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Radar Preview */}
              <Card className="border-border/50">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <CardTitle className="text-lg">Profil Olfactif</CardTitle>
                  <CardDescription className="text-xs">Visualisation en temps réel</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {totalPercentage > 0 ? (
                    <RadarChart
                      profiles={[
                        {
                          label: "Formule",
                          intensity: radarProfile.intensity,
                          freshness: radarProfile.freshness,
                          warmth: radarProfile.warmth,
                          sweetness: radarProfile.sweetness,
                          spiciness: radarProfile.spiciness,
                          earthiness: radarProfile.earthiness,
                          color: "hsl(var(--primary))",
                        },
                      ]}
                    />
                  ) : (
                    <div className="h-[280px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Beaker className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Ajoutez des terpènes</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Saved Formulas */}
              <Card className="border-border/50">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Formules Sauvegardées</CardTitle>
                    <Badge variant="secondary">{savedFormulas.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {savedFormulas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Aucune formule sauvegardée</p>
                  ) : (
                    <div className="space-y-2">
                      {savedFormulas.map((saved) => (
                        <div
                          key={saved.id}
                          className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => loadFormula(saved)}
                                className="font-medium text-sm hover:text-primary transition-colors text-left w-full truncate"
                              >
                                {saved.name}
                              </button>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(saved.createdAt).toLocaleDateString("fr-FR")} • {saved.batchSize}g
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteFormula(saved.id)}
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
