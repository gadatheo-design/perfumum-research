// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Square, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, ImageIcon, Clock, Eye, EyeOff,
  Zap, Database, TrendingUp, Loader2, ChevronDown, ChevronUp
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type LogEntry = {
  id: number;
  name: string;
  latinName: string;
  status: "success" | "not_found" | "error" | "skipped";
  message: string;
  imageUrl?: string;
  timestamp: Date;
};

type BatchConfig = {
  totalTarget: number;   // 50 | 100 | 250 | 500 | 1000
  microBatchSize: number; // 20 | 30 | 50 — taille de chaque appel HTTP
  dryRun: boolean;
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const TOTAL_OPTIONS = [
  { label: "50 plantes", value: 50 },
  { label: "100 plantes", value: 100 },
  { label: "250 plantes", value: 250 },
  { label: "500 plantes", value: 500 },
  { label: "1 000 plantes", value: 1000 },
];

const MICRO_BATCH_OPTIONS = [
  { label: "20 / appel (prudent)", value: 20 },
  { label: "30 / appel (normal)", value: 30 },
  { label: "50 / appel (rapide)", value: 50 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function StatusIcon({ status }: { status: LogEntry["status"] }) {
  if (status === "success") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />;
  if (status === "not_found") return <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />;
  if (status === "error") return <XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />;
  return <AlertCircle className="h-3.5 w-3.5 text-zinc-500 mt-0.5 shrink-0" />;
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function WikimediaBatch() {
  // Config
  const [config, setConfig] = useState<BatchConfig>({ totalTarget: 100, microBatchSize: 20, dryRun: true });

  // État du batch
  const [isRunning, setIsRunning] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [notFound, setNotFound] = useState(0);
  const [errors, setErrors] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [batchDone, setBatchDone] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [showLogs, setShowLogs] = useState(true);

  const abortRef = useRef(false);
  const logIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statsQuery = trpc.wikimediaImages.getStats.useQuery();
  const enrichBatchMutation = trpc.wikimediaImages.enrichImagesBatch.useMutation();

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setElapsedSec(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const addLogs = useCallback((entries: Omit<LogEntry, "id" | "timestamp">[]) => {
    const timestamped = entries.map(e => ({ ...e, id: ++logIdRef.current, timestamp: new Date() }));
    setLogs(prev => [...timestamped, ...prev].slice(0, 500));
  }, []);

  const resetState = () => {
    setProcessed(0); setSucceeded(0); setNotFound(0); setErrors(0);
    setLogs([]); setBatchDone(false); setElapsedSec(0);
  };

  // ─── Lancement du batch ───────────────────────────────────────────────────
  const startBatch = async () => {
    abortRef.current = false;
    setIsRunning(true);
    setStartTime(new Date());
    resetState();

    let currentIndex = 0;
    let totalProcessed = 0;

    while (!abortRef.current) {
      const remaining = config.totalTarget - totalProcessed;
      if (remaining <= 0) break;

      const thisBatch = Math.min(config.microBatchSize, remaining);

      try {
        const result = await enrichBatchMutation.mutateAsync({
          batchSize: thisBatch,
          startIndex: currentIndex,
          dryRun: config.dryRun,
          totalTarget: config.totalTarget,
        });

        setTotalAvailable(result.totalAvailable);
        setProcessed(prev => prev + result.processed);
        setSucceeded(prev => prev + result.success);
        setNotFound(prev => prev + result.notFound);
        setErrors(prev => prev + result.errors);

        addLogs(result.results.map(r => ({
          name: r.plantName, latinName: r.latinName ?? "",
          status: r.status, message: r.message, imageUrl: r.imageUrl,
        })));

        currentIndex = result.nextStartIndex;
        totalProcessed += result.processed;

        if (!result.hasMore || result.processed === 0) break;

        // Petite pause entre les micro-batchs pour ne pas saturer l'API
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        addLogs([{ name: "Erreur batch", latinName: "", status: "error", message: String(err) }]);
        break;
      }
    }

    setIsRunning(false);
    setBatchDone(true);
    statsQuery.refetch();
  };

  const stopBatch = () => {
    abortRef.current = true;
    setIsRunning(false);
    setBatchDone(true);
  };

  // ─── Calculs ──────────────────────────────────────────────────────────────
  const stats = statsQuery.data;
  const total = stats?.total ?? 0;
  const withImage = stats?.withImage ?? 0;
  const withoutImage = stats?.withoutImage ?? 0;
  const withLatinName = stats?.withLatinName ?? 0;
  const coveragePercent = total > 0 ? Math.round((withImage / total) * 100) : 0;

  const progressPercent = config.totalTarget > 0 ? Math.round((processed / config.totalTarget) * 100) : 0;
  const rate = elapsedSec > 0 ? (processed / elapsedSec).toFixed(1) : "—";
  const etaSec = processed > 0 && elapsedSec > 0
    ? Math.round(((config.totalTarget - processed) / processed) * elapsedSec)
    : null;

  const successImages = logs.filter(l => l.status === "success" && l.imageUrl);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Admin</Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-emerald-500" />
              Enrichissement Images Botaniques
            </h1>
            <p className="text-muted-foreground text-sm">
              Récupération automatique via Wikipedia &amp; Wikimedia Commons — jusqu'à 1 000 plantes par session
            </p>
          </div>
          {isRunning && (
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 animate-pulse">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" /> En cours
            </Badge>
          )}
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Total plantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-emerald-500">{withImage.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span>Avec image</span>
                <span className="font-semibold text-emerald-400">{coveragePercent}%</span>
              </div>
              <Progress value={coveragePercent} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-violet-500">{withLatinName.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Récupérables (nom latin)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold text-amber-500">{withoutImage.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Sans image</div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration + Contrôles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuration du batch</CardTitle>
            <CardDescription>
              Le batch s'exécute en micro-appels successifs pour éviter les timeouts. Chaque appel traite
              {" "}<strong>{config.microBatchSize}</strong> plantes avec 250 ms de pause entre chaque requête Wikimedia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Nombre total */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Objectif total</label>
                <select
                  value={config.totalTarget}
                  onChange={e => setConfig(c => ({ ...c, totalTarget: Number(e.target.value) }))}
                  disabled={isRunning}
                  className="border rounded px-3 py-1.5 text-sm bg-background min-w-[160px]"
                >
                  {TOTAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Taille micro-batch */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Taille micro-batch</label>
                <select
                  value={config.microBatchSize}
                  onChange={e => setConfig(c => ({ ...c, microBatchSize: Number(e.target.value) }))}
                  disabled={isRunning}
                  className="border rounded px-3 py-1.5 text-sm bg-background min-w-[200px]"
                >
                  {MICRO_BATCH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Mode dry/write */}
              <button
                onClick={() => setConfig(c => ({ ...c, dryRun: !c.dryRun }))}
                disabled={isRunning}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors ${
                  config.dryRun
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                }`}
              >
                {config.dryRun ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {config.dryRun ? "Simulation (DRY RUN)" : "Mode Écriture"}
              </button>

              {/* Boutons action */}
              <div className="flex gap-2 ml-auto">
                {!isRunning ? (
                  <Button
                    onClick={startBatch}
                    disabled={withLatinName === 0 || statsQuery.isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {config.dryRun ? "Simuler" : `Enrichir ${config.totalTarget.toLocaleString()} plantes`}
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={stopBatch}>
                    <Square className="h-4 w-4 mr-2" />Arrêter
                  </Button>
                )}
                <Button variant="outline" onClick={() => { resetState(); statsQuery.refetch(); }} disabled={isRunning}>
                  <RefreshCw className="h-4 w-4 mr-2" />Reset
                </Button>
              </div>
            </div>

            {config.dryRun && (
              <div className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                Mode simulation — aucune donnée modifiée. Désactivez pour enregistrer les URLs d'images en base.
              </div>
            )}

            {/* ETA estimé */}
            {!isRunning && !batchDone && config.totalTarget > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Durée estimée : ~{formatDuration(Math.round(config.totalTarget * 0.6))}
                {" "}({config.totalTarget} plantes × ~600ms/plante)
              </div>
            )}
          </CardContent>
        </Card>

        {/* Barre de progression principale */}
        {(isRunning || processed > 0) && (
          <Card className={isRunning ? "border-emerald-500/30" : batchDone ? "border-violet-500/30" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {isRunning && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                {batchDone && !isRunning && <CheckCircle2 className="h-4 w-4 text-violet-500" />}
                Progression — {processed.toLocaleString()} / {config.totalTarget.toLocaleString()} plantes
                <span className="ml-auto text-xs text-muted-foreground font-normal flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(elapsedSec)}</span>
                  {isRunning && <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-400" />{rate} pl/s</span>}
                  {isRunning && etaSec !== null && <span>ETA : ~{formatDuration(etaSec)}</span>}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barre principale */}
              <div className="space-y-1.5">
                <Progress value={progressPercent} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progressPercent}% traité</span>
                  <span>{(config.totalTarget - processed).toLocaleString()} restantes</span>
                </div>
              </div>

              {/* Compteurs détaillés */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex flex-col items-center justify-center bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
                  <span className="text-xl font-bold text-emerald-400">{succeeded.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Images trouvées</span>
                  {processed > 0 && (
                    <span className="text-xs text-emerald-500 font-medium mt-0.5">
                      {Math.round((succeeded / processed) * 100)}%
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-xl font-bold text-amber-400">{notFound.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Non trouvées</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-xl font-bold text-red-400">{errors.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Erreurs</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-zinc-500/10 rounded-lg p-3 border border-zinc-500/20">
                  <TrendingUp className="h-5 w-5 text-zinc-400 mb-1" />
                  <span className="text-xl font-bold text-zinc-300">{processed.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Traitées</span>
                </div>
              </div>

              {/* Barre de succès */}
              {processed > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Taux de succès</span>
                    <span className="text-emerald-400 font-medium">{Math.round((succeeded / processed) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((succeeded / processed) * 100)} className="h-1.5 bg-zinc-800" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Aperçu images trouvées */}
        {successImages.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-500" />
                  Aperçu images trouvées ({successImages.length})
                  {config.dryRun && <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-[10px]">DRY RUN</Badge>}
                </span>
                <button onClick={() => setShowImages(v => !v)} className="text-muted-foreground hover:text-foreground">
                  {showImages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </CardTitle>
            </CardHeader>
            {showImages && (
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {successImages.slice(0, 80).map(log => (
                    <div key={log.id} className="group relative aspect-square rounded overflow-hidden border border-border/30 bg-zinc-900">
                      <img
                        src={log.imageUrl}
                        alt={log.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                        <span className="text-[9px] text-white italic leading-tight line-clamp-2">{log.latinName}</span>
                      </div>
                    </div>
                  ))}
                  {successImages.length > 80 && (
                    <div className="aspect-square rounded border border-border/30 bg-zinc-900 flex items-center justify-center text-xs text-muted-foreground">
                      +{successImages.length - 80}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Journal d'exécution */}
        {logs.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-violet-400" />
                  Journal d'exécution ({logs.length} entrées)
                </span>
                <button onClick={() => setShowLogs(v => !v)} className="text-muted-foreground hover:text-foreground">
                  {showLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </CardTitle>
            </CardHeader>
            {showLogs && (
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="divide-y divide-border/20">
                    {logs.map(log => (
                      <div key={log.id} className="flex items-start gap-3 px-4 py-2 hover:bg-muted/20 transition-colors">
                        <StatusIcon status={log.status} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm truncate max-w-[180px]">{log.name}</span>
                            <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">{log.latinName}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              log.status === "success" ? "bg-emerald-500/15 text-emerald-400"
                              : log.status === "not_found" ? "bg-amber-500/15 text-amber-400"
                              : log.status === "error" ? "bg-red-500/15 text-red-400"
                              : "bg-zinc-500/15 text-zinc-400"
                            }`}>{log.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.message}</p>
                        </div>
                        {log.imageUrl && (
                          <img
                            src={log.imageUrl}
                            alt={log.name}
                            className="h-10 w-10 object-cover rounded border border-border/40 shrink-0"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            loading="lazy"
                          />
                        )}
                        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>
        )}

        {/* Info stratégie */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" /> Stratégie d'enrichissement
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <ul className="space-y-1">
                <li>① Wikipedia pageimages API (thumbnail 500px) — le plus fiable pour les plantes</li>
                <li>② Wikimedia Commons search (fallback si Wikipedia n'a pas d'image)</li>
                <li>Recherche par nom latin (ex: <em>Rosa damascena</em>) pour une précision maximale</li>
              </ul>
              <ul className="space-y-1">
                <li>250 ms de pause entre chaque requête Wikimedia (rate-limit)</li>
                <li>Micro-batchs de 20–50 plantes pour éviter les timeouts HTTP</li>
                <li>Les URLs d'images sont stockées directement — aucun stockage S3 requis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
