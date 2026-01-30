import { trpc } from "@/lib/trpc";
import { Loader2, FlaskConical, Activity, Target, Gauge, Calendar, Building2, Info, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";

interface MoleculeAnalyticalMethodsProps {
  moleculeId: number;
}

// Couleurs par catégorie de méthode
const categoryColors: Record<string, string> = {
  chromatographie: "bg-blue-500",
  spectrométrie: "bg-purple-500",
  spectroscopie: "bg-green-500",
  extraction: "bg-orange-500",
  thermique: "bg-red-500",
};

// Icônes par catégorie
const categoryIcons: Record<string, React.ReactNode> = {
  chromatographie: <Activity className="h-4 w-4" />,
  spectrométrie: <Target className="h-4 w-4" />,
  spectroscopie: <Gauge className="h-4 w-4" />,
  extraction: <FlaskConical className="h-4 w-4" />,
  thermique: <Activity className="h-4 w-4" />,
};

export function MoleculeAnalyticalMethods({ moleculeId }: MoleculeAnalyticalMethodsProps) {
  const { data: methods, isLoading, error } = trpc.analyticalMethods.getByMoleculeId.useQuery(
    { moleculeId },
    { enabled: !!moleculeId }
  );

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!methods || methods.length === 0) {
    return null;
  }

  // Séparer les méthodes primaires des autres
  const primaryMethods = methods.filter(m => m.isPrimary);
  const secondaryMethods = methods.filter(m => !m.isPrimary);

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Méthodes Analytiques
        </h2>
        <Badge variant="secondary">
          {methods.length} technique{methods.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Techniques d'analyse utilisées pour caractériser cette molécule et ses propriétés.
      </p>

      {/* Méthodes primaires */}
      {primaryMethods.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Méthode(s) principale(s)
          </h3>
          <div className="grid gap-4">
            {primaryMethods.map((method) => (
              <MethodCard key={method.id} method={method} isPrimary />
            ))}
          </div>
        </div>
      )}

      {/* Méthodes secondaires */}
      {secondaryMethods.length > 0 && (
        <div>
          {primaryMethods.length > 0 && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Autres techniques utilisées
            </h3>
          )}
          <div className="grid gap-3">
            {secondaryMethods.map((method) => (
              <MethodCard key={method.id} method={method} />
            ))}
          </div>
        </div>
      )}

      {/* Lien vers la page des méthodes analytiques */}
      <div className="mt-6 pt-4 border-t">
        <Link href="/methodes-analytiques" className="text-sm text-primary hover:underline flex items-center gap-1">
          Voir toutes les méthodes analytiques →
        </Link>
      </div>
    </div>
  );
}

interface MethodCardProps {
  method: {
    id: number;

    code: string | null;
    name: string | null;
    fullName: string | null;
    category: string | null;
    description: string | null;
    performanceScore: number | null;
    resolutionScore: number | null;
    sensitivityScore: number | null;
    detectionLimit: string | null;
    isPrimary: boolean | null;
    analysisDetectionLimit: string | null;
    detectionUnit: string | null;
    accuracy: string | null;
    analysisDate: Date | null;
    laboratoryName: string | null;
    liaisonNotes: string | null;
  };
  isPrimary?: boolean;
}

function MethodCard({ method, isPrimary }: MethodCardProps) {
  const categoryColor = method.category ? categoryColors[method.category.toLowerCase()] || "bg-gray-500" : "bg-gray-500";
  const categoryIcon = method.category ? categoryIcons[method.category.toLowerCase()] : <FlaskConical className="h-4 w-4" />;

  return (
    <div className={`p-4 rounded-lg border ${isPrimary ? 'bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' : 'bg-muted/30'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${categoryColor} text-white`}>
              {categoryIcon}
              <span className="ml-1">{method.code || method.methodId}</span>
            </Badge>
            {isPrimary && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                <Star className="h-3 w-3 mr-1" />
                Principale
              </Badge>
            )}
          </div>

          <h4 className="font-semibold mb-1">{method.name}</h4>
          {method.fullName && method.fullName !== method.name && (
            <p className="text-sm text-muted-foreground mb-2">{method.fullName}</p>
          )}

          {/* Scores de performance */}
          {(method.performanceScore || method.resolutionScore || method.sensitivityScore) && (
            <div className="flex flex-wrap gap-3 mt-3">
              {method.performanceScore && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm">
                        <Gauge className="h-3 w-3 text-primary" />
                        <span className="font-medium">{method.performanceScore}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Score de performance global</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {method.resolutionScore && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm">
                        <Target className="h-3 w-3 text-blue-500" />
                        <span>{method.resolutionScore}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Résolution</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {method.sensitivityScore && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm">
                        <Activity className="h-3 w-3 text-green-500" />
                        <span>{method.sensitivityScore}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sensibilité</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Détails de l'analyse spécifique à cette molécule */}
          {(method.analysisDetectionLimit || method.accuracy || method.laboratoryName || method.analysisDate) && (
            <div className="mt-3 pt-3 border-t border-dashed">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Détails de l'analyse pour cette molécule
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {method.analysisDetectionLimit && method.detectionUnit && (
                  <div>
                    <span className="text-muted-foreground">Limite de détection:</span>{' '}
                    <span className="font-mono">{method.analysisDetectionLimit} {method.detectionUnit}</span>
                  </div>
                )}
                {method.accuracy && (
                  <div>
                    <span className="text-muted-foreground">Précision:</span>{' '}
                    <span className="font-mono">{method.accuracy}%</span>
                  </div>
                )}
                {method.laboratoryName && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span>{method.laboratoryName}</span>
                  </div>
                )}
                {method.analysisDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{new Date(method.analysisDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {method.liaisonNotes && (
            <p className="text-sm text-muted-foreground mt-2 italic">{method.liaisonNotes}</p>
          )}
        </div>
      </div>
    </div>
  );
}
