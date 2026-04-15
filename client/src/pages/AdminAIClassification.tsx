import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw, 
  Sparkles,
  Brain,
  Beaker,
  Leaf,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClassificationResult {
  id: number;
  name: string;
  success: boolean;
  applied?: boolean;
  classification?: {
    chemicalClass: string;
    chemicalClassConfidence: number;
    chemicalClassReasoning: string;
    olfactiveFamily?: string;
    olfactiveFamilyConfidence?: number;
    olfactiveFamilyReasoning?: string;
    suggestedOlfactiveProfile?: string;
    botanicalContextUsed?: boolean;
  };
  error?: string;
}

export default function AdminAIClassification() {
  const { toast } = useToast();
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [autoApply, setAutoApply] = useState(false);
  const [maxMolecules, setMaxMolecules] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());

  // Récupérer les statistiques des molécules non classifiées
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.ai.getUnclassifiedStats.useQuery();

  // Mutation pour la classification en masse
  const classifyAllMutation = trpc.ai.classifyAllUnclassified.useMutation({
    onSuccess: (data) => {
      setIsRunning(false);
      setResults((data.results || []) as any);
      toast({
        title: "Classification terminée",
        description: data.message,
      });
      refetchStats();
    },
    onError: (error) => {
      setIsRunning(false);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartClassification = () => {
    setIsRunning(true);
    setResults([]);
    classifyAllMutation.mutate({
      maxMolecules,
      autoApply,
      confidenceThreshold,
    });
  };

  const handleStopClassification = () => {
    setIsRunning(false);
    // Note: Dans une implémentation réelle, on pourrait annuler la mutation
  };

  const toggleResultExpanded = (id: number) => {
    const newSet = new Set(expandedResults);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedResults(newSet);
  };

  // Calculer les statistiques des résultats
  const resultStats = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    applied: results.filter(r => r.applied).length,
    withBotanicalContext: results.filter(r => r.classification?.botanicalContextUsed).length,
    highConfidence: results.filter(r => (r.classification?.chemicalClassConfidence || 0) >= 80).length,
    mediumConfidence: results.filter(r => {
      const conf = r.classification?.chemicalClassConfidence || 0;
      return conf >= 50 && conf < 80;
    }).length,
    lowConfidence: results.filter(r => (r.classification?.chemicalClassConfidence || 0) < 50).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-500" />
              Classification IA en Masse
            </h1>
            <p className="text-muted-foreground mt-1">
              Utilisez l'intelligence artificielle pour classifier automatiquement les molécules non classifiées
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetchStats()}
            disabled={statsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Molécules Sans Classe</CardTitle>
                <Beaker className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{stats.noChemicalClass}</div>
                <Progress value={100 - stats.classificationRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.classificationRate}% déjà classifiées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avec Plantes Sources</CardTitle>
                <Leaf className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.withPlantSources}</div>
                <Progress value={stats.plantLinkageRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.plantLinkageRate}% liées à des plantes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Molécules</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMolecules}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Dans la base de données
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contexte Botanique</CardTitle>
                <Info className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">Enrichi</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Les plantes sources améliorent la précision
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Paramétrez la classification automatique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nombre de molécules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Nombre de molécules à traiter</Label>
                  <span className="text-sm font-medium">{maxMolecules}</span>
                </div>
                <Slider
                  value={[maxMolecules]}
                  onValueChange={([v]) => setMaxMolecules(v)}
                  min={10}
                  max={200}
                  step={10}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground">
                  Traitez par lots pour un meilleur contrôle
                </p>
              </div>

              {/* Seuil de confiance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Seuil de confiance pour auto-application</Label>
                  <span className="text-sm font-medium">{confidenceThreshold}%</span>
                </div>
                <Slider
                  value={[confidenceThreshold]}
                  onValueChange={([v]) => setConfidenceThreshold(v)}
                  min={50}
                  max={95}
                  step={5}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground">
                  Seules les classifications au-dessus de ce seuil seront appliquées automatiquement
                </p>
              </div>

              {/* Auto-application */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Application automatique</Label>
                  <p className="text-xs text-muted-foreground">
                    Appliquer automatiquement les classifications avec confiance élevée
                  </p>
                </div>
                <Switch
                  checked={autoApply}
                  onCheckedChange={setAutoApply}
                  disabled={isRunning}
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2 pt-4">
                {!isRunning ? (
                  <Button 
                    onClick={handleStartClassification}
                    className="flex-1"
                    disabled={!stats || stats.noChemicalClass === 0}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Démarrer la Classification
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopClassification}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Arrêter
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setResults([])}
                  disabled={isRunning || results.length === 0}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Indicateur de progression */}
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Classification en cours...</span>
                  </div>
                  <Progress value={undefined} className="animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Résumé des Résultats
              </CardTitle>
              <CardDescription>
                {results.length > 0 
                  ? `${resultStats.total} molécules traitées`
                  : "Lancez une classification pour voir les résultats"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Réussies</span>
                      </div>
                      <p className="text-2xl font-bold text-green-500 mt-1">
                        {resultStats.successful}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Appliquées</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-500 mt-1">
                        {resultStats.applied}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Distribution de confiance</p>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="default" className="bg-green-500">
                              Haute: {resultStats.highConfidence}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>≥80% de confiance</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary">
                              Moyenne: {resultStats.mediumConfidence}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>50-79% de confiance</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline">
                              Basse: {resultStats.lowConfidence}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>&lt;50% de confiance</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Avec contexte botanique</span>
                    </div>
                    <p className="text-lg font-bold text-purple-500 mt-1">
                      {resultStats.withBotanicalContext} / {resultStats.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Classifications enrichies par les données des plantes sources
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Aucun résultat pour le moment
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configurez les paramètres et lancez la classification
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Détail des Classifications</CardTitle>
              <CardDescription>
                Cliquez sur une molécule pour voir le raisonnement de l'IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Toutes ({results.length})</TabsTrigger>
                  <TabsTrigger value="applied">Appliquées ({resultStats.applied})</TabsTrigger>
                  <TabsTrigger value="pending">En attente ({resultStats.successful - resultStats.applied})</TabsTrigger>
                  <TabsTrigger value="failed">Échecs ({results.length - resultStats.successful})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.map((result) => (
                        <ResultItem 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="applied" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.filter(r => r.applied).map((result) => (
                        <ResultItem 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.filter(r => r.success && !r.applied).map((result) => (
                        <ResultItem 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="failed" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.filter(r => !r.success).map((result) => (
                        <ResultItem 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// Composant pour afficher un résultat individuel
function ResultItem({ 
  result, 
  expanded, 
  onToggle 
}: { 
  result: ClassificationResult; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const confidenceColor = (conf: number) => {
    if (conf >= 80) return "text-green-500";
    if (conf >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div 
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        result.success ? 'hover:bg-muted/50' : 'bg-red-500/5 hover:bg-red-500/10'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {result.success ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <div>
            <p className="font-medium">{result.name}</p>
            {result.classification && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {result.classification.chemicalClass?.replace(/_/g, ' ')}
                </Badge>
                <span className={`text-xs font-medium ${confidenceColor(result.classification.chemicalClassConfidence)}`}>
                  {result.classification.chemicalClassConfidence}%
                </span>
                {result.classification.botanicalContextUsed && (
                  <Badge variant="secondary" className="text-xs">
                    <Leaf className="h-3 w-3 mr-1" />
                    Botanique
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result.applied && (
            <Badge className="bg-blue-500">Appliqué</Badge>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && result.classification && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Raisonnement (Classe Chimique)</p>
            <p className="text-sm mt-1">{result.classification.chemicalClassReasoning}</p>
          </div>
          
          {result.classification.olfactiveFamily && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Famille Olfactive</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{result.classification.olfactiveFamily}</Badge>
                <span className={`text-xs font-medium ${confidenceColor(result.classification.olfactiveFamilyConfidence || 0)}`}>
                  {result.classification.olfactiveFamilyConfidence}%
                </span>
              </div>
              {result.classification.olfactiveFamilyReasoning && (
                <p className="text-sm mt-1 text-muted-foreground">
                  {result.classification.olfactiveFamilyReasoning}
                </p>
              )}
            </div>
          )}

          {result.classification.suggestedOlfactiveProfile && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Profil Olfactif Suggéré</p>
              <p className="text-sm mt-1 italic">"{result.classification.suggestedOlfactiveProfile}"</p>
            </div>
          )}
        </div>
      )}

      {expanded && result.error && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-red-500">{result.error}</p>
        </div>
      )}
    </div>
  );
}
