import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  Wind, 
  TreeDeciduous, 
  Sparkles, 
  MapPin,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Calendar,
  Beaker,
  FileText,
  AlertCircle,
  Edit,
  Droplets,
  Thermometer
} from "lucide-react";

const climaticAxisConfig: Record<string, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  vent: { 
    label: "Vent", 
    icon: <Wind className="h-4 w-4" />, 
    color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    description: "Diffusion rapide, ouverture sociale, air clair"
  },
  bois: { 
    label: "Bois", 
    icon: <TreeDeciduous className="h-4 w-4" />, 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    description: "Structure sèche, durée, architecture temporelle"
  },
  disparition: { 
    label: "Disparition", 
    icon: <Sparkles className="h-4 w-4" />, 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    description: "Trace finale, mémoire olfactive, sortie contrôlée"
  },
  sel: { 
    label: "Sel", 
    icon: <Sparkles className="h-4 w-4" />, 
    color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
    description: "Minéralité, abstraction, peau salée"
  },
};

const categoryConfig: Record<string, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  aromatique: { 
    label: "Aromatique", 
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", 
    icon: <Leaf className="h-4 w-4" />,
    description: "Plantes aromatiques locales de San Andrés"
  },
  tabac: { 
    label: "Tabac", 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", 
    icon: <Leaf className="h-4 w-4" />,
    description: "Tabac comme régulateur climatique et temporel"
  },
  cannabis: { 
    label: "Cannabis", 
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", 
    icon: <Leaf className="h-4 w-4" />,
    description: "Cannabis comme modulateur d'attention"
  },
};

