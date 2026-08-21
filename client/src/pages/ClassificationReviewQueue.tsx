import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw, 
  Eye,
  Edit3,
  X,
  Check,
  SkipForward,
  ChevronDown,
  ChevronUp,
  Beaker,
  Brain,
  Leaf,
  AlertTriangle,
  TrendingUp,
  Clock
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Liste des classes chimiques disponibles
const CHEMICAL_CLASSES = [
  "monoterpene", "sesquiterpene", "diterpene", "triterpene", "tetraterpene",
  "alcohol", "aldehyde", "ketone", "ester", "ether", "oxide",
  "phenol", "lactone", "coumarin", "furan", "pyran",
  "aromatic", "aliphatic", "heterocyclic", "sulfur_compound", "nitrogen_compound",
  "acid", "amine", "amide", "nitrile", "thiol",
  "alkaloid", "flavonoid", "glycoside", "steroid", "other"
];

// Liste des familles olfactives
const OLFACTIVE_FAMILIES = [
  "Agrumes", "Floral", "Boisé", "Oriental", "Fougère",
  "Chypré", "Aromatique", "Cuir", "Gourmand", "Aquatique",
  "Vert", "Fruité", "Épicé", "Musqué", "Ambré",
  "Balsamique", "Résineux", "Terreux", "Fumé", "Animalique"
];

