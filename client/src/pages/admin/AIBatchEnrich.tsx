// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Square, Sparkles,
  CheckCircle2, XCircle, AlertCircle, Leaf, FlaskConical,
  Clock, BarChart3
} from "lucide-react";

type LogEntry = {
  id: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  timestamp: Date;
};

type FilterPlant = "missingDescription" | "missingOlfactiveProfile" | "missingTherapeutic" | "all";
type FilterMat = "missingDescription" | "missingOlfactiveNotes" | "missingUsages" | "all";

export default function AIBatchEnrich() {
  const [activeTab, setActiveTab] = useState<"plants" | "rawMaterials">("plants");
  const [filterPlant, setFilterPlant] = useState<FilterPlant>("missingDescription");
  const [filterMat, setFilterMat] = useState<FilterMat>("missingDescription");
  const [batchSize, setBatchSize] = useState(20);
  const [delayMs, setDelayMs] = useState(3000);
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

  const plantStats = trpc.plants.getBatchEnrichStats.useQuery();
  const matStats = trpc.rawMaterials.getBatchEnrichStats.useQuery();

  const plantQueue = trpc.plants.getForBatchEnrich.useQuery(
    { filter: filterPlant, limit: batchSize, offset: 0 },
    { enabled: false }
  );
  const matQueue = trpc.rawMaterials.getForBatchEnrich.useQuery(
    { filter: filterMat, limit: batchSize, offset: 0 },
    { enabled: false }
  );

  const enrichPlant = trpc.aiEnrichPlant.enrich.useMutation();
  const enrichMat = trpc.aiEnrichRawMaterial.enrich.useMutation();

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

    const isPlants = activeTab === "plants";
    const result = isPlants ? await plantQueue.refetch() : await matQueue.refetch();
    const items = isPlants
      ? (result.data?.plants || [])
      : (result.data?.materials || []);

    if (items.length === 0) {
      addLog({ id: 0, name: "—", status: "skipped", message: "Aucun élément à enrichir avec ce filtre." });
      setIsRunning(false);
      return;
    }

    setTotalToProcess(items.length);

    for (let i = 0; i < items.length; i++) {
      if (abortRef.current) {
        addLog({ id: 0, name: "—", status: "skipped", message: "Traitement interrompu par l'utilisateur." });
        break;
      }
      while (pauseRef.current) {
        await sleep(500);
        if (abortRef.current) break;
      }
      if (abortRef.current) break;

      const item = items[i];
      try {
        if (isPlants) {
          await enrichPlant.mutateAsync({ plantId: item.id });
        } else {
          await enrichMat.mutateAsync({ rawMaterialId: item.id });
        }
        setSucceeded(s => s + 1);
        addLog({ id: item.id, name: item.name, status: "success", message: "Enrichissement appliqué." });
      } catch (err: any) {
        setFailed(f => f + 1);
        addLog({ id: item.id, name: item.name, status: "error", message: err.message || "Erreur inconnue" });
      }
      setProcessed(p => p + 1);
      if (i < items.length - 1) await sleep(delayMs);
    }

    setIsRunning(false);
    setIsPaused(false);
    plantStats.refetch();
    matStats.refetch();
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
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-semibold">Enrichissement IA par lot</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Leaf className="h-4 w-4 text-emerald-500" />} label="Plantes total" value={plantStats.data?.total ?? "…"} />
          <StatCard icon={<AlertCircle className="h-4 w-4 text-amber-500" />} label="Sans description" value={plantStats.data?.missingDescription ?? "…"} sub="plantes" />
          <StatCard icon={<FlaskConical className="h-4 w-4 text-violet-500" />} label="Matières total" value={matStats.data?.total ?? "…"} />
          <StatCard icon={<AlertCircle className="h-4 w-4 text-amber-500" />} label="Sans description" value={matStats.data?.missingDescription ?? "…"} sub="matières" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="plants" className="flex-1 gap-1.5 text-xs">
                      <Leaf className="h-3.5 w-3.5" />Plantes
                    </TabsTrigger>
                    <TabsTrigger value="rawMaterials" className="flex-1 gap-1.5 text-xs">
                      <FlaskConical className="h-3.5 w-3.5" />Matières
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Filtre</label>
                  {activeTab === "plants" ? (
                    <Select value={filterPlant} onValueChange={(v) => setFilterPlant(v as FilterPlant)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missingDescription">Sans description</SelectItem>
                        <SelectItem value="missingOlfactiveProfile">Sans profil olfactif</SelectItem>
                        <SelectItem value="missingTherapeutic">Sans propriétés thérapeutiques</SelectItem>
                        <SelectItem value="all">Toutes les plantes</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={filterMat} onValueChange={(v) => setFilterMat(v as FilterMat)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missingDescription">Sans description</SelectItem>
                        <SelectItem value="missingOlfactiveNotes">Sans notes olfactives</SelectItem>
                        <SelectItem value="missingUsages">Sans usages parfumerie</SelectItem>
                        <SelectItem value="all">Toutes les matières</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Taille du lot</label>
                  <Select value={String(batchSize)} onValueChange={(v) => setBatchSize(Number(v))}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 éléments (test)</SelectItem>
                      <SelectItem value="10">10 éléments</SelectItem>
                      <SelectItem value="20">20 éléments</SelectItem>
                      <SelectItem value="50">50 éléments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Délai entre appels</label>
                  <Select value={String(delayMs)} onValueChange={(v) => setDelayMs(Number(v))}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">2s (rapide)</SelectItem>
                      <SelectItem value="3000">3s (recommandé)</SelectItem>
                      <SelectItem value="5000">5s (prudent)</SelectItem>
                      <SelectItem value="8000">8s (très prudent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 space-y-2">
                  {!isRunning ? (
                    <Button onClick={startBatch} className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Play className="h-4 w-4" />Lancer l'enrichissement
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={togglePause} variant="outline" className="flex-1 gap-1.5 text-sm">
                        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        {isPaused ? "Reprendre" : "Pause"}
                      </Button>
                      <Button onClick={stopBatch} variant="outline" className="flex-1 gap-1.5 text-sm text-destructive border-destructive/50 hover:bg-destructive/10">
                        <Square className="h-4 w-4" />Arrêter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {(isRunning || processed > 0) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-amber-500" />Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{processed} / {totalToProcess}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />{succeeded} réussis
                    </div>
                    <div className="flex items-center gap-1.5 text-destructive">
                      <XCircle className="h-3.5 w-3.5" />{failed} échoués
                    </div>
                    {isRunning && etaSeconds > 0 && (
                      <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />ETA : {formatTime(etaSeconds)}
                      </div>
                    )}
                  </div>
                  {isPaused && (
                    <Badge variant="secondary" className="w-full justify-center bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300">
                      En pause
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Journal d'enrichissement</CardTitle>
                <CardDescription className="text-xs">
                  Les enrichissements sont appliqués directement en base. Consultez les fiches pour vérifier les résultats.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                    <Sparkles className="h-10 w-10 opacity-20" />
                    <p className="text-sm">Le journal s'affichera ici pendant le traitement.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[480px] pr-3">
                    <div className="space-y-1.5">
                      {logs.map((log, i) => (
                        <div key={i} className={`flex items-start gap-2.5 px-3 py-2 rounded-md text-sm ${
                          log.status === "success" ? "bg-emerald-50/50 dark:bg-emerald-950/20" :
                          log.status === "error" ? "bg-red-50/50 dark:bg-red-950/20" : "bg-muted/30"
                        }`}>
                          {log.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />}
                          {log.status === "error" && <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
                          {log.status === "skipped" && <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{log.name}</span>
                              {log.id > 0 && <span className="text-xs text-muted-foreground shrink-0">#{log.id}</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{log.message}</p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {log.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}