const statusConfig: Record<string, { label: string; color: string; description: string }> = {
  brut: { label: "Brut", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", description: "Échantillon collecté, non traité" },
  a_analyser: { label: "À analyser", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", description: "En attente d'analyse GC-MS" },
  analyse: { label: "Analysé", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", description: "Analyse chimique complète" },
  traduction: { label: "Traduction", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", description: "Interprétation Absorbe en cours" },
  archive: { label: "Archivé", color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200", description: "Données finalisées et archivées" },
};

const extractionConfig: Record<string, { label: string; description: string }> = {
  aucune: { label: "Aucune", description: "Pas d'extraction réalisée" },
  maceration_alcool: { label: "Macération alcool", description: "Extraction par macération dans l'alcool" },
  maceration_mct: { label: "Macération MCT", description: "Extraction par macération dans huile MCT" },
  distillation: { label: "Distillation", description: "Extraction par distillation à la vapeur" },
  headspace: { label: "Headspace", description: "Analyse de l'espace de tête" },
};

const curingConfig: Record<string, { label: string; description: string }> = {
  aucun: { label: "Aucun", description: "Pas de traitement de séchage" },
  air_cured: { label: "Air-cured", description: "Séchage à l'air libre" },
  flue_cured: { label: "Flue-cured", description: "Séchage à chaleur contrôlée" },
  sun_cured: { label: "Sun-cured", description: "Séchage au soleil" },
  autre: { label: "Autre", description: "Autre méthode de séchage" },
};

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return value.split(";").map(s => s.trim()).filter(Boolean);
  }
}

export default function LeafEconomyDetail() {
  const [, params] = useRoute("/san-andres/echantillon/:id");
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: sample, isLoading, error } = trpc.leafEconomies.getById.useQuery(
    id!,
    { enabled: id !== null }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="bg-emerald-900 text-white py-12 px-4">
          <div className="container max-w-4xl">
            <Skeleton className="h-6 w-48 mb-4 bg-emerald-800" />
            <Skeleton className="h-10 w-64 mb-2 bg-emerald-800" />
            <Skeleton className="h-6 w-96 bg-emerald-800" />
          </div>
        </div>
        <div className="container max-w-4xl py-8 px-4">
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !sample) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="container max-w-4xl py-16 px-4">
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Échantillon non trouvé</h3>
              <p className="text-muted-foreground mb-6">
                L'échantillon demandé n'existe pas ou a été supprimé.
              </p>
              <Link href="/san-andres/leaf-economies">
                <Button variant="outline">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour à la liste
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const axes = parseJsonArray(sample.climaticAxis);
  const usages = parseJsonArray(sample.usage);
  const category = categoryConfig[sample.category] || categoryConfig.aromatique;
  const status = statusConfig[sample.status || "brut"];
  const extraction = extractionConfig[sample.extraction || "aucune"];
  const curing = curingConfig[sample.curingTreatment || "aucun"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/san-andres/leaf-economies" className="hover:text-white transition-colors">Leaf Economies</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{sample.sampleId}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-3 font-mono text-sm border-emerald-400 text-emerald-200">
                {sample.sampleId}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {sample.species || "Espèce inconnue"}
              </h1>
              {sample.claimedVariety && (
                <p className="text-emerald-200 text-lg italic">
                  {sample.claimedVariety}
                </p>
              )}
            </div>
            <Badge className={`${category.color} text-sm`}>
              {category.icon}
              <span className="ml-1">{category.label}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl py-8 px-4">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Localisation</p>
                <p className="font-medium">
                  {sample.island === "san_andres" ? "San Andrés" : 
                   sample.island === "providencia" ? "Providencia" : "Autre"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <FlaskConical className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Extraction</p>
                <p className="font-medium">{extraction.label}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                <Beaker className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Analyse</p>
                <p className="font-medium">
                  {sample.analysisAvailable ? "Disponible" : "Non disponible"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-full ${status.color}`}>
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Statut</p>
                <p className="font-medium">{status.label}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="absorbe">Absorbe</TabsTrigger>
            <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Climatic Axes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  Axes climatiques
                </CardTitle>
                <CardDescription>
                  Classification selon la méthodologie Absorbe
                </CardDescription>
              </CardHeader>
              <CardContent>
                {axes.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {axes.map((axis) => {
                      const config = climaticAxisConfig[axis];
                      if (!config) return null;
                      return (
                        <div key={axis} className={`p-4 rounded-lg ${config.color}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {config.icon}
                            <span className="font-medium">{config.label}</span>
                          </div>
                          <p className="text-sm opacity-80">{config.description}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Aucun axe climatique défini</p>
                )}
              </CardContent>
            </Card>

            {/* Botanical Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Informations botaniques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Espèce</p>
                    <p className="font-medium">{sample.species || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Variété revendiquée</p>
                    <p className="font-medium italic">{sample.claimedVariety || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Partie utilisée</p>
                    <p className="font-medium capitalize">{sample.usedPart || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">État</p>
                    <p className="font-medium capitalize">{sample.state || "Non spécifié"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Traitement et extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Méthode de séchage</p>
                    <p className="font-medium">{curing.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{curing.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Méthode d'extraction</p>
                    <p className="font-medium">{extraction.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{extraction.description}</p>
                  </div>
                  {sample.ratioParameters && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ratio/Paramètres</p>
                      <p className="font-medium font-mono">{sample.ratioParameters}</p>
                    </div>
                  )}
                  {sample.duration && (
                    <div>
                      <p className="text-sm text-muted-foreground">Durée</p>
                      <p className="font-medium">{sample.duration}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Analyse chimique
                </CardTitle>
                <CardDescription>
                  {sample.analysisAvailable 
                    ? `Méthode: ${sample.analysisMethod?.toUpperCase() || "Non spécifiée"}`
                    : "Analyse non encore réalisée"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sample.analysisAvailable ? (
                  <div className="space-y-6">
                    {/* Top Molecules */}
                    <div>
                      <h4 className="font-medium mb-3">Molécules principales</h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        {[sample.topMolecule1, sample.topMolecule2, sample.topMolecule3]
                          .filter(Boolean)
                          .map((mol, idx) => (
                            <div 
                              key={idx} 
                              className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                  #{idx + 1}
                                </span>
                              </div>
                              <p className="font-medium">{mol}</p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Full molecule list */}
                    {sample.topMoleculesList && (
                      <div>
                        <h4 className="font-medium mb-3">Liste complète des molécules</h4>
                        <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
                          {sample.topMoleculesList}
                        </div>
                      </div>
                    )}

                    {/* Percentages */}
                    {sample.relativePercentages && (
                      <div>
                        <h4 className="font-medium mb-3">Pourcentages relatifs</h4>
                        <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
                          {sample.relativePercentages}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucune analyse chimique disponible pour cet échantillon.
                    </p>
                    <Badge className="mt-4" variant="outline">
                      Statut: {status.label}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Odor Notes */}
            {sample.odorNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Notes olfactives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {sample.odorNotes}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Absorbe Tab */}
          <TabsContent value="absorbe" className="space-y-6">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Interprétation Absorbe
                </CardTitle>
                <CardDescription>
                  Lecture critique selon la méthodologie du laboratoire
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sample.absorbeInterpretation ? (
                  <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 italic text-lg">
                    {sample.absorbeInterpretation}
                  </blockquote>
                ) : (
                  <p className="text-muted-foreground italic">
                    Aucune interprétation Absorbe disponible pour cet échantillon.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Usage */}
            {usages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Usages recommandés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {usages.map((usage) => (
                      <Badge key={usage} variant="secondary" className="capitalize">
                        {usage}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ethical Notes */}
            {sample.ethicalNotes && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5" />
                    Notes éthiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {sample.ethicalNotes}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Métadonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">ID Échantillon</p>
                    <p className="font-mono font-medium">{sample.sampleId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de collecte</p>
                    <p className="font-medium">
                      {sample.date 
                        ? new Date(sample.date).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : "Non spécifiée"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Localisation précise</p>
                    <p className="font-medium">{sample.preciseLocation || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact source</p>
                    <p className="font-medium">{sample.sourceContact || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créé le</p>
                    <p className="font-medium">
                      {new Date(sample.createdAt).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                    <p className="font-medium">
                      {new Date(sample.updatedAt).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {sample.mediaLinks && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Liens médias</p>
                    <p className="font-mono text-sm">{sample.mediaLinks}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Link href="/san-andres/leaf-economies">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </Link>
          <Link href={`/san-andres/echantillon/${sample.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
