import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Database, ArrowRight, RefreshCw, BookOpen, Network, Zap } from "lucide-react";

export default function V3MigrationAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("migration");

  // Migration stats
  const { data: migStats, refetch: refetchMig } = trpc.v3Migration.getMigrationStats.useQuery();
  const { data: preview } = trpc.v3Migration.previewMigration.useQuery({ limit: 5 });
  const runMigration = trpc.v3Migration.runMigration.useMutation({
    onSuccess: (data) => {
      toast({ title: "Migration réussie", description: data.message });
      refetchMig();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  // Cache SPARQL stats
  const { data: cacheStats, refetch: refetchCache } = trpc.sparql.getCacheStats.useQuery();
  const clearCache = trpc.sparql.clearSparqlCache.useMutation({
    onSuccess: (data) => {
      toast({ title: "Cache vidé", description: data.message });
      refetchCache();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  // CrossRef stats
  const { data: citationStats, refetch: refetchCitations } = trpc.crossref.getCitationStats.useQuery();
  const batchFetch = trpc.crossref.batchFetchCitations.useMutation({
    onSuccess: (data) => {
      toast({ title: "Enrichissement CrossRef", description: data.message });
      refetchCitations();
    },
    onError: (e) => toast({ title: "Erreur CrossRef", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Administration — Rapport 7</h1>
        <p className="text-muted-foreground mt-2">
          Gestion de la migration bibliographique, du cache SPARQL et du réseau de citations CrossRef.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="migration">
            <Database className="w-4 h-4 mr-2" />
            Migration v3
          </TabsTrigger>
          <TabsTrigger value="cache">
            <Zap className="w-4 h-4 mr-2" />
            Cache SPARQL
          </TabsTrigger>
          <TabsTrigger value="citations">
            <Network className="w-4 h-4 mr-2" />
            Citations CrossRef
          </TabsTrigger>
        </TabsList>

        {/* ── Axe 1.4 : Migration v3_references ── */}
        <TabsContent value="migration">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[
              { label: "Total v3_references", value: migStats?.total ?? "—", icon: Database, color: "text-blue-500" },
              { label: "Migrées", value: migStats?.migrated ?? "—", icon: CheckCircle, color: "text-green-500" },
              { label: "À migrer", value: migStats?.toMigrate ?? "—", icon: ArrowRight, color: "text-orange-500" },
              { label: "Dépréciées", value: migStats?.deprecated ?? "—", icon: AlertTriangle, color: "text-muted-foreground" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{String(stat.value)}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation</CardTitle>
                <CardDescription>Prochaines entrées à migrer vers bibliography_entries</CardDescription>
              </CardHeader>
              <CardContent>
                {preview && preview.length > 0 ? (
                  <div className="space-y-2">
                    {preview.map((entry: Record<string, unknown>) => (
                      <div key={String(entry.id)} className="flex items-start gap-2 p-2 rounded border text-sm">
                        <BookOpen className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{String(entry.title ?? "")}</p>
                          <p className="text-muted-foreground text-xs">
                            {String(entry.entry_type ?? "")} · {String(entry.year ?? "s.d.")} · {String(entry.entry_key ?? "")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune entrée à migrer — migration complète.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exécuter la migration</CardTitle>
                <CardDescription>
                  Copie les entrées uniques de v3_references vers bibliography_entries avec déduplication DOI/entry_key.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
                  <p><strong>Stratégie :</strong> déduplication par DOI et entry_key</p>
                  <p><strong>Doublons ignorés :</strong> {migStats?.duplicates ?? "—"} entrées</p>
                  <p><strong>Statut :</strong>{" "}
                    {migStats?.toMigrate === 0
                      ? <Badge variant="secondary">Migration complète</Badge>
                      : <Badge variant="outline">{migStats?.toMigrate ?? "—"} entrées en attente</Badge>
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => runMigration.mutate({ dryRun: true, batchSize: 100 })}
                    disabled={runMigration.isPending}
                  >
                    Simulation (dry run)
                  </Button>
                  <Button
                    onClick={() => runMigration.mutate({ dryRun: false, batchSize: 166 })}
                    disabled={runMigration.isPending || migStats?.toMigrate === 0}
                  >
                    {runMigration.isPending ? "Migration en cours..." : "Migrer maintenant"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Axe 2.5 : Cache SPARQL ── */}
        <TabsContent value="cache">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[
              { label: "Entrées actives", value: cacheStats?.active ?? "—", color: "text-green-500" },
              { label: "Entrées expirées", value: cacheStats?.expired ?? "—", color: "text-orange-500" },
              { label: "Total hits", value: cacheStats?.totalHits ?? "—", color: "text-blue-500" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{String(stat.value)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Requêtes les plus utilisées</CardTitle>
                <CardDescription>Top 5 par nombre de hits cache</CardDescription>
              </CardHeader>
              <CardContent>
                {cacheStats?.topQueries && cacheStats.topQueries.length > 0 ? (
                  <div className="space-y-2">
                    {(cacheStats.topQueries as Record<string, unknown>[]).map((q, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded border text-sm">
                        <Badge variant="outline">{String(q.hit_count ?? 0)} hits</Badge>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-mono">{String(q.query_text ?? "").substring(0, 80)}...</p>
                          <p className="text-muted-foreground text-xs">{String(q.result_count ?? 0)} résultats · {String(q.execution_time_ms ?? "—")}ms</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune requête en cache pour l'instant.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion du cache</CardTitle>
                <CardDescription>TTL 24h — les entrées expirées sont automatiquement ignorées.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
                  <p><strong>Total entrées :</strong> {cacheStats?.total ?? "—"}</p>
                  <p><strong>Hits moyens :</strong> {cacheStats?.avgHits?.toFixed(1) ?? "—"}</p>
                  <p><strong>Pic :</strong> {cacheStats?.maxHits ?? "—"} hits</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => clearCache.mutate({ expiredOnly: true })}
                    disabled={clearCache.isPending}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Vider expirées
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => clearCache.mutate({ expiredOnly: false })}
                    disabled={clearCache.isPending}
                  >
                    Vider tout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Axe 3.3 : Citations CrossRef ── */}
        <TabsContent value="citations">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[
              { label: "Citations totales", value: citationStats?.totalCitations ?? "—", color: "text-blue-500" },
              { label: "Liens internes", value: citationStats?.internalLinks ?? "—", color: "text-green-500" },
              { label: "Références couvertes", value: citationStats?.coveredEntries ?? "—", color: "text-purple-500" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{String(stat.value)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Références les plus citées</CardTitle>
                <CardDescription>Top 10 par nombre de citations sortantes</CardDescription>
              </CardHeader>
              <CardContent>
                {citationStats?.topCited && (citationStats.topCited as Record<string, unknown>[]).length > 0 ? (
                  <div className="space-y-2">
                    {(citationStats.topCited as Record<string, unknown>[]).map((entry) => (
                      <div key={String(entry.id)} className="flex items-center gap-3 p-2 rounded border text-sm">
                        <Badge variant="outline">{String(entry.citation_count ?? 0)} cit.</Badge>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{String(entry.title ?? "").substring(0, 60)}</p>
                          <p className="text-muted-foreground text-xs">{String(entry.year ?? "s.d.")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune donnée de citation. Lancez l'enrichissement CrossRef.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrichissement CrossRef</CardTitle>
                <CardDescription>
                  Récupère les citations pour les références avec DOI via l'API CrossRef (polite pool).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
                  <p><strong>API :</strong> CrossRef (api.crossref.org)</p>
                  <p><strong>Délai :</strong> 1 req/s (polite pool)</p>
                  <p><strong>Limite :</strong> 10 références par lot</p>
                </div>
                <Button
                  onClick={() => batchFetch.mutate({ limit: 10, skipAlreadyFetched: true })}
                  disabled={batchFetch.isPending}
                >
                  <Network className="w-4 h-4 mr-2" />
                  {batchFetch.isPending ? "Enrichissement en cours..." : "Enrichir 10 références"}
                </Button>
                {batchFetch.data && (
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">{batchFetch.data.message}</p>
                    {batchFetch.data.results.slice(0, 5).map((r) => (
                      <p key={r.id} className="text-muted-foreground text-xs">
                        {r.error ? "✗" : "✓"} {r.title} — {r.inserted} citations{r.error ? ` (${r.error})` : ""}
                      </p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
