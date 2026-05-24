// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Database,
  FlaskConical,
  Beaker,
  BookOpen,
  Sparkles,
  Activity,
  Calendar,
  Radar,
  Target,
  Zap,
  Leaf,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Search,
  Heart,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar as RechartsRadar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { AnimatedCounter, ProgressIndicator, PulseDot, StatusBadge } from "@/components/ui/feedback";
import { DashboardSkeleton } from "@/components/skeletons";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Couleurs pour les graphiques
const COLORS = [
  "oklch(0.65 0.2 140)", // Vert
  "oklch(0.65 0.2 220)", // Bleu
  "oklch(0.65 0.2 280)", // Violet
  "oklch(0.65 0.2 60)",  // Jaune
  "oklch(0.65 0.2 20)",  // Orange
  "oklch(0.65 0.2 340)", // Rose
  "oklch(0.65 0.2 180)", // Cyan
  "oklch(0.65 0.2 100)", // Lime
];

// Labels des axes radar
const RADAR_AXES = [
  { key: "intensity", label: "Intensité", fullMark: 100 },
  { key: "freshness", label: "Fraîcheur", fullMark: 100 },
  { key: "warmth", label: "Chaleur", fullMark: 100 },
  { key: "sweetness", label: "Douceur", fullMark: 100 },
  { key: "spiciness", label: "Épicé", fullMark: 100 },
  { key: "earthiness", label: "Terreux", fullMark: 100 },
];

// Composant KPI Card
interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  isLoading?: boolean;
}

