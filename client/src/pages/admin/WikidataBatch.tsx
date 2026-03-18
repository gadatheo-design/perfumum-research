import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { toast } from "sonner";
import {
  Globe, Leaf, FlaskConical, Play, Eye, CheckCircle, XCircle,
  ExternalLink, ChevronLeft, ChevronRight, Search, RefreshCw,
  Download, Trash2, Tag,
} from "lucide-react";

type EntityType = "molecules" | "plants";
type FilterMode = "all" | "enriched" | "pending";

export default function WikidataBatch() {
  const [entityType, setEntityType] = useState<EntityType>("molecules");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);
  const [batchLimit, setBatchLimit] = useState(50);
  const [manualQid, setManualQid] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchName, setSearchName] = useState("");

  const { data: stats, refetch: refetchStats } = trpc.wikidata.getStats.useQuery();

  const { data: moleculesData, isLoading: molLoading, refetch: refetchMol } = trpc.wikidata.listEnrichedMolecules.useQuery({
    page,
    limit: 30,
    filter: filterMode,
  }, { enabled: entityType === "molecules" });

  const { data: plantsData, isLoading: plantLoading, refetch: refetchPlants } = trpc.wikidata.listEnrichedPlants.useQuery({
    page,
    limit: 30,
    filter: filterMode,
  }, { enabled: entityType === "plants" });

  const searchMolMutation = trpc.wikidata.searchMolecule.useQuery(
    { name: searchName },
    { enabled: false }
  );

  const searchPlantMutation = trpc.wikidata.searchPlant.useQuery(
    { latinName: searchName },
    { enabled: false }
  );

  const setMolQidMutation = trpc.wikidata.setMoleculeQid.useMutation({
    onSuccess: () => {
      toast.success("QID Wikidata assigné avec succès");
      refetchMol();
      refetchStats();
      setManualQid("");
      setSelectedId(null);
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const setPlantQidMutation = trpc.wikidata.setPlantQid.useMutation({
    onSuccess: () => {
      toast.success("QID Wikidata assigné avec succès");
      refetchPlants();
      refetchStats();
      setManualQid("");
      setSelectedId(null);
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const clearMolQidMutation = trpc.wikidata.clearMoleculeQid.useMutation({
    onSuccess: () => {
      toast.success("QID supprimé");
      refetchMol();
      refetchStats();
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const clearPlantQidMutation = trpc.wikidata.clearPlantQid.useMutation({
    onSuccess: () => {
      toast.success("QID supprimé");
      refetchPlants();
      refetchStats();
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const batchMolMutation = trpc.wikidata.batchEnrichMolecules.useMutation({
    onSuccess: (data) => {
      setBatchResults(data);
      setBatchRunning(false);
      refetchStats();
      refetchMol();
      if (!data.dryRun) {
        toast.success(`Batch terminé : ${data.enriched} enrichies, ${data.failed} non trouvées, ${data.skipped} doublons`);
      }
    },
    onError: (err) => {
      setBatchRunning(false);
      toast.error(`Erreur batch : ${err.message}`);
    },
  });

  const batchPlantMutation = trpc.wikidata.batchEnrichPlants.useMutation({
    onSuccess: (data) => {
      setBatchResults(data);
      setBatchRunning(false);
      refetchStats();
      refetchPlants();
      if (!data.dryRun) {
        toast.success(`Batch terminé : ${data.enriched} enrichies, ${data.failed} non trouvées, ${data.skipped} doublons`);
      }
    },
    onError: (err) => {
      setBatchRunning(false);
      toast.error(`Erreur batch : ${err.message}`);
    },
  });

  const handleBatch = (dryRun = false) => {
    setBatchRunning(!dryRun);
    setBatchResults(null);
    if (entityType === "molecules") {
      batchMolMutation.mutate({ limit: batchLimit, delayMs: 500, dryRun });
    } else {
      batchPlantMutation.mutate({ limit: batchLimit, delayMs: 500, dryRun });
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    // Utiliser fetch direct pour la recherche Wikidata
    try {
      const params = new URLSearchParams({
        action: 'wbsearchentities',
        search: searchName,
        language: 'en',
        format: 'json',
        limit: '5',
        type: 'item',
        origin: '*',
      });
      const res = await fetch(`https://www.wikidata.org/w/api.php?${params}`);
      const data = await res.json();
      setSearchResult(data.search || []);
    } catch {
      toast.error("Erreur lors de la recherche Wikidata");
    }
  };

  const handleAssignQid = (id: number, qid: string) => {
    if (!qid.match(/^Q\d+$/)) {
      toast.error("Format QID invalide (ex: Q193178)");
      return;
    }
    if (entityType === "molecules") {
      setMolQidMutation.mutate({ moleculeId: id, qid });
    } else {
      setPlantQidMutation.mutate({ plantId: id, qid });
    }
  };

  const handleClearQid = (id: number) => {
    if (entityType === "molecules") {
      clearMolQidMutation.mutate({ moleculeId: id });
    } else {
      clearPlantQidMutation.mutate({ plantId: id });
    }
  };

  const currentData = entityType === "molecules" ? moleculesData : plantsData;
  const isLoading = entityType === "molecules" ? molLoading : plantLoading;

  const filteredItems = useMemo(() => {
    if (!currentData?.items) return [];
    if (!searchQuery.trim()) return currentData.items;
    const q = searchQuery.toLowerCase();
    return currentData.items.filter((item: any) => {
      const name = item.name || item.latin_name || "";
      return name.toLowerCase().includes(q);
    });
  }, [currentData, searchQuery]);

  const molStats = stats?.molecules;
  const plantStats = stats?.plants;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 container py-8 max-w-7xl">
        <Breadcrumbs items={[
          { label: "Admin", href: "/admin" },
          { label: "Wikidata QIDs" },
        ]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-blue-500" />
            Enrichissement Wikidata
          </h1>
          <p className="text-muted-foreground">
            NOSE Phase 4 — Intégration des identifiants Wikidata (QIDs) pour l'interopérabilité 
            avec Odeuropa et Europeana. Chaque QID permet de lier les entités PERFUMUM au graphe 
            de connaissance mondial.
          </p>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-400">{molStats?.enriched || 0}</div>
              <div className="text-sm text-muted-foreground">Molécules enrichies</div>
              <div className="text-xs text-muted-foreground">/ {molStats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-400">{molStats?.pending || 0}</div>
              <div className="text-sm text-muted-foreground">Molécules en attente</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-400">{plantStats?.enriched || 0}</div>
              <div className="text-sm text-muted-foreground">Plantes enrichies</div>
              <div className="text-xs text-muted-foreground">/ {plantStats?.total || 0}</div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/30">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-400">{plantStats?.pending || 0}</div>
              <div className="text-sm text-muted-foreground">Plantes en attente</div>
            </CardContent>
          </Card>
        </div>

        {/* Sélecteur de type + contrôles batch */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={entityType === "molecules" ? "default" : "outline"}
              onClick={() => { setEntityType("molecules"); setPage(1); setBatchResults(null); }}
              className="gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              Molécules
            </Button>
            <Button
              variant={entityType === "plants" ? "default" : "outline"}
              onClick={() => { setEntityType("plants"); setPage(1); setBatchResults(null); }}
              className="gap-2"
            >
              <Leaf className="w-4 h-4" />
              Plantes
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Input
              type="number"
              value={batchLimit}
              onChange={(e) => setBatchLimit(parseInt(e.target.value) || 50)}
              className="w-20"
              min={1}
              max={200}
            />
            <Button
              variant="outline"
              onClick={() => handleBatch(true)}
              disabled={batchRunning}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Aperçu
            </Button>
            <Button
              onClick={() => handleBatch(false)}
              disabled={batchRunning}
              className="gap-2"
            >
              {batchRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {batchRunning ? "Enrichissement..." : `Enrichir ${batchLimit}`}
            </Button>
          </div>
        </div>

        {/* Résultats du batch */}
        {batchResults && (
          <Card className="mb-6 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {batchResults.dryRun ? "Aperçu batch" : "Résultats batch"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {batchResults.dryRun ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {batchResults.count} entités à enrichir. Aperçu des 10 premières :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {batchResults.preview?.map((item: any) => (
                      <Badge key={item.id} variant="outline">{item.name}</Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-400">✓ {batchResults.enriched} enrichies</span>
                    <span className="text-red-400">✗ {batchResults.failed} non trouvées</span>
                    <span className="text-amber-400">⊘ {batchResults.skipped} doublons</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {batchResults.results?.filter((r: any) => r.status === 'enriched').slice(0, 20).map((r: any) => (
                      <div key={r.id} className="text-xs flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                        <span className="font-medium">{r.name}</span>
                        <a
                          href={`https://www.wikidata.org/entity/${r.qid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {r.qid}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recherche Wikidata manuelle */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="w-4 h-4" />
              Recherche Wikidata manuelle
            </CardTitle>
            <CardDescription>
              Recherchez un QID Wikidata pour l'assigner manuellement à une entité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nom de la molécule ou plante..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="gap-2">
                <Search className="w-4 h-4" />
                Chercher
              </Button>
            </div>
            {searchResult && searchResult.length > 0 && (
              <div className="space-y-2">
                {searchResult.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded border border-border">
                    <div>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground ml-2">— {item.description}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">{item.id}</Badge>
                      <a
                        href={`https://www.wikidata.org/entity/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setManualQid(item.id)}
                        className="text-xs"
                      >
                        Utiliser
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {searchResult && searchResult.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun résultat trouvé</p>
            )}
          </CardContent>
        </Card>

        {/* Filtres et liste */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex gap-1">
            {(['all', 'enriched', 'pending'] as FilterMode[]).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filterMode === f ? "default" : "outline"}
                onClick={() => { setFilterMode(f); setPage(1); }}
                className="text-xs"
              >
                {f === 'all' ? 'Tout' : f === 'enriched' ? 'Enrichies' : 'En attente'}
              </Button>
            ))}
          </div>
          <Input
            placeholder="Filtrer par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 text-sm"
          />
          <span className="text-sm text-muted-foreground self-center ml-auto">
            {currentData?.total || 0} entrées
          </span>
        </div>

        {/* Tableau */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Nom</th>
                    <th className="text-left p-3 font-medium">QID Wikidata</th>
                    {entityType === "molecules" && (
                      <th className="text-left p-3 font-medium">LOTUS ID</th>
                    )}
                    {entityType === "plants" && (
                      <th className="text-left p-3 font-medium">GBIF</th>
                    )}
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                        Chargement...
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Aucune entrée
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item: any) => {
                      const id = item.id;
                      const name = item.name || item.latin_name;
                      const qid = item.wikidata_qid;
                      const isSelected = selectedId === id;

                      return (
                        <tr key={id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="p-3 text-muted-foreground text-xs">{id}</td>
                          <td className="p-3 font-medium">{name}</td>
                          <td className="p-3">
                            {qid ? (
                              <div className="flex items-center gap-2">
                                <Badge className="font-mono text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                                  {qid}
                                </Badge>
                                <a
                                  href={`https://www.wikidata.org/entity/${qid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          {entityType === "molecules" && (
                            <td className="p-3 text-xs text-muted-foreground">
                              {item.coconut_id || "—"}
                            </td>
                          )}
                          {entityType === "plants" && (
                            <td className="p-3 text-xs text-muted-foreground">
                              {item.gbif_id ? (
                                <a
                                  href={`https://www.gbif.org/species/${item.gbif_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-400 hover:underline"
                                >
                                  {item.gbif_id}
                                </a>
                              ) : "—"}
                            </td>
                          )}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {isSelected ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    placeholder="Q123456"
                                    value={manualQid}
                                    onChange={(e) => setManualQid(e.target.value)}
                                    className="w-24 h-7 text-xs"
                                  />
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={() => handleAssignQid(id, manualQid)}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-2"
                                    onClick={() => { setSelectedId(null); setManualQid(""); }}
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-2"
                                    onClick={() => {
                                      setSelectedId(id);
                                      setManualQid(qid || "");
                                    }}
                                  >
                                    <Tag className="w-3 h-3" />
                                  </Button>
                                  {qid && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs px-2 text-red-400 hover:text-red-300"
                                      onClick={() => handleClearQid(id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {currentData && currentData.total > 30 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} / {Math.ceil(currentData.total / 30)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(currentData.total / 30)}
                  className="gap-2"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info NOSE */}
        <Card className="mt-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              À propos des QIDs Wikidata (NOSE Phase 4)
            </h3>
            <p className="text-xs text-muted-foreground">
              Les identifiants Wikidata (QIDs) permettent d'aligner les données PERFUMUM avec le 
              graphe de connaissance mondial. Cette intégration est requise pour l'interopérabilité 
              avec le projet Odeuropa et la plateforme Europeana. Chaque molécule ou plante enrichie 
              peut être exportée en JSON-LD conforme à l'ontologie NOSE (Olfactory Storytelling Ontology).
            </p>
            <div className="mt-2 flex gap-4 text-xs">
              <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Wikidata
              </a>
              <a href="https://odeuropa.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Odeuropa
              </a>
              <a href="https://www.europeana.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Europeana
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
