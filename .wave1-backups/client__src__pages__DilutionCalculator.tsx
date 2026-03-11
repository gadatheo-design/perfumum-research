// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Trash2, Download, History, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DilutionResult {
  moleculeName: string;
  targetConcentration: number;
  finalVolume: number;
  stockConcentration: number;
  volumeStock: number;
  volumeSolvent: number;
  formula: string;
  timestamp: string;
}

export default function DilutionCalculator() {
  const [moleculeName, setMoleculeName] = useState("");
  const [targetConcentration, setTargetConcentration] = useState(10);
  const [finalVolume, setFinalVolume] = useState(100);
  const [stockConcentration, setStockConcentration] = useState(100);
  const [history, setHistory] = useState<DilutionResult[]>([]);

  const calculateMutation = trpc.formulation.calculateDilution.useMutation({
    onSuccess: (data) => {
      const result: DilutionResult = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      const newHistory = [result, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("dilution-history", JSON.stringify(newHistory));
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("dilution-history");
    if (saved) {
      try {
        setHistory(safeJsonParse(saved, []));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleCalculate = () => {
    if (!moleculeName.trim()) {
      alert("Veuillez entrer le nom de la molécule");
      return;
    }
    calculateMutation.mutate({
      moleculeName,
      targetConcentration,
      finalVolume,
      stockConcentration,
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("dilution-history");
  };

  const exportPDF = () => {
    // Simple text export for now
    const text = history.map(h => 
      `${h.moleculeName} - ${h.formula}\n${new Date(h.timestamp).toLocaleString()}\n`
    ).join("\n");
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dilutions-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presets = [
    { label: "1%", value: 1 },
    { label: "5%", value: 5 },
    { label: "10%", value: 10 },
    { label: "20%", value: 20 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 section-spacing">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Calculateur de Dilution</h1>
            <p className="text-muted-foreground">
              Calculez précisément les volumes nécessaires pour vos dilutions moléculaires
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Card */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <CardTitle>Nouveau calcul</CardTitle>
                </div>
                <CardDescription>Entrez les paramètres de votre dilution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="molecule">Molécule</Label>
                  <Input
                    id="molecule"
                    placeholder="Ex: Géosmine, Limonène..."
                    value={moleculeName}
                    onChange={(e) => setMoleculeName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="target">Concentration cible (%)</Label>
                  <div className="flex gap-2 mb-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant="outline"
                        size="sm"
                        onClick={() => setTargetConcentration(preset.value)}
                        className={targetConcentration === preset.value ? "bg-primary/10" : ""}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <Input
                    id="target"
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={targetConcentration}
                    onChange={(e) => setTargetConcentration(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="volume">Volume final (mL)</Label>
                  <Input
                    id="volume"
                    type="number"
                    min="1"
                    step="1"
                    value={finalVolume}
                    onChange={(e) => setFinalVolume(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Concentration stock (%) - optionnel</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={stockConcentration}
                    onChange={(e) => setStockConcentration(parseFloat(e.target.value) || 100)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Par défaut: 100% (molécule pure)</p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCalculate}
                  disabled={calculateMutation.isPending}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {calculateMutation.isPending ? "Calcul..." : "Calculer"}
                </Button>

                {calculateMutation.data && (
                  <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20 space-y-2">
                    <p className="font-semibold text-primary">Résultat :</p>
                    <p className="text-sm">{calculateMutation.data.formula}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Volume stock:</span>
                        <p className="font-semibold">{calculateMutation.data.volumeStock} mL</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Volume solvant:</span>
                        <p className="font-semibold">{calculateMutation.data.volumeSolvent} mL</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History Card */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    <CardTitle>Historique</CardTitle>
                    <Badge variant="outline">{history.length}</Badge>
                  </div>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <>
                        <Button variant="outline" size="sm" onClick={exportPDF}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearHistory}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardDescription>Les 20 derniers calculs</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun calcul enregistré</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/50 rounded-lg border hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-sm">{item.moleculeName}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.targetConcentration}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.formula}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="brutal-border mt-6">
            <CardHeader>
              <CardTitle>Conseils d'utilisation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">📐 Précision</p>
                <p className="text-muted-foreground">
                  Utilisez une balance de précision (0.01g) pour les volumes inférieurs à 1 mL
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">🧪 Solvant</p>
                <p className="text-muted-foreground">
                  Éthanol 96% recommandé pour la plupart des molécules olfactives
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">⏱️ Maturation</p>
                <p className="text-muted-foreground">
                  Laisser reposer 24-48h après dilution pour homogénéisation complète
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