function KPICard({ title, value, previousValue, icon, color, suffix = "", isLoading }: KPICardProps) {
  const trend = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const trendIcon = trend > 0 ? <ArrowUp className="h-3 w-3" /> : trend < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />;
  const trendColor = trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground";

  return (
    <Card className="card-interactive">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <span className="text-3xl font-bold">
                    <AnimatedCounter value={value} />
                    {suffix}
                  </span>
                )}
              </div>
            </div>
          </div>
          {previousValue !== undefined && !isLoading && (
            <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
              {trendIcon}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour le graphique radar des profils moyens
function AverageRadarChart({ molecules }: { molecules: any[] }) {
  const averageData = useMemo(() => {
    if (!molecules || molecules?.length === 0) return [];

    const sums = {
      intensity: 0,
      freshness: 0,
      warmth: 0,
      sweetness: 0,
      spiciness: 0,
      earthiness: 0,
    };
    let count = 0;

    molecules?.forEach(m => {
      if (m.radarIntensity !== null) {
        sums.intensity += m.radarIntensity || 0;
        sums.freshness += m.radarFreshness || 0;
        sums.warmth += m.radarWarmth || 0;
        sums.sweetness += m.radarSweetness || 0;
        sums.spiciness += m.radarSpiciness || 0;
        sums.earthiness += m.radarEarthiness || 0;
        count++;
      }
    });

    if (count === 0) return [];

    return RADAR_AXES.map(axis => ({
      axis: axis.label,
      value: Math.round(sums[axis.key as keyof typeof sums] / count),
      fullMark: axis.fullMark,
    }));
  }, [molecules]);

  if (averageData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Aucune donnée radar disponible
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={averageData}>
        <PolarGrid stroke="oklch(0.5 0.02 280 / 0.3)" />
        <PolarAngleAxis 
          dataKey="axis" 
          tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 10 }}
        />
        <RechartsRadar
          name="Profil moyen"
          dataKey="value"
          stroke="oklch(0.55 0.25 280)"
          fill="oklch(0.55 0.25 280)"
          fillOpacity={0.3}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// Composant pour le graphique de distribution des familles
function FamilyDistributionChart({ molecules }: { molecules: any[] }) {
  const data = useMemo(() => {
    if (!molecules) return [];
    
    const distribution: Record<string, number> = {};
    molecules?.forEach(m => {
      const family = m.family || "Non classé";
      distribution[family] = (distribution[family] || 0) + 1;
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }));
  }, [molecules]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

// Composant pour l'évolution temporelle
function TimelineChart({ data }: { data: { month: string; molecules: number; recettes: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorMolecules" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.65 0.2 140)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="oklch(0.65 0.2 140)" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorRecettes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.65 0.2 220)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="oklch(0.65 0.2 220)" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 280)" />
        <XAxis dataKey="month" tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <YAxis tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="molecules" 
          name="Molécules"
          stroke="oklch(0.65 0.2 140)" 
          fillOpacity={1} 
          fill="url(#colorMolecules)" 
        />
        <Area 
          type="monotone" 
          dataKey="recettes" 
          name="Recettes"
          stroke="oklch(0.65 0.2 220)" 
          fillOpacity={1} 
          fill="url(#colorRecettes)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Composant pour les statistiques par catégorie de recettes
function RecetteCategoryChart({ recettes }: { recettes: any[] }) {
  const data = useMemo(() => {
    if (!recettes) return [];
    
    const distribution: Record<string, number> = {};
    recettes?.forEach(r => {
      const category = r.category || "Autre";
      distribution[category] = (distribution[category] || 0) + 1;
    });

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));
  }, [recettes]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 280)" />
        <XAxis type="number" tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 12 }} />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={120}
          tick={{ fill: "oklch(0.5 0.02 280)", fontSize: 11 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "oklch(0.98 0 0)", 
            border: "1px solid oklch(0.85 0.01 280)",
            borderRadius: "8px"
          }}
        />
        <Bar 
          dataKey="value" 
          name="Recettes"
          fill="oklch(0.55 0.25 280)" 
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Composant pour les activités récentes
function RecentActivityList({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "molecule_view": return <Eye className="h-4 w-4" />;
      case "recipe_view": return <Beaker className="h-4 w-4" />;
      case "search_query": return <Search className="h-4 w-4" />;
      case "favorite_add": return <Heart className="h-4 w-4" />;
      case "pdf_export": return <Download className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "molecule_view": return "Molécule consultée";
      case "recipe_view": return "Recette consultée";
      case "search_query": return "Recherche effectuée";
      case "favorite_add": return "Ajouté aux favoris";
      case "pdf_export": return "Export PDF";
      default: return "Activité";
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune activité récente
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 10).map((activity, index) => (
        <div 
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {getActivityIcon(activity.eventType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {getActivityLabel(activity.eventType)}
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.metadata ? (safeJsonParse(activity.metadata, {}) as any).moleculeName || (safeJsonParse(activity.metadata, {}) as any).recipeName || "—" : "—"}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(activity.createdAt).toLocaleDateString("fr-FR", { 
              day: "numeric", 
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Page principale
export default function AnalyticsDashboardAdvanced() {
  const [timeRange, setTimeRange] = useState("30");
  
  // Récupérer les données
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules?.list.useQuery();
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes?.list.useQuery();
  const { data: statistics } = trpc.analytics.getStatistics.useQuery();
  const { data: dashboardStats } = trpc.analytics.getDashboardStats.useQuery({ days: parseInt(timeRange) });
  const { data: activityTimeline } = trpc.analytics.getActivityTimeline.useQuery({ days: parseInt(timeRange) });
  const { data: mostViewedMolecules } = trpc.analytics.getMostViewedMolecules.useQuery({ days: parseInt(timeRange), limit: 5 });
  const { data: mostViewedRecipes } = trpc.analytics.getMostViewedRecipes.useQuery({ days: parseInt(timeRange), limit: 5 });
  const { data: popularSearches } = trpc.analytics.getPopularSearches.useQuery({ days: parseInt(timeRange), limit: 5 });

  const isLoading = loadingMolecules || loadingRecettes;

  // Calculer les statistiques de complétion radar
  const radarStats = useMemo(() => {
    if (!molecules) return { complete: 0, incomplete: 0, percentage: 0 };
    
    let complete = 0;
    let incomplete = 0;
    
    molecules?.forEach(m => {
      if (m.radarIntensity !== null && m.radarIntensity > 0) {
        complete++;
      } else {
        incomplete++;
      }
    });

    return {
      complete,
      incomplete,
      percentage: molecules?.length > 0 ? Math.round((complete / molecules?.length) * 100) : 0,
    };
  }, [molecules]);

  // Données d'évolution temporelle
  const timelineData = statistics?.monthlyData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 container py-8">
          <DashboardSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Activity className="h-3 w-3 mr-1" />
                  Analytics
                </Badge>
                <PulseDot variant="success" size="sm" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Tableau de Bord Analytique
              </h1>
              <p className="text-muted-foreground mt-1">
                Vue d'ensemble des données et métriques du projet PERFUMUM
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 derniers jours</SelectItem>
                  <SelectItem value="30">30 derniers jours</SelectItem>
                  <SelectItem value="90">90 derniers jours</SelectItem>
                  <SelectItem value="365">Cette année</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              title="Molécules"
              value={molecules?.length || 0}
              previousValue={undefined}
              icon={<FlaskConical className="h-6 w-6 text-green-600" />}
              color="bg-green-100 dark:bg-green-900/30"
              isLoading={isLoading}
            />
            <KPICard
              title="Recettes"
              value={recettes?.length || 0}
              previousValue={undefined}
              icon={<Beaker className="h-6 w-6 text-blue-600" />}
              color="bg-blue-100 dark:bg-blue-900/30"
              isLoading={isLoading}
            />
            <KPICard
              title="Profils Radar"
              value={radarStats.complete}
              icon={<Radar className="h-6 w-6 text-purple-600" />}
              color="bg-purple-100 dark:bg-purple-900/30"
              suffix={`/${molecules?.length || 0}`}
              isLoading={isLoading}
            />
            <KPICard
              title="Complétion"
              value={radarStats.percentage}
              icon={<Target className="h-6 w-6 text-amber-600" />}
              color="bg-amber-100 dark:bg-amber-900/30"
              suffix="%"
              isLoading={isLoading}
            />
          </div>

          {/* Onglets principaux */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="molecules">Molécules</TabsTrigger>
              <TabsTrigger value="recettes">Recettes</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            {/* Onglet Vue d'ensemble */}
            <TabErrorBoundary>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Graphique radar moyen */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Radar className="h-5 w-5 text-primary" />
                      Profil Olfactif Moyen
                    </CardTitle>
                    <CardDescription>
                      Moyenne des profils radar de toutes les molécules documentées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AverageRadarChart molecules={molecules || []} />
                  </CardContent>
                </Card>

                {/* Distribution des familles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Distribution par Famille
                    </CardTitle>
                    <CardDescription>
                      Répartition des molécules par famille chimique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FamilyDistributionChart molecules={molecules || []} />
                  </CardContent>
                </Card>
              </div>

              {/* Évolution temporelle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Évolution du Projet
                  </CardTitle>
                  <CardDescription>
                    Croissance de la base de données au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TimelineChart data={timelineData} />
                </CardContent>
              </Card>

              {/* Progression de la complétion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Progression de la Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Profils radar complets</span>
                        <span className="font-medium">{radarStats.complete}/{molecules?.length || 0}</span>
                      </div>
                      <ProgressIndicator 
                        value={radarStats.complete} 
                        max={molecules?.length || 1} 
                        variant="success"
                        showPercentage={false}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Molécules avec CAS</span>
                        <span className="font-medium">
                          {molecules?.filter(m => m.casNumber).length || 0}/{molecules?.length || 0}
                        </span>
                      </div>
                      <ProgressIndicator 
                        value={molecules?.filter(m => m.casNumber).length || 0} 
                        max={molecules?.length || 1} 
                        variant="default"
                        showPercentage={false}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Recettes documentées</span>
                        <span className="font-medium">{recettes?.length || 0}</span>
                      </div>
                      <ProgressIndicator 
                        value={recettes?.length || 0} 
                        max={300} 
                        variant="default"
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            </TabErrorBoundary>

            {/* Onglet Molécules */}
            <TabErrorBoundary>
            <TabsContent value="molecules" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Molécules les Plus Consultées</CardTitle>
                    <CardDescription>Top 5 sur les {timeRange} derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mostViewedMolecules && mostViewedMolecules?.length > 0 ? (
                      <div className="space-y-3">
                        {mostViewedMolecules?.map((item: any, index: number) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.family}</p>
                            </div>
                            <Badge variant="secondary">{item.viewCount} vues</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profil Radar Moyen</CardTitle>
                    <CardDescription>Caractéristiques olfactives moyennes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AverageRadarChart molecules={molecules || []} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Distribution par Famille Chimique</CardTitle>
                </CardHeader>
                <CardContent>
                  <FamilyDistributionChart molecules={molecules || []} />
                </CardContent>
              </Card>
            </TabsContent>
            </TabErrorBoundary>

            {/* Onglet Recettes */}
            <TabErrorBoundary>
            <TabsContent value="recettes" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recettes les Plus Consultées</CardTitle>
                    <CardDescription>Top 5 sur les {timeRange} derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mostViewedRecipes && mostViewedRecipes?.length > 0 ? (
                      <div className="space-y-3">
                        {mostViewedRecipes?.map((item: any, index: number) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                            <Badge variant="secondary">{item.viewCount} vues</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recettes par Catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecetteCategoryChart recettes={recettes || []} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            </TabErrorBoundary>

            {/* Onglet Activité */}
            <TabErrorBoundary>
            <TabsContent value="activity" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité Récente</CardTitle>
                    <CardDescription>Dernières interactions avec la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivityList activities={activityTimeline || []} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recherches Populaires</CardTitle>
                    <CardDescription>Termes les plus recherchés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {popularSearches && popularSearches?.length > 0 ? (
                      <div className="space-y-3">
                        {popularSearches?.map((search: any, index: number) => (
                          <div 
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1 font-medium">{search.query}</span>
                            <Badge variant="outline">{search.count} fois</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune recherche enregistrée
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            </TabErrorBoundary>
          </Tabs>

          {/* Voir aussi */}
          <div className="mt-12">
            <VoirAussi 
              title="Explorer les données"
              variant="compact"
              items={[
                {
                  title: "Molécules",
                  description: "Base de données complète",
                  href: "/molecules",
                  badge: String(molecules?.length || 0),
                },
                {
                  title: "Recettes",
                  description: "Formulations expérimentales",
                  href: "/recettes",
                  badge: String(recettes?.length || 0),
                },
                {
                  title: "Statistiques",
                  description: "Analyses détaillées",
                  href: "/statistiques",
                },
                {
                  title: "Administration",
                  description: "Gérer les données",
                  href: "/admin",
                },
              ]}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
