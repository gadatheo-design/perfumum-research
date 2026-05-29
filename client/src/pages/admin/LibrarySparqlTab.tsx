/**
 * Onglet Bibliothèque SPARQL — Requêtes sauvegardées
 * Permet de lister, filtrer, exécuter, annoter et supprimer les requêtes SPARQL sauvegardées
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Search, BookOpen, AlertCircle, Loader2, Library,
  Play, Download, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LibrarySparqlTab() {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [endpointFilter, setEndpointFilter] = useState("all");
  const [editingNotes, setEditingNotes] = useState<{ id: number; notes: string } | null>(null);
  const [runningQuery, setRunningQuery] = useState<{ id: number; sparql: string; endpoint: string } | null>(null);
  const [runResults, setRunResults] = useState<any>(null);

  const { data: queries, isLoading } = trpc.sparqlSaved.list.useQuery(
    {
      category: categoryFilter !== "all" ? categoryFilter as any : undefined,
      endpoint: endpointFilter !== "all" ? endpointFilter as any : undefined,
      search: search || undefined
    }
  );
  const { data: stats } = trpc.sparqlSaved.stats.useQuery();

  const removeMutation = trpc.sparqlSaved.remove.useMutation({
    onSuccess: () => {
      toast({ title: "Requête supprimée" });
      utils.sparqlSaved.list.invalidate();
      utils.sparqlSaved.stats.invalidate();
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const updateNotesMutation = trpc.sparqlSaved.updateNotes.useMutation({
    onSuccess: () => {
      toast({ title: "Notes mises à jour" });
      utils.sparqlSaved.list.invalidate();
      setEditingNotes(null);
    },
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const freeMutation = trpc.sparql.freeQuery.useMutation({
    onSuccess: (data) => setRunResults(data),
    onError: (e) => setRunResults({ error: e.message }),
  });

  const europeanaQueryMutation = trpc.sparql.europeanaQuery.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setRunResults({
          vars: data.vars,
          bindings: data.results.map((r: any) =>
            Object.fromEntries(data.vars.map((v: string) => [v, { type: "literal", value: r[v] ?? "" }]))
          )
        });
      } else {
        setRunResults({ error: data.error });
      }
    },
    onError: (e) => setRunResults({ error: e.message }),
  });

  const handleRun = (query: { id: number; sparqlQuery: string; endpoint: string }) => {
    setRunningQuery({ id: query.id, sparql: query.sparqlQuery, endpoint: query.endpoint });
    setRunResults(null);
    if (query.endpoint === "europeana") {
      europeanaQueryMutation.mutate({ sparql: query.sparqlQuery });
    } else {
      freeMutation.mutate({ sparql: query.sparqlQuery });
    }
  };

  const handleExportCSV = (results: any) => {
    if (!results?.bindings?.length) return;
    const header = results.vars.join(",");
    const rows = results.bindings.map((row: any) =>
      results.vars.map((v: string) => `"${(row[v]?.value ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sparql_library_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryLabels: Record<string, string> = {
    free: "Libre", molecule: "Molécule", plant: "Plante", artwork: "Œuvre",
    temporal: "Temporel", genealogy: "Généalogie", europeana: "Europeana", internal: "Interne"
  };

  const categoryColors: Record<string, string> = {
    free: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    molecule: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    plant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    artwork: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    temporal: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    genealogy: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    europeana: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    internal: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
  };

  const isPending = freeMutation.isPending || europeanaQueryMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Dialog édition notes */}
      {editingNotes && (
        <Dialog open={!!editingNotes} onOpenChange={() => setEditingNotes(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Notes de recherche
              </DialogTitle>
            </DialogHeader>
            <Textarea
              value={editingNotes.notes}
              onChange={(e) => setEditingNotes({ ...editingNotes, notes: e.target.value })}
              placeholder="Contexte, résultats, observations..."
              className="min-h-[120px] text-sm"
            />
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setEditingNotes(null)}>Annuler</Button>
              <Button
                size="sm"
                onClick={() => updateNotesMutation.mutate({ id: editingNotes.id, notes: editingNotes.notes })}
                disabled={updateNotesMutation.isPending}
              >
                {updateNotesMutation.isPending ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : null}
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Stats rapides */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Requêtes sauvegardées</p>
            </CardContent>
          </Card>
          {stats.byCategory?.slice(0, 3).map((cat: any) => (
            <Card key={cat.category}>
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{cat.count}</p>
                <p className="text-xs text-muted-foreground">{categoryLabels[cat.category] ?? cat.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs">Recherche</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Titre, tags, notes..."
              className="pl-8 text-sm"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Catégorie</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36 mt-1 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="free">Libre</SelectItem>
              <SelectItem value="molecule">Molécule</SelectItem>
              <SelectItem value="plant">Plante</SelectItem>
              <SelectItem value="artwork">Œuvre d'art</SelectItem>
              <SelectItem value="temporal">Temporel</SelectItem>
              <SelectItem value="genealogy">Généalogie</SelectItem>
              <SelectItem value="europeana">Europeana</SelectItem>
              <SelectItem value="internal">Interne</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Endpoint</Label>
          <Select value={endpointFilter} onValueChange={setEndpointFilter}>
            <SelectTrigger className="w-36 mt-1 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="wikidata">Wikidata</SelectItem>
              <SelectItem value="europeana">Europeana</SelectItem>
              <SelectItem value="internal">Interne</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des requêtes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !queries?.items?.length ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            <Library className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Bibliothèque vide</p>
            <p className="text-xs mt-1">
              Sauvegardez des requêtes depuis les onglets <strong>Libre</strong> ou <strong>Templates</strong>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {queries.items.map((q: any) => (
            <Card key={q.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{q.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[q.category] ?? "bg-muted text-muted-foreground"}`}>
                        {categoryLabels[q.category] ?? q.category}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
                        {q.endpoint}
                      </span>
                      {q.executionCount > 0 && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Play className="h-2.5 w-2.5" /> {q.executionCount}x
                        </span>
                      )}
                    </div>
                    {q.tags && (
                      <div className="flex gap-1 flex-wrap mt-1.5">
                        {q.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    {q.notes && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 italic">"{q.notes}"</p>
                    )}
                    <pre className="text-[10px] font-mono bg-muted/50 rounded p-2 mt-2 max-h-16 overflow-hidden text-muted-foreground">
                      {q.sparqlQuery}
                    </pre>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Créée le {new Date(q.createdAt).toLocaleDateString("fr-FR")}
                      {q.lastExecutedAt && ` • Dernière exécution : ${new Date(q.lastExecutedAt).toLocaleDateString("fr-FR")}`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleRun({ id: q.id, sparqlQuery: q.sparqlQuery, endpoint: q.endpoint })}
                      disabled={isPending}
                    >
                      {isPending && runningQuery?.id === q.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Play className="h-3 w-3" />}
                      Exécuter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => setEditingNotes({ id: q.id, notes: q.notes ?? "" })}
                    >
                      <BookOpen className="h-3 w-3" /> Notes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      onClick={() => {
                        if (confirm(`Supprimer "${q.title}" ?`)) removeMutation.mutate({ id: q.id });
                      }}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" /> Suppr.
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Résultats de la requête exécutée */}
      {runResults && runningQuery && (
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4 text-emerald-600" />
                Résultats —           {queries?.items?.find((q: any) => q.id === runningQuery.id)?.title ?? "Requête"}
              </span>
              <div className="flex gap-2">
                {!runResults.error && runResults.bindings?.length > 0 && (
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleExportCSV(runResults)}>
                    <Download className="h-3 w-3" /> CSV
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => { setRunResults(null); setRunningQuery(null); }}
                >
                  Fermer
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {runResults.error ? (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="font-mono text-xs">{runResults.error}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-2">{runResults.bindings?.length ?? 0} résultat(s)</p>
                {runResults.bindings?.length > 0 && (
                  <div className="overflow-x-auto rounded border">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          {runResults.vars?.map((v: string) => (
                            <th key={v} className="px-3 py-2 text-left font-medium">{v}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {runResults.bindings.slice(0, 50).map((row: any, i: number) => (
                          <tr key={i} className="border-t hover:bg-muted/50">
                            {runResults.vars?.map((v: string) => (
                              <td key={v} className="px-3 py-2 max-w-xs truncate">
                                {row[v]?.type === "uri" ? (
                                  <a href={row[v].value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {row[v].value.split("/").pop()}
                                  </a>
                                ) : row[v]?.value ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
