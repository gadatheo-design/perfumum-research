// @ts-nocheck
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RecetteFormData = {
  name: string;
  category: "tabac" | "resine" | "resine_cbd" | "cone" | "parfum" | "encens" | "extrait";
  description?: string;
  ingredients?: string;
  formula?: string;
  protocol?: string;
  notes?: string;
  texture?: string;
  intensity?: number;
  stability?: "low" | "medium" | "high";
  status?: "experimental" | "testing" | "validated" | "production";
  notesTete?: string;
  notesCoeur?: string;
  notesFond?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  tabac: "Tabac",
  resine: "Résine",
  resine_cbd: "Résine CBD",
  cone: "Cône",
  parfum: "Parfum",
  encens: "Encens",
  extrait: "Extrait",
};

const STATUS_LABELS: Record<string, string> = {
  experimental: "Expérimental",
  testing: "Test",
  validated: "Validé",
  production: "Production",
};

const STATUS_COLORS: Record<string, string> = {
  experimental: "bg-yellow-500/10 text-yellow-500",
  testing: "bg-blue-500/10 text-blue-500",
  validated: "bg-green-500/10 text-green-500",
  production: "bg-purple-500/10 text-purple-500",
};

export default function AdminRecettes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecette, setEditingRecette] = useState<number | null>(null);
  const [formData, setFormData] = useState<RecetteFormData>({
    name: "",
    category: "parfum",
    status: "experimental",
  });

  const utils = trpc.useUtils();
  const { data: recettes, isLoading } = trpc.recettes?.list.useQuery();

  const createMutation = trpc.recettes?.create.useMutation({
    onSuccess: () => {
      utils.recettes?.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = trpc.recettes?.update.useMutation({
    onSuccess: () => {
      utils.recettes?.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = trpc.recettes?.delete.useMutation({
    onSuccess: () => {
      utils.recettes?.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "parfum",
      status: "experimental",
    });
    setEditingRecette(null);
  };

  const handleOpenDialog = (recette?: any) => {
    if (recette) {
      setEditingRecette(recette.id);
      setFormData({
        name: recette.name,
        category: recette.category,
        description: recette.description || "",
        ingredients: recette.ingredients || "",
        formula: recette.formula || "",
        protocol: recette.protocol || "",
        notes: recette.notes || "",
        texture: recette.texture || "",
        intensity: recette.intensity || undefined,
        stability: recette.stability || undefined,
        status: recette.status || "experimental",
        notesTete: recette.notesTete || "",
        notesCoeur: recette.notesCoeur || "",
        notesFond: recette.notesFond || "",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRecette) {
      updateMutation.mutate({
        id: editingRecette,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Recettes</h1>
          <p className="text-muted-foreground mt-1">
            {recettes?.length || 0} recettes au total
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Recette
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Intensité</TableHead>
              <TableHead>Stabilité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recettes?.map((recette) => (
              <TableRow key={recette.id}>
                <TableCell className="font-medium">{recette.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {CATEGORY_LABELS[recette.category]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[recette.status || "experimental"]}>
                    {STATUS_LABELS[recette.status || "experimental"]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {recette.intensity ? `${recette.intensity}/10` : "-"}
                </TableCell>
                <TableCell>
                  {recette.stability ? (
                    <Badge variant="secondary">
                      {recette.stability === "low" && "Faible"}
                      {recette.stability === "medium" && "Moyenne"}
                      {recette.stability === "high" && "Élevée"}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(recette)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(recette.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecette ? "Modifier la recette" : "Nouvelle recette"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de la recette
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensité (1-10)</Label>
                <Input
                  id="intensity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.intensity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      intensity: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stability">Stabilité</Label>
                <Select
                  value={formData.stability || ""}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, stability: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingrédients</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formula">Formule</Label>
              <Textarea
                id="formula"
                value={formData.formula}
                onChange={(e) =>
                  setFormData({ ...formData, formula: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol">Protocole</Label>
              <Textarea
                id="protocol"
                value={formData.protocol}
                onChange={(e) =>
                  setFormData({ ...formData, protocol: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notesTete">Notes de Tête</Label>
                <Textarea
                  id="notesTete"
                  value={formData.notesTete}
                  onChange={(e) =>
                    setFormData({ ...formData, notesTete: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notesCoeur">Notes de Cœur</Label>
                <Textarea
                  id="notesCoeur"
                  value={formData.notesCoeur}
                  onChange={(e) =>
                    setFormData({ ...formData, notesCoeur: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notesFond">Notes de Fond</Label>
                <Textarea
                  id="notesFond"
                  value={formData.notesFond}
                  onChange={(e) =>
                    setFormData({ ...formData, notesFond: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes additionnelles</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingRecette ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
