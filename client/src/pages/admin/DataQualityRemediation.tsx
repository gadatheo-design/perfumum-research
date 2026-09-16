import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, ClipboardCheck, DatabaseZap, Download, FileWarning, FlaskConical, Leaf, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
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
  const [typeFilter, setTypeFilter] = useState<string>("bibliography_duplicate");
  const [selected, setSelected] = useState<QualityCase | null>(null);
  const [decision, setDecision] = useState<Exclude<CaseStatus, "open">>("reviewed");
  const [rationale, setRationale] = useState("");
  const input = useMemo(() => ({
    status: statusFilter === "all" ? undefined : statusFilter,
    caseType: typeFilter === "all" ? undefined : typeFilter as any,
    limit: 500,
  }), [statusFilter, typeFilter]);
  const dashboardQuery = trpc.dataQualityRemediation.getDashboard.useQuery();
  const casesQuery = trpc.dataQualityRemediation.listCases.useQuery(input);
  const intermediateCasQuery = trpc.dataQualityRemediation.previewIntermediateConfidenceCas.useQuery();
  const liveOrphansQuery = trpc.dataQualityRemediation.getLiveOrphanAudit.useQuery();
  const sourcedProfilesQuery = trpc.dataQualityRemediation.previewSourcedOlfactoryProfiles.useQuery();
  const sourcedPlantMoleculeQuery = trpc.dataQualityRemediation.previewSourcedPlantMoleculeRelations.useQuery();
  const bibliographyPreviewQuery = trpc.dataQualityRemediation.previewBibliographyNormalization.useQuery();
  const casEvidenceQuery = trpc.dataQualityRemediation.exportCasEvidence.useQuery(undefined, { enabled: false });
  const actionsQuery = trpc.dataQualityRemediation.listActions.useQuery(
    selected ? { caseId: selected.id } : undefined,
    { enabled: Boolean(selected) },
  );
  const casDetailsQuery = trpc.dataQualityRemediation.getCaseDetails.useQuery(
    selected ? { caseId: selected.id } : { caseId: 1 },
    { enabled: selected?.case_type === "cas_conflict" },
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
  const downloadCasEvidence = async () => {
    const result = await casEvidenceQuery.refetch();
    if (result.error || !result.data) {
      toast({ title: "Export indisponible", description: result.error?.message ?? "Le dossier de preuves n’a pas pu être généré.", variant: "destructive" });
      return;
    }
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perfumum-preuves-cas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Dossier de preuves téléchargé", description: `${result.data.caseCount} cas CAS exportés en lecture seule ; aucune molécule n’a été modifiée.` });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-amber-700">Phase 5 active · normalisation bibliographique · revue humaine obligatoire</p>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight"><ShieldCheck className="h-7 w-7 text-amber-700" />Cockpit de remédiation des données</h1>
          <p className="mt-2 max-w-4xl text-sm text-muted-foreground">Cette file centralise les signaux issus de l’audit. Chaque cas expose ses preuves et sa proposition ; ni fusion CAS, ni suppression, ni enrichissement scientifique ne sont exécutés depuis cette page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => { dashboardQuery.refetch(); casesQuery.refetch(); liveOrphansQuery.refetch(); sourcedProfilesQuery.refetch(); sourcedPlantMoleculeQuery.refetch(); bibliographyPreviewQuery.refetch(); }}><RefreshCw className="h-4 w-4" />Actualiser</Button>
          <Button variant="outline" className="gap-2" onClick={downloadCasEvidence} disabled={casEvidenceQuery.isFetching}><Download className="h-4 w-4" />{casEvidenceQuery.isFetching ? "Préparation…" : "Exporter les preuves CAS"}</Button>
          <Button className="gap-2" onClick={() => scanMutation.mutate()} disabled={scanMutation.isPending}><DatabaseZap className="h-4 w-4" />{scanMutation.isPending ? "Analyse en cours…" : "Actualiser la file"}</Button>
        </div>
      </header>

      <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-950 dark:bg-amber-950/10">
        <CardContent className="flex gap-3 pt-6 text-sm"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><p><strong>Portée contrôlée :</strong> accepter un cas signifie seulement le retenir pour une future prévisualisation d’application. Toute modification de relation, profil, référence ou molécule exige un mécanisme séparé, une confirmation explicite et un journal d’audit supplémentaire.</p></CardContent>
      </Card>

      <Card className="border-indigo-200 bg-indigo-50/40 dark:border-indigo-950 dark:bg-indigo-950/10">
        <CardHeader><CardTitle className="text-base">Seconde vague CAS · convergence intermédiaire</CardTitle><CardDescription>Cette prévisualisation ne retient que des groupes avec checksum CAS valide, InChIKey identique et au moins un second identifiant identique, sans divergence parmi les identifiants renseignés. Une lacune subsiste dans chaque groupe : ils ne peuvent pas être acceptés automatiquement.</CardDescription></CardHeader>
        <CardContent>{intermediateCasQuery.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : intermediateCasQuery.error ? <p className="text-sm text-destructive">La prévisualisation intermédiaire ne peut pas être chargée.</p> : (intermediateCasQuery.data?.length ?? 0) === 0 ? <p className="text-sm text-muted-foreground">Aucun candidat intermédiaire ne répond actuellement à ces critères conservateurs.</p> : <div className="space-y-2">{intermediateCasQuery.data?.map((candidate: any) => <div key={candidate.caseId} className="flex flex-col gap-2 rounded-md border bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-sm">{candidate.title}</p><p className="mt-1 text-xs text-muted-foreground">Lacunes : {candidate.qualification.criteria.missingFields.join(", ") || "aucune"} · corroborateurs : {candidate.qualification.criteria.corroborators.join(", ")}</p></div><Badge variant="secondary">Revue humaine requise</Badge></div>)}</div>}</CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/30 dark:border-amber-950 dark:bg-amber-950/10">
        <CardHeader><CardTitle className="text-base">État actuel des liens orphelins</CardTitle><CardDescription>Lecture directe des relations de production au moment du chargement. Ce tableau n’archive, ne supprime et ne réassocie aucun lien.</CardDescription></CardHeader>
        <CardContent>{liveOrphansQuery.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : liveOrphansQuery.error ? <p className="text-sm text-destructive">L’état courant des liens n’a pas pu être chargé.</p> : <div className="space-y-3 text-sm"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-md border bg-background/60 p-3"><p className="text-xs text-muted-foreground">Descripteur → plante</p><p className="mt-1 text-xl font-semibold">{liveOrphansQuery.data?.summary.descriptorPlant ?? 0}</p></div><div className="rounded-md border bg-background/60 p-3"><p className="text-xs text-muted-foreground">Descripteur → molécule</p><p className="mt-1 text-xl font-semibold">{liveOrphansQuery.data?.summary.descriptorMolecule ?? 0}</p></div><div className="rounded-md border bg-background/60 p-3"><p className="text-xs text-muted-foreground">Plante → terroir</p><p className="mt-1 text-xl font-semibold">{liveOrphansQuery.data?.summary.plantTerroir ?? 0}</p></div></div>{(liveOrphansQuery.data?.summary.plantTerroir ?? 0) > 0 && <p className="rounded-md border border-amber-200 bg-background/60 p-3 text-muted-foreground"><strong className="text-foreground">Réassociation bloquée par prudence :</strong> {liveOrphansQuery.data?.summary.plantTerroirWithoutRetainedPlantName} lien(s) plante–terroir ne conservent aucun nom de plante. Ils requièrent une source historique ou une sélection humaine explicite ; aucun rapprochement fondé sur l’ancien identifiant seul ne sera proposé.</p>}<details className="rounded-md border bg-background/60 p-3"><summary className="cursor-pointer font-medium">Voir le contexte conservé des liens plante–terroir ({liveOrphansQuery.data?.plantTerroir.length ?? 0})</summary><div className="mt-3 max-h-64 overflow-auto text-xs"><table className="min-w-[650px] text-left"><thead className="text-muted-foreground"><tr><th className="p-2">Lien</th><th className="p-2">Plante absente</th><th className="p-2">Terroir conservé</th><th className="p-2">Contexte</th></tr></thead><tbody>{liveOrphansQuery.data?.plantTerroir.map((link: any) => <tr key={link.link_id} className="border-t"><td className="p-2 font-mono">{link.link_id}</td><td className="p-2 font-mono">{link.archived_plant_id}</td><td className="p-2">{link.retained_terroir_name ?? `ID ${link.terroir_id}`}</td><td className="p-2">{link.local_name || link.notes || "Aucun nom ni contexte exploitable"}</td></tr>)}</tbody></table></div></details></div>}</CardContent>
      </Card>

      <Card className="border-emerald-200 bg-emerald-50/30 dark:border-emerald-950 dark:bg-emerald-950/10">
        <CardHeader><CardTitle className="text-base">Profils olfactifs disposant d’une provenance</CardTitle><CardDescription>Seules les données Flavornet déjà horodatées dans PERFUMUM sont affichées comme propositions. Aucun profil n’est copié dans la production depuis cette vue.</CardDescription></CardHeader>
        <CardContent>{sourcedProfilesQuery.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : sourcedProfilesQuery.error ? <p className="text-sm text-destructive">Les propositions sourcées n’ont pas pu être chargées.</p> : <div className="space-y-3"><div className="flex flex-wrap gap-3 text-sm"><Badge variant="secondary">{sourcedProfilesQuery.data?.proposalCount ?? 0} proposition(s) sourcée(s)</Badge><Badge variant="outline">{sourcedProfilesQuery.data?.withheld.legacyProfileJsonWithoutProvenance ?? 0} profil(s) historique(s) retenu(s) sans provenance</Badge></div>{sourcedProfilesQuery.data?.proposals.map((proposal: any) => <div key={proposal.molecule.id} className="rounded-md border bg-background/70 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-medium">{proposal.molecule.name} <span className="font-normal text-muted-foreground">· CAS {proposal.molecule.casNumber ?? "absent"}</span></p><p className="mt-1 text-sm">Proposition : <strong>{proposal.proposedProfile.join(" · ") || "termes à relire"}</strong></p></div><Badge variant="secondary">Revue requise</Badge></div><p className="mt-2 text-xs text-muted-foreground">{proposal.evidence.caveat}</p><a className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-2" href={proposal.evidence.sourceUrl} target="_blank" rel="noreferrer">Consulter la source Flavornet</a></div>)}</div>}</CardContent>
      </Card>

      <Card className="border-sky-200 bg-sky-50/30 dark:border-sky-950 dark:bg-sky-950/10">
        <CardHeader><CardTitle className="text-base">Relations plante–molécule disposant d’une preuve GC-MS</CardTitle><CardDescription>Le lot associe uniquement une source vérifiée, une plante locale compatible et une molécule retrouvée par CAS unique. Les plages sont propres à l’échantillon étudié ; elles ne sont pas des constantes taxonomiques.</CardDescription></CardHeader>
        <CardContent>{sourcedPlantMoleculeQuery.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : sourcedPlantMoleculeQuery.error ? <p className="text-sm text-destructive">Les relations sourcées n’ont pas pu être chargées.</p> : <div className="space-y-3"><div className="flex flex-wrap gap-3 text-sm"><Badge variant="secondary">{sourcedPlantMoleculeQuery.data?.proposalCount ?? 0} proposition(s) GC-MS</Badge><Badge variant="outline">{sourcedPlantMoleculeQuery.data?.withheld.length ?? 0} retenue(s) par prudence</Badge></div>{sourcedPlantMoleculeQuery.data?.proposals.map((proposal: any) => <article key={`${proposal.plant.id}-${proposal.molecule.id}`} className="rounded-md border bg-background/70 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-medium">{proposal.plant.name} <span className="font-normal text-muted-foreground">· {proposal.plant.latinName}</span></p><p className="mt-1 text-sm"><strong>{proposal.molecule.name}</strong> · CAS {proposal.molecule.casNumber} · {proposal.range.min.toFixed(2)}–{proposal.range.max.toFixed(2)} {proposal.range.unit}</p></div><Badge variant="secondary">{proposal.evidence.evidenceLevel}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{proposal.evidence.sampleContext} {proposal.evidence.caveat}</p><a className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-2" href={proposal.evidence.sourceUrl} target="_blank" rel="noreferrer">{proposal.evidence.sourceCitation}</a></article>)}<details className="rounded-md border bg-background/60 p-3 text-sm"><summary className="cursor-pointer font-medium">Voir les relations retenues hors proposition</summary><ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">{sourcedPlantMoleculeQuery.data?.withheld.map((reason: string, index: number) => <li key={index}>{reason}</li>)}</ul></details></div>}</CardContent>
      </Card>

      <Card className="border-sky-200 bg-sky-50/30 dark:border-sky-950 dark:bg-sky-950/10">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4" />Normalisation bibliographique à prévisualiser</CardTitle><CardDescription>Les DOI sont comparés en minuscules sans espaces périphériques, tandis que les groupes identiques et les lacunes restent à examiner. Aucune notice n’est corrigée, fusionnée ou supprimée.</CardDescription></CardHeader>
        <CardContent>{bibliographyPreviewQuery.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : bibliographyPreviewQuery.error ? <p className="text-sm text-destructive">La prévisualisation bibliographique n’a pas pu être chargée.</p> : <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Notices", bibliographyPreviewQuery.data?.summary.totalEntries], ["DOI à normaliser", bibliographyPreviewQuery.data?.summary.doiRequiresLowerTrim], ["Groupes DOI à comparer", bibliographyPreviewQuery.data?.duplicateGroups.length], ["DOI absents (conservés)", bibliographyPreviewQuery.data?.summary.missingDoi]].map(([label, value]) => <div key={String(label)} className="rounded-md border bg-background/60 p-3"><p className="text-xs text-muted-foreground">{String(label)}</p><p className="mt-1 text-xl font-semibold">{Number(value ?? 0)}</p></div>)}</div><details className="rounded-md border bg-background/60 p-3 text-sm"><summary className="cursor-pointer font-medium">Voir les DOI dont seule la forme diffère ({bibliographyPreviewQuery.data?.doiNormalizations.length ?? 0})</summary><div className="mt-3 max-h-56 overflow-auto text-xs">{bibliographyPreviewQuery.data?.doiNormalizations.map((item: any) => <div key={item.id} className="border-t py-2 first:border-t-0"><p className="font-medium">#{item.id} · {item.title}</p><p className="mt-1 font-mono text-muted-foreground">{item.currentDoi} → {item.proposedDoi}</p></div>)}</div></details><details className="rounded-md border bg-background/60 p-3 text-sm"><summary className="cursor-pointer font-medium">Voir les groupes DOI candidats ({bibliographyPreviewQuery.data?.duplicateGroups.length ?? 0})</summary><div className="mt-3 space-y-3">{bibliographyPreviewQuery.data?.duplicateGroups.slice(0, 10).map((group: any) => <div key={group.normalizedDoi} className="rounded-md border p-3"><p className="font-mono text-xs">{group.normalizedDoi} · {group.recordCount} notices</p><ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">{group.records.map((record: any) => <li key={record.id}>#{record.id} · {record.title || "sans titre"} · {record.year ?? "année absente"}</li>)}</ul><p className="mt-2 text-xs text-muted-foreground">{group.limitation}</p></div>)}</div></details><p className="text-xs text-muted-foreground">Échantillon de lacunes : {bibliographyPreviewQuery.data?.metadataSamples.length ?? 0} notices affichées sur les auteurs, années, résumés ou mots-clés absents. Les sources sans DOI restent valides dans le corpus.</p></div>}</CardContent>
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
          <div><CardTitle className="text-lg">File de preuves et propositions</CardTitle><CardDescription>La phase active porte sur la prévisualisation bibliographique. Les CAS intermédiaires, liens historiques, profils non publiés et relations GC-MS restent en revue ; les autres domaines sont disponibles en lecture uniquement.</CardDescription></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[480px]">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CaseStatus | "all")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusMeta).map(([value, meta]) => <SelectItem key={value} value={value}>{meta.label}</SelectItem>)}</SelectContent></Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Vue transversale (lecture)</SelectItem>{Object.entries(typeMeta).map(([value, meta]) => <SelectItem key={value} value={value}>{meta.label}{value === "bibliography_duplicate" ? " · phase active" : " · phase ultérieure"}</SelectItem>)}</SelectContent></Select>
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
            {selected.case_type === "cas_conflict" && <section className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-950 dark:bg-rose-950/10"><h3 className="text-sm font-semibold text-rose-950 dark:text-rose-100">Comparaison structurelle des enregistrements</h3><p className="mt-1 text-xs text-muted-foreground">Les écarts ci-dessous servent à qualifier le cas. Ils n’autorisent pas une fusion automatique.</p>{casDetailsQuery.isLoading ? <Loader2 className="mt-4 h-4 w-4 animate-spin" /> : casDetailsQuery.data?.comparison ? <><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Enregistrements", casDetailsQuery.data.comparison.recordCount], ["InChIKey distincts", casDetailsQuery.data.comparison.distinctInchiKeys], ["CID PubChem distincts", casDetailsQuery.data.comparison.distinctPubchemCids], ["Formules distinctes", casDetailsQuery.data.comparison.distinctFormulas]].map(([label, value]) => <div key={String(label)} className="rounded-md border bg-background/70 p-2"><p className="text-[11px] text-muted-foreground">{String(label)}</p><p className="text-lg font-semibold">{Number(value)}</p></div>)}</div><div className="mt-3 overflow-x-auto rounded-md border bg-background/70"><table className="min-w-[760px] text-left text-xs"><thead className="bg-muted/60 text-muted-foreground"><tr><th className="px-3 py-2">ID</th><th className="px-3 py-2">Nom</th><th className="px-3 py-2">InChIKey</th><th className="px-3 py-2">PubChem</th><th className="px-3 py-2">Formule</th><th className="px-3 py-2">Wikidata</th></tr></thead><tbody>{casDetailsQuery.data.records.map((record: any) => <tr key={record.id} className="border-t align-top"><td className="px-3 py-2 font-mono">{record.id}</td><td className="max-w-56 px-3 py-2 font-medium">{record.name}</td><td className="px-3 py-2 font-mono">{record.inchi_key || "—"}</td><td className="px-3 py-2">{record.pubchem_cid || "—"}</td><td className="px-3 py-2">{record.formula || "—"}</td><td className="px-3 py-2">{record.wikidata_qid || "—"}</td></tr>)}</tbody></table></div></> : <p className="mt-3 text-sm text-muted-foreground">Les détails structuraux ne sont pas disponibles.</p>}</section>}
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
