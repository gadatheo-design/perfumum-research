import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, DatabaseZap, FileWarning, FlaskConical, Leaf, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CaseStatus = "open" | "reviewed" | "accepted" | "rejected";
type QualityCase = Record<string, any>;

const typeMeta: Record<string, { label: string; icon: typeof FlaskConical; tone: string }> = {
  cas_conflict: { label: "Conflits CAS", icon: FlaskConical, tone: "text-rose-700" },
  descriptor_orphan: { label: "Liens descripteurs orphelins", icon: FileWarning, tone: "text-amber-700" },
  terroir_orphan: { label: "Liens plante–terroir orphelins", icon: Leaf, tone: "text-amber-700" },
  olfactive_profile: { label: "Profils olfactifs", icon: DatabaseZap, tone: "text-violet-700" },
  plant_molecule: { label: "Relations plante–molécule", icon: Leaf, tone: "text-emerald-700" },
  bibliography_duplicate: { label: "DOI bibliographiques", icon: ClipboardCheck, tone: "text-sky-700" },
  bibliography_metadata: { label: "Métadonnées bibliographiques", icon: ClipboardCheck, tone: "text-sky-700" },
};

const statusMeta: Record<CaseStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  open: { label: "À examiner", variant: "outline" },
  reviewed: { label: "En revue", variant: "secondary" },
  accepted: { label: "Accepté pour préparation", variant: "default" },
  rejected: { label: "Écarté", variant: "destructive" },
};

function severityLabel(severity: string) {
  return ({ critical: "Critique", high: "Élevée", medium: "Moyenne", low: "Faible" } as Record<string, string>)[severity] ?? severity;
}

function parseEvidence(value: unknown) {
  if (!value || typeof value !== "string") return null;
  try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; }
}

