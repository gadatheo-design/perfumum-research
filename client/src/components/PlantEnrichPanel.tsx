/**
 * PlantEnrichPanel.tsx
 * Panneau d'enrichissement inline pour les fiches plantes.
 * Utilise phyloBatch.batchByGenus pour interroger GBIF, POWO, NCBI, Wikidata
 * directement depuis la fiche plante, sans passer par l'admin.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Leaf,
  Dna,
  Globe,
  TreeDeciduous,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface PlantEnrichPanelProps {
  plantId: number;
  latinName: string | null;
  plantName: string;
  currentIds: {
    gbifId?: string | null;
    powId?: string | null;
    ncbiTaxId?: string | null;
    wikidataQid?: string | null;
  };
  onEnriched?: () => void;
}

const API_META = {
  gbif: { label: "GBIF", icon: Leaf, colorClass: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" },
  powo: { label: "POWO", icon: TreeDeciduous, colorClass: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" },
  ncbi: { label: "NCBI", icon: Dna, colorClass: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
  wikidata: { label: "Wikidata", icon: Globe, colorClass: "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" },
} as const;

type ApiKey = keyof typeof API_META;

interface ApiResult {
  api: ApiKey;
  found: boolean;
  id: string | null;
  message: string;
}

export function PlantEnrichPanel({ plantId, latinName, plantName, currentIds, onEnriched }: PlantEnrichPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ApiResult[]>([]);
  const [dryRun, setDryRun] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasRunDryRun, setHasRunDryRun] = useState(false);

  const batchMutation = trpc.phyloBatch.batchByGenus.useMutation();

  const missingApis: ApiKey[] = (Object.keys(API_META) as ApiKey[]).filter((key) => {
    const idMap: Record<ApiKey, string | null | undefined> = {
      gbif: currentIds.gbifId,
      powo: currentIds.powId,
      ncbi: currentIds.ncbiTaxId,
      wikidata: currentIds.wikidataQid,
    };
    return !idMap[key];
  });

  const hasAllIds = missingApis.length === 0;

  const runEnrichment = async (applyMode = false) => {
    if (!latinName) {
      toast.error("Nom latin requis pour l'enrichissement.");
      return;
    }

    const genus = latinName.split(" ")[0];
    if (!genus || genus.length < 2) {
      toast.error("Impossible d'extraire le genre depuis le nom latin.");
      return;
    }

    setIsRunning(true);
    setProgress(20);

    try {
      const res = await batchMutation.mutateAsync({
        genus,
        dryRun: applyMode ? false : dryRun,
        apis: missingApis.filter((a): a is "gbif" | "powo" | "ncbi" | "wikidata" => true),
      });

      setProgress(80);

      // Trouver le résultat pour cette plante spécifique
      const plantResult = res.results?.find(
        (r: any) => r.id === plantId || r.latinName === latinName
      );

      if (!plantResult) {
        toast.info(`"${latinName}" non trouvée dans le genre ${genus} — vérifiez le nom latin.`);
        setResults([]);
        setProgress(100);
        setIsRunning(false);
        return;
      }

      // Construire les résultats par API
      const newResults: ApiResult[] = missingApis.map((api) => {
        const apiData = plantResult.apis?.[api];
        let id: string | null = null;
        let found = false;

        if (api === "gbif" && plantResult.newIds?.gbif) { id = plantResult.newIds.gbif; found = true; }
        else if (api === "powo" && plantResult.newIds?.powo) { id = plantResult.newIds.powo; found = true; }
        else if (api === "ncbi" && plantResult.newIds?.ncbi) { id = plantResult.newIds.ncbi; found = true; }
        else if (api === "wikidata" && plantResult.newIds?.wikidata) { id = plantResult.newIds.wikidata; found = true; }
        else if (apiData) {
          // Trouvé dans l'API mais déjà présent ou pas de changement
          const existingId = api === "gbif" ? apiData.id : api === "powo" ? apiData.fqId : api === "ncbi" ? apiData.taxId : apiData.qid;
          if (existingId) { id = existingId; found = true; }
        }

        return {
          api,
          found,
          id,
          message: found
            ? applyMode
              ? `Appliqué en base : ${id}`
              : `Trouvé : ${id}`
            : "Non trouvé dans cette API",
        };
      });

      setResults(newResults);
      setProgress(100);

      const successCount = newResults.filter((r) => r.found).length;
      if (applyMode) {
        toast.success(`${successCount} identifiant(s) appliqué(s) en base pour ${plantName}.`);
        if (onEnriched) onEnriched();
        setHasRunDryRun(false);
      } else {
        setHasRunDryRun(true);
        if (successCount > 0) {
          toast.success(`${successCount} identifiant(s) trouvé(s) — cliquez "Appliquer" pour enregistrer.`);
        } else {
          toast.info("Aucun nouvel identifiant trouvé pour cette plante.");
        }
      }
    } catch (err: any) {
      toast.error(`Erreur : ${err?.message ?? "Erreur inconnue"}`);
      setProgress(0);
    }

    setIsRunning(false);
  };

  if (hasAllIds) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium">Enrichissement complet</span>
        <span className="text-xs opacity-70">— Tous les identifiants sont renseignés</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors text-left"
        type="button"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold text-primary">Enrichir cette plante</span>
          <span className="text-xs text-muted-foreground">
            — {missingApis.length} identifiant{missingApis.length > 1 ? "s" : ""} manquant{missingApis.length > 1 ? "s" : ""}
          </span>
          {/* Indicateurs visuels */}
          <div className="flex gap-1 ml-1">
            {(Object.keys(API_META) as ApiKey[]).map((key) => {
              const idMap: Record<ApiKey, string | null | undefined> = {
                gbif: currentIds.gbifId,
                powo: currentIds.powId,
                ncbi: currentIds.ncbiTaxId,
                wikidata: currentIds.wikidataQid,
              };
              const hasId = !!idMap[key];
              return (
                <span
                  key={key}
                  title={`${API_META[key].label}: ${hasId ? "✓" : "manquant"}`}
                  className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold border transition-colors ${
                    hasId
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700"
                      : "bg-muted/60 text-muted-foreground border-border"
                  }`}
                >
                  {key[0].toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Panneau expandable */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-primary/20">
          {/* APIs manquantes */}
          <div className="pt-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-widest">APIs à interroger</p>
            <div className="flex flex-wrap gap-2">
              {missingApis.map((key) => {
                const meta = API_META[key];
                const Icon = meta.icon;
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.colorClass}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Option dry run */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => { setDryRun(e.target.checked); setResults([]); setHasRunDryRun(false); }}
              className="rounded"
              disabled={isRunning}
            />
            Mode prévisualisation — voir les résultats avant d'enregistrer
          </label>

          {/* Barre de progression */}
          {isRunning && (
            <div className="space-y-1.5">
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground animate-pulse">Interrogation des APIs en cours…</p>
            </div>
          )}

          {/* Résultats */}
          {results.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Résultats</p>
              {results.map((r) => {
                const meta = API_META[r.api];
                const Icon = meta.icon;
                return (
                  <div
                    key={r.api}
                    className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm border ${
                      r.found
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    {r.found ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 opacity-70" />
                        <span className="font-semibold text-xs uppercase tracking-wide">{meta.label}</span>
                        {r.id && (
                          <span className="font-mono text-xs opacity-70">{r.id}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.message}</p>
                    </div>
                  </div>
                );
              })}

              {/* Bouton Appliquer si dry run avec succès */}
              {dryRun && hasRunDryRun && results.some((r) => r.found) && (
                <Button
                  size="sm"
                  onClick={() => runEnrichment(true)}
                  disabled={isRunning}
                  className="w-full gap-2 mt-1"
                >
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Appliquer en base ({results.filter((r) => r.found).length} ID{results.filter((r) => r.found).length > 1 ? "s" : ""})
                </Button>
              )}
            </div>
          )}

          {/* Bouton principal */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={results.length > 0 ? "outline" : "default"}
              onClick={() => runEnrichment(false)}
              disabled={isRunning || !latinName}
              className="flex-1 gap-2"
              type="button"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isRunning ? "Enrichissement en cours…" : results.length > 0 ? "Relancer" : "Lancer l'enrichissement"}
            </Button>
          </div>

          {!latinName && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Nom latin requis pour l'enrichissement
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PlantEnrichPanel;
