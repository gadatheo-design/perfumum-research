import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { SankeyDiagram } from "@/components/SankeyDiagram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, GitBranch, Layers, BarChart3, Info, ArrowRight, Beaker, FlaskConical } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "wouter";

interface SankeyData {
  nodes: { name: string; category: string }[];
  links: { source: number; target: number; value: number }[];
}

export default function SankeyFlow() {
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null);
  const [viewMode, setViewMode] = useState<"category" | "family">("category");
  const { data: recettes, isLoading } = trpc.recettes.listWithRadar.useQuery({});

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!recettes) return null;
    
    const categoryCount = new Map<string, number>();
    recettes.forEach((recette) => {
      const category = recette.category || "Autre";
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    return {
      totalRecettes: recettes.length,
      categories: categoryCount.size,
      topCategory: Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])[0],
      categoryBreakdown: Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1]),
    };
  }, [recettes]);

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

    // Count recettes by category
    const categoryCount = new Map<string, number>();
    recettes.forEach((recette) => {
      const category = recette.category || "Autre";
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    // Build links: category → recettes
    categoryCount.forEach((count, category) => {
      const categoryIndex = getNodeIndex(category, "category");
      const recetteIndex = getNodeIndex(`${count} recettes`, "recette");

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
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <GitBranch className="w-4 h-4 mr-2" />
                Visualisation de Données
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Flux des Recettes
              </h1>
              <p className="text-lg text-muted-foreground">
                Visualisation interactive des relations entre catégories et recettes olfactives. 
                Explorez comment les {stats?.totalRecettes || 0} recettes sont organisées.
              </p>
            </motion.div>

            {/* Stats Cards */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-2xl mx-auto"
              >
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{stats.totalRecettes}</div>
                  <div className="text-xs text-muted-foreground">Recettes totales</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{stats.categories}</div>
                  <div className="text-xs text-muted-foreground">Catégories</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{stats.topCategory?.[1] || 0}</div>
                  <div className="text-xs text-muted-foreground">Plus grande catégorie</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground capitalize">{stats.topCategory?.[0] || "-"}</div>
                  <div className="text-xs text-muted-foreground">Catégorie principale</div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container space-y-8">
            {/* Sankey Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-border/50">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-primary" />
                        Diagramme de Sankey
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Les flux montrent la distribution des recettes par catégorie. La largeur représente le nombre de recettes.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {sankeyData ? (
                    <div className="p-6 overflow-x-auto">
                      <SankeyDiagram data={sankeyData} width={960} height={500} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <Info className="w-5 h-5 mr-2" />
                      Aucune donnée disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Breakdown */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary" />
                      Répartition par Catégorie
                    </CardTitle>
                    <CardDescription>
                      Distribution détaillée des recettes dans chaque catégorie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stats.categoryBreakdown.map(([category, count], index) => {
                        const percentage = ((count / stats.totalRecettes) * 100).toFixed(1);
                        const colors = [
                          "bg-violet-500",
                          "bg-amber-500",
                          "bg-emerald-500",
                          "bg-rose-500",
                          "bg-sky-500",
                          "bg-orange-500",
                        ];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div
                            key={category}
                            className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                          >
                            <div className={`w-3 h-12 rounded-full ${color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium capitalize truncate">{category}</p>
                              <p className="text-sm text-muted-foreground">
                                {count} recettes ({percentage}%)
                              </p>
                            </div>
                            <div className="text-2xl font-bold text-muted-foreground/50">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Legend & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Légende</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: "oklch(0.65 0.25 280)" }} />
                    <div>
                      <p className="font-medium">Catégories</p>
                      <p className="text-sm text-muted-foreground">Types de recettes (parfum, encens, résine...)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: "oklch(0.75 0.15 60)" }} />
                    <div>
                      <p className="font-medium">Recettes</p>
                      <p className="text-sm text-muted-foreground">Nombre de recettes par catégorie</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Explorer plus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/recettes">
                    <Button variant="outline" className="w-full justify-between">
                      Voir toutes les recettes
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/synergies-heatmap">
                    <Button variant="outline" className="w-full justify-between">
                      Heatmap des synergies
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/graphe-molecules-recettes">
                    <Button variant="outline" className="w-full justify-between">
                      Graphe molécules-recettes
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
