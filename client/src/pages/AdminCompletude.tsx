import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  BarChart3, Package, Leaf, MapPin, TrendingUp, AlertCircle,
  CheckCircle2, Circle, Search, ArrowUpDown, ChevronLeft, ChevronRight,
  RefreshCw, ExternalLink, Atom, Sparkles
} from "lucide-react";

type TabType = "overview" | "rawMaterials" | "plants" | "terroirs";
type SortType = "score_asc" | "score_desc" | "name";

function ScoreBadge({ score }: { score: number }) {
  if (score >= 66) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        {score}%
      </span>
    );
  }
  if (score >= 33) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
        <Circle className="h-3 w-3" />
        {score}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
      <AlertCircle className="h-3 w-3" />
      {score}%
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 66 ? "bg-emerald-500" : score >= 33 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full bg-muted rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${score}%` }} />
    </div>
  );
}

function DistributionBar({ distribution, total }: { distribution: { rouge: number; orange: number; vert: number }; total: number }) {
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        <div className="bg-red-400 dark:bg-red-600 transition-all" style={{ width: `${pct(distribution.rouge)}%` }} title={`Rouge: ${distribution.rouge}`} />
        <div className="bg-amber-400 dark:bg-amber-600 transition-all" style={{ width: `${pct(distribution.orange)}%` }} title={`Orange: ${distribution.orange}`} />
        <div className="bg-emerald-400 dark:bg-emerald-600 transition-all" style={{ width: `${pct(distribution.vert)}%` }} title={`Vert: ${distribution.vert}`} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-red-600 dark:text-red-400">● {distribution.rouge} incomplets</span>
        <span className="text-amber-600 dark:text-amber-400">● {distribution.orange} partiels</span>
        <span className="text-emerald-600 dark:text-emerald-400">● {distribution.vert} complets</span>
      </div>
    </div>
  );
}

export default function AdminCompletude() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("score_asc");
  const [page, setPage] = useState(0);
  const [filterScore, setFilterScore] = useState<"all" | "rouge" | "orange" | "vert">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const LIMIT = 50;

  // Score filter → min/max
  const scoreFilter = useMemo(() => {
    if (filterScore === "rouge") return { minScore: 0, maxScore: 32 };
    if (filterScore === "orange") return { minScore: 33, maxScore: 65 };
    if (filterScore === "vert") return { minScore: 66, maxScore: 100 };
    return {};
  }, [filterScore]);

  const { data: globalStats, isLoading: isLoadingGlobal, refetch: refetchGlobal } = trpc.completude.globalStats?.useQuery(
    undefined,
    { enabled: !!user && user.role === 'admin' }
  );

  const { data: rmData, isLoading: isLoadingRm } = trpc.completude.rawMaterials.useQuery(
    {
      limit: LIMIT,
      offset: page * LIMIT,
      sortBy,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      ...scoreFilter,
    },
    { enabled: activeTab === "rawMaterials" && !!user && user.role === 'admin' }
  );

  const { data: plantsData, isLoading: isLoadingPlants } = trpc.completude.plants.useQuery(
    {
      limit: LIMIT,
      offset: page * LIMIT,
      sortBy,
      ...scoreFilter,
    },
    { enabled: activeTab === "plants" && !!user && user.role === 'admin' }
  );

  const [, navigate] = useLocation();
  const molStats = trpc.molecules.getBatchEnrichStats.useQuery(undefined, { enabled: !!user && user.role === 'admin' });

  const { data: terroirsData, isLoading: isLoadingTerroirs } = trpc.completude.terroirs.useQuery(
    {
      limit: LIMIT,
      offset: page * LIMIT,
      sortBy,
      ...scoreFilter,
    },
    { enabled: activeTab === "terroirs" && !!user && user.role === 'admin' }
  );

  // Filtrage local par recherche
  const filteredRm = useMemo(() => {
    if (!rmData?.items) return [];
    if (!search) return rmData?.items;
    return rmData?.items.filter((m: any) => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [rmData?.items, search]);

  const filteredPlants = useMemo(() => {
    if (!plantsData?.items) return [];
    if (!search) return plantsData?.items;
    return plantsData?.items.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [plantsData?.items, search]);

  const filteredTerroirs = useMemo(() => {
    if (!terroirsData?.items) return [];
    if (!search) return terroirsData?.items;
    return terroirsData?.items.filter((t: any) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [terroirsData?.items, search]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
          <p className="text-muted-foreground">Cette page est réservée aux administrateurs.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Vue d'ensemble", icon: BarChart3 },
    { id: "rawMaterials" as TabType, label: "Matières Premières", icon: Package },
    { id: "plants" as TabType, label: "Plantes", icon: Leaf },
    { id: "terroirs" as TabType, label: "Terroirs", icon: MapPin },
  ];

  const CATEGORIES = [
    { value: "all", label: "Toutes catégories" },
    { value: "huile_essentielle", label: "Huiles essentielles" },
    { value: "absolu", label: "Absolues" },
    { value: "resinoid", label: "Résinoïdes" },
    { value: "accord_olfactif", label: "Accords olfactifs" },
    { value: "molecule_isolee", label: "Molécules isolées" },
    { value: "co2", label: "CO₂" },
    { value: "infusion", label: "Infusions" },
    { value: "matiere_animale", label: "Matières animales" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Tableau de Bord de Complétude
            </h1>
            <p className="text-muted-foreground mt-1">
              Suivi de l'enrichissement des données — matières premières, plantes et terroirs
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchGlobal()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setPage(0); setSearch(""); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Vue d'ensemble */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {isLoadingGlobal ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 h-40 bg-muted/30 rounded-lg" />
                  </Card>
                ))}
              </div>
            ) : globalStats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Matières premières */}
                  <Card className="border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-600" />
                        Matières Premières
                        <Badge variant="secondary">{globalStats?.rawMaterials.total}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec plante liée</span>
                          <span className="font-semibold">{globalStats?.rawMaterials.withPlant} / {globalStats?.rawMaterials.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.rawMaterials.withPlant / globalStats?.rawMaterials.total * 100)}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec terroir lié</span>
                          <span className="font-semibold">{globalStats?.rawMaterials.withTerroir} / {globalStats?.rawMaterials.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.rawMaterials.withTerroir / globalStats?.rawMaterials.total * 100)}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec famille olfactive</span>
                          <span className="font-semibold">{globalStats?.rawMaterials.withOlfFamily} / {globalStats?.rawMaterials.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-amber-300 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.rawMaterials.withOlfFamily / globalStats?.rawMaterials.total * 100)}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec origine pays</span>
                          <span className="font-semibold">{globalStats?.rawMaterials.withOrigin} / {globalStats?.rawMaterials.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-amber-200 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.rawMaterials.withOrigin / globalStats?.rawMaterials.total * 100)}%` }} />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setActiveTab("rawMaterials")}>
                        Voir le détail →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Plantes */}
                  <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                        Plantes
                        <Badge variant="secondary">{globalStats?.plants.total}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec nom latin</span>
                          <span className="font-semibold">{globalStats?.plants.withLatin} / {globalStats?.plants.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.plants.withLatin / globalStats?.plants.total * 100)}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec description</span>
                          <span className="font-semibold">{globalStats?.plants.withDescription} / {globalStats?.plants.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.plants.withDescription / globalStats?.plants.total * 100)}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec image</span>
                          <span className="font-semibold">{globalStats?.plants.withImage} / {globalStats?.plants.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-emerald-300 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.plants.withImage / globalStats?.plants.total * 100)}%` }} />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setActiveTab("plants")}>
                        Voir le détail →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Terroirs */}
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Terroirs
                        <Badge variant="secondary">{globalStats?.terroirs.total}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec description</span>
                          <span className="font-semibold">{globalStats?.terroirs.withDescription} / {globalStats?.terroirs.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.terroirs.withDescription / globalStats?.terroirs.total * 100)}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avec coordonnées GPS</span>
                          <span className="font-semibold">{globalStats?.terroirs.withCoords} / {globalStats?.terroirs.total}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${Math.round(globalStats?.terroirs.withCoords / globalStats?.terroirs.total * 100)}%` }} />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setActiveTab("terroirs")}>
                        Voir le détail →
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Molécules */}
                  <Card className="border-violet-200 dark:border-violet-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Atom className="h-5 w-5 text-violet-600" />
                        Molécules
                        <Badge variant="secondary">{molStats.data?.total ?? '…'}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {molStats.data ? (
                        <>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sans profil olfactif</span>
                              <Badge variant="outline" className="text-orange-600">{molStats.data.missingOlfactive}</Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${Math.round((molStats.data.total - molStats.data.missingOlfactive) / molStats.data.total * 100)}%` }} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sans propriétés thérap.</span>
                              <Badge variant="outline" className="text-red-600">{molStats.data.missingTherapeutic}</Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className="bg-violet-400 h-1.5 rounded-full" style={{ width: `${Math.round((molStats.data.total - molStats.data.missingTherapeutic) / molStats.data.total * 100)}%` }} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sans IUPAC</span>
                              <Badge variant="outline" className="text-amber-600">{molStats.data.missingIupac}</Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className="bg-violet-300 h-1.5 rounded-full" style={{ width: `${Math.round((molStats.data.total - molStats.data.missingIupac) / molStats.data.total * 100)}%` }} />
                            </div>
                          </div>
                        </>
                      ) : <div className="text-sm text-muted-foreground">Chargement…</div>}
                      <Button variant="outline" size="sm" className="w-full mt-2 gap-2" onClick={() => navigate('/admin/ai-batch-enrich-molecules')}>
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Enrichir les lacunes →
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Résumé global */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Priorités d'enrichissement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                        <p className="font-semibold text-red-700 dark:text-red-400 mb-1">🔴 Priorité haute</p>
                        <p className="text-muted-foreground">
                          {globalStats?.rawMaterials.total - globalStats?.rawMaterials.withPlant} matières sans plante liée
                        </p>
                        <p className="text-muted-foreground">
                          {globalStats?.plants.total - globalStats?.plants.withImage} plantes sans image
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                        <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">🟡 Priorité moyenne</p>
                        <p className="text-muted-foreground">
                          {globalStats?.rawMaterials.total - globalStats?.rawMaterials.withOlfFamily} matières sans famille olfactive
                        </p>
                        <p className="text-muted-foreground">
                          {globalStats?.terroirs.total - globalStats?.terroirs.withCoords} terroirs sans GPS
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">🟢 Bonne couverture</p>
                        <p className="text-muted-foreground">
                          {globalStats?.plants.withLatin}/{globalStats?.plants.total} plantes avec nom latin ({Math.round(globalStats?.plants.withLatin / globalStats?.plants.total * 100)}%)
                        </p>
                        <p className="text-muted-foreground">
                          {globalStats?.rawMaterials.withBoth} matières avec plante + terroir
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        )}

        {/* Onglets détaillés */}
        {(activeTab === "rawMaterials" || activeTab === "plants" || activeTab === "terroirs") && (
          <div className="space-y-4">
            {/* Barre de filtres */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sortBy} onValueChange={v => { setSortBy(v as SortType); setPage(0); }}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score_asc">Score croissant</SelectItem>
                  <SelectItem value="score_desc">Score décroissant</SelectItem>
                  <SelectItem value="name">Nom A→Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                {(["all", "rouge", "orange", "vert"] as const).map(f => (
                  <Button
                    key={f}
                    variant={filterScore === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setFilterScore(f); setPage(0); }}
                    className={`text-xs ${
                      f === "rouge" && filterScore !== f ? "border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" :
                      f === "orange" && filterScore !== f ? "border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20" :
                      f === "vert" && filterScore !== f ? "border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20" : ""
                    }`}
                  >
                    {f === "all" ? "Tous" : f === "rouge" ? "🔴 <33%" : f === "orange" ? "🟡 33-65%" : "🟢 ≥66%"}
                  </Button>
                ))}
              </div>
              {activeTab === "rawMaterials" && (
                <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(0); }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Stats de distribution */}
            {activeTab === "rawMaterials" && rmData && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Distribution des scores — {rmData?.total} entrées · Score moyen : {rmData?.avgScore}%</span>
                </div>
                <DistributionBar distribution={rmData?.distribution as { rouge: number; orange: number; vert: number }} total={rmData?.total} />
              </Card>
            )}
            {activeTab === "plants" && plantsData && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Distribution des scores — {plantsData?.total} entrées · Score moyen : {plantsData?.avgScore}%</span>
                </div>
                <DistributionBar distribution={plantsData?.distribution as { rouge: number; orange: number; vert: number }} total={plantsData?.total} />
              </Card>
            )}
            {activeTab === "terroirs" && terroirsData && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Distribution des scores — {terroirsData?.total} entrées · Score moyen : {terroirsData?.avgScore}%</span>
                </div>
                <DistributionBar distribution={terroirsData?.distribution as { rouge: number; orange: number; vert: number }} total={terroirsData?.total} />
              </Card>
            )}

            {/* Tableau */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nom</th>
                        {activeTab === "rawMaterials" && (
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Catégorie</th>
                        )}
                        {activeTab === "plants" && (
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Nom latin</th>
                        )}
                        {activeTab === "terroirs" && (
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Pays</th>
                        )}
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground w-32">Score</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Champs manquants</th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === "rawMaterials" && (isLoadingRm ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="border-b animate-pulse">
                            <td className="px-4 py-3"><div className="h-4 bg-muted rounded w-32" /></td>
                            <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-muted rounded w-20" /></td>
                            <td className="px-4 py-3"><div className="h-4 bg-muted rounded w-16" /></td>
                            <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-muted rounded w-40" /></td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        ))
                      ) : filteredRm.map((m: any) => (
                        <tr key={m.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{m.name}</td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {m.category && (
                              <Badge variant="outline" className="text-xs">{m.category.replace(/_/g, ' ')}</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <ScoreBadge score={m.score} />
                              <ScoreBar score={m.score} />
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {m.missing?.slice(0, 4).map((field: string) => (
                                <Badge key={field} variant="outline" className="text-xs text-muted-foreground border-dashed">
                                  {field}
                                </Badge>
                              ))}
                              {m.missing?.length > 4 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">
                                  +{m.missing.length - 4}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/matieres-premieres/${m.id}`}>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      )))}

                      {activeTab === "plants" && (isLoadingPlants ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="border-b animate-pulse">
                            <td className="px-4 py-3"><div className="h-4 bg-muted rounded w-32" /></td>
                            <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-muted rounded w-28" /></td>
                            <td className="px-4 py-3"><div className="h-4 bg-muted rounded w-16" /></td>
                            <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-muted rounded w-40" /></td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        ))
                      ) : filteredPlants.map((p: any) => (
                        <tr key={p.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground italic text-xs">{p.latinName || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <ScoreBadge score={p.score} />
                              <ScoreBar score={p.score} />
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {p.missing?.slice(0, 4).map((field: string) => (
                                <Badge key={field} variant="outline" className="text-xs text-muted-foreground border-dashed">
                                  {field}
                                </Badge>
                              ))}
                              {p.missing?.length > 4 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">
                                  +{p.missing.length - 4}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/plant/${p.id}`}>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      )))}

                      {activeTab === "terroirs" && (isLoadingTerroirs ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="border-b animate-pulse">
                            <td className="px-4 py-3"><div className="h-4 bg-muted rounded w-32" /></td>
                            <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-muted rounded w-20" /></td>
                            <td className="px-4 py-3"><div className="h-4 bg-muted rounded w-16" /></td>
                            <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-muted rounded w-40" /></td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        ))
                      ) : filteredTerroirs.map((t: any) => (
                        <tr key={t.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{t.name}</td>
                          <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{t.country || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <ScoreBadge score={t.score} />
                              <ScoreBar score={t.score} />
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {t.missing?.slice(0, 4).map((field: string) => (
                                <Badge key={field} variant="outline" className="text-xs text-muted-foreground border-dashed">
                                  {field}
                                </Badge>
                              ))}
                              {t.missing?.length > 4 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">
                                  +{t.missing.length - 4}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/terroir/${t.id}`}>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {((activeTab === "rawMaterials" && rmData && rmData?.total > LIMIT) ||
                  (activeTab === "plants" && plantsData && plantsData?.total > LIMIT) ||
                  (activeTab === "terroirs" && terroirsData && terroirsData?.total > LIMIT)) && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <span className="text-sm text-muted-foreground">
                      Page {page + 1} · {LIMIT} par page
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={
                          (activeTab === "rawMaterials" && rmData ? (page + 1) * LIMIT >= rmData?.total : true) ||
                          (activeTab === "plants" && plantsData ? (page + 1) * LIMIT >= plantsData?.total : true) ||
                          (activeTab === "terroirs" && terroirsData ? (page + 1) * LIMIT >= terroirsData?.total : true)
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
