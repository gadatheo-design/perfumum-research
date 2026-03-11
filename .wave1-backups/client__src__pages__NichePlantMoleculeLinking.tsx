// @ts-nocheck
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Link2, 
  Beaker, 
  Leaf, 
  Search, 
  Plus, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Target,
  Lightbulb
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
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

interface Plant {
  id: number;
  name: string;
  latinName?: string | null;
  family?: string | null;
  category?: string | null;
  origin?: string | null;
}

interface Molecule {
  id: number;
  name: string;
  casNumber?: string | null;
  chemicalClass?: string | null;
  family?: string | null;
  olfactiveProfile?: string | null;
}

interface SuggestedMolecule extends Molecule {
  reason: string;
  confidence: number;
  suggestedRole: "majeur" | "secondaire" | "trace";
  suggestedPercentage?: number;
}

// Mapping des familles botaniques vers les types de molécules probables
const BOTANICAL_FAMILY_HINTS: Record<string, { molecules: string[]; classes: string[] }> = {
  "Lamiaceae": { 
    molecules: ["Linalol", "Thymol", "Carvacrol", "Menthol", "Eucalyptol", "Camphre"],
    classes: ["monoterpene", "alcohol", "phenol"]
  },
  "Rutaceae": { 
    molecules: ["Limonène", "Citral", "Linalol", "Bergaptène", "Géraniol"],
    classes: ["monoterpene", "aldehyde", "coumarin"]
  },
  "Asteraceae": { 
    molecules: ["Chamazulène", "α-Bisabolol", "Artémisinine"],
    classes: ["sesquiterpene", "lactone"]
  },
  "Lauraceae": { 
    molecules: ["Cinnamaldéhyde", "Eugénol", "Camphre", "Safrol"],
    classes: ["aldehyde", "phenol", "aromatic"]
  },
  "Myrtaceae": { 
    molecules: ["Eucalyptol", "α-Pinène", "Eugénol", "Citronellal"],
    classes: ["monoterpene", "ether", "phenol"]
  },
  "Apiaceae": { 
    molecules: ["Anéthole", "Fenchone", "Myristicine"],
    classes: ["phenol", "ketone", "aromatic"]
  },
  "Zingiberaceae": { 
    molecules: ["Zingibérène", "Curcumine", "α-Pinène"],
    classes: ["sesquiterpene", "ketone"]
  },
  "Cannabaceae": { 
    molecules: ["Myrcène", "β-Caryophyllène", "Limonène", "Humulène", "Linalol"],
    classes: ["monoterpene", "sesquiterpene"]
  },
  "Solanaceae": { 
    molecules: ["Nicotine", "Solanesol"],
    classes: ["alkaloid", "other"]
  },
  "Poaceae": { 
    molecules: ["Citral", "Géraniol", "Citronellal"],
    classes: ["aldehyde", "alcohol", "monoterpene"]
  },
};

