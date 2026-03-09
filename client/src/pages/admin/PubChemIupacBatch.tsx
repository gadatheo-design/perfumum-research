// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Square, FlaskConical,
  CheckCircle2, XCircle, AlertCircle, Clock, BarChart3, Database, Search
} from "lucide-react";

type LogEntry = {
  id: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  timestamp: Date;
};

type Mode = "hasCas" | "noCas" | "all";

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: any; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export default function PubChemIupacBatch() {
  const [mode, setMode] = useState<Mode>("hasCas");
  const [batchSize, setBatchSize] = useState(30);
  const [delayMs, setDelayMs] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [notFound, setNotFound] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const abortRef = useRef(false);
  const pauseRef = useRef(false);

  const stats = trpc.pubchemIupac.getIupacStats.useQuery();
  const queue = trpc.pubchemIupac.getMissingIupac.useQuery(
    { mode, limit: batchSize, offset: 0 },
    { enabled: false }
  );
  const fetchIupac = trpc.pubchemIupac.fetchAndUpdateIupac.useMutation();

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
    setNotFound(0);
    setLogs([]);
    setStartTime(new Date());

    const result = await queue.refetch();
    const items = result.data?.molecules || [];

    if (items.length === 0) {
      addLog({ id: 0, name: "—", status: "skipped", message: "Aucune molécule à traiter avec ce filtre." });
      setIsRunning(false);
      return;
    }

    setTotalToProcess(items.length);

    for (let i = 0; i < items.length; i++) {
      if (abortRef.current) {
        addLog({ id: 0, name: "—", status: "skipped", message: "Traitement interrompu." });
        break;
      }
      while (pauseRef.current) {
        await sleep(500);
        if (abortRef.current) break;
      }
      if (abortRef.current) break;

      const item = items[i];
      try {
        const res = await fetchIupac.mutateAsync({
          moleculeId: item.id,
          casNumber: item.cas_number || undefined,
          moleculeName: item.name,
        });
        if (res.success) {
          setSucceeded(s => s + 1);
          addLog({ id: item.id, name: item.name, status: "success", message: res.message });
        } else {
          setNotFound(n => n + 1);
          addLog({ id: item.id, name: item.name, status: "skipped", message: "Non trouvé dans PubChem" });
        }
      } catch (err: any) {
        setFailed(f => f + 1);
        addLog({ id: item.id, name: item.name, status: "error", message: err.message || "Erreur inconnue" });
      }
      setProcessed(p => p + 1);
      if (i < items.length - 1) await sleep(delayMs);
    }

    setIsRunning(false);
    setIsPaused(false);
    stats.refetch();
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(p => !p);
  };

  const stopBatch = () => {
    abortRef.current = true;
    pauseRef.current = false;
    setIsPaused(false);
  };

  const progress = totalToProcess > 0 ? Math.round((processed / totalToProcess) * 100) : 0;
  const elapsedSeconds = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
  const avgPerItem = processed > 0 ? elapsedSeconds / processed : 0;
  const remaining = totalToProcess - processed;
  const etaSeconds = Math.round(avgPerItem * remaining);
  const formatTime = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <h1 className="text-xl font-semibold">Complétion IUPAC via PubChem</h1>
          </div>
          <Badge variant="outline" className="ml-auto text-xs">Gratuit · API publique</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FlaskConical className="h-4 w-4 text-violet-500" />} label="Molécules total" value={stats.data?.total ?? "…"} />
          <StatCard icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} label="Avec IUPAC" value={stats.data?.hasIupac ?? "…"} sub="complètes" />
          <StatCard icon={<Search className="h-4 w-4 text-blue-500" />} label="Récupérables (CAS)" value={stats.data?.missingIupacHasCas ?? "…"} sub="via CAS number" />
          <StatCard icon={<AlertCircle className="h-4 w-4 text-amber-500" />} label="Sans CAS ni IUPAC" value={stats.data?.missingIupacNoCas ?? "…"} sub="recherche par nom" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Filtre</label>
                  <Select value={mode} onValueChange={(v) => setMode(v as Mode)} disabled={isRunning}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hasCas">Sans IUPAC, avec CAS (135)</SelectItem>
                      <SelectItem value="noCas">Sans IUPAC, sans CAS (342)</SelectItem>
                      <SelectItem value="all">Toutes sans IUPAC (477)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Taille du lot</label>
                  <Select value={String(batchSize)} onValueChange={(v) => setBatchSize(Number(v))} disabled={isRunning}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 molécules</SelectItem>
                      <SelectItem value="20">20 molécules</SelectItem>
                      <SelectItem value="30">30 molécules</SelectItem>
                      <SelectItem value="50">50 molécules</SelectItem>
                      <SelectItem value="100">100 molécules</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Délai entre requêtes</label>
                  <Select value={String(delayMs)} onValueChange={(v) => setDelayMs(Number(v))} disabled={isRunning}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="200">200ms (rapide)</SelectItem>
                      <SelectItem value="500">500ms (recommandé)</SelectItem>
                      <SelectItem value="1000">1s (prudent)</SelectItem>
                      <SelectItem value="2000">2s (très prudent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-1 space-y-2">
                  {!isRunning ? (
                    <Button onClick={startBatch} className="w-full gap-2 bg-blue-600 hover:bg-blue-700" size="sm">
                      <Play className="h-3.5 w-3.5" />
                      Lancer la complétion
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={togglePause} variant="outline" size="sm" className="flex-1 gap-1.5">
                        {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        {isPaused ? "Reprendre" : "Pause"}
                      </Button>
                      <Button onClick={stopBatch} variant="destructive" size="sm" className="flex-1 gap-1.5">
                        <Square className="h-3.5 w-3.5" />
                        Arrêter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progression */}
            {(isRunning || processed > 0) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">{processed} / {totalToProcess} ({progress}%)</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-semibold text-emerald-500">{succeeded}</div>
                      <div className="text-xs text-muted-foreground">Mis à jour</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-amber-500">{notFound}</div>
                      <div className="text-xs text-muted-foreground">Non trouvés</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-red-500">{failed}</div>
                      <div className="text-xs text-muted-foreground">Erreurs</div>
                    </div>
                  </div>
                  {isRunning && remaining > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      ETA : {formatTime(etaSeconds)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Journal */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span>Journal</span>
                  {logs.length > 0 && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setLogs([])}>
                      Effacer
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[480px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <Database className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">Le journal apparaîtra ici</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pr-2">
                      {logs.map((log, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs py-1.5 border-b border-border/50 last:border-0">
                          {log.status === "success" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />}
                          {log.status === "error" && <XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />}
                          {log.status === "skipped" && <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">{log.name}</span>
                            <span className="text-muted-foreground">{log.message}</span>
                          </div>
                          <span className="text-muted-foreground shrink-0">
                            {log.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Comment ça fonctionne :</strong> Pour chaque molécule, l'API PubChem est interrogée via le numéro CAS (prioritaire) ou le nom de la molécule. Si un nom IUPAC est trouvé, il est automatiquement enregistré en base. La formule moléculaire est également mise à jour si elle est manquante. Délai recommandé : 500ms pour respecter les limites de l'API publique PubChem (5 req/s).
          </p>
        </div>
      </div>
    </div>
  );
}
