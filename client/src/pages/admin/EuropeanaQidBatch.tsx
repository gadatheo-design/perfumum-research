/**
 * PERFUMUM — Page Enrichissement QID Wikidata des plantes
 * =========================================================
 * Sprint 3.2 : Batch d'enrichissement automatique des plantes sans QID Wikidata
 * via l'Entity API Europeana. Affiche les candidats avec score de confiance.
 * Sprint 4 : Ajout du bouton "Sauvegarder" pour persister les QID en base.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Leaf, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2,
  HelpCircle, XCircle, Loader2, ExternalLink, RefreshCw, Save, Database
} from "lucide-react";
import { Link } from "wouter";

const CONFIDENCE_CONFIG = {
  high: { label: "Haute", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle2 },
  medium: { label: "Moyenne", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: HelpCircle },
  low: { label: "Faible", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", icon: XCircle },
};

const STATUS_CONFIG = {
  resolved: { label: "Résolu", color: "text-green-600", icon: CheckCircle2 },
  candidates: { label: "Candidats", color: "text-yellow-600", icon: HelpCircle },
  not_found: { label: "Non trouvé", color: "text-red-500", icon: XCircle },
  no_api: { label: "Clé manquante", color: "text-muted-foreground", icon: AlertCircle },
};

export default function EuropeanaQidBatch() {
  const [offset, setOffset] = useState(0);
  const [selectedQids, setSelectedQids] = useState<Record<number, string>>({});
  const [savedPlantIds, setSavedPlantIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const LIMIT = 20;

  const { data, isLoading, refetch } = trpc.europeana.enrichPlantQidBatch.useQuery(
    { offset, limit: LIMIT },
    { keepPreviousData: true } as any
  );

  const saveQidBatch = trpc.europeana.saveQidBatch.useMutation({
    onSuccess: (result) => {
      const newSaved = new Set(savedPlantIds);
      result.results.filter((r: any) => r.success).forEach((r: any) => newSaved.add(r.plantId));
      setSavedPlantIds(newSaved);
      toast({
        title: `${result.saved} QID sauvegardé${result.saved > 1 ? 's' : ''}`,
        description: result.failed > 0
          ? `${result.failed} échec${result.failed > 1 ? 's' : ''} — vérifiez les logs.`
          : "Tous les QID ont été persistés en base de données.",
      });
      refetch();
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const handlePrev = () => setOffset(Math.max(0, offset - LIMIT));
  const handleNext = () => {
    if (data?.pagination?.hasMore) setOffset(offset + LIMIT);
  };

  const toggleQid = (plantId: number, qid: string) => {
    setSelectedQids((prev) => {
      const next = { ...prev };
      if (next[plantId] === qid) {
        delete next[plantId];
      } else {
        next[plantId] = qid;
      }
      return next;
    });
  };

  const handleSaveSelected = () => {
    const items = Object.entries(selectedQids).map(([plantId, qid]) => ({
      plantId: Number(plantId),
      qid,
    }));
    if (items.length === 0) {
      toast({ title: "Aucune sélection", description: "Sélectionnez au moins un QID à sauvegarder." });
      return;
    }
    saveQidBatch.mutate({ items });
  };

  const handleSaveAllHighConfidence = () => {
    if (!data?.results) return;
    const items: { plantId: number; qid: string }[] = [];
    for (const plant of data.results) {
      if (plant.status === "candidates" && plant.candidates) {
        const highConf = plant.candidates.find((c: any) => c.confidence === "high");
        if (highConf) {
          const wikidataUri = highConf.sameAs?.find((s: string) => s.includes("wikidata.org"));
          const qid = wikidataUri?.match(/Q\d+/)?.[0];
          if (qid) items.push({ plantId: plant.plantId, qid });
        }
      }
    }
    if (items.length === 0) {
      toast({ title: "Aucun candidat haute confiance", description: "Aucune plante avec un candidat haute confiance sur cette page." });
      return;
    }
    saveQidBatch.mutate({ items });
  };

  const selectedCount = Object.keys(selectedQids).length;

  return (
    <div className="container py-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin/europeana">
            <ChevronLeft className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          </Link>
          <Leaf className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold">Enrichissement QID — Plantes</h1>
          <Badge variant="secondary" className="text-xs">Sprint 3.2</Badge>
        </div>
        <p className="text-muted-foreground text-sm ml-14">
          Résolution automatique des QID Wikidata manquants via l'Entity API Europeana.
          Les plantes avec un QID permettent des recherches croisées Europeana × Wikidata.
        </p>
      </div>

      {data?.coverage && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Couverture QID Wikidata</CardTitle>
            <CardDescription className="text-xs">
              {data.coverage.withQid} plantes résolues sur {data.coverage.total} au total
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={data.coverage.percent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">{data.coverage.withQid} avec QID ({data.coverage.percent}%)</span>
              <span className="text-orange-600 font-medium">{data.coverage.withoutQid} sans QID</span>
            </div>
            {!data.apiAvailable && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mt-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Clé API Europeana manquante</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Ajoutez <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">EUROPEANA_API_KEY</code> dans les secrets pour activer la résolution automatique.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-medium">
            Plantes sans QID — page {Math.floor(offset / LIMIT) + 1}
            {data?.pagination && ` / ${Math.ceil(data.pagination.total / LIMIT)}`}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Actualiser
            </Button>
            {data?.results && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveAllHighConfidence}
                disabled={saveQidBatch.isPending}
                className="gap-2 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30"
              >
                {saveQidBatch.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                Sauvegarder haute confiance
              </Button>
            )}
            {selectedCount > 0 && (
              <Button
                size="sm"
                onClick={handleSaveSelected}
                disabled={saveQidBatch.isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saveQidBatch.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Sauvegarder sélection ({selectedCount})
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <div className="space-y-3">
            {data.results.map((plant) => {
              const statusConf = STATUS_CONFIG[plant.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.not_found;
              const StatusIcon = statusConf.icon;
              const isSaved = savedPlantIds.has(plant.plantId);
              return (
                <Card key={plant.plantId} className={`overflow-hidden transition-all ${isSaved ? 'border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-950/10' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{plant.plantName}</p>
                          {plant.latinName && <span className="text-xs text-muted-foreground italic">{plant.latinName}</span>}
                          {plant.family && <Badge variant="outline" className="text-xs">{plant.family}</Badge>}
                          {isSaved && <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0"><CheckCircle2 className="h-3 w-3 mr-1" />Sauvegardé</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">ID #{plant.plantId}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${statusConf.color} shrink-0`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConf.label}
                      </div>
                    </div>

                    {plant.candidates && plant.candidates.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{plant.candidates.length} candidat(s) :</p>
                        {plant.candidates.map((candidate: any, ci: number) => {
                          const conf = CONFIDENCE_CONFIG[candidate.confidence as keyof typeof CONFIDENCE_CONFIG] || CONFIDENCE_CONFIG.low;
                          const ConfIcon = conf.icon;
                          const wikidataUri = candidate.sameAs?.find((s: string) => s.includes("wikidata.org"));
                          const qid = wikidataUri?.match(/Q\d+/)?.[0];
                          const isSelected = qid && selectedQids[plant.plantId] === qid;
                          return (
                            <div
                              key={ci}
                              className={`flex items-start gap-2 p-2 rounded-md border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                                  : 'bg-muted/40 hover:bg-muted/60'
                              }`}
                              onClick={() => qid && toggleQid(plant.plantId, qid)}
                            >
                              <ConfIcon className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-medium">{candidate.label}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${conf.color}`}>{conf.label}</span>
                                  {qid && <span className="text-xs font-mono text-muted-foreground">{qid}</span>}
                                  {isSelected && <Badge className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">Sélectionné</Badge>}
                                </div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {candidate.entityId && (
                                    <a href={candidate.entityId} target="_blank" rel="noopener noreferrer"
                                      className="text-xs text-cyan-600 hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-3 w-3" />Europeana Entity
                                    </a>
                                  )}
                                  {wikidataUri && (
                                    <a href={wikidataUri} target="_blank" rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-3 w-3" />Wikidata
                                    </a>
                                  )}
                                </div>
                              </div>
                              {qid && !isSaved && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveQidBatch.mutate({ items: [{ plantId: plant.plantId, qid }] });
                                  }}
                                  disabled={saveQidBatch.isPending}
                                  title="Sauvegarder ce QID directement"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Toutes les plantes ont un QID Wikidata.</p>
          </div>
        )}

        {data?.pagination && data.pagination.total > LIMIT && (
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={offset === 0} className="gap-2">
              <ChevronLeft className="h-4 w-4" />Précédent
            </Button>
            <span className="text-xs text-muted-foreground">
              {offset + 1}–{Math.min(offset + LIMIT, data.pagination.total)} / {data.pagination.total}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={!data.pagination.hasMore} className="gap-2">
              Suivant<ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