export default function NichePlantMoleculeLinking() {
  const { toast } = useToast();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [selectedMolecules, setSelectedMolecules] = useState<Set<number>>(new Set());
  const [linkRole, setLinkRole] = useState<string>("secondaire");
  const [linkPercentage, setLinkPercentage] = useState("");
  const [isSignature, setIsSignature] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedMolecule[]>([]);
  
  const debouncedMoleculeSearch = useDebounce(moleculeSearch, 300);
  
  // Queries
  const stats = trpc.contributor.getPlantMoleculeStats.useQuery();
  const orphanPlants = trpc.contributor.getOrphanPlants.useQuery({ limit: 100 });
  
  const moleculeSearchResults = trpc.contributor.searchMolecules.useQuery(
    { query: debouncedMoleculeSearch, limit: 20 },
    { enabled: debouncedMoleculeSearch.length >= 2 }
  );
  
  const allMolecules = trpc.molecules.list.useQuery();
  
  const linkExists = trpc.contributor.checkLinkExists.useQuery(
    { plantId: selectedPlant?.id || 0, moleculeId: Array.from(selectedMolecules)[0] || 0 },
    { enabled: !!(selectedPlant?.id && selectedMolecules.size === 1) }
  );
  
  // Mutation pour créer une liaison
  const createLink = trpc.contributor.createPlantMoleculeLink.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison créée",
        description: `Liaison créée avec succès`,
      });
      stats.refetch();
      orphanPlants.refetch();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filtrer les plantes de niche (catégories spécifiques ou origines exotiques)
  const nichePlants = useMemo(() => {
    if (!orphanPlants.data) return [];
    
    // Considérer comme "niche" les plantes avec certaines catégories ou familles rares
    const nicheCategories = ["cannabis", "tabac", "rare", "endémique", "menacée"];
    const nicheFamilies = ["Cannabaceae", "Solanaceae", "Burseraceae", "Dipterocarpaceae"];
    
    return orphanPlants.data.filter((plant: Plant) => {
      const isNicheCategory = nicheCategories.some(cat => 
        plant.category?.toLowerCase().includes(cat)
      );
      const isNicheFamily = nicheFamilies.some(fam => 
        plant.family?.toLowerCase().includes(fam.toLowerCase())
      );
      // Ou simplement toutes les plantes orphelines
      return true; // Pour l'instant, afficher toutes les plantes orphelines
    });
  }, [orphanPlants.data]);

  // Générer des suggestions de molécules basées sur la famille botanique
  const generateSuggestions = (plant: Plant) => {
    if (!allMolecules.data) return [];
    
    const familyHints = plant.family ? BOTANICAL_FAMILY_HINTS[plant.family] : null;
    const suggestedMolecules: SuggestedMolecule[] = [];
    
    if (familyHints) {
      // Chercher les molécules qui correspondent aux noms suggérés
      familyHints.molecules.forEach((molName, index) => {
        const found = allMolecules.data.find((m: Molecule) => 
          m.name.toLowerCase().includes(molName.toLowerCase()) ||
          molName.toLowerCase().includes(m.name.toLowerCase())
        );
        if (found) {
          suggestedMolecules.push({
            ...found,
            reason: `Molécule typique de la famille ${plant.family}`,
            confidence: 85 - (index * 5),
            suggestedRole: index < 2 ? "majeur" : "secondaire",
            suggestedPercentage: index < 2 ? 15 : 5,
          });
        }
      });
      
      // Chercher les molécules par classe chimique
      familyHints.classes.forEach((chemClass) => {
        const found = allMolecules.data.filter((m: Molecule) => 
          m.chemicalClass === chemClass && 
          !suggestedMolecules.some(s => s.id === m.id)
        ).slice(0, 3);
        
        found.forEach((m: Molecule, idx: number) => {
          suggestedMolecules.push({
            ...m,
            reason: `Classe chimique ${chemClass} commune dans ${plant.family}`,
            confidence: 70 - (idx * 10),
            suggestedRole: "secondaire",
            suggestedPercentage: 3,
          });
        });
      });
    }
    
    // Trier par confiance
    return suggestedMolecules.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  };

  // Ouvrir le dialog de suggestions
  const handleShowSuggestions = (plant: Plant) => {
    setSelectedPlant(plant);
    const sugg = generateSuggestions(plant);
    setSuggestions(sugg);
    setShowSuggestionsDialog(true);
  };

  // Créer les liaisons sélectionnées
  const handleCreateLinks = async () => {
    if (!selectedPlant || selectedMolecules.size === 0) return;
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const moleculeId of Array.from(selectedMolecules)) {
      try {
        await createLink.mutateAsync({
          plantId: selectedPlant.id,
          moleculeId,
          role: linkRole as "majeur" | "secondaire" | "trace" | "variable" | undefined,
          percentageTypical: linkPercentage ? parseFloat(linkPercentage) : undefined,
          isSignature: isSignature ? 1 : 0,
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }
    
    if (successCount > 0) {
      toast({
        title: "Liaisons créées",
        description: `${successCount} liaison(s) créée(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ""}`,
      });
    }
    
    setSelectedMolecules(new Set());
    setSelectedPlant(null);
    setShowSuggestionsDialog(false);
  };

  // Créer les liaisons depuis les suggestions
  const handleCreateFromSuggestions = async (selectedSuggestions: SuggestedMolecule[]) => {
    if (!selectedPlant || selectedSuggestions.length === 0) return;
    
    let successCount = 0;
    
    for (const sugg of selectedSuggestions) {
      try {
        await createLink.mutateAsync({
          plantId: selectedPlant.id,
          moleculeId: sugg.id,
          role: sugg.suggestedRole,
          percentageTypical: sugg.suggestedPercentage,
          isSignature: sugg.suggestedRole === "majeur" ? 1 : 0,
        });
        successCount++;
      } catch {
        // Ignorer les erreurs individuelles
      }
    }
    
    if (successCount > 0) {
      toast({
        title: "Liaisons créées",
        description: `${successCount} liaison(s) créée(s) depuis les suggestions`,
      });
    }
    
    setShowSuggestionsDialog(false);
    setSelectedPlant(null);
    orphanPlants.refetch();
    stats.refetch();
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-500" />
              Liaisons Plantes de Niche
            </h1>
            <p className="text-muted-foreground mt-1">
              Créez des liaisons moléculaires pour les plantes de niche importées
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { orphanPlants.refetch(); stats.refetch(); }}
            disabled={orphanPlants.isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${orphanPlants.isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats.data && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plantes Orphelines</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{stats.data.orphanPlants}</div>
                <Progress 
                  value={100 - ((stats.data.plantsWithLinks / (stats.data.totalPlants || 1)) * 100)} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.data.plantsWithLinks} / {stats.data.totalPlants} plantes liées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Molécules Orphelines</CardTitle>
                <Beaker className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{stats.data.orphanMolecules}</div>
                <Progress 
                  value={100 - ((stats.data.moleculesWithLinks / (stats.data.totalMolecules || 1)) * 100)} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.data.moleculesWithLinks} / {stats.data.totalMolecules} molécules liées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Liaisons</CardTitle>
                <Link2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.data.total}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Liaisons plante-molécule existantes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plantes de Niche</CardTitle>
                <Target className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">{nichePlants.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plantes sans liaisons à traiter
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Liste des plantes orphelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Plantes Sans Liaisons
              </CardTitle>
              <CardDescription>
                Sélectionnez une plante pour créer des liaisons moléculaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {orphanPlants.isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : nichePlants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-muted-foreground">
                      Toutes les plantes ont des liaisons moléculaires !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {nichePlants.map((plant: Plant) => (
                      <div 
                        key={plant.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedPlant?.id === plant.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedPlant(plant)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{plant.name}</p>
                            {plant.latinName && (
                              <p className="text-sm text-muted-foreground italic">{plant.latinName}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {plant.family && (
                                <Badge variant="outline" className="text-xs">
                                  {plant.family}
                                </Badge>
                              )}
                              {plant.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {plant.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowSuggestions(plant);
                                  }}
                                >
                                  <Lightbulb className="h-4 w-4 text-amber-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Voir les suggestions de molécules
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Création de liaison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Créer des Liaisons
              </CardTitle>
              <CardDescription>
                {selectedPlant 
                  ? `Ajoutez des molécules à "${selectedPlant.name}"`
                  : "Sélectionnez d'abord une plante"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlant ? (
                <>
                  {/* Plante sélectionnée */}
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{selectedPlant.name}</span>
                    </div>
                    {selectedPlant.family && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Famille: {selectedPlant.family}
                      </p>
                    )}
                  </div>

                  {/* Recherche de molécules */}
                  <div className="space-y-2">
                    <Label>Rechercher des molécules</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nom de la molécule..."
                        value={moleculeSearch}
                        onChange={(e) => setMoleculeSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Résultats de recherche */}
                  {moleculeSearchResults.data && moleculeSearchResults.data.length > 0 && (
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      <div className="space-y-1">
                        {moleculeSearchResults.data.map((molecule: Molecule) => (
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
                            <div className="flex-1">
                              <p className="font-medium">{molecule.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {molecule.chemicalClass && (
                                  <Badge variant="outline" className="text-xs">
                                    {molecule.chemicalClass}
                                  </Badge>
                                )}
                                {molecule.casNumber && (
                                  <span>CAS: {molecule.casNumber}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {/* Options de liaison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rôle</Label>
                      <Select value={linkRole} onValueChange={setLinkRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
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
                      <Label>Pourcentage typique</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 5.5"
                        value={linkPercentage}
                        onChange={(e) => setLinkPercentage(e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="isSignature"
                      checked={isSignature}
                      onCheckedChange={(checked) => setIsSignature(checked === true)}
                    />
                    <Label htmlFor="isSignature">Molécule signature de la plante</Label>
                  </div>

                  {/* Bouton de création */}
                  <Button 
                    onClick={handleCreateLinks}
                    className="w-full"
                    disabled={selectedMolecules.size === 0 || createLink.isPending}
                  >
                    {createLink.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Créer {selectedMolecules.size} liaison(s)
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une plante dans la liste pour commencer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialog de suggestions */}
        <Dialog open={showSuggestionsDialog} onOpenChange={setShowSuggestionsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Suggestions de Molécules
              </DialogTitle>
              <DialogDescription>
                {selectedPlant && (
                  <>
                    Molécules suggérées pour <strong>{selectedPlant.name}</strong>
                    {selectedPlant.family && (
                      <> (famille {selectedPlant.family})</>
                    )}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[400px]">
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((sugg) => (
                    <div 
                      key={sugg.id}
                      className="p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedMolecules.has(sugg.id)}
                            onCheckedChange={() => toggleMolecule(sugg.id)}
                          />
                          <div>
                            <p className="font-medium">{sugg.name}</p>
                            <p className="text-sm text-muted-foreground">{sugg.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={sugg.suggestedRole === "majeur" ? "default" : "secondary"}>
                            {sugg.suggestedRole}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              sugg.confidence >= 80 ? 'text-green-500 border-green-500' :
                              sugg.confidence >= 60 ? 'text-amber-500 border-amber-500' :
                              'text-muted-foreground'
                            }
                          >
                            {sugg.confidence}%
                          </Badge>
                        </div>
                      </div>
                      {sugg.suggestedPercentage && (
                        <p className="text-xs text-muted-foreground mt-1 ml-9">
                          Pourcentage suggéré: {sugg.suggestedPercentage}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Aucune suggestion disponible pour cette plante
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    La famille botanique n'est pas reconnue ou n'a pas de correspondances
                  </p>
                </div>
              )}
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowSuggestionsDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => handleCreateFromSuggestions(
                  suggestions.filter(s => selectedMolecules.has(s.id))
                )}
                disabled={selectedMolecules.size === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer {selectedMolecules.size} liaison(s)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
