import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Flame, ArrowRight, Thermometer, FlaskConical, Plus, Search, BarChart3 } from "lucide-react";
import TransformationChainGraph from "@/components/TransformationChainGraph";

// Transformation type labels and colors
const transformationTypes: Record<string, { label: string; color: string; icon: string }> = {
  pyrolysis: { label: "Pyrolyse", color: "bg-orange-500", icon: "🔥" },
  oxidation: { label: "Oxydation", color: "bg-blue-500", icon: "💨" },
  isomerization: { label: "Isomérisation", color: "bg-purple-500", icon: "🔄" },
  dehydration: { label: "Déshydratation", color: "bg-yellow-500", icon: "💧" },
  cyclization: { label: "Cyclisation", color: "bg-green-500", icon: "⭕" },
  ring_opening: { label: "Ouverture de cycle", color: "bg-red-500", icon: "🔓" },
  polymerization: { label: "Polymérisation", color: "bg-indigo-500", icon: "🔗" },
  degradation: { label: "Dégradation", color: "bg-gray-500", icon: "📉" },
  maillard: { label: "Réaction de Maillard", color: "bg-amber-600", icon: "🍞" },
  caramelization: { label: "Caramélisation", color: "bg-amber-400", icon: "🍯" },
  other: { label: "Autre", color: "bg-slate-500", icon: "❓" },
};

// Relevance context labels
const relevanceContexts: Record<string, string> = {
  tobacco_combustion: "Combustion du tabac",
  tobacco_heating: "Chauffage du tabac",
  incense_burning: "Combustion d'encens",
  essential_oil_distillation: "Distillation d'huiles essentielles",
  perfume_aging: "Vieillissement de parfum",
  food_cooking: "Cuisson alimentaire",
  industrial_process: "Processus industriel",
  natural_degradation: "Dégradation naturelle",
  other: "Autre",
};

