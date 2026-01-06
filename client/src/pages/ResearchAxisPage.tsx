import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import {
  Dna,
  BookOpen,
  Beaker,
  FlaskConical,
  Glasses,
  Handshake,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  Database,
  FileText,
  Map,
  Users,
  Award,
  Microscope,
  Leaf,
  Globe,
  TrendingUp,
  Clock,
  Target,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ResearchRadarChart } from "@/components/ResearchRadarChart";

// Types pour les axes de recherche
interface ResearchAxis {
  id: number;
  axis_id: string;
  slug: string;
  title_fr: string;
  title_en?: string;
  tagline_fr?: string;
  tagline_en?: string;
  description_fr?: string;
  description_en?: string;
  default_layout?: string;
  status: string;
  color: string;
  icon?: string;
  sort_order: number;
  kpis?: any;
  ui_modules?: string[];
  core_entities?: string[];
  default_filters?: any;
}

// Mapping des icônes
const iconMap: Record<string, React.ReactNode> = {
  Dna: <Dna className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  Beaker: <Beaker className="h-6 w-6" />,
  FlaskConical: <FlaskConical className="h-6 w-6" />,
  Glasses: <Glasses className="h-6 w-6" />,
  Handshake: <Handshake className="h-6 w-6" />,
};

// Données statiques enrichies pour chaque axe
const axisDetails: Record<string, {
  modules: string[];
  exports: string;
  keyEntities: { icon: React.ReactNode; label: string; count?: number }[];
  kpis: { label: string; target: string; current?: string }[];
}> = {
  AX1_GENOMIC_CONSERVATION: {
    modules: [
      "Species Threat Card",
      "Genome Sample Card",
      "Genome Sequence Card",
      "Cryobank Log",
      "Resurrection Story",
    ],
    exports: "Submission package (ZIP): samples.csv + sequences.csv + protocol.md + manifest.json",
    keyEntities: [
      { icon: <Dna className="h-4 w-4" />, label: "Échantillons génomiques" },
      { icon: <Database className="h-4 w-4" />, label: "Séquences déposées" },
      { icon: <Leaf className="h-4 w-4" />, label: "Espèces prioritaires" },
    ],
    kpis: [
      { label: "Espèces séquencées", target: "10 (An 1)" },
      { label: "Gènes TPS identifiés", target: "50+" },
      { label: "Échantillons cryoconservés", target: "500" },
    ],
  },
  AX2_ETHNOBOTANY_COMP: {
    modules: [
      "Manuscript Profile",
      "Fragment annoté",
      "Knowledge graph",
      "Routes + timeline",
    ],
    exports: "Evidence bundle: fragments.json + entities.csv + provenance.md",
    keyEntities: [
      { icon: <FileText className="h-4 w-4" />, label: "Manuscrits numérisés" },
      { icon: <BookOpen className="h-4 w-4" />, label: "Fragments annotés" },
      { icon: <Map className="h-4 w-4" />, label: "Routes commerciales" },
    ],
    kpis: [
      { label: "Manuscrits traités", target: "200+ (An 3)" },
      { label: "Entités extraites", target: "10,000+" },
      { label: "Routes cartographiées", target: "50+" },
    ],
  },
  AX3_ANALYTICAL_TRANS_EPOCH: {
    modules: [
      "Herbarium sample",
      "GC-MS run",
      "Fingerprint Diff",
      "Terroir card",
      "Projection 2050/2100",
    ],
    exports: "Dataset + figure pack",
    keyEntities: [
      { icon: <Microscope className="h-4 w-4" />, label: "Échantillons d'herbier" },
      { icon: <Beaker className="h-4 w-4" />, label: "Analyses GC-MS" },
      { icon: <TrendingUp className="h-4 w-4" />, label: "Projections climatiques" },
    ],
    kpis: [
      { label: "Profils GC-MS", target: "100+ (An 2)" },
      { label: "Comparaisons trans-époques", target: "50+" },
      { label: "Terroirs documentés", target: "20+" },
    ],
  },
  AX4_CONSERVATION_BIOTECH: {
    modules: [
      "Biobank dashboard",
      "Protocoles micropropagation",
      "Fermentation runs",
      "Ethics/Substitution notes",
    ],
    exports: "SOP pack (protocols) + runs.csv",
    keyEntities: [
      { icon: <FlaskConical className="h-4 w-4" />, label: "Lignées de culture" },
      { icon: <Beaker className="h-4 w-4" />, label: "Fermentations" },
      { icon: <Leaf className="h-4 w-4" />, label: "Molécules biotech" },
    ],
    kpis: [
      { label: "Lignées actives", target: "30+" },
      { label: "Molécules produites", target: "10+" },
      { label: "Protocoles validés", target: "20+" },
    ],
  },
  AX5_IMMERSIVE_DEMOCRAT: {
    modules: [
      "VR Scene",
      "Blend library",
      "Citizen map",
      "Modules pédagogiques",
    ],
    exports: "scene.json + cue list + blends.csv",
    keyEntities: [
      { icon: <Glasses className="h-4 w-4" />, label: "Scènes VR" },
      { icon: <Users className="h-4 w-4" />, label: "Observations citoyennes" },
      { icon: <Globe className="h-4 w-4" />, label: "Modules éducatifs" },
    ],
    kpis: [
      { label: "Scènes VR créées", target: "10+" },
      { label: "Observations validées", target: "1,000+" },
      { label: "Visiteurs/an", target: "10,000+" },
    ],
  },
  AX6_OLFACTIVE_DIPLOMACY: {
    modules: [
      "Partners directory",
      "Fellowship pipeline",
      "Impact dashboard",
      "Co-publication ledger",
    ],
    exports: "Partnership briefs (MD) + KPI snapshot",
    keyEntities: [
      { icon: <Handshake className="h-4 w-4" />, label: "Partenaires institutionnels" },
      { icon: <Award className="h-4 w-4" />, label: "Bourses de recherche" },
      { icon: <FileText className="h-4 w-4" />, label: "Co-publications" },
    ],
    kpis: [
      { label: "Partenariats actifs", target: "10+" },
      { label: "Bourses attribuées", target: "5+/an" },
      { label: "Publications", target: "3+/an" },
    ],
  },
};

