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
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import type { MoleculeTabProps } from './molecule-tab-types';


export function MoleculeBiosynthesisTab({
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
  return (
            <TabsContent value="biosynthesis" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Biosynthèse">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Dna className="h-5 w-5 text-primary" />
                  Voie de Biosynthèse - Gènes TPS (Terpene Synthases)
                </h2>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Les Terpene Synthases (TPS) sont des enzymes clés responsables de la biosynthèse des terpènes à partir de précurseurs isoprénoïdes (GPP, FPP, GGPP).
                  Cette section présente les gènes TPS connus pour produire cette molécule.
                </p>
                
                {isLoadingTps ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : tpsGenes && tpsGenes?.length > 0 ? (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {tpsGenes?.length} gène{tpsGenes?.length > 1 ? 's' : ''} TPS identifié{tpsGenes?.length > 1 ? 's' : ''}
                      </Badge>
                      {[...new Set(tpsGenes?.map((g: unknown) => (g as { species?: string }).species))].filter(Boolean).length > 0 && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          {[...new Set(tpsGenes?.map((g: unknown) => (g as { species?: string }).species))].filter(Boolean).length} espèce{[...new Set(tpsGenes?.map((g: unknown) => (g as { species?: string }).species))].filter(Boolean).length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>

                    {/* Liste des gènes TPS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tpsGenes?.map((gene: unknown) => (
                        <div key={((gene as Record<string, unknown>).id as string | undefined)} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                                <Dna className="h-4 w-4" />
                                {((gene as Record<string, unknown>).geneName as string | undefined)}
                              </h3>
                              {((gene as Record<string, unknown>).geneId as string | undefined) && (
                                <p className="text-xs font-mono text-green-600 dark:text-green-400">{((gene as Record<string, unknown>).geneId as string | undefined)}</p>
                              )}
                            </div>
                            {((gene as Record<string, unknown>).enzymeClass as string | undefined) && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                {((gene as Record<string, unknown>).enzymeClass as string | undefined)}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {((gene as Record<string, unknown>).terpeneProduct as string | undefined) && (
                              <div>
                                <p className="text-xs text-muted-foreground">Produit</p>
                                <p className="font-medium text-green-800 dark:text-green-200">{((gene as Record<string, unknown>).terpeneProduct as string | undefined)}</p>
                              </div>
                            )}
                            {((gene as Record<string, unknown>).productType as string | undefined) && (
                              <div>
                                <p className="text-xs text-muted-foreground">Type</p>
                                <p className="capitalize">{((gene as Record<string, unknown>).productType as string | undefined)}</p>
                              </div>
                            )}
                            {((gene as Record<string, unknown>).species as string | undefined) && (
                              <div>
                                <p className="text-xs text-muted-foreground">Espèce</p>
                                <p className="italic">{((gene as Record<string, unknown>).species as string | undefined)}</p>
                              </div>
                            )}
                            {((gene as Record<string, unknown>).pathway as string | undefined) && (
                              <div>
                                <p className="text-xs text-muted-foreground">Voie</p>
                                <p>{((gene as Record<string, unknown>).pathway as string | undefined)}</p>
                              </div>
                            )}
                            {((gene as Record<string, unknown>).expressionTissue as string | undefined) && (
                              <div className="col-span-2">
                                <p className="text-xs text-muted-foreground">Tissu d'expression</p>
                                <p>{((gene as Record<string, unknown>).expressionTissue as string | undefined)}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Liens externes */}
                          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700 flex flex-wrap gap-2">
                            {((gene as Record<string, unknown>).ncbiGeneId as string | undefined) && (
                              <a 
                                href={`https://www.ncbi.nlm.nih.gov/gene/${((gene as Record<string, unknown>).ncbiGeneId as string | undefined)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                              >
                                NCBI Gene <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {((gene as Record<string, unknown>).uniprotId as string | undefined) && (
                              <a 
                                href={`https://www.uniprot.org/uniprotkb/${((gene as Record<string, unknown>).uniprotId as string | undefined)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                              >
                                UniProt <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          
                          {((gene as Record<string, unknown>).regulationNotes as string | undefined) && (
                            <div className="mt-2 text-xs text-muted-foreground italic">
                              {((gene as Record<string, unknown>).regulationNotes as string | undefined)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Schéma de la voie de biosynthèse */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        Voie de biosynthèse des terpènes
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900">IPP/DMAPP</Badge>
                        <ArrowRight className="h-4 w-4 text-amber-600" />
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900">GPP (C10)</Badge>
                        <ArrowRight className="h-4 w-4 text-amber-600" />
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900">FPP (C15)</Badge>
                        <ArrowRight className="h-4 w-4 text-amber-600" />
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900">GGPP (C20)</Badge>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                        Les TPS catalysent la conversion de ces précurseurs en terpènes spécifiques via des réactions de cyclisation et réarrangement.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dna className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun gène TPS documenté pour cette molécule.</p>
                    <p className="text-sm mt-2">Les informations génomiques sur la biosynthèse seront ajoutées progressivement.</p>
                    <p className="text-xs mt-4 text-muted-foreground/70">
                      Les gènes TPS sont principalement documentés pour les terpènes du cannabis (<em>Cannabis sativa</em>).
                    </p>
                  </div>
                )}
              </div>

              {/* Informations sur les TPS */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">À propos des Terpene Synthases</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Les Terpene Synthases (TPS) constituent une famille multigénique d'enzymes responsables de la diversité des terpènes dans le règne végétal.
                  Chez le cannabis, plus de 30 gènes TPS ont été identifiés, chacun produisant un ou plusieurs terpènes spécifiques.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/varietes">
                    <Button variant="outline" size="sm" className="border-blue-500 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900">
                      <Leaf className="h-4 w-4 mr-2" />
                      Voir les variétés
                    </Button>
                  </Link>
                  <Link href="/genealogy">
                    <Button variant="outline" size="sm" className="border-blue-500 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Arbre généalogique
                    </Button>
                  </Link>
                </div>
              </div>
              </TabErrorBoundary>
            </TabsContent>
  );
}
