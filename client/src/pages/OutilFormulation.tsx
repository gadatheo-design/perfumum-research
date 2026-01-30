import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  FlaskConical, 
  Search,
  Plus,
  X,
  Download,
  Sparkles,
  Zap,
  Network,
  Shield,
  Shuffle,
  Eye,
  ChevronRight,
  Lightbulb,
  Beaker,
  FileText,
  Copy,
  Check,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SynergySuggestions } from "@/components/SynergySuggestions";

// Types
type FormulationType = 'parfum' | 'encens' | 'tabac_blend' | 'cannabis_blend' | 'hybrid';
type Difficulty = 'débutant' | 'intermédiaire' | 'avancé';

const formulationTypeLabels: Record<FormulationType, { label: string; icon: React.ReactNode; color: string }> = {
  parfum: { label: "Parfum", icon: <FlaskConical className="h-4 w-4" />, color: "bg-purple-500/10 text-purple-600" },
  encens: { label: "Encens", icon: <Sparkles className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-600" },
  tabac_blend: { label: "Mélange Tabac", icon: <Beaker className="h-4 w-4" />, color: "bg-orange-500/10 text-orange-600" },
  cannabis_blend: { label: "Mélange Cannabis", icon: <Beaker className="h-4 w-4" />, color: "bg-green-500/10 text-green-600" },
  hybrid: { label: "Hybride", icon: <Network className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-600" },
};

const difficultyLabels: Record<Difficulty, { label: string; color: string }> = {
  'débutant': { label: "Débutant", color: "bg-green-100 text-green-700" },
  'intermédiaire': { label: "Intermédiaire", color: "bg-amber-100 text-amber-700" },
  'avancé': { label: "Avancé", color: "bg-red-100 text-red-700" },
};

interface SelectedMolecule {
  id: number;
  name: string;
  percentage: number;
  role: 'base' | 'modifier' | 'accent';
}

// Type pour le profil radar cible
interface TargetRadarProfile {
  intensity?: number;
  freshness?: number;
  warmth?: number;
  sweetness?: number;
  spiciness?: number;
  earthiness?: number;
}

export default function OutilFormulation() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBaseMolecule, setSelectedBaseMolecule] = useState<number | null>(null);
  const [formulationType, setFormulationType] = useState<FormulationType>("parfum");
  const [selectedMolecules, setSelectedMolecules] = useState<SelectedMolecule[]>([]);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [targetRadarProfile, setTargetRadarProfile] = useState<TargetRadarProfile>({
    intensity: 50,
    freshness: 50,
    warmth: 50,
    sweetness: 50,
    spiciness: 50,
    earthiness: 50,
  });

  // Fetch data
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  
  // Synergy suggestions for selected molecules
  const selectedMoleculeIds = useMemo(() => selectedMolecules.map(m => m.id), [selectedMolecules]);
  const { data: synergySuggestions } = trpc.synergies.getSuggestionsForMolecules.useQuery(
    selectedMoleculeIds,
    { enabled: selectedMoleculeIds.length > 0 }
  );
  const { data: suggestions, isLoading: loadingSuggestions } = trpc.formulationTool.generateSuggestions.useQuery(
    selectedBaseMolecule || 0,
    { enabled: !!selectedBaseMolecule }
  );
  const { data: savedFormulations, isLoading: loadingSaved } = trpc.formulationTool.list.useQuery();
  const { data: entourageRules } = trpc.entourageRules.list.useQuery();

  // Filter molecules by search
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    if (!searchQuery) return molecules.slice(0, 50);
    const query = searchQuery.toLowerCase();
    return molecules.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.family?.toLowerCase().includes(query) ||
      m.olfactiveProfile?.toLowerCase().includes(query)
    ).slice(0, 50);
  }, [molecules, searchQuery]);

  // Calculate total percentage
  const totalPercentage = useMemo(() => {
    return selectedMolecules.reduce((sum, m) => sum + m.percentage, 0);
  }, [selectedMolecules]);

  // Add molecule to formula
  const addMolecule = (molecule: { id: number; name: string }, role: 'base' | 'modifier' | 'accent' = 'modifier') => {
    if (selectedMolecules.find(m => m.id === molecule.id)) {
      toast({
        title: "Molécule déjà ajoutée",
        description: `${molecule.name} est déjà dans votre formule.`,
        variant: "destructive"
      });
      return;
    }
    
    const defaultPercentage = role === 'base' ? 30 : role === 'modifier' ? 15 : 5;
    setSelectedMolecules(prev => [...prev, {
      id: molecule.id,
      name: molecule.name,
      percentage: defaultPercentage,
      role
    }]);
  };

  // Remove molecule from formula
  const removeMolecule = (id: number) => {
    setSelectedMolecules(prev => prev.filter(m => m.id !== id));
  };

  // Update molecule percentage
  const updatePercentage = (id: number, percentage: number) => {
    setSelectedMolecules(prev => prev.map(m => 
      m.id === id ? { ...m, percentage } : m
    ));
  };

  // Copy formula to clipboard
  const copyFormula = () => {
    const formulaText = selectedMolecules
      .map(m => `${m.name}: ${m.percentage}%`)
      .join('\n');
    
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
    
    toast({
      title: "Formule copiée",
      description: "La formule a été copiée dans le presse-papiers."
    });
  };

  // Get compatibility color
  const getCompatibilityColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50";
    if (score >= 40) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="container py-8">
          <Link href="/interactions-tabac-cannabis">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux interactions
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <FlaskConical className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Outil de Formulation</h1>
              <p className="text-white/70 mt-1">
                Créez des formules basées sur les synergies documentées
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{molecules?.length || 0}</div>
              <div className="text-sm text-white/70">Molécules</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{savedFormulations?.length || 0}</div>
              <div className="text-sm text-white/70">Formules sauvées</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{entourageRules?.length || 0}</div>
              <div className="text-sm text-white/70">Règles de synergie</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-white/70">Types de formulation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Créer</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Sauvegardées</span>
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Molecule Selection */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bibliothèque de molécules</CardTitle>
                    <CardDescription>
                      Recherchez et ajoutez des molécules à votre formule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une molécule..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Molecule List */}
                    <ScrollArea className="h-[400px]">
                      {loadingMolecules ? (
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2 pr-4">
                          {filteredMolecules.map(molecule => (
                            <div
                              key={molecule.id}
                              className="p-3 rounded-lg border hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{molecule.name}</div>
                                  {molecule.family && (
                                    <div className="text-xs text-muted-foreground">{molecule.family}</div>
                                  )}
                                  {molecule.olfactiveProfile && (
                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {molecule.olfactiveProfile}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addMolecule(molecule)}
                                  disabled={selectedMolecules.some(m => m.id === molecule.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {/* Target Radar Profile */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Profil Radar Cible
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Définissez le profil olfactif souhaité pour filtrer les synergies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: 'intensity', label: 'Intensité', color: 'bg-red-500' },
                      { key: 'freshness', label: 'Fraîcheur', color: 'bg-cyan-500' },
                      { key: 'warmth', label: 'Chaleur', color: 'bg-orange-500' },
                      { key: 'sweetness', label: 'Douceur', color: 'bg-pink-500' },
                      { key: 'spiciness', label: 'Épicé', color: 'bg-amber-600' },
                      { key: 'earthiness', label: 'Terreux', color: 'bg-emerald-700' },
                    ].map(({ key, label, color }) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{targetRadarProfile[key as keyof TargetRadarProfile]}%</span>
                        </div>
                        <Slider
                          value={[targetRadarProfile[key as keyof TargetRadarProfile] || 50]}
                          onValueChange={([value]) => setTargetRadarProfile(prev => ({ ...prev, [key]: value }))}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Formula Builder */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Votre Formule</CardTitle>
                        <CardDescription>
                          Ajustez les proportions de chaque molécule
                        </CardDescription>
                      </div>
                      <Select value={formulationType} onValueChange={(v) => setFormulationType(v as FormulationType)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(formulationTypeLabels).map(([key, { label, icon }]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                {icon}
                                {label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedMolecules.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-center border-2 border-dashed rounded-lg">
                        <div>
                          <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Commencez votre formule</h3>
                          <p className="text-muted-foreground max-w-md">
                            Sélectionnez des molécules dans la bibliothèque pour créer votre formule personnalisée.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total</span>
                            <span className={totalPercentage > 100 ? "text-red-500" : ""}>
                              {totalPercentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                totalPercentage > 100 ? 'bg-red-500' : 
                                totalPercentage === 100 ? 'bg-green-500' : 'bg-primary'
                              }`}
                              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Molecules list */}
                        <div className="space-y-3">
                          {selectedMolecules.map(molecule => (
                            <div 
                              key={molecule.id}
                              className="p-4 rounded-lg border bg-card"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{molecule.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {molecule.role === 'base' ? 'Base' : 
                                     molecule.role === 'modifier' ? 'Modificateur' : 'Accent'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium w-12 text-right">
                                    {molecule.percentage}%
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMolecule(molecule.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <Slider
                                value={[molecule.percentage]}
                                onValueChange={([value]) => updatePercentage(molecule.id, value)}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            onClick={copyFormula}
                            className="gap-2"
                          >
                            {copiedFormula ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            {copiedFormula ? "Copié" : "Copier"}
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Exporter
                          </Button>
                          <Button className="gap-2 ml-auto">
                            <FileText className="h-4 w-4" />
                            Sauvegarder
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Synergy Suggestions Panel */}
                {selectedMolecules.length > 0 && (
                  <SynergySuggestions
                    selectedMoleculeIds={selectedMoleculeIds}
                    targetRadarProfile={targetRadarProfile}
                    onAddMolecule={(moleculeId) => {
                      const mol = molecules?.find(m => m.id === moleculeId);
                      if (mol) {
                        addMolecule({ id: mol.id, name: mol.name }, 'modifier');
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggestions basées sur les synergies</CardTitle>
                <CardDescription>
                  Sélectionnez une molécule de base pour obtenir des suggestions de combinaisons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Base molecule selection */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Molécule de base</label>
                    <Select 
                      value={selectedBaseMolecule?.toString() || ""} 
                      onValueChange={(v) => setSelectedBaseMolecule(parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une molécule..." />
                      </SelectTrigger>
                      <SelectContent>
                        {molecules?.slice(0, 100).map(mol => (
                          <SelectItem key={mol.id} value={mol.id.toString()}>
                            {mol.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Suggestions */}
                {selectedBaseMolecule && (
                  <div className="space-y-4">
                    {loadingSuggestions ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : suggestions?.suggestions && suggestions.suggestions.length > 0 ? (
                      <>
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <div className="font-medium mb-1">Molécule de base</div>
                          <div className="text-lg">{suggestions.baseMolecule?.name}</div>
                          {suggestions.baseMolecule?.olfactiveProfile && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {suggestions.baseMolecule.olfactiveProfile}
                            </p>
                          )}
                        </div>

                        <h4 className="font-medium">Molécules suggérées ({suggestions.suggestions.length})</h4>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {suggestions.suggestions.map((suggestion, i) => (
                            <Card key={i} className="overflow-hidden">
                              <div className={`h-1 ${getCompatibilityColor(suggestion.compatibilityScore)}`} />
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="font-medium">{suggestion.molecule.name}</div>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {suggestion.synergyType}
                                    </Badge>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-sm font-medium ${getCompatibilityColor(suggestion.compatibilityScore)}`}>
                                    {suggestion.compatibilityScore}%
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.reason}
                                </p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="mt-2 w-full"
                                  onClick={() => addMolecule(suggestion.molecule)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Ajouter à la formule
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Aucune suggestion disponible</h3>
                        <p className="text-muted-foreground">
                          Les suggestions seront disponibles une fois les données de synergie importées.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!selectedBaseMolecule && (
                  <div className="text-center py-12">
                    <Lightbulb className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sélectionnez une molécule de base</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choisissez une molécule pour obtenir des suggestions de combinaisons 
                      basées sur les synergies documentées (effet entourage, potentialisation, etc.)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Formulations Tab */}
          <TabsContent value="saved" className="space-y-6">
            {loadingSaved ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : savedFormulations?.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune formule sauvegardée</h3>
                <p className="text-muted-foreground mb-4">
                  Créez et sauvegardez vos formules pour les retrouver ici.
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une formule
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedFormulations?.map(formulation => {
                  const typeInfo = formulationTypeLabels[formulation.formulationType as FormulationType];
                  const difficultyInfo = difficultyLabels[formulation.difficulty as Difficulty];
                  
                  return (
                    <Card key={formulation.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{formulation.name}</CardTitle>
                            <CardDescription>{formulation.suggestionId}</CardDescription>
                          </div>
                          <Badge variant="outline" className={typeInfo?.color}>
                            {typeInfo?.icon}
                            <span className="ml-1">{typeInfo?.label}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={difficultyInfo?.color}>
                            {difficultyInfo?.label}
                          </Badge>
                          {formulation.baseMoleculeName && (
                            <Badge variant="secondary">
                              Base: {formulation.baseMoleculeName}
                            </Badge>
                          )}
                        </div>
                        
                        {formulation.expectedOlfactiveProfile && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {formulation.expectedOlfactiveProfile}
                          </p>
                        )}
                        
                        {formulation.suggestedMolecules && Array.isArray(formulation.suggestedMolecules) && (
                          <div className="flex flex-wrap gap-1">
                            {(formulation.suggestedMolecules as Array<{moleculeName: string}>).slice(0, 3).map((mol, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {mol.moleculeName}
                              </Badge>
                            ))}
                            {(formulation.suggestedMolecules as Array<{moleculeName: string}>).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(formulation.suggestedMolecules as Array<{moleculeName: string}>).length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <Button variant="ghost" size="sm" className="w-full gap-1">
                          Voir les détails <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Link href="/interactions-tabac-cannabis">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Network className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Interactions Tabac-Cannabis</h3>
                  <p className="text-sm text-muted-foreground">Synergies moléculaires documentées</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/comparaison-terpenes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Comparaison Terpénique</h3>
                  <p className="text-sm text-muted-foreground">Graphique radar des profils</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