export default function ClassificationReviewQueue() {
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterMaxConfidence, setFilterMaxConfidence] = useState<number>(100);
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  // Édition manuelle
  const [editChemicalClass, setEditChemicalClass] = useState("");
  const [editOlfactiveFamily, setEditOlfactiveFamily] = useState("");
  const [editOlfactiveProfile, setEditOlfactiveProfile] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Queries
  const stats = trpc.classificationReviews.getStats.useQuery();
  const pendingReviews = trpc.classificationReviews.getPending.useQuery({
    limit: 100,
    priority: filterPriority === "all" ? undefined : filterPriority as "low" | "medium" | "high",
    maxConfidence: filterMaxConfidence < 100 ? filterMaxConfidence : undefined,
  });

  // Mutations
  const approveMutation = trpc.classificationReviews.approve.useMutation({
    onSuccess: () => {
      toast({
        title: "Classification approuvée",
        description: "La classification a été appliquée avec succès",
      });
      pendingReviews.refetch();
      stats.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = trpc.classificationReviews.reject.useMutation({
    onSuccess: () => {
      toast({
        title: "Classification rejetée",
        description: "La classification a été rejetée",
      });
      setShowRejectDialog(false);
      setRejectNotes("");
      pendingReviews.refetch();
      stats.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const modifyMutation = trpc.classificationReviews.modifyAndApply.useMutation({
    onSuccess: () => {
      toast({
        title: "Classification modifiée et appliquée",
        description: "Vos modifications ont été enregistrées",
      });
      setShowEditDialog(false);
      resetEditForm();
      pendingReviews.refetch();
      stats.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const skipMutation = trpc.classificationReviews.skip.useMutation({
    onSuccess: () => {
      toast({
        title: "Révision ignorée",
        description: "La révision a été mise de côté pour plus tard",
      });
      pendingReviews.refetch();
      stats.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetEditForm = () => {
    setEditChemicalClass("");
    setEditOlfactiveFamily("");
    setEditOlfactiveProfile("");
    setEditNotes("");
    setSelectedReview(null);
  };

  const openEditDialog = (review: any) => {
    setSelectedReview(review);
    setEditChemicalClass(review.review.aiChemicalClass || "");
    setEditOlfactiveFamily(review.review.aiOlfactiveFamily || "");
    setEditOlfactiveProfile(review.review.aiSuggestedOlfactiveProfile || "");
    setEditNotes("");
    setShowEditDialog(true);
  };

  const openRejectDialog = (review: any) => {
    setSelectedReview(review);
    setRejectNotes("");
    setShowRejectDialog(true);
  };

  const handleApprove = (reviewId: number) => {
    approveMutation.mutate(reviewId);
  };

  const handleReject = () => {
    if (!selectedReview) return;
    rejectMutation.mutate({
      reviewId: selectedReview.review.id,
      notes: rejectNotes || undefined,
    });
  };

  const handleModify = () => {
    if (!selectedReview) return;
    modifyMutation.mutate({
      reviewId: selectedReview.review.id,
      chemicalClass: editChemicalClass || undefined,
      olfactiveFamily: editOlfactiveFamily || undefined,
      olfactiveProfile: editOlfactiveProfile || undefined,
      notes: editNotes || undefined,
    });
  };

  const handleSkip = (reviewId: number) => {
    skipMutation.mutate({ reviewId });
  };

  const toggleExpanded = (id: number) => {
    const newSet = new Set(expandedReviews);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedReviews(newSet);
  };

  const confidenceColor = (conf: number) => {
    if (conf >= 70) return "text-green-500";
    if (conf >= 50) return "text-amber-500";
    if (conf >= 30) return "text-orange-500";
    return "text-red-500";
  };

  const priorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Haute</Badge>;
      case "medium":
        return <Badge variant="secondary">Moyenne</Badge>;
      case "low":
        return <Badge variant="outline">Basse</Badge>;
      default:
        return null;
    }
  };

  const reviews = pendingReviews.data?.reviews || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Eye className="h-8 w-8 text-orange-500" />
              File de Révision
            </h1>
            <p className="text-muted-foreground mt-1">
              Révisez les classifications IA à faible confiance avant application
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { pendingReviews.refetch(); stats.refetch(); }}
            disabled={pendingReviews.isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${pendingReviews.isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats.data && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{stats.data.pending}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Révisions à traiter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.data.approved}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Classifications validées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modifiées</CardTitle>
                <Edit3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{stats.data.modified}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Corrections manuelles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
                <X className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.data.rejected}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Classifications rejetées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confiance Moy.</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${confidenceColor(stats.data.avgConfidence)}`}>
                  {stats.data.avgConfidence}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.data.lowConfidenceCount} très faibles (&lt;50%)
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Priority Distribution */}
        {stats.data && stats.data.pending > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Distribution par Priorité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Haute priorité</span>
                    <span className="text-red-500 font-medium">{stats.data.byPriority.high}</span>
                  </div>
                  <Progress 
                    value={(stats.data.byPriority.high / stats.data.pending) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Priorité moyenne</span>
                    <span className="text-amber-500 font-medium">{stats.data.byPriority.medium}</span>
                  </div>
                  <Progress 
                    value={(stats.data.byPriority.medium / stats.data.pending) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Basse priorité</span>
                    <span className="text-green-500 font-medium">{stats.data.byPriority.low}</span>
                  </div>
                  <Progress 
                    value={(stats.data.byPriority.low / stats.data.pending) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="high">Haute uniquement</SelectItem>
                    <SelectItem value="medium">Moyenne uniquement</SelectItem>
                    <SelectItem value="low">Basse uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Confiance max: {filterMaxConfidence}%</Label>
                <Slider
                  value={[filterMaxConfidence]}
                  onValueChange={(v) => setFilterMaxConfidence(v[0])}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review List */}
        <Card>
          <CardHeader>
            <CardTitle>Révisions en Attente ({reviews.length})</CardTitle>
            <CardDescription>
              Cliquez sur une révision pour voir les détails, puis approuvez, modifiez ou rejetez
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {pendingReviews.isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-muted-foreground">
                    Aucune révision en attente !
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Toutes les classifications ont été traitées
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((item: any) => (
                    <div 
                      key={item.review.id}
                      className={`border rounded-lg p-4 transition-colors hover:bg-muted/50 ${
                        item.review.priority === 'high' ? 'border-red-500/50' :
                        item.review.priority === 'medium' ? 'border-amber-500/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => toggleExpanded(item.review.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Beaker className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{item.molecule?.name || `Molécule #${item.review.moleculeId}`}</p>
                              {item.molecule?.casNumber && (
                                <p className="text-sm text-muted-foreground">CAS: {item.molecule.casNumber}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            {priorityBadge(item.review.priority)}
                            <Badge variant="outline">
                              {item.review.aiChemicalClass?.replace(/_/g, ' ') || 'Non classifié'}
                            </Badge>
                            <span className={`text-sm font-medium ${confidenceColor(item.review.aiChemicalClassConfidence || 0)}`}>
                              {item.review.aiChemicalClassConfidence || 0}%
                            </span>
                            {item.review.aiBotanicalContextUsed && (
                              <Badge variant="secondary" className="text-xs">
                                <Leaf className="h-3 w-3 mr-1" />
                                Botanique
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleApprove(item.review.id)}
                                  disabled={approveMutation.isPending}
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Approuver</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => openEditDialog(item)}
                                >
                                  <Edit3 className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Modifier</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => openRejectDialog(item)}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rejeter</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleSkip(item.review.id)}
                                  disabled={skipMutation.isPending}
                                >
                                  <SkipForward className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ignorer pour l'instant</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <div 
                            className="cursor-pointer ml-2"
                            onClick={() => toggleExpanded(item.review.id)}
                          >
                            {expandedReviews.has(item.review.id) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedReviews.has(item.review.id) && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Raisonnement IA</p>
                            <p className="text-sm mt-1 bg-muted p-2 rounded">
                              {item.review.aiChemicalClassReasoning || "Aucun raisonnement fourni"}
                            </p>
                          </div>

                          {item.review.aiOlfactiveFamily && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Famille Olfactive Suggérée</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{item.review.aiOlfactiveFamily}</Badge>
                                <span className={`text-xs font-medium ${confidenceColor(item.review.aiOlfactiveFamilyConfidence || 0)}`}>
                                  {item.review.aiOlfactiveFamilyConfidence || 0}%
                                </span>
                              </div>
                              {item.review.aiOlfactiveFamilyReasoning && (
                                <p className="text-sm mt-1 text-muted-foreground">
                                  {item.review.aiOlfactiveFamilyReasoning}
                                </p>
                              )}
                            </div>
                          )}

                          {item.review.aiSuggestedOlfactiveProfile && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Profil Olfactif Suggéré</p>
                              <p className="text-sm mt-1 italic">
                                "{item.review.aiSuggestedOlfactiveProfile}"
                              </p>
                            </div>
                          )}

                          {item.molecule && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {item.molecule.chemicalFormula && (
                                <div>
                                  <span className="text-muted-foreground">Formule: </span>
                                  <span className="font-mono">{item.molecule.chemicalFormula}</span>
                                </div>
                              )}
                              {item.molecule.molecularWeight && (
                                <div>
                                  <span className="text-muted-foreground">Masse: </span>
                                  <span>{item.molecule.molecularWeight} g/mol</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-500" />
                Modifier la Classification
              </DialogTitle>
              <DialogDescription>
                {selectedReview && (
                  <>
                    Modifiez la classification de <strong>{selectedReview.molecule?.name}</strong>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* AI Suggestion */}
              {selectedReview && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Suggestion IA</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {selectedReview.review.aiChemicalClass?.replace(/_/g, ' ')}
                    </Badge>
                    <span className={`text-sm ${confidenceColor(selectedReview.review.aiChemicalClassConfidence || 0)}`}>
                      {selectedReview.review.aiChemicalClassConfidence}%
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Classe Chimique</Label>
                  <Select value={editChemicalClass} onValueChange={setEditChemicalClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CHEMICAL_CLASSES.map(cls => (
                        <SelectItem key={cls} value={cls}>
                          {cls.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Famille Olfactive</Label>
                  <Select value={editOlfactiveFamily} onValueChange={setEditOlfactiveFamily}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {OLFACTIVE_FAMILIES.map(fam => (
                        <SelectItem key={fam} value={fam}>
                          {fam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Profil Olfactif</Label>
                <Textarea
                  value={editOlfactiveProfile}
                  onChange={(e) => setEditOlfactiveProfile(e.target.value)}
                  placeholder="Description du profil olfactif..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes de révision (optionnel)</Label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Expliquez vos modifications..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleModify}
                disabled={modifyMutation.isPending}
              >
                {modifyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Appliquer les modifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Rejeter la Classification
              </DialogTitle>
              <DialogDescription>
                {selectedReview && (
                  <>
                    Êtes-vous sûr de vouloir rejeter la classification de <strong>{selectedReview.molecule?.name}</strong> ?
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Raison du rejet (optionnel)</Label>
                <Textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Expliquez pourquoi cette classification est incorrecte..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive"
                onClick={handleReject}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Rejeter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
