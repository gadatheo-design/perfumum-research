import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { PackageOpen, AlertTriangle, CheckCircle2, Info } from "lucide-react";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function getSizeColorClass(bytes: number): string {
  if (bytes >= 2 * 1024 * 1024) return "bg-red-100 text-red-700 border-red-200";
  if (bytes >= 500 * 1024) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function getSizeBarColor(bytes: number): string {
  if (bytes >= 2 * 1024 * 1024) return "bg-red-400";
  if (bytes >= 500 * 1024) return "bg-amber-400";
  return "bg-emerald-400";
}

function SizeIcon({ bytes }: { bytes: number }) {
  if (bytes >= 2 * 1024 * 1024) return <AlertTriangle className="w-3 h-3 shrink-0" />;
  if (bytes >= 500 * 1024) return <Info className="w-3 h-3 shrink-0" />;
  return <CheckCircle2 className="w-3 h-3 shrink-0" />;
}

export default function AdminBundleVisualizer() {
  const { data: stats, isLoading } = trpc.admin.getBundleStats.useQuery();

  const chunks = stats?.chunks ?? [];
  const totalSize = chunks.reduce((acc, c) => acc + c.size, 0);
  const largeChunks = chunks.filter((c) => c.size >= 500 * 1024);
  const criticalChunks = chunks.filter((c) => c.size >= 2 * 1024 * 1024);

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      <main className="flex-1 section-spacing">
        <div className="container max-w-5xl">
          {/* En-tête */}
          <div className="flex items-center gap-3 mb-8">
            <PackageOpen className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Visualisation du Bundle</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Analyse des chunks JavaScript générés lors du build de production
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-16 text-muted-foreground">
              Chargement des statistiques…
            </div>
          )}

          {!isLoading && chunks.length === 0 && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300">Aucune donnée disponible</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Les statistiques du bundle ne sont disponibles qu'après un build de production complet.
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                      Pour générer un rapport détaillé interactif, lancez en local :{" "}
                      <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">
                        pnpm run build:analyze
                      </code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && chunks.length > 0 && (
            <>
              {/* Résumé */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total JS</p>
                    <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Chunks</p>
                    <p className="text-2xl font-bold">{chunks.length}</p>
                  </CardContent>
                </Card>
                <Card className={criticalChunks.length > 0 ? "border-red-200" : "border-emerald-200"}>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Critiques (&gt;2MB)</p>
                    <p className={`text-2xl font-bold ${criticalChunks.length > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {criticalChunks.length}
                    </p>
                  </CardContent>
                </Card>
                <Card className={largeChunks.length > 3 ? "border-amber-200" : "border-emerald-200"}>
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lourds (&gt;500KB)</p>
                    <p className={`text-2xl font-bold ${largeChunks.length > 3 ? "text-amber-600" : "text-emerald-600"}`}>
                      {largeChunks.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Treemap visuel */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-base">Répartition par taille</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {[...chunks]
                      .sort((a, b) => b.size - a.size)
                      .map((chunk) => {
                        const pct = Math.max(6, Math.round((chunk.size / totalSize) * 100));
                        const colorClass = getSizeColorClass(chunk.size);
                        const shortName = chunk.name
                          .replace(/^assets\//, "")
                          .replace(/-[A-Za-z0-9_-]{8,}\.js$/, ".js");
                        return (
                          <div
                            key={chunk.name}
                            className={`border rounded px-2 py-1 text-xs font-mono flex items-center gap-1 ${colorClass}`}
                            style={{ minWidth: `${Math.min(pct * 0.9, 98)}%` }}
                            title={`${chunk.name} — ${formatSize(chunk.size)}`}
                          >
                            <SizeIcon bytes={chunk.size} />
                            <span className="truncate flex-1">{shortName}</span>
                            <span className="font-semibold shrink-0">{formatSize(chunk.size)}</span>
                          </div>
                        );
                      })}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-300 inline-block" />
                      &lt; 500 KB — optimal
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-300 inline-block" />
                      500 KB – 2 MB — acceptable
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-red-300 inline-block" />
                      &gt; 2 MB — critique
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Liste complète */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Liste complète — {chunks.length} chunks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0.5">
                    {[...chunks]
                      .sort((a, b) => b.size - a.size)
                      .map((chunk) => {
                        const pct = (chunk.size / totalSize) * 100;
                        const barColor = getSizeBarColor(chunk.size);
                        const badgeClass = getSizeColorClass(chunk.size);
                        const shortName = chunk.name
                          .replace(/^assets\//, "")
                          .replace(/-[A-Za-z0-9_-]{8,}\.js$/, ".js");
                        return (
                          <div
                            key={chunk.name}
                            className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                          >
                            <span
                              className="font-mono text-xs text-muted-foreground w-5/12 truncate"
                              title={chunk.name}
                            >
                              {shortName}
                            </span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor}`}
                                style={{ width: `${Math.max(1, Math.min(pct * 6, 100))}%` }}
                              />
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs shrink-0 font-mono ${badgeClass}`}
                            >
                              {formatSize(chunk.size)}
                            </Badge>
                            <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Conseil */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border/40">
                <strong className="text-foreground">Rapport interactif complet :</strong> lancez{" "}
                <code className="font-mono bg-background px-1.5 py-0.5 rounded border text-xs">
                  pnpm run build:analyze
                </code>{" "}
                en local. Le fichier{" "}
                <code className="font-mono bg-background px-1.5 py-0.5 rounded border text-xs">
                  stats.html
                </code>{" "}
                s'ouvrira automatiquement avec un treemap navigable par module.
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
