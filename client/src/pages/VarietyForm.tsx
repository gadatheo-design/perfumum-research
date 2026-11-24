import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Leaf,
  MapPin,
  Beaker,
  AlertTriangle,
  Info,
  Loader2,
  CheckCircle2,
  FlaskConical,
  Dna,
  TreeDeciduous
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
interface DominantMolecule {
  molecule: string;
  percentage: number;
  role: string;
}

interface OlfactiveNotes {
  top: string[];
  heart: string[];
  base: string[];
}

interface Morphology {
  height?: string;
  leafShape?: string;
  flowerColor?: string;
  growthHabit?: string;
}

// Configuration
const varietyTypes = [
  { value: "landrace", label: "Landrace", description: "Variété locale traditionnelle", icon: <Leaf className="w-4 h-4" /> },
  { value: "cultivar", label: "Cultivar", description: "Variété cultivée sélectionnée", icon: <FlaskConical className="w-4 h-4" /> },
  { value: "chemotype", label: "Chémotype", description: "Profil moléculaire distinct", icon: <Beaker className="w-4 h-4" /> },
  { value: "hybrid", label: "Hybride", description: "Croisement de variétés", icon: <Dna className="w-4 h-4" /> },
  { value: "clone", label: "Clone", description: "Clone végétatif", icon: <Dna className="w-4 h-4" /> },
  { value: "wild", label: "Sauvage", description: "Forme sauvage", icon: <TreeDeciduous className="w-4 h-4" /> },
  { value: "other", label: "Autre", description: "Autre type", icon: <Leaf className="w-4 h-4" /> },
];

const conservationStatuses = [
  { value: "critical", label: "Critique", color: "text-red-400", description: "En danger critique d'extinction" },
  { value: "endangered", label: "En danger", color: "text-orange-400", description: "Risque élevé d'extinction" },
  { value: "vulnerable", label: "Vulnérable", color: "text-amber-400", description: "Risque d'extinction à moyen terme" },
  { value: "near_threatened", label: "Quasi menacé", color: "text-yellow-400", description: "Proche du seuil de vulnérabilité" },
  { value: "stable", label: "Stable", color: "text-green-400", description: "Population stable" },
  { value: "data_deficient", label: "Données insuffisantes", color: "text-gray-400", description: "Informations insuffisantes" },
  { value: "unknown", label: "Inconnu", color: "text-slate-400", description: "Statut non évalué" },
];

const commercialAvailabilities = [
  { value: "widely_available", label: "Largement disponible" },
  { value: "limited", label: "Disponibilité limitée" },
  { value: "rare", label: "Rare" },
  { value: "research_only", label: "Recherche uniquement" },
  { value: "extinct", label: "Éteint" },
  { value: "unknown", label: "Inconnu" },
];

// Common terpenes for suggestions
const commonTerpenes = [
  "Myrcène", "Limonène", "Pinène", "Caryophyllène", "Linalol",
  "Terpinolène", "Humulène", "Ocimène", "Bisabolol", "Géraniol",
  "Nérolidol", "Camphène", "Eucalyptol", "Farnésène", "Valencène"
];

