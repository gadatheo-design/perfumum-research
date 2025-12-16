import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Save, Download, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
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

  // Load saved formulas from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("perfumum-saved-formulas");
    if (saved) {
      setSavedFormulas(JSON.parse(saved));
    }
  }, []);

  // Calculate total percentage
  const totalPercentage = Object.values(formula).reduce((sum, val) => sum + val, 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  // Calculate resulting radar profile
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

  // Calculate grams for each terpene
  const calculateGrams = (percentage: number) => {
    return ((percentage / 100) * batchSize).toFixed(2);
  };

  // Update terpene percentage
  const updateTerpene = (terpene: keyof TerpeneFormula, value: number) => {
    setFormula((prev) => ({ ...prev, [terpene]: value }));
  };

  // Normalize to 100%
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

  // Save formula
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

  // Load formula
  const loadFormula = (saved: SavedFormula) => {
    setFormula(saved.formula);
    setBatchSize(saved.batchSize);

  };

  // Delete formula
  const deleteFormula = (id: string) => {
    const updated = savedFormulas.filter((f) => f.id !== id);
    setSavedFormulas(updated);
    localStorage.setItem("perfumum-saved-formulas", JSON.stringify(updated));

  };

  // Export to CSV
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
      "\uFEFF" + // BOM for Excel UTF-8
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `formule-perfumum-${Date.now()}.csv`;
    link.click();


  };

  const radarProfile = calculateRadarProfile();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <Breadcrumbs />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Calculateur de Proportions</h1>
          </div>
          <p className="text-muted-foreground">
            Créez et optimisez vos formules terpéniques avec prévisualisation du profil olfactif
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Formula Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Batch Size */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Taille du Batch</h2>
              <div className="flex items-center gap-4">
                <Label htmlFor="batchSize" className="min-w-[120px]">
                  Quantité totale
                </Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  min={1}
                  className="max-w-[150px]"
                />
                <span className="text-muted-foreground">grammes</span>
              </div>
            </Card>

            {/* Terpenes Sliders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Composition Terpénique</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      isValid ? "text-green-600" : totalPercentage > 100 ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    Total: {totalPercentage.toFixed(1)}%
                  </span>
                  {isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(TERPENE_NAMES).map(([key, name]) => {
                  const value = formula[key as keyof TerpeneFormula];
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={key} className="font-medium">
                          {name}
                        </Label>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                            {value.toFixed(1)}% = {calculateGrams(value)}g
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

              <div className="mt-6 flex gap-3">
                <Button onClick={normalizeFormula} variant="outline" className="flex-1">
                  Normaliser à 100%
                </Button>
                <Button onClick={exportToCSV} variant="outline" disabled={!isValid}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </Card>

            {/* Save Formula */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sauvegarder la Formule</h2>
              <div className="flex gap-3">
                <Input
                  placeholder="Nom de la formule..."
                  value={formulaName}
                  onChange={(e) => setFormulaName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveFormula()}
                />
                <Button onClick={saveFormula} disabled={!isValid}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </Card>
          </div>

          {/* Right: Radar Preview & Saved Formulas */}
          <div className="space-y-6">
            {/* Radar Preview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profil Olfactif Résultant</h2>
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
                      color: "rgba(139, 92, 246, 0.6)",
                    },
                  ]}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Ajoutez des terpènes pour voir le profil
                </div>
              )}
            </Card>

            {/* Saved Formulas */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Formules Sauvegardées ({savedFormulas.length})</h2>
              {savedFormulas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune formule sauvegardée</p>
              ) : (
                <div className="space-y-3">
                  {savedFormulas.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
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
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
