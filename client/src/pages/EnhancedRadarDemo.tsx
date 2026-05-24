// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { EnhancedRadarChart } from "@/components/EnhancedRadarChart";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Radar, BarChart3, TrendingUp, Download, 
  Sparkles, Layers, ArrowRight, Settings2 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";

export default function EnhancedRadarDemo() {
  const [selectedRecetteId, setSelectedRecetteId] = useState<number | null>(null);
  const [showAverage, setShowAverage] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [animate, setAnimate] = useState(true);

  const { data: recettes, isLoading } = trpc.recettes?.listWithRadar.useQuery({});

  // Calculate average and confidence intervals for all recettes
  const calculateStats = () => {
    if (!recettes || recettes?.length === 0) return null;

    const axes = [
      { key: "avgIntensity", label: "Intensité" },
      { key: "avgFreshness", label: "Fraîcheur" },
      { key: "avgWarmth", label: "Chaleur" },
      { key: "avgSweetness", label: "Douceur" },
      { key: "avgSpiciness", label: "Épices" },
      { key: "avgEarthiness", label: "Terreux" },
    ];

    return axes.map(({ key, label }) => {
      const values = recettes?.map((r) => (r as any)[key] || 0);
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
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Radar className="w-4 h-4 mr-2" />
                Visualisation Avancée
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Profils Radar Enrichis
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Visualisation avancée avec superposition de moyennes, zones de confiance et export SVG.
                Analysez les profils olfactifs de vos recettes en détail.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{recettes?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Recettes</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">6</div>
                  <div className="text-xs text-muted-foreground">Axes d'analyse</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <BarChart3 className="w-5 h-5 mx-auto text-primary mb-1" />
                  <div className="text-xs text-muted-foreground">Moyenne globale</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <TrendingUp className="w-5 h-5 mx-auto text-primary mb-1" />
                  <div className="text-xs text-muted-foreground">Zone de confiance</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8 space-y-6">
          {/* Controls Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-violet-600" />
                  Configuration du radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Sélectionner une recette</Label>
                    <Select
                      value={selectedRecetteId?.toString() || ""}
                      onValueChange={(value) => setSelectedRecetteId(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
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
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        <Label htmlFor="show-average">Afficher la moyenne</Label>
                      </div>
                      <Switch
                        id="show-average"
                        checked={showAverage}
                        onCheckedChange={setShowAverage}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <Label htmlFor="show-confidence">Zone de confiance (min-max)</Label>
                      </div>
                      <Switch
                        id="show-confidence"
                        checked={showConfidence}
                        onCheckedChange={setShowConfidence}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <Label htmlFor="animate">Animation</Label>
                      </div>
                      <Switch id="animate" checked={animate} onCheckedChange={setAnimate} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="w-5 h-5 text-violet-600" />
                    {selectedRecette ? selectedRecette.name : "Profil Radar"}
                  </CardTitle>
                  {selectedRecette && (
                    <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                      Recette sélectionnée
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedRecette ? (
                  <div className="flex justify-center">
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
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Radar className="w-16 h-16 mb-4 opacity-30" />
                    <p>Sélectionnez une recette pour voir son profil radar enrichi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  Fonctionnalités avancées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Superposition de moyenne</h4>
                      <p className="text-sm text-muted-foreground">
                        Compare le profil de la recette avec la moyenne de toutes les recettes (ligne pointillée verte)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Zone de confiance</h4>
                      <p className="text-sm text-muted-foreground">
                        Affiche la plage min-max de chaque axe pour contextualiser les valeurs
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Animation fluide</h4>
                      <p className="text-sm text-muted-foreground">
                        Transition animée lors du changement de recette pour une meilleure compréhension
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Export SVG</h4>
                      <p className="text-sm text-muted-foreground">
                        Téléchargez le graphique en haute résolution pour vos publications
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-muted/30 rounded-lg"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              Autres visualisations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/compare-radar">
                <div className="block p-4 bg-background rounded-lg border hover:border-violet-500/50 transition-colors cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-violet-600" />
                    Comparateur Radar
                  </div>
                  <div className="text-sm text-muted-foreground">Comparer plusieurs profils</div>
                </div>
              </Link>
              <Link href="/graphe-molecules-recettes">
                <div className="block p-4 bg-background rounded-lg border hover:border-violet-500/50 transition-colors cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-violet-600" />
                    Graphe Réseau
                  </div>
                  <div className="text-sm text-muted-foreground">Relations molécules-recettes</div>
                </div>
              </Link>
              <Link href="/sankey-flow">
                <div className="block p-4 bg-background rounded-lg border hover:border-violet-500/50 transition-colors cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-violet-600" />
                    Sankey Flow
                  </div>
                  <div className="text-sm text-muted-foreground">Flux des familles olfactives</div>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
