import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  BookOpen, 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  User,
  Calendar,
  Building,
  Globe,
  Hash,
  FileText,
  Link as LinkIcon,
  Star,
  BookMarked,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Types de sources avec labels
const sourceTypeOptions = [
  { value: "scientific_paper", label: "Article scientifique" },
  { value: "book", label: "Livre" },
  { value: "book_chapter", label: "Chapitre de livre" },
  { value: "thesis", label: "Thèse" },
  { value: "conference", label: "Conférence" },
  { value: "patent", label: "Brevet" },
  { value: "report", label: "Rapport" },
  { value: "article", label: "Article de presse" },
  { value: "website", label: "Site web" },
  { value: "database", label: "Base de données" },
  { value: "podcast", label: "Podcast" },
  { value: "video", label: "Vidéo" },
  { value: "interview", label: "Interview" },
  { value: "archive", label: "Archive" },
  { value: "dataset", label: "Jeu de données" },
  { value: "software", label: "Logiciel" },
  { value: "other", label: "Autre" },
];

// Statuts de lecture
const readingStatusOptions = [
  { value: "unread", label: "Non lu", icon: <BookMarked className="h-4 w-4" />, color: "text-muted-foreground" },
  { value: "reading", label: "En cours", icon: <Clock className="h-4 w-4" />, color: "text-amber-500" },
  { value: "read", label: "Lu", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-500" },
  { value: "to_review", label: "À relire", icon: <AlertCircle className="h-4 w-4" />, color: "text-blue-500" },
];

// Langues disponibles
const languageOptions = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "de", label: "Allemand" },
  { value: "es", label: "Espagnol" },
  { value: "it", label: "Italien" },
  { value: "pt", label: "Portugais" },
  { value: "la", label: "Latin" },
  { value: "ar", label: "Arabe" },
  { value: "zh", label: "Chinois" },
  { value: "ja", label: "Japonais" },
  { value: "other", label: "Autre" },
];

// Axes de recherche PERFUMUM
const researchAxes = [
  { id: "AX1", label: "AX1 — Neurosciences & Cognition" },
  { id: "AX2", label: "AX2 — Botanique & Terroirs" },
  { id: "AX3", label: "AX3 — Anthropologie & Culture" },
  { id: "AX4", label: "AX4 — Archives & Patrimoine" },
  { id: "AX5", label: "AX5 — Innovation & Technologies" },
];

interface Author {
  name: string;
  affiliation?: string;
}

