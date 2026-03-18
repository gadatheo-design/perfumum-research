import React, { useState } from "react";
import { safeJsonParse } from "@/lib/utils";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, 
  Leaf, 
  FlaskConical, 
  MapPin, 
  Beaker, 
  Package, 
  FileText,
  Dna,
  Thermometer,
  Droplets,
  Wind,
  TreeDeciduous,
  Sparkles,
  Shield,
  Loader2,
  Image as ImageIcon,
  GitBranch,
  Sun,
  PlusCircle,
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Globe
} from "lucide-react";
import { RegulatoryProfile, RegulatoryBadge } from "@/components/RegulatoryProfile";
import { PlantImageUpload, PlantImageGallery } from "@/components/PlantImageUpload";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LinkedMolecules, LinkedTerroirs, SimilarContent } from "@/components/SeeAlso";
import { SeeAlsoSection } from "@/components/SeeAlsoSection";
import { LinkedReferences } from "@/components/LinkedReferences";
import { GenealogyTree } from "@/components/GenealogyTree";
import { SeasonalVariations } from "@/components/SeasonalVariations";
import { PlantContributionModal, PlantContributionsBanner } from "@/components/PlantContributionModal";
import { AIEnrichButton } from "@/components/AIEnrichButton";
import { DominantMoleculeBadgeList } from "@/components/DominantMoleculeBadge";
import { useAuth } from "@/_core/hooks/useAuth";
import { EntityConnectionBar } from "@/components/EntityConnectionBar";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";
import { EuropeanaWidget } from "@/components/EuropeanaWidget";

// Mapping des axes climatiques vers des couleurs
const axisColors: Record<string, string> = {
  vent: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  bois: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  disparition: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  vent_bois: "bg-teal-500/10 text-teal-600 border-teal-500/30",
  bois_disparition: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  vent_disparition: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
};

// Mapping des catégories vers des icônes
const categoryIcons: Record<string, React.ReactNode> = {
  aromatique: <Leaf className="h-4 w-4" />,
  tabac: <TreeDeciduous className="h-4 w-4" />,
  cannabis: <Sparkles className="h-4 w-4" />,
  resine: <Droplets className="h-4 w-4" />,
  bois: <TreeDeciduous className="h-4 w-4" />,
  fleur: <Sparkles className="h-4 w-4" />,
  racine: <Dna className="h-4 w-4" />,
  autre: <Leaf className="h-4 w-4" />,
};

