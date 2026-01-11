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
import { Link } from "wouter";
import {
  Compass,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit,
  Trash2,
  Calendar,
  Target,
  Beaker,
  BookOpen,
  History,
  Map,
  Wrench,
  Lightbulb,
  FileText,
  Clock,
  CheckCircle,
  PauseCircle,
  Archive,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

// Types
type AxisCategory = 'fondamental' | 'applique' | 'experimental' | 'theorique' | 'historique' | 'ethnographique' | 'technique';
type AxisStatus = 'planifie' | 'en_cours' | 'pause' | 'termine' | 'archive';
type AxisPriority = 'haute' | 'moyenne' | 'basse';

const categoryLabels: Record<AxisCategory, { label: string; icon: React.ReactNode; color: string }> = {
  fondamental: { label: "Fondamental", icon: <Beaker className="h-4 w-4" />, color: "bg-blue-500" },
  applique: { label: "Appliqué", icon: <Wrench className="h-4 w-4" />, color: "bg-green-500" },
  experimental: { label: "Expérimental", icon: <Lightbulb className="h-4 w-4" />, color: "bg-purple-500" },
  theorique: { label: "Théorique", icon: <BookOpen className="h-4 w-4" />, color: "bg-indigo-500" },
  historique: { label: "Historique", icon: <History className="h-4 w-4" />, color: "bg-amber-500" },
  ethnographique: { label: "Ethnographique", icon: <Map className="h-4 w-4" />, color: "bg-teal-500" },
  technique: { label: "Technique", icon: <Wrench className="h-4 w-4" />, color: "bg-gray-500" },
};

const statusLabels: Record<AxisStatus, { label: string; icon: React.ReactNode; color: string }> = {
  planifie: { label: "Planifié", icon: <Calendar className="h-4 w-4" />, color: "bg-slate-500" },
  en_cours: { label: "En cours", icon: <Clock className="h-4 w-4" />, color: "bg-blue-500" },
  pause: { label: "En pause", icon: <PauseCircle className="h-4 w-4" />, color: "bg-yellow-500" },
  termine: { label: "Terminé", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-500" },
  archive: { label: "Archivé", icon: <Archive className="h-4 w-4" />, color: "bg-gray-500" },
};

const priorityLabels: Record<AxisPriority, { label: string; icon: React.ReactNode; color: string }> = {
  haute: { label: "Haute", icon: <ArrowUp className="h-4 w-4" />, color: "text-red-500" },
  moyenne: { label: "Moyenne", icon: <Minus className="h-4 w-4" />, color: "text-yellow-500" },
  basse: { label: "Basse", icon: <ArrowDown className="h-4 w-4" />, color: "text-green-500" },
};

export default function AxesRecherche() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAxis, setSelectedAxis] = useState<any>(null);

  // Requêtes tRPC
  const { data: axes, isLoading, refetch } = trpc.researchAxes.list.useQuery({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const { data: stats } = trpc.researchAxes.getStats.useQuery();

  const createMutation = trpc.researchAxes.create.useMutation({
    onSuccess: () => {
      toast.success("Axe de recherche créé");
      setIsAddDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.researchAxes.update.useMutation({
    onSuccess: () => {
      toast.success("Axe mis à jour");
      setSelectedAxis(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.researchAxes.delete.useMutation({
    onSuccess: () => {
      toast.success("Axe supprimé");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Formulaire
  const [formData, setFormData] = useState({
    axisCode: "",
    name: "",
    subtitle: "",
    description: "",
    objectives: "",
    methodology: "",
    category: "fondamental" as AxisCategory,
    status: "planifie" as AxisStatus,
    priority: "moyenne" as AxisPriority,
    progressPercent: 0,
    color: "#6366f1",
    icon: "",
  });

  const resetForm = () => {
    setFormData({
      axisCode: "",
      name: "",
      subtitle: "",
      description: "",
      objectives: "",
      methodology: "",
      category: "fondamental",
      status: "planifie",
      priority: "moyenne",
      progressPercent: 0,
      color: "#6366f1",
      icon: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.axisCode || !formData.name) {
      toast.error("Le code et le nom sont requis");
      return;
    }

    const data = {
      axisCode: formData.axisCode,
      name: formData.name,
      subtitle: formData.subtitle || undefined,
      description: formData.description || undefined,
      objectives: formData.objectives || undefined,
      methodology: formData.methodology || undefined,
      category: formData.category,
      status: formData.status,
      priority: formData.priority,
      progressPercent: formData.progressPercent,
      color: formData.color,
      icon: formData.icon || undefined,
    };

    if (selectedAxis) {
      updateMutation.mutate({ id: selectedAxis.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (axis: any) => {
    setSelectedAxis(axis);
    setFormData({
      axisCode: axis.axisCode,
      name: axis.name,
      subtitle: axis.subtitle || "",
      description: axis.description || "",
      objectives: axis.objectives || "",
      methodology: axis.methodology || "",
      category: axis.category || "fondamental",
      status: axis.status || "planifie",
      priority: axis.priority || "moyenne",
      progressPercent: axis.progressPercent || 0,
      color: axis.color || "#6366f1",
      icon: axis.icon || "",
    });
    setIsAddDialogOpen(true);
  };

  // Filtrer les axes par recherche
  const filteredAxes = useMemo(() => {
    if (!axes) return [];
    if (!searchQuery) return axes;
    
    const query = searchQuery.toLowerCase();
    return axes.filter((axis: any) =>
      axis.name.toLowerCase().includes(query) ||
      axis.axisCode.toLowerCase().includes(query) ||
      axis.description?.toLowerCase().includes(query)
    );
  }, [axes, searchQuery]);

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
                <Compass className="h-10 w-10 text-primary" />
                Axes de Recherche
              </h1>
              <p className="text-muted-foreground mt-2">
                Organisez et suivez vos thématiques de recherche
              </p>
            </div>

            {user && (
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setSelectedAxis(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel axe
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedAxis ? "Modifier l'axe" : "Nouvel axe de recherche"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Code *</Label>
                      <Input
                        placeholder="ex: AX1"
                        value={formData.axisCode}
                        onChange={(e) => setFormData({ ...formData, axisCode: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v as AxisCategory })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Nom *</Label>
                      <Input
                        placeholder="Nom de l'axe de recherche"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Sous-titre</Label>
                      <Input
                        placeholder="Sous-titre ou accroche"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v as AxisStatus })}
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
                      <Label>Priorité</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(v) => setFormData({ ...formData, priority: v as AxisPriority })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(priorityLabels).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Progression ({formData.progressPercent}%)</Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progressPercent}
                        onChange={(e) => setFormData({ ...formData, progressPercent: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Description détaillée de l'axe..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Objectifs</Label>
                      <Textarea
                        placeholder="Objectifs de recherche..."
                        value={formData.objectives}
                        onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Méthodologie</Label>
                      <Textarea
                        placeholder="Approche méthodologique..."
                        value={formData.methodology}
                        onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      setSelectedAxis(null);
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

          {/* Statistiques améliorées */}
          {stats && (
            <div className="space-y-6 mb-8">
              {/* Barre de progression globale */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Progression globale du projet</h3>
                      <p className="text-sm text-muted-foreground">Moyenne de tous les axes de recherche</p>
                    </div>
                    <div className="text-3xl font-bold text-primary">{stats.averageProgress}%</div>
                  </div>
                  <Progress value={stats.averageProgress} className="h-3" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Début</span>
                    <span>Objectif 2035</span>
                  </div>
                </CardContent>
              </Card>

              {/* Grille de statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" />
                      <CardTitle className="text-2xl">{stats.total}</CardTitle>
                    </div>
                    <CardDescription>Axes de recherche</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-2xl">
                        {stats.byStatus?.find((s: any) => s.status === "en_cours")?.count || 0}
                      </CardTitle>
                    </div>
                    <CardDescription>En cours</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-2xl">
                        {stats.byStatus?.find((s: any) => s.status === "termine")?.count || 0}
                      </CardTitle>
                    </div>
                    <CardDescription>Terminés</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <PauseCircle className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-2xl">
                        {stats.byStatus?.find((s: any) => s.status === "pause")?.count || 0}
                      </CardTitle>
                    </div>
                    <CardDescription>En pause</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-slate-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-slate-500" />
                      <CardTitle className="text-2xl">
                        {stats.byStatus?.find((s: any) => s.status === "planifie")?.count || 0}
                      </CardTitle>
                    </div>
                    <CardDescription>Planifiés</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Répartition par catégorie */}
              {stats.byCategory && stats.byCategory.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Répartition par catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {stats.byCategory.map((cat: any) => (
                        <Badge 
                          key={cat.category} 
                          variant="outline" 
                          className="flex items-center gap-1"
                        >
                          {categoryLabels[cat.category as AxisCategory]?.icon}
                          {categoryLabels[cat.category as AxisCategory]?.label || cat.category}
                          <span className="ml-1 bg-muted px-1.5 py-0.5 rounded text-xs">
                            {cat.count}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un axe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {Object.entries(categoryLabels).map(([key, { label }]) => (
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
          </div>

          {/* Liste des axes */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          ) : filteredAxes && filteredAxes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAxes.map((axis: any) => (
                <Card 
                  key={axis.id} 
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                  style={{ borderTopColor: axis.color, borderTopWidth: '4px' }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${categoryLabels[axis.category as AxisCategory]?.color || 'bg-gray-500'} text-white`}
                        >
                          {categoryLabels[axis.category as AxisCategory]?.icon}
                          <span className="ml-1">{categoryLabels[axis.category as AxisCategory]?.label}</span>
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={priorityLabels[axis.priority as AxisPriority]?.color}
                        >
                          {priorityLabels[axis.priority as AxisPriority]?.icon}
                        </Badge>
                      </div>
                      <Badge 
                        className={`${statusLabels[axis.status as AxisStatus]?.color || 'bg-gray-500'} text-white`}
                      >
                        {statusLabels[axis.status as AxisStatus]?.icon}
                        <span className="ml-1">{statusLabels[axis.status as AxisStatus]?.label}</span>
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs font-mono text-muted-foreground">{axis.axisCode}</span>
                      <CardTitle className="text-lg mt-1">{axis.name}</CardTitle>
                      {axis.subtitle && (
                        <CardDescription className="mt-1">{axis.subtitle}</CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {axis.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {axis.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{axis.progressPercent || 0}%</span>
                      </div>
                      <Progress value={axis.progressPercent || 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <Link href={`/axes-recherche/${axis.axisCode}`}>
                        <Button variant="ghost" size="sm">
                          Voir les entrées
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      {user && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(axis)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Supprimer cet axe et toutes ses entrées ?")) {
                                deleteMutation.mutate(axis.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun axe de recherche</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                    ? "Aucun axe ne correspond à vos critères"
                    : "Commencez par créer votre premier axe de recherche"}
                </p>
                {user && !searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un axe
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
