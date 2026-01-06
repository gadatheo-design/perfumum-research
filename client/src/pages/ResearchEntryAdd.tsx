import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Save,
  FileText,
  Lightbulb,
  BookOpen,
  Beaker,
  Eye,
  Star,
  Pencil,
  Brain,
  Leaf,
  Heart,
  Archive,
  Bot,
  Pin,
  Globe,
  Lock,
  Calendar,
  Tag
} from "lucide-react";

// Types d'entrées avec icônes et descriptions
const entryTypeOptions = [
  { value: "note", label: "Note", icon: <FileText className="h-4 w-4" />, description: "Note de recherche simple" },
  { value: "synthesis", label: "Synthèse", icon: <BookOpen className="h-4 w-4" />, description: "Synthèse de plusieurs sources" },
  { value: "experiment", label: "Expérience", icon: <Beaker className="h-4 w-4" />, description: "Compte-rendu d'expérience" },
  { value: "observation", label: "Observation", icon: <Eye className="h-4 w-4" />, description: "Observation terrain ou laboratoire" },
  { value: "hypothesis", label: "Hypothèse", icon: <Lightbulb className="h-4 w-4" />, description: "Hypothèse à vérifier" },
  { value: "discovery", label: "Découverte", icon: <Star className="h-4 w-4" />, description: "Découverte importante" },
  { value: "review", label: "Revue", icon: <BookOpen className="h-4 w-4" />, description: "Revue de littérature" },
  { value: "methodology", label: "Méthodologie", icon: <Pencil className="h-4 w-4" />, description: "Description méthodologique" },
  { value: "protocol", label: "Protocole", icon: <FileText className="h-4 w-4" />, description: "Protocole expérimental" },
  { value: "analysis", label: "Analyse", icon: <Beaker className="h-4 w-4" />, description: "Analyse de données" },
];

// Statuts d'entrée
const statusOptions = [
  { value: "draft", label: "Brouillon", color: "bg-gray-500/20 text-gray-400" },
  { value: "in_progress", label: "En cours", color: "bg-blue-500/20 text-blue-400" },
  { value: "completed", label: "Terminé", color: "bg-green-500/20 text-green-400" },
  { value: "archived", label: "Archivé", color: "bg-amber-500/20 text-amber-400" },
];

// Niveaux d'importance
const importanceOptions = [
  { value: "low", label: "Faible", color: "text-gray-400" },
  { value: "medium", label: "Moyenne", color: "text-blue-400" },
  { value: "high", label: "Haute", color: "text-amber-400" },
  { value: "critical", label: "Critique", color: "text-red-400" },
];

// Mapping des icônes par code d'axe
const axisIcons: Record<string, React.ReactNode> = {
  AX1: <Brain className="h-5 w-5" />,
  AX2: <Leaf className="h-5 w-5" />,
  AX3: <Heart className="h-5 w-5" />,
  AX4: <Archive className="h-5 w-5" />,
  AX5: <Bot className="h-5 w-5" />,
};

// Fonction pour générer un slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
};

