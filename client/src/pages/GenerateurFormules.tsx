// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Download, RefreshCw, Loader2, Save, Zap, Droplets, Flame, Heart, Leaf, Mountain, Info, ArrowRight, History } from "lucide-react";
import { SynergySuggestions } from "@/components/SynergySuggestions";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const RADAR_AXES = [
  { key: "intensity", label: "Intensité", description: "Puissance olfactive globale", icon: Zap, color: "text-violet-500", bgColor: "bg-violet-100 dark:bg-violet-900/30" },
  { key: "freshness", label: "Fraîcheur", description: "Notes citronnées, mentholées, aquatiques", icon: Droplets, color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-900/30" },
  { key: "warmth", label: "Chaleur", description: "Notes boisées, ambrées, résineuses", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  { key: "sweetness", label: "Douceur", description: "Notes florales, fruitées, vanillées", icon: Heart, color: "text-rose-500", bgColor: "bg-rose-100 dark:bg-rose-900/30" },
  { key: "spiciness", label: "Épicé", description: "Notes poivrées, gingembre, clou de girofle", icon: Leaf, color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  { key: "earthiness", label: "Terreux", description: "Notes de mousse, terre humide, pétrichor", icon: Mountain, color: "text-emerald-500", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
];

export default function GenerateurFormules() {
  const [intensity, setIntensity] = useState(50);
  const [freshness, setFreshness] = useState(50);
  const [warmth, setWarmth] = useState(50);
  const [sweetness, setSweetness] = useState(50);
  const [spiciness, setSpiciness] = useState(50);
  const [earthiness, setEarthiness] = useState(50);
  const [limit, setLimit] = useState(10);
  
  const { toast } = useToast();
  
  const saveFormula = trpc.formulas.save.useMutation({
    onSuccess: () => {
      toast({ title: "Formule sauvegardée", description: "Vous pouvez la retrouver dans l'historique", variant: "default" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const { data: suggestions, isLoading } = trpc.molecules.getSuggestionsByRadar.useQuery({
    radarIntensity: intensity,
    radarFreshness: freshness,
    radarWarmth: warmth,
    radarSweetness: sweetness,
    radarSpiciness: spiciness,
    radarEarthiness: earthiness,
    limit,
  });

  const values: Record<string, number> = { intensity, freshness, warmth, sweetness, spiciness, earthiness };
  const setters: Record<string, (v: number) => void> = {
    intensity: setIntensity,
    freshness: setFreshness,
    warmth: setWarmth,
    sweetness: setSweetness,
    spiciness: setSpiciness,
    earthiness: setEarthiness,
  };

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
          <thead><tr><th>Rang</th><th>Molécule</th><th>Famille</th><th>Score</th><th>Profil Olfactif</th></tr></thead>
          <tbody>
            ${suggestions.map((s: any, idx: number) => `
              <tr><td>${idx + 1}</td><td><strong>${s.name}</strong></td><td>${s.family || "N/A"}</td><td>${s.compatibilityScore}%</td><td>${s.olfactiveProfile || "N/A"}</td></tr>
            `).join("")}
          </tbody>
        </table>
        <div class="footer"><p>PERFUMUM — Recherche Olfactive</p><p>Générateur de Formules IA</p></div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

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
                <Sparkles className="w-4 h-4 mr-2" />
                Intelligence Artificielle
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Générateur de Formules IA
              </h1>
              <p className="text-lg text-muted-foreground">
                Définissez votre profil olfactif cible avec les 6 axes radar, et l'IA vous suggère les molécules les plus compatibles.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Radar Controls */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card className="sticky top-24 border-border/50">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Profil Radar</CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleReset}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                    <CardDescription>Ajustez les 6 axes pour définir votre cible</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {RADAR_AXES.map((axis) => {
                      const Icon = axis.icon;
                      const value = values[axis.key];
                      const setValue = setters[axis.key];
                      
                      return (
                        <div key={axis.key} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${axis.bgColor} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${axis.color}`} />
                              </div>
                              <span className="font-medium">{axis.label}</span>
                            </div>
                            <Badge variant="secondary" className="font-mono">
                              {value}
                            </Badge>
                          </div>
                          <Slider 
                            value={[value]} 
                            onValueChange={([v]) => setValue(v)} 
                            min={0} 
                            max={100} 
                            step={5}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground">{axis.description}</p>
                        </div>
                      );
                    })}
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Suggestions</span>
                        <Badge variant="secondary" className="font-mono">{limit}</Badge>
                      </div>
                      <Slider 
                        value={[limit]} 
                        onValueChange={([v]) => setLimit(v)} 
                        min={5} 
                        max={20} 
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Actions Bar */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-semibold">
                          {suggestions?.length || 0} molécules suggérées
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {suggestions && suggestions.length > 0 && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => saveFormula.mutate({
                                radarProfile: { intensity, freshness, warmth, sweetness, spiciness, earthiness },
                                suggestions: suggestions.map(s => ({
                                  id: s.id,
                                  name: s.name,
                                  compatibilityScore: s.compatibilityScore,
                                  radarIntensity: s.radarIntensity ?? undefined,
                                  radarFreshness: s.radarFreshness ?? undefined,
                                  radarWarmth: s.radarWarmth ?? undefined,
                                  radarSweetness: s.radarSweetness ?? undefined,
                                  radarSpiciness: s.radarSpiciness ?? undefined,
                                  radarEarthiness: s.radarEarthiness ?? undefined,
                                })),
                              })}
                              disabled={saveFormula.isPending}
                            >
                              {saveFormula.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                              Sauvegarder
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportCSV}>
                              <Download className="w-4 h-4 mr-2" />
                              CSV
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportPDF}>
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </>
                        )}
                        <Link href="/historique-formules">
                          <Button variant="ghost" size="sm">
                            <History className="w-4 h-4 mr-2" />
                            Historique
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loading State */}
                {isLoading && (
                  <Card className="border-border/50">
                    <CardContent className="flex items-center justify-center py-16">
                      <div className="text-center space-y-4">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground">Analyse en cours...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Empty State */}
                {!isLoading && suggestions && suggestions.length === 0 && (
                  <Card className="border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">Aucune molécule ne correspond</p>
                      <p className="text-sm text-muted-foreground mt-2">Essayez d'ajuster les valeurs des sliders.</p>
                    </CardContent>
                  </Card>
                )}

                {/* Results List */}
                {!isLoading && suggestions && suggestions.length > 0 && (
                  <div className="space-y-4">
                    {suggestions.map((molecule: any, index: number) => (
                      <motion.div
                        key={molecule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/molecules/${molecule.id}`}>
                          <Card className="group border-border/50 hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex">
                                {/* Rank Badge */}
                                <div className="w-16 md:w-20 flex-shrink-0 bg-primary/5 flex items-center justify-center border-r">
                                  <span className="text-2xl md:text-3xl font-bold text-primary">#{index + 1}</span>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 p-4 md:p-5">
                                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                                          {molecule.name}
                                        </h3>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                      </div>
                                      {molecule.family && (
                                        <Badge variant="outline" className="mb-2">{molecule.family}</Badge>
                                      )}
                                      {molecule.olfactiveProfile && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                          {molecule.olfactiveProfile}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {/* Score */}
                                    <div className="flex items-center gap-3 md:text-right">
                                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl font-bold text-primary">{molecule.compatibilityScore}%</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Mini Radar */}
                                  <div className="grid grid-cols-6 gap-2 mt-4 pt-4 border-t">
                                    {RADAR_AXES.map((axis) => {
                                      const radarKey = `radar${axis.key.charAt(0).toUpperCase() + axis.key.slice(1)}` as keyof typeof molecule;
                                      const value = molecule[radarKey] || 50;
                                      return (
                                        <div key={axis.key} className="text-center">
                                          <p className="text-xs text-muted-foreground mb-1">{axis.label.slice(0, 4)}.</p>
                                          <p className={`text-sm font-semibold ${axis.color}`}>{value}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Synergy Suggestions - Nouvelles suggestions basées sur les synergies documentées */}
                {suggestions && suggestions.length > 0 && (
                  <SynergySuggestions
                    selectedMoleculeIds={suggestions.slice(0, 5).map((s: any) => s.id)}
                    className="mb-4"
                  />
                )}

                {/* Info Card */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Comment ça marche ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">1. Définissez votre profil cible</strong> : Ajustez les 6 sliders radar pour créer le profil olfactif que vous recherchez.</p>
                    <p><strong className="text-foreground">2. Algorithme de similarité</strong> : L'IA calcule la distance euclidienne entre votre profil cible et les molécules de la base de données.</p>
                    <p><strong className="text-foreground">3. Suggestions classées</strong> : Les molécules les plus compatibles sont affichées par ordre décroissant de score (100% = correspondance parfaite).</p>
                    <p><strong className="text-foreground">4. Synergies documentées</strong> : Le panneau "Synergies Documentées" suggère des molécules complémentaires basées sur les interactions moléculaires validées.</p>
                    <p><strong className="text-foreground">5. Export</strong> : Téléchargez vos résultats en CSV ou PDF, ou sauvegardez-les dans votre historique.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
