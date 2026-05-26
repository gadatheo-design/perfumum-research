// @ts-nocheck
import { useState, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Beaker,
  Edit,
  Search,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Sparkles,
  Wand2,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 20;

type MoleculeRow = {
  id: number;
  name: string;
  family?: string | null;
  chemicalFormula?: string | null;
  radarIntensity?: number | null;
};

type FullMolecule = {
  id: number;
  name: string;
  family: string | null;
  chemicalFamily: string | null;
  casNumber: string | null;
  iupacName: string | null;
  smiles: string | null;
  wikidataQid: string | null;
  pubchemCid: number | null;
  chebiId: string | null;
  olfactiveProfile: string | null;
  therapeuticProperties: string | null;
  notes: string | null;
};

export default function AdminMoleculesIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeRow | null>(null);
  const [editTab, setEditTab] = useState("manual");

  // Radar values
  const [radarValues, setRadarValues] = useState({
    radarIntensity: 50,
    radarFreshness: 50,
    radarWarmth: 50,
    radarSweetness: 50,
    radarSpiciness: 50,
    radarEarthiness: 50,
  });

  // Edit fields
  const [editFields, setEditFields] = useState<Partial<FullMolecule>>({});

  const { data: molecules, isLoading, refetch } = trpc.molecules?.list.useQuery();

  // Full molecule data for editing
  const { data: fullMolecule, isLoading: isLoadingFull } = trpc.moleculesAdmin?.getFullById.useQuery(
    { id: selectedMolecule?.id ?? 0 },
    { enabled: !!selectedMolecule && editDialogOpen }
  );

  // Impact de suppression
  const { data: deletionImpact } = trpc.moleculesAdmin?.getDeletionImpact.useQuery(
    { id: selectedMolecule?.id ?? 0 },
    { enabled: !!selectedMolecule && deleteDialogOpen }
  );

  // Mutations
  const updateRadarMutation = trpc.molecules?.updateRadar.useMutation({
    onSuccess: () => {
      toast.success("Profil radar mis à jour");
      refetch();
      setEditDialogOpen(false);
    },
    onError: (e) => toast.error(`Erreur radar: ${e.message}`),
  });

  const updateFieldsMutation = trpc.moleculesAdmin?.updateFields.useMutation({
    onSuccess: () => {
      toast.success("Molécule mise à jour avec succès");
      refetch();
      setEditDialogOpen(false);
    },
    onError: (e) => toast.error(`Erreur: ${e.message}`),
  });

  const deleteMutation = trpc.moleculesAdmin?.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`Molécule "${data.name}" supprimée`);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedMolecule(null);
    },
    onError: (e) => toast.error(`Erreur suppression: ${e.message}`),
  });

  const enrichPubChemMutation = trpc.molecules?.enrichFromPubChem.useMutation({
    onSuccess: () => {
      toast.success("Enrichissement PubChem appliqué");
      refetch();
    },
    onError: (e) => toast.error(`Erreur PubChem: ${e.message}`),
  });

  const enrichWikidataMutation = trpc.moleculesAdmin?.enrichFromWikidata.useMutation({
    onSuccess: (data) => {
      if (data.fieldsUpdated.length === 0) {
        toast.info("Aucun nouveau champ trouvé sur Wikidata (déjà enrichi ou données manquantes)");
      } else {
        toast.success(`Wikidata : ${data.fieldsUpdated.join(", ")} mis à jour`);
      }
      refetch();
    },
    onError: (e) => toast.error(`Erreur Wikidata: ${e.message}`),
  });

  // Filtrage et pagination
  const filteredMolecules = molecules?.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.family?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.chemicalFormula?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredMolecules.length / ITEMS_PER_PAGE);
  const paginatedMolecules = filteredMolecules.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenEdit = useCallback((molecule: MoleculeRow) => {
    setSelectedMolecule(molecule);
    setRadarValues({
      radarIntensity: (molecule as any).radarIntensity || 50,
      radarFreshness: (molecule as any).radarFreshness || 50,
      radarWarmth: (molecule as any).radarWarmth || 50,
      radarSweetness: (molecule as any).radarSweetness || 50,
      radarSpiciness: (molecule as any).radarSpiciness || 50,
      radarEarthiness: (molecule as any).radarEarthiness || 50,
    });
    setEditFields({});
    setEditTab("manual");
    setEditDialogOpen(true);
  }, []);

  const handleOpenDelete = useCallback((molecule: MoleculeRow) => {
    setSelectedMolecule(molecule);
    setDeleteDialogOpen(true);
  }, []);

  const handleSaveRadar = () => {
    if (!selectedMolecule) return;
    updateRadarMutation.mutate({ id: selectedMolecule.id, ...radarValues });
  };

  const handleSaveFields = () => {
    if (!selectedMolecule || !Object.keys(editFields).length) {
      toast.warning("Aucune modification à enregistrer");
      return;
    }
    updateFieldsMutation.mutate({ id: selectedMolecule.id, ...editFields });
  };

  const handleDelete = () => {
    if (!selectedMolecule) return;
    deleteMutation.mutate({ id: selectedMolecule.id });
  };

  const radarFields = [
    { key: "radarIntensity", label: "Intensité", color: "oklch(0.60 0.28 330)" },
    { key: "radarFreshness", label: "Fraîcheur", color: "oklch(0.65 0.25 140)" },
    { key: "radarWarmth", label: "Chaleur", color: "oklch(0.60 0.24 20)" },
    { key: "radarSweetness", label: "Douceur", color: "oklch(0.70 0.22 60)" },
    { key: "radarSpiciness", label: "Épices", color: "oklch(0.55 0.26 220)" },
    { key: "radarEarthiness", label: "Terreux", color: "oklch(0.55 0.12 160)" },
  ];

  // Sync editFields when fullMolecule loads
  const syncedRef = { current: false };
  if (fullMolecule && !syncedRef.current && Object.keys(editFields).length === 0) {
    // Pre-populate for display only (not dirty)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Gestion des Molécules</h1>
                <p className="text-muted-foreground">
                  {molecules?.length || 0} molécules — édition, enrichissement et suppression
                </p>
              </div>
            </div>
            <Link href="/admin/molecules/new">
              <Button className="btn-enhanced">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle molécule
              </Button>
            </Link>
          </div>

          {/* Recherche */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, famille ou formule..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tableau */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des molécules</CardTitle>
              <CardDescription>
                {filteredMolecules.length} molécules{searchTerm && ` pour "${searchTerm}"`}
                {" — "}
                <span className="text-xs text-muted-foreground">
                  Cliquez sur <strong>Éditer</strong> pour modifier manuellement ou enrichir via PubChem/Wikidata.
                  <strong className="text-destructive"> Supprimer</strong> efface la molécule et toutes ses liaisons.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Famille</TableHead>
                      <TableHead>Formule</TableHead>
                      <TableHead>Radar</TableHead>
                      <TableHead className="text-right min-w-[180px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMolecules.map((molecule) => {
                      const hasRadar = molecule.radarIntensity !== null && molecule.radarIntensity !== 50;
                      return (
                        <TableRow key={molecule.id}>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {molecule.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Beaker className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="font-medium">{molecule.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {molecule.family && (
                              <Badge variant="outline">{molecule.family}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {molecule.chemicalFormula || "—"}
                          </TableCell>
                          <TableCell>
                            {hasRadar ? (
                              <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">Configuré</Badge>
                            ) : (
                              <Badge variant="secondary">Par défaut</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/molecule/${molecule.id}`}>
                                <Button variant="ghost" size="sm" title="Voir la fiche">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEdit(molecule)}
                                title="Éditer / Enrichir"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Éditer
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                onClick={() => handleOpenDelete(molecule)}
                                title="Supprimer cette molécule"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                    <Button variant="outline" size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
              <Beaker className="h-5 w-5" />
              {selectedMolecule?.name}
            </DialogTitle>
            <DialogDescription>
              ID #{selectedMolecule?.id} — Modifiez les champs manuellement ou enrichissez via une API externe.
            </DialogDescription>
          </DialogHeader>

          {isLoadingFull ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs value={editTab} onValueChange={setEditTab} className="mt-2">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="manual">
                  <Edit className="h-4 w-4 mr-2" />
                  Édition manuelle
                </TabsTrigger>
                <TabsTrigger value="enrich">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enrichissement API
                </TabsTrigger>
                <TabsTrigger value="radar">
                  <FlaskConical className="h-4 w-4 mr-2" />
                  Profil radar
                </TabsTrigger>
              </TabsList>

              {/* ── Onglet Édition manuelle ── */}
              <TabsContent value="manual" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nom</Label>
                    <Input
                      id="edit-name"
                      defaultValue={fullMolecule?.name || ""}
                      onChange={(e) => setEditFields(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-family">Famille olfactive</Label>
                    <Input
                      id="edit-family"
                      defaultValue={fullMolecule?.family || ""}
                      onChange={(e) => setEditFields(f => ({ ...f, family: e.target.value || null }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-chemfamily">Famille chimique</Label>
                    <Input
                      id="edit-chemfamily"
                      defaultValue={fullMolecule?.chemicalFamily || ""}
                      onChange={(e) => setEditFields(f => ({ ...f, chemicalFamily: e.target.value || null }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cas">Numéro CAS</Label>
                    <Input
                      id="edit-cas"
                      defaultValue={fullMolecule?.casNumber || ""}
                      placeholder="ex: 78-70-6"
                      onChange={(e) => setEditFields(f => ({ ...f, casNumber: e.target.value || null }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-qid">QID Wikidata</Label>
                    <Input
                      id="edit-qid"
                      defaultValue={fullMolecule?.wikidataQid || ""}
                      placeholder="ex: Q193178"
                      onChange={(e) => setEditFields(f => ({ ...f, wikidataQid: e.target.value || null }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-pubchem">PubChem CID</Label>
                    <Input
                      id="edit-pubchem"
                      type="number"
                      defaultValue={fullMolecule?.pubchemCid ?? ""}
                      placeholder="ex: 6549"
                      onChange={(e) => setEditFields(f => ({ ...f, pubchemCid: e.target.value ? Number(e.target.value) : null }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-chebi">ChEBI ID</Label>
                    <Input
                      id="edit-chebi"
                      defaultValue={fullMolecule?.chebiId || ""}
                      placeholder="ex: CHEBI:25243"
                      onChange={(e) => setEditFields(f => ({ ...f, chebiId: e.target.value || null }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-iupac">Nom IUPAC</Label>
                  <Input
                    id="edit-iupac"
                    defaultValue={fullMolecule?.iupacName || ""}
                    onChange={(e) => setEditFields(f => ({ ...f, iupacName: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-smiles">SMILES</Label>
                  <Input
                    id="edit-smiles"
                    defaultValue={fullMolecule?.smiles || ""}
                    className="font-mono text-sm"
                    onChange={(e) => setEditFields(f => ({ ...f, smiles: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-olfactive">Profil olfactif (texte)</Label>
                  <Textarea
                    id="edit-olfactive"
                    defaultValue={fullMolecule?.olfactiveProfile || ""}
                    rows={2}
                    onChange={(e) => setEditFields(f => ({ ...f, olfactiveProfile: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-therapeutic">Propriétés thérapeutiques</Label>
                  <Textarea
                    id="edit-therapeutic"
                    defaultValue={fullMolecule?.therapeuticProperties || ""}
                    rows={2}
                    onChange={(e) => setEditFields(f => ({ ...f, therapeuticProperties: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    defaultValue={fullMolecule?.notes || ""}
                    rows={3}
                    onChange={(e) => setEditFields(f => ({ ...f, notes: e.target.value || null }))}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
                  <Button
                    onClick={handleSaveFields}
                    disabled={updateFieldsMutation.isPending || !Object.keys(editFields).length}
                    className="btn-enhanced"
                  >
                    {updateFieldsMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enregistrement...</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4 mr-2" />Enregistrer</>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* ── Onglet Enrichissement API ── */}
              <TabsContent value="enrich" className="space-y-4 pt-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Enrichissez automatiquement les champs manquants depuis des bases de données externes.
                  Seuls les champs <strong>vides</strong> seront mis à jour.
                </div>

                {/* État actuel */}
                {fullMolecule && (
                  <div className="grid grid-cols-2 gap-2 text-sm border rounded-lg p-4 bg-muted/30 mb-4">
                    <div className="flex items-center gap-2">
                      {fullMolecule.casNumber ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span>CAS : {fullMolecule.casNumber || <em className="text-muted-foreground">manquant</em>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {fullMolecule.smiles ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span>SMILES : {fullMolecule.smiles ? <code className="text-xs">{fullMolecule.smiles.slice(0, 20)}…</code> : <em className="text-muted-foreground">manquant</em>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {fullMolecule.iupacName ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span>IUPAC : {fullMolecule.iupacName ? <span className="text-xs">{fullMolecule.iupacName.slice(0, 25)}…</span> : <em className="text-muted-foreground">manquant</em>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {fullMolecule.wikidataQid ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span>Wikidata QID : {fullMolecule.wikidataQid || <em className="text-muted-foreground">manquant</em>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {fullMolecule.pubchemCid ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span>PubChem CID : {fullMolecule.pubchemCid || <em className="text-muted-foreground">manquant</em>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {fullMolecule.chebiId ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      <span>ChEBI : {fullMolecule.chebiId || <em className="text-muted-foreground">manquant</em>}</span>
                    </div>
                  </div>
                )}

                <div className="grid gap-3">
                  {/* PubChem */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-blue-500" />
                        PubChem
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enrichit : formule moléculaire, poids, SMILES, IUPAC, CAS via PubChem CID ou nom.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => enrichPubChemMutation.mutate({ moleculeId: selectedMolecule!.id })}
                      disabled={enrichPubChemMutation.isPending}
                    >
                      {enrichPubChemMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Enrichir"
                      )}
                    </Button>
                  </div>

                  {/* Wikidata */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        Wikidata (via QID)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enrichit : CAS (P231), SMILES (P233), IUPAC (P2566) depuis le QID Wikidata.
                        {!fullMolecule?.wikidataQid && (
                          <span className="text-amber-600 ml-1">⚠ QID manquant — renseignez-le d'abord dans l'onglet Édition.</span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => enrichWikidataMutation.mutate({ moleculeId: selectedMolecule!.id })}
                      disabled={enrichWikidataMutation.isPending || !fullMolecule?.wikidataQid}
                    >
                      {enrichWikidataMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Enrichir"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* ── Onglet Radar ── */}
              <TabsContent value="radar" className="space-y-6 pt-4">
                {radarFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {radarValues[field.key as keyof typeof radarValues]}
                      </span>
                    </div>
                    <Slider
                      id={field.key}
                      min={0} max={100} step={1}
                      value={[radarValues[field.key as keyof typeof radarValues]]}
                      onValueChange={(v) => setRadarValues(p => ({ ...p, [field.key]: v[0] }))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Faible</span><span>Moyen</span><span>Fort</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleSaveRadar} disabled={updateRadarMutation.isPending} className="btn-enhanced">
                    {updateRadarMutation.isPending ? "Enregistrement..." : "Enregistrer le radar"}
                  </Button>
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
              Supprimer la molécule ?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Vous êtes sur le point de supprimer définitivement{" "}
                <strong>"{selectedMolecule?.name}"</strong> (ID #{selectedMolecule?.id}).
              </p>
              {deletionImpact && (deletionImpact.recetteCount > 0 || deletionImpact.plantCount > 0) && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm text-destructive">
                  <p className="font-medium">⚠ Cette molécule est liée à :</p>
                  {deletionImpact.recetteCount > 0 && (
                    <p>• {deletionImpact.recetteCount} recette(s)</p>
                  )}
                  {deletionImpact.plantCount > 0 && (
                    <p>• {deletionImpact.plantCount} plante(s)</p>
                  )}
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
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Suppression...</>
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
