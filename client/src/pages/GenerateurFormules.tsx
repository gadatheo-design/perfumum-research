import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";

export default function GenerateurFormules() {
  // Sliders radar (0-100)
  const [intensity, setIntensity] = useState(50);
  const [freshness, setFreshness] = useState(50);
  const [warmth, setWarmth] = useState(50);
  const [sweetness, setSweetness] = useState(50);
  const [spiciness, setSpiciness] = useState(50);
  const [earthiness, setEarthiness] = useState(50);

  const [limit, setLimit] = useState(10);

  // Appel tRPC pour obtenir les suggestions
  const { data: suggestions, isLoading, refetch } = trpc.molecules.getSuggestionsByRadar.useQuery({
    radarIntensity: intensity,
    radarFreshness: freshness,
    radarWarmth: warmth,
    radarSweetness: sweetness,
    radarSpiciness: spiciness,
    radarEarthiness: earthiness,
    limit,
  });

  const handleReset = () => {
    setIntensity(50);
    setFreshness(50);
    setWarmth(50);
    setSweetness(50);
    setSpiciness(50);
    setEarthiness(50);
  };

  const handleExportCSV = () => {
    if (!suggestions || suggestions.length === 0) return;

    const headers = ["Rang", "Molécule", "Famille", "Score de compatibilité", "Profil olfactif"];
    const rows = suggestions.map((s, idx) => [
      idx + 1,
      s.name,
      s.family || "N/A",
      `${s.compatibilityScore}%`,
      s.olfactiveProfile || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formule-generee-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!suggestions || suggestions.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les pop-ups pour exporter le PDF");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Formule Générée - PERFUMUM</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
          h1 { color: #7c3aed; margin-bottom: 10px; }
          h2 { color: #5b21b6; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: 600; }
          .radar-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
          .radar-item { padding: 10px; background: #f9fafb; border-radius: 8px; }
          .radar-item strong { display: block; margin-bottom: 5px; color: #7c3aed; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <h1>Formule Générée par IA</h1>
        <p style="color: #6b7280; margin-bottom: 30px;">Générée le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>

        <h2>Profil Radar Cible</h2>
        <div class="radar-values">
          <div class="radar-item"><strong>Intensité</strong>${intensity}/100</div>
          <div class="radar-item"><strong>Fraîcheur</strong>${freshness}/100</div>
          <div class="radar-item"><strong>Chaleur</strong>${warmth}/100</div>
          <div class="radar-item"><strong>Douceur</strong>${sweetness}/100</div>
          <div class="radar-item"><strong>Épicé</strong>${spiciness}/100</div>
          <div class="radar-item"><strong>Terreux</strong>${earthiness}/100</div>
        </div>

        <h2>Top ${suggestions.length} Molécules Compatibles</h2>
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Molécule</th>
              <th>Famille</th>
              <th>Score</th>
              <th>Profil Olfactif</th>
            </tr>
          </thead>
          <tbody>
            ${suggestions
              .map(
                (s: any, idx: number) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.family || "N/A"}</td>
                <td>${s.compatibilityScore}%</td>
                <td>${s.olfactiveProfile || "N/A"}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>PERFUMUM — Recherche Olfactive</p>
          <p>Générateur de Formules IA basé sur l'analyse de profils radar moléculaires</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumbs />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Générateur de Formules IA</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Définissez votre profil olfactif cible avec les 6 axes radar, et l'IA vous suggère les molécules les plus compatibles pour créer votre formule.
          </p>
        </div>

        {/* Sliders Radar */}
        <div className="card p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Profil Radar Cible</h2>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>

          <div className="space-y-6">
            {/* Intensité */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Intensité</label>
                <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{intensity}/100</span>
              </div>
              <Slider value={[intensity]} onValueChange={([v]) => setIntensity(v)} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Puissance olfactive globale</p>
            </div>

            {/* Fraîcheur */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Fraîcheur</label>
                <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{freshness}/100</span>
              </div>
              <Slider value={[freshness]} onValueChange={([v]) => setFreshness(v)} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Notes citronnées, mentholées, aquatiques</p>
            </div>

            {/* Chaleur */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Chaleur</label>
                <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{warmth}/100</span>
              </div>
              <Slider value={[warmth]} onValueChange={([v]) => setWarmth(v)} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Notes boisées, ambrées, résineuses</p>
            </div>

            {/* Douceur */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Douceur</label>
                <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{sweetness}/100</span>
              </div>
              <Slider value={[sweetness]} onValueChange={([v]) => setSweetness(v)} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Notes florales, fruitées, vanillées</p>
            </div>

            {/* Épicé */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Épicé</label>
                <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{spiciness}/100</span>
              </div>
              <Slider value={[spiciness]} onValueChange={([v]) => setSpiciness(v)} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Notes poivrées, gingembre, clou de girofle</p>
            </div>

            {/* Terreux */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">Terreux</label>
                <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{earthiness}/100</span>
              </div>
              <Slider value={[earthiness]} onValueChange={([v]) => setEarthiness(v)} min={0} max={100} step={5} />
              <p className="text-xs text-muted-foreground mt-1">Notes de mousse, terre humide, pétrichor</p>
            </div>
          </div>

          {/* Limite résultats */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold">Nombre de suggestions</label>
              <span className="text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{limit}</span>
            </div>
            <Slider value={[limit]} onValueChange={([v]) => setLimit(v)} min={5} max={20} step={1} />
          </div>
        </div>

        {/* Résultats */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Molécules Suggérées</h2>
            {suggestions && suggestions.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && suggestions && suggestions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucune molécule ne correspond à ce profil radar.</p>
              <p className="text-sm mt-2">Essayez d'ajuster les valeurs des sliders.</p>
            </div>
          )}

          {!isLoading && suggestions && suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((molecule: any, index: number) => (
                <Link key={molecule.id} href={`/molecules/${molecule.id}`}>
                  <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                          <div>
                            <h3 className="text-lg font-semibold">{molecule.name}</h3>
                            {molecule.family && (
                              <p className="text-sm text-muted-foreground">{molecule.family}</p>
                            )}
                          </div>
                        </div>
                        {molecule.olfactiveProfile && (
                          <p className="text-sm text-muted-foreground mt-2">{molecule.olfactiveProfile}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{molecule.compatibilityScore}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Compatibilité</p>
                      </div>
                    </div>

                    {/* Mini radar values */}
                    <div className="grid grid-cols-6 gap-2 mt-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Int.</p>
                        <p className="text-sm font-semibold">{molecule.radarIntensity || 50}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Fraî.</p>
                        <p className="text-sm font-semibold">{molecule.radarFreshness || 50}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Chal.</p>
                        <p className="text-sm font-semibold">{molecule.radarWarmth || 50}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Douc.</p>
                        <p className="text-sm font-semibold">{molecule.radarSweetness || 50}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Épic.</p>
                        <p className="text-sm font-semibold">{molecule.radarSpiciness || 50}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Terr.</p>
                        <p className="text-sm font-semibold">{molecule.radarEarthiness || 50}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="card p-6 mt-8 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-3">Comment ça marche ?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>1. Définissez votre profil cible</strong> : Ajustez les 6 sliders radar pour créer le profil olfactif que vous recherchez.
            </p>
            <p>
              <strong>2. Algorithme de similarité</strong> : L'IA calcule la distance euclidienne entre votre profil cible et les 176 molécules de la base de données.
            </p>
            <p>
              <strong>3. Suggestions classées</strong> : Les molécules les plus compatibles sont affichées par ordre décroissant de score (100% = correspondance parfaite).
            </p>
            <p>
              <strong>4. Export</strong> : Téléchargez vos résultats en CSV (pour Excel) ou PDF (pour impression).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
