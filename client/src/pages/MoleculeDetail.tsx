// @ts-nocheck
import React from 'react';
import { Link, useParams } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReferencesList } from "@/components/ReferencesList";
import { trpc } from "@/lib/trpc";
import { useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, FileDown, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Download, RefreshCw, Star, Wine, Plus, Trash2, Search, BookOpen, Copy, Check, FlaskConical, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoleculeDetailSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { RecommendationsCard } from "@/components/RecommendationsCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Molecule3DViewer } from "@/components/Molecule3DViewer";
import { LinkedRecettes, SimilarContent } from "@/components/SeeAlso";
import { SeeAlsoSection } from "@/components/SeeAlsoSection";
import { LinkedReferences } from "@/components/LinkedReferences";
import { AIClassificationSuggestion } from "@/components/AIClassificationSuggestion";
import { MoleculeAnalyticalMethods } from "@/components/MoleculeAnalyticalMethods";
import { IFRAStatusBadge } from "@/components/IFRAStatusBadge";
import { TherapeuticPropertiesTab } from "@/components/TherapeuticPropertiesTab";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";
import { EuropeanaWidget } from "@/components/EuropeanaWidget";
import { useBreadcrumbSegments } from "@/contexts/BreadcrumbContext";
import type { MoleculeExtended } from "../../../../shared/domain-types";
import { PerfumesTab, Structure3DTab, SynergiesTab, RecetteSynergiesSection, PyrfumeSection, SimilarMolecules, MoleculeNomenclatureTab, MoleculeOverviewTab, MoleculeScientificTab, MoleculeTransformationsTab, MoleculeBiosynthesisTab, MoleculeKGTab } from '@/components/molecule';

// Composant carte article PubMed avec bouton d'import dans PERFUMUM
function PubMedArticleCard({ art, moleculeId, moleculeName }: {
  art: { pmid: string; title?: string; firstAuthor?: string; year?: number; journal?: string; doi?: string | null; url: string };
  moleculeId: number;
  moleculeName: string;
}) {
  const { toast } = useToast();
  const importMutation = trpc.bibliography.importFromPubMed.useMutation({
    onSuccess: (data) => {
      toast({
        title: data.alreadyExisted ? 'Déjà dans PERFUMUM' : 'Importé dans PERFUMUM',
        description: data.alreadyExisted
          ? 'Cette référence existe déjà dans la bibliothèque.'
          : 'Article ajouté à la bibliothèque et lié à la molécule.',
      });
    },
    onError: (err) => {
      toast({ title: 'Erreur import', description: err.message, variant: 'destructive' });
    },
  });

  return (
    <Card className="hover:shadow-sm transition-shadow border-blue-100 dark:border-blue-900/30">
      <CardContent className="p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug line-clamp-2">{art.title || 'Sans titre'}</p>
          <Badge variant="outline" className="shrink-0 text-xs border-blue-300 text-blue-600">PubMed</Badge>
        </div>
        {art.firstAuthor && (
          <p className="text-xs text-muted-foreground">{art.firstAuthor} et al.</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {art.year && <span>{art.year}</span>}
          {art.journal && <span className="italic line-clamp-1">{art.journal}</span>}
        </div>
        <div className="flex items-center justify-between mt-2">
          <a
            href={art.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {art.doi ? `DOI: ${art.doi}` : `PMID: ${art.pmid}`}
          </a>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400"
            disabled={importMutation.isPending}
            onClick={() => importMutation.mutate({
              pmid: art.pmid,
              title: art.title || 'Sans titre',
              firstAuthor: art.firstAuthor,
              year: art.year,
              journal: art.journal,
              doi: art.doi,
              url: art.url,
              moleculeId,
              moleculeName,
            })}
          >
            {importMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            Importer dans PERFUMUM
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant indicateur de statut PubChem
function PubChemStatusBadge({ hasPubChem, pubchemCid }: { hasPubChem: boolean; pubchemCid?: number }) {
  if (hasPubChem && pubchemCid) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800 gap-1 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/50">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                PubChem
              </Badge>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Données validées via PubChem (CID: {pubchemCid})</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 gap-1">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Non validé
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Données non encore validées via PubChem</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Composant indicateur de statut ChEBI
function ChEBIStatusBadge({ hasChebi, chebiId }: { hasChebi: boolean; chebiId?: string }) {
  if (hasChebi && chebiId) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a 
              href={`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${chebiId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800 gap-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                ChEBI
              </Badge>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Données validées via ChEBI (ID: {chebiId})</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return null; // Pas de badge si pas de données ChEBI
}

// Composant bouton d'enrichissement PubChem
function PubChemEnrichButton({ moleculeId, moleculeName }: { moleculeId: number; moleculeName: string }) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const enrichMutation = trpc.molecules.enrichFromPubChem.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Enrichissement réussi",
          description: data.message,
        });
        utils.molecules.getById.invalidate(moleculeId);
      } else {
        toast({
          title: "Enrichissement échoué",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => enrichMutation.mutate({ moleculeId })}
      disabled={enrichMutation.isPending}
      className="gap-2"
    >
      {enrichMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Enrichir via PubChem
    </Button>
  );
}

// Mapping des classes chimiques pour l'affichage
const chemicalClassLabels: Record<string, string> = {
  terpene: "Terpène",
  sesquiterpene: "Sesquiterpène",
  diterpene: "Diterpène",
  monoterpene: "Monoterpène",
  aldehyde: "Aldéhyde",
  ketone: "Cétone",
  alcohol: "Alcool",
  ester: "Ester",
  ether: "Éther",
  phenol: "Phénol",
  lactone: "Lactone",
  coumarin: "Coumarine",
  musk: "Musc",
  nitrile: "Nitrile",
  sulfur_compound: "Composé soufré",
  heterocyclic: "Hétérocyclique",
  aromatic: "Aromatique",
  aliphatic: "Aliphatique",
  other: "Autre",
};

// Mapping des types de restriction IFRA
const restrictionTypeLabels: Record<string, { label: string; color: string }> = {
  prohibited: { label: "Interdit", color: "bg-red-500" },
  restricted: { label: "Restreint", color: "bg-orange-500" },
  specification: { label: "Spécification", color: "bg-yellow-500" },
  no_restriction: { label: "Sans restriction", color: "bg-green-500" },
};

// Catégories IFRA avec descriptions
const ifraCategoryDescriptions: Record<string, string> = {
  category1: "Produits à appliquer sur les lèvres",
  category2: "Produits à appliquer sur les aisselles",
  category3: "Produits à appliquer sur le visage/corps (rinçables)",
  category4: "Parfums fins",
  category5a: "Produits pour le corps (non rinçables)",
  category5b: "Produits pour le visage (non rinçables)",
  category5c: "Produits pour les mains (non rinçables)",
  category5d: "Produits pour bébés",
  category6: "Produits pour la bouche",
  category7a: "Produits capillaires (rinçables)",
  category7b: "Produits capillaires (non rinçables)",
  category8: "Produits intimes",
  category9: "Produits ménagers",
  category10a: "Détergents (contact prolongé)",
  category10b: "Détergents (contact bref)",
  category11a: "Parfums d'ambiance (spray)",
  category11b: "Parfums d'ambiance (autres)",
};

// Composant pour afficher les transformations pyrolytiques d'une molécule
function PyrolysisSection({ moleculeName }: { moleculeName: string }) {
  const { data: transformations, isLoading } = trpc.molecules.getPyrolysisTransformations.useQuery(moleculeName, {
    enabled: !!moleculeName,
  });

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const hasTransformations = transformations && transformations?.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Transformations Pyrolytiques
        </h2>
        
        <p className="text-sm text-muted-foreground mb-6">
          La pyrolyse est la décomposition thermique des molécules en l'absence d'oxygène. 
          Cette section présente les produits de dégradation thermique de cette molécule à différentes températures.
        </p>
        
        {hasTransformations ? (
          <div className="space-y-4">
            {transformations?.map((t: unknown, idx: number) => (
              <div key={idx} className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Thermometer className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.source_molecule} → {t.product_molecule}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.temperature_min}-{t.temperature_max}°C ({t.zone_name})
                      </p>
                    </div>
                  </div>
                  {t.toxicity_level && (
                    <Badge variant="outline" className={`
                      ${t.toxicity_level === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                      ${t.toxicity_level === 'medium' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : ''}
                      ${t.toxicity_level === 'low' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                      ${t.toxicity_level === 'none' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                    `}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Toxicité {t.toxicity_level === 'high' ? 'Élevée' : t.toxicity_level === 'medium' ? 'Moyenne' : t.toxicity_level === 'low' ? 'Faible' : 'Nulle'}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {t.olfactory_before && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Profil olfactif avant</p>
                      <p className="italic">{t.olfactory_before}</p>
                    </div>
                  )}
                  {t.olfactory_after && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Profil olfactif après</p>
                      <p className="italic">{t.olfactory_after}</p>
                    </div>
                  )}
                </div>
                
                {t.mechanism && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Mécanisme</p>
                    <p className="text-sm">{t.mechanism}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune transformation pyrolytique documentée pour cette molécule.</p>
            <p className="text-sm mt-2">Les données de pyrolyse seront ajoutées progressivement.</p>
          </div>
        )}
      </div>
      
      {/* Lien vers la page de pyrolyse */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Explorez toutes les transformations pyrolytiques documentées dans notre base de données.
        </p>
        <Link href="/pyrolysis">
          <Button variant="outline" className="mt-2">
            <Flame className="h-4 w-4 mr-2" />
            Voir toutes les transformations pyrolytiques
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Modal d'ajout d'une plante source
function AddPlantSourceModal({ moleculeId, onSuccess }: { moleculeId: number; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [role, setRole] = useState('secondaire');
  const [percentageTypical, setPercentageTypical] = useState('');
  const [isSignature, setIsSignature] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: searchResults, isLoading: searching } = trpc.plants.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const addLink = trpc.plantMoleculeLinks.create.useMutation({
    onSuccess: () => {
      toast({ title: 'Plante source ajoutée', description: `${selectedPlant?.name} liée à cette molécule.` });
      utils.plantMoleculeLinks.getByMolecule.invalidate({ moleculeId });
      setOpen(false);
      setSearchQuery('');
      setSelectedPlant(null);
      setPercentageTypical('');
      setRole('secondaire');
      setIsSignature(false);
      onSuccess();
    },
    onError: (err: Error) => {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    },
  });

  const handleAdd = () => {
    if (!selectedPlant) return;
    addLink.mutate({
      plantId: selectedPlant.id,
      moleculeId,
      role,
      percentageTypical: percentageTypical ? parseFloat(percentageTypical) : undefined,
      isSignature: isSignature ? 1 : 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-4 w-4" />
          Ajouter une plante source
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-500" />
            Lier une plante source
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Recherche de plante */}
          <div>
            <label className="text-sm font-medium mb-1 block">Rechercher une plante</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nom commun ou latin (min. 2 caractères)..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setSelectedPlant(null); }}
                className="pl-9"
              />
            </div>
            {searching && <p className="text-xs text-muted-foreground mt-1">Recherche...</p>}
            {searchResults && searchResults?.length > 0 && !selectedPlant && (
              <div className="mt-1 border rounded-md bg-popover shadow-md max-h-48 overflow-y-auto">
                {searchResults?.map((plant: unknown) => (
                  <button
                    key={plant.id}
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
                    onClick={() => { setSelectedPlant(plant); setSearchQuery(plant.name); }}
                  >
                    <span className="font-medium">{plant.name}</span>
                    {(plant.latinName || plant.latin_name) && (
                      <span className="ml-2 text-xs italic text-muted-foreground">{plant.latinName || plant.latin_name}</span>
                    )}
                    <span className="ml-2 text-xs text-muted-foreground capitalize">[{plant.category}]</span>
                  </button>
                ))}
              </div>
            )}
            {selectedPlant && (
              <div className="mt-1 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-400">{selectedPlant.name}</span>
                <button onClick={() => { setSelectedPlant(null); setSearchQuery(''); }} className="text-muted-foreground hover:text-foreground">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Rôle */}
          <div>
            <label className="text-sm font-medium mb-1 block">Rôle dans la plante</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="majeur">Majeur</SelectItem>
                <SelectItem value="secondaire">Secondaire</SelectItem>
                <SelectItem value="trace">Trace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pourcentage */}
          <div>
            <label className="text-sm font-medium mb-1 block">Pourcentage typique (optionnel)</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="ex: 2.5"
                value={percentageTypical}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPercentageTypical(e.target.value)}
                min="0" max="100" step="0.1"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
          </div>

          {/* Signature */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isSignature"
              checked={isSignature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsSignature(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isSignature" className="text-sm">Molécule signature de cette plante</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedPlant || addLink.isPending}
              className="gap-1"
            >
              {addLink.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Lier la plante
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour afficher les plantes sources d'une molécule
function PlantSourcesSection({ moleculeId }: { moleculeId: number }) {
  const { data: plantSources, isLoading, refetch } = trpc.plantMoleculeLinks.getByMolecule.useQuery({ moleculeId });
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const removeLink = trpc.plantMoleculeLinks.delete.useMutation({
    onSuccess: () => {
      toast({ title: 'Liaison supprimée' });
      utils.plantMoleculeLinks.getByMolecule.invalidate({ moleculeId });
    },
    onError: (err: Error) => {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Plantes Sources
            {plantSources && plantSources?.length > 0 && (
              <Badge variant="secondary">{plantSources?.length}</Badge>
            )}
          </h2>
          <AddPlantSourceModal moleculeId={moleculeId} onSuccess={() => {}} />
        </div>
        
        {plantSources && plantSources?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plantSources?.map((source: unknown) => (
              <div key={source.plant.id} className="relative group">
                <Link href={`/plants/${source.plant.id}`}>
                  <div className="p-4 bg-muted/50 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-primary">{source.plant.name}</h3>
                        {source.plant.latinName && (
                          <p className="text-sm italic text-muted-foreground">{source.plant.latinName}</p>
                        )}
                      </div>
                      {source.isSignature === 1 && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Signature
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      {source.percentageTypical && (
                        <div>
                          <p className="text-xs text-muted-foreground">Typique</p>
                          <p className="font-mono font-semibold">{source.percentageTypical}%</p>
                        </div>
                      )}
                      {source.percentageMin && source.percentageMax && (
                        <div>
                          <p className="text-xs text-muted-foreground">Plage</p>
                          <p className="font-mono">{source.percentageMin}-{source.percentageMax}%</p>
                        </div>
                      )}
                      {source.role && (
                        <div>
                          <p className="text-xs text-muted-foreground">Rôle</p>
                          <Badge variant="outline" className="text-xs">
                            {source.role === 'majeur' ? 'Majeur' :
                             source.role === 'secondaire' ? 'Secondaire' :
                             source.role === 'trace' ? 'Trace' : source.role}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {source.plant.category && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="capitalize">{source.plant.category}</span>
                        {source.plant.origin && (
                          <>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span>{source.plant.origin}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
                {/* Bouton de suppression */}
                <button
                  onClick={(e) => { e.preventDefault(); removeLink.mutate({ plantId: source.plant.id, moleculeId }); }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-destructive/10 hover:bg-destructive/20 text-destructive"
                  title="Supprimer cette liaison"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Leaf className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune plante source documentée pour cette molécule.</p>
            <p className="text-sm mt-2">Les informations sur les sources botaniques seront ajoutées progressivement.</p>
          </div>
        )}
      </div>
      
      {/* Lien vers la page des plantes */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Explorez toutes les plantes et variétés documentées dans notre base de données.
        </p>
        <div className="flex gap-2 mt-2">
          <Link href="/plants">
            <Button variant="outline">
              <Leaf className="h-4 w-4 mr-2" />
              Voir toutes les plantes
            </Button>
          </Link>
          <Link href="/varietes">
            <Button variant="outline">
              <Beaker className="h-4 w-4 mr-2" />
              Voir les variétés
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MoleculeDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: molecule, isLoading } = trpc.molecules.getById.useQuery(id);
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  // Breadcrumb dynamique avec le nom de la molécule
  useBreadcrumbSegments(
    molecule ? [
      { label: "Molécules", path: "/molecules" },
      { label: molecule?.name, path: `/molecule/${id}` },
    ] : null,
    [molecule?.name, id]
  );

  const applyAIClassificationMutation = trpc.molecules.applyAIClassification.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Classification appliquée",
          description: `Champs mis à jour : ${data.updatedFields?.join(', ')}`,
        });
        utils.molecules.getById.invalidate(id);
      }
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
  const applyAINotesMutation = trpc.molecules.applyAINotes.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Notes appliquées",
          description: "Les notes du chercheur IA ont été enregistrées.",
        });
        utils.molecules.getById.invalidate(id);
      }
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  // Récupérer les origines géographiques de la molécule
  const { data: moleculeOrigins, isLoading: isLoadingOrigins } = trpc.moleculeOrigins?.getByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les restrictions IFRA de la molécule
  const { data: ifraRestrictions, isLoading: isLoadingIfra } = trpc.ifraRestrictions?.getByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les recommandations
  const { data: recommendations, isLoading: isLoadingRecommendations } = trpc.recommendations?.similarMolecules?.useQuery(
    {
      moleculeId: id,
      limit: 5,
    },
    { enabled: !!molecule }
  );

  // Récupérer les recettes qui utilisent cette molécule
  const { data: linkedRecettes, isLoading: isLoadingRecettes } = trpc.crossLinks.getRecettesByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les molécules similaires
  const { data: similarMolecules, isLoading: isLoadingSimilar } = trpc.crossLinks.getSimilarMolecules.useQuery(
    { moleculeId: id, limit: 5 },
    { enabled: !!molecule }
  );

  // Récupérer les transformations moléculaires liées à cette molécule
  const { data: moleculeTransformations, isLoading: isLoadingTransformations } = trpc.research.getTransformationsByMolecule.useQuery(
    { moleculeId: id, moleculeName: molecule?.name },
    { enabled: !!molecule }
  );

  // Récupérer les gènes TPS (Terpene Synthases) associés à cette molécule
  const { data: tpsGenes, isLoading: isLoadingTps } = trpc.molecules.getTpsGenes.useQuery(id, {
    enabled: !!molecule,
  });

  // NOSE Phase 1 — Émissions olfactives GC-MS pour cette molécule
  const { data: olfactiveEmissions } = trpc.olfactiveEmissions?.getByMolecule.useQuery(
    { moleculeId: id, limit: 100 },
    { enabled: !!molecule }
  );

  // Phase 8F — Publications scientifiques OpenAlex
  const { data: scientificPubs } = trpc.bibliographySources.getByMolecule.useQuery(
    { moleculeId: id },
    { enabled: !!molecule }
  );

  // Publications PubChem en temps réel (via PubMed)
  const { data: pubchemLiterature, isLoading: loadingPubchemLit } = trpc.bibliographySources.getPubChemLiterature.useQuery(
    { pubchemCid: molecule?.pubchem_cid ?? 0 },
    { enabled: !!molecule?.pubchem_cid }
  );

  // Badge Bibliographie — références PERFUMUM liées à cette molécule
  const { data: bibliographyRefs } = trpc.bibliography.getByMolecule.useQuery(
    { moleculeId: id },
    { enabled: !!molecule }
  );

  // Sprint 4 — Fils narratifs liés à cette molécule
  const { data: moleculeStorylines } = trpc.storylines.getByMolecule.useQuery(
    { moleculeId: id },
    { enabled: !!molecule }
  );

  // Export PDF function
  const exportPDF = useCallback(async () => {
    if (!molecule) return;
    setIsExporting(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Veuillez autoriser les pop-ups pour exporter le PDF');
        return;
      }

      // Generate HTML content for PDF
      const radarValues = [
        { axis: 'Intensité', value: molecule?.radarIntensity || 50 },
        { axis: 'Fraîcheur', value: molecule?.radarFreshness || 50 },
        { axis: 'Chaleur', value: molecule?.radarWarmth || 50 },
        { axis: 'Douceur', value: molecule?.radarSweetness || 50 },
        { axis: 'Épices', value: molecule?.radarSpiciness || 50 },
        { axis: 'Terreux', value: molecule?.radarEarthiness || 50 },
      ];

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${molecule?.name} - Fiche Molécule PERFUMUM</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
            h1 { color: #7c3aed; margin-bottom: 5px; }
            h2 { color: #5b21b6; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
            .formula { font-family: monospace; font-size: 1.2em; color: #666; margin-bottom: 20px; }
            .badge { display: inline-block; background: #f3e8ff; color: #7c3aed; padding: 6px 16px; border-radius: 20px; font-weight: 600; margin-right: 8px; }
            .badge-cas { background: #e0f2fe; color: #0369a1; }
            .badge-iupac { background: #fef3c7; color: #92400e; font-size: 0.9em; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
            .card { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .card-title { font-weight: 600; color: #374151; margin-bottom: 8px; }
            .card-value { font-size: 1.5em; font-weight: bold; color: #7c3aed; }
            .card-unit { font-size: 0.8em; font-weight: normal; color: #666; }
            .radar-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .radar-table th, .radar-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .radar-table th { background: #f3f4f6; font-weight: 600; }
            .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; }
            .progress-fill { background: #7c3aed; height: 100%; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 0.9em; }
            .scientific-info { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>${molecule?.name}</h1>
          ${molecule?.chemicalFormula ? `<p class="formula">${molecule?.chemicalFormula}</p>` : ''}
          <div style="margin-bottom: 20px;">
            ${molecule?.family ? `<span class="badge">${molecule?.family}</span>` : ''}
            ${molecule?.chemicalClass ? `<span class="badge">${chemicalClassLabels[molecule?.chemicalClass] || molecule?.chemicalClass}</span>` : ''}
            ${molecule?.casNumber ? `<span class="badge badge-cas">CAS: ${molecule?.casNumber}</span>` : ''}
          </div>
          
          ${molecule?.iupacName ? `
            <div class="scientific-info">
              <strong>Nom IUPAC:</strong> ${molecule?.iupacName}
            </div>
          ` : ''}
          
          ${molecule?.olfactiveProfile ? `
            <h2>🌿 Profil Olfactif</h2>
            <p>${molecule?.olfactiveProfile}</p>
          ` : ''}
          
          ${molecule?.emotionalResonance ? `
            <h2>⚡ Résonance Émotionnelle</h2>
            <p>${molecule?.emotionalResonance}</p>
          ` : ''}
          
          <h2>📊 Propriétés Scientifiques</h2>
          <div class="grid">
            ${molecule?.molecularWeight ? `<div class="card"><div class="card-title">Masse Moléculaire</div><div class="card-value">${molecule?.molecularWeight} <span class="card-unit">g/mol</span></div></div>` : ''}
            ${molecule?.boilingPoint ? `<div class="card"><div class="card-title">Point d'Ébullition</div><div class="card-value">${molecule?.boilingPoint} <span class="card-unit">°C</span></div></div>` : ''}
            ${molecule?.intensity ? `<div class="card"><div class="card-title">Intensité Olfactive</div><div class="card-value">${molecule?.intensity}%</div></div>` : ''}
            ${molecule?.volatility ? `<div class="card"><div class="card-title">Volatilité</div><div class="card-value">${molecule?.volatility}%</div></div>` : ''}
          </div>
          
          <h2>🎯 Profil Radar Olfactif</h2>
          <table class="radar-table">
            <thead><tr><th>Axe</th><th>Valeur</th><th>Visualisation</th></tr></thead>
            <tbody>
              ${radarValues.map(r => `
                <tr>
                  <td>${r.axis}</td>
                  <td><strong>${r.value}</strong>/100</td>
                  <td><div class="progress-bar"><div class="progress-fill" style="width: ${r.value}%"></div></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${molecule?.sourceOrigin ? `
            <h2>🌱 Origine</h2>
            <p>${molecule?.sourceOrigin}</p>
          ` : ''}
          
          ${molecule?.concentration ? `
            <h2>💧 Concentration Recommandée</h2>
            <p style="font-size: 1.3em; font-weight: bold; color: #7c3aed;">${molecule?.concentration}</p>
          ` : ''}
          
          ${molecule?.notes ? `
            <h2>📝 Notes de Recherche</h2>
            <p>${molecule?.notes}</p>
          ` : ''}
          
          <div class="footer">
            <p>PERFUMUM — Recherche Olfactive | Exporté le ${new Date().toLocaleDateString('fr-FR')}</p>
            <p>Document généré automatiquement à partir de la base de données PERFUMUM</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    } finally {
      setIsExporting(false);
    }
  }, [molecule]);

  // Track page view
  useEffect(() => {
    if (molecule) {
      trackEvent.mutate({
        eventType: "molecule_view",
        entityId: molecule?.id,
        entityType: "molecule",
        metadata: JSON.stringify({
          moleculeName: molecule?.name,
          family: molecule?.family,
          source: "molecule_detail",
        }),
      });
    }
  }, [molecule?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Breadcrumbs />
        <div className="container py-8">
          <MoleculeDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!molecule) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container max-w-6xl">
          <Link href="/molecules" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour aux molécules
          </Link>
          <h1 className="text-2xl font-bold mb-4">Molécule introuvable</h1>
          <p className="text-muted-foreground">
            La molécule demandée n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // NORMALISATION DES CHAMPS JSON — évite les crashes sur .map/.toLowerCase()
  // ============================================================================
  // Cast typé unique — remplace tous les `(molecule as any).xxx`
  const mol = molecule as unknown as MoleculeExtended;

  /** Convertit un champ DB (null | string | string[] | JSON string) en string propre */
  const asString = (val: unknown): string => {
    if (!val) return "";
    if (typeof val === "string") {
      // Tenter de parser si ça ressemble à du JSON
      const trimmed = val.trim();
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.join(", ");
          if (typeof parsed === "object") return JSON.stringify(parsed);
        } catch { /* ignore */ }
      }
      return val;
    }
    if (Array.isArray(val)) return (val as string[]).filter(Boolean).join(", ");
    return String(val);
  };

  /** Convertit un champ DB (null | string | string[] | JSON string) en string[] */
  const asArray = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return (val as unknown[]).map(String).filter(Boolean);
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
        } catch { /* ignore */ }
      }
      return trimmed ? [trimmed] : [];
    }
    return [String(val)];
  };

  /** Normalise references — toujours un tableau d'objets valides */
  const safeReferences = (() => {
    const refs = mol.references;
    if (!refs) return [];
    if (Array.isArray(refs)) return refs;
    if (typeof refs === "string") {
      try { const p = JSON.parse(refs); return Array.isArray(p) ? p : []; } catch { return []; }
    }
    return [];
  })();

  // Champs normalisés — priorité aux colonnes JSON standardisées
  const normOlfactiveProfile = asArray(mol.olfactiveProfileJson ?? molecule?.olfactiveProfile);
  const normTherapeuticProperties = (() => {
    const jsonArr = mol.therapeuticPropertiesJson;
    if (Array.isArray(jsonArr) && jsonArr.length > 0) return jsonArr.join(", ");
    return asString(molecule?.therapeuticProperties);
  })();
  const normBotanicalSources = asString(molecule?.botanicalSources);
  const normOlfactiveProfileStr = normOlfactiveProfile.join(". ");

  // Préparer les données pour le radar chart
  const radarData = [
    { axis: "Intensité", value: molecule?.radarIntensity || 50 },
    { axis: "Fraîcheur", value: molecule?.radarFreshness || 50 },
    { axis: "Chaleur", value: molecule?.radarWarmth || 50 },
    { axis: "Douceur", value: molecule?.radarSweetness || 50 },
    { axis: "Épices", value: molecule?.radarSpiciness || 50 },
    { axis: "Terreux", value: molecule?.radarEarthiness || 50 },
  ];

  const hasRadarData = radarData.some(d => d.value !== 50);

  // Vérifier si la molécule a des restrictions IFRA
  const hasIfraRestrictions = ifraRestrictions && ifraRestrictions?.length > 0;
  const primaryRestriction = hasIfraRestrictions ? ifraRestrictions[0] : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-6xl">
        <Breadcrumbs 
          customItems={[
            { label: "Molécules", path: "/molecules" },
            { label: molecule?.name }
          ]} 
        />
        <div className="flex items-center justify-between mb-6">
          <Link href="/molecules" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Retour aux molécules
          </Link>
          <Button
            onClick={exportPDF}
            disabled={isExporting}
            variant="outline"
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Exporter PDF
          </Button>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{molecule?.name}</h1>
                {molecule?.chemicalFormula && (
                  <p className="text-xl text-muted-foreground font-mono mb-4">
                    {molecule?.chemicalFormula}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {molecule?.family && (
                    <Badge variant="secondary" className="text-sm">
                      {molecule?.family}
                    </Badge>
                  )}
                  {molecule?.chemicalClass && (
                    <Badge variant="outline" className="text-sm">
                      <Beaker className="h-3 w-3 mr-1" />
                      {chemicalClassLabels[molecule?.chemicalClass] || molecule?.chemicalClass}
                    </Badge>
                  )}
                  {molecule?.casNumber && (
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                      CAS: {molecule?.casNumber}
                    </Badge>
                  )}
                  {hasIfraRestrictions && primaryRestriction?.restrictionType && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge 
                            className={`text-sm text-white ${restrictionTypeLabels[primaryRestriction.restrictionType]?.color || 'bg-gray-500'}`}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            IFRA: {restrictionTypeLabels[primaryRestriction.restrictionType]?.label || primaryRestriction.restrictionType}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voir les restrictions IFRA ci-dessous</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {/* Indicateurs de statut d'enrichissement */}
                  <PubChemStatusBadge 
                    hasPubChem={!!mol.pubchem_cid} 
                    pubchemCid={mol.pubchem_cid ?? undefined} 
                  />
                  <ChEBIStatusBadge 
                    hasChebi={!!mol.chebi_id} 
                    chebiId={mol.chebi_id ?? undefined} 
                  />
                  {/* Badge IFRA pour le statut réglementaire */}
                  <IFRAStatusBadge 
                    status={mol.ifraStatus ?? undefined} 
                    maxPercent={mol.ifraData?.maxPercent}
                    reason={mol.ifraData?.reason}
                  />
                  {/* Badge CITES — matières animales protégées */}
                  {(() => {
                    const citesKeywords = ['Ambre Gris', 'Castoreum', 'Hyraceum', 'Civette', 'Civettone', 'Muscone', 'Musc de Daim', 'Musc de Chevrotain'];
                    const synthAlternatives: Record<string, string> = {
                      'Ambre Gris': 'Ambroxan (dérivé de Sclareol)',
                      'Castoreum': 'Castoréum synthétique — mélange Birch Tar + Phenols',
                      'Hyraceum': 'Ambroxan + Civettone synthétique',
                      'Civette': 'Civettone synthétique (Ruzicka 1926)',
                      'Civettone': 'Civettone synthétique (Ruzicka 1926)',
                      'Muscone': 'Muscone synthétique / Habanolide / Exaltolide',
                    };
                    const matchedKey = citesKeywords.find(k => molecule?.name?.toLowerCase().includes(k.toLowerCase()));
                    if (!matchedKey) return null;
                    const altText = Object.keys(synthAlternatives).find(k => molecule?.name?.includes(k));
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="text-sm bg-red-600 text-white border-red-700 gap-1 cursor-help">
                              <AlertTriangle className="h-3 w-3" />
                              CITES
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-semibold text-red-600 mb-1">⚠️ Matière animale protégée (CITES)</p>
                            <p className="text-xs mb-2">Cette substance est issue d’une espèce protégée par la Convention sur le commerce international des espèces sauvages menacées d’extinction. Son utilisation en parfumerie nécessite des alternatives synthétiques.</p>
                            {altText && (
                              <p className="text-xs font-medium text-green-700">✨ Alternative recommandée : {synthAlternatives[altText]}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })()}

                  {/* Badge validation_status */}
                  {(() => {
                    const vs = mol.validationStatus;
                    if (!vs || vs === 'valide') return null;
                    const cfg: Record<string, { label: string; icon: string; cls: string }> = {
                      brouillon: { label: 'Brouillon', icon: '📝', cls: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600' },
                      en_revision: { label: 'En révision', icon: '🔍', cls: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700' },
                      rejete: { label: 'Rejeté', icon: '⚠️', cls: 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700' },
                    };
                    const c = cfg[vs];
                    if (!c) return null;
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className={`text-sm ${c.cls}`}>
                              {c.icon} {c.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Statut de validation : {c.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })()}

                  {/* Badge Résines & Encens — affiché si la molécule est liée à une résine */}
                  {(() => {
                    const resinKeywords = [
                      'résine', 'resine', 'encens', 'oliban', 'myrrhe', 'benjoin', 'labdanum',
                      'opoponax', 'hashish', 'hashishène', 'oud', 'agarwood', 'mastic', 'dammar',
                      'sandaraque', 'copal', 'élemi', 'galbanum', 'styrax', 'kyara', 'boswellia',
                      'commiphora', 'aquilaria', 'pistacia', 'shorea', 'tetraclinis', 'bursera',
                      'incensole', 'boswellique', 'agarofuran', 'hashishene',
                    ];
                    const searchText = [
                      molecule?.name,
                      molecule?.notes,
                      molecule?.family,
                      molecule?.sourceOrigin,
                      mol.botanicalSources,
                    ].filter(Boolean).join(' ').toLowerCase();
                    const isResinMolecule = resinKeywords.some(kw => searchText.includes(kw));
                    if (!isResinMolecule) return null;
                    return (
                      <Link href="/resines-encens">
                        <Badge
                          variant="outline"
                          className="text-sm bg-amber-950/30 border-amber-700/50 text-amber-400 hover:border-amber-600 hover:bg-amber-950/50 cursor-pointer transition-colors gap-1"
                          title="Voir la page Maturation des Résines & Encens"
                        >
                          <span>🔥</span>
                          Résines & Encens
                        </Badge>
                      </Link>
                    );
                  })()}

                  {/* Badge Procédés d'extraction — affiché si la molécule a une méthode d'extraction ou des sources botaniques */}
                  {(() => {
                    // Correspondance extractionMethod → ID du procédé dans /extraction-procedes
                    const extractionMethodMap: Record<string, { id: string; label: string; icon: string }> = {
                      'distillation': { id: 'hydrodistillation', label: 'Hydrodistillation', icon: '💧' },
                      'co2_supercritique': { id: 'co2_supercritique', label: 'CO₂ Supercritique', icon: '⚗️' },
                      'co2_sous_critique': { id: 'co2_sous_critique', label: 'CO₂ Sous-critique', icon: '⚗️' },
                      'expression': { id: 'expression_froide', label: 'Expression à froid', icon: '🍋' },
                      'extraction_solvant': { id: 'extraction_solvant', label: 'Extraction solvant', icon: '🧪' },
                      'teinture': { id: 'maceration', label: 'Macération / Teinture', icon: '🌿' },
                      'percolation_froide': { id: 'percolation_froide', label: 'Percolation à froid', icon: '❄️' },
                    };
                    // Détection par extractionMethod ou par mots-clés dans les champs texte
                    const extractionMethodVal = (mol as unknown as Record<string, unknown>).extractionMethod as string | undefined;
                    let procede = extractionMethodVal ? extractionMethodMap[extractionMethodVal] : undefined;
                    if (!procede) {
                      const searchText = [
                        molecule?.name, molecule?.notes, molecule?.family, molecule?.sourceOrigin,
                        mol.botanicalSources, extractionMethodVal,
                      ].filter(Boolean).join(' ').toLowerCase();
                      if (searchText.includes('distill') || searchText.includes('vapeur')) procede = extractionMethodMap['distillation'];
                      else if (searchText.includes('co2') || searchText.includes('supercritique')) procede = extractionMethodMap['co2_supercritique'];
                      else if (searchText.includes('expression') || searchText.includes('cold press')) procede = extractionMethodMap['expression'];
                      else if (searchText.includes('solvant') || searchText.includes('absolu') || searchText.includes('concrète')) procede = extractionMethodMap['extraction_solvant'];
                      else if (searchText.includes('enfleurage')) procede = { id: 'enfleurage', label: 'Enfleurage', icon: '🌸' };
                    }
                    if (!procede) return null;
                    return (
                      <Link href={`/extraction-procedes?focus=${procede.id}`}>
                        <Badge
                          variant="outline"
                          className="text-sm bg-sky-950/30 border-sky-700/50 text-sky-400 hover:border-sky-600 hover:bg-sky-950/50 cursor-pointer transition-colors gap-1"
                          title={`Voir le procédé ${procede.label} dans la page Procédés d'extraction`}
                        >
                          <span>{procede.icon}</span>
                          {procede.label}
                        </Badge>
                      </Link>
                    );
                  })()}

                  {/* Badge Bibliographie — affiché si des références sont liées à cette molécule */}
                  {bibliographyRefs && bibliographyRefs?.length > 0 && (
                    <Link href={`/bibliographie?molecule=${id}`}>
                      <Badge
                        variant="outline"
                        className="text-sm bg-violet-950/30 border-violet-700/50 text-violet-400 hover:border-violet-600 hover:bg-violet-950/50 cursor-pointer transition-colors gap-1"
                        title={`${bibliographyRefs?.length} référence${bibliographyRefs?.length > 1 ? 's' : ''} bibliographique${bibliographyRefs?.length > 1 ? 's' : ''} liée${bibliographyRefs?.length > 1 ? 's' : ''}`}
                      >
                        <BookOpen className="h-3 w-3" />
                        Bibliographie ({bibliographyRefs?.length})
                      </Badge>
                    </Link>
                  )}

                  {/* Badge inter-domaines : lien vers la page /correlations */}
                  <Link href={`/correlations?q=${encodeURIComponent(molecule?.name)}`}>
                    <Badge
                      variant="outline"
                      className="text-sm bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:border-violet-500/60 cursor-pointer transition-colors"
                      title="Voir les corrélations inter-domaines pour cette molécule"
                    >
                      <GitBranch className="h-3 w-3 mr-1" />
                      Corrélations
                    </Badge>
                  </Link>
                </div>
              </div>
            </div>
            
          </div>

          {/* Tabs pour organiser le contenu */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-10">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="gcms" className="flex items-center gap-1">
                <Beaker className="h-3 w-3" />
                <span className="hidden sm:inline">GC-MS</span>
                {olfactiveEmissions && olfactiveEmissions?.total > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1">{olfactiveEmissions?.total}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="nomenclature" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span className="hidden sm:inline">Nomenclature</span>
              </TabsTrigger>
              <TabsTrigger value="scientific">Données scientifiques</TabsTrigger>
              <TabsTrigger value="structure3d" className="flex items-center gap-1">
                <Box className="h-3.5 w-3.5" />
                Structure 3D
              </TabsTrigger>
              <TabsTrigger value="transformations">Transformations</TabsTrigger>
              <TabsTrigger value="biosynthesis">Biosynthèse</TabsTrigger>
              <TabsTrigger value="pyrolysis">Pyrolyse</TabsTrigger>
              <TabsTrigger value="plants">Plantes sources</TabsTrigger>
              <TabsTrigger value="origins">Origines géographiques</TabsTrigger>
              <TabsTrigger value="therapeutic">Propriétés</TabsTrigger>
              <TabsTrigger value="ifra">Réglementation IFRA</TabsTrigger>
              <TabsTrigger value="perfumes">Parfums emblématiques</TabsTrigger>
              <TabsTrigger value="synergies" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span className="hidden sm:inline">Synergies</span>
              </TabsTrigger>
              <TabsTrigger value="europeana" className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-cyan-600" />
                <span className="hidden sm:inline">Europeana</span>
              </TabsTrigger>
              {scientificPubs && scientificPubs?.length > 0 && (
                <TabsTrigger value="publications" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3 text-violet-600" />
                  <span className="hidden sm:inline">Publications ({scientificPubs?.length})</span>
                </TabsTrigger>
              )}
              {moleculeStorylines && (moleculeStorylines as unknown[]).length > 0 && (
                <TabsTrigger value="storylines" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3 text-emerald-600" />
                  <span className="hidden sm:inline">Fils narratifs ({(moleculeStorylines as unknown[]).length})</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="knowledge-graph" className="flex items-center gap-1">
                <Network className="h-3 w-3 text-cyan-600" />
                <span className="hidden sm:inline">Knowledge Graph</span>
              </TabsTrigger>
              <TabsTrigger value="pyrfume" className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 text-purple-600" />
                <span className="hidden sm:inline">Pyrfume</span>
              </TabsTrigger>
            </TabsList>

            {/* Onglet Nomenclature */}
            <MoleculeNomenclatureTab
              mol={mol}
              molecule={molecule}
              id={id}
              normOlfactiveProfile={normOlfactiveProfile}
              normOlfactiveProfileStr={normOlfactiveProfileStr}
              normTherapeuticProperties={normTherapeuticProperties}
              normBotanicalSources={normBotanicalSources}
              safeReferences={safeReferences}
              radarData={radarData}
              hasRadarData={hasRadarData}
              ifraRestrictions={ifraRestrictions}
              hasIfraRestrictions={hasIfraRestrictions}
              primaryRestriction={primaryRestriction}
              moleculeOrigins={moleculeOrigins}
              isLoadingOrigins={isLoadingOrigins}
              moleculeTransformations={moleculeTransformations}
              isLoadingTransformations={isLoadingTransformations}
              tpsGenes={tpsGenes}
              isLoadingTps={isLoadingTps}
            />

            {/* Onglet Vue d'ensemble */}
            <MoleculeOverviewTab
              mol={mol}
              molecule={molecule}
              id={id}
              normOlfactiveProfile={normOlfactiveProfile}
              normOlfactiveProfileStr={normOlfactiveProfileStr}
              normTherapeuticProperties={normTherapeuticProperties}
              normBotanicalSources={normBotanicalSources}
              safeReferences={safeReferences}
              radarData={radarData}
              hasRadarData={hasRadarData}
              ifraRestrictions={ifraRestrictions}
              hasIfraRestrictions={hasIfraRestrictions}
              primaryRestriction={primaryRestriction}
              moleculeOrigins={moleculeOrigins}
              isLoadingOrigins={isLoadingOrigins}
              moleculeTransformations={moleculeTransformations}
              isLoadingTransformations={isLoadingTransformations}
              tpsGenes={tpsGenes}
              isLoadingTps={isLoadingTps}
            />

            {/* Onglet Données scientifiques */}
            <MoleculeScientificTab
              mol={mol}
              molecule={molecule}
              id={id}
              normOlfactiveProfile={normOlfactiveProfile}
              normOlfactiveProfileStr={normOlfactiveProfileStr}
              normTherapeuticProperties={normTherapeuticProperties}
              normBotanicalSources={normBotanicalSources}
              safeReferences={safeReferences}
              radarData={radarData}
              hasRadarData={hasRadarData}
              ifraRestrictions={ifraRestrictions}
              hasIfraRestrictions={hasIfraRestrictions}
              primaryRestriction={primaryRestriction}
              moleculeOrigins={moleculeOrigins}
              isLoadingOrigins={isLoadingOrigins}
              moleculeTransformations={moleculeTransformations}
              isLoadingTransformations={isLoadingTransformations}
              tpsGenes={tpsGenes}
              isLoadingTps={isLoadingTps}
            />

            {/* Onglet Transformations moléculaires */}
            <MoleculeTransformationsTab
              mol={mol}
              molecule={molecule}
              id={id}
              normOlfactiveProfile={normOlfactiveProfile}
              normOlfactiveProfileStr={normOlfactiveProfileStr}
              normTherapeuticProperties={normTherapeuticProperties}
              normBotanicalSources={normBotanicalSources}
              safeReferences={safeReferences}
              radarData={radarData}
              hasRadarData={hasRadarData}
              ifraRestrictions={ifraRestrictions}
              hasIfraRestrictions={hasIfraRestrictions}
              primaryRestriction={primaryRestriction}
              moleculeOrigins={moleculeOrigins}
              isLoadingOrigins={isLoadingOrigins}
              moleculeTransformations={moleculeTransformations}
              isLoadingTransformations={isLoadingTransformations}
              tpsGenes={tpsGenes}
              isLoadingTps={isLoadingTps}
            />

            {/* Onglet Biosynthèse - Gènes TPS */}
            <MoleculeBiosynthesisTab
              mol={mol}
              molecule={molecule}
              id={id}
              normOlfactiveProfile={normOlfactiveProfile}
              normOlfactiveProfileStr={normOlfactiveProfileStr}
              normTherapeuticProperties={normTherapeuticProperties}
              normBotanicalSources={normBotanicalSources}
              safeReferences={safeReferences}
              radarData={radarData}
              hasRadarData={hasRadarData}
              ifraRestrictions={ifraRestrictions}
              hasIfraRestrictions={hasIfraRestrictions}
              primaryRestriction={primaryRestriction}
              moleculeOrigins={moleculeOrigins}
              isLoadingOrigins={isLoadingOrigins}
              moleculeTransformations={moleculeTransformations}
              isLoadingTransformations={isLoadingTransformations}
              tpsGenes={tpsGenes}
              isLoadingTps={isLoadingTps}
            />

            {/* Onglet Pyrolyse - Transformations thermiques */}
            <TabsContent value="pyrolysis" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Pyrolyse">
              <PyrolysisSection moleculeName={molecule?.name || ''} />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Plantes sources */}
            <TabsContent value="plants" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Plantes sources">
              <PlantSourcesSection moleculeId={id} />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Origines géographiques */}
            <TabsContent value="origins" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Origines">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Origines Géographiques (Terroirs de Production)
                </h2>
                
                {isLoadingOrigins ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : moleculeOrigins && moleculeOrigins?.length > 0 ? (
                  <div className="space-y-4">
                    {moleculeOrigins?.map((origin: unknown) => (
                      <div 
                        key={origin.id} 
                        className={`p-4 rounded-lg border ${origin.isPrimaryOrigin ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-muted/50'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold">{origin.origin?.name || 'Origine inconnue'}</h3>
                              {origin.isPrimaryOrigin === 1 && (
                                <Badge variant="secondary" className="text-xs">Origine principale</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {origin.origin?.region && `${origin.origin.region}, `}
                              {origin.origin?.country}
                            </p>
                          </div>
                          {origin.qualityRating && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Qualité</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-lg ${i < origin.qualityRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          {origin.origin?.climate && (
                            <div>
                              <p className="text-xs text-muted-foreground">Climat</p>
                              <p className="text-sm">{origin.origin.climate}</p>
                            </div>
                          )}
                          {origin.origin?.soilType && (
                            <div>
                              <p className="text-xs text-muted-foreground">Type de sol</p>
                              <p className="text-sm">{origin.origin.soilType}</p>
                            </div>
                          )}
                          {origin.productionVolume && (
                            <div>
                              <p className="text-xs text-muted-foreground">Volume de production</p>
                              <p className="text-sm">{origin.productionVolume}</p>
                            </div>
                          )}
                          {origin.priceRange && (
                            <div>
                              <p className="text-xs text-muted-foreground">Gamme de prix</p>
                              <p className="text-sm">{origin.priceRange}</p>
                            </div>
                          )}
                        </div>
                        
                        {origin.specificCharacteristics && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Caractéristiques spécifiques</p>
                            <p className="text-sm">{origin.specificCharacteristics}</p>
                          </div>
                        )}
                        
                        {origin.notes && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm italic">{origin.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune origine géographique documentée pour cette molécule.</p>
                    <p className="text-sm mt-2">Les informations sur les terroirs de production seront ajoutées progressivement.</p>
                  </div>
                )}
              </div>

              {/* Lien vers la page des terroirs */}
              <div className="bg-muted/50 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  Explorez tous les terroirs de production documentés dans notre base de données.
                </p>
                <Link href="/terroirs">
                  <Button variant="outline" className="mt-2">
                    <Globe className="h-4 w-4 mr-2" />
                    Voir tous les terroirs
                  </Button>
                </Link>
              </div>
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Réglementation IFRA */}
            <TabsContent value="ifra" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="IFRA">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Restrictions IFRA (International Fragrance Association)
                </h2>
                
                {isLoadingIfra ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : hasIfraRestrictions ? (
                  <div className="space-y-6">
                    {ifraRestrictions?.map((restriction: unknown) => (
                      <div key={restriction.id} className="space-y-4">
                        {/* En-tête de la restriction */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              {restriction.restrictionType && (
                                <Badge 
                                  className={`text-white ${restrictionTypeLabels[restriction.restrictionType]?.color || 'bg-gray-500'}`}
                                >
                                  {restrictionTypeLabels[restriction.restrictionType]?.label || restriction.restrictionType}
                                </Badge>
                              )}
                              {restriction.ifraAmendment && (
                                <span className="text-sm text-muted-foreground">
                                  Amendement {restriction.ifraAmendment}
                                </span>
                              )}
                            </div>
                            {restriction.effectiveDate && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Date d'effet: {new Date(restriction.effectiveDate).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Raison de la restriction */}
                        {restriction.reasonForRestriction && (
                          <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-orange-800 dark:text-orange-200">Raison de la restriction</p>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">{restriction.reasonForRestriction}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Limites par catégorie */}
                        <div>
                          <h3 className="font-medium mb-3">Limites de concentration par catégorie de produit</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {Object.entries(ifraCategoryDescriptions).map(([key, description]) => {
                              const value = restriction[key];
                              if (!value) return null;
                              return (
                                <TooltipProvider key={key}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="p-2 bg-muted/50 rounded border text-sm flex justify-between items-center cursor-help">
                                        <span className="text-muted-foreground truncate mr-2">{key.replace('category', 'Cat. ')}</span>
                                        <span className="font-mono font-semibold">{value}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>

                        {/* Alternatives suggérées */}
                        {restriction.alternativeSuggestions && (
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="font-medium text-green-800 dark:text-green-200">Alternatives suggérées</p>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">{restriction.alternativeSuggestions}</p>
                          </div>
                        )}

                        {/* Notes et source */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {restriction.notes && (
                            <div className="flex-1 min-w-[200px]">
                              <p className="text-muted-foreground">Notes</p>
                              <p>{restriction.notes}</p>
                            </div>
                          )}
                          {restriction.sourceUrl && (
                            <div>
                              <a 
                                href={restriction.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                Source IFRA <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune restriction IFRA documentée pour cette molécule.</p>
                    <p className="text-sm mt-2">Cette molécule peut être utilisée sans restriction particulière selon les données disponibles.</p>
                  </div>
                )}
              </div>

              {/* Informations sur l'IFRA */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">À propos de l'IFRA</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  L'International Fragrance Association (IFRA) établit des normes de sécurité pour l'utilisation des ingrédients 
                  parfumants. Les restrictions sont basées sur des évaluations scientifiques et varient selon le type de produit 
                  et le niveau d'exposition cutanée.
                </p>
                <a 
                  href="https://ifrafragrance.org/standards/IFRA_Standards_Booklet.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                >
                  Consulter les standards IFRA <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Propriétés thérapeutiques */}
            <TabsContent value="therapeutic" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Propriétés thérapeutiques">
              <TherapeuticPropertiesTab
                moleculeId={molecule?.id}
                moleculeName={molecule?.name}
                therapeuticProperties={normTherapeuticProperties || undefined}
                olfactiveProfile={normOlfactiveProfileStr || undefined}
              />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Structure 3D */}
            <TabsContent value="structure3d" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Structure 3D">
              <Structure3DTab
                moleculeId={molecule?.id}
                moleculeName={molecule?.name}
                formula={molecule?.chemicalFormula}
                smiles={mol.smiles ?? undefined}
                pubchemCid={mol.pubchem_cid ?? undefined}
              />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Parfums emblématiques */}
            <TabsContent value="perfumes" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Parfums">
              <PerfumesTab moleculeId={molecule?.id} moleculeName={molecule?.name} />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Synergies moléculaires */}
            <TabsContent value="gcms" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="GC-MS">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Présence dans les profils GC-MS</h3>
                    <span className="text-sm text-muted-foreground">(NOSE Phase 1 — od:L12 Smell Emission)</span>
                  </div>
                  {!olfactiveEmissions || olfactiveEmissions?.total === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Beaker className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>Aucune donnée GC-MS disponible pour cette molécule.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Badge variant="outline">{olfactiveEmissions?.total} source{olfactiveEmissions?.total > 1 ? 's' : ''} identifiée{olfactiveEmissions?.total > 1 ? 's' : ''}</Badge>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 pr-4 font-medium">Source</th>
                              <th className="text-left py-2 pr-4 font-medium">Partie</th>
                              <th className="text-right py-2 pr-4 font-medium">%</th>
                              <th className="text-left py-2 pr-4 font-medium">Rôle</th>
                              <th className="text-left py-2 pr-4 font-medium">Méthode</th>
                              <th className="text-left py-2 font-medium">Origine</th>
                            </tr>
                          </thead>
                          <tbody>
                            {olfactiveEmissions?.emissions.map((e: unknown) => (
                              <tr key={e.id} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="py-2 pr-4">
                                  {e.plant_id ? (
                                    <Link href={`/plantes/${e.plant_id}`} className="text-primary hover:underline font-medium">
                                      {e.plant_name || e.latin_name || '—'}
                                    </Link>
                                  ) : e.tabac_id ? (
                                    <Link href={`/tabacs/${e.tabac_id}`} className="text-amber-600 hover:underline font-medium">
                                      {e.tabac_name || '—'}
                                    </Link>
                                  ) : <span className="text-muted-foreground">—</span>}
                                  {e.is_signature ? <Badge className="ml-1 text-xs bg-amber-500/10 text-amber-700 border-amber-300">★</Badge> : null}
                                </td>
                                <td className="py-2 pr-4 text-xs text-muted-foreground capitalize">{e.plant_part?.replace('_', ' ') || '—'}</td>
                                <td className="py-2 pr-4 text-right font-mono">
                                  {e.percentage != null ? (
                                    <span className={Number(e.percentage) >= 10 ? 'text-emerald-600 font-semibold' : Number(e.percentage) >= 1 ? 'text-blue-600' : 'text-muted-foreground'}>
                                      {Number(e.percentage).toFixed(2)}%
                                    </span>
                                  ) : e.concentration_ppm != null ? (
                                    <span className="text-blue-600">{Number(e.concentration_ppm).toFixed(1)} ppm</span>
                                  ) : '—'}
                                </td>
                                <td className="py-2 pr-4">
                                  {e.role && <Badge variant="outline" className="text-xs capitalize">{e.role}</Badge>}
                                </td>
                                <td className="py-2 pr-4 text-xs text-muted-foreground uppercase">{e.analysis_method?.replace('_', '-') || '—'}</td>
                                <td className="py-2 text-xs text-muted-foreground">{e.geographic_origin || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </TabErrorBoundary>
            </TabsContent>

            <TabsContent value="synergies" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Synergies">
              <SynergiesTab moleculeName={molecule?.name} moleculeId={molecule?.id} />
              </TabErrorBoundary>
            </TabsContent>

            {/* Europeana — Collections muséales européennes */}
            <TabsContent value="europeana" className="space-y-4 mt-6">
              <TabErrorBoundary tabLabel="Europeana">
                <div className="max-w-2xl">
                  <EuropeanaWidget
                    type="molecule"
                    entityId={molecule?.id}
                    entityName={molecule?.name}
                    limit={8}
                  />
                </div>
              </TabErrorBoundary>
            </TabsContent>

            {/* Publications scientifiques — OpenAlex + PubChem/PubMed */}
            <TabsContent value="publications" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Publications scientifiques">

                {/* Section PubChem / PubMed */}
                {molecule?.pubchem_cid && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-1 rounded-full bg-blue-500" />
                      <h3 className="text-sm font-semibold text-foreground">Publications PubChem / PubMed</h3>
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">Temps réel</Badge>
                    </div>
                    {loadingPubchemLit ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement des publications PubChem…
                      </div>
                    ) : pubchemLiterature?.articles && pubchemLiterature?.articles.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{pubchemLiterature?.articles.length} article{pubchemLiterature?.articles.length > 1 ? 's' : ''} référencé{pubchemLiterature?.articles.length > 1 ? 's' : ''} sur PubMed (CID {molecule?.pubchem_cid})</p>
                        {pubchemLiterature?.articles.map((art) => (
                          <PubMedArticleCard
                            key={art.pmid}
                            art={art}
                            moleculeId={mol.id}
                            moleculeName={mol.name}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic py-2">Aucune publication PubMed trouvée pour ce composé (CID {molecule?.pubchem_cid}).</p>
                    )}
                  </div>
                )}

                {/* Section OpenAlex */}
                {scientificPubs && scientificPubs?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-1 rounded-full bg-violet-500" />
                      <h3 className="text-sm font-semibold text-foreground">Publications OpenAlex (PERFUMUM)</h3>
                      <Badge variant="outline" className="text-xs border-violet-300 text-violet-600">Base locale</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {scientificPubs?.length} publication{scientificPubs?.length > 1 ? 's' : ''} répertoriée{scientificPubs?.length > 1 ? 's' : ''} dans la base PERFUMUM
                    </p>
                    {(scientificPubs as unknown[]).map((pub: unknown) => (
                      <Card key={pub.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug line-clamp-2" dangerouslySetInnerHTML={{ __html: pub.title || 'Sans titre' }} />
                            {pub.notes?.includes('Open Access') && (
                              <Badge variant="outline" className="shrink-0 text-xs border-green-500 text-green-600">OA</Badge>
                            )}
                          </div>
                          {pub.authors && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{pub.authors}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {pub.year && <span>{pub.year}</span>}
                            {pub.journal && <span className="italic line-clamp-1">{pub.journal}</span>}
                          </div>
                          {(pub.doi || pub.url) && (
                            <a
                              href={pub.url || `https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 hover:underline mt-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {pub.doi ? `DOI: ${pub.doi}` : 'Voir la publication'}
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* État vide */}
                {(!molecule?.pubchem_cid) && (!scientificPubs || scientificPubs?.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>Aucune publication scientifique répertoriée pour cette molécule.</p>
                    <p className="text-xs mt-1">Enrichissez la molécule via PubChem pour accéder aux références PubMed.</p>
                  </div>
                )}

              </TabErrorBoundary>
            </TabsContent>

          {/* Onglet Fils Narratifs */}
          {moleculeStorylines && (moleculeStorylines as unknown[]).length > 0 && (
            <TabsContent value="storylines" className="space-y-4">
              <TabErrorBoundary tabLabel="Fils narratifs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold">Fils narratifs</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Cette molécule apparaît dans {(moleculeStorylines as unknown[]).length} fil{(moleculeStorylines as unknown[]).length > 1 ? 's' : ''} narratif{(moleculeStorylines as unknown[]).length > 1 ? 's' : ''} du projet PERFUMUM.
                      </p>
                    </div>
                    <Link href="/admin/storylines">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Tous les fils
                      </Button>
                    </Link>
                  </div>
                  {(moleculeStorylines as unknown[]).map((storyline: unknown) => (
                    <div key={storyline.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold line-clamp-1">{storyline.title}</h4>
                            {storyline.narrative_axis && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {storyline.narrative_axis}
                              </Badge>
                            )}
                          </div>
                          {storyline.subtitle && (
                            <p className="text-xs text-muted-foreground italic mb-1">{storyline.subtitle}</p>
                          )}
                          {storyline.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{storyline.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {storyline.period_label && (
                              <span className="text-xs text-muted-foreground">⏳ {storyline.period_label}</span>
                            )}
                            {storyline.geographic_scope && (
                              <span className="text-xs text-muted-foreground">🌍 {storyline.geographic_scope}</span>
                            )}
                            {storyline.role_in_story && (
                              <Badge variant="secondary" className="text-xs">
                                {storyline.role_in_story}
                              </Badge>
                            )}
                          </div>
                          {storyline.narrative_note && (
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1.5 italic">
                              “{storyline.narrative_note}”
                            </p>
                          )}
                        </div>
                        <Link href={`/admin/storylines/${storyline.slug}`}>
                          <Button variant="ghost" size="sm" className="shrink-0">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabErrorBoundary>
            </TabsContent>
          )}

            {/* Onglet Knowledge Graph — Phase A (PubChem étendu) + Phase B (Wikidata KG) */}
            {molecule?.id && (
              <MoleculeKGTab
                moleculeId={molecule.id}
                moleculeName={molecule.name || ""}
                wikidataQid={molecule.wikidataQid ?? null}
              />
            )}

            <TabsContent value="pyrfume" className="space-y-4 mt-6">
              <TabErrorBoundary tabLabel="Pyrfume">
                <PyrfumeSection moleculeId={molecule?.id} />
              </TabErrorBoundary>
            </TabsContent>

          </Tabs>
        </div>

        {/* Section Voir aussi — Navigation contextuelle inter-entités */}
        {(linkedRecettes?.length || similarMolecules?.length) ? (
          <SeeAlsoSection
            title="Connexions de cette molécule"
            groups={[
              {
                label: "Recettes utilisant cette molécule",
                type: "recette",
                items: (linkedRecettes || []).map((r: unknown) => ({
                  id: r.id,
                  label: r.name,
                  sublabel: r.family || r.category || undefined,
                  href: `/recettes/${r.id}`,
                  type: "recette" as const,
                })),
                viewAllHref: "/recettes",
                viewAllLabel: "Toutes les recettes",
              },
              {
                label: "Molécules similaires",
                type: "molecule",
                items: (similarMolecules || []).map((m: unknown) => ({
                  id: m.id,
                  label: m.name,
                  sublabel: m.family || m.chemicalClass || undefined,
                  href: `/molecules/${m.id}`,
                  type: "molecule" as const,
                })),
                viewAllHref: "/molecules",
                viewAllLabel: "Toutes les molécules",
              },
            ]}
          />
        ) : null}
      </div>
    </div>
  );
}
