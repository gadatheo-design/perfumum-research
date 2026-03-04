// @ts-nocheck
import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Target,
  TrendingUp,
  Leaf,
  Beaker,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  RefreshCw,
  Sparkles,
  Link2,
  Trophy,
  Zap,
  Info,
  ChevronRight
} from "lucide-react";

export default function CoverageGoalDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchMolecule, setSearchMolecule] = useState("");
  const [searchPlant, setSearchPlant] = useState("");
  const [selectedMolecule, setSelectedMolecule] = useState<number | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkRole, setLinkRole] = useState<string>("secondaire");
  const [linkPercentage, setLinkPercentage] = useState<string>("");
  const [linkNotes, setLinkNotes] = useState("");

  // Queries
  const { data: coverageStats, isLoading: loadingStats, refetch: refetchStats } = trpc.linkingCoverage.getStats.useQuery();
  const { data: auditStats, isLoading: loadingAudit, refetch: refetchAudit } = trpc.linkingCoverage.getPlantMoleculeAuditStats.useQuery();
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  const { data: allPlants } = trpc.plants.list.useQuery();

  // Mutation pour créer une liaison
  const createLinkMutation = trpc.contributor.createPlantMoleculeLink.useMutation({
    onSuccess: () => {
      toast.success("Liaison créée avec succès !");
      refetchStats();
      refetchAudit();
      setLinkDialogOpen(false);
      setSelectedMolecule(null);
      setSelectedPlant(null);
      setLinkRole("secondaire");
      setLinkPercentage("");
      setLinkNotes("");
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filtrage des molécules orphelines
  const filteredOrphanMolecules = useMemo(() => {
    if (!auditStats?.moleculesWithoutPlantList) return [];
    return auditStats.moleculesWithoutPlantList.filter((m: any) =>
      m.name.toLowerCase().includes(searchMolecule.toLowerCase())
    );
  }, [auditStats?.moleculesWithoutPlantList, searchMolecule]);

  // Filtrage des plantes
  const filteredPlants = useMemo(() => {
    if (!allPlants) return [];
    return allPlants.filter((p: any) =>
      p.name.toLowerCase().includes(searchPlant.toLowerCase()) ||
      (p.latinName && p.latinName.toLowerCase().includes(searchPlant.toLowerCase()))
    ).slice(0, 20);
  }, [allPlants, searchPlant]);

  // Calculer le nombre de liaisons nécessaires pour atteindre 10%
  const linksNeeded = useMemo(() => {
    if (!coverageStats?.plantMolecule) return 0;
    const { totalMolecules, moleculesWithPlant, targetCoverage } = coverageStats.plantMolecule;
    const targetCount = Math.ceil(totalMolecules * targetCoverage / 100);
    return Math.max(0, targetCount - moleculesWithPlant);
  }, [coverageStats]);

  // Progression vers l'objectif
  const progressPercentage = useMemo(() => {
    if (!coverageStats?.plantMolecule) return 0;
    const { coverageMolecules, targetCoverage } = coverageStats.plantMolecule;
    return Math.min(100, (coverageMolecules / targetCoverage) * 100);
  }, [coverageStats]);

  const handleCreateLink = () => {
    if (!selectedMolecule || !selectedPlant || !user) {
      toast.error("Veuillez sélectionner une molécule et une plante");
      return;
    }

    createLinkMutation.mutate({
      plantId: selectedPlant,
      moleculeId: selectedMolecule,
      role: linkRole as "majeur" | "secondaire" | "trace" | "variable",
      percentageTypical: linkPercentage ? parseFloat(linkPercentage) : undefined,
      notes: linkNotes || undefined,
    });
  };

  if (loadingStats || loadingAudit) {
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

  const plantMolecule = coverageStats?.plantMolecule;
  const isGoalReached = plantMolecule && plantMolecule.coverageMolecules >= 10;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Target className="h-5 w-5" />
                <span className="font-medium">Objectif de Couverture</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Molécule → Plante : <span className="text-primary">{plantMolecule?.coverageMolecules || 0}%</span> / 10%
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {isGoalReached 
                  ? "Félicitations ! L'objectif de 10% de couverture est atteint !"
                  : `Il reste ${linksNeeded} liaisons à créer pour atteindre l'objectif de 10%.`
                }
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-4" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{plantMolecule?.moleculesWithPlant || 0} molécules liées</span>
                  <span>Objectif : {Math.ceil((plantMolecule?.totalMolecules || 0) * 0.1)} molécules</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => refetchStats()} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
                <Button asChild className="gap-2">
                  <Link href="/plant-molecule-linking">
                    <Link2 className="h-4 w-4" />
                    Interface de Liaison
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Beaker className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{plantMolecule?.totalMolecules || 0}</p>
                      <p className="text-sm text-muted-foreground">Molécules totales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{plantMolecule?.moleculesWithPlant || 0}</p>
                      <p className="text-sm text-muted-foreground">Avec liaison</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{auditStats?.moleculesWithoutPlant || 0}</p>
                      <p className="text-sm text-muted-foreground">Sans liaison</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Zap className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{linksNeeded}</p>
                      <p className="text-sm text-muted-foreground">Liaisons à créer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Vue d'ensemble</span>
                  </TabsTrigger>
                  <TabsTrigger value="quick-link" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Liaison rapide</span>
                  </TabsTrigger>
                  <TabsTrigger value="orphans" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Molécules orphelines</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {isGoalReached ? (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Trophy className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-600">Objectif atteint !</AlertTitle>
                      <AlertDescription>
                        Vous avez atteint l'objectif de 10% de couverture molécule→plante. 
                        Continuez à enrichir les liaisons pour améliorer la qualité des données.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Progression vers l'objectif</AlertTitle>
                      <AlertDescription>
                        Pour atteindre 10% de couverture, vous devez créer {linksNeeded} liaisons supplémentaires.
                        Utilisez l'onglet "Liaison rapide" pour créer des liaisons facilement.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-500" />
                          Plantes les plus liées
                        </CardTitle>
                        <CardDescription>Top 10 des plantes avec le plus de molécules</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          {auditStats?.topPlantsByMolecules?.map((plant: any, index: number) => (
                            <div key={plant.id} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                                <div>
                                  <p className="font-medium">{plant.name}</p>
                                  {plant.latinName && (
                                    <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary">{plant.moleculeCount} mol.</Badge>
                            </div>
                          ))}
                          {(!auditStats?.topPlantsByMolecules || auditStats.topPlantsByMolecules.length === 0) && (
                            <p className="text-center text-muted-foreground py-8">Aucune donnée disponible</p>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          Actions recommandées
                        </CardTitle>
                        <CardDescription>Étapes pour atteindre l'objectif</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <div>
                              <p className="font-medium">Utiliser l'auto-liaison</p>
                              <p className="text-sm text-muted-foreground">
                                Allez sur le <Link href="/linking-dashboard" className="text-primary hover:underline">tableau de bord des liaisons</Link> pour créer des liaisons automatiquement.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <div>
                              <p className="font-medium">Liaison manuelle rapide</p>
                              <p className="text-sm text-muted-foreground">
                                Utilisez l'onglet "Liaison rapide" ci-dessus pour créer des liaisons une par une.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="p-1.5 rounded-full bg-primary/10">
                              <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <div>
                              <p className="font-medium">Import CSV</p>
                              <p className="text-sm text-muted-foreground">
                                Importez des liaisons en masse via <Link href="/plant-molecule-linking" className="text-primary hover:underline">l'interface de liaison</Link>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="quick-link" className="space-y-6">
                  <Alert>
                    <Plus className="h-4 w-4" />
                    <AlertTitle>Création rapide de liaison</AlertTitle>
                    <AlertDescription>
                      Sélectionnez une molécule orpheline et une plante pour créer une liaison rapidement.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sélection de molécule */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Beaker className="h-5 w-5" />
                          1. Sélectionner une molécule
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Rechercher une molécule orpheline..."
                              value={searchMolecule}
                              onChange={(e) => setSearchMolecule(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <ScrollArea className="h-64 border rounded-md">
                            {filteredOrphanMolecules.map((mol: any) => (
                              <div
                                key={mol.id}
                                onClick={() => setSelectedMolecule(mol.id)}
                                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 border-b last:border-0 ${
                                  selectedMolecule === mol.id ? "bg-primary/10" : ""
                                }`}
                              >
                                <div>
                                  <p className="font-medium">{mol.name}</p>
                                  {mol.family && (
                                    <p className="text-xs text-muted-foreground">{mol.family}</p>
                                  )}
                                </div>
                                {selectedMolecule === mol.id && (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            ))}
                            {filteredOrphanMolecules.length === 0 && (
                              <p className="text-center text-muted-foreground py-8">
                                {searchMolecule ? "Aucun résultat" : "Aucune molécule orpheline"}
                              </p>
                            )}
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sélection de plante */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          2. Sélectionner une plante
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Rechercher une plante..."
                              value={searchPlant}
                              onChange={(e) => setSearchPlant(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <ScrollArea className="h-64 border rounded-md">
                            {filteredPlants.map((plant: any) => (
                              <div
                                key={plant.id}
                                onClick={() => setSelectedPlant(plant.id)}
                                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 border-b last:border-0 ${
                                  selectedPlant === plant.id ? "bg-primary/10" : ""
                                }`}
                              >
                                <div>
                                  <p className="font-medium">{plant.name}</p>
                                  {plant.latinName && (
                                    <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                                  )}
                                </div>
                                {selectedPlant === plant.id && (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            ))}
                            {filteredPlants.length === 0 && (
                              <p className="text-center text-muted-foreground py-8">
                                {searchPlant ? "Aucun résultat" : "Tapez pour rechercher"}
                              </p>
                            )}
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bouton de création */}
                  {selectedMolecule && selectedPlant && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <Badge variant="outline" className="mb-1">Molécule</Badge>
                              <p className="font-medium">
                                {allMolecules?.find((m: any) => m.id === selectedMolecule)?.name || `#${selectedMolecule}`}
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            <div className="text-center">
                              <Badge variant="outline" className="mb-1">Plante</Badge>
                              <p className="font-medium">
                                {allPlants?.find((p: any) => p.id === selectedPlant)?.name || `#${selectedPlant}`}
                              </p>
                            </div>
                          </div>
                          <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="gap-2">
                                <Link2 className="h-4 w-4" />
                                Créer la liaison
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Détails de la liaison</DialogTitle>
                                <DialogDescription>
                                  Ajoutez des informations optionnelles sur cette liaison.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Rôle de la molécule</Label>
                                  <Select value={linkRole} onValueChange={setLinkRole}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="majeur">Majeur (&gt;10%)</SelectItem>
                                      <SelectItem value="secondaire">Secondaire (1-10%)</SelectItem>
                                      <SelectItem value="trace">Trace (&lt;1%)</SelectItem>
                                      <SelectItem value="variable">Variable</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Pourcentage typique (optionnel)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    placeholder="Ex: 5.5"
                                    value={linkPercentage}
                                    onChange={(e) => setLinkPercentage(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Notes (optionnel)</Label>
                                  <Textarea
                                    placeholder="Source, conditions, remarques..."
                                    value={linkNotes}
                                    onChange={(e) => setLinkNotes(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                                  Annuler
                                </Button>
                                <Button 
                                  onClick={handleCreateLink}
                                  disabled={createLinkMutation.isPending || !user}
                                  className="gap-2"
                                >
                                  {createLinkMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                  Créer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        {!user && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>Vous devez être connecté pour créer des liaisons.</AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="orphans" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Molécules sans liaison plante ({auditStats?.moleculesWithoutPlant || 0})
                      </CardTitle>
                      <CardDescription>
                        Ces molécules n'ont aucune liaison avec une plante. Cliquez sur une molécule pour créer une liaison.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Filtrer les molécules..."
                          value={searchMolecule}
                          onChange={(e) => setSearchMolecule(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <ScrollArea className="h-96">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Famille</TableHead>
                              <TableHead>Classe chimique</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrphanMolecules.slice(0, 50).map((mol: any) => (
                              <TableRow key={mol.id}>
                                <TableCell className="font-medium">{mol.name}</TableCell>
                                <TableCell>{mol.family || "-"}</TableCell>
                                <TableCell>
                                  {mol.chemicalClass ? (
                                    <Badge variant="outline">{mol.chemicalClass}</Badge>
                                  ) : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedMolecule(mol.id);
                                      setActiveTab("quick-link");
                                    }}
                                    className="gap-1"
                                  >
                                    Lier
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {filteredOrphanMolecules.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            {searchMolecule ? "Aucun résultat" : "Toutes les molécules sont liées !"}
                          </p>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
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
