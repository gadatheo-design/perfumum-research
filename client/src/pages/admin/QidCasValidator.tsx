/**
 * QidCasValidator.tsx
 * Validation et correction automatique des QIDs Wikidata via numéros CAS (P231)
 */
import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import {
  ArrowLeft, ShieldCheck, ShieldX, AlertTriangle, CheckCircle2,
  Loader2, ExternalLink, Play, Download, HelpCircle, XCircle, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ValidationStatus = "valid" | "wrong_qid" | "missing_qid" | "not_found" | "unverifiable" | "error";

interface ValidationResult {
  moleculeId: number;
  name: string;
  casNumber: string;
  currentQid: string | null;
  status: ValidationStatus;
  suggestedQid: string | null;
  suggestedLabel: string | null;
  suggestedScore?: number;
}

interface BatchSummary {
  total: number;
  valid: number;
  wrongQid: number;
  missingQid: number;
  notFound: number;
  unverifiable: number;
  errors: number;
}

function statusConfig(status: ValidationStatus) {
  switch (status) {
    case "valid":      return { label: "Valide",          color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", Icon: CheckCircle2, variant: "default"     as const };
    case "wrong_qid":  return { label: "QID incorrect",   color: "text-red-600",     bg: "bg-red-50 border-red-200",         Icon: ShieldX,      variant: "destructive" as const };
    case "missing_qid":return { label: "QID manquant",    color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",     Icon: AlertTriangle,variant: "secondary"   as const };
    case "not_found":  return { label: "Non trouvé",      color: "text-slate-500",   bg: "bg-slate-50 border-slate-200",     Icon: HelpCircle,   variant: "outline"     as const };
    case "unverifiable":return{label: "Non vérifiable",   color: "text-orange-500",  bg: "bg-orange-50 border-orange-200",   Icon: AlertTriangle,variant: "secondary"   as const };
    case "error":      return { label: "Erreur",          color: "text-red-400",     bg: "bg-red-50 border-red-100",         Icon: XCircle,      variant: "destructive" as const };
  }
}

function ResultRow({ result, selected, onToggle }: { result: ValidationResult; selected: boolean; onToggle: (id: number) => void }) {
  const cfg = statusConfig(result.status);
  const { Icon } = cfg;
  const needsAction = result.status === "wrong_qid" || result.status === "missing_qid";
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${cfg.bg} ${needsAction ? "cursor-pointer hover:opacity-90" : ""}`}
      onClick={() => needsAction && onToggle(result.moleculeId)}>
      {needsAction ? (
        <div className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${selected ? "bg-violet-600 border-violet-600" : "border-slate-400 bg-white"}`}>
          {selected && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
      ) : <Icon className={`mt-0.5 w-4 h-4 flex-shrink-0 ${cfg.color}`} />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{result.name}</span>
          <Badge variant="outline" className="text-xs font-mono px-1.5 py-0">{result.casNumber}</Badge>
          <Badge variant={cfg.variant} className="text-xs px-1.5 py-0">{cfg.label}</Badge>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          {result.currentQid && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">Actuel :</span>
              <a href={`https://www.wikidata.org/wiki/${result.currentQid}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:underline flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                {result.currentQid} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </span>
          )}
          {result.suggestedQid && (
            <span className="flex items-center gap-1">
              <span className="text-emerald-600 font-medium">→ Correction :</span>
              <a href={`https://www.wikidata.org/wiki/${result.suggestedQid}`} target="_blank" rel="noopener noreferrer"
                className="font-mono text-emerald-700 hover:underline flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                {result.suggestedQid} <ExternalLink className="w-2.5 h-2.5" />
              </a>
              {result.suggestedLabel && <span className="text-slate-500">({result.suggestedLabel})</span>}
              {result.suggestedScore && (
                <span className={`font-semibold ${result.suggestedScore >= 90 ? "text-emerald-600" : result.suggestedScore >= 70 ? "text-amber-600" : "text-slate-400"}`}>
                  {result.suggestedScore}%
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QidCasValidator() {
  const { toast } = useToast();
  const [batchLimit, setBatchLimit] = useState(30);
  const [onlyWithQid, setOnlyWithQid] = useState(true);
  const [familyFilter, setFamilyFilter] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: coverageStats } = trpc.moleculesQid.getQidCoverageStats.useQuery();

  const applyBatchMutation = trpc.moleculesQid.applyBatchQid.useMutation({
    onSuccess: (data) => {
      toast({ title: `✅ ${data.applied} QIDs corrigés`, description: data.errors.length > 0 ? `${data.errors.length} erreurs` : "Corrections appliquées." });
      setSelectedIds(new Set());
      setResults(prev => prev.map(r => {
        if (selectedIds.has(r.moleculeId) && r.suggestedQid) {
          return { ...r, currentQid: r.suggestedQid, status: "valid" as const, suggestedQid: null };
        }
        return r;
      }));
    },
    onError: (err) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  const handleRunValidation = useCallback(async () => {
    setIsRunning(true); setResults([]); setSummary(null); setSelectedIds(new Set());
    try {
      const params = new URLSearchParams({ input: JSON.stringify({ json: { limit: batchLimit, onlyWithQid, familyFilter: familyFilter || undefined } }) });
      const resp = await fetch(`/api/trpc/moleculesQid.batchValidateQids?${params.toString()}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json() as { result?: { data?: { json?: { results: ValidationResult[]; summary: BatchSummary } } } };
      const payload = data?.result?.data?.json;
      if (!payload) throw new Error("Réponse invalide");
      setResults(payload.results); setSummary(payload.summary);
      toast({ title: "Validation terminée", description: `${payload.summary.total} analysées — ${payload.summary.wrongQid} incorrects, ${payload.summary.missingQid} manquants.` });
    } catch (err) {
      toast({ title: "Erreur", description: String(err), variant: "destructive" });
    } finally { setIsRunning(false); }
  }, [batchLimit, onlyWithQid, familyFilter, toast]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(results.filter(r => r.suggestedQid && (r.status === "wrong_qid" || r.status === "missing_qid")).map(r => r.moleculeId)));
  }, [results]);

  const handleApplySelected = useCallback(() => {
    const assignments = results.filter(r => selectedIds.has(r.moleculeId) && r.suggestedQid).map(r => ({ moleculeId: r.moleculeId, qid: r.suggestedQid! }));
    if (!assignments.length) { toast({ title: "Aucune correction", variant: "destructive" }); return; }
    applyBatchMutation.mutate({ assignments });
  }, [results, selectedIds, applyBatchMutation, toast]);

  const handleExportCsv = useCallback(() => {
    if (!results.length) return;
    const header = "id,nom,cas,qid_actuel,statut,qid_suggere,label_suggere,score\n";
    const rows = results.map(r => `${r.moleculeId},"${r.name.replace(/"/g,'""')}",${r.casNumber},${r.currentQid||""},${r.status},${r.suggestedQid||""},${r.suggestedLabel?`"${r.suggestedLabel.replace(/"/g,'""')}"`:""}, ${r.suggestedScore||""}`).join("\n");
    const blob = new Blob([header+rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`qid-validation-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const actionable = results.filter(r => r.status === "wrong_qid" || r.status === "missing_qid");
  const valid = results.filter(r => r.status === "valid");
  const other = results.filter(r => !["wrong_qid","missing_qid","valid"].includes(r.status));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="w-4 h-4" /> Retour à l'administration
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-violet-600" /> Validation QID via CAS
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Vérifie les QIDs Wikidata en les croisant avec les numéros CAS (P231). Détecte les erreurs et propose des corrections automatiques.
              </p>
            </div>
            {results.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                <Download className="w-4 h-4 mr-1.5" /> Exporter CSV
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {coverageStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total molécules", value: coverageStats.total, color: "text-foreground" },
              { label: "Avec QID", value: coverageStats.withQid, color: "text-emerald-600" },
              { label: "Sans QID", value: coverageStats.withoutQid, color: "text-amber-600" },
              { label: "Couverture", value: `${coverageStats.coveragePercent}%`, color: "text-violet-600" },
            ].map(s => (
              <Card key={s.label} className="p-3">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Paramètres de validation</CardTitle>
            <CardDescription>Interroge Wikidata SPARQL pour vérifier la propriété P231 (CAS) de chaque QID. ~350ms/molécule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nombre de molécules</label>
                <Select value={String(batchLimit)} onValueChange={v => setBatchLimit(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 molécules (~4s)</SelectItem>
                    <SelectItem value="20">20 molécules (~7s)</SelectItem>
                    <SelectItem value="30">30 molécules (~11s)</SelectItem>
                    <SelectItem value="50">50 molécules (~18s)</SelectItem>
                    <SelectItem value="100">100 molécules (~35s)</SelectItem>
                    <SelectItem value="200">200 molécules (~70s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Mode</label>
                <Select value={onlyWithQid ? "with" : "without"} onValueChange={v => setOnlyWithQid(v === "with")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with">Vérifier QIDs existants</SelectItem>
                    <SelectItem value="without">Chercher QIDs manquants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Famille (optionnel)</label>
                <Select value={familyFilter || "_all"} onValueChange={v => setFamilyFilter(v === "_all" ? undefined : v)}>
                  <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Toutes les familles</SelectItem>
                    <SelectItem value="Terpènes">Terpènes</SelectItem>
                    <SelectItem value="Esters">Esters</SelectItem>
                    <SelectItem value="Aldéhydes">Aldéhydes</SelectItem>
                    <SelectItem value="Alcools">Alcools</SelectItem>
                    <SelectItem value="Cétones">Cétones</SelectItem>
                    <SelectItem value="Phénols">Phénols</SelectItem>
                    <SelectItem value="Lactones">Lactones</SelectItem>
                    <SelectItem value="Muscs">Muscs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              Durée estimée : <strong className="mx-1">~{Math.ceil(batchLimit * 0.35)}s</strong> pour {batchLimit} molécules.
            </div>
            <Button onClick={handleRunValidation} disabled={isRunning} className="bg-violet-600 hover:bg-violet-700">
              {isRunning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validation en cours…</> : <><Play className="w-4 h-4 mr-2" />Lancer la validation</>}
            </Button>
          </CardContent>
        </Card>

        {summary && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { label: "Valides",        value: summary.valid,         color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "QID incorrect",  value: summary.wrongQid,      color: "text-red-600",     bg: "bg-red-50"     },
              { label: "QID manquant",   value: summary.missingQid,    color: "text-amber-600",   bg: "bg-amber-50"   },
              { label: "Non trouvé",     value: summary.notFound,      color: "text-slate-500",   bg: "bg-slate-50"   },
              { label: "Non vérifiable", value: summary.unverifiable,  color: "text-orange-500",  bg: "bg-orange-50"  },
              { label: "Erreurs",        value: summary.errors,        color: "text-red-400",     bg: "bg-red-50"     },
            ].map(s => (
              <div key={s.label} className={`rounded-lg p-2.5 text-center ${s.bg}`}>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {actionable.length > 0 && (
          <Card className="border-violet-200 bg-violet-50/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-violet-600" />
                  <span className="font-medium">{selectedIds.size} sélectionnée{selectedIds.size !== 1 ? "s" : ""}</span>
                  <span className="text-muted-foreground">sur {actionable.filter(r => r.suggestedQid).length} corrigeables</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>Tout sélectionner</Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>Désélectionner</Button>
                  <Button size="sm" onClick={handleApplySelected} disabled={selectedIds.size === 0 || applyBatchMutation.isPending} className="bg-violet-600 hover:bg-violet-700">
                    {applyBatchMutation.isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Application…</> : <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Appliquer les corrections</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {actionable.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" />À corriger ({actionable.length})</h3>
                <ScrollArea className="h-[340px]">
                  <div className="space-y-1.5 pr-2">{actionable.map(r => <ResultRow key={r.moleculeId} result={r} selected={selectedIds.has(r.moleculeId)} onToggle={toggleSelect} />)}</div>
                </ScrollArea>
              </div>
            )}
            {valid.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" />QIDs valides ({valid.length})</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1.5 pr-2">{valid.map(r => <ResultRow key={r.moleculeId} result={r} selected={false} onToggle={() => {}} />)}</div>
                </ScrollArea>
              </div>
            )}
            {other.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5 text-muted-foreground"><HelpCircle className="w-4 h-4" />Non résolus ({other.length})</h3>
                <ScrollArea className="h-[160px]">
                  <div className="space-y-1.5 pr-2">{other.map(r => <ResultRow key={r.moleculeId} result={r} selected={false} onToggle={() => {}} />)}</div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {!isRunning && results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Lancez la validation pour analyser les QIDs Wikidata de vos molécules.</p>
            <p className="text-xs mt-1 opacity-70">Vérifie la propriété P231 (CAS) sur Wikidata pour chaque QID stocké.</p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-violet-600" />
            <p className="text-sm text-muted-foreground">Validation en cours via Wikidata SPARQL…</p>
            <p className="text-xs text-muted-foreground mt-1">~350ms par molécule pour respecter les rate limits</p>
          </div>
        )}
      </div>
    </div>
  );
}
