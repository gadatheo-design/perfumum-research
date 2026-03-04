// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight,
  Ghost,
  Save,
  Plus,
  X,
  Search,
  Leaf,
  FlaskConical,
  Image,
  BookOpen,
  AlertTriangle,
  Check,
  Loader2
} from "lucide-react";

// Types de variétés
const VARIETY_TYPES = [
  { value: "rose", label: "Rose" },
  { value: "jasmine", label: "Jasmin" },
  { value: "tobacco", label: "Tabac" },
  { value: "cannabis", label: "Cannabis" },
  { value: "lavender", label: "Lavande" },
  { value: "citrus", label: "Agrume" },
  { value: "aromatic_herb", label: "Herbe aromatique" },
  { value: "resin_tree", label: "Arbre à résine" },
  { value: "other", label: "Autre" },
];

// Statuts de conservation
const CONSERVATION_STATUSES = [
  { value: "extinct", label: "Éteint", color: "bg-black text-white" },
  { value: "extinct_wild", label: "Éteint à l'état sauvage", color: "bg-gray-800 text-white" },
  { value: "critically_endangered", label: "En danger critique", color: "bg-red-600 text-white" },
  { value: "endangered", label: "En danger", color: "bg-orange-600 text-white" },
  { value: "vulnerable", label: "Vulnérable", color: "bg-yellow-600 text-white" },
  { value: "near_threatened", label: "Quasi menacé", color: "bg-blue-600 text-white" },
  { value: "reconstructed", label: "Reconstitué", color: "bg-green-600 text-white" },
  { value: "unknown", label: "Inconnu", color: "bg-gray-400 text-white" },
];

// Causes de disparition communes
const COMMON_DISAPPEARANCE_CAUSES = [
  "Changement climatique",
  "Perte d'habitat",
  "Surexploitation",
  "Maladies",
  "Hybridation",
  "Abandon de culture",
  "Guerre/Conflit",
  "Urbanisation",
  "Pollution",
  "Autre",
];

interface HistoricalSource {
  title: string;
  author?: string;
  year?: number;
  type?: string;
}

interface MolecularProfile {
  molecule: string;
  percentage?: number;
  note?: string;
}

interface ReconstructionAttempt {
  year: number;
  institution?: string;
  method?: string;
  success?: boolean;
  notes?: string;
}

interface SelectedMolecule {
  id: number;
  name: string;
  casNumber?: string | null;
  family?: string | null;
}

interface SelectedPlant {
  id: number;
  name: string;
  latinName?: string | null;
  category?: string | null;
}

