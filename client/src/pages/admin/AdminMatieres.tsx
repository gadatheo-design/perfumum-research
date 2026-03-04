// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Edit, 
  Search, 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  AlertTriangle,
  Trash2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

const TYPES_MATIERE = [
  { value: "huile_essentielle", label: "Huile essentielle" },
  { value: "absolu", label: "Absolu" },
  { value: "resinoid", label: "Résinoïde" },
  { value: "concrete", label: "Concrète" },
  { value: "co2", label: "CO2" },
  { value: "teinture", label: "Teinture" },
  { value: "poudre", label: "Poudre" },
  { value: "alcoolat", label: "Alcoolat" },
  { value: "autre", label: "Autre" },
];

const NOTES = [
  { value: "tete", label: "Tête" },
  { value: "coeur", label: "Cœur" },
  { value: "fond", label: "Fond" },
  { value: "tete_coeur", label: "Tête-Cœur" },
  { value: "coeur_fond", label: "Cœur-Fond" },
];

const EXTRACTION_METHODS = [
  { value: "distillation", label: "Distillation" },
  { value: "extraction_solvant", label: "Extraction solvant" },
  { value: "co2_supercritique", label: "CO2 supercritique" },
  { value: "expression", label: "Expression" },
  { value: "teinture", label: "Teinture" },
  { value: "autre", label: "Autre" },
];

const STATUS = [
  { value: "en_stock", label: "En stock", color: "bg-green-500/20 text-green-700" },
  { value: "a_commander", label: "À commander", color: "bg-yellow-500/20 text-yellow-700" },
  { value: "epuise", label: "Épuisé", color: "bg-red-500/20 text-red-700" },
];

