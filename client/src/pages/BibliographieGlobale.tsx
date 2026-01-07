import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  FileText,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  BookMarked,
  GraduationCap,
  FileCode,
  Globe,
  Calendar,
  User,
  Tag,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  Network,
  Link2,
} from "lucide-react";
import { CitationGraph } from "@/components/CitationGraph";

// Types pour les entrées bibliographiques
type EntryType = 'article' | 'book' | 'inbook' | 'incollection' | 'inproceedings' | 'conference' | 'thesis' | 'mastersthesis' | 'phdthesis' | 'techreport' | 'manual' | 'unpublished' | 'misc' | 'online' | 'patent' | 'standard' | 'dataset' | 'software';
type ResearchDomain = 'chimie_olfactive' | 'botanique' | 'ethnobotanique' | 'histoire_parfumerie' | 'neurologie_olfactive' | 'extraction' | 'formulation' | 'reglementation' | 'durabilite' | 'tabac_cannabis' | 'methodologie' | 'autre';
type ReadStatus = 'unread' | 'reading' | 'read' | 'to_review';

const entryTypeLabels: Record<EntryType, string> = {
  article: "Article",
  book: "Livre",
  inbook: "Chapitre de livre",
  incollection: "Collection",
  inproceedings: "Actes de conférence",
  conference: "Conférence",
  thesis: "Thèse",
  mastersthesis: "Mémoire de master",
  phdthesis: "Thèse de doctorat",
  techreport: "Rapport technique",
  manual: "Manuel",
  unpublished: "Non publié",
  misc: "Divers",
  online: "En ligne",
  patent: "Brevet",
  standard: "Norme",
  dataset: "Jeu de données",
  software: "Logiciel",
};

const domainLabels: Record<ResearchDomain, string> = {
  chimie_olfactive: "Chimie olfactive",
  botanique: "Botanique",
  ethnobotanique: "Ethnobotanique",
  histoire_parfumerie: "Histoire de la parfumerie",
  neurologie_olfactive: "Neurologie olfactive",
  extraction: "Extraction",
  formulation: "Formulation",
  reglementation: "Réglementation",
  durabilite: "Durabilité",
  tabac_cannabis: "Tabac & Cannabis",
  methodologie: "Méthodologie",
  autre: "Autre",
};

