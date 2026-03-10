import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { toast } from "sonner";
import {
  Link2, Leaf, Play, Eye, CheckCircle, XCircle, AlertCircle,
  ExternalLink, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";

const PAGE_SIZE = 30;

type FilterMode = "all" | "missing" | "enriched";

export default function LOTUSBatch() {
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [page, setPage] = useState(1);

  const { data: stats, refetch: refetchStats } = trpc.lotus.getStats.useQuery();

  // Charger TOUTES les plantes avec nom latin (pas de limite artificielle)
  const { data: plantsData, isLoading: plantsLoading } = trpc.gbif.getPlantsToEnrich.useQuery({
    limit: 9999,
    onlyMissing: false,
  });

  const enrichMutation = trpc.lotus.enrichPlantLinks.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.plant} : ${data.created} liaison(s) créée(s)`);
      refetchStats();
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const batchMutation = trpc.lotus.enrichBatch.useMutation({
    onSuccess: (result) => {
      setBatchResults(result);
      setBatchRunning(false);
      refetchStats();
      toast.success(`Batch terminé : ${result.totalCreated} liaisons créées sur ${result.processed} plantes`);
    },
    onError: (err) => {
      setBatchRunning(false);
      toast.error(`Erreur batch : ${err.message}`);
    },
  });

  const handleBatch = () => {
    setBatchRunning(true);
    setBatchResults(null);
    batchMutation.mutate({ limit: 10, onlyWithoutLinks: true });
  };

  const handleEnrich = (plantId: number, dryRun = false) => {
    enrichMutation.mutate({ plantId, dryRun });
  };

  // Filtrage et recherche
  const filteredPlants = useMemo(() => {
    if (!plantsData) return [];
    let list = plantsData;

    // Filtre par mode
    if (filterMode === "missing") {
      list = list.filter(p => !p.gbifId || !p.family || !p.conservationStatus);
    } else if (filterMode === "enriched") {
      list = list.filter(p => p.gbifId && p.family);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.latinName?.toLowerCase().includes(q) ||
        p.family?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [plantsData, filterMode, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredPlants.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const paginatedPlants = filteredPlants.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Réinitialiser la page quand le filtre change
  const handleFilterChange = (mode: FilterMode) => {
    setFilterMode(mode);
    setPage(1);
  };
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const totalPlants = plantsData?.length ?? 0;
  const missingCount = plantsData?.filter(p => !p.gbifId || !p.family || !p.conservationStatus).length ?? 0;
  const enrichedCount = plantsData?.filter(p => p.gbifId && p.family).length ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs customItems={[
        { label: "Admin", path: "/admin" },
        { label: "LOTUS — Liaisons Plante-Molécule" },
      ]} />

      <main className="flex-1 container py-8 space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Link2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">LOTUS — Liaisons Plante-Molécule</h1>
            <p className="text-muted-foreground text-sm">
              Enrichissement automatique des liaisons via{" "}
              <a href="https://lotus.naturalproducts.net" target="_blank" rel="noopener noreferrer"
                className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                LOTUS/Wikidata <ExternalLink className="h-3 w-3" />
              </a>
              {" "}— 220 000+ paires espèce-molécule, sans crédits IA
            </p>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-emerald-600">{stats.totalPlants}</div>
                <div className="text-sm text-muted-foreground">Plantes avec nom latin</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">{stats.plantsWithLotus}</div>
                <div className="text-sm text-muted-foreground">Plantes enrichies LOTUS</div>
                <Progress value={stats.totalPlants > 0 ? (stats.plantsWithLotus / stats.totalPlants) * 100 : 0} className="mt-2 h-1" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-violet-600">{stats.totalLotusLinks}</div>
                <div className="text-sm text-muted-foreground">Liaisons créées via LOTUS</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Batch global */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="h-4 w-4" />
              Enrichissement batch (10 plantes)
            </CardTitle>
            <CardDescription>
              Traite les 10 prochaines plantes sans liaisons LOTUS. Respecte le rate limit Wikidata (1,2s/requête).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBatch}
              disabled={batchRunning}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {batchRunning ? "Traitement en cours..." : "Lancer le batch (10 plantes)"}
            </Button>

            {batchResults && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">✓ {batchResults.totalCreated} liaisons créées</span>
                  <span className="text-blue-600">{batchResults.processed} plantes traitées</span>
                  {batchResults.errors > 0 && <span className="text-red-600">{batchResults.errors} erreurs</span>}
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {batchResults.details?.map((d: any, i: number) => (
                    <div key={i} className="text-xs flex items-center gap-2">
                      {d.error ? (
                        <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                      ) : d.created > 0 ? (
                        <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      <span className="font-medium">{d.plant}</span>
                      {d.error ? (
                        <span className="text-red-500">{d.error}</span>
                      ) : (
                        <span className="text-muted-foreground">{d.created} liaison(s)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liste des plantes — toutes */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <CardTitle className="text-base flex items-center gap-2 shrink-0">
                <Leaf className="h-4 w-4" />
                Enrichissement par plante
                {!plantsLoading && (
                  <Badge variant="secondary" className="ml-1 font-mono">
                    {filteredPlants.length} / {totalPlants}
                  </Badge>
                )}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                {/* Filtres */}
                <div className="flex items-center gap-1 text-xs">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  {(["all", "missing", "enriched"] as FilterMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleFilterChange(mode)}
                      className={`px-2 py-1 rounded text-xs border transition-colors ${
                        filterMode === mode
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {mode === "all" && `Toutes (${totalPlants})`}
                      {mode === "missing" && `À enrichir (${missingCount})`}
                      {mode === "enriched" && `Enrichies (${enrichedCount})`}
                    </button>
                  ))}
                </div>

                {/* Recherche */}
                <Input
                  type="text"
                  placeholder="Rechercher (nom, latin, famille)…"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="h-8 text-xs w-52"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {plantsLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Chargement des plantes…</div>
            ) : filteredPlants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucune plante ne correspond aux critères sélectionnés.
              </div>
            ) : (
              <>
                {/* Liste paginée */}
                <div className="space-y-1.5">
                  {paginatedPlants.map((plant) => (
                    <div
                      key={plant.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{plant.name}</div>
                        <div className="text-xs text-muted-foreground italic truncate">{plant.latinName}</div>
                        {plant.family && (
                          <div className="text-xs text-muted-foreground truncate">{plant.family}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Statut GBIF */}
                        {plant.gbifId ? (
                          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 hidden sm:flex">
                            <CheckCircle className="h-2.5 w-2.5 mr-1" />
                            GBIF
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-200 bg-amber-50 hidden sm:flex">
                            <AlertCircle className="h-2.5 w-2.5 mr-1" />
                            Sans GBIF
                          </Badge>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnrich(plant.id, true)}
                          disabled={enrichMutation.isPending}
                          className="h-7 text-xs px-2"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Dry-run
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEnrich(plant.id, false)}
                          disabled={enrichMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs px-2"
                        >
                          <Link2 className="h-3 w-3 mr-1" />
                          Enrichir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Page {currentPage} / {totalPages} — {filteredPlants.length} plantes
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>

                      {/* Pages numérotées (max 7 visibles) */}
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="h-7 w-7 p-0 text-xs"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
