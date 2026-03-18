// @ts-nocheck
import { Link, useParams } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReferencesList } from "@/components/ReferencesList";
import { trpc } from "@/lib/trpc";
import { useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf, FileDown, Globe, AlertTriangle, Beaker, MapPin, Shield, ExternalLink, Box, Flame, ArrowRight, GitBranch, Dna, Download, RefreshCw, Star, Wine, Plus, Trash2, Search, BookOpen, Copy, Check } from "lucide-react";
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

  const hasTransformations = transformations && transformations.length > 0;

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
            {transformations.map((t: any, idx: number) => (
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
    onError: (err: any) => {
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
                onChange={(e: any) => { setSearchQuery(e.target.value); setSelectedPlant(null); }}
                className="pl-9"
              />
            </div>
            {searching && <p className="text-xs text-muted-foreground mt-1">Recherche...</p>}
            {searchResults && searchResults.length > 0 && !selectedPlant && (
              <div className="mt-1 border rounded-md bg-popover shadow-md max-h-48 overflow-y-auto">
                {searchResults.map((plant: any) => (
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
                onChange={(e: any) => setPercentageTypical(e.target.value)}
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
              onChange={(e: any) => setIsSignature(e.target.checked)}
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
    onError: (err: any) => {
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
            {plantSources && plantSources.length > 0 && (
              <Badge variant="secondary">{plantSources.length}</Badge>
            )}
          </h2>
          <AddPlantSourceModal moleculeId={moleculeId} onSuccess={() => {}} />
        </div>
        
        {plantSources && plantSources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plantSources.map((source: any) => (
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
  const { data: moleculeOrigins, isLoading: isLoadingOrigins } = trpc.moleculeOrigins.getByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les restrictions IFRA de la molécule
  const { data: ifraRestrictions, isLoading: isLoadingIfra } = trpc.ifraRestrictions.getByMolecule.useQuery(id, {
    enabled: !!molecule,
  });

  // Récupérer les recommandations
  const { data: recommendations, isLoading: isLoadingRecommendations } = trpc.recommendations.similarMolecules.useQuery(
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
  const { data: olfactiveEmissions } = trpc.olfactiveEmissions.getByMolecule.useQuery(
    { moleculeId: id, limit: 100 },
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
        { axis: 'Intensité', value: molecule.radarIntensity || 50 },
        { axis: 'Fraîcheur', value: molecule.radarFreshness || 50 },
        { axis: 'Chaleur', value: molecule.radarWarmth || 50 },
        { axis: 'Douceur', value: molecule.radarSweetness || 50 },
        { axis: 'Épices', value: molecule.radarSpiciness || 50 },
        { axis: 'Terreux', value: molecule.radarEarthiness || 50 },
      ];

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${molecule.name} - Fiche Molécule PERFUMUM</title>
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
          <h1>${molecule.name}</h1>
          ${molecule.chemicalFormula ? `<p class="formula">${molecule.chemicalFormula}</p>` : ''}
          <div style="margin-bottom: 20px;">
            ${molecule.family ? `<span class="badge">${molecule.family}</span>` : ''}
            ${molecule.chemicalClass ? `<span class="badge">${chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}</span>` : ''}
            ${molecule.casNumber ? `<span class="badge badge-cas">CAS: ${molecule.casNumber}</span>` : ''}
          </div>
          
          ${molecule.iupacName ? `
            <div class="scientific-info">
              <strong>Nom IUPAC:</strong> ${molecule.iupacName}
            </div>
          ` : ''}
          
          ${molecule.olfactiveProfile ? `
            <h2>🌿 Profil Olfactif</h2>
            <p>${molecule.olfactiveProfile}</p>
          ` : ''}
          
          ${molecule.emotionalResonance ? `
            <h2>⚡ Résonance Émotionnelle</h2>
            <p>${molecule.emotionalResonance}</p>
          ` : ''}
          
          <h2>📊 Propriétés Scientifiques</h2>
          <div class="grid">
            ${molecule.molecularWeight ? `<div class="card"><div class="card-title">Masse Moléculaire</div><div class="card-value">${molecule.molecularWeight} <span class="card-unit">g/mol</span></div></div>` : ''}
            ${molecule.boilingPoint ? `<div class="card"><div class="card-title">Point d'Ébullition</div><div class="card-value">${molecule.boilingPoint} <span class="card-unit">°C</span></div></div>` : ''}
            ${molecule.intensity ? `<div class="card"><div class="card-title">Intensité Olfactive</div><div class="card-value">${molecule.intensity}%</div></div>` : ''}
            ${molecule.volatility ? `<div class="card"><div class="card-title">Volatilité</div><div class="card-value">${molecule.volatility}%</div></div>` : ''}
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
          
          ${molecule.sourceOrigin ? `
            <h2>🌱 Origine</h2>
            <p>${molecule.sourceOrigin}</p>
          ` : ''}
          
          ${molecule.concentration ? `
            <h2>💧 Concentration Recommandée</h2>
            <p style="font-size: 1.3em; font-weight: bold; color: #7c3aed;">${molecule.concentration}</p>
          ` : ''}
          
          ${molecule.notes ? `
            <h2>📝 Notes de Recherche</h2>
            <p>${molecule.notes}</p>
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
        entityId: molecule.id,
        entityType: "molecule",
        metadata: JSON.stringify({
          moleculeName: molecule.name,
          family: molecule.family,
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
    const refs = (molecule as any).references;
    if (!refs) return [];
    if (Array.isArray(refs)) return refs;
    if (typeof refs === "string") {
      try { const p = JSON.parse(refs); return Array.isArray(p) ? p : []; } catch { return []; }
    }
    return [];
  })();

  // Champs normalisés — priorité aux colonnes JSON standardisées
  const normOlfactiveProfile = asArray((molecule as any).olfactiveProfileJson ?? molecule.olfactiveProfile);
  const normTherapeuticProperties = (() => {
    const jsonArr = (molecule as any).therapeuticPropertiesJson;
    if (Array.isArray(jsonArr) && jsonArr.length > 0) return jsonArr.join(", ");
    return asString(molecule.therapeuticProperties);
  })();
  const normBotanicalSources = asString(molecule.botanicalSources);
  const normOlfactiveProfileStr = normOlfactiveProfile.join(". ");

  // Préparer les données pour le radar chart
  const radarData = [
    { axis: "Intensité", value: molecule.radarIntensity || 50 },
    { axis: "Fraîcheur", value: molecule.radarFreshness || 50 },
    { axis: "Chaleur", value: molecule.radarWarmth || 50 },
    { axis: "Douceur", value: molecule.radarSweetness || 50 },
    { axis: "Épices", value: molecule.radarSpiciness || 50 },
    { axis: "Terreux", value: molecule.radarEarthiness || 50 },
  ];

  const hasRadarData = radarData.some(d => d.value !== 50);

  // Vérifier si la molécule a des restrictions IFRA
  const hasIfraRestrictions = ifraRestrictions && ifraRestrictions.length > 0;
  const primaryRestriction = hasIfraRestrictions ? ifraRestrictions[0] : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-6xl">
        <Breadcrumbs 
          customItems={[
            { label: "Molécules", path: "/molecules" },
            { label: molecule.name }
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
                <h1 className="text-4xl font-bold mb-2">{molecule.name}</h1>
                {molecule.chemicalFormula && (
                  <p className="text-xl text-muted-foreground font-mono mb-4">
                    {molecule.chemicalFormula}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {molecule.family && (
                    <Badge variant="secondary" className="text-sm">
                      {molecule.family}
                    </Badge>
                  )}
                  {molecule.chemicalClass && (
                    <Badge variant="outline" className="text-sm">
                      <Beaker className="h-3 w-3 mr-1" />
                      {chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}
                    </Badge>
                  )}
                  {molecule.casNumber && (
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                      CAS: {molecule.casNumber}
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
                    hasPubChem={!!(molecule as any).pubchem_cid} 
                    pubchemCid={(molecule as any).pubchem_cid} 
                  />
                  <ChEBIStatusBadge 
                    hasChebi={!!(molecule as any).chebi_id} 
                    chebiId={(molecule as any).chebi_id} 
                  />
                  {/* Badge IFRA pour le statut réglementaire */}
                  <IFRAStatusBadge 
                    status={(molecule as any).ifraStatus} 
                    maxPercent={(molecule as any).ifraData?.maxPercent}
                    reason={(molecule as any).ifraData?.reason}
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
                    const matchedKey = citesKeywords.find(k => molecule.name?.toLowerCase().includes(k.toLowerCase()));
                    if (!matchedKey) return null;
                    const altText = Object.keys(synthAlternatives).find(k => molecule.name?.includes(k));
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
                    const vs = (molecule as any).validationStatus;
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

                  {/* Badge inter-domaines : lien vers la page /correlations */}
                  <Link href={`/correlations?q=${encodeURIComponent(molecule.name)}`}>
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
              <TabsTrigger value="synergies" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="gcms" className="flex items-center gap-1">
                <Beaker className="h-3 w-3" />
                <span className="hidden sm:inline">GC-MS</span>
                {olfactiveEmissions && olfactiveEmissions.total > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs px-1">{olfactiveEmissions.total}</Badge>
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
            </TabsList>

            {/* Onglet Nomenclature */}
            <TabsContent value="nomenclature" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Nomenclature">
              {/* Identités principales */}
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Identité Chimique
                  </h2>
                  {!(molecule as any).pubchem_cid && (
                    <PubChemEnrichButton moleculeId={id} moleculeName={molecule.name} />
                  )}
                </div>

                <div className="space-y-4">
                  {/* Nom commun + formule */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nom commun</p>
                      <p className="text-xl font-bold">{molecule.name}</p>
                    </div>
                    {molecule.chemicalFormula && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Formule moléculaire</p>
                        <p className="text-xl font-mono font-bold">{molecule.chemicalFormula}</p>
                      </div>
                    )}
                  </div>

                  {/* Nom IUPAC */}
                  {molecule.iupacName && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide font-medium mb-2">Nom IUPAC (nomenclature systématique)</p>
                      <p className="font-mono text-amber-800 dark:text-amber-200 leading-relaxed">{molecule.iupacName}</p>
                    </div>
                  )}

                  {/* CAS + Poids moléculaire */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {molecule.casNumber && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium mb-2">Numéro CAS</p>
                        <p className="text-2xl font-mono font-bold text-blue-800 dark:text-blue-200 mb-2">{molecule.casNumber}</p>
                        <div className="flex gap-2">
                          <a
                            href={`https://commonchemistry.cas.org/detail?cas_rn=${molecule.casNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            CAS Common Chemistry <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href={`https://www.chemspider.com/Search.aspx?q=${molecule.casNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            ChemSpider <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {molecule.molecularWeight && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Masse moléculaire</p>
                        <p className="text-2xl font-bold">{molecule.molecularWeight} <span className="text-sm font-normal text-muted-foreground">g/mol</span></p>
                      </div>
                    )}
                  </div>

                  {/* Classe chimique + Famille */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {molecule.chemicalClass && (
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide font-medium mb-2">Classe chimique</p>
                        <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                          {chemicalClassLabels[molecule.chemicalClass] || molecule.chemicalClass}
                        </p>
                      </div>
                    )}
                    {molecule.family && (
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="text-xs text-primary/70 uppercase tracking-wide font-medium mb-2">Famille olfactive</p>
                        <p className="text-lg font-semibold text-primary">{molecule.family}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Liens externes */}
              {((molecule as any).pubchem_cid || molecule.casNumber || molecule.chemicalFormula) && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Bases de données externes
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {(molecule as any).pubchem_cid && (
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${(molecule as any).pubchem_cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        PubChem CID {(molecule as any).pubchem_cid}
                      </a>
                    )}
                    {molecule.casNumber && (
                      <a
                        href={`https://commonchemistry.cas.org/detail?cas_rn=${molecule.casNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        CAS Registry
                      </a>
                    )}
                    {molecule.chemicalFormula && (
                      <a
                        href={`https://www.chemspider.com/Search.aspx?q=${encodeURIComponent(molecule.chemicalFormula)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        ChemSpider
                      </a>
                    )}
                    {molecule.name && (
                      <a
                        href={`https://www.ebi.ac.uk/chebi/advancedSearchFT.do?searchString=${encodeURIComponent(molecule.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        ChEBI
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Synonymes PubChem */}
              {Array.isArray((molecule as any).pubchemSynonyms) && (molecule as any).pubchemSynonyms.length > 0 && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Atom className="h-5 w-5 text-primary" />
                    Synonymes PubChem
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                      {((molecule as any).pubchemSynonyms as string[]).length} synonymes
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {((molecule as any).pubchemSynonyms as string[]).map((syn: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded text-xs bg-secondary text-secondary-foreground border border-border font-mono hover:bg-secondary/80 transition-colors">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Vue d'ensemble */}
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

                {molecule.emotionalResonance && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Résonance Émotionnelle</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.emotionalResonance}</p>
                  </div>
                )}

                {molecule.functionalEffect && (
                  <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Atom className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Effet Fonctionnel</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{molecule.functionalEffect}</p>
                  </div>
                )}

                {molecule.sourceOrigin && (
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
                  <h2 className="text-xl font-semibold mb-4">Profil Radar Olfactif</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--foreground))", fontSize: 14 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <Radar
                          name={molecule.name}
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
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

                {molecule.extractionMethod && (
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

                {molecule.concentration && (
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
              {molecule.notes && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">Notes de Recherche</h2>
                  <p className="whitespace-pre-wrap text-muted-foreground">{molecule.notes}</p>
                </div>
              )}

              {/* Recommandations IA */}
              {recommendations && recommendations.length > 0 && (
                <RecommendationsCard
                  type="molecules"
                  recommendations={recommendations}
                  isLoading={isLoadingRecommendations}
                />
              )}

              {/* Références Bibliographiques (PubChem, etc.) */}
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Références PubChem</h2>
                <ReferencesList references={safeReferences} />
              </div>

              {/* Références Bibliographiques Liées (V3) */}
              <LinkedReferences 
                entityType="molecule" 
                entityId={id} 
                title="Références Bibliographiques Associées"
                maxItems={5}
              />

              {/* Section Voir aussi */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recettes utilisant cette molécule */}
                <LinkedRecettes 
                  recettes={linkedRecettes || []} 
                  isLoading={isLoadingRecettes}
                  title="Recettes utilisant cette molécule"
                />

                {/* Molécules similaires */}
                <SimilarContent
                  items={similarMolecules || []}
                  type="molecule"
                  isLoading={isLoadingSimilar}
                  getSubtitle={(m) => m.family || m.chemicalClass || undefined}
                />
              </div>
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Données scientifiques */}
            <TabsContent value="scientific" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Données scientifiques">
              {/* Propriétés Scientifiques — voir l'onglet Nomenclature pour IUPAC, CAS, formule, poids */}
              {(molecule.molecularWeight || molecule.boilingPoint || molecule.logP || molecule.volatility || molecule.intensity || molecule.complexity) && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Propriétés Physico-chimiques
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {molecule.molecularWeight && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Masse Moléculaire</p>
                        <p className="text-2xl font-bold">{molecule.molecularWeight} <span className="text-sm font-normal">g/mol</span></p>
                      </div>
                    )}
                    {molecule.boilingPoint && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Point d'Ébullition</p>
                        <p className="text-2xl font-bold">{molecule.boilingPoint} <span className="text-sm font-normal">°C</span></p>
                      </div>
                    )}
                    {molecule.logP && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">LogP (lipophilie)</p>
                        <p className="text-2xl font-bold">{(molecule.logP / 100).toFixed(2)}</p>
                      </div>
                    )}
                    {molecule.volatility && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Volatilité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.volatility}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule.volatility}%</span>
                        </div>
                      </div>
                    )}
                    {molecule.intensity && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Intensité Olfactive</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.intensity}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule.intensity}%</span>
                        </div>
                      </div>
                    )}
                    {molecule.complexity && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Complexité</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.complexity}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{molecule.complexity}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visualisation 3D de la molécule */}
              {molecule.chemicalFormula && (
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
                    moleculeName={molecule.name}
                    formula={molecule.chemicalFormula}
                    showControls={true}
                    showInfo={true}
                    autoRotate={false}
                    height={400}
                  />
                </div>
              )}

              {/* Famille chimique */}
              {molecule.family && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Classification Olfactive</h2>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Famille olfactive</p>
                      <p className="text-xl font-semibold text-primary">{molecule.family}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Méthodes analytiques utilisées */}
              <MoleculeAnalyticalMethods moleculeId={id} />

              {/* Classification assistée par IA */}
              <AIClassificationSuggestion
                molecule={{
                  name: molecule.name,
                  iupacName: molecule.iupacName,
                  casNumber: molecule.casNumber,
                  chemicalFormula: molecule.chemicalFormula,
                  olfactiveProfile: normOlfactiveProfileStr || undefined,
                  botanicalSources: normBotanicalSources || undefined,
                }}
                currentChemicalClass={molecule.chemicalClass}
                currentOlfactiveFamily={molecule.family}
                onAcceptChemicalClass={(value) => applyAIClassificationMutation.mutate({ moleculeId: id, chemicalClass: value })}
                onAcceptOlfactiveFamily={(value) => applyAIClassificationMutation.mutate({ moleculeId: id, olfactiveFamily: value })}
                onAcceptOlfactiveProfile={(value) => applyAIClassificationMutation.mutate({ moleculeId: id, olfactiveProfile: value })}
                onAcceptResearcherNotes={(value, appendMode) => applyAINotesMutation.mutate({ moleculeId: id, researcherNotes: value, appendMode })}
                currentNotes={molecule.notes}
              />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Transformations moléculaires */}
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
                ) : moleculeTransformations?.success && (moleculeTransformations.asSource.length > 0 || moleculeTransformations.asProduct.length > 0) ? (
                  <div className="space-y-6">
                    {/* Stats */}
                    {moleculeTransformations.stats && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {moleculeTransformations.stats.total} transformation{moleculeTransformations.stats.total > 1 ? 's' : ''}
                        </Badge>
                        {moleculeTransformations.stats.totalAsSource > 0 && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            {moleculeTransformations.stats.totalAsSource} en tant que source
                          </Badge>
                        )}
                        {moleculeTransformations.stats.totalAsProduct > 0 && (
                          <Badge variant="outline" className="border-red-500 text-red-600">
                            {moleculeTransformations.stats.totalAsProduct} en tant que produit
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Transformations où cette molécule est source */}
                    {moleculeTransformations.asSource.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-500" />
                          Cette molécule se transforme en...
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {moleculeTransformations.asSource.map((t: any) => (
                            <div key={t.id} className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-green-700 dark:text-green-300">
                                    {t.product_molecule_name}
                                  </span>
                                  {t.product_db_id && (
                                    <Link href={`/molecules/${t.product_db_id}`}>
                                      <Button variant="ghost" size="sm" className="h-6 px-2">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {t.transformation_type?.replace('_', ' ')}
                                </Badge>
                              </div>
                              {t.temperature_optimal && (
                                <p className="text-xs text-muted-foreground">
                                  <Thermometer className="h-3 w-3 inline mr-1" />
                                  {t.temperature_optimal}°C
                                </p>
                              )}
                              {t.olfactory_change_description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {t.olfactory_change_description}
                                </p>
                              )}
                              {t.relevance_context && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  {t.relevance_context}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transformations où cette molécule est produit */}
                    {moleculeTransformations.asProduct.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4 text-red-500" />
                          Cette molécule est produite à partir de...
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {moleculeTransformations.asProduct.map((t: any) => (
                            <div key={t.id} className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-red-700 dark:text-red-300">
                                    {t.source_molecule_name}
                                  </span>
                                  {t.source_db_id && (
                                    <Link href={`/molecules/${t.source_db_id}`}>
                                      <Button variant="ghost" size="sm" className="h-6 px-2">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {t.transformation_type?.replace('_', ' ')}
                                </Badge>
                              </div>
                              {t.temperature_optimal && (
                                <p className="text-xs text-muted-foreground">
                                  <Thermometer className="h-3 w-3 inline mr-1" />
                                  {t.temperature_optimal}°C
                                </p>
                              )}
                              {t.olfactory_change_description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {t.olfactory_change_description}
                                </p>
                              )}
                              {t.relevance_context && (
                                <Badge variant="secondary" className="text-xs mt-2">
                                  {t.relevance_context}
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
                        <Link href={`/molecular-transformations?molecule=${encodeURIComponent(molecule.name)}&mode=cascade`}>
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

            {/* Onglet Biosynthèse - Gènes TPS */}
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
                ) : tpsGenes && tpsGenes.length > 0 ? (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {tpsGenes.length} gène{tpsGenes.length > 1 ? 's' : ''} TPS identifié{tpsGenes.length > 1 ? 's' : ''}
                      </Badge>
                      {[...new Set(tpsGenes.map((g: any) => g.species))].filter(Boolean).length > 0 && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          {[...new Set(tpsGenes.map((g: any) => g.species))].filter(Boolean).length} espèce{[...new Set(tpsGenes.map((g: any) => g.species))].filter(Boolean).length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>

                    {/* Liste des gènes TPS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tpsGenes.map((gene: any) => (
                        <div key={gene.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                                <Dna className="h-4 w-4" />
                                {gene.geneName}
                              </h3>
                              {gene.geneId && (
                                <p className="text-xs font-mono text-green-600 dark:text-green-400">{gene.geneId}</p>
                              )}
                            </div>
                            {gene.enzymeClass && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                {gene.enzymeClass}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {gene.terpeneProduct && (
                              <div>
                                <p className="text-xs text-muted-foreground">Produit</p>
                                <p className="font-medium text-green-800 dark:text-green-200">{gene.terpeneProduct}</p>
                              </div>
                            )}
                            {gene.productType && (
                              <div>
                                <p className="text-xs text-muted-foreground">Type</p>
                                <p className="capitalize">{gene.productType}</p>
                              </div>
                            )}
                            {gene.species && (
                              <div>
                                <p className="text-xs text-muted-foreground">Espèce</p>
                                <p className="italic">{gene.species}</p>
                              </div>
                            )}
                            {gene.pathway && (
                              <div>
                                <p className="text-xs text-muted-foreground">Voie</p>
                                <p>{gene.pathway}</p>
                              </div>
                            )}
                            {gene.expressionTissue && (
                              <div className="col-span-2">
                                <p className="text-xs text-muted-foreground">Tissu d'expression</p>
                                <p>{gene.expressionTissue}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Liens externes */}
                          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700 flex flex-wrap gap-2">
                            {gene.ncbiGeneId && (
                              <a 
                                href={`https://www.ncbi.nlm.nih.gov/gene/${gene.ncbiGeneId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                              >
                                NCBI Gene <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {gene.uniprotId && (
                              <a 
                                href={`https://www.uniprot.org/uniprotkb/${gene.uniprotId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                              >
                                UniProt <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          
                          {gene.regulationNotes && (
                            <div className="mt-2 text-xs text-muted-foreground italic">
                              {gene.regulationNotes}
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
                ) : moleculeOrigins && moleculeOrigins.length > 0 ? (
                  <div className="space-y-4">
                    {moleculeOrigins.map((origin: any) => (
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
                    {ifraRestrictions.map((restriction: any) => (
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
                moleculeId={molecule.id}
                moleculeName={molecule.name}
                therapeuticProperties={normTherapeuticProperties || undefined}
                olfactiveProfile={normOlfactiveProfileStr || undefined}
              />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Structure 3D */}
            <TabsContent value="structure3d" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Structure 3D">
              <Structure3DTab
                moleculeId={molecule.id}
                moleculeName={molecule.name}
                formula={molecule.chemicalFormula}
                smiles={(molecule as any).smiles}
                pubchemCid={(molecule as any).pubchem_cid}
              />
              </TabErrorBoundary>
            </TabsContent>

            {/* Onglet Parfums emblématiques */}
            <TabsContent value="perfumes" className="space-y-6 mt-6">
              <TabErrorBoundary tabLabel="Parfums">
              <PerfumesTab moleculeId={molecule.id} moleculeName={molecule.name} />
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
                  {!olfactiveEmissions || olfactiveEmissions.total === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Beaker className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>Aucune donnée GC-MS disponible pour cette molécule.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Badge variant="outline">{olfactiveEmissions.total} source{olfactiveEmissions.total > 1 ? 's' : ''} identifiée{olfactiveEmissions.total > 1 ? 's' : ''}</Badge>
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
                            {olfactiveEmissions.emissions.map((e: any) => (
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
              <SynergiesTab moleculeName={molecule.name} moleculeId={molecule.id} />
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
                items: (linkedRecettes || []).map((r: any) => ({
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
                items: (similarMolecules || []).map((m: any) => ({
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

// ============================================================================
// COMPOSANT ONGLET PARFUMS EMBLÉMATIQUES
// ============================================================================

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  accord_principal: { label: 'Accord principal', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  note_coeur: { label: 'Note de cœur', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  note_tete: { label: 'Note de tête', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
  note_fond: { label: 'Note de fond', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  signature: { label: 'Molécule signature', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  ingredient_cle: { label: 'Ingrédient clé', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
};

function PerfumesTab({ moleculeId, moleculeName }: { moleculeId: number; moleculeName: string }) {
  const { data: perfumes, isLoading } = trpc.molecules.getPerfumes.useQuery({ moleculeId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!perfumes || perfumes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Wine className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Aucun parfum emblématique répertorié</p>
        <p className="text-sm mt-2 max-w-sm mx-auto">
          Les parfums contenant {moleculeName} seront ajoutés progressivement.
        </p>
      </div>
    );
  }

  // Grouper par maison
  const byHouse = perfumes.reduce<Record<string, typeof perfumes>>((acc, p) => {
    if (!acc[p.perfumeHouse]) acc[p.perfumeHouse] = [];
    acc[p.perfumeHouse].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20 rounded-xl p-5 border border-amber-200/60 dark:border-amber-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              {perfumes.length} parfum{perfumes.length > 1 ? 's' : ''} emblématique{perfumes.length > 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {moleculeName} est présent dans ces créations de référence
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(ROLE_LABELS).map(([key, { label, color }]) => {
            const count = perfumes.filter(p => p.roleInPerfume === key).length;
            if (count === 0) return null;
            return (
              <span key={key} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {label} ×{count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Cartes par maison */}
      {Object.entries(byHouse).map(([house, items]) => (
        <div key={house} className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">{house}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(p => {
              const roleInfo = ROLE_LABELS[p.roleInPerfume] || ROLE_LABELS.ingredient_cle;
              return (
                <div key={p.id} className="rounded-xl border bg-card p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-semibold text-base leading-tight">{p.perfumeName}</h5>
                      <p className="text-sm text-muted-foreground">{p.perfumeHouse}{p.year ? ` — ${p.year}` : ''}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>

                  {p.perfumer && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Parfumeur : <span className="font-medium text-foreground">{p.perfumer}</span></span>
                    </div>
                  )}

                  {p.concentration && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Droplet className="h-3.5 w-3.5" />
                      <span>Concentration : <span className="font-medium text-foreground">{p.concentration}</span></span>
                    </div>
                  )}

                  {p.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed border-t pt-2">{p.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-xs text-muted-foreground text-center pt-2">
        Sources : Luca Turin &amp; Tania Sanchez « Perfumes: The Guide » (2008), Fragrantica, Osmathèque, Arctander (1969)
      </div>
    </div>
  );
}

// ============================================================================
// COMPOSANT ONGLET STRUCTURE 3D
// ============================================================================

interface Structure3DTabProps {
  moleculeId: number;
  moleculeName: string;
  formula?: string | null;
  smiles?: string | null;
  pubchemCid?: number | null;
}

function Structure3DTab({ moleculeId, moleculeName, formula, smiles, pubchemCid }: Structure3DTabProps) {
  const [viewMode, setViewMode] = useState<"canvas" | "pubchem">("canvas");

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/30 rounded-xl p-5 border border-blue-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-900/40">
            <Box className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-100">Structure Moléculaire 3D — {moleculeName}</h3>
            <p className="text-sm text-blue-300/80">
              {pubchemCid
                ? "Données structurales validées via PubChem"
                : formula
                ? "Visualisation générée à partir de la formule chimique"
                : "Aucune donnée structurale disponible"}
            </p>
          </div>
        </div>

        {/* Informations structurales */}
        <div className="flex flex-wrap gap-3 mt-3">
          {formula && (
            <div className="flex items-center gap-1.5 bg-blue-900/30 rounded-lg px-3 py-1.5">
              <Atom className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-sm font-mono text-blue-200">{formula}</span>
            </div>
          )}
          {smiles && (
            <div className="flex items-center gap-1.5 bg-indigo-900/30 rounded-lg px-3 py-1.5 max-w-xs overflow-hidden">
              <span className="text-xs text-indigo-300 font-medium shrink-0">SMILES</span>
              <span className="text-xs font-mono text-indigo-200 truncate">{smiles}</span>
            </div>
          )}
          {pubchemCid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-900/30 rounded-lg px-3 py-1.5 hover:bg-green-900/50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs text-green-300">PubChem CID {pubchemCid}</span>
            </a>
          )}
        </div>
      </div>

      {/* Sélecteur de mode */}
      {pubchemCid && (
        <div className="flex gap-2">
          <Button
            variant={viewMode === "canvas" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("canvas")}
            className="gap-2"
          >
            <Box className="h-4 w-4" />
            Viewer interactif
          </Button>
          <Button
            variant={viewMode === "pubchem" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("pubchem")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            Conformère PubChem 3D
          </Button>
        </div>
      )}

      {/* Viewer Canvas (mode par défaut) */}
      {viewMode === "canvas" && (
        <div className="space-y-4">
          {formula ? (
            <>
              <Molecule3DViewer
                moleculeId={moleculeId}
                moleculeName={moleculeName}
                formula={formula}
                smiles={smiles || undefined}
                showControls={true}
                showInfo={true}
                autoRotate={false}
                height={500}
              />
              <p className="text-xs text-muted-foreground text-center">
                {smiles
                  ? "Structure générée à partir du SMILES. Utilisez la souris pour faire pivoter, la molette pour zoomer."
                  : "Structure approximative générée à partir de la formule brute. Pour une structure précise, consultez PubChem."}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border rounded-lg bg-muted/20">
              <Box className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Formule chimique non disponible</p>
              <p className="text-sm mt-1">Ajoutez la formule chimique pour activer la visualisation 3D</p>
            </div>
          )}
        </div>
      )}

      {/* Iframe PubChem 3D Conformer */}
      {viewMode === "pubchem" && pubchemCid && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}#section=3D-Conformer&embed=true`}
              width="100%"
              height="500"
              className="block"
              title={`Structure 3D PubChem — ${moleculeName}`}
              loading="lazy"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Conformère 3D officiel PubChem (CID {pubchemCid}) — données validées par le NCBI
          </p>
        </div>
      )}

      {/* Liens externes */}
      <div className="grid sm:grid-cols-3 gap-3">
        {pubchemCid && (
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Globe className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">PubChem</p>
              <p className="text-xs text-muted-foreground">Fiche complète NCBI</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>
        )}
        {smiles && (
          <a
            href={`https://www.chemspider.com/Search.aspx?q=${encodeURIComponent(smiles)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Atom className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">ChemSpider</p>
              <p className="text-xs text-muted-foreground">Recherche par SMILES</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>
        )}
        {formula && (
          <a
            href={`https://www.chemicalbook.com/Search.aspx?kw=${encodeURIComponent(moleculeName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <Beaker className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">ChemicalBook</p>
              <p className="text-xs text-muted-foreground">Données physico-chimiques</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPOSANT ONGLET SYNERGIES MOLÉCULAIRES
// ============================================================================

const SYNERGY_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string; description: string }> = {
  potentialisation: {
    label: "Potentialisation",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: "⚡",
    description: "Les deux molécules se renforcent mutuellement, amplifiant leur effet olfactif."
  },
  stabilisation: {
    label: "Stabilisation",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: "🔒",
    description: "L'une des molécules stabilise ou fixe l'autre, prolongeant sa tenue."
  },
  transformation: {
    label: "Transformation",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    icon: "🔄",
    description: "La combinaison crée un accord olfactif nouveau, différent des deux molécules seules."
  },
  masquage: {
    label: "Masquage",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: "🎭",
    description: "Une molécule atténue ou masque l'odeur de l'autre."
  },
  neutralisation: {
    label: "Neutralisation",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    icon: "⊘",
    description: "Les deux molécules s'annulent mutuellement."
  },
};

function SynergiesTab({ moleculeName, moleculeId }: { moleculeName: string; moleculeId: number }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Récupérer les synergies par nom de molécule
  const { data: namedSynergies, isLoading: loadingNamed } = trpc.molecularSynergies.getForMolecule.useQuery(
    { moleculeName },
    { enabled: !!moleculeName }
  );

  // Récupérer les synergies depuis la table molecule_synergies (par ID)
  const { data: dbSynergies, isLoading: loadingDb } = trpc.synergies.getAllMoleculeSynergies.useQuery();

  const isLoading = loadingNamed || loadingDb;

  // Filtrer les synergies DB par ID de molécule
  const filteredDbSynergies = (dbSynergies || []).filter((s: any) =>
    s.molecule1Id === moleculeId || s.molecule2Id === moleculeId
  );

  // Combiner et dédupliquer
  const allSynergies = [
    ...(namedSynergies || []).map((s: any) => ({
      id: `named-${s.id}`,
      type: s.synergyType || s.type || "potentialisation",
      molecule1: s.molecule1 || moleculeName,
      molecule2: s.molecule2 || s.partnerMolecule,
      description: s.description || s.effect,
      intensity: s.intensity,
      source: s.source || "Données de recherche",
      mechanism: s.mechanism || s.chemicalMechanism,
      application: s.application || s.olfactiveApplication,
      ratio: s.ratio,
    })),
    ...filteredDbSynergies.map((s: any) => ({
      id: `db-${s.id}`,
      type: s.type || s.synergyType || "potentialisation",
      molecule1: s.molecule1Name || `Molécule #${s.molecule1Id}`,
      molecule2: s.molecule2Name || `Molécule #${s.molecule2Id}`,
      description: s.description,
      intensity: s.intensity,
      source: s.source,
      mechanism: s.chemicalMechanism,
      application: s.applications || s.olfactiveApplication,
      ratio: s.optimalRatio,
    })),
  ];

  // Dédupliquer par description
  const seen = new Set<string>();
  const uniqueSynergies = allSynergies.filter(s => {
    const key = `${s.molecule1}-${s.molecule2}-${s.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filtered = activeFilter === "all"
    ? uniqueSynergies
    : uniqueSynergies.filter(s => s.type === activeFilter);

  const typeCount = uniqueSynergies.reduce((acc: Record<string, number>, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="text-2xl">⚗️</span>
          Synergies Moléculaires
        </h2>
        <p className="text-sm text-muted-foreground">
          Interactions documentées entre <strong>{moleculeName}</strong> et d'autres molécules.
          Ces synergies guident la formulation d'accords olfactifs complexes.
        </p>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {Object.entries(SYNERGY_TYPE_CONFIG).map(([type, config]) => (
            <div
              key={type}
              className={`rounded-lg border p-3 text-center cursor-pointer transition-all ${
                activeFilter === type ? config.bg : "bg-muted/30 border-border hover:bg-muted/50"
              }`}
              onClick={() => setActiveFilter(activeFilter === type ? "all" : type)}
            >
              <div className="text-xl mb-1">{config.icon}</div>
              <div className={`text-lg font-bold ${config.color}`}>{typeCount[type] || 0}</div>
              <div className="text-xs text-muted-foreground">{config.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau récapitulatif masquage / neutralisation */}
      {(typeCount['masquage'] || 0) + (typeCount['neutralisation'] || 0) > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/30 flex items-center gap-2">
            <span className="text-base">🎭</span>
            <h3 className="font-semibold text-sm">Interactions de masquage &amp; neutralisation</h3>
            <Badge variant="secondary" className="ml-auto text-xs">
              {(typeCount['masquage'] || 0) + (typeCount['neutralisation'] || 0)} interaction{(typeCount['masquage'] || 0) + (typeCount['neutralisation'] || 0) > 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="divide-y divide-border/50">
            {uniqueSynergies
              .filter(s => s.type === 'masquage' || s.type === 'neutralisation')
              .map(s => {
                const config = SYNERGY_TYPE_CONFIG[s.type];
                const partner = s.molecule1 === moleculeName ? s.molecule2 : s.molecule1;
                const isMasker = s.type === 'masquage' && s.molecule1 === moleculeName;
                return (
                  <div key={s.id} className="px-5 py-3 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                    <span className="text-lg shrink-0 mt-0.5">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/molecules?search=${encodeURIComponent(partner || '')}`}>
                          <span className={`font-semibold text-sm cursor-pointer hover:underline ${config.color}`}>
                            {partner}
                          </span>
                        </Link>
                        <Badge variant="outline" className={`text-xs ${config.bg} ${config.color}`}>
                          {s.type === 'masquage'
                            ? (isMasker ? `${moleculeName} masque ${partner}` : `${partner} masque ${moleculeName}`)
                            : 'Neutralisation mutuelle'}
                        </Badge>
                      </div>
                      {s.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.description}</p>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          Toutes ({uniqueSynergies.length})
        </Button>
        {Object.entries(SYNERGY_TYPE_CONFIG).map(([type, config]) =>
          (typeCount[type] || 0) > 0 ? (
            <Button
              key={type}
              variant={activeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === type ? "all" : type)}
              className={activeFilter === type ? "" : "border-border"}
            >
              {config.icon} {config.label} ({typeCount[type]})
            </Button>
          ) : null
        )}
      </div>

      {/* Liste des synergies */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-lg border p-12 text-center">
          <div className="text-4xl mb-3">⚗️</div>
          <h3 className="text-lg font-medium mb-2">Aucune synergie documentée</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Les synergies moléculaires pour <strong>{moleculeName}</strong> n'ont pas encore été documentées.
            Elles seront ajoutées au fur et à mesure des recherches.
          </p>
          <div className="mt-4">
            <Link href="/synergies-moleculaires">
              <Button variant="outline" size="sm">
                Voir toutes les synergies →
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((synergie) => {
            const config = SYNERGY_TYPE_CONFIG[synergie.type] || SYNERGY_TYPE_CONFIG.potentialisation;
            const partnerMolecule = synergie.molecule1 === moleculeName ? synergie.molecule2 : synergie.molecule1;

            return (
              <div
                key={synergie.id}
                className={`rounded-lg border p-5 ${config.bg}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100">{moleculeName}</span>
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                        <Link href={`/molecules?search=${encodeURIComponent(partnerMolecule || "")}`}>
                          <span className={`font-semibold cursor-pointer hover:underline ${config.color}`}>
                            {partnerMolecule || "Molécule partenaire"}
                          </span>
                        </Link>
                      </div>
                      <Badge variant="outline" className={`text-xs mt-1 ${config.bg} ${config.color}`}>
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                  {synergie.intensity && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-muted-foreground mb-1">Intensité</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`w-2 h-4 rounded-sm ${
                              i <= (synergie.intensity || 0)
                                ? config.color.replace("text-", "bg-")
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {synergie.description && (
                  <p className="text-sm text-zinc-300 mb-3 leading-relaxed">{synergie.description}</p>
                )}

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  {synergie.mechanism && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Mécanisme chimique</div>
                      <div className="text-zinc-300">{synergie.mechanism}</div>
                    </div>
                  )}
                  {synergie.application && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Application olfactive</div>
                      <div className="text-zinc-300">{synergie.application}</div>
                    </div>
                  )}
                  {synergie.ratio && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Ratio optimal</div>
                      <div className="text-zinc-300">{synergie.ratio}</div>
                    </div>
                  )}
                  {synergie.source && (
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">Source</div>
                      <div className="text-zinc-400 text-xs">{synergie.source}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lien vers la page des synergies */}
      <div className="bg-card rounded-lg border p-4 flex items-center justify-between">
        <div>
          <div className="font-medium text-sm">Explorer toutes les synergies</div>
          <div className="text-xs text-muted-foreground">Heatmap interactive et graphe de corrélations</div>
        </div>
        <Link href="/synergies-moleculaires">
          <Button variant="outline" size="sm">
            Voir la carte des synergies →
          </Button>
        </Link>
      </div>
    </div>
  );
}
