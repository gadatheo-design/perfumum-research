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
  Loader2
} from "lucide-react";
import { RegulatoryProfile, RegulatoryBadge } from "@/components/RegulatoryProfile";

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
          <Link href="/plants">
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
  const botanicalStates = plant.botanicalStates as Array<{
    state: string;
    name: string;
    odor: string;
    molecules: string[];
    usage: string;
  }> | null;
  
  const dominantMolecules = plant.dominantMolecules 
    ? (typeof plant.dominantMolecules === 'string' 
        ? JSON.parse(plant.dominantMolecules) 
        : plant.dominantMolecules)
    : [];
  
  return (
    <div className="container py-8 max-w-6xl">
      {/* Header avec navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/plants">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>
      
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
              <p className="text-sm text-muted-foreground mt-1">
                Famille : {plant.family}
              </p>
            )}
          </div>
          {plant.imageUrl && (
            <img 
              src={plant.imageUrl} 
              alt={plant.name}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>
      </div>
      
      {/* Onglets principaux */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="varieties">Variétés ({varieties?.length || 0})</TabsTrigger>
          <TabsTrigger value="states">États botaniques</TabsTrigger>
          <TabsTrigger value="samples">Échantillons ({samples?.length || 0})</TabsTrigger>
          <TabsTrigger value="analyses">Analyses ({analyses?.length || 0})</TabsTrigger>
          <TabsTrigger value="regulatory">Réglementation</TabsTrigger>
          <TabsTrigger value="usage">Usage Absorbe</TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
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
                    <div className="flex flex-wrap gap-2">
                      {dominantMolecules.map((mol: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {mol}
                        </Badge>
                      ))}
                    </div>
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
        </TabsContent>
        
        {/* Variétés */}
        <TabsContent value="varieties" className="space-y-6">
          {varieties && varieties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {varieties.map((variety: any) => (
                <Card key={variety.id}>
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
                  </CardContent>
                </Card>
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
        </TabsContent>
        
        {/* États botaniques */}
        <TabsContent value="states" className="space-y-6">
          {botanicalStates && botanicalStates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botanicalStates.map((state, idx) => (
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
                          {state.molecules.map((mol, molIdx) => (
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
        </TabsContent>
        
        {/* Échantillons */}
        <TabsContent value="samples" className="space-y-6">
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
        </TabsContent>
        
        {/* Analyses */}
        <TabsContent value="analyses" className="space-y-6">
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
                <Button variant="outline">
                  Ajouter une analyse
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Usage Absorbe */}
        <TabsContent value="usage" className="space-y-6">
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
        </TabsContent>
        
        {/* Onglet Réglementation */}
        <TabsContent value="regulatory" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
