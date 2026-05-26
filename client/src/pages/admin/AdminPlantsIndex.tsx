// @ts-nocheck
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Leaf, Edit, Search, Plus, ArrowLeft, ChevronLeft, ChevronRight,
  Trash2, Eye, Sparkles, Wand2, AlertTriangle, CheckCircle2, Loader2,
  Filter, Globe, TreePine,
} from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 25;

const CONSERVATION_COLORS: Record<string, string> = {
  EX: "bg-gray-800 text-white",
  EW: "bg-gray-600 text-white",
  CR: "bg-red-600 text-white",
  EN: "bg-orange-500 text-white",
  VU: "bg-yellow-500 text-black",
  NT: "bg-lime-500 text-black",
  LC: "bg-green-500 text-white",
  DD: "bg-blue-400 text-white",
  NE: "bg-slate-300 text-slate-700",
};

const CONSERVATION_LABELS: Record<string, string> = {
  EX: "Éteinte", EW: "Éteinte (sauvage)", CR: "En danger critique",
  EN: "En danger", VU: "Vulnérable", NT: "Quasi menacée",
  LC: "Préoccupation mineure", DD: "Données insuffisantes", NE: "Non évaluée",
};

export default function AdminPlantsIndex() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterMissingFamily, setFilterMissingFamily] = useState(false);
  const [filterMissingGenus, setFilterMissingGenus] = useState(false);
  const [filterMissingGbif, setFilterMissingGbif] = useState(false);
  const [filterMissingWikidata, setFilterMissingWikidata] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Record<string, unknown> | null>(null);
  const [editTab, setEditTab] = useState("manual");
  const [editFields, setEditFields] = useState<Record<string, unknown>>({});

  // Données paginées
  const { data, isLoading, refetch } = trpc.plantsAdmin?.listPaginated.useQuery({
    page,
    pageSize: ITEMS_PER_PAGE,
    search: search || undefined,
    filterMissingFamily: filterMissingFamily || undefined,
    filterMissingGenus: filterMissingGenus || undefined,
    filterMissingGbif: filterMissingGbif || undefined,
    filterMissingWikidata: filterMissingWikidata || undefined,
    category: categoryFilter || undefined,
  });

  // Stats de couverture
  const { data: stats } = trpc.plantsAdmin?.getCoverageStats.useQuery();

  // Données complètes pour édition
  const { data: fullPlant, isLoading: isLoadingFull } = trpc.plantsAdmin?.getFullById.useQuery(
    { id: (selectedPlant?.id as number) ?? 0 },
    { enabled: !!selectedPlant && editDialogOpen }
  );

  // Impact suppression
  const { data: deletionImpact } = trpc.plantsAdmin?.getDeletionImpact.useQuery(
    { id: (selectedPlant?.id as number) ?? 0 },
    { enabled: !!selectedPlant && deleteDialogOpen }
  );

  // Mutations
  const updateFieldsMutation = trpc.plantsAdmin?.updateFields.useMutation({
    onSuccess: () => {
      toast.success("Plante mise à jour avec succès");
      refetch();
      setEditDialogOpen(false);
      setEditFields({});
    },
    onError: (e) => toast.error(`Erreur: ${e.message}`),
  });

  const deleteMutation = trpc.plantsAdmin?.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`Plante "${data.name}" supprimée`);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedPlant(null);
    },
    onError: (e) => toast.error(`Erreur suppression: ${e.message}`),
  });

  const enrichGBIFMutation = trpc.plantsAdmin?.enrichFromGBIF.useMutation({
    onSuccess: (data) => {
      if (!data.fieldsUpdated.length) {
        toast.info(data.message || "Aucun nouveau champ GBIF trouvé");
      } else {
        toast.success(data.message || `GBIF : ${data.fieldsUpdated.join(", ")} mis à jour`);
      }
      refetch();
    },
    onError: (e) => toast.error(`Erreur GBIF: ${e.message}`),
  });

  const enrichWikidataMutation = trpc.plantsAdmin?.enrichFromWikidata.useMutation({
    onSuccess: (data) => {
      if (!data.fieldsUpdated.length) {
        toast.info(data.message || "Aucun nouveau champ Wikidata trouvé");
      } else {
        toast.success(data.message || `Wikidata : ${data.fieldsUpdated.join(", ")} mis à jour`);
      }
      refetch();
    },
    onError: (e) => toast.error(`Erreur Wikidata: ${e.message}`),
  });

  const handleOpenEdit = useCallback((plant: Record<string, unknown>) => {
    setSelectedPlant(plant);
    setEditFields({});
    setEditTab("manual");
    setEditDialogOpen(true);
  }, []);

  const handleOpenDelete = useCallback((plant: Record<string, unknown>) => {
    setSelectedPlant(plant);
    setDeleteDialogOpen(true);
  }, []);

  const handleSaveFields = () => {
    if (!selectedPlant || !Object.keys(editFields).length) {
      toast.warning("Aucune modification à enregistrer");
      return;
    }
    updateFieldsMutation.mutate({ id: selectedPlant.id as number, ...editFields });
  };

  const handleDelete = () => {
    if (!selectedPlant) return;
    deleteMutation.mutate({ id: selectedPlant.id as number });
  };

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleFilterChange = (setter: (v: boolean) => void) => (v: boolean) => { setter(v); setPage(1); };

  const plants = data?.plants || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Gestion des Plantes</h1>
                <p className="text-muted-foreground">
                  {stats ? `${stats.total} plantes` : "Chargement…"} — édition, enrichissement et suppression
                </p>
              </div>
            </div>
            <Link href="/admin/plants/new">
              <Button className="btn-enhanced">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle plante
              </Button>
            </Link>
          </div>

          {/* Stats de couverture */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {[
                { label: "Total", value: stats.total, color: "text-foreground" },
                { label: "Avec famille", value: stats.withFamily, color: "text-green-600 dark:text-green-400" },
                { label: "Avec genre", value: stats.withGenus, color: "text-green-600 dark:text-green-400" },
                { label: "Avec nom latin", value: stats.withLatin, color: "text-blue-600 dark:text-blue-400" },
                { label: "GBIF", value: stats.withGbif, color: "text-violet-600 dark:text-violet-400" },
                { label: "Wikidata", value: stats.withWikidata, color: "text-amber-600 dark:text-amber-400" },
                { label: "IUCN", value: stats.withIucn, color: "text-red-600 dark:text-red-400" },
              ].map((s) => (
                <Card key={s.label} className="text-center py-3">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Filtres */}
          <Card className="mb-6">
            <CardContent className="pt-4 space-y-3">
              <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, famille, genre…"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v === "all" ? "" : v); setPage(1); }}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="aromatique">Aromatique</SelectItem>
                    <SelectItem value="tabac">Tabac</SelectItem>
                    <SelectItem value="cannabis">Cannabis</SelectItem>
                    <SelectItem value="resine">Résine</SelectItem>
                    <SelectItem value="bois">Bois</SelectItem>
                    <SelectItem value="fleur">Fleur</SelectItem>
                    <SelectItem value="racine">Racine</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={filterMissingFamily} onCheckedChange={handleFilterChange(setFilterMissingFamily)} />
                  <span>Sans famille</span>
                  {stats && <Badge variant="secondary">{stats.total - stats.withFamily}</Badge>}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={filterMissingGenus} onCheckedChange={handleFilterChange(setFilterMissingGenus)} />
                  <span>Sans genre</span>
                  {stats && <Badge variant="secondary">{stats.total - stats.withGenus}</Badge>}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={filterMissingGbif} onCheckedChange={handleFilterChange(setFilterMissingGbif)} />
                  <span>Sans GBIF ID</span>
                  {stats && <Badge variant="secondary">{stats.total - stats.withGbif}</Badge>}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={filterMissingWikidata} onCheckedChange={handleFilterChange(setFilterMissingWikidata)} />
                  <span>Sans Wikidata QID</span>
                  {stats && <Badge variant="secondary">{stats.total - stats.withWikidata}</Badge>}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Tableau */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des plantes</CardTitle>
              <CardDescription>
                {data?.total || 0} plantes{search && ` pour "${search}"`}
                {" — Page "}{page}/{totalPages}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Nom latin</TableHead>
                          <TableHead>Famille / Genre</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>IDs externes</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right min-w-[180px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plants.map((plant) => (
                          <TableRow key={plant.id as number}>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {plant.id as number}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                                <span className="font-medium">{plant.name as string}</span>
                              </div>
                            </TableCell>
                            <TableCell className="italic text-sm text-muted-foreground">
                              {(plant.latin_name as string) || <span className="text-amber-500 not-italic">—</span>}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {plant.family ? (
                                  <Badge variant="outline" className="text-xs">{plant.family as string}</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs text-amber-600">Sans famille</Badge>
                                )}
                                {plant.genus && (
                                  <div className="text-xs text-muted-foreground italic">{plant.genus as string}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize text-xs">
                                {(plant.category as string) || "—"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {plant.gbif_id ? (
                                  <span className="text-xs text-green-600 dark:text-green-400">✓ GBIF</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">— GBIF</span>
                                )}
                                {plant.wikidata_qid ? (
                                  <span className="text-xs text-green-600 dark:text-green-400">✓ WD</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">— WD</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {plant.conservation_status && plant.conservation_status !== "NE" ? (
                                <span className={`text-xs font-bold px-2 py-1 rounded ${CONSERVATION_COLORS[plant.conservation_status as string] || ""}`}>
                                  {plant.conservation_status as string}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">NE</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link href={`/plant/${plant.id}`}>
                                  <Button variant="ghost" size="sm" title="Voir la fiche">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEdit(plant as Record<string, unknown>)}
                                  title="Éditer / Enrichir"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Éditer
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                  onClick={() => handleOpenDelete(plant as Record<string, unknown>)}
                                  title="Supprimer cette plante"
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
                        Page {page} sur {totalPages} ({data?.total} plantes)
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {/* Pages proches */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                          return (
                            <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}>
                              {p}
                            </Button>
                          );
                        })}
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ─── Dialog d'édition ─── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              {selectedPlant?.name as string}
            </DialogTitle>
            <DialogDescription>
              ID #{selectedPlant?.id as number} — Modifiez les champs manuellement ou enrichissez via GBIF/Wikidata.
            </DialogDescription>
          </DialogHeader>

          {isLoadingFull ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs value={editTab} onValueChange={setEditTab} className="mt-2">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="manual">
                  <Edit className="h-4 w-4 mr-2" />
                  Édition manuelle
                </TabsTrigger>
                <TabsTrigger value="enrich">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enrichissement API
                </TabsTrigger>
              </TabsList>

              {/* ── Onglet Édition manuelle ── */}
              <TabsContent value="manual" className="space-y-4 pt-4">
                {/* Identité */}
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Identité</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom commun</Label>
                    <Input defaultValue={fullPlant?.name as string || ""} onChange={(e) => setEditFields(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom latin</Label>
                    <Input defaultValue={fullPlant?.latin_name as string || ""} placeholder="ex: Rosa damascena" onChange={(e) => setEditFields(f => ({ ...f, latin_name: e.target.value || null }))} className="italic" />
                  </div>
                  <div className="space-y-2">
                    <Label>Auteur / Citation</Label>
                    <Input defaultValue={fullPlant?.author_citation as string || ""} placeholder="ex: Mill." onChange={(e) => setEditFields(f => ({ ...f, author_citation: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Origine géographique</Label>
                    <Input defaultValue={fullPlant?.origin as string || ""} onChange={(e) => setEditFields(f => ({ ...f, origin: e.target.value || null }))} />
                  </div>
                </div>

                {/* Taxonomie */}
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-4 mb-2">Taxonomie</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Règne (Kingdom)</Label>
                    <Input defaultValue={fullPlant?.kingdom as string || "Plantae"} onChange={(e) => setEditFields(f => ({ ...f, kingdom: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Division</Label>
                    <Input defaultValue={fullPlant?.division as string || ""} onChange={(e) => setEditFields(f => ({ ...f, division: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordre</Label>
                    <Input defaultValue={fullPlant?.order_name as string || ""} onChange={(e) => setEditFields(f => ({ ...f, order_name: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Famille</Label>
                    <Input defaultValue={fullPlant?.family as string || ""} placeholder="ex: Rosaceae" onChange={(e) => setEditFields(f => ({ ...f, family: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Input defaultValue={fullPlant?.genus as string || ""} placeholder="ex: Rosa" onChange={(e) => setEditFields(f => ({ ...f, genus: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Espèce</Label>
                    <Input defaultValue={fullPlant?.species as string || ""} placeholder="ex: damascena" onChange={(e) => setEditFields(f => ({ ...f, species: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sous-espèce</Label>
                    <Input defaultValue={fullPlant?.subspecies as string || ""} onChange={(e) => setEditFields(f => ({ ...f, subspecies: e.target.value || null }))} />
                  </div>
                </div>

                {/* IDs externes */}
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-4 mb-2">Identifiants externes</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>QID Wikidata</Label>
                    <Input defaultValue={fullPlant?.wikidata_qid as string || ""} placeholder="ex: Q34687" onChange={(e) => setEditFields(f => ({ ...f, wikidata_qid: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>GBIF ID</Label>
                    <Input defaultValue={fullPlant?.gbif_id as string || ""} placeholder="ex: 5284517" onChange={(e) => setEditFields(f => ({ ...f, gbif_id: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>NCBI TaxID</Label>
                    <Input defaultValue={fullPlant?.ncbi_tax_id as string || ""} placeholder="ex: 3760" onChange={(e) => setEditFields(f => ({ ...f, ncbi_tax_id: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>IUCN ID</Label>
                    <Input defaultValue={fullPlant?.iucn_id as string || ""} onChange={(e) => setEditFields(f => ({ ...f, iucn_id: e.target.value || null }))} />
                  </div>
                </div>

                {/* Conservation */}
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-4 mb-2">Conservation</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Statut IUCN</Label>
                    <Select
                      defaultValue={fullPlant?.conservation_status as string || "NE"}
                      onValueChange={(v) => setEditFields(f => ({ ...f, conservation_status: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CONSERVATION_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{k} — {v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut historique</Label>
                    <Input defaultValue={fullPlant?.historical_status as string || ""} onChange={(e) => setEditFields(f => ({ ...f, historical_status: e.target.value || null }))} />
                  </div>
                </div>

                {/* Récolte */}
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-4 mb-2">Production</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Période de récolte</Label>
                    <Input defaultValue={fullPlant?.harvest_period as string || ""} placeholder="ex: Juin–Août" onChange={(e) => setEditFields(f => ({ ...f, harvest_period: e.target.value || null }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rendement en HE</Label>
                    <Input defaultValue={fullPlant?.essential_oil_yield as string || ""} placeholder="ex: 0.2–0.4%" onChange={(e) => setEditFields(f => ({ ...f, essential_oil_yield: e.target.value || null }))} />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 mt-2">
                  <Label>Notes</Label>
                  <Textarea defaultValue={fullPlant?.notes as string || ""} rows={3} onChange={(e) => setEditFields(f => ({ ...f, notes: e.target.value || null }))} />
                </div>
                <div className="space-y-2">
                  <Label>Habitat</Label>
                  <Textarea defaultValue={fullPlant?.habitat as string || ""} rows={2} onChange={(e) => setEditFields(f => ({ ...f, habitat: e.target.value || null }))} />
                </div>
                <div className="space-y-2">
                  <Label>Notes de conservation</Label>
                  <Textarea defaultValue={fullPlant?.conservation_notes as string || ""} rows={2} onChange={(e) => setEditFields(f => ({ ...f, conservation_notes: e.target.value || null }))} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
                  <Button
                    onClick={handleSaveFields}
                    disabled={updateFieldsMutation.isPending || !Object.keys(editFields).length}
                    className="btn-enhanced"
                  >
                    {updateFieldsMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enregistrement…</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4 mr-2" />Enregistrer</>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* ── Onglet Enrichissement API ── */}
              <TabsContent value="enrich" className="space-y-4 pt-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Enrichissez automatiquement les champs manquants depuis des bases de données botaniques.
                  Seuls les champs <strong>vides</strong> seront mis à jour.
                </div>

                {/* État actuel */}
                {fullPlant && (
                  <div className="grid grid-cols-2 gap-2 text-sm border rounded-lg p-4 bg-muted/30 mb-4">
                    {[
                      { label: "Famille", value: fullPlant.family },
                      { label: "Genre", value: fullPlant.genus },
                      { label: "Nom latin", value: fullPlant.latin_name },
                      { label: "GBIF ID", value: fullPlant.gbif_id },
                      { label: "Wikidata QID", value: fullPlant.wikidata_qid },
                      { label: "NCBI TaxID", value: fullPlant.ncbi_tax_id },
                      { label: "IUCN ID", value: fullPlant.iucn_id },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-2">
                        {value ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <span className="truncate">
                          <strong>{label} :</strong>{" "}
                          {value ? (
                            <span className="font-mono text-xs">{String(value).slice(0, 30)}</span>
                          ) : (
                            <em className="text-muted-foreground">manquant</em>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid gap-3">
                  {/* GBIF */}
                  <div className="flex items-start justify-between p-4 border rounded-lg gap-4">
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500" />
                        GBIF — Global Biodiversity Information Facility
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enrichit : famille, genre, espèce, GBIF ID. Recherche par nom latin puis par nom commun.
                      </p>
                      {enrichGBIFMutation.data && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {enrichGBIFMutation.data.message}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => enrichGBIFMutation.mutate({ id: selectedPlant!.id as number })}
                      disabled={enrichGBIFMutation.isPending}
                      className="shrink-0"
                    >
                      {enrichGBIFMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enrichir GBIF"}
                    </Button>
                  </div>

                  {/* Wikidata */}
                  <div className="flex items-start justify-between p-4 border rounded-lg gap-4">
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        Wikidata (via QID)
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enrichit : famille (P171), genre (P171), GBIF ID (P846), NCBI TaxID (P685), IUCN ID (P627).
                        {!fullPlant?.wikidata_qid && (
                          <span className="text-amber-600 ml-1">
                            ⚠ QID manquant — renseignez-le d'abord dans l'onglet Édition.
                          </span>
                        )}
                      </p>
                      {enrichWikidataMutation.data && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {enrichWikidataMutation.data.message}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => enrichWikidataMutation.mutate({ id: selectedPlant!.id as number })}
                      disabled={enrichWikidataMutation.isPending || !fullPlant?.wikidata_qid}
                      className="shrink-0"
                    >
                      {enrichWikidataMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enrichir Wikidata"}
                    </Button>
                  </div>
                </div>

                {/* Lien vers la page d'enrichissement taxonomique en masse */}
                <div className="border rounded-lg p-4 bg-muted/30 text-sm">
                  <p className="font-medium flex items-center gap-2 mb-1">
                    <TreePine className="h-4 w-4 text-green-600" />
                    Enrichissement en masse
                  </p>
                  <p className="text-muted-foreground">
                    Pour traiter toutes les plantes sans famille/genre en une seule opération, utilisez la page dédiée.
                  </p>
                  <Link href="/admin/taxonomy-enrichment">
                    <Button variant="outline" size="sm" className="mt-2">
                      Aller à l'enrichissement taxonomique →
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Dialog de suppression ─── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Supprimer la plante ?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Vous êtes sur le point de supprimer définitivement{" "}
                <strong>"{selectedPlant?.name as string}"</strong> (ID #{selectedPlant?.id as number}).
              </p>
              {deletionImpact && (
                deletionImpact.moleculeCount > 0 || deletionImpact.varietyCount > 0 ||
                deletionImpact.terroirCount > 0 || deletionImpact.analysisCount > 0 || deletionImpact.sampleCount > 0
              ) && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm text-destructive">
                  <p className="font-medium">⚠ Cette plante est liée à :</p>
                  {deletionImpact.moleculeCount > 0 && <p>• {deletionImpact.moleculeCount} molécule(s)</p>}
                  {deletionImpact.varietyCount > 0 && <p>• {deletionImpact.varietyCount} variété(s)</p>}
                  {deletionImpact.terroirCount > 0 && <p>• {deletionImpact.terroirCount} terroir(s)</p>}
                  {deletionImpact.analysisCount > 0 && <p>• {deletionImpact.analysisCount} analyse(s)</p>}
                  {deletionImpact.sampleCount > 0 && <p>• {deletionImpact.sampleCount} échantillon(s)</p>}
                  <p className="mt-1">Ces liaisons seront également supprimées.</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Suppression…</>
              ) : (
                <><Trash2 className="h-4 w-4 mr-2" />Supprimer définitivement</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
