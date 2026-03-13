// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Square, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, ImageIcon, Clock, Eye, EyeOff
} from "lucide-react";

export default function WikimediaBatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [isDryRun, setIsDryRun] = useState(true);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [notFound, setNotFound] = useState(0);
  const [errors, setErrors] = useState(0);
  const [logs, setLogs] = useState([]);
  const [batchSize, setBatchSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const abortRef = useRef(false);
  const logIdRef = useRef(0);

  const statsQuery = trpc.wikimediaImages.getStats.useQuery();
  const enrichBatchMutation = trpc.wikimediaImages.enrichImagesBatch.useMutation();

  const addLog = useCallback((entry) => {
    setLogs(prev => [{ ...entry, timestamp: new Date() }, ...prev].slice(0, 300));
  }, []);

  const resetStats = () => {
    setProcessed(0); setSucceeded(0); setNotFound(0); setErrors(0); setLogs([]); setHasMore(true);
  };

  const startBatch = async () => {
    abortRef.current = false;
    setIsRunning(true);
    setStartTime(new Date());
    resetStats();
    let currentIndex = 0;
    let continueProcessing = true;
    while (continueProcessing && !abortRef.current) {
      try {
        const result = await enrichBatchMutation.mutateAsync({
          batchSize, startIndex: currentIndex, dryRun: isDryRun
        });
        setProcessed(prev => prev + result.processed);
        setSucceeded(prev => prev + result.success);
        setNotFound(prev => prev + result.notFound);
        setErrors(prev => prev + result.errors);
        setHasMore(result.hasMore);
        setTotalRemaining(result.totalRemaining);
        for (const r of result.results) {
          addLog({
            id: ++logIdRef.current, name: r.plantName, latinName: r.latinName,
            status: r.status, message: r.message, imageUrl: r.imageUrl
          });
        }
        currentIndex = result.nextStartIndex;
        continueProcessing = result.hasMore && result.processed > 0;
        if (continueProcessing) await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        addLog({ id: ++logIdRef.current, name: "Batch", latinName: "", status: "error", message: String(err) });
        continueProcessing = false;
      }
    }
    setIsRunning(false);
    statsQuery.refetch();
  };

  const stopBatch = () => { abortRef.current = true; setIsRunning(false); };
  const elapsedTime = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
  const stats = statsQuery.data;
  const total = stats?.total ?? 0;
  const withImage = stats?.withImage ?? 0;
  const withoutImage = stats?.withoutImage ?? 0;
  const withLatinName = stats?.withLatinName ?? 0;
  const coveragePercent = total > 0 ? Math.round((withImage / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Admin</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-emerald-500" />
              Enrichissement Images Botaniques
            </h1>
            <p className="text-muted-foreground text-sm">
              Recuperation automatique via Wikipedia et Wikimedia Commons
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground mt-1">Total plantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-500">{withImage}</div>
              <div className="text-xs text-muted-foreground mt-1">Avec image ({coveragePercent}%)</div>
              <Progress value={coveragePercent} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-violet-500">{withLatinName}</div>
              <div className="text-xs text-muted-foreground mt-1">Recuperables (nom latin)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-500">{withoutImage - withLatinName}</div>
              <div className="text-xs text-muted-foreground mt-1">Sans nom latin</div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrichissement via Wikipedia + Wikimedia Commons</CardTitle>
            <CardDescription>
              Pour chaque plante sans image (avec nom latin), interroge Wikipedia puis Wikimedia Commons.
              Pause de 300ms entre chaque requete pour respecter les rate-limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1">
                <label className="text-sm font-medium">Taille du batch</label>
                <select
                  value={batchSize}
                  onChange={e => setBatchSize(Number(e.target.value))}
                  disabled={isRunning}
                  className="border rounded px-3 py-1.5 text-sm bg-background"
                >
                  {[5, 10, 20, 30].map(n => <option key={n} value={n}>{n} plantes</option>)}
                </select>
              </div>
              <button
                onClick={() => setIsDryRun(!isDryRun)}
                disabled={isRunning}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors ${
                  isDryRun
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                }`}
              >
                {isDryRun ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isDryRun ? "Simulation (DRY RUN)" : "Mode Ecriture"}
              </button>
              <div className="flex gap-2 ml-auto">
                {!isRunning ? (
                  <Button onClick={startBatch} disabled={withLatinName === 0} className="bg-emerald-600 hover:bg-emerald-700">
                    <Play className="h-4 w-4 mr-2" />{isDryRun ? "Simuler" : "Enrichir Images"}
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={stopBatch}>
                    <Square className="h-4 w-4 mr-2" />Arreter
                  </Button>
                )}
                <Button variant="outline" onClick={resetStats} disabled={isRunning}>
                  <RefreshCw className="h-4 w-4 mr-2" />Reset
                </Button>
              </div>
            </div>
            {isDryRun && (
              <div className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                Mode simulation - aucune donnee modifiee. Desactivez pour enregistrer les URLs d images.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progression */}
        {(isRunning || processed > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {isRunning && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                Progression
                {isRunning && (
                  <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {elapsedTime}s
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">{succeeded}</span>
                  <span className="text-muted-foreground">images trouvees</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">{notFound}</span>
                  <span className="text-muted-foreground">non trouvees</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{errors}</span>
                  <span className="text-muted-foreground">erreurs</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {processed} plantes traitees - {totalRemaining} restantes - {hasMore ? "suite disponible" : "traitement termine"}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Journal d execution</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {logs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border/30">
                      {log.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />}
                      {log.status === "not_found" && <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                      {log.status === "error" && <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                      {log.status === "skipped" && <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{log.name}</span>
                          <span className="text-xs text-muted-foreground italic">{log.latinName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.message}</span>
                      </div>
                      {log.imageUrl && (
                        <img
                          src={log.imageUrl}
                          alt={log.name}
                          className="h-12 w-12 object-cover rounded border border-border/50 shrink-0"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      )}
                      <span className="text-xs text-muted-foreground shrink-0">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Strategie d enrichissement</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>Etape 1 : Wikipedia pageimages API (thumbnail 400px) - le plus fiable pour les plantes</li>
              <li>Etape 2 : Wikimedia Commons search (si Wikipedia n a pas d image)</li>
              <li>Recherche par nom latin (ex: Rosa damascena) pour une precision maximale</li>
              <li>483 plantes recuperables sur 495 total (97% ont un nom latin)</li>
              <li>Les images sont des URLs directes - aucun stockage S3 requis</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