export default function VarietyForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [plantId, setPlantId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [latinName, setLatinName] = useState("");
  const [varietyType, setVarietyType] = useState<string>("landrace");
  const [breeder, setBreeder] = useState("");
  const [yearRegistered, setYearRegistered] = useState<string>("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [distinctiveFeatures, setDistinctiveFeatures] = useState("");
  const [olfactiveDescription, setOlfactiveDescription] = useState("");
  const [conservationStatus, setConservationStatus] = useState<string>("unknown");
  const [conservationNotes, setConservationNotes] = useState("");
  const [commercialAvailability, setCommercialAvailability] = useState<string>("unknown");
  const [notes, setNotes] = useState("");
  
  // Complex state
  const [dominantMolecules, setDominantMolecules] = useState<DominantMolecule[]>([]);
  const [newMolecule, setNewMolecule] = useState({ molecule: "", percentage: 0, role: "dominant" });
  const [threatFactors, setThreatFactors] = useState<string[]>([]);
  const [newThreat, setNewThreat] = useState("");
  const [olfactiveNotes, setOlfactiveNotes] = useState<OlfactiveNotes>({ top: [], heart: [], base: [] });
  const [newNote, setNewNote] = useState({ category: "top", value: "" });
  const [morphology, setMorphology] = useState<Morphology>({});
  
  // Queries
  const { data: plants, isLoading: plantsLoading } = trpc.plantVarieties.getPlants.useQuery();
  const createMutation = trpc.plantVarieties.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Variété créée",
        description: `La variété "${name}" a été créée avec succès.`,
      });
      navigate("/plantes-varietes");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const addMolecule = () => {
    if (newMolecule.molecule.trim()) {
      setDominantMolecules([...dominantMolecules, { ...newMolecule }]);
      setNewMolecule({ molecule: "", percentage: 0, role: "secondary" });
    }
  };

  const removeMolecule = (index: number) => {
    setDominantMolecules(dominantMolecules.filter((_, i) => i !== index));
  };

  const addThreat = () => {
    if (newThreat.trim() && !threatFactors.includes(newThreat.trim())) {
      setThreatFactors([...threatFactors, newThreat.trim()]);
      setNewThreat("");
    }
  };

  const removeThreat = (index: number) => {
    setThreatFactors(threatFactors.filter((_, i) => i !== index));
  };

  const addOlfactiveNote = () => {
    if (newNote.value.trim()) {
      const category = newNote.category as keyof OlfactiveNotes;
      if (!olfactiveNotes[category].includes(newNote.value.trim())) {
        setOlfactiveNotes({
          ...olfactiveNotes,
          [category]: [...olfactiveNotes[category], newNote.value.trim()]
        });
      }
      setNewNote({ ...newNote, value: "" });
    }
  };

  const removeOlfactiveNote = (category: keyof OlfactiveNotes, index: number) => {
    setOlfactiveNotes({
      ...olfactiveNotes,
      [category]: olfactiveNotes[category].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plantId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une plante parente.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la variété est requis.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      plantId,
      name: name.trim(),
      latinName: latinName.trim() || undefined,
      varietyType: varietyType as any,
      breeder: breeder.trim() || undefined,
      yearRegistered: yearRegistered ? parseInt(yearRegistered) : undefined,
      countryOfOrigin: countryOfOrigin.trim() || undefined,
      distinctiveFeatures: distinctiveFeatures.trim() || undefined,
      dominantMolecules: dominantMolecules.length > 0 ? dominantMolecules : undefined,
      olfactiveDescription: olfactiveDescription.trim() || undefined,
      olfactiveNotes: (olfactiveNotes.top.length > 0 || olfactiveNotes.heart.length > 0 || olfactiveNotes.base.length > 0) 
        ? olfactiveNotes 
        : undefined,
      morphology: Object.keys(morphology).length > 0 ? morphology : undefined,
      conservationStatus: conservationStatus as any,
      conservationNotes: conservationNotes.trim() || undefined,
      threatFactors: threatFactors.length > 0 ? threatFactors : undefined,
      commercialAvailability: commercialAvailability as any,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/plantes-varietes")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouvelle Variété</h1>
            <p className="text-muted-foreground mt-1">
              Ajouter une nouvelle variété de plante à la base de données
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Informations de base
              </CardTitle>
              <CardDescription>
                Identifiez la variété et sa plante parente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plante parente */}
                <div className="space-y-2">
                  <Label htmlFor="plant" className="flex items-center gap-2">
                    Plante parente <span className="text-red-500">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sélectionnez l'espèce à laquelle appartient cette variété</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select value={plantId?.toString() || ""} onValueChange={(v) => setPlantId(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une plante..." />
                    </SelectTrigger>
                    <SelectContent>
                      {plantsLoading ? (
                        <SelectItem value="loading" disabled>Chargement...</SelectItem>
                      ) : plants?.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id.toString()}>
                          {plant.name} {plant.latinName && `(${plant.latinName})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type de variété */}
                <div className="space-y-2">
                  <Label htmlFor="varietyType" className="flex items-center gap-2">
                    Type de variété <span className="text-red-500">*</span>
                  </Label>
                  <Select value={varietyType} onValueChange={setVarietyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {varietyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">— {type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nom de la variété <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Acapulco Gold, Virginia Flue-Cured..."
                    required
                  />
                </div>

                {/* Nom latin */}
                <div className="space-y-2">
                  <Label htmlFor="latinName">Nom latin</Label>
                  <Input
                    id="latinName"
                    value={latinName}
                    onChange={(e) => setLatinName(e.target.value)}
                    placeholder="Ex: Cannabis sativa var. indica"
                    className="italic"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Origine et sélection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Origine et sélection
              </CardTitle>
              <CardDescription>
                Informations sur l'origine géographique et la sélection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Pays d'origine</Label>
                  <Input
                    id="country"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    placeholder="Ex: Afghanistan, Colombie..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breeder">Obtenteur / Sélectionneur</Label>
                  <Input
                    id="breeder"
                    value={breeder}
                    onChange={(e) => setBreeder(e.target.value)}
                    placeholder="Ex: Nom de l'obtenteur"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Année d'enregistrement</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={yearRegistered}
                    onChange={(e) => setYearRegistered(e.target.value)}
                    placeholder="Ex: 1970"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Caractéristiques distinctives</Label>
                <Textarea
                  id="features"
                  value={distinctiveFeatures}
                  onChange={(e) => setDistinctiveFeatures(e.target.value)}
                  placeholder="Décrivez ce qui distingue cette variété des autres..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profil terpénique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-primary" />
                Profil terpénique
              </CardTitle>
              <CardDescription>
                Molécules dominantes et description olfactive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Molécules dominantes */}
              <div className="space-y-4">
                <Label>Terpènes dominants</Label>
                
                {/* Liste des molécules ajoutées */}
                {dominantMolecules.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dominantMolecules.map((mol, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-2 py-1.5 px-3"
                      >
                        <span className="font-medium">{mol.molecule}</span>
                        {mol.percentage > 0 && (
                          <span className="text-xs text-muted-foreground">({mol.percentage}%)</span>
                        )}
                        <span className="text-xs text-primary">{mol.role}</span>
                        <button
                          type="button"
                          onClick={() => removeMolecule(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Formulaire d'ajout */}
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <Label className="text-xs">Molécule</Label>
                    <Input
                      value={newMolecule.molecule}
                      onChange={(e) => setNewMolecule({ ...newMolecule, molecule: e.target.value })}
                      placeholder="Ex: Myrcène, Limonène..."
                      list="terpene-suggestions"
                    />
                    <datalist id="terpene-suggestions">
                      {commonTerpenes.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label className="text-xs">% (optionnel)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newMolecule.percentage || ""}
                      onChange={(e) => setNewMolecule({ ...newMolecule, percentage: parseFloat(e.target.value) || 0 })}
                      placeholder="0-100"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label className="text-xs">Rôle</Label>
                    <Select 
                      value={newMolecule.role} 
                      onValueChange={(v) => setNewMolecule({ ...newMolecule, role: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dominant">Dominant</SelectItem>
                        <SelectItem value="secondary">Secondaire</SelectItem>
                        <SelectItem value="trace">Trace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={addMolecule}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Description olfactive */}
              <div className="space-y-2">
                <Label htmlFor="olfactive">Description olfactive</Label>
                <Textarea
                  id="olfactive"
                  value={olfactiveDescription}
                  onChange={(e) => setOlfactiveDescription(e.target.value)}
                  placeholder="Décrivez le profil olfactif de cette variété..."
                  rows={3}
                />
              </div>

              {/* Notes olfactives par pyramide */}
              <div className="space-y-4">
                <Label>Notes olfactives (pyramide)</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Notes de tête */}
                  <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                    <div className="text-sm font-medium text-primary">Notes de tête</div>
                    <div className="flex flex-wrap gap-1 min-h-[32px]">
                      {olfactiveNotes.top.map((note, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {note}
                          <button type="button" onClick={() => removeOlfactiveNote("top", i)} className="ml-1">
                            <X className="w-2 h-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes de cœur */}
                  <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                    <div className="text-sm font-medium text-amber-400">Notes de cœur</div>
                    <div className="flex flex-wrap gap-1 min-h-[32px]">
                      {olfactiveNotes.heart.map((note, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {note}
                          <button type="button" onClick={() => removeOlfactiveNote("heart", i)} className="ml-1">
                            <X className="w-2 h-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes de fond */}
                  <div className="space-y-2 p-4 rounded-lg bg-muted/30">
                    <div className="text-sm font-medium text-orange-400">Notes de fond</div>
                    <div className="flex flex-wrap gap-1 min-h-[32px]">
                      {olfactiveNotes.base.map((note, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {note}
                          <button type="button" onClick={() => removeOlfactiveNote("base", i)} className="ml-1">
                            <X className="w-2 h-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ajout de note */}
                <div className="flex gap-3 items-end">
                  <div className="w-32 space-y-2">
                    <Label className="text-xs">Catégorie</Label>
                    <Select 
                      value={newNote.category} 
                      onValueChange={(v) => setNewNote({ ...newNote, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Tête</SelectItem>
                        <SelectItem value="heart">Cœur</SelectItem>
                        <SelectItem value="base">Fond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Note</Label>
                    <Input
                      value={newNote.value}
                      onChange={(e) => setNewNote({ ...newNote, value: e.target.value })}
                      placeholder="Ex: Agrumes, Floral, Boisé..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOlfactiveNote())}
                    />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={addOlfactiveNote}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conservation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Statut de conservation
              </CardTitle>
              <CardDescription>
                Évaluez le risque d'extinction et les menaces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Statut de conservation</Label>
                  <Select value={conservationStatus} onValueChange={setConservationStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conservationStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <span className={status.color}>●</span>
                            <span>{status.label}</span>
                            <span className="text-xs text-muted-foreground">— {status.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Disponibilité commerciale</Label>
                  <Select value={commercialAvailability} onValueChange={setCommercialAvailability}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {commercialAvailabilities.map((avail) => (
                        <SelectItem key={avail.value} value={avail.value}>
                          {avail.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Facteurs de menace */}
              <div className="space-y-4">
                <Label>Facteurs de menace</Label>
                
                {threatFactors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {threatFactors.map((threat, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-2">
                        {threat}
                        <button type="button" onClick={() => removeThreat(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Input
                    value={newThreat}
                    onChange={(e) => setNewThreat(e.target.value)}
                    placeholder="Ex: Hybridation, Perte d'habitat, Changement climatique..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addThreat())}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addThreat}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conservationNotes">Notes de conservation</Label>
                <Textarea
                  id="conservationNotes"
                  value={conservationNotes}
                  onChange={(e) => setConservationNotes(e.target.value)}
                  placeholder="Informations supplémentaires sur le statut de conservation..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Notes et remarques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes supplémentaires, références, observations..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/plantes-varietes")}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || !plantId || !name.trim()}
              className="min-w-[150px]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Créer la variété
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