export default function MolecularTransformations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transformationType, setTransformationType] = useState("all");
  const [relevanceContext, setRelevanceContext] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form state for new transformation
  const [newTransformation, setNewTransformation] = useState({
    sourceMoleculeName: "",
    productMoleculeName: "",
    transformationType: "pyrolysis" as const,
    temperatureMin: undefined as number | undefined,
    temperatureMax: undefined as number | undefined,
    temperatureOptimal: undefined as number | undefined,
    yieldPercent: undefined as number | undefined,
    olfactoryChangeDescription: "",
    sourceOlfactoryNotes: "",
    productOlfactoryNotes: "",
    relevanceContext: "tobacco_combustion" as const,
    sourceReference: "",
    notes: "",
  });

  // Fetch transformations
  const { data: transformationsData, isLoading, refetch } = trpc.research.getMolecularTransformations.useQuery({
    transformationType: transformationType === "all" ? undefined : transformationType,
    relevanceContext: relevanceContext === "all" ? undefined : relevanceContext,
    sourceMoleculeName: searchTerm || undefined,
    limit: 100,
  });

  // Fetch stats
  const { data: statsData } = trpc.research.getMolecularTransformationStats.useQuery();

  // Fetch type distribution
  const { data: distributionData } = trpc.research.getTransformationTypesDistribution.useQuery();

  // Create mutation
  const createMutation = trpc.research.createMolecularTransformation.useMutation({
    onSuccess: () => {
      setIsAddDialogOpen(false);
      refetch();
      setNewTransformation({
        sourceMoleculeName: "",
        productMoleculeName: "",
        transformationType: "pyrolysis",
        temperatureMin: undefined,
        temperatureMax: undefined,
        temperatureOptimal: undefined,
        yieldPercent: undefined,
        olfactoryChangeDescription: "",
        sourceOlfactoryNotes: "",
        productOlfactoryNotes: "",
        relevanceContext: "tobacco_combustion",
        sourceReference: "",
        notes: "",
      });
    },
  });

  const transformations = transformationsData?.data || [];
  const stats = statsData?.stats;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              Transformations Moléculaires
            </h1>
            <p className="text-muted-foreground mt-1">
              Documentation des transformations par pyrolyse, oxydation et autres processus thermiques
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une transformation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvelle transformation moléculaire</DialogTitle>
                <DialogDescription>
                  Documentez une transformation chimique par pyrolyse ou autre processus
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Molécule source</Label>
                    <Input
                      id="source"
                      placeholder="ex: Limonène"
                      value={newTransformation.sourceMoleculeName}
                      onChange={(e) => setNewTransformation({ ...newTransformation, sourceMoleculeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Molécule produite</Label>
                    <Input
                      id="product"
                      placeholder="ex: p-Cymène"
                      value={newTransformation.productMoleculeName}
                      onChange={(e) => setNewTransformation({ ...newTransformation, productMoleculeName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type de transformation</Label>
                    <Select
                      value={newTransformation.transformationType}
                      onValueChange={(v) => setNewTransformation({ ...newTransformation, transformationType: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(transformationTypes).map(([key, { label, icon }]) => (
                          <SelectItem key={key} value={key}>
                            {icon} {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Contexte d'application</Label>
                    <Select
                      value={newTransformation.relevanceContext}
                      onValueChange={(v) => setNewTransformation({ ...newTransformation, relevanceContext: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(relevanceContexts).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempMin">Temp. min (°C)</Label>
                    <Input
                      id="tempMin"
                      type="number"
                      placeholder="200"
                      value={newTransformation.temperatureMin || ""}
                      onChange={(e) => setNewTransformation({ ...newTransformation, temperatureMin: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempMax">Temp. max (°C)</Label>
                    <Input
                      id="tempMax"
                      type="number"
                      placeholder="400"
                      value={newTransformation.temperatureMax || ""}
                      onChange={(e) => setNewTransformation({ ...newTransformation, temperatureMax: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempOpt">Temp. optimale (°C)</Label>
                    <Input
                      id="tempOpt"
                      type="number"
                      placeholder="300"
                      value={newTransformation.temperatureOptimal || ""}
                      onChange={(e) => setNewTransformation({ ...newTransformation, temperatureOptimal: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceOlfactory">Notes olfactives (source)</Label>
                    <Input
                      id="sourceOlfactory"
                      placeholder="ex: Agrumes, citron"
                      value={newTransformation.sourceOlfactoryNotes}
                      onChange={(e) => setNewTransformation({ ...newTransformation, sourceOlfactoryNotes: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productOlfactory">Notes olfactives (produit)</Label>
                    <Input
                      id="productOlfactory"
                      placeholder="ex: Épicé, cumin"
                      value={newTransformation.productOlfactoryNotes}
                      onChange={(e) => setNewTransformation({ ...newTransformation, productOlfactoryNotes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="olfactoryChange">Description du changement olfactif</Label>
                  <Textarea
                    id="olfactoryChange"
                    placeholder="Décrivez comment l'odeur change pendant la transformation..."
                    value={newTransformation.olfactoryChangeDescription}
                    onChange={(e) => setNewTransformation({ ...newTransformation, olfactoryChangeDescription: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence scientifique</Label>
                  <Input
                    id="reference"
                    placeholder="DOI, article, livre..."
                    value={newTransformation.sourceReference}
                    onChange={(e) => setNewTransformation({ ...newTransformation, sourceReference: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes additionnelles</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations complémentaires..."
                    value={newTransformation.notes}
                    onChange={(e) => setNewTransformation({ ...newTransformation, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={() => createMutation.mutate(newTransformation)}
                  disabled={!newTransformation.sourceMoleculeName || !newTransformation.productMoleculeName || createMutation.isPending}
                >
                  {createMutation.isPending ? "Création..." : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transformations</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_transformations || 0}</div>
              <p className="text-xs text-muted-foreground">documentées</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Molécules sources</CardTitle>
              <FlaskConical className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.unique_sources || 0}</div>
              <p className="text-xs text-muted-foreground">uniques</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <ArrowRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.unique_products || 0}</div>
              <p className="text-xs text-muted-foreground">molécules formées</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Types</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.transformation_types || 0}</div>
              <p className="text-xs text-muted-foreground">de réactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste des transformations</TabsTrigger>
            <TabsTrigger value="graph">Graphe des transformations</TabsTrigger>
            <TabsTrigger value="impacts">Impacts Recettes</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une molécule..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={transformationType} onValueChange={setTransformationType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Type de transformation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.entries(transformationTypes).map(([key, { label, icon }]) => (
                        <SelectItem key={key} value={key}>
                          {icon} {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={relevanceContext} onValueChange={setRelevanceContext}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Contexte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les contextes</SelectItem>
                      {Object.entries(relevanceContexts).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Transformations List */}
            {isLoading ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  Chargement des transformations...
                </CardContent>
              </Card>
            ) : transformations.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Flame className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">Aucune transformation trouvée</h3>
                  <p className="text-muted-foreground mt-2">
                    Commencez par ajouter des transformations moléculaires par pyrolyse
                  </p>
                  <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une transformation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transformations.map((t: any) => {
                  const typeInfo = transformationTypes[t.transformation_type] || transformationTypes.other;
                  return (
                    <Card key={t.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge className={`${typeInfo.color} text-white`}>
                            {typeInfo.icon} {typeInfo.label}
                          </Badge>
                          {t.temperature_optimal && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Thermometer className="h-3 w-3" />
                              {t.temperature_optimal}°C
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-lg font-medium">
                          <span className="text-blue-600">{t.source_molecule_name}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-green-600">{t.product_molecule_name}</span>
                        </div>
                        {(t.source_olfactory_notes || t.product_olfactory_notes) && (
                          <div className="mt-3 text-sm">
                            {t.source_olfactory_notes && (
                              <p className="text-muted-foreground">
                                <span className="font-medium">Source:</span> {t.source_olfactory_notes}
                              </p>
                            )}
                            {t.product_olfactory_notes && (
                              <p className="text-muted-foreground">
                                <span className="font-medium">Produit:</span> {t.product_olfactory_notes}
                              </p>
                            )}
                          </div>
                        )}
                        {t.olfactory_change_description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {t.olfactory_change_description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {relevanceContexts[t.relevance_context] || t.relevance_context}
                          </Badge>
                          {t.yield_percent && (
                            <Badge variant="secondary" className="text-xs">
                              Rendement: {t.yield_percent}%
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="graph">
            <TransformationChainGraph />
          </TabsContent>

          <TabsContent value="impacts">
            <TransformationImpactsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}


// Composant pour l'onglet Impacts Recettes
function TransformationImpactsTab() {
  const { data: impactsData, isLoading: impactsLoading } = trpc.research.getTransformationRecipeImpacts.useQuery({});
  const { data: statsData, isLoading: statsLoading } = trpc.research.getTransformationImpactStats.useQuery();

  const impacts = impactsData?.impacts || [];
  const stats = statsData?.stats;

  const impactTypeColors: Record<string, string> = {
    major: "bg-red-500",
    moderate: "bg-orange-500",
    minor: "bg-yellow-500",
    trace: "bg-gray-400",
  };

  const impactTypeLabels: Record<string, string> = {
    major: "Majeur",
    moderate: "Modéré",
    minor: "Mineur",
    trace: "Trace",
  };

  if (impactsLoading || statsLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement des impacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Impacts Majeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {stats.impactCounts?.find((c: any) => c.impact_type === 'major')?.count || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Impacts Modérés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {stats.impactCounts?.find((c: any) => c.impact_type === 'moderate')?.count || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Impacts Mineurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {stats.impactCounts?.find((c: any) => c.impact_type === 'minor')?.count || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Liaisons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impacts.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Transformations */}
      {stats?.topTransformations && stats.topTransformations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transformations les plus impactantes</CardTitle>
            <CardDescription>Transformations affectant le plus de recettes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topTransformations.slice(0, 5).map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">🔥</span>
                    <div>
                      <span className="font-medium">{t.source_molecule_name}</span>
                      <ArrowRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
                      <span className="font-medium">{t.product_molecule_name}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{t.recipe_count} recettes</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Recipes */}
      {stats?.topRecipes && stats.topRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recettes les plus affectées</CardTitle>
            <CardDescription>Recettes avec le plus de transformations associées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topRecipes.slice(0, 5).map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span>📜</span>
                    <div>
                      <span className="font-medium">{r.name}</span>
                      <Badge variant="outline" className="ml-2">{r.category}</Badge>
                    </div>
                  </div>
                  <Badge variant="secondary">{r.transformation_count} transformations</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Impacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tous les impacts</CardTitle>
          <CardDescription>Liste complète des liaisons transformations-recettes</CardDescription>
        </CardHeader>
        <CardContent>
          {impacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Flame className="mx-auto h-12 w-12 text-orange-500/30" />
              <p className="mt-4">Aucun impact documenté pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {impacts.map((impact: any) => (
                <div key={impact.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={impactTypeColors[impact.impact_type]}>
                        {impactTypeLabels[impact.impact_type]}
                      </Badge>
                      <span className="font-medium">{impact.source_molecule_name}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{impact.product_molecule_name}</span>
                    </div>
                    <Badge variant="outline">{impact.transformation_type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📜</span>
                    <span className="font-medium">{impact.recette_name}</span>
                    <Badge variant="secondary" className="text-xs">{impact.recette_category}</Badge>
                  </div>
                  {impact.impact_description && (
                    <p className="text-sm text-muted-foreground">{impact.impact_description}</p>
                  )}
                  {impact.olfactory_contribution && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Contribution olfactive : </span>
                      <span className="italic">{impact.olfactory_contribution}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
