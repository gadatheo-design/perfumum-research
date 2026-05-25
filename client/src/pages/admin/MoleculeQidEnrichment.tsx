/**
 * MoleculeQidEnrichment.tsx — Rapport 15
 * Page admin d'enrichissement QID Wikidata pour les molécules sans identifiant
 * Recherche automatique via l'API wbsearchentities de Wikidata
 */

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  ArrowLeft, Search, CheckCircle2, XCircle, AlertCircle,
  Loader2, ExternalLink, RefreshCw, ChevronLeft, ChevronRight,
  Zap, Database, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WikidataCandidate {
  qid: string;
  label: string;
  description: string;
  aliases: string[];
  score: number;
}

interface MoleculeRow {
  id: number;
  name: string;
  casNumber: string | null;
  iupacName: string | null;
  family: string | null;
  smiles: string | null;
}

interface EnrichmentState {
  status: "idle" | "searching" | "done" | "error";
  candidates: WikidataCandidate[];
  selectedQid: string | null;
  applied: boolean;
}

// ─── Composant candidat QID ───────────────────────────────────────────────────

function CandidateCard({
  candidate,
  selected,
  onSelect,
}: {
  candidate: WikidataCandidate;
  selected: boolean;
  onSelect: (qid: string) => void;
}) {
  const scoreColor =
    candidate.score >= 80 ? "text-emerald-500" :
    candidate.score >= 50 ? "text-amber-500" : "text-slate-400";

  return (
    <button
      onClick={() => onSelect(candidate.qid)}
      className={`w-full text-left p-2.5 rounded-md border transition-colors text-sm ${
        selected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-border hover:border-indigo-400 hover:bg-accent/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-foreground">{candidate.label}</span>
            <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono">
              {candidate.qid}
            </Badge>
            <span className={`text-xs font-semibold ${scoreColor}`}>
              {candidate.score}%
            </span>
          </div>
          {candidate.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {candidate.description}
            </p>
          )}
        </div>
        <a
          href={`https://www.wikidata.org/wiki/${candidate.qid}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </button>
  );
}

// ─── Composant ligne molécule ─────────────────────────────────────────────────

function MoleculeEnrichmentRow({
  molecule,
  state,
  onSearch,
  onSelectQid,
  onApply,
}: {
  molecule: MoleculeRow;
  state: EnrichmentState;
  onSearch: (id: number) => void;
  onSelectQid: (id: number, qid: string) => void;
  onApply: (id: number) => void;
}) {
  return (
    <div className="border rounded-lg p-3 space-y-2 bg-card">
      {/* En-tête molécule */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/molecules/${molecule.id}`}>
              <span className="font-medium text-sm hover:underline cursor-pointer">
                {molecule.name}
              </span>
            </Link>
            {molecule.casNumber && (
              <Badge variant="secondary" className="text-xs font-mono">
                CAS {molecule.casNumber}
              </Badge>
            )}
            {molecule.family && (
              <Badge variant="outline" className="text-xs">
                {molecule.family}
              </Badge>
            )}
          </div>
          {molecule.iupacName && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-mono">
              {molecule.iupacName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {state.applied && (
            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Appliqué
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => onSearch(molecule.id)}
            disabled={state.status === "searching"}
          >
            {state.status === "searching" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Search className="h-3 w-3" />
            )}
            Rechercher
          </Button>
        </div>
      </div>

      {/* Résultats de recherche */}
      {state.status === "done" && state.candidates.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">
            {state.candidates.length} candidat{state.candidates.length > 1 ? "s" : ""} trouvé{state.candidates.length > 1 ? "s" : ""} — sélectionnez le meilleur :
          </p>
          <div className="space-y-1">
            {state.candidates.map((c) => (
              <CandidateCard
                key={c.qid}
                candidate={c}
                selected={state.selectedQid === c.qid}
                onSelect={(qid) => onSelectQid(molecule.id, qid)}
              />
            ))}
          </div>
          {state.selectedQid && !state.applied && (
            <Button
              size="sm"
              className="w-full h-8 text-xs mt-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => onApply(molecule.id)}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Appliquer {state.selectedQid}
            </Button>
          )}
        </div>
      )}

      {state.status === "done" && state.candidates.length === 0 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          Aucun candidat trouvé sur Wikidata pour cette molécule.
        </p>
      )}

      {state.status === "error" && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5" />
          Erreur lors de la recherche. Réessayez.
        </p>
      )}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MoleculeQidEnrichment() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [enrichmentStates, setEnrichmentStates] = useState<Record<number, EnrichmentState>>({});
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchTotal, setBatchTotal] = useState(0);
  const PAGE_SIZE = 30;

  // ─── Données ──────────────────────────────────────────────────────────────

  const { data: coverageStats } = trpc.moleculesQid.getQidCoverageStats.useQuery();

  const { data: moleculesData, isLoading, refetch } = trpc.moleculesQid.getMoleculesWithoutQid.useQuery({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────

  const applyQidMutation = trpc.moleculesQid.applyMoleculeQid.useMutation({
    onSuccess: (data) => {
      setEnrichmentStates((prev) => ({
        ...prev,
        [data.moleculeId]: {
          ...(prev[data.moleculeId] ?? { status: "done", candidates: [], selectedQid: null }),
          applied: true,
        },
      }));
      toast({
        title: "QID appliqué",
        description: `${data.newQid} enregistré avec succès.`,
      });
    },
    onError: (err) => {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const utils = trpc.useUtils();

  const handleSearch = useCallback(async (moleculeId: number) => {
    setEnrichmentStates((prev) => ({
      ...prev,
      [moleculeId]: { status: "searching", candidates: [], selectedQid: null, applied: false },
    }));
    try {
      const result = await utils.moleculesQid.searchMoleculeQidWikidata.fetch({ moleculeId });
      setEnrichmentStates((prev) => ({
        ...prev,
        [moleculeId]: {
          status: "done",
          candidates: result.candidates,
          selectedQid: result.candidates[0]?.score >= 80 ? result.candidates[0].qid : null,
          applied: false,
        },
      }));
    } catch {
      setEnrichmentStates((prev) => ({
        ...prev,
        [moleculeId]: { status: "error", candidates: [], selectedQid: null, applied: false },
      }));
    }
  }, [utils]);

  const handleSelectQid = useCallback((moleculeId: number, qid: string) => {
    setEnrichmentStates((prev) => ({
      ...prev,
      [moleculeId]: { ...(prev[moleculeId] ?? { status: "done", candidates: [], applied: false }), selectedQid: qid },
    }));
  }, []);

  const handleApply = useCallback((moleculeId: number) => {
    const state = enrichmentStates[moleculeId];
    if (!state?.selectedQid) return;
    applyQidMutation.mutate({ moleculeId, qid: state.selectedQid });
  }, [enrichmentStates, applyQidMutation]);

  const handleBatchSearch = useCallback(async () => {
    if (!moleculesData?.molecules) return;
    const molecules = moleculesData.molecules;
    setBatchRunning(true);
    setBatchTotal(molecules.length);
    setBatchProgress(0);

    for (let i = 0; i < molecules.length; i++) {
      const mol = molecules[i];
      // Ignorer les molécules déjà traitées ou appliquées
      if (enrichmentStates[mol.id]?.applied) {
        setBatchProgress(i + 1);
        continue;
      }
      try {
        const result = await utils.moleculesQid.searchMoleculeQidWikidata.fetch({ moleculeId: mol.id });
        setEnrichmentStates((prev) => ({
          ...prev,
          [mol.id]: {
            status: "done",
            candidates: result.candidates,
            selectedQid: result.candidates[0]?.score >= 80 ? result.candidates[0].qid : null,
            applied: false,
          },
        }));
      } catch {
        setEnrichmentStates((prev) => ({
          ...prev,
          [mol.id]: { status: "error", candidates: [], selectedQid: null, applied: false },
        }));
      }
      setBatchProgress(i + 1);
      // Délai pour éviter de surcharger l'API Wikidata
      await new Promise((r) => setTimeout(r, 300));
    }

    setBatchRunning(false);
    toast({
      title: "Recherche batch terminée",
      description: `${molecules.length} molécules analysées.`,
    });
  }, [moleculesData, enrichmentStates, utils, toast]);

  const handleApplyAllHighConfidence = useCallback(async () => {
    const toApply = Object.entries(enrichmentStates)
      .filter(([, s]) => s.status === "done" && s.selectedQid && !s.applied)
      .map(([id, s]) => ({ moleculeId: Number(id), qid: s.selectedQid! }));

    if (toApply.length === 0) {
      toast({ title: "Aucun QID à appliquer", description: "Lancez d'abord une recherche batch." });
      return;
    }

    let applied = 0;
    for (const { moleculeId, qid } of toApply) {
      try {
        await applyQidMutation.mutateAsync({ moleculeId, qid });
        applied++;
      } catch {
        // Continuer malgré les erreurs individuelles
      }
    }
    toast({ title: "Batch appliqué", description: `${applied} QID enregistrés.` });
    refetch();
  }, [enrichmentStates, applyQidMutation, toast, refetch]);

  // ─── Rendu ────────────────────────────────────────────────────────────────

  const pendingApply = Object.values(enrichmentStates).filter(
    (s) => s.status === "done" && s.selectedQid && !s.applied
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Admin
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Enrichissement QID Wikidata — Molécules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Associez des identifiants Wikidata aux molécules sans QID via l'API de recherche Wikidata
          </p>
        </div>
      </div>

      {/* Statistiques de couverture */}
      {coverageStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Total molécules</p>
              <p className="text-2xl font-bold">{coverageStats.total.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Avec QID</p>
              <p className="text-2xl font-bold text-emerald-500">{coverageStats.withQid.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Sans QID</p>
              <p className="text-2xl font-bold text-amber-500">{coverageStats.withoutQid.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Couverture</p>
              <p className="text-2xl font-bold text-indigo-400">{coverageStats.coveragePercent}%</p>
              <Progress value={coverageStats.coveragePercent} className="h-1.5 mt-1" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Barre d'outils */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            Outils d'enrichissement
          </CardTitle>
          <CardDescription className="text-xs">
            Recherchez les QID Wikidata pour les molécules affichées ci-dessous.
            Les correspondances avec un score ≥ 80% sont présélectionnées automatiquement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Recherche */}
          <div className="flex gap-2">
            <Input
              placeholder="Filtrer par nom, CAS ou IUPAC…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
              className="flex-1 h-9 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(searchInput); setPage(1); }}
            >
              <Search className="h-4 w-4" />
            </Button>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Actions batch */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleBatchSearch}
              disabled={batchRunning || isLoading}
            >
              {batchRunning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              Rechercher tout ({moleculesData?.molecules.length ?? 0} molécules)
            </Button>

            {pendingApply > 0 && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleApplyAllHighConfidence}
                disabled={applyQidMutation.isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Appliquer {pendingApply} QID sélectionné{pendingApply > 1 ? "s" : ""}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Actualiser
            </Button>
          </div>

          {/* Barre de progression batch */}
          {batchRunning && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Recherche en cours…</span>
                <span>{batchProgress} / {batchTotal}</span>
              </div>
              <Progress value={batchTotal > 0 ? (batchProgress / batchTotal) * 100 : 0} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note d'information */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
        <p>
          La recherche interroge l'API <strong>wbsearchentities</strong> de Wikidata en utilisant le nom,
          le numéro CAS et le nom IUPAC de chaque molécule. Un délai de 300 ms est appliqué entre chaque
          requête pour respecter les limites de l'API. Les scores ≥ 80% indiquent une correspondance
          de haute confiance.
        </p>
      </div>

      {/* Liste des molécules */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement…</span>
        </div>
      ) : moleculesData && moleculesData.molecules.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {moleculesData.total.toLocaleString()} molécule{moleculesData.total > 1 ? "s" : ""} sans QID
              {search && ` (filtre : "${search}")`}
            </span>
            <span>Page {page} / {moleculesData.totalPages}</span>
          </div>

          <ScrollArea className="h-[600px] pr-2">
            <div className="space-y-2">
              {moleculesData.molecules.map((mol) => (
                <MoleculeEnrichmentRow
                  key={mol.id}
                  molecule={mol}
                  state={enrichmentStates[mol.id] ?? { status: "idle", candidates: [], selectedQid: null, applied: false }}
                  onSearch={handleSearch}
                  onSelectQid={handleSelectQid}
                  onApply={handleApply}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {page} / {moleculesData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(moleculesData.totalPages, p + 1))}
              disabled={page >= moleculesData.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
          <Database className="h-10 w-10 opacity-30" />
          <div className="text-center">
            <p className="font-medium">Aucune molécule sans QID</p>
            <p className="text-xs mt-1">
              {search ? "Aucun résultat pour ce filtre." : "Toutes les molécules ont un QID Wikidata !"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
