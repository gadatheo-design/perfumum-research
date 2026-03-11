import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Search, 
  FlaskConical, 
  Microscope,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronRight,
  BarChart3
} from "lucide-react";

interface AnalyticalMethod {
  id: number;
  code: string;
  name: string;
  fullName: string | null;
  category: string | null;
  performanceScore: number | null;
  resolutionScore: number | null;
  sensitivityScore: number | null;
  detectionLimit: string | null;
  detectionLimitUnit: string | null;
  capabilities: string[] | null;
  limitations: string[] | null;
  bestSuitedFor: string[] | null;
  description: string | null;
  technicalDetails: string | null;
  publicationCount: number | null;
}

const categoryLabels: Record<string, string> = {
  chromatography: "Chromatographie",
  spectrometry: "Spectrométrie",
  thermal_analysis: "Analyse thermique",
  particle_analysis: "Analyse de particules",
  spectroscopy: "Spectroscopie",
  other: "Autre"
};

const categoryIcons: Record<string, React.ReactNode> = {
  chromatography: <BarChart3 className="h-5 w-5" />,
  spectrometry: <Zap className="h-5 w-5" />,
  thermal_analysis: <FlaskConical className="h-5 w-5" />,
  particle_analysis: <Target className="h-5 w-5" />,
  spectroscopy: <Microscope className="h-5 w-5" />,
  other: <Info className="h-5 w-5" />
};

export default function AnalyticalMethodsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedMethod, setExpandedMethod] = useState<number | null>(null);

  const { data: methods, isLoading } = trpc.analyticalMethods.list.useQuery();

  // Filtrer les méthodes
  const filteredMethods = useMemo(() => {
    if (!methods) return [];
    
    return methods.filter((method: AnalyticalMethod) => {
      const matchesSearch = searchTerm === "" || 
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (method.fullName && method.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (method.description && method.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || method.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [methods, searchTerm, selectedCategory]);

  // Statistiques par catégorie
  const categoryStats = useMemo(() => {
    if (!methods) return {};
    const stats: Record<string, number> = {};
    methods.forEach((m: AnalyticalMethod) => {
      const cat = m.category || "other";
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }, [methods]);

  if (isLoading) {
    return (
      <div className="container py-8">
      <Breadcrumbs />
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Microscope className="h-8 w-8 text-primary" />
          Méthodes Analytiques
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Référentiel des techniques d'analyse utilisées en parfumerie et aromathérapie 
          pour identifier, quantifier et caractériser les composés olfactifs. 
          Ces méthodes permettent de garantir la qualité et l'authenticité des matières premières.
        </p>
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Card 
            key={key} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === key ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedCategory(selectedCategory === key ? "all" : key)}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-full mb-2 ${
                  selectedCategory === key ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {categoryIcons[key]}
                </div>
                <p className="text-2xl font-bold">{categoryStats[key] || 0}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recherche */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une méthode (GC-MS, PTR-MS, HPLC...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des méthodes */}
      <div className="space-y-4">
        {filteredMethods.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {methods && methods.length === 0 
                  ? "Aucune méthode analytique n'a encore été ajoutée à la base de données."
                  : "Aucune méthode ne correspond à vos critères de recherche."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMethods.map((method: AnalyticalMethod) => (
            <Card key={method.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedMethod(expandedMethod === method.id ? null : method.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="font-mono">
                        {method.code}
                      </Badge>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      {method.category && (
                        <Badge variant="secondary">
                          {categoryLabels[method.category] || method.category}
                        </Badge>
                      )}
                    </div>
                    {method.fullName && (
                      <CardDescription className="mt-1">
                        {method.fullName}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {method.performanceScore && (
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <p className="text-lg font-bold">{method.performanceScore}/10</p>
                      </div>
                    )}
                    <ChevronRight 
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        expandedMethod === method.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              </CardHeader>
              
              {expandedMethod === method.id && (
                <CardContent className="border-t pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Scores de performance */}
                    {(method.performanceScore || method.resolutionScore || method.sensitivityScore) && (
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Scores de performance
                        </h4>
                        {method.performanceScore && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Performance globale</span>
                              <span>{method.performanceScore}/10</span>
                            </div>
                            <Progress value={method.performanceScore * 10} />
                          </div>
                        )}
                        {method.resolutionScore && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Résolution</span>
                              <span>{method.resolutionScore}/10</span>
                            </div>
                            <Progress value={method.resolutionScore * 10} className="bg-blue-100" />
                          </div>
                        )}
                        {method.sensitivityScore && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Sensibilité</span>
                              <span>{method.sensitivityScore}/10</span>
                            </div>
                            <Progress value={method.sensitivityScore * 10} className="bg-green-100" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Limite de détection */}
                    {method.detectionLimit && (
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Target className="h-4 w-4 text-amber-500" />
                          Limite de détection
                        </h4>
                        <p className="text-muted-foreground">
                          {method.detectionLimit} {method.detectionLimitUnit}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {method.description && (
                      <div className="space-y-2 lg:col-span-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          Description
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {method.description}
                        </p>
                      </div>
                    )}

                    {/* Capacités */}
                    {method.capabilities && method.capabilities.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Capacités
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {method.capabilities.map((cap: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limitations */}
                    {method.limitations && method.limitations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Limitations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {method.limitations.map((lim: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {lim}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Applications */}
                    {method.bestSuitedFor && method.bestSuitedFor.length > 0 && (
                      <div className="space-y-2 lg:col-span-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-purple-500" />
                          Applications recommandées
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {method.bestSuitedFor.map((app: string, idx: number) => (
                            <Badge key={idx} variant="secondary">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Détails techniques */}
                    {method.technicalDetails && (
                      <div className="space-y-2 lg:col-span-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Microscope className="h-4 w-4 text-slate-500" />
                          Détails techniques
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {method.technicalDetails}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Publications */}
                  {method.publicationCount && method.publicationCount > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">{method.publicationCount}</span> publication{method.publicationCount > 1 ? 's' : ''} utilisant cette méthode
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Note pédagogique */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Importance des méthodes analytiques
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Les méthodes analytiques sont essentielles pour garantir la qualité, la pureté et l'authenticité 
            des matières premières en parfumerie. La <strong>chromatographie en phase gazeuse couplée à la 
            spectrométrie de masse (GC-MS)</strong> reste la technique de référence pour l'identification 
            des composés volatils. Des techniques plus récentes comme le <strong>PTR-MS</strong> permettent 
            une analyse en temps réel des profils olfactifs, tandis que la <strong>spectroscopie infrarouge</strong> 
            offre une méthode rapide de contrôle qualité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
