import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Database,
  Play,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Link2,
  Leaf,
  FlaskConical,
  SkipForward,
} from "lucide-react";

interface BatchResult {
  plant: string;
  latinName?: string;
  status: "ok" | "not_found" | "error" | "skipped";
  knapsackTotal?: number;
  created?: number;
  wouldCreate?: number;
  skipped?: number;
  error?: string;
  reason?: string;
}

export default function KNApSAcKBatch() {
  const [batchSize, setBatchSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [dryRun, setDryRun] = useState(true);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{
    processed: number;
    totalPlants: number;
    totalCreated: number;
    totalWouldCreate?: number;
    totalSkipped: number;
    totalErrors: number;
    dryRun: boolean;
  } | null>(null);

  const { data: stats, refetch: refetchStats } = trpc.knapsack.getStats.useQuery();

  const enrichBatch = trpc.knapsack.enrichBatch.useMutation({
    onSuccess: (data) => {
      setResults(data.results as BatchResult[]);
      setSummary({
        processed: data.processed,
        totalPlants: data.totalPlants,
        totalCreated: data.totalCreated,
        totalWouldCreate: data.totalWouldCreate,
        totalSkipped: data.totalSkipped,
        totalErrors: data.totalErrors,
        dryRun: data.dryRun,
      });
      setIsRunning(false);
      if (!data.dryRun) {
        refetchStats();
        toast.success(`${data.totalCreated} nouvelles liaisons KNApSAcK créées !`);
      } else {
        toast.info(`Dry-run : ${data.totalWouldCreate} liaisons seraient créées.`);
      }
    },
    onError: (err) => {
      setIsRunning(false);
      toast.error(`Erreur : ${err.message}`);
    },
  });

  const handleRun = () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);
    enrichBatch.mutate({ limit: batchSize, offset, dryRun, onlyWithLatinName: true });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "not_found": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      case "skipped": return <SkipForward className="w-4 h-4 text-slate-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Enrichi</Badge>;
      case "not_found": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Non trouvé</Badge>;
      case "error": return <Badge className="bg-red-100 text-red-700 border-red-200">Erreur</Badge>;
      case "skipped": return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Ignoré</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Database className="w-6 h-6 text-orange-500" />
          <div>
            <h1 className="text-2xl font-bold">KNApSAcK — Liaisons Plante-Molécule</h1>
            <p className="text-sm text-muted-foreground">
              101 500+ paires espèce-molécule documentées — sans crédits IA
            </p>
          </div>
        </div>

        {/* Stats globales */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Leaf className="w-8 h-8 text-emerald-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats?.totalPlants}</div>
                    <div className="text-xs text-muted-foreground">Plantes en DB</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Link2 className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats?.knapsackLinks}</div>
                    <div className="text-xs text-muted-foreground">Liaisons KNApSAcK</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats?.plantsWithKnapsack}</div>
                    <div className="text-xs text-muted-foreground">Plantes enrichies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Configuration du batch</CardTitle>
            <CardDescription>
              KNApSAcK est interrogé via scraping HTML. Un délai de 500ms est appliqué entre chaque plante pour respecter le serveur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre de plantes</label>
                <select
                  value={batchSize}
                  onChange={e => setBatchSize(Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value={5}>5 plantes (~2.5s)</option>
                  <option value={10}>10 plantes (~5s)</option>
                  <option value={20}>20 plantes (~10s)</option>
                  <option value={50}>50 plantes (~25s)</option>
                  <option value={100}>100 plantes (~50s)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Décalage (offset)</label>
                <input
                  type="number"
                  value={offset}
                  onChange={e => setOffset(Number(e.target.value))}
                  min={0}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <input
                type="checkbox"
                id="dryRun"
                checked={dryRun}
                onChange={e => setDryRun(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="dryRun" className="text-sm">
                <span className="font-medium">Mode dry-run</span>
                <span className="text-muted-foreground ml-2">— Simuler sans écrire en base</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className={dryRun ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700"}
              >
                {isRunning ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />En cours...</>
                ) : dryRun ? (
                  <><Eye className="w-4 h-4 mr-2" />Simuler</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" />Lancer l'enrichissement</>
                )}
              </Button>
              {summary && !dryRun && (
                <Button
                  variant="outline"
                  onClick={() => setOffset(prev => prev + batchSize)}
                >
                  Batch suivant (+{batchSize})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Résumé */}
        {summary && (
          <Card className="mb-6 border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {summary.dryRun ? "Résultat de la simulation" : "Enrichissement terminé"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-xl font-bold">{summary.processed}</div>
                  <div className="text-xs text-muted-foreground">Plantes traitées</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-xl font-bold text-emerald-600">
                    {summary.dryRun ? summary.totalWouldCreate : summary.totalCreated}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {summary.dryRun ? "Liaisons à créer" : "Liaisons créées"}
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-600">{summary.totalSkipped}</div>
                  <div className="text-xs text-muted-foreground">Ignorées (déjà liées)</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">{summary.totalErrors}</div>
                  <div className="text-xs text-muted-foreground">Erreurs</div>
                </div>
              </div>
              {summary.totalPlants > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progression globale</span>
                    <span>{offset + summary.processed} / {summary.totalPlants}</span>
                  </div>
                  <Progress value={((offset + summary.processed) / summary.totalPlants) * 100} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Résultats détaillés */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Détail par plante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getStatusIcon(r.status)}
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{r.plant}</div>
                        {r.latinName && (
                          <div className="text-xs text-muted-foreground italic truncate">{r.latinName}</div>
                        )}
                        {r.error && (
                          <div className="text-xs text-red-500 truncate">{r.error}</div>
                        )}
                        {r.reason && (
                          <div className="text-xs text-muted-foreground">{r.reason}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {r.knapsackTotal !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {r.knapsackTotal} KNApSAcK
                        </span>
                      )}
                      {(r.created !== undefined || r.wouldCreate !== undefined) && (
                        <span className="text-xs font-medium text-emerald-600">
                          +{r.created ?? r.wouldCreate} liaisons
                        </span>
                      )}
                      {getStatusBadge(r.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
