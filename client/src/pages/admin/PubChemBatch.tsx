// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { safeToFixed } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Square, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, Database, Zap, Clock, ChevronRight
} from "lucide-react";

type LogEntry = {
  id: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  cid?: number;
  timestamp: Date;
};

export default function PubChemBatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [batchSize, setBatchSize] = useState(50);
  const [delayMs, setDelayMs] = useState(1200); // 1.2s entre chaque appel pour respecter le rate-limit PubChem
  const [queue, setQueue] = useState<Array<{ id: number; name: string }>>([]);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const abortRef = useRef(false);
  const pauseRef = useRef(false);

  const statsQuery = trpc.molecules.getEnrichmentStats.useQuery();
  const unenrichedQuery = trpc.molecules.getUnenriched.useQuery(
    { limit: batchSize },
    { enabled: false }
  );
  const enrichMutation = trpc.molecules.enrichFromPubChem.useMutation();
  const enrichBatchServerMutation = trpc.molecules.enrichBatchPubChemServer.useMutation();
  const isServerMode = batchSize >= 200;

  const addLog = useCallback((entry: Omit<LogEntry, "timestamp">) => {
    setLogs(prev => [{ ...entry, timestamp: new Date() }, ...prev].slice(0, 500));
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startBatch = async () => {
    abortRef.current = false;
    pauseRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
    setProcessed(0);
    setSucceeded(0);
    setFailed(0);
    setSkipped(0);
    setLogs([]);
    setStartTime(new Date());

    // Mode batch serveur pour les lots >=200 (traitement cote serveur, pas de timeout client)
    if (batchSize >= 200) {
      addLog({ id: 0, name: "—", status: "skipped", message: `Lot ${batchSize} mol. — mode serveur actif (traitement en arriere-plan)...` });
      setTotalToProcess(batchSize);
      try {
        const res = await enrichBatchServerMutation.mutateAsync({ limit: batchSize, delayMs });
        setProcessed(res.total);
        setSucceeded(res.succeeded);
        setFailed(res.failed);
        res.results.forEach(r => addLog({
          id: r.id,
          name: r.name,
          status: r.status === 'success' ? 'success' : r.status === 'notFound' ? 'skipped' : 'error',
          message: r.message,
        }));
        addLog({ id: 0, name: "—", status: "success", message: `Batch termine : ${res.succeeded} enrichis, ${res.failed} echecs sur ${res.total} molecules.` });
      } catch (err: any) {
        addLog({ id: 0, name: "—", status: "error", message: `Erreur batch serveur : ${err?.message || 'Erreur inconnue'}` });
      }
      setIsRunning(false);
      statsQuery.refetch();
      return;
    }

    // Mode client pour les petits lots (<200)
    const result = await unenrichedQuery.refetch();
    const molecules = result.data || [];

    if (molecules.length === 0) {
      addLog({ id: 0, name: "—", status: "skipped", message: "Aucune molecule a enrichir." });
      setIsRunning(false);
      return;
    }

    setQueue(molecules);
    setTotalToProcess(molecules.length);

    for (let i = 0; i < molecules.length; i++) {
      if (abortRef.current) {
        addLog({ id: 0, name: "—", status: "skipped", message: "Enrichissement arrete par l'utilisateur." });
        break;
      }
      while (pauseRef.current && !abortRef.current) {
        await sleep(300);
      }
      if (abortRef.current) break;

      const mol = molecules[i];

      try {
        const res = await enrichMutation.mutateAsync({ moleculeId: mol.id });
        if (res.success) {
          setSucceeded(s => s + 1);
          addLog({ id: mol.id, name: mol.name, status: "success", message: `CID ${res.data?.pubchemCid} — ${res.message}`, cid: res.data?.pubchemCid });
        } else if (res.message?.includes("deja enrichie")) {
          setSkipped(s => s + 1);
          addLog({ id: mol.id, name: mol.name, status: "skipped", message: res.message });
        } else {
          setFailed(f => f + 1);
          addLog({ id: mol.id, name: mol.name, status: "error", message: res.message });
        }
      } catch (err: any) {
        setFailed(f => f + 1);
        addLog({ id: mol.id, name: mol.name, status: "error", message: err?.message || "Erreur inconnue" });
      }

      setProcessed(i + 1);
      if (i < molecules.length - 1 && !abortRef.current) {
        await sleep(delayMs);
      }
    }

    setIsRunning(false);
    setIsPaused(false);
    statsQuery.refetch();
  };

  const pauseResume = () => {
    if (isPaused) {
      pauseRef.current = false;
      setIsPaused(false);
    } else {
      pauseRef.current = true;
      setIsPaused(true);
    }
  };

  const stop = () => {
    abortRef.current = true;
    pauseRef.current = false;
    setIsPaused(false);
  };

  const progress = totalToProcess > 0 ? Math.round((processed / totalToProcess) * 100) : 0;
  const elapsed = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
  const rate = elapsed > 0 ? (processed / elapsed).toFixed(2) : "—";
  const eta = processed > 0 && totalToProcess > processed
    ? Math.round(((totalToProcess - processed) * delayMs) / 1000)
    : null;

  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Enrichissement PubChem — Batch
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enrichit automatiquement les molécules sans CID PubChem (nom IUPAC, CAS, formule, poids, SMILES, synonymes).
            </p>
          </div>
        </div>

        {/* Stats globales */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-muted-foreground">Total molécules</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-green-600 dark:text-green-400">Enrichies (PubChem)</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.enriched}</p>
                <p className="text-xs text-muted-foreground">{Math.round((stats.enriched / stats.total) * 100)}%</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-800">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-orange-600 dark:text-orange-400">Sans CID (à enrichir)</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.unenriched}</p>
                <p className="text-xs text-muted-foreground">{Math.round((stats.unenriched / stats.total) * 100)}%</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuration du batch</CardTitle>
            <CardDescription>
PubChem limite à 5 requêtes/seconde. Délai 1.2s recommandé. Les lots ≥200 sont traités côté serveur (pas de timeout client).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-1">Nombre de molécules à traiter</label>
                <div className="flex items-center gap-2">
                  {[25, 50, 100, 200, 500, 1000, 2000].map(n => (
                    <Button
                      key={n}
                      variant={batchSize === n ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBatchSize(n)}
                      disabled={isRunning}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Délai entre requêtes</label>
                <div className="flex items-center gap-2">
                  {[800, 1200, 2000, 3000].map(d => (
                    <Button
                      key={d}
                      variant={delayMs === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDelayMs(d)}
                      disabled={isRunning}
                    >
                      {d}ms
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contrôles */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <Button onClick={startBatch} className="gap-2" size="lg">
              <Play className="h-4 w-4" />
              Lancer l'enrichissement ({batchSize} molécules)
            </Button>
          ) : (
            <>
              <Button onClick={pauseResume} variant="outline" className="gap-2" size="lg">
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? "Reprendre" : "Pause"}
              </Button>
              <Button onClick={stop} variant="destructive" className="gap-2" size="lg">
                <Square className="h-4 w-4" />
                Arrêter
              </Button>
            </>
          )}
          {!isRunning && processed > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setProcessed(0); setSucceeded(0); setFailed(0); setSkipped(0); setLogs([]); setTotalToProcess(0); setStartTime(null); }}
              className="gap-2 text-muted-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Progression */}
        {(isRunning || processed > 0) && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {isPaused ? "⏸ En pause" : isRunning ? "⚡ En cours..." : "✅ Terminé"}
                </span>
                <span className="text-muted-foreground">
                  {processed} / {totalToProcess} ({progress}%)
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-700 dark:text-green-300 font-semibold">{succeeded}</span>
                  <span className="text-muted-foreground">enrichies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-semibold">{failed}</span>
                  <span className="text-muted-foreground">échecs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-700 dark:text-yellow-300 font-semibold">{skipped}</span>
                  <span className="text-muted-foreground">ignorées</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {elapsed}s écoulées
                    {eta !== null && ` · ~${eta}s restantes`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Log */}
        {logs.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Journal d'enrichissement
                <Badge variant="secondary" className="ml-auto">{logs.length} entrées</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                <div className="divide-y divide-border">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-2.5 text-sm hover:bg-muted/30">
                      {log.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />}
                      {log.status === "error" && <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                      {log.status === "skipped" && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {log.id > 0 && (
                            <Link href={`/molecule/${log.id}`}>
                              <span className="font-medium hover:text-primary hover:underline cursor-pointer truncate max-w-[200px]">
                                {log.name}
                              </span>
                            </Link>
                          )}
                          {log.cid && (
                            <a
                              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${log.cid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-0.5"
                            >
                              CID {log.cid} <ChevronRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs truncate">{log.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Info rate-limit */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border">
          <strong>Note :</strong> PubChem autorise 5 requêtes/seconde pour les accès anonymes. Le délai configuré protège contre les blocages temporaires (HTTP 429). En cas d'erreur répétée, augmenter le délai à 2000ms ou plus.
        </div>
      </div>
    </div>
  );
}
