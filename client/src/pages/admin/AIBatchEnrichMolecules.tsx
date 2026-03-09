// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Square, Sparkles,
  CheckCircle2, XCircle, AlertCircle, FlaskConical,
  Clock, BarChart3, Atom
} from "lucide-react";

type LogEntry = {
  id: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  timestamp: Date;
};

type FilterMol = "missingIupac" | "missingOlfactive" | "missingTherapeutic" | "missingFamily" | "all";

export default function AIBatchEnrichMolecules() {
  const [filter, setFilter] = useState<FilterMol>("missingOlfactive");
  const [batchSize, setBatchSize] = useState(15);
  const [delayMs, setDelayMs] = useState(4000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const abortRef = useRef(false);
  const pauseRef = useRef(false);

  const stats = trpc.molecules.getBatchEnrichStats.useQuery();
  const queue = trpc.molecules.getForBatchEnrich.useQuery(
    { filter, limit: batchSize, offset: 0 },
    { enabled: false }
  );
  const enrichMol = trpc.aiEnrichMolecule.enrich.useMutation();

  const addLog = useCallback((entry: Omit<LogEntry, "timestamp">) => {
    setLogs(prev => [{ ...entry, timestamp: new Date() }, ...prev].slice(0, 300));
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
    setLogs([]);
    setStartTime(new Date());

    const result = await queue.refetch();
    const items = result.data ?? [];
    setTotalToProcess(items.length);

    if (items.length === 0) {
      addLog({ id: 0, name: "—", status: "skipped", message: "Aucune molécule à enrichir avec ce filtre." });
      setIsRunning(false);
      return;
    }

    let logId = 0;
    for (const mol of items) {
      if (abortRef.current) break;
      while (pauseRef.current) await sleep(500);

      try {
        await enrichMol.mutateAsync({ id: mol.id });
        setSucceeded(s => s + 1);
        addLog({ id: logId++, name: mol.name, status: "success", message: "Enrichi avec succès" });
      } catch (e: any) {
        setFailed(f => f + 1);
        addLog({ id: logId++, name: mol.name, status: "error", message: e?.message ?? "Erreur inconnue" });
      }
      setProcessed(p => p + 1);
      await sleep(delayMs);
    }

    setIsRunning(false);
    stats.refetch();
  };

  const pauseBatch = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(p => !p);
  };

  const stopBatch = () => {
    abortRef.current = true;
    pauseRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
  };

  const progress = totalToProcess > 0 ? Math.round((processed / totalToProcess) * 100) : 0;

  const filterOptions: { value: FilterMol; label: string; count: number | undefined }[] = [
    { value: "missingOlfactive", label: "Sans profil olfactif", count: stats.data?.missingOlfactive },
    { value: "missingTherapeutic", label: "Sans propriétés thérapeutiques", count: stats.data?.missingTherapeutic },
    { value: "missingIupac", label: "Sans nom IUPAC", count: stats.data?.missingIupac },
    { value: "missingFamily", label: "Sans famille chimique", count: stats.data?.missingFamily },
    { value: "all", label: "Toutes les molécules", count: stats.data?.total },
  ];

  const elapsedSec = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
  const rate = elapsedSec > 0 ? (processed / elapsedSec * 60).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Admin
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Atom className="w-6 h-6 text-violet-600" />
              Enrichissement IA — Molécules par lot
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enrichit automatiquement les molécules incomplètes via l'IA (profil olfactif, propriétés thérapeutiques, IUPAC, famille chimique).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Config */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> État de la base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.isLoading ? (
                  <div className="text-sm text-muted-foreground">Chargement…</div>
                ) : stats.data ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total molécules</span>
                      <Badge variant="secondary">{stats.data.total}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sans profil olfactif</span>
                      <Badge variant="outline" className="text-orange-600">{stats.data.missingOlfactive}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sans propriétés thérap.</span>
                      <Badge variant="outline" className="text-red-600">{stats.data.missingTherapeutic}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sans IUPAC</span>
                      <Badge variant="outline" className="text-amber-600">{stats.data.missingIupac}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sans famille chimique</span>
                      <Badge variant="outline" className="text-blue-600">{stats.data.missingFamily}</Badge>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* Config */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Filtre</label>
                  <Select value={filter} onValueChange={(v) => setFilter(v as FilterMol)} disabled={isRunning}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label} {opt.count !== undefined ? `(${opt.count})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Taille du lot</label>
                  <Select value={String(batchSize)} onValueChange={(v) => setBatchSize(Number(v))} disabled={isRunning}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 30, 50].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} molécules</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Délai entre requêtes</label>
                  <Select value={String(delayMs)} onValueChange={(v) => setDelayMs(Number(v))} disabled={isRunning}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">2 secondes</SelectItem>
                      <SelectItem value="3000">3 secondes</SelectItem>
                      <SelectItem value="4000">4 secondes</SelectItem>
                      <SelectItem value="6000">6 secondes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Controls */}
                <div className="flex gap-2 pt-2">
                  {!isRunning ? (
                    <Button onClick={startBatch} className="flex-1 gap-2 bg-violet-600 hover:bg-violet-700">
                      <Play className="w-4 h-4" /> Lancer
                    </Button>
                  ) : (
                    <>
                      <Button onClick={pauseBatch} variant="outline" size="sm" className="gap-1">
                        {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        {isPaused ? "Reprendre" : "Pause"}
                      </Button>
                      <Button onClick={stopBatch} variant="destructive" size="sm" className="gap-1">
                        <Square className="w-3 h-3" /> Arrêter
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Progress + Logs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  Progression
                  {isRunning && (
                    <Badge variant="secondary" className="ml-auto animate-pulse text-xs">
                      {isPaused ? "En pause" : "En cours…"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-3" />
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold">{processed}</div>
                    <div className="text-xs text-muted-foreground">Traités</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">{succeeded}</div>
                    <div className="text-xs text-muted-foreground">Succès</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-600">{failed}</div>
                    <div className="text-xs text-muted-foreground">Erreurs</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-muted-foreground">{rate}</div>
                    <div className="text-xs text-muted-foreground">/ min</div>
                  </div>
                </div>
                {startTime && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Démarré il y a {elapsedSec}s
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Journal d'enrichissement</CardTitle>
                <CardDescription className="text-xs">Les 300 dernières opérations</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <FlaskConical className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm">Aucune opération en cours</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs py-1 border-b border-border/50 last:border-0">
                          {log.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />}
                          {log.status === "error" && <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />}
                          {log.status === "skipped" && <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">{log.name}</span>
                            <span className="text-muted-foreground">{log.message}</span>
                          </div>
                          <span className="text-muted-foreground shrink-0">
                            {log.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
