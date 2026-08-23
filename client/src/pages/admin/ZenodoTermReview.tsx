import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenCheck, BrainCircuit, CheckCircle2, CircleHelp, ExternalLink, Languages, Loader2, Microscope, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ReviewerRole = "linguistic" | "domain";
type Decision = "accepted" | "accepted_with_context" | "needs_research" | "rejected";

const decisionOptions: Array<{ value: Decision; label: string; hint: string }> = [
  { value: "accepted", label: "Accepter", hint: "Conforme sans réserve." },
  { value: "accepted_with_context", label: "Accepter avec contexte", hint: "Conserver avec une note culturelle ou sémantique." },
  { value: "needs_research", label: "Recherche complémentaire", hint: "Sources ou comparaison supplémentaires nécessaires." },
  { value: "rejected", label: "Rejeter", hint: "Ne pas retenir dans le pilote." },
];

function statusLabel(status: string) {
  return ({
    proposed: "Proposé",
    preannotated: "Pré-annoté",
    under_review: "En revue",
    accepted: "Accepté",
    accepted_with_context: "Accepté avec contexte",
    needs_research: "À documenter",
    rejected: "Rejeté",
  } as Record<string, string>)[status] ?? status;
}

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (status === "accepted") return "default";
  if (status === "rejected") return "destructive";
  if (status === "under_review" || status === "needs_research") return "secondary";
  return "outline";
}

function DecisionPanel({ proposal, role, onSubmit, pending }: { proposal: any; role: ReviewerRole; onSubmit: (decision: Decision, notes: string) => void; pending: boolean }) {
  const [decision, setDecision] = useState<Decision>("accepted");
  const [notes, setNotes] = useState("");
  const previous = proposal.reviews.find((review: any) => review.reviewerRole === role);
  const title = role === "linguistic" ? "Revue linguistique" : "Revue domaine";

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">{role === "linguistic" ? <Languages className="h-4 w-4 text-indigo-600" /> : <Microscope className="h-4 w-4 text-emerald-600" />}{title}</h3>
        {previous && <Badge variant="outline" className="text-xs">Dernière décision : {statusLabel(previous.decision)}</Badge>}
      </div>
      <Select value={decision} onValueChange={(value) => setDecision(value as Decision)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {decisionOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{decisionOptions.find((option) => option.value === decision)?.hint}</p>
      <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Justification, nuance culturelle ou source à consulter…" rows={3} />
      <Button className="w-full gap-2" size="sm" disabled={pending} onClick={() => onSubmit(decision, notes)}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}Enregistrer la décision
      </Button>
    </div>
  );
}

