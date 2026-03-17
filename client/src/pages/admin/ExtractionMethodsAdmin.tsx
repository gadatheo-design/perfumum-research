import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Pencil, Trash2, FlaskConical, ChevronDown, ChevronUp, Info
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category =
  | "distillation" | "expression" | "extraction_solvant" | "co2_supercritique"
  | "enfleurage" | "maceration" | "hydrodistillation" | "percolation" | "other";

type CostLevel = "low" | "medium" | "high" | "very_high";
type ComplexityLevel = "simple" | "moderate" | "complex" | "expert";

interface ExtractionMethod {
  method_id: string;
  name: string;
  short_name?: string;
  category: Category;
  description?: string;
  principle?: string;
  parameters?: Record<string, any>;
  equipment?: string[];
  typical_yields?: Record<string, any>;
  molecular_impact?: string;
  preserved_molecules?: string[];
  degraded_molecules?: string[];
  advantages?: string[];
  disadvantages?: string[];
  best_for?: string[];
  not_recommended_for?: string[];
  cost_level?: CostLevel;
  complexity_level?: ComplexityLevel;
  notes?: string;
  references?: string[];
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<Category, string> = {
  distillation: "Distillation",
  expression: "Expression à froid",
  extraction_solvant: "Extraction solvants",
  co2_supercritique: "CO₂ supercritique",
  enfleurage: "Enfleurage",
  maceration: "Macération",
  hydrodistillation: "Hydrodistillation",
  percolation: "Percolation",
  other: "Autre",
};

const CATEGORY_COLORS: Record<Category, string> = {
  distillation: "bg-blue-100 text-blue-800",
  expression: "bg-yellow-100 text-yellow-800",
  extraction_solvant: "bg-purple-100 text-purple-800",
  co2_supercritique: "bg-green-100 text-green-800",
  enfleurage: "bg-pink-100 text-pink-800",
  maceration: "bg-orange-100 text-orange-800",
  hydrodistillation: "bg-cyan-100 text-cyan-800",
  percolation: "bg-teal-100 text-teal-800",
  other: "bg-gray-100 text-gray-800",
};

const COST_LABELS: Record<CostLevel, string> = {
  low: "Faible", medium: "Moyen", high: "Élevé", very_high: "Très élevé"
};
const COMPLEXITY_LABELS: Record<ComplexityLevel, string> = {
  simple: "Simple", moderate: "Modéré", complex: "Complexe", expert: "Expert"
};

// ─── Formulaire vide ──────────────────────────────────────────────────────────

const emptyForm = (): Partial<ExtractionMethod> => ({
  method_id: "",
  name: "",
  short_name: "",
  category: "distillation",
  description: "",
  principle: "",
  molecular_impact: "",
  advantages: [],
  disadvantages: [],
  best_for: [],
  not_recommended_for: [],
  preserved_molecules: [],
  degraded_molecules: [],
  equipment: [],
  cost_level: "medium",
  complexity_level: "moderate",
  notes: "",
  references: [],
});

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ExtractionMethodsAdmin() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: methods = [], isLoading } = trpc.extractionMethodsAdmin.getAll.useQuery();
  const { data: stats } = trpc.extractionMethodsAdmin.getStats.useQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ExtractionMethod | null>(null);
  const [form, setForm] = useState<Partial<ExtractionMethod>>(emptyForm());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const createMutation = trpc.extractionMethodsAdmin.create.useMutation({
    onSuccess: () => {
      utils.extractionMethodsAdmin.getAll.invalidate();
      utils.extractionMethodsAdmin.getStats.invalidate();
      toast({ title: "Méthode créée", description: `"${form.name}" ajoutée avec succès.` });
      setIsDialogOpen(false);
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const updateMutation = trpc.extractionMethodsAdmin.update.useMutation({
    onSuccess: () => {
      utils.extractionMethodsAdmin.getAll.invalidate();
      toast({ title: "Méthode mise à jour", description: `"${form.name}" modifiée.` });
      setIsDialogOpen(false);
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = trpc.extractionMethodsAdmin.delete.useMutation({
    onSuccess: () => {
      utils.extractionMethodsAdmin.getAll.invalidate();
      utils.extractionMethodsAdmin.getStats.invalidate();
      toast({ title: "Méthode supprimée" });
      setDeleteConfirm(null);
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  // ── Helpers formulaire ────────────────────────────────────────────────────────

  const parseArray = (val: string): string[] =>
    val.split("\n").map(s => s.trim()).filter(Boolean);

  const serializeArray = (arr?: string[]): string =>
    (arr || []).join("\n");

  const openCreate = () => {
    setEditingMethod(null);
    setForm(emptyForm());
    setIsDialogOpen(true);
  };

  const openEdit = (m: ExtractionMethod) => {
    setEditingMethod(m);
    setForm({
      ...m,
      parameters: m.parameters || {},
      equipment: m.equipment || [],
      advantages: m.advantages || [],
      disadvantages: m.disadvantages || [],
      best_for: m.best_for || [],
      not_recommended_for: m.not_recommended_for || [],
      preserved_molecules: m.preserved_molecules || [],
      degraded_molecules: m.degraded_molecules || [],
      references: m.references || [],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.method_id || !form.name || !form.category) {
      toast({ title: "Champs requis", description: "ID, nom et catégorie sont obligatoires.", variant: "destructive" });
      return;
    }
    const payload = {
      methodId: form.method_id!,
      name: form.name!,
      shortName: form.short_name,
      category: form.category as Category,
      description: form.description,
      principle: form.principle,
      molecularImpact: form.molecular_impact,
      advantages: form.advantages,
      disadvantages: form.disadvantages,
      bestFor: form.best_for,
      notRecommendedFor: form.not_recommended_for,
      preservedMolecules: form.preserved_molecules,
      degradedMolecules: form.degraded_molecules,
      equipment: form.equipment,
      costLevel: form.cost_level as CostLevel,
      complexityLevel: form.complexity_level as ComplexityLevel,
      notes: form.notes,
      references: form.references,
    };

    if (editingMethod) {
      updateMutation.mutate({ ...payload, originalMethodId: editingMethod.method_id });
    } else {
      createMutation.mutate(payload);
    }
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-emerald-600" />
            Méthodes d'Extraction
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérer les méthodes d'extraction pour les plantes aromatiques
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nouvelle méthode
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Méthodes enregistrées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{stats.withPlantLinks}</div>
              <div className="text-sm text-muted-foreground">Liées à des plantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{stats.byCategory?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Catégories utilisées</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des méthodes */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Chargement…</div>
      ) : (
        <div className="space-y-3">
          {(methods as ExtractionMethod[]).map((m) => (
            <Card key={m.method_id} className="overflow-hidden">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono shrink-0">
                      {m.method_id}
                    </code>
                    <span className="font-semibold truncate">{m.name}</span>
                    <Badge className={`text-xs shrink-0 ${CATEGORY_COLORS[m.category] || "bg-gray-100 text-gray-800"}`}>
                      {CATEGORY_LABELS[m.category] || m.category}
                    </Badge>
                    {m.cost_level && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        Coût : {COST_LABELS[m.cost_level]}
                      </span>
                    )}
                    {m.complexity_level && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        Complexité : {COMPLEXITY_LABELS[m.complexity_level]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setExpandedId(expandedId === m.method_id ? null : m.method_id)}
                    >
                      {expandedId === m.method_id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(m)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteConfirm(m.method_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedId === m.method_id && (
                <CardContent className="pt-0 pb-4 px-4 border-t space-y-3 text-sm">
                  {m.description && (
                    <div>
                      <span className="font-medium text-muted-foreground">Description : </span>
                      {m.description}
                    </div>
                  )}
                  {m.principle && (
                    <div>
                      <span className="font-medium text-muted-foreground">Principe : </span>
                      {m.principle}
                    </div>
                  )}
                  {m.molecular_impact && (
                    <div>
                      <span className="font-medium text-muted-foreground">Impact moléculaire : </span>
                      {m.molecular_impact}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {m.advantages && m.advantages.length > 0 && (
                      <div>
                        <div className="font-medium text-green-700 mb-1">Avantages</div>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {m.advantages.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                    {m.disadvantages && m.disadvantages.length > 0 && (
                      <div>
                        <div className="font-medium text-red-700 mb-1">Inconvénients</div>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {m.disadvantages.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  {m.preserved_molecules && m.preserved_molecules.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">Molécules préservées : </span>
                      {m.preserved_molecules.join(", ")}
                    </div>
                  )}
                  {m.degraded_molecules && m.degraded_molecules.length > 0 && (
                    <div>
                      <span className="font-medium text-muted-foreground">Molécules dégradées : </span>
                      {m.degraded_molecules.join(", ")}
                    </div>
                  )}
                  {m.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 flex gap-2">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="text-amber-800">{m.notes}</span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Dialog création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? `Modifier : ${editingMethod.name}` : "Nouvelle méthode d'extraction"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Identifiants */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">ID méthode *</label>
                <Input
                  placeholder="EXT-DIST-VAP"
                  value={form.method_id || ""}
                  onChange={e => setForm(f => ({ ...f, method_id: e.target.value.toUpperCase() }))}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">Format : EXT-CATEGORIE-VARIANTE</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Nom court</label>
                <Input
                  placeholder="Distillation vapeur"
                  value={form.short_name || ""}
                  onChange={e => setForm(f => ({ ...f, short_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Nom complet *</label>
              <Input
                placeholder="Distillation à la vapeur d'eau"
                value={form.name || ""}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Catégorie *</label>
                <Select
                  value={form.category || "distillation"}
                  onValueChange={v => setForm(f => ({ ...f, category: v as Category }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Coût</label>
                <Select
                  value={form.cost_level || "medium"}
                  onValueChange={v => setForm(f => ({ ...f, cost_level: v as CostLevel }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(COST_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Complexité</label>
                <Select
                  value={form.complexity_level || "moderate"}
                  onValueChange={v => setForm(f => ({ ...f, complexity_level: v as ComplexityLevel }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPLEXITY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Description générale de la méthode…"
                value={form.description || ""}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Principe scientifique</label>
              <Textarea
                placeholder="Principe physico-chimique sous-jacent…"
                value={form.principle || ""}
                onChange={e => setForm(f => ({ ...f, principle: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Impact moléculaire</label>
              <Textarea
                placeholder="Effet sur les molécules aromatiques (dégradation thermique, perte de composés légers…)"
                value={form.molecular_impact || ""}
                onChange={e => setForm(f => ({ ...f, molecular_impact: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Avantages (1 par ligne)</label>
                <Textarea
                  placeholder="Préserve les composés thermosensibles&#10;Pas de résidu solvant&#10;…"
                  value={serializeArray(form.advantages)}
                  onChange={e => setForm(f => ({ ...f, advantages: parseArray(e.target.value) }))}
                  rows={4}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Inconvénients (1 par ligne)</label>
                <Textarea
                  placeholder="Coût élevé&#10;Rendement faible&#10;…"
                  value={serializeArray(form.disadvantages)}
                  onChange={e => setForm(f => ({ ...f, disadvantages: parseArray(e.target.value) }))}
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Molécules préservées (1 par ligne)</label>
                <Textarea
                  placeholder="Linalol&#10;Géraniol&#10;Esters…"
                  value={serializeArray(form.preserved_molecules)}
                  onChange={e => setForm(f => ({ ...f, preserved_molecules: parseArray(e.target.value) }))}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Molécules dégradées (1 par ligne)</label>
                <Textarea
                  placeholder="Composés thermolabiles&#10;Aldéhydes légers…"
                  value={serializeArray(form.degraded_molecules)}
                  onChange={e => setForm(f => ({ ...f, degraded_molecules: parseArray(e.target.value) }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Recommandé pour (1 par ligne)</label>
                <Textarea
                  placeholder="Fleurs délicates&#10;Résines&#10;…"
                  value={serializeArray(form.best_for)}
                  onChange={e => setForm(f => ({ ...f, best_for: parseArray(e.target.value) }))}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Déconseillé pour (1 par ligne)</label>
                <Textarea
                  placeholder="Plantes très humides&#10;Composés instables…"
                  value={serializeArray(form.not_recommended_for)}
                  onChange={e => setForm(f => ({ ...f, not_recommended_for: parseArray(e.target.value) }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Notes complémentaires</label>
              <Textarea
                placeholder="Informations supplémentaires, variantes, précautions…"
                value={form.notes || ""}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Références bibliographiques (1 par ligne)</label>
              <Textarea
                placeholder="Patel et al. (2021) — Extraction methods for natural aromatic compounds&#10;…"
                value={serializeArray(form.references)}
                onChange={e => setForm(f => ({ ...f, references: parseArray(e.target.value) }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingMethod ? "Enregistrer les modifications" : "Créer la méthode"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog confirmation suppression */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer la méthode <code className="font-mono">{deleteConfirm}</code> ?
            Cette action est irréversible. Si des plantes utilisent cette méthode, la suppression sera bloquée.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate({ methodId: deleteConfirm })}
              disabled={deleteMutation.isPending}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
