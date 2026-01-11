import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { Link, useParams } from "wouter";
import {
  Compass,
  Plus,
  Search,
  ChevronLeft,
  Edit,
  Trash2,
  FileText,
  Eye,
  Lightbulb,
  FlaskConical,
  CheckCircle,
  HelpCircle,
  Database,
  BarChart,
  Link as LinkIcon,
  Quote,
  Image,
  ExternalLink,
  Clock,
  AlertCircle,
  BookOpen,
  Paperclip,
  Tag,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

// Types
type EntryType = 'note' | 'observation' | 'hypothese' | 'resultat' | 'conclusion' | 'question' | 'idee' | 'protocole' | 'donnees' | 'analyse' | 'reference' | 'citation' | 'media' | 'lien' | 'autre';
type EntryStatus = 'brouillon' | 'en_revision' | 'valide' | 'archive';
type EntryImportance = 'critique' | 'haute' | 'moyenne' | 'basse' | 'reference';

const entryTypeLabels: Record<EntryType, { label: string; icon: React.ReactNode; color: string }> = {
  note: { label: "Note", icon: <FileText className="h-4 w-4" />, color: "bg-slate-500" },
  observation: { label: "Observation", icon: <Eye className="h-4 w-4" />, color: "bg-blue-500" },
  hypothese: { label: "Hypothèse", icon: <Lightbulb className="h-4 w-4" />, color: "bg-yellow-500" },
  resultat: { label: "Résultat", icon: <FlaskConical className="h-4 w-4" />, color: "bg-green-500" },
  conclusion: { label: "Conclusion", icon: <CheckCircle className="h-4 w-4" />, color: "bg-emerald-500" },
  question: { label: "Question", icon: <HelpCircle className="h-4 w-4" />, color: "bg-purple-500" },
  idee: { label: "Idée", icon: <Lightbulb className="h-4 w-4" />, color: "bg-amber-500" },
  protocole: { label: "Protocole", icon: <FileText className="h-4 w-4" />, color: "bg-indigo-500" },
  donnees: { label: "Données", icon: <Database className="h-4 w-4" />, color: "bg-cyan-500" },
  analyse: { label: "Analyse", icon: <BarChart className="h-4 w-4" />, color: "bg-teal-500" },
  reference: { label: "Référence", icon: <BookOpen className="h-4 w-4" />, color: "bg-orange-500" },
  citation: { label: "Citation", icon: <Quote className="h-4 w-4" />, color: "bg-pink-500" },
  media: { label: "Média", icon: <Image className="h-4 w-4" />, color: "bg-rose-500" },
  lien: { label: "Lien", icon: <LinkIcon className="h-4 w-4" />, color: "bg-sky-500" },
  autre: { label: "Autre", icon: <FileText className="h-4 w-4" />, color: "bg-gray-500" },
};

const statusLabels: Record<EntryStatus, { label: string; color: string }> = {
  brouillon: { label: "Brouillon", color: "bg-slate-500" },
  en_revision: { label: "En révision", color: "bg-yellow-500" },
  valide: { label: "Validé", color: "bg-green-500" },
  archive: { label: "Archivé", color: "bg-gray-500" },
};

const importanceLabels: Record<EntryImportance, { label: string; icon: React.ReactNode; color: string }> = {
  critique: { label: "Critique", icon: <AlertCircle className="h-4 w-4" />, color: "text-red-500" },
  haute: { label: "Haute", icon: <ArrowUp className="h-4 w-4" />, color: "text-orange-500" },
  moyenne: { label: "Moyenne", icon: <Minus className="h-4 w-4" />, color: "text-yellow-500" },
  basse: { label: "Basse", icon: <ArrowDown className="h-4 w-4" />, color: "text-green-500" },
  reference: { label: "Référence", icon: <BookOpen className="h-4 w-4" />, color: "text-blue-500" },
};

export default function AxeRechercheDetail() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [viewEntry, setViewEntry] = useState<any>(null);

  // Requêtes tRPC
  const { data: axis, isLoading: axisLoading } = trpc.researchAxes.getByCode.useQuery(code || "");
  
  const { data: entries, isLoading: entriesLoading, refetch } = trpc.researchEntries.list.useQuery({
    axisId: axis?.id,
    entryType: selectedType !== "all" ? selectedType : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: searchQuery || undefined,
  }, {
    enabled: !!axis?.id,
  });

  const { data: nextCode } = trpc.researchEntries.getNextCode.useQuery(code || "", {
    enabled: !!code,
  });

  const { data: bibliography } = trpc.researchAxes.getBibliography.useQuery(axis?.id || 0, {
    enabled: !!axis?.id,
  });

  // Récupérer les sous-axes
  const { data: subAxes } = trpc.researchAxes.getSubAxes.useQuery(axis?.id || 0, {
    enabled: !!axis?.id,
  });

  const createMutation = trpc.researchEntries.create.useMutation({
    onSuccess: () => {
      toast.success("Entrée créée");
      setIsAddDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.researchEntries.update.useMutation({
    onSuccess: () => {
      toast.success("Entrée mise à jour");
      setSelectedEntry(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.researchEntries.delete.useMutation({
    onSuccess: () => {
      toast.success("Entrée supprimée");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Formulaire
  const [formData, setFormData] = useState({
    entryCode: "",
    title: "",
    content: "",
    summary: "",
    entryType: "note" as EntryType,
    status: "brouillon" as EntryStatus,
    importance: "moyenne" as EntryImportance,
    tags: "",
  });

  useEffect(() => {
    if (nextCode && !selectedEntry) {
      setFormData(prev => ({ ...prev, entryCode: nextCode }));
    }
  }, [nextCode, selectedEntry]);

  const resetForm = () => {
    setFormData({
      entryCode: nextCode || "",
      title: "",
      content: "",
      summary: "",
      entryType: "note",
      status: "brouillon",
      importance: "moyenne",
      tags: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.entryCode || !formData.title || !axis?.id) {
      toast.error("Le code et le titre sont requis");
      return;
    }

    const data = {
      entryCode: formData.entryCode,
      axisId: axis.id,
      title: formData.title,
      content: formData.content || undefined,
      summary: formData.summary || undefined,
      entryType: formData.entryType,
      status: formData.status,
      importance: formData.importance,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : undefined,
    };

    if (selectedEntry) {
      updateMutation.mutate({ id: selectedEntry.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (entry: any) => {
    setSelectedEntry(entry);
    setFormData({
      entryCode: entry.entryCode,
      title: entry.title,
      content: entry.content || "",
      summary: entry.summary || "",
      entryType: entry.entryType || "note",
      status: entry.status || "brouillon",
      importance: entry.importance || "moyenne",
      tags: entry.tags?.join(", ") || "",
    });
    setIsAddDialogOpen(true);
  };

  if (axisLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 py-8">
          <div className="container text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!axis) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 py-8">
          <div className="container text-center py-12">
            <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Axe non trouvé</h2>
            <p className="text-muted-foreground mb-4">L'axe "{code}" n'existe pas.</p>
            <Link href="/axes-recherche">
              <Button>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour aux axes
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          {/* Navigation */}
          <Link href="/axes-recherche">
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour aux axes
            </Button>
          </Link>

          {/* En-tête de l'axe */}
          <Card className="mb-8" style={{ borderTopColor: axis.color || undefined, borderTopWidth: '4px' }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-mono text-muted-foreground">{axis.axisCode}</span>
                  <CardTitle className="text-2xl mt-1">{axis.name}</CardTitle>
                  {axis.subtitle && (
                    <CardDescription className="text-lg mt-1">{axis.subtitle}</CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{axis.category}</Badge>
                  <Badge>{axis.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {axis.description && (
                <p className="text-muted-foreground mb-4">{axis.description}</p>
              )}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span className="font-medium">{axis.progressPercent || 0}%</span>
                  </div>
                  <Progress value={axis.progressPercent || 0} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {entries?.length || 0} entrées
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="entries" className="space-y-6">
            <TabsList className="flex-wrap">
              <TabsTrigger value="entries">Entrées de recherche</TabsTrigger>
              {subAxes && subAxes.length > 0 && (
                <TabsTrigger value="subaxes">Sous-axes ({subAxes.length})</TabsTrigger>
              )}
              <TabsTrigger value="bibliography">Bibliographie ({bibliography?.length || 0})</TabsTrigger>
              <TabsTrigger value="info">Informations</TabsTrigger>
            </TabsList>

            <TabsContent value="entries">
              {/* Actions et filtres */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une entrée..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    {Object.entries(entryTypeLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    {Object.entries(statusLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {user && (
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
                        Nouvelle entrée
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedEntry ? "Modifier l'entrée" : "Nouvelle entrée de recherche"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Code *</Label>
                          <Input
                            value={formData.entryCode}
                            onChange={(e) => setFormData({ ...formData, entryCode: e.target.value })}
                            disabled={!!selectedEntry}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={formData.entryType}
                            onValueChange={(v) => setFormData({ ...formData, entryType: v as EntryType })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(entryTypeLabels).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Titre *</Label>
                          <Input
                            placeholder="Titre de l'entrée"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Statut</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(v) => setFormData({ ...formData, status: v as EntryStatus })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Importance</Label>
                          <Select
                            value={formData.importance}
                            onValueChange={(v) => setFormData({ ...formData, importance: v as EntryImportance })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(importanceLabels).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Résumé</Label>
                          <Textarea
                            placeholder="Résumé court de l'entrée..."
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Contenu</Label>
                          <Textarea
                            placeholder="Contenu détaillé..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="min-h-[200px]"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Tags (séparés par des virgules)</Label>
                          <Input
                            placeholder="tag1, tag2, tag3"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                )}
              </div>

              {/* Liste des entrées */}
              {entriesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : entries && entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map((entry: any) => (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                className={`${entryTypeLabels[entry.entryType as EntryType]?.color || 'bg-gray-500'} text-white`}
                              >
                                {entryTypeLabels[entry.entryType as EntryType]?.icon}
                                <span className="ml-1">{entryTypeLabels[entry.entryType as EntryType]?.label}</span>
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={importanceLabels[entry.importance as EntryImportance]?.color}
                              >
                                {importanceLabels[entry.importance as EntryImportance]?.icon}
                                <span className="ml-1">{importanceLabels[entry.importance as EntryImportance]?.label}</span>
                              </Badge>
                              <Badge 
                                className={`${statusLabels[entry.status as EntryStatus]?.color || 'bg-gray-500'} text-white`}
                              >
                                {statusLabels[entry.status as EntryStatus]?.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{entry.entryCode}</span>
                              <h3 className="font-semibold">{entry.title}</h3>
                            </div>
                            {entry.summary && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {entry.summary}
                              </p>
                            )}
                            {entry.tags && entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {entry.tags.map((tag: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    <Tag className="h-2 w-2 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setViewEntry(entry)}>
                              <Eye className="h-4 w-4" />
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
                                    if (confirm("Supprimer cette entrée ?")) {
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune entrée</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez à documenter vos recherches pour cet axe
                    </p>
                    {user && (
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer une entrée
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sous-axes */}
            {subAxes && subAxes.length > 0 && (
              <TabsContent value="subaxes">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subAxes.map((subAxis: any) => (
                    <Card 
                      key={subAxis.id} 
                      className="hover:shadow-lg transition-shadow overflow-hidden"
                      style={{ borderTopColor: subAxis.color || axis.color, borderTopWidth: '4px' }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{subAxis.category}</Badge>
                          <Badge>{subAxis.status}</Badge>
                        </div>
                        <div className="mt-3">
                          <span className="text-xs font-mono text-muted-foreground">{subAxis.axisCode}</span>
                          <CardTitle className="text-lg mt-1">{subAxis.name}</CardTitle>
                          {subAxis.subtitle && (
                            <CardDescription className="mt-1">{subAxis.subtitle}</CardDescription>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {subAxis.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {subAxis.description}
                          </p>
                        )}
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span className="font-medium">{subAxis.progressPercent || 0}%</span>
                          </div>
                          <Progress value={subAxis.progressPercent || 0} className="h-2" />
                        </div>

                        <div className="pt-4 border-t">
                          <Link href={`/axes-recherche/${subAxis.axisCode}`}>
                            <Button variant="ghost" size="sm" className="w-full">
                              Voir le sous-axe
                              <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="bibliography">
              {bibliography && bibliography.length > 0 ? (
                <div className="space-y-4">
                  {bibliography.map((entry: any) => (
                    <Card key={entry.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2">{entry.entryType}</Badge>
                            {entry.relevance && (
                              <Badge className="ml-2">{entry.relevance}</Badge>
                            )}
                            <h3 className="font-semibold">{entry.title}</h3>
                            {entry.authors && (
                              <p className="text-sm text-muted-foreground">{entry.authors}</p>
                            )}
                            {entry.year && (
                              <p className="text-sm text-muted-foreground">{entry.year}</p>
                            )}
                          </div>
                          {entry.doi && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`https://doi.org/${entry.doi}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
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
                    <h3 className="text-lg font-semibold mb-2">Aucune référence liée</h3>
                    <p className="text-muted-foreground">
                      Liez des références depuis la bibliographie globale
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="info">
              <div className="grid md:grid-cols-2 gap-6">
                {axis.objectives && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Objectifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{axis.objectives}</p>
                    </CardContent>
                  </Card>
                )}
                {axis.methodology && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Méthodologie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{axis.methodology}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Dialog de visualisation d'entrée */}
          <Dialog open={!!viewEntry} onOpenChange={(open) => !open && setViewEntry(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              {viewEntry && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        className={`${entryTypeLabels[viewEntry.entryType as EntryType]?.color || 'bg-gray-500'} text-white`}
                      >
                        {entryTypeLabels[viewEntry.entryType as EntryType]?.icon}
                        <span className="ml-1">{entryTypeLabels[viewEntry.entryType as EntryType]?.label}</span>
                      </Badge>
                      <Badge 
                        className={`${statusLabels[viewEntry.status as EntryStatus]?.color || 'bg-gray-500'} text-white`}
                      >
                        {statusLabels[viewEntry.status as EntryStatus]?.label}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{viewEntry.entryCode}</span>
                    <DialogTitle>{viewEntry.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {viewEntry.summary && (
                      <div>
                        <h4 className="font-semibold mb-1">Résumé</h4>
                        <p className="text-muted-foreground">{viewEntry.summary}</p>
                      </div>
                    )}
                    {viewEntry.content && (
                      <div>
                        <h4 className="font-semibold mb-1">Contenu</h4>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{viewEntry.content}</p>
                        </div>
                      </div>
                    )}
                    {viewEntry.tags && viewEntry.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {viewEntry.tags.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
