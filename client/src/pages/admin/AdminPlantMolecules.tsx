// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Leaf,
  Beaker,
  Search,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Star,
  StarOff,
  FlaskConical,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type MoleculeType = "pure" | "extract" | "mixture" | "variety" | "unknown";

function getMoleculeType(chemicalFamily: string | null | undefined): MoleculeType {
  if (!chemicalFamily) return "unknown";
  if (chemicalFamily.startsWith("[EXTRAIT PLANTE]")) return "extract";
  if (chemicalFamily.startsWith("[MÉLANGE]")) return "mixture";
  if (chemicalFamily.startsWith("[VARIÉTÉ]")) return "variety";
  return "pure";
}

function MoleculeTypeBadge({ type }: { type: MoleculeType }) {
  const config = {
    pure: { label: "Molécule pure", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: <Beaker className="w-3 h-3" /> },
    extract: { label: "Extrait plante", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: <Leaf className="w-3 h-3" /> },
    mixture: { label: "Mélange", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: <Layers className="w-3 h-3" /> },
    variety: { label: "Variété", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: <FlaskConical className="w-3 h-3" /> },
    unknown: { label: "Inconnu", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", icon: <AlertCircle className="w-3 h-3" /> },
  };
  const c = config[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
      {c.icon} {c.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────
export default function AdminPlantMolecules() {
  const { toast } = useToast();

  // Recherche plante
  const [plantSearch, setPlantSearch] = useState("");
  const debouncedPlantSearch = useDebounce(plantSearch, 300);
  const [selectedPlant, setSelectedPlant] = useState<any>(null);

  // Recherche molécule (pour ajout)
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const debouncedMoleculeSearch = useDebounce(moleculeSearch, 300);
  const [selectedMolecule, setSelectedMolecule] = useState<any>(null);

  // Filtres
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Édition inline
  const [editingRow, setEditingRow] = useState<{ plantId: number; moleculeId: number } | null>(null);
  const [editValues, setEditValues] = useState<{ min: string; max: string; typical: string; role: string; source: string; isSignature: number }>({
    min: "", max: "", typical: "", role: "", source: "", isSignature: 0,
  });

  // Ajout
  const [addValues, setAddValues] = useState({ min: "", max: "", typical: "", role: "", source: "", isSignature: 0 });

  // ── Queries ──
  const plantResults = trpc.contributor.searchPlants.useQuery(
    { query: debouncedPlantSearch, limit: 12 },
    { enabled: debouncedPlantSearch.length >= 2 }
  );

  const moleculeResults = trpc.contributor.searchMolecules.useQuery(
    { query: debouncedMoleculeSearch, limit: 12 },
    { enabled: debouncedMoleculeSearch.length >= 2 }
  );

  const plantMolecules = trpc.plantMoleculeLinks.getByPlantWithDetails.useQuery(
    { plantId: selectedPlant?.id ?? 0 },
    { enabled: !!selectedPlant?.id }
  );

  const stats = trpc.contributor.getPlantMoleculeStats.useQuery();

  // ── Mutations ──
  const utils = trpc.useUtils();

  const updateLink = trpc.plantMoleculeLinks.update.useMutation({
    onSuccess: () => {
      utils.plantMoleculeLinks.getByPlantWithDetails.invalidate({ plantId: selectedPlant?.id });
      setEditingRow(null);
      toast({ title: "✓ Liaison mise à jour" });
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteLink = trpc.plantMoleculeLinks.delete.useMutation({
    onSuccess: () => {
      utils.plantMoleculeLinks.getByPlantWithDetails.invalidate({ plantId: selectedPlant?.id });
      toast({ title: "✓ Liaison supprimée" });
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const createLink = trpc.plantMoleculeLinks.create.useMutation({
    onSuccess: () => {
      utils.plantMoleculeLinks.getByPlantWithDetails.invalidate({ plantId: selectedPlant?.id });
      setShowAddDialog(false);
      setSelectedMolecule(null);
      setMoleculeSearch("");
      setAddValues({ min: "", max: "", typical: "", role: "", source: "", isSignature: 0 });
      toast({ title: "✓ Liaison créée" });
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  // ── Filtrage ──
  const filteredMolecules = useMemo(() => {
    if (!plantMolecules.data) return [];
    return plantMolecules.data.filter((item: any) => {
      if (typeFilter === "all") return true;
      const t = getMoleculeType(item.molecule?.chemicalFamily);
      return t === typeFilter;
    });
  }, [plantMolecules.data, typeFilter]);

  // ── Handlers ──
  function startEdit(item: any) {
    setEditingRow({ plantId: selectedPlant.id, moleculeId: item.molecule.id });
    setEditValues({
      min: item.percentageMin ?? "",
      max: item.percentageMax ?? "",
      typical: item.percentageTypical ?? "",
      role: item.role ?? "",
      source: item.source ?? "",
      isSignature: item.isSignature ?? 0,
    });
  }

  function saveEdit() {
    if (!editingRow) return;
    updateLink.mutate({
      plantId: editingRow.plantId,
      moleculeId: editingRow.moleculeId,
      percentageMin: editValues.min !== "" ? parseFloat(editValues.min) : null,
      percentageMax: editValues.max !== "" ? parseFloat(editValues.max) : null,
      percentageTypical: editValues.typical !== "" ? parseFloat(editValues.typical) : null,
      role: editValues.role || undefined,
      source: editValues.source || undefined,
      isSignature: editValues.isSignature,
    });
  }

  function handleAdd() {
    if (!selectedPlant || !selectedMolecule) return;
    createLink.mutate({
      plantId: selectedPlant.id,
      moleculeId: selectedMolecule.id,
      percentageMin: addValues.min !== "" ? parseFloat(addValues.min) : undefined,
      percentageMax: addValues.max !== "" ? parseFloat(addValues.max) : undefined,
      percentageTypical: addValues.typical !== "" ? parseFloat(addValues.typical) : undefined,
      role: addValues.role || undefined,
      source: addValues.source || undefined,
      isSignature: addValues.isSignature,
    });
  }

  // ── Rendu ──
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-400" />
              Gestion Plantes — Molécules
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Liaison bidirectionnelle entre plantes et molécules. Les molécules pures sont distinctes des extraits et mélanges.
            </p>
          </div>
          {stats.data && (
            <div className="hidden md:flex gap-4 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-emerald-400">{stats.data.totalLinks ?? "—"}</div>
                <div className="text-zinc-500">liaisons</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-zinc-300">{stats.data.plantsWithMolecules ?? "—"}</div>
                <div className="text-zinc-500">plantes liées</div>
              </div>
            </div>
          )}
        </div>

        {/* Légende des types */}
        <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <span className="text-xs text-zinc-500 mr-1 self-center">Types :</span>
          <MoleculeTypeBadge type="pure" />
          <MoleculeTypeBadge type="extract" />
          <MoleculeTypeBadge type="mixture" />
          <MoleculeTypeBadge type="variety" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panneau gauche : sélection plante */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  Sélectionner une plante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="Rechercher une plante..."
                    value={plantSearch}
                    onChange={(e) => setPlantSearch(e.target.value)}
                    className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                {selectedPlant && (
                  <div className="p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-emerald-300 text-sm">{selectedPlant.name}</div>
                        <div className="text-xs text-zinc-500 italic">{selectedPlant.latinName || selectedPlant.latin_name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedPlant(null); setPlantSearch(""); }}
                        className="text-zinc-500 hover:text-zinc-300 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    {plantMolecules.data && (
                      <div className="mt-2 text-xs text-zinc-400">
                        {plantMolecules.data.length} molécule{plantMolecules.data.length !== 1 ? "s" : ""} liée{plantMolecules.data.length !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                )}

                {plantResults.data && plantResults.data.length > 0 && !selectedPlant && (
                  <ScrollArea className="h-64">
                    <div className="space-y-1">
                      {plantResults.data.map((plant: any) => (
                        <button
                          key={plant.id}
                          onClick={() => { setSelectedPlant(plant); setPlantSearch(""); }}
                          className="w-full text-left p-2 rounded hover:bg-zinc-800 transition-colors"
                        >
                          <div className="text-sm text-zinc-200">{plant.name}</div>
                          <div className="text-xs text-zinc-500 italic">{plant.latinName || plant.latin_name}</div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {debouncedPlantSearch.length >= 2 && plantResults.isLoading && (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Recherche...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau droit : liste des molécules */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPlant ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-blue-400" />
                      Molécules de <span className="text-emerald-300 ml-1">{selectedPlant.name}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-36 h-8 bg-zinc-800 border-zinc-700 text-xs">
                          <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="pure">Molécules pures</SelectItem>
                          <SelectItem value="extract">Extraits plante</SelectItem>
                          <SelectItem value="mixture">Mélanges</SelectItem>
                          <SelectItem value="variety">Variétés</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => setShowAddDialog(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Ajouter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {plantMolecules.isLoading ? (
                    <div className="flex items-center justify-center py-12 text-zinc-500">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement...
                    </div>
                  ) : filteredMolecules.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                      <Beaker className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Aucune molécule trouvée</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400 text-xs w-8">#</TableHead>
                            <TableHead className="text-zinc-400 text-xs">Molécule</TableHead>
                            <TableHead className="text-zinc-400 text-xs">Type</TableHead>
                            <TableHead className="text-zinc-400 text-xs text-right">Min%</TableHead>
                            <TableHead className="text-zinc-400 text-xs text-right">Typ%</TableHead>
                            <TableHead className="text-zinc-400 text-xs text-right">Max%</TableHead>
                            <TableHead className="text-zinc-400 text-xs">Rôle</TableHead>
                            <TableHead className="text-zinc-400 text-xs w-20">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMolecules.map((item: any, idx: number) => {
                            const mol = item.molecule;
                            const molType = getMoleculeType(mol?.chemicalFamily);
                            const isEditing = editingRow?.moleculeId === mol?.id;

                            return (
                              <TableRow key={mol?.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="text-zinc-600 text-xs">{idx + 1}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {item.isSignature === 1 && (
                                      <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                    )}
                                    <div>
                                      <div className="text-sm text-zinc-200 font-medium">{mol?.name}</div>
                                      {mol?.formula && (
                                        <div className="text-xs text-zinc-500 font-mono">{mol.formula}</div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <MoleculeTypeBadge type={molType} />
                                </TableCell>

                                {isEditing ? (
                                  <>
                                    <TableCell>
                                      <Input
                                        value={editValues.min}
                                        onChange={(e) => setEditValues(v => ({ ...v, min: e.target.value }))}
                                        className="w-16 h-7 bg-zinc-700 border-zinc-600 text-xs text-right"
                                        placeholder="—"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={editValues.typical}
                                        onChange={(e) => setEditValues(v => ({ ...v, typical: e.target.value }))}
                                        className="w-16 h-7 bg-zinc-700 border-zinc-600 text-xs text-right"
                                        placeholder="—"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={editValues.max}
                                        onChange={(e) => setEditValues(v => ({ ...v, max: e.target.value }))}
                                        className="w-16 h-7 bg-zinc-700 border-zinc-600 text-xs text-right"
                                        placeholder="—"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={editValues.role}
                                        onChange={(e) => setEditValues(v => ({ ...v, role: e.target.value }))}
                                        className="w-24 h-7 bg-zinc-700 border-zinc-600 text-xs"
                                        placeholder="rôle..."
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={saveEdit}
                                          disabled={updateLink.isPending}
                                          className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                          {updateLink.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setEditingRow(null)}
                                          className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-200"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="text-right text-xs text-zinc-400">
                                      {item.percentageMin ? `${item.percentageMin}%` : "—"}
                                    </TableCell>
                                    <TableCell className="text-right text-xs font-medium text-zinc-200">
                                      {item.percentageTypical ? `${item.percentageTypical}%` : "—"}
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-zinc-400">
                                      {item.percentageMax ? `${item.percentageMax}%` : "—"}
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-xs text-zinc-500">{item.role || "—"}</span>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => startEdit(item)}
                                          className="h-7 w-7 p-0 text-zinc-400 hover:text-blue-400"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            if (confirm(`Supprimer la liaison avec "${mol?.name}" ?`)) {
                                              deleteLink.mutate({ plantId: selectedPlant.id, moleculeId: mol.id });
                                            }
                                          }}
                                          className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-64 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="text-center text-zinc-500">
                  <Leaf className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Sélectionnez une plante pour voir ses molécules</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Ajout de molécule */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Ajouter une molécule à <span className="text-emerald-300 ml-1">{selectedPlant?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Recherche molécule */}
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Molécule</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <Input
                  placeholder="Rechercher une molécule..."
                  value={moleculeSearch}
                  onChange={(e) => { setMoleculeSearch(e.target.value); setSelectedMolecule(null); }}
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>

              {selectedMolecule && (
                <div className="p-2 bg-blue-900/20 border border-blue-700/30 rounded flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-300">{selectedMolecule.name}</div>
                    <MoleculeTypeBadge type={getMoleculeType(selectedMolecule.chemicalFamily)} />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMolecule(null)} className="h-6 w-6 p-0 text-zinc-400">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {moleculeResults.data && moleculeResults.data.length > 0 && !selectedMolecule && (
                <ScrollArea className="h-40 border border-zinc-700 rounded">
                  <div className="p-1 space-y-0.5">
                    {moleculeResults.data.map((mol: any) => (
                      <button
                        key={mol.id}
                        onClick={() => { setSelectedMolecule(mol); setMoleculeSearch(""); }}
                        className="w-full text-left p-2 rounded hover:bg-zinc-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-zinc-200">{mol.name}</div>
                            {mol.formula && <div className="text-xs text-zinc-500 font-mono">{mol.formula}</div>}
                          </div>
                          <MoleculeTypeBadge type={getMoleculeType(mol.chemicalFamily)} />
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <Separator className="bg-zinc-700" />

            {/* Pourcentages */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">Min %</Label>
                <Input
                  value={addValues.min}
                  onChange={(e) => setAddValues(v => ({ ...v, min: e.target.value }))}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">Typique %</Label>
                <Input
                  value={addValues.typical}
                  onChange={(e) => setAddValues(v => ({ ...v, typical: e.target.value }))}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-400 text-xs">Max %</Label>
                <Input
                  value={addValues.max}
                  onChange={(e) => setAddValues(v => ({ ...v, max: e.target.value }))}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm"
                />
              </div>
            </div>

            {/* Rôle */}
            <div className="space-y-1">
              <Label className="text-zinc-400 text-xs">Rôle</Label>
              <Select value={addValues.role} onValueChange={(v) => setAddValues(a => ({ ...a, role: v }))}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm">
                  <SelectValue placeholder="Sélectionner un rôle..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="dominant">Dominant</SelectItem>
                  <SelectItem value="secondary">Secondaire</SelectItem>
                  <SelectItem value="trace">Trace</SelectItem>
                  <SelectItem value="signature">Signature</SelectItem>
                  <SelectItem value="precursor">Précurseur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <Label className="text-zinc-400 text-xs">Source scientifique</Label>
              <Input
                value={addValues.source}
                onChange={(e) => setAddValues(v => ({ ...v, source: e.target.value }))}
                placeholder="ex: GC-MS, J.Agric.Food.Chem 2019..."
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-sm"
              />
            </div>

            {/* Signature */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSignature"
                checked={addValues.isSignature === 1}
                onChange={(e) => setAddValues(v => ({ ...v, isSignature: e.target.checked ? 1 : 0 }))}
                className="w-4 h-4 accent-amber-400"
              />
              <Label htmlFor="isSignature" className="text-zinc-300 text-sm cursor-pointer flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" /> Molécule signature
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddDialog(false)} className="text-zinc-400">
              Annuler
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedMolecule || createLink.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {createLink.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Créer la liaison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
