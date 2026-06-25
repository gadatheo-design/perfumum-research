import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { EnrichTab } from "./EnrichTab";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Leaf,
  Dna,
  Globe,
  TreeDeciduous,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

type FilterType = "all" | "missing_gbif" | "missing_powo" | "missing_ncbi" | "missing_wikidata" | "missing_itis" | "incomplete" | "complete";

const API_CONFIG = [
  { key: "gbif", label: "GBIF", color: "emerald", icon: <Leaf className="h-3.5 w-3.5" />, url: (id: string) => `https://www.gbif.org/species/${id}` },
  { key: "powo", label: "POWO", color: "green", icon: <TreeDeciduous className="h-3.5 w-3.5" />, url: (id: string) => `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${id}` },
  { key: "ncbi", label: "NCBI", color: "blue", icon: <Dna className="h-3.5 w-3.5" />, url: (id: string) => `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${id}` },
  { key: "wikidata", label: "Wikidata", color: "purple", icon: <Globe className="h-3.5 w-3.5" />, url: (id: string) => `https://www.wikidata.org/entity/${id}` },
  { key: "itis", label: "ITIS", color: "orange", icon: <BookOpen className="h-3.5 w-3.5" />, url: (id: string) => `https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=${id}` },
];

const COLOR_MAP: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  green: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
};

