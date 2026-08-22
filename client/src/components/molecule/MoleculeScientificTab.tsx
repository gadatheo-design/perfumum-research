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
import { MoleculeAnalyticalMethods } from "@/components/MoleculeAnalyticalMethods";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import type { MoleculeTabProps } from './molecule-tab-types';
import { Molecule3DViewer } from "@/components/Molecule3DViewer";
import { AIClassificationSuggestion } from "@/components/AIClassificationSuggestion";


export function MoleculeScientificTab({
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
}: MoleculeTabProps) {
  const { toast } = useToast();
  const applyAIClassificationMutation = trpc.molecules.applyAIClassification.useMutation({
    onSuccess: () => toast({ title: "Classification mise à jour" }),
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });
  const applyAINotesMutation = trpc.molecules.applyAINotes.useMutation({
    onSuccess: () => toast({ title: "Notes mises à jour" }),
    onError: (e) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });
  return (
            <TabsContent value="scientific" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Données scientifiques">
              {/* Propriétés Scientifiques — voir l'onglet Nomenclature pour IUPAC, CAS, formule, poids */}
              {(molecule?.molecularWeight || molecule?.boilingPoint || molecule?.logP || molecule?.volatility || molecule?.intensity || molecule?.complexity) && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Propriétés Physico-chimiques
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {molecule?.molecularWeight && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Masse Moléculaire</p>
                        <p className="text-2xl font-bold">{molecule?.molecularWeight} <span className="text-sm font-normal">g/mol</span></p>
                      </div>
                    )}
                    {molecule?.boilingPoint && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Point d'Ébullition</p>
                        <p className="text-2xl font-bold">{molecule?.boilingPoint} <span className="text-sm font-normal">°C</span></p>
                      </div>
                    )}
                    {molecule?.logP && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">LogP (lipophilie)</p>
                        <p className="text-2xl font-bold">{(molecule?.logP / 100).toFixed(2)}</p>
                      </div>
                    )}
                    {molecule?.volatility && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Volatilité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule?.volatility}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule?.volatility}%</span>
                        </div>
                      </div>
                    )}
                    {molecule?.intensity && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Intensité Olfactive</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule?.intensity}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule?.intensity}%</span>
                        </div>
                      </div>
                    )}
                    {molecule?.complexity && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Complexité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule?.complexity}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule?.complexity}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visualisation 3D de la molécule */}
              {molecule?.chemicalFormula && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Box className="h-5 w-5 text-primary" />
                    Structure Moléculaire 3D
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visualisation interactive de la structure moléculaire. Utilisez la souris pour faire pivoter le modèle.
                  </p>
                  <Molecule3DViewer
                    moleculeId={id}
                    moleculeName={molecule?.name}
                    formula={molecule?.chemicalFormula}
                    showControls={true}
                    showInfo={true}
                    autoRotate={false}
                    height={400}
                  />
                </div>
              )}

              {/* Famille chimique */}
              {molecule?.family && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Classification Olfactive</h2>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Famille olfactive</p>
                      <p className="text-xl font-semibold text-primary">{molecule?.family}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Méthodes analytiques utilisées */}
              <MoleculeAnalyticalMethods moleculeId={id} />

              {/* Classification assistée par IA */}
              <AIClassificationSuggestion
                molecule={{
                  name: molecule?.name ?? '',
                  iupacName: molecule?.iupacName,
                  casNumber: molecule?.casNumber,
                  chemicalFormula: molecule?.chemicalFormula,
                  olfactiveProfile: normOlfactiveProfileStr || undefined,
                  botanicalSources: normBotanicalSources || undefined,
                }}
                currentChemicalClass={molecule?.chemicalClass}
                currentOlfactiveFamily={molecule?.family}
                onAcceptChemicalClass={(value) => applyAIClassificationMutation.mutate({ moleculeId: id, chemicalClass: value })}
                onAcceptOlfactiveFamily={(value) => applyAIClassificationMutation.mutate({ moleculeId: id, olfactiveFamily: value })}
                onAcceptOlfactiveProfile={(value) => applyAIClassificationMutation.mutate({ moleculeId: id, olfactiveProfile: value })}
                onAcceptResearcherNotes={(value, appendMode) => applyAINotesMutation.mutate({ moleculeId: id, researcherNotes: value, appendMode })}
                currentNotes={molecule?.notes}
              />
              </TabErrorBoundary>
            </TabsContent>
  );
}
