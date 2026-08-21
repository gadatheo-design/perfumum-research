import { useState, useEffect, useMemo } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CoOccurrence {
  terpene1: string;
  terpene2: string;
  count: number;
  recipes: string[];
}

const TERPENE_NAMES: Record<number, string> = {
  1: "Myrcène",
  2: "Limonène",
  3: "α-Pinène",
  4: "β-Pinène",
  5: "β-Caryophyllène",
  6: "Linalool",
  7: "Humulène",
};

export default function CorrelationAnalysis() {
  const [coOccurrences, setCoOccurrences] = useState<CoOccurrence[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  // Fetch all molecule-recipe relationships
  const { data: relationships, isLoading } = trpc.molecule.getAllRelationships.useQuery();

  useEffect(() => {
    if (!relationships) return;

    // Build co-occurrence matrix
    const matrix: Map<string, CoOccurrence> = new Map();
    const terpeneIds = Object.keys(TERPENE_NAMES).map(Number);

    // Group by recipe
    const recipeGroups = new Map<number, Set<number>>();
    relationships?.forEach((rel: { moleculeId: number; recetteId: number; proportion: string | null }) => {
      if (!recipeGroups.has(rel.recetteId)) {
        recipeGroups.set(rel.recetteId, new Set());
      }
      recipeGroups.get(rel.recetteId)!.add(rel.moleculeId);
    });

    // Calculate co-occurrences
    recipeGroups.forEach((terpenes, recipeId) => {
      const terpeneArray = Array.from(terpenes);
      for (let i = 0; i < terpeneArray.length; i++) {
        for (let j = i + 1; j < terpeneArray.length; j++) {
          const t1 = terpeneArray[i];
          const t2 = terpeneArray[j];
          if (!TERPENE_NAMES[t1] || !TERPENE_NAMES[t2]) continue;

          const key = [t1, t2].sort().join("-");
          if (!matrix.has(key)) {
            matrix.set(key, {
              terpene1: TERPENE_NAMES[t1],
              terpene2: TERPENE_NAMES[t2],
              count: 0,
              recipes: [],
            });
          }
          const entry = matrix.get(key)!;
          entry.count++;
          entry.recipes.push(`Recette #${recipeId}`);
        }
      }
    });

    // Sort by count
    const sorted = Array.from(matrix.values()).sort((a, b) => b.count - a.count);
    setCoOccurrences(sorted);

    // Build heatmap matrix (7x7)
    const heatmap: number[][] = Array(7)
      .fill(0)
      .map(() => Array(7).fill(0));
    matrix.forEach((value) => {
      const id1 = Object.entries(TERPENE_NAMES).find(([, name]) => name === value.terpene1)?.[0];
      const id2 = Object.entries(TERPENE_NAMES).find(([, name]) => name === value.terpene2)?.[0];
      if (id1 && id2) {
        const idx1 = Number(id1) - 1;
        const idx2 = Number(id2) - 1;
        heatmap[idx1][idx2] = value.count;
        heatmap[idx2][idx1] = value.count;
      }
    });
    setHeatmapData(heatmap);
  }, [relationships]);

  // Get color for heatmap cell
  const getHeatmapColor = (count: number, max: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    const intensity = Math.min(count / max, 1);
    if (intensity > 0.7) return "bg-violet-600 text-white";
    if (intensity > 0.4) return "bg-violet-400 text-white";
    if (intensity > 0.2) return "bg-violet-300";
    return "bg-violet-200";
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Terpène 1", "Terpène 2", "Nombre de co-occurrences", "Recettes"];
    const rows = coOccurrences.map((co) => [
      co.terpene1,
      co.terpene2,
      co.count.toString(),
      co.recipes.join("; "),
    ]);

    const csvContent =
      "\uFEFF" + // BOM for Excel UTF-8
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `correlations-terpenes-${Date.now()}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des analyses...</p>
      </div>
    );
  }

  const maxCount = Math.max(...coOccurrences.map((co) => co.count), 1);
  const terpeneNames = Object.values(TERPENE_NAMES);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <Breadcrumbs />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Analyses de Corrélations</h1>
          </div>
          <p className="text-muted-foreground">
            Découvrez quels terpènes apparaissent ensemble dans les recettes PERFUMUM
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Heatmap */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Matrice de Co-occurrences</h2>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-xs font-medium text-left"></th>
                    {terpeneNames.map((name, idx) => (
                      <th key={idx} className="p-2 text-xs font-medium text-center">
                        <div className="transform -rotate-45 origin-left whitespace-nowrap">{name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {terpeneNames.map((name1, i) => (
                    <tr key={i}>
                      <td className="p-2 text-xs font-medium">{name1}</td>
                      {terpeneNames.map((name2, j) => {
                        const count = i === j ? 0 : heatmapData[i]?.[j] || 0;
                        return (
                          <td
                            key={j}
                            className={`p-2 text-center text-xs font-medium border ${getHeatmapColor(
                              count,
                              maxCount
                            )}`}
                            title={
                              i === j
                                ? ""
                                : `${name1} + ${name2}: ${count} recette${count > 1 ? "s" : ""}`
                            }
                          >
                            {i === j ? "-" : count > 0 ? count : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-violet-200 border"></div>
                <span>Faible (1-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-violet-400 border"></div>
                <span>Moyen (3-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-violet-600 border"></div>
                <span>Fort (6+)</span>
              </div>
            </div>
          </Card>

          {/* Right: Top Combinations */}
          <div className="space-y-6">
            {/* Top 5 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Top 5 Combinaisons</h2>
              {coOccurrences.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune corrélation détectée</p>
              ) : (
                <div className="space-y-3">
                  {coOccurrences.slice(0, 5).map((co, idx) => (
                    <div key={idx} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {co.terpene1} + {co.terpene2}
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {co.count} recette{co.count > 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{co.recipes.join(", ")}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Suggestions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Suggestions Optimales</h2>
              {coOccurrences.length === 0 ? (
                <p className="text-sm text-muted-foreground">Pas assez de données pour suggérer des combinaisons</p>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Combinaison la plus fréquente
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {coOccurrences[0].terpene1} + {coOccurrences[0].terpene2} apparaissent ensemble dans{" "}
                      {coOccurrences[0].count} recettes. Cette synergie est éprouvée dans vos formulations.
                    </p>
                  </div>

                  {coOccurrences.length > 1 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Synergie complémentaire
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Essayez d'associer {coOccurrences[1].terpene1} + {coOccurrences[1].terpene2} (
                        {coOccurrences[1].count} occurrences) pour des profils équilibrés.
                      </p>
                    </div>
                  )}

                  {coOccurrences.length > 2 && (
                    <div className="p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-lg">
                      <h3 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">
                        Combinaison expérimentale
                      </h3>
                      <p className="text-sm text-violet-800 dark:text-violet-200">
                        {coOccurrences[2].terpene1} + {coOccurrences[2].terpene2} ({coOccurrences[2].count}{" "}
                        occurrences) offre des possibilités créatives intéressantes.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Statistics */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{coOccurrences.length}</div>
                  <div className="text-xs text-muted-foreground">Paires uniques</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{maxCount}</div>
                  <div className="text-xs text-muted-foreground">Max co-occurrences</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {coOccurrences.reduce((sum, co) => sum + co.count, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total corrélations</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {(coOccurrences.reduce((sum, co) => sum + co.count, 0) / coOccurrences.length || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Moyenne par paire</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