function ScoreBadge({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  if (pct === 100) return <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 text-xs">{score}/{max}</Badge>;
  if (pct >= 60) return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 text-xs">{score}/{max}</Badge>;
  return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700 text-xs">{score}/{max}</Badge>;
}

export default function ApiCoverage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [genus, setGenus] = useState("");
  const [genusInput, setGenusInput] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState<"plants" | "genres">("plants");

  const { data, isLoading, refetch } = trpc.apiCoverage.getGlobalCoverage.useQuery({
    filter,
    genus: genus || undefined,
    category: category || undefined,
    limit: 200,
    offset: 0,
  });

  const { data: genreData, isLoading: isLoadingGenres } = trpc.apiCoverage.getGenraCoverage.useQuery(undefined, {
    enabled: activeTab === "genres",
  });

  const stats = data?.stats;

  const handleGenusSearch = () => {
    setGenus(genusInput.trim());
  };

  const handleClearFilters = () => {
    setFilter("all");
    setGenus("");
    setGenusInput("");
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Couverture des APIs
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Dashboard de complétude des identifiants croisés pour chaque plante
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Stats globales */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="col-span-2 sm:col-span-3 lg:col-span-1">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total plantes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Score moyen: {stats.avgScore}/5</p>
              </CardContent>
            </Card>
            {[
              { label: "GBIF", count: stats.withGbif, color: "emerald" },
              { label: "POWO", count: stats.withPowo, color: "green" },
              { label: "NCBI", count: stats.withNcbi, color: "blue" },
              { label: "Wikidata", count: stats.withWikidata, color: "purple" },
              { label: "ITIS", count: stats.withItis, color: "orange" },
            ].map(({ label, count, color }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                  <div className="mt-2">
                    <Progress value={stats.total > 0 ? (count / stats.total) * 100 : 0} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Résumé complétude */}
        {stats && (
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-emerald-700 dark:text-emerald-400">{stats.fullyEnriched}</span>
              <span className="text-emerald-600 dark:text-emerald-500">plantes complètes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-700 dark:text-amber-400">{stats.incomplete}</span>
              <span className="text-amber-600 dark:text-amber-500">plantes incomplètes</span>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 border-b border-border">
          {[
            { key: "plants", label: "Par plante", icon: <Leaf className="h-4 w-4" /> },
            { key: "genres", label: "Par genre", icon: <BarChart3 className="h-4 w-4" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Onglet Par plante */}
        {activeTab === "plants" && (
          <div className="space-y-4">
            {/* Filtres */}
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex gap-2">
                <Input
                  placeholder="Filtrer par genre (ex: Nicotiana)"
                  value={genusInput}
                  onChange={(e) => setGenusInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenusSearch()}
                  className="w-52 h-9 text-sm"
                />
                <Button size="sm" variant="outline" onClick={handleGenusSearch} className="gap-1">
                  <Search className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger className="w-52 h-9 text-sm">
                  <SelectValue placeholder="Filtre API" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les plantes</SelectItem>
                  <SelectItem value="incomplete">Incomplètes (≥1 ID manquant)</SelectItem>
                  <SelectItem value="complete">Complètes (4 IDs principaux)</SelectItem>
                  <SelectItem value="missing_gbif">Sans GBIF</SelectItem>
                  <SelectItem value="missing_powo">Sans POWO</SelectItem>
                  <SelectItem value="missing_ncbi">Sans NCBI</SelectItem>
                  <SelectItem value="missing_wikidata">Sans Wikidata</SelectItem>
                  <SelectItem value="missing_itis">Sans ITIS</SelectItem>
                </SelectContent>
              </Select>

              {(filter !== "all" || genus || category) && (
                <Button size="sm" variant="ghost" onClick={handleClearFilters} className="gap-1 text-muted-foreground">
                  <XCircle className="h-3.5 w-3.5" />
                  Effacer filtres
                </Button>
              )}

              {data && (
                <span className="text-xs text-muted-foreground ml-auto self-center">
                  {data.total} résultat{data.total > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Tableau */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Plante</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Score</th>
                        {API_CONFIG.map((api) => (
                          <th key={api.key} className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                            {api.label}
                          </th>
                        ))}
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Fiche</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.plants.map((plant: any, i: number) => (
                        <tr key={plant.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-sm">{plant.name}</p>
                              {plant.latinName && (
                                <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>
                              )}
                              {plant.family && (
                                <p className="text-xs text-muted-foreground">{plant.family}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <ScoreBadge score={plant.score} max={plant.maxScore} />
                              <Progress value={plant.completenessPercent} className="h-1 w-12" />
                            </div>
                          </td>
                          {API_CONFIG.map((api) => {
                            const hasId = plant.apis[api.key];
                            const idValue = plant[api.key === "gbif" ? "gbifId" : api.key === "powo" ? "powId" : api.key === "ncbi" ? "ncbiTaxId" : api.key === "wikidata" ? "wikidataQid" : "itisId"];
                            return (
                              <td key={api.key} className="px-3 py-3 text-center">
                                {hasId ? (
                                  <a
                                    href={api.url(idValue)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${COLOR_MAP[api.color]} hover:opacity-80 transition-opacity`}
                                    title={idValue}
                                  >
                                    <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                                    <span className="max-w-[80px] truncate">{idValue}</span>
                                  </a>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/50">
                                    <XCircle className="h-3.5 w-3.5 text-muted-foreground/50" />
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-3 py-3 text-center">
                            <Link href={`/plantes/${plant.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                                <ExternalLink className="h-3 w-3" />
                                Voir
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data?.plants.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucune plante ne correspond aux filtres sélectionnés</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Onglet Enrichir */}
        {activeTab === "enrich" && <EnrichTab />}

        {/* Onglet Par genre */}
        {activeTab === "genres" && (
          <div className="space-y-4">
            {isLoadingGenres ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Genre</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Plantes</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Complétude</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">GBIF</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">POWO</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">NCBI</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Wikidata</th>
                        <th className="text-center px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {genreData?.map((genre: any, i: number) => (
                        <tr key={genre.genus} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-4 py-3">
                            <span className="font-semibold italic text-sm">{genre.genus}</span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Badge variant="secondary" className="text-xs">{genre.total}</Badge>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Progress value={genre.completenessPercent} className="h-2 flex-1 min-w-[60px]" />
                              <span className="text-xs text-muted-foreground w-8 text-right">{genre.completenessPercent}%</span>
                            </div>
                          </td>
                          {["withGbif", "withPowo", "withNcbi", "withWikidata"].map((key) => (
                            <td key={key} className="px-3 py-3 text-center">
                              <span className={`text-xs font-medium ${genre[key] === genre.total ? "text-emerald-600 dark:text-emerald-400" : genre[key] > 0 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400"}`}>
                                {genre[key]}/{genre.total}
                              </span>
                            </td>
                          ))}
                          <td className="px-3 py-3 text-center">
                            <Link href={`/admin/phylo-enrichment?tab=batch&genus=${encodeURIComponent(genre.genus)}`}>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                                <RefreshCw className="h-3 w-3" />
                                Enrichir
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
