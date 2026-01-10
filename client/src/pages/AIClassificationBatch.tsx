import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Eye,
  ListChecks,
  Target
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface MoleculeForClassification {
  id: number;
  name: string;
  casNumber?: string | null;
  chemicalFormula?: string | null;
  family?: string | null;
  chemicalClass?: string | null;
  olfactiveProfile?: string | null;
  plantSources?: Array<{ plantId: number; plantName: string; latinName?: string }>;
}

export default function AIClassificationBatch() {
  const { toast } = useToast();
  const [selectedMolecules, setSelectedMolecules] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());
  const [pendingValidations, setPendingValidations] = useState<Set<number>>(new Set());
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [currentValidation, setCurrentValidation] = useState<ClassificationResult | null>(null);

  // Récupérer les molécules non classifiées avec leurs plantes sources
  const { data: unclassifiedData, isLoading: loadingMolecules, refetch: refetchMolecules } = 
    trpc.ai.getUnclassifiedMoleculesWithPlants.useQuery({ limit: 100, offset: 0 });

  // Récupérer les statistiques
  const { data: stats, refetch: refetchStats } = trpc.ai.getUnclassifiedStats.useQuery();

  // Mutation pour la classification en batch enrichie
  const classifyBatchMutation = trpc.ai.classifyMoleculesBatchEnhanced.useMutation({
    onSuccess: (data) => {
      setIsRunning(false);
      setResults(data.results || []);
      // Marquer les résultats non appliqués comme en attente de validation
      const pending = new Set<number>();
      data.results?.forEach((r: ClassificationResult) => {
        if (r.success && !r.applied) {
          pending.add(r.id);
        }
      });
      setPendingValidations(pending);
      toast({
        title: "Classification terminée",
        description: `${data.successful} molécules classifiées avec succès sur ${data.total}`,
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

  // Mutation pour appliquer une classification manuellement
  const applyClassificationMutation = trpc.orphanMolecules.batchClassify.useMutation({
    onSuccess: () => {
      toast({
        title: "Classification appliquée",
        description: "La classification a été enregistrée avec succès",
      });
      refetchMolecules();
      refetchStats();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const molecules = unclassifiedData?.molecules || [];

  // Sélectionner les 50 premières molécules
  const handleSelectFirst50 = () => {
    const first50 = molecules.slice(0, 50).map(m => m.id);
    setSelectedMolecules(new Set(first50));
  };

  // Sélectionner toutes les molécules
  const handleSelectAll = () => {
    setSelectedMolecules(new Set(molecules.map(m => m.id)));
  };

  // Désélectionner tout
  const handleDeselectAll = () => {
    setSelectedMolecules(new Set());
  };

  // Toggle sélection d'une molécule
  const toggleMolecule = (id: number) => {
    const newSet = new Set(selectedMolecules);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedMolecules(newSet);
  };

  // Lancer la classification
  const handleStartClassification = () => {
    if (selectedMolecules.size === 0) {
      toast({
        title: "Aucune molécule sélectionnée",
        description: "Veuillez sélectionner au moins une molécule à classifier",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setResults([]);
    setPendingValidations(new Set());
    
    classifyBatchMutation.mutate({
      moleculeIds: Array.from(selectedMolecules),
      autoApply: false, // On veut valider manuellement
      confidenceThreshold: 70,
    });
  };

  // Ouvrir le dialog de validation
  const openValidationDialog = (result: ClassificationResult) => {
    setCurrentValidation(result);
    setShowValidationDialog(true);
  };

  // Valider une classification
  const handleValidate = (result: ClassificationResult) => {
    if (!result.classification) return;

    applyClassificationMutation.mutate([{
      moleculeId: result.id,
      chemicalClass: result.classification.chemicalClass,
      family: result.classification.olfactiveFamily,
      olfactiveProfile: result.classification.suggestedOlfactiveProfile,
    }]);

    // Retirer de la liste des validations en attente
    const newPending = new Set(pendingValidations);
    newPending.delete(result.id);
    setPendingValidations(newPending);

    // Mettre à jour le résultat comme appliqué
    setResults(prev => prev.map(r => 
      r.id === result.id ? { ...r, applied: true } : r
    ));

    setShowValidationDialog(false);
    setCurrentValidation(null);
  };

  // Rejeter une classification
  const handleReject = (result: ClassificationResult) => {
    const newPending = new Set(pendingValidations);
    newPending.delete(result.id);
    setPendingValidations(newPending);

    toast({
      title: "Classification rejetée",
      description: `La classification de "${result.name}" a été rejetée`,
    });

    setShowValidationDialog(false);
    setCurrentValidation(null);
  };

  // Valider toutes les classifications avec haute confiance
  const handleValidateAllHighConfidence = () => {
    const highConfidenceResults = results.filter(r => 
      r.success && 
      !r.applied && 
      pendingValidations.has(r.id) &&
      (r.classification?.chemicalClassConfidence || 0) >= 80
    );

    if (highConfidenceResults.length === 0) {
      toast({
        title: "Aucune classification à valider",
        description: "Aucune classification avec haute confiance (≥80%) n'est en attente",
      });
      return;
    }

    const classifications = highConfidenceResults.map(r => ({
      moleculeId: r.id,
      chemicalClass: r.classification!.chemicalClass,
      family: r.classification!.olfactiveFamily,
      olfactiveProfile: r.classification!.suggestedOlfactiveProfile,
    }));

    applyClassificationMutation.mutate(classifications);

    // Mettre à jour les états
    const newPending = new Set(pendingValidations);
    highConfidenceResults.forEach(r => newPending.delete(r.id));
    setPendingValidations(newPending);

    setResults(prev => prev.map(r => 
      highConfidenceResults.some(hr => hr.id === r.id) ? { ...r, applied: true } : r
    ));

    toast({
      title: "Classifications validées",
      description: `${highConfidenceResults.length} classifications avec haute confiance ont été appliquées`,
    });
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

  // Statistiques des résultats
  const resultStats = useMemo(() => ({
    total: results.length,
    successful: results.filter(r => r.success).length,
    applied: results.filter(r => r.applied).length,
    pending: pendingValidations.size,
    withBotanicalContext: results.filter(r => r.classification?.botanicalContextUsed).length,
    highConfidence: results.filter(r => (r.classification?.chemicalClassConfidence || 0) >= 80).length,
    mediumConfidence: results.filter(r => {
      const conf = r.classification?.chemicalClassConfidence || 0;
      return conf >= 50 && conf < 80;
    }).length,
    lowConfidence: results.filter(r => (r.classification?.chemicalClassConfidence || 0) < 50).length,
  }), [results, pendingValidations]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="h-8 w-8 text-purple-500" />
              Classification IA — Lot de 50 Molécules
            </h1>
            <p className="text-muted-foreground mt-1">
              Sélectionnez 50 molécules, lancez la classification IA, puis validez ou rejetez les résultats
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { refetchMolecules(); refetchStats(); }}
            disabled={loadingMolecules}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingMolecules ? 'animate-spin' : ''}`} />
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
                <CardTitle className="text-sm font-medium">Sélectionnées</CardTitle>
                <ListChecks className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{selectedMolecules.size}</div>
                <Progress value={(selectedMolecules.size / 50) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Objectif: 50 molécules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente de Validation</CardTitle>
                <Eye className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{resultStats.pending}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Classifications à valider manuellement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Validées</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{resultStats.applied}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Classifications appliquées
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sélection des molécules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Sélection des Molécules
              </CardTitle>
              <CardDescription>
                Sélectionnez les molécules à classifier (max 50 recommandé)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Boutons de sélection rapide */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectFirst50}>
                  <Target className="h-4 w-4 mr-2" />
                  Sélectionner 50 premières
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Tout sélectionner
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  Tout désélectionner
                </Button>
              </div>

              {/* Liste des molécules */}
              <ScrollArea className="h-[300px] border rounded-md p-2">
                {loadingMolecules ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : molecules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-muted-foreground">
                      Toutes les molécules sont déjà classifiées !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {molecules.map((molecule) => (
                      <div 
                        key={molecule.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 ${
                          selectedMolecules.has(molecule.id) ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => toggleMolecule(molecule.id)}
                      >
                        <Checkbox 
                          checked={selectedMolecules.has(molecule.id)}
                          onCheckedChange={() => toggleMolecule(molecule.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{molecule.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {molecule.casNumber && (
                              <span>CAS: {molecule.casNumber}</span>
                            )}
                            {molecule.plantSources && molecule.plantSources.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <Leaf className="h-3 w-3 mr-1" />
                                {molecule.plantSources.length} plante(s)
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Bouton de lancement */}
              <Button 
                onClick={handleStartClassification}
                className="w-full"
                disabled={isRunning || selectedMolecules.size === 0}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Classification en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Classifier {selectedMolecules.size} molécule(s)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résumé des résultats */}
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
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">En attente</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-500 mt-1">
                        {resultStats.pending}
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

                  {/* Bouton de validation en masse */}
                  {resultStats.pending > 0 && resultStats.highConfidence > 0 && (
                    <Button 
                      onClick={handleValidateAllHighConfidence}
                      className="w-full"
                      variant="secondary"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Valider toutes les classifications haute confiance
                    </Button>
                  )}

                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Avec contexte botanique</span>
                    </div>
                    <p className="text-lg font-bold text-purple-500 mt-1">
                      {resultStats.withBotanicalContext} / {resultStats.total}
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
                    Sélectionnez des molécules et lancez la classification
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Résultats détaillés */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Détail des Classifications</CardTitle>
              <CardDescription>
                Cliquez sur une molécule pour voir le raisonnement, puis validez ou rejetez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">
                    En attente ({resultStats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="validated">
                    Validées ({resultStats.applied})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    Toutes ({results.length})
                  </TabsTrigger>
                  <TabsTrigger value="failed">
                    Échecs ({results.length - resultStats.successful})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.filter(r => r.success && pendingValidations.has(r.id)).map((result) => (
                        <ResultItemWithValidation 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                          onValidate={() => openValidationDialog(result)}
                          onReject={() => handleReject(result)}
                          isPending={true}
                        />
                      ))}
                      {results.filter(r => r.success && pendingValidations.has(r.id)).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          Aucune classification en attente de validation
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="validated" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.filter(r => r.applied).map((result) => (
                        <ResultItemWithValidation 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                          isPending={false}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="all" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.map((result) => (
                        <ResultItemWithValidation 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                          onValidate={pendingValidations.has(result.id) ? () => openValidationDialog(result) : undefined}
                          onReject={pendingValidations.has(result.id) ? () => handleReject(result) : undefined}
                          isPending={pendingValidations.has(result.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="failed" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {results.filter(r => !r.success).map((result) => (
                        <ResultItemWithValidation 
                          key={result.id} 
                          result={result}
                          expanded={expandedResults.has(result.id)}
                          onToggle={() => toggleResultExpanded(result.id)}
                          isPending={false}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Dialog de validation */}
        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Valider la classification</DialogTitle>
              <DialogDescription>
                Vérifiez les détails de la classification avant de l'appliquer
              </DialogDescription>
            </DialogHeader>
            
            {currentValidation && currentValidation.classification && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{currentValidation.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Classe chimique</Label>
                    <div className="flex items-center gap-2">
                      <Badge>{currentValidation.classification.chemicalClass?.replace(/_/g, ' ')}</Badge>
                      <span className={`text-sm font-medium ${
                        currentValidation.classification.chemicalClassConfidence >= 80 ? 'text-green-500' :
                        currentValidation.classification.chemicalClassConfidence >= 50 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {currentValidation.classification.chemicalClassConfidence}%
                      </span>
                    </div>
                  </div>

                  {currentValidation.classification.olfactiveFamily && (
                    <div className="space-y-2">
                      <Label>Famille olfactive</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{currentValidation.classification.olfactiveFamily}</Badge>
                        <span className={`text-sm font-medium ${
                          (currentValidation.classification.olfactiveFamilyConfidence || 0) >= 80 ? 'text-green-500' :
                          (currentValidation.classification.olfactiveFamilyConfidence || 0) >= 50 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {currentValidation.classification.olfactiveFamilyConfidence}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Raisonnement</Label>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {currentValidation.classification.chemicalClassReasoning}
                  </p>
                </div>

                {currentValidation.classification.suggestedOlfactiveProfile && (
                  <div className="space-y-2">
                    <Label>Profil olfactif suggéré</Label>
                    <p className="text-sm italic bg-muted p-3 rounded-md">
                      "{currentValidation.classification.suggestedOlfactiveProfile}"
                    </p>
                  </div>
                )}

                {currentValidation.classification.botanicalContextUsed && (
                  <Badge variant="secondary">
                    <Leaf className="h-3 w-3 mr-1" />
                    Classification enrichie par le contexte botanique
                  </Badge>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowValidationDialog(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => currentValidation && handleReject(currentValidation)}
              >
                <X className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button onClick={() => currentValidation && handleValidate(currentValidation)}>
                <Check className="h-4 w-4 mr-2" />
                Valider et appliquer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Composant pour afficher un résultat avec boutons de validation
function ResultItemWithValidation({ 
  result, 
  expanded, 
  onToggle,
  onValidate,
  onReject,
  isPending
}: { 
  result: ClassificationResult; 
  expanded: boolean;
  onToggle: () => void;
  onValidate?: () => void;
  onReject?: () => void;
  isPending: boolean;
}) {
  const confidenceColor = (conf: number) => {
    if (conf >= 80) return "text-green-500";
    if (conf >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div 
      className={`border rounded-lg p-3 transition-colors ${
        result.success ? 'hover:bg-muted/50' : 'bg-red-500/5 hover:bg-red-500/10'
      } ${isPending ? 'border-orange-500/50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={onToggle}
        >
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
            <Badge className="bg-green-500">Validé</Badge>
          )}
          {isPending && onValidate && onReject && (
            <>
              <Button size="sm" variant="ghost" onClick={onReject}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onValidate}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            </>
          )}
          <div className="cursor-pointer" onClick={onToggle}>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
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
