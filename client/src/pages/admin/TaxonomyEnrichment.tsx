/**
 * TaxonomyEnrichment.tsx — Rapport 16
 * Page admin : enrichissement taxonomique en masse (family/genus) des plantes sans famille
 * Sources : Wikidata (QID direct + recherche par nom) + GBIF
 */
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Leaf,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Database,
  Globe,
  Play,
  Check,
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaxonomyCandidate {
  family: string;
  genus: string;
  order?: string;
  phylum?: string;
  kingdom?: string;
  source: "wikidata_qid" | "wikidata_name" | "gbif" | "manual";
  confidence: number;
  sourceLabel?: string;
  sourceUrl?: string;
}

interface BatchResult {
  plantId: number;
  plantName: string;
  latinName: string | null;
  wikidataQid: string | null;
  candidate: TaxonomyCandidate | null;
  autoApply: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function confidenceBadge(score: number) {
  if (score >= 85) return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-xs">{score}% — Élevée</Badge>;
  if (score >= 65) return <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs">{score}% — Moyenne</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">{score}% — Faible</Badge>;
}

function sourceIcon(source: string) {
  if (source === "wikidata_qid" || source === "wikidata_name") return <Globe className="h-3.5 w-3.5 text-blue-500" />;
  if (source === "gbif") return <Database className="h-3.5 w-3.5 text-green-600" />;
  return <Leaf className="h-3.5 w-3.5 text-gray-400" />;
}

function sourceLabel(source: string) {
  if (source === "wikidata_qid") return "Wikidata (QID)";
  if (source === "wikidata_name") return "Wikidata (nom)";
  if (source === "gbif") return "GBIF";
  return "Manuel";
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function TaxonomyEnrichment() {
  const { toast } = useToast();

  // ── État liste ──
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // ── État enrichissement individuel ──
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);

  // ── État batch ──
  const [batchOffset, setBatchOffset] = useState(0);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [selectedForApply, setSelectedForApply] = useState<Set<number>>(new Set());
  const [minConfidence, setMinConfidence] = useState(70);

  // ── Queries ──
  const statsQuery = trpc.taxonomyEnrichment.getTaxonomyCoverageStats.useQuery(undefined, {
    staleTime: 30_000,
  });

  const plantsQuery = trpc.taxonomyEnrichment.getPlantsWithoutFamily.useQuery(
    { page, pageSize: 20, search: search || undefined },
    { staleTime: 10_000 }
  );

  const enrichQuery = trpc.taxonomyEnrichment.enrichPlantTaxonomy.useQuery(
    { plantId: selectedPlantId! },
    { enabled: selectedPlantId !== null, staleTime: 60_000 }
  );

  const batchQuery = trpc.taxonomyEnrichment.runBatchEnrichment.useQuery(
    { limit: 10, offset: batchOffset, minConfidence },
    { enabled: batchRunning, staleTime: 0 }
  );

  const applyMutation = trpc.taxonomyEnrichment.applyTaxonomy.useMutation({
    onSuccess: (data) => {
      toast({ title: "Famille appliquée", description: `${data.plantName} → ${data.family}` });
      plantsQuery.refetch();
      statsQuery.refetch();
      setSelectedPlantId(null);
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const applyBatchMutation = trpc.taxonomyEnrichment.applyBatchTaxonomy.useMutation({
    onSuccess: (data) => {
      toast({ title: `${data.applied} famille(s) appliquée(s)`, description: `${data.errors.length} erreur(s)` });
      plantsQuery.refetch();
      statsQuery.refetch();
      setBatchResults([]);
      setSelectedForApply(new Set());
      setBatchRunning(false);
    },
    onError: (e) => toast({ title: "Erreur batch", description: e.message, variant: "destructive" }),
  });

  // ── Effets batch ──
  React.useEffect(() => {
    if (batchRunning && batchQuery.data) {
      setBatchResults(batchQuery.data.results);
      // Pré-sélectionner les candidats avec autoApply
      const autoIds = new Set(
        batchQuery.data.results
          .filter((r) => r.autoApply && r.candidate?.family)
          .map((r) => r.plantId)
      );
      setSelectedForApply(autoIds);
    }
  }, [batchRunning, batchQuery.data]);

  // ── Handlers ──
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleApplyBatch = () => {
    const applications = batchResults
      .filter((r) => selectedForApply.has(r.plantId) && r.candidate?.family)
      .map((r) => ({ plantId: r.plantId, family: r.candidate!.family }));
    if (!applications.length) {
      toast({ title: "Aucune sélection", description: "Sélectionnez au moins une plante à enrichir." });
      return;
    }
    applyBatchMutation.mutate({ applications });
  };

  const toggleSelect = (id: number) => {
    setSelectedForApply((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4 inline" /> Admin
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Enrichissement Taxonomique</span>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-emerald-600" />
            <div>
              <h1 className="text-xl font-bold">Enrichissement Taxonomique — Rapport 16</h1>
              <p className="text-sm text-muted-foreground">
                Compléter la famille botanique des plantes via Wikidata et GBIF
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Stats de couverture */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Plantes totales</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.withFamily.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Avec famille</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.withoutFamily.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Sans famille</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.withQidNoFamily.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-0.5">QID disponible</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.coveragePercent}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Couverture</div>
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {stats && (
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Couverture famille botanique</span>
              <span className="text-sm text-muted-foreground">{stats.withFamily}/{stats.total}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all"
                style={{ width: `${stats.coveragePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Section Batch automatique */}
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold">Enrichissement automatique par lot</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Confiance minimale :</label>
              <select
                className="border rounded px-2 py-1 text-sm bg-background"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
              >
                <option value={50}>50% (large)</option>
                <option value={70}>70% (recommandé)</option>
                <option value={85}>85% (strict)</option>
                <option value={90}>90% (très strict)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Offset :</label>
              <Input
                type="number"
                min={0}
                value={batchOffset}
                onChange={(e) => setBatchOffset(Number(e.target.value))}
                className="w-20 h-8 text-sm"
              />
            </div>
            <Button
              size="sm"
              onClick={() => { setBatchRunning(true); setBatchResults([]); }}
              disabled={batchQuery.isFetching}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              {batchQuery.isFetching ? "Analyse en cours…" : "Lancer le batch (10 plantes)"}
            </Button>
            {batchResults.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setBatchOffset((o) => o + 10); setBatchRunning(true); setBatchResults([]); }}
                disabled={batchQuery.isFetching}
                className="gap-1.5"
              >
                Lot suivant →
              </Button>
            )}
          </div>

          {/* Résultats du batch */}
          {batchResults.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {batchResults.filter((r) => r.candidate).length}/{batchResults.length} candidats trouvés
                  — {selectedForApply.size} sélectionné(s)
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const allIds = new Set(batchResults.filter((r) => r.candidate?.family).map((r) => r.plantId));
                      setSelectedForApply(allIds);
                    }}
                  >
                    Tout sélectionner
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyBatch}
                    disabled={selectedForApply.size === 0 || applyBatchMutation.isPending}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Appliquer ({selectedForApply.size})
                  </Button>
                </div>
              </div>

              {batchResults.map((r) => (
                <div
                  key={r.plantId}
                  className={`border rounded-lg p-3 flex items-start gap-3 transition-colors ${
                    selectedForApply.has(r.plantId) ? "border-emerald-400 bg-emerald-50/30" : "bg-muted/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedForApply.has(r.plantId)}
                    onChange={() => toggleSelect(r.plantId)}
                    disabled={!r.candidate?.family}
                    className="mt-0.5 h-4 w-4 accent-emerald-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{r.plantName}</span>
                      {r.latinName && (
                        <span className="text-xs text-muted-foreground italic">{r.latinName}</span>
                      )}
                      {r.wikidataQid && (
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                          {r.wikidataQid}
                        </Badge>
                      )}
                    </div>
                    {r.candidate ? (
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          {sourceIcon(r.candidate.source)}
                          <span className="text-xs text-muted-foreground">{sourceLabel(r.candidate.source)}</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-700">
                          Famille : {r.candidate.family}
                        </span>
                        {r.candidate.genus && (
                          <span className="text-xs text-muted-foreground">Genre : {r.candidate.genus}</span>
                        )}
                        {confidenceBadge(r.candidate.confidence)}
                        {r.candidate.sourceUrl && (
                          <a
                            href={r.candidate.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Vérifier ↗
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        Aucun candidat trouvé
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section liste + enrichissement individuel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Liste des plantes sans family */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Plantes sans famille</h2>
              {plantsQuery.data && (
                <Badge variant="secondary" className="ml-auto">{plantsQuery.data.total}</Badge>
              )}
            </div>

            {/* Recherche */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nom ou nom latin…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleSearch} className="gap-1">
                <Search className="h-3.5 w-3.5" />
              </Button>
              {search && (
                <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}>
                  ✕
                </Button>
              )}
            </div>

            {/* Liste */}
            {plantsQuery.isLoading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Chargement…
              </div>
            ) : plantsQuery.data?.plants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <span className="text-sm">Toutes les plantes ont une famille !</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {plantsQuery.data?.plants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors text-sm ${
                      selectedPlantId === plant.id
                        ? "border-indigo-400 bg-indigo-50/30"
                        : "border-transparent hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className="font-medium truncate">{plant.name}</div>
                    {plant.latinName && (
                      <div className="text-xs text-muted-foreground italic truncate">{plant.latinName}</div>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {plant.wikidataQid && (
                        <Badge variant="outline" className="text-xs text-blue-500 border-blue-200 py-0">
                          {plant.wikidataQid}
                        </Badge>
                      )}
                      {plant.gbifId && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200 py-0">
                          GBIF:{plant.gbifId}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Pagination */}
            {plantsQuery.data && plantsQuery.data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Préc.
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page}/{plantsQuery.data.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(plantsQuery.data!.totalPages, p + 1))}
                  disabled={page >= plantsQuery.data.totalPages}
                  className="gap-1"
                >
                  Suiv. <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Panneau d'enrichissement individuel */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Enrichissement individuel</h2>
            </div>

            {!selectedPlantId ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
                <Leaf className="h-8 w-8 opacity-30" />
                <span className="text-sm">Sélectionnez une plante dans la liste</span>
              </div>
            ) : enrichQuery.isLoading ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Recherche en cours…
              </div>
            ) : enrichQuery.error ? (
              <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                <XCircle className="h-4 w-4" />
                {enrichQuery.error.message}
              </div>
            ) : enrichQuery.data ? (
              <div className="space-y-4">
                {/* Infos plante */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-semibold">{enrichQuery.data.plant.name}</div>
                  {enrichQuery.data.plant.latinName && (
                    <div className="text-sm italic text-muted-foreground">{enrichQuery.data.plant.latinName}</div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {enrichQuery.data.plant.wikidataQid && (
                      <a
                        href={`https://www.wikidata.org/wiki/${enrichQuery.data.plant.wikidataQid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Wikidata: {enrichQuery.data.plant.wikidataQid} ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Candidats */}
                {enrichQuery.data.candidates.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-amber-50/30 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    Aucun candidat trouvé. Vérifiez le nom latin ou le QID Wikidata.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      {enrichQuery.data.candidates.length} candidat(s) trouvé(s) :
                    </div>
                    {enrichQuery.data.candidates.map((c, i) => (
                      <div key={i} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            {sourceIcon(c.source)}
                            <span className="text-xs text-muted-foreground">{sourceLabel(c.source)}</span>
                          </div>
                          {confidenceBadge(c.confidence)}
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground">Famille</span>
                            <div className="font-semibold text-emerald-700">{c.family || "—"}</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Genre</span>
                            <div className="font-medium">{c.genus || "—"}</div>
                          </div>
                          {c.order && (
                            <div>
                              <span className="text-xs text-muted-foreground">Ordre</span>
                              <div className="text-sm">{c.order}</div>
                            </div>
                          )}
                          {c.phylum && (
                            <div>
                              <span className="text-xs text-muted-foreground">Phylum</span>
                              <div className="text-sm">{c.phylum}</div>
                            </div>
                          )}
                        </div>

                        {c.sourceUrl && (
                          <a
                            href={c.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline block"
                          >
                            Vérifier la source ↗
                          </a>
                        )}

                        {c.family && (
                          <Button
                            size="sm"
                            className="w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() =>
                              applyMutation.mutate({
                                plantId: selectedPlantId,
                                family: c.family,
                                genus: c.genus || undefined,
                                order: c.order,
                                phylum: c.phylum,
                              })
                            }
                            disabled={applyMutation.isPending}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Appliquer cette famille
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-1.5"
                  onClick={() => enrichQuery.refetch()}
                  disabled={enrichQuery.isFetching}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${enrichQuery.isFetching ? "animate-spin" : ""}`} />
                  Relancer la recherche
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Note méthodologique */}
        <div className="bg-muted/30 border rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Stratégies d'enrichissement (par ordre de priorité)</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li><strong>Wikidata QID direct</strong> — si la plante possède déjà un QID Wikidata (confiance ≥ 90%)</li>
            <li><strong>Wikidata via latin_name QID</strong> — si le champ latin_name contient un QID brut (ex: Q133669051)</li>
            <li><strong>GBIF (nom latin complet)</strong> — si le nom latin est un binôme valide (Genre espèce)</li>
            <li><strong>GBIF (genre seul)</strong> — si seul le genre est extractible (confiance réduite)</li>
            <li><strong>Wikidata (recherche par nom)</strong> — fallback par nom vernaculaire ou genre</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
