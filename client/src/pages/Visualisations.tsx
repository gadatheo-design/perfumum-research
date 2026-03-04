// @ts-nocheck
/**
 * Page Visualisations — Hub central de toutes les visualisations PERFUMUM
 * Organise les graphes, cartes, timelines et diagrammes par catégorie
 */

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Network, 
  Map, 
  BarChart3, 
  Clock, 
  Layers, 
  GitBranch, 
  Radar, 
  Grid3X3,
  Flame,
  BookOpen,
  Leaf,
  FlaskConical,
  Globe,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface VisualizationItem {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

const VISUALIZATIONS: Record<string, VisualizationItem[]> = {
  graphes: [
    {
      title: "Graphe Molécules-Recettes",
      description: "Réseau interactif des connexions entre molécules et recettes avec force D3.js",
      path: "/graphe-molecules-recettes",
      icon: <Network className="h-6 w-6" />,
      tags: ["D3.js", "Interactif", "Molécules", "Recettes"],
      isFeatured: true
    },
    {
      title: "Graphe Plante-Molécule",
      description: "Visualisation des relations entre plantes et leurs molécules constitutives",
      path: "/graphe-plante-molecule",
      icon: <Leaf className="h-6 w-6" />,
      tags: ["D3.js", "Plantes", "Molécules"]
    },
    {
      title: "Graphe Terroir-Plante-Molécule",
      description: "Réseau tricouche reliant terroirs, plantes et molécules",
      path: "/graphe-terroir-plante-molecule",
      icon: <Globe className="h-6 w-6" />,
      tags: ["D3.js", "Terroirs", "Plantes", "Molécules"]
    },
    {
      title: "Graphe Relations Globales",
      description: "Vue d'ensemble de toutes les relations entre entités PERFUMUM",
      path: "/graphe-relations",
      icon: <GitBranch className="h-6 w-6" />,
      tags: ["D3.js", "Global", "Relations"]
    },
    {
      title: "Graphe Synergies Moléculaires",
      description: "Visualisation des synergies et compatibilités entre molécules",
      path: "/graphe-synergies",
      icon: <Sparkles className="h-6 w-6" />,
      tags: ["D3.js", "Synergies", "Chimie"],
      isNew: true
    },
    {
      title: "Graphe Familles Chimiques",
      description: "Organisation des molécules par familles chimiques",
      path: "/graphe-familles-chimiques",
      icon: <FlaskConical className="h-6 w-6" />,
      tags: ["D3.js", "Familles", "Chimie"]
    },
    {
      title: "Graphe Molécules-Familles",
      description: "Connexions entre molécules et leurs familles chimiques",
      path: "/graphe-molecules-familles-chimiques",
      icon: <Layers className="h-6 w-6" />,
      tags: ["D3.js", "Molécules", "Familles"]
    },
    {
      title: "Graphe Axes Thématiques",
      description: "Visualisation des axes de recherche thématiques",
      path: "/graphe-axes-thematiques",
      icon: <BookOpen className="h-6 w-6" />,
      tags: ["D3.js", "Recherche", "Axes"]
    },
    {
      title: "Graphe Références-Axes",
      description: "Connexions entre références bibliographiques et axes thématiques",
      path: "/graphe-references-axes",
      icon: <BookOpen className="h-6 w-6" />,
      tags: ["D3.js", "Bibliographie", "Axes"],
      isNew: true
    },
    {
      title: "Réseau de Recettes",
      description: "Réseau des recettes connectées par molécules communes",
      path: "/recipe-network",
      icon: <Network className="h-6 w-6" />,
      tags: ["D3.js", "Recettes", "Réseau"]
    }
  ],
  cartes: [
    {
      title: "Carte Interactive Terroirs",
      description: "Carte mondiale des terroirs avec marqueurs interactifs",
      path: "/carte-interactive-terroirs",
      icon: <Map className="h-6 w-6" />,
      tags: ["Google Maps", "Terroirs", "Interactif"],
      isFeatured: true
    },
    {
      title: "Carte Terroirs-Plantes",
      description: "Visualisation géographique des plantes par terroir",
      path: "/carte-terroirs-plantes",
      icon: <Leaf className="h-6 w-6" />,
      tags: ["Google Maps", "Terroirs", "Plantes"]
    },
    {
      title: "Carte Plantes GPS",
      description: "Localisation précise des plantes avec coordonnées GPS",
      path: "/carte-plantes-gps",
      icon: <Map className="h-6 w-6" />,
      tags: ["Google Maps", "GPS", "Plantes"]
    },
    {
      title: "Carte Origines",
      description: "Origines géographiques des matières premières",
      path: "/outils/carte-origines",
      icon: <Globe className="h-6 w-6" />,
      tags: ["Google Maps", "Origines", "Sourcing"]
    },
    {
      title: "Carte Variétés",
      description: "Distribution géographique des variétés botaniques",
      path: "/carte-varietes",
      icon: <Leaf className="h-6 w-6" />,
      tags: ["Google Maps", "Variétés", "Botanique"]
    },
    {
      title: "Carte Terroirs Recherche",
      description: "Terroirs avec focus sur les données de recherche",
      path: "/carte-terroirs-recherche",
      icon: <Map className="h-6 w-6" />,
      tags: ["Google Maps", "Recherche", "Terroirs"]
    }
  ],
  diagrammes: [
    {
      title: "Sankey Flow",
      description: "Diagramme de flux Sankey montrant les relations entre entités",
      path: "/sankey-flow",
      icon: <TrendingUp className="h-6 w-6" />,
      tags: ["D3.js", "Flux", "Relations"],
      isFeatured: true
    },
    {
      title: "Heatmap Synergies",
      description: "Matrice de chaleur des synergies moléculaires",
      path: "/synergies-heatmap",
      icon: <Grid3X3 className="h-6 w-6" />,
      tags: ["D3.js", "Heatmap", "Synergies"]
    },
    {
      title: "Heatmap Corrélations",
      description: "Corrélations entre profils radar des molécules",
      path: "/heatmap-correlations",
      icon: <Flame className="h-6 w-6" />,
      tags: ["D3.js", "Heatmap", "Corrélations"]
    },
    {
      title: "Visualisations Corrélation",
      description: "Ensemble de visualisations de corrélations",
      path: "/outils/visualisations-correlation",
      icon: <BarChart3 className="h-6 w-6" />,
      tags: ["Charts", "Corrélations", "Analyse"]
    }
  ],
  radars: [
    {
      title: "Radar Enrichi",
      description: "Radar interactif avec comparaison multi-entités",
      path: "/enhanced-radar",
      icon: <Radar className="h-6 w-6" />,
      tags: ["Radar", "Comparaison", "Interactif"],
      isFeatured: true
    },
    {
      title: "Comparaison Radar",
      description: "Comparer les profils radar de plusieurs entités",
      path: "/compare-radar",
      icon: <Radar className="h-6 w-6" />,
      tags: ["Radar", "Comparaison", "Multi"]
    },
    {
      title: "Glossaire Visuel Radar",
      description: "Guide visuel des axes du radar PERFUMUM",
      path: "/glossaire-visuel-radar",
      icon: <BookOpen className="h-6 w-6" />,
      tags: ["Radar", "Guide", "Éducatif"]
    },
    {
      title: "Comparaison Terpènes",
      description: "Profils terpéniques comparés en radar",
      path: "/terp-profiles/compare",
      icon: <Radar className="h-6 w-6" />,
      tags: ["Radar", "Terpènes", "Comparaison"]
    }
  ],
  timelines: [
    {
      title: "Timeline PERFUMUM",
      description: "Chronologie du projet PERFUMUM",
      path: "/projet/timeline",
      icon: <Clock className="h-6 w-6" />,
      tags: ["Timeline", "Projet", "Histoire"],
      isFeatured: true
    },
    {
      title: "Timeline Interactive",
      description: "Timeline interactive avec filtres et zoom",
      path: "/timeline/interactive",
      icon: <Clock className="h-6 w-6" />,
      tags: ["Timeline", "Interactif", "Filtres"]
    },
    {
      title: "Timeline Botanique",
      description: "Chronologie des découvertes botaniques",
      path: "/timeline-botanique",
      icon: <Leaf className="h-6 w-6" />,
      tags: ["Timeline", "Botanique", "Découvertes"]
    },
    {
      title: "Timeline Recettes",
      description: "Évolution chronologique des recettes",
      path: "/timeline-recettes",
      icon: <FlaskConical className="h-6 w-6" />,
      tags: ["Timeline", "Recettes", "Évolution"]
    }
  ],
  comparaisons: [
    {
      title: "Comparaison Molécules",
      description: "Comparer plusieurs molécules côte à côte",
      path: "/compare",
      icon: <BarChart3 className="h-6 w-6" />,
      tags: ["Comparaison", "Molécules", "Détaillé"],
      isFeatured: true
    },
    {
      title: "Comparaison Avancée",
      description: "Comparaison multi-critères avancée",
      path: "/compare-molecules-advanced",
      icon: <BarChart3 className="h-6 w-6" />,
      tags: ["Comparaison", "Avancé", "Multi-critères"]
    },
    {
      title: "Comparaison Terpènes",
      description: "Comparer les profils terpéniques",
      path: "/compare-terpenes",
      icon: <FlaskConical className="h-6 w-6" />,
      tags: ["Comparaison", "Terpènes", "Profils"]
    },
    {
      title: "Comparaison Recettes",
      description: "Comparer plusieurs recettes",
      path: "/compare-recettes",
      icon: <Layers className="h-6 w-6" />,
      tags: ["Comparaison", "Recettes", "Analyse"]
    },
    {
      title: "Comparaison Plantes",
      description: "Comparer les caractéristiques des plantes",
      path: "/compare-plants",
      icon: <Leaf className="h-6 w-6" />,
      tags: ["Comparaison", "Plantes", "Botanique"]
    }
  ]
};

const CATEGORY_INFO: Record<string, { title: string; description: string; icon: React.ReactNode; color: string }> = {
  graphes: {
    title: "Graphes de Force",
    description: "Réseaux interactifs D3.js visualisant les connexions entre entités",
    icon: <Network className="h-5 w-5" />,
    color: "from-purple-500/20 to-purple-600/10"
  },
  cartes: {
    title: "Cartes Géographiques",
    description: "Visualisations cartographiques des terroirs et origines",
    icon: <Map className="h-5 w-5" />,
    color: "from-emerald-500/20 to-emerald-600/10"
  },
  diagrammes: {
    title: "Diagrammes & Heatmaps",
    description: "Flux Sankey, matrices de chaleur et corrélations",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "from-amber-500/20 to-amber-600/10"
  },
  radars: {
    title: "Radars & Profils",
    description: "Visualisations radar des profils olfactifs",
    icon: <Radar className="h-5 w-5" />,
    color: "from-cyan-500/20 to-cyan-600/10"
  },
  timelines: {
    title: "Timelines",
    description: "Chronologies interactives du projet et des découvertes",
    icon: <Clock className="h-5 w-5" />,
    color: "from-rose-500/20 to-rose-600/10"
  },
  comparaisons: {
    title: "Comparaisons",
    description: "Outils de comparaison multi-entités",
    icon: <Layers className="h-5 w-5" />,
    color: "from-indigo-500/20 to-indigo-600/10"
  }
};

function VisualizationCard({ item }: { item: VisualizationItem }) {
  return (
    <Link href={item.path}>
      <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {item.icon}
            </div>
            <div className="flex gap-1">
              {item.isNew && (
                <Badge variant="default" className="bg-green-500 text-white text-xs">
                  Nouveau
                </Badge>
              )}
              {item.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  Populaire
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
            <span>Explorer</span>
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CategorySection({ categoryKey, items }: { categoryKey: string; items: VisualizationItem[] }) {
  const info = CATEGORY_INFO[categoryKey];
  
  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl bg-gradient-to-r ${info.color} border`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/80">
            {info.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{info.title}</h2>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {items.length} visualisations
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <VisualizationCard key={item.path} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Visualisations() {
  const totalVisualizations = Object.values(VISUALIZATIONS).flat().length;
  const featuredItems = Object.values(VISUALIZATIONS).flat().filter(item => item.isFeatured);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumbs />
          
          {/* Hero Section */}
          <section className="py-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Hub Visualisations</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Explorez les données{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                visuellement
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {totalVisualizations} visualisations interactives pour explorer les molécules, 
              recettes, terroirs et connexions du projet PERFUMUM
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                  {info.icon}
                  <span className="text-sm font-medium">{VISUALIZATIONS[key].length}</span>
                  <span className="text-sm text-muted-foreground">{info.title}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Featured Section */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-semibold">Visualisations populaires</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredItems.slice(0, 6).map((item) => (
                <VisualizationCard key={item.path} item={item} />
              ))}
            </div>
          </section>
          
          {/* Tabs by Category */}
          <section className="py-8">
            <Tabs defaultValue="graphes" className="space-y-8">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border"
                  >
                    <span className="flex items-center gap-2">
                      {info.icon}
                      {info.title}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {VISUALIZATIONS[key].length}
                      </Badge>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(VISUALIZATIONS).map(([key, items]) => (
                <TabsContent key={key} value={key} className="mt-8">
                  <CategorySection categoryKey={key} items={items} />
                </TabsContent>
              ))}
            </Tabs>
          </section>
          
          {/* All Visualizations Grid */}
          <section className="py-8 border-t">
            <h2 className="text-2xl font-semibold mb-6">Toutes les visualisations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(VISUALIZATIONS).flat().map((item) => (
                <Link key={item.path} href={item.path}>
                  <Card className="group cursor-pointer hover:border-primary/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.tags[0]}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
