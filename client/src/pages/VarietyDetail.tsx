import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  MapPin,
  Leaf,
  Calendar,
  User,
  AlertTriangle,
  ExternalLink,
  FlaskConical,
  Dna,
  TreeDeciduous,
  Droplets,
  Shield,
  Info,
  Sparkles,
  Clock,
  Package
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Configuration des couleurs par statut de conservation
const conservationColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30" },
  endangered: { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/30" },
  vulnerable: { bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-500/30" },
  near_threatened: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30" },
  stable: { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30" },
  data_deficient: { bg: "bg-gray-500/10", text: "text-gray-600", border: "border-gray-500/30" },
  unknown: { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/30" },
};

const conservationLabels: Record<string, string> = {
  critical: "Critique",
  endangered: "En danger",
  vulnerable: "Vulnérable",
  near_threatened: "Quasi menacé",
  stable: "Stable",
  data_deficient: "Données insuffisantes",
  unknown: "Inconnu",
};

const varietyTypeLabels: Record<string, string> = {
  cultivar: "Cultivar",
  chemotype: "Chémotype",
  landrace: "Landrace",
  hybrid: "Hybride",
  clone: "Clone",
  wild: "Sauvage",
  other: "Autre",
};

const availabilityLabels: Record<string, string> = {
  widely_available: "Largement disponible",
  limited: "Disponibilité limitée",
  rare: "Rare",
  research_only: "Recherche uniquement",
  extinct: "Éteint",
  unknown: "Inconnu",
};

export default function VarietyDetail() {
  const params = useParams<{ id: string }>();
  const varietyId = parseInt(params.id || "0", 10);

  // Fetch variety with molecules
  const { data: varietyData, isLoading } = trpc.plantVarieties.getWithMolecules.useQuery(
    { varietyId },
    { enabled: varietyId > 0 }
  );

  // Process molecular profile for radar chart
  const radarData = useMemo(() => {
    if (!varietyData?.variety?.molecularProfile) {
      // Default data if no molecular profile
      return {
        labels: ["Intensité", "Fraîcheur", "Chaleur", "Douceur", "Épicé", "Terreux"],
        datasets: [{
          label: "Profil terpénique",
          data: [50, 50, 50, 50, 50, 50],
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(99, 102, 241, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(99, 102, 241, 1)",
        }],
      };
    }

    const profile = varietyData.variety.molecularProfile as Array<{
      molecule: string;
      minPercent: number;
      maxPercent: number;
      typical: number;
    }>;

    // Extract top molecules for radar
    const topMolecules = profile.slice(0, 6);
    
    return {
      labels: topMolecules.map(m => m.molecule),
      datasets: [{
        label: "Concentration typique (%)",
        data: topMolecules.map(m => m.typical),
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 197, 94, 1)",
      }, {
        label: "Maximum (%)",
        data: topMolecules.map(m => m.maxPercent),
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(99, 102, 241, 0.5)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
      }],
    };
  }, [varietyData]);

  // Radar chart options
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 10,
          },
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 500,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        angleLines: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 11,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!varietyData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Link href="/plantes?tab=varietes">
            <Button variant="ghost" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Retour aux variétés
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Variété non trouvée</h2>
              <p className="text-muted-foreground mb-4">
                Cette variété n'existe pas ou a été supprimée.
              </p>
              <Link href="/plantes?tab=varietes">
                <Button>Voir toutes les variétés</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { variety, plant, molecules } = varietyData;
  const conservationStyle = conservationColors[variety.conservationStatus || "unknown"];
  const olfactiveNotes = variety.olfactiveNotes as { top?: string[]; heart?: string[]; base?: string[] } | null;
  const morphology = variety.morphology as { height?: string; leafShape?: string; flowerColor?: string; growthHabit?: string } | null;
  const dominantMolecules = variety.dominantMolecules as Array<{ molecule: string; percentage: number; role: string }> | null;
  const threatFactors = variety.threatFactors as string[] | null;
  const suppliers = variety.suppliers as string[] | null;
  const parentVarieties = variety.parentVarieties as string[] | null;
  const references = variety.references as Array<{ title: string; author?: string; year?: number; url?: string }> | null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          currentLabel={variety.name}
          customItems={[
            { label: "Variétés", path: "/varietes" },
            { label: variety.name }
          ]}
        />
        
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/plantes?tab=varietes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux variétés
            </Button>
          </Link>
          <Link href="/carte-varietes">
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Voir sur la carte
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-xs">
                  {variety.varietyId}
                </Badge>
                <Badge className={`${conservationStyle.bg} ${conservationStyle.text} ${conservationStyle.border}`}>
                  {conservationLabels[variety.conservationStatus || "unknown"]}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{variety.name}</h1>
              {variety.latinName && (
                <p className="text-lg text-muted-foreground italic">{variety.latinName}</p>
              )}
            </div>
            {variety.imageUrl && (
              <img 
                src={variety.imageUrl} 
                alt={variety.name}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="gap-1">
              <Leaf className="w-3 h-3" />
              {varietyTypeLabels[variety.varietyType] || variety.varietyType}
            </Badge>
            {plant && (
              <Link href={`/plantes/${plant.id}`}>
                <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted">
                  <TreeDeciduous className="w-3 h-3" />
                  {plant.name}
                </Badge>
              </Link>
            )}
            {variety.countryOfOrigin && (
              <Badge variant="outline" className="gap-1">
                <MapPin className="w-3 h-3" />
                {variety.countryOfOrigin}
              </Badge>
            )}
            {variety.yearRegistered && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {variety.yearRegistered}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Radar Chart - Terpenic Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Profil Terpénique
                </CardTitle>
                <CardDescription>
                  Distribution des molécules dominantes dans cette variété
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square max-w-md mx-auto">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Tabs for detailed info */}
            <Tabs defaultValue="molecules" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="molecules">Molécules</TabsTrigger>
                <TabsTrigger value="olfactive">Olfactif</TabsTrigger>
                <TabsTrigger value="agronomy">Agronomie</TabsTrigger>
                <TabsTrigger value="conservation">Conservation</TabsTrigger>
              </TabsList>

              {/* Molecules Tab */}
              <TabsContent value="molecules" className="space-y-4">
                {/* Dominant Molecules */}
                {dominantMolecules && dominantMolecules.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Molécules Dominantes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dominantMolecules.map((mol, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{mol.molecule}</div>
                              <div className="text-sm text-muted-foreground">{mol.role}</div>
                            </div>
                            <Badge variant="secondary">{mol.percentage}%</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Linked Molecules from Plant */}
                {molecules && molecules.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Dna className="w-4 h-4 text-indigo-500" />
                        Molécules Associées (via {plant?.name})
                      </CardTitle>
                      <CardDescription>
                        Molécules présentes dans la plante parente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {molecules.map((mol: any, idx: number) => (
                          <Link key={idx} href={`/molecule/${mol.molecule.id}`}>
                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                              <div>
                                <div className="font-medium">{mol.molecule.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {mol.molecule.family || mol.molecule.chemicalClass || "—"}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {mol.isSignature && (
                                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600">
                                    Signature
                                  </Badge>
                                )}
                                {mol.percentageTypical && (
                                  <Badge variant="secondary" className="text-xs">
                                    {mol.percentageTypical}%
                                  </Badge>
                                )}
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(!dominantMolecules || dominantMolecules.length === 0) && (!molecules || molecules.length === 0) && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Aucune donnée moléculaire disponible pour cette variété.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Olfactive Tab */}
              <TabsContent value="olfactive" className="space-y-4">
                {variety.olfactiveDescription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description Olfactive</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {variety.olfactiveDescription}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {olfactiveNotes && (olfactiveNotes.top || olfactiveNotes.heart || olfactiveNotes.base) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pyramide Olfactive</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {olfactiveNotes.top && olfactiveNotes.top.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Notes de tête</div>
                          <div className="flex flex-wrap gap-2">
                            {olfactiveNotes.top.map((note, idx) => (
                              <Badge key={idx} variant="outline" className="bg-sky-500/10 text-sky-600 border-sky-500/30">
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {olfactiveNotes.heart && olfactiveNotes.heart.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Notes de cœur</div>
                          <div className="flex flex-wrap gap-2">
                            {olfactiveNotes.heart.map((note, idx) => (
                              <Badge key={idx} variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30">
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {olfactiveNotes.base && olfactiveNotes.base.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Notes de fond</div>
                          <div className="flex flex-wrap gap-2">
                            {olfactiveNotes.base.map((note, idx) => (
                              <Badge key={idx} variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {!variety.olfactiveDescription && !olfactiveNotes && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Droplets className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Aucune description olfactive disponible pour cette variété.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Agronomy Tab */}
              <TabsContent value="agronomy" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variety.yieldPerHectare && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <Package className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Rendement</div>
                            <div className="font-medium">{variety.yieldPerHectare}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {variety.essentialOilYield && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Droplets className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Rendement HE</div>
                            <div className="font-medium">{variety.essentialOilYield}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {variety.harvestPeriod && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/10">
                            <Calendar className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Période de récolte</div>
                            <div className="font-medium">{variety.harvestPeriod}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {variety.optimalHarvestStage && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-sky-500/10">
                            <Clock className="w-5 h-5 text-sky-500" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Stade optimal</div>
                            <div className="font-medium">{variety.optimalHarvestStage}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {morphology && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Morphologie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {morphology.height && (
                          <div>
                            <div className="text-sm text-muted-foreground">Hauteur</div>
                            <div className="font-medium">{morphology.height}</div>
                          </div>
                        )}
                        {morphology.leafShape && (
                          <div>
                            <div className="text-sm text-muted-foreground">Forme des feuilles</div>
                            <div className="font-medium">{morphology.leafShape}</div>
                          </div>
                        )}
                        {morphology.flowerColor && (
                          <div>
                            <div className="text-sm text-muted-foreground">Couleur des fleurs</div>
                            <div className="font-medium">{morphology.flowerColor}</div>
                          </div>
                        )}
                        {morphology.growthHabit && (
                          <div>
                            <div className="text-sm text-muted-foreground">Port de croissance</div>
                            <div className="font-medium">{morphology.growthHabit}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Conservation Tab */}
              <TabsContent value="conservation" className="space-y-4">
                <Card className={`${conservationStyle.bg} ${conservationStyle.border} border`}>
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${conservationStyle.text}`}>
                      <Shield className="w-5 h-5" />
                      Statut de Conservation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {conservationLabels[variety.conservationStatus || "unknown"]}
                    </div>
                    {variety.conservationNotes && (
                      <p className="text-muted-foreground">{variety.conservationNotes}</p>
                    )}
                  </CardContent>
                </Card>

                {threatFactors && threatFactors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Facteurs de Menace
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {threatFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {variety.conservationEfforts && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Efforts de Conservation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {variety.conservationEfforts}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {variety.breeder && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Obtenteur</div>
                      <div className="text-sm font-medium">{variety.breeder}</div>
                    </div>
                  </div>
                )}
                {variety.countryOfOrigin && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Origine</div>
                      <div className="text-sm font-medium">{variety.countryOfOrigin}</div>
                    </div>
                  </div>
                )}
                {variety.commercialAvailability && (
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Disponibilité</div>
                      <div className="text-sm font-medium">
                        {availabilityLabels[variety.commercialAvailability] || variety.commercialAvailability}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distinctive Features */}
            {variety.distinctiveFeatures && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Caractéristiques Distinctives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {variety.distinctiveFeatures}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Parent Varieties */}
            {parentVarieties && parentVarieties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Variétés Parentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parentVarieties.map((parent, idx) => (
                      <Badge key={idx} variant="outline">
                        {parent}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suppliers */}
            {suppliers && suppliers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Fournisseurs Connus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suppliers.map((supplier, idx) => (
                      <div key={idx} className="text-sm p-2 rounded bg-muted/50">
                        {supplier}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* References */}
            {references && references.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Références</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {references.map((ref, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-medium">{ref.title}</div>
                        {ref.author && (
                          <div className="text-muted-foreground text-xs">
                            {ref.author}{ref.year && ` (${ref.year})`}
                          </div>
                        )}
                        {ref.url && (
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-xs hover:underline flex items-center gap-1"
                          >
                            Voir la source <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {variety.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Notes de Recherche</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {variety.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