export default function BibliographyAdd() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    sourceType: "scientific_paper",
    title: "",
    authors: [{ name: "", affiliation: "" }] as Author[],
    publicationYear: new Date().getFullYear(),
    publicationMonth: undefined as number | undefined,
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    publisher: "",
    edition: "",
    language: "fr",
    doi: "",
    isbn: "",
    issn: "",
    pmid: "",
    arxivId: "",
    url: "",
    abstract: "",
    keywords: "",
    notes: "",
    relevanceScore: 5,
    relevantAxes: [] as string[],
    readingStatus: "unread",
  });
  
  // Mutation pour créer une source
  const createMutation = trpc.bibliography.create.useMutation({
    onSuccess: () => {
      toast.success("Source ajoutée avec succès !");
      utils.bibliography.list.invalidate();
      utils.bibliography.stats.invalidate();
      setLocation("/bibliographie-globale");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
  
  // Gestion des auteurs
  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, { name: "", affiliation: "" }],
    }));
  };
  
  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      setFormData(prev => ({
        ...prev,
        authors: prev.authors.filter((_, i) => i !== index),
      }));
    }
  };
  
  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) => 
        i === index ? { ...author, [field]: value } : author
      ),
    }));
  };
  
  // Gestion des axes de recherche
  const toggleAxis = (axisId: string) => {
    setFormData(prev => ({
      ...prev,
      relevantAxes: prev.relevantAxes.includes(axisId)
        ? prev.relevantAxes.filter(id => id !== axisId)
        : [...prev.relevantAxes, axisId],
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
    
    if (!formData.authors[0]?.name.trim()) {
      toast.error("Au moins un auteur est requis");
      return;
    }
    
    // Préparer les données
    const submitData = {
      sourceType: formData.sourceType,
      title: formData.title.trim(),
      authors: JSON.stringify(formData.authors.filter(a => a.name.trim())),
      publicationYear: formData.publicationYear || undefined,
      publicationMonth: formData.publicationMonth || undefined,
      journal: formData.journal.trim() || undefined,
      volume: formData.volume.trim() || undefined,
      issue: formData.issue.trim() || undefined,
      pages: formData.pages.trim() || undefined,
      publisher: formData.publisher.trim() || undefined,
      edition: formData.edition.trim() || undefined,
      language: formData.language || undefined,
      doi: formData.doi.trim() || undefined,
      isbn: formData.isbn.trim() || undefined,
      issn: formData.issn.trim() || undefined,
      pmid: formData.pmid.trim() || undefined,
      arxivId: formData.arxivId.trim() || undefined,
      url: formData.url.trim() || undefined,
      abstract: formData.abstract.trim() || undefined,
      keywords: formData.keywords.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      relevanceScore: formData.relevanceScore,
      relevantAxes: formData.relevantAxes.length > 0 ? formData.relevantAxes.join(",") : undefined,
    };
    
    createMutation.mutate(submitData);
  };

  return (
    <div className="container py-8 max-w-4xl">
      {/* En-tête */}
      <div className="mb-8">
        <Link href="/bibliographie-globale">
          <Button variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la bibliographie
          </Button>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <BookOpen className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Ajouter une source</h1>
            <p className="text-muted-foreground">
              Enrichissez la bibliographie du projet PERFUMUM
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
            {/* Type de source */}
            <div className="space-y-2">
              <Label htmlFor="sourceType">Type de source *</Label>
              <Select 
                value={formData.sourceType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sourceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {sourceTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre complet de la source"
              />
            </div>
            
            {/* Auteurs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Auteurs *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAuthor}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              
              {formData.authors.map((author, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={author.name}
                      onChange={(e) => updateAuthor(index, "name", e.target.value)}
                      placeholder="Nom de l'auteur"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={author.affiliation || ""}
                      onChange={(e) => updateAuthor(index, "affiliation", e.target.value)}
                      placeholder="Affiliation (optionnel)"
                    />
                  </div>
                  {formData.authors.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeAuthor(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Année et mois de publication */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publicationYear">Année de publication</Label>
                <Input
                  id="publicationYear"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear() + 1}
                  value={formData.publicationYear || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    publicationYear: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationMonth">Mois (optionnel)</Label>
                <Select 
                  value={formData.publicationMonth?.toString() || ""} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    publicationMonth: value ? parseInt(value) : undefined 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Non spécifié</SelectItem>
                    {[
                      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                    ].map((month, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Langue */}
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Détails de publication */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Détails de publication
            </CardTitle>
            <CardDescription>
              Informations sur la revue, l'éditeur ou la conférence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journal">Revue / Journal</Label>
                <Input
                  id="journal"
                  value={formData.journal}
                  onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
                  placeholder="Nature, Science, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Éditeur</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                  placeholder="Springer, Elsevier, etc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  value={formData.volume}
                  onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Numéro</Label>
                <Input
                  id="issue"
                  value={formData.issue}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  value={formData.pages}
                  onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
                  placeholder="123-145"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edition">Édition</Label>
              <Input
                id="edition"
                value={formData.edition}
                onChange={(e) => setFormData(prev => ({ ...prev, edition: e.target.value }))}
                placeholder="2e édition, Édition révisée, etc."
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Identifiants */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Identifiants
            </CardTitle>
            <CardDescription>
              DOI, ISBN, PMID et autres identifiants uniques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  value={formData.doi}
                  onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                  placeholder="10.1000/xyz123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  placeholder="978-3-16-148410-0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issn">ISSN</Label>
                <Input
                  id="issn"
                  value={formData.issn}
                  onChange={(e) => setFormData(prev => ({ ...prev, issn: e.target.value }))}
                  placeholder="1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pmid">PMID</Label>
                <Input
                  id="pmid"
                  value={formData.pmid}
                  onChange={(e) => setFormData(prev => ({ ...prev, pmid: e.target.value }))}
                  placeholder="12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arxivId">arXiv ID</Label>
                <Input
                  id="arxivId"
                  value={formData.arxivId}
                  onChange={(e) => setFormData(prev => ({ ...prev, arxivId: e.target.value }))}
                  placeholder="2301.12345"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Contenu et notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contenu et notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="abstract">Résumé / Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                placeholder="Résumé de la source..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Mots-clés</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="olfaction, terpènes, GC-MS, etc. (séparés par des virgules)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes personnelles</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Vos notes et observations sur cette source..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Classification PERFUMUM */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Classification PERFUMUM
            </CardTitle>
            <CardDescription>
              Pertinence et axes de recherche associés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score de pertinence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Score de pertinence</Label>
                <span className="text-2xl font-bold text-primary">{formData.relevanceScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.relevanceScore}
                onChange={(e) => setFormData(prev => ({ ...prev, relevanceScore: parseInt(e.target.value) }))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Faible</span>
                <span>Moyenne</span>
                <span>Haute</span>
              </div>
            </div>
            
            {/* Axes de recherche */}
            <div className="space-y-3">
              <Label>Axes de recherche pertinents</Label>
              <div className="grid gap-2">
                {researchAxes.map(axis => (
                  <button
                    key={axis.id}
                    type="button"
                    onClick={() => toggleAxis(axis.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      formData.relevantAxes.includes(axis.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      formData.relevantAxes.includes(axis.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {formData.relevantAxes.includes(axis.id) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{axis.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Statut de lecture */}
            <div className="space-y-3">
              <Label>Statut de lecture</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {readingStatusOptions.map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, readingStatus: status.value }))}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      formData.readingStatus === status.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className={status.color}>{status.icon}</span>
                    <span className="text-sm">{status.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href="/bibliographie-globale">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          
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
      </form>
    </div>
  );
}
