// @ts-nocheck
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  ArrowLeft, Play, Pause, Square, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, Database, Zap, Clock, ChevronRight,
  Leaf, FlaskConical, Globe
} from "lucide-react";

type LogEntry = {
  id: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  coconutId?: string;
  organisms?: number;
  timestamp: Date;
};

export default function COCONUTBatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [withOrganisms, setWithOrganisms] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [batchSize, setBatchSize] = useState(50);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef(false);
  const pauseRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statsQuery = trpc.coconut.getEnrichmentStats.useQuery();
  const unenrichedQuery = trpc.coconut.getUnenriched.useQuery(
    { limit: batchSize },
    { enabled: false }
  );
  const enrichMutation = trpc.coconut.enrichMolecule.useMutation();
  const enrichBatchMutation = trpc.coconut.enrichBatch.useMutation();

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
    setWithOrganisms(0);
    setLogs([]);
    setStartTime(new Date());
    setElapsed(0);

    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    // Mode batch serveur pour les lots >=200 (traitement côté serveur, pas de timeout client)
    if (batchSize >= 200) {
      setTotalToProcess(batchSize);
      addLog({ id: 0, name: "—", status: "skipped", message: `Lot ${batchSize} mol. — mode serveur actif (traitement en arrière-plan)...` });
      try {
        const res = await enrichBatchMutation.mutateAsync({ limit: batchSize });
        setProcessed(res.total);
        setSucceeded(res.enriched);
        setFailed(res.errors);
        setWithOrganisms(res.withOrganisms);
        setTotalToProcess(res.total);
        res.details.forEach(d => addLog({
          id: 0,
          name: d.name,
          status: d.success ? 'success' : 'error',
          message: d.success
            ? `Enrichi · ${d.organisms || 0} organisme(s) · ${d.newPlantLinks || 0} lien(s) plante`
            : 'Non trouvée dans LOTUS',
        }));
        addLog({ id: 0, name: "—", status: "success", message: `Batch terminé : ${res.enriched} enrichies, ${res.errors} erreurs sur ${res.total} molécules.` });
      } catch (err: any) {
        addLog({ id: 0, name: "—", status: "error", message: `Erreur batch serveur : ${err?.message || 'Erreur inconnue'}` });
      }
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      statsQuery.refetch();
      return;
    }

    // Mode client pour les petits lots (<200)
    const result = await unenrichedQuery.refetch();
    const molecules = result.data || [];

    if (molecules.length === 0) {
      addLog({ id: 0, name: "—", status: "skipped", message: "Aucune molécule à enrichir via LOTUS." });
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTotalToProcess(molecules.length);

    for (let i = 0; i < molecules.length; i++) {
      if (abortRef.current) break;

      while (pauseRef.current) {
        await sleep(300);
        if (abortRef.current) break;
      }
      if (abortRef.current) break;

      const mol = molecules[i];
      try {
        const res = await enrichMutation.mutateAsync({ moleculeId: mol.id });
        setProcessed(prev => prev + 1);

        if (res.success) {
          setSucceeded(prev => prev + 1);
          if (res.data?.organisms && (res.data.organisms as unknown as { length?: number })?.length
            ? (res.data.organisms as unknown as unknown[]).length > 0
            : (res.data.organisms as unknown as number) > 0) {
            setWithOrganisms(prev => prev + 1);
          }
          addLog({
            id: mol.id,
            name: mol.name,
            status: "success",
            message: `LOTUS ID: ${res.data?.coconutId} · organismes trouvés`,
            coconutId: res.data?.coconutId as string | undefined,
          });
        } else if (res.message?.includes("déjà enrichie")) {
          setSkipped(prev => prev + 1);
          addLog({ id: mol.id, name: mol.name, status: "skipped", message: res.message });
        } else {
          setFailed(prev => prev + 1);
          addLog({ id: mol.id, name: mol.name, status: "error", message: res.message || "Non trouvée dans LOTUS" });
        }
      } catch (err: any) {
        setProcessed(prev => prev + 1);
        setFailed(prev => prev + 1);
        addLog({ id: mol.id, name: mol.name, status: "error", message: err.message || "Erreur réseau" });
      }

      // Rate limit : 400ms entre chaque appel (LOTUS recommande un délai raisonnable)
      await sleep(350);
    }

    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    statsQuery.refetch();
  };

  const pauseBatch = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(prev => !prev);
  };

  const stopBatch = () => {
    abortRef.current = true;
    pauseRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const progress = totalToProcess > 0 ? Math.round((processed / totalToProcess) * 100) : 0;
  const eta = isRunning && processed > 0 && elapsed > 0
    ? Math.round(((elapsed / processed) * (totalToProcess - processed)))
    : null;

  const stats = statsQuery.data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-emerald-500" />
            Enrichissement LOTUS
          </h1>
          <p className="text-sm text-muted-foreground">
            Base de données de produits naturels — 750 000+ molécules, Wikidata-backed
          </p>
        </div>
      </div>

      {/* Stats actuelles */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total molécules</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.enriched ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Enrichies LOTUS</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.unenriched ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">À enrichir</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.withOrganisms ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Avec organismes</div>
          </Card>
        </div>
      )}

      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            Paramètres du batch
          </CardTitle>
          <CardDescription>
            LOTUS enrichit les molécules avec leur identifiant naturel, score NP-likeness, organismes sources et classification chimique.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium w-40">Taille du batch</label>
            <div className="flex items-center gap-2">
              {[50, 100, 200, 500, 1000, 2500, 5000].map(n => (
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

          <div className="flex gap-2 pt-2">
            {!isRunning ? (
              <Button onClick={startBatch} className="gap-2" disabled={statsQuery.isLoading}>
                <Play className="h-4 w-4" />
                Lancer l'enrichissement
              </Button>
            ) : (
              <>
                <Button onClick={pauseBatch} variant="outline" className="gap-2">
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? "Reprendre" : "Pause"}
                </Button>
                <Button onClick={stopBatch} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Arrêter
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => statsQuery.refetch()}
              disabled={isRunning}
              title="Actualiser les stats"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progression */}
      {(isRunning || processed > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {isPaused ? "⏸ En pause" : isRunning ? "⚡ En cours..." : "✅ Terminé"}
              </span>
              <span className="text-muted-foreground">
                {processed} / {totalToProcess} ({progress}%)
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-green-700 dark:text-green-300 font-semibold">{succeeded}</span>
                <span className="text-muted-foreground">enrichies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{withOrganisms}</span>
                <span className="text-muted-foreground">avec organismes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 dark:text-red-300 font-semibold">{failed}</span>
                <span className="text-muted-foreground">non trouvées</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">
                  {elapsed}s
                  {eta !== null && ` · ~${eta}s restantes`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal */}
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
                      <div className="flex items-center gap-2 flex-wrap">
                        {log.id > 0 && (
                          <Link href={`/molecule/${log.id}`}>
                            <span className="font-medium hover:text-primary hover:underline cursor-pointer truncate max-w-[200px]">
                              {log.name}
                            </span>
                          </Link>
                        )}
                        {log.coconutId && (
                          <a
                            href={`https://coconut.naturalproducts.net/compound/coconut_id/${log.coconutId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5"
                          >
                            {log.coconutId} <ChevronRight className="h-3 w-3" />
                          </a>
                        )}
                        {log.organisms !== undefined && log.organisms > 0 && (
                          <Badge variant="outline" className="text-xs py-0 h-5 text-emerald-700 border-emerald-300">
                            {log.organisms} org.
                          </Badge>
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

      {/* Note technique */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border">
        <strong>COCONUT (COlleCtion of Open Natural prodUcTs) :</strong> Base de données ouverte de produits naturels.
        L'enrichissement récupère l'identifiant COCONUT, le score NP-likeness (−5 à +5, plus élevé = plus naturel),
        les organismes sources documentés et les citations scientifiques associées.
        Délai de 350ms entre chaque requête pour respecter les limites de l'API.
      </div>
    </div>
  );
}
