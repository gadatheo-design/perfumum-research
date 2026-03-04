// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Database, 
  Trash2, 
  Sparkles, 
  Link2, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export default function DataQuality() {
  const [isExecutingMerge, setIsExecutingMerge] = useState(false);
  const [isExecutingEnrich, setIsExecutingEnrich] = useState(false);
  
  // Queries
  const { data: duplicates, isLoading: loadingDuplicates, refetch: refetchDuplicates } = 
    trpc.dataCleanup.analyzeDuplicates.useQuery();
  const { data: enrichPreview, isLoading: loadingEnrich, refetch: refetchEnrich } = 
    trpc.dataCleanup.previewEnrichFormulas.useQuery();
  const { data: linkAnalysis, isLoading: loadingLinks, refetch: refetchLinks } = 
    trpc.dataCleanup.analyzeLinkCoverage.useQuery();
  const { data: moleculesWithoutRecettes } = 
    trpc.dataCleanup.getMoleculesWithoutRecettes.useQuery({ limit: 10 });
  const { data: moleculesWithoutPlants } = 
    trpc.dataCleanup.getMoleculesWithoutPlants.useQuery({ limit: 10 });
  const { data: plantsWithoutMolecules } = 
    trpc.dataCleanup.getPlantsWithoutMolecules.useQuery({ limit: 10 });
  
  // Mutations
  const mergeMutation = trpc.dataCleanup.executeMergeDuplicates.useMutation({
    onSuccess: (data) => {
      toast.success(`Fusion terminée: ${data.merged?.length || 0} groupes traités`);
      refetchDuplicates();
      refetchLinks();
      setIsExecutingMerge(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsExecutingMerge(false);
    }
  });
  
  const enrichMutation = trpc.dataCleanup.executeEnrichFormulas.useMutation({
    onSuccess: (data) => {
      toast.success(`Enrichissement terminé: ${data.updated?.length || 0} molécules enrichies`);
      refetchEnrich();
      setIsExecutingEnrich(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsExecutingEnrich(false);
    }
  });
  
  const handleMergeDuplicates = () => {
    setIsExecutingMerge(true);
    mergeMutation.mutate({});
  };
  
  const handleEnrichFormulas = () => {
    setIsExecutingEnrich(true);
    enrichMutation.mutate({});
  };
  
  const refreshAll = () => {
    refetchDuplicates();
    refetchEnrich();
    refetchLinks();
    toast.info("Données actualisées");
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Qualité des Données</h1>
          <p className="text-muted-foreground mt-1">
            Nettoyage, enrichissement et analyse des liaisons
          </p>
        </div>
        <Button variant="outline" onClick={refreshAll}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Molécules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.molecules || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recettes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.recettes || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.plants || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terroirs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.terroirs || "..."}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="duplicates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="duplicates" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Doublons
          </TabsTrigger>
          <TabsTrigger value="enrich" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Enrichissement
          </TabsTrigger>
          <TabsTrigger value="links" className="gap-2">
            <Link2 className="h-4 w-4" />
            Liaisons
          </TabsTrigger>
        </TabsList>
        
        {/* Doublons Tab */}
        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Analyse des Doublons
              </CardTitle>
              <CardDescription>
                Identification et fusion des molécules dupliquées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingDuplicates ? (
                <div className="text-muted-foreground">Chargement...</div>
              ) : duplicates && !("error" in duplicates) ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Total molécules</div>
                      <div className="text-2xl font-bold">{duplicates.totalMolecules}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Groupes de doublons</div>
                      <div className="text-2xl font-bold">{duplicates.duplicateGroups}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Total doublons</div>
                      <div className="text-2xl font-bold">{duplicates.totalDuplicates}</div>
                    </div>
                  </div>
                  
                  {duplicates.duplicates && duplicates.duplicates.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Doublons détectés</h4>
                      <div className="max-h-60 overflow-y-auto space-y-1">
                        {duplicates.duplicates.slice(0, 20).map((dup: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="font-medium">{dup.name}</span>
                            <Badge variant="secondary">{dup.count} occurrences</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleMergeDuplicates} 
                    disabled={isExecutingMerge || duplicates.duplicateGroups === 0}
                    className="w-full"
                  >
                    {isExecutingMerge ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Fusion en cours...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Fusionner les doublons
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les données</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Enrichissement Tab */}
        <TabsContent value="enrich" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Enrichissement des Formules
              </CardTitle>
              <CardDescription>
                Ajout automatique des formules chimiques et SMILES
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingEnrich ? (
                <div className="text-muted-foreground">Chargement...</div>
              ) : enrichPreview && !("error" in enrichPreview) ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Sans formule</div>
                      <div className="text-2xl font-bold">{enrichPreview.totalWithoutFormula}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Enrichissables</div>
                      <div className="text-2xl font-bold text-green-600">{enrichPreview.updated?.length || 0}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Non trouvées</div>
                      <div className="text-2xl font-bold text-orange-600">{enrichPreview.notFound?.length || 0}</div>
                    </div>
                  </div>
                  
                  {enrichPreview.updated && enrichPreview.updated.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Molécules à enrichir</h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {enrichPreview.updated.slice(0, 10).map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-green-500/10 rounded text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleEnrichFormulas} 
                    disabled={isExecutingEnrich || (enrichPreview.updated?.length || 0) === 0}
                    className="w-full"
                  >
                    {isExecutingEnrich ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Enrichissement en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enrichir les molécules
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les données</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Liaisons Tab */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Analyse des Liaisons
              </CardTitle>
              <CardDescription>
                Couverture des connexions entre entités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingLinks ? (
                <div className="text-muted-foreground">Chargement...</div>
              ) : linkAnalysis ? (
                <>
                  {/* Coverage Progress */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Molécules → Recettes</span>
                        <span className="font-medium">{linkAnalysis.coverage?.moleculesWithRecettesPercent}%</span>
                      </div>
                      <Progress value={linkAnalysis.coverage?.moleculesWithRecettesPercent || 0} />
                      <div className="text-xs text-muted-foreground">
                        {linkAnalysis.coverage?.moleculesWithRecettes} / {linkAnalysis.entities?.molecules} molécules liées
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Molécules → Plantes</span>
                        <span className="font-medium">{linkAnalysis.coverage?.moleculesWithPlantsPercent}%</span>
                      </div>
                      <Progress value={linkAnalysis.coverage?.moleculesWithPlantsPercent || 0} />
                      <div className="text-xs text-muted-foreground">
                        {linkAnalysis.coverage?.moleculesWithPlants} / {linkAnalysis.entities?.molecules} molécules liées
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Plantes → Molécules</span>
                        <span className="font-medium">{linkAnalysis.coverage?.plantsWithMoleculesPercent}%</span>
                      </div>
                      <Progress value={linkAnalysis.coverage?.plantsWithMoleculesPercent || 0} />
                      <div className="text-xs text-muted-foreground">
                        {linkAnalysis.coverage?.plantsWithMolecules} / {linkAnalysis.entities?.plants} plantes liées
                      </div>
                    </div>
                  </div>
                  
                  {/* Gaps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Sans recettes</span>
                      </div>
                      <div className="text-2xl font-bold">{linkAnalysis.gaps?.moleculesWithoutRecettes}</div>
                      {moleculesWithoutRecettes && moleculesWithoutRecettes.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {moleculesWithoutRecettes.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="text-xs text-muted-foreground flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {m.name}
                            </div>
                          ))}
                          {moleculesWithoutRecettes.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... et {linkAnalysis.gaps?.moleculesWithoutRecettes - 3} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Sans plantes</span>
                      </div>
                      <div className="text-2xl font-bold">{linkAnalysis.gaps?.moleculesWithoutPlants}</div>
                      {moleculesWithoutPlants && moleculesWithoutPlants.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {moleculesWithoutPlants.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="text-xs text-muted-foreground flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {m.name}
                            </div>
                          ))}
                          {moleculesWithoutPlants.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... et {linkAnalysis.gaps?.moleculesWithoutPlants - 3} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Plantes isolées</span>
                      </div>
                      <div className="text-2xl font-bold">{linkAnalysis.gaps?.plantsWithoutMolecules}</div>
                      {plantsWithoutMolecules && plantsWithoutMolecules.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {plantsWithoutMolecules.slice(0, 3).map((p: any) => (
                            <div key={p.id} className="text-xs text-muted-foreground flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {p.name}
                            </div>
                          ))}
                          {plantsWithoutMolecules.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... et {linkAnalysis.gaps?.plantsWithoutMolecules - 3} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les données</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
