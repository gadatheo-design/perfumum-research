import { useState, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Leaf, 
  FlaskConical, 
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Route,
  Sparkles,
  ArrowRight,
  Globe,
  Compass,
  Info,
  Star,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen
} from "lucide-react";

// Mapping des thèmes vers des labels français
const themeLabels: Record<string, string> = {
  geographic: "Géographique",
  olfactive: "Olfactif",
  botanical: "Botanique",
  historical: "Historique",
  seasonal: "Saisonnier",
  therapeutic: "Thérapeutique",
  culinary: "Culinaire",
  sacred: "Sacré",
  luxury: "Luxe",
  sustainable: "Durable",
  custom: "Personnalisé",
};

// Mapping des difficultés
const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: "Débutant", color: "bg-green-500/20 text-green-700" },
  intermediate: { label: "Intermédiaire", color: "bg-yellow-500/20 text-yellow-700" },
  advanced: { label: "Avancé", color: "bg-orange-500/20 text-orange-700" },
  expert: { label: "Expert", color: "bg-red-500/20 text-red-700" },
};

export default function ParcoursDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const journeyCode = params.code as string;
  
  // État de progression
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  // Récupérer le parcours par code
  const { data: journey, isLoading: loadingJourney, error } = trpc.curatedJourneys.getByCode.useQuery(journeyCode);
  const { data: journeyItems, isLoading: loadingItems } = trpc.curatedJourneys.getItems.useQuery(
    journey?.id ?? 0,
    { enabled: !!journey?.id }
  );

  // Calculer la progression
  const progress = useMemo(() => {
    if (!journeyItems || journeyItems?.length === 0) return 0;
    return (completedSteps.size / journeyItems?.length) * 100;
  }, [journeyItems, completedSteps]);

  // Marquer une étape comme complétée
  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  if (loadingJourney) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-48" />
          <Skeleton className="h-[400px]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !journey) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setLocation('/parcours-olfactif')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux parcours
          </Button>
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Parcours introuvable</AlertTitle>
            <AlertDescription>
              Le parcours "{journeyCode}" n'existe pas ou n'est pas encore publié.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/parcours-olfactif')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* En-tête du parcours */}
        <Card className="overflow-hidden">
          <div 
            className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"
            style={journey?.color ? { background: `linear-gradient(to right, ${journey?.color}33, ${journey?.color}11, transparent)` } : undefined}
          />
          <CardHeader className="-mt-16 relative">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-xl bg-background shadow-lg border">
                {journey?.emoji ? (
                  <span className="text-4xl">{journey?.emoji}</span>
                ) : (
                  <Route className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="flex-1 pt-8">
                <div className="flex items-center gap-2 mb-2">
                  {journey?.isFeatured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                  <Badge variant="outline">
                    {themeLabels[journey?.theme] || journey?.theme}
                  </Badge>
                  {journey?.difficulty && (
                    <Badge className={difficultyLabels[journey?.difficulty]?.color || ''}>
                      {difficultyLabels[journey?.difficulty]?.label || journey?.difficulty}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{journey?.name}</CardTitle>
                {journey?.nameEn && (
                  <p className="text-sm text-muted-foreground italic">{journey?.nameEn}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {journey?.description && (
              <p className="text-muted-foreground">{journey?.description}</p>
            )}
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>{journey?.terroirCount} terroirs</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-500" />
                <span>{journey?.plantCount} plantes</span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-blue-500" />
                <span>{journey?.moleculeCount} molécules</span>
              </div>
              {journey?.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{journey?.estimatedDuration} min</span>
                </div>
              )}
            </div>

            {/* Barre de progression */}
            {journeyItems && journeyItems?.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{completedSteps.size}/{journeyItems?.length} étapes</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contenu du parcours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des étapes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Étapes du parcours
                </CardTitle>
                <CardDescription>
                  Suivez les étapes pour explorer ce parcours olfactif
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingItems ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : journeyItems && journeyItems?.length > 0 ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {journeyItems?.map((item: any, index: number) => {
                        const isCompleted = completedSteps.has(item.id);
                        const isCurrent = currentStep === index;
                        
                        return (
                          <Card 
                            key={item.id}
                            className={`cursor-pointer transition-all ${
                              isCompleted ? 'bg-green-500/5 border-green-500/30' : 
                              isCurrent ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => {
                              setCurrentStep(index);
                              toggleStep(item.id);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                {/* Indicateur de progression */}
                                <div className="flex flex-col items-center">
                                  <div className={`p-2 rounded-full ${
                                    isCompleted ? 'bg-green-500/20' : 
                                    item.itemType === 'terroir' ? 'bg-orange-500/10' :
                                    item.itemType === 'plant' ? 'bg-green-500/10' :
                                    'bg-blue-500/10'
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : item.itemType === 'terroir' ? (
                                      <MapPin className="h-5 w-5 text-orange-500" />
                                    ) : item.itemType === 'plant' ? (
                                      <Leaf className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <FlaskConical className="h-5 w-5 text-blue-500" />
                                    )}
                                  </div>
                                  {index < journeyItems?.length - 1 && (
                                    <div className={`w-0.5 h-8 mt-2 ${
                                      isCompleted ? 'bg-green-500/30' : 'bg-muted'
                                    }`} />
                                  )}
                                </div>

                                {/* Contenu */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {item.stepNumber && (
                                      <Badge variant="outline" className="text-xs">
                                        Étape {item.stepNumber}
                                      </Badge>
                                    )}
                                    {item.groupName && (
                                      <Badge variant="secondary" className="text-xs">
                                        {item.groupName}
                                      </Badge>
                                    )}
                                    {item.isHighlight && (
                                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    )}
                                  </div>
                                  
                                  <h4 className="font-medium">
                                    {item.terroir?.name || item.plant?.name || item.molecule?.name || 'Élément'}
                                  </h4>
                                  
                                  {item.contextDescription && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {item.contextDescription}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 mt-2">
                                    <Link href={
                                      item.itemType === 'terroir' ? `/terroirs/${item.terroirId}` :
                                      item.itemType === 'plant' ? `/plants/${item.plantId}` :
                                      `/molecules/${item.moleculeId}`
                                    }>
                                      <Button variant="link" size="sm" className="p-0 h-auto">
                                        Voir la fiche →
                                      </Button>
                                    </Link>
                                  </div>
                                </div>

                                {/* Flèche */}
                                <ArrowRight className={`h-4 w-4 ${
                                  isCompleted ? 'text-green-500' : 'text-muted-foreground'
                                }`} />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Parcours en construction</AlertTitle>
                    <AlertDescription>
                      Ce parcours n'a pas encore d'étapes définies. Revenez bientôt !
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  À propos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Thème</p>
                    <p className="font-medium">{themeLabels[journey?.theme] || journey?.theme}</p>
                  </div>
                  
                  {journey?.difficulty && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Difficulté</p>
                      <Badge className={difficultyLabels[journey?.difficulty]?.color || ''}>
                        {difficultyLabels[journey?.difficulty]?.label || journey?.difficulty}
                      </Badge>
                    </div>
                  )}

                  {journey?.estimatedDuration && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Durée estimée</p>
                      <p className="font-medium">{journey?.estimatedDuration} minutes</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Contenu</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <MapPin className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{journey?.terroirCount}</p>
                      <p className="text-xs text-muted-foreground">Terroirs</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Leaf className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{journey?.plantCount}</p>
                      <p className="text-xs text-muted-foreground">Plantes</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <FlaskConical className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{journey?.moleculeCount}</p>
                      <p className="text-xs text-muted-foreground">Molécules</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setCompletedSteps(new Set());
                      setCurrentStep(0);
                    }}
                  >
                    Recommencer le parcours
                  </Button>
                  <Link href="/parcours-olfactif">
                    <Button variant="outline" className="w-full">
                      Voir tous les parcours
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
