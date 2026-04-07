import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Calendar, 
  Camera, 
  Download, 
  Loader2, 
  RefreshCw, 
  Target,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  History,
  Sparkles
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

function ProgressIndicator({ start, end, change, changePercent, label }: {
  start: number;
  end: number;
  change: number;
  changePercent: number;
  label: string;
}) {
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
  
  // Vérifications de type pour éviter les erreurs toFixed
  const safeChange = typeof change === 'number' ? change.toFixed(1) : '0.0';
  const safeStart = typeof start === 'number' ? start.toFixed(1) : '0.0';
  const safeEnd = typeof end === 'number' ? end.toFixed(1) : '0.0';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{change >= 0 ? '+' : ''}{safeChange}%</span>
        </div>
      </div>
      <Progress value={end} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Début: {safeStart}%</span>
        <span className="font-medium">Actuel: {safeEnd}%</span>
      </div>
    </div>
  );
}

export default function AdminProgressReport() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: report, isLoading: reportLoading, refetch: refetchReport } = trpc.progressReports.getReport.useQuery();
  const { data: latestSnapshot, isLoading: snapshotLoading } = trpc.progressReports.getLatest.useQuery();
  const { data: snapshotsData, isLoading: snapshotsLoading } = trpc.progressReports.listSnapshots.useQuery({ limit: 50 });

  const createSnapshotMutation = trpc.progressReports.createSnapshot.useMutation({
    onSuccess: () => {
      toast({
        title: "Snapshot créé",
        description: "Un nouveau snapshot de l'état de classification a été enregistré",
      });
      utils.progressReports.getLatest.invalidate();
      utils.progressReports.listSnapshots.invalidate();
      utils.progressReports.getReport.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const snapshots = snapshotsData?.snapshots || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Rapport de Progression
            </h1>
            <p className="text-muted-foreground mt-1">
              Suivez l'évolution de la classification sur les 10 ans du projet PERFUMUM
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => refetchReport()}
              disabled={reportLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${reportLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button 
              onClick={() => createSnapshotMutation.mutate({})}
              disabled={createSnapshotMutation.isPending}
            >
              {createSnapshotMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 mr-2" />
              )}
              Créer un Snapshot
            </Button>
          </div>
        </div>

        {/* Current State Summary */}
        {latestSnapshot && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classification Globale</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof latestSnapshot?.overallClassificationRate === 'number' ? (latestSnapshot.overallClassificationRate / 100).toFixed(1) : '0.0'}%
                </div>
                <Progress value={latestSnapshot.overallClassificationRate / 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Objectif: 100%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Liaisons Globales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof latestSnapshot?.overallLinkingRate === 'number' ? (latestSnapshot.overallLinkingRate / 100).toFixed(1) : '0.0'}%
                </div>
                <Progress value={latestSnapshot.overallLinkingRate / 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Objectif: 100%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Molécules</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestSnapshot.totalMolecules}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {latestSnapshot.moleculesWithFamily} avec famille ({Math.round((latestSnapshot.moleculesWithFamily / latestSnapshot.totalMolecules) * 100)}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dernier Snapshot</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDistanceToNow(new Date(latestSnapshot.snapshotDate), { locale: fr })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(latestSnapshot.snapshotDate), 'dd MMM yyyy HH:mm', { locale: fr })}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="projection">Projection 10 ans</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabErrorBoundary>
          <TabsContent value="progress" className="space-y-4">
            {reportLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !report ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Aucun historique disponible</h3>
                  <p className="text-muted-foreground mt-2">
                    Créez des snapshots réguliers pour suivre la progression
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => createSnapshotMutation.mutate({})}
                    disabled={createSnapshotMutation.isPending}
                  >
                    Créer le premier snapshot
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Classification Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Classification des Molécules</CardTitle>
                    <CardDescription>
                      Progression depuis le {format(new Date(report.period.start), 'dd MMM yyyy', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ProgressIndicator {...report.classification.overall} label="Classification Globale" />
                    <ProgressIndicator {...report.classification.family} label="Famille Olfactive" />
                    <ProgressIndicator {...report.classification.chemicalClass} label="Classe Chimique" />
                    <ProgressIndicator {...report.classification.casNumber} label="Numéro CAS" />
                    <ProgressIndicator {...report.classification.iupacName} label="Nom IUPAC" />
                    <ProgressIndicator {...report.classification.formula} label="Formule Chimique" />
                    <ProgressIndicator {...report.classification.olfactiveProfile} label="Profil Olfactif" />
                  </CardContent>
                </Card>

                {/* Linking Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Liaisons entre Entités</CardTitle>
                    <CardDescription>
                      Couverture des relations dans la base de données
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ProgressIndicator {...report.linking.overall} label="Liaisons Globales" />
                    <ProgressIndicator {...report.linking.moleculeRecette} label="Molécule → Recette" />
                    <ProgressIndicator {...report.linking.moleculePlant} label="Molécule → Plante" />
                    <ProgressIndicator {...report.linking.plantTerroir} label="Plante → Terroir" />
                  </CardContent>
                </Card>

                {/* Entity Growth */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Croissance des Entités</CardTitle>
                    <CardDescription>
                      Évolution du nombre d'entrées dans la base de données
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                      {[
                        { label: 'Molécules', data: report.entities.molecules, color: 'bg-blue-500' },
                        { label: 'Recettes', data: report.entities.recettes, color: 'bg-green-500' },
                        { label: 'Plantes', data: report.entities.plants, color: 'bg-amber-500' },
                        { label: 'Terroirs', data: report.entities.terroirs, color: 'bg-purple-500' },
                        { label: 'Accords', data: report.entities.accords, color: 'bg-pink-500' },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-4 rounded-lg bg-muted/50">
                          <div className={`h-2 w-2 rounded-full ${item.color} mx-auto mb-2`} />
                          <p className="text-2xl font-bold">{item.data.end}</p>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <Badge 
                            variant={item.data.change > 0 ? "default" : "secondary"}
                            className="mt-2"
                          >
                            {item.data.change >= 0 ? '+' : ''}{item.data.change}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          </TabErrorBoundary>

          {/* Projection Tab */}
          <TabErrorBoundary>
          <TabsContent value="projection" className="space-y-4">
            {report?.projection ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Projection à 10 ans
                    </CardTitle>
                    <CardDescription>
                      Estimation basée sur la tendance actuelle
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Progression quotidienne</span>
                        <span className="font-medium">
                          {report.projection.dailyProgress >= 0 ? '+' : ''}
                          {typeof report.projection?.dailyProgress === 'number' ? report.projection.dailyProgress.toFixed(4) : '0.0000'}%/jour
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date de complétion estimée</span>
                        <span className="font-medium">
                          {report.projection.projectedCompletionDate 
                            ? format(new Date(report.projection.projectedCompletionDate), 'dd MMM yyyy', { locale: fr })
                            : 'Non estimable'
                          }
                        </span>
                      </div>
                      {report.projection.daysToComplete !== Infinity && (
                        <p className="text-xs text-muted-foreground">
                          Dans environ {Math.round(report.projection.daysToComplete / 365)} an(s) et {report.projection.daysToComplete % 365} jours
                        </p>
                      )}
                    </div>

                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <h4 className="font-medium mb-2">Projection au {format(new Date(report.projection.tenYearProjection.date), 'dd MMM yyyy', { locale: fr })}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={report.projection.tenYearProjection.estimatedClassificationRate} className="h-3" />
                        </div>
                        <span className="text-lg font-bold">
                          {typeof report.projection?.tenYearProjection?.estimatedClassificationRate === 'number' ? report.projection.tenYearProjection.estimatedClassificationRate.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Taux de classification estimé dans 10 ans
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations</CardTitle>
                    <CardDescription>
                      Actions suggérées pour améliorer la progression
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {report.classification.casNumber.end < 50 && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <h4 className="font-medium text-amber-700 dark:text-amber-400">Numéros CAS manquants</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Seulement {typeof report.classification?.casNumber?.end === 'number' ? report.classification.casNumber.end.toFixed(0) : '0'}% des molécules ont un numéro CAS. 
                            Utilisez PubChem pour enrichir automatiquement ces données.
                          </p>
                        </div>
                      )}
                      
                      {report.classification.family.end < 50 && (
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <h4 className="font-medium text-blue-700 dark:text-blue-400">Classification par famille</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {typeof report.classification?.family?.end === 'number' ? (100 - report.classification.family.end).toFixed(0) : '0'}% des molécules n'ont pas de famille assignée.
                            Utilisez l'interface de classification en masse.
                          </p>
                        </div>
                      )}

                      {report.linking.moleculeRecette.end < 50 && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <h4 className="font-medium text-green-700 dark:text-green-400">Liaisons Molécule-Recette</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Utilisez l'auto-liaison pour connecter automatiquement les molécules aux recettes.
                          </p>
                        </div>
                      )}

                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <h4 className="font-medium text-purple-700 dark:text-purple-400">Snapshots réguliers</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Créez un snapshot chaque semaine pour un meilleur suivi de la progression.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Données insuffisantes</h3>
                  <p className="text-muted-foreground mt-2">
                    Créez plusieurs snapshots pour générer des projections
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          </TabErrorBoundary>

          {/* History Tab */}
          <TabErrorBoundary>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Snapshots</CardTitle>
                <CardDescription>
                  {snapshots.length} snapshot(s) enregistré(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {snapshotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : snapshots.length === 0 ? (
                  <div className="py-12 text-center">
                    <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun snapshot enregistré</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 border-b grid grid-cols-6 gap-4 text-sm font-medium">
                      <span>Date</span>
                      <span>Molécules</span>
                      <span>Classification</span>
                      <span>Liaisons</span>
                      <span>Famille</span>
                      <span>Notes</span>
                    </div>
                    <div className="divide-y max-h-[400px] overflow-y-auto">
                      {snapshots.map((snapshot) => (
                        <div key={snapshot.id} className="px-4 py-3 grid grid-cols-6 gap-4 text-sm hover:bg-muted/30">
                          <span className="font-medium">
                            {format(new Date(snapshot.snapshotDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </span>
                          <span>{snapshot.totalMolecules}</span>
                          <span>
                            <Badge variant="outline">
                              {typeof snapshot?.overallClassificationRate === 'number' ? (snapshot.overallClassificationRate / 100).toFixed(1) : '0.0'}%
                            </Badge>
                          </span>
                          <span>
                            <Badge variant="outline">
                              {typeof snapshot?.overallLinkingRate === 'number' ? (snapshot.overallLinkingRate / 100).toFixed(1) : '0.0'}%
                            </Badge>
                          </span>
                          <span>
                            {Math.round((snapshot.moleculesWithFamily / snapshot.totalMolecules) * 100)}%
                          </span>
                          <span className="text-muted-foreground truncate">
                            {snapshot.notes || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline Chart Placeholder */}
            {report?.snapshots && report.snapshots.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Évolution dans le Temps</CardTitle>
                  <CardDescription>
                    Graphique de progression de la classification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end gap-1">
                    {report.snapshots.slice(-30).map((s, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-primary/80 rounded-t hover:bg-primary transition-colors"
                        style={{ height: `${s.classificationRate}%` }}
                        title={`${format(new Date(s.date), 'dd/MM/yyyy')}: ${typeof s?.classificationRate === 'number' ? s.classificationRate.toFixed(1) : '0.0'}%`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{format(new Date(report.snapshots[Math.max(0, report.snapshots.length - 30)].date), 'dd/MM/yyyy')}</span>
                    <span>{format(new Date(report.snapshots[report.snapshots.length - 1].date), 'dd/MM/yyyy')}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          </TabErrorBoundary>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