// Les statistiques sont maintenant chargées dynamiquement via tRPC

export default function ResearchAxisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch research axes from database
  const { data: axes, isLoading } = trpc.perfumumAxes.list.useQuery();
  
  // Fetch real statistics from database
  const { data: axesStatsData } = trpc.axesStats.getAll.useQuery();
  
  // Build stats map from real data
  const axisStats = useMemo(() => {
    if (!axesStatsData) return {};
    return axesStatsData.reduce((acc, axis) => {
      acc[axis.axisId] = { total: axis.totalCount, recent: 0 };
      return acc;
    }, {} as Record<string, { total: number; recent: number }>);
  }, [axesStatsData]);

  // Filter axes
  const filteredAxes = useMemo(() => {
    if (!axes) return [];
    return axes.filter((axis: ResearchAxis) => {
      const matchesSearch =
        searchQuery === "" ||
        axis.title_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        axis.tagline_fr?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || axis.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [axes, searchQuery, selectedStatus]);

  // Calculate total stats from real data
  const totalStats = useMemo(() => {
    if (!axesStatsData) return { total: 0, recent: 0 };
    return axesStatsData.reduce(
      (acc, axis) => ({
        total: acc.total + axis.totalCount,
        recent: acc.recent,
      }),
      { total: 0, recent: 0 }
    );
  }, [axesStatsData]);

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Layers className="h-6 w-6" />;
    return iconMap[iconName] || <Layers className="h-6 w-6" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      draft: { label: "Brouillon", variant: "outline" },
      mvp: { label: "MVP", variant: "default" },
      active: { label: "Actif", variant: "default" },
      archived: { label: "Archivé", variant: "secondary" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            { label: "Axes de recherche PERFUMUM" },
          ]}
        />

        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Axes de Recherche PERFUMUM</h1>
              <p className="text-muted-foreground">
                6 axes stratégiques pour la préservation du patrimoine olfactif mondial
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-indigo-600">{filteredAxes.length}</div>
                <div className="text-sm text-muted-foreground">Axes de recherche</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-emerald-600">{totalStats.total}</div>
                <div className="text-sm text-muted-foreground">Entrées totales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-amber-600">{totalStats.recent}</div>
                <div className="text-sm text-muted-foreground">Ajouts récents</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-purple-600">2035</div>
                <div className="text-sm text-muted-foreground">Horizon vision</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails par axe</TabsTrigger>
            <TabsTrigger value="radar">Graphique Radar</TabsTrigger>
            <TabsTrigger value="vision">Vision 2035</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un axe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Axes Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAxes.map((axis: ResearchAxis) => {
                  const details = axisDetails[axis.axis_id];
                  const stats = axisStats[axis.axis_id] || { total: 0, recent: 0 };
                  
                  return (
                    <Card
                      key={axis.id}
                      className="group hover:shadow-lg transition-all duration-300 border-l-4"
                      style={{ borderLeftColor: axis.color }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div
                            className="p-2 rounded-lg text-white"
                            style={{ backgroundColor: axis.color }}
                          >
                            {getIcon(axis.icon)}
                          </div>
                          {getStatusBadge(axis.status)}
                        </div>
                        <CardTitle className="text-lg mt-3">{axis.title_fr}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {axis.tagline_fr}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Key Entities */}
                        {details && (
                          <div className="space-y-2 mb-4">
                            {details.keyEntities.slice(0, 3).map((entity, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                {entity.icon}
                                <span>{entity.label}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm border-t pt-3">
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                              <Database className="h-4 w-4 inline mr-1" />
                              {stats.total} entrées
                            </span>
                            {stats.recent > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                +{stats.recent} récent
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <Link href={`/axes-recherche-perfumum/${axis.slug}`}>
                          <Button
                            variant="ghost"
                            className="w-full mt-4 group-hover:bg-accent"
                          >
                            Explorer l'axe
                            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              {filteredAxes.map((axis: ResearchAxis) => {
                const details = axisDetails[axis.axis_id];
                
                return (
                  <Card key={axis.id} className="overflow-hidden">
                    <div
                      className="h-2"
                      style={{ backgroundColor: axis.color }}
                    />
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg text-white"
                          style={{ backgroundColor: axis.color }}
                        >
                          {getIcon(axis.icon)}
                        </div>
                        <div className="flex-1">
                          <CardTitle>{axis.title_fr}</CardTitle>
                          <CardDescription>{axis.tagline_fr}</CardDescription>
                        </div>
                        {getStatusBadge(axis.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Modules */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Modules de contenu
                          </h4>
                          <ul className="space-y-2">
                            {details?.modules.map((module, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                {module}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* KPIs */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Indicateurs clés
                          </h4>
                          <ul className="space-y-2">
                            {details?.kpis.map((kpi, idx) => (
                              <li key={idx} className="text-sm">
                                <span className="text-muted-foreground">{kpi.label}:</span>{" "}
                                <span className="font-medium">{kpi.target}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Export */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Export (valeur)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {details?.exports}
                          </p>
                          <Link href={`/axes-recherche-perfumum/${axis.slug}`}>
                            <Button variant="outline" size="sm" className="mt-4">
                              Accéder aux données
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="radar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Répartition des ressources par axe
                </CardTitle>
                <CardDescription>
                  Visualisation de la distribution des données de recherche entre les 6 axes stratégiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                {axesStatsData && axesStatsData.length > 0 ? (
                  <ResearchRadarChart data={axesStatsData} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Chargement des données...
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Détail des ressources par axe */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {axesStatsData?.map((axis) => (
                <Card key={axis.axisId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: axis.color }}
                      />
                      <CardTitle className="text-sm">{axis.titleFr}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: axis.color }}>
                      {axis.totalCount}
                    </div>
                    <p className="text-xs text-muted-foreground">ressources</p>
                    <div className="mt-3 space-y-1">
                      {Object.entries(axis.entityCounts).map(([key, count]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ').replace('perfumum ', '')}
                          </span>
                          <span className="font-medium">{count as number}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={`/axes-recherche-perfumum/${axis.axisId}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        Voir détail
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vision" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600" />
                  PERFUMUM 2.0 — Une infrastructure mondiale (2035-2050)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Network */}
                <div>
                  <h4 className="font-semibold mb-3 text-emerald-600">
                    🌐 Réseau de conservation distribué
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 10+ jardins botaniques partenaires avec collections miroirs</li>
                    <li>• 50+ producteurs intégrés avec monitoring temps réel</li>
                    <li>• Base de données interconnectée avec GBIF, IUCN, Kew Gardens</li>
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">
                    🔬 Technologies avancées
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• IA pour prédiction évolution profils olfactifs selon climat</li>
                    <li>• Blockchain pour traçabilité et certificats d'authenticité</li>
                    <li>• Biobanques de tissus cryoconservés (-196°C) pour restauration écosystèmes</li>
                  </ul>
                </div>

                {/* Recognition */}
                <div>
                  <h4 className="font-semibold mb-3 text-amber-600">
                    🏆 Reconnaissance internationale
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Label UNESCO "Patrimoine Olfactif de l'Humanité"</li>
                    <li>• Intégration dans stratégies nationales biodiversité (CBD)</li>
                    <li>• Standard ISO pour conservation et documentation des patrimoines olfactifs</li>
                  </ul>
                </div>

                {/* Timeline */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-4">Jalons clés</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-indigo-600">2026</div>
                      <div className="text-sm text-muted-foreground">MVP 6 axes</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-emerald-600">2030</div>
                      <div className="text-sm text-muted-foreground">10 partenaires</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-amber-600">2035</div>
                      <div className="text-sm text-muted-foreground">Label UNESCO</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-purple-600">2050</div>
                      <div className="text-sm text-muted-foreground">Standard ISO</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
