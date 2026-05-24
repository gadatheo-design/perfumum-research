// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Square, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, Database, Zap, Clock, Leaf, Globe,
  Thermometer, Droplets, MapPin, Shield, ChevronRight, Info
} from "lucide-react";

type LogEntry = {
  id: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  steps?: string[];
  timestamp: Date;
};

export default function GBIFBatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [batchSize, setBatchSize] = useState(30);
  const [delayMs, setDelayMs] = useState(600);
  const [includeClimate, setIncludeClimate] = useState(true);
  const [citesToken, setCitesToken] = useState("");
  const [queue, setQueue] = useState<Array<{ id: number; name: string; latinName: string }>>([]);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const abortRef = useRef(false);
  const pauseRef = useRef(false);

  const statsQuery = trpc.gbif.getStats.useQuery();
  const plantsQuery = trpc.gbif.getPlantsToEnrich.useQuery(
    { limit: batchSize, onlyMissing: true, includeClimate },
    { enabled: false }
  );
  const enrichMutation = trpc.gbif.enrichPlant.useMutation();

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
    setLogs([]);
    setStartTime(new Date());

    const result = await plantsQuery.refetch();
    const plantsToProcess = result.data || [];

    if (plantsToProcess.length === 0) {
      addLog({ id: 0, name: "—", status: "skipped", message: "Aucune plante à enrichir. Toutes les plantes ont déjà des données GBIF." });
      setIsRunning(false);
      return;
    }

    setQueue(plantsToProcess);
    setTotalToProcess(plantsToProcess.length);

    for (let i = 0; i < plantsToProcess.length; i++) {
      if (abortRef.current) break;
      while (pauseRef.current) await sleep(200);

      const plant = plantsToProcess[i];
      try {
        const res = await enrichMutation.mutateAsync({
          plantId: plant.id,
          includeClimate,
          citesToken: citesToken || undefined,
        });

        setProcessed(p => p + 1);
        if (res.success) {
          setSucceeded(s => s + 1);
          addLog({
            id: plant.id,
            name: plant.name,
            status: "success",
            message: res.message,
            steps: res.steps,
          });
        } else {
          setFailed(f => f + 1);
          addLog({
            id: plant.id,
            name: plant.name,
            status: "error",
            message: res.message,
          });
        }
      } catch (err: any) {
        setProcessed(p => p + 1);
        setFailed(f => f + 1);
        addLog({
          id: plant.id,
          name: plant.name,
          status: "error",
          message: err.message || "Erreur inconnue",
        });
      }

      await sleep(delayMs);
    }

    setIsRunning(false);
    statsQuery.refetch();
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
  const elapsed = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
  const eta = processed > 0 && totalToProcess > 0
    ? Math.round((elapsed / processed) * (totalToProcess - processed))
    : null;

  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="h-6 w-6 text-emerald-500" />
              Enrichissement GBIF — Batch
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enrichit les plantes via GBIF (taxonomie, UICN), Open-Meteo (climat) et CITES — sans crédits IA
            </p>
          </div>
        </div>

        {/* Statistiques actuelles */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Total plantes", value: stats.total, icon: Leaf, color: "text-foreground" },
              { label: "Avec GBIF ID", value: stats.withGbif, icon: Database, color: "text-blue-500" },
              { label: "Avec famille", value: stats.withFamily, icon: Globe, color: "text-purple-500" },
              { label: "Statut UICN", value: stats.withConservation, icon: Shield, color: "text-orange-500" },
              { label: "Données climat", value: stats.withClimate, icon: Thermometer, color: "text-cyan-500" },
              { label: "Statut CITES", value: stats.withCites, icon: Shield, color: "text-rose-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="text-center">
                <CardContent className="pt-4 pb-3">
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.total > 0 ? `${Math.round((value / stats.total) * 100)}%` : "—"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Taille du batch</Label>
                <Input
                  type="number"
                  value={batchSize}
                  onChange={e => setBatchSize(Number(e.target.value))}
                  min={1} max={200}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground">Plantes à traiter par session</p>
              </div>

              <div className="space-y-1">
                <Label>Délai entre requêtes (ms)</Label>
                <Input
                  type="number"
                  value={delayMs}
                  onChange={e => setDelayMs(Number(e.target.value))}
                  min={200} max={5000}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground">Min. 500ms recommandé (rate-limit GBIF)</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Inclure données climatiques</Label>
                  <p className="text-xs text-muted-foreground">Open-Meteo (T°, précipitations, Köppen)</p>
                </div>
                <Switch
                  checked={includeClimate}
                  onCheckedChange={setIncludeClimate}
                  disabled={isRunning}
                />
              </div>

              <Separator />

              <div className="space-y-1">
                <Label>Token CITES (optionnel)</Label>
                <Input
                  type="password"
                  placeholder="Token api.speciesplus.net"
                  value={citesToken}
                  onChange={e => setCitesToken(e.target.value)}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground">
                  Gratuit sur{" "}
                  <a href="https://api.speciesplus.net" target="_blank" rel="noopener" className="underline">
                    api.speciesplus.net
                  </a>
                </p>
              </div>

              <div className="bg-muted/50 rounded-md p-3 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <Info className="h-3 w-3" /> Données enrichies
                </div>
                <div>• GBIF : famille, ordre, GBIF ID, synonymes</div>
                <div>• UICN : statut de conservation (LC, VU, EN…)</div>
                <div>• Distribution : lat/lon min-max, altitude</div>
                {includeClimate && <div>• Climat : T°, précipitations, zone Köppen</div>}
                {citesToken && <div>• CITES : annexe I/II/III</div>}
              </div>

              {/* Contrôles */}
              <div className="flex gap-2">
                {!isRunning ? (
                  <Button onClick={startBatch} className="flex-1 gap-2">
                    <Play className="h-4 w-4" /> Lancer
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseBatch} variant="outline" className="flex-1 gap-2">
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      {isPaused ? "Reprendre" : "Pause"}
                    </Button>
                    <Button onClick={stopBatch} variant="destructive" size="icon">
                      <Square className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progression + Logs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Progression</span>
                {isRunning && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{elapsed}s</span>
                    {eta != null && <span>ETA: ~{eta}s</span>}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalToProcess > 0 && (
                <>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{processed}/{totalToProcess} plantes</span>
                    <div className="flex gap-3">
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />{succeeded}
                      </span>
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />{failed}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <ScrollArea className="h-80 rounded-md border bg-muted/30 p-3">
                {logs.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Les résultats apparaîtront ici...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, i) => (
                      <div key={i} className="text-xs font-mono border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          {log.status === "success" ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          ) : log.status === "error" ? (
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-yellow-500 shrink-0" />
                          )}
                          <span className="font-medium">{log.name}</span>
                          <span className="text-muted-foreground ml-auto">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="ml-5 text-muted-foreground">{log.message}</div>
                        {log.steps && (
                          <div className="ml-5 text-emerald-600 dark:text-emerald-400">
                            {log.steps.join(" · ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {!isRunning && processed > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Session terminée : {succeeded} enrichies, {failed} erreurs
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setProcessed(0); setSucceeded(0); setFailed(0); setLogs([]); setTotalToProcess(0); }}
                    className="gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Réinitialiser
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
