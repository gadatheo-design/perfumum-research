// @ts-nocheck
import { useState, useMemo } from "react";
import MolecularRadar from "@/components/MolecularRadar";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  Ghost,
  MapPin,
  Calendar,
  AlertTriangle,
  Leaf,
  FlaskConical,
  Image as ImageIcon,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Link as LinkIcon,
  Dna,
  TreeDeciduous,
  Search,
  X,
  ChevronLeft,
  ExternalLink,
  Info,
} from "lucide-react";

// Couleurs par type de variété
const VARIETY_TYPE_COLORS: Record<string, string> = {
  rose: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  jasmine: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  tobacco: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  cannabis: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  lavender: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  citrus: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  aromatic_herb: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  resin_tree: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

// Couleurs par statut de conservation
const CONSERVATION_STATUS_COLORS: Record<string, string> = {
  extinct: "bg-black text-white",
  extinct_wild: "bg-gray-800 text-white",
  critically_endangered: "bg-red-600 text-white",
  endangered: "bg-orange-600 text-white",
  vulnerable: "bg-yellow-600 text-white",
  near_threatened: "bg-blue-600 text-white",
  reconstructed: "bg-green-600 text-white",
  unknown: "bg-gray-400 text-white",
};

// Labels en français
const VARIETY_TYPE_LABELS: Record<string, string> = {
  rose: "Rose",
  jasmine: "Jasmin",
  tobacco: "Tabac",
  cannabis: "Cannabis",
  lavender: "Lavande",
  citrus: "Agrume",
  aromatic_herb: "Herbe aromatique",
  resin_tree: "Arbre à résine",
  other: "Autre",
};

const CONSERVATION_STATUS_LABELS: Record<string, string> = {
  extinct: "Éteint",
  extinct_wild: "Éteint à l'état sauvage",
  critically_endangered: "En danger critique",
  endangered: "En danger",
  vulnerable: "Vulnérable",
  near_threatened: "Quasi menacé",
  reconstructed: "Reconstitué",
  unknown: "Inconnu",
};

const LINK_TYPE_LABELS: Record<string, string> = {
  dominant: "Dominante",
  characteristic: "Caractéristique",
  trace: "Trace",
  reconstructed: "Reconstruction",
  historical: "Historique",
  hypothetical: "Hypothétique",
  other: "Autre",
};

const RELATIONSHIP_TYPE_LABELS: Record<string, string> = {
  parent_species: "Espèce parente",
  related_variety: "Variété apparentée",
  hybrid_parent: "Parent hybride",
  descendant: "Descendant",
  comparison: "Comparaison",
  reconstruction_base: "Base de reconstruction",
  other: "Autre",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  gc_ms_analysis: "Analyse GC-MS",
  historical_text: "Texte historique",
  reconstruction: "Reconstruction",
  comparative: "Analyse comparative",
  expert_opinion: "Opinion d'expert",
  other: "Autre",
};

export default function GhostVarietyDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const varietyId = parseInt(params.id || "0");

  // State for dialogs
  const [showAddMoleculeDialog, setShowAddMoleculeDialog] = useState(false);
  const [showAddPlantDialog, setShowAddPlantDialog] = useState(false);
  const [moleculeSearchQuery, setMoleculeSearchQuery] = useState("");
  const [plantSearchQuery, setPlantSearchQuery] = useState("");
  const [selectedMolecule, setSelectedMolecule] = useState<{ id: number; name: string } | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<{ id: number; name: string } | null>(null);
  const [newMoleculeLink, setNewMoleculeLink] = useState({
    linkType: "characteristic" as const,
    percentage: "",
    confidence: "medium" as const,
    sourceType: "other" as const,
    notes: "",
    sourceReference: "",
  });
  const [newPlantLink, setNewPlantLink] = useState({
    relationshipType: "parent_species" as const,
    confidence: "medium" as const,
    geneticSimilarity: "",
    notes: "",
    sourceReference: "",
  });

  // Fetch data
  const { data: completeData, isLoading, refetch } = trpc.ghostVarietyLinks.getComplete.useQuery(varietyId, {
    enabled: varietyId > 0,
  });

  // Search queries
  const { data: moleculeSearchResults } = trpc.ghostVarietyExtended.searchMolecules.useQuery(
    { query: moleculeSearchQuery, limit: 10 },
    { enabled: moleculeSearchQuery.length >= 2 }
  );

  const { data: plantSearchResults } = trpc.ghostVarietyExtended.searchPlants.useQuery(
    { query: plantSearchQuery, limit: 10 },
    { enabled: plantSearchQuery.length >= 2 }
  );

  // Mutations
  const createMoleculeLink = trpc.ghostVarietyLinks.moleculeLinks.create.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison créée", description: "La molécule a été liée à la variété." });
      setShowAddMoleculeDialog(false);
      setSelectedMolecule(null);
      setMoleculeSearchQuery("");
      setNewMoleculeLink({
        linkType: "characteristic",
        percentage: "",
        confidence: "medium",
        sourceType: "other",
        notes: "",
        sourceReference: "",
      });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteMoleculeLink = trpc.ghostVarietyLinks.moleculeLinks.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison supprimée" });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const createPlantLink = trpc.ghostVarietyLinks.plantLinks.create.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison créée", description: "La plante a été liée à la variété." });
      setShowAddPlantDialog(false);
      setSelectedPlant(null);
      setPlantSearchQuery("");
      setNewPlantLink({
        relationshipType: "parent_species",
        confidence: "medium",
        geneticSimilarity: "",
        notes: "",
        sourceReference: "",
      });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deletePlantLink = trpc.ghostVarietyLinks.plantLinks.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison supprimée" });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  // Handle molecule link creation
  const handleCreateMoleculeLink = () => {
    if (!selectedMolecule) return;
    createMoleculeLink.mutate({
      ghostVarietyId: varietyId,
      moleculeId: selectedMolecule.id,
      linkType: newMoleculeLink.linkType,
      percentage: newMoleculeLink.percentage ? parseFloat(newMoleculeLink.percentage) : undefined,
      confidence: newMoleculeLink.confidence,
      sourceType: newMoleculeLink.sourceType,
      notes: newMoleculeLink.notes || undefined,
      sourceReference: newMoleculeLink.sourceReference || undefined,
    });
  };

  // Handle plant link creation
  const handleCreatePlantLink = () => {
    if (!selectedPlant) return;
    createPlantLink.mutate({
      ghostVarietyId: varietyId,
      plantId: selectedPlant.id,
      relationshipType: newPlantLink.relationshipType,
      confidence: newPlantLink.confidence,
      geneticSimilarity: newPlantLink.geneticSimilarity ? parseInt(newPlantLink.geneticSimilarity) : undefined,
      notes: newPlantLink.notes || undefined,
      sourceReference: newPlantLink.sourceReference || undefined,
    });
  };

  // Molecular profile from JSON
  const molecularProfile = useMemo(() => {
    if (!completeData?.variety?.molecularProfile) return [];
    try {
      const profile = completeData.variety.molecularProfile as { molecule: string; percentage?: number; note?: string }[];
      return profile;
    } catch {
      return [];
    }
  }, [completeData?.variety?.molecularProfile]);

  // Historical sources from JSON
  const historicalSources = useMemo(() => {
    if (!completeData?.variety?.historicalSources) return [];
    try {
      const sources = completeData.variety.historicalSources as { title: string; author?: string; year?: number; type?: string }[];
      return sources;
    } catch {
      return [];
    }
  }, [completeData?.variety?.historicalSources]);

  // Reconstruction attempts from JSON
  const reconstructionAttempts = useMemo(() => {
    if (!completeData?.variety?.reconstructionAttempts) return [];
    try {
      const attempts = completeData.variety.reconstructionAttempts as { year: number; institution?: string; method?: string; success?: boolean; notes?: string }[];
      return attempts;
    } catch {
      return [];
    }
  }, [completeData?.variety?.reconstructionAttempts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900 p-8">
        <div className="container max-w-6xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!completeData?.variety) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Ghost className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Variété non trouvée</h2>
            <p className="text-muted-foreground mb-4">Cette variété fantôme n'existe pas ou a été supprimée.</p>
            <Button asChild>
              <Link href="/ghost-varieties-explorer">Retour à l'explorateur</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { variety, moleculeLinks, plantLinks, images } = completeData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-8 px-4">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/ghost-varieties-explorer" className="hover:text-white transition-colors">Variétés fantômes</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{variety.name}</span>
          </div>

          <div className="flex items-start gap-6">
            {/* Primary image or placeholder */}
            <div className="hidden md:block w-32 h-32 rounded-lg bg-slate-600/50 overflow-hidden flex-shrink-0">
              {images.find(img => img.isPrimary)?.url ? (
                <img 
                  src={images.find(img => img.isPrimary)?.url} 
                  alt={variety.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Ghost className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{variety.name}</h1>
                <Badge className={CONSERVATION_STATUS_COLORS[variety.conservationStatus]}>
                  {CONSERVATION_STATUS_LABELS[variety.conservationStatus]}
                </Badge>
              </div>
              {variety.scientificName && (
                <p className="text-slate-300 italic text-lg mb-2">{variety.scientificName}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={VARIETY_TYPE_COLORS[variety.varietyType]}>
                  {VARIETY_TYPE_LABELS[variety.varietyType]}
                </Badge>
                {variety.lastDocumentedLocation && (
                  <Badge variant="outline" className="bg-white/10 border-white/30">
                    <MapPin className="h-3 w-3 mr-1" />
                    {variety.lastDocumentedLocation}
                  </Badge>
                )}
                {variety.lastDocumentedYear && (
                  <Badge variant="outline" className="bg-white/10 border-white/30">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dernière observation: {variety.lastDocumentedYear}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="bg-white/10 hover:bg-white/20 border-white/30">
                  <Link href="/ghost-varieties-explorer">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Link>
                </Button>
                {user && (
                  <Button variant="outline" size="sm" asChild className="bg-white/10 hover:bg-white/20 border-white/30">
                    <Link href={`/ghost-variety/edit/${variety.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-6xl py-8 px-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="molecules" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Molécules</span>
              <Badge variant="secondary" className="ml-1">{moleculeLinks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="plants" className="gap-2">
              <TreeDeciduous className="h-4 w-4" />
              <span className="hidden sm:inline">Plantes</span>
              <Badge variant="secondary" className="ml-1">{plantLinks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
              <Badge variant="secondary" className="ml-1">{images.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Sources</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ghost className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {variety.description ? (
                    <p className="text-muted-foreground">{variety.description}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Aucune description disponible.</p>
                  )}
                </CardContent>
              </Card>

              {/* Classification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dna className="h-5 w-5" />
                    Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {variety.plantFamily && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Famille:</span>
                      <span className="font-medium">{variety.plantFamily}</span>
                    </div>
                  )}
                  {variety.genus && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Genre:</span>
                      <span className="font-medium italic">{variety.genus}</span>
                    </div>
                  )}
                  {variety.species && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Espèce:</span>
                      <span className="font-medium italic">{variety.species}</span>
                    </div>
                  )}
                  {variety.cultivar && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cultivar:</span>
                      <span className="font-medium">'{variety.cultivar}'</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Olfactive Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Profil olfactif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {variety.olfactiveProfile ? (
                    <p className="text-muted-foreground">{variety.olfactiveProfile}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Profil olfactif non documenté.</p>
                  )}
                </CardContent>
              </Card>

              {/* Historical Significance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Importance historique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {variety.historicalSignificance ? (
                    <p className="text-muted-foreground">{variety.historicalSignificance}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Importance historique non documentée.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Disappearance causes */}
            {variety.disappearanceCauses && (variety.disappearanceCauses as string[]).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Causes de disparition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(variety.disappearanceCauses as string[]).map((cause, idx) => (
                      <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {cause}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Radar moléculaire - Visualisation du profil */}
            <MolecularRadar
              moleculeLinks={moleculeLinks}
              title="Radar moléculaire"
              description={`Profil olfactif agrégé basé sur ${moleculeLinks.length} molécule${moleculeLinks.length > 1 ? 's' : ''} liée${moleculeLinks.length > 1 ? 's' : ''}`}
              showLegend={true}
              height={400}
            />

            {/* Molecular profile from JSON */}
            {molecularProfile.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Profil moléculaire (données JSON)
                  </CardTitle>
                  <CardDescription>
                    Données moléculaires stockées dans le profil de la variété
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {molecularProfile.map((mol, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{mol.molecule}</span>
                        {mol.percentage && (
                          <Badge variant="secondary">{mol.percentage}%</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Molecules Tab */}
          <TabsContent value="molecules" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Liaisons moléculaires
                  </CardTitle>
                  <CardDescription>
                    Molécules liées à cette variété fantôme
                  </CardDescription>
                </div>
                {user && (
                  <Dialog open={showAddMoleculeDialog} onOpenChange={setShowAddMoleculeDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une molécule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Lier une molécule</DialogTitle>
                        <DialogDescription>
                          Recherchez et sélectionnez une molécule à lier à cette variété.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Search */}
                        <div className="space-y-2">
                          <Label>Rechercher une molécule</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nom, CAS, IUPAC..."
                              value={moleculeSearchQuery}
                              onChange={(e) => setMoleculeSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          {moleculeSearchResults && moleculeSearchResults.length > 0 && !selectedMolecule && (
                            <div className="border rounded-md max-h-40 overflow-y-auto">
                              {moleculeSearchResults.map((mol) => (
                                <button
                                  key={mol.id}
                                  className="w-full px-3 py-2 text-left hover:bg-muted flex justify-between items-center"
                                  onClick={() => {
                                    setSelectedMolecule({ id: mol.id, name: mol.name });
                                    setMoleculeSearchQuery(mol.name);
                                  }}
                                >
                                  <span>{mol.name}</span>
                                  {mol.casNumber && (
                                    <span className="text-xs text-muted-foreground">{mol.casNumber}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                          {selectedMolecule && (
                            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                              <FlaskConical className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{selectedMolecule.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto h-6 w-6 p-0"
                                onClick={() => {
                                  setSelectedMolecule(null);
                                  setMoleculeSearchQuery("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Link details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type de liaison</Label>
                            <Select
                              value={newMoleculeLink.linkType}
                              onValueChange={(v) => setNewMoleculeLink({ ...newMoleculeLink, linkType: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(LINK_TYPE_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Pourcentage</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ex: 15.5"
                              value={newMoleculeLink.percentage}
                              onChange={(e) => setNewMoleculeLink({ ...newMoleculeLink, percentage: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Confiance</Label>
                            <Select
                              value={newMoleculeLink.confidence}
                              onValueChange={(v) => setNewMoleculeLink({ ...newMoleculeLink, confidence: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(CONFIDENCE_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Type de source</Label>
                            <Select
                              value={newMoleculeLink.sourceType}
                              onValueChange={(v) => setNewMoleculeLink({ ...newMoleculeLink, sourceType: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(SOURCE_TYPE_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Informations complémentaires..."
                            value={newMoleculeLink.notes}
                            onChange={(e) => setNewMoleculeLink({ ...newMoleculeLink, notes: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Référence source</Label>
                          <Input
                            placeholder="ex: Smith et al., 2020"
                            value={newMoleculeLink.sourceReference}
                            onChange={(e) => setNewMoleculeLink({ ...newMoleculeLink, sourceReference: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddMoleculeDialog(false)}>
                          Annuler
                        </Button>
                        <Button
                          onClick={handleCreateMoleculeLink}
                          disabled={!selectedMolecule || createMoleculeLink.isPending}
                        >
                          {createMoleculeLink.isPending ? "Création..." : "Créer la liaison"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {moleculeLinks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune molécule liée à cette variété.</p>
                    {user && (
                      <p className="text-sm mt-2">Cliquez sur "Ajouter une molécule" pour créer une liaison.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {moleculeLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <FlaskConical className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {link.molecule?.name || `Molécule #${link.moleculeId}`}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {LINK_TYPE_LABELS[link.linkType || "other"]}
                              </Badge>
                              {link.percentage && (
                                <span>{link.percentage}%</span>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {CONFIDENCE_LABELS[link.confidence || "medium"]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/molecule/${link.moleculeId}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          {user && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteMoleculeLink.mutate(link.id)}
                              disabled={deleteMoleculeLink.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plants Tab */}
          <TabsContent value="plants" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5" />
                    Liaisons botaniques
                  </CardTitle>
                  <CardDescription>
                    Plantes parentes ou apparentées à cette variété
                  </CardDescription>
                </div>
                {user && (
                  <Dialog open={showAddPlantDialog} onOpenChange={setShowAddPlantDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une plante
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Lier une plante</DialogTitle>
                        <DialogDescription>
                          Recherchez et sélectionnez une plante à lier à cette variété.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Search */}
                        <div className="space-y-2">
                          <Label>Rechercher une plante</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nom commun ou latin..."
                              value={plantSearchQuery}
                              onChange={(e) => setPlantSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          {plantSearchResults && plantSearchResults.length > 0 && !selectedPlant && (
                            <div className="border rounded-md max-h-40 overflow-y-auto">
                              {plantSearchResults.map((plant) => (
                                <button
                                  key={plant.id}
                                  className="w-full px-3 py-2 text-left hover:bg-muted flex justify-between items-center"
                                  onClick={() => {
                                    setSelectedPlant({ id: plant.id, name: plant.name });
                                    setPlantSearchQuery(plant.name);
                                  }}
                                >
                                  <span>{plant.name}</span>
                                  {plant.latinName && (
                                    <span className="text-xs text-muted-foreground italic">{plant.latinName}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                          {selectedPlant && (
                            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                              <TreeDeciduous className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{selectedPlant.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto h-6 w-6 p-0"
                                onClick={() => {
                                  setSelectedPlant(null);
                                  setPlantSearchQuery("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Link details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type de relation</Label>
                            <Select
                              value={newPlantLink.relationshipType}
                              onValueChange={(v) => setNewPlantLink({ ...newPlantLink, relationshipType: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(RELATIONSHIP_TYPE_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Confiance</Label>
                            <Select
                              value={newPlantLink.confidence}
                              onValueChange={(v) => setNewPlantLink({ ...newPlantLink, confidence: v as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(CONFIDENCE_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Similarité génétique (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="ex: 85"
                            value={newPlantLink.geneticSimilarity}
                            onChange={(e) => setNewPlantLink({ ...newPlantLink, geneticSimilarity: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Informations complémentaires..."
                            value={newPlantLink.notes}
                            onChange={(e) => setNewPlantLink({ ...newPlantLink, notes: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Référence source</Label>
                          <Input
                            placeholder="ex: Étude phylogénétique, 2019"
                            value={newPlantLink.sourceReference}
                            onChange={(e) => setNewPlantLink({ ...newPlantLink, sourceReference: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddPlantDialog(false)}>
                          Annuler
                        </Button>
                        <Button
                          onClick={handleCreatePlantLink}
                          disabled={!selectedPlant || createPlantLink.isPending}
                        >
                          {createPlantLink.isPending ? "Création..." : "Créer la liaison"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {plantLinks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TreeDeciduous className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune plante liée à cette variété.</p>
                    {user && (
                      <p className="text-sm mt-2">Cliquez sur "Ajouter une plante" pour créer une liaison.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plantLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <TreeDeciduous className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {link.plant?.name || `Plante #${link.plantId}`}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {RELATIONSHIP_TYPE_LABELS[link.relationshipType || "other"]}
                              </Badge>
                              {link.geneticSimilarity && (
                                <span>Similarité: {link.geneticSimilarity}%</span>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {CONFIDENCE_LABELS[link.confidence || "medium"]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/plant/${link.plantId}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          {user && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deletePlantLink.mutate(link.id)}
                              disabled={deletePlantLink.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Galerie d'images
                  </CardTitle>
                  <CardDescription>
                    Illustrations botaniques, photographies et documents visuels
                  </CardDescription>
                </div>
                {user && (
                  <Button asChild>
                    <Link href={`/ghost-variety/${varietyId}/upload-image`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une image
                    </Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune image disponible pour cette variété.</p>
                    {user && (
                      <p className="text-sm mt-2">Cliquez sur "Ajouter une image" pour télécharger une illustration.</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group rounded-lg overflow-hidden border ${
                          image.isPrimary ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.title || variety.name}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div className="text-white text-sm">
                            {image.title && <p className="font-medium">{image.title}</p>}
                            {image.year && <p className="text-white/70">{image.year}</p>}
                          </div>
                        </div>
                        {image.isPrimary && (
                          <Badge className="absolute top-2 left-2 bg-primary">
                            Principale
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            {/* Historical Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Sources historiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historicalSources.length === 0 ? (
                  <p className="text-muted-foreground italic">Aucune source historique documentée.</p>
                ) : (
                  <div className="space-y-3">
                    {historicalSources.map((source, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <p className="font-medium">{source.title}</p>
                        <div className="text-sm text-muted-foreground mt-1">
                          {source.author && <span>{source.author}</span>}
                          {source.author && source.year && <span> • </span>}
                          {source.year && <span>{source.year}</span>}
                          {source.type && (
                            <Badge variant="outline" className="ml-2">{source.type}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reconstruction Attempts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Tentatives de reconstruction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reconstructionAttempts.length === 0 ? (
                  <p className="text-muted-foreground italic">Aucune tentative de reconstruction documentée.</p>
                ) : (
                  <div className="space-y-3">
                    {reconstructionAttempts.map((attempt, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{attempt.year}</span>
                          <Badge variant={attempt.success ? "default" : "secondary"}>
                            {attempt.success ? "Succès" : "En cours / Échec"}
                          </Badge>
                        </div>
                        {attempt.institution && (
                          <p className="text-sm text-muted-foreground">{attempt.institution}</p>
                        )}
                        {attempt.method && (
                          <p className="text-sm mt-1">Méthode: {attempt.method}</p>
                        )}
                        {attempt.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{attempt.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {variety.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Notes de recherche
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{variety.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
