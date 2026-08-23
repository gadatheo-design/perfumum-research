import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpenCheck, ExternalLink, Languages, Link2, Loader2, Search, Sparkles } from "lucide-react";

function statusLabel(status: string) {
  return ({ proposed: "Proposé", preannotated: "Pré-annoté", under_review: "En revue", accepted: "Accepté", accepted_with_context: "Accepté avec contexte", needs_research: "À documenter", rejected: "Rejeté", finalized_transit: "Transit final" } as Record<string, string>)[status] ?? status;
}

function confidenceVariant(confidence: string): "default" | "secondary" | "outline" {
  return confidence === "élevée" ? "default" : confidence === "moyenne" ? "secondary" : "outline";
}

export default function ZenodoTermComparator() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const overviewQuery = trpc.zenodoTermComparator.getOverview.useQuery({});
  const comparisonsQuery = trpc.zenodoTermComparator.listComparisons.useQuery({ search: search.trim() || undefined, status: status === "all" ? undefined : status });
  const comparisons = comparisonsQuery.data ?? [];
  const selected = useMemo(() => comparisons.find((comparison: any) => comparison.id === selectedId) ?? comparisons[0] ?? null, [comparisons, selectedId]);

  return <div className="container max-w-7xl space-y-6 py-6 sm:py-8">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary"><Languages className="h-4 w-4" />Pilote Zenodo · comparaison sémantique</div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Comparateur terminologique multilingue</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">Confrontez le terme source, le pinyin, les glosses et la proposition française aux descripteurs olfactifs PERFUMUM. Les scores sont explicables et n’écrivent aucune donnée scientifique.</p>
      </div>
      <a href="/admin/zenodo-term-review"><Button variant="outline" className="gap-2"><BookOpenCheck className="h-4 w-4" />Revue humaine</Button></a>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Propositions Zenodo</p><p className="mt-1 text-2xl font-semibold">{overviewQuery.data?.proposalCount ?? "—"}</p></CardContent></Card>
      <Card><CardContent className="pt-5"><p className="text-xs text-muted-foreground">Descripteurs PERFUMUM comparés</p><p className="mt-1 text-2xl font-semibold">{overviewQuery.data?.descriptorCount ?? "—"}</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="grid gap-3 pt-5 md:grid-cols-[1fr_220px]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Chercher un terme source, un pinyin ou un gloss…" /></div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue placeholder="Tous les états" /></SelectTrigger><SelectContent><SelectItem value="all">Tous les états</SelectItem><SelectItem value="proposed">Proposés</SelectItem><SelectItem value="under_review">En revue</SelectItem><SelectItem value="accepted">Acceptés</SelectItem><SelectItem value="accepted_with_context">Acceptés avec contexte</SelectItem><SelectItem value="finalized_transit">Transit final</SelectItem></SelectContent></Select>
      </CardContent>
    </Card>

    {comparisonsQuery.isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div> : comparisonsQuery.error ? <Card className="border-destructive"><CardContent className="py-8 text-sm text-destructive">Le comparateur n’est accessible qu’aux administrateurs : {comparisonsQuery.error.message}</CardContent></Card> : <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
      <Card className="min-w-0"><CardHeader><CardTitle className="text-base">Termes à comparer</CardTitle><CardDescription>{comparisons.length} résultat(s) correspondant aux filtres.</CardDescription></CardHeader><CardContent className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">{comparisons.map((comparison: any) => <button key={comparison.id} type="button" onClick={() => setSelectedId(comparison.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${selected?.id === comparison.id ? "border-primary bg-primary/5" : "hover:bg-muted/60"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-medium" lang="zh">{comparison.termOriginal}</p><p className="text-xs text-muted-foreground">{comparison.pinyin || "pinyin non renseigné"}</p></div><Badge variant="outline">{statusLabel(comparison.status)}</Badge></div><p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{comparison.frenchGlossProposed || comparison.englishGlossSource || "Sans gloss proposé"}</p></button>)}</CardContent></Card>
      <Card className="min-w-0"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Link2 className="h-4 w-4 text-primary" />Contexte comparatif</CardTitle><CardDescription>Les suggestions sont des appuis à la décision éditoriale, jamais une validation automatique.</CardDescription></CardHeader><CardContent>{selected ? <div className="space-y-6">
        <section className="grid gap-4 rounded-lg bg-muted/35 p-4 sm:grid-cols-2"><div><Label className="text-xs text-muted-foreground">Terme source</Label><p className="mt-1 text-lg font-semibold" lang="zh">{selected.termOriginal}</p><p className="text-sm" lang="zh-Latn">{selected.pinyin || "—"}</p></div><div><Label className="text-xs text-muted-foreground">État et catégorie</Label><div className="mt-1 flex flex-wrap gap-2"><Badge variant="outline">{statusLabel(selected.status)}</Badge><Badge variant="outline">{selected.sourceCategory}</Badge></div></div><div><Label className="text-xs text-muted-foreground">Gloss source anglais</Label><p className="mt-1 text-sm">{selected.englishGlossSource || "—"}</p></div><div><Label className="text-xs text-muted-foreground">Proposition française</Label><p className="mt-1 text-sm font-medium">{selected.frenchGlossProposed || "—"}</p><p className="mt-1 text-xs text-muted-foreground">Candidat LLM : {selected.canonicalDescriptorCandidate || "aucun"}</p></div></section>
        <section className="space-y-3"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /><h2 className="font-semibold">Descripteurs PERFUMUM proches</h2></div>{selected.suggestions.map((suggestion: any) => <div key={suggestion.descriptorId} className="rounded-lg border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{suggestion.name}</p><p className="text-xs text-muted-foreground">{suggestion.descriptorId}{suggestion.category ? ` · ${suggestion.category}` : ""}</p></div><div className="flex items-center gap-2"><Badge variant={confidenceVariant(suggestion.confidence)}>{suggestion.confidence}</Badge><span className="text-sm font-semibold">{suggestion.score}/100</span></div></div>{suggestion.description && <p className="mt-2 text-sm text-muted-foreground">{suggestion.description}</p>}<ul className="mt-3 space-y-1 text-xs text-muted-foreground">{suggestion.reasons.map((reason: string) => <li key={reason}>• {reason}</li>)}</ul></div>)}</section>
        <section className="space-y-3"><h2 className="font-semibold">Historique des décisions</h2>{selected.reviews.length ? <div className="space-y-2">{selected.reviews.map((review: any) => <div key={review.id} className="rounded-lg border p-3 text-sm"><div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{review.reviewerRole === "linguistic" ? "Revue linguistique" : "Revue domaine"}</span><Badge variant="outline">{statusLabel(review.decision)}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{review.reviewerName || "Administrateur"} · {new Date(review.createdAt).toLocaleString("fr-FR")}</p>{review.notes && <p className="mt-2 text-muted-foreground">{review.notes}</p>}</div>)}</div> : <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Aucune décision humaine n’est encore enregistrée.</p>}</section>
      </div> : <p className="py-10 text-center text-sm text-muted-foreground">Aucun terme ne correspond aux filtres actuels.</p>}</CardContent></Card>
    </div>}
  </div>;
}
