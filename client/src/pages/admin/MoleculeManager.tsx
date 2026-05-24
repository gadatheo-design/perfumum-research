// @ts-nocheck
/**
 * Page d'administration — Molecule Manager
 * Gestion des doublons de molécules et des relations plantes-molécules
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle2,
  Merge,
  Search,
  Link2,
  Link2Off,
  BarChart3,
  RefreshCw,
  Trash2,
  Plus,
  FlaskConical,
  Leaf,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  PieChart,
  ClipboardList,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Composant Statistiques ──────────────────────────────────────────────────

function StatsPanel() {
  const { data: stats, isLoading, refetch } = trpc.moleculeManager.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Molécules totales", value: stats?.totalMolecules, icon: FlaskConical, color: "text-blue-500" },
    { label: "Plantes totales", value: stats?.totalPlants, icon: Leaf, color: "text-green-500" },
    { label: "Liens plantes-molécules", value: stats?.totalLinks, icon: Link2, color: "text-purple-500" },
    { label: "Couverture plantes", value: `${stats?.plantCoverage}%`, icon: BarChart3, color: "text-emerald-500" },
    { label: "Couverture molécules", value: `${stats?.moleculeCoverage}%`, icon: BarChart3, color: "text-teal-500" },
    { label: "Groupes de doublons", value: stats?.duplicateGroups, icon: AlertTriangle, color: "text-amber-500" },
    { label: "Molécules en doublon", value: stats?.duplicateMolecules, icon: AlertTriangle, color: "text-orange-500" },
    { label: "Molécules orphelines", value: stats?.orphanMolecules, icon: Link2Off, color: "text-red-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Vue d'ensemble</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Composant Gestion des Doublons ─────────────────────────────────────────

function DuplicatesManager() {
  const { toast } = useToast();
  const [dryRun, setDryRun] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [mergeResult, setMergeResult] = useState<any>(null);

  const { data: groups, isLoading, refetch } = trpc.moleculeManager.getDuplicateGroups.useQuery();

  const mergeAll = trpc.moleculeManager.mergeAllDuplicates.useMutation({
    onSuccess: (data) => {
      setMergeResult(data);
      if (!dryRun) {
        refetch();
        toast({
          title: "Fusion terminée",
          description: data.message,
        });
      }
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const mergeSingle = trpc.moleculeManager.mergeDuplicates.useMutation({
    onSuccess: (data) => {
      if (!dryRun) {
        refetch();
        toast({ title: "Fusion effectuée", description: data.message });
      } else {
        toast({ title: "Simulation", description: data.message });
      }
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="space-y-3 animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg" />)}</div>;
  }

  const totalGroups = groups?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Contrôles globaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Merge className="w-5 h-5 text-amber-500" />
            Fusion des doublons
          </CardTitle>
          <CardDescription>
            {totalGroups} groupe{totalGroups > 1 ? "s" : ""} de doublons détecté{totalGroups > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Switch
              id="dry-run"
              checked={dryRun}
              onCheckedChange={setDryRun}
            />
            <Label htmlFor="dry-run" className="cursor-pointer">
              Mode simulation (dry run)
              <span className="block text-xs text-muted-foreground">
                {dryRun ? "Aucune modification ne sera effectuée" : "⚠️ Les fusions seront appliquées en base de données"}
              </span>
            </Label>
          </div>

          {!dryRun && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Le mode simulation est désactivé. Les fusions seront appliquées de manière irréversible.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => mergeAll.mutate({ dryRun })}
              disabled={mergeAll.isPending || totalGroups === 0}
              variant={dryRun ? "outline" : "destructive"}
              className="flex-1"
            >
              {mergeAll.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Merge className="w-4 h-4 mr-2" />
              )}
              {dryRun ? "Simuler la fusion de tous les doublons" : `Fusionner tous les doublons (${totalGroups} groupes)`}
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {mergeResult && (
            <Alert className={mergeResult.success ? "border-green-500" : "border-red-500"}>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <strong>{mergeResult.message}</strong>
                {mergeResult.results && (
                  <ul className="mt-2 text-xs space-y-1">
                    {mergeResult.results.slice(0, 5).map((r: any, i: number) => (
                      <li key={i}>• {r.name}: conserver ID {r.keepId}, supprimer {r.removeIds.join(", ")}</li>
                    ))}
                    {mergeResult.results.length > 5 && (
                      <li className="text-muted-foreground">... et {mergeResult.results.length - 5} autres</li>
                    )}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Liste des groupes de doublons */}
      <div className="space-y-3">
        {groups?.map((group) => (
          <Card key={group.nameNormalized} className="border-amber-200 dark:border-amber-800">
            <CardHeader
              className="cursor-pointer py-3"
              onClick={() => setExpandedGroup(expandedGroup === group.nameNormalized ? null : group.nameNormalized)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-amber-600 border-amber-400">
                    {group.count} doublons
                  </Badge>
                  <span className="font-medium capitalize">{group.nameNormalized}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    IDs: {group.molecules.map((m: any) => m.id).join(", ")}
                  </span>
                  {expandedGroup === group.nameNormalized ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedGroup === group.nameNormalized && (
              <CardContent className="pt-0">
                <div className="grid gap-3">
                  {group.molecules.map((mol: any, idx: number) => (
                    <div
                      key={mol.id}
                      className={`p-3 rounded-lg border ${idx === 0 ? "border-green-400 bg-green-50 dark:bg-green-950/20" : "border-muted"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={idx === 0 ? "default" : "secondary"}>
                              ID {mol.id}
                            </Badge>
                            {idx === 0 && <Badge className="bg-green-500 text-white text-xs">À conserver</Badge>}
                            <span className="font-medium">{mol.name}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                            {mol.cas_number && <div>CAS: {mol.cas_number}</div>}
                            {mol.chemical_class && <div>Classe: {mol.chemical_class}</div>}
                            {mol.chemical_formula && <div>Formule: {mol.chemical_formula}</div>}
                          </div>
                        </div>
                        <div className="text-right text-xs space-y-1">
                          <div className="flex items-center gap-1 justify-end">
                            <Leaf className="w-3 h-3 text-green-500" />
                            <span>{mol.plant_links} plantes</span>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <FlaskConical className="w-3 h-3 text-blue-500" />
                            <span>{mol.recipe_links} recettes</span>
                          </div>
                          {idx !== 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-6 mt-1"
                              onClick={() => mergeSingle.mutate({
                                keepId: group.molecules[0].id,
                                removeIds: [mol.id],
                                dryRun,
                              })}
                              disabled={mergeSingle.isPending}
                            >
                              <Merge className="w-3 h-3 mr-1" />
                              {dryRun ? "Simuler" : "Fusionner"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {totalGroups === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-medium">Aucun doublon détecté</p>
            <p className="text-sm">La base de données est propre.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composant Relations Plantes-Molécules ───────────────────────────────────

function PlantMoleculeRelations() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addForm, setAddForm] = useState({ plantId: "", moleculeId: "", percentage: "", source: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  const { data, isLoading, refetch } = trpc.moleculeManager.getPlantMoleculeRelations.useQuery({
    page,
    pageSize: 20,
  });

  const addRelation = trpc.moleculeManager.addPlantMoleculeRelation.useMutation({
    onSuccess: () => {
      refetch();
      setAddForm({ plantId: "", moleculeId: "", percentage: "", source: "" });
      setShowAddForm(false);
      toast({ title: "Relation ajoutée", description: "Le lien plante-molécule a été créé." });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const removeRelation = trpc.moleculeManager.removePlantMoleculeRelation.useMutation({
    onSuccess: () => {
      refetch();
      toast({ title: "Relation supprimée" });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const getDisplayPercentage = (rel: any) => {
    if (rel.percentage_typical) return `${rel.percentage_typical}%`;
    if (rel.percentage_min && rel.percentage_max) return `${rel.percentage_min}-${rel.percentage_max}%`;
    if (rel.percentage) return `${rel.percentage}%`;
    return null;
  };

  const filtered = data?.relations?.filter((r: any) =>
    !search ||
    r.plant_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.molecule_name?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      {/* Barre d'outils */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filtrer par plante ou molécule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un lien
        </Button>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              Nouveau lien plante-molécule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">ID Plante *</Label>
                <Input
                  type="number"
                  placeholder="ex: 1234"
                  value={addForm.plantId}
                  onChange={(e) => setAddForm({ ...addForm, plantId: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">ID Molécule *</Label>
                <Input
                  type="number"
                  placeholder="ex: 5678"
                  value={addForm.moleculeId}
                  onChange={(e) => setAddForm({ ...addForm, moleculeId: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Pourcentage (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="ex: 12.5"
                  value={addForm.percentage}
                  onChange={(e) => setAddForm({ ...addForm, percentage: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Source</Label>
                <Input
                  placeholder="ex: GC-MS, littérature..."
                  value={addForm.source}
                  onChange={(e) => setAddForm({ ...addForm, source: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => addRelation.mutate({
                  plantId: parseInt(addForm.plantId),
                  moleculeId: parseInt(addForm.moleculeId),
                  percentage: addForm.percentage ? parseFloat(addForm.percentage) : undefined,
                  source: addForm.source || undefined,
                })}
                disabled={!addForm.plantId || !addForm.moleculeId || addRelation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer le lien
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des relations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-500" />
            Relations plantes-molécules
            {data?.total && (
              <Badge variant="secondary">{data.total} au total</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-3">ID</th>
                    <th className="text-left py-2 px-3">Plante</th>
                    <th className="text-left py-2 px-3">Molécule</th>
                    <th className="text-right py-2 px-3">%</th>
                    <th className="text-left py-2 px-3">Source</th>
                    <th className="text-right py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rel: any) => (
                    <tr key={`${rel.plant_id}-${rel.molecule_id}`} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-2 px-3 text-muted-foreground">{rel.plant_id}/{rel.molecule_id}</td>
                      <td className="py-2 px-3">
                        <div className="font-medium">{rel.plant_name}</div>
                        {rel.plant_scientific_name && (
                          <div className="text-xs text-muted-foreground italic">{rel.plant_scientific_name}</div>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium">{rel.molecule_name}</div>
                        {rel.molecule_cas && (
                          <div className="text-xs text-muted-foreground">CAS: {rel.molecule_cas}</div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {getDisplayPercentage(rel) ? (
                          <Badge variant="outline">{getDisplayPercentage(rel)}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">
                        {rel.source || "—"}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (confirm(`Supprimer le lien entre "${rel.plant_name}" et "${rel.molecule_name}" ?`)) {
                              removeRelation.mutate({ plantId: rel.plant_id, moleculeId: rel.molecule_id });
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Link2Off className="w-8 h-8 mx-auto mb-2" />
                  <p>Aucune relation trouvée</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {data && data.total > 20 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Page {page} sur {Math.ceil(data.total / 20)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(data.total / 20)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Composant Qualité des données ──────────────────────────────────────────────

function DataQualityPanel() {
  const { data: stats, isLoading, refetch } = trpc.moleculeManager.getDataQualityStats.useQuery();
  const { data: malformed, isLoading: loadingMalformed } = trpc.moleculeManager.getMalformedPlants.useQuery();
  const { data: categories } = trpc.moleculeManager.getCategoryDistribution.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Qualité des données — Plantes</h2>
          <p className="text-sm text-muted-foreground">Rapport de l'état de la base de données après nettoyage</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques de qualité */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Plantes uniques</span>
              </div>
              <p className="text-2xl font-bold">{stats?.totalPlants}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Couverture compositions</span>
              </div>
              <p className="text-2xl font-bold">{stats?.coveragePercent}%</p>
              <p className="text-xs text-muted-foreground">{stats?.plantsWithCompositions}/{stats?.totalPlants} plantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Sans nom latin</span>
              </div>
              <p className="text-2xl font-bold">{stats?.plantsWithoutLatinName}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                {stats?.duplicatePlantGroups === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                )}
                <span className="text-xs text-muted-foreground">Groupes doublons</span>
              </div>
              <p className="text-2xl font-bold">{stats?.duplicatePlantGroups}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                {stats?.malformedNames === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-muted-foreground">Noms mal formatés</span>
              </div>
              <p className="text-2xl font-bold">{stats?.malformedNames}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                {stats?.malformedLatinNames === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-muted-foreground">Noms latins mal formatés</span>
              </div>
              <p className="text-2xl font-bold">{stats?.malformedLatinNames}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Molécules</span>
              </div>
              <p className="text-2xl font-bold">{stats?.totalMolecules}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">Relations</span>
              </div>
              <p className="text-2xl font-bold">{stats?.totalLinks}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Répartition par catégorie */}
      {categories && categories?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories?.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium capitalize">{cat.category}</span>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plantes mal formatées */}
      {malformed && malformed?.length > 0 ? (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
              Plantes encore mal formatées ({malformed?.length})
            </CardTitle>
            <CardDescription>
              Ces entrées nécessitent une correction manuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-3">ID</th>
                    <th className="text-left py-2 px-3">Nom</th>
                    <th className="text-left py-2 px-3">Nom latin</th>
                    <th className="text-left py-2 px-3">Catégorie</th>
                  </tr>
                </thead>
                <tbody>
                  {malformed?.map((plant) => (
                    <tr key={plant.id} className="border-b hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{plant.id}</td>
                      <td className="py-2 px-3 max-w-xs">
                        <span className="text-orange-600 dark:text-orange-400 font-medium">{plant.name.substring(0, 60)}{plant.name.length > 60 ? '...' : ''}</span>
                      </td>
                      <td className="py-2 px-3 text-xs italic text-muted-foreground">{plant.latinName || '—'}</td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="text-xs">{plant.category}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            <strong>Base de données propre !</strong> Aucune plante avec un nom mal formaté détectée.
          </AlertDescription>
        </Alert>
      )}

      {/* Résumé du nettoyage */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Journal de nettoyage (session 4 mars 2026)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>157 plantes avec noms CSV mal formatés corrigés (séparateurs ; extraits et remappés)</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>509 entrées bibliographiques supprimées (URLs, références importées par erreur comme plantes)</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>577 doublons de plantes fusionnés (1 008 → 431 plantes uniques)</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>44 latin_name descriptifs nettoyés (déplacés vers olfactive_signature)</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>1 ligne d'en-tête CSV supprimée (ID 600001)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function MoleculeManager() {
  return (
    <div className="container py-8 max-w-6xl">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FlaskConical className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Molecule Manager</h1>
            <p className="text-muted-foreground text-sm">
              Gestion des doublons de molécules et des relations plantes-molécules
            </p>
          </div>
        </div>

        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Cet outil d'administration permet d'identifier et fusionner les molécules dupliquées, 
            et de gérer manuellement les relations entre plantes et molécules.
          </AlertDescription>
        </Alert>
      </div>

      {/* Statistiques */}
      <StatsPanel />

      <Separator className="my-8" />

      {/* Onglets */}
      <Tabs defaultValue="duplicates">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Merge className="w-4 h-4" />
            Doublons molécules
          </TabsTrigger>
          <TabsTrigger value="relations" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Relations
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Qualité des données
          </TabsTrigger>
        </TabsList>

        <TabsContent value="duplicates">
          <DuplicatesManager />
        </TabsContent>

        <TabsContent value="relations">
          <PlantMoleculeRelations />
        </TabsContent>

        <TabsContent value="quality">
          <DataQualityPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
