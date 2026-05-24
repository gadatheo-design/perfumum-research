import { useRoute, Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Leaf, MapPin, FlaskConical, BookOpen, AlertTriangle, ExternalLink, Pencil, Check, Plus, Trash2, Link2 } from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { SeeAlsoSection } from "@/components/SeeAlsoSection";

// ── Labels ──────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  huile_essentielle: { label: "Huile essentielle", color: "bg-emerald-900/40 text-emerald-300 border-emerald-700" },
  absolue: { label: "Absolue", color: "bg-rose-900/40 text-rose-300 border-rose-700" },
  concrete: { label: "Concrète", color: "bg-amber-900/40 text-amber-300 border-amber-700" },
  resinoid: { label: "Résinoïde", color: "bg-orange-900/40 text-orange-300 border-orange-700" },
  teinture: { label: "Teinture", color: "bg-purple-900/40 text-purple-300 border-purple-700" },
  co2_extract: { label: "Extrait CO₂", color: "bg-cyan-900/40 text-cyan-300 border-cyan-700" },
  hydrolat: { label: "Hydrolat", color: "bg-sky-900/40 text-sky-300 border-sky-700" },
  beurre: { label: "Beurre", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700" },
  cire: { label: "Cire", color: "bg-yellow-900/40 text-yellow-200 border-yellow-600" },
  oleoresine: { label: "Oléorésine", color: "bg-orange-900/40 text-orange-200 border-orange-600" },
  infusion: { label: "Infusion / Macération", color: "bg-teal-900/40 text-teal-300 border-teal-700" },
  maceration: { label: "Macération", color: "bg-teal-900/40 text-teal-200 border-teal-600" },
  distillat: { label: "Distillat", color: "bg-blue-900/40 text-blue-300 border-blue-700" },
  accord_olfactif: { label: "Accord olfactif", color: "bg-violet-900/40 text-violet-300 border-violet-700" },
  molecule_isolee: { label: "Molécule isolée", color: "bg-indigo-900/40 text-indigo-300 border-indigo-700" },
  matiere_animale: { label: "Matière animale", color: "bg-stone-800/60 text-stone-300 border-stone-600" },
  autre: { label: "Autre", color: "bg-zinc-800/60 text-zinc-300 border-zinc-600" },
};

// Correspondance entre les valeurs enum extractionMethod et les IDs des procédés
const EXTRACTION_METHOD_TO_PROCESS: Record<string, { id: string; label: string }> = {
  distillation: { id: "hydrodistillation", label: "Hydrodistillation" },
  extraction_solvant: { id: "extraction_solvant", label: "Extraction au solvant" },
  co2_supercritique: { id: "co2_supercritique", label: "CO₂ supercritique" },
  expression: { id: "expression_a_froid", label: "Expression à froid" },
  teinture: { id: "maceration", label: "Macération / Teinture" },
  autre: { id: "enfleurage", label: "Autre procédé" },
};

const QUALITY_LABELS: Record<string, string> = {
  bio: "Biologique",
  conventionnel: "Conventionnel",
  sauvage: "Sauvage",
  biodynamique: "Biodynamique",
  patrimonial: "Patrimonial",
  synthetique: "Synthétique",
};

const AVAILABILITY_LABELS: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "text-emerald-400" },
  sur_commande: { label: "Sur commande", color: "text-amber-400" },
  rare: { label: "Rare", color: "text-orange-400" },
  epuise: { label: "Épuisé", color: "text-red-400" },
  discontinue: { label: "Discontinué", color: "text-red-500" },
};

const CATEGORY_OPTIONS = [
  "huile_essentielle","absolue","concrete","resinoid","teinture","co2_extract",
  "hydrolat","beurre","cire","oleoresine","infusion","maceration","distillat",
  "accord_olfactif","molecule_isolee","matiere_animale","autre",
];

const OLFACTIVE_OPTIONS = [
  "floral","boise","agrume","epice","herbace","balsamique",
  "musque","animal","vert","fruite","marin","terreux","fume","gourmand","aromatique",
];