export default function ZenodoTermReview() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const overviewQuery = trpc.zenodoOlfactoryPilot.getOverview.useQuery();
  const proposalsQuery = trpc.zenodoOlfactoryPilot.listProposals.useQuery({});
  const submitReview = trpc.zenodoOlfactoryPilot.submitReview.useMutation({
    onSuccess: (result) => {
      toast({ title: "Décision enregistrée", description: `Statut de la proposition : ${statusLabel(result.status)}.` });
      overviewQuery.refetch();
      proposalsQuery.refetch();
    },
    onError: (error) => toast({ title: "Décision non enregistrée", description: error.message, variant: "destructive" }),
  });

  const proposals = useMemo(() => (proposalsQuery.data ?? []).filter((proposal: any) => {
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    const searchable = [proposal.termOriginal, proposal.englishGlossSource, proposal.frenchGlossProposed, proposal.pinyin].filter(Boolean).join(" ").toLowerCase();
    return matchesStatus && searchable.includes(search.trim().toLowerCase());
  }), [proposalsQuery.data, search, statusFilter]);
  const overview = overviewQuery.data;
  const reviewed = (overview?.accepted ?? 0) + (overview?.acceptedWithContext ?? 0) + (overview?.needsResearch ?? 0) + (overview?.rejected ?? 0);
  const progress = overview?.total ? Math.round((reviewed / overview.total) * 100) : 0;

  if (overviewQuery.isLoading || proposalsQuery.isLoading) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (overviewQuery.error || proposalsQuery.error) return <Card className="border-destructive/40"><CardContent className="flex gap-3 pt-6 text-destructive"><CircleHelp className="h-5 w-5 shrink-0" /><p>La revue Zenodo requiert un compte administrateur et les tables de transit du pilote.</p></CardContent></Card>;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">Pilote contrôlé · CC BY 4.0</p>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight"><BookOpenCheck className="h-7 w-7 text-indigo-600" />Revue humaine des termes Zenodo</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Chaque terme reste en transit : une double décision linguistique et scientifique est nécessaire avant toute proposition d’intégration dans les données de recherche.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => { overviewQuery.refetch(); proposalsQuery.refetch(); }}><RefreshCw className="h-4 w-4" />Actualiser</Button>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Progression du pilote</CardTitle><CardDescription>Les termes validés ne sont pas intégrés automatiquement dans les descripteurs de production.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm"><span>{reviewed} / {overview?.total ?? 0} décisions consolidées</span><strong>{progress} %</strong></div>
          <Progress value={progress} />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {[["Proposés", overview?.proposed], ["Pré-annotés", overview?.preannotated], ["En revue", overview?.underReview], ["Acceptés", overview?.accepted], ["Avec contexte", overview?.acceptedWithContext], ["À documenter", overview?.needsResearch], ["Rejetés", overview?.rejected]].map(([label, value]) => <div key={String(label)} className="rounded-md border bg-muted/20 px-3 py-2"><p className="text-xs text-muted-foreground">{label}</p><p className="text-lg font-semibold">{Number(value ?? 0)}</p></div>)}
          </div>
        </CardContent>
      </Card>

      {overview?.total === 0 ? <Card className="border-dashed"><CardContent className="py-12 text-center"><BrainCircuit className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-3 font-semibold">Aucune proposition encore en transit</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Le fichier pilote est prêt. Lancez la mise en transit contrôlée avec <code className="rounded bg-muted px-1 py-0.5">pnpm pilot:zenodo:stage</code> ; cette étape alimente uniquement les tables de revue, jamais les descripteurs de production.</p></CardContent></Card> : <>
        <div className="flex flex-col gap-3 sm:flex-row"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un terme, pinyin, gloss anglais ou français…" /><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{["proposed", "preannotated", "under_review", "accepted", "accepted_with_context", "needs_research", "rejected"].map((status) => <SelectItem key={status} value={status}>{statusLabel(status)}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-4">{proposals.map((proposal: any) => <Card key={proposal.id}><CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle className="flex flex-wrap items-center gap-2 text-lg"><span lang="zh">{proposal.termOriginal}</span><Badge variant={statusVariant(proposal.status)}>{statusLabel(proposal.status)}</Badge></CardTitle><CardDescription className="mt-1">{proposal.pinyin && `${proposal.pinyin} · `}{proposal.englishGlossSource || "Gloss anglais absent"}</CardDescription></div><a href={proposal.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">Zenodo <ExternalLink className="h-3 w-3" /></a></CardHeader><CardContent className="space-y-5">
          <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs font-medium uppercase text-muted-foreground">Gloss français proposé</p><p className="mt-1">{proposal.frenchGlossProposed || "À proposer"}</p></div><div><p className="text-xs font-medium uppercase text-muted-foreground">Catégorie source</p><p className="mt-1">{proposal.sourceCategory || "Non renseignée"}</p></div><div><p className="text-xs font-medium uppercase text-muted-foreground">OAI / OSI</p><p className="mt-1">{proposal.oai ?? "—"} / {proposal.osi ?? "—"}</p></div><div><p className="text-xs font-medium uppercase text-muted-foreground">Candidat PERFUMUM</p><p className="mt-1">{proposal.canonicalDescriptorCandidate || "Aucun"}</p></div></div>
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3 text-sm dark:border-indigo-900 dark:bg-indigo-950/20"><p className="font-medium text-indigo-950 dark:text-indigo-100">Pré-annotation LLM</p><p className="mt-1 text-muted-foreground">{proposal.llmRationale || "Aucune pré-annotation : l’évaluation humaine reste entièrement ouverte."}</p>{proposal.confidence && <Badge variant="outline" className="mt-2">Confiance : {proposal.confidence}</Badge>}</div>
          <div className="grid gap-4 lg:grid-cols-2"><DecisionPanel proposal={proposal} role="linguistic" pending={submitReview.isPending} onSubmit={(decision, notes) => submitReview.mutate({ proposalId: proposal.id, reviewerRole: "linguistic", decision, notes })} /><DecisionPanel proposal={proposal} role="domain" pending={submitReview.isPending} onSubmit={(decision, notes) => submitReview.mutate({ proposalId: proposal.id, reviewerRole: "domain", decision, notes })} /></div>
          {proposal.reviews.length > 0 && <div className="border-t pt-3"><p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Historique de revue</p><div className="space-y-2">{proposal.reviews.map((review: any) => <div key={review.id} className="flex flex-col gap-1 rounded-md bg-muted/30 p-2 text-xs sm:flex-row sm:items-center sm:justify-between"><span><strong>{review.reviewerRole === "linguistic" ? "Linguistique" : "Domaine"}</strong> · {statusLabel(review.decision)}{review.notes ? ` — ${review.notes}` : ""}</span><span className="text-muted-foreground">{review.reviewerName || `Utilisateur ${review.reviewerUserId}`}</span></div>)}</div></div>}
        </CardContent></Card>)}</div>
      </>}
    </div>
  );
}
