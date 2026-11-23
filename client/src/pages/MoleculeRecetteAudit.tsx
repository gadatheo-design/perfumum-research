import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Search, 
  ArrowLeft,
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Beaker,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Loader2,
  Filter,
  ChevronRight
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MoleculeRecetteAudit() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchMolecule, setSearchMolecule] = useState("");
  const [searchRecette, setSearchRecette] = useState("");
  const [familyFilter, setFamilyFilter] = useState<string>("all");

  // Queries
  const { data: auditStats, isLoading: loadingStats } = trpc.molecules.getRecetteAuditStats.useQuery();
  const { data: allRelations } = trpc.molecules.getAllRecetteRelationsWithNames.useQuery();
  const { data: suggestions } = trpc.molecules.getRecetteSuggestions.useQuery();

  // Filtrer les molécules sans recette
  const filteredMoleculesWithoutRecette = useMemo(() => {
    if (!auditStats?.moleculesWithoutRecetteList) return [];
    return auditStats?.moleculesWithoutRecetteList.filter((m: any) => {
      const matchSearch = m.name.toLowerCase().includes(searchMolecule.toLowerCase());
      const matchFamily = familyFilter === "all" || m.family?.toLowerCase().includes(familyFilter.toLowerCase());
      return matchSearch && matchFamily;
    });
  }, [auditStats?.moleculesWithoutRecetteList, searchMolecule, familyFilter]);

  // Filtrer les recettes sans molécule
  const filteredRecettesWithoutMolecule = useMemo(() => {
    if (!auditStats?.recettesWithoutMoleculeList) return [];
    return auditStats?.recettesWithoutMoleculeList.filter((r: any) =>
      r.name.toLowerCase().includes(searchRecette.toLowerCase())
    );
  }, [auditStats?.recettesWithoutMoleculeList, searchRecette]);

  // Familles uniques pour le filtre
  const uniqueFamilies = useMemo(() => {
    if (!auditStats?.moleculesWithoutRecetteList) return [];
    const families = new Set(
      auditStats?.moleculesWithoutRecetteList
        .map((m: any) => m.family)
        .filter(Boolean)
    );
    return Array.from(families).sort();
  }, [auditStats?.moleculesWithoutRecetteList]);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/molecule-recette-linking">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Liaisons
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <BarChart3 className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Audit Molécule ↔ Recette</h1>
                  <p className="text-muted-foreground">
                    Analysez la couverture des liaisons et identifiez les priorités
                  </p>
                </div>
              </div>

              {/* Liens vers les outils */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/molecule-recette-dragdrop">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Target className="h-4 w-4" />
                    Création en masse (Drag & Drop)
                  </Button>
                </Link>
                <Link href="/molecule-recette-import-csv">
                  <Button variant="outline" size="sm" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Import CSV
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="molecules" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Molécules orphelines
                  </TabsTrigger>
                  <TabsTrigger value="recettes" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recettes orphelines
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Suggestions
                  </TabsTrigger>
                </TabsList>

                {/* Tab Vue d'ensemble */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Couverture Molécules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{auditStats?.coverageMolecules || 0}%</span>
                          <span className="text-sm text-muted-foreground mb-1">
                            ({auditStats?.moleculesWithRecette || 0}/{auditStats?.totalMolecules || 0})
                          </span>
                        </div>
                        <Progress value={auditStats?.coverageMolecules || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Objectif : 50% de couverture
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Couverture Recettes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{auditStats?.coverageRecettes || 0}%</span>
                          <span className="text-sm text-muted-foreground mb-1">
                            ({auditStats?.recettesWithMolecule || 0}/{auditStats?.totalRecettes || 0})
                          </span>
                        </div>
                        <Progress value={auditStats?.coverageRecettes || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recettes avec au moins une molécule
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Liaisons
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold">{auditStats?.totalRelations || 0}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                            {auditStats?.moleculesWithoutRecette || 0} molécules orphelines
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top molécules et recettes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Top Molécules (par recettes)</CardTitle>
                        <CardDescription>Molécules les plus utilisées dans les recettes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {auditStats?.topMoleculesByRecettes?.slice(0, 5).map((m: any) => (
                            <div key={m.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Beaker className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{m.name}</span>
                              </div>
                              <Badge variant="secondary">{m.recetteCount} recettes</Badge>
                            </div>
                          ))}
                          {(!auditStats?.topMoleculesByRecettes || auditStats?.topMoleculesByRecettes.length === 0) && (
                            <p className="text-muted-foreground text-sm">Aucune donnée</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Top Recettes (par molécules)</CardTitle>
                        <CardDescription>Recettes avec le plus de molécules</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {auditStats?.topRecettesByMolecules?.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{r.name}</span>
                              </div>
                              <Badge variant="secondary">{r.moleculeCount} molécules</Badge>
                            </div>
                          ))}
                          {(!auditStats?.topRecettesByMolecules || auditStats?.topRecettesByMolecules.length === 0) && (
                            <p className="text-muted-foreground text-sm">Aucune donnée</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Priorités */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-amber-500" />
                        Priorités d'action
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Beaker className="h-4 w-4" />
                            Molécules prioritaires à lier
                          </h4>
                          <div className="space-y-2">
                            {auditStats?.priorityMoleculesWithoutRecette?.slice(0, 5).map((m: any) => (
                              <div key={m.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">{m.name}</span>
                                <Badge variant="outline" className="text-xs">{m.family}</Badge>
                              </div>
                            ))}
                            {(!auditStats?.priorityMoleculesWithoutRecette || auditStats?.priorityMoleculesWithoutRecette.length === 0) && (
                              <p className="text-muted-foreground text-sm">Aucune priorité identifiée</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Recettes prioritaires à compléter
                          </h4>
                          <div className="space-y-2">
                            {auditStats?.priorityRecettesWithoutMolecule?.slice(0, 5).map((r: any) => (
                              <div key={r.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <span className="text-sm">{r.name}</span>
                                <Badge variant="outline" className="text-xs">{r.category}</Badge>
                              </div>
                            ))}
                            {(!auditStats?.priorityRecettesWithoutMolecule || auditStats?.priorityRecettesWithoutMolecule.length === 0) && (
                              <p className="text-muted-foreground text-sm">Aucune priorité identifiée</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Molécules orphelines */}
                <TabsContent value="molecules" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Molécules sans recette ({auditStats?.moleculesWithoutRecette || 0})
                      </CardTitle>
                      <CardDescription>
                        Ces molécules ne sont liées à aucune recette
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Rechercher une molécule..."
                            value={searchMolecule}
                            onChange={(e) => setSearchMolecule(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <select
                          value={familyFilter}
                          onChange={(e) => setFamilyFilter(e.target.value)}
                          className="px-3 py-2 border rounded-md bg-background"
                        >
                          <option value="all">Toutes les familles</option>
                          {uniqueFamilies.map((f) => (
                            <option key={f as string} value={f as string}>{f as string}</option>
                          ))}
                        </select>
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Molécule</TableHead>
                              <TableHead>Famille</TableHead>
                              <TableHead>CAS</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMoleculesWithoutRecette.slice(0, 20).map((m: any) => (
                              <TableRow key={m.id}>
                                <TableCell className="font-medium">{m.name}</TableCell>
                                <TableCell>
                                  {m.family && <Badge variant="outline">{m.family}</Badge>}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                  {m.casNumber || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link href={`/molecule/${m.id}`}>
                                    <Button variant="ghost" size="sm">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                            {filteredMoleculesWithoutRecette.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                  Aucune molécule orpheline trouvée
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      {filteredMoleculesWithoutRecette.length > 20 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Affichage des 20 premiers résultats sur {filteredMoleculesWithoutRecette.length}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Recettes orphelines */}
                <TabsContent value="recettes" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Recettes sans molécule ({auditStats?.recettesWithoutMolecule || 0})
                      </CardTitle>
                      <CardDescription>
                        Ces recettes n'ont aucune molécule associée
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher une recette..."
                          value={searchRecette}
                          onChange={(e) => setSearchRecette(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Recette</TableHead>
                              <TableHead>Catégorie</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRecettesWithoutMolecule.slice(0, 20).map((r: any) => (
                              <TableRow key={r.id}>
                                <TableCell className="font-medium">{r.name}</TableCell>
                                <TableCell>
                                  {r.category && <Badge variant="outline">{r.category}</Badge>}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                  {r.description || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link href={`/recette/${r.id}`}>
                                    <Button variant="ghost" size="sm">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                            {filteredRecettesWithoutMolecule.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                  Aucune recette orpheline trouvée
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      {filteredRecettesWithoutMolecule.length > 20 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Affichage des 20 premiers résultats sur {filteredRecettesWithoutMolecule.length}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Suggestions */}
                <TabsContent value="suggestions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Suggestions de liaisons ({suggestions?.length || 0})
                      </CardTitle>
                      <CardDescription>
                        Liaisons suggérées basées sur les familles olfactives et catégories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {suggestions && suggestions?.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Molécule</TableHead>
                                <TableHead>Recette</TableHead>
                                <TableHead>Raison</TableHead>
                                <TableHead>Confiance</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {suggestions?.slice(0, 30).map((s: any, i: number) => (
                                <TableRow key={i}>
                                  <TableCell className="font-medium">{s.moleculeName}</TableCell>
                                  <TableCell>{s.recetteName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                                    {s.reason}
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={s.confidence === 'high' ? 'default' : s.confidence === 'medium' ? 'secondary' : 'outline'}
                                    >
                                      {s.confidence === 'high' ? 'Haute' : s.confidence === 'medium' ? 'Moyenne' : 'Basse'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <Alert>
                          <AlertDescription>
                            Aucune suggestion disponible. Les suggestions sont générées en fonction des familles de molécules et des catégories de recettes.
                          </AlertDescription>
                        </Alert>
                      )}
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
