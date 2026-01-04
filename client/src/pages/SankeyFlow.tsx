import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { SankeyDiagram } from "@/components/SankeyDiagram";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface SankeyData {
  nodes: { name: string; category: string }[];
  links: { source: number; target: number; value: number }[];
}

export default function SankeyFlow() {
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null);
  const { data: recettes, isLoading } = trpc.recettes.listWithRadar.useQuery({});

  useEffect(() => {
    if (!recettes) return;

    // Build Sankey data structure
    const nodes: { name: string; category: string }[] = [];
    const links: { source: number; target: number; value: number }[] = [];
    const nodeMap = new Map<string, number>();

    // Helper to get or create node index
    const getNodeIndex = (name: string, category: string) => {
      const key = `${category}:${name}`;
      if (nodeMap.has(key)) {
        return nodeMap.get(key)!;
      }
      const index = nodes.length;
      nodes.push({ name, category });
      nodeMap.set(key, index);
      return index;
    };

    // Count recettes by category (we'll use category as the main grouping)
    const categoryCount = new Map<string, number>();

    recettes.forEach((recette) => {
      const category = recette.category || "Autre";
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    // Build links: category → recettes
    categoryCount.forEach((count, category) => {
      const categoryIndex = getNodeIndex(category, "category");
      const recetteIndex = getNodeIndex(`${count} recettes`, "recette");

      // Link category → recettes
      links.push({
        source: categoryIndex,
        target: recetteIndex,
        value: count,
      });
    });

    setSankeyData({ nodes, links });
  }, [recettes]);

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
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Flux des Recettes</h1>
        <p className="text-muted-foreground">
          Visualisation du flux : Catégories → Recettes
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Diagramme de Sankey</h2>
            <p className="text-sm text-muted-foreground">
              Les flux montrent comment les recettes sont organisées par catégorie.
              La largeur des flux représente le nombre de recettes.
            </p>
          </div>

          {sankeyData ? (
            <SankeyDiagram data={sankeyData} width={960} height={600} />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Légende</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.65 0.25 280)" }} />
            <div>
              <div className="font-medium">Catégories</div>
              <div className="text-sm text-muted-foreground">Types de recettes</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "oklch(0.75 0.15 60)" }} />
            <div>
              <div className="font-medium">Recettes</div>
              <div className="text-sm text-muted-foreground">Nombre total</div>
            </div>
          </div>
        </div>
      </Card>
      </main>
      
      <Footer />
    </div>
  );
}
