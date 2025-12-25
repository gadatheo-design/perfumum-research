import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { EnhancedRadarChart } from "@/components/EnhancedRadarChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EnhancedRadarDemo() {
  const [selectedRecetteId, setSelectedRecetteId] = useState<number | null>(null);
  const [showAverage, setShowAverage] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [animate, setAnimate] = useState(true);

  const { data: recettes, isLoading } = trpc.recettes.listWithRadar.useQuery({});

  // Calculate average and confidence intervals for all recettes
  const calculateStats = () => {
    if (!recettes || recettes.length === 0) return null;

    const axes = [
      { key: "avgIntensity", label: "Intensité" },
      { key: "avgFreshness", label: "Fraîcheur" },
      { key: "avgWarmth", label: "Chaleur" },
      { key: "avgSweetness", label: "Douceur" },
      { key: "avgSpiciness", label: "Épices" },
      { key: "avgEarthiness", label: "Terreux" },
    ];

    return axes.map(({ key, label }) => {
      const values = recettes.map((r) => (r as any)[key] || 0);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      return { axis: label, avg, min, max };
    });
  };

  const selectedRecette = recettes?.find((r) => r.id === selectedRecetteId);

  const radarData = selectedRecette
    ? [
        { axis: "Intensité", value: selectedRecette.avgIntensity },
        { axis: "Fraîcheur", value: selectedRecette.avgFreshness },
        { axis: "Chaleur", value: selectedRecette.avgWarmth },
        { axis: "Douceur", value: selectedRecette.avgSweetness },
        { axis: "Épices", value: selectedRecette.avgSpiciness },
        { axis: "Terreux", value: selectedRecette.avgEarthiness },
      ].map((d, i) => {
        const stats = calculateStats();
        return {
          ...d,
          avg: stats?.[i].avg,
          min: stats?.[i].min,
          max: stats?.[i].max,
        };
      })
    : [];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profils Radar Enrichis</h1>
        <p className="text-muted-foreground">
          Visualisation avancée avec superposition de moyennes, zones de confiance et export SVG
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Sélectionner une recette</Label>
              <Select
                value={selectedRecetteId?.toString() || ""}
                onValueChange={(value) => setSelectedRecetteId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une recette..." />
                </SelectTrigger>
                <SelectContent>
                  {recettes?.map((recette) => (
                    <SelectItem key={recette.id} value={recette.id.toString()}>
                      {recette.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-average">Afficher la moyenne</Label>
                <Switch
                  id="show-average"
                  checked={showAverage}
                  onCheckedChange={setShowAverage}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-confidence">Zone de confiance (min-max)</Label>
                <Switch
                  id="show-confidence"
                  checked={showConfidence}
                  onCheckedChange={setShowConfidence}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animate">Animation</Label>
                <Switch id="animate" checked={animate} onCheckedChange={setAnimate} />
              </div>
            </div>
          </div>

          {selectedRecette ? (
            <div className="mt-6">
              <EnhancedRadarChart
                data={radarData}
                width={600}
                height={600}
                showAverage={showAverage}
                showConfidence={showConfidence}
                animate={animate}
                title={selectedRecette.name}
                color="oklch(0.65 0.25 280)"
                avgColor="oklch(0.70 0.15 160)"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Sélectionnez une recette pour voir son profil radar enrichi
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Fonctionnalités</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">📊 Superposition de moyenne</h4>
            <p className="text-sm text-muted-foreground">
              Compare le profil de la recette avec la moyenne de toutes les recettes (ligne
              pointillée verte)
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">📈 Zone de confiance</h4>
            <p className="text-sm text-muted-foreground">
              Affiche la plage min-max de chaque axe pour contextualiser les valeurs
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">✨ Animation fluide</h4>
            <p className="text-sm text-muted-foreground">
              Transition animée lors du changement de recette pour une meilleure compréhension
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">💾 Export SVG</h4>
            <p className="text-sm text-muted-foreground">
              Téléchargez le graphique en haute résolution pour vos publications
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
