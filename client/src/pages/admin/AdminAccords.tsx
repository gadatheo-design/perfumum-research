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
  Layers, 
  Edit, 
  Search, 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

const TEXTURES = [
  { value: "sec", label: "Sec" },
  { value: "humide", label: "Humide" },
  { value: "lactone", label: "Lactone" },
  { value: "resine", label: "Résine" },
  { value: "pierre", label: "Pierre" },
  { value: "air", label: "Air" },
];

export default function AdminAccords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccord, setSelectedAccord] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    olfactiveProfile: "",
    emotionalResonance: "",
    texture: "",
    notes: "",
    familyId: null as number | null,
  });

  const utils = trpc.useUtils();
  const { data: accords, isLoading } = trpc.accords?.list.useQuery();
  const { data: families } = trpc.families?.list.useQuery();

  // Mutations
  const createMutation = trpc.accords?.create.useMutation({
    onSuccess: () => {
      toast.success("Accord créé avec succès");
      utils.accords?.list.invalidate();
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.accords?.update.useMutation({
    onSuccess: () => {
      toast.success("Accord mis à jour avec succès");
      utils.accords?.list.invalidate();
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.accords?.delete.useMutation({
    onSuccess: () => {
      toast.success("Accord supprimé avec succès");
      utils.accords?.list.invalidate();
      setDeleteDialogOpen(false);
      setSelectedAccord(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      olfactiveProfile: "",
      emotionalResonance: "",
      texture: "",
      notes: "",
      familyId: null,
    });
    setSelectedAccord(null);
  };

  // Filtrage et pagination
  const filteredAccords = accords?.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.olfactiveProfile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.texture?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredAccords.length / ITEMS_PER_PAGE);
  const paginatedAccords = filteredAccords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (accord: any) => {
    setSelectedAccord(accord);
    setFormData({
      name: accord.name || "",
      olfactiveProfile: accord.olfactiveProfile || "",
      emotionalResonance: accord.emotionalResonance || "",
      texture: accord.texture || "",
      notes: accord.notes || "",
      familyId: accord.familyId || null,
    });
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleDelete = (accord: any) => {
    setSelectedAccord(accord);
    setDeleteDialogOpen(true);
  };

  const handleSaveCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    createMutation.mutate({
      name: formData.name,
      familyId: formData.familyId,
      olfactiveProfile: formData.olfactiveProfile || undefined,
      emotionalResonance: formData.emotionalResonance || undefined,
      texture: formData.texture || undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleSaveUpdate = () => {
    if (!selectedAccord || !formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    updateMutation.mutate({
      id: selectedAccord.id,
      name: formData.name,
      familyId: formData.familyId,
      olfactiveProfile: formData.olfactiveProfile || undefined,
      emotionalResonance: formData.emotionalResonance || undefined,
      texture: formData.texture || undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleConfirmDelete = () => {
    if (selectedAccord) {
      deleteMutation.mutate(selectedAccord.id);
    }
  };

  const getTextureLabel = (texture: string | null) => {
    if (!texture) return null;
    const found = TEXTURES.find(t => t.value === texture);
    return found?.label || texture;
  };

  const getFamilyName = (familyId: number | null) => {
    if (!familyId || !families) return null;
    const family = families?.find(f => f.id === familyId);
    return family?.name || null;
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
                <h1 className="text-4xl font-bold">Gestion des Accords</h1>
                <p className="text-muted-foreground">
                  {accords?.length || 0} accords olfactifs dans la base de données
                </p>
              </div>
            </div>
            <Button className="btn-enhanced" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel accord
            </Button>
          </div>

          {/* Recherche */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, profil olfactif ou texture..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tableau des accords */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des accords</CardTitle>
              <CardDescription>
                {filteredAccords.length} accords trouvés
                {searchTerm && ` pour "${searchTerm}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Famille</TableHead>
                      <TableHead>Texture</TableHead>
                      <TableHead>Profil olfactif</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAccords.map((accord) => (
                      <TableRow key={accord.id}>
                        <TableCell className="font-mono text-sm">
                          {accord.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{accord.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getFamilyName(accord.familyId) && (
                            <Badge variant="outline">
                              {getFamilyName(accord.familyId)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {accord.texture && (
                            <Badge variant="secondary">
                              {getTextureLabel(accord.texture)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {accord.olfactiveProfile || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(accord)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Éditer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(accord)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'accord</DialogTitle>
            <DialogDescription>
              {selectedAccord?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="family">Famille olfactive</Label>
                <Select
                  value={formData.familyId?.toString() || "none"}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    familyId: value === "none" ? null : parseInt(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une famille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {families?.map((family) => (
                      <SelectItem key={family.id} value={family.id.toString()}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="texture">Texture</Label>
                <Select
                  value={formData.texture || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, texture: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une texture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {TEXTURES.map((texture) => (
                      <SelectItem key={texture.value} value={texture.value}>
                        {texture.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="olfactiveProfile">Profil olfactif</Label>
              <Textarea
                id="olfactiveProfile"
                value={formData.olfactiveProfile}
                onChange={(e) => setFormData(prev => ({ ...prev, olfactiveProfile: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotionalResonance">Résonance émotionnelle</Label>
              <Textarea
                id="emotionalResonance"
                value={formData.emotionalResonance}
                onChange={(e) => setFormData(prev => ({ ...prev, emotionalResonance: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes internes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouvel accord</DialogTitle>
            <DialogDescription>
              Définissez les propriétés du nouvel accord olfactif
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nom *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de l'accord"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-family">Famille olfactive</Label>
                <Select
                  value={formData.familyId?.toString() || "none"}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    familyId: value === "none" ? null : parseInt(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une famille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {families?.map((family) => (
                      <SelectItem key={family.id} value={family.id.toString()}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-texture">Texture</Label>
                <Select
                  value={formData.texture || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, texture: value === "none" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une texture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {TEXTURES.map((texture) => (
                      <SelectItem key={texture.value} value={texture.value}>
                        {texture.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-olfactiveProfile">Profil olfactif</Label>
              <Textarea
                id="create-olfactiveProfile"
                value={formData.olfactiveProfile}
                onChange={(e) => setFormData(prev => ({ ...prev, olfactiveProfile: e.target.value }))}
                rows={3}
                placeholder="Description du profil olfactif..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-emotionalResonance">Résonance émotionnelle</Label>
              <Textarea
                id="create-emotionalResonance"
                value={formData.emotionalResonance}
                onChange={(e) => setFormData(prev => ({ ...prev, emotionalResonance: e.target.value }))}
                rows={2}
                placeholder="Émotions et sensations évoquées..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isLoading_mutations}>
              Annuler
            </Button>
            <Button onClick={handleSaveCreate} className="btn-enhanced" disabled={!formData.name || isLoading_mutations}>
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer l'accord
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
              Êtes-vous sûr de vouloir supprimer l'accord "{selectedAccord?.name}" ?
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