export default function ResearchEntryAdd() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const preselectedAxis = searchParams.get("axis") || "";
  
  const utils = trpc.useUtils();
  
  // Récupérer les axes de recherche
  const { data: axes } = trpc.researchAxes.list.useQuery();
  const { data: tags } = trpc.researchTags.list.useQuery({});
  const { data: sources } = trpc.bibliography.list.useQuery({});
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    entryType: "note",
    status: "draft",
    primaryAxisId: 0,
    secondaryAxisIds: [] as number[],
    importance: "medium",
    isPublic: false,
    isPinned: false,
    researchDate: new Date().toISOString().split("T")[0],
    tagIds: [] as number[],
    sourceIds: [] as number[],
  });
  
  // Mettre à jour le slug automatiquement
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title]);
  
  // Présélectionner l'axe si fourni dans l'URL
  useEffect(() => {
    if (preselectedAxis && axes) {
      const axis = axes.find(a => a.code === preselectedAxis);
      if (axis) {
        setFormData(prev => ({ ...prev, primaryAxisId: axis.id }));
      }
    }
  }, [preselectedAxis, axes]);
  
  // Mutation pour créer une entrée
  const createMutation = trpc.researchEntries.create.useMutation({
    onSuccess: (data) => {
      toast.success("Entrée créée avec succès !");
      utils.researchEntries.list.invalidate();
      
      // Rediriger vers l'axe de recherche
      const axis = axes?.find(a => a.id === formData.primaryAxisId);
      if (axis) {
        setLocation(`/axes-recherche/${axis.code.toLowerCase()}`);
      } else {
        setLocation("/axes-recherche");
      }
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
  
  // Gestion des axes secondaires
  const toggleSecondaryAxis = (axisId: number) => {
    if (axisId === formData.primaryAxisId) return;
    setFormData(prev => ({
      ...prev,
      secondaryAxisIds: prev.secondaryAxisIds.includes(axisId)
        ? prev.secondaryAxisIds.filter(id => id !== axisId)
        : [...prev.secondaryAxisIds, axisId],
    }));
  };
  
  // Gestion des tags
  const toggleTag = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };
  
  // Gestion des sources
  const toggleSource = (sourceId: number) => {
    setFormData(prev => ({
      ...prev,
      sourceIds: prev.sourceIds.includes(sourceId)
        ? prev.sourceIds.filter(id => id !== sourceId)
        : [...prev.sourceIds, sourceId],
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }
    
    if (!formData.primaryAxisId) {
      toast.error("Veuillez sélectionner un axe de recherche principal");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("Le contenu est obligatoire");
      return;
    }
    
    // Préparer les données
    const submitData = {
      title: formData.title.trim(),
      slug: formData.slug || generateSlug(formData.title),
      summary: formData.summary.trim() || undefined,
      content: formData.content.trim(),
      entryType: formData.entryType,
      status: formData.status,
      primaryAxisId: formData.primaryAxisId,
      importance: formData.importance,
      isPublic: formData.isPublic,
      isPinned: formData.isPinned,
      researchDate: formData.researchDate ? new Date(formData.researchDate) : undefined,
      tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
      sourceIds: formData.sourceIds.length > 0 ? formData.sourceIds : undefined,
      secondaryAxisIds: formData.secondaryAxisIds.length > 0 ? formData.secondaryAxisIds : undefined,
    };
    
    createMutation.mutate(submitData);
  };
  
  // Trouver l'axe sélectionné pour l'affichage
  const selectedAxis = axes?.find(a => a.id === formData.primaryAxisId);

  return (
    <div className="container py-8 max-w-4xl">
      {/* En-tête */}
      <div className="mb-8">
        <Link href={selectedAxis ? `/axes-recherche/${selectedAxis.code.toLowerCase()}` : "/axes-recherche"}>
          <Button variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux axes
          </Button>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <FileText className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Nouvelle entrée de recherche</h1>
            <p className="text-muted-foreground">
              Ajoutez une note, synthèse ou observation à vos recherches
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Informations principales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations principales
            </CardTitle>
            <CardDescription>
              Les champs marqués d'un * sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Axe de recherche principal */}
            <div className="space-y-2">
              <Label>Axe de recherche principal *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {axes?.map(axis => (
                  <button
                    key={axis.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      primaryAxisId: axis.id,
                      secondaryAxisIds: prev.secondaryAxisIds.filter(id => id !== axis.id)
                    }))}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      formData.primaryAxisId === axis.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span style={{ color: axis.color }}>
                      {axisIcons[axis.code] || <Lightbulb className="h-5 w-5" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{axis.shortName}</p>
                      <p className="text-xs text-muted-foreground">{axis.code}</p>
                    </div>
                    {formData.primaryAxisId === axis.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Type d'entrée */}
            <div className="space-y-2">
              <Label>Type d'entrée *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {entryTypeOptions.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, entryType: type.value }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      formData.entryType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className={formData.entryType === type.value ? 'text-primary' : 'text-muted-foreground'}>
                      {type.icon}
                    </span>
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de l'entrée de recherche"
              />
            </div>
            
            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Identifiant (slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="identifiant-unique"
              />
              <p className="text-xs text-muted-foreground">
                Généré automatiquement à partir du titre. Utilisé dans les URLs.
              </p>
            </div>
            
            {/* Résumé */}
            <div className="space-y-2">
              <Label htmlFor="summary">Résumé</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Bref résumé de l'entrée (affiché dans les listes)"
                rows={2}
              />
            </div>
            
            {/* Contenu */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu détaillé de votre entrée de recherche... (Markdown supporté)"
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Vous pouvez utiliser la syntaxe Markdown pour formater votre contenu.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Métadonnées */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Métadonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statut et importance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Importance</Label>
                <Select 
                  value={formData.importance} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, importance: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'importance" />
                  </SelectTrigger>
                  <SelectContent>
                    {importanceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Date de recherche */}
            <div className="space-y-2">
              <Label htmlFor="researchDate">Date de recherche</Label>
              <Input
                id="researchDate"
                type="date"
                value={formData.researchDate}
                onChange={(e) => setFormData(prev => ({ ...prev, researchDate: e.target.value }))}
              />
            </div>
            
            {/* Options */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Entrée publique
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Visible par tous les visiteurs du site
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPinned" className="flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Épingler
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Afficher en haut de la liste des entrées
                  </p>
                </div>
                <Switch
                  id="isPinned"
                  checked={formData.isPinned}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPinned: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Axes secondaires */}
        {axes && axes.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Axes secondaires
              </CardTitle>
              <CardDescription>
                Sélectionnez les axes de recherche connexes (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {axes
                  .filter(axis => axis.id !== formData.primaryAxisId)
                  .map(axis => (
                    <button
                      key={axis.id}
                      type="button"
                      onClick={() => toggleSecondaryAxis(axis.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-colors text-left ${
                        formData.secondaryAxisIds.includes(axis.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        formData.secondaryAxisIds.includes(axis.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground/30'
                      }`}>
                        {formData.secondaryAxisIds.includes(axis.id) && (
                          <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span style={{ color: axis.color }}>
                        {axisIcons[axis.code]}
                      </span>
                      <span className="text-sm truncate">{axis.shortName}</span>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Sources bibliographiques */}
        {sources && sources.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sources bibliographiques
              </CardTitle>
              <CardDescription>
                Liez cette entrée à des sources de la bibliographie (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {sources.slice(0, 20).map(source => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => toggleSource(source.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-colors text-left w-full ${
                      formData.sourceIds.includes(source.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                      formData.sourceIds.includes(source.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {formData.sourceIds.includes(source.id) && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{source.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {source.authors} {source.publicationYear && `(${source.publicationYear})`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {sources.length > 20 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Affichage des 20 premières sources. Utilisez la recherche pour trouver d'autres sources.
                </p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href={selectedAxis ? `/axes-recherche/${selectedAxis.code.toLowerCase()}` : "/axes-recherche"}>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() => setFormData(prev => ({ ...prev, status: "draft" }))}
            >
              Enregistrer comme brouillon
            </Button>
            
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="min-w-[150px]"
            >
              {createMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