export default function AdminMatieres() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    botanicalName: "",
    type: "",
    olfactiveFamily: "",
    note: "",
    origin: "",
    extractionMethod: "",
    olfactiveProfile: "",
    character: "",
    supplier: "",
    pricePerMl: "",
    stock: "",
    status: "en_stock",
    technicalNotes: "",
    manipulationNotes: "",
  });

  const utils = trpc.useUtils();
  const { data: matieres, isLoading } = trpc.laboratoire.list.useQuery();

  // Mutations
  const createMutation = trpc.laboratoire.create.useMutation({
    onSuccess: () => {
      toast.success("Matière première créée avec succès");
      utils.laboratoire.list.invalidate();
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.laboratoire.update.useMutation({
    onSuccess: () => {
      toast.success("Matière première mise à jour avec succès");
      utils.laboratoire.list.invalidate();
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.laboratoire.delete.useMutation({
    onSuccess: () => {
      toast.success("Matière première supprimée avec succès");
      utils.laboratoire.list.invalidate();
      setDeleteDialogOpen(false);
      setSelectedMatiere(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      botanicalName: "",
      type: "",
      olfactiveFamily: "",
      note: "",
      origin: "",
      extractionMethod: "",
      olfactiveProfile: "",
      character: "",
      supplier: "",
      pricePerMl: "",
      stock: "",
      status: "en_stock",
      technicalNotes: "",
      manipulationNotes: "",
    });
    setSelectedMatiere(null);
  };

  // Filtrage et pagination
  const filteredMatieres = matieres?.filter((m) => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.botanicalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.origin?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || m.type === filterType;
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const totalPages = Math.ceil(filteredMatieres.length / ITEMS_PER_PAGE);
  const paginatedMatieres = filteredMatieres.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (matiere: any) => {
    setSelectedMatiere(matiere);
    setFormData({
      name: matiere.name || "",
      botanicalName: matiere.botanicalName || "",
      type: matiere.type || "",
      olfactiveFamily: matiere.olfactiveFamily || "",
      note: matiere.note || "",
      origin: matiere.origin || "",
      extractionMethod: matiere.extractionMethod || "",
      olfactiveProfile: matiere.olfactiveProfile || "",
      character: matiere.character || "",
      supplier: matiere.supplier || "",
      pricePerMl: matiere.pricePerMl?.toString() || "",
      stock: matiere.stock?.toString() || "",
      status: matiere.status || "en_stock",
      technicalNotes: matiere.technicalNotes || "",
      manipulationNotes: matiere.manipulationNotes || "",
    });
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleDelete = (matiere: any) => {
    setSelectedMatiere(matiere);
    setDeleteDialogOpen(true);
  };

  const handleSaveCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    if (!formData.type) {
      toast.error("Le type est requis");
      return;
    }
    createMutation.mutate({
      name: formData.name,
      botanicalName: formData.botanicalName || undefined,
      type: formData.type as any,
      olfactiveFamily: formData.olfactiveFamily || undefined,
      note: formData.note ? formData.note as any : undefined,
      origin: formData.origin || undefined,
      extractionMethod: formData.extractionMethod ? formData.extractionMethod as any : undefined,
      olfactiveProfile: formData.olfactiveProfile || undefined,
      character: formData.character || undefined,
      supplier: formData.supplier || undefined,
      pricePerMl: formData.pricePerMl ? parseFloat(formData.pricePerMl) : undefined,
      stock: formData.stock ? parseFloat(formData.stock) : undefined,
      status: formData.status as any,
      technicalNotes: formData.technicalNotes || undefined,
      manipulationNotes: formData.manipulationNotes || undefined,
    });
  };

  const handleSaveUpdate = () => {
    if (!selectedMatiere || !formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    updateMutation.mutate({
      id: selectedMatiere.id,
      name: formData.name,
      botanicalName: formData.botanicalName || undefined,
      type: formData.type ? formData.type as any : undefined,
      olfactiveFamily: formData.olfactiveFamily || undefined,
      note: formData.note ? formData.note as any : undefined,
      origin: formData.origin || undefined,
      extractionMethod: formData.extractionMethod ? formData.extractionMethod as any : undefined,
      olfactiveProfile: formData.olfactiveProfile || undefined,
      character: formData.character || undefined,
      supplier: formData.supplier || undefined,
      pricePerMl: formData.pricePerMl ? parseFloat(formData.pricePerMl) : undefined,
      stock: formData.stock ? parseFloat(formData.stock) : undefined,
      status: formData.status ? formData.status as any : undefined,
      technicalNotes: formData.technicalNotes || undefined,
      manipulationNotes: formData.manipulationNotes || undefined,
    });
  };

  const handleConfirmDelete = () => {
    if (selectedMatiere) {
      deleteMutation.mutate(selectedMatiere.id);
    }
  };

  const getTypeLabel = (type: string | null) => {
    if (!type) return null;
    const found = TYPES_MATIERE.find(t => t.value === type);
    return found?.label || type;
  };

  const getNoteLabel = (note: string | null) => {
    if (!note) return null;
    const found = NOTES.find(n => n.value === note);
    return found?.label || note;
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    const found = STATUS.find(s => s.value === status);
    return found ? (
      <Badge className={found.color}>{found.label}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  // Statistiques rapides
  const stats = {
    total: matieres?.length || 0,
    enStock: matieres?.filter(m => m.status === "en_stock").length || 0,
    aCommander: matieres?.filter(m => m.status === "a_commander").length || 0,
    epuise: matieres?.filter(m => m.status === "epuise").length || 0,
  };

  const isLoading_mutations = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* Header avec navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Gestion des Matières Premières</h1>
                <p className="text-muted-foreground">
                  {matieres?.length || 0} matières dans l'inventaire
                </p>
              </div>
            </div>
            <Button className="btn-enhanced" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle matière
            </Button>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.enStock}</p>
                    <p className="text-xs text-muted-foreground">En stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.aCommander}</p>
                    <p className="text-xs text-muted-foreground">À commander</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.epuise}</p>
                    <p className="text-xs text-muted-foreground">Épuisé</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recherche et filtres */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Rechercher et filtrer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, nom botanique ou origine..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {TYPES_MATIERE.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tableau des matières */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des matières premières</CardTitle>
              <CardDescription>
                {filteredMatieres.length} matières trouvées
                {searchTerm && ` pour "${searchTerm}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMatieres.map((matiere) => (
                      <TableRow key={matiere.id}>
                        <TableCell className="font-mono text-sm">
                          {matiere.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="font-medium">{matiere.name}</span>
                              {matiere.botanicalName && (
                                <p className="text-xs text-muted-foreground italic">
                                  {matiere.botanicalName}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {matiere.type && (
                            <Badge variant="outline">
                              {getTypeLabel(matiere.type)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {matiere.note && (
                            <Badge variant="secondary">
                              {getNoteLabel(matiere.note)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {matiere.origin || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {matiere.stock ? `${matiere.stock} ml` : "-"}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(matiere.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/laboratoire/${matiere.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(matiere)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Éditer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(matiere)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog d'édition */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la matière première</DialogTitle>
            <DialogDescription>
              {selectedMatiere?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="botanicalName">Nom botanique</Label>
                <Input
                  id="botanicalName"
                  value={formData.botanicalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, botanicalName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {TYPES_MATIERE.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note olfactive</Label>
                <Select
                  value={formData.note || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, note: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {NOTES.map((note) => (
                      <SelectItem key={note.value} value={note.value}>
                        {note.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="extractionMethod">Méthode d'extraction</Label>
                <Select
                  value={formData.extractionMethod || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, extractionMethod: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {EXTRACTION_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="olfactiveFamily">Famille olfactive</Label>
                <Input
                  id="olfactiveFamily"
                  value={formData.olfactiveFamily}
                  onChange={(e) => setFormData(prev => ({ ...prev, olfactiveFamily: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origine</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock (ml)</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerMl">Prix/ml (€)</Label>
                <Input
                  id="pricePerMl"
                  type="number"
                  step="0.01"
                  value={formData.pricePerMl}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerMl: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="olfactiveProfile">Profil olfactif</Label>
              <Textarea
                id="olfactiveProfile"
                value={formData.olfactiveProfile}
                onChange={(e) => setFormData(prev => ({ ...prev, olfactiveProfile: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalNotes">Notes techniques</Label>
              <Textarea
                id="technicalNotes"
                value={formData.technicalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, technicalNotes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manipulationNotes">Notes de manipulation</Label>
              <Textarea
                id="manipulationNotes"
                value={formData.manipulationNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, manipulationNotes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isLoading_mutations}>
              Annuler
            </Button>
            <Button onClick={handleSaveUpdate} className="btn-enhanced" disabled={isLoading_mutations}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une matière première</DialogTitle>
            <DialogDescription>
              Renseignez les informations de la nouvelle matière
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nom *</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la matière"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-botanicalName">Nom botanique</Label>
                <Input
                  id="create-botanicalName"
                  value={formData.botanicalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, botanicalName: e.target.value }))}
                  placeholder="Nom latin"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-type">Type *</Label>
                <Select
                  value={formData.type || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sélectionner</SelectItem>
                    {TYPES_MATIERE.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-note">Note olfactive</Label>
                <Select
                  value={formData.note || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, note: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {NOTES.map((note) => (
                      <SelectItem key={note.value} value={note.value}>
                        {note.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-origin">Origine</Label>
                <Input
                  id="create-origin"
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder="Pays/Région"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-olfactiveProfile">Profil olfactif</Label>
              <Textarea
                id="create-olfactiveProfile"
                value={formData.olfactiveProfile}
                onChange={(e) => setFormData(prev => ({ ...prev, olfactiveProfile: e.target.value }))}
                rows={2}
                placeholder="Description olfactive..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isLoading_mutations}>
              Annuler
            </Button>
            <Button onClick={handleSaveCreate} className="btn-enhanced" disabled={!formData.name || !formData.type || isLoading_mutations}>
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer la matière
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la matière première "{selectedMatiere?.name}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