export default function DataQualityRemediation() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("open");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<QualityCase | null>(null);
  const [decision, setDecision] = useState<Exclude<CaseStatus, "open">>("reviewed");
  const [rationale, setRationale] = useState("");
  const input = useMemo(() => ({
    status: statusFilter === "all" ? undefined : statusFilter,
    caseType: typeFilter === "all" ? undefined : typeFilter as any,
    limit: 150,
  }), [statusFilter, typeFilter]);
  const dashboardQuery = trpc.dataQualityRemediation.getDashboard.useQuery();
  const casesQuery = trpc.dataQualityRemediation.listCases.useQuery(input);
  const actionsQuery = trpc.dataQualityRemediation.listActions.useQuery(
    selected ? { caseId: selected.id } : undefined,
    { enabled: Boolean(selected) },
  );
  const utils = trpc.useUtils();
  const scanMutation = trpc.dataQualityRemediation.scan.useMutation({
    onSuccess: (summary) => {
      toast({ title: "File actualisée", description: `${Object.values(summary).reduce((total, count) => total + count, 0)} signaux analysés, sans écriture dans les tables scientifiques.` });
      utils.dataQualityRemediation.getDashboard.invalidate();
      utils.dataQualityRemediation.listCases.invalidate();
    },
    onError: (error) => toast({ title: "Scan non exécuté", description: error.message, variant: "destructive" }),
  });
  const decisionMutation = trpc.dataQualityRemediation.decideCase.useMutation({
    onSuccess: () => {
      toast({ title: "Décision journalisée", description: "La file a été mise à jour. Aucune donnée scientifique de production n’a été modifiée." });
      setSelected(null);
      setRationale("");
      utils.dataQualityRemediation.getDashboard.invalidate();
      utils.dataQualityRemediation.listCases.invalidate();
      utils.dataQualityRemediation.listActions.invalidate();
    },
    onError: (error) => toast({ title: "Décision non enregistrée", description: error.message, variant: "destructive" }),
  });

  const cases = casesQuery.data ?? [];
  const total = dashboardQuery.data?.cases.reduce((sum, entry) => sum + entry.count, 0) ?? 0;
  const open = dashboardQuery.data?.cases.filter((entry) => entry.status === "open").reduce((sum, entry) => sum + entry.count, 0) ?? 0;
  const reviewed = dashboardQuery.data?.cases.filter((entry) => entry.status === "reviewed").reduce((sum, entry) => sum + entry.count, 0) ?? 0;
  const selectedMeta = selected ? typeMeta[selected.case_type] : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-amber-700">Contrôle de qualité · revue humaine obligatoire</p>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight"><ShieldCheck className="h-7 w-7 text-amber-700" />Cockpit de remédiation des données</h1>
          <p className="mt-2 max-w-4xl text-sm text-muted-foreground">Cette file centralise les signaux issus de l’audit. Chaque cas expose ses preuves et sa proposition ; ni fusion CAS, ni suppression, ni enrichissement scientifique ne sont exécutés depuis cette page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => { dashboardQuery.refetch(); casesQuery.refetch(); }}><RefreshCw className="h-4 w-4" />Actualiser</Button>
          <Button className="gap-2" onClick={() => scanMutation.mutate()} disabled={scanMutation.isPending}><DatabaseZap className="h-4 w-4" />{scanMutation.isPending ? "Analyse en cours…" : "Actualiser la file"}</Button>
        </div>
      </header>

      <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-950 dark:bg-amber-950/10">
        <CardContent className="flex gap-3 pt-6 text-sm"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><p><strong>Portée contrôlée :</strong> accepter un cas signifie seulement le retenir pour une future prévisualisation d’application. Toute modification de relation, profil, référence ou molécule exige un mécanisme séparé, une confirmation explicite et un journal d’audit supplémentaire.</p></CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Cas enregistrés", total, ClipboardCheck, "text-slate-700"],
          ["À examiner", open, AlertTriangle, "text-amber-700"],
          ["En revue", reviewed, ShieldCheck, "text-indigo-700"],
          ["Décisions journalisées", dashboardQuery.data?.actionCount ?? 0, CheckCircle2, "text-emerald-700"],
        ].map(([label, value, Icon, tone]) => <Card key={String(label)}><CardContent className="flex items-center justify-between pt-6"><div><p className="text-sm text-muted-foreground">{String(label)}</p><p className="mt-1 text-2xl font-semibold">{Number(value)}</p></div><Icon className={`h-7 w-7 ${tone}`} /></CardContent></Card>)}
      </section>

      <Card>
        <CardHeader className="gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div><CardTitle className="text-lg">File de preuves et propositions</CardTitle><CardDescription>Les cartes sont volontairement séparées des opérations d’application afin de préserver la réversibilité et l’attribution des décisions.</CardDescription></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[480px]">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CaseStatus | "all")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusMeta).map(([value, meta]) => <SelectItem key={value} value={value}>{meta.label}</SelectItem>)}</SelectContent></Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les domaines</SelectItem>{Object.entries(typeMeta).map(([value, meta]) => <SelectItem key={value} value={value}>{meta.label}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardHeader>
        <CardContent>
          {casesQuery.isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : casesQuery.error ? <div className="rounded-lg border border-destructive/40 p-5 text-sm text-destructive">La file ne peut être lue. Vérifiez que votre session possède le rôle administrateur.</div> : cases.length === 0 ? <div className="rounded-lg border border-dashed p-10 text-center"><ClipboardCheck className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">Aucun cas avec ces filtres</p><p className="mt-1 text-sm text-muted-foreground">Lancez l’actualisation pour créer ou mettre à jour les cas à partir de l’audit, sans modifier les données de recherche.</p></div> : <div className="divide-y rounded-lg border">{cases.map((qualityCase: any) => {
            const meta = typeMeta[qualityCase.case_type] ?? { label: qualityCase.case_type, icon: FileWarning, tone: "text-slate-700" };
            const Icon = meta.icon;
            const status = statusMeta[qualityCase.status as CaseStatus] ?? statusMeta.open;
            return <button key={qualityCase.id} className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between" onClick={() => { setSelected(qualityCase); setDecision(qualityCase.status === "open" ? "reviewed" : qualityCase.status); setRationale(""); }}>
              <div className="flex min-w-0 gap-3"><Icon className={`mt-0.5 h-5 w-5 shrink-0 ${meta.tone}`} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{qualityCase.title}</p><Badge variant="outline">{severityLabel(qualityCase.severity)}</Badge></div><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{qualityCase.proposed_value ?? qualityCase.current_value ?? "Aucune proposition textuelle"}</p></div></div>
              <Badge variant={status.variant} className="shrink-0">{status.label}</Badge>
            </button>;
          })}</div>}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(isOpen) => { if (!isOpen) setSelected(null); }}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2">{selectedMeta && <selectedMeta.icon className={`h-5 w-5 ${selectedMeta.tone}`} />}{selected?.title}</DialogTitle><DialogDescription>Cas #{selected?.id} · groupe immuable <code className="rounded bg-muted px-1 py-0.5">{selected?.group_key}</code></DialogDescription></DialogHeader>
          {selected && <div className="space-y-5">
            <div className="grid gap-3 text-sm sm:grid-cols-3"><div><p className="text-xs font-medium uppercase text-muted-foreground">Domaine</p><p className="mt-1">{selectedMeta?.label ?? selected.case_type}</p></div><div><p className="text-xs font-medium uppercase text-muted-foreground">Gravité</p><p className="mt-1">{severityLabel(selected.severity)}</p></div><div><p className="text-xs font-medium uppercase text-muted-foreground">État</p><Badge className="mt-1" variant={(statusMeta[selected.status as CaseStatus] ?? statusMeta.open).variant}>{(statusMeta[selected.status as CaseStatus] ?? statusMeta.open).label}</Badge></div></div>
            <div className="grid gap-4 md:grid-cols-2"><section><h3 className="text-sm font-semibold">Valeur ou constat actuel</h3><pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/25 p-3 text-xs">{selected.current_value ?? "—"}</pre></section><section><h3 className="text-sm font-semibold">Proposition à examiner</h3><pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/25 p-3 text-xs">{selected.proposed_value ?? "—"}</pre></section></div>
            <section><h3 className="text-sm font-semibold">Éléments de preuve</h3><pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/25 p-3 text-xs">{parseEvidence(selected.evidence) ?? "Aucune preuve sérialisée."}</pre></section>
            <section className="rounded-lg border bg-muted/15 p-4"><h3 className="text-sm font-semibold">Décision de revue</h3><p className="mt-1 text-xs text-muted-foreground">Cette décision est append-only. Elle n’applique aucune correction dans les tables scientifiques.</p><div className="mt-3 grid gap-3 sm:grid-cols-[220px_1fr]"><Select value={decision} onValueChange={(value) => setDecision(value as Exclude<CaseStatus, "open">)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="reviewed">Marquer en revue</SelectItem><SelectItem value="accepted">Accepter pour préparation</SelectItem><SelectItem value="rejected">Écarter</SelectItem></SelectContent></Select><Textarea value={rationale} onChange={(event) => setRationale(event.target.value)} placeholder="Justification, sources à vérifier, réserves…" rows={3} /></div></section>
            <section><h3 className="text-sm font-semibold">Historique de revue</h3>{actionsQuery.isLoading ? <Loader2 className="mt-3 h-4 w-4 animate-spin" /> : (actionsQuery.data?.length ?? 0) === 0 ? <p className="mt-2 text-sm text-muted-foreground">Aucune décision enregistrée pour ce cas.</p> : <div className="mt-2 space-y-2">{actionsQuery.data?.map((action: any) => <div key={action.id} className="rounded-md border p-3 text-xs"><div className="flex flex-wrap justify-between gap-2"><strong>{statusMeta[action.decision as CaseStatus]?.label ?? action.decision}</strong><span className="text-muted-foreground">{action.actor_name ?? `Utilisateur ${action.actor_user_id ?? "inconnu"}`} · {action.created_at ? new Date(action.created_at).toLocaleString("fr-FR") : "date inconnue"}</span></div>{action.rationale && <p className="mt-1 text-muted-foreground">{action.rationale}</p>}</div>)}</div>}</section>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setSelected(null)} disabled={decisionMutation.isPending}>Fermer</Button><Button disabled={decisionMutation.isPending || !rationale.trim()} onClick={() => selected && decisionMutation.mutate({ caseId: selected.id, decision, rationale: rationale.trim() })} className="gap-2">{decisionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : decision === "rejected" ? <XCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}Journaliser la décision</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