// ── Composant principal ──────────────────────────────────────────────────────
export default function MatierePremierePage() {
  const [, params] = useRoute("/matieres-premieres/:id");
  const id = params?.id ? parseInt(params.id, 10) : null;
  const { user } = useAuth();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const { data: material, isLoading, error, refetch } = trpc.rawMaterials.getDetail.useQuery(
    id ?? 0,
    { enabled: !!id && !isNaN(id as number) }
  );

  // Listes pour les selects
  const { data: plants } = trpc.plantVarieties.getPlants.useQuery();
  const { data: terroirs } = trpc.terroirs?.getAll.useQuery();

  const utils = trpc.useUtils();

  // Liaisons directes recette <-> matière première
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ recetteId: "", role: "autre", dosage: "", dosageUnit: "g", percentage: "", notes: "" });

  const { data: directRecettes, refetch: refetchLinks } = trpc.rawMaterials.getRecettes.useQuery(
    id ?? 0,
    { enabled: !!id && !isNaN(id as number) }
  );

  const { data: allRecettes } = trpc.recettes.list.useQuery();

  const addLinkMutation = trpc.rawMaterials.addRecette.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison ajoutée", description: "La recette a été liée à cette matière première." });
      setLinkDialogOpen(false);
      setLinkForm({ recetteId: "", role: "autre", dosage: "", dosageUnit: "g", percentage: "", notes: "" });
      refetchLinks();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const removeLinkMutation = trpc.rawMaterials.removeRecette.useMutation({
    onSuccess: () => {
      toast({ title: "Liaison supprimée" });
      refetchLinks();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const handleAddLink = () => {
    if (!id || !linkForm.recetteId) return;
    addLinkMutation.mutate({
      recetteId: parseInt(linkForm.recetteId, 10),
      rawMaterialId: id,
      role: linkForm.role as any,
      dosage: linkForm.dosage || undefined,
      dosageUnit: linkForm.dosageUnit || "g",
      percentage: linkForm.percentage || undefined,
      notes: linkForm.notes || undefined,
    });
  };

  const updateMutation = trpc.rawMaterials.update.useMutation({
    onSuccess: () => {
      toast({ title: "Modifications enregistrées", description: "La fiche a été mise à jour." });
      setEditOpen(false);
      refetch();
      utils.rawMaterials.getFiltered.invalidate();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const openEdit = () => {
    if (!material) return;
    setEditForm({
      name: material?.name ?? "",
      latinName: material?.latinName ?? "",
      category: material?.category ?? "",
      olfactiveFamily: material?.olfactiveFamily ?? "",
      olfactiveProfile: material?.olfactiveProfile ?? "",
      quality: material?.quality ?? "",
      availability: material?.availability ?? "",
      priceRange: material?.priceRange ?? "",
      originCountry: material?.originCountry ?? "",
      originRegion: material?.originRegion ?? "",
      plantId: material?.plant?.id ?? null,
      terroirId: material?.terroir?.id ?? null,
      notes: material?.notes ?? "",
      topNotes: material?.topNotes ?? "",
      heartNotes: material?.heartNotes ?? "",
      baseNotes: material?.baseNotes ?? "",
      plantPart: material?.plantPart ?? "",
      extractionYield: material?.extractionYield ?? "",
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!id) return;
    const data: Record<string, any> = {};
    Object.entries(editForm).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) data[k] = v;
      else if (k === "plantId" || k === "terroirId") data[k] = null; // permettre de délier
    });
    updateMutation.mutate({ id, data });
  };

  if (!id || isNaN(id)) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <p className="text-zinc-400">Identifiant invalide.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center flex-col gap-4">
        <AlertTriangle className="h-10 w-10 text-red-400" />
        <p className="text-zinc-400">Matière première introuvable.</p>
        <Link href="/matieres-premieres">
          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
        </Link>
      </div>
    );
  }

  const catInfo = CATEGORY_LABELS[material?.category] ?? CATEGORY_LABELS.autre;
  const availInfo = material?.availability ? AVAILABILITY_LABELS[material?.availability] : null;

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-100">
      {/* ── Header ── */}
      <div className="border-b border-zinc-800 bg-[#111113]">
        <div className="max-w-5xl mx-auto px-4 pt-3 pb-1">
          <DynamicBreadcrumb className="text-zinc-500" />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link href="/matieres-premieres">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Matières premières
            </Button>
          </Link>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={openEdit}
              className="border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300 gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" /> Modifier la fiche
            </Button>
          )}
        </div>
      </div>

      {/* ── Dialog d'édition rapide ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl bg-[#111113] border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Modifier la fiche</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">

            {/* Nom */}
            <div className="sm:col-span-2">
              <Label className="text-zinc-400 text-xs">Nom</Label>
              <Input value={editForm.name ?? ""} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
            </div>

            {/* Nom latin */}
            <div className="sm:col-span-2">
              <Label className="text-zinc-400 text-xs">Nom latin</Label>
              <Input value={editForm.latinName ?? ""} onChange={e => setEditForm(f => ({ ...f, latinName: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
            </div>

            {/* Catégorie */}
            <div>
              <Label className="text-zinc-400 text-xs">Catégorie</Label>
              <Select value={editForm.category ?? ""} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {CATEGORY_OPTIONS.map(c => (
                    <SelectItem key={c} value={c} className="text-zinc-200">
                      {CATEGORY_LABELS[c]?.label ?? c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Famille olfactive */}
            <div>
              <Label className="text-zinc-400 text-xs">Famille olfactive</Label>
              <Select value={editForm.olfactiveFamily ?? ""} onValueChange={v => setEditForm(f => ({ ...f, olfactiveFamily: v }))}>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {OLFACTIVE_OPTIONS.map(o => (
                    <SelectItem key={o} value={o} className="text-zinc-200 capitalize">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plante source */}
            <div>
              <Label className="text-zinc-400 text-xs">Plante source</Label>
              <Select
                value={editForm.plantId ? String(editForm.plantId) : "none"}
                onValueChange={v => setEditForm(f => ({ ...f, plantId: v === "none" ? null : parseInt(v) }))}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                  <SelectValue placeholder="Aucune" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 max-h-60">
                  <SelectItem value="none" className="text-zinc-400">Aucune</SelectItem>
                  {(plants as any[])?.map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)} className="text-zinc-200">
                      {p.name}{p.latinName ? ` (${p.latinName})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Terroir */}
            <div>
              <Label className="text-zinc-400 text-xs">Terroir</Label>
              <Select
                value={editForm.terroirId ? String(editForm.terroirId) : "none"}
                onValueChange={v => setEditForm(f => ({ ...f, terroirId: v === "none" ? null : parseInt(v) }))}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                  <SelectValue placeholder="Aucun" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 max-h-60">
                  <SelectItem value="none" className="text-zinc-400">Aucun</SelectItem>
                  {(terroirs as any[])?.map((t: any) => (
                    <SelectItem key={t.id} value={String(t.id)} className="text-zinc-200">
                      {t.name}{t.country ? ` — ${t.country}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Origine */}
            <div>
              <Label className="text-zinc-400 text-xs">Pays d'origine</Label>
              <Input value={editForm.originCountry ?? ""} onChange={e => setEditForm(f => ({ ...f, originCountry: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" placeholder="ex: France" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Région</Label>
              <Input value={editForm.originRegion ?? ""} onChange={e => setEditForm(f => ({ ...f, originRegion: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" placeholder="ex: Provence" />
            </div>

            {/* Partie utilisée & rendement */}
            <div>
              <Label className="text-zinc-400 text-xs">Partie utilisée</Label>
              <Input value={editForm.plantPart ?? ""} onChange={e => setEditForm(f => ({ ...f, plantPart: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" placeholder="ex: fleur, écorce" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Rendement d'extraction</Label>
              <Input value={editForm.extractionYield ?? ""} onChange={e => setEditForm(f => ({ ...f, extractionYield: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" placeholder="ex: 0.5%" />
            </div>

            {/* Profil olfactif */}
            <div className="sm:col-span-2">
              <Label className="text-zinc-400 text-xs">Profil olfactif</Label>
              <Textarea value={editForm.olfactiveProfile ?? ""} onChange={e => setEditForm(f => ({ ...f, olfactiveProfile: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1 resize-none" rows={3} />
            </div>

            {/* Notes de tête / cœur / fond */}
            <div>
              <Label className="text-zinc-400 text-xs">Notes de tête</Label>
              <Input value={editForm.topNotes ?? ""} onChange={e => setEditForm(f => ({ ...f, topNotes: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
            </div>
            <div>
              <Label className="text-zinc-400 text-xs">Notes de cœur</Label>
              <Input value={editForm.heartNotes ?? ""} onChange={e => setEditForm(f => ({ ...f, heartNotes: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-zinc-400 text-xs">Notes de fond</Label>
              <Input value={editForm.baseNotes ?? ""} onChange={e => setEditForm(f => ({ ...f, baseNotes: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
            </div>

            {/* Notes chercheur */}
            <div className="sm:col-span-2">
              <Label className="text-zinc-400 text-xs">Notes du chercheur</Label>
              <Textarea value={editForm.notes ?? ""} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1 resize-none" rows={4} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)} className="text-zinc-400 hover:text-zinc-100">
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Titre & badges ── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-semibold text-zinc-50 leading-tight flex-1 min-w-0">
              {material?.name}
            </h1>
            <Badge className={`border text-xs px-2 py-1 shrink-0 ${catInfo.color}`}>
              {catInfo.label}
            </Badge>
          </div>
          {material?.latinName && (
            <p className="text-zinc-400 italic text-lg">{material?.latinName}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {material?.quality && (
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                {QUALITY_LABELS[material?.quality] ?? material?.quality}
              </Badge>
            )}
            {availInfo && (
              <span className={`text-sm font-medium ${availInfo.color}`}>
                ● {availInfo.label}
              </span>
            )}
            {material?.priceRange && (
              <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                {material?.priceRange}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="border-zinc-800" />

        {/* ── Grille principale ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Colonne gauche : Profil olfactif ── */}
          <div className="md:col-span-2 space-y-6">

            {/* Profil olfactif */}
            {(material?.olfactiveProfile || material?.topNotes || material?.heartNotes || material?.baseNotes) && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Profil olfactif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {material?.olfactiveProfile && (
                    <p className="text-zinc-200 text-sm leading-relaxed">{material?.olfactiveProfile}</p>
                  )}
                  {(material?.topNotes || material?.heartNotes || material?.baseNotes) && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {material?.topNotes && (
                        <div className="bg-zinc-900/60 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes de tête</p>
                          <p className="text-zinc-300 text-sm">{material?.topNotes}</p>
                        </div>
                      )}
                      {material?.heartNotes && (
                        <div className="bg-zinc-900/60 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes de cœur</p>
                          <p className="text-zinc-300 text-sm">{material?.heartNotes}</p>
                        </div>
                      )}
                      {material?.baseNotes && (
                        <div className="bg-zinc-900/60 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Notes de fond</p>
                          <p className="text-zinc-300 text-sm">{material?.baseNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {material?.olfactiveFamily && (
                    <p className="text-xs text-zinc-500">
                      Famille olfactive : <span className="text-zinc-300">{material?.olfactiveFamily}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Molécules */}
            {material?.molecules && material?.molecules.length > 0 && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Composition moléculaire
                    <span className="text-zinc-600 font-normal">({material?.molecules.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {material?.molecules.map((mol) => (
                      <div key={mol.id} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <Link href={`/molecules/${mol.id}`}>
                            <span className="text-amber-400 hover:text-amber-300 text-sm font-medium cursor-pointer truncate">
                              {mol.name}
                            </span>
                          </Link>
                          {mol.isSignature === 1 && (
                            <Badge className="bg-amber-900/40 text-amber-300 border-amber-700 text-xs border">
                              Signature
                            </Badge>
                          )}
                          {mol.chemicalFamily && (
                            <span className="text-zinc-500 text-xs hidden sm:inline">{mol.chemicalFamily}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {mol.percentage && (
                            <span className="text-zinc-300 text-sm font-mono">{mol.percentage}%</span>
                          )}
                          {mol.casNumber && (
                            <span className="text-zinc-600 text-xs hidden md:inline">CAS {mol.casNumber}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recettes associées (via molécules) */}
            {material?.recipes && material?.recipes.length > 0 && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recettes associées (via molécules)
                    <span className="text-zinc-600 font-normal">({material?.recipes.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {material?.recipes.map((r) => (
                      <Link key={r.id} href={`/recettes/${r.id}`}>
                        <Badge
                          variant="outline"
                          className="border-zinc-700 text-zinc-300 hover:border-amber-600 hover:text-amber-300 cursor-pointer transition-colors"
                        >
                          {r.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liaisons directes recette <-> matière première */}
            <Card className="bg-[#16161a] border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Liaisons directes recettes
                    {directRecettes && directRecettes?.length > 0 && (
                      <span className="text-zinc-600 font-normal">({directRecettes?.length})</span>
                    )}
                  </CardTitle>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLinkDialogOpen(true)}
                      className="text-zinc-500 hover:text-amber-400 h-7 px-2 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Lier une recette
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {(!directRecettes || directRecettes?.length === 0) ? (
                  <p className="text-zinc-600 text-sm italic">Aucune liaison directe. Utilisez le bouton ci-dessus pour lier cette matière première à une recette.</p>
                ) : (
                  <div className="space-y-2">
                    {directRecettes?.map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <Link href={`/recettes/${r.recetteId}`}>
                            <span className="text-amber-400 hover:text-amber-300 text-sm font-medium cursor-pointer truncate">
                              {r.recetteName}
                            </span>
                          </Link>
                          {r.role && r.role !== 'autre' && (
                            <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400 capitalize">{r.role}</Badge>
                          )}
                          {r.percentage && (
                            <span className="text-zinc-300 text-xs font-mono">{r.percentage}%</span>
                          )}
                          {r.dosage && (
                            <span className="text-zinc-500 text-xs">{r.dosage} {r.dosageUnit}</span>
                          )}
                        </div>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLinkMutation.mutate(r.id)}
                            className="text-zinc-600 hover:text-red-400 h-7 w-7 p-0 shrink-0"
                            disabled={removeLinkMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dialog : Lier une recette */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
              <DialogContent className="max-w-md bg-[#111113] border-zinc-800 text-zinc-100">
                <DialogHeader>
                  <DialogTitle className="text-zinc-100">Lier une recette</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label className="text-zinc-400 text-xs">Recette</Label>
                    <Select value={linkForm.recetteId} onValueChange={v => setLinkForm(f => ({ ...f, recetteId: v }))}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                        <SelectValue placeholder="Sélectionner une recette..." />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {(allRecettes ?? []).map((r: any) => (
                          <SelectItem key={r.id} value={String(r.id)} className="text-zinc-200">{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-xs">Rôle dans la recette</Label>
                    <Select value={linkForm.role} onValueChange={v => setLinkForm(f => ({ ...f, role: v }))}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {[['base','Base'],['coeur','Cœur'],['tete','Tête'],['fixateur','Fixateur'],['modificateur','Modificateur'],['autre','Autre']].map(([v,l]) => (
                          <SelectItem key={v} value={v} className="text-zinc-200">{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-zinc-400 text-xs">Dosage</Label>
                      <Input value={linkForm.dosage} onChange={e => setLinkForm(f => ({ ...f, dosage: e.target.value }))}
                        placeholder="ex: 2.5" className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
                    </div>
                    <div>
                      <Label className="text-zinc-400 text-xs">Unité</Label>
                      <Select value={linkForm.dosageUnit} onValueChange={v => setLinkForm(f => ({ ...f, dosageUnit: v }))}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          {['g','ml','%','gouttes'].map(u => (
                            <SelectItem key={u} value={u} className="text-zinc-200">{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-xs">Pourcentage (%)</Label>
                    <Input value={linkForm.percentage} onChange={e => setLinkForm(f => ({ ...f, percentage: e.target.value }))}
                      placeholder="ex: 5.2" className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1" />
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-xs">Notes</Label>
                    <Textarea value={linkForm.notes} onChange={e => setLinkForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Notes sur l'utilisation dans cette recette..." rows={2}
                      className="bg-zinc-900 border-zinc-700 text-zinc-100 mt-1 resize-none" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setLinkDialogOpen(false)} className="text-zinc-400">Annuler</Button>
                  <Button
                    onClick={handleAddLink}
                    disabled={!linkForm.recetteId || addLinkMutation.isPending}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {addLinkMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Lier
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Notes & description */}
            {material?.notes && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Notes du chercheur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{material?.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Colonne droite : Origine & infos ── */}
          <div className="space-y-4">

            {/* Origine géographique */}
            {(material?.originCountry || material?.originRegion || material?.terroir) && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Origine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {material?.originCountry && (
                    <div>
                      <span className="text-zinc-500">Pays : </span>
                      <span className="text-zinc-200">{material?.originCountry}</span>
                    </div>
                  )}
                  {material?.originRegion && (
                    <div>
                      <span className="text-zinc-500">Région : </span>
                      <span className="text-zinc-200">{material?.originRegion}</span>
                    </div>
                  )}
                  {material?.terroir && (
                    <div className="mt-2 pt-2 border-t border-zinc-800">
                      <p className="text-zinc-500 text-xs mb-1">Terroir lié</p>
                      <Link href={`/terroirsmap`}>
                        <span className="text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1">
                          {material?.terroir.name}
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </Link>
                      {material?.terroir.country && (
                        <p className="text-zinc-500 text-xs mt-1">{material?.terroir.country}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Plante source */}
            {material?.plant && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Plante source
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Link href={`/plantes/${material?.plant.id}`}>
                    <p className="text-amber-400 hover:text-amber-300 cursor-pointer font-medium">
                      {material?.plant.name}
                    </p>
                  </Link>
                  {material?.plant.latinName && (
                    <p className="text-zinc-400 italic text-xs">{material?.plant.latinName}</p>
                  )}
                  {material?.plant.family && (
                    <p className="text-zinc-500 text-xs">Famille : {material?.plant.family}</p>
                  )}
                  {material?.plant.conservationStatus && !(["NE", "DD"].includes(material?.plant.conservationStatus)) && (
                    <Badge className="bg-red-900/40 text-red-300 border-red-700 border text-xs mt-1">
                      {material?.plant.conservationStatus.toUpperCase()}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Méthode d'extraction */}
            {(material?.extractionMethodId || material?.extractionYield || material?.plantPart || (material as any).extractionMethod) && (
              <Card className="bg-[#16161a] border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {material?.plantPart && (
                    <div>
                      <span className="text-zinc-500">Partie utilisée : </span>
                      <span className="text-zinc-200 capitalize">{material?.plantPart.replace(/_/g, " ")}</span>
                    </div>
                  )}
                  {material?.extractionYield && (
                    <div>
                      <span className="text-zinc-500">Rendement : </span>
                      <span className="text-zinc-200">{material?.extractionYield}</span>
                    </div>
                  )}
                  {/* Badge procédé cliquable — lien vers /extraction-procedes */}
                  {(material as any).extractionMethod && EXTRACTION_METHOD_TO_PROCESS[(material as any).extractionMethod] && (
                    <div className="pt-1">
                      <span className="text-zinc-500 text-xs">Procédé documenté : </span>
                      <Link
                        href={`/extraction-procedes?focus=${EXTRACTION_METHOD_TO_PROCESS[(material as any).extractionMethod].id}`}
                        className="inline-flex items-center gap-1 mt-1"
                      >
                        <Badge
                          variant="outline"
                          className="text-xs border-violet-700 text-violet-300 bg-violet-900/20 hover:bg-violet-900/40 cursor-pointer transition-colors"
                        >
                          🔬 {EXTRACTION_METHOD_TO_PROCESS[(material as any).extractionMethod].label}
                          <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
                        </Badge>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Identifiant interne */}
            <div className="text-xs text-zinc-700 font-mono pt-2">
              ID : {material?.materialId}
            </div>
          </div>
        </div>
      </div>

      {/* Section Voir aussi — Navigation contextuelle inter-entités */}
      <SeeAlsoSection
        title="Connexions de cette matière première"
        groups={[
          {
            label: "Molécules identifiées",
            type: "molecule",
            items: (material?.molecules || []).map((mol: any) => ({
              id: mol.id,
              label: mol.name,
              sublabel: mol.family || mol.chemicalClass || undefined,
              href: `/molecules/${mol.id}`,
              type: "molecule" as const,
            })),
            viewAllHref: "/molecules",
            viewAllLabel: "Toutes les molécules",
          },
          {
            label: "Recettes utilisant cette MP",
            type: "recette",
            items: (directRecettes || []).map((r: any) => ({
              id: r.id,
              label: r.name,
              sublabel: r.family || r.category || undefined,
              href: `/recettes/${r.id}`,
              type: "recette" as const,
            })),
            viewAllHref: "/recettes",
            viewAllLabel: "Toutes les recettes",
          },
          ...(material?.plant ? [{
            label: "Plante source",
            type: "plant" as const,
            items: [{
              id: material?.plant.id,
              label: material?.plant.name,
              sublabel: material?.plant.latinName || undefined,
              href: `/plantes/${material?.plant.id}`,
              type: "plant" as const,
            }],
            viewAllHref: "/plantes",
            viewAllLabel: "Toutes les plantes",
          }] : []),
          ...(material?.terroir ? [{
            label: "Terroir d'origine",
            type: "terroir" as const,
            items: [{
              id: material?.terroir.id,
              label: material?.terroir.name,
              sublabel: material?.terroir.country || undefined,
              href: `/terroirs/${material?.terroir.id}`,
              type: "terroir" as const,
            }],
            viewAllHref: "/plantes?tab=terroirs",
            viewAllLabel: "Tous les terroirs",
          }] : []),
        ]}
      />
    </div>
  );
}
