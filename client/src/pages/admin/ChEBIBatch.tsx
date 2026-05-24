import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ArrowLeft, Play, Pause, Square, Leaf, CheckCircle2, XCircle, SkipForward, Clock, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react";

interface LogEntry {
  id: number;
  moleculeId: number;
  moleculeName: string;
  status: "success" | "error" | "skipped";
  message: string;
  chebiId?: string;
  timestamp: Date;
}

export default function ChEBIBatch() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [batchSize, setBatchSize] = useState(50);
  const [delayMs, setDelayMs] = useState(1500);
  const [processed, setProcessed] = useState(0);
  const [success, setSuccess] = useState(0);
  const [errors, setErrors] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentMolecule, setCurrentMolecule] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [molecules, setMolecules] = useState<Array<{ id: number; name: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const stopRef = useRef(false);
  const pauseRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const enrichMutation = trpc.molecules.enrichFromChEBI.useMutation();
  const enrichBatchServerMutation = trpc.molecules.enrichBatchChEBIServer.useMutation();
  const { data: stats, refetch: refetchStats } = trpc.molecules.getEnrichmentStats.useQuery();
  const { data: unenrichedData, refetch: refetchUnenriched } = trpc.molecules.getUnenrichedForChEBI.useQuery(
    { limit: batchSize },
    { enabled: false }
  );

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (entry: Omit<LogEntry, "id" | "timestamp">) => {
    setLogs(prev => [...prev, { ...entry, id: Date.now(), timestamp: new Date() }]);
  };

  const handleStart = async () => {
    stopRef.current = false;
    pauseRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
    setProcessed(0);
    setSuccess(0);
    setErrors(0);
    setSkipped(0);
    setLogs([]);
    setCurrentIndex(0);

    // Mode batch serveur pour les lots >=200 (traitement cote serveur, pas de timeout client)
    if (batchSize >= 200) {
      setTotal(batchSize);
      addLog({ moleculeId: 0, moleculeName: "—", status: "skipped", message: `Lot ${batchSize} mol. — mode serveur actif (traitement en arriere-plan)...` });
      try {
        const res = await enrichBatchServerMutation.mutateAsync({ limit: batchSize, delayMs });
        setProcessed(res.total);
        setSuccess(res.succeeded);
        setErrors(res.failed);
        res.results.forEach(r => addLog({
          moleculeId: r.id,
          moleculeName: r.name,
          status: r.status === 'success' ? 'success' : r.status === 'notFound' ? 'skipped' : 'error',
          message: r.message,
        }));
        addLog({ moleculeId: 0, moleculeName: "—", status: "success", message: `Batch termine : ${res.succeeded} enrichis, ${res.failed} echecs sur ${res.total} molecules.` });
        toast({ title: "Batch ChEBI termine", description: `${res.succeeded} enrichis, ${res.failed} echecs.` });
      } catch (err: any) {
        addLog({ moleculeId: 0, moleculeName: "—", status: "error", message: `Erreur batch serveur : ${err?.message || 'Erreur inconnue'}` });
      }
      setIsRunning(false);
      setCurrentMolecule(null);
      refetchStats();
      return;
    }

    // Fetch molecules to enrich (mode client <200)
    const result = await refetchUnenriched();
    const mols = result.data || [];
    setMolecules(mols);
    setTotal(mols.length);

    if (mols.length === 0) {
      toast({ title: "Aucune molécule à enrichir", description: "Toutes les molécules sans PubChem CID ont déjà un ChEBI ID." });
      setIsRunning(false);
      return;
    }

    toast({ title: `Enrichissement ChEBI démarré`, description: `${mols.length} molécules à traiter` });

    for (let i = 0; i < mols.length; i++) {
      if (stopRef.current) break;

      // Wait while paused
      while (pauseRef.current && !stopRef.current) {
        await new Promise(r => setTimeout(r, 300));
      }
      if (stopRef.current) break;

      const mol = mols[i];
      setCurrentIndex(i);
      setCurrentMolecule(mol.name);

      try {
        const res = await enrichMutation.mutateAsync({ moleculeId: mol.id });
        if (res.success) {
          setSuccess(s => s + 1);
          addLog({
            moleculeId: mol.id,
            moleculeName: mol.name,
            status: "success",
            message: res.message || `Enrichi — ChEBI: ${res.chebiId}`,
            chebiId: res.chebiId,
          });
        } else {
          setErrors(e => e + 1);
          addLog({
            moleculeId: mol.id,
            moleculeName: mol.name,
            status: "error",
            message: res.message || "Échec de l'enrichissement ChEBI",
          });
        }
      } catch (err: any) {
        if (err?.message?.includes("déjà enrichie") || err?.message?.includes("already")) {
          setSkipped(s => s + 1);
          addLog({
            moleculeId: mol.id,
            moleculeName: mol.name,
            status: "skipped",
            message: "Déjà enrichie via ChEBI",
          });
        } else {
          setErrors(e => e + 1);
          addLog({
            moleculeId: mol.id,
            moleculeName: mol.name,
            status: "error",
            message: err?.message || "Erreur inconnue",
          });
        }
      }

      setProcessed(p => p + 1);

      // Delay between requests
      if (i < mols.length - 1 && !stopRef.current) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    setIsRunning(false);
    setCurrentMolecule(null);
    refetchStats();

    if (!stopRef.current) {
      toast({
        title: "Enrichissement ChEBI terminé",
        description: `${success} succès · ${errors} erreurs · ${skipped} ignorées`,
      });
    }
  };

  const handlePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(p => !p);
  };

  const handleStop = () => {
    stopRef.current = true;
    pauseRef.current = false;
    setIsPaused(false);
    setIsRunning(false);
    setCurrentMolecule(null);
    toast({ title: "Enrichissement arrêté", variant: "destructive" });
  };

  const progressPct = total > 0 ? Math.round((processed / total) * 100) : 0;

  // ChEBI stats from enrichment stats
  const chebiStats = stats as any;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Leaf className="h-6 w-6 text-teal-500" />
              Enrichissement ChEBI — Batch
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enrichit les molécules sans PubChem CID via la base ChEBI (Chemical Entities of Biological Interest)
            </p>
          </div>
        </div>

        {/* Stats actuelles */}
        {chebiStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border text-center">
              <p className="text-3xl font-bold text-primary">{chebiStats.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Total molécules</p>
            </div>
            <div className="bg-card p-4 rounded-lg border text-center">
              <p className="text-3xl font-bold text-blue-500">{chebiStats.withPubchem || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Avec PubChem CID</p>
            </div>
            <div className="bg-card p-4 rounded-lg border text-center">
              <p className="text-3xl font-bold text-orange-500">{chebiStats.withoutPubchem || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Sans PubChem CID</p>
            </div>
            <div className="bg-card p-4 rounded-lg border text-center">
              <p className="text-3xl font-bold text-teal-500">{794 - (success)}</p>
              <p className="text-xs text-muted-foreground mt-1">Candidates ChEBI</p>
            </div>
          </div>
        )}

        {/* Note d'information */}
        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4 flex gap-3">
          <Leaf className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-teal-800 dark:text-teal-200">
            <p className="font-medium mb-1">ChEBI — Chemical Entities of Biological Interest</p>
            <p className="text-teal-700 dark:text-teal-300">
              ChEBI est une base de données spécialisée dans les molécules d'origine biologique (terpènes, alcaloïdes, phénols, acides gras...). 
              Idéal pour enrichir les molécules naturelles qui ne sont pas dans PubChem. 
              L'API ChEBI est gratuite et sans limite de taux stricte, mais un délai de 1–2s entre requêtes est recommandé.
            </p>
          </div>
        </div>

        {/* Configuration */}
        {!isRunning && (
          <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Configuration du batch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Nombre de molécules à traiter
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[25, 50, 100, 200, 500, 1000, 2000].map(n => (
                    <button
                      key={n}
                      onClick={() => setBatchSize(n)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                        batchSize === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Délai entre requêtes : <span className="text-foreground font-semibold">{delayMs}ms</span>
                </label>
                <input
                  type="range"
                  min={800}
                  max={3000}
                  step={100}
                  value={delayMs}
                  onChange={e => setDelayMs(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>800ms (rapide)</span>
                  <span>3000ms (prudent)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles */}
        <div className="flex gap-3 flex-wrap">
          {!isRunning ? (
            <Button onClick={handleStart} className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              <Play className="h-4 w-4" />
              Démarrer l'enrichissement ({batchSize} molécules)
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline" className="gap-2">
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? "Reprendre" : "Pause"}
              </Button>
              <Button onClick={handleStop} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" />
                Arrêter
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => { refetchStats(); refetchUnenriched(); }}
            className="gap-2 ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser les stats
          </Button>
        </div>

        {/* Progression */}
        {(isRunning || processed > 0) && (
          <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Progression</h2>
              <div className="flex gap-2">
                {isPaused && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    <Pause className="h-3 w-3 mr-1" /> En pause
                  </Badge>
                )}
                {isRunning && !isPaused && (
                  <Badge variant="outline" className="border-teal-500 text-teal-600 animate-pulse">
                    <Leaf className="h-3 w-3 mr-1" /> En cours
                  </Badge>
                )}
                {!isRunning && processed > 0 && (
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Terminé
                  </Badge>
                )}
              </div>
            </div>

            <Progress value={progressPct} className="h-3" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{processed} / {total} traitées</span>
              <span className="font-semibold">{progressPct}%</span>
            </div>

            {currentMolecule && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 animate-spin" />
                En cours : <span className="font-medium text-foreground">{currentMolecule}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-2xl font-bold text-green-600">{success}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Succès
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-2xl font-bold text-red-600">{errors}</p>
                <p className="text-xs text-red-600 mt-1 flex items-center justify-center gap-1">
                  <XCircle className="h-3 w-3" /> Erreurs
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-950/30 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-2xl font-bold text-gray-600">{skipped}</p>
                <p className="text-xs text-gray-600 mt-1 flex items-center justify-center gap-1">
                  <SkipForward className="h-3 w-3" /> Ignorées
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Journal */}
        {logs.length > 0 && (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Journal ({logs.length} entrées)</h2>
              <Button variant="ghost" size="sm" onClick={() => setLogs([])}>Effacer</Button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2 space-y-1 font-mono text-xs">
              {logs.map(log => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 p-2 rounded ${
                    log.status === "success"
                      ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200"
                      : log.status === "error"
                      ? "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200"
                      : "bg-gray-50 dark:bg-gray-950/20 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {log.status === "success" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  ) : log.status === "error" ? (
                    <XCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <SkipForward className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold">[{log.moleculeId}] {log.moleculeName}</span>
                    {" — "}
                    <span>{log.message}</span>
                    {log.chebiId && (
                      <a
                        href={`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${log.chebiId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-0.5 underline"
                      >
                        ChEBI:{log.chebiId} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-muted-foreground flex-shrink-0">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
