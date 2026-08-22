import React from 'react';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Star, BookOpen, Copy, Check, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";
import { IFRAStatusBadge } from "@/components/IFRAStatusBadge";
import { AIClassificationSuggestion } from "@/components/AIClassificationSuggestion";
import { MoleculeAnalyticalMethods } from "@/components/MoleculeAnalyticalMethods";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import type { MoleculeTabProps } from './molecule-tab-types';






export function MoleculeOverviewTab({
  mol,
  molecule,
  id,
  normOlfactiveProfile,
  normOlfactiveProfileStr,
  normTherapeuticProperties,
  normBotanicalSources,
  safeReferences,
  radarData,
  hasRadarData,
  ifraRestrictions,
  hasIfraRestrictions,
  primaryRestriction,
  moleculeOrigins,
  isLoadingOrigins,
  moleculeTransformations,
  isLoadingTransformations,
  tpsGenes,
  isLoadingTps,
  recommendations,
  isLoadingRecommendations,
}: MoleculeTabProps & {
  recommendations?: unknown;
  isLoadingRecommendations?: boolean;
}) {
  const radarSummary = radarData
    .map((point: { axis: string; value: number }) => `${point.axis} ${point.value}/100`)
    .join(", ");

  return (
            <TabsContent value="overview" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Vue d'ensemble">
              {/* Profil Olfactif Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {normOlfactiveProfile.length > 0 && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Profil Olfactif</h2>
                    </div>
                    {normOlfactiveProfile.length === 1 ? (
                      <p className="whitespace-pre-wrap text-muted-foreground">{normOlfactiveProfile[0]}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {normOlfactiveProfile.map((tag: string, i: number) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {molecule?.emotionalResonance && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Résonance Émotionnelle</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.emotionalResonance}</p>
                  </div>
                )}

                {molecule?.functionalEffect && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Atom className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Effet Fonctionnel</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.functionalEffect}</p>
                  </div>
                )}

                {molecule?.sourceOrigin && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Origine</h2>
                    </div>
                    <p className="text-muted-foreground">{molecule.sourceOrigin}</p>
                  </div>
                )}
              </div>

              {/* Profil Radar Olfactif */}
              {hasRadarData && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h2 className="text-xl font-semibold">Profil Radar Olfactif</h2>
                    <span className="text-xs text-muted-foreground">Survolez un axe pour lire sa valeur</span>
                  </div>
                  <div
                    className="h-96 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                    role="img"
                    tabIndex={0}
                    aria-label={`Profil radar olfactif de ${molecule?.name || "la molécule"}. ${radarSummary}`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--foreground))", fontSize: 14 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <RechartsTooltip
                          cursor={false}
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const point = payload[0]?.payload as { axis?: string; value?: number } | undefined;
                            if (!point?.axis || typeof point.value !== "number") return null;
                            return (
                              <div className="min-w-40 rounded-md border bg-popover px-3 py-2 shadow-md text-popover-foreground">
                                <p className="text-xs font-semibold">{point.axis}</p>
                                <p className="mt-0.5 text-lg font-bold text-primary">{point.value}<span className="ml-1 text-xs font-normal text-muted-foreground">/100</span></p>
                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, point.value))}%` }} />
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Radar
                          name={molecule?.name}
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2" aria-label="Valeurs détaillées du profil radar">
                    <TooltipProvider delayDuration={120}>
                      {radarData.map((point: { axis: string; value: number }) => (
                        <Tooltip key={point.axis}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full border bg-muted/35 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              aria-label={`${point.axis} : ${point.value} sur 100`}
                            >
                              {point.axis} <span className="text-primary">{point.value}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p><strong>{point.axis}</strong> — intensité relative : {point.value}/100</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>
              )}

              {/* Informations Botaniques et Extraction */}
              <div className="grid md:grid-cols-2 gap-6">
                {normBotanicalSources && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Sources Botaniques</h2>
                    <p className="whitespace-pre-wrap text-muted-foreground">{normBotanicalSources}</p>
                  </div>
                )}

                {molecule?.extractionMethod && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Méthode d'Extraction</h2>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.extractionMethod}</p>
                  </div>
                )}

                {normTherapeuticProperties && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Propriétés Thérapeutiques</h2>
                    <p className="whitespace-pre-wrap text-muted-foreground">{normTherapeuticProperties}</p>
                  </div>
                )}

                {molecule?.concentration && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplet className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Concentration Recommandée</h2>
                    </div>
                    <p className="text-2xl font-bold text-primary">{molecule.concentration}</p>
                  </div>
                )}
              </div>

              {/* Notes de Recherche */}
              {molecule?.notes && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Notes de Recherche</h2>
                  <p className="whitespace-pre-wrap text-muted-foreground">{molecule?.notes}</p>
                </div>
              )}

              {/* Recommandations IA — à implémenter dans une version future */}

              {/* Références Bibliographiques (PubChem, etc.) */}
              {safeReferences && safeReferences.length > 0 && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Références</h2>
                  <ul className="space-y-2">
                    {safeReferences.map((ref, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {ref.author && <span className="font-medium">{ref.author}</span>}
                        {ref.year && <span> ({ref.year})</span>}
                        {ref.title && <span> — {ref.title}</span>}
                        {ref.doi && (
                          <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline text-xs">
                            DOI
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </TabErrorBoundary>
            </TabsContent>
  );
}
