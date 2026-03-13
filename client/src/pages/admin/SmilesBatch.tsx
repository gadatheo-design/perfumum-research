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
  XCircle, AlertCircle, FlaskConical, Clock, Eye, EyeOff
} from "lucide-react";

export default function SmilesBatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [isDryRun, setIsDryRun] = useState(true);
  const [mode, setMode] = useState("cid");
  const [processed, setProcessed] = useState(0);
  const [succeeded, setSucceeded] = useState(0);
  const [notFound, setNotFound] = useState(0);
  const [errors, setErrors] = useState(0);
  const [logs, setLogs] = useState([]);
  const [batchSize, setBatchSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const abortRef = useRef(false);
  const logIdRef = useRef(0);

  const statsQuery = trpc.smilesEnrichment.getSmilesStats.useQuery();
  const enrichByCidMutation = trpc.smilesEnrichment.enrichSmilesByCid.useMutation();
  const enrichByCasMutation = trpc.smilesEnrichment.enrichSmilesByCas.useMutation();

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
        const mutationInput = { batchSize, startIndex: currentIndex, dryRun: isDryRun };
        const result = mode === "cid"
          ? await enrichByCidMutation.mutateAsync(mutationInput)
          : await enrichByCasMutation.mutateAsync(mutationInput);

        setProcessed(prev => prev + result.processed);
        setSucceeded(prev => prev + result.success);
        setNotFound(prev => prev + result.notFound);
        setErrors(prev => prev + result.errors);
        setHasMore(result.hasMore);
        setTotalRemaining(result.totalRemaining);

        for (const r of result.results) {
          addLog({
            id: ++logIdRef.current,
            name: r.moleculeName,
            identifier: mode === "cid" ? ("CID: " + r.pubchemCid) : ("CAS: " + r.casNumber),
            status: r.status,
            message: r.message,
            smiles: r.smiles,
          });
        }

        currentIndex = result.nextStartIndex;
        continueProcessing = result.hasMore && result.processed > 0;
        if (continueProcessing) await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        addLog({ id: ++logIdRef.current, name: "Batch", identifier: "", status: "error", message: String(err) });
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
  const withSmiles = stats?.withSmiles ?? 0;
  const recoverableViaCid = stats?.recoverableViaCid ?? 0;
  const recoverableViaCas = stats?.recoverableViaCas ?? 0;
  const coveragePercent = total > 0 ? Math.round((withSmiles / total) * 100) : 0;
  const potentialPercent = total > 0 ? Math.round(((withSmiles + recoverableViaCid + recoverableViaCas) / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Admin</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-violet-500" />
              Enrichissement SMILES — PubChem
            </h1>
            <p className="text-muted-foreground text-sm">
              Recuperation automatique des SMILES manquants via PubChem (CID ou CAS)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground mt-1">Total molecules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-violet-500">{withSmiles}</div>
              <div className="text-xs text-muted-foreground mt-1">Avec SMILES ({coveragePercent}%)</div>
              <Progress value={coveragePercent} className="mt-2 h-1" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-500">{recoverableViaCid}</div>
              <div className="text-xs text-muted-foreground mt-1">Recuperables via CID</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-500">{recoverableViaCas}</div>
              <div className="text-xs text-muted-foreground mt-1">Recuperables via CAS</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-violet-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Couverture potentielle apres enrichissement</span>
              <span className="text-sm font-bold text-violet-500">{potentialPercent}%</span>
            </div>
            <Progress value={potentialPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {withSmiles} actuels + {recoverableViaCid} via CID + {recoverableViaCas} via CAS = {withSmiles + recoverableViaCid + recoverableViaCas} / {total} molecules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrichissement via PubChem REST API</CardTitle>
            <CardDescription>
              Mode CID : recupere directement le SMILES depuis le CID PubChem existant (491 molecules, methode la plus fiable).
              Mode CAS : recherche le CAS dans PubChem pour obtenir CID + SMILES (49 molecules supplementaires).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1">
                <label className="text-sm font-medium">Mode d enrichissement</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("cid")}
                    disabled={isRunning}
                    className={"px-3 py-1.5 rounded border text-sm transition-colors " + (mode === "cid" ? "bg-violet-500/20 border-violet-500/50 text-violet-400" : "border-border text-muted-foreground")}
                  >
                    Via CID ({recoverableViaCid})
                  </button>
                  <button
                    onClick={() => setMode("cas")}
                    disabled={isRunning}
                    className={"px-3 py-1.5 rounded border text-sm transition-colors " + (mode === "cas" ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "border-border text-muted-foreground")}
                  >
                    Via CAS ({recoverableViaCas})
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Taille du batch</label>
                <select
                  value={batchSize}
                  onChange={e => setBatchSize(Number(e.target.value))}
                  disabled={isRunning}
                  className="border rounded px-3 py-1.5 text-sm bg-background"
                >
                  {[10, 20, 30, 50].map(n => <option key={n} value={n}>{n} molecules</option>)}
                </select>
              </div>

              <button
                onClick={() => setIsDryRun(!isDryRun)}
                disabled={isRunning}
                className={"flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors " + (isDryRun ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500")}
              >
                {isDryRun ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isDryRun ? "Simulation (DRY RUN)" : "Mode Ecriture"}
              </button>

              <div className="flex gap-2 ml-auto">
                {!isRunning ? (
                  <Button
                    onClick={startBatch}
                    disabled={(mode === "cid" ? recoverableViaCid : recoverableViaCas) === 0}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Play className="h-4 w-4 mr-2" />{isDryRun ? "Simuler" : "Enrichir SMILES"}
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
                Mode simulation - aucune donnee modifiee. Desactivez pour enregistrer les SMILES en base.
              </div>
            )}
          </CardContent>
        </Card>

        {(isRunning || processed > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {isRunning && <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />}
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
                  <span className="text-muted-foreground">SMILES trouves</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">{notFound}</span>
                  <span className="text-muted-foreground">non trouves</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{errors}</span>
                  <span className="text-muted-foreground">erreurs</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {processed} molecules traitees - {totalRemaining} restantes - {hasMore ? "suite disponible" : "traitement termine"}
              </div>
            </CardContent>
          </Card>
        )}

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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{log.name}</span>
                          <span className="text-xs text-muted-foreground">{log.identifier}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.message}</span>
                        {log.smiles && (
                          <div className="text-xs font-mono text-violet-400 mt-0.5 truncate max-w-xs">{log.smiles}</div>
                        )}
                      </div>
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

        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-violet-400 mb-2">Strategie d enrichissement SMILES</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>Mode CID : GET /rest/pug/compound/cid/CID/property/IsomericSMILES/JSON - le plus fiable</li>
              <li>Mode CAS : GET /rest/pug/compound/name/CAS/property/IsomericSMILES,CID/JSON - recupere aussi le CID</li>
              <li>Pause de 220ms entre chaque requete (limite PubChem : 5 req/s)</li>
              <li>491 molecules recuperables via CID + 49 via CAS = 540 SMILES potentiels</li>
              <li>Couverture actuelle : {withSmiles}/{total} ({coveragePercent}%) - potentiel apres enrichissement : {potentialPercent}%</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