export default function GhostVarietyForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Form state
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [commonNames, setCommonNames] = useState<string[]>([]);
  const [newCommonName, setNewCommonName] = useState("");
  const [plantFamily, setPlantFamily] = useState("");
  const [genus, setGenus] = useState("");
  const [species, setSpecies] = useState("");
  const [cultivar, setCultivar] = useState("");
  const [varietyType, setVarietyType] = useState<string>("other");
  const [conservationStatus, setConservationStatus] = useState<string>("unknown");
  const [lastDocumentedYear, setLastDocumentedYear] = useState<number | undefined>();
  const [lastDocumentedLocation, setLastDocumentedLocation] = useState("");
  const [peakCultivationPeriod, setPeakCultivationPeriod] = useState("");
  const [disappearanceCauses, setDisappearanceCauses] = useState<string[]>([]);
  const [olfactiveProfile, setOlfactiveProfile] = useState("");
  const [description, setDescription] = useState("");
  const [historicalSignificance, setHistoricalSignificance] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Historical sources
  const [historicalSources, setHistoricalSources] = useState<HistoricalSource[]>([]);
  const [newSource, setNewSource] = useState<HistoricalSource>({ title: "" });
  
  // Molecular profile
  const [molecularProfile, setMolecularProfile] = useState<MolecularProfile[]>([]);
  const [newMolecule, setNewMolecule] = useState<MolecularProfile>({ molecule: "" });
  
  // Reconstruction attempts
  const [reconstructionAttempts, setReconstructionAttempts] = useState<ReconstructionAttempt[]>([]);
  const [newAttempt, setNewAttempt] = useState<ReconstructionAttempt>({ year: new Date().getFullYear() });
  
  // Linked molecules and plants
  const [selectedMolecules, setSelectedMolecules] = useState<SelectedMolecule[]>([]);
  const [selectedPlants, setSelectedPlants] = useState<SelectedPlant[]>([]);
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [plantSearch, setPlantSearch] = useState("");
  
  // Queries
  const { data: moleculesForLinking } = trpc.ghostVarietyExtended.getMoleculesForLinking.useQuery();
  const { data: plantsForLinking } = trpc.ghostVarietyExtended.getPlantsForLinking.useQuery();
  
  // Mutations
  const createVariety = trpc.ghostVarieties.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Variété créée",
        description: `La variété "${name}" a été ajoutée avec succès.`,
      });
      navigate("/ghost-varieties-explorer");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filtered molecules and plants for search
  const filteredMolecules = useMemo(() => {
    if (!moleculesForLinking || !moleculeSearch) return [];
    const search = moleculeSearch.toLowerCase();
    return moleculesForLinking
      .filter(m => 
        m.name.toLowerCase().includes(search) ||
        m.casNumber?.toLowerCase().includes(search) ||
        m.family?.toLowerCase().includes(search)
      )
      .filter(m => !selectedMolecules.some(s => s.id === m.id))
      .slice(0, 10);
  }, [moleculesForLinking, moleculeSearch, selectedMolecules]);
  
  const filteredPlants = useMemo(() => {
    if (!plantsForLinking || !plantSearch) return [];
    const search = plantSearch.toLowerCase();
    return plantsForLinking
      .filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.latinName?.toLowerCase().includes(search) ||
        p.category?.toLowerCase().includes(search)
      )
      .filter(p => !selectedPlants.some(s => s.id === p.id))
      .slice(0, 10);
  }, [plantsForLinking, plantSearch, selectedPlants]);
  
  // Handlers
  const handleAddCommonName = () => {
    if (newCommonName.trim() && !commonNames.includes(newCommonName.trim())) {
      setCommonNames([...commonNames, newCommonName.trim()]);
      setNewCommonName("");
    }
  };
  
  const handleRemoveCommonName = (name: string) => {
    setCommonNames(commonNames.filter(n => n !== name));
  };
  
  const handleToggleDisappearanceCause = (cause: string) => {
    if (disappearanceCauses.includes(cause)) {
      setDisappearanceCauses(disappearanceCauses.filter(c => c !== cause));
    } else {
      setDisappearanceCauses([...disappearanceCauses, cause]);
    }
  };
  
  const handleAddSource = () => {
    if (newSource.title.trim()) {
      setHistoricalSources([...historicalSources, { ...newSource }]);
      setNewSource({ title: "" });
    }
  };
  
  const handleRemoveSource = (index: number) => {
    setHistoricalSources(historicalSources.filter((_, i) => i !== index));
  };
  
  const handleAddMolecularProfile = () => {
    if (newMolecule.molecule.trim()) {
      setMolecularProfile([...molecularProfile, { ...newMolecule }]);
      setNewMolecule({ molecule: "" });
    }
  };
  
  const handleRemoveMolecularProfile = (index: number) => {
    setMolecularProfile(molecularProfile.filter((_, i) => i !== index));
  };
  
  const handleAddAttempt = () => {
    if (newAttempt.year) {
      setReconstructionAttempts([...reconstructionAttempts, { ...newAttempt }]);
      setNewAttempt({ year: new Date().getFullYear() });
    }
  };
  
  const handleRemoveAttempt = (index: number) => {
    setReconstructionAttempts(reconstructionAttempts.filter((_, i) => i !== index));
  };
  
  const handleSelectMolecule = (molecule: SelectedMolecule) => {
    setSelectedMolecules([...selectedMolecules, molecule]);
    setMoleculeSearch("");
  };
  
  const handleRemoveMolecule = (id: number) => {
    setSelectedMolecules(selectedMolecules.filter(m => m.id !== id));
  };
  
  const handleSelectPlant = (plant: SelectedPlant) => {
    setSelectedPlants([...selectedPlants, plant]);
    setPlantSearch("");
  };
  
  const handleRemovePlant = (id: number) => {
    setSelectedPlants(selectedPlants.filter(p => p.id !== id));
  };
  
  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la variété est requis.",
        variant: "destructive",
      });
      return;
    }
    
    createVariety.mutate({
      name: name.trim(),
      scientificName: scientificName.trim() || undefined,
      commonNames: commonNames.length > 0 ? commonNames : undefined,
      plantFamily: plantFamily.trim() || undefined,
      genus: genus.trim() || undefined,
      species: species.trim() || undefined,
      cultivar: cultivar.trim() || undefined,
      varietyType: varietyType as any,
      conservationStatus: conservationStatus as any,
      lastDocumentedYear: lastDocumentedYear || undefined,
      lastDocumentedLocation: lastDocumentedLocation.trim() || undefined,
      peakCultivationPeriod: peakCultivationPeriod.trim() || undefined,
      disappearanceCauses: disappearanceCauses.length > 0 ? disappearanceCauses : undefined,
      olfactiveProfile: olfactiveProfile.trim() || undefined,
      molecularProfile: molecularProfile.length > 0 ? molecularProfile : undefined,
      reconstructionAttempts: reconstructionAttempts.length > 0 ? reconstructionAttempts : undefined,
      historicalSources: historicalSources.length > 0 ? historicalSources : undefined,
      description: description.trim() || undefined,
      historicalSignificance: historicalSignificance.trim() || undefined,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    });
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour ajouter une variété fantôme.
            </p>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-8 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/ghost-varieties-explorer" className="hover:text-white transition-colors">Variétés fantômes</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Nouvelle variété</span>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Ghost className="h-8 w-8" />
            Ajouter une variété fantôme
          </h1>
          <p className="text-slate-300 mt-2">
            Documentez une variété botanique disparue ou menacée
          </p>
        </div>
      </div>
      
      <div className="container max-w-4xl py-8 px-4">
        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="identity">Identité</TabsTrigger>
            <TabsTrigger value="conservation">Conservation</TabsTrigger>
            <TabsTrigger value="olfactive">Profil olfactif</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="links">Liaisons</TabsTrigger>
          </TabsList>
          
          {/* Tab: Identité */}
          <TabsContent value="identity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Identité botanique
                </CardTitle>
                <CardDescription>
                  Informations de base sur la variété
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la variété *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Rose de Grasse ancienne"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scientificName">Nom scientifique</Label>
                    <Input
                      id="scientificName"
                      value={scientificName}
                      onChange={(e) => setScientificName(e.target.value)}
                      placeholder="Ex: Rosa centifolia var. grassensis"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Noms communs</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCommonName}
                      onChange={(e) => setNewCommonName(e.target.value)}
                      placeholder="Ajouter un nom commun"
                      onKeyDown={(e) => e.key === "Enter" && handleAddCommonName()}
                    />
                    <Button type="button" onClick={handleAddCommonName} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {commonNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commonNames.map((n, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {n}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveCommonName(n)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plantFamily">Famille</Label>
                    <Input
                      id="plantFamily"
                      value={plantFamily}
                      onChange={(e) => setPlantFamily(e.target.value)}
                      placeholder="Ex: Rosaceae"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genus">Genre</Label>
                    <Input
                      id="genus"
                      value={genus}
                      onChange={(e) => setGenus(e.target.value)}
                      placeholder="Ex: Rosa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="species">Espèce</Label>
                    <Input
                      id="species"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      placeholder="Ex: centifolia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cultivar">Cultivar</Label>
                    <Input
                      id="cultivar"
                      value={cultivar}
                      onChange={(e) => setCultivar(e.target.value)}
                      placeholder="Ex: 'Grassensis'"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="varietyType">Type de variété *</Label>
                    <Select value={varietyType} onValueChange={setVarietyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VARIETY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de l'image</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description générale de la variété..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Conservation */}
          <TabsContent value="conservation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Statut de conservation
                </CardTitle>
                <CardDescription>
                  Informations sur la disparition et les tentatives de reconstruction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conservationStatus">Statut de conservation *</Label>
                    <Select value={conservationStatus} onValueChange={setConservationStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSERVATION_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${status.color}`} />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastDocumentedYear">Dernière année documentée</Label>
                    <Input
                      id="lastDocumentedYear"
                      type="number"
                      value={lastDocumentedYear || ""}
                      onChange={(e) => setLastDocumentedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ex: 1920"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastDocumentedLocation">Dernière localisation connue</Label>
                    <Input
                      id="lastDocumentedLocation"
                      value={lastDocumentedLocation}
                      onChange={(e) => setLastDocumentedLocation(e.target.value)}
                      placeholder="Ex: Grasse, France"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peakCultivationPeriod">Période de culture optimale</Label>
                    <Input
                      id="peakCultivationPeriod"
                      value={peakCultivationPeriod}
                      onChange={(e) => setPeakCultivationPeriod(e.target.value)}
                      placeholder="Ex: XVIIIe - XIXe siècle"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Causes de disparition</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_DISAPPEARANCE_CAUSES.map((cause) => (
                      <Badge
                        key={cause}
                        variant={disappearanceCauses.includes(cause) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleDisappearanceCause(cause)}
                      >
                        {disappearanceCauses.includes(cause) && <Check className="h-3 w-3 mr-1" />}
                        {cause}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Tentatives de reconstruction</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      type="number"
                      value={newAttempt.year}
                      onChange={(e) => setNewAttempt({ ...newAttempt, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      placeholder="Année"
                    />
                    <Input
                      value={newAttempt.institution || ""}
                      onChange={(e) => setNewAttempt({ ...newAttempt, institution: e.target.value })}
                      placeholder="Institution"
                    />
                    <Input
                      value={newAttempt.method || ""}
                      onChange={(e) => setNewAttempt({ ...newAttempt, method: e.target.value })}
                      placeholder="Méthode"
                    />
                    <Button type="button" onClick={handleAddAttempt}>
                      <Plus className="h-4 w-4 mr-1" /> Ajouter
                    </Button>
                  </div>
                  {reconstructionAttempts.length > 0 && (
                    <div className="space-y-2">
                      {reconstructionAttempts.map((attempt, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <span className="font-medium">{attempt.year}</span>
                            {attempt.institution && <span className="text-muted-foreground"> — {attempt.institution}</span>}
                            {attempt.method && <span className="text-muted-foreground"> ({attempt.method})</span>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveAttempt(i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="historicalSignificance">Importance historique</Label>
                  <Textarea
                    id="historicalSignificance"
                    value={historicalSignificance}
                    onChange={(e) => setHistoricalSignificance(e.target.value)}
                    placeholder="Décrivez l'importance historique de cette variété..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Profil olfactif */}
          <TabsContent value="olfactive">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  Profil olfactif et moléculaire
                </CardTitle>
                <CardDescription>
                  Caractéristiques aromatiques et composition moléculaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="olfactiveProfile">Profil olfactif</Label>
                  <Textarea
                    id="olfactiveProfile"
                    value={olfactiveProfile}
                    onChange={(e) => setOlfactiveProfile(e.target.value)}
                    placeholder="Décrivez les caractéristiques olfactives de cette variété..."
                    rows={4}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Profil moléculaire</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      value={newMolecule.molecule}
                      onChange={(e) => setNewMolecule({ ...newMolecule, molecule: e.target.value })}
                      placeholder="Nom de la molécule"
                      className="md:col-span-2"
                    />
                    <Input
                      type="number"
                      value={newMolecule.percentage || ""}
                      onChange={(e) => setNewMolecule({ ...newMolecule, percentage: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="% (optionnel)"
                    />
                    <Button type="button" onClick={handleAddMolecularProfile}>
                      <Plus className="h-4 w-4 mr-1" /> Ajouter
                    </Button>
                  </div>
                  {molecularProfile.length > 0 && (
                    <div className="space-y-2">
                      {molecularProfile.map((mol, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <span className="font-medium">{mol.molecule}</span>
                            {mol.percentage && <Badge variant="secondary" className="ml-2">{mol.percentage}%</Badge>}
                            {mol.note && <span className="text-muted-foreground ml-2">— {mol.note}</span>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMolecularProfile(i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes de recherche</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes internes sur cette variété..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Sources */}
          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Sources historiques
                </CardTitle>
                <CardDescription>
                  Références bibliographiques et documentaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      value={newSource.title}
                      onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                      placeholder="Titre de la source *"
                      className="md:col-span-2"
                    />
                    <Input
                      value={newSource.author || ""}
                      onChange={(e) => setNewSource({ ...newSource, author: e.target.value })}
                      placeholder="Auteur"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={newSource.year || ""}
                        onChange={(e) => setNewSource({ ...newSource, year: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="Année"
                        className="w-24"
                      />
                      <Button type="button" onClick={handleAddSource} className="flex-1">
                        <Plus className="h-4 w-4 mr-1" /> Ajouter
                      </Button>
                    </div>
                  </div>
                  
                  {historicalSources.length > 0 && (
                    <div className="space-y-2">
                      {historicalSources.map((source, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <span className="font-medium">{source.title}</span>
                            {source.author && <span className="text-muted-foreground"> — {source.author}</span>}
                            {source.year && <Badge variant="outline" className="ml-2">{source.year}</Badge>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveSource(i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {historicalSources.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune source ajoutée</p>
                      <p className="text-sm">Ajoutez des références bibliographiques pour documenter cette variété</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Liaisons */}
          <TabsContent value="links">
            <div className="space-y-6">
              {/* Molécules liées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Molécules liées
                  </CardTitle>
                  <CardDescription>
                    Associez des molécules de la base de données à cette variété
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={moleculeSearch}
                      onChange={(e) => setMoleculeSearch(e.target.value)}
                      placeholder="Rechercher une molécule..."
                      className="pl-10"
                    />
                    {filteredMolecules.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredMolecules.map((mol) => (
                          <div
                            key={mol.id}
                            className="p-3 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectMolecule(mol)}
                          >
                            <div className="font-medium">{mol.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {mol.casNumber && <span>CAS: {mol.casNumber}</span>}
                              {mol.family && <span className="ml-2">• {mol.family}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedMolecules.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedMolecules.map((mol) => (
                        <Badge key={mol.id} variant="secondary" className="gap-1 py-1">
                          <FlaskConical className="h-3 w-3" />
                          {mol.name}
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            onClick={() => handleRemoveMolecule(mol.id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {selectedMolecules.length === 0 && !moleculeSearch && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Recherchez et sélectionnez des molécules à associer
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Plantes liées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Plantes liées
                  </CardTitle>
                  <CardDescription>
                    Associez des plantes de la base de données à cette variété
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={plantSearch}
                      onChange={(e) => setPlantSearch(e.target.value)}
                      placeholder="Rechercher une plante..."
                      className="pl-10"
                    />
                    {filteredPlants.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredPlants.map((plant) => (
                          <div
                            key={plant.id}
                            className="p-3 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectPlant(plant)}
                          >
                            <div className="font-medium">{plant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {plant.latinName && <span className="italic">{plant.latinName}</span>}
                              {plant.category && <span className="ml-2">• {plant.category}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedPlants.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPlants.map((plant) => (
                        <Badge key={plant.id} variant="secondary" className="gap-1 py-1">
                          <Leaf className="h-3 w-3" />
                          {plant.name}
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            onClick={() => handleRemovePlant(plant.id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {selectedPlants.length === 0 && !plantSearch && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Recherchez et sélectionnez des plantes à associer
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href="/ghost-varieties-explorer">
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Link>
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createVariety.isPending || !name.trim()}
          >
            {createVariety.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Créer la variété
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
