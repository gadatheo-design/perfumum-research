import React from 'react';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, ArrowLeft, GitBranch, Dna, Star, BookOpen, Copy, Check, FlaskConical } from "lucide-react";
import { CHEMICAL_CLASS_LABELS } from './molecule-constants';
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


export function MoleculeTransformationsTab({
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
            <TabsContent value="transformations" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Transformations">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  Transformations Moléculaires
                </h2>
                
                {isLoadingTransformations ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : moleculeTransformations?.success && (moleculeTransformations?.asSource.length > 0 || moleculeTransformations?.asProduct.length > 0) ? (
                  <div className="space-y-6">
                    {/* Stats */}
                    {moleculeTransformations?.stats && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {moleculeTransformations?.stats.total} transformation{moleculeTransformations?.stats.total > 1 ? 's' : ''}
                        </Badge>
                        {moleculeTransformations?.stats.totalAsSource > 0 && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            {moleculeTransformations?.stats.totalAsSource} en tant que source
                          </Badge>
                        )}
                        {moleculeTransformations?.stats.totalAsProduct > 0 && (
                          <Badge variant="outline" className="border-red-500 text-red-600">
                            {moleculeTransformations?.stats.totalAsProduct} en tant que produit
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Transformations où cette molécule est source */}
                    {moleculeTransformations?.asSource.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-500" />
                          Cette molécule se transforme en...
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {moleculeTransformations?.asSource.map((t: unknown) => (
                            <div key={((t as Record<string, unknown>).id as string | undefined)} className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-green-700 dark:text-green-300">
                                    {((t as Record<string, unknown>).product_molecule_name as string | undefined)}
                                  </span>
                                  {((t as Record<string, unknown>).product_db_id as string | undefined) && (
                                    <Link href={`/molecules/${((t as Record<string, unknown>).product_db_id as string | undefined)}`}>
                                      <Button variant="ghost" size="sm" className="h-6 px-2">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {((t as Record<string, unknown>).transformation_type as string | undefined)?.replace('_', ' ')}
                                </Badge>
                              </div>
                              {((t as Record<string, unknown>).temperature_optimal as string | undefined) && (
                                <p className="text-xs text-muted-foreground">
                                  <Thermometer className="h-3 w-3 inline mr-1" />
                                  {((t as Record<string, unknown>).temperature_optimal as string | undefined)}°C
                                </p>
                              )}
                              {((t as Record<string, unknown>).olfactory_change_description as string | undefined) && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {((t as Record<string, unknown>).olfactory_change_description as string | undefined)}
                                </p>
                              )}
                              {((t as Record<string, unknown>).relevance_context as string | undefined) && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  {((t as Record<string, unknown>).relevance_context as string | undefined)}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transformations où cette molécule est produit */}
                    {moleculeTransformations?.asProduct.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4 text-red-500" />
                          Cette molécule est produite à partir de...
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {moleculeTransformations?.asProduct.map((t: unknown) => (
                            <div key={((t as Record<string, unknown>).id as string | undefined)} className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-red-700 dark:text-red-300">
                                    {((t as Record<string, unknown>).source_molecule_name as string | undefined)}
                                  </span>
                                  {((t as Record<string, unknown>).source_db_id as string | undefined) && (
                                    <Link href={`/molecules/${((t as Record<string, unknown>).source_db_id as string | undefined)}`}>
                                      <Button variant="ghost" size="sm" className="h-6 px-2">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {((t as Record<string, unknown>).transformation_type as string | undefined)?.replace('_', ' ')}
                                </Badge>
                              </div>
                              {((t as Record<string, unknown>).temperature_optimal as string | undefined) && (
                                <p className="text-xs text-muted-foreground">
                                  <Thermometer className="h-3 w-3 inline mr-1" />
                                  {((t as Record<string, unknown>).temperature_optimal as string | undefined)}°C
                                </p>
                              )}
                              {((t as Record<string, unknown>).olfactory_change_description as string | undefined) && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {((t as Record<string, unknown>).olfactory_change_description as string | undefined)}
                                </p>
                              )}
                              {((t as Record<string, unknown>).relevance_context as string | undefined) && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  {((t as Record<string, unknown>).relevance_context as string | undefined)}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lien vers le graphe cascade */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <GitBranch className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-amber-800 dark:text-amber-200">
                            Visualiser la chaîne de transformation complète
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            Explorez toutes les transformations en cascade de cette molécule
                          </p>
                        </div>
                        <Link href={`/molecular-transformations?molecule=${encodeURIComponent(molecule?.name)}&mode=cascade`}>
                          <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900">
                            <GitBranch className="h-4 w-4 mr-2" />
                            Voir la cascade
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Flame className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune transformation moléculaire documentée pour cette molécule.</p>
                    <p className="text-sm mt-2">Les transformations (pyrolyse, oxydation, etc.) seront ajoutées progressivement.</p>
                    <Link href="/molecular-transformations">
                      <Button variant="outline" className="mt-4">
                        <Flame className="h-4 w-4 mr-2" />
                        Explorer toutes les transformations
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Lien vers la page des transformations */}
              <div className="bg-muted/50 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  Explorez toutes les transformations moléculaires documentées dans notre base de données.
                </p>
                <Link href="/molecular-transformations">
                  <Button variant="outline" className="mt-2">
                    <Flame className="h-4 w-4 mr-2" />
                    Voir toutes les transformations
                  </Button>
                </Link>
              </div>
              </TabErrorBoundary>
            </TabsContent>
  );
}