export default function PlantDetail() {
  const params = useParams<{ id: string }>();
  const plantId = parseInt(params.id || "0");
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [contribModalOpen, setContribModalOpen] = React.useState(false);
  const [contribDefaultType, setContribDefaultType] = React.useState<string | undefined>(undefined);
  
  // Récupérer les détails complets de la plante
  const { data: plantDetails, isLoading } = trpc.plantStatistics.getPlantWithDetails.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );
  
  // Récupérer les variétés de la plante
  const { data: varieties } = trpc.plantVarieties.getByPlant.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );
  
  // Récupérer les échantillons de la plante
  const { data: samples } = trpc.plantSamples.getByPlant.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );
  
  // Récupérer les analyses de la plante
  const { data: analyses } = trpc.plantAnalyses.getByPlant.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );
  
  // Récupérer les molécules associées à la plante avec leurs restrictions IFRA
  const { data: plantMolecules, isLoading: isLoadingMolecules } = trpc.plantStatistics.getPlantMoleculesWithIfra.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );
  
  // Récupérer les marqueurs civilisationnels
  const { data: civilizationalMarkers } = trpc.markers.getByPlant.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );
  
  // Récupérer le statut de conservation
  const { data: conservationStatus } = trpc.plantsConservation.getConservationStatus.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );

  // Récupérer les terroirs liés à cette plante
  const { data: linkedTerroirs, isLoading: isLoadingTerroirs } = trpc.crossLinks.getTerroirsByPlant.useQuery(
    plantId,
    { enabled: plantId > 0 }
  );

  // Récupérer les plantes similaires
  const { data: similarPlants, isLoading: isLoadingSimilar } = trpc.crossLinks.getSimilarPlants.useQuery(
    { plantId, limit: 5 },
    { enabled: plantId > 0 }
  );

  // Récupérer les parfums emblématiques liés à cette plante
  const { data: plantPerfumes } = trpc.plants.getPerfumes.useQuery(
    plantId,
    { enabled: plantId > 0 }
  );

  // NOSE Phase 1 — Émissions olfactives GC-MS
  const { data: olfactiveEmissions } = trpc.olfactiveEmissions.getByPlant.useQuery(
    { plantId, limit: 100 },
    { enabled: plantId > 0 }
  );
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!plantDetails) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Plante non trouvée</h2>
          <p className="text-muted-foreground mb-4">
            Cette plante n'existe pas ou a été supprimée.
          </p>
          <Link href="/plantes?tab=plantes">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux plantes
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const plant = plantDetails;
  // Helpers de normalisation des champs JSON polymorphes
  const asStringPlant = (val: unknown): string => {
    if (!val) return "";
    if (typeof val === "string") {
      const t = val.trim();
      if (t.startsWith("[") || t.startsWith("{")) {
        try { const p = JSON.parse(t); if (Array.isArray(p)) return p.join(", "); } catch { /* ignore */ }
      }
      return val;
    }
    if (Array.isArray(val)) return (val as string[]).filter(Boolean).join(", ");
    return String(val);
  };
  const asArrayPlant = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return (val as unknown[]).map(String).filter(Boolean);
    if (typeof val === "string") {
      const t = val.trim();
      if (t.startsWith("[")) { try { const p = JSON.parse(t); if (Array.isArray(p)) return p.map(String).filter(Boolean); } catch { /* ignore */ } }
      return t ? [t] : [];
    }
    return [String(val)];
  };

  const botanicalStates = (() => {
    const raw = plant.botanicalStates;
    if (!raw) return null;
    if (Array.isArray(raw)) return raw as Array<{ state: string; name: string; odor: string; molecules: string[]; usage: string; }>;
    if (typeof raw === "string") {
      try { const p = JSON.parse(raw); return Array.isArray(p) ? p : null; } catch { return null; }
    }
    return null;
  })();
  
  const dominantMolecules = asArrayPlant(plant.dominantMolecules);
  
  return (
    <div className="container py-8 max-w-6xl">
      {/* Breadcrumbs */}
      <Breadcrumbs currentLabel={plant.name} />
      
      {/* Header avec navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/plantes?tab=plantes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux plantes
          </Button>
        </Link>
      </div>
      
      {/* Banner contributions en attente (admin seulement) */}
      <PlantContributionsBanner plantId={plantId} isAdmin={user?.role === 'admin'} />

      {/* En-tête de la plante */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {categoryIcons[plant.category] || <Leaf className="h-5 w-5" />}
              <Badge variant="outline" className="capitalize">
                {plant.category}
              </Badge>
              {plant.climaticAxis && (
                <Badge className={axisColors[plant.climaticAxis] || "bg-gray-100"}>
                  Axe {plant.climaticAxis.replace(/_/g, " + ")}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-1">{plant.name}</h1>
            {plant.latinName && (
              <p className="text-lg text-muted-foreground italic">{plant.latinName}</p>
            )}
            {plant.family && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Famille : <span className="font-medium text-foreground">{plant.family}</span>
                </p>
                <Link href={`/famille/${encodeURIComponent(plant.family)}`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <GitBranch className="h-3 w-3 mr-1" />
                    Voir la famille
                  </Button>
                </Link>
                <Link href="/phylogenetique">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    Classification
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3">
            {plant.imageUrl && (
              <img 
                src={plant.imageUrl} 
                alt={plant.name}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            )}
            <div className="flex items-center gap-2">
              <AIEnrichButton
                entityType="plant"
                entityId={plantId}
                entityName={plant.name}
                onEnrichSuccess={() => {
                  utils.plantStatistics.getPlantWithDetails.invalidate({ plantId });
                  utils.plantStatistics.getPlantMoleculesWithIfra.invalidate({ plantId });
                }}
              />
              <PlantContributionModal
                plantId={plantId}
                plantName={plant.name}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Onglets principaux */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-12">
          <TabsTrigger value="nomenclature" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span className="hidden sm:inline">Nomenclature</span>
          </TabsTrigger>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="varieties">Variétés ({varieties?.length || 0})</TabsTrigger>
          <TabsTrigger value="states">États botaniques</TabsTrigger>
          <TabsTrigger value="samples">Échantillons ({samples?.length || 0})</TabsTrigger>
          <TabsTrigger value="analyses">Analyses ({analyses?.length || 0})</TabsTrigger>
          <TabsTrigger value="history">Histoire</TabsTrigger>
          <TabsTrigger value="conservation">Conservation</TabsTrigger>
          <TabsTrigger value="regulatory">Réglementation</TabsTrigger>
          <TabsTrigger value="usage">Usage Absorbe</TabsTrigger>
          <TabsTrigger value="genealogy">Généalogie</TabsTrigger>
          <TabsTrigger value="seasonal">Variations</TabsTrigger>
          <TabsTrigger value="gcms" className="flex items-center gap-1">
            <FlaskConical className="h-3 w-3" />
            <span className="hidden sm:inline">GC-MS</span>
            {olfactiveEmissions && olfactiveEmissions.total > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1">{olfactiveEmissions.total}</Badge>
            )}
          </TabsTrigger>
          {plantPerfumes && plantPerfumes.length > 0 && (
            <TabsTrigger value="perfumes">Parfums ({plantPerfumes.length})</TabsTrigger>
          )}
          <TabsTrigger value="europeana" className="flex items-center gap-1">
            <Globe className="h-3 w-3 text-cyan-600" />
            <span className="hidden sm:inline">Europeana</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Nomenclature */}
        <TabsContent value="nomenclature" className="space-y-6">
          <TabErrorBoundary tabLabel="Nomenclature"><NomenclatureTab plant={plant} /></TabErrorBoundary>
        </TabsContent>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <TabErrorBoundary tabLabel="Vue d'ensemble">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profil olfactif */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  Profil olfactif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plant.olfactiveSignature && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Signature olfactive
                    </h4>
                    <p className="text-sm">{plant.olfactiveSignature}</p>
                  </div>
                )}
                {dominantMolecules.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Molécules dominantes
                    </h4>
                    <DominantMoleculeBadgeList
                      molecules={dominantMolecules}
                      currentPlantId={plantId}
                      maxVisible={12}
                    />
                  </div>
                )}
                {plant.chemotypes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Chémotypes
                    </h4>
                    <p className="text-sm">{plant.chemotypes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Origine et habitat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Origine et habitat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plant.origin && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Origine géographique
                    </h4>
                    <p className="text-sm">{plant.origin}</p>
                  </div>
                )}
                {plant.habitat && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Habitat naturel
                    </h4>
                    <p className="text-sm">{plant.habitat}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Usage traditionnel */}
            {plant.traditionalUse && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Usage traditionnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{plant.traditionalUse}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Notes */}
            {plant.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes de recherche
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{plant.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Images */}
        <TabsContent value="images" className="space-y-6">
          <TabErrorBoundary tabLabel="Images">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Galerie d'images
                  </CardTitle>
                  <CardDescription>
                    Photos d'échantillons, de terrain et d'analyses pour {plant.name}
                  </CardDescription>
                </div>
                <PlantImageUpload 
                  plantId={plantId} 
                  plantName={plant.name}
                />
              </div>
              </CardHeader>
            <CardContent>
              <PlantImageGallery plantId={plantId} />
              <div className="mt-4 pt-4 border-t">
                <PlantContributionModal
                  plantId={plantId}
                  plantName={plant.name}
                  defaultTab="image"
                />
              </div>
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Variétés */}
        <TabsContent value="varieties" className="space-y-6">
          <TabErrorBoundary tabLabel="Variétés">
          {varieties && varieties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {varieties.map((variety: any) => (
                <Link key={variety.id} href={`/varietes/${variety.id}`}>
                <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{variety.name}</CardTitle>
                        {variety.latinName && (
                          <CardDescription className="italic">
                            {variety.latinName}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {variety.varietyType?.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {variety.distinctiveFeatures && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Caractéristiques distinctives
                        </h4>
                        <p className="text-sm">{variety.distinctiveFeatures}</p>
                      </div>
                    )}
                    {variety.olfactiveDescription && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Profil olfactif
                        </h4>
                        <p className="text-sm">{variety.olfactiveDescription}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {variety.countryOfOrigin && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {variety.countryOfOrigin}
                        </span>
                      )}
                      {variety.essentialOilYield && (
                        <span className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          Rendement HE: {variety.essentialOilYield}
                        </span>
                      )}
                      {variety.commercialAvailability && (
                        <Badge variant="secondary" className="text-xs">
                          {variety.commercialAvailability.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Voir les détails de la variété</span>
                      <ArrowLeft className="h-4 w-4 rotate-180 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Dna className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune variété enregistrée</h3>
                <p className="text-muted-foreground mb-4">
                  Les variétés, cultivars et chémotypes seront ajoutés ici.
                </p>
                <Button variant="outline">
                  Ajouter une variété
                </Button>
              </CardContent>
            </Card>
          )}
          </TabErrorBoundary>
        </TabsContent>
        
        {/* États botaniques */}
        <TabsContent value="states" className="space-y-6">
          <TabErrorBoundary tabLabel="États botaniques">
          {botanicalStates && botanicalStates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botanicalStates.map((state: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {state.state}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{state.name}</CardTitle>
                        <CardDescription>État {state.state}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Odeur
                      </h4>
                      <p className="text-sm">{state.odor}</p>
                    </div>
                    {state.molecules && state.molecules.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Molécules dominantes
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {state.molecules.map((mol: any, molIdx: number) => (
                            <Badge key={molIdx} variant="secondary" className="text-xs">
                              {mol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Usage recommandé
                      </h4>
                      <p className="text-sm">{state.usage}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Thermometer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">États botaniques non définis</h3>
                <p className="text-muted-foreground">
                  Les différents états de la plante (A, B, C, D) seront documentés ici.
                </p>
              </CardContent>
            </Card>
          )}
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Échantillons */}
        <TabsContent value="samples" className="space-y-6">
          <TabErrorBoundary tabLabel="Échantillons">
          {samples && samples.length > 0 ? (
            <div className="space-y-4">
              {samples.map((sample: any) => (
                <Card key={sample.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {sample.sampleId}
                        </CardTitle>
                        {sample.batchNumber && (
                          <CardDescription>Lot: {sample.batchNumber}</CardDescription>
                        )}
                      </div>
                      <Badge 
                        variant={sample.status === "available" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {sample.status?.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {sample.plantPart && (
                        <div>
                          <span className="text-muted-foreground">Partie:</span>
                          <p className="font-medium capitalize">{sample.plantPart}</p>
                        </div>
                      )}
                      {sample.botanicalState && (
                        <div>
                          <span className="text-muted-foreground">État:</span>
                          <p className="font-medium">{sample.botanicalState}</p>
                        </div>
                      )}
                      {sample.harvestYear && (
                        <div>
                          <span className="text-muted-foreground">Récolte:</span>
                          <p className="font-medium">{sample.harvestYear}</p>
                        </div>
                      )}
                      {sample.currentQuantity && (
                        <div>
                          <span className="text-muted-foreground">Quantité:</span>
                          <p className="font-medium">{sample.currentQuantity} {sample.unit}</p>
                        </div>
                      )}
                      {sample.qualityGrade && (
                        <div>
                          <span className="text-muted-foreground">Qualité:</span>
                          <p className="font-medium capitalize">{sample.qualityGrade}</p>
                        </div>
                      )}
                      {sample.storageLocation && (
                        <div>
                          <span className="text-muted-foreground">Stockage:</span>
                          <p className="font-medium">{sample.storageLocation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun échantillon</h3>
                <p className="text-muted-foreground mb-4">
                  Les échantillons et lots seront enregistrés ici.
                </p>
                <Button variant="outline">
                  Ajouter un échantillon
                </Button>
              </CardContent>
            </Card>
          )}
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Analyses */}
        <TabsContent value="analyses" className="space-y-6">
          <TabErrorBoundary tabLabel="Analyses">
          {analyses && analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis: any) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Beaker className="h-5 w-5" />
                          {analysis.analysisId}
                        </CardTitle>
                        {analysis.laboratory && (
                          <CardDescription>{analysis.laboratory}</CardDescription>
                        )}
                      </div>
                      <Badge variant="outline" className="uppercase">
                        {analysis.method}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {analysis.analysisDate && (
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">
                            {new Date(analysis.analysisDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      )}
                      {analysis.analyst && (
                        <div>
                          <span className="text-muted-foreground">Analyste:</span>
                          <p className="font-medium">{analysis.analyst}</p>
                        </div>
                      )}
                      {analysis.totalCompoundsIdentified && (
                        <div>
                          <span className="text-muted-foreground">Composés identifiés:</span>
                          <p className="font-medium">{analysis.totalCompoundsIdentified}</p>
                        </div>
                      )}
                      {analysis.qualityScore && (
                        <div>
                          <span className="text-muted-foreground">Qualité:</span>
                          <Badge variant="secondary" className="capitalize">
                            {analysis.qualityScore}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {analysis.reportUrl && (
                      <div className="mt-4">
                        <a 
                          href={analysis.reportUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          Voir le rapport complet
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune analyse</h3>
                <p className="text-muted-foreground mb-4">
                  Les analyses GC-MS et profils moléculaires seront enregistrés ici.
                </p>
                <Button variant="outline" className="gap-1.5" onClick={() => { setContribDefaultType('gcms_analysis'); setContribModalOpen(true); }}>
                  <PlusCircle className="w-4 h-4" />
                  Proposer une analyse GC-MS
                </Button>
              </CardContent>
            </Card>
          )}
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Usage Absorbe */}
        <TabsContent value="usage" className="space-y-6">
          <TabErrorBoundary tabLabel="Usage Absorbe">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Usage dans le système Absorbe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plant.absorbeUse ? (
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{plant.absorbeUse}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  L'usage spécifique dans le système Absorbe n'a pas encore été documenté pour cette plante.
                </p>
              )}
              
              {plant.climaticAxis && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Axe climatique</h4>
                  <Badge className={axisColors[plant.climaticAxis] || "bg-gray-100"}>
                    {plant.climaticAxis.replace(/_/g, " + ").toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plant.climaticAxis === "vent" && "Axe de la circulation, du mouvement et de la fraîcheur."}
                    {plant.climaticAxis === "bois" && "Axe de la structure, de la densité et de la persistance."}
                    {plant.climaticAxis === "disparition" && "Axe de l'évanescence, de la mémoire et de la transformation."}
                    {plant.climaticAxis === "vent_bois" && "Combinaison de circulation et structure."}
                    {plant.climaticAxis === "bois_disparition" && "Combinaison de structure et évanescence."}
                    {plant.climaticAxis === "vent_disparition" && "Combinaison de circulation et évanescence."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Onglet Histoire */}
        <TabsContent value="history" className="space-y-6">
          <TabErrorBoundary tabLabel="Histoire">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histoire et marqueurs civilisationnels
              </CardTitle>
              <CardDescription>
                Utilisation historique de cette plante à travers les civilisations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {civilizationalMarkers && civilizationalMarkers.length > 0 ? (
                <div className="space-y-4">
                  {/* Timeline horizontale */}
                  <div className="relative">
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" />
                    <div className="relative flex gap-8 overflow-x-auto pb-4">
                      {civilizationalMarkers
                        .sort((a: any, b: any) => (a.startYear || 0) - (b.startYear || 0))
                        .map((marker: any) => (
                        <div key={marker.id} className="flex-shrink-0 w-64">
                          <div className="relative">
                            <div className="w-4 h-4 rounded-full bg-primary mx-auto mb-2 relative z-10" />
                            <Card className="mt-2">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm">{marker.civilization}</CardTitle>
                                <CardDescription className="text-xs">
                                  {marker.period}
                                  {marker.startYear && (
                                    <span className="block mt-1">
                                      {marker.startYear < 0 ? `${Math.abs(marker.startYear)} av. J.-C.` : marker.startYear}
                                      {marker.endYear && ` - ${marker.endYear < 0 ? `${Math.abs(marker.endYear)} av. J.-C.` : marker.endYear}`}
                                    </span>
                                  )}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {marker.usageType}
                                </Badge>
                                {marker.historicalSignificance && (
                                  <p className="text-xs text-muted-foreground">
                                    {marker.historicalSignificance}
                                  </p>
                                )}
                                {marker.tradeRoutes && marker.tradeRoutes.length > 0 && (
                                  <div className="pt-2 border-t">
                                    <p className="text-xs font-medium mb-1">Routes commerciales</p>
                                    {marker.tradeRoutes.map((route: any, idx: number) => (
                                      <p key={idx} className="text-xs text-muted-foreground">
                                        {route.route}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune tradition olfactive documentée pour cette plante.</p>
                  <p className="text-sm mt-2">
                    Les traditions olfactives permettent de retracer l'histoire de l'usage de cette plante.
                  </p>
                  <Button variant="outline" className="mt-4 gap-1.5" onClick={() => { setContribDefaultType('tradition_olfactive'); setContribModalOpen(true); }}>
                    <PlusCircle className="w-4 h-4" />
                    Proposer une tradition olfactive
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Onglet Conservation */}
        <TabsContent value="conservation" className="space-y-6">
          <TabErrorBoundary tabLabel="Conservation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Statut de conservation
              </CardTitle>
              <CardDescription>
                Statut IUCN, CITES et mesures de protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statuts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plant.conservationStatus && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Statut IUCN</h4>
                    <Badge className={`text-lg ${
                      plant.conservationStatus === 'EX' || plant.conservationStatus === 'EW' ? 'bg-black text-white' :
                      plant.conservationStatus === 'CR' ? 'bg-red-500 text-white' :
                      plant.conservationStatus === 'EN' ? 'bg-orange-500 text-white' :
                      plant.conservationStatus === 'VU' ? 'bg-yellow-500 text-white' :
                      plant.conservationStatus === 'NT' ? 'bg-blue-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {plant.conservationStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {plant.conservationStatus === 'EX' && 'Éteint'}
                      {plant.conservationStatus === 'EW' && 'Éteint à l’état sauvage'}
                      {plant.conservationStatus === 'CR' && 'En danger critique'}
                      {plant.conservationStatus === 'EN' && 'En danger'}
                      {plant.conservationStatus === 'VU' && 'Vulnérable'}
                      {plant.conservationStatus === 'NT' && 'Quasi menacé'}
                      {plant.conservationStatus === 'LC' && 'Préoccupation mineure'}
                      {plant.conservationStatus === 'DD' && 'Données insuffisantes'}
                      {plant.conservationStatus === 'NE' && 'Non évalué'}
                    </p>
                    {plant.lastAssessmentYear && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Dernière évaluation: {plant.lastAssessmentYear}
                      </p>
                    )}
                  </div>
                )}
                
                {plant.citesAppendix && plant.citesAppendix !== 'UNKNOWN' && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">CITES</h4>
                    <Badge className={`text-lg ${
                      plant.citesAppendix === 'I' ? 'bg-red-500 text-white' :
                      plant.citesAppendix === 'II' ? 'bg-yellow-500 text-white' :
                      plant.citesAppendix === 'III' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      Annexe {plant.citesAppendix}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {plant.citesAppendix === 'I' && 'Commerce international généralement interdit'}
                      {plant.citesAppendix === 'II' && 'Commerce strictement régulé'}
                      {plant.citesAppendix === 'III' && 'Commerce régulé à la demande d\'un pays'}
                      {plant.citesAppendix === 'NONE' && 'Non listé'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Facteurs de menace */}
              {plant.threatFactors && Object.keys(plant.threatFactors).length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Facteurs de menace</h4>
                  <div className="flex flex-wrap gap-2">
                    {plant.threatFactors.overharvesting && (
                      <Badge variant="destructive">Surexploitation</Badge>
                    )}
                    {plant.threatFactors.habitat_loss && (
                      <Badge variant="destructive">Perte d'habitat</Badge>
                    )}
                    {plant.threatFactors.climate_change && (
                      <Badge variant="destructive">Changement climatique</Badge>
                    )}
                    {plant.threatFactors.illegal_trade && (
                      <Badge variant="destructive">Commerce illégal</Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Notes de conservation */}
              {plant.conservationNotes && (
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Notes de conservation</h4>
                  <p className="text-sm whitespace-pre-wrap">{plant.conservationNotes}</p>
                </div>
              )}
              
              {/* Alternatives durables */}
              {plant.sustainableAlternatives && (
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">Alternatives durables</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">{plant.sustainableAlternatives}</p>
                </div>
              )}
              
              {/* Lien vers la page Patrimoine menacé */}
              <div className="pt-4 border-t">
                <Link href="/patrimoine-menace">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Consulter toutes les espèces menacées
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>
        
        {/* Onglet Réglementation */}
        <TabsContent value="regulatory" className="space-y-6">
          <TabErrorBoundary tabLabel="Réglementation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Profil Réglementaire IFRA
              </CardTitle>
              <CardDescription>
                Restrictions IFRA applicables aux molécules présentes dans cette plante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingMolecules ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : plantMolecules && plantMolecules.length > 0 ? (
                <div className="space-y-4">
                  {/* Résumé des restrictions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{plantMolecules.length}</p>
                      <p className="text-xs text-muted-foreground">Molécules documentées</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-500">
                        {plantMolecules.filter((pm: any) => pm.ifraRestrictions?.some((r: any) => r.restrictionType === 'restricted')).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Avec restrictions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-500">
                        {plantMolecules.filter((pm: any) => pm.ifraRestrictions?.some((r: any) => r.restrictionType === 'specification')).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Spécifications</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">
                        {plantMolecules.filter((pm: any) => !pm.ifraRestrictions?.length || pm.ifraRestrictions?.some((r: any) => r.restrictionType === 'no_restriction')).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Sans restriction</p>
                    </div>
                  </div>
                  
                  {/* Liste des molécules avec leurs restrictions */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Détail par molécule</h4>
                    {plantMolecules.map((pm: any) => (
                      <div key={pm.moleculeId} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link href={`/molecule/${pm.moleculeId}`}>
                              <span className="font-medium hover:text-primary cursor-pointer">
                                {pm.molecule?.name || `Molécule #${pm.moleculeId}`}
                              </span>
                            </Link>
                            {pm.percentageTypical && (
                              <span className="text-sm text-muted-foreground ml-2">
                                ({pm.percentageTypical}%)
                              </span>
                            )}
                            {pm.role && (
                              <Badge variant="outline" className="ml-2 text-xs capitalize">
                                {pm.role}
                              </Badge>
                            )}
                            {pm.isSignature === 1 && (
                              <Badge className="ml-2 bg-amber-500/10 text-amber-600 border-amber-500/30">
                                Signature
                              </Badge>
                            )}
                          </div>
                          {pm.ifraRestrictions?.[0]?.restrictionType && (
                            <RegulatoryBadge restrictionType={pm.ifraRestrictions[0].restrictionType} />
                          )}
                        </div>
                        
                        {pm.ifraRestrictions && pm.ifraRestrictions.length > 0 ? (
                          <RegulatoryProfile 
                            restrictions={pm.ifraRestrictions}
                            moleculeName={pm.molecule?.name}
                            moleculeId={pm.moleculeId}
                            compact={false}
                            showLink={true}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucune restriction IFRA documentée pour cette molécule.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune molécule documentée pour cette plante.</p>
                  <p className="text-sm mt-2">
                    Les associations molécules-plantes permettent d'afficher le profil réglementaire.
                  </p>
                </div>
              )}
              
              {/* Lien vers la page IFRA */}
              <div className="pt-4 border-t">
                <Link href="/ifra">
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Consulter toutes les restrictions IFRA
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>

        {/* Généalogie */}
        <TabsContent value="genealogy" className="space-y-6">
          <TabErrorBoundary tabLabel="Généalogie">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Arbre généalogique
              </CardTitle>
              <CardDescription>
                Visualisation interactive des relations parentales et des croisements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenealogyTree varietyId={plant.id} varietyName={plant.name} />
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>

        {/* Variations Saisonnières */}
        <TabsContent value="seasonal" className="space-y-6">
          <TabErrorBoundary tabLabel="Variations saisonnières">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Variations saisonnières
              </CardTitle>
              <CardDescription>
                Évolution de la composition moléculaire selon les saisons, conditions de culture et méthodes de séchage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SeasonalVariations plantName={plant.name} plantId={plant.id} />
            </CardContent>
          </Card>
          </TabErrorBoundary>
        </TabsContent>

        {/* Parfums Emblématiques */}
        {plantPerfumes && plantPerfumes.length > 0 && (
          <TabsContent value="perfumes" className="space-y-6">
            <TabErrorBoundary tabLabel="Parfums">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Parfums emblématiques
                </CardTitle>
                <CardDescription>
                  Créations parfumées emblématiques utilisant {plant.name} comme ingrédient clé
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Grouper par maison */}
                {(() => {
                  type PerfumeRow = { id: number; perfume_name: string; perfume_house?: string; perfumer?: string; year?: number; role_in_perfume?: string; ingredient_type?: string; description?: string };
                  const byHouse: Record<string, PerfumeRow[]> = {};
                  for (const p of (plantPerfumes as PerfumeRow[])) {
                    const h = p.perfume_house || 'Indépendant';
                    if (!byHouse[h]) byHouse[h] = [];
                    byHouse[h].push(p);
                  }
                  return Object.entries(byHouse).map(([house, perfumes]) => (
                    <div key={house} className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 border-b pb-2">
                        {house}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {perfumes.map((p: any) => (
                          <div key={p.id} className="rounded-lg border bg-card p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-medium text-sm leading-tight">{p.perfume_name}</span>
                              {p.year && (
                                <Badge variant="outline" className="text-xs shrink-0">{p.year}</Badge>
                              )}
                            </div>
                            {p.role_in_perfume && (
                              <Badge className={`text-xs ${
                                p.role_in_perfume === 'signature' ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' :
                                p.role_in_perfume === 'accord_principal' ? 'bg-violet-500/15 text-violet-700 border-violet-500/30' :
                                p.role_in_perfume === 'note_coeur' ? 'bg-rose-500/15 text-rose-700 border-rose-500/30' :
                                p.role_in_perfume === 'note_fond' ? 'bg-amber-900/15 text-amber-900 border-amber-900/30' :
                                'bg-muted text-muted-foreground'
                              } border`}>
                                {p.role_in_perfume.replace(/_/g, ' ')}
                              </Badge>
                            )}
                            {p.perfumer && (
                              <p className="text-xs text-muted-foreground">✦ {p.perfumer}</p>
                            )}
                            {p.description && (
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>
          </TabErrorBoundary>
          </TabsContent>
        )}
        {/* NOSE Phase 1 — Onglet GC-MS / Émissions Olfactives */}
        <TabsContent value="gcms" className="space-y-6">
          <TabErrorBoundary tabLabel="GC-MS">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-emerald-500" />
                  Émissions Olfactives — Profil GC-MS
                </CardTitle>
                <CardDescription>
                  Données de chromatographie gazeuse (NOSE Phase 1 — od:L12 Smell Emission)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!olfactiveEmissions || olfactiveEmissions.total === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FlaskConical className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Aucune donnée GC-MS disponible pour cette plante.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{olfactiveEmissions.total} composés identifiés</Badge>
                      {olfactiveEmissions.emissions.some((e: any) => e.role === 'signature') && (
                        <Badge className="bg-amber-500/10 text-amber-700 border-amber-300">Molécules signature présentes</Badge>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 pr-4 font-medium">Molécule</th>
                            <th className="text-left py-2 pr-4 font-medium">Famille</th>
                            <th className="text-right py-2 pr-4 font-medium">%</th>
                            <th className="text-left py-2 pr-4 font-medium">Rôle</th>
                            <th className="text-left py-2 pr-4 font-medium">Partie</th>
                            <th className="text-left py-2 font-medium">Méthode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {olfactiveEmissions.emissions.map((e: any) => (
                            <tr key={e.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="py-2 pr-4">
                                {e.molecule_id ? (
                                  <Link href={`/molecules/${e.molecule_id}`} className="text-primary hover:underline font-medium">
                                    {e.molecule_name || '—'}
                                  </Link>
                                ) : (
                                  <span className="text-muted-foreground">{e.molecule_name || '—'}</span>
                                )}
                                {e.is_signature ? <Badge className="ml-1 text-xs bg-amber-500/10 text-amber-700 border-amber-300">★</Badge> : null}
                              </td>
                              <td className="py-2 pr-4 text-muted-foreground text-xs">{e.chemical_family || '—'}</td>
                              <td className="py-2 pr-4 text-right font-mono">
                                {e.percentage != null ? (
                                  <span className={e.percentage >= 10 ? 'text-emerald-600 font-semibold' : e.percentage >= 1 ? 'text-blue-600' : 'text-muted-foreground'}>
                                    {Number(e.percentage).toFixed(2)}%
                                  </span>
                                ) : e.concentration_ppm != null ? (
                                  <span className="text-blue-600">{Number(e.concentration_ppm).toFixed(1)} ppm</span>
                                ) : '—'}
                              </td>
                              <td className="py-2 pr-4">
                                {e.role && (
                                  <Badge variant="outline" className="text-xs capitalize">{e.role}</Badge>
                                )}
                              </td>
                              <td className="py-2 pr-4 text-xs text-muted-foreground capitalize">{e.plant_part?.replace('_', ' ') || '—'}</td>
                              <td className="py-2 text-xs text-muted-foreground uppercase">{e.analysis_method?.replace('_', '-') || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {olfactiveEmissions.emissions[0]?.analysis_source && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Source : {olfactiveEmissions.emissions[0].analysis_source}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabErrorBoundary>
        </TabsContent>
        {/* Europeana — Collections muséales européennes */}
        <TabsContent value="europeana" className="space-y-4">
          <TabErrorBoundary tabLabel="Europeana">
            <div className="max-w-2xl">
              <EuropeanaWidget
                type="plant"
                entityId={plantId}
                entityName={plant.latin_name || plant.name}
                limit={8}
              />
            </div>
          </TabErrorBoundary>
        </TabsContent>
      </Tabs>

      {/* Références Bibliographiques Liées (V3) */}
      <div className="mt-8">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setContribDefaultType('bibliography'); setContribModalOpen(true); }}>
            <PlusCircle className="w-3.5 h-3.5" />
            Proposer une référence bibliographique
          </Button>
        </div>
        <LinkedReferences 
          entityType="plant" 
          entityId={plantId} 
          title="Références Bibliographiques Associées"
          maxItems={5}
        />
      </div>

      {/* Modal de contribution contextuel */}
      {plantDetails && (
        <PlantContributionModal
          open={contribModalOpen}
          onClose={() => { setContribModalOpen(false); setContribDefaultType(undefined); }}
          plantId={plantId}
          plantName={plantDetails.name}
          defaultType={contribDefaultType as any}
        />
      )}

       {/* Section Voir aussi */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Terroirs où cette plante est cultivée */}
        <LinkedTerroirs
          terroirs={linkedTerroirs || []}
          isLoading={isLoadingTerroirs}
          title="Terroirs de culture"
        />
        {/* Plantes similaires */}
        <SimilarContent
          items={similarPlants || []}
          type="plant"
          isLoading={isLoadingSimilar}
          getSubtitle={(p) => p.latinName || p.family || undefined}
        />
      </div>

      {/* Section Voir aussi — Navigation contextuelle enrichie */}
      <SeeAlsoSection
        title="Explorer les connexions de cette plante"
        groups={[
          {
            label: "Molécules identifiées",
            type: "molecule",
            items: (plantMolecules || []).slice(0, 10).map((pm: any) => ({
              id: pm.moleculeId,
              label: pm.molecule?.name || `Molécule #${pm.moleculeId}`,
              sublabel: pm.molecule?.family || pm.molecule?.chemicalClass || undefined,
              href: `/molecules/${pm.moleculeId}`,
              type: "molecule" as const,
            })),
            viewAllHref: "/molecules",
            viewAllLabel: "Toutes les molécules",
          },
          {
            label: "Terroirs d'origine",
            type: "terroir",
            items: (linkedTerroirs || []).map((t: any) => ({
              id: t.id,
              label: t.name,
              sublabel: t.region || t.country || undefined,
              href: `/terroirs/${t.id}`,
              type: "terroir" as const,
            })),
            viewAllHref: "/plantes?tab=terroirs",
            viewAllLabel: "Tous les terroirs",
          },
          {
            label: "Variétés & cultivars",
            type: "variety",
            items: (varieties || []).map((v: any) => ({
              id: v.id,
              label: v.name,
              sublabel: v.type || undefined,
              href: `/varieties/${v.id}`,
              type: "variety" as const,
            })),
            viewAllHref: "/plantes?tab=varietes",
            viewAllLabel: "Toutes les variétés",
          },
        ]}
      />
    </div>
  );
}

// ============================================================================
// COMPOSANT ONGLET NOMENCLATURE
// ============================================================================
function NomenclatureTab({ plant }: { plant: any }) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Helper local pour normaliser les champs JSON polymorphes
  const asArrayPlant = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return (val as unknown[]).map(String).filter(Boolean);
    if (typeof val === "string") {
      const t = val.trim();
      if (t.startsWith("[")) { try { const p = JSON.parse(t); if (Array.isArray(p)) return p.map(String).filter(Boolean); } catch { /* ignore */ } }
      return t ? [t] : [];
    }
    return [String(val)];
  };

  // Générer les liens externes — priorité aux IDs directs, sinon recherche par nom
  const latinEncoded = plant.latinName ? encodeURIComponent(plant.latinName) : null;
  const gbifUrl = plant.gbifId
    ? `https://www.gbif.org/species/${plant.gbifId}`
    : latinEncoded ? `https://www.gbif.org/species/search?q=${latinEncoded}` : null;
  const itisUrl = plant.itisId
    ? `https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=${plant.itisId}`
    : latinEncoded ? `https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=Scientific_Name&search_value=${latinEncoded}` : null;
  const powUrl = plant.powId
    ? `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${plant.powId}`
    : latinEncoded ? `https://powo.science.kew.org/results?q=${latinEncoded}` : null;
  const wikiUrl = latinEncoded ? `https://fr.wikipedia.org/wiki/${latinEncoded.replace(/%20/g, '_')}` : null;
  const tplUrl = latinEncoded ? `https://www.theplantlist.org/tpl1.1/search?q=${latinEncoded}` : null;

  // Synonymes
  const synonymsList: string[] = asArrayPlant(plant.synonyms);

  return (
    <div className="space-y-6">
      {/* Identité nomenclaturale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Identité nomenclaturale
          </CardTitle>
          <CardDescription>Noms officiels et classification botanique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom commun */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom commun</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{plant.name}</p>
                <button onClick={() => copyToClipboard(plant.name, 'name')} className="text-muted-foreground hover:text-foreground transition-colors">
                  {copied === 'name' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Nom latin */}
            {plant.latinName && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom latin (binomial)</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold italic text-emerald-600 dark:text-emerald-400">{plant.latinName}</p>
                  <button onClick={() => copyToClipboard(plant.latinName, 'latin')} className="text-muted-foreground hover:text-foreground transition-colors">
                    {copied === 'latin' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Famille */}
            {plant.family && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Famille botanique</p>
                <div className="flex items-center gap-2">
                  <Link href={`/famille/${encodeURIComponent(plant.family)}`}>
                    <Badge variant="outline" className="text-sm font-medium cursor-pointer hover:bg-accent">
                      {plant.family}
                    </Badge>
                  </Link>
                </div>
              </div>
            )}

            {/* Catégorie */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Catégorie PERFUMUM</p>
              <Badge variant="secondary" className="capitalize text-sm">{plant.category}</Badge>
            </div>

            {/* Type de matière — architecture refonte 2026-03 */}
            {plant.materialType && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type de matière</p>
                <Badge variant="outline" className="capitalize text-sm bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800">
                  {plant.materialType.replace(/_/g, ' ')}
                </Badge>
              </div>
            )}

            {/* Axe climatique */}
            {plant.climaticAxis && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Axe climatique Absorbe</p>
                <Badge className="capitalize">{plant.climaticAxis.replace(/_/g, ' + ')}</Badge>
              </div>
            )}

            {/* Genre */}
            {plant.genus && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Genre</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium italic">{plant.genus}</p>
                  <button onClick={() => copyToClipboard(plant.genus, 'genus')} className="text-muted-foreground hover:text-foreground transition-colors">
                    {copied === 'genus' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            )}

            {/* Espèce */}
            {plant.species && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Espèce</p>
                <p className="text-sm italic">{plant.species}</p>
              </div>
            )}

            {/* Auteur de la description */}
            {plant.authorCitation && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Auteur (citation)</p>
                <p className="text-sm text-muted-foreground">{plant.authorCitation}</p>
              </div>
            )}

            {/* Origine */}
            {plant.origin && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Origine géographique</p>
                <p className="text-sm">{plant.origin}</p>
              </div>
            )}

            {/* Classification systématique */}
            {(plant.kingdom || plant.division || plant.class || plant.orderName) && (
              <div className="space-y-2 col-span-full">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Classification systématique</p>
                <div className="flex flex-wrap gap-2">
                  {plant.kingdom && (
                    <Badge variant="outline" className="text-xs">
                      <span className="text-muted-foreground mr-1">Règne :</span>{plant.kingdom}
                    </Badge>
                  )}
                  {plant.division && (
                    <Badge variant="outline" className="text-xs">
                      <span className="text-muted-foreground mr-1">Division :</span>{plant.division}
                    </Badge>
                  )}
                  {plant.class && (
                    <Badge variant="outline" className="text-xs">
                      <span className="text-muted-foreground mr-1">Classe :</span>{plant.class}
                    </Badge>
                  )}
                  {plant.orderName && (
                    <Badge variant="outline" className="text-xs">
                      <span className="text-muted-foreground mr-1">Ordre :</span>{plant.orderName}
                    </Badge>
                  )}
                  {plant.family && (
                    <Link href={`/famille/${encodeURIComponent(plant.family)}`}>
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                        <span className="text-muted-foreground mr-1">Famille :</span>{plant.family}
                      </Badge>
                    </Link>
                  )}
                  {plant.genus && (
                    <Badge variant="outline" className="text-xs">
                      <span className="text-muted-foreground mr-1">Genre :</span><span className="italic">{plant.genus}</span>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Synonymes */}
      {synonymsList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-amber-500" />
              Synonymes botaniques
            </CardTitle>
            <CardDescription>{synonymsList.length} synonyme(s) référencé(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {synonymsList.map((syn: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-sm italic font-normal">
                  {syn}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liens externes */}
      {plant.latinName && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              Bases de données botaniques
            </CardTitle>
            <CardDescription>Liens vers les références nomenclaturales internationales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {gbifUrl && (
                <a href={gbifUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary">GBIF</p>
                    <p className="text-xs text-muted-foreground truncate">Global Biodiversity Information Facility</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              )}
              {powUrl && (
                <a href={powUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <TreeDeciduous className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary">Plants of the World</p>
                    <p className="text-xs text-muted-foreground truncate">Kew Gardens — POWO</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              )}
              {itisUrl && (
                <a href={itisUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Dna className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary">ITIS</p>
                    <p className="text-xs text-muted-foreground truncate">Integrated Taxonomic Information System</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              )}
              {wikiUrl && (
                <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary">Wikipédia</p>
                    <p className="text-xs text-muted-foreground truncate">Encyclopédie libre</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              )}
              {tplUrl && (
                <a href={tplUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary">The Plant List</p>
                    <p className="text-xs text-muted-foreground truncate">Nomenclature de référence</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              )}
              {(plant as any).wikidata_qid && (
                <a
                  href={`https://www.wikidata.org/entity/${(plant as any).wikidata_qid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-purple-600">Wikidata</p>
                    <p className="text-xs text-muted-foreground truncate font-mono">{(plant as any).wikidata_qid}</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chiméotypes si disponibles */}
      {plant.chemotypes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-500" />
              Chémotypes connus
            </CardTitle>
            <CardDescription>Variations chimiques intraspécifiques</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{plant.chemotypes}</p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
