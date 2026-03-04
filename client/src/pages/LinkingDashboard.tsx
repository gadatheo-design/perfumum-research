// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Target,
  TrendingUp,
  Beaker,
  Leaf,
  MapPin,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Play,
  Eye,
  RefreshCw
} from "lucide-react";

export default function LinkingDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [maxLinks, setMaxLinks] = useState(50);
  const [showPreview, setShowPreview] = useState(false);

  // Queries
  const { data: coverageStats, isLoading: loadingStats, refetch: refetchStats } = trpc.linkingCoverage.getStats.useQuery();
  
  const { data: previewData, isLoading: loadingPreview, refetch: refetchPreview } = trpc.linkingCoverage.previewAutoLink.useQuery(
    { maxLinks },
    { enabled: showPreview && activeTab === "autolink" }
  );

  const { data: plantMoleculePreview, isLoading: loadingPlantPreview, refetch: refetchPlantPreview } = trpc.linkingCoverage.previewPlantMoleculeAutoLink.useQuery(
    { maxLinks },
    { enabled: showPreview && activeTab === "autolink-plant" }
  );

  // Mutation pour exécuter l'auto-link molécule-recette
  const executeAutoLink = trpc.linkingCoverage.executeAutoLink.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.created} liaisons créées avec succès !`);
        refetchStats();
        setShowPreview(false);
      } else {
        toast.error("Erreur lors de la création des liaisons");
      }
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour exécuter l'auto-link plante-molécule
  const executePlantMoleculeAutoLink = trpc.linkingCoverage.executePlantMoleculeAutoLink.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.created} liaisons plante-molécule créées avec succès !`);
        refetchStats();
        setShowPreview(false);
      } else {
        toast.error("Erreur lors de la création des liaisons");
      }
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handlePreview = () => {
    setShowPreview(true);
    if (activeTab === "autolink") {
      refetchPreview();
    } else if (activeTab === "autolink-plant") {
      refetchPlantPreview();
    }
  };

  const handleExecute = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour effectuer cette action");
      return;
    }
    if (activeTab === "autolink") {
      executeAutoLink.mutate({ maxLinks });
    } else if (activeTab === "autolink-plant") {
      executePlantMoleculeAutoLink.mutate({ maxLinks });
    }
  };

  if (loadingStats) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Chargement des statistiques...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const moleculeRecette = coverageStats?.moleculeRecette;
  const plantMolecule = coverageStats?.plantMolecule;
  const plantTerroir = coverageStats?.plantTerroir;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Tableau de Bord des Liaisons</h1>
                  <p className="text-muted-foreground">
                    Suivez la couverture des liaisons et atteignez vos objectifs
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetchStats()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Vue d'ensemble</span>
                  </TabsTrigger>
                  <TabsTrigger value="autolink" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Mol→Rec</span>
                  </TabsTrigger>
                  <TabsTrigger value="autolink-plant" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span className="hidden sm:inline">Plante→Mol</span>
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    <span className="hidden sm:inline">Outils</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className={moleculeRecette && moleculeRecette.coverageMolecules >= 50 ? "border-green-500/50" : "border-amber-500/50"}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Beaker className="h-4 w-4" />
                            Molécule → Recette
                          </CardTitle>
                          {moleculeRecette && moleculeRecette.coverageMolecules >= 50 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{moleculeRecette?.coverageMolecules || 0}%</span>
                          <span className="text-sm text-muted-foreground mb-1">/ {moleculeRecette?.targetCoverage}%</span>
                        </div>
                        <Progress value={moleculeRecette?.coverageMolecules || 0} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{moleculeRecette?.moleculesWithRecette}/{moleculeRecette?.totalMolecules} mol.</span>
                          <span>{moleculeRecette?.totalLinks} liaisons</span>
                        </div>
                        {moleculeRecette && moleculeRecette.gap > 0 && (
                          <Badge variant="outline" className="mt-2 text-amber-600">-{moleculeRecette.gap}%</Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card className={plantMolecule && plantMolecule.coverageMolecules >= 10 ? "border-green-500/50" : "border-amber-500/50"}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Molécule → Plante
                          </CardTitle>
                          {plantMolecule && plantMolecule.coverageMolecules >= 10 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{plantMolecule?.coverageMolecules || 0}%</span>
                          <span className="text-sm text-muted-foreground mb-1">/ {plantMolecule?.targetCoverage}%</span>
                        </div>
                        <Progress value={(plantMolecule?.coverageMolecules || 0) * 10} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{plantMolecule?.moleculesWithPlant}/{plantMolecule?.totalMolecules} mol.</span>
                          <span>{plantMolecule?.totalLinks} liaisons</span>
                        </div>
                        {plantMolecule && plantMolecule.gap > 0 && (
                          <Badge variant="outline" className="mt-2 text-amber-600">-{plantMolecule.gap}%</Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card className={plantTerroir && plantTerroir.coveragePlants >= 20 ? "border-green-500/50" : "border-amber-500/50"}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Plante → Terroir
                          </CardTitle>
                          {plantTerroir && plantTerroir.coveragePlants >= 20 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{plantTerroir?.coveragePlants || 0}%</span>
                          <span className="text-sm text-muted-foreground mb-1">/ {plantTerroir?.targetCoverage}%</span>
                        </div>
                        <Progress value={(plantTerroir?.coveragePlants || 0) * 5} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{plantTerroir?.plantsWithTerroir}/{plantTerroir?.totalPlants} plantes</span>
                          <span>{plantTerroir?.totalLinks} liaisons</span>
                        </div>
                        {plantTerroir && plantTerroir.coveragePlants >= 20 ? (
                          <Badge variant="outline" className="mt-2 text-green-600">✓ Atteint</Badge>
                        ) : (
                          <Badge variant="outline" className="mt-2 text-amber-600">-{plantTerroir?.gap || 0}%</Badge>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Objectifs de Couverture</CardTitle>
                      <CardDescription>Progression vers les objectifs définis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Beaker className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Molécule → Recette : 50%</p>
                              <p className="text-sm text-muted-foreground">Actuellement : {moleculeRecette?.coverageMolecules}%</p>
                            </div>
                          </div>
                          {moleculeRecette && moleculeRecette.coverageMolecules >= 50 ? (
                            <Badge className="bg-green-500">Atteint</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600">En cours</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Leaf className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Molécule → Plante : 10%</p>
                              <p className="text-sm text-muted-foreground">Actuellement : {plantMolecule?.coverageMolecules}%</p>
                            </div>
                          </div>
                          {plantMolecule && plantMolecule.coverageMolecules >= 10 ? (
                            <Badge className="bg-green-500">Atteint</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600">En cours</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Plante → Terroir : 20%</p>
                              <p className="text-sm text-muted-foreground">Actuellement : {plantTerroir?.coveragePlants}%</p>
                            </div>
                          </div>
                          {plantTerroir && plantTerroir.coveragePlants >= 20 ? (
                            <Badge className="bg-green-500">Atteint ✓</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600">En cours</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="autolink" className="space-y-6">
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Auto-Liaison Molécule → Recette</AlertTitle>
                    <AlertDescription>
                      Analyse automatique des molécules et recettes pour créer des liaisons pertinentes basées sur les familles chimiques, profils olfactifs et mots-clés communs.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration</CardTitle>
                      <CardDescription>Définissez le nombre maximum de liaisons à créer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre de liaisons : {maxLinks}</label>
                        <Slider value={[maxLinks]} onValueChange={(v) => setMaxLinks(v[0])} min={10} max={200} step={10} className="w-full" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>10</span><span>200</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handlePreview} disabled={loadingPreview} className="gap-2">
                          {loadingPreview ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                          Prévisualiser
                        </Button>
                        <Button onClick={handleExecute} disabled={executeAutoLink.isPending || !user} className="gap-2">
                          {executeAutoLink.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                          Exécuter
                        </Button>
                      </div>
                      {!user && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>Vous devez être connecté pour exécuter l'auto-liaison.</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {showPreview && previewData && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Prévisualisation ({previewData.wouldCreate || previewData.suggestions?.length || 0} liaisons)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Molécule</TableHead>
                                <TableHead>Recette</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Confiance</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {previewData.suggestions?.slice(0, 50).map((s: any, i: number) => (
                                <TableRow key={i}>
                                  <TableCell className="font-medium">{s.moleculeName}</TableCell>
                                  <TableCell>{s.recetteName}</TableCell>
                                  <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                                  <TableCell>
                                    <Badge className={s.confidence >= 0.8 ? "bg-green-500" : s.confidence >= 0.6 ? "bg-amber-500" : "bg-gray-500"}>
                                      {Math.round(s.confidence * 100)}%
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="autolink-plant" className="space-y-6">
                  <Alert>
                    <Leaf className="h-4 w-4" />
                    <AlertTitle>Auto-Liaison Plante → Molécule</AlertTitle>
                    <AlertDescription>
                      Analyse automatique des plantes et molécules pour créer des liaisons pertinentes basées sur les familles botaniques et sources botaniques.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration</CardTitle>
                      <CardDescription>Définissez le nombre maximum de liaisons à créer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre de liaisons : {maxLinks}</label>
                        <Slider value={[maxLinks]} onValueChange={(v) => setMaxLinks(v[0])} min={10} max={200} step={10} className="w-full" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>10</span><span>200</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handlePreview} disabled={loadingPlantPreview} className="gap-2">
                          {loadingPlantPreview ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                          Prévisualiser
                        </Button>
                        <Button onClick={handleExecute} disabled={executePlantMoleculeAutoLink.isPending || !user} className="gap-2">
                          {executePlantMoleculeAutoLink.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                          Exécuter
                        </Button>
                      </div>
                      {!user && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>Vous devez être connecté pour exécuter l'auto-liaison.</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {showPreview && plantMoleculePreview && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Prévisualisation ({plantMoleculePreview.wouldCreate || plantMoleculePreview.suggestions?.length || 0} liaisons)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Plante</TableHead>
                                <TableHead>Molécule</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>%</TableHead>
                                <TableHead>Confiance</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {plantMoleculePreview.suggestions?.slice(0, 50).map((s: any, i: number) => (
                                <TableRow key={i}>
                                  <TableCell className="font-medium">{s.plantName}</TableCell>
                                  <TableCell>{s.moleculeName}</TableCell>
                                  <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                                  <TableCell>{s.percentageTypical}%</TableCell>
                                  <TableCell>
                                    <Badge className={s.confidence >= 0.8 ? "bg-green-500" : s.confidence >= 0.6 ? "bg-amber-500" : "bg-gray-500"}>
                                      {Math.round(s.confidence * 100)}%
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="tools" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Beaker className="h-5 w-5" />Molécule ↔ Recette</CardTitle>
                        <CardDescription>Outils pour gérer les liaisons molécule-recette</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Link href="/molecule-recette-audit"><Button variant="outline" className="w-full justify-between">Audit des liaisons<ArrowRight className="h-4 w-4" /></Button></Link>
                        <Link href="/molecule-recette-dragdrop"><Button variant="outline" className="w-full justify-between">Création en masse<ArrowRight className="h-4 w-4" /></Button></Link>
                        <Link href="/molecule-recette-import-csv"><Button variant="outline" className="w-full justify-between">Import CSV<ArrowRight className="h-4 w-4" /></Button></Link>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5" />Plante ↔ Molécule</CardTitle>
                        <CardDescription>Outils pour gérer les liaisons plante-molécule</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Link href="/plant-molecule-linking"><Button variant="outline" className="w-full justify-between">Interface de liaison<ArrowRight className="h-4 w-4" /></Button></Link>
                        <Link href="/plant-molecule-audit"><Button variant="outline" className="w-full justify-between">Audit des liaisons<ArrowRight className="h-4 w-4" /></Button></Link>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Plante ↔ Terroir</CardTitle>
                        <CardDescription>Outils pour gérer les liaisons plante-terroir</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Link href="/plant-terroir-audit"><Button variant="outline" className="w-full justify-between">Audit des liaisons<ArrowRight className="h-4 w-4" /></Button></Link>
                        <Link href="/plant-terroir-dragdrop"><Button variant="outline" className="w-full justify-between">Création en masse<ArrowRight className="h-4 w-4" /></Button></Link>
                        <Link href="/plant-terroir-import-csv"><Button variant="outline" className="w-full justify-between">Import CSV<ArrowRight className="h-4 w-4" /></Button></Link>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Contribution</CardTitle>
                        <CardDescription>Ajouter de nouvelles données</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Link href="/contributor"><Button variant="outline" className="w-full justify-between">Interface Contributeur<ArrowRight className="h-4 w-4" /></Button></Link>
                        <Link href="/admin/import-csv"><Button variant="outline" className="w-full justify-between">Import CSV Global<ArrowRight className="h-4 w-4" /></Button></Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
