import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

interface ChunkInfo {
  name: string;
  size: number;
  gzipSize: number;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "react-vendor": "bg-blue-500",
  "pages-admin": "bg-red-500",
  "pages-molecules": "bg-purple-500",
  "pages-plants": "bg-green-500",
  "pages-tabac": "bg-amber-600",
  "pages-recettes": "bg-orange-500",
  "pages-gammes": "bg-pink-500",
  "pages-recherche": "bg-cyan-500",
  "pages-graphes": "bg-indigo-500",
  "pages-terroirs": "bg-teal-500",
  "pages-matieres": "bg-lime-600",
  "pages-references": "bg-violet-500",
  "pages-dashboard": "bg-sky-500",
  "pages-projet": "bg-rose-500",
  "pages-misc": "bg-gray-500",
  "other": "bg-slate-400",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getCategory(name: string): string {
  for (const cat of Object.keys(CATEGORY_COLORS)) {
    if (name.startsWith(cat)) return cat;
  }
  return "other";
}

export default function BundleVisualizer() {
  const [chunks, setChunks] = useState<ChunkInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("treemap");

  const bundleStatsQuery = trpc.admin.getBundleStats.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (bundleStatsQuery.data) {
      setChunks(bundleStatsQuery.data);
      setLoading(false);
    } else if (bundleStatsQuery.error) {
      setError("Impossible de charger les statistiques du bundle. Lancez d'abord `pnpm run build:analyze`.");
      setLoading(false);
    }
  }, [bundleStatsQuery.data, bundleStatsQuery.error]);

  const totalSize = chunks.reduce((sum, c) => sum + c.size, 0);
  const totalGzip = chunks.reduce((sum, c) => sum + c.gzipSize, 0);

  // Grouper par catégorie
  const byCategory = chunks.reduce<Record<string, ChunkInfo[]>>((acc, chunk) => {
    const cat = getCategory(chunk.name);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(chunk);
    return acc;
  }, {});

  const categoryTotals = Object.entries(byCategory)
    .map(([cat, items]) => ({
      category: cat,
      size: items.reduce((s, i) => s + i.size, 0),
      gzipSize: items.reduce((s, i) => s + i.gzipSize, 0),
      count: items.length,
    }))
    .sort((a, b) => b.size - a.size);

  const sortedChunks = [...chunks].sort((a, b) => b.size - a.size);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement des statistiques du bundle…</div>
      </div>
    );
  }

  if (error || chunks.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <p className="text-amber-400 font-medium mb-2">Aucune donnée de bundle disponible</p>
            <p className="text-sm text-muted-foreground mb-4">
              Pour générer les statistiques du bundle, lancez la commande suivante dans le terminal :
            </p>
            <code className="block bg-black/40 text-green-400 p-3 rounded font-mono text-sm">
              pnpm run build:analyze
            </code>
            <p className="text-sm text-muted-foreground mt-3">
              Cela génère un rapport interactif dans <code className="text-primary">dist/public/bundle-stats.html</code>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Structure actuelle du bundle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Le code splitting est configuré avec les catégories suivantes :
            </p>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.keys(CATEGORY_COLORS).filter(c => c !== "other").map(cat => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat]}`} />
                  <span className="text-xs font-mono">{cat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rapport interactif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Après avoir lancé <code className="text-primary">pnpm run build:analyze</code>, 
              le rapport interactif sera accessible ici :
            </p>
            <Button
              variant="outline"
              onClick={() => window.open("/bundle-stats.html", "_blank")}
              className="text-sm"
            >
              Ouvrir le rapport (après build:analyze)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visualisation du Bundle</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyse des dépendances JavaScript du projet PERFUMUM
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("/bundle-stats.html", "_blank")}
        >
          Rapport interactif
        </Button>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{formatBytes(totalSize)}</div>
            <div className="text-xs text-muted-foreground">Taille totale</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{formatBytes(totalGzip)}</div>
            <div className="text-xs text-muted-foreground">Compressé (gzip)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{chunks.length}</div>
            <div className="text-xs text-muted-foreground">Chunks JS</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {((totalGzip / totalSize) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Ratio compression</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="treemap">Treemap</TabsTrigger>
          <TabsTrigger value="categories">Par catégorie</TabsTrigger>
          <TabsTrigger value="list">Liste complète</TabsTrigger>
        </TabsList>

        {/* Treemap visuel */}
        <TabsContent value="treemap">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribution des chunks par taille</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {sortedChunks.map((chunk) => {
                  const pct = (chunk.size / totalSize) * 100;
                  const minWidth = Math.max(pct * 8, 2);
                  const cat = getCategory(chunk.name);
                  const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
                  return (
                    <div
                      key={chunk.name}
                      className={`${color} rounded text-white text-xs flex items-center justify-center overflow-hidden cursor-default transition-opacity hover:opacity-80`}
                      style={{
                        width: `${minWidth}%`,
                        minWidth: "2px",
                        height: pct > 2 ? "48px" : "24px",
                        padding: pct > 3 ? "4px" : "0",
                      }}
                      title={`${chunk.name}\n${formatBytes(chunk.size)} (${pct.toFixed(1)}%)\ngzip: ${formatBytes(chunk.gzipSize)}`}
                    >
                      {pct > 3 && (
                        <span className="truncate px-1 font-mono text-[10px]">
                          {chunk.name.replace(/-[A-Za-z0-9_-]{8}$/, "")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== "other").map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-[10px] text-muted-foreground font-mono">{cat}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Par catégorie */}
        <TabsContent value="categories">
          <div className="space-y-3">
            {categoryTotals.map(({ category, size, gzipSize, count }) => {
              const pct = (size / totalSize) * 100;
              const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
              return (
                <Card key={category}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="font-mono text-sm font-medium">{category}</span>
                        <Badge variant="outline" className="text-xs">{count} chunks</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatBytes(size)}</div>
                        <div className="text-xs text-muted-foreground">gzip: {formatBytes(gzipSize)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{pct.toFixed(1)}% du bundle total</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Liste complète */}
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 pr-4 font-medium">Chunk</th>
                      <th className="text-right py-2 pr-4 font-medium">Taille</th>
                      <th className="text-right py-2 pr-4 font-medium">Gzip</th>
                      <th className="text-right py-2 font-medium">% total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedChunks.map((chunk) => {
                      const pct = (chunk.size / totalSize) * 100;
                      const cat = getCategory(chunk.name);
                      const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
                      return (
                        <tr key={chunk.name} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-1.5 pr-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                              <span className="font-mono text-xs truncate max-w-[300px]">
                                {chunk.name.replace(/-[A-Za-z0-9_-]{8}$/, "")}
                              </span>
                            </div>
                          </td>
                          <td className="py-1.5 pr-4 text-right font-mono text-xs">
                            {formatBytes(chunk.size)}
                          </td>
                          <td className="py-1.5 pr-4 text-right font-mono text-xs text-muted-foreground">
                            {formatBytes(chunk.gzipSize)}
                          </td>
                          <td className="py-1.5 text-right text-xs text-muted-foreground">
                            {pct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
