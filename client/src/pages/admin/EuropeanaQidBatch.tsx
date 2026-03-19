/**
 * PERFUMUM — Page Enrichissement QID Wikidata des plantes
 * =========================================================
 * Sprint 3.2 : Batch d'enrichissement automatique des plantes sans QID Wikidata
 * via l'Entity API Europeana. Affiche les candidats avec score de confiance.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Leaf, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2,
  HelpCircle, XCircle, Loader2, ExternalLink, RefreshCw
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
  const LIMIT = 20;

  const { data, isLoading, refetch } = trpc.europeana.enrichPlantQidBatch.useQuery(
    { offset, limit: LIMIT },
    { keepPreviousData: true } as any
  );

  const handlePrev = () => setOffset(Math.max(0, offset - LIMIT));
  const handleNext = () => {
    if (data?.pagination?.hasMore) setOffset(offset + LIMIT);
  };

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
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Plantes sans QID — page {Math.floor(offset / LIMIT) + 1}
            {data?.pagination && ` / ${Math.ceil(data.pagination.total / LIMIT)}`}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Actualiser
          </Button>
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
              return (
                <Card key={plant.plantId} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{plant.plantName}</p>
                          {plant.latinName && <span className="text-xs text-muted-foreground italic">{plant.latinName}</span>}
                          {plant.family && <Badge variant="outline" className="text-xs">{plant.family}</Badge>}
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
                        {plant.candidates.map((candidate, ci) => {
                          const conf = CONFIDENCE_CONFIG[candidate.confidence as keyof typeof CONFIDENCE_CONFIG] || CONFIDENCE_CONFIG.low;
                          const ConfIcon = conf.icon;
                          const wikidataUri = candidate.sameAs?.find((s: string) => s.includes("wikidata.org"));
                          return (
                            <div key={ci} className="flex items-start gap-2 p-2 rounded-md bg-muted/40 border">
                              <ConfIcon className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-medium">{candidate.label}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${conf.color}`}>{conf.label}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {candidate.entityId && (
                                    <a href={candidate.entityId} target="_blank" rel="noopener noreferrer"
                                      className="text-xs text-cyan-600 hover:underline flex items-center gap-1">
                                      <ExternalLink className="h-3 w-3" />Europeana Entity
                                    </a>
                                  )}
                                  {wikidataUri && (
                                    <a href={wikidataUri} target="_blank" rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                      <ExternalLink className="h-3 w-3" />Wikidata
                                    </a>
                                  )}
                                </div>
                              </div>
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
