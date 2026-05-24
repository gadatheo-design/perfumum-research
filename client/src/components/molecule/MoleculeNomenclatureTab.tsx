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
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import type { MoleculeTabProps } from './molecule-tab-types';
import { Download } from "lucide-react";
import { CHEMICAL_CLASS_LABELS } from './molecule-constants';



// Bouton d'enrichissement PubChem (copie locale)
function PubChemEnrichButton({ moleculeId, moleculeName }: { moleculeId: number; moleculeName: string }) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const enrichMutation = trpc.molecules.enrichFromPubChem.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Enrichissement réussi", description: data.message });
        utils.molecules.getById.invalidate(moleculeId);
      } else {
        toast({ title: "Enrichissement échoué", description: data.message, variant: "destructive" });
      }
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
  return (
    <Button variant="outline" size="sm" onClick={() => enrichMutation.mutate({ moleculeId })} disabled={enrichMutation.isPending} className="gap-2">
      {enrichMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Enrichir via PubChem
    </Button>
  );
}


export function MoleculeNomenclatureTab({
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
            <TabsContent value="nomenclature" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Nomenclature">
              {/* Identités principales */}
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Identité Chimique
                  </h2>
                  {!mol.pubchem_cid && (
                    <PubChemEnrichButton moleculeId={id} moleculeName={molecule?.name} />
                  )}
                </div>

                <div className="space-y-4">
                  {/* Nom commun + formule */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nom commun</p>
                      <p className="text-xl font-bold">{molecule?.name}</p>
                    </div>
                    {mol.formula && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Formule moléculaire</p>
                        <p className="text-xl font-mono font-bold">{mol.formula}</p>
                      </div>
                    )}
                  </div>

                  {/* Nom IUPAC */}
                  {molecule?.iupacName && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide font-medium mb-2">Nom IUPAC (nomenclature systématique)</p>
                      <p className="font-mono text-amber-800 dark:text-amber-200 leading-relaxed">{molecule?.iupacName}</p>
                    </div>
                  )}

                  {/* CAS + Poids moléculaire */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {molecule?.casNumber && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium mb-2">Numéro CAS</p>
                        <p className="text-2xl font-mono font-bold text-blue-800 dark:text-blue-200 mb-2">{molecule?.casNumber}</p>
                        <div className="flex gap-2">
                          <a
                            href={`https://commonchemistry.cas.org/detail?cas_rn=${molecule?.casNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            CAS Common Chemistry <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href={`https://www.chemspider.com/Search.aspx?q=${molecule?.casNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            ChemSpider <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {molecule?.molecularWeight && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Masse moléculaire</p>
                        <p className="text-2xl font-bold">{molecule?.molecularWeight} <span className="text-sm font-normal text-muted-foreground">g/mol</span></p>
                      </div>
                    )}
                  </div>

                  {/* Classe chimique + Famille */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {molecule?.chemicalClass && (
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide font-medium mb-2">Classe chimique</p>
                        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                          {CHEMICAL_CLASS_LABELS[molecule?.chemicalClass] || molecule?.chemicalClass}
                        </p>
                      </div>
                    )}
                    {mol.familyId?.toString() && (
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="text-xs text-primary/70 uppercase tracking-wide font-medium mb-2">Famille olfactive</p>
                        <p className="text-lg font-semibold text-primary">{mol.familyId?.toString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Liens externes */}
              {(mol.pubchem_cid || molecule?.casNumber || mol.formula) && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Bases de données externes
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {mol.pubchem_cid && (
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.pubchem_cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        PubChem CID {mol.pubchem_cid}
                      </a>
                    )}
                    {molecule?.casNumber && (
                      <a
                        href={`https://commonchemistry.cas.org/detail?cas_rn=${molecule?.casNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        CAS Registry
                      </a>
                    )}
                    {mol.formula && (
                      <a
                        href={`https://www.chemspider.com/Search.aspx?q=${encodeURIComponent(mol.formula)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        ChemSpider
                      </a>
                    )}
                    {molecule?.name && (
                      <a
                        href={
                          mol.chebi_id
                            ? `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${mol.chebi_id}`
                            : `https://www.ebi.ac.uk/chebi/advancedSearchFT.do?searchString=${encodeURIComponent(molecule?.name)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors text-sm font-medium"
                        title={mol.chebi_id ? `ChEBI ID: ${mol.chebi_id}` : 'Rechercher dans ChEBI'}
                      >
                        <ExternalLink className="h-4 w-4" />
                        ChEBI{mol.chebi_id ? ` · ${mol.chebi_id}` : ''}
                      </a>
                    )}
                    {mol.wikidataQid && (
                      <a
                        href={`https://www.wikidata.org/entity/${mol.wikidataQid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Wikidata {mol.wikidataQid}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Synonymes PubChem */}
              {Array.isArray(mol.pubchemSynonyms) && mol.pubchemSynonyms && mol.pubchemSynonyms.length > 0 && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Atom className="h-5 w-5 text-primary" />
                    Synonymes PubChem
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {mol.pubchemSynonyms!.length} synonymes
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {mol.pubchemSynonyms!.map((syn, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded text-xs bg-secondary text-secondary-foreground border border-border font-mono hover:bg-secondary/80 transition-colors">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              </TabErrorBoundary>
            </TabsContent>
  );
}