const readStatusLabels: Record<ReadStatus, { label: string; icon: React.ReactNode; color: string }> = {
  unread: { label: "Non lu", icon: <EyeOff className="h-4 w-4" />, color: "bg-gray-500" },
  reading: { label: "En cours", icon: <Clock className="h-4 w-4" />, color: "bg-blue-500" },
  read: { label: "Lu", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-500" },
  to_review: { label: "À relire", icon: <AlertCircle className="h-4 w-4" />, color: "bg-yellow-500" },
};

const entryTypeIcons: Record<EntryType, React.ReactNode> = {
  article: <FileText className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  inbook: <BookMarked className="h-4 w-4" />,
  incollection: <BookMarked className="h-4 w-4" />,
  inproceedings: <GraduationCap className="h-4 w-4" />,
  conference: <GraduationCap className="h-4 w-4" />,
  thesis: <GraduationCap className="h-4 w-4" />,
  mastersthesis: <GraduationCap className="h-4 w-4" />,
  phdthesis: <GraduationCap className="h-4 w-4" />,
  techreport: <FileCode className="h-4 w-4" />,
  manual: <FileCode className="h-4 w-4" />,
  unpublished: <FileText className="h-4 w-4" />,
  misc: <FileText className="h-4 w-4" />,
  online: <Globe className="h-4 w-4" />,
  patent: <FileCode className="h-4 w-4" />,
  standard: <FileCode className="h-4 w-4" />,
  dataset: <FileCode className="h-4 w-4" />,
  software: <FileCode className="h-4 w-4" />,
};

export default function BibliographieGlobale() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [importText, setImportText] = useState("");
  const [importFormat, setImportFormat] = useState<"bibtex" | "csv">("bibtex");
  const [activeTab, setActiveTab] = useState<string>("list");
  const [graphFilters, setGraphFilters] = useState<{
    citationType?: string;
    researchDomain?: string;
    minWeight?: number;
    verified?: boolean;
  }>({});

  // Requêtes tRPC
  const { data: entriesData, isLoading, refetch } = trpc.bibliography.list.useQuery({
    search: searchQuery || undefined,
    entryType: selectedType !== "all" ? selectedType : undefined,
    researchDomain: selectedDomain !== "all" ? selectedDomain : undefined,
    readStatus: selectedStatus !== "all" ? selectedStatus : undefined,
  });

  const { data: stats } = trpc.bibliography.getStats.useQuery();

  // Graphe de citations
  const { data: citationGraph, isLoading: isGraphLoading } = trpc.referenceCitations.getGraph.useQuery(
    graphFilters,
    { enabled: activeTab === "graph" }
  );
  const { data: citationStats } = trpc.referenceCitations.getStats.useQuery(
    undefined,
    { enabled: activeTab === "graph" }
  );

  const createMutation = trpc.bibliography.create.useMutation({
    onSuccess: () => {
      toast.success("Référence ajoutée avec succès");
      setIsAddDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.bibliography.update.useMutation({
    onSuccess: () => {
      toast.success("Référence mise à jour");
      setSelectedEntry(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.bibliography.delete.useMutation({
    onSuccess: () => {
      toast.success("Référence supprimée");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const importBibTeXMutation = trpc.bibliography.importBibTeX.useMutation({
    onSuccess: (result) => {
      toast.success(`Import terminé: ${result.success} succès, ${result.failed} échecs`);
      setIsImportDialogOpen(false);
      setImportText("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur d'import: ${error.message}`);
    },
  });

  const importCSVMutation = trpc.bibliography.importCSV.useMutation({
    onSuccess: (result) => {
      toast.success(`Import terminé: ${result.success} succès, ${result.failed} échecs`);
      setIsImportDialogOpen(false);
      setImportText("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur d'import: ${error.message}`);
    },
  });

  const { data: exportedBibTeX } = trpc.bibliography.exportBibTeX.useQuery(undefined, {
    enabled: false,
  });

  // Formulaire d'ajout/édition
  const [formData, setFormData] = useState({
    entryKey: "",
    entryType: "article" as EntryType,
    title: "",
    authors: "",
    year: "",
    journal: "",
    publisher: "",
    volume: "",
    number: "",
    pages: "",
    doi: "",
    isbn: "",
    issn: "",
    url: "",
    abstract: "",
    keywords: "",
    researchDomain: "" as ResearchDomain | "",
    notes: "",
    readStatus: "unread" as ReadStatus,
  });

  const resetForm = () => {
    setFormData({
      entryKey: "",
      entryType: "article",
      title: "",
      authors: "",
      year: "",
      journal: "",
      publisher: "",
      volume: "",
      number: "",
      pages: "",
      doi: "",
      isbn: "",
      issn: "",
      url: "",
      abstract: "",
      keywords: "",
      researchDomain: "",
      notes: "",
      readStatus: "unread",
    });
  };

  const handleSubmit = () => {
    if (!formData.entryKey || !formData.title) {
      toast.error("La clé et le titre sont requis");
      return;
    }

    const data = {
      entryKey: formData.entryKey,
      entryType: formData.entryType,
      title: formData.title,
      authors: formData.authors || undefined,
      year: formData.year ? parseInt(formData.year) : undefined,
      journal: formData.journal || undefined,
      publisher: formData.publisher || undefined,
      volume: formData.volume || undefined,
      number: formData.number || undefined,
      pages: formData.pages || undefined,
      doi: formData.doi || undefined,
      isbn: formData.isbn || undefined,
      issn: formData.issn || undefined,
      url: formData.url || undefined,
      abstract: formData.abstract || undefined,
      keywords: formData.keywords ? formData.keywords.split(",").map(k => k.trim()) : undefined,
      researchDomain: formData.researchDomain || undefined,
      notes: formData.notes || undefined,
      readStatus: formData.readStatus,
    };

    if (selectedEntry) {
      updateMutation.mutate({ id: selectedEntry.id, ...data });
    } else {
      createMutation.mutate(data as any);
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      toast.error("Veuillez coller du contenu à importer");
      return;
    }

    if (importFormat === "bibtex") {
      importBibTeXMutation.mutate(importText);
    } else {
      importCSVMutation.mutate(importText);
    }
  };

  const utils = trpc.useUtils();
  
  const handleExportBibTeX = async () => {
    try {
      const result = await utils.bibliography.exportBibTeX.fetch(undefined);
      const blob = new Blob([result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "perfumum_bibliography.bib";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export BibTeX téléchargé");
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  const copyAPA = async (entry: any) => {
    try {
      const result = await utils.bibliography.exportAPA.fetch(entry.id);
      if (result) {
        navigator.clipboard.writeText(result);
        toast.success("Citation APA copiée");
      }
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  const openEditDialog = (entry: any) => {
    setSelectedEntry(entry);
    setFormData({
      entryKey: entry.entryKey,
      entryType: entry.entryType,
      title: entry.title,
      authors: entry.authors || "",
      year: entry.year?.toString() || "",
      journal: entry.journal || "",
      publisher: entry.publisher || "",
      volume: entry.volume || "",
      number: entry.number || "",
      pages: entry.pages || "",
      doi: entry.doi || "",
      isbn: entry.isbn || "",
      issn: entry.issn || "",
      url: entry.url || "",
      abstract: entry.abstract || "",
      keywords: entry.keywords?.join(", ") || "",
      researchDomain: entry.researchDomain || "",
      notes: entry.notes || "",
      readStatus: entry.readStatus || "unread",
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <BookOpen className="h-10 w-10 text-primary" />
                Bibliographie Globale
              </h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos références scientifiques et sources de recherche
              </p>
            </div>

            {user && (
              <div className="flex gap-2">
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Importer des références</DialogTitle>
                      <DialogDescription>
                        Collez du contenu BibTeX ou CSV pour importer plusieurs références
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant={importFormat === "bibtex" ? "default" : "outline"}
                          onClick={() => setImportFormat("bibtex")}
                        >
                          BibTeX
                        </Button>
                        <Button
                          variant={importFormat === "csv" ? "default" : "outline"}
                          onClick={() => setImportFormat("csv")}
                        >
                          CSV
                        </Button>
                      </div>
                      <Textarea
                        placeholder={
                          importFormat === "bibtex"
                            ? "@article{smith2024,\n  title = {Example Title},\n  author = {Smith, John},\n  year = {2024},\n  journal = {Journal Name}\n}"
                            : "key,type,title,authors,year,journal\nsmith2024,article,Example Title,Smith John,2024,Journal Name"
                        }
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleImport} disabled={importBibTeXMutation.isPending || importCSVMutation.isPending}>
                        {(importBibTeXMutation.isPending || importCSVMutation.isPending) ? "Import en cours..." : "Importer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handleExportBibTeX}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter BibTeX
                </Button>

                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) {
                    setSelectedEntry(null);
                    resetForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedEntry ? "Modifier la référence" : "Nouvelle référence"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Clé BibTeX *</Label>
                        <Input
                          placeholder="ex: smith2024perfumery"
                          value={formData.entryKey}
                          onChange={(e) => setFormData({ ...formData, entryKey: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type *</Label>
                        <Select
                          value={formData.entryType}
                          onValueChange={(v) => setFormData({ ...formData, entryType: v as EntryType })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(entryTypeLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Titre *</Label>
                        <Input
                          placeholder="Titre de la publication"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Auteurs</Label>
                        <Input
                          placeholder="Nom1, Prénom1 and Nom2, Prénom2"
                          value={formData.authors}
                          onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Année</Label>
                        <Input
                          type="number"
                          placeholder="2024"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Journal / Revue</Label>
                        <Input
                          placeholder="Nom du journal"
                          value={formData.journal}
                          onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Éditeur</Label>
                        <Input
                          placeholder="Nom de l'éditeur"
                          value={formData.publisher}
                          onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Volume</Label>
                        <Input
                          placeholder="Vol. 12"
                          value={formData.volume}
                          onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Numéro</Label>
                        <Input
                          placeholder="No. 3"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pages</Label>
                        <Input
                          placeholder="123-145"
                          value={formData.pages}
                          onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>DOI</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="10.1000/xyz123"
                            value={formData.doi}
                            onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                          />
                          {formData.doi && (
                            <Button variant="outline" size="icon" asChild>
                              <a href={`https://doi.org/${formData.doi}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>ISBN (pour les livres)</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="978-3-16-148410-0"
                            value={formData.isbn}
                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                          />
                          {formData.isbn && (
                            <Button variant="outline" size="icon" asChild>
                              <a href={`https://www.worldcat.org/isbn/${formData.isbn.replace(/-/g, '')}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>ISSN (pour les journaux)</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="1234-5678"
                            value={formData.issn}
                            onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                          />
                          {formData.issn && (
                            <Button variant="outline" size="icon" asChild>
                              <a href={`https://portal.issn.org/resource/ISSN/${formData.issn}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          placeholder="https://..."
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Domaine de recherche</Label>
                        <Select
                          value={formData.researchDomain}
                          onValueChange={(v) => setFormData({ ...formData, researchDomain: v as ResearchDomain })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(domainLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Statut de lecture</Label>
                        <Select
                          value={formData.readStatus}
                          onValueChange={(v) => setFormData({ ...formData, readStatus: v as ReadStatus })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(readStatusLabels).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Mots-clés (séparés par des virgules)</Label>
                        <Input
                          placeholder="parfumerie, terpènes, extraction"
                          value={formData.keywords}
                          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Résumé</Label>
                        <Textarea
                          placeholder="Résumé de la publication..."
                          value={formData.abstract}
                          onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Notes personnelles</Label>
                        <Textarea
                          placeholder="Vos notes sur cette référence..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        setSelectedEntry(null);
                        resetForm();
                      }}>
                        Annuler
                      </Button>
                      <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                        {(createMutation.isPending || updateMutation.isPending) ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{stats.total}</CardTitle>
                  <CardDescription>Références totales</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">
                    {stats.byReadStatus?.find((s: any) => s.status === "read")?.count || 0}
                  </CardTitle>
                  <CardDescription>Références lues</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">
                    {stats.byType?.length || 0}
                  </CardTitle>
                  <CardDescription>Types de sources</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">
                    {stats.byDomain?.length || 0}
                  </CardTitle>
                  <CardDescription>Domaines couverts</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Tabs pour basculer entre liste et graphe */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Liste des références
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Graphe de citations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              {/* Filtres */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par titre, auteur ou clé..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(entryTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Domaine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les domaines</SelectItem>
                    {Object.entries(domainLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {Object.entries(readStatusLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Liste des références */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Chargement...</p>
                </div>
              ) : entriesData?.entries && entriesData.entries.length > 0 ? (
                <div className="space-y-4">
                  {entriesData.entries.map((entry: any) => (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-muted-foreground">
                                {entryTypeIcons[entry.entryType as EntryType]}
                              </span>
                              <Badge variant="outline">
                                {entryTypeLabels[entry.entryType as EntryType]}
                              </Badge>
                              {entry.researchDomain && (
                                <Badge variant="secondary">
                                  {domainLabels[entry.researchDomain as ResearchDomain]}
                                </Badge>
                              )}
                              <Badge className={`${readStatusLabels[entry.readStatus as ReadStatus]?.color} text-white`}>
                                {readStatusLabels[entry.readStatus as ReadStatus]?.icon}
                                <span className="ml-1">{readStatusLabels[entry.readStatus as ReadStatus]?.label}</span>
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold mb-1 line-clamp-2">{entry.title}</h3>
                            {entry.authors && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {entry.authors}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {entry.year && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {entry.year}
                                </span>
                              )}
                              {entry.journal && <span>{entry.journal}</span>}
                              {entry.publisher && <span>{entry.publisher}</span>}
                            </div>
                            {entry.keywords && entry.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {entry.keywords.slice(0, 5).map((kw: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    <Tag className="h-2 w-2 mr-1" />
                                    {kw}
                                  </Badge>
                                ))}
                                {entry.keywords.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{entry.keywords.length - 5}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {entry.doi && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`https://doi.org/${entry.doi}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {entry.url && !entry.doi && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => copyAPA(entry)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            {user && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(entry)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => {
                                    if (confirm("Supprimer cette référence ?")) {
                                      deleteMutation.mutate(entry.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {entry.abstract && (
                          <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                            {entry.abstract}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>Clé: <code className="bg-muted px-1 rounded">{entry.entryKey}</code></span>
                          {entry.doi && (
                            <a 
                              href={`https://doi.org/${entry.doi}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <span className="font-medium">DOI:</span> {entry.doi}
                            </a>
                          )}
                          {entry.isbn && (
                            <a 
                              href={`https://www.worldcat.org/isbn/${entry.isbn.replace(/-/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <span className="font-medium">ISBN:</span> {entry.isbn}
                            </a>
                          )}
                          {entry.issn && (
                            <a 
                              href={`https://portal.issn.org/resource/ISSN/${entry.issn}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <span className="font-medium">ISSN:</span> {entry.issn}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune référence</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedType !== "all" || selectedDomain !== "all"
                        ? "Aucune référence ne correspond à vos critères"
                        : "Commencez par ajouter vos premières références bibliographiques"}
                    </p>
                    {user && !searchQuery && selectedType === "all" && selectedDomain === "all" && (
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une référence
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="graph" className="mt-6">
              {/* Statistiques du graphe */}
              {citationStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">{citationStats.totalCitations}</CardTitle>
                      <CardDescription>Citations totales</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">{citationStats.totalCitingReferences}</CardTitle>
                      <CardDescription>Références citantes</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">{citationStats.totalCitedReferences}</CardTitle>
                      <CardDescription>Références citées</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">{citationStats.verifiedCount}</CardTitle>
                      <CardDescription>Citations vérifiées</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {/* Graphe de citations */}
              <CitationGraph
                nodes={citationGraph?.nodes || []}
                links={citationGraph?.links || []}
                isLoading={isGraphLoading}
                filters={graphFilters}
                onFiltersChange={setGraphFilters}
                onNodeClick={(node) => {
                  // Naviguer vers la fiche de la référence
                  toast.info(`Référence: ${node.title}`);
                }}
              />

              {/* Top références citées */}
              {citationStats?.mostCited && citationStats.mostCited.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Références les plus citées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {citationStats.mostCited.slice(0, 5).map((item: any, index: number) => (
                        <div key={item.citedId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                            <div>
                              <p className="font-medium line-clamp-1">{item.reference?.title || 'Titre inconnu'}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.reference?.authors?.split(',')[0] || 'Auteur inconnu'} ({item.reference?.year || '?'})
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">{item.count} citations</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
